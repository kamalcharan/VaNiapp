-- ==========================================================================
-- BATCH 1: Correction questions for CUET Physics
-- 21 questions: 14 diagram-based + 7 logical-sequence
-- Chapters: Atoms & Nuclei (12 Qs), Current Electricity (9 Qs)
-- ==========================================================================

BEGIN;

-- ==========================================================================
-- STEP 1: Create missing CUET topics in med_topics
-- (CUET chapters exist but have no topics — FK constraint requires them)
-- ==========================================================================

-- Atoms & Nuclei topics
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important) VALUES
('cuet-phy-atom-bohr',          'cuet-phy-atoms-nuclei', 'Bohr Model and Hydrogen Spectrum',              1, true),
('cuet-phy-atom-rutherford',    'cuet-phy-atoms-nuclei', 'Rutherford Model and Alpha Scattering',         2, true),
('cuet-phy-atom-radioactivity', 'cuet-phy-atoms-nuclei', 'Radioactivity and Decay Laws',                  3, true),
('cuet-phy-atom-nucleus',       'cuet-phy-atoms-nuclei', 'Nuclear Structure, Size, and Binding Energy',   4, true),
('cuet-phy-atom-fission-fusion','cuet-phy-atoms-nuclei', 'Nuclear Fission and Fusion',                    5, true)
ON CONFLICT (id) DO NOTHING;

-- Current Electricity topics
INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important) VALUES
('cuet-phy-curr-ohm',           'cuet-phy-current-electricity', 'Ohm''s Law and Resistance',              1, true),
('cuet-phy-curr-drift',         'cuet-phy-current-electricity', 'Drift Velocity and Mobility',            2, true),
('cuet-phy-curr-kirchhoff',     'cuet-phy-current-electricity', 'Kirchhoff''s Laws',                      3, true),
('cuet-phy-curr-wheatstone',    'cuet-phy-current-electricity', 'Wheatstone Bridge and Meter Bridge',     4, true),
('cuet-phy-curr-potentiometer', 'cuet-phy-current-electricity', 'Potentiometer',                          5, true)
ON CONFLICT (id) DO NOTHING;

-- ==========================================================================
-- STEP 2: Insert 21 correction questions
-- ==========================================================================

-- ── phy-atom-bohr-copied.json (───────────────────────────────────)

-- cuet-phy-atom-bohr-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-atoms-nuclei',
  'cuet-phy-atom-bohr',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The diagram shows the energy level diagram of hydrogen atom with transitions labelled P, Q, R, and S. Transition P is from n=4 to n=2, Q from n=3 to n=1, R from n=5 to n=3, and S from n=3 to n=2. Which transition emits a photon of the longest wavelength?$t$,
  $t$Longest wavelength corresponds to smallest energy difference. S (n=3→2) has ΔE = 13.6(1/4−1/9) = 1.89 eV, R (n=5→3) has ΔE = 13.6(1/9−1/25) = 0.97 eV. So R emits the longest wavelength. Generally, transitions between higher levels with smaller gaps give longer wavelengths.$t$,
  $json${"question_id": "cuet-phy-atom-bohr-d01", "subtopic": "Energy level transitions", "topic_name": "Bohr Model of Hydrogen Atom", "bloom_level": "analyze", "options": [{"key": "A", "text": "Transition P", "is_correct": false}, {"key": "B", "text": "Transition Q", "is_correct": false}, {"key": "C", "text": "Transition R", "is_correct": true}, {"key": "D", "text": "Transition S", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "P (n=4→2) belongs to Balmer series with ΔE ≈ 2.55 eV — shorter wavelength than R.", "misconception": "Confusing higher initial level with longer wavelength"}, {"option_key": "B", "hint": "Q (n=3→1) belongs to Lyman series with ΔE ≈ 12.09 eV — this gives UV radiation, the shortest wavelength here.", "misconception": "Thinking transitions to ground state give longer wavelengths"}, {"option_key": "D", "hint": "S (n=3→2) has ΔE ≈ 1.89 eV. R (n=5→3) has ΔE ≈ 0.97 eV, which is smaller, so R has longer λ.", "misconception": null}], "image_uri": "diagrams/cuet-phy-atom-bohr-d01.png", "image_alt": "Energy level diagram of hydrogen showing four transitions: P (n=4→2), Q (n=3→1), R (n=5→3), S (n=3→2)"}$json$::jsonb,
  NULL,
  $t$Energy level diagram of hydrogen showing four transitions: P (n=4→2), Q (n=3→1), R (n=5→3), S (n=3→2)$t$,
  'C',
  ARRAY['energy-levels','photon-wavelength','hydrogen-spectrum'],
  'active',
  true,
  'correction-batch-1'
);

