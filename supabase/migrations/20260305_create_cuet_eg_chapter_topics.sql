-- ==========================================================================
-- Create CUET Engineering Graphics chapter and topics.
-- Subject 'engineering-graphics' already exists in med_subjects.
-- This adds a single consolidated chapter with 8 CUET-syllabus topics (B01-B08).
-- Target: ~320 questions (40 per topic).
-- ==========================================================================

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 1. CREATE CHAPTER                                                           │
-- └─────────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics)
VALUES (
  'cuet-eg-engineering-graphics',
  'engineering-graphics',
  '{"CUET"}',
  'Engineering Graphics',
  'Engineering Graphics',
  1,
  12,
  100.0,
  50,
  '{"Scales", "Engineering Curves", "Projection of Points", "Projection of Lines", "Projection of Planes", "Projection of Solids", "Sections of Solids", "Development of Surfaces", "Isometric Projections", "Orthographic Projections"}'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 2. CREATE TOPICS (B01–B08)                                                  │
-- └─────────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES
  -- B01: Scales & Engineering Curves
  ('cuet-eg-scales',        'cuet-eg-engineering-graphics', 'Scales and Engineering Curves',       10, true, true),

  -- B02: Projection of Points & Lines
  ('cuet-eg-projections',   'cuet-eg-engineering-graphics', 'Projection of Points and Lines',      20, true, true),

  -- B03: Projection of Planes
  ('cuet-eg-planes',        'cuet-eg-engineering-graphics', 'Projection of Planes',                30, true, true),

  -- B04: Projection of Solids
  ('cuet-eg-solids',        'cuet-eg-engineering-graphics', 'Projection of Solids',                40, true, true),

  -- B05: Sections of Solids
  ('cuet-eg-sections',      'cuet-eg-engineering-graphics', 'Sections of Solids',                  50, true, true),

  -- B06: Development of Surfaces
  ('cuet-eg-development',   'cuet-eg-engineering-graphics', 'Development of Surfaces',             60, true, true),

  -- B07: Isometric Projections
  ('cuet-eg-isometric',     'cuet-eg-engineering-graphics', 'Isometric Projections',               70, true, true),

  -- B08: Orthographic Projections
  ('cuet-eg-orthographic',  'cuet-eg-engineering-graphics', 'Orthographic Projections',            80, true, true)

ON CONFLICT (id) DO NOTHING;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 3. VERIFICATION                                                             │
-- └─────────────────────────────────────────────────────────────────────────────┘

-- Verify chapter exists
SELECT id, name, subject_id FROM med_chapters WHERE id = 'cuet-eg-engineering-graphics';

-- Verify all 8 topics exist
SELECT id, name, sort_order FROM med_topics WHERE chapter_id = 'cuet-eg-engineering-graphics' ORDER BY sort_order;
