#!/usr/bin/env python3
"""
Batch 3 correction questions: 14 CUET Physics files x 3 questions = 42 total.
Chapters: EM Induction (2), EM Waves (1), Magnetic Effects (5), Optics (6)
Each file gets: 2 diagram-based + 1 logical-sequence
"""
import json, os, sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent / "CUET" / "physics"
DIAG_DIR = Path(__file__).resolve().parent / "diagrams"
DIAG_DIR.mkdir(exist_ok=True)

REPLACEMENT_QUESTIONS = {

# ──────────────────────────────────────────────────────────────────
# ELECTROMAGNETIC INDUCTION (remaining 2 files)
# ──────────────────────────────────────────────────────────────────
"phy-emi-faraday-copied.json": [
  {
    "id": "cuet-phy-emi-faraday-d01",
    "chapter_id": "cuet-phy-em-induction",
    "question_type": "diagram-based",
    "difficulty": "medium",
    "question_text": "The graph shows the variation of induced EMF with time when a bar magnet is dropped through a coil. Two peaks are observed — one positive and one negative. What does the second (negative) peak indicate?",
    "image_uri": "diagrams/cuet-phy-emi-faraday-d01.png",
    "image_alt": "EMF vs time graph showing positive peak as magnet enters coil, zero briefly, then negative peak as magnet exits",
    "explanation": "As the magnet enters the coil, the increasing flux induces a positive EMF. As it exits, the flux decreases in the opposite sense, inducing a negative EMF. The second peak is larger because the magnet accelerates under gravity.",
    "correct_answer": "B",
    "concept_tags": ["faraday-law", "lenz-law", "induced-emf"],
    "topic": "Faraday's Law and Lenz's Law",
    "subtopic": "EMF due to changing flux",
    "subject": "cuet-physics",
    "chapter": "Electromagnetic Induction",
    "bloom_level": "understand",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "The magnet has stopped inside the coil", "is_correct": False},
      {"key": "B", "text": "The magnet is exiting the coil, reversing the flux change direction", "is_correct": True},
      {"key": "C", "text": "The coil resistance has changed", "is_correct": False},
      {"key": "D", "text": "The magnet has reversed its polarity", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "If the magnet stopped, the flux would be constant and EMF would be zero, not negative.", "misconception": "Thinking stationary magnet produces EMF"},
      {"option_key": "C", "hint": "Coil resistance doesn't change during the experiment and doesn't cause polarity reversal.", "misconception": None},
      {"option_key": "D", "hint": "A permanent magnet cannot reverse its polarity spontaneously.", "misconception": None}
    ]
  },
  {
    "id": "cuet-phy-emi-faraday-d02",
    "chapter_id": "cuet-phy-em-induction",
    "question_type": "diagram-based",
    "difficulty": "hard",
    "question_text": "The diagram shows a rectangular loop of width l moving with velocity v into a region of uniform magnetic field B (perpendicular, into the page). What is the induced EMF when the loop is partially inside the field region?",
    "image_uri": "diagrams/cuet-phy-emi-faraday-d02.png",
    "image_alt": "Rectangular loop of width l moving with velocity v entering a region of uniform B field (into page). Only right side crosses boundary.",
    "explanation": "When the loop is partially inside, only the leading edge (length l) cuts field lines. The motional EMF = Blv. The trailing edge is still outside the field, so it contributes nothing.",
    "correct_answer": "C",
    "concept_tags": ["motional-emf", "flux-change", "rectangular-loop"],
    "topic": "Faraday's Law and Lenz's Law",
    "subtopic": "Motional EMF in changing flux region",
    "subject": "cuet-physics",
    "chapter": "Electromagnetic Induction",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "Zero", "is_correct": False},
      {"key": "B", "text": "2Blv", "is_correct": False},
      {"key": "C", "text": "Blv", "is_correct": True},
      {"key": "D", "text": "Blv/2", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "EMF is zero only when the entire loop is inside the field (flux not changing).", "misconception": "Thinking EMF is zero when partially inside"},
      {"option_key": "B", "hint": "2Blv would occur if both edges were crossing field boundaries, but only one edge is.", "misconception": "Counting both edges"},
      {"option_key": "D", "hint": "There is no factor of 1/2 in motional EMF = Blv.", "misconception": None}
    ]
  },
  {
    "id": "cuet-phy-emi-faraday-ls01",
    "chapter_id": "cuet-phy-em-induction",
    "question_type": "logical-sequence",
    "difficulty": "medium",
    "question_text": "Arrange the following steps in electromagnetic induction in the correct chronological order:\n(I) Change in magnetic flux through the coil\n(II) Relative motion between magnet and coil\n(III) Induced EMF appears across the coil\n(IV) Induced current flows in the closed circuit",
    "explanation": "First there must be relative motion (II), which causes a change in flux (I), which by Faraday's law produces an induced EMF (III), and if the circuit is closed, current flows (IV).",
    "correct_answer": "A",
    "concept_tags": ["electromagnetic-induction", "faraday-law", "induced-current"],
    "topic": "Faraday's Law and Lenz's Law",
    "subtopic": "Steps in electromagnetic induction",
    "subject": "cuet-physics",
    "chapter": "Electromagnetic Induction",
    "bloom_level": "understand",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "II → I → III → IV", "is_correct": True},
      {"key": "B", "text": "I → II → III → IV", "is_correct": False},
      {"key": "C", "text": "III → I → II → IV", "is_correct": False},
      {"key": "D", "text": "II → III → I → IV", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "Flux change doesn't happen on its own — relative motion must cause it first.", "misconception": "Thinking flux changes spontaneously"},
      {"option_key": "C", "hint": "EMF is the result of flux change, not the cause.", "misconception": "Reversing cause and effect"},
      {"option_key": "D", "hint": "EMF appears because of flux change, not before it.", "misconception": "EMF before flux change"}
    ]
  }
],

"phy-emi-inductance-copied.json": [
  {
    "id": "cuet-phy-emi-induct-d01",
    "chapter_id": "cuet-phy-em-induction",
    "question_type": "diagram-based",
    "difficulty": "medium",
    "question_text": "The graph shows the current growth in an LR circuit: I(t) = I₀(1 − e^(−t/τ)) where τ = L/R. At time t = L/R (one time constant), what fraction of the maximum current is reached?",
    "image_uri": "diagrams/cuet-phy-emi-induct-d01.png",
    "image_alt": "I vs t curve for LR circuit, current rises exponentially toward I₀, time constant τ=L/R marked",
    "explanation": "At t = τ = L/R: I = I₀(1 − e⁻¹) = I₀(1 − 0.368) = 0.632 I₀ = 63.2% of maximum current.",
    "correct_answer": "B",
    "concept_tags": ["LR-circuit", "time-constant", "current-growth"],
    "topic": "Self and Mutual Inductance",
    "subtopic": "LR circuit transient response",
    "subject": "cuet-physics",
    "chapter": "Electromagnetic Induction",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "50%", "is_correct": False},
      {"key": "B", "text": "63.2%", "is_correct": True},
      {"key": "C", "text": "37%", "is_correct": False},
      {"key": "D", "text": "100%", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "50% is reached at t = 0.693τ (= τ × ln2), not at t = τ.", "misconception": "Confusing half-life with time constant"},
      {"option_key": "C", "hint": "37% = e⁻¹ is the fraction remaining to reach, not the fraction already reached.", "misconception": "Using e⁻¹ instead of (1−e⁻¹)"},
      {"option_key": "D", "hint": "100% is only reached at t → ∞.", "misconception": None}
    ]
  },
  {
    "id": "cuet-phy-emi-induct-d02",
    "chapter_id": "cuet-phy-em-induction",
    "question_type": "diagram-based",
    "difficulty": "easy",
    "question_text": "The diagram shows two coils placed close together. The primary coil is connected to an AC source. If the mutual inductance between the coils is M and the current in the primary changes at rate dI/dt, what is the induced EMF in the secondary?",
    "image_uri": "diagrams/cuet-phy-emi-induct-d02.png",
    "image_alt": "Two coils: primary coil connected to AC source, secondary coil with galvanometer. Magnetic flux lines linking both coils.",
    "explanation": "By the definition of mutual inductance: EMF₂ = M × dI₁/dt. The mutual inductance M quantifies the flux linkage between the two coils.",
    "correct_answer": "A",
    "concept_tags": ["mutual-inductance", "induced-emf", "coupled-coils"],
    "topic": "Self and Mutual Inductance",
    "subtopic": "Mutual inductance between coils",
    "subject": "cuet-physics",
    "chapter": "Electromagnetic Induction",
    "bloom_level": "remember",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "M × dI/dt", "is_correct": True},
      {"key": "B", "text": "L × dI/dt", "is_correct": False},
      {"key": "C", "text": "M × I", "is_correct": False},
      {"key": "D", "text": "M / (dI/dt)", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "L × dI/dt gives self-induced EMF in the same coil, not the mutual EMF in the other coil.", "misconception": "Confusing self and mutual inductance"},
      {"option_key": "C", "hint": "EMF depends on rate of change of current, not the current itself.", "misconception": "Using I instead of dI/dt"},
      {"option_key": "D", "hint": "EMF is proportional to dI/dt, not inversely proportional.", "misconception": "Inverting the relationship"}
    ]
  },
  {
    "id": "cuet-phy-emi-induct-ls01",
    "chapter_id": "cuet-phy-em-induction",
    "question_type": "logical-sequence",
    "difficulty": "medium",
    "question_text": "Arrange the following inductors in order of increasing energy stored when carrying the same current I:\n(I) Inductor with inductance L\n(II) Inductor with inductance 2L\n(III) Inductor with inductance L/2",
    "explanation": "Energy stored U = ½LI². For same I: U ∝ L. So L/2 < L < 2L, giving order III → I → II.",
    "correct_answer": "A",
    "concept_tags": ["inductance", "energy-stored", "inductor"],
    "topic": "Self and Mutual Inductance",
    "subtopic": "Energy in an inductor",
    "subject": "cuet-physics",
    "chapter": "Electromagnetic Induction",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "III → I → II", "is_correct": True},
      {"key": "B", "text": "II → I → III", "is_correct": False},
      {"key": "C", "text": "I → II → III", "is_correct": False},
      {"key": "D", "text": "III → II → I", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "This is the order of decreasing energy.", "misconception": "Reversing the order"},
      {"option_key": "C", "hint": "L/2 stores less energy than L at same current.", "misconception": None},
      {"option_key": "D", "hint": "2L stores more energy than L, so II should come after I.", "misconception": None}
    ]
  }
],

