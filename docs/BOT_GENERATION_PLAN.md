# Botany Question Generation — Master Execution Plan

> **Created:** 2026-02-20
> **Target:** 20 questions per topic, ~1,500 total
> **Total Topics:** 75 | **Total Batches:** 75 | **Total Questions:** 1,500

---

## Approach

- **1 batch = 1 topic = 20 questions** (fits comfortably in one context window)
- Each batch outputs a single JSON file saved to `Qbank/generated/bot/{chapter-slug}/`
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
Example: bot-photo-light-01, bot-photo-light-02, ... bot-photo-light-20
```

**Rules:**
- `topic_id` = the batch's Topic ID from the registry below (already unique per topic)
- `nn` = zero-padded question number within the batch (01–20)
- **Deterministic** — running the same batch twice produces the same IDs (no random UUIDs)
- **No duplicates** — topic_id is unique across the entire Qbank, so every question ID is globally unique
- The `id` field goes at the **top level** of each question object alongside `question_type`, `difficulty`, etc.

**Duplicate prevention (3 layers):**
1. **Plan status** — skip any batch already marked `DONE` in this file
2. **File existence** — skip if `Qbank/generated/bot/{chapter-slug}/{topic_id}.json` already exists on disk
3. **Supabase upsert** — `import.html` should upsert on `id`, not blind insert

---

## Multi-Session Orchestration

The full Qbank (~1,500 questions, 75 batches) requires multiple Claude Code sessions.
Each session can handle ~13 batches (~260 questions) before hitting context limits.

**How it works — the plan file IS the state machine:**

```
Session N starts
  → reads this file (BOT_GENERATION_PLAN.md)
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
Read docs/BOT_GENERATION_PLAN.md and docs/QBANK_AGENT.md.
Find the next PENDING batches in the Batch Registry.
Generate up to 13 batches (260 questions), following the Per-Batch Execution Protocol.
Use Qbank/generated/zoo/biotechnology-applications/zoo-bioapp-transgenic.json as the reference JSON format.
Each question must have a unique "id" field: {topic_id}-{nn} (e.g. bot-photo-light-01).
Skip any batch whose JSON file already exists in Qbank/generated/bot/.
Mark each batch DONE after saving. Commit and push after all batches are complete.
```

**Estimated sessions needed:** ~6 sessions (75 batches ÷ 13 per session)

---

## Batch Registry

### Chapter 1: The Living World (`bot-living-world`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B01 | `bot-living-characteristics` | Characteristics of Living Organisms | 20 | PENDING |
| B02 | `bot-living-classification` | Biodiversity and Need for Classification | 20 | PENDING |
| B03 | `bot-living-taxonomy` | Taxonomic Categories and Taxonomic Aids | 20 | PENDING |
| | | **Chapter 1 Total** | **60** | |

### Chapter 2: Biological Classification (`bot-biological-classification`) — 4 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B04 | `bot-class-monera` | Kingdom Monera (Bacteria & Archaebacteria) | 20 | DONE |
| B05 | `bot-class-protista` | Kingdom Protista | 20 | DONE |
| B06 | `bot-class-fungi` | Kingdom Fungi | 20 | DONE |
| B07 | `bot-class-viruses` | Viruses, Viroids and Lichens | 20 | DONE |
| | | **Chapter 2 Total** | **80** | |

### Chapter 3: Plant Kingdom (`bot-plant-kingdom`) — 5 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B08 | `bot-plant-algae` | Algae | 20 | DONE |
| B09 | `bot-plant-bryophytes` | Bryophytes | 20 | DONE |
| B10 | `bot-plant-pteridophytes` | Pteridophytes | 20 | DONE |
| B11 | `bot-plant-gymnosperms` | Gymnosperms | 20 | DONE |
| B12 | `bot-plant-angiosperms` | Angiosperms and Alternation of Generations | 20 | DONE |
| | | **Chapter 3 Total** | **100** | |

### Chapter 4: Morphology of Flowering Plants (`bot-morphology`) — 5 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B13 | `bot-morph-root` | Root System | 20 | DONE |
| B14 | `bot-morph-stem` | Stem System | 20 | DONE |
| B15 | `bot-morph-leaf` | Leaf Morphology | 20 | DONE |
| B16 | `bot-morph-flower` | Flower, Inflorescence, Fruit and Seed | 20 | DONE |
| B17 | `bot-morph-families` | Plant Families (Fabaceae, Solanaceae, Liliaceae) | 20 | DONE |
| | | **Chapter 4 Total** | **100** | |

### Chapter 5: Anatomy of Flowering Plants (`bot-anatomy`) — 5 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B18 | `bot-anat-tissues` | Plant Tissues (Meristematic and Permanent) | 20 | DONE |
| B19 | `bot-anat-tissue-system` | Tissue System (Epidermal, Ground, Vascular) | 20 | DONE |
| B20 | `bot-anat-root-stem` | Anatomy of Root and Stem (Dicot vs Monocot) | 20 | DONE |
| B21 | `bot-anat-leaf` | Anatomy of Leaf (Dorsiventral vs Isobilateral) | 20 | DONE |
| B22 | `bot-anat-secondary` | Secondary Growth | 20 | DONE |
| | | **Chapter 5 Total** | **100** | |

### Chapter 6: Cell — The Unit of Life (`bot-cell`) — 4 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B23 | `bot-cell-theory` | Cell Theory and Prokaryotic Cell | 20 | PENDING |
| B24 | `bot-cell-organelles` | Cell Organelles (Mitochondria, Plastids, Ribosomes) | 20 | PENDING |
| B25 | `bot-cell-membrane` | Cell Membrane and Endomembrane System | 20 | PENDING |
| B26 | `bot-cell-nucleus` | Nucleus, Chromosomes, and Cytoskeleton | 20 | PENDING |
| | | **Chapter 6 Total** | **80** | |

### Chapter 7: Cell Cycle and Cell Division (`bot-cell-division`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B27 | `bot-div-cell-cycle` | Cell Cycle and Mitosis | 20 | PENDING |
| B28 | `bot-div-meiosis-i` | Meiosis I | 20 | PENDING |
| B29 | `bot-div-meiosis-ii` | Meiosis II and Significance of Meiosis | 20 | PENDING |
| | | **Chapter 7 Total** | **60** | |

### Chapter 8: Transport in Plants (`bot-transport`) — 4 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B30 | `bot-trans-diffusion` | Diffusion, Osmosis, and Plasmolysis | 20 | PENDING |
| B31 | `bot-trans-water` | Water Absorption and Ascent of Sap | 20 | PENDING |
| B32 | `bot-trans-transpiration` | Transpiration | 20 | PENDING |
| B33 | `bot-trans-phloem` | Mineral Transport and Phloem Transport | 20 | PENDING |
| | | **Chapter 8 Total** | **80** | |

### Chapter 9: Mineral Nutrition (`bot-mineral`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B34 | `bot-mineral-essential` | Essential Mineral Nutrients and Criteria | 20 | PENDING |
| B35 | `bot-mineral-deficiency` | Deficiency Symptoms and Mineral Toxicity | 20 | PENDING |
| B36 | `bot-mineral-nitrogen` | Nitrogen Metabolism and Biological N₂ Fixation | 20 | PENDING |
| | | **Chapter 9 Total** | **60** | |

### Chapter 10: Photosynthesis in Higher Plants (`bot-photosynthesis`) — 4 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B37 | `bot-photo-pigments` | Site of Photosynthesis and Photosynthetic Pigments | 20 | DONE |
| B38 | `bot-photo-light` | Light Reactions (Cyclic and Non-Cyclic Photophosphorylation) | 20 | DONE |
| B39 | `bot-photo-calvin` | Calvin Cycle (C3 Pathway) | 20 | DONE |
| B40 | `bot-photo-c4` | Photorespiration, C4 Pathway, and CAM | 20 | DONE |
| | | **Chapter 10 Total** | **80** | |

### Chapter 11: Respiration in Plants (`bot-respiration`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B41 | `bot-resp-glycolysis` | Glycolysis and Fermentation | 20 | PENDING |
| B42 | `bot-resp-tca` | TCA Cycle (Krebs Cycle) | 20 | PENDING |
| B43 | `bot-resp-etc` | ETC, Oxidative Phosphorylation, and Respiratory Quotient | 20 | PENDING |
| | | **Chapter 11 Total** | **60** | |

### Chapter 12: Plant Growth and Development (`bot-growth`) — 4 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B44 | `bot-growth-phases` | Growth Phases and Differentiation | 20 | DONE |
| B45 | `bot-growth-auxin` | Auxins and Gibberellins | 20 | PENDING |
| B46 | `bot-growth-cytokinins` | Cytokinins, ABA, and Ethylene | 20 | PENDING |
| B47 | `bot-growth-photoperiodism` | Photoperiodism and Vernalisation | 20 | PENDING |
| | | **Chapter 12 Total** | **80** | |

### Chapter 13: Sexual Reproduction in Flowering Plants (`bot-reproduction`) — 5 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B48 | `bot-repro-stamen` | Stamen, Microsporogenesis, and Pollen Grain | 20 | DONE |
| B49 | `bot-repro-pistil` | Pistil, Megasporogenesis, and Embryo Sac | 20 | DONE |
| B50 | `bot-repro-pollination` | Pollination (Types and Agents) | 20 | DONE |
| B51 | `bot-repro-fertilization` | Double Fertilization | 20 | DONE |
| B52 | `bot-repro-seed` | Embryo, Endosperm, Seed, and Fruit Development | 20 | DONE |
| | | **Chapter 13 Total** | **100** | |

### Chapter 14: Principles of Inheritance and Variation (`bot-inheritance`) — 5 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B53 | `bot-inher-mendel` | Mendel's Laws and Monohybrid Cross | 20 | DONE |
| B54 | `bot-inher-dihybrid` | Dihybrid Cross and Law of Independent Assortment | 20 | DONE |
| B55 | `bot-inher-dominance` | Incomplete Dominance, Co-dominance, and Multiple Alleles | 20 | DONE |
| B56 | `bot-inher-sex` | Sex Determination and Sex-Linked Inheritance | 20 | DONE |
| B57 | `bot-inher-chromosomal` | Chromosomal Disorders, Linkage, and Recombination | 20 | DONE |
| | | **Chapter 14 Total** | **100** | |

### Chapter 15: Molecular Basis of Inheritance (`bot-molecular`) — 5 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B58 | `bot-mol-dna` | DNA Structure (Watson-Crick Model) | 20 | DONE |
| B59 | `bot-mol-replication` | DNA Replication | 20 | DONE |
| B60 | `bot-mol-transcription` | Transcription | 20 | DONE |
| B61 | `bot-mol-translation` | Genetic Code and Translation | 20 | DONE |
| B62 | `bot-mol-regulation` | Gene Regulation (Lac Operon) and Human Genome Project | 20 | DONE |
| | | **Chapter 15 Total** | **100** | |

### Chapter 16: Organisms and Populations (`bot-ecology-pop`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B63 | `bot-eco-organisms` | Organisms and Environment (Adaptations) | 20 | PENDING |
| B64 | `bot-eco-populations` | Population Attributes and Growth Models | 20 | PENDING |
| B65 | `bot-eco-interactions` | Population Interactions (Mutualism, Competition, Predation) | 20 | PENDING |
| | | **Chapter 16 Total** | **60** | |

### Chapter 17: Ecosystem (`bot-ecosystem`) — 4 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B66 | `bot-eco-structure` | Ecosystem Structure and Function | 20 | PENDING |
| B67 | `bot-eco-productivity` | Productivity and Decomposition | 20 | PENDING |
| B68 | `bot-eco-energy` | Energy Flow and Ecological Pyramids | 20 | PENDING |
| B69 | `bot-eco-cycles` | Nutrient Cycling and Ecological Succession | 20 | PENDING |
| | | **Chapter 17 Total** | **80** | |

### Chapter 18: Biodiversity and Conservation (`bot-biodiversity`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B70 | `bot-bio-diversity` | Biodiversity Concepts and Patterns | 20 | PENDING |
| B71 | `bot-bio-loss` | Biodiversity Loss and Causes | 20 | PENDING |
| B72 | `bot-bio-conservation` | Conservation Strategies (In-situ and Ex-situ) | 20 | PENDING |
| | | **Chapter 18 Total** | **60** | |

### Chapter 19: Environmental Issues (`bot-environment`) — 3 batches

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B73 | `bot-env-pollution` | Air and Water Pollution | 20 | PENDING |
| B74 | `bot-env-waste` | Solid Waste, Agrochemicals, and Radioactive Waste | 20 | PENDING |
| B75 | `bot-env-global` | Deforestation, Ozone Depletion, and Global Warming | 20 | PENDING |
| | | **Chapter 19 Total** | **60** | |

---

## Grand Total

| Metric | Count |
|--------|-------|
| Chapters | 19 |
| Topics / Batches | 75 |
| Questions per topic | 20 |
| **Total Questions** | **1,500** |

---

## Per-Batch Execution Protocol

Each batch (= 1 new session/context) follows this exact protocol:

### Step 1: Read Context
```
Read: docs/BOT_GENERATION_PLAN.md  (find your batch)
Read: docs/QBANK_AGENT.md          (prompt templates)
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
Write to: Qbank/generated/bot/{chapter-slug}/{topic_id}.json
```

**Pre-check:** If this file already exists, SKIP this batch (it's already done).

JSON format must be a **plain array** compatible with `Qbank/import.html`:

```json
[
  {
    "id": "bot-photo-light-01",
    "question_type": "mcq",
    "difficulty": "easy",
    "question_text": "Which pigment is primarily responsible for absorbing light in photosynthesis?",
    "explanation": "Chlorophyll a is the primary pigment...",
    "correct_answer": "B",
    "concept_tags": ["chlorophyll", "photosynthetic-pigments"],
    "topic": "Light Reactions",
    "subject": "biology",
    "chapter": "Photosynthesis in Higher Plants",
    "bloom_level": "remember",
    "exam_suitability": ["NEET"],
    "options": [
      { "key": "A", "text": "Carotenoid", "is_correct": false },
      { "key": "B", "text": "Chlorophyll a", "is_correct": true },
      { "key": "C", "text": "Xanthophyll", "is_correct": false },
      { "key": "D", "text": "Phycoerythrin", "is_correct": false }
    ],
    "elimination_hints": [
      { "option_key": "A", "hint": "Carotenoids are accessory pigments...", "misconception": "Confusing accessory pigments with primary pigments" },
      { "option_key": "C", "hint": "Xanthophyll is a yellow accessory pigment...", "misconception": null },
      { "option_key": "D", "hint": "Phycoerythrin is found in red algae...", "misconception": null }
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
git add Qbank/generated/bot/{chapter-slug}/{topic_id}.json docs/BOT_GENERATION_PLAN.md
git commit -m "Bot Q-gen B{XX}: {topic_name} (20 questions)"
git push
```

---

## Execution Order (Recommended)

Priority based on NEET weightage:

**Phase 1 — High-weight chapters first (B48-B62)**
```
Ch13 Sexual Reproduction in Flowering Plants (10% wt, 5 topics) → B48-B52
Ch14 Principles of Inheritance and Variation (10% wt, 5 topics) → B53-B57
Ch15 Molecular Basis of Inheritance          (9% wt, 5 topics)  → B58-B62
```

**Phase 2 — Medium-weight chapters (B04-B22, B37-B47)**
```
Ch4  Morphology of Flowering Plants (8% wt, 5 topics) → B13-B17
Ch5  Anatomy of Flowering Plants    (7% wt, 5 topics) → B18-B22
Ch10 Photosynthesis                 (7% wt, 4 topics) → B37-B40
Ch3  Plant Kingdom                  (6% wt, 5 topics) → B08-B12
Ch2  Biological Classification      (6% wt, 4 topics) → B04-B07
Ch12 Plant Growth and Development   (5% wt, 4 topics) → B44-B47
```

**Phase 3 — Lower-weight chapters (remaining)**
```
Ch6  Cell: The Unit of Life         (5% wt, 4 topics) → B23-B26
Ch7  Cell Cycle and Cell Division   (4% wt, 3 topics) → B27-B29
Ch8  Transport in Plants            (4% wt, 4 topics) → B30-B33
Ch9  Mineral Nutrition              (3% wt, 3 topics) → B34-B36
Ch11 Respiration in Plants          (3% wt, 3 topics) → B41-B43
Ch1  The Living World               (2% wt, 3 topics) → B01-B03
Ch16 Organisms and Populations      (3% wt, 3 topics) → B63-B65
Ch17 Ecosystem                      (3% wt, 4 topics) → B66-B69
Ch18 Biodiversity and Conservation  (2% wt, 3 topics) → B70-B72
Ch19 Environmental Issues           (2% wt, 3 topics) → B73-B75
```

---

## Session Kickoff Template

**For automated multi-batch sessions (recommended):**

```
Read docs/BOT_GENERATION_PLAN.md and docs/QBANK_AGENT.md.
Find the next PENDING batches in the Batch Registry.
Generate up to 13 batches (260 questions), following the Per-Batch Execution Protocol.
Use Qbank/generated/zoo/biotechnology-applications/zoo-bioapp-transgenic.json as the reference JSON format.
Each question must have a unique "id" field: {topic_id}-{nn} (e.g. bot-photo-light-01).
Skip any batch whose JSON file already exists in Qbank/generated/bot/.
Mark each batch DONE after saving. Commit and push after all batches are complete.
```

**For single-batch sessions (manual):**

```
Generate Botany questions for VaNi app.

Batch: B{XX}
Chapter: {chapter_name} ({chapter_id})
Topic: {topic_name} ({topic_id})

Read these files first:
- docs/BOT_GENERATION_PLAN.md
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

Save JSON to: Qbank/generated/bot/{chapter-slug}/{topic_id}.json
Update status in BOT_GENERATION_PLAN.md
Commit and push.
```

---

## Progress Tracker

| Chapter | Topics | Qs Target | Qs Done | % |
|---------|--------|-----------|---------|---|
| Ch1 The Living World | 3 | 60 | 0 | 0% |
| Ch2 Biological Classification | 4 | 80 | 0 | 0% |
| Ch3 Plant Kingdom | 5 | 100 | 0 | 0% |
| Ch4 Morphology | 5 | 100 | 100 | 100% |
| Ch5 Anatomy | 5 | 100 | 100 | 100% |
| Ch6 Cell Unit of Life | 4 | 80 | 0 | 0% |
| Ch7 Cell Division | 3 | 60 | 0 | 0% |
| Ch8 Transport in Plants | 4 | 80 | 0 | 0% |
| Ch9 Mineral Nutrition | 3 | 60 | 0 | 0% |
| Ch10 Photosynthesis | 4 | 80 | 20 | 25% |
| Ch11 Respiration | 3 | 60 | 0 | 0% |
| Ch12 Plant Growth | 4 | 80 | 0 | 0% |
| Ch13 Sexual Reproduction | 5 | 100 | 100 | 100% |
| Ch14 Inheritance | 5 | 100 | 100 | 100% |
| Ch15 Molecular Inheritance | 5 | 100 | 100 | 100% |
| Ch16 Organisms & Populations | 3 | 60 | 0 | 0% |
| Ch17 Ecosystem | 4 | 80 | 0 | 0% |
| Ch18 Biodiversity | 3 | 60 | 0 | 0% |
| Ch19 Environmental Issues | 3 | 60 | 0 | 0% |
| **TOTAL** | **75** | **1,500** | **520** | **35%** |
