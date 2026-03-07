import { Question, QuestionV2, QuestionType } from '../types';

/**
 * Map old local chapter IDs → DB (med_chapters) chapter IDs.
 * Legacy question files used long-form IDs like 'zoology-human-physiology',
 * but the DB uses short-form 'zoo-*'. This ensures strength tracking,
 * chapter quiz routing, and subject detail all use the same IDs.
 */
export const LEGACY_CHAPTER_MAP: Record<string, string> = {
  'physics-laws-of-motion':     'phy-laws-of-motion',
  'physics-thermodynamics':     'phy-thermodynamics',
  'chemistry-chemical-bonding': 'chem-chemical-bonding',
  'chemistry-hydrocarbons':     'chem-hydrocarbons',
  'botany-cell-biology':        'bot-cell-unit',
  'botany-plant-anatomy':       'bot-anatomy-flowering',
  'zoology-human-physiology':   'zoo-body-fluids',
  'zoology-genetics':           'zoo-evolution',
};

/**
 * Resolve a potentially-legacy chapter ID to its DB equivalent.
 * If the ID is already a DB ID (e.g., 'zoo-body-fluids'), returns it unchanged.
 */
export function resolveLegacyChapterId(chapterId: string): string {
  return LEGACY_CHAPTER_MAP[chapterId] ?? chapterId;
}

/**
 * Convert a legacy Question (MCQ-only) to the QuestionV2 format.
 * This allows existing question data to work with the new type system
 * without modifying the question bank files.
 */
export function legacyToV2(q: Question): QuestionV2 {
  return {
    id: q.id,
    type: 'mcq',
    chapterId: LEGACY_CHAPTER_MAP[q.chapterId] ?? q.chapterId,
    subjectId: q.subjectId,
    difficulty: q.difficulty,
    text: q.text,
    textTe: q.textTe,
    textHi: q.textHi,
    explanation: q.explanation,
    explanationTe: q.explanationTe,
    explanationHi: q.explanationHi,
    eliminationTechnique: q.eliminationTechnique,
    eliminationTechniqueTe: q.eliminationTechniqueTe,
    eliminationTechniqueHi: q.eliminationTechniqueHi,
    eliminationHints: [],
    payload: {
      type: 'mcq',
      options: q.options,
      correctOptionId: q.correctOptionId,
    },
  };
}

/**
 * Batch convert an array of legacy questions.
 */
export function legacyBatchToV2(questions: Question[]): QuestionV2[] {
  return questions.map(legacyToV2);
}

/**
 * Extract the correct option ID from any QuestionV2 payload.
 * For true-false: maps boolean → 'tf-true' | 'tf-false'.
 * For all other types: reads payload.correctOptionId directly.
 */
export function getCorrectId(q: QuestionV2): string {
  const p = q.payload;
  if (p.type === 'true-false') {
    return p.correctAnswer ? 'tf-true' : 'tf-false';
  }
  return (p as { correctOptionId: string }).correctOptionId;
}

/**
 * Filter a QuestionV2 array to only include allowed question types.
 */
export function filterByUnlockedTypes(
  questions: QuestionV2[],
  unlockedTypes: QuestionType[],
): QuestionV2[] {
  return questions.filter((q) => unlockedTypes.includes(q.type));
}
