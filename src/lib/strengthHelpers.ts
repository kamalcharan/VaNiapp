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

// ── NEET ↔ CUET shared-subject mapping ──────────────────────
// Some NEET chapters are tagged with exam_ids: ['NEET', 'CUET'] (shared).
// When showing CUET stats, we need to also include strength data from
// those shared NEET chapters. Key = CUET subject ID, Value = NEET subject ID.
const CUET_TO_NEET_SUBJECT: Record<string, string> = {
  'cuet-physics': 'physics',
  'cuet-chemistry': 'chemistry',
};

/**
 * Get the NEET counterpart subject ID for a CUET subject.
 * Returns undefined if the subject has no NEET counterpart.
 */
export function getNeetCounterpart(subjectId: string): string | undefined {
  return CUET_TO_NEET_SUBJECT[subjectId];
}
