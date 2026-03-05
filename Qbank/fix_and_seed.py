#!/usr/bin/env python3
"""
Fix all CUET JSON files (add missing chapter_id) and generate a SQL migration
that seeds ALL questions into the database.

Usage: python3 Qbank/fix_and_seed.py
"""

import json
import os
import re
import glob
from pathlib import Path

BASE = Path(__file__).resolve().parent / "CUET"
MIGRATION_DIR = Path(__file__).resolve().parent.parent / "supabase" / "migrations"

# ── folder → chapter_id mapping ─────────────────────────────────────────────
FOLDER_TO_CHAPTER = {
    "atoms-nuclei":       "cuet-phy-atoms-nuclei",
    "current-electricity": "cuet-phy-current-electricity",
    "dual-nature":        "cuet-phy-dual-nature",
    "electronic-devices": "cuet-phy-electronic-devices",
    "em-induction":       "cuet-phy-em-induction",
    "em-waves":           "cuet-phy-em-waves",
    "magnetic-effects":   "cuet-phy-magnetic-effects",
    "optics":             "cuet-phy-optics",
    "electrostatics":     "cuet-phy-electrostatics",
}

# ── filename stem → topic_id mapping ────────────────────────────────────────
# Maps the filename prefix (from copied files) to a topic_id
FILE_TO_TOPIC = {
    # atoms-nuclei
    "phy-atom-bohr":           "cuet-phy-atom-bohr",
    "phy-atom-spectra":        "cuet-phy-atom-spectra",
    "phy-nuclei-decay":        "cuet-phy-nuclei-decay",
    "phy-nuclei-properties":   "cuet-phy-nuclei-properties",
    # current-electricity
    "phy-current-instruments": "cuet-phy-current-instruments",
    "phy-current-kirchhoff":   "cuet-phy-current-kirchhoff",
    "phy-current-ohm":         "cuet-phy-current-ohm",
    # dual-nature
    "phy-dual-debroglie":      "cuet-phy-dual-debroglie",
    "phy-dual-photoelectric":  "cuet-phy-dual-photoelectric",
    # electronic-devices (existing topic IDs)
    "phy-semi-diode":          "cuet-phy-semi-diode",
    "phy-semi-pn":             "cuet-phy-semi-pn",
    "phy-semi-transistor":     "cuet-phy-semi-transistor",
    # em-induction (existing topic IDs)
    "phy-ac-circuits":         "cuet-phy-em-ac-circuits",
    "phy-ac-transformer":      "cuet-phy-em-transformer",
    "phy-emi-faraday":         "cuet-phy-emi-faraday",
    "phy-emi-inductance":      "cuet-phy-emi-inductance",
    # em-waves (existing topic ID)
    "phy-emwave":              "cuet-phy-emwave-spectrum",
    # magnetic-effects (existing topic IDs)
    "phy-magmat-dipole":       "cuet-phy-mag-dipole",
    "phy-magmat-materials":    "cuet-phy-mag-materials",
    "phy-magmov-biot":         "cuet-phy-mag-biot-savart",
    "phy-magmov-devices":      "cuet-phy-mag-devices",
    "phy-magmov-force":        "cuet-phy-mag-lorentz-force",
    # optics
    "phy-ray-instruments":     "cuet-phy-opt-instruments",
    "phy-ray-prism":           "cuet-phy-opt-prism",
    "phy-ray-reflection":      "cuet-phy-opt-reflection",
    "phy-waveopt-diffraction": "cuet-phy-opt-diffraction",
    "phy-waveopt-interference":"cuet-phy-opt-interference",
    "phy-waveopt-polarisation":"cuet-phy-opt-polarisation",
    # electrostatics (existing topic IDs for copied files)
    "phy-pot-capacitor":       "cuet-phy-es-capacitor",
    "phy-pot-dielectric":      "cuet-phy-es-dielectric",
    "phy-pot-potential":        "cuet-phy-es-potential",
}

