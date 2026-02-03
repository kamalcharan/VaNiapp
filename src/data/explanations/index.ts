import { ChapterExplanations, WrongAnswerEntry } from '../../types';
import { physicsLawsOfMotionExplanations } from './physics-laws-of-motion';
import { physicsThermodynamicsExplanations } from './physics-thermodynamics';
import { chemistryChemicalBondingExplanations } from './chemistry-chemical-bonding';
import { chemistryHydrocarbonsExplanations } from './chemistry-hydrocarbons';
import { botanyCellBiologyExplanations } from './botany-cell-biology';
import { botanyPlantAnatomyExplanations } from './botany-plant-anatomy';
import { zoologyHumanPhysiologyExplanations } from './zoology-human-physiology';
import { zoologyGeneticsExplanations } from './zoology-genetics';

// ── All chapter explanations ──

const allChapterExplanations: ChapterExplanations[] = [
  physicsLawsOfMotionExplanations,
  physicsThermodynamicsExplanations,
  chemistryChemicalBondingExplanations,
  chemistryHydrocarbonsExplanations,
  botanyCellBiologyExplanations,
  botanyPlantAnatomyExplanations,
  zoologyHumanPhysiologyExplanations,
  zoologyGeneticsExplanations,
];

// ── Lookup map: "questionId:selectedOptionId" → WrongAnswerEntry ──

type LookupKey = string; // "phy-lom-001:a"

const explanationMap = new Map<LookupKey, WrongAnswerEntry>();

for (const chapter of allChapterExplanations) {
  for (const entry of chapter.entries) {
    const key = `${entry.questionId}:${entry.selectedOptionId}`;
    explanationMap.set(key, entry);
  }
}

/**
 * Look up a pre-generated wrong-answer analysis.
 * Returns the entry instantly (sync, zero cost) or null if not in the bundle.
 */
export function getWrongAnswerExplanation(
  questionId: string,
  selectedOptionId: string,
): WrongAnswerEntry | null {
  return explanationMap.get(`${questionId}:${selectedOptionId}`) ?? null;
}

/** Get all wrong-answer entries for a specific question (up to 3) */
export function getWrongAnswerEntriesForQuestion(
  questionId: string,
): WrongAnswerEntry[] {
  const results: WrongAnswerEntry[] = [];
  for (const [key, entry] of explanationMap) {
    if (key.startsWith(`${questionId}:`)) {
      results.push(entry);
    }
  }
  return results;
}

/** Get all explanations for a chapter */
export function getChapterExplanations(chapterId: string): ChapterExplanations | null {
  return allChapterExplanations.find((c) => c.chapterId === chapterId) ?? null;
}

/** Total number of pre-generated entries in the bundle */
export const totalExplanationEntries = explanationMap.size;

// Re-export individual chapters
export {
  physicsLawsOfMotionExplanations,
  physicsThermodynamicsExplanations,
  chemistryChemicalBondingExplanations,
  chemistryHydrocarbonsExplanations,
  botanyCellBiologyExplanations,
  botanyPlantAnatomyExplanations,
  zoologyHumanPhysiologyExplanations,
  zoologyGeneticsExplanations,
};
