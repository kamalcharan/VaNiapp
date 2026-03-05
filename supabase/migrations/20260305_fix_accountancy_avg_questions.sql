-- Fix avg_questions for accountancy chapters to match actual question counts.
-- cuet-acc-npo and cuet-acc-computerized have 0 questions in med_questions
-- but had non-zero avg_questions in the catalog, misleading users.
-- Also backfill important_topics for ratio-analysis and cash-flow.

-- Update avg_questions from actual counts
UPDATE med_chapters SET avg_questions = sub.q_count
FROM (
  SELECT chapter_id, count(*) as q_count
  FROM med_questions
  WHERE chapter_id LIKE 'cuet-acc%'
  GROUP BY chapter_id
) sub
WHERE med_chapters.id = sub.chapter_id;

-- Chapters with no questions at all -> avg_questions = 0
UPDATE med_chapters SET avg_questions = 0
WHERE subject_id = 'accountancy'
  AND id NOT IN (SELECT DISTINCT chapter_id FROM med_questions);

-- Backfill important_topics for chapters that were missing them
UPDATE med_chapters
SET important_topics = '{"Current ratio", "Quick ratio", "Debt-equity ratio", "Gross profit ratio", "Return on investment"}'
WHERE id = 'cuet-acc-ratio-analysis' AND (important_topics IS NULL OR important_topics = '{}');

UPDATE med_chapters
SET important_topics = '{"Operating activities", "Investing activities", "Financing activities", "Direct method", "Indirect method"}'
WHERE id = 'cuet-acc-cash-flow' AND (important_topics IS NULL OR important_topics = '{}');
