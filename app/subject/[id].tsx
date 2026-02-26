import { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { StickyNote } from '../../src/components/ui/StickyNote';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { useTheme } from '../../src/hooks/useTheme';
import { usePersona } from '../../src/hooks/usePersona';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { getSubjects, getChapters, CatalogSubject, CatalogChapter } from '../../src/lib/catalog';
import { getProfile } from '../../src/lib/database';
import { evaluateSubjectStrength } from '../../src/lib/strengthEvaluator';
import { NEET_CHAPTERS } from '../../src/data/chapters';
import { RootState } from '../../src/store';
import {
  StrengthLevel,
  STRENGTH_LEVELS,
  NEEDS_FOCUS_CONFIG,
  ExamType,
} from '../../src/types';

function getStrengthConfig(level: StrengthLevel) {
  if (level === 'needs-focus') return NEEDS_FOCUS_CONFIG;
  return STRENGTH_LEVELS.find((s) => s.id === level) || STRENGTH_LEVELS[0];
}

// VaNi coaching messages per chapter strength — always positive
function getChapterCoaching(level: StrengthLevel, accuracy: number, _chapterName: string): string {
  if (level === 'needs-focus') {
    if (accuracy < 25) return `Every expert started here. One more round and you'll surprise yourself!`;
    return `You're building a foundation — one more practice and this will click.`;
  }
  if (level === 'just-started') return `Ready when you are! Let's see what you already know.`;
  if (level === 'getting-there') {
    return `Nice progress! ${Math.round(accuracy)}% and climbing. You're getting the hang of this.`;
  }
  if (level === 'on-track') {
    return `Looking great! ${Math.round(accuracy)}% accuracy. You're on a roll.`;
  }
  // strong
  return `You've crushed this! ${Math.round(accuracy)}% accuracy. Exam-ready!`;
}

// VaNi subject-level coaching — always encouraging
function getSubjectCoaching(
  level: StrengthLevel,
  accuracy: number,
  coverage: number,
  nextUpChapter: string | null,
): string {
  if (level === 'just-started') {
    return `Let's begin your journey! Pick a chapter and I'll guide you through it.`;
  }
  if (level === 'needs-focus') {
    return nextUpChapter
      ? `${Math.round(accuracy)}% accuracy so far — you're just getting started! I'd try "${nextUpChapter}" next, it'll boost your confidence.`
      : `${Math.round(accuracy)}% accuracy with ${Math.round(coverage)}% covered. Great start — keep going!`;
  }
  if (level === 'getting-there') {
    return nextUpChapter
      ? `${Math.round(accuracy)}% accuracy across ${Math.round(coverage)}% of questions — solid momentum! "${nextUpChapter}" is a great next step.`
      : `You're building momentum — ${Math.round(accuracy)}% accuracy. Keep it up!`;
  }
  if (level === 'on-track') {
    return `${Math.round(accuracy)}% accuracy across ${Math.round(coverage)}% coverage — looking strong! ${nextUpChapter ? `"${nextUpChapter}" is your best next move.` : 'Keep this energy going!'}`;
  }
  // strong
  return `${Math.round(accuracy)}% accuracy, ${Math.round(coverage)}% covered. You're exam-ready here!`;
}

// VaNi nudge for not-started chapters
function getNotStartedNudge(isRecommended: boolean, weightage: number): string | null {
  if (isRecommended) return `VaNi recommends this one next!`;
  if (weightage >= 8) return `High weightage — shows up often in exams`;
  if (weightage >= 5) return `Good weightage chapter`;
  return null;
}

export default function SubjectDetailScreen() {
  const { id, focus } = useLocalSearchParams<{ id: string; focus?: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const persona = usePersona();

  const [subject, setSubject] = useState<CatalogSubject | null>(null);
  const [chapters, setChapters] = useState<CatalogChapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [examFilter, setExamFilter] = useState<string | undefined>(undefined);

  // Redux strength data
  const strengthChapters = useSelector((state: RootState) => state.strength.chapters);
  const chapterHistory = useSelector((state: RootState) => state.practice.chapterHistory);

  // Animation
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const profile = await getProfile();
      const userExam: ExamType | null = profile?.exam ?? null;
      const allSubjects = await getSubjects();
      const found = allSubjects.find((s) => s.id === id);
      if (found) {
        setSubject(found);
        let filter: string | undefined;
        if (focus && (focus === 'NEET' || focus === 'CUET')) {
          filter = focus;
        } else if (userExam === 'BOTH') {
          filter = undefined;
        } else {
          filter = userExam ?? undefined;
        }
        setExamFilter(filter);
        let subjectChapters = await getChapters(id!, filter);

        // Fallback to local NEET_CHAPTERS if Supabase returned nothing
        if (subjectChapters.length === 0) {
          const localChapters = NEET_CHAPTERS.filter((c) => c.subjectId === id);
          subjectChapters = localChapters.map((c) => ({
            id: c.id,
            subject_id: c.subjectId,
            exam_ids: ['NEET'],
            branch: '',
            name: c.name,
            name_te: c.nameTe ?? c.name,
            chapter_number: 0,
            class_level: null,
            weightage: 0,
            avg_questions: c.questionCount,
            important_topics: [],
          }));
        }

        setChapters(subjectChapters);
      }
      setIsLoading(false);
    })();

    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [id, focus]);

  // Compute per-chapter analytics from Redux
  const chapterAnalytics = useMemo(() => {
    const catalogIds = new Set(chapters.map((ch) => ch.id));

    // Map catalog chapters to strength data
    const mapped = chapters.map((ch) => {
      const data = strengthChapters[ch.id];
      return {
        chapter: ch,
        coverage: data?.coverage ?? 0,
        accuracy: data?.accuracy ?? 0,
        totalAnswered: data?.totalAnswered ?? 0,
        correctCount: data?.correctCount ?? 0,
        totalInBank: data?.totalInBank ?? ch.avg_questions ?? 25,
        strengthLevel: (data?.strengthLevel ?? 'just-started') as StrengthLevel,
        lastPracticedAt: data?.lastPracticedAt ?? null,
      };
    });

    return mapped;
  }, [chapters, strengthChapters, id]);

  // Subject-level strength
  const subjectStrength = useMemo(() => {
    const evalData = chapterAnalytics.map((ca) => ({
      coverage: ca.coverage,
      accuracy: ca.accuracy,
      totalInBank: ca.totalInBank,
    }));
    return evaluateSubjectStrength(evalData);
  }, [chapterAnalytics]);

  const hasProgress = chapterAnalytics.some((ca) => ca.totalAnswered > 0);

  // Find VaNi's recommended next chapter (most room to grow)
  const nextUpChapter = useMemo(() => {
    const practiced = chapterAnalytics.filter((ca) => ca.totalAnswered > 0);
    if (practiced.length === 0) return null;
    // Pick the one with most room to grow (lowest accuracy among practiced)
    return practiced.reduce((best, ca) =>
      ca.accuracy < best.accuracy ? ca : best,
    );
  }, [chapterAnalytics]);

  // VaNi's recommended not-started chapter
  const recommendedNextId = useMemo(() => {
    const notStarted = chapterAnalytics.filter((ca) => ca.totalAnswered === 0);
    if (notStarted.length === 0) return null;
    // Prefer highest weightage, otherwise first in list
    const sorted = [...notStarted].sort((a, b) => (b.chapter.weightage ?? 0) - (a.chapter.weightage ?? 0));
    return sorted[0]?.chapter.id ?? null;
  }, [chapterAnalytics]);

  // Sort chapters: needs-focus first, then by coverage (ascending), then not-started last
  const sortedChapterAnalytics = useMemo(() => {
    return [...chapterAnalytics].sort((a, b) => {
      // Not started goes last
      if (a.totalAnswered === 0 && b.totalAnswered > 0) return 1;
      if (a.totalAnswered > 0 && b.totalAnswered === 0) return -1;
      // Needs-focus goes first
      if (a.strengthLevel === 'needs-focus' && b.strengthLevel !== 'needs-focus') return -1;
      if (a.strengthLevel !== 'needs-focus' && b.strengthLevel === 'needs-focus') return 1;
      // Then by accuracy ascending (most room to grow first)
      return a.accuracy - b.accuracy;
    });
  }, [chapterAnalytics]);

  // Find the latest chapter session that has wrong answers, per chapter
  const latestMistakeSession = useMemo(() => {
    const map: Record<string, string> = {}; // chapterId → sessionId
    for (const session of chapterHistory) {
      if (map[session.chapterId]) continue; // already found latest
      const wrongCount = session.answers.filter(
        (a) => a.selectedOptionId && a.selectedOptionId !== a.correctOptionId,
      ).length;
      if (wrongCount > 0) {
        map[session.chapterId] = session.id;
      }
    }
    return map;
  }, [chapterHistory]);

  // Find the latest completed session with wrong answers per chapter
  const latestMistakeSession = useMemo(() => {
    const map: Record<string, string> = {}; // chapterId → sessionId
    for (const session of chapterHistory) {
      if (!session.completedAt) continue;
      if (map[session.chapterId]) continue; // already have the latest (history is newest-first)
      const totalAnswered = session.answers.filter((a) => a.selectedOptionId).length;
      const wrongCount = totalAnswered - (session.correctCount ?? 0);
      if (wrongCount > 0) {
        map[session.chapterId] = session.id;
      }
    }
    return map;
  }, [chapterHistory]);

  const handleStartChapter = (chapterId: string) => {
    router.push(`/chapter/${chapterId}`);
  };

  if (!subject || isLoading) {
    return (
      <DotGridBackground>
        <SafeAreaView style={styles.container}>
          <Text style={[Typography.body, { color: colors.text }]}>Loading...</Text>
        </SafeAreaView>
      </DotGridBackground>
    );
  }

  const subjectConfig = getStrengthConfig(subjectStrength.level);

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}
        >
          {/* Back Button */}
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={[Typography.body, { color: colors.textSecondary }]}>
              {'\u2190'} Back
            </Text>
          </Pressable>

          {/* Subject Header */}
          <View style={styles.header}>
            <View
              style={[styles.subjectIconBg, { backgroundColor: subject.color + '20' }]}
            >
              <Text style={styles.subjectEmoji}>{subject.emoji}</Text>
            </View>
            <Text style={[Typography.h1, { color: colors.text, marginTop: Spacing.md }]}>
              {subject.name}
            </Text>
            {examFilter && (
              <View style={[styles.examBadge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[Typography.bodySm, { color: colors.primary, fontWeight: '600' }]}>
                  {examFilter === 'NEET' ? '\uD83E\uDE7A' : '\uD83C\uDF93'} {examFilter} Focus
                </Text>
              </View>
            )}
          </View>

          {/* ── Subject-level coaching card ── */}
          {hasProgress && (
            <JournalCard delay={100}>
              <View style={styles.coachingCard}>
                {/* Strength badge + stats row */}
                <View style={styles.statsRow}>
                  <View style={[styles.strengthBadge, { backgroundColor: subjectConfig.color + '18' }]}>
                    <View style={[styles.strengthDot, { backgroundColor: subjectConfig.color }]} />
                    <Text style={[styles.strengthLabel, { color: subjectConfig.color }]}>
                      {subjectConfig.label}
                    </Text>
                  </View>
                  <View style={styles.statChips}>
                    <View style={[styles.statChip, { backgroundColor: colors.surfaceBorder + '80' }]}>
                      <Text style={[styles.statNum, { color: colors.text }]}>
                        {Math.round(subjectStrength.accuracy)}%
                      </Text>
                      <Text style={[styles.statLabel, { color: colors.textTertiary }]}>acc</Text>
                    </View>
                    <View style={[styles.statChip, { backgroundColor: colors.surfaceBorder + '80' }]}>
                      <Text style={[styles.statNum, { color: colors.text }]}>
                        {Math.round(subjectStrength.coverage)}%
                      </Text>
                      <Text style={[styles.statLabel, { color: colors.textTertiary }]}>covered</Text>
                    </View>
                  </View>
                </View>

                {/* Subject progress bar */}
                <View style={[styles.progressBarBg, { backgroundColor: colors.surfaceBorder }]}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        backgroundColor: subjectConfig.color,
                        width: `${Math.min(subjectStrength.coverage, 100)}%`,
                      },
                    ]}
                  />
                </View>

                {/* VaNi coaching */}
                <Text style={[styles.coachingText, { color: colors.textSecondary }]}>
                  {getSubjectCoaching(
                    subjectStrength.level,
                    subjectStrength.accuracy,
                    subjectStrength.coverage,
                    nextUpChapter?.chapter.name ?? null,
                  )}
                </Text>
              </View>
            </JournalCard>
          )}

          {/* ── First time — no progress ── */}
          {!hasProgress && (
            <StickyNote color="yellow" rotation={-0.5} delay={100}>
              <HandwrittenText variant="handSm">
                Welcome to {subject.name}! {chapters.length > 0
                  ? `I'm excited to guide you through ${chapters.length} chapters.`
                  : "I'm excited to guide you through this journey."}
                {'\n\n'}Pick any chapter below and let's get started!
              </HandwrittenText>
            </StickyNote>
          )}

          {/* ── VaNi's next-up suggestion ── */}
          {hasProgress && nextUpChapter && nextUpChapter.strengthLevel !== 'strong' && (
            <StickyNote color="yellow" rotation={-0.5} delay={200}>
              <HandwrittenText variant="handSm">
                {nextUpChapter.accuracy < 40
                  ? `"${nextUpChapter.chapter.name}" has the most room to grow — one more round and you'll see a big jump!`
                  : `I'd pick "${nextUpChapter.chapter.name}" next — a little more practice and you'll be flying through it.`}
              </HandwrittenText>
            </StickyNote>
          )}

          {/* ── Chapter list ── */}
          <View style={styles.chapterList}>
            <HandwrittenText variant="hand" rotation={-0.5}>
              {hasProgress ? 'Your Chapters' : persona.labels.chapterListHeader}
            </HandwrittenText>

            {sortedChapterAnalytics.map((ca, idx) => {
              const chConfig = getStrengthConfig(ca.strengthLevel);
              const practiced = ca.totalAnswered > 0;

              const isLocked = persona.showLevels && idx > 0 && !hasProgress;

              return (
                <JournalCard key={ca.chapter.id} delay={250 + idx * 50}>
                  <Pressable
                    style={[styles.chapterCard, isLocked && { opacity: 0.45 }]}
                    onPress={() => !isLocked && handleStartChapter(ca.chapter.id)}
                    disabled={isLocked}
                  >
                    {/* Top row: number + name + strength badge */}
                    <View style={styles.chapterTopRow}>
                      <View style={[styles.chapterNumber, { backgroundColor: subject.color + '20' }]}>
                        <Text style={[Typography.bodySm, { color: subject.color, fontWeight: '700' }]}>
                          {isLocked ? '\uD83D\uDD12' : (ca.chapter.chapter_number || idx + 1)}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[Typography.body, { color: colors.text }]} numberOfLines={1}>
                          {ca.chapter.name}
                        </Text>
                        {ca.chapter.branch && (
                          <Text style={[styles.chapterMeta, { color: colors.textTertiary }]}>
                            {ca.chapter.branch} {ca.chapter.class_level ? `| Class ${ca.chapter.class_level}` : ''}
                            {ca.chapter.weightage > 0 ? ` | ${ca.chapter.weightage}% weightage` : ''}
                          </Text>
                        )}
                      </View>
                      {practiced && (
                        <View style={[styles.chapterBadge, { backgroundColor: chConfig.color + '18' }]}>
                          <Text style={[styles.chapterBadgeText, { color: chConfig.color }]}>
                            {chConfig.label}
                          </Text>
                        </View>
                      )}
                      {!practiced && !isLocked && (
                        <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>{'\u203A'}</Text>
                      )}
                    </View>

                    {/* Analytics section — only for practiced chapters */}
                    {practiced && (
                      <View style={styles.chapterAnalytics}>
                        {/* Accuracy + coverage bars */}
                        <View style={styles.barsSection}>
                          <View style={styles.barRow}>
                            <Text style={[styles.barLabel, { color: colors.textTertiary }]}>Accuracy</Text>
                            <View style={[styles.barBg, { backgroundColor: colors.surfaceBorder }]}>
                              <View
                                style={[
                                  styles.barFill,
                                  {
                                    backgroundColor: ca.accuracy >= 70 ? '#22C55E' : ca.accuracy >= 40 ? '#F59E0B' : '#EF4444',
                                    width: `${Math.min(ca.accuracy, 100)}%`,
                                  },
                                ]}
                              />
                            </View>
                            <Text style={[styles.barValue, { color: colors.text }]}>
                              {Math.round(ca.accuracy)}%
                            </Text>
                          </View>
                          <View style={styles.barRow}>
                            <Text style={[styles.barLabel, { color: colors.textTertiary }]}>Coverage</Text>
                            <View style={[styles.barBg, { backgroundColor: colors.surfaceBorder }]}>
                              <View
                                style={[
                                  styles.barFill,
                                  {
                                    backgroundColor: subject.color,
                                    width: `${Math.min(ca.coverage, 100)}%`,
                                  },
                                ]}
                              />
                            </View>
                            <Text style={[styles.barValue, { color: colors.text }]}>
                              {Math.round(ca.coverage)}%
                            </Text>
                          </View>
                        </View>

                        {/* Stats chips */}
                        <View style={styles.chapterStatsRow}>
                          <Text style={[styles.chapterStatText, { color: '#22C55E' }]}>
                            {ca.correctCount} correct
                          </Text>
                          <Text style={[styles.chapterStatText, { color: '#EF4444' }]}>
                            {ca.totalAnswered - ca.correctCount} wrong
                          </Text>
                          <Text style={[styles.chapterStatText, { color: colors.textTertiary }]}>
                            {ca.totalAnswered} answered
                          </Text>
                        </View>

                        {/* Important topics (from catalog) */}
                        {ca.chapter.important_topics && ca.chapter.important_topics.length > 0 && (
                          <View style={styles.topicsRow}>
                            {ca.chapter.important_topics.slice(0, 3).map((topic) => (
                              <View key={topic} style={[styles.topicChip, { backgroundColor: subject.color + '12' }]}>
                                <Text style={[styles.topicText, { color: subject.color }]} numberOfLines={1}>
                                  {topic}
                                </Text>
                              </View>
                            ))}
                          </View>
                        )}

                        {/* VaNi micro-coaching */}
                        <Text style={[styles.microCoaching, { color: colors.textSecondary }]}>
                          {getChapterCoaching(ca.strengthLevel, ca.accuracy, ca.chapter.name)}
                        </Text>

                        {/* Action buttons */}
                        <View style={styles.chapterActions}>
                          {/* Practice again CTA for chapters with room to grow */}
                          {(ca.strengthLevel === 'needs-focus' || ca.strengthLevel === 'getting-there') && (
                            <Pressable
                              style={[styles.practiceAgainButton, { backgroundColor: subject.color + '15' }]}
                              onPress={() => handleStartChapter(ca.chapter.id)}
                            >
                              <Text style={[styles.practiceAgainText, { color: subject.color }]}>
                                Practice again
                              </Text>
                            </Pressable>
                          )}

                          {/* Practice Mistakes — only if the latest session had wrong answers */}
                          {latestMistakeSession[ca.chapter.id] && (
                            <Pressable
                              style={[styles.practiceAgainButton, { backgroundColor: '#EF444415' }]}
                              onPress={() =>
                                router.push({
                                  pathname: '/practice-mistakes',
                                  params: {
                                    sessionId: latestMistakeSession[ca.chapter.id],
                                    sessionMode: 'chapter',
                                  },
                                })
                              }
                            >
                              <Text style={[styles.practiceAgainText, { color: '#EF4444' }]}>
                                Practice mistakes
                              </Text>
                            </Pressable>
                          )}
                        </View>
                      </View>
                    )}

                    {/* Not started — VaNi nudge */}
                    {!practiced && !isLocked && (() => {
                      const isRec = ca.chapter.id === recommendedNextId;
                      const nudge = getNotStartedNudge(isRec, ca.chapter.weightage ?? 0);
                      return (
                        <View style={styles.notStartedSection}>
                          {nudge && (
                            <View style={[styles.nudgeBadge, { backgroundColor: isRec ? subject.color + '15' : colors.surfaceBorder + '80' }]}>
                              <Text style={[styles.nudgeText, { color: isRec ? subject.color : colors.textSecondary }]}>
                                {nudge}
                              </Text>
                            </View>
                          )}
                          <Text style={[styles.notStartedText, { color: colors.textTertiary }]}>
                            {ca.chapter.avg_questions > 0 ? `~${ca.chapter.avg_questions} questions` : 'Tap to start'}
                          </Text>
                        </View>
                      );
                    })()}
                    {isLocked && (
                      <Text style={[styles.notStartedText, { color: colors.textTertiary }]}>
                        Complete previous level to unlock
                      </Text>
                    )}
                  </Pressable>
                </JournalCard>
              );
            })}
          </View>

          {/* Quick Practice CTA at bottom */}
          {hasProgress && (
            <JournalCard delay={400}>
              <Pressable
                style={[styles.quickPracticeCta, { backgroundColor: subject.color }]}
                onPress={() => router.push({ pathname: '/quick-practice/quiz', params: { subjectId: id } })}
              >
                <Text style={styles.quickPracticeText}>
                  {'\u26A1'} Quick Practice — {subject.name}
                </Text>
              </Pressable>
            </JournalCard>
          )}

          {/* Strong subject — VaNi congrats */}
          {hasProgress && subjectStrength.level === 'strong' && (
            <StickyNote color="teal" rotation={0.5} delay={500}>
              <HandwrittenText variant="handSm">
                You're doing amazing in {subject.name}! Keep revising to stay exam-ready.
              </HandwrittenText>
            </StickyNote>
          )}
        </Animated.ScrollView>
      </SafeAreaView>
    </DotGridBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: 40 },
  backButton: { alignSelf: 'flex-start', paddingVertical: Spacing.xs },

  // Header
  header: { alignItems: 'center', gap: Spacing.xs },
  subjectIconBg: {
    width: 80,
    height: 80,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectEmoji: { fontSize: 40 },
  examBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: Spacing.xs,
  },

  // Coaching card (subject-level)
  coachingCard: { gap: Spacing.sm },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  strengthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  strengthDot: { width: 7, height: 7, borderRadius: 4 },
  strengthLabel: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 12 },
  statChips: { flexDirection: 'row', gap: Spacing.sm },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  statNum: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13 },
  statLabel: { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 11 },
  progressBarBg: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: 6, borderRadius: 3 },
  coachingText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 19,
  },

  // Chapter list
  chapterList: { gap: Spacing.sm },

  // Chapter card
  chapterCard: { gap: Spacing.sm },
  chapterTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  chapterNumber: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterMeta: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
    lineHeight: 15,
    marginTop: 1,
  },
  chapterBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  chapterBadgeText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 10,
  },

  // Chapter analytics
  chapterAnalytics: { gap: Spacing.sm, paddingLeft: 48 },
  barsSection: { gap: 6 },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barLabel: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 10,
    width: 52,
  },
  barBg: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: 6, borderRadius: 3 },
  barValue: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    width: 32,
    textAlign: 'right',
  },
  chapterStatsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  chapterStatText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
  },
  topicsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  topicChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  topicText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 10,
  },
  microCoaching: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 17,
  },
  chapterActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  practiceAgainButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 10,
  },
  practiceAgainText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
  },

  // Not started
  notStartedSection: {
    paddingLeft: 48,
    gap: 4,
  },
  nudgeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  nudgeText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 10,
  },
  notStartedText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
  },

  // Quick practice CTA
  quickPracticeCta: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
  },
  quickPracticeText: {
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
  },
});