-- cuet-phy-atom-bohr-d02  (diagram-based, easy)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-atoms-nuclei',
  'cuet-phy-atom-bohr',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'easy',
  'just-started',
  $t$The diagram shows circular orbits of an electron in a hydrogen atom according to Bohr's model. If r₁ is the radius of the first orbit, what is the radius of the orbit labelled n=3?$t$,
  $t$In Bohr's model, rₙ = n²r₁. For n=3, r₃ = 9r₁. The radii increase as the square of the principal quantum number.$t$,
  $json${"question_id": "cuet-phy-atom-bohr-d02", "subtopic": "Bohr orbit radii", "topic_name": "Bohr Model of Hydrogen Atom", "bloom_level": "apply", "options": [{"key": "A", "text": "3r₁", "is_correct": false}, {"key": "B", "text": "6r₁", "is_correct": false}, {"key": "C", "text": "8r₁", "is_correct": false}, {"key": "D", "text": "9r₁", "is_correct": true}], "elimination_hints": [{"option_key": "A", "hint": "3r₁ assumes rₙ ∝ n, but Bohr's model gives rₙ ∝ n².", "misconception": "Thinking radius is directly proportional to n"}, {"option_key": "B", "hint": "6r₁ = 2×3×r₁ has no physical basis in the Bohr model formula.", "misconception": null}, {"option_key": "C", "hint": "8r₁ = 2³r₁ confuses the n² dependence with n³.", "misconception": "Confusing quadratic with cubic dependence"}], "image_uri": "diagrams/cuet-phy-atom-bohr-d02.png", "image_alt": "Concentric circular orbits around a nucleus labelled n=1, n=2, n=3 with increasing radii"}$json$::jsonb,
  NULL,
  $t$Concentric circular orbits around a nucleus labelled n=1, n=2, n=3 with increasing radii$t$,
  'D',
  ARRAY['bohr-radius','orbit-radius','quantization'],
  'active',
  true,
  'correction-batch-1'
);

-- cuet-phy-atom-bohr-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-atoms-nuclei',
  'cuet-phy-atom-bohr',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following spectral series of hydrogen in order of increasing wavelength of their first line:
