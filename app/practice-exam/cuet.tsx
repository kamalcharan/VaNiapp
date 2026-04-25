import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import * as Haptics from 'expo-haptics';

import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { useTheme } from '../../src/hooks/useTheme';
import { useFocusTracker } from '../../src/hooks/useFocusTracker';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { RootState } from '../../src/store';
import { fetchQuestionsBySubject } from '../../src/lib/questions';
import { applyOptionShuffleToBatch } from '../../src/lib/optionShuffle';
import { SUBJECT_META } from '../../src/constants/subjects';
import {
  CUET_SCORING,
  UserAnswer,
  QuestionV2,
  Option,
  t,
} from '../../src/types';
import { getCorrectId } from '../../src/lib/questionAdapter';
import { calculateCuetScore } from '../../src/store/slices/practiceSlice';
import { recordChapterAttempt } from '../../src/store/slices/strengthSlice';
import { recordDailyPractice } from '../../src/store/slices/streakSlice';
import { syncChapterProgress } from '../../src/lib/progressSync';
import { reportError } from '../../src/lib/errorReporting';
import { ReportIssueSheet } from '../../src/components/exam/ReportIssueSheet';

export default function CuetSubjectQuizScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
  const language = useSelector((state: RootState) => state.auth.user?.language ?? 'en');
  const focus = useFocusTracker();
  const scrollRef = useRef<ScrollView>(null);

  const subject = subjectId ?? '';
  const subjectMeta = SUBJECT_META[subject] ?? {
    name: subject ? subject.replace(/-/g, ' ') : 'Subject',
    emoji: '🎯',
    color: '#3B82F6',
  };

  // Stable session id — also seeds option shuffle
  const sessionIdRef = useRef<string>(`cuet-${Date.now()}`);

  const [questions, setQuestions] = useState<QuestionV2[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [eliminated, setEliminated] = useState<Record<string, string[]>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeftMs, setTimeLeftMs] = useState(CUET_SCORING.timeLimitMs);
  const [showReportSheet, setShowReportSheet] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load up to 50 questions for the subject from Supabase
  useEffect(() => {
    let cancelled = false;
    if (!subject) {
      setLoadError('Missing subject.');
      setLoading(false);
      return;
    }
    (async () => {
      const result = await fetchQuestionsBySubject(subject, CUET_SCORING.totalQuestions);
      if (cancelled) return;
      if (result.ok && result.questions.length > 0) {
        // Take up to 50, then shuffle option order per session
        const batch = result.questions.slice(0, CUET_SCORING.totalQuestions);
        setQuestions(applyOptionShuffleToBatch(batch, sessionIdRef.current));
        setLoading(false);
        return;
      }
      const reason = result.ok ? 'no-questions' : result.error;
      setLoadError(
        reason === 'no-questions'
          ? `No questions available for ${subjectMeta.name} yet.`
          : 'Couldn\'t load questions. Check your connection.',
      );
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [subject]);

  // Start timer once questions are loaded
  useEffect(() => {
    if (loading || questions.length === 0) return;
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
  }, [loading, questions.length]);

  const question = questions[currentIndex];
  const questionOptions: Option[] =
    question && 'options' in question.payload
      ? (question.payload as { options: Option[] }).options
      : [];

  const navigateTo = useCallback(
    (idx: number) => {
      if (idx >= 0 && idx < questions.length) {
        setCurrentIndex(idx);
        scrollRef.current?.scrollTo({ y: 0, animated: false });
      }
    },
    [questions.length],
  );

  const handleSelectOption = useCallback(
    (optionId: string) => {
      if (!question) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
      // Un-eliminate if user picks an eliminated option
      setEliminated((prev) => {
        const cur = prev[question.id] ?? [];
        if (!cur.includes(optionId)) return prev;
        return { ...prev, [question.id]: cur.filter((id) => id !== optionId) };
      });
    },
    [question],
  );

  const handleToggleEliminate = useCallback(
    (optionId: string) => {
      if (!question) return;
      if (answers[question.id] === optionId) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setEliminated((prev) => {
        const cur = prev[question.id] ?? [];
        const next = cur.includes(optionId)
          ? cur.filter((id) => id !== optionId)
          : [...cur, optionId];
        return { ...prev, [question.id]: next };
      });
    },
    [question, answers],
  );

  const handleClearAnswer = useCallback(() => {
    if (!question) return;
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[question.id];
      return copy;
    });
  }, [question]);

  const handleToggleMark = useCallback(() => {
    if (!question) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMarked((prev) => ({ ...prev, [question.id]: !prev[question.id] }));
  }, [question]);

  const handlePrev = useCallback(() => navigateTo(currentIndex - 1), [currentIndex, navigateTo]);
  const handleNext = useCallback(() => navigateTo(currentIndex + 1), [currentIndex, navigateTo]);

  const handleReviewLater = useCallback(() => {
    if (!question) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMarked((prev) => ({ ...prev, [question.id]: true }));
    handleNext();
  }, [question, handleNext]);

  const submit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const correctAnswerMap: Record<string, string> = {};
    questions.forEach((q) => {
      correctAnswerMap[q.id] = getCorrectId(q);
    });

    const userAnswers: UserAnswer[] = questions.map((q) => ({
      questionId: q.id,
      selectedOptionId: answers[q.id] ?? null,
      isMarked: marked[q.id] ?? false,
      eliminatedOptionIds: eliminated[q.id] ?? [],
      timeSpentMs: 0,
    }));

    const result = calculateCuetScore(userAnswers, correctAnswerMap);
    const timeUsedMs = CUET_SCORING.timeLimitMs - timeLeftMs;

    // Per-chapter strength tracking
    const byChapter: Record<string, { questionId: string; correct: boolean }[]> = {};
    for (const ua of userAnswers) {
      const q = questions.find((qq) => qq.id === ua.questionId);
      if (!q) continue;
      const chapId = q.chapterId ?? `${subject}-cuet`;
      if (!byChapter[chapId]) byChapter[chapId] = [];
      byChapter[chapId].push({
        questionId: ua.questionId,
        correct: ua.selectedOptionId === correctAnswerMap[ua.questionId],
      });
    }
    for (const [chapId, answered] of Object.entries(byChapter)) {
      dispatch(
        recordChapterAttempt({
          chapterId: chapId,
          subjectId: subject,
          totalInBank: 50,
          answeredQuestions: answered,
        }),
      );
      syncChapterProgress(chapId).catch((e) => reportError(e, 'medium', 'CuetQuiz.syncProgress'));
    }
    dispatch(recordDailyPractice());

    router.replace({
      pathname: '/practice-exam/cuet-results',
      params: {
        subjectId: subject,
        score: String(result.score),
        correct: String(result.correct),
        wrong: String(result.wrong),
        unanswered: String(result.unanswered),
        total: String(questions.length),
        timeUsedMs: String(timeUsedMs),
        focusSwitches: String(focus.switchCount),
      },
    });
  }, [submitted, questions, answers, marked, eliminated, timeLeftMs, dispatch, router, subject, focus.switchCount]);

  // Auto-submit on timer expiry
  useEffect(() => {
    if (timeLeftMs === 0 && !submitted && questions.length > 0) {
      submit();
    }
  }, [timeLeftMs, submitted, questions.length, submit]);

  const handleSubmitPress = useCallback(() => {
    const answeredCount = Object.values(answers).filter((v) => v != null).length;
    Alert.alert(
      'Submit Paper?',
      `You've answered ${answeredCount} of ${questions.length} questions. You can't change your answers after submitting.`,
      [
        { text: 'Continue', style: 'cancel' },
        { text: 'Submit', style: 'destructive', onPress: submit },
      ],
    );
  }, [answers, questions.length, submit]);

  // Format timer mm:ss
  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const timerColor =
    timeLeftMs < 5 * 60 * 1000 ? '#EF4444' : timeLeftMs < 15 * 60 * 1000 ? '#F59E0B' : colors.text;
  const answeredCount = Object.values(answers).filter((v) => v != null).length;

  if (loading) {
    return (
      <DotGridBackground>
        <SafeAreaView style={[styles.container, styles.center]} edges={['top']}>
          <ActivityIndicator color={colors.primary} />
          <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: Spacing.md }]}>
            Loading {subjectMeta.name} questions...
          </Text>
        </SafeAreaView>
      </DotGridBackground>
    );
  }

  if (loadError || !question) {
    return (
      <DotGridBackground>
        <SafeAreaView style={[styles.container, styles.center]} edges={['top']}>
          <Text style={[Typography.body, { color: colors.text, textAlign: 'center', paddingHorizontal: Spacing.lg }]}>
            {loadError ?? 'No questions to show.'}
          </Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: Spacing.lg }}>
            <Text style={[Typography.bodySm, { color: colors.primary, fontWeight: '600' }]}>
              {'‹ Go back'}
            </Text>
          </Pressable>
        </SafeAreaView>
      </DotGridBackground>
    );
  }

  const isAnswered = answers[question.id] != null;
  const isMarked = marked[question.id] ?? false;

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Top Bar: Submit + Timer + Subject + Counter */}
        <View style={[styles.timerBar, { borderBottomColor: colors.surfaceBorder }]}>
          <Pressable onPress={handleSubmitPress} style={styles.submitBtnSmall}>
            <Text style={[styles.submitBtnText, { color: '#EF4444' }]}>Submit</Text>
          </Pressable>
          <View style={styles.timerCenter}>
            <Text style={[styles.timerText, { color: timerColor }]}>{formatTime(timeLeftMs)}</Text>
            <Text style={[Typography.bodySm, { color: colors.textTertiary, fontSize: 11 }]}>
              {subjectMeta.emoji} {subjectMeta.name}
            </Text>
          </View>
          <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
            {answeredCount}/{questions.length}
          </Text>
        </View>

        {/* Question Grid (mini nav) */}
        <View style={[styles.gridRow, { borderBottomColor: colors.surfaceBorder }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gridScroll}>
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const qAnswered = answers[q.id] != null;
              const qMarked = marked[q.id];
              const bg = isCurrent
                ? colors.primary
                : qMarked
                  ? '#F59E0B'
                  : qAnswered
                    ? '#22C55E'
                    : colors.surfaceBorder;
              const textColor = isCurrent || qAnswered || qMarked ? '#FFF' : colors.textSecondary;
              return (
                <Pressable
                  key={q.id}
                  onPress={() => navigateTo(idx)}
                  style={[styles.gridDot, { backgroundColor: bg }]}
                >
                  <Text style={[styles.gridDotText, { color: textColor }]}>{idx + 1}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Question Content */}
        <ScrollView
          ref={scrollRef}
          style={styles.questionScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.questionContent}
        >
          {/* Question Number + Difficulty */}
          <View style={styles.qHeader}>
            <Text style={[Typography.label, { color: colors.textSecondary }]}>
              Q{currentIndex + 1} of {questions.length}
            </Text>
            <View
              style={[
                styles.diffBadge,
                {
                  backgroundColor:
                    question.difficulty === 'easy'
                      ? '#22C55E20'
                      : question.difficulty === 'medium'
                        ? '#F59E0B20'
                        : '#EF444420',
                },
              ]}
            >
              <Text
                style={[
                  styles.diffText,
                  {
                    color:
                      question.difficulty === 'easy'
                        ? '#22C55E'
                        : question.difficulty === 'medium'
                          ? '#F59E0B'
                          : '#EF4444',
                  },
                ]}
              >
                {question.difficulty.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Question Text */}
          <View style={[styles.questionBox, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            <Text style={[Typography.body, { color: colors.text, lineHeight: 24 }]}>
              {t(language, question.text, question.textTe, question.textHi)}
            </Text>
          </View>

          {/* Options — long-press to eliminate */}
          <View style={styles.optionsList}>
            {questionOptions.map((opt, idx) => {
              const label = String.fromCharCode(65 + idx);
              const isSelected = answers[question.id] === opt.id;
              const isElim = (eliminated[question.id] ?? []).includes(opt.id);
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => handleSelectOption(opt.id)}
                  onLongPress={() => handleToggleEliminate(opt.id)}
                  style={[
                    styles.optionRow,
                    {
                      backgroundColor: isElim
                        ? colors.surfaceBorder + '30'
                        : isSelected
                          ? colors.primary + '12'
                          : colors.surface,
                      borderColor: isElim ? colors.surfaceBorder : isSelected ? colors.primary : colors.surfaceBorder,
                      borderWidth: isSelected && !isElim ? 2 : 1,
                      opacity: isElim ? 0.5 : 1,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.optionLabel,
                      {
                        backgroundColor: isElim
                          ? colors.surfaceBorder
                          : isSelected
                            ? colors.primary
                            : colors.surfaceBorder + '80',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionLabelText,
                        {
                          color: isSelected && !isElim ? '#FFF' : colors.textSecondary,
                          textDecorationLine: isElim ? 'line-through' : 'none',
                        },
                      ]}
                    >
                      {label}
                    </Text>
                  </View>
                  <Text
                    style={[
                      Typography.body,
                      {
                        color: isElim ? colors.textTertiary : colors.text,
                        flex: 1,
                        textDecorationLine: isElim ? 'line-through' : 'none',
                      },
                    ]}
                  >
                    {t(language, opt.text, opt.textTe, opt.textHi)}
                  </Text>
                  {isElim && <Text style={[styles.elimBadge, { color: colors.textTertiary }]}>X</Text>}
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.elimHint, { color: colors.textTertiary }]}>
            Long-press an option to cross it out
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <Pressable
              onPress={handleClearAnswer}
              disabled={!isAnswered}
              style={[styles.actionBtn, { borderColor: colors.surfaceBorder, opacity: isAnswered ? 1 : 0.4 }]}
            >
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Clear</Text>
            </Pressable>
            <Pressable
              onPress={handleToggleMark}
              style={[
                styles.actionBtn,
                {
                  borderColor: isMarked ? '#F59E0B' : colors.surfaceBorder,
                  backgroundColor: isMarked ? '#F59E0B15' : 'transparent',
                },
              ]}
            >
              <Text style={[Typography.bodySm, { color: isMarked ? '#F59E0B' : colors.textSecondary }]}>
                {isMarked ? 'Marked' : 'Mark for Review'}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setShowReportSheet(true)}
              style={[styles.actionBtn, { borderColor: colors.surfaceBorder }]}
            >
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>{'⚠️'} Report</Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* Bottom Nav */}
        <View style={[styles.bottomNav, { borderTopColor: colors.surfaceBorder, backgroundColor: colors.background }]}>
          <Pressable
            onPress={handlePrev}
            disabled={currentIndex === 0}
            hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
            style={[styles.navBtn, { opacity: currentIndex === 0 ? 0.3 : 1 }]}
          >
            <Text style={[styles.navBtnText, { color: colors.primary }]}>{'< Prev'}</Text>
          </Pressable>
          <Pressable
            onPress={handleReviewLater}
            disabled={currentIndex === questions.length - 1}
            hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
            style={[
              styles.reviewLaterBtn,
              {
                borderColor: isMarked ? '#F59E0B' : colors.surfaceBorder,
                backgroundColor: isMarked ? '#F59E0B15' : 'transparent',
                opacity: currentIndex === questions.length - 1 ? 0.3 : 1,
              },
            ]}
          >
            <Text style={[styles.reviewLaterText, { color: isMarked ? '#F59E0B' : colors.textSecondary }]}>
              {isMarked ? '📌 Marked' : 'Review Later'}
            </Text>
          </Pressable>
          <Pressable
            onPress={handleNext}
            disabled={currentIndex === questions.length - 1}
            hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
            style={[styles.navBtn, { opacity: currentIndex === questions.length - 1 ? 0.3 : 1 }]}
          >
            <Text style={[styles.navBtnText, { color: colors.primary }]}>{'Next >'}</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <ReportIssueSheet
        visible={showReportSheet}
        onClose={() => setShowReportSheet(false)}
        questionId={question.id}
        chapterId={question.chapterId}
      />
    </DotGridBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  timerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  submitBtnSmall: { paddingVertical: 4, paddingHorizontal: 10 },
  submitBtnText: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13 },
  timerCenter: { alignItems: 'center' },
  timerText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 20, letterSpacing: 1 },
  gridRow: { borderBottomWidth: 1, paddingVertical: Spacing.sm },
  gridScroll: { paddingHorizontal: Spacing.md, gap: 6 },
  gridDot: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridDotText: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 11 },
  questionScroll: { flex: 1 },
  questionContent: { padding: Spacing.lg, paddingBottom: 30 },
  qHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  diffBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.sm },
  diffText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 10, letterSpacing: 0.5 },
  questionBox: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  optionsList: { gap: Spacing.md },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  optionLabel: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabelText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 13 },
  elimBadge: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 14 },
  elimHint: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  actionRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.lg },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
  },
  navBtn: { paddingVertical: 14, paddingHorizontal: 20, minWidth: 80, alignItems: 'center' },
  navBtnText: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 15 },
  reviewLaterBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  reviewLaterText: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13 },
});
