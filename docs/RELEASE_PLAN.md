# VaNi App — Release Plan & Progress Tracker

> **Last updated:** 2026-02-19
>
> **Stack:** Expo SDK 54, React Native 0.81.5, React 19.1.0, expo-router v6,
> Redux Toolkit + AsyncStorage, Supabase Auth + DB, Gemini AI

---

## RELEASE STATUS OVERVIEW

| Release | Name | Status |
|---------|------|--------|
| R1-R3 | Core App (Auth, Onboarding, Dashboard, Question Bank) | DONE |
| R4-R6 | Squad, AI Doubt Solver, Focus Mode, Dark Mode | DONE |
| R7 | Strength Tracker + QuestionV2 Types | DONE |
| R8 | 8 Question Type UIs + Adaptive Mix | DONE |
| R9 | Practice V2 + Bookmarks + Dashboard V2 | DONE |
| R10 | AI Doubt Solver (Gemini) + VaNi Sheet | IN PROGRESS |
| R11 | Wrong-Answer Analysis + Concept Explainer | NOT STARTED |
| R12 | AI Study Plan + Mock Analysis | NOT STARTED |
| R13 | Paywall + Tier Gating | NOT STARTED |

---

## COMPLETED RELEASES

### R1-R3 — Core App (pre-existing on main)
- [x] Supabase Auth (email/OTP)
- [x] Onboarding flow (welcome, sign-up, profile setup, subject picker)
- [x] Dashboard with greeting, streaks, quick actions
- [x] Subject/chapter/exam screens
- [x] Basic question bank (200 MCQ across 8 chapters, 4 subjects)
- [x] History screen
- [x] Profile screen

### R4-R6 — Social + AI + Focus
- [x] Squad system (up to 4 members, invite codes, pricing tiers)
- [x] AI doubt solver (initial OpenAI integration with caching, rate limiting 50/day)
- [x] Focus mode ambient music player (6 lo-fi tracks)
- [x] Focus tracker (app switch counting)
- [x] Edit profile, dark mode toggle
- [x] Toast notification system

### R7 — Strength Tracker + QuestionV2 Types
- [x] `QuestionV2` type system with all 8 question types (discriminated union payloads)
- [x] Bilingual support (text/textTe, explanation/explanationTe)
- [x] Strength levels: just-started → getting-there → on-track → strong (+ needs-focus)
- [x] `strengthEvaluator.ts` — evaluateStrength(), evaluateSubjectStrength()
- [x] `strengthSlice.ts` — Redux slice with recordChapterAttempt, no-demotion logic
- [x] `questionAdapter.ts` — legacyToV2(), legacyBatchToV2(), filterByUnlockedTypes()
- [x] `StrengthMap.tsx` — visual strength badges on dashboard
- [x] Elimination technique + Ask VaNi refactored to pill badges in question headers

### R8 — 8 Question Type UIs + Adaptive Mix
- [x] `QuestionRenderer.tsx` — central router to type-specific components
- [x] `McqQuestion.tsx` — standard 4-option MCQ
- [x] `TrueFalseQuestion.tsx` — binary True/False
- [x] `AssertionReasoningQuestion.tsx` — Assertion + Reason evaluation
- [x] `MatchTheFollowingQuestion.tsx` — Column A ↔ Column B
- [x] `FillInBlanksQuestion.tsx` — sentence blanks with options
- [x] `DiagramBasedQuestion.tsx` — image-based questions (placeholder rendering)
- [x] `LogicalSequenceQuestion.tsx` — ordering/sequence
- [x] `ScenarioBasedQuestion.tsx` — passage + MCQ
- [x] 32 sample V2 questions (Physics + Botany)
- [x] Strength-based type gating (progressive unlock)

