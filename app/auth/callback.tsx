import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { exchangeAuthCode } from '../../src/lib/supabase';

export default function AuthCallbackScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;

    (async () => {
      try {
        await exchangeAuthCode(code);
        // Auth state listener in root _layout.tsx handles navigation
      } catch (err: any) {
        setError(err.message || 'Sign-in failed');
        // Redirect back to sign-in after a moment
        setTimeout(() => router.replace('/(auth)/sign-in'), 2500);
      }
    })();
  }, [code]);

  return (
    <View style={styles.container}>
      {error ? (
        <>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.subText}>Redirecting to sign-in...</Text>
        </>
      ) : (
        <>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.text}>Signing you in...</Text>
        </>
      )}
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
  subText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: '#94A3B8',
  },
  errorText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
