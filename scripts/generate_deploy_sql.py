#!/usr/bin/env python3
"""
Generate deployment SQL files for ALL CUET Physics questions.
Reads all JSON files (FINAL, copied, supplemental), deduplicates by ID,
and creates idempotent SQL statements for Supabase SQL Editor.

Priority: FINAL > supplemental (new/gap/part2) > copied > other
"""

import json
import os

OUTPUT_DIR = "supabase/deploy-cuet-physics"
QBANK_DIR = "Qbank/CUET/physics"

# ---- Complete topic name → topic_id mapping ----
TOPIC_MAP = {
    # Electrostatics
    ("cuet-phy-electrostatics", "Coulomb's Law and Electric Charges"):         "cuet-phy-es-coulomb",
    ("cuet-phy-electrostatics", "Electric Field and Field Lines"):             "cuet-phy-es-field",
    ("cuet-phy-electrostatics", "Electric Dipole"):                            "cuet-phy-es-dipole",
    ("cuet-phy-electrostatics", "Gauss's Law and Applications"):               "cuet-phy-es-gauss",
    ("cuet-phy-electrostatics", "Electric Potential"):                         "cuet-phy-es-potential",
    ("cuet-phy-electrostatics", "Electric Potential and Potential Energy"):     "cuet-phy-es-potential",
    ("cuet-phy-electrostatics", "Capacitance and Capacitors"):                 "cuet-phy-es-capacitor",
    ("cuet-phy-electrostatics", "Capacitors and Capacitance"):                 "cuet-phy-es-capacitor",
    ("cuet-phy-electrostatics", "Combination of Capacitors and Dielectrics"):  "cuet-phy-es-dielectric",

    # Current Electricity
    ("cuet-phy-current-electricity", "Ohm's Law and Resistance"):                  "cuet-phy-current-ohm",
    ("cuet-phy-current-electricity", "Kirchhoff's Laws and Circuit Analysis"):     "cuet-phy-current-kirchhoff",
    ("cuet-phy-current-electricity", "Kirchhoff's Laws and Networks"):             "cuet-phy-current-kirchhoff",
    ("cuet-phy-current-electricity", "Wheatstone Bridge and Meter Bridge"):        "cuet-phy-current-wheatstone",
    ("cuet-phy-current-electricity", "Potentiometer"):                             "cuet-phy-current-potentiometer",
    ("cuet-phy-current-electricity", "Electrical Energy and Power"):               "cuet-phy-current-power",
    ("cuet-phy-current-electricity", "Measuring Instruments"):                     "cuet-phy-current-instruments",
    ("cuet-phy-current-electricity", "Electrical Instruments"):                    "cuet-phy-current-instruments",

    # Magnetic Effects
    ("cuet-phy-magnetic-effects", "Biot-Savart Law and Applications"):      "cuet-phy-mag-biot",
    ("cuet-phy-magnetic-effects", "Ampere's Circuital Law"):                "cuet-phy-mag-ampere",
    ("cuet-phy-magnetic-effects", "Solenoid and Toroid"):                   "cuet-phy-mag-solenoid",
    ("cuet-phy-magnetic-effects", "Force on Current and Moving Charges"):   "cuet-phy-mag-force",
    ("cuet-phy-magnetic-effects", "Lorentz Force and Motion in Fields"):    "cuet-phy-mag-lorentz-force",
    ("cuet-phy-magnetic-effects", "Moving Coil Galvanometer"):              "cuet-phy-mag-devices",
    ("cuet-phy-magnetic-effects", "Galvanometer, Ammeter, and Voltmeter"):  "cuet-phy-mag-devices",
    ("cuet-phy-magnetic-effects", "Magnetic Dipole and Torque"):            "cuet-phy-mag-dipole",
    ("cuet-phy-magnetic-effects", "Magnetic Properties of Materials"):      "cuet-phy-mag-materials",

    # EM Induction & AC
    ("cuet-phy-em-induction", "Faraday's Laws of EMI"):                     "cuet-phy-emi-faraday",
    ("cuet-phy-em-induction", "Self and Mutual Inductance"):                "cuet-phy-emi-inductance",
    ("cuet-phy-em-induction", "AC Circuits"):                               "cuet-phy-em-ac-circuits",
    ("cuet-phy-em-induction", "AC Circuits (R, L, C, LCR Series)"):         "cuet-phy-em-ac-circuits",
    ("cuet-phy-em-induction", "AC Circuits \u2014 Advanced"):               "cuet-phy-ac-advanced",
    ("cuet-phy-em-induction", "AC Circuits — Advanced"):                    "cuet-phy-ac-advanced",
    ("cuet-phy-em-induction", "Resonance, Power Factor, and Transformers"): "cuet-phy-em-transformer",

    # EM Waves
    ("cuet-phy-em-waves", "Electromagnetic Spectrum and Wave Properties"):  "cuet-phy-emwave-spectrum",
    ("cuet-phy-em-waves", "EM Wave Properties and Applications"):           "cuet-phy-emwave-spectrum",

    # Communication
    ("cuet-phy-communication", "Elements of Communication System"):          "cuet-phy-comm-elements",
    ("cuet-phy-communication", "Bandwidth of Signals and Channels"):         "cuet-phy-comm-bandwidth",
    ("cuet-phy-communication", "Propagation of EM Waves"):                   "cuet-phy-comm-propagation",
    ("cuet-phy-communication", "Modulation and Amplitude Modulation"):       "cuet-phy-comm-modulation",
    ("cuet-phy-communication", "Detection and Demodulation"):                "cuet-phy-comm-detection",

    # Atoms & Nuclei
    ("cuet-phy-atoms-nuclei", "Bohr Model of Hydrogen Atom"):               "cuet-phy-atom-bohr",
    ("cuet-phy-atoms-nuclei", "Hydrogen Spectrum and Spectral Series"):      "cuet-phy-atom-spectra",
    ("cuet-phy-atoms-nuclei", "Radioactive Decay"):                          "cuet-phy-nuclei-decay",
    ("cuet-phy-atoms-nuclei", "Nuclear Properties and Binding Energy"):      "cuet-phy-nuclei-properties",

    # Dual Nature
    ("cuet-phy-dual-nature", "Photoelectric Effect"):                        "cuet-phy-dual-photoelectric",
    ("cuet-phy-dual-nature", "de Broglie Wavelength"):                       "cuet-phy-dual-debroglie",

    # Electronic Devices
    ("cuet-phy-electronic-devices", "p-n Junction Diode and Characteristics"):                    "cuet-phy-semi-pn",
    ("cuet-phy-electronic-devices", "Diode Applications (Rectifier, Zener, LED, Photodiode)"):    "cuet-phy-semi-diode",
    ("cuet-phy-electronic-devices", "Transistor, Logic Gates, and Amplifiers"):                   "cuet-phy-semi-transistor",

    # Optics
    ("cuet-phy-optics", "Reflection and Mirrors"):      "cuet-phy-opt-reflection",
    ("cuet-phy-optics", "Prism and Dispersion"):        "cuet-phy-opt-prism",
    ("cuet-phy-optics", "Optical Instruments"):         "cuet-phy-opt-instruments",
    ("cuet-phy-optics", "Interference of Light"):       "cuet-phy-opt-interference",
    ("cuet-phy-optics", "Diffraction of Light"):        "cuet-phy-opt-diffraction",
    ("cuet-phy-optics", "Polarisation of Light"):       "cuet-phy-opt-polarisation",
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
    if s is None:
        return "NULL"
    return s.replace("'", "''")


def get_file_priority(filename):
    """FINAL=1 (highest), supplemental=2, copied=3, other=4."""
    if "-FINAL" in filename:
        return 1
    elif "-copied" in filename:
        return 3
    elif "-new" in filename or "-gap" in filename or "-part2" in filename:
        return 2
    else:
        return 4


def load_all_questions_deduplicated():
    """Load all JSON files, deduplicate by question ID (highest priority wins)."""
    file_entries = []
    for root, dirs, files in os.walk(QBANK_DIR):
        for f in sorted(files):
            if not f.endswith(".json"):
                continue
            filepath = os.path.join(root, f)
            priority = get_file_priority(f)
            file_entries.append((priority, filepath, f))

    # Sort by priority (1=highest)
    file_entries.sort()

    seen_ids = set()
    selected_questions = []
    skipped = 0

    for priority, filepath, fname in file_entries:
        try:
            qs = json.load(open(filepath))
            if not isinstance(qs, list):
                continue
        except Exception:
            continue

        for q in qs:
            qid = q.get("id", "")
            if qid in seen_ids:
                skipped += 1
                continue
            seen_ids.add(qid)
            # Skip diagram-based questions (no images yet)
            if q.get("question_type") == "diagram-based":
                skipped += 1
                continue
            q["_source_file"] = fname
            q["_topic_id_resolved"] = resolve_topic_id(q)
            selected_questions.append(q)

    print(f"Loaded {len(selected_questions)} unique questions (skipped {skipped} duplicates)")
    return selected_questions


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

    all_questions = load_all_questions_deduplicated()

    # ---- File 1: Topics (all, idempotent) ----
    all_topics = {}
    for q in all_questions:
        tid = q["_topic_id_resolved"]
        ch = q["chapter_id"]
        tname = q.get("topic", "")
        if tid not in all_topics:
            all_topics[tid] = (ch, tname)

    with open(os.path.join(OUTPUT_DIR, "01_create_all_topics.sql"), "w") as f:
        f.write("-- ==========================================================================\n")
        f.write("-- DEPLOY STEP 1: Create ALL CUET Physics topics (idempotent)\n")
        f.write("-- Safe to re-run — uses ON CONFLICT DO NOTHING\n")
        f.write(f"-- Total: {len(all_topics)} topics\n")
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
    current_batch = []

    def flush_batch(batch, bnum):
        if not batch:
            return
        filename = f"03_insert_questions_batch{bnum:02d}.sql"
        with open(os.path.join(OUTPUT_DIR, filename), "w") as f:
            f.write(f"-- ==========================================================================\n")
            f.write(f"-- DEPLOY: Insert questions batch {bnum} ({len(batch)} questions)\n")
            f.write(f"-- ==========================================================================\n\n")
            f.write("BEGIN;\n\n")
            for i in range(0, len(batch), 20):
                sub = batch[i : i + 20]
                json_str = json.dumps(sub, ensure_ascii=False)
                json_str_escaped = json_str.replace("'", "''")
                f.write(f"SELECT insert_batch_questions('{json_str_escaped}'::jsonb, 'deploy-2026-03-05-b{bnum:02d}');\n\n")
            f.write("COMMIT;\n")
        print(f"[3-{bnum:02d}] {filename}: {len(batch)} questions")

    for q in all_questions:
        converted = convert_to_insert_format(q)
        current_batch.append(converted)
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

    # ---- Summary ----
    by_chapter = {}
    for q in all_questions:
        ch = q["chapter_id"]
        by_chapter[ch] = by_chapter.get(ch, 0) + 1

    print(f"\n{'='*60}")
    print(f"DEPLOYMENT SUMMARY")
    print(f"{'='*60}")
    for ch, count in sorted(by_chapter.items()):
        print(f"  {ch:35s}: {count:4d} questions")
    print(f"  {'TOTAL':35s}: {len(all_questions):4d} questions")
    print(f"  Batch files: {batch_num}")
    print(f"  Output: {OUTPUT_DIR}/")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
