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
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import * as Haptics from 'expo-haptics';

import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { useTheme } from '../../src/hooks/useTheme';
import { useFocusTracker } from '../../src/hooks/useFocusTracker';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { RootState } from '../../src/store';
import { fetchPracticeExamSet } from '../../src/lib/questions';
import { applyOptionShuffleToBatch } from '../../src/lib/optionShuffle';
import { setPracticeExamSnapshot } from '../../src/lib/practiceExamSnapshot';
import { SUBJECT_META } from '../../src/constants/subjects';
import {
  NeetSubjectId,
  NEET_SUBJECT_IDS,
  NEET_SCORING,
  PracticeExamSession,
  UserAnswer,
  QuestionV2,
  t,
} from '../../src/types';
import {
  startPracticeExam,
  updateAnswer,
  completePracticeExam,
  clearCurrentSession,
} from '../../src/store/slices/practiceSlice';
import { calculateNeetScore, calculateSubjectScores } from '../../src/store/slices/practiceSlice';
import { getCorrectId } from '../../src/lib/questionAdapter';
import { recordChapterAttempt } from '../../src/store/slices/strengthSlice';
import { recordDailyPractice } from '../../src/store/slices/streakSlice';
import { syncChapterProgress } from '../../src/lib/progressSync';
import { reportError } from '../../src/lib/errorReporting';
import { ReportIssueSheet } from '../../src/components/exam/ReportIssueSheet';
import { QuestionRenderer } from '../../src/components/exam/QuestionRenderer';

const SUBJECTS: { id: NeetSubjectId; emoji: string; short: string }[] = [
  { id: 'physics', emoji: '\u269B\uFE0F', short: 'PHY' },
  { id: 'chemistry', emoji: '\uD83E\uDDEA', short: 'CHE' },
  { id: 'botany', emoji: '\uD83C\uDF3F', short: 'BOT' },
  { id: 'zoology', emoji: '\uD83E\uDD8B', short: 'ZOO' },
];

interface ExamQuestion extends QuestionV2 {
  section: 'A' | 'B';
  indexInSection: number;
}

