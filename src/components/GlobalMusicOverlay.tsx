import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSegments } from 'expo-router';
import { RootState } from '../store';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { openDrawer, closeDrawer } from '../store/slices/musicSlice';
import { MiniPlayer } from './MiniPlayer';
import { MusicDrawer } from './MusicDrawer';

/**
 * Global music overlay — renders MiniPlayer + MusicDrawer at root level
 * so music is accessible from every screen in the app.
 * On exam screens the player switches to a compact top-right pill
 * so it never blocks scroll content or bottom navigation.
 */
export function GlobalMusicOverlay() {
  const dispatch = useDispatch();
  const drawerOpen = useSelector((state: RootState) => state.music.drawerOpen);
  const currentTrackIndex = useSelector((state: RootState) => state.music.currentTrackIndex);
  const audio = useAudioPlayer();
  const segments = useSegments();
  const isExamScreen = segments.includes('(exam)' as never);

  return (
    <>
      <MiniPlayer
        track={audio.currentTrack}
        isPlaying={audio.isPlaying}
        onTogglePlay={audio.togglePlay}
        onSkipNext={audio.skipNext}
        onOpenDrawer={() => dispatch(openDrawer())}
        compact={isExamScreen}
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
