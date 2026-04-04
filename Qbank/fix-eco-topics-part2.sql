-- PART 2: Link economics questions to their topics (run AFTER part 1)

UPDATE med_questions mq
SET topic_id = mt.id
FROM med_topics mt
WHERE mq.topic_id IS NULL
  AND mq.chapter_id = mt.chapter_id
  AND LOWER(TRIM(mq.payload->>'topic')) = LOWER(TRIM(mt.name));

-- Verify: how many still missing?
SELECT COUNT(*) as still_missing
FROM med_questions
WHERE topic_id IS NULL AND subject_id = 'economics';
