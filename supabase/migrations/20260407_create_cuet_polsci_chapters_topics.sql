-- ==========================================================================
-- CUET Political Science — 16 chapters + 5 topics each (80 topics total)
-- Part A: Contemporary World Politics (NCERT Class 12, Chapters 1–8)
-- Part B: Politics in India since Independence (NCERT Class 12, Chapters 1–8)
-- ==========================================================================

BEGIN;

-- ── Step 1: Insert 16 chapters ────────────────────────────────────────────

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics)
VALUES
  -- Part A: Contemporary World Politics
  ('cuet-pol-cold-war',           'political-science', '{"CUET"}', 'Contemporary World Politics', 'The Cold War Era',                               1,  12, 6.0, 3, '{"Origins of Cold War","NATO and Warsaw Pact","Non-Aligned Movement","Cuban Missile Crisis","Arms race and deterrence"}'),
  ('cuet-pol-end-bipolarity',     'political-science', '{"CUET"}', 'Contemporary World Politics', 'The End of Bipolarity',                          2,  12, 6.0, 3, '{"Disintegration of USSR","Shock therapy","CIS","Consequences of Soviet collapse","India and post-Soviet world"}'),
  ('cuet-pol-us-hegemony',        'political-science', '{"CUET"}', 'Contemporary World Politics', 'US Hegemony in World Politics',                  3,  12, 6.0, 3, '{"Nature of US hegemony","9/11 and War on Terror","Operation Enduring Freedom","Constraints on US power","India-US relations"}'),
  ('cuet-pol-alt-centres',        'political-science', '{"CUET"}', 'Contemporary World Politics', 'Alternative Centres of Power',                   4,  12, 6.0, 3, '{"European Union","ASEAN","Rise of China","China economic reforms","India-China-ASEAN"}'),
  ('cuet-pol-south-asia',         'political-science', '{"CUET"}', 'Contemporary World Politics', 'Contemporary South Asia',                        5,  12, 6.0, 3, '{"Democracy in South Asia","Military regimes","India-Pakistan relations","Conflicts and peace","SAARC"}'),
  ('cuet-pol-intl-orgs',          'political-science', '{"CUET"}', 'Contemporary World Politics', 'International Organisations',                    6,  12, 6.0, 3, '{"UN organs and structure","UN Security Council reform","World Bank and IMF","WTO","NGOs and civil society"}'),
  ('cuet-pol-security',           'political-science', '{"CUET"}', 'Contemporary World Politics', 'Security in the Contemporary World',             7,  12, 6.0, 3, '{"Traditional vs non-traditional security","Nuclear arms control","Terrorism","Human security","India security challenges"}'),
  ('cuet-pol-pol-environment',    'political-science', '{"CUET"}', 'Contemporary World Politics', 'Environment and Natural Resources',              8,  12, 5.0, 2, '{"Global commons","Rio Earth Summit","Kyoto Protocol","Global warming politics","India environmental policy"}'),
  ('cuet-pol-globalisation',      'political-science', '{"CUET"}', 'Contemporary World Politics', 'Globalisation',                                  9,  12, 6.0, 3, '{"Concept and causes of globalisation","Economic globalisation","Cultural impact","Anti-globalisation movements","India and globalisation"}'),

  -- Part B: Politics in India since Independence
  ('cuet-pol-nation-building',    'political-science', '{"CUET"}', 'Politics in India since Independence', 'Challenges of Nation Building',          1,  12, 7.0, 3, '{"Partition and refugee crisis","Integration of princely states","Linguistic reorganisation","National unity","Nehru vision"}'),
  ('cuet-pol-one-party',          'political-science', '{"CUET"}', 'Politics in India since Independence', 'Era of One-party Dominance',             2,  12, 6.0, 3, '{"First General Elections 1952","Congress system","Opposition parties","Social bases of Congress","1967 elections"}'),
  ('cuet-pol-planned-dev',        'political-science', '{"CUET"}', 'Politics in India since Independence', 'Politics of Planned Development',        3,  12, 6.0, 3, '{"Planning Commission","Five Year Plans","Kerala model","Agriculture vs industry","Mixed economy"}'),
  ('cuet-pol-external-relations', 'political-science', '{"CUET"}', 'Politics in India since Independence', 'India\'s External Relations',            4,  12, 6.0, 3, '{"Nehru foreign policy","India-China war 1962","India-Pakistan wars","Nuclear programme","India and superpowers"}'),
  ('cuet-pol-congress-challenges','political-science', '{"CUET"}', 'Politics in India since Independence', 'Challenges to and Restoration of Congress System', 5, 12, 6.0, 3, '{"1967 elections","Congress split","Indira Gandhi","1971 elections Garibi Hatao","Congress restoration"}'),
  ('cuet-pol-democratic-crisis',  'political-science', '{"CUET"}', 'Politics in India since Independence', 'The Crisis of Democratic Order',         6,  12, 7.0, 3, '{"JP Movement","Emergency 1975","Causes of Emergency","Consequences of Emergency","1977 elections and restoration"}'),
  ('cuet-pol-popular-movements',  'political-science', '{"CUET"}', 'Politics in India since Independence', 'Rise of Popular Movements',              7,  12, 6.0, 3, '{"Chipko movement","Anti-arrack movement","Dalit Panthers","Backward caste movements and Mandal","Farmers movements"}')

