import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
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
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { RootState } from '../../src/store';
import { buildV2QuickPractice } from '../../src/data/questions';
import { getCorrectId } from '../../src/lib/questionAdapter';
import { SUBJECT_META } from '../../src/constants/subjects';
import { ConfettiBurst } from '../../src/components/ui/ConfettiBurst';
import { AskVaniSheet } from '../../src/components/AskVaniSheet';
import { WrongAnswerCard } from '../../src/components/exam/WrongAnswerCard';
import { ConceptExplainerSheet } from '../../src/components/exam/ConceptExplainerSheet';
import { ReportIssueSheet } from '../../src/components/exam/ReportIssueSheet';
import { useToast } from '../../src/components/ui/Toast';
import { NeetSubjectId, SubjectId, STRENGTH_LEVELS, ChapterExamSession } from '../../src/types';
import { startChapterExam, updateAnswer, completeChapterExam } from '../../src/store/slices/practiceSlice';
import { recordChapterAttempt } from '../../src/store/slices/strengthSlice';
import { toggleBookmark } from '../../src/store/slices/bookmarkSlice';
import { recordDailyPractice } from '../../src/store/slices/streakSlice';
import { syncChapterProgress } from '../../src/lib/progressSync';
import { reportError } from '../../src/lib/errorReporting';

const QUICK_TIME_LIMIT_MS = 10 * 60 * 1000; // 10 minutes
const DIFF_COLORS = { easy: '#22C55E', medium: '#F59E0B', hard: '#EF4444' };

