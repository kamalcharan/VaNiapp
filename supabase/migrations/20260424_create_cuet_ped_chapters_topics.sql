-- ==========================================================================
-- CUET Physical Education — 4 chapters + 5 topics each (20 topics total)
-- NTA CUET Physical Education syllabus (Class 12)
-- ==========================================================================

BEGIN;

-- ── Step 1: Insert / update 4 chapters ─────────────────────────────────────

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics)
VALUES
  ('cuet-ped-injuries-biomechanics', 'physical-education', '{"CUET"}', 'Sports Science',    'Sports Injuries, First Aid & Biomechanics',       1, 12, 25.0, 12, '{"Biomechanics fundamentals","Newton''s laws and friction","Sports injuries","Injury prevention","First aid in sports"}'),
  ('cuet-ped-health-education',      'physical-education', '{"CUET"}', 'Health Education',  'Health Education & Lifestyle',                    2, 12, 25.0, 12, '{"Health fundamentals","Environmental and occupational health","Posture and personal hygiene","Substance abuse and doping","Disability and adaptive PE"}'),
  ('cuet-ped-sociology-training',    'physical-education', '{"CUET"}', 'Training & Society','Sociological Aspects, Training & Career in PE',   3, 12, 25.0, 12, '{"Sociological aspects of PE","Tournaments and competition management","Endurance and speed training","Strength and conditioning","Careers in physical education"}'),
  ('cuet-ped-testing-psychology',    'physical-education', '{"CUET"}', 'Testing & Psych',   'Fitness Testing & Sports Psychology',             4, 12, 25.0, 12, '{"General motor and cardiovascular fitness","Motor fitness testing","Senior citizen fitness (Rikli & Jones)","Personality and motivation","Exercise adherence and aggression"}')

ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  branch           = EXCLUDED.branch,
  chapter_number   = EXCLUDED.chapter_number,
  weightage        = EXCLUDED.weightage,
  avg_questions    = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ── Step 2: Insert 5 topics per chapter (20 topics total) ─────────────────
--
-- Topic names MUST match the `topic` field in Qbank/CUET/ped/*.json exactly —
-- bulkinsert.html resolves topic_id by name, so any deviation here forces the
-- fuzzy matcher to auto-create duplicate topic rows.

INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active)
VALUES
-- cuet-ped-injuries-biomechanics
('cuet-ped-biomechanics-fundamentals', 'cuet-ped-injuries-biomechanics', 'Biomechanics — Fundamentals',                 1, true,  true),
('cuet-ped-newton-friction',           'cuet-ped-injuries-biomechanics', 'Newton''s Laws & Friction',                   2, true,  true),
('cuet-ped-injuries-soft-tissue',      'cuet-ped-injuries-biomechanics', 'Sports Injuries — Soft Tissue & Bone',        3, true,  true),
('cuet-ped-injury-prevention',         'cuet-ped-injuries-biomechanics', 'Prevention of Sports Injuries',               4, true,  true),
('cuet-ped-first-aid',                 'cuet-ped-injuries-biomechanics', 'First Aid in Sports',                         5, true,  true),

-- cuet-ped-health-education
('cuet-ped-health-fundamentals',       'cuet-ped-health-education',      'Health & Health Education Fundamentals',      1, true,  true),
('cuet-ped-environment-health',        'cuet-ped-health-education',      'Environmental Health & Occupational Hazards', 2, true,  true),
('cuet-ped-posture-hygiene',           'cuet-ped-health-education',      'Posture & Personal Hygiene',                  3, true,  true),
('cuet-ped-substance-abuse',           'cuet-ped-health-education',      'Substance Abuse & Doping in Sports',          4, true,  true),
('cuet-ped-disability-rehab',          'cuet-ped-health-education',      'Disability, Rehabilitation & Adaptive PE',    5, true,  true),

-- cuet-ped-sociology-training
('cuet-ped-sociological',              'cuet-ped-sociology-training',    'Sociological Aspects of Physical Education',  1, true,  true),
('cuet-ped-tournaments',               'cuet-ped-sociology-training',    'Tournaments & Competition Management',        2, true,  true),
('cuet-ped-training-endurance',        'cuet-ped-sociology-training',    'Training Methods — Endurance & Speed',        3, true,  true),
('cuet-ped-training-strength',         'cuet-ped-sociology-training',    'Training Methods — Strength & Conditioning',  4, true,  true),
('cuet-ped-career',                    'cuet-ped-sociology-training',    'Career Aspects in Physical Education',        5, false, true),

-- cuet-ped-testing-psychology
('cuet-ped-cardio-fitness',            'cuet-ped-testing-psychology',    'General Motor Fitness & Cardiovascular',      1, true,  true),
('cuet-ped-motor-fitness',             'cuet-ped-testing-psychology',    'Motor Fitness Testing',                       2, true,  true),
('cuet-ped-senior-fitness',            'cuet-ped-testing-psychology',    'Senior Citizen Fitness (Rikli & Jones)',      3, true,  true),
('cuet-ped-personality-motivation',    'cuet-ped-testing-psychology',    'Psychology — Personality & Motivation',       4, true,  true),
('cuet-ped-exercise-aggression',       'cuet-ped-testing-psychology',    'Exercise Adherence & Aggression in Sports',   5, true,  true)

ON CONFLICT (id) DO UPDATE SET
  name         = EXCLUDED.name,
  chapter_id   = EXCLUDED.chapter_id,
  sort_order   = EXCLUDED.sort_order,
  is_important = EXCLUDED.is_important,
  is_active    = EXCLUDED.is_active;

COMMIT;
