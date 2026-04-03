#!/usr/bin/env python3
"""
Generate elimination_hints locally from question data (no API required).
Uses the explanation + option text to construct targeted hints.

Usage:
    python3 Qbank/generate-hints-local.py
    python3 Qbank/generate-hints-local.py --file cuet_hist_col_batch1.json
"""
import json, re, sys, glob, os

HISTORY_DIR = os.path.join(os.path.dirname(__file__), 'CUET/history')

# ── AR standard option texts ─────────────────────────────────────────────────
AR_OPTIONS = {
    'A': 'Both A and R are true and R is the correct explanation of A',
    'B': 'Both A and R are true but R is NOT the correct explanation of A',
    'C': 'A is true but R is false',
    'D': 'A is false but R is true',
}

AR_HINTS = {
    'A': {
        'hint': 'R may be true but does not causally explain why A is true; check the logical link.',
        'misconception': 'Assuming any true R automatically explains A',
    },
    'B': {
        'hint': 'Both statements need independent verification; they may not both be true.',
        'misconception': 'Accepting both statements as true without checking each',
    },
    'C': {
        'hint': 'R is not necessarily false; re-read R carefully before eliminating it.',
        'misconception': 'Assuming R is false when A appears correct',
    },
    'D': {
        'hint': 'A is not necessarily false; re-read A carefully before accepting D.',
        'misconception': 'Assuming A is false when R appears correct',
    },
}

def trunc(text, n=60):
    return text[:n].rstrip() + ('…' if len(text) > n else '')

def first_sentence(text):
    """Extract first sentence from explanation."""
    m = re.split(r'(?<=[.!?])\s+', text.strip())
    return m[0] if m else text[:80]

def make_hint_for_wrong_option(q, wrong_key, wrong_text, correct_key, correct_text, explanation):
    """Generate a hint for a single wrong option."""
    qt = q.get('question_type', 'mcq')

    # ── Assertion-Reasoning ──────────────────────────────────────────────────
    if qt == 'assertion-reasoning':
        h = AR_HINTS.get(wrong_key)
        if h:
            return {'option_key': wrong_key, 'hint': h['hint'], 'misconception': h['misconception']}

    # ── True-False ───────────────────────────────────────────────────────────
    if qt == 'true-false':
        if wrong_key == 'True' or wrong_key == 'A':
            return {
                'option_key': wrong_key,
                'hint': first_sentence(explanation),
                'misconception': 'Accepting the statement at face value without checking facts',
            }
        else:
            return {
                'option_key': wrong_key,
                'hint': first_sentence(explanation),
                'misconception': 'Doubting the statement without checking historical evidence',
            }

    # ── Match-the-Following ──────────────────────────────────────────────────
    if qt == 'match-the-following':
        # Decode what the wrong pairing claims
        return {
            'option_key': wrong_key,
            'hint': f'This pairing swaps at least one correct match; check each item independently.',
            'misconception': f'Guessing sequence without verifying each pair',
        }

    # ── Fill-in-blanks / Scenario / MCQ ─────────────────────────────────────
    # Build a hint contrasting the wrong option with the correct answer
    wrong_short = trunc(wrong_text, 50)
    correct_short = trunc(correct_text, 50)
    exp_sentence = first_sentence(explanation)

    # Detect if wrong option is a person's name (single/multi word, mostly caps/title)
    name_pat = r'^[A-Z][a-z]+(?: [A-Z][a-z]+){0,3}$'
    is_person = bool(re.match(name_pat, wrong_text.strip()))

    if is_person:
        hint = f'{wrong_short} is associated with a different policy/period; not this event.'
        misconception = f'Confusing {wrong_short.split()[0]} with the correct figure'
    else:
        # Generic: contrast with correct + first explanation sentence
        hint = f'{exp_sentence[:100]}'
        misconception = f'Confusing "{wrong_short[:40]}" with the actual answer'

    return {
        'option_key': wrong_key,
        'hint': hint[:200],
        'misconception': misconception[:100],
    }

def generate_hints_for_question(q):
    """Return list of elimination_hints for all wrong options in a question."""
    correct_key = q.get('correct_answer', '')
    options = q.get('options', [])
    explanation = q.get('explanation', '')
    qt = q.get('question_type', 'mcq')

    correct_opt = next((o for o in options if o['key'] == correct_key), None)
    correct_text = correct_opt['text'] if correct_opt else ''

    hints = []
    for opt in options:
        if opt['key'] == correct_key:
            continue  # skip correct answer
        hints.append(make_hint_for_wrong_option(
            q,
            opt['key'],
            opt.get('text', ''),
            correct_key,
            correct_text,
            explanation,
        ))
    return hints

def process_file(fpath, dry_run=False):
    fname = os.path.basename(fpath)
    with open(fpath, encoding='utf-8') as f:
        data = json.load(f)

    needs = [q for q in data if not q.get('elimination_hints')]
    if not needs:
        print(f'[SKIP] {fname}: all hints present')
        return 0

    print(f'[INFO] {fname}: generating hints for {len(needs)} questions')
    if dry_run:
        return len(needs)

    updated = 0
    for q in data:
        if not q.get('elimination_hints'):
            q['elimination_hints'] = generate_hints_for_question(q)
            updated += 1

    with open(fpath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write('\n')

    print(f'  [OK] {fname}: wrote hints for {updated} questions')
    return updated

def main():
    args = sys.argv[1:]
    dry_run = '--dry-run' in args
    file_arg = args[args.index('--file') + 1] if '--file' in args else None

    if file_arg:
        files = [os.path.join(HISTORY_DIR, file_arg)]
    else:
        files = sorted(glob.glob(os.path.join(HISTORY_DIR, '*.json')))

    total = 0
    for f in files:
        total += process_file(f, dry_run)

    print(f'\nDone — {total} questions {"would be" if dry_run else ""} updated')

if __name__ == '__main__':
    main()
