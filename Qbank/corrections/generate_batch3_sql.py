#!/usr/bin/env python3
"""
Generate SQL migration for Batch 3 correction questions.
Reads REPLACEMENT_QUESTIONS from apply_corrections_batch3.py and outputs INSERT SQL.

Usage:
  python3 Qbank/corrections/generate_batch3_sql.py > supabase/migrations/20260301_batch3_correction_questions.sql
"""
import json, sys, os

# ---------------------------------------------------------------------------
# Topic ID mapping  (file basename → DB topic_id)
# ---------------------------------------------------------------------------
FILE_TOPIC_MAP = {
    # EM Induction (remaining 2)
    "phy-emi-faraday-copied.json":       "cuet-phy-emi-faraday",
    "phy-emi-inductance-copied.json":    "cuet-phy-emi-inductance",
    # EM Waves (1)
    "phy-emwave-copied.json":            "cuet-phy-emwave-spectrum",
    # Magnetic Effects (5)
    "phy-magmov-biot-copied.json":       "cuet-phy-mag-biot-savart",
    "phy-magmov-force-copied.json":      "cuet-phy-mag-lorentz-force",
    "phy-magmov-devices-copied.json":    "cuet-phy-mag-devices",
    "phy-magmat-dipole-copied.json":     "cuet-phy-mag-dipole",
    "phy-magmat-materials-copied.json":  "cuet-phy-mag-materials",
    # Optics (6)
    "phy-ray-reflection-copied.json":       "cuet-phy-opt-reflection",
    "phy-ray-prism-copied.json":            "cuet-phy-opt-prism",
    "phy-ray-instruments-copied.json":      "cuet-phy-opt-instruments",
    "phy-waveopt-interference-copied.json": "cuet-phy-opt-interference",
    "phy-waveopt-diffraction-copied.json":  "cuet-phy-opt-diffraction",
    "phy-waveopt-polarisation-copied.json": "cuet-phy-opt-polarisation",
}

QUESTION_TOPIC_OVERRIDE = {}

# ---------------------------------------------------------------------------
# Load the REPLACEMENT_QUESTIONS dict by exec-ing apply_corrections_batch3.py
# ---------------------------------------------------------------------------
script_dir = os.path.dirname(os.path.abspath(__file__))
apply_path = os.path.join(script_dir, "apply_corrections_batch3.py")

ns = {"__file__": apply_path, "__name__": "__not_main__"}
with open(apply_path) as f:
    source = f.read()
exec(compile(source, apply_path, "exec"), ns)

REPLACEMENT_QUESTIONS = ns["REPLACEMENT_QUESTIONS"]

# ---------------------------------------------------------------------------
# SQL generation helpers
# ---------------------------------------------------------------------------
def dollar_quote(text, tag="t"):
    """Wrap text in $tag$...$tag$ dollar quoting for Postgres."""
    while f"${tag}$" in str(text):
        tag += "x"
    return f"${tag}${text}${tag}$"


def build_payload(q):
    """Build the JSONB payload matching existing DB convention."""
    payload = {
        "question_id": q["id"],
        "subtopic": q.get("subtopic", ""),
        "topic_name": q.get("topic", ""),
        "bloom_level": q.get("bloom_level", "understand"),
        "options": q.get("options", []),
        "elimination_hints": q.get("elimination_hints", []),
    }
    # diagram-based fields
    if q.get("image_uri"):
        payload["image_uri"] = q["image_uri"]
    if q.get("image_alt"):
        payload["image_alt"] = q["image_alt"]
    # scenario-based: separate scenario from question_text
    if q.get("scenario"):
        payload["scenario"] = q["scenario"]
    # logical-sequence: items array + correct_order
    if q.get("items"):
        payload["items"] = q["items"]
    if q.get("correct_order"):
        payload["correct_order"] = q["correct_order"]
    return payload


