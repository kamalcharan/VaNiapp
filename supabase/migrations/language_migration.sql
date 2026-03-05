-- ============================================================
-- VaNi Multi-Language Support Migration
-- Future-proofed for all 11 NEET/CUET languages (excluding Urdu)
-- Focus: English (existing), Telugu (existing _te), Hindi (new _hi)
-- ============================================================

-- Language suffix mapping:
--   Telugu    = _te  (ALREADY EXISTS)
--   Hindi     = _hi
--   Tamil     = _ta
--   Kannada   = _kn
--   Malayalam = _ml
--   Bengali   = _bn
--   Marathi   = _mr
--   Gujarati  = _gu
--   Punjabi   = _pa
--   Odia      = _or
--   Assamese  = _as

-- ============================================================
-- 1. med_questions — add translation columns
-- ============================================================
ALTER TABLE med_questions
  -- Hindi (priority)
  ADD COLUMN IF NOT EXISTS question_text_hi TEXT,
  ADD COLUMN IF NOT EXISTS explanation_hi TEXT,
  -- Tamil
  ADD COLUMN IF NOT EXISTS question_text_ta TEXT,
  ADD COLUMN IF NOT EXISTS explanation_ta TEXT,
  -- Kannada
  ADD COLUMN IF NOT EXISTS question_text_kn TEXT,
  ADD COLUMN IF NOT EXISTS explanation_kn TEXT,
  -- Malayalam
  ADD COLUMN IF NOT EXISTS question_text_ml TEXT,
  ADD COLUMN IF NOT EXISTS explanation_ml TEXT,
  -- Bengali
  ADD COLUMN IF NOT EXISTS question_text_bn TEXT,
  ADD COLUMN IF NOT EXISTS explanation_bn TEXT,
  -- Marathi
  ADD COLUMN IF NOT EXISTS question_text_mr TEXT,
  ADD COLUMN IF NOT EXISTS explanation_mr TEXT,
  -- Gujarati
  ADD COLUMN IF NOT EXISTS question_text_gu TEXT,
  ADD COLUMN IF NOT EXISTS explanation_gu TEXT,
  -- Punjabi
  ADD COLUMN IF NOT EXISTS question_text_pa TEXT,
  ADD COLUMN IF NOT EXISTS explanation_pa TEXT,
  -- Odia
  ADD COLUMN IF NOT EXISTS question_text_or TEXT,
  ADD COLUMN IF NOT EXISTS explanation_or TEXT,
  -- Assamese
  ADD COLUMN IF NOT EXISTS question_text_as TEXT,
  ADD COLUMN IF NOT EXISTS explanation_as TEXT;

-- ============================================================
-- 2. med_question_options — add translation columns
-- ============================================================
ALTER TABLE med_question_options
  ADD COLUMN IF NOT EXISTS option_text_hi TEXT,
  ADD COLUMN IF NOT EXISTS option_text_ta TEXT,
  ADD COLUMN IF NOT EXISTS option_text_kn TEXT,
  ADD COLUMN IF NOT EXISTS option_text_ml TEXT,
  ADD COLUMN IF NOT EXISTS option_text_bn TEXT,
  ADD COLUMN IF NOT EXISTS option_text_mr TEXT,
  ADD COLUMN IF NOT EXISTS option_text_gu TEXT,
  ADD COLUMN IF NOT EXISTS option_text_pa TEXT,
  ADD COLUMN IF NOT EXISTS option_text_or TEXT,
  ADD COLUMN IF NOT EXISTS option_text_as TEXT;