# ──────────────────────────────────────────────────────────────────
# ELECTROMAGNETIC WAVES (1 file)
# ──────────────────────────────────────────────────────────────────
"phy-emwave-copied.json": [
  {
    "id": "cuet-phy-emwave-d01",
    "chapter_id": "cuet-phy-em-waves",
    "question_type": "diagram-based",
    "difficulty": "medium",
    "question_text": "The diagram shows the electromagnetic spectrum with wavelength ranges. Which type of radiation has wavelength between 1 nm and 400 nm?",
    "image_uri": "diagrams/cuet-phy-emwave-d01.png",
    "image_alt": "Electromagnetic spectrum from radio waves to gamma rays with wavelength ranges marked",
    "explanation": "Ultraviolet radiation has wavelengths from about 1 nm to 400 nm (between X-rays and visible light). Visible light spans 400-700 nm, X-rays are below 1 nm.",
    "correct_answer": "C",
    "concept_tags": ["em-spectrum", "wavelength-ranges", "ultraviolet"],
    "topic": "Electromagnetic Spectrum and Wave Properties",
    "subtopic": "EM spectrum wavelength ranges",
    "subject": "cuet-physics",
    "chapter": "Electromagnetic Waves",
    "bloom_level": "remember",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "Infrared", "is_correct": False},
      {"key": "B", "text": "X-rays", "is_correct": False},
      {"key": "C", "text": "Ultraviolet", "is_correct": True},
      {"key": "D", "text": "Microwaves", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "Infrared has wavelength 700 nm to 1 mm — much longer than 1-400 nm.", "misconception": "Confusing IR and UV ranges"},
      {"option_key": "B", "hint": "X-rays have wavelength 0.01-10 nm, mostly below 1 nm.", "misconception": None},
      {"option_key": "D", "hint": "Microwaves have wavelength 1 mm to 1 m — vastly longer.", "misconception": None}
    ]
  },
  {
    "id": "cuet-phy-emwave-d02",
    "chapter_id": "cuet-phy-em-waves",
    "question_type": "diagram-based",
    "difficulty": "easy",
    "question_text": "The diagram shows an electromagnetic wave with the electric field E oscillating along the y-axis and the magnetic field B oscillating along the z-axis. What is the direction of wave propagation?",
    "image_uri": "diagrams/cuet-phy-emwave-d02.png",
    "image_alt": "EM wave with E field oscillating along y-axis, B field along z-axis, wave propagating along x-axis",
    "explanation": "In an EM wave, E, B, and the direction of propagation are mutually perpendicular (right-hand rule). E × B gives the direction of propagation. If E is along y and B is along z, then E × B = y × z = x. The wave propagates along the x-axis.",
    "correct_answer": "A",
    "concept_tags": ["em-wave", "polarization", "propagation-direction"],
    "topic": "Electromagnetic Spectrum and Wave Properties",
    "subtopic": "EM wave propagation",
    "subject": "cuet-physics",
    "chapter": "Electromagnetic Waves",
    "bloom_level": "understand",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "Along x-axis (E × B direction)", "is_correct": True},
      {"key": "B", "text": "Along y-axis", "is_correct": False},
      {"key": "C", "text": "Along z-axis", "is_correct": False},
      {"key": "D", "text": "Along negative x-axis", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "The y-axis is the direction of E oscillation, not propagation.", "misconception": "Confusing E direction with propagation"},
      {"option_key": "C", "hint": "The z-axis is the direction of B oscillation, not propagation.", "misconception": "Confusing B direction with propagation"},
      {"option_key": "D", "hint": "Using right-hand rule: y × z = +x, not −x.", "misconception": "Error in cross product direction"}
    ]
  },
  {
    "id": "cuet-phy-emwave-ls01",
    "chapter_id": "cuet-phy-em-waves",
    "question_type": "logical-sequence",
    "difficulty": "medium",
    "question_text": "Arrange the following electromagnetic waves in order of increasing frequency:\n(I) Microwaves\n(II) X-rays\n(III) Visible light\n(IV) Infrared",
    "explanation": "Frequency order: Microwaves (~10⁹-10¹² Hz) < Infrared (~10¹²-4×10¹⁴ Hz) < Visible (~4×10¹⁴-7.5×10¹⁴ Hz) < X-rays (~10¹⁶-10¹⁹ Hz). So I → IV → III → II.",
    "correct_answer": "A",
    "concept_tags": ["em-spectrum", "frequency-order", "wave-classification"],
    "topic": "Electromagnetic Spectrum and Wave Properties",
    "subtopic": "EM wave frequency ordering",
    "subject": "cuet-physics",
    "chapter": "Electromagnetic Waves",
    "bloom_level": "remember",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "I → IV → III → II", "is_correct": True},
      {"key": "B", "text": "II → III → IV → I", "is_correct": False},
      {"key": "C", "text": "I → III → IV → II", "is_correct": False},
      {"key": "D", "text": "IV → I → III → II", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "This is the order of decreasing frequency.", "misconception": "Reversing the order"},
      {"option_key": "C", "hint": "Infrared has lower frequency than visible light — IV comes before III.", "misconception": "Placing visible before infrared"},
      {"option_key": "D", "hint": "Microwaves have lower frequency than infrared.", "misconception": None}
    ]
  }
],

# ──────────────────────────────────────────────────────────────────
# MAGNETIC EFFECTS (5 files)
# ──────────────────────────────────────────────────────────────────
"phy-magmov-biot-copied.json": [
  {
    "id": "cuet-phy-mag-biot-d01",
    "chapter_id": "cuet-phy-magnetic-effects",
    "question_type": "diagram-based",
    "difficulty": "medium",
    "question_text": "The diagram shows a circular loop bent into two semicircles of the same radius R, carrying current such that the currents in the two halves flow in opposite directions. What is the net magnetic field at the centre?",
    "image_uri": "diagrams/cuet-phy-mag-biot-d01.png",
    "image_alt": "Two semicircular loops of same radius connected, carrying current in opposite sense, B vectors at center pointing in opposite directions cancel",
    "explanation": "Each semicircle produces B = μ₀I/(4R) at the centre, but in opposite directions (one into page, one out). They cancel: B_net = 0.",
    "correct_answer": "B",
    "concept_tags": ["biot-savart", "semicircular-loop", "superposition"],
    "topic": "Biot-Savart Law and Ampere's Law",
    "subtopic": "Magnetic field of semicircular loops",
    "subject": "cuet-physics",
    "chapter": "Magnetic Effects of Current",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "μ₀I/(2R)", "is_correct": False},
      {"key": "B", "text": "Zero", "is_correct": True},
      {"key": "C", "text": "μ₀I/(4R)", "is_correct": False},
      {"key": "D", "text": "2μ₀I/(4R)", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "μ₀I/(2R) is the field of a full circular loop. Here the two halves oppose each other.", "misconception": "Treating as a complete loop"},
      {"option_key": "C", "hint": "μ₀I/(4R) is from one semicircle only. The other cancels it.", "misconception": "Counting only one semicircle"},
      {"option_key": "D", "hint": "The fields add only if currents flow in the same direction, not opposite.", "misconception": "Adding instead of subtracting"}
    ]
  },
  {
    "id": "cuet-phy-mag-biot-d02",
    "chapter_id": "cuet-phy-magnetic-effects",
    "question_type": "diagram-based",
    "difficulty": "hard",
    "question_text": "The graph shows B vs r for a long straight wire carrying current I = 10 A. Using B = μ₀I/(2πr), what is the magnetic field at a distance of 2 cm from the wire?",
    "image_uri": "diagrams/cuet-phy-mag-biot-d02.png",
    "image_alt": "B vs r graph: hyperbolic curve showing B = μ₀I/(2πr). Wire at r=0, B decreasing with distance",
    "explanation": "B = μ₀I/(2πr) = (4π×10⁻⁷ × 10)/(2π × 0.02) = (4π×10⁻⁶)/(0.04π) = 10⁻⁴ T = 1×10⁻⁴ T.",
    "correct_answer": "C",
    "concept_tags": ["biot-savart", "straight-wire", "magnetic-field-calculation"],
    "topic": "Biot-Savart Law and Ampere's Law",
    "subtopic": "B field of a long straight wire",
    "subject": "cuet-physics",
    "chapter": "Magnetic Effects of Current",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "2×10⁻⁵ T", "is_correct": False},
      {"key": "B", "text": "5×10⁻⁵ T", "is_correct": False},
      {"key": "C", "text": "1×10⁻⁴ T", "is_correct": True},
      {"key": "D", "text": "2×10⁻⁴ T", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "2×10⁻⁵ T would be the field at r = 10 cm, not 2 cm.", "misconception": "Using wrong distance"},
      {"option_key": "B", "hint": "5×10⁻⁵ T = field at r = 4 cm. Check your distance value.", "misconception": None},
      {"option_key": "D", "hint": "2×10⁻⁴ T would be the field at r = 1 cm.", "misconception": "Using r = 1 cm instead of 2 cm"}
    ]
  },
  {
    "id": "cuet-phy-mag-biot-ls01",
    "chapter_id": "cuet-phy-magnetic-effects",
    "question_type": "logical-sequence",
    "difficulty": "medium",
    "question_text": "Arrange the following circular loops in order of increasing magnetic field at the centre, all carrying the same current I:\n(I) Loop of radius R\n(II) Loop of radius 2R\n(III) Loop of radius R/2",
    "explanation": "B at centre = μ₀I/(2r). So B ∝ 1/r. Larger radius → smaller B. Order: 2R(smallest B) < R < R/2(largest B). So II → I → III.",
    "correct_answer": "A",
    "concept_tags": ["circular-loop", "magnetic-field", "radius-dependence"],
    "topic": "Biot-Savart Law and Ampere's Law",
    "subtopic": "B field at centre of circular loop",
    "subject": "cuet-physics",
    "chapter": "Magnetic Effects of Current",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "II → I → III", "is_correct": True},
      {"key": "B", "text": "III → I → II", "is_correct": False},
      {"key": "C", "text": "I → II → III", "is_correct": False},
      {"key": "D", "text": "II → III → I", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "This is the order of decreasing B.", "misconception": "Reversing the order"},
      {"option_key": "C", "hint": "Loop of radius 2R has weaker B than radius R (B ∝ 1/r).", "misconception": None},
      {"option_key": "D", "hint": "R/2 gives the strongest B, so III should be last.", "misconception": None}
    ]
  }
],

