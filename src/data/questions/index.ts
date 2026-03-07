import { Question, QuestionV2, QuestionType, NeetSubjectId, L } from '../../types';
import { legacyBatchToV2, filterByUnlockedTypes } from '../../lib/questionAdapter';
import { physicsLawsOfMotionQuestions } from './physics-laws-of-motion';
import { physicsThermodynamicsQuestions } from './physics-thermodynamics';
import { chemistryChemicalBondingQuestions } from './chemistry-chemical-bonding';
import { chemistryHydrocarbonsQuestions } from './chemistry-hydrocarbons';
import { botanyCellBiologyQuestions } from './botany-cell-biology';
import { botanyPlantAnatomyQuestions } from './botany-plant-anatomy';
import { zoologyHumanPhysiologyQuestions } from './zoology-human-physiology';
import { zoologyGeneticsQuestions } from './zoology-genetics';
import { sampleV2Questions as rawSampleV2 } from './sample-v2-questions';

// Convert legacy per-language string fields to L maps at runtime
function toL(en: unknown, te?: unknown, hi?: unknown): L {
  const r: L = { en: String(en ?? '') };
  if (te) r.te = String(te);
  if (hi) r.hi = String(hi);
  return r;
}

function convertSampleV2(raw: any[]): QuestionV2[] {
  return raw.map((q): QuestionV2 => {
    const p = { ...q.payload };
    if (p.statement !== undefined) { p.statement = toL(p.statement, p.statementTe, p.statementHi); delete p.statementTe; delete p.statementHi; }
    if (p.assertion !== undefined) { p.assertion = toL(p.assertion, p.assertionTe, p.assertionHi); p.reason = toL(p.reason, p.reasonTe, p.reasonHi); delete p.assertionTe; delete p.assertionHi; delete p.reasonTe; delete p.reasonHi; }
    if (p.scenario !== undefined) { p.scenario = toL(p.scenario, p.scenarioTe, p.scenarioHi); delete p.scenarioTe; delete p.scenarioHi; }
    if (p.textWithBlanks !== undefined) { p.textWithBlanks = toL(p.textWithBlanks, p.textWithBlanksTe, p.textWithBlanksHi); delete p.textWithBlanksTe; delete p.textWithBlanksHi; }
    if (p.options) p.options = p.options.map((o: any) => ({ id: o.id, text: toL(o.text, o.textTe, o.textHi) }));
    if (p.columnA) p.columnA = p.columnA.map((c: any) => ({ id: c.id, text: toL(c.text, c.textTe, c.textHi) }));
    if (p.columnB) p.columnB = p.columnB.map((c: any) => ({ id: c.id, text: toL(c.text, c.textTe, c.textHi) }));
    if (p.items) p.items = p.items.map((c: any) => ({ id: c.id, text: toL(c.text, c.textTe, c.textHi) }));
    return { ...q, text: toL(q.text, q.textTe, q.textHi), explanation: toL(q.explanation, q.explanationTe, q.explanationHi), eliminationTechnique: toL(q.eliminationTechnique, q.eliminationTechniqueTe, q.eliminationTechniqueHi), topicName: q.topicName ? toL(q.topicName, q.topicNameTe, q.topicNameHi) : undefined, payload: p };
  });
}

const sampleV2Questions = convertSampleV2(rawSampleV2);

// All questions indexed by chapter ID (DB med_chapters IDs)
const questionsByChapter: Record<string, Question[]> = {
  'phy-laws-of-motion': physicsLawsOfMotionQuestions,
  'phy-thermodynamics': physicsThermodynamicsQuestions,
  'chem-chemical-bonding': chemistryChemicalBondingQuestions,
  'chem-hydrocarbons': chemistryHydrocarbonsQuestions,
  'bot-cell-unit': botanyCellBiologyQuestions,
  'bot-anatomy-flowering': botanyPlantAnatomyQuestions,
  'zoo-body-fluids': zoologyHumanPhysiologyQuestions,
  'zoo-evolution': zoologyGeneticsQuestions,
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

/** Look up V2 questions by their IDs (for bookmarks, weak-topic drill, etc.) */
export function getV2QuestionsByIds(ids: string[]): QuestionV2[] {
  if (ids.length === 0) return [];
  const idSet = new Set(ids);
  const allLegacy = legacyBatchToV2(Object.values(questionsByChapter).flat());
  const all = [...allLegacy, ...sampleV2Questions];
  return all.filter((q) => idSet.has(q.id));
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
