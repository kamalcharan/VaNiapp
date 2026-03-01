-- ==========================================================================
-- BATCH 2: Correction questions for CUET Physics
-- 30 questions: 20 diagram-based + 10 logical-sequence
-- Chapters: Dual Nature (6), Electronic Devices (9),
--           Electrostatics (9), EM Induction & AC (6)
-- ==========================================================================

BEGIN;

-- ==========================================================================
-- STEP 1: Create missing CUET topics in med_topics
-- ==========================================================================

INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important) VALUES
('cuet-phy-dual-debroglie',    'cuet-phy-dual-nature', 'de Broglie Wavelength and Davisson-Germer Experiment', 1, true),
('cuet-phy-dual-photoelectric','cuet-phy-dual-nature', 'Photoelectric Effect and Einstein''s Equation',         2, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important) VALUES
('cuet-phy-semi-diode',       'cuet-phy-electronic-devices', 'Diode Applications (Rectifier, Zener, LED, Photodiode)', 1, true),
('cuet-phy-semi-pn',          'cuet-phy-electronic-devices', 'p-n Junction Diode and Characteristics',                  2, true),
('cuet-phy-semi-transistor',  'cuet-phy-electronic-devices', 'Transistor, Logic Gates, and Amplifiers',                  3, true),
('cuet-phy-semi-logic-gates', 'cuet-phy-electronic-devices', 'Logic Gates and Boolean Algebra',                          4, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important) VALUES
('cuet-phy-es-capacitor',  'cuet-phy-electrostatics', 'Capacitors and Capacitance',                1, true),
('cuet-phy-es-dielectric', 'cuet-phy-electrostatics', 'Combination of Capacitors and Dielectrics', 2, true),
('cuet-phy-es-potential',  'cuet-phy-electrostatics', 'Electric Potential and Potential Energy',    3, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important) VALUES
('cuet-phy-em-ac-circuits',  'cuet-phy-em-induction', 'AC Circuits (R, L, C, LCR Series)',            1, true),
('cuet-phy-em-transformer',  'cuet-phy-em-induction', 'Resonance, Power Factor, and Transformers',    2, true)
ON CONFLICT (id) DO NOTHING;

-- ==========================================================================
-- STEP 2: Insert correction questions
-- ==========================================================================

-- ── phy-dual-debroglie-copied.json (──────────────────────────────)

-- cuet-phy-dual-debroglie-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-dual-nature',
  'cuet-phy-dual-debroglie',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The graph shows the variation of de Broglie wavelength (λ) with accelerating potential (V) for an electron. Which of the following best describes the nature of this curve?$t$,
  $t$For an electron accelerated through potential V: λ = h/√(2meV) = 1.226/√V nm. So λ ∝ 1/√V, giving a rectangular hyperbola that decreases steeply at low V and flattens at high V.$t$,
  $json${"question_id": "cuet-phy-dual-debroglie-d01", "subtopic": "de Broglie wavelength vs potential", "topic_name": "de Broglie Wavelength and Davisson-Germer Experiment", "bloom_level": "understand", "options": [{"key": "A", "text": "A straight line with negative slope", "is_correct": false}, {"key": "B", "text": "A rectangular hyperbola (λ ∝ 1/√V)", "is_correct": true}, {"key": "C", "text": "A parabola opening upward", "is_correct": false}, {"key": "D", "text": "An exponential decay curve", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "A straight line would mean λ ∝ V, but the relation is λ ∝ 1/√V.", "misconception": "Assuming linear relationship"}, {"option_key": "C", "hint": "A parabola would mean λ ∝ V², which increases with V — opposite of what happens.", "misconception": null}, {"option_key": "D", "hint": "Exponential decay (λ ∝ e⁻ᵛ) drops much faster than 1/√V. The curve is algebraic, not exponential.", "misconception": "Confusing power law with exponential"}], "image_uri": "diagrams/cuet-phy-dual-debroglie-d01.png", "image_alt": "Graph showing λ on y-axis vs V on x-axis. Curve is a decreasing hyperbolic shape approaching the x-axis as V increases."}$json$::jsonb,
  NULL,
  $t$Graph showing λ on y-axis vs V on x-axis. Curve is a decreasing hyperbolic shape approaching the x-axis as V increases.$t$,
  'B',
  ARRAY['de-broglie-wavelength','accelerating-potential','graphical-analysis'],
  'active',
  true,
  'correction-batch-2'
);

-- cuet-phy-dual-debroglie-d02  (diagram-based, hard)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-dual-nature',
  'cuet-phy-dual-debroglie',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'hard',
  'just-started',
  $t$The diagram shows the Davisson-Germer experiment setup with an electron beam hitting a nickel crystal. The detector is at angle φ from the incident beam. A strong diffraction peak is observed at φ = 50° when the accelerating voltage is 54 V. What is the interplanar spacing d of the crystal if the first-order maximum is observed?$t$,
  $t$In Davisson-Germer: scattering angle θ = (180° − φ)/2 = (180° − 50°)/2 = 65°. Bragg's law: nλ = 2d sin θ. For 54V electrons: λ = 1.226/√54 = 0.167 nm. So d = λ/(2 sin 65°) = 0.167/(2 × 0.906) = 0.092 nm ≈ 0.91 Å.$t$,
  $json${"question_id": "cuet-phy-dual-debroglie-d02", "subtopic": "Davisson-Germer experiment analysis", "topic_name": "de Broglie Wavelength and Davisson-Germer Experiment", "bloom_level": "analyze", "options": [{"key": "A", "text": "0.167 nm", "is_correct": false}, {"key": "B", "text": "0.123 nm", "is_correct": false}, {"key": "C", "text": "0.092 nm", "is_correct": true}, {"key": "D", "text": "0.184 nm", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "0.167 nm is the de Broglie wavelength itself, not the interplanar spacing.", "misconception": "Confusing wavelength with spacing"}, {"option_key": "B", "hint": "This would result from using φ directly in Bragg's law instead of converting to θ.", "misconception": null}, {"option_key": "D", "hint": "0.184 nm = λ/sin 65° — missing the factor of 2 in Bragg's law.", "misconception": "Forgetting the factor 2 in 2d sin θ"}], "image_uri": "diagrams/cuet-phy-dual-debroglie-d02.png", "image_alt": "Davisson-Germer setup: electron gun on left, nickel crystal in center, movable detector showing peak at φ=50°, with scattering angle θ marked"}$json$::jsonb,
  NULL,
  $t$Davisson-Germer setup: electron gun on left, nickel crystal in center, movable detector showing peak at φ=50°, with scattering angle θ marked$t$,
  'C',
  ARRAY['davisson-germer','electron-diffraction','bragg-law'],
  'active',
  true,
  'correction-batch-2'
);

-- cuet-phy-dual-debroglie-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-dual-nature',
  'cuet-phy-dual-debroglie',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following particles in order of increasing de Broglie wavelength when all have the same kinetic energy:
