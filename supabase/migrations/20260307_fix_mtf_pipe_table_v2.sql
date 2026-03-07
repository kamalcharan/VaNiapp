-- Fix 52 MTF questions using pipe-delimited table format.
--
-- Root cause: text has "Column II" appearing TWICE:
--   1. Intro: "Match Column I (Terms) with Column II (Definitions):"
--   2. Table header: "Column I | Column II"
-- Previous parsers used non-greedy .*? which stripped to the FIRST occurrence,
-- leaving "Column I | Column II A. text | 1. text ..." as body — which broke
-- the segment-based extraction.
--
-- Fix: use GREEDY regex to strip to the LAST "Column II", then match
-- complete row pairs "A. leftText | 1. rightText" directly.

-- ═══════════════════════════════════════════════════════════════
-- Helper: parse pipe-delimited MTF rows
-- Uses greedy .* to find the LAST "Column II/B/2" header,
-- then extracts row pairs with "letter. text | number. text"
-- ═══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION _parse_mtf_pipe_rows(q_text TEXT)
RETURNS TABLE(col_a JSONB, col_b JSONB) AS $$
DECLARE
  body TEXT;
  m TEXT[];
  columnA JSONB := '[]'::JSONB;
  columnB JSONB := '[]'::JSONB;
BEGIN
  -- GREEDY .* strips up to the LAST "Column II/B/2" header
  -- This skips the intro mention and finds the actual table header
  body := regexp_replace(q_text,
    '^.*(?:\*\*\s*)?[Cc]olumn\s*[-–]?\s*(?:[Ii]{2}|2|[Bb])\s*(?:\*\*)?\s*(?:\([^)]*\))?\s*[:\-–|]?\s*',
    '');

  IF body = q_text OR length(trim(body)) < 5 THEN
    col_a := '[]'::JSONB;
    col_b := '[]'::JSONB;
    RETURN NEXT;
    RETURN;
  END IF;

  -- Match complete row pairs: "A. leftText | 1. rightText"
  -- The non-greedy (.+?) for right text stops at the next "X. " letter-item or end
  FOR m IN
    SELECT regexp_matches(body,
      '([A-Z])\.\s+(.+?)\s*\|\s*(\d+)\.\s+(.+?)(?=\s+[A-Z]\.\s|$)', 'g')
  LOOP
    columnA := columnA || jsonb_build_array(
      jsonb_build_object('id', m[1], 'text', trim(m[2]), 'textTe', '')
    );
    columnB := columnB || jsonb_build_array(
      jsonb_build_object('id', m[3], 'text', trim(m[4]), 'textTe', '')
    );
  END LOOP;

  -- Fallback: try parenthesized row pairs "(A) leftText | (1) rightText"
  IF jsonb_array_length(columnA) < 2 THEN
    columnA := '[]'::JSONB;
    columnB := '[]'::JSONB;
    FOR m IN
      SELECT regexp_matches(body,
        '\(([A-Z])\)\s+(.+?)\s*\|\s*\((\d+)\)\s+(.+?)(?=\s+\([A-Z]\)\s|$)', 'g')
    LOOP
      columnA := columnA || jsonb_build_array(
        jsonb_build_object('id', m[1], 'text', trim(m[2]), 'textTe', '')
      );
      columnB := columnB || jsonb_build_array(
        jsonb_build_object('id', m[3], 'text', trim(m[4]), 'textTe', '')
      );
    END LOOP;
  END IF;

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
    -- Strategy 1: pipe row-pair parser
    SELECT p.col_a, p.col_b INTO parsed
    FROM _parse_mtf_pipe_rows(q.question_text) p;

    -- Strategy 2: fallback to existing column-split parser
    IF jsonb_array_length(COALESCE(parsed.col_a, '[]'::JSONB)) < 2
       OR jsonb_array_length(COALESCE(parsed.col_b, '[]'::JSONB)) < 2 THEN
      DECLARE
        split RECORD;
      BEGIN
        SELECT s.col1_body, s.col2_body INTO split
        FROM _split_mtf_columns(q.question_text) s;

        IF split.col1_body IS NOT NULL AND split.col2_body IS NOT NULL THEN
          DECLARE
            ca JSONB;
            cb JSONB;
          BEGIN
            ca := _extract_mtf_items(split.col1_body);
            cb := _extract_mtf_items(split.col2_body);
            IF jsonb_array_length(ca) >= 2 AND jsonb_array_length(cb) >= 2 THEN
              parsed.col_a := ca;
              parsed.col_b := cb;
            END IF;
          END;
        END IF;
      END;
    END IF;

    -- Skip if still can't parse
    IF jsonb_array_length(COALESCE(parsed.col_a, '[]'::JSONB)) < 2
       OR jsonb_array_length(COALESCE(parsed.col_b, '[]'::JSONB)) < 2 THEN
      fail_ids := fail_ids || q.id;
      skip_count := skip_count + 1;
      RAISE NOTICE 'SKIP %: colA=%, colB=%, text=%',
        q.id,
        jsonb_array_length(COALESCE(parsed.col_a, '[]'::JSONB)),
        jsonb_array_length(COALESCE(parsed.col_b, '[]'::JSONB)),
        left(q.question_text, 120);
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

  RAISE NOTICE '══════════════════════════════════════════════════════';
  RAISE NOTICE 'MTF pipe-table fix v2: % fixed, % skipped', fixed_count, skip_count;
  IF array_length(fail_ids, 1) > 0 THEN
    RAISE NOTICE 'PARSE failures (%): %', array_length(fail_ids, 1),
      array_to_string(fail_ids, ', ');
  END IF;
  RAISE NOTICE '══════════════════════════════════════════════════════';
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
SELECT id, left(question_text, 250) AS text_preview
FROM med_questions
WHERE question_type = 'match-the-following'
  AND (payload->'columnA' IS NULL
       OR jsonb_array_length(COALESCE(payload->'columnA', '[]'::JSONB)) = 0)
  AND (payload->'column_a' IS NULL
       OR jsonb_array_length(COALESCE(payload->'column_a', '[]'::JSONB)) = 0)
LIMIT 10;

-- Sample a fixed question to verify data looks correct
SELECT id,
  jsonb_array_length(payload->'columnA') AS col_a_count,
  jsonb_array_length(payload->'columnB') AS col_b_count,
  payload->'columnA'->0 AS first_col_a,
  payload->'columnB'->0 AS first_col_b,
  payload->'correctMapping' AS mapping
FROM med_questions
WHERE question_type = 'match-the-following'
  AND jsonb_array_length(COALESCE(payload->'columnA', '[]'::JSONB)) > 0
ORDER BY updated_at DESC NULLS LAST
LIMIT 3;

-- Cleanup
DROP FUNCTION IF EXISTS _parse_mtf_pipe_rows(TEXT);
