# CUET Physics Question Generation — Master Plan

> **Created:** 2026-03-01
> **Strategy:** Dual output (CUET + NEET) — one effort upgrades both exam banks
> **Target:** 40 questions per topic, ~1,880 new + ~680 copied = ~2,560 total

---

## Strategy: 2-in-1 Approach

### Folder Structure (NEW — clean separation)
```
Qbank/
├── NEET/                          ← All NEET questions
│   └── physics/
│       ├── electrostatics/
│       │   └── new-2026-03-01/    ← Date subfolder — user knows these need importing
│       ├── current-electricity/
│       └── ...
├── CUET/                          ← All CUET questions
│   └── physics/
│       ├── electrostatics/
│       │   ├── *-copied.json      ← Copied from NEET (already known)
│       │   └── new-2026-03-01/    ← Freshly generated — needs importing
│       ├── current-electricity/
│       ├── communication/         ← CUET-only chapter
│       └── ...
└── generated/                     ← OLD (existing NEET Qs, already imported)
    └── physics/                   ← Source for copying to CUET
```

### Step A: Copy Existing NEET Class 12 Physics → CUET
- 34 NEET JSON files (~680 questions) already exist in `Qbank/generated/physics/`
- Copy them to `Qbank/CUET/physics/{chapter}/` with CUET chapter/topic IDs
- These instantly populate CUET Physics bank

### Step B: Generate NEW Questions (Dual Output)
- Generate 40 new Qs per CUET topic
- Save each batch as TWO files:
  - `Qbank/CUET/physics/{chapter}/{topic_id}.json` (CUET version)
  - `Qbank/NEET/physics/{chapter}/{topic_id}.json` (NEET version)
- Read existing NEET JSONs first to avoid duplicating question stems
- New questions serve both CUET and NEET students

---

## NEET → CUET Chapter Mapping

| # | NEET JSON Folder | NEET Files | CUET Chapter ID | CUET Chapter Name |
|---|---|---|---|---|
| 1 | `phy-electrostatics/` (3) + `phy-capacitance/` (3) | 6 files = 120 Qs | `cuet-phy-electrostatics` | Electrostatics |
| 2 | `phy-current/` (3) | 3 files = 60 Qs | `cuet-phy-current-electricity` | Current Electricity |
| 3 | `phy-magmov/` (3) + `phy-magmat/` (2) | 5 files = 100 Qs | `cuet-phy-magnetic-effects` | Magnetic Effects |
| 4 | `phy-emi/` (2) + `phy-ac/` (2) | 4 files = 80 Qs | `cuet-phy-em-induction` | EM Induction and AC |
| 5 | `phy-emwave/` (1) | 1 file = 20 Qs | `cuet-phy-em-waves` | Electromagnetic Waves |
| 6 | `phy-rayopt/` (3) + `phy-waveopt/` (3) | 6 files = 120 Qs | `cuet-phy-optics` | Optics |
| 7 | `phy-dual/` (2) | 2 files = 40 Qs | `cuet-phy-dual-nature` | Dual Nature |
| 8 | `phy-atoms/` (2) + `phy-nuclei/` (2) | 4 files = 80 Qs | `cuet-phy-atoms-nuclei` | Atoms and Nuclei |
| 9 | `phy-semi/` (3) | 3 files = 60 Qs | `cuet-phy-electronic-devices` | Electronic Devices |
| 10 | N/A (CUET-only) | 0 | `cuet-phy-communication` | Communication Systems |
| | **Total copied** | **34 files = ~680 Qs** | | |

---

## New Question Generation — Batch Registry

### CUET Topics → New Questions (47 topics × 40 Qs = 1,880 new Qs)

**Question type mix per 40-question batch (CUET pattern):**
| Type | Count | % | Difficulty Split |
|------|-------|---|------------------|
| MCQ | 20 | 50% | 5 easy, 10 medium, 5 hard |
| Diagram-Based | 4 | 10% | 1 easy, 2 medium, 1 hard |
| Assertion-Reasoning | 4 | 10% | 2 medium, 2 hard |
| Match-the-Following | 2 | 5% | 1 medium, 1 hard |
| True-False | 4 | 10% | 2 easy (TRUE), 2 easy (FALSE) |
| Fill-in-Blanks | 2 | 5% | 1 easy, 1 medium |
| Scenario-Based | 2 | 5% | 1 medium, 1 hard |
| Logical-Sequence | 2 | 5% | 1 medium, 1 hard |
| **Total** | **40** | **100%** | **12E / 18M / 10H** |

