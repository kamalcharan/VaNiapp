import { useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { exchangeAuthCode } from '../../src/lib/supabase';

/**
 * Auth callback screen — catches the deep link after Google sign-in.
 *
 * On Android/Expo Go, openAuthSessionAsync returns 'dismiss' because
 * the deep link is handled by the OS. So this screen is the PRIMARY
 * exchange path on Android. We use expo-linking to read the actual
 * URL (with the ?code= param) instead of useLocalSearchParams,
 * which doesn't reliably capture deep link query params.
 */
export default function AuthCallbackScreen() {
  const exchanged = useRef(false);

  useEffect(() => {
    if (exchanged.current) return;

    (async () => {
      try {
        const Linking = require('expo-linking');

        // getInitialURL: URL that opened/resumed the app via deep link
        const url = await Linking.getInitialURL();
        if (url) {
          const parsed = Linking.parse(url);
          const code =
            parsed.queryParams?.code ?? null;

          if (code && typeof code === 'string') {
            exchanged.current = true;
            await exchangeAuthCode(code);
            return;
          }
        }
      } catch {
        // Swallow — auth state listener handles navigation
      }
    })();

    // Also listen for incoming URL events (app was already running)
    const Linking = require('expo-linking');
    const sub = Linking.addEventListener('url', (event: { url: string }) => {
      if (exchanged.current) return;
      try {
        const parsed = Linking.parse(event.url);
        const code = parsed.queryParams?.code ?? null;

        if (code && typeof code === 'string') {
          exchanged.current = true;
          exchangeAuthCode(code).catch(() => {});
        }
      } catch {
        // Swallow
      }
    });

    return () => sub?.remove?.();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2563EB" />
      <Text style={styles.text}>Signing you in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdfcf0',
    gap: 16,
  },
  text: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    color: '#64748B',
  },
});
