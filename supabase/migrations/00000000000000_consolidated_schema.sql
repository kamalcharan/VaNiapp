-- ════════════════════════════════════════════════════════════════════════════
-- VaNi — Consolidated Database Schema
-- ════════════════════════════════════════════════════════════════════════════
--
-- This single migration bootstraps the ENTIRE VaNi database from scratch
-- on a fresh Supabase project. It consolidates all 8 individual migrations
-- into one clean, ordered file.
--
-- How to use:
--   1. Create a new Supabase project
--   2. Open SQL Editor in the dashboard
--   3. Paste this entire file and click Run
--
-- Source migrations consolidated:
--   20250204_create_onboarding_tables.sql
--   20250204_create_catalog_tables.sql
--   20250205_create_question_bank.sql
--   20250205_fix_schema.sql  (columns merged into question bank schema)
--   20250206_add_chapter_progress.sql
--   20250206_add_question_mix_config.sql
--   20250206_add_vani_override.sql  (column merged into med_profiles)
--   20250207_add_cuet_chapters.sql
--
-- Tables created:
--   med_profiles, med_user_subjects, med_referral_codes    (user/onboarding)
--   med_exams, med_subjects, med_languages                 (catalog)
--   med_chapters, med_topics                               (question bank structure)
--   med_questions, med_question_options, med_elimination_hints (questions)
--   med_generation_jobs                                    (AI generation tracking)
--   med_chapter_progress                                   (user progress)
--   med_question_mix_defaults, med_user_question_mix       (question mix config)
--
-- ════════════════════════════════════════════════════════════════════════════


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ PART 1: UTILITY FUNCTIONS                                              │
-- └─────────────────────────────────────────────────────────────────────────┘

-- Auto-update updated_at on row changes (reused by many tables)
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ PART 2: ONBOARDING TABLES                                              │
-- └─────────────────────────────────────────────────────────────────────────┘

-- ── 2.1 med_profiles ───────────────────────────────────────────────────────

create table if not exists med_profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  display_name    text,
  avatar_url      text,
  email           text,
  phone           text default '',
  country_code    text default '+91',
  college         text default '',
  city            text default '',
  exam            text check (exam in ('NEET', 'CUET', 'BOTH')),
  language        text default 'en' check (language in ('en', 'te')),
  onboarding_completed boolean default false,
  vani_override   boolean default false,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

comment on column med_profiles.vani_override is
  'Secret admin setting: when true, overrides VaNi AI decisions with manual config';

