# CUET Question Generation — Standard Session Prompt

> **Copy-paste this prompt to start each generation session.**
> Update the statistics section after each session.

---

## SESSION KICKOFF

Read the following files first:
1. `docs/CUET_GENERATION_PROMPT.md` (this file — for current statistics)
2. `docs/CUET_PHYSICS_GENERATION_PLAN.md` (Physics batch registry + protocol)
3. `docs/SESSION_HANDOVER.md` (JSON schema, rules, elimination hints format)

---

## CURRENT STATISTICS

### CUET Question Bank — All Subjects

| Subject | Target | Existing (Copied) | New Generated | Total | Remaining | % Done |
|---------|--------|-------------------|---------------|-------|-----------|--------|
| **Physics** | 2,560 | 680 | 140 | 820 | 1,740 | 32% |
| **Chemistry** | TBD | 0 | 0 | 0 | TBD | 0% |
| **Biology** | TBD | 0 | 0 | 0 | TBD | 0% |
| **TOTAL** | ~2,560+ | 680 | 140 | 820 | ~1,740+ | — |

### NEET Question Bank — All Subjects (Qbank/generated/)

| Subject | Questions | Chapters |
|---------|-----------|----------|
| Zoology | 3,136 | 15 |
| Botany | 1,700 | 19 |
| Chemistry | 1,640 | 28 |
| Physics | 1,420 | 29 |
| **TOTAL** | **7,896** | **91** |

### CUET Physics — Chapter Progress Detail

| # | Chapter | Copied | New | Total | Target | Status |
|---|---------|--------|-----|-------|--------|--------|
| 1 | Electrostatics (6 topics: B01-B06) | 120 | 140 | 260 | 360 | 72% |
| 2 | Current Electricity (5 topics: B07-B11) | 60 | 0 | 60 | 260 | 23% |
| 3 | Magnetic Effects (6 topics: B12-B17) | 100 | 0 | 100 | 340 | 29% |
| 4 | EM Induction & AC (5 topics: B18-B22) | 80 | 0 | 80 | 280 | 29% |
| 5 | EM Waves (3 topics: B23-B25) | 20 | 0 | 20 | 140 | 14% |
| 6 | Optics (6 topics: B26-B31) | 120 | 0 | 120 | 360 | 33% |
| 7 | Dual Nature (3 topics: B32-B34) | 40 | 0 | 40 | 160 | 25% |
| 8 | Atoms & Nuclei (5 topics: B35-B39) | 80 | 0 | 80 | 280 | 29% |
| 9 | Electronic Devices (5 topics: B40-B44) | 60 | 0 | 60 | 260 | 23% |
| 10 | Communication (3 topics: B45-B47) | 0 | 0 | 0 | 120 | 0% |

### CUET Chemistry — Chapter Progress Detail

| # | Chapter | DB Chapter ID | Copied | New | Total | Target |
|---|---------|---------------|--------|-----|-------|--------|
| 1 | Solutions | cuet-chem-solutions | 0 | 0 | 0 | TBD |
| 2 | Electrochemistry | cuet-chem-electrochemistry | 0 | 0 | 0 | TBD |
| 3 | Chemical Kinetics | cuet-chem-kinetics | 0 | 0 | 0 | TBD |
| 4 | d and f Block Elements | cuet-chem-d-f-block | 0 | 0 | 0 | TBD |
| 5 | Coordination Compounds | cuet-chem-coordination | 0 | 0 | 0 | TBD |
| 6 | Haloalkanes and Haloarenes | cuet-chem-haloalkanes | 0 | 0 | 0 | TBD |
| 7 | Alcohols, Phenols and Ethers | cuet-chem-alcohols-phenols | 0 | 0 | 0 | TBD |
| 8 | Aldehydes, Ketones, Carboxylic Acids | cuet-chem-aldehydes-ketones | 0 | 0 | 0 | TBD |
| 9 | Amines | cuet-chem-amines | 0 | 0 | 0 | TBD |
| 10 | Biomolecules | cuet-chem-biomolecules | 0 | 0 | 0 | TBD |

### CUET Biology — Chapter Progress Detail

