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

-- Fix MTF questions with duplicate option_key values
-- Reassign keys to A, B, C, D based on sort_order
DO $$
DECLARE
  q_id UUID;
  opt RECORD;
  idx INT;
  new_key TEXT;
  correct_opt_idx INT;
  keys TEXT[] := ARRAY['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  fixed_count INT := 0;
BEGIN
  -- Find questions with duplicate option keys
  FOR q_id IN
    SELECT DISTINCT question_id
    FROM med_question_options
    GROUP BY question_id, option_key
    HAVING COUNT(*) > 1
  LOOP
    idx := 0;
    correct_opt_idx := -1;

    -- Reassign keys in sort_order
    FOR opt IN
      SELECT id, option_key, is_correct, sort_order
      FROM med_question_options
      WHERE question_id = q_id
      ORDER BY sort_order
    LOOP
      new_key := keys[idx + 1];  -- PostgreSQL arrays are 1-indexed

      UPDATE med_question_options
      SET option_key = new_key
      WHERE id = opt.id;

      IF opt.is_correct THEN
        correct_opt_idx := idx;
      END IF;

      idx := idx + 1;
    END LOOP;

    -- Update correct_answer on the question
    IF correct_opt_idx >= 0 THEN
      UPDATE med_questions
      SET correct_answer = keys[correct_opt_idx + 1],
          corrected_at = NOW()
      WHERE id = q_id;
    END IF;

    fixed_count := fixed_count + 1;
    RAISE NOTICE 'Fixed duplicate option keys in %', q_id;
  END LOOP;

  RAISE NOTICE 'Fixed % questions with duplicate option keys', fixed_count;
END $$;

-- Verify: check for remaining duplicate option keys
SELECT
  question_id,
  option_key,
  COUNT(*) AS cnt
FROM med_question_options
GROUP BY question_id, option_key
HAVING COUNT(*) > 1;
