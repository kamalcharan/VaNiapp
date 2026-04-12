#!/usr/bin/env python3
"""
Generate elimination_hints for polsci CUET questions that are missing them.
- assertion-reasoning: 3 hints (one per incorrect option) based on explanation
- true-false: 1-2 hints (for incorrect option(s)) based on explanation
"""

import json
import glob
import re
import os

# ── Standard AR option text ─────────────────────────────────
AR_OPTION_TEXT = {
    'A': 'Both A and R are true, and R is the correct explanation of A',
    'B': 'Both A and R are true, but R is NOT the correct explanation of A',
    'C': 'A is true, but R is false',
    'D': 'A is false, but R is true',
}

def extract_first_sentence(text: str) -> str:
    """Extract first meaningful sentence (up to ~120 chars)."""
    if not text:
        return ''
    # Split on sentence-ending punctuation followed by space/end
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    if sentences:
        s = sentences[0].strip()
        if len(s) > 130:
            s = s[:127] + '...'
        return s
    return text[:120]

def truncate(text: str, max_len: int = 150) -> str:
    if len(text) > max_len:
        return text[:max_len - 3] + '...'
    return text

def extract_assertion_truth(explanation: str) -> str:
    """Extract what the explanation says about the Assertion being true/false."""
    # Try to find a sentence about the assertion
    patterns = [
        r'[Tt]he [Aa]ssertion (?:is|was|remains) (?:true|false|correct|incorrect)[^.!?]*[.!?]',
        r'[Aa]ssertion \(?[Aa]\)? (?:is|was) (?:true|correct|false|incorrect)[^.!?]*[.!?]',
        r'[Aa]\s+is\s+(?:true|false|correct|incorrect)[^.!?]*[.!?]',
    ]
    for p in patterns:
        m = re.search(p, explanation)
        if m:
            return m.group(0).strip()
    return extract_first_sentence(explanation)

def extract_reason_truth(explanation: str) -> str:
    """Extract what the explanation says about the Reason being true/false."""
    patterns = [
        r'[Tt]he [Rr]eason (?:is|was|remains) (?:true|false|correct|incorrect)[^.!?]*[.!?]',
        r'[Rr]eason \(?[Rr]\)? (?:is|was) (?:true|correct|false|incorrect)[^.!?]*[.!?]',
        r'[Rr]\s+is\s+(?:true|false|correct|incorrect)[^.!?]*[.!?]',
    ]
    for p in patterns:
        m = re.search(p, explanation)
        if m:
            return m.group(0).strip()
    # Fallback: last sentence
    sentences = re.split(r'(?<=[.!?])\s+', explanation.strip())
    if len(sentences) >= 2:
        return sentences[-1].strip()
    return ''

