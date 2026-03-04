-- ==========================================================================
-- Cleanup: Fix 14 CUET physics topic names stuck with old batch values.
--
-- The batch1/batch2/batch3 migrations (20260301) created topics with verbose
-- names. Later migrations (step1, 20260304) tried to insert cleaner names
-- but used ON CONFLICT DO NOTHING, so the old names persisted.
-- This migration explicitly UPDATEs those names to the standardised form.
--
-- Wrapped in a transaction: all-or-nothing.
-- ==========================================================================

BEGIN;

-- ── PART 1: Fix 14 stale topic names ────────────────────────────────────

-- Atoms & Nuclei
UPDATE med_topics SET name = 'Bohr Model of Hydrogen Atom'
  WHERE id = 'cuet-phy-atom-bohr';

-- Dual Nature
UPDATE med_topics SET name = 'de Broglie Wavelength'
  WHERE id = 'cuet-phy-dual-debroglie';
UPDATE med_topics SET name = 'Photoelectric Effect'
  WHERE id = 'cuet-phy-dual-photoelectric';

-- EM Induction
UPDATE med_topics SET name = 'Faraday''s Laws of EMI'
  WHERE id = 'cuet-phy-emi-faraday';

-- Magnetic Effects
UPDATE med_topics SET name = 'Biot-Savart Law and Applications'
  WHERE id = 'cuet-phy-mag-biot-savart';
UPDATE med_topics SET name = 'Lorentz Force and Motion in Fields'
  WHERE id = 'cuet-phy-mag-lorentz-force';
UPDATE med_topics SET name = 'Galvanometer, Ammeter, and Voltmeter'
  WHERE id = 'cuet-phy-mag-devices';
UPDATE med_topics SET name = 'Magnetic Properties of Materials'
  WHERE id = 'cuet-phy-mag-materials';

-- Optics
UPDATE med_topics SET name = 'Reflection and Mirrors'
  WHERE id = 'cuet-phy-opt-reflection';
UPDATE med_topics SET name = 'Prism and Dispersion'
  WHERE id = 'cuet-phy-opt-prism';
UPDATE med_topics SET name = 'Optical Instruments'
  WHERE id = 'cuet-phy-opt-instruments';
UPDATE med_topics SET name = 'Interference of Light'
  WHERE id = 'cuet-phy-opt-interference';
UPDATE med_topics SET name = 'Diffraction of Light'
  WHERE id = 'cuet-phy-opt-diffraction';
UPDATE med_topics SET name = 'Polarisation of Light'
  WHERE id = 'cuet-phy-opt-polarisation';

-- ── PART 2: Reassign questions from old topic IDs, then delete orphans ──

-- Current Electricity: move questions from old curr-* to new current-* IDs
UPDATE med_questions SET topic_id = 'cuet-phy-current-ohm'
  WHERE topic_id = 'cuet-phy-curr-ohm';
UPDATE med_questions SET topic_id = 'cuet-phy-current-kirchhoff'
  WHERE topic_id = 'cuet-phy-curr-kirchhoff';
UPDATE med_questions SET topic_id = 'cuet-phy-current-instruments'
  WHERE topic_id = 'cuet-phy-curr-wheatstone';
UPDATE med_questions SET topic_id = 'cuet-phy-current-instruments'
  WHERE topic_id = 'cuet-phy-curr-potentiometer';

-- Delete orphan curr-* topics (old prefix from batch 1)
DELETE FROM med_topics WHERE id IN (
  'cuet-phy-curr-ohm',
  'cuet-phy-curr-drift',
  'cuet-phy-curr-kirchhoff',
  'cuet-phy-curr-wheatstone',
  'cuet-phy-curr-potentiometer'
);

-- Atoms & Nuclei: reassign questions from superseded batch-1 topics
UPDATE med_questions SET topic_id = 'cuet-phy-nuclei-decay'
  WHERE topic_id = 'cuet-phy-atom-radioactivity';
UPDATE med_questions SET topic_id = 'cuet-phy-nuclei-properties'
  WHERE topic_id = 'cuet-phy-atom-nucleus';
UPDATE med_questions SET topic_id = 'cuet-phy-nuclei-properties'
  WHERE topic_id = 'cuet-phy-atom-fission-fusion';

-- Delete orphan atom-* topics from batch 1
DELETE FROM med_topics WHERE id IN (
  'cuet-phy-atom-rutherford',
  'cuet-phy-atom-radioactivity',
  'cuet-phy-atom-nucleus',
  'cuet-phy-atom-fission-fusion'
);

COMMIT;
