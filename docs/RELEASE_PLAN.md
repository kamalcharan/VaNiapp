# VaNi Release Plan — AI Features

> Stack: Expo 54, Redux Toolkit, AsyncStorage, Supabase (Auth + Postgres + Edge Functions).
> Questions now served from Supabase DB (`med_questions`, `med_question_options`, `med_elimination_hints`).
> AI features use Supabase Edge Functions for Claude API proxying.

---

## Current State (R1–R9 complete + DB migration)

| Layer | What Exists |
|-------|------------|
| State | Redux: auth, practice, music, focus, squad, ai, strength, bookmark — persisted via AsyncStorage |
| Data | **Supabase DB**: `med_questions`, `med_question_options`, `med_elimination_hints` tables. Local JSON files still exist but no longer used by exam screens. |
| Auth | Supabase Auth (email/OTP) |
| UI | Journal aesthetic, StickyNote, JournalCard, ConfettiBurst, StreakBadge, Toast, HandwrittenText, PuffyButton |
| Exam | 3 modes — Chapter, Practice (200Q NEET format), Quick (20Q) — all 8 question types |
| Question model | `QuestionV2` type with discriminated union payload (8 types). Legacy `Question` type still exists but unused. |
| Routing | expo-router v6 with groups: `(auth)`, `(main)`, `setup/`, `subject/`, `(exam)` |
| AI | AI Doubt Solver via Supabase Edge Function (Claude Haiku/Sonnet), aiSlice with history + rate limiting |
| Bookmarks | Bookmark system with Redux slice, works across all exam modes |
| Strength | Chapter strength tracker with 4 levels (just-started, getting-there, on-track, strong) |

---

## Release Map

```
R7 ─── Stage System + QuestionV2 Types           ✅ DONE
 │
R8 ─── New Question Type UIs                     ✅ DONE
 │
R9 ─── AI Doubt Solver + Bookmarks + DB Wire     ✅ DONE
 │
R10 ── Wrong-Answer Analysis + Concept Explainer  ⬜ NEXT
 │
R11 ── AI Study Plan + Mock Analysis              ⬜ PENDING
 │
R12 ── Paywall + Tier Gating                      ⬜ PENDING
```

---

## R7 — Stage Progression + QuestionV2 Type System ✅ DONE

**Status**: Complete. Implemented as `strengthSlice` instead of `stageSlice`.

### What Was Built

1. **Strength system in Redux** (`src/store/slices/strengthSlice.ts`)
   - Chapter-level strength tracking with 4 levels: just-started → getting-there → on-track → strong
   - Strength-based question type gating (unlocks harder types as student improves)
   - Persisted via AsyncStorage

2. **QuestionV2 type system** (`src/types/index.ts`)
   - `QuestionV2` with discriminated union `QuestionPayload` for 8 types
   - `QuestionType`: mcq, assertion-reasoning, match-the-following, true-false, diagram-based, logical-sequence, fill-in-blanks, scenario-based
   - `getCorrectId(q)` helper extracts correct answer from any payload type

3. **Question adapter** (`src/lib/questionAdapter.ts`)
   - `legacyToV2()`, `legacyBatchToV2()` converters (no longer needed after DB migration)
   - `getCorrectId()` still used for scoring

4. **Strength badges on dashboard + profile**

---

## R8 — New Question Type UIs ✅ DONE

**Status**: Complete. All 8 question type components built with QuestionRenderer.

### What Was Built

1. **QuestionRenderer** (`src/components/exam/QuestionRenderer.tsx`)
   - Switch component that renders correct UI by `QuestionV2.type`

2. **8 question type components** (all in `src/components/exam/`)
   - `McqQuestion.tsx`, `TrueFalseQuestion.tsx`, `AssertionReasoningQuestion.tsx`
   - `MatchQuestion.tsx`, `FillBlanksQuestion.tsx`, `DiagramQuestion.tsx`
   - `SequenceQuestion.tsx`, `ScenarioQuestion.tsx`

