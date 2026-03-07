-- Add last_translated_at to med_questions for the translation pipeline.
-- Python translation script uses: WHERE corrected_at > last_translated_at
-- to find questions that were corrected but not yet re-translated.

ALTER TABLE med_questions
  ADD COLUMN IF NOT EXISTS last_translated_at timestamptz;

-- Composite index for the translation pipeline query
CREATE INDEX IF NOT EXISTS idx_med_questions_translation_pending
  ON med_questions (corrected_at, last_translated_at)
  WHERE corrected_at IS NOT NULL;

-- Backfill: any question that already has a Telugu or Hindi translation
-- should have last_translated_at set so it doesn't get re-queued unnecessarily.
UPDATE med_questions
SET last_translated_at = COALESCE(corrected_at, now())
WHERE last_translated_at IS NULL
  AND (question_text_te IS NOT NULL OR question_text_hi IS NOT NULL);
