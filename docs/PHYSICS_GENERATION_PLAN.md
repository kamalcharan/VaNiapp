# Physics Question Generation — Master Execution Plan

> **Created:** 2026-02-26
> **Target:** 20 questions per topic, ~1,420 total
> **Total Topics:** 71 | **Total Batches:** 71 | **Total Questions:** 1,420

---

## Approach

- **1 batch = 1 topic = 20 questions** (fits comfortably in one context window)
- Each batch outputs a single JSON file saved to `Qbank/generated/physics/{chapter-slug}/`
- After generation, import via `Qbank/import.html` or direct Supabase insert
- Question type mix per 20-question batch:
  - 12 MCQ (60%)
  - 2 Assertion-Reasoning (10%)
  - 2 Match-the-Following (10%)
  - 2 True-False (10%)
  - 1 Fill-in-Blanks (5%)
  - 1 Scenario-Based (5%)
- Difficulty mix: 5 Easy (25%), 10 Medium (50%), 5 Hard (25%)

---

## Unique Question IDs

Every question **must** have a deterministic `id` field in the JSON:

```
Format:  {topic_id}-{nn}
Example: phy-newton-laws-01, phy-newton-laws-02, ... phy-newton-laws-20
```

**Rules:**
- `topic_id` = the batch's Topic ID from the registry below (already unique per topic)
- `nn` = zero-padded question number within the batch (01–20)
- **Deterministic** — running the same batch twice produces the same IDs (no random UUIDs)
- **No duplicates** — topic_id is unique across the entire Qbank, so every question ID is globally unique
- The `id` field goes at the **top level** of each question object alongside `question_type`, `difficulty`, etc.

**Duplicate prevention (3 layers):**
1. **Plan status** — skip any batch already marked `DONE` in this file
2. **File existence** — skip if `Qbank/generated/physics/{chapter-slug}/{topic_id}.json` already exists on disk
3. **Supabase upsert** — `import.html` should upsert on `id`, not blind insert

---

## Multi-Session Orchestration

The full Qbank (~1,420 questions, 71 batches) requires multiple Claude Code sessions.
Each session can handle ~13 batches (~260 questions) before hitting context limits.

**How it works — the plan file IS the state machine:**

```
Session N starts
  → reads this file (PHYSICS_GENERATION_PLAN.md)
  → scans Batch Registry for first PENDING batch
  → generates batches sequentially until ~13 done or context limit
  → marks each batch DONE in this file after saving JSON
  → commits & pushes (plan + JSONs)
  → session ends

Session N+1 starts
  → reads this file again
  → skips all DONE batches
  → picks up from first PENDING
  → repeats
```

**Session kickoff prompt (same every time):**

```
Read docs/PHYSICS_GENERATION_PLAN.md and docs/QBANK_AGENT.md.
Find the next PENDING batches in the Batch Registry.
Generate up to 13 batches (260 questions), following the Per-Batch Execution Protocol.
Use any existing zoo JSON file as the reference format (e.g., read one from Qbank/generated/zoo/biotechnology-applications/zoo-bioapp-transgenic.json).
Each question must have a unique "id" field: {topic_id}-{nn} (e.g. phy-newton-laws-01).
Skip any batch whose JSON file already exists in Qbank/generated/physics/.
Mark each batch DONE after saving. Commit and push after all batches are complete.
```

**Estimated sessions needed:** ~6 sessions (71 batches ÷ 13 per session)

---

## Batch Registry

---

### MECHANICS (Class 11)

---

### Chapter 1: Physical World (`phy-world`) — 1 batch

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B01 | `phy-world` | Nature of Physical Laws, Fundamental Forces, and Scientific Method | 20 | PENDING |
| | | **Chapter 1 Total** | **20** | |

