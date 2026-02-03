# VaNi App — Session Handover

## What is VaNi App
NEET & CUET exam prep mobile app for Gen-Z Indian students (15-18). Hand-drawn journal aesthetic. Bilingual: English + Telugu.

## Tech Stack
- **Framework**: Expo SDK 54, React Native 0.81.5, React 19.1.0
- **Navigation**: expo-router v6
- **State**: Redux Toolkit + manual AsyncStorage persistence (debounced 500ms)
- **Animations**: RN built-in Animated API only (NO react-native-reanimated)
- **Install**: `npm install --legacy-peer-deps` required
- **Dev server**: Runs on user's local machine, not in this environment

## Branch
- Feature branch: `claude/vani-app-continuation-c60lq` (up to date)
- Main: needs merge from feature branch (fast-forward, no conflicts)

## Completed Releases (R1-R9)

### R1-R3 (pre-existing on main)
Core app: auth, onboarding, profile, subject picker, chapter/practice exam screens, dashboard, history, basic question bank (200 MCQ across 8 chapters, 4 subjects).

### R4-R6
- Squad system (up to 4 members, invite codes, pricing tiers)
- AI doubt solver (VaNi) — OpenAI integration with caching, rate limiting (50/day)
- Focus mode ambient music player (6 lo-fi tracks)
- Focus tracker (app switch counting)
- Edit profile, dark mode toggle
- Toast notification system

### R7
- Chapter strength tracker: per-chapter coverage %, accuracy %, strength levels
- Strength levels: just-started -> getting-there -> on-track -> strong (+ needs-focus flag)
- StrengthMap component (compact for dashboard, full for profile)
- `evaluateStrength()` and `evaluateSubjectStrength()` utilities
- Elimination technique + Ask VaNi refactored to pill badges in question headers
- Answer review screen with QuestionRenderer, filter tabs, navigation

### R8: New Question Types + Adaptive Mix
- **8 question types**: MCQ, True-False, Assertion-Reasoning, Match-the-Following, Fill-in-Blanks, Scenario-Based, Diagram-Based, Logical-Sequence
- **QuestionRenderer**: Central switch component routing to dedicated sub-components
- **QuestionV2 type system**: Discriminated union payloads per type
- **32 sample V2 questions** in `sample-v2-questions.ts` (Physics + Botany, 7 non-MCQ types)
- **Strength-based type gating**: Progressive unlock via STRENGTH_LEVELS config
- **Integration**: chapter-question, quick-question, answer-review all use QuestionRenderer
- **Utilities**: `legacyToV2()`, `getCorrectId()`, `filterByUnlockedTypes()`

### R9: Practice V2 + Bookmarks + Dashboard
- **Practice exam V2**: `practice-question.tsx` converted to QuestionV2 types + getCorrectId
- **Bookmark system**: Redux slice (`bookmarkSlice.ts`) with toggleBookmark, persisted to AsyncStorage
- **Bookmark UI**: Save/Saved badge on all 3 question screens (chapter, quick, answer-review) with haptic feedback
- **Dashboard additions**: "Saved Questions" card (bookmark count), "Focus Areas" section (weak chapters < 50% accuracy)
- **Results V2**: `chapter-results.tsx` upgraded to V2, shows question type breakdown (accuracy per type)
- **Utility**: `getV2QuestionsByIds(ids)` for bookmark/weak-topic lookups

## Key Architecture Decisions

### Question System
- Legacy `Question` type = MCQ only (200 questions in 8 chapter files)
- `QuestionV2` type = all 8 types with discriminated union `payload`
- Payload interfaces are NOT exported from `types/index.ts` — components define local shape interfaces and use `payload.type` narrowing
- `TrueFalseQuestion` uses synthetic IDs `tf-true`/`tf-false` for answer tracking compatibility
- `getCorrectId(q)` extracts correct answer from any payload type

### Strength-Based Type Gating
```
just-started:    mcq, true-false
getting-there:   + assertion-reasoning, match-the-following, fill-in-blanks
on-track:        + scenario-based, diagram-based
strong:          + logical-sequence (all 8)
```
Quick practice uses broadest unlock across all subject chapters.

### Persistence
Manual `store.subscribe` -> debounced AsyncStorage save. Rehydrated on app start via `rehydrateStore()`. Persisted slices: auth, practice, squad, ai, strength, bookmark.

