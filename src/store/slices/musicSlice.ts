import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MusicState {
  currentTrackIndex: number | null;
  isPlaying: boolean;
  drawerOpen: boolean;
}

const initialState: MusicState = {
  currentTrackIndex: null,
  isPlaying: false,
  drawerOpen: false,
};

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    setTrack: (state, action: PayloadAction<number>) => {
      state.currentTrackIndex = action.payload;
      state.isPlaying = true;
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    pause: (state) => {
      state.isPlaying = false;
    },
    play: (state) => {
      if (state.currentTrackIndex !== null) {
        state.isPlaying = true;
      }
    },
    skipNext: (state, action: PayloadAction<number>) => {
      // action.payload = total number of tracks
      if (state.currentTrackIndex !== null) {
        state.currentTrackIndex = (state.currentTrackIndex + 1) % action.payload;
        state.isPlaying = true;
      }
    },
    skipPrev: (state, action: PayloadAction<number>) => {
      if (state.currentTrackIndex !== null) {
        state.currentTrackIndex =
          (state.currentTrackIndex - 1 + action.payload) % action.payload;
        state.isPlaying = true;
      }
    },
    openDrawer: (state) => {
      state.drawerOpen = true;
    },
    closeDrawer: (state) => {
      state.drawerOpen = false;
    },
    stopMusic: (state) => {
      state.isPlaying = false;
      state.currentTrackIndex = null;
    },
  },
});

export const {
  setTrack,
  togglePlay,
  pause,
  play,
  skipNext,
  skipPrev,
  openDrawer,
  closeDrawer,
  stopMusic,
} = musicSlice.actions;

export default musicSlice.reducer;
