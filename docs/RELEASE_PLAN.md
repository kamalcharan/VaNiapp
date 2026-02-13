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
| Exam | 3 modes — Chapter, Practice (200Q NEET format), Quick (20Q) — all 8 question types (diagram-based uses text descriptions; image support on hold for future review) |
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
R10 ── Wrong-Answer Analysis + Concept Explainer  🔧 IN PROGRESS
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

3. **32 sample V2 questions** in `src/data/questions/` (4 per type; diagram-based uses text descriptions + placeholder imageUri — image rendering on hold)

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

- `practice-results.tsx` analytics tab (difficulty + chapter breakdown) is nulled out — needs question metadata stored in session *(R10.5 pending)*
- Answer review screen not yet wired to DB *(R10.6 pending — currently uses local JSON data)*
- ~~"Ask VaNi" entry points on exam screens not fully integrated~~ ✅ Fixed (Batch 1-2: misconception + concept tags wired into AskVaniSheet across all 3 exam screens)
- **Diagram-based images on hold**: `DiagramBasedQuestion.tsx` shows placeholder only (no `<Image>` rendering). Gemini generates text descriptions of diagrams. Actual image generation/hosting deferred for future review — text-description approach sufficient for NEET prep.

---

## QBank — Question Bank Completion (prerequisite for R10+)

**See [QBANK_PLAN.md](./QBANK_PLAN.md) for full 3-iteration plan.**

QBank must run **in parallel** with R10-R12 development. Every feature below
depends on having enough questions with elimination hints + concept tags in the DB.

| Iteration | Scope | Target |
|-----------|-------|--------|
| 1 | NEET Physics + Chemistry (40 chapters) | 4,000 Qs, MCQ-heavy |
| 2 | All NEET (72 chapters) + all 8 types + Telugu | 14,400 Qs |
| 3 | CUET (100+ chapters) + polish to 600/chapter | 50,000+ Qs |

**UX gate**: After QBank Iteration 1, open any Physics/Chemistry chapter in the
app and verify questions load — no more empty states.

---

## R10 — Learn From Mistakes 🔧 IN PROGRESS

**Goal**: Turn every wrong answer into a learning moment. Show *why* the student
was wrong, let them explore concepts, retry their mistakes, and review saved questions.

> **Depends on**: QBank Iteration 1 (elimination hints + concept tags populated)
>
> **Progress**: Batches 1-3 complete (data layer, AskVani integration, exam screen wiring, Saved Questions + Mistakes screens, dashboard cards). Remaining: analytics restoration (10.5), answer-review DB wiring (10.6).

### What the Student Sees (UX Verification)

#### 10.1 "Why Was I Wrong?" Card
**Where**: After answering wrong in Chapter Exam or Quick Practice
**What happens**:
1. Student taps wrong option → answer feedback shows as usual
2. Below the explanation, a new **"Why was I wrong?"** expandable card appears
3. Card shows: the misconception text for the specific wrong option they chose
4. If Telugu mode → shows misconception in Telugu
5. Concept tags shown as tappable pills below the card

**How to verify**:
- [x] Answer a question wrong → see "Why was I wrong?" card *(WrongAnswerCard + AskVaniSheet misconception box)*
- [x] Card text matches the specific wrong option (not generic) *(eliminationHints per-option matching)*
- [x] Toggle Telugu → card shows Telugu misconception text *(hintTe/misconceptionTe wired)*
- [ ] If no elimination hint exists for that option → card says "Ask VaNi for help" with button

#### 10.2 Concept Explainer
**Where**: Tap any concept tag pill (on wrong-answer card or answer review screen)
**What happens**:
1. Bottom sheet slides up with concept title
2. Loading spinner while AI generates explanation (~3 seconds first time)
3. Shows: explanation, analogy, exam relevance, common mistakes
4. Second tap on same concept → instant (cached in aiSlice)

**How to verify**:
- [x] Tap concept tag → bottom sheet opens *(ConceptExplainerSheet already built + wired via onConceptPress)*
- [x] First time → loading spinner, then content appears *(3-tier lookup: bundled → cache → OpenAI)*
- [x] Close and tap same tag → instant load (cached) *(aiSlice.cachedConcepts)*
- [x] Content is relevant to the specific concept

#### 10.3 Practice My Mistakes
**Where**: Dashboard card "Practice My Mistakes" or button on results screens
**What happens**:
1. Student taps "Practice My Mistakes"
2. App collects all wrongly-answered question IDs from recent sessions
3. Fetches those questions from DB → starts a retry session
4. Only questions they got wrong appear
5. After completing → shows improvement score ("You fixed 7 out of 10!")

