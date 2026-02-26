import { useEffect, useRef, useCallback } from 'react';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { TRACKS } from '../constants/tracks';
import { pause, play, setTrack, skipNext, skipPrev, stopMusic } from '../store/slices/musicSlice';

/**
 * Hook that manages expo-audio playback based on Redux music state.
 * Call this once in a screen that needs music playback (e.g. practice-question).
 *
 * Uses a single persistent AudioPlayer and swaps tracks via replace().
 */
export function useAudioPlayer() {
  const dispatch = useDispatch();
  const { currentTrackIndex, isPlaying } = useSelector((state: RootState) => state.music);
  const playerRef = useRef<AudioPlayer | null>(null);
  const loadedTrackIndex = useRef<number | null>(null);
  // Guard against stale async callbacks after rapid skips
  const loadIdRef = useRef(0);

  // Create one persistent player and configure audio session
  useEffect(() => {
    // Note: interruptionMode is omitted — it crashes on Android due to a
    // known expo-audio bug (expo/expo#34025). The default behaviour (mix)
    // is fine for background lo-fi music.
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
    });

    const player = createAudioPlayer();
    player.loop = true;
    player.volume = 0.5;
    playerRef.current = player;

    return () => {
      player.remove();
      playerRef.current = null;
    };
  }, []);

  // Load track via replace() when index changes
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    if (currentTrackIndex === null) {
      player.pause();
      loadedTrackIndex.current = null;
      return;
    }

    const track = TRACKS[currentTrackIndex];
    if (!track) return;

    // Bump load id so any in-flight replace() for a previous track is ignored
    const thisLoadId = ++loadIdRef.current;

    player.pause();
    loadedTrackIndex.current = null;

    player.replace({ uri: track.uri }).then(() => {
      // Stale — user already skipped to another track
      if (loadIdRef.current !== thisLoadId) return;

      loadedTrackIndex.current = currentTrackIndex;
      if (isPlaying) {
        player.play();
      }
    }).catch(() => {
      if (loadIdRef.current !== thisLoadId) return;
      console.warn(`Failed to load track: ${track.title}`);
    });
  }, [currentTrackIndex]);

  // Play / pause when isPlaying changes (but track stays the same)
  useEffect(() => {
    const player = playerRef.current;
    if (!player || loadedTrackIndex.current !== currentTrackIndex) return;

    if (isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTogglePlay = useCallback(() => {
    if (currentTrackIndex === null) {
      dispatch(setTrack(0));
    } else if (isPlaying) {
      dispatch(pause());
    } else {
      dispatch(play());
    }
  }, [currentTrackIndex, isPlaying, dispatch]);

  const handleSkipNext = useCallback(() => {
    dispatch(skipNext(TRACKS.length));
  }, [dispatch]);

  const handleSkipPrev = useCallback(() => {
    dispatch(skipPrev(TRACKS.length));
  }, [dispatch]);

  const handleSelectTrack = useCallback(
    (index: number) => {
      dispatch(setTrack(index));
    },
    [dispatch]
  );

  const handleStop = useCallback(() => {
    dispatch(stopMusic());
  }, [dispatch]);

  return {
    currentTrack: currentTrackIndex !== null ? TRACKS[currentTrackIndex] : null,
    isPlaying,
    togglePlay: handleTogglePlay,
    skipNext: handleSkipNext,
    skipPrev: handleSkipPrev,
    selectTrack: handleSelectTrack,
    stop: handleStop,
  };
}
