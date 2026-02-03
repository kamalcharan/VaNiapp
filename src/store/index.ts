import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/authSlice';
import practiceReducer from './slices/practiceSlice';
import musicReducer from './slices/musicSlice';
import focusReducer from './slices/focusSlice';
import squadReducer from './slices/squadSlice';
import aiReducer from './slices/aiSlice';
import strengthReducer from './slices/strengthSlice';
import bookmarkReducer from './slices/bookmarkSlice';

const PERSIST_KEY = 'vani-persist';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    practice: practiceReducer,
    music: musicReducer,
    focus: focusReducer,
    squad: squadReducer,
    ai: aiReducer,
    strength: strengthReducer,
    bookmark: bookmarkReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ── Lightweight persistence (auth + practice only) ──────────────
// Saves to AsyncStorage on every state change, rehydrates on app start.

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

store.subscribe(() => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    const { auth, practice, squad, ai, strength, bookmark } = store.getState();
    AsyncStorage.setItem(PERSIST_KEY, JSON.stringify({ auth, practice, squad, ai, strength, bookmark })).catch(
      () => {}
    );
  }, 500); // debounce 500ms
});

export async function rehydrateStore(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(PERSIST_KEY);
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
  } catch {
    // storage read failed — start fresh
  }
}
