-- Backfill topic_id on med_questions where it is NULL.
-- Run AFTER 20260306_add_missing_topics.sql so new topics exist first.
-- Uses progressively fuzzier matching strategies.

-- Step 1: Exact case-insensitive match
UPDATE med_questions q
SET    topic_id = t.id
FROM   med_topics t
WHERE  q.topic_id IS NULL
  AND  q.chapter_id = t.chapter_id
  AND  lower(trim(t.name)) = lower(trim(
         COALESCE(q.payload->>'topic_name', q.payload->>'topic')
       ));

-- Step 2: Normalized match — strip possessives and compare
UPDATE med_questions q
SET    topic_id = t.id
FROM   med_topics t
WHERE  q.topic_id IS NULL
  AND  q.chapter_id = t.chapter_id
  AND  regexp_replace(regexp_replace(lower(trim(t.name)), '''s\b', '', 'g'), '\s+', ' ', 'g')
     = regexp_replace(regexp_replace(lower(trim(COALESCE(q.payload->>'topic_name', q.payload->>'topic'))), '''s\b', '', 'g'), '\s+', ' ', 'g');

-- Step 3: Contains match — DB topic name found within payload topic name
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

-- Step 4: Normalized contains — strip possessives then do contains
UPDATE med_questions q
SET    topic_id = (
  SELECT t.id FROM med_topics t
  WHERE  t.chapter_id = q.chapter_id
    AND  regexp_replace(lower(trim(COALESCE(q.payload->>'topic_name', q.payload->>'topic'))), '''s\b', '', 'g')
         LIKE '%' || regexp_replace(lower(trim(t.name)), '''s\b', '', 'g') || '%'
  ORDER BY length(t.name) DESC
  LIMIT 1
)
WHERE  q.topic_id IS NULL
  AND  COALESCE(q.payload->>'topic_name', q.payload->>'topic') IS NOT NULL;

-- Step 5: Explicit mappings for edge cases where fuzzy matching can't resolve
--   "Gauss's Theorem and Applications" → phy-elec-gauss (Gauss Law) in NEET electrostatics
UPDATE med_questions
SET    topic_id = 'phy-elec-gauss'
WHERE  topic_id IS NULL
  AND  chapter_id = 'phy-electrostatics'
  AND  lower(COALESCE(payload->>'topic_name', payload->>'topic')) LIKE '%gauss%';
