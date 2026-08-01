# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

VaNi is a NEET/CUET exam-prep mobile app for Indian students (15–18). Expo / React Native client, Supabase backend, browser-based admin tools for question authoring under `Qbank/`. Bilingual (English / Telugu / Hindi) — most user-facing DB fields have `_te` and `_hi` siblings, picked at render time via `t()` in `src/types/index.ts`.

## Commands

```bash
npm install --legacy-peer-deps   # required — peer-dep conflicts otherwise
npm run lint                     # tsc --noEmit (this is the only check; no test runner is configured)
npm run start                    # expo start
npm run android | ios | web      # platform-specific dev servers
```

The Expo dev server runs on the **user's machine**, not in this environment. Don't claim to have launched or tested the app — say so explicitly when UI/runtime verification is needed.

There is **no test runner**. `npm run lint` (which is just `tsc --noEmit`) is the only automated correctness gate.

### Release / versioning

`eas.json` sets `appVersionSource: "local"` — version numbers are **not** auto-incremented by EAS, they live in `app.json` and must be bumped by hand:

- `expo.version` (user-visible, e.g. `2.1.0`) and `expo.android.versionCode` (integer, monotonic).
- Three build profiles: `development` (dev client), `preview` (internal APK), `production` (store AAB). Each carries its own `EXPO_PUBLIC_*` env block inline.
- After shipping, a row in `med_app_versions` (`status = 'active'`) drives the in-app update prompt — see the force-update flow below. Bumping `app.json` without updating that row means users are never told to upgrade.
- Release history is logged in `docs/RELEASE_PLAN.md`.

### Directories that are not live code

`_screens_backup/`, `sample/`, `documents/`, and the stray zero-byte `com.facebook.react.fabric.*` files at the repo root are dead weight. Don't read them for reference or edit them — `app/` and `src/` are the real client.

## Supabase access — important caveat

The assistant does **not** have access to the correct Supabase project. The owner runs all SQL manually:

- Propose SQL queries / migrations; do not execute them via any MCP tool.
- New migrations belong in `supabase/migrations/` with a `YYYYMMDD_*.sql` filename.
- The single edge function lives in `supabase/functions/verify-play-purchase/`.

## High-level architecture

### Routing & screens (`app/`)

File-based routing via **expo-router v6** with `typedRoutes` enabled. Route groups:

- `(auth)/` — onboarding + sign-in
- `auth/` — OAuth callback (separate from `(auth)` because it needs to be reachable while signed out *and* while a recovery session is active)
- `setup/` — multi-step onboarding (welcome → exam-picker → subject-picker → language → profile-details → invite-gang → getting-started)
- `(main)/` — tabbed home (index/dashboard, history, bookmarks, profile)
- Top-level: `chapter/[id].tsx`, `subject/[id].tsx`, `practice-exam/{index,quiz}.tsx`, `quick-practice/{index,quiz}.tsx`, `practice-mistakes.tsx`, `chapter-results.tsx`, `practice-results.tsx`, `answer-review.tsx`, `paywall.tsx`, `upgrade.tsx`, etc.

`app/_layout.tsx` is the central gate: it owns `AuthContext`, `OnboardingGateContext`, `ThemeContext`, drives Sentry init, and runs the redirect logic that decides between `(auth)`, `setup/`, and `(main)` based on `authState.status` and `isOnboardingActuallyComplete(profile)`.

### State (`src/store/`)

Redux Toolkit, 10 slices: `auth`, `practice`, `music`, `focus`, `squad`, `ai`, `strength`, `bookmark`, `streak`, `trial`. Persistence is **manual** (no redux-persist):

- `store.subscribe` debounces 500 ms and writes to AsyncStorage under `vani-persist-<userId>` (per-user keyed).
- `rehydrateStore(userId)` is called from `app/_layout.tsx` after auth resolves; each slice handles its own `<slice>/rehydrate` action.
- `RESET_ALL` action clears every slice on sign-out / user switch.
- `trialMiddleware` auto-increments the trial question counter on `practice/updateAnswer` and fires a debounced sync to Supabase.

