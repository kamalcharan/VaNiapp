-- Fix MTF questions missing columnA/columnB in payload (v3).
-- Fixes from v2: handles "Column II" appearing in intro sentence by
-- using the LAST occurrence, and more permissive item extraction.

-- ═══════════════════════════════════════════════════════════════
-- Helper: find the position of the LAST occurrence of a pattern
-- ═══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION _last_match_pos(haystack TEXT, pattern TEXT)
RETURNS INT AS $$
DECLARE
  pos INT := 0;
  search_from INT := 1;
  found_at INT;
BEGIN
  LOOP
    -- Find next occurrence starting from search_from
    found_at := position(lower(substring(haystack FROM search_from)) IN '');
    -- Use regexp to find match position
    SELECT m[1] INTO found_at
    FROM (SELECT regexp_matches(substring(haystack FROM search_from), pattern, 'i') AS m) sub;

    IF found_at IS NULL THEN
      -- No more matches; try a simpler approach
      EXIT;
    END IF;

    EXIT; -- we'll use a different approach below
  END LOOP;

  RETURN pos;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ═══════════════════════════════════════════════════════════════
-- Helper: split text into Column I body and Column II body
-- Uses the LAST "Column II" occurrence to handle intro mentions
-- ═══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION _split_mtf_columns(q_text TEXT)
RETURNS TABLE(col1_body TEXT, col2_body TEXT) AS $$
DECLARE
  parts TEXT[];
  n INT;
  raw_col1 TEXT;
  -- Multiple patterns to try for Column II header
  patterns TEXT[] := ARRAY[
    '(?i)(?:\*\*\s*)?column\s*[-–]?\s*(?:ii|2)\s*(?:\*\*)?\s*[-–:.(]',
    '(?i)(?:\*\*\s*)?column\s*[-–]?\s*(?:ii|2)\s*(?:\*\*)?',
    '(?i)column[-–](?:ii|2)'
  ];
  p TEXT;
BEGIN
  FOREACH p IN ARRAY patterns LOOP
    parts := regexp_split_to_array(q_text, p);
    n := array_length(parts, 1);
    IF n >= 2 THEN
      -- Use LAST part as Column II body
      col2_body := parts[n];
      -- Everything before last split = raw Column I area
      raw_col1 := array_to_string(parts[1:n-1], ' ');

      -- Strip everything up to the LAST "Column I" header
      -- Try multiple Column I patterns
      col1_body := regexp_replace(raw_col1,
        '(?i).*(?:\*\*\s*)?column\s*[-–]?\s*(?:i|1|a)\s*(?:\*\*)?\s*[-–:.(\s]',
        '', 'n');

      -- If stripping removed everything, use raw (minus intro sentence)
      IF col1_body IS NULL OR length(trim(col1_body)) < 3 THEN
        col1_body := raw_col1;
      END IF;

      RETURN NEXT;
      RETURN;
    END IF;
  END LOOP;

  -- No split found
  col1_body := NULL;
  col2_body := NULL;
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ═══════════════════════════════════════════════════════════════
-- Helper: extract labeled items from a text section
-- ═══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION _extract_mtf_items(body TEXT)
RETURNS JSONB AS $$
DECLARE
  items JSONB := '[]'::JSONB;
  m TEXT[];
  item_ids TEXT[];
  item_texts TEXT[];
  i INT;
  parts TEXT[];
  n INT;
