-- Fix 136 MTF questions that have column data in question_text but NOT in payload.
-- This migration parses question_text to extract columnA, columnB, correctMapping
-- and stores them in the payload JSONB so the mobile app's drag-and-drop UI works.
--
-- Safe to run multiple times (idempotent — only updates questions missing columnA).

-- ═══════════════════════════════════════════════════════════════
-- Helper function: extract labeled items from a text section
-- Handles formats: (P) text, (Q) text OR A. text, B. text
-- ═══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION _extract_mtf_items(body TEXT)
RETURNS JSONB AS $$
DECLARE
  items JSONB := '[]'::JSONB;
  m TEXT[];
  line TEXT;
  lines TEXT[];
  item_id TEXT;
  item_text TEXT;
BEGIN
  -- Strategy 1: Parenthesized format — (P) text, (Q) text, (i) text, (ii) text
  FOR m IN
    SELECT regexp_matches(body, '\(([A-Za-z0-9]+(?:i{1,3}v?|v)?)\)\s*([^\n(]+)', 'g')
  LOOP
    items := items || jsonb_build_array(
      jsonb_build_object('id', trim(m[1]), 'text', trim(m[2]), 'textTe', '')
    );
  END LOOP;

  IF jsonb_array_length(items) >= 2 THEN
    RETURN items;
  END IF;

  -- Strategy 2: Dotted format — A. text, B. text, 1. text, 2. text
  items := '[]'::JSONB;
  -- Split into lines and match "X. text" pattern
  lines := regexp_split_to_array(body, E'\n');
  FOR i IN 1..array_length(lines, 1) LOOP
    line := trim(lines[i]);
    -- Match: letter/number followed by dot and space
    m := regexp_matches(line, '^([A-Za-z0-9]+)\.\s+(.+)$');
    IF m IS NOT NULL AND array_length(m, 1) >= 2 THEN
      items := items || jsonb_build_array(
        jsonb_build_object('id', trim(m[1]), 'text', trim(m[2]), 'textTe', '')
      );
    END IF;
  END LOOP;

  IF jsonb_array_length(items) >= 2 THEN
    RETURN items;
  END IF;

  -- Strategy 3: Inline dotted within a single line
  -- e.g. "A. text B. text C. text" all on one line
  items := '[]'::JSONB;
  FOR m IN
    SELECT regexp_matches(body, '([A-Z])\.\s+([^A-Z]+?)(?=\s+[A-Z]\.|$)', 'g')
  LOOP
    items := items || jsonb_build_array(
      jsonb_build_object('id', trim(m[1]), 'text', trim(m[2]), 'textTe', '')
    );
  END LOOP;

  RETURN items;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ═══════════════════════════════════════════════════════════════
-- Helper function: parse option mapping text
-- "A-2, B-3, C-4, D-1" → {"A": "2", "B": "3", "C": "4", "D": "1"}
-- Also handles: "P-ii, Q-iv" and "A→2, B→3" and "1-b, 2-c"
-- ═══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION _parse_option_mapping(opt_text TEXT)
RETURNS JSONB AS $$
DECLARE
  mapping JSONB := '{}'::JSONB;
  m TEXT[];
  part TEXT;
  parts TEXT[];
BEGIN
  parts := regexp_split_to_array(opt_text, '[,;]\s*');
  FOR i IN 1..array_length(parts, 1) LOOP
    part := trim(parts[i]);
    -- Match: key separator value
    -- separator: -, –, →, ->, =
    m := regexp_matches(part, '^([A-Za-z0-9]+)\s*[-–→=]\s*\(?([A-Za-z0-9]+(?:i{1,3}v?|v)?)\)?$');
    IF m IS NOT NULL AND array_length(m, 1) >= 2 THEN
      mapping := mapping || jsonb_build_object(trim(m[1]), trim(m[2]));
    END IF;
  END LOOP;

  RETURN mapping;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ═══════════════════════════════════════════════════════════════
