-- PART 1: Insert economics topics into med_topics
-- 81 topics across 20 chapters

-- cuet-eco-bop
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-bop-balance-of-payments-current-account-and-capit', 'cuet-eco-bop', 'Balance of Payments: Current Account and Capital Account', 1, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-bop-devaluation-vs-depreciation-and-their-effects', 'cuet-eco-bop', 'Devaluation vs Depreciation and their Effects', 2, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-bop-determination-of-exchange-rate-demand-and-sup', 'cuet-eco-bop', 'Determination of Exchange Rate: Demand and Supply of Foreign Exchange', 3, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-bop-foreign-exchange-rate-fixed-flexible-and-mana', 'cuet-eco-bop', 'Foreign Exchange Rate: Fixed, Flexible and Managed Floating', 4, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-bop-balance-of-trade-and-its-components', 'cuet-eco-bop', 'Balance of Trade and its Components', 5, false, true) ON CONFLICT (id) DO NOTHING;

-- cuet-eco-consumer-demand
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-consumer-demand-budget-line', 'cuet-eco-consumer-demand', 'Budget Line', 1, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-consumer-demand-elasticity-of-demand', 'cuet-eco-consumer-demand', 'Elasticity of Demand', 2, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-consumer-demand-indifference-curves', 'cuet-eco-consumer-demand', 'Indifference Curves', 3, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-consumer-demand-law-of-demand', 'cuet-eco-consumer-demand', 'Law of Demand', 4, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-consumer-demand-utility-approach', 'cuet-eco-consumer-demand', 'Utility Approach', 5, false, true) ON CONFLICT (id) DO NOTHING;

-- cuet-eco-dev-experience
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-dev-experience-india-china-comparative-development', 'cuet-eco-dev-experience', 'India-China Comparative Development', 1, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-dev-experience-india-pakistan-comparative-development', 'cuet-eco-dev-experience', 'India-Pakistan Comparative Development', 2, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-dev-experience-development-indicators-and-measurement', 'cuet-eco-dev-experience', 'Development Indicators and Measurement', 3, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-dev-experience-lessons-from-development-experience', 'cuet-eco-dev-experience', 'Lessons from Development Experience', 4, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-dev-experience-development-strategies-compared', 'cuet-eco-dev-experience', 'Development Strategies Compared', 5, false, true) ON CONFLICT (id) DO NOTHING;

-- cuet-eco-employment
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-employment-employment-growth-informalisation-and-other-', 'cuet-eco-employment', 'Employment: Growth, Informalisation and Other Issues', 1, false, true) ON CONFLICT (id) DO NOTHING;

-- cuet-eco-govt-budget
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-govt-budget-capital-receipts-and-capital-expenditure', 'cuet-eco-govt-budget', 'Capital Receipts and Capital Expenditure', 1, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-govt-budget-budget-meaning-objectives-and-components', 'cuet-eco-govt-budget', 'Budget: Meaning, Objectives and Components', 2, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-govt-budget-deficit-types-revenue-fiscal-and-primary-de', 'cuet-eco-govt-budget', 'Deficit Types: Revenue, Fiscal and Primary Deficit', 3, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-govt-budget-fiscal-policy-measures-to-correct-excess-an', 'cuet-eco-govt-budget', 'Fiscal Policy: Measures to Correct Excess and Deficient Demand', 4, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-govt-budget-revenue-receipts-and-revenue-expenditure', 'cuet-eco-govt-budget', 'Revenue Receipts and Revenue Expenditure', 5, false, true) ON CONFLICT (id) DO NOTHING;

-- cuet-eco-human-capital
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-human-capital-role-of-education-in-human-capital-format', 'cuet-eco-human-capital', 'Role of Education in Human Capital Formation', 1, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-human-capital-human-capital-and-economic-growth', 'cuet-eco-human-capital', 'Human Capital and Economic Growth', 2, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-human-capital-role-of-health-in-human-capital-formation', 'cuet-eco-human-capital', 'Role of Health in Human Capital Formation', 3, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-human-capital-meaning-and-sources-of-human-capital-form', 'cuet-eco-human-capital', 'Meaning and Sources of Human Capital Formation', 4, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-human-capital-government-expenditure-and-policy-challen', 'cuet-eco-human-capital', 'Government Expenditure and Policy Challenges in Human Capital', 5, false, true) ON CONFLICT (id) DO NOTHING;

