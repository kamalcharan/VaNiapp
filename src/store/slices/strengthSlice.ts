import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StrengthLevel, SubjectId } from '../../types';
import { evaluateStrength } from '../../lib/strengthEvaluator';
import { LEGACY_CHAPTER_MAP } from '../../lib/questionAdapter';

// ── Types ──

export interface ChapterStrengthData {
  chapterId: string;
  subjectId: string;
  totalInBank: number;
  /** Map of questionId → true (correct) / false (wrong) — latest attempt wins */
  questionResults: Record<string, boolean>;
  coverage: number;
  accuracy: number;
  strengthLevel: StrengthLevel;
  lastPracticedAt: string | null;

  // Derived (kept for backward compat with progressSync / display)
  attemptedIds: string[];
  totalAnswered: number;
  correctCount: number;
}

interface StrengthState {
  chapters: Record<string, ChapterStrengthData>; // keyed by chapterId
}

const initialState: StrengthState = {
  chapters: {},
};

/** Derive counts from questionResults map */
function deriveFromResults(results: Record<string, boolean>) {
  const ids = Object.keys(results);
  const correct = ids.filter((id) => results[id]).length;
  return { attemptedIds: ids, totalAnswered: ids.length, correctCount: correct };
}

// ── Slice ──

const strengthSlice = createSlice({
  name: 'strength',
  initialState,
  reducers: {
    /**
     * Record a batch of answers for a chapter.
     * Called after completing a chapter exam or quick practice.
     * Latest attempt per question wins — re-answering a question updates the result.
     */
    recordChapterAttempt: (
      state,
      action: PayloadAction<{
        chapterId: string;
        subjectId: string;
        totalInBank: number;
        answeredQuestions: { questionId: string; correct: boolean }[];
      }>
    ) => {
      const { subjectId, totalInBank, answeredQuestions } = action.payload;
      // Always resolve legacy chapter IDs to DB IDs
      const chapterId = LEGACY_CHAPTER_MAP[action.payload.chapterId] ?? action.payload.chapterId;

      // Get or create chapter entry
      let ch = state.chapters[chapterId];
      if (!ch) {
        ch = {
          chapterId,
          subjectId,
          totalInBank,
          questionResults: {},
          attemptedIds: [],
          totalAnswered: 0,
          correctCount: 0,
          coverage: 0,
          accuracy: 0,
          strengthLevel: 'just-started',
          lastPracticedAt: null,
        };
        state.chapters[chapterId] = ch;
      }

      // Update totalInBank in case it changed
      ch.totalInBank = totalInBank;

      // Migrate: if old data had attemptedIds but no questionResults, seed from them
      if (!ch.questionResults || Object.keys(ch.questionResults).length === 0) {
        ch.questionResults = {};
      }

      // Record each answer — latest attempt wins
      for (const aq of answeredQuestions) {
        ch.questionResults[aq.questionId] = aq.correct;
      }

      // Derive counts from the results map
      const derived = deriveFromResults(ch.questionResults);
      ch.attemptedIds = derived.attemptedIds;
      ch.totalAnswered = derived.totalAnswered;
      ch.correctCount = derived.correctCount;

      // Recompute strength
      const result = evaluateStrength({
        totalInBank: ch.totalInBank,
        uniqueAttempted: ch.attemptedIds.length,
        totalAnswered: ch.totalAnswered,
        correctCount: ch.correctCount,
      });

      ch.coverage = result.coverage;
      ch.accuracy = result.accuracy;

      // No demotion: only upgrade strength level (except needs-focus which is a flag)
      if (result.level === 'needs-focus') {
        ch.strengthLevel = result.level;
      } else {
        const levelOrder: StrengthLevel[] = ['just-started', 'getting-there', 'on-track', 'strong'];
        const currentIdx = levelOrder.indexOf(ch.strengthLevel === 'needs-focus' ? 'just-started' : ch.strengthLevel);
        const newIdx = levelOrder.indexOf(result.level);
        if (newIdx >= currentIdx) {
          ch.strengthLevel = result.level;
        }
        // If was needs-focus but accuracy improved above threshold, allow upgrade
        if (ch.strengthLevel === 'needs-focus') {
          ch.strengthLevel = result.level;
        }
      }

      ch.lastPracticedAt = new Date().toISOString();
    },

    /**
     * Migrate legacy chapter IDs when rehydrating from persisted state.
     * Moves strength data from old keys (e.g., 'zoology-human-physiology')
     * to new DB keys (e.g., 'zoo-body-fluids') so history isn't lost.
     */
    rehydrate: (_state, action: PayloadAction<StrengthState>) => {
      const incoming = action.payload;
      const migrated: Record<string, ChapterStrengthData> = {};

      for (const [key, rawData] of Object.entries(incoming.chapters)) {
        const newKey = LEGACY_CHAPTER_MAP[key] ?? key;

        // Deep-clone to avoid mutating frozen Immer state from Redux
        const data: ChapterStrengthData = {
          ...rawData,
          questionResults: { ...(rawData.questionResults ?? {}) },
          attemptedIds: [...(rawData.attemptedIds ?? [])],
        };

        // Migrate old format: if questionResults is empty, build from attemptedIds
        if (Object.keys(data.questionResults).length === 0 && data.attemptedIds.length > 0) {
          // Best guess: distribute correctCount across attemptedIds
          // (can't know which specific questions were correct from old data)
          const correctCount = data.correctCount ?? 0;
          for (let i = 0; i < data.attemptedIds.length; i++) {
            data.questionResults[data.attemptedIds[i]] = i < correctCount;
          }
        }

        if (newKey !== key && migrated[newKey]) {
          // Merge old data into existing new-key entry
          const existing = migrated[newKey];
          // Merge questionResults — incoming overwrites existing for same IDs
          for (const [qid, result] of Object.entries(data.questionResults)) {
            existing.questionResults[qid] = result;
          }
          existing.totalInBank = Math.max(existing.totalInBank, data.totalInBank);
          // Recompute derived
          const derived = deriveFromResults(existing.questionResults);
          existing.attemptedIds = derived.attemptedIds;
          existing.totalAnswered = derived.totalAnswered;
          existing.correctCount = derived.correctCount;
          const result = evaluateStrength({
            totalInBank: existing.totalInBank,
            uniqueAttempted: existing.attemptedIds.length,
            totalAnswered: existing.totalAnswered,
            correctCount: existing.correctCount,
          });
          existing.coverage = result.coverage;
          existing.accuracy = result.accuracy;
          existing.strengthLevel = result.level;
        } else {
          // Recompute derived from questionResults
          const derived = deriveFromResults(data.questionResults);
          migrated[newKey] = {
            ...data,
            chapterId: newKey,
            attemptedIds: derived.attemptedIds,
            totalAnswered: derived.totalAnswered,
            correctCount: derived.correctCount,
          };
        }
      }

      return { chapters: migrated };
    },
  },
});

export const { recordChapterAttempt } = strengthSlice.actions;
export default strengthSlice.reducer;
