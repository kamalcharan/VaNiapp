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
  // Compact pill mode on every screen where the user is actively answering
  // questions — full bar at bottom: 110 floats over answer content and the
  // bottom-bar buttons (Back / Next / Skip), so we shrink it to the top-left
  // pill there. The original (exam) route group was never created, so the
  // earlier check was effectively dead.
  const isExamScreen =
    segments.includes('(exam)' as never) ||
    segments.includes('chapter' as never) ||
    segments.includes('practice-exam' as never) ||
    segments.includes('quick-practice' as never) ||
    segments.includes('practice-mistakes' as never);

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
