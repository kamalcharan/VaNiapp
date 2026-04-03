-- Restructure CUET Psychology: replace 5 broad chapters with 8 NCERT-aligned chapters
-- Old: cuet-psy-basics, cuet-psy-development, cuet-psy-individual-diff, cuet-psy-mental-health, cuet-psy-social
-- New: cuet-psy-ch01 through cuet-psy-ch08 (matching NCERT Class 12 Psychology chapters)

-- ── Step 1: Insert 8 new chapters ─────────────────────────────────────────
INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics)
VALUES
  ('cuet-psy-ch01', 'psychology', '{"CUET"}', 'Clinical',     'Psychological Disorders',              1, 12, 12.5, 6, '{"Classification of disorders","Anxiety disorders","Mood disorders","Schizophrenia","Substance abuse"}'),
  ('cuet-psy-ch02', 'psychology', '{"CUET"}', 'Clinical',     'Therapeutic Approaches',               2, 12, 12.5, 6, '{"Psychotherapy","Behaviour therapy","Cognitive therapy","Biomedical therapy","Rehabilitation"}'),
  ('cuet-psy-ch03', 'psychology', '{"CUET"}', 'Health',       'Meeting Life Challenges',              3, 12, 12.5, 6, '{"Stress","Coping strategies","Stress management","Positive health","Well-being"}'),
  ('cuet-psy-ch04', 'psychology', '{"CUET"}', 'Personality',  'Self and Personality',                 4, 12, 12.5, 6, '{"Concept of self","Personality theories","Trait approach","Humanistic approach","Assessment"}'),
  ('cuet-psy-ch05', 'psychology', '{"CUET"}', 'Social',       'Attitude and Social Cognition',        5, 12, 12.5, 6, '{"Nature of attitudes","Attitude formation","Prejudice","Social cognition","Attribution"}'),
  ('cuet-psy-ch06', 'psychology', '{"CUET"}', 'Social',       'Social Influence and Group Processes', 6, 12, 12.5, 6, '{"Nature of groups","Conformity","Obedience","Leadership","Intergroup conflict"}'),
  ('cuet-psy-ch07', 'psychology', '{"CUET"}', 'Differential', 'Variations in Psychological Attributes', 7, 12, 12.5, 6, '{"Intelligence","Theories of intelligence","IQ","Aptitude","Creativity","Special abilities"}'),
  ('cuet-psy-ch08', 'psychology', '{"CUET"}', 'Applied',      'Psychology and Life',                  8, 12, 12.5, 6, '{"Health psychology","Environmental psychology","Sport psychology","Applied areas","Life skills"}')
ON CONFLICT (id) DO NOTHING;


-- ── Step 2: Reassign topics to new chapters ────────────────────────────────
UPDATE med_topics SET chapter_id = 'cuet-psy-ch01' WHERE id = 'cuet-psy-mh-disorders';
UPDATE med_topics SET chapter_id = 'cuet-psy-ch02' WHERE id = 'cuet-psy-mh-therapeutic';
UPDATE med_topics SET chapter_id = 'cuet-psy-ch03' WHERE id = 'cuet-psy-mh-life-challenges';
UPDATE med_topics SET chapter_id = 'cuet-psy-ch04' WHERE id = 'cuet-psy-id-self-personality';
UPDATE med_topics SET chapter_id = 'cuet-psy-ch05' WHERE id = 'cuet-psy-soc-attitude';
UPDATE med_topics SET chapter_id = 'cuet-psy-ch06' WHERE id = 'cuet-psy-soc-influence';
UPDATE med_topics SET chapter_id = 'cuet-psy-ch07' WHERE id = 'cuet-psy-id-variations';
UPDATE med_topics SET chapter_id = 'cuet-psy-ch08' WHERE id = 'cuet-psy-basics-life';


-- ── Step 3: Reassign questions to new chapters (via topic_id) ─────────────
UPDATE med_questions SET chapter_id = 'cuet-psy-ch01' WHERE topic_id = 'cuet-psy-mh-disorders';
UPDATE med_questions SET chapter_id = 'cuet-psy-ch02' WHERE topic_id = 'cuet-psy-mh-therapeutic';
UPDATE med_questions SET chapter_id = 'cuet-psy-ch03' WHERE topic_id = 'cuet-psy-mh-life-challenges';
UPDATE med_questions SET chapter_id = 'cuet-psy-ch04' WHERE topic_id = 'cuet-psy-id-self-personality';
UPDATE med_questions SET chapter_id = 'cuet-psy-ch05' WHERE topic_id = 'cuet-psy-soc-attitude';
UPDATE med_questions SET chapter_id = 'cuet-psy-ch06' WHERE topic_id = 'cuet-psy-soc-influence';
UPDATE med_questions SET chapter_id = 'cuet-psy-ch07' WHERE topic_id = 'cuet-psy-id-variations';
UPDATE med_questions SET chapter_id = 'cuet-psy-ch08' WHERE topic_id = 'cuet-psy-basics-life';


-- ── Step 4: Delete old 5 broad chapters (now empty) ───────────────────────
DELETE FROM med_chapters
WHERE id IN (
  'cuet-psy-basics',
  'cuet-psy-development',
  'cuet-psy-individual-diff',
  'cuet-psy-mental-health',
  'cuet-psy-social'
);