"phy-magmov-force-copied.json": [
  {
    "id": "cuet-phy-mag-force-d01",
    "chapter_id": "cuet-phy-magnetic-effects",
    "question_type": "diagram-based",
    "difficulty": "medium",
    "question_text": "The diagram shows a proton entering a uniform magnetic field B (perpendicular to its velocity, into the page). It follows a circular path of radius r. If the speed of the proton is doubled, what is the new radius?",
    "image_uri": "diagrams/cuet-phy-mag-force-d01.png",
    "image_alt": "Proton entering uniform B field (into page) perpendicular to velocity, following circular path of radius r",
    "explanation": "For circular motion in B field: r = mv/(qB). If v → 2v, then r → 2mv/(qB) = 2r. The radius doubles.",
    "correct_answer": "D",
    "concept_tags": ["lorentz-force", "circular-motion", "radius"],
    "topic": "Lorentz Force and Motion in Magnetic Field",
    "subtopic": "Circular motion of charged particle in B field",
    "subject": "cuet-physics",
    "chapter": "Magnetic Effects of Current",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "r/2", "is_correct": False},
      {"key": "B", "text": "r", "is_correct": False},
      {"key": "C", "text": "4r", "is_correct": False},
      {"key": "D", "text": "2r", "is_correct": True}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "r/2 would mean radius halved. Since r ∝ v, doubling v doubles r.", "misconception": "Thinking r ∝ 1/v"},
      {"option_key": "B", "hint": "Radius r depends on velocity. If v changes, r must change too.", "misconception": "Thinking radius is independent of speed"},
      {"option_key": "C", "hint": "4r would mean r ∝ v². But r = mv/(qB), so r ∝ v (linear).", "misconception": "Using v² instead of v"}
    ]
  },
  {
    "id": "cuet-phy-mag-force-d02",
    "chapter_id": "cuet-phy-magnetic-effects",
    "question_type": "diagram-based",
    "difficulty": "easy",
    "question_text": "The diagram shows two long parallel wires carrying currents I₁ and I₂ in the same direction. What is the nature of the force between them?",
    "image_uri": "diagrams/cuet-phy-mag-force-d02.png",
    "image_alt": "Two parallel wires with currents I₁ and I₂ in same direction (upward), force arrows pointing toward each other",
    "explanation": "Two parallel wires carrying currents in the same direction attract each other. The magnetic field of one wire exerts a force on the current in the other, directed toward the first wire.",
    "correct_answer": "A",
    "concept_tags": ["parallel-wires", "force", "same-direction"],
    "topic": "Lorentz Force and Motion in Magnetic Field",
    "subtopic": "Force between parallel current-carrying wires",
    "subject": "cuet-physics",
    "chapter": "Magnetic Effects of Current",
    "bloom_level": "remember",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "Attractive", "is_correct": True},
      {"key": "B", "text": "Repulsive", "is_correct": False},
      {"key": "C", "text": "Zero", "is_correct": False},
      {"key": "D", "text": "Depends on the magnitude of currents", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "Repulsive force occurs when currents are in opposite directions.", "misconception": "Confusing same and opposite direction cases"},
      {"option_key": "C", "hint": "Two current-carrying wires always exert force on each other.", "misconception": None},
      {"option_key": "D", "hint": "The nature (attractive/repulsive) depends on direction, not magnitude.", "misconception": None}
    ]
  },
  {
    "id": "cuet-phy-mag-force-ls01",
    "chapter_id": "cuet-phy-magnetic-effects",
    "question_type": "logical-sequence",
    "difficulty": "medium",
    "question_text": "Arrange the following in order of increasing force on a 1 m conductor carrying 5 A in a uniform field B = 0.2 T at different angles θ to the field:\n(I) θ = 0°\n(II) θ = 30°\n(III) θ = 60°\n(IV) θ = 90°",
    "explanation": "F = BIl sinθ. F(0°) = 0, F(30°) = 0.5 N, F(60°) = 0.866 N, F(90°) = 1.0 N. Order: I → II → III → IV.",
    "correct_answer": "A",
    "concept_tags": ["force-on-conductor", "angle-dependence", "magnetic-force"],
    "topic": "Lorentz Force and Motion in Magnetic Field",
    "subtopic": "Force on current-carrying conductor",
    "subject": "cuet-physics",
    "chapter": "Magnetic Effects of Current",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "I → II → III → IV", "is_correct": True},
      {"key": "B", "text": "IV → III → II → I", "is_correct": False},
      {"key": "C", "text": "I → III → II → IV", "is_correct": False},
      {"key": "D", "text": "II → I → III → IV", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "This is the order of decreasing force.", "misconception": "Reversing the order"},
      {"option_key": "C", "hint": "sin 30° = 0.5 < sin 60° = 0.866, so II comes before III.", "misconception": "Wrong sine values"},
      {"option_key": "D", "hint": "At θ = 0°, F = 0 (minimum). I should come first.", "misconception": "Thinking force is non-zero at 0°"}
    ]
  }
],

