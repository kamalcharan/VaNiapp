# SESSION HANDOVER — Question Generation

> For the next Claude Code session. Copy-paste this as context.

---

## TASK

Generate NEET-level questions for **ALL 4 subjects** (Zoology first, then Physics, Chemistry, Botany). Output as JSON arrays — one batch per chapter. User will paste each batch into `Qbank/import.html` to import into Supabase.

---

## RULES

1. **Generate chapter-by-chapter** — output one JSON array per chapter
2. **Question count per chapter** = based on NEET weightage (see tables below)
3. **Topic coverage** — every topic in a chapter MUST have at least 1 question
4. **Question type mix**: MCQ ~60%, Assertion-Reasoning ~15%, Match-the-Following ~10%, rest ~15% (true-false, scenario, fill-blanks, sequence, diagram)
5. **Difficulty mix**: Easy 30%, Medium 50%, Hard 20%
6. **Every question MUST have `elimination_hints`** — this is VaNi's key differentiator
7. **Bloom levels**: remember, understand, apply, analyze (match difficulty)
8. **No duplicate concepts** — each question tests a distinct fact/concept

---

## JSON FORMAT (exact schema — import.html validates this)

```json
[
  {
    "question_type": "mcq | assertion-reasoning | match-the-following | true-false | fill-in-blanks | diagram-based | logical-sequence | scenario-based",
    "question_text": "The full question stem",
    "options": [
      { "key": "A", "text": "Option text", "is_correct": false },
      { "key": "B", "text": "Option text", "is_correct": true },
      { "key": "C", "text": "Option text", "is_correct": false },
      { "key": "D", "text": "Option text", "is_correct": false }
    ],
    "correct_answer": "B",
    "explanation": "Detailed NEET-level explanation with reasoning",
    "difficulty": "easy | medium | hard",
    "topic": "Must match a topic name from the topic list below",
    "subtopic": "Specific sub-concept being tested",
    "concept_tags": ["tag1", "tag2"],
    "bloom_level": "remember | understand | apply | analyze",
    "exam_suitability": ["NEET"],
    "elimination_hints": [
      {
        "option_key": "A",
        "hint": "Why this wrong option can be eliminated",
        "misconception": "Common student mistake that leads to picking this"
      },
      {
        "option_key": "C",
        "hint": "...",
        "misconception": "..."
      },
      {
        "option_key": "D",
        "hint": "...",
        "misconception": "..."
      }
    ]
  }
]
```

**Note**: `elimination_hints` only covers the WRONG options (3 hints for 4-option questions).

---

## ZOOLOGY — 15 Chapters, 53 Questions Total

### Chapter 1: Animal Kingdom (zoo-animal-kingdom) — 7 Qs — DONE
Topics: Basis of Classification, Phylum Porifera, Phylum Cnidaria, Phylum Platyhelminthes, Phylum Annelida, Phylum Arthropoda, Phylum Mollusca, Phylum Chordata

### Chapter 2: Structural Organisation (zoo-structural-organization) — 4 Qs — PENDING
Topics: Animal Tissues, Epithelial Tissue, Connective Tissue, Cockroach Anatomy, Frog Anatomy

### Chapter 3: Biomolecules (zoo-biomolecules) — 5 Qs — PENDING
Topics: Carbohydrates, Proteins, Lipids, Nucleic Acids, Enzymes

### Chapter 4: Breathing (zoo-breathing) — 2 Qs — PENDING
Topics: Respiratory System, Mechanism of Breathing, Gas Exchange, Transport of Gases

### Chapter 5: Body Fluids & Circulation (zoo-body-fluids) — 3 Qs — PENDING
Topics: Blood Composition, Blood Groups, Human Heart, Cardiac Cycle, ECG

### Chapter 6: Excretion (zoo-excretion) — 3 Qs — PENDING
Topics: Nephron Structure, Urine Formation, Osmoregulation, Kidney Disorders

### Chapter 7: Locomotion & Movement (zoo-locomotion) — 3 Qs — PENDING
Topics: Muscle Contraction, Skeletal System, Joints, Muscular Disorders

### Chapter 8: Neural Control (zoo-neural-control) — 1 Q — PENDING
Topics: Neuron Structure, Nerve Impulse, Human Brain, Reflex Arc

### Chapter 9: Chemical Coordination (zoo-chemical-coordination) — 2 Qs — PENDING
Topics: Endocrine Glands, Hormones, Feedback Mechanism

### Chapter 10: Human Reproduction (zoo-human-reproduction) — 3 Qs — PENDING
Topics: Male Reproductive System, Female Reproductive System, Gametogenesis, Menstrual Cycle, Fertilization

### Chapter 11: Reproductive Health (zoo-reproductive-health) — 4 Qs — PENDING
Topics: Contraception Methods, STDs, Infertility, Assisted Reproductive Technologies

### Chapter 12: Evolution (zoo-evolution) — 3 Qs — PENDING
Topics: Origin of Life, Evidence of Evolution, Natural Selection, Human Evolution

### Chapter 13: Human Health & Disease (zoo-human-health) — 3 Qs — PENDING
Topics: Common Diseases, Immunity, AIDS, Cancer, Drug Abuse

