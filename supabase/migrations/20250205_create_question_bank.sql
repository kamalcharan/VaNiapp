-- ════════════════════════════════════════════════════════════════════════════
-- QUESTION BANK SCHEMA + SEED DATA
-- Run this migration in Supabase SQL Editor
-- ════════════════════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 1. CHAPTERS TABLE                                                           │
-- └─────────────────────────────────────────────────────────────────────────────┘

create table if not exists med_chapters (
  id                text primary key,
  subject_id        text not null references med_subjects(id),
  exam_ids          text[] not null default '{"NEET"}',

  branch            text,
  name              text not null,
  name_te           text,

  chapter_number    int,
  class_level       int,                        -- 11 or 12
  weightage         decimal(4,1) default 0,     -- % weightage in exam
  avg_questions     int default 0,              -- avg questions asked per exam

  important_topics  text[] default '{}',

  is_active         boolean default true,
  created_at        timestamptz default now()
);

create index if not exists idx_chapters_subject on med_chapters(subject_id);
create index if not exists idx_chapters_branch on med_chapters(branch);
create index if not exists idx_chapters_exams on med_chapters using gin(exam_ids);


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 2. TOPICS TABLE                                                             │
-- └─────────────────────────────────────────────────────────────────────────────┘

create table if not exists med_topics (
  id                text primary key,
  chapter_id        text not null references med_chapters(id) on delete cascade,

  name              text not null,
  name_te           text,

  sort_order        int default 0,
  is_important      boolean default false,
  is_active         boolean default true,
  created_at        timestamptz default now()
);

create index if not exists idx_topics_chapter on med_topics(chapter_id);


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 3. QUESTIONS TABLE                                                          │
-- └─────────────────────────────────────────────────────────────────────────────┘

