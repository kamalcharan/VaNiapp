import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SubjectId, WrongAnswerEntry, ConceptEntry } from '../../types';

// ── Types ──

export interface DoubtEntry {
  id: string;
  query: string;
  subjectId: SubjectId;
  response: string;
  relatedConcepts: string[];
  model: 'fast' | 'smart';
  timestamp: string;
}

interface DailyUsage {
  date: string; // YYYY-MM-DD
  doubtSolver: number;
  wrongAnswerAnalysis: number;
  conceptExplainer: number;
}

interface AIState {
  tier: 'free' | 'pro' | 'ai';
  dailyUsage: DailyUsage;
  doubtHistory: DoubtEntry[]; // last 30 for cache + scroll-back
  isLoading: boolean;

  // R10: Cached fallback responses (from Edge Function calls, not bundled data)
  cachedExplanations: WrongAnswerEntry[];  // max 50
  cachedConcepts: ConceptEntry[];          // max 30
}

const todayStr = () => new Date().toISOString().slice(0, 10);

const freshDailyUsage = (date: string): DailyUsage => ({
  date,
  doubtSolver: 0,
  wrongAnswerAnalysis: 0,
  conceptExplainer: 0,
});

const initialState: AIState = {
  tier: 'ai', // default to 'ai' for POC testing
  dailyUsage: freshDailyUsage(todayStr()),
  doubtHistory: [],
  isLoading: false,
  cachedExplanations: [],
  cachedConcepts: [],
};

// ── Slice ──

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setTier: (state, action: PayloadAction<'free' | 'pro' | 'ai'>) => {
      state.tier = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    addDoubtEntry: (state, action: PayloadAction<DoubtEntry>) => {
      state.doubtHistory.unshift(action.payload);
      // keep last 30
      if (state.doubtHistory.length > 30) {
        state.doubtHistory = state.doubtHistory.slice(0, 30);
      }
      // increment usage
      const today = todayStr();
      if (state.dailyUsage.date !== today) {
        state.dailyUsage = { ...freshDailyUsage(today), doubtSolver: 1 };
      } else {
        state.dailyUsage.doubtSolver += 1;
      }
    },

    // R10: Wrong-answer analysis usage
    incrementWrongAnswerUsage: (state) => {
      const today = todayStr();
      if (state.dailyUsage.date !== today) {
        state.dailyUsage = { ...freshDailyUsage(today), wrongAnswerAnalysis: 1 };
      } else {
        state.dailyUsage.wrongAnswerAnalysis += 1;
      }
    },

    // R10: Concept explainer usage
    incrementConceptUsage: (state) => {
      const today = todayStr();
      if (state.dailyUsage.date !== today) {
        state.dailyUsage = { ...freshDailyUsage(today), conceptExplainer: 1 };
      } else {
        state.dailyUsage.conceptExplainer += 1;
      }
    },

    // R10: Cache a wrong-answer explanation from Edge Function fallback
    cacheExplanation: (state, action: PayloadAction<WrongAnswerEntry>) => {
      // avoid duplicates
      const key = `${action.payload.questionId}:${action.payload.selectedOptionId}`;
      const exists = state.cachedExplanations.some(
        (e) => `${e.questionId}:${e.selectedOptionId}` === key
      );
      if (!exists) {
        state.cachedExplanations.unshift(action.payload);
        // cap at 50
        if (state.cachedExplanations.length > 50) {
          state.cachedExplanations = state.cachedExplanations.slice(0, 50);
        }
      }
    },

    // R10: Cache a concept explanation from Edge Function fallback
    cacheConcept: (state, action: PayloadAction<ConceptEntry>) => {
      const exists = state.cachedConcepts.some(
        (c) => c.conceptTag === action.payload.conceptTag
      );
      if (!exists) {
        state.cachedConcepts.unshift(action.payload);
        // cap at 30
        if (state.cachedConcepts.length > 30) {
          state.cachedConcepts = state.cachedConcepts.slice(0, 30);
        }
      }
    },

    resetDailyUsage: (state) => {
      state.dailyUsage = freshDailyUsage(todayStr());
    },

    clearDoubtHistory: (state) => {
      state.doubtHistory = [];
    },

    rehydrate: (_state, action: PayloadAction<AIState>) => {
      const rehydrated = { ...action.payload, isLoading: false };
      // ensure new R10 fields exist after rehydrating old persisted state
      if (!rehydrated.cachedExplanations) rehydrated.cachedExplanations = [];
      if (!rehydrated.cachedConcepts) rehydrated.cachedConcepts = [];
      if (rehydrated.dailyUsage.wrongAnswerAnalysis === undefined) {
        rehydrated.dailyUsage.wrongAnswerAnalysis = 0;
      }
      if (rehydrated.dailyUsage.conceptExplainer === undefined) {
        rehydrated.dailyUsage.conceptExplainer = 0;
      }
      // reset daily usage if stale
      if (rehydrated.dailyUsage.date !== todayStr()) {
        rehydrated.dailyUsage = freshDailyUsage(todayStr());
      }
      return rehydrated;
    },
  },
});

export const {
  setTier,
  setLoading,
  addDoubtEntry,
  incrementWrongAnswerUsage,
  incrementConceptUsage,
  cacheExplanation,
  cacheConcept,
  resetDailyUsage,
  clearDoubtHistory,
} = aiSlice.actions;

export default aiSlice.reducer;