(I) Proton
(II) Electron
(III) Alpha particle
(IV) Neutron$t$,
  $t$λ = h/√(2mKE). At same KE, λ ∝ 1/√m. Masses: electron (9.1×10⁻³¹) < proton ≈ neutron (1.67×10⁻²⁷) < alpha (6.64×10⁻²⁷). Increasing λ means decreasing mass: α < p ≈ n < e. So III → (I,IV) → II.$t$,
  $json${"question_id": "cuet-phy-dual-debroglie-ls01", "subtopic": "Wavelength comparison of particles", "topic_name": "de Broglie Wavelength and Davisson-Germer Experiment", "bloom_level": "analyze", "options": [{"key": "A", "text": "III → IV → I → II", "is_correct": true}, {"key": "B", "text": "II → I → IV → III", "is_correct": false}, {"key": "C", "text": "I → IV → III → II", "is_correct": false}, {"key": "D", "text": "III → I → IV → II", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "This is the order of decreasing wavelength. Electron has the largest λ, not smallest.", "misconception": "Reversing the order"}, {"option_key": "C", "hint": "Proton and neutron have nearly equal mass, and alpha is heavier — so alpha has the smallest λ.", "misconception": null}, {"option_key": "D", "hint": "Proton and neutron have nearly equal mass, so their wavelengths are nearly equal. Neutron (IV) should be close to proton (I).", "misconception": "Ignoring near-equal masses of p and n"}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['de-broglie-wavelength','mass-dependence','particle-comparison'],
  'active',
  true,
  'correction-batch-2'
);

-- ── phy-dual-photoelectric-copied.json (──────────────────────────)

-- cuet-phy-dual-photo-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-dual-nature',
  'cuet-phy-dual-photoelectric',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The graph shows the variation of stopping potential (V₀) versus frequency (ν) for two different metals P and Q. Both lines are parallel. Which metal has a higher work function?$t$,
  $t$From Einstein's equation: eV₀ = hν − φ, so V₀ = (h/e)ν − φ/e. The slope h/e is same for all metals (parallel lines). The x-intercept gives threshold frequency ν₀ = φ/h. Since Q has higher threshold frequency (ν₂ > ν₁), Q has higher work function φ = hν₀.$t$,
  $json${"question_id": "cuet-phy-dual-photo-d01", "subtopic": "Stopping potential vs frequency graph", "topic_name": "Photoelectric Effect and Einstein's Equation", "bloom_level": "analyze", "options": [{"key": "A", "text": "Metal P", "is_correct": false}, {"key": "B", "text": "Metal Q", "is_correct": true}, {"key": "C", "text": "Both have equal work functions", "is_correct": false}, {"key": "D", "text": "Cannot be determined from the graph", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "P has lower threshold frequency, meaning lower work function φ = hν₀.", "misconception": "Confusing lower threshold with higher work function"}, {"option_key": "C", "hint": "The lines have different x-intercepts, so work functions must differ.", "misconception": null}, {"option_key": "D", "hint": "The x-intercept directly gives threshold frequency, from which work function is determined.", "misconception": null}], "image_uri": "diagrams/cuet-phy-dual-photo-d01.png", "image_alt": "V₀ vs ν graph with two parallel straight lines. Line P has threshold frequency ν₁ and line Q has threshold frequency ν₂ where ν₂ > ν₁"}$json$::jsonb,
  NULL,
  $t$V₀ vs ν graph with two parallel straight lines. Line P has threshold frequency ν₁ and line Q has threshold frequency ν₂ where ν₂ > ν₁$t$,
  'B',
  ARRAY['stopping-potential','work-function','threshold-frequency'],
  'active',
  true,
  'correction-batch-2'
);

