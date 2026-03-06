-- Backfill topic_id on med_questions where it is NULL
-- Matches payload->>'topic_name' or payload->>'topic' against med_topics.name
-- for the same chapter_id using fuzzy contains matching.

-- Step 1: Exact match
UPDATE med_questions q
SET    topic_id = t.id
FROM   med_topics t
WHERE  q.topic_id IS NULL
  AND  q.chapter_id = t.chapter_id
  AND  lower(trim(t.name)) = lower(trim(
         COALESCE(q.payload->>'topic_name', q.payload->>'topic')
       ));

-- Step 2: Contains match — DB topic name found within payload topic name
UPDATE med_questions q
SET    topic_id = (
  SELECT t.id FROM med_topics t
  WHERE  t.chapter_id = q.chapter_id
    AND  lower(trim(COALESCE(q.payload->>'topic_name', q.payload->>'topic')))
         LIKE '%' || lower(trim(t.name)) || '%'
  LIMIT 1
)
WHERE  q.topic_id IS NULL
  AND  COALESCE(q.payload->>'topic_name', q.payload->>'topic') IS NOT NULL;
