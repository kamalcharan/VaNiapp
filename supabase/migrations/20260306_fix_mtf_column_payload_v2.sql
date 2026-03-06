-- Fix MTF questions missing columnA/columnB in payload (v2).
-- v1 had a bug: filtered on payload->>'type' which is NOT set —
-- the type lives in the question_type column, not in the payload JSONB.
--
-- This migration parses question_text to extract structured column data
-- and stores it in the payload so the mobile drag-and-drop UI works.
-- Safe to run multiple times (idempotent).

-- ═══════════════════════════════════════════════════════════════
-- Helper: extract labeled items from a text section
-- Handles: (P) text, (Q) text  OR  A. text, B. text  formats
-- Works with both multi-line and single-line text
-- ═══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION _extract_mtf_items(body TEXT)
RETURNS JSONB AS $$
DECLARE
  items JSONB := '[]'::JSONB;
  m TEXT[];
BEGIN
  -- Strategy 1: Parenthesized format — (P) text, (Q) text, (i) text, (ii) text
  FOR m IN
    SELECT regexp_matches(body, '\(([A-Za-z0-9]+(?:i{1,3}v?|v)?)\)\s*([^(]+?)(?=\s*\([A-Za-z0-9]|$)', 'g')
  LOOP
    items := items || jsonb_build_array(
      jsonb_build_object('id', trim(m[1]), 'text', trim(m[2]), 'textTe', '')
    );
  END LOOP;

  IF jsonb_array_length(items) >= 2 THEN
    RETURN items;
  END IF;

  -- Strategy 2: Dotted format on separate lines — A. text\nB. text
  items := '[]'::JSONB;
  FOR m IN
    SELECT regexp_matches(body, '(?:^|\n)\s*([A-Za-z0-9]+)\.\s+(.+?)(?=\n\s*[A-Za-z0-9]+\.|$)', 'gn')
  LOOP
    items := items || jsonb_build_array(
      jsonb_build_object('id', trim(m[1]), 'text', trim(m[2]), 'textTe', '')
    );
  END LOOP;

  IF jsonb_array_length(items) >= 2 THEN
    RETURN items;
  END IF;

  -- Strategy 3: Dotted format on single line — A. text B. text C. text
  -- Match: uppercase letter + dot + space + text until next letter+dot or end
  items := '[]'::JSONB;
  FOR m IN
    SELECT regexp_matches(body, '([A-Z])\.\s+(.+?)(?=\s+[A-Z]\.\s|$)', 'g')
  LOOP
    items := items || jsonb_build_array(
      jsonb_build_object('id', trim(m[1]), 'text', trim(m[2]), 'textTe', '')
    );
  END LOOP;

  IF jsonb_array_length(items) >= 2 THEN
    RETURN items;
  END IF;

  -- Strategy 4: Numbered on single line — 1. text 2. text 3. text
  items := '[]'::JSONB;
  FOR m IN
    SELECT regexp_matches(body, '(\d+)\.\s+(.+?)(?=\s+\d+\.\s|$)', 'g')
  LOOP
    items := items || jsonb_build_array(
      jsonb_build_object('id', trim(m[1]), 'text', trim(m[2]), 'textTe', '')
    );
  END LOOP;

  RETURN items;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ═══════════════════════════════════════════════════════════════
-- Helper: parse option mapping text
-- "A-2, B-3, C-4, D-1" → {"A":"2", "B":"3", "C":"4", "D":"1"}
-- Also handles: "P-ii, Q-iv" and "A→2, B→3"
-- ═══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION _parse_option_mapping(opt_text TEXT)
RETURNS JSONB AS $$
DECLARE
  mapping JSONB := '{}'::JSONB;
  m TEXT[];
  parts TEXT[];
  part TEXT;
BEGIN
  parts := regexp_split_to_array(opt_text, '[,;]\s*');
  FOR i IN 1..COALESCE(array_length(parts, 1), 0) LOOP
    part := trim(parts[i]);
    m := regexp_matches(part, '^([A-Za-z0-9]+)\s*[-–→=]\s*\(?([A-Za-z0-9]+(?:i{1,3}v?|v)?)\)?$');
    IF m IS NOT NULL AND array_length(m, 1) >= 2 THEN
      mapping := mapping || jsonb_build_object(trim(m[1]), trim(m[2]));
    END IF;
  END LOOP;
  RETURN mapping;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ═══════════════════════════════════════════════════════════════
-- Main: parse and backfill columnA, columnB, correctMapping
-- KEY FIX: uses question_type column, NOT payload->>'type'
-- ═══════════════════════════════════════════════════════════════
DO $$
DECLARE
  q RECORD;
  q_text TEXT;
  col1_body TEXT;
  col2_body TEXT;
  col_a JSONB;
  col_b JSONB;
  mapping JSONB;
  fixed_count INT := 0;
  skip_count INT := 0;
  parse_fail_ids TEXT[] := '{}';
  split_fail_ids TEXT[] := '{}';
