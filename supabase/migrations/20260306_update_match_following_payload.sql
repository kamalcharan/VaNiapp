-- Update existing match-the-following questions to add column_a, column_b,
-- correct_mapping into payload and trim question_text (remove embedded columns).
-- These 5 questions were already inserted but lacked structured match data.

-- 1) Ch01: cuet-bst-nature-mgmt-14 (Art/Science/Profession features)
UPDATE med_questions
SET
  question_text = 'Match the features in Column I with the correct nature of management in Column II:',
  payload = payload || '{
    "column_a": [
      {"id": "i", "text": "Systematised body of knowledge", "textTe": ""},
      {"id": "ii", "text": "Personal skill and creativity", "textTe": ""},
      {"id": "iii", "text": "Restricted entry through qualification", "textTe": ""},
      {"id": "iv", "text": "Improves with practice", "textTe": ""}
    ],
    "column_b": [
      {"id": "P", "text": "Art", "textTe": ""},
      {"id": "Q", "text": "Science", "textTe": ""},
      {"id": "R", "text": "Profession", "textTe": ""}
    ],
    "correct_mapping": {"i": "Q", "ii": "P", "iii": "R", "iv": "P"}
  }'::jsonb
WHERE payload->>'question_id' = 'cuet-bst-nature-mgmt-14';

-- 2) Ch01: cuet-bst-nature-mgmt-40 (POSDC activities matching)
UPDATE med_questions
SET
  question_text = 'Match the management activities in Column I with the correct function in Column II:',
  payload = payload || '{
    "column_a": [
      {"id": "i", "text": "Setting sales target of Rs. 50 crore for next year", "textTe": ""},
      {"id": "ii", "text": "Creating a separate digital marketing department", "textTe": ""},
      {"id": "iii", "text": "Conducting interviews to hire a new CFO", "textTe": ""},
      {"id": "iv", "text": "Analysing why production fell 20% below target and taking corrective steps", "textTe": ""}
    ],
    "column_b": [
      {"id": "P", "text": "Staffing", "textTe": ""},
      {"id": "Q", "text": "Organising", "textTe": ""},
      {"id": "R", "text": "Planning", "textTe": ""},
      {"id": "S", "text": "Controlling", "textTe": ""}
    ],
    "correct_mapping": {"i": "R", "ii": "Q", "iii": "P", "iv": "S"}
  }'::jsonb
WHERE payload->>'question_id' = 'cuet-bst-nature-mgmt-40';

-- 3) Ch01: cuet-bst-nature-mgmt-55 (Art/Science/Profession/Not fully present)
UPDATE med_questions
SET
  question_text = 'Match the characteristics in Column I with the correct nature of management in Column II:',
  payload = payload || '{
    "column_a": [
      {"id": "i", "text": "Systematic body of knowledge with established principles", "textTe": ""},
      {"id": "ii", "text": "Personal creativity, skill, and practice-based application", "textTe": ""},
      {"id": "iii", "text": "Restricted entry through a mandatory degree or licence", "textTe": ""},
      {"id": "iv", "text": "Results improve with continuous practice and experience", "textTe": ""}
    ],
    "column_b": [
      {"id": "P", "text": "Art", "textTe": ""},
      {"id": "Q", "text": "Science", "textTe": ""},
      {"id": "R", "text": "Profession", "textTe": ""},
      {"id": "S", "text": "Not fully present in management", "textTe": ""}
    ],
    "correct_mapping": {"i": "Q", "ii": "P", "iii": "S", "iv": "P"}
  }'::jsonb
WHERE payload->>'question_id' = 'cuet-bst-nature-mgmt-55';

-- 4) Ch03: cuet-bst-environment-11 (dimensions of business environment)
UPDATE med_questions
SET
  question_text = 'Match the following examples with the correct dimension of business environment:',
  payload = payload || '{
    "column_a": [
      {"id": "i", "text": "GST implementation", "textTe": ""},
      {"id": "ii", "text": "Rise of smartphones", "textTe": ""},
      {"id": "iii", "text": "Increasing urbanisation", "textTe": ""},
      {"id": "iv", "text": "Rise in per capita income", "textTe": ""}
    ],
    "column_b": [
      {"id": "a", "text": "Social", "textTe": ""},
      {"id": "b", "text": "Economic", "textTe": ""},
      {"id": "c", "text": "Legal", "textTe": ""},
      {"id": "d", "text": "Technological", "textTe": ""}
    ],
    "correct_mapping": {"i": "c", "ii": "d", "iii": "a", "iv": "b"}
  }'::jsonb
WHERE payload->>'question_id' = 'cuet-bst-environment-11';

-- 5) Ch03: cuet-bst-environment-40 (LPG reforms matching)
UPDATE med_questions
SET
  question_text = 'Match the following LPG reforms with their correct descriptions:',
  payload = payload || '{
    "column_a": [
      {"id": "i", "text": "Liberalisation", "textTe": ""},
      {"id": "ii", "text": "Privatisation", "textTe": ""},
      {"id": "iii", "text": "Globalisation", "textTe": ""},
      {"id": "iv", "text": "Disinvestment", "textTe": ""}
    ],
    "column_b": [
      {"id": "a", "text": "Selling government equity in public enterprises", "textTe": ""},
      {"id": "b", "text": "Integrating with the world economy", "textTe": ""},
      {"id": "c", "text": "Removing restrictions and controls on business", "textTe": ""},
      {"id": "d", "text": "Transferring government enterprises to private ownership", "textTe": ""}
    ],
    "correct_mapping": {"i": "c", "ii": "d", "iii": "b", "iv": "a"}
  }'::jsonb
WHERE payload->>'question_id' = 'cuet-bst-environment-40';
