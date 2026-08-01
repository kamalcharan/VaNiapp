# CUET Mathematics — Question Generation Plan

> **Created:** 2026-08-01
> **Status:** Scaffolded — 0 questions generated
> **Target:** 65 topics × 40 questions = **2,600 questions**
> **Subject id:** `mathematics` · **Chapter id prefix:** `cuet-math-`

---

## Why this subject is different

Mathematics is the first CUET subject where **rendering, not content, is the
risk**. There is no LaTeX or MathML support anywhere in the app — the bank's
12,658 existing questions contain zero math markup, and Physics expresses
everything in Unicode (`iₚ`, `I₀`, `×10⁸`) inside a plain `<Text>`.

Consequences, decided up front:

1. **All notation is Unicode plain text.** The approved character set and the
   matrix/fraction/integral conventions are in
   `Qbank/CUET/mathematics/PROMPT-mathematics.md` §1.
2. **Questions are designed around the constraint**, not formatted after the
   fact. Anything needing a nested fraction, a limit under a summation, or a
   piecewise brace gets rewritten as a one-line question.
3. **`diagram-based` is off by default** and MCQ is raised to 60%. Maths
   diagrams mean plotted graphs, which need real PNGs in the `question-images`
   bucket. Only 4 chapters get them (see §4).

If the owner later wants true math typesetting, that is an app change
(a KaTeX-capable renderer for `question_text` and `options[].text`), and it
should be decided **before** 2,600 questions are authored — retrofitting
notation across a generated bank is far more expensive than deciding now.

---

## 1. Prerequisites

| # | Step | Status |
|---|---|---|
| 1 | `med_subjects` row `mathematics` exists | ✅ seeded in consolidated schema |
| 2 | 13 chapters + 65 topics inserted | ⬜ run `supabase/migrations/20260801_create_cuet_mathematics_chapters_topics.sql` |
| 3 | Chapter folders scaffolded | ✅ `Qbank/CUET/mathematics/` |
| 4 | Generation prompt written | ✅ `PROMPT-mathematics.md` |

**The migration must run before any generation.** `bulkinsert.html` resolves
`chapter_id` against `med_chapters` / `med_topics`; unresolvable ids are what
caused the 6,976-question import failure recorded in QBANK_AGENT §13.5.

> **Master plan correction:** `docs/CUET_MASTER_PLAN.md` §4 lists the DB
> subject_id as `cuet-mathematics`. The seeded row is `mathematics`
> (consolidated_schema.sql:229). The migration uses `mathematics`; the master
> plan table should be updated.

---

## 2. Chapter registry

| # | Chapter | chapter_id | Folder | Topics | Weight | Qs |
|---|---|---|---|---|---|---|
| 1 | Relations and Functions | `cuet-math-relations-functions` | `relations-functions` | 4 | 6.0 | 160 |
| 2 | Inverse Trigonometric Functions | `cuet-math-inverse-trig` | `inverse-trig` | 4 | 5.0 | 160 |
| 3 | Matrices | `cuet-math-matrices` | `matrices` | 4 | 8.0 | 160 |
| 4 | Determinants | `cuet-math-determinants` | `determinants` | 6 | 8.0 | 240 |
| 5 | Continuity and Differentiability | `cuet-math-continuity` | `continuity` | 8 | 10.0 | 320 |
| 6 | Applications of Derivatives | `cuet-math-derivatives-app` | `derivatives-app` | 5 | 9.0 | 200 |
| 7 | Integrals | `cuet-math-integrals` | `integrals` | 7 | 12.0 | 280 |
| 8 | Applications of the Integrals | `cuet-math-integrals-app` | `integrals-app` | 3 | 5.0 | 120 |
| 9 | Differential Equations | `cuet-math-diff-equations` | `diff-equations` | 5 | 8.0 | 200 |
| 10 | Vector Algebra | `cuet-math-vectors` | `vectors` | 5 | 8.0 | 200 |
| 11 | Three Dimensional Geometry | `cuet-math-3d-geometry` | `3d-geometry` | 5 | 8.0 | 200 |
| 12 | Linear Programming | `cuet-math-linear-prog` | `linear-prog` | 3 | 5.0 | 120 |
| 13 | Probability | `cuet-math-probability` | `probability` | 6 | 8.0 | 240 |
| | **Total** | | | **65** | **100.0** | **2,600** |

Weightage sums to 100.0 and `avg_questions` sums to 50 (CUET Section II
Mathematics = 50 questions, 40 attempted).

---

## 3. Topic registry — batch checklist

