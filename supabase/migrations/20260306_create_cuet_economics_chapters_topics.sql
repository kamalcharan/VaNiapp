-- ==========================================================================
-- CUET Economics — Replace old 9 generic chapters with correct 16
-- NCERT Class 12 chapters (Macro + Indian Economic Development) + topics
-- Also keeps 4 Microeconomics chapters from Class 11 (already in DB)
-- Aligned to CUET_MASTER_PLAN.md
-- ==========================================================================

BEGIN;

-- ── Step 1: Rename balance-payments → bop to match master plan ──────────

-- Create the new chapter with correct ID
INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-eco-bop', 'economics', '{"CUET"}', 'Macroeconomics', 'Balance of Payments', 6, 12, 5.0, 2, '{"Current account", "Capital account", "Foreign exchange rate", "Fixed vs flexible exchange rate", "Managed floating", "Trade deficit", "Devaluation vs depreciation"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  branch = EXCLUDED.branch,
  chapter_number = EXCLUDED.chapter_number,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;

-- Remove old balance-payments chapter (no questions exist, safe to delete)
DELETE FROM med_chapters WHERE id = 'cuet-eco-balance-payments';


-- ── Step 2: Add missing macro chapter + all Indian Economic Development ──

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES

-- Part A: Macroeconomics — add the intro chapter (other 5 already exist)
('cuet-eco-macro-intro', 'economics', '{"CUET"}', 'Macroeconomics', 'Introduction to Macroeconomics', 1, 12, 5.0, 2, '{"Macro vs Micro economics", "Circular flow of income", "Stock vs Flow variables", "Basic macroeconomic identities"}'),

-- Part B: Indian Economic Development (10 new chapters)
('cuet-eco-pre-independence',  'economics', '{"CUET"}', 'Indian Economic Development', 'Indian Economy on the Eve of Independence',       7,  12,  6.0, 3, '{"Colonial economic policies", "Agriculture stagnation", "Deindustrialisation", "Infrastructure under British", "Demographic conditions", "Occupational structure"}'),
('cuet-eco-planning-era',      'economics', '{"CUET"}', 'Indian Economic Development', 'Indian Economy 1950-1990 (Planning Era)',          8,  12,  8.0, 4, '{"Five Year Plans", "Industrial Policy Resolution 1956", "Green Revolution", "Trade policy import substitution", "Land reforms", "Licence Permit Quota Raj"}'),
('cuet-eco-lpg-reforms',       'economics', '{"CUET"}', 'Indian Economic Development', 'Liberalisation, Privatisation and Globalisation',  9,  12, 10.0, 5, '{"New Economic Policy 1991", "Industrial liberalisation", "Financial sector reforms", "Trade and investment policy", "Privatisation disinvestment", "WTO", "Impact on sectors"}'),
('cuet-eco-poverty',           'economics', '{"CUET"}', 'Indian Economic Development', 'Poverty',                                         10, 12,  6.0, 3, '{"Absolute and relative poverty", "Poverty line", "Causes of poverty", "Anti-poverty programmes", "MGNREGA", "Tendulkar Committee"}'),
('cuet-eco-human-capital',     'economics', '{"CUET"}', 'Indian Economic Development', 'Human Capital Formation in India',                 11, 12,  6.0, 3, '{"Human capital vs human development", "Sources of human capital", "Role of education and health", "Government expenditure", "Brain drain"}'),
('cuet-eco-rural-dev',         'economics', '{"CUET"}', 'Indian Economic Development', 'Rural Development',                                12, 12,  6.0, 3, '{"Rural credit", "Agricultural marketing", "Diversification", "SHGs", "Organic farming", "Rural infrastructure"}'),
('cuet-eco-employment',        'economics', '{"CUET"}', 'Indian Economic Development', 'Employment: Growth, Informalisation and Others',   13, 12,  6.0, 3, '{"Types of employment", "Formal vs informal sector", "Worker population ratio", "Unemployment types", "Government schemes", "Informalisation"}'),
('cuet-eco-infrastructure',    'economics', '{"CUET"}', 'Indian Economic Development', 'Infrastructure',                                   14, 12,  6.0, 3, '{"Economic vs social infrastructure", "Energy sources", "Health infrastructure", "Education infrastructure", "Rural urban gap"}'),
('cuet-eco-environment',       'economics', '{"CUET"}', 'Indian Economic Development', 'Environment and Sustainable Development',          15, 12,  6.0, 3, '{"Absorptive capacity", "Global warming", "Ozone depletion", "Sustainable development strategies", "Pollution types"}'),
('cuet-eco-dev-experience',    'economics', '{"CUET"}', 'Indian Economic Development', 'Comparative Development Experience of India',      16, 12,  5.0, 2, '{"India vs Pakistan vs China", "Demographic indicators", "GDP comparison", "HDI comparison", "Development strategies"}')

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  branch = EXCLUDED.branch,
  chapter_number = EXCLUDED.chapter_number,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ── Step 3: Update existing macro chapters to have correct chapter_numbers ──

UPDATE med_chapters SET chapter_number = 2, branch = 'Macroeconomics'
WHERE id = 'cuet-eco-national-income';

UPDATE med_chapters SET chapter_number = 3, branch = 'Macroeconomics'
WHERE id = 'cuet-eco-money-banking';

UPDATE med_chapters SET chapter_number = 4, branch = 'Macroeconomics'
WHERE id = 'cuet-eco-income-employment';

UPDATE med_chapters SET chapter_number = 5, branch = 'Macroeconomics'
WHERE id = 'cuet-eco-govt-budget';


-- ── Step 4: Insert topics for ALL 16 chapters ──────────────────────────────

INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES

  -- ═══════════════════════════════════════════════════════════
  -- PART A: MACROECONOMICS (Chapters 1-6)
  -- ═══════════════════════════════════════════════════════════

  -- Ch 1: Introduction to Macroeconomics (4 topics)
  ('cuet-eco-mi-macro-vs-micro',    'cuet-eco-macro-intro', 'Macro vs Micro Economics: Meaning and Differences',           10, true, true),
  ('cuet-eco-mi-circular-flow',     'cuet-eco-macro-intro', 'Circular Flow of Income (Two-Sector and Three-Sector Models)',20, true, true),
  ('cuet-eco-mi-stock-flow',        'cuet-eco-macro-intro', 'Stock and Flow Variables',                                    30, true, true),
  ('cuet-eco-mi-basic-concepts',    'cuet-eco-macro-intro', 'Basic Concepts: GDP, GNP, NNP, NDP at Market Price and Factor Cost', 40, true, true),

  -- Ch 2: National Income Accounting (5 topics)
  ('cuet-eco-ni-concepts',          'cuet-eco-national-income', 'National Income Aggregates: GDP, GNP, NNP, NDP, PI, DI',  10, true, true),
  ('cuet-eco-ni-methods',           'cuet-eco-national-income', 'Methods of Calculation: Income, Expenditure, Value Added', 20, true, true),
  ('cuet-eco-ni-real-nominal',      'cuet-eco-national-income', 'Real vs Nominal GDP and GDP Deflator',                     30, true, true),
  ('cuet-eco-ni-market-factor',     'cuet-eco-national-income', 'GDP at Market Price vs Factor Cost: Adjustments',          40, true, true),
  ('cuet-eco-ni-precautions',       'cuet-eco-national-income', 'Precautions in Calculation and National Disposable Income',50, true, true),

  -- Ch 3: Money and Banking (5 topics)
  ('cuet-eco-mb-functions',         'cuet-eco-money-banking', 'Money: Meaning, Evolution and Functions',                     10, true, true),
  ('cuet-eco-mb-supply',            'cuet-eco-money-banking', 'Money Supply: Components (M1, M2, M3, M4)',                  20, true, true),
  ('cuet-eco-mb-commercial',        'cuet-eco-money-banking', 'Commercial Banks: Functions and Credit Creation',             30, true, true),
  ('cuet-eco-mb-central',           'cuet-eco-money-banking', 'Central Bank (RBI): Functions and Monetary Policy',           40, true, true),
  ('cuet-eco-mb-instruments',       'cuet-eco-money-banking', 'Credit Control Instruments: CRR, SLR, Repo, Reverse Repo, OMO', 50, true, true),

  -- Ch 4: Income and Employment (5 topics)
  ('cuet-eco-ie-ad-as',             'cuet-eco-income-employment', 'Aggregate Demand and Aggregate Supply',                   10, true, true),
  ('cuet-eco-ie-consumption',       'cuet-eco-income-employment', 'Consumption Function: APC, MPC and Propensity to Save',  20, true, true),
  ('cuet-eco-ie-multiplier',        'cuet-eco-income-employment', 'Investment Multiplier: Concept and Working',              30, true, true),
  ('cuet-eco-ie-equilibrium',       'cuet-eco-income-employment', 'Equilibrium Income: AD-AS and S-I Approach',             40, true, true),
  ('cuet-eco-ie-excess-deficient',  'cuet-eco-income-employment', 'Excess and Deficient Demand: Inflationary and Deflationary Gap', 50, true, true),

  -- Ch 5: Government Budget (5 topics)
  ('cuet-eco-gb-components',        'cuet-eco-govt-budget', 'Budget: Meaning, Objectives and Components',                    10, true, true),
  ('cuet-eco-gb-revenue',           'cuet-eco-govt-budget', 'Revenue Receipts and Revenue Expenditure',                      20, true, true),
  ('cuet-eco-gb-capital',           'cuet-eco-govt-budget', 'Capital Receipts and Capital Expenditure',                      30, true, true),
  ('cuet-eco-gb-deficits',          'cuet-eco-govt-budget', 'Deficit Types: Revenue, Fiscal and Primary Deficit',            40, true, true),
  ('cuet-eco-gb-fiscal-policy',     'cuet-eco-govt-budget', 'Fiscal Policy: Measures to Correct Excess and Deficient Demand',50, true, true),

  -- Ch 6: Balance of Payments (5 topics)
  ('cuet-eco-bop-accounts',         'cuet-eco-bop', 'Balance of Payments: Current Account and Capital Account',              10, true, true),
  ('cuet-eco-bop-trade',            'cuet-eco-bop', 'Balance of Trade and its Components',                                   20, true, true),
  ('cuet-eco-bop-forex-rate',       'cuet-eco-bop', 'Foreign Exchange Rate: Fixed, Flexible and Managed Floating',           30, true, true),
  ('cuet-eco-bop-forex-market',     'cuet-eco-bop', 'Determination of Exchange Rate: Demand and Supply of Foreign Exchange', 40, true, true),
  ('cuet-eco-bop-devaluation',      'cuet-eco-bop', 'Devaluation vs Depreciation and their Effects',                         50, true, true),

  -- ═══════════════════════════════════════════════════════════
  -- PART B: INDIAN ECONOMIC DEVELOPMENT (Chapters 7-16)
  -- ═══════════════════════════════════════════════════════════

  -- Ch 7: Indian Economy on Eve of Independence (4 topics)
  ('cuet-eco-pi-colonial',          'cuet-eco-pre-independence', 'Colonial Economic Policies and their Impact',              10, true, true),
  ('cuet-eco-pi-agriculture',       'cuet-eco-pre-independence', 'Agriculture: Stagnation and Zamindari System',             20, true, true),
  ('cuet-eco-pi-industry',          'cuet-eco-pre-independence', 'Industrial Sector: Deindustrialisation and Decline',       30, true, true),
  ('cuet-eco-pi-infra-demog',       'cuet-eco-pre-independence', 'Infrastructure, Demographic Conditions and Occupational Structure', 40, true, true),

  -- Ch 8: Indian Economy 1950-1990 (5 topics)
  ('cuet-eco-pe-goals',             'cuet-eco-planning-era', 'Goals of Five Year Plans and Planning Commission',              10, true, true),
  ('cuet-eco-pe-agriculture',       'cuet-eco-planning-era', 'Agriculture: Land Reforms and Green Revolution',                20, true, true),
  ('cuet-eco-pe-industry',          'cuet-eco-planning-era', 'Industry: IPR 1956, Public Sector and Licence Raj',            30, true, true),
  ('cuet-eco-pe-trade',             'cuet-eco-planning-era', 'Trade Policy: Import Substitution and Inward-Looking Strategy', 40, true, true),
  ('cuet-eco-pe-assessment',        'cuet-eco-planning-era', 'Assessment of Planning Era: Successes and Failures',            50, true, true),

  -- Ch 9: LPG Reforms (5 topics)
  ('cuet-eco-lpg-background',       'cuet-eco-lpg-reforms', 'Background and Need for New Economic Policy 1991',              10, true, true),
  ('cuet-eco-lpg-liberalisation',   'cuet-eco-lpg-reforms', 'Liberalisation: Industrial, Financial and Trade Sector Reforms',20, true, true),
  ('cuet-eco-lpg-privatisation',    'cuet-eco-lpg-reforms', 'Privatisation: Meaning, Disinvestment and its Impact',          30, true, true),
  ('cuet-eco-lpg-globalisation',    'cuet-eco-lpg-reforms', 'Globalisation: WTO, FDI and Outsourcing',                       40, true, true),
  ('cuet-eco-lpg-impact',           'cuet-eco-lpg-reforms', 'Impact of Reforms on Agriculture, Industry and Trade',          50, true, true),

  -- Ch 10: Poverty (4 topics)
  ('cuet-eco-pov-concepts',         'cuet-eco-poverty', 'Poverty: Absolute, Relative and Poverty Line',                      10, true, true),
  ('cuet-eco-pov-causes',           'cuet-eco-poverty', 'Causes of Poverty in India',                                        20, true, true),
  ('cuet-eco-pov-programmes',       'cuet-eco-poverty', 'Anti-Poverty Programmes: MGNREGA, NRLM, PMAY and Others',          30, true, true),
  ('cuet-eco-pov-trends',           'cuet-eco-poverty', 'Poverty Trends, Tendulkar Committee and Urban-Rural Divide',        40, true, true),

  -- Ch 11: Human Capital Formation (4 topics)
  ('cuet-eco-hc-concept',           'cuet-eco-human-capital', 'Human Capital: Meaning, Sources and Importance',               10, true, true),
  ('cuet-eco-hc-vs-hd',             'cuet-eco-human-capital', 'Human Capital Formation vs Human Development',                 20, true, true),
  ('cuet-eco-hc-education',         'cuet-eco-human-capital', 'Role of Education and Health in Economic Development',         30, true, true),
  ('cuet-eco-hc-govt-expenditure',  'cuet-eco-human-capital', 'Government Expenditure on Education and Health; Brain Drain',  40, true, true),

  -- Ch 12: Rural Development (4 topics)
  ('cuet-eco-rd-credit',            'cuet-eco-rural-dev', 'Rural Credit: Institutional and Non-Institutional Sources',        10, true, true),
  ('cuet-eco-rd-marketing',         'cuet-eco-rural-dev', 'Agricultural Marketing: Reforms and Challenges',                   20, true, true),
  ('cuet-eco-rd-diversification',   'cuet-eco-rural-dev', 'Diversification: Animal Husbandry, Fisheries, Horticulture',      30, true, true),
  ('cuet-eco-rd-sustainable',       'cuet-eco-rural-dev', 'SHGs, Organic Farming and Rural Infrastructure',                   40, true, true),

  -- Ch 13: Employment (4 topics)
  ('cuet-eco-emp-types',            'cuet-eco-employment', 'Types: Self-Employed, Regular Wage and Casual Workers',            10, true, true),
  ('cuet-eco-emp-formal-informal',  'cuet-eco-employment', 'Formal vs Informal Sector: Characteristics and Size',             20, true, true),
  ('cuet-eco-emp-unemployment',     'cuet-eco-employment', 'Unemployment: Types (Disguised, Seasonal, Structural, Frictional)',30, true, true),
  ('cuet-eco-emp-govt-schemes',     'cuet-eco-employment', 'Government Employment Schemes and Informalisation of Workforce',   40, true, true),

  -- Ch 14: Infrastructure (4 topics)
  ('cuet-eco-inf-concept',          'cuet-eco-infrastructure', 'Infrastructure: Economic vs Social, Meaning and Importance',   10, true, true),
  ('cuet-eco-inf-energy',           'cuet-eco-infrastructure', 'Energy: Conventional and Non-Conventional Sources',            20, true, true),
  ('cuet-eco-inf-health',           'cuet-eco-infrastructure', 'Health Infrastructure: Challenges and Government Initiatives', 30, true, true),
  ('cuet-eco-inf-education',        'cuet-eco-infrastructure', 'Education Infrastructure and Rural-Urban Gaps',                40, true, true),

  -- Ch 15: Environment and Sustainable Development (4 topics)
  ('cuet-eco-env-concepts',         'cuet-eco-environment', 'Environment: Functions, Absorptive and Carrying Capacity',        10, true, true),
  ('cuet-eco-env-problems',         'cuet-eco-environment', 'Environmental Problems: Global Warming, Ozone Depletion, Pollution', 20, true, true),
  ('cuet-eco-env-sustainable',      'cuet-eco-environment', 'Sustainable Development: Meaning, Strategies and Importance',     30, true, true),
  ('cuet-eco-env-india',            'cuet-eco-environment', 'India''s Environmental Challenges and Policy Response',           40, true, true),

  -- Ch 16: Comparative Development Experience (4 topics)
  ('cuet-eco-de-overview',          'cuet-eco-dev-experience', 'India, Pakistan and China: Development Path Overview',         10, true, true),
  ('cuet-eco-de-demographic',       'cuet-eco-dev-experience', 'Demographic Indicators: Population, Growth Rate, HDI',        20, true, true),
  ('cuet-eco-de-economic',          'cuet-eco-dev-experience', 'Economic Indicators: GDP, Sectoral Composition, Trade',       30, true, true),
  ('cuet-eco-de-lessons',           'cuet-eco-dev-experience', 'Lessons from Development Experience of Neighbours',            40, true, true)

ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  is_important = EXCLUDED.is_important;

COMMIT;