create table if not exists med_questions (
  id                uuid primary key default gen_random_uuid(),

  subject_id        text not null references med_subjects(id),
  chapter_id        text not null references med_chapters(id),
  topic_id          text references med_topics(id),

  exam_ids          text[] not null default '{"NEET"}',

  question_type     text not null check (question_type in (
    'mcq', 'true-false', 'assertion-reasoning', 'match-the-following',
    'fill-in-blanks', 'scenario-based', 'diagram-based', 'logical-sequence'
  )),

  difficulty        text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  strength_required text not null default 'just-started' check (strength_required in (
    'just-started', 'getting-there', 'on-track', 'strong'
  )),

  question_text     text not null,
  explanation       text,
  question_text_te  text,
  explanation_te    text,

  payload           jsonb not null default '{}',

  image_url         text,
  image_alt         text,

  correct_answer    text not null,

  source            text default 'manual',
  generation_job_id uuid,
  reviewed_by       uuid,
  reviewed_at       timestamptz,

  concept_tags      text[] default '{}',

  status            text default 'active' check (status in ('draft', 'pending_review', 'active', 'archived')),

  is_active         boolean default true,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create index if not exists idx_questions_subject on med_questions(subject_id);
create index if not exists idx_questions_chapter on med_questions(chapter_id);
create index if not exists idx_questions_topic on med_questions(topic_id);
create index if not exists idx_questions_type on med_questions(question_type);
create index if not exists idx_questions_difficulty on med_questions(difficulty);
create index if not exists idx_questions_strength on med_questions(strength_required);
create index if not exists idx_questions_status on med_questions(status);
create index if not exists idx_questions_exams on med_questions using gin(exam_ids);
create index if not exists idx_questions_tags on med_questions using gin(concept_tags);


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 4. QUESTION OPTIONS TABLE                                                   │
-- └─────────────────────────────────────────────────────────────────────────────┘

create table if not exists med_question_options (
  id                text not null,
  question_id       uuid not null references med_questions(id) on delete cascade,

  option_text       text not null,
  option_text_te    text,

  sort_order        int default 0,

  primary key (question_id, id)
);


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 5. ELIMINATION HINTS TABLE                                                  │
-- └─────────────────────────────────────────────────────────────────────────────┘

create table if not exists med_elimination_hints (
  id                uuid primary key default gen_random_uuid(),
  question_id       uuid not null references med_questions(id) on delete cascade,
  option_id         text not null,

  hint_text         text not null,
  hint_text_te      text,

  misconception     text,
  misconception_te  text,

  unique (question_id, option_id)
);


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 6. GENERATION JOBS TABLE                                                    │
-- └─────────────────────────────────────────────────────────────────────────────┘

create table if not exists med_generation_jobs (
  id                uuid primary key default gen_random_uuid(),

  subject_id        text not null,
  chapter_id        text not null,
  topic_id          text,
  question_type     text not null,
  difficulty        text default 'medium',
  count             int not null default 10,
  include_telugu    boolean default true,

  trigger_reason    text not null,
  trigger_data      jsonb default '{}',

  priority          text default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  status            text default 'pending' check (status in ('pending', 'processing', 'completed', 'failed', 'cancelled')),

  generated_output  jsonb,
  questions_created int default 0,
  error_message     text,

  created_at        timestamptz default now(),
  started_at        timestamptz,
  completed_at      timestamptz
);

create index if not exists idx_jobs_status on med_generation_jobs(status);
create index if not exists idx_jobs_chapter on med_generation_jobs(chapter_id);


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 7. RLS POLICIES                                                             │
-- └─────────────────────────────────────────────────────────────────────────────┘

alter table med_chapters enable row level security;
drop policy if exists "Public read chapters" on med_chapters;
create policy "Public read chapters" on med_chapters for select using (true);

alter table med_topics enable row level security;
drop policy if exists "Public read topics" on med_topics;
create policy "Public read topics" on med_topics for select using (true);

alter table med_questions enable row level security;
drop policy if exists "Public read active questions" on med_questions;
create policy "Public read active questions" on med_questions for select using (status = 'active');

alter table med_question_options enable row level security;
drop policy if exists "Public read options" on med_question_options;
create policy "Public read options" on med_question_options for select using (true);

alter table med_elimination_hints enable row level security;
drop policy if exists "Public read hints" on med_elimination_hints;
create policy "Public read hints" on med_elimination_hints for select using (true);

alter table med_generation_jobs enable row level security;
-- No public policy for generation jobs (admin only)


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 8. UPDATED_AT TRIGGER                                                       │
-- └─────────────────────────────────────────────────────────────────────────────┘

create or replace function update_questions_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_questions_updated_at on med_questions;
create trigger trg_questions_updated_at
  before update on med_questions
  for each row execute function update_questions_updated_at();


-- ════════════════════════════════════════════════════════════════════════════
-- SEED DATA: CHAPTERS
-- ════════════════════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ PHYSICS CHAPTERS (20)                                                       │
-- └─────────────────────────────────────────────────────────────────────────────┘

insert into med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) values
('phy-units-measurement', 'physics', '{"NEET"}', 'Mechanics', 'Units and Measurements', 1, 11, 6.0, 3, '{"SI system", "Errors", "Dimensional analysis", "Significant figures"}'),
('phy-kinematics', 'physics', '{"NEET"}', 'Mechanics', 'Kinematics', 2, 11, 4.0, 2, '{"Motion equations", "Projectile motion", "Circular motion", "Vectors"}'),
('phy-laws-of-motion', 'physics', '{"NEET"}', 'Mechanics', 'Laws of Motion', 3, 11, 2.0, 1, '{"Newton laws", "Friction", "Circular motion dynamics"}'),
('phy-work-energy-power', 'physics', '{"NEET"}', 'Mechanics', 'Work, Energy and Power', 4, 11, 2.0, 1, '{"Work-energy theorem", "Collisions", "Power", "Conservative forces"}'),
('phy-rotational-motion', 'physics', '{"NEET"}', 'Mechanics', 'Rotational Motion', 5, 11, 6.0, 3, '{"Torque", "Angular momentum", "Moment of inertia", "Rolling motion"}'),
('phy-gravitation', 'physics', '{"NEET"}', 'Mechanics', 'Gravitation', 6, 11, 4.0, 2, '{"Kepler laws", "Satellites", "Escape velocity", "Gravitational potential"}'),
('phy-properties-matter', 'physics', '{"NEET"}', 'Mechanics', 'Properties of Solids and Liquids', 7, 11, 2.0, 1, '{"Elasticity", "Viscosity", "Surface tension", "Fluid mechanics", "Bernoulli"}'),
('phy-thermodynamics', 'physics', '{"NEET"}', 'Thermodynamics', 'Thermodynamics', 8, 11, 4.0, 2, '{"First law", "Second law", "Heat engines", "Carnot cycle"}'),
('phy-kinetic-theory', 'physics', '{"NEET"}', 'Thermodynamics', 'Kinetic Theory of Gases', 9, 11, 2.0, 1, '{"Gas laws", "RMS speed", "Mean free path", "Degrees of freedom"}'),
('phy-oscillations-waves', 'physics', '{"NEET"}', 'Waves', 'Oscillations and Waves', 10, 11, 6.0, 3, '{"SHM", "Wave motion", "Sound waves", "Beats", "Doppler effect"}'),
('phy-electrostatics', 'physics', '{"NEET"}', 'Electromagnetism', 'Electrostatics', 11, 12, 6.0, 3, '{"Coulomb law", "Electric field", "Gauss law", "Capacitors"}'),
('phy-current-electricity', 'physics', '{"NEET"}', 'Electromagnetism', 'Current Electricity', 12, 12, 6.0, 3, '{"Ohm law", "Kirchhoff laws", "Wheatstone bridge", "Potentiometer"}'),
('phy-magnetic-effects', 'physics', '{"NEET"}', 'Electromagnetism', 'Magnetic Effects of Current & Magnetism', 13, 12, 6.0, 3, '{"Biot-Savart law", "Ampere law", "Magnetic materials", "Earth magnetism"}'),
('phy-em-induction', 'physics', '{"NEET"}', 'Electromagnetism', 'Electromagnetic Induction & AC', 14, 12, 4.0, 2, '{"Faraday law", "Lenz law", "Transformers", "AC circuits", "Resonance"}'),
('phy-em-waves', 'physics', '{"NEET"}', 'Electromagnetism', 'Electromagnetic Waves', 15, 12, 4.0, 2, '{"EM spectrum", "Properties", "Applications"}'),
('phy-optics', 'physics', '{"NEET"}', 'Optics', 'Optics', 16, 12, 8.0, 4, '{"Ray optics", "Wave optics", "Interference", "Diffraction", "Polarization"}'),
('phy-dual-nature', 'physics', '{"NEET"}', 'Modern Physics', 'Dual Nature of Matter and Radiation', 17, 12, 4.0, 2, '{"Photoelectric effect", "de Broglie waves", "Davisson-Germer"}'),
('phy-atoms-nuclei', 'physics', '{"NEET"}', 'Modern Physics', 'Atoms and Nuclei', 18, 12, 4.0, 2, '{"Bohr model", "Nuclear physics", "Radioactivity", "Fission", "Fusion"}'),
('phy-electronic-devices', 'physics', '{"NEET"}', 'Modern Physics', 'Electronic Devices', 19, 12, 4.0, 2, '{"Semiconductors", "p-n junction", "Diodes", "Transistors", "Logic gates"}'),
('phy-experimental', 'physics', '{"NEET"}', 'Practical', 'Experimental Skills', 20, 12, 2.0, 1, '{"Vernier caliper", "Screw gauge", "Pendulum", "Prism experiments"}')
on conflict (id) do update set
  name = excluded.name,
  weightage = excluded.weightage,
  avg_questions = excluded.avg_questions,
  important_topics = excluded.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ CHEMISTRY CHAPTERS (20)                                                     │
-- └─────────────────────────────────────────────────────────────────────────────┘