No `react-native-reanimated` — animations use the RN built-in `Animated` API only.

### Question pipeline (the core domain)

```
JSON files in Qbank/{NEET,CUET,generated}/
   ↓ Qbank/bulkinsert.html (browser tool, browser-side Supabase calls)
Supabase: med_questions + med_question_options + med_elimination_hints + med_topics + med_chapters
   ↓ src/lib/questions.ts → fetchQuestionsByChapter() → dbToV2()
QuestionV2 (typed in src/types/index.ts)
   ↓ src/lib/optionShuffle.ts (per-session deterministic shuffle, except true-false)
src/components/exam/QuestionRenderer.tsx → one of 8 type components
```

The 8 question types (`src/components/exam/`):
`McqQuestion`, `TrueFalseQuestion`, `AssertionReasoningQuestion`, `MatchTheFollowingQuestion`, `FillInBlanksQuestion`, `ScenarioBasedQuestion`, `DiagramBasedQuestion`, `LogicalSequenceQuestion`. Synthetic option ids are `A/B/C/D` for everything except `true-false` which uses `tf-true`/`tf-false`.

`src/lib/questionAdapter.ts` resolves legacy chapter ids and provides `getCorrectId()`. `src/lib/strengthEvaluator.ts` + `strengthHelpers.ts` derive the strength level that gates which question types unlock (see `docs/QBANK_AGENT.md` §2.2).

### Qbank admin (browser tools)

Standalone HTML pages under `Qbank/`, each loading `Qbank/shared.js`. **Not** part of the Expo bundle — open in a browser, sign in via Google, hit Supabase directly.

- `bulkinsert.html` — drop JSONs, validates, maps to chapters, inserts into Supabase
- `explore.html` — quality scanner running `runQualityValidators` from `shared.js`; emits issue cards (e.g. `ANSWER_DISTRIBUTION_SKEW`, `IMAGE_LOAD_FAILED`)
- `generate.html`, `translate.html`, `review.html`, `verify-bulkinsert.html` — author / translate / verify workflows
- `index.html` is the admin landing; `login.html` is its auth shell
- Config (with API keys) lives in `Qbank/config.json` — gitignored

Generation prompts and methodology live in `docs/QBANK_AGENT.md` and `Qbank/CUET/<subject>/PROMPT-*.md`. Section 13 of QBANK_AGENT.md is the lessons-learned ledger; mistake #7 covers the answer-letter bias.

### Backend integration (`src/lib/`)

- `supabase.ts` — typed client, env-driven
- `auth.ts` — initial state + `onAuthStateChange` subscription
- `database.ts` — profile, subjects, question-mix config, version reporting
- `payments.ts` + `playBilling.ts` — Razorpay + Google Play Billing
- `progressSync.ts` — pulls remote progress into Redux on auth (remote wins if ahead)
- `errorReporting.ts` — Sentry init, global handler, screen breadcrumbs
- `qualityAutoDetect.ts` — runtime image-load failure reporting back to `med_quality_issues`
- `aiClient.ts` — Gemini for the Ask VaNi doubt solver
- `appConfig.ts` — see "DB-driven config" below
- `conceptLookup.ts` / `explanationLookup.ts` — see "Local content" below

### DB-driven config (change behaviour without shipping a build)

Three things are read from Supabase at runtime rather than hardcoded, so the owner can change them from the dashboard:

- **Pricing** — `appConfig.ts` fetches plans / coupons / GST rate from `med_app_config`, cached in memory for the session, with a `FALLBACK_CONFIG` used when offline. `src/constants/pricing.ts` holds only the *types* and plan ids. Never hardcode a price in a screen.
- **Question mix** — per-exam question-type distribution comes from `database.ts`, not from a constant.
- **Update prompts** — `med_app_versions` (see force-update below).

If you add a knob the owner will plausibly want to tune post-release, follow this pattern instead of adding a constant.

### Force-update flow