**True-False rules:**
- Two TRUE questions (correct_answer = "A", option A = "True", option B = "False")
- Two FALSE questions (correct_answer = "B", option A = "True", option B = "False")
- Options C and D must be `"---"` (dummy placeholders)

**Diagram-Based rules:**
- Include `image_uri` field with planned path: `question-images/{subject}/{chapter}/{question-id}.png`
- Include `image_alt` field describing what the diagram shows
- Diagrams uploaded separately to Supabase Storage bucket `question-images`
- App renders via `DiagramBasedQuestion.tsx` component

**Answer key balance:** A ≤ 12, B ≤ 12, C ≤ 12, D ≤ 12 (no letter > 12 out of 40)

---

### Chapter 1: Electrostatics (`cuet-phy-electrostatics`) — 6 topics
NEET equivalent: `phy-electrostatics` + `phy-capacitance` (6 existing files = 120 Qs already)

| Batch | Topic ID | Topic Name | NEET Copy Folder | Qs | Status |
|-------|----------|------------|------------------|-----|--------|
| B01 | `cuet-phy-elec-coulomb` | Coulomb's Law and Electric Charges | `phy-electrostatics/` | 40 | DONE |
| B02 | `cuet-phy-elec-field` | Electric Field and Field Lines | `phy-electrostatics/` | 40 | DONE (20 MCQ) |
| B03 | `cuet-phy-elec-dipole` | Electric Dipole | `phy-electrostatics/` | 20 | DONE |
| B04 | `cuet-phy-elec-gauss` | Gauss's Theorem and Applications | `phy-electrostatics/` | 20 | DONE |
| B05 | `cuet-phy-elec-potential` | Electric Potential and Potential Energy | `phy-capacitance/` | 20 | DONE |
| B06 | `cuet-phy-elec-capacitor` | Capacitors and Dielectrics | `phy-capacitance/` | 20 | DONE |
| | | **Chapter 1 Total** | | **240** | |

### Chapter 2: Current Electricity (`cuet-phy-current-electricity`) — 5 topics
NEET equivalent: `phy-current` (3 existing files = 60 Qs already)

| Batch | Topic ID | Topic Name | NEET Copy Folder | Qs | Status |
|-------|----------|------------|------------------|-----|--------|
| B07 | `cuet-phy-curr-ohm` | Ohm's Law and Resistance | `phy-current/` | 40 | PENDING |
| B08 | `cuet-phy-curr-drift` | Drift Velocity and Mobility | `phy-current/` | 40 | PENDING |
| B09 | `cuet-phy-curr-kirchhoff` | Kirchhoff's Laws | `phy-current/` | 40 | PENDING |
| B10 | `cuet-phy-curr-wheatstone` | Wheatstone Bridge and Meter Bridge | `phy-current/` | 40 | PENDING |
| B11 | `cuet-phy-curr-potentiometer` | Potentiometer | `phy-current/` | 40 | PENDING |
| | | **Chapter 2 Total** | | **200** | |

### Chapter 3: Magnetic Effects (`cuet-phy-magnetic-effects`) — 6 topics
NEET equivalent: `phy-magmov` + `phy-magmat` (5 existing files = 100 Qs already)

| Batch | Topic ID | Topic Name | NEET Copy Folder | Qs | Status |
|-------|----------|------------|------------------|-----|--------|
| B12 | `cuet-phy-mag-biot` | Biot-Savart Law | `phy-magmov/` | 40 | PENDING |
| B13 | `cuet-phy-mag-ampere` | Ampere's Circuital Law | `phy-magmov/` | 40 | PENDING |
| B14 | `cuet-phy-mag-force` | Force on Moving Charge and Conductor | `phy-magmov/` | 40 | PENDING |
| B15 | `cuet-phy-mag-galvanometer` | Galvanometer, Ammeter, and Voltmeter | `phy-magmov/` | 40 | PENDING |
| B16 | `cuet-phy-mag-bar` | Bar Magnet and Earth's Magnetism | `phy-magmat/` | 40 | PENDING |
| B17 | `cuet-phy-mag-properties` | Magnetic Properties of Materials | `phy-magmat/` | 40 | PENDING |
| | | **Chapter 3 Total** | | **240** | |

