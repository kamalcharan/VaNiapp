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
 * Uses createAudioPlayer() from expo-audio (replaces deprecated expo-av).
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
      interruptionMode: 'mixWithOthers',
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.remove();
        playerRef.current = null;
      }
    };
  }, []);

  // Load / replace track when index changes
  useEffect(() => {
    const loadTrack = async () => {
      // Tear down previous player
      if (playerRef.current) {
        playerRef.current.remove();
        playerRef.current = null;
        loadedTrackIndex.current = null;
      }

      if (currentTrackIndex === null) return;

      const track = TRACKS[currentTrackIndex];
      if (!track) return;

      try {
        const player = createAudioPlayer({ uri: track.uri });
        player.loop = true;
        player.volume = 0.5;
        playerRef.current = player;
        loadedTrackIndex.current = currentTrackIndex;

        if (isPlaying) {
          player.play();
        }
      } catch {
        console.warn(`Failed to load track: ${track.title}`);
      }
    };

    loadTrack();
  }, [currentTrackIndex]);

  // Play / pause when isPlaying changes (but track stays the same)
  useEffect(() => {
    if (!playerRef.current || loadedTrackIndex.current !== currentTrackIndex) return;

    if (isPlaying) {
      playerRef.current.play();
    } else {
      playerRef.current.pause();
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
