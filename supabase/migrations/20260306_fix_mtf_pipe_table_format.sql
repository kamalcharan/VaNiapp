-- Fix 52 chemistry MTF questions that use pipe-delimited table format.
-- Format: "Column I | Column II A. leftText | 1. rightText B. leftText | 2. rightText"
-- Previous migrations couldn't parse this because after splitting on "Column II",
-- the remaining body has BOTH columns interleaved with pipes, not separate bodies.
-- This migration splits each row by pipe to separate Column A and Column B items.

-- ═══════════════════════════════════════════════════════════════
-- Helper: parse pipe-delimited MTF table
-- ═══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION _parse_mtf_pipe_table(q_text TEXT)
RETURNS TABLE(col_a JSONB, col_b JSONB) AS $$
DECLARE
  body TEXT;
  segments TEXT[];
  seg TEXT;
  id_match TEXT[];
  columnA JSONB := '[]'::JSONB;
  columnB JSONB := '[]'::JSONB;
  i INT;
BEGIN
  -- Strip everything up to and including the table header "Column I | Column II"
  -- The header can have markdown bold (**Column I**), parenthesized descriptions, etc.
  body := regexp_replace(q_text,
    '(?i)^.*?(?:\*\*\s*)?column\s*[-–]?\s*(?:ii|II|2|b|B)\s*(?:\*\*)?\s*(?:\([^)]*\))?\s*',
    '');

  IF body = q_text OR length(trim(body)) < 5 THEN
    col_a := '[]'::JSONB;
    col_b := '[]'::JSONB;
    RETURN NEXT;
    RETURN;
  END IF;

  -- Split body by pipe characters
  segments := regexp_split_to_array(body, '\s*\|\s*');

  -- Process segments: letters (A-Z) go to columnA, numbers (1-9) go to columnB
  FOR i IN 1..COALESCE(array_length(segments, 1), 0) LOOP
    seg := trim(segments[i]);
    IF length(seg) < 1 THEN CONTINUE; END IF;

    -- Try "A. text" or "(A) text" format (letter = Column A)
    id_match := regexp_matches(seg, '^\s*(?:\(?([A-Za-z])\)?[.\s]+)(.+)$', 's');
    IF id_match IS NOT NULL AND array_length(id_match, 1) >= 2 THEN
      columnA := columnA || jsonb_build_array(
        jsonb_build_object('id', trim(id_match[1]), 'text', trim(id_match[2]), 'textTe', '')
      );
      CONTINUE;
    END IF;

    -- Try "1. text" or "(1) text" format (number = Column B)
    id_match := regexp_matches(seg, '^\s*(?:\(?(\d+)\)?[.\s]+)(.+)$', 's');
    IF id_match IS NOT NULL AND array_length(id_match, 1) >= 2 THEN
      columnB := columnB || jsonb_build_array(
        jsonb_build_object('id', trim(id_match[1]), 'text', trim(id_match[2]), 'textTe', '')
      );
      CONTINUE;
    END IF;

    -- Some segments might have BOTH a letter item and number item joined without pipe
    -- e.g. "Enthalpy of combustion B. Enthalpy of atomisation" (previous item's text + next item)
    -- This happens when pipes are inconsistent. Try to split on "A. " pattern within segment.
    DECLARE
      sub_ids TEXT[];
      sub_parts TEXT[];
      j INT;
    BEGIN
      -- Check for letter-dot patterns inside the segment
      sub_ids := ARRAY(SELECT (regexp_matches(seg, '(?:^|\s)([A-Z])\.\s', 'g'))[1]);
      IF array_length(sub_ids, 1) >= 1 THEN
        sub_parts := regexp_split_to_array(seg, '(?:^|\s)[A-Z]\.\s+');
        IF array_length(sub_parts, 1) > array_length(sub_ids, 1) THEN
          FOR j IN 1..array_length(sub_ids, 1) LOOP
            columnA := columnA || jsonb_build_array(
              jsonb_build_object('id', sub_ids[j], 'text', trim(sub_parts[j+1]), 'textTe', '')
            );
          END LOOP;
          CONTINUE;
        END IF;
      END IF;

      -- Check for number-dot patterns
      sub_ids := ARRAY(SELECT (regexp_matches(seg, '(?:^|\s)(\d+)\.\s', 'g'))[1]);
      IF array_length(sub_ids, 1) >= 1 THEN
        sub_parts := regexp_split_to_array(seg, '(?:^|\s)\d+\.\s+');
        IF array_length(sub_parts, 1) > array_length(sub_ids, 1) THEN
          FOR j IN 1..array_length(sub_ids, 1) LOOP
            columnB := columnB || jsonb_build_array(
              jsonb_build_object('id', sub_ids[j], 'text', trim(sub_parts[j+1]), 'textTe', '')
            );
          END LOOP;
          CONTINUE;
        END IF;
      END IF;
    END;
  END LOOP;

  col_a := columnA;
  col_b := columnB;
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ═══════════════════════════════════════════════════════════════
-- Main: fix all MTF questions still missing columnA
-- ═══════════════════════════════════════════════════════════════
DO $$
DECLARE
  q RECORD;
  parsed RECORD;
  mapping JSONB;
  fixed_count INT := 0;
  skip_count INT := 0;
  fail_ids TEXT[] := '{}';
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
    WHERE mq.question_type = 'match-the-following'
      AND (mq.payload->'columnA' IS NULL
           OR jsonb_array_length(COALESCE(mq.payload->'columnA', '[]'::JSONB)) = 0)
      AND (mq.payload->'column_a' IS NULL
           OR jsonb_array_length(COALESCE(mq.payload->'column_a', '[]'::JSONB)) = 0)
  LOOP
    -- Try pipe-table parser
    SELECT p.col_a, p.col_b INTO parsed
    FROM _parse_mtf_pipe_table(q.question_text) p;

    IF jsonb_array_length(parsed.col_a) < 2 OR jsonb_array_length(parsed.col_b) < 2 THEN
      -- Fallback: try the existing column-split parser
      DECLARE
        split RECORD;
        ca JSONB;
        cb JSONB;
      BEGIN
        SELECT s.col1_body, s.col2_body INTO split
        FROM _split_mtf_columns(q.question_text) s;

        IF split.col1_body IS NOT NULL AND split.col2_body IS NOT NULL THEN
          ca := _extract_mtf_items(split.col1_body);
          cb := _extract_mtf_items(split.col2_body);
          IF jsonb_array_length(ca) >= 2 AND jsonb_array_length(cb) >= 2 THEN
            parsed.col_a := ca;
            parsed.col_b := cb;
          END IF;
        END IF;
      END;
    END IF;

    IF jsonb_array_length(COALESCE(parsed.col_a, '[]'::JSONB)) < 2
       OR jsonb_array_length(COALESCE(parsed.col_b, '[]'::JSONB)) < 2 THEN
      fail_ids := fail_ids || q.id;
      skip_count := skip_count + 1;
      CONTINUE;
    END IF;

    -- Derive correctMapping
    mapping := '{}'::JSONB;
    IF q.correct_option_text IS NOT NULL THEN
      mapping := _parse_option_mapping(q.correct_option_text);
    END IF;

    -- Update payload
    UPDATE med_questions
    SET payload = payload
      || jsonb_build_object('columnA', parsed.col_a)
      || jsonb_build_object('columnB', parsed.col_b)
      || jsonb_build_object('correctMapping', mapping)
    WHERE id = q.id::UUID;

    fixed_count := fixed_count + 1;
  END LOOP;

  RAISE NOTICE '══════════════════════════════════════════';
  RAISE NOTICE 'MTF pipe-table fix: % fixed, % skipped', fixed_count, skip_count;
  IF array_length(fail_ids, 1) > 0 THEN
    RAISE NOTICE 'PARSE failures: %', array_to_string(fail_ids, ', ');
  END IF;
  RAISE NOTICE '══════════════════════════════════════════';
END $$;

-- ═══════════════════════════════════════════════════════════════
-- Verify
-- ═══════════════════════════════════════════════════════════════
SELECT 'MTF still missing columnA' AS status, COUNT(*) AS cnt
FROM med_questions
WHERE question_type = 'match-the-following'
  AND (payload->'columnA' IS NULL
       OR jsonb_array_length(COALESCE(payload->'columnA', '[]'::JSONB)) = 0)
  AND (payload->'column_a' IS NULL
       OR jsonb_array_length(COALESCE(payload->'column_a', '[]'::JSONB)) = 0);

-- Show any remaining failures with text preview
SELECT id, left(question_text, 200) AS text_preview
FROM med_questions
WHERE question_type = 'match-the-following'
  AND (payload->'columnA' IS NULL
       OR jsonb_array_length(COALESCE(payload->'columnA', '[]'::JSONB)) = 0)
  AND (payload->'column_a' IS NULL
       OR jsonb_array_length(COALESCE(payload->'column_a', '[]'::JSONB)) = 0)
LIMIT 10;

-- Cleanup
DROP FUNCTION IF EXISTS _parse_mtf_pipe_table(TEXT);
