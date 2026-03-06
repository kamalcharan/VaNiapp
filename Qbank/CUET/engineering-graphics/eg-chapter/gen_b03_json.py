#!/usr/bin/env python3
"""Generate the 40-question JSON for B03: Projection of Planes."""
import json, os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cuet-eg-planes-b03.json")

def base(qid, qtype, diff, bloom, subtopic, tags):
    return {
        "id": qid,
        "chapter_id": "cuet-eg-engineering-graphics",
        "topic_id": "cuet-eg-planes",
        "question_type": qtype,
        "difficulty": diff,
        "subject": "engineering-graphics",
        "chapter": "Engineering Graphics",
        "topic": "Projection of Planes",
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
# MCQ — EASY (5): cuet-eg-planes-01 to 05
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(mcq(
    "cuet-eg-planes-01", "easy", "remember", "Plane Types",
    ["plane-types", "classification"],
    "Which of the following is NOT a standard type of plane surface studied in projection of planes?",
    [opt("A", "Triangular plane"),
     opt("B", "Rectangular plane"),
     opt("C", "Spherical plane", True),
     opt("D", "Pentagonal plane")],
    "C",
    "A sphere is a curved surface, not a plane surface. Standard plane surfaces studied in projections include triangular, rectangular, square, pentagonal, hexagonal, and circular (disc) planes.",
    [hint("A", "Triangular planes are one of the most common plane figures studied in projection of planes.", "Rejecting a standard plane type"),
     hint("B", "Rectangular planes are standard plane surfaces used in projection problems.", "Rejecting a standard plane type"),
     hint("D", "Pentagonal planes are regular polygonal planes commonly included in the syllabus.", "Rejecting a standard plane type")]
))

questions.append(mcq(
    "cuet-eg-planes-02", "easy", "remember", "Plane Parallel to HP",
    ["plane-parallel-hp", "true-shape"],
    "When a plane surface is parallel to the HP, which view shows its true shape?",
    [opt("A", "Front view"),
     opt("B", "Top view", True),
     opt("C", "Side view"),
     opt("D", "Auxiliary view")],
    "B",
    "When a plane is parallel to HP, its projection on HP (the top view) shows the true shape. The front view appears as a straight line parallel to the XY reference line (edge view).",
    [hint("A", "The front view of a plane parallel to HP is a straight line (edge view), not the true shape.", "Confusing edge view with true shape"),
     hint("C", "Side view shows true shape only when the plane is parallel to the profile plane.", "Applying the wrong plane correspondence"),
     hint("D", "Auxiliary views are used for special cases. For a plane parallel to HP, the standard top view suffices.", "Overcomplicating a simple case")]
))

questions.append(mcq(
    "cuet-eg-planes-03", "easy", "remember", "Edge View",
    ["edge-view", "perpendicular-plane"],
    "A plane surface appears as a straight line (edge view) in a projection when the plane is:",
    [opt("A", "Parallel to that plane of projection"),
     opt("B", "Perpendicular to that plane of projection", True),
     opt("C", "Inclined at 45° to that plane of projection"),
     opt("D", "Oblique to all planes of projection")],
    "B",
    "When a plane surface is perpendicular to a projection plane, its projection on that plane reduces to a straight line (edge view). This is because we are viewing the plane 'edge-on'.",
    [hint("A", "A plane parallel to a projection plane shows its true shape in that view, not an edge view.", "Confusing parallel with perpendicular"),
     hint("C", "At 45° inclination, the plane shows a foreshortened shape, not a straight line.", "Not understanding edge view conditions"),
     hint("D", "An oblique plane shows apparent shapes in all views, never an edge view in any standard view.", "Confusing oblique with perpendicular")]
))

questions.append(mcq(
    "cuet-eg-planes-04", "easy", "remember", "Plane Parallel to VP",
    ["plane-parallel-vp", "front-view"],
    "A rectangular plane ABCD is parallel to the VP and 25 mm in front of it. The front view of this plane will be:",
    [opt("A", "A straight line on XY"),
     opt("B", "A foreshortened rectangle"),
     opt("C", "A rectangle showing true shape", True),
     opt("D", "A point")],
    "C",
    "When a plane is parallel to VP, its front view (projection on VP) shows the true shape. Since the plane is a rectangle, the front view will be a rectangle of the same dimensions.",
    [hint("A", "A straight line on XY would mean the plane is perpendicular to VP, not parallel to it.", "Confusing perpendicular with parallel"),
     hint("B", "Foreshortening occurs when the plane is inclined, not when it is parallel to the projection plane.", "Applying foreshortening to a parallel plane"),
     hint("D", "A point projection occurs for a line perpendicular to the plane, not for a plane surface.", "Confusing line projection with plane projection")]
))

questions.append(mcq(
    "cuet-eg-planes-05", "easy", "remember", "Plane Perpendicular to Both",
    ["perpendicular-both", "profile-plane"],
    "A plane that is perpendicular to both HP and VP is parallel to the:",
    [opt("A", "Horizontal Plane"),
     opt("B", "Vertical Plane"),
     opt("C", "Profile Plane", True),
     opt("D", "Oblique Plane")],
    "C",
    "A plane perpendicular to both HP and VP must be parallel to the third principal plane — the Profile Plane (PP). Its true shape is seen in the side view.",
    [hint("A", "A plane ⊥ to HP and VP cannot be parallel to HP (that would contradict ⊥ to HP).", "Logical contradiction"),
     hint("B", "A plane ⊥ to HP and VP cannot be parallel to VP (that would contradict ⊥ to VP).", "Logical contradiction"),
     hint("D", "Oblique planes are not principal planes. A plane ⊥ to both HP and VP is parallel to the profile plane, which is a principal plane.", "Confusing oblique with profile")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# MCQ — MEDIUM (10): cuet-eg-planes-06 to 15
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(mcq(
    "cuet-eg-planes-06", "medium", "understand", "Inclined Plane FV",
    ["inclined-plane", "edge-view-angle"],
    "A square plane is perpendicular to the VP and inclined at 30° to the HP. In the front view, the plane will appear as:",
    [opt("A", "A square showing true shape"),
     opt("B", "A straight line inclined at 30° to XY", True),
     opt("C", "A rectangle"),
     opt("D", "A straight line parallel to XY")],
    "B",
    "Since the plane is perpendicular to VP, its front view is always an edge view (straight line). The inclination of this line to XY shows the true angle of inclination with HP, which is 30°.",
    [hint("A", "True shape appears only when the plane is parallel to the projection plane. This plane is perpendicular to VP, so the FV is a line.", "Confusing perpendicular with parallel for true shape"),
     hint("C", "A rectangle in FV would mean the plane has some extent in the depth direction visible in the front view, which contradicts ⊥ VP.", "Imagining depth in the front view for a plane ⊥ VP"),
     hint("D", "Parallel to XY would mean the plane is also parallel to HP, but it is inclined at 30°.", "Ignoring the stated inclination angle")]
))

questions.append(mcq(
    "cuet-eg-planes-07", "medium", "understand", "Top View of Inclined Plane",
    ["inclined-plane", "foreshortened-shape"],
    "A regular hexagonal plane with 30 mm side is perpendicular to the VP and inclined at 45° to the HP. The top view of this plane will be:",
    [opt("A", "A regular hexagon with 30 mm side"),
     opt("B", "A straight line"),
     opt("C", "A foreshortened hexagon", True),
     opt("D", "A circle")],
    "C",
    "When a plane is perpendicular to VP and inclined to HP, the top view shows a foreshortened shape. The dimension perpendicular to the VP remains true, but the dimension along the inclination is shortened by the factor cos(45°).",
    [hint("A", "A regular hexagon in top view would require the plane to be parallel to HP. Since it's inclined, the shape is foreshortened.", "Ignoring the foreshortening due to inclination"),
     hint("B", "A straight line in top view would mean the plane is perpendicular to HP, not inclined to it.", "Confusing perpendicular to HP with inclined to HP"),
     hint("D", "A circle is the top view of a sphere or cone, not of a hexagonal plane surface.", "Confusing plane shapes with solid projections")]
))

questions.append(mcq(
    "cuet-eg-planes-08", "medium", "apply", "Two-Step Method",
    ["two-step-method", "projection-steps"],
    "In the two-step projection method for a plane inclined to HP and perpendicular to VP, the first step involves drawing the plane as if it were:",
    [opt("A", "Perpendicular to HP"),
     opt("B", "Inclined at 45° to HP"),
     opt("C", "Perpendicular to both HP and VP"),
     opt("D", "Parallel to HP", True)],
    "D",
    "In the two-step method, Step 1 places the plane parallel to HP (to get the true shape in the top view). Step 2 tilts the front view to the required inclination angle with HP, and the new top view is obtained by projecting from the tilted front view.",
    [hint("A", "Starting with ⊥ HP gives an edge view in the top view, making it hard to obtain the true shape first. The method starts with ∥ HP.", "Reversing the initial position"),
     hint("B", "Starting at 45° doesn't simplify the construction. The method starts with ∥ HP for the true shape, then tilts.", "Not understanding the purpose of the initial position"),
     hint("C", "⊥ to both HP and VP gives edge views in both FV and TV, which is not useful as a starting position.", "Overcomplicating the initial position")]
))

questions.append(mcq(
    "cuet-eg-planes-09", "medium", "apply", "Foreshortened Dimension",
    ["foreshortened-dimension", "cosine-rule"],
    "A circular disc of diameter 60 mm is inclined at 30° to the HP and perpendicular to the VP. The minor axis of the ellipse in the top view will be:",
    [opt("A", "60 mm"),
     opt("B", "30 mm"),
     opt("C", "51.96 mm", True),
     opt("D", "42.43 mm")],
    "C",
    "A circular disc inclined to HP appears as an ellipse in the top view. The major axis equals the diameter (60 mm, unchanged). The minor axis = diameter × cos(30°) = 60 × 0.866 = 51.96 mm.",
    [hint("A", "60 mm is the major axis (diameter), not the minor axis. The minor axis is foreshortened.", "Confusing major and minor axes"),
     hint("B", "30 mm = 60 × sin 30°, which gives the height component, not the minor axis of the ellipse.", "Using sine instead of cosine"),
     hint("D", "42.43 mm = 60 × cos 45°, using the wrong angle. The inclination is 30°, not 45°.", "Using wrong angle")]
))

questions.append(mcq(
    "cuet-eg-planes-10", "medium", "understand", "Oblique Plane",
    ["oblique-plane", "no-edge-view"],
    "When a plane is inclined to both HP and VP (oblique position), which of the following is true?",
    [opt("A", "The front view shows the true shape"),
     opt("B", "The top view shows the true shape"),
     opt("C", "Both views show foreshortened (apparent) shapes", True),
     opt("D", "One view shows the edge and the other shows the true shape")],
    "C",
    "When a plane is inclined to both HP and VP, neither view shows the true shape. Both the front view and top view show foreshortened (apparent) shapes. The true shape can only be obtained through auxiliary projection.",
    [hint("A", "True shape in front view requires the plane to be parallel to VP, which contradicts inclined to VP.", "Ignoring the inclination to VP"),
     hint("B", "True shape in top view requires the plane to be parallel to HP, which contradicts inclined to HP.", "Ignoring the inclination to HP"),
     hint("D", "Edge view occurs when the plane is perpendicular to a projection plane. An oblique plane is inclined (not ⊥) to both.", "Confusing inclined with perpendicular")]
))

questions.append(mcq(
    "cuet-eg-planes-11", "medium", "apply", "Three-Step Method Reason",
    ["three-step-method", "oblique-plane"],
    "Why is a three-step method needed for the projection of a plane inclined to both HP and VP?",
    [opt("A", "To make the drawing more accurate"),
     opt("B", "Because two angles of inclination cannot be set simultaneously in one step", True),
     opt("C", "To reduce the size of the drawing"),
     opt("D", "To find the auxiliary plane")],
    "B",
    "In orthographic projection, we can only set one angle at a time. Step 1 gets the true shape (plane ∥ HP). Step 2 sets the angle with HP. Step 3 sets the angle with VP. Both angles cannot be achieved in a single construction step.",
    [hint("A", "Accuracy is not the reason. The three-step method is structurally necessary, not an accuracy improvement.", "Confusing necessity with accuracy"),
     hint("C", "The three-step method does not affect drawing size. It is a construction technique for setting two inclinations.", "Confusing method purpose"),
     hint("D", "Auxiliary planes may be used in auxiliary projection, but the three-step method is about sequentially setting inclinations.", "Confusing three-step with auxiliary view methods")]
))

questions.append(mcq(
    "cuet-eg-planes-12", "medium", "apply", "Triangular Plane Projection",
    ["triangular-plane", "perpendicular-hp"],
    "An equilateral triangular plane with 40 mm side is perpendicular to the HP and inclined at 60° to the VP. The top view of this plane will be:",
    [opt("A", "A triangle showing true shape"),
     opt("B", "A straight line inclined at 60° to XY", True),
     opt("C", "A straight line parallel to XY"),
     opt("D", "A foreshortened triangle")],
    "B",
    "Since the plane is perpendicular to HP, its top view is an edge view (straight line). The inclination of this line to XY shows the true angle of inclination with VP, which is 60°.",
    [hint("A", "True shape in top view requires the plane to be parallel to HP. This plane is ⊥ HP, so the TV is a line.", "Confusing ⊥ with ∥"),
     hint("C", "Parallel to XY would mean the plane is also parallel to VP. Since it's inclined at 60° to VP, the line is also at 60° to XY.", "Ignoring the VP inclination"),
     hint("D", "A foreshortened triangle occurs when the plane is inclined (not perpendicular) to HP.", "Confusing inclined with perpendicular")]
))

questions.append(mcq(
    "cuet-eg-planes-13", "medium", "understand", "Plane on HP",
    ["plane-on-hp", "special-position"],
    "A pentagonal plane lies in the HP itself. Its front view and top view will be:",
    [opt("A", "FV: pentagon on XY; TV: straight line"),
     opt("B", "FV: straight line on XY; TV: pentagon showing true shape", True),
     opt("C", "Both: pentagon showing true shape"),
     opt("D", "FV: straight line above XY; TV: pentagon")],
    "B",
    "A plane lying in (on) the HP is a special case of parallel to HP with zero height. The front view is a straight line on XY itself (height = 0). The top view shows the true shape of the pentagon.",
    [hint("A", "This reverses the views. The front view is a line (not the shape), and the top view shows the true shape.", "Swapping front and top view results"),
     hint("C", "A plane can show its true shape in only one standard view — the one corresponding to the plane it is parallel to.", "Expecting true shape in both views"),
     hint("D", "Above XY would mean the plane is above HP, but the plane lies ON (in) the HP, so the FV line is on XY itself.", "Placing the FV above XY for a plane on HP")]
))

questions.append(mcq(
    "cuet-eg-planes-14", "medium", "apply", "Step 2 Construction",
    ["two-step-method", "front-view-tilting"],
    "In the two-step method for a plane inclined at θ to HP and ⊥ VP, after drawing the true shape in Step 1, what is done in Step 2?",
    [opt("A", "The top view is tilted to angle θ with XY"),
     opt("B", "The front view line is tilted to angle θ with XY", True),
     opt("C", "A new XY line is drawn at angle θ"),
     opt("D", "The side view is constructed")],
    "B",
    "In Step 2, the front view (which was a line parallel to XY in Step 1) is redrawn inclined at angle θ to XY. New projectors from this tilted FV are drawn down to get the foreshortened top view.",
    [hint("A", "Tilting the top view changes the inclination with VP, not HP. To set the HP angle, the front view is tilted.", "Confusing which view controls which angle"),
     hint("C", "Drawing a new XY line is part of auxiliary view construction, not the standard two-step change-of-position method.", "Confusing two-step method with auxiliary view method"),
     hint("D", "Side view construction is not part of the standard two-step method for planes ⊥ VP and inclined to HP.", "Adding unnecessary construction")]
))

questions.append(mcq(
    "cuet-eg-planes-15", "medium", "apply", "Rectangular Plane Dimensions",
    ["rectangular-plane", "foreshortening"],
    "A rectangular plane 50 mm × 30 mm is perpendicular to VP and inclined at 60° to HP with its longer edge on HP. The top view dimensions will be:",
    [opt("A", "50 mm × 30 mm"),
     opt("B", "25 mm × 30 mm"),
     opt("C", "50 mm × 25.98 mm"),
     opt("D", "50 mm × 15 mm", True)],
    "D",
    "The longer edge (50 mm) is on HP and perpendicular to VP, so it appears as true length in the top view. The shorter edge (30 mm) is inclined at 60° to HP, so its top view = 30 × cos 60° = 30 × 0.5 = 15 mm. Top view: 50 mm × 15 mm.",
    [hint("A", "50 × 30 is the true shape. The top view is foreshortened because the plane is inclined to HP.", "Ignoring foreshortening"),
     hint("B", "25 × 30 applies the wrong cosine factor to the wrong edge. The 50 mm edge on HP stays true length.", "Applying foreshortening to the wrong dimension"),
     hint("C", "25.98 = 30 × cos 30°, using the wrong angle. The inclination is 60°, not 30°.", "Using complementary angle")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# MCQ — HARD (5): cuet-eg-planes-16 to 20
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(mcq(
    "cuet-eg-planes-16", "hard", "analyze", "Apparent Angle Relationship",
    ["apparent-angle", "true-angle"],
    "A plane is inclined at true angles θ to HP and φ to VP. The apparent angles observed in the front view (θ') and top view (φ') satisfy:",
    [opt("A", "θ' = θ and φ' = φ"),
     opt("B", "θ' < θ and φ' < φ"),
     opt("C", "θ' > θ and φ' > φ", True),
     opt("D", "θ' + φ' = 90°")],
    "C",
    "When a plane is inclined to both HP and VP, the apparent angles in the views are always greater than the true angles. This is analogous to the line projection rule: foreshortening of one component makes the angle appear steeper.",
    [hint("A", "θ' = θ only when the plane is ⊥ to VP. When inclined to both planes, apparent angles exceed true angles.", "Applying the single-plane rule to a doubly-inclined case"),
     hint("B", "θ' < θ would mean the plane appears less inclined than it actually is, which contradicts the foreshortening principle.", "Reversing the apparent angle relationship"),
     hint("D", "θ' + φ' = 90° is not a general relationship. The sum of apparent angles varies with the plane orientation.", "Assuming a fixed-sum rule")]
))

questions.append(mcq(
    "cuet-eg-planes-17", "hard", "analyze", "Auxiliary View for True Shape",
    ["auxiliary-view", "true-shape"],
    "To find the true shape of a plane that appears as a line (edge view) in the front view, the auxiliary plane must be drawn:",
    [opt("A", "Perpendicular to HP"),
     opt("B", "Parallel to the edge view", True),
     opt("C", "At 45° to XY"),
     opt("D", "Perpendicular to the edge view")],
    "B",
    "To obtain the true shape from an edge view, the auxiliary reference line (X₁Y₁) must be drawn parallel to the edge view. This makes the auxiliary projection plane parallel to the actual plane, thereby showing the true shape.",
    [hint("A", "Perpendicular to HP is the VP itself. The auxiliary plane must be specifically oriented relative to the edge view, not HP.", "Using a fixed plane instead of an oriented auxiliary"),
     hint("C", "45° to XY has no special significance. The auxiliary reference line must be parallel to the edge view to get the true shape.", "Guessing a standard angle"),
     hint("D", "Perpendicular to the edge view would give another edge view, not the true shape.", "Drawing the auxiliary in the wrong orientation")]
))

questions.append(mcq(
    "cuet-eg-planes-18", "hard", "apply", "Hexagonal Plane Projection",
    ["hexagonal-plane", "inclined-both"],
    "A regular hexagonal plane with 25 mm side is inclined at 30° to HP and 45° to VP. In Step 2 of the three-step method (after tilting to HP angle), the front view appears as a line of length equal to:",
    [opt("A", "The distance across flats of the hexagon"),
     opt("B", "The longest diagonal of the hexagon (50 mm)", True),
     opt("C", "25 mm (one side)"),
     opt("D", "43.3 mm (across flats)")],
    "B",
    "When the hexagonal plane (with a vertex at top/bottom in the initial true shape position) is tilted in Step 2, the front view edge length equals the maximum extent of the true shape in the direction perpendicular to the tilt axis. For a regular hexagon with side 25 mm, the longest diagonal = 2 × 25 = 50 mm.",
    [hint("A", "Across flats = 25√3 ≈ 43.3 mm. This is the extent when the flat side is perpendicular to the viewing direction, not the vertex.", "Confusing flat-to-flat with corner-to-corner"),
     hint("C", "25 mm is just one side of the hexagon. The edge view spans the full extent of the shape.", "Using a single side length"),
     hint("D", "43.3 mm is the across-flats dimension, which applies when the flat is facing the observer. With vertex up/down, the diagonal (50 mm) is the correct extent.", "Using across-flats instead of diagonal")]
))

questions.append(mcq(
    "cuet-eg-planes-19", "hard", "evaluate", "Surface Area in Projection",
    ["projected-area", "cosine-rule"],
    "A plane with true area A is inclined at angle θ to the HP. The area of its top view is:",
    [opt("A", "A × sin θ"),
     opt("B", "A × cos θ", True),
     opt("C", "A × tan θ"),
     opt("D", "A × cos²θ")],
    "B",
    "The projected area of a plane inclined at angle θ to the projection plane = True Area × cos θ. This is because one dimension is foreshortened by cos θ while the other remains unchanged.",
    [hint("A", "A × sin θ gives the area of the front view projection (on VP) for a plane inclined at θ to HP, not the top view.", "Using sine for the wrong view"),
     hint("C", "A × tan θ has no geometric meaning in projection and would give values exceeding the true area for θ > 45°.", "Using an incorrect trigonometric function"),
     hint("D", "A × cos²θ would mean both dimensions are foreshortened, which only happens when the plane is inclined to both HP and VP.", "Applying double foreshortening to a single-plane case")]
))

questions.append(mcq(
    "cuet-eg-planes-20", "hard", "evaluate", "Plane Inclination Limits",
    ["inclination-limits", "geometric-constraint"],
    "For a plane inclined at true angle θ to HP and true angle φ to VP, the relationship between θ and φ is:",
    [opt("A", "θ + φ = 90°"),
     opt("B", "θ + φ > 90°"),
     opt("C", "θ + φ ≤ 90°", True),
     opt("D", "θ + φ can take any value")],
    "C",
    "For a plane surface, the sum of true inclinations with HP and VP satisfies θ + φ ≤ 90°. The equality holds when the plane is perpendicular to the profile plane (PP). This is the opposite of the rule for lines (α + β ≥ 90°).",
    [hint("A", "θ + φ = 90° is only a special case (plane ⊥ PP), not the general rule. The general rule allows θ + φ < 90° as well.", "Taking a special case as the universal rule"),
     hint("B", "θ + φ > 90° is the rule for LINES, not planes. For planes, the inequality is reversed.", "Applying the line rule to planes"),
     hint("D", "The angles are geometrically constrained. A plane cannot be inclined at arbitrary angles to both HP and VP simultaneously.", "Ignoring geometric constraints")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# DIAGRAM-BASED (4): cuet-eg-planes-21 to 24
# ═══════════════════════════════════════════════════════════════════════════════

q21 = base("cuet-eg-planes-21", "diagram-based", "easy", "apply", "Plane Perpendicular to VP", ["edge-view", "inclined-plane"])
q21.update({
    "question_text": "From the figure, what is the true angle of inclination of the plane with the HP?",
    "correct_answer": "D",
    "explanation": "The diagram shows a plane perpendicular to VP with its front view as an edge (straight line). The angle between this edge view and the XY line is the true angle of inclination with HP, which is marked as 45° in the figure.",
    "image_uri": "question-images/engineering-graphics/planes/cuet-eg-planes-31-perp-vp-inclined-hp.png",
    "image_alt": "Front view showing edge view of a plane at 45° to XY, with top view showing a foreshortened rectangle below XY.",
    "options": [
        opt("A", "30°"),
        opt("B", "60°"),
        opt("C", "90°"),
        opt("D", "45°", True),
    ],
    "elimination_hints": [
        hint("A", "30° does not match the angle shown in the diagram between the edge view and XY.", "Misreading the diagram"),
        hint("B", "60° is the complement of 30°, neither of which matches the 45° shown in the front view.", "Confusing complementary angles"),
        hint("C", "90° would mean the plane is perpendicular to HP, which would show the edge view vertical in the FV.", "Confusing perpendicular to HP with the observed angle"),
    ]
})
questions.append(q21)

q22 = base("cuet-eg-planes-22", "diagram-based", "medium", "analyze", "Plane Parallel to HP", ["parallel-hp", "true-shape-identification"])
q22.update({
    "question_text": "The figure shows a rectangular plane parallel to HP. Which labeled view shows the TRUE SHAPE of the plane?",
    "correct_answer": "A",
    "explanation": "When a plane is parallel to HP, the top view shows the true shape. In the diagram, the top view (below XY) is labeled as 'TRUE SHAPE' and shows the full rectangle abcd. The front view is a line parallel to XY.",
    "image_uri": "question-images/engineering-graphics/planes/cuet-eg-planes-32-parallel-hp.png",
    "image_alt": "Rectangular plane parallel to HP: front view as a horizontal line above XY, top view as a rectangle labeled TRUE SHAPE below XY.",
    "options": [
        opt("A", "The top view (rectangle below XY)", True),
        opt("B", "The front view (line above XY)"),
        opt("C", "Both views show true shape"),
        opt("D", "Neither view shows true shape"),
    ],
    "elimination_hints": [
        hint("B", "The front view is a straight line (edge view). A line cannot represent the true shape of a 2D plane.", "Taking an edge view as true shape"),
        hint("C", "Only one view can show the true shape. The front view is an edge, so only the top view qualifies.", "Thinking both views can show true shape simultaneously"),
        hint("D", "The diagram clearly labels the top view as TRUE SHAPE. A plane parallel to HP always shows true shape in top view.", "Ignoring the fundamental projection rule"),
    ]
})
questions.append(q22)

q23 = base("cuet-eg-planes-23", "diagram-based", "medium", "analyze", "Two-Step Method Steps", ["two-step-method", "construction-steps"])
q23.update({
    "question_text": "The figure shows the two-step method. In Step 1, the pentagonal plane is placed parallel to HP. What is the purpose of Step 1?",
    "correct_answer": "C",
    "explanation": "Step 1 places the plane parallel to HP so that the top view shows the true shape of the pentagon. This true shape is needed as a reference for constructing the foreshortened top view in Step 2, where the plane is tilted to the required angle.",
    "image_uri": "question-images/engineering-graphics/planes/cuet-eg-planes-33-two-step-method.png",
    "image_alt": "Two-step method: Step 1 shows plane parallel to HP with true shape pentagon in top view; Step 2 shows tilted front view and foreshortened top view.",
    "options": [
        opt("A", "To find the edge view length"),
        opt("B", "To determine the angle of inclination"),
        opt("C", "To obtain the true shape for reference in subsequent construction", True),
        opt("D", "To draw the final projection directly"),
    ],
    "elimination_hints": [
        hint("A", "The edge view length can be determined from the true shape dimensions. Step 1's primary purpose is obtaining the true shape.", "Confusing a secondary result with the primary purpose"),
        hint("B", "The angle of inclination is given in the problem. Step 1 is about getting the shape, not the angle.", "Confusing given data with construction purpose"),
        hint("D", "Step 1 does not give the final projection. The final projection requires Step 2 (tilting to the required angle).", "Thinking Step 1 alone completes the projection"),
    ]
})
questions.append(q23)

q24 = base("cuet-eg-planes-24", "diagram-based", "hard", "evaluate", "Three-Step Method", ["three-step-method", "inclined-both-planes"])
q24.update({
    "question_text": "The figure shows the three-step method for a plane inclined to both HP and VP. In Step 3, what change is made to set the inclination with VP?",
    "correct_answer": "D",
    "explanation": "In Step 3, the top view from Step 2 is redrawn with one edge (or axis) inclined at the required angle φ to the XY line. This sets the inclination of the plane with VP. New projectors from this tilted top view give the final front view.",
    "image_uri": "question-images/engineering-graphics/planes/cuet-eg-planes-34-inclined-both.png",
    "image_alt": "Three-step method: Step 1 (true shape + FV parallel to XY), Step 2 (FV tilted at theta), Step 3 (TV tilted at phi with final apparent shapes in both views).",
    "options": [
        opt("A", "The front view is tilted again to a new angle"),
        opt("B", "An auxiliary XY line is introduced"),
        opt("C", "The true shape is redrawn at a different scale"),
        opt("D", "The top view from Step 2 is redrawn with an edge at angle φ to XY", True),
    ],
    "elimination_hints": [
        hint("A", "In Step 3, the top view is tilted, not the front view. Tilting the FV again would change the HP angle, not the VP angle.", "Confusing which view controls which angle"),
        hint("B", "Auxiliary XY lines are used in auxiliary view methods, not in the standard three-step change-of-position method.", "Confusing construction methods"),
        hint("C", "The true shape is drawn only in Step 1. Steps 2 and 3 deal with tilting views, not redrawing the true shape.", "Misunderstanding the purpose of later steps"),
    ]
})
questions.append(q24)

# ═══════════════════════════════════════════════════════════════════════════════
# ASSERTION-REASONING (4): cuet-eg-planes-25 to 28
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(ar_q(
    "cuet-eg-planes-25", "medium", "understand", "True Shape View",
    ["true-shape", "parallel-plane"],
    "The true shape of a plane is visible in the view where the plane is parallel to the projection plane.",
    "When a plane is parallel to a projection plane, all its points are equidistant from that plane, so no foreshortening occurs.",
    "A",
    "Both A and R are true, and R correctly explains A. Since all points of the plane are equidistant from the parallel projection plane, perpendicular projectors from each point create an identical (un-foreshortened) image — the true shape.",
    [hint("B", "R directly explains A. The equidistance of points is the geometric reason why no foreshortening occurs, which is why the true shape is visible.", "Failing to connect equidistance with no foreshortening"),
     hint("C", "R is true — equidistance from the plane of projection is precisely what 'parallel to a plane' means.", "Rejecting the definition of parallel planes"),
     hint("D", "A is true — this is a fundamental principle of orthographic projection taught in every textbook.", "Rejecting a core projection principle")]
))

questions.append(ar_q(
    "cuet-eg-planes-26", "medium", "understand", "Edge View Condition",
    ["edge-view", "perpendicular-plane"],
    "A plane perpendicular to the VP always appears as a straight line in the front view.",
    "When a plane is perpendicular to a projection plane, all points of the plane project onto a single line on that plane.",
    "A",
    "Both A and R are true, and R correctly explains A. A plane ⊥ VP means all its points line up along a single projector direction when viewed from the front, resulting in a line (edge view) in the front view.",
    [hint("B", "R directly explains A. The collapsing of all points onto a line is exactly why the edge view appears.", "Failing to see the causal connection"),
     hint("C", "R is true — this is the geometric definition of why perpendicular planes project as lines.", "Rejecting a geometric fact"),
     hint("D", "A is true — every textbook states that a plane ⊥ VP gives a line FV (edge view).", "Rejecting a standard result")]
))

questions.append(ar_q(
    "cuet-eg-planes-27", "hard", "analyze", "Circular Disc Projection",
    ["circular-disc", "ellipse-projection"],
    "A circular disc inclined to the HP appears as an ellipse in the top view.",
    "The foreshortening of one diameter while the perpendicular diameter remains unchanged creates an elliptical projection.",
    "A",
    "Both A and R are true, and R correctly explains A. When a circular disc is tilted, the diameter along the tilt axis remains unchanged (major axis), while the perpendicular diameter is foreshortened by cos θ (minor axis). This unequal scaling of two perpendicular diameters transforms the circle into an ellipse.",
    [hint("B", "R directly explains A. The differential foreshortening of two perpendicular diameters is precisely why the circle becomes an ellipse.", "Failing to connect differential foreshortening with ellipse formation"),
     hint("C", "R is true — differential foreshortening is the correct geometric explanation for the circle-to-ellipse transformation.", "Rejecting the correct geometric explanation"),
     hint("D", "A is true — this is a well-known and easily verified result in projection geometry.", "Rejecting a standard projection result")]
))

questions.append(ar_q(
    "cuet-eg-planes-28", "hard", "analyze", "Plane Angle Rules",
    ["inclination-limits", "plane-vs-line"],
    "For a plane inclined to both HP and VP, the sum of true angles θ (with HP) and φ (with VP) is always greater than or equal to 90°.",
    "The geometric constraints on a plane in 3D space limit the sum of its inclinations with two mutually perpendicular planes.",
    "D",
    "A is false but R is true. For a PLANE, θ + φ ≤ 90° (not ≥ 90°). The assertion states ≥ 90°, which is the rule for LINES, not planes. The reason is true — geometric constraints do limit the angle sum, but the constraint is ≤ 90° for planes.",
    [hint("A", "The assertion states θ + φ ≥ 90°, which is the rule for lines, not planes. For planes, θ + φ ≤ 90°.", "Confusing the line rule with the plane rule"),
     hint("B", "A is false (the inequality is reversed for planes). You cannot select 'both true' when A is false.", "Not recognizing that the assertion is false"),
     hint("C", "R is true — geometric constraints do apply. The reason correctly states the existence of constraints, even though A states the wrong inequality.", "Rejecting the true reason")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# MATCH-THE-FOLLOWING (2): cuet-eg-planes-29 to 30
# ═══════════════════════════════════════════════════════════════════════════════

q29 = base("cuet-eg-planes-29", "match-the-following", "medium", "understand", "Plane Positions and Views", ["plane-positions", "view-types"])
q29.update({
    "question_text": "Match the plane position with what appears in the FRONT VIEW:\n\nColumn A: (P) Plane parallel to HP, (Q) Plane parallel to VP, (R) Plane perpendicular to VP, inclined to HP, (S) Plane perpendicular to HP, parallel to VP\nColumn B: (1) True shape, (2) Edge view (line) parallel to XY, (3) Edge view (line) inclined to XY, (4) Edge view (line) perpendicular to XY",
    "correct_answer": "A",
    "explanation": "P (∥ HP): FV is a line parallel to XY → (2). Q (∥ VP): FV shows true shape → (1). R (⊥ VP, inclined HP): FV is a line inclined to XY → (3). S (⊥ HP, ∥ VP): FV shows true shape AND the plane extends perpendicular to XY — actually S (⊥ HP, ∥ VP): the front view shows the true shape as a line perpendicular to XY? No. ⊥ HP means top view is edge. ∥ VP means FV shows true shape. So S→(1) and Q→(1)? That can't be. Let me reconsider S: ⊥ HP AND ∥ VP means the plane is a vertical plane parallel to VP. FV = true shape (1). But Q is also ∥ VP. Let me fix: S should be ⊥ HP, ⊥ VP → profile plane → FV is a vertical line → (4). Correcting.",
    "column_a": ["Plane parallel to HP", "Plane parallel to VP", "Plane ⊥ VP, inclined to HP", "Plane ⊥ both HP and VP"],
    "column_b": ["True shape", "Edge view (line) parallel to XY", "Edge view (line) inclined to XY", "Edge view (line) perpendicular to XY"],
    "correct_mapping": {"Plane parallel to HP": "Edge view (line) parallel to XY", "Plane parallel to VP": "True shape", "Plane ⊥ VP, inclined to HP": "Edge view (line) inclined to XY", "Plane ⊥ both HP and VP": "Edge view (line) perpendicular to XY"},
    "options": [
        opt("A", "P-2, Q-1, R-3, S-4", True),
        opt("B", "P-1, Q-2, R-3, S-4"),
        opt("C", "P-2, Q-1, R-4, S-3"),
        opt("D", "P-3, Q-1, R-2, S-4"),
    ],
    "elimination_hints": [
        hint("B", "P-1 says ∥ HP gives true shape in FV. But ∥ HP gives true shape in TV, not FV. FV is a line ∥ XY.", "Confusing TV and FV for ∥ HP"),
        hint("C", "R-4 says ⊥ VP inclined HP gives a perpendicular edge. But the inclination to HP makes the edge inclined, not perpendicular.", "Confusing inclined with perpendicular edge"),
        hint("D", "P-3 says ∥ HP gives an inclined edge in FV. But ∥ HP gives a horizontal edge (parallel to XY) in FV.", "Confusing parallel with inclined"),
    ]
})
# Fix the explanation
q29["explanation"] = "P (∥ HP): FV is edge ∥ XY → (2). Q (∥ VP): FV shows true shape → (1). R (⊥ VP, inclined HP): FV is edge inclined at θ to XY → (3). S (⊥ both HP and VP): FV is vertical edge ⊥ XY → (4)."
questions.append(q29)

q30 = base("cuet-eg-planes-30", "match-the-following", "hard", "analyze", "Plane Shapes in Projection", ["plane-shapes", "projection-appearance"])
q30.update({
    "question_text": "Match the plane surface with its top view when inclined at 45° to HP and ⊥ VP:\n\nColumn A: (P) Square, (Q) Circle, (R) Equilateral Triangle, (S) Regular Hexagon\nColumn B: (1) Ellipse, (2) Foreshortened square (rectangle), (3) Foreshortened triangle, (4) Foreshortened hexagon",
    "correct_answer": "D",
    "explanation": "When inclined at 45° to HP and ⊥ VP, each plane's top view is foreshortened. Square → rectangle (2), Circle → ellipse (1), Equilateral triangle → foreshortened triangle (3), Hexagon → foreshortened hexagon (4).",
    "column_a": ["Square", "Circle", "Equilateral Triangle", "Regular Hexagon"],
    "column_b": ["Ellipse", "Foreshortened square (rectangle)", "Foreshortened triangle", "Foreshortened hexagon"],
    "correct_mapping": {"Square": "Foreshortened square (rectangle)", "Circle": "Ellipse", "Equilateral Triangle": "Foreshortened triangle", "Regular Hexagon": "Foreshortened hexagon"},
    "options": [
        opt("A", "P-1, Q-2, R-3, S-4"),
        opt("B", "P-2, Q-1, R-4, S-3"),
        opt("C", "P-3, Q-1, R-2, S-4"),
        opt("D", "P-2, Q-1, R-3, S-4", True),
    ],
    "elimination_hints": [
        hint("A", "P-1 says a square becomes an ellipse. Only a circle becomes an ellipse when inclined. A square becomes a rectangle.", "Confusing circle with square projection"),
        hint("B", "R-4 and S-3 are swapped. A triangle remains a triangle (foreshortened), and a hexagon remains a hexagon (foreshortened).", "Swapping triangle and hexagon results"),
        hint("C", "P-3 says a square becomes a foreshortened triangle, which is impossible. A square foreshortens into a rectangle, maintaining 4 sides.", "Changing the number of sides in projection"),
    ]
})
questions.append(q30)

# ═══════════════════════════════════════════════════════════════════════════════
# TRUE-FALSE (4): cuet-eg-planes-31 to 34
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(tf_q(
    "cuet-eg-planes-31", "easy", "Edge View Rule",
    ["edge-view", "perpendicular"],
    "A plane that is perpendicular to the HP will always appear as a straight line in the top view.",
    True,
    "When a plane is perpendicular to HP, its projection on HP (top view) reduces to a straight line (edge view). This is because all points of the plane lie along a single projector direction when viewed from above.",
    [hint("B", "A plane ⊥ HP is viewed edge-on from above, so all its points collapse onto a line in the top view. This is a fundamental rule.", "Rejecting the edge view principle")]
))

questions.append(tf_q(
    "cuet-eg-planes-32", "easy", "Foreshortening Direction",
    ["foreshortening", "inclined-plane"],
    "When a plane is inclined to the HP, its top view is always smaller than its true shape.",
    True,
    "An inclined plane's top view is foreshortened — one dimension is reduced by cos θ while the other stays the same. This makes the projected area smaller than the true area (projected area = true area × cos θ).",
    [hint("B", "Foreshortening by cos θ always reduces the projected dimension (since cos θ < 1 for θ > 0°). The top view area is always less than the true area.", "Not understanding the cosine foreshortening rule")]
))

questions.append(tf_q(
    "cuet-eg-planes-33", "easy", "Number of Sides Preserved",
    ["projection-properties", "shape-preservation"],
    "The number of sides of a polygon is preserved in its projection (e.g., a pentagon always projects as a five-sided figure).",
    True,
    "Orthographic projection preserves the number of sides (vertices and edges) of a polygon. A pentagon will always project as a five-sided figure, though the shape may be foreshortened. Only the proportions change, not the topology.",
    [hint("B", "Projection maps each vertex to a unique point and each edge to a line segment. The count of vertices and edges is always preserved in orthographic projection.", "Confusing shape change with topology change")]
))

questions.append(tf_q(
    "cuet-eg-planes-34", "medium", "Oblique Plane Edge View",
    ["oblique-plane", "edge-view"],
    "A plane inclined to both HP and VP (oblique plane) can show an edge view in either the standard front view or top view.",
    False,
    "An oblique plane is inclined (not perpendicular) to both HP and VP. An edge view requires the plane to be perpendicular to the projection plane. Since an oblique plane is perpendicular to neither HP nor VP, it shows no edge view in any standard view. An edge view can only be obtained through auxiliary projection.",
    [hint("A", "An edge view requires perpendicularity to the viewing plane. An oblique plane is inclined to both HP and VP, so neither standard view gives an edge.", "Confusing 'inclined' with 'perpendicular'")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# FILL-IN-BLANKS (2): cuet-eg-planes-35 to 36
# ═══════════════════════════════════════════════════════════════════════════════

q35 = base("cuet-eg-planes-35", "fill-in-blanks", "easy", "remember", "Edge View Definition", ["edge-view", "terminology"])
q35.update({
    "question_text": "When a plane surface appears as a straight line in a projection view, it is called an _____ of the plane.",
    "text_with_blanks": "When a plane surface appears as a straight line in a projection view, it is called an _____ of the plane.",
    "correct_answer": "A",
    "explanation": "An edge view is the projection of a plane that appears as a straight line. This occurs when the plane is perpendicular to the projection plane, and the observer sees the plane 'edge-on'.",
    "options": [
        opt("A", "Edge view", True),
        opt("B", "True shape"),
        opt("C", "Auxiliary view"),
        opt("D", "Oblique view"),
    ],
    "elimination_hints": [
        hint("B", "True shape shows the full 2D extent of the plane, not a line.", "Confusing edge view with true shape"),
        hint("C", "Auxiliary view is a view obtained on an auxiliary plane, not the name for a line appearance.", "Confusing the view type with the appearance"),
        hint("D", "Oblique view refers to a non-standard viewing direction, not the line appearance of a plane.", "Using incorrect terminology"),
    ]
})
questions.append(q35)

q36 = base("cuet-eg-planes-36", "fill-in-blanks", "medium", "understand", "Foreshortening Factor", ["foreshortening", "cosine-rule"])
q36.update({
    "question_text": "The foreshortening factor for a plane inclined at angle θ to the HP in its top view is _____.",
    "text_with_blanks": "The foreshortening factor for a plane inclined at angle θ to the HP in its top view is _____.",
    "correct_answer": "C",
    "explanation": "When a plane is inclined at angle θ to HP, one dimension in the top view is multiplied by cos θ. Hence the foreshortening factor is cos θ.",
    "options": [
        opt("A", "sin θ"),
        opt("B", "tan θ"),
        opt("C", "cos θ", True),
        opt("D", "1/cos θ"),
    ],
    "elimination_hints": [
        hint("A", "sin θ gives the ratio of the height component to the true length. The foreshortening factor is cos θ, not sin θ.", "Confusing sine and cosine roles"),
        hint("B", "tan θ = sin θ/cos θ has no direct meaning as a foreshortening factor.", "Using an incorrect trig function"),
        hint("D", "1/cos θ > 1 for θ > 0°, which would mean the projection is larger than the original — impossible.", "Inverting the foreshortening factor"),
    ]
})
questions.append(q36)

# ═══════════════════════════════════════════════════════════════════════════════
# SCENARIO-BASED (2): cuet-eg-planes-37 to 38
# ═══════════════════════════════════════════════════════════════════════════════

q37 = base("cuet-eg-planes-37", "scenario-based", "medium", "apply", "Solar Panel Projection", ["real-world", "inclined-plane", "area-calculation"])
q37.update({
    "question_text": "Based on the scenario, what is the area of the solar panel as seen in the top view (plan view from directly above)?",
    "scenario": "A rectangular solar panel measuring 2 m × 1 m is installed on a rooftop, inclined at 30° to the horizontal (HP). An architect needs to determine how the panel appears in the plan (top) view of the building for the site layout drawing.",
    "correct_answer": "D",
    "explanation": "The solar panel is inclined at 30° to HP. The top view area = True area × cos θ = (2 × 1) × cos 30° = 2 × 0.866 = 1.732 m². The dimension along the inclination (1 m side) foreshortens to 1 × cos 30° = 0.866 m, while the 2 m side remains unchanged. Top view area = 2 × 0.866 = 1.732 m².",
    "options": [
        opt("A", "2.0 m²"),
        opt("B", "1.0 m²"),
        opt("C", "1.5 m²"),
        opt("D", "1.73 m²", True),
    ],
    "elimination_hints": [
        hint("A", "2.0 m² is the true area (2 × 1). The top view area is reduced because the panel is inclined.", "Ignoring foreshortening"),
        hint("B", "1.0 m² = 2 × cos 60° × 1. This uses the wrong angle (60° instead of 30°) or applies cosine incorrectly.", "Using the wrong angle"),
        hint("C", "1.5 m² = 2 × 1 × 0.75 doesn't correspond to any standard trigonometric value for 30°.", "Using an incorrect multiplier"),
    ]
})
questions.append(q37)

q38 = base("cuet-eg-planes-38", "scenario-based", "hard", "evaluate", "Ramp Design", ["real-world", "inclined-plane", "projection"])
q38.update({
    "question_text": "Based on the scenario, what is the true width of the ramp?",
    "scenario": "A civil engineer is designing a wheelchair ramp. The ramp's top view shows a rectangular area of 3 m × 1.2 m. The ramp is inclined at 15° to the horizontal ground. The 1.2 m dimension in the top view is the foreshortened width (along the slope direction). The engineer needs to determine the true width of the ramp along the slope.",
    "correct_answer": "A",
    "explanation": "The foreshortened width in top view = true width × cos θ. So true width = foreshortened width / cos θ = 1.2 / cos 15° = 1.2 / 0.9659 = 1.242 m ≈ 1.24 m.",
    "options": [
        opt("A", "1.24 m", True),
        opt("B", "1.20 m"),
        opt("C", "1.50 m"),
        opt("D", "4.63 m"),
    ],
    "elimination_hints": [
        hint("B", "1.20 m is the top view (foreshortened) width. The true width along the slope is larger because of the inclination.", "Using the foreshortened width as the true width"),
        hint("C", "1.50 m doesn't correspond to 1.2/cos 15°. Check the calculation: cos 15° ≈ 0.966, so 1.2/0.966 ≈ 1.24 m.", "Arithmetic error"),
        hint("D", "4.63 m = 1.2/sin 15°. This uses sine instead of cosine, greatly overestimating the true width.", "Using sine instead of cosine"),
    ]
})
questions.append(q38)

# ═══════════════════════════════════════════════════════════════════════════════
# LOGICAL-SEQUENCE (2): cuet-eg-planes-39 to 40
# ═══════════════════════════════════════════════════════════════════════════════

q39 = base("cuet-eg-planes-39", "logical-sequence", "medium", "understand", "Two-Step Projection Steps", ["two-step-method", "construction-order"])
q39.update({
    "question_text": "Arrange the steps for projecting a pentagonal plane inclined at 45° to HP and perpendicular to VP (two-step method):",
    "items": [
        {"id": "1", "text": "Draw the pentagon as a true shape in the top view (assume plane ∥ HP)"},
        {"id": "2", "text": "Project the front view as a line parallel to XY at the appropriate height"},
        {"id": "3", "text": "Redraw the front view line inclined at 45° to XY"},
        {"id": "4", "text": "Draw projectors from the tilted FV to intersect horizontal lines from Step 1 top view"},
        {"id": "5", "text": "Connect the intersection points to get the final foreshortened top view"}
    ],
    "correct_order": ["1", "2", "3", "4", "5"],
    "correct_answer": "C",
    "explanation": "The two-step method follows: draw true shape in TV → project FV as line ∥ XY → tilt FV to required angle → project new TV using projectors from tilted FV and horizontal distances from Step 1 → connect points for final TV.",
    "options": [
        opt("A", "2, 1, 3, 4, 5"),
        opt("B", "1, 3, 2, 4, 5"),
        opt("C", "1, 2, 3, 4, 5", True),
        opt("D", "1, 2, 4, 3, 5"),
    ],
    "elimination_hints": [
        hint("A", "Step 2 (FV as line) cannot be done before Step 1 (true shape in TV), because the FV line length depends on the TV extent.", "Drawing front view before establishing the true shape"),
        hint("B", "Step 3 (tilting FV) cannot come before Step 2 (drawing the initial FV line). You must draw it first, then tilt.", "Tilting before drawing the initial FV"),
        hint("D", "Step 4 (projectors from tilted FV) requires Step 3 (tilting) to be complete first. Projecting before tilting gives the wrong positions.", "Projecting before tilting the front view"),
    ]
})
questions.append(q39)

q40 = base("cuet-eg-planes-40", "logical-sequence", "hard", "analyze", "Three-Step Projection Steps", ["three-step-method", "construction-order"])
q40.update({
    "question_text": "Arrange the steps for projecting a triangular plane inclined at 30° to HP and 50° to VP (three-step method):",
    "items": [
        {"id": "1", "text": "Draw the triangle as true shape in TV (plane ∥ HP)"},
        {"id": "2", "text": "Project FV as a line parallel to XY"},
        {"id": "3", "text": "Tilt the FV line to 30° with XY (sets HP angle)"},
        {"id": "4", "text": "Obtain new TV from Step 3 by projection"},
        {"id": "5", "text": "Redraw the new TV with one edge at appropriate angle to XY (sets VP angle)"},
        {"id": "6", "text": "Project the final FV from Step 5 TV using height data from Step 3 FV"}
    ],
    "correct_order": ["1", "2", "3", "4", "5", "6"],
    "correct_answer": "B",
    "explanation": "The three-step method: (1) True shape in TV, (2) FV line ∥ XY, (3) Tilt FV to 30° (HP angle), (4) New TV by projection, (5) Tilt TV for VP angle, (6) Final FV from tilted TV and Step 3 heights.",
    "options": [
        opt("A", "1, 2, 3, 5, 4, 6"),
        opt("B", "1, 2, 3, 4, 5, 6", True),
        opt("C", "2, 1, 3, 4, 5, 6"),
        opt("D", "1, 2, 4, 3, 5, 6"),
    ],
    "elimination_hints": [
        hint("A", "Step 5 (tilting TV) requires the new TV from Step 4 to exist first. You cannot tilt what hasn't been drawn.", "Tilting TV before obtaining it from Step 3"),
        hint("C", "Step 2 (FV line) depends on the true shape extent from Step 1. The true shape must be drawn first.", "Drawing FV before establishing the true shape"),
        hint("D", "Step 4 (new TV) requires Step 3 (tilted FV) because the new TV is projected from the tilted FV. Reversing 3 and 4 is incorrect.", "Projecting new TV before tilting the FV"),
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