**How to verify**:
- [x] Complete a chapter exam, get some wrong *(recordMistake dispatched on wrong answer)*
- [x] Go to dashboard → "Practice My Mistakes" card shows count *(live mistakeCount from Redux)*
- [x] Tap → opens Mistakes tab showing previously-wrong questions *(saved-questions.tsx?tab=mistakes)*
- [ ] Complete → see improvement summary *(not yet built — re-practice mode pending)*

#### 10.4 Saved Questions Screen
**Where**: Dashboard card "Saved Questions" (already shows bookmark count)
**What happens**:
1. Tap → opens full-screen list of all bookmarked questions
2. Grouped by subject, then chapter
3. Each question shows: stem preview, type badge, difficulty badge
4. Tap a question → expands to show full question + explanation
5. Swipe or tap "Remove" to unbookmark

**How to verify**:
- [x] Bookmark 3+ questions during exams *(toggleBookmark already works)*
- [x] Dashboard shows "Saved Questions (3)" *(live savedCount from Redux)*
- [x] Tap → see all 3 questions listed *(saved-questions.tsx Saved tab)*
- [x] Tap one → full question + explanation visible *(expandable cards with explanation + concept tags)*
- [x] Remove one → count updates to 2 *(removeBookmark dispatched, list reactively updates)*

#### 10.5 Practice Results Analytics (restored)
**Where**: Analytics tab on practice-results screen (currently shows empty)
**What happens**:
1. Complete a Practice Exam (200Q)
2. Go to results → tap "Analytics" tab
3. See: difficulty breakdown (easy/medium/hard accuracy bars)
4. See: chapter performance (sorted weakest to strongest)
5. See: weakest and strongest chapter highlighted

**How to verify**:
- [ ] Complete practice exam → Analytics tab shows data (not blank)
- [ ] Difficulty bars match actual performance
- [ ] Chapter list sorted by accuracy (weakest first)
- [ ] Weakest/strongest sticky notes show correct chapters

#### 10.6 Answer Review Wired to DB
**Where**: "Review Answers" button on any results screen
**What happens**:
1. Tap "Review Answers" → opens answer review screen
2. Questions load from DB (not local data)
3. Filter tabs work: All / Correct / Wrong / Skipped
4. Each question shows: what student picked, correct answer, explanation
5. Concept tags visible, tappable → opens Concept Explainer

**How to verify**:
- [ ] Complete exam → tap "Review Answers" → questions load
- [ ] Filter tabs filter correctly
- [ ] Explanations display properly
- [ ] Concept tags open the explainer bottom sheet

### Files

| Action | File | Status |
|--------|------|--------|
| Create | `src/components/exam/WrongAnswerCard.tsx` — misconception card using elimination hints | ✅ Done (R9) |
| Create | `src/components/exam/ConceptExplainerSheet.tsx` — bottom sheet with AI concept explanation | ✅ Done (R9) |
| Create | `app/(main)/saved-questions.tsx` — Saved + Mistakes two-tab screen | ✅ Done (Batch 3) |
| Create | `supabase/functions/ai-concept-explain/index.ts` — Edge Function for concept explainer | ⬜ Pending |
| Modify | `src/types/index.ts` — EliminationHint type + eliminationHints/conceptTags on QuestionV2 | ✅ Done (Batch 1) |
| Modify | `src/lib/questionService.ts` — per-option hints, conceptTags, `fetchQuestionsByIds()` | ✅ Done (Batch 1) |
| Modify | `src/components/AskVaniSheet.tsx` — misconception card + concept tag pills in VaNi widget | ✅ Done (Batch 1) |
| Modify | `app/(exam)/chapter-question.tsx` — wire AskVani R10 props + recordMistake dispatch | ✅ Done (Batch 2+3) |
| Modify | `app/(exam)/quick-question.tsx` — wire AskVani R10 props + recordMistake dispatch | ✅ Done (Batch 2+3) |
| Modify | `app/(exam)/answer-review.tsx` — wire AskVani R10 props | ✅ Done (Batch 2) |
| Modify | `app/(main)/index.tsx` — Saved Questions + Practice My Mistakes dashboard cards | ✅ Done (Batch 3) |
| Modify | `src/store/slices/practiceSlice.ts` — mistakeIds tracking + recordMistake/removeMistake | ✅ Done (Batch 3) |
| Modify | `app/(exam)/practice-results.tsx` — restore analytics with session metadata | ⬜ Pending (10.5) |
| Modify | `app/(exam)/answer-review.tsx` — wire to DB (currently uses local data) | ⬜ Pending (10.6) |

---

