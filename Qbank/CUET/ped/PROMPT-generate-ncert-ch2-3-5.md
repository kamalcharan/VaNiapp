# Prompt — Generate CUET Physical Education questions for NCERT Class 12 Chapters 2, 3, 5

Copy-paste everything below the horizontal rule into a fresh Claude session.

---

# Task

Generate CUET Physical Education (Class 12) question banks for three NCERT chapters that are currently empty in our database. Produce JSON files that plug straight into our existing bulk importer (no shape fixes downstream).

This is **CUET exam prep content for Gen-Z Indian students**. Source of truth is the **NCERT Class 12 Physical Education textbook** (current edition, 10-chapter). Keep difficulty and wording CUET-appropriate: factual recall to medium-reasoning questions, not Olympiad-level.

## Chapters to generate

For each chapter, produce **5 topics × 40 questions/topic = 200 questions** split into two files of 20 questions each (suffix `-p1.json` and `-p2.json`).

### Chapter 2 — Children & Women in Sports  (`chapter_id: cuet-ped-children-women`)

| Topic name (use exactly) | file basename prefix |
|---|---|
| Motor Development in Children | `cuet-ped-motor-development` |
| Common Postural Deformities and Corrective Measures | `cuet-ped-postural-deformities` |
| Women in Sports — Participation and Role | `cuet-ped-women-sports` |
| Menarche and Menstrual Dysfunction in Athletes | `cuet-ped-menstrual-dysfunction` |
| Female Athlete Triad | `cuet-ped-female-athlete-triad` |

### Chapter 3 — Yoga & Lifestyle  (`chapter_id: cuet-ped-yoga`)

| Topic name (use exactly) | file basename prefix |
|---|---|
| Asanas as Preventive Measure for Obesity | `cuet-ped-yoga-obesity` |
| Asanas as Preventive Measure for Diabetes | `cuet-ped-yoga-diabetes` |
| Asanas as Preventive Measure for Asthma | `cuet-ped-yoga-asthma` |
| Asanas as Preventive Measure for Hypertension | `cuet-ped-yoga-hypertension` |
| Asanas as Preventive Measure for Back Pain | `cuet-ped-yoga-back-pain` |

### Chapter 5 — Sports & Nutrition  (`chapter_id: cuet-ped-nutrition`)

| Topic name (use exactly) | file basename prefix |
|---|---|
| Balanced Diet and Nutrition — Macro and Micro Nutrients | `cuet-ped-balanced-diet` |
| Nutritive and Non-Nutritive Components of Diet | `cuet-ped-diet-components` |
| Eating for Weight Control and Food Myths | `cuet-ped-weight-control` |
| Pitfalls of Dieting — Fad Diets and Eating Disorders | `cuet-ped-dieting-pitfalls` |
| Sports Nutrition — Hydration and Supplementation | `cuet-ped-sports-nutrition` |

## File naming

For each topic produce two files, each with 20 questions:
```
<basename>-p1.json  → question ids <basename>-01 … <basename>-20
<basename>-p2.json  → question ids <basename>-21 … <basename>-40
```

So for topic "Motor Development in Children" you produce `cuet-ped-motor-development-p1.json` and `cuet-ped-motor-development-p2.json`.

## Per-file question-type distribution (match this exactly)

Each 20-question file contains:
- **10 mcq** (standard 4-option single correct)
- **3 match-the-following** (4 items per column)
- **3 assertion-reasoning** (standard A-R framework with 4 standard options)
- **2 logical-sequence** (4-item sequence)
- **1 true-false**
- **1 diagram-based** (references a PNG — see diagram-based spec)

## Per-file difficulty distribution

- 4 easy
- 9 medium
- 7 hard

## Per-file Bloom's distribution

Roughly: 4 remember, 6 understand, 6 apply, 4 analyse. Keep spread across question types.

## Output shape — CRITICAL

Each file is a **top-level JSON array** (NOT an object wrapper with a `questions` field). Example:

```json
[
  { "id": "...", ... },
  { "id": "...", ... }
]
```

## Canonical question shape (copy this structure verbatim)

### MCQ example — copy every field name exactly

