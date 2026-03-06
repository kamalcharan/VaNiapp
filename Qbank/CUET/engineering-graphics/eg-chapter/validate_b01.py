#!/usr/bin/env python3
"""Validate cuet-eg-scales-b01.json against bulkinsert.html expectations."""
import json, sys
from collections import Counter

with open("cuet-eg-scales-b01.json") as f:
    qs = json.load(f)

errors = []
warnings = []

# 1. Count & IDs
assert len(qs) == 40, f"Expected 40, got {len(qs)}"
ids = [q["id"] for q in qs]
assert len(set(ids)) == 40, "Duplicate IDs!"
for qid in ids:
    if not qid.startswith("cuet-eg-scales-"):
        errors.append(f"Bad ID prefix: {qid}")

# 2. Type distribution
types = Counter(q["question_type"] for q in qs)
expected = {"mcq": 20, "diagram-based": 4, "assertion-reasoning": 4,
            "match-the-following": 2, "true-false": 4, "fill-in-blanks": 2,
            "scenario-based": 2, "logical-sequence": 2}
for t, c in expected.items():
    if types.get(t, 0) != c:
        errors.append(f"Type {t}: expected {c}, got {types.get(t, 0)}")

# 3. Difficulty distribution
diffs = Counter(q["difficulty"] for q in qs)
print(f"Difficulty: {dict(diffs)}")
# Expected: Easy 30% (12), Medium 50% (20), Hard 20% (8)

# 4. Answer balance
answers = Counter(q["correct_answer"] for q in qs)
print(f"Answers: {dict(answers)}")
for letter, count in answers.items():
    if count > 12:
        errors.append(f"Answer {letter} appears {count}x (max 12)")

# 5. Required fields per type
REQUIRED_ALL = ["id", "chapter_id", "topic_id", "question_type", "difficulty",
                "question_text", "correct_answer", "explanation", "options",
                "elimination_hints", "subject", "chapter", "topic", "subtopic",
                "bloom_level", "exam_suitability", "concept_tags"]

for q in qs:
    qid = q["id"]
    # Common fields
    for field in REQUIRED_ALL:
        if field not in q:
            errors.append(f"{qid}: missing field '{field}'")

    # chapter_id check
    if q.get("chapter_id") != "cuet-eg-engineering-graphics":
        errors.append(f"{qid}: wrong chapter_id: {q.get('chapter_id')}")

    # topic_id check
    if q.get("topic_id") != "cuet-eg-scales":
        errors.append(f"{qid}: wrong topic_id: {q.get('topic_id')}")

    # subject check
    if q.get("subject") != "engineering-graphics":
        errors.append(f"{qid}: wrong subject: {q.get('subject')}")

    # Options check
    opts = q.get("options", [])
    if q["question_type"] in ("mcq", "diagram-based", "assertion-reasoning",
                               "match-the-following", "fill-in-blanks",
                               "scenario-based", "logical-sequence"):
        if len(opts) != 4:
            errors.append(f"{qid}: expected 4 options, got {len(opts)}")
        keys = [o["key"] for o in opts]
        if keys != ["A", "B", "C", "D"]:
            errors.append(f"{qid}: option keys not A,B,C,D: {keys}")

    # True-false: C and D should be "---"
    if q["question_type"] == "true-false":
        if opts[2]["text"] != "---" or opts[3]["text"] != "---":
            errors.append(f"{qid}: true-false C/D should be '---'")
        if q["correct_answer"] not in ("A", "B"):
            errors.append(f"{qid}: true-false answer must be A or B")

    # Elimination hints: should be 3 (for wrong options)
    hints = q.get("elimination_hints", [])
    if q["question_type"] != "true-false":
        if len(hints) != 3:
            warnings.append(f"{qid}: expected 3 elimination hints, got {len(hints)}")
    else:
        if len(hints) != 1:
            warnings.append(f"{qid}: true-false should have 1 hint, got {len(hints)}")

    # Diagram-based: need image_uri and image_alt
    if q["question_type"] == "diagram-based":
        if "image_uri" not in q:
            errors.append(f"{qid}: diagram-based missing image_uri")
        if "image_alt" not in q:
            errors.append(f"{qid}: diagram-based missing image_alt")

    # Assertion-reasoning: need assertion and reason
    if q["question_type"] == "assertion-reasoning":
        if "assertion" not in q:
            errors.append(f"{qid}: A-R missing assertion")
        if "reason" not in q:
            errors.append(f"{qid}: A-R missing reason")

    # Match-the-following: need column_a, column_b, correct_mapping
    if q["question_type"] == "match-the-following":
        for field in ("column_a", "column_b", "correct_mapping"):
            if field not in q:
                errors.append(f"{qid}: match missing {field}")

    # Fill-in-blanks: need text_with_blanks
    if q["question_type"] == "fill-in-blanks":
        if "text_with_blanks" not in q:
            errors.append(f"{qid}: fill-in missing text_with_blanks")

    # Scenario-based: need scenario
    if q["question_type"] == "scenario-based":
        if "scenario" not in q:
            errors.append(f"{qid}: scenario-based missing scenario")

    # Logical-sequence: need items and correct_order
    if q["question_type"] == "logical-sequence":
        if "items" not in q:
            errors.append(f"{qid}: logical-sequence missing items")
        if "correct_order" not in q:
            errors.append(f"{qid}: logical-sequence missing correct_order")

    # Correct answer should match an option marked is_correct
    correct_opts = [o for o in opts if o.get("is_correct")]
    if len(correct_opts) != 1:
        errors.append(f"{qid}: expected 1 is_correct option, got {len(correct_opts)}")
    elif correct_opts[0]["key"] != q["correct_answer"]:
        errors.append(f"{qid}: is_correct on {correct_opts[0]['key']} but correct_answer is {q['correct_answer']}")

# 6. Print results
print(f"\n{'='*60}")
print(f"VALIDATION RESULTS: {len(qs)} questions")
print(f"Types: {dict(types)}")
print(f"{'='*60}")

if errors:
    print(f"\nERRORS ({len(errors)}):")
    for e in errors:
        print(f"  ✗ {e}")
else:
    print("\n✓ No errors found!")

if warnings:
    print(f"\nWARNINGS ({len(warnings)}):")
    for w in warnings:
        print(f"  ⚠ {w}")

sys.exit(1 if errors else 0)
