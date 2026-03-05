BEGIN;

-- cuet-bst-nature-mgmt-01
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'mcq', 'easy', 'Management is described as a process of getting things done through:', 'B', 'Management is defined as a process of getting things done through and with other people by directing their efforts towards common goals. It is not a one-person activity — it requires coordinating the efforts of a group to achieve organisational objectives efficiently and effectively.', 'active', true, ARRAY['management-definition','group-activity','process']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-01", "subtopic": "Definition of management", "topic_name": "Nature of Management", "bloom_level": "remember", "options": [{"key": "A", "text": "Individual effort of the manager alone", "is_correct": false}, {"key": "B", "text": "Others by directing their efforts towards common goals", "is_correct": true}, {"key": "C", "text": "Machines and technology only", "is_correct": false}, {"key": "D", "text": "Government regulations and rules", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Management is a group activity. A single person working alone is not ''managing'' — they are simply performing individual work.", "misconception": "Thinking management is a solo activity"}, {"option_key": "C", "hint": "While machines are resources used in management, the definition centres on people, not technology.", "misconception": "Confusing management with automation"}, {"option_key": "D", "hint": "Government rules form the legal environment of business, not the definition of management.", "misconception": "Mixing up management with regulation"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Individual effort of the manager alone', false, 0),
    ((SELECT id FROM new_q), 'B', 'Others by directing their efforts towards common goals', true, 1),
    ((SELECT id FROM new_q), 'C', 'Machines and technology only', false, 2),
    ((SELECT id FROM new_q), 'D', 'Government regulations and rules', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Management is a group activity. A single person working alone is not ''managing'' — they are simply performing individual work.', 'Thinking management is a solo activity'),
    ((SELECT id FROM new_q), 'C', 'While machines are resources used in management, the definition centres on people, not technology.', 'Confusing management with automation'),
    ((SELECT id FROM new_q), 'D', 'Government rules form the legal environment of business, not the definition of management.', 'Mixing up management with regulation')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-02
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'mcq', 'easy', 'Which of the following is NOT a characteristic of management?', 'C', 'Management is a goal-oriented, pervasive, continuous, and group activity. It is also intangible — you cannot see it, only its results. However, management is NOT a static process — it is dynamic and continuously adapts to changing circumstances in the internal and external environment.', 'active', true, ARRAY['management-characteristics','dynamic-process']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-02", "subtopic": "Characteristics of management", "topic_name": "Nature of Management", "bloom_level": "understand", "options": [{"key": "A", "text": "It is a goal-oriented process", "is_correct": false}, {"key": "B", "text": "It is pervasive", "is_correct": false}, {"key": "C", "text": "It is a static process that never changes", "is_correct": true}, {"key": "D", "text": "It is a group activity", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Goal-orientation is a core feature — management always works towards achieving specific organisational objectives.", "misconception": null}, {"option_key": "B", "hint": "Pervasiveness means management is needed in all types of organisations (business, hospitals, schools, government).", "misconception": null}, {"option_key": "D", "hint": "Group activity is a fundamental characteristic — management involves coordinating the efforts of multiple people.", "misconception": null}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'It is a goal-oriented process', false, 0),
    ((SELECT id FROM new_q), 'B', 'It is pervasive', false, 1),
    ((SELECT id FROM new_q), 'C', 'It is a static process that never changes', true, 2),
    ((SELECT id FROM new_q), 'D', 'It is a group activity', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Goal-orientation is a core feature — management always works towards achieving specific organisational objectives.', NULL),
    ((SELECT id FROM new_q), 'B', 'Pervasiveness means management is needed in all types of organisations (business, hospitals, schools, government).', NULL),
    ((SELECT id FROM new_q), 'D', 'Group activity is a fundamental characteristic — management involves coordinating the efforts of multiple people.', NULL)
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-03
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'mcq', 'medium', 'Management is considered an intangible force because:', 'D', 'Management cannot be seen or touched. Its presence is felt through the orderly functioning of the organisation — timely output, employee satisfaction, and achievement of goals. A well-managed enterprise runs smoothly, while a poorly-managed one shows disorder. This is why management is called an ''intangible force'' or ''unseen force''.', 'active', true, ARRAY['intangible-force','management-characteristics']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-03", "subtopic": "Intangible nature of management", "topic_name": "Nature of Management", "bloom_level": "understand", "options": [{"key": "A", "text": "It exists only in theory and has no practical application", "is_correct": false}, {"key": "B", "text": "It is carried out by invisible entities", "is_correct": false}, {"key": "C", "text": "It involves only mental work, not physical work", "is_correct": false}, {"key": "D", "text": "Its presence is felt through the orderly functioning and results of the organisation", "is_correct": true}], "elimination_hints": [{"option_key": "A", "hint": "Management is very much practical — every organisation practises it daily. ''Intangible'' means it cannot be seen, not that it is theoretical.", "misconception": "Confusing ''intangible'' with ''theoretical''"}, {"option_key": "B", "hint": "Managers are real, visible people. It is the process of management that is invisible, not the managers.", "misconception": "Literal misinterpretation of intangible"}, {"option_key": "C", "hint": "Management involves both mental (planning, decision-making) and physical aspects (supervision, inspection). ''Intangible'' refers to the force, not the type of work.", "misconception": "Confusing intangible with non-physical labour"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'It exists only in theory and has no practical application', false, 0),
    ((SELECT id FROM new_q), 'B', 'It is carried out by invisible entities', false, 1),
    ((SELECT id FROM new_q), 'C', 'It involves only mental work, not physical work', false, 2),
    ((SELECT id FROM new_q), 'D', 'Its presence is felt through the orderly functioning and results of the organisation', true, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Management is very much practical — every organisation practises it daily. ''Intangible'' means it cannot be seen, not that it is theoretical.', 'Confusing ''intangible'' with ''theoretical'''),
    ((SELECT id FROM new_q), 'B', 'Managers are real, visible people. It is the process of management that is invisible, not the managers.', 'Literal misinterpretation of intangible'),
    ((SELECT id FROM new_q), 'C', 'Management involves both mental (planning, decision-making) and physical aspects (supervision, inspection). ''Intangible'' refers to the force, not the type of work.', 'Confusing intangible with non-physical labour')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-04
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'assertion-reasoning', 'medium', 'Assertion (A): Management is a continuous process.
Reason (R): The cycle of planning, organising, staffing, directing, and controlling keeps repeating as long as the organisation exists.', 'A', 'Both A and R are true, and R correctly explains A. Management is not a one-time act. The functions (POSDC) form a continuous cycle — once a plan is executed and controlled, new plans are made based on the feedback. This cycle repeats endlessly throughout the life of the organisation, making management continuous.', 'active', true, ARRAY['continuous-process','management-functions','POSDC-cycle']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-04", "subtopic": "Continuous nature of management", "topic_name": "Nature of Management", "bloom_level": "understand", "options": [{"key": "A", "text": "Both A and R are correct and R is the correct explanation of A", "is_correct": true}, {"key": "B", "text": "Both A and R are correct but R is NOT the correct explanation of A", "is_correct": false}, {"key": "C", "text": "A is correct but R is incorrect", "is_correct": false}, {"key": "D", "text": "A is incorrect but R is correct", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "R directly explains WHY management is continuous — it is the repeating POSDC cycle that makes it so. The causal link is clear.", "misconception": "Not recognising the direct causal connection between the POSDC cycle and continuity"}, {"option_key": "C", "hint": "R is factually correct — management functions do form a recurring cycle in every organisation. This is a standard NCERT concept.", "misconception": null}, {"option_key": "D", "hint": "A is correct — management is indeed continuous. It does not stop after achieving one goal; new objectives are set.", "misconception": null}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Both A and R are correct and R is the correct explanation of A', true, 0),
    ((SELECT id FROM new_q), 'B', 'Both A and R are correct but R is NOT the correct explanation of A', false, 1),
    ((SELECT id FROM new_q), 'C', 'A is correct but R is incorrect', false, 2),
    ((SELECT id FROM new_q), 'D', 'A is incorrect but R is correct', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'B', 'R directly explains WHY management is continuous — it is the repeating POSDC cycle that makes it so. The causal link is clear.', 'Not recognising the direct causal connection between the POSDC cycle and continuity'),
    ((SELECT id FROM new_q), 'C', 'R is factually correct — management functions do form a recurring cycle in every organisation. This is a standard NCERT concept.', NULL),
    ((SELECT id FROM new_q), 'D', 'A is correct — management is indeed continuous. It does not stop after achieving one goal; new objectives are set.', NULL)
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-05
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'true-false', 'easy', 'Statement: Management is required only in business organisations and not in hospitals, clubs, or government bodies.', 'B', 'This statement is FALSE. Management is pervasive — it is required in all types of organisations, whether they are business enterprises, hospitals, educational institutions, clubs, NGOs, or government bodies. Wherever group effort is needed to achieve common goals, management is necessary.', 'active', true, ARRAY['pervasiveness','management-scope','all-organisations']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-05", "subtopic": "Pervasive nature of management", "topic_name": "Nature of Management", "bloom_level": "remember", "options": [{"key": "A", "text": "True", "is_correct": false}, {"key": "B", "text": "False", "is_correct": true}], "elimination_hints": [{"option_key": "A", "hint": "Think about hospitals, schools, and the military — they all need planning, organising, directing, and controlling. Management is not exclusive to profit-making businesses.", "misconception": "Restricting management to business organisations only"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'True', false, 0),
    ((SELECT id FROM new_q), 'B', 'False', true, 1)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Think about hospitals, schools, and the military — they all need planning, organising, directing, and controlling. Management is not exclusive to profit-making businesses.', 'Restricting management to business organisations only')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-06
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'fill-in-blanks', 'easy', 'Doing the right task at the right cost with minimum wastage of resources is called __________ in management.', 'A', 'Efficiency means doing the task correctly with minimum wastage of resources (time, money, effort). It focuses on the cost-benefit relationship. An efficient manager minimises input (resources) while maximising output. This is different from effectiveness, which is about completing the task/achieving the goal regardless of cost.', 'active', true, ARRAY['efficiency','resource-minimisation','cost-benefit']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-06", "subtopic": "Efficiency vs Effectiveness", "topic_name": "Nature of Management", "bloom_level": "remember", "options": [{"key": "A", "text": "Efficiency", "is_correct": true}, {"key": "B", "text": "Effectiveness", "is_correct": false}, {"key": "C", "text": "Coordination", "is_correct": false}, {"key": "D", "text": "Delegation", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "Effectiveness is about achieving the goal (doing the RIGHT thing), not about minimising cost. A task can be effective but inefficient if it wastes resources.", "misconception": "Confusing efficiency (how) with effectiveness (what)"}, {"option_key": "C", "hint": "Coordination is about synchronising activities of different departments — not about cost minimisation.", "misconception": "Confusing coordination with efficiency"}, {"option_key": "D", "hint": "Delegation is assigning authority to subordinates — unrelated to cost minimisation.", "misconception": "Confusing delegation with efficiency"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Efficiency', true, 0),
    ((SELECT id FROM new_q), 'B', 'Effectiveness', false, 1),
    ((SELECT id FROM new_q), 'C', 'Coordination', false, 2),
    ((SELECT id FROM new_q), 'D', 'Delegation', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'B', 'Effectiveness is about achieving the goal (doing the RIGHT thing), not about minimising cost. A task can be effective but inefficient if it wastes resources.', 'Confusing efficiency (how) with effectiveness (what)'),
    ((SELECT id FROM new_q), 'C', 'Coordination is about synchronising activities of different departments — not about cost minimisation.', 'Confusing coordination with efficiency'),
    ((SELECT id FROM new_q), 'D', 'Delegation is assigning authority to subordinates — unrelated to cost minimisation.', 'Confusing delegation with efficiency')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-07
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'scenario-based', 'medium', 'Rajesh runs a garment factory. He completed an order of 10,000 shirts on time for a client, but the production cost exceeded the budget by 40% due to overtime wages and material wastage. Rajesh''s management can be described as:', 'B', 'Rajesh achieved the goal (delivered 10,000 shirts on time) — so he was effective. However, the cost exceeded budget by 40% — so he was NOT efficient. Good management requires BOTH efficiency and effectiveness. Just completing the task is not enough; doing it within the planned cost and resources matters equally.', 'active', true, ARRAY['efficiency-vs-effectiveness','scenario-application','cost-overrun']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-07", "subtopic": "Efficiency vs Effectiveness", "topic_name": "Nature of Management", "bloom_level": "apply", "options": [{"key": "A", "text": "Both efficient and effective", "is_correct": false}, {"key": "B", "text": "Effective but not efficient", "is_correct": true}, {"key": "C", "text": "Efficient but not effective", "is_correct": false}, {"key": "D", "text": "Neither efficient nor effective", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Efficiency requires completing the task within planned resources. A 40% cost overrun clearly shows inefficiency.", "misconception": "Equating task completion with both efficiency and effectiveness"}, {"option_key": "C", "hint": "He DID complete the order on time — that means he achieved the goal (effective). He cannot be ''not effective'' when the goal was met.", "misconception": "Reversing the definitions of efficiency and effectiveness"}, {"option_key": "D", "hint": "The order was completed on time — the goal was achieved. That alone makes him effective.", "misconception": "Ignoring that goal achievement = effectiveness"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Both efficient and effective', false, 0),
    ((SELECT id FROM new_q), 'B', 'Effective but not efficient', true, 1),
    ((SELECT id FROM new_q), 'C', 'Efficient but not effective', false, 2),
    ((SELECT id FROM new_q), 'D', 'Neither efficient nor effective', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Efficiency requires completing the task within planned resources. A 40% cost overrun clearly shows inefficiency.', 'Equating task completion with both efficiency and effectiveness'),
    ((SELECT id FROM new_q), 'C', 'He DID complete the order on time — that means he achieved the goal (effective). He cannot be ''not effective'' when the goal was met.', 'Reversing the definitions of efficiency and effectiveness'),
    ((SELECT id FROM new_q), 'D', 'The order was completed on time — the goal was achieved. That alone makes him effective.', 'Ignoring that goal achievement = effectiveness')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-08
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'scenario-based', 'easy', 'Priya manages a chain of bookstores. She ensures that all branches follow the same pricing policy, maintain uniform store layout, and submit weekly sales reports. Which characteristic of management is Priya demonstrating?', 'C', 'Priya is demonstrating that management is pervasive — the same management principles and practices (uniform pricing, layout, reporting) are applied across all branches. Pervasiveness means management is common to all organisations and all levels within an organisation. Here, standardised practices across branches show this feature.', 'active', true, ARRAY['pervasiveness','uniform-practices','multi-branch']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-08", "subtopic": "Pervasive nature of management", "topic_name": "Nature of Management", "bloom_level": "apply", "options": [{"key": "A", "text": "Management is a group activity", "is_correct": false}, {"key": "B", "text": "Management is goal-oriented", "is_correct": false}, {"key": "C", "text": "Management is pervasive", "is_correct": true}, {"key": "D", "text": "Management is an intangible force", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Group activity refers to management involving multiple people working together. The scenario emphasises uniformity across branches, not teamwork.", "misconception": "Confusing pervasiveness (across branches/types) with group activity (people working together)"}, {"option_key": "B", "hint": "Goal-orientation means working towards objectives. The scenario highlights standardisation across branches, not specific goals.", "misconception": "Seeing any management activity as goal-oriented without checking what the scenario actually emphasises"}, {"option_key": "D", "hint": "Intangible force means management cannot be seen. The scenario describes visible practices (pricing, layout, reports).", "misconception": "Misidentifying the characteristic being demonstrated"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Management is a group activity', false, 0),
    ((SELECT id FROM new_q), 'B', 'Management is goal-oriented', false, 1),
    ((SELECT id FROM new_q), 'C', 'Management is pervasive', true, 2),
    ((SELECT id FROM new_q), 'D', 'Management is an intangible force', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Group activity refers to management involving multiple people working together. The scenario emphasises uniformity across branches, not teamwork.', 'Confusing pervasiveness (across branches/types) with group activity (people working together)'),
    ((SELECT id FROM new_q), 'B', 'Goal-orientation means working towards objectives. The scenario highlights standardisation across branches, not specific goals.', 'Seeing any management activity as goal-oriented without checking what the scenario actually emphasises'),
    ((SELECT id FROM new_q), 'D', 'Intangible force means management cannot be seen. The scenario describes visible practices (pricing, layout, reports).', 'Misidentifying the characteristic being demonstrated')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-09
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'mcq', 'medium', 'Which of the following arguments supports the view that management is a science?', 'A', 'Science has a systematised body of knowledge with principles based on cause-and-effect relationships that can be verified. Management qualifies as a science because it has developed universal principles (like Fayol''s principles, Taylor''s scientific management) based on observation and experimentation. However, management is not a pure/exact science — its principles are flexible guidelines, not rigid laws.', 'active', true, ARRAY['management-as-science','systematised-knowledge','principles']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-09", "subtopic": "Management as Science", "topic_name": "Nature of Management", "bloom_level": "understand", "options": [{"key": "A", "text": "It has a systematised body of knowledge with principles based on cause-and-effect", "is_correct": true}, {"key": "B", "text": "It requires personal skills and creativity to apply knowledge", "is_correct": false}, {"key": "C", "text": "It requires a minimum qualification and a professional body governs it", "is_correct": false}, {"key": "D", "text": "It involves practice-based learning and improves with experience", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "Personal skill and creativity are features of ART, not science. Art involves personalised application of knowledge.", "misconception": "Confusing features of art with science"}, {"option_key": "C", "hint": "Minimum qualification and professional body are features of a PROFESSION. ICAI for CA, BCI for law — these make those professions, not sciences.", "misconception": "Confusing features of profession with science"}, {"option_key": "D", "hint": "Practice-based learning and improvement with experience describe ART. A painter improves with practice — similarly, management as art improves with experience.", "misconception": "Confusing experiential learning (art) with systematic knowledge (science)"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'It has a systematised body of knowledge with principles based on cause-and-effect', true, 0),
    ((SELECT id FROM new_q), 'B', 'It requires personal skills and creativity to apply knowledge', false, 1),
    ((SELECT id FROM new_q), 'C', 'It requires a minimum qualification and a professional body governs it', false, 2),
    ((SELECT id FROM new_q), 'D', 'It involves practice-based learning and improves with experience', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'B', 'Personal skill and creativity are features of ART, not science. Art involves personalised application of knowledge.', 'Confusing features of art with science'),
    ((SELECT id FROM new_q), 'C', 'Minimum qualification and professional body are features of a PROFESSION. ICAI for CA, BCI for law — these make those professions, not sciences.', 'Confusing features of profession with science'),
    ((SELECT id FROM new_q), 'D', 'Practice-based learning and improvement with experience describe ART. A painter improves with practice — similarly, management as art improves with experience.', 'Confusing experiential learning (art) with systematic knowledge (science)')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-10
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'mcq', 'medium', 'Management is not considered a full-fledged profession because:', 'C', 'For a full profession, there must be: (1) a well-defined body of knowledge, (2) restricted entry through qualification, (3) a professional association as regulatory authority, (4) ethical code of conduct, and (5) service motive. Management fails on point (2) — there is no legal requirement for a specific degree to become a manager. Anyone can become a manager without an MBA. This is unlike doctors (MBBS required) or lawyers (LLB required).', 'active', true, ARRAY['management-as-profession','restricted-entry','qualification']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-10", "subtopic": "Management as Profession", "topic_name": "Nature of Management", "bloom_level": "understand", "options": [{"key": "A", "text": "It does not have a systematic body of knowledge", "is_correct": false}, {"key": "B", "text": "Managers do not follow any ethical code of conduct", "is_correct": false}, {"key": "C", "text": "There is no restriction on entry — anyone can become a manager without prescribed qualifications", "is_correct": true}, {"key": "D", "text": "There is no professional association for managers", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Management DOES have a systematic body of knowledge — MBA/BBA courses, NCERT textbooks, and management theories all prove this. This condition IS met.", "misconception": "Denying the existence of management knowledge"}, {"option_key": "B", "hint": "Many organisations and management associations (like AIMA) do have codes of conduct. This is not the primary reason.", "misconception": "Overstating the lack of ethics in management"}, {"option_key": "D", "hint": "AIMA (All India Management Association) exists as a professional body. The key missing element is mandatory qualification for entry, not the association.", "misconception": "Not knowing about AIMA or similar bodies"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'It does not have a systematic body of knowledge', false, 0),
    ((SELECT id FROM new_q), 'B', 'Managers do not follow any ethical code of conduct', false, 1),
    ((SELECT id FROM new_q), 'C', 'There is no restriction on entry — anyone can become a manager without prescribed qualifications', true, 2),
    ((SELECT id FROM new_q), 'D', 'There is no professional association for managers', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Management DOES have a systematic body of knowledge — MBA/BBA courses, NCERT textbooks, and management theories all prove this. This condition IS met.', 'Denying the existence of management knowledge'),
    ((SELECT id FROM new_q), 'B', 'Many organisations and management associations (like AIMA) do have codes of conduct. This is not the primary reason.', 'Overstating the lack of ethics in management'),
    ((SELECT id FROM new_q), 'D', 'AIMA (All India Management Association) exists as a professional body. The key missing element is mandatory qualification for entry, not the association.', 'Not knowing about AIMA or similar bodies')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-11
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'mcq', 'hard', 'Management is called an inexact or soft science because:', 'B', 'Management deals with human beings whose behaviour is unpredictable and varies from person to person. Unlike physics or chemistry where experiments give identical results under identical conditions, management principles produce different outcomes depending on the people, culture, and situation involved. Hence, it is called an inexact, social, or soft science.', 'active', true, ARRAY['inexact-science','human-behaviour','soft-science']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-11", "subtopic": "Management as Science", "topic_name": "Nature of Management", "bloom_level": "analyze", "options": [{"key": "A", "text": "Its principles were not developed through scientific methods", "is_correct": false}, {"key": "B", "text": "It deals with human behaviour which is unpredictable, so outcomes vary", "is_correct": true}, {"key": "C", "text": "It has not been studied long enough to become an exact science", "is_correct": false}, {"key": "D", "text": "Only a few of its principles have been proven correct", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Many management principles WERE developed through observation and experimentation (e.g., Taylor''s time-motion studies). The issue is not the method but the subject matter (humans).", "misconception": "Thinking management lacks scientific methodology"}, {"option_key": "C", "hint": "Management theory has been studied for over 100 years (Fayol 1916, Taylor 1911). Duration is not the issue — the inherent unpredictability of human behaviour is.", "misconception": "Attributing inexactness to insufficient research"}, {"option_key": "D", "hint": "Most management principles are widely accepted. The issue is not validity but variability — the same principle may produce different results with different people.", "misconception": "Questioning the correctness of management principles"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Its principles were not developed through scientific methods', false, 0),
    ((SELECT id FROM new_q), 'B', 'It deals with human behaviour which is unpredictable, so outcomes vary', true, 1),
    ((SELECT id FROM new_q), 'C', 'It has not been studied long enough to become an exact science', false, 2),
    ((SELECT id FROM new_q), 'D', 'Only a few of its principles have been proven correct', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Many management principles WERE developed through observation and experimentation (e.g., Taylor''s time-motion studies). The issue is not the method but the subject matter (humans).', 'Thinking management lacks scientific methodology'),
    ((SELECT id FROM new_q), 'C', 'Management theory has been studied for over 100 years (Fayol 1916, Taylor 1911). Duration is not the issue — the inherent unpredictability of human behaviour is.', 'Attributing inexactness to insufficient research'),
    ((SELECT id FROM new_q), 'D', 'Most management principles are widely accepted. The issue is not validity but variability — the same principle may produce different results with different people.', 'Questioning the correctness of management principles')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-12
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'assertion-reasoning', 'hard', 'Assertion (A): Management is both an art and a science.
Reason (R): Management has a theoretical base of principles (science) and requires practical, creative application of that knowledge (art).', 'A', 'Both A and R are true, and R correctly explains A. Management as science provides the ''knowledge'' — systematised principles, cause-and-effect relationships. Management as art provides the ''application'' — personal skill, creativity, and practice-based improvement. A good manager needs both theoretical understanding (science) and practical skill (art). R directly explains the dual nature stated in A.', 'active', true, ARRAY['art-and-science','dual-nature','theory-practice']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-12", "subtopic": "Management as Art and Science", "topic_name": "Nature of Management", "bloom_level": "analyze", "options": [{"key": "A", "text": "Both A and R are correct and R is the correct explanation of A", "is_correct": true}, {"key": "B", "text": "Both A and R are correct but R is NOT the correct explanation of A", "is_correct": false}, {"key": "C", "text": "A is correct but R is incorrect", "is_correct": false}, {"key": "D", "text": "A is incorrect but R is correct", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "R directly defines the two halves of A — ''theoretical base'' = science, ''creative application'' = art. The causal link between R and A is explicit.", "misconception": "Not seeing the direct explanatory relationship"}, {"option_key": "C", "hint": "R is factually correct. Management does have principles (science aspect) and does require creative personal application (art aspect). Both statements in R are established NCERT concepts.", "misconception": null}, {"option_key": "D", "hint": "A is a universally accepted statement in management theory. All NCERT textbooks confirm management is both an art and a science.", "misconception": null}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Both A and R are correct and R is the correct explanation of A', true, 0),
    ((SELECT id FROM new_q), 'B', 'Both A and R are correct but R is NOT the correct explanation of A', false, 1),
    ((SELECT id FROM new_q), 'C', 'A is correct but R is incorrect', false, 2),
    ((SELECT id FROM new_q), 'D', 'A is incorrect but R is correct', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'B', 'R directly defines the two halves of A — ''theoretical base'' = science, ''creative application'' = art. The causal link between R and A is explicit.', 'Not seeing the direct explanatory relationship'),
    ((SELECT id FROM new_q), 'C', 'R is factually correct. Management does have principles (science aspect) and does require creative personal application (art aspect). Both statements in R are established NCERT concepts.', NULL),
    ((SELECT id FROM new_q), 'D', 'A is a universally accepted statement in management theory. All NCERT textbooks confirm management is both an art and a science.', NULL)
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-13
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'scenario-based', 'medium', 'Dr. Mehra, a hospital administrator with no formal management degree, successfully runs a 200-bed hospital. She has learned management through years of hands-on experience, adapting her style to each situation. This best illustrates that management is:', 'B', 'Dr. Mehra has no formal degree (so management fails as a full profession — no restricted entry). She learned through experience and adapts her style (features of art — practice-based, personal skill, creative application). This scenario best illustrates management as an art, where practical experience and personal touch matter more than formal theory alone.', 'active', true, ARRAY['management-as-art','experiential-learning','no-formal-degree']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-13", "subtopic": "Management as Art", "topic_name": "Nature of Management", "bloom_level": "apply", "options": [{"key": "A", "text": "A pure science with predictable outcomes", "is_correct": false}, {"key": "B", "text": "An art that improves with practice and personal skill", "is_correct": true}, {"key": "C", "text": "A full-fledged profession with restricted entry", "is_correct": false}, {"key": "D", "text": "Neither an art nor a science", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "The scenario shows she adapts her style to each situation — that means outcomes vary. Pure sciences have predictable, repeatable outcomes.", "misconception": "Confusing adaptive management with pure science"}, {"option_key": "C", "hint": "She has NO formal management degree yet runs a hospital. This directly contradicts ''restricted entry'' — which is a feature of a full profession.", "misconception": "Ignoring that restricted entry requires mandatory qualifications"}, {"option_key": "D", "hint": "She clearly applies management principles (even if learned experientially). Her success proves management exists as a discipline — it is both art and science.", "misconception": "Denying management''s status as a discipline"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'A pure science with predictable outcomes', false, 0),
    ((SELECT id FROM new_q), 'B', 'An art that improves with practice and personal skill', true, 1),
    ((SELECT id FROM new_q), 'C', 'A full-fledged profession with restricted entry', false, 2),
    ((SELECT id FROM new_q), 'D', 'Neither an art nor a science', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'The scenario shows she adapts her style to each situation — that means outcomes vary. Pure sciences have predictable, repeatable outcomes.', 'Confusing adaptive management with pure science'),
    ((SELECT id FROM new_q), 'C', 'She has NO formal management degree yet runs a hospital. This directly contradicts ''restricted entry'' — which is a feature of a full profession.', 'Ignoring that restricted entry requires mandatory qualifications'),
    ((SELECT id FROM new_q), 'D', 'She clearly applies management principles (even if learned experientially). Her success proves management exists as a discipline — it is both art and science.', 'Denying management''s status as a discipline')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-14
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'match-the-following', 'medium', 'Match the features in Column I with the correct nature of management in Column II:

Column I:
(i) Systematised body of knowledge
(ii) Personal skill and creativity
(iii) Restricted entry through qualification
(iv) Improves with practice

Column II:
(P) Art
(Q) Science
(R) Profession', 'B', '(i) Systematised body of knowledge is a feature of Science (Q). (ii) Personal skill and creativity is a feature of Art (P). (iii) Restricted entry through qualification is a feature of Profession (R). (iv) Improves with practice is a feature of Art (P). So: (i)→Q, (ii)→P, (iii)→R, (iv)→P.', 'active', true, ARRAY['art-science-profession','matching','features']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-14", "subtopic": "Art, Science, and Profession comparison", "topic_name": "Nature of Management", "bloom_level": "understand", "options": [{"key": "A", "text": "(i)→P, (ii)→Q, (iii)→R, (iv)→Q", "is_correct": false}, {"key": "B", "text": "(i)→Q, (ii)→P, (iii)→R, (iv)→P", "is_correct": true}, {"key": "C", "text": "(i)→R, (ii)→P, (iii)→Q, (iv)→P", "is_correct": false}, {"key": "D", "text": "(i)→Q, (ii)→R, (iii)→P, (iv)→R", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Systematised knowledge is clearly Science (Q), not Art (P). Art is about application, not theory.", "misconception": "Reversing the features of art and science"}, {"option_key": "C", "hint": "Systematised body of knowledge belongs to Science (Q), not Profession (R). Profession''s key feature is restricted entry.", "misconception": "Confusing science features with profession features"}, {"option_key": "D", "hint": "Personal skill and creativity belong to Art (P), not Profession (R). Also, ''improves with practice'' is Art, not Profession.", "misconception": "Mixing up all three categories"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', '(i)→P, (ii)→Q, (iii)→R, (iv)→Q', false, 0),
    ((SELECT id FROM new_q), 'B', '(i)→Q, (ii)→P, (iii)→R, (iv)→P', true, 1),
    ((SELECT id FROM new_q), 'C', '(i)→R, (ii)→P, (iii)→Q, (iv)→P', false, 2),
    ((SELECT id FROM new_q), 'D', '(i)→Q, (ii)→R, (iii)→P, (iv)→R', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Systematised knowledge is clearly Science (Q), not Art (P). Art is about application, not theory.', 'Reversing the features of art and science'),
    ((SELECT id FROM new_q), 'C', 'Systematised body of knowledge belongs to Science (Q), not Profession (R). Profession''s key feature is restricted entry.', 'Confusing science features with profession features'),
    ((SELECT id FROM new_q), 'D', 'Personal skill and creativity belong to Art (P), not Profession (R). Also, ''improves with practice'' is Art, not Profession.', 'Mixing up all three categories')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-15
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'mcq', 'easy', 'The primary objective of management is to ensure:', 'A', 'The primary organisational objective of management is to ensure survival of the organisation in the competitive market. Beyond survival, management aims for profit (to cover costs and risks) and growth (expansion of business). Together, survival, profit, and growth form the organisational objectives. Among these, survival is the most fundamental — without it, no other objective matters.', 'active', true, ARRAY['organisational-objectives','survival','profit','growth']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-15", "subtopic": "Organisational objectives", "topic_name": "Objectives of Management", "bloom_level": "remember", "options": [{"key": "A", "text": "Achievement of organisational goals with efficiency and effectiveness", "is_correct": true}, {"key": "B", "text": "Maximum salary for all employees", "is_correct": false}, {"key": "C", "text": "Elimination of all competition from the market", "is_correct": false}, {"key": "D", "text": "Strict control over employees'' personal lives", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "Employee welfare is a personal/individual objective of management, not the primary objective. The primary objective is organisational goal achievement.", "misconception": "Confusing individual objectives with organisational objectives"}, {"option_key": "C", "hint": "Competition exists in every market. Management aims to survive and thrive in competition, not eliminate it — that would be monopolistic and unethical.", "misconception": "Confusing competitive advantage with elimination of competition"}, {"option_key": "D", "hint": "Management has no role in employees'' personal lives. It focuses on work-related coordination and goal achievement.", "misconception": "Overextending the scope of management"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Achievement of organisational goals with efficiency and effectiveness', true, 0),
    ((SELECT id FROM new_q), 'B', 'Maximum salary for all employees', false, 1),
    ((SELECT id FROM new_q), 'C', 'Elimination of all competition from the market', false, 2),
    ((SELECT id FROM new_q), 'D', 'Strict control over employees'' personal lives', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'B', 'Employee welfare is a personal/individual objective of management, not the primary objective. The primary objective is organisational goal achievement.', 'Confusing individual objectives with organisational objectives'),
    ((SELECT id FROM new_q), 'C', 'Competition exists in every market. Management aims to survive and thrive in competition, not eliminate it — that would be monopolistic and unethical.', 'Confusing competitive advantage with elimination of competition'),
    ((SELECT id FROM new_q), 'D', 'Management has no role in employees'' personal lives. It focuses on work-related coordination and goal achievement.', 'Overextending the scope of management')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-16
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'scenario-based', 'hard', 'XYZ Ltd. is a profitable company. Its management decides to install an effluent treatment plant costing Rs. 2 crore to prevent river pollution, even though the law does not mandate it for their category of industry. This action fulfils which objective of management?', 'C', 'Installing an effluent treatment plant voluntarily (beyond legal requirement) to prevent pollution is an example of social objective of management. Social objectives require the organisation to contribute to society''s welfare — using environment-friendly methods, providing employment to disadvantaged sections, and participating in community development. This is not an organisational or personal objective.', 'active', true, ARRAY['social-objectives','environment','voluntary-compliance','CSR']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-16", "subtopic": "Social objectives", "topic_name": "Objectives of Management", "bloom_level": "apply", "options": [{"key": "A", "text": "Organisational objective — survival", "is_correct": false}, {"key": "B", "text": "Personal objective — employee welfare", "is_correct": false}, {"key": "C", "text": "Social objective — environmental responsibility", "is_correct": true}, {"key": "D", "text": "Organisational objective — profit maximisation", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Survival means the company needs to earn enough to cover costs. Spending Rs. 2 crore voluntarily on pollution control is not about survival — it is about social responsibility.", "misconception": "Confusing voluntary social spending with survival necessity"}, {"option_key": "B", "hint": "Employee welfare means salary, promotion, working conditions for staff. An effluent treatment plant benefits society/environment, not specifically employees.", "misconception": "Confusing social objectives with personal objectives"}, {"option_key": "D", "hint": "Spending Rs. 2 crore on something not legally required REDUCES profit, not maximises it. This is the opposite of profit maximisation.", "misconception": "Thinking all management actions aim at profit"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Organisational objective — survival', false, 0),
    ((SELECT id FROM new_q), 'B', 'Personal objective — employee welfare', false, 1),
    ((SELECT id FROM new_q), 'C', 'Social objective — environmental responsibility', true, 2),
    ((SELECT id FROM new_q), 'D', 'Organisational objective — profit maximisation', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Survival means the company needs to earn enough to cover costs. Spending Rs. 2 crore voluntarily on pollution control is not about survival — it is about social responsibility.', 'Confusing voluntary social spending with survival necessity'),
    ((SELECT id FROM new_q), 'B', 'Employee welfare means salary, promotion, working conditions for staff. An effluent treatment plant benefits society/environment, not specifically employees.', 'Confusing social objectives with personal objectives'),
    ((SELECT id FROM new_q), 'D', 'Spending Rs. 2 crore on something not legally required REDUCES profit, not maximises it. This is the opposite of profit maximisation.', 'Thinking all management actions aim at profit')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-17
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'true-false', 'easy', 'Statement: Effectiveness in management refers to completing tasks on time and achieving goals, while efficiency refers to achieving goals with minimum resources.', 'A', 'This statement is TRUE. Effectiveness means doing the right thing — achieving the desired objectives/goals on time. Efficiency means doing things right — achieving goals with minimum waste of resources (time, money, materials). A good manager must be both effective (achieve goals) and efficient (use resources wisely). These are two different but complementary concepts.', 'active', true, ARRAY['effectiveness','efficiency','definitions']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-17", "subtopic": "Efficiency vs Effectiveness", "topic_name": "Nature of Management", "bloom_level": "remember", "options": [{"key": "A", "text": "True", "is_correct": true}, {"key": "B", "text": "False", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "Both definitions are standard NCERT definitions. Effectiveness = goal achievement. Efficiency = optimal resource use. The statement accurately describes both.", "misconception": "Reversing or conflating the definitions of efficiency and effectiveness"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'True', true, 0),
    ((SELECT id FROM new_q), 'B', 'False', false, 1)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'B', 'Both definitions are standard NCERT definitions. Effectiveness = goal achievement. Efficiency = optimal resource use. The statement accurately describes both.', 'Reversing or conflating the definitions of efficiency and effectiveness')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-18
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'diagram-based', 'medium', 'Study the diagram showing the relationship between Efficiency and Effectiveness in management. Based on the diagram, which quadrant represents ideal management?', 'A', 'Ideal management achieves BOTH high efficiency (minimum resource wastage) AND high effectiveness (goals achieved). This is Quadrant I (top-right). Quadrant II achieves goals but wastes resources. Quadrant III saves resources but fails to achieve goals. Quadrant IV is the worst — neither goals nor resources are managed well.', 'active', true, ARRAY['efficiency-effectiveness-matrix','ideal-management','2x2-diagram']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-18", "subtopic": "Efficiency and Effectiveness combined", "topic_name": "Nature of Management", "bloom_level": "analyze", "options": [{"key": "A", "text": "Quadrant I — High Efficiency and High Effectiveness", "is_correct": true}, {"key": "B", "text": "Quadrant II — Low Efficiency and High Effectiveness", "is_correct": false}, {"key": "C", "text": "Quadrant III — High Efficiency and Low Effectiveness", "is_correct": false}, {"key": "D", "text": "Quadrant IV — Low Efficiency and Low Effectiveness", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "Achieving goals but wasting resources (cost overrun, time delays) is not ideal. A company that delivers but doubles the budget is poorly managed.", "misconception": "Thinking only effectiveness matters"}, {"option_key": "C", "hint": "Saving resources but failing to achieve goals is pointless. A company that stays within budget but delivers a faulty product has failed.", "misconception": "Thinking only efficiency matters"}, {"option_key": "D", "hint": "Neither efficient nor effective is clearly the worst quadrant, not the ideal one.", "misconception": null}], "image_uri": "diagrams/cuet-bst-nature-mgmt-18.png", "image_alt": "2x2 matrix with Efficiency on X-axis (Low to High) and Effectiveness on Y-axis (Low to High). Quadrant I (top-right): High Efficiency + High Effectiveness. Quadrant II (top-left): Low Efficiency + High Effectiveness. Quadrant III (bottom-right): High Efficiency + Low Effectiveness. Quadrant IV (bottom-left): Low Efficiency + Low Effectiveness."}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Quadrant I — High Efficiency and High Effectiveness', true, 0),
    ((SELECT id FROM new_q), 'B', 'Quadrant II — Low Efficiency and High Effectiveness', false, 1),
    ((SELECT id FROM new_q), 'C', 'Quadrant III — High Efficiency and Low Effectiveness', false, 2),
    ((SELECT id FROM new_q), 'D', 'Quadrant IV — Low Efficiency and Low Effectiveness', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'B', 'Achieving goals but wasting resources (cost overrun, time delays) is not ideal. A company that delivers but doubles the budget is poorly managed.', 'Thinking only effectiveness matters'),
    ((SELECT id FROM new_q), 'C', 'Saving resources but failing to achieve goals is pointless. A company that stays within budget but delivers a faulty product has failed.', 'Thinking only efficiency matters'),
    ((SELECT id FROM new_q), 'D', 'Neither efficient nor effective is clearly the worst quadrant, not the ideal one.', NULL)
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-19
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'diagram-based', 'hard', 'Study the diagram showing the features of Management as Art, Science, and Profession. Which feature shown in the diagram is the primary reason management does NOT qualify as a full-fledged profession?', 'B', 'The diagram highlights ''Restricted entry'' with a cross mark in the Profession circle. This is the primary reason management is not a full profession. Unlike medicine (MBBS required) or law (LLB required), there is no mandatory qualification to become a manager. Anyone can be appointed as a manager based on experience, skills, or ownership — without any prescribed educational qualification.', 'active', true, ARRAY['profession-criteria','restricted-entry','venn-diagram']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-19", "subtopic": "Management as Profession — limitations", "topic_name": "Nature of Management", "bloom_level": "analyze", "options": [{"key": "A", "text": "Ethical code of conduct — managers have no ethics", "is_correct": false}, {"key": "B", "text": "Restricted entry — no mandatory qualification is required to become a manager", "is_correct": true}, {"key": "C", "text": "Systematic knowledge — management has no theoretical base", "is_correct": false}, {"key": "D", "text": "Service motive — managers work only for personal gain", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Many organisations and management bodies DO prescribe ethical codes. The issue is not the absence of ethics but the absence of mandatory entry qualifications.", "misconception": "Overstating ethical deficiency in management"}, {"option_key": "C", "hint": "Management clearly has a theoretical base — MBA programmes, NCERT textbooks, and management journals prove this. The ''Science'' circle in the diagram confirms this feature IS met.", "misconception": "Denying the existence of management theory"}, {"option_key": "D", "hint": "Many managers and organisations do serve social purposes. Service motive is partially present in management. The PRIMARY gap is restricted entry.", "misconception": "Assuming all managers lack service orientation"}], "image_uri": "diagrams/cuet-bst-nature-mgmt-19.png", "image_alt": "Venn diagram with three overlapping circles: Art (Personal skill, Creativity, Practice-based), Science (Systematic knowledge, Cause-effect principles, Universal application), Profession (Restricted entry, Ethical code, Professional body, Service motive). The ''Restricted entry'' feature in the Profession circle is highlighted with a cross mark to indicate it is NOT fully met by management."}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Ethical code of conduct — managers have no ethics', false, 0),
    ((SELECT id FROM new_q), 'B', 'Restricted entry — no mandatory qualification is required to become a manager', true, 1),
    ((SELECT id FROM new_q), 'C', 'Systematic knowledge — management has no theoretical base', false, 2),
    ((SELECT id FROM new_q), 'D', 'Service motive — managers work only for personal gain', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Many organisations and management bodies DO prescribe ethical codes. The issue is not the absence of ethics but the absence of mandatory entry qualifications.', 'Overstating ethical deficiency in management'),
    ((SELECT id FROM new_q), 'C', 'Management clearly has a theoretical base — MBA programmes, NCERT textbooks, and management journals prove this. The ''Science'' circle in the diagram confirms this feature IS met.', 'Denying the existence of management theory'),
    ((SELECT id FROM new_q), 'D', 'Many managers and organisations do serve social purposes. Service motive is partially present in management. The PRIMARY gap is restricted entry.', 'Assuming all managers lack service orientation')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-20
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'scenario-based', 'hard', 'Aman runs a software company. He provides competitive salaries, career growth opportunities, and a healthy work environment to retain talented employees. Recently, he also started a free coding bootcamp for underprivileged youth in his city. Which combination of management objectives is Aman fulfilling?', 'D', 'Competitive salaries and career growth for employees fulfil the PERSONAL objectives of management (meeting employee needs for fair compensation and development). The free coding bootcamp for underprivileged youth fulfils the SOCIAL objectives (contributing to society''s development). Together, Aman is fulfilling both personal and social objectives of management.', 'active', true, ARRAY['personal-objectives','social-objectives','combined-objectives']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-20", "subtopic": "Personal and Social objectives", "topic_name": "Objectives of Management", "bloom_level": "analyze", "options": [{"key": "A", "text": "Organisational and personal objectives only", "is_correct": false}, {"key": "B", "text": "Organisational and social objectives only", "is_correct": false}, {"key": "C", "text": "Only social objectives", "is_correct": false}, {"key": "D", "text": "Personal objectives (employee welfare) and social objectives (community development)", "is_correct": true}], "elimination_hints": [{"option_key": "A", "hint": "The free coding bootcamp for underprivileged youth is a SOCIAL objective, not an organisational one. Organisational objectives are survival, profit, and growth.", "misconception": "Classifying community service as an organisational objective"}, {"option_key": "B", "hint": "Salaries and career growth for employees are PERSONAL objectives (meeting employees'' individual needs), not organisational objectives.", "misconception": "Confusing employee welfare (personal) with organisational goals"}, {"option_key": "C", "hint": "The scenario clearly has TWO parts — employee welfare (personal) and community bootcamp (social). Choosing only social ignores the first half.", "misconception": "Reading only part of the scenario"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Organisational and personal objectives only', false, 0),
    ((SELECT id FROM new_q), 'B', 'Organisational and social objectives only', false, 1),
    ((SELECT id FROM new_q), 'C', 'Only social objectives', false, 2),
    ((SELECT id FROM new_q), 'D', 'Personal objectives (employee welfare) and social objectives (community development)', true, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'The free coding bootcamp for underprivileged youth is a SOCIAL objective, not an organisational one. Organisational objectives are survival, profit, and growth.', 'Classifying community service as an organisational objective'),
    ((SELECT id FROM new_q), 'B', 'Salaries and career growth for employees are PERSONAL objectives (meeting employees'' individual needs), not organisational objectives.', 'Confusing employee welfare (personal) with organisational goals'),
    ((SELECT id FROM new_q), 'C', 'The scenario clearly has TWO parts — employee welfare (personal) and community bootcamp (social). Choosing only social ignores the first half.', 'Reading only part of the scenario')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-21
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'mcq', 'easy', 'Which level of management is responsible for the welfare and survival of the organisation as a whole?', 'A', 'Top-level management (Board of Directors, CEO, MD, Chairman) is responsible for the overall welfare, survival, and growth of the organisation. They frame policies, set objectives, and make strategic decisions that affect the entire organisation. Middle and operational levels implement these decisions within their respective domains.', 'active', true, ARRAY['top-level-management','strategic-decisions','organisational-welfare']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-21", "subtopic": "Top-level management functions", "topic_name": "Levels of Management", "bloom_level": "remember", "options": [{"key": "A", "text": "Top-level management", "is_correct": true}, {"key": "B", "text": "Middle-level management", "is_correct": false}, {"key": "C", "text": "Operational-level management", "is_correct": false}, {"key": "D", "text": "All levels equally", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "Middle management implements policies set by top management. They are responsible for departmental performance, not the organisation''s overall survival.", "misconception": "Confusing departmental responsibility with organisational responsibility"}, {"option_key": "C", "hint": "Operational/supervisory level manages day-to-day work of workers. Their scope is limited to shop-floor activities, not strategic survival.", "misconception": "Confusing operational tasks with strategic responsibility"}, {"option_key": "D", "hint": "While all levels contribute, the ULTIMATE responsibility for survival and welfare lies specifically with top management who make strategic decisions.", "misconception": "Distributing strategic accountability equally across levels"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Top-level management', true, 0),
    ((SELECT id FROM new_q), 'B', 'Middle-level management', false, 1),
    ((SELECT id FROM new_q), 'C', 'Operational-level management', false, 2),
    ((SELECT id FROM new_q), 'D', 'All levels equally', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'B', 'Middle management implements policies set by top management. They are responsible for departmental performance, not the organisation''s overall survival.', 'Confusing departmental responsibility with organisational responsibility'),
    ((SELECT id FROM new_q), 'C', 'Operational/supervisory level manages day-to-day work of workers. Their scope is limited to shop-floor activities, not strategic survival.', 'Confusing operational tasks with strategic responsibility'),
    ((SELECT id FROM new_q), 'D', 'While all levels contribute, the ULTIMATE responsibility for survival and welfare lies specifically with top management who make strategic decisions.', 'Distributing strategic accountability equally across levels')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-22
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'mcq', 'easy', 'A foreman in a factory is an example of:', 'C', 'A foreman (also called supervisor, superintendent, or section officer) belongs to the operational or supervisory level of management. This is the lowest level of management that directly oversees workers on the shop floor. Foremen ensure that workers follow instructions, maintain quality, and meet daily production targets.', 'active', true, ARRAY['operational-level','foreman','supervisor']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-22", "subtopic": "Operational-level management", "topic_name": "Levels of Management", "bloom_level": "remember", "options": [{"key": "A", "text": "Top-level management", "is_correct": false}, {"key": "B", "text": "Middle-level management", "is_correct": false}, {"key": "C", "text": "Operational or supervisory-level management", "is_correct": true}, {"key": "D", "text": "Not a part of management", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Top-level includes CEO, MD, Board of Directors — people who set organisational policy. A foreman does not set policies.", "misconception": "Not knowing the designations at each level"}, {"option_key": "B", "hint": "Middle-level includes departmental heads, plant managers, and division heads. A foreman reports TO these people — he is one level below.", "misconception": "Confusing supervisory role with departmental head role"}, {"option_key": "D", "hint": "Foremen ARE part of management — they are the first line of management that bridges workers and middle management.", "misconception": "Thinking only senior executives are managers"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Top-level management', false, 0),
    ((SELECT id FROM new_q), 'B', 'Middle-level management', false, 1),
    ((SELECT id FROM new_q), 'C', 'Operational or supervisory-level management', true, 2),
    ((SELECT id FROM new_q), 'D', 'Not a part of management', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Top-level includes CEO, MD, Board of Directors — people who set organisational policy. A foreman does not set policies.', 'Not knowing the designations at each level'),
    ((SELECT id FROM new_q), 'B', 'Middle-level includes departmental heads, plant managers, and division heads. A foreman reports TO these people — he is one level below.', 'Confusing supervisory role with departmental head role'),
    ((SELECT id FROM new_q), 'D', 'Foremen ARE part of management — they are the first line of management that bridges workers and middle management.', 'Thinking only senior executives are managers')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-23
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'mcq', 'medium', 'Which level of management serves as a link between top-level and operational-level management?', 'B', 'Middle-level management (departmental heads, plant superintendents, operations managers) acts as a vital link between top management and supervisory level. They interpret the policies framed by top management and translate them into specific plans and actions for the operational level. They also communicate feedback from supervisory level back to top management.', 'active', true, ARRAY['middle-level','linking-role','interpretation-of-policies']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-23", "subtopic": "Middle-level management functions", "topic_name": "Levels of Management", "bloom_level": "understand", "options": [{"key": "A", "text": "Top-level management", "is_correct": false}, {"key": "B", "text": "Middle-level management", "is_correct": true}, {"key": "C", "text": "Operational-level management", "is_correct": false}, {"key": "D", "text": "External consultants", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Top management is at the apex — they give directions downward but do not serve as an intermediary link. They are the source of policies, not the bridge.", "misconception": "Thinking top management connects all levels"}, {"option_key": "C", "hint": "Operational level is at the bottom — they receive instructions from middle management but do not link upward to top management.", "misconception": "Reversing the flow of the management hierarchy"}, {"option_key": "D", "hint": "External consultants are not part of the management hierarchy. The link between levels must be an internal management position.", "misconception": "Introducing external roles into the hierarchy"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Top-level management', false, 0),
    ((SELECT id FROM new_q), 'B', 'Middle-level management', true, 1),
    ((SELECT id FROM new_q), 'C', 'Operational-level management', false, 2),
    ((SELECT id FROM new_q), 'D', 'External consultants', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Top management is at the apex — they give directions downward but do not serve as an intermediary link. They are the source of policies, not the bridge.', 'Thinking top management connects all levels'),
    ((SELECT id FROM new_q), 'C', 'Operational level is at the bottom — they receive instructions from middle management but do not link upward to top management.', 'Reversing the flow of the management hierarchy'),
    ((SELECT id FROM new_q), 'D', 'External consultants are not part of the management hierarchy. The link between levels must be an internal management position.', 'Introducing external roles into the hierarchy')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-24
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'scenario-based', 'medium', 'Sunita is the Production Manager at a textile company. She assigns work to supervisors, ensures departmental targets are met, motivates her team, and reports performance to the CEO. Which level of management does Sunita belong to?', 'B', 'Sunita is a Production Manager — a departmental head. She assigns work to supervisors (who are operational level below her), ensures departmental targets, and reports to the CEO (who is top level above her). This linking role — interpreting top management''s policies for the operational level and reporting upward — is the defining characteristic of middle-level management.', 'active', true, ARRAY['middle-level','departmental-head','linking-role']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-24", "subtopic": "Identifying management levels", "topic_name": "Levels of Management", "bloom_level": "apply", "options": [{"key": "A", "text": "Top-level management", "is_correct": false}, {"key": "B", "text": "Middle-level management", "is_correct": true}, {"key": "C", "text": "Operational-level management", "is_correct": false}, {"key": "D", "text": "She is not a manager since she reports to someone above her", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "She reports TO the CEO — which means the CEO is above her. Top-level management does not report to anyone within the organisation (only to shareholders/board).", "misconception": "Thinking any person who manages others is top-level"}, {"option_key": "C", "hint": "She assigns work to supervisors — meaning supervisors are below her. Operational-level managers do not have supervisors reporting to them; they directly manage workers.", "misconception": "Confusing departmental head with supervisor"}, {"option_key": "D", "hint": "Almost everyone in an organisation reports to someone. Even middle managers are managers — they manage their department. Only the CEO has no internal superior.", "misconception": "Thinking managers cannot have superiors"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Top-level management', false, 0),
    ((SELECT id FROM new_q), 'B', 'Middle-level management', true, 1),
    ((SELECT id FROM new_q), 'C', 'Operational-level management', false, 2),
    ((SELECT id FROM new_q), 'D', 'She is not a manager since she reports to someone above her', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'She reports TO the CEO — which means the CEO is above her. Top-level management does not report to anyone within the organisation (only to shareholders/board).', 'Thinking any person who manages others is top-level'),
    ((SELECT id FROM new_q), 'C', 'She assigns work to supervisors — meaning supervisors are below her. Operational-level managers do not have supervisors reporting to them; they directly manage workers.', 'Confusing departmental head with supervisor'),
    ((SELECT id FROM new_q), 'D', 'Almost everyone in an organisation reports to someone. Even middle managers are managers — they manage their department. Only the CEO has no internal superior.', 'Thinking managers cannot have superiors')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-25
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'scenario-based', 'hard', 'At ABC Ltd., Mr. Sharma (CEO) decides to expand into the European market. Mrs. Kapoor (Marketing Head) develops a market-entry strategy and assigns regional targets to her team leads. Mr. Ravi (Sales Supervisor) ensures his 15-member sales team makes daily calls and meets weekly targets. Identify the correct matching of persons to management levels.', 'A', 'Mr. Sharma (CEO) makes strategic expansion decisions — Top-level. Mrs. Kapoor (Marketing Head) translates strategy into departmental plans and assigns targets to team leads — Middle-level. Mr. Ravi (Sales Supervisor) directly manages a team of 15 salespeople and ensures daily execution — Operational-level. This is the classic three-tier hierarchy.', 'active', true, ARRAY['three-levels','hierarchy','real-scenario']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-25", "subtopic": "Identifying management levels in practice", "topic_name": "Levels of Management", "bloom_level": "analyze", "options": [{"key": "A", "text": "Sharma — Top, Kapoor — Middle, Ravi — Operational", "is_correct": true}, {"key": "B", "text": "Sharma — Middle, Kapoor — Top, Ravi — Operational", "is_correct": false}, {"key": "C", "text": "Sharma — Top, Kapoor — Operational, Ravi — Middle", "is_correct": false}, {"key": "D", "text": "All three are at the same level since they all manage people", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "The CEO is always top-level. A Marketing Head reports to the CEO, making her middle-level. The hierarchy is clear from the reporting structure.", "misconception": "Not knowing that CEO is the top designation"}, {"option_key": "C", "hint": "Mrs. Kapoor (Marketing Head) develops strategy and assigns to team leads — that is middle management. Ravi directly supervises workers — that is operational. They are reversed in this option.", "misconception": "Confusing who manages departments vs who manages workers"}, {"option_key": "D", "hint": "Managing people does not make everyone equal in the hierarchy. The SCOPE and NATURE of decisions differ at each level — strategic, tactical, and operational.", "misconception": "Ignoring the hierarchical difference in management levels"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Sharma — Top, Kapoor — Middle, Ravi — Operational', true, 0),
    ((SELECT id FROM new_q), 'B', 'Sharma — Middle, Kapoor — Top, Ravi — Operational', false, 1),
    ((SELECT id FROM new_q), 'C', 'Sharma — Top, Kapoor — Operational, Ravi — Middle', false, 2),
    ((SELECT id FROM new_q), 'D', 'All three are at the same level since they all manage people', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'B', 'The CEO is always top-level. A Marketing Head reports to the CEO, making her middle-level. The hierarchy is clear from the reporting structure.', 'Not knowing that CEO is the top designation'),
    ((SELECT id FROM new_q), 'C', 'Mrs. Kapoor (Marketing Head) develops strategy and assigns to team leads — that is middle management. Ravi directly supervises workers — that is operational. They are reversed in this option.', 'Confusing who manages departments vs who manages workers'),
    ((SELECT id FROM new_q), 'D', 'Managing people does not make everyone equal in the hierarchy. The SCOPE and NATURE of decisions differ at each level — strategic, tactical, and operational.', 'Ignoring the hierarchical difference in management levels')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-26
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'diagram-based', 'medium', 'Study the pyramid diagram showing the three levels of management. According to the diagram, which level spends the MOST time on planning and the LEAST time on direct supervision of workers?', 'A', 'The pyramid shows that top-level management spends 70% of time on planning and only 10% on direct supervision. As we move down the hierarchy, planning time decreases and supervision time increases. Operational level spends 70% on supervision and only 10% on planning. This reflects the nature of each level — top management is strategic (planning-heavy), operational management is execution-heavy (supervision-heavy).', 'active', true, ARRAY['management-pyramid','time-allocation','planning-vs-supervising']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-26", "subtopic": "Time allocation across levels", "topic_name": "Levels of Management", "bloom_level": "analyze", "options": [{"key": "A", "text": "Top-level management", "is_correct": true}, {"key": "B", "text": "Middle-level management", "is_correct": false}, {"key": "C", "text": "Operational-level management", "is_correct": false}, {"key": "D", "text": "All levels spend equal time on planning", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "The diagram shows middle-level at 40% planning — significant but not the most. Top-level is at 70%. Middle management balances planning and execution.", "misconception": "Thinking middle management is the most planning-intensive"}, {"option_key": "C", "hint": "The diagram clearly shows operational-level at only 10% planning and 70% supervision — the exact opposite of what the question asks.", "misconception": "Reversing the planning-supervision relationship"}, {"option_key": "D", "hint": "The diagram explicitly shows different percentages at each level. The whole point of levels is that responsibilities DIFFER.", "misconception": "Assuming equal distribution across levels"}], "image_uri": "diagrams/cuet-bst-nature-mgmt-26.png", "image_alt": "Management hierarchy pyramid with three tiers. Top tier (smallest): Top-Level — CEO, MD, Board. Shows bar: 70% Planning, 20% Organising, 10% Supervising. Middle tier: Middle-Level — Dept Heads, Plant Managers. Shows bar: 40% Planning, 35% Organising, 25% Supervising. Bottom tier (largest): Operational-Level — Supervisors, Foremen. Shows bar: 10% Planning, 20% Organising, 70% Supervising."}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Top-level management', true, 0),
    ((SELECT id FROM new_q), 'B', 'Middle-level management', false, 1),
    ((SELECT id FROM new_q), 'C', 'Operational-level management', false, 2),
    ((SELECT id FROM new_q), 'D', 'All levels spend equal time on planning', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'B', 'The diagram shows middle-level at 40% planning — significant but not the most. Top-level is at 70%. Middle management balances planning and execution.', 'Thinking middle management is the most planning-intensive'),
    ((SELECT id FROM new_q), 'C', 'The diagram clearly shows operational-level at only 10% planning and 70% supervision — the exact opposite of what the question asks.', 'Reversing the planning-supervision relationship'),
    ((SELECT id FROM new_q), 'D', 'The diagram explicitly shows different percentages at each level. The whole point of levels is that responsibilities DIFFER.', 'Assuming equal distribution across levels')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-27
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'diagram-based', 'hard', 'Study the organisational hierarchy diagram. The arrows show the flow of authority and communication. Which statement is INCORRECT based on the diagram?', 'C', 'The diagram shows authority flowing downward (policies, objectives) and feedback flowing upward (reports, grievances). The incorrect statement would be one that claims workers directly report to the CEO — in reality, workers report to supervisors (operational level), who report to department heads (middle level), who report to CEO (top level). The chain of command must be followed.', 'active', true, ARRAY['hierarchy-flow','authority-communication','chain-of-command']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-27", "subtopic": "Authority and communication flow", "topic_name": "Levels of Management", "bloom_level": "analyze", "options": [{"key": "A", "text": "Authority flows from top level downward to operational level", "is_correct": false}, {"key": "B", "text": "Middle-level management interprets policies for the operational level", "is_correct": false}, {"key": "C", "text": "Workers directly communicate their grievances to the CEO, bypassing middle management", "is_correct": true}, {"key": "D", "text": "Feedback and reports flow upward from operational to top level through middle level", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "The downward arrows in the diagram clearly confirm this. Authority flows from CEO → Dept Heads → Supervisors. This is correct, not incorrect.", "misconception": null}, {"option_key": "B", "hint": "The diagram labels middle level as ''LINK between Top and Operational'' and shows it receiving policies from above and passing them down. This is correct.", "misconception": null}, {"option_key": "D", "hint": "The upward arrows labelled ''Feedback, Reports, Grievances'' confirm this flow. Information moves up through the hierarchy. This is correct.", "misconception": null}], "image_uri": "diagrams/cuet-bst-nature-mgmt-27.png", "image_alt": "Organisational hierarchy with three levels connected by downward arrows (authority flow) and upward arrows (feedback flow). Top Level (CEO, Board) → Middle Level (Dept Heads) → Operational Level (Supervisors) → Workers. Downward arrows labelled ''Policies, Objectives, Strategies''. Upward arrows labelled ''Feedback, Reports, Grievances''. A side note shows: Middle Level acts as LINK between Top and Operational."}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Authority flows from top level downward to operational level', false, 0),
    ((SELECT id FROM new_q), 'B', 'Middle-level management interprets policies for the operational level', false, 1),
    ((SELECT id FROM new_q), 'C', 'Workers directly communicate their grievances to the CEO, bypassing middle management', true, 2),
    ((SELECT id FROM new_q), 'D', 'Feedback and reports flow upward from operational to top level through middle level', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'The downward arrows in the diagram clearly confirm this. Authority flows from CEO → Dept Heads → Supervisors. This is correct, not incorrect.', NULL),
    ((SELECT id FROM new_q), 'B', 'The diagram labels middle level as ''LINK between Top and Operational'' and shows it receiving policies from above and passing them down. This is correct.', NULL),
    ((SELECT id FROM new_q), 'D', 'The upward arrows labelled ''Feedback, Reports, Grievances'' confirm this flow. Information moves up through the hierarchy. This is correct.', NULL)
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-28
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'mcq', 'easy', 'The first function in the process of management is:', 'B', 'Planning is the first and most fundamental function of management. It involves setting objectives and determining a course of action to achieve them. All other functions — organising, staffing, directing, and controlling — follow from planning. Without planning, there is no roadmap for the organisation to follow.', 'active', true, ARRAY['planning','first-function','POSDC']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-28", "subtopic": "Planning as the first function", "topic_name": "Functions of Management", "bloom_level": "remember", "options": [{"key": "A", "text": "Organising", "is_correct": false}, {"key": "B", "text": "Planning", "is_correct": true}, {"key": "C", "text": "Staffing", "is_correct": false}, {"key": "D", "text": "Controlling", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Organising comes AFTER planning. You first decide WHAT to do (planning), then decide HOW to arrange resources (organising).", "misconception": "Thinking organising precedes planning"}, {"option_key": "C", "hint": "Staffing (hiring people) comes after organising. You must first plan and create an organisational structure before filling positions.", "misconception": "Placing staffing before planning"}, {"option_key": "D", "hint": "Controlling is the LAST function in the cycle — it involves checking whether plans were achieved. It cannot come first.", "misconception": "Reversing the management function sequence"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Organising', false, 0),
    ((SELECT id FROM new_q), 'B', 'Planning', true, 1),
    ((SELECT id FROM new_q), 'C', 'Staffing', false, 2),
    ((SELECT id FROM new_q), 'D', 'Controlling', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Organising comes AFTER planning. You first decide WHAT to do (planning), then decide HOW to arrange resources (organising).', 'Thinking organising precedes planning'),
    ((SELECT id FROM new_q), 'C', 'Staffing (hiring people) comes after organising. You must first plan and create an organisational structure before filling positions.', 'Placing staffing before planning'),
    ((SELECT id FROM new_q), 'D', 'Controlling is the LAST function in the cycle — it involves checking whether plans were achieved. It cannot come first.', 'Reversing the management function sequence')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-29
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'mcq', 'medium', 'Which function of management involves assigning duties, grouping tasks, establishing authority relationships, and allocating resources?', 'B', 'Organising is the function that involves: (1) identifying and dividing work into manageable activities, (2) grouping similar activities into departments, (3) assigning duties to individuals, and (4) establishing authority-responsibility relationships. It creates a structure that enables people to work together effectively towards achieving planned objectives.', 'active', true, ARRAY['organising','authority-relationships','departmentation']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-29", "subtopic": "Organising function", "topic_name": "Functions of Management", "bloom_level": "understand", "options": [{"key": "A", "text": "Planning", "is_correct": false}, {"key": "B", "text": "Organising", "is_correct": true}, {"key": "C", "text": "Directing", "is_correct": false}, {"key": "D", "text": "Controlling", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Planning decides WHAT to do and sets objectives. It does not deal with grouping tasks or establishing authority — that is organising''s job.", "misconception": "Confusing goal-setting (planning) with structure-creation (organising)"}, {"option_key": "C", "hint": "Directing involves motivating, leading, and communicating with employees. It does not deal with grouping tasks or creating structure.", "misconception": "Confusing directing (people management) with organising (structure creation)"}, {"option_key": "D", "hint": "Controlling involves measuring performance and comparing it with standards. It does not create organisational structure.", "misconception": "Confusing performance monitoring with structure creation"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Planning', false, 0),
    ((SELECT id FROM new_q), 'B', 'Organising', true, 1),
    ((SELECT id FROM new_q), 'C', 'Directing', false, 2),
    ((SELECT id FROM new_q), 'D', 'Controlling', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Planning decides WHAT to do and sets objectives. It does not deal with grouping tasks or establishing authority — that is organising''s job.', 'Confusing goal-setting (planning) with structure-creation (organising)'),
    ((SELECT id FROM new_q), 'C', 'Directing involves motivating, leading, and communicating with employees. It does not deal with grouping tasks or creating structure.', 'Confusing directing (people management) with organising (structure creation)'),
    ((SELECT id FROM new_q), 'D', 'Controlling involves measuring performance and comparing it with standards. It does not create organisational structure.', 'Confusing performance monitoring with structure creation')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-30
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'mcq', 'medium', 'Directing as a function of management does NOT include:', 'D', 'Directing includes four elements: (1) Supervision, (2) Motivation, (3) Leadership, and (4) Communication. Setting performance standards is part of CONTROLLING, not directing. In controlling, managers set standards, measure actual performance, compare it with standards, and take corrective action. Directing is about guiding and inspiring people to work.', 'active', true, ARRAY['directing','elements-of-directing','controlling-distinction']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-30", "subtopic": "Directing function elements", "topic_name": "Functions of Management", "bloom_level": "understand", "options": [{"key": "A", "text": "Supervision of employees", "is_correct": false}, {"key": "B", "text": "Motivation of employees", "is_correct": false}, {"key": "C", "text": "Leadership and communication", "is_correct": false}, {"key": "D", "text": "Setting performance standards and measuring deviations", "is_correct": true}], "elimination_hints": [{"option_key": "A", "hint": "Supervision is a core element of directing — overseeing workers to ensure they follow instructions correctly.", "misconception": null}, {"option_key": "B", "hint": "Motivation is a key element of directing — inspiring employees through financial and non-financial incentives to perform better.", "misconception": null}, {"option_key": "C", "hint": "Both leadership and communication are elements of directing. A good director leads by example and communicates clearly.", "misconception": null}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Supervision of employees', false, 0),
    ((SELECT id FROM new_q), 'B', 'Motivation of employees', false, 1),
    ((SELECT id FROM new_q), 'C', 'Leadership and communication', false, 2),
    ((SELECT id FROM new_q), 'D', 'Setting performance standards and measuring deviations', true, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Supervision is a core element of directing — overseeing workers to ensure they follow instructions correctly.', NULL),
    ((SELECT id FROM new_q), 'B', 'Motivation is a key element of directing — inspiring employees through financial and non-financial incentives to perform better.', NULL),
    ((SELECT id FROM new_q), 'C', 'Both leadership and communication are elements of directing. A good director leads by example and communicates clearly.', NULL)
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-31
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'mcq', 'hard', 'Which of the following correctly describes the relationship between planning and controlling?', 'C', 'Planning and controlling are called ''inseparable twins'' of management. Planning provides the standards/benchmarks against which controlling measures actual performance. Without planning, controlling would have no basis for comparison. Without controlling, planning would be mere wishful thinking with no follow-up. They are forward-looking (planning) and backward-looking (controlling) functions that complete each other.', 'active', true, ARRAY['planning-controlling','inseparable-twins','interdependence']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-31", "subtopic": "Planning and Controlling relationship", "topic_name": "Functions of Management", "bloom_level": "analyze", "options": [{"key": "A", "text": "Planning and controlling are independent functions with no connection", "is_correct": false}, {"key": "B", "text": "Controlling comes before planning in the management cycle", "is_correct": false}, {"key": "C", "text": "Planning sets standards and controlling ensures they are achieved — they are inseparable twins", "is_correct": true}, {"key": "D", "text": "Planning replaces the need for controlling in a well-managed organisation", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "They are deeply connected — controlling uses planning''s standards as benchmarks. Remove planning and controlling has nothing to measure against.", "misconception": "Seeing management functions as isolated silos"}, {"option_key": "B", "hint": "The POSDC sequence clearly shows Planning first (P) and Controlling last (C). You must plan before you can control.", "misconception": "Reversing the sequence of management functions"}, {"option_key": "D", "hint": "Even perfect planning needs controlling to verify execution. No plan executes itself perfectly — deviations always occur and need correction.", "misconception": "Thinking good planning eliminates the need for control"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Planning and controlling are independent functions with no connection', false, 0),
    ((SELECT id FROM new_q), 'B', 'Controlling comes before planning in the management cycle', false, 1),
    ((SELECT id FROM new_q), 'C', 'Planning sets standards and controlling ensures they are achieved — they are inseparable twins', true, 2),
    ((SELECT id FROM new_q), 'D', 'Planning replaces the need for controlling in a well-managed organisation', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'They are deeply connected — controlling uses planning''s standards as benchmarks. Remove planning and controlling has nothing to measure against.', 'Seeing management functions as isolated silos'),
    ((SELECT id FROM new_q), 'B', 'The POSDC sequence clearly shows Planning first (P) and Controlling last (C). You must plan before you can control.', 'Reversing the sequence of management functions'),
    ((SELECT id FROM new_q), 'D', 'Even perfect planning needs controlling to verify execution. No plan executes itself perfectly — deviations always occur and need correction.', 'Thinking good planning eliminates the need for control')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-32
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'logical-sequence', 'medium', 'Arrange the following functions of management in their correct sequence:
(I) Controlling
(II) Organising
(III) Directing
(IV) Staffing
(V) Planning', 'B', 'The correct sequence of management functions is: Planning → Organising → Staffing → Directing → Controlling (POSDC). First, objectives are set (Planning). Then, a structure is created (Organising). People are hired (Staffing). They are guided and motivated (Directing). Finally, performance is measured and corrective action is taken (Controlling).', 'active', true, ARRAY['POSDC','sequence','management-functions']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-32", "subtopic": "Sequence of management functions", "topic_name": "Functions of Management", "bloom_level": "remember", "options": [{"key": "A", "text": "V → II → III → IV → I", "is_correct": false}, {"key": "B", "text": "V → II → IV → III → I", "is_correct": true}, {"key": "C", "text": "V → IV → II → III → I", "is_correct": false}, {"key": "D", "text": "II → V → IV → III → I", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "This puts Directing (III) before Staffing (IV). You must hire people (staffing) before you can direct them. You cannot motivate employees who haven''t been recruited yet.", "misconception": "Placing directing before staffing"}, {"option_key": "C", "hint": "This puts Staffing (IV) before Organising (II). You must first create the organisational structure and define roles before hiring people to fill those roles.", "misconception": "Hiring people before creating the organisational structure"}, {"option_key": "D", "hint": "This starts with Organising (II) instead of Planning (V). Planning MUST come first — you cannot organise without knowing what the objectives are.", "misconception": "Skipping planning as the starting point"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'V → II → III → IV → I', false, 0),
    ((SELECT id FROM new_q), 'B', 'V → II → IV → III → I', true, 1),
    ((SELECT id FROM new_q), 'C', 'V → IV → II → III → I', false, 2),
    ((SELECT id FROM new_q), 'D', 'II → V → IV → III → I', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'This puts Directing (III) before Staffing (IV). You must hire people (staffing) before you can direct them. You cannot motivate employees who haven''t been recruited yet.', 'Placing directing before staffing'),
    ((SELECT id FROM new_q), 'C', 'This puts Staffing (IV) before Organising (II). You must first create the organisational structure and define roles before hiring people to fill those roles.', 'Hiring people before creating the organisational structure'),
    ((SELECT id FROM new_q), 'D', 'This starts with Organising (II) instead of Planning (V). Planning MUST come first — you cannot organise without knowing what the objectives are.', 'Skipping planning as the starting point')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-33
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'scenario-based', 'medium', 'At InfoTech Solutions, the HR manager reviews applications, conducts interviews, selects candidates, and places them in appropriate positions. Which function of management is the HR manager primarily performing?', 'C', 'The HR manager is performing the Staffing function. Staffing involves recruitment (attracting candidates), selection (choosing the right ones through interviews and tests), and placement (assigning them to suitable positions). It ensures that the right person is placed in the right job at the right time. This is different from organising (creating structure) or directing (motivating people already hired).', 'active', true, ARRAY['staffing','recruitment','selection','placement']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-33", "subtopic": "Staffing function", "topic_name": "Functions of Management", "bloom_level": "apply", "options": [{"key": "A", "text": "Planning", "is_correct": false}, {"key": "B", "text": "Organising", "is_correct": false}, {"key": "C", "text": "Staffing", "is_correct": true}, {"key": "D", "text": "Controlling", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Planning involves setting objectives and deciding courses of action — not conducting interviews or hiring people.", "misconception": "Thinking any preparatory activity is planning"}, {"option_key": "B", "hint": "Organising creates structure (departments, roles, authority). The HR manager is FILLING positions, not creating them. Filling = staffing.", "misconception": "Confusing creating positions (organising) with filling positions (staffing)"}, {"option_key": "D", "hint": "Controlling involves measuring performance against standards. Hiring and placement come long before performance measurement.", "misconception": "Confusing hiring (staffing) with performance review (controlling)"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Planning', false, 0),
    ((SELECT id FROM new_q), 'B', 'Organising', false, 1),
    ((SELECT id FROM new_q), 'C', 'Staffing', true, 2),
    ((SELECT id FROM new_q), 'D', 'Controlling', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Planning involves setting objectives and deciding courses of action — not conducting interviews or hiring people.', 'Thinking any preparatory activity is planning'),
    ((SELECT id FROM new_q), 'B', 'Organising creates structure (departments, roles, authority). The HR manager is FILLING positions, not creating them. Filling = staffing.', 'Confusing creating positions (organising) with filling positions (staffing)'),
    ((SELECT id FROM new_q), 'D', 'Controlling involves measuring performance against standards. Hiring and placement come long before performance measurement.', 'Confusing hiring (staffing) with performance review (controlling)')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-34
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'scenario-based', 'hard', 'GreenLeaf Organics set a target to sell 50,000 units per month. At the end of the month, actual sales were 38,000 units. The sales manager analysed the reasons — poor dealer network and insufficient advertising — and took corrective steps by appointing more dealers and increasing the ad budget. Which function of management is described here?', 'D', 'This is the Controlling function. The steps involved are: (1) Standards were set (50,000 units target), (2) Actual performance was measured (38,000 units), (3) Deviation was identified (12,000 units short), (4) Causes were analysed (poor dealer network, insufficient advertising), and (5) Corrective action was taken (more dealers, higher ad budget). This is the complete controlling process.', 'active', true, ARRAY['controlling','deviation-analysis','corrective-action']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-34", "subtopic": "Controlling function — complete process", "topic_name": "Functions of Management", "bloom_level": "apply", "options": [{"key": "A", "text": "Planning — because targets were set", "is_correct": false}, {"key": "B", "text": "Organising — because dealers were appointed", "is_correct": false}, {"key": "C", "text": "Directing — because corrective steps involved people", "is_correct": false}, {"key": "D", "text": "Controlling — because performance was measured, deviations identified, and corrective action taken", "is_correct": true}], "elimination_hints": [{"option_key": "A", "hint": "While the target was set during planning, the SCENARIO focuses on what happened AFTER execution — measuring, comparing, and correcting. That is controlling.", "misconception": "Focusing on target-setting while ignoring the measurement and correction described"}, {"option_key": "B", "hint": "Appointing more dealers is a corrective action taken as part of controlling, not the organising function itself. The REASON for appointing dealers was deviation from target.", "misconception": "Confusing corrective action within controlling with the organising function"}, {"option_key": "C", "hint": "Directing involves motivating and leading people DURING work. The scenario describes analysis AFTER work is done and results are measured.", "misconception": "Confusing post-execution correction (controlling) with during-execution guidance (directing)"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Planning — because targets were set', false, 0),
    ((SELECT id FROM new_q), 'B', 'Organising — because dealers were appointed', false, 1),
    ((SELECT id FROM new_q), 'C', 'Directing — because corrective steps involved people', false, 2),
    ((SELECT id FROM new_q), 'D', 'Controlling — because performance was measured, deviations identified, and corrective action taken', true, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'While the target was set during planning, the SCENARIO focuses on what happened AFTER execution — measuring, comparing, and correcting. That is controlling.', 'Focusing on target-setting while ignoring the measurement and correction described'),
    ((SELECT id FROM new_q), 'B', 'Appointing more dealers is a corrective action taken as part of controlling, not the organising function itself. The REASON for appointing dealers was deviation from target.', 'Confusing corrective action within controlling with the organising function'),
    ((SELECT id FROM new_q), 'C', 'Directing involves motivating and leading people DURING work. The scenario describes analysis AFTER work is done and results are measured.', 'Confusing post-execution correction (controlling) with during-execution guidance (directing)')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-35
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'assertion-reasoning', 'medium', 'Assertion (A): Staffing is an important function of management because it ensures the right person is placed in the right job.
Reason (R): Human resources are the most important asset of any organisation and no task can be accomplished without competent people.', 'A', 'Both A and R are true, and R correctly explains A. Staffing''s importance (A) comes directly from the fact that human resources are the most critical asset (R). If people are the most important resource, then getting the RIGHT people (staffing) becomes crucial. Without competent staff, even the best plans and structures fail.', 'active', true, ARRAY['staffing-importance','human-resources','right-person-right-job']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-35", "subtopic": "Importance of staffing", "topic_name": "Functions of Management", "bloom_level": "understand", "options": [{"key": "A", "text": "Both A and R are correct and R is the correct explanation of A", "is_correct": true}, {"key": "B", "text": "Both A and R are correct but R is NOT the correct explanation of A", "is_correct": false}, {"key": "C", "text": "A is correct but R is incorrect", "is_correct": false}, {"key": "D", "text": "A is incorrect but R is correct", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "R directly explains WHY staffing is important — because people are the most critical resource. If people were not important, staffing would not matter. The causal link is direct.", "misconception": "Not connecting human resource importance with staffing''s importance"}, {"option_key": "C", "hint": "R is correct — human resources ARE the most important asset. No machine runs itself; every task requires competent people. This is universally accepted in management.", "misconception": null}, {"option_key": "D", "hint": "A is correct — staffing does ensure the right person in the right job. This is the very definition and purpose of the staffing function.", "misconception": null}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Both A and R are correct and R is the correct explanation of A', true, 0),
    ((SELECT id FROM new_q), 'B', 'Both A and R are correct but R is NOT the correct explanation of A', false, 1),
    ((SELECT id FROM new_q), 'C', 'A is correct but R is incorrect', false, 2),
    ((SELECT id FROM new_q), 'D', 'A is incorrect but R is correct', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'B', 'R directly explains WHY staffing is important — because people are the most critical resource. If people were not important, staffing would not matter. The causal link is direct.', 'Not connecting human resource importance with staffing''s importance'),
    ((SELECT id FROM new_q), 'C', 'R is correct — human resources ARE the most important asset. No machine runs itself; every task requires competent people. This is universally accepted in management.', NULL),
    ((SELECT id FROM new_q), 'D', 'A is correct — staffing does ensure the right person in the right job. This is the very definition and purpose of the staffing function.', NULL)
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-36
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'true-false', 'easy', 'Statement: Controlling is the last function in the management process and it involves comparing actual performance with planned performance.', 'A', 'This statement is TRUE. Controlling is the fifth and final function in the POSDC cycle. It involves: (1) setting standards (from planning), (2) measuring actual performance, (3) comparing actual with planned/standard performance, and (4) taking corrective action if there are deviations. It completes the management cycle and feeds back into planning for the next cycle.', 'active', true, ARRAY['controlling','last-function','comparison']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-36", "subtopic": "Controlling function", "topic_name": "Functions of Management", "bloom_level": "remember", "options": [{"key": "A", "text": "True", "is_correct": true}, {"key": "B", "text": "False", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "In the POSDC sequence (Planning-Organising-Staffing-Directing-Controlling), controlling IS the last function. And comparing actual vs planned performance is its core activity.", "misconception": "Not knowing the POSDC sequence or the definition of controlling"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'True', true, 0),
    ((SELECT id FROM new_q), 'B', 'False', false, 1)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'B', 'In the POSDC sequence (Planning-Organising-Staffing-Directing-Controlling), controlling IS the last function. And comparing actual vs planned performance is its core activity.', 'Not knowing the POSDC sequence or the definition of controlling')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-37
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'true-false', 'easy', 'Statement: Directing function is performed at the top level only because only senior managers can motivate and lead employees.', 'B', 'This statement is FALSE. Directing is performed at ALL levels of management, not just the top. Every manager — from CEO to supervisor — must supervise, motivate, lead, and communicate with their subordinates. In fact, the directing function is MOST prominent at the operational/supervisory level where managers interact directly with workers daily.', 'active', true, ARRAY['directing','all-levels','supervision']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-37", "subtopic": "Directing at all levels", "topic_name": "Functions of Management", "bloom_level": "understand", "options": [{"key": "A", "text": "True", "is_correct": false}, {"key": "B", "text": "False", "is_correct": true}], "elimination_hints": [{"option_key": "A", "hint": "A foreman motivates workers. A department head motivates team leads. The CEO motivates department heads. Directing happens at EVERY level, not just the top.", "misconception": "Restricting directing to top-level management only"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'True', false, 0),
    ((SELECT id FROM new_q), 'B', 'False', true, 1)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'A foreman motivates workers. A department head motivates team leads. The CEO motivates department heads. Directing happens at EVERY level, not just the top.', 'Restricting directing to top-level management only')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-38
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'fill-in-blanks', 'medium', 'The management function that bridges the gap between ''where we are'' and ''where we want to be'' is __________.', 'A', 'Planning bridges the gap between the current position (''where we are'') and the desired future position (''where we want to be''). It involves setting objectives (the destination) and determining the best course of action (the path) to reach there. Without planning, an organisation would drift without direction.', 'active', true, ARRAY['planning','gap-bridging','objectives']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-38", "subtopic": "Planning as gap-bridging function", "topic_name": "Functions of Management", "bloom_level": "understand", "options": [{"key": "A", "text": "Planning", "is_correct": true}, {"key": "B", "text": "Controlling", "is_correct": false}, {"key": "C", "text": "Organising", "is_correct": false}, {"key": "D", "text": "Staffing", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "Controlling checks whether you REACHED where you wanted to be. Planning is what TAKES you there. Controlling is the rear-view mirror; planning is the GPS.", "misconception": "Confusing checking progress (controlling) with setting direction (planning)"}, {"option_key": "C", "hint": "Organising creates structure to implement the plan. It does not set the destination — planning does.", "misconception": "Confusing structure creation with direction setting"}, {"option_key": "D", "hint": "Staffing provides the people. But the roadmap of where to go is provided by planning.", "misconception": "Confusing resource provision with direction setting"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Planning', true, 0),
    ((SELECT id FROM new_q), 'B', 'Controlling', false, 1),
    ((SELECT id FROM new_q), 'C', 'Organising', false, 2),
    ((SELECT id FROM new_q), 'D', 'Staffing', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'B', 'Controlling checks whether you REACHED where you wanted to be. Planning is what TAKES you there. Controlling is the rear-view mirror; planning is the GPS.', 'Confusing checking progress (controlling) with setting direction (planning)'),
    ((SELECT id FROM new_q), 'C', 'Organising creates structure to implement the plan. It does not set the destination — planning does.', 'Confusing structure creation with direction setting'),
    ((SELECT id FROM new_q), 'D', 'Staffing provides the people. But the roadmap of where to go is provided by planning.', 'Confusing resource provision with direction setting')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-39
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'diagram-based', 'medium', 'Study the circular diagram showing the management functions cycle. If Function X involves ''measuring actual performance and comparing it with standards'', and Function Y involves ''setting objectives and deciding a course of action'', what is the correct relationship shown in the diagram?', 'D', 'Function X is Controlling (measuring performance vs standards) and Function Y is Planning (setting objectives). The diagram shows them connected by a feedback loop — controlling sends feedback to planning, which uses it to revise or create new plans. This is why planning and controlling are called ''inseparable twins'' — controlling completes the cycle and feeds back into planning.', 'active', true, ARRAY['POSDC-cycle','feedback-loop','planning-controlling-twins']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-39", "subtopic": "POSDC cycle and feedback", "topic_name": "Functions of Management", "bloom_level": "analyze", "options": [{"key": "A", "text": "X feeds into Y through a feedback loop, making management a one-time process", "is_correct": false}, {"key": "B", "text": "X and Y are performed simultaneously, not sequentially", "is_correct": false}, {"key": "C", "text": "Y (Planning) is performed only once; X (Controlling) repeats every cycle", "is_correct": false}, {"key": "D", "text": "X (Controlling) sends feedback to Y (Planning), making management a continuous cycle", "is_correct": true}], "elimination_hints": [{"option_key": "A", "hint": "The feedback loop makes management CONTINUOUS, not one-time. After controlling, new plans are made — the cycle repeats endlessly.", "misconception": "Thinking feedback terminates the process instead of restarting it"}, {"option_key": "B", "hint": "The CIRCULAR arrows show sequential flow (P→O→S→D→C→P). They are performed one after another, not simultaneously.", "misconception": "Ignoring the sequential nature shown by directional arrows"}, {"option_key": "C", "hint": "The circular diagram shows Planning also repeats — after controlling provides feedback, planning starts again with revised objectives. All functions repeat.", "misconception": "Thinking only controlling repeats"}], "image_uri": "diagrams/cuet-bst-nature-mgmt-39.png", "image_alt": "Circular diagram with 5 boxes connected by arrows in a cycle: Planning (Y) → Organising → Staffing → Directing → Controlling (X) → back to Planning (Y). The arrow from Controlling back to Planning is labelled ''Feedback Loop''. Function X (Controlling) and Function Y (Planning) are highlighted."}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'X feeds into Y through a feedback loop, making management a one-time process', false, 0),
    ((SELECT id FROM new_q), 'B', 'X and Y are performed simultaneously, not sequentially', false, 1),
    ((SELECT id FROM new_q), 'C', 'Y (Planning) is performed only once; X (Controlling) repeats every cycle', false, 2),
    ((SELECT id FROM new_q), 'D', 'X (Controlling) sends feedback to Y (Planning), making management a continuous cycle', true, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'The feedback loop makes management CONTINUOUS, not one-time. After controlling, new plans are made — the cycle repeats endlessly.', 'Thinking feedback terminates the process instead of restarting it'),
    ((SELECT id FROM new_q), 'B', 'The CIRCULAR arrows show sequential flow (P→O→S→D→C→P). They are performed one after another, not simultaneously.', 'Ignoring the sequential nature shown by directional arrows'),
    ((SELECT id FROM new_q), 'C', 'The circular diagram shows Planning also repeats — after controlling provides feedback, planning starts again with revised objectives. All functions repeat.', 'Thinking only controlling repeats')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-40
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'match-the-following', 'hard', 'Match the management activities in Column I with the correct function in Column II:

Column I:
(i) Setting sales target of Rs. 50 crore for next year
(ii) Creating a separate digital marketing department
(iii) Conducting interviews to hire a new CFO
(iv) Analysing why production fell 20% below target and taking corrective steps

Column II:
(P) Staffing
(Q) Organising
(R) Planning
(S) Controlling', 'C', '(i) Setting sales target = Planning (R) — it involves setting objectives and future course of action. (ii) Creating a new department = Organising (Q) — it involves creating structure and departments. (iii) Conducting interviews to hire = Staffing (P) — it involves recruitment and selection. (iv) Analysing deviations and correcting = Controlling (S) — it involves measuring, comparing, and correcting. So: (i)→R, (ii)→Q, (iii)→P, (iv)→S.', 'active', true, ARRAY['POSDC-identification','practical-activities','matching']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-40", "subtopic": "Identifying functions from activities", "topic_name": "Functions of Management", "bloom_level": "apply", "options": [{"key": "A", "text": "(i)→R, (ii)→P, (iii)→Q, (iv)→S", "is_correct": false}, {"key": "B", "text": "(i)→S, (ii)→Q, (iii)→P, (iv)→R", "is_correct": false}, {"key": "C", "text": "(i)→R, (ii)→Q, (iii)→P, (iv)→S", "is_correct": true}, {"key": "D", "text": "(i)→R, (ii)→Q, (iii)→S, (iv)→P", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Creating a department (ii) is Organising (Q), not Staffing (P). Hiring for a role (iii) is Staffing (P), not Organising (Q). These two are swapped.", "misconception": "Confusing creating structure (organising) with filling positions (staffing)"}, {"option_key": "B", "hint": "Setting a sales TARGET (i) is Planning (R), not Controlling (S). Controlling checks if targets are MET; planning SETS the targets.", "misconception": "Confusing target-setting (planning) with target-monitoring (controlling)"}, {"option_key": "D", "hint": "Conducting interviews (iii) is Staffing (P), not Controlling (S). Analysing deviations (iv) is Controlling (S), not Staffing (P). These two are swapped.", "misconception": "Swapping staffing and controlling activities"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', '(i)→R, (ii)→P, (iii)→Q, (iv)→S', false, 0),
    ((SELECT id FROM new_q), 'B', '(i)→S, (ii)→Q, (iii)→P, (iv)→R', false, 1),
    ((SELECT id FROM new_q), 'C', '(i)→R, (ii)→Q, (iii)→P, (iv)→S', true, 2),
    ((SELECT id FROM new_q), 'D', '(i)→R, (ii)→Q, (iii)→S, (iv)→P', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Creating a department (ii) is Organising (Q), not Staffing (P). Hiring for a role (iii) is Staffing (P), not Organising (Q). These two are swapped.', 'Confusing creating structure (organising) with filling positions (staffing)'),
    ((SELECT id FROM new_q), 'B', 'Setting a sales TARGET (i) is Planning (R), not Controlling (S). Controlling checks if targets are MET; planning SETS the targets.', 'Confusing target-setting (planning) with target-monitoring (controlling)'),
    ((SELECT id FROM new_q), 'D', 'Conducting interviews (iii) is Staffing (P), not Controlling (S). Analysing deviations (iv) is Controlling (S), not Staffing (P). These two are swapped.', 'Swapping staffing and controlling activities')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-41
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'mcq', 'easy', 'Coordination is:', 'C', 'Coordination is the essence of management. It is NOT a separate function of management (like Planning, Organising, Staffing, Directing, Controlling). Instead, it is the force that binds all functions together. Every function of management involves coordination — planning requires coordinating objectives, organising requires coordinating resources, directing requires coordinating people, and controlling requires coordinating feedback.', 'active', true, ARRAY['coordination','essence-of-management','not-a-function']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-41", "subtopic": "Coordination as essence of management", "topic_name": "Coordination", "bloom_level": "remember", "options": [{"key": "A", "text": "A separate function of management like planning or organising", "is_correct": false}, {"key": "B", "text": "Required only at the top level of management", "is_correct": false}, {"key": "C", "text": "The essence of management that integrates all functions", "is_correct": true}, {"key": "D", "text": "The same as controlling", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "The five functions are P-O-S-D-C. Coordination is NOT listed as one of them. It runs THROUGH all five functions as a binding force.", "misconception": "Treating coordination as a sixth management function"}, {"option_key": "B", "hint": "Coordination is needed at ALL levels — top, middle, and operational. A supervisor coordinates workers just as a CEO coordinates departments.", "misconception": "Restricting coordination to only top management"}, {"option_key": "D", "hint": "Controlling measures performance and corrects deviations. Coordination synchronises efforts. They are distinct concepts — coordination binds, controlling checks.", "misconception": "Equating coordination with controlling"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'A separate function of management like planning or organising', false, 0),
    ((SELECT id FROM new_q), 'B', 'Required only at the top level of management', false, 1),
    ((SELECT id FROM new_q), 'C', 'The essence of management that integrates all functions', true, 2),
    ((SELECT id FROM new_q), 'D', 'The same as controlling', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'The five functions are P-O-S-D-C. Coordination is NOT listed as one of them. It runs THROUGH all five functions as a binding force.', 'Treating coordination as a sixth management function'),
    ((SELECT id FROM new_q), 'B', 'Coordination is needed at ALL levels — top, middle, and operational. A supervisor coordinates workers just as a CEO coordinates departments.', 'Restricting coordination to only top management'),
    ((SELECT id FROM new_q), 'D', 'Controlling measures performance and corrects deviations. Coordination synchronises efforts. They are distinct concepts — coordination binds, controlling checks.', 'Equating coordination with controlling')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-42
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'mcq', 'medium', 'Which of the following statements about coordination is INCORRECT?', 'D', 'Coordination is NOT a one-time activity performed only at the start of a project. It is a continuous process that begins with planning and continues throughout the life of the organisation. As activities, people, and conditions change, managers must continuously coordinate to ensure harmony and unity of action.', 'active', true, ARRAY['coordination-features','continuous-process']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-42", "subtopic": "Features of coordination", "topic_name": "Coordination", "bloom_level": "understand", "options": [{"key": "A", "text": "Coordination integrates group efforts", "is_correct": false}, {"key": "B", "text": "Coordination ensures unity of action", "is_correct": false}, {"key": "C", "text": "Coordination is the responsibility of all managers", "is_correct": false}, {"key": "D", "text": "Coordination is a one-time activity performed only at the start of a project", "is_correct": true}], "elimination_hints": [{"option_key": "A", "hint": "This is correct — coordination''s primary purpose IS to integrate group efforts so that different departments and people work in harmony.", "misconception": null}, {"option_key": "B", "hint": "This is correct — unity of action means everyone moves in the same direction. Coordination ensures that different activities do not work at cross-purposes.", "misconception": null}, {"option_key": "C", "hint": "This is correct — coordination is not the job of just one person. Every manager at every level coordinates within their scope of authority.", "misconception": null}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Coordination integrates group efforts', false, 0),
    ((SELECT id FROM new_q), 'B', 'Coordination ensures unity of action', false, 1),
    ((SELECT id FROM new_q), 'C', 'Coordination is the responsibility of all managers', false, 2),
    ((SELECT id FROM new_q), 'D', 'Coordination is a one-time activity performed only at the start of a project', true, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'This is correct — coordination''s primary purpose IS to integrate group efforts so that different departments and people work in harmony.', NULL),
    ((SELECT id FROM new_q), 'B', 'This is correct — unity of action means everyone moves in the same direction. Coordination ensures that different activities do not work at cross-purposes.', NULL),
    ((SELECT id FROM new_q), 'C', 'This is correct — coordination is not the job of just one person. Every manager at every level coordinates within their scope of authority.', NULL)
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-43
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'scenario-based', 'medium', 'At TechVista Ltd., the production department plans to manufacture 10,000 units, but the sales department has committed to deliver 15,000 units to customers. The finance department has budgeted for only 8,000 units. This situation indicates a lack of:', 'B', 'The three departments — production (10,000), sales (15,000), and finance (8,000) — have conflicting targets with no alignment. Production cannot meet sales commitments; finance cannot fund even production''s plan. This classic misalignment indicates a lack of COORDINATION. Coordination would have ensured all departments worked with the same targets and synchronized their plans before committing.', 'active', true, ARRAY['coordination-absence','departmental-conflict','unity-of-action']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-43", "subtopic": "Need for coordination", "topic_name": "Coordination", "bloom_level": "apply", "options": [{"key": "A", "text": "Controlling", "is_correct": false}, {"key": "B", "text": "Coordination", "is_correct": true}, {"key": "C", "text": "Staffing", "is_correct": false}, {"key": "D", "text": "Organising", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Controlling would detect that targets were NOT met after execution. But the problem here is BEFORE execution — departments have conflicting plans. That is a coordination failure.", "misconception": "Confusing pre-execution alignment (coordination) with post-execution checking (controlling)"}, {"option_key": "C", "hint": "Staffing is about hiring the right people. The problem here is not a people shortage — it is conflicting departmental plans.", "misconception": "Attributing every organisational problem to staffing"}, {"option_key": "D", "hint": "Organising creates structure (departments, roles). The departments already exist; the issue is that their PLANS are not aligned with each other.", "misconception": "Confusing structural issues (organising) with alignment issues (coordination)"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Controlling', false, 0),
    ((SELECT id FROM new_q), 'B', 'Coordination', true, 1),
    ((SELECT id FROM new_q), 'C', 'Staffing', false, 2),
    ((SELECT id FROM new_q), 'D', 'Organising', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Controlling would detect that targets were NOT met after execution. But the problem here is BEFORE execution — departments have conflicting plans. That is a coordination failure.', 'Confusing pre-execution alignment (coordination) with post-execution checking (controlling)'),
    ((SELECT id FROM new_q), 'C', 'Staffing is about hiring the right people. The problem here is not a people shortage — it is conflicting departmental plans.', 'Attributing every organisational problem to staffing'),
    ((SELECT id FROM new_q), 'D', 'Organising creates structure (departments, roles). The departments already exist; the issue is that their PLANS are not aligned with each other.', 'Confusing structural issues (organising) with alignment issues (coordination)')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-44
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'assertion-reasoning', 'hard', 'Assertion (A): Coordination is called the essence of management.
Reason (R): Coordination is implicit in all management functions and is not a separate function.', 'A', 'Both A and R are correct, and R correctly explains A. Coordination is called the ''essence'' (A) BECAUSE it is woven into every management function rather than being a standalone function (R). When a manager plans, they coordinate objectives. When they organise, they coordinate resources. When they direct, they coordinate people. When they control, they coordinate feedback. Since coordination permeates everything, it IS the essence.', 'active', true, ARRAY['coordination-essence','implicit-function','pervasive']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-44", "subtopic": "Coordination as essence — why", "topic_name": "Coordination", "bloom_level": "analyze", "options": [{"key": "A", "text": "Both A and R are correct and R is the correct explanation of A", "is_correct": true}, {"key": "B", "text": "Both A and R are correct but R is NOT the correct explanation of A", "is_correct": false}, {"key": "C", "text": "A is correct but R is incorrect", "is_correct": false}, {"key": "D", "text": "A is incorrect but R is correct", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "R DIRECTLY explains why coordination is the essence — because it is implicit in all functions. Being implicit (present everywhere) is exactly what makes something the ''essence''. The causal link is clear.", "misconception": "Not connecting ''implicit in all functions'' with ''essence''"}, {"option_key": "C", "hint": "R is correct — coordination is indeed implicit and not a separate function. The NCERT textbook explicitly states this.", "misconception": null}, {"option_key": "D", "hint": "A is correct — coordination IS called the essence of management. This is one of the most quoted statements in the chapter.", "misconception": null}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Both A and R are correct and R is the correct explanation of A', true, 0),
    ((SELECT id FROM new_q), 'B', 'Both A and R are correct but R is NOT the correct explanation of A', false, 1),
    ((SELECT id FROM new_q), 'C', 'A is correct but R is incorrect', false, 2),
    ((SELECT id FROM new_q), 'D', 'A is incorrect but R is correct', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'B', 'R DIRECTLY explains why coordination is the essence — because it is implicit in all functions. Being implicit (present everywhere) is exactly what makes something the ''essence''. The causal link is clear.', 'Not connecting ''implicit in all functions'' with ''essence'''),
    ((SELECT id FROM new_q), 'C', 'R is correct — coordination is indeed implicit and not a separate function. The NCERT textbook explicitly states this.', NULL),
    ((SELECT id FROM new_q), 'D', 'A is correct — coordination IS called the essence of management. This is one of the most quoted statements in the chapter.', NULL)
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-45
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'mcq', 'medium', 'Coordination is needed in an organisation because:', 'A', 'Coordination is needed because different departments and individuals in an organisation tend to pursue their own departmental goals, which may conflict with overall organisational goals. For example, the marketing department may want higher advertising spend while finance wants cost reduction. Coordination aligns these diverse interests towards a common organisational purpose.', 'active', true, ARRAY['need-for-coordination','departmental-goals','common-purpose']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-45", "subtopic": "Need for coordination", "topic_name": "Coordination", "bloom_level": "understand", "options": [{"key": "A", "text": "Different departments may pursue conflicting goals, and coordination aligns them towards a common purpose", "is_correct": true}, {"key": "B", "text": "Workers are inherently lazy and need coordination to be forced to work", "is_correct": false}, {"key": "C", "text": "Coordination reduces the number of employees needed in an organisation", "is_correct": false}, {"key": "D", "text": "Only large organisations need coordination; small ones do not", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "Coordination is not about forcing people to work — that is supervision/direction. Coordination is about ALIGNING efforts so different groups move in the same direction.", "misconception": "Confusing coordination (alignment) with supervision (oversight)"}, {"option_key": "C", "hint": "Coordination does not reduce headcount. It ensures that existing people work in harmony. Efficiency may improve, but the purpose is alignment, not staff reduction.", "misconception": "Thinking coordination is a cost-cutting measure"}, {"option_key": "D", "hint": "Even a small organisation with 5 people needs coordination among them. The DEGREE of coordination needed increases with size, but it is needed everywhere.", "misconception": "Thinking coordination is only for large organisations"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Different departments may pursue conflicting goals, and coordination aligns them towards a common purpose', true, 0),
    ((SELECT id FROM new_q), 'B', 'Workers are inherently lazy and need coordination to be forced to work', false, 1),
    ((SELECT id FROM new_q), 'C', 'Coordination reduces the number of employees needed in an organisation', false, 2),
    ((SELECT id FROM new_q), 'D', 'Only large organisations need coordination; small ones do not', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'B', 'Coordination is not about forcing people to work — that is supervision/direction. Coordination is about ALIGNING efforts so different groups move in the same direction.', 'Confusing coordination (alignment) with supervision (oversight)'),
    ((SELECT id FROM new_q), 'C', 'Coordination does not reduce headcount. It ensures that existing people work in harmony. Efficiency may improve, but the purpose is alignment, not staff reduction.', 'Thinking coordination is a cost-cutting measure'),
    ((SELECT id FROM new_q), 'D', 'Even a small organisation with 5 people needs coordination among them. The DEGREE of coordination needed increases with size, but it is needed everywhere.', 'Thinking coordination is only for large organisations')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-46
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'true-false', 'easy', 'Statement: Coordination is a deliberate effort by managers to synchronise the activities of different departments to achieve organisational objectives.', 'A', 'This statement is TRUE. Coordination is a deliberate (intentional, conscious) effort — it does not happen automatically. Managers must actively work to synchronise activities of various departments, groups, and individuals so that they all work towards common organisational objectives without conflicting with each other.', 'active', true, ARRAY['coordination-deliberate','synchronisation','conscious-effort']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-46", "subtopic": "Nature of coordination", "topic_name": "Coordination", "bloom_level": "remember", "options": [{"key": "A", "text": "True", "is_correct": true}, {"key": "B", "text": "False", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "Coordination does not happen on its own. Without deliberate managerial effort, departments naturally drift towards their own goals. Active synchronisation is required.", "misconception": "Thinking coordination happens automatically without managerial intervention"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'True', true, 0),
    ((SELECT id FROM new_q), 'B', 'False', false, 1)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'B', 'Coordination does not happen on its own. Without deliberate managerial effort, departments naturally drift towards their own goals. Active synchronisation is required.', 'Thinking coordination happens automatically without managerial intervention')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-47
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'true-false', 'medium', 'Statement: Coordination is needed only between different departments and not within a single department.', 'B', 'This statement is FALSE. Coordination is needed BOTH between departments (inter-departmental) AND within a single department (intra-departmental). Within a department, different teams, shifts, or individuals must also coordinate their work. For example, within the production department, the assembly team and quality control team must coordinate their timings.', 'active', true, ARRAY['inter-departmental','intra-departmental','coordination-scope']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-47", "subtopic": "Scope of coordination", "topic_name": "Coordination", "bloom_level": "understand", "options": [{"key": "A", "text": "True", "is_correct": false}, {"key": "B", "text": "False", "is_correct": true}], "elimination_hints": [{"option_key": "A", "hint": "Even within one department, different people do different tasks. A production department has procurement, assembly, quality check — all needing internal coordination.", "misconception": "Restricting coordination to only inter-departmental level"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'True', false, 0),
    ((SELECT id FROM new_q), 'B', 'False', true, 1)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Even within one department, different people do different tasks. A production department has procurement, assembly, quality check — all needing internal coordination.', 'Restricting coordination to only inter-departmental level')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-48
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'scenario-based', 'hard', 'PureHealth Foods has four departments: Procurement, Manufacturing, Marketing, and Finance. The Procurement head buys raw materials worth Rs. 2 crore without informing Finance. Manufacturing changes the product formula without telling Marketing. Marketing launches a ''Buy 1 Get 1'' offer without checking with Finance. Which feature of coordination is MOST lacking here?', 'A', 'The key problem is that departments are acting independently without informing or consulting each other. This shows a lack of ''integration of group efforts'' — the most fundamental feature of coordination. Each department is working in isolation (like silos), leading to chaos. Coordination integrates group efforts by ensuring every department''s actions are aligned with and communicated to others.', 'active', true, ARRAY['integration-of-efforts','departmental-silos','communication-gap']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-48", "subtopic": "Features of coordination — integration", "topic_name": "Coordination", "bloom_level": "analyze", "options": [{"key": "A", "text": "Integration of group efforts — departments are working in silos without alignment", "is_correct": true}, {"key": "B", "text": "Unity of command — employees have too many bosses", "is_correct": false}, {"key": "C", "text": "Span of control — managers are supervising too many people", "is_correct": false}, {"key": "D", "text": "Division of work — tasks are not properly divided", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "Unity of command means one boss per employee (Fayol''s principle). The scenario does not mention employees having multiple bosses — it shows departments not communicating.", "misconception": "Confusing inter-departmental communication failure with unity of command"}, {"option_key": "C", "hint": "Span of control is about how many subordinates a manager can handle. The scenario is about departments not coordinating, not about manager overload.", "misconception": "Mixing up span of control with departmental coordination"}, {"option_key": "D", "hint": "Tasks ARE divided into departments. The problem is not division — it is that the divided departments are not coordinating their actions.", "misconception": "Confusing task division (which exists) with lack of coordination between divided tasks"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Integration of group efforts — departments are working in silos without alignment', true, 0),
    ((SELECT id FROM new_q), 'B', 'Unity of command — employees have too many bosses', false, 1),
    ((SELECT id FROM new_q), 'C', 'Span of control — managers are supervising too many people', false, 2),
    ((SELECT id FROM new_q), 'D', 'Division of work — tasks are not properly divided', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'B', 'Unity of command means one boss per employee (Fayol''s principle). The scenario does not mention employees having multiple bosses — it shows departments not communicating.', 'Confusing inter-departmental communication failure with unity of command'),
    ((SELECT id FROM new_q), 'C', 'Span of control is about how many subordinates a manager can handle. The scenario is about departments not coordinating, not about manager overload.', 'Mixing up span of control with departmental coordination'),
    ((SELECT id FROM new_q), 'D', 'Tasks ARE divided into departments. The problem is not division — it is that the divided departments are not coordinating their actions.', 'Confusing task division (which exists) with lack of coordination between divided tasks')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-49
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'diagram-based', 'medium', 'Study the diagram showing how coordination connects the five management functions. According to the diagram, coordination is best described as:', 'B', 'The diagram shows coordination spanning across ALL five functions (Planning through Controlling) with dotted lines penetrating into each. This visually represents that coordination is not a separate function standing alone — it permeates and connects all functions. It is the thread that weaves through every managerial activity, hence called the ''essence of management''.', 'active', true, ARRAY['coordination-visual','pervasive','essence-diagram']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-49", "subtopic": "Coordination permeating all functions", "topic_name": "Coordination", "bloom_level": "understand", "options": [{"key": "A", "text": "A sixth function that comes after controlling", "is_correct": false}, {"key": "B", "text": "A thread that runs through all five functions, binding them together", "is_correct": true}, {"key": "C", "text": "A substitute for planning and controlling", "is_correct": false}, {"key": "D", "text": "An optional activity only needed when conflicts arise", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "The diagram shows coordination BELOW all five boxes spanning across them — not as a sixth box after controlling. It is not sequential; it is parallel.", "misconception": "Treating coordination as another sequential function"}, {"option_key": "C", "hint": "The diagram shows coordination connecting TO planning and controlling, not replacing them. All five functions remain; coordination binds them.", "misconception": "Thinking coordination replaces other functions"}, {"option_key": "D", "hint": "The diagram shows coordination spanning ALL functions at ALL times — not just during conflicts. It is a continuous binding force, not a fire-fighting tool.", "misconception": "Viewing coordination as reactive rather than proactive and continuous"}], "image_uri": "diagrams/cuet-bst-nature-mgmt-49.png", "image_alt": "Five boxes in a horizontal row: Planning, Organising, Staffing, Directing, Controlling. Below them, a large horizontal double-headed arrow labelled ''COORDINATION — The Essence of Management'' spans across all five boxes, connecting them. Dotted lines go from the coordination arrow up into each of the five boxes, showing coordination permeating each function."}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'A sixth function that comes after controlling', false, 0),
    ((SELECT id FROM new_q), 'B', 'A thread that runs through all five functions, binding them together', true, 1),
    ((SELECT id FROM new_q), 'C', 'A substitute for planning and controlling', false, 2),
    ((SELECT id FROM new_q), 'D', 'An optional activity only needed when conflicts arise', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'The diagram shows coordination BELOW all five boxes spanning across them — not as a sixth box after controlling. It is not sequential; it is parallel.', 'Treating coordination as another sequential function'),
    ((SELECT id FROM new_q), 'C', 'The diagram shows coordination connecting TO planning and controlling, not replacing them. All five functions remain; coordination binds them.', 'Thinking coordination replaces other functions'),
    ((SELECT id FROM new_q), 'D', 'The diagram shows coordination spanning ALL functions at ALL times — not just during conflicts. It is a continuous binding force, not a fire-fighting tool.', 'Viewing coordination as reactive rather than proactive and continuous')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-50
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'fill-in-blanks', 'easy', 'Coordination is not a separate function of management; it is the __________ of management.', 'A', 'Coordination is the ESSENCE of management. The word ''essence'' means the intrinsic, fundamental nature of something. Coordination is called the essence because it is inherent in every management function and activity. Without coordination, management cannot achieve its purpose of getting things done through people effectively.', 'active', true, ARRAY['coordination','essence','fundamental-nature']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-50", "subtopic": "Coordination terminology", "topic_name": "Coordination", "bloom_level": "remember", "options": [{"key": "A", "text": "Essence", "is_correct": true}, {"key": "B", "text": "Objective", "is_correct": false}, {"key": "C", "text": "Principle", "is_correct": false}, {"key": "D", "text": "Function", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "Objectives are goals management aims to achieve. Coordination is HOW functions are integrated — it describes the nature of management, not its goal.", "misconception": "Confusing the purpose of management with its nature"}, {"option_key": "C", "hint": "Principles are guidelines for action (like Fayol''s 14 principles). Coordination is not a guideline — it is the fundamental binding force.", "misconception": "Confusing principles (guidelines) with essence (fundamental nature)"}, {"option_key": "D", "hint": "The question itself says coordination is NOT a separate function. ''Function'' directly contradicts the given statement.", "misconception": "Not reading the question carefully"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Essence', true, 0),
    ((SELECT id FROM new_q), 'B', 'Objective', false, 1),
    ((SELECT id FROM new_q), 'C', 'Principle', false, 2),
    ((SELECT id FROM new_q), 'D', 'Function', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'B', 'Objectives are goals management aims to achieve. Coordination is HOW functions are integrated — it describes the nature of management, not its goal.', 'Confusing the purpose of management with its nature'),
    ((SELECT id FROM new_q), 'C', 'Principles are guidelines for action (like Fayol''s 14 principles). Coordination is not a guideline — it is the fundamental binding force.', 'Confusing principles (guidelines) with essence (fundamental nature)'),
    ((SELECT id FROM new_q), 'D', 'The question itself says coordination is NOT a separate function. ''Function'' directly contradicts the given statement.', 'Not reading the question carefully')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-51
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'mcq', 'easy', 'Management is considered:', 'C', 'According to modern management thought, management is considered BOTH an art and a science. It is a science because it has a systematic body of knowledge with principles that can be studied and applied. It is an art because applying these principles requires skill, creativity, judgement, and practice — which differ from manager to manager. No single option (only art / only science) is complete.', 'active', true, ARRAY['management-nature','art-and-science','dual-nature']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-51", "subtopic": "Management as both art and science", "topic_name": "Management — Art, Science, or Profession", "bloom_level": "remember", "options": [{"key": "A", "text": "Only a science because it has well-defined principles", "is_correct": false}, {"key": "B", "text": "Only an art because it depends on personal skill", "is_correct": false}, {"key": "C", "text": "Both an art and a science", "is_correct": true}, {"key": "D", "text": "Neither an art nor a science", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Management has principles, but they are not as exact as pure science (physics, chemistry). Results vary based on the manager''s skill. Hence it is not ONLY science.", "misconception": "Ignoring the creative, personal-skill aspect of management"}, {"option_key": "B", "hint": "Management does require personal skill, but it also has a systematic body of knowledge that can be studied. Hence it is not ONLY art.", "misconception": "Ignoring the systematic knowledge base of management"}, {"option_key": "D", "hint": "Management clearly has characteristics of both art (creativity, practice) and science (systematic knowledge, cause-effect). It cannot be ''neither''.", "misconception": "Denying both established characteristics of management"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Only a science because it has well-defined principles', false, 0),
    ((SELECT id FROM new_q), 'B', 'Only an art because it depends on personal skill', false, 1),
    ((SELECT id FROM new_q), 'C', 'Both an art and a science', true, 2),
    ((SELECT id FROM new_q), 'D', 'Neither an art nor a science', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Management has principles, but they are not as exact as pure science (physics, chemistry). Results vary based on the manager''s skill. Hence it is not ONLY science.', 'Ignoring the creative, personal-skill aspect of management'),
    ((SELECT id FROM new_q), 'B', 'Management does require personal skill, but it also has a systematic body of knowledge that can be studied. Hence it is not ONLY art.', 'Ignoring the systematic knowledge base of management'),
    ((SELECT id FROM new_q), 'D', 'Management clearly has characteristics of both art (creativity, practice) and science (systematic knowledge, cause-effect). It cannot be ''neither''.', 'Denying both established characteristics of management')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-52
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'mcq', 'medium', 'Management is called an ''inexact science'' because:', 'B', 'Management is called an inexact (or soft/social) science because it deals with human beings whose behaviour is unpredictable. Unlike exact sciences (physics, chemistry) where results can be precisely predicted, management principles cannot guarantee the same results every time because people react differently to the same situation. Two managers using the same principles may get different results.', 'active', true, ARRAY['inexact-science','human-behaviour','unpredictability']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-52", "subtopic": "Management as inexact science", "topic_name": "Management — Art, Science, or Profession", "bloom_level": "understand", "options": [{"key": "A", "text": "It has no established principles or body of knowledge", "is_correct": false}, {"key": "B", "text": "It deals with human beings whose behaviour cannot be predicted with certainty", "is_correct": true}, {"key": "C", "text": "Its principles keep changing every year", "is_correct": false}, {"key": "D", "text": "Only experienced managers can understand it", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Management DOES have established principles (Taylor''s, Fayol''s) and a body of knowledge. Being ''inexact'' does not mean ''no knowledge'' — it means results are not perfectly predictable.", "misconception": "Equating ''inexact'' with ''no knowledge base''"}, {"option_key": "C", "hint": "Core management principles (unity of command, division of work) have remained stable for over a century. Being ''inexact'' refers to unpredictable human application, not changing principles.", "misconception": "Confusing inexactness with instability of principles"}, {"option_key": "D", "hint": "Management can be studied by anyone. Being ''inexact'' means outcomes vary due to human factors, not that it requires special innate ability.", "misconception": "Confusing accessibility of knowledge with predictability of outcomes"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'It has no established principles or body of knowledge', false, 0),
    ((SELECT id FROM new_q), 'B', 'It deals with human beings whose behaviour cannot be predicted with certainty', true, 1),
    ((SELECT id FROM new_q), 'C', 'Its principles keep changing every year', false, 2),
    ((SELECT id FROM new_q), 'D', 'Only experienced managers can understand it', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Management DOES have established principles (Taylor''s, Fayol''s) and a body of knowledge. Being ''inexact'' does not mean ''no knowledge'' — it means results are not perfectly predictable.', 'Equating ''inexact'' with ''no knowledge base'''),
    ((SELECT id FROM new_q), 'C', 'Core management principles (unity of command, division of work) have remained stable for over a century. Being ''inexact'' refers to unpredictable human application, not changing principles.', 'Confusing inexactness with instability of principles'),
    ((SELECT id FROM new_q), 'D', 'Management can be studied by anyone. Being ''inexact'' means outcomes vary due to human factors, not that it requires special innate ability.', 'Confusing accessibility of knowledge with predictability of outcomes')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-53
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'mcq', 'hard', 'Which of the following is NOT a feature that qualifies management as a profession?', 'D', 'A well-defined body of knowledge, professional associations (like AIMA), and ethical codes DO exist in management. However, management does NOT have restricted entry — anyone can become a manager without a mandatory specific degree or licence. Doctors need an MBBS, lawyers need a law degree, but a person without an MBA can still become a CEO. This lack of restricted entry means management is NOT yet a full profession.', 'active', true, ARRAY['profession-features','restricted-entry','not-full-profession']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-53", "subtopic": "Management as a profession — limitations", "topic_name": "Management — Art, Science, or Profession", "bloom_level": "analyze", "options": [{"key": "A", "text": "Well-defined body of knowledge", "is_correct": false}, {"key": "B", "text": "Professional association (like AIMA)", "is_correct": false}, {"key": "C", "text": "Ethical code of conduct", "is_correct": false}, {"key": "D", "text": "Restricted entry through a mandatory professional degree or licence", "is_correct": true}], "elimination_hints": [{"option_key": "A", "hint": "Management DOES have a well-defined body of knowledge — textbooks, theories (Taylor, Fayol, Drucker), and academic courses exist. This is a feature it HAS.", "misconception": null}, {"option_key": "B", "hint": "AIMA (All India Management Association) and similar bodies DO exist. Professional associations are present in management.", "misconception": null}, {"option_key": "C", "hint": "AIMA has a code of conduct for managers. Ethical codes DO exist in management, though enforcement is limited.", "misconception": null}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Well-defined body of knowledge', false, 0),
    ((SELECT id FROM new_q), 'B', 'Professional association (like AIMA)', false, 1),
    ((SELECT id FROM new_q), 'C', 'Ethical code of conduct', false, 2),
    ((SELECT id FROM new_q), 'D', 'Restricted entry through a mandatory professional degree or licence', true, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Management DOES have a well-defined body of knowledge — textbooks, theories (Taylor, Fayol, Drucker), and academic courses exist. This is a feature it HAS.', NULL),
    ((SELECT id FROM new_q), 'B', 'AIMA (All India Management Association) and similar bodies DO exist. Professional associations are present in management.', NULL),
    ((SELECT id FROM new_q), 'C', 'AIMA has a code of conduct for managers. Ethical codes DO exist in management, though enforcement is limited.', NULL)
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-54
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'scenario-based', 'medium', 'Raghav, a 12th-pass entrepreneur, started a small business and within 10 years built it into a Rs. 100-crore company using his sharp business instincts and people skills. His MBA-educated competitor struggled to match him. This scenario best illustrates that management is:', 'C', 'Raghav succeeded without formal management education (no MBA) using personal skills and instincts. His MBA-educated competitor, despite having theoretical knowledge (science), could not match him. This illustrates that management is an ART — personal creativity, skill, judgement, and practice matter as much as (or more than) formal knowledge. It also shows management is NOT a full profession (no mandatory degree needed to succeed).', 'active', true, ARRAY['management-as-art','personal-skill','no-mandatory-degree']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-54", "subtopic": "Management as art — practical illustration", "topic_name": "Management — Art, Science, or Profession", "bloom_level": "apply", "options": [{"key": "A", "text": "Purely a science — Raghav must have followed scientific principles unknowingly", "is_correct": false}, {"key": "B", "text": "A full-fledged profession — since Raghav succeeded, anyone can manage", "is_correct": false}, {"key": "C", "text": "An art — because personal skill, creativity, and practice can outweigh formal knowledge", "is_correct": true}, {"key": "D", "text": "Neither art nor science — since results are random", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "If management were PURELY science, the MBA-educated competitor (who studied scientific principles) should have outperformed. Raghav''s success through intuition shows the ''art'' dimension.", "misconception": "Attributing all success to unconscious scientific principles"}, {"option_key": "B", "hint": "The scenario actually shows management is NOT a full profession — Raghav succeeded without any mandatory degree. A profession requires mandatory qualifications.", "misconception": "Confusing open entry (not a profession) with being a full profession"}, {"option_key": "D", "hint": "Results are not random — Raghav consistently built success over 10 years using skill. Skill-based consistent results indicate art, not randomness.", "misconception": "Dismissing skill-based success as random"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Purely a science — Raghav must have followed scientific principles unknowingly', false, 0),
    ((SELECT id FROM new_q), 'B', 'A full-fledged profession — since Raghav succeeded, anyone can manage', false, 1),
    ((SELECT id FROM new_q), 'C', 'An art — because personal skill, creativity, and practice can outweigh formal knowledge', true, 2),
    ((SELECT id FROM new_q), 'D', 'Neither art nor science — since results are random', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'If management were PURELY science, the MBA-educated competitor (who studied scientific principles) should have outperformed. Raghav''s success through intuition shows the ''art'' dimension.', 'Attributing all success to unconscious scientific principles'),
    ((SELECT id FROM new_q), 'B', 'The scenario actually shows management is NOT a full profession — Raghav succeeded without any mandatory degree. A profession requires mandatory qualifications.', 'Confusing open entry (not a profession) with being a full profession'),
    ((SELECT id FROM new_q), 'D', 'Results are not random — Raghav consistently built success over 10 years using skill. Skill-based consistent results indicate art, not randomness.', 'Dismissing skill-based success as random')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-55
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'match-the-following', 'hard', 'Match the characteristics in Column I with the correct nature of management in Column II:

Column I:
(i) Systematic body of knowledge with established principles
(ii) Personal creativity, skill, and practice-based application
(iii) Restricted entry through a mandatory degree or licence
(iv) Results improve with continuous practice and experience

Column II:
(P) Art
(Q) Science
(R) Profession
(S) Not fully present in management', 'B', '(i) Systematic body of knowledge = Science (Q) — science requires a systematic knowledge base. (ii) Personal creativity and practice = Art (P) — art involves skillful, creative application. (iii) Restricted entry through mandatory degree = Not fully present in management (S) — management lacks this; anyone can become a manager. (iv) Results improve with practice = Art (P) — artists improve with practice. So: (i)→Q, (ii)→P, (iii)→S, (iv)→P.', 'active', true, ARRAY['art-science-profession','characteristics-matching','restricted-entry']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-55", "subtopic": "Matching characteristics", "topic_name": "Management — Art, Science, or Profession", "bloom_level": "analyze", "options": [{"key": "A", "text": "(i)→Q, (ii)→P, (iii)→R, (iv)→P", "is_correct": false}, {"key": "B", "text": "(i)→Q, (ii)→P, (iii)→S, (iv)→P", "is_correct": true}, {"key": "C", "text": "(i)→P, (ii)→Q, (iii)→S, (iv)→R", "is_correct": false}, {"key": "D", "text": "(i)→R, (ii)→P, (iii)→Q, (iv)→S", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Option A maps (iii) restricted entry to R (Profession). But the KEY point is that management does NOT have restricted entry. It partially meets profession criteria but FAILS on restricted entry — so (iii) maps to S (Not fully present).", "misconception": "Thinking management has restricted entry like medicine or law"}, {"option_key": "C", "hint": "This swaps art and science. Systematic body of knowledge is a SCIENCE characteristic (not art), and personal creativity is an ART characteristic (not science).", "misconception": "Confusing art characteristics with science characteristics"}, {"option_key": "D", "hint": "Systematic body of knowledge (i) is Science (Q), not Profession (R). And restricted entry (iii) is not Science (Q). This option confuses all three categories.", "misconception": "Mixing up art, science, and profession characteristics completely"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', '(i)→Q, (ii)→P, (iii)→R, (iv)→P', false, 0),
    ((SELECT id FROM new_q), 'B', '(i)→Q, (ii)→P, (iii)→S, (iv)→P', true, 1),
    ((SELECT id FROM new_q), 'C', '(i)→P, (ii)→Q, (iii)→S, (iv)→R', false, 2),
    ((SELECT id FROM new_q), 'D', '(i)→R, (ii)→P, (iii)→Q, (iv)→S', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Option A maps (iii) restricted entry to R (Profession). But the KEY point is that management does NOT have restricted entry. It partially meets profession criteria but FAILS on restricted entry — so (iii) maps to S (Not fully present).', 'Thinking management has restricted entry like medicine or law'),
    ((SELECT id FROM new_q), 'C', 'This swaps art and science. Systematic body of knowledge is a SCIENCE characteristic (not art), and personal creativity is an ART characteristic (not science).', 'Confusing art characteristics with science characteristics'),
    ((SELECT id FROM new_q), 'D', 'Systematic body of knowledge (i) is Science (Q), not Profession (R). And restricted entry (iii) is not Science (Q). This option confuses all three categories.', 'Mixing up art, science, and profession characteristics completely')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-56
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'mcq', 'easy', 'Administration is primarily concerned with:', 'A', 'Administration is concerned with policy formulation, setting objectives, and making strategic decisions. It is a top-level activity that determines WHAT is to be done. Management, on the other hand, is concerned with policy implementation — getting things done through people. Administration thinks; management acts.', 'active', true, ARRAY['administration','policy-formulation','top-level-activity']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-56", "subtopic": "Administration — definition", "topic_name": "Management vs Administration", "bloom_level": "remember", "options": [{"key": "A", "text": "Policy formulation and setting objectives", "is_correct": true}, {"key": "B", "text": "Day-to-day execution of tasks", "is_correct": false}, {"key": "C", "text": "Supervising workers on the shop floor", "is_correct": false}, {"key": "D", "text": "Hiring and training employees", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "Day-to-day execution is management''s role, not administration''s. Administration decides WHAT to do; management decides HOW to do it.", "misconception": "Confusing execution (management) with policy-making (administration)"}, {"option_key": "C", "hint": "Shop-floor supervision is an operational/supervisory management activity. Administration operates at the policy level, far above the shop floor.", "misconception": "Confusing supervisory work with administrative work"}, {"option_key": "D", "hint": "Hiring and training is the staffing function of management. Administration does not directly recruit — it sets policies that guide recruitment.", "misconception": "Confusing HR management with administration"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Policy formulation and setting objectives', true, 0),
    ((SELECT id FROM new_q), 'B', 'Day-to-day execution of tasks', false, 1),
    ((SELECT id FROM new_q), 'C', 'Supervising workers on the shop floor', false, 2),
    ((SELECT id FROM new_q), 'D', 'Hiring and training employees', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'B', 'Day-to-day execution is management''s role, not administration''s. Administration decides WHAT to do; management decides HOW to do it.', 'Confusing execution (management) with policy-making (administration)'),
    ((SELECT id FROM new_q), 'C', 'Shop-floor supervision is an operational/supervisory management activity. Administration operates at the policy level, far above the shop floor.', 'Confusing supervisory work with administrative work'),
    ((SELECT id FROM new_q), 'D', 'Hiring and training is the staffing function of management. Administration does not directly recruit — it sets policies that guide recruitment.', 'Confusing HR management with administration')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-57
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'mcq', 'medium', 'Which of the following is a difference between management and administration?', 'B', 'A key distinction: Administration is a decision-making function (WHAT to do, setting policies and objectives), while Management is an execution function (HOW to do, implementing policies through people and resources). Administration determines the direction; management drives the organisation in that direction. However, the modern view considers both as part of the same process.', 'active', true, ARRAY['management-vs-administration','decision-making','execution']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-57", "subtopic": "Key differences", "topic_name": "Management vs Administration", "bloom_level": "understand", "options": [{"key": "A", "text": "Management is for government organisations; administration is for private companies", "is_correct": false}, {"key": "B", "text": "Administration involves policy formulation; management involves policy implementation", "is_correct": true}, {"key": "C", "text": "Management requires higher skills than administration", "is_correct": false}, {"key": "D", "text": "There is no difference; they are identical concepts", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "This is a common misconception. Both management and administration exist in both government and private sectors. The distinction is about function (policy vs execution), not sector.", "misconception": "Associating administration only with government and management only with private sector"}, {"option_key": "C", "hint": "Both require high skills. Administration requires strategic thinking; management requires execution skills. Neither is inherently ''higher'' — they are different.", "misconception": "Creating a false hierarchy between management and administration skills"}, {"option_key": "D", "hint": "While the modern view sees overlap, the traditional view (which CUET tests) distinguishes them: administration = policy-making, management = policy-execution.", "misconception": "Ignoring the traditional distinction taught in the syllabus"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Management is for government organisations; administration is for private companies', false, 0),
    ((SELECT id FROM new_q), 'B', 'Administration involves policy formulation; management involves policy implementation', true, 1),
    ((SELECT id FROM new_q), 'C', 'Management requires higher skills than administration', false, 2),
    ((SELECT id FROM new_q), 'D', 'There is no difference; they are identical concepts', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'This is a common misconception. Both management and administration exist in both government and private sectors. The distinction is about function (policy vs execution), not sector.', 'Associating administration only with government and management only with private sector'),
    ((SELECT id FROM new_q), 'C', 'Both require high skills. Administration requires strategic thinking; management requires execution skills. Neither is inherently ''higher'' — they are different.', 'Creating a false hierarchy between management and administration skills'),
    ((SELECT id FROM new_q), 'D', 'While the modern view sees overlap, the traditional view (which CUET tests) distinguishes them: administration = policy-making, management = policy-execution.', 'Ignoring the traditional distinction taught in the syllabus')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-58
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'diagram-based', 'hard', 'Study the Venn diagram comparing Management and Administration. Based on the diagram, which statement BEST describes the relationship between the two?', 'C', 'The Venn diagram shows that administration and management are distinct but overlapping concepts. Administration focuses on policy formulation (left), management on execution (right), but they share common activities like planning and organising (overlap). The modern view noted below the diagram states that every manager performs both administrative and managerial roles — they are not completely separate in practice.', 'active', true, ARRAY['venn-diagram','overlap','modern-view']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-58", "subtopic": "Overlap and modern view", "topic_name": "Management vs Administration", "bloom_level": "analyze", "options": [{"key": "A", "text": "Administration and management are completely separate with no overlap", "is_correct": false}, {"key": "B", "text": "Administration is superior to management in all respects", "is_correct": false}, {"key": "C", "text": "They are distinct but overlapping — both are needed, and in practice every manager does both", "is_correct": true}, {"key": "D", "text": "Management has completely replaced administration in modern organisations", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "The OVERLAP in the Venn diagram clearly disproves this. Planning and organising appear in BOTH circles, showing shared activities.", "misconception": "Ignoring the overlap area in the Venn diagram"}, {"option_key": "B", "hint": "The diagram shows them as equal-sized circles — neither is ''superior''. They are complementary: one formulates policy, the other implements it.", "misconception": "Creating a false hierarchy between management and administration"}, {"option_key": "D", "hint": "The diagram shows administration still exists as a distinct circle. And the modern view says managers do BOTH — not that one has replaced the other.", "misconception": "Thinking administration is obsolete"}], "image_uri": "diagrams/cuet-bst-nature-mgmt-58.png", "image_alt": "Venn diagram with two overlapping circles. Left circle: ADMINISTRATION — Policy formulation, Objective setting, Strategic decisions, Top-level activity. Right circle: MANAGEMENT — Policy implementation, Execution through people, Operational decisions, All levels. Overlap area: Planning, Organising, Coordinating, Both needed for organisational success. Below the diagram: ''Modern View: Every manager both administers and manages.''"}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Administration and management are completely separate with no overlap', false, 0),
    ((SELECT id FROM new_q), 'B', 'Administration is superior to management in all respects', false, 1),
    ((SELECT id FROM new_q), 'C', 'They are distinct but overlapping — both are needed, and in practice every manager does both', true, 2),
    ((SELECT id FROM new_q), 'D', 'Management has completely replaced administration in modern organisations', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'The OVERLAP in the Venn diagram clearly disproves this. Planning and organising appear in BOTH circles, showing shared activities.', 'Ignoring the overlap area in the Venn diagram'),
    ((SELECT id FROM new_q), 'B', 'The diagram shows them as equal-sized circles — neither is ''superior''. They are complementary: one formulates policy, the other implements it.', 'Creating a false hierarchy between management and administration'),
    ((SELECT id FROM new_q), 'D', 'The diagram shows administration still exists as a distinct circle. And the modern view says managers do BOTH — not that one has replaced the other.', 'Thinking administration is obsolete')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-59
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'logical-sequence', 'medium', 'Arrange the following aspects of management in the order they appear in the chapter ''Nature and Significance of Management'':
(I) Management as an Art, Science, and Profession
(II) Levels of Management
(III) Coordination as Essence of Management
(IV) Functions of Management (POSDC)
(V) Objectives of Management', 'A', 'The chapter typically follows this order: First, the concept and objectives of management are introduced (V). Then, management is analysed as an art, science, and profession (I). Next, the functions of management — POSDC — are discussed (IV). After that, levels of management — top, middle, operational — are covered (II). Finally, coordination as the essence of management is explained (III).', 'active', true, ARRAY['chapter-structure','sequence','syllabus-order']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-59", "subtopic": "Sequence of topics in the chapter", "topic_name": "Chapter Overview", "bloom_level": "remember", "options": [{"key": "A", "text": "V → I → IV → II → III", "is_correct": true}, {"key": "B", "text": "I → V → II → IV → III", "is_correct": false}, {"key": "C", "text": "V → IV → I → III → II", "is_correct": false}, {"key": "D", "text": "II → IV → V → I → III", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "The chapter starts with WHAT management is and its objectives (V) before discussing WHETHER it is an art/science (I). Understanding management comes before classifying it.", "misconception": "Placing classification before definition"}, {"option_key": "C", "hint": "Functions (POSDC) are discussed after art/science/profession, not before. The chapter first establishes the nature of management before detailing its functions.", "misconception": "Placing functions before nature/classification"}, {"option_key": "D", "hint": "Levels of management (II) does not come first. The chapter opens with the concept and objectives of management, not with the hierarchy.", "misconception": "Starting with hierarchy instead of fundamentals"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'V → I → IV → II → III', true, 0),
    ((SELECT id FROM new_q), 'B', 'I → V → II → IV → III', false, 1),
    ((SELECT id FROM new_q), 'C', 'V → IV → I → III → II', false, 2),
    ((SELECT id FROM new_q), 'D', 'II → IV → V → I → III', false, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'B', 'The chapter starts with WHAT management is and its objectives (V) before discussing WHETHER it is an art/science (I). Understanding management comes before classifying it.', 'Placing classification before definition'),
    ((SELECT id FROM new_q), 'C', 'Functions (POSDC) are discussed after art/science/profession, not before. The chapter first establishes the nature of management before detailing its functions.', 'Placing functions before nature/classification'),
    ((SELECT id FROM new_q), 'D', 'Levels of management (II) does not come first. The chapter opens with the concept and objectives of management, not with the hierarchy.', 'Starting with hierarchy instead of fundamentals')
  RETURNING question_id
)
SELECT id FROM new_q;

-- cuet-bst-nature-mgmt-60
WITH new_q AS (
  INSERT INTO med_questions (subject_id, chapter_id, question_type, difficulty, question_text, correct_answer, explanation, status, is_active, concept_tags, exam_ids, payload)
  VALUES ('business-studies', 'cuet-bst-nature-mgmt', 'scenario-based', 'hard', 'NovaTech Corp. is a well-managed company where: (a) the CEO has set a vision of becoming a market leader in 5 years, (b) departments have been structured with clear roles, (c) skilled employees have been hired, (d) the sales manager motivates the team daily, (e) quarterly reviews identify gaps and corrective actions are taken, and (f) all departments work in harmony towards the common goal. Identify which activity represents ''Coordination''.', 'D', 'Let us map each activity: (a) Setting vision = Planning; (b) Structuring departments = Organising; (c) Hiring skilled employees = Staffing; (d) Motivating the team = Directing; (e) Quarterly reviews and correction = Controlling; (f) All departments working in harmony towards a common goal = COORDINATION. Coordination is the binding force (f) that ensures all the other five functions (a through e) work together seamlessly.', 'active', true, ARRAY['all-functions-identification','coordination-in-practice','comprehensive-scenario']::text[], ARRAY['CUET']::text[], '{"question_id": "cuet-bst-nature-mgmt-60", "subtopic": "Identifying coordination among all functions", "topic_name": "Coordination", "bloom_level": "analyze", "options": [{"key": "A", "text": "Activity (a) — Setting a 5-year vision", "is_correct": false}, {"key": "B", "text": "Activity (c) — Hiring skilled employees", "is_correct": false}, {"key": "C", "text": "Activity (e) — Quarterly reviews and corrective actions", "is_correct": false}, {"key": "D", "text": "Activity (f) — All departments working in harmony towards a common goal", "is_correct": true}], "elimination_hints": [{"option_key": "A", "hint": "Setting a vision/goal is the Planning function. Planning decides WHERE to go. Coordination ensures everyone MOVES TOGETHER towards that destination.", "misconception": "Confusing goal-setting (planning) with harmony of movement (coordination)"}, {"option_key": "B", "hint": "Hiring skilled employees is the Staffing function. Staffing puts the RIGHT people in place. Coordination ensures those people work in SYNC with each other.", "misconception": "Confusing people acquisition (staffing) with people alignment (coordination)"}, {"option_key": "C", "hint": "Quarterly reviews and corrections is the Controlling function. Controlling checks if targets are MET. Coordination ensures departments work IN HARMONY — these are different.", "misconception": "Confusing performance checking (controlling) with departmental harmony (coordination)"}]}'::jsonb)
  RETURNING id
)
, ins_opts AS (
  INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Activity (a) — Setting a 5-year vision', false, 0),
    ((SELECT id FROM new_q), 'B', 'Activity (c) — Hiring skilled employees', false, 1),
    ((SELECT id FROM new_q), 'C', 'Activity (e) — Quarterly reviews and corrective actions', false, 2),
    ((SELECT id FROM new_q), 'D', 'Activity (f) — All departments working in harmony towards a common goal', true, 3)
  RETURNING question_id
)
, ins_hints AS (
  INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
  VALUES
    ((SELECT id FROM new_q), 'A', 'Setting a vision/goal is the Planning function. Planning decides WHERE to go. Coordination ensures everyone MOVES TOGETHER towards that destination.', 'Confusing goal-setting (planning) with harmony of movement (coordination)'),
    ((SELECT id FROM new_q), 'B', 'Hiring skilled employees is the Staffing function. Staffing puts the RIGHT people in place. Coordination ensures those people work in SYNC with each other.', 'Confusing people acquisition (staffing) with people alignment (coordination)'),
    ((SELECT id FROM new_q), 'C', 'Quarterly reviews and corrections is the Controlling function. Controlling checks if targets are MET. Coordination ensures departments work IN HARMONY — these are different.', 'Confusing performance checking (controlling) with departmental harmony (coordination)')
  RETURNING question_id
)
SELECT id FROM new_q;

COMMIT;