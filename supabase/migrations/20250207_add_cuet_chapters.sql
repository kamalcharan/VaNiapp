-- ════════════════════════════════════════════════════════════════════════════
-- CUET CHAPTERS & SUBJECTS SEED DATA
-- Run this migration in Supabase SQL Editor after the question_bank migration.
-- ════════════════════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 1. ADD MISSING CUET SUBJECTS                                                │
-- └─────────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_subjects (id, name, emoji, color, category, exam_id, sort_order) VALUES
  ('agriculture', 'Agriculture', '🌾', '#22C55E', 'Science', 'CUET', 14),
  ('engineering-graphics', 'Engineering Graphics', '📐', '#6366F1', 'Science', 'CUET', 15),
  ('knowledge-traditions', 'Knowledge Traditions', '📜', '#D97706', 'Arts / Humanities', 'CUET', 37),
  ('teaching-aptitude', 'Teaching Aptitude', '👨‍🏫', '#EC4899', 'Other', 'CUET', 46),
  ('legal-studies', 'Legal Studies', '⚖️', '#7C3AED', 'Arts / Humanities', 'CUET', 38),
  ('performing-arts', 'Performing Arts', '🎭', '#F43F5E', 'Other', 'CUET', 47),
  ('entrepreneurship', 'Entrepreneurship', '🚀', '#0EA5E9', 'Commerce', 'CUET', 23),
  ('sanskrit', 'Sanskrit', '🕉️', '#CA8A04', 'Other', 'CUET', 48)
ON CONFLICT (id) DO NOTHING;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 2. UPDATE NEET CHAPTERS TO INCLUDE CUET (OVERLAPPING CHAPTERS)              │
-- └─────────────────────────────────────────────────────────────────────────────┘

-- Physics chapters that overlap with CUET Physics
UPDATE med_chapters SET exam_ids = '{"NEET", "CUET"}'
WHERE subject_id = 'physics' AND id IN (
  'phy-electrostatics',
  'phy-current-electricity',
  'phy-magnetic-effects',
  'phy-em-induction',
  'phy-em-waves',
  'phy-optics',
  'phy-dual-nature',
  'phy-atoms-nuclei',
  'phy-electronic-devices'
);

-- Chemistry chapters that overlap with CUET Chemistry
UPDATE med_chapters SET exam_ids = '{"NEET", "CUET"}'
WHERE subject_id = 'chemistry' AND id IN (
  'chem-solutions',
  'chem-electrochemistry',
  'chem-kinetics',
  'chem-d-f-block',
  'chem-coordination',
  'chem-haloalkanes',
  'chem-alcohols-ethers',
  'chem-aldehydes-ketones',
  'chem-amines',
  'chem-biomolecules'
);


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 3. CUET BIOLOGY CHAPTERS (13 chapters)                                      │
-- └─────────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
-- Unit I: Reproduction
('cuet-bio-sexual-repro-plants', 'biology', '{"CUET"}', 'Reproduction', 'Sexual Reproduction in Flowering Plants', 1, 12, 8.0, 4, '{"Flower structure", "Gametophyte development", "Pollination types", "Double fertilization", "Embryo development", "Apomixis", "Parthenocarpy"}'),
('cuet-bio-human-repro', 'biology', '{"CUET"}', 'Reproduction', 'Human Reproduction', 2, 12, 8.0, 4, '{"Male reproductive system", "Female reproductive system", "Gametogenesis", "Menstrual cycle", "Fertilization", "Embryo development", "Parturition"}'),
('cuet-bio-repro-health', 'biology', '{"CUET"}', 'Reproduction', 'Reproductive Health', 3, 12, 6.0, 3, '{"STDs prevention", "Birth control methods", "Contraception", "MTP", "Amniocentesis", "IVF", "ZIFT", "GIFT"}'),

-- Unit II: Genetics and Evolution
('cuet-bio-inheritance', 'biology', '{"CUET"}', 'Genetics', 'Principles of Inheritance and Variation', 4, 12, 10.0, 5, '{"Mendelian inheritance", "Incomplete dominance", "Co-dominance", "Blood groups", "Sex determination", "Linkage", "Genetic disorders"}'),
('cuet-bio-molecular-inheritance', 'biology', '{"CUET"}', 'Genetics', 'Molecular Basis of Inheritance', 5, 12, 10.0, 5, '{"DNA structure", "DNA replication", "Transcription", "Genetic code", "Translation", "Lac operon", "Human genome project"}'),
('cuet-bio-evolution', 'biology', '{"CUET"}', 'Evolution', 'Evolution', 6, 12, 8.0, 4, '{"Origin of life", "Biological evolution", "Darwin contribution", "Natural selection", "Hardy-Weinberg", "Human evolution"}'),

-- Unit III: Biology and Human Welfare
('cuet-bio-human-health', 'biology', '{"CUET"}', 'Human Welfare', 'Human Health and Disease', 7, 12, 8.0, 4, '{"Pathogens", "Malaria", "Dengue", "Typhoid", "Immunology", "Vaccines", "Cancer", "AIDS", "Drug abuse"}'),
('cuet-bio-microbes-welfare', 'biology', '{"CUET"}', 'Human Welfare', 'Microbes in Human Welfare', 8, 12, 6.0, 3, '{"Food processing", "Industrial production", "Sewage treatment", "Biogas", "Biocontrol", "Biofertilizers", "Antibiotics"}'),

-- Unit IV: Biotechnology
('cuet-bio-biotech-principles', 'biology', '{"CUET"}', 'Biotechnology', 'Biotechnology: Principles and Processes', 9, 12, 8.0, 4, '{"Genetic engineering", "Recombinant DNA technology", "PCR", "Gel electrophoresis", "Vectors"}'),
('cuet-bio-biotech-applications', 'biology', '{"CUET"}', 'Biotechnology', 'Biotechnology and its Applications', 10, 12, 8.0, 4, '{"Human insulin", "Vaccines", "Gene therapy", "Bt crops", "Transgenic animals", "Biosafety", "Biopiracy"}'),

