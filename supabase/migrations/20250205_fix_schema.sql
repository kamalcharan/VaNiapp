-- ════════════════════════════════════════════════════════════════════════════
-- FIX SCHEMA: Run this if you have existing tables with old schema
-- ════════════════════════════════════════════════════════════════════════════

-- Step 1: Drop old generation_jobs table (only has metadata, safe to drop)
drop table if exists med_generation_jobs cascade;

-- Step 2: Recreate with correct schema
create table if not exists med_generation_jobs (
  id                uuid primary key default gen_random_uuid(),

  subject_id        text not null,
  chapter_id        text,
  topic_id          text,
  exam_ids          text[] default '{"NEET"}',

  config            jsonb default '{}',       -- generation config (types, count, difficulty, etc.)
  output_json       jsonb,                    -- generated questions before insert

  questions_count   int default 0,
  error_message     text,

  status            text default 'pending' check (status in (
    'pending', 'generating', 'reviewed', 'approved', 'inserted', 'failed', 'cancelled'
  )),

  created_by        uuid,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create index if not exists idx_jobs_status on med_generation_jobs(status);
create index if not exists idx_jobs_chapter on med_generation_jobs(chapter_id);

-- Step 3: Enable RLS with full access for admin tool
alter table med_generation_jobs enable row level security;
drop policy if exists "Public access generation jobs" on med_generation_jobs;
create policy "Public access generation jobs" on med_generation_jobs for all using (true) with check (true);

-- Step 4: Fix options table (add option_key if missing, or recreate)
-- Check if med_question_options exists
do $$
begin
  -- Drop and recreate if table exists with wrong schema
  if exists (
    select 1 from information_schema.tables
    where table_name = 'med_question_options'
  ) then
    -- Check if option_key column exists
    if not exists (
      select 1 from information_schema.columns
      where table_name = 'med_question_options' and column_name = 'option_key'
    ) then
      -- Drop old table (questions likely don't exist yet anyway)
      drop table if exists med_question_options cascade;
    end if;
  end if;
end $$;

-- Create options table with correct schema
create table if not exists med_question_options (
  id                uuid primary key default gen_random_uuid(),
  question_id       uuid not null references med_questions(id) on delete cascade,

  option_key        text not null,            -- A, B, C, D
  option_text       text not null,
  option_text_te    text,
  is_correct        boolean default false,

  sort_order        int default 0
);

create index if not exists idx_options_question on med_question_options(question_id);

alter table med_question_options enable row level security;
drop policy if exists "Public read options" on med_question_options;
create policy "Public read options" on med_question_options for select using (true);
drop policy if exists "Public insert options" on med_question_options;
create policy "Public insert options" on med_question_options for insert with check (true);

-- Step 5: Fix elimination hints table
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_name = 'med_elimination_hints'
  ) then
    if not exists (
      select 1 from information_schema.columns
      where table_name = 'med_elimination_hints' and column_name = 'option_key'
    ) then
      drop table if exists med_elimination_hints cascade;
    end if;
  end if;
end $$;

create table if not exists med_elimination_hints (
  id                uuid primary key default gen_random_uuid(),
  question_id       uuid not null references med_questions(id) on delete cascade,
  option_key        text not null,            -- A, B, C, D (the wrong option)

  hint_text         text not null,
  hint_text_te      text,

  misconception     text,
  misconception_te  text,

  unique (question_id, option_key)
);

create index if not exists idx_hints_question on med_elimination_hints(question_id);

alter table med_elimination_hints enable row level security;
drop policy if exists "Public read hints" on med_elimination_hints;
create policy "Public read hints" on med_elimination_hints for select using (true);
drop policy if exists "Public insert hints" on med_elimination_hints;
create policy "Public insert hints" on med_elimination_hints for insert with check (true);

-- Step 6: Ensure questions table has proper insert/update policies
alter table med_questions enable row level security;
drop policy if exists "Public read active questions" on med_questions;
create policy "Public read active questions" on med_questions for select using (true);
drop policy if exists "Public insert questions" on med_questions;
create policy "Public insert questions" on med_questions for insert with check (true);
drop policy if exists "Public update questions" on med_questions;
create policy "Public update questions" on med_questions for update using (true) with check (true);

-- ════════════════════════════════════════════════════════════════════════════
-- DONE! Verify tables
-- ════════════════════════════════════════════════════════════════════════════

select 'med_generation_jobs' as table_name,
       string_agg(column_name, ', ') as columns
from information_schema.columns
where table_name = 'med_generation_jobs'
group by table_name;