-- cuet-phy-dual-photo-d02  (diagram-based, easy)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-dual-nature',
  'cuet-phy-dual-photoelectric',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'easy',
  'just-started',
  $t$The diagram shows the I-V characteristics of a photoelectric cell for two different intensities I₁ and I₂ (I₂ > I₁) of light at the same frequency. What remains the same for both curves?$t$,
  $t$At same frequency, the stopping potential V₀ depends only on frequency (V₀ = hν/e − φ/e), not on intensity. Higher intensity increases the number of photoelectrons (higher saturation current) but doesn't change their maximum KE. So stopping potential is the same.$t$,
  $json${"question_id": "cuet-phy-dual-photo-d02", "subtopic": "Effect of intensity on photoelectric current", "topic_name": "Photoelectric Effect and Einstein's Equation", "bloom_level": "understand", "options": [{"key": "A", "text": "The saturation current", "is_correct": false}, {"key": "B", "text": "The photoelectric current at zero voltage", "is_correct": false}, {"key": "C", "text": "The stopping potential", "is_correct": true}, {"key": "D", "text": "Both saturation current and stopping potential", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Saturation current increases with intensity — more photons eject more electrons.", "misconception": "Thinking saturation current is independent of intensity"}, {"option_key": "B", "hint": "Current at zero voltage also depends on the number of electrons emitted, which changes with intensity.", "misconception": null}, {"option_key": "D", "hint": "Saturation current changes with intensity; only stopping potential stays constant.", "misconception": null}], "image_uri": "diagrams/cuet-phy-dual-photo-d02.png", "image_alt": "I-V graph showing two curves: I₂ (higher saturation current) and I₁ (lower saturation current), both reaching the same stopping potential −V₀ on the negative voltage side"}$json$::jsonb,
  NULL,
  $t$I-V graph showing two curves: I₂ (higher saturation current) and I₁ (lower saturation current), both reaching the same stopping potential −V₀ on the negative voltage side$t$,
  'C',
  ARRAY['photoelectric-effect','intensity','stopping-potential'],
  'active',
  true,
  'correction-batch-2'
);

-- cuet-phy-dual-photo-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-dual-nature',
  'cuet-phy-dual-photoelectric',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following electromagnetic radiations in order of increasing ability to cause photoelectric emission from a metal with work function 2.0 eV:
(I) Red light (1.8 eV)
(II) Yellow light (2.1 eV)
(III) Blue light (2.8 eV)
(IV) Ultraviolet (4.0 eV)$t$,
  $t$Only photons with energy > work function (2.0 eV) cause emission. Red (1.8 eV) cannot cause emission at all. For those that can: max KE = hν − φ. Yellow: 0.1 eV, Blue: 0.8 eV, UV: 2.0 eV. Order: I (no emission) → II → III → IV.$t$,
  $json${"question_id": "cuet-phy-dual-photo-ls01", "subtopic": "Energy threshold for photoemission", "topic_name": "Photoelectric Effect and Einstein's Equation", "bloom_level": "apply", "options": [{"key": "A", "text": "I → II → III → IV", "is_correct": true}, {"key": "B", "text": "IV → III → II → I", "is_correct": false}, {"key": "C", "text": "I → III → II → IV", "is_correct": false}, {"key": "D", "text": "II → I → III → IV", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "This is the order of decreasing ability, not increasing.", "misconception": "Reversing the order"}, {"option_key": "C", "hint": "Blue light (2.8 eV) gives more KE than yellow (2.1 eV), so III comes after II.", "misconception": null}, {"option_key": "D", "hint": "Red light (1.8 eV) has less energy than the work function, so it cannot cause emission at all — it should be first (least ability).", "misconception": "Thinking all light causes photoemission"}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['photoelectric-effect','photon-energy','threshold-energy'],
  'active',
  true,
  'correction-batch-2'
);

-- ── phy-semi-diode-copied.json (──────────────────────────────────)

-- cuet-phy-semi-diode-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-electronic-devices',
  'cuet-phy-semi-diode',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The diagram shows a half-wave rectifier circuit with an AC input of peak voltage 10 V and a silicon diode (barrier potential 0.7 V). What is the peak value of the output voltage across the load resistor?$t$,
  $t$In a half-wave rectifier, the diode conducts only during the positive half-cycle. The output peak voltage = input peak − barrier potential = 10 − 0.7 = 9.3 V.$t$,
  $json${"question_id": "cuet-phy-semi-diode-d01", "subtopic": "Half-wave rectifier output", "topic_name": "Diode Applications (Rectifier, Zener, LED, Photodiode)", "bloom_level": "apply", "options": [{"key": "A", "text": "10 V", "is_correct": false}, {"key": "B", "text": "5 V", "is_correct": false}, {"key": "C", "text": "9.3 V", "is_correct": true}, {"key": "D", "text": "10.7 V", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "10 V ignores the voltage drop across the diode (0.7 V for silicon).", "misconception": "Ignoring diode barrier potential"}, {"option_key": "B", "hint": "5 V would be the average, not the peak of the output.", "misconception": "Confusing peak with average value"}, {"option_key": "D", "hint": "The diode drops voltage, not adds — output is always less than input peak.", "misconception": "Adding barrier potential instead of subtracting"}], "image_uri": "diagrams/cuet-phy-semi-diode-d01.png", "image_alt": "Half-wave rectifier circuit: AC source connected to diode (D) in series with load resistor (R_L). Output shows positive half-cycles only."}$json$::jsonb,
  NULL,
  $t$Half-wave rectifier circuit: AC source connected to diode (D) in series with load resistor (R_L). Output shows positive half-cycles only.$t$,
  'C',
  ARRAY['half-wave-rectifier','diode-barrier','peak-voltage'],
  'active',
  true,
  'correction-batch-2'
);

-- cuet-phy-semi-diode-d02  (diagram-based, easy)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-electronic-devices',
  'cuet-phy-semi-diode',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'easy',
  'just-started',
  $t$The diagram shows a Zener diode voltage regulator circuit. The Zener breakdown voltage is 6 V and the input voltage varies from 9 V to 15 V. What is the output voltage across the load?$t$,
  $t$In a Zener voltage regulator, when the input exceeds the Zener voltage, the Zener diode maintains a constant voltage across itself (and the load). So output = Zener voltage = 6 V, regardless of input variation from 9 V to 15 V.$t$,
  $json${"question_id": "cuet-phy-semi-diode-d02", "subtopic": "Zener voltage regulation", "topic_name": "Diode Applications (Rectifier, Zener, LED, Photodiode)", "bloom_level": "understand", "options": [{"key": "A", "text": "6 V (constant)", "is_correct": true}, {"key": "B", "text": "Varies from 9 V to 15 V", "is_correct": false}, {"key": "C", "text": "Varies from 3 V to 9 V", "is_correct": false}, {"key": "D", "text": "12 V (average of input range)", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "This would mean no regulation — the whole point of the Zener is to keep output constant.", "misconception": "Not understanding voltage regulation"}, {"option_key": "C", "hint": "The excess voltage (input − Zener) drops across Rs, not across the load.", "misconception": "Subtracting Zener voltage from input"}, {"option_key": "D", "hint": "The Zener maintains exactly its breakdown voltage, not the average.", "misconception": null}], "image_uri": "diagrams/cuet-phy-semi-diode-d02.png", "image_alt": "Zener regulator circuit: input voltage source, series resistor Rs, Zener diode in reverse bias across load resistor R_L, output = 6V"}$json$::jsonb,
  NULL,
  $t$Zener regulator circuit: input voltage source, series resistor Rs, Zener diode in reverse bias across load resistor R_L, output = 6V$t$,
  'A',
  ARRAY['zener-diode','voltage-regulator','breakdown-voltage'],
  'active',
  true,
  'correction-batch-2'
);

-- cuet-phy-semi-diode-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-electronic-devices',
  'cuet-phy-semi-diode',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following special-purpose diodes in order of increasing wavelength of radiation they typically interact with:
(I) Solar cell
(II) LED (red)
(III) Photodiode (IR)
(IV) X-ray detector diode$t$,
  $t$X-ray: ~0.01–10 nm, Solar cell: visible ~400–700 nm, LED (red): ~620–750 nm, IR photodiode: ~800–1600 nm. Order of increasing wavelength: IV → I → II → III.$t$,
  $json${"question_id": "cuet-phy-semi-diode-ls01", "subtopic": "Spectral range of different diodes", "topic_name": "Diode Applications (Rectifier, Zener, LED, Photodiode)", "bloom_level": "understand", "options": [{"key": "A", "text": "III → II → I → IV", "is_correct": false}, {"key": "B", "text": "IV → I → II → III", "is_correct": true}, {"key": "C", "text": "IV → II → I → III", "is_correct": false}, {"key": "D", "text": "I → II → III → IV", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "This is roughly the reverse order. X-rays have the shortest wavelength.", "misconception": "Reversing wavelength order"}, {"option_key": "C", "hint": "Solar cells absorb visible light (~500 nm avg), red LEDs emit ~650 nm — solar cell range starts at shorter wavelength.", "misconception": null}, {"option_key": "D", "hint": "Solar cells work in visible range, not the shortest wavelength.", "misconception": null}]}$json$::jsonb,
  NULL,
  NULL,
  'B',
  ARRAY['special-diodes','wavelength','electromagnetic-spectrum'],
  'active',
  true,
  'correction-batch-2'
);

-- ── phy-semi-pn-copied.json (─────────────────────────────────────)

-- cuet-phy-semi-pn-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-electronic-devices',
  'cuet-phy-semi-pn',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The diagram shows the I-V characteristic of a p-n junction diode. In forward bias, the diode starts conducting significantly at voltage Vk (knee voltage). If Vk = 0.7 V and the forward resistance above Vk is 20 Ω, what current flows when 1.5 V is applied?$t$,
  $t$Above knee voltage, I = (V − Vk)/Rf = (1.5 − 0.7)/20 = 0.8/20 = 0.04 A = 40 mA.$t$,
  $json${"question_id": "cuet-phy-semi-pn-d01", "subtopic": "Forward bias I-V characteristics", "topic_name": "p-n Junction Diode and Characteristics", "bloom_level": "apply", "options": [{"key": "A", "text": "75 mA", "is_correct": false}, {"key": "B", "text": "40 mA", "is_correct": true}, {"key": "C", "text": "35 mA", "is_correct": false}, {"key": "D", "text": "0 mA", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "75 mA = 1.5V/20Ω — this ignores the knee voltage drop of 0.7 V.", "misconception": "Ignoring knee voltage in calculation"}, {"option_key": "C", "hint": "35 mA = 0.7/20 — this uses the knee voltage instead of (V − Vk).", "misconception": "Using Vk instead of (V − Vk)"}, {"option_key": "D", "hint": "1.5 V > 0.7 V (knee voltage), so the diode is conducting.", "misconception": "Thinking diode doesn't conduct at 1.5V"}], "image_uri": "diagrams/cuet-phy-semi-pn-d01.png", "image_alt": "I-V curve of p-n junction: negligible current below Vk=0.7V in forward bias, then steeply rising current. Reverse bias shows very small constant current until breakdown."}$json$::jsonb,
  NULL,
  $t$I-V curve of p-n junction: negligible current below Vk=0.7V in forward bias, then steeply rising current. Reverse bias shows very small constant current until breakdown.$t$,
  'B',
  ARRAY['pn-junction','IV-characteristics','knee-voltage','forward-bias'],
  'active',
  true,
  'correction-batch-2'
);