| # | Chapter | DB Chapter ID | Copied | New | Total | Target |
|---|---------|---------------|--------|-----|-------|--------|
| 1 | Sexual Reproduction in Plants | cuet-bio-sexual-repro-plants | 0 | 0 | 0 | TBD |
| 2 | Human Reproduction | cuet-bio-human-repro | 0 | 0 | 0 | TBD |
| 3 | Reproductive Health | cuet-bio-repro-health | 0 | 0 | 0 | TBD |
| 4 | Principles of Inheritance | cuet-bio-inheritance | 0 | 0 | 0 | TBD |
| 5 | Molecular Basis of Inheritance | cuet-bio-molecular-inheritance | 0 | 0 | 0 | TBD |
| 6 | Evolution | cuet-bio-evolution | 0 | 0 | 0 | TBD |
| 7 | Human Health and Disease | cuet-bio-human-health | 0 | 0 | 0 | TBD |
| 8 | Microbes in Human Welfare | cuet-bio-microbes-welfare | 0 | 0 | 0 | TBD |
| 9 | Biotechnology: Principles | cuet-bio-biotech-principles | 0 | 0 | 0 | TBD |
| 10 | Biotechnology: Applications | cuet-bio-biotech-applications | 0 | 0 | 0 | TBD |
| 11 | Organisms and Populations | cuet-bio-organisms-populations | 0 | 0 | 0 | TBD |
| 12 | Ecosystems | cuet-bio-ecosystem | 0 | 0 | 0 | TBD |
| 13 | Biodiversity and Conservation | cuet-bio-biodiversity | 0 | 0 | 0 | TBD |

---

## SESSION RULES

1. **Generate up to 400 questions per session** (10 batches × 40 Qs)
2. **Ask user which subject** to work on — show statistics above, let them decide
3. **Dual output** — every batch saves CUET version + NEET version
4. **Chapter IDs must match DB** — see mapping below
5. **No duplicate question stems** — read existing NEET JSONs for that chapter first
6. **Every question must have `elimination_hints`** — mandatory for VaNi app
7. **Follow type mix EXACTLY** — see strict breakdown below
8. **Every special type must include its required payload fields** — see type-specific rules below

---

## STRICT TYPE MIX (per 40-question batch)

> **This is non-negotiable. Every batch MUST have exactly these counts.**
> Previous batches were missing diagram-based, scenario-based, and logical-sequence
> questions — that required 3 correction batches of 93 questions to fix. Never again.

| Type | Count | Difficulty Split |
|------|-------|------------------|
| MCQ | 20 | 5 easy, 10 medium, 5 hard |
| **Diagram-Based** | **4** | 1 easy, 2 medium, 1 hard |
| Assertion-Reasoning | 4 | 2 medium, 2 hard |
| True-False | 4 | 2 TRUE easy, 2 FALSE easy |
| Match-the-Following | 2 | 1 medium, 1 hard |
| Fill-in-Blanks | 2 | 1 easy, 1 medium |
| **Scenario-Based** | **2** | 1 medium, 1 hard |
| **Logical-Sequence** | **2** | 1 medium, 1 hard |
| **Total** | **40** | 12E / 18M / 10H |

### Validation before saving — count ALL types:
```
MCQ=20  Diagram=4  AR=4  TF=4  MTF=2  FIB=2  Scenario=2  Sequence=2  → Total=40
```
**If any count is wrong, FIX IT before saving. Do NOT save a batch with missing types.**

---

## TYPE-SPECIFIC JSON RULES (Critical for App Rendering)

> The VaNi app has **dedicated components** for each question type.
> Each component reads specific fields from the DB `payload` column.
> **Missing fields = broken rendering / text duplication.**
>
> The import tool maps JSON fields to DB columns as follows:
>
> | JSON field | DB column | Notes |
> |-----------|-----------|-------|
> | `question_text` | `med_questions.question_text` | Shown in question header box |
> | `correct_answer` | `med_questions.correct_answer` | "A"/"B"/"C"/"D" |
> | `explanation` | `med_questions.explanation` | Shown after answering |
> | `image_uri` | `med_questions.image_url` | Full storage path |
> | `image_alt` | `med_questions.image_alt` | Accessibility text |
> | `options[]` | `med_question_options` rows | Each gets its own row |
> | `elimination_hints[]` | `med_elimination_hints` rows | Each gets its own row |
> | `scenario` | `payload.scenario` | Scenario-based only |
> | `text_with_blanks` | `payload.text_with_blanks` | Fill-in-blanks only |
> | `assertion` | `payload.assertion` | Assertion-reasoning only |
> | `reason` | `payload.reason` | Assertion-reasoning only |
> | `column_a` | `payload.column_a` | Match-the-following only |
> | `column_b` | `payload.column_b` | Match-the-following only |
> | `correct_mapping` | `payload.correct_mapping` | Match-the-following only |
> | `items` | `payload.items` | Logical-sequence only |
> | `correct_order` | `payload.correct_order` | Logical-sequence only |
> | `topic`, `subtopic`, `bloom_level` | `payload.*` | Metadata |

---

### 1. MCQ (`question_type: "mcq"`) — COMPLETE EXAMPLE

The app shows the question text, then 4 tappable option cards labeled A/B/C/D.

