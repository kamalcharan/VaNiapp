import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/authSlice';
import practiceReducer from './slices/practiceSlice';
import musicReducer from './slices/musicSlice';
import focusReducer from './slices/focusSlice';
import squadReducer from './slices/squadSlice';
import aiReducer from './slices/aiSlice';
import strengthReducer from './slices/strengthSlice';
import bookmarkReducer from './slices/bookmarkSlice';
import streakReducer from './slices/streakSlice';
import trialReducer, { incrementQuestionsAnswered } from './slices/trialSlice';

// ── Per-user persistence ─────────────────────────────────────
const PERSIST_PREFIX = 'vani-persist';
const LEGACY_PERSIST_KEY = 'vani-persist'; // old global key to clean up
let _currentUserId: string | null = null;

function persistKey(userId: string): string {
  return `${PERSIST_PREFIX}-${userId}`;
}

// ── Resettable root reducer ──────────────────────────────────
// Dispatching RESET_ALL resets every slice to initial state.
export const RESET_ALL = 'store/RESET_ALL';

const appReducer = combineReducers({
  auth: authReducer,
  practice: practiceReducer,
  music: musicReducer,
  focus: focusReducer,
  squad: squadReducer,
  ai: aiReducer,
  strength: strengthReducer,
  bookmark: bookmarkReducer,
  streak: streakReducer,
  trial: trialReducer,
});

const rootReducer: typeof appReducer = (state, action) => {
  if (action.type === RESET_ALL) {
    // Return undefined to let each slice use its own initialState
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

// Middleware: auto-increment trial question counter when a question is answered
const trialMiddleware: import('@reduxjs/toolkit').Middleware = (storeApi) => (next) => (action: any) => {
  const result = next(action);
  if (action.type === 'practice/updateAnswer' && action.payload?.selectedOptionId) {
    storeApi.dispatch(incrementQuestionsAnswered());
  }
  return result;
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(trialMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ── Per-user persistence — save ──────────────────────────────
// Only saves when a user is active. Data is keyed per user ID.

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

store.subscribe(() => {
  if (!_currentUserId) return; // Don't persist if no user
  const userId = _currentUserId;

  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    const { auth, practice, squad, ai, strength, bookmark, streak, trial } = store.getState();
    AsyncStorage.setItem(
      persistKey(userId),
      JSON.stringify({ auth, practice, squad, ai, strength, bookmark, streak, trial }),
    ).catch(() => {});
  }, 500);
});

// ── Per-user persistence — load ──────────────────────────────

/**
 * Rehydrate Redux from the user's persisted data.
 * Call this AFTER authenticating so we know which user ID to load.
 */
export async function rehydrateStore(userId: string): Promise<void> {
  _currentUserId = userId;

  // Clean up legacy global key (one-time migration)
  AsyncStorage.removeItem(LEGACY_PERSIST_KEY).catch(() => {});

  try {
    const raw = await AsyncStorage.getItem(persistKey(userId));
    if (!raw) return;
    const saved = JSON.parse(raw) as Partial<RootState>;
    if (saved.auth) {
      store.dispatch({ type: 'auth/rehydrate', payload: saved.auth });
    }
    if (saved.practice) {
      store.dispatch({ type: 'practice/rehydrate', payload: saved.practice });
    }
    if (saved.squad) {
      store.dispatch({ type: 'squad/rehydrate', payload: saved.squad });
    }
    if (saved.ai) {
      store.dispatch({ type: 'ai/rehydrate', payload: saved.ai });
    }
    if (saved.strength) {
      store.dispatch({ type: 'strength/rehydrate', payload: saved.strength });
    }
    if (saved.bookmark) {
      store.dispatch({ type: 'bookmark/rehydrate', payload: saved.bookmark });
    }
    if (saved.streak) {
      store.dispatch({ type: 'streak/rehydrate', payload: saved.streak });
    }
    if ((saved as any).trial) {
      store.dispatch({ type: 'trial/rehydrate', payload: (saved as any).trial });
    }
  } catch {
    // storage read failed — start fresh
  }
}

/**
 * Reset all Redux state and stop persisting.
 * Call this on sign-out to ensure the next user starts clean.
 */
export function resetAllData(): void {
  // Cancel any pending save
  if (saveTimeout) {
    clearTimeout(saveTimeout);
    saveTimeout = null;
  }
  _currentUserId = null;
  store.dispatch({ type: RESET_ALL });
}
