-- ══════════════════════════════════════════════════════════════
-- VaNi · Onboarding tables
-- Prefix: med_
-- Run this in the Supabase SQL Editor (or via CLI migration).
-- ══════════════════════════════════════════════════════════════

-- ── 1. med_profiles ──────────────────────────────────────────

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
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

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

-- Drop existing trigger if any, then create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at on profile changes
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger med_profiles_updated_at
  before update on med_profiles
  for each row execute function public.update_updated_at();

-- RLS
alter table med_profiles enable row level security;

create policy "Users can read own profile"
  on med_profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on med_profiles for update
  using (auth.uid() = id);

-- ── 2. med_user_subjects ─────────────────────────────────────

create table if not exists med_user_subjects (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references med_profiles(id) on delete cascade,
  subject_id  text not null,
  created_at  timestamptz default now(),

  unique (user_id, subject_id)
);

alter table med_user_subjects enable row level security;

create policy "Users can read own subjects"
  on med_user_subjects for select
  using (auth.uid() = user_id);

create policy "Users can insert own subjects"
  on med_user_subjects for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own subjects"
  on med_user_subjects for delete
  using (auth.uid() = user_id);

-- ── 3. med_referral_codes ────────────────────────────────────

create table if not exists med_referral_codes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references med_profiles(id) on delete cascade,
  code        text not null unique,
  used_by     uuid references med_profiles(id),
  created_at  timestamptz default now()
);

alter table med_referral_codes enable row level security;

create policy "Users can read own referral code"
  on med_referral_codes for select
  using (auth.uid() = user_id);

create policy "Users can create own referral code"
  on med_referral_codes for insert
  with check (auth.uid() = user_id);

create policy "Anyone can look up a code to join"
  on med_referral_codes for select
  using (used_by is null);

create policy "Users can claim a referral code"
  on med_referral_codes for update
  using (used_by is null)
  with check (auth.uid() = used_by);
