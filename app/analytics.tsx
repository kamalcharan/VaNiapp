import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';

import { DotGridBackground } from '../src/components/ui/DotGridBackground';
import { JournalCard } from '../src/components/ui/JournalCard';
import { HandwrittenText } from '../src/components/ui/HandwrittenText';
import { useTheme } from '../src/hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../src/constants/theme';
import { RootState } from '../src/store';
import { NEET_CHAPTERS } from '../src/data/chapters';
import { SUBJECT_META } from '../src/constants/subjects';
import { evaluateSubjectStrength } from '../src/lib/strengthEvaluator';
import { StrengthLevel, STRENGTH_LEVELS, NEEDS_FOCUS_CONFIG } from '../src/types';

const SUBJECTS = ['physics', 'chemistry', 'botany', 'zoology'] as const;

function getStrengthConfig(level: StrengthLevel) {
  if (level === 'needs-focus') return NEEDS_FOCUS_CONFIG;
  return STRENGTH_LEVELS.find((s) => s.id === level) ?? STRENGTH_LEVELS[0];
}

export default function AnalyticsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const chapters = useSelector((state: RootState) => state.strength.chapters);
  const streak = useSelector((state: RootState) => state.streak);

  // Calculate overall stats
  const overall = useMemo(() => {
    const allData = Object.values(chapters);
    const totalAnswered = allData.reduce((s, c) => s + c.totalAnswered, 0);
    const totalCorrect = allData.reduce((s, c) => s + c.correctCount, 0);
    const chaptersStarted = allData.length;
    const chaptersStrong = allData.filter(
      (c) => c.coverage >= 60 && c.accuracy >= 70,
    ).length;
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    return { totalAnswered, totalCorrect, chaptersStarted, chaptersStrong, accuracy };
  }, [chapters]);

  // Calculate per-subject data
  const subjectData = useMemo(() => {
    return SUBJECTS.map((subjectId) => {
      const meta = SUBJECT_META[subjectId];
      const subjectChapters = NEET_CHAPTERS.filter((c) => c.subjectId === subjectId);
      const chapterData = subjectChapters.map((ch) => {
        const data = chapters[ch.id];
        return {
          id: ch.id,
          name: ch.name,
          coverage: data?.coverage ?? 0,
          accuracy: data?.accuracy ?? 0,
          totalInBank: ch.questionCount,
          totalAnswered: data?.totalAnswered ?? 0,
          correctCount: data?.correctCount ?? 0,
          strengthLevel: data?.strengthLevel ?? ('just-started' as StrengthLevel),
          lastPracticedAt: data?.lastPracticedAt ?? null,
        };
      });

      const evalData = chapterData.map((ch) => ({
        coverage: ch.coverage,
        accuracy: ch.accuracy,
        totalInBank: ch.totalInBank,
      }));
      const subjectStrength = evaluateSubjectStrength(evalData);

      return {
        subjectId,
        meta,
        chapters: chapterData,
        strength: subjectStrength,
      };
    });
  }, [chapters]);

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Text style={[Typography.body, { color: colors.textSecondary }]}>
                {'\u2190'} Back
              </Text>
            </Pressable>
            <HandwrittenText variant="hand">Your Analytics</HandwrittenText>
          </View>

          {/* Overall Stats Card */}
          <JournalCard delay={100}>
            <View style={styles.overallCard}>
              <Text style={[Typography.h3, { color: colors.text }]}>Overall Progress</Text>
              <View style={styles.overallGrid}>
                <View style={styles.overallStat}>
                  <Text style={[styles.overallNum, { color: colors.primary }]}>
                    {overall.totalAnswered}
                  </Text>
                  <Text style={[styles.overallLabel, { color: colors.textSecondary }]}>
                    Questions{'\n'}Answered
                  </Text>
                </View>
                <View style={styles.overallStat}>
                  <Text style={[styles.overallNum, { color: overall.accuracy >= 60 ? '#22C55E' : overall.accuracy >= 40 ? '#F59E0B' : '#EF4444' }]}>
                    {overall.accuracy}%
                  </Text>
                  <Text style={[styles.overallLabel, { color: colors.textSecondary }]}>
                    Overall{'\n'}Accuracy
                  </Text>
                </View>
                <View style={styles.overallStat}>
                  <Text style={[styles.overallNum, { color: colors.primary }]}>
                    {overall.chaptersStarted}
                  </Text>
                  <Text style={[styles.overallLabel, { color: colors.textSecondary }]}>
                    Chapters{'\n'}Started
                  </Text>
                </View>
                <View style={styles.overallStat}>
                  <Text style={[styles.overallNum, { color: '#22C55E' }]}>
                    {overall.chaptersStrong}
                  </Text>
                  <Text style={[styles.overallLabel, { color: colors.textSecondary }]}>
                    Chapters{'\n'}Strong
                  </Text>
                </View>
              </View>
              {/* Streak */}
              {streak && streak.dailyStreak > 0 && (
                <View style={[styles.streakRow, { backgroundColor: '#F59E0B18' }]}>
                  <Text style={styles.streakEmoji}>{'\uD83D\uDD25'}</Text>
                  <Text style={[styles.streakText, { color: '#F59E0B' }]}>
                    {streak.dailyStreak} day streak
                  </Text>
                </View>
              )}
            </View>
          </JournalCard>

          {/* Subject Sections */}
          {subjectData.map((subject, sIdx) => {
            const subjectConfig = getStrengthConfig(subject.strength.level);
            if (!subject.meta) return null;

            return (
              <JournalCard key={subject.subjectId} delay={200 + sIdx * 100}>
                <View style={styles.subjectCard}>
                  {/* Subject Header */}
                  <View style={styles.subjectHeader}>
                    <Text style={styles.subjectEmoji}>{subject.meta.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[Typography.h3, { color: colors.text }]}>
                        {subject.meta.name}
                      </Text>
                      <View style={styles.subjectMetaRow}>
                        <View style={[styles.badge, { backgroundColor: subjectConfig.color + '18' }]}>
                          <Text style={[styles.badgeText, { color: subjectConfig.color }]}>
                            {subjectConfig.label}
                          </Text>
                        </View>
                        <Text style={[styles.subjectAccuracy, { color: colors.textTertiary }]}>
                          {Math.round(subject.strength.accuracy)}% accuracy
                          {'  '}|{'  '}
                          {Math.round(subject.strength.coverage)}% coverage
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Subject-level progress bar */}
                  <View style={[styles.barBg, { backgroundColor: colors.surfaceBorder }]}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          backgroundColor: subjectConfig.color,
                          width: `${Math.min(subject.strength.coverage, 100)}%`,
                        },
                      ]}
                    />
                  </View>

                  {/* Chapter Rows */}
                  {subject.chapters.map((ch) => {
                    const chConfig = getStrengthConfig(ch.strengthLevel);
                    const hasData = ch.totalAnswered > 0;
                    return (
                      <Pressable
                        key={ch.id}
                        style={styles.chapterRow}
                        onPress={() => router.push(`/chapter/${ch.id}`)}
                      >
                        <View style={styles.chapterInfo}>
                          <Text
                            style={[styles.chapterName, { color: colors.text }]}
                            numberOfLines={1}
                          >
                            {ch.name}
                          </Text>
                          <View style={styles.chapterMetaRow}>
                            <View style={[styles.badgeSm, { backgroundColor: chConfig.color + '18' }]}>
                              <Text style={[styles.badgeTextSm, { color: chConfig.color }]}>
                                {chConfig.label}
                              </Text>
                            </View>
                            {hasData && (
                              <Text style={[styles.chapterStats, { color: colors.textTertiary }]}>
                                {Math.round(ch.accuracy)}% acc | {ch.totalAnswered} answered
                              </Text>
                            )}
                            {!hasData && (
                              <Text style={[styles.chapterStats, { color: colors.textTertiary }]}>
                                Not started
                              </Text>
                            )}
                          </View>
                        </View>
                        {/* Mini coverage bar */}
                        <View style={[styles.miniBarBg, { backgroundColor: colors.surfaceBorder }]}>
                          <View
                            style={[
                              styles.miniBarFill,
                              {
                                backgroundColor: chConfig.color,
                                width: `${Math.min(ch.coverage, 100)}%`,
                              },
                            ]}
                          />
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </JournalCard>
            );
          })}

          {/* Empty state */}
          {overall.totalAnswered === 0 && (
            <JournalCard delay={300}>
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>{'\uD83D\uDCCA'}</Text>
                <Text style={[Typography.body, { color: colors.textSecondary, textAlign: 'center' }]}>
                  Complete a chapter quiz or practice session to start seeing your analytics here.
                </Text>
                <Pressable
                  style={[styles.ctaButton, { backgroundColor: colors.primary }]}
                  onPress={() => router.push('/quick-practice')}
                >
                  <Text style={styles.ctaText}>Start Quick Practice</Text>
                </Pressable>
              </View>
            </JournalCard>
          )}
        </ScrollView>
      </SafeAreaView>
    </DotGridBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: 40 },
  header: { gap: Spacing.sm },
  backButton: { alignSelf: 'flex-start', paddingVertical: Spacing.xs },

  // Overall card
  overallCard: { gap: Spacing.md },
  overallGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  overallStat: { alignItems: 'center', gap: 2 },
  overallNum: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 22 },
  overallLabel: { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 11, textAlign: 'center' },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  streakEmoji: { fontSize: 18 },
  streakText: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13 },

  // Subject card
  subjectCard: { gap: Spacing.sm },
  subjectHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  subjectEmoji: { fontSize: 28 },
  subjectMetaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 2 },
  subjectAccuracy: { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 11 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: BorderRadius.sm },
  badgeText: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 10, letterSpacing: 0.3 },

  // Progress bar
  barBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 },

  // Chapter rows
  chapterRow: { gap: 4, paddingLeft: 36 },
  chapterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chapterName: { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, flex: 1 },
  chapterMetaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  chapterStats: { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 11 },
  badgeSm: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: BorderRadius.xs },
  badgeTextSm: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 9 },

  // Mini bar
  miniBarBg: { height: 4, borderRadius: 2, overflow: 'hidden' },
  miniBarFill: { height: 4, borderRadius: 2 },

  // Empty state
  emptyState: { alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.lg },
  emptyEmoji: { fontSize: 48 },
  ctaButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 16,
  },
  ctaText: { color: '#FFF', fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 15 },
});