export default function QuickPracticeQuizScreen() {
  const { colors, mode } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useToast();
  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
  const language = useSelector((state: RootState) => state.auth.user?.language ?? 'en');
  const bookmarkedIds = useSelector((state: RootState) => state.bookmark.ids);

  const subject = subjectId as NeetSubjectId;
  const subjectMeta = SUBJECT_META[subject];

  // Quick practice spans multiple chapters — use the broadest unlock across subject
  const strengthChapters = useSelector((state: RootState) => state.strength.chapters);
  const unlockedTypes = useMemo(() => {
    const subjectChapters = Object.values(strengthChapters).filter((c) => c.subjectId === subject);
    if (subjectChapters.length === 0) {
      return STRENGTH_LEVELS[0].unlockedTypes;
    }
    let best = STRENGTH_LEVELS[0];
    for (const ch of subjectChapters) {
      const cfg = STRENGTH_LEVELS.find((l) => l.id === ch.strengthLevel);
      if (cfg && cfg.unlockedTypes.length > best.unlockedTypes.length) {
        best = cfg;
      }
    }
    return best.unlockedTypes;
  }, [strengthChapters, subject]);

  const questions = useMemo(() => buildV2QuickPractice(subject, unlockedTypes), [subject, unlockedTypes]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showVaniSheet, setShowVaniSheet] = useState(false);
  const [showConceptSheet, setShowConceptSheet] = useState(false);
  const [selectedConceptTag, setSelectedConceptTag] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [answerStreak, setAnswerStreak] = useState(0);
  const [showReportSheet, setShowReportSheet] = useState(false);
  const [skippedIds, setSkippedIds] = useState<Set<string>>(new Set());
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeLeftMs, setTimeLeftMs] = useState(QUICK_TIME_LIMIT_MS);
  const scrollRef = useRef<ScrollView>(null);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answersRef = useRef<Record<string, string>>({});
  const quizCompletedRef = useRef(false);

  // Save partial results when user exits early (back button, swipe, etc.)
  useEffect(() => {
    return () => {
      if (quizCompletedRef.current || questions.length === 0) return;
      const partialAnswers = answersRef.current;
      if (Object.keys(partialAnswers).length === 0) return;

      // Group by chapter and record per-chapter strength
      const byChapter: Record<string, { questionId: string; correct: boolean }[]> = {};
      for (const [qId, optId] of Object.entries(partialAnswers)) {
        const q = questions.find((qq) => qq.id === qId);
        if (!q) continue;
        if (!byChapter[q.chapterId]) byChapter[q.chapterId] = [];
        byChapter[q.chapterId].push({ questionId: qId, correct: optId === getCorrectId(q) });
      }
      for (const [chapId, answered] of Object.entries(byChapter)) {
        dispatch(recordChapterAttempt({
          chapterId: chapId,
          subjectId: subject,
          totalInBank: 25,
          answeredQuestions: answered,
        }));
        syncChapterProgress(chapId).catch((e) => reportError(e, 'low', 'QuickQuiz.partialSync'));
      }
    };
  }, [questions, subject]);

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

  // Initialize session + start timer
  useEffect(() => {
    if (!subjectId || questions.length === 0) return;
    const session: ChapterExamSession = {
      id: `qp-${Date.now()}`,
      mode: 'chapter',
      chapterId: `quick-${subjectId}`,
      subjectId: subject,
      startedAt: new Date().toISOString(),
      completedAt: null,
      answers: [],
      totalQuestions: questions.length,
      correctCount: null,
      timeUsedMs: null,
    };
    dispatch(startChapterExam(session));

    timerRef.current = setInterval(() => {
      setTimeLeftMs((prev) => {
        if (prev <= 1000) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [subjectId]);

  // Auto-finish when timer runs out
  useEffect(() => {
    if (timeLeftMs === 0) {
      finishQuiz();
    }
  }, [timeLeftMs]);

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const timerColor = timeLeftMs < 60000 ? '#EF4444' : timeLeftMs < 180000 ? '#F59E0B' : colors.text;

  const finishQuiz = () => {
    quizCompletedRef.current = true;
    setQuizFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    const currentAnswers = { ...answers };
    if (question && selectedOptionId) {
      currentAnswers[question.id] = selectedOptionId;
    }

    const finalCorrect = Object.entries(currentAnswers).filter(([qId, optId]) => {
      const q = questions.find((qq) => qq.id === qId);
      return q ? optId === getCorrectId(q) : false;
    }).length;

    const timeUsedMs = Date.now() - startTimeRef.current;

    // Navigate FIRST — before Redux dispatches that trigger question recalculation
    router.replace({
      pathname: '/chapter-results',
      params: {
        chapterId: `quick-${subjectId}`,
        correct: String(finalCorrect),
        total: String(questions.length),
        timeUsedMs: String(timeUsedMs),
        skipped: String(skippedIds.size),
      },
    });

    // Then dispatch Redux state updates (may cause re-renders, but quizFinished guards the UI)
    dispatch(
      completeChapterExam({
        correctCount: finalCorrect,
        completedAt: new Date().toISOString(),
        timeUsedMs,
      })
    );

    const byChapter: Record<string, { questionId: string; correct: boolean }[]> = {};
    for (const [qId, optId] of Object.entries(currentAnswers)) {
      const q = questions.find((qq) => qq.id === qId);
      if (!q) continue;
      if (!byChapter[q.chapterId]) byChapter[q.chapterId] = [];
      byChapter[q.chapterId].push({ questionId: qId, correct: optId === getCorrectId(q) });
    }
    for (const [chapId, answered] of Object.entries(byChapter)) {
      dispatch(
        recordChapterAttempt({
          chapterId: chapId,
          subjectId: subject,
          totalInBank: 25,
          answeredQuestions: answered,
        })
      );
    }

    dispatch(recordDailyPractice());

    for (const chapId of Object.keys(byChapter)) {
      syncChapterProgress(chapId).catch((e) => reportError(e, 'medium', 'QuickQuiz.syncProgress'));
    }
  };

  const handleSelectOption = (optionId: string) => {
    if (showFeedback || !question) return;
    setSelectedOptionId(optionId);
    setShowFeedback(true);

    const correct = optionId === correctId;
    Haptics.impactAsync(
      correct ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Heavy
    );

    setAnswers((prev) => {
      const next = { ...prev, [question.id]: optionId };
      answersRef.current = next;
      return next;
    });

    if (correct) {
      setAnswerStreak((s) => s + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    } else {
      setAnswerStreak(0);
    }

    dispatch(
      updateAnswer({
        questionId: question.id,
        selectedOptionId: optionId,
        isMarked: false,
        eliminatedOptionIds: [],
        timeSpentMs: 0,
      })
    );
  };

  const handleNext = () => {
    if (!question) return;

    if (currentIndex >= questions.length - 1) {
      finishQuiz();
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedOptionId(null);
    setShowFeedback(false);
    setShowVaniSheet(false);
    setShowConceptSheet(false);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleSkip = () => {
    if (!question) return;
    setSkippedIds((prev) => new Set(prev).add(question.id));

    if (currentIndex >= questions.length - 1) {
      finishQuiz();
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedOptionId(null);
    setShowFeedback(false);
    setShowVaniSheet(false);
    setShowConceptSheet(false);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  if (quizFinished || !question || !subjectMeta) {
    return (
      <DotGridBackground>
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
            <Text style={{ fontSize: 32 }}>{'\u2728'}</Text>
            <Text style={[Typography.h2, { color: colors.text }]}>Loading results...</Text>
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
        <View style={[styles.topBar, { borderBottomColor: colors.surfaceBorder }]}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
            <Text style={[styles.backArrow, { color: colors.text }]}>{'<'}</Text>
          </Pressable>
          <View style={styles.topCenter}>
            <Text style={[styles.timerText, { color: timerColor }]}>{formatTime(timeLeftMs)}</Text>
          </View>
          <View style={[styles.counterBadge, { backgroundColor: subjectMeta.color + '20' }]}>
            <Text style={[styles.counterText, { color: subjectMeta.color }]}>
              {currentIndex + 1}/{questions.length}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={[styles.progressBg, { backgroundColor: colors.surfaceBorder }]}>
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

        {/* Question Content */}
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Question Header: Difficulty + Actions */}
          <View style={styles.questionHeader}>
            <View style={[styles.diffBadge, { backgroundColor: DIFF_COLORS[question.difficulty] + '20' }]}>
              <Text style={[styles.diffText, { color: DIFF_COLORS[question.difficulty] }]}>
                {question.difficulty.toUpperCase()}
              </Text>
            </View>
            <View style={styles.headerActions}>
              <Pressable
                onPress={() => setShowVaniSheet(true)}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                style={[
                  styles.actionBadge,
                  {
                    backgroundColor: showVaniSheet ? '#8B5CF620' : '#64748B15',
                    borderColor: showVaniSheet ? '#8B5CF6' : '#64748B40',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.actionBadgeText,
                    { color: showVaniSheet ? '#8B5CF6' : '#64748B' },
                  ]}
                >
                  {'\u2728'} Ask VaNi
                </Text>
              </Pressable>
              <Pressable
                onPress={() => { dispatch(toggleBookmark(question.id)); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toast.show('success', isBookmarked ? 'Bookmark removed' : 'Question bookmarked'); }}
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
              <Pressable
                onPress={() => setShowReportSheet(true)}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                style={[
                  styles.actionBadge,
                  {
                    backgroundColor: '#64748B15',
                    borderColor: '#64748B40',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.actionBadgeText,
                    { color: '#64748B' },
                  ]}
                >
                  {'\u26A0\uFE0F'} Report
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Question Text */}
          <View style={[styles.questionBox, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            <Text style={[Typography.h3, { color: colors.text, lineHeight: 26 }]}>
              {language === 'te' ? question.textTe : question.text}
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
              <View style={[styles.banner, { backgroundColor: isCorrect ? '#22C55E18' : '#EF444418' }]}>
                <Text style={[Typography.h3, { color: isCorrect ? '#16A34A' : '#DC2626' }]}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </Text>
                {isCorrect && answerStreak >= 2 && (
                  <Text style={styles.streakText}>
                    {'\uD83D\uDD25'} {answerStreak} in a row!
                  </Text>
                )}
              </View>

              {/* Wrong-Answer Analysis */}
              {!isCorrect && selectedOptionId && (
                <WrongAnswerCard
                  questionId={question.id}
                  selectedOptionId={selectedOptionId}
                  correctOptionId={correctId}
                  questionText={language === 'te' ? question.textTe : question.text}
                  subjectId={question.subjectId as SubjectId}
                  language={language}
                  onConceptPress={(tag) => { setSelectedConceptTag(tag); setShowConceptSheet(true); }}
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
              ? `Score: ${correctCount}/${currentIndex + 1}`
              : `Question ${currentIndex + 1} of ${questions.length}`}
          </Text>

          {showFeedback ? (
            <Pressable
              onPress={handleNext}
              hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
              style={[styles.nextBtn, { backgroundColor: mode === 'dark' ? '#FFF' : '#0F172A' }]}
            >
              <Text
                style={[
                  styles.nextBtnText,
                  { color: mode === 'dark' ? '#0F172A' : '#FFF' },
                ]}
              >
                {isLast ? 'See Results' : 'Next Question  >'}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleSkip}
              hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
              style={[styles.skipBtn, { borderColor: colors.surfaceBorder }]}
            >
              <Text style={[styles.skipBtnText, { color: colors.textTertiary }]}>
                Skip {'>'}
              </Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>

      {/* Ask VaNi — chat-style elimination */}
      <AskVaniSheet
        visible={showVaniSheet}
        onClose={() => setShowVaniSheet(false)}
        questionText={language === 'te' ? question.textTe : question.text}
        subjectId={question.subjectId as SubjectId}
        questionId={question.id}
        eliminationHints={question.eliminationHints}
        eliminationText={String((language === 'te' ? question.eliminationTechniqueTe : question.eliminationTechnique) || '')}
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

      {/* Report Issue Sheet */}
      <ReportIssueSheet
        visible={showReportSheet}
        onClose={() => setShowReportSheet(false)}
        questionId={question.id}
        chapterId={question.chapterId}
        onReported={() => toast.show('info', 'Report submitted')}
      />
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
  timerText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 18,
    letterSpacing: 1,
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
  streakText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 14,
    color: '#F59E0B',
    marginTop: 4,
  },
  skipBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  skipBtnText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
  },
});
