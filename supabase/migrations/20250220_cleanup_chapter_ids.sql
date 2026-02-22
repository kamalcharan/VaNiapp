-- ════════════════════════════════════════════════════════════════════════════
-- CLEANUP: Fix misassigned chapter_ids from broken bulkinsert prefix mapping
-- ════════════════════════════════════════════════════════════════════════════
--
-- The previous TOPIC_TO_CHAPTER in bulkinsert.html used chapter IDs as keys
-- (e.g. 'bot-cell-unit') instead of topic prefixes (e.g. 'bot-cell').
-- This caused:
--   - Botany questions to fail FK constraints or get 'unknown' chapter_id
--   - Chemistry questions with 'chem-atom-*' topics to not match 'chem-atomic'
--
-- This migration:
--   1. Reports current state (run SELECT first to see damage)
--   2. Deletes questions with invalid chapter_ids
--   3. Reports final state
--
-- After running this, re-import questions using the FIXED bulkinsert.html.
-- ════════════════════════════════════════════════════════════════════════════

-- 1. DIAGNOSTIC: Show questions per chapter per subject
-- Run this first to see what's there:
--
-- SELECT q.subject_id, q.chapter_id, count(*) as question_count
-- FROM med_questions q
-- GROUP BY q.subject_id, q.chapter_id
-- ORDER BY q.subject_id, q.chapter_id;

-- 2. Delete questions with chapter_ids that don't exist in med_chapters
-- (These are the ones that got through with wrong mappings)
DELETE FROM med_questions
WHERE chapter_id NOT IN (SELECT id FROM med_chapters);

-- 3. Verify: Show remaining question counts per subject
SELECT q.subject_id, count(*) as remaining_questions
FROM med_questions q
GROUP BY q.subject_id
ORDER BY q.subject_id;