-- Auto-create a profile row when a user signs up via auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into med_profiles (id, display_name, avatar_url, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture', ''),
    coalesce(new.email, '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists med_profiles_updated_at on med_profiles;
create trigger med_profiles_updated_at
  before update on med_profiles
  for each row execute function public.update_updated_at();

-- RLS
alter table med_profiles enable row level security;

drop policy if exists "Users can read own profile" on med_profiles;
create policy "Users can read own profile"
  on med_profiles for select using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on med_profiles;
create policy "Users can insert own profile"
  on med_profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on med_profiles;
create policy "Users can update own profile"
  on med_profiles for update using (auth.uid() = id);


-- ── 2.2 med_user_subjects ──────────────────────────────────────────────────

create table if not exists med_user_subjects (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references med_profiles(id) on delete cascade,
  subject_id  text not null,
  created_at  timestamptz default now(),

  unique (user_id, subject_id)
);

alter table med_user_subjects enable row level security;

drop policy if exists "Users can read own subjects" on med_user_subjects;
create policy "Users can read own subjects"
  on med_user_subjects for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own subjects" on med_user_subjects;
create policy "Users can insert own subjects"
  on med_user_subjects for insert with check (auth.uid() = user_id);

drop policy if exists "Users can delete own subjects" on med_user_subjects;
create policy "Users can delete own subjects"
  on med_user_subjects for delete using (auth.uid() = user_id);


-- ── 2.3 med_referral_codes ─────────────────────────────────────────────────

create table if not exists med_referral_codes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references med_profiles(id) on delete cascade,
  code        text not null unique,
  used_by     uuid references med_profiles(id),
  created_at  timestamptz default now()
);

alter table med_referral_codes enable row level security;

drop policy if exists "Users can read own referral code" on med_referral_codes;
create policy "Users can read own referral code"
  on med_referral_codes for select using (auth.uid() = user_id);

drop policy if exists "Users can create own referral code" on med_referral_codes;
create policy "Users can create own referral code"
  on med_referral_codes for insert with check (auth.uid() = user_id);

drop policy if exists "Anyone can look up a code to join" on med_referral_codes;
create policy "Anyone can look up a code to join"
  on med_referral_codes for select using (used_by is null);

drop policy if exists "Users can claim a referral code" on med_referral_codes;
create policy "Users can claim a referral code"
  on med_referral_codes for update
  using (used_by is null) with check (auth.uid() = used_by);


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ PART 3: CATALOG TABLES                                                 │
-- └─────────────────────────────────────────────────────────────────────────┘

-- ── 3.1 med_exams ──────────────────────────────────────────────────────────

create table if not exists med_exams (
  id          text primary key,
  title       text not null,
  subtitle    text not null default '',
  description text not null default '',
  emoji       text not null default '',
  color       text not null default '#3B82F6',
  light_bg    text not null default '#E8F0FE',
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz default now()
);

insert into med_exams (id, title, subtitle, description, emoji, color, light_bg, sort_order) values
  ('NEET', 'NEET', 'Medical Entrance', '4 subjects — Physics, Chemistry, Botany, Zoology', '🩺', '#3B82F6', '#E8F0FE', 1),
  ('CUET', 'CUET', 'University Entrance', 'Pick up to 6 domain subjects + General Test', '🎓', '#8B5CF6', '#EDEBFE', 2),
  ('BOTH', 'Both', 'NEET + CUET', 'NEET 4 auto-included + pick CUET subjects', '💪', '#F59E0B', '#FEF3E0', 3)
on conflict (id) do nothing;

alter table med_exams enable row level security;

drop policy if exists "Anyone can read active exams" on med_exams;
create policy "Anyone can read active exams"
  on med_exams for select using (is_active = true);


-- ── 3.2 med_subjects ───────────────────────────────────────────────────────

create table if not exists med_subjects (
  id          text primary key,
  name        text not null,
  emoji       text not null default '',
  color       text not null default '#64748B',
  category    text not null default 'Other',
  exam_id     text not null references med_exams(id),
  max_select  int,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz default now()
);

-- NEET subjects
insert into med_subjects (id, name, emoji, color, category, exam_id, sort_order) values
  ('physics',   'Physics',   '⚛️', '#3B82F6', 'Science', 'NEET', 1),
  ('chemistry', 'Chemistry', '🧪', '#F97316', 'Science', 'NEET', 2),
  ('botany',    'Botany',    '🌿', '#22C55E', 'Science', 'NEET', 3),
  ('zoology',   'Zoology',   '🦋', '#A855F7', 'Science', 'NEET', 4)
on conflict (id) do nothing;

-- CUET subjects (original + additional from 20250207 migration)
insert into med_subjects (id, name, emoji, color, category, exam_id, sort_order) values
  -- Science
  ('cuet-physics',    'Physics',            '⚛️', '#3B82F6', 'Science',           'CUET', 10),
  ('cuet-chemistry',  'Chemistry',          '🧪', '#F97316', 'Science',           'CUET', 11),
  ('mathematics',     'Mathematics',        '📏', '#EF4444', 'Science',           'CUET', 12),
  ('biology',         'Biology / Biotech',  '🧬', '#22C55E', 'Science',           'CUET', 13),
  ('agriculture',     'Agriculture',        '🌾', '#22C55E', 'Science',           'CUET', 14),
  ('engineering-graphics', 'Engineering Graphics', '📐', '#6366F1', 'Science',    'CUET', 15),
  -- Commerce
  ('accountancy',     'Accountancy',        '📊', '#14B8A6', 'Commerce',          'CUET', 20),
  ('business-studies','Business Studies',    '💼', '#8B5CF6', 'Commerce',          'CUET', 21),
  ('economics',       'Economics',          '💹', '#F59E0B', 'Commerce',          'CUET', 22),
  ('entrepreneurship','Entrepreneurship',   '🚀', '#0EA5E9', 'Commerce',          'CUET', 23),
  -- Arts / Humanities
  ('history',         'History',            '🏛️', '#92400E', 'Arts / Humanities', 'CUET', 30),
  ('geography',       'Geography',          '🌍', '#059669', 'Arts / Humanities', 'CUET', 31),
  ('political-science','Political Science', '🗳️', '#6366F1', 'Arts / Humanities', 'CUET', 32),
  ('sociology',       'Sociology',          '👥', '#EC4899', 'Arts / Humanities', 'CUET', 33),
  ('psychology',      'Psychology',         '🧠', '#F472B6', 'Arts / Humanities', 'CUET', 34),
  ('philosophy',      'Philosophy',         '💡', '#A78BFA', 'Arts / Humanities', 'CUET', 35),
  ('anthropology',    'Anthropology',       '🔬', '#78716C', 'Arts / Humanities', 'CUET', 36),
  ('knowledge-traditions', 'Knowledge Traditions', '📜', '#D97706', 'Arts / Humanities', 'CUET', 37),
  ('legal-studies',   'Legal Studies',      '⚖️', '#7C3AED', 'Arts / Humanities', 'CUET', 38),
  -- Other
  ('computer-science',      'Computer Science',      '💻', '#0EA5E9', 'Other', 'CUET', 40),
  ('environmental-studies', 'Environmental Studies', '🌿', '#16A34A', 'Other', 'CUET', 41),
  ('physical-education',    'Physical Education',    '🏃', '#EA580C', 'Other', 'CUET', 42),
  ('fine-arts',             'Fine Arts',             '🎨', '#DB2777', 'Other', 'CUET', 43),
  ('home-science',          'Home Science',          '🏠', '#D97706', 'Other', 'CUET', 44),
  ('mass-media',            'Mass Media / Journalism','📰', '#4F46E5', 'Other', 'CUET', 45),
  ('teaching-aptitude',     'Teaching Aptitude',     '👨‍🏫', '#EC4899', 'Other', 'CUET', 46),
  ('performing-arts',       'Performing Arts',       '🎭', '#F43F5E', 'Other', 'CUET', 47),
  ('sanskrit',              'Sanskrit',              '🕉️', '#CA8A04', 'Other', 'CUET', 48),
  -- General Test
  ('general-test',   'General Test',       '🗒️', '#64748B', 'General Test',      'CUET', 50)
on conflict (id) do nothing;

alter table med_subjects enable row level security;

drop policy if exists "Anyone can read active subjects" on med_subjects;
create policy "Anyone can read active subjects"
  on med_subjects for select using (is_active = true);


-- ── 3.3 med_languages ──────────────────────────────────────────────────────

create table if not exists med_languages (
  id          text primary key,
  label       text not null,
  native      text not null,
  emoji       text not null default '',
  description text not null default '',
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz default now()
);

insert into med_languages (id, label, native, emoji, description, sort_order) values
  ('en', 'English', 'English', 'Aa', 'Questions, explanations & UI in English', 1),
  ('te', 'Telugu',  'తెలుగు',  'అ', 'Questions & explanations in Telugu, UI in English', 2)
on conflict (id) do nothing;

alter table med_languages enable row level security;

drop policy if exists "Anyone can read active languages" on med_languages;
create policy "Anyone can read active languages"
  on med_languages for select using (is_active = true);


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ PART 4: QUESTION BANK SCHEMA                                           │
-- └─────────────────────────────────────────────────────────────────────────┘

-- ── 4.1 med_chapters ───────────────────────────────────────────────────────

create table if not exists med_chapters (
  id                text primary key,
  subject_id        text not null references med_subjects(id),
  exam_ids          text[] not null default '{"NEET"}',

  branch            text,
  name              text not null,
  name_te           text,

  chapter_number    int,
  class_level       int,                        -- 11 or 12
  weightage         decimal(4,1) default 0,     -- % weightage in exam
  avg_questions     int default 0,              -- avg questions asked per exam

  important_topics  text[] default '{}',

  is_active         boolean default true,
  created_at        timestamptz default now()
);

create index if not exists idx_chapters_subject on med_chapters(subject_id);
create index if not exists idx_chapters_branch on med_chapters(branch);
create index if not exists idx_chapters_exams on med_chapters using gin(exam_ids);

alter table med_chapters enable row level security;
drop policy if exists "Public read chapters" on med_chapters;
create policy "Public read chapters" on med_chapters for select using (true);


-- ── 4.2 med_topics ─────────────────────────────────────────────────────────

create table if not exists med_topics (
  id                text primary key,
  chapter_id        text not null references med_chapters(id) on delete cascade,

  name              text not null,
  name_te           text,

  sort_order        int default 0,
  is_important      boolean default false,
  is_active         boolean default true,
  created_at        timestamptz default now()
);

create index if not exists idx_topics_chapter on med_topics(chapter_id);

alter table med_topics enable row level security;
drop policy if exists "Public read topics" on med_topics;
create policy "Public read topics" on med_topics for select using (true);


-- ── 4.3 med_questions ──────────────────────────────────────────────────────

create table if not exists med_questions (
  id                uuid primary key default gen_random_uuid(),

  subject_id        text not null references med_subjects(id),
  chapter_id        text not null references med_chapters(id),
  topic_id          text references med_topics(id),

  exam_ids          text[] not null default '{"NEET"}',

  question_type     text not null check (question_type in (
    'mcq', 'true-false', 'assertion-reasoning', 'match-the-following',
    'fill-in-blanks', 'scenario-based', 'diagram-based', 'logical-sequence'
  )),

  difficulty        text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  strength_required text not null default 'just-started' check (strength_required in (
    'just-started', 'getting-there', 'on-track', 'strong'
  )),

  question_text     text not null,
  explanation       text,
  question_text_te  text,
  explanation_te    text,

  payload           jsonb not null default '{}',

  image_url         text,
  image_alt         text,

  correct_answer    text not null,

  source            text default 'manual',
  generation_job_id uuid,
  reviewed_by       uuid,
  reviewed_at       timestamptz,

  concept_tags      text[] default '{}',

  status            text default 'active' check (status in ('draft', 'pending_review', 'active', 'archived')),

  is_active         boolean default true,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create index if not exists idx_questions_subject on med_questions(subject_id);
create index if not exists idx_questions_chapter on med_questions(chapter_id);
create index if not exists idx_questions_topic on med_questions(topic_id);
create index if not exists idx_questions_type on med_questions(question_type);
create index if not exists idx_questions_difficulty on med_questions(difficulty);
create index if not exists idx_questions_strength on med_questions(strength_required);
create index if not exists idx_questions_status on med_questions(status);
create index if not exists idx_questions_exams on med_questions using gin(exam_ids);
create index if not exists idx_questions_tags on med_questions using gin(concept_tags);

-- updated_at trigger for questions
create or replace function update_questions_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_questions_updated_at on med_questions;
create trigger trg_questions_updated_at
  before update on med_questions
  for each row execute function update_questions_updated_at();

alter table med_questions enable row level security;
drop policy if exists "Public read active questions" on med_questions;
create policy "Public read active questions" on med_questions for select using (true);
drop policy if exists "Public insert questions" on med_questions;
create policy "Public insert questions" on med_questions for insert with check (true);
drop policy if exists "Public update questions" on med_questions;
create policy "Public update questions" on med_questions for update using (true) with check (true);


-- ── 4.4 med_question_options ───────────────────────────────────────────────

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


-- ── 4.5 med_elimination_hints ──────────────────────────────────────────────

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


-- ── 4.6 med_generation_jobs (FINAL correct schema) ─────────────────────────

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

alter table med_generation_jobs enable row level security;
drop policy if exists "Public access generation jobs" on med_generation_jobs;
create policy "Public access generation jobs" on med_generation_jobs for all using (true) with check (true);


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ PART 5: CHAPTER PROGRESS                                               │
-- └─────────────────────────────────────────────────────────────────────────┘

create table if not exists med_chapter_progress (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references med_profiles(id) on delete cascade,
  chapter_id      text not null,
  subject_id      text not null,

  -- Progress metrics
  total_in_bank       integer not null default 0,  -- total questions in chapter
  unique_attempted    integer not null default 0,  -- unique questions attempted
  total_answered      integer not null default 0,  -- total attempts (can repeat)
  correct_count       integer not null default 0,  -- total correct answers

  -- Computed percentages (updated by trigger or app)
  coverage            numeric(5,2) default 0,      -- (unique_attempted / total_in_bank) * 100
  accuracy            numeric(5,2) default 0,      -- (correct_count / total_answered) * 100

  last_practiced_at   timestamptz,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now(),

  unique (user_id, chapter_id)
);

create index if not exists idx_med_chapter_progress_user
  on med_chapter_progress (user_id);

create index if not exists idx_med_chapter_progress_subject
  on med_chapter_progress (user_id, subject_id);

-- RLS
alter table med_chapter_progress enable row level security;

drop policy if exists "Users can read own chapter progress" on med_chapter_progress;
create policy "Users can read own chapter progress"
  on med_chapter_progress for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own chapter progress" on med_chapter_progress;
create policy "Users can insert own chapter progress"
  on med_chapter_progress for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own chapter progress" on med_chapter_progress;
create policy "Users can update own chapter progress"
  on med_chapter_progress for update using (auth.uid() = user_id);

-- Auto-update updated_at
drop trigger if exists med_chapter_progress_updated_at on med_chapter_progress;
create trigger med_chapter_progress_updated_at
  before update on med_chapter_progress
  for each row execute function public.update_updated_at();

-- Function to recalculate coverage and accuracy
create or replace function recalculate_chapter_metrics()
returns trigger
language plpgsql
as $$
begin
  -- Calculate coverage
  if new.total_in_bank > 0 then
    new.coverage := (new.unique_attempted::numeric / new.total_in_bank) * 100;
  else
    new.coverage := 0;
  end if;

  -- Calculate accuracy
  if new.total_answered > 0 then
    new.accuracy := (new.correct_count::numeric / new.total_answered) * 100;
  else
    new.accuracy := 0;
  end if;

  return new;
end;
$$;

drop trigger if exists med_chapter_progress_metrics on med_chapter_progress;
create trigger med_chapter_progress_metrics
  before insert or update on med_chapter_progress
  for each row execute function recalculate_chapter_metrics();


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ PART 6: QUESTION MIX CONFIGURATION                                     │
-- └─────────────────────────────────────────────────────────────────────────┘

-- ── 6.1 Global defaults ────────────────────────────────────────────────────

create table if not exists med_question_mix_defaults (
  id              uuid primary key default gen_random_uuid(),
  name            text not null unique,
  description     text,

  -- Difficulty percentages (must sum to 100)
  easy_pct        integer not null default 30,
  medium_pct      integer not null default 50,
  hard_pct        integer not null default 20,

  -- Question type percentages (must sum to 100)
  mcq_pct                 integer not null default 60,
  assertion_reasoning_pct integer not null default 10,
  match_following_pct     integer not null default 10,
  true_false_pct          integer not null default 5,
  diagram_based_pct       integer not null default 5,
  logical_sequence_pct    integer not null default 3,
  fill_blanks_pct         integer not null default 4,
  scenario_based_pct      integer not null default 3,

  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

insert into med_question_mix_defaults (name, description, easy_pct, medium_pct, hard_pct,
  mcq_pct, assertion_reasoning_pct, match_following_pct, true_false_pct,
  diagram_based_pct, logical_sequence_pct, fill_blanks_pct, scenario_based_pct)
values
  ('trial_default', 'Default mix for trial users (30 questions)', 40, 45, 15,
   65, 10, 8, 7, 4, 2, 2, 2),
  ('paid_default', 'Default mix for paid users (200 questions)', 30, 50, 20,
   60, 10, 10, 5, 5, 3, 4, 3)
on conflict (name) do nothing;

-- ── 6.2 Per-user overrides ─────────────────────────────────────────────────

create table if not exists med_user_question_mix (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references med_profiles(id) on delete cascade,

  -- Difficulty percentages (must sum to 100)
  easy_pct        integer not null default 30,
  medium_pct      integer not null default 50,
  hard_pct        integer not null default 20,

  -- Question type percentages (must sum to 100)
  mcq_pct                 integer not null default 60,
  assertion_reasoning_pct integer not null default 10,
  match_following_pct     integer not null default 10,
  true_false_pct          integer not null default 5,
  diagram_based_pct       integer not null default 5,
  logical_sequence_pct    integer not null default 3,
  fill_blanks_pct         integer not null default 4,
  scenario_based_pct      integer not null default 3,

  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),

  unique (user_id)
);

alter table med_user_question_mix enable row level security;

drop policy if exists "Users can read own question mix" on med_user_question_mix;
create policy "Users can read own question mix"
  on med_user_question_mix for select using (auth.uid() = user_id);

-- Only admins can insert/update (via service role or admin function)
-- Users read their mix but VaNi (backend) sets it

drop trigger if exists med_user_question_mix_updated_at on med_user_question_mix;
create trigger med_user_question_mix_updated_at
  before update on med_user_question_mix
  for each row execute function public.update_updated_at();


-- ════════════════════════════════════════════════════════════════════════════
-- SEED DATA: NEET CHAPTERS
-- ════════════════════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ PHYSICS CHAPTERS (20)                                                  │
-- └─────────────────────────────────────────────────────────────────────────┘

insert into med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) values
('phy-units-measurement', 'physics', '{"NEET"}', 'Mechanics', 'Units and Measurements', 1, 11, 6.0, 3, '{"SI system", "Errors", "Dimensional analysis", "Significant figures"}'),
('phy-kinematics', 'physics', '{"NEET"}', 'Mechanics', 'Kinematics', 2, 11, 4.0, 2, '{"Motion equations", "Projectile motion", "Circular motion", "Vectors"}'),
('phy-laws-of-motion', 'physics', '{"NEET"}', 'Mechanics', 'Laws of Motion', 3, 11, 2.0, 1, '{"Newton laws", "Friction", "Circular motion dynamics"}'),
('phy-work-energy-power', 'physics', '{"NEET"}', 'Mechanics', 'Work, Energy and Power', 4, 11, 2.0, 1, '{"Work-energy theorem", "Collisions", "Power", "Conservative forces"}'),
('phy-rotational-motion', 'physics', '{"NEET"}', 'Mechanics', 'Rotational Motion', 5, 11, 6.0, 3, '{"Torque", "Angular momentum", "Moment of inertia", "Rolling motion"}'),
('phy-gravitation', 'physics', '{"NEET"}', 'Mechanics', 'Gravitation', 6, 11, 4.0, 2, '{"Kepler laws", "Satellites", "Escape velocity", "Gravitational potential"}'),
('phy-properties-matter', 'physics', '{"NEET"}', 'Mechanics', 'Properties of Solids and Liquids', 7, 11, 2.0, 1, '{"Elasticity", "Viscosity", "Surface tension", "Fluid mechanics", "Bernoulli"}'),
('phy-thermodynamics', 'physics', '{"NEET"}', 'Thermodynamics', 'Thermodynamics', 8, 11, 4.0, 2, '{"First law", "Second law", "Heat engines", "Carnot cycle"}'),
('phy-kinetic-theory', 'physics', '{"NEET"}', 'Thermodynamics', 'Kinetic Theory of Gases', 9, 11, 2.0, 1, '{"Gas laws", "RMS speed", "Mean free path", "Degrees of freedom"}'),
('phy-oscillations-waves', 'physics', '{"NEET"}', 'Waves', 'Oscillations and Waves', 10, 11, 6.0, 3, '{"SHM", "Wave motion", "Sound waves", "Beats", "Doppler effect"}'),
('phy-electrostatics', 'physics', '{"NEET"}', 'Electromagnetism', 'Electrostatics', 11, 12, 6.0, 3, '{"Coulomb law", "Electric field", "Gauss law", "Capacitors"}'),
('phy-current-electricity', 'physics', '{"NEET"}', 'Electromagnetism', 'Current Electricity', 12, 12, 6.0, 3, '{"Ohm law", "Kirchhoff laws", "Wheatstone bridge", "Potentiometer"}'),
('phy-magnetic-effects', 'physics', '{"NEET"}', 'Electromagnetism', 'Magnetic Effects of Current & Magnetism', 13, 12, 6.0, 3, '{"Biot-Savart law", "Ampere law", "Magnetic materials", "Earth magnetism"}'),
('phy-em-induction', 'physics', '{"NEET"}', 'Electromagnetism', 'Electromagnetic Induction & AC', 14, 12, 4.0, 2, '{"Faraday law", "Lenz law", "Transformers", "AC circuits", "Resonance"}'),
('phy-em-waves', 'physics', '{"NEET"}', 'Electromagnetism', 'Electromagnetic Waves', 15, 12, 4.0, 2, '{"EM spectrum", "Properties", "Applications"}'),
('phy-optics', 'physics', '{"NEET"}', 'Optics', 'Optics', 16, 12, 8.0, 4, '{"Ray optics", "Wave optics", "Interference", "Diffraction", "Polarization"}'),
('phy-dual-nature', 'physics', '{"NEET"}', 'Modern Physics', 'Dual Nature of Matter and Radiation', 17, 12, 4.0, 2, '{"Photoelectric effect", "de Broglie waves", "Davisson-Germer"}'),
('phy-atoms-nuclei', 'physics', '{"NEET"}', 'Modern Physics', 'Atoms and Nuclei', 18, 12, 4.0, 2, '{"Bohr model", "Nuclear physics", "Radioactivity", "Fission", "Fusion"}'),
('phy-electronic-devices', 'physics', '{"NEET"}', 'Modern Physics', 'Electronic Devices', 19, 12, 4.0, 2, '{"Semiconductors", "p-n junction", "Diodes", "Transistors", "Logic gates"}'),
('phy-experimental', 'physics', '{"NEET"}', 'Practical', 'Experimental Skills', 20, 12, 2.0, 1, '{"Vernier caliper", "Screw gauge", "Pendulum", "Prism experiments"}')
on conflict (id) do update set
  name = excluded.name,
  weightage = excluded.weightage,
  avg_questions = excluded.avg_questions,
  important_topics = excluded.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ CHEMISTRY CHAPTERS (20)                                                │
-- └─────────────────────────────────────────────────────────────────────────┘

insert into med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) values
-- Physical Chemistry (8)
('chem-basic-concepts', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Some Basic Concepts of Chemistry', 1, 11, 4.4, 2, '{"Mole concept", "Stoichiometry", "Empirical formula", "Limiting reagent"}'),
('chem-atomic-structure', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Structure of Atom', 2, 11, 4.4, 2, '{"Bohr model", "Quantum numbers", "Electronic configuration", "Aufbau principle"}'),
('chem-chemical-bonding', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Chemical Bonding and Molecular Structure', 3, 11, 4.4, 2, '{"VSEPR", "Hybridization", "MO theory", "Hydrogen bonding"}'),
('chem-thermodynamics', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Thermodynamics', 4, 11, 2.2, 1, '{"Enthalpy", "Hess law", "Gibbs energy", "Spontaneity"}'),
('chem-equilibrium', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Equilibrium', 5, 11, 6.7, 3, '{"Le Chatelier principle", "Buffer solutions", "Solubility product", "pH calculations"}'),
('chem-redox', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Redox Reactions', 6, 11, 2.2, 1, '{"Oxidation number", "Balancing redox", "Electrochemical series"}'),
('chem-solutions', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Solutions', 7, 12, 6.7, 3, '{"Raoult law", "Colligative properties", "van t Hoff factor", "Osmosis"}'),
('chem-electrochemistry', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Electrochemistry', 8, 12, 2.2, 1, '{"Nernst equation", "Conductivity", "Fuel cells", "Corrosion"}'),
('chem-kinetics', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Chemical Kinetics', 9, 12, 6.7, 3, '{"Rate law", "Order", "Arrhenius equation", "Activation energy"}'),

-- Inorganic Chemistry (4)
('chem-periodicity', 'chemistry', '{"NEET"}', 'Inorganic Chemistry', 'Classification of Elements and Periodicity', 10, 11, 4.4, 2, '{"Periodic trends", "Ionization energy", "Electron affinity", "Electronegativity"}'),
('chem-p-block', 'chemistry', '{"NEET"}', 'Inorganic Chemistry', 'p-Block Elements', 11, 12, 4.4, 2, '{"Group 13-18", "Oxides", "Halides", "Interhalogen compounds"}'),
('chem-d-f-block', 'chemistry', '{"NEET"}', 'Inorganic Chemistry', 'd- and f-Block Elements', 12, 12, 2.2, 1, '{"Transition elements", "KMnO4", "K2Cr2O7", "Lanthanoid contraction"}'),
('chem-coordination', 'chemistry', '{"NEET"}', 'Inorganic Chemistry', 'Coordination Compounds', 13, 12, 8.9, 4, '{"Werner theory", "Isomerism", "VBT", "CFT", "Nomenclature"}'),

-- Organic Chemistry (7)
('chem-organic-basics', 'chemistry', '{"NEET"}', 'Organic Chemistry', 'Organic Chemistry: Basic Principles', 14, 11, 8.9, 4, '{"IUPAC nomenclature", "Isomerism", "Electronic effects", "Reaction mechanisms"}'),
('chem-hydrocarbons', 'chemistry', '{"NEET"}', 'Organic Chemistry', 'Hydrocarbons', 15, 11, 6.7, 3, '{"Alkanes", "Alkenes", "Alkynes", "Aromatic compounds", "Friedel-Crafts"}'),
('chem-haloalkanes', 'chemistry', '{"NEET"}', 'Organic Chemistry', 'Haloalkanes and Haloarenes', 16, 12, 4.4, 2, '{"SN1 SN2", "Elimination", "Grignard reagent"}'),
('chem-alcohols-ethers', 'chemistry', '{"NEET"}', 'Organic Chemistry', 'Alcohols, Phenols and Ethers', 17, 12, 2.2, 1, '{"Preparation", "Reactions", "Acidic nature of phenols"}'),
('chem-aldehydes-ketones', 'chemistry', '{"NEET"}', 'Organic Chemistry', 'Aldehydes, Ketones and Carboxylic Acids', 18, 12, 6.7, 3, '{"Nucleophilic addition", "Aldol", "Cannizzaro", "Acidic strength"}'),
('chem-amines', 'chemistry', '{"NEET"}', 'Organic Chemistry', 'Amines', 19, 12, 4.4, 2, '{"Basicity", "Diazonium salts", "Coupling reactions"}'),
('chem-biomolecules', 'chemistry', '{"NEET"}', 'Organic Chemistry', 'Biomolecules', 20, 12, 4.4, 2, '{"Carbohydrates", "Proteins", "Nucleic acids", "Vitamins"}')
on conflict (id) do update set
  name = excluded.name,
  weightage = excluded.weightage,
  avg_questions = excluded.avg_questions,
  important_topics = excluded.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ BOTANY CHAPTERS (17)                                                   │
-- └─────────────────────────────────────────────────────────────────────────┘

insert into med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) values
('bot-living-world', 'botany', '{"NEET"}', 'Diversity', 'The Living World', 1, 11, 1.0, 0, '{"Biodiversity", "Taxonomy", "Binomial nomenclature", "Taxonomic hierarchy"}'),
('bot-biological-classification', 'botany', '{"NEET"}', 'Diversity', 'Biological Classification', 2, 11, 3.0, 1, '{"Five kingdoms", "Monera", "Protista", "Fungi", "Viruses"}'),
('bot-plant-kingdom', 'botany', '{"NEET"}', 'Diversity', 'Plant Kingdom', 3, 11, 7.0, 3, '{"Algae", "Bryophytes", "Pteridophytes", "Gymnosperms", "Angiosperms"}'),
('bot-morphology-flowering', 'botany', '{"NEET"}', 'Structural Organization', 'Morphology of Flowering Plants', 4, 11, 6.0, 3, '{"Root", "Stem", "Leaf", "Flower", "Fruit", "Seed", "Plant families"}'),
('bot-anatomy-flowering', 'botany', '{"NEET"}', 'Structural Organization', 'Anatomy of Flowering Plants', 5, 11, 7.0, 3, '{"Tissues", "Meristems", "Vascular bundles", "Secondary growth"}'),
('bot-cell-unit', 'botany', '{"NEET"}', 'Cell Biology', 'Cell: The Unit of Life', 6, 11, 5.0, 2, '{"Cell theory", "Prokaryotic vs Eukaryotic", "Cell organelles", "Nucleus"}'),
('bot-cell-cycle', 'botany', '{"NEET"}', 'Cell Biology', 'Cell Cycle and Cell Division', 7, 11, 9.0, 4, '{"Mitosis", "Meiosis", "Cell cycle phases", "Significance"}'),
('bot-photosynthesis', 'botany', '{"NEET"}', 'Plant Physiology', 'Photosynthesis in Higher Plants', 8, 11, 4.0, 2, '{"Light reactions", "Dark reactions", "C3 C4 pathway", "Photorespiration"}'),
('bot-respiration', 'botany', '{"NEET"}', 'Plant Physiology', 'Respiration in Plants', 9, 11, 4.0, 2, '{"Glycolysis", "Krebs cycle", "ETC", "Fermentation", "RQ"}'),
('bot-plant-growth', 'botany', '{"NEET"}', 'Plant Physiology', 'Plant Growth and Development', 10, 11, 6.0, 3, '{"Growth regulators", "Auxin", "Gibberellin", "Cytokinin", "Ethylene", "ABA"}'),
('bot-sexual-reproduction', 'botany', '{"NEET"}', 'Reproduction', 'Sexual Reproduction in Flowering Plants', 11, 12, 6.0, 3, '{"Flower structure", "Pollination", "Double fertilization", "Embryo development"}'),
('bot-inheritance', 'botany', '{"NEET"}', 'Genetics', 'Principles of Inheritance and Variation', 12, 12, 10.0, 5, '{"Mendel laws", "Linkage", "Crossing over", "Sex determination", "Genetic disorders"}'),
('bot-molecular-inheritance', 'botany', '{"NEET"}', 'Genetics', 'Molecular Basis of Inheritance', 13, 12, 14.0, 7, '{"DNA structure", "Replication", "Transcription", "Translation", "Lac operon", "Human genome project"}'),
('bot-microbes-welfare', 'botany', '{"NEET"}', 'Biology in Human Welfare', 'Microbes in Human Welfare', 14, 12, 4.0, 2, '{"Industrial microbes", "Sewage treatment", "Biogas", "Biocontrol", "Biofertilizers"}'),
('bot-organisms-populations', 'botany', '{"NEET"}', 'Ecology', 'Organisms and Populations', 15, 12, 4.0, 2, '{"Population attributes", "Growth curves", "Interactions", "Adaptations"}'),
('bot-ecosystem', 'botany', '{"NEET"}', 'Ecology', 'Ecosystem', 16, 12, 4.0, 2, '{"Energy flow", "Food chains", "Ecological pyramids", "Nutrient cycling"}'),
('bot-biodiversity', 'botany', '{"NEET"}', 'Ecology', 'Biodiversity and Conservation', 17, 12, 4.0, 2, '{"Biodiversity patterns", "Loss of biodiversity", "Conservation strategies", "Hotspots"}')
on conflict (id) do update set
  name = excluded.name,
  weightage = excluded.weightage,
  avg_questions = excluded.avg_questions,
  important_topics = excluded.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ ZOOLOGY CHAPTERS (15)                                                  │
-- └─────────────────────────────────────────────────────────────────────────┘

insert into med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) values
('zoo-animal-kingdom', 'zoology', '{"NEET"}', 'Diversity', 'Animal Kingdom', 1, 11, 13.0, 7, '{"Classification", "Phyla", "Chordates", "Non-chordates"}'),
('zoo-structural-organization', 'zoology', '{"NEET"}', 'Structural Organization', 'Structural Organisation in Animals', 2, 11, 8.0, 4, '{"Animal tissues", "Epithelium", "Connective tissue", "Cockroach", "Frog"}'),
('zoo-biomolecules', 'zoology', '{"NEET"}', 'Cell Biology', 'Biomolecules', 3, 11, 10.0, 5, '{"Carbohydrates", "Proteins", "Lipids", "Nucleic acids", "Enzymes"}'),
('zoo-breathing', 'zoology', '{"NEET"}', 'Human Physiology', 'Breathing and Exchange of Gases', 4, 11, 4.0, 2, '{"Respiratory system", "Mechanism of breathing", "Gas exchange", "Respiratory disorders"}'),
('zoo-body-fluids', 'zoology', '{"NEET"}', 'Human Physiology', 'Body Fluids and Circulation', 5, 11, 5.0, 2, '{"Blood composition", "Blood groups", "Heart", "Cardiac cycle", "ECG"}'),
('zoo-excretion', 'zoology', '{"NEET"}', 'Human Physiology', 'Excretory Products and their Elimination', 6, 11, 5.0, 2, '{"Nephron", "Urine formation", "Osmoregulation", "Kidney disorders"}'),
('zoo-locomotion', 'zoology', '{"NEET"}', 'Human Physiology', 'Locomotion and Movement', 7, 11, 6.0, 3, '{"Muscle contraction", "Skeletal system", "Joints", "Disorders"}'),
('zoo-neural-control', 'zoology', '{"NEET"}', 'Human Physiology', 'Neural Control and Coordination', 8, 11, 2.0, 1, '{"Neuron", "Nerve impulse", "Brain", "Reflex arc"}'),
('zoo-chemical-coordination', 'zoology', '{"NEET"}', 'Human Physiology', 'Chemical Coordination and Integration', 9, 11, 4.0, 2, '{"Endocrine glands", "Hormones", "Feedback mechanism"}'),
('zoo-human-reproduction', 'zoology', '{"NEET"}', 'Reproduction', 'Human Reproduction', 10, 12, 6.0, 3, '{"Male reproductive system", "Female reproductive system", "Gametogenesis", "Menstrual cycle"}'),
('zoo-reproductive-health', 'zoology', '{"NEET"}', 'Reproduction', 'Reproductive Health', 11, 12, 8.0, 4, '{"Contraception", "STDs", "Infertility", "ART"}'),
('zoo-evolution', 'zoology', '{"NEET"}', 'Genetics & Evolution', 'Evolution', 12, 12, 6.0, 3, '{"Origin of life", "Evidence of evolution", "Natural selection", "Human evolution"}'),
('zoo-human-health', 'zoology', '{"NEET"}', 'Biology in Human Welfare', 'Human Health and Diseases', 13, 12, 6.0, 3, '{"Diseases", "Immunity", "AIDS", "Cancer", "Drugs"}'),
('zoo-biotechnology-principles', 'zoology', '{"NEET"}', 'Biotechnology', 'Biotechnology: Principles and Processes', 14, 12, 12.0, 6, '{"rDNA technology", "PCR", "Gel electrophoresis", "Vectors", "Cloning"}'),
('zoo-biotechnology-applications', 'zoology', '{"NEET"}', 'Biotechnology', 'Biotechnology and its Applications', 15, 12, 7.0, 4, '{"GMO", "Bt crops", "Gene therapy", "Transgenic animals"}')
on conflict (id) do update set
  name = excluded.name,
  weightage = excluded.weightage,
  avg_questions = excluded.avg_questions,
  important_topics = excluded.important_topics;


-- ════════════════════════════════════════════════════════════════════════════
-- SEED DATA: TOPICS
-- ════════════════════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ PHYSICS TOPICS                                                         │
-- └─────────────────────────────────────────────────────────────────────────┘

insert into med_topics (id, chapter_id, name, sort_order, is_important) values
-- Units and Measurements
('phy-units-si', 'phy-units-measurement', 'SI Units and System', 1, true),
('phy-units-errors', 'phy-units-measurement', 'Errors in Measurement', 2, true),
('phy-units-dimensions', 'phy-units-measurement', 'Dimensional Analysis', 3, true),
('phy-units-significant', 'phy-units-measurement', 'Significant Figures', 4, false),

-- Kinematics
('phy-kin-motion-1d', 'phy-kinematics', 'Motion in One Dimension', 1, true),
('phy-kin-vectors', 'phy-kinematics', 'Vectors', 2, true),
('phy-kin-projectile', 'phy-kinematics', 'Projectile Motion', 3, true),
('phy-kin-circular', 'phy-kinematics', 'Circular Motion', 4, true),

-- Laws of Motion
('phy-laws-newton', 'phy-laws-of-motion', 'Newton Laws of Motion', 1, true),
('phy-laws-friction', 'phy-laws-of-motion', 'Friction', 2, true),
('phy-laws-circular-dynamics', 'phy-laws-of-motion', 'Circular Motion Dynamics', 3, true),

-- Work Energy Power
('phy-wep-work', 'phy-work-energy-power', 'Work and Work-Energy Theorem', 1, true),
('phy-wep-energy', 'phy-work-energy-power', 'Kinetic and Potential Energy', 2, true),
('phy-wep-collisions', 'phy-work-energy-power', 'Collisions', 3, true),
('phy-wep-power', 'phy-work-energy-power', 'Power', 4, false),

-- Rotational Motion
('phy-rot-torque', 'phy-rotational-motion', 'Torque', 1, true),
('phy-rot-angular-momentum', 'phy-rotational-motion', 'Angular Momentum', 2, true),
('phy-rot-moi', 'phy-rotational-motion', 'Moment of Inertia', 3, true),
('phy-rot-rolling', 'phy-rotational-motion', 'Rolling Motion', 4, true),

-- Gravitation
('phy-grav-laws', 'phy-gravitation', 'Newton Law of Gravitation', 1, true),
('phy-grav-kepler', 'phy-gravitation', 'Kepler Laws', 2, true),
('phy-grav-satellite', 'phy-gravitation', 'Satellites', 3, true),
('phy-grav-escape', 'phy-gravitation', 'Escape Velocity', 4, true),

-- Properties of Matter
('phy-prop-elasticity', 'phy-properties-matter', 'Elasticity', 1, true),
('phy-prop-viscosity', 'phy-properties-matter', 'Viscosity', 2, true),
('phy-prop-surface-tension', 'phy-properties-matter', 'Surface Tension', 3, true),
('phy-prop-bernoulli', 'phy-properties-matter', 'Bernoulli Principle', 4, true),

-- Thermodynamics
('phy-thermo-first-law', 'phy-thermodynamics', 'First Law of Thermodynamics', 1, true),
('phy-thermo-second-law', 'phy-thermodynamics', 'Second Law of Thermodynamics', 2, true),
('phy-thermo-carnot', 'phy-thermodynamics', 'Carnot Engine', 3, true),
('phy-thermo-processes', 'phy-thermodynamics', 'Thermodynamic Processes', 4, true),

-- Kinetic Theory
('phy-kinetic-gas-laws', 'phy-kinetic-theory', 'Gas Laws', 1, true),
('phy-kinetic-rms', 'phy-kinetic-theory', 'RMS Speed', 2, true),
('phy-kinetic-dof', 'phy-kinetic-theory', 'Degrees of Freedom', 3, true),

-- Oscillations and Waves
('phy-osc-shm', 'phy-oscillations-waves', 'Simple Harmonic Motion', 1, true),
('phy-osc-wave-motion', 'phy-oscillations-waves', 'Wave Motion', 2, true),
('phy-osc-sound', 'phy-oscillations-waves', 'Sound Waves', 3, true),
('phy-osc-beats', 'phy-oscillations-waves', 'Beats and Doppler Effect', 4, true),

-- Electrostatics
('phy-elec-coulomb', 'phy-electrostatics', 'Coulomb Law', 1, true),
('phy-elec-field', 'phy-electrostatics', 'Electric Field', 2, true),
('phy-elec-gauss', 'phy-electrostatics', 'Gauss Law', 3, true),
('phy-elec-capacitor', 'phy-electrostatics', 'Capacitors', 4, true),

-- Current Electricity
('phy-curr-ohm', 'phy-current-electricity', 'Ohm Law', 1, true),
('phy-curr-kirchhoff', 'phy-current-electricity', 'Kirchhoff Laws', 2, true),
('phy-curr-wheatstone', 'phy-current-electricity', 'Wheatstone Bridge', 3, true),
('phy-curr-potentiometer', 'phy-current-electricity', 'Potentiometer', 4, true),

-- Magnetic Effects
('phy-mag-biot-savart', 'phy-magnetic-effects', 'Biot-Savart Law', 1, true),
('phy-mag-ampere', 'phy-magnetic-effects', 'Ampere Law', 2, true),
('phy-mag-force', 'phy-magnetic-effects', 'Force on Current Carrying Conductor', 3, true),
('phy-mag-materials', 'phy-magnetic-effects', 'Magnetic Materials', 4, true),

-- EM Induction
('phy-emi-faraday', 'phy-em-induction', 'Faraday Law', 1, true),
('phy-emi-lenz', 'phy-em-induction', 'Lenz Law', 2, true),
('phy-emi-transformer', 'phy-em-induction', 'Transformers', 3, true),
('phy-emi-ac', 'phy-em-induction', 'AC Circuits', 4, true),

-- EM Waves
('phy-emw-spectrum', 'phy-em-waves', 'EM Spectrum', 1, true),
('phy-emw-properties', 'phy-em-waves', 'Properties of EM Waves', 2, true),

-- Optics
('phy-opt-ray', 'phy-optics', 'Ray Optics', 1, true),
('phy-opt-wave', 'phy-optics', 'Wave Optics', 2, true),
('phy-opt-interference', 'phy-optics', 'Interference', 3, true),
('phy-opt-diffraction', 'phy-optics', 'Diffraction', 4, true),
('phy-opt-polarization', 'phy-optics', 'Polarization', 5, true),

-- Dual Nature
('phy-dual-photoelectric', 'phy-dual-nature', 'Photoelectric Effect', 1, true),
('phy-dual-debroglie', 'phy-dual-nature', 'de Broglie Waves', 2, true),

-- Atoms and Nuclei
('phy-atom-bohr', 'phy-atoms-nuclei', 'Bohr Model', 1, true),
('phy-atom-nuclear', 'phy-atoms-nuclei', 'Nuclear Physics', 2, true),
('phy-atom-radioactivity', 'phy-atoms-nuclei', 'Radioactivity', 3, true),

-- Electronic Devices
('phy-elec-semiconductor', 'phy-electronic-devices', 'Semiconductors', 1, true),
('phy-elec-diode', 'phy-electronic-devices', 'p-n Junction Diode', 2, true),
('phy-elec-transistor', 'phy-electronic-devices', 'Transistors', 3, true),
('phy-elec-logic', 'phy-electronic-devices', 'Logic Gates', 4, true)
on conflict (id) do nothing;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ CHEMISTRY TOPICS                                                       │
-- └─────────────────────────────────────────────────────────────────────────┘

insert into med_topics (id, chapter_id, name, sort_order, is_important) values
-- Basic Concepts
('chem-basic-mole', 'chem-basic-concepts', 'Mole Concept', 1, true),
('chem-basic-stoich', 'chem-basic-concepts', 'Stoichiometry', 2, true),
('chem-basic-empirical', 'chem-basic-concepts', 'Empirical and Molecular Formula', 3, true),

-- Atomic Structure
('chem-atom-bohr', 'chem-atomic-structure', 'Bohr Model', 1, true),
('chem-atom-quantum', 'chem-atomic-structure', 'Quantum Numbers', 2, true),
('chem-atom-config', 'chem-atomic-structure', 'Electronic Configuration', 3, true),

-- Chemical Bonding
('chem-bond-vsepr', 'chem-chemical-bonding', 'VSEPR Theory', 1, true),
('chem-bond-hybrid', 'chem-chemical-bonding', 'Hybridization', 2, true),
('chem-bond-mo', 'chem-chemical-bonding', 'Molecular Orbital Theory', 3, true),
('chem-bond-hydrogen', 'chem-chemical-bonding', 'Hydrogen Bonding', 4, true),

-- Thermodynamics
('chem-thermo-enthalpy', 'chem-thermodynamics', 'Enthalpy', 1, true),
('chem-thermo-hess', 'chem-thermodynamics', 'Hess Law', 2, true),
('chem-thermo-gibbs', 'chem-thermodynamics', 'Gibbs Energy', 3, true),

-- Equilibrium
('chem-eq-chemical', 'chem-equilibrium', 'Chemical Equilibrium', 1, true),
('chem-eq-lechatelier', 'chem-equilibrium', 'Le Chatelier Principle', 2, true),
('chem-eq-buffer', 'chem-equilibrium', 'Buffer Solutions', 3, true),
('chem-eq-ksp', 'chem-equilibrium', 'Solubility Product', 4, true),

-- Solutions
('chem-sol-concentration', 'chem-solutions', 'Concentration Terms', 1, true),
('chem-sol-raoult', 'chem-solutions', 'Raoult Law', 2, true),
('chem-sol-colligative', 'chem-solutions', 'Colligative Properties', 3, true),

-- Electrochemistry
('chem-electro-nernst', 'chem-electrochemistry', 'Nernst Equation', 1, true),
('chem-electro-conductivity', 'chem-electrochemistry', 'Conductivity', 2, true),
('chem-electro-cells', 'chem-electrochemistry', 'Electrochemical Cells', 3, true),

-- Kinetics
('chem-kin-rate', 'chem-kinetics', 'Rate Law', 1, true),
('chem-kin-order', 'chem-kinetics', 'Order of Reaction', 2, true),
('chem-kin-arrhenius', 'chem-kinetics', 'Arrhenius Equation', 3, true),

-- Coordination Compounds
('chem-coord-werner', 'chem-coordination', 'Werner Theory', 1, true),
('chem-coord-isomerism', 'chem-coordination', 'Isomerism', 2, true),
('chem-coord-vbt', 'chem-coordination', 'Valence Bond Theory', 3, true),
('chem-coord-cft', 'chem-coordination', 'Crystal Field Theory', 4, true),

-- Organic Basics
('chem-org-nomenclature', 'chem-organic-basics', 'IUPAC Nomenclature', 1, true),
('chem-org-isomerism', 'chem-organic-basics', 'Isomerism', 2, true),
('chem-org-effects', 'chem-organic-basics', 'Electronic Effects', 3, true),
('chem-org-mechanisms', 'chem-organic-basics', 'Reaction Mechanisms', 4, true),

-- Hydrocarbons
('chem-hc-alkanes', 'chem-hydrocarbons', 'Alkanes', 1, true),
('chem-hc-alkenes', 'chem-hydrocarbons', 'Alkenes', 2, true),
('chem-hc-alkynes', 'chem-hydrocarbons', 'Alkynes', 3, true),
('chem-hc-aromatic', 'chem-hydrocarbons', 'Aromatic Compounds', 4, true),

-- Aldehydes Ketones
('chem-ald-nucleophilic', 'chem-aldehydes-ketones', 'Nucleophilic Addition', 1, true),
('chem-ald-aldol', 'chem-aldehydes-ketones', 'Aldol Condensation', 2, true),
('chem-ald-cannizzaro', 'chem-aldehydes-ketones', 'Cannizzaro Reaction', 3, true)
on conflict (id) do nothing;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ BOTANY TOPICS                                                          │
-- └─────────────────────────────────────────────────────────────────────────┘

insert into med_topics (id, chapter_id, name, sort_order, is_important) values
-- Cell Unit of Life
('bot-cell-theory', 'bot-cell-unit', 'Cell Theory', 1, true),
('bot-cell-prokaryotic', 'bot-cell-unit', 'Prokaryotic Cells', 2, true),
('bot-cell-eukaryotic', 'bot-cell-unit', 'Eukaryotic Cells', 3, true),
('bot-cell-organelles', 'bot-cell-unit', 'Cell Organelles', 4, true),

-- Cell Cycle
('bot-cycle-phases', 'bot-cell-cycle', 'Cell Cycle Phases', 1, true),
('bot-cycle-mitosis', 'bot-cell-cycle', 'Mitosis', 2, true),
('bot-cycle-meiosis', 'bot-cell-cycle', 'Meiosis', 3, true),
('bot-cycle-significance', 'bot-cell-cycle', 'Significance of Cell Division', 4, true),

-- Biological Classification
('bot-class-monera', 'bot-biological-classification', 'Kingdom Monera', 1, true),
('bot-class-protista', 'bot-biological-classification', 'Kingdom Protista', 2, true),
('bot-class-fungi', 'bot-biological-classification', 'Kingdom Fungi', 3, true),
('bot-class-viruses', 'bot-biological-classification', 'Viruses and Viroids', 4, true),

-- Plant Kingdom
('bot-plant-algae', 'bot-plant-kingdom', 'Algae', 1, true),
('bot-plant-bryophytes', 'bot-plant-kingdom', 'Bryophytes', 2, true),
('bot-plant-pteridophytes', 'bot-plant-kingdom', 'Pteridophytes', 3, true),
('bot-plant-gymnosperms', 'bot-plant-kingdom', 'Gymnosperms', 4, true),
('bot-plant-angiosperms', 'bot-plant-kingdom', 'Angiosperms', 5, true),

-- Morphology
('bot-morph-root', 'bot-morphology-flowering', 'Root', 1, true),
('bot-morph-stem', 'bot-morphology-flowering', 'Stem', 2, true),
('bot-morph-leaf', 'bot-morphology-flowering', 'Leaf', 3, true),
('bot-morph-flower', 'bot-morphology-flowering', 'Flower', 4, true),
('bot-morph-fruit', 'bot-morphology-flowering', 'Fruit', 5, true),
('bot-morph-families', 'bot-morphology-flowering', 'Plant Families', 6, true),

-- Anatomy
('bot-anat-tissues', 'bot-anatomy-flowering', 'Plant Tissues', 1, true),
('bot-anat-meristems', 'bot-anatomy-flowering', 'Meristems', 2, true),
('bot-anat-vascular', 'bot-anatomy-flowering', 'Vascular Bundles', 3, true),
('bot-anat-secondary', 'bot-anatomy-flowering', 'Secondary Growth', 4, true),

-- Photosynthesis
('bot-photo-light', 'bot-photosynthesis', 'Light Reactions', 1, true),
('bot-photo-dark', 'bot-photosynthesis', 'Dark Reactions', 2, true),
('bot-photo-c3c4', 'bot-photosynthesis', 'C3 and C4 Pathways', 3, true),
('bot-photo-photorespiration', 'bot-photosynthesis', 'Photorespiration', 4, true),

-- Respiration
('bot-resp-glycolysis', 'bot-respiration', 'Glycolysis', 1, true),
('bot-resp-krebs', 'bot-respiration', 'Krebs Cycle', 2, true),
('bot-resp-etc', 'bot-respiration', 'Electron Transport Chain', 3, true),
('bot-resp-fermentation', 'bot-respiration', 'Fermentation', 4, true),

-- Plant Growth
('bot-growth-regulators', 'bot-plant-growth', 'Plant Growth Regulators', 1, true),
('bot-growth-auxin', 'bot-plant-growth', 'Auxin', 2, true),
('bot-growth-gibberellin', 'bot-plant-growth', 'Gibberellin', 3, true),
('bot-growth-development', 'bot-plant-growth', 'Development Processes', 4, true),

-- Sexual Reproduction
('bot-repro-flower', 'bot-sexual-reproduction', 'Flower Structure', 1, true),
('bot-repro-pollination', 'bot-sexual-reproduction', 'Pollination', 2, true),
('bot-repro-fertilization', 'bot-sexual-reproduction', 'Double Fertilization', 3, true),
('bot-repro-embryo', 'bot-sexual-reproduction', 'Embryo Development', 4, true),

-- Inheritance
('bot-inherit-mendel', 'bot-inheritance', 'Mendel Laws', 1, true),
('bot-inherit-linkage', 'bot-inheritance', 'Linkage and Crossing Over', 2, true),
('bot-inherit-sex', 'bot-inheritance', 'Sex Determination', 3, true),
('bot-inherit-disorders', 'bot-inheritance', 'Genetic Disorders', 4, true),

-- Molecular Inheritance
('bot-mol-dna-structure', 'bot-molecular-inheritance', 'DNA Structure', 1, true),
('bot-mol-replication', 'bot-molecular-inheritance', 'DNA Replication', 2, true),
('bot-mol-transcription', 'bot-molecular-inheritance', 'Transcription', 3, true),
('bot-mol-translation', 'bot-molecular-inheritance', 'Translation', 4, true),
('bot-mol-operon', 'bot-molecular-inheritance', 'Lac Operon', 5, true),
('bot-mol-hgp', 'bot-molecular-inheritance', 'Human Genome Project', 6, true),

-- Ecosystem
('bot-eco-energy', 'bot-ecosystem', 'Energy Flow', 1, true),
('bot-eco-pyramids', 'bot-ecosystem', 'Ecological Pyramids', 2, true),
('bot-eco-nutrient', 'bot-ecosystem', 'Nutrient Cycling', 3, true)
on conflict (id) do nothing;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ ZOOLOGY TOPICS                                                         │
-- └─────────────────────────────────────────────────────────────────────────┘

insert into med_topics (id, chapter_id, name, sort_order, is_important) values
-- Animal Kingdom
('zoo-kingdom-classification', 'zoo-animal-kingdom', 'Basis of Classification', 1, true),
('zoo-kingdom-porifera', 'zoo-animal-kingdom', 'Phylum Porifera', 2, true),
('zoo-kingdom-cnidaria', 'zoo-animal-kingdom', 'Phylum Cnidaria', 3, true),
('zoo-kingdom-platyhelminthes', 'zoo-animal-kingdom', 'Phylum Platyhelminthes', 4, true),
('zoo-kingdom-annelida', 'zoo-animal-kingdom', 'Phylum Annelida', 5, true),
('zoo-kingdom-arthropoda', 'zoo-animal-kingdom', 'Phylum Arthropoda', 6, true),
('zoo-kingdom-mollusca', 'zoo-animal-kingdom', 'Phylum Mollusca', 7, true),
('zoo-kingdom-chordata', 'zoo-animal-kingdom', 'Phylum Chordata', 8, true),

-- Structural Organization
('zoo-struct-tissues', 'zoo-structural-organization', 'Animal Tissues', 1, true),
('zoo-struct-epithelium', 'zoo-structural-organization', 'Epithelial Tissue', 2, true),
('zoo-struct-connective', 'zoo-structural-organization', 'Connective Tissue', 3, true),
('zoo-struct-cockroach', 'zoo-structural-organization', 'Cockroach Anatomy', 4, true),
('zoo-struct-frog', 'zoo-structural-organization', 'Frog Anatomy', 5, true),

-- Biomolecules
('zoo-bio-carbs', 'zoo-biomolecules', 'Carbohydrates', 1, true),
('zoo-bio-proteins', 'zoo-biomolecules', 'Proteins', 2, true),
('zoo-bio-lipids', 'zoo-biomolecules', 'Lipids', 3, true),
('zoo-bio-nucleic', 'zoo-biomolecules', 'Nucleic Acids', 4, true),
('zoo-bio-enzymes', 'zoo-biomolecules', 'Enzymes', 5, true),

-- Breathing
('zoo-breath-system', 'zoo-breathing', 'Respiratory System', 1, true),
('zoo-breath-mechanism', 'zoo-breathing', 'Mechanism of Breathing', 2, true),
('zoo-breath-exchange', 'zoo-breathing', 'Gas Exchange', 3, true),
('zoo-breath-transport', 'zoo-breathing', 'Transport of Gases', 4, true),

-- Body Fluids
('zoo-blood-composition', 'zoo-body-fluids', 'Blood Composition', 1, true),
('zoo-blood-groups', 'zoo-body-fluids', 'Blood Groups', 2, true),
('zoo-blood-heart', 'zoo-body-fluids', 'Human Heart', 3, true),
('zoo-blood-cardiac', 'zoo-body-fluids', 'Cardiac Cycle', 4, true),
('zoo-blood-ecg', 'zoo-body-fluids', 'ECG', 5, true),

-- Excretion
('zoo-excr-nephron', 'zoo-excretion', 'Nephron Structure', 1, true),
('zoo-excr-urine', 'zoo-excretion', 'Urine Formation', 2, true),
('zoo-excr-osmoregulation', 'zoo-excretion', 'Osmoregulation', 3, true),
('zoo-excr-disorders', 'zoo-excretion', 'Kidney Disorders', 4, true),

-- Locomotion
('zoo-loco-muscle', 'zoo-locomotion', 'Muscle Contraction', 1, true),
('zoo-loco-skeletal', 'zoo-locomotion', 'Skeletal System', 2, true),
('zoo-loco-joints', 'zoo-locomotion', 'Joints', 3, true),
('zoo-loco-disorders', 'zoo-locomotion', 'Muscular Disorders', 4, true),

-- Neural Control
('zoo-neural-neuron', 'zoo-neural-control', 'Neuron Structure', 1, true),
('zoo-neural-impulse', 'zoo-neural-control', 'Nerve Impulse', 2, true),
('zoo-neural-brain', 'zoo-neural-control', 'Human Brain', 3, true),
('zoo-neural-reflex', 'zoo-neural-control', 'Reflex Arc', 4, true),

-- Chemical Coordination
('zoo-chem-endocrine', 'zoo-chemical-coordination', 'Endocrine Glands', 1, true),
('zoo-chem-hormones', 'zoo-chemical-coordination', 'Hormones', 2, true),
('zoo-chem-feedback', 'zoo-chemical-coordination', 'Feedback Mechanism', 3, true),

-- Human Reproduction
('zoo-repro-male', 'zoo-human-reproduction', 'Male Reproductive System', 1, true),
('zoo-repro-female', 'zoo-human-reproduction', 'Female Reproductive System', 2, true),
('zoo-repro-gametogenesis', 'zoo-human-reproduction', 'Gametogenesis', 3, true),
('zoo-repro-menstrual', 'zoo-human-reproduction', 'Menstrual Cycle', 4, true),
('zoo-repro-fertilization', 'zoo-human-reproduction', 'Fertilization', 5, true),

-- Reproductive Health
('zoo-rh-contraception', 'zoo-reproductive-health', 'Contraception Methods', 1, true),
('zoo-rh-stds', 'zoo-reproductive-health', 'STDs', 2, true),
('zoo-rh-infertility', 'zoo-reproductive-health', 'Infertility', 3, true),
('zoo-rh-art', 'zoo-reproductive-health', 'Assisted Reproductive Technologies', 4, true),

-- Evolution
('zoo-evo-origin', 'zoo-evolution', 'Origin of Life', 1, true),
('zoo-evo-evidence', 'zoo-evolution', 'Evidence of Evolution', 2, true),
('zoo-evo-natural', 'zoo-evolution', 'Natural Selection', 3, true),
('zoo-evo-human', 'zoo-evolution', 'Human Evolution', 4, true),

-- Human Health
('zoo-health-diseases', 'zoo-human-health', 'Common Diseases', 1, true),
('zoo-health-immunity', 'zoo-human-health', 'Immunity', 2, true),
('zoo-health-aids', 'zoo-human-health', 'AIDS', 3, true),
('zoo-health-cancer', 'zoo-human-health', 'Cancer', 4, true),
('zoo-health-drugs', 'zoo-human-health', 'Drug Abuse', 5, true),

-- Biotechnology Principles
('zoo-biotech-rdna', 'zoo-biotechnology-principles', 'rDNA Technology', 1, true),
('zoo-biotech-pcr', 'zoo-biotechnology-principles', 'PCR', 2, true),
('zoo-biotech-gel', 'zoo-biotechnology-principles', 'Gel Electrophoresis', 3, true),
('zoo-biotech-vectors', 'zoo-biotechnology-principles', 'Vectors', 4, true),
('zoo-biotech-cloning', 'zoo-biotechnology-principles', 'Cloning', 5, true),

-- Biotechnology Applications
('zoo-bioapp-gmo', 'zoo-biotechnology-applications', 'GMO', 1, true),
('zoo-bioapp-bt', 'zoo-biotechnology-applications', 'Bt Crops', 2, true),
('zoo-bioapp-gene-therapy', 'zoo-biotechnology-applications', 'Gene Therapy', 3, true),
('zoo-bioapp-transgenic', 'zoo-biotechnology-applications', 'Transgenic Animals', 4, true)
on conflict (id) do nothing;


-- ════════════════════════════════════════════════════════════════════════════
-- SEED DATA: CUET SUBJECTS & CHAPTERS
-- (from 20250207_add_cuet_chapters.sql)
-- ════════════════════════════════════════════════════════════════════════════

-- Update NEET chapters that overlap with CUET Physics
UPDATE med_chapters SET exam_ids = '{"NEET", "CUET"}'
WHERE subject_id = 'physics' AND id IN (
  'phy-electrostatics',
  'phy-current-electricity',
  'phy-magnetic-effects',
  'phy-em-induction',
  'phy-em-waves',
  'phy-optics',
  'phy-dual-nature',
  'phy-atoms-nuclei',
  'phy-electronic-devices'
);

-- Update NEET chapters that overlap with CUET Chemistry
UPDATE med_chapters SET exam_ids = '{"NEET", "CUET"}'
WHERE subject_id = 'chemistry' AND id IN (
  'chem-solutions',
  'chem-electrochemistry',
  'chem-kinetics',
  'chem-d-f-block',
  'chem-coordination',
  'chem-haloalkanes',
  'chem-alcohols-ethers',
  'chem-aldehydes-ketones',
  'chem-amines',
  'chem-biomolecules'
);


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ CUET BIOLOGY CHAPTERS (13)                                             │
-- └─────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
-- Unit I: Reproduction
('cuet-bio-sexual-repro-plants', 'biology', '{"CUET"}', 'Reproduction', 'Sexual Reproduction in Flowering Plants', 1, 12, 8.0, 4, '{"Flower structure", "Gametophyte development", "Pollination types", "Double fertilization", "Embryo development", "Apomixis", "Parthenocarpy"}'),
('cuet-bio-human-repro', 'biology', '{"CUET"}', 'Reproduction', 'Human Reproduction', 2, 12, 8.0, 4, '{"Male reproductive system", "Female reproductive system", "Gametogenesis", "Menstrual cycle", "Fertilization", "Embryo development", "Parturition"}'),
('cuet-bio-repro-health', 'biology', '{"CUET"}', 'Reproduction', 'Reproductive Health', 3, 12, 6.0, 3, '{"STDs prevention", "Birth control methods", "Contraception", "MTP", "Amniocentesis", "IVF", "ZIFT", "GIFT"}'),

-- Unit II: Genetics and Evolution
('cuet-bio-inheritance', 'biology', '{"CUET"}', 'Genetics', 'Principles of Inheritance and Variation', 4, 12, 10.0, 5, '{"Mendelian inheritance", "Incomplete dominance", "Co-dominance", "Blood groups", "Sex determination", "Linkage", "Genetic disorders"}'),
('cuet-bio-molecular-inheritance', 'biology', '{"CUET"}', 'Genetics', 'Molecular Basis of Inheritance', 5, 12, 10.0, 5, '{"DNA structure", "DNA replication", "Transcription", "Genetic code", "Translation", "Lac operon", "Human genome project"}'),
('cuet-bio-evolution', 'biology', '{"CUET"}', 'Evolution', 'Evolution', 6, 12, 8.0, 4, '{"Origin of life", "Biological evolution", "Darwin contribution", "Natural selection", "Hardy-Weinberg", "Human evolution"}'),

-- Unit III: Biology and Human Welfare
('cuet-bio-human-health', 'biology', '{"CUET"}', 'Human Welfare', 'Human Health and Disease', 7, 12, 8.0, 4, '{"Pathogens", "Malaria", "Dengue", "Typhoid", "Immunology", "Vaccines", "Cancer", "AIDS", "Drug abuse"}'),
('cuet-bio-microbes-welfare', 'biology', '{"CUET"}', 'Human Welfare', 'Microbes in Human Welfare', 8, 12, 6.0, 3, '{"Food processing", "Industrial production", "Sewage treatment", "Biogas", "Biocontrol", "Biofertilizers", "Antibiotics"}'),

-- Unit IV: Biotechnology
('cuet-bio-biotech-principles', 'biology', '{"CUET"}', 'Biotechnology', 'Biotechnology: Principles and Processes', 9, 12, 8.0, 4, '{"Genetic engineering", "Recombinant DNA technology", "PCR", "Gel electrophoresis", "Vectors"}'),
('cuet-bio-biotech-applications', 'biology', '{"CUET"}', 'Biotechnology', 'Biotechnology and its Applications', 10, 12, 8.0, 4, '{"Human insulin", "Vaccines", "Gene therapy", "Bt crops", "Transgenic animals", "Biosafety", "Biopiracy"}'),

-- Unit V: Ecology
('cuet-bio-organisms-populations', 'biology', '{"CUET"}', 'Ecology', 'Organisms and Populations', 11, 12, 6.0, 3, '{"Population interactions", "Mutualism", "Competition", "Predation", "Parasitism", "Population growth"}'),
('cuet-bio-ecosystem', 'biology', '{"CUET"}', 'Ecology', 'Ecosystems', 12, 12, 6.0, 3, '{"Ecosystem components", "Productivity", "Decomposition", "Energy flow", "Ecological pyramids"}'),
('cuet-bio-biodiversity', 'biology', '{"CUET"}', 'Ecology', 'Biodiversity and Conservation', 13, 12, 8.0, 4, '{"Biodiversity patterns", "Loss of biodiversity", "Conservation", "Hotspots", "Red Data Book", "Biosphere reserves"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ CUET PHYSICS CHAPTERS (10 units - Class 12 only)                       │
-- └─────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-phy-electrostatics', 'cuet-physics', '{"CUET"}', 'Electromagnetism', 'Electrostatics', 1, 12, 10.0, 5, '{"Coulomb law", "Electric field", "Superposition", "Continuous charge distribution", "Gauss law", "Capacitors"}'),
('cuet-phy-current-electricity', 'cuet-physics', '{"CUET"}', 'Electromagnetism', 'Current Electricity', 2, 12, 10.0, 5, '{"Ohm law", "Drift velocity", "Kirchhoff laws", "Wheatstone bridge", "Potentiometer", "Meter bridge"}'),
('cuet-phy-magnetic-effects', 'cuet-physics', '{"CUET"}', 'Electromagnetism', 'Magnetic Effects of Current and Magnetism', 3, 12, 12.0, 6, '{"Biot-Savart law", "Ampere law", "Force on moving charge", "Galvanometer", "Magnetic materials", "Earth magnetism"}'),
('cuet-phy-em-induction', 'cuet-physics', '{"CUET"}', 'Electromagnetism', 'Electromagnetic Induction and AC', 4, 12, 10.0, 5, '{"Faraday laws", "Lenz law", "Self induction", "Mutual induction", "AC circuits", "Transformers"}'),
('cuet-phy-em-waves', 'cuet-physics', '{"CUET"}', 'Electromagnetism', 'Electromagnetic Waves', 5, 12, 6.0, 3, '{"Displacement current", "EM wave characteristics", "EM spectrum", "Applications"}'),
('cuet-phy-optics', 'cuet-physics', '{"CUET"}', 'Optics', 'Optics', 6, 12, 14.0, 7, '{"Reflection", "Refraction", "Mirror formula", "Lens formula", "Total internal reflection", "Interference", "Diffraction", "Polarization"}'),
('cuet-phy-dual-nature', 'cuet-physics', '{"CUET"}', 'Modern Physics', 'Dual Nature of Matter and Radiation', 7, 12, 8.0, 4, '{"Photoelectric effect", "Einstein equation", "Matter waves", "Davisson-Germer experiment"}'),
('cuet-phy-atoms-nuclei', 'cuet-physics', '{"CUET"}', 'Modern Physics', 'Atoms and Nuclei', 8, 12, 8.0, 4, '{"Alpha scattering", "Bohr model", "Energy levels", "Nuclear composition", "Radioactivity", "Fission", "Fusion"}'),
('cuet-phy-electronic-devices', 'cuet-physics', '{"CUET"}', 'Modern Physics', 'Electronic Devices', 9, 12, 10.0, 5, '{"Semiconductors", "p-n junction", "Diodes", "Zener diode", "Transistor", "Logic gates"}'),
('cuet-phy-communication', 'cuet-physics', '{"CUET"}', 'Communication', 'Communication Systems', 10, 12, 6.0, 3, '{"Communication elements", "Bandwidth", "Modulation", "Amplitude modulation", "Detection"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ CUET CHEMISTRY CHAPTERS (10 units)                                     │
-- └─────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-chem-solutions', 'cuet-chemistry', '{"CUET"}', 'Physical Chemistry', 'Solutions', 1, 12, 8.0, 4, '{"Concentration terms", "Raoult law", "Colligative properties", "van t Hoff factor", "Osmotic pressure"}'),
('cuet-chem-electrochemistry', 'cuet-chemistry', '{"CUET"}', 'Physical Chemistry', 'Electrochemistry', 2, 12, 10.0, 5, '{"Nernst equation", "Kohlrausch law", "Lead storage battery", "Fuel cell", "Corrosion"}'),
('cuet-chem-kinetics', 'cuet-chemistry', '{"CUET"}', 'Physical Chemistry', 'Chemical Kinetics', 3, 12, 8.0, 4, '{"Rate law", "Order of reaction", "First order reactions", "Activation energy", "Arrhenius equation"}'),
('cuet-chem-d-f-block', 'cuet-chemistry', '{"CUET"}', 'Inorganic Chemistry', 'd and f Block Elements', 4, 12, 8.0, 4, '{"d-block configurations", "Lanthanoids", "KMnO4 preparation", "K2Cr2O7 preparation", "Interstitial compounds"}'),
('cuet-chem-coordination', 'cuet-chemistry', '{"CUET"}', 'Inorganic Chemistry', 'Coordination Compounds', 5, 12, 8.0, 4, '{"Werner theory", "IUPAC nomenclature", "Isomerism", "VBT", "CFT", "Bonding"}'),
('cuet-chem-haloalkanes', 'cuet-chemistry', '{"CUET"}', 'Organic Chemistry', 'Haloalkanes and Haloarenes', 6, 12, 15.0, 7, '{"SN1 SN2 reactions", "Elimination reactions", "Grignard reagent", "Preparation methods"}'),
('cuet-chem-alcohols-phenols', 'cuet-chemistry', '{"CUET"}', 'Organic Chemistry', 'Alcohols, Phenols and Ethers', 7, 12, 15.0, 7, '{"Preparation of alcohols", "Acidity of phenol", "Reactions", "Williamson synthesis"}'),
('cuet-chem-aldehydes-ketones', 'cuet-chemistry', '{"CUET"}', 'Organic Chemistry', 'Aldehydes, Ketones and Carboxylic Acids', 8, 12, 10.0, 5, '{"Nucleophilic addition", "Aldol condensation", "Cannizzaro", "Acidity of carboxylic acids"}'),
('cuet-chem-amines', 'cuet-chemistry', '{"CUET"}', 'Organic Chemistry', 'Amines', 9, 12, 15.0, 7, '{"Basicity order", "Preparation", "Diazonium salts", "Coupling reactions", "Gabriel synthesis"}'),
('cuet-chem-biomolecules', 'cuet-chemistry', '{"CUET"}', 'Organic Chemistry', 'Biomolecules', 10, 12, 8.0, 4, '{"Carbohydrates", "Proteins", "Amino acids", "Nucleic acids", "Vitamins", "Enzymes"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ CUET MATHEMATICS CHAPTERS (13 units)                                   │
-- └─────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
-- Unit I: Relations and Functions
('cuet-math-relations', 'mathematics', '{"CUET"}', 'Algebra', 'Relations and Functions', 1, 12, 8.0, 4, '{"Types of relations", "Reflexive", "Symmetric", "Transitive", "Equivalence relations", "One-to-one", "Onto functions"}'),
('cuet-math-inverse-trig', 'mathematics', '{"CUET"}', 'Algebra', 'Inverse Trigonometric Functions', 2, 12, 6.0, 3, '{"Definition", "Domain", "Range", "Principal value", "Graphs"}'),

-- Unit II: Algebra
('cuet-math-matrices', 'mathematics', '{"CUET"}', 'Algebra', 'Matrices', 3, 12, 10.0, 5, '{"Matrix types", "Operations", "Transpose", "Symmetric", "Skew-symmetric", "Invertible matrices"}'),
('cuet-math-determinants', 'mathematics', '{"CUET"}', 'Algebra', 'Determinants', 4, 12, 10.0, 5, '{"Determinant calculation", "Minors", "Cofactors", "Area of triangle", "Adjoint", "Inverse", "Linear equations"}'),

-- Unit III: Calculus
('cuet-math-continuity', 'mathematics', '{"CUET"}', 'Calculus', 'Continuity and Differentiability', 5, 12, 12.0, 6, '{"Continuity", "Differentiability", "Chain rule", "Inverse trig derivatives", "Implicit functions", "Logarithmic differentiation"}'),
('cuet-math-applications-deriv', 'mathematics', '{"CUET"}', 'Calculus', 'Applications of Derivatives', 6, 12, 10.0, 5, '{"Rate of change", "Increasing functions", "Decreasing functions", "Maxima", "Minima", "Tangents", "Normals"}'),
('cuet-math-integrals', 'mathematics', '{"CUET"}', 'Calculus', 'Integrals', 7, 12, 12.0, 6, '{"Integration by substitution", "Partial fractions", "By parts", "Definite integrals", "Fundamental theorem"}'),
('cuet-math-applications-integrals', 'mathematics', '{"CUET"}', 'Calculus', 'Applications of Integrals', 8, 12, 8.0, 4, '{"Area under curves", "Area between curves", "Lines", "Circles", "Parabolas", "Ellipses"}'),
('cuet-math-differential-eq', 'mathematics', '{"CUET"}', 'Calculus', 'Differential Equations', 9, 12, 8.0, 4, '{"Order", "Degree", "General solution", "Particular solution", "Variable separable", "Homogeneous", "Linear"}'),

-- Unit IV: Vectors and 3D
('cuet-math-vectors', 'mathematics', '{"CUET"}', '3D Geometry', 'Vectors', 10, 12, 8.0, 4, '{"Magnitude", "Direction cosines", "Types of vectors", "Addition", "Scalar multiplication", "Dot product", "Cross product"}'),
('cuet-math-3d-geometry', 'mathematics', '{"CUET"}', '3D Geometry', 'Three Dimensional Geometry', 11, 12, 8.0, 4, '{"Direction ratios", "Line equations", "Cartesian form", "Vector form", "Skew lines", "Shortest distance"}'),

-- Unit V & VI
('cuet-math-linear-programming', 'mathematics', '{"CUET"}', 'Linear Programming', 'Linear Programming', 12, 12, 6.0, 3, '{"Constraints", "Objective function", "Graphical method", "Feasible region", "Optimal solution"}'),
('cuet-math-probability', 'mathematics', '{"CUET"}', 'Probability', 'Probability', 13, 12, 8.0, 4, '{"Conditional probability", "Multiplication theorem", "Independent events", "Bayes theorem", "Random variable"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ CUET ECONOMICS CHAPTERS (9 units)                                      │
-- └─────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
-- Microeconomics
('cuet-eco-intro-micro', 'economics', '{"CUET"}', 'Microeconomics', 'Introduction to Microeconomics', 1, 12, 5.0, 2, '{"Central economic problems", "Types of economies", "Opportunity cost", "PPC"}'),
('cuet-eco-consumer-demand', 'economics', '{"CUET"}', 'Microeconomics', 'Consumer Behaviour and Demand', 2, 12, 15.0, 7, '{"Utility approach", "Indifference curves", "Budget line", "Law of demand", "Elasticity of demand"}'),
('cuet-eco-producer-supply', 'economics', '{"CUET"}', 'Microeconomics', 'Producer Behaviour and Supply', 3, 12, 15.0, 7, '{"Production function", "Returns to scale", "Cost curves", "Revenue concepts", "Supply"}'),
('cuet-eco-market-price', 'economics', '{"CUET"}', 'Microeconomics', 'Forms of Market and Price Determination', 4, 12, 15.0, 7, '{"Perfect competition", "Monopoly", "Monopolistic competition", "Oligopoly", "Price determination"}'),

-- Macroeconomics
('cuet-eco-national-income', 'economics', '{"CUET"}', 'Macroeconomics', 'National Income and Related Aggregates', 5, 12, 20.0, 10, '{"GDP", "GNP", "NNP", "NDP", "Personal income", "Disposable income", "Calculation methods"}'),
('cuet-eco-money-banking', 'economics', '{"CUET"}', 'Macroeconomics', 'Money and Banking', 6, 12, 15.0, 7, '{"Functions of money", "Commercial banks", "Central bank", "Credit creation", "Monetary policy"}'),
('cuet-eco-income-employment', 'economics', '{"CUET"}', 'Macroeconomics', 'Determination of Income and Employment', 7, 12, 20.0, 10, '{"Aggregate demand", "Aggregate supply", "Consumption function", "Investment multiplier", "Equilibrium"}'),
('cuet-eco-govt-budget', 'economics', '{"CUET"}', 'Macroeconomics', 'Government Budget and the Economy', 8, 12, 5.0, 2, '{"Budget components", "Revenue expenditure", "Capital expenditure", "Deficit types", "Fiscal policy"}'),
('cuet-eco-balance-payments', 'economics', '{"CUET"}', 'Macroeconomics', 'Balance of Payments', 9, 12, 5.0, 2, '{"Current account", "Capital account", "Foreign exchange", "Exchange rate", "Trade deficit"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ CUET BUSINESS STUDIES CHAPTERS (5 units)                               │
-- └─────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-bs-principles-mgmt', 'business-studies', '{"CUET"}', 'Management', 'Principles and Functions of Management', 1, 12, 30.0, 14, '{"Nature of management", "Management principles", "Planning", "Organizing", "Staffing", "Directing", "Controlling"}'),
('cuet-bs-business-finance', 'business-studies', '{"CUET"}', 'Finance', 'Business Finance and Financial Markets', 2, 12, 20.0, 10, '{"Financial management", "Capital structure", "Financial markets", "Stock exchange", "SEBI"}'),
('cuet-bs-marketing', 'business-studies', '{"CUET"}', 'Marketing', 'Marketing Management', 3, 12, 20.0, 10, '{"Marketing functions", "Marketing mix", "Product", "Price", "Place", "Promotion", "Branding"}'),
('cuet-bs-consumer-ethics', 'business-studies', '{"CUET"}', 'Ethics', 'Consumer Protection and Business Ethics', 4, 12, 15.0, 7, '{"Consumer rights", "Consumer Protection Act", "Business ethics", "Corporate governance"}'),
('cuet-bs-entrepreneurship', 'business-studies', '{"CUET"}', 'Entrepreneurship', 'Entrepreneurship Development', 5, 12, 15.0, 7, '{"Entrepreneurship concept", "Functions", "Business plan", "Start-up ecosystem", "Government schemes"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ CUET ACCOUNTANCY CHAPTERS (8 units)                                    │
-- └─────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-acc-npo', 'accountancy', '{"CUET"}', 'Non-Profit', 'Accounting for Not-for-Profit Organizations', 1, 12, 12.0, 6, '{"Receipts and payments", "Income and expenditure", "Balance sheet", "Subscriptions", "Donations"}'),
('cuet-acc-partnership-basics', 'accountancy', '{"CUET"}', 'Partnership', 'Partnership Fundamentals', 2, 12, 10.0, 5, '{"Partnership deed", "Profit sharing", "Interest on capital", "Interest on drawings", "Partner salary"}'),
('cuet-acc-reconstitution', 'accountancy', '{"CUET"}', 'Partnership', 'Reconstitution of Partnership', 3, 12, 25.0, 12, '{"Admission of partner", "Retirement of partner", "Death of partner", "Goodwill treatment", "Revaluation"}'),
('cuet-acc-dissolution', 'accountancy', '{"CUET"}', 'Partnership', 'Dissolution of Partnership Firms', 4, 12, 8.0, 4, '{"Settlement of accounts", "Realization account", "Asset distribution", "Liability payment"}'),
('cuet-acc-share-capital', 'accountancy', '{"CUET"}', 'Company Accounts', 'Accounting for Share Capital', 5, 12, 10.0, 5, '{"Issue of shares", "Allotment", "Forfeiture", "Reissue", "Private placement"}'),
('cuet-acc-debentures', 'accountancy', '{"CUET"}', 'Company Accounts', 'Accounting for Debentures', 6, 12, 8.0, 4, '{"Issue of debentures", "Redemption", "Interest", "Sinking fund"}'),
('cuet-acc-financial-statements', 'accountancy', '{"CUET"}', 'Financial Analysis', 'Financial Statements Analysis', 7, 12, 15.0, 7, '{"Comparative statements", "Common-size statements", "Ratio analysis", "Liquidity ratios", "Profitability ratios"}'),
('cuet-acc-computerized', 'accountancy', '{"CUET"}', 'Technology', 'Computerized Accounting System', 8, 12, 12.0, 5, '{"Accounting software", "Data entry", "Reports generation", "MIS reports", "Tally basics"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ CUET POLITICAL SCIENCE CHAPTERS (18 units)                             │
-- └─────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
-- Politics in India Since Independence (50-55%)
('cuet-pol-nation-building', 'political-science', '{"CUET"}', 'Indian Politics', 'Challenges of Nation-Building', 1, 12, 10.0, 5, '{"Partition", "Integration of princely states", "Nehru vision", "National integration"}'),
('cuet-pol-one-party', 'political-science', '{"CUET"}', 'Indian Politics', 'Era of One-Party Dominance', 2, 12, 8.0, 4, '{"Congress system", "Opposition parties", "Electoral trends", "Dominant party system"}'),
('cuet-pol-planned-dev', 'political-science', '{"CUET"}', 'Indian Politics', 'Politics of Planned Development', 3, 12, 8.0, 4, '{"Five-Year Plans", "Land reforms", "Green Revolution", "Industrial policy"}'),
('cuet-pol-external-relations', 'political-science', '{"CUET"}', 'Indian Politics', 'Indias External Relations', 4, 12, 10.0, 5, '{"Nehru foreign policy", "NAM", "India-China relations", "India-Pakistan wars"}'),
('cuet-pol-congress-challenges', 'political-science', '{"CUET"}', 'Indian Politics', 'Challenges to Congress System', 5, 12, 9.0, 4, '{"Congress split", "JP Movement", "Emergency 1975-77", "Restoration"}'),
('cuet-pol-democratic-crisis', 'political-science', '{"CUET"}', 'Indian Politics', 'Crisis of Democratic Order', 6, 12, 9.0, 4, '{"Emergency impact", "Civil liberties", "Judiciary role", "Press freedom"}'),
('cuet-pol-regional', 'political-science', '{"CUET"}', 'Indian Politics', 'Regional Aspirations and Conflicts', 7, 12, 10.0, 5, '{"Punjab accord", "Assam movement", "Kashmir issue", "Northeast insurgency"}'),
('cuet-pol-popular-movements', 'political-science', '{"CUET"}', 'Indian Politics', 'Rise of Popular Movements', 8, 12, 8.0, 4, '{"Farmers movements", "Women movements", "Environmental movements", "Anti-corruption"}'),
('cuet-pol-recent-dev', 'political-science', '{"CUET"}', 'Indian Politics', 'Recent Developments in Indian Politics', 9, 12, 12.0, 6, '{"Coalition politics", "Economic reforms", "Mandal Commission", "Communalism"}'),

-- Contemporary World Politics (35-40%)
('cuet-pol-cold-war', 'political-science', '{"CUET"}', 'World Politics', 'Cold War Era', 10, 12, 12.0, 6, '{"Origin", "NATO", "Warsaw Pact", "Cuban missile crisis", "Vietnam War"}'),
('cuet-pol-second-world', 'political-science', '{"CUET"}', 'World Politics', 'End of Bipolarity', 11, 12, 10.0, 5, '{"USSR collapse", "Soviet disintegration", "Shock therapy", "Consequences"}'),
('cuet-pol-us-hegemony', 'political-science', '{"CUET"}', 'World Politics', 'US Hegemony in World Politics', 12, 12, 9.0, 4, '{"Operation Desert Storm", "9/11", "War on Terror", "Iraq invasion"}'),
('cuet-pol-alternative-centers', 'political-science', '{"CUET"}', 'World Politics', 'Alternative Centers of Power', 13, 12, 10.0, 5, '{"European Union", "ASEAN", "China rise", "BRICS"}'),
('cuet-pol-south-asia', 'political-science', '{"CUET"}', 'World Politics', 'South Asia in Post-Cold War Era', 14, 12, 8.0, 4, '{"SAARC", "India-Pakistan", "India-Bangladesh", "Nepal", "Sri Lanka"}'),
('cuet-pol-intl-orgs', 'political-science', '{"CUET"}', 'World Politics', 'International Organizations', 15, 12, 9.0, 4, '{"UN reform", "Security Council", "IMF", "World Bank", "WTO"}'),
('cuet-pol-security', 'political-science', '{"CUET"}', 'World Politics', 'Security in Contemporary World', 16, 12, 9.0, 4, '{"Traditional security", "Non-traditional security", "Terrorism", "Global security"}'),
('cuet-pol-environment', 'political-science', '{"CUET"}', 'World Politics', 'Environment and Natural Resources', 17, 12, 8.0, 4, '{"Global commons", "Climate change", "Rio summit", "Kyoto protocol"}'),
('cuet-pol-globalization', 'political-science', '{"CUET"}', 'World Politics', 'Globalization', 18, 12, 10.0, 5, '{"Economic globalization", "Cultural impact", "Critics", "Anti-globalization movements"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ CUET COMPUTER SCIENCE CHAPTERS (5 units)                               │
-- └─────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-cs-python', 'computer-science', '{"CUET"}', 'Programming', 'Python Programming and File Handling', 1, 12, 38.0, 19, '{"Functions", "Recursion", "File handling", "Text files", "Binary files", "Lists", "Tuples", "Dictionaries"}'),
('cuet-cs-sql', 'computer-science', '{"CUET"}', 'Database', 'SQL and Database Management', 2, 12, 23.0, 11, '{"SQL queries", "SELECT", "INSERT", "UPDATE", "DELETE", "Joins", "Keys", "Constraints", "Normalization"}'),
('cuet-cs-networks', 'computer-science', '{"CUET"}', 'Networking', 'Computer Networks and Cybersecurity', 3, 12, 18.0, 9, '{"TCP/IP", "HTTP", "DNS", "Network protocols", "Encryption", "Firewalls", "Malware", "Cybersecurity basics"}'),
('cuet-cs-data-structures', 'computer-science', '{"CUET"}', 'Data Structures', 'Data Structures and Algorithms', 4, 12, 13.0, 6, '{"Stacks", "Queues", "Linked lists", "Binary search", "Bubble sort", "Quick sort", "Time complexity"}'),
('cuet-cs-societal', 'computer-science', '{"CUET"}', 'Ethics', 'Societal Impacts of Computing', 5, 12, 8.0, 4, '{"Digital footprint", "Privacy", "IPR", "Copyright", "Open source", "AI ethics", "Cyber laws"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ CUET ENVIRONMENTAL STUDIES CHAPTERS (7 units)                          │
-- └─────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-evs-human-nature', 'environmental-studies', '{"CUET"}', 'Ecology', 'Human Beings and Nature', 1, 12, 14.0, 7, '{"Deep ecology", "Shallow ecology", "Stewardship", "Social ecology", "Eco-feminism", "Green politics", "Sustainable development"}'),
('cuet-evs-population', 'environmental-studies', '{"CUET"}', 'Ecology', 'Population and Conservation Ecology', 2, 12, 16.0, 8, '{"Population dynamics", "Malthusian model", "Demographic transition", "Conservation", "Project Tiger", "Wildlife sanctuaries"}'),
('cuet-evs-pollution', 'environmental-studies', '{"CUET"}', 'Pollution', 'Monitoring Pollution', 3, 12, 16.0, 8, '{"Air quality monitoring", "Water testing", "Soil testing", "BOD", "COD", "NAAQM", "Pollution standards"}'),
('cuet-evs-third-world', 'environmental-studies', '{"CUET"}', 'Development', 'Third World Development', 4, 12, 14.0, 7, '{"Urbanization", "Push-pull factors", "Gandhian approach", "Urban planning", "Sanitation", "Water management"}'),
('cuet-evs-agriculture', 'environmental-studies', '{"CUET"}', 'Agriculture', 'Sustainable Agriculture', 5, 12, 14.0, 7, '{"Traditional farming", "Green Revolution", "Organic farming", "Food security", "Land reforms", "IPM"}'),
('cuet-evs-economics', 'environmental-studies', '{"CUET"}', 'Economics', 'Environmental Economics', 6, 12, 12.0, 6, '{"Natural resource accounting", "GDP vs GNP", "Externalities", "Cost-benefit analysis", "Natural capital"}'),
('cuet-evs-international', 'environmental-studies', '{"CUET"}', 'International', 'International Relations and Environment', 7, 12, 14.0, 7, '{"Amazonia case", "Ivory trade", "Ozone depletion", "WTO", "GATT", "Globalization impact", "International aid"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ CUET AGRICULTURE CHAPTERS (4 units)                                    │
-- └─────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-agri-agrometeorology', 'agriculture', '{"CUET"}', 'Basic Sciences', 'Agrometeorology, Biochemistry, Microbiology and Genetics', 1, 12, 25.0, 12, '{"Weather patterns", "Climate change", "Plant enzymes", "Photosynthesis", "Soil microbes", "Nitrogen fixation", "Plant breeding", "Hybrid varieties"}'),
('cuet-agri-livestock', 'agriculture', '{"CUET"}', 'Animal Science', 'Livestock Production', 2, 12, 25.0, 12, '{"Dairy farming", "Poultry farming", "Animal nutrition", "Breeding techniques", "Disease management", "Vaccination"}'),
('cuet-agri-crop-production', 'agriculture', '{"CUET"}', 'Crop Science', 'Crop Production', 3, 12, 25.0, 12, '{"Crop rotation", "Intercropping", "Irrigation practices", "Nutrient management", "Pest control", "IPM", "Fertilizers"}'),
('cuet-agri-horticulture', 'agriculture', '{"CUET"}', 'Horticulture', 'Horticulture', 4, 12, 25.0, 12, '{"Fruit production", "Vegetable cultivation", "Floriculture", "Post-harvest management", "Storage techniques", "Propagation methods"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ CUET SOCIOLOGY CHAPTERS (10 units)                                     │
-- └─────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-soc-structure', 'sociology', '{"CUET"}', 'Indian Society', 'Structure of Indian Society', 1, 12, 12.0, 6, '{"Colonialism", "Nationalism", "Demographics", "Rural-urban linkages", "Class and community"}'),
('cuet-soc-institutions', 'sociology', '{"CUET"}', 'Indian Society', 'Social Institutions', 2, 12, 12.0, 6, '{"Family", "Kinship", "Caste system", "Tribal society", "Market as institution"}'),
('cuet-soc-inequality', 'sociology', '{"CUET"}', 'Indian Society', 'Social Inequality and Exclusion', 3, 12, 12.0, 6, '{"Caste prejudice", "SC/OBC", "Tribal marginalization", "Women equality", "Religious minorities", "Differently-abled"}'),
('cuet-soc-diversity', 'sociology', '{"CUET"}', 'Indian Society', 'Challenges of Unity in Diversity', 4, 12, 10.0, 5, '{"Communalism", "Regionalism", "Casteism", "Patriarchy", "State role in plural society"}'),
('cuet-soc-structural-change', 'sociology', '{"CUET"}', 'Social Change', 'Process of Social Change', 5, 12, 10.0, 5, '{"Colonialism impact", "Industrialization", "Urbanization", "Modernization", "Westernization", "Sanskritization"}'),
('cuet-soc-polity', 'sociology', '{"CUET"}', 'Social Change', 'Social Change and Polity', 6, 12, 10.0, 5, '{"Constitution as instrument", "Political parties", "Pressure groups", "Panchayati Raj"}'),
('cuet-soc-economy', 'sociology', '{"CUET"}', 'Social Change', 'Social Change and Economy', 7, 12, 10.0, 5, '{"Land reforms", "Green Revolution", "Liberalization", "Class structure changes"}'),
('cuet-soc-arenas', 'sociology', '{"CUET"}', 'Social Change', 'Arenas of Social Change', 8, 12, 8.0, 4, '{"Media impact", "Globalization effects", "Information technology"}'),
('cuet-soc-movements', 'sociology', '{"CUET"}', 'Social Movements', 'Social Movements', 9, 12, 12.0, 6, '{"Workers movements", "Peasant movements", "Dalit movement", "Women movements", "Tribal movements", "Environmental movements"}'),
('cuet-soc-new-arenas', 'sociology', '{"CUET"}', 'Contemporary', 'New Arenas of Social Change', 10, 12, 4.0, 2, '{"Digital divide", "New media", "Social networking", "Cyber culture"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ CUET PHYSICAL EDUCATION CHAPTERS (9 units)                             │
-- └─────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-pe-sociological', 'physical-education', '{"CUET"}', 'Theory', 'Sociological Aspects of Physical Education', 1, 12, 10.0, 5, '{"Games as heritage", "Individual development", "National integration", "Personality development"}'),
('cuet-pe-training', 'physical-education', '{"CUET"}', 'Training', 'Training Methods', 2, 12, 14.0, 7, '{"Sports training", "Repetition method", "Continuous training", "Fartlek", "Interval training", "Circuit training", "Weight training"}'),
('cuet-pe-career', 'physical-education', '{"CUET"}', 'Career', 'Career Aspects in Physical Education', 3, 12, 10.0, 5, '{"Career options", "NSNIS", "SAI", "IOC", "IOA", "Sports institutions"}'),
('cuet-pe-tournaments', 'physical-education', '{"CUET"}', 'Sports', 'Tournaments', 4, 12, 10.0, 5, '{"Tournament types", "Knock-out", "League", "Seeding", "Byes", "Intramural", "Extramural"}'),
('cuet-pe-health', 'physical-education', '{"CUET"}', 'Health', 'Health Education and Health Problems', 5, 12, 14.0, 7, '{"Health definition", "Communicable diseases", "Posture", "Personal hygiene", "Substance abuse", "WADA", "NADA"}'),
('cuet-pe-injuries', 'physical-education', '{"CUET"}', 'First Aid', 'Sports Injuries and First Aid', 6, 12, 12.0, 6, '{"Sports injuries", "Soft tissue injuries", "Fractures", "First aid", "CPR", "RICE method"}'),
('cuet-pe-testing', 'physical-education', '{"CUET"}', 'Measurement', 'Test and Measurement in Sports', 7, 12, 10.0, 5, '{"Motor fitness test", "Harvard step test", "Barrow test", "Senior citizen fitness test"}'),
('cuet-pe-biomechanics', 'physical-education', '{"CUET"}', 'Science', 'Biomechanics and Sports', 8, 12, 10.0, 5, '{"Biomechanics basics", "Movement types", "Newton laws in sports", "Friction in sports"}'),
('cuet-pe-psychology', 'physical-education', '{"CUET"}', 'Psychology', 'Psychology and Sports', 9, 12, 10.0, 5, '{"Personality types", "Sheldon classification", "Big Five theory", "Motivation", "Exercise adherence", "Aggression in sports"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ CUET ENGINEERING GRAPHICS CHAPTERS (7 units)                           │
-- └─────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-eg-isometric-basic', 'engineering-graphics', '{"CUET"}', 'Projection', 'Isometric Projection - Basic Solids', 1, 12, 20.0, 10, '{"Isometric scale", "Cube", "Prisms", "Pyramids", "Cone", "Cylinder", "Sphere", "Hemisphere"}'),
('cuet-eg-isometric-combo', 'engineering-graphics', '{"CUET"}', 'Projection', 'Isometric Projection - Combination', 2, 12, 15.0, 7, '{"Two solids combination", "Centrally placed solids", "Axis orientation"}'),
('cuet-eg-threads-bolts', 'engineering-graphics', '{"CUET"}', 'Machine Drawing', 'Machine Parts - Threads and Bolts', 3, 12, 18.0, 9, '{"Thread profiles", "Square thread", "BSW", "Metric thread", "Bolts", "Nuts", "Washers"}'),
('cuet-eg-studs-rivets', 'engineering-graphics', '{"CUET"}', 'Machine Drawing', 'Machine Parts - Studs and Rivets', 4, 12, 12.0, 6, '{"Thread representation", "Stud types", "Rivet types", "Snap head", "Flat head", "Counter sunk"}'),
('cuet-eg-bearings', 'engineering-graphics', '{"CUET"}', 'Assembly', 'Bearings', 5, 12, 12.0, 6, '{"Open bearing", "Bush bearing", "Assembly drawing", "Disassembly"}'),
('cuet-eg-rod-joints', 'engineering-graphics', '{"CUET"}', 'Assembly', 'Rod Joints', 6, 12, 12.0, 6, '{"Cotter joints", "Sleeve and cotter", "Gib and cotter", "Round rod joints", "Square rod joints"}'),
('cuet-eg-pipe-joints', 'engineering-graphics', '{"CUET"}', 'Assembly', 'Tie-rod and Pipe Joints', 7, 12, 11.0, 5, '{"Turnbuckle", "Flange pipe joints", "Assembly views"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ CUET KNOWLEDGE TRADITIONS CHAPTERS (8 units)                           │
-- └─────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-kt-agriculture', 'knowledge-traditions', '{"CUET"}', 'Science', 'Agriculture - A Survey', 1, 12, 12.0, 6, '{"Traditional agriculture", "Irrigation systems", "Crop varieties", "Soil fertility", "Cattle management"}'),
('cuet-kt-architecture-early', 'knowledge-traditions', '{"CUET"}', 'Architecture', 'Architecture - Early and Classical', 2, 12, 12.0, 6, '{"Temple architecture", "Rock-cut structures", "Monolithic temples", "Public architecture"}'),
('cuet-kt-architecture-medieval', 'knowledge-traditions', '{"CUET"}', 'Architecture', 'Architecture - Medieval and Colonial', 3, 12, 12.0, 6, '{"Fort architecture", "Palace architecture", "Mosques", "Mausoleums", "Colonial architecture"}'),
('cuet-kt-dance', 'knowledge-traditions', '{"CUET"}', 'Performing Arts', 'Dance - A Survey', 4, 12, 14.0, 7, '{"Bharatanatyam", "Kathakali", "Kathak", "Kuchipudi", "Manipuri", "Odissi", "Folk dances"}'),
('cuet-kt-education', 'knowledge-traditions', '{"CUET"}', 'Education', 'Education Systems and Practices', 5, 12, 12.0, 6, '{"Gurukulas", "Viharas", "Universities", "Nalanda", "Teacher-student traditions", "Physical education"}'),
('cuet-kt-ethics', 'knowledge-traditions', '{"CUET"}', 'Philosophy', 'Ethics - Individual and Social', 6, 12, 12.0, 6, '{"Buddhist ethics", "Jain ethics", "Sikh ethics", "Bhakti movement", "Asoka edicts", "Kural"}'),
('cuet-kt-martial-arts', 'knowledge-traditions', '{"CUET"}', 'Physical', 'Martial Arts Traditions', 7, 12, 12.0, 6, '{"Kalaripayattu", "Wrestling", "Stick combat", "Marmasastram", "Traditional texts"}'),
('cuet-kt-language-tech', 'knowledge-traditions', '{"CUET"}', 'Science', 'Language, Grammar and Technologies', 8, 12, 14.0, 7, '{"Indian languages", "Grammar tradition", "Harappan tech", "Water management", "Textile tech", "Metallurgy"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ CUET TEACHING APTITUDE CHAPTERS (7 units)                              │
-- └─────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-ta-narratives', 'teaching-aptitude', '{"CUET"}', 'Education', 'School Narratives and Reports', 1, 12, 14.0, 7, '{"Gender in education", "School access", "Teacher work", "Student assessment", "Data analysis"}'),
('cuet-ta-media', 'teaching-aptitude', '{"CUET"}', 'Education', 'Education in Films and Books', 2, 12, 14.0, 7, '{"Educational films", "Documentaries", "Struggles in education", "Girls education", "Tribal education"}'),
('cuet-ta-science', 'teaching-aptitude', '{"CUET"}', 'Science', 'Science Education', 3, 12, 14.0, 7, '{"Natural phenomena", "Indian scientists", "Women scientists", "Science programs", "Technology in education"}'),
('cuet-ta-mathematics', 'teaching-aptitude', '{"CUET"}', 'Mathematics', 'Mathematics Education', 4, 12, 14.0, 7, '{"Sense of proportion", "Mathematical abilities", "Famous mathematicians", "Learning difficulties in math"}'),
('cuet-ta-arts', 'teaching-aptitude', '{"CUET"}', 'Arts', 'Arts, Music and Drama', 5, 12, 14.0, 7, '{"Art academies", "Benefits of arts", "Indian art traditions", "Music traditions", "Performing arts"}'),
('cuet-ta-social-science', 'teaching-aptitude', '{"CUET"}', 'Social Science', 'Social Sciences', 6, 12, 14.0, 7, '{"Teaching difficulties", "Social science subjects", "Nobel laureates", "Historical teachers", "Buddha", "Jain teachers"}'),
('cuet-ta-language', 'teaching-aptitude', '{"CUET"}', 'Language', 'Language and Literature', 7, 12, 16.0, 8, '{"NCERT stories", "Famous literature", "Biographies", "School experiences", "Grammar teaching", "Poetry teaching"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ CUET HISTORY CHAPTERS (4 units)                                        │
-- └─────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-hist-ancient', 'history', '{"CUET"}', 'Ancient India', 'Ancient India', 1, 12, 25.0, 12, '{"Indus Valley", "Vedic period", "Mauryan empire", "Gupta dynasty", "Buddhism", "Jainism"}'),
('cuet-hist-medieval', 'history', '{"CUET"}', 'Medieval India', 'Medieval India', 2, 12, 25.0, 12, '{"Delhi Sultanate", "Mughal Empire", "Bhakti movement", "Sufi tradition", "Vijayanagara"}'),
('cuet-hist-modern', 'history', '{"CUET"}', 'Modern India', 'Modern India', 3, 12, 30.0, 15, '{"Colonial rule", "1857 revolt", "Freedom struggle", "Gandhi", "Partition", "Constitution"}'),
('cuet-hist-world', 'history', '{"CUET"}', 'World History', 'World History', 4, 12, 20.0, 10, '{"French Revolution", "Industrial Revolution", "World Wars", "Cold War", "Decolonization"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ CUET GEOGRAPHY CHAPTERS (4 units)                                      │
-- └─────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-geo-physical', 'geography', '{"CUET"}', 'Physical', 'Physical Geography', 1, 12, 30.0, 15, '{"Geomorphology", "Climatology", "Hydrology", "Soils", "Biogeography"}'),
('cuet-geo-human', 'geography', '{"CUET"}', 'Human', 'Human Geography', 2, 12, 30.0, 15, '{"Population", "Migration", "Settlements", "Urbanization", "Economic activities"}'),
('cuet-geo-india', 'geography', '{"CUET"}', 'Regional', 'Geography of India', 3, 12, 25.0, 12, '{"Physical features", "Climate", "Drainage", "Resources", "Agriculture", "Industries"}'),
('cuet-geo-practical', 'geography', '{"CUET"}', 'Practical', 'Practical Geography', 4, 12, 15.0, 7, '{"Map reading", "Map interpretation", "Topographical maps", "Statistical data"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ CUET PSYCHOLOGY CHAPTERS (5 units)                                     │
-- └─────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-psy-basics', 'psychology', '{"CUET"}', 'Foundations', 'Foundations of Psychology', 1, 12, 25.0, 12, '{"Schools of psychology", "Research methods", "Biological basis", "Consciousness"}'),
('cuet-psy-development', 'psychology', '{"CUET"}', 'Development', 'Human Development', 2, 12, 20.0, 10, '{"Stages of development", "Cognitive development", "Social development", "Moral development"}'),
('cuet-psy-individual-diff', 'psychology', '{"CUET"}', 'Individual', 'Individual Differences', 3, 12, 20.0, 10, '{"Intelligence", "Aptitude", "Personality", "Self concept", "Creativity"}'),
('cuet-psy-mental-health', 'psychology', '{"CUET"}', 'Health', 'Mental Health and Disorders', 4, 12, 20.0, 10, '{"Stress", "Coping", "Psychological disorders", "Therapy", "Mental well-being"}'),
('cuet-psy-social', 'psychology', '{"CUET"}', 'Social', 'Social Psychology', 5, 12, 15.0, 7, '{"Social cognition", "Attitudes", "Group behavior", "Prosocial behavior", "Aggression"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ════════════════════════════════════════════════════════════════════════════
-- END OF CONSOLIDATED MIGRATION
-- ════════════════════════════════════════════════════════════════════════════
