-- ==========================================================================
-- CUET Mathematics — 13 chapters + 65 topics
-- NCERT Class 12 Mathematics, aligned to docs/CUET_MASTER_PLAN.md §4
--
-- NOTE ON subject_id: the master plan lists `cuet-mathematics`, but the
-- seeded row in med_subjects (consolidated_schema.sql:229) is `mathematics`.
-- This migration uses the seeded id. The master plan table should be
-- corrected to match.
--
-- Weightage column sums to 100.0; avg_questions sums to 50 (CUET Section II
-- Mathematics paper = 50 questions, of which 40 are attempted).
-- ==========================================================================

BEGIN;

-- ── Guard: subject must exist before chapters can reference it ────────────

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM med_subjects WHERE id = 'mathematics') THEN
    RAISE EXCEPTION 'med_subjects row "mathematics" is missing — run the consolidated schema first';
  END IF;
END $$;


-- ── Step 1: 13 chapters ───────────────────────────────────────────────────

INSERT INTO med_chapters (id, subject_id, exam_ids, branch, name, chapter_number, class_level, weightage, avg_questions, important_topics) VALUES

-- Unit I: Relations and Functions
('cuet-math-relations-functions', 'mathematics', '{"CUET"}', 'Relations and Functions', 'Relations and Functions',            1, 12,  6.0, 3, '{"Reflexive symmetric transitive", "Equivalence relations", "One-one and onto functions", "Composition of functions", "Invertible functions"}'),
('cuet-math-inverse-trig',        'mathematics', '{"CUET"}', 'Relations and Functions', 'Inverse Trigonometric Functions',    2, 12,  5.0, 2, '{"Principal value branch", "Domain and range", "Properties of inverse trig functions", "Graphs of inverse trig functions"}'),

-- Unit II: Algebra
('cuet-math-matrices',            'mathematics', '{"CUET"}', 'Algebra',                 'Matrices',                           3, 12,  8.0, 4, '{"Order and types of matrices", "Matrix multiplication", "Transpose", "Symmetric and skew-symmetric", "Elementary row operations", "Inverse of a matrix"}'),
('cuet-math-determinants',        'mathematics', '{"CUET"}', 'Algebra',                 'Determinants',                       4, 12,  8.0, 4, '{"Properties of determinants", "Area of a triangle", "Minors and cofactors", "Adjoint and inverse", "Singular matrices", "System of linear equations"}'),

-- Unit III: Calculus
('cuet-math-continuity',          'mathematics', '{"CUET"}', 'Calculus',                'Continuity and Differentiability',    5, 12, 10.0, 5, '{"Continuity at a point", "Differentiability", "Chain rule", "Implicit differentiation", "Logarithmic differentiation", "Parametric form", "Second order derivatives"}'),
('cuet-math-derivatives-app',     'mathematics', '{"CUET"}', 'Calculus',                'Applications of Derivatives',         6, 12,  9.0, 4, '{"Rate of change", "Increasing and decreasing functions", "Tangents and normals", "Maxima and minima", "First and second derivative test"}'),
('cuet-math-integrals',           'mathematics', '{"CUET"}', 'Calculus',                'Integrals',                           7, 12, 12.0, 6, '{"Standard integrals", "Integration by substitution", "Partial fractions", "Integration by parts", "Definite integrals", "Properties of definite integrals", "Fundamental theorem of calculus"}'),
('cuet-math-integrals-app',       'mathematics', '{"CUET"}', 'Calculus',                'Applications of the Integrals',       8, 12,  5.0, 3, '{"Area under simple curves", "Area between two curves", "Area bounded by lines and circles", "Area bounded by parabolas and ellipses"}'),
('cuet-math-diff-equations',      'mathematics', '{"CUET"}', 'Calculus',                'Differential Equations',              9, 12,  8.0, 4, '{"Order and degree", "Formation of differential equations", "Variables separable", "Homogeneous differential equations", "Linear differential equations", "Integrating factor"}'),

