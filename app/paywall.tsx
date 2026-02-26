import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { DotGridBackground } from '../src/components/ui/DotGridBackground';
import { JournalCard } from '../src/components/ui/JournalCard';
import { StickyNote } from '../src/components/ui/StickyNote';
import { HandwrittenText } from '../src/components/ui/HandwrittenText';
import { PuffyButton } from '../src/components/ui/PuffyButton';
import { useTheme } from '../src/hooks/useTheme';
import { useTrial } from '../src/hooks/useTrial';
import { Typography, Spacing, BorderRadius } from '../src/constants/theme';

export default function PaywallScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const trial = useTrial();

  const handleUpgrade = () => {
    // TODO: Razorpay integration — for now just show a message
    router.push('/upgrade');
  };

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.lockEmoji}>{'\uD83D\uDD12'}</Text>
            <HandwrittenText variant="hand">Trial Complete</HandwrittenText>
            <Text style={[Typography.bodySm, { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm }]}>
              {trial.trialExpired && trial.questionLimitReached
                ? 'Your 3-day trial has ended and you\'ve used all 50 questions.'
                : trial.trialExpired
                  ? 'Your 3-day free trial has ended.'
                  : `You've answered all 50 trial questions.`}
            </Text>
          </View>

          {/* What you get */}
          <JournalCard delay={100}>
            <Text style={[Typography.label, { color: colors.textTertiary, marginBottom: Spacing.md }]}>
              UPGRADE TO GET
            </Text>
            {[
              { emoji: '\u267E\uFE0F', text: 'Unlimited questions across all subjects' },
              { emoji: '\uD83D\uDCDA', text: 'Full chapter bank with 10,000+ questions' },
              { emoji: '\uD83C\uDFAF', text: 'Practice exams with detailed analytics' },
              { emoji: '\u2728', text: 'VaNi AI explanations & elimination hints' },
              { emoji: '\uD83D\uDCC8', text: 'Progress tracking & strength analysis' },
            ].map((item) => (
              <View key={item.text} style={styles.featureRow}>
                <Text style={styles.featureEmoji}>{item.emoji}</Text>
                <Text style={[Typography.body, { color: colors.text, flex: 1 }]}>
                  {item.text}
                </Text>
              </View>
            ))}
          </JournalCard>

          {/* Trial stats */}
          <StickyNote color="yellow" rotation={-1} delay={200}>
            <Text style={[Typography.label, { color: '#F59E0B', marginBottom: Spacing.sm }]}>
              YOUR TRIAL STATS
            </Text>
            <Text style={[Typography.bodySm, { color: colors.text, lineHeight: 20 }]}>
              {trial.questionsAnswered} questions practiced{'\n'}
              Keep going — you're building great momentum!
            </Text>
          </StickyNote>

          {/* CTA */}
          <View style={styles.actions}>
            <PuffyButton
              title="Upgrade Now"
              icon={'\uD83D\uDE80'}
              onPress={handleUpgrade}
            />
            <PuffyButton
              title="Back to Dashboard"
              onPress={() => router.replace('/(main)')}
              variant="ghost"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </DotGridBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: Spacing.lg,
    gap: Spacing.lg,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  lockEmoji: {
    fontSize: 56,
    marginBottom: Spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  featureEmoji: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  actions: {
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
});
