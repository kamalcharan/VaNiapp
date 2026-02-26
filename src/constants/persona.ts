/**
 * Persona configuration — consumed by usePersona().
 *
 * Pacing is derived from time remaining until the target exam:
 *   ≤ 6 months  → "crunch"  — all chapters unlocked, urgency UI
 *   > 6 months  → "levels"  — progressive unlock, gamified levels
 *
 * Target year options are calculated dynamically from the current date
 * (exam window = May each year).
 */

export type PersonaMode = 'crunch' | 'levels';

export interface PersonaConfig {
  mode: PersonaMode;
  targetYear: number;
  /** Should chapter list show lock icons / progressive unlock? */
  showLevels: boolean;
  /** Should home screen show countdown / urgency banner? */
  showCountdown: boolean;
  labels: {
    homeGreeting: string;
    chapterListHeader: string;
    quizStart: string;
    quizComplete: string;
    emptyState: string;
  };
  /** Accent tint override (null = use default theme accent) */
  accentColor: string | null;
}

const CRUNCH_LABELS = {
  homeGreeting: "Let's crush today's session!",
  chapterListHeader: 'All Chapters',
  quizStart: 'Start Practice',
  quizComplete: 'Chapter done — keep the streak!',
  emptyState: 'Pick a chapter and start solving!',
};

const LEVELS_LABELS = {
  homeGreeting: 'Welcome back, explorer!',
  chapterListHeader: 'Your Journey',
  quizStart: 'Begin Level',
  quizComplete: 'Level cleared — new chapter unlocked!',
  emptyState: 'Complete the current level to unlock more!',
};

/**
 * Compute months remaining until the target exam (May of targetYear).
 */
function monthsUntilExam(targetYear: number): number {
  const now = new Date();
  const examDate = new Date(targetYear, 4, 1); // May 1
  return (examDate.getFullYear() - now.getFullYear()) * 12
    + (examDate.getMonth() - now.getMonth());
}

/**
 * Build a PersonaConfig for any target year based on time remaining.
 */
export function getPersonaForYear(targetYear: number): PersonaConfig {
  const months = monthsUntilExam(targetYear);
  const isCrunch = months <= 6;

  return {
    mode: isCrunch ? 'crunch' : 'levels',
    targetYear,
    showLevels: !isCrunch,
    showCountdown: isCrunch,
    labels: isCrunch ? CRUNCH_LABELS : LEVELS_LABELS,
    accentColor: isCrunch ? null : '#8B5CF6',
  };
}

/** Fallback when targetYear is undefined (e.g. old users) — uses crunch mode */
export const DEFAULT_PERSONA: PersonaConfig = {
  mode: 'crunch',
  targetYear: new Date().getFullYear(),
  showLevels: false,
  showCountdown: true,
  labels: CRUNCH_LABELS,
  accentColor: null,
};

/**
 * Get dynamic target-year options based on the current date.
 * Exam window = May. If we're past May, the nearest exam is next year.
 */
export function getTargetYearOptions(): { year: number; label: string; emoji: string }[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-based

  // If past May, nearest exam is next year; otherwise this year
  const nextExamYear = currentMonth > 5 ? currentYear + 1 : currentYear;

  return [
    { year: nextExamYear, label: `${nextExamYear}`, emoji: '\u26A1' },
    { year: nextExamYear + 1, label: `${nextExamYear + 1}`, emoji: '\uD83C\uDF31' },
  ];
}
