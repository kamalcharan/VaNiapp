import { useEffect, useState, useMemo, useCallback, createContext, useContext } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import {
  useFonts,
  PlusJakartaSans_300Light,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Caveat_700Bold } from '@expo-google-fonts/caveat';
import { IndieFlower_400Regular } from '@expo-google-fonts/indie-flower';
import * as NativeSplashScreen from 'expo-splash-screen';
import { Colors } from '../src/constants/theme';
import { ThemeContext, ThemeContextValue } from '../src/hooks/useTheme';
import { ThemeMode } from '../src/types';
import { SplashScreen } from '../src/components/SplashScreen';
import {
  AuthState,
  initialAuthState,
  getInitialAuthState,
  onAuthStateChange,
} from '../src/lib/auth';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../src/store';
import { setUser, updateTargetYear } from '../src/store/slices/authSlice';
import { ToastProvider } from '../src/components/ui/Toast';
import { GlobalMusicOverlay } from '../src/components/GlobalMusicOverlay';
import { getProfile, getUserSubjectIds } from '../src/lib/database';
import { pullRemoteProgress } from '../src/lib/progressSync';

NativeSplashScreen.preventAutoHideAsync();

// Auth context so any screen can read auth state
export const AuthContext = createContext<AuthState>(initialAuthState);
export const useAuth = () => useContext(AuthContext);

// Onboarding gate — lets setup screens signal completion to root layout
interface OnboardingGate {
  markDone: () => void;
}
const OnboardingGateContext = createContext<OnboardingGate>({ markDone: () => {} });
export const useOnboardingGate = () => useContext(OnboardingGateContext);

export default function RootLayout() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [showSplash, setShowSplash] = useState(true);
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  const router = useRouter();
  const segments = useSegments();

  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_300Light,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_800ExtraBold,
    Caveat_700Bold,
    IndieFlower_400Regular,
  });

  // Load fonts → hide native splash
  useEffect(() => {
    if (fontsLoaded || fontError) {
      NativeSplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Initialize auth state + subscribe to changes
  useEffect(() => {
    let unsubscribe: () => void;

    (async () => {
      const initial = await getInitialAuthState();
      setAuthState(initial);

      unsubscribe = onAuthStateChange((newState) => {
        setAuthState(newState);
      });
    })();

    return () => unsubscribe?.();
  }, []);

  // Check onboarding status when auth state changes to authenticated
  useEffect(() => {
    if (authState.status !== 'authenticated') {
      setOnboardingDone(null);
      return;
    }

    (async () => {
      try {
        const [profile, subjectIds] = await Promise.all([
          getProfile(),
          getUserSubjectIds(),
        ]);
        setOnboardingDone(profile?.onboarding_completed ?? false);

        // Hydrate Redux user from Supabase profile so usePersona + selectors work
        if (profile) {
          store.dispatch(setUser({
            id: profile.id,
            name: profile.display_name || '',
            email: profile.email || '',
            exam: profile.exam ?? 'NEET',
            language: profile.language ?? 'en',
            selectedSubjects: subjectIds as any[],
            targetYear: profile.target_year ?? undefined,
          }));

          // Pull remote progress into Redux (merges with local, remote wins if ahead)
          pullRemoteProgress().catch(() => {});
        }
      } catch {
        setOnboardingDone(false);
      }
    })();
  }, [authState.status]);

  // Route protection: redirect based on auth + onboarding status
  useEffect(() => {
    if (authState.status === 'loading' || showSplash) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAuthCallback = segments[0] === 'auth';
    const inSetup = segments[0] === 'setup';

    if (authState.status === 'authenticated') {
      // Still loading profile — wait
      if (onboardingDone === null && !inAuthGroup && !inAuthCallback) return;

      if (inAuthGroup || inAuthCallback) {
        // Just signed in — go to setup (profile check will run soon)
        router.replace('/setup/welcome');
      } else if (onboardingDone === true && inSetup) {
        // Onboarding done but on setup screens → go to main app
        router.replace('/(main)');
      } else if (onboardingDone === false && !inSetup) {
        // Not onboarded yet — go to setup
        router.replace('/setup/welcome');
      }
    } else if (authState.status === 'unauthenticated' && !inAuthGroup && !inAuthCallback) {
      router.replace('/(auth)/onboarding');
    }
  }, [authState.status, segments, showSplash, onboardingDone]);

  // Onboarding gate: called by setup screens after completeOnboarding() succeeds
  const markDone = useCallback(() => {
    setOnboardingDone(true);
  }, []);

  const gateValue = useMemo<OnboardingGate>(() => ({ markDone }), [markDone]);

  // Theme
  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const themeValue = useMemo<ThemeContextValue>(
    () => ({
      mode: themeMode,
      colors: themeMode === 'light' ? Colors.light : Colors.dark,
      toggle: toggleTheme,
    }),
    [themeMode, toggleTheme]
  );

  // Loading state while fonts load
  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fdfcf0', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  // Animated splash
  if (showSplash) {
    return (
      <ThemeContext.Provider value={themeValue}>
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </ThemeContext.Provider>
    );
  }

  return (
    <ReduxProvider store={store}>
      <AuthContext.Provider value={authState}>
        <OnboardingGateContext.Provider value={gateValue}>
          <ThemeContext.Provider value={themeValue}>
            <ToastProvider>
              <Slot />
              <GlobalMusicOverlay />
            </ToastProvider>
          </ThemeContext.Provider>
        </OnboardingGateContext.Provider>
      </AuthContext.Provider>
    </ReduxProvider>
  );
}
