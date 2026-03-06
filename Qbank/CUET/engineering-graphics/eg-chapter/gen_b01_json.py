#!/usr/bin/env python3
"""Generate the 40-question JSON for B01: Scales and Engineering Curves."""
import json, os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cuet-eg-scales-b01.json")

# Common fields for every question
def base(qid, qtype, diff, bloom, subtopic, tags):
    return {
        "id": qid,
        "chapter_id": "cuet-eg-engineering-graphics",
        "topic_id": "cuet-eg-scales",
        "question_type": qtype,
        "difficulty": diff,
        "subject": "engineering-graphics",
        "chapter": "Engineering Graphics",
        "topic": "Scales and Engineering Curves",
        "subtopic": subtopic,
        "bloom_level": bloom,
        "exam_suitability": ["CUET"],
        "concept_tags": tags,
    }

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

def opt(k, t, c=False):
    return {"key": k, "text": t, "is_correct": c}

def hint(k, h, m=None):
    d = {"option_key": k, "hint": h}
    d["misconception"] = m
    return d

questions = []

# ═══════════════════════════════════════════════════════════════════════════════
# MCQ — EASY (5 questions: 01–05)
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(mcq(
    "cuet-eg-scales-01", "easy", "remember", "Representative Fraction",
    ["representative-fraction", "scale-definition"],
    "The ratio of the length of the drawing to the actual length of the object is called:",
    [opt("A", "Representative Fraction (RF)", True), opt("B", "Scale Factor"), opt("C", "Proportional Index"), opt("D", "Drawing Ratio")],
    "A",
    "Representative Fraction (RF) is defined as the ratio of the length of the drawing to the actual length of the object. RF = Length of drawing / Actual length.",
    [hint("B", "Scale Factor is a general term but the specific technical term in engineering drawing is Representative Fraction (RF).", "Confusing general and specific terminology"),
     hint("C", "Proportional Index is not a standard term used in engineering graphics.", "Inventing plausible-sounding terms"),
     hint("D", "Drawing Ratio is not the standard technical term; the correct term is RF.", "Using informal language instead of standard terminology")]
))

questions.append(mcq(
    "cuet-eg-scales-02", "easy", "remember", "Types of Scales",
    ["plain-scale", "scale-types"],
    "A plain scale is used to read measurements in:",
    [opt("A", "One unit only"), opt("B", "Two consecutive units", True), opt("C", "Three consecutive units"), opt("D", "Any number of units")],
    "B",
    "A plain scale reads in two consecutive units — for example, metres and decimetres. It has main divisions and subdivisions of the first main division.",
    [hint("A", "A plain scale has both main divisions and subdivisions, so it reads two units, not one.", "Forgetting that plain scales have subdivisions"),
     hint("C", "Three consecutive units can be read using a diagonal scale, not a plain scale.", "Confusing plain and diagonal scales"),
     hint("D", "No single scale type reads any arbitrary number of units; each type has a specific capability.", "Overgeneralizing scale capability")]
))

questions.append(mcq(
    "cuet-eg-scales-03", "easy", "remember", "Reducing and Enlarging Scales",
    ["reducing-scale", "enlarging-scale", "rf"],
    "If the RF of a scale is 1:5, the scale is a:",
    [opt("A", "Full-size scale"), opt("B", "Enlarging scale"), opt("C", "Reducing scale", True), opt("D", "Diagonal scale")],
    "C",
    "When RF < 1 (i.e., the drawing is smaller than the actual object), the scale is a reducing scale. RF = 1:5 means 1/5, which is less than 1.",
    [hint("A", "Full-size scale has RF = 1:1. Here RF = 1:5, so the drawing is five times smaller than the object.", "Ignoring the ratio value"),
     hint("B", "Enlarging scale has RF > 1 (e.g., 5:1). Here RF = 1:5 which is less than 1.", "Reversing the RF inequality for enlarging scales"),
     hint("D", "Diagonal scale is a type of scale construction, not a category of RF value.", "Confusing scale type with scale category")]
))

questions.append(mcq(
    "cuet-eg-scales-04", "easy", "remember", "Eccentricity of Conic Sections",
    ["ellipse", "eccentricity", "conic-sections"],
    "For an ellipse, the eccentricity (e) is:",
    [opt("A", "Equal to 1"), opt("B", "Greater than 1"), opt("C", "Equal to 0"), opt("D", "Less than 1", True)],
    "D",
    "An ellipse has eccentricity e < 1. For a parabola e = 1 and for a hyperbola e > 1. A circle is a special case with e = 0.",
    [hint("A", "Eccentricity equal to 1 defines a parabola, not an ellipse.", "Confusing parabola and ellipse eccentricities"),
     hint("B", "Eccentricity greater than 1 defines a hyperbola, not an ellipse.", "Confusing hyperbola and ellipse eccentricities"),
     hint("C", "Eccentricity of 0 defines a circle, which is a special case of an ellipse but not an ellipse in general.", "Confusing circle with general ellipse")]
))