### R9 — Practice V2 + Bookmarks + Dashboard V2
- [x] Practice exam V2: `practice-question.tsx` with QuestionV2 types
- [x] Bookmark system: Redux slice (`bookmarkSlice.ts`) with toggleBookmark
- [x] Bookmark UI: Save/Saved badge on all 3 question screens with haptic feedback
- [x] **Bookmarks viewer screen** (`app/(main)/bookmarks.tsx`) — fully working with footer tab
- [x] Dashboard: "Saved Questions" card, "Focus Areas" section (weak chapters)
- [x] Results V2: `chapter-results.tsx` with question type breakdown
- [x] `getV2QuestionsByIds(ids)` utility for bookmark/weak-topic lookups

### Database & Admin Tools — DONE
- [x] 8 Supabase migrations (1,814 lines)
- [x] Tables: `med_chapters`, `med_topics`, `med_questions`, `med_question_options`
- [x] Tables: `med_elimination_hints`, `med_generation_jobs`, `med_chapter_progress`
- [x] CUET support — 46 subjects added
- [x] RLS policies, triggers, indexes
- [x] Admin QBank tools: import.html, generate.html, insert.html, review.html, subject.html, translate.html
- [x] `shared.js` — centralized utilities, auth, Supabase client, Gemini integration
- [x] Multi-exam support (NEET + CUET toggle on dashboard)

### Bug Fixes & Polish — DONE
- [x] 18 TypeScript compilation errors fixed
- [x] Case-insensitive subject matching
- [x] 25+ UX improvements (pending counts, XSS prevention, navigation, mobile)
- [x] Undo/reset for reviewed questions
- [x] Bulk select in QBank

---

## IN PROGRESS

### R10 — AI Doubt Solver (Gemini Refactor)
- [x] `src/config/ai.ts` — Gemini API config (2.5-flash + 2.5-pro)
- [x] `src/lib/aiClient.ts` — Gemini generateContent API client
- [x] `src/store/slices/aiSlice.ts` — Redux slice for AI state, doubt cache, rate limiting
- [x] `src/components/AskVaniSheet.tsx` — bottom sheet UI for doubt solving
- [ ] Fix/test VaNi sheet integration on question screens
- [ ] Entry points: answer-review button, struggling CTA, dashboard card

### Question Content Creation — Zoology
Progress: **520 / 1,300 questions (40%)**

| Ch# | Chapter | Batches Done | Questions | Status |
|-----|---------|-------------|-----------|--------|
| 1 | Animal Kingdom | 8/8 | 160 | DONE |
| 2 | Structural Organisation | 5/5 | 100 | DONE |
| 3 | Biomolecules | 5/5 | 100 | DONE |
| 4 | Breathing & Gases | 4/4 | 80 | DONE |
| 5 | Body Fluids & Circulation | 4/5 | 80 | 80% |
| 6-15 | Remaining chapters | 0/38 | 0 | PENDING |

See `docs/ZOO_GENERATION_PLAN.md` for full batch registry.

### Question Content — Other Subjects
| Subject | Chapters | Status |
|---------|----------|--------|
| Physics | 15 | NOT STARTED |
| Chemistry | 15 | NOT STARTED |
| Botany | 15 | NOT STARTED |

---

## NOT STARTED — Upcoming Releases

### R11 — Wrong-Answer Analysis + Concept Explainer
- [ ] Pre-generated explanation JSON files per chapter
- [ ] Pre-generated concept files per subject
- [ ] `scripts/generate-explanations.ts` (batch generation)
- [ ] Edge Function fallbacks for cache misses
- [ ] Wrong-answer UI card + Concept explainer bottom sheet

### R12 — AI Study Plan + Mock Analysis
- [ ] `ai-study-plan` Edge Function (Sonnet)
- [ ] `ai-mock-analysis` Edge Function (Sonnet)
- [ ] `performanceCollector.ts` — aggregate performance data
- [ ] Study plan weekly spread screen
- [ ] Mock analysis on practice-results

### R13 — Paywall + Tier Gating
- [ ] `paywall.tsx` — tier comparison + Razorpay
- [ ] `useAIGate.ts` hook
- [ ] `payment-webhook` Edge Function
- [ ] Tier enforcement across all AI entry points
- [ ] Trial management (7-day)

---

## KNOWN GAPS & TECH DEBT

