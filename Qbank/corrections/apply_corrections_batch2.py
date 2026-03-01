#!/usr/bin/env python3
"""
Batch 2 correction questions: 10 CUET Physics files × 3 questions = 30 total.
Chapters: Dual Nature (2), Electronic Devices (3), Electrostatics (3), EM Induction (2)
Each file gets: 2 diagram-based + 1 logical-sequence
"""
import json, os, sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent / "CUET" / "physics"
DIAG_DIR = Path(__file__).resolve().parent / "diagrams"
DIAG_DIR.mkdir(exist_ok=True)

REPLACEMENT_QUESTIONS = {

# ──────────────────────────────────────────────────────────────────
# DUAL NATURE OF MATTER AND RADIATION
# ──────────────────────────────────────────────────────────────────
"phy-dual-debroglie-copied.json": [
  {
    "id": "cuet-phy-dual-debroglie-d01",
    "chapter_id": "cuet-phy-dual-nature",
    "question_type": "diagram-based",
    "difficulty": "medium",
    "question_text": "The graph shows the variation of de Broglie wavelength (λ) with accelerating potential (V) for an electron. Which of the following best describes the nature of this curve?",
    "image_uri": "diagrams/cuet-phy-dual-debroglie-d01.png",
    "image_alt": "Graph showing λ on y-axis vs V on x-axis. Curve is a decreasing hyperbolic shape approaching the x-axis as V increases.",
    "explanation": "For an electron accelerated through potential V: λ = h/√(2meV) = 1.226/√V nm. So λ ∝ 1/√V, giving a rectangular hyperbola that decreases steeply at low V and flattens at high V.",
    "correct_answer": "B",
    "concept_tags": ["de-broglie-wavelength", "accelerating-potential", "graphical-analysis"],
    "topic": "de Broglie Wavelength and Davisson-Germer Experiment",
    "subtopic": "de Broglie wavelength vs potential",
    "subject": "cuet-physics",
    "chapter": "Dual Nature of Matter and Radiation",
    "bloom_level": "understand",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "A straight line with negative slope", "is_correct": False},
      {"key": "B", "text": "A rectangular hyperbola (λ ∝ 1/√V)", "is_correct": True},
      {"key": "C", "text": "A parabola opening upward", "is_correct": False},
      {"key": "D", "text": "An exponential decay curve", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "A straight line would mean λ ∝ V, but the relation is λ ∝ 1/√V.", "misconception": "Assuming linear relationship"},
      {"option_key": "C", "hint": "A parabola would mean λ ∝ V², which increases with V — opposite of what happens.", "misconception": None},
      {"option_key": "D", "hint": "Exponential decay (λ ∝ e⁻ᵛ) drops much faster than 1/√V. The curve is algebraic, not exponential.", "misconception": "Confusing power law with exponential"}
    ]
  },
  {
    "id": "cuet-phy-dual-debroglie-d02",
    "chapter_id": "cuet-phy-dual-nature",
    "question_type": "diagram-based",
    "difficulty": "hard",
    "question_text": "The diagram shows the Davisson-Germer experiment setup with an electron beam hitting a nickel crystal. The detector is at angle φ from the incident beam. A strong diffraction peak is observed at φ = 50° when the accelerating voltage is 54 V. What is the interplanar spacing d of the crystal if the first-order maximum is observed?",
    "image_uri": "diagrams/cuet-phy-dual-debroglie-d02.png",
    "image_alt": "Davisson-Germer setup: electron gun on left, nickel crystal in center, movable detector showing peak at φ=50°, with scattering angle θ marked",
    "explanation": "In Davisson-Germer: scattering angle θ = (180° − φ)/2 = (180° − 50°)/2 = 65°. Bragg's law: nλ = 2d sin θ. For 54V electrons: λ = 1.226/√54 = 0.167 nm. So d = λ/(2 sin 65°) = 0.167/(2 × 0.906) = 0.092 nm ≈ 0.91 Å.",
    "correct_answer": "C",
    "concept_tags": ["davisson-germer", "electron-diffraction", "bragg-law"],
    "topic": "de Broglie Wavelength and Davisson-Germer Experiment",
    "subtopic": "Davisson-Germer experiment analysis",
    "subject": "cuet-physics",
    "chapter": "Dual Nature of Matter and Radiation",
    "bloom_level": "analyze",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "0.167 nm", "is_correct": False},
      {"key": "B", "text": "0.123 nm", "is_correct": False},
      {"key": "C", "text": "0.092 nm", "is_correct": True},
      {"key": "D", "text": "0.184 nm", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "0.167 nm is the de Broglie wavelength itself, not the interplanar spacing.", "misconception": "Confusing wavelength with spacing"},
      {"option_key": "B", "hint": "This would result from using φ directly in Bragg's law instead of converting to θ.", "misconception": None},
      {"option_key": "D", "hint": "0.184 nm = λ/sin 65° — missing the factor of 2 in Bragg's law.", "misconception": "Forgetting the factor 2 in 2d sin θ"}
    ]
  },
  {
    "id": "cuet-phy-dual-debroglie-ls01",
    "chapter_id": "cuet-phy-dual-nature",
    "question_type": "logical-sequence",
    "difficulty": "medium",
    "question_text": "Arrange the following particles in order of increasing de Broglie wavelength when all have the same kinetic energy:\n(I) Proton\n(II) Electron\n(III) Alpha particle\n(IV) Neutron",
    "explanation": "λ = h/√(2mKE). At same KE, λ ∝ 1/√m. Masses: electron (9.1×10⁻³¹) < proton ≈ neutron (1.67×10⁻²⁷) < alpha (6.64×10⁻²⁷). Increasing λ means decreasing mass: α < p ≈ n < e. So III → (I,IV) → II.",
    "correct_answer": "A",
    "concept_tags": ["de-broglie-wavelength", "mass-dependence", "particle-comparison"],
    "topic": "de Broglie Wavelength and Davisson-Germer Experiment",
    "subtopic": "Wavelength comparison of particles",
    "subject": "cuet-physics",
    "chapter": "Dual Nature of Matter and Radiation",
    "bloom_level": "analyze",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "III → IV → I → II", "is_correct": True},
      {"key": "B", "text": "II → I → IV → III", "is_correct": False},
      {"key": "C", "text": "I → IV → III → II", "is_correct": False},
      {"key": "D", "text": "III → I → IV → II", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "This is the order of decreasing wavelength. Electron has the largest λ, not smallest.", "misconception": "Reversing the order"},
      {"option_key": "C", "hint": "Proton and neutron have nearly equal mass, and alpha is heavier — so alpha has the smallest λ.", "misconception": None},
      {"option_key": "D", "hint": "Proton and neutron have nearly equal mass, so their wavelengths are nearly equal. Neutron (IV) should be close to proton (I).", "misconception": "Ignoring near-equal masses of p and n"}
    ]
  }
],

