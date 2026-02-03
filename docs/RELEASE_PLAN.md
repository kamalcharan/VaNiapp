# VaNi Release Plan — AI Features (No DB)

> All features leverage the current stack: Expo 54, Redux Toolkit,
> AsyncStorage, local JSON data, and Supabase Edge Functions for
> Claude API proxying. No PostgreSQL, no Redis, no backend server.

---

## Current State (R1–R6 complete)

| Layer | What Exists |
|-------|------------|
| State | Redux: auth, practice, music, focus, squad — persisted via AsyncStorage |
| Data | Local JSON: 8 chapter question files in `src/data/questions/`, chapters in `src/data/chapters.ts` |
| Auth | Supabase Auth (email/OTP) |
| UI | Journal aesthetic, StickyNote, JournalCard, ConfettiBurst, StreakBadge, Toast |
| Exam | 3 modes — Chapter (25Q), Practice (200Q), Quick (20Q) — all MCQ only |
| Question model | `Question` type with 4 options, explanation, elimination technique, bilingual |

---

## Release Map

```
R7 ─── Stage System + QuestionV2 Types
 │
R8 ─── New Question Type UIs
 │
R9 ─── AI Doubt Solver (flagship)
 │
R10 ── Wrong-Answer Analysis + Concept Explainer
 │
R11 ── AI Study Plan + Mock Analysis
 │
R12 ── Paywall + Tier Gating
```

---

## R7 — Stage Progression + QuestionV2 Type System

**Goal**: Introduce the stage ladder and extend the question model to support
all 8 question types. No UI for new types yet — this is the data foundation.

### What Gets Built

1. **Stage system in Redux**
   - New `stageSlice.ts` tracking: `stage`, `totalAttempted`, `subjectAccuracy`, `lastEvaluatedAt`
   - Evaluate stage every 50 questions (in `completeChapterExam` / quick-question flow)
   - Stages: Rookie → Learner → Achiever → Pro → NEET Ready
   - No demotion — once earned, permanent

2. **QuestionV2 type definition**
   - Extend `src/types/index.ts` with `QuestionV2`, `QuestionType`, `QuestionPayload` union
   - Backward-compatible: existing `Question` maps to `QuestionV2` with `type: 'mcq'`
   - Add adapter function `legacyToV2(q: Question): QuestionV2`

3. **Stage badge on dashboard + profile**
   - Show current stage emoji + name next to greeting
   - Stage progress bar (questions until next stage)

4. **Stage gate for question selection**
   - Question loader filters by `stage` field — Rookie only sees easy MCQ + T/F
   - As student progresses, harder types unlock (shown with lock icon until available)

### Files

| Action | File |
|--------|------|
| Create | `src/store/slices/stageSlice.ts` |
| Modify | `src/types/index.ts` — add QuestionV2, QuestionType, Stage, StageConfig |
| Modify | `src/store/index.ts` — register stageSlice, persist it |
| Create | `src/lib/stageEvaluator.ts` — pure function: given stats → returns Stage |
| Create | `src/lib/questionAdapter.ts` — legacyToV2 converter |
| Modify | `app/(tabs)/index.tsx` — show stage badge |
| Modify | `app/(tabs)/profile.tsx` — show stage + progress |
| Modify | `app/(exam)/quick-question.tsx` — call stage evaluator after answer |

### How It Works Without DB

- Stage state lives in `stageSlice` → auto-persisted to AsyncStorage via existing `store.subscribe`
- Accuracy / attempt counts computed from `practiceSlice.chapterHistory` + local counter in stageSlice
- All local, zero network calls

---

## R8 — New Question Type UIs

**Goal**: Build the exam screens for all 8 question types. Students start seeing
variety based on their stage.

### What Gets Built

1. **Question type renderer (switch component)**
   - `QuestionRenderer.tsx` — takes `QuestionV2`, renders correct UI by `type`
   - Each type gets its own sub-component