`useForceUpdate()` → `ForceUpdateModal`, both mounted in `app/_layout.tsx`. Android goes through Google Play In-App Updates (IMMEDIATE / mandatory) via `sp-react-native-in-app-updates`; iOS and sideloaded Android APKs fall back to querying `med_app_versions` and rendering the modal with a download link. `is_skippable` on that row decides whether the modal can be dismissed. `Constants.expoConfig.version` is the client-side version compared against — which is why the `app.json` bump matters.

### Monetization path

`trialSlice` + `useTrial` (3 days **or** 50 questions, whichever first) → `paywall.tsx` gate → `upgrade.tsx`. Two payment rails: Razorpay (`payments.ts`, web checkout in a WebView) and Google Play Billing (`playBilling.ts` + `react-native-iap`). Only Play purchases are server-verified — that's what the lone `verify-play-purchase` edge function does. `trialMiddleware` in the store increments the counter on `practice/updateAnswer` and debounces a Supabase sync.

### Persona / pacing

`src/constants/persona.ts` + `usePersona()` derive a mode from months remaining until the user's target exam year (exam window = May):

- `≤ 6 months` → **crunch**: all chapters unlocked, countdown/urgency UI
- `> 6 months` → **levels**: progressive unlock, gamified levels

The mode drives lock icons, home-screen copy, and quiz start/complete strings — all of which live in the `PersonaConfig.labels` block, not inline in screens. Changing user-facing copy for one of these states means editing `persona.ts`.

### Design system

Hand-drawn journal aesthetic. `src/constants/theme.ts` exports `Colors.light` / `Colors.dark` (including a highlighter palette, per-subject accent colors, and correct/incorrect/skipped state pairs); `useTheme()` + `ThemeContext` resolve which. Fonts are Google Fonts loaded via `@expo-google-fonts/*` — Caveat / Indie Flower for handwritten accents, Plus Jakarta Sans for body, Noto Sans Devanagari for Hindi.

`src/components/ui/` holds the aesthetic primitives — `StickyNote`, `WashiTape`, `PuffyButton`, `HandwrittenText`, `JournalCard`, `DotGridBackground`, `ConfettiBurst`, `StreakBadge`, `ThemedDialog`, `Toast`, `AnimatedPressable`. Compose these rather than styling raw `View`/`Text`, and pull colors from `Colors[scheme]` rather than writing hex literals.

### Music & focus mode

`music` and `focus` slices, `useAudioPlayer` (expo-av), `useFocusTracker`. `GlobalMusicOverlay` is mounted app-wide in `app/_layout.tsx` but **only when authenticated** — it previously leaked onto auth screens. Track list is `src/constants/tracks.ts`, streamed from raw.githubusercontent.com.

### Local content (not a fallback)

Question and chapter data are Supabase-only — the local fallbacks were deliberately deleted (see commits `3c5d940`, `6df55b6`, `bf11d40`, `e9b24f7`). But `src/data/concepts/` and `src/data/explanations/` are still live: they're bundled reference content backing `conceptLookup.ts` / `explanationLookup.ts`, which feed `ConceptExplainerSheet`. Don't delete them as "leftover fallbacks", and don't reintroduce local question data alongside them.

### TypeScript paths

`@/*` → `src/*`, plus aliases for `components`, `hooks`, `lib`, `store`, `types`, `constants`, `utils`. Strict mode on.

### Env vars

See `.env.example`. `EXPO_PUBLIC_*` vars are inlined into the client bundle. Server-only secrets (Razorpay, Play Billing) belong in edge-function env, never `EXPO_PUBLIC_*`.

Local dev reads `.env` (gitignored); EAS builds read the per-profile `env` blocks in `eas.json`, which **is** committed. Adding a new `EXPO_PUBLIC_*` var means updating `.env.example`, `.env`, and all three `eas.json` profiles.

## Conventions worth knowing

