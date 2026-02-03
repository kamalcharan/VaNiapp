import { ConceptEntry, SubjectConcepts } from '../../types';
import { physicsConcepts } from './physics';
import { chemistryConcepts } from './chemistry';
import { botanyConcepts } from './botany';
import { zoologyConcepts } from './zoology';

// ── All subject concepts ──

const allSubjectConcepts: SubjectConcepts[] = [
  physicsConcepts,
  chemistryConcepts,
  botanyConcepts,
  zoologyConcepts,
];

// ── Lookup map: conceptTag → ConceptEntry ──

const conceptMap = new Map<string, ConceptEntry>();

for (const subject of allSubjectConcepts) {
  for (const concept of subject.concepts) {
    conceptMap.set(concept.conceptTag, concept);
  }
}

/**
 * Look up a pre-generated concept explanation by tag.
 * Returns the entry instantly (sync, zero cost) or null if not in the bundle.
 */
export function getConceptByTag(conceptTag: string): ConceptEntry | null {
  return conceptMap.get(conceptTag) ?? null;
}

/** Get all concepts for a specific subject */
export function getConceptsBySubject(subjectId: string): ConceptEntry[] {
  const subject = allSubjectConcepts.find((s) => s.subjectId === subjectId);
  return subject?.concepts ?? [];
}

/** Get all concepts for a specific chapter */
export function getConceptsByChapter(chapterId: string): ConceptEntry[] {
  const results: ConceptEntry[] = [];
  for (const concept of conceptMap.values()) {
    if (concept.chapterId === chapterId) {
      results.push(concept);
    }
  }
  return results;
}

/** Get all available concept tags */
export function getAllConceptTags(): string[] {
  return Array.from(conceptMap.keys());
}

/** Total number of pre-generated concepts in the bundle */
export const totalConceptEntries = conceptMap.size;

// Re-export individual subjects
export {
  physicsConcepts,
  chemistryConcepts,
  botanyConcepts,
  zoologyConcepts,
};
