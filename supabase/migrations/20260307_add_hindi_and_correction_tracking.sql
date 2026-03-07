-- Add Hindi language support columns and correction tracking fields.
-- This migration:
-- 1. Adds _hi columns to all question-related tables for Hindi translations
-- 2. Updates the med_profiles language constraint to include 'hi'
-- 3. Adds Hindi entry to med_languages catalog
-- 4. Adds corrected_at and correction_session columns for correction tracking

-- ═══════════════════════════════════════════════════════════════
-- 1. Hindi columns on question tables
-- ═══════════════════════════════════════════════════════════════

-- med_questions
ALTER TABLE med_questions
  ADD COLUMN IF NOT EXISTS question_text_hi text,
  ADD COLUMN IF NOT EXISTS explanation_hi text;

-- med_question_options
ALTER TABLE med_question_options
  ADD COLUMN IF NOT EXISTS option_text_hi text;

-- med_elimination_hints
ALTER TABLE med_elimination_hints
  ADD COLUMN IF NOT EXISTS hint_text_hi text,
  ADD COLUMN IF NOT EXISTS misconception_hi text;

-- med_chapters
ALTER TABLE med_chapters
  ADD COLUMN IF NOT EXISTS name_hi text;

-- med_topics
ALTER TABLE med_topics
  ADD COLUMN IF NOT EXISTS name_hi text;

-- ═══════════════════════════════════════════════════════════════
-- 2. Update language constraint on med_profiles
-- ═══════════════════════════════════════════════════════════════

-- Drop old constraint and add new one with 'hi'
DO $$
BEGIN
  -- Try to drop the existing check constraint (name may vary)
  BEGIN
    ALTER TABLE med_profiles DROP CONSTRAINT IF EXISTS med_profiles_language_check;
  EXCEPTION WHEN undefined_object THEN
    NULL;
  END;

  -- Try common auto-generated constraint name
  BEGIN
    ALTER TABLE med_profiles DROP CONSTRAINT IF EXISTS med_profiles_check;
  EXCEPTION WHEN undefined_object THEN
    NULL;
  END;

  -- Add new constraint with Hindi included
  ALTER TABLE med_profiles
    ADD CONSTRAINT med_profiles_language_check
    CHECK (language IN ('en', 'te', 'hi'));
EXCEPTION WHEN duplicate_object THEN
  NULL; -- constraint already exists
END $$;

-- ═══════════════════════════════════════════════════════════════
-- 3. Add Hindi to med_languages catalog
-- ═══════════════════════════════════════════════════════════════

INSERT INTO med_languages (id, label, native, emoji, description, sort_order, is_active)
VALUES ('hi', 'Hindi', 'हिन्दी', 'क', 'Questions & explanations in Hindi, UI in English', 3, true)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  native = EXCLUDED.native,
  emoji = EXCLUDED.emoji,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;

-- ═══════════════════════════════════════════════════════════════
-- 4. Correction tracking columns
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE med_questions
  ADD COLUMN IF NOT EXISTS corrected_at timestamptz,
  ADD COLUMN IF NOT EXISTS correction_session text;

-- Index for translation pipeline queries
CREATE INDEX IF NOT EXISTS idx_med_questions_corrected_at
  ON med_questions (corrected_at)
  WHERE corrected_at IS NOT NULL;

-- ═══════════════════════════════════════════════════════════════
-- Verify
-- ═══════════════════════════════════════════════════════════════

SELECT 'Hindi columns added' AS status,
  (SELECT COUNT(*) FROM information_schema.columns
   WHERE table_name = 'med_questions' AND column_name = 'question_text_hi') AS q_hi,
  (SELECT COUNT(*) FROM information_schema.columns
   WHERE table_name = 'med_question_options' AND column_name = 'option_text_hi') AS opt_hi,
  (SELECT COUNT(*) FROM information_schema.columns
   WHERE table_name = 'med_questions' AND column_name = 'corrected_at') AS corrected_at;

SELECT id, label, native, emoji FROM med_languages ORDER BY sort_order;
