#!/usr/bin/env python3
"""
Validates a CUET question JSON file against structural and field rules.
Usage: python3 Qbank/validate-json.py <path-to-json>
"""
import json, sys
from collections import Counter

if len(sys.argv) < 2:
    print("Usage: python3 Qbank/validate-json.py <path-to-json>")
    sys.exit(1)

fpath = sys.argv[1]
with open(fpath) as f:
    data = json.load(f)

errors = []
warnings = []
types = Counter()
difficulties = Counter()
blooms = Counter()
ids = []

REQUIRED_FIELDS = [
    'id','subject','chapter_id','chapter','topic','exam_suitability',
    'question_type','question_text','options','correct_answer',
    'explanation','elimination_hints','difficulty','bloom_level',
    'concept_tags','subtopic'
]
VALID_TYPES = {
    'mcq','assertion-reasoning','true-false','fill-in-blanks',
    'match-the-following','scenario-based','diagram-based','logical-sequence'
}
AR_OPTIONS = [
    'Both A and R are true and R is the correct explanation of A',
    'Both A and R are true but R is NOT the correct explanation of A',
    'A is true but R is false',
    'A is false but R is true',
]

# Read expected values from first question (or override here)
expected_subject    = data[0].get('subject')    if data else None
expected_chapter_id = data[0].get('chapter_id') if data else None
expected_chapter    = data[0].get('chapter')    if data else None
expected_topic      = data[0].get('topic')      if data else None

for i, q in enumerate(data):
    qid = q.get('id', f'[index {i}]')
    ids.append(qid)

    # Required fields
    for f in REQUIRED_FIELDS:
        if f not in q:
            errors.append(f"{qid}: missing field '{f}'")

    # Consistent fixed fields across all questions
    if q.get('subject') != expected_subject:
        errors.append(f"{qid}: subject='{q.get('subject')}' expected '{expected_subject}'")
    if q.get('chapter_id') != expected_chapter_id:
        errors.append(f"{qid}: chapter_id='{q.get('chapter_id')}' expected '{expected_chapter_id}'")
    if q.get('chapter') != expected_chapter:
        errors.append(f"{qid}: chapter='{q.get('chapter')}' expected '{expected_chapter}'")
    if q.get('topic') != expected_topic:
        errors.append(f"{qid}: topic='{q.get('topic')}' expected '{expected_topic}'")
    if q.get('exam_suitability') != ['CUET']:
        errors.append(f"{qid}: exam_suitability must be ['CUET']")

    qt = q.get('question_type', '')
    if qt not in VALID_TYPES:
        errors.append(f"{qid}: invalid question_type '{qt}'")
    types[qt] += 1
    difficulties[q.get('difficulty', '?')] += 1
    blooms[q.get('bloom_level', '?')] += 1

    opts = q.get('options', [])
    correct_keys = [o['key'] for o in opts if o.get('is_correct')]
    ca = q.get('correct_answer', '')

    if qt == 'true-false':
        if ca not in ('True', 'False'):
            errors.append(f"{qid}: true-false correct_answer='{ca}' must be 'True' or 'False'")
        if len(opts) != 2:
            errors.append(f"{qid}: true-false must have 2 options, got {len(opts)}")
        tf_texts = {o.get('text') for o in opts}
        if not ({'True','False'} <= tf_texts or {'true','false'} <= tf_texts):
            warnings.append(f"{qid}: true-false options should have 'True' and 'False' texts")

    elif qt in ('mcq','scenario-based','diagram-based','fill-in-blanks'):
        if len(opts) != 4:
            errors.append(f"{qid}: {qt} must have 4 options, got {len(opts)}")
        if len(correct_keys) != 1:
            errors.append(f"{qid}: expected 1 correct option, found {len(correct_keys)}")
        elif correct_keys[0] != ca:
            errors.append(f"{qid}: is_correct key '{correct_keys[0]}' != correct_answer '{ca}'")

    elif qt == 'assertion-reasoning':
        if len(opts) != 4:
            errors.append(f"{qid}: assertion-reasoning must have 4 options, got {len(opts)}")
        actual_texts = [o.get('text','') for o in opts]
        for exp in AR_OPTIONS:
            if exp not in actual_texts:
                errors.append(f"{qid}: A/R missing option: '{exp}'")
        if len(correct_keys) != 1:
            errors.append(f"{qid}: expected 1 correct option, found {len(correct_keys)}")
        elif correct_keys[0] != ca:
            errors.append(f"{qid}: is_correct key '{correct_keys[0]}' != correct_answer '{ca}'")

    elif qt == 'match-the-following':
        if 'payload' not in q:
            errors.append(f"{qid}: match-the-following missing 'payload'")
        else:
            p = q['payload']
            if 'column_a' not in p or 'column_b' not in p:
                errors.append(f"{qid}: payload missing 'column_a' or 'column_b'")

    # Elimination hints should not cover the correct option
    hints = q.get('elimination_hints', [])
    hint_keys = {h.get('option_key') for h in hints}
    for hk in hint_keys:
        if hk in correct_keys:
            warnings.append(f"{qid}: elimination_hint targets CORRECT option '{hk}'")

    # concept_tags should be a non-empty list
    tags = q.get('concept_tags', [])
    if not isinstance(tags, list) or len(tags) == 0:
        warnings.append(f"{qid}: concept_tags is empty or not a list")

# Duplicate IDs
dup_ids = [id_ for id_, count in Counter(ids).items() if count > 1]
if dup_ids:
    errors.append(f"Duplicate IDs: {dup_ids}")

# Summary
print(f"\n{'='*60}")
print(f"FILE: {fpath}")
print(f"{'='*60}")
print(f"Total questions : {len(data)}")
print(f"\nQuestion types  : {dict(types)}")
print(f"Difficulties    : {dict(difficulties)}")
print(f"Bloom levels    : {dict(blooms)}")
print(f"\nFixed fields (from Q1):")
print(f"  subject     = {expected_subject}")
print(f"  chapter_id  = {expected_chapter_id}")
print(f"  chapter     = {expected_chapter}")
print(f"  topic       = {expected_topic}")

print(f"\n{'─'*60}")
if errors:
    print(f"ERRORS ({len(errors)}):")
    for e in errors:
        print(f"  ✗ {e}")
else:
    print("ERRORS: none")

if warnings:
    print(f"\nWARNINGS ({len(warnings)}):")
    for w in warnings:
        print(f"  ⚠ {w}")
else:
    print("WARNINGS: none")

print(f"\n{'='*60}")
if not errors:
    print("✅  File looks good — safe to import.")
else:
    print(f"❌  Fix {len(errors)} error(s) before importing.")
print(f"{'='*60}\n")

sys.exit(0 if not errors else 1)
