# Zoology Question Generation — Master Execution Plan

> **Created:** 2026-02-17
> **Target:** 50+ questions per chapter, 20+ per topic
> **Total Topics:** 65 | **Total Batches:** 65 | **Total Questions:** ~1,300

---

## Approach

- **1 batch = 1 topic = 20 questions** (fits comfortably in one context window)
- **10+10 split allowed**: If context is tight, a topic can be split into two sub-batches (10 questions each, saved as `{topic_id}_part1.json` and `{topic_id}_part2.json`)
- Each batch outputs a single JSON file saved to `Qbank/generated/zoo/`
- After generation, import via `Qbank/import.html` or direct Supabase insert
- Question type mix per 20-question batch:
  - 12 MCQ (60%)
  - 3 Assertion-Reasoning (15%)
  - 2 Match-the-Following (10%)
  - 1 True-False
  - 1 Fill-in-Blanks
  - 1 Scenario-Based
- Difficulty mix: 6 Easy (30%), 10 Medium (50%), 4 Hard (20%)

---

## Unique Question IDs

Every question **must** have a deterministic `id` field in the JSON:

```
Format:  {topic_id}-{nn}
Example: zoo-bio-carbs-01, zoo-bio-carbs-02, ... zoo-bio-carbs-20
```

**Rules:**
- `topic_id` = the batch's Topic ID from the registry below (already unique per topic)
- `nn` = zero-padded question number within the batch (01–20)
- **Deterministic** — running the same batch twice produces the same IDs (no random UUIDs)
- **No duplicates** — topic_id is unique across the entire Qbank, so every question ID is globally unique
- The `id` field goes at the **top level** of each question object alongside `question_type`, `difficulty`, etc.

**Duplicate prevention (3 layers):**
1. **Plan status** — skip any batch already marked `DONE` in this file
2. **File existence** — skip if `Qbank/generated/zoo/{topic_id}.json` already exists on disk
3. **Supabase upsert** — `import.html` should upsert on `id`, not blind insert

---

## Multi-Session Orchestration

The full Qbank (~1,300 questions, 65 batches) requires multiple Claude Code sessions.
Each session can handle ~13 batches (~260 questions) before hitting context limits.

**How it works — the plan file IS the state machine:**

```
Session N starts
  → reads this file (ZOO_GENERATION_PLAN.md)
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
Read docs/ZOO_GENERATION_PLAN.md and docs/QBANK_AGENT.md.
Find the next PENDING batches in the Batch Registry.
Generate up to 13 batches (260 questions), following the Per-Batch Execution Protocol.
Each question must have a unique "id" field: {topic_id}-{nn} (e.g. zoo-bio-carbs-01).
Mark each batch DONE after saving. Commit and push after all batches are complete.
```

**Estimated sessions needed:** ~5 sessions (65 batches ÷ 13 per session)

---

## Batch Registry

### Chapter 1: Animal Kingdom (`zoo-animal-kingdom`) — 8 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B01 | `zoo-kingdom-classification` | Basis of Classification | 20 | DONE |
| B02 | `zoo-kingdom-porifera` | Phylum Porifera | 20 | DONE |
| B03 | `zoo-kingdom-cnidaria` | Phylum Cnidaria | 20 | DONE |
| B04 | `zoo-kingdom-platyhelminthes` | Phylum Platyhelminthes | 20 | DONE |
| B05 | `zoo-kingdom-annelida` | Phylum Annelida | 20 | DONE |
| B06 | `zoo-kingdom-arthropoda` | Phylum Arthropoda | 20 | DONE |
| B07 | `zoo-kingdom-mollusca` | Phylum Mollusca | 20 | DONE |
| B08 | `zoo-kingdom-chordata` | Phylum Chordata | 20 | DONE |
| | | **Chapter 1 Total** | **160** | |

### Chapter 2: Structural Organisation in Animals (`zoo-structural-organization`) — 5 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B09 | `zoo-struct-tissues` | Animal Tissues | 20 | DONE |
| B10 | `zoo-struct-epithelium` | Epithelial Tissue | 20 | DONE |
| B11 | `zoo-struct-connective` | Connective Tissue | 20 | DONE |
| B12 | `zoo-struct-cockroach` | Cockroach Anatomy | 20 | DONE |
| B13 | `zoo-struct-frog` | Frog Anatomy | 20 | DONE |
| | | **Chapter 2 Total** | **100** | |

### Chapter 3: Biomolecules (`zoo-biomolecules`) — 5 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B14 | `zoo-bio-carbs` | Carbohydrates | 20 | DONE |
| B15 | `zoo-bio-proteins` | Proteins | 20 | DONE |
| B16 | `zoo-bio-lipids` | Lipids | 20 | DONE |
| B17 | `zoo-bio-nucleic` | Nucleic Acids | 20 | PENDING |
| B18 | `zoo-bio-enzymes` | Enzymes | 20 | PENDING |
| | | **Chapter 3 Total** | **100** | |

