#!/usr/bin/env python3
"""Generate the 40-question JSON for B08: Orthographic Projection."""
import json, os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cuet-eg-orthographic-b08.json")

def base(qid, qtype, diff, bloom, subtopic, tags):
    return {
        "id": qid,
        "chapter_id": "cuet-eg",
        "topic_id": "cuet-eg-orthographic",
        "question_type": qtype,
        "difficulty": diff,
        "subject": "engineering-graphics",
        "chapter": "Engineering Graphics",
        "topic": "Orthographic Projection",
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
# MCQ — EASY (5): cuet-eg-orthographic-01 to 05
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(mcq(
    "cuet-eg-orthographic-01", "easy", "remember", "Orthographic Definition",
    ["orthographic", "definition"],
    "Orthographic projection is a method of representing a 3D object using:",
    [opt("A", "A single pictorial view"),
     opt("B", "Two or more 2D views projected on mutually perpendicular planes", True),
     opt("C", "A perspective drawing with vanishing points"),
     opt("D", "An isometric view only")],
    "B",
    "Orthographic projection represents a 3D object by projecting it onto two or more mutually perpendicular planes (HP, VP, and profile plane) using parallel projectors perpendicular to the planes.",
    [hint("A", "A single pictorial view is isometric or oblique projection, not orthographic.", "Confusing pictorial with orthographic"),
     hint("C", "Perspective drawings with vanishing points use convergent projectors, not parallel ones.", "Confusing perspective with orthographic"),
     hint("D", "Isometric is a single pictorial view. Orthographic uses multiple 2D views.", "Confusing isometric with orthographic")]
))

questions.append(mcq(
    "cuet-eg-orthographic-02", "easy", "remember", "Principal Planes",
    ["reference-planes", "principal"],
    "The two principal planes used in orthographic projection are:",
    [opt("A", "Horizontal Plane (HP) and Vertical Plane (VP)", True),
     opt("B", "Inclined Plane and Oblique Plane"),
     opt("C", "Auxiliary Plane and Profile Plane"),
     opt("D", "Section Plane and Development Plane")],
    "A",
    "The two principal planes are the Horizontal Plane (HP) and the Vertical Plane (VP). They are mutually perpendicular and intersect along the XY reference line.",
    [hint("B", "Inclined and oblique planes are auxiliary, not principal. The principal planes are HP and VP.", "Confusing auxiliary with principal planes"),
     hint("C", "The profile plane is the third reference plane, not a principal plane. The two principal planes are HP and VP.", "Including auxiliary as principal"),
     hint("D", "Section and development planes are used in different topics, not as reference planes for orthographic projection.", "Confusing different EG concepts")]
))

questions.append(mcq(
    "cuet-eg-orthographic-03", "easy", "remember", "First Angle Placement",
    ["first-angle", "object-position"],
    "In first angle projection, the object is placed in the:",
    [opt("A", "Second quadrant"),
     opt("B", "Third quadrant"),
     opt("C", "First quadrant (above HP and in front of VP)", True),
     opt("D", "Fourth quadrant")],
    "C",
    "In first angle projection, the object is placed in the first quadrant — above the HP and in front of the VP. The object is between the observer and the projection plane.",
    [hint("A", "The second quadrant places the object above HP but behind VP. First angle uses the first quadrant.", "Confusing quadrant positions"),
     hint("B", "The third quadrant is used for third angle projection, not first angle.", "Confusing first and third angle"),
     hint("D", "The fourth quadrant places the object below HP and in front of VP. This is not standard for first angle.", "Using wrong quadrant")]
))

questions.append(mcq(
    "cuet-eg-orthographic-04", "easy", "remember", "Hidden Lines",
    ["hidden-lines", "convention"],
    "In orthographic projection, edges that are not visible from the viewing direction are shown as:",
    [opt("A", "Continuous thick lines"),
     opt("B", "Dashed (hidden) lines", True),
     opt("C", "Chain lines"),
     opt("D", "They are not shown")],
    "B",
    "Hidden edges (edges behind visible surfaces) are represented by dashed lines (short dashes of equal length with equal spacing). This is a standard BIS/ISO convention.",
    [hint("A", "Continuous thick lines represent visible outlines, not hidden edges.", "Confusing visible with hidden line types"),
     hint("C", "Chain lines (dash-dot) represent center lines and axes, not hidden edges.", "Confusing center lines with hidden lines"),
     hint("D", "Hidden edges must be shown for complete representation. Omitting them loses important information.", "Ignoring hidden edge convention")]
))

questions.append(mcq(
    "cuet-eg-orthographic-05", "easy", "remember", "Number of Standard Views",
    ["views", "count"],
    "The maximum number of principal views in orthographic projection is:",
    [opt("A", "2"),
     opt("B", "3"),
     opt("C", "4"),
     opt("D", "6", True)],
    "D",
    "There are 6 principal views: Front View, Top View, Bottom View, Right Side View, Left Side View, and Back View. These correspond to projections on 6 faces of a bounding box around the object.",
    [hint("A", "2 views (FV + TV) are the minimum often used, but 6 is the maximum number of principal views.", "Confusing minimum with maximum"),
     hint("B", "3 views (FV, TV, SV) are commonly used, but 6 is the maximum available.", "Confusing common practice with maximum"),
     hint("C", "4 is not a standard count. The 6 principal views come from 6 faces of a bounding box.", "Using non-standard count")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# MCQ — MEDIUM (10): cuet-eg-orthographic-06 to 15
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(mcq(
    "cuet-eg-orthographic-06", "medium", "understand", "First vs Third Angle TV Position",
    ["first-angle", "third-angle", "view-position"],
    "In first angle projection, the top view is placed:",
    [opt("A", "Above the front view"),
     opt("B", "Below the front view", True),
     opt("C", "To the right of the front view"),
     opt("D", "To the left of the front view")],
    "B",
    "In first angle projection, the object is above HP. The top view (projection on HP) falls below the XY line, hence below the front view. In third angle, it's the opposite — TV is above FV.",
    [hint("A", "TV above FV is the third angle convention, not first angle.", "Confusing first and third angle layouts"),
     hint("C", "Right of FV is where the left side view goes in first angle, not the top view.", "Confusing side view with top view position"),
     hint("D", "Left of FV is where the right side view goes in first angle.", "Confusing side view positions")]
))

questions.append(mcq(
    "cuet-eg-orthographic-07", "medium", "understand", "Third Angle Side View",
    ["third-angle", "side-view-position"],
    "In third angle projection, the right side view is placed:",
    [opt("A", "To the left of the front view"),
     opt("B", "Below the front view"),
     opt("C", "To the right of the front view", True),
     opt("D", "Above the front view")],
    "C",
    "In third angle projection, the projection plane is between the observer and the object. The right side view appears on the right side of the front view — the view goes to the same side as the direction of observation.",
    [hint("A", "Left of FV is where the right side view goes in FIRST angle, not third angle.", "Confusing first and third angle"),
     hint("B", "Below FV is where the top view goes in first angle, not where the side view goes.", "Confusing TV position with SV position"),
     hint("D", "Above FV is where the top view goes in third angle, not the side view.", "Confusing TV with SV position")]
))

questions.append(mcq(
    "cuet-eg-orthographic-08", "medium", "apply", "Projection Symbol Identification",
    ["projection-symbol", "identification"],
    "The BIS/ISO standard symbol for first angle projection is:",
    [opt("A", "A circle with a horizontal line through it"),
     opt("B", "A truncated cone with the smaller end visible on the same side as the side view"),
     opt("C", "A truncated cone where the side view (circle) is on the opposite side from where you'd expect the larger end", True),
     opt("D", "Two concentric circles")],
    "C",
    "The first angle projection symbol shows a truncated cone in FV with the end view (circle) placed on the right — opposite to where the larger end of the cone faces. This follows first angle rules where views are placed on the far side.",
    [hint("A", "A circle with a horizontal line is not the standard projection symbol.", "Using non-standard symbol"),
     hint("B", "Side view on the same side as the visible end describes third angle, not first angle.", "Describing third angle symbol"),
     hint("D", "Two concentric circles alone are not the projection symbol. The symbol includes the truncated cone FV.", "Incomplete symbol description")]
))

questions.append(mcq(
    "cuet-eg-orthographic-09", "medium", "apply", "Dimension Sharing Between Views",
    ["dimension-alignment", "view-coordination"],
    "In orthographic projection, the front view and top view share which common dimension?",
    [opt("A", "Height"),
     opt("B", "Depth (width)"),
     opt("C", "Length (width across the front)", True),
     opt("D", "No common dimension")],
    "C",
    "The front view and top view are both projected from the same width (horizontal extent when viewed from front). The FV shows width × height, while the TV shows width × depth. Width is the common dimension, aligned vertically between them.",
    [hint("A", "Height appears in the FV and side view, not in the top view. TV shows depth, not height.", "Confusing which views share height"),
     hint("B", "Depth appears in the TV and side view, not in the front view. FV shows height, not depth.", "Confusing which views share depth"),
     hint("D", "Views must share dimensions for alignment. FV and TV share the width dimension.", "Not understanding view coordination")]
))

questions.append(mcq(
    "cuet-eg-orthographic-10", "medium", "apply", "Profile Plane",
    ["profile-plane", "side-view"],
    "The profile plane (PP) is used to obtain the:",
    [opt("A", "Front view"),
     opt("B", "Top view"),
     opt("C", "Side view (left or right)", True),
     opt("D", "Back view")],
    "C",
    "The profile plane is perpendicular to both HP and VP. Projecting the object onto the profile plane gives the side view (either left or right side view, depending on which side the PP is placed).",
    [hint("A", "The front view is obtained by projecting onto the VP, not the profile plane.", "Confusing VP with PP"),
     hint("B", "The top view is obtained by projecting onto the HP, not the profile plane.", "Confusing HP with PP"),
     hint("D", "The back view is obtained by projecting onto a plane parallel to VP but behind the object, not the profile plane.", "Confusing back view plane with PP")]
))

questions.append(mcq(
    "cuet-eg-orthographic-11", "medium", "understand", "Projector Lines",
    ["projectors", "parallel"],
    "In orthographic projection, the projector lines (from object to projection plane) are:",
    [opt("A", "Converging to a point (perspective)"),
     opt("B", "Parallel to each other and perpendicular to the projection plane", True),
     opt("C", "Diverging from the object"),
     opt("D", "Inclined at 45° to the projection plane")],
    "B",
    "Orthographic projection uses parallel projectors that are perpendicular to the projection plane. This ensures that the projected view shows the true shape of any face parallel to the projection plane.",
    [hint("A", "Converging projectors define perspective projection, not orthographic.", "Confusing perspective with orthographic"),
     hint("C", "Diverging projectors don't correspond to any standard projection method.", "Non-standard projection type"),
     hint("D", "45° projectors are used in oblique (cavalier/cabinet) projection, not orthographic.", "Confusing oblique with orthographic")]
))

questions.append(mcq(
    "cuet-eg-orthographic-12", "medium", "apply", "Minimum Views Needed",
    ["views", "minimum-required"],
    "For most engineering objects, the minimum number of orthographic views typically needed to fully describe the object is:",
    [opt("A", "1"),
     opt("B", "2"),
     opt("C", "3", True),
     opt("D", "6")],
    "C",
    "Most objects require 3 views (Front View, Top View, and Side View) for complete description. Two views may suffice for simple objects (like cylinders), and one view with a note for very simple ones (like a sphere).",
    [hint("A", "1 view is sufficient only for very simple objects like spheres. Most objects need more views.", "Oversimplifying for complex objects"),
     hint("B", "2 views work for symmetric or simple objects. Most objects need a third view to resolve ambiguity.", "Underestimating complexity"),
     hint("D", "6 views are rarely needed. 3 views typically provide complete information.", "Using maximum instead of typical minimum")]
))

questions.append(mcq(
    "cuet-eg-orthographic-13", "medium", "understand", "True Shape Condition",
    ["true-shape", "parallel-face"],
    "A face of an object appears as its true shape in an orthographic view when the face is:",
    [opt("A", "Perpendicular to the projection plane"),
     opt("B", "Inclined to the projection plane"),
     opt("C", "Parallel to the projection plane", True),
     opt("D", "Behind the projection plane")],
    "C",
    "A face parallel to the projection plane is projected without any foreshortening — every dimension is preserved. This is the true shape. Inclined faces are foreshortened, and perpendicular faces appear as edges (lines).",
    [hint("A", "Perpendicular to the projection plane means the face appears as a line (edge view), not its true shape.", "Confusing edge view with true shape"),
     hint("B", "Inclined faces appear foreshortened (reduced in one dimension). Only parallel faces show true shape.", "Confusing foreshortened with true shape"),
     hint("D", "Whether a face is in front of or behind the plane doesn't determine true shape — parallelism does.", "Confusing position with orientation")]
))

questions.append(mcq(
    "cuet-eg-orthographic-14", "medium", "apply", "45° Miter Line",
    ["miter-line", "construction"],
    "The 45° miter line in orthographic projection is used to:",
    [opt("A", "Draw hidden lines at 45°"),
     opt("B", "Transfer depth dimensions from the top view to the side view (or vice versa)", True),
     opt("C", "Measure angles of inclined surfaces"),
     opt("D", "Draw center lines")],
    "B",
    "The 45° miter line is drawn at 45° from the intersection of the FV and SV boundaries. It is used to transfer depth (horizontal) measurements from the TV to the SV, ensuring both views have consistent depth dimensions.",
    [hint("A", "Hidden lines are drawn using information from views, not using a 45° miter line.", "Confusing construction tool with line type"),
     hint("C", "Angles of inclined surfaces are measured from the views directly, not from the miter line.", "Confusing miter line purpose"),
     hint("D", "Center lines are drawn through the centers of symmetric features. The miter line is a construction aid.", "Confusing center lines with miter line")]
))

questions.append(mcq(
    "cuet-eg-orthographic-15", "medium", "understand", "Edge View of Surface",
    ["edge-view", "perpendicular-surface"],
    "When a surface of an object is perpendicular to a projection plane, it appears in that view as:",
    [opt("A", "Its true shape"),
     opt("B", "A foreshortened shape"),
     opt("C", "A straight line (edge view)", True),
     opt("D", "A circle")],
    "C",
    "A surface perpendicular to a projection plane is seen 'edge-on', appearing as a straight line. For example, the top face of a cube appears as a horizontal line in the front view because it's perpendicular to the VP.",
    [hint("A", "True shape requires the surface to be parallel to the plane, not perpendicular.", "Confusing parallel with perpendicular"),
     hint("B", "Foreshortening occurs for inclined surfaces. Perpendicular surfaces appear as lines, not foreshortened shapes.", "Confusing inclined with perpendicular"),
     hint("D", "A circle appears when viewing a circular feature end-on, not from a general perpendicular surface.", "Confusing circular with general perpendicular")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# MCQ — HARD (5): cuet-eg-orthographic-16 to 20
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(mcq(
    "cuet-eg-orthographic-16", "hard", "analyze", "Missing View Determination",
    ["missing-view", "spatial-reasoning"],
    "Given the front view (an L-shape) and the top view (a rectangle), the most likely right side view is:",
    [opt("A", "A circle"),
     opt("B", "An L-shape"),
     opt("C", "A rectangle with a horizontal hidden line", True),
     opt("D", "A triangle")],
    "C",
    "An L-shaped FV indicates a step in height. A rectangular TV means the object has uniform depth. The right side view would show a rectangle (full depth × full height) with a horizontal hidden/visible line at the step height, indicating the step edge.",
    [hint("A", "A circle would require a cylindrical feature, which is not indicated by an L-shaped FV or rectangular TV.", "Assuming circular features without evidence"),
     hint("B", "An L-shape in the side view would mean the step is visible from the side, but with uniform depth (rectangular TV), the side view is rectangular.", "Duplicating FV shape in SV"),
     hint("D", "A triangle would indicate a wedge or inclined surface, not consistent with an L-shaped FV.", "Assuming inclined surfaces without evidence")]
))

questions.append(mcq(
    "cuet-eg-orthographic-17", "hard", "analyze", "Inclined Surface in Views",
    ["inclined-surface", "projection"],
    "A flat surface inclined to both HP and VP but perpendicular to the profile plane appears in the:",
    [opt("A", "Front view as an edge (line)"),
     opt("B", "Top view as an edge (line)"),
     opt("C", "Side view as its true shape", True),
     opt("D", "All views as its true shape")],
    "C",
    "A surface perpendicular to the profile plane appears as a line (edge view) in the side view. Wait — actually, if perpendicular to PP, it's an edge in the SV. But the question says inclined to HP and VP, perpendicular to PP. A surface ⊥ PP appears as an edge in SV and as a foreshortened shape in FV and TV. Let me reconsider: actually if the surface is perpendicular to PP, the SV shows it as a line. The true shape would need an auxiliary view.",
    [hint("A", "The FV shows a foreshortened shape since the surface is inclined to VP, not perpendicular.", "Confusing inclined with perpendicular to VP"),
     hint("B", "The TV shows a foreshortened shape since the surface is inclined to HP.", "Confusing inclined with perpendicular to HP"),
     hint("D", "True shape in all views is impossible. A surface can show true shape in only one principal view.", "Claiming true shape in multiple views")]
))

# Fix Q17 — let me make it cleaner
questions[-1]["question_text"] = "A flat surface of an object is parallel to the profile plane (PP) and inclined to both HP and VP. This surface appears as its true shape in:"
questions[-1]["explanation"] = "A surface parallel to the profile plane (PP) projects its true shape onto the PP, which gives the side view. In the FV and TV, it appears foreshortened because it is inclined to both HP and VP."
questions[-1]["options"] = [
    opt("A", "The front view only"),
    opt("B", "The top view only"),
    opt("C", "The side view only", True),
    opt("D", "Both front and top views"),
]
questions[-1]["elimination_hints"] = [
    hint("A", "The surface is inclined to VP, so the FV shows a foreshortened shape, not the true shape.", "Confusing inclined with parallel to VP"),
    hint("B", "The surface is inclined to HP, so the TV shows a foreshortened shape.", "Confusing inclined with parallel to HP"),
    hint("D", "The surface is inclined to both HP and VP. True shape appears only in the view where the surface is parallel to the projection plane (SV).", "Assuming true shape in multiple views"),
]

questions.append(mcq(
    "cuet-eg-orthographic-18", "hard", "evaluate", "View Selection Strategy",
    ["view-selection", "strategy"],
    "When selecting the front view of an object for orthographic projection, the best practice is to choose the view that:",
    [opt("A", "Shows the most hidden lines"),
     opt("B", "Shows the maximum detail and fewest hidden lines", True),
     opt("C", "Is always from the longest side"),
     opt("D", "Is always from the top")],
    "B",
    "The front view should show the most characteristic shape of the object with the fewest hidden lines. This gives the clearest representation and reduces the need for hidden line interpretation.",
    [hint("A", "Maximum hidden lines makes the drawing harder to read. The goal is to minimize hidden lines.", "Choosing worst visibility"),
     hint("C", "The longest side may not show the most characteristic shape. Choose the view that reveals the most features.", "Using arbitrary selection rule"),
     hint("D", "The front view is chosen based on information content, not always from the top. The 'front' is the most informative direction.", "Using fixed direction instead of information-based choice")]
))

questions.append(mcq(
    "cuet-eg-orthographic-19", "hard", "analyze", "Curved Surface in Views",
    ["curved-surface", "projection"],
    "A cylindrical hole passing horizontally through a rectangular block (axis parallel to HP and VP) appears in the top view as:",
    [opt("A", "A circle"),
     opt("B", "Two parallel hidden lines (representing the top and bottom of the hole)", True),
     opt("C", "An ellipse"),
     opt("D", "A single line")],
    "B",
    "With the cylinder axis parallel to HP and VP (perpendicular to PP), the top view looks down on the block. The hole is below the surface, so its top and bottom edges appear as two parallel hidden lines running the length of the hole.",
    [hint("A", "A circle appears in the side view (end view of the cylinder), not in the top view for this orientation.", "Confusing side view with top view"),
     hint("C", "An ellipse appears when the cylinder axis is inclined to the viewing direction. Here the axis is parallel to HP, so no ellipse.", "Applying inclined-axis rule"),
     hint("D", "A single line would represent only one edge. The hole has both a top and bottom edge visible as hidden lines.", "Showing only one edge of the hole")]
))

questions.append(mcq(
    "cuet-eg-orthographic-20", "hard", "evaluate", "Auxiliary View Purpose",
    ["auxiliary-view", "true-shape"],
    "An auxiliary view in orthographic projection is primarily used to:",
    [opt("A", "Replace the front view"),
     opt("B", "Show the true shape of an inclined or oblique surface that appears foreshortened in all principal views", True),
     opt("C", "Draw isometric views"),
     opt("D", "Show the development of a surface")],
    "B",
    "When a surface is inclined to all principal planes, none of the six principal views show its true shape. An auxiliary view uses a projection plane parallel to the inclined surface to reveal the true shape.",
    [hint("A", "Auxiliary views supplement principal views; they don't replace them.", "Confusing supplementary with replacement"),
     hint("C", "Isometric views are pictorial projections, unrelated to auxiliary orthographic views.", "Confusing isometric with auxiliary views"),
     hint("D", "Development unfolds surfaces flat. Auxiliary views project onto new planes.", "Confusing development with auxiliary view")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# DIAGRAM-BASED (4): cuet-eg-orthographic-21 to 24
# ═══════════════════════════════════════════════════════════════════════════════

q21 = base("cuet-eg-orthographic-21", "diagram-based", "easy", "apply", "Projection Symbol ID", ["projection-symbol", "identification"])
q21.update({
    "question_text": "From the figure showing projection symbols, identify the first angle projection symbol.",
    "correct_answer": "A",
    "explanation": "The left symbol (blue) shows the first angle projection: the truncated cone FV is on the left, and the end view (circle with smaller circle) is on the right — the view is placed on the opposite side from the direction of observation.",
    "image_uri": "question-images/engineering-graphics/solids/cuet-eg-orthographic-81-angle-symbols.png",
    "image_alt": "Left: First angle symbol (FV on left, LSV circle on right). Right: Third angle symbol (LSV circle on left, FV on right).",
    "options": [
        opt("A", "The left symbol — truncated cone FV on the left, circle end view on the right", True),
        opt("B", "The right symbol — circle end view on the left, truncated cone FV on the right"),
        opt("C", "Both symbols represent first angle"),
        opt("D", "Neither symbol represents first angle"),
    ],
    "elimination_hints": [
        hint("B", "The right symbol is the third angle projection symbol, where the view is placed on the same side as the observation direction.", "Confusing third angle with first angle"),
        hint("C", "The two symbols are different — one is first angle, the other is third angle.", "Not distinguishing the two symbols"),
        hint("D", "One of the symbols does represent first angle. The left one follows first angle convention.", "Rejecting both valid symbols"),
    ]
})
questions.append(q21)

q22 = base("cuet-eg-orthographic-22", "diagram-based", "medium", "analyze", "Three Views Reading", ["view-reading", "L-block"])
q22.update({
    "question_text": "From the figure showing three views of an L-shaped block, the dashed line in the top view represents:",
    "correct_answer": "D",
    "explanation": "The dashed (hidden) line in the top view represents the step boundary — the edge where the taller portion of the L-block meets the shorter base. This edge is below the top surface, hence hidden when viewed from above.",
    "image_uri": "question-images/engineering-graphics/solids/cuet-eg-orthographic-82-three-views.png",
    "image_alt": "Three orthographic views of L-shaped block: FV shows L-shape, TV shows rectangle with hidden line, RSV shows rectangle with horizontal line.",
    "options": [
        opt("A", "A visible edge on the top surface"),
        opt("B", "The outline of a hole"),
        opt("C", "A center line"),
        opt("D", "The hidden edge of the step (height change) below the top surface", True),
    ],
    "elimination_hints": [
        hint("A", "Visible edges are shown as continuous lines, not dashed. The dashed line indicates a hidden feature.", "Confusing visible with hidden line convention"),
        hint("B", "There is no hole in this L-block. The dashed line represents the step boundary.", "Assuming a hole without evidence"),
        hint("C", "Center lines are dash-dot (long-short-long), not plain dashes. This is a hidden line.", "Confusing center line with hidden line"),
    ]
})
questions.append(q22)

q23 = base("cuet-eg-orthographic-23", "diagram-based", "easy", "apply", "Quadrant Identification", ["quadrants", "identification"])
q23.update({
    "question_text": "From the figure showing the four quadrants, in which quadrant is the object placed for third angle projection?",
    "correct_answer": "C",
    "explanation": "Third angle projection places the object in the third quadrant — below HP and behind VP. In this quadrant, the projection plane is between the observer and the object.",
    "image_uri": "question-images/engineering-graphics/solids/cuet-eg-orthographic-83-quadrants.png",
    "image_alt": "Four quadrants formed by HP and VP: I (above HP, in front of VP), II (above HP, behind VP), III (below HP, behind VP), IV (below HP, in front of VP).",
    "options": [
        opt("A", "First quadrant (I)"),
        opt("B", "Second quadrant (II)"),
        opt("C", "Third quadrant (III)", True),
        opt("D", "Fourth quadrant (IV)"),
    ],
    "elimination_hints": [
        hint("A", "First quadrant is for first angle projection, not third angle.", "Confusing first and third angle quadrants"),
        hint("B", "Second quadrant is above HP, behind VP. FV and TV overlap in this quadrant, making it impractical.", "Using impractical quadrant"),
        hint("D", "Fourth quadrant has the same overlap problem as the second. It is not used for standard projections.", "Using impractical quadrant"),
    ]
})
questions.append(q23)

q24 = base("cuet-eg-orthographic-24", "diagram-based", "hard", "evaluate", "Six Views Layout", ["six-views", "layout-analysis"])
q24.update({
    "question_text": "From the figure showing the six principal views layout, in first angle projection, which view is placed directly below the front view?",
    "correct_answer": "D",
    "explanation": "In first angle projection, the top view is placed BELOW the front view (the projection falls below when the HP is unfolded). The bottom view goes above the FV. This is opposite to third angle where TV is above FV.",
    "image_uri": "question-images/engineering-graphics/solids/cuet-eg-orthographic-84-six-views.png",
    "image_alt": "Six principal views layout for first angle: TV below FV, Bottom View above FV, LSV to right of FV, RSV to left of FV, Back View at far right.",
    "options": [
        opt("A", "The bottom view"),
        opt("B", "The right side view"),
        opt("C", "The back view"),
        opt("D", "The top view", True),
    ],
    "elimination_hints": [
        hint("A", "In first angle, the bottom view goes ABOVE the FV (not below). Below FV is the top view.", "Confusing first angle layout"),
        hint("B", "The right side view goes to the LEFT of FV in first angle (views go to opposite side).", "Confusing view placement direction"),
        hint("C", "The back view is placed at the far end of the layout, not directly below the FV.", "Confusing back view position"),
    ]
})
questions.append(q24)

# ═══════════════════════════════════════════════════════════════════════════════
# ASSERTION-REASONING (4): cuet-eg-orthographic-25 to 28
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(ar_q(
    "cuet-eg-orthographic-25", "medium", "understand", "Parallel Projectors",
    ["projectors", "orthographic-principle"],
    "In orthographic projection, the projectors are perpendicular to the projection plane.",
    "Perpendicular projectors ensure that the true shape of any face parallel to the projection plane is preserved in the view.",
    "A",
    "Both are true and R correctly explains A. The perpendicularity of projectors is what makes orthographic projection unique — it preserves true shapes of parallel faces and true lengths of parallel lines.",
    [hint("B", "R directly explains A — the perpendicular projectors are the mechanism that preserves true shapes.", "Not seeing the causal relationship"),
     hint("C", "R is true — perpendicular projectors do preserve true shapes of parallel surfaces.", "Rejecting correct geometric principle"),
     hint("D", "A is true — perpendicular projectors define orthographic projection.", "Rejecting the definition of orthographic projection")]
))

questions.append(ar_q(
    "cuet-eg-orthographic-26", "medium", "understand", "View Alignment",
    ["view-alignment", "projection-consistency"],
    "In orthographic projection, the front view and top view must be vertically aligned (sharing the same width dimension).",
    "Both views are projected from the same object, and the width (horizontal extent) must be consistent between them.",
    "A",
    "Both are true and R correctly explains A. The FV and TV share the width dimension. They are aligned vertically so that corresponding features are directly above/below each other.",
    [hint("B", "R directly explains A — consistent width from the same object is why the views must be aligned.", "Not connecting consistency with alignment"),
     hint("C", "R is true — both views come from the same object, so horizontal dimensions must match.", "Rejecting dimensional consistency"),
     hint("D", "A is true — vertical alignment of FV and TV is a fundamental rule of orthographic projection.", "Rejecting a fundamental drawing rule")]
))

questions.append(ar_q(
    "cuet-eg-orthographic-27", "hard", "analyze", "Second Quadrant Impracticality",
    ["second-quadrant", "view-overlap"],
    "Objects are not placed in the second or fourth quadrant for orthographic projection because the views would overlap.",
    "In the second quadrant (above HP, behind VP), the front view and top view are projected on the same side of the XY line, causing them to overlap.",
    "A",
    "Both are true and R correctly explains A. In the second quadrant, projecting onto VP and HP causes both views to fall on the same side of XY, making them overlap. The same happens in the fourth quadrant.",
    [hint("B", "R directly explains A — the overlap is caused by both projections falling on the same side of XY.", "Not connecting overlap with same-side projection"),
     hint("C", "R is true — in the second quadrant, the TV and FV do project to the same side of XY.", "Rejecting the geometric analysis"),
     hint("D", "A is true — second and fourth quadrants are impractical precisely because of view overlap.", "Rejecting a well-known fact")]
))

questions.append(ar_q(
    "cuet-eg-orthographic-28", "hard", "analyze", "Hidden Lines Necessity",
    ["hidden-lines", "complete-representation"],
    "Hidden lines can be completely eliminated from orthographic drawings by choosing the correct views.",
    "Hidden edges exist because some features are behind visible surfaces, and no single viewing direction can show all features.",
    "D",
    "A is false — hidden lines cannot always be eliminated completely, especially for complex objects with internal features (holes, slots). Changing views may reduce hidden lines but rarely eliminates all of them. R is true — hidden features inherently exist in 3D objects.",
    [hint("A", "A is false — complex objects with internal features will always have some hidden lines regardless of view choice.", "Thinking all hidden lines are avoidable"),
     hint("B", "A is false. The assertion about elimination is incorrect.", "Accepting the false assertion"),
     hint("C", "R is true — the physical nature of 3D objects means some features are always behind others.", "Rejecting the correct reason")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# MATCH-THE-FOLLOWING (2): cuet-eg-orthographic-29 to 30
# ═══════════════════════════════════════════════════════════════════════════════

q29 = base("cuet-eg-orthographic-29", "match-the-following", "medium", "understand", "Views and Planes", ["views", "projection-planes"])
q29.update({
    "question_text": "Match the orthographic view with the projection plane it is obtained from:\n\nColumn A: (P) Front View, (Q) Top View, (R) Side View, (S) Back View\nColumn B: (1) Horizontal Plane (HP), (2) Vertical Plane (VP), (3) Profile Plane (PP), (4) Plane parallel to VP (behind object)",
    "correct_answer": "B",
    "explanation": "Front View → VP (P-2). Top View → HP (Q-1). Side View → PP (R-3). Back View → Plane ∥ VP behind object (S-4).",
    "column_a": ["Front View", "Top View", "Side View", "Back View"],
    "column_b": ["Horizontal Plane (HP)", "Vertical Plane (VP)", "Profile Plane (PP)", "Plane parallel to VP"],
    "correct_mapping": {"Front View": "Vertical Plane (VP)", "Top View": "Horizontal Plane (HP)", "Side View": "Profile Plane (PP)", "Back View": "Plane parallel to VP"},
    "options": [
        opt("A", "P-1, Q-2, R-3, S-4"),
        opt("B", "P-2, Q-1, R-3, S-4", True),
        opt("C", "P-2, Q-3, R-1, S-4"),
        opt("D", "P-3, Q-1, R-2, S-4"),
    ],
    "elimination_hints": [
        hint("A", "P-1 gives Front View from HP. The front view comes from the VP (vertical plane), not HP.", "Swapping VP and HP"),
        hint("C", "Q-3 gives Top View from PP. The top view comes from HP (horizontal plane), not the profile plane.", "Confusing HP with PP for top view"),
        hint("D", "P-3 gives Front View from PP. The front view is on the VP. The profile plane gives the side view.", "Swapping VP and PP"),
    ]
})
questions.append(q29)

q30 = base("cuet-eg-orthographic-30", "match-the-following", "hard", "analyze", "Line Types in Drawing", ["line-types", "conventions"])
q30.update({
    "question_text": "Match the line type with its use in orthographic projection:\n\nColumn A: (P) Continuous thick line, (Q) Dashed line, (R) Chain thin line (dash-dot), (S) Chain thin with thick ends\nColumn B: (1) Cutting plane line, (2) Center line / axis, (3) Visible outline, (4) Hidden edge",
    "correct_answer": "D",
    "explanation": "Continuous thick → Visible outline (P-3). Dashed → Hidden edge (Q-4). Chain thin → Center line (R-2). Chain thin with thick ends → Cutting plane (S-1).",
    "column_a": ["Continuous thick line", "Dashed line", "Chain thin line", "Chain thin with thick ends"],
    "column_b": ["Cutting plane line", "Center line / axis", "Visible outline", "Hidden edge"],
    "correct_mapping": {"Continuous thick line": "Visible outline", "Dashed line": "Hidden edge", "Chain thin line": "Center line / axis", "Chain thin with thick ends": "Cutting plane line"},
    "options": [
        opt("A", "P-3, Q-4, R-1, S-2"),
        opt("B", "P-4, Q-3, R-2, S-1"),
        opt("C", "P-3, Q-1, R-2, S-4"),
        opt("D", "P-3, Q-4, R-2, S-1", True),
    ],
    "elimination_hints": [
        hint("A", "R-1 gives chain thin to cutting plane. Chain thin is for center lines. Cutting planes use chain thin WITH thick ends.", "Confusing center line with cutting plane"),
        hint("B", "P-4 gives thick line to hidden edges. Thick continuous lines are for visible outlines, not hidden.", "Swapping visible and hidden line types"),
        hint("C", "Q-1 gives dashed to cutting plane. Dashed lines are for hidden edges, not cutting planes.", "Confusing hidden lines with cutting plane"),
    ]
})
questions.append(q30)

# ═══════════════════════════════════════════════════════════════════════════════
# TRUE-FALSE (4): cuet-eg-orthographic-31 to 34
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(tf_q(
    "cuet-eg-orthographic-31", "easy", "XY Reference Line",
    ["xy-line", "reference"],
    "The XY reference line in orthographic projection represents the line of intersection of the HP and VP.",
    True,
    "The HP and VP are perpendicular planes that intersect along a straight line called the XY line (or ground line). This line serves as the reference for measuring heights (above XY) and depths (below XY).",
    [hint("B", "The XY line is indeed where HP meets VP. This is the fundamental reference line in orthographic projection.", "Not understanding the XY line's geometric origin")]
))

questions.append(tf_q(
    "cuet-eg-orthographic-32", "easy", "Views Show True Shape",
    ["true-shape", "parallel-surface"],
    "In orthographic projection, every view shows the true shape of at least one face of the object.",
    False,
    "This is false for objects with all inclined/oblique faces. If no face is parallel to any principal projection plane, then no principal view shows a true shape. An auxiliary view would be needed.",
    [hint("A", "Consider a pyramid tilted so no face is parallel to HP, VP, or PP. None of the six principal views would show any face in true shape.", "Assuming at least one face is always parallel to a principal plane")]
))

questions.append(tf_q(
    "cuet-eg-orthographic-33", "medium", "First Angle Indian Standard",
    ["first-angle", "indian-standard"],
    "India follows the first angle projection system as per BIS (Bureau of Indian Standards).",
    True,
    "India, along with most European and Asian countries, uses first angle projection (BIS standard IS 15021). The USA and Canada use third angle projection (ANSI/ASME standards).",
    [hint("B", "India does use first angle projection as per BIS. Third angle is primarily used in the USA/Canada.", "Confusing Indian standard with American standard")]
))

questions.append(tf_q(
    "cuet-eg-orthographic-34", "medium", "Depth Transfer",
    ["depth", "view-transfer"],
    "The depth dimension is common to the top view and the side view in orthographic projection.",
    True,
    "The top view shows width × depth. The side view shows depth × height. Depth is the common dimension. It is transferred between TV and SV using the 45° miter line or compass.",
    [hint("B", "Depth (the dimension perpendicular to the front view) appears in both the TV and SV. Width is common to FV and TV. Height is common to FV and SV.", "Not understanding which dimensions are shared")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# FILL-IN-BLANKS (2): cuet-eg-orthographic-35 to 36
# ═══════════════════════════════════════════════════════════════════════════════

q35 = base("cuet-eg-orthographic-35", "fill-in-blanks", "easy", "remember", "Projection Plane for FV", ["front-view", "projection-plane"])
q35.update({
    "question_text": "The front view in orthographic projection is obtained by projecting the object onto the _____.",
    "text_with_blanks": "The front view in orthographic projection is obtained by projecting the object onto the _____.",
    "correct_answer": "B",
    "explanation": "The front view is the projection of the object onto the Vertical Plane (VP). The VP is the plane facing the observer, and the front view shows the width and height of the object.",
    "options": [
        opt("A", "Horizontal Plane (HP)"),
        opt("B", "Vertical Plane (VP)", True),
        opt("C", "Profile Plane (PP)"),
        opt("D", "Auxiliary Plane"),
    ],
    "elimination_hints": [
        hint("A", "The HP gives the top view, not the front view.", "Confusing HP with VP"),
        hint("C", "The PP gives the side view, not the front view.", "Confusing PP with VP"),
        hint("D", "An auxiliary plane gives an auxiliary view for inclined surfaces, not the standard front view.", "Confusing auxiliary with principal views"),
    ]
})
questions.append(q35)

q36 = base("cuet-eg-orthographic-36", "fill-in-blanks", "medium", "understand", "View Below FV First Angle", ["first-angle", "view-position"])
q36.update({
    "question_text": "In first angle projection, the _____ view is placed directly below the front view.",
    "text_with_blanks": "In first angle projection, the _____ view is placed directly below the front view.",
    "correct_answer": "A",
    "explanation": "In first angle projection, the top view goes below the front view. This is because the object is above HP, and when HP is rotated downward to unfold, the top view appears below the XY line (below the FV).",
    "options": [
        opt("A", "Top", True),
        opt("B", "Bottom"),
        opt("C", "Right side"),
        opt("D", "Left side"),
    ],
    "elimination_hints": [
        hint("B", "The bottom view goes ABOVE the FV in first angle (below the object, projected upward).", "Confusing top and bottom view positions"),
        hint("C", "The right side view goes to the LEFT of FV in first angle.", "Confusing side view position"),
        hint("D", "The left side view goes to the RIGHT of FV in first angle.", "Confusing side view position"),
    ]
})
questions.append(q36)

# ═══════════════════════════════════════════════════════════════════════════════
# SCENARIO-BASED (2): cuet-eg-orthographic-37 to 38
# ═══════════════════════════════════════════════════════════════════════════════

q37 = base("cuet-eg-orthographic-37", "scenario-based", "medium", "apply", "Machine Part Drawing", ["real-world", "view-selection"])
q37.update({
    "question_text": "Based on the scenario, what is the minimum number of views needed to fully describe the bracket?",
    "scenario": "A manufacturing engineer needs to create an orthographic drawing of an L-shaped mounting bracket. The bracket has a vertical arm (50 mm tall × 30 mm wide × 10 mm thick) and a horizontal arm (40 mm long × 30 mm wide × 10 mm thick). There is one circular mounting hole (diameter 8 mm) in each arm. The engineer uses first angle projection.",
    "correct_answer": "C",
    "explanation": "The L-bracket needs 3 views: Front View (shows L-shape with hole positions), Top View (shows plan view with holes), and Side View (shows thickness and depth). Two views would be ambiguous about the hole positions in depth.",
    "options": [
        opt("A", "1 view"),
        opt("B", "2 views"),
        opt("C", "3 views", True),
        opt("D", "6 views"),
    ],
    "elimination_hints": [
        hint("A", "1 view cannot show the 3D shape. At minimum, width × height AND depth are needed.", "Oversimplifying for a complex part"),
        hint("B", "2 views may not show the hole positions in all dimensions. The L-shape and holes need 3 views for clarity.", "Underestimating needed views for holes"),
        hint("D", "6 views provide redundant information. 3 views are sufficient for this bracket.", "Providing unnecessary redundancy"),
    ]
})
questions.append(q37)

q38 = base("cuet-eg-orthographic-38", "scenario-based", "hard", "evaluate", "International Drawing Exchange", ["real-world", "projection-systems"])
q38.update({
    "question_text": "Based on the scenario, what should the Indian engineer check first when reading the American drawing?",
    "scenario": "An Indian engineer receives a technical drawing from an American company for a machine component. The drawing follows ANSI standards. The Indian engineer needs to manufacture the part. India uses first angle projection (BIS), while the USA uses third angle projection (ANSI).",
    "correct_answer": "D",
    "explanation": "The first thing to check is the projection symbol on the drawing to confirm whether it's first or third angle. Misinterpreting the projection system would cause all views to be read incorrectly — the top view, side view positions would be swapped, leading to manufacturing errors.",
    "options": [
        opt("A", "The material specification"),
        opt("B", "The surface finish symbols"),
        opt("C", "The tolerance values"),
        opt("D", "The projection symbol (first or third angle) to correctly interpret view positions", True),
    ],
    "elimination_hints": [
        hint("A", "Material specs are important but won't cause misinterpretation of the part shape.", "Focusing on material before geometry"),
        hint("B", "Surface finish symbols are standard across systems. The critical issue is projection system interpretation.", "Focusing on finish before geometry"),
        hint("C", "Tolerance values are important but secondary. Misreading projection would cause the wrong shape to be manufactured.", "Focusing on tolerances before view interpretation"),
    ]
})
questions.append(q38)

# ═══════════════════════════════════════════════════════════════════════════════
# LOGICAL-SEQUENCE (2): cuet-eg-orthographic-39 to 40
# ═══════════════════════════════════════════════════════════════════════════════

q39 = base("cuet-eg-orthographic-39", "logical-sequence", "medium", "understand", "Drawing Orthographic Views", ["construction", "drawing-steps"])
q39.update({
    "question_text": "Arrange the steps for drawing orthographic views of a given object:",
    "items": [
        {"id": "1", "text": "Study the object and determine its principal dimensions (length, width, height)"},
        {"id": "2", "text": "Select the best direction for the front view (maximum detail, minimum hidden lines)"},
        {"id": "3", "text": "Draw the front view first with visible and hidden lines"},
        {"id": "4", "text": "Project the top view from the front view (directly below in first angle)"},
        {"id": "5", "text": "Project the side view using the 45° miter line or compass to transfer depth"},
        {"id": "6", "text": "Add dimensions, center lines, and title block"}
    ],
    "correct_order": ["1", "2", "3", "4", "5", "6"],
    "correct_answer": "B",
    "explanation": "Correct order: Study object → Select front view direction → Draw FV → Project TV → Project SV using miter line → Add dimensions.",
    "options": [
        opt("A", "2, 1, 3, 4, 5, 6"),
        opt("B", "1, 2, 3, 4, 5, 6", True),
        opt("C", "1, 3, 2, 4, 5, 6"),
        opt("D", "1, 2, 4, 3, 5, 6"),
    ],
    "elimination_hints": [
        hint("A", "Step 2 (select FV) before Step 1 (study object) doesn't work. You must understand the object before choosing the best view.", "Choosing view without understanding object"),
        hint("C", "Step 3 (draw FV) before Step 2 (select direction) means drawing without choosing the best orientation.", "Drawing before choosing orientation"),
        hint("D", "Step 4 (project TV) before Step 3 (draw FV) is impossible. You need the FV to project from.", "Projecting before having the source view"),
    ]
})
questions.append(q39)

q40 = base("cuet-eg-orthographic-40", "logical-sequence", "hard", "analyze", "Reading Orthographic Views", ["view-reading", "interpretation-steps"])
q40.update({
    "question_text": "Arrange the steps for interpreting (reading) a given set of orthographic views to understand the 3D object:",
    "items": [
        {"id": "1", "text": "Check the projection symbol to determine first or third angle projection"},
        {"id": "2", "text": "Identify the front view and note its overall shape and features"},
        {"id": "3", "text": "Correlate features between FV, TV, and SV by tracing projection lines"},
        {"id": "4", "text": "Identify visible edges, hidden edges, and center lines in each view"},
        {"id": "5", "text": "Build a mental 3D model by combining information from all views"},
        {"id": "6", "text": "Verify the interpretation by checking that all features in every view are accounted for"}
    ],
    "correct_order": ["1", "2", "4", "3", "5", "6"],
    "correct_answer": "A",
    "explanation": "Correct order: Check projection system → Identify FV → Identify line types in each view → Correlate features across views → Build 3D mental model → Verify interpretation.",
    "options": [
        opt("A", "1, 2, 4, 3, 5, 6", True),
        opt("B", "2, 1, 3, 4, 5, 6"),
        opt("C", "1, 2, 3, 4, 6, 5"),
        opt("D", "1, 5, 2, 3, 4, 6"),
    ],
    "elimination_hints": [
        hint("B", "Step 2 (identify FV) before Step 1 (check projection) is risky. Without knowing first/third angle, you might misidentify which view is which.", "Identifying views before knowing projection system"),
        hint("C", "Step 6 (verify) before Step 5 (build 3D model) puts verification before the mental model exists.", "Verifying before constructing"),
        hint("D", "Step 5 (3D model) immediately after Step 1 is premature. You need to analyze individual views first.", "Building 3D model without analyzing views"),
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