## R11 — VaNi Coach + Smart Planning ⬜ PENDING

**Goal**: VaNi becomes a coach, not just a Q&A bot. She greets you, encourages you,
tells you what to study, and analyzes your mock exams.

> **Depends on**: R10 (performance data infrastructure) + QBank Iteration 2 (enough data for meaningful analytics)

### What the Student Sees (UX Verification)

#### 11.1 VaNi Coaching Messages
**Where**: Key moments throughout the app
**What happens**:
1. **Session start**: Dashboard shows VaNi greeting card
   - First visit: "Welcome to {chapter}! Let's start with the basics."
   - Returning: "Welcome back! You were working on {chapter}. Ready to continue?"
   - After break: "I missed you! It's been {N} days. Let's ease back in."
2. **After wrong answer**: Below explanation, VaNi says context-aware message
   - "This trips up a lot of students. The key thing to remember is..."
   - "Not quite — but now you know. This concept will show up in the exam."
3. **After streak**: Celebration overlay
   - 3 correct: "You're getting the hang of this!"
   - 5 correct: "5 in a row! You're on fire!"
   - 10 correct: "10 streak! You're absolutely nailing this chapter!"
4. **Session end**: Summary card with VaNi message
   - Good: "Great session! {N} questions, {acc}% accuracy. See you tomorrow!"
   - Tough: "Tough one today, but that's how we grow."

**How to verify**:
- [ ] Open app after 2+ days → see "missed you" greeting on dashboard
- [ ] Start a chapter exam → see VaNi welcome message
- [ ] Get 5 correct in a row → see streak celebration
- [ ] Answer wrong → see VaNi encouragement below explanation
- [ ] Finish session → see VaNi summary card

#### 11.2 Dashboard Recommendation
**Where**: Dashboard, below greeting
**What happens**:
1. VaNi card shows: "Today's recommendation" with specific action
2. Based on: weak chapters, days since last practice, streak status
3. Tappable → navigates to recommended chapter/mode
4. Examples:
   - "You haven't practiced Thermodynamics in 5 days. Let's do a quick 20!"
   - "Your Chemical Bonding accuracy is 42%. Focus here today."
   - "You're on a 3-day streak! Keep it going with some Zoology."

**How to verify**:
- [ ] Dashboard shows a recommendation card with specific chapter/subject
- [ ] Tap the card → navigates to that chapter/mode
- [ ] Recommendation changes based on activity (not always the same)

#### 11.3 Weak Topic Detection
**Where**: Dashboard "Focus Areas" section + Profile screen
**What happens**:
1. Dashboard shows top 3 weak topics with accuracy % and trend arrow
2. Profile shows full weak topic list per subject
3. Each topic is tappable → goes to chapter exam for that topic
4. Topics auto-update after each session

**How to verify**:
- [ ] Complete exams with low accuracy in specific chapters
- [ ] Dashboard "Focus Areas" shows those chapters as weak
- [ ] Accuracy % and trend arrows visible
- [ ] Tap a weak topic → navigates to chapter exam

#### 11.4 Weekly Study Plan
**Where**: New screen accessible from dashboard or profile
**What happens**:
1. Student taps "My Study Plan" → study plan screen opens
2. If first time: "Complete 5 chapter tests to unlock your AI study plan"
3. After qualifying: tap "Generate Plan" → loading (3-5 sec) → 7-day plan appears
4. Each day: JournalCard with subject, chapters, target question count
5. Today's card highlighted
6. Student taps checkmarks as they complete daily goals
7. "Refresh Plan" button (max 2 refreshes per day)

**How to verify**:
- [ ] New user → sees "complete 5 tests" requirement
- [ ] After 5+ tests → "Generate Plan" button active
- [ ] Tap → loading spinner → 7-day plan appears
- [ ] Today highlighted, other days dimmed
- [ ] Tap checkmark → goal marked complete
- [ ] Tap "Refresh Plan" → new plan generates

#### 11.5 Post-Mock AI Analysis
**Where**: Practice Results screen, after completing 200Q practice exam
**What happens**:
1. Complete practice exam → results screen shows summary as usual
2. New section: "VaNi's Analysis" with loading spinner (3-5 sec)
3. Shows: verdict per subject (strong/improving/needs-work/critical)
4. Time management insight ("You spent too long on Physics Section B")
5. Trend vs previous mocks ("Score improved +45 from last attempt")
6. Top 3 priority actions ("Focus on Organic Chemistry mechanisms")

**How to verify**:
- [ ] Complete practice exam → see "VaNi's Analysis" section loading
- [ ] Analysis appears with subject-by-subject verdict
- [ ] Time insight mentions specific subjects
- [ ] If 2+ mocks done → trend comparison shows
- [ ] Priority actions are specific and actionable

