-- ══════════════════════════════════════════════════════════════
-- VaNi · Question Mix Configuration
-- Stores question type percentage mix for practice exams
-- VaNi decides the mix by default, admin can override per-user
-- ══════════════════════════════════════════════════════════════

-- ── 1. Default question mix config (global) ─────────────────────

create table if not exists med_question_mix_defaults (
  id              uuid primary key default gen_random_uuid(),
  name            text not null unique,  -- e.g., 'trial_default', 'paid_default'
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

-- Insert default configs
insert into med_question_mix_defaults (name, description, easy_pct, medium_pct, hard_pct,
  mcq_pct, assertion_reasoning_pct, match_following_pct, true_false_pct,
  diagram_based_pct, logical_sequence_pct, fill_blanks_pct, scenario_based_pct)
values
  ('trial_default', 'Default mix for trial users (30 questions)', 40, 45, 15,
   65, 10, 8, 7, 4, 2, 2, 2),
  ('paid_default', 'Default mix for paid users (200 questions)', 30, 50, 20,
   60, 10, 10, 5, 5, 3, 4, 3)
on conflict (name) do nothing;

-- ── 2. Per-user question mix overrides ──────────────────────────

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

-- RLS for user question mix
alter table med_user_question_mix enable row level security;

create policy "Users can read own question mix"
  on med_user_question_mix for select
  using (auth.uid() = user_id);

-- Only admins can insert/update (via service role or admin function)
-- Users read their mix but VaNi (backend) sets it

-- Auto-update updated_at
create trigger med_user_question_mix_updated_at
  before update on med_user_question_mix
  for each row execute function public.update_updated_at();
