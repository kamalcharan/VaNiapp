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
import { TopicBreakdown, TopicStat } from '../src/components/TopicBreakdown';
import { useTheme } from '../src/hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../src/constants/theme';
import { SUBJECT_META } from '../src/constants/subjects';
import { getChapterById } from '../src/data/chapters';
import { getV2QuestionsByChapter } from '../src/data/questions';
import { fetchQuestionsByChapter } from '../src/lib/questions';
import { getCorrectId, resolveLegacyChapterId } from '../src/lib/questionAdapter';
import { RootState } from '../src/store';
import { NeetSubjectId, QuestionV2, t } from '../src/types';

/** Derive subjectId from chapterId prefix when local chapter data is unavailable */
function deriveSubjectFromChapterId(chapterId: string | undefined): string | null {
  if (!chapterId) return null;
  // CUET prefixes (check before NEET since 'cuet-phy-' contains 'phy-')
  if (chapterId.startsWith('cuet-phy-')) return 'cuet-physics';
  if (chapterId.startsWith('cuet-chem-')) return 'cuet-chemistry';
  if (chapterId.startsWith('cuet-math-')) return 'mathematics';
  if (chapterId.startsWith('cuet-bio-')) return 'biology';
  if (chapterId.startsWith('cuet-agri-')) return 'agriculture';
  if (chapterId.startsWith('cuet-eg-')) return 'engineering-graphics';
  if (chapterId.startsWith('cuet-acc-')) return 'accountancy';
  if (chapterId.startsWith('cuet-bst-') || chapterId.startsWith('bst-')) return 'business-studies';
  if (chapterId.startsWith('cuet-eco-')) return 'economics';
  if (chapterId.startsWith('cuet-ent-')) return 'entrepreneurship';
  if (chapterId.startsWith('cuet-hist-')) return 'history';
  if (chapterId.startsWith('cuet-geo-')) return 'geography';
  if (chapterId.startsWith('cuet-pol-')) return 'political-science';
  if (chapterId.startsWith('cuet-soc-')) return 'sociology';
  if (chapterId.startsWith('cuet-psy-')) return 'psychology';
  if (chapterId.startsWith('cuet-phil-')) return 'philosophy';
  if (chapterId.startsWith('cuet-anth-')) return 'anthropology';
  if (chapterId.startsWith('cuet-cs-')) return 'computer-science';
  if (chapterId.startsWith('cuet-env-')) return 'environmental-studies';
  if (chapterId.startsWith('cuet-pe-')) return 'physical-education';
  if (chapterId.startsWith('cuet-fa-')) return 'fine-arts';
  if (chapterId.startsWith('cuet-hs-')) return 'home-science';
  if (chapterId.startsWith('cuet-mm-')) return 'mass-media';
  if (chapterId.startsWith('cuet-gt-')) return 'general-test';
  // NEET prefixes
  if (chapterId.startsWith('zoo-')) return 'zoology';
  if (chapterId.startsWith('bot-')) return 'botany';
  if (chapterId.startsWith('phy-')) return 'physics';
  if (chapterId.startsWith('chem-')) return 'chemistry';
  return null;
}

export default function ChapterResultsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { chapterId: rawChapterId, correct, total, timeUsedMs: timeParam, skipped: skippedParam, subjectId: subjectIdParam } = useLocalSearchParams<{
    chapterId: string;
    correct: string;
    total: string;
    timeUsedMs: string;
    skipped: string;
    subjectId: string;
  }>();
  const language = useSelector((state: RootState) => state.auth.user?.language ?? 'en');

  // Resolve legacy chapter IDs so results screen works with old IDs
  const chapterId = rawChapterId ? resolveLegacyChapterId(rawChapterId) : rawChapterId;

  const isQuickMode = chapterId?.startsWith('quick-') ?? false;
  const quickSubjectId = isQuickMode ? chapterId!.replace('quick-', '') as NeetSubjectId : null;
  const chapter = chapterId && !isQuickMode ? getChapterById(chapterId) : null;

  // Derive subjectId: try explicit param first, then local chapter lookup, then prefix mapping
  const rawSubjectId = isQuickMode
    ? quickSubjectId
    : subjectIdParam || chapter?.subjectId || deriveSubjectFromChapterId(chapterId);

  const DEFAULT_META = { name: 'Practice', emoji: '\u26A1', color: '#3B82F6' };
  const subjectMeta = rawSubjectId
    ? (SUBJECT_META[rawSubjectId] ?? {
        name: rawSubjectId.charAt(0).toUpperCase() + rawSubjectId.slice(1).replace(/-/g, ' '),
        emoji: '\u26A1',
        color: '#3B82F6',
      })
    : DEFAULT_META;
  const localQuestions = useMemo(() => (chapterId && !isQuickMode ? getV2QuestionsByChapter(chapterId) : []), [chapterId, isQuickMode]);

  // Fetch Supabase questions (cached from quiz session) for stats + topic data
  const [dbQuestions, setDbQuestions] = useState<QuestionV2[]>([]);
  useEffect(() => {
    if (!chapterId || isQuickMode) return;
    fetchQuestionsByChapter(chapterId).then((result) => {
      if (result.ok) setDbQuestions(result.questions);
    });
  }, [chapterId, isQuickMode]);

  // Use local questions if available, otherwise Supabase questions (for CUET chapters etc.)
  const questions = localQuestions.length > 0 ? localQuestions : dbQuestions;

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
    const stats: Record<string, TopicStat> = {};
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

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Grade Banner */}
          <View style={[styles.gradeBanner, { backgroundColor: grade.color + '15' }]}>
            <Text style={styles.gradeEmoji}>{grade.emoji}</Text>
            <HandwrittenText variant="hand">{grade.label}</HandwrittenText>
            <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 4 }]}>
              {subjectMeta.emoji} {isQuickMode ? `Quick Practice — ${subjectMeta.name}` : (chapter ? t(language, chapter.name, chapter.nameTe, chapter.nameHi) : `${subjectMeta.name} — Chapter Practice`)}
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
              <TopicBreakdown topics={topicStats} language={language} label="TOPIC PERFORMANCE" />
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
                    params: { chapterId: chapterId! },
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
  actions: {
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
});