### Chapter 14: Biotechnology Principles (zoo-biotechnology-principles) — 6 Qs — PENDING
Topics: rDNA Technology, PCR, Gel Electrophoresis, Vectors, Cloning

### Chapter 15: Biotechnology Applications (zoo-biotechnology-applications) — 4 Qs — PENDING
Topics: GMO, Bt Crops, Gene Therapy, Transgenic Animals

---

## PHYSICS — 15 Chapters (from migration)

| Slug | Chapter | Wtg% | Qs |
|------|---------|------|----|
| phy-physical-world | Physical World & Measurement | 3% | 2 |
| phy-kinematics | Kinematics | 5% | 3 |
| phy-laws-of-motion | Laws of Motion | 6% | 3 |
| phy-work-energy | Work, Energy & Power | 5% | 3 |
| phy-rotational-motion | Rotational Motion | 5% | 3 |
| phy-gravitation | Gravitation | 4% | 2 |
| phy-properties-matter | Properties of Bulk Matter | 4% | 2 |
| phy-thermodynamics | Thermodynamics | 9% | 5 |
| phy-oscillations-waves | Oscillations & Waves | 4% | 2 |
| phy-electrostatics | Electrostatics | 9% | 5 |
| phy-current-electricity | Current Electricity | 8% | 4 |
| phy-magnetic-effects | Magnetic Effects of Current | 5% | 3 |
| phy-em-induction | EM Induction & AC | 5% | 3 |
| phy-optics | Optics | 10% | 5 |
| phy-modern-physics | Dual Nature / Atoms / Nuclei | 12% | 6 |
| **TOTAL** | | **~100%** | **~51** |

(Get exact topics from migration: `grep 'phy-' 20250205_create_question_bank.sql`)

---

## CHEMISTRY — 15 Chapters (from migration)

| Slug | Chapter | Wtg% | Qs |
|------|---------|------|----|
| chem-solid-state | Solid State | 4% | 2 |
| chem-solutions | Solutions | 5% | 3 |
| chem-electrochemistry | Electrochemistry | 5% | 3 |
| chem-chemical-kinetics | Chemical Kinetics | 4% | 2 |
| chem-surface-chemistry | Surface Chemistry | 2% | 1 |
| chem-isolation-elements | Isolation of Elements | 2% | 1 |
| chem-p-block | p-Block Elements | 5% | 3 |
| chem-d-f-block | d- and f-Block Elements | 4% | 2 |
| chem-coordination | Coordination Compounds | 9% | 5 |
| chem-haloalkanes | Haloalkanes & Haloarenes | 3% | 2 |
| chem-alcohols | Alcohols, Phenols, Ethers | 4% | 2 |
| chem-aldehydes-ketones | Aldehydes, Ketones, Acids | 6% | 3 |
| chem-amines | Amines | 3% | 2 |
| chem-biomolecules | Biomolecules | 3% | 2 |
| chem-polymers-chemistry | Polymers & Chemistry in Life | 2% | 1 |
| **TOTAL** | | **~100%** | **~34** |

(Get exact topics from migration: `grep 'chem-' 20250205_create_question_bank.sql`)

---

## BOTANY — 15 Chapters (from migration)

| Slug | Chapter | Wtg% | Qs |
|------|---------|------|----|
| bot-morphology | Morphology of Flowering Plants | 8% | 4 |
| bot-anatomy | Anatomy of Flowering Plants | 5% | 3 |
| bot-cell-biology | Cell: Unit of Life | 5% | 3 |
| bot-cell-division | Cell Cycle & Division | 4% | 2 |
| bot-plant-physiology-transport | Transport in Plants | 4% | 2 |
| bot-mineral-nutrition | Mineral Nutrition | 3% | 2 |
| bot-photosynthesis | Photosynthesis | 7% | 4 |
| bot-respiration | Respiration in Plants | 4% | 2 |
| bot-plant-growth | Plant Growth & Development | 5% | 3 |
| bot-sexual-reproduction | Sexual Reproduction in Plants | 8% | 4 |
| bot-genetics-principles | Principles of Inheritance | 10% | 5 |
| bot-molecular-biology | Molecular Basis of Inheritance | 10% | 5 |
| bot-organisms-environment | Organisms and Populations | 6% | 3 |
| bot-ecosystem | Ecosystem | 5% | 3 |
| bot-biodiversity | Biodiversity & Conservation | 6% | 3 |
| **TOTAL** | | **~100%** | **~48** |

(Get exact topics from migration: `grep 'bot-' 20250205_create_question_bank.sql`)

---

## IMPORT WORKFLOW

1. Generate JSON for a chapter
2. User opens `Qbank/import.html`
3. Selects Subject > Chapter from dropdowns
4. Pastes JSON into textarea
5. Clicks "Validate & Preview" — checks structure
6. Clicks "Insert Directly to DB" — saves to Supabase

---

## WHAT NOT TO DO

- Do NOT modify any code files — this is purely content generation
- Do NOT create .ts/.json data files in src/data/ — all questions go via import.html → Supabase
- Do NOT repeat the Animal Kingdom questions (Chapter 1) — already generated
- Do NOT generate questions without elimination_hints — they are mandatory
- Do NOT use topics/subtopics that don't exist in the migration seed data