```json
{
  "id": "cuet-phy-elec-coulomb-01",
  "chapter_id": "cuet-phy-electrostatics",
  "question_type": "mcq",
  "question_text": "Two point charges of +2μC and -3μC are placed 30 cm apart. What is the magnitude of the electric force between them?",
  "options": [
    { "key": "A", "text": "0.2 N", "is_correct": false },
    { "key": "B", "text": "0.6 N", "is_correct": true },
    { "key": "C", "text": "1.2 N", "is_correct": false },
    { "key": "D", "text": "0.06 N", "is_correct": false }
  ],
  "correct_answer": "B",
  "explanation": "Using Coulomb's law: F = kq₁q₂/r² = 9×10⁹ × 2×10⁻⁶ × 3×10⁻⁶ / (0.3)² = 0.6 N",
  "difficulty": "medium",
  "topic": "Coulomb's Law",
  "subtopic": "Force between point charges",
  "concept_tags": ["coulombs-law", "electric-force"],
  "bloom_level": "apply",
  "exam_suitability": ["CUET", "NEET"],
  "elimination_hints": [
    { "option_key": "A", "hint": "This would be the answer if r = 0.3m was squared incorrectly", "misconception": "Forgetting to square the distance" },
    { "option_key": "C", "hint": "Double the correct value — check the product of charges", "misconception": "Using 4μC instead of 2μC" },
    { "option_key": "D", "hint": "Off by a factor of 10 — check unit conversions", "misconception": "Converting μC to C incorrectly" }
  ]
}
```

---

### 2. True-False (`question_type: "true-false"`) — COMPLETE EXAMPLE

The app renders a **STATEMENT** card, then two large **True / False** buttons. NO A/B/C/D option cards.

```json
{
  "id": "cuet-phy-elec-tf-01",
  "chapter_id": "cuet-phy-electrostatics",
  "question_type": "true-false",
  "question_text": "The electric field inside a hollow conducting sphere carrying charge on its surface is always zero.",
  "options": [
    { "key": "A", "text": "True", "is_correct": true },
    { "key": "B", "text": "False", "is_correct": false }
  ],
  "correct_answer": "A",
  "explanation": "By Gauss's law, the net flux through any Gaussian surface inside a hollow conductor is zero...",
  "difficulty": "easy",
  "topic": "Electric Field",
  "subtopic": "Conductors in electrostatic equilibrium",
  "concept_tags": ["gauss-law", "conductor-properties"],
  "bloom_level": "remember",
  "exam_suitability": ["CUET", "NEET"],
  "elimination_hints": [
    { "option_key": "B", "hint": "Recall Gauss's law — no enclosed charge means E=0 inside", "misconception": "Confusing hollow conductor with solid conductor" }
  ]
}
```

**Rules:**
- Options MUST be exactly 2: A = "True", B = "False" (no C/D dummies needed)
- `correct_answer`: `"A"` for TRUE statements, `"B"` for FALSE statements
- `question_text` = the statement to evaluate (the app shows it in a STATEMENT card)
- `elimination_hints`: only include one hint for the wrong option (B if true, A if false)
- Two TRUE (`correct_answer: "A"`) and two FALSE (`correct_answer: "B"`) per batch

---

### 3. Assertion-Reasoning (`question_type: "assertion-reasoning"`) — COMPLETE EXAMPLE

The app renders separate **ASSERTION (A)** and **REASON (R)** styled cards, then 4 options.

```json
{
  "id": "cuet-phy-elec-ar-01",
  "chapter_id": "cuet-phy-electrostatics",
  "question_type": "assertion-reasoning",
  "question_text": "Assertion (A): The electric field inside a parallel plate capacitor is uniform.\nReason (R): The plates of a parallel plate capacitor are large compared to the separation between them.",
  "assertion": "The electric field inside a parallel plate capacitor is uniform.",
  "reason": "The plates of a parallel plate capacitor are large compared to the separation between them.",
  "options": [
    { "key": "A", "text": "Both A and R are correct and R is the correct explanation of A", "is_correct": true },
    { "key": "B", "text": "Both A and R are correct but R is NOT the correct explanation of A", "is_correct": false },
    { "key": "C", "text": "A is correct but R is incorrect", "is_correct": false },
    { "key": "D", "text": "A is incorrect but R is correct", "is_correct": false }
  ],
  "correct_answer": "A",
  "explanation": "Both statements are true. The field is uniform because the plates are effectively infinite...",
  "difficulty": "medium",
  "topic": "Capacitors",
  "subtopic": "Parallel plate capacitor",
  "concept_tags": ["capacitor", "uniform-field"],
  "bloom_level": "analyze",
  "exam_suitability": ["CUET", "NEET"],
  "elimination_hints": [
    { "option_key": "B", "hint": "R directly explains why the field is uniform — the large plate assumption", "misconception": "Not seeing the causal link between plate size and field uniformity" },
    { "option_key": "C", "hint": "R is factually correct — capacitor plates ARE large compared to separation", "misconception": "Thinking the reason is a false statement" },
    { "option_key": "D", "hint": "A is factually correct — the field IS uniform between the plates", "misconception": "Confusing edge fringing with the central region" }
  ]
}
```