BEGIN
  FOR q IN
    SELECT
      mq.id::TEXT AS id,
      mq.question_text,
      mq.payload,
      mq.correct_answer,
      (SELECT mqo.option_text
       FROM med_question_options mqo
       WHERE mqo.question_id = mq.id
         AND (mqo.is_correct = true OR mqo.option_key = mq.correct_answer)
       LIMIT 1) AS correct_option_text
    FROM med_questions mq
    WHERE mq.question_type = 'match-the-following'   -- FIX: use question_type column
      AND (mq.payload->'columnA' IS NULL
           OR jsonb_array_length(COALESCE(mq.payload->'columnA', '[]'::JSONB)) = 0)
  LOOP
    q_text := q.question_text;

    -- ── Split text into Column I and Column II sections ──
    -- Try multiple split patterns for Column II header
    col2_body := NULL;
    col1_body := NULL;

    -- Pattern 1: "Column II:" or "Column-II:" or "Column II -" (case insensitive)
    IF q_text ~* 'column\s*[-–]?\s*(ii|2|b)\s*[-–:.]' THEN
      col1_body := (regexp_split_to_array(q_text, '(?i)column\s*[-–]?\s*(?:ii|2|b)\s*[-–:.]'))[1];
      col2_body := substring(q_text FROM '(?i)column\s*[-–]?\s*(?:ii|2|b)\s*[-–:.]\s*(.*)$');
    -- Pattern 2: "Column-II" without separator
    ELSIF q_text ~* 'column[-–](ii|2|b)' THEN
      col1_body := (regexp_split_to_array(q_text, '(?i)column[-–](?:ii|2|b)'))[1];
      col2_body := substring(q_text FROM '(?i)column[-–](?:ii|2|b)\s*(.*)$');
    -- Pattern 3: **Column II** (markdown bold)
    ELSIF q_text ~* '\*\*column\s*(ii|2|b)\*\*' THEN
      col1_body := (regexp_split_to_array(q_text, '(?i)\*\*column\s*(?:ii|2|b)\*\*'))[1];
      col2_body := substring(q_text FROM '(?i)\*\*column\s*(?:ii|2|b)\*\*\s*(.*)$');
    END IF;

    IF col2_body IS NULL OR col1_body IS NULL THEN
      split_fail_ids := split_fail_ids || q.id;
      skip_count := skip_count + 1;
      CONTINUE;
    END IF;

    -- Remove Column I header from col1_body
    col1_body := regexp_replace(col1_body, '(?i).*column\s*[-–]?\s*(?:i|1|a)\s*[-–:.]\s*', '');
    -- Also strip markdown bold Column I
    col1_body := regexp_replace(col1_body, '(?i).*\*\*column\s*(?:i|1|a)\*\*\s*', '');

    -- ── Extract items from each section ──
    col_a := _extract_mtf_items(col1_body);
    col_b := _extract_mtf_items(col2_body);

    IF jsonb_array_length(col_a) < 2 OR jsonb_array_length(col_b) < 2 THEN
      parse_fail_ids := parse_fail_ids || q.id;
      skip_count := skip_count + 1;
      CONTINUE;
    END IF;

    -- ── Derive correctMapping from correct option ──
    mapping := '{}'::JSONB;
    IF q.correct_option_text IS NOT NULL THEN
      mapping := _parse_option_mapping(q.correct_option_text);
    END IF;

    -- ── Update payload ──
    UPDATE med_questions
    SET payload = payload
      || jsonb_build_object('columnA', col_a)
      || jsonb_build_object('columnB', col_b)
      || jsonb_build_object('correctMapping', mapping)
    WHERE id = q.id::UUID;

    fixed_count := fixed_count + 1;
  END LOOP;

  RAISE NOTICE '══════════════════════════════════════════';
  RAISE NOTICE 'MTF payload fix: % fixed, % skipped', fixed_count, skip_count;
  IF array_length(split_fail_ids, 1) > 0 THEN
    RAISE NOTICE 'Split failures (no Column II found): %', array_to_string(split_fail_ids, ', ');
  END IF;
  IF array_length(parse_fail_ids, 1) > 0 THEN
    RAISE NOTICE 'Parse failures (<2 items extracted): %', array_to_string(parse_fail_ids, ', ');
  END IF;
  RAISE NOTICE '══════════════════════════════════════════';
END $$;

-- ═══════════════════════════════════════════════════════════════
-- Verify
-- ═══════════════════════════════════════════════════════════════
SELECT
  'MTF still missing columnA' AS status,
  COUNT(*) AS count
FROM med_questions
WHERE question_type = 'match-the-following'
  AND (payload->'columnA' IS NULL
       OR jsonb_array_length(COALESCE(payload->'columnA', '[]'::JSONB)) = 0);

-- Show sample of any remaining failures for debugging
SELECT
  id,
  left(question_text, 120) AS text_preview,
  payload->>'type' AS payload_type
FROM med_questions
WHERE question_type = 'match-the-following'
  AND (payload->'columnA' IS NULL
       OR jsonb_array_length(COALESCE(payload->'columnA', '[]'::JSONB)) = 0)
LIMIT 10;
