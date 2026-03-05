#!/usr/bin/env python3
"""
Generate deployment SQL files for all CUET Physics questions.
Reads all *-FINAL.json files and creates idempotent SQL statements.
"""

import json
import os
import re

OUTPUT_DIR = "supabase/deploy-cuet-physics"
QBANK_DIR = "Qbank/CUET/physics"

# ---- Topic name → topic_id mapping (must match DB) ----
TOPIC_MAP = {
    # Electrostatics
    ("cuet-phy-electrostatics", "Coulomb's Law and Electric Charges"):    "cuet-phy-es-coulomb",
    ("cuet-phy-electrostatics", "Electric Field and Field Lines"):        "cuet-phy-es-field",
    ("cuet-phy-electrostatics", "Electric Dipole"):                       "cuet-phy-es-dipole",
    ("cuet-phy-electrostatics", "Gauss's Law and Applications"):          "cuet-phy-es-gauss",
    ("cuet-phy-electrostatics", "Electric Potential"):                    "cuet-phy-es-potential",
    ("cuet-phy-electrostatics", "Capacitance and Capacitors"):            "cuet-phy-es-capacitor",

    # Current Electricity
    ("cuet-phy-current-electricity", "Ohm's Law and Resistance"):                  "cuet-phy-current-ohm",
    ("cuet-phy-current-electricity", "Kirchhoff's Laws and Circuit Analysis"):     "cuet-phy-current-kirchhoff",
    ("cuet-phy-current-electricity", "Wheatstone Bridge and Meter Bridge"):        "cuet-phy-current-wheatstone",
    ("cuet-phy-current-electricity", "Potentiometer"):                             "cuet-phy-current-potentiometer",
    ("cuet-phy-current-electricity", "Electrical Energy and Power"):               "cuet-phy-current-power",
    ("cuet-phy-current-electricity", "Measuring Instruments"):                     "cuet-phy-current-instruments",

    # Magnetic Effects
    ("cuet-phy-magnetic-effects", "Biot-Savart Law and Applications"):      "cuet-phy-mag-biot",
    ("cuet-phy-magnetic-effects", "Ampere's Circuital Law"):                "cuet-phy-mag-ampere",
    ("cuet-phy-magnetic-effects", "Solenoid and Toroid"):                   "cuet-phy-mag-solenoid",
    ("cuet-phy-magnetic-effects", "Force on Current and Moving Charges"):   "cuet-phy-mag-force",
    ("cuet-phy-magnetic-effects", "Moving Coil Galvanometer"):              "cuet-phy-mag-devices",

    # EM Induction & AC
    ("cuet-phy-em-induction", "Faraday's Laws of EMI"):         "cuet-phy-emi-faraday",
    ("cuet-phy-em-induction", "Self and Mutual Inductance"):    "cuet-phy-emi-inductance",
    ("cuet-phy-em-induction", "AC Circuits"):                   "cuet-phy-ac-circuits",
    ("cuet-phy-em-induction", "AC Circuits — Advanced"):        "cuet-phy-ac-advanced",
    ("cuet-phy-em-induction", "AC Circuits \u2014 Advanced"):   "cuet-phy-ac-advanced",

    # EM Waves
    ("cuet-phy-em-waves", "Electromagnetic Spectrum and Wave Properties"):  "cuet-phy-emwave-spectrum",
    ("cuet-phy-em-waves", "EM Wave Properties and Applications"):           "cuet-phy-emwave-properties",

    # Communication
    ("cuet-phy-communication", "Elements of Communication System"):          "cuet-phy-comm-elements",
    ("cuet-phy-communication", "Bandwidth of Signals and Channels"):         "cuet-phy-comm-bandwidth",
    ("cuet-phy-communication", "Propagation of EM Waves"):                   "cuet-phy-comm-propagation",
    ("cuet-phy-communication", "Modulation and Amplitude Modulation"):       "cuet-phy-comm-modulation",
    ("cuet-phy-communication", "Detection and Demodulation"):                "cuet-phy-comm-detection",
}


def resolve_topic_id(q):
    """Get topic_id from question, using mapping if needed."""
    if q.get("topic_id"):
        return q["topic_id"]
    key = (q.get("chapter_id", ""), q.get("topic", ""))
    tid = TOPIC_MAP.get(key)
    if not tid:
        raise ValueError(f"No topic_id mapping for: {key}")
    return tid


def escape_sql(s):
    """Escape single quotes for SQL."""
    if s is None:
        return "NULL"
    return s.replace("'", "''")


def load_all_questions():
    """Load all FINAL JSON files, sorted by ID."""
    all_qs = []
    for root, dirs, files in os.walk(QBANK_DIR):
        for f in sorted(files):
            if f.endswith("-FINAL.json"):
                filepath = os.path.join(root, f)
                qs = json.load(open(filepath))
                for q in qs:
                    q["_source_file"] = f
                    q["_topic_id_resolved"] = resolve_topic_id(q)
                all_qs.append((f, qs))
    return all_qs


