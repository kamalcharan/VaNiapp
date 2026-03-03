-- ==========================================================================
-- BATCH 3 FIX: Copy image_url from DB column into payload.image_uri
--
-- The app reads image_uri from the payload JSON, not the image_url column.
-- This UPDATE syncs them so diagrams render correctly in the quiz screen.
-- Only affects batch 3 diagram questions where image_url was already set
-- by the upload script.
-- ==========================================================================

BEGIN;

UPDATE med_questions
SET payload = jsonb_set(
  payload,
  '{image_uri}',
  to_jsonb(image_url)
)
WHERE source = 'correction-batch-3'
  AND image_url IS NOT NULL
  AND question_type = 'diagram-based';

-- Verify: should return 28 rows with matching URLs
SELECT
  payload->>'question_id' AS question_id,
  image_url AS db_image_url,
  payload->>'image_uri' AS payload_image_uri,
  CASE
    WHEN image_url = payload->>'image_uri' THEN 'OK'
    ELSE 'MISMATCH'
  END AS status
FROM med_questions
WHERE source = 'correction-batch-3'
  AND question_type = 'diagram-based'
ORDER BY payload->>'question_id';

COMMIT;