(I) Lyman series
(II) Balmer series
(III) Paschen series
(IV) Brackett series$t$,
  $t$The first line of each series: Lyman (n=2→1, λ=121.6 nm), Balmer (n=3→2, λ=656.3 nm), Paschen (n=4→3, λ=1875 nm), Brackett (n=5→4, λ=4051 nm). Order of increasing wavelength: Lyman < Balmer < Paschen < Brackett.$t$,
  $json${"question_id": "cuet-phy-atom-bohr-ls01", "subtopic": "Spectral series ordering", "topic_name": "Bohr Model of Hydrogen Atom", "bloom_level": "understand", "options": [{"key": "A", "text": "I → II → III → IV", "is_correct": true}, {"key": "B", "text": "IV → III → II → I", "is_correct": false}, {"key": "C", "text": "II → I → III → IV", "is_correct": false}, {"key": "D", "text": "I → III → II → IV", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "This is the order of decreasing wavelength, not increasing.", "misconception": "Reversing the order"}, {"option_key": "C", "hint": "Lyman series has the shortest wavelength (UV), not Balmer.", "misconception": "Thinking visible light has shorter wavelength than UV"}, {"option_key": "D", "hint": "Balmer (visible) has shorter wavelength than Paschen (IR), so II should come before III.", "misconception": null}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['spectral-series','wavelength-order','hydrogen-spectrum'],
  'active',
  true,
  'correction-batch-1'
);

-- ── phy-atom-spectra-copied.json (────────────────────────────────)

-- cuet-phy-atom-spectra-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-atoms-nuclei',
  'cuet-phy-atom-bohr',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The diagram shows an emission spectrum with bright lines on a dark background and an absorption spectrum with dark lines on a bright background. If the emission spectrum is of sodium vapour, what does the absorption spectrum show?$t$,
  $t$Kirchhoff's law states that a substance absorbs the same wavelengths it emits. Sodium emits characteristic yellow D-lines (589.0 nm and 589.6 nm). When white light passes through sodium vapour, these exact wavelengths are absorbed, creating dark lines at the same positions.$t$,
  $json${"question_id": "cuet-phy-atom-spectra-d01", "subtopic": "Emission and absorption spectra", "topic_name": "Atomic Spectra", "bloom_level": "understand", "options": [{"key": "A", "text": "Dark lines at completely different positions from the emission lines", "is_correct": false}, {"key": "B", "text": "Dark lines at exactly the same positions as the emission lines", "is_correct": true}, {"key": "C", "text": "A continuous spectrum with no dark lines", "is_correct": false}, {"key": "D", "text": "Dark lines that shift to longer wavelengths", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Absorption occurs at the same wavelengths that are emitted — this is Kirchhoff's spectroscopic law.", "misconception": "Thinking emission and absorption wavelengths differ"}, {"option_key": "C", "hint": "If sodium vapour is present, it will absorb its characteristic wavelengths — dark lines must appear.", "misconception": "Ignoring absorption by the gas"}, {"option_key": "D", "hint": "Absorption lines appear at the same wavelength as emission. A red-shift occurs due to relative motion (Doppler), not absorption.", "misconception": "Confusing Doppler shift with absorption"}], "image_uri": "diagrams/cuet-phy-atom-spectra-d01.png", "image_alt": "Top: emission spectrum with bright yellow lines (D1, D2) on dark background. Bottom: absorption spectrum with dark lines at same positions on continuous bright background."}$json$::jsonb,
  NULL,
  $t$Top: emission spectrum with bright yellow lines (D1, D2) on dark background. Bottom: absorption spectrum with dark lines at same positions on continuous bright background.$t$,
  'B',
  ARRAY['emission-spectrum','absorption-spectrum','kirchhoff-law'],
  'active',
  true,
  'correction-batch-1'
);

-- cuet-phy-atom-spectra-d02  (diagram-based, hard)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-atoms-nuclei',
  'cuet-phy-atom-bohr',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'hard',
  'just-started',
  $t$The graph shows the variation of 1/λ (inverse wavelength) versus 1/n² for a spectral series of hydrogen, where n is the principal quantum number of the upper level. The graph is a straight line. What is the y-intercept of this line for the Balmer series?$t$,
  $t$For Balmer series: 1/λ = R(1/2² − 1/n²) = R/4 − R/n². Plotting 1/λ vs 1/n² gives a straight line with slope −R and y-intercept R/4 where R is the Rydberg constant (1.097 × 10⁷ m⁻¹). So y-intercept = R/4 ≈ 2.74 × 10⁶ m⁻¹.$t$,
  $json${"question_id": "cuet-phy-atom-spectra-d02", "subtopic": "Rydberg formula graphical analysis", "topic_name": "Atomic Spectra", "bloom_level": "analyze", "options": [{"key": "A", "text": "R/4", "is_correct": true}, {"key": "B", "text": "R", "is_correct": false}, {"key": "C", "text": "R/9", "is_correct": false}, {"key": "D", "text": "4R", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "R would be the y-intercept for the Lyman series (1/1² = 1), not Balmer.", "misconception": "Using n=1 instead of n=2 for Balmer series"}, {"option_key": "C", "hint": "R/9 = R/3² would apply to the Paschen series, not Balmer.", "misconception": "Confusing Paschen (n₁=3) with Balmer (n₁=2)"}, {"option_key": "D", "hint": "4R has incorrect dimensions/value — the y-intercept is R divided by n₁², not multiplied.", "misconception": "Inverting the formula"}], "image_uri": "diagrams/cuet-phy-atom-spectra-d02.png", "image_alt": "Linear graph of 1/λ (y-axis) vs 1/n² (x-axis) with negative slope, showing data points for n=3,4,5,6"}$json$::jsonb,
  NULL,
  $t$Linear graph of 1/λ (y-axis) vs 1/n² (x-axis) with negative slope, showing data points for n=3,4,5,6$t$,
  'A',
  ARRAY['rydberg-formula','balmer-series','graphical-analysis'],
  'active',
  true,
  'correction-batch-1'
);

-- cuet-phy-atom-spectra-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-atoms-nuclei',
  'cuet-phy-atom-bohr',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following atomic models in chronological order of their proposal:
(I) Rutherford's nuclear model
(II) Thomson's plum pudding model
(III) Bohr's quantized orbit model
(IV) Quantum mechanical model$t$,
  $t$Thomson (1904) → Rutherford (1911) → Bohr (1913) → Quantum mechanical/Schrödinger (1926). Each model addressed limitations of its predecessor.$t$,
  $json${"question_id": "cuet-phy-atom-spectra-ls01", "subtopic": "Historical development of atomic models", "topic_name": "Atomic Spectra", "bloom_level": "remember", "options": [{"key": "A", "text": "I → II → III → IV", "is_correct": false}, {"key": "B", "text": "II → I → III → IV", "is_correct": true}, {"key": "C", "text": "II → III → I → IV", "is_correct": false}, {"key": "D", "text": "III → II → I → IV", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Thomson's model came before Rutherford's — the alpha scattering experiment disproved the plum pudding model.", "misconception": "Thinking Rutherford's model came first"}, {"option_key": "C", "hint": "Bohr's model was proposed after Rutherford's to explain atomic stability and spectral lines.", "misconception": "Reversing Rutherford and Bohr chronology"}, {"option_key": "D", "hint": "Bohr's model (1913) came after Thomson's (1904), not before.", "misconception": null}]}$json$::jsonb,
  NULL,
  NULL,
  'B',
  ARRAY['atomic-models','history-of-physics','chronology'],
  'active',
  true,
  'correction-batch-1'
);

-- ── phy-nuclei-decay-copied.json (────────────────────────────────)

-- cuet-phy-nuclei-decay-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-atoms-nuclei',
  'cuet-phy-atom-radioactivity',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The graph shows the radioactive decay curve (N/N₀ vs t) for a substance. From the graph, if after 20 minutes the fraction remaining is 1/4, what is the half-life of the substance?$t$,
  $t$If N/N₀ = 1/4 = (1/2)² after 20 minutes, then 2 half-lives have elapsed. Therefore t₁/₂ = 20/2 = 10 minutes.$t$,
  $json${"question_id": "cuet-phy-nuclei-decay-d01", "subtopic": "Half-life from decay curve", "topic_name": "Radioactive Decay", "bloom_level": "apply", "options": [{"key": "A", "text": "5 minutes", "is_correct": false}, {"key": "B", "text": "10 minutes", "is_correct": true}, {"key": "C", "text": "20 minutes", "is_correct": false}, {"key": "D", "text": "40 minutes", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "If t₁/₂ = 5 min, then in 20 min there would be 4 half-lives, giving N/N₀ = 1/16, not 1/4.", "misconception": null}, {"option_key": "C", "hint": "20 minutes is the total time for N/N₀ to reach 1/4 (two half-lives), not the half-life itself.", "misconception": "Confusing total decay time with half-life"}, {"option_key": "D", "hint": "If t₁/₂ = 40 min, then 20 min would be only half a half-life, giving N/N₀ = 1/√2 ≈ 0.707, not 0.25.", "misconception": null}], "image_uri": "diagrams/cuet-phy-nuclei-decay-d01.png", "image_alt": "Exponential decay curve showing N/N₀ on y-axis (1 to 0) and time t on x-axis. Curve passes through (0,1), (10, 0.5), (20, 0.25), (30, 0.125)"}$json$::jsonb,
  NULL,
  $t$Exponential decay curve showing N/N₀ on y-axis (1 to 0) and time t on x-axis. Curve passes through (0,1), (10, 0.5), (20, 0.25), (30, 0.125)$t$,
  'B',
  ARRAY['half-life','decay-curve','radioactive-decay'],
  'active',
  true,
  'correction-batch-1'
);

-- cuet-phy-nuclei-decay-d02  (diagram-based, hard)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-atoms-nuclei',
  'cuet-phy-atom-radioactivity',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'hard',
  'just-started',
  $t$The figure shows a decay chain on an N-Z plot (neutron number vs proton number). A nucleus X undergoes α-decay followed by two successive β⁻ decays to reach nucleus Y. If X has (Z, N) = (92, 146), what are the coordinates of Y?$t$,
  $t$α-decay: Z→Z−2, N→N−2 (loses 2p + 2n). After α: (90, 144). β⁻ decay: Z→Z+1, N→N−1 (neutron converts to proton). After first β⁻: (91, 143). After second β⁻: (92, 142). So Y = (92, 142).$t$,
  $json${"question_id": "cuet-phy-nuclei-decay-d02", "subtopic": "Decay chains on N-Z plot", "topic_name": "Radioactive Decay", "bloom_level": "analyze", "options": [{"key": "A", "text": "(90, 144)", "is_correct": false}, {"key": "B", "text": "(90, 142)", "is_correct": false}, {"key": "C", "text": "(91, 143)", "is_correct": false}, {"key": "D", "text": "(92, 142)", "is_correct": true}], "elimination_hints": [{"option_key": "A", "hint": "This is the position after α-decay only — you still need to apply two β⁻ decays.", "misconception": "Forgetting the β⁻ decay steps"}, {"option_key": "B", "hint": "This would be correct if β⁻ only changed N without changing Z, but β⁻ increases Z by 1 each time.", "misconception": "Ignoring proton number change in β⁻ decay"}, {"option_key": "C", "hint": "This is the position after α + one β⁻ — you need one more β⁻ decay.", "misconception": "Applying only one β⁻ instead of two"}], "image_uri": "diagrams/cuet-phy-nuclei-decay-d02.png", "image_alt": "N-Z plot showing nucleus X at (92,146), α-decay arrow going to (90,144), then two β⁻ arrows each going right by 1 in Z and down by 1 in N"}$json$::jsonb,
  NULL,
  $t$N-Z plot showing nucleus X at (92,146), α-decay arrow going to (90,144), then two β⁻ arrows each going right by 1 in Z and down by 1 in N$t$,
  'D',
  ARRAY['alpha-decay','beta-decay','NZ-plot','decay-chain'],
  'active',
  true,
  'correction-batch-1'
);

-- cuet-phy-nuclei-decay-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-atoms-nuclei',
  'cuet-phy-atom-radioactivity',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following types of radiation in order of increasing penetrating power:
(I) Alpha particles
(II) Gamma rays
(III) Beta particles$t$,
  $t$Alpha particles are stopped by a sheet of paper (least penetrating). Beta particles penetrate a few mm of aluminium. Gamma rays can penetrate several cm of lead (most penetrating). Order: α < β < γ.$t$,
  $json${"question_id": "cuet-phy-nuclei-decay-ls01", "subtopic": "Properties of nuclear radiation", "topic_name": "Radioactive Decay", "bloom_level": "remember", "options": [{"key": "A", "text": "I → III → II", "is_correct": true}, {"key": "B", "text": "II → III → I", "is_correct": false}, {"key": "C", "text": "III → I → II", "is_correct": false}, {"key": "D", "text": "I → II → III", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "This is the order of decreasing penetrating power, not increasing.", "misconception": "Reversing the order"}, {"option_key": "C", "hint": "Beta particles are more penetrating than alpha, and gamma is most penetrating.", "misconception": null}, {"option_key": "D", "hint": "Gamma rays are more penetrating than beta particles — they need thick lead shielding.", "misconception": "Confusing ionizing power with penetrating power"}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['penetrating-power','radiation-types','alpha-beta-gamma'],
  'active',
  true,
  'correction-batch-1'
);

-- ── phy-nuclei-properties-copied.json (───────────────────────────)

-- cuet-phy-nuclei-prop-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-atoms-nuclei',
  'cuet-phy-atom-nucleus',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The graph shows binding energy per nucleon (BE/A) versus mass number (A). Which region of the curve corresponds to nuclei that can release energy by nuclear fission?$t$,
  $t$Nuclear fission releases energy when heavy nuclei (A > 200, like U-235) split into medium-mass fragments with higher BE/A. The right side of the curve (heavy nuclei) has lower BE/A than the middle, so splitting them releases the difference in binding energy.$t$,
  $json${"question_id": "cuet-phy-nuclei-prop-d01", "subtopic": "Binding energy curve and fission", "topic_name": "Nuclear Properties", "bloom_level": "understand", "options": [{"key": "A", "text": "Light nuclei (A < 20)", "is_correct": false}, {"key": "B", "text": "Medium nuclei near the peak (A ≈ 56)", "is_correct": false}, {"key": "C", "text": "All nuclei along the curve", "is_correct": false}, {"key": "D", "text": "Heavy nuclei (A > 200)", "is_correct": true}], "elimination_hints": [{"option_key": "A", "hint": "Light nuclei release energy by fusion (moving up the curve), not fission.", "misconception": "Confusing fusion with fission"}, {"option_key": "B", "hint": "Nuclei near the peak (like Fe-56) are the most stable — they cannot release energy by either fission or fusion.", "misconception": "Thinking the most stable nuclei undergo fission"}, {"option_key": "C", "hint": "Only nuclei on the declining right side can release energy by fission. Light nuclei release energy by fusion instead.", "misconception": null}], "image_uri": "diagrams/cuet-phy-nuclei-prop-d01.png", "image_alt": "BE/A vs A curve showing rise to peak around A=56 (Fe), then gradual decline. Regions marked: light nuclei (left), medium nuclei (peak), heavy nuclei (right)"}$json$::jsonb,
  NULL,
  $t$BE/A vs A curve showing rise to peak around A=56 (Fe), then gradual decline. Regions marked: light nuclei (left), medium nuclei (peak), heavy nuclei (right)$t$,
  'D',
  ARRAY['binding-energy','nuclear-fission','mass-number'],
  'active',
  true,
  'correction-batch-1'
);

-- cuet-phy-nuclei-prop-d02  (diagram-based, easy)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-atoms-nuclei',
  'cuet-phy-atom-nucleus',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'easy',
  'just-started',
  $t$The diagram shows a schematic of a nucleus with protons (marked +) and neutrons (marked n). If the nucleus shown has 6 protons and 8 neutrons, which element is it and what is its mass number?$t$,
  $t$The element is determined by atomic number Z = number of protons = 6, which is Carbon. Mass number A = Z + N = 6 + 8 = 14. So the nucleus is Carbon-14 (¹⁴C), a radioactive isotope used in carbon dating.$t$,
  $json${"question_id": "cuet-phy-nuclei-prop-d02", "subtopic": "Nuclear composition", "topic_name": "Nuclear Properties", "bloom_level": "remember", "options": [{"key": "A", "text": "Nitrogen-14 (A = 14)", "is_correct": false}, {"key": "B", "text": "Carbon-12 (A = 12)", "is_correct": false}, {"key": "C", "text": "Carbon-14 (A = 14)", "is_correct": true}, {"key": "D", "text": "Oxygen-14 (A = 14)", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Nitrogen has Z = 7, but the diagram shows only 6 protons.", "misconception": "Counting nucleons incorrectly"}, {"option_key": "B", "hint": "Carbon-12 has 6 protons and 6 neutrons (A = 12), but the diagram shows 8 neutrons.", "misconception": "Assuming equal protons and neutrons"}, {"option_key": "D", "hint": "Oxygen has Z = 8, not Z = 6.", "misconception": "Confusing atomic numbers of C and O"}], "image_uri": "diagrams/cuet-phy-nuclei-prop-d02.png", "image_alt": "Circular cluster showing 6 particles marked '+' (protons) and 8 particles marked 'n' (neutrons) packed together"}$json$::jsonb,
  NULL,
  $t$Circular cluster showing 6 particles marked '+' (protons) and 8 particles marked 'n' (neutrons) packed together$t$,
  'C',
  ARRAY['atomic-number','mass-number','nuclear-composition'],
  'active',
  true,
  'correction-batch-1'
);

-- cuet-phy-nuclei-prop-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-atoms-nuclei',
  'cuet-phy-atom-nucleus',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following nuclear reactions in order of the energy released per nucleon (lowest to highest):
(I) Nuclear fission of U-235
(II) Nuclear fusion of hydrogen to helium
(III) Chemical combustion of coal
(IV) Nuclear fission of Pu-239$t$,
  $t$Chemical combustion releases ~few eV per molecule ≈ negligible per nucleon. U-235 fission releases ~200 MeV / 236 ≈ 0.85 MeV/nucleon. Pu-239 fission releases ~210 MeV / 240 ≈ 0.88 MeV/nucleon. H→He fusion releases ~26.7 MeV / 4 ≈ 6.7 MeV/nucleon. Order: III < I < IV < II.$t$,
  $json${"question_id": "cuet-phy-nuclei-prop-ls01", "subtopic": "Energy release comparison", "topic_name": "Nuclear Properties", "bloom_level": "analyze", "options": [{"key": "A", "text": "III → II → I → IV", "is_correct": false}, {"key": "B", "text": "III → I → IV → II", "is_correct": true}, {"key": "C", "text": "I → III → IV → II", "is_correct": false}, {"key": "D", "text": "III → IV → I → II", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Fusion releases far more energy per nucleon than fission — it should be last, not second.", "misconception": "Thinking total energy equals energy per nucleon"}, {"option_key": "C", "hint": "Chemical reactions release orders of magnitude less energy than nuclear reactions.", "misconception": "Overestimating chemical energy relative to nuclear energy"}, {"option_key": "D", "hint": "U-235 and Pu-239 release similar energy per nucleon, with Pu-239 slightly higher.", "misconception": null}]}$json$::jsonb,
  NULL,
  NULL,
  'B',
  ARRAY['energy-per-nucleon','fission-vs-fusion','nuclear-energy'],
  'active',
  true,
  'correction-batch-1'
);

-- ── phy-current-ohm-copied.json (─────────────────────────────────)

-- cuet-phy-current-ohm-d01  (diagram-based, easy)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-current-electricity',
  'cuet-phy-curr-ohm',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'easy',
  'just-started',
  $t$The graph shows V-I characteristics of two conductors A and B. Conductor A has a steeper slope than B. Which conductor has greater resistance?$t$,
  $t$From Ohm's law, V = IR, so in a V vs I graph, the slope equals R. A steeper slope means greater resistance. Conductor A has the steeper line, so it has greater resistance.$t$,
  $json${"question_id": "cuet-phy-current-ohm-d01", "subtopic": "V-I characteristics", "topic_name": "Ohm's Law and Resistance", "bloom_level": "understand", "options": [{"key": "A", "text": "Conductor A", "is_correct": true}, {"key": "B", "text": "Conductor B", "is_correct": false}, {"key": "C", "text": "Both have equal resistance", "is_correct": false}, {"key": "D", "text": "Cannot be determined from the graph", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "B has a gentler slope, meaning lower V for the same I, so lower resistance.", "misconception": "Confusing slope with inverse slope"}, {"option_key": "C", "hint": "The slopes are clearly different, so the resistances must be different.", "misconception": null}, {"option_key": "D", "hint": "For ohmic conductors, R = slope of V vs I graph — it is directly readable.", "misconception": null}], "image_uri": "diagrams/cuet-phy-current-ohm-d01.png", "image_alt": "V-I graph with two straight lines through origin: line A with steep slope, line B with gentler slope. V on y-axis, I on x-axis."}$json$::jsonb,
  NULL,
  $t$V-I graph with two straight lines through origin: line A with steep slope, line B with gentler slope. V on y-axis, I on x-axis.$t$,
  'A',
  ARRAY['ohms-law','V-I-characteristics','resistance'],
  'active',
  true,
  'correction-batch-1'
);

-- cuet-phy-current-ohm-d02  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-current-electricity',
  'cuet-phy-curr-ohm',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The diagram shows a circuit with three resistors: R₁ = 2Ω and R₂ = 4Ω in parallel, and this combination in series with R₃ = 3Ω, connected to a 12V battery. What is the total current from the battery?$t$,
  $t$Parallel combination of R₁ and R₂: 1/Rp = 1/2 + 1/4 = 3/4, so Rp = 4/3 Ω. Total resistance: R = R₃ + Rp = 3 + 4/3 = 13/3 Ω. Current I = V/R = 12/(13/3) = 36/13 ≈ 2.77 A.$t$,
  $json${"question_id": "cuet-phy-current-ohm-d02", "subtopic": "Series-parallel combinations", "topic_name": "Ohm's Law and Resistance", "bloom_level": "apply", "options": [{"key": "A", "text": "4 A", "is_correct": false}, {"key": "B", "text": "2 A", "is_correct": false}, {"key": "C", "text": "36/13 A ≈ 2.77 A", "is_correct": true}, {"key": "D", "text": "12/9 A ≈ 1.33 A", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "4 A would mean total R = 3 Ω, ignoring the parallel combination entirely.", "misconception": "Using only R₃ as total resistance"}, {"option_key": "B", "hint": "2 A would mean total R = 6 Ω, which is R₁ + R₂ (series) not R₁ ∥ R₂.", "misconception": "Adding parallel resistors as if in series"}, {"option_key": "D", "hint": "12/9 would mean total R = 9 = 2+4+3, treating all three as series.", "misconception": "Treating all resistors as in series"}], "image_uri": "diagrams/cuet-phy-current-ohm-d02.png", "image_alt": "Circuit: 12V battery connected to R3=3Ω in series, then R1=2Ω and R2=4Ω in parallel"}$json$::jsonb,
  NULL,
  $t$Circuit: 12V battery connected to R3=3Ω in series, then R1=2Ω and R2=4Ω in parallel$t$,
  'C',
  ARRAY['series-parallel','total-resistance','circuit-analysis'],
  'active',
  true,
  'correction-batch-1'
);

-- cuet-phy-current-ohm-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-current-electricity',
  'cuet-phy-curr-ohm',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following materials in order of increasing resistivity:
(I) Copper
(II) Nichrome
(III) Silicon
(IV) Glass$t$,
  $t$Resistivity order: Copper (1.7×10⁻⁸ Ω·m, conductor) < Nichrome (1.1×10⁻⁶ Ω·m, alloy) < Silicon (6.4×10² Ω·m, semiconductor) < Glass (10¹⁰–10¹⁴ Ω·m, insulator).$t$,
  $json${"question_id": "cuet-phy-current-ohm-ls01", "subtopic": "Resistivity of materials", "topic_name": "Ohm's Law and Resistance", "bloom_level": "remember", "options": [{"key": "A", "text": "I → II → III → IV", "is_correct": true}, {"key": "B", "text": "IV → III → II → I", "is_correct": false}, {"key": "C", "text": "I → III → II → IV", "is_correct": false}, {"key": "D", "text": "II → I → III → IV", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "This is the order of decreasing resistivity, not increasing.", "misconception": "Reversing the order"}, {"option_key": "C", "hint": "Nichrome is an alloy with much lower resistivity than silicon (a semiconductor).", "misconception": "Thinking semiconductors have lower resistivity than alloys"}, {"option_key": "D", "hint": "Copper is a better conductor than nichrome — it has lower resistivity.", "misconception": "Confusing conductivity ranking of pure metals and alloys"}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['resistivity','conductors','semiconductors','insulators'],
  'active',
  true,
  'correction-batch-1'
);

-- ── phy-current-kirchhoff-copied.json (───────────────────────────)

-- cuet-phy-current-kirch-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-current-electricity',
  'cuet-phy-curr-kirchhoff',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The diagram shows a Wheatstone bridge with P = 100Ω, Q = 200Ω, R = 150Ω, and S unknown. The galvanometer shows zero deflection. What is the value of S?$t$,
  $t$At balance, P/Q = R/S. So 100/200 = 150/S. Therefore S = 150 × 200/100 = 300Ω.$t$,
  $json${"question_id": "cuet-phy-current-kirch-d01", "subtopic": "Wheatstone bridge balance", "topic_name": "Kirchhoff's Laws", "bloom_level": "apply", "options": [{"key": "A", "text": "75 Ω", "is_correct": false}, {"key": "B", "text": "100 Ω", "is_correct": false}, {"key": "C", "text": "200 Ω", "is_correct": false}, {"key": "D", "text": "300 Ω", "is_correct": true}], "elimination_hints": [{"option_key": "A", "hint": "75 Ω would give P/Q = 1/2 but R/S = 150/75 = 2 — not balanced.", "misconception": "Using P×Q = R×S instead of P/Q = R/S"}, {"option_key": "B", "hint": "100 Ω gives R/S = 3/2 ≠ P/Q = 1/2.", "misconception": null}, {"option_key": "C", "hint": "200 Ω gives R/S = 3/4 ≠ P/Q = 1/2.", "misconception": null}], "image_uri": "diagrams/cuet-phy-current-kirch-d01.png", "image_alt": "Wheatstone bridge circuit with P=100Ω, Q=200Ω on top arms, R=150Ω, S=? on bottom arms, galvanometer in middle"}$json$::jsonb,
  NULL,
  $t$Wheatstone bridge circuit with P=100Ω, Q=200Ω on top arms, R=150Ω, S=? on bottom arms, galvanometer in middle$t$,
  'D',
  ARRAY['wheatstone-bridge','balanced-condition','resistance-measurement'],
  'active',
  true,
  'correction-batch-1'
);

-- cuet-phy-current-kirch-d02  (diagram-based, hard)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-current-electricity',
  'cuet-phy-curr-kirchhoff',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'hard',
  'just-started',
  $t$The circuit diagram shows two loops. Loop 1 has a 10V battery and resistors of 2Ω and 3Ω. Loop 2 shares the 3Ω resistor and has a 5V battery with a 4Ω resistor. Using Kirchhoff's voltage law, what is the current through the 3Ω resistor?$t$,
  $t$Let I₁ flow in loop 1, I₂ in loop 2 (both clockwise). Current through 3Ω = I₁ − I₂. Loop 1: 10 = 2I₁ + 3(I₁−I₂) → 5I₁ − 3I₂ = 10. Loop 2: 5 = 4I₂ + 3(I₂−I₁) → −3I₁ + 7I₂ = 5. Solving: I₁ = 95/26, I₂ = 55/26. Current through 3Ω = 40/26 = 20/13 ≈ 1.54 A.$t$,
  $json${"question_id": "cuet-phy-current-kirch-d02", "subtopic": "Multi-loop circuit analysis", "topic_name": "Kirchhoff's Laws", "bloom_level": "analyze", "options": [{"key": "A", "text": "2 A", "is_correct": false}, {"key": "B", "text": "20/13 A ≈ 1.54 A", "is_correct": true}, {"key": "C", "text": "1 A", "is_correct": false}, {"key": "D", "text": "15/7 A ≈ 2.14 A", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "2 A would be the current if only one battery existed. With two batteries, mesh analysis is needed.", "misconception": "Ignoring the second loop"}, {"option_key": "C", "hint": "1 A is too simple an answer for a two-loop circuit — it doesn't account for the interaction between loops.", "misconception": null}, {"option_key": "D", "hint": "15/7 arises from incorrect loop equations or wrong sign convention.", "misconception": "Sign error in Kirchhoff's voltage law"}], "image_uri": "diagrams/cuet-phy-current-kirch-d02.png", "image_alt": "Two-loop circuit: Loop 1 with 10V battery, 2Ω and 3Ω. Loop 2 with 5V battery, 4Ω sharing the 3Ω with Loop 1"}$json$::jsonb,
  NULL,
  $t$Two-loop circuit: Loop 1 with 10V battery, 2Ω and 3Ω. Loop 2 with 5V battery, 4Ω sharing the 3Ω with Loop 1$t$,
  'B',
  ARRAY['kirchhoff-voltage-law','mesh-analysis','simultaneous-equations'],
  'active',
  true,
  'correction-batch-1'
);

-- cuet-phy-current-kirch-ls01  (logical-sequence, hard)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-current-electricity',
  'cuet-phy-curr-kirchhoff',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'hard',
  'just-started',
  $t$Arrange the following steps for solving a circuit using Kirchhoff's laws:
(I) Apply KVL around each independent loop
(II) Assign current directions in each branch
(III) Apply KCL at each junction
(IV) Solve the simultaneous equations$t$,
  $t$The systematic approach: First assign current directions (II), then apply junction rule KCL (III), then apply loop rule KVL (I), finally solve the resulting equations (IV).$t$,
  $json${"question_id": "cuet-phy-current-kirch-ls01", "subtopic": "Method of solving circuits", "topic_name": "Kirchhoff's Laws", "bloom_level": "understand", "options": [{"key": "A", "text": "I → II → III → IV", "is_correct": false}, {"key": "B", "text": "III → II → I → IV", "is_correct": false}, {"key": "C", "text": "II → III → I → IV", "is_correct": true}, {"key": "D", "text": "II → I → III → IV", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "You must assign currents before writing KVL equations — you need variable names first.", "misconception": "Trying to write equations without defining variables"}, {"option_key": "B", "hint": "KCL at junctions requires knowing current directions first.", "misconception": null}, {"option_key": "D", "hint": "KCL at junctions is typically applied before KVL to reduce the number of unknowns.", "misconception": "Applying KVL before KCL"}]}$json$::jsonb,
  NULL,
  NULL,
  'C',
  ARRAY['kirchhoff-laws','circuit-solving','systematic-method'],
  'active',
  true,
  'correction-batch-1'
);

-- ── phy-current-instruments-copied.json (─────────────────────────)

-- cuet-phy-current-instr-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-current-electricity',
  'cuet-phy-curr-wheatstone',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The diagram shows a meter bridge in balance. The balance point is at 40 cm from the left end. If the known resistance R = 6Ω, what is the unknown resistance X?$t$,
  $t$At balance: X/R = l/(100−l) = 40/60 = 2/3. So X = R × 2/3 = 6 × 2/3 = 4Ω.$t$,
  $json${"question_id": "cuet-phy-current-instr-d01", "subtopic": "Meter bridge", "topic_name": "Electrical Instruments", "bloom_level": "apply", "options": [{"key": "A", "text": "9 Ω", "is_correct": false}, {"key": "B", "text": "4 Ω", "is_correct": true}, {"key": "C", "text": "6 Ω", "is_correct": false}, {"key": "D", "text": "2.4 Ω", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "9 Ω would give X/R = 9/6 = 3/2, requiring balance at 60 cm, not 40 cm.", "misconception": "Inverting the ratio l/(100-l)"}, {"option_key": "C", "hint": "X = R = 6Ω would require balance at 50 cm (midpoint).", "misconception": null}, {"option_key": "D", "hint": "2.4 Ω comes from an incorrect formula.", "misconception": null}], "image_uri": "diagrams/cuet-phy-current-instr-d01.png", "image_alt": "Meter bridge setup with jockey at 40cm mark, R=6Ω on left gap, X on right gap, galvanometer connected"}$json$::jsonb,
  NULL,
  $t$Meter bridge setup with jockey at 40cm mark, R=6Ω on left gap, X on right gap, galvanometer connected$t$,
  'B',
  ARRAY['meter-bridge','wheatstone-principle','resistance-measurement'],
  'active',
  true,
  'correction-batch-1'
);

-- cuet-phy-current-instr-d02  (diagram-based, easy)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-current-electricity',
  'cuet-phy-curr-potentiometer',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'easy',
  'just-started',
  $t$The diagram shows a potentiometer circuit. A standard cell of EMF 1.02 V balances at length 51 cm. An unknown EMF balances at 75 cm. What is the unknown EMF?$t$,
  $t$In a potentiometer, EMF ∝ balancing length. E_unknown/E_standard = l₂/l₁ = 75/51. So E_unknown = 1.02 × 75/51 = 1.5 V.$t$,
  $json${"question_id": "cuet-phy-current-instr-d02", "subtopic": "Potentiometer", "topic_name": "Electrical Instruments", "bloom_level": "apply", "options": [{"key": "A", "text": "0.693 V", "is_correct": false}, {"key": "B", "text": "1.02 V", "is_correct": false}, {"key": "C", "text": "1.5 V", "is_correct": true}, {"key": "D", "text": "2.04 V", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "0.693 V = 1.02 × 51/75 — you inverted the ratio.", "misconception": "Using l₁/l₂ instead of l₂/l₁"}, {"option_key": "B", "hint": "The unknown balances at a longer length, so its EMF must be greater than 1.02 V.", "misconception": "Thinking both EMFs are equal"}, {"option_key": "D", "hint": "2.04 V = 2 × 1.02 would need balance at 102 cm, which exceeds the wire length.", "misconception": null}], "image_uri": "diagrams/cuet-phy-current-instr-d02.png", "image_alt": "Potentiometer wire with driver cell, galvanometer, standard cell balancing at 51cm and unknown cell at 75cm"}$json$::jsonb,
  NULL,
  $t$Potentiometer wire with driver cell, galvanometer, standard cell balancing at 51cm and unknown cell at 75cm$t$,
  'C',
  ARRAY['potentiometer','emf-comparison','balancing-length'],
  'active',
  true,
  'correction-batch-1'
);

