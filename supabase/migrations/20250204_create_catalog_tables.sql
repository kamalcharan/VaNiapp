-- ══════════════════════════════════════════════════════════════
-- VaNi · Master data / catalog tables
-- Prefix: med_
-- Run this in the Supabase SQL Editor after the onboarding migration.
-- ══════════════════════════════════════════════════════════════

-- ── 1. med_exams ─────────────────────────────────────────────

create table if not exists med_exams (
  id          text primary key,
  title       text not null,
  subtitle    text not null default '',
  description text not null default '',
  emoji       text not null default '',
  color       text not null default '#3B82F6',
  light_bg    text not null default '#E8F0FE',
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz default now()
);

-- Seed exams
insert into med_exams (id, title, subtitle, description, emoji, color, light_bg, sort_order) values
  ('NEET', 'NEET', 'Medical Entrance', '4 subjects — Physics, Chemistry, Botany, Zoology', '🩺', '#3B82F6', '#E8F0FE', 1),
  ('CUET', 'CUET', 'University Entrance', 'Pick up to 6 domain subjects + General Test', '🎓', '#8B5CF6', '#EDEBFE', 2),
  ('BOTH', 'Both', 'NEET + CUET', 'NEET 4 auto-included + pick CUET subjects', '💪', '#F59E0B', '#FEF3E0', 3)
on conflict (id) do nothing;

-- Public read, no auth needed for catalog
alter table med_exams enable row level security;

create policy "Anyone can read active exams"
  on med_exams for select
  using (is_active = true);

-- ── 2. med_subjects ──────────────────────────────────────────

create table if not exists med_subjects (
  id          text primary key,
  name        text not null,
  emoji       text not null default '',
  color       text not null default '#64748B',
  category    text not null default 'Other',
  exam_id     text not null references med_exams(id),
  max_select  int,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz default now()
);

-- Seed NEET subjects
insert into med_subjects (id, name, emoji, color, category, exam_id, sort_order) values
  ('physics',   'Physics',   '⚛️', '#3B82F6', 'Science', 'NEET', 1),
  ('chemistry', 'Chemistry', '🧪', '#F97316', 'Science', 'NEET', 2),
  ('botany',    'Botany',    '🌿', '#22C55E', 'Science', 'NEET', 3),
  ('zoology',   'Zoology',   '🦋', '#A855F7', 'Science', 'NEET', 4)
on conflict (id) do nothing;

-- Seed CUET subjects
insert into med_subjects (id, name, emoji, color, category, exam_id, sort_order) values
  -- Science
  ('cuet-physics',    'Physics',            '⚛️', '#3B82F6', 'Science',           'CUET', 10),
  ('cuet-chemistry',  'Chemistry',          '🧪', '#F97316', 'Science',           'CUET', 11),
  ('mathematics',     'Mathematics',        '📏', '#EF4444', 'Science',           'CUET', 12),
  ('biology',         'Biology / Biotech',  '🧬', '#22C55E', 'Science',           'CUET', 13),
  -- Commerce
  ('accountancy',     'Accountancy',        '📊', '#14B8A6', 'Commerce',          'CUET', 20),
  ('business-studies','Business Studies',    '💼', '#8B5CF6', 'Commerce',          'CUET', 21),
  ('economics',       'Economics',          '💹', '#F59E0B', 'Commerce',          'CUET', 22),
  -- Arts / Humanities
  ('history',         'History',            '🏛️', '#92400E', 'Arts / Humanities', 'CUET', 30),
  ('geography',       'Geography',          '🌍', '#059669', 'Arts / Humanities', 'CUET', 31),
  ('political-science','Political Science', '🗳️', '#6366F1', 'Arts / Humanities', 'CUET', 32),
  ('sociology',       'Sociology',          '👥', '#EC4899', 'Arts / Humanities', 'CUET', 33),
  ('psychology',      'Psychology',         '🧠', '#F472B6', 'Arts / Humanities', 'CUET', 34),
  ('philosophy',      'Philosophy',         '💡', '#A78BFA', 'Arts / Humanities', 'CUET', 35),
  ('anthropology',    'Anthropology',       '🔬', '#78716C', 'Arts / Humanities', 'CUET', 36),
  -- Other
  ('computer-science',      'Computer Science',      '💻', '#0EA5E9', 'Other', 'CUET', 40),
  ('environmental-studies', 'Environmental Studies', '🌿', '#16A34A', 'Other', 'CUET', 41),
  ('physical-education',    'Physical Education',    '🏃', '#EA580C', 'Other', 'CUET', 42),
  ('fine-arts',             'Fine Arts',             '🎨', '#DB2777', 'Other', 'CUET', 43),
  ('home-science',          'Home Science',          '🏠', '#D97706', 'Other', 'CUET', 44),
  ('mass-media',            'Mass Media / Journalism','📰', '#4F46E5', 'Other', 'CUET', 45),
  -- General Test
  ('general-test',   'General Test',       '🗒️', '#64748B', 'General Test',      'CUET', 50)
on conflict (id) do nothing;

alter table med_subjects enable row level security;

create policy "Anyone can read active subjects"
  on med_subjects for select
  using (is_active = true);

-- ── 3. med_languages ─────────────────────────────────────────

create table if not exists med_languages (
  id          text primary key,
  label       text not null,
  native      text not null,
  emoji       text not null default '',
  description text not null default '',
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz default now()
);

-- Seed languages
insert into med_languages (id, label, native, emoji, description, sort_order) values
  ('en', 'English', 'English', 'Aa', 'Questions, explanations & UI in English', 1),
  ('te', 'Telugu',  'తెలుగు',  'అ', 'Questions & explanations in Telugu, UI in English', 2)
on conflict (id) do nothing;

alter table med_languages enable row level security;

create policy "Anyone can read active languages"
  on med_languages for select
  using (is_active = true);
