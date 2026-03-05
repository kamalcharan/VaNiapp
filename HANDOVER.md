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
- Current feature branch: `claude/init-project-83tEF`
- Previous branches: `claude/init-app-improvements-NGkuX`, `claude/vani-app-continuation-c60lq`

---

## What Was Done This Session (Session ending 2026-03-05)

### CUET Physics Question Bank — Complete Generation & DB Insert

Generated and inserted **866 CUET Physics questions** across 6 chapters (21 FINAL files):

| Chapter | Subtopics | Questions | DB Status |
|---------|-----------|-----------|-----------|
| Electrostatics | coulomb, field, dipole, gauss, potential, capacitor | 240 | 240/240 |
| Current Electricity | ohm, kirchhoff, wheatstone, potentiometer, power, instruments | 206 | 206/206 |
| Magnetic Effects | biot, ampere, solenoid, force, devices | 180 | 180/180 |
| EM Induction & AC | faraday, inductance, ac-circuits, ac-advanced | 160 | 160/160 |
| EM Waves | spectrum, advanced | 40 | 40/40 |
| Communication | basics, advanced | 40 | 40/40 |
| **Total** | **21 FINAL files** | **866** | **866/866** |

### Verified DB Integrity
- Ran chapter-level and subtopic-level SQL counts — all match FINAL files exactly
- No missing inserts, no duplicates

---

## Lessons Learned (This Session)

### 1. Batch Size & Context Management
- **40 questions per subtopic** is the sweet spot for generation quality
- Going beyond 40 in a single prompt leads to repetition and quality drop-off
- Splitting into subtopics (e.g., field → coulomb, field, dipole, gauss, potential, capacitor) keeps questions focused

### 2. Question ID Naming Convention
- Pattern: `cuet-phy-{subtopic}-{nn}` (e.g., `cuet-phy-elec-coulomb-01`)
- The `TOPIC_TO_CHAPTER` mapping in `bulkinsert.html` uses prefix matching — **longer prefixes must come before shorter ones** (e.g., `phy-elec-semiconductor` before `phy-elec`)
- Always verify new ID prefixes are added to the mapping BEFORE inserting

### 3. Bulkinsert Dedup Works Reliably
- Re-running the same FINAL file is safe — existing questions show as "Already in DB (skip)"
- Only genuinely new `question_id` values get inserted
- The tool processes ALL questions — no hidden limit at 40 or any other number

### 4. Incomplete Files Are OK — Track Them
- B12 instruments (6/40) and B15 solenoid (20/40) are incomplete but what's there is in the DB
- Better to insert partial quality content than wait for complete sets

### 5. Question Schema That Works
Every FINAL JSON question must have:
```json
{
  "id": "cuet-phy-elec-coulomb-01",
  "question_type": "mcq",
  "difficulty": "easy|medium|hard",
  "question_text": "...",
  "explanation": "...",
  "correct_answer": "B",
  "concept_tags": ["tag1", "tag2"],
  "topic": "Human-readable topic name",
  "subject": "cuet-physics",
  "chapter": "Chapter Name",
  "bloom_level": "remember|understand|apply|analyze",
  "exam_suitability": ["CUET", "NEET"],
  "options": [
    {"key": "A", "text": "...", "is_correct": false},
    {"key": "B", "text": "...", "is_correct": true},
    {"key": "C", "text": "...", "is_correct": false},
    {"key": "D", "text": "...", "is_correct": false}
  ],
  "elimination_hints": [
    {"option_key": "A", "hint": "...", "misconception": "..."},
    {"option_key": "C", "hint": "...", "misconception": null},
    {"option_key": "D", "hint": "...", "misconception": "..."}
  ],
  "chapter_id": "cuet-phy-electrostatics",
  "subtopic": "Coulomb's Law and Electric Charges"
}
```
- `elimination_hints`: only for **wrong** options (3 hints for 4-option MCQ)
- `correct_answer` must match the `key` of the option with `is_correct: true`
- `chapter_id` must exist in the `TOPIC_TO_CHAPTER` mapping

### 6. DB Schema Awareness
- Table: `med_questions` — stores full question JSON in `payload` column
- Related: `med_options`, `med_elimination_hints` (inserted by bulkinsert)
- `payload->>'question_id'` is the unique key used for dedup
- Chapter resolution: `bulkinsert.html` maps `id` prefix → `chapter_id` via `TOPIC_TO_CHAPTER`

### 7. Diagram/Image Questions
- Generated 60 matplotlib PNG diagrams in `Qbank/CUET/physics/images/`
- Image references in JSON use relative paths — need Supabase Storage upload for production
- Diagram-based questions work in schema but need hosted image URLs to render in-app

### 8. SQL Queries — Kamal Moderates
- Assistant proposes queries, Kamal runs them manually
- Always use `payload->>'question_id'` for filtering (not `id` column)
- Useful patterns:
  ```sql
  -- Count by chapter
  SELECT payload->>'question_id' LIKE 'cuet-phy-elec-%' ...

  -- List all IDs for a subtopic
  SELECT payload->>'question_id' FROM med_questions
  WHERE payload->>'question_id' LIKE 'cuet-phy-elec-coulomb-%' ORDER BY 1;
  ```

---

## Incomplete Work (Carry Forward)

### Physics Questions Still Needed
| File | Current | Target | Gap |
|------|---------|--------|-----|
| B12 instruments | 6 | 40 | 34 |
| B15 solenoid | 20 | 40 | 20 |

### Physics Chapters With NO Questions Yet
- **Optics** (ray optics, wave optics)
- **Dual Nature** (photoelectric effect, matter waves)
- **Atoms & Nuclei** (Bohr model, radioactivity, nuclear reactions)
- **Electronic Devices** (semiconductors, diodes, transistors, logic gates)

