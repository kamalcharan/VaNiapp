-- Migration: 20260425_create_med_concepts
--
-- Adds the med_concepts table so the ConceptExplainerSheet can stop reading
-- from src/data/concepts/*.ts (bundled in the app) and pull from the DB.
--
-- Status of related local data:
--   src/data/concepts/{botany,chemistry,physics,zoology}.ts — 12 entries each,
--   48 total. After this migration runs, those files need to be backfilled
--   into med_concepts and then deleted in app code.
--
-- Naming: matches the conventions of med_questions (snake_case, _te / _hi
-- siblings for translatable strings, exam_ids text[] for cross-exam tagging).

CREATE TABLE IF NOT EXISTS med_concepts (
  id text PRIMARY KEY,                                  -- e.g. 'mitochondria', 'cell-wall'
  subject_id text NOT NULL REFERENCES med_subjects(id),
  chapter_id text NOT NULL REFERENCES med_chapters(id),

  -- Localized strings: en is required, _te / _hi nullable (rendered via t())
  title text NOT NULL,
  title_te text,
  title_hi text,

  explanation text NOT NULL,                            -- markdown body, ~200-400 words
  explanation_te text,
  explanation_hi text,

  analogy text,                                          -- relatable everyday parallel
  analogy_te text,
  analogy_hi text,

  exam_relevance text,                                   -- short note on freq. in NEET/CUET
  exam_relevance_te text,
  exam_relevance_hi text,

  common_mistakes text[],                                -- bulleted list, en only for now
  quick_recap text,                                      -- 1-2 line summary

  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_med_concepts_chapter ON med_concepts(chapter_id) WHERE is_active;
CREATE INDEX IF NOT EXISTS idx_med_concepts_subject ON med_concepts(subject_id) WHERE is_active;

-- Read access: concepts are public-readable through anon role
ALTER TABLE med_concepts ENABLE ROW LEVEL SECURITY;

CREATE POLICY med_concepts_anon_read ON med_concepts
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- After the table exists, backfill the 48 entries from src/data/concepts/*.ts
-- (one INSERT per entry). The Qbank/ admin can grow a small concept editor
-- once we've moved past the initial seed.
