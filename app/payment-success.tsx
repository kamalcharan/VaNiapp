import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { DotGridBackground } from '../src/components/ui/DotGridBackground';
import { HandwrittenText } from '../src/components/ui/HandwrittenText';
import { PuffyButton } from '../src/components/ui/PuffyButton';
import { ConfettiBurst } from '../src/components/ui/ConfettiBurst';
import { useTheme } from '../src/hooks/useTheme';
import { Typography, Spacing } from '../src/constants/theme';

export default function PaymentSuccessScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { planName } = useLocalSearchParams<{ planName?: string }>();

  const [confetti, setConfetti] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Fire confetti on mount
  useEffect(() => {
    const timer = setTimeout(() => setConfetti(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown <= 0) {
      router.replace('/(main)');
      return;
    }
    const interval = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(interval);
  }, [countdown, router]);

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <Text style={styles.emoji}>{'\u2705'}</Text>

          <HandwrittenText variant="handLg">Payment Successful!</HandwrittenText>

          <Text
            style={[
              Typography.body,
              { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.md },
            ]}
          >
            {planName
              ? `Your ${planName} plan is now active.`
              : 'Your plan is now active.'}
          </Text>

          <Text
            style={[
              Typography.bodySm,
              { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.lg },
            ]}
          >
            Happy learning! You now have full access to VaNi.
          </Text>

          <View style={styles.actions}>
            <PuffyButton
              title={`Go to Dashboard (${countdown}s)`}
              icon={'\uD83C\uDFE0'}
              onPress={() => router.replace('/(main)')}
            />
          </View>

          <Text
            style={[
              Typography.bodySm,
              { color: colors.textTertiary, textAlign: 'center', marginTop: Spacing.md },
            ]}
          >
            Redirecting automatically...
          </Text>
        </View>

        <ConfettiBurst trigger={confetti} />
      </SafeAreaView>
    </DotGridBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  emoji: {
    fontSize: 72,
    marginBottom: Spacing.lg,
  },
  actions: {
    width: '100%',
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
});
