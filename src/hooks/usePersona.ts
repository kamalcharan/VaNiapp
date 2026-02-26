import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { PersonaConfig, getPersonaForYear, DEFAULT_PERSONA } from '../constants/persona';

/**
 * Returns the active persona config based on the user's targetYear.
 * Pacing (crunch vs levels) is derived from months remaining until exam.
 *
 * Usage:
 *   const persona = usePersona();
 *   persona.mode        // 'crunch' | 'levels'
 *   persona.showLevels  // true when > 6 months to exam
 *   persona.labels.quizStart // "Start Practice" | "Begin Level"
 */
export function usePersona(): PersonaConfig {
  const targetYear = useSelector(
    (state: RootState) => state.auth.user?.targetYear,
  );
  if (!targetYear) return DEFAULT_PERSONA;
  return getPersonaForYear(targetYear);
}
