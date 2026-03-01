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
| **Physics** | 2,560 | 680 | 100 | 780 | 1,780 | 30% |
| **Chemistry** | TBD | 0 | 0 | 0 | TBD | 0% |
| **Biology** | TBD | 0 | 0 | 0 | TBD | 0% |
| **TOTAL** | ~2,560+ | 680 | 100 | 780 | ~1,780+ | — |

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
| 1 | Electrostatics (6 topics: B01-B06) | 120 | 100 | 220 | 360 | 61% |
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
7. **Follow type mix** — MCQ 20, Diagram 4, AR 4, TF 4, Match 2, FIB 2, Scenario 2, Sequence 2

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

## JSON SCHEMA (Each question must follow this exactly)

```json
{
  "id": "cuet-phy-elec-coulomb-01",
  "chapter_id": "cuet-phy-electrostatics",
  "question_type": "mcq",
  "question_text": "The full question stem",
  "options": [
    { "key": "A", "text": "Option A text", "is_correct": false },
    { "key": "B", "text": "Option B text", "is_correct": true },
    { "key": "C", "text": "Option C text", "is_correct": false },
    { "key": "D", "text": "Option D text", "is_correct": false }
  ],
  "correct_answer": "B",
  "explanation": "Detailed explanation with reasoning",
  "difficulty": "medium",
  "topic": "Coulomb's Law and Electric Charges",
  "subtopic": "Coulomb's force between point charges",
  "concept_tags": ["coulombs-law", "electric-force"],
  "bloom_level": "apply",
  "exam_suitability": ["CUET", "NEET"],
  "elimination_hints": [
    { "option_key": "A", "hint": "Why A is wrong", "misconception": "Common mistake" },
    { "option_key": "C", "hint": "Why C is wrong", "misconception": "Common mistake" },
    { "option_key": "D", "hint": "Why D is wrong", "misconception": "Common mistake" }
  ]
}
```

**For diagram-based questions, add:**
```json
{
  "image_uri": "diagrams/cuet-phy-elec-coulomb-21.png",
  "image_alt": "Description of what the diagram shows"
}
```

---

## WHAT NOT TO DO

- Do NOT modify code files — this is purely content generation
- Do NOT generate questions without `elimination_hints` — they are MANDATORY
- Do NOT use chapter_ids that don't exist in the DB — check mapping above
- Do NOT duplicate question stems from existing JSONs — read them first
- Do NOT skip the NEET copy (except for CUET-only chapters like Communication Systems)
- Do NOT mix up CUET and NEET chapter_ids — they are DIFFERENT

---

*Last updated: 2026-03-01*
