-- ════════════════════════════════════════════════════════════════════════════
-- Release v1.2 — CUET + Telugu & Hindi Language Support
-- ════════════════════════════════════════════════════════════════════════════
-- Mark v1.1 as legacy, insert v1.2 as active.

UPDATE med_app_versions SET status = 'legacy' WHERE version = '1.1' AND status = 'active';

INSERT INTO med_app_versions (version, status, release_notes, download_url, android_download_url, android_download_tinyurl, is_skippable)
VALUES (
  '1.2.0',
  'active',
  'CUET exam support, Telugu and Hindi language release',
  'https://drive.google.com/file/d/1voRW2HKpdj6rn82cPKivSwXxD0IT5qKd/view?usp=sharing',
  'https://drive.google.com/file/d/1voRW2HKpdj6rn82cPKivSwXxD0IT5qKd/view?usp=sharing',
  'https://tinyurl.com/fks8szmr',
  false
)
ON CONFLICT (version) DO UPDATE SET
  status = 'active',
  release_notes = EXCLUDED.release_notes,
  download_url = EXCLUDED.download_url,
  android_download_url = EXCLUDED.android_download_url,
  android_download_tinyurl = EXCLUDED.android_download_tinyurl,
  is_skippable = EXCLUDED.is_skippable;