### Chapter 4: Breathing and Exchange of Gases (`zoo-breathing`) — 4 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B19 | `zoo-breath-system` | Respiratory System | 20 | PENDING |
| B20 | `zoo-breath-mechanism` | Mechanism of Breathing | 20 | PENDING |
| B21 | `zoo-breath-exchange` | Gas Exchange | 20 | PENDING |
| B22 | `zoo-breath-transport` | Transport of Gases | 20 | PENDING |
| | | **Chapter 4 Total** | **80** | |

### Chapter 5: Body Fluids and Circulation (`zoo-body-fluids`) — 5 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B23 | `zoo-blood-composition` | Blood Composition | 20 | PENDING |
| B24 | `zoo-blood-groups` | Blood Groups | 20 | PENDING |
| B25 | `zoo-blood-heart` | Human Heart | 20 | PENDING |
| B26 | `zoo-blood-cardiac` | Cardiac Cycle | 20 | PENDING |
| B27 | `zoo-blood-ecg` | ECG | 20 | PENDING |
| | | **Chapter 5 Total** | **100** | |

### Chapter 6: Excretory Products and Elimination (`zoo-excretion`) — 4 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B28 | `zoo-excr-nephron` | Nephron Structure | 20 | PENDING |
| B29 | `zoo-excr-urine` | Urine Formation | 20 | PENDING |
| B30 | `zoo-excr-osmoregulation` | Osmoregulation | 20 | PENDING |
| B31 | `zoo-excr-disorders` | Kidney Disorders | 20 | PENDING |
| | | **Chapter 6 Total** | **80** | |

### Chapter 7: Locomotion and Movement (`zoo-locomotion`) — 4 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B32 | `zoo-loco-muscle` | Muscle Contraction | 20 | PENDING |
| B33 | `zoo-loco-skeletal` | Skeletal System | 20 | PENDING |
| B34 | `zoo-loco-joints` | Joints | 20 | PENDING |
| B35 | `zoo-loco-disorders` | Muscular Disorders | 20 | PENDING |
| | | **Chapter 7 Total** | **80** | |

### Chapter 8: Neural Control and Coordination (`zoo-neural-control`) — 4 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B36 | `zoo-neural-neuron` | Neuron Structure | 20 | PENDING |
| B37 | `zoo-neural-impulse` | Nerve Impulse | 20 | PENDING |
| B38 | `zoo-neural-brain` | Human Brain | 20 | PENDING |
| B39 | `zoo-neural-reflex` | Reflex Arc | 20 | PENDING |
| | | **Chapter 8 Total** | **80** | |

### Chapter 9: Chemical Coordination and Integration (`zoo-chemical-coordination`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B40 | `zoo-chem-endocrine` | Endocrine Glands | 20 | PENDING |
| B41 | `zoo-chem-hormones` | Hormones | 20 | PENDING |
| B42 | `zoo-chem-feedback` | Feedback Mechanism | 20 | PENDING |
| | | **Chapter 9 Total** | **60** | |

### Chapter 10: Human Reproduction (`zoo-human-reproduction`) — 5 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B43 | `zoo-repro-male` | Male Reproductive System | 20 | PENDING |
| B44 | `zoo-repro-female` | Female Reproductive System | 20 | PENDING |
| B45 | `zoo-repro-gametogenesis` | Gametogenesis | 20 | PENDING |
| B46 | `zoo-repro-menstrual` | Menstrual Cycle | 20 | PENDING |
| B47 | `zoo-repro-fertilization` | Fertilization | 20 | PENDING |
| | | **Chapter 10 Total** | **100** | |

### Chapter 11: Reproductive Health (`zoo-reproductive-health`) — 4 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B48 | `zoo-rh-contraception` | Contraception Methods | 20 | PENDING |
| B49 | `zoo-rh-stds` | STDs | 20 | PENDING |
| B50 | `zoo-rh-infertility` | Infertility | 20 | PENDING |
| B51 | `zoo-rh-art` | Assisted Reproductive Technologies | 20 | PENDING |
| | | **Chapter 11 Total** | **80** | |

### Chapter 12: Evolution (`zoo-evolution`) — 4 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B52 | `zoo-evo-origin` | Origin of Life | 20 | PENDING |
| B53 | `zoo-evo-evidence` | Evidence of Evolution | 20 | PENDING |
| B54 | `zoo-evo-natural` | Natural Selection | 20 | PENDING |
| B55 | `zoo-evo-human` | Human Evolution | 20 | PENDING |
| | | **Chapter 12 Total** | **80** | |

