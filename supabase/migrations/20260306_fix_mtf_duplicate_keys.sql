-- Fix MTF questions where columnA and columnB have overlapping IDs.
-- The drag-and-drop UI needs unique IDs across both columns.
-- Solution: prefix Column B IDs with "b-" when they clash with Column A IDs.

DO $$
DECLARE
  q RECORD;
  col_a JSONB;
  col_b JSONB;
  new_col_b JSONB;
  new_mapping JSONB;
  a_ids TEXT[];
  b_item JSONB;
  old_id TEXT;
  new_id TEXT;
  has_dupes BOOLEAN;
  fixed_count INT := 0;
BEGIN
  FOR q IN
    SELECT
      mq.id::TEXT AS id,
      mq.payload
    FROM med_questions mq
    WHERE mq.question_type = 'match-the-following'
      AND mq.payload->'columnA' IS NOT NULL
      AND jsonb_array_length(COALESCE(mq.payload->'columnA', '[]'::JSONB)) > 0
      AND mq.payload->'columnB' IS NOT NULL
      AND jsonb_array_length(COALESCE(mq.payload->'columnB', '[]'::JSONB)) > 0
  LOOP
    col_a := q.payload->'columnA';
    col_b := q.payload->'columnB';

    -- Collect Column A IDs
    a_ids := ARRAY(
      SELECT e->>'id' FROM jsonb_array_elements(col_a) e
    );

    -- Check if any Column B ID exists in Column A
    has_dupes := FALSE;
    FOR b_item IN SELECT * FROM jsonb_array_elements(col_b) LOOP
      IF (b_item->>'id') = ANY(a_ids) THEN
        has_dupes := TRUE;
        EXIT;
      END IF;
    END LOOP;

    IF NOT has_dupes THEN
      CONTINUE;
    END IF;

    -- Prefix Column B IDs with "b-"
    new_col_b := '[]'::JSONB;
    FOR b_item IN SELECT * FROM jsonb_array_elements(col_b) LOOP
      old_id := b_item->>'id';
      new_id := 'b-' || old_id;
      new_col_b := new_col_b || jsonb_build_array(
        jsonb_build_object(
          'id', new_id,
          'text', b_item->>'text',
          'textTe', COALESCE(b_item->>'textTe', ''),
          'textHi', COALESCE(b_item->>'textHi', '')
        )
      );
    END LOOP;

    -- Update correctMapping to use new B IDs
    new_mapping := '{}'::JSONB;
    IF q.payload->'correctMapping' IS NOT NULL THEN
      FOR old_id IN SELECT jsonb_object_keys(q.payload->'correctMapping') LOOP
        new_mapping := new_mapping || jsonb_build_object(
          old_id,
          'b-' || (q.payload->'correctMapping'->>old_id)
        );
      END LOOP;
    END IF;

    -- Update payload
    UPDATE med_questions
    SET payload = payload
      || jsonb_build_object('columnB', new_col_b)
      || jsonb_build_object('correctMapping', new_mapping)
    WHERE id = q.id::UUID;

    fixed_count := fixed_count + 1;
    RAISE NOTICE 'Fixed duplicate keys in %', q.id;
  END LOOP;

  RAISE NOTICE 'Fixed % questions with duplicate column IDs', fixed_count;
END $$;

-- Verify: check for any remaining duplicates
SELECT
  mq.id,
  left(mq.question_text, 80) AS preview,
  (SELECT array_agg(e->>'id') FROM jsonb_array_elements(mq.payload->'columnA') e) AS a_ids,
  (SELECT array_agg(e->>'id') FROM jsonb_array_elements(mq.payload->'columnB') e) AS b_ids
FROM med_questions mq
WHERE mq.question_type = 'match-the-following'
  AND mq.payload->'columnA' IS NOT NULL
  AND jsonb_array_length(COALESCE(mq.payload->'columnA', '[]'::JSONB)) > 0
  AND EXISTS (
    SELECT 1
    FROM jsonb_array_elements(mq.payload->'columnA') a,
         jsonb_array_elements(mq.payload->'columnB') b
    WHERE a->>'id' = b->>'id'
  );
