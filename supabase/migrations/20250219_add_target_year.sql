-- ════════════════════════════════════════════════════════════════════════════
-- Add target_year to med_profiles
-- ════════════════════════════════════════════════════════════════════════════
--
-- Tracks which exam cycle the student is targeting (e.g. 2026 or 2027).
-- This lets the app personalize the experience:
--   2026 → crunch mode, practice-focused, no levels
--   2027 → levels/progression journey, spaced learning
--
-- NULL = not yet set (existing users who haven't picked)
-- ════════════════════════════════════════════════════════════════════════════

alter table med_profiles
  add column if not exists target_year integer;

comment on column med_profiles.target_year is
  'Which exam year the student targets (e.g. 2026, 2027). NULL = not set.';