def convert_to_insert_format(q):
    """Convert a question JSON to the format expected by insert_batch_questions."""
    topic_id = q["_topic_id_resolved"]
    exam_ids = q.get("exam_suitability", q.get("exam_ids", ["CUET"]))

    payload = {
        "question_id": q.get("id", ""),
        "subtopic": q.get("subtopic", ""),
        "topic_name": q.get("topic", ""),
        "bloom_level": q.get("bloom_level", "remember"),
        "options": q.get("options", []),
        "elimination_hints": q.get("elimination_hints", []),
    }

    return {
        "chapter_id": q["chapter_id"],
        "topic_id": topic_id,
        "exam_ids": exam_ids,
        "question_type": q["question_type"],
        "difficulty": q["difficulty"],
        "question_text": q["question_text"],
        "explanation": q["explanation"],
        "correct_answer": q.get("correct_answer", ""),
        "concept_tags": q.get("concept_tags", []),
        "payload": payload,
    }


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    all_file_qs = load_all_questions()

    # ---- File 1: Topics (all, idempotent) ----
    all_topics = {}
    for fname, qs in all_file_qs:
        for q in qs:
            tid = q["_topic_id_resolved"]
            ch = q["chapter_id"]
            tname = q.get("topic", "")
            if tid not in all_topics:
                all_topics[tid] = (ch, tname)

    with open(os.path.join(OUTPUT_DIR, "01_create_all_topics.sql"), "w") as f:
        f.write("-- ==========================================================================\n")
        f.write("-- DEPLOY STEP 1: Create ALL CUET Physics topics (idempotent)\n")
        f.write("-- Safe to re-run — uses ON CONFLICT DO NOTHING\n")
        f.write("-- ==========================================================================\n\n")
        f.write("INSERT INTO med_topics (id, chapter_id, name, is_active) VALUES\n")
        lines = []
        for tid, (ch, tname) in sorted(all_topics.items()):
            lines.append(f"  ('{escape_sql(tid)}', '{escape_sql(ch)}', '{escape_sql(tname)}', true)")
        f.write(",\n".join(lines))
        f.write("\nON CONFLICT (id) DO NOTHING;\n")

    print(f"[1] Topics: {len(all_topics)} topics")

    # ---- File 2: Create/replace insert function ----
    with open(os.path.join(OUTPUT_DIR, "02_create_insert_function.sql"), "w") as f:
        f.write(open("supabase/migrations/20260302_step2_create_insert_function.sql").read())
    print("[2] Insert function copied")

    # ---- Files 3-N: Insert questions in batches of ~100 ----
    batch_num = 0
    total_qs = 0
    current_batch = []

    def flush_batch(batch, batch_num):
        if not batch:
            return
        filename = f"03_insert_questions_batch{batch_num:02d}.sql"
        with open(os.path.join(OUTPUT_DIR, filename), "w") as f:
            f.write(f"-- ==========================================================================\n")
            f.write(f"-- DEPLOY: Insert questions batch {batch_num} ({len(batch)} questions)\n")
            f.write(f"-- Safe: uses question_id in payload to identify; function skips on error\n")
            f.write(f"-- ==========================================================================\n\n")
            f.write("BEGIN;\n\n")

            # Split into sub-batches of 20 for SQL Editor limits
            for i in range(0, len(batch), 20):
                sub = batch[i : i + 20]
                json_str = json.dumps(sub, ensure_ascii=False)
                json_str_escaped = json_str.replace("'", "''")
                f.write(f"SELECT insert_batch_questions('{json_str_escaped}'::jsonb, 'deploy-2026-03-05-b{batch_num:02d}');\n\n")

            f.write("COMMIT;\n")
        print(f"[3-{batch_num:02d}] {filename}: {len(batch)} questions")

    for fname, qs in all_file_qs:
        for q in qs:
            converted = convert_to_insert_format(q)
            current_batch.append(converted)
            total_qs += 1

            if len(current_batch) >= 100:
                batch_num += 1
                flush_batch(current_batch, batch_num)
                current_batch = []

    if current_batch:
        batch_num += 1
        flush_batch(current_batch, batch_num)

    # ---- File 4: Cleanup function ----
    with open(os.path.join(OUTPUT_DIR, "04_cleanup_function.sql"), "w") as f:
        f.write("-- ==========================================================================\n")
        f.write("-- DEPLOY STEP 4: Drop helper function after all inserts are done\n")
        f.write("-- ==========================================================================\n\n")
        f.write("DROP FUNCTION IF EXISTS insert_batch_questions(jsonb, text);\n")
    print("[4] Cleanup function")

    # ---- File 5: Verification query ----
    with open(os.path.join(OUTPUT_DIR, "05_verify_deployment.sql"), "w") as f:
        f.write("-- ==========================================================================\n")
        f.write("-- DEPLOY STEP 5: Verify deployment — run this to check counts\n")
        f.write("-- ==========================================================================\n\n")
        f.write("-- Total questions per chapter\n")
        f.write("SELECT c.name AS chapter, COUNT(q.id) AS question_count\n")
        f.write("FROM med_chapters c\n")
        f.write("LEFT JOIN med_questions q ON q.chapter_id = c.id\n")
        f.write("WHERE c.subject_id = 'cuet-physics'\n")
        f.write("GROUP BY c.name, c.sort_order\n")
        f.write("ORDER BY c.sort_order;\n\n")
        f.write("-- Total questions per topic\n")
        f.write("SELECT t.name AS topic, c.name AS chapter, COUNT(q.id) AS question_count\n")
        f.write("FROM med_topics t\n")
        f.write("JOIN med_chapters c ON c.id = t.chapter_id\n")
        f.write("LEFT JOIN med_questions q ON q.topic_id = t.id\n")
        f.write("WHERE c.subject_id = 'cuet-physics'\n")
        f.write("GROUP BY t.name, c.name, t.sort_order\n")
        f.write("ORDER BY c.name, t.sort_order;\n\n")
        f.write("-- Grand total\n")
        f.write("SELECT COUNT(*) AS total_cuet_physics_questions\n")
        f.write("FROM med_questions\n")
        f.write("WHERE subject_id = 'cuet-physics';\n")
    print("[5] Verification query")

    print(f"\n{'='*50}")
    print(f"TOTAL: {total_qs} questions across {batch_num} batch files")
    print(f"OUTPUT: {OUTPUT_DIR}/")
    print(f"{'='*50}")


if __name__ == "__main__":
    main()
