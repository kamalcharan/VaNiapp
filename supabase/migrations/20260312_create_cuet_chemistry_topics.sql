-- ============================================================
-- CUET Chemistry Topics (med_topics)
-- All 10 chapters, ~4-6 topics each
-- ============================================================

INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES

-- ── Solutions (cuet-chem-solutions) ──────────────────────────
('cuet-chem-so-types',           'cuet-chem-solutions',          'Types of Solutions and Concentration Units',                1, true,  true),
('cuet-chem-so-raoult',          'cuet-chem-solutions',          'Raoult''s Law and Ideal/Non-Ideal Solutions',               2, true,  true),
('cuet-chem-so-colligative',     'cuet-chem-solutions',          'Colligative Properties: Boiling Point, Freezing Point, Osmotic Pressure', 3, true,  true),
('cuet-chem-so-abnormal',        'cuet-chem-solutions',          'Abnormal Molar Masses and Van''t Hoff Factor',             4, true,  true),
('cuet-chem-so-henrys',          'cuet-chem-solutions',          'Henry''s Law and Solubility of Gases',                     5, false, true),

-- ── Electrochemistry (cuet-chem-electrochemistry) ────────────
('cuet-chem-ec-cells',           'cuet-chem-electrochemistry',   'Electrochemical Cells and Standard Electrode Potential',    1, true,  true),
('cuet-chem-ec-nernst',          'cuet-chem-electrochemistry',   'Nernst Equation and Gibbs Energy',                         2, true,  true),
('cuet-chem-ec-conductance',     'cuet-chem-electrochemistry',   'Conductance, Molar Conductivity and Kohlrausch''s Law',    3, true,  true),
('cuet-chem-ec-electrolysis',    'cuet-chem-electrochemistry',   'Electrolysis and Faraday''s Laws',                         4, true,  true),
('cuet-chem-ec-batteries',       'cuet-chem-electrochemistry',   'Batteries, Fuel Cells and Corrosion',                      5, false, true),

-- ── Chemical Kinetics (cuet-chem-kinetics) ───────────────────
('cuet-chem-ki-rate',            'cuet-chem-kinetics',           'Rate of Reaction, Rate Law and Rate Constant',             1, true,  true),
('cuet-chem-ki-order',           'cuet-chem-kinetics',           'Order and Molecularity of Reactions',                      2, true,  true),
('cuet-chem-ki-integrated',      'cuet-chem-kinetics',           'Integrated Rate Equations and Half-Life',                  3, true,  true),
('cuet-chem-ki-arrhenius',       'cuet-chem-kinetics',           'Arrhenius Equation, Activation Energy and Temperature Effect', 4, true,  true),
('cuet-chem-ki-collision',       'cuet-chem-kinetics',           'Collision Theory and Catalyst Effects',                    5, false, true),

-- ── d-and f-Block Elements (cuet-chem-d-f-block) ─────────────
('cuet-chem-df-config',          'cuet-chem-d-f-block',          'Electronic Configuration and General Properties',          1, true,  true),
('cuet-chem-df-oxidation',       'cuet-chem-d-f-block',          'Oxidation States, Color, Magnetic and Catalytic Properties', 2, true,  true),
('cuet-chem-df-compounds',       'cuet-chem-d-f-block',          'Important Compounds: KMnO₄ and K₂Cr₂O₇',                 3, true,  true),
('cuet-chem-df-lanthanoids',     'cuet-chem-d-f-block',          'Lanthanoids, Actinoids and Lanthanoid Contraction',        4, true,  true),
('cuet-chem-df-interstitial',    'cuet-chem-d-f-block',          'Interstitial Compounds and Alloy Formation',              5, false, true),

-- ── Coordination Compounds (cuet-chem-coordination) ──────────
('cuet-chem-co-werner',          'cuet-chem-coordination',       'Werner''s Theory, Ligands and Coordination Number',        1, true,  true),
('cuet-chem-co-nomenclature',    'cuet-chem-coordination',       'IUPAC Nomenclature of Coordination Compounds',            2, true,  true),
('cuet-chem-co-isomerism',       'cuet-chem-coordination',       'Isomerism: Geometric, Optical, Linkage and Ionization',   3, true,  true),
('cuet-chem-co-bonding',         'cuet-chem-coordination',       'VBT, CFT, Crystal Field Splitting and Spectrochemical Series', 4, true,  true),
('cuet-chem-co-applications',    'cuet-chem-coordination',       'Applications: Chelation, Stability, Color and Magnetism', 5, false, true),

