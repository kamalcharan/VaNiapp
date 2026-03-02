#!/usr/bin/env python3
"""
Generate SQL migration for Batch 2 correction questions.
Reads REPLACEMENT_QUESTIONS from apply_corrections_batch2.py and outputs INSERT SQL.

Usage:
  python3 Qbank/corrections/generate_batch2_sql.py > supabase/migrations/20260301_batch2_correction_questions.sql
"""
import json, sys, os

# ---------------------------------------------------------------------------
# Topic ID mapping  (file basename → DB topic_id)
# ---------------------------------------------------------------------------
FILE_TOPIC_MAP = {
    "phy-dual-debroglie-copied.json":    "cuet-phy-dual-debroglie",
    "phy-dual-photoelectric-copied.json":"cuet-phy-dual-photoelectric",
    "phy-semi-diode-copied.json":        "cuet-phy-semi-diode",
    "phy-semi-pn-copied.json":           "cuet-phy-semi-pn",
    "phy-semi-transistor-copied.json":   "cuet-phy-semi-transistor",
    "phy-pot-capacitor-copied.json":     "cuet-phy-es-capacitor",
    "phy-pot-dielectric-copied.json":    "cuet-phy-es-dielectric",
    "phy-pot-potential-copied.json":     "cuet-phy-es-potential",
    "phy-ac-circuits-copied.json":       "cuet-phy-em-ac-circuits",
    "phy-ac-transformer-copied.json":    "cuet-phy-em-transformer",
}

# Override per-question if needed (e.g. mixed-topic files)
QUESTION_TOPIC_OVERRIDE = {
    # transistor file covers both transistors and logic gates
    "cuet-phy-semi-transistor-d02":  "cuet-phy-semi-logic-gates",
    "cuet-phy-semi-transistor-ls01": "cuet-phy-semi-transistor",
}

# ---------------------------------------------------------------------------
# Load the REPLACEMENT_QUESTIONS dict by exec-ing apply_corrections_batch2.py
# ---------------------------------------------------------------------------
script_dir = os.path.dirname(os.path.abspath(__file__))
apply_path = os.path.join(script_dir, "apply_corrections_batch2.py")

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
  'correction-batch-2'
);"""


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    lines = []
    lines.append("-- ==========================================================================")
    lines.append("-- BATCH 2: Correction questions for CUET Physics")
    lines.append("-- 30 questions: 20 diagram-based + 10 logical-sequence")
    lines.append("-- Chapters: Dual Nature (6), Electronic Devices (9),")
    lines.append("--           Electrostatics (9), EM Induction & AC (6)")
    lines.append("-- ==========================================================================")
    lines.append("")
    lines.append("BEGIN;")
    lines.append("")

    # Step 1: Create missing CUET topics (FK requires them)
    lines.append("-- ==========================================================================")
    lines.append("-- STEP 1: Create missing CUET topics in med_topics")
    lines.append("-- ==========================================================================")
    lines.append("")

    # Dual Nature topics
    lines.append("""INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important) VALUES
('cuet-phy-dual-debroglie',    'cuet-phy-dual-nature', 'de Broglie Wavelength and Davisson-Germer Experiment', 1, true),
('cuet-phy-dual-photoelectric','cuet-phy-dual-nature', 'Photoelectric Effect and Einstein''s Equation',         2, true)
ON CONFLICT (id) DO NOTHING;""")
    lines.append("")

    # Electronic Devices topics
    lines.append("""INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important) VALUES
('cuet-phy-semi-diode',       'cuet-phy-electronic-devices', 'Diode Applications (Rectifier, Zener, LED, Photodiode)', 1, true),
('cuet-phy-semi-pn',          'cuet-phy-electronic-devices', 'p-n Junction Diode and Characteristics',                  2, true),
('cuet-phy-semi-transistor',  'cuet-phy-electronic-devices', 'Transistor, Logic Gates, and Amplifiers',                  3, true),
('cuet-phy-semi-logic-gates', 'cuet-phy-electronic-devices', 'Logic Gates and Boolean Algebra',                          4, true)
ON CONFLICT (id) DO NOTHING;""")
    lines.append("")

    # Electrostatics topics
    lines.append("""INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important) VALUES
('cuet-phy-es-capacitor',  'cuet-phy-electrostatics', 'Capacitors and Capacitance',                1, true),
('cuet-phy-es-dielectric', 'cuet-phy-electrostatics', 'Combination of Capacitors and Dielectrics', 2, true),
('cuet-phy-es-potential',  'cuet-phy-electrostatics', 'Electric Potential and Potential Energy',    3, true)
ON CONFLICT (id) DO NOTHING;""")
    lines.append("")

    # EM Induction topics
    lines.append("""INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important) VALUES
('cuet-phy-em-ac-circuits',  'cuet-phy-em-induction', 'AC Circuits (R, L, C, LCR Series)',            1, true),
('cuet-phy-em-transformer',  'cuet-phy-em-induction', 'Resonance, Power Factor, and Transformers',    2, true)
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
