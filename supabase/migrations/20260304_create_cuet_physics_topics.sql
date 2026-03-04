-- ==========================================================================
-- Create missing CUET physics topics needed by question JSON files.
-- These topics are referenced by the 780 questions across 39 JSON files.
-- Run this before bulk-inserting questions via bulkinsert.html.
-- ==========================================================================

INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES
  -- atoms-nuclei (4 topics)
  ('cuet-phy-atom-bohr',         'cuet-phy-atoms-nuclei',       'Bohr Model of Hydrogen Atom',          10, true, true),
  ('cuet-phy-atom-spectra',      'cuet-phy-atoms-nuclei',       'Hydrogen Spectrum and Spectral Series', 20, true, true),
  ('cuet-phy-nuclei-decay',      'cuet-phy-atoms-nuclei',       'Radioactive Decay',                    30, true, true),
  ('cuet-phy-nuclei-properties', 'cuet-phy-atoms-nuclei',       'Nuclear Properties and Binding Energy', 40, true, true),

  -- current-electricity (3 topics)
  ('cuet-phy-current-ohm',        'cuet-phy-current-electricity', 'Ohm''s Law and Resistance',           10, true, true),
  ('cuet-phy-current-kirchhoff',  'cuet-phy-current-electricity', 'Kirchhoff''s Laws and Networks',      20, true, true),
  ('cuet-phy-current-instruments','cuet-phy-current-electricity', 'Electrical Instruments',               30, true, true),

  -- dual-nature (2 topics)
  ('cuet-phy-dual-photoelectric', 'cuet-phy-dual-nature',        'Photoelectric Effect',                 10, true, true),
  ('cuet-phy-dual-debroglie',     'cuet-phy-dual-nature',        'de Broglie Wavelength',                20, true, true),

  -- em-induction (2 new topics — ac-circuits and transformer already exist)
  ('cuet-phy-emi-faraday',        'cuet-phy-em-induction',       'Faraday''s Laws of EMI',               10, true, true),
  ('cuet-phy-emi-inductance',     'cuet-phy-em-induction',       'Self and Mutual Inductance',           20, true, true),

  -- electrostatics (4 new topics — potential, capacitor, dielectric already exist)
  ('cuet-phy-es-coulomb',         'cuet-phy-electrostatics',     'Coulomb''s Law and Electric Charges',  10, true, true),
  ('cuet-phy-es-field',           'cuet-phy-electrostatics',     'Electric Field and Field Lines',       20, true, true),
  ('cuet-phy-es-dipole',          'cuet-phy-electrostatics',     'Electric Dipole',                      30, true, true),
  ('cuet-phy-es-gauss',           'cuet-phy-electrostatics',     'Gauss''s Law and Applications',        35, true, true),

  -- optics (3 new topics — diffraction and interference already exist)
  ('cuet-phy-opt-reflection',     'cuet-phy-optics',             'Reflection and Mirrors',               10, true, true),
  ('cuet-phy-opt-prism',          'cuet-phy-optics',             'Prism and Dispersion',                 20, true, true),
  ('cuet-phy-opt-instruments',    'cuet-phy-optics',             'Optical Instruments',                  50, true, true),
  ('cuet-phy-opt-polarisation',   'cuet-phy-optics',             'Polarisation of Light',                60, true, true)

ON CONFLICT (id) DO NOTHING;
