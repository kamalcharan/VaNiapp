-- ==========================================================================
-- Create CUET Accountancy topics for all 8 chapters.
-- Derived from important_topics defined in add_cuet_chapters migration.
-- ==========================================================================

INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES

  -- cuet-acc-npo: Accounting for Not-for-Profit Organizations (6 topics)
  ('cuet-acc-npo-receipts',       'cuet-acc-npo', 'Receipts and Payments Account',          10, true, true),
  ('cuet-acc-npo-income',         'cuet-acc-npo', 'Income and Expenditure Account',          20, true, true),
  ('cuet-acc-npo-balance-sheet',  'cuet-acc-npo', 'Balance Sheet of NPO',                   30, true, true),
  ('cuet-acc-npo-subscriptions',  'cuet-acc-npo', 'Subscriptions and Outstanding Amounts',   40, true, true),
  ('cuet-acc-npo-donations',      'cuet-acc-npo', 'Donations (Revenue and Capital)',          50, true, true),
  ('cuet-acc-npo-fund-based',     'cuet-acc-npo', 'Fund-Based Accounting and Special Funds', 60, true, true),

  -- cuet-acc-partnership-basics: Partnership Fundamentals (5 topics)
  ('cuet-acc-pb-deed',            'cuet-acc-partnership-basics', 'Partnership Deed and Provisions',        10, true, true),
  ('cuet-acc-pb-profit-sharing',  'cuet-acc-partnership-basics', 'Profit and Loss Appropriation Account',  20, true, true),
  ('cuet-acc-pb-interest-capital','cuet-acc-partnership-basics', 'Interest on Capital and Drawings',       30, true, true),
  ('cuet-acc-pb-salary-commission','cuet-acc-partnership-basics','Partner Salary, Commission and Rent',    40, true, true),
  ('cuet-acc-pb-guarantee',       'cuet-acc-partnership-basics', 'Guarantee of Profits and Past Adjustments',50, true, true),

  -- cuet-acc-reconstitution: Reconstitution of Partnership (6 topics)
  ('cuet-acc-rec-goodwill',       'cuet-acc-reconstitution', 'Goodwill: Nature and Valuation',          10, true, true),
  ('cuet-acc-rec-admission',      'cuet-acc-reconstitution', 'Admission of a Partner',                  20, true, true),
  ('cuet-acc-rec-retirement',     'cuet-acc-reconstitution', 'Retirement of a Partner',                 30, true, true),
  ('cuet-acc-rec-death',          'cuet-acc-reconstitution', 'Death of a Partner',                      40, true, true),
  ('cuet-acc-rec-revaluation',    'cuet-acc-reconstitution', 'Revaluation of Assets and Liabilities',   50, true, true),
  ('cuet-acc-rec-new-ratio',      'cuet-acc-reconstitution', 'New Profit Sharing Ratio and Sacrificing Ratio', 60, true, true),

  -- cuet-acc-dissolution: Dissolution of Partnership Firms (4 topics)
  ('cuet-acc-dis-modes',          'cuet-acc-dissolution', 'Modes of Dissolution',                    10, true, true),
  ('cuet-acc-dis-settlement',     'cuet-acc-dissolution', 'Settlement of Accounts',                  20, true, true),
  ('cuet-acc-dis-realization',    'cuet-acc-dissolution', 'Realization Account',                     30, true, true),
  ('cuet-acc-dis-insolvency',     'cuet-acc-dissolution', 'Insolvency of Partner (Garner vs Murray)', 40, true, true),

  -- cuet-acc-share-capital: Accounting for Share Capital (5 topics)
  ('cuet-acc-sc-issue',           'cuet-acc-share-capital', 'Issue of Shares (at Par, Premium, Discount)', 10, true, true),
  ('cuet-acc-sc-allotment',       'cuet-acc-share-capital', 'Calls in Arrears and Advance',                20, true, true),
  ('cuet-acc-sc-forfeiture',      'cuet-acc-share-capital', 'Forfeiture and Reissue of Shares',            30, true, true),
  ('cuet-acc-sc-sweat-equity',    'cuet-acc-share-capital', 'Sweat Equity and ESOP',                       40, true, true),
  ('cuet-acc-sc-private',         'cuet-acc-share-capital', 'Private Placement and Rights Issue',           50, true, true),

  -- cuet-acc-debentures: Accounting for Debentures (4 topics)
  ('cuet-acc-deb-issue',          'cuet-acc-debentures', 'Issue of Debentures (Par, Premium, Discount)', 10, true, true),
  ('cuet-acc-deb-redemption',     'cuet-acc-debentures', 'Redemption of Debentures',                     20, true, true),
  ('cuet-acc-deb-interest',       'cuet-acc-debentures', 'Interest on Debentures and TDS',               30, true, true),
  ('cuet-acc-deb-sinking-fund',   'cuet-acc-debentures', 'Sinking Fund Method',                          40, true, true),

  -- cuet-acc-financial-statements: Financial Statements Analysis (5 topics)
  ('cuet-acc-fs-comparative',     'cuet-acc-financial-statements', 'Comparative Financial Statements',      10, true, true),
  ('cuet-acc-fs-common-size',     'cuet-acc-financial-statements', 'Common-Size Statements',                20, true, true),
  ('cuet-acc-fs-liquidity',       'cuet-acc-financial-statements', 'Liquidity Ratios (Current, Quick)',     30, true, true),
  ('cuet-acc-fs-profitability',   'cuet-acc-financial-statements', 'Profitability Ratios (GP, NP, ROI)',    40, true, true),
  ('cuet-acc-fs-solvency',        'cuet-acc-financial-statements', 'Solvency and Activity Ratios',          50, true, true),

  -- cuet-acc-computerized: Computerized Accounting System (5 topics)
  ('cuet-acc-comp-overview',      'cuet-acc-computerized', 'Overview of Computerized Accounting',        10, true, true),
  ('cuet-acc-comp-tally',         'cuet-acc-computerized', 'Tally: Basics and Voucher Entry',            20, true, true),
  ('cuet-acc-comp-database',      'cuet-acc-computerized', 'Database Management for Accounting',         30, true, true),
  ('cuet-acc-comp-reports',       'cuet-acc-computerized', 'Reports: Trial Balance, P&L, Balance Sheet', 40, true, true),
  ('cuet-acc-comp-mis',           'cuet-acc-computerized', 'MIS Reports and Data Analysis',              50, true, true)

ON CONFLICT (id) DO NOTHING;