2. **Question type UI components**

   | Type | Component | UX |
   |------|-----------|-----|
   | `mcq` | `McqQuestion.tsx` | Existing behavior (4 radio options) |
   | `true-false` | `TrueFalseQuestion.tsx` | Two large True/False cards, swipe-able |
   | `assertion-reasoning` | `AssertionReasoningQuestion.tsx` | Assertion card + Reason card stacked, then 4 evaluation options below |
   | `match-the-following` | `MatchQuestion.tsx` | Two columns with drag lines or MCQ combo options |
   | `fill-in-blanks` | `FillBlanksQuestion.tsx` | Sentence with highlighted blank, 4 word options below |
   | `diagram-based` | `DiagramQuestion.tsx` | Zoomable image + 4 options below |
   | `logical-sequence` | `SequenceQuestion.tsx` | Draggable item cards OR MCQ combo options |
   | `scenario-based` | `ScenarioQuestion.tsx` | Scrollable passage card + 4 options below |

3. **Sample questions for each type**
   - Add 5-10 sample questions per new type in `src/data/questions/`
   - Initially for Physics + Biology (highest NEET weight)

4. **Wire into exam flows**
   - `chapter-question.tsx`, `quick-question.tsx`, `practice-question.tsx` all use `QuestionRenderer`
   - Elimination technique works for MCQ-style types (MCQ, assertion-reasoning, fill-blanks, scenario, diagram, match, sequence)
   - True/False has no elimination (binary choice)

### Files

| Action | File |
|--------|------|
| Create | `src/components/exam/QuestionRenderer.tsx` |
| Create | `src/components/exam/McqQuestion.tsx` |
| Create | `src/components/exam/TrueFalseQuestion.tsx` |
| Create | `src/components/exam/AssertionReasoningQuestion.tsx` |
| Create | `src/components/exam/MatchQuestion.tsx` |
| Create | `src/components/exam/FillBlanksQuestion.tsx` |
| Create | `src/components/exam/DiagramQuestion.tsx` |
| Create | `src/components/exam/SequenceQuestion.tsx` |
| Create | `src/components/exam/ScenarioQuestion.tsx` |
| Create | `src/data/questions/sample-assertion-reasoning.ts` |
| Create | `src/data/questions/sample-match.ts` |
| Create | `src/data/questions/sample-truefalse.ts` |
| Create | `src/data/questions/sample-scenario.ts` |
| Modify | `src/data/questions/index.ts` — export new sample sets |
| Modify | `app/(exam)/chapter-question.tsx` — use QuestionRenderer |
| Modify | `app/(exam)/quick-question.tsx` — use QuestionRenderer |
| Modify | `app/(exam)/practice-question.tsx` — use QuestionRenderer |

### How It Works Without DB

- All sample questions are static JSON files bundled in the app
- Question type filtering uses the `stage` field + student's current stage from Redux
- Zero network dependency — works fully offline

---

## R9 — AI Doubt Solver

**Goal**: The flagship AI feature. Student taps "Ask VaNi", types a question,
gets an AI-powered explanation. This is the primary reason to upgrade to AI tier.

### Architecture (No DB)

```
┌──────────────┐     HTTPS POST      ┌──────────────────┐     Claude API
│  Mobile App  │ ──────────────────► │ Supabase Edge Fn │ ──────────────►
│  (AI Screen) │ ◄────────────────── │ /ai/doubt-solver │ ◄──────────────
└──────────────┘     JSON response   └──────────────────┘
                                       │
                                       ├─ Validates JWT (Supabase Auth)
                                       ├─ Checks rate limit (in-memory map)
                                       └─ Calls Claude API (Haiku/Sonnet)
```

- **No Redis**: Rate limiting via in-memory Map in Edge Function + client-side Redux counter
- **No DB for logs**: Usage tracked client-side in `aiSlice`. Server logs to Supabase Edge Function logs (free tier)
- **API key stays server-side**: Claude API key lives in Supabase secrets, never on device

### What Gets Built

1. **Supabase Edge Function**: `supabase/functions/ai-doubt-solver/index.ts`
   - Accepts: `{ query, subjectId, chapterId?, exam, language }`
   - Validates Supabase JWT from Authorization header
   - Builds system prompt with exam + subject context
   - Calls Claude Haiku (default) or Sonnet (if query contains comparison/multi-step keywords)
   - Returns: `{ answer, relatedConcepts, source: 'generated' }`
   - Prompt caching header enabled for system prompt

2. **AI Slice**: `src/store/slices/aiSlice.ts`
   - `dailyUsage` counter (resets at midnight)
   - `doubtHistory` (last 20 queries — serves as on-device semantic cache)
   - `tier: 'free' | 'pro' | 'ai'` (manually set for now, paywall in R12)
   - `stage` reference for contextual prompting