```json
{
  "id": "cuet-ped-motor-development-01",
  "question_type": "mcq",
  "difficulty": "easy",
  "bloom_level": "remember",
  "question_text": "Which of the following is the correct sequence of gross motor development in infants?",
  "options": [
    { "key": "A", "text": "Sitting → crawling → standing → walking", "is_correct": true },
    { "key": "B", "text": "Crawling → walking → sitting → standing", "is_correct": false },
    { "key": "C", "text": "Walking → standing → sitting → crawling", "is_correct": false },
    { "key": "D", "text": "Standing → walking → sitting → crawling", "is_correct": false }
  ],
  "correct_answer": "A",
  "explanation": "Gross motor milestones follow a cephalocaudal sequence — head control first, then trunk (sitting by ~6 months), then crawling (~9 months), then standing with support (~10 months) and independent walking (~12 months).",
  "elimination_hints": [
    { "option_key": "B", "hint": "Crawling cannot precede sitting; the infant must first support the trunk upright.", "misconception": "Assuming locomotion before postural control." },
    { "option_key": "C", "hint": "Walking never precedes standing — bearing weight is a prerequisite.", "misconception": "Reverse-order motor development." },
    { "option_key": "D", "hint": "Independent standing requires prior head and trunk control, which develop during sitting and crawling.", "misconception": "Ignoring cephalocaudal principle." }
  ],
  "concept_tags": ["motor development", "milestones", "infancy"],
  "topic": "Motor Development in Children",
  "chapter_id": "cuet-ped-children-women",
  "subject": "Physical Education",
  "chapter": "Children & Women in Sports",
  "exam_suitability": ["CUET"]
}
```

### Match-the-following example — column items use `id` (NOT `key`)

```json
{
  "id": "cuet-ped-motor-development-11",
  "question_type": "match-the-following",
  "difficulty": "medium",
  "bloom_level": "understand",
  "question_text": "Match the motor development stage in Column A with its typical age in Column B and select the correct option.",
  "column_a": [
    { "id": "1", "text": "Reflexive movements" },
    { "id": "2", "text": "Rudimentary movements" },
    { "id": "3", "text": "Fundamental movements" },
    { "id": "4", "text": "Sport-related movements" }
  ],
  "column_b": [
    { "id": "P", "text": "2–6 years" },
    { "id": "Q", "text": "Birth–1 year" },
    { "id": "R", "text": "7 years onwards" },
    { "id": "S", "text": "0–2 years" }
  ],
  "correct_mapping": { "1": "Q", "2": "S", "3": "P", "4": "R" },
  "options": [
    { "key": "A", "text": "1-Q, 2-S, 3-P, 4-R", "is_correct": true },
    { "key": "B", "text": "1-S, 2-Q, 3-R, 4-P", "is_correct": false },
    { "key": "C", "text": "1-P, 2-R, 3-S, 4-Q", "is_correct": false },
    { "key": "D", "text": "1-R, 2-P, 3-Q, 4-S", "is_correct": false }
  ],
  "correct_answer": "A",
  "explanation": "Gallahue's hourglass model: reflexive (0–1 yr) → rudimentary (0–2 yr) → fundamental (2–6 yr) → specialised/sport-related (7+ yr).",
  "elimination_hints": [
    { "option_key": "hint_1", "hint": "Reflexive movements appear from birth, not after rudimentary.", "misconception": "Misordering development stages." },
    { "option_key": "hint_2", "hint": "Fundamental movement skills peak at 2–6, not 7+.", "misconception": "Confusing with sport-related stage." }
  ],
  "concept_tags": ["Gallahue", "developmental stages"],
  "topic": "Motor Development in Children",
  "chapter_id": "cuet-ped-children-women",
  "subject": "Physical Education",
  "chapter": "Children & Women in Sports",
  "exam_suitability": ["CUET"]
}
```

### Other types — same structure, these field differences:

