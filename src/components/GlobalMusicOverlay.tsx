import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { openDrawer, closeDrawer } from '../store/slices/musicSlice';
import { MiniPlayer } from './MiniPlayer';
import { MusicDrawer } from './MusicDrawer';

/**
 * Global music overlay — renders MiniPlayer + MusicDrawer at root level
 * so music is accessible from every screen in the app.
 */
export function GlobalMusicOverlay() {
  const dispatch = useDispatch();
  const drawerOpen = useSelector((state: RootState) => state.music.drawerOpen);
  const currentTrackIndex = useSelector((state: RootState) => state.music.currentTrackIndex);
  const audio = useAudioPlayer();

  return (
    <>
      <MiniPlayer
        track={audio.currentTrack}
        isPlaying={audio.isPlaying}
        onTogglePlay={audio.togglePlay}
        onSkipNext={audio.skipNext}
        onOpenDrawer={() => dispatch(openDrawer())}
      />

      <MusicDrawer
        visible={drawerOpen}
        currentTrackIndex={currentTrackIndex}
        isPlaying={audio.isPlaying}
        onSelectTrack={audio.selectTrack}
        onTogglePlay={audio.togglePlay}
        onClose={() => dispatch(closeDrawer())}
        onStop={audio.stop}
      />
    </>
  );
}