### Files

| Action | File |
|--------|------|
| Create | `src/lib/vaniCoach.ts` — message generation logic (templates + AI hybrid) |
| Create | `src/lib/performanceCollector.ts` — aggregate performance data from Redux |
| Create | `src/components/VaNiMessageCard.tsx` — coaching message UI component |
| Create | `app/(main)/study-plan.tsx` — weekly study plan screen |
| Create | `supabase/functions/ai-study-plan/index.ts` |
| Create | `supabase/functions/ai-mock-analysis/index.ts` |
| Modify | `app/(main)/index.tsx` — VaNi greeting, recommendation card, weak topics |
| Modify | `app/(main)/profile.tsx` — full weak topic list, study plan link |
| Modify | `app/(exam)/chapter-question.tsx` — VaNi messages on wrong/streak |
| Modify | `app/(exam)/quick-question.tsx` — VaNi messages on wrong/streak |
| Modify | `app/(exam)/practice-results.tsx` — AI mock analysis section |
| Modify | `src/store/slices/aiSlice.ts` — currentPlan, mockAnalyses, coachingMessages |

### Cost Impact

- VaNi coaching messages: mostly **templates (₹0)**, occasional AI-generated (₹0.05 Haiku)
- Study plan: 1 Sonnet call/week = **~₹4-5/month** per user
- Mock analysis: 2-4 Sonnet calls/month = **~₹5-10/month** per user

---

## R12 — Adaptive Intelligence + Paywall ⬜ PENDING

**Goal**: Questions adapt to student level in real-time. Exam readiness prediction.
Gate all AI features behind paid tier with free trial.

> **Depends on**: R11 (all AI features built to gate) + QBank Iteration 2 (enough Qs for difficulty variety)

### What the Student Sees (UX Verification)

#### 12.1 Adaptive Difficulty
**Where**: Chapter Exam and Quick Practice modes
**What happens**:
1. Student starts chapter exam → first 3 questions are calibrated to their strength level
2. If getting 85%+ correct → next questions shift to harder difficulty
3. If getting < 50% correct → next questions shift to easier
4. Difficulty badge on each question shows the adaptation happening
5. End of session summary shows: "Difficulty adapted 3 times during this session"

**How to verify**:
- [ ] Start chapter exam as new student → mostly easy questions
- [ ] Answer 5 easy correct → see medium questions appearing
- [ ] Answer 5 medium correct → see hard questions
- [ ] Struggle with hard → see it dial back to medium
- [ ] Results show "Difficulty adapted" note

#### 12.2 Exam Readiness Score
**Where**: Profile screen + Dashboard widget
**What happens**:
1. Profile shows: "NEET Readiness: 67%" with breakdown per subject
2. Dashboard widget: circular progress showing overall readiness
3. Breakdown: subject scores, coverage gaps (chapters not practiced), predicted NEET score range
4. Updates after each session
5. If exam date set → shows "Estimated days to 80% ready"

**How to verify**:
- [ ] Profile shows readiness percentage with per-subject bars
- [ ] Dashboard widget shows circular readiness indicator
- [ ] Complete more exams → readiness % increases
- [ ] Coverage gaps list chapters never practiced
- [ ] Set exam date → see estimated preparation timeline

#### 12.3 Risk Alerts
**Where**: Dashboard notification card
**What happens**:
1. If inactive 3+ days → "VaNi misses you! Your streak is at risk."
2. If accuracy declining → "Your {subject} accuracy dropped 15% this week. Let's fix that."
3. If stuck on chapter → "You've attempted {chapter} 5 times below 40%. Try reviewing the concepts first."
4. Each alert has a CTA button → navigates to relevant action

**How to verify**:
- [ ] Don't use app for 3 days → see inactivity alert on dashboard
- [ ] Perform poorly in a subject → see declining accuracy alert
- [ ] Attempt same chapter repeatedly with low scores → see "stuck" alert

#### 12.4 Paywall Screen
**Where**: Triggered when free user taps any AI feature
**What happens**:
1. Free user taps "Ask VaNi" or "Generate Study Plan" → paywall screen appears
2. Two cards side-by-side: VaNi Pro (₹299/mo) vs VaNi AI (₹499/mo)
3. Feature checklist showing what each tier unlocks
4. Squad pricing toggle: "With your squad: ₹400/mo each"
5. "Start 7-day free trial" CTA → starts trial immediately
6. During trial → full AI access with "Trial: 5 days left" banner

