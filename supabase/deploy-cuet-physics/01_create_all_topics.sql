-- ==========================================================================
-- DEPLOY STEP 1: Create ALL CUET Physics topics (idempotent)
-- Safe to re-run — uses ON CONFLICT DO NOTHING
-- ==========================================================================

INSERT INTO med_topics (id, chapter_id, name, is_active) VALUES
  ('cuet-phy-ac-advanced', 'cuet-phy-em-induction', 'AC Circuits — Advanced', true),
  ('cuet-phy-ac-circuits', 'cuet-phy-em-induction', 'AC Circuits', true),
  ('cuet-phy-comm-bandwidth', 'cuet-phy-communication', 'Bandwidth of Signals and Channels', true),
  ('cuet-phy-comm-detection', 'cuet-phy-communication', 'Detection and Demodulation', true),
  ('cuet-phy-comm-elements', 'cuet-phy-communication', 'Elements of Communication System', true),
  ('cuet-phy-comm-modulation', 'cuet-phy-communication', 'Modulation and Amplitude Modulation', true),
  ('cuet-phy-comm-propagation', 'cuet-phy-communication', 'Propagation of EM Waves', true),
  ('cuet-phy-current-instruments', 'cuet-phy-current-electricity', 'Measuring Instruments', true),
  ('cuet-phy-current-kirchhoff', 'cuet-phy-current-electricity', 'Kirchhoff''s Laws and Circuit Analysis', true),
  ('cuet-phy-current-ohm', 'cuet-phy-current-electricity', 'Ohm''s Law and Resistance', true),
  ('cuet-phy-current-potentiometer', 'cuet-phy-current-electricity', 'Potentiometer', true),
  ('cuet-phy-current-power', 'cuet-phy-current-electricity', 'Electrical Energy and Power', true),
  ('cuet-phy-current-wheatstone', 'cuet-phy-current-electricity', 'Wheatstone Bridge and Meter Bridge', true),
  ('cuet-phy-emi-faraday', 'cuet-phy-em-induction', 'Faraday''s Laws of EMI', true),
  ('cuet-phy-emi-inductance', 'cuet-phy-em-induction', 'Self and Mutual Inductance', true),
  ('cuet-phy-emwave-spectrum', 'cuet-phy-em-waves', 'Electromagnetic Spectrum and Wave Properties', true),
  ('cuet-phy-es-capacitor', 'cuet-phy-electrostatics', 'Capacitance and Capacitors', true),
  ('cuet-phy-es-coulomb', 'cuet-phy-electrostatics', 'Coulomb''s Law and Electric Charges', true),
  ('cuet-phy-es-dipole', 'cuet-phy-electrostatics', 'Electric Dipole', true),
  ('cuet-phy-es-field', 'cuet-phy-electrostatics', 'Electric Field and Field Lines', true),
  ('cuet-phy-es-gauss', 'cuet-phy-electrostatics', 'Gauss''s Law and Applications', true),
  ('cuet-phy-es-potential', 'cuet-phy-electrostatics', 'Electric Potential', true),
  ('cuet-phy-mag-ampere', 'cuet-phy-magnetic-effects', 'Ampere''s Circuital Law', true),
  ('cuet-phy-mag-biot', 'cuet-phy-magnetic-effects', 'Biot-Savart Law and Applications', true),
  ('cuet-phy-mag-devices', 'cuet-phy-magnetic-effects', 'Moving Coil Galvanometer', true),
  ('cuet-phy-mag-force', 'cuet-phy-magnetic-effects', 'Force on Current and Moving Charges', true),
  ('cuet-phy-mag-solenoid', 'cuet-phy-magnetic-effects', 'Solenoid and Toroid', true)
ON CONFLICT (id) DO NOTHING;
