-- ════════════════════════════════════════════════════════════════════════════
-- App Version Registry
-- ════════════════════════════════════════════════════════════════════════════
-- Master table tracking every app version ever released.
--
--   active  — the current version users should be running
--   legacy  — still functional but outdated; WhatsApp bot nudges these users
--   inactive — no longer supported
--
-- Only ONE version should be 'active' at any time.
-- When releasing v1.1:
--   UPDATE med_app_versions SET status = 'legacy' WHERE status = 'active';
--   INSERT INTO med_app_versions (version, status, release_notes, download_url)
--     VALUES ('1.1', 'active', 'Bug fixes and improvements', 'https://...');
--
-- WhatsApp bot query:
--   SELECT p.phone, p.display_name, p.app_version
--   FROM med_profiles p
--   WHERE p.app_version IS NOT NULL
--     AND p.app_version != (SELECT version FROM med_app_versions WHERE status = 'active' LIMIT 1)
--     AND p.phone != '';
-- ════════════════════════════════════════════════════════════════════════════

create table if not exists med_app_versions (
  id            uuid primary key default gen_random_uuid(),
  version       text unique not null,
  status        text not null default 'active' check (status in ('active', 'legacy', 'inactive')),
  download_url  text,
  release_notes text,
  created_at    timestamptz default now()
);

-- RLS: all authenticated users can read (app checks for updates), nobody writes via client
alter table med_app_versions enable row level security;

create policy "Authenticated users can read app versions"
  on med_app_versions for select
  to authenticated
  using (true);

-- ── Seed: v1.0 (first beta release) ──────────────────────────────────────

insert into med_app_versions (version, status, release_notes) values
('1.0', 'active', 'Beta launch — Practice Exam, Quick Practice, Elimination Technique')
on conflict (version) do nothing;
