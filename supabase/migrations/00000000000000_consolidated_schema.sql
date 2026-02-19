-- ════════════════════════════════════════════════════════════════════════════
-- VaNi — Consolidated Database Schema
-- ════════════════════════════════════════════════════════════════════════════
--
-- This single migration bootstraps the ENTIRE VaNi database from scratch
-- on a fresh Supabase project. It consolidates all individual migrations
-- into one file, run in correct dependency order.
--
-- How to use:
--   1. Create a new Supabase project
--   2. Open SQL Editor in the dashboard
--   3. Paste this entire file and click Run
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

create trigger med_profiles_updated_at
  before update on med_profiles
  for each row execute function public.update_updated_at();

-- RLS
alter table med_profiles enable row level security;

create policy "Users can read own profile"
  on med_profiles for select using (auth.uid() = id);
create policy "Users can insert own profile"
  on med_profiles for insert with check (auth.uid() = id);
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

create policy "Users can read own subjects"
  on med_user_subjects for select using (auth.uid() = user_id);
create policy "Users can insert own subjects"
  on med_user_subjects for insert with check (auth.uid() = user_id);
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

create policy "Users can read own referral code"
  on med_referral_codes for select using (auth.uid() = user_id);
create policy "Users can create own referral code"
  on med_referral_codes for insert with check (auth.uid() = user_id);
create policy "Anyone can look up a code to join"
  on med_referral_codes for select using (used_by is null);
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

-- CUET subjects
insert into med_subjects (id, name, emoji, color, category, exam_id, sort_order) values
  ('cuet-physics',    'Physics',            '⚛️', '#3B82F6', 'Science',           'CUET', 10),
  ('cuet-chemistry',  'Chemistry',          '🧪', '#F97316', 'Science',           'CUET', 11),
  ('mathematics',     'Mathematics',        '📏', '#EF4444', 'Science',           'CUET', 12),
  ('biology',         'Biology / Biotech',  '🧬', '#22C55E', 'Science',           'CUET', 13),
  ('agriculture',     'Agriculture',        '🌾', '#22C55E', 'Science',           'CUET', 14),
  ('engineering-graphics', 'Engineering Graphics', '📐', '#6366F1', 'Science',    'CUET', 15),
  ('accountancy',     'Accountancy',        '📊', '#14B8A6', 'Commerce',          'CUET', 20),
  ('business-studies','Business Studies',    '💼', '#8B5CF6', 'Commerce',          'CUET', 21),
  ('economics',       'Economics',          '💹', '#F59E0B', 'Commerce',          'CUET', 22),
  ('entrepreneurship','Entrepreneurship',   '🚀', '#0EA5E9', 'Commerce',          'CUET', 23),
  ('history',         'History',            '🏛️', '#92400E', 'Arts / Humanities', 'CUET', 30),
  ('geography',       'Geography',          '🌍', '#059669', 'Arts / Humanities', 'CUET', 31),
  ('political-science','Political Science', '🗳️', '#6366F1', 'Arts / Humanities', 'CUET', 32),
  ('sociology',       'Sociology',          '👥', '#EC4899', 'Arts / Humanities', 'CUET', 33),
  ('psychology',      'Psychology',         '🧠', '#F472B6', 'Arts / Humanities', 'CUET', 34),
  ('philosophy',      'Philosophy',         '💡', '#A78BFA', 'Arts / Humanities', 'CUET', 35),
  ('anthropology',    'Anthropology',       '🔬', '#78716C', 'Arts / Humanities', 'CUET', 36),
  ('knowledge-traditions', 'Knowledge Traditions', '📜', '#D97706', 'Arts / Humanities', 'CUET', 37),
  ('legal-studies',   'Legal Studies',      '⚖️', '#7C3AED', 'Arts / Humanities', 'CUET', 38),
  ('computer-science',      'Computer Science',      '💻', '#0EA5E9', 'Other', 'CUET', 40),
  ('environmental-studies', 'Environmental Studies', '🌿', '#16A34A', 'Other', 'CUET', 41),
  ('physical-education',    'Physical Education',    '🏃', '#EA580C', 'Other', 'CUET', 42),
  ('fine-arts',             'Fine Arts',             '🎨', '#DB2777', 'Other', 'CUET', 43),
  ('home-science',          'Home Science',          '🏠', '#D97706', 'Other', 'CUET', 44),
  ('mass-media',            'Mass Media / Journalism','📰', '#4F46E5', 'Other', 'CUET', 45),
  ('teaching-aptitude',     'Teaching Aptitude',     '👨‍🏫', '#EC4899', 'Other', 'CUET', 46),
  ('performing-arts',       'Performing Arts',       '🎭', '#F43F5E', 'Other', 'CUET', 47),
  ('sanskrit',              'Sanskrit',              '🕉️', '#CA8A04', 'Other', 'CUET', 48),
  ('general-test',   'General Test',       '🗒️', '#64748B', 'General Test',      'CUET', 50)
