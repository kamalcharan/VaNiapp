-- ==========================================================================
-- CUET Business Studies — Replace old 5 generic chapters with correct 12
-- NCERT Class 12 chapters + topics, aligned to CUET_MASTER_PLAN.md
-- ==========================================================================

BEGIN;

-- ── Step 1: Delete old incorrect chapters (cascade removes any topics/questions) ──

DELETE FROM med_chapters WHERE id IN (
  'cuet-bs-principles-mgmt',
  'cuet-bs-business-finance',
  'cuet-bs-marketing',
  'cuet-bs-consumer-ethics',
  'cuet-bs-entrepreneurship'
);


-- ── Step 2: Insert correct 12 chapters ────────────────────────────────────────

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES

-- Part A: Principles and Functions of Management (Chapters 1-8, ~60% weightage)
('cuet-bst-nature-mgmt',       'business-studies', '{"CUET"}', 'Management Principles', 'Nature and Significance of Management',  1, 12,  8.0, 4, '{"Management definition", "Management as art science profession", "Levels of management", "Coordination", "Management functions", "Objectives of management"}'),
('cuet-bst-principles',        'business-studies', '{"CUET"}', 'Management Principles', 'Principles of Management',               2, 12, 10.0, 5, '{"Fayol 14 principles", "Taylor scientific management", "Functional foremanship", "Fayol vs Taylor", "Unity of command", "Division of work"}'),
('cuet-bst-environment',       'business-studies', '{"CUET"}', 'Management Principles', 'Business Environment',                   3, 12,  8.0, 4, '{"Dimensions of business environment", "Economic environment", "Demonetisation", "Liberalisation Privatisation Globalisation", "Impact of government policy"}'),
('cuet-bst-planning',          'business-studies', '{"CUET"}', 'Management Functions',  'Planning',                               4, 12,  8.0, 4, '{"Planning process", "Types of plans", "Objectives policies strategies", "Single-use and standing plans", "Limitations of planning"}'),
('cuet-bst-organising',        'business-studies', '{"CUET"}', 'Management Functions',  'Organising',                             5, 12,  8.0, 4, '{"Formal and informal organisation", "Delegation", "Decentralisation", "Functional and divisional structure", "Importance of organising"}'),
('cuet-bst-staffing',          'business-studies', '{"CUET"}', 'Management Functions',  'Staffing',                               6, 12,  8.0, 4, '{"Recruitment sources", "Selection process", "Training methods", "On-the-job off-the-job training", "Staffing as part of HRM"}'),
('cuet-bst-directing',         'business-studies', '{"CUET"}', 'Management Functions',  'Directing',                              7, 12, 10.0, 5, '{"Motivation theories", "Maslow hierarchy", "Leadership styles", "Communication process", "Barriers to communication", "Supervision"}'),
('cuet-bst-controlling',       'business-studies', '{"CUET"}', 'Management Functions',  'Controlling',                            8, 12,  8.0, 4, '{"Controlling process", "Budgetary control", "Ratio analysis", "Relationship between planning and controlling", "Deviations"}'),

-- Part B: Business Finance and Marketing (Chapters 9-12, ~40% weightage)
('cuet-bst-financial-mgmt',    'business-studies', '{"CUET"}', 'Business Finance',      'Financial Management',                   9, 12, 10.0, 5, '{"Capital structure", "Fixed and working capital", "Factors affecting capital structure", "Trading on equity", "Dividend decision"}'),
('cuet-bst-financial-markets', 'business-studies', '{"CUET"}', 'Business Finance',      'Financial Markets',                     10, 12,  8.0, 4, '{"Money market instruments", "Capital market", "Primary and secondary market", "Stock exchange", "SEBI functions", "Demat system"}'),
('cuet-bst-marketing',         'business-studies', '{"CUET"}', 'Marketing',             'Marketing Management',                  11, 12,  8.0, 4, '{"Marketing mix 4Ps", "Product lifecycle", "Branding packaging labelling", "Pricing strategies", "Channels of distribution", "Promotion mix"}'),
('cuet-bst-consumer-protection','business-studies','{"CUET"}', 'Marketing',             'Consumer Protection',                   12, 12,  6.0, 3, '{"Consumer Protection Act 2019", "Consumer rights", "Consumer responsibilities", "Consumer redressal agencies", "District State National Commission", "NGO role"}')

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  branch = EXCLUDED.branch,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ── Step 3: Insert topics for all 12 chapters ────────────────────────────────

INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES

  -- Ch 1: Nature and Significance of Management (5 topics)
  ('cuet-bst-nm-definition',     'cuet-bst-nature-mgmt', 'Management: Concept, Objectives and Importance',          10, true, true),
  ('cuet-bst-nm-art-sci-prof',   'cuet-bst-nature-mgmt', 'Management as Art, Science and Profession',               20, true, true),
  ('cuet-bst-nm-levels',         'cuet-bst-nature-mgmt', 'Levels of Management (Top, Middle, Operational)',          30, true, true),
  ('cuet-bst-nm-functions',      'cuet-bst-nature-mgmt', 'Functions of Management (POSDC)',                          40, true, true),
  ('cuet-bst-nm-coordination',   'cuet-bst-nature-mgmt', 'Coordination: Nature and Importance',                      50, true, true),

  -- Ch 2: Principles of Management (5 topics)
  ('cuet-bst-pr-nature',         'cuet-bst-principles', 'Nature and Significance of Management Principles',          10, true, true),
  ('cuet-bst-pr-fayol',          'cuet-bst-principles', 'Fayol''s 14 Principles of Management',                     20, true, true),
  ('cuet-bst-pr-taylor',         'cuet-bst-principles', 'Taylor''s Scientific Management: Principles and Techniques',30, true, true),
  ('cuet-bst-pr-foremanship',    'cuet-bst-principles', 'Functional Foremanship',                                    40, true, true),
  ('cuet-bst-pr-fayol-vs-taylor','cuet-bst-principles', 'Fayol vs Taylor: Comparison',                              50, true, true),

  -- Ch 3: Business Environment (5 topics)
  ('cuet-bst-env-concept',       'cuet-bst-environment', 'Business Environment: Meaning and Importance',             10, true, true),
  ('cuet-bst-env-dimensions',    'cuet-bst-environment', 'Dimensions: Economic, Social, Technological, Political, Legal', 20, true, true),
  ('cuet-bst-env-lpg',           'cuet-bst-environment', 'Liberalisation, Privatisation and Globalisation (LPG)',    30, true, true),
  ('cuet-bst-env-demonetisation','cuet-bst-environment', 'Demonetisation and its Impact on Business',                40, true, true),
  ('cuet-bst-env-policy',        'cuet-bst-environment', 'Impact of Government Policy Changes on Business',          50, true, true),

  -- Ch 4: Planning (5 topics)
  ('cuet-bst-pl-concept',        'cuet-bst-planning', 'Planning: Concept, Importance and Limitations',               10, true, true),
  ('cuet-bst-pl-process',        'cuet-bst-planning', 'Planning Process (Steps)',                                    20, true, true),
  ('cuet-bst-pl-types-single',   'cuet-bst-planning', 'Single-Use Plans: Programmes and Budgets',                   30, true, true),
  ('cuet-bst-pl-types-standing', 'cuet-bst-planning', 'Standing Plans: Policies, Procedures, Methods and Rules',    40, true, true),
  ('cuet-bst-pl-objectives',     'cuet-bst-planning', 'Objectives, Strategies and Decision-Making',                  50, true, true),

  -- Ch 5: Organising (5 topics)
  ('cuet-bst-org-concept',       'cuet-bst-organising', 'Organising: Meaning, Process and Importance',               10, true, true),
  ('cuet-bst-org-structure',     'cuet-bst-organising', 'Functional and Divisional Organisation Structure',          20, true, true),
  ('cuet-bst-org-formal',        'cuet-bst-organising', 'Formal and Informal Organisation',                          30, true, true),
  ('cuet-bst-org-delegation',    'cuet-bst-organising', 'Delegation of Authority: Elements and Importance',          40, true, true),
  ('cuet-bst-org-decentral',     'cuet-bst-organising', 'Decentralisation: Meaning, Importance, Delegation vs Decentralisation', 50, true, true),

  -- Ch 6: Staffing (5 topics)
  ('cuet-bst-st-concept',        'cuet-bst-staffing', 'Staffing: Meaning, Need and Importance',                      10, true, true),
  ('cuet-bst-st-recruitment',    'cuet-bst-staffing', 'Recruitment: Sources (Internal and External)',                 20, true, true),
  ('cuet-bst-st-selection',      'cuet-bst-staffing', 'Selection Process (Steps)',                                    30, true, true),
  ('cuet-bst-st-training',       'cuet-bst-staffing', 'Training and Development: On-the-Job and Off-the-Job Methods',40, true, true),
  ('cuet-bst-st-hrm',           'cuet-bst-staffing', 'Staffing as Part of Human Resource Management',                50, true, true),

  -- Ch 7: Directing (6 topics)
  ('cuet-bst-dir-concept',       'cuet-bst-directing', 'Directing: Meaning, Principles and Importance',              10, true, true),
  ('cuet-bst-dir-motivation',    'cuet-bst-directing', 'Motivation: Concept, Maslow''s Need Hierarchy and Incentives',20, true, true),
  ('cuet-bst-dir-leadership',    'cuet-bst-directing', 'Leadership: Styles (Autocratic, Democratic, Laissez-faire)', 30, true, true),
  ('cuet-bst-dir-communication', 'cuet-bst-directing', 'Communication: Process, Types and Barriers',                 40, true, true),
  ('cuet-bst-dir-supervision',   'cuet-bst-directing', 'Supervision: Role of a Supervisor',                          50, true, true),
  ('cuet-bst-dir-herzberg',      'cuet-bst-directing', 'Herzberg''s Two-Factor Theory and Financial/Non-Financial Incentives', 60, true, true),

  -- Ch 8: Controlling (4 topics)
  ('cuet-bst-ctrl-concept',      'cuet-bst-controlling', 'Controlling: Meaning, Importance and Limitations',         10, true, true),
  ('cuet-bst-ctrl-process',      'cuet-bst-controlling', 'Steps in Controlling Process',                             20, true, true),
  ('cuet-bst-ctrl-techniques',   'cuet-bst-controlling', 'Techniques: Budgetary Control, Ratio Analysis, PERT',     30, true, true),
  ('cuet-bst-ctrl-planning',     'cuet-bst-controlling', 'Relationship Between Planning and Controlling',            40, true, true),

  -- Ch 9: Financial Management (6 topics)
  ('cuet-bst-fm-concept',        'cuet-bst-financial-mgmt', 'Financial Management: Meaning, Objectives and Role of CFO',  10, true, true),
  ('cuet-bst-fm-decisions',      'cuet-bst-financial-mgmt', 'Financial Decisions: Investment, Financing and Dividend',     20, true, true),
  ('cuet-bst-fm-capital-struct', 'cuet-bst-financial-mgmt', 'Capital Structure: Factors Affecting and Trading on Equity',  30, true, true),
  ('cuet-bst-fm-fixed-capital',  'cuet-bst-financial-mgmt', 'Fixed Capital: Meaning and Factors Affecting Requirement',    40, true, true),
  ('cuet-bst-fm-working-capital','cuet-bst-financial-mgmt', 'Working Capital: Meaning and Factors Affecting Requirement',  50, true, true),
  ('cuet-bst-fm-dividend',       'cuet-bst-financial-mgmt', 'Dividend Decision: Factors Affecting',                         60, true, true),

  -- Ch 10: Financial Markets (5 topics)
  ('cuet-bst-fmkt-concept',      'cuet-bst-financial-markets', 'Financial Markets: Meaning, Types and Functions',           10, true, true),
  ('cuet-bst-fmkt-money',        'cuet-bst-financial-markets', 'Money Market: Instruments (T-Bills, CP, CD, Call Money)',   20, true, true),
  ('cuet-bst-fmkt-capital',      'cuet-bst-financial-markets', 'Capital Market: Primary and Secondary Market',              30, true, true),
  ('cuet-bst-fmkt-stock',        'cuet-bst-financial-markets', 'Stock Exchange: Functions, Trading and Demat System',       40, true, true),
  ('cuet-bst-fmkt-sebi',         'cuet-bst-financial-markets', 'SEBI: Objectives, Functions and Regulatory Role',           50, true, true),

  -- Ch 11: Marketing Management (6 topics)
  ('cuet-bst-mkt-concept',       'cuet-bst-marketing', 'Marketing: Concept, Functions and Marketing Management Philosophies', 10, true, true),
  ('cuet-bst-mkt-mix',           'cuet-bst-marketing', 'Marketing Mix: 4Ps Overview',                                         20, true, true),
  ('cuet-bst-mkt-product',       'cuet-bst-marketing', 'Product: Branding, Packaging, Labelling and Product Life Cycle',      30, true, true),
  ('cuet-bst-mkt-price',         'cuet-bst-marketing', 'Price: Factors Affecting Pricing Decisions',                           40, true, true),
  ('cuet-bst-mkt-place',         'cuet-bst-marketing', 'Place (Distribution): Channels of Distribution',                      50, true, true),
  ('cuet-bst-mkt-promotion',     'cuet-bst-marketing', 'Promotion: Advertising, Sales Promotion, Personal Selling, PR',       60, true, true),

  -- Ch 12: Consumer Protection (5 topics)
  ('cuet-bst-cp-concept',        'cuet-bst-consumer-protection', 'Consumer Protection: Concept, Importance and Need',            10, true, true),
  ('cuet-bst-cp-act',            'cuet-bst-consumer-protection', 'Consumer Protection Act 2019: Key Provisions',                 20, true, true),
  ('cuet-bst-cp-rights',         'cuet-bst-consumer-protection', 'Consumer Rights and Responsibilities',                         30, true, true),
  ('cuet-bst-cp-redressal',      'cuet-bst-consumer-protection', 'Consumer Redressal Agencies: District, State, National',       40, true, true),
  ('cuet-bst-cp-role',           'cuet-bst-consumer-protection', 'Role of Consumer Organisations and NGOs',                      50, true, true)

ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  is_important = EXCLUDED.is_important;

COMMIT;