-- cuet-eco-income-employment
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-income-employment-aggregate-demand', 'cuet-eco-income-employment', 'Aggregate Demand', 1, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-income-employment-aggregate-supply', 'cuet-eco-income-employment', 'Aggregate Supply', 2, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-income-employment-consumption-and-saving', 'cuet-eco-income-employment', 'Consumption and Saving', 3, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-income-employment-equilibrium-income', 'cuet-eco-income-employment', 'Equilibrium Income', 4, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-income-employment-investment-multiplier', 'cuet-eco-income-employment', 'Investment Multiplier', 5, false, true) ON CONFLICT (id) DO NOTHING;

-- cuet-eco-infrastructure
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-infrastructure-infrastructure-challenges-and-comparison', 'cuet-eco-infrastructure', 'Infrastructure Challenges and Comparison', 1, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-infrastructure-education-infrastructure', 'cuet-eco-infrastructure', 'Education Infrastructure', 2, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-infrastructure-energy-infrastructure', 'cuet-eco-infrastructure', 'Energy Infrastructure', 3, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-infrastructure-health-infrastructure', 'cuet-eco-infrastructure', 'Health Infrastructure', 4, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-infrastructure-meaning-and-types-of-infrastructure', 'cuet-eco-infrastructure', 'Meaning and Types of Infrastructure', 5, false, true) ON CONFLICT (id) DO NOTHING;

-- cuet-eco-lpg-reforms
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-lpg-reforms-background-and-need-for-reforms', 'cuet-eco-lpg-reforms', 'Background and Need for Reforms', 1, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-lpg-reforms-globalisation', 'cuet-eco-lpg-reforms', 'Globalisation', 2, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-lpg-reforms-impact-and-assessment-of-lpg-reforms', 'cuet-eco-lpg-reforms', 'Impact and Assessment of LPG Reforms', 3, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-lpg-reforms-liberalisation', 'cuet-eco-lpg-reforms', 'Liberalisation', 4, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-lpg-reforms-privatisation', 'cuet-eco-lpg-reforms', 'Privatisation', 5, false, true) ON CONFLICT (id) DO NOTHING;

-- cuet-eco-macro-intro
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-macro-intro-aggregate-demand', 'cuet-eco-macro-intro', 'Aggregate Demand', 1, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-macro-intro-aggregate-supply', 'cuet-eco-macro-intro', 'Aggregate Supply', 2, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-macro-intro-basic-concepts-of-macroeconomics', 'cuet-eco-macro-intro', 'Basic Concepts of Macroeconomics', 3, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-macro-intro-meaning-and-scope-of-macroeconomics', 'cuet-eco-macro-intro', 'Meaning and Scope of Macroeconomics', 4, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-macro-intro-investment-multiplier', 'cuet-eco-macro-intro', 'Investment Multiplier', 5, false, true) ON CONFLICT (id) DO NOTHING;

-- cuet-eco-money-banking
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-money-banking-central-bank', 'cuet-eco-money-banking', 'Central Bank', 1, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-money-banking-commercial-banks', 'cuet-eco-money-banking', 'Commercial Banks', 2, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-money-banking-monetary-policy', 'cuet-eco-money-banking', 'Monetary Policy', 3, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-money-banking-money-supply', 'cuet-eco-money-banking', 'Money Supply', 4, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-money-banking-money', 'cuet-eco-money-banking', 'Money', 5, false, true) ON CONFLICT (id) DO NOTHING;