on conflict (id) do nothing;

alter table med_subjects enable row level security;
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
  ('en', 'English', 'English', '🇬🇧', 'Questions, explanations & UI in English', 1),
  ('te', 'Telugu',  'తెలుగు',  '🇮🇳', 'Questions & explanations in Telugu, UI in English', 2)
on conflict (id) do nothing;

alter table med_languages enable row level security;
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
  class_level       int,
  weightage         decimal(4,1) default 0,
  avg_questions     int default 0,
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
  option_key        text not null,
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
  option_key        text not null,
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


-- ── 4.6 med_generation_jobs ────────────────────────────────────────────────

create table if not exists med_generation_jobs (
  id                uuid primary key default gen_random_uuid(),
  subject_id        text not null,
  chapter_id        text,
  topic_id          text,
  exam_ids          text[] default '{"NEET"}',
  config            jsonb default '{}',
  output_json       jsonb,
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
  total_in_bank       integer not null default 0,
  unique_attempted    integer not null default 0,
  total_answered      integer not null default 0,
  correct_count       integer not null default 0,
  coverage            numeric(5,2) default 0,
  accuracy            numeric(5,2) default 0,
  last_practiced_at   timestamptz,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now(),
  unique (user_id, chapter_id)
);

create index if not exists idx_med_chapter_progress_user
  on med_chapter_progress (user_id);
create index if not exists idx_med_chapter_progress_subject
  on med_chapter_progress (user_id, subject_id);

alter table med_chapter_progress enable row level security;

create policy "Users can read own chapter progress"
  on med_chapter_progress for select using (auth.uid() = user_id);
create policy "Users can insert own chapter progress"
  on med_chapter_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own chapter progress"
  on med_chapter_progress for update using (auth.uid() = user_id);

create trigger med_chapter_progress_updated_at
  before update on med_chapter_progress
  for each row execute function public.update_updated_at();

-- Recalculate coverage and accuracy on insert/update
create or replace function recalculate_chapter_metrics()
returns trigger
language plpgsql
as $$
begin
  if new.total_in_bank > 0 then
    new.coverage := (new.unique_attempted::numeric / new.total_in_bank) * 100;
  else
    new.coverage := 0;
  end if;
  if new.total_answered > 0 then
    new.accuracy := (new.correct_count::numeric / new.total_answered) * 100;
  else
    new.accuracy := 0;
  end if;
  return new;
end;
$$;

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
  easy_pct        integer not null default 30,
  medium_pct      integer not null default 50,
  hard_pct        integer not null default 20,
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
  easy_pct        integer not null default 30,
  medium_pct      integer not null default 50,
  hard_pct        integer not null default 20,
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

create policy "Users can read own question mix"
  on med_user_question_mix for select using (auth.uid() = user_id);

create trigger med_user_question_mix_updated_at
  before update on med_user_question_mix
  for each row execute function public.update_updated_at();


-- ════════════════════════════════════════════════════════════════════════════
-- SEED DATA: NEET CHAPTERS
-- ════════════════════════════════════════════════════════════════════════════