-- cuet-phy-current-instr-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-current-electricity',
  'cuet-phy-curr-wheatstone',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following steps for measuring unknown resistance using a meter bridge:
(I) Note the balancing length
(II) Connect the unknown resistance and known resistance in the gaps
(III) Calculate X using X/R = l/(100−l)
(IV) Slide the jockey along the wire until galvanometer shows null deflection$t$,
  $t$First connect the resistances (II), then slide jockey to find null point (IV), note the length (I), and finally calculate (III).$t$,
  $json${"question_id": "cuet-phy-current-instr-ls01", "subtopic": "Meter bridge procedure", "topic_name": "Electrical Instruments", "bloom_level": "remember", "options": [{"key": "A", "text": "II → IV → I → III", "is_correct": true}, {"key": "B", "text": "I → II → IV → III", "is_correct": false}, {"key": "C", "text": "II → I → IV → III", "is_correct": false}, {"key": "D", "text": "IV → II → III → I", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "You can't note the balancing length before connecting the resistances and finding balance.", "misconception": null}, {"option_key": "C", "hint": "You must find the null point (IV) before noting the length (I).", "misconception": "Noting length before finding balance"}, {"option_key": "D", "hint": "You can't slide the jockey before connecting the circuit.", "misconception": null}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['meter-bridge','experimental-procedure','resistance-measurement'],
  'active',
  true,
  'correction-batch-1'
);

-- Total: 21 questions inserted
COMMIT;