"phy-magmov-devices-copied.json": [
  {
    "id": "cuet-phy-mag-device-d01",
    "chapter_id": "cuet-phy-magnetic-effects",
    "question_type": "diagram-based",
    "difficulty": "medium",
    "question_text": "The diagram shows a moving coil galvanometer with N turns, area A, magnetic field B, and spring constant k. What is the current sensitivity (deflection per unit current)?",
    "image_uri": "diagrams/cuet-phy-mag-device-d01.png",
    "image_alt": "Moving coil galvanometer: rectangular coil between magnet poles, spring providing restoring torque, scale with pointer",
    "explanation": "At equilibrium: torque = restoring force, NIAB = kθ. Current sensitivity = θ/I = NAB/k.",
    "correct_answer": "B",
    "concept_tags": ["galvanometer", "current-sensitivity", "torque-balance"],
    "topic": "Galvanometer, Ammeter, Voltmeter, Cyclotron",
    "subtopic": "Moving coil galvanometer sensitivity",
    "subject": "cuet-physics",
    "chapter": "Magnetic Effects of Current",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "NAB", "is_correct": False},
      {"key": "B", "text": "NAB/k", "is_correct": True},
      {"key": "C", "text": "k/(NAB)", "is_correct": False},
      {"key": "D", "text": "NB/(Ak)", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "NAB gives the torque per unit current, not the deflection per unit current (need to divide by k).", "misconception": "Forgetting the spring constant"},
      {"option_key": "C", "hint": "k/(NAB) is the reciprocal — higher k means less sensitivity, not more.", "misconception": "Inverting the formula"},
      {"option_key": "D", "hint": "A should be in the numerator (larger area = more torque = more sensitivity).", "misconception": None}
    ]
  },
  {
    "id": "cuet-phy-mag-device-d02",
    "chapter_id": "cuet-phy-magnetic-effects",
    "question_type": "diagram-based",
    "difficulty": "easy",
    "question_text": "The diagram shows a cyclotron with two D-shaped electrodes (dees) in a magnetic field B. A proton of mass m and charge q spirals outward. What is the cyclotron frequency?",
    "image_uri": "diagrams/cuet-phy-mag-device-d02.png",
    "image_alt": "Cyclotron top view: two D-shaped electrodes (dees), magnetic field B perpendicular to plane, proton spiraling outward",
    "explanation": "The cyclotron frequency f = qB/(2πm). This is independent of the radius and speed of the particle — a key feature that makes the cyclotron work.",
    "correct_answer": "C",
    "concept_tags": ["cyclotron", "frequency", "charged-particle"],
    "topic": "Galvanometer, Ammeter, Voltmeter, Cyclotron",
    "subtopic": "Cyclotron frequency",
    "subject": "cuet-physics",
    "chapter": "Magnetic Effects of Current",
    "bloom_level": "remember",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "qB/m", "is_correct": False},
      {"key": "B", "text": "2πm/(qB)", "is_correct": False},
      {"key": "C", "text": "qB/(2πm)", "is_correct": True},
      {"key": "D", "text": "qBr/m", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "qB/m = ω (angular frequency). The cyclotron frequency f = ω/(2π).", "misconception": "Confusing angular frequency with frequency"},
      {"option_key": "B", "hint": "2πm/(qB) = 1/f = T (the time period), not the frequency.", "misconception": "Giving time period instead of frequency"},
      {"option_key": "D", "hint": "Cyclotron frequency is independent of radius r.", "misconception": "Including radius in frequency"}
    ]
  },
  {
    "id": "cuet-phy-mag-device-ls01",
    "chapter_id": "cuet-phy-magnetic-effects",
    "question_type": "logical-sequence",
    "difficulty": "medium",
    "question_text": "Arrange the following in order of increasing total resistance for converting a galvanometer (resistance G) to the specified instrument:\n(I) Ammeter (0-1 A)\n(II) Ammeter (0-10 A)\n(III) Voltmeter (0-10 V)",
    "explanation": "Ammeter uses low shunt resistance S = GIg/(I-Ig). Larger range → smaller S. So 0-10A ammeter has smallest total R. 0-1A ammeter has slightly larger R. Voltmeter uses high series resistance R_total >> G. Order: II → I → III.",
    "correct_answer": "A",
    "concept_tags": ["ammeter", "voltmeter", "galvanometer-conversion"],
    "topic": "Galvanometer, Ammeter, Voltmeter, Cyclotron",
    "subtopic": "Galvanometer conversion",
    "subject": "cuet-physics",
    "chapter": "Magnetic Effects of Current",
    "bloom_level": "analyze",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "II → I → III", "is_correct": True},
      {"key": "B", "text": "III → I → II", "is_correct": False},
      {"key": "C", "text": "I → II → III", "is_correct": False},
      {"key": "D", "text": "II → III → I", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "Voltmeter has the highest resistance (series R), not the lowest.", "misconception": "Reversing ammeter and voltmeter resistance"},
      {"option_key": "C", "hint": "Higher range ammeter needs smaller shunt, giving lower total resistance.", "misconception": None},
      {"option_key": "D", "hint": "Voltmeter resistance is much higher than any ammeter.", "misconception": None}
    ]
  }
],

"phy-magmat-dipole-copied.json": [
  {
    "id": "cuet-phy-mag-dipole-d01",
    "chapter_id": "cuet-phy-magnetic-effects",
    "question_type": "diagram-based",
    "difficulty": "medium",
    "question_text": "The diagram shows a magnetic dipole of moment M placed in a uniform magnetic field B at angle θ. The torque τ = MB sinθ. For what value of θ is the torque maximum?",
    "image_uri": "diagrams/cuet-phy-mag-dipole-d01.png",
    "image_alt": "Bar magnet (magnetic moment M) at angle θ to uniform magnetic field B, torque τ rotating it toward field direction",
    "explanation": "τ = MB sinθ. Maximum when sinθ = 1, i.e., θ = 90°. At this angle, the dipole is perpendicular to the field.",
    "correct_answer": "D",
    "concept_tags": ["magnetic-dipole", "torque", "uniform-field"],
    "topic": "Magnetic Dipole and Torque",
    "subtopic": "Torque on magnetic dipole",
    "subject": "cuet-physics",
    "chapter": "Magnetism and Matter",
    "bloom_level": "understand",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "0°", "is_correct": False},
      {"key": "B", "text": "45°", "is_correct": False},
      {"key": "C", "text": "180°", "is_correct": False},
      {"key": "D", "text": "90°", "is_correct": True}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "At 0°, sinθ = 0, so τ = 0. This is the equilibrium position.", "misconception": "Confusing stable equilibrium with maximum torque"},
      {"option_key": "B", "hint": "At 45°, sin 45° = 0.707 — not the maximum value of sine.", "misconception": None},
      {"option_key": "C", "hint": "At 180°, sin 180° = 0, so τ = 0. This is unstable equilibrium.", "misconception": "Confusing unstable equilibrium with maximum torque"}
    ]
  },
  {
    "id": "cuet-phy-mag-dipole-d02",
    "chapter_id": "cuet-phy-magnetic-effects",
    "question_type": "diagram-based",
    "difficulty": "easy",
    "question_text": "The diagram shows the magnetic field lines of a bar magnet. Where is the magnetic field strongest?",
    "image_uri": "diagrams/cuet-phy-mag-dipole-d02.png",
    "image_alt": "Bar magnet with N and S poles, field lines emerging from N, curving around, entering S. Lines densest near poles.",
    "explanation": "Magnetic field strength is proportional to the density of field lines. Near the poles, field lines are most closely packed, indicating the strongest field.",
    "correct_answer": "A",
    "concept_tags": ["magnetic-field-lines", "bar-magnet", "poles"],
    "topic": "Magnetic Dipole and Torque",
    "subtopic": "Magnetic field of a bar magnet",
    "subject": "cuet-physics",
    "chapter": "Magnetism and Matter",
    "bloom_level": "remember",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "At the poles", "is_correct": True},
      {"key": "B", "text": "At the centre of the magnet", "is_correct": False},
      {"key": "C", "text": "Midway between N and S outside the magnet", "is_correct": False},
      {"key": "D", "text": "Field is uniform everywhere", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "Inside the magnet at the centre, the field exists but is not the strongest point externally.", "misconception": None},
      {"option_key": "C", "hint": "The field lines are more spread out far from the poles — weaker field.", "misconception": None},
      {"option_key": "D", "hint": "A bar magnet's field is non-uniform — it varies with position.", "misconception": "Assuming uniform field"}
    ]
  },
  {
    "id": "cuet-phy-mag-dipole-ls01",
    "chapter_id": "cuet-phy-magnetic-effects",
    "question_type": "logical-sequence",
    "difficulty": "medium",
    "question_text": "Arrange the following positions of a magnetic dipole M in uniform field B in order of increasing potential energy:\n(I) θ = 0° (aligned with B)\n(II) θ = 90° (perpendicular to B)\n(III) θ = 180° (anti-aligned with B)",
    "explanation": "U = −MB cosθ. U(0°) = −MB (minimum), U(90°) = 0, U(180°) = +MB (maximum). Order: I → II → III.",
    "correct_answer": "A",
    "concept_tags": ["potential-energy", "magnetic-dipole", "orientation"],
    "topic": "Magnetic Dipole and Torque",
    "subtopic": "Potential energy of dipole in field",
    "subject": "cuet-physics",
    "chapter": "Magnetism and Matter",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "I → II → III", "is_correct": True},
      {"key": "B", "text": "III → II → I", "is_correct": False},
      {"key": "C", "text": "II → I → III", "is_correct": False},
      {"key": "D", "text": "I → III → II", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "This is the order of decreasing potential energy.", "misconception": "Reversing the order"},
      {"option_key": "C", "hint": "U(0°) = −MB is less than U(90°) = 0, so I comes before II.", "misconception": None},
      {"option_key": "D", "hint": "U(180°) = +MB > U(90°) = 0, so III comes after II.", "misconception": None}
    ]
  }
],

