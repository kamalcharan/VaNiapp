-- DIAGNOSTIC: Find all payload topic names that have NO matching med_topics entry.
-- Run this AFTER 20260306_add_missing_topics.sql to see what's still unmatched.

SELECT
  q.chapter_id,
  COALESCE(q.payload->>'topic_name', q.payload->>'topic') AS payload_topic,
  COUNT(*) AS question_count
FROM med_questions q
LEFT JOIN med_topics t
  ON t.chapter_id = q.chapter_id
  AND (
    -- Exact match
    lower(trim(t.name)) = lower(trim(COALESCE(q.payload->>'topic_name', q.payload->>'topic')))
    -- Contains match
    OR lower(trim(COALESCE(q.payload->>'topic_name', q.payload->>'topic'))) LIKE '%' || lower(trim(t.name)) || '%'
    -- Normalized contains (strip possessives)
    OR regexp_replace(lower(trim(COALESCE(q.payload->>'topic_name', q.payload->>'topic'))), '''s\b', '', 'g')
       LIKE '%' || regexp_replace(lower(trim(t.name)), '''s\b', '', 'g') || '%'
  )
WHERE q.topic_id IS NULL
  AND q.subject_id IN ('physics', 'zoology', 'botany', 'chemistry')
  AND COALESCE(q.payload->>'topic_name', q.payload->>'topic') IS NOT NULL
  AND t.id IS NULL  -- no match found
GROUP BY q.chapter_id, COALESCE(q.payload->>'topic_name', q.payload->>'topic')
ORDER BY question_count DESC, q.chapter_id;