ON CONFLICT (id) DO UPDATE SET
  name            = EXCLUDED.name,
  branch          = EXCLUDED.branch,
  chapter_number  = EXCLUDED.chapter_number,
  weightage       = EXCLUDED.weightage,
  avg_questions   = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ── Step 2: Insert 5 topics per chapter (80 topics total) ─────────────────

INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active)
VALUES

-- cuet-pol-cold-war (5 topics)
('cuet-pol-cold-war-origins',             'cuet-pol-cold-war', 'Origins and Nature of the Cold War',              1, true,  true),
('cuet-pol-cold-war-alliances',           'cuet-pol-cold-war', 'Alliances: NATO, Warsaw Pact and SEATO',          2, false, true),
('cuet-pol-cold-war-deterrence',          'cuet-pol-cold-war', 'Nuclear Deterrence and Arms Race',                3, true,  true),
('cuet-pol-cold-war-nam',                 'cuet-pol-cold-war', 'Non-Aligned Movement and India',                  4, true,  true),
('cuet-pol-cold-war-crisis-detente',      'cuet-pol-cold-war', 'Cuban Missile Crisis and Detente',                5, true,  true),

-- cuet-pol-end-bipolarity (5 topics)
('cuet-pol-eb-ussr-disintegration',       'cuet-pol-end-bipolarity', 'Disintegration of the Soviet Union',        1, true,  true),
('cuet-pol-eb-consequences',              'cuet-pol-end-bipolarity', 'Consequences of Soviet Collapse',           2, true,  true),
('cuet-pol-eb-shock-therapy',             'cuet-pol-end-bipolarity', 'Shock Therapy in Transition Economies',     3, true,  true),
('cuet-pol-eb-cis',                       'cuet-pol-end-bipolarity', 'Commonwealth of Independent States (CIS)',  4, false, true),
('cuet-pol-eb-india-post-soviet',         'cuet-pol-end-bipolarity', 'India and Post-Soviet Relations',           5, false, true),

-- cuet-pol-us-hegemony (5 topics)
('cuet-pol-ush-nature',                   'cuet-pol-us-hegemony', 'Nature and Features of US Hegemony',           1, true,  true),
('cuet-pol-ush-911-terror',               'cuet-pol-us-hegemony', '9/11 and the Global War on Terror',            2, true,  true),
('cuet-pol-ush-operations',               'cuet-pol-us-hegemony', 'Operation Enduring Freedom and Operation Iraqi Freedom', 3, false, true),
('cuet-pol-ush-constraints',              'cuet-pol-us-hegemony', 'Constraints on US Power',                      4, true,  true),
('cuet-pol-ush-india-us',                 'cuet-pol-us-hegemony', 'India-US Relations in the Unipolar Era',       5, true,  true),

-- cuet-pol-alt-centres (5 topics)
('cuet-pol-ac-eu',                        'cuet-pol-alt-centres', 'European Union as an Alternative Power Centre', 1, true,  true),
('cuet-pol-ac-asean',                     'cuet-pol-alt-centres', 'ASEAN and Regional Integration in Asia',       2, true,  true),
('cuet-pol-ac-china-rise',                'cuet-pol-alt-centres', 'Rise of China as a Global Power',              3, true,  true),
('cuet-pol-ac-china-reforms',             'cuet-pol-alt-centres', 'China\'s Economic Reforms and Export-led Growth', 4, false, true),
('cuet-pol-ac-india-china-asean',         'cuet-pol-alt-centres', 'India-China-ASEAN Relations',                  5, false, true),