"phy-magmat-materials-copied.json": [
  {
    "id": "cuet-phy-mag-mat-d01",
    "chapter_id": "cuet-phy-magnetic-effects",
    "question_type": "diagram-based",
    "difficulty": "medium",
    "question_text": "The diagram shows the B-H hysteresis curve for a ferromagnetic material. What does the area enclosed by the hysteresis loop represent?",
    "image_uri": "diagrams/cuet-phy-mag-mat-d01.png",
    "image_alt": "B-H hysteresis curve: S-shaped loop showing B vs H for ferromagnetic material, with retentivity Br and coercivity Hc marked",
    "explanation": "The area of the hysteresis loop represents the energy dissipated as heat per unit volume per magnetization cycle. Materials with larger loops (hard magnets) dissipate more energy.",
    "correct_answer": "B",
    "concept_tags": ["hysteresis", "energy-loss", "ferromagnetic"],
    "topic": "Dia-, Para-, and Ferromagnetic Materials",
    "subtopic": "Hysteresis loop and energy loss",
    "subject": "cuet-physics",
    "chapter": "Magnetism and Matter",
    "bloom_level": "understand",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "The magnetic susceptibility of the material", "is_correct": False},
      {"key": "B", "text": "Energy dissipated per cycle per unit volume", "is_correct": True},
      {"key": "C", "text": "The retentivity of the material", "is_correct": False},
      {"key": "D", "text": "The coercivity of the material", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "Susceptibility is the slope of the B-H curve, not the area.", "misconception": "Confusing slope with area"},
      {"option_key": "C", "hint": "Retentivity is the y-intercept (B when H=0), a single point, not the area.", "misconception": None},
      {"option_key": "D", "hint": "Coercivity is the x-intercept (H when B=0), a single point, not the area.", "misconception": None}
    ]
  },
  {
    "id": "cuet-phy-mag-mat-d02",
    "chapter_id": "cuet-phy-magnetic-effects",
    "question_type": "diagram-based",
    "difficulty": "hard",
    "question_text": "The graph shows the variation of magnetic susceptibility (χ) with temperature (T) for a paramagnetic material. According to Curie's law, χ is proportional to:",
    "image_uri": "diagrams/cuet-phy-mag-mat-d02.png",
    "image_alt": "χ vs T graph: hyperbolic decrease showing χ ∝ 1/T (Curie's law) for paramagnetic material. χ approaches zero at high T.",
    "explanation": "Curie's law: χ = C/T, where C is the Curie constant. So χ ∝ 1/T. As temperature increases, thermal agitation randomizes magnetic moments, reducing susceptibility.",
    "correct_answer": "A",
    "concept_tags": ["curie-law", "susceptibility", "paramagnetic"],
    "topic": "Dia-, Para-, and Ferromagnetic Materials",
    "subtopic": "Temperature dependence of susceptibility",
    "subject": "cuet-physics",
    "chapter": "Magnetism and Matter",
    "bloom_level": "understand",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "1/T", "is_correct": True},
      {"key": "B", "text": "T", "is_correct": False},
      {"key": "C", "text": "T²", "is_correct": False},
      {"key": "D", "text": "Independent of T", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "χ ∝ T would mean susceptibility increases with temperature — opposite of Curie's law.", "misconception": "Inverting the relationship"},
      {"option_key": "C", "hint": "There is no T² dependence in Curie's law.", "misconception": None},
      {"option_key": "D", "hint": "Diamagnetic susceptibility is roughly independent of T, but paramagnetic follows Curie's law.", "misconception": "Confusing para with diamagnetic"}
    ]
  },
  {
    "id": "cuet-phy-mag-mat-ls01",
    "chapter_id": "cuet-phy-magnetic-effects",
    "question_type": "logical-sequence",
    "difficulty": "easy",
    "question_text": "Arrange the following materials in order of increasing magnetic susceptibility:\n(I) Diamagnetic (copper)\n(II) Paramagnetic (aluminium)\n(III) Ferromagnetic (iron)",
    "explanation": "Diamagnetic: χ ≈ −10⁻⁵ (small, negative). Paramagnetic: χ ≈ +10⁻⁵ to +10⁻³ (small, positive). Ferromagnetic: χ ≈ +10³ to +10⁵ (very large, positive). Order: I → II → III.",
    "correct_answer": "A",
    "concept_tags": ["susceptibility", "magnetic-materials", "classification"],
    "topic": "Dia-, Para-, and Ferromagnetic Materials",
    "subtopic": "Comparison of magnetic materials",
    "subject": "cuet-physics",
    "chapter": "Magnetism and Matter",
    "bloom_level": "remember",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "I → II → III", "is_correct": True},
      {"key": "B", "text": "III → II → I", "is_correct": False},
      {"key": "C", "text": "II → I → III", "is_correct": False},
      {"key": "D", "text": "I → III → II", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "This is the order of decreasing susceptibility.", "misconception": "Reversing the order"},
      {"option_key": "C", "hint": "Diamagnetic has negative χ, the smallest value.", "misconception": None},
      {"option_key": "D", "hint": "Ferromagnetic has the highest χ by far (thousands).", "misconception": None}
    ]
  }
],

# ──────────────────────────────────────────────────────────────────
# OPTICS (6 files)
# ──────────────────────────────────────────────────────────────────
"phy-ray-reflection-copied.json": [
  {
    "id": "cuet-phy-ray-reflect-d01",
    "chapter_id": "cuet-phy-optics",
    "question_type": "diagram-based",
    "difficulty": "medium",
    "question_text": "The ray diagram shows an object placed between the focus (F) and centre of curvature (C) of a concave mirror. The image formed is:",
    "image_uri": "diagrams/cuet-phy-ray-reflect-d01.png",
    "image_alt": "Concave mirror with center of curvature C and focus F. Object between F and C. Two rays drawn forming real, inverted, magnified image beyond C.",
    "explanation": "When the object is between F and C, the image is formed beyond C. It is real (on the same side as object), inverted, and magnified (larger than object).",
    "correct_answer": "C",
    "concept_tags": ["concave-mirror", "image-formation", "ray-diagram"],
    "topic": "Reflection at Curved Surfaces and Mirror Formula",
    "subtopic": "Image formation by concave mirror",
    "subject": "cuet-physics",
    "chapter": "Ray Optics",
    "bloom_level": "understand",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "Virtual, erect, magnified", "is_correct": False},
      {"key": "B", "text": "Real, inverted, diminished", "is_correct": False},
      {"key": "C", "text": "Real, inverted, magnified", "is_correct": True},
      {"key": "D", "text": "Real, inverted, same size", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "Virtual, erect image is formed only when object is between F and pole.", "misconception": "Wrong object position"},
      {"option_key": "B", "hint": "Diminished image is formed when object is beyond C.", "misconception": "Confusing 'between F and C' with 'beyond C'"},
      {"option_key": "D", "hint": "Same size image is formed when object is at C.", "misconception": "Confusing 'between F and C' with 'at C'"}
    ]
  },
  {
    "id": "cuet-phy-ray-reflect-d02",
    "chapter_id": "cuet-phy-optics",
    "question_type": "diagram-based",
    "difficulty": "easy",
    "question_text": "The graph shows 1/v vs 1/u for a concave mirror, which is a straight line. What is its slope?",
    "image_uri": "diagrams/cuet-phy-ray-reflect-d02.png",
    "image_alt": "Graph of 1/v vs 1/u: straight line with slope −1, y-intercept = 1/f",
    "explanation": "Mirror formula: 1/v + 1/u = 1/f. Rearranging: 1/v = −(1/u) + 1/f. Comparing with y = mx + c: slope m = −1.",
    "correct_answer": "B",
    "concept_tags": ["mirror-formula", "graphical-analysis", "concave-mirror"],
    "topic": "Reflection at Curved Surfaces and Mirror Formula",
    "subtopic": "Mirror formula graphical representation",
    "subject": "cuet-physics",
    "chapter": "Ray Optics",
    "bloom_level": "understand",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "+1", "is_correct": False},
      {"key": "B", "text": "−1", "is_correct": True},
      {"key": "C", "text": "1/f", "is_correct": False},
      {"key": "D", "text": "−1/f", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "The coefficient of 1/u is −1, not +1.", "misconception": "Sign error in rearrangement"},
      {"option_key": "C", "hint": "1/f is the y-intercept, not the slope.", "misconception": "Confusing slope with intercept"},
      {"option_key": "D", "hint": "−1/f is neither the slope nor the intercept in this form.", "misconception": None}
    ]
  },
  {
    "id": "cuet-phy-ray-reflect-ls01",
    "chapter_id": "cuet-phy-optics",
    "question_type": "logical-sequence",
    "difficulty": "medium",
    "question_text": "Arrange the following object positions for a concave mirror in order of increasing image size:\n(I) Object at infinity\n(II) Object at C\n(III) Object between F and C\n(IV) Object at F",
    "explanation": "At infinity: image at F, point-sized. At C: image at C, same size. Between F and C: image beyond C, magnified. At F: image at infinity, infinitely large. Order: I → II → III → IV.",
    "correct_answer": "A",
    "concept_tags": ["concave-mirror", "image-size", "object-position"],
    "topic": "Reflection at Curved Surfaces and Mirror Formula",
    "subtopic": "Image size variation with object position",
    "subject": "cuet-physics",
    "chapter": "Ray Optics",
    "bloom_level": "analyze",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "I → II → III → IV", "is_correct": True},
      {"key": "B", "text": "IV → III → II → I", "is_correct": False},
      {"key": "C", "text": "I → III → II → IV", "is_correct": False},
      {"key": "D", "text": "II → I → III → IV", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "This is the order of decreasing image size.", "misconception": "Reversing the order"},
      {"option_key": "C", "hint": "At C, image is same size (m=1). Between F and C, image is magnified (m>1).", "misconception": None},
      {"option_key": "D", "hint": "At infinity, image is point-sized (smallest), not after C.", "misconception": None}
    ]
  }
],

