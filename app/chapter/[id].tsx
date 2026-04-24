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

import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { QuestionRenderer } from '../../src/components/exam/QuestionRenderer';
import { useTheme } from '../../src/hooks/useTheme';
import { usePersona } from '../../src/hooks/usePersona';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { RootState } from '../../src/store';
import { SUBJECT_META } from '../../src/constants/subjects';
import { ConfettiBurst } from '../../src/components/ui/ConfettiBurst';
import { AskVaniSheet } from '../../src/components/AskVaniSheet';
import { WrongAnswerCard } from '../../src/components/exam/WrongAnswerCard';
import { ConceptExplainerSheet } from '../../src/components/exam/ConceptExplainerSheet';
// EliminationSheet removed — elimination hints now live inside AskVaniSheet
import { useToast } from '../../src/components/ui/Toast';
import {
  NeetSubjectId,
  SubjectId,
  QuestionType,
  STRENGTH_LEVELS,
  ChapterExamSession,
  QuestionV2,
  t,
} from '../../src/types';
import {
  startChapterExam,
  updateAnswer,
  completeChapterExam,
} from '../../src/store/slices/practiceSlice';
import { recordChapterAttempt } from '../../src/store/slices/strengthSlice';
import { toggleBookmark } from '../../src/store/slices/bookmarkSlice';
import { incrementStreak, resetStreak, recordDailyPractice } from '../../src/store/slices/streakSlice';
import { fetchQuestionsByChapter } from '../../src/lib/questions';
import { applyOptionShuffleToBatch } from '../../src/lib/optionShuffle';
import { getCorrectId, resolveLegacyChapterId } from '../../src/lib/questionAdapter';
import { syncChapterProgress } from '../../src/lib/progressSync';
import { reportError } from '../../src/lib/errorReporting';

const DIFF_COLORS = { easy: '#22C55E', medium: '#F59E0B', hard: '#EF4444' };

