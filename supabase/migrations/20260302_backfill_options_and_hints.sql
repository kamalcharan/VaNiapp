-- ==========================================================================
-- BACKFILL: Populate med_question_options and med_elimination_hints
-- for ALL correction-batch questions (batch 1, 2, and 3).
--
-- ROOT CAUSE: The batch SQL migrations only inserted into med_questions
-- with options/hints in the payload JSONB. But the app reads from
-- the separate med_question_options and med_elimination_hints tables.
-- Without rows in these tables, questions show no answer buttons.
--
-- This migration reads the payload JSONB and creates the missing rows.
-- Safe to re-run: uses ON CONFLICT DO NOTHING / checks for existing rows.
-- ==========================================================================

BEGIN;

-- ══════════════════════════════════════════════════════════════════
-- STEP 1: Populate med_question_options from payload.options
-- ══════════════════════════════════════════════════════════════════

INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
SELECT
  q.id AS question_id,
  opt->>'key' AS option_key,
  opt->>'text' AS option_text,
  (opt->>'is_correct')::boolean AS is_correct,
  idx AS sort_order
FROM med_questions q,
     jsonb_array_elements(q.payload->'options') WITH ORDINALITY AS t(opt, idx)
WHERE q.source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3')
  AND q.payload->'options' IS NOT NULL
  AND jsonb_array_length(q.payload->'options') > 0
  -- Skip questions that already have options
  AND NOT EXISTS (
    SELECT 1 FROM med_question_options o WHERE o.question_id = q.id
  );

-- ══════════════════════════════════════════════════════════════════
-- STEP 2: Populate med_elimination_hints from payload.elimination_hints
-- ══════════════════════════════════════════════════════════════════

INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
SELECT
  q.id AS question_id,
  hint->>'option_key' AS option_key,
  hint->>'hint' AS hint_text,
  hint->>'misconception' AS misconception
FROM med_questions q,
     jsonb_array_elements(q.payload->'elimination_hints') WITH ORDINALITY AS t(hint, idx)
WHERE q.source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3')
  AND q.payload->'elimination_hints' IS NOT NULL
  AND jsonb_array_length(q.payload->'elimination_hints') > 0
  -- Skip questions that already have hints
  AND NOT EXISTS (
    SELECT 1 FROM med_elimination_hints h WHERE h.question_id = q.id
  )
  -- Only insert hints for wrong options (hint text must exist)
  AND (hint->>'hint') IS NOT NULL
  AND (hint->>'hint') != '';

-- ══════════════════════════════════════════════════════════════════
-- STEP 3: Verify — should show 93 questions with 4 options each
-- ══════════════════════════════════════════════════════════════════

SELECT
  q.source,
  count(DISTINCT q.id) AS questions,
  count(DISTINCT o.id) AS total_options,
  count(DISTINCT h.id) AS total_hints
FROM med_questions q
LEFT JOIN med_question_options o ON o.question_id = q.id
LEFT JOIN med_elimination_hints h ON h.question_id = q.id
WHERE q.source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3')
GROUP BY q.source
ORDER BY q.source;

COMMIT;
