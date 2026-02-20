import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { PersonaConfig, PERSONA_MAP, DEFAULT_PERSONA } from '../constants/persona';

/**
 * Returns the active persona config based on the user's targetYear.
 *
 * Usage:
 *   const persona = usePersona();
 *   persona.mode        // 'crunch' | 'levels'
 *   persona.showLevels  // false (2026) | true (2027)
 *   persona.labels.quizStart // "Start Practice" | "Begin Level"
 */
export function usePersona(): PersonaConfig {
  const targetYear = useSelector(
    (state: RootState) => state.auth.user?.targetYear,
  );
  return PERSONA_MAP[targetYear ?? 0] ?? DEFAULT_PERSONA;
}