3. **Doubt Solver Screen**: `app/(tabs)/ask-vani.tsx`
   - New tab in bottom nav (replace or add alongside existing 3)
   - Chat-bubble interface in a scrollable view
   - Input bar at bottom with subject selector chip
   - Typing indicator while waiting for AI response
   - Responses rendered as markdown (bold, bullets, code for formulas)
   - "Was this helpful?" thumbs up/down (stored locally for now)

4. **"Ask VaNi" entry points**
   - Floating button on question review screens (`answer-review.tsx`, post-answer feedback)
   - Button in chapter-results when accuracy < 50% ("Struggling? Ask VaNi")
   - Dashboard card for AI tier users

5. **Client-side caching**
   - Before calling Edge Function, check `doubtHistory` for similar query (exact match on `subjectId + normalized query`)
   - If hit → return cached response instantly, no network call
   - AsyncStorage persists doubt history across app restarts

### Files

| Action | File |
|--------|------|
| Create | `supabase/functions/ai-doubt-solver/index.ts` |
| Create | `src/store/slices/aiSlice.ts` |
| Create | `src/lib/aiClient.ts` — wrapper: check cache → call Edge Fn → store response |
| Create | `app/(tabs)/ask-vani.tsx` — doubt solver chat screen |
| Modify | `app/(tabs)/_layout.tsx` — add Ask VaNi tab |
| Modify | `src/store/index.ts` — register aiSlice, persist it |
| Modify | `app/(exam)/answer-review.tsx` — "Ask VaNi" button |
| Modify | `app/(exam)/chapter-results.tsx` — struggling CTA |
| Modify | `app/(tabs)/index.tsx` — AI card for AI-tier users |

### Rate Limiting (No DB)

```typescript
// Client-side (aiSlice.ts)
dailyUsage: {
  date: '2026-02-03',       // resets when date changes
  doubtSolver: 0,           // incremented per query
  limit: 50,
}

// Server-side (Edge Function — in-memory, resets on cold start)
const usageMap = new Map<string, { count: number; resetAt: number }>();
// Per userId: allow 50/day, 15/hour
// Cold starts reset the map — acceptable for POC, not exploitable at scale
```

### Estimated Cost per Edge Function Call

| Model | Input | Output | Cost/Call |
|-------|-------|--------|-----------|
| Haiku | ~800 tokens | ~500 tokens | ~₹0.05 |
| Sonnet | ~800 tokens | ~500 tokens | ~₹0.80 |

With 80/20 Haiku/Sonnet split and client cache: **~₹40-60/user/month**

---

## R10 — Wrong-Answer Analysis + Concept Explainer

**Goal**: After getting a question wrong, show AI-powered analysis of the
misconception. Plus, tap any concept tag to get a deep explanation.

### Architecture (No DB)

**Wrong-Answer Analysis** — mostly pre-generated, bundled locally:

```
┌────────────────────────────┐
│  src/data/explanations/    │   ← Pre-generated JSON files
│    physics-laws-of-motion  │      per (question × wrong option)
│    chemistry-bonding       │
│    botany-cell-biology     │
│    ...                     │
└────────────────────────────┘
         │
         ▼
   Student answers wrong
         │
   Lookup by questionId + selectedOptionId
         │
   ┌─ HIT ──► Show pre-generated analysis (zero cost)
   │
   └─ MISS ─► Call Supabase Edge Function (Haiku) ─► Cache response locally
```

**Concept Explainer** — same pattern but keyed by `conceptTag`:

```
src/data/concepts/
  physics/
    newtons-laws.json
    thermodynamics.json
  chemistry/
    chemical-bonding.json
  ...
```

### What Gets Built

1. **Pre-generated content files**
   - `src/data/explanations/` — one JSON file per chapter
   - Each file: array of `{ questionId, selectedOptionId, misconception, correctReasoning, tip, conceptTag }`
   - Start with existing 8 chapters (all current questions) — ~200 questions × 3 wrong options = 600 entries
   - Generated offline using a script (Claude Haiku batch)

2. **Content generation script**
   - `scripts/generate-explanations.ts` — reads all questions from `src/data/questions/`, calls Claude API, writes JSON
   - Run once locally, output committed to repo
   - Can be re-run when new questions are added