**How to verify**:
- [ ] Free user taps "Ask VaNi" → paywall screen shown (not crash)
- [ ] Two tier cards with pricing visible
- [ ] Feature checklist accurately shows locked/unlocked features
- [ ] "Start free trial" → trial activates, AI features unlock
- [ ] Banner shows remaining trial days
- [ ] After 7 days → AI features lock again, paywall returns

#### 12.5 Tier Enforcement Across App
**Where**: Every AI touchpoint
**What happens**:
1. Free tier: Wrong-answer card shows blurred teaser + "Upgrade to unlock"
2. Free tier: Concept explainer shows first 2 lines + blur + upgrade CTA
3. Free tier: Study plan shows sample plan with overlay + upgrade CTA
4. Free tier: Mock analysis shows "VaNi AI members get detailed analysis"
5. Pro tier: Access to doubt solver (limited), no study plan/mock analysis
6. AI tier: Full access to everything

**How to verify**:
- [ ] As free user → AI features show teasers, not full content
- [ ] As trial user → everything works
- [ ] Trial expires → features re-lock with paywall
- [ ] Upgrade to AI tier → all features unlock permanently

### Files

| Action | File |
|--------|------|
| Create | `src/lib/adaptiveDifficulty.ts` — real-time difficulty calibration |
| Create | `src/lib/readinessCalculator.ts` — exam readiness prediction |
| Create | `src/lib/riskDetector.ts` — pattern detection for risk alerts |
| Create | `app/paywall.tsx` — tier comparison + payment screen |
| Create | `src/hooks/useAIGate.ts` — tier check hook |
| Create | `supabase/functions/payment-webhook/index.ts` — Razorpay webhook |
| Modify | `app/(main)/index.tsx` — readiness widget, risk alerts |
| Modify | `app/(main)/profile.tsx` — readiness breakdown, exam date setting |
| Modify | `app/(exam)/chapter-question.tsx` — adaptive difficulty selection |
| Modify | `app/(exam)/quick-question.tsx` — adaptive difficulty selection |
| Modify | `src/store/slices/authSlice.ts` — tier field, trial tracking |
| Modify | `src/store/slices/aiSlice.ts` — trialStartDate, trialExpired |
| Modify | `src/lib/questionService.ts` — difficulty-aware question fetching |
| Modify | All AI entry points — wrap with `useAIGate()` |

### Cost Impact

- Adaptive difficulty: **₹0** (local calculation, no API calls)
- Readiness prediction: **₹0** (local calculation from practice history)
- Risk detection: **₹0** (local pattern matching)
- Razorpay integration: standard payment gateway fees

---

## Release Dependencies (Updated)

```
QBank Iter 1 ─────────────────────── Questions in DB for Physics + Chemistry
 │
 ├──► R10 (Learn from Mistakes)      Can start after QBank Iter 1
 │     │
QBank Iter 2 ─────────────────────── All NEET chapters populated
 │     │
 │     ├──► R11 (VaNi Coach + Plan)  Needs enough data for meaningful coaching
 │     │
QBank Iter 3 ─────────────────────── CUET + 600/chapter targets
 │     │
 │     └──► R12 (Intelligence + Pay) Needs all AI features to gate them
 │
 └──► CUET support live
```

**Key rule**: QBank runs continuously alongside R10-R12. Each QBank iteration
unlocks the next release's full potential.

---

## Supabase Edge Functions Summary

| Function | Model | Frequency | Cost/Call | Release |
|----------|-------|-----------|-----------|---------|
| `ai-doubt-solver` | Haiku/Sonnet | 20-50/user/day | ₹0.05-0.80 | R9 ✅ |
| `ai-concept-explain` | Sonnet | 3-5/user/day | ₹0.80 | R10 |
| `ai-study-plan` | Sonnet | 1/user/week | ₹1.10 | R11 |
| `ai-mock-analysis` | Sonnet | 2-4/user/month | ₹1.60 | R11 |
| `payment-webhook` | N/A | On payment | ₹0 | R12 |

**Total**: 5 Edge Functions (4 AI + 1 payment)

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
| Wrong answer IDs (R10) | Redux → AsyncStorage | Device-only |
| Concept cache (R10) | Redux → AsyncStorage | Device-only |
| Study plan (R11) | Redux → AsyncStorage | Device-only |
| Mock analyses (R11) | Redux → AsyncStorage | Device-only |
| VaNi coaching messages (R11) | Templates + aiSlice | Device-only |
| Daily AI usage counts | Redux → AsyncStorage | Device-only |
| Squad data | Redux → AsyncStorage | Device-only |
| Legacy local JSON questions | `src/data/questions/` (unused) | In git repo |

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
