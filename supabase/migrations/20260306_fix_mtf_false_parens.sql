-- Fix 2 MTF questions where descriptive parenthesized text like "(fundamental)"
-- or "(Expression)" was incorrectly parsed as item IDs.
-- These questions use dotted format (A. text, B. text) not parenthesized.
-- Clear the bad columnA/columnB and re-extract using dotted strategy only.

CREATE OR REPLACE FUNCTION _extract_mtf_items_dotted(body TEXT)
RETURNS JSONB AS $$
DECLARE
  items JSONB := '[]'::JSONB;
  item_ids TEXT[];
  parts TEXT[];
  i INT;
BEGIN
  -- Strategy: Dotted format — A. text B. text or 1. text 2. text
  -- First try uppercase letters
  item_ids := ARRAY(
    SELECT (regexp_matches(body, '(?:^|\s)([A-Z])\.\s', 'g'))[1]
  );
  IF array_length(item_ids, 1) >= 2 THEN
    parts := regexp_split_to_array(body, '(?:^|\s)[A-Z]\.\s+');
    IF array_length(parts, 1) > array_length(item_ids, 1) THEN
      FOR i IN 1..array_length(item_ids, 1) LOOP
        items := items || jsonb_build_array(
          jsonb_build_object('id', item_ids[i], 'text', trim(parts[i+1]), 'textTe', '')
        );
      END LOOP;
      IF jsonb_array_length(items) >= 2 THEN RETURN items; END IF;
    END IF;
  END IF;

  -- Try numbers
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
    END IF;
  END IF;

  RETURN items;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Fix the 2 specific questions
DO $$
DECLARE
  q RECORD;
  split RECORD;
  col_a JSONB;
  col_b JSONB;
  new_col_b JSONB;
  mapping JSONB;
  a_ids TEXT[];
  b_item JSONB;
  fixed INT := 0;
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
    WHERE mq.id::TEXT IN (
      'f8c07bfb-9c4d-474b-b0f0-642aca437de3',
      '73676a3f-9a3a-42f4-a0a2-973438cc1008'
    )
  LOOP
    -- Re-split columns using _split_mtf_columns
    SELECT s.col1_body, s.col2_body INTO split
    FROM _split_mtf_columns(q.question_text) s;

    IF split.col1_body IS NULL OR split.col2_body IS NULL THEN
      RAISE NOTICE 'SKIP split fail: %', q.id;
      CONTINUE;
    END IF;

    -- Extract using dotted-only strategy
    col_a := _extract_mtf_items_dotted(split.col1_body);
    col_b := _extract_mtf_items_dotted(split.col2_body);

    IF jsonb_array_length(col_a) < 2 OR jsonb_array_length(col_b) < 2 THEN
      RAISE NOTICE 'SKIP parse fail: % — colA=%, colB=%', q.id,
        jsonb_array_length(col_a), jsonb_array_length(col_b);
      CONTINUE;
    END IF;

    -- Check for duplicate IDs and prefix Column B if needed
    a_ids := ARRAY(SELECT e->>'id' FROM jsonb_array_elements(col_a) e);
    new_col_b := '[]'::JSONB;
    FOR b_item IN SELECT * FROM jsonb_array_elements(col_b) LOOP
      IF (b_item->>'id') = ANY(a_ids) THEN
        new_col_b := new_col_b || jsonb_build_array(
          jsonb_build_object('id', 'b-' || (b_item->>'id'), 'text', b_item->>'text', 'textTe', '')
        );
      ELSE
        new_col_b := new_col_b || jsonb_build_array(b_item);
      END IF;
    END LOOP;

    -- Derive correctMapping
    mapping := '{}'::JSONB;
    IF q.correct_option_text IS NOT NULL THEN
      mapping := _parse_option_mapping(q.correct_option_text);
      -- If Column B IDs were prefixed, update mapping values
      IF EXISTS (SELECT 1 FROM jsonb_array_elements(new_col_b) e WHERE (e->>'id') LIKE 'b-%') THEN
        DECLARE
          new_mapping JSONB := '{}'::JSONB;
          k TEXT;
        BEGIN
          FOR k IN SELECT jsonb_object_keys(mapping) LOOP
            new_mapping := new_mapping || jsonb_build_object(k, 'b-' || (mapping->>k));
          END LOOP;
          mapping := new_mapping;
        END;
      END IF;
    END IF;

    -- Update
    UPDATE med_questions
    SET payload = payload
      || jsonb_build_object('columnA', col_a)
      || jsonb_build_object('columnB', new_col_b)
      || jsonb_build_object('correctMapping', mapping)
    WHERE id = q.id::UUID;

    fixed := fixed + 1;
    RAISE NOTICE 'Fixed: % — colA=%, colB=%', q.id,
      jsonb_array_length(col_a), jsonb_array_length(new_col_b);
  END LOOP;

  RAISE NOTICE 'Fixed % questions', fixed;
END $$;

-- Cleanup
DROP FUNCTION IF EXISTS _extract_mtf_items_dotted(TEXT);