"phy-dual-photoelectric-copied.json": [
  {
    "id": "cuet-phy-dual-photo-d01",
    "chapter_id": "cuet-phy-dual-nature",
    "question_type": "diagram-based",
    "difficulty": "medium",
    "question_text": "The graph shows the variation of stopping potential (V₀) versus frequency (ν) for two different metals P and Q. Both lines are parallel. Which metal has a higher work function?",
    "image_uri": "diagrams/cuet-phy-dual-photo-d01.png",
    "image_alt": "V₀ vs ν graph with two parallel straight lines. Line P has threshold frequency ν₁ and line Q has threshold frequency ν₂ where ν₂ > ν₁",
    "explanation": "From Einstein's equation: eV₀ = hν − φ, so V₀ = (h/e)ν − φ/e. The slope h/e is same for all metals (parallel lines). The x-intercept gives threshold frequency ν₀ = φ/h. Since Q has higher threshold frequency (ν₂ > ν₁), Q has higher work function φ = hν₀.",
    "correct_answer": "B",
    "concept_tags": ["stopping-potential", "work-function", "threshold-frequency"],
    "topic": "Photoelectric Effect and Einstein's Equation",
    "subtopic": "Stopping potential vs frequency graph",
    "subject": "cuet-physics",
    "chapter": "Dual Nature of Matter and Radiation",
    "bloom_level": "analyze",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "Metal P", "is_correct": False},
      {"key": "B", "text": "Metal Q", "is_correct": True},
      {"key": "C", "text": "Both have equal work functions", "is_correct": False},
      {"key": "D", "text": "Cannot be determined from the graph", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "P has lower threshold frequency, meaning lower work function φ = hν₀.", "misconception": "Confusing lower threshold with higher work function"},
      {"option_key": "C", "hint": "The lines have different x-intercepts, so work functions must differ.", "misconception": None},
      {"option_key": "D", "hint": "The x-intercept directly gives threshold frequency, from which work function is determined.", "misconception": None}
    ]
  },
  {
    "id": "cuet-phy-dual-photo-d02",
    "chapter_id": "cuet-phy-dual-nature",
    "question_type": "diagram-based",
    "difficulty": "easy",
    "question_text": "The diagram shows the I-V characteristics of a photoelectric cell for two different intensities I₁ and I₂ (I₂ > I₁) of light at the same frequency. What remains the same for both curves?",
    "image_uri": "diagrams/cuet-phy-dual-photo-d02.png",
    "image_alt": "I-V graph showing two curves: I₂ (higher saturation current) and I₁ (lower saturation current), both reaching the same stopping potential −V₀ on the negative voltage side",
    "explanation": "At same frequency, the stopping potential V₀ depends only on frequency (V₀ = hν/e − φ/e), not on intensity. Higher intensity increases the number of photoelectrons (higher saturation current) but doesn't change their maximum KE. So stopping potential is the same.",
    "correct_answer": "C",
    "concept_tags": ["photoelectric-effect", "intensity", "stopping-potential"],
    "topic": "Photoelectric Effect and Einstein's Equation",
    "subtopic": "Effect of intensity on photoelectric current",
    "subject": "cuet-physics",
    "chapter": "Dual Nature of Matter and Radiation",
    "bloom_level": "understand",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "The saturation current", "is_correct": False},
      {"key": "B", "text": "The photoelectric current at zero voltage", "is_correct": False},
      {"key": "C", "text": "The stopping potential", "is_correct": True},
      {"key": "D", "text": "Both saturation current and stopping potential", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "Saturation current increases with intensity — more photons eject more electrons.", "misconception": "Thinking saturation current is independent of intensity"},
      {"option_key": "B", "hint": "Current at zero voltage also depends on the number of electrons emitted, which changes with intensity.", "misconception": None},
      {"option_key": "D", "hint": "Saturation current changes with intensity; only stopping potential stays constant.", "misconception": None}
    ]
  },
  {
    "id": "cuet-phy-dual-photo-ls01",
    "chapter_id": "cuet-phy-dual-nature",
    "question_type": "logical-sequence",
    "difficulty": "medium",
    "question_text": "Arrange the following electromagnetic radiations in order of increasing ability to cause photoelectric emission from a metal with work function 2.0 eV:\n(I) Red light (1.8 eV)\n(II) Yellow light (2.1 eV)\n(III) Blue light (2.8 eV)\n(IV) Ultraviolet (4.0 eV)",
    "explanation": "Only photons with energy > work function (2.0 eV) cause emission. Red (1.8 eV) cannot cause emission at all. For those that can: max KE = hν − φ. Yellow: 0.1 eV, Blue: 0.8 eV, UV: 2.0 eV. Order: I (no emission) → II → III → IV.",
    "correct_answer": "A",
    "concept_tags": ["photoelectric-effect", "photon-energy", "threshold-energy"],
    "topic": "Photoelectric Effect and Einstein's Equation",
    "subtopic": "Energy threshold for photoemission",
    "subject": "cuet-physics",
    "chapter": "Dual Nature of Matter and Radiation",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "I → II → III → IV", "is_correct": True},
      {"key": "B", "text": "IV → III → II → I", "is_correct": False},
      {"key": "C", "text": "I → III → II → IV", "is_correct": False},
      {"key": "D", "text": "II → I → III → IV", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "This is the order of decreasing ability, not increasing.", "misconception": "Reversing the order"},
      {"option_key": "C", "hint": "Blue light (2.8 eV) gives more KE than yellow (2.1 eV), so III comes after II.", "misconception": None},
      {"option_key": "D", "hint": "Red light (1.8 eV) has less energy than the work function, so it cannot cause emission at all — it should be first (least ability).", "misconception": "Thinking all light causes photoemission"}
    ]
  }
],