**Rules:**
- `question_text` MUST contain: `Assertion (A): ...\nReason (R): ...` (the app parses this as fallback)
- `assertion` field = ONLY the assertion text (stored in `payload.assertion` — app reads this first)
- `reason` field = ONLY the reason text (stored in `payload.reason` — app reads this first)
- **ALWAYS include both `assertion` and `reason` as separate fields** — the app prefers them over parsing question_text
- Options MUST use standard NEET wording (see example above)

---

### 4. Match-the-Following (`question_type: "match-the-following"`) — COMPLETE EXAMPLE

The app renders **Column I** and **Column II** tables, then 4 mapping options.

```json
{
  "id": "cuet-phy-elec-mtf-01",
  "chapter_id": "cuet-phy-electrostatics",
  "question_type": "match-the-following",
  "question_text": "Match the following electrical quantities with their SI units.\nColumn I:\n(P) Electric charge\n(Q) Electric potential\n(R) Capacitance\n(S) Electric field\nColumn II:\n(i) V/m\n(ii) Farad\n(iii) Coulomb\n(iv) Volt",
  "column_a": [
    { "id": "P", "text": "Electric charge" },
    { "id": "Q", "text": "Electric potential" },
    { "id": "R", "text": "Capacitance" },
    { "id": "S", "text": "Electric field" }
  ],
  "column_b": [
    { "id": "i", "text": "V/m" },
    { "id": "ii", "text": "Farad" },
    { "id": "iii", "text": "Coulomb" },
    { "id": "iv", "text": "Volt" }
  ],
  "correct_mapping": { "P": "iii", "Q": "iv", "R": "ii", "S": "i" },
  "options": [
    { "key": "A", "text": "P-iii, Q-iv, R-ii, S-i", "is_correct": true },
    { "key": "B", "text": "P-iv, Q-iii, R-i, S-ii", "is_correct": false },
    { "key": "C", "text": "P-iii, Q-i, R-iv, S-ii", "is_correct": false },
    { "key": "D", "text": "P-ii, Q-iv, R-iii, S-i", "is_correct": false }
  ],
  "correct_answer": "A",
  "explanation": "Electric charge is measured in Coulombs (iii), potential in Volts (iv)...",
  "difficulty": "medium",
  "topic": "SI Units in Electrostatics",
  "subtopic": "Units and dimensions",
  "concept_tags": ["si-units", "electrostatics"],
  "bloom_level": "remember",
  "exam_suitability": ["CUET", "NEET"],
  "elimination_hints": [
    { "option_key": "B", "hint": "Charge is not measured in Volts", "misconception": "Confusing charge with potential" },
    { "option_key": "C", "hint": "Electric potential is not V/m — that's the field", "misconception": "Mixing up potential and field units" },
    { "option_key": "D", "hint": "Farad is the unit of capacitance, not charge", "misconception": "Confusing capacitance with charge" }
  ]
}
```

**Rules:**
- `question_text` MUST contain Column I + Column II formatted text (app parses this as fallback)
- `column_a` = array of `{id, text}` — stored in `payload.column_a` (app reads this first)
- `column_b` = array of `{id, text}` — stored in `payload.column_b` (app reads this first)
- `correct_mapping` = `{colA_id: colB_id}` — stored in `payload.correct_mapping`
- **ALWAYS include `column_a`, `column_b`, `correct_mapping`** — fallback parsing is fragile
- Column I items: use `(P)`, `(Q)`, `(R)`, `(S)` labels
- Column II items: use `(i)`, `(ii)`, `(iii)`, `(iv)` labels
- Options: mapping strings like `"P-iii, Q-iv, R-ii, S-i"`

---

### 5. Fill-in-Blanks (`question_type: "fill-in-blanks"`) — COMPLETE EXAMPLE

The app renders a **FILL IN THE BLANK(S)** card with blanks highlighted as styled badges, then 4 options.

```json
{
  "id": "cuet-phy-elec-fib-01",
  "chapter_id": "cuet-phy-electrostatics",
  "question_type": "fill-in-blanks",
  "question_text": "The SI unit of electric flux is ______.",
  "text_with_blanks": "The SI unit of electric flux is ______.",
  "options": [
    { "key": "A", "text": "N/C", "is_correct": false },
    { "key": "B", "text": "V·m", "is_correct": false },
    { "key": "C", "text": "N·m²/C", "is_correct": true },
    { "key": "D", "text": "C/m²", "is_correct": false }
  ],
  "correct_answer": "C",
  "explanation": "Electric flux Φ = E·A has units of (N/C)·m² = N·m²/C",
  "difficulty": "easy",
  "topic": "Gauss's Law",
  "subtopic": "Electric flux",
  "concept_tags": ["electric-flux", "gauss-law"],
  "bloom_level": "remember",
  "exam_suitability": ["CUET", "NEET"],
  "elimination_hints": [
    { "option_key": "A", "hint": "N/C is the unit of electric field, not flux", "misconception": "Confusing field with flux" },
    { "option_key": "B", "hint": "V·m is volt-metre — check the dimensions of E·A", "misconception": "Incomplete dimensional analysis" },
    { "option_key": "D", "hint": "C/m² is the unit of surface charge density", "misconception": "Confusing flux with charge density" }
  ]
}
```

