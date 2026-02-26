# Chemistry Question Generation — Master Execution Plan

> **Created:** 2026-02-25
> **Target:** 20 questions per topic, ~1,640 total
> **Total Topics:** 82 | **Total Batches:** 82 | **Total Questions:** 1,640

---

## Approach

- **1 batch = 1 topic = 20 questions** (fits comfortably in one context window)
- Each batch outputs a single JSON file saved to `Qbank/generated/chem/{chapter-slug}/`
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
Example: chem-basic-mole-01, chem-basic-mole-02, ... chem-basic-mole-20
```

**Rules:**
- `topic_id` = the batch's Topic ID from the registry below (already unique per topic)
- `nn` = zero-padded question number within the batch (01–20)
- **Deterministic** — running the same batch twice produces the same IDs (no random UUIDs)
- **No duplicates** — topic_id is unique across the entire Qbank, so every question ID is globally unique
- The `id` field goes at the **top level** of each question object alongside `question_type`, `difficulty`, etc.

**Duplicate prevention (3 layers):**
1. **Plan status** — skip any batch already marked `DONE` in this file
2. **File existence** — skip if `Qbank/generated/chem/{chapter-slug}/{topic_id}.json` already exists on disk
3. **Supabase upsert** — `import.html` should upsert on `id`, not blind insert

---

## Multi-Session Orchestration

The full Qbank (~1,640 questions, 82 batches) requires multiple Claude Code sessions.
Each session can handle ~13 batches (~260 questions) before hitting context limits.

**How it works — the plan file IS the state machine:**

```
Session N starts
  → reads this file (CHEM_GENERATION_PLAN.md)
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
Read docs/CHEM_GENERATION_PLAN.md and docs/QBANK_AGENT.md.
Find the next PENDING batches in the Batch Registry.
Generate up to 13 batches (260 questions), following the Per-Batch Execution Protocol.
Use any existing zoo JSON file as the reference format (e.g., read one from Qbank/generated/zoo/biotechnology-applications/zoo-bioapp-transgenic.json).
Each question must have a unique "id" field: {topic_id}-{nn} (e.g. chem-basic-mole-01).
Skip any batch whose JSON file already exists in Qbank/generated/chem/.
Mark each batch DONE after saving. Commit and push after all batches are complete.
```

**Estimated sessions needed:** ~7 sessions (82 batches ÷ 13 per session)

---

## Batch Registry

---

### PHYSICAL CHEMISTRY (Class 11)

---

### Chapter 1: Some Basic Concepts of Chemistry (`chem-basic`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B01 | `chem-basic-mole` | Mole Concept and Molar Mass | 20 | DONE |
| B02 | `chem-basic-stoich` | Stoichiometry and Limiting Reagent | 20 | DONE |
| B03 | `chem-basic-concentration` | Concentration Terms and Solutions | 20 | DONE |
| | | **Chapter 1 Total** | **60** | |

### Chapter 2: Structure of Atom (`chem-atom`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B04 | `chem-atom-models` | Atomic Models (Thomson, Rutherford, Bohr) | 20 | DONE |
| B05 | `chem-atom-quantum` | Quantum Numbers, Orbitals, and Shapes | 20 | DONE |
| B06 | `chem-atom-config` | Electronic Configuration and Aufbau Principle | 20 | DONE |
| | | **Chapter 2 Total** | **60** | |

### Chapter 5: States of Matter (`chem-states`) — 2 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B07 | `chem-states-gas` | Gas Laws, Ideal Gas Equation, and Kinetic Theory | 20 | DONE |
| B08 | `chem-states-liquid` | Liquid State and Intermolecular Forces | 20 | DONE |
| | | **Chapter 5 Total** | **40** | |

### Chapter 6: Thermodynamics (`chem-thermo`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B09 | `chem-thermo-first` | First Law, Internal Energy, and Enthalpy | 20 | DONE |
| B10 | `chem-thermo-hess` | Thermochemistry and Hess's Law | 20 | DONE |
| B11 | `chem-thermo-gibbs` | Entropy, Second Law, and Gibbs Free Energy | 20 | DONE |
| | | **Chapter 6 Total** | **60** | |

### Chapter 7: Equilibrium (`chem-equilibrium`) — 4 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B12 | `chem-equil-chemical` | Chemical Equilibrium and Le Chatelier's Principle | 20 | DONE |
| B13 | `chem-equil-kc` | Equilibrium Constant (Kc, Kp) and Calculations | 20 | DONE |
| B14 | `chem-equil-ionic` | Ionic Equilibrium, Acids, Bases, and pH | 20 | DONE |
| B15 | `chem-equil-buffer` | Buffer Solutions and Solubility Product | 20 | DONE |
| | | **Chapter 7 Total** | **80** | |

### Chapter 8: Redox Reactions (`chem-redox`) — 2 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B16 | `chem-redox-concepts` | Oxidation Number and Types of Redox Reactions | 20 | DONE |
| B17 | `chem-redox-balancing` | Balancing Redox Reactions | 20 | DONE |
| | | **Chapter 8 Total** | **40** | |

---

### INORGANIC CHEMISTRY (Class 11)

---

### Chapter 3: Classification of Elements and Periodicity (`chem-periodic`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B18 | `chem-periodic-table` | Modern Periodic Table and s,p,d,f Blocks | 20 | DONE |
| B19 | `chem-periodic-trends` | Periodic Trends (IE, EA, EN, Atomic/Ionic Radius) | 20 | DONE |
| B20 | `chem-periodic-anomalous` | Anomalous Properties and Diagonal Relationships | 20 | DONE |
| | | **Chapter 3 Total** | **60** | |

### Chapter 4: Chemical Bonding and Molecular Structure (`chem-bonding`) — 4 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B21 | `chem-bond-ionic` | Ionic Bond and Lattice Energy | 20 | DONE |
| B22 | `chem-bond-covalent` | Covalent Bond, Lewis Structures, and VSEPR | 20 | DONE |
| B23 | `chem-bond-hybrid` | Hybridization (sp, sp², sp³, sp³d, sp³d²) | 20 | DONE |
| B24 | `chem-bond-mot` | Molecular Orbital Theory and Hydrogen Bonding | 20 | DONE |
| | | **Chapter 4 Total** | **80** | |

### Chapter 9: Hydrogen (`chem-hydrogen`) — 1 batch

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B25 | `chem-hydrogen` | Hydrogen: Properties, Water, and Hydrogen Peroxide | 20 | DONE |
| | | **Chapter 9 Total** | **20** | |

### Chapter 10: s-Block Elements (`chem-sblock`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B26 | `chem-sblock-alkali` | Alkali Metals (Group 1) | 20 | DONE |
| B27 | `chem-sblock-alkaline` | Alkaline Earth Metals (Group 2) | 20 | DONE |
| B28 | `chem-sblock-compounds` | Important Compounds (NaOH, Na₂CO₃, CaO, CaCO₃, Plaster of Paris) | 20 | DONE |
| | | **Chapter 10 Total** | **60** | |

### Chapter 11: p-Block Elements — Class 11 (`chem-pblock11`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B29 | `chem-pblock11-group13` | Group 13 — Boron Family | 20 | DONE |
| B30 | `chem-pblock11-group14` | Group 14 — Carbon Family | 20 | DONE |
| B31 | `chem-pblock11-compounds` | Important Compounds (Borax, Boron Hydrides, Silicones, Silicates) | 20 | DONE |
| | | **Chapter 11 Total** | **60** | |

---

### ORGANIC CHEMISTRY (Class 11)

---

### Chapter 12: Organic Chemistry — Some Basic Principles (`chem-organic-basics`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B32 | `chem-organic-nomenclature` | Classification, IUPAC Nomenclature, and Isomerism | 20 | DONE |
| B33 | `chem-organic-effects` | Electronic Effects (Inductive, Resonance, Hyperconjugation) | 20 | DONE |
| B34 | `chem-organic-intermediates` | Reaction Intermediates and Types of Organic Reactions | 20 | DONE |
| | | **Chapter 12 Total** | **60** | |

### Chapter 13: Hydrocarbons (`chem-hydrocarbons`) — 4 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B35 | `chem-hydrocarbon-alkanes` | Alkanes (Preparation and Reactions) | 20 | DONE |
| B36 | `chem-hydrocarbon-alkenes` | Alkenes (Preparation and Reactions) | 20 | DONE |
| B37 | `chem-hydrocarbon-alkynes` | Alkynes (Preparation and Reactions) | 20 | DONE |
| B38 | `chem-hydrocarbon-aromatic` | Aromatic Hydrocarbons (Benzene and Reactions) | 20 | DONE |
| | | **Chapter 13 Total** | **80** | |

### Chapter 14: Environmental Chemistry (`chem-environment`) — 1 batch

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B39 | `chem-environment` | Air/Water Pollution, Ozone Depletion, and Green Chemistry | 20 | DONE |
| | | **Chapter 14 Total** | **20** | |

---

### PHYSICAL CHEMISTRY (Class 12)

---

### Chapter 15: Solid State (`chem-solid`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B40 | `chem-solid-lattice` | Crystal Lattices and Unit Cells | 20 | DONE |
| B41 | `chem-solid-packing` | Packing Efficiency and Voids | 20 | DONE |
| B42 | `chem-solid-defects` | Defects in Solids and Electrical Properties | 20 | DONE |
| | | **Chapter 15 Total** | **60** | |

### Chapter 16: Solutions (`chem-solutions`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B43 | `chem-soln-raoult` | Types of Solutions and Raoult's Law | 20 | DONE |
| B44 | `chem-soln-colligative` | Colligative Properties (Boiling Point Elevation, Freezing Point Depression, Osmotic Pressure) | 20 | DONE |
| B45 | `chem-soln-abnormal` | Abnormal Molar Mass and Van't Hoff Factor | 20 | DONE |
| | | **Chapter 16 Total** | **60** | |

### Chapter 17: Electrochemistry (`chem-electrochem`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B46 | `chem-electrochem-cells` | Electrochemical Cells (Galvanic and Electrolytic) | 20 | DONE |
| B47 | `chem-electrochem-nernst` | Nernst Equation and EMF | 20 | DONE |
| B48 | `chem-electrochem-conductance` | Conductance, Kohlrausch's Law, Batteries, and Corrosion | 20 | DONE |
| | | **Chapter 17 Total** | **60** | |

### Chapter 18: Chemical Kinetics (`chem-kinetics`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B49 | `chem-kinetics-rate` | Rate of Reaction and Rate Law | 20 | DONE |
| B50 | `chem-kinetics-order` | Integrated Rate Equations and Half-Life | 20 | DONE |
| B51 | `chem-kinetics-arrhenius` | Arrhenius Equation and Collision Theory | 20 | DONE |
| | | **Chapter 18 Total** | **60** | |

### Chapter 19: Surface Chemistry (`chem-surface`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B52 | `chem-surface-adsorption` | Adsorption (Physical and Chemical) | 20 | DONE |
| B53 | `chem-surface-catalysis` | Catalysis (Homogeneous and Heterogeneous) | 20 | DONE |
| B54 | `chem-surface-colloids` | Colloids and Emulsions | 20 | DONE |
| | | **Chapter 19 Total** | **60** | |

---

### INORGANIC CHEMISTRY (Class 12)

---

### Chapter 20: General Principles of Isolation of Elements (`chem-metallurgy`) — 1 batch

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B55 | `chem-metallurgy` | Thermodynamic Principles, Ellingham Diagram, and Refining | 20 | DONE |
| | | **Chapter 20 Total** | **20** | |

### Chapter 21: p-Block Elements — Class 12 (`chem-pblock12`) — 4 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B56 | `chem-pblock12-group15` | Group 15 — Nitrogen Family and Compounds | 20 | DONE |
| B57 | `chem-pblock12-group16` | Group 16 — Oxygen Family and Compounds | 20 | DONE |
| B58 | `chem-pblock12-group17` | Group 17 — Halogens and Compounds | 20 | DONE |
| B59 | `chem-pblock12-group18` | Group 18 — Noble Gases and Interhalogen Compounds | 20 | DONE |
| | | **Chapter 21 Total** | **80** | |

### Chapter 22: d and f Block Elements (`chem-dblock`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B60 | `chem-dblock-properties` | General Properties of Transition Elements | 20 | DONE |
| B61 | `chem-dblock-compounds` | Important Compounds (KMnO₄, K₂Cr₂O₇) | 20 | DONE |
| B62 | `chem-dblock-inner` | Lanthanoids and Actinoids | 20 | DONE |
| | | **Chapter 22 Total** | **60** | |

### Chapter 23: Coordination Compounds (`chem-coordination`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B63 | `chem-coord-theory` | Werner's Theory, Nomenclature, and Terminology | 20 | DONE |
| B64 | `chem-coord-isomerism` | Isomerism in Coordination Compounds | 20 | DONE |
| B65 | `chem-coord-cft` | Crystal Field Theory, Bonding, and Applications | 20 | DONE |
| | | **Chapter 23 Total** | **60** | |

---

### ORGANIC CHEMISTRY (Class 12)

---

### Chapter 24: Haloalkanes and Haloarenes (`chem-haloalkanes`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B66 | `chem-haloalkane-prep` | Classification, Nomenclature, and Preparation | 20 | DONE |
| B67 | `chem-haloalkane-sn` | SN1, SN2, and Elimination Reactions | 20 | DONE |
| B68 | `chem-haloalkane-arene` | Haloarenes and Their Reactions | 20 | DONE |
| | | **Chapter 24 Total** | **60** | |

### Chapter 25: Alcohols, Phenols and Ethers (`chem-alcohols`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B69 | `chem-alcohol-reactions` | Alcohols (Preparation and Reactions) | 20 | DONE |
| B70 | `chem-phenol-reactions` | Phenols (Acidity and Reactions) | 20 | DONE |
| B71 | `chem-ether-reactions` | Ethers (Preparation and Reactions) | 20 | DONE |
| | | **Chapter 25 Total** | **60** | |

### Chapter 26: Aldehydes, Ketones and Carboxylic Acids (`chem-carbonyl`) — 4 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B72 | `chem-carbonyl-prep` | Nomenclature and Preparation of Aldehydes and Ketones | 20 | DONE |
| B73 | `chem-carbonyl-reactions` | Reactions of Aldehydes and Ketones | 20 | DONE |
| B74 | `chem-carboxylic-acids` | Carboxylic Acids (Acidity and Reactions) | 20 | DONE |
| B75 | `chem-carbonyl-named` | Named Reactions and Distinction Tests | 20 | DONE |
| | | **Chapter 26 Total** | **80** | |

### Chapter 27: Amines (`chem-amines`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B76 | `chem-amine-basics` | Classification, Nomenclature, and Preparation | 20 | DONE |
| B77 | `chem-amine-basicity` | Basicity and Chemical Reactions | 20 | DONE |
| B78 | `chem-amine-diazonium` | Diazonium Salts and Coupling Reactions | 20 | DONE |
| | | **Chapter 27 Total** | **60** | |

### Chapter 28: Biomolecules (`chem-biomolecules`) — 2 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B79 | `chem-biomol-carbs` | Carbohydrates (Mono-, Di-, and Polysaccharides) | 20 | DONE |
| B80 | `chem-biomol-proteins` | Amino Acids, Proteins, Nucleic Acids, and Vitamins | 20 | DONE |
| | | **Chapter 28 Total** | **40** | |

### Chapter 29: Polymers (`chem-polymers`) — 1 batch

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B81 | `chem-polymers` | Classification, Polymerization, and Important Polymers | 20 | DONE |
| | | **Chapter 29 Total** | **20** | |

### Chapter 30: Chemistry in Everyday Life (`chem-everyday`) — 1 batch

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B82 | `chem-everyday` | Drugs, Food Additives, and Cleansing Agents | 20 | DONE |
| | | **Chapter 30 Total** | **20** | |

---

## Grand Total

| Metric | Count |
|--------|-------|
| Chapters | 30 |
| Topics / Batches | 82 |
| Questions per topic | 20 |
| **Total Questions** | **1,640** |

---

## Per-Batch Execution Protocol

Each batch (= 1 new session/context) follows this exact protocol:

### Step 1: Read Context
```
Read: docs/CHEM_GENERATION_PLAN.md  (find your batch)
Read: docs/QBANK_AGENT.md           (prompt templates)
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
Write to: Qbank/generated/chem/{chapter-slug}/{topic_id}.json
```

**Pre-check:** If this file already exists, SKIP this batch (it's already done).

JSON format must be a **plain array** compatible with `Qbank/import.html`:

```json
[
  {
    "id": "chem-basic-mole-01",
    "question_type": "mcq",
    "difficulty": "easy",
    "question_text": "The number of atoms present in one mole of an element is equal to:",
    "explanation": "One mole of any substance contains Avogadro's number (6.022 × 10²³) of particles...",
    "correct_answer": "B",
    "concept_tags": ["mole-concept", "avogadro-number"],
    "topic": "Mole Concept and Molar Mass",
    "subject": "chemistry",
    "chapter": "Some Basic Concepts of Chemistry",
    "bloom_level": "remember",
    "exam_suitability": ["NEET"],
    "options": [
      { "key": "A", "text": "6.022 × 10²²", "is_correct": false },
      { "key": "B", "text": "6.022 × 10²³", "is_correct": true },
      { "key": "C", "text": "6.022 × 10²⁴", "is_correct": false },
      { "key": "D", "text": "6.022 × 10²¹", "is_correct": false }
    ],
    "elimination_hints": [
      { "option_key": "A", "hint": "This is off by a factor of 10...", "misconception": "Confusing the power of 10 in Avogadro's number" },
      { "option_key": "C", "hint": "This is 10 times the actual value...", "misconception": null },
      { "option_key": "D", "hint": "This is 100 times less than the actual value...", "misconception": null }
    ]
  }
]
```

**ID format:** `{topic_id}-{nn}` — e.g., first question is `{topic_id}-01`, last is `{topic_id}-20`.

**IMPORTANT field names (must match import.html):**
- Options: `key`, `text`, `is_correct` (NOT option_key/option_text)
- Hints: `option_key`, `hint`, `misconception` (NOT hint_text)
- Subject: `"chemistry"` (NOT biology)
- Top-level: plain array `[...]` (NO metadata wrapper)

### Step 4: Update Plan Status
Update this file: change batch status from `PENDING` → `DONE`

### Step 5: Commit & Push
```bash
git add Qbank/generated/chem/{chapter-slug}/{topic_id}.json docs/CHEM_GENERATION_PLAN.md
git commit -m "Chem Q-gen B{XX}: {topic_name} (20 questions)"
git push
```

---

## Execution Order (Recommended)

Priority based on NEET weightage:

**Phase 1 — High-weight chapters first (B21-B24, B56-B65, B12-B15)**
```
Ch4  Chemical Bonding              (7% wt, 4 topics) → B21-B24
Ch21 p-Block Elements (Class 12)   (8% wt, 4 topics) → B56-B59
Ch23 Coordination Compounds        (6% wt, 3 topics) → B63-B65
Ch7  Equilibrium                   (6% wt, 4 topics) → B12-B15
Ch26 Aldehydes, Ketones, COOH      (6% wt, 4 topics) → B72-B75
```

**Phase 2 — Medium-weight chapters**
```
Ch6  Thermodynamics                (5% wt, 3 topics) → B09-B11
Ch17 Electrochemistry              (5% wt, 3 topics) → B46-B48
Ch22 d and f Block Elements        (5% wt, 3 topics) → B60-B62
Ch24 Haloalkanes and Haloarenes    (4% wt, 3 topics) → B66-B68
Ch25 Alcohols, Phenols, Ethers     (4% wt, 3 topics) → B69-B71
Ch18 Chemical Kinetics             (4% wt, 3 topics) → B49-B51
Ch16 Solutions                     (4% wt, 3 topics) → B43-B45
Ch27 Amines                        (3% wt, 3 topics) → B76-B78
```

**Phase 3 — Lower-weight chapters**
```
Ch2  Structure of Atom             (3% wt, 3 topics) → B04-B06
Ch3  Classification/Periodicity    (3% wt, 3 topics) → B18-B20
Ch10 s-Block Elements              (3% wt, 3 topics) → B26-B28
Ch11 p-Block Elements (Class 11)   (3% wt, 3 topics) → B29-B31
Ch12 Organic Chemistry Basics      (3% wt, 3 topics) → B32-B34
Ch13 Hydrocarbons                  (3% wt, 4 topics) → B35-B38
Ch15 Solid State                   (3% wt, 3 topics) → B40-B42
Ch19 Surface Chemistry             (2% wt, 3 topics) → B52-B54
Ch1  Some Basic Concepts           (2% wt, 3 topics) → B01-B03
Ch5  States of Matter              (2% wt, 2 topics) → B07-B08
Ch8  Redox Reactions               (2% wt, 2 topics) → B16-B17
Ch28 Biomolecules                  (2% wt, 2 topics) → B79-B80
Ch9  Hydrogen                      (1% wt, 1 topic)  → B25
Ch20 Isolation of Elements         (1% wt, 1 topic)  → B55
Ch14 Environmental Chemistry       (1% wt, 1 topic)  → B39
Ch29 Polymers                      (1% wt, 1 topic)  → B81
Ch30 Chemistry in Everyday Life    (1% wt, 1 topic)  → B82
```

---

## Session Kickoff Template

**For automated multi-batch sessions (recommended):**

```
Read docs/CHEM_GENERATION_PLAN.md and docs/QBANK_AGENT.md.
Find the next PENDING batches in the Batch Registry.
Generate up to 13 batches (260 questions), following the Per-Batch Execution Protocol.
Use any existing zoo JSON file as the reference format (e.g., read one from Qbank/generated/zoo/biotechnology-applications/zoo-bioapp-transgenic.json).
Each question must have a unique "id" field: {topic_id}-{nn} (e.g. chem-basic-mole-01).
Skip any batch whose JSON file already exists in Qbank/generated/chem/.
Mark each batch DONE after saving. Commit and push after all batches are complete.
```

**For single-batch sessions (manual):**

```
Generate Chemistry questions for VaNi app.

