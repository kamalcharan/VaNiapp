import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { exchangeAuthCode } from '../../src/lib/supabase';

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams<{ code: string }>();

  useEffect(() => {
    const code = params?.code;

    // No code? signInWithGoogle() likely already handled the exchange.
    // Just show spinner — auth state listener in root layout handles navigation.
    if (!code) return;

    // Try to exchange. If verifier was already consumed by signInWithGoogle(),
    // exchangeAuthCode is a silent no-op. Either way, the auth state listener
    // in root _layout.tsx will redirect once the session is established.
    exchangeAuthCode(code).catch(() => {
      // Swallow — code may have been used already, or verifier consumed.
    });
  }, [params?.code]);

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