### Chapter 13: Human Health and Diseases (`zoo-human-health`) — 5 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B56 | `zoo-health-diseases` | Common Diseases | 20 | PENDING |
| B57 | `zoo-health-immunity` | Immunity | 20 | PENDING |
| B58 | `zoo-health-aids` | AIDS | 20 | PENDING |
| B59 | `zoo-health-cancer` | Cancer | 20 | PENDING |
| B60 | `zoo-health-drugs` | Drug Abuse | 20 | PENDING |
| | | **Chapter 13 Total** | **100** | |

### Chapter 14: Biotechnology: Principles and Processes (`zoo-biotechnology-principles`) — 5 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B61 | `zoo-biotech-rdna` | rDNA Technology | 20 | PENDING |
| B62 | `zoo-biotech-pcr` | PCR | 20 | PENDING |
| B63 | `zoo-biotech-gel` | Gel Electrophoresis | 20 | PENDING |
| B64 | `zoo-biotech-vectors` | Vectors | 20 | PENDING |
| B65 | `zoo-biotech-cloning` | Cloning | 20 | PENDING |
| | | **Chapter 14 Total** | **100** | |

### Chapter 15: Biotechnology and its Applications (`zoo-biotechnology-applications`) — 4 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B66 | `zoo-bioapp-gmo` | GMO | 20 | PENDING |
| B67 | `zoo-bioapp-bt` | Bt Crops | 20 | PENDING |
| B68 | `zoo-bioapp-gene-therapy` | Gene Therapy | 20 | PENDING |
| B69 | `zoo-bioapp-transgenic` | Transgenic Animals | 20 | PENDING |
| | | **Chapter 15 Total** | **80** | |

---

## Grand Total

| Metric | Count |
|--------|-------|
| Chapters | 15 |
| Topics / Batches | 65 (renumbered to 69 due to count) |
| Questions per topic | 20 |
| **Total Questions** | **1,300** |

---

## Per-Batch Execution Protocol

Each batch (= 1 new session/context) follows this exact protocol:

### Step 1: Read Context
```
Read: docs/ZOO_GENERATION_PLAN.md  (find your batch)
Read: docs/QBANK_AGENT.md          (prompt templates)
Read: src/types/index.ts            (QuestionV2 schema)
```

### Step 2: Generate 20 Questions
Using the prompt templates from QBANK_AGENT.md, generate exactly 20 questions:

**Type breakdown per batch:**
| Type | Count | Difficulty Split |
|------|-------|------------------|
| MCQ | 12 | 4 easy, 6 medium, 2 hard |
| Assertion-Reasoning | 3 | 1 easy, 1 medium, 1 hard |
| Match-the-Following | 2 | 1 medium, 1 hard |
| True-False | 1 | easy |
| Fill-in-Blanks | 1 | medium |
| Scenario-Based | 1 | medium |
| **Total** | **20** | **6E / 10M / 4H** |

### Step 3: Save JSON to File
```
Write to: Qbank/generated/zoo/{topic_id}.json
```

