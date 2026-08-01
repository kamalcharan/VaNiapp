# CUET Mathematics — Generation Prompt

Read this in full before generating. Mathematics differs from every CUET subject
already in the bank because **notation, not content, is the binding constraint**.

---

## 1. Notation: Unicode plain text only

The renderer is a plain React Native `<Text>`. There is **no LaTeX, no MathML,
no KaTeX** anywhere in the app, and none in the 12,658 questions already in the
bank. Physics uses Unicode (`iₚ`, `I₀`, `μ`, `×10⁸`) and Mathematics must do the
same.

Anything you cannot express in the table below **must be rewritten**, not
approximated with markup. A question containing `\frac{dy}{dx}` or `$$...$$`
renders those characters literally on a student's screen.

### Approved characters

| Need | Use | Example |
|---|---|---|
| Superscript | ⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿ | `x²`, `e⁻ˣ`, `aⁿ` |
| Subscript | ₀₁₂₃₄₅₆₇₈₉ₐₙᵢⱼₖ | `a₁₁`, `xᵢ`, `aₙ` |
| Fractions | `/` with brackets | `(x + 1)/(x − 1)` |
| Derivative | `dy/dx`, `d²y/dx²`, `f′(x)`, `f″(x)` | `d²y/dx² + 4y = 0` |
| Integral | `∫`, `∫ₐᵇ` | `∫ x² dx`, `∫₀¹ x dx` |
| Roots | `√`, `∛` | `√(x² + 1)` — always bracket the radicand |
| Operators | `× ÷ ± ∓ ≠ ≤ ≥ ≈ ∝ ∞` | `x ≥ 0` |
| Sets / logic | `∈ ∉ ⊂ ⊆ ∪ ∩ ∅ ∀ ∃ ⇒ ⇔ →` | `R ⊆ A × A` |
| Greek | `α β γ θ λ μ π σ Δ Σ Ω` | `θ = π/4` |
| Vectors | `î ĵ k̂`, `·`, `×`, `\|a\|` | `a = 2î − 3ĵ + k̂` |
| Trig inverse | `sin⁻¹ x`, `tan⁻¹ x` | `sin⁻¹(1/2) = π/6` |
| Matrix | inline bracket rows | `[[1, 2], [3, 4]]` |
| Determinant | `det(A)` or `\|A\|` | `det(A) = ad − bc` |

Use the minus sign `−` (U+2212) in expressions, not the hyphen `-`.

### Matrices

Write as bracketed row lists — one pair of outer brackets, one pair per row:

```
A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
```

Do **not** attempt multi-line ASCII art alignment. It collapses in the
renderer's flex layout and breaks on narrow screens.

### Rewrite rather than approximate

If a question needs a nested fraction, a limit under a summation, a piecewise
definition, or a 3×3 determinant expanded in place — **rewrite the question so
it doesn't**. Ask for the same concept in a form that is one line of plain text.
This is a constraint on question design, not a formatting afterthought.

Acceptable piecewise phrasing:
`f(x) = 2x + 1 for x < 0, and f(x) = x² for x ≥ 0. Is f continuous at x = 0?`

---

## 2. Batch size and question mix

**40 questions per topic**, one JSON file per topic, 65 topics = 2,600 target.

| Type | Count | % | Difficulty split |
|---|---|---|---|
| `mcq` | 24 | 60% | 6 easy, 12 medium, 6 hard |
| `assertion-reasoning` | 4 | 10% | 2 medium, 2 hard |
| `true-false` | 4 | 10% | 2 TRUE, 2 FALSE (all easy) |
| `match-the-following` | 2 | 5% | 1 medium, 1 hard |
| `fill-in-blanks` | 2 | 5% | 1 easy, 1 medium |
| `scenario-based` | 2 | 5% | 1 medium, 1 hard |
| `logical-sequence` | 2 | 5% | 1 medium, 1 hard |
| **Total** | **40** | | **9 easy / 18 medium / 13 hard** |

**MCQ is weighted higher (60%) than the physics batch (50%) and
`diagram-based` is dropped to zero by default.** Maths diagrams mean plotted
graphs, which need real image assets uploaded to the `question-images` bucket —
a pipeline cost with no payoff for topics that read fine as text.

Generate `diagram-based` **only** for these four chapters, and only where the
graph genuinely carries the question:

- `cuet-math-linear-prog` — feasible region plots
- `cuet-math-integrals-app` — shaded area between curves
- `cuet-math-derivatives-app` — increasing/decreasing intervals from a curve
- `cuet-math-it-graphs` — inverse trig graphs

When you do, swap 4 MCQs out (24 → 20) and set `image_uri` to
`question-images/mathematics/{chapter-folder}/{question-id}.png` plus an
`image_alt` describing the plot. Flag the batch as needing image upload.

---

## 3. Correct-answer distribution (hard rule)