- **Don't run the dev server yourself** — the user does, on their machine.
- **Per-language fields**: when you add a user-facing string column, add `_te` and `_hi` siblings; render via `t(language, en, te, hi)`.
- **Option letters are display-only**: A/B/C/D you see on screen are positional after `optionShuffle`. Underlying option ids (`payload.correctOptionId`, `option_key`, `elimination_hints.optionKey`) are stable. Don't write logic that compares against the displayed letter.
- **Lean payload**: many DB rows store a minimal `payload` (no rich denormalized blob). Quality validators previously assumed rich payload and false-positived — see HANDOVER.md "Quality Validators" fix. New validators must handle both shapes.
- **Approval workflow** (per HANDOVER.md): present a plan, wait for "ok" / "yes" before coding; batch large changes ~3 files at a time.

## Reference docs

- `HANDOVER.md` — last-session handover notes (priorities, key files for ongoing bug investigations)
- `docs/QBANK_AGENT.md` — generation methodology, type specs, lessons learned (§13)
- `docs/RELEASE_PLAN.md` — release history (R1–R10)
- `docs/CUET_*_GENERATION_PLAN.md` and `docs/{CHEM,BOT,PHYSICS,ZOO}_GENERATION_PLAN.md` — per-subject generation plans
- Subject-specific generation prompts: `Qbank/CUET/<subject>/PROMPT-*.md`

---

## Recent design decisions (keep in mind)

### Option shuffle + answer-distribution guardrails (2026-04-24, shipped)

Three-step plan to kill "just guess B" gaming.

**Step 1 — Per-session option shuffle (commit `809e534`).** `src/lib/optionShuffle.ts` deterministically reshuffles A/B/C/D for every type except `true-false`. Seed = `hash(sessionId + '|' + questionId)`.
- Same session → same order (refresh-safe; `answer-review` re-derives the same seed).
- New session → new order (re-attempts can't memorise position).
- Underlying option ids stay stable, so `payload.correctOptionId`, `elimination_hints.optionKey`, answer records keep working. The renderer labels by array index so shuffled positions show as A/B/C/D.
- A-R is included after data showed 85% of correct A-R answers were on option A.
- `eliminationTechnique` text is rebuilt at shuffle time so prefixes ("Option B: …") match new positions.
- Wired in: `app/chapter/[id].tsx`, `app/answer-review.tsx`, `app/chapter-results.tsx`, `app/practice-mistakes.tsx`, `app/practice-exam/quiz.tsx`, `app/quick-practice/quiz.tsx`.

**Step 2 — Quality validator (commit `2cc8e19`).** `Qbank/shared.js runQualityValidators` emits `ANSWER_DISTRIBUTION_SKEW` per (chapter, question_type) when the dominant correct-answer letter holds ≥ 60% **or** any letter < 5%. Tuned 2026-04-25 to require ≥ 25 questions of a type and severity dropped to `low` — strictly an advisory signal for fresh content.

**Step 3 — Future-generation prevention.** `docs/QBANK_AGENT.md` §4.3 / §13.5 / §13.6 carry a hard rule: each of A/B/C/D = 20–30% of correct answers; no letter > 35% or < 10%. Mistake #7 documents the agri/ped bias.

**Decision on existing skewed data (2026-04-25).** Path A: accept + acknowledge, defer rebalance. Trigger to revisit:
- New batch of generated content fails the validator → generation pass needs review.
- Telemetry shows students gaming letter patterns or A-R semantic templates.

## Parked for later review

### Explanation letter references (audit pending)

Many DB explanations still say "Option C is correct because…". After shuffle, position C holds a different option. Impact is limited because the answer-review screen highlights by **content**, not position. To revisit: SQL-grep `med_questions.explanation` for `Option [A-D]` / `\b[A-D]\b is (correct|wrong|right|false)`; if hits > ~20% of rows, plan an LLM rewrite to make explanations letter-agnostic.

### Semantic rebalancing of assertion-reasoning questions

Even after positional shuffle, the A-R template distribution is heavily skewed — ~85% of correct options are the "R explains A" template, regardless of letter. Memorisation-savvy students could learn "pick whichever option says R-explains-A" without reading carefully. To revisit: batch LLM pass per chapter, rebalancing so each of the four A-R semantic templates is correct 20–30% of the time. This is content work (changes the assertion or reason), not a shape rewrite. Prioritise by chapters flagged in `explore.html` `ANSWER_DISTRIBUTION_SKEW`.
