import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import * as Haptics from 'expo-haptics';

import { DotGridBackground } from '../src/components/ui/DotGridBackground';
import { JournalCard } from '../src/components/ui/JournalCard';
import { HandwrittenText } from '../src/components/ui/HandwrittenText';
import { QuestionRenderer } from '../src/components/exam/QuestionRenderer';
import { ConfettiBurst } from '../src/components/ui/ConfettiBurst';
import { WrongAnswerCard } from '../src/components/exam/WrongAnswerCard';
import { AskVaniSheet } from '../src/components/AskVaniSheet';
import { ConceptExplainerSheet } from '../src/components/exam/ConceptExplainerSheet';
import { PuffyButton } from '../src/components/ui/PuffyButton';
import { useTheme } from '../src/hooks/useTheme';
import { usePersona } from '../src/hooks/usePersona';
import { Typography, Spacing, BorderRadius } from '../src/constants/theme';
import { RootState } from '../src/store';
import { recordChapterAttempt } from '../src/store/slices/strengthSlice';
import { toggleBookmark } from '../src/store/slices/bookmarkSlice';
import { useToast } from '../src/components/ui/Toast';
import { getCorrectId } from '../src/lib/questionAdapter';
import { fetchQuestionsByChapter } from '../src/lib/questions';
import { reportError } from '../src/lib/errorReporting';
import { QuestionV2, SubjectId } from '../src/types';

const DIFF_COLORS = { easy: '#22C55E', medium: '#F59E0B', hard: '#EF4444' };

