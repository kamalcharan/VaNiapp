#!/usr/bin/env python3
"""Generate the 40-question JSON for B06: Development of Surfaces."""
import json, os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cuet-eg-development-b06.json")

def base(qid, qtype, diff, bloom, subtopic, tags):
    return {
        "id": qid,
        "chapter_id": "cuet-eg-engineering-graphics",
        "topic_id": "cuet-eg-development",
        "question_type": qtype,
        "difficulty": diff,
        "subject": "engineering-graphics",
        "chapter": "Engineering Graphics",
        "topic": "Development of Surfaces",
        "subtopic": subtopic,
        "bloom_level": bloom,
        "exam_suitability": ["CUET"],
        "concept_tags": tags,
    }

def opt(k, t, c=False):
    return {"key": k, "text": t, "is_correct": c}

def hint(k, h, m=None):
    return {"option_key": k, "hint": h, "misconception": m}

def mcq(qid, diff, bloom, subtopic, tags, text, opts, correct, explanation, hints):
    q = base(qid, "mcq", diff, bloom, subtopic, tags)
    q.update({
        "question_text": text,
        "correct_answer": correct,
        "explanation": explanation,
        "options": opts,
        "elimination_hints": hints,
    })
    return q

def ar_q(qid, diff, bloom, subtopic, tags, assertion, reason, correct, explanation, hints_list):
    q = base(qid, "assertion-reasoning", diff, bloom, subtopic, tags)
    ar_opts = [
        opt("A", "Both A and R are true and R is the correct explanation of A"),
        opt("B", "Both A and R are true but R is NOT the correct explanation of A"),
        opt("C", "A is true but R is false"),
        opt("D", "A is false but R is true"),
    ]
    for o in ar_opts:
        if o["key"] == correct:
            o["is_correct"] = True
    q.update({
        "question_text": f"Assertion (A): {assertion}\nReason (R): {reason}",
        "assertion": assertion,
        "reason": reason,
        "correct_answer": correct,
        "explanation": explanation,
        "options": ar_opts,
        "elimination_hints": hints_list,
    })
    return q

def tf_q(qid, diff, subtopic, tags, text, correct_bool, explanation, hints_list):
    q = base(qid, "true-false", diff, "remember", subtopic, tags)
    q.update({
        "question_text": text,
        "correct_answer": "A" if correct_bool else "B",
        "explanation": explanation,
        "options": [
            opt("A", "True", correct_bool),
            opt("B", "False", not correct_bool),
            opt("C", "---"),
            opt("D", "---"),
        ],
        "elimination_hints": hints_list,
    })
    return q

questions = []

# ═══════════════════════════════════════════════════════════════════════════════
# MCQ — EASY (5): cuet-eg-development-01 to 05
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(mcq(
    "cuet-eg-development-01", "easy", "remember", "Development Definition",
    ["development", "definition"],
    "The development of a solid is:",
    [opt("A", "A 3D model of the solid"),
     opt("B", "The unfolded or unrolled lateral surface of the solid laid flat on a plane", True),
     opt("C", "A sectional view of the solid"),
     opt("D", "An isometric drawing of the solid")],
    "B",
    "Development is the process of unfolding or unrolling the lateral (side) surface of a solid onto a flat plane. The resulting flat shape, when folded back, recreates the solid's lateral surface.",
    [hint("A", "A 3D model is a physical or digital representation, not a development. Development produces a 2D flat pattern.", "Confusing 3D model with 2D development"),
     hint("C", "A sectional view shows the interior of a cut solid. Development shows the unfolded surface.", "Confusing section with development"),
     hint("D", "An isometric drawing is a pictorial 3D representation. Development is a flat 2D pattern.", "Confusing isometric with development")]
))

questions.append(mcq(
    "cuet-eg-development-02", "easy", "remember", "Cylinder Development Shape",
    ["cylinder", "development-shape"],
    "The development of the lateral surface of a right circular cylinder is a:",
    [opt("A", "Circle"),
     opt("B", "Sector of a circle"),
     opt("C", "Rectangle", True),
     opt("D", "Triangle")],
    "C",
    "When a cylinder's lateral surface is unrolled, it forms a rectangle. The width equals the circumference (πd) and the height equals the cylinder's height.",
    [hint("A", "A circle is the cross-section (base) of the cylinder, not the development of its lateral surface.", "Confusing base with lateral surface"),
     hint("B", "A sector is the development of a cone, not a cylinder.", "Confusing cone development with cylinder"),
     hint("D", "A triangle is a face of a pyramid development. A cylinder unrolls into a rectangle.", "Confusing pyramid face with cylinder development")]
))

questions.append(mcq(
    "cuet-eg-development-03", "easy", "remember", "Cone Development Shape",
    ["cone", "development-shape"],
    "The development of the lateral surface of a right circular cone is a:",
    [opt("A", "Rectangle"),
     opt("B", "Triangle"),
     opt("C", "Circle"),
     opt("D", "Sector of a circle", True)],
    "D",
    "A cone's lateral surface unrolls into a sector of a circle. The radius of the sector = slant height of the cone, and the arc length = base circumference (2πr).",
    [hint("A", "A rectangle is the development of a cylinder, not a cone.", "Confusing cylinder with cone development"),
     hint("B", "A triangle is a face of a pyramid. The cone's curved surface develops into a sector, not a triangle.", "Confusing pyramid face with cone development"),
     hint("C", "A full circle would mean the arc = full circumference of the sector circle (2πl). The cone development is only a part (sector) of this circle.", "Using full circle instead of sector")]
))

questions.append(mcq(
    "cuet-eg-development-04", "easy", "remember", "Prism Development",
    ["prism", "development-shape"],
    "The development of the lateral surface of a right prism consists of:",
    [opt("A", "A series of connected rectangles", True),
     opt("B", "A series of connected triangles"),
     opt("C", "A single large circle"),
     opt("D", "A single sector")],
    "A",
    "A right prism has rectangular lateral faces. When unfolded, these form a series of connected rectangles, each with height equal to the prism height and width equal to the corresponding base edge length.",
    [hint("B", "Connected triangles form the development of a pyramid, not a prism.", "Confusing pyramid with prism development"),
     hint("C", "A circle is the development cross-section of nothing standard. Cylinders give rectangles, cones give sectors.", "No standard solid gives a circle as development"),
     hint("D", "A sector is the development of a cone. Prisms give connected rectangles.", "Confusing cone with prism development")]
))

