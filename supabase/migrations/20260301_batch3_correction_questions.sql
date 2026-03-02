-- ==========================================================================
-- BATCH 3: Correction questions for CUET Physics (final batch)
-- 42 questions: 28 diagram-based + 14 logical-sequence
-- Chapters: EM Induction (6), EM Waves (3),
--           Magnetic Effects (15), Optics (18)
-- ==========================================================================

BEGIN;

-- ==========================================================================
-- STEP 1: Create missing CUET topics in med_topics
-- ==========================================================================

INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important) VALUES
('cuet-phy-emi-faraday',    'cuet-phy-em-induction', 'Faraday''s Law and Lenz''s Law',   3, true),
('cuet-phy-emi-inductance', 'cuet-phy-em-induction', 'Self and Mutual Inductance',        4, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important) VALUES
('cuet-phy-emwave-spectrum', 'cuet-phy-em-waves', 'Electromagnetic Spectrum and Wave Properties', 1, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important) VALUES
('cuet-phy-mag-biot-savart',   'cuet-phy-magnetic-effects', 'Biot-Savart Law and Ampere''s Law',           1, true),
('cuet-phy-mag-lorentz-force', 'cuet-phy-magnetic-effects', 'Lorentz Force and Motion in Magnetic Field',  2, true),
('cuet-phy-mag-devices',       'cuet-phy-magnetic-effects', 'Galvanometer, Ammeter, Voltmeter, Cyclotron', 3, true),
('cuet-phy-mag-dipole',        'cuet-phy-magnetic-effects', 'Magnetic Dipole and Torque',                  4, true),
('cuet-phy-mag-materials',     'cuet-phy-magnetic-effects', 'Dia-, Para-, and Ferromagnetic Materials',    5, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important) VALUES
('cuet-phy-opt-reflection',   'cuet-phy-optics', 'Reflection at Curved Surfaces and Mirror Formula', 1, true),
('cuet-phy-opt-prism',        'cuet-phy-optics', 'Refraction through Prism and Dispersion',          2, true),
('cuet-phy-opt-instruments',  'cuet-phy-optics', 'Optical Instruments (Microscope and Telescope)',    3, true),
('cuet-phy-opt-interference', 'cuet-phy-optics', 'Interference and Young''s Double Slit',             4, true),
('cuet-phy-opt-diffraction',  'cuet-phy-optics', 'Diffraction and Single Slit',                       5, true),
('cuet-phy-opt-polarisation', 'cuet-phy-optics', 'Polarisation and Brewster''s Law',                  6, true)
ON CONFLICT (id) DO NOTHING;

-- ==========================================================================
-- STEP 2: Insert correction questions
-- ==========================================================================

-- ── phy-emi-faraday-copied.json (─────────────────────────────────)