# ──────────────────────────────────────────────────────────────────
# ELECTRONIC DEVICES
# ──────────────────────────────────────────────────────────────────
"phy-semi-diode-copied.json": [
  {
    "id": "cuet-phy-semi-diode-d01",
    "chapter_id": "cuet-phy-electronic-devices",
    "question_type": "diagram-based",
    "difficulty": "medium",
    "question_text": "The diagram shows a half-wave rectifier circuit with an AC input of peak voltage 10 V and a silicon diode (barrier potential 0.7 V). What is the peak value of the output voltage across the load resistor?",
    "image_uri": "diagrams/cuet-phy-semi-diode-d01.png",
    "image_alt": "Half-wave rectifier circuit: AC source connected to diode (D) in series with load resistor (R_L). Output shows positive half-cycles only.",
    "explanation": "In a half-wave rectifier, the diode conducts only during the positive half-cycle. The output peak voltage = input peak − barrier potential = 10 − 0.7 = 9.3 V.",
    "correct_answer": "C",
    "concept_tags": ["half-wave-rectifier", "diode-barrier", "peak-voltage"],
    "topic": "Diode Applications (Rectifier, Zener, LED, Photodiode)",
    "subtopic": "Half-wave rectifier output",
    "subject": "cuet-physics",
    "chapter": "Electronic Devices",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "10 V", "is_correct": False},
      {"key": "B", "text": "5 V", "is_correct": False},
      {"key": "C", "text": "9.3 V", "is_correct": True},
      {"key": "D", "text": "10.7 V", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "10 V ignores the voltage drop across the diode (0.7 V for silicon).", "misconception": "Ignoring diode barrier potential"},
      {"option_key": "B", "hint": "5 V would be the average, not the peak of the output.", "misconception": "Confusing peak with average value"},
      {"option_key": "D", "hint": "The diode drops voltage, not adds — output is always less than input peak.", "misconception": "Adding barrier potential instead of subtracting"}
    ]
  },
  {
    "id": "cuet-phy-semi-diode-d02",
    "chapter_id": "cuet-phy-electronic-devices",
    "question_type": "diagram-based",
    "difficulty": "easy",
    "question_text": "The diagram shows a Zener diode voltage regulator circuit. The Zener breakdown voltage is 6 V and the input voltage varies from 9 V to 15 V. What is the output voltage across the load?",
    "image_uri": "diagrams/cuet-phy-semi-diode-d02.png",
    "image_alt": "Zener regulator circuit: input voltage source, series resistor Rs, Zener diode in reverse bias across load resistor R_L, output = 6V",
    "explanation": "In a Zener voltage regulator, when the input exceeds the Zener voltage, the Zener diode maintains a constant voltage across itself (and the load). So output = Zener voltage = 6 V, regardless of input variation from 9 V to 15 V.",
    "correct_answer": "A",
    "concept_tags": ["zener-diode", "voltage-regulator", "breakdown-voltage"],
    "topic": "Diode Applications (Rectifier, Zener, LED, Photodiode)",
    "subtopic": "Zener voltage regulation",
    "subject": "cuet-physics",
    "chapter": "Electronic Devices",
    "bloom_level": "understand",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "6 V (constant)", "is_correct": True},
      {"key": "B", "text": "Varies from 9 V to 15 V", "is_correct": False},
      {"key": "C", "text": "Varies from 3 V to 9 V", "is_correct": False},
      {"key": "D", "text": "12 V (average of input range)", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "This would mean no regulation — the whole point of the Zener is to keep output constant.", "misconception": "Not understanding voltage regulation"},
      {"option_key": "C", "hint": "The excess voltage (input − Zener) drops across Rs, not across the load.", "misconception": "Subtracting Zener voltage from input"},
      {"option_key": "D", "hint": "The Zener maintains exactly its breakdown voltage, not the average.", "misconception": None}
    ]
  },
  {
    "id": "cuet-phy-semi-diode-ls01",
    "chapter_id": "cuet-phy-electronic-devices",
    "question_type": "logical-sequence",
    "difficulty": "medium",
    "question_text": "Arrange the following special-purpose diodes in order of increasing wavelength of radiation they typically interact with:\n(I) Solar cell\n(II) LED (red)\n(III) Photodiode (IR)\n(IV) X-ray detector diode",
    "explanation": "X-ray: ~0.01–10 nm, Solar cell: visible ~400–700 nm, LED (red): ~620–750 nm, IR photodiode: ~800–1600 nm. Order of increasing wavelength: IV → I → II → III.",
    "correct_answer": "B",
    "concept_tags": ["special-diodes", "wavelength", "electromagnetic-spectrum"],
    "topic": "Diode Applications (Rectifier, Zener, LED, Photodiode)",
    "subtopic": "Spectral range of different diodes",
    "subject": "cuet-physics",
    "chapter": "Electronic Devices",
    "bloom_level": "understand",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "III → II → I → IV", "is_correct": False},
      {"key": "B", "text": "IV → I → II → III", "is_correct": True},
      {"key": "C", "text": "IV → II → I → III", "is_correct": False},
      {"key": "D", "text": "I → II → III → IV", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "This is roughly the reverse order. X-rays have the shortest wavelength.", "misconception": "Reversing wavelength order"},
      {"option_key": "C", "hint": "Solar cells absorb visible light (~500 nm avg), red LEDs emit ~650 nm — solar cell range starts at shorter wavelength.", "misconception": None},
      {"option_key": "D", "hint": "Solar cells work in visible range, not the shortest wavelength.", "misconception": None}
    ]
  }
],

"phy-semi-pn-copied.json": [
  {
    "id": "cuet-phy-semi-pn-d01",
    "chapter_id": "cuet-phy-electronic-devices",
    "question_type": "diagram-based",
    "difficulty": "medium",
    "question_text": "The diagram shows the I-V characteristic of a p-n junction diode. In forward bias, the diode starts conducting significantly at voltage Vk (knee voltage). If Vk = 0.7 V and the forward resistance above Vk is 20 Ω, what current flows when 1.5 V is applied?",
    "image_uri": "diagrams/cuet-phy-semi-pn-d01.png",
    "image_alt": "I-V curve of p-n junction: negligible current below Vk=0.7V in forward bias, then steeply rising current. Reverse bias shows very small constant current until breakdown.",
    "explanation": "Above knee voltage, I = (V − Vk)/Rf = (1.5 − 0.7)/20 = 0.8/20 = 0.04 A = 40 mA.",
    "correct_answer": "B",
    "concept_tags": ["pn-junction", "IV-characteristics", "knee-voltage", "forward-bias"],
    "topic": "p-n Junction Diode and Characteristics",
    "subtopic": "Forward bias I-V characteristics",
    "subject": "cuet-physics",
    "chapter": "Electronic Devices",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "75 mA", "is_correct": False},
      {"key": "B", "text": "40 mA", "is_correct": True},
      {"key": "C", "text": "35 mA", "is_correct": False},
      {"key": "D", "text": "0 mA", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "75 mA = 1.5V/20Ω — this ignores the knee voltage drop of 0.7 V.", "misconception": "Ignoring knee voltage in calculation"},
      {"option_key": "C", "hint": "35 mA = 0.7/20 — this uses the knee voltage instead of (V − Vk).", "misconception": "Using Vk instead of (V − Vk)"},
      {"option_key": "D", "hint": "1.5 V > 0.7 V (knee voltage), so the diode is conducting.", "misconception": "Thinking diode doesn't conduct at 1.5V"}
    ]
  },
  {
    "id": "cuet-phy-semi-pn-d02",
    "chapter_id": "cuet-phy-electronic-devices",
    "question_type": "diagram-based",
    "difficulty": "easy",
    "question_text": "The diagram shows the energy band diagram of a p-n junction at equilibrium (no external bias). The built-in potential barrier is shown. What happens to the width of the depletion region when forward bias is applied?",
    "image_uri": "diagrams/cuet-phy-semi-pn-d02.png",
    "image_alt": "Energy band diagram of p-n junction showing conduction band, valence band, Fermi level, depletion region width W, and built-in potential Vbi",
    "explanation": "Forward bias reduces the potential barrier, allowing majority carriers to cross. This reduces the depletion region width. The external voltage opposes the built-in potential, narrowing the space charge region.",
    "correct_answer": "A",
    "concept_tags": ["depletion-region", "forward-bias", "energy-band-diagram"],
    "topic": "p-n Junction Diode and Characteristics",
    "subtopic": "Effect of bias on depletion region",
    "subject": "cuet-physics",
    "chapter": "Electronic Devices",
    "bloom_level": "understand",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "Decreases", "is_correct": True},
      {"key": "B", "text": "Increases", "is_correct": False},
      {"key": "C", "text": "Remains the same", "is_correct": False},
      {"key": "D", "text": "First increases then decreases", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "Increase in depletion width occurs in reverse bias, not forward bias.", "misconception": "Confusing forward and reverse bias effects"},
      {"option_key": "C", "hint": "Any applied bias changes the equilibrium — depletion width must change.", "misconception": None},
      {"option_key": "D", "hint": "Forward bias consistently reduces the barrier — there's no reversal.", "misconception": None}
    ]
  },
  {
    "id": "cuet-phy-semi-pn-ls01",
    "chapter_id": "cuet-phy-electronic-devices",
    "question_type": "logical-sequence",
    "difficulty": "medium",
    "question_text": "Arrange the following steps in the formation of a p-n junction in the correct order:\n(I) Diffusion of majority carriers across the junction\n(II) Formation of immobile ion layer (depletion region)\n(III) Establishment of built-in electric field\n(IV) Equilibrium — diffusion current equals drift current",
    "explanation": "When p and n types are joined: majority carriers diffuse (I), leaving behind immobile ions that form the depletion region (II), creating a built-in electric field (III), which opposes further diffusion until equilibrium is reached (IV).",
    "correct_answer": "A",
    "concept_tags": ["pn-junction-formation", "depletion-region", "equilibrium"],
    "topic": "p-n Junction Diode and Characteristics",
    "subtopic": "Formation of p-n junction",
    "subject": "cuet-physics",
    "chapter": "Electronic Devices",
    "bloom_level": "understand",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "I → II → III → IV", "is_correct": True},
      {"key": "B", "text": "III → I → II → IV", "is_correct": False},
      {"key": "C", "text": "II → I → III → IV", "is_correct": False},
      {"key": "D", "text": "I → III → II → IV", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "The electric field forms because of the depletion region, not before diffusion.", "misconception": "Thinking field exists before junction formation"},
      {"option_key": "C", "hint": "Depletion region forms because of diffusion — diffusion must happen first.", "misconception": None},
      {"option_key": "D", "hint": "The immobile ions (depletion region) form first, then the field arises from them.", "misconception": "Reversing depletion region and field formation"}
    ]
  }
],

