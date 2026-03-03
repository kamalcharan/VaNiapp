# VaNi App — Session Handover

## What is VaNi App
NEET & CUET exam prep mobile app for Gen-Z Indian students (15-18). Hand-drawn journal aesthetic. Bilingual: English + Telugu. Supabase backend.

## Tech Stack
- **Framework**: Expo SDK 54, React Native 0.81.5, React 19.1.0
- **Navigation**: expo-router v6
- **State**: Redux Toolkit + manual AsyncStorage persistence (debounced 500ms)
- **Backend**: Supabase (Postgres + Auth + Storage + Edge Functions)
- **Animations**: RN built-in Animated API only (NO react-native-reanimated)
- **Install**: `npm install --legacy-peer-deps` required
- **Dev server**: Runs on user's local machine, not in this environment

## Branch
- Current feature branch: `claude/init-app-improvements-NGkuX`
- Previous branches merged: `claude/vani-app-continuation-c60lq`

## Current State Summary
- **375 NEET JSON files** across 4 subjects in `Qbank/generated/`
  - Botany: 65 files, ~1,300 questions
  - Chemistry: 82 files, ~1,640 questions
  - Physics: 71 files, ~1,420 questions
  - Zoology: 157 files, ~3,136 questions
  - **Total: ~7,496 questions generated**
- Bulk import system (`Qbank/bulkinsert.html`) imports JSONs into Supabase
- Quality validation system (`Qbank/explore.html`) scans DB for issues
- 8 question type components all rendering from Supabase data

## What Was Done This Session (Session ending 2026-03-03)

### Completed Work
1. **Quality Validators** — Fixed false positives for assertion-reasoning, scenario-based, match-the-following, logical-sequence (validators assumed rich payload but data uses lean payload)
2. **Explore Quality Scanner** — Added language-aware quality scanning page with issue grouping, copy, resolve
3. **Dashboard Quality Card** — Shows issue counts, auto-detection of broken images
4. **Topic-Level Performance** — Added topic breakdown in chapter results with expandable sections
5. **Skip & Review Later** — Fixed blank page after last question, added skip/review functionality
6. **QBANK_AGENT.md Lessons Learned** — Added comprehensive Section 13 documenting all generation bugs, fixes, field standards, and production checklist (see `docs/QBANK_AGENT.md`)

### Key Bugs Fixed This Session
- Quality validators producing thousands of false positives (lean vs rich payload)
- Blank page after answering the last question in a chapter
- Country flag emojis not rendering (replaced with font glyphs)
- Music overlay showing on auth screens
- VaNi elimination sheet scroll content cut off

---

## NEXT SESSION PRIORITIES (Owner's Directive)

### Priority 1: NEET JSON & DB Data Audit
**Goal:** Verify all 375 JSON files are correctly structured and all data in Supabase is accurate.

- Check subject/chapter alignment: every JSON maps to the correct `med_chapters` entry
- Verify question counts per chapter match expectations
- Identify any JSONs that were **NOT imported** into Supabase (compare JSON file list vs DB records)
- Check for duplicate questions across files
- Verify `question_type` distribution matches the generation spec

### Priority 2: True/False "All FALSE" Bug Investigation
**Goal:** Find and fix why all True/False answers appear to be FALSE.

**CRITICAL FINDING:** The JSON files themselves have a roughly even True/False distribution:
```
Botany:    65 True, 65 False
Chemistry: 82 True, 82 False
Physics:    7 True,  7 False
Zoology:  148 True, 89 False
```
So the bug is **NOT in the generated data** — it's in the code path. Investigate:
- `src/lib/questions.ts` → `dbToV2()` / `buildPayload()` — how is `correct_answer` mapped for true-false?
- `src/components/exam/TrueFalseQuestion.tsx` — uses synthetic IDs `tf-true`/`tf-false`
- `src/lib/questionAdapter.ts` → `getCorrectId()` — does it handle true-false correctly?
- Check if the DB `correct_answer` field for true-false questions matches what the code expects
- The mapping between DB option keys (A/B) and synthetic IDs (tf-true/tf-false) may be broken

### Priority 3: Image/Diagram Questions Won't Work for NEET
**Goal:** Acknowledge and plan for diagram-based question limitations.

- Diagram-based questions require actual hosted images
- Current `image_uri` fields likely have placeholder or empty values
- Need to decide: (a) remove diagram-based from NEET generation, (b) source real images, or (c) use AI-generated diagrams
- Runtime safety exists: `qualityAutoDetect.ts` auto-reports IMAGE_LOAD_FAILED silently

### Priority 4: Production Readiness Testing
**Goal:** 100% production-ready for Questions, Answers, and Statistics.