-- cuet-phy-emi-faraday-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-em-induction',
  'cuet-phy-emi-faraday',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The graph shows the variation of induced EMF with time when a bar magnet is dropped through a coil. Two peaks are observed — one positive and one negative. What does the second (negative) peak indicate?$t$,
  $t$As the magnet enters the coil, the increasing flux induces a positive EMF. As it exits, the flux decreases in the opposite sense, inducing a negative EMF. The second peak is larger because the magnet accelerates under gravity.$t$,
  $json${"question_id": "cuet-phy-emi-faraday-d01", "subtopic": "EMF due to changing flux", "topic_name": "Faraday's Law and Lenz's Law", "bloom_level": "understand", "options": [{"key": "A", "text": "The magnet has stopped inside the coil", "is_correct": false}, {"key": "B", "text": "The magnet is exiting the coil, reversing the flux change direction", "is_correct": true}, {"key": "C", "text": "The coil resistance has changed", "is_correct": false}, {"key": "D", "text": "The magnet has reversed its polarity", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "If the magnet stopped, the flux would be constant and EMF would be zero, not negative.", "misconception": "Thinking stationary magnet produces EMF"}, {"option_key": "C", "hint": "Coil resistance doesn't change during the experiment and doesn't cause polarity reversal.", "misconception": null}, {"option_key": "D", "hint": "A permanent magnet cannot reverse its polarity spontaneously.", "misconception": null}], "image_uri": "diagrams/cuet-phy-emi-faraday-d01.png", "image_alt": "EMF vs time graph showing positive peak as magnet enters coil, zero briefly, then negative peak as magnet exits"}$json$::jsonb,
  NULL,
  $t$EMF vs time graph showing positive peak as magnet enters coil, zero briefly, then negative peak as magnet exits$t$,
  'B',
  ARRAY['faraday-law','lenz-law','induced-emf'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-emi-faraday-d02  (diagram-based, hard)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-em-induction',
  'cuet-phy-emi-faraday',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'hard',
  'just-started',
  $t$The diagram shows a rectangular loop of width l moving with velocity v into a region of uniform magnetic field B (perpendicular, into the page). What is the induced EMF when the loop is partially inside the field region?$t$,
  $t$When the loop is partially inside, only the leading edge (length l) cuts field lines. The motional EMF = Blv. The trailing edge is still outside the field, so it contributes nothing.$t$,
  $json${"question_id": "cuet-phy-emi-faraday-d02", "subtopic": "Motional EMF in changing flux region", "topic_name": "Faraday's Law and Lenz's Law", "bloom_level": "apply", "options": [{"key": "A", "text": "Zero", "is_correct": false}, {"key": "B", "text": "2Blv", "is_correct": false}, {"key": "C", "text": "Blv", "is_correct": true}, {"key": "D", "text": "Blv/2", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "EMF is zero only when the entire loop is inside the field (flux not changing).", "misconception": "Thinking EMF is zero when partially inside"}, {"option_key": "B", "hint": "2Blv would occur if both edges were crossing field boundaries, but only one edge is.", "misconception": "Counting both edges"}, {"option_key": "D", "hint": "There is no factor of 1/2 in motional EMF = Blv.", "misconception": null}], "image_uri": "diagrams/cuet-phy-emi-faraday-d02.png", "image_alt": "Rectangular loop of width l moving with velocity v entering a region of uniform B field (into page). Only right side crosses boundary."}$json$::jsonb,
  NULL,
  $t$Rectangular loop of width l moving with velocity v entering a region of uniform B field (into page). Only right side crosses boundary.$t$,
  'C',
  ARRAY['motional-emf','flux-change','rectangular-loop'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-emi-faraday-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-em-induction',
  'cuet-phy-emi-faraday',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following steps in electromagnetic induction in the correct chronological order:
(I) Change in magnetic flux through the coil
(II) Relative motion between magnet and coil
(III) Induced EMF appears across the coil
(IV) Induced current flows in the closed circuit$t$,
  $t$First there must be relative motion (II), which causes a change in flux (I), which by Faraday's law produces an induced EMF (III), and if the circuit is closed, current flows (IV).$t$,
  $json${"question_id": "cuet-phy-emi-faraday-ls01", "subtopic": "Steps in electromagnetic induction", "topic_name": "Faraday's Law and Lenz's Law", "bloom_level": "understand", "options": [{"key": "A", "text": "II → I → III → IV", "is_correct": true}, {"key": "B", "text": "I → II → III → IV", "is_correct": false}, {"key": "C", "text": "III → I → II → IV", "is_correct": false}, {"key": "D", "text": "II → III → I → IV", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "Flux change doesn't happen on its own — relative motion must cause it first.", "misconception": "Thinking flux changes spontaneously"}, {"option_key": "C", "hint": "EMF is the result of flux change, not the cause.", "misconception": "Reversing cause and effect"}, {"option_key": "D", "hint": "EMF appears because of flux change, not before it.", "misconception": "EMF before flux change"}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['electromagnetic-induction','faraday-law','induced-current'],
  'active',
  true,
  'correction-batch-3'
);

-- ── phy-emi-inductance-copied.json (──────────────────────────────)

-- cuet-phy-emi-induct-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-em-induction',
  'cuet-phy-emi-inductance',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The graph shows the current growth in an LR circuit: I(t) = I₀(1 − e^(−t/τ)) where τ = L/R. At time t = L/R (one time constant), what fraction of the maximum current is reached?$t$,
  $t$At t = τ = L/R: I = I₀(1 − e⁻¹) = I₀(1 − 0.368) = 0.632 I₀ = 63.2% of maximum current.$t$,
  $json${"question_id": "cuet-phy-emi-induct-d01", "subtopic": "LR circuit transient response", "topic_name": "Self and Mutual Inductance", "bloom_level": "apply", "options": [{"key": "A", "text": "50%", "is_correct": false}, {"key": "B", "text": "63.2%", "is_correct": true}, {"key": "C", "text": "37%", "is_correct": false}, {"key": "D", "text": "100%", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "50% is reached at t = 0.693τ (= τ × ln2), not at t = τ.", "misconception": "Confusing half-life with time constant"}, {"option_key": "C", "hint": "37% = e⁻¹ is the fraction remaining to reach, not the fraction already reached.", "misconception": "Using e⁻¹ instead of (1−e⁻¹)"}, {"option_key": "D", "hint": "100% is only reached at t → ∞.", "misconception": null}], "image_uri": "diagrams/cuet-phy-emi-induct-d01.png", "image_alt": "I vs t curve for LR circuit, current rises exponentially toward I₀, time constant τ=L/R marked"}$json$::jsonb,
  NULL,
  $t$I vs t curve for LR circuit, current rises exponentially toward I₀, time constant τ=L/R marked$t$,
  'B',
  ARRAY['LR-circuit','time-constant','current-growth'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-emi-induct-d02  (diagram-based, easy)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-em-induction',
  'cuet-phy-emi-inductance',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'easy',
  'just-started',
  $t$The diagram shows two coils placed close together. The primary coil is connected to an AC source. If the mutual inductance between the coils is M and the current in the primary changes at rate dI/dt, what is the induced EMF in the secondary?$t$,
  $t$By the definition of mutual inductance: EMF₂ = M × dI₁/dt. The mutual inductance M quantifies the flux linkage between the two coils.$t$,
  $json${"question_id": "cuet-phy-emi-induct-d02", "subtopic": "Mutual inductance between coils", "topic_name": "Self and Mutual Inductance", "bloom_level": "remember", "options": [{"key": "A", "text": "M × dI/dt", "is_correct": true}, {"key": "B", "text": "L × dI/dt", "is_correct": false}, {"key": "C", "text": "M × I", "is_correct": false}, {"key": "D", "text": "M / (dI/dt)", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "L × dI/dt gives self-induced EMF in the same coil, not the mutual EMF in the other coil.", "misconception": "Confusing self and mutual inductance"}, {"option_key": "C", "hint": "EMF depends on rate of change of current, not the current itself.", "misconception": "Using I instead of dI/dt"}, {"option_key": "D", "hint": "EMF is proportional to dI/dt, not inversely proportional.", "misconception": "Inverting the relationship"}], "image_uri": "diagrams/cuet-phy-emi-induct-d02.png", "image_alt": "Two coils: primary coil connected to AC source, secondary coil with galvanometer. Magnetic flux lines linking both coils."}$json$::jsonb,
  NULL,
  $t$Two coils: primary coil connected to AC source, secondary coil with galvanometer. Magnetic flux lines linking both coils.$t$,
  'A',
  ARRAY['mutual-inductance','induced-emf','coupled-coils'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-emi-induct-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-em-induction',
  'cuet-phy-emi-inductance',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following inductors in order of increasing energy stored when carrying the same current I:
(I) Inductor with inductance L
(II) Inductor with inductance 2L
(III) Inductor with inductance L/2$t$,
  $t$Energy stored U = ½LI². For same I: U ∝ L. So L/2 < L < 2L, giving order III → I → II.$t$,
  $json${"question_id": "cuet-phy-emi-induct-ls01", "subtopic": "Energy in an inductor", "topic_name": "Self and Mutual Inductance", "bloom_level": "apply", "options": [{"key": "A", "text": "III → I → II", "is_correct": true}, {"key": "B", "text": "II → I → III", "is_correct": false}, {"key": "C", "text": "I → II → III", "is_correct": false}, {"key": "D", "text": "III → II → I", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "This is the order of decreasing energy.", "misconception": "Reversing the order"}, {"option_key": "C", "hint": "L/2 stores less energy than L at same current.", "misconception": null}, {"option_key": "D", "hint": "2L stores more energy than L, so II should come after I.", "misconception": null}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['inductance','energy-stored','inductor'],
  'active',
  true,
  'correction-batch-3'
);

-- ── phy-emwave-copied.json (──────────────────────────────────────)

-- cuet-phy-emwave-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-em-waves',
  'cuet-phy-emwave-spectrum',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The diagram shows the electromagnetic spectrum with wavelength ranges. Which type of radiation has wavelength between 1 nm and 400 nm?$t$,
  $t$Ultraviolet radiation has wavelengths from about 1 nm to 400 nm (between X-rays and visible light). Visible light spans 400-700 nm, X-rays are below 1 nm.$t$,
  $json${"question_id": "cuet-phy-emwave-d01", "subtopic": "EM spectrum wavelength ranges", "topic_name": "Electromagnetic Spectrum and Wave Properties", "bloom_level": "remember", "options": [{"key": "A", "text": "Infrared", "is_correct": false}, {"key": "B", "text": "X-rays", "is_correct": false}, {"key": "C", "text": "Ultraviolet", "is_correct": true}, {"key": "D", "text": "Microwaves", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Infrared has wavelength 700 nm to 1 mm — much longer than 1-400 nm.", "misconception": "Confusing IR and UV ranges"}, {"option_key": "B", "hint": "X-rays have wavelength 0.01-10 nm, mostly below 1 nm.", "misconception": null}, {"option_key": "D", "hint": "Microwaves have wavelength 1 mm to 1 m — vastly longer.", "misconception": null}], "image_uri": "diagrams/cuet-phy-emwave-d01.png", "image_alt": "Electromagnetic spectrum from radio waves to gamma rays with wavelength ranges marked"}$json$::jsonb,
  NULL,
  $t$Electromagnetic spectrum from radio waves to gamma rays with wavelength ranges marked$t$,
  'C',
  ARRAY['em-spectrum','wavelength-ranges','ultraviolet'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-emwave-d02  (diagram-based, easy)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-em-waves',
  'cuet-phy-emwave-spectrum',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'easy',
  'just-started',
  $t$The diagram shows an electromagnetic wave with the electric field E oscillating along the y-axis and the magnetic field B oscillating along the z-axis. What is the direction of wave propagation?$t$,
  $t$In an EM wave, E, B, and the direction of propagation are mutually perpendicular (right-hand rule). E × B gives the direction of propagation. If E is along y and B is along z, then E × B = y × z = x. The wave propagates along the x-axis.$t$,
  $json${"question_id": "cuet-phy-emwave-d02", "subtopic": "EM wave propagation", "topic_name": "Electromagnetic Spectrum and Wave Properties", "bloom_level": "understand", "options": [{"key": "A", "text": "Along x-axis (E × B direction)", "is_correct": true}, {"key": "B", "text": "Along y-axis", "is_correct": false}, {"key": "C", "text": "Along z-axis", "is_correct": false}, {"key": "D", "text": "Along negative x-axis", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "The y-axis is the direction of E oscillation, not propagation.", "misconception": "Confusing E direction with propagation"}, {"option_key": "C", "hint": "The z-axis is the direction of B oscillation, not propagation.", "misconception": "Confusing B direction with propagation"}, {"option_key": "D", "hint": "Using right-hand rule: y × z = +x, not −x.", "misconception": "Error in cross product direction"}], "image_uri": "diagrams/cuet-phy-emwave-d02.png", "image_alt": "EM wave with E field oscillating along y-axis, B field along z-axis, wave propagating along x-axis"}$json$::jsonb,
  NULL,
  $t$EM wave with E field oscillating along y-axis, B field along z-axis, wave propagating along x-axis$t$,
  'A',
  ARRAY['em-wave','polarization','propagation-direction'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-emwave-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-em-waves',
  'cuet-phy-emwave-spectrum',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following electromagnetic waves in order of increasing frequency:
(I) Microwaves
(II) X-rays
(III) Visible light
(IV) Infrared$t$,
  $t$Frequency order: Microwaves (~10⁹-10¹² Hz) < Infrared (~10¹²-4×10¹⁴ Hz) < Visible (~4×10¹⁴-7.5×10¹⁴ Hz) < X-rays (~10¹⁶-10¹⁹ Hz). So I → IV → III → II.$t$,
  $json${"question_id": "cuet-phy-emwave-ls01", "subtopic": "EM wave frequency ordering", "topic_name": "Electromagnetic Spectrum and Wave Properties", "bloom_level": "remember", "options": [{"key": "A", "text": "I → IV → III → II", "is_correct": true}, {"key": "B", "text": "II → III → IV → I", "is_correct": false}, {"key": "C", "text": "I → III → IV → II", "is_correct": false}, {"key": "D", "text": "IV → I → III → II", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "This is the order of decreasing frequency.", "misconception": "Reversing the order"}, {"option_key": "C", "hint": "Infrared has lower frequency than visible light — IV comes before III.", "misconception": "Placing visible before infrared"}, {"option_key": "D", "hint": "Microwaves have lower frequency than infrared.", "misconception": null}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['em-spectrum','frequency-order','wave-classification'],
  'active',
  true,
  'correction-batch-3'
);

-- ── phy-magmov-biot-copied.json (─────────────────────────────────)

-- cuet-phy-mag-biot-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-magnetic-effects',
  'cuet-phy-mag-biot-savart',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The diagram shows a circular loop bent into two semicircles of the same radius R, carrying current such that the currents in the two halves flow in opposite directions. What is the net magnetic field at the centre?$t$,
  $t$Each semicircle produces B = μ₀I/(4R) at the centre, but in opposite directions (one into page, one out). They cancel: B_net = 0.$t$,
  $json${"question_id": "cuet-phy-mag-biot-d01", "subtopic": "Magnetic field of semicircular loops", "topic_name": "Biot-Savart Law and Ampere's Law", "bloom_level": "apply", "options": [{"key": "A", "text": "μ₀I/(2R)", "is_correct": false}, {"key": "B", "text": "Zero", "is_correct": true}, {"key": "C", "text": "μ₀I/(4R)", "is_correct": false}, {"key": "D", "text": "2μ₀I/(4R)", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "μ₀I/(2R) is the field of a full circular loop. Here the two halves oppose each other.", "misconception": "Treating as a complete loop"}, {"option_key": "C", "hint": "μ₀I/(4R) is from one semicircle only. The other cancels it.", "misconception": "Counting only one semicircle"}, {"option_key": "D", "hint": "The fields add only if currents flow in the same direction, not opposite.", "misconception": "Adding instead of subtracting"}], "image_uri": "diagrams/cuet-phy-mag-biot-d01.png", "image_alt": "Two semicircular loops of same radius connected, carrying current in opposite sense, B vectors at center pointing in opposite directions cancel"}$json$::jsonb,
  NULL,
  $t$Two semicircular loops of same radius connected, carrying current in opposite sense, B vectors at center pointing in opposite directions cancel$t$,
  'B',
  ARRAY['biot-savart','semicircular-loop','superposition'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-mag-biot-d02  (diagram-based, hard)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-magnetic-effects',
  'cuet-phy-mag-biot-savart',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'hard',
  'just-started',
  $t$The graph shows B vs r for a long straight wire carrying current I = 10 A. Using B = μ₀I/(2πr), what is the magnetic field at a distance of 2 cm from the wire?$t$,
  $t$B = μ₀I/(2πr) = (4π×10⁻⁷ × 10)/(2π × 0.02) = (4π×10⁻⁶)/(0.04π) = 10⁻⁴ T = 1×10⁻⁴ T.$t$,
  $json${"question_id": "cuet-phy-mag-biot-d02", "subtopic": "B field of a long straight wire", "topic_name": "Biot-Savart Law and Ampere's Law", "bloom_level": "apply", "options": [{"key": "A", "text": "2×10⁻⁵ T", "is_correct": false}, {"key": "B", "text": "5×10⁻⁵ T", "is_correct": false}, {"key": "C", "text": "1×10⁻⁴ T", "is_correct": true}, {"key": "D", "text": "2×10⁻⁴ T", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "2×10⁻⁵ T would be the field at r = 10 cm, not 2 cm.", "misconception": "Using wrong distance"}, {"option_key": "B", "hint": "5×10⁻⁵ T = field at r = 4 cm. Check your distance value.", "misconception": null}, {"option_key": "D", "hint": "2×10⁻⁴ T would be the field at r = 1 cm.", "misconception": "Using r = 1 cm instead of 2 cm"}], "image_uri": "diagrams/cuet-phy-mag-biot-d02.png", "image_alt": "B vs r graph: hyperbolic curve showing B = μ₀I/(2πr). Wire at r=0, B decreasing with distance"}$json$::jsonb,
  NULL,
  $t$B vs r graph: hyperbolic curve showing B = μ₀I/(2πr). Wire at r=0, B decreasing with distance$t$,
  'C',
  ARRAY['biot-savart','straight-wire','magnetic-field-calculation'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-mag-biot-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-magnetic-effects',
  'cuet-phy-mag-biot-savart',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following circular loops in order of increasing magnetic field at the centre, all carrying the same current I:
(I) Loop of radius R
(II) Loop of radius 2R
(III) Loop of radius R/2$t$,
  $t$B at centre = μ₀I/(2r). So B ∝ 1/r. Larger radius → smaller B. Order: 2R(smallest B) < R < R/2(largest B). So II → I → III.$t$,
  $json${"question_id": "cuet-phy-mag-biot-ls01", "subtopic": "B field at centre of circular loop", "topic_name": "Biot-Savart Law and Ampere's Law", "bloom_level": "apply", "options": [{"key": "A", "text": "II → I → III", "is_correct": true}, {"key": "B", "text": "III → I → II", "is_correct": false}, {"key": "C", "text": "I → II → III", "is_correct": false}, {"key": "D", "text": "II → III → I", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "This is the order of decreasing B.", "misconception": "Reversing the order"}, {"option_key": "C", "hint": "Loop of radius 2R has weaker B than radius R (B ∝ 1/r).", "misconception": null}, {"option_key": "D", "hint": "R/2 gives the strongest B, so III should be last.", "misconception": null}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['circular-loop','magnetic-field','radius-dependence'],
  'active',
  true,
  'correction-batch-3'
);

-- ── phy-magmov-force-copied.json (────────────────────────────────)

-- cuet-phy-mag-force-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-magnetic-effects',
  'cuet-phy-mag-lorentz-force',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The diagram shows a proton entering a uniform magnetic field B (perpendicular to its velocity, into the page). It follows a circular path of radius r. If the speed of the proton is doubled, what is the new radius?$t$,
  $t$For circular motion in B field: r = mv/(qB). If v → 2v, then r → 2mv/(qB) = 2r. The radius doubles.$t$,
  $json${"question_id": "cuet-phy-mag-force-d01", "subtopic": "Circular motion of charged particle in B field", "topic_name": "Lorentz Force and Motion in Magnetic Field", "bloom_level": "apply", "options": [{"key": "A", "text": "r/2", "is_correct": false}, {"key": "B", "text": "r", "is_correct": false}, {"key": "C", "text": "4r", "is_correct": false}, {"key": "D", "text": "2r", "is_correct": true}], "elimination_hints": [{"option_key": "A", "hint": "r/2 would mean radius halved. Since r ∝ v, doubling v doubles r.", "misconception": "Thinking r ∝ 1/v"}, {"option_key": "B", "hint": "Radius r depends on velocity. If v changes, r must change too.", "misconception": "Thinking radius is independent of speed"}, {"option_key": "C", "hint": "4r would mean r ∝ v². But r = mv/(qB), so r ∝ v (linear).", "misconception": "Using v² instead of v"}], "image_uri": "diagrams/cuet-phy-mag-force-d01.png", "image_alt": "Proton entering uniform B field (into page) perpendicular to velocity, following circular path of radius r"}$json$::jsonb,
  NULL,
  $t$Proton entering uniform B field (into page) perpendicular to velocity, following circular path of radius r$t$,
  'D',
  ARRAY['lorentz-force','circular-motion','radius'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-mag-force-d02  (diagram-based, easy)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-magnetic-effects',
  'cuet-phy-mag-lorentz-force',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'easy',
  'just-started',
  $t$The diagram shows two long parallel wires carrying currents I₁ and I₂ in the same direction. What is the nature of the force between them?$t$,
  $t$Two parallel wires carrying currents in the same direction attract each other. The magnetic field of one wire exerts a force on the current in the other, directed toward the first wire.$t$,
  $json${"question_id": "cuet-phy-mag-force-d02", "subtopic": "Force between parallel current-carrying wires", "topic_name": "Lorentz Force and Motion in Magnetic Field", "bloom_level": "remember", "options": [{"key": "A", "text": "Attractive", "is_correct": true}, {"key": "B", "text": "Repulsive", "is_correct": false}, {"key": "C", "text": "Zero", "is_correct": false}, {"key": "D", "text": "Depends on the magnitude of currents", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "Repulsive force occurs when currents are in opposite directions.", "misconception": "Confusing same and opposite direction cases"}, {"option_key": "C", "hint": "Two current-carrying wires always exert force on each other.", "misconception": null}, {"option_key": "D", "hint": "The nature (attractive/repulsive) depends on direction, not magnitude.", "misconception": null}], "image_uri": "diagrams/cuet-phy-mag-force-d02.png", "image_alt": "Two parallel wires with currents I₁ and I₂ in same direction (upward), force arrows pointing toward each other"}$json$::jsonb,
  NULL,
  $t$Two parallel wires with currents I₁ and I₂ in same direction (upward), force arrows pointing toward each other$t$,
  'A',
  ARRAY['parallel-wires','force','same-direction'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-mag-force-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-magnetic-effects',
  'cuet-phy-mag-lorentz-force',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following in order of increasing force on a 1 m conductor carrying 5 A in a uniform field B = 0.2 T at different angles θ to the field:
(I) θ = 0°
(II) θ = 30°
(III) θ = 60°
(IV) θ = 90°$t$,
  $t$F = BIl sinθ. F(0°) = 0, F(30°) = 0.5 N, F(60°) = 0.866 N, F(90°) = 1.0 N. Order: I → II → III → IV.$t$,
  $json${"question_id": "cuet-phy-mag-force-ls01", "subtopic": "Force on current-carrying conductor", "topic_name": "Lorentz Force and Motion in Magnetic Field", "bloom_level": "apply", "options": [{"key": "A", "text": "I → II → III → IV", "is_correct": true}, {"key": "B", "text": "IV → III → II → I", "is_correct": false}, {"key": "C", "text": "I → III → II → IV", "is_correct": false}, {"key": "D", "text": "II → I → III → IV", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "This is the order of decreasing force.", "misconception": "Reversing the order"}, {"option_key": "C", "hint": "sin 30° = 0.5 < sin 60° = 0.866, so II comes before III.", "misconception": "Wrong sine values"}, {"option_key": "D", "hint": "At θ = 0°, F = 0 (minimum). I should come first.", "misconception": "Thinking force is non-zero at 0°"}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['force-on-conductor','angle-dependence','magnetic-force'],
  'active',
  true,
  'correction-batch-3'
);

-- ── phy-magmov-devices-copied.json (──────────────────────────────)

-- cuet-phy-mag-device-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-magnetic-effects',
  'cuet-phy-mag-devices',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The diagram shows a moving coil galvanometer with N turns, area A, magnetic field B, and spring constant k. What is the current sensitivity (deflection per unit current)?$t$,
  $t$At equilibrium: torque = restoring force, NIAB = kθ. Current sensitivity = θ/I = NAB/k.$t$,
  $json${"question_id": "cuet-phy-mag-device-d01", "subtopic": "Moving coil galvanometer sensitivity", "topic_name": "Galvanometer, Ammeter, Voltmeter, Cyclotron", "bloom_level": "apply", "options": [{"key": "A", "text": "NAB", "is_correct": false}, {"key": "B", "text": "NAB/k", "is_correct": true}, {"key": "C", "text": "k/(NAB)", "is_correct": false}, {"key": "D", "text": "NB/(Ak)", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "NAB gives the torque per unit current, not the deflection per unit current (need to divide by k).", "misconception": "Forgetting the spring constant"}, {"option_key": "C", "hint": "k/(NAB) is the reciprocal — higher k means less sensitivity, not more.", "misconception": "Inverting the formula"}, {"option_key": "D", "hint": "A should be in the numerator (larger area = more torque = more sensitivity).", "misconception": null}], "image_uri": "diagrams/cuet-phy-mag-device-d01.png", "image_alt": "Moving coil galvanometer: rectangular coil between magnet poles, spring providing restoring torque, scale with pointer"}$json$::jsonb,
  NULL,
  $t$Moving coil galvanometer: rectangular coil between magnet poles, spring providing restoring torque, scale with pointer$t$,
  'B',
  ARRAY['galvanometer','current-sensitivity','torque-balance'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-mag-device-d02  (diagram-based, easy)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-magnetic-effects',
  'cuet-phy-mag-devices',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'easy',
  'just-started',
  $t$The diagram shows a cyclotron with two D-shaped electrodes (dees) in a magnetic field B. A proton of mass m and charge q spirals outward. What is the cyclotron frequency?$t$,
  $t$The cyclotron frequency f = qB/(2πm). This is independent of the radius and speed of the particle — a key feature that makes the cyclotron work.$t$,
  $json${"question_id": "cuet-phy-mag-device-d02", "subtopic": "Cyclotron frequency", "topic_name": "Galvanometer, Ammeter, Voltmeter, Cyclotron", "bloom_level": "remember", "options": [{"key": "A", "text": "qB/m", "is_correct": false}, {"key": "B", "text": "2πm/(qB)", "is_correct": false}, {"key": "C", "text": "qB/(2πm)", "is_correct": true}, {"key": "D", "text": "qBr/m", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "qB/m = ω (angular frequency). The cyclotron frequency f = ω/(2π).", "misconception": "Confusing angular frequency with frequency"}, {"option_key": "B", "hint": "2πm/(qB) = 1/f = T (the time period), not the frequency.", "misconception": "Giving time period instead of frequency"}, {"option_key": "D", "hint": "Cyclotron frequency is independent of radius r.", "misconception": "Including radius in frequency"}], "image_uri": "diagrams/cuet-phy-mag-device-d02.png", "image_alt": "Cyclotron top view: two D-shaped electrodes (dees), magnetic field B perpendicular to plane, proton spiraling outward"}$json$::jsonb,
  NULL,
  $t$Cyclotron top view: two D-shaped electrodes (dees), magnetic field B perpendicular to plane, proton spiraling outward$t$,
  'C',
  ARRAY['cyclotron','frequency','charged-particle'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-mag-device-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-magnetic-effects',
  'cuet-phy-mag-devices',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following in order of increasing total resistance for converting a galvanometer (resistance G) to the specified instrument:
(I) Ammeter (0-1 A)
(II) Ammeter (0-10 A)
(III) Voltmeter (0-10 V)$t$,
  $t$Ammeter uses low shunt resistance S = GIg/(I-Ig). Larger range → smaller S. So 0-10A ammeter has smallest total R. 0-1A ammeter has slightly larger R. Voltmeter uses high series resistance R_total >> G. Order: II → I → III.$t$,
  $json${"question_id": "cuet-phy-mag-device-ls01", "subtopic": "Galvanometer conversion", "topic_name": "Galvanometer, Ammeter, Voltmeter, Cyclotron", "bloom_level": "analyze", "options": [{"key": "A", "text": "II → I → III", "is_correct": true}, {"key": "B", "text": "III → I → II", "is_correct": false}, {"key": "C", "text": "I → II → III", "is_correct": false}, {"key": "D", "text": "II → III → I", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "Voltmeter has the highest resistance (series R), not the lowest.", "misconception": "Reversing ammeter and voltmeter resistance"}, {"option_key": "C", "hint": "Higher range ammeter needs smaller shunt, giving lower total resistance.", "misconception": null}, {"option_key": "D", "hint": "Voltmeter resistance is much higher than any ammeter.", "misconception": null}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['ammeter','voltmeter','galvanometer-conversion'],
  'active',
  true,
  'correction-batch-3'
);

-- ── phy-magmat-dipole-copied.json (───────────────────────────────)

-- cuet-phy-mag-dipole-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-magnetic-effects',
  'cuet-phy-mag-dipole',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The diagram shows a magnetic dipole of moment M placed in a uniform magnetic field B at angle θ. The torque τ = MB sinθ. For what value of θ is the torque maximum?$t$,
  $t$τ = MB sinθ. Maximum when sinθ = 1, i.e., θ = 90°. At this angle, the dipole is perpendicular to the field.$t$,
  $json${"question_id": "cuet-phy-mag-dipole-d01", "subtopic": "Torque on magnetic dipole", "topic_name": "Magnetic Dipole and Torque", "bloom_level": "understand", "options": [{"key": "A", "text": "0°", "is_correct": false}, {"key": "B", "text": "45°", "is_correct": false}, {"key": "C", "text": "180°", "is_correct": false}, {"key": "D", "text": "90°", "is_correct": true}], "elimination_hints": [{"option_key": "A", "hint": "At 0°, sinθ = 0, so τ = 0. This is the equilibrium position.", "misconception": "Confusing stable equilibrium with maximum torque"}, {"option_key": "B", "hint": "At 45°, sin 45° = 0.707 — not the maximum value of sine.", "misconception": null}, {"option_key": "C", "hint": "At 180°, sin 180° = 0, so τ = 0. This is unstable equilibrium.", "misconception": "Confusing unstable equilibrium with maximum torque"}], "image_uri": "diagrams/cuet-phy-mag-dipole-d01.png", "image_alt": "Bar magnet (magnetic moment M) at angle θ to uniform magnetic field B, torque τ rotating it toward field direction"}$json$::jsonb,
  NULL,
  $t$Bar magnet (magnetic moment M) at angle θ to uniform magnetic field B, torque τ rotating it toward field direction$t$,
  'D',
  ARRAY['magnetic-dipole','torque','uniform-field'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-mag-dipole-d02  (diagram-based, easy)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-magnetic-effects',
  'cuet-phy-mag-dipole',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'easy',
  'just-started',
  $t$The diagram shows the magnetic field lines of a bar magnet. Where is the magnetic field strongest?$t$,
  $t$Magnetic field strength is proportional to the density of field lines. Near the poles, field lines are most closely packed, indicating the strongest field.$t$,
  $json${"question_id": "cuet-phy-mag-dipole-d02", "subtopic": "Magnetic field of a bar magnet", "topic_name": "Magnetic Dipole and Torque", "bloom_level": "remember", "options": [{"key": "A", "text": "At the poles", "is_correct": true}, {"key": "B", "text": "At the centre of the magnet", "is_correct": false}, {"key": "C", "text": "Midway between N and S outside the magnet", "is_correct": false}, {"key": "D", "text": "Field is uniform everywhere", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "Inside the magnet at the centre, the field exists but is not the strongest point externally.", "misconception": null}, {"option_key": "C", "hint": "The field lines are more spread out far from the poles — weaker field.", "misconception": null}, {"option_key": "D", "hint": "A bar magnet's field is non-uniform — it varies with position.", "misconception": "Assuming uniform field"}], "image_uri": "diagrams/cuet-phy-mag-dipole-d02.png", "image_alt": "Bar magnet with N and S poles, field lines emerging from N, curving around, entering S. Lines densest near poles."}$json$::jsonb,
  NULL,
  $t$Bar magnet with N and S poles, field lines emerging from N, curving around, entering S. Lines densest near poles.$t$,
  'A',
  ARRAY['magnetic-field-lines','bar-magnet','poles'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-mag-dipole-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-magnetic-effects',
  'cuet-phy-mag-dipole',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following positions of a magnetic dipole M in uniform field B in order of increasing potential energy:
(I) θ = 0° (aligned with B)
(II) θ = 90° (perpendicular to B)
(III) θ = 180° (anti-aligned with B)$t$,
  $t$U = −MB cosθ. U(0°) = −MB (minimum), U(90°) = 0, U(180°) = +MB (maximum). Order: I → II → III.$t$,
  $json${"question_id": "cuet-phy-mag-dipole-ls01", "subtopic": "Potential energy of dipole in field", "topic_name": "Magnetic Dipole and Torque", "bloom_level": "apply", "options": [{"key": "A", "text": "I → II → III", "is_correct": true}, {"key": "B", "text": "III → II → I", "is_correct": false}, {"key": "C", "text": "II → I → III", "is_correct": false}, {"key": "D", "text": "I → III → II", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "This is the order of decreasing potential energy.", "misconception": "Reversing the order"}, {"option_key": "C", "hint": "U(0°) = −MB is less than U(90°) = 0, so I comes before II.", "misconception": null}, {"option_key": "D", "hint": "U(180°) = +MB > U(90°) = 0, so III comes after II.", "misconception": null}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['potential-energy','magnetic-dipole','orientation'],
  'active',
  true,
  'correction-batch-3'
);

-- ── phy-magmat-materials-copied.json (────────────────────────────)

-- cuet-phy-mag-mat-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-magnetic-effects',
  'cuet-phy-mag-materials',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The diagram shows the B-H hysteresis curve for a ferromagnetic material. What does the area enclosed by the hysteresis loop represent?$t$,
  $t$The area of the hysteresis loop represents the energy dissipated as heat per unit volume per magnetization cycle. Materials with larger loops (hard magnets) dissipate more energy.$t$,
  $json${"question_id": "cuet-phy-mag-mat-d01", "subtopic": "Hysteresis loop and energy loss", "topic_name": "Dia-, Para-, and Ferromagnetic Materials", "bloom_level": "understand", "options": [{"key": "A", "text": "The magnetic susceptibility of the material", "is_correct": false}, {"key": "B", "text": "Energy dissipated per cycle per unit volume", "is_correct": true}, {"key": "C", "text": "The retentivity of the material", "is_correct": false}, {"key": "D", "text": "The coercivity of the material", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Susceptibility is the slope of the B-H curve, not the area.", "misconception": "Confusing slope with area"}, {"option_key": "C", "hint": "Retentivity is the y-intercept (B when H=0), a single point, not the area.", "misconception": null}, {"option_key": "D", "hint": "Coercivity is the x-intercept (H when B=0), a single point, not the area.", "misconception": null}], "image_uri": "diagrams/cuet-phy-mag-mat-d01.png", "image_alt": "B-H hysteresis curve: S-shaped loop showing B vs H for ferromagnetic material, with retentivity Br and coercivity Hc marked"}$json$::jsonb,
  NULL,
  $t$B-H hysteresis curve: S-shaped loop showing B vs H for ferromagnetic material, with retentivity Br and coercivity Hc marked$t$,
  'B',
  ARRAY['hysteresis','energy-loss','ferromagnetic'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-mag-mat-d02  (diagram-based, hard)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-magnetic-effects',
  'cuet-phy-mag-materials',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'hard',
  'just-started',
  $t$The graph shows the variation of magnetic susceptibility (χ) with temperature (T) for a paramagnetic material. According to Curie's law, χ is proportional to:$t$,
  $t$Curie's law: χ = C/T, where C is the Curie constant. So χ ∝ 1/T. As temperature increases, thermal agitation randomizes magnetic moments, reducing susceptibility.$t$,
  $json${"question_id": "cuet-phy-mag-mat-d02", "subtopic": "Temperature dependence of susceptibility", "topic_name": "Dia-, Para-, and Ferromagnetic Materials", "bloom_level": "understand", "options": [{"key": "A", "text": "1/T", "is_correct": true}, {"key": "B", "text": "T", "is_correct": false}, {"key": "C", "text": "T²", "is_correct": false}, {"key": "D", "text": "Independent of T", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "χ ∝ T would mean susceptibility increases with temperature — opposite of Curie's law.", "misconception": "Inverting the relationship"}, {"option_key": "C", "hint": "There is no T² dependence in Curie's law.", "misconception": null}, {"option_key": "D", "hint": "Diamagnetic susceptibility is roughly independent of T, but paramagnetic follows Curie's law.", "misconception": "Confusing para with diamagnetic"}], "image_uri": "diagrams/cuet-phy-mag-mat-d02.png", "image_alt": "χ vs T graph: hyperbolic decrease showing χ ∝ 1/T (Curie's law) for paramagnetic material. χ approaches zero at high T."}$json$::jsonb,
  NULL,
  $t$χ vs T graph: hyperbolic decrease showing χ ∝ 1/T (Curie's law) for paramagnetic material. χ approaches zero at high T.$t$,
  'A',
  ARRAY['curie-law','susceptibility','paramagnetic'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-mag-mat-ls01  (logical-sequence, easy)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-magnetic-effects',
  'cuet-phy-mag-materials',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'easy',
  'just-started',
  $t$Arrange the following materials in order of increasing magnetic susceptibility:
(I) Diamagnetic (copper)
(II) Paramagnetic (aluminium)
(III) Ferromagnetic (iron)$t$,
  $t$Diamagnetic: χ ≈ −10⁻⁵ (small, negative). Paramagnetic: χ ≈ +10⁻⁵ to +10⁻³ (small, positive). Ferromagnetic: χ ≈ +10³ to +10⁵ (very large, positive). Order: I → II → III.$t$,
  $json${"question_id": "cuet-phy-mag-mat-ls01", "subtopic": "Comparison of magnetic materials", "topic_name": "Dia-, Para-, and Ferromagnetic Materials", "bloom_level": "remember", "options": [{"key": "A", "text": "I → II → III", "is_correct": true}, {"key": "B", "text": "III → II → I", "is_correct": false}, {"key": "C", "text": "II → I → III", "is_correct": false}, {"key": "D", "text": "I → III → II", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "This is the order of decreasing susceptibility.", "misconception": "Reversing the order"}, {"option_key": "C", "hint": "Diamagnetic has negative χ, the smallest value.", "misconception": null}, {"option_key": "D", "hint": "Ferromagnetic has the highest χ by far (thousands).", "misconception": null}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['susceptibility','magnetic-materials','classification'],
  'active',
  true,
  'correction-batch-3'
);

-- ── phy-ray-reflection-copied.json (──────────────────────────────)

-- cuet-phy-ray-reflect-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-optics',
  'cuet-phy-opt-reflection',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The ray diagram shows an object placed between the focus (F) and centre of curvature (C) of a concave mirror. The image formed is:$t$,
  $t$When the object is between F and C, the image is formed beyond C. It is real (on the same side as object), inverted, and magnified (larger than object).$t$,
  $json${"question_id": "cuet-phy-ray-reflect-d01", "subtopic": "Image formation by concave mirror", "topic_name": "Reflection at Curved Surfaces and Mirror Formula", "bloom_level": "understand", "options": [{"key": "A", "text": "Virtual, erect, magnified", "is_correct": false}, {"key": "B", "text": "Real, inverted, diminished", "is_correct": false}, {"key": "C", "text": "Real, inverted, magnified", "is_correct": true}, {"key": "D", "text": "Real, inverted, same size", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "Virtual, erect image is formed only when object is between F and pole.", "misconception": "Wrong object position"}, {"option_key": "B", "hint": "Diminished image is formed when object is beyond C.", "misconception": "Confusing 'between F and C' with 'beyond C'"}, {"option_key": "D", "hint": "Same size image is formed when object is at C.", "misconception": "Confusing 'between F and C' with 'at C'"}], "image_uri": "diagrams/cuet-phy-ray-reflect-d01.png", "image_alt": "Concave mirror with center of curvature C and focus F. Object between F and C. Two rays drawn forming real, inverted, magnified image beyond C."}$json$::jsonb,
  NULL,
  $t$Concave mirror with center of curvature C and focus F. Object between F and C. Two rays drawn forming real, inverted, magnified image beyond C.$t$,
  'C',
  ARRAY['concave-mirror','image-formation','ray-diagram'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-ray-reflect-d02  (diagram-based, easy)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-optics',
  'cuet-phy-opt-reflection',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'easy',
  'just-started',
  $t$The graph shows 1/v vs 1/u for a concave mirror, which is a straight line. What is its slope?$t$,
  $t$Mirror formula: 1/v + 1/u = 1/f. Rearranging: 1/v = −(1/u) + 1/f. Comparing with y = mx + c: slope m = −1.$t$,
  $json${"question_id": "cuet-phy-ray-reflect-d02", "subtopic": "Mirror formula graphical representation", "topic_name": "Reflection at Curved Surfaces and Mirror Formula", "bloom_level": "understand", "options": [{"key": "A", "text": "+1", "is_correct": false}, {"key": "B", "text": "−1", "is_correct": true}, {"key": "C", "text": "1/f", "is_correct": false}, {"key": "D", "text": "−1/f", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "The coefficient of 1/u is −1, not +1.", "misconception": "Sign error in rearrangement"}, {"option_key": "C", "hint": "1/f is the y-intercept, not the slope.", "misconception": "Confusing slope with intercept"}, {"option_key": "D", "hint": "−1/f is neither the slope nor the intercept in this form.", "misconception": null}], "image_uri": "diagrams/cuet-phy-ray-reflect-d02.png", "image_alt": "Graph of 1/v vs 1/u: straight line with slope −1, y-intercept = 1/f"}$json$::jsonb,
  NULL,
  $t$Graph of 1/v vs 1/u: straight line with slope −1, y-intercept = 1/f$t$,
  'B',
  ARRAY['mirror-formula','graphical-analysis','concave-mirror'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-ray-reflect-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-optics',
  'cuet-phy-opt-reflection',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following object positions for a concave mirror in order of increasing image size:
(I) Object at infinity
(II) Object at C
(III) Object between F and C
(IV) Object at F$t$,
  $t$At infinity: image at F, point-sized. At C: image at C, same size. Between F and C: image beyond C, magnified. At F: image at infinity, infinitely large. Order: I → II → III → IV.$t$,
  $json${"question_id": "cuet-phy-ray-reflect-ls01", "subtopic": "Image size variation with object position", "topic_name": "Reflection at Curved Surfaces and Mirror Formula", "bloom_level": "analyze", "options": [{"key": "A", "text": "I → II → III → IV", "is_correct": true}, {"key": "B", "text": "IV → III → II → I", "is_correct": false}, {"key": "C", "text": "I → III → II → IV", "is_correct": false}, {"key": "D", "text": "II → I → III → IV", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "This is the order of decreasing image size.", "misconception": "Reversing the order"}, {"option_key": "C", "hint": "At C, image is same size (m=1). Between F and C, image is magnified (m>1).", "misconception": null}, {"option_key": "D", "hint": "At infinity, image is point-sized (smallest), not after C.", "misconception": null}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['concave-mirror','image-size','object-position'],
  'active',
  true,
  'correction-batch-3'
);

-- ── phy-ray-prism-copied.json (───────────────────────────────────)

-- cuet-phy-ray-prism-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-optics',
  'cuet-phy-opt-prism',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The diagram shows light passing through a prism of angle A = 60° at minimum deviation δ_min = 30°. At minimum deviation, i = e. What is the refractive index of the prism?$t$,
  $t$At minimum deviation: μ = sin((A + δ_min)/2) / sin(A/2) = sin((60°+30°)/2) / sin(60°/2) = sin(45°)/sin(30°) = (√2/2)/(1/2) = √2 ≈ 1.414.$t$,
  $json${"question_id": "cuet-phy-ray-prism-d01", "subtopic": "Prism formula at minimum deviation", "topic_name": "Refraction through Prism and Dispersion", "bloom_level": "apply", "options": [{"key": "A", "text": "1.5", "is_correct": false}, {"key": "B", "text": "√2 ≈ 1.414", "is_correct": true}, {"key": "C", "text": "√3 ≈ 1.732", "is_correct": false}, {"key": "D", "text": "2", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "1.5 = sin(45°)/sin(30°) only if you use sin(45°) = 0.75, but sin(45°) = 0.707.", "misconception": null}, {"option_key": "C", "hint": "√3 would require sin((A+δ)/2)/sin(A/2) = sin(60°)/sin(30°). Check your angles.", "misconception": "Using wrong angles in formula"}, {"option_key": "D", "hint": "μ = 2 is very high for glass. sin(45°)/sin(30°) ≠ 2.", "misconception": null}], "image_uri": "diagrams/cuet-phy-ray-prism-d01.png", "image_alt": "Prism of angle A=60°, light ray entering and exiting symmetrically at minimum deviation δ=30°, i=e"}$json$::jsonb,
  NULL,
  $t$Prism of angle A=60°, light ray entering and exiting symmetrically at minimum deviation δ=30°, i=e$t$,
  'B',
  ARRAY['prism','minimum-deviation','refractive-index'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-ray-prism-d02  (diagram-based, easy)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-optics',
  'cuet-phy-opt-prism',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'easy',
  'just-started',
  $t$The diagram shows white light being dispersed by a glass prism into the visible spectrum. Which colour deviates the most?$t$,
  $t$Violet light has the shortest wavelength and highest refractive index in glass, so it deviates the most. Red has the longest wavelength and deviates the least.$t$,
  $json${"question_id": "cuet-phy-ray-prism-d02", "subtopic": "Dispersion of white light", "topic_name": "Refraction through Prism and Dispersion", "bloom_level": "remember", "options": [{"key": "A", "text": "Red", "is_correct": false}, {"key": "B", "text": "Green", "is_correct": false}, {"key": "C", "text": "Yellow", "is_correct": false}, {"key": "D", "text": "Violet", "is_correct": true}], "elimination_hints": [{"option_key": "A", "hint": "Red has the longest wavelength and deviates the LEAST.", "misconception": "Confusing most with least deviation"}, {"option_key": "B", "hint": "Green is in the middle of the spectrum — moderate deviation.", "misconception": null}, {"option_key": "C", "hint": "Yellow is also intermediate. Shortest wavelength = most deviation.", "misconception": null}], "image_uri": "diagrams/cuet-phy-ray-prism-d02.png", "image_alt": "White light entering prism, dispersed into spectrum VIBGYOR. Violet bent most, red bent least."}$json$::jsonb,
  NULL,
  $t$White light entering prism, dispersed into spectrum VIBGYOR. Violet bent most, red bent least.$t$,
  'D',
  ARRAY['dispersion','prism','deviation'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-ray-prism-ls01  (logical-sequence, easy)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-optics',
  'cuet-phy-opt-prism',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'easy',
  'just-started',
  $t$Arrange the following colours of visible light in order of increasing refractive index in glass:
(I) Red
(II) Yellow
(III) Blue
(IV) Violet$t$,
  $t$Refractive index increases with frequency (decreases with wavelength). Red has lowest μ, violet has highest. Order: I → II → III → IV.$t$,
  $json${"question_id": "cuet-phy-ray-prism-ls01", "subtopic": "Refractive index vs colour", "topic_name": "Refraction through Prism and Dispersion", "bloom_level": "remember", "options": [{"key": "A", "text": "I → II → III → IV", "is_correct": true}, {"key": "B", "text": "IV → III → II → I", "is_correct": false}, {"key": "C", "text": "I → III → II → IV", "is_correct": false}, {"key": "D", "text": "II → I → III → IV", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "This is the order of decreasing refractive index.", "misconception": "Reversing the order"}, {"option_key": "C", "hint": "Yellow has lower μ than blue (yellow wavelength > blue wavelength).", "misconception": null}, {"option_key": "D", "hint": "Red has the lowest μ, so I comes first.", "misconception": null}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['refractive-index','dispersion','colour-dependence'],
  'active',
  true,
  'correction-batch-3'
);

-- ── phy-ray-instruments-copied.json (─────────────────────────────)

-- cuet-phy-ray-instr-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-optics',
  'cuet-phy-opt-instruments',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The diagram shows a compound microscope with objective (fo = 1 cm) and eyepiece (fe = 5 cm), tube length L = 20 cm. What is the approximate magnification?$t$,
  $t$Magnification m ≈ (L/fo)(D/fe) = (20/1)(25/5) = 20 × 5 = 100, where D = 25 cm (least distance of distinct vision).$t$,
  $json${"question_id": "cuet-phy-ray-instr-d01", "subtopic": "Compound microscope magnification", "topic_name": "Optical Instruments (Microscope and Telescope)", "bloom_level": "apply", "options": [{"key": "A", "text": "20", "is_correct": false}, {"key": "B", "text": "50", "is_correct": false}, {"key": "C", "text": "100", "is_correct": true}, {"key": "D", "text": "200", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "20 = L/fo. You forgot to multiply by D/fe = 25/5 = 5.", "misconception": "Using only objective magnification"}, {"option_key": "B", "hint": "50 would result from using D = 25 directly instead of D/fe.", "misconception": null}, {"option_key": "D", "hint": "200 would require either a different tube length or focal lengths.", "misconception": null}], "image_uri": "diagrams/cuet-phy-ray-instr-d01.png", "image_alt": "Compound microscope: objective lens (fo=1cm) forms magnified real image, eyepiece (fe=5cm) acts as magnifier. Tube length L=20cm."}$json$::jsonb,
  NULL,
  $t$Compound microscope: objective lens (fo=1cm) forms magnified real image, eyepiece (fe=5cm) acts as magnifier. Tube length L=20cm.$t$,
  'C',
  ARRAY['compound-microscope','magnification','optical-instruments'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-ray-instr-d02  (diagram-based, easy)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-optics',
  'cuet-phy-opt-instruments',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'easy',
  'just-started',
  $t$The diagram shows an astronomical telescope in normal adjustment (image at infinity). The magnifying power in this mode is:$t$,
  $t$In normal adjustment (image at infinity): M = fo/fe, where fo is the focal length of the objective and fe is the focal length of the eyepiece.$t$,
  $json${"question_id": "cuet-phy-ray-instr-d02", "subtopic": "Astronomical telescope magnification", "topic_name": "Optical Instruments (Microscope and Telescope)", "bloom_level": "remember", "options": [{"key": "A", "text": "fo/fe", "is_correct": true}, {"key": "B", "text": "fe/fo", "is_correct": false}, {"key": "C", "text": "fo × fe", "is_correct": false}, {"key": "D", "text": "fo + fe", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "fe/fo < 1 (since fo > fe), giving magnification less than 1 — that defeats the purpose.", "misconception": "Inverting the ratio"}, {"option_key": "C", "hint": "fo × fe has units of cm², not a dimensionless ratio.", "misconception": null}, {"option_key": "D", "hint": "fo + fe gives the tube length in normal adjustment, not magnification.", "misconception": "Confusing tube length with magnification"}], "image_uri": "diagrams/cuet-phy-ray-instr-d02.png", "image_alt": "Astronomical telescope: objective (large fo) forms image at focus, eyepiece (small fe) views it. Parallel rays in and out."}$json$::jsonb,
  NULL,
  $t$Astronomical telescope: objective (large fo) forms image at focus, eyepiece (small fe) views it. Parallel rays in and out.$t$,
  'A',
  ARRAY['telescope','magnifying-power','normal-adjustment'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-ray-instr-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-optics',
  'cuet-phy-opt-instruments',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange in order of increasing magnifying power for normal adjustment:
(I) Simple magnifier (D/f = 5)
(II) Compound microscope (m = 100)
(III) Astronomical telescope (m = 50)$t$,
  $t$Simple magnifier: m = 5. Telescope: m = 50. Microscope: m = 100. Order: I → III → II.$t$,
  $json${"question_id": "cuet-phy-ray-instr-ls01", "subtopic": "Comparison of optical instruments", "topic_name": "Optical Instruments (Microscope and Telescope)", "bloom_level": "analyze", "options": [{"key": "A", "text": "I → III → II", "is_correct": true}, {"key": "B", "text": "II → III → I", "is_correct": false}, {"key": "C", "text": "I → II → III", "is_correct": false}, {"key": "D", "text": "III → I → II", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "This is the order of decreasing magnification.", "misconception": "Reversing the order"}, {"option_key": "C", "hint": "Microscope (100) has higher magnification than telescope (50).", "misconception": null}, {"option_key": "D", "hint": "Simple magnifier (5) has the lowest magnification.", "misconception": null}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['magnification-comparison','optical-instruments'],
  'active',
  true,
  'correction-batch-3'
);

-- ── phy-waveopt-interference-copied.json (────────────────────────)

-- cuet-phy-waveopt-interf-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-optics',
  'cuet-phy-opt-interference',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$In the diagram of Young's double-slit experiment, two coherent sources S₁ and S₂ are separated by distance d and a screen is placed at distance D. The fringe width β is observed. Which expression correctly gives β?$t$,
  $t$Fringe width β = λD/d. It is directly proportional to wavelength λ and screen distance D, and inversely proportional to slit separation d.$t$,
  $json${"question_id": "cuet-phy-waveopt-interf-d01", "subtopic": "Fringe width formula", "topic_name": "Interference and Young's Double Slit", "bloom_level": "understand", "options": [{"key": "A", "text": "β = λd/D", "is_correct": false}, {"key": "B", "text": "β = λD/d", "is_correct": true}, {"key": "C", "text": "β = d/(λD)", "is_correct": false}, {"key": "D", "text": "β = D/(λd)", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "This inverts D and d. Increasing slit separation d should decrease fringe width, not increase it.", "misconception": "Swapping d and D"}, {"option_key": "C", "hint": "Fringe width increases with wavelength, so λ should be in the numerator.", "misconception": null}, {"option_key": "D", "hint": "λ must appear in the numerator — longer wavelength gives wider fringes.", "misconception": null}], "image_uri": "diagrams/cuet-phy-waveopt-interf-d01.png", "image_alt": "Young's double-slit setup: two slits S1, S2 separated by d, screen at distance D, fringes with width β marked"}$json$::jsonb,
  NULL,
  $t$Young's double-slit setup: two slits S1, S2 separated by d, screen at distance D, fringes with width β marked$t$,
  'B',
  ARRAY['YDSE','fringe-width','interference'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-waveopt-interf-d02  (diagram-based, hard)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-optics',
  'cuet-phy-opt-interference',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'hard',
  'just-started',
  $t$The intensity pattern from a double-slit experiment is shown. If the path difference at point P is λ/3, and I₀ is the intensity due to each slit, what is the resultant intensity at P?$t$,
  $t$Phase difference δ = (2π/λ)(λ/3) = 2π/3. Resultant intensity I = 4I₀cos²(δ/2) = 4I₀cos²(π/3) = 4I₀(1/2)² = 4I₀(1/4) = I₀.$t$,
  $json${"question_id": "cuet-phy-waveopt-interf-d02", "subtopic": "Intensity at arbitrary point", "topic_name": "Interference and Young's Double Slit", "bloom_level": "apply", "options": [{"key": "A", "text": "4I₀", "is_correct": false}, {"key": "B", "text": "2I₀", "is_correct": false}, {"key": "C", "text": "I₀", "is_correct": true}, {"key": "D", "text": "Zero", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "4I₀ occurs only at path difference = nλ (constructive maximum). λ/3 is not an integer multiple of λ.", "misconception": "Assuming maximum everywhere"}, {"option_key": "B", "hint": "2I₀ would require cos²(δ/2) = 1/2, i.e., δ/2 = π/4, which gives path difference λ/4, not λ/3.", "misconception": null}, {"option_key": "D", "hint": "Zero intensity requires path difference (n+½)λ (destructive). λ/3 ≠ λ/2.", "misconception": "Confusing with destructive condition"}], "image_uri": "diagrams/cuet-phy-waveopt-interf-d02.png", "image_alt": "Double-slit intensity pattern with point P marked where path difference is λ/3, showing intensity distribution curve"}$json$::jsonb,
  NULL,
  $t$Double-slit intensity pattern with point P marked where path difference is λ/3, showing intensity distribution curve$t$,
  'C',
  ARRAY['interference-intensity','phase-difference','path-difference'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-waveopt-interf-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-optics',
  'cuet-phy-opt-interference',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following YDSE setups in order of increasing fringe width:
(I) λ = 500 nm, d = 1 mm, D = 1 m (β = 0.5 mm)
(II) λ = 600 nm, d = 0.5 mm, D = 1 m (β = 1.2 mm)
(III) λ = 700 nm, d = 0.5 mm, D = 2 m (β = 2.8 mm)$t$,
  $t$Using β = λD/d: Setup I: 0.5 mm, Setup II: 1.2 mm, Setup III: 2.8 mm. Order: I → II → III.$t$,
  $json${"question_id": "cuet-phy-waveopt-interf-ls01", "subtopic": "Fringe width comparison", "topic_name": "Interference and Young's Double Slit", "bloom_level": "analyze", "options": [{"key": "A", "text": "I → II → III", "is_correct": true}, {"key": "B", "text": "III → II → I", "is_correct": false}, {"key": "C", "text": "II → I → III", "is_correct": false}, {"key": "D", "text": "I → III → II", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "This gives decreasing fringe width, not increasing.", "misconception": "Reversing the order"}, {"option_key": "C", "hint": "Calculate β for II: 600e-9 × 1 / 0.5e-3 = 1.2 mm, which is larger than I's 0.5 mm.", "misconception": null}, {"option_key": "D", "hint": "β for III (2.8 mm) is larger than β for II (1.2 mm), so III must come last.", "misconception": null}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['fringe-width-comparison','YDSE'],
  'active',
  true,
  'correction-batch-3'
);

-- ── phy-waveopt-diffraction-copied.json (─────────────────────────)

-- cuet-phy-waveopt-diff-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-optics',
  'cuet-phy-opt-diffraction',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The diagram shows single-slit Fraunhofer diffraction. A slit of width a produces the first minimum at angle θ. Which condition gives the position of the first minimum?$t$,
  $t$For single-slit diffraction, the first minimum occurs when a sinθ = λ, where a is the slit width. This is because the slit is divided into two halves that cancel pairwise.$t$,
  $json${"question_id": "cuet-phy-waveopt-diff-d01", "subtopic": "Condition for minima", "topic_name": "Diffraction and Single Slit", "bloom_level": "understand", "options": [{"key": "A", "text": "a sinθ = λ", "is_correct": true}, {"key": "B", "text": "a sinθ = λ/2", "is_correct": false}, {"key": "C", "text": "a cosθ = λ", "is_correct": false}, {"key": "D", "text": "a sinθ = 2λ", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "a sinθ = λ/2 would be a subsidiary maximum, not a minimum.", "misconception": "Confusing maxima and minima conditions"}, {"option_key": "C", "hint": "Path difference depends on sinθ not cosθ for rays from different parts of the slit.", "misconception": null}, {"option_key": "D", "hint": "a sinθ = 2λ gives the second minimum, not the first.", "misconception": "Using wrong order number"}], "image_uri": "diagrams/cuet-phy-waveopt-diff-d01.png", "image_alt": "Single slit of width a with parallel rays, showing first minimum at angle θ, with path difference a sinθ = λ marked"}$json$::jsonb,
  NULL,
  $t$Single slit of width a with parallel rays, showing first minimum at angle θ, with path difference a sinθ = λ marked$t$,
  'A',
  ARRAY['single-slit-diffraction','first-minimum'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-waveopt-diff-d02  (diagram-based, hard)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-optics',
  'cuet-phy-opt-diffraction',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'hard',
  'just-started',
  $t$The diagram compares two single-slit diffraction patterns — one with slit width a, and one with slit width a/2. How does the angular width of the central maximum change when the slit width is halved?$t$,
  $t$Angular position of first minimum: sinθ ≈ θ = λ/a. Angular width of central max = 2λ/a. Halving slit width: new width = 2λ/(a/2) = 4λ/a — the angular width doubles.$t$,
  $json${"question_id": "cuet-phy-waveopt-diff-d02", "subtopic": "Width of central maximum", "topic_name": "Diffraction and Single Slit", "bloom_level": "apply", "options": [{"key": "A", "text": "It halves", "is_correct": false}, {"key": "B", "text": "It remains the same", "is_correct": false}, {"key": "C", "text": "It increases by 50%", "is_correct": false}, {"key": "D", "text": "It doubles", "is_correct": true}], "elimination_hints": [{"option_key": "A", "hint": "Narrower slit produces wider diffraction — not narrower. This is a common inverse relationship error.", "misconception": "Thinking narrower slit gives narrower pattern"}, {"option_key": "B", "hint": "Angular width = 2λ/a clearly depends on a, so changing a must change the width.", "misconception": null}, {"option_key": "C", "hint": "Halving a doubles 1/a, so the width doubles (not 1.5×).", "misconception": null}], "image_uri": "diagrams/cuet-phy-waveopt-diff-d02.png", "image_alt": "Two diffraction patterns compared: slit width a (narrow central max) and slit width a/2 (wide central max), showing angular width 2θ doubles"}$json$::jsonb,
  NULL,
  $t$Two diffraction patterns compared: slit width a (narrow central max) and slit width a/2 (wide central max), showing angular width 2θ doubles$t$,
  'D',
  ARRAY['diffraction-pattern','central-maximum-width'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-waveopt-diff-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-optics',
  'cuet-phy-opt-diffraction',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Arrange the following single-slit setups in order of increasing angular width of the central maximum:
(I) a = 0.2 mm, λ = 500 nm → 2θ = 5 mrad
(II) a = 0.1 mm, λ = 500 nm → 2θ = 10 mrad
(III) a = 0.1 mm, λ = 700 nm → 2θ = 14 mrad$t$,
  $t$Angular width 2θ = 2λ/a. Setup I: 5 mrad, Setup II: 10 mrad, Setup III: 14 mrad. Order: I → II → III.$t$,
  $json${"question_id": "cuet-phy-waveopt-diff-ls01", "subtopic": "Angular width comparison", "topic_name": "Diffraction and Single Slit", "bloom_level": "analyze", "options": [{"key": "A", "text": "I → II → III", "is_correct": true}, {"key": "B", "text": "III → II → I", "is_correct": false}, {"key": "C", "text": "II → I → III", "is_correct": false}, {"key": "D", "text": "I → III → II", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "This is decreasing order of angular width.", "misconception": "Reversing the sequence"}, {"option_key": "C", "hint": "Setup I (5 mrad) has a smaller angular width than Setup II (10 mrad), so I comes before II.", "misconception": null}, {"option_key": "D", "hint": "Setup III (14 mrad) is the largest, so it must come last.", "misconception": null}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['angular-width-comparison','diffraction'],
  'active',
  true,
  'correction-batch-3'
);

-- ── phy-waveopt-polarisation-copied.json (────────────────────────)

-- cuet-phy-waveopt-polar-d01  (diagram-based, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-optics',
  'cuet-phy-opt-polarisation',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'medium',
  'just-started',
  $t$The diagram shows unpolarised light incident on a glass surface at Brewster's angle. The reflected ray is fully polarised. If the reflected and refracted rays are perpendicular, and the Brewster angle is 57°, what is the refractive index of the glass?$t$,
  $t$At Brewster's angle: μ = tan(iB) = tan(57°) ≈ 1.54. The reflected and refracted rays are perpendicular (i + r = 90°), a defining property of Brewster's angle.$t$,
  $json${"question_id": "cuet-phy-waveopt-polar-d01", "subtopic": "Brewster's angle and refractive index", "topic_name": "Polarisation and Brewster's Law", "bloom_level": "apply", "options": [{"key": "A", "text": "1.33", "is_correct": false}, {"key": "B", "text": "1.54", "is_correct": true}, {"key": "C", "text": "1.73", "is_correct": false}, {"key": "D", "text": "1.00", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "1.33 is the refractive index of water (Brewster angle ≈ 53°), not glass at 57°.", "misconception": "Using water's refractive index"}, {"option_key": "C", "hint": "tan(60°) = 1.73. Brewster's angle for μ = 1.73 would be 60°, not 57°.", "misconception": "Using wrong angle"}, {"option_key": "D", "hint": "μ = 1.00 means no interface (Brewster angle = 45° for equal media). The question specifies a glass surface.", "misconception": null}], "image_uri": "diagrams/cuet-phy-waveopt-polar-d01.png", "image_alt": "Light ray hitting glass at Brewster angle 57°, reflected ray polarised, refracted ray at 33° with perpendicular annotation between reflected and refracted"}$json$::jsonb,
  NULL,
  $t$Light ray hitting glass at Brewster angle 57°, reflected ray polarised, refracted ray at 33° with perpendicular annotation between reflected and refracted$t$,
  'B',
  ARRAY['brewster-angle','polarisation','refractive-index'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-waveopt-polar-d02  (diagram-based, hard)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-optics',
  'cuet-phy-opt-polarisation',
  ARRAY['CUET','NEET'],
  'diagram-based',
  'hard',
  'just-started',
  $t$The diagram illustrates Malus's Law. Unpolarised light of intensity I₀ passes through a polariser and then through an analyser whose pass axis makes an angle of 60° with the polariser. What is the intensity of light emerging from the analyser?$t$,
  $t$After the polariser: I₁ = I₀/2. After the analyser (Malus's Law): I₂ = I₁cos²(60°) = (I₀/2)(1/2)² = (I₀/2)(1/4) = I₀/8.$t$,
  $json${"question_id": "cuet-phy-waveopt-polar-d02", "subtopic": "Malus's Law application", "topic_name": "Polarisation and Brewster's Law", "bloom_level": "apply", "options": [{"key": "A", "text": "I₀/2", "is_correct": false}, {"key": "B", "text": "I₀/4", "is_correct": false}, {"key": "C", "text": "I₀/8", "is_correct": true}, {"key": "D", "text": "I₀/16", "is_correct": false}], "elimination_hints": [{"option_key": "A", "hint": "I₀/2 is the intensity after the first polariser only. You still need to apply Malus's law at the analyser.", "misconception": "Forgetting the analyser"}, {"option_key": "B", "hint": "I₀/4 would be the answer if cos²(60°) = 1/2, but cos(60°) = 1/2 so cos²(60°) = 1/4.", "misconception": "Using cos instead of cos²"}, {"option_key": "D", "hint": "I₀/16 would require cos²θ = 1/8, which gives θ ≈ 69.3°, not 60°.", "misconception": null}], "image_uri": "diagrams/cuet-phy-waveopt-polar-d02.png", "image_alt": "Unpolarised light (I₀) → polariser (I₀/2) → analyser at 60° → transmitted intensity marked with question mark"}$json$::jsonb,
  NULL,
  $t$Unpolarised light (I₀) → polariser (I₀/2) → analyser at 60° → transmitted intensity marked with question mark$t$,
  'C',
  ARRAY['malus-law','polarisation','intensity'],
  'active',
  true,
  'correction-batch-3'
);

-- cuet-phy-waveopt-polar-ls01  (logical-sequence, medium)
INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  'cuet-phy-optics',
  'cuet-phy-opt-polarisation',
  ARRAY['CUET','NEET'],
  'logical-sequence',
  'medium',
  'just-started',
  $t$Unpolarised light of intensity I₀ passes through a polariser. The polarised light then passes through analysers at different angles. Arrange in order of increasing transmitted intensity:
(I) Analyser at 60° → I = I₀cos²60°/2 = I₀/8
(II) Analyser at 45° → I = I₀cos²45°/2 = I₀/4
(III) Analyser at 30° → I = I₀cos²30°/2 = 3I₀/8$t$,
  $t$After polariser, I₁ = I₀/2. Applying Malus's law: At 60°: I₀/8, at 45°: I₀/4, at 30°: 3I₀/8. Order of increasing intensity: I → II → III.$t$,
  $json${"question_id": "cuet-phy-waveopt-polar-ls01", "subtopic": "Malus's law intensity comparison", "topic_name": "Polarisation and Brewster's Law", "bloom_level": "analyze", "options": [{"key": "A", "text": "I → II → III", "is_correct": true}, {"key": "B", "text": "III → II → I", "is_correct": false}, {"key": "C", "text": "II → I → III", "is_correct": false}, {"key": "D", "text": "I → III → II", "is_correct": false}], "elimination_hints": [{"option_key": "B", "hint": "This is decreasing intensity order, not increasing.", "misconception": "Reversing the sequence"}, {"option_key": "C", "hint": "I₀/8 < I₀/4, so setup I comes before setup II.", "misconception": null}, {"option_key": "D", "hint": "3I₀/8 > I₀/4, so setup III has the highest intensity and must come last.", "misconception": null}]}$json$::jsonb,
  NULL,
  NULL,
  'A',
  ARRAY['malus-law-comparison','intensity-ordering'],
  'active',
  true,
  'correction-batch-3'
);

-- Total: 42 questions inserted
COMMIT;

