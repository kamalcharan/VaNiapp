-- Backfill topic_id for questions that have payload->>'topic' matching med_topics.name
-- Covers zoology questions (zoo-animal-kingdom and zoo-structural-organization)
-- where topic_id was NULL but payload contained the topic name

UPDATE med_questions q
SET topic_id = t.id,
    updated_at = now()
FROM med_topics t
WHERE t.chapter_id = q.chapter_id
  AND t.name = q.payload->>'topic'
  AND q.topic_id IS NULL
  AND q.payload->>'topic' IS NOT NULL
  AND q.status = 'active';