Tick as each topic's 40-question file lands. File path is
`Qbank/CUET/mathematics/<folder>/batch-YYYY-MM-DD/<topic-id>.json`.

### Ch 1 — Relations and Functions
- [ ] `cuet-math-rf-types-relations` — Types of Relations: Reflexive, Symmetric, Transitive
- [ ] `cuet-math-rf-equivalence` — Equivalence Relations and Equivalence Classes
- [ ] `cuet-math-rf-types-functions` — Types of Functions: One-One, Onto and Bijective
- [ ] `cuet-math-rf-composition` — Composition of Functions and Invertible Functions

### Ch 2 — Inverse Trigonometric Functions
- [ ] `cuet-math-it-basics` — Definition and Notation
- [ ] `cuet-math-it-principal-value` — Domain, Range and Principal Value Branches
- [ ] `cuet-math-it-properties` — Properties and Identities
- [ ] `cuet-math-it-graphs` — Graphs of Inverse Trigonometric Functions ⚠️ *diagrams*

### Ch 3 — Matrices
- [ ] `cuet-math-mx-types-order` — Order of a Matrix and Types of Matrices
- [ ] `cuet-math-mx-operations` — Addition, Scalar Multiplication and Matrix Multiplication
- [ ] `cuet-math-mx-transpose` — Transpose, Symmetric and Skew-Symmetric Matrices
- [ ] `cuet-math-mx-elementary-inverse` — Elementary Row Operations and Inverse

### Ch 4 — Determinants
- [ ] `cuet-math-dt-evaluation` — Determinant of a Square Matrix (2x2 and 3x3)
- [ ] `cuet-math-dt-properties` — Properties of Determinants
- [ ] `cuet-math-dt-area-triangle` — Area of a Triangle Using Determinants
- [ ] `cuet-math-dt-minors-cofactors` — Minors, Cofactors and Cofactor Expansion
- [ ] `cuet-math-dt-adjoint-inverse` — Adjoint, Inverse and Singular Matrices
- [ ] `cuet-math-dt-linear-equations` — System of Linear Equations by Matrix Method

### Ch 5 — Continuity and Differentiability
- [ ] `cuet-math-cd-continuity` — Continuity at a Point and on an Interval
- [ ] `cuet-math-cd-differentiability` — Differentiability and Relation with Continuity
- [ ] `cuet-math-cd-chain-rule` — Chain Rule and Composite Functions
- [ ] `cuet-math-cd-implicit` — Derivatives of Implicit Functions
- [ ] `cuet-math-cd-inverse-trig` — Derivatives of Inverse Trigonometric Functions
- [ ] `cuet-math-cd-exp-log` — Derivatives of Exponential and Logarithmic Functions
- [ ] `cuet-math-cd-log-differentiation` — Logarithmic Differentiation
- [ ] `cuet-math-cd-parametric-second` — Parametric Form and Second Order Derivatives

### Ch 6 — Applications of Derivatives
- [ ] `cuet-math-ad-rate-of-change` — Rate of Change of Quantities
- [ ] `cuet-math-ad-increasing` — Increasing and Decreasing Functions ⚠️ *diagrams*
- [ ] `cuet-math-ad-tangents-normals` — Tangents and Normals
- [ ] `cuet-math-ad-maxima-minima` — Maxima and Minima; Derivative Tests
- [ ] `cuet-math-ad-applied-problems` — Applied Maxima-Minima Problems

### Ch 7 — Integrals
- [ ] `cuet-math-in-standard` — Integration as Inverse of Differentiation; Standard Integrals
- [ ] `cuet-math-in-substitution` — Integration by Substitution
- [ ] `cuet-math-in-partial-fractions` — Integration Using Partial Fractions
- [ ] `cuet-math-in-by-parts` — Integration by Parts
- [ ] `cuet-math-in-special-forms` — Integrals of Special Forms
- [ ] `cuet-math-in-definite` — Definite Integrals and the Fundamental Theorem
- [ ] `cuet-math-in-definite-properties` — Properties of Definite Integrals

### Ch 8 — Applications of the Integrals
- [ ] `cuet-math-ai-area-curves` — Area Under Simple Curves ⚠️ *diagrams*
- [ ] `cuet-math-ai-area-between` — Area Between Two Curves ⚠️ *diagrams*
- [ ] `cuet-math-ai-standard-regions` — Area Bounded by Lines, Circles, Parabolas, Ellipses ⚠️ *diagrams*

