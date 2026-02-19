-- ════════════════════════════════════════════════════════════════════════════
-- Auto-normalize question_type on INSERT / UPDATE
-- ════════════════════════════════════════════════════════════════════════════
--
-- Problem: Generated QBank JSON files inconsistently use underscores
-- (assertion_reasoning) vs hyphens (assertion-reasoning).
-- The check constraint requires hyphens.
--
-- Fix: A BEFORE trigger that normalises common underscore variants
-- to the canonical hyphen format before the row hits the constraint.
-- ════════════════════════════════════════════════════════════════════════════

create or replace function normalize_question_type()
returns trigger as $$
begin
  -- Map underscore variants → canonical hyphen format
  NEW.question_type := case NEW.question_type
    when 'assertion_reasoning'  then 'assertion-reasoning'
    when 'match_the_following'  then 'match-the-following'
    when 'true_false'           then 'true-false'
    when 'fill_in_the_blank'    then 'fill-in-blanks'
    when 'fill_in_blanks'       then 'fill-in-blanks'
    when 'scenario_based'       then 'scenario-based'
    when 'diagram_based'        then 'diagram-based'
    when 'logical_sequence'     then 'logical-sequence'
    else NEW.question_type  -- already correct or 'mcq'
  end;
  return NEW;
end;
$$ language plpgsql;

-- Drop if exists (idempotent)
drop trigger if exists trg_normalize_question_type on med_questions;

create trigger trg_normalize_question_type
  before insert or update on med_questions
  for each row
  execute function normalize_question_type();
