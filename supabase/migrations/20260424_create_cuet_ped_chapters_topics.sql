-- ==========================================================================
-- CUET Physical Education — 10 chapters aligned to NCERT Class 12 syllabus
-- 15 topics populated now (600 questions). Chapters 2, 3, 5 have no topics
-- yet — content will be generated in a later pass.
-- ==========================================================================

BEGIN;

-- ── Step 1: 10 NCERT Class 12 Physical Education chapters ─────────────────

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics)
VALUES
  ('cuet-ped-management',      'physical-education', '{"CUET"}', 'Administration',     'Management of Sporting Events',       1, 12, 8.0, 4, '{"Committees","Tournaments — knockout/league/combination","Intramural and extramural","Fixture drawing — Cyclic and Staircase methods"}'),
  ('cuet-ped-children-women',  'physical-education', '{"CUET"}', 'Social & Psycho',    'Children & Women in Sports',          2, 12, 8.0, 4, '{"Motor development in children","Common postural deformities","Women participation in sports","Special considerations for female athletes","Female athlete triad"}'),
  ('cuet-ped-yoga',            'physical-education', '{"CUET"}', 'Yoga & Lifestyle',   'Yoga & Lifestyle',                    3, 12, 8.0, 4, '{"Asanas for obesity / diabetes / asthma / hypertension / back pain"}'),
  ('cuet-ped-cwsn',            'physical-education', '{"CUET"}', 'Inclusion',          'Physical Education & Sports for CWSN',4, 12, 8.0, 4, '{"Disability — causes and types","Strategies to make PE inclusive","Advantages of PE for CWSN","SOI, Paralympics, Special Olympics, Deaflympics"}'),
  ('cuet-ped-nutrition',       'physical-education', '{"CUET"}', 'Nutrition',          'Sports & Nutrition',                  5, 12, 8.0, 4, '{"Balanced diet and nutrition","Macro and micro nutrients","Eating for weight control and performance","Food myths and supplements"}'),
  ('cuet-ped-testing',         'physical-education', '{"CUET"}', 'Testing',            'Test & Measurement in Sports',        6, 12, 14.0, 7, '{"Motor fitness tests","Cardiovascular fitness — Harvard step test / Rockport","BMI and body composition","Rikli & Jones senior citizen fitness"}'),
  ('cuet-ped-physiology',      'physical-education', '{"CUET"}', 'Physiology',         'Physiology & Injuries in Sports',     7, 12, 14.0, 7, '{"Physiological factors determining components of fitness","Effects of exercise on cardio-respiratory and muscular systems","Sports injuries — soft-tissue and bone","First aid — PRICE / RICER protocol"}'),
  ('cuet-ped-biomechanics',    'physical-education', '{"CUET"}', 'Biomechanics',       'Biomechanics & Sports',               8, 12, 10.0, 5, '{"Projectile motion","Equilibrium","Newton''s laws of motion","Friction — coefficients / types"}'),
  ('cuet-ped-psychology',      'physical-education', '{"CUET"}', 'Psychology',         'Psychology & Sports',                 9, 12, 10.0, 5, '{"Personality — Big Five / sheldon typology","Motivation — intrinsic / extrinsic","Exercise adherence","Meditation and self-esteem","Aggression — hostile / instrumental"}'),
  ('cuet-ped-training',        'physical-education', '{"CUET"}', 'Training',           'Training in Sports',                 10, 12, 12.0, 6, '{"Strength training — max / explosive / endurance","Endurance — continuous / interval / fartlek","Speed — acceleration runs / pace race","Flexibility — static / dynamic / PNF","Substance abuse and doping"}')
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  branch           = EXCLUDED.branch,
  chapter_number   = EXCLUDED.chapter_number,
  weightage        = EXCLUDED.weightage,
  avg_questions    = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ── Step 2: 15 topics (only those with question content ready) ────────────
--
-- Topic names MUST match the `topic` field in Qbank/CUET/ped/*.json exactly.
-- Chapters 2 (Children & Women), 3 (Yoga & Lifestyle) and 5 (Sports &
-- Nutrition) have no topics yet — content will be generated separately.

INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active)
VALUES
-- Ch 1: Management of Sporting Events
('cuet-ped-tournaments',               'cuet-ped-management',   'Tournaments & Competition Management',       1, true, true),

-- Ch 4: Physical Education for CWSN
('cuet-ped-disability-rehab',          'cuet-ped-cwsn',         'Disability, Rehabilitation & Adaptive PE',   1, true, true),

-- Ch 6: Test & Measurement in Sports
('cuet-ped-cardio-fitness',            'cuet-ped-testing',      'General Motor Fitness & Cardiovascular',     1, true, true),
('cuet-ped-motor-fitness',             'cuet-ped-testing',      'Motor Fitness Testing',                      2, true, true),
('cuet-ped-senior-fitness',            'cuet-ped-testing',      'Senior Citizen Fitness (Rikli & Jones)',     3, true, true),

-- Ch 7: Physiology & Injuries in Sports
('cuet-ped-injuries-soft-tissue',      'cuet-ped-physiology',   'Sports Injuries — Soft Tissue & Bone',       1, true, true),
('cuet-ped-injury-prevention',         'cuet-ped-physiology',   'Prevention of Sports Injuries',              2, true, true),
('cuet-ped-first-aid',                 'cuet-ped-physiology',   'First Aid in Sports',                        3, true, true),

-- Ch 8: Biomechanics & Sports
('cuet-ped-biomechanics-fundamentals', 'cuet-ped-biomechanics', 'Biomechanics — Fundamentals',                1, true, true),
('cuet-ped-newton-friction',           'cuet-ped-biomechanics', 'Newton''s Laws & Friction',                  2, true, true),

-- Ch 9: Psychology & Sports
('cuet-ped-personality-motivation',    'cuet-ped-psychology',   'Psychology — Personality & Motivation',      1, true, true),
('cuet-ped-exercise-aggression',       'cuet-ped-psychology',   'Exercise Adherence & Aggression in Sports',  2, true, true),

-- Ch 10: Training in Sports
('cuet-ped-training-endurance',        'cuet-ped-training',     'Training Methods — Endurance & Speed',       1, true, true),
('cuet-ped-training-strength',         'cuet-ped-training',     'Training Methods — Strength & Conditioning', 2, true, true),
('cuet-ped-substance-abuse',           'cuet-ped-training',     'Substance Abuse & Doping in Sports',         3, true, true)
ON CONFLICT (id) DO UPDATE SET
  name         = EXCLUDED.name,
  chapter_id   = EXCLUDED.chapter_id,
  sort_order   = EXCLUDED.sort_order,
  is_important = EXCLUDED.is_important,
  is_active    = EXCLUDED.is_active;

COMMIT;