-- cuet-eco-national-income
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-national-income-national-income-aggregates', 'cuet-eco-national-income', 'National Income Aggregates', 1, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-national-income-basic-concepts-of-national-income', 'cuet-eco-national-income', 'Basic Concepts of National Income', 2, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-national-income-methods-of-calculating-national-income', 'cuet-eco-national-income', 'Methods of Calculating National Income', 3, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-national-income-personal-income-and-national-disposable', 'cuet-eco-national-income', 'Personal Income and National Disposable Income', 4, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-national-income-nominal-vs-real-gdp-and-welfare', 'cuet-eco-national-income', 'Nominal vs Real GDP and Welfare', 5, false, true) ON CONFLICT (id) DO NOTHING;

-- cuet-eco-planning-era
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-planning-era-agriculture-in-planning-era', 'cuet-eco-planning-era', 'Agriculture in Planning Era', 1, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-planning-era-assessment-of-planning-era', 'cuet-eco-planning-era', 'Assessment of Planning Era', 2, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-planning-era-five-year-plans', 'cuet-eco-planning-era', 'Five Year Plans', 3, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-planning-era-industry-in-planning-era', 'cuet-eco-planning-era', 'Industry in Planning Era', 4, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-planning-era-trade-policy-in-planning-era', 'cuet-eco-planning-era', 'Trade Policy in Planning Era', 5, false, true) ON CONFLICT (id) DO NOTHING;

-- cuet-eco-poverty
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-poverty-poverty-alleviation-programmes', 'cuet-eco-poverty', 'Poverty Alleviation Programmes', 1, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-poverty-causes-of-poverty', 'cuet-eco-poverty', 'Causes of Poverty', 2, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-poverty-meaning-and-types-of-poverty', 'cuet-eco-poverty', 'Meaning and Types of Poverty', 3, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-poverty-poverty-trends-and-statistics', 'cuet-eco-poverty', 'Poverty Trends and Statistics', 4, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-poverty-vulnerability-and-inequality', 'cuet-eco-poverty', 'Vulnerability and Inequality', 5, false, true) ON CONFLICT (id) DO NOTHING;

-- cuet-eco-pre-independence
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-pre-independence-agriculture-under-british-rule', 'cuet-eco-pre-independence', 'Agriculture under British Rule', 1, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-pre-independence-drain-of-wealth-theory', 'cuet-eco-pre-independence', 'Drain of Wealth Theory', 2, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-pre-independence-industrial-and-trade-policy-under-brit', 'cuet-eco-pre-independence', 'Industrial and Trade Policy under British Rule', 3, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-pre-independence-infrastructure-under-british-rule', 'cuet-eco-pre-independence', 'Infrastructure under British Rule', 4, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-pre-independence-occupational-structure-and-national-in', 'cuet-eco-pre-independence', 'Occupational Structure and National Income', 5, false, true) ON CONFLICT (id) DO NOTHING;

-- cuet-eco-producer-supply
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-producer-supply-cost-curves', 'cuet-eco-producer-supply', 'Cost Curves', 1, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-producer-supply-production-function', 'cuet-eco-producer-supply', 'Production Function', 2, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-producer-supply-returns-to-scale', 'cuet-eco-producer-supply', 'Returns to Scale', 3, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-producer-supply-revenue-concepts', 'cuet-eco-producer-supply', 'Revenue Concepts', 4, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-producer-supply-supply', 'cuet-eco-producer-supply', 'Supply', 5, false, true) ON CONFLICT (id) DO NOTHING;

-- cuet-eco-rural-dev
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-rural-dev-rural-credit-and-marketing', 'cuet-eco-rural-dev', 'Rural Credit and Marketing', 1, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-rural-dev-diversification-of-rural-activities', 'cuet-eco-rural-dev', 'Diversification of Rural Activities', 2, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-rural-dev-government-schemes-for-rural-development', 'cuet-eco-rural-dev', 'Government Schemes for Rural Development', 3, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-rural-dev-meaning-and-objectives-of-rural-development', 'cuet-eco-rural-dev', 'Meaning and Objectives of Rural Development', 4, false, true) ON CONFLICT (id) DO NOTHING;
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES ('cuet-eco-rural-dev-organic-farming-and-sustainability', 'cuet-eco-rural-dev', 'Organic Farming and Sustainability', 5, false, true) ON CONFLICT (id) DO NOTHING;