insert into med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) values
-- Physical Chemistry (8)
('chem-basic-concepts', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Some Basic Concepts of Chemistry', 1, 11, 4.4, 2, '{"Mole concept", "Stoichiometry", "Empirical formula", "Limiting reagent"}'),
('chem-atomic-structure', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Structure of Atom', 2, 11, 4.4, 2, '{"Bohr model", "Quantum numbers", "Electronic configuration", "Aufbau principle"}'),
('chem-chemical-bonding', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Chemical Bonding and Molecular Structure', 3, 11, 4.4, 2, '{"VSEPR", "Hybridization", "MO theory", "Hydrogen bonding"}'),
('chem-thermodynamics', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Thermodynamics', 4, 11, 2.2, 1, '{"Enthalpy", "Hess law", "Gibbs energy", "Spontaneity"}'),
('chem-equilibrium', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Equilibrium', 5, 11, 6.7, 3, '{"Le Chatelier principle", "Buffer solutions", "Solubility product", "pH calculations"}'),
('chem-redox', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Redox Reactions', 6, 11, 2.2, 1, '{"Oxidation number", "Balancing redox", "Electrochemical series"}'),
('chem-solutions', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Solutions', 7, 12, 6.7, 3, '{"Raoult law", "Colligative properties", "van t Hoff factor", "Osmosis"}'),
('chem-electrochemistry', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Electrochemistry', 8, 12, 2.2, 1, '{"Nernst equation", "Conductivity", "Fuel cells", "Corrosion"}'),
('chem-kinetics', 'chemistry', '{"NEET"}', 'Physical Chemistry', 'Chemical Kinetics', 9, 12, 6.7, 3, '{"Rate law", "Order", "Arrhenius equation", "Activation energy"}'),

-- Inorganic Chemistry (4)
('chem-periodicity', 'chemistry', '{"NEET"}', 'Inorganic Chemistry', 'Classification of Elements and Periodicity', 10, 11, 4.4, 2, '{"Periodic trends", "Ionization energy", "Electron affinity", "Electronegativity"}'),
('chem-p-block', 'chemistry', '{"NEET"}', 'Inorganic Chemistry', 'p-Block Elements', 11, 12, 4.4, 2, '{"Group 13-18", "Oxides", "Halides", "Interhalogen compounds"}'),
('chem-d-f-block', 'chemistry', '{"NEET"}', 'Inorganic Chemistry', 'd- and f-Block Elements', 12, 12, 2.2, 1, '{"Transition elements", "KMnO4", "K2Cr2O7", "Lanthanoid contraction"}'),
('chem-coordination', 'chemistry', '{"NEET"}', 'Inorganic Chemistry', 'Coordination Compounds', 13, 12, 8.9, 4, '{"Werner theory", "Isomerism", "VBT", "CFT", "Nomenclature"}'),

-- Organic Chemistry (7)
('chem-organic-basics', 'chemistry', '{"NEET"}', 'Organic Chemistry', 'Organic Chemistry: Basic Principles', 14, 11, 8.9, 4, '{"IUPAC nomenclature", "Isomerism", "Electronic effects", "Reaction mechanisms"}'),
('chem-hydrocarbons', 'chemistry', '{"NEET"}', 'Organic Chemistry', 'Hydrocarbons', 15, 11, 6.7, 3, '{"Alkanes", "Alkenes", "Alkynes", "Aromatic compounds", "Friedel-Crafts"}'),
('chem-haloalkanes', 'chemistry', '{"NEET"}', 'Organic Chemistry', 'Haloalkanes and Haloarenes', 16, 12, 4.4, 2, '{"SN1 SN2", "Elimination", "Grignard reagent"}'),
('chem-alcohols-ethers', 'chemistry', '{"NEET"}', 'Organic Chemistry', 'Alcohols, Phenols and Ethers', 17, 12, 2.2, 1, '{"Preparation", "Reactions", "Acidic nature of phenols"}'),
('chem-aldehydes-ketones', 'chemistry', '{"NEET"}', 'Organic Chemistry', 'Aldehydes, Ketones and Carboxylic Acids', 18, 12, 6.7, 3, '{"Nucleophilic addition", "Aldol", "Cannizzaro", "Acidic strength"}'),
('chem-amines', 'chemistry', '{"NEET"}', 'Organic Chemistry', 'Amines', 19, 12, 4.4, 2, '{"Basicity", "Diazonium salts", "Coupling reactions"}'),
('chem-biomolecules', 'chemistry', '{"NEET"}', 'Organic Chemistry', 'Biomolecules', 20, 12, 4.4, 2, '{"Carbohydrates", "Proteins", "Nucleic acids", "Vitamins"}')
on conflict (id) do update set
  name = excluded.name,
  weightage = excluded.weightage,
  avg_questions = excluded.avg_questions,
  important_topics = excluded.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ BOTANY CHAPTERS (17)                                                        │
-- └─────────────────────────────────────────────────────────────────────────────┘

insert into med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) values
('bot-living-world', 'botany', '{"NEET"}', 'Diversity', 'The Living World', 1, 11, 1.0, 0, '{"Biodiversity", "Taxonomy", "Binomial nomenclature", "Taxonomic hierarchy"}'),
('bot-biological-classification', 'botany', '{"NEET"}', 'Diversity', 'Biological Classification', 2, 11, 3.0, 1, '{"Five kingdoms", "Monera", "Protista", "Fungi", "Viruses"}'),
('bot-plant-kingdom', 'botany', '{"NEET"}', 'Diversity', 'Plant Kingdom', 3, 11, 7.0, 3, '{"Algae", "Bryophytes", "Pteridophytes", "Gymnosperms", "Angiosperms"}'),
('bot-morphology-flowering', 'botany', '{"NEET"}', 'Structural Organization', 'Morphology of Flowering Plants', 4, 11, 6.0, 3, '{"Root", "Stem", "Leaf", "Flower", "Fruit", "Seed", "Plant families"}'),
('bot-anatomy-flowering', 'botany', '{"NEET"}', 'Structural Organization', 'Anatomy of Flowering Plants', 5, 11, 7.0, 3, '{"Tissues", "Meristems", "Vascular bundles", "Secondary growth"}'),
('bot-cell-unit', 'botany', '{"NEET"}', 'Cell Biology', 'Cell: The Unit of Life', 6, 11, 5.0, 2, '{"Cell theory", "Prokaryotic vs Eukaryotic", "Cell organelles", "Nucleus"}'),
('bot-cell-cycle', 'botany', '{"NEET"}', 'Cell Biology', 'Cell Cycle and Cell Division', 7, 11, 9.0, 4, '{"Mitosis", "Meiosis", "Cell cycle phases", "Significance"}'),
('bot-photosynthesis', 'botany', '{"NEET"}', 'Plant Physiology', 'Photosynthesis in Higher Plants', 8, 11, 4.0, 2, '{"Light reactions", "Dark reactions", "C3 C4 pathway", "Photorespiration"}'),
('bot-respiration', 'botany', '{"NEET"}', 'Plant Physiology', 'Respiration in Plants', 9, 11, 4.0, 2, '{"Glycolysis", "Krebs cycle", "ETC", "Fermentation", "RQ"}'),
('bot-plant-growth', 'botany', '{"NEET"}', 'Plant Physiology', 'Plant Growth and Development', 10, 11, 6.0, 3, '{"Growth regulators", "Auxin", "Gibberellin", "Cytokinin", "Ethylene", "ABA"}'),
('bot-sexual-reproduction', 'botany', '{"NEET"}', 'Reproduction', 'Sexual Reproduction in Flowering Plants', 11, 12, 6.0, 3, '{"Flower structure", "Pollination", "Double fertilization", "Embryo development"}'),
('bot-inheritance', 'botany', '{"NEET"}', 'Genetics', 'Principles of Inheritance and Variation', 12, 12, 10.0, 5, '{"Mendel laws", "Linkage", "Crossing over", "Sex determination", "Genetic disorders"}'),
('bot-molecular-inheritance', 'botany', '{"NEET"}', 'Genetics', 'Molecular Basis of Inheritance', 13, 12, 14.0, 7, '{"DNA structure", "Replication", "Transcription", "Translation", "Lac operon", "Human genome project"}'),
('bot-microbes-welfare', 'botany', '{"NEET"}', 'Biology in Human Welfare', 'Microbes in Human Welfare', 14, 12, 4.0, 2, '{"Industrial microbes", "Sewage treatment", "Biogas", "Biocontrol", "Biofertilizers"}'),
('bot-organisms-populations', 'botany', '{"NEET"}', 'Ecology', 'Organisms and Populations', 15, 12, 4.0, 2, '{"Population attributes", "Growth curves", "Interactions", "Adaptations"}'),
('bot-ecosystem', 'botany', '{"NEET"}', 'Ecology', 'Ecosystem', 16, 12, 4.0, 2, '{"Energy flow", "Food chains", "Ecological pyramids", "Nutrient cycling"}'),
('bot-biodiversity', 'botany', '{"NEET"}', 'Ecology', 'Biodiversity and Conservation', 17, 12, 4.0, 2, '{"Biodiversity patterns", "Loss of biodiversity", "Conservation strategies", "Hotspots"}')
on conflict (id) do update set
  name = excluded.name,
  weightage = excluded.weightage,
  avg_questions = excluded.avg_questions,
  important_topics = excluded.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ ZOOLOGY CHAPTERS (15)                                                       │
-- └─────────────────────────────────────────────────────────────────────────────┘

insert into med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) values
('zoo-animal-kingdom', 'zoology', '{"NEET"}', 'Diversity', 'Animal Kingdom', 1, 11, 13.0, 7, '{"Classification", "Phyla", "Chordates", "Non-chordates"}'),
('zoo-structural-organization', 'zoology', '{"NEET"}', 'Structural Organization', 'Structural Organisation in Animals', 2, 11, 8.0, 4, '{"Animal tissues", "Epithelium", "Connective tissue", "Cockroach", "Frog"}'),
('zoo-biomolecules', 'zoology', '{"NEET"}', 'Cell Biology', 'Biomolecules', 3, 11, 10.0, 5, '{"Carbohydrates", "Proteins", "Lipids", "Nucleic acids", "Enzymes"}'),
('zoo-breathing', 'zoology', '{"NEET"}', 'Human Physiology', 'Breathing and Exchange of Gases', 4, 11, 4.0, 2, '{"Respiratory system", "Mechanism of breathing", "Gas exchange", "Respiratory disorders"}'),
('zoo-body-fluids', 'zoology', '{"NEET"}', 'Human Physiology', 'Body Fluids and Circulation', 5, 11, 5.0, 2, '{"Blood composition", "Blood groups", "Heart", "Cardiac cycle", "ECG"}'),
('zoo-excretion', 'zoology', '{"NEET"}', 'Human Physiology', 'Excretory Products and their Elimination', 6, 11, 5.0, 2, '{"Nephron", "Urine formation", "Osmoregulation", "Kidney disorders"}'),
('zoo-locomotion', 'zoology', '{"NEET"}', 'Human Physiology', 'Locomotion and Movement', 7, 11, 6.0, 3, '{"Muscle contraction", "Skeletal system", "Joints", "Disorders"}'),
('zoo-neural-control', 'zoology', '{"NEET"}', 'Human Physiology', 'Neural Control and Coordination', 8, 11, 2.0, 1, '{"Neuron", "Nerve impulse", "Brain", "Reflex arc"}'),
('zoo-chemical-coordination', 'zoology', '{"NEET"}', 'Human Physiology', 'Chemical Coordination and Integration', 9, 11, 4.0, 2, '{"Endocrine glands", "Hormones", "Feedback mechanism"}'),
('zoo-human-reproduction', 'zoology', '{"NEET"}', 'Reproduction', 'Human Reproduction', 10, 12, 6.0, 3, '{"Male reproductive system", "Female reproductive system", "Gametogenesis", "Menstrual cycle"}'),
('zoo-reproductive-health', 'zoology', '{"NEET"}', 'Reproduction', 'Reproductive Health', 11, 12, 8.0, 4, '{"Contraception", "STDs", "Infertility", "ART"}'),
('zoo-evolution', 'zoology', '{"NEET"}', 'Genetics & Evolution', 'Evolution', 12, 12, 6.0, 3, '{"Origin of life", "Evidence of evolution", "Natural selection", "Human evolution"}'),
('zoo-human-health', 'zoology', '{"NEET"}', 'Biology in Human Welfare', 'Human Health and Diseases', 13, 12, 6.0, 3, '{"Diseases", "Immunity", "AIDS", "Cancer", "Drugs"}'),
('zoo-biotechnology-principles', 'zoology', '{"NEET"}', 'Biotechnology', 'Biotechnology: Principles and Processes', 14, 12, 12.0, 6, '{"rDNA technology", "PCR", "Gel electrophoresis", "Vectors", "Cloning"}'),
('zoo-biotechnology-applications', 'zoology', '{"NEET"}', 'Biotechnology', 'Biotechnology and its Applications', 15, 12, 7.0, 4, '{"GMO", "Bt crops", "Gene therapy", "Transgenic animals"}')
on conflict (id) do update set
  name = excluded.name,
  weightage = excluded.weightage,
  avg_questions = excluded.avg_questions,
  important_topics = excluded.important_topics;


-- ════════════════════════════════════════════════════════════════════════════
-- SEED DATA: TOPICS (Key topics for each chapter)
-- ════════════════════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ PHYSICS TOPICS                                                              │
-- └─────────────────────────────────────────────────────────────────────────────┘

insert into med_topics (id, chapter_id, name, sort_order, is_important) values
-- Units and Measurements
('phy-units-si', 'phy-units-measurement', 'SI Units and System', 1, true),
('phy-units-errors', 'phy-units-measurement', 'Errors in Measurement', 2, true),
('phy-units-dimensions', 'phy-units-measurement', 'Dimensional Analysis', 3, true),
('phy-units-significant', 'phy-units-measurement', 'Significant Figures', 4, false),

-- Kinematics
('phy-kin-motion-1d', 'phy-kinematics', 'Motion in One Dimension', 1, true),
('phy-kin-vectors', 'phy-kinematics', 'Vectors', 2, true),
('phy-kin-projectile', 'phy-kinematics', 'Projectile Motion', 3, true),
('phy-kin-circular', 'phy-kinematics', 'Circular Motion', 4, true),

-- Laws of Motion
('phy-laws-newton', 'phy-laws-of-motion', 'Newton Laws of Motion', 1, true),
('phy-laws-friction', 'phy-laws-of-motion', 'Friction', 2, true),
('phy-laws-circular-dynamics', 'phy-laws-of-motion', 'Circular Motion Dynamics', 3, true),

-- Work Energy Power
('phy-wep-work', 'phy-work-energy-power', 'Work and Work-Energy Theorem', 1, true),
('phy-wep-energy', 'phy-work-energy-power', 'Kinetic and Potential Energy', 2, true),
('phy-wep-collisions', 'phy-work-energy-power', 'Collisions', 3, true),
('phy-wep-power', 'phy-work-energy-power', 'Power', 4, false),

-- Rotational Motion
('phy-rot-torque', 'phy-rotational-motion', 'Torque', 1, true),
('phy-rot-angular-momentum', 'phy-rotational-motion', 'Angular Momentum', 2, true),
('phy-rot-moi', 'phy-rotational-motion', 'Moment of Inertia', 3, true),
('phy-rot-rolling', 'phy-rotational-motion', 'Rolling Motion', 4, true),

-- Gravitation
('phy-grav-laws', 'phy-gravitation', 'Newton Law of Gravitation', 1, true),
('phy-grav-kepler', 'phy-gravitation', 'Kepler Laws', 2, true),
('phy-grav-satellite', 'phy-gravitation', 'Satellites', 3, true),
('phy-grav-escape', 'phy-gravitation', 'Escape Velocity', 4, true),

-- Properties of Matter
('phy-prop-elasticity', 'phy-properties-matter', 'Elasticity', 1, true),
('phy-prop-viscosity', 'phy-properties-matter', 'Viscosity', 2, true),
('phy-prop-surface-tension', 'phy-properties-matter', 'Surface Tension', 3, true),
('phy-prop-bernoulli', 'phy-properties-matter', 'Bernoulli Principle', 4, true),

-- Thermodynamics
('phy-thermo-first-law', 'phy-thermodynamics', 'First Law of Thermodynamics', 1, true),
('phy-thermo-second-law', 'phy-thermodynamics', 'Second Law of Thermodynamics', 2, true),
('phy-thermo-carnot', 'phy-thermodynamics', 'Carnot Engine', 3, true),
('phy-thermo-processes', 'phy-thermodynamics', 'Thermodynamic Processes', 4, true),

-- Kinetic Theory
('phy-kinetic-gas-laws', 'phy-kinetic-theory', 'Gas Laws', 1, true),
('phy-kinetic-rms', 'phy-kinetic-theory', 'RMS Speed', 2, true),
('phy-kinetic-dof', 'phy-kinetic-theory', 'Degrees of Freedom', 3, true),

-- Oscillations and Waves
('phy-osc-shm', 'phy-oscillations-waves', 'Simple Harmonic Motion', 1, true),
('phy-osc-wave-motion', 'phy-oscillations-waves', 'Wave Motion', 2, true),
('phy-osc-sound', 'phy-oscillations-waves', 'Sound Waves', 3, true),
('phy-osc-beats', 'phy-oscillations-waves', 'Beats and Doppler Effect', 4, true),

-- Electrostatics
('phy-elec-coulomb', 'phy-electrostatics', 'Coulomb Law', 1, true),
('phy-elec-field', 'phy-electrostatics', 'Electric Field', 2, true),
('phy-elec-gauss', 'phy-electrostatics', 'Gauss Law', 3, true),
('phy-elec-capacitor', 'phy-electrostatics', 'Capacitors', 4, true),

-- Current Electricity
('phy-curr-ohm', 'phy-current-electricity', 'Ohm Law', 1, true),
('phy-curr-kirchhoff', 'phy-current-electricity', 'Kirchhoff Laws', 2, true),
('phy-curr-wheatstone', 'phy-current-electricity', 'Wheatstone Bridge', 3, true),
('phy-curr-potentiometer', 'phy-current-electricity', 'Potentiometer', 4, true),

-- Magnetic Effects
('phy-mag-biot-savart', 'phy-magnetic-effects', 'Biot-Savart Law', 1, true),
('phy-mag-ampere', 'phy-magnetic-effects', 'Ampere Law', 2, true),
('phy-mag-force', 'phy-magnetic-effects', 'Force on Current Carrying Conductor', 3, true),
('phy-mag-materials', 'phy-magnetic-effects', 'Magnetic Materials', 4, true),

-- EM Induction
('phy-emi-faraday', 'phy-em-induction', 'Faraday Law', 1, true),
('phy-emi-lenz', 'phy-em-induction', 'Lenz Law', 2, true),
('phy-emi-transformer', 'phy-em-induction', 'Transformers', 3, true),
('phy-emi-ac', 'phy-em-induction', 'AC Circuits', 4, true),

-- EM Waves
('phy-emw-spectrum', 'phy-em-waves', 'EM Spectrum', 1, true),
('phy-emw-properties', 'phy-em-waves', 'Properties of EM Waves', 2, true),

-- Optics
('phy-opt-ray', 'phy-optics', 'Ray Optics', 1, true),
('phy-opt-wave', 'phy-optics', 'Wave Optics', 2, true),
('phy-opt-interference', 'phy-optics', 'Interference', 3, true),
('phy-opt-diffraction', 'phy-optics', 'Diffraction', 4, true),
('phy-opt-polarization', 'phy-optics', 'Polarization', 5, true),

-- Dual Nature
('phy-dual-photoelectric', 'phy-dual-nature', 'Photoelectric Effect', 1, true),
('phy-dual-debroglie', 'phy-dual-nature', 'de Broglie Waves', 2, true),

-- Atoms and Nuclei
('phy-atom-bohr', 'phy-atoms-nuclei', 'Bohr Model', 1, true),
('phy-atom-nuclear', 'phy-atoms-nuclei', 'Nuclear Physics', 2, true),
('phy-atom-radioactivity', 'phy-atoms-nuclei', 'Radioactivity', 3, true),

-- Electronic Devices
('phy-elec-semiconductor', 'phy-electronic-devices', 'Semiconductors', 1, true),
('phy-elec-diode', 'phy-electronic-devices', 'p-n Junction Diode', 2, true),
('phy-elec-transistor', 'phy-electronic-devices', 'Transistors', 3, true),
('phy-elec-logic', 'phy-electronic-devices', 'Logic Gates', 4, true)
on conflict (id) do nothing;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ CHEMISTRY TOPICS                                                            │
-- └─────────────────────────────────────────────────────────────────────────────┘

insert into med_topics (id, chapter_id, name, sort_order, is_important) values
-- Basic Concepts
('chem-basic-mole', 'chem-basic-concepts', 'Mole Concept', 1, true),
('chem-basic-stoich', 'chem-basic-concepts', 'Stoichiometry', 2, true),
('chem-basic-empirical', 'chem-basic-concepts', 'Empirical and Molecular Formula', 3, true),

-- Atomic Structure
('chem-atom-bohr', 'chem-atomic-structure', 'Bohr Model', 1, true),
('chem-atom-quantum', 'chem-atomic-structure', 'Quantum Numbers', 2, true),
('chem-atom-config', 'chem-atomic-structure', 'Electronic Configuration', 3, true),

-- Chemical Bonding
('chem-bond-vsepr', 'chem-chemical-bonding', 'VSEPR Theory', 1, true),
('chem-bond-hybrid', 'chem-chemical-bonding', 'Hybridization', 2, true),
('chem-bond-mo', 'chem-chemical-bonding', 'Molecular Orbital Theory', 3, true),
('chem-bond-hydrogen', 'chem-chemical-bonding', 'Hydrogen Bonding', 4, true),

-- Thermodynamics
('chem-thermo-enthalpy', 'chem-thermodynamics', 'Enthalpy', 1, true),
('chem-thermo-hess', 'chem-thermodynamics', 'Hess Law', 2, true),
('chem-thermo-gibbs', 'chem-thermodynamics', 'Gibbs Energy', 3, true),

-- Equilibrium
('chem-eq-chemical', 'chem-equilibrium', 'Chemical Equilibrium', 1, true),
('chem-eq-lechatelier', 'chem-equilibrium', 'Le Chatelier Principle', 2, true),
('chem-eq-buffer', 'chem-equilibrium', 'Buffer Solutions', 3, true),
('chem-eq-ksp', 'chem-equilibrium', 'Solubility Product', 4, true),

-- Solutions
('chem-sol-concentration', 'chem-solutions', 'Concentration Terms', 1, true),
('chem-sol-raoult', 'chem-solutions', 'Raoult Law', 2, true),
('chem-sol-colligative', 'chem-solutions', 'Colligative Properties', 3, true),

-- Electrochemistry
('chem-electro-nernst', 'chem-electrochemistry', 'Nernst Equation', 1, true),
('chem-electro-conductivity', 'chem-electrochemistry', 'Conductivity', 2, true),
('chem-electro-cells', 'chem-electrochemistry', 'Electrochemical Cells', 3, true),

-- Kinetics
('chem-kin-rate', 'chem-kinetics', 'Rate Law', 1, true),
('chem-kin-order', 'chem-kinetics', 'Order of Reaction', 2, true),
('chem-kin-arrhenius', 'chem-kinetics', 'Arrhenius Equation', 3, true),

-- Coordination Compounds
('chem-coord-werner', 'chem-coordination', 'Werner Theory', 1, true),
('chem-coord-isomerism', 'chem-coordination', 'Isomerism', 2, true),
('chem-coord-vbt', 'chem-coordination', 'Valence Bond Theory', 3, true),
('chem-coord-cft', 'chem-coordination', 'Crystal Field Theory', 4, true),

-- Organic Basics
('chem-org-nomenclature', 'chem-organic-basics', 'IUPAC Nomenclature', 1, true),
('chem-org-isomerism', 'chem-organic-basics', 'Isomerism', 2, true),
('chem-org-effects', 'chem-organic-basics', 'Electronic Effects', 3, true),
('chem-org-mechanisms', 'chem-organic-basics', 'Reaction Mechanisms', 4, true),

-- Hydrocarbons
('chem-hc-alkanes', 'chem-hydrocarbons', 'Alkanes', 1, true),
('chem-hc-alkenes', 'chem-hydrocarbons', 'Alkenes', 2, true),
('chem-hc-alkynes', 'chem-hydrocarbons', 'Alkynes', 3, true),
('chem-hc-aromatic', 'chem-hydrocarbons', 'Aromatic Compounds', 4, true),

-- Aldehydes Ketones
('chem-ald-nucleophilic', 'chem-aldehydes-ketones', 'Nucleophilic Addition', 1, true),
('chem-ald-aldol', 'chem-aldehydes-ketones', 'Aldol Condensation', 2, true),
('chem-ald-cannizzaro', 'chem-aldehydes-ketones', 'Cannizzaro Reaction', 3, true)
on conflict (id) do nothing;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ BOTANY TOPICS                                                               │
-- └─────────────────────────────────────────────────────────────────────────────┘

insert into med_topics (id, chapter_id, name, sort_order, is_important) values
-- Cell Unit of Life
('bot-cell-theory', 'bot-cell-unit', 'Cell Theory', 1, true),
('bot-cell-prokaryotic', 'bot-cell-unit', 'Prokaryotic Cells', 2, true),
('bot-cell-eukaryotic', 'bot-cell-unit', 'Eukaryotic Cells', 3, true),
('bot-cell-organelles', 'bot-cell-unit', 'Cell Organelles', 4, true),

-- Cell Cycle
('bot-cycle-phases', 'bot-cell-cycle', 'Cell Cycle Phases', 1, true),
('bot-cycle-mitosis', 'bot-cell-cycle', 'Mitosis', 2, true),
('bot-cycle-meiosis', 'bot-cell-cycle', 'Meiosis', 3, true),
('bot-cycle-significance', 'bot-cell-cycle', 'Significance of Cell Division', 4, true),

-- Biological Classification
('bot-class-monera', 'bot-biological-classification', 'Kingdom Monera', 1, true),
('bot-class-protista', 'bot-biological-classification', 'Kingdom Protista', 2, true),
('bot-class-fungi', 'bot-biological-classification', 'Kingdom Fungi', 3, true),
('bot-class-viruses', 'bot-biological-classification', 'Viruses and Viroids', 4, true),

-- Plant Kingdom
('bot-plant-algae', 'bot-plant-kingdom', 'Algae', 1, true),
('bot-plant-bryophytes', 'bot-plant-kingdom', 'Bryophytes', 2, true),
('bot-plant-pteridophytes', 'bot-plant-kingdom', 'Pteridophytes', 3, true),
('bot-plant-gymnosperms', 'bot-plant-kingdom', 'Gymnosperms', 4, true),
('bot-plant-angiosperms', 'bot-plant-kingdom', 'Angiosperms', 5, true),

-- Morphology
('bot-morph-root', 'bot-morphology-flowering', 'Root', 1, true),
('bot-morph-stem', 'bot-morphology-flowering', 'Stem', 2, true),
('bot-morph-leaf', 'bot-morphology-flowering', 'Leaf', 3, true),
('bot-morph-flower', 'bot-morphology-flowering', 'Flower', 4, true),
('bot-morph-fruit', 'bot-morphology-flowering', 'Fruit', 5, true),
('bot-morph-families', 'bot-morphology-flowering', 'Plant Families', 6, true),

-- Anatomy
('bot-anat-tissues', 'bot-anatomy-flowering', 'Plant Tissues', 1, true),
('bot-anat-meristems', 'bot-anatomy-flowering', 'Meristems', 2, true),
('bot-anat-vascular', 'bot-anatomy-flowering', 'Vascular Bundles', 3, true),
('bot-anat-secondary', 'bot-anatomy-flowering', 'Secondary Growth', 4, true),

-- Photosynthesis
('bot-photo-light', 'bot-photosynthesis', 'Light Reactions', 1, true),
('bot-photo-dark', 'bot-photosynthesis', 'Dark Reactions', 2, true),
('bot-photo-c3c4', 'bot-photosynthesis', 'C3 and C4 Pathways', 3, true),
('bot-photo-photorespiration', 'bot-photosynthesis', 'Photorespiration', 4, true),

-- Respiration
('bot-resp-glycolysis', 'bot-respiration', 'Glycolysis', 1, true),
('bot-resp-krebs', 'bot-respiration', 'Krebs Cycle', 2, true),
('bot-resp-etc', 'bot-respiration', 'Electron Transport Chain', 3, true),
('bot-resp-fermentation', 'bot-respiration', 'Fermentation', 4, true),

-- Plant Growth
('bot-growth-regulators', 'bot-plant-growth', 'Plant Growth Regulators', 1, true),
('bot-growth-auxin', 'bot-plant-growth', 'Auxin', 2, true),
('bot-growth-gibberellin', 'bot-plant-growth', 'Gibberellin', 3, true),
('bot-growth-development', 'bot-plant-growth', 'Development Processes', 4, true),

-- Sexual Reproduction
('bot-repro-flower', 'bot-sexual-reproduction', 'Flower Structure', 1, true),
('bot-repro-pollination', 'bot-sexual-reproduction', 'Pollination', 2, true),
('bot-repro-fertilization', 'bot-sexual-reproduction', 'Double Fertilization', 3, true),
('bot-repro-embryo', 'bot-sexual-reproduction', 'Embryo Development', 4, true),

-- Inheritance
('bot-inherit-mendel', 'bot-inheritance', 'Mendel Laws', 1, true),
('bot-inherit-linkage', 'bot-inheritance', 'Linkage and Crossing Over', 2, true),
('bot-inherit-sex', 'bot-inheritance', 'Sex Determination', 3, true),
('bot-inherit-disorders', 'bot-inheritance', 'Genetic Disorders', 4, true),

-- Molecular Inheritance
('bot-mol-dna-structure', 'bot-molecular-inheritance', 'DNA Structure', 1, true),
('bot-mol-replication', 'bot-molecular-inheritance', 'DNA Replication', 2, true),
('bot-mol-transcription', 'bot-molecular-inheritance', 'Transcription', 3, true),
('bot-mol-translation', 'bot-molecular-inheritance', 'Translation', 4, true),
('bot-mol-operon', 'bot-molecular-inheritance', 'Lac Operon', 5, true),
('bot-mol-hgp', 'bot-molecular-inheritance', 'Human Genome Project', 6, true),

-- Ecosystem
('bot-eco-energy', 'bot-ecosystem', 'Energy Flow', 1, true),
('bot-eco-pyramids', 'bot-ecosystem', 'Ecological Pyramids', 2, true),
('bot-eco-nutrient', 'bot-ecosystem', 'Nutrient Cycling', 3, true)
on conflict (id) do nothing;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ ZOOLOGY TOPICS                                                              │
-- └─────────────────────────────────────────────────────────────────────────────┘

insert into med_topics (id, chapter_id, name, sort_order, is_important) values
-- Animal Kingdom
('zoo-kingdom-classification', 'zoo-animal-kingdom', 'Basis of Classification', 1, true),
('zoo-kingdom-porifera', 'zoo-animal-kingdom', 'Phylum Porifera', 2, true),
('zoo-kingdom-cnidaria', 'zoo-animal-kingdom', 'Phylum Cnidaria', 3, true),
('zoo-kingdom-platyhelminthes', 'zoo-animal-kingdom', 'Phylum Platyhelminthes', 4, true),
('zoo-kingdom-annelida', 'zoo-animal-kingdom', 'Phylum Annelida', 5, true),
('zoo-kingdom-arthropoda', 'zoo-animal-kingdom', 'Phylum Arthropoda', 6, true),
('zoo-kingdom-mollusca', 'zoo-animal-kingdom', 'Phylum Mollusca', 7, true),
('zoo-kingdom-chordata', 'zoo-animal-kingdom', 'Phylum Chordata', 8, true),

-- Structural Organization
('zoo-struct-tissues', 'zoo-structural-organization', 'Animal Tissues', 1, true),
('zoo-struct-epithelium', 'zoo-structural-organization', 'Epithelial Tissue', 2, true),
('zoo-struct-connective', 'zoo-structural-organization', 'Connective Tissue', 3, true),
('zoo-struct-cockroach', 'zoo-structural-organization', 'Cockroach Anatomy', 4, true),
('zoo-struct-frog', 'zoo-structural-organization', 'Frog Anatomy', 5, true),

-- Biomolecules
('zoo-bio-carbs', 'zoo-biomolecules', 'Carbohydrates', 1, true),
('zoo-bio-proteins', 'zoo-biomolecules', 'Proteins', 2, true),
('zoo-bio-lipids', 'zoo-biomolecules', 'Lipids', 3, true),
('zoo-bio-nucleic', 'zoo-biomolecules', 'Nucleic Acids', 4, true),
('zoo-bio-enzymes', 'zoo-biomolecules', 'Enzymes', 5, true),

-- Breathing
('zoo-breath-system', 'zoo-breathing', 'Respiratory System', 1, true),
('zoo-breath-mechanism', 'zoo-breathing', 'Mechanism of Breathing', 2, true),
('zoo-breath-exchange', 'zoo-breathing', 'Gas Exchange', 3, true),
('zoo-breath-transport', 'zoo-breathing', 'Transport of Gases', 4, true),

-- Body Fluids
('zoo-blood-composition', 'zoo-body-fluids', 'Blood Composition', 1, true),
('zoo-blood-groups', 'zoo-body-fluids', 'Blood Groups', 2, true),
('zoo-blood-heart', 'zoo-body-fluids', 'Human Heart', 3, true),
('zoo-blood-cardiac', 'zoo-body-fluids', 'Cardiac Cycle', 4, true),
('zoo-blood-ecg', 'zoo-body-fluids', 'ECG', 5, true),

-- Excretion
('zoo-excr-nephron', 'zoo-excretion', 'Nephron Structure', 1, true),
('zoo-excr-urine', 'zoo-excretion', 'Urine Formation', 2, true),
('zoo-excr-osmoregulation', 'zoo-excretion', 'Osmoregulation', 3, true),
('zoo-excr-disorders', 'zoo-excretion', 'Kidney Disorders', 4, true),

-- Locomotion
('zoo-loco-muscle', 'zoo-locomotion', 'Muscle Contraction', 1, true),
('zoo-loco-skeletal', 'zoo-locomotion', 'Skeletal System', 2, true),
('zoo-loco-joints', 'zoo-locomotion', 'Joints', 3, true),
('zoo-loco-disorders', 'zoo-locomotion', 'Muscular Disorders', 4, true),

-- Neural Control
('zoo-neural-neuron', 'zoo-neural-control', 'Neuron Structure', 1, true),
('zoo-neural-impulse', 'zoo-neural-control', 'Nerve Impulse', 2, true),
('zoo-neural-brain', 'zoo-neural-control', 'Human Brain', 3, true),
('zoo-neural-reflex', 'zoo-neural-control', 'Reflex Arc', 4, true),

-- Chemical Coordination
('zoo-chem-endocrine', 'zoo-chemical-coordination', 'Endocrine Glands', 1, true),
('zoo-chem-hormones', 'zoo-chemical-coordination', 'Hormones', 2, true),
('zoo-chem-feedback', 'zoo-chemical-coordination', 'Feedback Mechanism', 3, true),

-- Human Reproduction
('zoo-repro-male', 'zoo-human-reproduction', 'Male Reproductive System', 1, true),
('zoo-repro-female', 'zoo-human-reproduction', 'Female Reproductive System', 2, true),
('zoo-repro-gametogenesis', 'zoo-human-reproduction', 'Gametogenesis', 3, true),
('zoo-repro-menstrual', 'zoo-human-reproduction', 'Menstrual Cycle', 4, true),
('zoo-repro-fertilization', 'zoo-human-reproduction', 'Fertilization', 5, true),

-- Reproductive Health
('zoo-rh-contraception', 'zoo-reproductive-health', 'Contraception Methods', 1, true),
('zoo-rh-stds', 'zoo-reproductive-health', 'STDs', 2, true),
('zoo-rh-infertility', 'zoo-reproductive-health', 'Infertility', 3, true),
('zoo-rh-art', 'zoo-reproductive-health', 'Assisted Reproductive Technologies', 4, true),

-- Evolution
('zoo-evo-origin', 'zoo-evolution', 'Origin of Life', 1, true),
('zoo-evo-evidence', 'zoo-evolution', 'Evidence of Evolution', 2, true),
('zoo-evo-natural', 'zoo-evolution', 'Natural Selection', 3, true),
('zoo-evo-human', 'zoo-evolution', 'Human Evolution', 4, true),

-- Human Health
('zoo-health-diseases', 'zoo-human-health', 'Common Diseases', 1, true),
('zoo-health-immunity', 'zoo-human-health', 'Immunity', 2, true),
('zoo-health-aids', 'zoo-human-health', 'AIDS', 3, true),
('zoo-health-cancer', 'zoo-human-health', 'Cancer', 4, true),
('zoo-health-drugs', 'zoo-human-health', 'Drug Abuse', 5, true),

-- Biotechnology Principles
('zoo-biotech-rdna', 'zoo-biotechnology-principles', 'rDNA Technology', 1, true),
('zoo-biotech-pcr', 'zoo-biotechnology-principles', 'PCR', 2, true),
('zoo-biotech-gel', 'zoo-biotechnology-principles', 'Gel Electrophoresis', 3, true),
('zoo-biotech-vectors', 'zoo-biotechnology-principles', 'Vectors', 4, true),
('zoo-biotech-cloning', 'zoo-biotechnology-principles', 'Cloning', 5, true),

-- Biotechnology Applications
('zoo-bioapp-gmo', 'zoo-biotechnology-applications', 'GMO', 1, true),
('zoo-bioapp-bt', 'zoo-biotechnology-applications', 'Bt Crops', 2, true),
('zoo-bioapp-gene-therapy', 'zoo-biotechnology-applications', 'Gene Therapy', 3, true),
('zoo-bioapp-transgenic', 'zoo-biotechnology-applications', 'Transgenic Animals', 4, true)
on conflict (id) do nothing;


-- ════════════════════════════════════════════════════════════════════════════
-- VERIFICATION
-- ════════════════════════════════════════════════════════════════════════════

-- Verify counts
select 'Chapters' as table_name, count(*) as count from med_chapters
union all
select 'Topics', count(*) from med_topics
union all
select 'Questions', count(*) from med_questions;