### Chapter 2: Units and Measurements (`phy-units`) — 2 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B02 | `phy-units-dimensions` | Units, Dimensions, and Dimensional Analysis | 20 | PENDING |
| B03 | `phy-units-errors` | Errors in Measurement and Significant Figures | 20 | DONE |
| | | **Chapter 2 Total** | **40** | |

### Chapter 3: Motion in a Straight Line (`phy-motion1d`) — 2 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B04 | `phy-motion1d-kinematics` | Kinematic Equations and Uniform Acceleration | 20 | DONE |
| B05 | `phy-motion1d-graphs` | Position-Time and Velocity-Time Graphs | 20 | PENDING |
| | | **Chapter 3 Total** | **40** | |

### Chapter 4: Motion in a Plane (`phy-motion2d`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B06 | `phy-motion2d-vectors` | Vectors: Addition, Subtraction, and Resolution | 20 | DONE |
| B07 | `phy-motion2d-projectile` | Projectile Motion | 20 | DONE |
| B08 | `phy-motion2d-circular` | Uniform Circular Motion | 20 | DONE |
| | | **Chapter 4 Total** | **60** | |

### Chapter 5: Laws of Motion (`phy-newton`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B09 | `phy-newton-laws` | Newton's Laws of Motion | 20 | DONE |
| B10 | `phy-newton-friction` | Friction (Static, Kinetic, Rolling) | 20 | DONE |
| B11 | `phy-newton-circular` | Circular Motion Dynamics and Applications | 20 | DONE |
| | | **Chapter 5 Total** | **60** | |

### Chapter 6: Work, Energy and Power (`phy-energy`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B12 | `phy-energy-work` | Work-Energy Theorem | 20 | DONE |
| B13 | `phy-energy-conservation` | Conservation of Energy and Types of Energy | 20 | DONE |
| B14 | `phy-energy-collisions` | Power and Collisions (Elastic, Inelastic) | 20 | DONE |
| | | **Chapter 6 Total** | **60** | |

### Chapter 7: System of Particles and Rotational Motion (`phy-rotation`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B15 | `phy-rot-com` | Centre of Mass and System of Particles | 20 | DONE |
| B16 | `phy-rot-moment` | Moment of Inertia and Theorems | 20 | DONE |
| B17 | `phy-rot-dynamics` | Torque, Angular Momentum, and Rolling Motion | 20 | DONE |
| | | **Chapter 7 Total** | **60** | |

### Chapter 8: Gravitation (`phy-gravitation`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B18 | `phy-grav-law` | Universal Law of Gravitation and Gravitational Field | 20 | DONE |
| B19 | `phy-grav-potential` | Gravitational Potential Energy and Escape Velocity | 20 | DONE |
| B20 | `phy-grav-satellite` | Orbital Velocity, Satellites, and Kepler's Laws | 20 | DONE |
| | | **Chapter 8 Total** | **60** | |

---

### PROPERTIES OF MATTER (Class 11)

---