questions.append(mcq(
    "cuet-eg-scales-05", "easy", "remember", "Cycloid Definition",
    ["cycloid", "curve-definition"],
    "A cycloid is a curve traced by a point on the circumference of a circle that:",
    [opt("A", "Rotates about its own centre"), opt("B", "Rolls along a straight line without slipping", True), opt("C", "Rolls inside another circle"), opt("D", "Rolls outside another circle")],
    "B",
    "A cycloid is generated by a point on the circumference of a circle rolling along a straight line without slipping. Rolling inside another circle generates a hypocycloid, and rolling outside generates an epicycloid.",
    [hint("A", "A circle rotating about its own centre traces a circle, not a cycloid.", "Confusing rotation with rolling"),
     hint("C", "A circle rolling inside another circle generates a hypocycloid, not a cycloid.", "Confusing cycloid and hypocycloid"),
     hint("D", "A circle rolling outside another circle generates an epicycloid, not a cycloid.", "Confusing cycloid and epicycloid")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# MCQ — MEDIUM (10 questions: 06–15)
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(mcq(
    "cuet-eg-scales-06", "medium", "apply", "Plain Scale Calculation",
    ["plain-scale", "rf-calculation"],
    "A plain scale of RF = 1:25 is to show metres and decimetres and long enough to measure up to 4 metres. The total length of the scale on the drawing will be:",
    [opt("A", "10 cm"), opt("B", "25 cm"), opt("C", "16 cm", True), opt("D", "20 cm")],
    "C",
    "Length of scale = RF x Maximum distance = (1/25) x 4 m = (1/25) x 400 cm = 16 cm.",
    [hint("A", "10 cm would imply RF x 4m = 10 cm, giving RF = 1:40 which does not match.", "Arithmetic error in RF calculation"),
     hint("B", "25 cm confuses the denominator of the RF with the scale length. The RF denominator is 25, not the drawing length.", "Confusing RF denominator with scale length"),
     hint("D", "20 cm would require RF = 1:20, not 1:25.", "Incorrect division")]
))

questions.append(mcq(
    "cuet-eg-scales-07", "medium", "understand", "Diagonal Scale Principle",
    ["diagonal-scale", "principle-of-diagonal"],
    "The principle of a diagonal scale is based on:",
    [opt("A", "The similarity of triangles", True), opt("B", "The Pythagorean theorem"), opt("C", "The principle of superposition"), opt("D", "Parallel line division")],
    "A",
    "A diagonal scale works on the principle of similar triangles. When a line is divided into equal parts and diagonals are drawn, the intercepts at different heights give proportional (smaller) divisions based on triangle similarity.",
    [hint("B", "The Pythagorean theorem relates sides of a right triangle but is not the principle behind diagonal scale construction.", "Applying wrong geometric theorem"),
     hint("C", "The principle of superposition is used in structural analysis, not in scale construction.", "Mixing engineering disciplines"),
     hint("D", "While parallel lines are drawn in the construction, the underlying principle is similar triangles, not parallel line division per se.", "Identifying a construction step instead of the principle")]
))

questions.append(mcq(
    "cuet-eg-scales-08", "medium", "apply", "Focus-Directrix Method",
    ["focus-directrix", "conic-sections"],
    "In the focus-directrix method of constructing a conic section, if the distance of a point from the focus is 3 cm and from the directrix is 4 cm, the eccentricity is:",
    [opt("A", "4/3"), opt("B", "3/4"), opt("C", "7"), opt("D", "0.75", True)],
    "D",
    "Eccentricity e = distance from focus / distance from directrix = 3/4 = 0.75. Since e < 1, this conic section is an ellipse.",
    [hint("A", "4/3 = 1.33 reverses the ratio. Eccentricity is (distance from focus)/(distance from directrix), not the other way around.", "Reversing the eccentricity ratio"),
     hint("B", "3/4 is 0.75, which is the same as option D. However, as a fraction it equals D, so this option is a distractor if taken as something different.", "Misreading fraction vs decimal"),
     hint("C", "7 is the sum of the two distances. Eccentricity is a ratio, not a sum.", "Adding distances instead of dividing")]
))

# Fix: B and D are same value — let me correct option B
questions[-1]["options"][1] = opt("B", "1.33")
questions[-1]["elimination_hints"][1] = hint("B", "1.33 reverses the ratio, giving distance from directrix / distance from focus. The correct formula divides focus distance by directrix distance.", "Inverting the eccentricity formula")

questions.append(mcq(
    "cuet-eg-scales-09", "medium", "understand", "Involute Curve",
    ["involute", "curve-generation"],
    "An involute of a circle is generated by:",
    [opt("A", "A point on a circle rolling on a line"), opt("B", "The end of a string being unwound from a circle", True), opt("C", "A point inside a rolling circle"), opt("D", "The intersection of two rotating lines")],
    "B",
    "An involute is the curve traced by the free end of a taut string as it is unwound from a circle (or polygon). It is not generated by a rolling circle.",
    [hint("A", "A point on a circle rolling on a line generates a cycloid, not an involute.", "Confusing involute with cycloid"),
     hint("C", "A point inside a rolling circle traces a trochoid (specifically a curtate cycloid), not an involute.", "Confusing involute with trochoid"),
     hint("D", "Intersection of rotating lines does not produce a standard engineering curve.", "No standard curve matches this description")]
))

questions.append(mcq(
    "cuet-eg-scales-10", "medium", "apply", "Ellipse Construction",
    ["ellipse", "concentric-circle-method"],
    "In the concentric circle method of drawing an ellipse, if the major axis is 100 mm and minor axis is 60 mm, the radii of the two concentric circles are:",
    [opt("A", "100 mm and 60 mm"), opt("B", "50 mm and 60 mm"), opt("C", "50 mm and 30 mm", True), opt("D", "100 mm and 30 mm")],
    "C",
    "In the concentric circle method, two circles are drawn with radii equal to the semi-major axis (a = 100/2 = 50 mm) and semi-minor axis (b = 60/2 = 30 mm).",
    [hint("A", "100 and 60 are the full axis lengths, not the semi-axes. The radii of circles are half these values.", "Using full axis instead of semi-axis"),
     hint("B", "50 mm is correct for the outer circle, but 60 mm is the full minor axis, not the semi-minor axis (30 mm).", "Mixing semi-major with full minor axis"),
     hint("D", "100 mm is the full major axis, not the semi-major axis. The outer circle radius should be 50 mm.", "Using full major axis as radius")]
))

questions.append(mcq(
    "cuet-eg-scales-11", "medium", "understand", "Archimedean Spiral",
    ["archimedean-spiral", "spiral-properties"],
    "In an Archimedean spiral, the distance between successive convolutions (turns) is:",
    [opt("A", "Increasing"), opt("B", "Decreasing"), opt("C", "Constant", True), opt("D", "Zero")],
    "C",
    "An Archimedean spiral has a constant distance between successive convolutions. This is because the radius increases uniformly with the angle of rotation (r = a + b*theta).",
    [hint("A", "Increasing distance between turns describes a logarithmic spiral, not an Archimedean spiral.", "Confusing Archimedean with logarithmic spiral"),
     hint("B", "Decreasing distance is not a property of any standard spiral type encountered in engineering graphics.", "No standard spiral has this property"),
     hint("D", "Zero distance would mean the spiral overlaps itself, which is not a spiral at all.", "Misunderstanding spiral geometry")]
))

questions.append(mcq(
    "cuet-eg-scales-12", "medium", "apply", "Scale of Chords",
    ["scale-of-chords", "angle-measurement"],
    "A scale of chords is used for measuring or constructing:",
    [opt("A", "Lengths of arcs"), opt("B", "Diameters of circles"), opt("C", "Angles without a protractor"), opt("D", "Angles without a protractor", True)],
    "D",
    "A scale of chords is used to construct or measure angles when a protractor is not available. It is based on the property that the chord length subtended by an angle at the centre varies with the angle.",
    [hint("A", "Arc lengths are measured using plain or diagonal scales, not a scale of chords.", "Confusing chord with arc measurement"),
     hint("B", "Diameters are linear measurements and do not require a scale of chords.", "Confusing angular with linear measurement"),
     hint("C", "This is the same as D — both describe measuring angles without a protractor.", None)]
))

# Fix: C and D are identical — correct option C
questions[-1]["options"][2] = opt("C", "Curvatures of parabolas")
questions[-1]["correct_answer"] = "D"
questions[-1]["elimination_hints"][2] = hint("C", "Curvature of parabolas is determined by the focus and directrix, not by a scale of chords.", "Confusing curve properties with angular measurement")

questions.append(mcq(
    "cuet-eg-scales-13", "medium", "understand", "Epicycloid vs Hypocycloid",
    ["epicycloid", "hypocycloid", "cycloidal-curves"],
    "When a circle rolls on the outside of another fixed circle, the curve traced by a point on its circumference is called:",
    [opt("A", "Cycloid"), opt("B", "Hypocycloid"), opt("C", "Epicycloid"), opt("D", "Epicycloid", True)],
    "D",
    "An epicycloid is traced when a circle rolls on the outside of a fixed circle. A hypocycloid is traced when it rolls inside. A plain cycloid is traced on a straight line.",
    [hint("A", "A cycloid is generated by rolling on a straight line, not on another circle.", "Confusing straight-line and circular rolling"),
     hint("B", "Hypocycloid is generated when the circle rolls inside the fixed circle, not outside.", "Reversing inside/outside rolling"),
     hint("C", "This is correct — same as D.", None)]
))

# Fix: C and D identical — correct C
questions[-1]["options"][2] = opt("C", "Involute")
questions[-1]["correct_answer"] = "D"
questions[-1]["elimination_hints"][2] = hint("C", "An involute is generated by unwinding a string from a circle, not by rolling a circle on another circle.", "Confusing involute with epicycloid")
# Actually let me make D the epicycloid correctly and fix C
questions[-1]["options"] = [
    opt("A", "Cycloid"),
    opt("B", "Hypocycloid"),
    opt("C", "Involute"),
    opt("D", "Epicycloid", True)
]

questions.append(mcq(
    "cuet-eg-scales-14", "medium", "apply", "Comparative Scale",
    ["comparative-scale", "scale-types"],
    "A comparative scale is used to:",
    [opt("A", "Compare two different units of measurement", True), opt("B", "Enlarge a small drawing"), opt("C", "Read three units simultaneously"), opt("D", "Subdivide a diagonal")],
    "A",
    "A comparative scale consists of two scales of different units constructed with the same RF, placed side by side for direct comparison (e.g., kilometres and miles).",
    [hint("B", "Enlarging a drawing depends on the RF value, not the scale type. Any scale can be enlarging or reducing.", "Confusing scale type with RF category"),
     hint("C", "Reading three units simultaneously is the function of a diagonal scale, not a comparative scale.", "Confusing comparative and diagonal scale functions"),
     hint("D", "Subdividing a diagonal is a construction technique in diagonal scales, not a function of comparative scales.", "Mixing construction steps with scale types")]
))

questions.append(mcq(
    "cuet-eg-scales-15", "medium", "apply", "Parabola Construction",
    ["parabola", "rectangle-method"],
    "In the rectangle (or parallelogram) method of constructing a parabola, the enclosing rectangle has its sides equal to:",
    [opt("A", "The span and the rise of the parabola"), opt("B", "The focus distance and the vertex"), opt("C", "The base and the double ordinate", True), opt("D", "The directrix and the axis length")],
    "C",
    "In the rectangle method, the rectangle is formed by the base (equal to the double ordinate or chord) and the height (equal to the abscissa or the distance along the axis). The sides are divided into equal parts to locate points on the parabola.",
    [hint("A", "Span and rise are terms used in arch construction, not directly in the rectangle method of parabola construction in EG.", "Using structural engineering terms in a drawing context"),
     hint("B", "Focus distance relates to the focus-directrix method, not the rectangle method.", "Confusing two different construction methods"),
     hint("D", "Directrix is used in the eccentricity method. The rectangle method uses the bounding rectangle of the curve.", "Mixing eccentricity method with rectangle method")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# MCQ — HARD (5 questions: 16–20)
# ═══════════════════════════════════════════════════════════════════════════════

questions.append(mcq(
    "cuet-eg-scales-16", "hard", "analyze", "RF Calculation",
    ["rf-calculation", "unit-conversion"],
    "A 5 cm long line on a map represents an actual distance of 250 metres. The RF of the map is:",
    [opt("A", "1:50"), opt("B", "1:500"), opt("C", "1:5000", True), opt("D", "1:50000")],
    "D",
    "RF = Drawing length / Actual length = 5 cm / 250 m = 5 cm / 25000 cm = 1/5000. So RF = 1:5000.",
    [hint("A", "1:50 would mean 5 cm represents 250 cm = 2.5 m, not 250 m.", "Forgetting unit conversion from metres to centimetres"),
     hint("B", "1:500 would mean 5 cm represents 2500 cm = 25 m, not 250 m.", "Partial unit conversion error"),
     hint("D", "1:50000 would mean 5 cm represents 250000 cm = 2500 m = 2.5 km, not 250 m.", "Over-converting by an extra factor of 10")]
))

# Fix: answer was D but explanation says 1:5000 which is C
questions[-1]["correct_answer"] = "C"
questions[-1]["options"][2] = opt("C", "1:5000", True)
questions[-1]["options"][3] = opt("D", "1:50000")

questions.append(mcq(
    "cuet-eg-scales-17", "hard", "analyze", "Vernier Scale",
    ["vernier-scale", "least-count"],
    "A vernier scale has a main scale division of 1 mm and 50 vernier divisions coinciding with 49 main scale divisions. The least count of the vernier scale is:",
    [opt("A", "0.1 mm"), opt("B", "0.5 mm"), opt("C", "0.02 mm", True), opt("D", "0.05 mm")],
    "C",
    "Least count = 1 MSD - 1 VSD. Since 50 VSD = 49 MSD, 1 VSD = 49/50 MSD = 0.98 mm. Least count = 1 - 0.98 = 0.02 mm.",
    [hint("A", "0.1 mm would result from 10 VSD = 9 MSD, which is a different vernier configuration.", "Assuming a simpler vernier ratio"),
     hint("B", "0.5 mm is half the MSD, not the least count. The least count formula is 1 MSD - 1 VSD.", "Confusing half-division with least count"),
     hint("D", "0.05 mm would result from 20 VSD = 19 MSD, not the 50:49 ratio given.", "Using wrong vernier ratio")]
))

questions.append(mcq(
    "cuet-eg-scales-18", "hard", "analyze", "Helix vs Spiral",
    ["helix", "spiral", "3d-curves"],
    "The fundamental difference between a helix and a spiral is that a helix is:",
    [opt("A", "A plane curve while a spiral is a space curve"), opt("B", "A space curve while a spiral is a plane curve", True), opt("C", "Always circular while a spiral is always elliptical"), opt("D", "Generated by a rolling circle while a spiral is not")],
    "B",
    "A helix is a three-dimensional (space) curve that rises uniformly along an axis. A spiral is a two-dimensional (plane) curve where the radius changes continuously. Both are distinct classes of curves in engineering graphics.",
    [hint("A", "This reverses the correct relationship. A spiral lies in a plane, while a helix extends into three dimensions.", "Reversing the 2D/3D classification"),
     hint("C", "A helix can have a circular or elliptical cross-section, and spirals can be circular too. The distinction is 2D vs 3D, not shape.", "Incorrect basis for distinction"),
     hint("D", "Neither a helix nor a spiral is necessarily generated by a rolling circle. That describes cycloidal curves.", "Confusing generation method with curve classification")]
))

questions.append(mcq(
    "cuet-eg-scales-19", "hard", "apply", "Tangent and Normal to Ellipse",
    ["ellipse", "tangent-normal"],
    "In the concentric circle method of constructing an ellipse with semi-major axis a = 60 mm and semi-minor axis b = 40 mm, the total number of points obtained on the ellipse when 12 equal divisions are made on the circles is:",
    [opt("A", "6"), opt("B", "24"), opt("C", "48"), opt("D", "12", True)],
    "D",
    "When the concentric circles are divided into 12 equal parts, 12 radial lines are drawn. Each radial line gives one point on the ellipse (by taking the horizontal distance from the outer circle and vertical distance from the inner circle). So 12 points are obtained.",
    [hint("A", "6 would be the case if only half the circle is divided, but the full circle with 12 divisions gives 12 points.", "Counting only half the divisions"),
     hint("B", "24 would mean two points per radial line, but each radial line intersects the ellipse construction at only one point.", "Double-counting points"),
     hint("C", "48 would mean four points per division which has no basis in the concentric circle method.", "Over-counting by a factor of 4")]
))

questions.append(mcq(
    "cuet-eg-scales-20", "hard", "analyze", "Evolute of a Curve",
    ["involute", "evolute", "advanced-curves"],
    "The evolute of a circle is:",
    [opt("A", "Another circle"), opt("B", "An ellipse"), opt("C", "A spiral"), opt("D", "A single point (its centre)", True)],
    "D",
    "The evolute of a curve is the locus of its centres of curvature. Since every point on a circle has the same centre of curvature (the centre of the circle), the evolute of a circle is a single point — its centre.",
    [hint("A", "Another circle would mean varying centres of curvature at different radii. A circle has a fixed centre of curvature.", "Assuming the evolute has the same shape"),
     hint("B", "An ellipse as evolute would imply varying radii of curvature in an asymmetric pattern, which does not apply to a circle.", "Guessing a related conic section"),
     hint("C", "A spiral would imply a continuously changing centre of curvature, which contradicts the constant curvature of a circle.", "Confusing evolute with involute")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# DIAGRAM-BASED (4 questions: 21–24)
# ═══════════════════════════════════════════════════════════════════════════════

# Q21 — Easy — Plain Scale reading
q21 = base("cuet-eg-scales-21", "diagram-based", "easy", "apply", "Plain Scale", ["plain-scale", "scale-reading"])
q21.update({
    "question_text": "From the plain scale shown in the figure (RF = 1:50, reading in metres), determine the length indicated by the red arrow.",
    "correct_answer": "B",
    "explanation": "The red arrow starts at the 6th subdivision mark from 0 on the left (= 0.6 m) and extends to the 3 m mark on the right. Total length = 3 m + 0.6 m = 3.6 m.",
    "image_uri": "question-images/engineering-graphics/scales/cuet-eg-scales-21-plain-scale.png",
    "image_alt": "A plain scale with RF 1:50 showing metres, with a red double-arrow marking an unknown length from the subdivision area to the 3-metre mark.",
    "options": [
        opt("A", "3.4 m"), opt("B", "3.6 m", True), opt("C", "3.8 m"), opt("D", "4.0 m")
    ],
    "elimination_hints": [
        hint("A", "3.4 m would place the left marker at the 4th subdivision, but it is at the 6th. Count carefully from zero.", "Miscounting subdivision marks"),
        hint("C", "3.8 m would need the marker at the 8th subdivision, but it is clearly before the midpoint of the subdivided section.", "Over-reading subdivisions"),
        hint("D", "4.0 m would mean the left marker is at 1.0 m (the full first division). The marker is well within the subdivisions.", "Ignoring subdivision reading")
    ]
})
questions.append(q21)

# Q22 — Medium — Ellipse concentric circle
q22 = base("cuet-eg-scales-22", "diagram-based", "medium", "understand", "Ellipse Construction", ["ellipse", "concentric-circle-method"])
q22.update({
    "question_text": "The figure shows an ellipse constructed by the concentric circle method. The outer circle (blue, dashed) has radius a = 4.5 and the inner circle (green, dashed) has radius b = 3.0. Which statement about this construction is CORRECT?",
    "correct_answer": "C",
    "explanation": "In the concentric circle method, radial lines are drawn from the centre. For each radial line, the x-coordinate is taken from the outer circle and the y-coordinate from the inner circle, giving the ellipse point. Both circles are needed simultaneously.",
    "image_uri": "question-images/engineering-graphics/scales/cuet-eg-scales-22-ellipse-concentric.png",
    "image_alt": "An ellipse drawn by the concentric circle method showing two concentric circles (radii 4.5 and 3.0), radial lines, construction points, and the resulting ellipse in red.",
    "options": [
        opt("A", "The inner circle passes through the ends of the major axis"),
        opt("B", "The outer circle passes through the ends of the minor axis"),
        opt("C", "The x-coordinate of each ellipse point comes from the outer circle and y-coordinate from the inner circle", True),
        opt("D", "The number of points on the ellipse equals twice the number of radial divisions")
    ],
    "elimination_hints": [
        hint("A", "The inner circle has radius b (semi-minor), so it passes through the ends of the minor axis, not the major axis.", "Swapping major and minor axis associations"),
        hint("B", "The outer circle has radius a (semi-major), so it passes through the ends of the major axis, not the minor axis.", "Swapping major and minor axis associations"),
        hint("D", "Each radial division gives exactly one point on the ellipse, so the count equals the number of divisions, not twice.", "Double-counting construction points")
    ]
})
questions.append(q22)

# Q23 — Medium — Cycloid
q23 = base("cuet-eg-scales-23", "diagram-based", "medium", "analyze", "Cycloid Curve", ["cycloid", "generating-circle"])
q23.update({
    "question_text": "The figure shows a cycloid generated by a circle of radius r rolling on a straight base line. The highest point of the cycloid above the base line is at a distance of:",
    "correct_answer": "A",
    "explanation": "The highest point of a cycloid occurs when the generating point is at the topmost position of the rolling circle. At that instant, the point is at a height of 2r (the diameter of the generating circle) above the base line.",
    "image_uri": "question-images/engineering-graphics/scales/cuet-eg-scales-23-cycloid.png",
    "image_alt": "A cycloid curve generated by a circle rolling on a straight line, with the generating circle shown at several positions and the highest point labeled as 2r from base.",
    "options": [
        opt("A", "2r (diameter of the generating circle)", True),
        opt("B", "r (radius of the generating circle)"),
        opt("C", "pi * r"),
        opt("D", "2 * pi * r")
    ],
    "elimination_hints": [
        hint("B", "r is only the radius. When the generating point is at the top, it is at the centre height (r) plus the radius (r) = 2r.", "Forgetting to add centre height"),
        hint("C", "pi * r relates to half the base length of one arch of the cycloid, not the height.", "Confusing base length formula with height"),
        hint("D", "2 * pi * r is the total base length of one complete arch (circumference of the generating circle), not the height.", "Confusing circumference with height")
    ]
})
questions.append(q23)

# Q24 — Hard — Diagonal Scale reading
q24 = base("cuet-eg-scales-24", "diagram-based", "hard", "apply", "Diagonal Scale", ["diagonal-scale", "three-unit-reading"])
q24.update({
    "question_text": "From the diagonal scale shown (RF = 1:2.5, reading in m, dm, and cm), determine the measurement indicated by the red line at the 7th horizontal row from the bottom.",
    "correct_answer": "D",
    "explanation": "Reading the diagonal scale: The right end of the red line is at the 3 m mark. The left end intersects the diagonal corresponding to 4 dm at the 7th row. The 7th row represents 7 cm. Therefore the reading is 3 m + 4 dm + 7 cm = 3.47 m.",
    "image_uri": "question-images/engineering-graphics/scales/cuet-eg-scales-24-diagonal-scale.png",
    "image_alt": "A diagonal scale with RF 1:2.5 showing metres, decimetres, and centimetres. A red line marks an unknown measurement at the 7th horizontal row.",
    "options": [
        opt("A", "3.37 m"), opt("B", "3.57 m"), opt("C", "3.74 m"), opt("D", "3.47 m", True)
    ],
    "elimination_hints": [
        hint("A", "3.37 m reads the diagonal column as 3 instead of 4, and the cm as 7. Recount the diagonal intersections from the right.", "Miscounting the decimetre subdivision"),
        hint("B", "3.57 m reads 5 dm instead of 4. Count the subdivisions from the zero line (right edge of the diagonal area).", "Reading subdivisions from the wrong end"),
        hint("C", "3.74 m reverses the dm and cm readings (7 dm and 4 cm instead of 4 dm and 7 cm).", "Swapping decimetre and centimetre readings")
    ]
})
questions.append(q24)

# ═══════════════════════════════════════════════════════════════════════════════
# ASSERTION-REASONING (4 questions: 25–28)
# ═══════════════════════════════════════════════════════════════════════════════

AR_OPTS = [
    opt("A", "Both A and R are true and R is the correct explanation of A", True),
    opt("B", "Both A and R are true but R is NOT the correct explanation of A"),
    opt("C", "A is true but R is false"),
    opt("D", "A is false but R is true"),
]

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

questions.append(ar_q(
    "cuet-eg-scales-25", "medium", "understand", "Diagonal Scale",
    ["diagonal-scale", "similar-triangles"],
    "A diagonal scale can measure three consecutive units.",
    "A diagonal scale works on the principle of similar triangles.",
    "A",
    "Both statements are true. A diagonal scale can indeed measure three consecutive units (e.g., m, dm, cm). This ability comes from the principle of similar triangles — the diagonal lines create proportional divisions at each horizontal level, enabling the third unit of measurement.",
    [hint("B", "R directly explains why A is possible: the similar-triangle principle is what enables the third level of subdivision. So R IS the correct explanation.", "Failing to connect similar triangles to three-unit reading"),
     hint("C", "R is true — the diagonal scale principle is indeed based on similar triangles, as stated in standard EG textbooks.", "Incorrectly rejecting a true reason"),
     hint("D", "A is true — diagonal scales are specifically designed to read three consecutive units, unlike plain scales which read only two.", "Incorrectly rejecting a true assertion")]
))

questions.append(ar_q(
    "cuet-eg-scales-26", "medium", "understand", "Parabola Eccentricity",
    ["parabola", "eccentricity"],
    "A parabola is a conic section with eccentricity equal to 1.",
    "In a parabola, every point is equidistant from the focus and the directrix.",
    "A",
    "Both are true and R explains A. Eccentricity e = distance from focus / distance from directrix. Since e = 1 for a parabola, the two distances are always equal, making every point equidistant from the focus and the directrix.",
    [hint("B", "R directly explains A. The definition of e = 1 means focus distance equals directrix distance for every point. R is the geometric interpretation of A.", "Not seeing the direct link between e=1 and equidistance"),
     hint("C", "R is true — it is the fundamental property of a parabola and follows directly from e = 1.", "Incorrectly rejecting the equidistance property"),
     hint("D", "A is true — the eccentricity of a parabola is indeed 1 by definition.", "Incorrectly rejecting e=1 for parabola")]
))

questions.append(ar_q(
    "cuet-eg-scales-27", "hard", "analyze", "Involute Applications",
    ["involute", "gear-teeth"],
    "The involute profile is used for gear tooth design.",
    "The involute of a circle has the property that the normal at any point passes through the centre of the base circle.",
    "C",
    "A is true — involute profiles are indeed standard in gear tooth design because they maintain a constant velocity ratio. R is false — the normal at any point on an involute is tangent to the base circle, not passing through its centre. It is the tangent to the involute that originates from the circle, while the normal is perpendicular to it.",
    [hint("A", "While A is true, R is false. The normal at any point on an involute is tangent to the base circle, it does not pass through the centre.", "Confusing tangent-to-circle with through-centre"),
     hint("B", "R is false, so this option cannot apply. The normal does not pass through the centre.", "Accepting a false reason"),
     hint("D", "A is definitely true — involute gear profiles are an industry standard and widely used.", "Rejecting a well-established engineering fact")]
))

questions.append(ar_q(
    "cuet-eg-scales-28", "hard", "analyze", "Hyperbola Asymptotes",
    ["hyperbola", "asymptotes"],
    "A rectangular (equilateral) hyperbola has its asymptotes perpendicular to each other.",
    "In an equilateral hyperbola, the transverse axis equals the conjugate axis.",
    "A",
    "Both are true and R explains A. In a rectangular hyperbola, the transverse and conjugate axes are equal, which geometrically means the asymptotes make equal angles with both axes. Since the asymptotes bisect the angle between the axes symmetrically, they end up being perpendicular (at 45 degrees to each axis).",
    [hint("B", "R directly explains A. The equality of axes is what forces the asymptotes to be perpendicular. If the axes were unequal, the asymptotes would not be at 90 degrees.", "Failing to connect equal axes with perpendicular asymptotes"),
     hint("C", "R is true — in an equilateral (rectangular) hyperbola, the transverse and conjugate axes are defined to be equal.", "Incorrectly rejecting the axis equality"),
     hint("D", "A is true — perpendicular asymptotes are the defining feature of a rectangular hyperbola.", "Incorrectly rejecting perpendicular asymptotes")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# MATCH-THE-FOLLOWING (2 questions: 29–30)
# ═══════════════════════════════════════════════════════════════════════════════

q29 = base("cuet-eg-scales-29", "match-the-following", "medium", "remember", "Curve Types", ["conic-sections", "eccentricity"])
q29.update({
    "question_text": "Match the following curves with their eccentricity values:\n\nColumn A: (P) Ellipse, (Q) Parabola, (R) Hyperbola, (S) Circle\nColumn B: (1) e = 0, (2) e < 1, (3) e = 1, (4) e > 1",
    "correct_answer": "C",
    "explanation": "Ellipse: e < 1 (P-2), Parabola: e = 1 (Q-3), Hyperbola: e > 1 (R-4), Circle: e = 0 (S-1). The correct matching is P-2, Q-3, R-4, S-1.",
    "column_a": ["Ellipse", "Parabola", "Hyperbola", "Circle"],
    "column_b": ["e = 0", "e < 1", "e = 1", "e > 1"],
    "correct_mapping": {"Ellipse": "e < 1", "Parabola": "e = 1", "Hyperbola": "e > 1", "Circle": "e = 0"},
    "options": [
        opt("A", "P-1, Q-3, R-4, S-2"),
        opt("B", "P-2, Q-4, R-3, S-1"),
        opt("C", "P-2, Q-3, R-4, S-1", True),
        opt("D", "P-4, Q-3, R-2, S-1"),
    ],
    "elimination_hints": [
        hint("A", "P-1 gives Ellipse e=0, but e=0 is for a circle. An ellipse has e<1 (but not zero).", "Confusing circle with ellipse eccentricity"),
        hint("B", "Q-4 gives Parabola e>1, but a parabola has exactly e=1. Also R-3 gives Hyperbola e=1 which is wrong.", "Swapping parabola and hyperbola eccentricities"),
        hint("D", "P-4 gives Ellipse e>1, which is actually a hyperbola. This completely reverses ellipse and hyperbola.", "Reversing ellipse and hyperbola")
    ]
})
questions.append(q29)

q30 = base("cuet-eg-scales-30", "match-the-following", "hard", "understand", "Scale Types and Properties", ["scale-types", "scale-properties"])
q30.update({
    "question_text": "Match the following scale types with their key characteristics:\n\nColumn A: (P) Plain Scale, (Q) Diagonal Scale, (R) Vernier Scale, (S) Scale of Chords\nColumn B: (1) Measures angles, (2) Reads two units, (3) Uses sliding secondary scale, (4) Reads three units",
    "correct_answer": "B",
    "explanation": "Plain Scale reads two units (P-2), Diagonal Scale reads three units (Q-4), Vernier Scale uses a sliding secondary scale (R-3), Scale of Chords measures angles (S-1).",
    "column_a": ["Plain Scale", "Diagonal Scale", "Vernier Scale", "Scale of Chords"],
    "column_b": ["Measures angles", "Reads two units", "Uses sliding secondary scale", "Reads three units"],
    "correct_mapping": {"Plain Scale": "Reads two units", "Diagonal Scale": "Reads three units", "Vernier Scale": "Uses sliding secondary scale", "Scale of Chords": "Measures angles"},
    "options": [
        opt("A", "P-4, Q-2, R-3, S-1"),
        opt("B", "P-2, Q-4, R-3, S-1", True),
        opt("C", "P-2, Q-3, R-4, S-1"),
        opt("D", "P-3, Q-4, R-1, S-2"),
    ],
    "elimination_hints": [
        hint("A", "P-4 says Plain Scale reads three units, but plain scales can only read two consecutive units. Three units need a diagonal scale.", "Overestimating plain scale capability"),
        hint("C", "Q-3 says Diagonal Scale uses a sliding scale, but it uses diagonals and similar triangles, not a sliding mechanism.", "Confusing diagonal and vernier scale mechanisms"),
        hint("D", "S-2 says Scale of Chords reads two units, but it is specifically designed for angular measurement, not linear.", "Confusing angular with linear measurement")
    ]
})
questions.append(q30)

# ═══════════════════════════════════════════════════════════════════════════════
# TRUE-FALSE (4 questions: 31–34)
# ═══════════════════════════════════════════════════════════════════════════════

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

questions.append(tf_q(
    "cuet-eg-scales-31", "easy", "RF Definition",
    ["rf", "scale-basics"],
    "The Representative Fraction (RF) of a scale is always expressed as a unitless ratio.",
    True,
    "RF is a ratio of two lengths in the same units, so the units cancel out, making it a dimensionless (unitless) quantity. For example, RF = 1:50 means 1 cm on drawing = 50 cm actual, so RF = 1/50 (no units).",
    [hint("B", "RF is defined as (drawing length)/(actual length). Since both are in the same units, the ratio is indeed unitless.", "Thinking RF has units")]
))

questions.append(tf_q(
    "cuet-eg-scales-32", "easy", "Cycloid Base Length",
    ["cycloid", "base-length"],
    "The length of the base line for one complete revolution of a cycloid is equal to the circumference of the generating circle (2*pi*r).",
    True,
    "When the generating circle completes one full revolution rolling without slipping, the distance traveled along the base line equals the circumference = 2*pi*r. This is the base length for one arch of the cycloid.",
    [hint("B", "Since the circle rolls without slipping, the base line for one full rotation must equal the circumference. This is a fundamental property of rolling motion.", "Not understanding rolling without slipping")]
))

questions.append(tf_q(
    "cuet-eg-scales-33", "easy", "Enlarging Scale RF",
    ["enlarging-scale", "rf"],
    "An enlarging scale has an RF value less than 1.",
    False,
    "An enlarging scale has RF > 1 (the drawing is larger than the actual object). RF < 1 is a reducing scale. For example, RF = 2:1 means the drawing is twice the actual size.",
    [hint("A", "RF < 1 means the drawing is smaller than actual, which is a reducing scale. An enlarging scale requires RF > 1.", "Reversing reducing and enlarging scale RF conditions")]
))

questions.append(tf_q(
    "cuet-eg-scales-34", "easy", "Parabola Symmetry",
    ["parabola", "symmetry"],
    "A parabola has two axes of symmetry.",
    False,
    "A parabola has only one axis of symmetry — its own axis (the line passing through the focus and perpendicular to the directrix). An ellipse has two axes of symmetry (major and minor), but a parabola has only one.",
    [hint("A", "Only an ellipse and hyperbola have two axes of symmetry. A parabola extends infinitely in one direction and has only a single axis of symmetry.", "Confusing parabola symmetry with ellipse symmetry")]
))

# ═══════════════════════════════════════════════════════════════════════════════
# FILL-IN-BLANKS (2 questions: 35–36)
# ═══════════════════════════════════════════════════════════════════════════════

q35 = base("cuet-eg-scales-35", "fill-in-blanks", "easy", "remember", "Scale Terminology", ["rf", "scale-terminology"])
q35.update({
    "question_text": "The ratio of the length of the drawing to the actual length of the object is called the _____.",
    "text_with_blanks": "The ratio of the length of the drawing to the actual length of the object is called the _____.",
    "correct_answer": "A",
    "explanation": "The Representative Fraction (RF) is defined as the ratio of the drawing length to the actual length. It is the fundamental concept in scale construction.",
    "options": [
        opt("A", "Representative Fraction", True),
        opt("B", "Scale Index"),
        opt("C", "Proportion Ratio"),
        opt("D", "Drawing Factor"),
    ],
    "elimination_hints": [
        hint("B", "Scale Index is not a standard term in engineering graphics.", "Using non-standard terminology"),
        hint("C", "Proportion Ratio is not the accepted technical term; the correct term is Representative Fraction.", "Confusing general language with technical terms"),
        hint("D", "Drawing Factor is not used in engineering drawing standards.", "Inventing a plausible-sounding term")
    ]
})
questions.append(q35)

q36 = base("cuet-eg-scales-36", "fill-in-blanks", "medium", "understand", "Ellipse Axes", ["ellipse", "axes"])
q36.update({
    "question_text": "In an ellipse, the longest chord passing through the centre is called the _____ axis, and the shortest chord through the centre perpendicular to it is called the _____ axis.",
    "text_with_blanks": "In an ellipse, the longest chord passing through the centre is called the _____ axis, and the shortest chord through the centre perpendicular to it is called the _____ axis.",
    "correct_answer": "C",
    "explanation": "The major axis is the longest chord of an ellipse passing through both foci and the centre. The minor axis is perpendicular to it at the centre and is the shortest diameter.",
    "options": [
        opt("A", "transverse, conjugate"),
        opt("B", "principal, secondary"),
        opt("C", "major, minor", True),
        opt("D", "focal, auxiliary"),
    ],
    "elimination_hints": [
        hint("A", "Transverse and conjugate axes are terms used for a hyperbola, not an ellipse.", "Applying hyperbola terminology to ellipse"),
        hint("B", "Principal and secondary are not standard terms for ellipse axes in engineering graphics.", "Using non-standard axis terminology"),
        hint("D", "Focal axis is not a standard term; the axis containing the foci is called the major axis.", "Using incorrect terminology")
    ]
})
questions.append(q36)

# ═══════════════════════════════════════════════════════════════════════════════
# SCENARIO-BASED (2 questions: 37–38)
# ═══════════════════════════════════════════════════════════════════════════════

q37 = base("cuet-eg-scales-37", "scenario-based", "medium", "apply", "Plain Scale Construction", ["plain-scale", "rf-calculation", "construction"])
q37.update({
    "question_text": "Based on the scenario, what should be the total length of the plain scale on the drawing sheet?",
    "scenario": "An architect needs to draw a site plan where 1 cm on the drawing represents 5 metres on the ground. The maximum distance to be measured from the plan is 30 metres. A plain scale needs to be constructed to read metres and decimetres.",
    "correct_answer": "B",
    "explanation": "RF = 1 cm / 5 m = 1 cm / 500 cm = 1/500. Scale length = RF x Max distance = (1/500) x 30 m = (1/500) x 3000 cm = 6 cm.",
    "options": [
        opt("A", "5 cm"), opt("B", "6 cm", True), opt("C", "15 cm"), opt("D", "30 cm")
    ],
    "elimination_hints": [
        hint("A", "5 cm would only cover 25 m at this RF (5 x 500 cm = 2500 cm = 25 m), not the required 30 m.", "Incorrect multiplication"),
        hint("C", "15 cm would mean 15 x 500 = 7500 cm = 75 m, which is far more than the required 30 m. Check unit conversion.", "Forgetting to convert metres to centimetres in RF"),
        hint("D", "30 cm assumes RF = 1:1 (full size), but the RF here is 1:500.", "Ignoring the RF and using actual distance directly")
    ]
})
questions.append(q37)

q38 = base("cuet-eg-scales-38", "scenario-based", "hard", "analyze", "Engineering Curve Application", ["ellipse", "parabola", "curve-selection"])
q38.update({
    "question_text": "Based on the scenario, which curve should the engineer use, and what is its eccentricity?",
    "scenario": "A civil engineer is designing a reflector for a solar concentrator. The reflector must have the property that all incoming parallel rays (sunlight) converge to a single point (the receiver). The engineer knows that this geometric property is unique to a specific conic section and needs to select the correct curve for the cross-sectional profile of the reflector.",
    "correct_answer": "D",
    "explanation": "A parabola has the unique reflective property that all rays parallel to its axis are reflected through the focus. This makes it ideal for solar concentrators. The eccentricity of a parabola is exactly 1. An ellipse reflects rays from one focus to the other (not parallel rays), and a hyperbola diverges reflected rays.",
    "options": [
        opt("A", "Ellipse, e = 0.8"),
        opt("B", "Hyperbola, e = 1.5"),
        opt("C", "Parabola, e = 0.5"),
        opt("D", "Parabola, e = 1", True)
    ],
    "elimination_hints": [
        hint("A", "An ellipse reflects rays from one focus to the other focus, not parallel rays to a single point. It is used in whispering galleries, not solar concentrators.", "Confusing ellipse and parabola reflective properties"),
        hint("B", "A hyperbola diverges reflected rays. It cannot converge parallel rays to a single focus.", "Incorrectly applying hyperbola reflective properties"),
        hint("C", "While parabola is the correct curve, e = 0.5 is wrong. A parabola always has eccentricity exactly equal to 1.", "Correct curve but wrong eccentricity")
    ]
})
questions.append(q38)

# ═══════════════════════════════════════════════════════════════════════════════
# LOGICAL-SEQUENCE (2 questions: 39–40)
# ═══════════════════════════════════════════════════════════════════════════════

q39 = base("cuet-eg-scales-39", "logical-sequence", "medium", "understand", "Plain Scale Construction Steps", ["plain-scale", "construction-steps"])
q39.update({
    "question_text": "Arrange the following steps in the correct order for constructing a plain scale:",
    "items": [
        {"id": "1", "text": "Calculate the length of the scale using RF x maximum distance"},
        {"id": "2", "text": "Determine the RF of the scale"},
        {"id": "3", "text": "Mark the main divisions on the scale"},
        {"id": "4", "text": "Draw a rectangle of the calculated length"},
        {"id": "5", "text": "Subdivide the first main division into smaller parts"},
        {"id": "6", "text": "Mark zero at the end of the first main division"}
    ],
    "correct_order": ["2", "1", "4", "3", "6", "5"],
    "correct_answer": "C",
    "explanation": "The correct sequence is: (1) Determine RF, (2) Calculate scale length, (3) Draw rectangle, (4) Mark main divisions, (5) Mark zero at end of first division, (6) Subdivide first division. This follows the standard construction procedure.",
    "options": [
        opt("A", "1, 2, 4, 3, 5, 6"),
        opt("B", "2, 1, 3, 4, 6, 5"),
        opt("C", "2, 1, 4, 3, 6, 5", True),
        opt("D", "2, 4, 1, 3, 5, 6"),
    ],
    "elimination_hints": [
        hint("A", "Step 1 (calculate length) cannot come before step 2 (determine RF), because you need the RF to calculate the length.", "Reversing the dependency between RF and length calculation"),
        hint("B", "Step 3 (mark divisions) cannot come before step 4 (draw rectangle), because you need the rectangle drawn first to mark divisions on it.", "Drawing divisions before the scale body exists"),
        hint("D", "Step 4 (draw rectangle) cannot come before step 1 (calculate length), because you need the calculated length to know how long to draw the rectangle.", "Drawing before calculating dimensions")
    ]
})
questions.append(q39)

q40 = base("cuet-eg-scales-40", "logical-sequence", "hard", "analyze", "Ellipse by Focus-Directrix Method", ["ellipse", "focus-directrix", "construction-steps"])
q40.update({
    "question_text": "Arrange the following steps in the correct order for constructing an ellipse using the focus-directrix method:",
    "items": [
        {"id": "1", "text": "Draw the directrix (vertical line) and the axis (perpendicular to directrix)"},
        {"id": "2", "text": "Mark the focus F on the axis at the given distance from the directrix"},
        {"id": "3", "text": "Locate the vertex V on the axis such that VF/VD = eccentricity"},
        {"id": "4", "text": "Draw vertical lines (ordinates) at arbitrary points on the axis"},
        {"id": "5", "text": "With F as centre and radius = e x distance of ordinate from directrix, draw arcs to cut each ordinate"},
        {"id": "6", "text": "Join the points with a smooth curve to get the ellipse"}
    ],
    "correct_order": ["1", "2", "3", "4", "5", "6"],
    "correct_answer": "A",
    "explanation": "The focus-directrix method follows a systematic sequence: draw reference lines (directrix and axis), locate the focus, find the vertex using eccentricity, draw ordinates at arbitrary distances, use the eccentricity ratio to locate points on each ordinate using compass arcs from the focus, and finally join all points smoothly.",
    "options": [
        opt("A", "1, 2, 3, 4, 5, 6", True),
        opt("B", "1, 3, 2, 4, 5, 6"),
        opt("C", "2, 1, 3, 5, 4, 6"),
        opt("D", "1, 2, 4, 3, 5, 6"),
    ],
    "elimination_hints": [
        hint("B", "Step 3 (locate vertex) requires knowing the focus position first (step 2), because the vertex is located between the directrix and focus.", "Locating vertex before focus"),
        hint("C", "Step 2 (mark focus) requires the directrix and axis from step 1 to be drawn first. You cannot mark a focus without the reference lines.", "Marking focus before drawing reference lines"),
        hint("D", "Step 4 (draw ordinates) can be done at any time after step 1, but step 3 (locate vertex) must come before step 4 to establish the curve's bounds.", "Skipping vertex location before ordinates")
    ]
})
questions.append(q40)

# ═══════════════════════════════════════════════════════════════════════════════
# WRITE JSON
# ═══════════════════════════════════════════════════════════════════════════════

with open(OUT, 'w') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Written {len(questions)} questions to {OUT}")

# Quick validation
ids = [q["id"] for q in questions]
assert len(ids) == 40, f"Expected 40, got {len(ids)}"
assert len(set(ids)) == 40, "Duplicate IDs found!"

# Answer balance check
from collections import Counter
answers = Counter(q["correct_answer"] for q in questions)
print(f"Answer distribution: {dict(answers)}")
for letter, count in answers.items():
    assert count <= 12, f"Answer {letter} appears {count} times (max 12)"
print("All validations passed!")