export default function PracticeQuestionScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.auth.user?.language ?? 'en');
  // Focus tracking (exam-specific)
  const focus = useFocusTracker();
  const scrollRef = useRef<ScrollView>(null);

  // Stable session id for this attempt — also used as the seed for per-question
  // option shuffling. Redux session reuses the same id.
  const sessionIdRef = useRef<string>(`pe-${Date.now()}`);

  // Loaded asynchronously from Supabase
  const [allQuestions, setAllQuestions] = useState<ExamQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Answers map: questionId -> selectedOptionId
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSubject, setActiveSubject] = useState<NeetSubjectId>('physics');
  const [activeSection, setActiveSection] = useState<'A' | 'B'>('A');
  const [timeLeftMs, setTimeLeftMs] = useState(NEET_SCORING.timeLimitMs);
  const [showReportSheet, setShowReportSheet] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch the 200-question exam set from Supabase, split into Section A/B per subject
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await fetchPracticeExamSet();
      if (cancelled) return;
      if (!result.ok) {
        setLoadError(
          result.error === 'no-questions'
            ? `No questions available${result.subjectId ? ` for ${result.subjectId}` : ''} yet.`
            : 'Couldn\'t load the exam. Check your connection.',
        );
        setLoading(false);
        return;
      }

      const qs: ExamQuestion[] = [];
      for (const subjectId of NEET_SUBJECT_IDS) {
        const subjectQs = result.bySubject[subjectId] ?? [];
        const shuffled = applyOptionShuffleToBatch(subjectQs, sessionIdRef.current);
        const sectionA = shuffled.slice(0, NEET_SCORING.sectionA);
        const sectionB = shuffled.slice(
          NEET_SCORING.sectionA,
          NEET_SCORING.sectionA + NEET_SCORING.sectionB,
        );
        sectionA.forEach((q, i) => qs.push({ ...q, section: 'A', indexInSection: i }));
        sectionB.forEach((q, i) => qs.push({ ...q, section: 'B', indexInSection: i }));
      }
      setAllQuestions(qs);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Initialize Redux session + start timer once questions are loaded
  useEffect(() => {
    if (loading || allQuestions.length === 0) return;
    const session: PracticeExamSession = {
      id: sessionIdRef.current,
      mode: 'practice',
      startedAt: new Date().toISOString(),
      completedAt: null,
      answers: [],
      totalQuestions: allQuestions.length,
      timeLimitMs: NEET_SCORING.timeLimitMs,
      score: null,
      maxMarks: NEET_SCORING.maxMarks,
      subjectScores: null,
      timeUsedMs: null,
    };
    dispatch(startPracticeExam(session));

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
  }, [loading, allQuestions.length]);

  // Auto-submit when timer reaches 0
  useEffect(() => {
    if (timeLeftMs === 0) {
      handleSubmit(true);
    }
  }, [timeLeftMs]);

  // Get questions for current subject + section
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(
      (q) => q.subjectId === activeSubject && q.section === activeSection
    );
  }, [allQuestions, activeSubject, activeSection]);

  const question = allQuestions[currentIndex];

  // Navigate to a specific question in subject/section
  const navigateToQuestion = useCallback(
    (subjectId: NeetSubjectId, section: 'A' | 'B', indexInSection: number) => {
      const idx = allQuestions.findIndex(
        (q) => q.subjectId === subjectId && q.section === section && q.indexInSection === indexInSection
      );
      if (idx >= 0) {
        setCurrentIndex(idx);
        setActiveSubject(subjectId);
        setActiveSection(section);
        scrollRef.current?.scrollTo({ y: 0, animated: false });
      }
    },
    [allQuestions]
  );

  // When subject/section tab changes, jump to first question there
  const handleSubjectChange = useCallback(
    (subjectId: NeetSubjectId) => {
      setActiveSubject(subjectId);
      navigateToQuestion(subjectId, activeSection, 0);
    },
    [activeSection, navigateToQuestion]
  );

  const handleSectionChange = useCallback(
    (section: 'A' | 'B') => {
      setActiveSection(section);
      navigateToQuestion(activeSubject, section, 0);
    },
    [activeSubject, navigateToQuestion]
  );

  const handleSelectOption = useCallback(
    (optionId: string) => {
      if (!question) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setAnswers((prev) => ({ ...prev, [question.id]: optionId }));

      const answer: UserAnswer = {
        questionId: question.id,
        selectedOptionId: optionId,
        isMarked: marked[question.id] ?? false,
        eliminatedOptionIds: [],
        timeSpentMs: 0,
      };
      dispatch(updateAnswer(answer));
    },
    [question, marked, dispatch],
  );

  const handleClearAnswer = useCallback(() => {
    if (!question) return;
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[question.id];
      return next;
    });

    const answer: UserAnswer = {
      questionId: question.id,
      selectedOptionId: null,
      isMarked: marked[question.id] ?? false,
      eliminatedOptionIds: [],
      timeSpentMs: 0,
    };
    dispatch(updateAnswer(answer));
  }, [question, marked, dispatch]);

  const handleToggleMark = useCallback(() => {
    if (!question) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMarked((prev) => ({ ...prev, [question.id]: !prev[question.id] }));
  }, [question]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      const prev = allQuestions[currentIndex - 1];
      setCurrentIndex(currentIndex - 1);
      setActiveSubject(prev.subjectId as NeetSubjectId);
      setActiveSection(prev.section);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [currentIndex, allQuestions]);

  const handleNext = useCallback(() => {
    if (currentIndex < allQuestions.length - 1) {
      const next = allQuestions[currentIndex + 1];
      setCurrentIndex(currentIndex + 1);
      setActiveSubject(next.subjectId as NeetSubjectId);
      setActiveSection(next.section);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [currentIndex, allQuestions]);

  const handleReviewLater = useCallback(() => {
    if (!question) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMarked((prev) => ({ ...prev, [question.id]: true }));
    handleNext();
  }, [question, handleNext]);

  const handleSubmit = useCallback(
    (autoSubmit = false) => {
      const doSubmit = () => {
        if (timerRef.current) clearInterval(timerRef.current);

        // Build maps for scoring
        const correctAnswerMap: Record<string, string> = {};
        const questionSubjectMap: Record<string, NeetSubjectId> = {};
        allQuestions.forEach((q) => {
          correctAnswerMap[q.id] = getCorrectId(q);
          questionSubjectMap[q.id] = q.subjectId as NeetSubjectId;
        });

        // Build UserAnswer array for all questions (scored ones only)
        // Section A: all 35, Section B: first 10 answered
        const scoredAnswers: UserAnswer[] = [];
        for (const subjectId of NEET_SUBJECT_IDS) {
          // Section A — all mandatory
          const secA = allQuestions.filter((q) => q.subjectId === subjectId && q.section === 'A');
          secA.forEach((q) => {
            scoredAnswers.push({
              questionId: q.id,
              selectedOptionId: answers[q.id] ?? null,
              isMarked: false,
              eliminatedOptionIds: [],
              timeSpentMs: 0,
            });
          });

          // Section B — only first 10 answered (or first 10 if < 10 answered)
          const secB = allQuestions.filter((q) => q.subjectId === subjectId && q.section === 'B');
          const answeredB = secB.filter((q) => answers[q.id]);
          const unansweredB = secB.filter((q) => !answers[q.id]);
          const scoredB = [
            ...answeredB.slice(0, NEET_SCORING.sectionBAttempt),
            ...unansweredB.slice(0, Math.max(0, NEET_SCORING.sectionBAttempt - answeredB.length)),
          ];
          scoredB.forEach((q) => {
            scoredAnswers.push({
              questionId: q.id,
              selectedOptionId: answers[q.id] ?? null,
              isMarked: false,
              eliminatedOptionIds: [],
              timeSpentMs: 0,
            });
          });
        }

        const totalResult = calculateNeetScore(scoredAnswers, correctAnswerMap);
        const subjectScores = calculateSubjectScores(scoredAnswers, correctAnswerMap, questionSubjectMap);
        const timeUsedMs = NEET_SCORING.timeLimitMs - timeLeftMs;

        dispatch(
          completePracticeExam({
            score: totalResult.score,
            subjectScores,
            completedAt: new Date().toISOString(),
            timeUsedMs,
          })
        );

        // Record strength tracking per chapter from scored answers
        const byChapter: Record<string, { questionId: string; correct: boolean }[]> = {};
        for (const sa of scoredAnswers) {
          const q = allQuestions.find((qq) => qq.id === sa.questionId);
          if (!q) continue;
          const chapId = q.chapterId ?? `${q.subjectId}-practice`;
          if (!byChapter[chapId]) byChapter[chapId] = [];
          byChapter[chapId].push({
            questionId: sa.questionId,
            correct: sa.selectedOptionId === correctAnswerMap[sa.questionId],
          });
        }
        for (const [chapId, answered] of Object.entries(byChapter)) {
          const q = allQuestions.find((qq) => (qq.chapterId ?? `${qq.subjectId}-practice`) === chapId);
          dispatch(
            recordChapterAttempt({
              chapterId: chapId,
              subjectId: q?.subjectId ?? 'physics',
              totalInBank: 50,
              answeredQuestions: answered,
            })
          );
        }

        // Record daily practice streak
        dispatch(recordDailyPractice());

        // Sync progress to Supabase in background
        for (const chapId of Object.keys(byChapter)) {
          syncChapterProgress(chapId).catch((e) => reportError(e, 'medium', 'PracticeExam.syncProgress'));
        }

        // Snapshot the question set so the results screen can analyze it
        // (chapter / difficulty / type breakdowns).
        setPracticeExamSnapshot(sessionIdRef.current, allQuestions);

        router.replace({
          pathname: '/practice-results',
          params: {
            score: String(totalResult.score),
            correct: String(totalResult.correct),
            wrong: String(totalResult.wrong),
            unanswered: String(totalResult.unanswered),
            timeUsedMs: String(timeUsedMs),
            focusSwitches: String(focus.switchCount),
          },
        });
      };

      if (autoSubmit) {
        doSubmit();
        return;
      }

      const answeredCount = Object.keys(answers).length;
      Alert.alert(
        'Submit Exam?',
        `You have answered ${answeredCount} out of ${allQuestions.length} questions. Once submitted, you cannot change your answers.`,
        [
          { text: 'Continue Exam', style: 'cancel' },
          { text: 'Submit', style: 'destructive', onPress: doSubmit },
        ]
      );
    },
    [answers, allQuestions, dispatch, router]
  );

  // Format timer
  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const timerColor = timeLeftMs < 600000 ? '#EF4444' : timeLeftMs < 1800000 ? '#F59E0B' : colors.text;
  const answeredCount = Object.keys(answers).length;

  if (loading) {
    return (
      <DotGridBackground>
        <SafeAreaView style={[styles.container, styles.center]} edges={['top']}>
          <ActivityIndicator color={colors.primary} />
          <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: Spacing.md }]}>
            Building your 200-question NEET mock...
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

  const isAnswered = answers[question.id] !== undefined;
  const isMarked = marked[question.id] ?? false;

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Timer Bar */}
        <View style={[styles.timerBar, { borderBottomColor: colors.surfaceBorder }]}>
          <Pressable onPress={() => handleSubmit()} style={styles.submitBtnSmall}>
            <Text style={[styles.submitBtnText, { color: '#EF4444' }]}>Submit</Text>
          </Pressable>
          <View style={styles.timerCenter}>
            <Text style={[styles.timerText, { color: timerColor }]}>{formatTime(timeLeftMs)}</Text>
          </View>
          <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
            {answeredCount}/{allQuestions.length}
          </Text>
        </View>

        {/* Subject Tabs */}
        <View style={[styles.subjectTabs, { borderBottomColor: colors.surfaceBorder }]}>
          {SUBJECTS.map((s) => {
            const isActive = s.id === activeSubject;
            const subjectQs = allQuestions.filter((q) => q.subjectId === s.id);
            const subjectAnswered = subjectQs.filter((q) => answers[q.id]).length;
            return (
              <Pressable
                key={s.id}
                onPress={() => handleSubjectChange(s.id)}
                style={[
                  styles.subjectTab,
                  isActive && { borderBottomWidth: 3, borderBottomColor: SUBJECT_META[s.id].color },
                ]}
              >
                <Text style={[styles.subjectTabText, { color: isActive ? colors.text : colors.textTertiary }]}>
                  {s.emoji} {s.short}
                </Text>
                <Text style={[styles.subjectTabCount, { color: isActive ? SUBJECT_META[s.id].color : colors.textTertiary }]}>
                  {subjectAnswered}/{subjectQs.length}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Section Tabs */}
        <View style={styles.sectionTabs}>
          {(['A', 'B'] as const).map((sec) => {
            const isActive = sec === activeSection;
            const secQs = allQuestions.filter((q) => q.subjectId === activeSubject && q.section === sec);
            const secLabel = sec === 'A'
              ? `Section A (${NEET_SCORING.sectionA} Qs)`
              : `Section B (${NEET_SCORING.sectionB} Qs — attempt ${NEET_SCORING.sectionBAttempt})`;
            return (
              <Pressable
                key={sec}
                onPress={() => handleSectionChange(sec)}
                style={[
                  styles.sectionTab,
                  {
                    backgroundColor: isActive ? colors.primary + '15' : 'transparent',
                    borderColor: isActive ? colors.primary : colors.surfaceBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    Typography.bodySm,
                    { color: isActive ? colors.primary : colors.textSecondary, fontFamily: 'PlusJakartaSans_600SemiBold' },
                  ]}
                >
                  {secLabel}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Question Grid (mini nav) */}
        <View style={[styles.gridRow, { borderBottomColor: colors.surfaceBorder }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gridScroll}>
            {filteredQuestions.map((q) => {
              const isCurrent = q.id === question.id;
              const qAnswered = answers[q.id] !== undefined;
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
                  onPress={() => navigateToQuestion(q.subjectId as NeetSubjectId, q.section, q.indexInSection)}
                  style={[styles.gridDot, { backgroundColor: bg }]}
                >
                  <Text style={[styles.gridDotText, { color: textColor }]}>{q.indexInSection + 1}</Text>
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
              Q{question.indexInSection + 1} of{' '}
              {activeSection === 'A' ? NEET_SCORING.sectionA : NEET_SCORING.sectionB}
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

          {/* Type-specific content + Options via QuestionRenderer (all 8 types) */}
          <QuestionRenderer
            question={question}
            language={language}
            selectedOptionId={answers[question.id] ?? null}
            showFeedback={false}
            onSelect={handleSelectOption}
            colors={colors}
          />

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
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>{'\u26A0\uFE0F'} Report</Text>
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
            disabled={currentIndex === allQuestions.length - 1}
            hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
            style={[styles.reviewLaterBtn, {
              borderColor: isMarked ? '#F59E0B' : colors.surfaceBorder,
              backgroundColor: isMarked ? '#F59E0B15' : 'transparent',
              opacity: currentIndex === allQuestions.length - 1 ? 0.3 : 1,
            }]}
          >
            <Text style={[styles.reviewLaterText, { color: isMarked ? '#F59E0B' : colors.textSecondary }]}>
              {isMarked ? '\uD83D\uDCCC Marked' : 'Review Later'}
            </Text>
          </Pressable>
          <Pressable
            onPress={handleNext}
            disabled={currentIndex === allQuestions.length - 1}
            hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
            style={[styles.navBtn, { opacity: currentIndex === allQuestions.length - 1 ? 0.3 : 1 }]}
          >
            <Text style={[styles.navBtnText, { color: colors.primary }]}>{'Next >'}</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Report Issue Sheet */}
      {question && (
        <ReportIssueSheet
          visible={showReportSheet}
          onClose={() => setShowReportSheet(false)}
          questionId={question.id}
          chapterId={question.chapterId}
        />
      )}
    </DotGridBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  timerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  submitBtnSmall: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  submitBtnText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
  },
  timerCenter: {
    alignItems: 'center',
  },
  timerText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 20,
    letterSpacing: 1,
  },
  subjectTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  subjectTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: 2,
  },
  subjectTabText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
  },
  subjectTabCount: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 10,
  },
  sectionTabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  sectionTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  gridRow: {
    borderBottomWidth: 1,
    paddingVertical: Spacing.sm,
  },
  gridScroll: {
    paddingHorizontal: Spacing.md,
    gap: 6,
  },
  gridDot: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridDotText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
  },
  questionScroll: {
    flex: 1,
  },
  questionContent: {
    padding: Spacing.lg,
    paddingBottom: 30,
  },
  qHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  diffBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  diffText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  questionBox: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  center: { justifyContent: 'center', alignItems: 'center' },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
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
  navBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  navBtnText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
  },
  submitBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  reviewLaterBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  reviewLaterText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
  },
});