"phy-semi-transistor-copied.json": [
  {
    "id": "cuet-phy-semi-transistor-d01",
    "chapter_id": "cuet-phy-electronic-devices",
    "question_type": "diagram-based",
    "difficulty": "medium",
    "question_text": "The diagram shows the output characteristics (Ic vs Vce) of an NPN transistor in common-emitter configuration for two base currents Ib1 and Ib2 (Ib2 > Ib1). If Ib1 = 20 μA gives Ic = 2 mA, what is the current gain β?",
    "image_uri": "diagrams/cuet-phy-semi-transistor-d01.png",
    "image_alt": "Ic vs Vce graph with two curves: Ib2 (upper) and Ib1 (lower). Curves show saturation region, active region (nearly flat), and labelled Ib values.",
    "explanation": "Current gain β = Ic/Ib = 2 mA / 20 μA = 2×10⁻³ / 20×10⁻⁶ = 100.",
    "correct_answer": "D",
    "concept_tags": ["transistor", "current-gain", "common-emitter"],
    "topic": "Transistor, Logic Gates, and Amplifiers",
    "subtopic": "Transistor current gain",
    "subject": "cuet-physics",
    "chapter": "Electronic Devices",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "10", "is_correct": False},
      {"key": "B", "text": "50", "is_correct": False},
      {"key": "C", "text": "200", "is_correct": False},
      {"key": "D", "text": "100", "is_correct": True}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "β = 10 would mean Ic = 10 × 20μA = 0.2 mA, not 2 mA.", "misconception": "Unit conversion error"},
      {"option_key": "B", "hint": "β = 50 would mean Ic = 50 × 20μA = 1 mA, not 2 mA.", "misconception": None},
      {"option_key": "C", "hint": "β = 200 would mean Ic = 200 × 20μA = 4 mA, not 2 mA.", "misconception": None}
    ]
  },
  {
    "id": "cuet-phy-semi-transistor-d02",
    "chapter_id": "cuet-phy-electronic-devices",
    "question_type": "diagram-based",
    "difficulty": "easy",
    "question_text": "The diagram shows a two-input NAND gate. What is the output Y when both inputs A = 1 and B = 1?",
    "image_uri": "diagrams/cuet-phy-semi-transistor-d02.png",
    "image_alt": "NAND gate symbol with inputs A and B, output Y. Truth table partially shown.",
    "explanation": "NAND gate: Y = NOT(A AND B). When A=1, B=1: A AND B = 1, so Y = NOT(1) = 0. NAND gives 0 only when both inputs are 1.",
    "correct_answer": "B",
    "concept_tags": ["logic-gates", "NAND-gate", "boolean-algebra"],
    "topic": "Transistor, Logic Gates, and Amplifiers",
    "subtopic": "NAND gate truth table",
    "subject": "cuet-physics",
    "chapter": "Electronic Devices",
    "bloom_level": "remember",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "1", "is_correct": False},
      {"key": "B", "text": "0", "is_correct": True},
      {"key": "C", "text": "Undefined", "is_correct": False},
      {"key": "D", "text": "Toggles between 0 and 1", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "1 would be the output of an AND gate, not NAND. NAND is the complement of AND.", "misconception": "Confusing AND with NAND"},
      {"option_key": "C", "hint": "Logic gates always have a defined output for given inputs.", "misconception": None},
      {"option_key": "D", "hint": "With fixed inputs, the output is fixed — no toggling.", "misconception": None}
    ]
  },
  {
    "id": "cuet-phy-semi-transistor-ls01",
    "chapter_id": "cuet-phy-electronic-devices",
    "question_type": "logical-sequence",
    "difficulty": "medium",
    "question_text": "Arrange the following transistor operating regions in order of increasing collector current for a given base current:\n(I) Cut-off region\n(II) Active region\n(III) Saturation region",
    "explanation": "In cut-off: both junctions reverse biased, Ic ≈ 0. In active: base-emitter forward, collector-base reverse, Ic = βIb (moderate). In saturation: both forward biased, Ic reaches maximum. Order: cut-off < active < saturation.",
    "correct_answer": "A",
    "concept_tags": ["transistor-regions", "cut-off", "active", "saturation"],
    "topic": "Transistor, Logic Gates, and Amplifiers",
    "subtopic": "Transistor operating regions",
    "subject": "cuet-physics",
    "chapter": "Electronic Devices",
    "bloom_level": "understand",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "I → II → III", "is_correct": True},
      {"key": "B", "text": "III → II → I", "is_correct": False},
      {"key": "C", "text": "II → I → III", "is_correct": False},
      {"key": "D", "text": "I → III → II", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "This is decreasing order. Cut-off has minimum Ic.", "misconception": "Reversing the order"},
      {"option_key": "C", "hint": "Cut-off has essentially zero Ic — it cannot be between active and saturation.", "misconception": None},
      {"option_key": "D", "hint": "In active region, Ic = βIb. In saturation, Ic is at maximum. Active comes before saturation.", "misconception": "Confusing active and saturation regions"}
    ]
  }
],