-- ============================================================
-- 3. med_elimination_hints — add translation columns
-- ============================================================
ALTER TABLE med_elimination_hints
  ADD COLUMN IF NOT EXISTS hint_text_hi TEXT,
  ADD COLUMN IF NOT EXISTS misconception_hi TEXT,
  ADD COLUMN IF NOT EXISTS hint_text_ta TEXT,
  ADD COLUMN IF NOT EXISTS misconception_ta TEXT,
  ADD COLUMN IF NOT EXISTS hint_text_kn TEXT,
  ADD COLUMN IF NOT EXISTS misconception_kn TEXT,
  ADD COLUMN IF NOT EXISTS hint_text_ml TEXT,
  ADD COLUMN IF NOT EXISTS misconception_ml TEXT,
  ADD COLUMN IF NOT EXISTS hint_text_bn TEXT,
  ADD COLUMN IF NOT EXISTS misconception_bn TEXT,
  ADD COLUMN IF NOT EXISTS hint_text_mr TEXT,
  ADD COLUMN IF NOT EXISTS misconception_mr TEXT,
  ADD COLUMN IF NOT EXISTS hint_text_gu TEXT,
  ADD COLUMN IF NOT EXISTS misconception_gu TEXT,
  ADD COLUMN IF NOT EXISTS hint_text_pa TEXT,
  ADD COLUMN IF NOT EXISTS misconception_pa TEXT,
  ADD COLUMN IF NOT EXISTS hint_text_or TEXT,
  ADD COLUMN IF NOT EXISTS misconception_or TEXT,
  ADD COLUMN IF NOT EXISTS hint_text_as TEXT,
  ADD COLUMN IF NOT EXISTS misconception_as TEXT;

-- ============================================================
-- 4. Language reference table (useful for UI dropdowns, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS med_supported_languages (
  code        VARCHAR(10) PRIMARY KEY,   -- 'hi', 'te', 'ta', etc.
  name_en     VARCHAR(50) NOT NULL,      -- 'Hindi', 'Telugu', etc.
  name_native VARCHAR(50) NOT NULL,      -- 'हिन्दी', 'తెలుగు', etc.
  indictrans_code VARCHAR(20) NOT NULL,  -- 'hin_Deva', 'tel_Telu', etc.
  script      VARCHAR(30) NOT NULL,      -- 'Devanagari', 'Telugu', etc.
  unicode_offset INTEGER,                -- offset from Devanagari, NULL for Devanagari languages
  is_active   BOOLEAN DEFAULT false,     -- only en, te, hi active for now
  sort_order  INTEGER DEFAULT 99,
  created_at  TIMESTAMPTZ DEFAULT now()
);

INSERT INTO med_supported_languages (code, name_en, name_native, indictrans_code, script, unicode_offset, is_active, sort_order)
VALUES
  ('en', 'English',   'English',    'eng_Latn', 'Latin',      NULL,    true,  1),
  ('te', 'Telugu',    'తెలుగు',     'tel_Telu', 'Telugu',     768,     true,  2),
  ('hi', 'Hindi',     'हिन्दी',      'hin_Deva', 'Devanagari', NULL,    true,  3),
  ('ta', 'Tamil',     'தமிழ்',      'tam_Taml', 'Tamil',      640,     false, 4),
  ('kn', 'Kannada',   'ಕನ್ನಡ',      'kan_Knda', 'Kannada',    896,     false, 5),
  ('ml', 'Malayalam', 'മലയാളം',    'mal_Mlym', 'Malayalam',  1024,    false, 6),
  ('bn', 'Bengali',   'বাংলা',      'ben_Beng', 'Bengali',    128,     false, 7),
  ('mr', 'Marathi',   'मराठी',      'mar_Deva', 'Devanagari', NULL,    false, 8),
  ('gu', 'Gujarati',  'ગુજરાતી',    'guj_Gujr', 'Gujarati',   384,     false, 9),
  ('pa', 'Punjabi',   'ਪੰਜਾਬੀ',     'pan_Guru', 'Gurmukhi',   256,     false, 10),
  ('or', 'Odia',      'ଓଡ଼ିଆ',      'ory_Orya', 'Odia',       512,     false, 11),
  ('as', 'Assamese',  'অসমীয়া',    'asm_Beng', 'Bengali',    128,     false, 12)
ON CONFLICT (code) DO NOTHING;