# ── new-format file prefix → topic_id ───────────────────────────────────────
NEW_FILE_TO_TOPIC = {
    "cuet-phy-elec-coulomb":    "cuet-phy-es-coulomb",
    "cuet-phy-elec-field":      "cuet-phy-es-field",
    "cuet-phy-elec-dipole":     "cuet-phy-es-dipole",
    "cuet-phy-elec-gauss":      "cuet-phy-es-gauss",
    "cuet-phy-elec-potential":  "cuet-phy-es-potential",
    "cuet-phy-elec-capacitor":  "cuet-phy-es-capacitor",
}

# ── topic_id → human name (for topics that need to be CREATED) ──────────────
# Only for topics NOT already in the DB
NEW_TOPICS = {
    # atoms-nuclei
    "cuet-phy-atom-bohr":         ("cuet-phy-atoms-nuclei",      "Bohr Model of Hydrogen Atom", 10),
    "cuet-phy-atom-spectra":      ("cuet-phy-atoms-nuclei",      "Hydrogen Spectrum and Spectral Series", 20),
    "cuet-phy-nuclei-decay":      ("cuet-phy-atoms-nuclei",      "Radioactive Decay", 30),
    "cuet-phy-nuclei-properties": ("cuet-phy-atoms-nuclei",      "Nuclear Properties and Binding Energy", 40),
    # current-electricity
    "cuet-phy-current-instruments":("cuet-phy-current-electricity","Electrical Instruments", 30),
    "cuet-phy-current-kirchhoff": ("cuet-phy-current-electricity","Kirchhoff's Laws and Networks", 20),
    "cuet-phy-current-ohm":       ("cuet-phy-current-electricity","Ohm's Law and Resistance", 10),
    # dual-nature
    "cuet-phy-dual-debroglie":    ("cuet-phy-dual-nature",       "de Broglie Wavelength", 20),
    "cuet-phy-dual-photoelectric":("cuet-phy-dual-nature",       "Photoelectric Effect", 10),
    # em-induction (new ones only)
    "cuet-phy-emi-faraday":       ("cuet-phy-em-induction",      "Faraday's Laws of EMI", 10),
    "cuet-phy-emi-inductance":    ("cuet-phy-em-induction",      "Self and Mutual Inductance", 20),
    # optics (new ones only)
    "cuet-phy-opt-instruments":   ("cuet-phy-optics",            "Optical Instruments", 50),
    "cuet-phy-opt-prism":         ("cuet-phy-optics",            "Prism and Dispersion", 20),
    "cuet-phy-opt-reflection":    ("cuet-phy-optics",            "Reflection and Mirrors", 10),
    "cuet-phy-opt-polarisation":  ("cuet-phy-optics",            "Polarisation of Light", 60),
    # electrostatics (new ones only)
    "cuet-phy-es-coulomb":        ("cuet-phy-electrostatics",    "Coulomb's Law and Electric Charges", 10),
    "cuet-phy-es-field":          ("cuet-phy-electrostatics",    "Electric Field and Field Lines", 20),
    "cuet-phy-es-dipole":         ("cuet-phy-electrostatics",    "Electric Dipole", 30),
    "cuet-phy-es-gauss":          ("cuet-phy-electrostatics",    "Gauss's Law and Applications", 35),
}


def get_chapter_id_from_path(filepath):
    """Derive chapter_id from the file's folder location."""
    rel = filepath.relative_to(BASE)
    parts = rel.parts  # e.g. ('physics', 'atoms-nuclei', 'file.json')
    for folder_name, chapter_id in FOLDER_TO_CHAPTER.items():
        if folder_name in parts:
            return chapter_id
    return None


def get_topic_id_from_file(filepath):
    """Derive topic_id from the filename."""
    stem = filepath.stem  # e.g. 'phy-atom-bohr-copied'

    # Copied files: strip '-copied' suffix
    clean = stem.replace("-copied", "")
    if clean in FILE_TO_TOPIC:
        return FILE_TO_TOPIC[clean]

    # New-format files: match prefix
    for prefix, topic_id in NEW_FILE_TO_TOPIC.items():
        if clean.startswith(prefix):
            return topic_id

    return None


