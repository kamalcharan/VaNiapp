import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';

import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { AnimatedPressable } from '../../src/components/ui/AnimatedPressable';
import { StreakBadge } from '../../src/components/ui/StreakBadge';
import { CountUpText } from '../../src/components/ui/CountUpText';
import { StrengthMap } from '../../src/components/StrengthMap';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { RootState } from '../../src/store';
import { SUBJECT_META } from '../../src/constants/subjects';
import { NEET_CHAPTERS } from '../../src/data/chapters';

export default function DashboardScreen() {
  const { colors, mode, toggle } = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);
  const chapterHistory = useSelector((state: RootState) => state.practice.chapterHistory);
  const practiceHistory = useSelector((state: RootState) => state.practice.practiceHistory);
  const bookmarkCount = useSelector((state: RootState) => state.bookmark.ids.length);
  const strengthChapters = useSelector((state: RootState) => state.strength.chapters);
  const router = useRouter();

  const weakChapters = useMemo(() => {
    return Object.values(strengthChapters)
      .filter((c) => c.strengthLevel === 'needs-focus' || (c.totalAnswered >= 5 && c.accuracy < 50))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3);
  }, [strengthChapters]);

  const displaySubjects = useMemo(() => {
    const ids = user?.selectedSubjects ?? ['physics', 'chemistry', 'botany', 'zoology'];
    return ids.map((id) => ({
      id,
      ...(SUBJECT_META[id] ?? { name: id, emoji: '\uD83D\uDCDA', color: '#64748B' }),
    }));
  }, [user?.selectedSubjects]);

  const greeting = user?.name ? `Hey, ${user.name}` : 'Study Board';
  const totalTests = chapterHistory.length + practiceHistory.length;

  const avgScore = useMemo(() => {
    if (chapterHistory.length === 0) return null;
    const totalPct = chapterHistory.reduce((sum, s) => {
      const pct =
        s.totalQuestions > 0 && s.correctCount !== null
          ? (s.correctCount / s.totalQuestions) * 100
          : 0;
      return sum + pct;
    }, 0);
    return Math.round(totalPct / chapterHistory.length);
  }, [chapterHistory]);

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[Typography.label, { color: colors.textTertiary }]}>
                {user?.exam ?? 'NEET'} PREP
              </Text>
              <Text style={[Typography.h1, { color: colors.text, marginTop: 4 }]}>{greeting}</Text>
            </View>
            <Pressable onPress={toggle} style={styles.themeToggle}>
              <Text style={styles.themeEmoji}>
                {mode === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19'}
              </Text>
            </Pressable>
          </View>

          {/* Streak */}
          <StreakBadge streak={totalTests} label={totalTests === 1 ? 'Test Taken' : 'Tests Taken'} />

          {/* Exam Mode Cards */}
          <View style={styles.modeSection}>
            <HandwrittenText variant="hand" rotation={-1}>
              Pick a mode
            </HandwrittenText>
            <View style={styles.modeCards}>
              {/* Chapter Exam */}
              <AnimatedPressable
                style={styles.modeCardWrap}
                onPress={() => router.push('/(exam)/subject-select')}
              >
                <JournalCard delay={100} style={styles.modeCard}>
                  <Text style={styles.modeIcon}>{'\uD83D\uDCD6'}</Text>
                  <Text style={[Typography.h3, { color: colors.text, textAlign: 'center' }]}>
                    Chapter{'\n'}Exam
                  </Text>
                  <Text
                    style={[
                      Typography.bodySm,
                      { color: colors.textSecondary, textAlign: 'center', marginTop: 6 },
                    ]}
                  >
                    25 Qs per chapter{'\n'}Instant feedback
                  </Text>
                </JournalCard>
              </AnimatedPressable>

              {/* Practice Exam */}
              <AnimatedPressable
                style={styles.modeCardWrap}
                onPress={() => router.push('/(exam)/practice-start')}
              >
                <JournalCard delay={200} style={styles.modeCard}>
                  <Text style={styles.modeIcon}>{'\uD83C\uDFAF'}</Text>
                  <Text style={[Typography.h3, { color: colors.text, textAlign: 'center' }]}>
                    Practice{'\n'}Exam
                  </Text>
                  <Text
                    style={[
                      Typography.bodySm,
                      { color: colors.textSecondary, textAlign: 'center', marginTop: 6 },
                    ]}
                  >
                    200 Qs, 3h 20m{'\n'}NEET format
                  </Text>
                </JournalCard>
              </AnimatedPressable>
            </View>

            {/* Quick Practice */}
            <AnimatedPressable
              onPress={() => router.push('/(exam)/quick-start')}
            >
              <JournalCard delay={300} rotation={0.3}>
                <View style={styles.quickRow}>
                  <Text style={styles.quickIcon}>{'\u26A1'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[Typography.h3, { color: colors.text }]}>
                      Quick Practice
                    </Text>
                    <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 2 }]}>
                      20 questions. No timer. Pure focus.
                    </Text>
                  </View>
                  <Text style={[styles.quickArrow, { color: colors.textTertiary }]}>{'>'}</Text>
                </View>
              </JournalCard>
            </AnimatedPressable>
          </View>

          {/* Subject Grid — quick jump to chapter-select */}
          <View style={styles.sectionHeader}>
            <HandwrittenText variant="hand" rotation={-1}>
              Your subjects
            </HandwrittenText>
          </View>

          <View style={styles.subjectGrid}>
            {displaySubjects.map((subject, idx) => (
              <AnimatedPressable
                key={subject.id}
                style={styles.subjectWrap}
                onPress={() =>
                  router.push({
                    pathname: '/(exam)/chapter-select',
                    params: { subjectId: subject.id },
                  })
                }
              >
                <JournalCard delay={300 + idx * 80} style={styles.subjectCard}>
                  <View style={[styles.subjectIconBg, { backgroundColor: subject.color + '20' }]}>
                    <Text style={styles.subjectEmoji}>{subject.emoji}</Text>
                  </View>
                  <Text
                    style={[
                      Typography.h3,
                      { color: colors.text, marginTop: Spacing.sm, textAlign: 'center' },
                    ]}
                    numberOfLines={1}
                  >
                    {subject.name}
                  </Text>
                </JournalCard>
              </AnimatedPressable>
            ))}
          </View>

          {/* Strength Map */}
          <JournalCard rotation={-0.3} delay={550}>
            <HandwrittenText variant="hand" rotation={-1}>
              Your strength
            </HandwrittenText>
            <View style={{ marginTop: Spacing.md }}>
              <StrengthMap compact />
            </View>
          </JournalCard>

          {/* Saved Questions */}
          {bookmarkCount > 0 && (
            <JournalCard rotation={0.2} delay={560}>
              <View style={styles.savedRow}>
                <Text style={styles.savedIcon}>{'\uD83D\uDD16'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.h3, { color: colors.text }]}>Saved Questions</Text>
                  <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 2 }]}>
                    {bookmarkCount} {bookmarkCount === 1 ? 'question' : 'questions'} bookmarked
                  </Text>
                </View>
              </View>
            </JournalCard>
          )}

          {/* Focus Areas */}
          {weakChapters.length > 0 && (
            <JournalCard rotation={-0.4} delay={570}>
              <HandwrittenText variant="hand" rotation={-1}>
                Focus areas
              </HandwrittenText>
              <View style={{ marginTop: Spacing.md, gap: Spacing.sm }}>
                {weakChapters.map((ch) => {
                  const chapterInfo = NEET_CHAPTERS.find((c) => c.id === ch.chapterId);
                  const subMeta = chapterInfo ? SUBJECT_META[chapterInfo.subjectId] : null;
                  return (
                    <AnimatedPressable
                      key={ch.chapterId}
                      onPress={() =>
                        router.push({
                          pathname: '/(exam)/chapter-question',
                          params: { chapterId: ch.chapterId },
                        })
                      }
                    >
                      <View style={styles.focusRow}>
                        <Text style={styles.focusEmoji}>{subMeta?.emoji ?? '\uD83D\uDCDA'}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={[Typography.bodySm, { color: colors.text }]} numberOfLines={1}>
                            {chapterInfo?.name ?? ch.chapterId}
                          </Text>
                          <Text style={[styles.focusAccuracy, { color: '#EF4444' }]}>
                            {Math.round(ch.accuracy)}% accuracy
                          </Text>
                        </View>
                        <Text style={[styles.quickArrow, { color: colors.textTertiary }]}>{'>'}</Text>
                      </View>
                    </AnimatedPressable>
                  );
                })}
              </View>
            </JournalCard>
          )}

          {/* Quick Stats */}
          <JournalCard rotation={0.5} delay={650}>
            <Text
              style={[Typography.label, { color: colors.textTertiary, marginBottom: Spacing.md }]}
            >
              QUICK STATS
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <CountUpText value={totalTests} style={[Typography.h1, { color: colors.primary }]} />
                <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Tests</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.surfaceBorder }]} />
              <View style={styles.statItem}>
                {avgScore !== null ? (
                  <CountUpText value={avgScore} suffix="%" style={[Typography.h1, { color: colors.correct }]} />
                ) : (
                  <Text style={[Typography.h1, { color: colors.correct }]}>--%</Text>
                )}
                <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Avg Score</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.surfaceBorder }]} />
              <View style={styles.statItem}>
                <CountUpText value={chapterHistory.length} style={[Typography.h1, { color: colors.warning }]} />
                <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Chapters</Text>
              </View>
            </View>
          </JournalCard>
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
    gap: Spacing.xl,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  themeToggle: {
    padding: Spacing.sm,
  },
  themeEmoji: {
    fontSize: 24,
  },
  modeSection: {
    gap: Spacing.md,
  },
  modeCards: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modeCardWrap: {
    flex: 1,
  },
  modeCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  modeIcon: {
    fontSize: 36,
    marginBottom: Spacing.sm,
  },
  sectionHeader: {
    marginTop: Spacing.sm,
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  subjectWrap: {
    width: '47%',
  },
  subjectCard: {
    alignItems: 'center',
  },
  subjectIconBg: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectEmoji: {
    fontSize: 28,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  quickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  quickIcon: {
    fontSize: 32,
  },
  quickArrow: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 20,
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  savedIcon: {
    fontSize: 32,
  },
  focusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 6,
  },
  focusEmoji: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  focusAccuracy: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    marginTop: 1,
  },
});