export default function ChapterQuizScreen() {
  const { colors, mode } = useTheme();
  const persona = usePersona();
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useToast();
  const { id: rawChapterId } = useLocalSearchParams<{ id: string }>();
  // Resolve legacy chapter IDs (e.g., 'zoology-human-physiology' → 'zoo-body-fluids')
  const chapterId = rawChapterId ? resolveLegacyChapterId(rawChapterId) : rawChapterId;
  const language = useSelector(
    (state: RootState) => state.auth.user?.language ?? 'en',
  );
  const bookmarkedIds = useSelector((state: RootState) => state.bookmark.ids);
  const answerStreak = useSelector((state: RootState) => state.streak.currentStreak);
  const chapterStrength = useSelector(
    (state: RootState) => chapterId ? state.strength.chapters[chapterId] : undefined,
  );

  // Fetch questions from Supabase, shuffle, and pick a batch
  const [questions, setQuestions] = useState<QuestionV2[]>([]);
  const [totalInBank, setTotalInBank] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<'no-connection' | 'no-questions' | 'not-configured' | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  const loadQuestions = () => {
    if (!chapterId) return;
    setIsLoading(true);
    setLoadError(null);
    fetchQuestionsByChapter(chapterId)
      .then((result) => {
        if (!result.ok) {
          setLoadError(result.error);
          setIsLoading(false);
          return;
        }
        const allQs = result.questions;
        setTotalInBank(allQs.length);

        // Shuffle using Fisher-Yates
        const shuffled = [...allQs];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Limit to 20 questions per session, then shuffle each question's
        // options deterministically by session id. Same seed is reused by
        // the answer-review screen via the stored session.id.
        const newSessionId = `ch-${Date.now()}`;
        const batch = applyOptionShuffleToBatch(shuffled.slice(0, 20), newSessionId);
        setSessionId(newSessionId);
        setQuestions(batch);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn(`[chapter] Failed to load questions for ${chapterId}:`, err);
        setLoadError('no-connection');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadQuestions();
  }, [chapterId]);

  // Derive subject from chapterId prefix — covers both NEET and CUET chapters
  const subjectIdFromPrefix = useMemo(() => {
    if (!chapterId) return 'physics';
    // CUET prefixes (must check before NEET since 'cuet-phy-' also starts with 'phy-' substring)
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
    return 'physics';
  }, [chapterId]);

  // Once questions load, prefer the DB's own subjectId (authoritative)
  const subjectId = questions.length > 0 ? questions[0].subjectId : subjectIdFromPrefix;

  const subjectMeta = SUBJECT_META[subjectId] || SUBJECT_META.physics;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showVaniSheet, setShowVaniSheet] = useState(false);
  const [showConceptSheet, setShowConceptSheet] = useState(false);
  const [selectedConceptTag, setSelectedConceptTag] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const streakScaleAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);
  const startTimeRef = useRef(Date.now());
  const answersRef = useRef<Record<string, string>>({});
  const quizCompletedRef = useRef(false);

  // Save partial results when the user exits the quiz early (back button, swipe, etc.)
  useEffect(() => {
    return () => {
      if (quizCompletedRef.current || !chapterId || questions.length === 0) return;
      const partialAnswers = answersRef.current;
      if (Object.keys(partialAnswers).length === 0) return;

      // Record whatever was answered so far into strength tracking
      dispatch(
        recordChapterAttempt({
          chapterId,
          subjectId,
          totalInBank,
          answeredQuestions: Object.entries(partialAnswers).map(([qId, optId]) => {
            const q = questions.find((qq) => qq.id === qId);
            return {
              questionId: qId,
              correct: q ? optId === getCorrectId(q) : false,
            };
          }),
        }),
      );
      // Sync to Supabase in background
      syncChapterProgress(chapterId).catch((e) => reportError(e, 'low', 'ChapterQuiz.partialSync'));
    };
  }, [chapterId, questions, subjectId, totalInBank]);

  // Start session once questions are loaded
  useEffect(() => {
    if (sessionStarted || questions.length === 0 || !chapterId || !sessionId) return;
    const session: ChapterExamSession = {
      id: sessionId,
      mode: 'chapter',
      chapterId,
      subjectId: subjectId as NeetSubjectId,
      startedAt: new Date().toISOString(),
      completedAt: null,
      answers: [],
      totalQuestions: questions.length,
      correctCount: null,
      timeUsedMs: null,
    };
    dispatch(startChapterExam(session));
    startTimeRef.current = Date.now();
    setSessionStarted(true);
  }, [questions, chapterId, sessionStarted, sessionId]);

  const question = questions[currentIndex];
  const isBookmarked = question ? bookmarkedIds.includes(question.id) : false;
  const correctId = question ? getCorrectId(question) : '';
  const isCorrect = selectedOptionId === correctId;

  const correctCount = useMemo(() => {
    return Object.entries(answers).filter(([qId]) => {
      const q = questions.find((qq) => qq.id === qId);
      return q ? answers[qId] === getCorrectId(q) : false;
    }).length;
  }, [answers, questions]);

  const handleSelectOption = (optionId: string) => {
    if (showFeedback || !question) return;
    setSelectedOptionId(optionId);
    setShowFeedback(true);

    const correct = optionId === correctId;
    Haptics.impactAsync(
      correct
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Heavy,
    );

    setAnswers((prev) => {
      const next = { ...prev, [question.id]: optionId };
      answersRef.current = next;
      return next;
    });

    if (correct) {
      dispatch(incrementStreak());
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
      if (answerStreak >= 1) {
        streakScaleAnim.setValue(0);
        Animated.spring(streakScaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 8,
          stiffness: 200,
        }).start();
      }
    } else {
      dispatch(resetStreak());
    }

    dispatch(
      updateAnswer({
        questionId: question.id,
        selectedOptionId: optionId,
        isMarked: false,
        eliminatedOptionIds: [],
        timeSpentMs: 0,
      }),
    );
  };

  const handleNext = () => {
    if (!question) return;

    if (currentIndex >= questions.length - 1) {
      // Last question — mark as fully completed so cleanup doesn't double-save
      quizCompletedRef.current = true;
      setQuizFinished(true);
      const allAnswers = { ...answers, [question.id]: selectedOptionId! };
      const finalCorrect = Object.entries(allAnswers).filter(([qId, optId]) => {
        const q = questions.find((qq) => qq.id === qId);
        return q ? optId === getCorrectId(q) : false;
      }).length;

      const timeUsedMs = Date.now() - startTimeRef.current;

      // Navigate FIRST — before Redux dispatches that trigger question recalculation
      router.replace({
        pathname: '/chapter-results',
        params: {
          chapterId: chapterId!,
          subjectId,
          correct: String(finalCorrect),
          total: String(questions.length),
          timeUsedMs: String(timeUsedMs),
        },
      });

      // Then dispatch Redux state updates (quizFinished guards the UI)
      dispatch(
        completeChapterExam({
          correctCount: finalCorrect,
          completedAt: new Date().toISOString(),
          timeUsedMs,
        }),
      );

      dispatch(
        recordChapterAttempt({
          chapterId: chapterId!,
          subjectId,
          totalInBank,
          answeredQuestions: Object.entries(allAnswers).map(([qId, optId]) => {
            const q = questions.find((qq) => qq.id === qId);
            return {
              questionId: qId,
              correct: q ? optId === getCorrectId(q) : false,
            };
          }),
        }),
      );

      // Record daily practice streak
      dispatch(recordDailyPractice());

      // Sync progress to Supabase in background
      syncChapterProgress(chapterId!).catch((e) => reportError(e, 'medium', 'ChapterQuiz.syncProgress'));
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedOptionId(null);
    setShowFeedback(false);
    setShowVaniSheet(false);
    setShowConceptSheet(false);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  // ── Loading state ──
  if (isLoading) {
    return (
      <DotGridBackground>
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={subjectMeta.color} />
            <Text
              style={[
                Typography.body,
                { color: colors.textSecondary, marginTop: Spacing.md },
              ]}
            >
              Loading questions...
            </Text>
          </View>
        </SafeAreaView>
      </DotGridBackground>
    );
  }

  // ── Error / empty states ──
  if (loadError || questions.length === 0) {
    const isConnectionError = loadError === 'no-connection' || loadError === 'not-configured';
    const icon = isConnectionError ? '\uD83D\uDD0C' : '\uD83D\uDCDA';
    const title = isConnectionError
      ? 'Connection Problem'
      : 'No Questions Yet';
    const message = isConnectionError
      ? 'Could not reach the server. Please check your internet connection and try again.'
      : 'Questions for this chapter haven\'t been added yet. Check back soon!';

    return (
      <DotGridBackground>
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={styles.loadingContainer}>
            <Text style={{ fontSize: 48, marginBottom: Spacing.md }}>{icon}</Text>
            <Text style={[Typography.h3, { color: colors.text, textAlign: 'center' }]}>
              {title}
            </Text>
            <Text
              style={[
                Typography.body,
                {
                  color: colors.textSecondary,
                  marginTop: Spacing.sm,
                  textAlign: 'center',
                  paddingHorizontal: Spacing.xl,
                  lineHeight: 22,
                },
              ]}
            >
              {message}
            </Text>
            <View style={{ flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.lg }}>
              {isConnectionError && (
                <Pressable
                  onPress={loadQuestions}
                  style={[
                    styles.backBtnLarge,
                    { backgroundColor: subjectMeta.color },
                  ]}
                >
                  <Text style={styles.backBtnLargeText}>Try Again</Text>
                </Pressable>
              )}
              <Pressable
                onPress={() => router.back()}
                style={[
                  styles.backBtnLarge,
                  isConnectionError
                    ? { backgroundColor: colors.surfaceBorder }
                    : { backgroundColor: subjectMeta.color },
                ]}
              >
                <Text style={[styles.backBtnLargeText, isConnectionError && { color: colors.text }]}>
                  Go Back
                </Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </DotGridBackground>
    );
  }

  if (quizFinished || !question) {
    return (
      <DotGridBackground>
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={styles.loadingContainer}>
            <Text style={{ fontSize: 32 }}>{'\u2728'}</Text>
            <Text style={[Typography.h2, { color: colors.text }]}>Loading results...</Text>
            <Pressable
              onPress={() => router.replace('/(main)')}
              style={{ marginTop: 24, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, backgroundColor: '#64748B20' }}
            >
              <Text style={{ color: colors.textSecondary, fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 14 }}>Back to Dashboard</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </DotGridBackground>
    );
  }

  const isLast = currentIndex >= questions.length - 1;

  return (
    <DotGridBackground>
      <ConfettiBurst trigger={showConfetti} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Top Bar */}
        <View
          style={[styles.topBar, { borderBottomColor: colors.surfaceBorder }]}
        >
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            style={styles.backBtn}
          >
            <Text style={[styles.backArrow, { color: colors.text }]}>
              {'<'}
            </Text>
          </Pressable>
          <View style={styles.topCenter}>
            <Text
              style={[Typography.bodySm, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {subjectMeta.emoji} {chapterId?.replace(/-/g, ' ')}
            </Text>
          </View>
          <View
            style={[
              styles.counterBadge,
              { backgroundColor: subjectMeta.color + '20' },
            ]}
          >
            <Text style={[styles.counterText, { color: subjectMeta.color }]}>
              {currentIndex + 1}/{questions.length}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View
          style={[styles.progressBg, { backgroundColor: colors.surfaceBorder }]}
        >
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: subjectMeta.color,
                width: `${((currentIndex + (showFeedback ? 1 : 0)) / questions.length) * 100}%`,
              },
            ]}
          />
        </View>

        {/* Scrollable Question Content */}
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Question Header: Difficulty + Actions */}
          <View style={styles.questionHeader}>
            <View
              style={[
                styles.diffBadge,
                {
                  backgroundColor:
                    DIFF_COLORS[question.difficulty as keyof typeof DIFF_COLORS] + '20',
                },
              ]}
            >
              <Text
                style={[
                  styles.diffText,
                  {
                    color:
                      DIFF_COLORS[question.difficulty as keyof typeof DIFF_COLORS],
                  },
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
                  toast.show(
                    'success',
                    isBookmarked ? 'Bookmark removed' : 'Question bookmarked',
                  );
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
                <Text
                  style={[
                    styles.actionBadgeText,
                    { color: isBookmarked ? '#F59E0B' : '#64748B' },
                  ]}
                >
                  {isBookmarked ? '\uD83D\uDD16 Saved' : '\uD83D\uDCCC Save'}
                </Text>
              </Pressable>
              {showFeedback && (
                <Pressable
                  onPress={() => setShowVaniSheet(true)}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  style={[
                    styles.actionBadge,
                    {
                      backgroundColor: colors.primary + '15',
                      borderColor: colors.primary + '50',
                    },
                  ]}
                >
                  <Text
                    style={[styles.actionBadgeText, { color: colors.primary }]}
                  >
                    {'\u2728'} VaNi
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Question Text */}
          <View
            style={[
              styles.questionBox,
              {
                backgroundColor: colors.surface,
                borderColor: colors.surfaceBorder,
              },
            ]}
          >
            <Text
              style={[Typography.h3, { color: colors.text, lineHeight: 26 }]}
            >
              {t(language, question.text, question.textTe, question.textHi)}
            </Text>
          </View>

          {/* Type-specific content + Options via QuestionRenderer */}
          <QuestionRenderer
            question={question}
            language={language}
            selectedOptionId={selectedOptionId}
            showFeedback={showFeedback}
            onSelect={handleSelectOption}
            colors={colors}
          />

          {/* Feedback Section */}
          {showFeedback && (
            <View style={styles.feedbackArea}>
              {/* Correct / Wrong banner */}
              <View
                style={[
                  styles.banner,
                  {
                    backgroundColor: isCorrect ? '#22C55E18' : '#EF444418',
                  },
                ]}
              >
                <Text
                  style={[
                    Typography.h3,
                    { color: isCorrect ? '#16A34A' : '#DC2626' },
                  ]}
                >
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </Text>
                {isCorrect && answerStreak >= 2 && (
                  <Animated.View
                    style={{
                      transform: [
                        {
                          scale: Animated.add(
                            streakScaleAnim,
                            new Animated.Value(0),
                          ).interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.5, 1],
                          }),
                        },
                      ],
                    }}
                  >
                    <Text style={styles.streakText}>
                      {'\uD83D\uDD25'} {answerStreak} in a row!
                    </Text>
                  </Animated.View>
                )}
                {!isCorrect &&
                  'options' in question.payload &&
                  'correctOptionId' in question.payload &&
                  /* MTF shows its own "Correct matching:" card — hide raw option ID */
                  question.payload.type !== 'match-the-following' && (
                    <Text
                      style={[
                        Typography.bodySm,
                        { color: '#DC2626', marginTop: 2 },
                      ]}
                    >
                      Correct answer:{' '}
                      {(
                        question.payload as {
                          options: { id: string }[];
                          correctOptionId: string;
                        }
                      ).correctOptionId}
                    </Text>
                  )}
              </View>

              {/* Wrong-Answer Analysis */}
              {!isCorrect && selectedOptionId && (
                <WrongAnswerCard
                  questionId={question.id}
                  selectedOptionId={selectedOptionId}
                  correctOptionId={correctId}
                  questionText={
                    t(language, question.text, question.textTe, question.textHi)
                  }
                  subjectId={question.subjectId as SubjectId}
                  language={language}
                  onConceptPress={(tag) => {
                    setSelectedConceptTag(tag);
                    setShowConceptSheet(true);
                  }}
                />
              )}

              {/* Explanation */}
              <JournalCard delay={0}>
                <HandwrittenText variant="handSm">Explanation</HandwrittenText>
                <Text
                  style={[
                    Typography.body,
                    {
                      color: colors.text,
                      marginTop: Spacing.sm,
                      lineHeight: 22,
                    },
                  ]}
                >
                  {t(language, question.explanation, question.explanationTe, question.explanationHi)}
                </Text>
              </JournalCard>
            </View>
          )}
        </ScrollView>

        {/* Fixed Bottom Bar */}
        <View
          style={[
            styles.bottomBar,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.surfaceBorder,
            },
          ]}
        >
          <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
            {showFeedback
              ? `Score: ${correctCount + (isCorrect ? 1 : 0)}/${currentIndex + 1}`
              : `Question ${currentIndex + 1} of ${questions.length}`}
          </Text>

          {showFeedback ? (
            <Pressable
              onPress={handleNext}
              hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
              style={[
                styles.nextBtn,
                {
                  backgroundColor:
                    mode === 'dark' ? '#FFF' : '#0F172A',
                },
              ]}
            >
              <Text
                style={[
                  styles.nextBtnText,
                  { color: mode === 'dark' ? '#0F172A' : '#FFF' },
                ]}
              >
                {isLast ? persona.labels.quizComplete : 'Next Question  >'}
              </Text>
            </Pressable>
          ) : (
            <Text
              style={[Typography.bodySm, { color: colors.textTertiary }]}
            >
              {persona.labels.quizStart}
            </Text>
          )}
        </View>
      </SafeAreaView>

      {/* Ask VaNi Bottom Sheet (includes elimination hints) */}
      <AskVaniSheet
        visible={showVaniSheet}
        onClose={() => setShowVaniSheet(false)}
        questionText={t(language, question.text, question.textTe, question.textHi)}
        subjectId={question.subjectId as SubjectId}
        questionId={question.id}
        questionType={question.type}
        explanation={t(language, question.explanation, question.explanationTe, question.explanationHi)}
        eliminationHints={question.eliminationHints}
        selectedOptionId={selectedOptionId}
        language={language}
      />

      {/* Concept Explainer Bottom Sheet */}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  backBtnLarge: {
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
  },
  backBtnLargeText: {
    color: '#FFF',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
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
  streakText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 14,
    color: '#F59E0B',
    marginTop: 4,
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
});