-- PHYSICS CHAPTERS (20)
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
on conflict (id) do update set name = excluded.name, weightage = excluded.weightage, avg_questions = excluded.avg_questions, important_topics = excluded.important_topics;

-- CHEMISTRY CHAPTERS (20)
insert into med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) values
('chem-basic-concepts', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Some Basic Concepts of Chemistry', 1, 11, 4.4, 2, '{"Mole concept", "Stoichiometry", "Empirical formula", "Limiting reagent"}'),
('chem-atomic-structure', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Structure of Atom', 2, 11, 4.4, 2, '{"Bohr model", "Quantum numbers", "Electronic configuration", "Aufbau principle"}'),
('chem-chemical-bonding', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Chemical Bonding and Molecular Structure', 3, 11, 4.4, 2, '{"VSEPR", "Hybridization", "MO theory", "Hydrogen bonding"}'),
('chem-thermodynamics', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Thermodynamics', 4, 11, 2.2, 1, '{"Enthalpy", "Hess law", "Gibbs energy", "Spontaneity"}'),
('chem-equilibrium', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Equilibrium', 5, 11, 6.7, 3, '{"Le Chatelier principle", "Buffer solutions", "Solubility product", "pH calculations"}'),
('chem-redox', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Redox Reactions', 6, 11, 2.2, 1, '{"Oxidation number", "Balancing redox", "Electrochemical series"}'),
('chem-solutions', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Solutions', 7, 12, 6.7, 3, '{"Raoult law", "Colligative properties", "van t Hoff factor", "Osmosis"}'),
('chem-electrochemistry', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Electrochemistry', 8, 12, 2.2, 1, '{"Nernst equation", "Conductivity", "Fuel cells", "Corrosion"}'),
('chem-kinetics', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Chemical Kinetics', 9, 12, 6.7, 3, '{"Rate law", "Order", "Arrhenius equation", "Activation energy"}'),
('chem-periodicity', 'chemistry', '{"NEET"}', 'Inorganic Chemistry', 'Classification of Elements and Periodicity', 10, 11, 4.4, 2, '{"Periodic trends", "Ionization energy", "Electron affinity", "Electronegativity"}'),
('chem-p-block', 'chemistry', '{"NEET"}', 'Inorganic Chemistry', 'p-Block Elements', 11, 12, 4.4, 2, '{"Group 13-18", "Oxides", "Halides", "Interhalogen compounds"}'),
('chem-d-f-block', 'chemistry', '{"NEET"}', 'Inorganic Chemistry', 'd- and f-Block Elements', 12, 12, 2.2, 1, '{"Transition elements", "KMnO4", "K2Cr2O7", "Lanthanoid contraction"}'),
('chem-coordination', 'chemistry', '{"NEET"}', 'Inorganic Chemistry', 'Coordination Compounds', 13, 12, 8.9, 4, '{"Werner theory", "Isomerism", "VBT", "CFT", "Nomenclature"}'),
('chem-organic-basics', 'chemistry', '{"NEET"}', 'Organic Chemistry', 'Organic Chemistry: Basic Principles', 14, 11, 8.9, 4, '{"IUPAC nomenclature", "Isomerism", "Electronic effects", "Reaction mechanisms"}'),
('chem-hydrocarbons', 'chemistry', '{"NEET"}', 'Organic Chemistry', 'Hydrocarbons', 15, 11, 6.7, 3, '{"Alkanes", "Alkenes", "Alkynes", "Aromatic compounds", "Friedel-Crafts"}'),
('chem-haloalkanes', 'chemistry', '{"NEET"}', 'Organic Chemistry', 'Haloalkanes and Haloarenes', 16, 12, 4.4, 2, '{"SN1 SN2", "Elimination", "Grignard reagent"}'),
('chem-alcohols-ethers', 'chemistry', '{"NEET"}', 'Organic Chemistry', 'Alcohols, Phenols and Ethers', 17, 12, 2.2, 1, '{"Preparation", "Reactions", "Acidic nature of phenols"}'),
('chem-aldehydes-ketones', 'chemistry', '{"NEET"}', 'Organic Chemistry', 'Aldehydes, Ketones and Carboxylic Acids', 18, 12, 6.7, 3, '{"Nucleophilic addition", "Aldol", "Cannizzaro", "Acidic strength"}'),
('chem-amines', 'chemistry', '{"NEET"}', 'Organic Chemistry', 'Amines', 19, 12, 4.4, 2, '{"Basicity", "Diazonium salts", "Coupling reactions"}'),
('chem-biomolecules', 'chemistry', '{"NEET"}', 'Organic Chemistry', 'Biomolecules', 20, 12, 4.4, 2, '{"Carbohydrates", "Proteins", "Nucleic acids", "Vitamins"}')
on conflict (id) do update set name = excluded.name, weightage = excluded.weightage, avg_questions = excluded.avg_questions, important_topics = excluded.important_topics;

-- BOTANY CHAPTERS (17)
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
on conflict (id) do update set name = excluded.name, weightage = excluded.weightage, avg_questions = excluded.avg_questions, important_topics = excluded.important_topics;

-- ZOOLOGY CHAPTERS (15)
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
on conflict (id) do update set name = excluded.name, weightage = excluded.weightage, avg_questions = excluded.avg_questions, important_topics = excluded.important_topics;


-- ════════════════════════════════════════════════════════════════════════════
-- SEED DATA: NEET TOPICS (see 20250205_create_question_bank.sql for full list)
-- Only key topics shown here — run the original migration for all topics.
-- The full topic seed data is in the original question_bank migration file.
-- ════════════════════════════════════════════════════════════════════════════

-- NOTE: The complete topic seed data is very large (750+ rows).
-- It is preserved in the original migration file:
--   supabase/migrations/20250205_create_question_bank.sql
-- Run that file's topic INSERT section after this consolidated migration
-- if you need all topics. The schema above creates the tables correctly.


-- ════════════════════════════════════════════════════════════════════════════
-- SEED DATA: CUET CHAPTERS (from 20250207_add_cuet_chapters.sql)
-- ════════════════════════════════════════════════════════════════════════════

-- Update NEET chapters that overlap with CUET
UPDATE med_chapters SET exam_ids = '{"NEET", "CUET"}'
WHERE subject_id = 'physics' AND id IN (
  'phy-electrostatics', 'phy-current-electricity', 'phy-magnetic-effects',
  'phy-em-induction', 'phy-em-waves', 'phy-optics', 'phy-dual-nature',
  'phy-atoms-nuclei', 'phy-electronic-devices'
);

UPDATE med_chapters SET exam_ids = '{"NEET", "CUET"}'
WHERE subject_id = 'chemistry' AND id IN (
  'chem-solutions', 'chem-electrochemistry', 'chem-kinetics',
  'chem-d-f-block', 'chem-coordination', 'chem-haloalkanes',
  'chem-alcohols-ethers', 'chem-aldehydes-ketones', 'chem-amines',
  'chem-biomolecules'
);

-- CUET Biology chapters (13)
INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-bio-sexual-repro-plants', 'biology', '{"CUET"}', 'Reproduction', 'Sexual Reproduction in Flowering Plants', 1, 12, 8.0, 4, '{"Flower structure", "Gametophyte development", "Pollination types", "Double fertilization", "Embryo development", "Apomixis", "Parthenocarpy"}'),
('cuet-bio-human-repro', 'biology', '{"CUET"}', 'Reproduction', 'Human Reproduction', 2, 12, 8.0, 4, '{"Male reproductive system", "Female reproductive system", "Gametogenesis", "Menstrual cycle", "Fertilization", "Embryo development", "Parturition"}'),
('cuet-bio-repro-health', 'biology', '{"CUET"}', 'Reproduction', 'Reproductive Health', 3, 12, 6.0, 3, '{"STDs prevention", "Birth control methods", "Contraception", "MTP", "Amniocentesis", "IVF", "ZIFT", "GIFT"}'),
('cuet-bio-inheritance', 'biology', '{"CUET"}', 'Genetics', 'Principles of Inheritance and Variation', 4, 12, 10.0, 5, '{"Mendelian inheritance", "Incomplete dominance", "Co-dominance", "Blood groups", "Sex determination", "Linkage", "Genetic disorders"}'),
('cuet-bio-molecular-inheritance', 'biology', '{"CUET"}', 'Genetics', 'Molecular Basis of Inheritance', 5, 12, 10.0, 5, '{"DNA structure", "DNA replication", "Transcription", "Genetic code", "Translation", "Lac operon", "Human genome project"}'),
('cuet-bio-evolution', 'biology', '{"CUET"}', 'Evolution', 'Evolution', 6, 12, 8.0, 4, '{"Origin of life", "Biological evolution", "Darwin contribution", "Natural selection", "Hardy-Weinberg", "Human evolution"}'),
('cuet-bio-human-health', 'biology', '{"CUET"}', 'Human Welfare', 'Human Health and Disease', 7, 12, 8.0, 4, '{"Pathogens", "Malaria", "Dengue", "Typhoid", "Immunology", "Vaccines", "Cancer", "AIDS", "Drug abuse"}'),
('cuet-bio-microbes-welfare', 'biology', '{"CUET"}', 'Human Welfare', 'Microbes in Human Welfare', 8, 12, 6.0, 3, '{"Food processing", "Industrial production", "Sewage treatment", "Biogas", "Biocontrol", "Biofertilizers", "Antibiotics"}'),
('cuet-bio-biotech-principles', 'biology', '{"CUET"}', 'Biotechnology', 'Biotechnology: Principles and Processes', 9, 12, 8.0, 4, '{"Genetic engineering", "Recombinant DNA technology", "PCR", "Gel electrophoresis", "Vectors"}'),
('cuet-bio-biotech-applications', 'biology', '{"CUET"}', 'Biotechnology', 'Biotechnology and its Applications', 10, 12, 8.0, 4, '{"Human insulin", "Vaccines", "Gene therapy", "Bt crops", "Transgenic animals", "Biosafety", "Biopiracy"}'),
('cuet-bio-organisms-populations', 'biology', '{"CUET"}', 'Ecology', 'Organisms and Populations', 11, 12, 6.0, 3, '{"Population interactions", "Mutualism", "Competition", "Predation", "Parasitism", "Population growth"}'),
('cuet-bio-ecosystem', 'biology', '{"CUET"}', 'Ecology', 'Ecosystems', 12, 12, 6.0, 3, '{"Ecosystem components", "Productivity", "Decomposition", "Energy flow", "Ecological pyramids"}'),
('cuet-bio-biodiversity', 'biology', '{"CUET"}', 'Ecology', 'Biodiversity and Conservation', 13, 12, 8.0, 4, '{"Biodiversity patterns", "Loss of biodiversity", "Conservation", "Hotspots", "Red Data Book", "Biosphere reserves"}')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, weightage = EXCLUDED.weightage, avg_questions = EXCLUDED.avg_questions, important_topics = EXCLUDED.important_topics;

-- NOTE: The remaining CUET chapters (Physics, Chemistry, Mathematics, Economics,
-- Business Studies, Accountancy, Political Science, Computer Science,
-- Environmental Studies, Agriculture, Sociology, Physical Education,
-- Engineering Graphics, Knowledge Traditions, Teaching Aptitude,
-- History, Geography, Psychology) are in:
--   supabase/migrations/20250207_add_cuet_chapters.sql
-- Run that file after this consolidated migration for complete CUET data.


-- ════════════════════════════════════════════════════════════════════════════
-- VERIFICATION
-- ════════════════════════════════════════════════════════════════════════════

SELECT 'med_exams' as tbl, count(*) as cnt FROM med_exams
UNION ALL SELECT 'med_subjects', count(*) FROM med_subjects
UNION ALL SELECT 'med_chapters', count(*) FROM med_chapters
UNION ALL SELECT 'med_topics', count(*) FROM med_topics
UNION ALL SELECT 'med_languages', count(*) FROM med_languages
ORDER BY tbl;
