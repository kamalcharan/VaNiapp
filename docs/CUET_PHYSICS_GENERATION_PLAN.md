# CUET Physics Question Generation — Batch Registry & Protocol

> **Created:** 2026-03-01
> **Target:** 2,560 questions across 10 chapters, 47 topics
> **Batch size:** 40 questions per batch (see type mix in CUET_GENERATION_PROMPT.md)
> **Dual output:** Every batch produces CUET + NEET copy

---

## Approach

- **1 batch = 1 topic = 40 questions** (CUET type mix)
- Each batch outputs TWO JSON files:
  - `Qbank/CUET/physics/{chapter-folder}/new-YYYY-MM-DD/{topic_id}.json` (CUET version)
  - `Qbank/NEET/physics/{chapter-folder}/new-YYYY-MM-DD/{topic_id}.json` (NEET copy)
- **ID format:** `cuet-phy-{abbrev}-{nn}` for CUET, `phy-{abbrev}-{nn}` for NEET
- Mark each batch DONE after saving. Commit and push after all batches complete.

---

## Batch Registry

### Chapter 1: Electrostatics (`cuet-phy-electrostatics`) — 6 topics, Target: 360

| Batch | Topic ID | Topic Name | Status |
|-------|----------|------------|--------|
| B01 | `cuet-phy-elec-coulomb` | Coulomb's Law and Electric Charges | DONE (20 new) |
| B02 | `cuet-phy-elec-field` | Electric Field and Field Lines | PENDING |
| B03 | `cuet-phy-elec-dipole` | Electric Dipole | PENDING |
| B04 | `cuet-phy-elec-gauss` | Gauss's Law and Applications | PENDING |
| B05 | `cuet-phy-elec-potential` | Electric Potential and Potential Energy | PENDING |
| B06 | `cuet-phy-elec-capacitor` | Capacitors and Dielectrics | PENDING |
| | | **Copied from NEET:** 120 | **New:** 20 |

### Chapter 2: Current Electricity (`cuet-phy-current-electricity`) — 5 topics, Target: 260

| Batch | Topic ID | Topic Name | Status |
|-------|----------|------------|--------|
| B07 | `cuet-phy-curr-ohm` | Ohm's Law, Resistance, and Resistivity | PENDING |
| B08 | `cuet-phy-curr-kirchhoff` | Kirchhoff's Laws and Circuit Analysis | PENDING |
| B09 | `cuet-phy-curr-bridge` | Wheatstone Bridge and Potentiometer | PENDING |
| B10 | `cuet-phy-curr-resistors` | Combination of Resistors | PENDING |
| B11 | `cuet-phy-curr-emf` | Cells, EMF and Internal Resistance | PENDING |
| | | **Copied from NEET:** 60 | **New:** 0 |

### Chapter 3: Magnetic Effects (`cuet-phy-magnetic-effects`) — 6 topics, Target: 340

| Batch | Topic ID | Topic Name | Status |
|-------|----------|------------|--------|
| B12 | `cuet-phy-mag-force-charge` | Force on Moving Charge in Magnetic Field | PENDING |
| B13 | `cuet-phy-mag-force-conductor` | Force on Current-Carrying Conductor | PENDING |
| B14 | `cuet-phy-mag-biot` | Biot-Savart Law | PENDING |
| B15 | `cuet-phy-mag-ampere` | Ampere's Law and Solenoid | PENDING |
| B16 | `cuet-phy-mag-devices` | Cyclotron and Galvanometer | PENDING |
| B17 | `cuet-phy-mag-dipole` | Magnetic Dipole and Earth's Magnetism | PENDING |
| | | **Copied from NEET:** 100 | **New:** 0 |

### Chapter 4: EM Induction & AC (`cuet-phy-em-induction`) — 5 topics, Target: 280

| Batch | Topic ID | Topic Name | Status |
|-------|----------|------------|--------|
| B18 | `cuet-phy-emi-faraday` | Faraday's Law and Lenz's Law | PENDING |
| B19 | `cuet-phy-emi-inductance` | Self and Mutual Inductance | PENDING |
| B20 | `cuet-phy-emi-eddy` | Eddy Currents | PENDING |
| B21 | `cuet-phy-ac-circuits` | AC Circuits (R, L, C, LCR Series) | PENDING |
| B22 | `cuet-phy-ac-transformer` | Transformers, Resonance, and Power Factor | PENDING |
| | | **Copied from NEET:** 80 | **New:** 0 |

### Chapter 5: EM Waves (`cuet-phy-em-waves`) — 3 topics, Target: 140

| Batch | Topic ID | Topic Name | Status |
|-------|----------|------------|--------|
| B23 | `cuet-phy-emw-displacement` | Displacement Current | PENDING |
| B24 | `cuet-phy-emw-spectrum` | EM Spectrum and Properties | PENDING |
| B25 | `cuet-phy-emw-applications` | Applications of EM Waves | PENDING |
| | | **Copied from NEET:** 20 | **New:** 0 |

### Chapter 6: Optics (`cuet-phy-optics`) — 6 topics, Target: 360