"phy-ray-prism-copied.json": [
  {
    "id": "cuet-phy-ray-prism-d01",
    "chapter_id": "cuet-phy-optics",
    "question_type": "diagram-based",
    "difficulty": "medium",
    "question_text": "The diagram shows light passing through a prism of angle A = 60° at minimum deviation δ_min = 30°. At minimum deviation, i = e. What is the refractive index of the prism?",
    "image_uri": "diagrams/cuet-phy-ray-prism-d01.png",
    "image_alt": "Prism of angle A=60°, light ray entering and exiting symmetrically at minimum deviation δ=30°, i=e",
    "explanation": "At minimum deviation: μ = sin((A + δ_min)/2) / sin(A/2) = sin((60°+30°)/2) / sin(60°/2) = sin(45°)/sin(30°) = (√2/2)/(1/2) = √2 ≈ 1.414.",
    "correct_answer": "B",
    "concept_tags": ["prism", "minimum-deviation", "refractive-index"],
    "topic": "Refraction through Prism and Dispersion",
    "subtopic": "Prism formula at minimum deviation",
    "subject": "cuet-physics",
    "chapter": "Ray Optics",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "1.5", "is_correct": False},
      {"key": "B", "text": "√2 ≈ 1.414", "is_correct": True},
      {"key": "C", "text": "√3 ≈ 1.732", "is_correct": False},
      {"key": "D", "text": "2", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "1.5 = sin(45°)/sin(30°) only if you use sin(45°) = 0.75, but sin(45°) = 0.707.", "misconception": None},
      {"option_key": "C", "hint": "√3 would require sin((A+δ)/2)/sin(A/2) = sin(60°)/sin(30°). Check your angles.", "misconception": "Using wrong angles in formula"},
      {"option_key": "D", "hint": "μ = 2 is very high for glass. sin(45°)/sin(30°) ≠ 2.", "misconception": None}
    ]
  },
  {
    "id": "cuet-phy-ray-prism-d02",
    "chapter_id": "cuet-phy-optics",
    "question_type": "diagram-based",
    "difficulty": "easy",
    "question_text": "The diagram shows white light being dispersed by a glass prism into the visible spectrum. Which colour deviates the most?",
    "image_uri": "diagrams/cuet-phy-ray-prism-d02.png",
    "image_alt": "White light entering prism, dispersed into spectrum VIBGYOR. Violet bent most, red bent least.",
    "explanation": "Violet light has the shortest wavelength and highest refractive index in glass, so it deviates the most. Red has the longest wavelength and deviates the least.",
    "correct_answer": "D",
    "concept_tags": ["dispersion", "prism", "deviation"],
    "topic": "Refraction through Prism and Dispersion",
    "subtopic": "Dispersion of white light",
    "subject": "cuet-physics",
    "chapter": "Ray Optics",
    "bloom_level": "remember",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "Red", "is_correct": False},
      {"key": "B", "text": "Green", "is_correct": False},
      {"key": "C", "text": "Yellow", "is_correct": False},
      {"key": "D", "text": "Violet", "is_correct": True}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "Red has the longest wavelength and deviates the LEAST.", "misconception": "Confusing most with least deviation"},
      {"option_key": "B", "hint": "Green is in the middle of the spectrum — moderate deviation.", "misconception": None},
      {"option_key": "C", "hint": "Yellow is also intermediate. Shortest wavelength = most deviation.", "misconception": None}
    ]
  },
  {
    "id": "cuet-phy-ray-prism-ls01",
    "chapter_id": "cuet-phy-optics",
    "question_type": "logical-sequence",
    "difficulty": "easy",
    "question_text": "Arrange the following colours of visible light in order of increasing refractive index in glass:\n(I) Red\n(II) Yellow\n(III) Blue\n(IV) Violet",
    "explanation": "Refractive index increases with frequency (decreases with wavelength). Red has lowest μ, violet has highest. Order: I → II → III → IV.",
    "correct_answer": "A",
    "concept_tags": ["refractive-index", "dispersion", "colour-dependence"],
    "topic": "Refraction through Prism and Dispersion",
    "subtopic": "Refractive index vs colour",
    "subject": "cuet-physics",
    "chapter": "Ray Optics",
    "bloom_level": "remember",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "I → II → III → IV", "is_correct": True},
      {"key": "B", "text": "IV → III → II → I", "is_correct": False},
      {"key": "C", "text": "I → III → II → IV", "is_correct": False},
      {"key": "D", "text": "II → I → III → IV", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "This is the order of decreasing refractive index.", "misconception": "Reversing the order"},
      {"option_key": "C", "hint": "Yellow has lower μ than blue (yellow wavelength > blue wavelength).", "misconception": None},
      {"option_key": "D", "hint": "Red has the lowest μ, so I comes first.", "misconception": None}
    ]
  }
],

"phy-ray-instruments-copied.json": [
  {
    "id": "cuet-phy-ray-instr-d01",
    "chapter_id": "cuet-phy-optics",
    "question_type": "diagram-based",
    "difficulty": "medium",
    "question_text": "The diagram shows a compound microscope with objective (fo = 1 cm) and eyepiece (fe = 5 cm), tube length L = 20 cm. What is the approximate magnification?",
    "image_uri": "diagrams/cuet-phy-ray-instr-d01.png",
    "image_alt": "Compound microscope: objective lens (fo=1cm) forms magnified real image, eyepiece (fe=5cm) acts as magnifier. Tube length L=20cm.",
    "explanation": "Magnification m ≈ (L/fo)(D/fe) = (20/1)(25/5) = 20 × 5 = 100, where D = 25 cm (least distance of distinct vision).",
    "correct_answer": "C",
    "concept_tags": ["compound-microscope", "magnification", "optical-instruments"],
    "topic": "Optical Instruments (Microscope and Telescope)",
    "subtopic": "Compound microscope magnification",
    "subject": "cuet-physics",
    "chapter": "Ray Optics",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "20", "is_correct": False},
      {"key": "B", "text": "50", "is_correct": False},
      {"key": "C", "text": "100", "is_correct": True},
      {"key": "D", "text": "200", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "20 = L/fo. You forgot to multiply by D/fe = 25/5 = 5.", "misconception": "Using only objective magnification"},
      {"option_key": "B", "hint": "50 would result from using D = 25 directly instead of D/fe.", "misconception": None},
      {"option_key": "D", "hint": "200 would require either a different tube length or focal lengths.", "misconception": None}
    ]
  },
  {
    "id": "cuet-phy-ray-instr-d02",
    "chapter_id": "cuet-phy-optics",
    "question_type": "diagram-based",
    "difficulty": "easy",
    "question_text": "The diagram shows an astronomical telescope in normal adjustment (image at infinity). The magnifying power in this mode is:",
    "image_uri": "diagrams/cuet-phy-ray-instr-d02.png",
    "image_alt": "Astronomical telescope: objective (large fo) forms image at focus, eyepiece (small fe) views it. Parallel rays in and out.",
    "explanation": "In normal adjustment (image at infinity): M = fo/fe, where fo is the focal length of the objective and fe is the focal length of the eyepiece.",
    "correct_answer": "A",
    "concept_tags": ["telescope", "magnifying-power", "normal-adjustment"],
    "topic": "Optical Instruments (Microscope and Telescope)",
    "subtopic": "Astronomical telescope magnification",
    "subject": "cuet-physics",
    "chapter": "Ray Optics",
    "bloom_level": "remember",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "fo/fe", "is_correct": True},
      {"key": "B", "text": "fe/fo", "is_correct": False},
      {"key": "C", "text": "fo × fe", "is_correct": False},
      {"key": "D", "text": "fo + fe", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "fe/fo < 1 (since fo > fe), giving magnification less than 1 — that defeats the purpose.", "misconception": "Inverting the ratio"},
      {"option_key": "C", "hint": "fo × fe has units of cm², not a dimensionless ratio.", "misconception": None},
      {"option_key": "D", "hint": "fo + fe gives the tube length in normal adjustment, not magnification.", "misconception": "Confusing tube length with magnification"}
    ]
  },
  {
    "id": "cuet-phy-ray-instr-ls01",
    "chapter_id": "cuet-phy-optics",
    "question_type": "logical-sequence",
    "difficulty": "medium",
    "question_text": "Arrange in order of increasing magnifying power for normal adjustment:\n(I) Simple magnifier (D/f = 5)\n(II) Compound microscope (m = 100)\n(III) Astronomical telescope (m = 50)",
    "explanation": "Simple magnifier: m = 5. Telescope: m = 50. Microscope: m = 100. Order: I → III → II.",
    "correct_answer": "A",
    "concept_tags": ["magnification-comparison", "optical-instruments"],
    "topic": "Optical Instruments (Microscope and Telescope)",
    "subtopic": "Comparison of optical instruments",
    "subject": "cuet-physics",
    "chapter": "Ray Optics",
    "bloom_level": "analyze",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "I → III → II", "is_correct": True},
      {"key": "B", "text": "II → III → I", "is_correct": False},
      {"key": "C", "text": "I → II → III", "is_correct": False},
      {"key": "D", "text": "III → I → II", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "This is the order of decreasing magnification.", "misconception": "Reversing the order"},
      {"option_key": "C", "hint": "Microscope (100) has higher magnification than telescope (50).", "misconception": None},
      {"option_key": "D", "hint": "Simple magnifier (5) has the lowest magnification.", "misconception": None}
    ]
  }
],

