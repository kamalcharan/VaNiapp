-- ==========================================================================
-- FIX: Undo duplicate questions created by step3 migration
--
-- The original questions (from 20260301 batch SQL) already had working
-- images. The ONLY thing missing was options + hints in the separate tables.
-- Step3 wrongly inserted duplicate question rows instead of just adding
-- options to existing rows.
--
-- This script:
--   1. Copies options + hints from new (duplicate) rows → old (original) rows
--   2. Deletes the duplicate rows
--   Result: 93 questions with BOTH images AND options
-- ==========================================================================

BEGIN;

-- ═══════════════════════════════════════════════════════════════════
-- Identify old vs new rows:
--   OLD = have NO entries in med_question_options (original batch insert)
--   NEW = have entries in med_question_options (step3 insert)
-- Match them by payload->>'question_id'
-- ═══════════════════════════════════════════════════════════════════

-- Step 1: Copy options from new rows to old rows
INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
SELECT old_q.id, o.option_key, o.option_text, o.is_correct, o.sort_order
FROM med_questions old_q
JOIN med_questions new_q
  ON old_q.payload->>'question_id' = new_q.payload->>'question_id'
  AND old_q.id != new_q.id
JOIN med_question_options o ON o.question_id = new_q.id
WHERE old_q.source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3')
  AND new_q.source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3')
  AND NOT EXISTS (SELECT 1 FROM med_question_options x WHERE x.question_id = old_q.id);

-- Step 2: Copy hints from new rows to old rows
INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
SELECT old_q.id, h.option_key, h.hint_text, h.misconception
FROM med_questions old_q
JOIN med_questions new_q
  ON old_q.payload->>'question_id' = new_q.payload->>'question_id'
  AND old_q.id != new_q.id
JOIN med_elimination_hints h ON h.question_id = new_q.id
WHERE old_q.source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3')
  AND new_q.source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3')
  AND NOT EXISTS (SELECT 1 FROM med_elimination_hints x WHERE x.question_id = old_q.id);

-- Step 3: Delete hints for duplicate (new) rows
DELETE FROM med_elimination_hints
WHERE question_id IN (
  SELECT new_q.id
  FROM med_questions new_q
  WHERE new_q.source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3')
    AND EXISTS (
      SELECT 1 FROM med_question_options o WHERE o.question_id = new_q.id
    )
    AND EXISTS (
      SELECT 1 FROM med_questions old_q
      WHERE old_q.payload->>'question_id' = new_q.payload->>'question_id'
        AND old_q.id != new_q.id
        AND old_q.source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3')
    )
);

-- Step 4: Delete options for duplicate (new) rows
DELETE FROM med_question_options
WHERE question_id IN (
  SELECT new_q.id
  FROM med_questions new_q
  WHERE new_q.source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3')
    AND EXISTS (
      SELECT 1 FROM med_questions old_q
      WHERE old_q.payload->>'question_id' = new_q.payload->>'question_id'
        AND old_q.id != new_q.id
        AND old_q.source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3')
    )
);

-- Step 5: Delete the duplicate (new) question rows
DELETE FROM med_questions
WHERE source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3')
  AND id IN (
    SELECT new_q.id
    FROM med_questions new_q
    WHERE new_q.source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3')
      AND EXISTS (
        SELECT 1 FROM med_questions old_q
        WHERE old_q.payload->>'question_id' = new_q.payload->>'question_id'
          AND old_q.id != new_q.id
          AND old_q.source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3')
      )
  );

-- ═══════════════════════════════════════════════════════════════════
-- Verify
-- ═══════════════════════════════════════════════════════════════════
SELECT
  source,
  count(*) AS questions,
  count(*) FILTER (WHERE image_url LIKE 'http%' AND question_type = 'diagram-based') AS with_images,
  (SELECT count(*) FROM med_question_options o
   JOIN med_questions q2 ON q2.id = o.question_id
   WHERE q2.source = q.source) AS total_options,
  (SELECT count(*) FROM med_elimination_hints h
   JOIN med_questions q3 ON q3.id = h.question_id
   WHERE q3.source = q.source) AS total_hints
FROM med_questions q
WHERE source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3')
GROUP BY source
ORDER BY source;

-- Expected:
--   correction-batch-1: 21 questions, ~14 with images, 84 options, 63 hints
--   correction-batch-2: 30 questions, ~20 with images, 120 options, 90 hints
--   correction-batch-3: 42 questions, ~28 with images, 168 options, 126 hints

COMMIT;