**Rules:**
- `text_with_blanks` = the sentence with `______` (3+ underscores) for each blank — stored in `payload.text_with_blanks`, rendered in a styled card with highlighted blanks
- `question_text` = same text OR a short instruction (the app shows this in the header box and `text_with_blanks` in the blanks card)
- **ALWAYS include `text_with_blanks`** — without it, question_text gets duplicated in both the header and the blanks card
- Use `______` (6 underscores) to mark blanks
- Options are the possible answers to fill in

---

### 6. Scenario-Based (`question_type: "scenario-based"`) — COMPLETE EXAMPLE

The app renders a purple **SCENARIO** card with context text, a transition prompt, then 4 options.

```json
{
  "id": "cuet-phy-elec-sc-01",
  "chapter_id": "cuet-phy-electrostatics",
  "question_type": "scenario-based",
  "question_text": "What is the approximate percentage error in the voltmeter reading compared to the true potential difference?",
  "scenario": "A physics student measures the potential difference across a 5Ω resistor carrying 2A current. She then connects a voltmeter with internal resistance 1000Ω across it and notes the reading.",
  "options": [
    { "key": "A", "text": "0.1%", "is_correct": false },
    { "key": "B", "text": "0.5%", "is_correct": true },
    { "key": "C", "text": "1.0%", "is_correct": false },
    { "key": "D", "text": "5.0%", "is_correct": false }
  ],
  "correct_answer": "B",
  "explanation": "The voltmeter in parallel: effective R = 5×1000/(5+1000) ≈ 4.975Ω. Error = (5-4.975)/5 × 100 ≈ 0.5%",
  "difficulty": "hard",
  "topic": "Current Electricity",
  "subtopic": "Measurement errors",
  "concept_tags": ["voltmeter-error", "parallel-resistance"],
  "bloom_level": "analyze",
  "exam_suitability": ["CUET", "NEET"],
  "elimination_hints": [
    { "option_key": "A", "hint": "0.1% would require an even higher voltmeter resistance", "misconception": "Overestimating voltmeter accuracy" },
    { "option_key": "C", "hint": "1% error would occur with a 500Ω voltmeter, not 1000Ω", "misconception": "Incorrect parallel resistance calculation" },
    { "option_key": "D", "hint": "5% error implies the voltmeter resistance equals the measured resistance", "misconception": "Confusing percentage error formula" }
  ]
}
```

**Rules:**
- `scenario` = ONLY the context paragraph (3-5 sentences) — stored in `payload.scenario`, rendered in the SCENARIO card
- `question_text` = ONLY the actual question being asked — shown in the header box above the scenario
- **`scenario` and `question_text` MUST be DIFFERENT strings** — if scenario is missing or equals question_text, the same text gets duplicated in both the header box and the scenario card
- Scenarios should be practical, real-world, or exam-style case studies
- The question should require analysis of the given scenario to answer

---

### 7. Diagram-Based (`question_type: "diagram-based"`) — COMPLETE EXAMPLE

The app renders a **DIAGRAM** card with an image, then 4 options.

```json
{
  "id": "cuet-phy-elec-diag-01",
  "chapter_id": "cuet-phy-electrostatics",
  "question_type": "diagram-based",
  "question_text": "The diagram shows electric field lines between two charges. What type of charges are shown?",
  "image_uri": "question-images/cuet-physics/electrostatics/cuet-phy-elec-diag-01.png",
  "image_alt": "Electric field lines between two positive charges showing repulsion pattern with lines curving away from each other",
  "options": [
    { "key": "A", "text": "Both positive", "is_correct": true },
    { "key": "B", "text": "Both negative", "is_correct": false },
    { "key": "C", "text": "One positive, one negative", "is_correct": false },
    { "key": "D", "text": "Cannot be determined from the diagram", "is_correct": false }
  ],
  "correct_answer": "A",
  "explanation": "Field lines originate from positive charges. Since lines diverge away from both charges, both must be positive.",
  "difficulty": "medium",
  "topic": "Electric Field Lines",
  "subtopic": "Properties of field lines",
  "concept_tags": ["field-lines", "charge-identification"],
  "bloom_level": "analyze",
  "exam_suitability": ["CUET", "NEET"],
  "elimination_hints": [
    { "option_key": "B", "hint": "Negative charges have field lines pointing inward, not outward", "misconception": "Reversing field line direction convention" },
    { "option_key": "C", "hint": "Unlike charges produce field lines going from + to -, not diverging", "misconception": "Not recognizing repulsion vs attraction patterns" },
    { "option_key": "D", "hint": "The direction and pattern of field lines uniquely determines charge signs", "misconception": "Not understanding field line conventions" }
  ]
}
```

