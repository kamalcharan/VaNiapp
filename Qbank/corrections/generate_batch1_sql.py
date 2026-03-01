#!/usr/bin/env python3
"""
Generate SQL migration for Batch 1 correction questions.
Reads REPLACEMENT_QUESTIONS from apply_corrections.py and outputs INSERT SQL.

Usage:
  python3 generate_batch1_sql.py > ../corrections/batch1_migration.sql
  # Then execute the .sql on your Supabase DB
"""
import json, sys, os

# ---------------------------------------------------------------------------
# Topic ID mapping  (file basename → DB topic_id)
# ---------------------------------------------------------------------------
FILE_TOPIC_MAP = {
    "phy-atom-bohr-copied.json":        "cuet-phy-atom-bohr",
    "phy-atom-spectra-copied.json":     "cuet-phy-atom-bohr",
    "phy-nuclei-decay-copied.json":     "cuet-phy-atom-radioactivity",
    "phy-nuclei-properties-copied.json":"cuet-phy-atom-nucleus",
    "phy-current-ohm-copied.json":      "cuet-phy-curr-ohm",
    "phy-current-kirchhoff-copied.json":"cuet-phy-curr-kirchhoff",
    "phy-current-instruments-copied.json": "cuet-phy-curr-wheatstone",  # default
}

# Override per-question for instruments file (mixed topics)
QUESTION_TOPIC_OVERRIDE = {
    "cuet-phy-current-instr-d02": "cuet-phy-curr-potentiometer",
}

CHAPTER_MAP = {
    "cuet-phy-atoms-nuclei":        "cuet-phy-atoms-nuclei",
    "cuet-phy-current-electricity": "cuet-phy-current-electricity",
}

# ---------------------------------------------------------------------------
# Load the REPLACEMENT_QUESTIONS dict by exec-ing apply_corrections.py
# ---------------------------------------------------------------------------
script_dir = os.path.dirname(os.path.abspath(__file__))
apply_path = os.path.join(script_dir, "apply_corrections.py")

# We only need the REPLACEMENT_QUESTIONS dict, so exec in a namespace
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
    # Ensure the tag doesn't appear in the text
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
    if q.get("image_uri"):
        payload["image_uri"] = q["image_uri"]
    if q.get("image_alt"):
        payload["image_alt"] = q["image_alt"]
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

    # Use dollar quoting for text fields that may contain special chars
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
  'correction-batch-1'
);"""


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    lines = []
    lines.append("-- ==========================================================================")
    lines.append("-- BATCH 1: Correction questions for CUET Physics")
    lines.append("-- 21 questions: 14 diagram-based + 7 logical-sequence")
    lines.append("-- Chapters: Atoms & Nuclei (12 Qs), Current Electricity (9 Qs)")
    lines.append("-- ==========================================================================")
    lines.append("")
    lines.append("BEGIN;")
    lines.append("")

    # Step 1: Create missing CUET topics (FK requires them)
    lines.append("-- ==========================================================================")
    lines.append("-- STEP 1: Create missing CUET topics in med_topics")
    lines.append("-- ==========================================================================")
    lines.append("")
    lines.append("""INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important) VALUES
('cuet-phy-atom-bohr',          'cuet-phy-atoms-nuclei', 'Bohr Model and Hydrogen Spectrum',              1, true),
('cuet-phy-atom-rutherford',    'cuet-phy-atoms-nuclei', 'Rutherford Model and Alpha Scattering',         2, true),
('cuet-phy-atom-radioactivity', 'cuet-phy-atoms-nuclei', 'Radioactivity and Decay Laws',                  3, true),
('cuet-phy-atom-nucleus',       'cuet-phy-atoms-nuclei', 'Nuclear Structure, Size, and Binding Energy',   4, true),
('cuet-phy-atom-fission-fusion','cuet-phy-atoms-nuclei', 'Nuclear Fission and Fusion',                    5, true)
ON CONFLICT (id) DO NOTHING;""")
    lines.append("")
    lines.append("""INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important) VALUES
('cuet-phy-curr-ohm',           'cuet-phy-current-electricity', 'Ohm''s Law and Resistance',              1, true),
('cuet-phy-curr-drift',         'cuet-phy-current-electricity', 'Drift Velocity and Mobility',            2, true),
('cuet-phy-curr-kirchhoff',     'cuet-phy-current-electricity', 'Kirchhoff''s Laws',                      3, true),
('cuet-phy-curr-wheatstone',    'cuet-phy-current-electricity', 'Wheatstone Bridge and Meter Bridge',     4, true),
('cuet-phy-curr-potentiometer', 'cuet-phy-current-electricity', 'Potentiometer',                          5, true)
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