def escape_sql_string(s):
    """Escape a string for use in SQL."""
    if s is None:
        return None
    return s.replace("'", "''").replace("\\", "\\\\")


def build_payload(q):
    """Build the payload JSONB object from a question."""
    payload = {
        "question_id": q.get("id", ""),
        "subtopic": q.get("subtopic", q.get("topic", "")),
        "topic_name": q.get("topic", ""),
        "bloom_level": q.get("bloom_level", "understand"),
        "options": q.get("options", []),
        "elimination_hints": q.get("elimination_hints", []),
    }
    # Type-specific fields
    for field in ["image_uri", "image_alt", "scenario", "assertion", "reason",
                  "text_with_blanks", "column_a", "column_b", "correct_mapping",
                  "items", "correct_order"]:
        if field in q and q[field] is not None:
            payload[field] = q[field]
    return payload


def question_to_sql_obj(q, chapter_id, topic_id):
    """Convert a JSON question to the format expected by insert_batch_questions."""
    return {
        "chapter_id": chapter_id,
        "topic_id": topic_id,
        "exam_ids": q.get("exam_suitability", ["CUET", "NEET"]),
        "question_type": q.get("question_type", "mcq"),
        "difficulty": q.get("difficulty", "medium"),
        "question_text": q.get("question_text", ""),
        "explanation": q.get("explanation", ""),
        "payload": build_payload(q),
        "correct_answer": q.get("correct_answer", ""),
        "concept_tags": q.get("concept_tags", []),
    }