# ──────────────────────────────────────────────────────────────────
# ELECTROSTATICS
# ──────────────────────────────────────────────────────────────────
"phy-pot-capacitor-copied.json": [
  {
    "id": "cuet-phy-pot-cap-d01",
    "chapter_id": "cuet-phy-electrostatics",
    "question_type": "diagram-based",
    "difficulty": "medium",
    "question_text": "The diagram shows a parallel plate capacitor with plate area A and separation d. If the separation is doubled while keeping the charge constant, what happens to the energy stored?",
    "image_uri": "diagrams/cuet-phy-pot-cap-d01.png",
    "image_alt": "Two parallel plates with charges +Q and −Q, separation d, electric field E between them. Arrow showing d increasing to 2d.",
    "explanation": "At constant charge Q: U = Q²/(2C) = Q²d/(2ε₀A). If d → 2d, then U → 2U. Energy doubles because work is done against the attractive force to pull the plates apart.",
    "correct_answer": "C",
    "concept_tags": ["parallel-plate-capacitor", "energy-stored", "charge-constant"],
    "topic": "Capacitors and Capacitance",
    "subtopic": "Energy in a capacitor",
    "subject": "cuet-physics",
    "chapter": "Electrostatics",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "Halved", "is_correct": False},
      {"key": "B", "text": "Remains the same", "is_correct": False},
      {"key": "C", "text": "Doubled", "is_correct": True},
      {"key": "D", "text": "Quadrupled", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "Energy halves if V is constant (U = CV²/2, C halves). But here charge is constant.", "misconception": "Confusing constant charge with constant voltage"},
      {"option_key": "B", "hint": "Changing plate separation changes capacitance, which changes stored energy.", "misconception": None},
      {"option_key": "D", "hint": "U ∝ d (at constant Q), so doubling d doubles U, not quadruples.", "misconception": "Using d² instead of d"}
    ]
  },
  {
    "id": "cuet-phy-pot-cap-d02",
    "chapter_id": "cuet-phy-electrostatics",
    "question_type": "diagram-based",
    "difficulty": "easy",
    "question_text": "The diagram shows a capacitor being charged through a resistor. The graph shows the voltage across the capacitor vs time. What is the voltage at time t = RC (one time constant)?",
    "image_uri": "diagrams/cuet-phy-pot-cap-d02.png",
    "image_alt": "RC charging curve: voltage rises exponentially from 0 toward V₀. Time constant τ=RC marked on x-axis. Voltage at τ marked with dashed lines.",
    "explanation": "During charging: V(t) = V₀(1 − e⁻ᵗ/ᴿᶜ). At t = RC: V = V₀(1 − e⁻¹) = V₀(1 − 0.368) = 0.632V₀ ≈ 63.2% of maximum voltage.",
    "correct_answer": "B",
    "concept_tags": ["RC-circuit", "time-constant", "charging-curve"],
    "topic": "Capacitors and Capacitance",
    "subtopic": "RC charging circuit",
    "subject": "cuet-physics",
    "chapter": "Electrostatics",
    "bloom_level": "remember",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "50% of V₀", "is_correct": False},
      {"key": "B", "text": "63.2% of V₀", "is_correct": True},
      {"key": "C", "text": "37% of V₀", "is_correct": False},
      {"key": "D", "text": "100% of V₀", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "50% is reached at t = 0.693RC (= RC × ln2), not at t = RC.", "misconception": "Confusing half-life with time constant"},
      {"option_key": "C", "hint": "37% = e⁻¹ is the fraction remaining to charge, not the fraction charged.", "misconception": "Using e⁻¹ instead of (1−e⁻¹)"},
      {"option_key": "D", "hint": "100% is only reached at t → ∞. The capacitor charges asymptotically.", "misconception": None}
    ]
  },
  {
    "id": "cuet-phy-pot-cap-ls01",
    "chapter_id": "cuet-phy-electrostatics",
    "question_type": "logical-sequence",
    "difficulty": "medium",
    "question_text": "Arrange the following capacitor configurations in order of increasing equivalent capacitance, given three identical capacitors each of capacitance C:\n(I) All three in series\n(II) All three in parallel\n(III) Two in series, combination in parallel with the third",
    "explanation": "Series: 1/Ceq = 1/C + 1/C + 1/C → Ceq = C/3. Two series + parallel: Ceq = C/2 + C = 3C/2. All parallel: Ceq = 3C. Order: C/3 < 3C/2 < 3C → I → III → II.",
    "correct_answer": "A",
    "concept_tags": ["capacitor-combinations", "series-parallel", "equivalent-capacitance"],
    "topic": "Capacitors and Capacitance",
    "subtopic": "Capacitor combinations",
    "subject": "cuet-physics",
    "chapter": "Electrostatics",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "I → III → II", "is_correct": True},
      {"key": "B", "text": "II → III → I", "is_correct": False},
      {"key": "C", "text": "I → II → III", "is_correct": False},
      {"key": "D", "text": "III → I → II", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "This is the order of decreasing capacitance.", "misconception": "Reversing the order"},
      {"option_key": "C", "hint": "All parallel (3C) > two-series-plus-one-parallel (3C/2).", "misconception": "Thinking all parallel gives less than mixed"},
      {"option_key": "D", "hint": "All series (C/3) gives the smallest capacitance, not the mixed configuration.", "misconception": None}
    ]
  }
],