3. **32 sample V2 questions** in `src/data/questions/` (4 per type)

4. **Wired into exam flows** — chapter-question, quick-question use QuestionRenderer

---

## R9 — AI Doubt Solver + Bookmarks + DB Migration ✅ DONE

**Status**: Complete. AI doubt solver, bookmark system, and full DB migration done.

### What Was Built

1. **AI Doubt Solver**
   - `src/store/slices/aiSlice.ts` — Redux slice with doubt history, daily usage, rate limiting
   - `src/lib/aiClient.ts` — client-side cache check → Edge Function call → store response
   - Supabase Edge Function for Claude API proxying (Haiku/Sonnet)
   - Client-side caching via doubtHistory in aiSlice

2. **Bookmark System**
   - `src/store/slices/bookmarkSlice.ts` — toggle bookmark, list bookmarked questions
   - Works across all exam modes (chapter, quick, practice)

3. **DB Migration — All Exam Screens Wired to Supabase** (done mid-R9)
   - `src/lib/questionService.ts` — fetches from `med_questions` + `med_question_options` + `med_elimination_hints`
   - `fetchChapterQuestions()` — chapter exam mode
   - `fetchQuickPracticeQuestions()` — quick practice mode
   - `fetchPracticeExamQuestions()` — full NEET practice exam (200Q, 4 subjects)
   - All screens have loading spinners + empty states
   - `hydrateQuestions()` shared helper: fetch options + hints → convert to QuestionV2
   - `dbToQuestionV2()` + `buildPayload()` — converts DB rows to QuestionV2 with all 8 type payloads

4. **Exam screens updated**:
   - `app/(exam)/chapter-question.tsx` — uses `fetchChapterQuestions()` from DB
   - `app/(exam)/quick-question.tsx` — uses `fetchQuickPracticeQuestions()` from DB
   - `app/(exam)/practice-question.tsx` — uses `fetchPracticeExamQuestions()` from DB
   - `app/(exam)/chapter-results.tsx` — uses route params (chapterName, subjectId)
   - `app/(exam)/practice-results.tsx` — uses route params + Redux subjectScores

### Known Gaps from R9

- `practice-results.tsx` analytics tab (difficulty + chapter breakdown) is nulled out — needs question metadata stored in session
- Answer review screen not yet wired to DB
- "Ask VaNi" entry points on exam screens not fully integrated

---

## R10 — Wrong-Answer Analysis + Concept Explainer ⬜ NEXT

**Goal**: After getting a question wrong, show AI-powered analysis of the
misconception. Plus, tap any concept tag to get a deep explanation.

### Architecture (DB-backed)

**Wrong-Answer Analysis** — uses `med_elimination_hints` already in DB:

```
Student answers wrong
    │
    ├─ Look up hint from med_elimination_hints (already fetched with question)
    │   → Each wrong option has: hint_text, misconception, hint_text_te, misconception_te
    │
    ├─ HIT ──► Show DB-stored analysis (zero API cost)
    │
    └─ MISS ─► Call Supabase Edge Function (Haiku) ─► Cache response in aiSlice
```

**Concept Explainer** — keyed by `concept_tags` on `med_questions`:

```
Student taps concept tag
    │
    ├─ Check local concept cache (aiSlice)
    │
    ├─ HIT ──► Show cached explanation
    │
    └─ MISS ─► Call Supabase Edge Function (Sonnet) ─► Cache locally
```

### What Gets Built

1. **Wrong-Answer UI** — after wrong answer in any exam mode:
   - Show expandable "Why was I wrong?" card using elimination hints from DB
   - Card shows: misconception, hint text (bilingual)
   - Concept tag is tappable → opens concept explainer bottom sheet

2. **Concept Explainer Bottom Sheet**
   - `src/components/ConceptExplainerSheet.tsx`
   - Shows: title, explanation (markdown), analogy, exam relevance, common mistakes
   - First call: Edge Function (Sonnet) → response cached in aiSlice

