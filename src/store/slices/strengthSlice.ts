import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StrengthLevel, SubjectId } from '../../types';
import { evaluateStrength } from '../../lib/strengthEvaluator';

// ── Types ──

export interface ChapterStrengthData {
  chapterId: string;
  subjectId: string;
  totalInBank: number;
  attemptedIds: string[];
  totalAnswered: number;
  correctCount: number;
  coverage: number;
  accuracy: number;
  strengthLevel: StrengthLevel;
  lastPracticedAt: string | null;
}

interface StrengthState {
  chapters: Record<string, ChapterStrengthData>; // keyed by chapterId
}

const initialState: StrengthState = {
  chapters: {},
};

// ── Slice ──

const strengthSlice = createSlice({
  name: 'strength',
  initialState,
  reducers: {
    /**
     * Record a batch of answers for a chapter.
     * Called after completing a chapter exam or quick practice.
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
      const { chapterId, subjectId, totalInBank, answeredQuestions } = action.payload;

      // Get or create chapter entry
      let ch = state.chapters[chapterId];
      if (!ch) {
        ch = {
          chapterId,
          subjectId,
          totalInBank,
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

      // Record each answer
      for (const aq of answeredQuestions) {
        // Track unique question IDs
        if (!ch.attemptedIds.includes(aq.questionId)) {
          ch.attemptedIds.push(aq.questionId);
        }
        ch.totalAnswered += 1;
        if (aq.correct) {
          ch.correctCount += 1;
        }
      }

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

    rehydrate: (_state, action: PayloadAction<StrengthState>) => {
      return action.payload;
    },
  },
});

export const { recordChapterAttempt } = strengthSlice.actions;
export default strengthSlice.reducer;