| Batch | Topic ID | Topic Name | Status |
|-------|----------|------------|--------|
| B26 | `cuet-phy-opt-reflection` | Reflection, Mirrors, and Refraction | PENDING |
| B27 | `cuet-phy-opt-tir` | Total Internal Reflection and Prism | PENDING |
| B28 | `cuet-phy-opt-instruments` | Microscope, Telescope, and Human Eye | PENDING |
| B29 | `cuet-phy-opt-interference` | Young's Double Slit and Interference | PENDING |
| B30 | `cuet-phy-opt-diffraction` | Diffraction and Resolving Power | PENDING |
| B31 | `cuet-phy-opt-polarisation` | Polarisation (Malus's Law, Brewster's Angle) | PENDING |
| | | **Copied from NEET:** 120 | **New:** 0 |

### Chapter 7: Dual Nature (`cuet-phy-dual-nature`) — 3 topics, Target: 160

| Batch | Topic ID | Topic Name | Status |
|-------|----------|------------|--------|
| B32 | `cuet-phy-dual-photoelectric` | Photoelectric Effect | PENDING |
| B33 | `cuet-phy-dual-einstein` | Einstein's Photoelectric Equation | PENDING |
| B34 | `cuet-phy-dual-debroglie` | de Broglie Wavelength and Davisson-Germer | PENDING |
| | | **Copied from NEET:** 40 | **New:** 0 |

### Chapter 8: Atoms & Nuclei (`cuet-phy-atoms-nuclei`) — 5 topics, Target: 280

| Batch | Topic ID | Topic Name | Status |
|-------|----------|------------|--------|
| B35 | `cuet-phy-atom-bohr` | Bohr Model and Hydrogen Spectrum | PENDING |
| B36 | `cuet-phy-atom-spectra` | Spectral Series and Energy Levels | PENDING |
| B37 | `cuet-phy-nuc-properties` | Nuclear Properties and Binding Energy | PENDING |
| B38 | `cuet-phy-nuc-decay` | Radioactivity and Decay Laws | PENDING |
| B39 | `cuet-phy-nuc-fission` | Nuclear Fission and Fusion | PENDING |
| | | **Copied from NEET:** 80 | **New:** 0 |

### Chapter 9: Electronic Devices (`cuet-phy-electronic-devices`) — 5 topics, Target: 260

| Batch | Topic ID | Topic Name | Status |
|-------|----------|------------|--------|
| B40 | `cuet-phy-semi-pn` | p-n Junction Diode | PENDING |
| B41 | `cuet-phy-semi-diode` | Diode Applications (Rectifier, Zener, LED) | PENDING |
| B42 | `cuet-phy-semi-transistor` | Transistor Basics and Characteristics | PENDING |
| B43 | `cuet-phy-semi-gates` | Logic Gates (AND, OR, NOT, NAND, NOR) | PENDING |
| B44 | `cuet-phy-semi-amplifier` | Transistor as Amplifier and Oscillator | PENDING |
| | | **Copied from NEET:** 60 | **New:** 0 |

### Chapter 10: Communication Systems (`cuet-phy-communication`) — 3 topics, Target: 120

> **CUET-only** — no NEET copy needed for this chapter

| Batch | Topic ID | Topic Name | Status |
|-------|----------|------------|--------|
| B45 | `cuet-phy-comm-basics` | Communication Basics and Bandwidth | PENDING |
| B46 | `cuet-phy-comm-modulation` | Modulation Techniques (AM, FM, PM) | PENDING |
| B47 | `cuet-phy-comm-satellite` | Satellite Communication and Propagation | PENDING |
| | | **Copied from NEET:** 0 | **New:** 0 |

---

## Grand Total

| Metric | Count |
|--------|-------|
| Chapters | 10 |
| Topics / Batches | 47 |
| Questions per batch | 40 |
| **Total Target** | **2,560** |
| Copied from NEET | 680 |
| New Generated | 20 |
| **Current Total** | **700** |
| **Remaining** | **1,860** |

---

## NEET Copy Mapping

When saving the NEET copy, use these chapter_id translations:

| CUET chapter_id | NEET chapter_id | NEET subject_id |
|-----------------|-----------------|-----------------|
| `cuet-phy-electrostatics` | `phy-electrostatics` | `physics` |
| `cuet-phy-current-electricity` | `phy-current-electricity` | `physics` |
| `cuet-phy-magnetic-effects` | `phy-magnetic-effects` | `physics` |
| `cuet-phy-em-induction` | `phy-em-induction` | `physics` |
| `cuet-phy-em-waves` | `phy-em-waves` | `physics` |
| `cuet-phy-optics` | `phy-optics` | `physics` |
| `cuet-phy-dual-nature` | `phy-dual-nature` | `physics` |
| `cuet-phy-atoms-nuclei` | `phy-atoms-nuclei` | `physics` |
| `cuet-phy-electronic-devices` | `phy-electronic-devices` | `physics` |
| `cuet-phy-communication` | *(no NEET copy)* | — |

---

*Last updated: 2026-03-01*