3. **Edge Functions for concept explainer**
   - `supabase/functions/ai-concept-explain/index.ts`
   - No `ai-wrong-answer` Edge Function needed (hints already in DB)

4. **Practice results analytics re-enablement**
   - Store question metadata (difficulty, chapterId, subjectId) in practice session
   - Re-enable difficulty breakdown + chapter performance in `practice-results.tsx`

5. **"Practice My Mistakes" mode**
   - Wire wrong answer tracking → allow retry of missed questions

### Files

| Action | File |
|--------|------|
| Create | `src/components/ConceptExplainerSheet.tsx` |
| Create | `supabase/functions/ai-concept-explain/index.ts` |
| Modify | `app/(exam)/chapter-question.tsx` — wrong-answer card in post-answer feedback |
| Modify | `app/(exam)/quick-question.tsx` — wrong-answer card in post-answer feedback |
| Modify | `app/(exam)/practice-results.tsx` — re-enable analytics with stored metadata |
| Modify | `app/(exam)/answer-review.tsx` — concept tags + explainer sheet |
| Modify | `src/store/slices/aiSlice.ts` — concept cache, wrong-answer usage tracking |
| Modify | `src/store/slices/practiceSlice.ts` — store question metadata in session |

### Cost Impact

- Wrong-answer analysis: **₹0** (uses DB elimination hints, already fetched)
- Concept explainer: ~₹0.80/call for Sonnet, cached after first call
- Net impact: **₹5-15/month** per user (mostly concept explainer cache misses)

---

## R11 — AI Study Plan + Mock Analysis ⬜ PENDING

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

## R12 — Paywall + Tier Gating ⬜ PENDING

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
R7 (Strength + QuestionV2)       ✅ DONE
 │
 ├──► R8 (Question Type UIs)     ✅ DONE
 │
 └──► R9 (AI + Bookmarks + DB)   ✅ DONE
       │
       ├──► R10 (Wrong-Answer + Concepts) ← NEXT: needs elimination hints UI + concept explainer
       │
       └──► R11 (Study Plan + Mock)       ← needs performanceCollector + aiSlice
              │
              └──► R12 (Paywall)          ← needs all AI features built to gate them
```

R10 and R11 can run **in parallel**.
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
| Questions (all types) | **Supabase DB** (`med_questions` + `med_question_options` + `med_elimination_hints`) | Supabase handles it |
| Subject/chapter catalog | **Supabase DB** (`med_subjects`, `med_chapters`) | Supabase handles it |
| Strength levels | Redux → AsyncStorage | Device-only (acceptable for POC) |
| Bookmarks | Redux → AsyncStorage | Device-only |
| Doubt history (last 20) | Redux → AsyncStorage | Device-only |
| Practice history | Redux → AsyncStorage | Device-only |
| Study plan (R11) | Redux → AsyncStorage | Device-only |
| Mock analyses (R11) | Redux → AsyncStorage | Device-only |
| Daily AI usage counts | Redux → AsyncStorage | Device-only |
| Squad data | Redux → AsyncStorage | Device-only |
| Legacy local JSON questions | `src/data/questions/` (still in codebase but **unused by exam screens**) | In git repo |

**POC trade-off**: If student switches devices, they lose local history. Acceptable
for POC. Post-POC: sync critical data (strength, history, bookmarks) to Supabase tables.

---

## Migration Path (Post-POC)

DB is already in use for questions. Remaining post-POC work:

1. **Sync local state to server**: strength levels, bookmarks, practice history → Supabase tables (conflict resolution: server wins for tier/subscription, device wins for in-progress sessions)
2. **Add Redis (Upstash)**: for semantic cache layer between device and Claude API (concept explainer, doubt solver)
3. **Usage analytics**: Edge Functions log to Postgres instead of just console
4. **Remove legacy local data**: clean out `src/data/questions/`, `src/data/chapters.ts` once DB is fully validated

None of the R7-R12 code needs to be thrown away — it gains a sync layer on top.
