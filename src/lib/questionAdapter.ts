import { Question, QuestionV2 } from '../types';

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
