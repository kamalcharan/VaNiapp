# CUET Mathematics — Question Bank Folder

Scaffolding for CUET Mathematics (NCERT Class 12). **No questions generated yet** —
this folder currently holds structure only.

- Chapters + topics: `supabase/migrations/20260801_create_cuet_mathematics_chapters_topics.sql`
- Generation plan: `docs/CUET_MATHEMATICS_GENERATION_PLAN.md`
- Generation prompt: `PROMPT-mathematics.md` (this folder)
- Shape reference: `_TEMPLATE.json` (this folder)

`subject_id` is **`mathematics`**, not `cuet-mathematics`. The master plan table
says otherwise; the seeded `med_subjects` row is the authority.

## Folder → chapter_id map

| Folder | chapter_id | Ch | Topics |
|---|---|---|---|
| `relations-functions/` | `cuet-math-relations-functions` | 1 | 4 |
| `inverse-trig/` | `cuet-math-inverse-trig` | 2 | 4 |
| `matrices/` | `cuet-math-matrices` | 3 | 4 |
| `determinants/` | `cuet-math-determinants` | 4 | 6 |
| `continuity/` | `cuet-math-continuity` | 5 | 8 |
| `derivatives-app/` | `cuet-math-derivatives-app` | 6 | 5 |
| `integrals/` | `cuet-math-integrals` | 7 | 7 |
| `integrals-app/` | `cuet-math-integrals-app` | 8 | 3 |
| `diff-equations/` | `cuet-math-diff-equations` | 9 | 5 |
| `vectors/` | `cuet-math-vectors` | 10 | 5 |
| `3d-geometry/` | `cuet-math-3d-geometry` | 11 | 5 |
| `linear-prog/` | `cuet-math-linear-prog` | 12 | 3 |
| `probability/` | `cuet-math-probability` | 13 | 6 |

Folder names follow `docs/CUET_MASTER_PLAN.md` (bare names, no `chNN-` prefix).
Note that `business-studies/` and `accountancy/` use a `chNN-name/` prefix
instead — the repo is inconsistent here. Mathematics follows the master plan.

## Where generated files go

```
mathematics/<chapter-folder>/batch-YYYY-MM-DD/<topic-id>.json
```

e.g. `mathematics/matrices/batch-2026-08-05/cuet-math-mx-operations.json`

One file per topic, 40 questions each. The dated `batch-` folder is the signal
to the owner that a batch is generated but **not yet imported** via
`Qbank/bulkinsert.html`.

## Hard requirements before generating

1. Run the migration first. `bulkinsert.html` resolves against `med_chapters` /
   `med_topics`, and unresolvable ids were the cause of a 6,976-question import
   failure (QBANK_AGENT.md §13.5 mistake 3).
2. Every question needs `chapter_id` — do **not** rely on the `chapter` display
   name. `accountancy`, `chemistry` and `economics` omit `chapter_id` and depend
   on name matching; don't repeat that.
3. Read `PROMPT-mathematics.md` for the notation rules. Mathematics is the first
   CUET subject where notation is the main authoring risk.