-- Main migration: parse and backfill columnA, columnB, correctMapping
-- ═══════════════════════════════════════════════════════════════
DO $$
DECLARE
  q RECORD;
  q_text TEXT;
  col1_body TEXT;
  col2_body TEXT;
  col_parts TEXT[];
  col_a JSONB;
  col_b JSONB;
  correct_opt TEXT;
  mapping JSONB;
  fixed_count INT := 0;
  skip_count INT := 0;
BEGIN
  FOR q IN
    SELECT
      mq.id,
      mq.question_text,
      mq.payload,
      mq.correct_answer,
      (SELECT mqo.option_text
       FROM med_question_options mqo
       WHERE mqo.question_id = mq.id
         AND (mqo.is_correct = true OR mqo.option_key = mq.correct_answer)
       LIMIT 1) AS correct_option_text
    FROM med_questions mq
    WHERE mq.payload->>'type' = 'match-the-following'
      AND (mq.payload->'columnA' IS NULL
           OR jsonb_array_length(COALESCE(mq.payload->'columnA', '[]'::JSONB)) = 0)
  LOOP
    q_text := q.question_text;

    -- Split text by Column II header
    col_parts := regexp_split_to_array(
      q_text,
      'column\s*[-–]?\s*(?:ii|II|2|b|B)\s*[:\-–]',
      'i'  -- case-insensitive flag not supported in split, use regexp alternatives
    );

    -- Try case-insensitive split manually
    col_parts := regexp_split_to_array(q_text, '(?i)column\s*[-–]?\s*(?:ii|2|b)\s*[:\-–]');

    IF array_length(col_parts, 1) < 2 THEN
      -- Try alternate pattern: "Column-II" without space
      col_parts := regexp_split_to_array(q_text, '(?i)column[-–](?:ii|2|b)\s*[:\-–]?');
    END IF;

    IF array_length(col_parts, 1) < 2 THEN
      skip_count := skip_count + 1;
      RAISE NOTICE 'SKIP (no Column II split): %', q.id;
      CONTINUE;
    END IF;

    -- Column I body: text between "Column I:" and "Column II:"
    col1_body := regexp_replace(col_parts[1], '(?i).*column\s*[-–]?\s*(?:i|1|a)\s*[:\-–]', '');
    col2_body := col_parts[2];

    -- Extract items
    col_a := _extract_mtf_items(col1_body);
    col_b := _extract_mtf_items(col2_body);

    IF jsonb_array_length(col_a) < 2 OR jsonb_array_length(col_b) < 2 THEN
      skip_count := skip_count + 1;
      RAISE NOTICE 'SKIP (parsed <2 items): % — colA=%, colB=%',
        q.id, jsonb_array_length(col_a), jsonb_array_length(col_b);
      CONTINUE;
    END IF;

    -- Derive correctMapping from the correct option text
    mapping := '{}'::JSONB;
    IF q.correct_option_text IS NOT NULL THEN
      mapping := _parse_option_mapping(q.correct_option_text);
    END IF;

    -- Update the payload
    UPDATE med_questions
    SET payload = payload
      || jsonb_build_object('columnA', col_a)
      || jsonb_build_object('columnB', col_b)
      || jsonb_build_object('correctMapping', mapping)
    WHERE id = q.id;

    fixed_count := fixed_count + 1;
  END LOOP;

  RAISE NOTICE 'MTF payload fix complete: % fixed, % skipped', fixed_count, skip_count;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- Verify results
-- ═══════════════════════════════════════════════════════════════
SELECT
  'MTF questions still missing columnA' AS status,
  COUNT(*) AS count
FROM med_questions
WHERE payload->>'type' = 'match-the-following'
  AND (payload->'columnA' IS NULL
       OR jsonb_array_length(COALESCE(payload->'columnA', '[]'::JSONB)) = 0);

-- ═══════════════════════════════════════════════════════════════
-- Cleanup helper functions (optional — keep if you want to re-run)
-- ═══════════════════════════════════════════════════════════════
-- DROP FUNCTION IF EXISTS _extract_mtf_items(TEXT);
-- DROP FUNCTION IF EXISTS _parse_option_mapping(TEXT);
