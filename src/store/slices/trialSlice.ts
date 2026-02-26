import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PlanId } from '../../constants/pricing';

interface TrialState {
  /** ISO date string when the trial started (set from profile.created_at) */
  trialStartedAt: string | null;
  /** Total questions the user has answered across all sessions */
  questionsAnswered: number;
  /** Whether the user has an active paid subscription */
  isPaid: boolean;
  /** Active subscription plan type (null if no subscription) */
  subscriptionPlan: PlanId | null;
  /** ISO date when subscription expires (null = no expiry) */
  subscriptionExpiresAt: string | null;
}

const initialState: TrialState = {
  trialStartedAt: null,
  questionsAnswered: 0,
  isPaid: false,
  subscriptionPlan: null,
  subscriptionExpiresAt: null,
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
    /** Seed from Supabase — takes the higher of local vs remote to prevent regression */
    seedQuestionsAnswered: (state, action: PayloadAction<number>) => {
      state.questionsAnswered = Math.max(state.questionsAnswered, action.payload);
    },
    setPaid: (state, action: PayloadAction<boolean>) => {
      state.isPaid = action.payload;
    },
    setSubscription: (state, action: PayloadAction<{ plan: PlanId; expiresAt: string | null }>) => {
      state.subscriptionPlan = action.payload.plan;
      state.subscriptionExpiresAt = action.payload.expiresAt;
      state.isPaid = true;
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
  seedQuestionsAnswered,
  setPaid,
  setSubscription,
} = trialSlice.actions;

export default trialSlice.reducer;
