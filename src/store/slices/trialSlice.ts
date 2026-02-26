import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TrialState {
  /** ISO date string when the trial started (set from profile.created_at) */
  trialStartedAt: string | null;
  /** Total questions the user has answered across all sessions */
  questionsAnswered: number;
  /** Whether the user has an active paid subscription */
  isPaid: boolean;
}

const initialState: TrialState = {
  trialStartedAt: null,
  questionsAnswered: 0,
  isPaid: false,
};

export const TRIAL_DAYS = 3;
export const TRIAL_QUESTION_LIMIT = 50;

const trialSlice = createSlice({
  name: 'trial',
  initialState,
  reducers: {
    setTrialStart: (state, action: PayloadAction<string>) => {
      if (!state.trialStartedAt) {
        state.trialStartedAt = action.payload;
      }
    },
    incrementQuestionsAnswered: (state) => {
      state.questionsAnswered += 1;
    },
    setPaid: (state, action: PayloadAction<boolean>) => {
      state.isPaid = action.payload;
    },
    rehydrate: (_state, action: PayloadAction<TrialState>) => ({
      ...initialState,
      ...action.payload,
    }),
  },
});

export const {
  setTrialStart,
  incrementQuestionsAnswered,
  setPaid,
} = trialSlice.actions;

export default trialSlice.reducer;
