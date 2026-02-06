-- ══════════════════════════════════════════════════════════════
-- VaNi · Chapter Progress Tracking
-- Tracks per-chapter progress for each user (coverage, accuracy)
-- Used by VaNi to determine practice exam question selection
-- ══════════════════════════════════════════════════════════════

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

-- Index for efficient queries
create index if not exists idx_med_chapter_progress_user
  on med_chapter_progress (user_id);

create index if not exists idx_med_chapter_progress_subject
  on med_chapter_progress (user_id, subject_id);

-- RLS
alter table med_chapter_progress enable row level security;

create policy "Users can read own chapter progress"
  on med_chapter_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own chapter progress"
  on med_chapter_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own chapter progress"
  on med_chapter_progress for update
  using (auth.uid() = user_id);

-- Auto-update updated_at
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

create trigger med_chapter_progress_metrics
  before insert or update on med_chapter_progress
  for each row execute function recalculate_chapter_metrics();
