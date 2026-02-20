import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StreakState {
  currentStreak: number;   // consecutive correct answers (session-persisted)
  bestStreak: number;      // all-time best streak
  dailyStreak: number;     // days in a row the user has practiced
  lastPracticeDate: string | null;  // ISO date string (YYYY-MM-DD)
}

const initialState: StreakState = {
  currentStreak: 0,
  bestStreak: 0,
  dailyStreak: 0,
  lastPracticeDate: null,
};

const streakSlice = createSlice({
  name: 'streak',
  initialState,
  reducers: {
    incrementStreak(state) {
      state.currentStreak += 1;
      if (state.currentStreak > state.bestStreak) {
        state.bestStreak = state.currentStreak;
      }
    },
    resetStreak(state) {
      state.currentStreak = 0;
    },
    recordDailyPractice(state) {
      const today = new Date().toISOString().slice(0, 10);
      if (state.lastPracticeDate === today) return; // already recorded today

      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (state.lastPracticeDate === yesterday) {
        // Consecutive day
        state.dailyStreak += 1;
      } else if (state.lastPracticeDate !== today) {
        // Streak broken
        state.dailyStreak = 1;
      }
      state.lastPracticeDate = today;
    },
    rehydrate(_state, action: PayloadAction<StreakState>) {
      return action.payload;
    },
  },
});

export const { incrementStreak, resetStreak, recordDailyPractice } = streakSlice.actions;
export default streakSlice.reducer;
