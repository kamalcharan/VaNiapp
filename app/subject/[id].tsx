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

// VaNi coaching messages per chapter strength
function getChapterCoaching(level: StrengthLevel, accuracy: number, chapterName: string): string {
  if (level === 'needs-focus') {
    if (accuracy < 25) return `This one's tricky — but that's okay. Let's go through it slowly together.`;
    return `You're close to getting this. A focused retry will make the difference.`;
  }
  if (level === 'just-started') return `Ready when you are! Let's see what you know.`;
  if (level === 'getting-there') {
    return `Good start! ${Math.round(accuracy)}% accuracy — let's push past 55%.`;
  }
  if (level === 'on-track') {
    return `Solid work! ${Math.round(accuracy)}% accuracy. Keep this up.`;
  }
  // strong
  return `You've nailed this! ${Math.round(accuracy)}% accuracy.`;
}

// VaNi subject-level coaching
function getSubjectCoaching(
  level: StrengthLevel,
  accuracy: number,
  coverage: number,
  weakestChapter: string | null,
): string {
  if (level === 'just-started') {
    return `Let's begin your journey! Pick a chapter and I'll guide you through it.`;
  }
  if (level === 'needs-focus') {
    return weakestChapter
      ? `Your accuracy is ${Math.round(accuracy)}% overall. I'd focus on "${weakestChapter}" first — that's where we can improve the most.`
      : `${Math.round(accuracy)}% accuracy with ${Math.round(coverage)}% coverage. Let's work on getting those fundamentals right.`;
  }
  if (level === 'getting-there') {
    return weakestChapter
      ? `${Math.round(accuracy)}% accuracy across ${Math.round(coverage)}% of questions. "${weakestChapter}" needs the most attention.`
      : `You're building momentum — ${Math.round(accuracy)}% accuracy. Keep practicing!`;
  }
  if (level === 'on-track') {
    return `${Math.round(accuracy)}% accuracy across ${Math.round(coverage)}% coverage — strong foundation! ${weakestChapter ? `"${weakestChapter}" could use one more round.` : 'Keep pushing!'}`;
  }
  // strong
  return `${Math.round(accuracy)}% accuracy, ${Math.round(coverage)}% coverage. You're exam-ready here!`;
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

    // Merge any Redux strength entries for this subject that weren't matched
    // (handles ID mismatch between catalog and question data)
    const unmatchedRedux = Object.values(strengthChapters).filter(
      (ch) => ch.subjectId === id && !catalogIds.has(ch.chapterId),
    );
    for (const data of unmatchedRedux) {
      // Find matching local chapter name from NEET_CHAPTERS
      const localCh = NEET_CHAPTERS.find((c) => c.id === data.chapterId);
      mapped.push({
        chapter: {
          id: data.chapterId,
          subject_id: data.subjectId,
          exam_ids: ['NEET'],
          branch: '',
          name: localCh?.name ?? data.chapterId.replace(/^[^-]+-/, '').replace(/-/g, ' '),
          name_te: localCh?.nameTe ?? '',
          chapter_number: 0,
          class_level: null,
          weightage: 0,
          avg_questions: data.totalInBank,
          important_topics: [],
        },
        coverage: data.coverage,
        accuracy: data.accuracy,
        totalAnswered: data.totalAnswered,
        correctCount: data.correctCount,
        totalInBank: data.totalInBank,
        strengthLevel: data.strengthLevel as StrengthLevel,
        lastPracticedAt: data.lastPracticedAt,
      });
    }

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

  // Find weakest and strongest chapters
  const weakestChapter = useMemo(() => {
    const practiced = chapterAnalytics.filter((ca) => ca.totalAnswered > 0);
    if (practiced.length === 0) return null;
    return practiced.reduce((weakest, ca) =>
      ca.accuracy < weakest.accuracy ? ca : weakest,
    );
  }, [chapterAnalytics]);

  const strongestChapter = useMemo(() => {
    const practiced = chapterAnalytics.filter((ca) => ca.totalAnswered > 0);
    if (practiced.length === 0) return null;
    return practiced.reduce((strongest, ca) =>
      ca.accuracy > strongest.accuracy ? ca : strongest,
    );
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
      // Then by accuracy ascending (weakest first)
      return a.accuracy - b.accuracy;
    });
  }, [chapterAnalytics]);

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
                    weakestChapter?.chapter.name ?? null,
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

          {/* ── VaNi suggestion for weakest chapter ── */}
          {hasProgress && weakestChapter && weakestChapter.strengthLevel !== 'strong' && (
            <StickyNote
              color={weakestChapter.strengthLevel === 'needs-focus' ? 'pink' : 'yellow'}
              rotation={-0.5}
              delay={200}
            >
              <HandwrittenText variant="handSm">
                {weakestChapter.strengthLevel === 'needs-focus'
                  ? `"${weakestChapter.chapter.name}" needs your attention — ${Math.round(weakestChapter.accuracy)}% accuracy. Want to give it another shot?`
                  : `I'd suggest working on "${weakestChapter.chapter.name}" next — it's your weakest area at ${Math.round(weakestChapter.accuracy)}%.`}
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
              const isWeak = ca.strengthLevel === 'needs-focus';
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

                        {/* Retry CTA for weak chapters */}
                        {isWeak && (
                          <Pressable
                            style={[styles.retryButton, { backgroundColor: '#EF444418' }]}
                            onPress={() => handleStartChapter(ca.chapter.id)}
                          >
                            <Text style={[styles.retryText, { color: '#EF4444' }]}>
                              Retry this chapter
                            </Text>
                          </Pressable>
                        )}
                      </View>
                    )}

                    {/* Not started — light prompt */}
                    {!practiced && !isLocked && (
                      <Text style={[styles.notStartedText, { color: colors.textTertiary }]}>
                        {ca.chapter.avg_questions > 0 ? `~${ca.chapter.avg_questions} questions` : 'Tap to start'}
                      </Text>
                    )}
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
  retryButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  retryText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
  },

  // Not started
  notStartedText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
    paddingLeft: 48,
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
