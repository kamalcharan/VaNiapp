import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { SUBJECT_META } from '../../src/constants/subjects';
import { NeetSubjectId } from '../../src/types';

const SUBJECTS: { id: NeetSubjectId; emoji: string; name: string }[] = [
  { id: 'physics', emoji: '\u269B\uFE0F', name: 'Physics' },
  { id: 'chemistry', emoji: '\uD83E\uDDEA', name: 'Chemistry' },
  { id: 'botany', emoji: '\uD83C\uDF3F', name: 'Botany' },
  { id: 'zoology', emoji: '\uD83E\uDD8B', name: 'Zoology' },
];

export default function QuickStartScreen() {
  const { colors, mode } = useTheme();
  const router = useRouter();

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Top Bar */}
        <View style={[styles.topBar, { borderBottomColor: colors.surfaceBorder }]}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
            <Text style={[styles.backArrow, { color: colors.text }]}>{'<'}</Text>
          </Pressable>
          <Text style={[Typography.h3, { color: colors.text }]}>Quick Practice</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>{'\u26A1'}</Text>
            <HandwrittenText variant="hand" rotation={-1}>
              Pick a subject
            </HandwrittenText>
            <Text style={[Typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm }]}>
              20 questions. No timer. Pure focus.
            </Text>
          </View>

          {/* Subject Cards */}
          <View style={styles.grid}>
            {SUBJECTS.map((subject, idx) => {
              const meta = SUBJECT_META[subject.id];
              return (
                <Pressable
                  key={subject.id}
                  style={styles.cardWrap}
                  onPress={() =>
                    router.push({
                      pathname: '/(exam)/quick-question',
                      params: { subjectId: subject.id },
                    })
                  }
                >
                  <JournalCard delay={100 + idx * 80} style={styles.card}>
                    <View style={[styles.iconBg, { backgroundColor: meta.color + '20' }]}>
                      <Text style={styles.emoji}>{subject.emoji}</Text>
                    </View>
                    <Text style={[Typography.h3, { color: colors.text, marginTop: Spacing.sm }]}>
                      {subject.name}
                    </Text>
                    <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 4 }]}>
                      20 random Qs
                    </Text>
                  </JournalCard>
                </Pressable>
              );
            })}
          </View>

          {/* Info */}
          <JournalCard delay={500} rotation={0.5}>
            <Text style={[Typography.label, { color: colors.textTertiary, marginBottom: Spacing.sm }]}>
              HOW IT WORKS
            </Text>
            <Text style={[Typography.body, { color: colors.textSecondary, lineHeight: 22 }]}>
              {'\u2022'} 20 random questions from the subject{'\n'}
              {'\u2022'} No countdown timer — go at your pace{'\n'}
              {'\u2022'} Instant feedback after each answer{'\n'}
              {'\u2022'} See your score at the end
            </Text>
          </JournalCard>
        </ScrollView>
      </SafeAreaView>
    </DotGridBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 20,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.xl,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    gap: 4,
  },
  headerEmoji: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  cardWrap: {
    width: '47%',
  },
  card: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  iconBg: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 28,
  },
});
