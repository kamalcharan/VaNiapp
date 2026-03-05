-- ==========================================================================
-- CUET Engineering Graphics — Clean Master Data
-- Subject 'engineering-graphics' already exists in med_subjects.
--
-- WHAT THIS DOES:
--   1. Deactivates the 7 old machine-drawing chapters (isometric-basic, threads, etc.)
--   2. Creates 1 correct CUET-syllabus chapter: cuet-eg-engineering-graphics
--   3. Creates 8 topics (B01–B08) under that chapter
--   Target: ~320 questions (40 per topic)
--
-- SAFE TO RE-RUN: uses ON CONFLICT and conditional updates.
-- ==========================================================================


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 1. DEACTIVATE OLD EG CHAPTERS                                              │
-- │    These 7 chapters were machine-drawing focused and don't match the        │
-- │    CUET UG Engineering Graphics syllabus.                                   │
-- └─────────────────────────────────────────────────────────────────────────────┘

UPDATE med_chapters
SET is_active = false
WHERE subject_id = 'engineering-graphics'
  AND id IN (
    'cuet-eg-isometric-basic',
    'cuet-eg-isometric-combo',
    'cuet-eg-threads-bolts',
    'cuet-eg-studs-rivets',
    'cuet-eg-bearings',
    'cuet-eg-rod-joints',
    'cuet-eg-pipe-joints'
  );


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 2. CREATE CORRECT CHAPTER                                                   │
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
-- │ 3. CREATE TOPICS (B01–B08)                                                  │
-- └─────────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES
  ('cuet-eg-scales',        'cuet-eg-engineering-graphics', 'Scales and Engineering Curves',    10, true, true),
  ('cuet-eg-projections',   'cuet-eg-engineering-graphics', 'Projection of Points and Lines',   20, true, true),
  ('cuet-eg-planes',        'cuet-eg-engineering-graphics', 'Projection of Planes',             30, true, true),
  ('cuet-eg-solids',        'cuet-eg-engineering-graphics', 'Projection of Solids',             40, true, true),
  ('cuet-eg-sections',      'cuet-eg-engineering-graphics', 'Sections of Solids',               50, true, true),
  ('cuet-eg-development',   'cuet-eg-engineering-graphics', 'Development of Surfaces',          60, true, true),
  ('cuet-eg-isometric',     'cuet-eg-engineering-graphics', 'Isometric Projections',            70, true, true),
  ('cuet-eg-orthographic',  'cuet-eg-engineering-graphics', 'Orthographic Projections',         80, true, true)
ON CONFLICT (id) DO NOTHING;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 4. VERIFICATION QUERIES                                                     │
-- └─────────────────────────────────────────────────────────────────────────────┘

-- Old chapters should be inactive
SELECT id, name, is_active
FROM med_chapters
WHERE subject_id = 'engineering-graphics'
ORDER BY is_active DESC, chapter_number;

-- New topics
SELECT id, name, sort_order
FROM med_topics
WHERE chapter_id = 'cuet-eg-engineering-graphics'
ORDER BY sort_order;
