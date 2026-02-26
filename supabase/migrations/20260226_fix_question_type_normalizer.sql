-- Fix the question_type normalizer trigger to handle additional underscore
-- and shorthand variants found in generated JSON files.
-- Previous trigger missed: fill_in_the_blanks, scenario, match_following,
-- fill_blanks, fill-in-the-blanks

create or replace function normalize_question_type()
returns trigger as $$
begin
  NEW.question_type := case NEW.question_type
    when 'assertion_reasoning'  then 'assertion-reasoning'
    when 'match_the_following'  then 'match-the-following'
    when 'match_following'      then 'match-the-following'
    when 'true_false'           then 'true-false'
    when 'fill_in_the_blank'    then 'fill-in-blanks'
    when 'fill_in_the_blanks'   then 'fill-in-blanks'
    when 'fill_in_blanks'       then 'fill-in-blanks'
    when 'fill-in-the-blanks'   then 'fill-in-blanks'
    when 'fill_blanks'          then 'fill-in-blanks'
    when 'scenario_based'       then 'scenario-based'
    when 'scenario'             then 'scenario-based'
    when 'diagram_based'        then 'diagram-based'
    when 'logical_sequence'     then 'logical-sequence'
    else NEW.question_type  -- already correct or 'mcq'
  end;
  return NEW;
end;
$$ language plpgsql;