From `docs/QBANK_AGENT.md` §13.5 mistake 7 — this has already gone wrong twice
(85% option A on assertion-reasoning, 56–67% option B on MCQ):

- Each of A / B / C / D correct **20–30%** of the time across the batch.
- **No letter above 35%. No letter below 10%.**
- Before emitting JSON, list your 40 correct-answer letters, count them, and
  redistribute if any bucket is out of range.
- For `assertion-reasoning`, also balance the four **semantic** templates — do
  not always land on "both true, R explains A". Spread across "both true and R
  explains A", "both true but R does not explain A", "A true R false", and
  "A false R true".

Maths has a specific extra trap: **do not make the correct option the only
"clean" number.** If the answer is `π/6` and the distractors are `0.5236`,
`1.047`, `2.094`, the answer is guessable without doing the maths. Distractors
must be the results of plausible *specific* errors — sign slip, wrong chain-rule
factor, forgotten constant of integration, swapped domain/range, using degrees
instead of radians.

---

## 4. Output schema

One file per topic. Top level is a **JSON array** (not an object with a
`questions` key — the bank uses both, but new files use the array form).

```json
[
  {
    "id": "cuet-math-mx-operations-01",
    "question_type": "mcq",
    "difficulty": "medium",
    "question_text": "If A = [[2, 1], [0, 3]] and B = [[1, −1], [2, 0]], what is AB?",
    "explanation": "Matrix multiplication takes row-by-column dot products. Entry (1,1) = 2(1) + 1(2) = 4. Entry (1,2) = 2(−1) + 1(0) = −2. Entry (2,1) = 0(1) + 3(2) = 6. Entry (2,2) = 0(−1) + 3(0) = 0. So AB = [[4, −2], [6, 0]]. Note AB ≠ BA in general — matrix multiplication is not commutative.",
    "correct_answer": "C",
    "concept_tags": ["matrix-multiplication", "row-by-column", "non-commutative"],
    "topic": "Addition, Scalar Multiplication and Matrix Multiplication",
    "chapter_id": "cuet-math-matrices",
    "subject": "mathematics",
    "chapter": "Matrices",
    "bloom_level": "apply",
    "exam_suitability": ["CUET"],
    "options": [
      { "key": "A", "text": "[[2, −1], [6, 0]]", "is_correct": false },
      { "key": "B", "text": "[[4, −2], [0, 6]]", "is_correct": false },
      { "key": "C", "text": "[[4, −2], [6, 0]]", "is_correct": true },
      { "key": "D", "text": "[[3, 0], [2, 3]]", "is_correct": false }
    ],
    "elimination_hints": [
      { "optionKey": "A", "hint": "This multiplies entries position-by-position instead of row-by-column." },
      { "optionKey": "B", "hint": "Correct entries, but the off-diagonal terms are transposed." },
      { "optionKey": "D", "hint": "This is A + B, not AB." }
    ]
  }
]
```

### Field rules

- `id` — `{topic-id}-NN`, zero-padded, unique across the entire bank.
  Psychology currently has 923 duplicate ids because two id schemes were used
  for the same questions. Do not create a second scheme.
- `chapter_id` — **required**, must exist in `med_topics` / `med_chapters`.
- `subject` — always `"mathematics"`.
- `explanation` — must show the actual working, not just restate the answer.
  This is what the answer-review screen displays.
- `elimination_hints` — one per *incorrect* option, keyed by `optionKey`.
  Reference option **content**, never the letter: options are reshuffled per
  session by `src/lib/optionShuffle.ts`, so "Option B is wrong" will point at
  the wrong option at render time.
- `bloom_level` — `remember` | `understand` | `apply` | `analyze`.

### Per-type payload requirements

Populate **both** `question_text` (display fallback) and the structured fields.
Lean payloads caused thousands of validator false positives (§13.5 mistake 4).

- `true-false` — option A = `"True"`, option B = `"False"`, options C and D =
  `"---"`. Two questions correct on A, two on B.
- `fill-in-blanks` — the blank must be marked with six underscores `______`
  in `text_with_blanks`. Without it the blank card renders empty (§13.5 mistake 5).
- `scenario-based` — `scenario` is the situation; `question_text` is the
  question asked *about* it. They must not be identical (§13.5 mistake 6).
- `assertion-reasoning` — populate `assertion` and `reason` as separate fields,
  with the four standard options in the canonical order.
- `match-the-following` — `columnA` and `columnB` as arrays of `{id, text}`.
  Keep entries short; long strings wrap badly in the two-column layout.

---

## 5. Before you submit a batch

1. Correct-answer letters counted and within 20–30% each.
2. No LaTeX, no `$`, no `\frac`, no multi-line ASCII matrices.
3. Every `chapter_id` and `topic` string matches the migration exactly.
4. All 40 ids unique and not present in any other file.
5. Distractors are error-derived, not obviously-wrong filler.
6. Spot-render 3 questions mentally at ~360 px width — anything that needs
   horizontal scrolling should be rewritten shorter.
