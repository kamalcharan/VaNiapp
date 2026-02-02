import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/authSlice';
import practiceReducer from './slices/practiceSlice';
import musicReducer from './slices/musicSlice';
import focusReducer from './slices/focusSlice';

const persistConfig = {
  key: 'vani-root',
  storage: AsyncStorage,
  whitelist: ['auth', 'practice'], // persist user profile + exam history
};

const rootReducer = combineReducers({
  auth: authReducer,
  practice: practiceReducer,
  music: musicReducer,
  focus: focusReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// persistStore activates rehydration automatically — no PersistGate needed
// because our splash screen already covers the brief loading window.
persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