BEGIN
  -- ── Strategy 1: Parenthesized — (P) text (Q) text ──
  -- Split body by parenthesized markers, then pair IDs with texts
  -- First extract all marker IDs
  item_ids := ARRAY(
    SELECT (regexp_matches(body, '\(([A-Z])\)', 'g'))[1]
  );
  IF array_length(item_ids, 1) >= 2 THEN
    -- Split by the markers to get text between them
    parts := regexp_split_to_array(body, '\([A-Z]\)\s*');
    -- parts[1] = text before first marker (discard), parts[2] = text of first item, etc.
    IF array_length(parts, 1) > array_length(item_ids, 1) THEN
      FOR i IN 1..array_length(item_ids, 1) LOOP
        items := items || jsonb_build_array(
          jsonb_build_object('id', item_ids[i], 'text', trim(parts[i+1]), 'textTe', '')
        );
      END LOOP;
      IF jsonb_array_length(items) >= 2 THEN RETURN items; END IF;
    END IF;
  END IF;

  -- ── Strategy 1b: Parenthesized lowercase/roman — (i) text (ii) text (p) text ──
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

  -- ── Strategy 1c: Parenthesized numbers — (1) text (2) text ──
  items := '[]'::JSONB;
  item_ids := ARRAY(
    SELECT (regexp_matches(body, '\((\d+)\)', 'g'))[1]
  );
  IF array_length(item_ids, 1) >= 2 THEN
    parts := regexp_split_to_array(body, '\(\d+\)\s*');
    IF array_length(parts, 1) > array_length(item_ids, 1) THEN
      FOR i IN 1..array_length(item_ids, 1) LOOP
        items := items || jsonb_build_array(
          jsonb_build_object('id', item_ids[i], 'text', trim(parts[i+1]), 'textTe', '')
        );
      END LOOP;
      IF jsonb_array_length(items) >= 2 THEN RETURN items; END IF;
    END IF;
  END IF;

  -- ── Strategy 2: Dotted with newlines — A. text\nB. text ──
  items := '[]'::JSONB;
  FOR m IN
    SELECT regexp_matches(body, E'(?:^|\\n)\\s*([A-Za-z0-9]+)\\.\\s+(.+?)(?=\\n\\s*[A-Za-z0-9]+\\.|$)', 'gn')
  LOOP
    items := items || jsonb_build_array(
      jsonb_build_object('id', trim(m[1]), 'text', trim(m[2]), 'textTe', '')
    );
  END LOOP;
  IF jsonb_array_length(items) >= 2 THEN RETURN items; END IF;

  -- ── Strategy 3: Dotted on single line — A. text B. text ──
  -- Split by "X. " pattern (uppercase letter + dot + space)
  items := '[]'::JSONB;
  item_ids := ARRAY(
    SELECT (regexp_matches(body, '(?:^|\s)([A-Z])\.\s', 'g'))[1]
  );
  IF array_length(item_ids, 1) >= 2 THEN
    parts := regexp_split_to_array(body, '(?:^|\s)[A-Z]\.\s+');
    -- parts[1] is before first marker (may be empty)
    IF array_length(parts, 1) > array_length(item_ids, 1) THEN
      FOR i IN 1..array_length(item_ids, 1) LOOP
        items := items || jsonb_build_array(
          jsonb_build_object('id', item_ids[i], 'text', trim(parts[i+1]), 'textTe', '')
        );
      END LOOP;
      IF jsonb_array_length(items) >= 2 THEN RETURN items; END IF;
    END IF;
  END IF;

  -- ── Strategy 4: Numbered on single line — 1. text 2. text ──
  items := '[]'::JSONB;
  item_ids := ARRAY(
    SELECT (regexp_matches(body, '(?:^|\s)(\d+)\.\s', 'g'))[1]
  );
  IF array_length(item_ids, 1) >= 2 THEN
    parts := regexp_split_to_array(body, '(?:^|\s)\d+\.\s+');
    IF array_length(parts, 1) > array_length(item_ids, 1) THEN
      FOR i IN 1..array_length(item_ids, 1) LOOP
        items := items || jsonb_build_array(
          jsonb_build_object('id', item_ids[i], 'text', trim(parts[i+1]), 'textTe', '')
        );
      END LOOP;
      IF jsonb_array_length(items) >= 2 THEN RETURN items; END IF;
    END IF;
  END IF;

  -- ── Strategy 5: Plain letter prefix — P text  Q text (no dot, no parens) ──
  items := '[]'::JSONB;
  FOR m IN
    SELECT regexp_matches(body, '(?:^|\s)([A-Z])\s{2,}(.+?)(?=\s+[A-Z]\s{2,}|$)', 'g')
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
-- Main: parse and backfill
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
  split_fail_ids TEXT[] := '{}';
  parse_fail_ids TEXT[] := '{}';
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
  LOOP
    -- Split into Column I and Column II bodies
    SELECT s.col1_body, s.col2_body INTO split
    FROM _split_mtf_columns(q.question_text) s;

    IF split.col1_body IS NULL OR split.col2_body IS NULL THEN
      split_fail_ids := split_fail_ids || q.id;
      skip_count := skip_count + 1;
      CONTINUE;
    END IF;

    -- Extract items
    col_a := _extract_mtf_items(split.col1_body);
    col_b := _extract_mtf_items(split.col2_body);

    IF jsonb_array_length(col_a) < 2 OR jsonb_array_length(col_b) < 2 THEN
      parse_fail_ids := parse_fail_ids || q.id;
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
      || jsonb_build_object('columnA', col_a)
      || jsonb_build_object('columnB', col_b)
      || jsonb_build_object('correctMapping', mapping)
    WHERE id = q.id::UUID;

    fixed_count := fixed_count + 1;
  END LOOP;

  RAISE NOTICE '══════════════════════════════════════════';
  RAISE NOTICE 'MTF payload fix v3: % fixed, % skipped', fixed_count, skip_count;
  IF array_length(split_fail_ids, 1) > 0 THEN
    RAISE NOTICE 'SPLIT failures: %', array_to_string(split_fail_ids, ', ');
  END IF;
  IF array_length(parse_fail_ids, 1) > 0 THEN
    RAISE NOTICE 'PARSE failures: %', array_to_string(parse_fail_ids, ', ');
  END IF;
  RAISE NOTICE '══════════════════════════════════════════';
END $$;

-- Verify
SELECT 'MTF still missing columnA' AS status, COUNT(*) AS count
FROM med_questions
WHERE question_type = 'match-the-following'
  AND (payload->'columnA' IS NULL
       OR jsonb_array_length(COALESCE(payload->'columnA', '[]'::JSONB)) = 0);

-- Debug: show remaining failures
SELECT id, left(question_text, 150) AS text_preview
FROM med_questions
WHERE question_type = 'match-the-following'
  AND (payload->'columnA' IS NULL
       OR jsonb_array_length(COALESCE(payload->'columnA', '[]'::JSONB)) = 0)
LIMIT 5;