### Chapter 4: EM Induction and AC (`cuet-phy-em-induction`) — 5 topics
NEET equivalent: `phy-emi` + `phy-ac` (4 existing files = 80 Qs already)

| Batch | Topic ID | Topic Name | NEET Copy Folder | Qs | Status |
|-------|----------|------------|------------------|-----|--------|
| B18 | `cuet-phy-emi-faraday` | Faraday's Law and Lenz's Law | `phy-emi/` | 40 | PENDING |
| B19 | `cuet-phy-emi-motional` | Motional EMF and Eddy Currents | `phy-emi/` | 40 | PENDING |
| B20 | `cuet-phy-emi-inductance` | Self and Mutual Inductance | `phy-emi/` | 40 | PENDING |
| B21 | `cuet-phy-emi-ac` | AC Circuits (LCR, Resonance) | `phy-ac/` | 40 | PENDING |
| B22 | `cuet-phy-emi-transformer` | Transformers and Power Transmission | `phy-ac/` | 40 | PENDING |
| | | **Chapter 4 Total** | | **200** | |

### Chapter 5: Electromagnetic Waves (`cuet-phy-em-waves`) — 3 topics
NEET equivalent: `phy-emwave` (1 existing file = 20 Qs already)

| Batch | Topic ID | Topic Name | NEET Copy Folder | Qs | Status |
|-------|----------|------------|------------------|-----|--------|
| B23 | `cuet-phy-emw-displacement` | Displacement Current and Maxwell's Equations | `phy-emwave/` | 40 | PENDING |
| B24 | `cuet-phy-emw-spectrum` | Electromagnetic Spectrum | `phy-emwave/` | 40 | PENDING |
| B25 | `cuet-phy-emw-properties` | Properties and Applications of EM Waves | `phy-emwave/` | 40 | PENDING |
| | | **Chapter 5 Total** | | **120** | |

### Chapter 6: Optics (`cuet-phy-optics`) — 6 topics
NEET equivalent: `phy-rayopt` + `phy-waveopt` (6 existing files = 120 Qs already)

| Batch | Topic ID | Topic Name | NEET Copy Folder | Qs | Status |
|-------|----------|------------|------------------|-----|--------|
| B26 | `cuet-phy-opt-reflection` | Reflection and Refraction at Surfaces | `phy-rayopt/` | 40 | PENDING |
| B27 | `cuet-phy-opt-lens` | Thin Lens Formula and Lens Maker's Equation | `phy-rayopt/` | 40 | PENDING |
| B28 | `cuet-phy-opt-prism` | Prism and Dispersion | `phy-rayopt/` | 40 | PENDING |
| B29 | `cuet-phy-opt-instruments` | Optical Instruments (Microscope, Telescope) | `phy-rayopt/` | 40 | PENDING |
| B30 | `cuet-phy-opt-wave` | Wave Optics (Interference and Diffraction) | `phy-waveopt/` | 40 | PENDING |
| B31 | `cuet-phy-opt-polarisation` | Polarisation | `phy-waveopt/` | 40 | PENDING |
| | | **Chapter 6 Total** | | **240** | |

### Chapter 7: Dual Nature (`cuet-phy-dual-nature`) — 3 topics
NEET equivalent: `phy-dual` (2 existing files = 40 Qs already)

| Batch | Topic ID | Topic Name | NEET Copy Folder | Qs | Status |
|-------|----------|------------|------------------|-----|--------|
| B32 | `cuet-phy-dual-photoelectric` | Photoelectric Effect and Einstein's Equation | `phy-dual/` | 40 | PENDING |
| B33 | `cuet-phy-dual-photon` | Photon and Particle Nature of Light | `phy-dual/` | 40 | PENDING |
| B34 | `cuet-phy-dual-debroglie` | de Broglie Hypothesis and Matter Waves | `phy-dual/` | 40 | PENDING |
| | | **Chapter 7 Total** | | **120** | |

