#!/usr/bin/env python3
"""Generate the 40-question JSON for B05: Sections of Solids."""
import json, os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cuet-eg-sections-b05.json")

def base(qid, qtype, diff, bloom, subtopic, tags):
    return {
        "id": qid,
        "chapter_id": "cuet-eg-engineering-graphics",
        "topic_id": "cuet-eg-sections",
        "question_type": qtype,
        "difficulty": diff,
        "subject": "engineering-graphics",
        "chapter": "Engineering Graphics",
        "topic": "Sections of Solids",
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
# MCQ — EASY (5): cuet-eg-sections-01 to 05
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(mcq(
    "cuet-eg-sections-01", "easy", "remember", "Section Plane Definition",
    ["section-plane", "definition"],
    "A section plane (or cutting plane) is an imaginary plane that:",
    [opt("A", "Is always horizontal"),
     opt("B", "Cuts through a solid to reveal the internal shape", True),
     opt("C", "Is always perpendicular to both HP and VP"),
     opt("D", "Only applies to curved solids")],
    "B",
    "A section plane is an imaginary plane used to cut through a solid. The intersection of this plane with the solid surfaces produces the section (or cross-section), revealing the internal shape of the solid.",
    [hint("A", "A section plane can be horizontal, vertical, or inclined. It is not restricted to horizontal.", "Restricting cutting plane orientation"),
     hint("C", "The section plane can be at any angle. It need not be perpendicular to both HP and VP.", "Over-constraining section plane orientation"),
     hint("D", "Section planes apply to all solids — prisms, pyramids, cones, cylinders, and any other solid.", "Limiting sections to curved solids")]
))

questions.append(mcq(
    "cuet-eg-sections-02", "easy", "remember", "Section Hatching Convention",
    ["hatching", "convention"],
    "In a sectional view, the cut surface of a solid is represented by:",
    [opt("A", "Dots"),
     opt("B", "Cross-hatching at 90°"),
     opt("C", "Thin parallel lines at 45° to the reference line", True),
     opt("D", "Bold outline only")],
    "C",
    "Section hatching (or cross-hatching) consists of thin, evenly spaced parallel lines drawn at 45° to the reference line (XY) or the main outline. This is the standard BIS/ISO convention for showing cut surfaces.",
    [hint("A", "Dots are used to represent sand or earth in civil engineering drawings, not for section hatching.", "Confusing material conventions"),
     hint("B", "Cross-hatching at 90° (grid pattern) is used for specific materials in some conventions, but the standard section hatching is at 45°.", "Using non-standard angle"),
     hint("D", "A bold outline shows the boundary but doesn't indicate the cut surface interior. Hatching fills the interior.", "Incomplete section representation")]
))

questions.append(mcq(
    "cuet-eg-sections-03", "easy", "remember", "Section of Cylinder Perp to Axis",
    ["cylinder", "section-perpendicular"],
    "When a right circular cylinder is cut by a plane perpendicular to its axis, the true shape of the section is:",
    [opt("A", "An ellipse"),
     opt("B", "A rectangle"),
     opt("C", "A circle", True),
     opt("D", "A parabola")],
    "C",
    "A plane perpendicular to the axis of a cylinder cuts through all generators at the same height, tracing a circle. The section is identical to the cross-section of the cylinder.",
    [hint("A", "An ellipse results when the cutting plane is inclined to the axis, not perpendicular.", "Confusing inclined with perpendicular section"),
     hint("B", "A rectangle is the front view of a cylinder, not a cross-section.", "Confusing view with section"),
     hint("D", "A parabola is a conic section obtained by cutting a cone parallel to a generator, not by cutting a cylinder.", "Applying cone section rules to a cylinder")]
))

questions.append(mcq(
    "cuet-eg-sections-04", "easy", "remember", "Cutting Plane Line Type",
    ["cutting-plane", "line-convention"],
    "In an engineering drawing, the cutting plane is represented by:",
    [opt("A", "A continuous thick line"),
     opt("B", "A chain thin line with thick ends and arrows", True),
     opt("C", "A dashed line"),
     opt("D", "A wavy line")],
    "B",
    "The cutting plane line is drawn as a long chain thin line (dash-dot) with thick dashes at the ends and bends. Arrows at the ends indicate the viewing direction of the section.",
    [hint("A", "Continuous thick lines represent visible outlines, not cutting planes.", "Confusing outline with cutting plane"),
     hint("C", "Dashed lines represent hidden edges, not cutting planes.", "Confusing hidden lines with cutting plane"),
     hint("D", "Wavy lines represent break lines (showing shortened views), not cutting planes.", "Confusing break lines with cutting plane")]
))

questions.append(mcq(
    "cuet-eg-sections-05", "easy", "remember", "Frustum Definition",
    ["frustum", "definition"],
    "When a pyramid or cone is cut by a plane parallel to its base, the portion between the base and the cutting plane is called a:",
    [opt("A", "Truncated solid"),
     opt("B", "Frustum", True),
     opt("C", "Prism"),
     opt("D", "Section")],
    "B",
    "A frustum is the portion of a cone or pyramid that lies between the base and a cutting plane parallel to the base. It has two parallel faces (the original base and the cut face).",
    [hint("A", "Truncated solid is a general term. The specific term for a pyramid/cone cut parallel to the base is 'frustum'.", "Using general term instead of specific"),
     hint("C", "A prism has identical parallel bases. A frustum has two similar but different-sized parallel faces.", "Confusing frustum with prism"),
     hint("D", "A section is the cut surface itself (2D shape), not the retained 3D portion of the solid.", "Confusing 2D section with 3D frustum")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# MCQ — MEDIUM (10): cuet-eg-sections-06 to 15
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(mcq(
    "cuet-eg-sections-06", "medium", "understand", "Cylinder Inclined Section",
    ["cylinder", "inclined-section"],
    "When a right circular cylinder (axis perpendicular to HP) is cut by a plane inclined to HP and perpendicular to VP, the true shape of the section is:",
    [opt("A", "A circle"),
     opt("B", "A rectangle"),
     opt("C", "An ellipse", True),
     opt("D", "A parabola")],
    "C",
    "An inclined plane cutting a cylinder produces an ellipse. The minor axis equals the diameter of the cylinder, and the major axis = diameter / sin(θ), where θ is the angle of inclination with HP.",
    [hint("A", "A circle results only when the cutting plane is perpendicular to the axis. An inclined plane gives an elongated (elliptical) section.", "Applying perpendicular-section rule to inclined case"),
     hint("B", "A rectangle appears in the front view of the cylinder, not as a section by an inclined plane.", "Confusing front view with section"),
     hint("D", "A parabola is a conic section from a cone, not a cylinder. Inclined sections of cylinders are always ellipses.", "Applying cone conic sections to cylinder")]
))

questions.append(mcq(
    "cuet-eg-sections-07", "medium", "understand", "Cone Section — Ellipse Condition",
    ["cone", "ellipse-section"],
    "A right circular cone is cut by a plane that is inclined to its axis and cuts all generators. The true shape of this section is:",
    [opt("A", "An ellipse", True),
     opt("B", "A circle"),
     opt("C", "A parabola"),
     opt("D", "A hyperbola")],
    "A",
    "When a cutting plane is inclined to the axis of a cone and intersects ALL generators (i.e., the plane angle with the axis is greater than the semi-vertical angle), the section is an ellipse.",
    [hint("B", "A circle requires the cutting plane to be perpendicular to the axis. An inclined plane that cuts all generators gives an ellipse.", "Confusing perpendicular with inclined section"),
     hint("C", "A parabola requires the cutting plane to be parallel to exactly one generator. Cutting all generators gives an ellipse, not a parabola.", "Confusing ellipse condition with parabola condition"),
     hint("D", "A hyperbola requires the cutting plane to be parallel to the axis (or at a steeper angle). Cutting all generators gives an ellipse.", "Confusing ellipse condition with hyperbola condition")]
))

questions.append(mcq(
    "cuet-eg-sections-08", "medium", "understand", "Cone Section — Parabola Condition",
    ["cone", "parabola-section"],
    "When a right circular cone is cut by a plane parallel to one of its generators, the section produced is:",
    [opt("A", "A circle"),
     opt("B", "An ellipse"),
     opt("C", "A hyperbola"),
     opt("D", "A parabola", True)],
    "D",
    "A cutting plane parallel to a generator of the cone (i.e., making the same angle with the base as the generator) produces a parabola. The plane cuts one nappe of the cone and is tangent to the other nappe at infinity.",
    [hint("A", "A circle needs the plane ⊥ axis. A plane parallel to a generator is inclined, not perpendicular.", "Applying perpendicular-section rule"),
     hint("B", "An ellipse requires the plane to cut ALL generators. A plane ∥ generator misses one side, so it doesn't cut all generators.", "Not checking generator intersection"),
     hint("C", "A hyperbola needs the plane ∥ axis (steeper than generator). Parallel to generator is the boundary case — parabola.", "Confusing parabola with hyperbola condition")]
))

questions.append(mcq(
    "cuet-eg-sections-09", "medium", "apply", "Section of Square Prism",
    ["prism", "section-shape"],
    "A square prism (axis ⊥ HP) is cut by a plane inclined at 45° to HP and perpendicular to VP, passing through all four rectangular faces. The true shape of the section is:",
    [opt("A", "A square"),
     opt("B", "A rectangle", True),
     opt("C", "A circle"),
     opt("D", "A triangle")],
    "B",
    "When a square prism is cut by an inclined plane that passes through all four rectangular faces, the section is a rectangle. The width equals the side of the square (perpendicular to VP) and the length is the diagonal cut across the prism height.",
    [hint("A", "A square section occurs only when the cutting plane is perpendicular to the axis (horizontal). An inclined cut elongates one dimension.", "Applying perpendicular-section result to inclined case"),
     hint("C", "Circles result from cutting cylinders or cones, not prisms with flat faces.", "Applying curved-solid rules to flat-faced solid"),
     hint("D", "A triangle section from a prism requires the cut to intersect only three faces, not all four.", "Confusing the number of faces intersected")]
))

questions.append(mcq(
    "cuet-eg-sections-10", "medium", "apply", "Sectional View Selection",
    ["sectional-view", "which-view"],
    "When a cutting plane is perpendicular to the VP and inclined to the HP, the sectional view that shows the true shape of the section is obtained by:",
    [opt("A", "Projecting onto the HP (top view)"),
     opt("B", "Projecting onto the VP (front view)"),
     opt("C", "Drawing an auxiliary view on a plane parallel to the section plane", True),
     opt("D", "Projecting onto the profile plane (side view)")],
    "C",
    "The true shape of a section is only visible when projected onto a plane parallel to the section plane. Since the section plane is inclined to HP, the TV shows a foreshortened shape. An auxiliary view parallel to the section plane reveals the true shape.",
    [hint("A", "The HP projection (TV) shows a foreshortened section because the section plane is inclined to HP.", "Ignoring foreshortening in non-parallel projection"),
     hint("B", "The VP projection (FV) shows the section as a line (edge view) because the section plane is ⊥ VP.", "Confusing edge view with true shape"),
     hint("D", "The profile plane projection may also foreshorten the section unless it happens to be parallel to the section plane.", "Assuming profile plane is always parallel to section")]
))

questions.append(mcq(
    "cuet-eg-sections-11", "medium", "apply", "Hexagonal Prism Section",
    ["prism", "hexagonal-section"],
    "A regular hexagonal prism (axis ⊥ HP) is cut by a plane perpendicular to VP and inclined at 30° to HP. The cutting plane passes through all six rectangular faces. The section has how many sides?",
    [opt("A", "4"),
     opt("B", "6", True),
     opt("C", "8"),
     opt("D", "3")],
    "B",
    "If the inclined cutting plane intersects all 6 rectangular (lateral) faces of the hexagonal prism, the section is a 6-sided polygon (hexagon, though not regular). Each face contributes one edge to the section.",
    [hint("A", "4 sides would mean the plane cuts only 4 faces. If it cuts all 6 faces, the section has 6 sides.", "Undercounting faces intersected"),
     hint("C", "8 sides would require 8 faces. A hexagonal prism has only 6 lateral faces, giving at most 6 section sides.", "Overcounting — hexagonal prism has 6 lateral faces, not 8"),
     hint("D", "3 sides would mean only 3 faces are cut, which is possible but not when the plane passes through all six.", "Confusing partial section with full section")]
))

questions.append(mcq(
    "cuet-eg-sections-12", "medium", "understand", "Section vs Sectional View",
    ["terminology", "section-view"],
    "What is the difference between a 'section' and a 'sectional view'?",
    [opt("A", "They are the same thing"),
     opt("B", "A section is 3D; a sectional view is 2D"),
     opt("C", "A section applies to prisms; a sectional view applies to cylinders"),
     opt("D", "A section shows only the cut surface; a sectional view shows the cut surface plus the visible portion behind it", True)],
    "D",
    "A 'section' shows only the shape at the cut surface (the plane-solid intersection, with hatching). A 'sectional view' includes the section PLUS all visible features behind the cutting plane.",
    [hint("A", "They are different: a section is just the cut surface, while a sectional view includes features behind the cut.", "Not distinguishing section from sectional view"),
     hint("B", "Both are 2D representations. The difference is what is included: just the cut surface vs. cut surface + visible features.", "Misunderstanding the dimensional nature"),
     hint("C", "Both terms apply to all types of solids. The distinction is about content, not solid type.", "Incorrectly limiting by solid type")]
))

questions.append(mcq(
    "cuet-eg-sections-13", "medium", "apply", "Cone Section — Hyperbola",
    ["cone", "hyperbola-section"],
    "A right circular cone is cut by a plane parallel to its axis. The true shape of the section is:",
    [opt("A", "An ellipse"),
     opt("B", "A parabola"),
     opt("C", "A hyperbola", True),
     opt("D", "A circle")],
    "C",
    "When the cutting plane is parallel to the axis of the cone (and does not pass through the apex), it cuts a hyperbola. The plane intersects both sides of the curved surface, creating the two-branch-like curve characteristic of a hyperbola.",
    [hint("A", "An ellipse requires the plane to cut all generators. A plane parallel to the axis misses some generators on the far side.", "Confusing ellipse condition"),
     hint("B", "A parabola requires the plane to be parallel to a generator (same angle as slant). Parallel to axis is steeper than a generator.", "Confusing generator-parallel with axis-parallel"),
     hint("D", "A circle requires the plane to be perpendicular to the axis. Parallel to axis is the opposite orientation.", "Confusing perpendicular with parallel")]
))

questions.append(mcq(
    "cuet-eg-sections-14", "medium", "apply", "Apparent Section in TV",
    ["apparent-section", "top-view"],
    "When a cutting plane is perpendicular to VP and inclined to HP, the section appears in the front view as:",
    [opt("A", "The true shape of the section"),
     opt("B", "A straight line (edge view of the section plane)", True),
     opt("C", "An ellipse"),
     opt("D", "A curved line")],
    "B",
    "Since the cutting plane is perpendicular to VP, the front view (projection on VP) shows the section plane as a straight line (edge view). The section points all lie on this line in the FV.",
    [hint("A", "The true shape is visible only on a plane parallel to the section plane (auxiliary view), not on the VP.", "Confusing edge view with true shape"),
     hint("C", "An ellipse might be the true shape of the section, but in the FV the section plane appears as a line, not as an ellipse.", "Showing true shape in the wrong view"),
     hint("D", "A curved line would appear if the section plane were curved. A flat section plane always appears as a straight line in its edge view.", "Confusing flat and curved cutting planes")]
))

questions.append(mcq(
    "cuet-eg-sections-15", "medium", "apply", "Section of Triangular Prism",
    ["prism", "triangular-section"],
    "A triangular prism (axis ⊥ HP) is cut by a horizontal plane (parallel to HP). The true shape of the section is:",
    [opt("A", "A rectangle"),
     opt("B", "A triangle", True),
     opt("C", "A hexagon"),
     opt("D", "An ellipse")],
    "B",
    "A horizontal plane cutting a triangular prism (axis ⊥ HP) cuts perpendicular to the axis. The section is identical to the cross-section — an equilateral (or isosceles/scalene, depending on the prism) triangle.",
    [hint("A", "A rectangle would result from cutting a square/rectangular prism, not a triangular prism.", "Using wrong prism type"),
     hint("C", "A hexagon would result from cutting a hexagonal prism, not a triangular one.", "Using wrong prism type"),
     hint("D", "An ellipse results from cutting a cylinder or cone, not a prism with flat faces.", "Applying curved-solid rules to prism")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# MCQ — HARD (5): cuet-eg-sections-16 to 20
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(mcq(
    "cuet-eg-sections-16", "hard", "analyze", "Ellipse Major Axis from Cylinder",
    ["cylinder", "ellipse-dimensions"],
    "A right circular cylinder of diameter 60 mm is cut by a plane inclined at 30° to HP and perpendicular to VP. The major axis of the elliptical section is:",
    [opt("A", "60 mm"),
     opt("B", "120 mm", True),
     opt("C", "69.28 mm"),
     opt("D", "51.96 mm")],
    "B",
    "For a cylinder cut by an inclined plane at angle θ to HP: Minor axis = diameter = 60 mm. Major axis = diameter / sin(θ) = 60 / sin(30°) = 60 / 0.5 = 120 mm.",
    [hint("A", "60 mm is the diameter (minor axis), not the major axis. The inclined cut elongates the section.", "Using diameter as major axis"),
     hint("C", "69.28 = 60/cos(30°). The correct formula uses sin(θ), not cos(θ), for the major axis.", "Using cos instead of sin"),
     hint("D", "51.96 = 60 × sin(60°) = 60 × cos(30°). This is not the major axis formula.", "Incorrect trigonometric function")]
))

questions.append(mcq(
    "cuet-eg-sections-17", "hard", "apply", "Pyramid Section — Number of Sides",
    ["pyramid", "section-sides"],
    "A pentagonal pyramid (axis ⊥ HP) is cut by a plane inclined to HP and perpendicular to VP. The cutting plane passes through all five triangular faces but does not pass through the base. The section is a:",
    [opt("A", "Triangle"),
     opt("B", "Pentagon", True),
     opt("C", "Trapezoid"),
     opt("D", "Rectangle")],
    "B",
    "If the cutting plane passes through all 5 triangular faces of a pentagonal pyramid, the section is a 5-sided polygon (pentagon). Each triangular face contributes one side to the section.",
    [hint("A", "A triangle section occurs when the plane passes through only 3 faces, not all 5.", "Undercounting faces cut"),
     hint("C", "A trapezoid (4 sides) occurs when 4 faces are cut. Here all 5 are cut, giving 5 sides.", "Assuming only 4 faces are cut"),
     hint("D", "A rectangle has 4 sides and right angles. A pyramid section through 5 faces has 5 sides.", "Wrong number of sides and assuming right angles")]
))

questions.append(mcq(
    "cuet-eg-sections-18", "hard", "analyze", "Cone Semi-Vertical Angle",
    ["cone", "conic-section-conditions"],
    "A right circular cone has a semi-vertical angle of 30°. A cutting plane inclined at 45° to the base passes through the cone. The section produced is:",
    [opt("A", "A circle"),
     opt("B", "A parabola"),
     opt("C", "A hyperbola"),
     opt("D", "An ellipse", True)],
    "D",
    "Semi-vertical angle α = 30°. The cutting plane makes 45° with the base, i.e., the plane's angle with the axis = 90° - 45° = 45°. Since 45° > 30° (plane angle with axis > semi-vertical angle), the plane cuts all generators, producing an ellipse. For parabola: plane angle = α. For hyperbola: plane angle < α.",
    [hint("A", "A circle requires the cutting plane to be perpendicular to the axis (90° with axis). Here it's 45° with axis.", "Applying perpendicular condition"),
     hint("B", "A parabola requires the plane angle with the axis = semi-vertical angle (30°). Here 45° ≠ 30°.", "Confusing the angle condition for parabola"),
     hint("C", "A hyperbola requires the plane angle with axis < semi-vertical angle. Here 45° > 30°, so it's an ellipse, not a hyperbola.", "Reversing the inequality condition")]
))

questions.append(mcq(
    "cuet-eg-sections-19", "hard", "evaluate", "True Shape Method Selection",
    ["true-shape", "auxiliary-view"],
    "For finding the true shape of a section when the cutting plane is perpendicular to VP and inclined to HP, which method is most commonly used?",
    [opt("A", "Rotate the section about the VT of the cutting plane onto the HP"),
     opt("B", "Project the section onto the profile plane"),
     opt("C", "Use an auxiliary plane parallel to the cutting plane and project the section onto it", True),
     opt("D", "Rotate the section about the HT of the cutting plane onto the VP")],
    "C",
    "The standard method is to draw an auxiliary inclined plane (reference line X₁Y₁) parallel to the cutting plane and project all section points onto this plane. This gives the true shape since the projection plane is parallel to the section plane.",
    [hint("A", "Rotating about VT onto HP is an alternative method (rabatment) that works but is less commonly used in CUET syllabus. The auxiliary plane method is the standard approach.", "Using a valid but less standard method"),
     hint("B", "The profile plane is generally not parallel to the cutting plane, so the section would appear foreshortened, not as true shape.", "Assuming profile plane shows true shape"),
     hint("D", "Rotating about HT onto VP may distort distances. The cutting plane's HT is not necessarily conveniently oriented.", "Using wrong trace for rotation")]
))

questions.append(mcq(
    "cuet-eg-sections-20", "hard", "evaluate", "Section Through Apex of Pyramid",
    ["pyramid", "section-through-apex"],
    "A right circular cone is cut by a plane that passes through its apex and is inclined to the base. The true shape of this section is:",
    [opt("A", "An ellipse"),
     opt("B", "A parabola"),
     opt("C", "A triangle", True),
     opt("D", "A hyperbola")],
    "C",
    "When a cutting plane passes through the apex of a cone, it intersects two generators and the base circle. The section is always a triangle — two sides are generators (straight lines from apex to base) and the third side is a chord of the base circle.",
    [hint("A", "An ellipse results when the plane does NOT pass through the apex and cuts all generators. Through the apex, the section is always a triangle.", "Applying non-apex section rule"),
     hint("B", "A parabola requires the plane to be parallel to a generator. A plane through the apex meets the axis at the apex point, not parallel to a generator.", "Confusing apex section with generator-parallel section"),
     hint("D", "A hyperbola requires the plane to be parallel to the axis and not pass through the apex. Through the apex, the result is a triangle.", "Confusing axis-parallel with apex section")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# DIAGRAM-BASED (4): cuet-eg-sections-21 to 24
# ═══════════════════════════════════════════════════════════════════════════════

q21 = base("cuet-eg-sections-21", "diagram-based", "easy", "apply", "Cylinder Section Identification", ["cylinder", "section-shape-id"])
q21.update({
    "question_text": "From the figure showing a cylinder cut by an inclined plane, what is the true shape of the section?",
    "correct_answer": "D",
    "explanation": "The figure shows a cylinder (axis ⊥ HP) cut by a plane inclined to HP. The right panel shows the true shape of the section is an ellipse, with the major and minor axes clearly labeled.",
    "image_uri": "question-images/engineering-graphics/solids/cuet-eg-sections-51-cylinder-section.png",
    "image_alt": "Cylinder cut by inclined plane: FV shows rectangle with inclined cutting plane AA, TV shows circle, and true shape is an ellipse with major and minor axes.",
    "options": [
        opt("A", "A circle"),
        opt("B", "A rectangle"),
        opt("C", "A parabola"),
        opt("D", "An ellipse", True),
    ],
    "elimination_hints": [
        hint("A", "A circle would result from a horizontal cut (⊥ axis). The inclined cut produces an elongated shape — an ellipse.", "Applying perpendicular-cut result to inclined cut"),
        hint("B", "A rectangle is the FV of the cylinder, not the section shape.", "Confusing front view with section"),
        hint("C", "A parabola is a conic section from a cone, not from cutting a cylinder.", "Applying cone rules to cylinder"),
    ]
})
questions.append(q21)

q22 = base("cuet-eg-sections-22", "diagram-based", "medium", "analyze", "Cone Conic Sections", ["cone", "conic-sections"])
q22.update({
    "question_text": "From the figure showing four types of cone sections, which case produces a parabola?",
    "correct_answer": "C",
    "explanation": "The third panel in the figure shows a cutting plane parallel to a generator (∥ gen), which produces a parabola. This is the boundary case between an ellipse (plane cuts all generators) and a hyperbola (plane parallel to axis).",
    "image_uri": "question-images/engineering-graphics/solids/cuet-eg-sections-52-cone-conic-sections.png",
    "image_alt": "Four cone sections: (1) Circle — plane ⊥ axis, (2) Ellipse — inclined plane cutting all generators, (3) Parabola — plane ∥ generator, (4) Hyperbola — plane ∥ axis.",
    "options": [
        opt("A", "When the cutting plane is perpendicular to the axis"),
        opt("B", "When the cutting plane is inclined and cuts all generators"),
        opt("C", "When the cutting plane is parallel to a generator", True),
        opt("D", "When the cutting plane is parallel to the axis"),
    ],
    "elimination_hints": [
        hint("A", "Perpendicular to axis produces a circle (shown in the first panel), not a parabola.", "Confusing circle condition with parabola"),
        hint("B", "Cutting all generators produces an ellipse (second panel). A parabola requires the plane to be parallel to exactly one generator.", "Confusing ellipse with parabola condition"),
        hint("D", "Parallel to axis produces a hyperbola (fourth panel), not a parabola.", "Confusing hyperbola with parabola condition"),
    ]
})
questions.append(q22)

q23 = base("cuet-eg-sections-23", "diagram-based", "medium", "analyze", "Prism Section Hatching", ["prism", "section-hatching"])
q23.update({
    "question_text": "From the figure showing a pentagonal prism cut by an inclined plane, the sectional top view is shown with hatching. What does the hatching represent?",
    "correct_answer": "A",
    "explanation": "The hatching (thin parallel lines at 45°) in the sectional top view represents the solid material that has been cut by the section plane. It fills the area where the cutting plane intersects the solid body.",
    "image_uri": "question-images/engineering-graphics/solids/cuet-eg-sections-53-prism-section.png",
    "image_alt": "Pentagonal prism with FV showing inclined cutting plane AA, and sectional TV showing the pentagon with hatching lines on the cut surface.",
    "options": [
        opt("A", "The cut surface where the section plane passes through the solid material", True),
        opt("B", "The hollow interior of the prism"),
        opt("C", "The external surface of the prism"),
        opt("D", "The removed portion of the prism"),
    ],
    "elimination_hints": [
        hint("B", "A prism is a solid body, not hollow. Hatching shows the cut through solid material, not a hollow interior.", "Assuming the prism is hollow"),
        hint("C", "The external surface is shown by outline edges, not by hatching. Hatching specifically represents the cut surface.", "Confusing external surface with cut surface"),
        hint("D", "The removed portion is above the cutting plane and is not shown in the sectional view. Hatching represents the remaining cut face.", "Confusing removed and retained portions"),
    ]
})
questions.append(q23)

q24 = base("cuet-eg-sections-24", "diagram-based", "hard", "evaluate", "Pyramid True Shape", ["pyramid", "true-shape"])
q24.update({
    "question_text": "From the figure showing a square pyramid cut by an inclined plane, the true shape of the section is identified as a trapezoid. Why is the true shape obtained using an auxiliary plane rather than from the top view?",
    "correct_answer": "B",
    "explanation": "The section plane is inclined to HP, so the top view (projection on HP) shows a foreshortened version of the section — distances along the inclination are compressed. An auxiliary plane parallel to the section plane preserves all distances, showing the true (undistorted) shape.",
    "image_uri": "question-images/engineering-graphics/solids/cuet-eg-sections-54-pyramid-section.png",
    "image_alt": "Square pyramid with inclined cutting plane: FV shows triangle with cut, sectional TV shows quadrilateral, and auxiliary view shows the true trapezoidal shape with vertices 1-4.",
    "options": [
        opt("A", "The top view is always inaccurate for sections"),
        opt("B", "The section plane is inclined to HP, so the TV shows a foreshortened (distorted) section, not the true shape", True),
        opt("C", "The top view cannot show any section details"),
        opt("D", "The auxiliary plane rotates the solid, not the view"),
    ],
    "elimination_hints": [
        hint("A", "The TV is not 'inaccurate' — it correctly shows the projection on HP. The issue is foreshortening, not inaccuracy.", "Confusing projection with inaccuracy"),
        hint("C", "The TV does show the section as a projected shape. It just doesn't show the true shape when the section is inclined.", "Overstating TV limitations"),
        hint("D", "The auxiliary plane doesn't rotate the solid. It provides a new projection direction parallel to the section plane.", "Misunderstanding auxiliary view concept"),
    ]
})
questions.append(q24)

# ═══════════════════════════════════════════════════════════════════════════════
# ASSERTION-REASONING (4): cuet-eg-sections-25 to 28
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(ar_q(
    "cuet-eg-sections-25", "medium", "understand", "Section Plane Perpendicular to VP",
    ["section-plane", "edge-view"],
    "When a section plane is perpendicular to the VP, the section appears as a straight line in the front view.",
    "A plane perpendicular to the VP is seen as an edge (straight line) when projected onto the VP.",
    "A",
    "Both A and R are true, and R correctly explains A. A plane perpendicular to VP appears as a line (edge view) in the FV because the VP is the projection plane for the front view, and a plane perpendicular to it projects as a line.",
    [hint("B", "R directly explains A — the perpendicularity to VP is the reason the section appears as a line in the FV.", "Not recognizing the causal link"),
     hint("C", "R is true — any plane perpendicular to VP appears as an edge in the front view.", "Rejecting correct projection principle"),
     hint("D", "A is true — this is a fundamental projection rule. The section always appears as a line in its edge view.", "Rejecting correct assertion")]
))

questions.append(ar_q(
    "cuet-eg-sections-26", "medium", "understand", "Frustum Section",
    ["frustum", "parallel-cut"],
    "The section of a right circular cone cut by a plane parallel to its base is a circle.",
    "A plane parallel to the base is perpendicular to the axis of the cone.",
    "A",
    "Both are true and R correctly explains A. A plane parallel to the base is perpendicular to the axis. At any height, the cone cross-section is a circle (all points equidistant from axis). So the section is a circle.",
    [hint("B", "R directly explains A — being perpendicular to the axis ensures the section is a circle (symmetric cross-section).", "Not connecting perpendicularity with circular section"),
     hint("C", "R is true — a plane parallel to the base of a right cone is indeed perpendicular to its axis.", "Rejecting a geometric fact"),
     hint("D", "A is true — it's the definition of a frustum cut: parallel to base gives a smaller circle.", "Rejecting a well-known section result")]
))

questions.append(ar_q(
    "cuet-eg-sections-27", "hard", "analyze", "True Shape and Projection",
    ["true-shape", "foreshortening"],
    "The true shape of a section can always be obtained directly from the front view or top view without any auxiliary construction.",
    "The front view and top view project the section onto HP and VP respectively, which may not be parallel to the section plane.",
    "D",
    "A is false — the true shape can be obtained directly from FV or TV ONLY if the section plane is parallel to VP or HP respectively. For inclined sections, auxiliary construction is needed. R is true — it correctly identifies that FV/TV may not show the true shape due to non-parallelism.",
    [hint("A", "A is false because inclined sections require auxiliary views. You cannot get the true shape from FV/TV alone when the section plane is inclined.", "Assuming FV/TV always show true shape"),
     hint("B", "A is false — the true shape generally requires auxiliary construction for inclined sections.", "Accepting the false assertion"),
     hint("C", "R is true — the reason correctly identifies the projection limitation of FV and TV.", "Rejecting the correct reason")]
))

questions.append(ar_q(
    "cuet-eg-sections-28", "hard", "analyze", "Cylinder Section Always Ellipse",
    ["cylinder", "section-shapes"],
    "Every section of a right circular cylinder by an inclined plane is an ellipse.",
    "The section of a cylinder by a plane perpendicular to its axis is a circle, not an ellipse.",
    "B",
    "A is true — every INCLINED plane (not perpendicular, not parallel to axis) cutting a cylinder gives an ellipse. R is also true — a perpendicular cut gives a circle. But R does not explain A; it describes a different case. Both are true but R is NOT the correct explanation of A.",
    [hint("A", "R describes the perpendicular case (circle), which is a different scenario from the inclined case (ellipse). R doesn't explain WHY inclined cuts give ellipses.", "R explains a different case, not the assertion"),
     hint("C", "R is true — perpendicular cuts do give circles, not ellipses. This is a correct geometric fact.", "Rejecting a correct geometric statement"),
     hint("D", "A is true — inclined planes always produce elliptical sections in cylinders. This is a well-established result.", "Rejecting a correct assertion")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# MATCH-THE-FOLLOWING (2): cuet-eg-sections-29 to 30
# ═══════════════════════════════════════════════════════════════════════════════

q29 = base("cuet-eg-sections-29", "match-the-following", "medium", "understand", "Cone Section Types", ["cone", "conic-sections-matching"])
q29.update({
    "question_text": "Match the cutting plane orientation (for a right circular cone) with the section produced:\n\nColumn A: (P) Plane perpendicular to axis, (Q) Plane inclined to axis cutting all generators, (R) Plane parallel to one generator, (S) Plane parallel to axis\nColumn B: (1) Parabola, (2) Ellipse, (3) Circle, (4) Hyperbola",
    "correct_answer": "D",
    "explanation": "Perpendicular to axis → Circle (P-3). Inclined cutting all generators → Ellipse (Q-2). Parallel to one generator → Parabola (R-1). Parallel to axis → Hyperbola (S-4).",
    "column_a": ["Plane perpendicular to axis", "Plane inclined cutting all generators", "Plane parallel to one generator", "Plane parallel to axis"],
    "column_b": ["Parabola", "Ellipse", "Circle", "Hyperbola"],
    "correct_mapping": {"Plane perpendicular to axis": "Circle", "Plane inclined cutting all generators": "Ellipse", "Plane parallel to one generator": "Parabola", "Plane parallel to axis": "Hyperbola"},
    "options": [
        opt("A", "P-1, Q-2, R-3, S-4"),
        opt("B", "P-3, Q-1, R-2, S-4"),
        opt("C", "P-3, Q-2, R-4, S-1"),
        opt("D", "P-3, Q-2, R-1, S-4", True),
    ],
    "elimination_hints": [
        hint("A", "P-1 gives perpendicular-to-axis a parabola. But a perpendicular cut gives a circle, not a parabola.", "Swapping circle and parabola"),
        hint("B", "Q-1 gives the inclined-all-generators case a parabola. But cutting ALL generators gives an ellipse. Parabola is for parallel-to-generator.", "Swapping ellipse and parabola conditions"),
        hint("C", "R-4 gives parallel-to-generator a hyperbola. But ∥ generator gives parabola; ∥ axis gives hyperbola.", "Swapping parabola and hyperbola"),
    ]
})
questions.append(q29)

q30 = base("cuet-eg-sections-30", "match-the-following", "hard", "analyze", "Solid Sections and True Shapes", ["section-shapes", "solid-types"])
q30.update({
    "question_text": "Match the solid (axis ⊥ HP) cut by a plane inclined at 45° to HP and ⊥ to VP with the true shape of section:\n\nColumn A: (P) Right circular cylinder, (Q) Square prism (plane cuts all 4 faces), (R) Triangular prism (plane cuts all 3 faces), (S) Right circular cone (plane cuts all generators)\nColumn B: (1) Ellipse, (2) Rectangle, (3) Triangle, (4) Ellipse (different dimensions)",
    "correct_answer": "A",
    "explanation": "Cylinder → Ellipse (P-1). Square prism (all 4 faces) → Rectangle (Q-2). Triangular prism (all 3 faces) → Triangle (R-3). Cone (all generators) → Ellipse (S-4, different dimensions than cylinder).",
    "column_a": ["Right circular cylinder", "Square prism (all 4 faces)", "Triangular prism (all 3 faces)", "Right circular cone (all generators)"],
    "column_b": ["Ellipse", "Rectangle", "Triangle", "Ellipse (different dimensions)"],
    "correct_mapping": {"Right circular cylinder": "Ellipse", "Square prism (all 4 faces)": "Rectangle", "Triangular prism (all 3 faces)": "Triangle", "Right circular cone (all generators)": "Ellipse (different dimensions)"},
    "options": [
        opt("A", "P-1, Q-2, R-3, S-4", True),
        opt("B", "P-4, Q-2, R-3, S-1"),
        opt("C", "P-1, Q-3, R-2, S-4"),
        opt("D", "P-2, Q-1, R-3, S-4"),
    ],
    "elimination_hints": [
        hint("B", "P-4 and S-1 swap the two ellipses. While both are ellipses, P (cylinder) maps to 1 (Ellipse) and S (cone) maps to 4 (Ellipse, different dimensions).", "Swapping cylinder and cone ellipses"),
        hint("C", "Q-3 gives square prism a triangle. A plane cutting all 4 faces of a square prism gives 4 sides (rectangle), not 3 (triangle).", "Wrong number of section sides for square prism"),
        hint("D", "P-2 gives cylinder a rectangle. A cylinder has a curved surface; an inclined cut gives an ellipse, not a rectangle.", "Applying prism section to cylinder"),
    ]
})
questions.append(q30)

# ═══════════════════════════════════════════════════════════════════════════════
# TRUE-FALSE (4): cuet-eg-sections-31 to 34
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(tf_q(
    "cuet-eg-sections-31", "easy", "Section Hatching Direction",
    ["hatching", "direction"],
    "Section hatching lines are always drawn at 45° to the reference line (XY) in engineering drawings.",
    True,
    "As per BIS/ISO standards, section hatching consists of thin, evenly spaced parallel lines drawn at 45° to the reference line (XY) or the main outline of the section. This is the standard convention for general-purpose hatching.",
    [hint("B", "The 45° angle is the standard convention for general section hatching in engineering drawings. Other angles may be used only for special materials.", "Not knowing the standard hatching angle")]
))

questions.append(tf_q(
    "cuet-eg-sections-32", "easy", "Visible Edges Behind Section",
    ["sectional-view", "visible-edges"],
    "In a sectional view, the visible edges and features behind the cutting plane are also shown.",
    True,
    "A sectional view shows both the hatched section AND the visible edges/features behind the cutting plane. This distinguishes it from a plain 'section' which shows only the cut surface.",
    [hint("B", "A sectional view (not just a section) includes visible features behind the cutting plane. This is standard practice for complete representation.", "Confusing section with sectional view")]
))

questions.append(tf_q(
    "cuet-eg-sections-33", "medium", "Sphere Section",
    ["sphere", "section-shape"],
    "Any plane cutting through a sphere always produces a circular section.",
    True,
    "A sphere is perfectly symmetric about its center. Any cutting plane intersects the sphere surface in a circle. The radius of the circle depends on the distance of the cutting plane from the center.",
    [hint("B", "Due to the sphere's perfect symmetry, every planar cross-section is a circle. Unlike a cone (which gives different conics), a sphere always gives circles.", "Applying cone-section variety to sphere")]
))

questions.append(tf_q(
    "cuet-eg-sections-34", "medium", "Section Plane Through Apex",
    ["cone", "apex-section"],
    "When a cutting plane passes through the apex of a cone, the section is always a triangle regardless of the plane's inclination.",
    True,
    "Any plane through the apex of a cone intersects two generators (straight lines from apex to base circle) and a chord of the base circle, forming a triangle. The triangle's shape varies with inclination, but it's always a triangle.",
    [hint("B", "A plane through the apex must intersect two generators. These generators form two sides of a triangle. The base circle chord completes the third side. This is always a triangle.", "Not visualizing the apex-plane intersection")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# FILL-IN-BLANKS (2): cuet-eg-sections-35 to 36
# ═══════════════════════════════════════════════════════════════════════════════

q35 = base("cuet-eg-sections-35", "fill-in-blanks", "easy", "remember", "Section Terminology", ["section", "terminology"])
q35.update({
    "question_text": "The line of intersection of the cutting plane with the surface of a solid is called the _____ of the section.",
    "text_with_blanks": "The line of intersection of the cutting plane with the surface of a solid is called the _____ of the section.",
    "correct_answer": "D",
    "explanation": "The boundary or outline of a section — where the cutting plane meets the solid surface — is called the 'section line' or 'outline' of the section. It defines the shape of the cross-section.",
    "options": [
        opt("A", "Generator"),
        opt("B", "Axis"),
        opt("C", "Hatching"),
        opt("D", "Outline", True),
    ],
    "elimination_hints": [
        hint("A", "A generator is a straight line on the surface of a cone or cylinder, not the intersection of a cutting plane.", "Confusing generator with section boundary"),
        hint("B", "The axis is the central imaginary line of the solid, not related to the cutting plane intersection.", "Confusing axis with section outline"),
        hint("C", "Hatching is the pattern of lines drawn inside the section to indicate the cut material. The outline is the boundary itself.", "Confusing interior hatching with boundary"),
    ]
})
questions.append(q35)

q36 = base("cuet-eg-sections-36", "fill-in-blanks", "medium", "understand", "Ellipse Minor Axis", ["cylinder", "ellipse-axis"])
q36.update({
    "question_text": "When a cylinder is cut by a plane inclined to its axis, the minor axis of the resulting elliptical section equals the _____ of the cylinder.",
    "text_with_blanks": "When a cylinder is cut by a plane inclined to its axis, the minor axis of the resulting elliptical section equals the _____ of the cylinder.",
    "correct_answer": "C",
    "explanation": "The minor axis of the elliptical section of a cylinder equals the diameter. This is because the narrowest dimension of the section (perpendicular to the major axis) spans the full width of the cylinder.",
    "options": [
        opt("A", "Radius"),
        opt("B", "Height"),
        opt("C", "Diameter", True),
        opt("D", "Circumference"),
    ],
    "elimination_hints": [
        hint("A", "The radius is half the diameter. The minor axis spans the full width of the cylinder, which is the diameter, not the radius.", "Confusing radius with diameter"),
        hint("B", "The height of the cylinder is its length, not related to the cross-sectional dimension of the section.", "Confusing height with cross-sectional dimension"),
        hint("D", "The circumference is the perimeter of the circular cross-section, not a linear dimension of the ellipse.", "Confusing linear dimension with perimeter"),
    ]
})
questions.append(q36)

# ═══════════════════════════════════════════════════════════════════════════════
# SCENARIO-BASED (2): cuet-eg-sections-37 to 38
# ═══════════════════════════════════════════════════════════════════════════════

q37 = base("cuet-eg-sections-37", "scenario-based", "medium", "apply", "Pipe Section", ["real-world", "cylinder-section"])
q37.update({
    "question_text": "Based on the scenario, what is the true shape of the section at the joint?",
    "scenario": "A plumber needs to join a cylindrical water pipe (diameter 100 mm) to a larger pipe at an angle. The smaller pipe is cut at 60° to its axis to create the joint. The plumber wants to know the shape of the cut end to prepare a gasket.",
    "correct_answer": "A",
    "explanation": "Cutting a cylinder at an angle to its axis produces an ellipse. The minor axis = diameter = 100 mm. The major axis = 100/sin(60°) = 100/0.866 = 115.47 mm. The plumber needs an elliptical gasket.",
    "options": [
        opt("A", "An ellipse with minor axis 100 mm and major axis approximately 115.5 mm", True),
        opt("B", "A circle of diameter 100 mm"),
        opt("C", "A rectangle"),
        opt("D", "An ellipse with minor axis 50 mm and major axis 100 mm"),
    ],
    "elimination_hints": [
        hint("B", "A circle results only from a perpendicular cut. The 60° angle produces an ellipse.", "Ignoring the angle of cut"),
        hint("C", "A rectangle is not possible as a section of a cylinder. Cylinders have curved surfaces.", "Applying prism section to cylinder"),
        hint("D", "50 mm is the radius, not the diameter. The minor axis equals the diameter (100 mm), not the radius.", "Using radius instead of diameter for minor axis"),
    ]
})
questions.append(q37)

q38 = base("cuet-eg-sections-38", "scenario-based", "hard", "evaluate", "Building Column Section", ["real-world", "prism-section"])
q38.update({
    "question_text": "Based on the scenario, what is the shape and number of sides of the section?",
    "scenario": "An architect designs a building with octagonal concrete columns (regular octagonal cross-section). During renovation, a new beam needs to pass through a column at an angle. The beam requires a slot cut through the column using a plane inclined at 45° to the horizontal, passing through all 8 lateral faces of the column.",
    "correct_answer": "D",
    "explanation": "If the cutting plane passes through all 8 lateral faces of the octagonal prism (column), the section will be an 8-sided polygon (irregular octagon). Each face contributes one edge to the section, giving 8 sides total.",
    "options": [
        opt("A", "A regular octagon with 8 equal sides"),
        opt("B", "A rectangle with 4 sides"),
        opt("C", "A hexagon with 6 sides"),
        opt("D", "An irregular octagon with 8 sides", True),
    ],
    "elimination_hints": [
        hint("A", "The section has 8 sides, but they are NOT equal because the inclined plane intersects different faces at different heights, producing unequal edges.", "Assuming all section sides are equal"),
        hint("B", "4 sides would mean only 4 faces are cut. With the plane passing through all 8 faces, there are 8 section sides.", "Undercounting faces cut"),
        hint("C", "6 sides would mean 6 faces are cut. The scenario states the plane passes through all 8 faces.", "Confusing octagonal with hexagonal section"),
    ]
})
questions.append(q38)

# ═══════════════════════════════════════════════════════════════════════════════
# LOGICAL-SEQUENCE (2): cuet-eg-sections-39 to 40
# ═══════════════════════════════════════════════════════════════════════════════

q39 = base("cuet-eg-sections-39", "logical-sequence", "medium", "understand", "Drawing Sectional View Steps", ["sectional-view", "drawing-steps"])
q39.update({
    "question_text": "Arrange the steps for drawing the sectional top view of a cylinder cut by an inclined plane (⊥ VP):",
    "items": [
        {"id": "1", "text": "Draw the front view (rectangle) and top view (circle) of the cylinder"},
        {"id": "2", "text": "Draw the cutting plane line (inclined) on the front view"},
        {"id": "3", "text": "Divide the circle (TV) into 12 equal parts and project to FV"},
        {"id": "4", "text": "Mark points where the cutting plane intersects the generator lines in FV"},
        {"id": "5", "text": "Project the intersection points down from FV to TV"},
        {"id": "6", "text": "Connect the projected points in TV to get the sectional top view (ellipse)"}
    ],
    "correct_order": ["1", "2", "3", "4", "5", "6"],
    "correct_answer": "B",
    "explanation": "Correct order: Draw views → Draw cutting plane → Divide TV circle into 12 parts → Find intersection points on cutting plane in FV → Project down to TV → Connect to form ellipse.",
    "options": [
        opt("A", "1, 3, 2, 4, 5, 6"),
        opt("B", "1, 2, 3, 4, 5, 6", True),
        opt("C", "2, 1, 3, 4, 6, 5"),
        opt("D", "1, 2, 4, 3, 5, 6"),
    ],
    "elimination_hints": [
        hint("A", "Step 3 (dividing TV) before Step 2 (drawing cutting plane) is inefficient. The cutting plane should be drawn first to know what's being cut.", "Drawing references before knowing the cut"),
        hint("C", "Step 2 (cutting plane) before Step 1 (views) is impossible. You need the FV to place the cutting plane on.", "Drawing cutting plane before the view exists"),
        hint("D", "Step 4 (finding intersections) before Step 3 (dividing circle) won't work. You need the 12-part division to create generator reference lines.", "Finding intersections without generator references"),
    ]
})
questions.append(q39)

q40 = base("cuet-eg-sections-40", "logical-sequence", "hard", "analyze", "True Shape by Auxiliary Plane", ["true-shape", "auxiliary-construction"])
q40.update({
    "question_text": "Arrange the steps for finding the true shape of a section using the auxiliary plane method:",
    "items": [
        {"id": "1", "text": "Draw the FV and TV of the solid with the cutting plane shown in FV"},
        {"id": "2", "text": "Mark and label all section points where the cutting plane intersects the solid edges in FV"},
        {"id": "3", "text": "Project the section points to the TV and mark them"},
        {"id": "4", "text": "Draw the auxiliary reference line X₁Y₁ parallel to the cutting plane line in FV"},
        {"id": "5", "text": "From each section point in FV, draw projectors perpendicular to X₁Y₁"},
        {"id": "6", "text": "Transfer distances from XY to each section point in TV to the corresponding projectors from X₁Y₁ and connect the points"}
    ],
    "correct_order": ["1", "2", "3", "4", "5", "6"],
    "correct_answer": "C",
    "explanation": "Correct order: Draw views with cutting plane → Mark section points in FV → Project to TV → Draw X₁Y₁ parallel to cutting plane → Draw projectors from FV points ⊥ X₁Y₁ → Transfer TV distances to get true shape.",
    "options": [
        opt("A", "1, 2, 4, 3, 5, 6"),
        opt("B", "1, 4, 2, 3, 5, 6"),
        opt("C", "1, 2, 3, 4, 5, 6", True),
        opt("D", "1, 2, 3, 5, 4, 6"),
    ],
    "elimination_hints": [
        hint("A", "Step 4 (X₁Y₁) before Step 3 (projecting to TV) won't work. You need the TV distances to transfer to the auxiliary view.", "Drawing auxiliary before having TV projections"),
        hint("B", "Step 4 (X₁Y₁) before Step 2 (marking FV points) is premature. You need FV section points first.", "Drawing auxiliary reference before identifying section points"),
        hint("D", "Step 5 (projectors from FV) before Step 4 (X₁Y₁) won't work. You need the reference line X₁Y₁ before drawing projectors perpendicular to it.", "Drawing projectors before establishing reference line"),
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
