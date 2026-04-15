-- ==========================================================================
-- CUET Agriculture — 4 chapters + 5 topics each (20 topics total)
-- NTA CUET Agriculture syllabus (Class 12)
-- Units: Basic Sciences / Livestock Production / Crop Production / Horticulture
-- ==========================================================================

BEGIN;

-- ── Step 1: Update 4 existing chapters with NTA-verified names & topics ───

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics)
VALUES
  ('cuet-agri-agrometeorology',  'agriculture', '{"CUET"}', 'Basic Sciences',  'Agrometeorology, Genetics and Plant Breeding, Biochemistry and Microbiology', 1, 12, 25.0, 12, '{"Agrometeorology and climate","Biochemistry: enzymes/carbohydrates/proteins/nucleic acids","Soil microbiology","Seed science and germination","Genetics: Mendel laws/DNA/RNA","Plant breeding and biotechnology"}'),
  ('cuet-agri-livestock',        'agriculture', '{"CUET"}', 'Animal Science',   'Livestock Production',                                                        2, 12, 25.0, 12, '{"Dairy breeds and management","Poultry farming","Animal nutrition and feed","Artificial insemination and ETT","Livestock diseases and vaccination","Fisheries and aquaculture"}'),
  ('cuet-agri-crop-production',  'agriculture', '{"CUET"}', 'Crop Science',     'Crop Production',                                                             3, 12, 25.0, 12, '{"Crop classification and sustainable agriculture","Soil fertility and manures/fertilizers","Irrigation and water management","Weed control and IPM","Major field crops: rice/wheat/maize/sugarcane/cotton/pulses"}'),
  ('cuet-agri-horticulture',     'agriculture', '{"CUET"}', 'Horticulture',     'Horticulture',                                                                4, 12, 25.0, 12, '{"Fruit crops: mango/banana/papaya/guava/citrus/grapes","Vegetable crops: potato/onion/tomato/cauliflower","Floriculture: rose/gladiolus/chrysanthemum/marigold","Food preservation: jams/jellies/ketchup/chips","Plant propagation methods"}')

ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  branch           = EXCLUDED.branch,
  chapter_number   = EXCLUDED.chapter_number,
  weightage        = EXCLUDED.weightage,
  avg_questions    = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ── Step 2: Insert 5 topics per chapter (20 topics total) ─────────────────

INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active)
VALUES

-- cuet-agri-agrometeorology (5 topics)
('cuet-agri-agm-climate',        'cuet-agri-agrometeorology', 'Agrometeorology and Climate',                                           1, true,  true),
('cuet-agri-agm-biochemistry',   'cuet-agri-agrometeorology', 'Biochemistry: Carbohydrates, Proteins, Lipids, Vitamins, Enzymes and Nucleic Acids', 2, true,  true),
('cuet-agri-agm-microbiology',   'cuet-agri-agrometeorology', 'Microbiology and Seed Science',                                         3, true,  true),
('cuet-agri-agm-genetics',       'cuet-agri-agrometeorology', 'Genetics: Cell Division, DNA/RNA and Mendel\'s Laws of Inheritance',    4, true,  true),
('cuet-agri-agm-breeding',       'cuet-agri-agrometeorology', 'Plant Breeding and Plant Biotechnology',                                5, true,  true),

-- cuet-agri-livestock (5 topics)
('cuet-agri-ls-dairy',           'cuet-agri-livestock', 'Dairy Farming: Breeds, Management and Milk Products',                        1, true,  true),
('cuet-agri-ls-poultry',         'cuet-agri-livestock', 'Poultry Farming: Breeds and Production Systems',                             2, true,  true),
('cuet-agri-ls-nutrition',       'cuet-agri-livestock', 'Animal Nutrition, Feed Management and Fodder Crops',                         3, true,  true),
('cuet-agri-ls-breeding',        'cuet-agri-livestock', 'Livestock Breeding: Artificial Insemination and Embryo Transfer',            4, true,  true),
('cuet-agri-ls-disease',         'cuet-agri-livestock', 'Animal Disease Management, Fisheries and Livestock Products',                5, true,  true),

-- cuet-agri-crop-production (5 topics)
('cuet-agri-cp-intro',           'cuet-agri-crop-production', 'Crop Classification, Sustainable and Modern Agriculture',              1, true,  true),
('cuet-agri-cp-soil-nutrients',  'cuet-agri-crop-production', 'Soil Science, Fertilizers, Manures and Biofertilisers',               2, true,  true),
('cuet-agri-cp-irrigation',      'cuet-agri-crop-production', 'Irrigation Practices, Drainage and Water Management',                  3, true,  true),
('cuet-agri-cp-weeds-pests',     'cuet-agri-crop-production', 'Weed Control and Integrated Pest Management (IPM)',                   4, true,  true),
('cuet-agri-cp-major-crops',     'cuet-agri-crop-production', 'Major Field Crops: Cereals, Oilseeds, Pulses, Cash Crops and Fodder', 5, true,  true),

-- cuet-agri-horticulture (5 topics)
('cuet-agri-hort-fruits',        'cuet-agri-horticulture', 'Fruit Production: Mango, Papaya, Banana, Guava, Citrus and Grapes',       1, true,  true),
('cuet-agri-hort-vegetables',    'cuet-agri-horticulture', 'Vegetable Cultivation and Protected Farming',                             2, true,  true),
('cuet-agri-hort-floriculture',  'cuet-agri-horticulture', 'Floriculture: Gladiolus, Rose, Chrysanthemum, Marigold and Canna',       3, true,  true),
('cuet-agri-hort-preservation',  'cuet-agri-horticulture', 'Post-Harvest Technology and Food Preservation',                           4, true,  true),
('cuet-agri-hort-propagation',   'cuet-agri-horticulture', 'Plant Propagation Methods',                                               5, false, true)

ON CONFLICT (id) DO UPDATE SET
  name       = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  is_important = EXCLUDED.is_important,
  is_active  = EXCLUDED.is_active;

COMMIT;
