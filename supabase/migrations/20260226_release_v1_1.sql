-- ════════════════════════════════════════════════════════════════════════════
-- Release v1.1 — Question Bank + Razorpay Integration
-- ════════════════════════════════════════════════════════════════════════════
-- Mark v1.0 as legacy, insert v1.1 as active.
-- WhatsApp bot will notify users still on v1.0.

UPDATE med_app_versions SET status = 'legacy' WHERE version = '1.0' AND status = 'active';

INSERT INTO med_app_versions (version, status, release_notes)
VALUES (
  '1.1',
  'active',
  'Full Question Bank (6000+ NEET questions across all subjects), Razorpay payments, bug fixes'
)
ON CONFLICT (version) DO UPDATE SET
  status = 'active',
  release_notes = EXCLUDED.release_notes;