- **assertion-reasoning**: `question_type: "assertion-reasoning"`. `question_text` contains the assertion+reason together, or add `assertion` and `reason` fields. Options A/B/C/D are the standard four (both true & R explains A / both true & R doesn't explain A / A true R false / A false).
- **logical-sequence**: `question_type: "logical-sequence"`. Add `items` array (4 items, each `{ id, text }`) and `correct_order` array (the 4 ids in correct order). Still include 4 options A/B/C/D.
- **true-false**: `question_type: "true-false"`. `correct_answer: "A"` or `"B"` (A=True, B=False). Include standard 4 options or just two — use 4 for consistency.
- **diagram-based**: `question_type: "diagram-based"`. Add `image_uri: "diagrams/<question-id>.png"`. Each p1 file's diagram question is the 20th question so `image_uri` = `"diagrams/<basename>-20.png"`. p2's is question 40 → `"diagrams/<basename>-40.png"`. **Do not generate the PNG itself — only the JSON reference.** Images will be produced separately.

## Hard constraints — common failure modes to AVOID

1. **`question_type`** must be exactly one of: `mcq`, `match-the-following`, `assertion-reasoning`, `logical-sequence`, `true-false`, `diagram-based`. No uppercase (not `MCQ`), no underscores (not `match_the_following`).
2. **Options** must be array of **objects** `{ key, text, is_correct }`. Never plain strings like `"A) foo"`.
3. **Elimination hints** must be array of **objects** `{ option_key, hint, misconception }`. Never plain strings. `option_key` is either the option letter (A/B/C/D) when the hint refers to a specific wrong option, or `hint_1`/`hint_2`/… for generic hints. Within a single question, never repeat an `option_key` value.
4. **MTF column items** must use `id` (not `key`) in both `column_a` and `column_b`. The `correct_mapping` keys/values reference those `id` strings.
5. **`chapter_id`** on every question must match exactly: `cuet-ped-children-women` OR `cuet-ped-yoga` OR `cuet-ped-nutrition`.
6. **`topic`** on every question must match the topic name column above **exactly** (punctuation, em-dashes, casing included).
7. **Top-level JSON** of each file is an ARRAY of 20 question objects — no outer `{ ..., questions: [...] }` wrapper.
8. **IDs** are kebab-case starting with `cuet-ped-` and strictly sequential (`-01`…`-20` in p1, `-21`…`-40` in p2).
9. **Correct-answer letter distribution** — MUST be balanced across each 20-question file:
   - Each of `A`, `B`, `C`, `D` should be the `correct_answer` for 4–6 of the 20 questions (i.e. 20–30% each).
   - No letter above 6 (30%). No letter below 4 (20%).
   - Applies to `mcq`, `match-the-following`, `assertion-reasoning`, `logical-sequence`, `diagram-based`. For `true-false` use A (True) vs B (False) roughly 50/50.
   - For **assertion-reasoning** specifically, also balance the SEMANTIC templates across the 3 A-R questions per file: don't let all 3 land on "Both A and R are correct and R explains A". Mix in at least one case with R not explaining A, or one of the partial-false templates.
   - Before emitting each file, verify your own correct-answer list meets these counts; if not, swap option assignments to fix.
   - This is a hard rule — previous generations clustered 85% of A-R on option A and 67% of MCQ on option B, which the app's quality scanner now flags as `ANSWER_DISTRIBUTION_SKEW`.

## Content quality bar

- Every MCQ must have 4 plausible options (not one obviously correct + three absurd).
- Explanations should be 2–4 sentences: state the answer, give the mechanism/reasoning, add one concrete NCERT-aligned detail (year, name, numerical value).
- Elimination hints are written for a student eliminating wrong options one at a time.
- Use NCERT Class 12 PE terminology. Reference Indian context where relevant (SAI, NSNIS Patiala, Paralympics India, Khelo India, etc.).
- No duplicated question stems across files.

## Delivery

Output all 30 files (3 chapters × 5 topics × 2 parts). Put each file in a separate ```json fenced block preceded by a header line indicating the filename, e.g.:

```
### Qbank/CUET/ped/cuet-ped-motor-development-p1.json
```json
[ ... 20 questions ... ]
```
```

Produce them in batches grouped by chapter. If the response would exceed length limits, generate chapter-by-chapter and I'll ask for the next.
