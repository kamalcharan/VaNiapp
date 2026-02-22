/**
 * Persona configuration — static data consumed by usePersona().
 *
 * 2026 ("crunch")  → exam is imminent, all chapters unlocked, urgency UI
 * 2027 ("levels")  → long runway, progressive unlock, gamified levels
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

const CRUNCH: PersonaConfig = {
  mode: 'crunch',
  targetYear: 2026,
  showLevels: false,
  showCountdown: true,
  labels: {
    homeGreeting: "Let's crush today's session!",
    chapterListHeader: 'All Chapters',
    quizStart: 'Start Practice',
    quizComplete: 'Chapter done — keep the streak!',
    emptyState: 'Pick a chapter and start solving!',
  },
  accentColor: null, // default theme accent
};

const LEVELS: PersonaConfig = {
  mode: 'levels',
  targetYear: 2027,
  showLevels: false,
  showCountdown: false,
  labels: {
    homeGreeting: 'Welcome back, explorer!',
    chapterListHeader: 'Your Journey',
    quizStart: 'Begin Level',
    quizComplete: 'Level cleared — new chapter unlocked!',
    emptyState: 'Complete the current level to unlock more!',
  },
  accentColor: '#8B5CF6', // purple for gamified feel
};

export const PERSONA_MAP: Record<number, PersonaConfig> = {
  2026: CRUNCH,
  2027: LEVELS,
};

/** Fallback when targetYear is undefined (e.g. old users) */
export const DEFAULT_PERSONA = CRUNCH;