-- cuet-phy-semi-pn-d02  (diagram-based, easy)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-electronic-devices',
  'cuet-phy-semi-pn',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'easy',
  'just-started',
  $t$The diagram shows the energy band diagram of a p-n junction at equilibrium (no external bias). The built-in potential barrier is shown. What happens to the width of the depletion region when forward bias is applied?$t$,
  $t$Forward bias reduces the potential barrier, allowing majority carriers to cross. This reduces the depletion region width. The external voltage opposes the built-in potential, narrowing the space charge region.$t$,
  $json${"question_id": "cuet-phy-semi-pn-d02", "subtopic": "Effect of bias on depletion region", "topic_name": "p-n Junction Diode and Characteristics", "bloom_level": "understand", "options": [{"key": "A", "text": "Decreases", "is_correct": true}, {"key": "B", "text": "Increases", "is_correct": false}, {"key": "C", "text": "Remains the same", "is_correct": false}, {"key": "D", "text": "First increases then decreases", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "Increase in depletion width occurs in reverse bias, not forward bias.", "misconception": "Confusing forward and reverse bias effects"}, {"option_key": "C", "hint": "Any applied bias changes the equilibrium — depletion width must change.", "misconception": null}, {"option_key": "D", "hint": "Forward bias consistently reduces the barrier — there's no reversal.", "misconception": null}], "image_uri": "diagrams/cuet-phy-semi-pn-d02.png", "image_alt": "Energy band diagram of p-n junction showing conduction band, valence band, Fermi level, depletion region width W, and built-in potential Vbi"}$json$::jsonb,
  NULL,
  $t$Energy band diagram of p-n junction showing conduction band, valence band, Fermi level, depletion region width W, and built-in potential Vbi$t$,
  'A',
  ARRAY['depletion-region','forward-bias','energy-band-diagram'],
  'active',
  true,
  'correction-batch-2'
);

-- cuet-phy-semi-pn-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-electronic-devices',
  'cuet-phy-semi-pn',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following steps in the formation of a p-n junction in the correct order:
(I) Diffusion of majority carriers across the junction
(II) Formation of immobile ion layer (depletion region)
(III) Establishment of built-in electric field
(IV) Equilibrium — diffusion current equals drift current$t$,
  $t$When p and n types are joined: majority carriers diffuse (I), leaving behind immobile ions that form the depletion region (II), creating a built-in electric field (III), which opposes further diffusion until equilibrium is reached (IV).$t$,
  $json${"question_id": "cuet-phy-semi-pn-ls01", "subtopic": "Formation of p-n junction", "topic_name": "p-n Junction Diode and Characteristics", "bloom_level": "understand", "options": [{"key": "A", "text": "I → II → III → IV", "is_correct": true}, {"key": "B", "text": "III → I → II → IV", "is_correct": false}, {"key": "C", "text": "II → I → III → IV", "is_correct": false}, {"key": "D", "text": "I → III → II → IV", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "The electric field forms because of the depletion region, not before diffusion.", "misconception": "Thinking field exists before junction formation"}, {"option_key": "C", "hint": "Depletion region forms because of diffusion — diffusion must happen first.", "misconception": null}, {"option_key": "D", "hint": "The immobile ions (depletion region) form first, then the field arises from them.", "misconception": "Reversing depletion region and field formation"}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['pn-junction-formation','depletion-region','equilibrium'],
  'active',
  true,
  'correction-batch-2'
);

-- ── phy-semi-transistor-copied.json (─────────────────────────────)

-- cuet-phy-semi-transistor-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-electronic-devices',
  'cuet-phy-semi-transistor',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The diagram shows the output characteristics (Ic vs Vce) of an NPN transistor in common-emitter configuration for two base currents Ib1 and Ib2 (Ib2 > Ib1). If Ib1 = 20 μA gives Ic = 2 mA, what is the current gain β?$t$,
  $t$Current gain β = Ic/Ib = 2 mA / 20 μA = 2×10⁻³ / 20×10⁻⁶ = 100.$t$,
  $json${"question_id": "cuet-phy-semi-transistor-d01", "subtopic": "Transistor current gain", "topic_name": "Transistor, Logic Gates, and Amplifiers", "bloom_level": "apply", "options": [{"key": "A", "text": "10", "is_correct": false}, {"key": "B", "text": "50", "is_correct": false}, {"key": "C", "text": "200", "is_correct": false}, {"key": "D", "text": "100", "is_correct": true}], "elimination_hints": [{"option_key": "A", "hint": "β = 10 would mean Ic = 10 × 20μA = 0.2 mA, not 2 mA.", "misconception": "Unit conversion error"}, {"option_key": "B", "hint": "β = 50 would mean Ic = 50 × 20μA = 1 mA, not 2 mA.", "misconception": null}, {"option_key": "C", "hint": "β = 200 would mean Ic = 200 × 20μA = 4 mA, not 2 mA.", "misconception": null}], "image_uri": "diagrams/cuet-phy-semi-transistor-d01.png", "image_alt": "Ic vs Vce graph with two curves: Ib2 (upper) and Ib1 (lower). Curves show saturation region, active region (nearly flat), and labelled Ib values."}$json$::jsonb,
  NULL,
  $t$Ic vs Vce graph with two curves: Ib2 (upper) and Ib1 (lower). Curves show saturation region, active region (nearly flat), and labelled Ib values.$t$,
  'D',
  ARRAY['transistor','current-gain','common-emitter'],
  'active',
  true,
  'correction-batch-2'
);

-- cuet-phy-semi-transistor-d02  (diagram-based, easy)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-electronic-devices',
  'cuet-phy-semi-logic-gates',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'easy',
  'just-started',
  $t$The diagram shows a two-input NAND gate. What is the output Y when both inputs A = 1 and B = 1?$t$,
  $t$NAND gate: Y = NOT(A AND B). When A=1, B=1: A AND B = 1, so Y = NOT(1) = 0. NAND gives 0 only when both inputs are 1.$t$,
  $json${"question_id": "cuet-phy-semi-transistor-d02", "subtopic": "NAND gate truth table", "topic_name": "Transistor, Logic Gates, and Amplifiers", "bloom_level": "remember", "options": [{"key": "A", "text": "1", "is_correct": false}, {"key": "B", "text": "0", "is_correct": true}, {"key": "C", "text": "Undefined", "is_correct": false}, {"key": "D", "text": "Toggles between 0 and 1", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "1 would be the output of an AND gate, not NAND. NAND is the complement of AND.", "misconception": "Confusing AND with NAND"}, {"option_key": "C", "hint": "Logic gates always have a defined output for given inputs.", "misconception": null}, {"option_key": "D", "hint": "With fixed inputs, the output is fixed — no toggling.", "misconception": null}], "image_uri": "diagrams/cuet-phy-semi-transistor-d02.png", "image_alt": "NAND gate symbol with inputs A and B, output Y. Truth table partially shown."}$json$::jsonb,
  NULL,
  $t$NAND gate symbol with inputs A and B, output Y. Truth table partially shown.$t$,
  'B',
  ARRAY['logic-gates','NAND-gate','boolean-algebra'],
  'active',
  true,
  'correction-batch-2'
);

-- cuet-phy-semi-transistor-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-electronic-devices',
  'cuet-phy-semi-transistor',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following transistor operating regions in order of increasing collector current for a given base current:
