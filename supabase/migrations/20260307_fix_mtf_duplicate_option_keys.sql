-- Add UPDATE policies for med_question_options and med_elimination_hints
-- (needed to fix duplicate option_key values)

-- Options: allow update
ALTER TABLE med_question_options ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public update options" ON med_question_options;
CREATE POLICY "Public update options" ON med_question_options
  FOR UPDATE USING (true) WITH CHECK (true);

-- Hints: allow update
ALTER TABLE med_elimination_hints ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public update hints" ON med_elimination_hints;
CREATE POLICY "Public update hints" ON med_elimination_hints
  FOR UPDATE USING (true) WITH CHECK (true);

-- ══════════════════════════════════════════════════════════════
-- Part 1: Fix duplicate option_key in med_question_options
-- ══════════════════════════════════════════════════════════════
DO $$
DECLARE
  q RECORD;
  opt RECORD;
  idx INT;
  correct_opt_idx INT;
  keys TEXT[] := ARRAY['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  fixed_count INT := 0;
BEGIN
  FOR q IN
    SELECT DISTINCT o.question_id
    FROM med_question_options o
    GROUP BY o.question_id, o.option_key
    HAVING COUNT(*) > 1
  LOOP
    idx := 0;
    correct_opt_idx := -1;

    FOR opt IN
      SELECT id, option_key, is_correct
      FROM med_question_options
      WHERE question_id = q.question_id
      ORDER BY sort_order
    LOOP
      UPDATE med_question_options
      SET option_key = keys[idx + 1]
      WHERE id = opt.id;

      IF opt.is_correct THEN correct_opt_idx := idx; END IF;
      idx := idx + 1;
    END LOOP;

    IF correct_opt_idx >= 0 THEN
      UPDATE med_questions
      SET correct_answer = keys[correct_opt_idx + 1], corrected_at = NOW()
      WHERE id = q.question_id;
    END IF;

    fixed_count := fixed_count + 1;
  END LOOP;

  RAISE NOTICE 'Part 1: Fixed % questions in med_question_options', fixed_count;
END $$;

-- ══════════════════════════════════════════════════════════════
-- Part 2: Fix duplicate IDs in payload->'options' JSONB
-- ══════════════════════════════════════════════════════════════
DO $$
DECLARE
  q RECORD;
  idx INT;
  arr_len INT;
  keys TEXT[] := ARRAY['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  new_options JSONB;
  opt_elem JSONB;
  fixed_count INT := 0;
BEGIN
  FOR q IN
    SELECT id, payload
    FROM med_questions
    WHERE question_type = 'match-the-following'
      AND payload IS NOT NULL
      AND payload->'options' IS NOT NULL
      AND jsonb_array_length(payload->'options') > 0
  LOOP
    -- Check if there are duplicate IDs in payload.options
    IF (
      SELECT COUNT(DISTINCT elem->>'id') < COUNT(*)
      FROM jsonb_array_elements(q.payload->'options') AS elem
    ) THEN
      arr_len := jsonb_array_length(q.payload->'options');
      new_options := '[]'::jsonb;

      FOR idx IN 0..(arr_len - 1) LOOP
        opt_elem := (q.payload->'options')->idx;
        opt_elem := jsonb_set(opt_elem, '{id}', to_jsonb(keys[idx + 1]));
        new_options := new_options || jsonb_build_array(opt_elem);
      END LOOP;

      UPDATE med_questions
      SET payload = jsonb_set(payload, '{options}', new_options),
          corrected_at = NOW()
      WHERE id = q.id;

      fixed_count := fixed_count + 1;
      RAISE NOTICE 'Fixed payload.options IDs for %', q.id;
    END IF;
  END LOOP;

  RAISE NOTICE 'Part 2: Fixed % questions payload.options', fixed_count;
END $$;

-- ══════════════════════════════════════════════════════════════
-- Part 3: Fix duplicate IDs across columnA + columnB in payload
-- If items share IDs, prefix columnB IDs with "b-"
-- ══════════════════════════════════════════════════════════════
DO $$
DECLARE
  q RECORD;
  col_a JSONB;
  col_b JSONB;
  a_ids TEXT[];
  has_overlap BOOLEAN;
  new_col_b JSONB;
  b_elem JSONB;
  b_id TEXT;
  mapping JSONB;
  new_mapping JSONB;
  map_key TEXT;
  map_val TEXT;
  idx INT;
  fixed_count INT := 0;
BEGIN
  FOR q IN
    SELECT id, payload
    FROM med_questions
    WHERE question_type = 'match-the-following'
      AND payload IS NOT NULL
  LOOP
    col_a := COALESCE(q.payload->'columnA', q.payload->'column_a');
    col_b := COALESCE(q.payload->'columnB', q.payload->'column_b');

    CONTINUE WHEN col_a IS NULL OR col_b IS NULL;
    CONTINUE WHEN jsonb_array_length(col_a) = 0 OR jsonb_array_length(col_b) = 0;

    -- Collect A IDs
    SELECT array_agg(elem->>'id') INTO a_ids
    FROM jsonb_array_elements(col_a) AS elem;

    -- Check for overlap
    has_overlap := false;
    FOR idx IN 0..(jsonb_array_length(col_b) - 1) LOOP
      b_id := col_b->idx->>'id';
      IF b_id = ANY(a_ids) THEN
        has_overlap := true;
        EXIT;
      END IF;
    END LOOP;

    CONTINUE WHEN NOT has_overlap;

    -- Prefix column B IDs with "b-"
    new_col_b := '[]'::jsonb;
    FOR idx IN 0..(jsonb_array_length(col_b) - 1) LOOP
      b_elem := col_b->idx;
      b_id := b_elem->>'id';
      IF b_id NOT LIKE 'b-%' THEN
        b_elem := jsonb_set(b_elem, '{id}', to_jsonb('b-' || b_id));
      END IF;
      new_col_b := new_col_b || jsonb_build_array(b_elem);
    END LOOP;

    -- Update correctMapping values
    mapping := COALESCE(q.payload->'correctMapping', q.payload->'correct_mapping', '{}'::jsonb);
    new_mapping := '{}'::jsonb;
    FOR map_key, map_val IN
      SELECT key, value#>>'{}'
      FROM jsonb_each(mapping) AS j(key, value)
    LOOP
      IF map_val NOT LIKE 'b-%' THEN
        new_mapping := new_mapping || jsonb_build_object(map_key, 'b-' || map_val);
      ELSE
        new_mapping := new_mapping || jsonb_build_object(map_key, map_val);
      END IF;
    END LOOP;

    UPDATE med_questions
    SET payload = payload
      || jsonb_build_object('columnA', col_a)
      || jsonb_build_object('columnB', new_col_b)
      || jsonb_build_object('correctMapping', new_mapping),
        corrected_at = NOW()
    WHERE id = q.id;

    fixed_count := fixed_count + 1;
    RAISE NOTICE 'Fixed column A/B overlap for %', q.id;
  END LOOP;

  RAISE NOTICE 'Part 3: Fixed % questions with column overlap', fixed_count;
END $$;
