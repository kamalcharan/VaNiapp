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
 * Uses a single persistent AudioPlayer; swaps tracks via replace().
 * Compatible with expo-audio 1.1.x (SDK 54).
 */
export function useAudioPlayer() {
  const dispatch = useDispatch();
  const { currentTrackIndex, isPlaying } = useSelector((state: RootState) => state.music);
  const playerRef = useRef<AudioPlayer | null>(null);
  const loadedTrackIndex = useRef<number | null>(null);

  // Configure audio session once
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.remove();
        playerRef.current = null;
      }
    };
  }, []);

  // Load track when index changes
  useEffect(() => {
    if (currentTrackIndex === null) {
      if (playerRef.current) {
        playerRef.current.pause();
      }
      loadedTrackIndex.current = null;
      return;
    }

    const track = TRACKS[currentTrackIndex];
    if (!track) return;

    try {
      if (!playerRef.current) {
        // First track — create player with the source
        const player = createAudioPlayer({ uri: track.uri });
        player.loop = true;
        player.volume = 0.5;
        playerRef.current = player;
      } else {
        // Subsequent tracks — swap source (sync in 0.3.x)
        playerRef.current.replace({ uri: track.uri });
      }

      loadedTrackIndex.current = currentTrackIndex;

      if (isPlaying) {
        playerRef.current.play();
      }
    } catch (err) {
      console.warn(`Failed to load track: ${track.title}`, err);
    }
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