**Rules:**
- `image_uri` — storage path: `question-images/{subject}/{chapter-slug}/{question-id}.png`. Stored in `med_questions.image_url` AND `payload.image_uri`
- `image_alt` — concise description of the diagram. Stored in `med_questions.image_alt`
- `question_text` — the question about the diagram (shown in header box)
- Diagrams are generated separately (matplotlib) and uploaded via upload script
- **DO NOT skip `image_uri` or `image_alt`** — without them, the question renders an empty placeholder

---

### 8. Logical-Sequence (`question_type: "logical-sequence"`) — COMPLETE EXAMPLE

The app renders an **ARRANGE IN CORRECT ORDER** card with items labeled P, Q, R, S..., then 4 ordering options.

```json
{
  "id": "cuet-phy-elec-seq-01",
  "chapter_id": "cuet-phy-electrostatics",
  "question_type": "logical-sequence",
  "question_text": "Arrange the following steps in the correct order for charging a capacitor:",
  "items": [
    { "id": "1", "text": "Capacitor is connected to a battery" },
    { "id": "2", "text": "Current flows through the circuit" },
    { "id": "3", "text": "Charges accumulate on the plates" },
    { "id": "4", "text": "Potential difference across capacitor equals battery EMF" }
  ],
  "correct_order": ["1", "2", "3", "4"],
  "options": [
    { "key": "A", "text": "P → Q → R → S", "is_correct": true },
    { "key": "B", "text": "Q → P → S → R", "is_correct": false },
    { "key": "C", "text": "P → R → Q → S", "is_correct": false },
    { "key": "D", "text": "Q → R → P → S", "is_correct": false }
  ],
  "correct_answer": "A",
  "explanation": "First the capacitor connects to battery, then current flows, charges accumulate, and finally V_cap = EMF",
  "difficulty": "medium",
  "topic": "Capacitors",
  "subtopic": "Charging process",
  "concept_tags": ["capacitor-charging", "rc-circuit"],
  "bloom_level": "understand",
  "exam_suitability": ["CUET", "NEET"],
  "elimination_hints": [
    { "option_key": "B", "hint": "Current cannot flow before the circuit is connected", "misconception": "Not understanding that connection must precede current flow" },
    { "option_key": "C", "hint": "Charges cannot accumulate before current flows", "misconception": "Skipping the current step in the charging process" },
    { "option_key": "D", "hint": "The battery must be connected first for any process to begin", "misconception": "Not recognizing the initial condition" }
  ]
}
```

**Rules:**
- `items` = array of `{id, text}` objects — stored in `payload.items`. The app labels them P, Q, R, S... in the card
- `correct_order` = array of item IDs in correct sequence — stored in `payload.correct_order`
- `question_text` = instruction text shown in the header box
- Options: different orderings using P, Q, R, S labels with arrows
- **DO NOT skip `items` or `correct_order`** — without them, the ARRANGE card renders empty

---

## CHAPTER ID REFERENCE (Critical for Imports)

### CUET → DB Chapter IDs (used in CUET JSON files)

**Physics** (`subject_id: "cuet-physics"`):
| Folder | DB chapter_id |
|--------|---------------|
| `electrostatics` | `cuet-phy-electrostatics` |
| `current-electricity` | `cuet-phy-current-electricity` |
| `magnetic-effects` | `cuet-phy-magnetic-effects` |
| `em-induction` | `cuet-phy-em-induction` |
| `em-waves` | `cuet-phy-em-waves` |
| `optics` | `cuet-phy-optics` |
| `dual-nature` | `cuet-phy-dual-nature` |
| `atoms-nuclei` | `cuet-phy-atoms-nuclei` |
| `electronic-devices` | `cuet-phy-electronic-devices` |
| `communication` | `cuet-phy-communication` |

**Chemistry** (`subject_id: "cuet-chemistry"`):
| Folder | DB chapter_id |
|--------|---------------|
| `solutions` | `cuet-chem-solutions` |
| `electrochemistry` | `cuet-chem-electrochemistry` |
| `kinetics` | `cuet-chem-kinetics` |
| `d-f-block` | `cuet-chem-d-f-block` |
| `coordination` | `cuet-chem-coordination` |
| `haloalkanes` | `cuet-chem-haloalkanes` |
| `alcohols-phenols` | `cuet-chem-alcohols-phenols` |
| `aldehydes-ketones` | `cuet-chem-aldehydes-ketones` |
| `amines` | `cuet-chem-amines` |
| `biomolecules` | `cuet-chem-biomolecules` |

