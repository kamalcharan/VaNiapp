import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FocusState {
  /** Number of times user switched away from the app during practice */
  switchCount: number;
  /** Whether focus tracking is currently active */
  isTracking: boolean;
  /** ISO timestamp when tracking started */
  startedAt: string | null;
}

const initialState: FocusState = {
  switchCount: 0,
  isTracking: false,
  startedAt: null,
};

const focusSlice = createSlice({
  name: 'focus',
  initialState,
  reducers: {
    startTracking: (state) => {
      state.isTracking = true;
      state.switchCount = 0;
      state.startedAt = new Date().toISOString();
    },
    recordSwitch: (state) => {
      if (state.isTracking) {
        state.switchCount++;
      }
    },
    stopTracking: (state) => {
      state.isTracking = false;
    },
    resetFocus: (state) => {
      state.switchCount = 0;
      state.isTracking = false;
      state.startedAt = null;
    },
  },
});

export const { startTracking, recordSwitch, stopTracking, resetFocus } = focusSlice.actions;

export default focusSlice.reducer;
