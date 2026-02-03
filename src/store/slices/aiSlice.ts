import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SubjectId } from '../../types';

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
}

interface AIState {
  tier: 'free' | 'pro' | 'ai';
  dailyUsage: DailyUsage;
  doubtHistory: DoubtEntry[]; // last 30 for cache + scroll-back
  isLoading: boolean;
}

const todayStr = () => new Date().toISOString().slice(0, 10);

const initialState: AIState = {
  tier: 'ai', // default to 'ai' for POC testing
  dailyUsage: { date: todayStr(), doubtSolver: 0 },
  doubtHistory: [],
  isLoading: false,
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
        state.dailyUsage = { date: today, doubtSolver: 1 };
      } else {
        state.dailyUsage.doubtSolver += 1;
      }
    },

    resetDailyUsage: (state) => {
      state.dailyUsage = { date: todayStr(), doubtSolver: 0 };
    },

    clearDoubtHistory: (state) => {
      state.doubtHistory = [];
    },

    rehydrate: (_state, action: PayloadAction<AIState>) => {
      const rehydrated = { ...action.payload, isLoading: false };
      // reset daily usage if stale
      if (rehydrated.dailyUsage.date !== todayStr()) {
        rehydrated.dailyUsage = { date: todayStr(), doubtSolver: 0 };
      }
      return rehydrated;
    },
  },
});

export const {
  setTier,
  setLoading,
  addDoubtEntry,
  resetDailyUsage,
  clearDoubtHistory,
} = aiSlice.actions;

export default aiSlice.reducer;