def main():
    # ── Step 1: Find all JSON files ─────────────────────────────────────────
    json_files = sorted(BASE.rglob("*.json"))
    print(f"Found {len(json_files)} JSON files\n")

    fixed_count = 0
    all_questions = []  # (sql_obj, source_file) tuples
    seen_ids = set()
    topic_ids_needed = set()

    for fpath in json_files:
        with open(fpath, "r") as f:
            questions = json.load(f)

        chapter_id = get_chapter_id_from_path(fpath)
        topic_id = get_topic_id_from_file(fpath)
        modified = False

        for q in questions:
            # ── Fix chapter_id ──────────────────────────────────────────
            if not q.get("chapter_id") and chapter_id:
                q["chapter_id"] = chapter_id
                modified = True

            # ── Fix subtopic: use topic as fallback ─────────────────────
            if not q.get("subtopic") and q.get("topic"):
                q["subtopic"] = q["topic"]
                modified = True

            # ── Collect for DB insertion ────────────────────────────────
            q_id = q.get("id", "")
            if q_id not in seen_ids:
                seen_ids.add(q_id)
                # Use the question's own chapter_id (now fixed) or folder-derived
                ch = q.get("chapter_id", chapter_id)
                sql_obj = question_to_sql_obj(q, ch, topic_id)
                all_questions.append(sql_obj)
                if topic_id:
                    topic_ids_needed.add(topic_id)

        if modified:
            with open(fpath, "w") as f:
                json.dump(questions, f, indent=2, ensure_ascii=False)
                f.write("\n")
            fixed_count += 1
            print(f"  FIXED: {fpath.relative_to(BASE)} ({len(questions)} questions)")
        else:
            print(f"  OK:    {fpath.relative_to(BASE)} ({len(questions)} questions)")

    print(f"\n── Summary ────────────────────────────────────────")
    print(f"  Files fixed:      {fixed_count}")
    print(f"  Total questions:  {len(all_questions)} (deduplicated)")
    print(f"  Topics needed:    {len(topic_ids_needed)}")

    # ── Step 2: Generate SPLIT SQL migrations ────────────────────────────────
    # Delete old monolith if it exists
    old_monolith = MIGRATION_DIR / "20260304_seed_all_cuet_questions.sql"
    if old_monolith.exists():
        old_monolith.unlink()
        print(f"\n  Deleted old monolith: {old_monolith.name}")

    # ── Group questions by chapter ──────────────────────────────────────────
    from collections import defaultdict
    by_chapter = defaultdict(list)
    for q in all_questions:
        by_chapter[q["chapter_id"]].append(q)

    # ── Short names for filenames ───────────────────────────────────────────
    CHAPTER_SHORT = {
        "cuet-phy-atoms-nuclei":      "atoms",
        "cuet-phy-current-electricity":"current",
        "cuet-phy-dual-nature":       "dual",
        "cuet-phy-electronic-devices":"devices",
        "cuet-phy-electrostatics":    "elec",
        "cuet-phy-em-induction":      "emi",
        "cuet-phy-em-waves":          "emwaves",
        "cuet-phy-magnetic-effects":  "mag",
        "cuet-phy-optics":            "optics",
    }

    INSERT_FN = """CREATE OR REPLACE FUNCTION insert_batch_questions_v2(questions jsonb, p_subject_id text, batch_source text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  q jsonb;
  new_id uuid;
  opt jsonb;
  hint jsonb;
  idx int;
  total int := 0;
  existing_count int;
BEGIN
  FOR q IN SELECT * FROM jsonb_array_elements(questions)
  LOOP
    -- Skip duplicates by checking question_text + chapter_id
    SELECT count(*) INTO existing_count
    FROM med_questions
    WHERE question_text = q->>'question_text'
      AND chapter_id = q->>'chapter_id';

    IF existing_count > 0 THEN
      CONTINUE;
    END IF;

    INSERT INTO med_questions (
      subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
      strength_required, question_text, explanation, payload,
      image_url, image_alt, correct_answer, concept_tags,
      status, is_active, source
    ) VALUES (
      p_subject_id,
      q->>'chapter_id',
      q->>'topic_id',
      ARRAY(SELECT jsonb_array_elements_text(q->'exam_ids')),
      q->>'question_type',
      q->>'difficulty',
      'just-started',
      q->>'question_text',
      q->>'explanation',
      q->'payload',
      NULL,
      q->>'image_alt',
      q->>'correct_answer',
      ARRAY(SELECT jsonb_array_elements_text(COALESCE(q->'concept_tags', '[]'::jsonb))),
      'active',
      true,
      batch_source
    )
    RETURNING id INTO new_id;

    idx := 0;
    FOR opt IN SELECT * FROM jsonb_array_elements(q->'payload'->'options')
    LOOP
      INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
      VALUES (new_id, opt->>'key', opt->>'text', (opt->>'is_correct')::boolean, idx);
      idx := idx + 1;
    END LOOP;

    IF q->'payload'->'elimination_hints' IS NOT NULL THEN
      FOR hint IN SELECT * FROM jsonb_array_elements(q->'payload'->'elimination_hints')
      LOOP
        IF (hint->>'hint') IS NOT NULL AND (hint->>'hint') != '' THEN
          INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
          VALUES (new_id, hint->>'option_key', hint->>'hint', hint->>'misconception')
          ON CONFLICT (question_id, option_key) DO NOTHING;
        END IF;
      END LOOP;
    END IF;

    total := total + 1;
  END LOOP;

  RETURN total;
END;
$$;"""

    generated_files = []

    # ── File 1: Setup (topics + function) ───────────────────────────────────
    setup_path = MIGRATION_DIR / "20260304_seed_cuet_step1_setup.sql"
    lines = []
    lines.append("-- ==========================================================================")
    lines.append("-- STEP 1: Create missing topics + batch insert function")
    lines.append("-- Run this FIRST before the chapter batch files.")
    lines.append("-- ==========================================================================")
    lines.append("")

    # Topics
    lines.append("-- Create missing CUET physics topics")
    lines.append("INSERT INTO med_topics (id, chapter_id, name, sort_order, is_important, is_active) VALUES")
    topic_rows = []
    for tid in sorted(topic_ids_needed):
        if tid in NEW_TOPICS:
            ch, name, sort = NEW_TOPICS[tid]
            topic_rows.append(
                f"  ('{tid}', '{ch}', '{escape_sql_string(name)}', {sort}, true, true)"
            )
    if topic_rows:
        lines.append(",\n".join(topic_rows))
        lines.append("ON CONFLICT (id) DO NOTHING;")
    lines.append("")

    # Function
    lines.append("-- Batch insert helper function")
    lines.append(INSERT_FN)
    lines.append("")

    with open(setup_path, "w") as f:
        f.write("\n".join(lines))
    generated_files.append((setup_path.name, "setup"))

    # ── Files 2-N: One per chapter (split large chapters) ───────────────────
    BATCH_SIZE = 20
    MAX_QUESTIONS_PER_FILE = 100  # ~100 Qs keeps each file well under SQL Editor limit
    file_num = 2

    for chapter_id in sorted(by_chapter.keys()):
        chapter_qs = by_chapter[chapter_id]
        short = CHAPTER_SHORT.get(chapter_id, chapter_id.split("-")[-1])

        # Split large chapters into multiple files
        chunks = [chapter_qs[i:i + MAX_QUESTIONS_PER_FILE]
                  for i in range(0, len(chapter_qs), MAX_QUESTIONS_PER_FILE)]

        for chunk_idx, chunk in enumerate(chunks):
            suffix = f"_{chunk_idx + 1}" if len(chunks) > 1 else ""
            fname = f"20260304_seed_cuet_step{file_num}_{short}{suffix}.sql"
            fpath = MIGRATION_DIR / fname

            lines = []
            lines.append("-- ==========================================================================")
            lines.append(f"-- STEP {file_num}: Seed {chapter_id} ({len(chunk)} questions)")
            if len(chunks) > 1:
                lines.append(f"-- Part {chunk_idx + 1} of {len(chunks)}")
            lines.append("-- ==========================================================================")
            lines.append("")
            lines.append("BEGIN;")
            lines.append("")

            for i in range(0, len(chunk), BATCH_SIZE):
                batch = chunk[i:i + BATCH_SIZE]
                batch_json = json.dumps(batch, ensure_ascii=False)
                batch_json_escaped = batch_json.replace("'", "''")
                batch_num = (i // BATCH_SIZE) + 1
                lines.append(f"-- Batch {batch_num} ({len(batch)} questions)")
                lines.append(f"SELECT insert_batch_questions_v2('{batch_json_escaped}'::jsonb, 'cuet-physics', 'seed-{short}{suffix}-b{batch_num}');")
                lines.append("")

            lines.append("COMMIT;")
            lines.append("")

            with open(fpath, "w") as f:
                f.write("\n".join(lines))
            generated_files.append((fname, f"{chapter_id} ({len(chunk)} Qs)"))
            file_num += 1

    # ── Last file: Cleanup ──────────────────────────────────────────────────
    cleanup_path = MIGRATION_DIR / f"20260304_seed_cuet_step{file_num}_cleanup.sql"
    lines = []
    lines.append("-- ==========================================================================")
    lines.append(f"-- STEP {file_num}: Drop batch insert helper function")
    lines.append("-- Run this LAST after all chapter files have been executed.")
    lines.append("-- ==========================================================================")
    lines.append("")
    lines.append("DROP FUNCTION IF EXISTS insert_batch_questions_v2(jsonb, text, text);")
    lines.append("")
    with open(cleanup_path, "w") as f:
        f.write("\n".join(lines))
    generated_files.append((cleanup_path.name, "cleanup"))

    print(f"\n── Migrations generated ({len(generated_files)} files) ──────────")
    for fname, desc in generated_files:
        print(f"  {fname:55s} {desc}")
    print(f"\n  Total questions: {len(all_questions)}")


if __name__ == "__main__":
    main()
