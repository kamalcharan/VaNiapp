-- ==========================================================================
-- MIGRATION 5: Fix diagram image URLs for all 62 diagram-based questions
--
-- PROBLEM: payload.image_uri has relative paths like "diagrams/cuet-phy-atom-bohr-d01.png"
-- but the app needs full HTTP URLs (DiagramBasedQuestion.tsx checks startsWith('http')).
--
-- This migration:
--   1. Sets image_url column to the correct Supabase Storage public URL
--   2. Syncs the URL into payload.image_uri so both paths work
--
-- PREREQUISITES:
--   - Run step1, step2, step3 migrations first (questions must exist)
--   - Upload all 62 PNG images to Supabase Storage bucket "question-images"
--     using the upload scripts OR manually via Dashboard
--
-- HOW TO UPLOAD IMAGES (choose one):
--   Option A: Run upload scripts
--     1. Create Qbank/config.json from config.example.json with your service key
--     2. node Qbank/corrections/upload_batch1_diagrams.js
--     3. node Qbank/corrections/upload_batch2_diagrams.js
--     4. node Qbank/corrections/upload_batch3_diagrams.js
--     (If you do this, scripts already set image_url — you can skip to the
--      payload sync section below)
--
--   Option B: Upload via Supabase Dashboard
--     1. Go to Storage > question-images bucket (create if missing, make PUBLIC)
--     2. Upload all 62 PNGs from Qbank/corrections/diagrams/ to the correct
--        storage paths listed in the mapping below
--     3. Then run THIS SQL to set the URLs
--
-- IMPORTANT: Replace the base URL below if your VaNi project URL is different.
-- ==========================================================================

BEGIN;

-- ┌──────────────────────────────────────────────────────────────────┐
-- │  BASE URL — change this if your Supabase project URL differs    │
-- └──────────────────────────────────────────────────────────────────┘
-- The URL from Qbank/config.example.json is used here.
-- Format: https://<project-ref>.supabase.co/storage/v1/object/public/question-images/

DO $$
DECLARE
  base_url text := 'https://cuagygysqsihzesawfjn.supabase.co/storage/v1/object/public/question-images/';
  rec record;
  full_url text;
  updated_count int := 0;