### Chapter 8: Atoms and Nuclei (`cuet-phy-atoms-nuclei`) — 5 topics
NEET equivalent: `phy-atoms` + `phy-nuclei` (4 existing files = 80 Qs already)

| Batch | Topic ID | Topic Name | NEET Copy Folder | Qs | Status |
|-------|----------|------------|------------------|-----|--------|
| B35 | `cuet-phy-atom-rutherford` | Rutherford's Model and Alpha Scattering | `phy-atoms/` | 40 | PENDING |
| B36 | `cuet-phy-atom-bohr` | Bohr Model and Hydrogen Spectrum | `phy-atoms/` | 40 | PENDING |
| B37 | `cuet-phy-atom-nucleus` | Nuclear Structure, Size, and Binding Energy | `phy-nuclei/` | 40 | PENDING |
| B38 | `cuet-phy-atom-radioactivity` | Radioactivity and Decay Laws | `phy-nuclei/` | 40 | PENDING |
| B39 | `cuet-phy-atom-fission-fusion` | Nuclear Fission and Fusion | `phy-nuclei/` | 40 | PENDING |
| | | **Chapter 8 Total** | | **200** | |

### Chapter 9: Electronic Devices (`cuet-phy-electronic-devices`) — 5 topics
NEET equivalent: `phy-semi` (3 existing files = 60 Qs already)

| Batch | Topic ID | Topic Name | NEET Copy Folder | Qs | Status |
|-------|----------|------------|------------------|-----|--------|
| B40 | `cuet-phy-elec-semiconductor` | Semiconductors (Intrinsic and Extrinsic) | `phy-semi/` | 40 | PENDING |
| B41 | `cuet-phy-elec-pn-junction` | p-n Junction Diode and Rectifier | `phy-semi/` | 40 | PENDING |
| B42 | `cuet-phy-elec-special-diodes` | Zener Diode, LED, Photodiode, Solar Cell | `phy-semi/` | 40 | PENDING |
| B43 | `cuet-phy-elec-transistor` | Transistor and its Applications | `phy-semi/` | 40 | PENDING |
| B44 | `cuet-phy-elec-logic` | Logic Gates (AND, OR, NOT, NAND, NOR) | `phy-semi/` | 40 | PENDING |
| | | **Chapter 9 Total** | | **200** | |

### Chapter 10: Communication Systems (`cuet-phy-communication`) — 3 topics
**CUET-ONLY** — No NEET equivalent (no existing Qs to copy)

| Batch | Topic ID | Topic Name | NEET Copy Folder | Qs | Status |
|-------|----------|------------|------------------|-----|--------|
| B45 | `cuet-phy-comm-elements` | Elements of Communication System | N/A | 40 | PENDING |
| B46 | `cuet-phy-comm-bandwidth` | Bandwidth and Signal Propagation | N/A | 40 | PENDING |
| B47 | `cuet-phy-comm-modulation` | Modulation (AM and FM) | N/A | 40 | PENDING |
| | | **Chapter 10 Total** | | **120** | |

---

## Grand Total

| Source | Questions |
|--------|-----------|
| Copied from NEET (34 files) | ~680 |
| New generation (47 batches × 20) | 940 |
| **Total CUET Physics** | **~1,620** |
| **New NEET copies (44 batches × 20)** | **880** |

---

## Per-Batch Execution Protocol

### Step 1: Read Context
```
Read: docs/CUET_PHYSICS_GENERATION_PLAN.md (find your batch)
Read: docs/QBANK_AGENT.md (prompt templates)
Read: Existing NEET JSON for the corresponding topic (to avoid duplicate stems)
```

### Step 2: Generate 20 Questions
- Follow type breakdown from table above
- Read existing NEET questions for the same chapter first
- Ensure NO question stem duplicates any existing question
- Set `exam_suitability: ["CUET", "NEET"]` for all questions
- Set `subject: "cuet-physics"` for CUET version
- Set `subject: "physics"` for NEET version

### Step 3: Save CUET JSON
```
Write to: Qbank/CUET/physics/{chapter-slug}/new-YYYY-MM-DD/{topic_id}.json
```
Use `new-{date}` subfolder so the user can tell which JSONs are freshly generated and need importing.

