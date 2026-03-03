-- ==========================================================================
-- MIGRATION 6: Fix duplicate questions — merge image URLs + remove old rows
--
-- PROBLEM:
--   The original batch SQL (20260301) inserted 93 questions with image_url
--   set (via upload scripts), but options were only in payload JSONB.
--   The step3 migration (20260302) inserted 93 NEW rows with options in
--   med_question_options, but image_url = NULL.
--   Result: 186 duplicate questions. New ones have options but no images.
--
-- FIX:
--   1. Copy image_url from old rows → new rows (matching by payload question_id)
--   2. Sync image_url into payload.image_uri
--   3. Delete old duplicate rows (which have no options in med_question_options)
-- ==========================================================================

BEGIN;

-- ═══════════════════════════════════════════════════════════════════
-- STEP 1: Diagnostic — show duplicate counts before fix
-- ═══════════════════════════════════════════════════════════════════
DO $$
DECLARE
  total_correction int;
  with_options int;
  without_options int;
  with_image_url int;
BEGIN
  SELECT count(*) INTO total_correction
  FROM med_questions
  WHERE source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3');

  SELECT count(DISTINCT q.id) INTO with_options
  FROM med_questions q
  JOIN med_question_options o ON o.question_id = q.id
  WHERE q.source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3');

  without_options := total_correction - with_options;

  SELECT count(*) INTO with_image_url
  FROM med_questions
  WHERE source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3')
    AND image_url IS NOT NULL
    AND image_url LIKE 'http%';

  RAISE NOTICE '── Before fix ──';
  RAISE NOTICE 'Total correction questions: %', total_correction;
  RAISE NOTICE 'With options (new rows):    %', with_options;
  RAISE NOTICE 'Without options (old rows):  %', without_options;
  RAISE NOTICE 'With HTTP image_url:         %', with_image_url;
END $$;

-- ═══════════════════════════════════════════════════════════════════
-- STEP 2: Copy image_url from old rows to new rows
-- Match by payload->>'question_id' (unique per question)
-- ═══════════════════════════════════════════════════════════════════
UPDATE med_questions AS new_q
SET
  image_url = old_q.image_url,
  image_alt = COALESCE(new_q.image_alt, old_q.image_alt),
  payload = CASE
    WHEN old_q.image_url IS NOT NULL AND old_q.image_url LIKE 'http%'
    THEN jsonb_set(new_q.payload, '{image_uri}', to_jsonb(old_q.image_url))
    ELSE new_q.payload
  END
FROM med_questions AS old_q
WHERE
  -- Match by question_id in payload
  new_q.payload->>'question_id' = old_q.payload->>'question_id'
  -- Different rows
  AND new_q.id != old_q.id
  -- old_q has the image URL, new_q doesn't
  AND old_q.image_url IS NOT NULL
  AND old_q.image_url LIKE 'http%'
  AND (new_q.image_url IS NULL OR new_q.image_url NOT LIKE 'http%')
  -- Both are correction batch questions
  AND new_q.source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3')
  AND old_q.source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3');

-- ═══════════════════════════════════════════════════════════════════
-- STEP 3: Delete old duplicate rows (no entries in med_question_options)
-- These are the rows from the original 20260301 batch SQL.
-- They have image_url but no options in the separate table.
-- ═══════════════════════════════════════════════════════════════════

-- First clean up any orphan hints for old rows
DELETE FROM med_elimination_hints
WHERE question_id IN (
  SELECT q.id
  FROM med_questions q
  WHERE q.source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3')
    AND NOT EXISTS (
      SELECT 1 FROM med_question_options o WHERE o.question_id = q.id
    )
);

-- Then delete the old duplicate questions
DELETE FROM med_questions
WHERE source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3')
  AND NOT EXISTS (
    SELECT 1 FROM med_question_options o WHERE o.question_id = med_questions.id
  );

-- ═══════════════════════════════════════════════════════════════════
-- STEP 4: Verification
-- ═══════════════════════════════════════════════════════════════════
DO $$
DECLARE
  remaining int;
  with_images int;
  with_opts int;
BEGIN
  SELECT count(*) INTO remaining
  FROM med_questions
  WHERE source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3');

  SELECT count(*) INTO with_images
  FROM med_questions
  WHERE source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3')
    AND image_url IS NOT NULL
    AND image_url LIKE 'http%'
    AND question_type = 'diagram-based';

  SELECT count(DISTINCT q.id) INTO with_opts
  FROM med_questions q
  JOIN med_question_options o ON o.question_id = q.id
  WHERE q.source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3');

  RAISE NOTICE '── After fix ──';
  RAISE NOTICE 'Total correction questions: % (should be 93)', remaining;
  RAISE NOTICE 'Diagram questions with HTTP image_url: % (should be 62)', with_images;
  RAISE NOTICE 'Questions with options: % (should be 93)', with_opts;

  IF remaining != 93 THEN
    RAISE WARNING '⚠ Expected 93 questions, got %', remaining;
  END IF;
END $$;

-- Show diagram questions status
SELECT
  payload->>'question_id' AS question_id,
  source,
  CASE WHEN image_url LIKE 'http%' THEN 'OK' ELSE 'MISSING' END AS image_status,
  (SELECT count(*) FROM med_question_options o WHERE o.question_id = q.id) AS option_count,
  LEFT(image_url, 60) AS image_url_preview
FROM med_questions q
WHERE question_type = 'diagram-based'
  AND source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3')
ORDER BY source, payload->>'question_id';

COMMIT;
