-- ============================================================================
-- CUET Agriculture — DB availability diagnostic
-- Run each section and share the result set. This does NOT modify any data.
-- ============================================================================

-- ── 1. Does the 'agriculture' subject exist? ──────────────────────────────
SELECT 'subject' AS check_type, id, name, exam_id, category, is_active
FROM med_subjects
WHERE id = 'agriculture';

-- ── 2. Are all 4 expected CUET Agri chapters present? ────────────────────
WITH expected(id) AS (
  VALUES
    ('cuet-agri-agrometeorology'),
    ('cuet-agri-livestock'),
    ('cuet-agri-crop-production'),
    ('cuet-agri-horticulture')
)
SELECT
  e.id AS expected_chapter_id,
  c.id IS NOT NULL              AS present_in_db,
  c.subject_id,
  c.name                        AS db_name,
  c.chapter_number,
  c.weightage,
  c.avg_questions
FROM expected e
LEFT JOIN med_chapters c ON c.id = e.id
ORDER BY e.id;

-- ── 3. Are all 20 expected CUET Agri topics present? ─────────────────────
WITH expected(id, chapter_id) AS (
  VALUES
    -- Agrometeorology
    ('cuet-agri-agm-climate',       'cuet-agri-agrometeorology'),
    ('cuet-agri-agm-biochemistry',  'cuet-agri-agrometeorology'),
    ('cuet-agri-agm-microbiology',  'cuet-agri-agrometeorology'),
    ('cuet-agri-agm-genetics',      'cuet-agri-agrometeorology'),
    ('cuet-agri-agm-breeding',      'cuet-agri-agrometeorology'),
    -- Livestock
    ('cuet-agri-ls-dairy',          'cuet-agri-livestock'),
    ('cuet-agri-ls-poultry',        'cuet-agri-livestock'),
    ('cuet-agri-ls-nutrition',      'cuet-agri-livestock'),
    ('cuet-agri-ls-breeding',       'cuet-agri-livestock'),
    ('cuet-agri-ls-disease',        'cuet-agri-livestock'),
    -- Crop Production
    ('cuet-agri-cp-intro',          'cuet-agri-crop-production'),
    ('cuet-agri-cp-soil-nutrients', 'cuet-agri-crop-production'),
    ('cuet-agri-cp-irrigation',     'cuet-agri-crop-production'),
    ('cuet-agri-cp-weeds-pests',    'cuet-agri-crop-production'),
    ('cuet-agri-cp-major-crops',    'cuet-agri-crop-production'),
    -- Horticulture
    ('cuet-agri-hort-fruits',       'cuet-agri-horticulture'),
    ('cuet-agri-hort-vegetables',   'cuet-agri-horticulture'),
    ('cuet-agri-hort-floriculture', 'cuet-agri-horticulture'),
    ('cuet-agri-hort-preservation', 'cuet-agri-horticulture'),
    ('cuet-agri-hort-propagation',  'cuet-agri-horticulture')
)
SELECT
  e.id                     AS expected_topic_id,
  e.chapter_id             AS expected_chapter_id,
  t.id IS NOT NULL         AS present_in_db,
  t.chapter_id = e.chapter_id AS chapter_matches,
  t.name                   AS db_topic_name,
  t.is_active
FROM expected e
LEFT JOIN med_topics t ON t.id = e.id
ORDER BY e.chapter_id, e.id;

-- ── 4. Any extra agri topics in DB beyond the expected 20? ────────────────
SELECT id, chapter_id, name
FROM med_topics
WHERE chapter_id LIKE 'cuet-agri-%'
  AND id NOT IN (
    'cuet-agri-agm-climate','cuet-agri-agm-biochemistry','cuet-agri-agm-microbiology',
    'cuet-agri-agm-genetics','cuet-agri-agm-breeding',
    'cuet-agri-ls-dairy','cuet-agri-ls-poultry','cuet-agri-ls-nutrition',
    'cuet-agri-ls-breeding','cuet-agri-ls-disease',
    'cuet-agri-cp-intro','cuet-agri-cp-soil-nutrients','cuet-agri-cp-irrigation',
    'cuet-agri-cp-weeds-pests','cuet-agri-cp-major-crops',
    'cuet-agri-hort-fruits','cuet-agri-hort-vegetables','cuet-agri-hort-floriculture',
    'cuet-agri-hort-preservation','cuet-agri-hort-propagation'
  );

-- ── 5. Current question count for agri (expected 0 if not yet imported) ───
SELECT chapter_id, COUNT(*) AS question_count
FROM med_questions
WHERE chapter_id LIKE 'cuet-agri-%'
GROUP BY chapter_id
ORDER BY chapter_id;