**Biology** (`subject_id: "biology"`):
| Folder | DB chapter_id |
|--------|---------------|
| `sexual-repro-plants` | `cuet-bio-sexual-repro-plants` |
| `human-repro` | `cuet-bio-human-repro` |
| `repro-health` | `cuet-bio-repro-health` |
| `inheritance` | `cuet-bio-inheritance` |
| `molecular-inheritance` | `cuet-bio-molecular-inheritance` |
| `evolution` | `cuet-bio-evolution` |
| `human-health` | `cuet-bio-human-health` |
| `microbes-welfare` | `cuet-bio-microbes-welfare` |
| `biotech-principles` | `cuet-bio-biotech-principles` |
| `biotech-applications` | `cuet-bio-biotech-applications` |
| `organisms-populations` | `cuet-bio-organisms-populations` |
| `ecosystem` | `cuet-bio-ecosystem` |
| `biodiversity` | `cuet-bio-biodiversity` |

### NEET → DB Chapter IDs (used in NEET copy JSON files)

**Physics** (`subject_id: "physics"`):
| NEET Folder | DB chapter_id |
|-------------|---------------|
| `electrostatics` | `phy-electrostatics` |
| `current-electricity` | `phy-current-electricity` |
| `magnetic-effects` | `phy-magnetic-effects` |
| `em-induction` | `phy-em-induction` |
| `em-waves` | `phy-em-waves` |
| `optics` | `phy-optics` |
| `dual-nature` | `phy-dual-nature` |
| `atoms-nuclei` | `phy-atoms-nuclei` |
| `electronic-devices` | `phy-electronic-devices` |

**Chemistry** (`subject_id: "chemistry"`):
| NEET Folder | DB chapter_id |
|-------------|---------------|
| `solutions` | `chem-solutions` |
| `electrochemistry` | `chem-electrochemistry` |
| `kinetics` | `chem-kinetics` |
| `d-f-block` | `chem-d-f-block` |
| `coordination` | `chem-coordination` |
| `haloalkanes` | `chem-haloalkanes` |
| `alcohols-ethers` | `chem-alcohols-ethers` |
| `aldehydes-ketones` | `chem-aldehydes-ketones` |
| `amines` | `chem-amines` |
| `biomolecules` | `chem-biomolecules` |

**Biology** — NEET uses botany (`subject_id: "botany"`) + zoology (`subject_id: "zoology"`):
| NEET Folder | DB chapter_id |
|-------------|---------------|
| `sexual-reproduction` | `bot-sexual-reproduction` |
| `human-reproduction` | `zoo-human-reproduction` |
| `reproductive-health` | `zoo-reproductive-health` |
| `inheritance` | `bot-inheritance` |
| `molecular-inheritance` | `bot-molecular-inheritance` |
| `evolution` | `zoo-evolution` |
| `human-health` | `zoo-human-health` |
| `microbes-welfare` | `bot-microbes-welfare` |
| `biotech-principles` | `zoo-biotechnology-principles` |
| `biotech-applications` | `zoo-biotechnology-applications` |
| `organisms-populations` | `bot-organisms-populations` |
| `ecosystem` | `bot-ecosystem` |
| `biodiversity` | `bot-biodiversity` |

---

## PER-BATCH EXECUTION PROTOCOL

### For each batch of 40 questions:

**Step 1: Read existing questions** to avoid duplicates
```
Read: Qbank/generated/{subject}/{neet-chapter-folder}/*.json
Read: Qbank/CUET/{subject}/{cuet-chapter-folder}/*.json
```

**Step 2: Generate 40 questions** following the type mix:
- MCQ: 20 (5 easy, 10 medium, 5 hard)
- Diagram-Based: 4 (1 easy, 2 medium, 1 hard)
- Assertion-Reasoning: 4 (2 medium, 2 hard)
- True-False: 4 (2 TRUE easy, 2 FALSE easy)
- Match-the-Following: 2 (1 medium, 1 hard)
- Fill-in-Blanks: 2 (1 easy, 1 medium)
- Scenario-Based: 2 (1 medium, 1 hard)
- Logical-Sequence: 2 (1 medium, 1 hard)

**Step 3: Save CUET JSON**
```
Qbank/CUET/{subject}/{chapter-folder}/new-YYYY-MM-DD/{topic_id}.json
```
- `subject_id`: `cuet-physics` / `cuet-chemistry` / `biology`
- `chapter_id`: use CUET chapter ID from mapping above
- `exam_suitability`: `["CUET", "NEET"]`
- `id` prefix: `cuet-phy-`, `cuet-chem-`, `cuet-bio-`

**Step 4: Save NEET Copy**
```
Qbank/NEET/{subject}/{chapter-folder}/new-YYYY-MM-DD/{topic_id}.json
```
- `subject_id`: `physics` / `chemistry` / `botany` or `zoology`
- `chapter_id`: use NEET chapter ID from mapping above
- `exam_suitability`: `["NEET", "CUET"]`
- `id` prefix: `phy-`, `chem-`, `bot-`, `zoo-`

**Step 5: Update this file** — increment "New Generated" counts in the statistics tables

**Step 6: Commit & push**

---

## JSON SCHEMA — REQUIRED FIELDS BY TYPE

