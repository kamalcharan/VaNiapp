-- Fix: add 'fill-in-the-blank' (singular, hyphenated) to the normalizer trigger.
-- Our BST JSON files use this variant; DB constraint requires 'fill-in-blanks'.

CREATE OR REPLACE FUNCTION normalize_question_type()
RETURNS trigger AS $$
BEGIN
  NEW.question_type := CASE NEW.question_type
    WHEN 'assertion_reasoning'  THEN 'assertion-reasoning'
    WHEN 'match_the_following'  THEN 'match-the-following'
    WHEN 'match_following'      THEN 'match-the-following'
    WHEN 'true_false'           THEN 'true-false'
    WHEN 'fill_in_the_blank'    THEN 'fill-in-blanks'
    WHEN 'fill_in_the_blanks'   THEN 'fill-in-blanks'
    WHEN 'fill_in_blanks'       THEN 'fill-in-blanks'
    WHEN 'fill-in-the-blank'    THEN 'fill-in-blanks'
    WHEN 'fill-in-the-blanks'   THEN 'fill-in-blanks'
    WHEN 'fill_blanks'          THEN 'fill-in-blanks'
    WHEN 'scenario_based'       THEN 'scenario-based'
    WHEN 'scenario'             THEN 'scenario-based'
    WHEN 'diagram_based'        THEN 'diagram-based'
    WHEN 'logical_sequence'     THEN 'logical-sequence'
    ELSE NEW.question_type
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