**Pre-check:** If this file already exists, SKIP this batch (it's already done).

JSON format must be a **plain array** compatible with `Qbank/import.html`:

```json
[
  {
    "id": "zoo-kingdom-classification-01",
    "question_type": "mcq",
    "difficulty": "easy",
    "question_text": "Which of the following is NOT a level of classification?",
    "explanation": "The levels of classification are...",
    "correct_answer": "B",
    "concept_tags": ["classification", "taxonomy"],
    "topic": "Basis of Classification",
    "bloom_level": "remember",
    "exam_suitability": ["NEET"],
    "options": [
      { "key": "A", "text": "Phylum", "is_correct": false },
      { "key": "B", "text": "Biome", "is_correct": true },
      { "key": "C", "text": "Class", "is_correct": false },
      { "key": "D", "text": "Order", "is_correct": false }
    ],
    "elimination_hints": [
      { "option_key": "A", "hint": "Phylum IS a valid level of classification.", "misconception": "Confusing phylum with non-taxonomic terms" },
      { "option_key": "C", "hint": "Class IS a valid level of classification.", "misconception": null },
      { "option_key": "D", "hint": "Order IS a valid level of classification.", "misconception": null }
    ]
  }
]
```

**ID format:** `{topic_id}-{nn}` — e.g., first question is `{topic_id}-01`, last is `{topic_id}-20`.

**IMPORTANT field names (must match import.html):**
- Options: `key`, `text`, `is_correct` (NOT option_key/option_text)
- Hints: `option_key`, `hint`, `misconception` (NOT hint_text)
- Top-level: plain array `[...]` (NO metadata wrapper)

### Step 4: Update Plan Status
Update this file: change batch status from `PENDING` → `DONE`

### Step 5: Commit & Push
```bash
git add Qbank/generated/zoo/{topic_id}.json docs/ZOO_GENERATION_PLAN.md
git commit -m "Zoo Q-gen B{XX}: {topic_name} (20 questions)"
git push
```

---

## Execution Order (Recommended)

Priority based on NEET weightage:

**Phase 1 — High-weight chapters first (B01-B18)**
```
Ch1  Animal Kingdom          (13% wt, 8 topics) → B01-B08
Ch14 Biotech Principles      (12% wt, 5 topics) → B61-B65
Ch3  Biomolecules            (10% wt, 5 topics) → B14-B18
```

**Phase 2 — Medium-weight chapters (B09-B13, B43-B60)**
```
Ch2  Structural Organisation (8% wt,  5 topics) → B09-B13
Ch11 Reproductive Health     (8% wt,  4 topics) → B48-B51
Ch15 Biotech Applications    (7% wt,  4 topics) → B66-B69
Ch7  Locomotion              (6% wt,  4 topics) → B32-B35
Ch10 Human Reproduction      (6% wt,  5 topics) → B43-B47
Ch12 Evolution               (6% wt,  4 topics) → B52-B55
Ch13 Human Health            (6% wt,  5 topics) → B56-B60
```

**Phase 3 — Lower-weight chapters (remaining)**
```
Ch5  Body Fluids             (5% wt,  5 topics) → B23-B27
Ch6  Excretion               (5% wt,  4 topics) → B28-B31
Ch9  Chemical Coordination   (4% wt,  3 topics) → B40-B42
Ch4  Breathing               (4% wt,  4 topics) → B19-B22
Ch8  Neural Control          (2% wt,  4 topics) → B36-B39
```

---

## Session Kickoff Template

**For automated multi-batch sessions (recommended):**

```
Read docs/ZOO_GENERATION_PLAN.md and docs/QBANK_AGENT.md.
Find the next PENDING batches in the Batch Registry.
Generate up to 13 batches (260 questions), following the Per-Batch Execution Protocol.
Each question must have a unique "id" field: {topic_id}-{nn} (e.g. zoo-bio-carbs-01).
Skip any batch whose JSON file already exists in Qbank/generated/zoo/.
Mark each batch DONE after saving. Commit and push after all batches are complete.
```

**For single-batch sessions (manual):**

```
Generate Zoology questions for VaNi app.

Batch: B{XX}
Chapter: {chapter_name} ({chapter_id})
Topic: {topic_name} ({topic_id})

Read these files first:
- docs/ZOO_GENERATION_PLAN.md
- docs/QBANK_AGENT.md
- src/types/index.ts

Generate exactly 20 NEET-style questions with unique IDs ({topic_id}-01 through {topic_id}-20):
- 12 MCQ (4 easy, 6 medium, 2 hard)
- 3 Assertion-Reasoning (1 easy, 1 medium, 1 hard)
- 2 Match-the-Following (1 medium, 1 hard)
- 1 True-False (easy)
- 1 Fill-in-Blanks (medium)
- 1 Scenario-Based (medium)

Save JSON to: Qbank/generated/zoo/{topic_id}.json
Update status in ZOO_GENERATION_PLAN.md
Commit and push.
```

---

## Progress Tracker

| Chapter | Topics | Qs Target | Qs Done | % |
|---------|--------|-----------|---------|---|
| Ch1 Animal Kingdom | 8 | 160 | 160 | 100% |
| Ch2 Structural Org | 5 | 100 | 100 | 100% |
| Ch3 Biomolecules | 5 | 100 | 60 | 60% |
| Ch4 Breathing | 4 | 80 | 0 | 0% |
| Ch5 Body Fluids | 5 | 100 | 0 | 0% |
| Ch6 Excretion | 4 | 80 | 0 | 0% |
| Ch7 Locomotion | 4 | 80 | 0 | 0% |
| Ch8 Neural Control | 4 | 80 | 0 | 0% |
| Ch9 Chemical Coord | 3 | 60 | 0 | 0% |
| Ch10 Human Repro | 5 | 100 | 0 | 0% |
| Ch11 Repro Health | 4 | 80 | 0 | 0% |
| Ch12 Evolution | 4 | 80 | 0 | 0% |
| Ch13 Human Health | 5 | 100 | 0 | 0% |
| Ch14 Biotech Princ | 5 | 100 | 0 | 0% |
| Ch15 Biotech Apps | 4 | 80 | 0 | 0% |
| **TOTAL** | **65** | **1,300** | **320** | **24.6%** |
