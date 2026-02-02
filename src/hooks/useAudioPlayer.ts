import { useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { TRACKS } from '../constants/tracks';
import { pause, play, setTrack, skipNext, skipPrev, stopMusic } from '../store/slices/musicSlice';

/**
 * Hook that manages expo-av Audio.Sound playback based on Redux music state.
 * Call this once in a screen that needs music playback (e.g. practice-question).
 */
export function useAudioPlayer() {
  const dispatch = useDispatch();
  const { currentTrackIndex, isPlaying } = useSelector((state: RootState) => state.music);
  const soundRef = useRef<Audio.Sound | null>(null);
  const loadedTrackIndex = useRef<number | null>(null);

  // Configure audio session once
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });

    return () => {
      // Cleanup on unmount
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, []);

  // Load / unload track when index changes
  useEffect(() => {
    const loadTrack = async () => {
      // Unload previous
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        loadedTrackIndex.current = null;
      }

      if (currentTrackIndex === null) return;

      const track = TRACKS[currentTrackIndex];
      if (!track) return;

      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: track.uri },
          { shouldPlay: isPlaying, isLooping: true, volume: 0.5 }
        );
        soundRef.current = sound;
        loadedTrackIndex.current = currentTrackIndex;
      } catch {
        // Track failed to load — silently ignore for POC
        console.warn(`Failed to load track: ${track.title}`);
      }
    };

    loadTrack();
  }, [currentTrackIndex]);

  // Play / pause when isPlaying changes (but track stays the same)
  useEffect(() => {
    if (!soundRef.current || loadedTrackIndex.current !== currentTrackIndex) return;

    if (isPlaying) {
      soundRef.current.playAsync().catch(() => {});
    } else {
      soundRef.current.pauseAsync().catch(() => {});
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTogglePlay = useCallback(() => {
    if (currentTrackIndex === null) {
      // Nothing playing yet — start first track
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