### Chapter 9: Mechanical Properties of Solids (`phy-solid`) — 2 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B21 | `phy-solid-stress` | Stress, Strain, and Hooke's Law | 20 | PENDING |
| B22 | `phy-solid-moduli` | Elastic Moduli (Young's, Bulk, Shear) and Applications | 20 | PENDING |
| | | **Chapter 9 Total** | **40** | |

### Chapter 10: Mechanical Properties of Fluids (`phy-fluid`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B23 | `phy-fluid-pressure` | Pressure, Pascal's Law, and Hydraulic Machines | 20 | PENDING |
| B24 | `phy-fluid-bernoulli` | Bernoulli's Principle and Viscosity | 20 | PENDING |
| B25 | `phy-fluid-surface` | Surface Tension and Capillarity | 20 | PENDING |
| | | **Chapter 10 Total** | **60** | |

### Chapter 11: Thermal Properties of Matter (`phy-thermal`) — 2 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B26 | `phy-thermal-expansion` | Thermal Expansion and Calorimetry | 20 | PENDING |
| B27 | `phy-thermal-transfer` | Heat Transfer (Conduction, Convection, Radiation) | 20 | PENDING |
| | | **Chapter 11 Total** | **40** | |

---

### THERMODYNAMICS & KINETIC THEORY (Class 11)

---

### Chapter 12: Thermodynamics (`phy-thermodynamics`) — 2 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B28 | `phy-thermo-first` | First Law of Thermodynamics and Thermodynamic Processes | 20 | PENDING |
| B29 | `phy-thermo-second` | Second Law, Carnot Engine, and Refrigerators | 20 | PENDING |
| | | **Chapter 12 Total** | **40** | |

### Chapter 13: Kinetic Theory (`phy-kinetic`) — 2 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B30 | `phy-kinetic-gas` | Kinetic Theory of Ideal Gas and Pressure | 20 | PENDING |
| B31 | `phy-kinetic-speed` | RMS Speed, Mean Free Path, and Degrees of Freedom | 20 | PENDING |
| | | **Chapter 13 Total** | **40** | |

---

### OSCILLATIONS & WAVES (Class 11)

---

### Chapter 14: Oscillations (`phy-oscillations`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B32 | `phy-osc-shm` | Simple Harmonic Motion (Kinematics and Dynamics) | 20 | PENDING |
| B33 | `phy-osc-energy` | Energy in SHM and Oscillating Systems | 20 | PENDING |
| B34 | `phy-osc-pendulum` | Simple Pendulum and Damped/Forced Oscillations | 20 | PENDING |
| | | **Chapter 14 Total** | **60** | |

### Chapter 15: Waves (`phy-waves`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B35 | `phy-wave-types` | Wave Types, Transverse and Longitudinal Waves | 20 | PENDING |
| B36 | `phy-wave-standing` | Standing Waves, Harmonics, and Resonance | 20 | PENDING |
| B37 | `phy-wave-doppler` | Beats, Doppler Effect, and Sound Waves | 20 | PENDING |
| | | **Chapter 15 Total** | **60** | |

---

### ELECTROSTATICS (Class 12)

---

### Chapter 16: Electric Charges and Fields (`phy-electrostatics`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B38 | `phy-elec-coulomb` | Coulomb's Law and Electric Field | 20 | DONE |
| B39 | `phy-elec-dipole` | Electric Dipole and Field Lines | 20 | DONE |
| B40 | `phy-elec-gauss` | Gauss's Law and Applications | 20 | DONE |
| | | **Chapter 16 Total** | **60** | |

### Chapter 17: Electrostatic Potential and Capacitance (`phy-capacitance`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B41 | `phy-pot-potential` | Electric Potential and Potential Energy | 20 | DONE |
| B42 | `phy-pot-capacitor` | Capacitors and Capacitance | 20 | DONE |
| B43 | `phy-pot-dielectric` | Combination of Capacitors and Dielectrics | 20 | DONE |
| | | **Chapter 17 Total** | **60** | |

---

### CURRENT ELECTRICITY (Class 12)

---

### Chapter 18: Current Electricity (`phy-current`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B44 | `phy-current-ohm` | Ohm's Law, Resistance, and Resistivity | 20 | DONE |
| B45 | `phy-current-kirchhoff` | Kirchhoff's Laws and Circuit Analysis | 20 | DONE |
| B46 | `phy-current-instruments` | Wheatstone Bridge, Potentiometer, and Meters | 20 | DONE |
| | | **Chapter 18 Total** | **60** | |

---

### MAGNETISM (Class 12)

---

### Chapter 19: Moving Charges and Magnetism (`phy-magmov`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B47 | `phy-magmov-force` | Force on Moving Charge and Current-Carrying Conductor | 20 | PENDING |
| B48 | `phy-magmov-biot` | Biot-Savart Law and Ampere's Law | 20 | PENDING |
| B49 | `phy-magmov-devices` | Cyclotron, Galvanometer, and Solenoid | 20 | PENDING |
| | | **Chapter 19 Total** | **60** | |

### Chapter 20: Magnetism and Matter (`phy-magmat`) — 2 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B50 | `phy-magmat-dipole` | Magnetic Dipole, Bar Magnet, and Earth's Magnetism | 20 | PENDING |
| B51 | `phy-magmat-materials` | Dia-, Para-, and Ferromagnetic Materials | 20 | PENDING |
| | | **Chapter 20 Total** | **40** | |

---

### ELECTROMAGNETIC INDUCTION & AC (Class 12)

---

### Chapter 21: Electromagnetic Induction (`phy-emi`) — 2 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B52 | `phy-emi-faraday` | Faraday's Law and Lenz's Law | 20 | PENDING |
| B53 | `phy-emi-inductance` | Self and Mutual Inductance, Eddy Currents | 20 | PENDING |
| | | **Chapter 21 Total** | **40** | |

### Chapter 22: Alternating Current (`phy-ac`) — 2 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B54 | `phy-ac-circuits` | AC Circuits (R, L, C, LCR Series) | 20 | PENDING |
| B55 | `phy-ac-transformer` | Resonance, Power Factor, and Transformers | 20 | PENDING |
| | | **Chapter 22 Total** | **40** | |

### Chapter 23: Electromagnetic Waves (`phy-emwave`) — 1 batch

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B56 | `phy-emwave` | Electromagnetic Spectrum, Properties, and Displacement Current | 20 | PENDING |
| | | **Chapter 23 Total** | **20** | |

---

### OPTICS (Class 12)

---

### Chapter 24: Ray Optics and Optical Instruments (`phy-rayopt`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B57 | `phy-ray-reflection` | Reflection, Mirrors, and Refraction at Surfaces | 20 | DONE |
| B58 | `phy-ray-prism` | Total Internal Reflection, Prism, and Dispersion | 20 | DONE |
| B59 | `phy-ray-instruments` | Microscope, Telescope, and Human Eye | 20 | DONE |
| | | **Chapter 24 Total** | **60** | |

### Chapter 25: Wave Optics (`phy-waveopt`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B60 | `phy-waveopt-interference` | Young's Double Slit Experiment and Interference | 20 | PENDING |
| B61 | `phy-waveopt-diffraction` | Diffraction and Resolving Power | 20 | PENDING |
| B62 | `phy-waveopt-polarisation` | Polarisation (Malus's Law, Brewster's Angle) | 20 | PENDING |
| | | **Chapter 25 Total** | **60** | |

---

### MODERN PHYSICS (Class 12)

---

### Chapter 26: Dual Nature of Radiation and Matter (`phy-dual`) — 2 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B63 | `phy-dual-photoelectric` | Photoelectric Effect and Einstein's Equation | 20 | PENDING |
| B64 | `phy-dual-debroglie` | de Broglie Wavelength and Davisson-Germer Experiment | 20 | PENDING |
| | | **Chapter 26 Total** | **40** | |

### Chapter 27: Atoms (`phy-atoms`) — 2 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B65 | `phy-atom-bohr` | Bohr Model and Hydrogen Spectrum | 20 | PENDING |
| B66 | `phy-atom-spectra` | Spectral Series and Energy Levels | 20 | PENDING |
| | | **Chapter 27 Total** | **40** | |

### Chapter 28: Nuclei (`phy-nuclei`) — 2 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B67 | `phy-nuclei-properties` | Nuclear Properties, Size, and Binding Energy | 20 | PENDING |
| B68 | `phy-nuclei-decay` | Radioactivity, Nuclear Fission, and Fusion | 20 | PENDING |
| | | **Chapter 28 Total** | **40** | |

### Chapter 29: Semiconductor Electronics (`phy-semi`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B69 | `phy-semi-pn` | p-n Junction Diode and Characteristics | 20 | PENDING |
| B70 | `phy-semi-diode` | Diode Applications (Rectifier, Zener, LED, Photodiode) | 20 | PENDING |
| B71 | `phy-semi-transistor` | Transistor, Logic Gates, and Amplifiers | 20 | PENDING |
| | | **Chapter 29 Total** | **60** | |

---

## Grand Total

| Metric | Count |
|--------|-------|
| Chapters | 29 |
| Topics / Batches | 71 |
| Questions per topic | 20 |
| **Total Questions** | **1,420** |

---

## Per-Batch Execution Protocol

Each batch (= 1 new session/context) follows this exact protocol:

### Step 1: Read Context
```
Read: docs/PHYSICS_GENERATION_PLAN.md  (find your batch)
Read: docs/QBANK_AGENT.md             (prompt templates)
Read: Qbank/generated/zoo/biotechnology-applications/zoo-bioapp-transgenic.json (reference format)
```

### Step 2: Generate 20 Questions
Using the prompt templates from QBANK_AGENT.md, generate exactly 20 questions:

**Type breakdown per batch:**
| Type | Count | Difficulty Split |
|------|-------|------------------|
| MCQ | 12 | 4 easy, 6 medium, 2 hard |
| Assertion-Reasoning | 2 | 1 medium, 1 hard |
| Match-the-Following | 2 | 1 medium, 1 hard |
| True-False | 2 | 1 easy (TRUE, answer=A), 1 easy (FALSE, answer=B) |
| Fill-in-Blanks | 1 | medium |
| Scenario-Based | 1 | medium |
| **Total** | **20** | **5E / 10M / 5H** |

**True-False rules:**
- One TRUE question (correct_answer = "A", option A = "True", option B = "False")
- One FALSE question (correct_answer = "B", option A = "True", option B = "False")
- Options C and D must be `"---"` (dummy placeholders)

**Answer key balance:**
- Distribute correct answers: A ≤ 6, B ≤ 6, C ≤ 6, D ≤ 6 (no letter > 6 out of 20)

### Step 3: Save JSON to File
```
Write to: Qbank/generated/physics/{chapter-slug}/{topic_id}.json
```

**Pre-check:** If this file already exists, SKIP this batch (it's already done).

JSON format must be a **plain array** compatible with `Qbank/import.html`:

```json
[
  {
    "id": "phy-newton-laws-01",
    "question_type": "mcq",
    "difficulty": "easy",
    "question_text": "According to Newton's first law, an object at rest will remain at rest unless acted upon by:",
    "explanation": "Newton's first law states that an object continues in its state of rest or uniform motion unless an external unbalanced force acts on it...",
    "correct_answer": "B",
    "concept_tags": ["newton-first-law", "inertia"],
    "topic": "Newton's Laws of Motion",
    "subject": "physics",
    "chapter": "Laws of Motion",
    "bloom_level": "remember",
    "exam_suitability": ["NEET"],
    "options": [
      { "key": "A", "text": "A balanced force", "is_correct": false },
      { "key": "B", "text": "An unbalanced external force", "is_correct": true },
      { "key": "C", "text": "Gravity only", "is_correct": false },
      { "key": "D", "text": "Friction only", "is_correct": false }
    ],
    "elimination_hints": [
      { "option_key": "A", "hint": "A balanced force would not change the state of the object...", "misconception": "Confusing balanced and unbalanced forces" },
      { "option_key": "C", "hint": "Gravity is just one type of force, not the only one that can cause motion...", "misconception": null },
      { "option_key": "D", "hint": "Friction is just one type of force; Newton's first law applies to any external unbalanced force...", "misconception": null }
    ]
  }
]
```

**ID format:** `{topic_id}-{nn}` — e.g., first question is `{topic_id}-01`, last is `{topic_id}-20`.

**IMPORTANT field names (must match import.html):**
- Options: `key`, `text`, `is_correct` (NOT option_key/option_text)
- Hints: `option_key`, `hint`, `misconception` (NOT hint_text)
- Subject: `"physics"` (NOT biology or chemistry)
- Top-level: plain array `[...]` (NO metadata wrapper)

### Step 4: Update Plan Status
Update this file: change batch status from `PENDING` → `DONE`

### Step 5: Commit & Push
```bash
git add Qbank/generated/physics/{chapter-slug}/{topic_id}.json docs/PHYSICS_GENERATION_PLAN.md
git commit -m "Phy Q-gen B{XX}: {topic_name} (20 questions)"
git push
```

---

## Execution Order (Recommended)

Priority based on NEET weightage:

**Phase 1 — High-weight chapters first (Mechanics)**
```
Ch5  Laws of Motion                    (8% wt, 3 topics) → B09-B11
Ch6  Work, Energy and Power            (7% wt, 3 topics) → B12-B14
Ch7  Rotational Motion                 (7% wt, 3 topics) → B15-B17
Ch8  Gravitation                       (5% wt, 3 topics) → B18-B20
Ch4  Motion in a Plane                 (5% wt, 3 topics) → B06-B08
```

**Phase 2 — Electrostatics, Current, Optics, Modern Physics**
```
Ch16 Electric Charges and Fields       (6% wt, 3 topics) → B38-B40
Ch17 Electrostatic Potential           (6% wt, 3 topics) → B41-B43
Ch18 Current Electricity               (7% wt, 3 topics) → B44-B46
Ch24 Ray Optics                        (6% wt, 3 topics) → B57-B59
Ch25 Wave Optics                       (5% wt, 3 topics) → B60-B62
Ch26 Dual Nature                       (4% wt, 2 topics) → B63-B64
Ch27 Atoms                             (3% wt, 2 topics) → B65-B66
Ch28 Nuclei                            (3% wt, 2 topics) → B67-B68
```

**Phase 3 — Magnetism, EMI, AC**
```
Ch19 Moving Charges and Magnetism      (5% wt, 3 topics) → B47-B49
Ch20 Magnetism and Matter              (2% wt, 2 topics) → B50-B51
Ch21 Electromagnetic Induction         (4% wt, 2 topics) → B52-B53
Ch22 Alternating Current               (3% wt, 2 topics) → B54-B55
```

**Phase 4 — Waves, Thermo, Properties of Matter**
```
Ch14 Oscillations                      (4% wt, 3 topics) → B32-B34
Ch15 Waves                             (3% wt, 3 topics) → B35-B37
Ch12 Thermodynamics                    (4% wt, 2 topics) → B28-B29
Ch13 Kinetic Theory                    (2% wt, 2 topics) → B30-B31
Ch9  Mechanical Properties of Solids   (2% wt, 2 topics) → B21-B22
Ch10 Mechanical Properties of Fluids   (3% wt, 3 topics) → B23-B25
Ch11 Thermal Properties of Matter      (2% wt, 2 topics) → B26-B27
```

**Phase 5 — Lower-weight chapters**
```
Ch3  Motion in a Straight Line         (3% wt, 2 topics) → B04-B05
Ch29 Semiconductor Electronics         (3% wt, 3 topics) → B69-B71
Ch23 Electromagnetic Waves             (1% wt, 1 topic)  → B56
Ch2  Units and Measurements            (2% wt, 2 topics) → B02-B03
Ch1  Physical World                    (1% wt, 1 topic)  → B01
```

---

## Session Kickoff Template

**For automated multi-batch sessions (recommended):**

```
Read docs/PHYSICS_GENERATION_PLAN.md and docs/QBANK_AGENT.md.
Find the next PENDING batches in the Batch Registry.
Generate up to 13 batches (260 questions), following the Per-Batch Execution Protocol.
Use any existing zoo JSON file as the reference format (e.g., read one from Qbank/generated/zoo/biotechnology-applications/zoo-bioapp-transgenic.json).
Each question must have a unique "id" field: {topic_id}-{nn} (e.g. phy-newton-laws-01).
Skip any batch whose JSON file already exists in Qbank/generated/physics/.
Mark each batch DONE after saving. Commit and push after all batches are complete.
```

**For single-batch sessions (manual):**

```
Generate Physics questions for VaNi app.

Batch: B{XX}
Chapter: {chapter_name} ({chapter_id})
Topic: {topic_name} ({topic_id})

Read these files first:
- docs/PHYSICS_GENERATION_PLAN.md
- docs/QBANK_AGENT.md
- Qbank/generated/zoo/biotechnology-applications/zoo-bioapp-transgenic.json (reference format)

Generate exactly 20 NEET-style questions with unique IDs ({topic_id}-01 through {topic_id}-20):
- 12 MCQ (4 easy, 6 medium, 2 hard)
- 2 Assertion-Reasoning (1 medium, 1 hard)
- 2 Match-the-Following (1 medium, 1 hard)
- 2 True-False (1 TRUE=easy, 1 FALSE=easy; C/D options = "---")
- 1 Fill-in-Blanks (medium)
- 1 Scenario-Based (medium)

Correct answer balance: A ≤ 6, B ≤ 6, C ≤ 6, D ≤ 6 across all 20 questions.

Save JSON to: Qbank/generated/physics/{chapter-slug}/{topic_id}.json
Update status in PHYSICS_GENERATION_PLAN.md
Commit and push.
```

---

## Progress Tracker

| Chapter | Topics | Qs Target | Qs Done | % |
|---------|--------|-----------|---------|---|
| Ch1 Physical World | 1 | 20 | 0 | 0% |
| Ch2 Units and Measurements | 2 | 40 | 20 | 50% |
| Ch3 Motion in a Straight Line | 2 | 40 | 20 | 50% |
| Ch4 Motion in a Plane | 3 | 60 | 60 | 100% |
| Ch5 Laws of Motion | 3 | 60 | 60 | 100% |
| Ch6 Work, Energy and Power | 3 | 60 | 60 | 100% |
| Ch7 Rotational Motion | 3 | 60 | 60 | 100% |
| Ch8 Gravitation | 3 | 60 | 60 | 100% |
| Ch9 Mech Properties of Solids | 2 | 40 | 0 | 0% |
| Ch10 Mech Properties of Fluids | 3 | 60 | 0 | 0% |
| Ch11 Thermal Properties | 2 | 40 | 0 | 0% |
| Ch12 Thermodynamics | 2 | 40 | 0 | 0% |
| Ch13 Kinetic Theory | 2 | 40 | 0 | 0% |
| Ch14 Oscillations | 3 | 60 | 0 | 0% |
| Ch15 Waves | 3 | 60 | 0 | 0% |
| Ch16 Electric Charges and Fields | 3 | 60 | 60 | 100% |
| Ch17 Electrostatic Potential | 3 | 60 | 60 | 100% |
| Ch18 Current Electricity | 3 | 60 | 60 | 100% |
| Ch19 Moving Charges & Magnetism | 3 | 60 | 0 | 0% |
| Ch20 Magnetism and Matter | 2 | 40 | 0 | 0% |
| Ch21 Electromagnetic Induction | 2 | 40 | 0 | 0% |
| Ch22 Alternating Current | 2 | 40 | 0 | 0% |
| Ch23 Electromagnetic Waves | 1 | 20 | 0 | 0% |
| Ch24 Ray Optics | 3 | 60 | 60 | 100% |
| Ch25 Wave Optics | 3 | 60 | 0 | 0% |
| Ch26 Dual Nature | 2 | 40 | 0 | 0% |
| Ch27 Atoms | 2 | 40 | 0 | 0% |
| Ch28 Nuclei | 2 | 40 | 0 | 0% |
| Ch29 Semiconductor Electronics | 3 | 60 | 0 | 0% |
| **TOTAL** | **71** | **1,420** | **560** | **39%** |
