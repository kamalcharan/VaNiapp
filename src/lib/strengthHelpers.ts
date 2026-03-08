import {
  StrengthLevel,
  StrengthConfig,
  STRENGTH_LEVELS,
  NEEDS_FOCUS_CONFIG,
} from '../types';

// ── Shared strength config lookup ────────────────────────────

/** Get the display config (label, color, thresholds) for a strength level. */
export function getStrengthConfig(level: StrengthLevel): StrengthConfig {
  if (level === 'needs-focus') return NEEDS_FOCUS_CONFIG;
  return STRENGTH_LEVELS.find((s) => s.id === level) ?? STRENGTH_LEVELS[0];
}

// ── VaNi coaching messages ───────────────────────────────────

const VANI_MESSAGES: Record<StrengthLevel, string[]> = {
  'just-started': [
    "Let's begin your journey!",
    "Ready to explore together?",
    "Your adventure starts here!",
  ],
  'getting-there': [
    "You're building momentum!",
    "Great progress, keep going!",
    "I see your growth!",
  ],
  'on-track': [
    "You're doing amazing!",
    "Strong foundations built!",
    "Keep up the great work!",
  ],
  'strong': [
    "You're mastering this!",
    "Excellent command!",
    "Ready to conquer!",
  ],
  'needs-focus': [
    "Let's strengthen this together",
    "I'll help you improve here",
    "We'll work through this!",
  ],
};

/** Pick a random VaNi message for a given strength level. */
export function getVaniMessage(level: StrengthLevel): string {
  const messages = VANI_MESSAGES[level];
  return messages[Math.floor(Math.random() * messages.length)];
}

// ── NEET ↔ CUET subject mapping ─────────────────────────────
// Subjects that share the same chapters/content across exams.
// Key = CUET subject ID, Value = NEET subject ID.

const CUET_TO_NEET_SUBJECT: Record<string, string> = {
  'cuet-physics': 'physics',
  'cuet-chemistry': 'chemistry',
};

/**
 * Get the base (NEET) subject ID that owns the chapters in the DB.
 * e.g. 'cuet-physics' → 'physics', 'chemistry' → 'chemistry'.
 * Chapters are stored under the NEET subject_id; CUET subjects are
 * just a filtered view (via exam_ids) of the same chapter pool.
 */
export function getBaseSubjectId(subjectId: string): string {
  return CUET_TO_NEET_SUBJECT[subjectId] ?? subjectId;
}

/**
 * Get the exam filter to use when loading chapters for a subject.
 * CUET subjects return 'CUET' so only CUET-tagged chapters are included.
 * NEET subjects return 'NEET'.
 * Returns undefined for subjects not in the mapping (exam-agnostic).
 */
export function getExamFilterForSubject(subjectId: string): string | undefined {
  if (CUET_TO_NEET_SUBJECT[subjectId]) return 'CUET';
  // Check if it's a known NEET subject (reverse lookup)
  if (Object.values(CUET_TO_NEET_SUBJECT).includes(subjectId)) return 'NEET';
  return undefined;
}
