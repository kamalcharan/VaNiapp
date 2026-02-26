-- Add missing NEET chapters (Chemistry + Botany) that are in the NCERT syllabus
-- but were not in the original seed data.
-- These are needed so that generated questions can be bulk-inserted without
-- foreign key violations on med_questions.chapter_id.

INSERT INTO med_chapters
  (id, subject_id, exam_ids, branch, name, chapter_number, class_level,
   weightage, avg_questions, important_topics)
VALUES
  -- Class 11 chapters ─────────────────────────────────────────────────
  ('chem-states-matter',  'chemistry', '{"NEET"}', 'Physical Chemistry',
   'States of Matter', 21, 11, 3.0, 1,
   '{"Gas laws","Ideal gas equation","Kinetic molecular theory","Real gases","Liquefaction","Vapour pressure"}'),

  ('chem-hydrogen',       'chemistry', '{"NEET"}', 'Inorganic Chemistry',
   'Hydrogen', 22, 11, 2.0, 1,
   '{"Position of hydrogen","Isotopes","Dihydrogen preparation","Hydrides","Water structure","Heavy water","Hydrogen peroxide"}'),

  ('chem-s-block',        'chemistry', '{"NEET"}', 'Inorganic Chemistry',
   's-Block Elements', 23, 11, 3.0, 1,
   '{"Alkali metals","Alkaline earth metals","Diagonal relationship","Anomalous behaviour of Li and Be","Important compounds"}'),

  ('chem-environment',    'chemistry', '{"NEET"}', 'Physical Chemistry',
   'Environmental Chemistry', 24, 11, 2.0, 1,
   '{"Air pollution","Water pollution","Ozone depletion","Greenhouse effect","Green chemistry","Acid rain"}'),

  -- Class 12 chapters ─────────────────────────────────────────────────
  ('chem-surface',        'chemistry', '{"NEET"}', 'Physical Chemistry',
   'Surface Chemistry', 25, 12, 3.0, 1,
   '{"Adsorption","Catalysis","Colloids","Emulsions","Enzyme catalysis","Tyndall effect"}'),

  ('chem-metallurgy',     'chemistry', '{"NEET"}', 'Inorganic Chemistry',
   'General Principles and Processes of Isolation of Elements', 26, 12, 2.0, 1,
   '{"Thermodynamic principles","Ellingham diagram","Electrolytic refining","Zone refining","Chromatography"}'),

  ('chem-polymers',       'chemistry', '{"NEET"}', 'Organic Chemistry',
   'Polymers', 27, 12, 3.0, 1,
   '{"Classification of polymers","Addition polymerization","Condensation polymerization","Copolymerization","Biodegradable polymers","Rubber"}'),

  ('chem-everyday',       'chemistry', '{"NEET"}', 'Organic Chemistry',
   'Chemistry in Everyday Life', 28, 12, 2.0, 1,
   '{"Drugs classification","Drug-target interaction","Antacids","Antibiotics","Antiseptics","Food preservatives","Cleansing agents"}'),

  -- ── Botany (2 missing Class 11 chapters) ──────────────────────────
  ('bot-transport-plants', 'botany', '{"NEET"}', 'Plant Physiology',
   'Transport in Plants', 18, 11, 3.0, 1,
   '{"Diffusion","Osmosis","Plasmolysis","Transpiration","Uptake of water","Translocation","Phloem transport"}'),

  ('bot-mineral-nutrition', 'botany', '{"NEET"}', 'Plant Physiology',
   'Mineral Nutrition', 19, 11, 3.0, 1,
   '{"Essential minerals","Macro and micro nutrients","Deficiency symptoms","Nitrogen metabolism","Nitrogen fixation","Biological nitrogen fixation"}')

ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  branch           = EXCLUDED.branch,
  chapter_number   = EXCLUDED.chapter_number,
  class_level      = EXCLUDED.class_level,
  weightage        = EXCLUDED.weightage,
  avg_questions    = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;
