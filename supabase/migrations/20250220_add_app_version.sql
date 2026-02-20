-- Track which app version each user is running.
-- The WhatsApp bot queries this to notify users of new versions.
alter table med_profiles
  add column if not exists app_version text default null;
