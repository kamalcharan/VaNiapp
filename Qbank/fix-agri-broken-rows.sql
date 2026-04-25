-- Wipe all CUET Agriculture questions so bulkinsert.html can re-import from scratch.
-- med_question_options and med_elimination_hints cascade via `on delete cascade`.
--
-- Safe to run multiple times. After this:
--   1. Re-run bulkinsert.html on Qbank/CUET/agri/ (all 40 JSONs, 800 questions).
--   2. Then run: node Qbank/upload-diagrams.mjs --subject agriculture

BEGIN;

-- Pre-delete snapshot (sanity)
SELECT 'BEFORE' AS phase, COUNT(*) AS questions FROM med_questions WHERE chapter_id LIKE 'cuet-agri-%';

-- Delete everything under the 4 agri chapters
DELETE FROM med_questions WHERE chapter_id LIKE 'cuet-agri-%';

-- Post-delete verification
SELECT 'AFTER' AS phase, COUNT(*) AS questions FROM med_questions WHERE chapter_id LIKE 'cuet-agri-%';
SELECT 'OPTIONS_ORPHANED' AS phase, COUNT(*) AS rows
  FROM med_question_options o
  LEFT JOIN med_questions q ON q.id = o.question_id
  WHERE q.id IS NULL;
SELECT 'HINTS_ORPHANED' AS phase, COUNT(*) AS rows
  FROM med_elimination_hints h
  LEFT JOIN med_questions q ON q.id = h.question_id
  WHERE q.id IS NULL;

COMMIT;
