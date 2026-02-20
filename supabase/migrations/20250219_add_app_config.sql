-- ════════════════════════════════════════════════════════════════════════════
-- App Configuration Table
-- ════════════════════════════════════════════════════════════════════════════
--
-- Generic key/value config table. Lets us control app behaviour from the
-- Supabase dashboard without shipping an app update.
--
-- First config: onboarding_flow
--   mode = 'quick'  → new signups skip to practice (April 2026 NEET campaign)
--   mode = 'full'   → new signups see the full 7-step onboarding with levels
--   quick_until      → ISO date after which 'quick' auto-falls back to 'full'
--
-- To switch from campaign → levels after May 15:
--   UPDATE med_app_config SET value = jsonb_set(value, '{mode}', '"full"')
--   WHERE key = 'onboarding_flow';
--
-- Or just let quick_until expire — the app checks the date client-side.
-- ════════════════════════════════════════════════════════════════════════════

create table if not exists med_app_config (
  id          uuid primary key default gen_random_uuid(),
  key         text unique not null,
  value       jsonb not null default '{}',
  description text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Auto-update updated_at
create trigger set_updated_at_app_config
  before update on med_app_config
  for each row execute function public.update_updated_at();

-- RLS: all authenticated users can read, nobody can write via client
alter table med_app_config enable row level security;

create policy "Authenticated users can read app config"
  on med_app_config for select
  to authenticated
  using (true);

-- ── Seed: onboarding flow config ─────────────────────────────────────────

insert into med_app_config (key, value, description) values
(
  'onboarding_flow',
  '{
    "mode": "quick",
    "quick_until": "2026-05-15T00:00:00Z",
    "default_exam": "NEET",
    "auto_assign_subjects": true,
    "default_language": "en"
  }',
  'Controls onboarding flow for new registrations. quick = skip to practice (campaign), full = 7-step with levels.'
);
