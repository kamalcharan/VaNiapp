-- ==========================================================================
-- MIGRATION 1: Create missing topic IDs needed by correction batch questions
-- Run this FIRST before inserting questions.
-- ==========================================================================

INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES
  ('cuet-phy-em-ac-circuits', 'cuet-phy-em-induction', 'AC Circuits (R, L, C, LCR Series)', 50, true, true),
  ('cuet-phy-em-transformer', 'cuet-phy-em-induction', 'Resonance, Power Factor, and Transformers', 60, true, true),
  ('cuet-phy-emwave-spectrum', 'cuet-phy-em-waves', 'Electromagnetic Spectrum and Wave Properties', 50, true, true),
  ('cuet-phy-es-capacitor', 'cuet-phy-electrostatics', 'Capacitors and Capacitance', 50, true, true),
  ('cuet-phy-es-dielectric', 'cuet-phy-electrostatics', 'Combination of Capacitors and Dielectrics', 60, true, true),
  ('cuet-phy-es-potential', 'cuet-phy-electrostatics', 'Electric Potential and Potential Energy', 40, true, true),
  ('cuet-phy-mag-biot-savart', 'cuet-phy-magnetic-effects', 'Biot-Savart Law and Applications', 10, true, true),
  ('cuet-phy-mag-devices', 'cuet-phy-magnetic-effects', 'Galvanometer, Ammeter, and Voltmeter', 60, true, true),
  ('cuet-phy-mag-dipole', 'cuet-phy-magnetic-effects', 'Magnetic Dipole and Torque', 40, true, true),
  ('cuet-phy-mag-lorentz-force', 'cuet-phy-magnetic-effects', 'Lorentz Force and Motion in Fields', 20, true, true),
  ('cuet-phy-mag-materials', 'cuet-phy-magnetic-effects', 'Magnetic Properties of Materials', 50, true, true),
  ('cuet-phy-opt-diffraction', 'cuet-phy-optics', 'Diffraction of Light', 40, true, true),
  ('cuet-phy-opt-interference', 'cuet-phy-optics', 'Interference of Light', 30, true, true),
  ('cuet-phy-semi-diode', 'cuet-phy-electronic-devices', 'Diode Applications (Rectifier, Zener, LED, Photodiode)', 20, true, true),
  ('cuet-phy-semi-logic-gates', 'cuet-phy-electronic-devices', 'Logic Gates and Boolean Algebra', 40, true, true),
  ('cuet-phy-semi-pn', 'cuet-phy-electronic-devices', 'p-n Junction Diode and Characteristics', 10, true, true),
  ('cuet-phy-semi-transistor', 'cuet-phy-electronic-devices', 'Transistor, Logic Gates, and Amplifiers', 30, true, true)
ON CONFLICT (id) DO NOTHING;
