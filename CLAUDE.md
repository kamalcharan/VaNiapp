# Claude Notes — VaNi App

## Pending decisions / parked discussions

### Shuffle options on re-attempt

**Status:** partially scoped, held for later review.

**Agreed so far:**
- MCQ, fill-in-blanks, scenario-based, diagram-based, logical-sequence, match-the-following → shuffle the 4 answer options (A/B/C/D). MTF column items stay put.
- True-false → no shuffle (only 2 options).
- Shuffle scope: **per-attempt**, not per-session. Seed = `hash(user_id + question_id + attempt_count_for_this_question)`. First view (count=0) keeps canonical order; every subsequent view reshuffles. Refresh-safe because the seed is deterministic.
- Underlying option keys (A/B/C/D) on option records stay stable — only the display array is reordered. `correct_answer` and `elimination_hints.option_key` continue to reference the stable keys.
- Answer review screen should render option **content** (not just letter) so users can match their selection by value even if letters moved.

**Held for decision:**
- **Assertion-reasoning shuffling** — risk is small (memorization-defeat benefit ≈ MCQ), but there's a cross-question consistency tradeoff: the standardized A-R option template ("both true, R explains A" / etc.) lands in different positions on different questions if shuffled, adding friction for students still internalizing the A-R framework. Default for now: A-R **stays unshuffled** until we revisit. Add a per-question-type feature flag so we can enable A-R independently later.
- **Explanation letter references** — many DB explanations say "Option C is correct because…" which breaks after shuffle. Still need to run an audit (SQL against `med_questions.explanation` for `Option [A-D]` / `\b[A-D]\b is (correct|wrong|right|false)`) to size the problem before deciding between: (a) ship + accept minor inconsistency, (b) flag affected questions `shuffle_safe=false` and skip shuffle for them, (c) bulk LLM rewrite pass to make explanations letter-agnostic.