-- ── Haloalkanes and Haloarenes (cuet-chem-haloalkanes) ───────
('cuet-chem-ha-basics',          'cuet-chem-haloalkanes',        'Classification, Nomenclature and Nature of C-X Bond',      1, true,  true),
('cuet-chem-ha-sn',              'cuet-chem-haloalkanes',        'SN1 and SN2 Mechanisms and Stereochemistry',               2, true,  true),
('cuet-chem-ha-elimination',     'cuet-chem-haloalkanes',        'Elimination Reactions: E1, E2 and Saytzeff''s Rule',       3, true,  true),
('cuet-chem-ha-reactions',       'cuet-chem-haloalkanes',        'Named Reactions: Wurtz, Sandmeyer, Finkelstein, Swarts',   4, true,  true),
('cuet-chem-ha-polyhalogen',     'cuet-chem-haloalkanes',        'Polyhalogen Compounds, DDT and Environmental Effects',    5, false, true),

-- ── Alcohols, Phenols and Ethers (cuet-chem-alcohols-phenols)
('cuet-chem-ap-classification',  'cuet-chem-alcohols-phenols',   'Classification, Preparation and Physical Properties',      1, true,  true),
('cuet-chem-ap-reactions',       'cuet-chem-alcohols-phenols',   'Chemical Reactions: Dehydration, Oxidation and Esterification', 2, true,  true),
('cuet-chem-ap-phenols',         'cuet-chem-alcohols-phenols',   'Phenol Acidity, Kolbe and Reimer-Tiemann Reactions',       3, true,  true),
('cuet-chem-ap-ethers',          'cuet-chem-alcohols-phenols',   'Williamson Synthesis, Ether Cleavage and Anisole Reactions', 4, true,  true),
('cuet-chem-ap-distinction',     'cuet-chem-alcohols-phenols',   'Distinction Tests: Lucas Test and Oxidation Products',     5, false, true),

-- ── Aldehydes, Ketones and Carboxylic Acids (cuet-chem-aldehydes-ketones)
('cuet-chem-ak-basics',          'cuet-chem-aldehydes-ketones',  'Nomenclature, Preparation and Physical Properties',        1, true,  true),
('cuet-chem-ak-nucleophilic',    'cuet-chem-aldehydes-ketones',  'Nucleophilic Addition and Reactivity of Carbonyl Group',   2, true,  true),
('cuet-chem-ak-named',           'cuet-chem-aldehydes-ketones',  'Aldol, Cannizzaro, Clemmensen and Wolff-Kishner Reactions', 3, true,  true),
('cuet-chem-ak-carboxylic',      'cuet-chem-aldehydes-ketones',  'Carboxylic Acid Acidity, HVZ, Esterification and Kolbe Electrolysis', 4, true,  true),
('cuet-chem-ak-tests',           'cuet-chem-aldehydes-ketones',  'Distinction Tests: Tollens, Fehling, Iodoform and 2,4-DNP', 5, false, true),

-- ── Amines (cuet-chem-amines) ────────────────────────────────
('cuet-chem-am-classification',  'cuet-chem-amines',             'Classification, Nomenclature and Preparation Methods',     1, true,  true),
('cuet-chem-am-basicity',        'cuet-chem-amines',             'Basicity: Inductive, Resonance and Solvation Effects',     2, true,  true),
('cuet-chem-am-reactions',       'cuet-chem-amines',             'Reactions: Acylation, Carbylamine and Hinsberg Test',      3, true,  true),
('cuet-chem-am-diazonium',       'cuet-chem-amines',             'Diazonium Salts, Sandmeyer and Coupling Reactions',        4, true,  true),

-- ── Biomolecules (cuet-chem-biomolecules) ────────────────────
('cuet-chem-bm-carbohydrates',   'cuet-chem-biomolecules',       'Carbohydrates: Classification, Reducing Sugars and Mutarotation', 1, true,  true),
('cuet-chem-bm-proteins',        'cuet-chem-biomolecules',       'Proteins: Amino Acids, Peptide Bond and Structure Levels', 2, true,  true),
('cuet-chem-bm-vitamins',        'cuet-chem-biomolecules',       'Vitamins: Classification and Deficiency Diseases',        3, false, true),
('cuet-chem-bm-nucleic',         'cuet-chem-biomolecules',       'Nucleic Acids: DNA, RNA, Base Pairing and Double Helix',  4, true,  true)

ON CONFLICT (id) DO NOTHING;