# ──────────────────────────────────────────────────────────────────
# WAVE OPTICS (3 files)
# ──────────────────────────────────────────────────────────────────
"phy-waveopt-interference-copied.json": [
  {
    "id": "cuet-phy-waveopt-interf-d01",
    "chapter_id": "cuet-phy-optics",
    "question_type": "diagram-based",
    "difficulty": "medium",
    "question_text": "In the diagram of Young's double-slit experiment, two coherent sources S₁ and S₂ are separated by distance d and a screen is placed at distance D. The fringe width β is observed. Which expression correctly gives β?",
    "image_uri": "diagrams/cuet-phy-waveopt-interf-d01.png",
    "image_alt": "Young's double-slit setup: two slits S1, S2 separated by d, screen at distance D, fringes with width β marked",
    "explanation": "Fringe width β = λD/d. It is directly proportional to wavelength λ and screen distance D, and inversely proportional to slit separation d.",
    "correct_answer": "B",
    "concept_tags": ["YDSE", "fringe-width", "interference"],
    "topic": "Interference and Young's Double Slit",
    "subtopic": "Fringe width formula",
    "subject": "cuet-physics",
    "chapter": "Wave Optics",
    "bloom_level": "understand",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "β = λd/D", "is_correct": False},
      {"key": "B", "text": "β = λD/d", "is_correct": True},
      {"key": "C", "text": "β = d/(λD)", "is_correct": False},
      {"key": "D", "text": "β = D/(λd)", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "This inverts D and d. Increasing slit separation d should decrease fringe width, not increase it.", "misconception": "Swapping d and D"},
      {"option_key": "C", "hint": "Fringe width increases with wavelength, so λ should be in the numerator.", "misconception": None},
      {"option_key": "D", "hint": "λ must appear in the numerator — longer wavelength gives wider fringes.", "misconception": None}
    ]
  },
  {
    "id": "cuet-phy-waveopt-interf-d02",
    "chapter_id": "cuet-phy-optics",
    "question_type": "diagram-based",
    "difficulty": "hard",
    "question_text": "The intensity pattern from a double-slit experiment is shown. If the path difference at point P is λ/3, and I₀ is the intensity due to each slit, what is the resultant intensity at P?",
    "image_uri": "diagrams/cuet-phy-waveopt-interf-d02.png",
    "image_alt": "Double-slit intensity pattern with point P marked where path difference is λ/3, showing intensity distribution curve",
    "explanation": "Phase difference δ = (2π/λ)(λ/3) = 2π/3. Resultant intensity I = 4I₀cos²(δ/2) = 4I₀cos²(π/3) = 4I₀(1/2)² = 4I₀(1/4) = I₀.",
    "correct_answer": "C",
    "concept_tags": ["interference-intensity", "phase-difference", "path-difference"],
    "topic": "Interference and Young's Double Slit",
    "subtopic": "Intensity at arbitrary point",
    "subject": "cuet-physics",
    "chapter": "Wave Optics",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "4I₀", "is_correct": False},
      {"key": "B", "text": "2I₀", "is_correct": False},
      {"key": "C", "text": "I₀", "is_correct": True},
      {"key": "D", "text": "Zero", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "4I₀ occurs only at path difference = nλ (constructive maximum). λ/3 is not an integer multiple of λ.", "misconception": "Assuming maximum everywhere"},
      {"option_key": "B", "hint": "2I₀ would require cos²(δ/2) = 1/2, i.e., δ/2 = π/4, which gives path difference λ/4, not λ/3.", "misconception": None},
      {"option_key": "D", "hint": "Zero intensity requires path difference (n+½)λ (destructive). λ/3 ≠ λ/2.", "misconception": "Confusing with destructive condition"}
    ]
  },
  {
    "id": "cuet-phy-waveopt-interf-ls01",
    "chapter_id": "cuet-phy-optics",
    "question_type": "logical-sequence",
    "difficulty": "medium",
    "question_text": "Arrange the following YDSE setups in order of increasing fringe width:\n(I) λ = 500 nm, d = 1 mm, D = 1 m (β = 0.5 mm)\n(II) λ = 600 nm, d = 0.5 mm, D = 1 m (β = 1.2 mm)\n(III) λ = 700 nm, d = 0.5 mm, D = 2 m (β = 2.8 mm)",
    "explanation": "Using β = λD/d: Setup I: 0.5 mm, Setup II: 1.2 mm, Setup III: 2.8 mm. Order: I → II → III.",
    "correct_answer": "A",
    "concept_tags": ["fringe-width-comparison", "YDSE"],
    "topic": "Interference and Young's Double Slit",
    "subtopic": "Fringe width comparison",
    "subject": "cuet-physics",
    "chapter": "Wave Optics",
    "bloom_level": "analyze",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "I → II → III", "is_correct": True},
      {"key": "B", "text": "III → II → I", "is_correct": False},
      {"key": "C", "text": "II → I → III", "is_correct": False},
      {"key": "D", "text": "I → III → II", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "This gives decreasing fringe width, not increasing.", "misconception": "Reversing the order"},
      {"option_key": "C", "hint": "Calculate β for II: 600e-9 × 1 / 0.5e-3 = 1.2 mm, which is larger than I's 0.5 mm.", "misconception": None},
      {"option_key": "D", "hint": "β for III (2.8 mm) is larger than β for II (1.2 mm), so III must come last.", "misconception": None}
    ]
  }
],

"phy-waveopt-diffraction-copied.json": [
  {
    "id": "cuet-phy-waveopt-diff-d01",
    "chapter_id": "cuet-phy-optics",
    "question_type": "diagram-based",
    "difficulty": "medium",
    "question_text": "The diagram shows single-slit Fraunhofer diffraction. A slit of width a produces the first minimum at angle θ. Which condition gives the position of the first minimum?",
    "image_uri": "diagrams/cuet-phy-waveopt-diff-d01.png",
    "image_alt": "Single slit of width a with parallel rays, showing first minimum at angle θ, with path difference a sinθ = λ marked",
    "explanation": "For single-slit diffraction, the first minimum occurs when a sinθ = λ, where a is the slit width. This is because the slit is divided into two halves that cancel pairwise.",
    "correct_answer": "A",
    "concept_tags": ["single-slit-diffraction", "first-minimum"],
    "topic": "Diffraction and Single Slit",
    "subtopic": "Condition for minima",
    "subject": "cuet-physics",
    "chapter": "Wave Optics",
    "bloom_level": "understand",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "a sinθ = λ", "is_correct": True},
      {"key": "B", "text": "a sinθ = λ/2", "is_correct": False},
      {"key": "C", "text": "a cosθ = λ", "is_correct": False},
      {"key": "D", "text": "a sinθ = 2λ", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "a sinθ = λ/2 would be a subsidiary maximum, not a minimum.", "misconception": "Confusing maxima and minima conditions"},
      {"option_key": "C", "hint": "Path difference depends on sinθ not cosθ for rays from different parts of the slit.", "misconception": None},
      {"option_key": "D", "hint": "a sinθ = 2λ gives the second minimum, not the first.", "misconception": "Using wrong order number"}
    ]
  },
  {
    "id": "cuet-phy-waveopt-diff-d02",
    "chapter_id": "cuet-phy-optics",
    "question_type": "diagram-based",
    "difficulty": "hard",
    "question_text": "The diagram compares two single-slit diffraction patterns — one with slit width a, and one with slit width a/2. How does the angular width of the central maximum change when the slit width is halved?",
    "image_uri": "diagrams/cuet-phy-waveopt-diff-d02.png",
    "image_alt": "Two diffraction patterns compared: slit width a (narrow central max) and slit width a/2 (wide central max), showing angular width 2θ doubles",
    "explanation": "Angular position of first minimum: sinθ ≈ θ = λ/a. Angular width of central max = 2λ/a. Halving slit width: new width = 2λ/(a/2) = 4λ/a — the angular width doubles.",
    "correct_answer": "D",
    "concept_tags": ["diffraction-pattern", "central-maximum-width"],
    "topic": "Diffraction and Single Slit",
    "subtopic": "Width of central maximum",
    "subject": "cuet-physics",
    "chapter": "Wave Optics",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "It halves", "is_correct": False},
      {"key": "B", "text": "It remains the same", "is_correct": False},
      {"key": "C", "text": "It increases by 50%", "is_correct": False},
      {"key": "D", "text": "It doubles", "is_correct": True}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "Narrower slit produces wider diffraction — not narrower. This is a common inverse relationship error.", "misconception": "Thinking narrower slit gives narrower pattern"},
      {"option_key": "B", "hint": "Angular width = 2λ/a clearly depends on a, so changing a must change the width.", "misconception": None},
      {"option_key": "C", "hint": "Halving a doubles 1/a, so the width doubles (not 1.5×).", "misconception": None}
    ]
  },
  {
    "id": "cuet-phy-waveopt-diff-ls01",
    "chapter_id": "cuet-phy-optics",
    "question_type": "logical-sequence",
    "difficulty": "medium",
    "question_text": "Arrange the following single-slit setups in order of increasing angular width of the central maximum:\n(I) a = 0.2 mm, λ = 500 nm → 2θ = 5 mrad\n(II) a = 0.1 mm, λ = 500 nm → 2θ = 10 mrad\n(III) a = 0.1 mm, λ = 700 nm → 2θ = 14 mrad",
    "explanation": "Angular width 2θ = 2λ/a. Setup I: 5 mrad, Setup II: 10 mrad, Setup III: 14 mrad. Order: I → II → III.",
    "correct_answer": "A",
    "concept_tags": ["angular-width-comparison", "diffraction"],
    "topic": "Diffraction and Single Slit",
    "subtopic": "Angular width comparison",
    "subject": "cuet-physics",
    "chapter": "Wave Optics",
    "bloom_level": "analyze",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "I → II → III", "is_correct": True},
      {"key": "B", "text": "III → II → I", "is_correct": False},
      {"key": "C", "text": "II → I → III", "is_correct": False},
      {"key": "D", "text": "I → III → II", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "This is decreasing order of angular width.", "misconception": "Reversing the sequence"},
      {"option_key": "C", "hint": "Setup I (5 mrad) has a smaller angular width than Setup II (10 mrad), so I comes before II.", "misconception": None},
      {"option_key": "D", "hint": "Setup III (14 mrad) is the largest, so it must come last.", "misconception": None}
    ]
  }
],

