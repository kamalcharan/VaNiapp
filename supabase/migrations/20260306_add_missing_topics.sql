-- Add missing topics that exist in question JSON but not in med_topics.
-- These are needed so topic_id can be set on all questions.

-- phy-electrostatics: currently has Coulomb Law (1), Electric Field (2), Gauss Law (3), Capacitors (4)
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important) VALUES
  ('phy-elec-dipole',     'phy-electrostatics', 'Electric Dipole',                   5, true),
  ('phy-elec-potential',  'phy-electrostatics', 'Electric Potential and Potential Energy', 6, true)
ON CONFLICT (id) DO NOTHING;

-- cuet-phy-electrostatics: currently has Capacitors (1), Dielectrics (2), Potential (3)
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important) VALUES
  ('cuet-phy-es-coulomb', 'cuet-phy-electrostatics', 'Coulomb''s Law and Electric Charges', 4, true),
  ('cuet-phy-es-gauss',   'cuet-phy-electrostatics', 'Gauss''s Law and Applications',       5, true),
  ('cuet-phy-es-dipole',  'cuet-phy-electrostatics', 'Electric Dipole',                     6, true),
  ('cuet-phy-es-field',   'cuet-phy-electrostatics', 'Electric Field and Field Lines',      7, true)
ON CONFLICT (id) DO NOTHING;

-- cuet-phy-current-electricity: currently has Drift (2), Wheatstone (4), Potentiometer (5)
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important) VALUES
  ('cuet-phy-curr-ohm',       'cuet-phy-current-electricity', 'Ohm''s Law and Resistance',       1, true),
  ('cuet-phy-curr-kirchhoff', 'cuet-phy-current-electricity', 'Kirchhoff''s Laws and Networks',   3, true),
  ('cuet-phy-curr-instrument','cuet-phy-current-electricity', 'Electrical Instruments',           6, true)
ON CONFLICT (id) DO NOTHING;

-- cuet-phy-em-induction: currently has AC Circuits (1), Transformers (2), Inductance (4)
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important) VALUES
  ('cuet-phy-emi-faraday', 'cuet-phy-em-induction', 'Faraday''s Laws of EMI',  3, true),
  ('cuet-phy-emi-lenz',    'cuet-phy-em-induction', 'Lenz''s Law and Applications', 5, false)
ON CONFLICT (id) DO NOTHING;