"phy-pot-dielectric-copied.json": [
  {
    "id": "cuet-phy-pot-dielec-d01",
    "chapter_id": "cuet-phy-electrostatics",
    "question_type": "diagram-based",
    "difficulty": "medium",
    "question_text": "The diagram shows a parallel plate capacitor with a dielectric slab of dielectric constant K = 3 inserted to fill half the space between the plates (half the thickness). If the original capacitance is C₀, what is the new capacitance?",
    "image_uri": "diagrams/cuet-phy-pot-dielec-d01.png",
    "image_alt": "Parallel plate capacitor with total separation d. Bottom half (d/2) filled with dielectric K=3, top half (d/2) is air. Equivalent to two capacitors in series.",
    "explanation": "This is equivalent to two capacitors in series: C₁ = Kε₀A/(d/2) = 2Kε₀A/d = 2KC₀ and C₂ = ε₀A/(d/2) = 2ε₀A/d = 2C₀. In series: 1/C = 1/(2KC₀) + 1/(2C₀) = (1+K)/(2KC₀). So C = 2KC₀/(1+K) = 2(3)C₀/(1+3) = 6C₀/4 = 1.5C₀.",
    "correct_answer": "C",
    "concept_tags": ["dielectric", "capacitance", "series-combination"],
    "topic": "Combination of Capacitors and Dielectrics",
    "subtopic": "Capacitor with partial dielectric",
    "subject": "cuet-physics",
    "chapter": "Electrostatics",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "3C₀", "is_correct": False},
      {"key": "B", "text": "2C₀", "is_correct": False},
      {"key": "C", "text": "1.5C₀", "is_correct": True},
      {"key": "D", "text": "C₀/3", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "3C₀ would be the capacitance if the entire gap were filled with dielectric.", "misconception": "Treating half-filled as fully filled"},
      {"option_key": "B", "hint": "2C₀ would result from an incorrect series combination formula.", "misconception": None},
      {"option_key": "D", "hint": "C₀/3 would mean capacitance decreased, but adding dielectric always increases capacitance.", "misconception": "Dividing by K instead of using series formula"}
    ]
  },
  {
    "id": "cuet-phy-pot-dielec-d02",
    "chapter_id": "cuet-phy-electrostatics",
    "question_type": "diagram-based",
    "difficulty": "hard",
    "question_text": "The circuit shows three capacitors: C₁ = 2μF, C₂ = 3μF in series, and this combination in parallel with C₃ = 4μF, connected to a 10V battery. What is the charge on C₃?",
    "image_uri": "diagrams/cuet-phy-pot-dielec-d02.png",
    "image_alt": "Circuit: C1=2μF and C2=3μF in series, their combination in parallel with C3=4μF, across 10V battery.",
    "explanation": "C₃ is directly across the battery (parallel branch), so V across C₃ = 10 V. Charge on C₃ = C₃ × V = 4μF × 10V = 40 μC.",
    "correct_answer": "D",
    "concept_tags": ["capacitor-circuit", "charge", "parallel-combination"],
    "topic": "Combination of Capacitors and Dielectrics",
    "subtopic": "Charge in capacitor circuits",
    "subject": "cuet-physics",
    "chapter": "Electrostatics",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "12 μC", "is_correct": False},
      {"key": "B", "text": "24 μC", "is_correct": False},
      {"key": "C", "text": "30 μC", "is_correct": False},
      {"key": "D", "text": "40 μC", "is_correct": True}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "12 μC = series combination charge (C_series × 10V = 1.2μF × 10V). That's for the series branch, not C₃.", "misconception": "Calculating charge on wrong branch"},
      {"option_key": "B", "hint": "24 μC comes from using wrong capacitance value.", "misconception": None},
      {"option_key": "C", "hint": "30 μC = 3μF × 10V — using C₂ instead of C₃.", "misconception": "Confusing which capacitor is in parallel"}
    ]
  },
  {
    "id": "cuet-phy-pot-dielec-ls01",
    "chapter_id": "cuet-phy-electrostatics",
    "question_type": "logical-sequence",
    "difficulty": "easy",
    "question_text": "Arrange the following materials in order of increasing dielectric constant:\n(I) Vacuum\n(II) Air\n(III) Paper\n(IV) Water",
    "explanation": "Dielectric constants: Vacuum = 1 (exact), Air ≈ 1.0006, Paper ≈ 3.7, Water ≈ 80. Order: I → II → III → IV.",
    "correct_answer": "A",
    "concept_tags": ["dielectric-constant", "materials", "permittivity"],
    "topic": "Combination of Capacitors and Dielectrics",
    "subtopic": "Dielectric constants of materials",
    "subject": "cuet-physics",
    "chapter": "Electrostatics",
    "bloom_level": "remember",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "I → II → III → IV", "is_correct": True},
      {"key": "B", "text": "IV → III → II → I", "is_correct": False},
      {"key": "C", "text": "I → II → IV → III", "is_correct": False},
      {"key": "D", "text": "II → I → III → IV", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "This is the order of decreasing dielectric constant.", "misconception": "Reversing the order"},
      {"option_key": "C", "hint": "Water has a very high dielectric constant (~80) — much higher than paper (~3.7).", "misconception": "Underestimating water's dielectric constant"},
      {"option_key": "D", "hint": "Vacuum has the lowest possible dielectric constant (exactly 1), lower than air.", "misconception": "Thinking air has lower K than vacuum"}
    ]
  }
],

"phy-pot-potential-copied.json": [
  {
    "id": "cuet-phy-pot-potential-d01",
    "chapter_id": "cuet-phy-electrostatics",
    "question_type": "diagram-based",
    "difficulty": "medium",
    "question_text": "The diagram shows equipotential surfaces around a positive point charge. The surfaces are concentric spheres at potentials 60V, 30V, and 20V. What is the ratio of radii r₁:r₂:r₃ of these surfaces?",
    "image_uri": "diagrams/cuet-phy-pot-potential-d01.png",
    "image_alt": "Three concentric circles (equipotential surfaces) around a positive charge. Inner circle: 60V, middle: 30V, outer: 20V",
    "explanation": "For a point charge: V = kQ/r, so r = kQ/V. r₁ = kQ/60, r₂ = kQ/30, r₃ = kQ/20. Ratio r₁:r₂:r₃ = 1/60 : 1/30 : 1/20 = 1:2:3.",
    "correct_answer": "B",
    "concept_tags": ["equipotential-surfaces", "point-charge", "electric-potential"],
    "topic": "Electric Potential and Potential Energy",
    "subtopic": "Equipotential surfaces",
    "subject": "cuet-physics",
    "chapter": "Electrostatics",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "3 : 2 : 1", "is_correct": False},
      {"key": "B", "text": "1 : 2 : 3", "is_correct": True},
      {"key": "C", "text": "1 : 1 : 1", "is_correct": False},
      {"key": "D", "text": "6 : 3 : 2", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "3:2:1 would mean higher potential at larger radius, but V decreases with r for a positive charge.", "misconception": "Thinking V ∝ r instead of V ∝ 1/r"},
      {"option_key": "C", "hint": "Equal radii would mean equal potentials on all surfaces.", "misconception": None},
      {"option_key": "D", "hint": "6:3:2 = V₁:V₂:V₃ ratio, but radius is inversely proportional to V.", "misconception": "Using V ratio instead of 1/V ratio"}
    ]
  },
  {
    "id": "cuet-phy-pot-potential-d02",
    "chapter_id": "cuet-phy-electrostatics",
    "question_type": "diagram-based",
    "difficulty": "easy",
    "question_text": "The graph shows the variation of electric potential (V) along the x-axis due to two equal positive charges placed at x = −a and x = +a. What is the potential at the midpoint (x = 0)?",
    "image_uri": "diagrams/cuet-phy-pot-potential-d02.png",
    "image_alt": "V vs x graph showing two peaks at x=−a and x=+a (locations of charges), with a local minimum at x=0 that is still positive. Potential approaches zero far from charges.",
    "explanation": "At midpoint x = 0, distance from each charge is a. V = kQ/a + kQ/a = 2kQ/a. The potential is maximum along the line if we only consider the midpoint between the charges — it's actually a saddle point (minimum along x but maximum in perpendicular directions). But V at x=0 is simply 2kQ/a, which is positive and non-zero.",
    "correct_answer": "C",
    "concept_tags": ["superposition", "electric-potential", "two-charges"],
    "topic": "Electric Potential and Potential Energy",
    "subtopic": "Potential due to charge system",
    "subject": "cuet-physics",
    "chapter": "Electrostatics",
    "bloom_level": "understand",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "Zero", "is_correct": False},
      {"key": "B", "text": "kQ/a", "is_correct": False},
      {"key": "C", "text": "2kQ/a", "is_correct": True},
      {"key": "D", "text": "kQ/2a", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "The electric FIELD is zero at the midpoint (by symmetry), but potential is a scalar and adds up, not cancels.", "misconception": "Confusing zero field with zero potential"},
      {"option_key": "B", "hint": "kQ/a is the contribution from one charge only. Both charges contribute equally.", "misconception": "Counting only one charge"},
      {"option_key": "D", "hint": "kQ/2a would mean the distance from each charge is 2a, but it's only a.", "misconception": "Using wrong distance"}
    ]
  },
  {
    "id": "cuet-phy-pot-potential-ls01",
    "chapter_id": "cuet-phy-electrostatics",
    "question_type": "logical-sequence",
    "difficulty": "medium",
    "question_text": "Arrange the following quantities in order of increasing value for a positive point charge Q at distances r, 2r, and 3r:\n(I) Potential at 3r\n(II) Potential at r\n(III) Potential at 2r",
    "explanation": "V = kQ/r, so V(r) = kQ/r, V(2r) = kQ/2r, V(3r) = kQ/3r. Increasing order: V(3r) < V(2r) < V(r), i.e., I → III → II.",
    "correct_answer": "A",
    "concept_tags": ["electric-potential", "distance-dependence", "point-charge"],
    "topic": "Electric Potential and Potential Energy",
    "subtopic": "Potential variation with distance",
    "subject": "cuet-physics",
    "chapter": "Electrostatics",
    "bloom_level": "understand",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "I → III → II", "is_correct": True},
      {"key": "B", "text": "II → III → I", "is_correct": False},
      {"key": "C", "text": "I → II → III", "is_correct": False},
      {"key": "D", "text": "III → I → II", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "This is the order of decreasing potential.", "misconception": "Reversing the order"},
      {"option_key": "C", "hint": "V at r is the highest (closest to charge), so II should be last.", "misconception": "Thinking closer means lower potential"},
      {"option_key": "D", "hint": "V at 2r is between V at r and V at 3r.", "misconception": None}
    ]
  }
],

