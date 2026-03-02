-- ════════════════════════════════════════════════════════════════════════════
-- Question Quality Issues table
-- ════════════════════════════════════════════════════════════════════════════
--
-- Stores quality issues found by automated scans (Explore), runtime checks,
-- and user reports. Language-agnostic: MISSING_TRANSLATION uses details.language
-- so adding Hindi/Tamil/Kannada later requires zero schema changes.
--
-- Sources:
--   'auto'    — detected by app at runtime
--   'explore' — proactive scan from Qbank Explore page
--   'user'    — reported by a student in-app
-- ════════════════════════════════════════════════════════════════════════════

create table if not exists med_quality_issues (
  id              uuid primary key default gen_random_uuid(),

  question_id     uuid not null references med_questions(id) on delete cascade,
  chapter_id      text not null,     -- denormalized for fast per-chapter queries

  issue_type      text not null,     -- e.g. 'MISSING_TRANSLATION', 'EMPTY_OPTIONS'
  severity        text not null default 'medium'
                    check (severity in ('low', 'medium', 'high')),
  source          text not null default 'explore'
                    check (source in ('auto', 'explore', 'user')),

  -- Flexible per-issue details (language, field names, image URIs, etc.)
  details         jsonb not null default '{}',

  -- User-reported issues
  user_comment    text,
  reported_by     uuid references auth.users(id),

  -- Resolution tracking
  status          text not null default 'open'
                    check (status in ('open', 'resolved', 'wont_fix')),
  resolved_by     uuid references auth.users(id),
  resolved_at     timestamptz,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Prevent duplicate issues: same question + same issue type + same details
create unique index if not exists idx_quality_issues_dedup
  on med_quality_issues (question_id, issue_type, md5(details::text))
  where status = 'open';

-- Fast lookups
create index if not exists idx_quality_issues_chapter on med_quality_issues(chapter_id);
create index if not exists idx_quality_issues_type on med_quality_issues(issue_type);
create index if not exists idx_quality_issues_status on med_quality_issues(status);
create index if not exists idx_quality_issues_severity on med_quality_issues(severity);
create index if not exists idx_quality_issues_question on med_quality_issues(question_id);

-- Auto-update updated_at
create or replace function update_quality_issue_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_quality_issues_updated_at on med_quality_issues;
create trigger trg_quality_issues_updated_at
  before update on med_quality_issues
  for each row
  execute function update_quality_issue_timestamp();

-- RLS: admins can read/write, authenticated users can create user reports
alter table med_quality_issues enable row level security;

-- Anyone authenticated can read quality issues
drop policy if exists "Authenticated users can read quality issues" on med_quality_issues;
create policy "Authenticated users can read quality issues"
  on med_quality_issues for select
  using (auth.role() = 'authenticated');

-- Anyone authenticated can insert (for user reports and explore scans)
drop policy if exists "Authenticated users can insert quality issues" on med_quality_issues;
create policy "Authenticated users can insert quality issues"
  on med_quality_issues for insert
  with check (auth.role() = 'authenticated');

-- Anyone authenticated can update (for resolving issues)
drop policy if exists "Authenticated users can update quality issues" on med_quality_issues;
create policy "Authenticated users can update quality issues"
  on med_quality_issues for update
  using (auth.role() = 'authenticated');
