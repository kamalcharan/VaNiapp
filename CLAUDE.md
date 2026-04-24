# Claude Notes — VaNi App

## Shipped: option shuffle + answer-distribution guardrails (2026-04-24)

Three-step plan to kill "just guess B" gaming of the answer letters.

### Step 1 — Per-session option shuffle (SHIPPED, commit `809e534`)

`src/lib/optionShuffle.ts` adds deterministic per-session reshuffling of the A/B/C/D answer options for all question types except `true-false`. Seed = `hash(sessionId + '|' + questionId)`.

- Same session, same question → same order (refresh-safe within a session, and the answer-review screen re-derives the same seed so the user sees the order they answered in).
- New session → new order (re-attempts cannot memorise position).
- Underlying option ids stay stable, so `payload.correctOptionId`, `elimination_hints.optionKey`, answer records, and elimination hints all keep working. The renderer labels by array index so shuffled positions naturally appear as A/B/C/D.
- **A-R included in the shuffle set** after the bias finding (85% of correct A-R answers were on option A). The earlier hesitation about shuffling A-R was resolved once bias data was in.
- Rebuilt `eliminationTechnique` text at shuffle time so hint prefixes ("Option B: …") match the new display positions.

Callsites wired: `app/chapter/[id].tsx`, `app/answer-review.tsx`, `app/chapter-results.tsx`, `app/practice-mistakes.tsx`, `app/practice-exam/quiz.tsx`, `app/quick-practice/quiz.tsx`.

### Step 2 — Quality validator for distribution skew (SHIPPED, commit `2cc8e19`)

`Qbank/shared.js` `runQualityValidators` now emits an `ANSWER_DISTRIBUTION_SKEW` issue per (chapter, question_type) when:
- the dominant correct-answer letter holds ≥ 60% of questions in that type, OR
- any letter holds < 5%.

Needs at least 10 questions of that type to fire. One issue per chapter-type, anchored on the first question so the admin can drill in from `explore.html`. The issue card shows the full A/B/C/D percentage breakdown plus dominant + underused letters.

Use to diagnose which chapters have generation bias before shipping future content.

### Step 3 — Future-generation prevention (SHIPPED, commit pending)

With runtime shuffle live, existing DB bias is largely masked from students. The remaining risk is **future content** and **review-screen fidelity** (answer-review uses a reproducible per-session seed, so a given reviewed attempt keeps a fixed mapping — if generation is biased, within any one review the bias shows through).

- `docs/QBANK_AGENT.md` §4.3 and §13.5/§13.6 now carry a hard distribution rule for all generators: each of A/B/C/D = 20–30% of correct answers; no letter above 35% or below 10%. Added Mistake #7 documenting the agri/ped bias we caught, and added two lines to the production-readiness checklist.
- `Qbank/CUET/ped/PROMPT-generate-ncert-ch2-3-5.md` got an explicit rule #9 requiring per-file distribution check before emission.
- **Existing-data rebalance is NOT executed**. Rationale: runtime shuffle hides the bias for students; rewriting existing option letters would require either (a) re-routing elimination hints on each swap (risky), or (b) editorial rewriting of explanations that reference letter positions. Not worth the blast radius given shuffle is sufficient. Revisit only if a scan shows review-screen UX problems in practice.

## Parked for later review

### Explanation letter references (audit pending)

Many DB explanations still say "Option C is correct because…". After shuffle, position C holds a different option. Impact is limited because:
- The answer-review screen highlights the user's selection + the correct answer by **content**, not position, so students still see which text was right/wrong.
- Explanations are supplementary context, not the primary feedback.

**To do when we return to this:** run SQL against `med_questions.explanation` matching `Option [A-D]` or `\b[A-D]\b is (correct|wrong|right|false)` patterns and count hits per chapter. If under ~20% we accept; over that, plan an LLM rewrite pass to make explanations letter-agnostic ("The correct answer — Glucose + Fructose — is right because…").

### Semantic rebalancing of assertion-reasoning questions

Even after positional shuffle, the A-R template distribution is heavily skewed — ~85% of correct options are the "R explains A" template, regardless of letter. Memorisation-savvy students could learn "pick whichever option says R-explains-A" without reading the assertion/reason pair carefully.

**To do when we return to this:** run a batch LLM pass on the A-R questions in each chapter, rebalancing so each of the four A-R semantic templates is correct 20–30% of the time. This is content work (changes the assertion or reason to make a different template correct), not a shape rewrite. Prioritise by chapters flagged in `explore.html` `ANSWER_DISTRIBUTION_SKEW`.
