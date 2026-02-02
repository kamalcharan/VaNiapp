import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { startTracking, recordSwitch, stopTracking } from '../store/slices/focusSlice';

/**
 * Hook that tracks focus during practice exams.
 * Detects when the user switches away from the app via AppState.
 * Call this in the practice-question screen.
 */
export function useFocusTracker() {
  const dispatch = useDispatch();
  const { switchCount, isTracking } = useSelector((state: RootState) => state.focus);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  // Start tracking on mount
  useEffect(() => {
    dispatch(startTracking());

    return () => {
      dispatch(stopTracking());
    };
  }, [dispatch]);

  // Listen for app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      // User switched away (active -> background/inactive) then came back
      if (appState.current === 'active' && (nextState === 'background' || nextState === 'inactive')) {
        dispatch(recordSwitch());
      }
      appState.current = nextState;
    });

    return () => {
      subscription.remove();
    };
  }, [dispatch]);

  return {
    switchCount,
    isTracking,
    isFocused: switchCount === 0,
  };
}
