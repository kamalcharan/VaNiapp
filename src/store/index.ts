import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import practiceReducer from './slices/practiceSlice';
import musicReducer from './slices/musicSlice';
import focusReducer from './slices/focusSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    practice: practiceReducer,
    music: musicReducer,
    focus: focusReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
