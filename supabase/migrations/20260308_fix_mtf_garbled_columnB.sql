-- Fix MTF questions with garbled columnB data.
--
-- Root cause: The first MTF column-payload migration (20260306) didn't strip
-- "Select the correct match:\n(A) (i)–(r), (ii)–(s)..." from Column II text.
-- The parenthesized IDs inside MCQ option lines ((i), (r), (ii), (s), etc.)
-- were incorrectly extracted as column items, producing ~30 garbage entries
-- with text like ",", "–", or empty strings alongside the 4 real items.
--
-- Fix: Detect affected questions (columnB with >30% short-text items),
-- clear columnB and correctMapping, then re-parse from question_text using
-- the improved _extract_mtf_items (v3) and _split_mtf_columns functions.
--
-- Safe to run multiple times (idempotent).

-- ═══════════════════════════════════════════════════════════════
-- Step 1: Identify and clear garbled columnB data
-- ═══════════════════════════════════════════════════════════════
DO $$
DECLARE
  q RECORD;
  total_items INT;
  short_items INT;
  cleared_count INT := 0;
BEGIN
  FOR q IN
    SELECT id, payload
    FROM med_questions
    WHERE question_type = 'match-the-following'
      AND payload->'columnB' IS NOT NULL
      AND jsonb_array_length(COALESCE(payload->'columnB', '[]'::JSONB)) > 0
  LOOP
    total_items := jsonb_array_length(q.payload->'columnB');
    -- Count items with text ≤ 2 chars (garbled entries like ",", "–", "")
    SELECT COUNT(*) INTO short_items
    FROM jsonb_array_elements(q.payload->'columnB') AS elem
    WHERE length(trim(COALESCE(elem->>'text', ''))) <= 2;

    -- If >30% of items are garbled, clear columnB and correctMapping
    IF short_items::float / total_items > 0.3 THEN
      UPDATE med_questions
      SET payload = payload - 'columnB' - 'correctMapping'
      WHERE id = q.id;
      cleared_count := cleared_count + 1;
    END IF;
  END LOOP;

  RAISE NOTICE 'Cleared garbled columnB from % MTF questions', cleared_count;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- Step 2: Re-parse using existing _split_mtf_columns + _extract_mtf_items
-- (reusing functions from 20260307_fix_mtf_pipe_table_v2.sql)
-- ═══════════════════════════════════════════════════════════════

-- Recreate helpers (they may have been dropped by previous migrations)
CREATE OR REPLACE FUNCTION _fix_garbled_split_columns(q_text TEXT)
RETURNS TABLE(col1_body TEXT, col2_body TEXT) AS $$
DECLARE
  col_parts TEXT[];
  raw_col1 TEXT;
  raw_col2 TEXT;
BEGIN
  -- Split at "Column II:" (or List II, Column B, etc.)
  col_parts := regexp_split_to_array(
    q_text,
    '(?:column|list)\s*[-–]?\s*(?:ii|II|2|b|B)\s*(?:\([^)]*\))?\s*[:\-–]'
  );

  IF array_length(col_parts, 1) < 2 THEN
    col1_body := NULL;
    col2_body := NULL;
    RETURN NEXT;
    RETURN;
  END IF;

  -- Use LAST split part for Column II (handles multiple "Column II" mentions)
  raw_col1 := col_parts[array_length(col_parts, 1) - 1];
  raw_col2 := col_parts[array_length(col_parts, 1)];

  -- Strip "Column I:" header from col1
  col1_body := regexp_replace(raw_col1,
    '^.*(?:column|list)\s*[-–]?\s*(?:i|I|1|a|A)\s*(?:\([^)]*\))?\s*[:\-–]',
    '', 'is');

  -- Strip trailing "Select the correct match:" + MCQ options from col2
  col2_body := regexp_replace(raw_col2,
    E'\\n\\s*(?:select|choose|the correct|identify|pick)[^\\n]*(?:\\n[\\s\\S]*)?$',
    '', 'i');
  col2_body := regexp_replace(col2_body,
    E'\\n\\s*\\([A-D]\\)\\s*[\\s\\S]*$', '');

  RETURN NEXT;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION _fix_garbled_extract_items(body TEXT)
RETURNS JSONB AS $$
DECLARE
  items JSONB := '[]'::JSONB;
  item_ids TEXT[];
  parts TEXT[];
  i INT;
  m TEXT[];
