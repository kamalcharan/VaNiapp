import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookmarkState {
  ids: string[]; // bookmarked question IDs
}

const initialState: BookmarkState = {
  ids: [],
};

const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState,
  reducers: {
    toggleBookmark(state, action: PayloadAction<string>) {
      const idx = state.ids.indexOf(action.payload);
      if (idx >= 0) {
        state.ids.splice(idx, 1);
      } else {
        state.ids.push(action.payload);
      }
    },
    removeBookmark(state, action: PayloadAction<string>) {
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
    clearBookmarks(state) {
      state.ids = [];
    },
    rehydrate(_state, action: PayloadAction<BookmarkState>) {
      return action.payload;
    },
  },
});

export const { toggleBookmark, removeBookmark, clearBookmarks } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