### Features TBD
| Feature | Impact | Effort |
|---------|--------|--------|
| Practice Exam / Quick Practice screens | HIGH — buttons exist on dashboard, both are no-ops | Medium |
| Progress persistence to Supabase | HIGH — progress lost between devices | Medium |
| Subscription check | MEDIUM — hardcoded `isTrial = true` | Low |
| Diagram image rendering | LOW — 4 sample questions have placeholder URIs | Low |
| Additional languages (Hindi, Tamil, Kannada) | MEDIUM — English only currently | High |
| Practice My Mistakes mode | MEDIUM — `getV2QuestionsByIds()` ready, no UI | Low |
| Analytics / Study Gang features | LOW — "coming soon" on dashboard | High |

### Tech Debt
| Item | File | Notes |
|------|------|-------|
| `expo-av` deprecated | `src/hooks/useAudioPlayer.ts` | Migrate to `expo-audio` on next native build |
| `practice-results.tsx` uses legacy Question type | `app/(exam)/practice-results.tsx` | Needs V2 upgrade like chapter-results |
| Subject progress not fetched from DB | `app/subject/[id].tsx:90` | Hardcoded to no-progress |
| Topic ID always null in Qbank insert | `Qbank/insert.html:316` | Doesn't map topic names to IDs |

---

## MUSIC TRACKS

6 lo-fi tracks served via jsDelivr CDN from [lofi-resources](https://github.com/ItzAshOffcl/lofi-resources):

| Track | Mood | File |
|-------|------|------|
| Calm Focus | Chill | `chill/chill_1.mp3` |
| Midnight Study | Chill | `chill/chill_5.mp3` |
| Rain on Paper | Jazzy | `jazzy/jazzy_3.mp3` |
| Soft Waves | Jazzy | `jazzy/jazzy_8.mp3` |
| Library Hum | Sleepy | `sleepy/sleepy_2.mp3` |
| Deep Breath | Sleepy | `sleepy/sleepy_10.mp3` |

---

## ARCHITECTURE SUMMARY

### Navigation Structure
```
app/_layout.tsx                  — Root layout (theme, fonts, Redux, splash)
app/(main)/
  _layout.tsx                    — 3-tab footer: Study Board | Saved | Me
  index.tsx                      — Dashboard
  bookmarks.tsx                  — Bookmarks viewer (fully working)
  profile.tsx                    — Profile screen
app/(auth)/                      — Auth + onboarding flow (10 screens)
app/(exam)/                      — Exam flow (11 screens)
app/chapter/[id].tsx             — Chapter practice
app/subject/[id].tsx             — Subject detail
app/setup/                       — Language, getting started
```

### State Management (Redux + AsyncStorage)
```
authSlice     — User profile, language, exam type
practiceSlice — Exam sessions + history
strengthSlice — Per-chapter mastery tracking
bookmarkSlice — Saved question IDs
aiSlice       — AI usage, doubt cache, rate limiting
squadSlice    — Study groups
musicSlice    — Ambient player state
focusSlice    — App-switch tracking
```

### Data Flow
```
Questions:  Supabase DB → Qbank tools → JSON → App bundle
Progress:   Redux → AsyncStorage (device-only for now)
Auth:       Supabase Auth (email/OTP)
AI:         Gemini API (2.5-flash / 2.5-pro) via direct client call
Music:      jsDelivr CDN → expo-av streaming
```

---

## COST ESTIMATES (AI Features)

| Feature | Model | Frequency | Cost/Call |
|---------|-------|-----------|-----------|
| Doubt Solver | Gemini 2.5 Flash (80%) / Pro (20%) | 20-50/user/day | ~₹0.02-0.50 |
| Wrong-Answer Analysis | Flash | 5-10/user/day (cache misses) | ~₹0.02 |
| Concept Explainer | Pro | 3-5/user/day (cache misses) | ~₹0.50 |
| Study Plan | Pro | 1/user/week | ~₹0.70 |
| Mock Analysis | Pro | 2-4/user/month | ~₹1.00 |

Estimated: **₹30-50/user/month** with Gemini pricing + client cache.