-- Unit IV: Vectors and Three-Dimensional Geometry
('cuet-math-vectors',             'mathematics', '{"CUET"}', 'Vectors and 3-D Geometry','Vector Algebra',                     10, 12,  8.0, 4, '{"Types of vectors", "Direction cosines and ratios", "Addition of vectors", "Section formula", "Scalar dot product", "Projection", "Vector cross product"}'),
('cuet-math-3d-geometry',         'mathematics', '{"CUET"}', 'Vectors and 3-D Geometry','Three Dimensional Geometry',         11, 12,  8.0, 4, '{"Direction cosines of a line", "Equation of a line in space", "Angle between two lines", "Shortest distance between skew lines", "Equation of a plane"}'),

-- Unit V: Linear Programming
('cuet-math-linear-prog',         'mathematics', '{"CUET"}', 'Linear Programming',      'Linear Programming',                 12, 12,  5.0, 3, '{"Formulation of LPP", "Graphical method", "Feasible and infeasible region", "Bounded and unbounded solutions", "Optimal solution"}'),

-- Unit VI: Probability
('cuet-math-probability',         'mathematics', '{"CUET"}', 'Probability',             'Probability',                        13, 12,  8.0, 4, '{"Conditional probability", "Multiplication theorem", "Independent events", "Total probability", "Bayes theorem", "Random variables", "Mean and variance"}')

ON CONFLICT (id) DO UPDATE SET
  subject_id       = EXCLUDED.subject_id,
  exam_ids         = EXCLUDED.exam_ids,
  branch           = EXCLUDED.branch,
  name             = EXCLUDED.name,
  chapter_number   = EXCLUDED.chapter_number,
  class_level      = EXCLUDED.class_level,
  weightage        = EXCLUDED.weightage,
  avg_questions    = EXCLUDED.avg_questions,
  important_topics = EXCLUDED.important_topics;


-- ── Step 2: 65 topics ─────────────────────────────────────────────────────

INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES

  -- Ch 1: Relations and Functions (4 topics)
  ('cuet-math-rf-types-relations',    'cuet-math-relations-functions', 'Types of Relations: Reflexive, Symmetric, Transitive',      10, true,  true),
  ('cuet-math-rf-equivalence',        'cuet-math-relations-functions', 'Equivalence Relations and Equivalence Classes',             20, true,  true),
  ('cuet-math-rf-types-functions',    'cuet-math-relations-functions', 'Types of Functions: One-One, Onto and Bijective',           30, true,  true),
  ('cuet-math-rf-composition',        'cuet-math-relations-functions', 'Composition of Functions and Invertible Functions',         40, true,  true),

  -- Ch 2: Inverse Trigonometric Functions (4 topics)
  ('cuet-math-it-basics',             'cuet-math-inverse-trig', 'Inverse Trigonometric Functions: Definition and Notation',         10, true,  true),
  ('cuet-math-it-principal-value',    'cuet-math-inverse-trig', 'Domain, Range and Principal Value Branches',                       20, true,  true),
  ('cuet-math-it-properties',         'cuet-math-inverse-trig', 'Properties and Identities of Inverse Trigonometric Functions',     30, true,  true),
  ('cuet-math-it-graphs',             'cuet-math-inverse-trig', 'Graphs of Inverse Trigonometric Functions',                        40, false, true),

  -- Ch 3: Matrices (4 topics)
  ('cuet-math-mx-types-order',        'cuet-math-matrices', 'Order of a Matrix and Types of Matrices',                              10, true,  true),
  ('cuet-math-mx-operations',         'cuet-math-matrices', 'Addition, Scalar Multiplication and Matrix Multiplication',            20, true,  true),
  ('cuet-math-mx-transpose',          'cuet-math-matrices', 'Transpose, Symmetric and Skew-Symmetric Matrices',                     30, true,  true),
  ('cuet-math-mx-elementary-inverse', 'cuet-math-matrices', 'Elementary Row Operations and Inverse of a Matrix',                    40, true,  true),

  -- Ch 4: Determinants (6 topics)
  ('cuet-math-dt-evaluation',         'cuet-math-determinants', 'Determinant of a Square Matrix (2x2 and 3x3)',                     10, true,  true),
  ('cuet-math-dt-properties',         'cuet-math-determinants', 'Properties of Determinants',                                       20, true,  true),
  ('cuet-math-dt-area-triangle',      'cuet-math-determinants', 'Area of a Triangle Using Determinants',                            30, true,  true),
  ('cuet-math-dt-minors-cofactors',   'cuet-math-determinants', 'Minors, Cofactors and Cofactor Expansion',                         40, true,  true),
  ('cuet-math-dt-adjoint-inverse',    'cuet-math-determinants', 'Adjoint, Inverse and Singular Matrices',                           50, true,  true),
  ('cuet-math-dt-linear-equations',   'cuet-math-determinants', 'Solution of a System of Linear Equations by Matrix Method',        60, true,  true),

  -- Ch 5: Continuity and Differentiability (8 topics)
  ('cuet-math-cd-continuity',         'cuet-math-continuity', 'Continuity of a Function at a Point and on an Interval',             10, true,  true),
  ('cuet-math-cd-differentiability',  'cuet-math-continuity', 'Differentiability and its Relation with Continuity',                 20, true,  true),
  ('cuet-math-cd-chain-rule',         'cuet-math-continuity', 'Chain Rule and Derivatives of Composite Functions',                  30, true,  true),
  ('cuet-math-cd-implicit',           'cuet-math-continuity', 'Derivatives of Implicit Functions',                                  40, true,  true),
  ('cuet-math-cd-inverse-trig',       'cuet-math-continuity', 'Derivatives of Inverse Trigonometric Functions',                     50, true,  true),
  ('cuet-math-cd-exp-log',            'cuet-math-continuity', 'Derivatives of Exponential and Logarithmic Functions',               60, true,  true),
  ('cuet-math-cd-log-differentiation','cuet-math-continuity', 'Logarithmic Differentiation',                                        70, true,  true),
  ('cuet-math-cd-parametric-second',  'cuet-math-continuity', 'Parametric Form and Second Order Derivatives',                       80, true,  true),

  -- Ch 6: Applications of Derivatives (5 topics)
  ('cuet-math-ad-rate-of-change',     'cuet-math-derivatives-app', 'Rate of Change of Quantities',                                  10, true,  true),
  ('cuet-math-ad-increasing',         'cuet-math-derivatives-app', 'Increasing and Decreasing Functions',                           20, true,  true),
  ('cuet-math-ad-tangents-normals',   'cuet-math-derivatives-app', 'Tangents and Normals',                                          30, true,  true),
  ('cuet-math-ad-maxima-minima',      'cuet-math-derivatives-app', 'Maxima and Minima: First and Second Derivative Tests',          40, true,  true),
  ('cuet-math-ad-applied-problems',   'cuet-math-derivatives-app', 'Applied Maxima-Minima Problems',                                50, true,  true),

  -- Ch 7: Integrals (7 topics)
  ('cuet-math-in-standard',           'cuet-math-integrals', 'Integration as Inverse of Differentiation; Standard Integrals',       10, true,  true),
  ('cuet-math-in-substitution',       'cuet-math-integrals', 'Integration by Substitution',                                         20, true,  true),
  ('cuet-math-in-partial-fractions',  'cuet-math-integrals', 'Integration Using Partial Fractions',                                 30, true,  true),
  ('cuet-math-in-by-parts',           'cuet-math-integrals', 'Integration by Parts',                                                40, true,  true),
  ('cuet-math-in-special-forms',      'cuet-math-integrals', 'Integrals of Special Forms',                                          50, true,  true),
  ('cuet-math-in-definite',           'cuet-math-integrals', 'Definite Integrals and the Fundamental Theorem of Calculus',          60, true,  true),
  ('cuet-math-in-definite-properties','cuet-math-integrals', 'Properties of Definite Integrals',                                    70, true,  true),

  -- Ch 8: Applications of the Integrals (3 topics)
  ('cuet-math-ai-area-curves',        'cuet-math-integrals-app', 'Area Under Simple Curves',                                        10, true,  true),
  ('cuet-math-ai-area-between',       'cuet-math-integrals-app', 'Area Between Two Curves',                                         20, true,  true),
  ('cuet-math-ai-standard-regions',   'cuet-math-integrals-app', 'Area Bounded by Lines, Circles, Parabolas and Ellipses',          30, true,  true),

  -- Ch 9: Differential Equations (5 topics)
  ('cuet-math-de-order-degree',       'cuet-math-diff-equations', 'Order and Degree of a Differential Equation',                    10, true,  true),
  ('cuet-math-de-formation',          'cuet-math-diff-equations', 'Formation of a Differential Equation',                           20, true,  true),
  ('cuet-math-de-variables-separable','cuet-math-diff-equations', 'Solution by Variables Separable Method',                         30, true,  true),
  ('cuet-math-de-homogeneous',        'cuet-math-diff-equations', 'Homogeneous Differential Equations',                             40, true,  true),
  ('cuet-math-de-linear',             'cuet-math-diff-equations', 'Linear Differential Equations and Integrating Factor',           50, true,  true),

  -- Ch 10: Vector Algebra (5 topics)
  ('cuet-math-va-basics',             'cuet-math-vectors', 'Scalars, Vectors and Types of Vectors',                                 10, true,  true),
  ('cuet-math-va-components-dc',      'cuet-math-vectors', 'Components, Direction Cosines and Direction Ratios',                    20, true,  true),
  ('cuet-math-va-addition',           'cuet-math-vectors', 'Addition of Vectors and Section Formula',                               30, true,  true),
  ('cuet-math-va-dot-product',        'cuet-math-vectors', 'Scalar (Dot) Product and Projection of a Vector',                       40, true,  true),
  ('cuet-math-va-cross-product',      'cuet-math-vectors', 'Vector (Cross) Product and Area Applications',                          50, true,  true),

  -- Ch 11: Three Dimensional Geometry (5 topics)
  ('cuet-math-td-direction-cosines',  'cuet-math-3d-geometry', 'Direction Cosines and Direction Ratios of a Line',                  10, true,  true),
  ('cuet-math-td-line-equations',     'cuet-math-3d-geometry', 'Equation of a Line in Space: Vector and Cartesian Form',            20, true,  true),
  ('cuet-math-td-angle-lines',        'cuet-math-3d-geometry', 'Angle Between Two Lines',                                           30, true,  true),
  ('cuet-math-td-shortest-distance',  'cuet-math-3d-geometry', 'Shortest Distance Between Two Lines and Skew Lines',                40, true,  true),
  ('cuet-math-td-plane',              'cuet-math-3d-geometry', 'Equation of a Plane and Angle Between a Line and a Plane',          50, false, true),

  -- Ch 12: Linear Programming (3 topics)
  ('cuet-math-lp-formulation',        'cuet-math-linear-prog', 'Formulation of a Linear Programming Problem',                       10, true,  true),
  ('cuet-math-lp-graphical',          'cuet-math-linear-prog', 'Graphical Method and Feasible Region',                              20, true,  true),
  ('cuet-math-lp-optimal',            'cuet-math-linear-prog', 'Optimal Solutions: Bounded, Unbounded and Infeasible Cases',        30, true,  true),

  -- Ch 13: Probability (6 topics)
  ('cuet-math-pb-conditional',        'cuet-math-probability', 'Conditional Probability',                                           10, true,  true),
  ('cuet-math-pb-multiplication',     'cuet-math-probability', 'Multiplication Theorem on Probability',                             20, true,  true),
  ('cuet-math-pb-independent',        'cuet-math-probability', 'Independent Events',                                                30, true,  true),
  ('cuet-math-pb-bayes',              'cuet-math-probability', 'Total Probability and Bayes Theorem',                               40, true,  true),
  ('cuet-math-pb-random-variable',    'cuet-math-probability', 'Random Variables and Probability Distributions',                    50, true,  true),
  ('cuet-math-pb-mean-variance',      'cuet-math-probability', 'Mean and Variance of a Random Variable',                            60, true,  true)

ON CONFLICT (id) DO UPDATE SET
  chapter_id   = EXCLUDED.chapter_id,
  name         = EXCLUDED.name,
  sort_order   = EXCLUDED.sort_order,
  is_important = EXCLUDED.is_important,
  is_active    = EXCLUDED.is_active;


-- ── Step 3: Verification (review output before COMMIT) ────────────────────

-- Expect: 13 chapters, weightage 100.0, avg_questions 50
SELECT
  count(*)            AS chapter_count,
  sum(weightage)      AS total_weightage,
  sum(avg_questions)  AS total_avg_questions
FROM med_chapters
WHERE subject_id = 'mathematics';

-- Expect: 65 topics, every chapter represented
SELECT c.chapter_number, c.id AS chapter_id, count(t.id) AS topic_count
FROM med_chapters c
LEFT JOIN med_topics t ON t.chapter_id = c.id
WHERE c.subject_id = 'mathematics'
GROUP BY c.chapter_number, c.id
ORDER BY c.chapter_number;

COMMIT;
