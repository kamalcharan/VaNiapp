-- Comprehensive topic_id backfill for ALL questions.
-- This migration:
--   1. Re-runs fuzzy matching with additional strategies (reverse-contains, word-overlap)
--   2. Auto-creates topics for any payload names that STILL don't match
--   3. Does a final exact-match pass to assign the newly created topics
--
-- Safe to run multiple times (idempotent).

-- ═══════════════════════════════════════════════════════════════
-- STEP 1: Exact case-insensitive match (re-run for safety)
-- ═══════════════════════════════════════════════════════════════
UPDATE med_questions q
SET    topic_id = t.id
FROM   med_topics t
WHERE  q.topic_id IS NULL
  AND  q.chapter_id = t.chapter_id
  AND  lower(trim(t.name)) = lower(trim(
         COALESCE(q.payload->>'topic_name', q.payload->>'topic')
       ));

-- ═══════════════════════════════════════════════════════════════
-- STEP 2: Normalized match — strip possessives, filler words, collapse whitespace
-- ═══════════════════════════════════════════════════════════════
UPDATE med_questions q
SET    topic_id = t.id
FROM   med_topics t
WHERE  q.topic_id IS NULL
  AND  q.chapter_id = t.chapter_id
  AND  regexp_replace(
         regexp_replace(
           regexp_replace(lower(trim(t.name)), '''s\b', '', 'g'),
           '\b(and|of|the|in|on|for|with|its)\b', '', 'g'
         ), '\s+', ' ', 'g'
       )
     = regexp_replace(
         regexp_replace(
           regexp_replace(lower(trim(COALESCE(q.payload->>'topic_name', q.payload->>'topic'))), '''s\b', '', 'g'),
           '\b(and|of|the|in|on|for|with|its)\b', '', 'g'
         ), '\s+', ' ', 'g'
       );

-- ═══════════════════════════════════════════════════════════════
-- STEP 3: Contains match — DB topic name found within payload topic name
-- ═══════════════════════════════════════════════════════════════
UPDATE med_questions q
SET    topic_id = (
  SELECT t.id FROM med_topics t
  WHERE  t.chapter_id = q.chapter_id
    AND  lower(trim(COALESCE(q.payload->>'topic_name', q.payload->>'topic')))
         LIKE '%' || lower(trim(t.name)) || '%'
  ORDER BY length(t.name) DESC  -- prefer longest (most specific) match
  LIMIT 1
)
WHERE  q.topic_id IS NULL
  AND  COALESCE(q.payload->>'topic_name', q.payload->>'topic') IS NOT NULL;

-- ═══════════════════════════════════════════════════════════════
-- STEP 4: Normalized contains — strip possessives/fillers then contains
-- ═══════════════════════════════════════════════════════════════
UPDATE med_questions q
SET    topic_id = (
  SELECT t.id FROM med_topics t
  WHERE  t.chapter_id = q.chapter_id
    AND  regexp_replace(
           regexp_replace(
             regexp_replace(lower(trim(COALESCE(q.payload->>'topic_name', q.payload->>'topic'))), '''s\b', '', 'g'),
             '\b(and|of|the|in|on|for|with|its)\b', '', 'g'
           ), '\s+', ' ', 'g'
         )
         LIKE '%' || regexp_replace(
           regexp_replace(
             regexp_replace(lower(trim(t.name)), '''s\b', '', 'g'),
             '\b(and|of|the|in|on|for|with|its)\b', '', 'g'
           ), '\s+', ' ', 'g'
         ) || '%'
  ORDER BY length(t.name) DESC
  LIMIT 1
)
WHERE  q.topic_id IS NULL
  AND  COALESCE(q.payload->>'topic_name', q.payload->>'topic') IS NOT NULL;

-- ═══════════════════════════════════════════════════════════════
-- STEP 5: Reverse contains — payload topic name found within DB topic name
-- ═══════════════════════════════════════════════════════════════
UPDATE med_questions q
SET    topic_id = (
  SELECT t.id FROM med_topics t
  WHERE  t.chapter_id = q.chapter_id
    AND  lower(trim(t.name))
         LIKE '%' || lower(trim(COALESCE(q.payload->>'topic_name', q.payload->>'topic'))) || '%'
  ORDER BY length(t.name) ASC  -- prefer shortest (most specific) match
  LIMIT 1
)
WHERE  q.topic_id IS NULL
  AND  COALESCE(q.payload->>'topic_name', q.payload->>'topic') IS NOT NULL
  AND  length(trim(COALESCE(q.payload->>'topic_name', q.payload->>'topic'))) >= 4;  -- avoid matching tiny strings

-- ═══════════════════════════════════════════════════════════════
-- STEP 6: Normalized reverse contains
-- ═══════════════════════════════════════════════════════════════
UPDATE med_questions q
SET    topic_id = (
  SELECT t.id FROM med_topics t
  WHERE  t.chapter_id = q.chapter_id
    AND  regexp_replace(
           regexp_replace(
             regexp_replace(lower(trim(t.name)), '''s\b', '', 'g'),
             '\b(and|of|the|in|on|for|with|its)\b', '', 'g'
           ), '\s+', ' ', 'g'
         )
         LIKE '%' || regexp_replace(
           regexp_replace(
             regexp_replace(lower(trim(COALESCE(q.payload->>'topic_name', q.payload->>'topic'))), '''s\b', '', 'g'),
             '\b(and|of|the|in|on|for|with|its)\b', '', 'g'
           ), '\s+', ' ', 'g'
         ) || '%'
  ORDER BY length(t.name) ASC
  LIMIT 1
)
WHERE  q.topic_id IS NULL
  AND  COALESCE(q.payload->>'topic_name', q.payload->>'topic') IS NOT NULL
  AND  length(trim(COALESCE(q.payload->>'topic_name', q.payload->>'topic'))) >= 4;

-- ═══════════════════════════════════════════════════════════════
-- STEP 7: Word-overlap matching (like the JS resolveTopicId step 4)
--   Split both names into words, count common words.
--   Require ≥2 common words AND overlap ratio ≥ 0.5
-- ═══════════════════════════════════════════════════════════════
UPDATE med_questions q
SET    topic_id = (
  SELECT t.id FROM med_topics t
  WHERE  t.chapter_id = q.chapter_id
    AND  (
      SELECT COUNT(*) FROM unnest(
        regexp_split_to_array(
          regexp_replace(regexp_replace(lower(trim(t.name)), '''s\b', '', 'g'), '[^a-z0-9 ]', '', 'g'),
          '\s+'
        )
      ) w
      WHERE w = ANY(
        regexp_split_to_array(
          regexp_replace(regexp_replace(lower(trim(COALESCE(q.payload->>'topic_name', q.payload->>'topic'))), '''s\b', '', 'g'), '[^a-z0-9 ]', '', 'g'),
          '\s+'
        )
      )
    ) >= 2  -- at least 2 words in common
    AND (
      SELECT COUNT(*) FROM unnest(
        regexp_split_to_array(
          regexp_replace(regexp_replace(lower(trim(t.name)), '''s\b', '', 'g'), '[^a-z0-9 ]', '', 'g'),
          '\s+'
        )
      ) w
      WHERE w = ANY(
        regexp_split_to_array(
          regexp_replace(regexp_replace(lower(trim(COALESCE(q.payload->>'topic_name', q.payload->>'topic'))), '''s\b', '', 'g'), '[^a-z0-9 ]', '', 'g'),
          '\s+'
        )
      )
    )::float / GREATEST(
      array_length(
        regexp_split_to_array(
          regexp_replace(regexp_replace(lower(trim(t.name)), '''s\b', '', 'g'), '[^a-z0-9 ]', '', 'g'),
          '\s+'
        ), 1
      ), 1
    ) >= 0.5  -- at least 50% word overlap
  ORDER BY (
    SELECT COUNT(*) FROM unnest(
      regexp_split_to_array(
        regexp_replace(regexp_replace(lower(trim(t.name)), '''s\b', '', 'g'), '[^a-z0-9 ]', '', 'g'),
        '\s+'
      )
    ) w
    WHERE w = ANY(
      regexp_split_to_array(
        regexp_replace(regexp_replace(lower(trim(COALESCE(q.payload->>'topic_name', q.payload->>'topic'))), '''s\b', '', 'g'), '[^a-z0-9 ]', '', 'g'),
        '\s+'
      )
    )
  ) DESC,  -- prefer most word overlap
  length(t.name) DESC  -- then longest name
  LIMIT 1
)
WHERE  q.topic_id IS NULL
  AND  COALESCE(q.payload->>'topic_name', q.payload->>'topic') IS NOT NULL;

-- ═══════════════════════════════════════════════════════════════
-- STEP 8: Known edge-case mappings
-- ═══════════════════════════════════════════════════════════════

-- Gauss's Theorem → Gauss Law
UPDATE med_questions
SET    topic_id = 'phy-elec-gauss'
WHERE  topic_id IS NULL
  AND  chapter_id = 'phy-electrostatics'
  AND  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%gauss%';

-- Thermal properties / Calorimetry → Thermodynamic Processes
UPDATE med_questions
SET    topic_id = 'phy-thermo-processes'
WHERE  topic_id IS NULL
  AND  chapter_id = 'phy-thermodynamics'
  AND  (lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%thermal%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%calori%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%heat%');

-- Drift velocity / Current density → Ohm Law
UPDATE med_questions
SET    topic_id = 'phy-curr-ohm'
WHERE  topic_id IS NULL
  AND  chapter_id = 'phy-current-electricity'
  AND  (lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%drift%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%current density%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%resistivity%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%resistance%');

-- Moving charges / Lorentz force → Force on Current Carrying Conductor
UPDATE med_questions
SET    topic_id = 'phy-mag-force'
WHERE  topic_id IS NULL
  AND  chapter_id = 'phy-magnetic-effects'
  AND  (lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%lorentz%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%moving charge%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%force on%');

-- Magnetism / Earth's magnetism → Magnetic Materials
UPDATE med_questions
SET    topic_id = 'phy-mag-materials'
WHERE  topic_id IS NULL
  AND  chapter_id = 'phy-magnetic-effects'
  AND  (lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%earth%magnet%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%magnetism%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%magnetic dipole%');

-- Self/Mutual inductance → Faraday Law
UPDATE med_questions
SET    topic_id = 'phy-emi-faraday'
WHERE  topic_id IS NULL
  AND  chapter_id = 'phy-em-induction'
  AND  (lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%inductance%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%eddy%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%motional emf%');

-- Displacement current → Properties of EM Waves
UPDATE med_questions
SET    topic_id = 'phy-emw-properties'
WHERE  topic_id IS NULL
  AND  chapter_id = 'phy-em-waves'
  AND  (lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%displacement%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%maxwell%');

-- Reflection/Refraction/Mirror/Lens → Ray Optics
UPDATE med_questions
SET    topic_id = 'phy-opt-ray'
WHERE  topic_id IS NULL
  AND  chapter_id = 'phy-optics'
  AND  (lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%reflect%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%refract%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%mirror%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%lens%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%prism%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%tir%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%total internal%');

-- YDSE / Young's / Huygens → Wave Optics or Interference
UPDATE med_questions
SET    topic_id = 'phy-opt-interference'
WHERE  topic_id IS NULL
  AND  chapter_id = 'phy-optics'
  AND  (lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%young%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%ydse%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%huygens%');

-- X-rays / Matter waves / Davisson-Germer → de Broglie
UPDATE med_questions
SET    topic_id = 'phy-dual-debroglie'
WHERE  topic_id IS NULL
  AND  chapter_id = 'phy-dual-nature'
  AND  (lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%de broglie%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%matter wave%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%davisson%');

-- Nuclear fission/fusion/binding energy → Nuclear Physics
UPDATE med_questions
SET    topic_id = 'phy-atom-nuclear'
WHERE  topic_id IS NULL
  AND  chapter_id = 'phy-atoms-nuclei'
  AND  (lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%nuclear%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%fission%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%fusion%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%binding energy%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%mass defect%');

-- Alpha/Beta/Gamma decay → Radioactivity
UPDATE med_questions
SET    topic_id = 'phy-atom-radioactivity'
WHERE  topic_id IS NULL
  AND  chapter_id = 'phy-atoms-nuclei'
  AND  (lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%decay%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%half life%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%half-life%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%radioact%');

-- Rectifier / Zener → p-n Junction Diode
UPDATE med_questions
SET    topic_id = 'phy-elec-diode'
WHERE  topic_id IS NULL
  AND  chapter_id = 'phy-electronic-devices'
  AND  (lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%rectif%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%zener%'
    OR  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%diode%');

-- ═══════════════════════════════════════════════════════════════
-- STEP 9: AUTO-CREATE missing topics for any remaining unmatched names
--   This is the permanent fix — if a payload topic name doesn't match
--   ANY existing med_topics entry, we create a new topic for it.
-- ═══════════════════════════════════════════════════════════════

-- First, create a temp table with distinct unmatched (chapter_id, topic_name) pairs
CREATE TEMP TABLE _unmatched_topics AS
SELECT DISTINCT
  q.chapter_id,
  trim(COALESCE(q.payload->>'topic_name', q.payload->>'topic')) AS topic_name
FROM med_questions q
WHERE q.topic_id IS NULL
  AND q.chapter_id IS NOT NULL
  AND COALESCE(q.payload->>'topic_name', q.payload->>'topic') IS NOT NULL
  AND trim(COALESCE(q.payload->>'topic_name', q.payload->>'topic')) != '';

-- Generate a deterministic topic ID from chapter_id + topic_name
-- Format: {chapter_id}-auto-{first 20 chars of slugified name}
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important)
SELECT
  u.chapter_id || '-auto-' || left(
    regexp_replace(
      regexp_replace(lower(u.topic_name), '[^a-z0-9]+', '-', 'g'),
      '(^-|-$)', '', 'g'
    ), 30
  ) AS id,
  u.chapter_id,
  u.topic_name,
  100,  -- high sort_order so they appear at the end
  false
FROM _unmatched_topics u
ON CONFLICT (id) DO NOTHING;

-- Final backfill: exact match on the newly created topics
UPDATE med_questions q
SET    topic_id = t.id
FROM   med_topics t
WHERE  q.topic_id IS NULL
  AND  q.chapter_id = t.chapter_id
  AND  lower(trim(t.name)) = lower(trim(
         COALESCE(q.payload->>'topic_name', q.payload->>'topic')
       ));

DROP TABLE IF EXISTS _unmatched_topics;

-- ═══════════════════════════════════════════════════════════════
-- STEP 10: Fallback — assign first topic of chapter for any stragglers
--   Questions with NULL topic_id AND NULL/empty payload topic name
-- ═══════════════════════════════════════════════════════════════
UPDATE med_questions q
SET    topic_id = (
  SELECT t.id FROM med_topics t
  WHERE  t.chapter_id = q.chapter_id
  ORDER BY t.sort_order ASC
  LIMIT 1
)
WHERE  q.topic_id IS NULL
  AND  q.chapter_id IS NOT NULL;

-- ═══════════════════════════════════════════════════════════════
-- VERIFY: Count remaining questions with NULL topic_id
-- ═══════════════════════════════════════════════════════════════
SELECT
  'REMAINING NULL topic_id' AS status,
  COUNT(*) AS count
FROM med_questions
WHERE topic_id IS NULL;