### Practice Exam
Uses legacy `buildPracticeExam()` returning `Question[]`, converted to V2 at screen level via `legacyBatchToV2()`. Keeps inline MCQ option rendering (supports elimination via long-press). 200 questions, NEET format (Section A: 35q + Section B: 15q per subject).

## Known Gaps / Next Session Candidates

### Remaining R9 Items
1. **practice-results.tsx** still uses legacy `Question` type — needs V2 upgrade like chapter-results
2. **"Practice My Mistakes" mode** — collect wrong-answer IDs from history, start targeted practice. `getV2QuestionsByIds` utility is ready but not wired to a screen
3. **Saved Questions viewer** — dashboard card shows count but doesn't navigate. Needs a screen to browse/review bookmarked questions

### R10+ Ideas
- Spaced repetition (revisit wrong answers over time)
- More question content (currently 200 MCQ + 32 V2 samples)
- CUET support (types defined, no content)
- Push notifications / study reminders
- Performance analytics charts
- Offline-first improvements
- Supabase backend integration (client stub exists)

## File Map (82 TypeScript files)

### Screens (app/)
```
app/_layout.tsx                    — Root layout (theme, fonts, Redux, splash)
app/index.tsx                      — Initial routing
app/edit-profile.tsx               — Edit profile

app/(auth)/
  _layout.tsx, welcome.tsx, sign-up.tsx, sign-in.tsx,
  onboarding.tsx, profile-setup.tsx, subject-picker.tsx,
  trial-welcome.tsx, squad-pitch.tsx, squad-setup.tsx

app/(exam)/
  _layout.tsx, subject-select.tsx, chapter-select.tsx,
  chapter-question.tsx, chapter-results.tsx,
  practice-start.tsx, practice-question.tsx, practice-results.tsx,
  quick-start.tsx, quick-question.tsx, answer-review.tsx

app/(tabs)/
  _layout.tsx, index.tsx (dashboard), ask-vani.tsx,
  history.tsx, profile.tsx
```

### Components (src/components/)
```
SplashScreen.tsx, StrengthMap.tsx, AskVaniSheet.tsx,
GlobalMusicOverlay.tsx, MiniPlayer.tsx, MusicDrawer.tsx

ui/  PuffyButton, AnimatedPressable, JournalCard, StickyNote,
     WashiTape, DotGridBackground, HandwrittenText,
     StreakBadge, CountUpText, ConfettiBurst, Toast

exam/ QuestionRenderer, McqQuestion, TrueFalseQuestion,
      AssertionReasoningQuestion, MatchTheFollowingQuestion,
      FillInBlanksQuestion, ScenarioBasedQuestion,
      DiagramBasedQuestion, LogicalSequenceQuestion
```

### State (src/store/)
```
index.ts              — Store config + persistence
slices/
  authSlice.ts        — User profile, language, exam type
  practiceSlice.ts    — Exam sessions + history
  strengthSlice.ts    — Per-chapter mastery tracking
  bookmarkSlice.ts    — Saved question IDs
  aiSlice.ts          — AI usage, doubt cache
  squadSlice.ts       — Study groups
  musicSlice.ts       — Ambient player state
  focusSlice.ts       — App-switch tracking
```

### Data & Lib
```
src/data/chapters.ts                 — 8 NEET chapters
src/data/questions/index.ts          — Query builders + V2 getters
src/data/questions/*.ts              — 200 MCQ + 32 V2 samples
src/lib/questionAdapter.ts           — legacyToV2, getCorrectId, filterByUnlockedTypes
src/lib/strengthEvaluator.ts         — evaluateStrength, evaluateSubjectStrength
src/lib/aiClient.ts                  — OpenAI integration
src/lib/supabase.ts                  — Supabase client stub
src/constants/theme.ts               — Colors, Typography, Spacing, BorderRadius
src/constants/subjects.ts            — SUBJECT_META
src/constants/tracks.ts              — 6 lo-fi tracks
src/config/ai.ts                     — API config, rate limits
src/types/index.ts                   — All type definitions
src/hooks/useTheme.ts, useAudioPlayer.ts, useFocusTracker.ts
```

## User Preferences
- "dont code without my go ahead" — always present plan and wait for approval
- "dont build everything in 1 go...do it as 3 files at a go" — batch work in groups of ~3 files
- User approves with "ok" or "yes"
- User checks with "are you done" / "all done?"
- Expo dev server runs on user's local machine — never claim to test locally
