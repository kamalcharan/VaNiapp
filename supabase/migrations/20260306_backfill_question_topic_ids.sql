-- Backfill topic_id on med_questions where it is NULL
-- Matches payload->>'topic_name' or payload->>'topic' against med_topics.name
-- for the same chapter_id (case-insensitive).

UPDATE med_questions q
SET    topic_id = t.id
FROM   med_topics t
WHERE  q.topic_id IS NULL
  AND  q.chapter_id = t.chapter_id
  AND  lower(trim(t.name)) = lower(trim(
         COALESCE(q.payload->>'topic_name', q.payload->>'topic')
       ));