questions.append(mcq(
    "cuet-eg-development-05", "easy", "remember", "Stretch-Out Line",
    ["stretch-out", "definition"],
    "In the development of a prism, the 'stretch-out line' represents:",
    [opt("A", "The height of the prism"),
     opt("B", "The diagonal of a face"),
     opt("C", "The perimeter of the base, laid out as a straight line", True),
     opt("D", "The slant height of the prism")],
    "C",
    "The stretch-out line is a horizontal line whose total length equals the perimeter of the prism's base. Each base edge is marked along this line, and perpendiculars are drawn at each point to construct the development.",
    [hint("A", "The height of the prism is the vertical dimension of each rectangular face, not the horizontal stretch-out line.", "Confusing vertical height with horizontal stretch-out"),
     hint("B", "The diagonal is a measurement within a single face, not a layout of the entire perimeter.", "Confusing face diagonal with perimeter layout"),
     hint("D", "Slant height applies to pyramids and cones. For a right prism, the lateral edge height is perpendicular, not slanted.", "Applying pyramid terminology to prism")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# MCQ — MEDIUM (10): cuet-eg-development-06 to 15
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(mcq(
    "cuet-eg-development-06", "medium", "understand", "Cylinder Development Dimensions",
    ["cylinder", "dimensions"],
    "A right circular cylinder has a diameter of 50 mm and height of 70 mm. The dimensions of its development (lateral surface) are:",
    [opt("A", "50 mm × 70 mm"),
     opt("B", "157.08 mm × 70 mm", True),
     opt("C", "100 mm × 70 mm"),
     opt("D", "157.08 mm × 50 mm")],
    "B",
    "Development is a rectangle: width = πd = π × 50 = 157.08 mm, height = cylinder height = 70 mm. So the development is 157.08 mm × 70 mm.",
    [hint("A", "50 mm is the diameter, not the width of the development. The width = circumference = πd = 157.08 mm.", "Using diameter instead of circumference"),
     hint("C", "100 mm = 2 × diameter. The circumference is πd ≈ 157.08 mm, not 2d.", "Using 2d instead of πd"),
     hint("D", "The height of the development = cylinder height = 70 mm, not the diameter (50 mm). The width = πd.", "Swapping height and diameter")]
))

questions.append(mcq(
    "cuet-eg-development-07", "medium", "apply", "Cone Sector Angle",
    ["cone", "sector-angle"],
    "A right circular cone has a base radius of 20 mm and slant height of 50 mm. The sector angle of its development is:",
    [opt("A", "72°"),
     opt("B", "360°"),
     opt("C", "144°", True),
     opt("D", "180°")],
    "C",
    "Sector angle θ = (r/l) × 360° = (20/50) × 360° = 0.4 × 360° = 144°. The development is a sector of radius 50 mm with arc subtending 144° at the center.",
    [hint("A", "72° = (r/l) × 180° uses 180° instead of 360°. The formula uses the full circle: θ = (r/l) × 360°.", "Halving the formula"),
     hint("B", "360° would mean the development is a full circle, which occurs only when r = l (impossible for a cone).", "Confusing full circle with sector"),
     hint("D", "180° = (r/l) × 360° would require r/l = 0.5, i.e., r = 25 mm. Here r = 20 mm.", "Incorrect calculation")]
))

questions.append(mcq(
    "cuet-eg-development-08", "medium", "understand", "Pyramid Development Faces",
    ["pyramid", "triangular-faces"],
    "The development of a regular hexagonal pyramid consists of:",
    [opt("A", "6 equal rectangles"),
     opt("B", "A single sector of a circle"),
     opt("C", "3 equal isosceles triangles"),
     opt("D", "6 equal isosceles triangles arranged around the apex", True)],
    "D",
    "A regular hexagonal pyramid has 6 equal triangular faces. In the development, these 6 isosceles triangles are arranged side by side, all sharing the apex point, with their bases forming the perimeter of the hexagonal base.",
    [hint("A", "Rectangles form the development of a prism, not a pyramid. Pyramid faces are triangles.", "Confusing prism with pyramid development"),
     hint("B", "A sector is the development of a cone (curved surface). A pyramid has flat triangular faces.", "Confusing cone with pyramid development"),
     hint("C", "A hexagonal pyramid has 6 triangular faces, not 3. All 6 must appear in the development.", "Halving the number of faces")]
))

questions.append(mcq(
    "cuet-eg-development-09", "medium", "apply", "Sphere Development",
    ["sphere", "approximate-development"],
    "The exact development of a sphere is:",
    [opt("A", "A circle"),
     opt("B", "A rectangle"),
     opt("C", "Not possible — only approximate methods exist", True),
     opt("D", "A sector of a circle")],
    "C",
    "A sphere is a doubly-curved surface and cannot be developed exactly into a flat surface without distortion. Only approximate methods exist, such as the gore method (lune strips) or zone method.",
    [hint("A", "A circle is the cross-section of a sphere, not its development.", "Confusing cross-section with development"),
     hint("B", "A rectangle is the development of a cylinder. A sphere cannot be developed into any exact flat shape.", "Applying cylinder development to sphere"),
     hint("D", "A sector is the development of a cone. A sphere requires approximate methods, not an exact sector.", "Applying cone development to sphere")]
))

questions.append(mcq(
    "cuet-eg-development-10", "medium", "understand", "Parallel Line Method",
    ["parallel-line", "method"],
    "The parallel line method of development is used for solids that have:",
    [opt("A", "All lateral edges converging to a point (apex)"),
     opt("B", "Parallel lateral edges or elements (like prisms and cylinders)", True),
     opt("C", "Curved surfaces that are doubly curved"),
     opt("D", "Only triangular faces")],
    "B",
    "The parallel line method applies to solids with parallel lateral elements — prisms (parallel lateral edges) and cylinders (parallel generators). The stretch-out line represents the base perimeter, and parallel lines of equal height are drawn.",
    [hint("A", "Edges converging to an apex describes pyramids and cones. These use the radial line method, not parallel line.", "Confusing radial with parallel line method"),
     hint("C", "Doubly curved surfaces (like spheres) cannot be developed exactly. They need approximate methods, not the parallel line method.", "Applying parallel line to non-developable surfaces"),
     hint("D", "Triangular faces are found on pyramids. The parallel line method applies to prisms and cylinders, regardless of face shape.", "Confusing face shape with method selection")]
))

questions.append(mcq(
    "cuet-eg-development-11", "medium", "understand", "Radial Line Method",
    ["radial-line", "method"],
    "The radial line method of development is used for:",
    [opt("A", "Prisms and cylinders"),
     opt("B", "Spheres and tori"),
     opt("C", "Pyramids and cones", True),
     opt("D", "Only right prisms")],
    "C",
    "The radial line method is used for solids where all surface lines (edges or generators) converge to a single apex — pyramids and cones. Lines radiate from the apex, and true lengths are used to construct the development.",
    [hint("A", "Prisms and cylinders use the parallel line method, not radial line.", "Confusing the two development methods"),
     hint("B", "Spheres and tori are doubly curved and cannot be developed exactly by any standard method.", "Applying development to non-developable surfaces"),
     hint("D", "Right prisms use the parallel line method. The radial line method applies to pyramids and cones.", "Wrong solid type for radial method")]
))

questions.append(mcq(
    "cuet-eg-development-12", "medium", "apply", "Truncated Cone Development",
    ["cone", "truncated-development"],
    "The development of a truncated cone (frustum) is:",
    [opt("A", "A full sector of a circle"),
     opt("B", "A rectangle"),
     opt("C", "A sector of an annulus (ring sector)", True),
     opt("D", "A triangle")],
    "C",
    "A frustum is obtained by removing a smaller cone from a larger one. Its development is the difference between the full cone's sector and the removed cone's sector — resulting in a sector of an annulus (the area between two concentric arcs).",
    [hint("A", "A full sector is the development of a complete cone. A frustum's development has the inner cone portion removed.", "Ignoring the removed top cone"),
     hint("B", "A rectangle is the development of a cylinder. A frustum (truncated cone) has a curved surface that develops into an annular sector.", "Confusing cylinder with frustum"),
     hint("D", "A triangle is a face of a pyramid development. A frustum has a curved surface.", "Confusing pyramid with frustum")]
))

questions.append(mcq(
    "cuet-eg-development-13", "medium", "apply", "Hexagonal Prism Stretch-Out",
    ["prism", "stretch-out-length"],
    "A regular hexagonal prism has a base side of 25 mm. The total length of its stretch-out line is:",
    [opt("A", "75 mm"),
     opt("B", "125 mm"),
     opt("C", "150 mm", True),
     opt("D", "50 mm")],
    "C",
    "Stretch-out length = perimeter of base = 6 × side = 6 × 25 = 150 mm. A regular hexagon has 6 equal sides.",
    [hint("A", "75 mm = 3 × 25. A hexagon has 6 sides, not 3.", "Using half the number of sides"),
     hint("B", "125 mm = 5 × 25. A hexagon has 6 sides, not 5.", "Using wrong number of sides"),
     hint("D", "50 mm = 2 × 25. A hexagon has 6 sides, not 2.", "Using too few sides")]
))

questions.append(mcq(
    "cuet-eg-development-14", "medium", "apply", "True Length for Development",
    ["true-length", "development-requirement"],
    "When developing the surface of an oblique prism, the lateral edges in the front view or top view may not show their true lengths. To find true lengths, one must:",
    [opt("A", "Use the front view dimensions directly"),
     opt("B", "Measure from the top view only"),
     opt("C", "Construct a true length diagram or use the right section method", True),
     opt("D", "Assume all edges are equal")],
    "C",
    "In an oblique prism, lateral edges are inclined to both HP and VP, so neither view shows their true lengths. A true length diagram (using horizontal and vertical components) or the right section method must be used.",
    [hint("A", "Front view shows projected lengths, not true lengths for inclined edges. Projections are foreshortened.", "Using projected lengths as true lengths"),
     hint("B", "Top view also shows projected lengths. Neither standard view guarantees true lengths for oblique edges.", "Using projected lengths from top view"),
     hint("D", "In an oblique prism, lateral edges may be equal but their projections are foreshortened. True lengths must still be determined.", "Assuming projections equal true lengths")]
))

questions.append(mcq(
    "cuet-eg-development-15", "medium", "understand", "Developable vs Non-Developable",
    ["developable", "surface-types"],
    "Which of the following surfaces is NOT developable?",
    [opt("A", "Right circular cylinder"),
     opt("B", "Right circular cone"),
     opt("C", "Sphere", True),
     opt("D", "Triangular prism")],
    "C",
    "A sphere is a doubly curved surface and cannot be developed (unrolled flat) without stretching or tearing. Cylinders, cones, and prisms are singly curved or flat-faced and are developable.",
    [hint("A", "A cylinder is a singly curved surface. It can be perfectly unrolled into a rectangle.", "Thinking cylinders are non-developable"),
     hint("B", "A cone is a singly curved surface. It can be unrolled into a sector.", "Thinking cones are non-developable"),
     hint("D", "A prism has flat faces. It can be unfolded by laying each face flat.", "Thinking prisms are non-developable")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# MCQ — HARD (5): cuet-eg-development-16 to 20
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(mcq(
    "cuet-eg-development-16", "hard", "apply", "Cone Arc Length Calculation",
    ["cone", "arc-length"],
    "A right circular cone has base diameter 80 mm and height 60 mm. The arc length of its development sector is:",
    [opt("A", "188.5 mm"),
     opt("B", "251.33 mm", True),
     opt("C", "125.66 mm"),
     opt("D", "314.16 mm")],
    "B",
    "Arc length of the sector = circumference of the base circle = πd = π × 80 = 251.33 mm. The slant height determines the sector radius, but the arc length always equals the base circumference.",
    [hint("A", "188.5 mm = π × 60. The arc length uses the base diameter (80 mm), not the height (60 mm).", "Using height instead of diameter"),
     hint("C", "125.66 mm = π × 40 = πr. The arc length equals πd (full circumference), not πr.", "Using radius instead of diameter"),
     hint("D", "314.16 mm = π × 100 = π × (80+20?). This doesn't correspond to any standard formula for this cone.", "Incorrect calculation")]
))

questions.append(mcq(
    "cuet-eg-development-17", "hard", "apply", "Frustum Development Radii",
    ["frustum", "development-dimensions"],
    "A frustum of a cone has a base diameter of 60 mm, top diameter of 30 mm, and slant height of 40 mm. For its development (annular sector), the two radii are:",
    [opt("A", "R = 80 mm, r = 40 mm", True),
     opt("B", "R = 40 mm, r = 20 mm"),
     opt("C", "R = 60 mm, r = 30 mm"),
     opt("D", "R = 120 mm, r = 60 mm")],
    "A",
    "The complete cone can be found by extending the frustum. By similar triangles: the top diameter is half the base diameter, so the removed cone height = slant height of frustum = 40 mm. Total slant height of full cone = 40 + 40 = 80 mm. So R (outer radius) = 80 mm, r (inner radius) = 40 mm.",
    [hint("B", "R = 40 mm is the frustum's slant height, not the full cone's slant height. The full cone's slant height is found by extending to the apex.", "Using frustum slant height as sector radius"),
     hint("C", "60 mm and 30 mm are the diameters, not the sector radii. Development radii are based on slant heights.", "Confusing base diameters with sector radii"),
     hint("D", "120 mm and 60 mm are too large. The correct ratio should match the diameter ratio (2:1), and R = 80 mm.", "Incorrect scaling")]
))

questions.append(mcq(
    "cuet-eg-development-18", "hard", "analyze", "Oblique Cylinder Development",
    ["oblique-cylinder", "development"],
    "The development of an oblique cylinder using the parallel line method differs from a right cylinder because:",
    [opt("A", "The stretch-out line is curved instead of straight"),
     opt("B", "The top and bottom edges of the development are not straight lines but curves", True),
     opt("C", "The development is a sector instead of a rectangle"),
     opt("D", "It cannot be developed at all")],
    "B",
    "For an oblique cylinder, the stretch-out line (base circumference) is still straight, but the top and bottom edges become sinusoidal curves because the generators have different lengths at different positions around the circumference.",
    [hint("A", "The stretch-out line remains straight (it's just the base circumference laid out). The curves appear at the top and bottom.", "Confusing which edges become curved"),
     hint("C", "A sector is for cones. Both right and oblique cylinders use the parallel line method, producing rectangle-like shapes (with curved edges for oblique).", "Applying cone development to oblique cylinder"),
     hint("D", "An oblique cylinder has a singly curved surface and is fully developable. Only doubly curved surfaces are non-developable.", "Claiming non-developability")]
))

questions.append(mcq(
    "cuet-eg-development-19", "hard", "evaluate", "Development Application",
    ["sheet-metal", "application"],
    "In sheet metal work, the development of a transition piece connecting a circular duct to a rectangular duct requires:",
    [opt("A", "Only the parallel line method"),
     opt("B", "Only the radial line method"),
     opt("C", "Triangulation method", True),
     opt("D", "No development is possible")],
    "C",
    "Transition pieces connecting different cross-sections (circular to rectangular) have surfaces that are neither purely parallel-element nor purely radial. The triangulation method divides the surface into small triangles and develops each, providing an approximate development.",
    [hint("A", "The parallel line method works for prisms/cylinders. A transition piece has non-parallel, non-uniform surface elements.", "Applying parallel method to non-parallel surface"),
     hint("B", "The radial line method works for cones/pyramids. A transition piece doesn't converge to an apex.", "Applying radial method to non-conical surface"),
     hint("D", "Development is possible through triangulation. While not exact for curved portions, it provides a practical working pattern.", "Assuming non-developability")]
))

questions.append(mcq(
    "cuet-eg-development-20", "hard", "analyze", "Pyramid Slant Edge True Length",
    ["pyramid", "true-length"],
    "In the development of an oblique pentagonal pyramid, the critical step that distinguishes it from a right pyramid is:",
    [opt("A", "No development is possible for oblique pyramids"),
     opt("B", "All slant edges are of different lengths and each must be found separately", True),
     opt("C", "The base edges have different lengths"),
     opt("D", "The apex angle is always 360°")],
    "B",
    "In a right pyramid, all slant edges are equal (apex is directly above the base center). In an oblique pyramid, the apex is off-center, so each slant edge has a different length. Each must be found using the true length method before the development can be drawn.",
    [hint("A", "Oblique pyramids are developable since they have flat faces. Each triangular face can be developed using its true edge lengths.", "Assuming non-developability for oblique solids"),
     hint("C", "The base of a regular pentagonal pyramid has equal edges whether right or oblique. The difference is in the slant edges.", "Confusing base edges with slant edges"),
     hint("D", "The total angle around the apex in the development is less than 360° for any proper pyramid. It equals 360° only if the surface forms a flat plane.", "Incorrect apex angle assumption")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# DIAGRAM-BASED (4): cuet-eg-development-21 to 24
# ═══════════════════════════════════════════════════════════════════════════════

q21 = base("cuet-eg-development-21", "diagram-based", "easy", "apply", "Cylinder Development ID", ["cylinder", "development-id"])
q21.update({
    "question_text": "From the figure showing a cylinder and its development, what is the width of the development rectangle?",
    "correct_answer": "D",
    "explanation": "The diagram clearly shows that the width (horizontal dimension) of the development rectangle equals πd = 2πr, which is the circumference of the cylinder's base circle. The height equals the cylinder height h.",
    "image_uri": "question-images/engineering-graphics/solids/cuet-eg-development-61-cylinder.png",
    "image_alt": "Right circular cylinder (radius r, height h) and its development: a rectangle with width = πd = 2πr and height = h.",
    "options": [
        opt("A", "The diameter of the cylinder (d)"),
        opt("B", "The radius of the cylinder (r)"),
        opt("C", "The height of the cylinder (h)"),
        opt("D", "The circumference of the base (πd = 2πr)", True),
    ],
    "elimination_hints": [
        hint("A", "The diameter is much smaller than the circumference. Width = πd ≈ 3.14d, not just d.", "Confusing diameter with circumference"),
        hint("B", "The radius is half the diameter. The width = πd = 2πr, which is much larger than r alone.", "Using radius instead of circumference"),
        hint("C", "The height h is the vertical dimension of the development, not the horizontal width.", "Confusing height with width"),
    ]
})
questions.append(q21)

q22 = base("cuet-eg-development-22", "diagram-based", "medium", "analyze", "Cone Sector Properties", ["cone", "sector-analysis"])
q22.update({
    "question_text": "From the figure showing a cone and its development, the sector radius equals:",
    "correct_answer": "A",
    "explanation": "The diagram shows that the sector radius = slant height (l) of the cone. This is because when the cone's surface is unrolled, each generator (from apex to base) becomes a radius of the sector.",
    "image_uri": "question-images/engineering-graphics/solids/cuet-eg-development-62-cone.png",
    "image_alt": "Right circular cone (radius r, height h, slant height l) and its development: a sector of a circle with radius l, arc length 2πr, and sector angle θ = (r/l) × 360°.",
    "options": [
        opt("A", "The slant height (l) of the cone", True),
        opt("B", "The height (h) of the cone"),
        opt("C", "The base radius (r) of the cone"),
        opt("D", "The base diameter (2r) of the cone"),
    ],
    "elimination_hints": [
        hint("B", "The height h is the vertical distance from base to apex. The sector radius is the slant distance (l), which is longer than h.", "Confusing height with slant height"),
        hint("C", "The base radius r determines the arc length, not the sector radius. Sector radius = slant height.", "Confusing base radius with sector radius"),
        hint("D", "The diameter 2r determines the arc length (circumference = πd = 2πr). The sector radius = slant height l.", "Confusing diameter with sector radius"),
    ]
})
questions.append(q22)

q23 = base("cuet-eg-development-23", "diagram-based", "easy", "apply", "Prism Development Structure", ["prism", "development-structure"])
q23.update({
    "question_text": "From the figure showing a triangular prism and its development, the development consists of how many rectangular faces?",
    "correct_answer": "B",
    "explanation": "The diagram shows 3 rectangular faces (Face 1, Face 2, Face 3) laid out side by side. A triangular prism has 3 lateral faces, each rectangular, plus 2 triangular end faces (not shown in lateral development).",
    "image_uri": "question-images/engineering-graphics/solids/cuet-eg-development-63-prism.png",
    "image_alt": "Equilateral triangular prism and its development: 3 connected rectangles labeled Face 1, 2, 3, with stretch-out = 3a (perimeter).",
    "options": [
        opt("A", "2"),
        opt("B", "3", True),
        opt("C", "4"),
        opt("D", "6")],
    "elimination_hints": [
        hint("A", "2 faces would be for a prism with 2 lateral faces, which doesn't exist. A triangular prism has 3 lateral faces.", "Undercounting faces"),
        hint("C", "4 lateral faces belong to a square (quadrilateral) prism, not a triangular prism.", "Using wrong prism type"),
        hint("D", "6 faces belong to a hexagonal prism. The triangular prism shown has only 3 lateral faces.", "Using wrong prism type"),
    ]
})
questions.append(q23)

q24 = base("cuet-eg-development-24", "diagram-based", "hard", "evaluate", "Pyramid Development Analysis", ["pyramid", "development-analysis"])
q24.update({
    "question_text": "From the figure showing a square pyramid and its development, each triangular face in the development has two equal sides. These equal sides represent:",
    "correct_answer": "D",
    "explanation": "In a right square pyramid, all slant edges (from apex to base corners) are equal. In the development, each triangular face has two sides equal to the slant edge and a base equal to one side of the square base. The equal sides are the slant edges.",
    "image_uri": "question-images/engineering-graphics/solids/cuet-eg-development-64-pyramid.png",
    "image_alt": "Square pyramid and its development: 4 isosceles triangles radiating from apex O, each with two equal sides = slant edge and base = side of square.",
    "options": [
        opt("A", "The height of the pyramid"),
        opt("B", "The base side of the pyramid"),
        opt("C", "The slant height of a triangular face"),
        opt("D", "The slant edge (apex to base corner)", True),
    ],
    "elimination_hints": [
        hint("A", "The pyramid height is the vertical distance from base to apex, which is shorter than the slant edge and doesn't appear directly in the development.", "Confusing height with slant edge"),
        hint("B", "The base side is the third (unequal) side of each isosceles triangle, not the two equal sides.", "Confusing base with slant edges"),
        hint("C", "The slant height goes from the apex to the midpoint of a base edge (face height). The two equal sides go from apex to base corners (slant edges), which are longer.", "Confusing slant height with slant edge"),
    ]
})
questions.append(q24)

# ═══════════════════════════════════════════════════════════════════════════════
# ASSERTION-REASONING (4): cuet-eg-development-25 to 28
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(ar_q(
    "cuet-eg-development-25", "medium", "understand", "Development Uses True Lengths",
    ["true-length", "development-principle"],
    "All edges in a development must be drawn using their true lengths.",
    "A development represents the actual surface of the solid laid flat, so every dimension must correspond to the real measurement on the solid.",
    "A",
    "Both A and R are true, and R correctly explains A. A development is a 1:1 mapping of the solid surface onto a flat plane. If projected lengths (foreshortened) were used, the development would not fold back to the correct shape.",
    [hint("B", "R directly explains A — the need for true lengths comes from the development being a real-size flat representation.", "Not seeing the causal connection"),
     hint("C", "R is true — the development must preserve actual surface dimensions for practical use (sheet metal cutting, etc.).", "Rejecting correct reasoning"),
     hint("D", "A is true — using projected lengths instead of true lengths would produce an incorrect pattern that doesn't fold properly.", "Rejecting a fundamental development principle")]
))

questions.append(ar_q(
    "cuet-eg-development-26", "medium", "understand", "Cone Sector Radius",
    ["cone", "sector-radius"],
    "The radius of the sector in the development of a cone equals the slant height of the cone.",
    "Each generator of the cone has a length equal to the slant height, and generators become radii in the unrolled sector.",
    "A",
    "Both are true and R correctly explains A. When the cone surface is unrolled, each straight line from apex to base (generator) becomes a straight line from center to arc (radius) in the sector. Generator length = slant height = sector radius.",
    [hint("B", "R directly explains A — generators becoming radii is exactly why the sector radius equals the slant height.", "Not connecting generators with radii"),
     hint("C", "R is true — generators do become radii during unrolling, and their length is preserved.", "Rejecting correct geometric explanation"),
     hint("D", "A is true — this is the fundamental principle of cone development.", "Rejecting a well-known fact")]
))

questions.append(ar_q(
    "cuet-eg-development-27", "hard", "analyze", "Sphere Approximate Development",
    ["sphere", "non-developable"],
    "A sphere can be exactly developed into a flat surface using the gore method.",
    "The gore method divides the sphere into orange-peel-like strips that approximate the surface.",
    "D",
    "A is false — the gore method provides only an APPROXIMATE development, not an exact one. A sphere is doubly curved and mathematically cannot be developed exactly. R is true — it correctly describes what the gore method does. So A is false, R is true.",
    [hint("A", "The assertion says 'exactly' developed, which is false. The gore method is approximate, not exact.", "Confusing approximate with exact development"),
     hint("B", "A is false (sphere development is never exact). Both cannot be true.", "Accepting the false assertion"),
     hint("C", "R is true — the gore method does use orange-peel-like strips for approximation.", "Rejecting the correct description of the gore method")]
))

questions.append(ar_q(
    "cuet-eg-development-28", "hard", "analyze", "Right Section Method",
    ["right-section", "oblique-prism"],
    "The right section method is preferred for developing oblique prisms because the right section is perpendicular to the lateral edges.",
    "When the section is perpendicular to the lateral edges, the stretch-out line length equals the perimeter of the right section, and all edges become perpendicular to this line.",
    "A",
    "Both are true and R correctly explains A. The right section (perpendicular to lateral edges) gives edges that project at right angles to the stretch-out line, simplifying the layout. The stretch-out = right section perimeter.",
    [hint("B", "R directly explains A — the perpendicularity simplifies the development construction.", "Not seeing the causal relationship"),
     hint("C", "R is true — the right section's perpendicularity to edges is what makes the method work efficiently.", "Rejecting the correct geometric principle"),
     hint("D", "A is true — the right section method is indeed preferred for oblique prisms due to its simplicity.", "Rejecting standard engineering practice")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# MATCH-THE-FOLLOWING (2): cuet-eg-development-29 to 30
# ═══════════════════════════════════════════════════════════════════════════════

q29 = base("cuet-eg-development-29", "match-the-following", "medium", "understand", "Solids and Development Shapes", ["solid-development", "shape-matching"])
q29.update({
    "question_text": "Match the solid with its lateral surface development:\n\nColumn A: (P) Right circular cylinder, (Q) Right circular cone, (R) Square prism, (S) Frustum of a cone\nColumn B: (1) Annular sector, (2) Sector of a circle, (3) Rectangle, (4) Four connected rectangles",
    "correct_answer": "D",
    "explanation": "Cylinder → Rectangle (P-3). Cone → Sector (Q-2). Square prism → 4 connected rectangles (R-4). Frustum → Annular sector (S-1).",
    "column_a": ["Right circular cylinder", "Right circular cone", "Square prism", "Frustum of a cone"],
    "column_b": ["Annular sector", "Sector of a circle", "Rectangle", "Four connected rectangles"],
    "correct_mapping": {"Right circular cylinder": "Rectangle", "Right circular cone": "Sector of a circle", "Square prism": "Four connected rectangles", "Frustum of a cone": "Annular sector"},
    "options": [
        opt("A", "P-2, Q-3, R-4, S-1"),
        opt("B", "P-3, Q-2, R-1, S-4"),
        opt("C", "P-3, Q-1, R-4, S-2"),
        opt("D", "P-3, Q-2, R-4, S-1", True),
    ],
    "elimination_hints": [
        hint("A", "P-2 gives cylinder a sector. A cylinder unrolls into a rectangle, not a sector. Sectors are for cones.", "Swapping cylinder and cone developments"),
        hint("B", "R-1 gives square prism an annular sector. Prisms unfold into connected rectangles. Annular sectors are for frustums.", "Swapping prism and frustum developments"),
        hint("C", "Q-1 gives cone an annular sector. A full cone gives a sector (not annular). Annular sectors are for frustums.", "Confusing cone with frustum development"),
    ]
})
questions.append(q29)

q30 = base("cuet-eg-development-30", "match-the-following", "hard", "analyze", "Development Methods", ["development-methods", "method-matching"])
q30.update({
    "question_text": "Match the development method with the solid it is primarily used for:\n\nColumn A: (P) Parallel line method, (Q) Radial line method, (R) Triangulation method, (S) Approximate method (gore/zone)\nColumn B: (1) Sphere, (2) Transition pieces (circular to rectangular), (3) Prisms and cylinders, (4) Pyramids and cones",
    "correct_answer": "B",
    "explanation": "Parallel line → Prisms & cylinders (P-3). Radial line → Pyramids & cones (Q-4). Triangulation → Transition pieces (R-2). Approximate → Sphere (S-1).",
    "column_a": ["Parallel line method", "Radial line method", "Triangulation method", "Approximate method"],
    "column_b": ["Sphere", "Transition pieces", "Prisms and cylinders", "Pyramids and cones"],
    "correct_mapping": {"Parallel line method": "Prisms and cylinders", "Radial line method": "Pyramids and cones", "Triangulation method": "Transition pieces", "Approximate method": "Sphere"},
    "options": [
        opt("A", "P-4, Q-3, R-2, S-1"),
        opt("B", "P-3, Q-4, R-2, S-1", True),
        opt("C", "P-3, Q-4, R-1, S-2"),
        opt("D", "P-2, Q-4, R-3, S-1"),
    ],
    "elimination_hints": [
        hint("A", "P-4 gives parallel line to pyramids/cones. Parallel lines are for prisms/cylinders. Pyramids/cones use radial lines.", "Swapping parallel and radial methods"),
        hint("C", "R-1 gives triangulation to sphere. Spheres need approximate (gore/zone) methods. Triangulation is for transition pieces.", "Swapping triangulation and approximate methods"),
        hint("D", "P-2 gives parallel line to transition pieces. Parallel lines are for prisms/cylinders. Transition pieces use triangulation.", "Assigning wrong solid to parallel line method"),
    ]
})
questions.append(q30)

# ═══════════════════════════════════════════════════════════════════════════════
# TRUE-FALSE (4): cuet-eg-development-31 to 34
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(tf_q(
    "cuet-eg-development-31", "easy", "Development Preserves Area",
    ["development", "area-preservation"],
    "The area of the development of a solid's lateral surface equals the lateral surface area of the solid.",
    True,
    "Development is a 1:1 mapping of the surface onto a flat plane. No stretching or compression occurs, so the area is preserved exactly. This is why development is used in sheet metal work — the material area equals the surface area.",
    [hint("B", "Development by definition preserves all surface dimensions. If the area changed, the development would not correctly represent the surface.", "Thinking development changes area")]
))

questions.append(tf_q(
    "cuet-eg-development-32", "easy", "Only Lateral Surface",
    ["development", "lateral-surface"],
    "In standard development practice, only the lateral (side) surface is developed, not the top or bottom faces.",
    True,
    "Standard development covers the lateral surface. The top and bottom faces (bases) are separate flat shapes that can be attached at appropriate edges if needed, but the main development shows the lateral surface.",
    [hint("B", "Development focuses on the lateral surface. Base faces are flat and can be added separately. This is standard practice in sheet metal fabrication.", "Thinking bases must be included")]
))

questions.append(tf_q(
    "cuet-eg-development-33", "medium", "Oblique Cone Development",
    ["oblique-cone", "development"],
    "An oblique cone can be developed exactly because it is a singly curved surface.",
    True,
    "An oblique cone has a singly curved surface (it can be generated by a straight line moving along a curved path). All singly curved surfaces are developable. The development uses the triangulation method with true lengths of generators.",
    [hint("B", "A singly curved surface (where through every point a straight line can be drawn on the surface) is always developable. Oblique cones qualify.", "Confusing oblique with doubly curved")]
))

questions.append(tf_q(
    "cuet-eg-development-34", "medium", "Frustum as Two Sectors",
    ["frustum", "development-method"],
    "The development of a frustum of a cone is obtained by subtracting the development of the removed small cone from the development of the full cone.",
    True,
    "A frustum = full cone minus the small top cone. Its development = full cone's sector minus the small cone's sector = annular sector (the region between two concentric arcs).",
    [hint("B", "This is the standard method: develop the full cone (sector), develop the removed cone (smaller sector), subtract to get the annular sector. This is mathematically exact.", "Not understanding the subtraction approach")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# FILL-IN-BLANKS (2): cuet-eg-development-35 to 36
# ═══════════════════════════════════════════════════════════════════════════════

q35 = base("cuet-eg-development-35", "fill-in-blanks", "easy", "remember", "Cone Sector Angle Formula", ["cone", "formula"])
q35.update({
    "question_text": "The sector angle (in degrees) for the development of a right circular cone is given by θ = (r / _____) × 360°.",
    "text_with_blanks": "The sector angle (in degrees) for the development of a right circular cone is given by θ = (r / _____) × 360°.",
    "correct_answer": "B",
    "explanation": "θ = (r/l) × 360°, where r = base radius and l = slant height. The slant height is the sector radius, and r/l determines what fraction of the full circle the sector occupies.",
    "options": [
        opt("A", "h (height)"),
        opt("B", "l (slant height)", True),
        opt("C", "d (diameter)"),
        opt("D", "2r (diameter)"),
    ],
    "elimination_hints": [
        hint("A", "h is the vertical height of the cone. The formula uses the slant height l = √(h² + r²), not h.", "Confusing height with slant height"),
        hint("C", "d is the base diameter. The formula divides base radius by slant height, not by diameter.", "Using diameter in wrong position"),
        hint("D", "2r = diameter. The numerator in θ = (r/l) × 360° is the base radius r, not the diameter.", "Using diameter instead of radius in numerator"),
    ]
})
questions.append(q35)

q36 = base("cuet-eg-development-36", "fill-in-blanks", "medium", "understand", "Cylinder Development Width", ["cylinder", "development-width"])
q36.update({
    "question_text": "The width of the rectangle in the development of a right circular cylinder of diameter d is _____.",
    "text_with_blanks": "The width of the rectangle in the development of a right circular cylinder of diameter d is _____.",
    "correct_answer": "A",
    "explanation": "The width of the development rectangle = circumference = πd. When the cylinder is unrolled, the circumference of the base circle becomes the width of the rectangle.",
    "options": [
        opt("A", "πd", True),
        opt("B", "d"),
        opt("C", "2d"),
        opt("D", "πd²"),
    ],
    "elimination_hints": [
        hint("B", "d is the diameter, not the circumference. The width = circumference = πd ≈ 3.14d.", "Confusing diameter with circumference"),
        hint("C", "2d is twice the diameter. The circumference is πd, not 2d.", "Using 2d instead of πd"),
        hint("D", "πd² has units of mm² (area). The width is a length: πd.", "Confusing linear dimension with area"),
    ]
})
questions.append(q36)

# ═══════════════════════════════════════════════════════════════════════════════
# SCENARIO-BASED (2): cuet-eg-development-37 to 38
# ═══════════════════════════════════════════════════════════════════════════════

q37 = base("cuet-eg-development-37", "scenario-based", "medium", "apply", "HVAC Duct Development", ["real-world", "cylinder-development"])
q37.update({
    "question_text": "Based on the scenario, what is the size of the flat sheet needed for one duct section?",
    "scenario": "An HVAC technician needs to fabricate a cylindrical air duct from a flat sheet of galvanized steel. The duct has an inner diameter of 300 mm and length of 1000 mm. The technician needs to cut a flat rectangular piece that will be rolled into the cylindrical shape.",
    "correct_answer": "D",
    "explanation": "Width = πd = π × 300 = 942.48 mm. Length = duct length = 1000 mm. The flat sheet is approximately 942.5 mm × 1000 mm (plus seam allowance in practice).",
    "options": [
        opt("A", "300 mm × 1000 mm"),
        opt("B", "600 mm × 1000 mm"),
        opt("C", "900 mm × 1000 mm"),
        opt("D", "942.5 mm × 1000 mm", True),
    ],
    "elimination_hints": [
        hint("A", "300 mm is the diameter. The width must be the circumference = πd ≈ 942.5 mm.", "Using diameter as sheet width"),
        hint("B", "600 mm = 2 × diameter. The circumference is π × 300 ≈ 942.5 mm, not 2 × 300.", "Using 2d instead of πd"),
        hint("C", "900 mm = 3 × diameter. Close to πd ≈ 942.5 mm but not accurate. The exact value requires π.", "Approximating π as 3"),
    ]
})
questions.append(q37)

q38 = base("cuet-eg-development-38", "scenario-based", "hard", "evaluate", "Funnel Fabrication", ["real-world", "cone-development"])
q38.update({
    "question_text": "Based on the scenario, what is the sector angle for the development of the funnel?",
    "scenario": "A metalworker needs to fabricate a conical funnel from a flat sheet. The funnel has a top opening diameter of 200 mm and a slant height of 250 mm. The funnel is a right circular cone (with the bottom tip cut off, but for the full cone development).",
    "correct_answer": "B",
    "explanation": "Base radius r = 200/2 = 100 mm. Slant height l = 250 mm. Sector angle θ = (r/l) × 360° = (100/250) × 360° = 0.4 × 360° = 144°.",
    "options": [
        opt("A", "72°"),
        opt("B", "144°", True),
        opt("C", "180°"),
        opt("D", "288°"),
    ],
    "elimination_hints": [
        hint("A", "72° = (r/l) × 180° uses 180° instead of 360°. The correct formula uses the full circle.", "Halving the formula"),
        hint("C", "180° = (r/l) × 360° would require r/l = 0.5, meaning r = 125 mm. But r = 100 mm here.", "Incorrect r/l ratio"),
        hint("D", "288° = (1 - r/l) × 360° is the unused portion of the circle, not the sector angle.", "Calculating the complement instead of the sector"),
    ]
})
questions.append(q38)

# ═══════════════════════════════════════════════════════════════════════════════
# LOGICAL-SEQUENCE (2): cuet-eg-development-39 to 40
# ═══════════════════════════════════════════════════════════════════════════════

q39 = base("cuet-eg-development-39", "logical-sequence", "medium", "understand", "Prism Development Steps", ["prism", "development-steps"])
q39.update({
    "question_text": "Arrange the steps for developing the lateral surface of a right pentagonal prism:",
    "items": [
        {"id": "1", "text": "Draw the stretch-out line equal to the perimeter of the pentagonal base (5 × side)"},
        {"id": "2", "text": "Mark the five base edge lengths along the stretch-out line"},
        {"id": "3", "text": "Draw perpendiculars at each marked point equal to the prism height"},
        {"id": "4", "text": "Connect the top points of the perpendiculars to complete the development"},
        {"id": "5", "text": "Label the vertices corresponding to the base corners"},
        {"id": "6", "text": "Add any cut lines (if the prism is truncated) using projected heights from the FV"}
    ],
    "correct_order": ["1", "2", "3", "4", "5", "6"],
    "correct_answer": "A",
    "explanation": "Correct order: Draw stretch-out → Mark edge lengths → Draw perpendiculars (heights) → Connect tops → Label vertices → Add cut lines if needed.",
    "options": [
        opt("A", "1, 2, 3, 4, 5, 6", True),
        opt("B", "2, 1, 3, 4, 5, 6"),
        opt("C", "1, 3, 2, 4, 5, 6"),
        opt("D", "1, 2, 4, 3, 5, 6"),
    ],
    "elimination_hints": [
        hint("B", "Step 2 (marking edges) requires the stretch-out line (Step 1) to exist first.", "Marking on a non-existent line"),
        hint("C", "Step 3 (perpendiculars) before Step 2 (marking points) means the perpendiculars are at wrong positions.", "Drawing perpendiculars before marking edge points"),
        hint("D", "Step 4 (connecting tops) before Step 3 (drawing perpendiculars) is impossible — there are no top points yet.", "Connecting points that don't exist"),
    ]
})
questions.append(q39)

q40 = base("cuet-eg-development-40", "logical-sequence", "hard", "analyze", "Cone Development Steps", ["cone", "development-steps"])
q40.update({
    "question_text": "Arrange the steps for developing the lateral surface of a right circular cone:",
    "items": [
        {"id": "1", "text": "Find the slant height (l) of the cone from the given dimensions"},
        {"id": "2", "text": "Draw an arc of radius l (the sector radius) centered at the apex O"},
        {"id": "3", "text": "Calculate the sector angle θ = (r/l) × 360°"},
        {"id": "4", "text": "Mark the sector angle on the arc to define the sector"},
        {"id": "5", "text": "Divide the sector into 12 equal parts (matching the base circle division)"},
        {"id": "6", "text": "Draw the two bounding radii from O to the arc endpoints"}
    ],
    "correct_order": ["1", "3", "2", "4", "6", "5"],
    "correct_answer": "D",
    "explanation": "Correct order: Find slant height → Calculate sector angle → Draw arc with radius l → Mark sector angle → Draw bounding radii → Divide into 12 parts. The slant height and angle must be calculated before drawing.",
    "options": [
        opt("A", "1, 2, 3, 4, 5, 6"),
        opt("B", "3, 1, 2, 4, 6, 5"),
        opt("C", "1, 3, 4, 2, 6, 5"),
        opt("D", "1, 3, 2, 4, 6, 5", True),
    ],
    "elimination_hints": [
        hint("A", "Step 2 (draw arc) before Step 3 (calculate angle) means you draw the arc without knowing the sector span. The angle should be calculated first.", "Drawing before calculating parameters"),
        hint("B", "Step 3 (calculate angle) before Step 1 (find slant height) won't work. The formula θ = (r/l) × 360° needs l first.", "Calculating angle without slant height"),
        hint("C", "Step 4 (mark angle) before Step 2 (draw arc) is impossible. You need the arc to mark the angle on.", "Marking angle before drawing the arc"),
    ]
})
questions.append(q40)

# ═══════════════════════════════════════════════════════════════════════════════
# WRITE & VALIDATE
# ═══════════════════════════════════════════════════════════════════════════════

with open(OUT, 'w') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Written {len(questions)} questions to {OUT}")

ids = [q["id"] for q in questions]
assert len(ids) == 40, f"Expected 40, got {len(ids)}"
assert len(set(ids)) == 40, "Duplicate IDs found!"

from collections import Counter
answers = Counter(q["correct_answer"] for q in questions)
print(f"Answer distribution: {dict(answers)}")
for letter, count in answers.items():
    assert count <= 12, f"Answer {letter} appears {count} times (max 12)"

types = Counter(q["question_type"] for q in questions)
print(f"Type distribution: {dict(types)}")

diffs = Counter(q["difficulty"] for q in questions)
print(f"Difficulty distribution: {dict(diffs)}")

print("All validations passed!")
