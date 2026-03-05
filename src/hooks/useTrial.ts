import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { TRIAL_DAYS, TRIAL_QUESTION_LIMIT } from '../store/slices/trialSlice';
import type { PlanId } from '../constants/pricing';

export interface TrialStatus {
  /** Whether the user can start a new practice session */
  canPractice: boolean;
  /** Whether the user has paid (bypasses trial) */
  isPaid: boolean;
  /** Whether the time-based trial has expired */
  trialExpired: boolean;
  /** Whether the question limit has been reached */
  questionLimitReached: boolean;
  /** Days remaining in the trial (0 if expired) */
  daysLeft: number;
  /** Questions remaining before limit (0 if reached) */
  questionsLeft: number;
  /** Total questions answered so far */
  questionsAnswered: number;
  /** Active subscription plan (null if none) */
  subscriptionPlan: PlanId | null;
  /** ISO date when subscription expires */
  subscriptionExpiresAt: string | null;
}

/**
 * Returns the current trial status.
 * A user can practice if they're paid, or if both:
 *   1. Less than TRIAL_DAYS since trial started
 *   2. Less than TRIAL_QUESTION_LIMIT questions answered
 */
export function useTrial(): TrialStatus {
  const {
    trialStartedAt,
    questionsAnswered,
    isPaid,
    subscriptionPlan,
    subscriptionExpiresAt,
  } = useSelector((state: RootState) => state.trial);

  // Live-check: if subscription has expired mid-session, treat as unpaid
  const subscriptionExpired = isPaid && subscriptionExpiresAt
    ? new Date(subscriptionExpiresAt) < new Date()
    : false;

  if (isPaid && !subscriptionExpired) {
    return {
      canPractice: true,
      isPaid: true,
      trialExpired: false,
      questionLimitReached: false,
      daysLeft: Infinity,
      questionsLeft: Infinity,
      questionsAnswered,
      subscriptionPlan,
      subscriptionExpiresAt,
    };
  }

  // Calculate days since trial started
  let daysElapsed = 0;
  if (trialStartedAt) {
    const start = new Date(trialStartedAt).getTime();
    const now = Date.now();
    daysElapsed = (now - start) / (1000 * 60 * 60 * 24);
  }

  const trialExpired = daysElapsed >= TRIAL_DAYS;
  const questionLimitReached = questionsAnswered >= TRIAL_QUESTION_LIMIT;
  const daysLeft = Math.max(0, Math.ceil(TRIAL_DAYS - daysElapsed));
  const questionsLeft = Math.max(0, TRIAL_QUESTION_LIMIT - questionsAnswered);

  return {
    canPractice: !trialExpired && !questionLimitReached,
    isPaid: false,
    trialExpired,
    questionLimitReached,
    daysLeft,
    questionsLeft,
    questionsAnswered,
    subscriptionPlan: null,
    subscriptionExpiresAt: null,
  };
}
