# QBank Completion Plan — 3 Iterations

> **Goal**: Fill the Supabase DB with exam-quality questions so every chapter
> has enough content for all exam modes. QBank feeds data to every other feature.
>
> **Tools**: `Qbank/generate.html` (Gemini), `review.html`, `translate.html`, `insert.html`
> **Target**: 600 questions per chapter (30% easy, 45% medium, 25% hard)
> **DB Tables**: `med_questions`, `med_question_options`, `med_elimination_hints`

---

## Pre-Work: Coverage Audit

Before starting generation, run a coverage audit to see where we stand.

**How to verify** (Supabase SQL Editor):
```sql
-- Questions per subject
SELECT subject_id, COUNT(*) as total
FROM med_questions WHERE is_active = true
GROUP BY subject_id ORDER BY total DESC;

-- Questions per chapter
SELECT q.subject_id, q.chapter_id, c.name, COUNT(*) as total
FROM med_questions q
JOIN med_chapters c ON c.id = q.chapter_id
WHERE q.is_active = true
GROUP BY q.subject_id, q.chapter_id, c.name
ORDER BY q.subject_id, total ASC;

-- Questions per type
SELECT question_type, COUNT(*) as total
FROM med_questions WHERE is_active = true
GROUP BY question_type ORDER BY total DESC;

-- Chapters with ZERO questions
SELECT c.id, c.subject_id, c.name
FROM med_chapters c
LEFT JOIN med_questions q ON q.chapter_id = c.id AND q.is_active = true
WHERE q.id IS NULL AND c.subject_id IN ('physics','chemistry','botany','zoology')
ORDER BY c.subject_id, c.chapter_number;
```

---

## Iteration 1: NEET Core — Physics + Chemistry (MCQ-heavy)

**Scope**: 40 chapters (Physics 20 + Chemistry 20)
**Types**: MCQ (70%), Assertion-Reasoning (15%), True-False (15%)
**Difficulty**: 30% easy, 45% medium, 25% hard
**Target**: 100 questions per chapter = 4,000 total
**Elimination hints**: Required for all MCQ + Assertion-Reasoning questions

### Steps

| # | Action | Tool | Details |
|---|--------|------|---------|
| 1 | Run coverage audit | SQL | Get baseline counts per chapter |
| 2 | Generate Physics Ch 1-5 | `generate.html` | ~100 Qs each, MCQ focus, all 3 difficulties |
| 3 | Review + approve batch | `review.html` | Fix any factual errors, reject weak Qs |
| 4 | Insert to DB | `insert.html` | Verify topic_id mapping works |
| 5 | **Verify in app** | Mobile | Open Physics → any chapter → see questions loading |
| 6 | Generate Physics Ch 6-20 | `generate.html` | Remaining 15 chapters |
| 7 | Review + insert | `review.html` → `insert.html` | Batch process |
| 8 | Generate Chemistry Ch 1-10 | `generate.html` | Physical + Inorganic Chemistry |
| 9 | Generate Chemistry Ch 11-20 | `generate.html` | Organic Chemistry (8) + remaining |
| 10 | Review + insert all Chemistry | `review.html` → `insert.html` | |
| 11 | **Full verification** | Mobile + SQL | All 40 chapters show questions |

### UX Verification Checklist

- [ ] Open app → Subject: Physics → any chapter → questions load (not empty state)
- [ ] Open app → Subject: Chemistry → any chapter → questions load
- [ ] Chapter exam shows mix of easy/medium/hard questions
- [ ] Quick Practice (20Q) for Physics returns 20 questions
- [ ] Quick Practice (20Q) for Chemistry returns 20 questions
- [ ] Questions display correctly (text, options, no broken formatting)
- [ ] After answering wrong → explanation text shows (from `med_questions.explanation`)
- [ ] Elimination hints show for MCQ questions (long-press to eliminate works)

### Definition of Done

- [ ] 40 NEET chapters (Physics + Chemistry) each have 100+ questions in DB
- [ ] All questions have 4 options with exactly 1 correct
- [ ] All MCQ/AR questions have elimination hints in `med_elimination_hints`
- [ ] All questions have `concept_tags` populated (at least 1 tag per question)
- [ ] Status = 'active' for all inserted questions
- [ ] SQL audit shows no chapters with < 80 questions

---

## Iteration 2: NEET Complete — Biology + All 8 Types + Telugu

**Scope**: 32 chapters (Botany 17 + Zoology 15) + backfill types for Physics/Chemistry
**Types**: All 8 types with NEET exam mix distribution
**Target**: 200 questions per chapter across all 72 NEET chapters = 14,400 total
**Telugu**: All existing questions get Telugu translations

### Steps

