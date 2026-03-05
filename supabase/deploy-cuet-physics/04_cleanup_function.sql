-- ==========================================================================
-- DEPLOY STEP 4: Drop helper function after all inserts are done
-- ==========================================================================

DROP FUNCTION IF EXISTS insert_batch_questions(jsonb, text);
