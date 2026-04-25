-- Audit: does med_elimination_hints already cover what the local
-- src/data/explanations/*.ts wrong-answer cards provide?
--
-- The local files have 192 entries (8 chapters × 24 entries). Each entry
-- contains: questionId, selectedOptionId, misconception, correctReasoning,
-- tip, conceptTag.
--
-- med_elimination_hints already has option_key + hint_text + misconception
-- per (question, option). If most question/option pairs in the local files
-- already have rows in med_elimination_hints with a non-empty misconception,
-- we don't need a new med_wrong_answer_explanations table — we can rewrite
-- src/lib/explanationLookup.ts to read from med_elimination_hints and
-- delete the local explanation files.
--
-- Run these queries against the production project to decide.

-- ── Q1: How many med_elimination_hints rows exist per chapter, and how
--        many of them have a populated misconception field?
SELECT
  q.chapter_id,
  COUNT(*) FILTER (WHERE h.id IS NOT NULL) AS total_hints,
  COUNT(*) FILTER (WHERE h.misconception IS NOT NULL AND length(trim(h.misconception)) > 0) AS hints_with_misconception,
  COUNT(DISTINCT q.id) AS questions_with_any_hint,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE h.misconception IS NOT NULL AND length(trim(h.misconception)) > 0)
    / NULLIF(COUNT(*) FILTER (WHERE h.id IS NOT NULL), 0),
    1
  ) AS pct_with_misconception
FROM med_questions q
LEFT JOIN med_elimination_hints h ON h.question_id = q.id
WHERE q.subject_id IN ('physics', 'chemistry', 'botany', 'zoology')
  AND q.status = 'active'
GROUP BY q.chapter_id
ORDER BY q.chapter_id;


-- ── Q2: Per chapter, what fraction of (question, wrong_option) pairs have
--        a misconception field? This is the rate that matters: WrongAnswerCard
--        only renders for the option the user selected when wrong.
WITH wrong_pairs AS (
  SELECT q.id AS question_id, q.chapter_id, o.option_key
  FROM med_questions q
  JOIN med_question_options o ON o.question_id = q.id
  WHERE q.status = 'active'
    AND o.is_correct = false
    AND q.subject_id IN ('physics', 'chemistry', 'botany', 'zoology')
)
SELECT
  wp.chapter_id,
  COUNT(*) AS total_wrong_pairs,
  COUNT(h.id) AS pairs_with_hint,
  COUNT(*) FILTER (WHERE h.misconception IS NOT NULL AND length(trim(h.misconception)) > 0) AS pairs_with_misconception,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE h.misconception IS NOT NULL AND length(trim(h.misconception)) > 0)
    / NULLIF(COUNT(*), 0),
    1
  ) AS pct_pairs_with_misconception
FROM wrong_pairs wp
LEFT JOIN med_elimination_hints h
  ON h.question_id = wp.question_id AND h.option_key = wp.option_key
GROUP BY wp.chapter_id
ORDER BY wp.chapter_id;


-- ── Q3: Sample 5 hints per chapter so you can eyeball whether the existing
--        misconception text reads like the WrongAnswerCard expects.
SELECT
  q.chapter_id,
  q.id AS question_id,
  h.option_key,
  h.misconception,
  h.hint_text
FROM med_questions q
JOIN med_elimination_hints h ON h.question_id = q.id
WHERE q.status = 'active'
  AND q.subject_id IN ('physics', 'chemistry', 'botany', 'zoology')
  AND h.misconception IS NOT NULL
  AND length(trim(h.misconception)) > 0
ORDER BY q.chapter_id, q.id
LIMIT 40;


-- ── Decision rule
-- If Q2's pct_pairs_with_misconception is consistently ≥ 70% across chapters
-- and Q3's samples look like reasonable WrongAnswerCard content, we DON'T
-- need a new table. Rewrite explanationLookup.ts to query
-- med_elimination_hints and delete src/data/explanations/*.
--
-- If coverage is < 70% or quality is poor, treat med_elimination_hints as
-- partial coverage and add med_wrong_answer_explanations as a richer
-- supplementary table (with backfill from local files for the existing
-- 192 entries, plus an admin tool for new content).
