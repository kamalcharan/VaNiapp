-- ==========================================================================
-- MIGRATION 4 (optional): Drop helper function after insertion is complete
-- Run this LAST after verifying all questions are inserted correctly.
-- ==========================================================================

DROP FUNCTION IF EXISTS insert_batch_questions(jsonb, text);