Test areas:
- **Questions flow**: All 8 types render correctly from Supabase data
- **Answers flow**: Correct answer highlighting, explanation display, elimination hints
- **Statistics flow**: Chapter results accuracy, topic breakdown, strength evaluation
- **Edge cases**: Empty payload fields, missing translations, question_type normalization
- **Practice exam**: V2 type support end-to-end

### Priority 5: Code Cleanup — No Orphan Code
**Goal:** Remove dead code, unused imports, stale components.

- Find unreferenced components, utilities, and types
- Remove legacy question files if fully migrated to Supabase
- Clean up unused Redux slices or actions
- Remove commented-out code blocks

### Priority 6: Streamline for Reusability
**Goal:** DRY up repeated patterns across question screens and components.

- Identify duplicate logic across `chapter-question.tsx`, `quick-question.tsx`, `practice-question.tsx`
- Consider shared hooks or utility functions
- Standardize error handling patterns

---

## CRITICAL CAUTION: Supabase Access

**The assistant does NOT have access to the correct Supabase project.**

The owner (Kamal) will act as **moderator for all SQL operations**:
- Assistant proposes SQL queries
- Kamal runs them manually and shares results
- Assistant analyzes results and proposes next steps
- **DO NOT** use Supabase MCP tools to execute queries — they will hit the wrong project
- All `execute_sql` / `apply_migration` calls must go through Kamal

---

## Completed Releases (R1-R9+)

### R1-R3 (pre-existing)
Core app: auth, onboarding, profile, subject picker, chapter/practice exam screens, dashboard, history, basic question bank.

### R4-R6
Squad system, AI doubt solver (VaNi), focus mode music player, focus tracker, edit profile, dark mode, toast system.

### R7
Chapter strength tracker, StrengthMap component, elimination technique + Ask VaNi pills, answer review screen.

### R8: New Question Types + Adaptive Mix
8 question types, QuestionRenderer, QuestionV2 type system, strength-based type gating.

### R9: Practice V2 + Bookmarks + Dashboard
Practice exam V2, bookmark system, dashboard quality card, results V2 with type breakdown.

### R10 (current): Supabase Integration + Quality System
- Supabase backend fully connected (questions, chapters, topics, languages from DB)
- Bulk import system (`bulkinsert.html`) with chapter mapping and FK resolution
- Quality validation system (`explore.html`) with language-aware scanning
- Topic-level performance breakdown
- Skip & Review Later functionality
- QBANK_AGENT.md generation methodology guide

## Key Architecture

### Question Data Pipeline
```
JSON files (Qbank/generated/)
  → bulkinsert.html (browser-based bulk import)
    → Supabase DB (med_questions + med_options + med_elimination_hints)
      → src/lib/questions.ts dbToV2()
        → QuestionRenderer → type-specific component
```

### Question Types & Components
| Type | Component | Synthetic IDs | Notes |
|------|-----------|---------------|-------|
| mcq | McqQuestion | A/B/C/D | Standard 4-option |
| true-false | TrueFalseQuestion | tf-true/tf-false | **BUG: investigate correct mapping** |
| assertion-reasoning | AssertionReasoningQuestion | A/B/C/D | Parses A/R from payload or text |
| match-the-following | MatchTheFollowingQuestion | A/B/C/D | Interactive column pairing |
| fill-in-blanks | FillInBlanksQuestion | A/B/C/D | Blank highlighting with `______` |
| scenario-based | ScenarioBasedQuestion | A/B/C/D | Separate scenario card |
| diagram-based | DiagramBasedQuestion | A/B/C/D | **ISSUE: needs real images** |
| logical-sequence | LogicalSequenceQuestion | A/B/C/D | Sequence ordering |

### Key Files for Next Session
```
CRITICAL (bug investigation):
  src/lib/questions.ts              — dbToV2(), buildPayload() — true-false mapping
  src/components/exam/TrueFalseQuestion.tsx — synthetic ID logic
  src/lib/questionAdapter.ts        — getCorrectId()

DATA AUDIT:
  Qbank/generated/                  — 375 JSON files to verify
  Qbank/bulkinsert.html             — import tool (chapter mapping)
  Qbank/shared.js                   — quality validators

QUALITY:
  Qbank/explore.html                — quality scanner UI
  src/lib/qualityAutoDetect.ts      — runtime image failure detection

REFERENCE:
  docs/QBANK_AGENT.md               — generation rules + Section 13 lessons learned
```

## User Preferences
- "dont code without my go ahead" — always present plan and wait for approval
- "dont build everything in 1 go...do it as 3 files at a go" — batch work in groups of ~3 files
- User approves with "ok" or "yes"
- User checks with "are you done" / "all done?"
- Expo dev server runs on user's local machine — never claim to test locally
- **Kamal moderates all SQL/Supabase operations** — propose queries, don't execute directly