# ──────────────────────────────────────────────────────────────────
# ELECTROMAGNETIC INDUCTION AND AC
# ──────────────────────────────────────────────────────────────────
"phy-ac-circuits-copied.json": [
  {
    "id": "cuet-phy-ac-circuits-d01",
    "chapter_id": "cuet-phy-em-induction",
    "question_type": "diagram-based",
    "difficulty": "medium",
    "question_text": "The phasor diagram shows the voltage across resistor (VR), inductor (VL), and capacitor (VC) in a series LCR circuit. VL > VC. What is the phase relationship between the source voltage and current?",
    "image_uri": "diagrams/cuet-phy-ac-circuits-d01.png",
    "image_alt": "Phasor diagram: VR along x-axis (horizontal), VL pointing up, VC pointing down. VL > VC. Resultant voltage V at angle φ above VR.",
    "explanation": "When VL > VC, the net reactive voltage (VL − VC) is positive (inductive). The resultant voltage V leads VR (which is in phase with current) by angle φ = tan⁻¹((VL−VC)/VR). So voltage leads current — the circuit is inductive.",
    "correct_answer": "B",
    "concept_tags": ["phasor-diagram", "LCR-circuit", "phase-angle"],
    "topic": "AC Circuits (R, L, C, LCR Series)",
    "subtopic": "Phasor diagram of LCR circuit",
    "subject": "cuet-physics",
    "chapter": "Electromagnetic Induction and AC",
    "bloom_level": "analyze",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "Voltage lags current", "is_correct": False},
      {"key": "B", "text": "Voltage leads current", "is_correct": True},
      {"key": "C", "text": "Voltage and current are in phase", "is_correct": False},
      {"key": "D", "text": "Voltage and current are 90° out of phase", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "Voltage lags current when VC > VL (capacitive circuit), but here VL > VC.", "misconception": "Confusing inductive and capacitive behavior"},
      {"option_key": "C", "hint": "In-phase occurs only at resonance (VL = VC), but here VL ≠ VC.", "misconception": "Assuming resonance condition"},
      {"option_key": "D", "hint": "90° phase occurs in purely inductive or capacitive circuits, not in LCR with resistance.", "misconception": None}
    ]
  },
  {
    "id": "cuet-phy-ac-circuits-d02",
    "chapter_id": "cuet-phy-em-induction",
    "question_type": "diagram-based",
    "difficulty": "hard",
    "question_text": "The graph shows the variation of impedance (Z) with frequency (f) for a series LCR circuit. At what frequency is the impedance minimum?",
    "image_uri": "diagrams/cuet-phy-ac-circuits-d02.png",
    "image_alt": "Z vs f graph showing a V-shaped curve with minimum at resonant frequency f₀. Z decreases before f₀ and increases after f₀. Minimum Z = R.",
    "explanation": "In a series LCR circuit, Z = √(R² + (XL−XC)²). Z is minimum when XL = XC (resonance), giving Z_min = R. This occurs at resonant frequency f₀ = 1/(2π√LC).",
    "correct_answer": "A",
    "concept_tags": ["impedance", "resonance", "resonant-frequency"],
    "topic": "AC Circuits (R, L, C, LCR Series)",
    "subtopic": "Impedance vs frequency",
    "subject": "cuet-physics",
    "chapter": "Electromagnetic Induction and AC",
    "bloom_level": "understand",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "At resonant frequency f₀ = 1/(2π√LC)", "is_correct": True},
      {"key": "B", "text": "At f = 0 (DC)", "is_correct": False},
      {"key": "C", "text": "At very high frequency", "is_correct": False},
      {"key": "D", "text": "At f = R/(2πL)", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "B", "hint": "At f = 0, XC = 1/(2πfC) → ∞, so Z → ∞. This is maximum, not minimum.", "misconception": "Thinking DC gives minimum impedance"},
      {"option_key": "C", "hint": "At high f, XL = 2πfL → ∞, so Z → ∞ again.", "misconception": None},
      {"option_key": "D", "hint": "R/(2πL) is related to the time constant of RL circuit, not resonance of LCR.", "misconception": "Confusing RL time constant with LCR resonance"}
    ]
  },
  {
    "id": "cuet-phy-ac-circuits-ls01",
    "chapter_id": "cuet-phy-em-induction",
    "question_type": "logical-sequence",
    "difficulty": "medium",
    "question_text": "Arrange the following AC circuit elements in order of increasing phase difference between voltage across the element and current through it:\n(I) Pure resistor\n(II) Pure inductor\n(III) Pure capacitor\n(IV) Series LCR at resonance",
    "explanation": "Pure resistor: φ = 0°. LCR at resonance: φ = 0° (XL = XC cancel). Pure capacitor: φ = 90° (V lags I). Pure inductor: φ = 90° (V leads I). Taking magnitude: 0° = 0° < 90° = 90°. So (I,IV) < (II,III). All with 0° first, then 90°.",
    "correct_answer": "C",
    "concept_tags": ["phase-difference", "AC-elements", "resonance"],
    "topic": "AC Circuits (R, L, C, LCR Series)",
    "subtopic": "Phase relationships in AC circuits",
    "subject": "cuet-physics",
    "chapter": "Electromagnetic Induction and AC",
    "bloom_level": "understand",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "III → I → IV → II", "is_correct": False},
      {"key": "B", "text": "II → III → I → IV", "is_correct": False},
      {"key": "C", "text": "I = IV → II = III (0°, 0°, 90°, 90°)", "is_correct": True},
      {"key": "D", "text": "I → IV → III → II", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "Capacitor and inductor both have 90° phase difference, same magnitude.", "misconception": None},
      {"option_key": "B", "hint": "Resistor and LCR at resonance both have 0° phase difference.", "misconception": "Thinking resonance has non-zero phase"},
      {"option_key": "D", "hint": "LCR at resonance behaves like a pure resistor (φ = 0°), same as I.", "misconception": None}
    ]
  }
],

