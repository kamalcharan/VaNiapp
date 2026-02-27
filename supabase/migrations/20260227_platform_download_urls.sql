-- ════════════════════════════════════════════════════════════════════════════
-- Platform-specific download URLs for med_app_versions
-- ════════════════════════════════════════════════════════════════════════════
-- Adds separate Android/iOS download URLs (full + tinyurl) so the app can
-- detect the user's platform and show the correct download link.
-- The old `download_url` column is kept for backward compatibility (WhatsApp bot).

ALTER TABLE med_app_versions
  ADD COLUMN IF NOT EXISTS android_download_url     text,
  ADD COLUMN IF NOT EXISTS android_download_tinyurl text,
  ADD COLUMN IF NOT EXISTS ios_download_url         text,
  ADD COLUMN IF NOT EXISTS ios_download_tinyurl     text;

-- Back-fill v1.1: copy existing download_url into android columns
UPDATE med_app_versions
  SET android_download_url = download_url
WHERE version = '1.1' AND download_url IS NOT NULL AND android_download_url IS NULL;
