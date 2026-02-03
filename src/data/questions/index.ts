import { Question, QuestionV2, QuestionType, NeetSubjectId } from '../../types';
import { legacyBatchToV2, filterByUnlockedTypes } from '../../lib/questionAdapter';
import { physicsLawsOfMotionQuestions } from './physics-laws-of-motion';
import { physicsThermodynamicsQuestions } from './physics-thermodynamics';
import { chemistryChemicalBondingQuestions } from './chemistry-chemical-bonding';
import { chemistryHydrocarbonsQuestions } from './chemistry-hydrocarbons';
import { botanyCellBiologyQuestions } from './botany-cell-biology';
import { botanyPlantAnatomyQuestions } from './botany-plant-anatomy';
import { zoologyHumanPhysiologyQuestions } from './zoology-human-physiology';
import { zoologyGeneticsQuestions } from './zoology-genetics';
import { sampleV2Questions } from './sample-v2-questions';

// All questions indexed by chapter ID
const questionsByChapter: Record<string, Question[]> = {
  'physics-laws-of-motion': physicsLawsOfMotionQuestions,
  'physics-thermodynamics': physicsThermodynamicsQuestions,
  'chemistry-chemical-bonding': chemistryChemicalBondingQuestions,
  'chemistry-hydrocarbons': chemistryHydrocarbonsQuestions,
  'botany-cell-biology': botanyCellBiologyQuestions,
  'botany-plant-anatomy': botanyPlantAnatomyQuestions,
  'zoology-human-physiology': zoologyHumanPhysiologyQuestions,
  'zoology-genetics': zoologyGeneticsQuestions,
};

// All questions indexed by subject
const questionsBySubject: Record<NeetSubjectId, Question[]> = {
  physics: [...physicsLawsOfMotionQuestions, ...physicsThermodynamicsQuestions],
  chemistry: [...chemistryChemicalBondingQuestions, ...chemistryHydrocarbonsQuestions],
  botany: [...botanyCellBiologyQuestions, ...botanyPlantAnatomyQuestions],
  zoology: [...zoologyHumanPhysiologyQuestions, ...zoologyGeneticsQuestions],
};

/** Get all 25 questions for a specific chapter */
export function getQuestionsByChapter(chapterId: string): Question[] {
  return questionsByChapter[chapterId] ?? [];
}

/** Get all 50 questions for a subject (both chapters combined) */
export function getQuestionsBySubject(subjectId: NeetSubjectId): Question[] {
  return questionsBySubject[subjectId] ?? [];
}

/** Get all 200 questions */
export function getAllQuestions(): Question[] {
  return Object.values(questionsByChapter).flat();
}

/**
 * Build a full NEET Practice Exam question set.
 * Per subject: Section A (35 questions) + Section B (15 questions).
 * Questions are shuffled within each section.
 * Returns { sectionA: Question[], sectionB: Question[] } per subject.
 */
export function buildPracticeExam(): Record<
  NeetSubjectId,
  { sectionA: Question[]; sectionB: Question[] }
> {
  const subjects: NeetSubjectId[] = ['physics', 'chemistry', 'botany', 'zoology'];
  const exam = {} as Record<NeetSubjectId, { sectionA: Question[]; sectionB: Question[] }>;

  for (const subjectId of subjects) {
    const pool = shuffle([...getQuestionsBySubject(subjectId)]);
    exam[subjectId] = {
      sectionA: pool.slice(0, 35),
      sectionB: pool.slice(35, 50),
    };
  }

  return exam;
}

/**
 * Build a 20-question Quick Practice set for a single subject.
 * Picks 20 random questions from the subject pool (across all chapters).
 */
export function buildQuickPractice(subjectId: NeetSubjectId): Question[] {
  const pool = getQuestionsBySubject(subjectId);
  return shuffle([...pool]).slice(0, 20);
}

/** Fisher-Yates shuffle */
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── V2 question getters (legacy MCQ + sample V2 merged) ──

/** Get V2 questions for a chapter, optionally filtered by unlocked types */
export function getV2QuestionsByChapter(
  chapterId: string,
  unlockedTypes?: QuestionType[],
): QuestionV2[] {
  const legacy = legacyBatchToV2(questionsByChapter[chapterId] ?? []);
  const v2 = sampleV2Questions.filter((q) => q.chapterId === chapterId);
  const merged = [...legacy, ...v2];
  return unlockedTypes ? filterByUnlockedTypes(merged, unlockedTypes) : merged;
}

/** Build a V2 quick practice set, optionally filtered by unlocked types */
export function buildV2QuickPractice(
  subjectId: NeetSubjectId,
  unlockedTypes?: QuestionType[],
): QuestionV2[] {
  const legacy = legacyBatchToV2(getQuestionsBySubject(subjectId));
  const v2 = sampleV2Questions.filter((q) => q.subjectId === subjectId);
  let merged = [...legacy, ...v2];
  if (unlockedTypes) {
    merged = filterByUnlockedTypes(merged, unlockedTypes);
  }
  return shuffle(merged).slice(0, 20);
}

// Re-export individual chapter arrays for direct access
export {
  physicsLawsOfMotionQuestions,
  physicsThermodynamicsQuestions,
  chemistryChemicalBondingQuestions,
  chemistryHydrocarbonsQuestions,
  botanyCellBiologyQuestions,
  botanyPlantAnatomyQuestions,
  zoologyHumanPhysiologyQuestions,
  zoologyGeneticsQuestions,
};