def generate_ar_hints(q: dict) -> list:
    """
    Generate 3 elimination hints for an assertion-reasoning question.
    One hint per incorrect option, explaining why that option is wrong.
    """
    correct = q.get('correct_answer', 'A')
    explanation = q.get('explanation', '')

    a_sentence = extract_assertion_truth(explanation)
    r_sentence = extract_reason_truth(explanation)
    exp_start = extract_first_sentence(explanation)

    # All 4 options; we need hints for the 3 incorrect ones
    all_options = ['A', 'B', 'C', 'D']
    incorrect = [o for o in all_options if o != correct]

    hints = []

    for opt in incorrect:
        if correct == 'A':
            # Correct: Both true, R explains A
            if opt == 'B':
                hint = (f"R does not merely accompany A — it directly causes or explains it. "
                        f"{truncate(exp_start)} This causal link makes R the correct explanation of A.")
                misc = "Students choose B when they see two true statements but overlook the direct causal link between R and A."
            elif opt == 'C':
                hint = (f"The Reason is factually accurate, not false. "
                        f"{truncate(r_sentence or exp_start)} Verify R's accuracy before eliminating it.")
                misc = "Students incorrectly dismiss the Reason as false without checking the underlying facts."
            else:  # opt == 'D'
                hint = (f"The Assertion is factually correct, not false. "
                        f"{truncate(a_sentence or exp_start)} A cannot be false here.")
                misc = "Students incorrectly judge the Assertion to be false without verifying the specific claim."

        elif correct == 'B':
            # Correct: Both true, R does NOT explain A
            if opt == 'A':
                hint = (f"R is a related but independent fact — it does not specifically explain WHY A is true. "
                        f"{truncate(exp_start)} The causal link is absent.")
                misc = "Students see two true statements and assume R must explain A, without checking the causal logic."
            elif opt == 'C':
                hint = (f"The Reason is factually true, not false. "
                        f"{truncate(r_sentence or exp_start)} Both statements are true even though R is not the explanation for A.")
                misc = "Students assume that if R doesn't explain A, it must be false — but R can be true yet not causally linked to A."
            else:  # opt == 'D'
                hint = (f"The Assertion is factually true, not false. "
                        f"{truncate(a_sentence or exp_start)} Both A and R are true statements.")
                misc = "Students incorrectly conclude A is false when they cannot find a causal link, but truth and causal relevance are separate."

        elif correct == 'C':
            # Correct: A true, R false
            if opt == 'A':
                hint = (f"The Reason is factually incorrect, so option A (both true, R explains A) cannot be correct. "
                        f"{truncate(r_sentence or exp_start)}")
                misc = "Students assume both statements must be true without verifying the Reason's factual accuracy."
            elif opt == 'B':
                hint = (f"Since R is false, option B (both true) is ruled out. "
                        f"{truncate(r_sentence or exp_start)} A true statement cannot explain alongside a false Reason.")
                misc = "Students select B without checking whether R is actually factually correct."
            else:  # opt == 'D'
                hint = (f"The Assertion is true, not false. "
                        f"{truncate(a_sentence or exp_start)} Only R is false here.")
                misc = "Students confuse which statement (A or R) is incorrect."

        else:  # correct == 'D'
            # Correct: A false, R true
            if opt == 'A':
                hint = (f"The Assertion is factually incorrect, so option A (both true, R explains A) cannot be correct. "
                        f"{truncate(a_sentence or exp_start)}")
                misc = "Students accept the Assertion at face value without verifying its factual accuracy."
            elif opt == 'B':
                hint = (f"Since A is false, option B (both true) is immediately ruled out. "
                        f"{truncate(a_sentence or exp_start)} A false statement cannot be 'both true'.")
                misc = "Students select B without verifying that the Assertion is actually factually incorrect."
            else:  # opt == 'C'
                hint = (f"The Reason is factually accurate, not false. "
                        f"{truncate(r_sentence or exp_start)} It is the Assertion that is false here, not the Reason.")
                misc = "Students confuse which statement is false — they incorrectly identify R as false when it is actually A."

        hints.append({
            'option_key': opt,
            'hint': hint,
            'misconception': misc,
        })

    return hints


def generate_tf_hints(q: dict) -> list:
    """
    Generate elimination hints for a true-false question.
    Single incorrect option hint based on explanation.
    """
    correct = q.get('correct_answer', 'A')
    explanation = q.get('explanation', '')
    options = {o['key']: o['text'] for o in q.get('options', [])}

    exp_start = extract_first_sentence(explanation)

    # Find the incorrect options
    incorrect_opts = [o for o in options if o != correct]

    hints = []
    for opt in incorrect_opts:
        opt_text = options.get(opt, opt)

        if correct == 'A':  # Statement is True
            hint = (f"The statement is factually true. "
                    f"{truncate(exp_start)} Selecting '{opt_text}' would mean dismissing accurate information.")
            misc = "Students may incorrectly recall the fact or apply a common misconception about this topic."
        elif correct == 'B':  # Statement is False
            hint = (f"The statement contains a factual error. "
                    f"{truncate(exp_start)} The option '{opt_text}' incorrectly accepts the claim.")
            misc = "Students may accept the plausible-sounding statement without recalling the precise facts."
        else:
            # Multi-statement TF (C or D correct)
            hint = (f"Check each statement individually against established facts. "
                    f"{truncate(exp_start)}")
            misc = "Students may not verify all component statements carefully."

        hints.append({
            'option_key': opt,
            'hint': hint,
            'misconception': misc,
        })

    return hints


def process_file(filepath: str) -> tuple[int, int]:
    """Process a single JSON file, adding hints to questions missing them."""
    with open(filepath) as f:
        data = json.load(f)

    is_list = isinstance(data, list)
    questions = data if is_list else data.get('questions', [])

    updated = 0
    for q in questions:
        qt = q.get('question_type', '')
        existing = q.get('elimination_hints', None)
        # Skip if hints already present
        if existing:
            continue

        if qt == 'assertion-reasoning':
            q['elimination_hints'] = generate_ar_hints(q)
            updated += 1
        elif qt == 'true-false':
            q['elimination_hints'] = generate_tf_hints(q)
            updated += 1

    if updated > 0:
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write('\n')

    return updated, len(questions)


def main():
    pattern = '/home/user/VaNiapp/Qbank/CUET/polsci/*.json'
    files = sorted(glob.glob(pattern))

    total_updated = 0
    total_questions = 0

    for filepath in files:
        fname = os.path.basename(filepath)
        updated, total = process_file(filepath)
        total_questions += total
        if updated > 0:
            total_updated += updated
            print(f"  {fname}: +{updated} hints")

    print(f'\nDone. Updated {total_updated} questions across {len(files)} files.')
    print(f'Total questions processed: {total_questions}')


if __name__ == '__main__':
    main()