-- cuet-pol-south-asia (5 topics)
('cuet-pol-sa-democracy',                 'cuet-pol-south-asia', 'Nation-building and Democracy in South Asia',   1, true,  true),
('cuet-pol-sa-regimes',                   'cuet-pol-south-asia', 'Democratic and Military Regimes in South Asia', 2, true,  true),
('cuet-pol-sa-conflicts-peace',           'cuet-pol-south-asia', 'Conflicts and Peace Efforts in South Asia',     3, true,  true),
('cuet-pol-sa-india-pak',                 'cuet-pol-south-asia', 'India-Pakistan Relations',                      4, true,  true),
('cuet-pol-sa-saarc',                     'cuet-pol-south-asia', 'SAARC and Regional Cooperation',                5, false, true),

-- cuet-pol-intl-orgs (5 topics)
('cuet-pol-io-un-structure',              'cuet-pol-intl-orgs', 'United Nations: Structure, Organs and Functions', 1, true,  true),
('cuet-pol-io-un-reform',                 'cuet-pol-intl-orgs', 'UN Reforms and Security Council Expansion',      2, true,  true),
('cuet-pol-io-wb-imf',                    'cuet-pol-intl-orgs', 'World Bank, IMF and Bretton Woods Institutions', 3, true,  true),
('cuet-pol-io-wto',                       'cuet-pol-intl-orgs', 'World Trade Organisation (WTO)',                 4, true,  true),
('cuet-pol-io-ngos',                      'cuet-pol-intl-orgs', 'Role of NGOs: Amnesty International and Others', 5, false, true),

-- cuet-pol-security (5 topics)
('cuet-pol-sec-traditional-vs-new',       'cuet-pol-security', 'Traditional vs Non-traditional Notions of Security', 1, true, true),
('cuet-pol-sec-nuclear-arms',             'cuet-pol-security', 'Nuclear Weapons and Arms Control Treaties',       2, true,  true),
('cuet-pol-sec-terrorism',                'cuet-pol-security', 'Terrorism and Human Security',                    3, true,  true),
('cuet-pol-sec-global-challenges',        'cuet-pol-security', 'Global Security Challenges: Poverty, Climate, Migration', 4, false, true),
('cuet-pol-sec-india',                    'cuet-pol-security', 'India\'s Security Challenges and Threats',        5, true,  true),

-- cuet-pol-pol-environment (5 topics)
('cuet-pol-env-global-commons',           'cuet-pol-pol-environment', 'Global Commons and Environmental Challenges', 1, true,  true),
('cuet-pol-env-earth-summit',             'cuet-pol-pol-environment', 'Earth Summit 1992 and Kyoto Protocol',      2, true,  true),
('cuet-pol-env-global-warming',           'cuet-pol-pol-environment', 'Global Warming and Climate Change Politics', 3, true,  true),
('cuet-pol-env-resource-geopolitics',     'cuet-pol-pol-environment', 'Resource Geopolitics and Environmental Movements', 4, false, true),
('cuet-pol-env-india-policy',             'cuet-pol-pol-environment', 'India\'s Environment Policy and International Commitments', 5, false, true),

-- cuet-pol-globalisation (5 topics)
('cuet-pol-glb-concept',                  'cuet-pol-globalisation', 'Concept and Causes of Globalisation',        1, true,  true),
('cuet-pol-glb-economic',                 'cuet-pol-globalisation', 'Economic Dimensions of Globalisation',       2, true,  true),
('cuet-pol-glb-cultural',                 'cuet-pol-globalisation', 'Cultural and Political Impact of Globalisation', 3, true, true),
('cuet-pol-glb-resistance',               'cuet-pol-globalisation', 'Anti-Globalisation Movements and Resistance', 4, false, true),
('cuet-pol-glb-india',                    'cuet-pol-globalisation', 'India and Globalisation',                    5, true,  true),

-- cuet-pol-nation-building (5 topics)
('cuet-pol-nb-partition',                 'cuet-pol-nation-building', 'Partition: Causes, Violence and Refugee Crisis', 1, true, true),
('cuet-pol-nb-princely-states',           'cuet-pol-nation-building', 'Integration of Princely States',           2, true,  true),
('cuet-pol-nb-linguistic-states',         'cuet-pol-nation-building', 'Linguistic Reorganisation of States',      3, true,  true),
('cuet-pol-nb-unity-diversity',           'cuet-pol-nation-building', 'Challenge of Unity and Diversity',         4, false, true),
('cuet-pol-nb-nehru-vision',              'cuet-pol-nation-building', 'Nehru\'s Vision: Democracy, Secularism, Development', 5, true, true),