| # | Action | Tool | Details |
|---|--------|------|---------|
| 1 | Generate Botany Ch 1-17 | `generate.html` | 100 Qs each, MCQ + AR + TF |
| 2 | Generate Zoology Ch 1-15 | `generate.html` | 100 Qs each, MCQ + AR + TF |
| 3 | Review + insert Biology | `review.html` → `insert.html` | |
| 4 | **Verify Biology in app** | Mobile | Botany/Zoology chapters load questions |
| 5 | Backfill types: Match-the-Following | `generate.html` | 15-20 per chapter, all 72 chapters |
| 6 | Backfill types: Fill-in-Blanks | `generate.html` | 10-15 per chapter |
| 7 | Backfill types: Scenario-Based | `generate.html` | 10-15 per chapter |
| 8 | Backfill types: Logical-Sequence | `generate.html` | 10-15 per chapter |
| 9 | Backfill types: Diagram-Based | `generate.html` | 10 per chapter (text-described only — see note below) |
| 10 | Review + insert all type backfills | `review.html` → `insert.html` | |
| 11 | Telugu translations batch | `translate.html` | All questions in DB get Telugu |
| 12 | **Full NEET verification** | Mobile + SQL | All 72 chapters, all types, Telugu toggle |

### UX Verification Checklist

- [ ] All 4 NEET subjects show questions in every chapter
- [ ] Switch language to Telugu → questions display in Telugu
- [ ] Question types variety: see MCQ, True-False, Assertion-Reasoning in a single session
- [ ] Match-the-Following renders with columns correctly
- [ ] Fill-in-Blanks renders with blank highlighted
- [ ] Scenario-Based renders with scenario passage + options
- [ ] Logical-Sequence renders with ordering options
- [ ] Practice Exam (200Q) loads successfully with questions from all 4 subjects
- [ ] Practice Exam Section A has 35 questions, Section B has 15 per subject
- [ ] Quick Practice shows different question types (not all MCQ)

### Note on Diagram-Based Questions

Diagram-based questions use **text descriptions only** (no actual images). The QBank
generate prompt instructs Gemini to describe the diagram in `question_text` and `imageAlt`.
The `imageUri` field stores a placeholder string. **Actual image generation/hosting is on
hold for future review** — the text-description approach works for exam prep since many
NEET coaching materials use the same format. If image support is added later, existing
diagram questions will need `image_url` updated to real URLs.

### Definition of Done

- [ ] All 72 NEET chapters have 200+ questions each
- [ ] All 8 question types present in every subject
- [ ] Type distribution within ±5% of target mix (60% MCQ, 15% AR, etc.)
- [ ] Telugu translations exist for 100% of questions
- [ ] Difficulty distribution within ±5% of target (30/45/25)
- [ ] `concept_tags` populated for 100% of questions
- [ ] `med_elimination_hints` populated for all MCQ, AR, Match, Fill, Scenario, Sequence questions
- [ ] Practice Exam loads full 200 questions (50 per subject)

---

## Iteration 3: CUET + Quality + Coverage Targets

**Scope**: 100+ CUET chapters + quality polish for NEET
**Types**: CUET mix (70% MCQ, rest distributed)
**Target**: 200 questions per CUET chapter + reach 600/chapter for NEET
**Quality**: Difficulty recalibration, flagged question review, gap filling

### Steps

| # | Action | Tool | Details |
|---|--------|------|---------|
| 1 | Seed missing CUET topics | SQL | Fill `med_topics` for CUET chapters lacking topics |
| 2 | Generate CUET Science subjects | `generate.html` | cuet-physics, cuet-chemistry, biology, mathematics |
| 3 | Generate CUET Commerce subjects | `generate.html` | accountancy, business-studies, economics |
| 4 | Generate CUET Arts subjects | `generate.html` | history, geography, political-science, sociology, psychology |
| 5 | Generate remaining CUET subjects | `generate.html` | computer-science, environmental-studies, etc. |
| 6 | Review + insert all CUET | `review.html` → `insert.html` | |
| 7 | Telugu translations for CUET | `translate.html` | All CUET questions |
| 8 | NEET gap fill: reach 600/chapter | `generate.html` | Generate additional questions for NEET chapters < 600 |
| 9 | Quality review pass | `review.html` | Re-review any flagged/low-quality questions |
| 10 | **Full system verification** | Mobile + SQL | All exams, all subjects |

### UX Verification Checklist

- [ ] CUET students can select their subjects during onboarding
- [ ] CUET subjects show chapters with questions
- [ ] CUET question style matches CUET exam pattern (more MCQ, less AR)
- [ ] NEET chapters now have rich variety (600 Qs = many sessions without repeats)
- [ ] Repeat a chapter exam 3 times → get different questions each time
- [ ] All question types render correctly in Telugu
- [ ] Quick Practice for CUET subjects works
- [ ] No chapters show "No Questions Yet" empty state

### Definition of Done

- [ ] All CUET chapters have 200+ questions each
- [ ] All NEET chapters have 600+ questions each
- [ ] Total question bank: 50,000+ questions
- [ ] Telugu translations: 100% coverage
- [ ] Elimination hints: 100% for applicable types
- [ ] Concept tags: 100% coverage
- [ ] Zero empty chapters across both exams
- [ ] Coverage audit SQL shows all green (every chapter ≥ target)

---

## Summary

| Iteration | Chapters | Questions | Focus |
|-----------|----------|-----------|-------|
| **1** | 40 (Phy + Chem) | ~4,000 | Get pipeline working, MCQ-heavy |
| **2** | 72 (all NEET) | ~14,400 | All types, Telugu, full NEET |
| **3** | 172+ (NEET + CUET) | ~50,000+ | Scale, polish, 600/chapter |

**Timeline estimate**: Not estimated (depends on generation speed + review throughput).
Each iteration is independently valuable — app is usable after Iteration 1.