Batch: B{XX}
Chapter: {chapter_name} ({chapter_id})
Topic: {topic_name} ({topic_id})

Read these files first:
- docs/CHEM_GENERATION_PLAN.md
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

Save JSON to: Qbank/generated/chem/{chapter-slug}/{topic_id}.json
Update status in CHEM_GENERATION_PLAN.md
Commit and push.
```

---

## Progress Tracker

| Chapter | Topics | Qs Target | Qs Done | % |
|---------|--------|-----------|---------|---|
| Ch1 Some Basic Concepts | 3 | 60 | 60 | 100% |
| Ch2 Structure of Atom | 3 | 60 | 60 | 100% |
| Ch3 Periodicity | 3 | 60 | 60 | 100% |
| Ch4 Chemical Bonding | 4 | 80 | 80 | 100% |
| Ch5 States of Matter | 2 | 40 | 40 | 100% |
| Ch6 Thermodynamics | 3 | 60 | 60 | 100% |
| Ch7 Equilibrium | 4 | 80 | 80 | 100% |
| Ch8 Redox Reactions | 2 | 40 | 40 | 100% |
| Ch9 Hydrogen | 1 | 20 | 20 | 100% |
| Ch10 s-Block Elements | 3 | 60 | 60 | 100% |
| Ch11 p-Block (Class 11) | 3 | 60 | 60 | 100% |
| Ch12 Organic Basics | 3 | 60 | 60 | 100% |
| Ch13 Hydrocarbons | 4 | 80 | 80 | 100% |
| Ch14 Environmental Chem | 1 | 20 | 20 | 100% |
| Ch15 Solid State | 3 | 60 | 60 | 100% |
| Ch16 Solutions | 3 | 60 | 60 | 100% |
| Ch17 Electrochemistry | 3 | 60 | 60 | 100% |
| Ch18 Chemical Kinetics | 3 | 60 | 60 | 100% |
| Ch19 Surface Chemistry | 3 | 60 | 60 | 100% |
| Ch20 Isolation of Elements | 1 | 20 | 20 | 100% |
| Ch21 p-Block (Class 12) | 4 | 80 | 80 | 100% |
| Ch22 d and f Block | 3 | 60 | 60 | 100% |
| Ch23 Coordination Compounds | 3 | 60 | 60 | 100% |
| Ch24 Haloalkanes | 3 | 60 | 60 | 100% |
| Ch25 Alcohols, Phenols, Ethers | 3 | 60 | 60 | 100% |
| Ch26 Aldehydes, Ketones, COOH | 4 | 80 | 80 | 100% |
| Ch27 Amines | 3 | 60 | 60 | 100% |
| Ch28 Biomolecules | 2 | 40 | 40 | 100% |
| Ch29 Polymers | 1 | 20 | 20 | 100% |
| Ch30 Chemistry in Everyday Life | 1 | 20 | 20 | 100% |
| **TOTAL** | **82** | **1,640** | **1,640** | **100%** |