export default function PracticeMistakesScreen() {
  const { colors, mode } = useTheme();
  const persona = usePersona();
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useToast();
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
  const language = useSelector((state: RootState) => state.auth.user?.language ?? 'en');
  const bookmarkedIds = useSelector((state: RootState) => state.bookmark.ids);

  // Get wrong question IDs from strength data
  const chapterStrength = useSelector(
    (state: RootState) => chapterId ? state.strength.chapters[chapterId] : undefined,
  );

  // Fetch questions from Supabase and filter to wrong ones
  const [wrongQuestions, setWrongQuestions] = useState<QuestionV2[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chapterId || !chapterStrength?.questionResults) {
      setIsLoading(false);
      return;
    }

    // Find question IDs answered wrong (value === false, skip remote-* placeholders)
    const wrongIds = new Set<string>();
    for (const [qid, correct] of Object.entries(chapterStrength.questionResults)) {
      if (!correct && !qid.startsWith('remote-')) {
        wrongIds.add(qid);
      }
    }

    if (wrongIds.size === 0) {
      setIsLoading(false);
      return;
    }

    fetchQuestionsByChapter(chapterId)
      .then((result) => {
        if (result.ok) {
          const wrong = result.questions.filter((q) => wrongIds.has(q.id));
          setWrongQuestions(wrong);
        }
      })
      .catch((e) => reportError(e, 'medium', 'PracticeMistakes.fetchQuestions'))
      .finally(() => setIsLoading(false));
  }, [chapterId, chapterStrength?.questionResults]);

  // Quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);
  const [showVaniSheet, setShowVaniSheet] = useState(false);
  const [showConceptSheet, setShowConceptSheet] = useState(false);
  const [selectedConceptTag, setSelectedConceptTag] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const question = wrongQuestions[currentIndex];
  const isBookmarked = question ? bookmarkedIds.includes(question.id) : false;
  const correctId = question ? getCorrectId(question) : '';
  const isCorrect = selectedOptionId === correctId;

  const correctCount = useMemo(() => {
    return Object.entries(answers).filter(([qId]) => {
      const q = wrongQuestions.find((qq) => qq.id === qId);
      return q ? answers[qId] === getCorrectId(q) : false;
    }).length;
  }, [answers, wrongQuestions]);

  const handleSelectOption = (optionId: string) => {
    if (showFeedback || !question) return;
    setSelectedOptionId(optionId);
    setShowFeedback(true);

    const correct = optionId === correctId;
    Haptics.impactAsync(
      correct ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Heavy,
    );

    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));

    if (correct) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }
  };

  const handleNext = () => {
    if (!question) return;

    if (currentIndex >= wrongQuestions.length - 1) {
      // Record the re-attempt results back to strength data
      if (chapterId) {
        const answeredQuestions = Object.entries({ ...answers, [question.id]: selectedOptionId! }).map(([qId, optId]) => {
          const q = wrongQuestions.find((qq) => qq.id === qId);
          return {
            questionId: qId,
            correct: q ? optId === getCorrectId(q) : false,
          };
        });
        dispatch(recordChapterAttempt({
          chapterId,
          subjectId: wrongQuestions[0]?.subjectId ?? '',
          totalInBank: chapterStrength?.totalInBank ?? 25,
          answeredQuestions,
        }));
      }
      setFinished(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedOptionId(null);
    setShowFeedback(false);
    setShowVaniSheet(false);
    setShowConceptSheet(false);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <DotGridBackground>
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[Typography.body, { color: colors.textSecondary, marginTop: Spacing.md }]}>
              Loading your mistakes...
            </Text>
          </View>
        </SafeAreaView>
      </DotGridBackground>
    );
  }

  // ── No wrong questions ──
  if (wrongQuestions.length === 0) {
    return (
      <DotGridBackground>
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 48, marginBottom: Spacing.md }}>{'🎉'}</Text>
            <Text style={[Typography.h3, { color: colors.text, textAlign: 'center' }]}>
              No mistakes to practice!
            </Text>
            <Text
              style={[Typography.bodySm, { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm }]}
            >
              You got everything right — amazing work!
            </Text>
            <PuffyButton
              title="Back to Dashboard"
              onPress={() => router.replace('/(main)')}
              variant="secondary"
              style={{ marginTop: Spacing.xl }}
            />
          </View>
        </SafeAreaView>
      </DotGridBackground>
    );
  }

  // ── Finished screen ──
  if (finished) {
    const totalMistakes = wrongQuestions.length;
    const nowCorrect = correctCount;
    const stillWrong = totalMistakes - nowCorrect;
    const pct = Math.round((nowCorrect / totalMistakes) * 100);

    return (
      <DotGridBackground>
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.resultsScroll}>
            <View style={[styles.gradeBanner, { backgroundColor: pct >= 70 ? '#22C55E15' : '#F59E0B15' }]}>
              <Text style={styles.gradeEmoji}>{pct >= 70 ? '🌟' : '💪'}</Text>
              <HandwrittenText variant="hand">
                {pct >= 70 ? 'Great improvement!' : 'Keep going!'}
              </HandwrittenText>
              <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 4 }]}>
                Practice My Mistakes
              </Text>
            </View>

            <JournalCard delay={100}>
              <View style={styles.resultRow}>
                <View style={[styles.resultCircle, { borderColor: pct >= 70 ? '#22C55E' : '#F59E0B' }]}>
                  <Text style={[styles.resultPct, { color: pct >= 70 ? '#22C55E' : '#F59E0B' }]}>{pct}%</Text>
                </View>
                <View style={styles.resultDetails}>
                  <View style={styles.resultItem}>
                    <View style={[styles.dot, { backgroundColor: '#22C55E' }]} />
                    <Text style={[Typography.body, { color: colors.text }]}>{nowCorrect} Fixed</Text>
                  </View>
                  <View style={styles.resultItem}>
                    <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
                    <Text style={[Typography.body, { color: colors.text }]}>{stillWrong} Still wrong</Text>
                  </View>
                  <View style={styles.resultItem}>
                    <View style={[styles.dot, { backgroundColor: '#64748B' }]} />
                    <Text style={[Typography.body, { color: colors.text }]}>{totalMistakes} Total mistakes</Text>
                  </View>
                </View>
              </View>
            </JournalCard>

            <View style={styles.actions}>
              {stillWrong > 0 && (
                <PuffyButton
                  title="Retry Remaining Mistakes"
                  onPress={() => {
                    // Reset to re-quiz only the still-wrong questions
                    setCurrentIndex(0);
                    setSelectedOptionId(null);
                    setShowFeedback(false);
                    setAnswers({});
                    setFinished(false);
                  }}
                  variant="secondary"
                />
              )}
              <PuffyButton title="Back to Dashboard" onPress={() => router.replace('/(main)')} variant="ghost" />
            </View>
          </ScrollView>
        </SafeAreaView>
      </DotGridBackground>
    );
  }

  // ── Quiz view ──
  const isLast = currentIndex >= wrongQuestions.length - 1;

  return (
    <DotGridBackground>
      <ConfettiBurst trigger={showConfetti} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Top Bar */}
        <View style={[styles.topBar, { borderBottomColor: colors.surfaceBorder }]}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
            <Text style={[styles.backArrow, { color: colors.text }]}>{'<'}</Text>
          </Pressable>
          <View style={styles.topCenter}>
            <Text style={[Typography.bodySm, { color: colors.textSecondary }]} numberOfLines={1}>
              {'🔄'} Practice My Mistakes
            </Text>
          </View>
          <View style={[styles.counterBadge, { backgroundColor: '#EF444420' }]}>
            <Text style={[styles.counterText, { color: '#EF4444' }]}>
              {currentIndex + 1}/{wrongQuestions.length}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={[styles.progressBg, { backgroundColor: colors.surfaceBorder }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: '#EF4444',
                width: `${((currentIndex + (showFeedback ? 1 : 0)) / wrongQuestions.length) * 100}%`,
              },
            ]}
          />
        </View>

        {/* Scrollable Question */}
        <ScrollView ref={scrollRef} style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Question Header */}
          <View style={styles.questionHeader}>
            <View
              style={[
                styles.diffBadge,
                { backgroundColor: DIFF_COLORS[question.difficulty as keyof typeof DIFF_COLORS] + '20' },
              ]}
            >
              <Text
                style={[
                  styles.diffText,
                  { color: DIFF_COLORS[question.difficulty as keyof typeof DIFF_COLORS] },
                ]}
              >
                {question.difficulty.toUpperCase()}
              </Text>
            </View>
            <View style={styles.headerActions}>
              <Pressable
                onPress={() => {
                  dispatch(toggleBookmark(question.id));
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  toast.show('success', isBookmarked ? 'Bookmark removed' : 'Question bookmarked');
                }}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                style={[
                  styles.actionBadge,
                  {
                    backgroundColor: isBookmarked ? '#F59E0B20' : '#64748B15',
                    borderColor: isBookmarked ? '#F59E0B' : '#64748B40',
                  },
                ]}
              >
                <Text style={[styles.actionBadgeText, { color: isBookmarked ? '#F59E0B' : '#64748B' }]}>
                  {isBookmarked ? '\uD83D\uDD16 Saved' : '\uD83D\uDCCC Save'}
                </Text>
              </Pressable>
              {showFeedback && (
                <Pressable
                  onPress={() => setShowVaniSheet(true)}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  style={[
                    styles.actionBadge,
                    { backgroundColor: colors.primary + '15', borderColor: colors.primary + '50' },
                  ]}
                >
                  <Text style={[styles.actionBadgeText, { color: colors.primary }]}>
                    {'\u2728'} VaNi
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Question Text */}
          <View style={[styles.questionBox, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            <Text style={[Typography.h3, { color: colors.text, lineHeight: 26 }]}>
              {language === 'te' ? question.textTe : question.text}
            </Text>
          </View>

          {/* Options via QuestionRenderer */}
          <QuestionRenderer
            question={question}
            language={language}
            selectedOptionId={selectedOptionId}
            showFeedback={showFeedback}
            onSelect={handleSelectOption}
            colors={colors}
          />

          {/* Feedback */}
          {showFeedback && (
            <View style={styles.feedbackArea}>
              <View style={[styles.banner, { backgroundColor: isCorrect ? '#22C55E18' : '#EF444418' }]}>
                <Text style={[Typography.h3, { color: isCorrect ? '#16A34A' : '#DC2626' }]}>
                  {isCorrect ? 'Got it this time!' : 'Still tricky...'}
                </Text>
              </View>

              {!isCorrect && selectedOptionId && (
                <WrongAnswerCard
                  questionId={question.id}
                  selectedOptionId={selectedOptionId}
                  correctOptionId={correctId}
                  questionText={language === 'te' ? question.textTe : question.text}
                  subjectId={question.subjectId as SubjectId}
                  language={language}
                  onConceptPress={(tag) => {
                    setSelectedConceptTag(tag);
                    setShowConceptSheet(true);
                  }}
                />
              )}

              <JournalCard delay={0}>
                <HandwrittenText variant="handSm">Explanation</HandwrittenText>
                <Text style={[Typography.body, { color: colors.text, marginTop: Spacing.sm, lineHeight: 22 }]}>
                  {language === 'te' ? question.explanationTe : question.explanation}
                </Text>
              </JournalCard>
            </View>
          )}
        </ScrollView>

        {/* Bottom Bar */}
        <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.surfaceBorder }]}>
          <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
            {showFeedback
              ? `Fixed: ${correctCount + (isCorrect ? 1 : 0)}/${currentIndex + 1}`
              : `Mistake ${currentIndex + 1} of ${wrongQuestions.length}`}
          </Text>

          {showFeedback ? (
            <Pressable
              onPress={handleNext}
              hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
              style={[styles.nextBtn, { backgroundColor: mode === 'dark' ? '#FFF' : '#0F172A' }]}
            >
              <Text style={[styles.nextBtnText, { color: mode === 'dark' ? '#0F172A' : '#FFF' }]}>
                {isLast ? 'See Results' : 'Next Mistake  >'}
              </Text>
            </Pressable>
          ) : (
            <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
              {persona.labels.quizStart}
            </Text>
          )}
        </View>
      </SafeAreaView>

      <AskVaniSheet
        visible={showVaniSheet}
        onClose={() => setShowVaniSheet(false)}
        questionText={language === 'te' ? question.textTe : question.text}
        subjectId={question.subjectId as SubjectId}
        questionId={question.id}
        eliminationHints={question.eliminationHints}
        selectedOptionId={selectedOptionId}
        language={language}
      />

      <ConceptExplainerSheet
        visible={showConceptSheet}
        onClose={() => setShowConceptSheet(false)}
        conceptTag={selectedConceptTag}
        subjectId={question.subjectId as SubjectId}
        chapterId={question.chapterId}
        language={language}
      />
    </DotGridBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
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
  topCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  counterBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  counterText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 13,
  },
  progressBg: {
    height: 4,
    marginHorizontal: Spacing.lg,
    borderRadius: 2,
    marginVertical: 4,
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 30,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  actionBadgeText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
  },
  diffBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  diffText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  questionBox: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  feedbackArea: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  banner: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
  },
  nextBtn: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: BorderRadius.xl,
  },
  nextBtnText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
  },
  // Results screen styles
  resultsScroll: {
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
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  resultCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultPct: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 28,
  },
  resultDetails: {
    flex: 1,
    gap: Spacing.sm,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  actions: {
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
});
