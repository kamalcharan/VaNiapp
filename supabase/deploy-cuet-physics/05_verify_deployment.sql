-- ==========================================================================
-- DEPLOY STEP 5: Verify deployment — run this to check counts
-- ==========================================================================

-- Total questions per chapter
SELECT c.name AS chapter, COUNT(q.id) AS question_count
FROM med_chapters c
LEFT JOIN med_questions q ON q.chapter_id = c.id
WHERE c.subject_id = 'cuet-physics'
GROUP BY c.name, c.sort_order
ORDER BY c.sort_order;

-- Total questions per topic
SELECT t.name AS topic, c.name AS chapter, COUNT(q.id) AS question_count
FROM med_topics t
JOIN med_chapters c ON c.id = t.chapter_id
LEFT JOIN med_questions q ON q.topic_id = t.id
WHERE c.subject_id = 'cuet-physics'
GROUP BY t.name, c.name, t.sort_order
ORDER BY c.name, t.sort_order;

-- Grand total
SELECT COUNT(*) AS total_cuet_physics_questions
FROM med_questions
WHERE subject_id = 'cuet-physics';
