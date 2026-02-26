import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { DotGridBackground } from '../src/components/ui/DotGridBackground';
import { JournalCard } from '../src/components/ui/JournalCard';
import { HandwrittenText } from '../src/components/ui/HandwrittenText';
import { PuffyButton } from '../src/components/ui/PuffyButton';
import { useTheme } from '../src/hooks/useTheme';
import { Typography, Spacing } from '../src/constants/theme';

export default function PaymentFailureScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { errorDescription } = useLocalSearchParams<{ errorDescription?: string }>();

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <Text style={styles.emoji}>{'\u274C'}</Text>

          <HandwrittenText variant="handLg">Payment Failed</HandwrittenText>

          <Text
            style={[
              Typography.body,
              { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.md },
            ]}
          >
            Don't worry, no amount has been deducted.
          </Text>

          {errorDescription ? (
            <JournalCard delay={100}>
              <Text style={[Typography.label, { color: colors.textTertiary, marginBottom: Spacing.sm }]}>
                WHAT HAPPENED
              </Text>
              <Text style={[Typography.bodySm, { color: colors.text }]}>
                {errorDescription}
              </Text>
            </JournalCard>
          ) : null}

          <JournalCard delay={200}>
            <Text style={[Typography.label, { color: colors.textTertiary, marginBottom: Spacing.sm }]}>
              THINGS TO TRY
            </Text>
            {[
              'Check your card details and try again',
              'Use a different payment method (UPI, net banking)',
              'Ensure sufficient balance in your account',
              'Contact your bank if the issue persists',
            ].map((tip) => (
              <View key={tip} style={styles.tipRow}>
                <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                  {'\u2022'}  {tip}
                </Text>
              </View>
            ))}
          </JournalCard>

          <View style={styles.actions}>
            <PuffyButton
              title="Retry Payment"
              icon={'\uD83D\uDD04'}
              onPress={() => router.back()}
            />
            <PuffyButton
              title="Back to Dashboard"
              variant="ghost"
              onPress={() => router.replace('/(main)')}
            />
          </View>
        </View>
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
    padding: Spacing.lg,
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  emoji: {
    fontSize: 72,
    textAlign: 'center',
  },
  tipRow: {
    paddingVertical: Spacing.xs,
  },
  actions: {
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
});