3. **Pre-generated concept files**
   - `src/data/concepts/` — one JSON per subject, containing concept explanations
   - Each entry: `{ conceptTag, title, explanation, analogy, examRelevance, commonMistakes, quickRecap }`
   - Start with ~50 concepts covering existing chapters

4. **Supabase Edge Function for cache misses**
   - `supabase/functions/ai-wrong-answer/index.ts` — fallback when pre-gen misses
   - `supabase/functions/ai-concept-explain/index.ts` — fallback for concepts not in bundle

5. **Wrong-Answer UI**
   - After wrong answer in any exam mode: show expandable "Why was I wrong?" card
   - Card shows: misconception, correct reasoning, tip
   - Concept tag is tappable → opens concept explainer bottom sheet

6. **Concept Explainer Bottom Sheet**
   - `src/components/ConceptExplainerSheet.tsx`
   - Triggered from: wrong-answer analysis tag, chapter screen concept list, doubt solver related concepts
   - Shows: title, explanation (markdown), analogy in a StickyNote, exam relevance, common mistakes

### Files

| Action | File |
|--------|------|
| Create | `scripts/generate-explanations.ts` |
| Create | `scripts/generate-concepts.ts` |
| Create | `src/data/explanations/*.json` (per chapter, generated) |
| Create | `src/data/concepts/*.json` (per subject, generated) |
| Create | `src/lib/explanationLookup.ts` — local lookup + Edge Function fallback |
| Create | `src/lib/conceptLookup.ts` — local lookup + Edge Function fallback |
| Create | `src/components/ConceptExplainerSheet.tsx` |
| Create | `supabase/functions/ai-wrong-answer/index.ts` |
| Create | `supabase/functions/ai-concept-explain/index.ts` |
| Modify | `app/(exam)/chapter-question.tsx` — wrong-answer card in feedback |
| Modify | `app/(exam)/quick-question.tsx` — wrong-answer card in feedback |
| Modify | `app/(exam)/answer-review.tsx` — concept tags + explainer sheet |
| Modify | `src/store/slices/aiSlice.ts` — track wrong-answer + concept usage |

### How It Works Without DB

- All pre-generated content ships **inside the app bundle** as JSON imports
- Lookup is a synchronous `Map.get()` — instant, offline, zero cost
- Edge Function only called for questions/concepts not in the bundle (~5-10% of cases)
- Fallback responses cached in AsyncStorage for next time

### Cost Impact

- 90%+ of wrong-answer analysis: **₹0** (pre-generated)
- Concept explainer: **₹0** for bundled concepts, ~₹0.80/call for Sonnet fallback
- Net impact on per-user cost: **₹5-15/month** (mostly from rare concept fallbacks)

---

## R11 — AI Study Plan + Mock Analysis

**Goal**: Weekly study plan generation and post-mock deep analysis.
Both are low-frequency, high-value features.

### Architecture (No DB)

Both features call Sonnet via Edge Functions. Responses stored in Redux + AsyncStorage.

```
Weekly Plan:
  Student taps "Generate Plan" or auto on Monday
    → Collect performance data from practiceSlice + stageSlice
    → POST to Edge Function with full context
    → Sonnet generates 7-day plan
    → Stored in aiSlice.currentPlan
    → Displayed as journal-style weekly spread

Mock Analysis:
  Student completes Practice Exam (200Q)
    → Collect session data + last 5 mock scores
    → POST to Edge Function
    → Sonnet generates analysis
    → Stored in aiSlice.mockAnalyses[sessionId]
    → Displayed on practice-results screen
```

### What Gets Built

1. **Supabase Edge Functions**
   - `supabase/functions/ai-study-plan/index.ts`
   - `supabase/functions/ai-mock-analysis/index.ts`
   - Both call Sonnet with structured prompts
   - Study plan prompt includes: subject accuracy map, weak chapters, streak, daily average
   - Mock analysis prompt includes: current score, subject breakdown, time management, historical trend

2. **Study Plan Screen**: `app/(tabs)/study-plan.tsx`
   - Weekly spread view — each day is a JournalCard with subject, chapters, target questions
   - Current day highlighted
   - Progress checkmarks (student manually ticks off daily goals → tracked in aiSlice)
   - "Refresh Plan" button (max 2/day)
   - Empty state: "Complete 5 chapter tests to unlock your first AI study plan"