def generate_insert(q, file_key):
    """Generate a single INSERT statement."""
    qid = q["id"]
    chapter_id = q["chapter_id"]
    topic_id = QUESTION_TOPIC_OVERRIDE.get(qid, FILE_TOPIC_MAP.get(file_key, ""))

    exam_ids = q.get("exam_suitability", ["CUET"])
    exam_arr = "ARRAY[" + ",".join(f"'{e}'" for e in exam_ids) + "]"

    concept_tags = q.get("concept_tags", [])
    tags_arr = "ARRAY[" + ",".join(f"'{t}'" for t in concept_tags) + "]"

    payload = build_payload(q)
    payload_json = json.dumps(payload, ensure_ascii=False)

    qt = dollar_quote(q["question_text"])
    expl = dollar_quote(q.get("explanation", ""))
    payload_dq = dollar_quote(payload_json, "json")

    image_alt_sql = "NULL"
    if q.get("image_alt"):
        image_alt_sql = dollar_quote(q["image_alt"])

    return f"""INSERT INTO med_questions (
  subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
  strength_required, question_text, explanation, payload,
  image_url, image_alt, correct_answer, concept_tags,
  status, is_active, source
) VALUES (
  'cuet-physics',
  '{chapter_id}',
  '{topic_id}',
  {exam_arr},
  '{q["question_type"]}',
  '{q["difficulty"]}',
  'just-started',
  {qt},
  {expl},
  {payload_dq}::jsonb,
  NULL,
  {image_alt_sql},
  '{q["correct_answer"]}',
  {tags_arr},
  'active',
  true,
  'correction-batch-3'
);"""


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    lines = []
    lines.append("-- ==========================================================================")
    lines.append("-- BATCH 3: Correction questions for CUET Physics (final batch)")
    lines.append("-- 42 questions: 28 diagram-based + 14 logical-sequence")
    lines.append("-- Chapters: EM Induction (6), EM Waves (3),")
    lines.append("--           Magnetic Effects (15), Optics (18)")
    lines.append("-- ==========================================================================")
    lines.append("")
    lines.append("BEGIN;")
    lines.append("")

    # Step 1: Create missing CUET topics
    lines.append("-- ==========================================================================")
    lines.append("-- STEP 1: Create missing CUET topics in med_topics")
    lines.append("-- ==========================================================================")
    lines.append("")

    # EM Induction (already has chapter from batch 2, add remaining topics)
    lines.append("""INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important) VALUES
('cuet-phy-emi-faraday',    'cuet-phy-em-induction', 'Faraday''s Law and Lenz''s Law',   3, true),
('cuet-phy-emi-inductance', 'cuet-phy-em-induction', 'Self and Mutual Inductance',        4, true)
ON CONFLICT (id) DO NOTHING;""")
    lines.append("")

    # EM Waves (new chapter)
    lines.append("""INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important) VALUES
('cuet-phy-emwave-spectrum', 'cuet-phy-em-waves', 'Electromagnetic Spectrum and Wave Properties', 1, true)
ON CONFLICT (id) DO NOTHING;""")
    lines.append("")

    # Magnetic Effects (new chapter)
    lines.append("""INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important) VALUES
('cuet-phy-mag-biot-savart',   'cuet-phy-magnetic-effects', 'Biot-Savart Law and Ampere''s Law',           1, true),
('cuet-phy-mag-lorentz-force', 'cuet-phy-magnetic-effects', 'Lorentz Force and Motion in Magnetic Field',  2, true),
('cuet-phy-mag-devices',       'cuet-phy-magnetic-effects', 'Galvanometer, Ammeter, Voltmeter, Cyclotron', 3, true),
('cuet-phy-mag-dipole',        'cuet-phy-magnetic-effects', 'Magnetic Dipole and Torque',                  4, true),
('cuet-phy-mag-materials',     'cuet-phy-magnetic-effects', 'Dia-, Para-, and Ferromagnetic Materials',    5, true)
ON CONFLICT (id) DO NOTHING;""")
    lines.append("")

    # Optics (new chapter)
    lines.append("""INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important) VALUES
('cuet-phy-opt-reflection',   'cuet-phy-optics', 'Reflection at Curved Surfaces and Mirror Formula', 1, true),
('cuet-phy-opt-prism',        'cuet-phy-optics', 'Refraction through Prism and Dispersion',          2, true),
('cuet-phy-opt-instruments',  'cuet-phy-optics', 'Optical Instruments (Microscope and Telescope)',    3, true),
('cuet-phy-opt-interference', 'cuet-phy-optics', 'Interference and Young''s Double Slit',             4, true),
('cuet-phy-opt-diffraction',  'cuet-phy-optics', 'Diffraction and Single Slit',                       5, true),
('cuet-phy-opt-polarisation', 'cuet-phy-optics', 'Polarisation and Brewster''s Law',                  6, true)
ON CONFLICT (id) DO NOTHING;""")
    lines.append("")

    lines.append("-- ==========================================================================")
    lines.append("-- STEP 2: Insert correction questions")
    lines.append("-- ==========================================================================")
    lines.append("")

    count = 0
    for file_key, questions in REPLACEMENT_QUESTIONS.items():
        lines.append(f"-- ── {file_key} ({'─' * (60 - len(file_key))})")
        lines.append("")
        for q in questions:
            lines.append(f"-- {q['id']}  ({q['question_type']}, {q['difficulty']})")
            lines.append(generate_insert(q, file_key))
            lines.append("")
            count += 1

    lines.append(f"-- Total: {count} questions inserted")
    lines.append("COMMIT;")
    lines.append("")

    print("\n".join(lines))


if __name__ == "__main__":
    main()