"phy-ac-transformer-copied.json": [
  {
    "id": "cuet-phy-ac-transform-d01",
    "chapter_id": "cuet-phy-em-induction",
    "question_type": "diagram-based",
    "difficulty": "easy",
    "question_text": "The diagram shows a step-up transformer with primary coil having 100 turns and secondary coil having 500 turns. If the input voltage is 220 V, what is the output voltage?",
    "image_uri": "diagrams/cuet-phy-ac-transform-d01.png",
    "image_alt": "Transformer with iron core, primary coil (Np=100 turns, 220V input) on left, secondary coil (Ns=500 turns, V=?) on right",
    "explanation": "For an ideal transformer: Vs/Vp = Ns/Np. So Vs = Vp × Ns/Np = 220 × 500/100 = 220 × 5 = 1100 V.",
    "correct_answer": "D",
    "concept_tags": ["transformer", "turns-ratio", "step-up"],
    "topic": "Resonance, Power Factor, and Transformers",
    "subtopic": "Transformer turns ratio",
    "subject": "cuet-physics",
    "chapter": "Electromagnetic Induction and AC",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "44 V", "is_correct": False},
      {"key": "B", "text": "220 V", "is_correct": False},
      {"key": "C", "text": "550 V", "is_correct": False},
      {"key": "D", "text": "1100 V", "is_correct": True}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "44 V = 220/5 — you divided instead of multiplied. This would be the step-down result.", "misconception": "Inverting the turns ratio"},
      {"option_key": "B", "hint": "220 V would mean no transformation — the turns ratio is 5:1, not 1:1.", "misconception": None},
      {"option_key": "C", "hint": "550 V = 220 × 500/200 — check the denominator, it's 100, not 200.", "misconception": "Arithmetic error in turns ratio"}
    ]
  },
  {
    "id": "cuet-phy-ac-transform-d02",
    "chapter_id": "cuet-phy-em-induction",
    "question_type": "diagram-based",
    "difficulty": "hard",
    "question_text": "The graph shows the variation of current (I) with frequency (f) in a series LCR circuit near resonance. The resonant frequency is f₀ = 500 Hz and the half-power frequencies are f₁ = 490 Hz and f₂ = 510 Hz. What is the quality factor Q of the circuit?",
    "image_uri": "diagrams/cuet-phy-ac-transform-d02.png",
    "image_alt": "I vs f resonance curve: sharp peak at f₀=500Hz. Half-power points at f₁=490Hz and f₂=510Hz where I = Imax/√2. Bandwidth Δf = 20Hz.",
    "explanation": "Quality factor Q = f₀/Δf = f₀/(f₂ − f₁) = 500/(510 − 490) = 500/20 = 25. Higher Q means sharper resonance peak.",
    "correct_answer": "C",
    "concept_tags": ["quality-factor", "resonance", "bandwidth"],
    "topic": "Resonance, Power Factor, and Transformers",
    "subtopic": "Quality factor of LCR circuit",
    "subject": "cuet-physics",
    "chapter": "Electromagnetic Induction and AC",
    "bloom_level": "apply",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "10", "is_correct": False},
      {"key": "B", "text": "50", "is_correct": False},
      {"key": "C", "text": "25", "is_correct": True},
      {"key": "D", "text": "500", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "Q = 10 would mean bandwidth = 50 Hz, but here it's only 20 Hz.", "misconception": None},
      {"option_key": "B", "hint": "Q = 50 would mean bandwidth = 10 Hz. The bandwidth is f₂ − f₁ = 20 Hz.", "misconception": "Using wrong bandwidth calculation"},
      {"option_key": "D", "hint": "500 is the resonant frequency itself, not the quality factor.", "misconception": "Confusing f₀ with Q"}
    ]
  },
  {
    "id": "cuet-phy-ac-transform-ls01",
    "chapter_id": "cuet-phy-em-induction",
    "question_type": "logical-sequence",
    "difficulty": "medium",
    "question_text": "Arrange the following steps in long-distance power transmission in the correct order:\n(I) Step-down transformer at city substation\n(II) Power generation at power plant\n(III) Step-up transformer at power plant\n(IV) High-voltage transmission through power lines",
    "explanation": "Power is generated (II), stepped up to high voltage for efficient transmission (III), sent through power lines (IV), then stepped down for consumer use (I).",
    "correct_answer": "B",
    "concept_tags": ["power-transmission", "transformer", "efficiency"],
    "topic": "Resonance, Power Factor, and Transformers",
    "subtopic": "Power transmission system",
    "subject": "cuet-physics",
    "chapter": "Electromagnetic Induction and AC",
    "bloom_level": "remember",
    "exam_suitability": ["CUET", "NEET"],
    "options": [
      {"key": "A", "text": "II → IV → III → I", "is_correct": False},
      {"key": "B", "text": "II → III → IV → I", "is_correct": True},
      {"key": "C", "text": "III → II → IV → I", "is_correct": False},
      {"key": "D", "text": "II → III → I → IV", "is_correct": False}
    ],
    "elimination_hints": [
      {"option_key": "A", "hint": "You must step-up before transmitting — sending low voltage over long lines wastes energy as heat (I²R losses).", "misconception": "Skipping the step-up transformer"},
      {"option_key": "C", "hint": "Power must be generated before it can be transformed.", "misconception": None},
      {"option_key": "D", "hint": "Step-down happens at the receiving end, not before transmission.", "misconception": "Reversing step-down and transmission order"}
    ]
  }
],

}

# ============================================================================
# PROCESSING LOGIC (same as batch 1)
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