-- cuet-pol-one-party (5 topics)
('cuet-pol-op-first-elections',           'cuet-pol-one-party', 'First General Elections 1952 and Congress Dominance', 1, true, true),
('cuet-pol-op-congress-system',           'cuet-pol-one-party', 'Nature of Congress System: Umbrella Party',     2, true,  true),
('cuet-pol-op-opposition',                'cuet-pol-one-party', 'Opposition Parties: Socialists, Communists, Jan Sangh', 3, false, true),
('cuet-pol-op-social-bases',              'cuet-pol-one-party', 'Social Bases of Congress Support',               4, false, true),
('cuet-pol-op-end-dominance',             'cuet-pol-one-party', 'End of Congress Dominance: 1967 Elections',     5, true,  true),

-- cuet-pol-planned-dev (5 topics)
('cuet-pol-pd-planning-commission',       'cuet-pol-planned-dev', 'Planning Commission and Five Year Plans',       1, true,  true),
('cuet-pol-pd-first-second-plans',        'cuet-pol-planned-dev', 'First and Second Five Year Plans: Priorities', 2, true,  true),
('cuet-pol-pd-kerala-gujarat',            'cuet-pol-planned-dev', 'Kerala Model vs Gujarat Model of Development', 3, false, true),
('cuet-pol-pd-agri-industry',             'cuet-pol-planned-dev', 'Agriculture vs Industry Debate',               4, true,  true),
('cuet-pol-pd-mixed-economy',             'cuet-pol-planned-dev', 'Mixed Economy and Role of Public Sector',      5, true,  true),

-- cuet-pol-external-relations (5 topics)
('cuet-pol-er-nehru-policy',              'cuet-pol-external-relations', 'Nehru\'s Foreign Policy Principles',    1, true,  true),
('cuet-pol-er-india-china-1962',          'cuet-pol-external-relations', 'India-China War 1962 and Panchsheel',   2, true,  true),
('cuet-pol-er-india-pak-wars',            'cuet-pol-external-relations', 'India-Pakistan Wars 1965 and 1971',     3, true,  true),
('cuet-pol-er-nuclear',                   'cuet-pol-external-relations', 'India\'s Nuclear Programme and Pokhran Tests', 4, true, true),
('cuet-pol-er-superpowers',               'cuet-pol-external-relations', 'India and the Superpowers: Balancing Act', 5, false, true),

-- cuet-pol-congress-challenges (5 topics)
('cuet-pol-cc-1967-elections',            'cuet-pol-congress-challenges', '1967 Elections: End of Congress Dominance', 1, true, true),
('cuet-pol-cc-congress-split',            'cuet-pol-congress-challenges', 'Congress Split 1969 and Indira Gandhi', 2, true,  true),
('cuet-pol-cc-1971-garibi-hatao',         'cuet-pol-congress-challenges', '1971 Elections and Garibi Hatao Campaign', 3, true, true),
('cuet-pol-cc-opposition-unity',          'cuet-pol-congress-challenges', 'Opposition Unity and Grand Alliance',   4, false, true),
('cuet-pol-cc-restoration',               'cuet-pol-congress-challenges', 'Congress Restoration and Centralisation', 5, false, true),

-- cuet-pol-democratic-crisis (5 topics)
('cuet-pol-dc-jp-movement',               'cuet-pol-democratic-crisis', 'Context of Emergency: JP Movement',      1, true,  true),
('cuet-pol-dc-declaration',               'cuet-pol-democratic-crisis', 'Declaration and Causes of Emergency 1975', 2, true, true),
('cuet-pol-dc-consequences',              'cuet-pol-democratic-crisis', 'Consequences of Emergency',               3, true,  true),
('cuet-pol-dc-1977-elections',            'cuet-pol-democratic-crisis', '1977 Elections and Janata Party Victory', 4, true,  true),
('cuet-pol-dc-lessons',                   'cuet-pol-democratic-crisis', 'Lessons from Emergency for Indian Democracy', 5, true, true),

-- cuet-pol-popular-movements (5 topics)
('cuet-pol-pm-chipko',                    'cuet-pol-popular-movements', 'Chipko Movement and Environmental Consciousness', 1, true, true),
('cuet-pol-pm-anti-arrack',               'cuet-pol-popular-movements', 'Anti-Arrack Movement and Women\'s Empowerment', 2, true, true),
('cuet-pol-pm-dalit-panthers',            'cuet-pol-popular-movements', 'Dalit Panthers and Dalit Assertion',      3, true,  true),
('cuet-pol-pm-backward-caste',            'cuet-pol-popular-movements', 'Backward Caste Movements and Mandal Commission', 4, true, true),
('cuet-pol-pm-farmers',                   'cuet-pol-popular-movements', 'Farmers\' Movements: NMFP and Agricultural Policy', 5, false, true)

ON CONFLICT (id) DO NOTHING;

COMMIT;