### Step 4: Save NEET Copy
```
Write to: Qbank/NEET/physics/{neet-chapter}/new-YYYY-MM-DD/{topic_id}.json
```
Use `new-{date}` subfolder so the user can tell which JSONs are freshly generated and need importing.

**Skip NEET copy for Communication Systems (B45-B47) — CUET-only chapter.**

### Step 5: Update Plan Status
Change batch status from `PENDING` → `DONE`

### Step 6: Commit & Push
```bash
git add Qbank/CUET/physics/ Qbank/NEET/physics/ docs/CUET_PHYSICS_GENERATION_PLAN.md
git commit -m "CUET Phy Q-gen B{XX}: {topic_name} (40 questions, dual NEET+CUET)"
git push
```

---

## Copy Protocol (Step A — Existing NEET → CUET)

For each of the 34 existing NEET JSON files:

1. Read the original NEET JSON
2. For each question in the array:
   - Change `id` prefix: e.g., `phy-elec-coulomb-01` → `cuet-phy-elec-coulomb-c01`
   - Change `subject`: `"physics"` → `"cuet-physics"`
   - Change `chapter`: to CUET chapter name
   - Ensure `exam_suitability` includes both `["NEET", "CUET"]`
3. Save to: `Qbank/CUET/physics/{cuet-chapter}/{original-filename}-copied.json`

**Mapping for copy:**

| NEET Source File | CUET Destination |
|---|---|
| `phy-electrostatics/phy-elec-coulomb.json` | `cuet-phy-electrostatics/phy-elec-coulomb-copied.json` |
| `phy-electrostatics/phy-elec-dipole.json` | `cuet-phy-electrostatics/phy-elec-dipole-copied.json` |
| `phy-electrostatics/phy-elec-gauss.json` | `cuet-phy-electrostatics/phy-elec-gauss-copied.json` |
| `phy-capacitance/phy-pot-potential.json` | `cuet-phy-electrostatics/phy-pot-potential-copied.json` |
| `phy-capacitance/phy-pot-capacitor.json` | `cuet-phy-electrostatics/phy-pot-capacitor-copied.json` |
| `phy-capacitance/phy-pot-dielectric.json` | `cuet-phy-electrostatics/phy-pot-dielectric-copied.json` |
| `phy-current/phy-current-ohm.json` | `cuet-phy-current-electricity/phy-current-ohm-copied.json` |
| `phy-current/phy-current-kirchhoff.json` | `cuet-phy-current-electricity/phy-current-kirchhoff-copied.json` |
| `phy-current/phy-current-instruments.json` | `cuet-phy-current-electricity/phy-current-instruments-copied.json` |
| `phy-magmov/phy-magmov-biot.json` | `cuet-phy-magnetic-effects/phy-magmov-biot-copied.json` |
| `phy-magmov/phy-magmov-force.json` | `cuet-phy-magnetic-effects/phy-magmov-force-copied.json` |
| `phy-magmov/phy-magmov-devices.json` | `cuet-phy-magnetic-effects/phy-magmov-devices-copied.json` |
| `phy-magmat/phy-magmat-dipole.json` | `cuet-phy-magnetic-effects/phy-magmat-dipole-copied.json` |
| `phy-magmat/phy-magmat-materials.json` | `cuet-phy-magnetic-effects/phy-magmat-materials-copied.json` |
| `phy-emi/phy-emi-faraday.json` | `cuet-phy-em-induction/phy-emi-faraday-copied.json` |
| `phy-emi/phy-emi-inductance.json` | `cuet-phy-em-induction/phy-emi-inductance-copied.json` |
| `phy-ac/phy-ac-circuits.json` | `cuet-phy-em-induction/phy-ac-circuits-copied.json` |
| `phy-ac/phy-ac-transformer.json` | `cuet-phy-em-induction/phy-ac-transformer-copied.json` |
| `phy-emwave/phy-emwave.json` | `cuet-phy-em-waves/phy-emwave-copied.json` |
| `phy-rayopt/phy-ray-reflection.json` | `cuet-phy-optics/phy-ray-reflection-copied.json` |
| `phy-rayopt/phy-ray-prism.json` | `cuet-phy-optics/phy-ray-prism-copied.json` |
| `phy-rayopt/phy-ray-instruments.json` | `cuet-phy-optics/phy-ray-instruments-copied.json` |
| `phy-waveopt/phy-waveopt-interference.json` | `cuet-phy-optics/phy-waveopt-interference-copied.json` |
| `phy-waveopt/phy-waveopt-diffraction.json` | `cuet-phy-optics/phy-waveopt-diffraction-copied.json` |
| `phy-waveopt/phy-waveopt-polarisation.json` | `cuet-phy-optics/phy-waveopt-polarisation-copied.json` |
| `phy-dual/phy-dual-photoelectric.json` | `cuet-phy-dual-nature/phy-dual-photoelectric-copied.json` |
| `phy-dual/phy-dual-debroglie.json` | `cuet-phy-dual-nature/phy-dual-debroglie-copied.json` |
| `phy-atoms/phy-atom-bohr.json` | `cuet-phy-atoms-nuclei/phy-atom-bohr-copied.json` |
| `phy-atoms/phy-atom-spectra.json` | `cuet-phy-atoms-nuclei/phy-atom-spectra-copied.json` |
| `phy-nuclei/phy-nuclei-properties.json` | `cuet-phy-atoms-nuclei/phy-nuclei-properties-copied.json` |
| `phy-nuclei/phy-nuclei-decay.json` | `cuet-phy-atoms-nuclei/phy-nuclei-decay-copied.json` |
| `phy-semi/phy-semi-pn.json` | `cuet-phy-electronic-devices/phy-semi-pn-copied.json` |
| `phy-semi/phy-semi-diode.json` | `cuet-phy-electronic-devices/phy-semi-diode-copied.json` |
| `phy-semi/phy-semi-transistor.json` | `cuet-phy-electronic-devices/phy-semi-transistor-copied.json` |

