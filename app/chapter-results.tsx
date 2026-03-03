import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';

import { DotGridBackground } from '../src/components/ui/DotGridBackground';
import { JournalCard } from '../src/components/ui/JournalCard';
import { StickyNote } from '../src/components/ui/StickyNote';
import { HandwrittenText } from '../src/components/ui/HandwrittenText';
import { PuffyButton } from '../src/components/ui/PuffyButton';
import { useTheme } from '../src/hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../src/constants/theme';
import { SUBJECT_META } from '../src/constants/subjects';
import { getChapterById } from '../src/data/chapters';
import { getV2QuestionsByChapter } from '../src/data/questions';
import { fetchQuestionsByChapter } from '../src/lib/questions';
import { getCorrectId, resolveLegacyChapterId } from '../src/lib/questionAdapter';
import { RootState } from '../src/store';
import { NeetSubjectId, QuestionV2 } from '../src/types';

export default function ChapterResultsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { chapterId: rawChapterId, correct, total, timeUsedMs: timeParam, skipped: skippedParam } = useLocalSearchParams<{
    chapterId: string;
    correct: string;
    total: string;
    timeUsedMs: string;
    skipped: string;
  }>();
  const language = useSelector((state: RootState) => state.auth.user?.language ?? 'en');

  // Resolve legacy chapter IDs so results screen works with old IDs
  const chapterId = rawChapterId ? resolveLegacyChapterId(rawChapterId) : rawChapterId;

  const isQuickMode = chapterId?.startsWith('quick-') ?? false;
  const quickSubjectId = isQuickMode ? chapterId!.replace('quick-', '') as NeetSubjectId : null;
  const chapter = chapterId && !isQuickMode ? getChapterById(chapterId) : null;
  const subjectMeta = isQuickMode
    ? (quickSubjectId ? SUBJECT_META[quickSubjectId] : null)
    : (chapter ? SUBJECT_META[chapter.subjectId] : null);
  const questions = useMemo(() => (chapterId && !isQuickMode ? getV2QuestionsByChapter(chapterId) : []), [chapterId, isQuickMode]);

  // Fetch Supabase questions (cached from quiz session) for topic data
  const [dbQuestions, setDbQuestions] = useState<QuestionV2[]>([]);
  useEffect(() => {
    if (!chapterId || isQuickMode) return;
    fetchQuestionsByChapter(chapterId).then((result) => {
      if (result.ok) setDbQuestions(result.questions);
    });
  }, [chapterId, isQuickMode]);

  const correctNum = parseInt(correct ?? '0', 10);
  const totalNum = parseInt(total ?? '0', 10);
  const skippedNum = parseInt(skippedParam ?? '0', 10);
  const wrongNum = totalNum - correctNum - skippedNum;
  const percentage = totalNum > 0 ? Math.round((correctNum / totalNum) * 100) : 0;
  const timeUsedMs = parseInt(timeParam ?? '0', 10);

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}m ${s}s`;
  };

  // Difficulty breakdown from the last session answers in Redux
  const lastSession = useSelector((state: RootState) => {
    const h = state.practice.chapterHistory;
    return h.length > 0 ? h[0] : null;
  });

  const difficultyStats = useMemo(() => {
    if (!lastSession || !questions.length) return null;
    const stats = { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } };
    for (const q of questions) {
      stats[q.difficulty].total++;
      const ans = lastSession.answers.find((a) => a.questionId === q.id);
      if (ans?.selectedOptionId === getCorrectId(q)) {
        stats[q.difficulty].correct++;
      }
    }
    return stats;
  }, [lastSession, questions]);

  // Question type breakdown
  const typeStats = useMemo(() => {
    if (!lastSession || !questions.length) return null;
    const stats: Record<string, { correct: number; total: number; label: string }> = {};
    for (const q of questions) {
      if (!stats[q.type]) {
        const label = q.type.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        stats[q.type] = { correct: 0, total: 0, label };
      }
      stats[q.type].total++;
      const ans = lastSession.answers.find((a) => a.questionId === q.id);
      if (ans?.selectedOptionId === getCorrectId(q)) {
        stats[q.type].correct++;
      }
    }
    return Object.entries(stats).filter(([, v]) => v.total > 0);
  }, [lastSession, questions]);

  // Topic breakdown (uses Supabase questions with topicId/topicName)
  const topicStats = useMemo(() => {
    if (!lastSession || !dbQuestions.length) return null;
    const answeredIds = new Set(lastSession.answers.map((a) => a.questionId));
    const stats: Record<string, { correct: number; total: number; name: string; nameTe: string }> = {};
    for (const q of dbQuestions) {
      if (!q.topicId || !q.topicName) continue;
      if (!answeredIds.has(q.id)) continue;
      if (!stats[q.topicId]) {
        stats[q.topicId] = { correct: 0, total: 0, name: q.topicName, nameTe: q.topicNameTe || '' };
      }
      stats[q.topicId].total++;
      const ans = lastSession.answers.find((a) => a.questionId === q.id);
      if (ans?.selectedOptionId === getCorrectId(q)) {
        stats[q.topicId].correct++;
      }
    }
    const entries = Object.entries(stats).filter(([, v]) => v.total > 0);
    return entries.length > 0 ? entries : null;
  }, [lastSession, dbQuestions]);

  const getGrade = () => {
    if (percentage >= 90) return { label: 'Excellent!', emoji: '🌟', color: '#22C55E' };
    if (percentage >= 70) return { label: 'Good Job!', emoji: '👍', color: '#3B82F6' };
    if (percentage >= 50) return { label: 'Keep Going', emoji: '💪', color: '#F59E0B' };
    return { label: 'Needs Practice', emoji: '📖', color: '#EF4444' };
  };

  const grade = getGrade();

  const handleRetry = () => {
    if (isQuickMode && quickSubjectId) {
      router.replace({ pathname: '/quick-practice/quiz', params: { subjectId: quickSubjectId } });
    } else if (chapterId) {
      router.replace({ pathname: '/chapter/[id]', params: { id: chapterId } });
    }
  };

  const handleBackToSubjects = () => {
    router.replace('/(main)');
  };

  const handleGoHome = () => {
    router.replace('/(main)');
  };

  const handleReview = () => {
    if (lastSession) {
      router.push({ pathname: '/answer-review', params: { sessionId: lastSession.id } });
    }
  };

  if (!subjectMeta) return null;
  if (!isQuickMode && !chapter) return null;

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Grade Banner */}
          <View style={[styles.gradeBanner, { backgroundColor: grade.color + '15' }]}>
            <Text style={styles.gradeEmoji}>{grade.emoji}</Text>
            <HandwrittenText variant="hand">{grade.label}</HandwrittenText>
            <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 4 }]}>
              {subjectMeta.emoji} {isQuickMode ? `Quick Practice — ${subjectMeta.name}` : (language === 'te' && chapter ? chapter.nameTe : chapter?.name)}
            </Text>
          </View>

          {/* Score Circle */}
          <JournalCard delay={100} style={styles.scoreCard}>
            <View style={styles.scoreRow}>
              <View style={[styles.scoreCircle, { borderColor: grade.color }]}>
                <Text style={[styles.scorePercent, { color: grade.color }]}>{percentage}%</Text>
              </View>
              <View style={styles.scoreDetails}>
                <View style={styles.scoreItem}>
                  <View style={[styles.dot, { backgroundColor: '#22C55E' }]} />
                  <Text style={[Typography.body, { color: colors.text }]}>{correctNum} Correct</Text>
                </View>
                <View style={styles.scoreItem}>
                  <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
                  <Text style={[Typography.body, { color: colors.text }]}>{wrongNum} Wrong</Text>
                </View>
                {skippedNum > 0 && (
                  <View style={styles.scoreItem}>
                    <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
                    <Text style={[Typography.body, { color: colors.text }]}>{skippedNum} Skipped</Text>
                  </View>
                )}
                <View style={styles.scoreItem}>
                  <View style={[styles.dot, { backgroundColor: '#64748B' }]} />
                  <Text style={[Typography.body, { color: colors.text }]}>{totalNum} Total</Text>
                </View>
                {timeUsedMs > 0 && (
                  <View style={styles.scoreItem}>
                    <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                    <Text style={[Typography.body, { color: colors.text }]}>{formatTime(timeUsedMs)}</Text>
                  </View>
                )}
              </View>
            </View>
          </JournalCard>

          {/* Difficulty Breakdown */}
          {difficultyStats && (
            <JournalCard delay={200} style={styles.diffCard}>
              <Text style={[Typography.label, { color: colors.textTertiary, marginBottom: Spacing.md }]}>
                DIFFICULTY BREAKDOWN
              </Text>
              {(['easy', 'medium', 'hard'] as const).map((diff) => {
                const s = difficultyStats[diff];
                const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                const diffColor =
                  diff === 'easy' ? '#22C55E' : diff === 'medium' ? '#F59E0B' : '#EF4444';

                return (
                  <View key={diff} style={styles.diffRow}>
                    <View style={[styles.diffLabel, { backgroundColor: diffColor + '20' }]}>
                      <Text style={[styles.diffLabelText, { color: diffColor }]}>
                        {diff.toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.diffBarBg}>
                      <View
                        style={[styles.diffBarFill, { width: `${pct}%`, backgroundColor: diffColor }]}
                      />
                    </View>
                    <Text style={[Typography.bodySm, { color: colors.textSecondary, width: 60, textAlign: 'right' }]}>
                      {s.correct}/{s.total}
                    </Text>
                  </View>
                );
              })}
            </JournalCard>
          )}

          {/* Question Type Breakdown */}
          {typeStats && typeStats.length > 1 && (
            <JournalCard delay={250}>
              <Text style={[Typography.label, { color: colors.textTertiary, marginBottom: Spacing.md }]}>
                QUESTION TYPES
              </Text>
              {typeStats.map(([type, stat]) => {
                const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                return (
                  <View key={type} style={styles.diffRow}>
                    <View style={[styles.typeLabel, { backgroundColor: colors.primary + '15' }]}>
                      <Text style={[styles.typeLabelText, { color: colors.primary }]} numberOfLines={1}>
                        {stat.label}
                      </Text>
                    </View>
                    <View style={styles.diffBarBg}>
                      <View style={[styles.diffBarFill, { width: `${pct}%`, backgroundColor: colors.primary }]} />
                    </View>
                    <Text style={[Typography.bodySm, { color: colors.textSecondary, width: 60, textAlign: 'right' }]}>
                      {stat.correct}/{stat.total}
                    </Text>
                  </View>
                );
              })}
            </JournalCard>
          )}

          {/* Topic Breakdown */}
          {topicStats && topicStats.length > 0 && (
            <JournalCard delay={300}>
              <Text style={[Typography.label, { color: colors.textTertiary, marginBottom: Spacing.md }]}>
                TOPIC PERFORMANCE
              </Text>
              {topicStats
                .sort(([, a], [, b]) => {
                  const aPct = a.total > 0 ? a.correct / a.total : 0;
                  const bPct = b.total > 0 ? b.correct / b.total : 0;
                  return aPct - bPct;
                })
                .map(([topicId, stat]) => {
                  const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                  const barColor = pct >= 70 ? '#22C55E' : pct >= 40 ? '#F59E0B' : '#EF4444';
                  const displayName = language === 'te' && stat.nameTe ? stat.nameTe : stat.name;
                  return (
                    <View key={topicId} style={styles.topicRow}>
                      <View style={styles.topicHeader}>
                        <Text style={[styles.topicName, { color: colors.text }]} numberOfLines={1}>
                          {displayName}
                        </Text>
                        <Text style={[styles.topicAccuracy, { color: barColor }]}>{pct}%</Text>
                      </View>
                      <View style={styles.diffBarBg}>
                        <View style={[styles.diffBarFill, { width: `${pct}%`, backgroundColor: barColor }]} />
                      </View>
                      <Text style={[styles.topicDetail, { color: colors.textTertiary }]}>
                        {stat.correct}/{stat.total} correct
                      </Text>
                    </View>
                  );
                })}
            </JournalCard>
          )}

          {/* Motivational Note */}
          <StickyNote color="yellow" rotation={1} delay={300}>
            <Text style={[Typography.bodySm, { color: colors.text }]}>
              {percentage >= 70
                ? 'Strong foundation! Try the other chapter or take a full Practice Exam.'
                : 'Review the explanations and elimination techniques, then retry this chapter.'}
            </Text>
          </StickyNote>

          {/* Actions */}
          <View style={styles.actions}>
            <PuffyButton title="Review Answers" onPress={handleReview} variant="secondary" />
            {wrongNum > 0 && lastSession && (
              <PuffyButton
                title="Practice My Mistakes"
                onPress={() =>
                  router.push({
                    pathname: '/practice-mistakes',
                    params: { sessionId: lastSession.id, sessionMode: 'chapter' },
                  })
                }
                variant="ghost"
              />
            )}
            <PuffyButton title={isQuickMode ? 'Try Again' : 'Retry Chapter'} onPress={handleRetry} variant="ghost" />
            {!isQuickMode && <PuffyButton title="Pick Another Subject" onPress={handleBackToSubjects} variant="ghost" />}
            <PuffyButton title="Back to Dashboard" onPress={handleGoHome} variant="ghost" />
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
  scoreCard: {},
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scorePercent: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 28,
  },
  scoreDetails: {
    flex: 1,
    gap: Spacing.sm,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  diffCard: {},
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
  diffBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  diffBarFill: {
    height: 8,
    borderRadius: 4,
  },
  typeLabel: {
    width: 100,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  typeLabelText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 10,
    letterSpacing: 0.3,
  },
  topicRow: {
    marginBottom: Spacing.sm,
    gap: 3,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  topicName: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 12,
    flex: 1,
  },
  topicAccuracy: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 12,
  },
  topicDetail: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 10,
  },
  actions: {
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
});