(I) Cut-off region
(II) Active region
(III) Saturation region$t$,
  $t$In cut-off: both junctions reverse biased, Ic ≈ 0. In active: base-emitter forward, collector-base reverse, Ic = βIb (moderate). In saturation: both forward biased, Ic reaches maximum. Order: cut-off < active < saturation.$t$,
  $json${"question_id": "cuet-phy-semi-transistor-ls01", "subtopic": "Transistor operating regions", "topic_name": "Transistor, Logic Gates, and Amplifiers", "bloom_level": "understand", "options": [{"key": "A", "text": "I → II → III", "is_correct": true}, {"key": "B", "text": "III → II → I", "is_correct": false}, {"key": "C", "text": "II → I → III", "is_correct": false}, {"key": "D", "text": "I → III → II", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "This is decreasing order. Cut-off has minimum Ic.", "misconception": "Reversing the order"}, {"option_key": "C", "hint": "Cut-off has essentially zero Ic — it cannot be between active and saturation.", "misconception": null}, {"option_key": "D", "hint": "In active region, Ic = βIb. In saturation, Ic is at maximum. Active comes before saturation.", "misconception": "Confusing active and saturation regions"}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['transistor-regions','cut-off','active','saturation'],
  'active',
  true,
  'correction-batch-2'
);

-- ── phy-pot-capacitor-copied.json (───────────────────────────────)

-- cuet-phy-pot-cap-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-electrostatics',
  'cuet-phy-es-capacitor',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The diagram shows a parallel plate capacitor with plate area A and separation d. If the separation is doubled while keeping the charge constant, what happens to the energy stored?$t$,
  $t$At constant charge Q: U = Q²/(2C) = Q²d/(2ε₀A). If d → 2d, then U → 2U. Energy doubles because work is done against the attractive force to pull the plates apart.$t$,
  $json${"question_id": "cuet-phy-pot-cap-d01", "subtopic": "Energy in a capacitor", "topic_name": "Capacitors and Capacitance", "bloom_level": "apply", "options": [{"key": "A", "text": "Halved", "is_correct": false}, {"key": "B", "text": "Remains the same", "is_correct": false}, {"key": "C", "text": "Doubled", "is_correct": true}, {"key": "D", "text": "Quadrupled", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Energy halves if V is constant (U = CV²/2, C halves). But here charge is constant.", "misconception": "Confusing constant charge with constant voltage"}, {"option_key": "B", "hint": "Changing plate separation changes capacitance, which changes stored energy.", "misconception": null}, {"option_key": "D", "hint": "U ∝ d (at constant Q), so doubling d doubles U, not quadruples.", "misconception": "Using d² instead of d"}], "image_uri": "diagrams/cuet-phy-pot-cap-d01.png", "image_alt": "Two parallel plates with charges +Q and −Q, separation d, electric field E between them. Arrow showing d increasing to 2d."}$json$::jsonb,
  NULL,
  $t$Two parallel plates with charges +Q and −Q, separation d, electric field E between them. Arrow showing d increasing to 2d.$t$,
  'C',
  ARRAY['parallel-plate-capacitor','energy-stored','charge-constant'],
  'active',
  true,
  'correction-batch-2'
);

-- cuet-phy-pot-cap-d02  (diagram-based, easy)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-electrostatics',
  'cuet-phy-es-capacitor',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'easy',
  'just-started',
  $t$The diagram shows a capacitor being charged through a resistor. The graph shows the voltage across the capacitor vs time. What is the voltage at time t = RC (one time constant)?$t$,
  $t$During charging: V(t) = V₀(1 − e⁻ᵗ/ᴿᶜ). At t = RC: V = V₀(1 − e⁻¹) = V₀(1 − 0.368) = 0.632V₀ ≈ 63.2% of maximum voltage.$t$,
  $json${"question_id": "cuet-phy-pot-cap-d02", "subtopic": "RC charging circuit", "topic_name": "Capacitors and Capacitance", "bloom_level": "remember", "options": [{"key": "A", "text": "50% of V₀", "is_correct": false}, {"key": "B", "text": "63.2% of V₀", "is_correct": true}, {"key": "C", "text": "37% of V₀", "is_correct": false}, {"key": "D", "text": "100% of V₀", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "50% is reached at t = 0.693RC (= RC × ln2), not at t = RC.", "misconception": "Confusing half-life with time constant"}, {"option_key": "C", "hint": "37% = e⁻¹ is the fraction remaining to charge, not the fraction charged.", "misconception": "Using e⁻¹ instead of (1−e⁻¹)"}, {"option_key": "D", "hint": "100% is only reached at t → ∞. The capacitor charges asymptotically.", "misconception": null}], "image_uri": "diagrams/cuet-phy-pot-cap-d02.png", "image_alt": "RC charging curve: voltage rises exponentially from 0 toward V₀. Time constant τ=RC marked on x-axis. Voltage at τ marked with dashed lines."}$json$::jsonb,
  NULL,
  $t$RC charging curve: voltage rises exponentially from 0 toward V₀. Time constant τ=RC marked on x-axis. Voltage at τ marked with dashed lines.$t$,
  'B',
  ARRAY['RC-circuit','time-constant','charging-curve'],
  'active',
  true,
  'correction-batch-2'
);

-- cuet-phy-pot-cap-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-electrostatics',
  'cuet-phy-es-capacitor',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following capacitor configurations in order of increasing equivalent capacitance, given three identical capacitors each of capacitance C:
(I) All three in series
(II) All three in parallel
(III) Two in series, combination in parallel with the third$t$,
  $t$Series: 1/Ceq = 1/C + 1/C + 1/C → Ceq = C/3. Two series + parallel: Ceq = C/2 + C = 3C/2. All parallel: Ceq = 3C. Order: C/3 < 3C/2 < 3C → I → III → II.$t$,
  $json${"question_id": "cuet-phy-pot-cap-ls01", "subtopic": "Capacitor combinations", "topic_name": "Capacitors and Capacitance", "bloom_level": "apply", "options": [{"key": "A", "text": "I → III → II", "is_correct": true}, {"key": "B", "text": "II → III → I", "is_correct": false}, {"key": "C", "text": "I → II → III", "is_correct": false}, {"key": "D", "text": "III → I → II", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "This is the order of decreasing capacitance.", "misconception": "Reversing the order"}, {"option_key": "C", "hint": "All parallel (3C) > two-series-plus-one-parallel (3C/2).", "misconception": "Thinking all parallel gives less than mixed"}, {"option_key": "D", "hint": "All series (C/3) gives the smallest capacitance, not the mixed configuration.", "misconception": null}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['capacitor-combinations','series-parallel','equivalent-capacitance'],
  'active',
  true,
  'correction-batch-2'
);

-- ── phy-pot-dielectric-copied.json (──────────────────────────────)

-- cuet-phy-pot-dielec-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-electrostatics',
  'cuet-phy-es-dielectric',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The diagram shows a parallel plate capacitor with a dielectric slab of dielectric constant K = 3 inserted to fill half the space between the plates (half the thickness). If the original capacitance is C₀, what is the new capacitance?$t$,
  $t$This is equivalent to two capacitors in series: C₁ = Kε₀A/(d/2) = 2Kε₀A/d = 2KC₀ and C₂ = ε₀A/(d/2) = 2ε₀A/d = 2C₀. In series: 1/C = 1/(2KC₀) + 1/(2C₀) = (1+K)/(2KC₀). So C = 2KC₀/(1+K) = 2(3)C₀/(1+3) = 6C₀/4 = 1.5C₀.$t$,
  $json${"question_id": "cuet-phy-pot-dielec-d01", "subtopic": "Capacitor with partial dielectric", "topic_name": "Combination of Capacitors and Dielectrics", "bloom_level": "apply", "options": [{"key": "A", "text": "3C₀", "is_correct": false}, {"key": "B", "text": "2C₀", "is_correct": false}, {"key": "C", "text": "1.5C₀", "is_correct": true}, {"key": "D", "text": "C₀/3", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "3C₀ would be the capacitance if the entire gap were filled with dielectric.", "misconception": "Treating half-filled as fully filled"}, {"option_key": "B", "hint": "2C₀ would result from an incorrect series combination formula.", "misconception": null}, {"option_key": "D", "hint": "C₀/3 would mean capacitance decreased, but adding dielectric always increases capacitance.", "misconception": "Dividing by K instead of using series formula"}], "image_uri": "diagrams/cuet-phy-pot-dielec-d01.png", "image_alt": "Parallel plate capacitor with total separation d. Bottom half (d/2) filled with dielectric K=3, top half (d/2) is air. Equivalent to two capacitors in series."}$json$::jsonb,
  NULL,
  $t$Parallel plate capacitor with total separation d. Bottom half (d/2) filled with dielectric K=3, top half (d/2) is air. Equivalent to two capacitors in series.$t$,
  'C',
  ARRAY['dielectric','capacitance','series-combination'],
  'active',
  true,
  'correction-batch-2'
);

-- cuet-phy-pot-dielec-d02  (diagram-based, hard)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-electrostatics',
  'cuet-phy-es-dielectric',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'hard',
  'just-started',
  $t$The circuit shows three capacitors: C₁ = 2μF, C₂ = 3μF in series, and this combination in parallel with C₃ = 4μF, connected to a 10V battery. What is the charge on C₃?$t$,
  $t$C₃ is directly across the battery (parallel branch), so V across C₃ = 10 V. Charge on C₃ = C₃ × V = 4μF × 10V = 40 μC.$t$,
  $json${"question_id": "cuet-phy-pot-dielec-d02", "subtopic": "Charge in capacitor circuits", "topic_name": "Combination of Capacitors and Dielectrics", "bloom_level": "apply", "options": [{"key": "A", "text": "12 μC", "is_correct": false}, {"key": "B", "text": "24 μC", "is_correct": false}, {"key": "C", "text": "30 μC", "is_correct": false}, {"key": "D", "text": "40 μC", "is_correct": true}], "elimination_hints": [{"option_key": "A", "hint": "12 μC = series combination charge (C_series × 10V = 1.2μF × 10V). That's for the series branch, not C₃.", "misconception": "Calculating charge on wrong branch"}, {"option_key": "B", "hint": "24 μC comes from using wrong capacitance value.", "misconception": null}, {"option_key": "C", "hint": "30 μC = 3μF × 10V — using C₂ instead of C₃.", "misconception": "Confusing which capacitor is in parallel"}], "image_uri": "diagrams/cuet-phy-pot-dielec-d02.png", "image_alt": "Circuit: C1=2μF and C2=3μF in series, their combination in parallel with C3=4μF, across 10V battery."}$json$::jsonb,
  NULL,
  $t$Circuit: C1=2μF and C2=3μF in series, their combination in parallel with C3=4μF, across 10V battery.$t$,
  'D',
  ARRAY['capacitor-circuit','charge','parallel-combination'],
  'active',
  true,
  'correction-batch-2'
);

-- cuet-phy-pot-dielec-ls01  (logical-sequence, easy)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-electrostatics',
  'cuet-phy-es-dielectric',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'easy',
  'just-started',
  $t$Arrange the following materials in order of increasing dielectric constant:
(I) Vacuum
(II) Air
(III) Paper
(IV) Water$t$,
  $t$Dielectric constants: Vacuum = 1 (exact), Air ≈ 1.0006, Paper ≈ 3.7, Water ≈ 80. Order: I → II → III → IV.$t$,
  $json${"question_id": "cuet-phy-pot-dielec-ls01", "subtopic": "Dielectric constants of materials", "topic_name": "Combination of Capacitors and Dielectrics", "bloom_level": "remember", "options": [{"key": "A", "text": "I → II → III → IV", "is_correct": true}, {"key": "B", "text": "IV → III → II → I", "is_correct": false}, {"key": "C", "text": "I → II → IV → III", "is_correct": false}, {"key": "D", "text": "II → I → III → IV", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "This is the order of decreasing dielectric constant.", "misconception": "Reversing the order"}, {"option_key": "C", "hint": "Water has a very high dielectric constant (~80) — much higher than paper (~3.7).", "misconception": "Underestimating water's dielectric constant"}, {"option_key": "D", "hint": "Vacuum has the lowest possible dielectric constant (exactly 1), lower than air.", "misconception": "Thinking air has lower K than vacuum"}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['dielectric-constant','materials','permittivity'],
  'active',
  true,
  'correction-batch-2'
);

-- ── phy-pot-potential-copied.json (───────────────────────────────)

-- cuet-phy-pot-potential-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-electrostatics',
  'cuet-phy-es-potential',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The diagram shows equipotential surfaces around a positive point charge. The surfaces are concentric spheres at potentials 60V, 30V, and 20V. What is the ratio of radii r₁:r₂:r₃ of these surfaces?$t$,
  $t$For a point charge: V = kQ/r, so r = kQ/V. r₁ = kQ/60, r₂ = kQ/30, r₃ = kQ/20. Ratio r₁:r₂:r₃ = 1/60 : 1/30 : 1/20 = 1:2:3.$t$,
  $json${"question_id": "cuet-phy-pot-potential-d01", "subtopic": "Equipotential surfaces", "topic_name": "Electric Potential and Potential Energy", "bloom_level": "apply", "options": [{"key": "A", "text": "3 : 2 : 1", "is_correct": false}, {"key": "B", "text": "1 : 2 : 3", "is_correct": true}, {"key": "C", "text": "1 : 1 : 1", "is_correct": false}, {"key": "D", "text": "6 : 3 : 2", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "3:2:1 would mean higher potential at larger radius, but V decreases with r for a positive charge.", "misconception": "Thinking V ∝ r instead of V ∝ 1/r"}, {"option_key": "C", "hint": "Equal radii would mean equal potentials on all surfaces.", "misconception": null}, {"option_key": "D", "hint": "6:3:2 = V₁:V₂:V₃ ratio, but radius is inversely proportional to V.", "misconception": "Using V ratio instead of 1/V ratio"}], "image_uri": "diagrams/cuet-phy-pot-potential-d01.png", "image_alt": "Three concentric circles (equipotential surfaces) around a positive charge. Inner circle: 60V, middle: 30V, outer: 20V"}$json$::jsonb,
  NULL,
  $t$Three concentric circles (equipotential surfaces) around a positive charge. Inner circle: 60V, middle: 30V, outer: 20V$t$,
  'B',
  ARRAY['equipotential-surfaces','point-charge','electric-potential'],
  'active',
  true,
  'correction-batch-2'
);

-- cuet-phy-pot-potential-d02  (diagram-based, easy)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-electrostatics',
  'cuet-phy-es-potential',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'easy',
  'just-started',
  $t$The graph shows the variation of electric potential (V) along the x-axis due to two equal positive charges placed at x = −a and x = +a. What is the potential at the midpoint (x = 0)?$t$,
  $t$At midpoint x = 0, distance from each charge is a. V = kQ/a + kQ/a = 2kQ/a. The potential is maximum along the line if we only consider the midpoint between the charges — it's actually a saddle point (minimum along x but maximum in perpendicular directions). But V at x=0 is simply 2kQ/a, which is positive and non-zero.$t$,
  $json${"question_id": "cuet-phy-pot-potential-d02", "subtopic": "Potential due to charge system", "topic_name": "Electric Potential and Potential Energy", "bloom_level": "understand", "options": [{"key": "A", "text": "Zero", "is_correct": false}, {"key": "B", "text": "kQ/a", "is_correct": false}, {"key": "C", "text": "2kQ/a", "is_correct": true}, {"key": "D", "text": "kQ/2a", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "The electric FIELD is zero at the midpoint (by symmetry), but potential is a scalar and adds up, not cancels.", "misconception": "Confusing zero field with zero potential"}, {"option_key": "B", "hint": "kQ/a is the contribution from one charge only. Both charges contribute equally.", "misconception": "Counting only one charge"}, {"option_key": "D", "hint": "kQ/2a would mean the distance from each charge is 2a, but it's only a.", "misconception": "Using wrong distance"}], "image_uri": "diagrams/cuet-phy-pot-potential-d02.png", "image_alt": "V vs x graph showing two peaks at x=−a and x=+a (locations of charges), with a local minimum at x=0 that is still positive. Potential approaches zero far from charges."}$json$::jsonb,
  NULL,
  $t$V vs x graph showing two peaks at x=−a and x=+a (locations of charges), with a local minimum at x=0 that is still positive. Potential approaches zero far from charges.$t$,
  'C',
  ARRAY['superposition','electric-potential','two-charges'],
  'active',
  true,
  'correction-batch-2'
);

