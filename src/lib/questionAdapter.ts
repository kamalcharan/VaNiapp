import { Question, QuestionV2, QuestionType } from '../types';

/**
 * Convert a legacy Question (MCQ-only) to the QuestionV2 format.
 * This allows existing question data to work with the new type system
 * without modifying the question bank files.
 */
export function legacyToV2(q: Question): QuestionV2 {
  return {
    id: q.id,
    type: 'mcq',
    chapterId: q.chapterId,
    subjectId: q.subjectId,
    difficulty: q.difficulty,
    text: q.text,
    textTe: q.textTe,
    explanation: q.explanation,
    explanationTe: q.explanationTe,
    eliminationTechnique: q.eliminationTechnique,
    eliminationTechniqueTe: q.eliminationTechniqueTe,
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