3. **Mock Analysis on Results**
   - Extend `app/(exam)/practice-results.tsx`
   - After score summary: "AI Analysis" expandable section
   - Shows: verdict per subject (strong/improving/needs-work/critical), time management insight, compared-to-previous trend, top 3 priority actions
   - Loading state while Sonnet generates (~3-5 seconds)

4. **Performance data collector**
   - `src/lib/performanceCollector.ts` — aggregates data from `practiceSlice` history
   - Computes: per-subject accuracy, weak/strong chapters, trends over last N sessions
   - Used by both study plan and mock analysis Edge Functions

### Files

| Action | File |
|--------|------|
| Create | `supabase/functions/ai-study-plan/index.ts` |
| Create | `supabase/functions/ai-mock-analysis/index.ts` |
| Create | `src/lib/performanceCollector.ts` |
| Create | `app/(tabs)/study-plan.tsx` |
| Modify | `app/(tabs)/_layout.tsx` — add Study Plan tab (or move to sub-screen) |
| Modify | `app/(exam)/practice-results.tsx` — AI analysis section |
| Modify | `src/store/slices/aiSlice.ts` — currentPlan, mockAnalyses, dailyGoalChecks |

### How It Works Without DB

- Performance data: computed from `practiceSlice.chapterHistory` + `practiceSlice.practiceHistory` (already persisted in AsyncStorage)
- Study plan: stored in `aiSlice.currentPlan` → AsyncStorage
- Mock analysis: stored in `aiSlice.mockAnalyses` keyed by session ID → AsyncStorage
- Historical data limited to what's on device (sufficient for POC — student's own device has their own history)

### Cost Impact

- Study plan: 1 Sonnet call/week = ~₹4-5/month per user
- Mock analysis: 2-4 Sonnet calls/month = ~₹5-10/month per user
- Total: **~₹10-15/month per user** (low frequency, high perceived value)

---

## R12 — Paywall + Tier Gating

**Goal**: Gate AI features behind the VaNi AI tier. Show paywall, handle
upgrade flow, and enforce tier checks throughout the app.

### Architecture (No DB)

```
Tier Source of Truth: Supabase Auth user metadata
  → user.user_metadata.tier = 'free' | 'pro' | 'ai'
  → Synced to Redux authSlice on app launch
  → Edge Functions validate tier from JWT before processing AI calls

Payment: Razorpay (India-standard) via WebView
  → On success, Razorpay webhook calls Supabase Edge Function
  → Edge Function updates user_metadata.tier via Supabase Admin API
  → App polls or listens for metadata change
```

### What Gets Built

1. **Paywall Screen**: `app/paywall.tsx`
   - Two cards: VaNi Pro vs VaNi AI side-by-side
   - Feature comparison checklist (Pro features with checks, AI features with lock/check)
   - Squad pricing toggle: "With your squad: ₹400/mo each"
   - "Start 7-day free trial" CTA for AI tier
   - Razorpay integration via `react-native-razorpay` or WebView fallback

2. **Tier state management**
   - Extend `authSlice.ts`: add `tier` field to UserProfile
   - On sign-in: read `user_metadata.tier` from Supabase session
   - `useAIGate()` hook: checks tier, returns `{ canUseAI, showPaywall }`

3. **Tier enforcement**
   - Every AI entry point wrapped with `useAIGate()`
   - Non-AI-tier user tapping "Ask VaNi" → smooth redirect to paywall
   - Wrong-answer analysis shows teaser ("Upgrade to see why you got this wrong") with blurred content
   - Study plan shows sample plan with "Unlock with VaNi AI" overlay

4. **Supabase Edge Function**: `supabase/functions/payment-webhook/index.ts`
   - Receives Razorpay payment confirmation
   - Validates signature
   - Updates user metadata: `supabase.auth.admin.updateUserById(userId, { user_metadata: { tier: 'ai' } })`

5. **Trial management**
   - 7-day free trial tracked in `aiSlice.trialStartDate`
   - After 7 days: AI features locked, paywall shown
   - Trial status persisted in AsyncStorage + user_metadata

### Files