-- cuet-phy-pot-potential-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-electrostatics',
  'cuet-phy-es-potential',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following quantities in order of increasing value for a positive point charge Q at distances r, 2r, and 3r:
(I) Potential at 3r
(II) Potential at r
(III) Potential at 2r$t$,
  $t$V = kQ/r, so V(r) = kQ/r, V(2r) = kQ/2r, V(3r) = kQ/3r. Increasing order: V(3r) < V(2r) < V(r), i.e., I → III → II.$t$,
  $json${"question_id": "cuet-phy-pot-potential-ls01", "subtopic": "Potential variation with distance", "topic_name": "Electric Potential and Potential Energy", "bloom_level": "understand", "options": [{"key": "A", "text": "I → III → II", "is_correct": true}, {"key": "B", "text": "II → III → I", "is_correct": false}, {"key": "C", "text": "I → II → III", "is_correct": false}, {"key": "D", "text": "III → I → II", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "This is the order of decreasing potential.", "misconception": "Reversing the order"}, {"option_key": "C", "hint": "V at r is the highest (closest to charge), so II should be last.", "misconception": "Thinking closer means lower potential"}, {"option_key": "D", "hint": "V at 2r is between V at r and V at 3r.", "misconception": null}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['electric-potential','distance-dependence','point-charge'],
  'active',
  true,
  'correction-batch-2'
);

-- ── phy-ac-circuits-copied.json (─────────────────────────────────)

-- cuet-phy-ac-circuits-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-em-induction',
  'cuet-phy-em-ac-circuits',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The phasor diagram shows the voltage across resistor (VR), inductor (VL), and capacitor (VC) in a series LCR circuit. VL > VC. What is the phase relationship between the source voltage and current?$t$,
  $t$When VL > VC, the net reactive voltage (VL − VC) is positive (inductive). The resultant voltage V leads VR (which is in phase with current) by angle φ = tan⁻¹((VL−VC)/VR). So voltage leads current — the circuit is inductive.$t$,
  $json${"question_id": "cuet-phy-ac-circuits-d01", "subtopic": "Phasor diagram of LCR circuit", "topic_name": "AC Circuits (R, L, C, LCR Series)", "bloom_level": "analyze", "options": [{"key": "A", "text": "Voltage lags current", "is_correct": false}, {"key": "B", "text": "Voltage leads current", "is_correct": true}, {"key": "C", "text": "Voltage and current are in phase", "is_correct": false}, {"key": "D", "text": "Voltage and current are 90° out of phase", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Voltage lags current when VC > VL (capacitive circuit), but here VL > VC.", "misconception": "Confusing inductive and capacitive behavior"}, {"option_key": "C", "hint": "In-phase occurs only at resonance (VL = VC), but here VL ≠ VC.", "misconception": "Assuming resonance condition"}, {"option_key": "D", "hint": "90° phase occurs in purely inductive or capacitive circuits, not in LCR with resistance.", "misconception": null}], "image_uri": "diagrams/cuet-phy-ac-circuits-d01.png", "image_alt": "Phasor diagram: VR along x-axis (horizontal), VL pointing up, VC pointing down. VL > VC. Resultant voltage V at angle φ above VR."}$json$::jsonb,
  NULL,
  $t$Phasor diagram: VR along x-axis (horizontal), VL pointing up, VC pointing down. VL > VC. Resultant voltage V at angle φ above VR.$t$,
  'B',
  ARRAY['phasor-diagram','LCR-circuit','phase-angle'],
  'active',
  true,
  'correction-batch-2'
);

-- cuet-phy-ac-circuits-d02  (diagram-based, hard)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-em-induction',
  'cuet-phy-em-ac-circuits',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'hard',
  'just-started',
  $t$The graph shows the variation of impedance (Z) with frequency (f) for a series LCR circuit. At what frequency is the impedance minimum?$t$,
  $t$In a series LCR circuit, Z = √(R² + (XL−XC)²). Z is minimum when XL = XC (resonance), giving Z_min = R. This occurs at resonant frequency f₀ = 1/(2π√LC).$t$,
  $json${"question_id": "cuet-phy-ac-circuits-d02", "subtopic": "Impedance vs frequency", "topic_name": "AC Circuits (R, L, C, LCR Series)", "bloom_level": "understand", "options": [{"key": "A", "text": "At resonant frequency f₀ = 1/(2π√LC)", "is_correct": true}, {"key": "B", "text": "At f = 0 (DC)", "is_correct": false}, {"key": "C", "text": "At very high frequency", "is_correct": false}, {"key": "D", "text": "At f = R/(2πL)", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "At f = 0, XC = 1/(2πfC) → ∞, so Z → ∞. This is maximum, not minimum.", "misconception": "Thinking DC gives minimum impedance"}, {"option_key": "C", "hint": "At high f, XL = 2πfL → ∞, so Z → ∞ again.", "misconception": null}, {"option_key": "D", "hint": "R/(2πL) is related to the time constant of RL circuit, not resonance of LCR.", "misconception": "Confusing RL time constant with LCR resonance"}], "image_uri": "diagrams/cuet-phy-ac-circuits-d02.png", "image_alt": "Z vs f graph showing a V-shaped curve with minimum at resonant frequency f₀. Z decreases before f₀ and increases after f₀. Minimum Z = R."}$json$::jsonb,
  NULL,
  $t$Z vs f graph showing a V-shaped curve with minimum at resonant frequency f₀. Z decreases before f₀ and increases after f₀. Minimum Z = R.$t$,
  'A',
  ARRAY['impedance','resonance','resonant-frequency'],
  'active',
  true,
  'correction-batch-2'
);

-- cuet-phy-ac-circuits-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-em-induction',
  'cuet-phy-em-ac-circuits',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following AC circuit elements in order of increasing phase difference between voltage across the element and current through it:
(I) Pure resistor
(II) Pure inductor
(III) Pure capacitor
(IV) Series LCR at resonance$t$,
  $t$Pure resistor: φ = 0°. LCR at resonance: φ = 0° (XL = XC cancel). Pure capacitor: φ = 90° (V lags I). Pure inductor: φ = 90° (V leads I). Taking magnitude: 0° = 0° < 90° = 90°. So (I,IV) < (II,III). All with 0° first, then 90°.$t$,
  $json${"question_id": "cuet-phy-ac-circuits-ls01", "subtopic": "Phase relationships in AC circuits", "topic_name": "AC Circuits (R, L, C, LCR Series)", "bloom_level": "understand", "options": [{"key": "A", "text": "III → I → IV → II", "is_correct": false}, {"key": "B", "text": "II → III → I → IV", "is_correct": false}, {"key": "C", "text": "I = IV → II = III (0°, 0°, 90°, 90°)", "is_correct": true}, {"key": "D", "text": "I → IV → III → II", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Capacitor and inductor both have 90° phase difference, same magnitude.", "misconception": null}, {"option_key": "B", "hint": "Resistor and LCR at resonance both have 0° phase difference.", "misconception": "Thinking resonance has non-zero phase"}, {"option_key": "D", "hint": "LCR at resonance behaves like a pure resistor (φ = 0°), same as I.", "misconception": null}]}$json$::jsonb,
  NULL,
  NULL,
  'C',
  ARRAY['phase-difference','AC-elements','resonance'],
  'active',
  true,
  'correction-batch-2'
);

-- ── phy-ac-transformer-copied.json (──────────────────────────────)

-- cuet-phy-ac-transform-d01  (diagram-based, easy)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-em-induction',
  'cuet-phy-em-transformer',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'easy',
  'just-started',
  $t$The diagram shows a step-up transformer with primary coil having 100 turns and secondary coil having 500 turns. If the input voltage is 220 V, what is the output voltage?$t$,
  $t$For an ideal transformer: Vs/Vp = Ns/Np. So Vs = Vp × Ns/Np = 220 × 500/100 = 220 × 5 = 1100 V.$t$,
  $json${"question_id": "cuet-phy-ac-transform-d01", "subtopic": "Transformer turns ratio", "topic_name": "Resonance, Power Factor, and Transformers", "bloom_level": "apply", "options": [{"key": "A", "text": "44 V", "is_correct": false}, {"key": "B", "text": "220 V", "is_correct": false}, {"key": "C", "text": "550 V", "is_correct": false}, {"key": "D", "text": "1100 V", "is_correct": true}], "elimination_hints": [{"option_key": "A", "hint": "44 V = 220/5 — you divided instead of multiplied. This would be the step-down result.", "misconception": "Inverting the turns ratio"}, {"option_key": "B", "hint": "220 V would mean no transformation — the turns ratio is 5:1, not 1:1.", "misconception": null}, {"option_key": "C", "hint": "550 V = 220 × 500/200 — check the denominator, it's 100, not 200.", "misconception": "Arithmetic error in turns ratio"}], "image_uri": "diagrams/cuet-phy-ac-transform-d01.png", "image_alt": "Transformer with iron core, primary coil (Np=100 turns, 220V input) on left, secondary coil (Ns=500 turns, V=?) on right"}$json$::jsonb,
  NULL,
  $t$Transformer with iron core, primary coil (Np=100 turns, 220V input) on left, secondary coil (Ns=500 turns, V=?) on right$t$,
  'D',
  ARRAY['transformer','turns-ratio','step-up'],
  'active',
  true,
  'correction-batch-2'
);

-- cuet-phy-ac-transform-d02  (diagram-based, hard)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-em-induction',
  'cuet-phy-em-transformer',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'hard',
  'just-started',
  $t$The graph shows the variation of current (I) with frequency (f) in a series LCR circuit near resonance. The resonant frequency is f₀ = 500 Hz and the half-power frequencies are f₁ = 490 Hz and f₂ = 510 Hz. What is the quality factor Q of the circuit?$t$,
  $t$Quality factor Q = f₀/Δf = f₀/(f₂ − f₁) = 500/(510 − 490) = 500/20 = 25. Higher Q means sharper resonance peak.$t$,
  $json${"question_id": "cuet-phy-ac-transform-d02", "subtopic": "Quality factor of LCR circuit", "topic_name": "Resonance, Power Factor, and Transformers", "bloom_level": "apply", "options": [{"key": "A", "text": "10", "is_correct": false}, {"key": "B", "text": "50", "is_correct": false}, {"key": "C", "text": "25", "is_correct": true}, {"key": "D", "text": "500", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Q = 10 would mean bandwidth = 50 Hz, but here it's only 20 Hz.", "misconception": null}, {"option_key": "B", "hint": "Q = 50 would mean bandwidth = 10 Hz. The bandwidth is f₂ − f₁ = 20 Hz.", "misconception": "Using wrong bandwidth calculation"}, {"option_key": "D", "hint": "500 is the resonant frequency itself, not the quality factor.", "misconception": "Confusing f₀ with Q"}], "image_uri": "diagrams/cuet-phy-ac-transform-d02.png", "image_alt": "I vs f resonance curve: sharp peak at f₀=500Hz. Half-power points at f₁=490Hz and f₂=510Hz where I = Imax/√2. Bandwidth Δf = 20Hz."}$json$::jsonb,
  NULL,
  $t$I vs f resonance curve: sharp peak at f₀=500Hz. Half-power points at f₁=490Hz and f₂=510Hz where I = Imax/√2. Bandwidth Δf = 20Hz.$t$,
  'C',
  ARRAY['quality-factor','resonance','bandwidth'],
  'active',
  true,
  'correction-batch-2'
);

-- cuet-phy-ac-transform-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-em-induction',
  'cuet-phy-em-transformer',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following steps in long-distance power transmission in the correct order:
(I) Step-down transformer at city substation
(II) Power generation at power plant
(III) Step-up transformer at power plant
(IV) High-voltage transmission through power lines$t$,
  $t$Power is generated (II), stepped up to high voltage for efficient transmission (III), sent through power lines (IV), then stepped down for consumer use (I).$t$,
  $json${"question_id": "cuet-phy-ac-transform-ls01", "subtopic": "Power transmission system", "topic_name": "Resonance, Power Factor, and Transformers", "bloom_level": "remember", "options": [{"key": "A", "text": "II → IV → III → I", "is_correct": false}, {"key": "B", "text": "II → III → IV → I", "is_correct": true}, {"key": "C", "text": "III → II → IV → I", "is_correct": false}, {"key": "D", "text": "II → III → I → IV", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "You must step-up before transmitting — sending low voltage over long lines wastes energy as heat (I²R losses).", "misconception": "Skipping the step-up transformer"}, {"option_key": "C", "hint": "Power must be generated before it can be transformed.", "misconception": null}, {"option_key": "D", "hint": "Step-down happens at the receiving end, not before transmission.", "misconception": "Reversing step-down and transmission order"}]}$json$::jsonb,
  NULL,
  NULL,
  'B',
  ARRAY['power-transmission','transformer','efficiency'],
  'active',
  true,
  'correction-batch-2'
);

-- Total: 30 questions inserted
COMMIT;