"phy-waveopt-polarisation-copied.json": [
  {
    "id": "cuet-phy-waveopt-polar-d01",
    "chapter_id": "cuet-phy-optics",
    "question_type": "diagram-based",
    "difficulty": "medium",
    "question_text": "The diagram shows unpolarised light incident on a glass surface at Brewster's angle. The reflected ray is fully polarised. If the reflected and refracted rays are perpendicular, and the Brewster angle is 57°, what is the refractive index of the glass?",
    "image_uri": "diagrams/cuet-phy-waveopt-polar-d01.png",
    "image_alt": "Light ray hitting glass at Brewster angle 57°, reflected ray polarised, refracted ray at 33° with perpendicular annotation between reflected and refracted",
    "explanation": "At Brewster's angle: μ = tan(iB) = tan(57°) ≈ 1.54. The reflected and refracted rays are perpendicular (i + r = 90°), a defining property of Brewster's angle.",
    "correct_answer": "B",
    "concept_tags": ["brewster-angle", "polarisation", "refractive-index"],
    "topic": "Polarisation and Brewster's Law",
    "subtopic": "Brewster's angle and refractive index",
    "subject": "cuet-physics",
    "chapter": "Wave Optics",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "1.33", "is_correct": False},
      {"key": "B", "text": "1.54", "is_correct": True},
      {"key": "C", "text": "1.73", "is_correct": False},
      {"key": "D", "text": "1.00", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "1.33 is the refractive index of water (Brewster angle ≈ 53°), not glass at 57°.", "misconception": "Using water's refractive index"},
      {"option_key": "C", "hint": "tan(60°) = 1.73. Brewster's angle for μ = 1.73 would be 60°, not 57°.", "misconception": "Using wrong angle"},
      {"option_key": "D", "hint": "μ = 1.00 means no interface (Brewster angle = 45° for equal media). The question specifies a glass surface.", "misconception": None}
    ]
  },
  {
    "id": "cuet-phy-waveopt-polar-d02",
    "chapter_id": "cuet-phy-optics",
    "question_type": "diagram-based",
    "difficulty": "hard",
    "question_text": "The diagram illustrates Malus's Law. Unpolarised light of intensity I₀ passes through a polariser and then through an analyser whose pass axis makes an angle of 60° with the polariser. What is the intensity of light emerging from the analyser?",
    "image_uri": "diagrams/cuet-phy-waveopt-polar-d02.png",
    "image_alt": "Unpolarised light (I₀) → polariser (I₀/2) → analyser at 60° → transmitted intensity marked with question mark",
    "explanation": "After the polariser: I₁ = I₀/2. After the analyser (Malus's Law): I₂ = I₁cos²(60°) = (I₀/2)(1/2)² = (I₀/2)(1/4) = I₀/8.",
    "correct_answer": "C",
    "concept_tags": ["malus-law", "polarisation", "intensity"],
    "topic": "Polarisation and Brewster's Law",
    "subtopic": "Malus's Law application",
    "subject": "cuet-physics",
    "chapter": "Wave Optics",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "I₀/2", "is_correct": False},
      {"key": "B", "text": "I₀/4", "is_correct": False},
      {"key": "C", "text": "I₀/8", "is_correct": True},
      {"key": "D", "text": "I₀/16", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "I₀/2 is the intensity after the first polariser only. You still need to apply Malus's law at the analyser.", "misconception": "Forgetting the analyser"},
      {"option_key": "B", "hint": "I₀/4 would be the answer if cos²(60°) = 1/2, but cos(60°) = 1/2 so cos²(60°) = 1/4.", "misconception": "Using cos instead of cos²"},
      {"option_key": "D", "hint": "I₀/16 would require cos²θ = 1/8, which gives θ ≈ 69.3°, not 60°.", "misconception": None}
    ]
  },
  {
    "id": "cuet-phy-waveopt-polar-ls01",
    "chapter_id": "cuet-phy-optics",
    "question_type": "logical-sequence",
    "difficulty": "medium",
    "question_text": "Unpolarised light of intensity I₀ passes through a polariser. The polarised light then passes through analysers at different angles. Arrange in order of increasing transmitted intensity:\n(I) Analyser at 60° → I = I₀cos²60°/2 = I₀/8\n(II) Analyser at 45° → I = I₀cos²45°/2 = I₀/4\n(III) Analyser at 30° → I = I₀cos²30°/2 = 3I₀/8",
    "explanation": "After polariser, I₁ = I₀/2. Applying Malus's law: At 60°: I₀/8, at 45°: I₀/4, at 30°: 3I₀/8. Order of increasing intensity: I → II → III.",
    "correct_answer": "A",
    "concept_tags": ["malus-law-comparison", "intensity-ordering"],
    "topic": "Polarisation and Brewster's Law",
    "subtopic": "Malus's law intensity comparison",
    "subject": "cuet-physics",
    "chapter": "Wave Optics",
    "bloom_level": "analyze",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "I → II → III", "is_correct": True},
      {"key": "B", "text": "III → II → I", "is_correct": False},
      {"key": "C", "text": "II → I → III", "is_correct": False},
      {"key": "D", "text": "I → III → II", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "This is decreasing intensity order, not increasing.", "misconception": "Reversing the sequence"},
      {"option_key": "C", "hint": "I₀/8 < I₀/4, so setup I comes before setup II.", "misconception": None},
      {"option_key": "D", "hint": "3I₀/8 > I₀/4, so setup III has the highest intensity and must come last.", "misconception": None}
    ]
  }
],

}

# ============================================================================
# PROCESSING LOGIC (same as batch 1 & 2)
# ============================================================================
def normalize_type(qt):
    qt = qt.replace('_', '-')
    if qt in ('fill-in-the-blanks', 'fill-in-the-blank'):
        qt = 'fill-in-blanks'
    if qt == 'scenario':
        qt = 'scenario-based'
    return qt

def process_file(filepath, replacements):
    with open(filepath) as f:
        questions = json.load(f)
    for q in questions:
        q['question_type'] = normalize_type(q.get('question_type', 'mcq'))
    type_counts = {}
    for q in questions:
        qt = q['question_type']
        type_counts[qt] = type_counts.get(qt, 0) + 1
    target = {'mcq': 10, 'diagram-based': 2, 'assertion-reasoning': 2,
              'match-the-following': 1, 'true-false': 2, 'fill-in-blanks': 1,
              'scenario-based': 1, 'logical-sequence': 1}
    removals = {}
    for qt in type_counts:
        t = target.get(qt, type_counts[qt])
        if type_counts[qt] > t:
            removals[qt] = type_counts[qt] - t
    reversed_qs = list(reversed(questions))
    keep = []
    removal_counts = {k: 0 for k in removals}
    for q in reversed_qs:
        qt = q['question_type']
        if qt in removals and removal_counts[qt] < removals[qt]:
            removal_counts[qt] += 1
            continue
        keep.append(q)
    new_questions = list(reversed(keep))
    new_questions.extend(replacements)
    return new_questions, removals

def main():
    processed = 0
    total_removed = 0
    total_added = 0
    for filename, replacements in REPLACEMENT_QUESTIONS.items():
        found = None
        for root, dirs, files in os.walk(BASE):
            if filename in files:
                found = os.path.join(root, filename)
                break
        if not found:
            print(f"SKIP: {filename} not found")
            continue
        new_questions, removals = process_file(found, replacements)
        removed = sum(removals.values())
        added = len(replacements)
        with open(found, 'w') as f:
            json.dump(new_questions, f, indent=2, ensure_ascii=False)
        result_types = {}
        for q in new_questions:
            qt = q['question_type']
            result_types[qt] = result_types.get(qt, 0) + 1
        print(f"OK: {filename:50s} removed={removed} added={added} total={len(new_questions)} types={dict(sorted(result_types.items()))}")
        processed += 1
        total_removed += removed
        total_added += added
    print(f"\nProcessed {processed} files. Removed {total_removed}, Added {total_added}.")

if __name__ == '__main__':
    main()
