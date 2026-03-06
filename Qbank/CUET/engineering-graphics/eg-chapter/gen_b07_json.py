#!/usr/bin/env python3
"""Generate the 40-question JSON for B07: Isometric Projection."""
import json, os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cuet-eg-isometric-b07.json")

def base(qid, qtype, diff, bloom, subtopic, tags):
    return {
        "id": qid,
        "chapter_id": "cuet-eg-engineering-graphics",
        "topic_id": "cuet-eg-isometric",
        "question_type": qtype,
        "difficulty": diff,
        "subject": "engineering-graphics",
        "chapter": "Engineering Graphics",
        "topic": "Isometric Projection",
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
# MCQ — EASY (5): cuet-eg-isometric-01 to 05
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(mcq(
    "cuet-eg-isometric-01", "easy", "remember", "Isometric Axes Angles",
    ["isometric-axes", "angles"],
    "In isometric projection, the three isometric axes are equally inclined to the plane of projection. The angle between any two isometric axes is:",
    [opt("A", "90°"),
     opt("B", "120°", True),
     opt("C", "60°"),
     opt("D", "150°")],
    "B",
    "In isometric projection, the three axes make equal angles of 120° with each other. Two axes make 30° with the horizontal, and the third is vertical.",
    [hint("A", "90° is the angle between axes in orthographic projection, not isometric.", "Confusing orthographic with isometric"),
     hint("C", "60° is half of 120°. The supplementary angle is not correct; the inter-axis angle is 120°.", "Using half the correct angle"),
     hint("D", "150° is the angle between an isometric axis and its extension, not between two different axes.", "Using supplementary instead of inter-axis angle")]
))

questions.append(mcq(
    "cuet-eg-isometric-02", "easy", "remember", "Isometric Scale Factor",
    ["isometric-scale", "factor"],
    "The isometric scale (ratio of isometric length to true length) is approximately:",
    [opt("A", "1.0"),
     opt("B", "0.5"),
     opt("C", "0.816", True),
     opt("D", "1.22")],
    "C",
    "The isometric scale = √(2/3) ≈ 0.8165. This means every true length is reduced to about 81.65% in isometric projection.",
    [hint("A", "1.0 means no reduction. This would be an isometric drawing (using true lengths), not an isometric projection.", "Confusing isometric drawing with isometric projection"),
     hint("B", "0.5 is too much reduction. The isometric scale is √(2/3) ≈ 0.816, not 0.5.", "Using wrong scale factor"),
     hint("D", "1.22 ≈ √(3/2) is the inverse of the isometric scale. It would enlarge, not reduce.", "Inverting the scale factor")]
))

questions.append(mcq(
    "cuet-eg-isometric-03", "easy", "remember", "Isometric Drawing vs Projection",
    ["isometric-drawing", "distinction"],
    "The key difference between an isometric drawing and an isometric projection is:",
    [opt("A", "Isometric drawing uses true lengths; isometric projection uses the isometric scale (×0.816)", True),
     opt("B", "Isometric drawing is 2D; isometric projection is 3D"),
     opt("C", "They are exactly the same thing"),
     opt("D", "Isometric projection uses true lengths; isometric drawing uses reduced lengths")],
    "A",
    "An isometric DRAWING uses true (actual) dimensions directly on the isometric axes — it's simpler and commonly used. An isometric PROJECTION uses the isometric scale (√(2/3) ≈ 0.816) to reduce all dimensions, giving the mathematically correct projection.",
    [hint("B", "Both are 2D representations of 3D objects. The difference is in scale, not dimensionality.", "Confusing representation type with scale difference"),
     hint("C", "They are NOT the same. Isometric drawing is larger (true scale) than isometric projection (reduced scale).", "Not recognizing the scale difference"),
     hint("D", "This is reversed. Isometric DRAWING uses true lengths. Isometric PROJECTION uses the reduced scale.", "Swapping the two definitions")]
))

questions.append(mcq(
    "cuet-eg-isometric-04", "easy", "remember", "Isometric Lines",
    ["isometric-lines", "definition"],
    "Lines that are parallel to the isometric axes are called:",
    [opt("A", "Orthographic lines"),
     opt("B", "Isometric lines", True),
     opt("C", "Non-isometric lines"),
     opt("D", "Oblique lines")],
    "B",
    "Lines parallel to any of the three isometric axes are called isometric lines. They can be directly measured using the isometric scale. Lines not parallel to any isometric axis are non-isometric lines.",
    [hint("A", "Orthographic lines relate to orthographic projection, not specifically to isometric axes.", "Confusing projection types"),
     hint("C", "Non-isometric lines are lines that are NOT parallel to any isometric axis. This is the opposite of what's asked.", "Choosing the opposite definition"),
     hint("D", "Oblique lines are a general term for inclined lines. The specific term for lines parallel to isometric axes is 'isometric lines'.", "Using general term instead of specific")]
))

questions.append(mcq(
    "cuet-eg-isometric-05", "easy", "remember", "Rectangular Face in Isometric",
    ["isometric-view", "parallelogram"],
    "In an isometric view, a rectangular face of a solid appears as:",
    [opt("A", "A rectangle"),
     opt("B", "A parallelogram", True),
     opt("C", "A circle"),
     opt("D", "A triangle")],
    "B",
    "In isometric view, the axes are at 120° (not 90°). Rectangular faces appear as parallelograms because the right angles of the rectangle are distorted by the isometric projection.",
    [hint("A", "A rectangle has 90° angles. In isometric view, the angles become 60° and 120°, forming a parallelogram.", "Assuming angles are preserved in isometric"),
     hint("C", "Circles appear as ellipses in isometric, not as the projection of rectangles.", "Confusing shape types"),
     hint("D", "A triangle has 3 sides. A rectangle (4 sides) projects as a parallelogram (4 sides), not a triangle.", "Changing the number of sides")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# MCQ — MEDIUM (10): cuet-eg-isometric-06 to 15
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(mcq(
    "cuet-eg-isometric-06", "medium", "understand", "Circle in Isometric",
    ["circle", "ellipse-in-isometric"],
    "A circle drawn on any face of an isometric view appears as:",
    [opt("A", "A circle"),
     opt("B", "A straight line"),
     opt("C", "An ellipse", True),
     opt("D", "A parabola")],
    "C",
    "In isometric view, all planes are inclined to the projection plane. A circle on an isometric plane projects as an ellipse. The 4-center approximate method is commonly used to draw these isometric ellipses.",
    [hint("A", "A circle appears as a circle only when the plane containing it is parallel to the projection plane. In isometric, no plane is parallel to the projection plane.", "Assuming circle remains circular"),
     hint("B", "A straight line would mean the circle's plane is perpendicular to the viewing direction. In isometric, planes are inclined, not perpendicular.", "Confusing perpendicular with inclined view"),
     hint("D", "A parabola is a conic section. The projection of a circle on an inclined plane is always an ellipse, never a parabola.", "Wrong conic section type")]
))

questions.append(mcq(
    "cuet-eg-isometric-07", "medium", "understand", "Non-Isometric Lines",
    ["non-isometric-lines", "measurement"],
    "Non-isometric lines (lines not parallel to any isometric axis) in an isometric view:",
    [opt("A", "Can be measured directly using the isometric scale"),
     opt("B", "Cannot be measured directly and must be located by their endpoints", True),
     opt("C", "Are never drawn in isometric views"),
     opt("D", "Always appear as vertical lines")],
    "B",
    "Non-isometric lines (diagonals, inclined edges not parallel to axes) cannot be scaled directly. They are drawn by first locating their endpoints using isometric coordinates, then connecting them.",
    [hint("A", "Only isometric lines (parallel to axes) can be measured directly. Non-isometric lines are foreshortened differently.", "Applying isometric scale to non-isometric lines"),
     hint("C", "Non-isometric lines do appear in isometric views (e.g., diagonals of faces, inclined surfaces). They just can't be measured directly.", "Thinking non-isometric lines are excluded"),
     hint("D", "Non-isometric lines can be in any direction. 'Non-isometric' means not parallel to any axis, not necessarily vertical.", "Confusing non-isometric with a specific direction")]
))

questions.append(mcq(
    "cuet-eg-isometric-08", "medium", "apply", "Isometric View Construction",
    ["construction", "box-method"],
    "When constructing the isometric view of an object, the most common approach is the:",
    [opt("A", "Sectional method"),
     opt("B", "Box (enclosing) method", True),
     opt("C", "Auxiliary view method"),
     opt("D", "Development method")],
    "B",
    "The box method involves enclosing the object in a rectangular box whose edges are along the isometric axes. The isometric view of this box is drawn first, then the object's features are located within it.",
    [hint("A", "The sectional method is for drawing sections of solids, not for constructing isometric views.", "Confusing sectioning with isometric construction"),
     hint("C", "Auxiliary views are used in orthographic projection to find true shapes of inclined surfaces.", "Confusing auxiliary views with isometric"),
     hint("D", "Development is for unfolding surfaces, not for drawing isometric views.", "Confusing development with isometric construction")]
))

questions.append(mcq(
    "cuet-eg-isometric-09", "medium", "apply", "4-Center Method",
    ["four-center", "approximate-ellipse"],
    "The 4-center approximate method is used in isometric drawing to draw:",
    [opt("A", "Straight edges along isometric axes"),
     opt("B", "Hidden lines behind the object"),
     opt("C", "Approximate ellipses representing circles on isometric planes", True),
     opt("D", "The isometric scale")],
    "C",
    "The 4-center method constructs an approximate ellipse using four circular arcs. It is used to represent circles that appear on isometric planes (top, front, or side faces) as ellipses.",
    [hint("A", "Straight edges along axes are drawn directly. No special method is needed for straight isometric lines.", "Applying 4-center to straight lines"),
     hint("B", "Hidden lines are drawn as dashed lines. The 4-center method is specifically for circular features.", "Confusing hidden lines with ellipses"),
     hint("D", "The isometric scale is a ratio (√(2/3) ≈ 0.816). It's not something that's 'drawn' using the 4-center method.", "Confusing scale with drawing method")]
))

questions.append(mcq(
    "cuet-eg-isometric-10", "medium", "apply", "Isometric View of Cylinder",
    ["cylinder", "isometric-representation"],
    "The isometric view of a right circular cylinder standing upright consists of:",
    [opt("A", "A rectangle with two circles"),
     opt("B", "A rectangle only"),
     opt("C", "A single ellipse"),
     opt("D", "Two ellipses connected by two tangent lines", True)],
    "D",
    "The top and bottom circular faces appear as ellipses in isometric view. The two outermost generators (tangent to both ellipses) form the visible lateral edges, connecting the two ellipses.",
    [hint("A", "Circles appear as ellipses in isometric, not as circles. The faces are parallelograms, not rectangles.", "Assuming shapes are preserved in isometric"),
     hint("B", "A rectangle is the front/side view in orthographic projection. Isometric shows the 3D appearance with elliptical faces.", "Confusing orthographic with isometric"),
     hint("C", "A single ellipse represents only one face. The cylinder has two circular faces (both visible as ellipses) and a curved surface.", "Showing only one face")]
))

questions.append(mcq(
    "cuet-eg-isometric-11", "medium", "understand", "Isometric Plane",
    ["isometric-plane", "definition"],
    "An isometric plane is a plane that:",
    [opt("A", "Is parallel to the projection plane"),
     opt("B", "Contains two isometric axes", True),
     opt("C", "Is perpendicular to all three isometric axes"),
     opt("D", "Contains only non-isometric lines")],
    "B",
    "An isometric plane is any plane that contains two of the three isometric axes (or is parallel to such a plane). There are three isometric planes: XY, YZ, and XZ. Circles on these planes appear as ellipses.",
    [hint("A", "The projection plane is not an isometric plane. Isometric planes are inclined to the projection plane.", "Confusing projection plane with isometric plane"),
     hint("C", "No plane can be perpendicular to all three axes simultaneously (since they span 3D space). An isometric plane contains two axes.", "Geometrically impossible condition"),
     hint("D", "Isometric planes contain isometric lines (parallel to their two axes). Non-isometric lines may also lie in isometric planes.", "Contradicting the definition")]
))

questions.append(mcq(
    "cuet-eg-isometric-12", "medium", "apply", "Isometric Length Calculation",
    ["isometric-scale", "calculation"],
    "A cube has a true edge length of 50 mm. In an isometric projection, each edge measures:",
    [opt("A", "50 mm"),
     opt("B", "40.82 mm", True),
     opt("C", "61.24 mm"),
     opt("D", "35 mm")],
    "B",
    "Isometric length = True length × isometric scale = 50 × √(2/3) = 50 × 0.8165 = 40.82 mm.",
    [hint("A", "50 mm is the true length. In isometric projection (not drawing), the scale factor reduces this.", "Using true length instead of isometric projection length"),
     hint("C", "61.24 mm = 50 × √(3/2) is the inverse. This would enlarge, not reduce.", "Inverting the scale factor"),
     hint("D", "35 mm = 50 × 0.7. The correct factor is 0.8165 (√(2/3)), not 0.7.", "Using wrong scale factor")]
))

questions.append(mcq(
    "cuet-eg-isometric-13", "medium", "understand", "Direction of Viewing",
    ["viewing-direction", "isometric"],
    "In standard isometric projection, the direction of viewing is along the:",
    [opt("A", "Body diagonal of a cube (equally inclined to all three axes)", True),
     opt("B", "One of the edges of the cube"),
     opt("C", "Face diagonal of the cube"),
     opt("D", "Perpendicular to one face only")],
    "A",
    "Isometric projection views the object along the body diagonal of an imaginary cube surrounding the object. This direction is equally inclined to all three principal axes (at approximately 35.26° to each), making the three axes appear equally foreshortened.",
    [hint("B", "Viewing along a cube edge gives an orthographic view (one face flat), not isometric.", "Confusing orthographic with isometric viewing"),
     hint("C", "Viewing along a face diagonal gives a dimetric view (two axes equal, one different), not isometric.", "Confusing dimetric with isometric"),
     hint("D", "Perpendicular to one face gives a standard orthographic view. Isometric requires equal inclination to all three axes.", "Confusing front view with isometric")]
))

questions.append(mcq(
    "cuet-eg-isometric-14", "medium", "apply", "Angles in Isometric View",
    ["angles", "distortion"],
    "A right angle (90°) between two edges of a solid appears in an isometric view as:",
    [opt("A", "Always 90°"),
     opt("B", "Either 60° or 120° (if edges are along isometric axes)", True),
     opt("C", "Always 45°"),
     opt("D", "Always 180°")],
    "B",
    "In isometric view, right angles between isometric lines appear as either 60° or 120° (since the isometric axes are at 120° to each other). The actual 90° is never preserved in the isometric projection.",
    [hint("A", "90° is not preserved in isometric projection. The axes are at 120°, so right angles become 60° or 120°.", "Assuming angles are preserved"),
     hint("C", "45° doesn't correspond to any standard angle in isometric. The axes produce 30°, 60°, 90°, 120°, 150° angles.", "Using a non-standard isometric angle"),
     hint("D", "180° means a straight line. Two perpendicular edges would never appear collinear in isometric.", "Confusing straight line with right angle")]
))

questions.append(mcq(
    "cuet-eg-isometric-15", "medium", "apply", "Isometric View of Sphere",
    ["sphere", "isometric-representation"],
    "The isometric view of a sphere is:",
    [opt("A", "An ellipse"),
     opt("B", "A circle with the same diameter as the sphere"),
     opt("C", "A circle with diameter equal to the major axis of the isometric ellipse of a great circle"),
     opt("D", "A circle with the same diameter as the sphere", True)],
    "D",
    "A sphere looks the same from every direction. In isometric projection, it appears as a circle. However, in isometric PROJECTION (with scale 0.816), the circle's diameter = true diameter × (major axis scale). In practice, a sphere is drawn as a circle of the true diameter.",
    [hint("A", "An ellipse is the projection of a circle on an inclined plane. A sphere has no flat faces — it projects as a circle from any direction.", "Confusing sphere with circular face on a flat surface"),
     hint("B", "In true isometric projection, the sphere diameter is scaled. But in standard practice (isometric drawing), the sphere is drawn as a circle of true diameter.", "Slight nuance; in standard practice both B and D say the same thing"),
     hint("C", "The major axis of an isometric ellipse is larger than the true diameter. Using it would draw the sphere too large.", "Using the wrong reference diameter")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# MCQ — HARD (5): cuet-eg-isometric-16 to 20
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(mcq(
    "cuet-eg-isometric-16", "hard", "analyze", "Isometric vs Oblique",
    ["pictorial-projection", "comparison"],
    "Compared to oblique projection, the advantage of isometric projection is that:",
    [opt("A", "Isometric is easier to draw"),
     opt("B", "Isometric gives a more realistic appearance because all three axes are equally foreshortened", True),
     opt("C", "Isometric preserves true angles"),
     opt("D", "Isometric always shows all six faces")],
    "B",
    "In isometric projection, all three axes are equally foreshortened, giving a balanced, realistic appearance. In oblique projection, one face shows true shape but the receding axis is distorted, making the view less natural.",
    [hint("A", "Oblique projection is actually easier (one face drawn as true shape). Isometric's advantage is realism, not ease.", "Confusing ease with realism"),
     hint("C", "No pictorial projection preserves true angles. All angles are distorted in both isometric and oblique.", "Assuming angle preservation"),
     hint("D", "Maximum 3 faces are visible in any single isometric view. Hidden faces require separate views.", "Overcounting visible faces")]
))

questions.append(mcq(
    "cuet-eg-isometric-17", "hard", "apply", "Inclined Surface in Isometric",
    ["inclined-surface", "construction"],
    "To draw an inclined surface (not parallel to any isometric plane) in isometric view, you should:",
    [opt("A", "Draw it as a straight line"),
     opt("B", "Locate the endpoints of the inclined edges using isometric coordinates and connect them", True),
     opt("C", "Ignore it since it cannot be shown"),
     opt("D", "Use the 4-center method")],
    "B",
    "Inclined surfaces produce non-isometric lines. These cannot be drawn directly. Instead, locate each endpoint of the inclined edge using its X, Y, Z coordinates in the isometric system, then connect the points.",
    [hint("A", "A straight line may be part of the answer, but the key issue is HOW to locate the endpoints. Direct measurement doesn't work for inclined surfaces.", "Oversimplifying the construction"),
     hint("C", "Inclined surfaces are common and must be shown. They are drawn by endpoint location, not omitted.", "Avoiding difficult features"),
     hint("D", "The 4-center method is for drawing circles/ellipses on isometric planes, not for inclined surfaces.", "Confusing ellipse method with surface construction")]
))

questions.append(mcq(
    "cuet-eg-isometric-18", "hard", "analyze", "Ellipse Orientation",
    ["ellipse", "face-orientation"],
    "In an isometric view, circles on the top face, front face, and side face of a cube appear as ellipses. The major axis of the ellipse on the top face is oriented:",
    [opt("A", "Vertically"),
     opt("B", "Horizontally", True),
     opt("C", "At 30° to horizontal"),
     opt("D", "At 60° to horizontal")],
    "B",
    "On the top face (horizontal isometric plane), the major axis of the ellipse is horizontal. On the front face, the major axis is at 60° to horizontal (perpendicular to the left isometric axis). On the side face, it's at 60° the other way.",
    [hint("A", "The vertical major axis corresponds to a face not visible as a standard top face. The top face ellipse has a horizontal major axis.", "Confusing top face with side face orientation"),
     hint("C", "30° is the angle of the isometric axes with horizontal, not the major axis orientation. The major axis is perpendicular to the 'missing' axis.", "Confusing axis angle with major axis"),
     hint("D", "60° is the major axis orientation for front and side face ellipses, not the top face.", "Using front/side face angle for top face")]
))

questions.append(mcq(
    "cuet-eg-isometric-19", "hard", "evaluate", "Reading Orthographic to Isometric",
    ["orthographic-to-isometric", "interpretation"],
    "When converting orthographic views to an isometric view, the most critical step is:",
    [opt("A", "Drawing the isometric axes first"),
     opt("B", "Correctly identifying the three dimensions (length, width, height) from the orthographic views and mapping them to the three isometric axes", True),
     opt("C", "Using a compass to draw circles"),
     opt("D", "Drawing hidden lines first")],
    "B",
    "The crucial step is reading the orthographic views to extract L, W, H and then mapping them correctly: one dimension along each isometric axis. Misidentifying or misplacing dimensions leads to an incorrect isometric view.",
    [hint("A", "Drawing axes is important but mechanical. The critical intellectual step is correctly reading and mapping dimensions from ortho views.", "Focusing on procedure over understanding"),
     hint("C", "Compass use is a drafting technique. The conceptual challenge is interpreting the orthographic views correctly.", "Focusing on tools over interpretation"),
     hint("D", "Hidden lines are drawn last, after the visible geometry. The critical step is understanding the shape from ortho views.", "Getting the sequence backward")]
))

questions.append(mcq(
    "cuet-eg-isometric-20", "hard", "evaluate", "Dimetric vs Isometric",
    ["dimetric", "comparison"],
    "In a dimetric projection, unlike isometric projection:",
    [opt("A", "All three axes are equally foreshortened"),
     opt("B", "No axes are foreshortened"),
     opt("C", "Two axes are equally foreshortened and the third is different", True),
     opt("D", "Each axis has a unique foreshortening ratio")],
    "C",
    "Dimetric projection has two axes equally foreshortened and the third different. Isometric has all three equal. Trimetric has all three different. These are the three types of axonometric projection.",
    [hint("A", "All three axes equally foreshortened defines isometric, not dimetric.", "Describing isometric instead of dimetric"),
     hint("B", "No foreshortening would mean a 1:1:1 scale on all axes, which doesn't correspond to any standard axonometric projection.", "Describing an impossible projection"),
     hint("D", "Each axis unique defines trimetric projection, not dimetric.", "Describing trimetric instead of dimetric")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# DIAGRAM-BASED (4): cuet-eg-isometric-21 to 24
# ═══════════════════════════════════════════════════════════════════════════════

q21 = base("cuet-eg-isometric-21", "diagram-based", "easy", "apply", "Isometric Axes Identification", ["axes", "angle-identification"])
q21.update({
    "question_text": "From the figure showing isometric axes, what is the angle between the two axes that make 30° with the horizontal?",
    "correct_answer": "D",
    "explanation": "The X-axis (30° right of horizontal) and Y-axis (30° left of horizontal) are the two axes making 30° with the horizontal. The angle between them = 30° + 30° + 60° (gap at bottom) = 120°. This is shown by the purple arc in the diagram.",
    "image_uri": "question-images/engineering-graphics/solids/cuet-eg-isometric-71-axes-scale.png",
    "image_alt": "Isometric axes showing Z vertical, X at 30° right, Y at 30° left, with 120° between each pair. Right panel shows isometric scale (0.816) vs natural scale.",
    "options": [
        opt("A", "60°"),
        opt("B", "90°"),
        opt("C", "150°"),
        opt("D", "120°", True),
    ],
    "elimination_hints": [
        hint("A", "60° is the angle between an isometric axis and the horizontal, not between the two inclined axes.", "Confusing axis-horizontal with axis-axis angle"),
        hint("B", "90° is the orthographic angle. Isometric axes are at 120° apart.", "Applying orthographic angles"),
        hint("C", "150° is the angle between the Z-axis and one inclined axis measured on the far side, not between the two inclined axes.", "Measuring the wrong angle"),
    ]
})
questions.append(q21)

q22 = base("cuet-eg-isometric-22", "diagram-based", "medium", "analyze", "Block Isometric Features", ["block", "face-identification"])
q22.update({
    "question_text": "From the figure showing the isometric view of a rectangular block, the top face (EFGH) appears as which shape?",
    "correct_answer": "C",
    "explanation": "In the isometric view, the top face EFGH (which is actually rectangular) appears as a parallelogram. The 90° angles of the rectangle become 60° and 120° in the isometric projection.",
    "image_uri": "question-images/engineering-graphics/solids/cuet-eg-isometric-72-block.png",
    "image_alt": "Isometric view of rectangular block with vertices A-H labeled, top face (blue) EFGH, front face (pink) ABFE, side face (gray) BCGF.",
    "options": [
        opt("A", "A rectangle"),
        opt("B", "A trapezoid"),
        opt("C", "A parallelogram", True),
        opt("D", "A rhombus"),
    ],
    "elimination_hints": [
        hint("A", "A rectangle has 90° angles. In isometric, these become 60° and 120°, so the shape is a parallelogram, not a rectangle.", "Assuming angles preserved"),
        hint("B", "A trapezoid has only one pair of parallel sides. The isometric top face has two pairs of parallel sides (a parallelogram).", "Incorrect shape identification"),
        hint("D", "A rhombus has all four sides equal. The top face has two different side lengths (L and W), so it's a parallelogram, not a rhombus.", "Assuming equal sides"),
    ]
})
questions.append(q22)

q23 = base("cuet-eg-isometric-23", "diagram-based", "medium", "analyze", "Circle Ellipse Orientation", ["circle", "ellipse-orientation"])
q23.update({
    "question_text": "From the figure showing circles on three faces of an isometric cube, the ellipse on the front face (red) has its major axis oriented at approximately:",
    "correct_answer": "A",
    "explanation": "On the front face (XZ isometric plane), the major axis of the ellipse is perpendicular to the Y-axis direction. Since the Y-axis goes at 30° left, the perpendicular is at 60° from horizontal (tilting to the upper right).",
    "image_uri": "question-images/engineering-graphics/solids/cuet-eg-isometric-73-circle-ellipse.png",
    "image_alt": "Isometric cube with ellipses on three visible faces: blue (top), red (front), green (side). Each ellipse has a different orientation.",
    "options": [
        opt("A", "60° to the horizontal (tilted right)", True),
        opt("B", "Horizontal (0°)"),
        opt("C", "Vertical (90°)"),
        opt("D", "30° to the horizontal"),
    ],
    "elimination_hints": [
        hint("B", "Horizontal major axis belongs to the top face ellipse, not the front face.", "Confusing top face with front face"),
        hint("C", "Vertical major axis doesn't correspond to any standard isometric face ellipse orientation.", "Non-standard orientation"),
        hint("D", "30° is the isometric axis angle, not the major axis angle. The major axis is perpendicular to the 'missing' axis direction.", "Confusing axis angle with major axis angle"),
    ]
})
questions.append(q23)

q24 = base("cuet-eg-isometric-24", "diagram-based", "hard", "evaluate", "Stepped Block Analysis", ["stepped-block", "dimension-reading"])
q24.update({
    "question_text": "From the figure showing a stepped block in isometric view, the step height can be determined as:",
    "correct_answer": "D",
    "explanation": "The total height is marked as 20 mm, and the block has two equal steps (base height 10 mm + step height 10 mm). The step portion rises from height 10 to height 20 along the Z-axis, giving a step height of 10 mm.",
    "image_uri": "question-images/engineering-graphics/solids/cuet-eg-isometric-74-stepped-block.png",
    "image_alt": "Isometric view of stepped block: base 40×30×10, upper step 20×30×10. Total height 20mm, total length 40mm, width 30mm.",
    "options": [
        opt("A", "20 mm"),
        opt("B", "30 mm"),
        opt("C", "40 mm"),
        opt("D", "10 mm", True),
    ],
    "elimination_hints": [
        hint("A", "20 mm is the total height of the stepped block, not the step height alone.", "Using total height instead of step height"),
        hint("B", "30 mm is the width (depth) of the block, not the step height.", "Confusing width with height"),
        hint("C", "40 mm is the total length of the base, not a height dimension.", "Confusing length with height"),
    ]
})
questions.append(q24)

# ═══════════════════════════════════════════════════════════════════════════════
# ASSERTION-REASONING (4): cuet-eg-isometric-25 to 28
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(ar_q(
    "cuet-eg-isometric-25", "medium", "understand", "Isometric Scale Derivation",
    ["isometric-scale", "derivation"],
    "The isometric scale factor is √(2/3) ≈ 0.816.",
    "In isometric projection, the body diagonal of a cube is perpendicular to the projection plane, causing each edge to be foreshortened by the factor √(2/3).",
    "A",
    "Both are true and R correctly explains A. The isometric projection views along the body diagonal, and the mathematical projection of each edge onto the projection plane gives the factor √(2/3).",
    [hint("B", "R directly explains A — the body diagonal viewing direction is the geometric basis for the √(2/3) scale.", "Not connecting viewing direction with scale"),
     hint("C", "R is true — the body diagonal is indeed perpendicular to the projection plane in isometric.", "Rejecting a correct geometric fact"),
     hint("D", "A is true — √(2/3) ≈ 0.8165 is the well-known isometric scale factor.", "Rejecting the standard isometric scale")]
))

questions.append(ar_q(
    "cuet-eg-isometric-26", "medium", "understand", "Isometric Drawing Preference",
    ["isometric-drawing", "practical-use"],
    "In practice, isometric drawings (using true lengths) are preferred over isometric projections (using isometric scale).",
    "Using true lengths simplifies construction while still producing a visually proportionate 3D representation.",
    "A",
    "Both are true and R correctly explains A. Isometric drawings avoid the tedious multiplication by 0.816 for every measurement. The resulting view is proportionally identical (just uniformly larger), so it serves the same purpose.",
    [hint("B", "R directly explains A — the simplification of using true lengths is the practical reason for the preference.", "Not connecting simplicity with preference"),
     hint("C", "R is true — true lengths do simplify the drawing process while maintaining visual proportionality.", "Rejecting a true practical advantage"),
     hint("D", "A is true — isometric drawings are standard practice in engineering, using true lengths for convenience.", "Rejecting common engineering practice")]
))

questions.append(ar_q(
    "cuet-eg-isometric-27", "hard", "analyze", "Isometric and True Angles",
    ["angles", "distortion"],
    "True angles (e.g., 90°) between edges are preserved in isometric projection.",
    "Isometric projection equally foreshortens all three axes, maintaining proportional distances.",
    "D",
    "A is false — angles are NOT preserved in isometric projection. A 90° angle appears as 60° or 120°. R is true — isometric does equally foreshorten all axes. But equal foreshortening preserves proportions of lengths, not angles.",
    [hint("A", "A is false — 90° angles become 60°/120° in isometric. Both cannot be true and R cannot explain a false assertion.", "Accepting the false assertion about angle preservation"),
     hint("B", "A is false. 'Both true' is not possible when A is false.", "Accepting the false assertion"),
     hint("C", "R is true — all three axes are equally foreshortened in isometric. The reason is correct even though the assertion is false.", "Rejecting the correct reason")]
))

questions.append(ar_q(
    "cuet-eg-isometric-28", "hard", "analyze", "Hidden Lines in Isometric",
    ["hidden-lines", "convention"],
    "Hidden lines are generally not shown in isometric views unless necessary for clarity.",
    "Isometric views are pictorial representations meant for visual understanding, and hidden lines add unnecessary complexity.",
    "A",
    "Both are true and R correctly explains A. Isometric views are meant to give a clear 3D picture. Hidden lines (dashed) clutter the view and are usually omitted. They are added only when essential to show a critical hidden feature.",
    [hint("B", "R directly explains A — the pictorial purpose of isometric views justifies omitting hidden lines.", "Not seeing the causal relationship"),
     hint("C", "R is true — isometric views are indeed pictorial representations for visual understanding.", "Rejecting the nature of isometric views"),
     hint("D", "A is true — this is standard drafting convention for isometric views.", "Rejecting standard convention")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# MATCH-THE-FOLLOWING (2): cuet-eg-isometric-29 to 30
# ═══════════════════════════════════════════════════════════════════════════════

q29 = base("cuet-eg-isometric-29", "match-the-following", "medium", "understand", "Axonometric Projection Types", ["axonometric", "classification"])
q29.update({
    "question_text": "Match the axonometric projection type with its foreshortening property:\n\nColumn A: (P) Isometric, (Q) Dimetric, (R) Trimetric, (S) Oblique\nColumn B: (1) All three axes equally foreshortened, (2) Two axes equally foreshortened, third different, (3) All three axes differently foreshortened, (4) One face shows true shape, receding axis is foreshortened",
    "correct_answer": "C",
    "explanation": "Isometric: all 3 equal (P-1). Dimetric: 2 equal, 1 different (Q-2). Trimetric: all 3 different (R-3). Oblique: one face true, receding foreshortened (S-4).",
    "column_a": ["Isometric", "Dimetric", "Trimetric", "Oblique"],
    "column_b": ["All three axes equally foreshortened", "Two axes equally foreshortened", "All three axes differently foreshortened", "One face shows true shape"],
    "correct_mapping": {"Isometric": "All three axes equally foreshortened", "Dimetric": "Two axes equally foreshortened", "Trimetric": "All three axes differently foreshortened", "Oblique": "One face shows true shape"},
    "options": [
        opt("A", "P-2, Q-1, R-3, S-4"),
        opt("B", "P-1, Q-3, R-2, S-4"),
        opt("C", "P-1, Q-2, R-3, S-4", True),
        opt("D", "P-1, Q-2, R-4, S-3"),
    ],
    "elimination_hints": [
        hint("A", "P-2 gives isometric two-axis foreshortening. Isometric is defined by ALL THREE axes being equally foreshortened.", "Swapping isometric and dimetric"),
        hint("B", "Q-3 gives dimetric all-different. Dimetric has TWO equal + 1 different. All-different is trimetric.", "Swapping dimetric and trimetric"),
        hint("D", "R-4 gives trimetric one-face-true. One face true is oblique projection. Trimetric has all three axes differently foreshortened.", "Swapping trimetric and oblique"),
    ]
})
questions.append(q29)

q30 = base("cuet-eg-isometric-30", "match-the-following", "hard", "analyze", "Isometric Shapes", ["shape-appearance", "isometric-faces"])
q30.update({
    "question_text": "Match the true shape with its appearance in isometric view:\n\nColumn A: (P) Square, (Q) Circle, (R) Rectangle (L ≠ W), (S) Right angle (90°)\nColumn B: (1) Ellipse, (2) Parallelogram (all sides equal), (3) 60° or 120°, (4) Parallelogram (unequal adjacent sides)",
    "correct_answer": "D",
    "explanation": "Square → Rhombus/parallelogram with all sides equal (P-2). Circle → Ellipse (Q-1). Rectangle → Parallelogram with unequal adjacent sides (R-4). Right angle → 60° or 120° (S-3).",
    "column_a": ["Square", "Circle", "Rectangle (L ≠ W)", "Right angle (90°)"],
    "column_b": ["Ellipse", "Parallelogram (all sides equal)", "60° or 120°", "Parallelogram (unequal sides)"],
    "correct_mapping": {"Square": "Parallelogram (all sides equal)", "Circle": "Ellipse", "Rectangle (L ≠ W)": "Parallelogram (unequal sides)", "Right angle (90°)": "60° or 120°"},
    "options": [
        opt("A", "P-1, Q-2, R-4, S-3"),
        opt("B", "P-2, Q-1, R-3, S-4"),
        opt("C", "P-4, Q-1, R-2, S-3"),
        opt("D", "P-2, Q-1, R-4, S-3", True),
    ],
    "elimination_hints": [
        hint("A", "P-1 gives square an ellipse. A square (flat face) appears as a parallelogram, not an ellipse. Ellipses represent circles.", "Confusing square with circle"),
        hint("B", "R-3 gives rectangle 60°/120°. An angle becomes 60°/120°, but a rectangle (a shape) becomes a parallelogram.", "Confusing shape with angle"),
        hint("C", "P-4 gives square unequal-sided parallelogram. A square has all sides equal, so its isometric image also has equal sides.", "Forgetting that isometric preserves side equality"),
    ]
})
questions.append(q30)

# ═══════════════════════════════════════════════════════════════════════════════
# TRUE-FALSE (4): cuet-eg-isometric-31 to 34
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(tf_q(
    "cuet-eg-isometric-31", "easy", "Axes at 30° to Horizontal",
    ["axes", "angle"],
    "In an isometric view, the two receding axes make 30° angles with the horizontal.",
    True,
    "The two non-vertical isometric axes (X and Y) make 30° with the horizontal reference line. The third axis (Z) is vertical. This is a defining characteristic of isometric projection.",
    [hint("B", "The 30° angle is a fundamental property of isometric axes. The three axes at 120° apart require the two non-vertical axes to be at 30° from horizontal.", "Not understanding isometric axis geometry")]
))

questions.append(tf_q(
    "cuet-eg-isometric-32", "easy", "Only Isometric Lines Measurable",
    ["isometric-lines", "measurement"],
    "In an isometric view, only lines parallel to the isometric axes can be directly measured to scale.",
    True,
    "Only isometric lines (parallel to the three axes) can be directly measured. Non-isometric lines (diagonals, inclined edges) are foreshortened differently and must be located by their endpoints.",
    [hint("B", "Non-isometric lines have a different foreshortening ratio than the isometric scale. They cannot be measured directly; their endpoints must be located using isometric coordinates.", "Thinking all lines are equally measurable")]
))

questions.append(tf_q(
    "cuet-eg-isometric-33", "medium", "Isometric Drawing Larger",
    ["isometric-drawing", "size-comparison"],
    "An isometric drawing of an object is larger than its isometric projection.",
    True,
    "Isometric drawing uses true lengths (scale = 1.0), while isometric projection uses the isometric scale (≈ 0.816). Since 1.0 > 0.816, the isometric drawing is uniformly larger by a factor of 1/0.816 ≈ 1.22.",
    [hint("B", "Isometric drawing: scale = 1.0. Isometric projection: scale = 0.816. Since 1.0 > 0.816, the drawing is larger than the projection.", "Confusing which uses which scale")]
))

questions.append(tf_q(
    "cuet-eg-isometric-34", "medium", "Parallelism Preserved",
    ["parallelism", "isometric-property"],
    "Parallel lines in the object remain parallel in the isometric view.",
    True,
    "Isometric projection is a parallel (not perspective) projection. Parallel lines in the object project as parallel lines in the isometric view. This is true for all parallel projections.",
    [hint("B", "In parallel projections (including isometric), parallelism is always preserved. Only in perspective projection do parallel lines converge.", "Confusing parallel projection with perspective")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# FILL-IN-BLANKS (2): cuet-eg-isometric-35 to 36
# ═══════════════════════════════════════════════════════════════════════════════

q35 = base("cuet-eg-isometric-35", "fill-in-blanks", "easy", "remember", "Scale Factor Value", ["isometric-scale", "value"])
q35.update({
    "question_text": "The isometric scale factor is √(2/3) which is approximately equal to _____.",
    "text_with_blanks": "The isometric scale factor is √(2/3) which is approximately equal to _____.",
    "correct_answer": "C",
    "explanation": "√(2/3) = √2/√3 = 1.414/1.732 = 0.8165 ≈ 0.816. This is the ratio by which all dimensions are reduced in true isometric projection.",
    "options": [
        opt("A", "0.500"),
        opt("B", "0.707"),
        opt("C", "0.816", True),
        opt("D", "1.000"),
    ],
    "elimination_hints": [
        hint("A", "0.500 = 1/2. The isometric scale is √(2/3) ≈ 0.816, not 1/2.", "Using wrong fraction"),
        hint("B", "0.707 = 1/√2. The isometric scale is √(2/3), not 1/√2.", "Using wrong root"),
        hint("D", "1.000 means no reduction. This is the scale for isometric drawings, not isometric projections.", "Confusing drawing with projection scale"),
    ]
})
questions.append(q35)

q36 = base("cuet-eg-isometric-36", "fill-in-blanks", "medium", "understand", "Ellipse Method Name", ["four-center", "method-name"])
q36.update({
    "question_text": "The approximate method commonly used to draw an ellipse (representing a circle) in isometric view is called the _____ method.",
    "text_with_blanks": "The approximate method commonly used to draw an ellipse (representing a circle) in isometric view is called the _____ method.",
    "correct_answer": "D",
    "explanation": "The 4-center (four-center) method uses four arcs drawn from four different centers to approximate an ellipse. It is the standard method for drawing circles in isometric views.",
    "options": [
        opt("A", "Concentric circle"),
        opt("B", "Oblong"),
        opt("C", "Trammel"),
        opt("D", "Four-center (4-center)", True),
    ],
    "elimination_hints": [
        hint("A", "The concentric circle method is used for drawing ellipses in general, but the specific isometric method is the 4-center method.", "Using general ellipse method name"),
        hint("B", "Oblong method is not a standard term for isometric circle construction.", "Non-standard terminology"),
        hint("C", "The trammel method draws exact ellipses using a strip. The 4-center method is the approximate method specific to isometric drawing.", "Confusing exact with approximate method"),
    ]
})
questions.append(q36)

# ═══════════════════════════════════════════════════════════════════════════════
# SCENARIO-BASED (2): cuet-eg-isometric-37 to 38
# ═══════════════════════════════════════════════════════════════════════════════

q37 = base("cuet-eg-isometric-37", "scenario-based", "medium", "apply", "Machine Part Isometric", ["real-world", "isometric-construction"])
q37.update({
    "question_text": "Based on the scenario, how many visible faces can the engineer show in a single isometric view?",
    "scenario": "A mechanical engineer needs to create an isometric drawing of a rectangular machine bracket. The bracket is 80 mm long, 50 mm wide, and 30 mm tall. The engineer wants to show maximum information in a single isometric view using true lengths (isometric drawing).",
    "correct_answer": "C",
    "explanation": "In a standard isometric view, a maximum of 3 faces of a rectangular object are visible: the top face, one side (front) face, and one end (right) face. The other 3 faces are hidden.",
    "options": [
        opt("A", "1"),
        opt("B", "2"),
        opt("C", "3", True),
        opt("D", "6"),
    ],
    "elimination_hints": [
        hint("A", "1 face visible is a standard orthographic view, not an isometric view.", "Confusing orthographic with isometric"),
        hint("B", "2 faces visible occurs in some oblique views. Standard isometric shows 3 faces.", "Undercounting visible faces"),
        hint("D", "6 faces means all faces visible. Opposite faces are always hidden. Maximum 3 faces visible.", "Assuming transparency or all-around view"),
    ]
})
questions.append(q37)

q38 = base("cuet-eg-isometric-38", "scenario-based", "hard", "evaluate", "Assembly Isometric", ["real-world", "isometric-application"])
q38.update({
    "question_text": "Based on the scenario, what is the correct approach for drawing the cylindrical holes in isometric?",
    "scenario": "A designer is creating an isometric assembly drawing of a mounting plate with cylindrical holes. The plate is horizontal (on the top isometric plane), and the holes pass vertically through it. The true diameter of each hole is 20 mm.",
    "correct_answer": "A",
    "explanation": "Since the holes are on the top (horizontal) isometric plane, each hole appears as an ellipse in the isometric view. The 4-center approximate method is used to draw these ellipses. For isometric drawing (true lengths), the enclosing rhombus has sides = 20 mm.",
    "options": [
        opt("A", "Draw ellipses using the 4-center method on the top isometric plane", True),
        opt("B", "Draw perfect circles of 20 mm diameter"),
        opt("C", "Draw squares of 20 mm side"),
        opt("D", "Draw ellipses with major axis vertical"),
    ],
    "elimination_hints": [
        hint("B", "Perfect circles would only be correct if the holes were on a plane parallel to the projection plane. On the top isometric plane, circles appear as ellipses.", "Assuming circles stay circular in isometric"),
        hint("C", "Squares approximate the enclosing shape but don't represent circular holes. Ellipses are needed.", "Using squares instead of ellipses for circles"),
        hint("D", "Ellipses on the top face have a horizontal major axis, not vertical. Vertical major axis corresponds to side faces.", "Wrong major axis orientation for top face"),
    ]
})
questions.append(q38)

# ═══════════════════════════════════════════════════════════════════════════════
# LOGICAL-SEQUENCE (2): cuet-eg-isometric-39 to 40
# ═══════════════════════════════════════════════════════════════════════════════

q39 = base("cuet-eg-isometric-39", "logical-sequence", "medium", "understand", "Isometric Drawing Steps", ["construction", "drawing-steps"])
q39.update({
    "question_text": "Arrange the steps for drawing an isometric view of a rectangular block from given orthographic views:",
    "items": [
        {"id": "1", "text": "Study the orthographic views and identify the length (L), width (W), and height (H)"},
        {"id": "2", "text": "Draw the three isometric axes (vertical + two at 30° to horizontal)"},
        {"id": "3", "text": "Mark L along one axis, W along the other, and H along the vertical axis"},
        {"id": "4", "text": "Complete the isometric box by drawing parallel lines from each endpoint"},
        {"id": "5", "text": "Darken the visible edges and show hidden edges as dashed lines (if needed)"},
        {"id": "6", "text": "Add dimensions and title"}
    ],
    "correct_order": ["1", "2", "3", "4", "5", "6"],
    "correct_answer": "D",
    "explanation": "Correct order: Read ortho views → Draw axes → Mark dimensions → Complete the box → Darken/hide edges → Add dimensions.",
    "options": [
        opt("A", "2, 1, 3, 4, 5, 6"),
        opt("B", "1, 3, 2, 4, 5, 6"),
        opt("C", "1, 2, 4, 3, 5, 6"),
        opt("D", "1, 2, 3, 4, 5, 6", True),
    ],
    "elimination_hints": [
        hint("A", "Step 2 (draw axes) before Step 1 (study views) means drawing without knowing the dimensions. Always analyze first.", "Drawing before understanding"),
        hint("B", "Step 3 (mark dimensions) before Step 2 (draw axes) is impossible. You need axes to mark dimensions on.", "Marking dimensions without axes"),
        hint("C", "Step 4 (complete box) before Step 3 (mark dimensions) won't work. The box needs the dimension endpoints.", "Completing box without marking dimensions"),
    ]
})
questions.append(q39)

q40 = base("cuet-eg-isometric-40", "logical-sequence", "hard", "analyze", "4-Center Ellipse Steps", ["four-center", "construction-steps"])
q40.update({
    "question_text": "Arrange the steps for drawing an isometric ellipse using the 4-center approximate method on the top face:",
    "items": [
        {"id": "1", "text": "Draw the isometric rhombus (parallelogram) enclosing the circle on the top isometric plane"},
        {"id": "2", "text": "Find the midpoints of all four sides of the rhombus"},
        {"id": "3", "text": "Draw perpendicular bisectors from the midpoints of the shorter diagonal's sides toward the obtuse angle corners"},
        {"id": "4", "text": "Identify the four centers: two at the obtuse angle corners and two at the intersection of perpendicular bisectors"},
        {"id": "5", "text": "Draw two large arcs from the obtuse-angle centers passing through adjacent midpoints"},
        {"id": "6", "text": "Draw two small arcs from the other two centers to complete the ellipse"}
    ],
    "correct_order": ["1", "2", "3", "4", "5", "6"],
    "correct_answer": "A",
    "explanation": "Correct order: Draw rhombus → Find midpoints → Draw perpendicular bisectors → Identify 4 centers → Draw large arcs → Draw small arcs to complete.",
    "options": [
        opt("A", "1, 2, 3, 4, 5, 6", True),
        opt("B", "1, 3, 2, 4, 5, 6"),
        opt("C", "2, 1, 3, 4, 6, 5"),
        opt("D", "1, 2, 4, 3, 5, 6"),
    ],
    "elimination_hints": [
        hint("B", "Step 3 (perpendicular bisectors) before Step 2 (finding midpoints) won't work. Bisectors originate from midpoints.", "Drawing bisectors before finding midpoints"),
        hint("C", "Step 2 (midpoints) before Step 1 (rhombus) is impossible. You need the rhombus sides to find their midpoints.", "Finding midpoints of non-existent sides"),
        hint("D", "Step 4 (identify centers) before Step 3 (draw bisectors) won't work. Two of the four centers are found by the bisector intersections.", "Identifying centers without bisectors"),
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