-- Unit V: Ecology
('cuet-bio-organisms-populations', 'biology', '{"CUET"}', 'Ecology', 'Organisms and Populations', 11, 12, 6.0, 3, '{"Population interactions", "Mutualism", "Competition", "Predation", "Parasitism", "Population growth"}'),
('cuet-bio-ecosystem', 'biology', '{"CUET"}', 'Ecology', 'Ecosystems', 12, 12, 6.0, 3, '{"Ecosystem components", "Productivity", "Decomposition", "Energy flow", "Ecological pyramids"}'),
('cuet-bio-biodiversity', 'biology', '{"CUET"}', 'Ecology', 'Biodiversity and Conservation', 13, 12, 8.0, 4, '{"Biodiversity patterns", "Loss of biodiversity", "Conservation", "Hotspots", "Red Data Book", "Biosphere reserves"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 4. CUET PHYSICS CHAPTERS (10 units - Class 12 only)                         │
-- └─────────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-phy-electrostatics', 'cuet-physics', '{"CUET"}', 'Electromagnetism', 'Electrostatics', 1, 12, 10.0, 5, '{"Coulomb law", "Electric field", "Superposition", "Continuous charge distribution", "Gauss law", "Capacitors"}'),
('cuet-phy-current-electricity', 'cuet-physics', '{"CUET"}', 'Electromagnetism', 'Current Electricity', 2, 12, 10.0, 5, '{"Ohm law", "Drift velocity", "Kirchhoff laws", "Wheatstone bridge", "Potentiometer", "Meter bridge"}'),
('cuet-phy-magnetic-effects', 'cuet-physics', '{"CUET"}', 'Electromagnetism', 'Magnetic Effects of Current and Magnetism', 3, 12, 12.0, 6, '{"Biot-Savart law", "Ampere law", "Force on moving charge", "Galvanometer", "Magnetic materials", "Earth magnetism"}'),
('cuet-phy-em-induction', 'cuet-physics', '{"CUET"}', 'Electromagnetism', 'Electromagnetic Induction and AC', 4, 12, 10.0, 5, '{"Faraday laws", "Lenz law", "Self induction", "Mutual induction", "AC circuits", "Transformers"}'),
('cuet-phy-em-waves', 'cuet-physics', '{"CUET"}', 'Electromagnetism', 'Electromagnetic Waves', 5, 12, 6.0, 3, '{"Displacement current", "EM wave characteristics", "EM spectrum", "Applications"}'),
('cuet-phy-optics', 'cuet-physics', '{"CUET"}', 'Optics', 'Optics', 6, 12, 14.0, 7, '{"Reflection", "Refraction", "Mirror formula", "Lens formula", "Total internal reflection", "Interference", "Diffraction", "Polarization"}'),
('cuet-phy-dual-nature', 'cuet-physics', '{"CUET"}', 'Modern Physics', 'Dual Nature of Matter and Radiation', 7, 12, 8.0, 4, '{"Photoelectric effect", "Einstein equation", "Matter waves", "Davisson-Germer experiment"}'),
('cuet-phy-atoms-nuclei', 'cuet-physics', '{"CUET"}', 'Modern Physics', 'Atoms and Nuclei', 8, 12, 8.0, 4, '{"Alpha scattering", "Bohr model", "Energy levels", "Nuclear composition", "Radioactivity", "Fission", "Fusion"}'),
('cuet-phy-electronic-devices', 'cuet-physics', '{"CUET"}', 'Modern Physics', 'Electronic Devices', 9, 12, 10.0, 5, '{"Semiconductors", "p-n junction", "Diodes", "Zener diode", "Transistor", "Logic gates"}'),
('cuet-phy-communication', 'cuet-physics', '{"CUET"}', 'Communication', 'Communication Systems', 10, 12, 6.0, 3, '{"Communication elements", "Bandwidth", "Modulation", "Amplitude modulation", "Detection"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 5. CUET CHEMISTRY CHAPTERS (10 units)                                       │
-- └─────────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-chem-solutions', 'cuet-chemistry', '{"CUET"}', 'Physical Chemistry', 'Solutions', 1, 12, 8.0, 4, '{"Concentration terms", "Raoult law", "Colligative properties", "van t Hoff factor", "Osmotic pressure"}'),
('cuet-chem-electrochemistry', 'cuet-chemistry', '{"CUET"}', 'Physical Chemistry', 'Electrochemistry', 2, 12, 10.0, 5, '{"Nernst equation", "Kohlrausch law", "Lead storage battery", "Fuel cell", "Corrosion"}'),
('cuet-chem-kinetics', 'cuet-chemistry', '{"CUET"}', 'Physical Chemistry', 'Chemical Kinetics', 3, 12, 8.0, 4, '{"Rate law", "Order of reaction", "First order reactions", "Activation energy", "Arrhenius equation"}'),
('cuet-chem-d-f-block', 'cuet-chemistry', '{"CUET"}', 'Inorganic Chemistry', 'd and f Block Elements', 4, 12, 8.0, 4, '{"d-block configurations", "Lanthanoids", "KMnO4 preparation", "K2Cr2O7 preparation", "Interstitial compounds"}'),
('cuet-chem-coordination', 'cuet-chemistry', '{"CUET"}', 'Inorganic Chemistry', 'Coordination Compounds', 5, 12, 8.0, 4, '{"Werner theory", "IUPAC nomenclature", "Isomerism", "VBT", "CFT", "Bonding"}'),
('cuet-chem-haloalkanes', 'cuet-chemistry', '{"CUET"}', 'Organic Chemistry', 'Haloalkanes and Haloarenes', 6, 12, 15.0, 7, '{"SN1 SN2 reactions", "Elimination reactions", "Grignard reagent", "Preparation methods"}'),
('cuet-chem-alcohols-phenols', 'cuet-chemistry', '{"CUET"}', 'Organic Chemistry', 'Alcohols, Phenols and Ethers', 7, 12, 15.0, 7, '{"Preparation of alcohols", "Acidity of phenol", "Reactions", "Williamson synthesis"}'),
('cuet-chem-aldehydes-ketones', 'cuet-chemistry', '{"CUET"}', 'Organic Chemistry', 'Aldehydes, Ketones and Carboxylic Acids', 8, 12, 10.0, 5, '{"Nucleophilic addition", "Aldol condensation", "Cannizzaro", "Acidity of carboxylic acids"}'),
('cuet-chem-amines', 'cuet-chemistry', '{"CUET"}', 'Organic Chemistry', 'Amines', 9, 12, 15.0, 7, '{"Basicity order", "Preparation", "Diazonium salts", "Coupling reactions", "Gabriel synthesis"}'),
('cuet-chem-biomolecules', 'cuet-chemistry', '{"CUET"}', 'Organic Chemistry', 'Biomolecules', 10, 12, 8.0, 4, '{"Carbohydrates", "Proteins", "Amino acids", "Nucleic acids", "Vitamins", "Enzymes"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 6. CUET MATHEMATICS CHAPTERS (Section B1 - Pure Math)                       │
-- └─────────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
-- Unit I: Relations and Functions
('cuet-math-relations', 'mathematics', '{"CUET"}', 'Algebra', 'Relations and Functions', 1, 12, 8.0, 4, '{"Types of relations", "Reflexive", "Symmetric", "Transitive", "Equivalence relations", "One-to-one", "Onto functions"}'),
('cuet-math-inverse-trig', 'mathematics', '{"CUET"}', 'Algebra', 'Inverse Trigonometric Functions', 2, 12, 6.0, 3, '{"Definition", "Domain", "Range", "Principal value", "Graphs"}'),

-- Unit II: Algebra
('cuet-math-matrices', 'mathematics', '{"CUET"}', 'Algebra', 'Matrices', 3, 12, 10.0, 5, '{"Matrix types", "Operations", "Transpose", "Symmetric", "Skew-symmetric", "Invertible matrices"}'),
('cuet-math-determinants', 'mathematics', '{"CUET"}', 'Algebra', 'Determinants', 4, 12, 10.0, 5, '{"Determinant calculation", "Minors", "Cofactors", "Area of triangle", "Adjoint", "Inverse", "Linear equations"}'),

-- Unit III: Calculus
('cuet-math-continuity', 'mathematics', '{"CUET"}', 'Calculus', 'Continuity and Differentiability', 5, 12, 12.0, 6, '{"Continuity", "Differentiability", "Chain rule", "Inverse trig derivatives", "Implicit functions", "Logarithmic differentiation"}'),
('cuet-math-applications-deriv', 'mathematics', '{"CUET"}', 'Calculus', 'Applications of Derivatives', 6, 12, 10.0, 5, '{"Rate of change", "Increasing functions", "Decreasing functions", "Maxima", "Minima", "Tangents", "Normals"}'),
('cuet-math-integrals', 'mathematics', '{"CUET"}', 'Calculus', 'Integrals', 7, 12, 12.0, 6, '{"Integration by substitution", "Partial fractions", "By parts", "Definite integrals", "Fundamental theorem"}'),
('cuet-math-applications-integrals', 'mathematics', '{"CUET"}', 'Calculus', 'Applications of Integrals', 8, 12, 8.0, 4, '{"Area under curves", "Area between curves", "Lines", "Circles", "Parabolas", "Ellipses"}'),
('cuet-math-differential-eq', 'mathematics', '{"CUET"}', 'Calculus', 'Differential Equations', 9, 12, 8.0, 4, '{"Order", "Degree", "General solution", "Particular solution", "Variable separable", "Homogeneous", "Linear"}'),

-- Unit IV: Vectors and 3D
('cuet-math-vectors', 'mathematics', '{"CUET"}', '3D Geometry', 'Vectors', 10, 12, 8.0, 4, '{"Magnitude", "Direction cosines", "Types of vectors", "Addition", "Scalar multiplication", "Dot product", "Cross product"}'),
('cuet-math-3d-geometry', 'mathematics', '{"CUET"}', '3D Geometry', 'Three Dimensional Geometry', 11, 12, 8.0, 4, '{"Direction ratios", "Line equations", "Cartesian form", "Vector form", "Skew lines", "Shortest distance"}'),

-- Unit V & VI
('cuet-math-linear-programming', 'mathematics', '{"CUET"}', 'Linear Programming', 'Linear Programming', 12, 12, 6.0, 3, '{"Constraints", "Objective function", "Graphical method", "Feasible region", "Optimal solution"}'),
('cuet-math-probability', 'mathematics', '{"CUET"}', 'Probability', 'Probability', 13, 12, 8.0, 4, '{"Conditional probability", "Multiplication theorem", "Independent events", "Bayes theorem", "Random variable"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 7. CUET ECONOMICS CHAPTERS (9 units)                                        │
-- └─────────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
-- Microeconomics
('cuet-eco-intro-micro', 'economics', '{"CUET"}', 'Microeconomics', 'Introduction to Microeconomics', 1, 12, 5.0, 2, '{"Central economic problems", "Types of economies", "Opportunity cost", "PPC"}'),
('cuet-eco-consumer-demand', 'economics', '{"CUET"}', 'Microeconomics', 'Consumer Behaviour and Demand', 2, 12, 15.0, 7, '{"Utility approach", "Indifference curves", "Budget line", "Law of demand", "Elasticity of demand"}'),
('cuet-eco-producer-supply', 'economics', '{"CUET"}', 'Microeconomics', 'Producer Behaviour and Supply', 3, 12, 15.0, 7, '{"Production function", "Returns to scale", "Cost curves", "Revenue concepts", "Supply"}'),
('cuet-eco-market-price', 'economics', '{"CUET"}', 'Microeconomics', 'Forms of Market and Price Determination', 4, 12, 15.0, 7, '{"Perfect competition", "Monopoly", "Monopolistic competition", "Oligopoly", "Price determination"}'),

-- Macroeconomics
('cuet-eco-national-income', 'economics', '{"CUET"}', 'Macroeconomics', 'National Income and Related Aggregates', 5, 12, 20.0, 10, '{"GDP", "GNP", "NNP", "NDP", "Personal income", "Disposable income", "Calculation methods"}'),
('cuet-eco-money-banking', 'economics', '{"CUET"}', 'Macroeconomics', 'Money and Banking', 6, 12, 15.0, 7, '{"Functions of money", "Commercial banks", "Central bank", "Credit creation", "Monetary policy"}'),
('cuet-eco-income-employment', 'economics', '{"CUET"}', 'Macroeconomics', 'Determination of Income and Employment', 7, 12, 20.0, 10, '{"Aggregate demand", "Aggregate supply", "Consumption function", "Investment multiplier", "Equilibrium"}'),
('cuet-eco-govt-budget', 'economics', '{"CUET"}', 'Macroeconomics', 'Government Budget and the Economy', 8, 12, 5.0, 2, '{"Budget components", "Revenue expenditure", "Capital expenditure", "Deficit types", "Fiscal policy"}'),
('cuet-eco-balance-payments', 'economics', '{"CUET"}', 'Macroeconomics', 'Balance of Payments', 9, 12, 5.0, 2, '{"Current account", "Capital account", "Foreign exchange", "Exchange rate", "Trade deficit"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 8. CUET BUSINESS STUDIES CHAPTERS (5 units)                                 │
-- └─────────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-bs-principles-mgmt', 'business-studies', '{"CUET"}', 'Management', 'Principles and Functions of Management', 1, 12, 30.0, 14, '{"Nature of management", "Management principles", "Planning", "Organizing", "Staffing", "Directing", "Controlling"}'),
('cuet-bs-business-finance', 'business-studies', '{"CUET"}', 'Finance', 'Business Finance and Financial Markets', 2, 12, 20.0, 10, '{"Financial management", "Capital structure", "Financial markets", "Stock exchange", "SEBI"}'),
('cuet-bs-marketing', 'business-studies', '{"CUET"}', 'Marketing', 'Marketing Management', 3, 12, 20.0, 10, '{"Marketing functions", "Marketing mix", "Product", "Price", "Place", "Promotion", "Branding"}'),
('cuet-bs-consumer-ethics', 'business-studies', '{"CUET"}', 'Ethics', 'Consumer Protection and Business Ethics', 4, 12, 15.0, 7, '{"Consumer rights", "Consumer Protection Act", "Business ethics", "Corporate governance"}'),
('cuet-bs-entrepreneurship', 'business-studies', '{"CUET"}', 'Entrepreneurship', 'Entrepreneurship Development', 5, 12, 15.0, 7, '{"Entrepreneurship concept", "Functions", "Business plan", "Start-up ecosystem", "Government schemes"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 9. CUET ACCOUNTANCY CHAPTERS (3 sections)                                   │
-- └─────────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-acc-npo', 'accountancy', '{"CUET"}', 'Non-Profit', 'Accounting for Not-for-Profit Organizations', 1, 12, 12.0, 6, '{"Receipts and payments", "Income and expenditure", "Balance sheet", "Subscriptions", "Donations"}'),
('cuet-acc-partnership-basics', 'accountancy', '{"CUET"}', 'Partnership', 'Partnership Fundamentals', 2, 12, 10.0, 5, '{"Partnership deed", "Profit sharing", "Interest on capital", "Interest on drawings", "Partner salary"}'),
('cuet-acc-reconstitution', 'accountancy', '{"CUET"}', 'Partnership', 'Reconstitution of Partnership', 3, 12, 25.0, 12, '{"Admission of partner", "Retirement of partner", "Death of partner", "Goodwill treatment", "Revaluation"}'),
('cuet-acc-dissolution', 'accountancy', '{"CUET"}', 'Partnership', 'Dissolution of Partnership Firms', 4, 12, 8.0, 4, '{"Settlement of accounts", "Realization account", "Asset distribution", "Liability payment"}'),
('cuet-acc-share-capital', 'accountancy', '{"CUET"}', 'Company Accounts', 'Accounting for Share Capital', 5, 12, 10.0, 5, '{"Issue of shares", "Allotment", "Forfeiture", "Reissue", "Private placement"}'),
('cuet-acc-debentures', 'accountancy', '{"CUET"}', 'Company Accounts', 'Accounting for Debentures', 6, 12, 8.0, 4, '{"Issue of debentures", "Redemption", "Interest", "Sinking fund"}'),
('cuet-acc-financial-statements', 'accountancy', '{"CUET"}', 'Financial Analysis', 'Financial Statements Analysis', 7, 12, 15.0, 7, '{"Comparative statements", "Common-size statements", "Ratio analysis", "Liquidity ratios", "Profitability ratios"}'),
('cuet-acc-computerized', 'accountancy', '{"CUET"}', 'Technology', 'Computerized Accounting System', 8, 12, 12.0, 5, '{"Accounting software", "Data entry", "Reports generation", "MIS reports", "Tally basics"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 10. CUET POLITICAL SCIENCE CHAPTERS (18 units)                              │
-- └─────────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
-- Politics in India Since Independence (50-55%)
('cuet-pol-nation-building', 'political-science', '{"CUET"}', 'Indian Politics', 'Challenges of Nation-Building', 1, 12, 10.0, 5, '{"Partition", "Integration of princely states", "Nehru vision", "National integration"}'),
('cuet-pol-one-party', 'political-science', '{"CUET"}', 'Indian Politics', 'Era of One-Party Dominance', 2, 12, 8.0, 4, '{"Congress system", "Opposition parties", "Electoral trends", "Dominant party system"}'),
('cuet-pol-planned-dev', 'political-science', '{"CUET"}', 'Indian Politics', 'Politics of Planned Development', 3, 12, 8.0, 4, '{"Five-Year Plans", "Land reforms", "Green Revolution", "Industrial policy"}'),
('cuet-pol-external-relations', 'political-science', '{"CUET"}', 'Indian Politics', 'Indias External Relations', 4, 12, 10.0, 5, '{"Nehru foreign policy", "NAM", "India-China relations", "India-Pakistan wars"}'),
('cuet-pol-congress-challenges', 'political-science', '{"CUET"}', 'Indian Politics', 'Challenges to Congress System', 5, 12, 9.0, 4, '{"Congress split", "JP Movement", "Emergency 1975-77", "Restoration"}'),
('cuet-pol-democratic-crisis', 'political-science', '{"CUET"}', 'Indian Politics', 'Crisis of Democratic Order', 6, 12, 9.0, 4, '{"Emergency impact", "Civil liberties", "Judiciary role", "Press freedom"}'),
('cuet-pol-regional', 'political-science', '{"CUET"}', 'Indian Politics', 'Regional Aspirations and Conflicts', 7, 12, 10.0, 5, '{"Punjab accord", "Assam movement", "Kashmir issue", "Northeast insurgency"}'),
('cuet-pol-popular-movements', 'political-science', '{"CUET"}', 'Indian Politics', 'Rise of Popular Movements', 8, 12, 8.0, 4, '{"Farmers movements", "Women movements", "Environmental movements", "Anti-corruption"}'),
('cuet-pol-recent-dev', 'political-science', '{"CUET"}', 'Indian Politics', 'Recent Developments in Indian Politics', 9, 12, 12.0, 6, '{"Coalition politics", "Economic reforms", "Mandal Commission", "Communalism"}'),

-- Contemporary World Politics (35-40%)
('cuet-pol-cold-war', 'political-science', '{"CUET"}', 'World Politics', 'Cold War Era', 10, 12, 12.0, 6, '{"Origin", "NATO", "Warsaw Pact", "Cuban missile crisis", "Vietnam War"}'),
('cuet-pol-second-world', 'political-science', '{"CUET"}', 'World Politics', 'End of Bipolarity', 11, 12, 10.0, 5, '{"USSR collapse", "Soviet disintegration", "Shock therapy", "Consequences"}'),
('cuet-pol-us-hegemony', 'political-science', '{"CUET"}', 'World Politics', 'US Hegemony in World Politics', 12, 12, 9.0, 4, '{"Operation Desert Storm", "9/11", "War on Terror", "Iraq invasion"}'),
('cuet-pol-alternative-centers', 'political-science', '{"CUET"}', 'World Politics', 'Alternative Centers of Power', 13, 12, 10.0, 5, '{"European Union", "ASEAN", "China rise", "BRICS"}'),
('cuet-pol-south-asia', 'political-science', '{"CUET"}', 'World Politics', 'South Asia in Post-Cold War Era', 14, 12, 8.0, 4, '{"SAARC", "India-Pakistan", "India-Bangladesh", "Nepal", "Sri Lanka"}'),
('cuet-pol-intl-orgs', 'political-science', '{"CUET"}', 'World Politics', 'International Organizations', 15, 12, 9.0, 4, '{"UN reform", "Security Council", "IMF", "World Bank", "WTO"}'),
('cuet-pol-security', 'political-science', '{"CUET"}', 'World Politics', 'Security in Contemporary World', 16, 12, 9.0, 4, '{"Traditional security", "Non-traditional security", "Terrorism", "Global security"}'),
('cuet-pol-environment', 'political-science', '{"CUET"}', 'World Politics', 'Environment and Natural Resources', 17, 12, 8.0, 4, '{"Global commons", "Climate change", "Rio summit", "Kyoto protocol"}'),
('cuet-pol-globalization', 'political-science', '{"CUET"}', 'World Politics', 'Globalization', 18, 12, 10.0, 5, '{"Economic globalization", "Cultural impact", "Critics", "Anti-globalization movements"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 11. CUET COMPUTER SCIENCE CHAPTERS (5 units)                                │
-- └─────────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-cs-python', 'computer-science', '{"CUET"}', 'Programming', 'Python Programming and File Handling', 1, 12, 38.0, 19, '{"Functions", "Recursion", "File handling", "Text files", "Binary files", "Lists", "Tuples", "Dictionaries"}'),
('cuet-cs-sql', 'computer-science', '{"CUET"}', 'Database', 'SQL and Database Management', 2, 12, 23.0, 11, '{"SQL queries", "SELECT", "INSERT", "UPDATE", "DELETE", "Joins", "Keys", "Constraints", "Normalization"}'),
('cuet-cs-networks', 'computer-science', '{"CUET"}', 'Networking', 'Computer Networks and Cybersecurity', 3, 12, 18.0, 9, '{"TCP/IP", "HTTP", "DNS", "Network protocols", "Encryption", "Firewalls", "Malware", "Cybersecurity basics"}'),
('cuet-cs-data-structures', 'computer-science', '{"CUET"}', 'Data Structures', 'Data Structures and Algorithms', 4, 12, 13.0, 6, '{"Stacks", "Queues", "Linked lists", "Binary search", "Bubble sort", "Quick sort", "Time complexity"}'),
('cuet-cs-societal', 'computer-science', '{"CUET"}', 'Ethics', 'Societal Impacts of Computing', 5, 12, 8.0, 4, '{"Digital footprint", "Privacy", "IPR", "Copyright", "Open source", "AI ethics", "Cyber laws"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 12. CUET ENVIRONMENTAL STUDIES CHAPTERS (7 units)                           │
-- └─────────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-evs-human-nature', 'environmental-studies', '{"CUET"}', 'Ecology', 'Human Beings and Nature', 1, 12, 14.0, 7, '{"Deep ecology", "Shallow ecology", "Stewardship", "Social ecology", "Eco-feminism", "Green politics", "Sustainable development"}'),
('cuet-evs-population', 'environmental-studies', '{"CUET"}', 'Ecology', 'Population and Conservation Ecology', 2, 12, 16.0, 8, '{"Population dynamics", "Malthusian model", "Demographic transition", "Conservation", "Project Tiger", "Wildlife sanctuaries"}'),
('cuet-evs-pollution', 'environmental-studies', '{"CUET"}', 'Pollution', 'Monitoring Pollution', 3, 12, 16.0, 8, '{"Air quality monitoring", "Water testing", "Soil testing", "BOD", "COD", "NAAQM", "Pollution standards"}'),
('cuet-evs-third-world', 'environmental-studies', '{"CUET"}', 'Development', 'Third World Development', 4, 12, 14.0, 7, '{"Urbanization", "Push-pull factors", "Gandhian approach", "Urban planning", "Sanitation", "Water management"}'),
('cuet-evs-agriculture', 'environmental-studies', '{"CUET"}', 'Agriculture', 'Sustainable Agriculture', 5, 12, 14.0, 7, '{"Traditional farming", "Green Revolution", "Organic farming", "Food security", "Land reforms", "IPM"}'),
('cuet-evs-economics', 'environmental-studies', '{"CUET"}', 'Economics', 'Environmental Economics', 6, 12, 12.0, 6, '{"Natural resource accounting", "GDP vs GNP", "Externalities", "Cost-benefit analysis", "Natural capital"}'),
('cuet-evs-international', 'environmental-studies', '{"CUET"}', 'International', 'International Relations and Environment', 7, 12, 14.0, 7, '{"Amazonia case", "Ivory trade", "Ozone depletion", "WTO", "GATT", "Globalization impact", "International aid"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 13. CUET AGRICULTURE CHAPTERS (4 units)                                     │
-- └─────────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-agri-agrometeorology', 'agriculture', '{"CUET"}', 'Basic Sciences', 'Agrometeorology, Biochemistry, Microbiology and Genetics', 1, 12, 25.0, 12, '{"Weather patterns", "Climate change", "Plant enzymes", "Photosynthesis", "Soil microbes", "Nitrogen fixation", "Plant breeding", "Hybrid varieties"}'),
('cuet-agri-livestock', 'agriculture', '{"CUET"}', 'Animal Science', 'Livestock Production', 2, 12, 25.0, 12, '{"Dairy farming", "Poultry farming", "Animal nutrition", "Breeding techniques", "Disease management", "Vaccination"}'),
('cuet-agri-crop-production', 'agriculture', '{"CUET"}', 'Crop Science', 'Crop Production', 3, 12, 25.0, 12, '{"Crop rotation", "Intercropping", "Irrigation practices", "Nutrient management", "Pest control", "IPM", "Fertilizers"}'),
('cuet-agri-horticulture', 'agriculture', '{"CUET"}', 'Horticulture', 'Horticulture', 4, 12, 25.0, 12, '{"Fruit production", "Vegetable cultivation", "Floriculture", "Post-harvest management", "Storage techniques", "Propagation methods"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 14. CUET SOCIOLOGY CHAPTERS (10 units)                                      │
-- └─────────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-soc-structure', 'sociology', '{"CUET"}', 'Indian Society', 'Structure of Indian Society', 1, 12, 12.0, 6, '{"Colonialism", "Nationalism", "Demographics", "Rural-urban linkages", "Class and community"}'),
('cuet-soc-institutions', 'sociology', '{"CUET"}', 'Indian Society', 'Social Institutions', 2, 12, 12.0, 6, '{"Family", "Kinship", "Caste system", "Tribal society", "Market as institution"}'),
('cuet-soc-inequality', 'sociology', '{"CUET"}', 'Indian Society', 'Social Inequality and Exclusion', 3, 12, 12.0, 6, '{"Caste prejudice", "SC/OBC", "Tribal marginalization", "Women equality", "Religious minorities", "Differently-abled"}'),
('cuet-soc-diversity', 'sociology', '{"CUET"}', 'Indian Society', 'Challenges of Unity in Diversity', 4, 12, 10.0, 5, '{"Communalism", "Regionalism", "Casteism", "Patriarchy", "State role in plural society"}'),
('cuet-soc-structural-change', 'sociology', '{"CUET"}', 'Social Change', 'Process of Social Change', 5, 12, 10.0, 5, '{"Colonialism impact", "Industrialization", "Urbanization", "Modernization", "Westernization", "Sanskritization"}'),
('cuet-soc-polity', 'sociology', '{"CUET"}', 'Social Change', 'Social Change and Polity', 6, 12, 10.0, 5, '{"Constitution as instrument", "Political parties", "Pressure groups", "Panchayati Raj"}'),
('cuet-soc-economy', 'sociology', '{"CUET"}', 'Social Change', 'Social Change and Economy', 7, 12, 10.0, 5, '{"Land reforms", "Green Revolution", "Liberalization", "Class structure changes"}'),
('cuet-soc-arenas', 'sociology', '{"CUET"}', 'Social Change', 'Arenas of Social Change', 8, 12, 8.0, 4, '{"Media impact", "Globalization effects", "Information technology"}'),
('cuet-soc-movements', 'sociology', '{"CUET"}', 'Social Movements', 'Social Movements', 9, 12, 12.0, 6, '{"Workers movements", "Peasant movements", "Dalit movement", "Women movements", "Tribal movements", "Environmental movements"}'),
('cuet-soc-new-arenas', 'sociology', '{"CUET"}', 'Contemporary', 'New Arenas of Social Change', 10, 12, 4.0, 2, '{"Digital divide", "New media", "Social networking", "Cyber culture"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 15. CUET PHYSICAL EDUCATION CHAPTERS (9 units)                              │
-- └─────────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-pe-sociological', 'physical-education', '{"CUET"}', 'Theory', 'Sociological Aspects of Physical Education', 1, 12, 10.0, 5, '{"Games as heritage", "Individual development", "National integration", "Personality development"}'),
('cuet-pe-training', 'physical-education', '{"CUET"}', 'Training', 'Training Methods', 2, 12, 14.0, 7, '{"Sports training", "Repetition method", "Continuous training", "Fartlek", "Interval training", "Circuit training", "Weight training"}'),
('cuet-pe-career', 'physical-education', '{"CUET"}', 'Career', 'Career Aspects in Physical Education', 3, 12, 10.0, 5, '{"Career options", "NSNIS", "SAI", "IOC", "IOA", "Sports institutions"}'),
('cuet-pe-tournaments', 'physical-education', '{"CUET"}', 'Sports', 'Tournaments', 4, 12, 10.0, 5, '{"Tournament types", "Knock-out", "League", "Seeding", "Byes", "Intramural", "Extramural"}'),
('cuet-pe-health', 'physical-education', '{"CUET"}', 'Health', 'Health Education and Health Problems', 5, 12, 14.0, 7, '{"Health definition", "Communicable diseases", "Posture", "Personal hygiene", "Substance abuse", "WADA", "NADA"}'),
('cuet-pe-injuries', 'physical-education', '{"CUET"}', 'First Aid', 'Sports Injuries and First Aid', 6, 12, 12.0, 6, '{"Sports injuries", "Soft tissue injuries", "Fractures", "First aid", "CPR", "RICE method"}'),
('cuet-pe-testing', 'physical-education', '{"CUET"}', 'Measurement', 'Test and Measurement in Sports', 7, 12, 10.0, 5, '{"Motor fitness test", "Harvard step test", "Barrow test", "Senior citizen fitness test"}'),
('cuet-pe-biomechanics', 'physical-education', '{"CUET"}', 'Science', 'Biomechanics and Sports', 8, 12, 10.0, 5, '{"Biomechanics basics", "Movement types", "Newton laws in sports", "Friction in sports"}'),
('cuet-pe-psychology', 'physical-education', '{"CUET"}', 'Psychology', 'Psychology and Sports', 9, 12, 10.0, 5, '{"Personality types", "Sheldon classification", "Big Five theory", "Motivation", "Exercise adherence", "Aggression in sports"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 16. CUET ENGINEERING GRAPHICS CHAPTERS (7 units)                            │
-- └─────────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-eg-isometric-basic', 'engineering-graphics', '{"CUET"}', 'Projection', 'Isometric Projection - Basic Solids', 1, 12, 20.0, 10, '{"Isometric scale", "Cube", "Prisms", "Pyramids", "Cone", "Cylinder", "Sphere", "Hemisphere"}'),
('cuet-eg-isometric-combo', 'engineering-graphics', '{"CUET"}', 'Projection', 'Isometric Projection - Combination', 2, 12, 15.0, 7, '{"Two solids combination", "Centrally placed solids", "Axis orientation"}'),
('cuet-eg-threads-bolts', 'engineering-graphics', '{"CUET"}', 'Machine Drawing', 'Machine Parts - Threads and Bolts', 3, 12, 18.0, 9, '{"Thread profiles", "Square thread", "BSW", "Metric thread", "Bolts", "Nuts", "Washers"}'),
('cuet-eg-studs-rivets', 'engineering-graphics', '{"CUET"}', 'Machine Drawing', 'Machine Parts - Studs and Rivets', 4, 12, 12.0, 6, '{"Thread representation", "Stud types", "Rivet types", "Snap head", "Flat head", "Counter sunk"}'),
('cuet-eg-bearings', 'engineering-graphics', '{"CUET"}', 'Assembly', 'Bearings', 5, 12, 12.0, 6, '{"Open bearing", "Bush bearing", "Assembly drawing", "Disassembly"}'),
('cuet-eg-rod-joints', 'engineering-graphics', '{"CUET"}', 'Assembly', 'Rod Joints', 6, 12, 12.0, 6, '{"Cotter joints", "Sleeve and cotter", "Gib and cotter", "Round rod joints", "Square rod joints"}'),
('cuet-eg-pipe-joints', 'engineering-graphics', '{"CUET"}', 'Assembly', 'Tie-rod and Pipe Joints', 7, 12, 11.0, 5, '{"Turnbuckle", "Flange pipe joints", "Assembly views"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 17. CUET KNOWLEDGE TRADITIONS CHAPTERS (8 units)                            │
-- └─────────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-kt-agriculture', 'knowledge-traditions', '{"CUET"}', 'Science', 'Agriculture - A Survey', 1, 12, 12.0, 6, '{"Traditional agriculture", "Irrigation systems", "Crop varieties", "Soil fertility", "Cattle management"}'),
('cuet-kt-architecture-early', 'knowledge-traditions', '{"CUET"}', 'Architecture', 'Architecture - Early and Classical', 2, 12, 12.0, 6, '{"Temple architecture", "Rock-cut structures", "Monolithic temples", "Public architecture"}'),
('cuet-kt-architecture-medieval', 'knowledge-traditions', '{"CUET"}', 'Architecture', 'Architecture - Medieval and Colonial', 3, 12, 12.0, 6, '{"Fort architecture", "Palace architecture", "Mosques", "Mausoleums", "Colonial architecture"}'),
('cuet-kt-dance', 'knowledge-traditions', '{"CUET"}', 'Performing Arts', 'Dance - A Survey', 4, 12, 14.0, 7, '{"Bharatanatyam", "Kathakali", "Kathak", "Kuchipudi", "Manipuri", "Odissi", "Folk dances"}'),
('cuet-kt-education', 'knowledge-traditions', '{"CUET"}', 'Education', 'Education Systems and Practices', 5, 12, 12.0, 6, '{"Gurukulas", "Viharas", "Universities", "Nalanda", "Teacher-student traditions", "Physical education"}'),
('cuet-kt-ethics', 'knowledge-traditions', '{"CUET"}', 'Philosophy', 'Ethics - Individual and Social', 6, 12, 12.0, 6, '{"Buddhist ethics", "Jain ethics", "Sikh ethics", "Bhakti movement", "Asoka edicts", "Kural"}'),
('cuet-kt-martial-arts', 'knowledge-traditions', '{"CUET"}', 'Physical', 'Martial Arts Traditions', 7, 12, 12.0, 6, '{"Kalaripayattu", "Wrestling", "Stick combat", "Marmasastram", "Traditional texts"}'),
('cuet-kt-language-tech', 'knowledge-traditions', '{"CUET"}', 'Science', 'Language, Grammar and Technologies', 8, 12, 14.0, 7, '{"Indian languages", "Grammar tradition", "Harappan tech", "Water management", "Textile tech", "Metallurgy"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 18. CUET TEACHING APTITUDE CHAPTERS (7 units)                               │
-- └─────────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-ta-narratives', 'teaching-aptitude', '{"CUET"}', 'Education', 'School Narratives and Reports', 1, 12, 14.0, 7, '{"Gender in education", "School access", "Teacher work", "Student assessment", "Data analysis"}'),
('cuet-ta-media', 'teaching-aptitude', '{"CUET"}', 'Education', 'Education in Films and Books', 2, 12, 14.0, 7, '{"Educational films", "Documentaries", "Struggles in education", "Girls education", "Tribal education"}'),
('cuet-ta-science', 'teaching-aptitude', '{"CUET"}', 'Science', 'Science Education', 3, 12, 14.0, 7, '{"Natural phenomena", "Indian scientists", "Women scientists", "Science programs", "Technology in education"}'),
('cuet-ta-mathematics', 'teaching-aptitude', '{"CUET"}', 'Mathematics', 'Mathematics Education', 4, 12, 14.0, 7, '{"Sense of proportion", "Mathematical abilities", "Famous mathematicians", "Learning difficulties in math"}'),
('cuet-ta-arts', 'teaching-aptitude', '{"CUET"}', 'Arts', 'Arts, Music and Drama', 5, 12, 14.0, 7, '{"Art academies", "Benefits of arts", "Indian art traditions", "Music traditions", "Performing arts"}'),
('cuet-ta-social-science', 'teaching-aptitude', '{"CUET"}', 'Social Science', 'Social Sciences', 6, 12, 14.0, 7, '{"Teaching difficulties", "Social science subjects", "Nobel laureates", "Historical teachers", "Buddha", "Jain teachers"}'),
('cuet-ta-language', 'teaching-aptitude', '{"CUET"}', 'Language', 'Language and Literature', 7, 12, 16.0, 8, '{"NCERT stories", "Famous literature", "Biographies", "School experiences", "Grammar teaching", "Poetry teaching"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 19. CUET HISTORY CHAPTERS                                                   │
-- └─────────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-hist-ancient', 'history', '{"CUET"}', 'Ancient India', 'Ancient India', 1, 12, 25.0, 12, '{"Indus Valley", "Vedic period", "Mauryan empire", "Gupta dynasty", "Buddhism", "Jainism"}'),
('cuet-hist-medieval', 'history', '{"CUET"}', 'Medieval India', 'Medieval India', 2, 12, 25.0, 12, '{"Delhi Sultanate", "Mughal Empire", "Bhakti movement", "Sufi tradition", "Vijayanagara"}'),
('cuet-hist-modern', 'history', '{"CUET"}', 'Modern India', 'Modern India', 3, 12, 30.0, 15, '{"Colonial rule", "1857 revolt", "Freedom struggle", "Gandhi", "Partition", "Constitution"}'),
('cuet-hist-world', 'history', '{"CUET"}', 'World History', 'World History', 4, 12, 20.0, 10, '{"French Revolution", "Industrial Revolution", "World Wars", "Cold War", "Decolonization"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 20. CUET GEOGRAPHY CHAPTERS                                                 │
-- └─────────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-geo-physical', 'geography', '{"CUET"}', 'Physical', 'Physical Geography', 1, 12, 30.0, 15, '{"Geomorphology", "Climatology", "Hydrology", "Soils", "Biogeography"}'),
('cuet-geo-human', 'geography', '{"CUET"}', 'Human', 'Human Geography', 2, 12, 30.0, 15, '{"Population", "Migration", "Settlements", "Urbanization", "Economic activities"}'),
('cuet-geo-india', 'geography', '{"CUET"}', 'Regional', 'Geography of India', 3, 12, 25.0, 12, '{"Physical features", "Climate", "Drainage", "Resources", "Agriculture", "Industries"}'),
('cuet-geo-practical', 'geography', '{"CUET"}', 'Practical', 'Practical Geography', 4, 12, 15.0, 7, '{"Map reading", "Map interpretation", "Topographical maps", "Statistical data"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 21. CUET PSYCHOLOGY CHAPTERS                                                │
-- └─────────────────────────────────────────────────────────────────────────────┘

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES
('cuet-psy-basics', 'psychology', '{"CUET"}', 'Foundations', 'Foundations of Psychology', 1, 12, 25.0, 12, '{"Schools of psychology", "Research methods", "Biological basis", "Consciousness"}'),
('cuet-psy-development', 'psychology', '{"CUET"}', 'Development', 'Human Development', 2, 12, 20.0, 10, '{"Stages of development", "Cognitive development", "Social development", "Moral development"}'),
('cuet-psy-individual-diff', 'psychology', '{"CUET"}', 'Individual', 'Individual Differences', 3, 12, 20.0, 10, '{"Intelligence", "Aptitude", "Personality", "Self concept", "Creativity"}'),
('cuet-psy-mental-health', 'psychology', '{"CUET"}', 'Health', 'Mental Health and Disorders', 4, 12, 20.0, 10, '{"Stress", "Coping", "Psychological disorders", "Therapy", "Mental well-being"}'),
('cuet-psy-social', 'psychology', '{"CUET"}', 'Social', 'Social Psychology', 5, 12, 15.0, 7, '{"Social cognition", "Attitudes", "Group behavior", "Prosocial behavior", "Aggression"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weightage = EXCLUDED.weightage,
  avg_questions = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ════════════════════════════════════════════════════════════════════════════
-- VERIFICATION
-- ════════════════════════════════════════════════════════════════════════════

-- Count chapters by exam
SELECT
  CASE
    WHEN 'NEET' = ANY(exam_ids) AND 'CUET' = ANY(exam_ids) THEN 'BOTH'
    WHEN 'NEET' = ANY(exam_ids) THEN 'NEET only'
    WHEN 'CUET' = ANY(exam_ids) THEN 'CUET only'
  END as exam_type,
  COUNT(*) as chapter_count
FROM med_chapters
GROUP BY 1
ORDER BY 1;

-- Count chapters by subject
SELECT subject_id, COUNT(*) as chapters
FROM med_chapters
GROUP BY subject_id
ORDER BY subject_id;
