-- Add Psychology Ch09 + all 13 History chapters with topics
-- Run BEFORE importing any JSONs for these chapters

-- ══════════════════════════════════════════════════════════════════════════════
-- PSYCHOLOGY Ch09: Developing Psychological Skills
-- DB chapter_id: cuet-psy-ch09
-- JSON must have: chapter_id="cuet-psy-ch09", subject="psychology", topic="Developing Psychological Skills"
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics)
VALUES (
  'cuet-psy-ch09', 'psychology', '{"CUET"}', 'Applied',
  'Developing Psychological Skills', 9, 12, 12.5, 6,
  '{"Observational skills","Communication skills","Psychological testing","Counselling","Interview skills","Case study"}'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO med_topics (id, chapter_id, name, sort_order)
VALUES ('cuet-psy-ch09-skills', 'cuet-psy-ch09', 'Developing Psychological Skills', 1)
ON CONFLICT (id) DO NOTHING;


-- ══════════════════════════════════════════════════════════════════════════════
-- HISTORY: 13 chapters (NCERT Themes in Indian History Parts I, II, III)
-- subject_id: history
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics)
VALUES
  ('cuet-hist-harappan',         'history', '{"CUET"}', 'Ancient',    'Bricks, Beads and Bones (Harappan Civilisation)',    1, 12, 8.0, 4, '{"Urban planning","Trade","Artefacts","Decline theories","Seals"}'),
  ('cuet-hist-kings-farmers',    'history', '{"CUET"}', 'Ancient',    'Kings, Farmers and Towns',                           2, 12, 8.0, 4, '{"Mahajanapadas","Mauryan empire","Land grants","Trade routes","Coins"}'),
  ('cuet-hist-kinship-caste',    'history', '{"CUET"}', 'Ancient',    'Kinship, Caste and Class',                           3, 12, 8.0, 4, '{"Mahabharata","Varna system","Gotras","Women","Social hierarchy"}'),
  ('cuet-hist-thinkers-beliefs', 'history', '{"CUET"}', 'Ancient',    'Thinkers, Beliefs and Buildings',                    4, 12, 8.0, 4, '{"Buddhism","Jainism","Stupas","Cave temples","Gupta period"}'),
  ('cuet-hist-travellers',       'history', '{"CUET"}', 'Medieval',   'Through the Eyes of Travellers',                     5, 12, 8.0, 4, '{"Al-Biruni","Ibn Battuta","Francois Bernier","Accounts","Society"}'),
  ('cuet-hist-bhakti-sufi',      'history', '{"CUET"}', 'Medieval',   'Bhakti-Sufi Traditions',                             6, 12, 8.0, 4, '{"Bhakti saints","Sufi orders","Kabir","Mirabai","Silsilas"}'),
  ('cuet-hist-vijayanagara',     'history', '{"CUET"}', 'Medieval',   'An Imperial Capital: Vijayanagara',                  7, 12, 8.0, 4, '{"Hampi","Architecture","Rulers","Administration","Economy"}'),
  ('cuet-hist-peasants-zamindars','history', '{"CUET"}', 'Medieval',  'Peasants, Zamindars and the State',                  8, 12, 8.0, 4, '{"Mughal agriculture","Ain-i-Akbari","Revenue system","Village life","Zamindars"}'),
  ('cuet-hist-colonialism',      'history', '{"CUET"}', 'Modern',     'Colonialism and the Countryside',                    9, 12, 8.0, 4, '{"Permanent Settlement","Ryotwari","Indigo revolt","Deccan riots","Land revenue"}'),
  ('cuet-hist-rebels-raj',       'history', '{"CUET"}', 'Modern',     'Rebels and the Raj (1857)',                          10, 12, 8.0, 4, '{"Sepoy Mutiny","Causes","Spread","Leaders","Aftermath"}'),
  ('cuet-hist-gandhi-nationalism','history', '{"CUET"}', 'Modern',    'Mahatma Gandhi and the Nationalist Movement',        11, 12, 8.0, 4, '{"Non-cooperation","Civil Disobedience","Quit India","Salt March","Mass mobilisation"}'),
  ('cuet-hist-partition',        'history', '{"CUET"}', 'Modern',     'Understanding Partition',                            12, 12, 8.0, 4, '{"Communalism","Direct Action Day","Oral histories","Refugees","Violence"}'),
  ('cuet-hist-constitution',     'history', '{"CUET"}', 'Modern',     'Framing the Constitution',                           13, 12, 8.0, 4, '{"Constituent Assembly","Debates","Fundamental Rights","Ambedkar","Draft"}')
ON CONFLICT (id) DO NOTHING;


-- ── History Topics (one primary topic per chapter, matching the chapter name) ─
-- These are the exact strings to use in JSON "topic" field

INSERT INTO med_topics (id, chapter_id, name, sort_order)
VALUES
  ('cuet-hist-harappan-t1',          'cuet-hist-harappan',          'Harappan Civilisation',                    1),
  ('cuet-hist-kings-farmers-t1',     'cuet-hist-kings-farmers',     'Kings, Farmers and Towns',                 1),
  ('cuet-hist-kinship-caste-t1',     'cuet-hist-kinship-caste',     'Kinship, Caste and Class',                 1),
  ('cuet-hist-thinkers-beliefs-t1',  'cuet-hist-thinkers-beliefs',  'Thinkers, Beliefs and Buildings',          1),
  ('cuet-hist-travellers-t1',        'cuet-hist-travellers',        'Through the Eyes of Travellers',           1),
  ('cuet-hist-bhakti-sufi-t1',       'cuet-hist-bhakti-sufi',       'Bhakti-Sufi Traditions',                   1),
  ('cuet-hist-vijayanagara-t1',      'cuet-hist-vijayanagara',      'Vijayanagara Empire',                      1),
  ('cuet-hist-peasants-zamindars-t1','cuet-hist-peasants-zamindars','Peasants, Zamindars and the State',        1),
  ('cuet-hist-colonialism-t1',       'cuet-hist-colonialism',       'Colonialism and the Countryside',          1),
  ('cuet-hist-rebels-raj-t1',        'cuet-hist-rebels-raj',        'Rebels and the Raj',                       1),
  ('cuet-hist-gandhi-nationalism-t1','cuet-hist-gandhi-nationalism', 'Gandhi and the Nationalist Movement',     1),
  ('cuet-hist-partition-t1',         'cuet-hist-partition',         'Understanding Partition',                  1),
  ('cuet-hist-constitution-t1',      'cuet-hist-constitution',      'Framing the Constitution',                 1)
ON CONFLICT (id) DO NOTHING;
