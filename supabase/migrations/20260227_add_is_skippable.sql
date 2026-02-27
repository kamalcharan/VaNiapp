-- Add is_skippable flag to med_app_versions
-- When false (default), update modal has no skip option — user must update.
-- When true, a "Skip for now" button is shown.

alter table med_app_versions
  add column if not exists is_skippable boolean not null default false;