### Existing Priorities (From Previous Session)
- Priority 2: True/False "All FALSE" bug — in code path, not data
- Priority 3: Image/diagram hosting strategy
- Priority 4: Production readiness testing
- Priority 5: Code cleanup
- Priority 6: DRY up repeated patterns

---

## NEXT SESSION: Engineering Graphics (CUET)

### Subject Overview
Engineering Graphics is a CUET-specific subject (not in NEET). Topics to cover:

### Proposed Subtopics & Question Plan

| # | Subtopic | ID Prefix | Target |
|---|----------|-----------|--------|
| B01 | Scales & Engineering Curves | `cuet-eg-scales` | 40 |
| B02 | Projection of Points & Lines | `cuet-eg-projections` | 40 |
| B03 | Projection of Planes | `cuet-eg-planes` | 40 |
| B04 | Projection of Solids | `cuet-eg-solids` | 40 |
| B05 | Sections of Solids | `cuet-eg-sections` | 40 |
| B06 | Development of Surfaces | `cuet-eg-development` | 40 |
| B07 | Isometric Projections | `cuet-eg-isometric` | 40 |
| B08 | Orthographic Projections | `cuet-eg-orthographic` | 40 |

**Estimated total: ~320 questions**

### Setup Needed Before Generation
1. **Create DB chapter**: `cuet-eg-engineering-graphics` in `med_chapters`
2. **Add topic mappings** to `bulkinsert.html`:
   ```javascript
   // Engineering Graphics
   'eg-scales':       'cuet-eg-engineering-graphics',
   'eg-projections':  'cuet-eg-engineering-graphics',
   'eg-planes':       'cuet-eg-engineering-graphics',
   'eg-solids':       'cuet-eg-engineering-graphics',
   'eg-sections':     'cuet-eg-engineering-graphics',
   'eg-development':  'cuet-eg-engineering-graphics',
   'eg-isometric':    'cuet-eg-engineering-graphics',
   'eg-orthographic': 'cuet-eg-engineering-graphics',
   ```
3. **Add subject mapping**: `'eg-'` → subject `cuet-engineering-graphics` in bulkinsert subject resolution
4. **Create folder**: `Qbank/CUET/engineering-graphics/new-YYYY-MM-DD/`

### Engineering Graphics — Special Considerations
- **Heavily visual subject** — many questions involve reading/interpreting drawings
- Focus on **theory MCQs** that can work without images: conventions, rules, terminology, angle calculations, projection principles
- For diagram-based questions: generate matplotlib/SVG diagrams showing projection views, section lines, development patterns
- Question types: primarily MCQ, some fill-in-blanks (numerical answers like true lengths, angles)
- Bloom levels: mix of remember (conventions), understand (principles), apply (calculate projections)

### Key Files for Next Session
```
GENERATION:
  docs/QBANK_AGENT.md               — generation rules & lessons learned
  Qbank/CUET/physics/*/new-*/*FINAL* — reference for JSON schema

IMPORT:
  Qbank/bulkinsert.html              — needs new TOPIC_TO_CHAPTER entries

INCOMPLETE PHYSICS (if time permits):
  B12-cuet-phy-current-instruments   — needs 34 more questions
  B15-cuet-phy-mag-solenoid          — needs 20 more questions
```

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

## Question Bank Inventory (All Subjects)

### NEET Questions (in `Qbank/generated/`)
| Subject | Files | Questions |
|---------|-------|-----------|
| Botany | 65 | ~1,300 |
| Chemistry | 82 | ~1,640 |
| Physics | 71 | ~1,420 |
| Zoology | 157 | ~3,136 |
| **Total** | **375** | **~7,496** |

### CUET Physics (in `Qbank/CUET/physics/`)
| Chapter | Files | Questions | DB |
|---------|-------|-----------|-----|
| Electrostatics | 6 | 240 | 240 |
| Current Electricity | 6 | 206 | 206 |
| Magnetic Effects | 5 | 180 | 180 |
| EM Induction & AC | 4 | 160 | 160 |
| EM Waves | 2 | 40 | 40 |
| Communication | 2 | 40 | 40 |
| **Total** | **25** | **866** | **866** |

### CUET Engineering Graphics (planned)
- Target: ~320 questions across 8 subtopics
- Status: Not started

---

## Completed Releases (R1-R10)

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

### R10: Supabase Integration + Quality System
- Supabase backend fully connected (questions, chapters, topics, languages from DB)
- Bulk import system (`bulkinsert.html`) with chapter mapping and FK resolution
- Quality validation system (`explore.html`) with language-aware scanning
- Topic-level performance breakdown
- Skip & Review Later functionality
- QBANK_AGENT.md generation methodology guide

### R11 (current): CUET Question Bank
- 866 CUET Physics questions generated, validated, and inserted
- 21 FINAL JSON files across 6 chapters
- Diagram generation pipeline (matplotlib PNGs)
- Verification tooling (`verify.html`)

## Key Architecture

### Question Data Pipeline
```
JSON files (Qbank/generated/ or Qbank/CUET/)
  -> bulkinsert.html (browser-based bulk import)
    -> Supabase DB (med_questions + med_options + med_elimination_hints)
      -> src/lib/questions.ts dbToV2()
        -> QuestionRenderer -> type-specific component
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

## User Preferences
- "dont code without my go ahead" — always present plan and wait for approval
- "dont build everything in 1 go...do it as 3 files at a go" — batch work in groups of ~3 files
- User approves with "ok" or "yes"
- User checks with "are you done" / "all done?"
- Expo dev server runs on user's local machine — never claim to test locally
- **Kamal moderates all SQL/Supabase operations** — propose queries, don't execute directly
