import { useEffect, useState, useMemo, useCallback, createContext, useContext, useRef } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  PlusJakartaSans_300Light,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Caveat_700Bold } from '@expo-google-fonts/caveat';
import { IndieFlower_400Regular } from '@expo-google-fonts/indie-flower';
import { NotoSansDevanagari_400Regular, NotoSansDevanagari_600SemiBold } from '@expo-google-fonts/noto-sans-devanagari';
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
import { store, rehydrateStore, resetAllData } from '../src/store';
import { setUser } from '../src/store/slices/authSlice';
import { setTrialStart, seedQuestionsAnswered, setSubscription } from '../src/store/slices/trialSlice';
import { ToastProvider } from '../src/components/ui/Toast';
import { GlobalMusicOverlay } from '../src/components/GlobalMusicOverlay';
import { getProfile, getUserSubjectIds, isOnboardingActuallyComplete, reportAppVersion } from '../src/lib/database';
import { pullRemoteProgress } from '../src/lib/progressSync';
import { getActiveSubscription } from '../src/lib/payments';
import { reportError, installGlobalErrorHandler, initSentry, setSentryUser, setCurrentScreen } from '../src/lib/errorReporting';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { useForceUpdate } from '../src/hooks/useForceUpdate';
import { ForceUpdateModal } from '../src/components/ForceUpdateModal';

// Initialize Sentry before anything else renders
initSentry();
installGlobalErrorHandler();

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

  // Skip the 2.6s JS splash if the app launched via the password-recovery
  // deep link. The user expects to land on the new-password form fast.
  useEffect(() => {
    if (showSplash && segments[0] === 'reset-password') {
      setShowSplash(false);
    }
  }, [showSplash, segments]);

  // Check for app updates (platform-aware)
  const pendingUpdate = useForceUpdate();
  const [updateSkipped, setUpdateSkipped] = useState(false);

  // Track previous user ID to detect user switches
  const prevUserId = useRef<string | null>(null);

  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_300Light,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_800ExtraBold,
    Caveat_700Bold,
    IndieFlower_400Regular,
    NotoSansDevanagari_400Regular,
    NotoSansDevanagari_600SemiBold,
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

  // Set Sentry user context when auth changes
  useEffect(() => {
    if (authState.status === 'authenticated' && authState.user) {
      setSentryUser({ id: authState.user.id, email: authState.user.email ?? undefined });
    } else {
      setSentryUser(null);
    }
  }, [authState.status, authState.user?.id]);

  // Track current screen for Sentry breadcrumbs
  useEffect(() => {
    const screen = segments.join('/') || 'root';
    setCurrentScreen(screen);
  }, [segments]);

  // When auth state changes: load profile, rehydrate per-user data, or reset
  useEffect(() => {
    if (authState.status !== 'authenticated') {
      // User signed out or session expired — reset everything
      if (prevUserId.current !== null) {
        resetAllData();
        prevUserId.current = null;
      }
      setOnboardingDone(null);
      return;
    }

    const userId = authState.user?.id;
    if (!userId) return;

    (async () => {
      try {
        // If switching users, reset old data first
        if (prevUserId.current && prevUserId.current !== userId) {
          resetAllData();
        }
        prevUserId.current = userId;

        // Rehydrate this user's persisted Redux data from AsyncStorage
        await rehydrateStore(userId);

        const [profile, subjectIds] = await Promise.all([
          getProfile(),
          getUserSubjectIds(),
        ]);
        setOnboardingDone(isOnboardingActuallyComplete(profile));

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

          // Set trial start date + seed question count from Supabase
          if (profile.created_at) {
            store.dispatch(setTrialStart(profile.created_at));
          }
          store.dispatch(seedQuestionsAnswered(profile.questions_answered ?? 0));

          // Check for active subscription BEFORE allowing dashboard render
          // so isPaid is correct on first frame (avoids trial-banner flash)
          try {
            const sub = await getActiveSubscription();
            if (sub) {
              store.dispatch(setSubscription({
                plan: sub.planType,
                expiresAt: sub.expiresAt,
              }));
            }
          } catch (e) {
            reportError(e, 'medium', 'RootLayout.getSubscription');
          }

          // Pull remote progress into Redux (merges with local, remote wins if ahead)
          pullRemoteProgress().catch((e) => reportError(e, 'medium', 'RootLayout.pullProgress'));

          // Report app version to DB for WhatsApp bot update notifications
          reportAppVersion(profile).catch((e) => reportError(e, 'low', 'RootLayout.reportVersion'));
        }
      } catch {
        setOnboardingDone(false);
      }
    })();
  }, [authState.status, authState.user?.id]);

  // Route protection: redirect based on auth + onboarding status
  useEffect(() => {
    if (authState.status === 'loading' || showSplash) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAuthCallback = segments[0] === 'auth';
    const inSetup = segments[0] === 'setup';
    const inResetPassword = segments[0] === 'reset-password';

    if (authState.status === 'authenticated') {
      // Don't redirect away from the password reset flow — the user has
      // a temporary recovery session and still needs to set a new password.
      if (inResetPassword) return;

      if (inAuthGroup || inAuthCallback) {
        // Just signed in — go to setup (profile check will determine next step)
        router.replace('/setup/welcome');
        return;
      }

      // Still loading profile — block navigation to main app
      if (onboardingDone === null) return;

      if (onboardingDone === true && inSetup) {
        // Onboarding done but on setup screens → go to main app
        router.replace('/(main)');
      } else if (onboardingDone === false && !inSetup) {
        // Not onboarded yet — go to setup
        router.replace('/setup/welcome');
      }
    } else if (
      authState.status === 'unauthenticated' &&
      !inAuthGroup &&
      !inAuthCallback &&
      !inResetPassword
    ) {
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

  // While authenticated but profile/onboarding status still loading — show loader
  // This prevents the dashboard from flashing before we know if onboarding is complete
  const isAuthLoading =
    authState.status === 'authenticated' &&
    onboardingDone === null &&
    segments[0] !== '(auth)' &&
    segments[0] !== 'auth' &&
    segments[0] !== 'setup';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <ReduxProvider store={store}>
          <AuthContext.Provider value={authState}>
            <OnboardingGateContext.Provider value={gateValue}>
              <ThemeContext.Provider value={themeValue}>
                <ToastProvider>
                  {isAuthLoading ? (
                    <View style={{ flex: 1, backgroundColor: '#fdfcf0', justifyContent: 'center', alignItems: 'center' }}>
                      <ActivityIndicator size="large" color="#2563EB" />
                    </View>
                  ) : (
                    <Slot />
                  )}
                  {authState.status === 'authenticated' && <GlobalMusicOverlay />}
                  {pendingUpdate && !updateSkipped && (
                    <ForceUpdateModal
                      update={pendingUpdate}
                      onSkip={() => setUpdateSkipped(true)}
                    />
                  )}
                </ToastProvider>
              </ThemeContext.Provider>
            </OnboardingGateContext.Provider>
          </AuthContext.Provider>
        </ReduxProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
