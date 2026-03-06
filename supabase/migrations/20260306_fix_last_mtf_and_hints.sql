-- Fix the last MTF question with **Column I** / **Column II** markdown bold format
-- and check the no-hints MCQ question.

-- First, let's see the actual text of the MTF question to understand the format
-- SELECT id, left(question_text, 500) FROM med_questions WHERE id = '2dc428f5-6628-454b-9a9a-32f5e056a674';

-- Fix: manually parse this question using a targeted approach
DO $$
DECLARE
  q_text TEXT;
  col1_body TEXT;
  col2_body TEXT;
  col_a JSONB;
  col_b JSONB;
  mapping JSONB := '{}'::JSONB;
  correct_opt TEXT;
  parts TEXT[];
  n INT;
BEGIN
  SELECT question_text INTO q_text
  FROM med_questions
  WHERE id = '2dc428f5-6628-454b-9a9a-32f5e056a674';

  IF q_text IS NULL THEN
    RAISE NOTICE 'Question not found';
    RETURN;
  END IF;

  -- This question uses **Column I** and **Column II** markdown bold
  -- Split on the LAST **Column II** (or variant)
  -- Try broad pattern: any mention of "Column II" or "Column 2" with optional markdown
  parts := regexp_split_to_array(q_text, '\*\*\s*[Cc]olumn\s*[-–]?\s*(?:[Ii]{2}|2)\s*\*\*');
  n := array_length(parts, 1);

  IF n < 2 THEN
    -- Try without markdown
    parts := regexp_split_to_array(q_text, '(?i)column\s*[-–]?\s*(?:ii|2)\s*[:\-–.]?');
    n := array_length(parts, 1);
  END IF;

  IF n < 2 THEN
    RAISE NOTICE 'Could not split Column II for 2dc428f5. Text: %', left(q_text, 200);
    RETURN;
  END IF;

  col2_body := parts[n];
  col1_body := array_to_string(parts[1:n-1], ' ');

  -- Strip Column I header
  col1_body := regexp_replace(col1_body,
    '(?i).*(?:\*\*\s*)?column\s*[-–]?\s*(?:i|1|a)\s*(?:\*\*)?\s*[-–:.]?\s*',
    '');

  RAISE NOTICE 'col1_body: %', left(col1_body, 200);
  RAISE NOTICE 'col2_body: %', left(col2_body, 200);

  -- Extract items
  col_a := _extract_mtf_items(col1_body);
  col_b := _extract_mtf_items(col2_body);

  -- If parenthesized strategy fails, try dotted
  IF jsonb_array_length(col_a) < 2 THEN
    col_a := _extract_mtf_items_dotted(col1_body);
  END IF;
  IF jsonb_array_length(col_b) < 2 THEN
    col_b := _extract_mtf_items_dotted(col2_body);
  END IF;

  RAISE NOTICE 'Extracted colA=%, colB=%', jsonb_array_length(col_a), jsonb_array_length(col_b);

  IF jsonb_array_length(col_a) < 2 OR jsonb_array_length(col_b) < 2 THEN
    RAISE NOTICE 'FAILED to parse items for 2dc428f5';
    RETURN;
  END IF;

  -- Check for duplicate IDs and prefix if needed
  DECLARE
    a_ids TEXT[];
    new_col_b JSONB := '[]'::JSONB;
    b_item JSONB;
    has_dupes BOOLEAN := FALSE;
  BEGIN
    a_ids := ARRAY(SELECT e->>'id' FROM jsonb_array_elements(col_a) e);
    FOR b_item IN SELECT * FROM jsonb_array_elements(col_b) LOOP
      IF (b_item->>'id') = ANY(a_ids) THEN has_dupes := TRUE; EXIT; END IF;
    END LOOP;

    IF has_dupes THEN
      FOR b_item IN SELECT * FROM jsonb_array_elements(col_b) LOOP
        new_col_b := new_col_b || jsonb_build_array(
          jsonb_build_object('id', 'b-' || (b_item->>'id'), 'text', b_item->>'text', 'textTe', '')
        );
      END LOOP;
      col_b := new_col_b;
    END IF;
  END;

  -- Get correctMapping
  SELECT mqo.option_text INTO correct_opt
  FROM med_question_options mqo
  WHERE mqo.question_id = '2dc428f5-6628-454b-9a9a-32f5e056a674'::UUID
    AND (mqo.is_correct = true)
  LIMIT 1;

  IF correct_opt IS NOT NULL THEN
    mapping := _parse_option_mapping(correct_opt);
    -- If col_b was prefixed, update mapping values
    IF EXISTS (SELECT 1 FROM jsonb_array_elements(col_b) e WHERE (e->>'id') LIKE 'b-%') THEN
      DECLARE
        new_map JSONB := '{}'::JSONB;
        k TEXT;
      BEGIN
        FOR k IN SELECT jsonb_object_keys(mapping) LOOP
          new_map := new_map || jsonb_build_object(k, 'b-' || (mapping->>k));
        END LOOP;
        mapping := new_map;
      END;
    END IF;
  END IF;

  -- Update
  UPDATE med_questions
  SET payload = payload
    || jsonb_build_object('columnA', col_a)
    || jsonb_build_object('columnB', col_b)
    || jsonb_build_object('correctMapping', mapping)
  WHERE id = '2dc428f5-6628-454b-9a9a-32f5e056a674'::UUID;

  RAISE NOTICE 'Fixed 2dc428f5: colA=%, colB=%, mapping=%',
    jsonb_array_length(col_a), jsonb_array_length(col_b), mapping;
END $$;

-- Verify
SELECT
  id,
  jsonb_array_length(COALESCE(payload->'columnA', '[]'::JSONB)) AS col_a_count,
  jsonb_array_length(COALESCE(payload->'columnB', '[]'::JSONB)) AS col_b_count,
  payload->'correctMapping' AS mapping
FROM med_questions
WHERE id = '2dc428f5-6628-454b-9a9a-32f5e056a674';