| Action | File |
|--------|------|
| Create | `app/paywall.tsx` |
| Create | `src/hooks/useAIGate.ts` |
| Create | `supabase/functions/payment-webhook/index.ts` |
| Modify | `src/types/index.ts` — add `Tier` type, extend `UserProfile` |
| Modify | `src/store/slices/authSlice.ts` — tier field, trial tracking |
| Modify | `src/store/slices/aiSlice.ts` — trialStartDate, trialExpired |
| Modify | `app/(tabs)/ask-vani.tsx` — gate with useAIGate |
| Modify | `app/(tabs)/study-plan.tsx` — gate with useAIGate |
| Modify | `app/(exam)/quick-question.tsx` — wrong-answer teaser for non-AI |
| Modify | `app/(exam)/practice-results.tsx` — mock analysis teaser for non-AI |
| Modify | `app/_layout.tsx` — register paywall screen |

### How It Works Without DB

- Tier truth stored in **Supabase Auth user_metadata** (already have Supabase Auth)
- No separate DB table needed — `user_metadata` is a JSON field on the auth user
- Payment webhook uses Supabase Admin API to update metadata
- Client reads tier from Supabase session JWT on every app launch
- Offline: Redux `tier` value from last sync used (cached in AsyncStorage)

---

## Release Dependencies

```
R7 (Stage + QuestionV2)
 │
 ├──► R8 (Question Type UIs)     ← needs QuestionV2 types + stage gating
 │
 └──► R9 (Doubt Solver)          ← needs aiSlice, can start parallel with R8
       │
       ├──► R10 (Wrong-Answer + Concepts) ← needs Edge Function pattern from R9
       │
       └──► R11 (Study Plan + Mock)       ← needs performanceCollector + aiSlice
              │
              └──► R12 (Paywall)          ← needs all AI features built to gate them
```

R8 and R9 can run **in parallel** after R7 is done.
R10 and R11 can run **in parallel** after R9 is done.
R12 is the final gate — only after all AI features exist.

---

## Supabase Edge Functions Summary

All AI features go through Edge Functions (keeps API key server-side):

| Function | Model | Frequency | Cost/Call |
|----------|-------|-----------|-----------|
| `ai-doubt-solver` | Haiku (80%) / Sonnet (20%) | 20-50/user/day | ₹0.05-0.80 |
| `ai-wrong-answer` | Haiku | 5-10/user/day (cache misses only) | ₹0.05 |
| `ai-concept-explain` | Sonnet | 3-5/user/day (cache misses only) | ₹0.80 |
| `ai-study-plan` | Sonnet | 1/user/week | ₹1.10 |
| `ai-mock-analysis` | Sonnet | 2-4/user/month | ₹1.60 |
| `payment-webhook` | N/A | On payment | ₹0 |

**Total Edge Functions**: 6 (5 AI + 1 payment)

Supabase Edge Functions are free for up to 500K invocations/month on Pro plan (₹2,000/mo).
At 1,000 AI-tier users averaging 30 AI calls/day = 900K calls/month — just above free tier.
Cost at that scale: ~₹500/month for Edge Function compute. Negligible.

---

## Data That Lives Where

| Data | Storage | Backup |
|------|---------|--------|
| User profile + tier | Supabase Auth user_metadata | Supabase handles it |
| Stage, accuracy, streaks | Redux → AsyncStorage | Device-only (acceptable for POC) |
| Doubt history (last 20) | Redux → AsyncStorage | Device-only |
| Study plan | Redux → AsyncStorage | Device-only |
| Mock analyses | Redux → AsyncStorage | Device-only |
| Daily AI usage counts | Redux → AsyncStorage | Device-only |
| Pre-generated explanations | Bundled JSON in app | In git repo |
| Pre-generated concepts | Bundled JSON in app | In git repo |
| Questions (all types) | Bundled JSON in app | In git repo |
| Squad data | Redux → AsyncStorage | Device-only |

**POC trade-off**: If student switches devices, they lose local history. Acceptable
for POC. Post-POC: sync critical data (stage, history) to Supabase tables.

---

## Migration Path (Post-POC)

When ready to add a proper DB:

1. **Supabase Postgres tables**: users, questions, sessions, ai_responses, subscriptions
2. **Move pre-generated content**: from bundled JSON → Supabase Storage (downloadable content packs per subject)
3. **Add Redis (Upstash)**: for semantic cache layer between device and Claude API
4. **Sync engine**: on app launch, sync local AsyncStorage state to server (conflict resolution: server wins for tier/subscription, device wins for in-progress sessions)
5. **Usage analytics**: Edge Functions log to Postgres instead of just console

None of the R7-R12 code needs to be thrown away — it gains a sync layer on top.
