import { useEffect, useState, useMemo, useCallback, useRef, createContext, useContext } from 'react';
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
import { exchangeAuthCode } from '../src/lib/supabase';
import {
  AuthState,
  initialAuthState,
  getInitialAuthState,
  onAuthStateChange,
} from '../src/lib/auth';
import { getProfile } from '../src/lib/database';

NativeSplashScreen.preventAutoHideAsync();

// Auth context so any screen can read auth state
export const AuthContext = createContext<AuthState>(initialAuthState);
export const useAuth = () => useContext(AuthContext);

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
        const profile = await getProfile();
        setOnboardingDone(profile?.onboarding_completed ?? false);
      } catch {
        setOnboardingDone(false);
      }
    })();
  }, [authState.status]);

  // ── Deep link handler for auth callback ──
  // The root layout is already mounted when the deep link fires,
  // so it reliably receives the URL (unlike the callback screen
  // which mounts AFTER the URL event has already been processed).
  const authExchanged = useRef(false);

  useEffect(() => {
    const Linking = require('expo-linking');

    const extractCode = (url: string): string | null => {
      try {
        const parsed = Linking.parse(url);
        const isCallback =
          parsed.path === 'auth/callback' ||
          parsed.path === '--/auth/callback';
        if (!isCallback) return null;

        // Check query params (?code=xxx)
        if (parsed.queryParams?.code) {
          return String(parsed.queryParams.code);
        }

        // Check hash fragment (#code=xxx) — Supabase may use this
        const hashIdx = url.indexOf('#');
        if (hashIdx !== -1) {
          const hash = url.substring(hashIdx + 1);
          for (const part of hash.split('&')) {
            const [key, ...rest] = part.split('=');
            if (key === 'code') return decodeURIComponent(rest.join('='));
          }
        }
      } catch {}
      return null;
    };

    const handleUrl = (event: { url: string }) => {
      if (authExchanged.current) return;
      const code = extractCode(event.url);
      if (code) {
        authExchanged.current = true;
        exchangeAuthCode(code).catch(() => {
          authExchanged.current = false;
        });
      }
    };

    const subscription = Linking.addEventListener('url', handleUrl);
    return () => subscription?.remove?.();
  }, []);

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
        // TODO: replace '/' with '/(tabs)' when main app screens are ready
        router.replace('/');
      }
    } else if (authState.status === 'unauthenticated' && !inAuthGroup && !inAuthCallback) {
      router.replace('/(auth)/onboarding');
    }
  }, [authState.status, segments, showSplash, onboardingDone]);

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
    <AuthContext.Provider value={authState}>
      <ThemeContext.Provider value={themeValue}>
        <Slot />
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}
