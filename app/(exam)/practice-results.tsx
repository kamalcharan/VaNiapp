import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';

import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { StickyNote } from '../../src/components/ui/StickyNote';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { PuffyButton } from '../../src/components/ui/PuffyButton';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { SUBJECT_META } from '../../src/constants/subjects';
import { RootState } from '../../src/store';
import { NeetSubjectId, NEET_SCORING } from '../../src/types';
import { getAllQuestions } from '../../src/data/questions';
import { NEET_CHAPTERS } from '../../src/data/chapters';

const SUBJECTS: NeetSubjectId[] = ['physics', 'chemistry', 'botany', 'zoology'];

export default function PracticeResultsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { score, correct, wrong, unanswered, timeUsedMs: timeParam, focusSwitches: focusParam } = useLocalSearchParams<{
    score: string;
    correct: string;
    wrong: string;
    unanswered: string;
    timeUsedMs: string;
    focusSwitches: string;
  }>();

  const [activeTab, setActiveTab] = useState<'summary' | 'analytics'>('summary');

  const lastExam = useSelector((state: RootState) => {
    const h = state.practice.practiceHistory;
    return h.length > 0 ? h[0] : null;
  });

  const scoreNum = parseInt(score ?? '0', 10);
  const correctNum = parseInt(correct ?? '0', 10);
  const wrongNum = parseInt(wrong ?? '0', 10);
  const unansweredNum = parseInt(unanswered ?? '0', 10);
  const timeUsedMs = parseInt(timeParam ?? '0', 10);
  const focusSwitches = parseInt(focusParam ?? '0', 10);
  const percentage = Math.round((scoreNum / NEET_SCORING.maxMarks) * 100);

  const getGrade = () => {
    if (percentage >= 80) return { label: 'Outstanding!', emoji: '\uD83C\uDF1F', color: '#22C55E' };
    if (percentage >= 60) return { label: 'Well Done!', emoji: '\uD83D\uDC4D', color: '#3B82F6' };
    if (percentage >= 40) return { label: 'Good Effort', emoji: '\uD83D\uDCAA', color: '#F59E0B' };
    return { label: 'Keep Practicing', emoji: '\uD83D\uDCD6', color: '#EF4444' };
  };

  const grade = getGrade();

  // Format time
  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m ${s}s`;
  };

  // Analytics data
  const analytics = useMemo(() => {
    if (!lastExam) return null;

    const allQuestions = getAllQuestions();
    const answeredMap: Record<string, string | null> = {};
    lastExam.answers.forEach((a) => {
      answeredMap[a.questionId] = a.selectedOptionId;
    });

    // Difficulty breakdown
    const diffStats = {
      easy: { correct: 0, wrong: 0, total: 0 },
      medium: { correct: 0, wrong: 0, total: 0 },
      hard: { correct: 0, wrong: 0, total: 0 },
    };

    // Chapter breakdown
    const chapterMap: Record<string, { name: string; subjectId: string; correct: number; wrong: number; total: number }> = {};

    for (const q of allQuestions) {
      const selectedOpt = answeredMap[q.id] ?? null;
      const isCorrect = selectedOpt === q.correctOptionId;
      const isWrong = selectedOpt !== null && !isCorrect;

      diffStats[q.difficulty].total++;
      if (isCorrect) diffStats[q.difficulty].correct++;
      if (isWrong) diffStats[q.difficulty].wrong++;

      if (!chapterMap[q.chapterId]) {
        const ch = NEET_CHAPTERS.find((c) => c.id === q.chapterId);
        chapterMap[q.chapterId] = {
          name: ch?.name ?? q.chapterId,
          subjectId: q.subjectId,
          correct: 0,
          wrong: 0,
          total: 0,
        };
      }
      chapterMap[q.chapterId].total++;
      if (isCorrect) chapterMap[q.chapterId].correct++;
      if (isWrong) chapterMap[q.chapterId].wrong++;
    }

    const chapters = Object.entries(chapterMap)
      .map(([id, stats]) => ({
        id,
        ...stats,
        accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      }))
      .sort((a, b) => a.accuracy - b.accuracy);

    return { diffStats, chapters, weakest: chapters[0], strongest: chapters[chapters.length - 1] };
  }, [lastExam]);

  const handleRetry = () => router.replace('/(exam)/practice-start');
  const handleGoHome = () => router.replace('/(tabs)');
  const handleReview = () => {
    if (lastExam) {
      router.push({ pathname: '/(exam)/answer-review', params: { sessionId: lastExam.id } });
    }
  };

  const TABS: { key: 'summary' | 'analytics'; label: string }[] = [
    { key: 'summary', label: 'Summary' },
    { key: 'analytics', label: 'Analytics' },
  ];

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Grade Banner */}
          <View style={[styles.gradeBanner, { backgroundColor: grade.color + '15' }]}>
            <Text style={styles.gradeEmoji}>{grade.emoji}</Text>
            <HandwrittenText variant="hand">{grade.label}</HandwrittenText>
            <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 4 }]}>
              NEET Practice Exam
            </Text>
          </View>

          {/* Tab Bar */}
          <View style={styles.tabBar}>
            {TABS.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <Pressable
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  style={[
                    styles.tab,
                    {
                      backgroundColor: isActive ? colors.primary + '15' : 'transparent',
                      borderColor: isActive ? colors.primary : colors.surfaceBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: isActive ? colors.primary : colors.textSecondary },
                    ]}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {activeTab === 'summary' ? (
            <>
              {/* Score Card */}
              <JournalCard delay={100}>
                <View style={styles.scoreCenter}>
                  <View style={[styles.scoreCircle, { borderColor: grade.color }]}>
                    <Text style={[styles.scoreNum, { color: grade.color }]}>{scoreNum}</Text>
                    <Text style={[styles.scoreMax, { color: colors.textTertiary }]}>/{NEET_SCORING.maxMarks}</Text>
                  </View>
                  <Text style={[Typography.h3, { color: colors.text, marginTop: Spacing.md }]}>
                    {percentage}% Score
                  </Text>
                  {timeUsedMs > 0 && (
                    <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 4 }]}>
                      Time: {formatTime(timeUsedMs)}
                    </Text>
                  )}
                </View>

                <View style={[styles.statStrip, { borderTopColor: colors.surfaceBorder }]}>
                  <View style={styles.statCell}>
                    <Text style={[styles.statVal, { color: '#22C55E' }]}>{correctNum}</Text>
                    <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Correct</Text>
                    <Text style={[styles.statPoints, { color: '#22C55E' }]}>+{correctNum * 4}</Text>
                  </View>
                  <View style={[styles.statDivider, { backgroundColor: colors.surfaceBorder }]} />
                  <View style={styles.statCell}>
                    <Text style={[styles.statVal, { color: '#EF4444' }]}>{wrongNum}</Text>
                    <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Wrong</Text>
                    <Text style={[styles.statPoints, { color: '#EF4444' }]}>{wrongNum > 0 ? `-${wrongNum}` : '0'}</Text>
                  </View>
                  <View style={[styles.statDivider, { backgroundColor: colors.surfaceBorder }]} />
                  <View style={styles.statCell}>
                    <Text style={[styles.statVal, { color: '#64748B' }]}>{unansweredNum}</Text>
                    <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Skipped</Text>
                    <Text style={[styles.statPoints, { color: '#64748B' }]}>0</Text>
                  </View>
                </View>
              </JournalCard>

              {/* Focus Stats */}
              <JournalCard delay={150}>
                <View style={styles.focusRow}>
                  <Text style={styles.focusEmoji}>
                    {focusSwitches === 0 ? '\uD83C\uDFC6' : focusSwitches <= 3 ? '\uD83D\uDE0C' : '\uD83D\uDCF1'}
                  </Text>
                  <View style={styles.focusInfo}>
                    <Text style={[Typography.h3, { color: focusSwitches === 0 ? '#22C55E' : focusSwitches <= 3 ? colors.primary : '#F59E0B' }]}>
                      {focusSwitches === 0
                        ? 'Focus Champion!'
                        : focusSwitches <= 3
                          ? 'Good Focus'
                          : `Switched away ${focusSwitches} times`}
                    </Text>
                    <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 2 }]}>
                      {focusSwitches === 0
                        ? 'You stayed focused the entire exam!'
                        : focusSwitches <= 3
                          ? `Only ${focusSwitches} app switch${focusSwitches === 1 ? '' : 'es'} during the exam`
                          : 'Try minimizing distractions next time'}
                    </Text>
                  </View>
                </View>
              </JournalCard>

              {/* Per-Subject Breakdown */}
              {lastExam?.subjectScores && (
                <JournalCard delay={200}>
                  <Text style={[Typography.label, { color: colors.textTertiary, marginBottom: Spacing.md }]}>
                    SUBJECT BREAKDOWN
                  </Text>
                  {SUBJECTS.map((subjectId) => {
                    const meta = SUBJECT_META[subjectId];
                    const s = lastExam.subjectScores![subjectId];
                    const maxSubject = 45 * NEET_SCORING.correct;
                    const pct = maxSubject > 0 ? Math.round((s.score / maxSubject) * 100) : 0;

                    return (
                      <View key={subjectId} style={[styles.subjectRow, { borderBottomColor: colors.surfaceBorder }]}>
                        <View style={styles.subjectHeader}>
                          <Text style={[Typography.body, { color: colors.text }]}>
                            {meta.emoji} {meta.name}
                          </Text>
                          <Text style={[Typography.h3, { color: meta.color }]}>
                            {s.score}/{maxSubject}
                          </Text>
                        </View>
                        <View style={styles.barBg}>
                          <View
                            style={[styles.barFill, { width: `${Math.max(0, pct)}%`, backgroundColor: meta.color }]}
                          />
                        </View>
                        <View style={styles.subjectStats}>
                          <Text style={[styles.miniStat, { color: '#22C55E' }]}>{s.correct} correct</Text>
                          <Text style={[styles.miniStat, { color: '#EF4444' }]}>{s.wrong} wrong</Text>
                          <Text style={[styles.miniStat, { color: '#64748B' }]}>{s.unanswered} skipped</Text>
                        </View>
                      </View>
                    );
                  })}
                </JournalCard>
              )}

              {/* Advice */}
              <StickyNote color="yellow" rotation={-1} delay={300}>
                <Text style={[Typography.bodySm, { color: colors.text, lineHeight: 20 }]}>
                  {percentage >= 60
                    ? 'Strong performance! Focus on your weakest subject and try the Chapter Exam mode for targeted practice.'
                    : 'Use Chapter Exam mode to strengthen individual chapters. Focus on the explanations and elimination techniques.'}
                </Text>
              </StickyNote>
            </>
          ) : (
            <>
              {/* Analytics Tab */}
              {/* Time Analysis */}
              {timeUsedMs > 0 && (
                <JournalCard delay={100}>
                  <Text style={[Typography.label, { color: colors.textTertiary, marginBottom: Spacing.md }]}>
                    TIME ANALYSIS
                  </Text>
                  <View style={styles.timeGrid}>
                    <View style={styles.timeItem}>
                      <Text style={[styles.timeValue, { color: colors.primary }]}>{formatTime(timeUsedMs)}</Text>
                      <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Total Time</Text>
                    </View>
                    <View style={[styles.timeDivider, { backgroundColor: colors.surfaceBorder }]} />
                    <View style={styles.timeItem}>
                      <Text style={[styles.timeValue, { color: colors.primary }]}>{formatTime(NEET_SCORING.timeLimitMs)}</Text>
                      <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Allowed</Text>
                    </View>
                    <View style={[styles.timeDivider, { backgroundColor: colors.surfaceBorder }]} />
                    <View style={styles.timeItem}>
                      <Text style={[styles.timeValue, { color: colors.primary }]}>
                        {correctNum + wrongNum > 0 ? formatTime(Math.round(timeUsedMs / (correctNum + wrongNum))) : '--'}
                      </Text>
                      <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Per Question</Text>
                    </View>
                  </View>
                </JournalCard>
              )}

              {/* Focus Analysis */}
              <JournalCard delay={150}>
                <Text style={[Typography.label, { color: colors.textTertiary, marginBottom: Spacing.md }]}>
                  FOCUS ANALYSIS
                </Text>
                <View style={styles.focusAnalytics}>
                  <View style={styles.focusAnalyticsItem}>
                    <Text style={[styles.focusAnalyticsValue, { color: focusSwitches === 0 ? '#22C55E' : focusSwitches <= 3 ? colors.primary : '#F59E0B' }]}>
                      {focusSwitches}
                    </Text>
                    <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>App Switches</Text>
                  </View>
                  <View style={[styles.timeDivider, { backgroundColor: colors.surfaceBorder }]} />
                  <View style={styles.focusAnalyticsItem}>
                    <Text style={styles.focusBadgeEmoji}>
                      {focusSwitches === 0 ? '\uD83C\uDFC6' : focusSwitches <= 3 ? '\u2B50' : '\uD83D\uDCAA'}
                    </Text>
                    <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                      {focusSwitches === 0 ? 'Champion' : focusSwitches <= 3 ? 'Focused' : 'Improve'}
                    </Text>
                  </View>
                </View>
              </JournalCard>

              {/* Difficulty Breakdown */}
              {analytics && (
                <JournalCard delay={200}>
                  <Text style={[Typography.label, { color: colors.textTertiary, marginBottom: Spacing.md }]}>
                    DIFFICULTY BREAKDOWN
                  </Text>
                  {(['easy', 'medium', 'hard'] as const).map((diff) => {
                    const s = analytics.diffStats[diff];
                    const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                    const diffColor = diff === 'easy' ? '#22C55E' : diff === 'medium' ? '#F59E0B' : '#EF4444';
                    return (
                      <View key={diff} style={styles.diffRow}>
                        <View style={[styles.diffLabel, { backgroundColor: diffColor + '20' }]}>
                          <Text style={[styles.diffLabelText, { color: diffColor }]}>{diff.toUpperCase()}</Text>
                        </View>
                        <View style={styles.barBg}>
                          <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: diffColor }]} />
                        </View>
                        <Text style={[Typography.bodySm, { color: colors.textSecondary, width: 55, textAlign: 'right' }]}>
                          {s.correct}/{s.total}
                        </Text>
                      </View>
                    );
                  })}
                </JournalCard>
              )}

              {/* Chapter Performance */}
              {analytics && (
                <JournalCard delay={300}>
                  <Text style={[Typography.label, { color: colors.textTertiary, marginBottom: Spacing.md }]}>
                    CHAPTER PERFORMANCE
                  </Text>
                  {analytics.chapters.map((ch) => {
                    const meta = SUBJECT_META[ch.subjectId];
                    const barColor = ch.accuracy >= 70 ? '#22C55E' : ch.accuracy >= 40 ? '#F59E0B' : '#EF4444';
                    return (
                      <View key={ch.id} style={[styles.chapterRow, { borderBottomColor: colors.surfaceBorder }]}>
                        <View style={styles.chapterHeader}>
                          <Text style={[Typography.bodySm, { color: colors.text, flex: 1 }]} numberOfLines={1}>
                            {meta?.emoji} {ch.name}
                          </Text>
                          <Text style={[styles.chapterAccuracy, { color: barColor }]}>{ch.accuracy}%</Text>
                        </View>
                        <View style={styles.barBg}>
                          <View style={[styles.barFill, { width: `${ch.accuracy}%`, backgroundColor: barColor }]} />
                        </View>
                        <Text style={[styles.miniStat, { color: colors.textTertiary }]}>
                          {ch.correct} correct, {ch.wrong} wrong, {ch.total - ch.correct - ch.wrong} skipped
                        </Text>
                      </View>
                    );
                  })}
                </JournalCard>
              )}

              {/* Weak / Strong identification */}
              {analytics?.weakest && analytics?.strongest && (
                <View style={styles.weakStrongRow}>
                  <StickyNote color="pink" rotation={-1} delay={400}>
                    <Text style={[Typography.label, { color: '#EF4444', marginBottom: 4 }]}>NEEDS WORK</Text>
                    <Text style={[Typography.bodySm, { color: colors.text, lineHeight: 20 }]}>
                      {analytics.weakest.name}{'\n'}
                      {analytics.weakest.accuracy}% accuracy
                    </Text>
                  </StickyNote>
                  <StickyNote color="teal" rotation={1} delay={500}>
                    <Text style={[Typography.label, { color: '#22C55E', marginBottom: 4 }]}>STRONGEST</Text>
                    <Text style={[Typography.bodySm, { color: colors.text, lineHeight: 20 }]}>
                      {analytics.strongest.name}{'\n'}
                      {analytics.strongest.accuracy}% accuracy
                    </Text>
                  </StickyNote>
                </View>
              )}
            </>
          )}

          {/* Actions (shared) */}
          <View style={styles.actions}>
            <PuffyButton title="Review Answers" onPress={handleReview} variant="secondary" />
            <PuffyButton title="Retry Practice Exam" onPress={handleRetry} variant="ghost" />
            <PuffyButton title="Back to Dashboard" onPress={handleGoHome} />
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
  gradeBanner: {
    alignItems: 'center',
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
  },
  gradeEmoji: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  tabBar: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  tabText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
  },
  scoreCenter: {
    alignItems: 'center',
    paddingBottom: Spacing.lg,
  },
  scoreCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreNum: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 36,
  },
  scoreMax: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    marginTop: -4,
  },
  statStrip: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: Spacing.lg,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statVal: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 22,
  },
  statPoints: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 50,
    alignSelf: 'center',
  },
  subjectRow: {
    paddingBottom: Spacing.md,
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    gap: 6,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barBg: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    borderRadius: 4,
  },
  subjectStats: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  miniStat: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
  },
  // Analytics tab
  timeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  timeItem: {
    alignItems: 'center',
    gap: 4,
  },
  timeValue: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 18,
  },
  timeDivider: {
    width: 1,
    height: 36,
  },
  diffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  diffLabel: {
    width: 70,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  diffLabelText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  chapterRow: {
    paddingBottom: Spacing.sm,
    marginBottom: Spacing.sm,
    borderBottomWidth: 1,
    gap: 4,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  chapterAccuracy: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 14,
  },
  weakStrongRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  focusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  focusEmoji: {
    fontSize: 36,
  },
  focusInfo: {
    flex: 1,
  },
  focusAnalytics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  focusAnalyticsItem: {
    alignItems: 'center',
    gap: 4,
  },
  focusAnalyticsValue: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 28,
  },
  focusBadgeEmoji: {
    fontSize: 28,
  },
  actions: {
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
});
