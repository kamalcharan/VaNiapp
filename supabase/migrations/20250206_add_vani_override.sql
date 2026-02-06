-- ══════════════════════════════════════════════════════════════
-- VaNi · Add secret override setting for VaNi decisions
-- This allows admins to override VaNi's AI-driven question selection
-- ══════════════════════════════════════════════════════════════

-- Add vani_override column to med_profiles
-- When true, admin-defined settings override VaNi's AI decisions
alter table med_profiles
add column if not exists vani_override boolean default false;

-- Comment for documentation
comment on column med_profiles.vani_override is
  'Secret admin setting: when true, overrides VaNi AI decisions with manual config';