> Every question has the base fields below. Type-specific fields are MANDATORY additions.
> See the COMPLETE EXAMPLES in the type-specific section above — use those as your template.

### Base fields (ALL types):

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique ID: `{prefix}-{chapter}-{topic}-{seq}` |
| `chapter_id` | Yes | Must match DB chapter ID from mapping below |
| `question_type` | Yes | One of: `mcq`, `true-false`, `assertion-reasoning`, `match-the-following`, `fill-in-blanks`, `scenario-based`, `diagram-based`, `logical-sequence` |
| `question_text` | Yes | The question stem shown in the header box |
| `options` | Yes | Array of `{key, text, is_correct}` — always A/B/C/D for MCQ types, A/B for true-false |
| `correct_answer` | Yes | The key of the correct option: "A", "B", "C", or "D" |
| `explanation` | Yes | Detailed explanation with reasoning |
| `difficulty` | Yes | `"easy"`, `"medium"`, or `"hard"` |
| `topic` | Yes | Topic name |
| `subtopic` | Yes | Subtopic name |
| `concept_tags` | Yes | Array of kebab-case tags |
| `bloom_level` | Yes | `"remember"`, `"understand"`, `"apply"`, `"analyze"` |
| `exam_suitability` | Yes | `["CUET", "NEET"]` or `["NEET"]` |
| `elimination_hints` | Yes | Array of `{option_key, hint, misconception}` for WRONG options |

### Type-specific MANDATORY additions:

| Type | Extra fields | Critical rule |
|------|-------------|---------------|
| `true-false` | none (but only 2 options: A=True, B=False) | `correct_answer` = "A" for true, "B" for false |
| `assertion-reasoning` | `assertion`, `reason` | MUST be separate from question_text |
| `match-the-following` | `column_a`, `column_b`, `correct_mapping` | MUST be structured arrays, not just text |
| `fill-in-blanks` | `text_with_blanks` | Use `______` (6 underscores) for blanks |
| `scenario-based` | `scenario` | MUST differ from question_text |
| `diagram-based` | `image_uri`, `image_alt` | Path convention: `question-images/{subject}/{chapter}/{id}.png` |
| `logical-sequence` | `items`, `correct_order` | Items = `[{id, text}]`, order = `["id1","id2",...]` |

---

## WHAT NOT TO DO

### General:
- Do NOT modify code files — this is purely content generation
- Do NOT generate questions without `elimination_hints` — they are MANDATORY
- Do NOT use chapter_ids that don't exist in the DB — check mapping above
- Do NOT duplicate question stems from existing JSONs — read them first
- Do NOT skip the NEET copy (except for CUET-only chapters like Communication Systems)
- Do NOT mix up CUET and NEET chapter_ids — they are DIFFERENT
- **Do NOT save a batch with missing question types** — count MCQ/Diagram/AR/TF/MTF/FIB/Scenario/Sequence before saving

### Type-specific (causes broken rendering if violated):
- **scenario-based**: Do NOT put the scenario inside `question_text`. The `scenario` field MUST be a separate string. If they match, the app shows the same text TWICE.
- **fill-in-blanks**: Do NOT omit `text_with_blanks`. Without it, the blanks card duplicates the question header.
- **assertion-reasoning**: Do NOT omit `assertion` and `reason` fields. Without them, the app falls back to regex parsing of question_text, which can fail on unusual formatting.
- **match-the-following**: Do NOT omit `column_a`, `column_b`, `correct_mapping`. Without them, the app falls back to fragile text parsing. Also always include the columns in `question_text` as backup.
- **logical-sequence**: Do NOT omit `items` or `correct_order`. Without them, the ARRANGE card renders empty.
- **diagram-based**: Do NOT omit `image_uri` or `image_alt`. The question renders an empty placeholder without them.
- **true-false**: Do NOT add C/D dummy options. Only include A="True" and B="False".

### Production-readiness checklist (run before saving each batch):
```
[ ] All 8 types present with correct counts: MCQ=20 Diagram=4 AR=4 TF=4 MTF=2 FIB=2 Scenario=2 Sequence=2
[ ] Every question has elimination_hints (1 per wrong option, 3 for 4-option types, 1 for true-false)
[ ] Every scenario-based has `scenario` field DIFFERENT from `question_text`
[ ] Every fill-in-blanks has `text_with_blanks` with ______ markers
[ ] Every assertion-reasoning has separate `assertion` and `reason` fields
[ ] Every match-the-following has `column_a`, `column_b`, `correct_mapping`
[ ] Every logical-sequence has `items` array and `correct_order` array
[ ] Every diagram-based has `image_uri` and `image_alt`
[ ] Every true-false has exactly 2 options (A=True, B=False)
[ ] correct_answer matches the option with is_correct=true
[ ] No duplicate question stems vs existing JSONs
```

---

*Last updated: 2026-03-02*