BEGIN

  -- ═══════════════════════════════════════════════════════════════
  -- Mapping: question_id → storage path (from upload scripts)
  -- ═══════════════════════════════════════════════════════════════
  CREATE TEMP TABLE _diagram_map (question_id text, storage_path text) ON COMMIT DROP;

  INSERT INTO _diagram_map (question_id, storage_path) VALUES
    -- ── Batch 1: Atoms & Nuclei ──
    ('cuet-phy-atom-bohr-d01',    'cuet-physics/atoms-nuclei/cuet-phy-atom-bohr-d01.png'),
    ('cuet-phy-atom-bohr-d02',    'cuet-physics/atoms-nuclei/cuet-phy-atom-bohr-d02.png'),
    ('cuet-phy-atom-spectra-d01', 'cuet-physics/atoms-nuclei/cuet-phy-atom-spectra-d01.png'),
    ('cuet-phy-atom-spectra-d02', 'cuet-physics/atoms-nuclei/cuet-phy-atom-spectra-d02.png'),
    ('cuet-phy-nuclei-decay-d01', 'cuet-physics/atoms-nuclei/cuet-phy-nuclei-decay-d01.png'),
    ('cuet-phy-nuclei-decay-d02', 'cuet-physics/atoms-nuclei/cuet-phy-nuclei-decay-d02.png'),
    ('cuet-phy-nuclei-prop-d01',  'cuet-physics/atoms-nuclei/cuet-phy-nuclei-prop-d01.png'),
    ('cuet-phy-nuclei-prop-d02',  'cuet-physics/atoms-nuclei/cuet-phy-nuclei-prop-d02.png'),
    -- ── Batch 1: Current Electricity ──
    ('cuet-phy-current-ohm-d01',   'cuet-physics/current-electricity/cuet-phy-current-ohm-d01.png'),
    ('cuet-phy-current-ohm-d02',   'cuet-physics/current-electricity/cuet-phy-current-ohm-d02.png'),
    ('cuet-phy-current-kirch-d01', 'cuet-physics/current-electricity/cuet-phy-current-kirch-d01.png'),
    ('cuet-phy-current-kirch-d02', 'cuet-physics/current-electricity/cuet-phy-current-kirch-d02.png'),
    ('cuet-phy-current-instr-d01', 'cuet-physics/current-electricity/cuet-phy-current-instr-d01.png'),
    ('cuet-phy-current-instr-d02', 'cuet-physics/current-electricity/cuet-phy-current-instr-d02.png'),
    -- ── Batch 2: Dual Nature ──
    ('cuet-phy-dual-debroglie-d01', 'cuet-physics/dual-nature/cuet-phy-dual-debroglie-d01.png'),
    ('cuet-phy-dual-debroglie-d02', 'cuet-physics/dual-nature/cuet-phy-dual-debroglie-d02.png'),
    ('cuet-phy-dual-photo-d01',     'cuet-physics/dual-nature/cuet-phy-dual-photo-d01.png'),
    ('cuet-phy-dual-photo-d02',     'cuet-physics/dual-nature/cuet-phy-dual-photo-d02.png'),
    -- ── Batch 2: Electronic Devices ──
    ('cuet-phy-semi-diode-d01',      'cuet-physics/electronic-devices/cuet-phy-semi-diode-d01.png'),
    ('cuet-phy-semi-diode-d02',      'cuet-physics/electronic-devices/cuet-phy-semi-diode-d02.png'),
    ('cuet-phy-semi-pn-d01',         'cuet-physics/electronic-devices/cuet-phy-semi-pn-d01.png'),
    ('cuet-phy-semi-pn-d02',         'cuet-physics/electronic-devices/cuet-phy-semi-pn-d02.png'),
    ('cuet-phy-semi-transistor-d01', 'cuet-physics/electronic-devices/cuet-phy-semi-transistor-d01.png'),
    ('cuet-phy-semi-transistor-d02', 'cuet-physics/electronic-devices/cuet-phy-semi-transistor-d02.png'),
    -- ── Batch 2: Electrostatics ──
    ('cuet-phy-pot-cap-d01',       'cuet-physics/electrostatics/cuet-phy-pot-cap-d01.png'),
    ('cuet-phy-pot-cap-d02',       'cuet-physics/electrostatics/cuet-phy-pot-cap-d02.png'),
    ('cuet-phy-pot-dielec-d01',    'cuet-physics/electrostatics/cuet-phy-pot-dielec-d01.png'),
    ('cuet-phy-pot-dielec-d02',    'cuet-physics/electrostatics/cuet-phy-pot-dielec-d02.png'),
    ('cuet-phy-pot-potential-d01', 'cuet-physics/electrostatics/cuet-phy-pot-potential-d01.png'),
    ('cuet-phy-pot-potential-d02', 'cuet-physics/electrostatics/cuet-phy-pot-potential-d02.png'),
    -- ── Batch 2: EM Induction & AC ──
    ('cuet-phy-ac-circuits-d01',  'cuet-physics/em-induction/cuet-phy-ac-circuits-d01.png'),
    ('cuet-phy-ac-circuits-d02',  'cuet-physics/em-induction/cuet-phy-ac-circuits-d02.png'),
    ('cuet-phy-ac-transform-d01', 'cuet-physics/em-induction/cuet-phy-ac-transform-d01.png'),
    ('cuet-phy-ac-transform-d02', 'cuet-physics/em-induction/cuet-phy-ac-transform-d02.png'),
    -- ── Batch 3: EM Induction (remaining) ──
    ('cuet-phy-emi-faraday-d01', 'cuet-physics/em-induction/cuet-phy-emi-faraday-d01.png'),
    ('cuet-phy-emi-faraday-d02', 'cuet-physics/em-induction/cuet-phy-emi-faraday-d02.png'),
    ('cuet-phy-emi-induct-d01',  'cuet-physics/em-induction/cuet-phy-emi-induct-d01.png'),
    ('cuet-phy-emi-induct-d02',  'cuet-physics/em-induction/cuet-phy-emi-induct-d02.png'),
    -- ── Batch 3: EM Waves ──
    ('cuet-phy-emwave-d01', 'cuet-physics/em-waves/cuet-phy-emwave-d01.png'),
    ('cuet-phy-emwave-d02', 'cuet-physics/em-waves/cuet-phy-emwave-d02.png'),
    -- ── Batch 3: Magnetic Effects ──
    ('cuet-phy-mag-biot-d01',   'cuet-physics/magnetic-effects/cuet-phy-mag-biot-d01.png'),
    ('cuet-phy-mag-biot-d02',   'cuet-physics/magnetic-effects/cuet-phy-mag-biot-d02.png'),
    ('cuet-phy-mag-force-d01',  'cuet-physics/magnetic-effects/cuet-phy-mag-force-d01.png'),
    ('cuet-phy-mag-force-d02',  'cuet-physics/magnetic-effects/cuet-phy-mag-force-d02.png'),
    ('cuet-phy-mag-device-d01', 'cuet-physics/magnetic-effects/cuet-phy-mag-device-d01.png'),
    ('cuet-phy-mag-device-d02', 'cuet-physics/magnetic-effects/cuet-phy-mag-device-d02.png'),
    ('cuet-phy-mag-dipole-d01', 'cuet-physics/magnetic-effects/cuet-phy-mag-dipole-d01.png'),
    ('cuet-phy-mag-dipole-d02', 'cuet-physics/magnetic-effects/cuet-phy-mag-dipole-d02.png'),
    ('cuet-phy-mag-mat-d01',    'cuet-physics/magnetic-effects/cuet-phy-mag-mat-d01.png'),
    ('cuet-phy-mag-mat-d02',    'cuet-physics/magnetic-effects/cuet-phy-mag-mat-d02.png'),
    -- ── Batch 3: Optics (Ray + Wave) ──
    ('cuet-phy-ray-reflect-d01',    'cuet-physics/optics/cuet-phy-ray-reflect-d01.png'),
    ('cuet-phy-ray-reflect-d02',    'cuet-physics/optics/cuet-phy-ray-reflect-d02.png'),
    ('cuet-phy-ray-prism-d01',      'cuet-physics/optics/cuet-phy-ray-prism-d01.png'),
    ('cuet-phy-ray-prism-d02',      'cuet-physics/optics/cuet-phy-ray-prism-d02.png'),
    ('cuet-phy-ray-instr-d01',      'cuet-physics/optics/cuet-phy-ray-instr-d01.png'),
    ('cuet-phy-ray-instr-d02',      'cuet-physics/optics/cuet-phy-ray-instr-d02.png'),
    ('cuet-phy-waveopt-interf-d01', 'cuet-physics/optics/cuet-phy-waveopt-interf-d01.png'),
    ('cuet-phy-waveopt-interf-d02', 'cuet-physics/optics/cuet-phy-waveopt-interf-d02.png'),
    ('cuet-phy-waveopt-diff-d01',   'cuet-physics/optics/cuet-phy-waveopt-diff-d01.png'),
    ('cuet-phy-waveopt-diff-d02',   'cuet-physics/optics/cuet-phy-waveopt-diff-d02.png'),
    ('cuet-phy-waveopt-polar-d01',  'cuet-physics/optics/cuet-phy-waveopt-polar-d01.png'),
    ('cuet-phy-waveopt-polar-d02',  'cuet-physics/optics/cuet-phy-waveopt-polar-d02.png');

  -- ═══════════════════════════════════════════════════════════════
  -- Update each matching question
  -- ═══════════════════════════════════════════════════════════════
  FOR rec IN SELECT * FROM _diagram_map
  LOOP
    full_url := base_url || rec.storage_path;

    UPDATE med_questions
    SET
      image_url = full_url,
      payload = jsonb_set(payload, '{image_uri}', to_jsonb(full_url))
    WHERE question_type = 'diagram-based'
      AND source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3')
      AND payload->>'question_id' = rec.question_id;

    IF FOUND THEN
      updated_count := updated_count + 1;
    END IF;
  END LOOP;

  RAISE NOTICE '✅ Updated % diagram questions with full HTTP URLs', updated_count;

  IF updated_count != 62 THEN
    RAISE WARNING '⚠ Expected 62 updates but got %. Some questions may be missing.', updated_count;
  END IF;

END $$;

-- ═══════════════════════════════════════════════════════════════════
-- Verification: all 62 diagram questions should have HTTP URLs now
-- ═══════════════════════════════════════════════════════════════════
SELECT
  payload->>'question_id' AS question_id,
  source,
  CASE
    WHEN image_url LIKE 'http%' THEN 'OK'
    ELSE 'MISSING'
  END AS url_status,
  LEFT(image_url, 80) AS image_url_preview
FROM med_questions
WHERE question_type = 'diagram-based'
  AND source IN ('correction-batch-1', 'correction-batch-2', 'correction-batch-3')
ORDER BY source, payload->>'question_id';

COMMIT;