BEGIN
  -- Strategy 1: Parenthesized uppercase — (P) text (Q) text
  item_ids := ARRAY(
    SELECT (regexp_matches(body, '\(([A-Z])\)', 'g'))[1]
  );
  IF array_length(item_ids, 1) >= 2 THEN
    parts := regexp_split_to_array(body, '\([A-Z]\)\s*');
    IF array_length(parts, 1) > array_length(item_ids, 1) THEN
      FOR i IN 1..array_length(item_ids, 1) LOOP
        items := items || jsonb_build_array(
          jsonb_build_object('id', item_ids[i], 'text', trim(parts[i+1]), 'textTe', '')
        );
      END LOOP;
      IF jsonb_array_length(items) >= 2 THEN RETURN items; END IF;
    END IF;
  END IF;

  -- Strategy 2: Parenthesized lowercase/roman — (i) text (p) text
  items := '[]'::JSONB;
  item_ids := ARRAY(
    SELECT (regexp_matches(body, '\(([a-z]+(?:i{1,3}v?|v)?)\)', 'g'))[1]
  );
  IF array_length(item_ids, 1) >= 2 THEN
    parts := regexp_split_to_array(body, '\([a-z]+(?:i{1,3}v?|v)?\)\s*');
    IF array_length(parts, 1) > array_length(item_ids, 1) THEN
      FOR i IN 1..array_length(item_ids, 1) LOOP
        items := items || jsonb_build_array(
          jsonb_build_object('id', item_ids[i], 'text', trim(parts[i+1]), 'textTe', '')
        );
      END LOOP;
      IF jsonb_array_length(items) >= 2 THEN RETURN items; END IF;
    END IF;
  END IF;

  -- Strategy 3: Dotted — A. text or 1. text
  items := '[]'::JSONB;
  FOR m IN
    SELECT regexp_matches(body, E'(?:^|\\n)\\s*([A-Za-z0-9]+)\\.\\s+(.+?)(?=\\n\\s*[A-Za-z0-9]+\\.|$)', 'gn')
  LOOP
    items := items || jsonb_build_array(
      jsonb_build_object('id', trim(m[1]), 'text', trim(m[2]), 'textTe', '')
    );
  END LOOP;

  RETURN items;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Parse option mapping: "(i)–(s), (ii)–(r)" → {"i": "s", "ii": "r"}
CREATE OR REPLACE FUNCTION _fix_garbled_parse_mapping(opt_text TEXT)
RETURNS JSONB AS $$
DECLARE
  mapping JSONB := '{}'::JSONB;
  m TEXT[];
  parts TEXT[];
  i INT;
BEGIN
  parts := regexp_split_to_array(opt_text, '[,;]\s*');
  FOR i IN 1..array_length(parts, 1) LOOP
    -- Handle parenthesized: (i)–(s), (ii)–(r)
    m := regexp_matches(trim(parts[i]),
      '^\(?([A-Za-z0-9]+(?:i{1,3}v?|v)?)\)?\s*[-–→=]\s*\(?([A-Za-z0-9]+(?:i{1,3}v?|v)?)\)?$');
    IF m IS NOT NULL AND array_length(m, 1) >= 2 THEN
      mapping := mapping || jsonb_build_object(trim(m[1]), trim(m[2]));
    END IF;
  END LOOP;
  RETURN mapping;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ═══════════════════════════════════════════════════════════════
-- Step 3: Re-parse and update questions missing columnB
-- ═══════════════════════════════════════════════════════════════
DO $$
DECLARE
  q RECORD;
  split RECORD;
  col_a JSONB;
  col_b JSONB;
  mapping JSONB;
  fixed_count INT := 0;
  skip_count INT := 0;
BEGIN
  FOR q IN
    SELECT
      mq.id,
      mq.question_text,
      mq.payload,
      (SELECT mqo.option_text
       FROM med_question_options mqo
       WHERE mqo.question_id = mq.id
         AND mqo.is_correct = true
       LIMIT 1) AS correct_option_text
    FROM med_questions mq
    WHERE mq.question_type = 'match-the-following'
      AND (mq.payload->'columnB' IS NULL
           OR jsonb_array_length(COALESCE(mq.payload->'columnB', '[]'::JSONB)) = 0)
  LOOP
    -- Parse using column split + extract (garbled questions are column format, not pipe)
    SELECT s.col1_body, s.col2_body INTO split
    FROM _fix_garbled_split_columns(q.question_text) s;

    IF split.col1_body IS NOT NULL AND split.col2_body IS NOT NULL THEN
      col_a := _fix_garbled_extract_items(split.col1_body);
      col_b := _fix_garbled_extract_items(split.col2_body);
    ELSE
      col_a := '[]'::JSONB;
      col_b := '[]'::JSONB;
    END IF;

    -- Skip if still can't parse
    IF jsonb_array_length(COALESCE(col_a, '[]'::JSONB)) < 2
       OR jsonb_array_length(COALESCE(col_b, '[]'::JSONB)) < 2 THEN
      skip_count := skip_count + 1;
      CONTINUE;
    END IF;

    -- Build correct mapping from option text
    mapping := '{}'::JSONB;
    IF q.correct_option_text IS NOT NULL THEN
      mapping := _fix_garbled_parse_mapping(q.correct_option_text);
    END IF;

    -- Update payload
    UPDATE med_questions
    SET payload = payload
      || jsonb_build_object('columnA', col_a)
      || jsonb_build_object('columnB', col_b)
      || jsonb_build_object('correctMapping', mapping)
    WHERE id = q.id;

    fixed_count := fixed_count + 1;
  END LOOP;

  RAISE NOTICE '══════════════════════════════════════════════════════════════';
  RAISE NOTICE 'MTF garbled-columnB fix: % re-parsed, % skipped', fixed_count, skip_count;
  RAISE NOTICE '══════════════════════════════════════════════════════════════';
END $$;

-- ═══════════════════════════════════════════════════════════════
-- Verify
-- ═══════════════════════════════════════════════════════════════
SELECT 'MTF still missing columnB' AS status, COUNT(*) AS cnt
FROM med_questions
WHERE question_type = 'match-the-following'
  AND (payload->'columnB' IS NULL
       OR jsonb_array_length(COALESCE(payload->'columnB', '[]'::JSONB)) = 0);

-- Cleanup
DROP FUNCTION IF EXISTS _fix_garbled_split_columns(TEXT);
DROP FUNCTION IF EXISTS _fix_garbled_extract_items(TEXT);
DROP FUNCTION IF EXISTS _fix_garbled_parse_mapping(TEXT);