### Ch 9 — Differential Equations
- [ ] `cuet-math-de-order-degree` — Order and Degree
- [ ] `cuet-math-de-formation` — Formation of a Differential Equation
- [ ] `cuet-math-de-variables-separable` — Variables Separable Method
- [ ] `cuet-math-de-homogeneous` — Homogeneous Differential Equations
- [ ] `cuet-math-de-linear` — Linear Differential Equations and Integrating Factor

### Ch 10 — Vector Algebra
- [ ] `cuet-math-va-basics` — Scalars, Vectors and Types of Vectors
- [ ] `cuet-math-va-components-dc` — Components, Direction Cosines and Ratios
- [ ] `cuet-math-va-addition` — Addition of Vectors and Section Formula
- [ ] `cuet-math-va-dot-product` — Scalar (Dot) Product and Projection
- [ ] `cuet-math-va-cross-product` — Vector (Cross) Product and Area Applications

### Ch 11 — Three Dimensional Geometry
- [ ] `cuet-math-td-direction-cosines` — Direction Cosines and Ratios of a Line
- [ ] `cuet-math-td-line-equations` — Equation of a Line in Space
- [ ] `cuet-math-td-angle-lines` — Angle Between Two Lines
- [ ] `cuet-math-td-shortest-distance` — Shortest Distance and Skew Lines
- [ ] `cuet-math-td-plane` — Equation of a Plane; Angle Between Line and Plane

### Ch 12 — Linear Programming
- [ ] `cuet-math-lp-formulation` — Formulation of an LPP
- [ ] `cuet-math-lp-graphical` — Graphical Method and Feasible Region ⚠️ *diagrams*
- [ ] `cuet-math-lp-optimal` — Bounded, Unbounded and Infeasible Cases ⚠️ *diagrams*

### Ch 13 — Probability
- [ ] `cuet-math-pb-conditional` — Conditional Probability
- [ ] `cuet-math-pb-multiplication` — Multiplication Theorem
- [ ] `cuet-math-pb-independent` — Independent Events
- [ ] `cuet-math-pb-bayes` — Total Probability and Bayes Theorem
- [ ] `cuet-math-pb-random-variable` — Random Variables and Probability Distributions
- [ ] `cuet-math-pb-mean-variance` — Mean and Variance of a Random Variable

---

## 4. Diagram topics (8 of 65)

Marked ⚠️ above. These need PNGs uploaded to the `question-images` bucket at
`question-images/mathematics/{chapter-folder}/{question-id}.png` before the
batch is imported, or `qualityAutoDetect.ts` will log `IMAGE_LOAD_FAILED`
against every one at runtime.

Recommended: generate the 57 text-only topics first, import and verify them,
then treat the 8 diagram topics as a separate phase with its own image pass.

---

## 5. Suggested sequencing

Order by exam weight and by how cleanly the topic survives plain-text notation.

| Phase | Chapters | Topics | Qs | Rationale |
|---|---|---|---|---|
| 1 | 3, 4 (Matrices, Determinants) | 10 | 400 | Highest notation risk — validate the Unicode conventions on real content before committing to 2,600 questions |
| 2 | 13, 12 (Probability, Linear Prog) | 9 | 360 | Mostly prose, low notation load, fast wins |
| 3 | 1, 2 (Relations, Inverse Trig) | 8 | 320 | Moderate notation |
| 4 | 10, 11 (Vectors, 3-D) | 10 | 400 | Vector notation `î ĵ k̂` needs a spot-check |
| 5 | 5, 6 (Continuity, App. Derivatives) | 13 | 520 | Largest calculus block |
| 6 | 7, 8, 9 (Integrals, App. Integrals, Diff. Eq.) | 15 | 600 | Heaviest notation — do last, conventions fully settled |

**Stop after Phase 1** and render a batch on a real device. Matrices and
determinants are where `[[1, 2], [3, 4]]` either reads acceptably to a student
or doesn't. If it doesn't, the answer is a renderer change, and finding that out
after 400 questions is much cheaper than after 2,600.

---

## 6. Acceptance checks per batch

Run before handing a batch to `bulkinsert.html`:

1. `python3 Qbank/validate-json.py <file>` passes.
2. Correct-answer letters: each of A/B/C/D within 20–30%, none >35% or <10%.
3. No `\frac`, `$`, `\\(`, or multi-line ASCII matrices anywhere in the file.
4. All 40 ids unique and absent from every other file in the bank.
5. `chapter_id` and `topic` strings match the migration byte-for-byte.
6. After import, `Qbank/explore.html` shows no new `ANSWER_DISTRIBUTION_SKEW`
   or `IMAGE_LOAD_FAILED` issues for `mathematics`.
