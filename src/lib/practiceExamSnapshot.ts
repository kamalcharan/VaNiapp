import { QuestionV2 } from '../types';

/**
 * Holds the question set the user just submitted in Practice Exam, so the
 * results screen can do its analytics enrichment (chapter/difficulty/type
 * breakdowns) without a re-fetch. Module-level on purpose: survives the
 * navigation, gets overwritten on the next attempt.
 *
 * Lifecycle: quiz screen calls setSnapshot(...) before navigating to
 * /practice-results; results screen calls getSnapshot() once on mount.
 */

interface Snapshot {
  sessionId: string;
  questions: QuestionV2[];
}

let snapshot: Snapshot | null = null;

export function setPracticeExamSnapshot(sessionId: string, questions: QuestionV2[]): void {
  snapshot = { sessionId, questions };
}

export function getPracticeExamSnapshot(): Snapshot | null {
  return snapshot;
}

export function clearPracticeExamSnapshot(): void {
  snapshot = null;
}