---

## Session Kickoff Template

```
Read docs/CUET_PHYSICS_GENERATION_PLAN.md and docs/QBANK_AGENT.md.
Find the next PENDING batches in the Batch Registry.
Generate up to 5 batches (200 questions), following the Per-Batch Execution Protocol.
Use Qbank/generated/physics/phy-electrostatics/phy-elec-coulomb.json as the reference JSON format.
Each question must have a unique "id" field: {topic_id}-{nn} (e.g. cuet-phy-elec-coulomb-01).
Before generating, read the corresponding NEET JSON files to avoid duplicate question stems.
Save CUET version to Qbank/CUET/physics/ and NEET copy to Qbank/NEET/physics/.
Mark each batch DONE after saving. Commit and push after all batches are complete.
```

---

## Grand Total

| Source | Questions |
|--------|-----------|
| Copied from NEET (34 files) | 680 |
| New generation (47 batches × 40) | 1,880 |
| **Total CUET Physics** | **2,560** |
| **New NEET copies (44 batches × 40)** | **1,760** |

**Sessions needed:** ~10 sessions (47 batches ÷ ~5 per session)

---

## Progress Tracker

| Chapter | Topics | New Qs | Copied Qs | Total | % |
|---------|--------|--------|-----------|-------|---|
| Ch1 Electrostatics | 6 | 120/240 | 120/120 | 240/360 | 67% |
| Ch2 Current Electricity | 5 | 0/200 | 60/60 | 60/260 | 23% |
| Ch3 Magnetic Effects | 6 | 0/240 | 100/100 | 100/340 | 29% |
| Ch4 EM Induction & AC | 5 | 0/200 | 80/80 | 80/280 | 29% |
| Ch5 EM Waves | 3 | 0/120 | 20/20 | 20/140 | 14% |
| Ch6 Optics | 6 | 0/240 | 120/120 | 120/360 | 33% |
| Ch7 Dual Nature | 3 | 0/120 | 40/40 | 40/160 | 25% |
| Ch8 Atoms & Nuclei | 5 | 0/200 | 80/80 | 80/280 | 29% |
| Ch9 Electronic Devices | 5 | 0/200 | 60/60 | 60/260 | 23% |
| Ch10 Communication | 3 | 0/120 | N/A | 0/120 | 0% |
| **TOTAL** | **47** | **120/1,880** | **680/680** | **800/2,560** | **31%** |
