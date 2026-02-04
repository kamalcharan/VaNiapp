import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
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
import { getV2QuestionsByChapter } from '../../src/data/questions';
import { getChapterById } from '../../src/data/chapters';
import { getCorrectId } from '../../src/lib/questionAdapter';
import { SUBJECT_META } from '../../src/constants/subjects';
import { ConfettiBurst } from '../../src/components/ui/ConfettiBurst';
import { AskVaniSheet } from '../../src/components/AskVaniSheet';
import { WrongAnswerCard } from '../../src/components/exam/WrongAnswerCard';
import { ConceptExplainerSheet } from '../../src/components/exam/ConceptExplainerSheet';
import { EliminationSheet } from '../../src/components/exam/EliminationSheet';
import { useToast } from '../../src/components/ui/Toast';
import { NeetSubjectId, SubjectId, QuestionType, STRENGTH_LEVELS, ChapterExamSession, UserAnswer } from '../../src/types';
import { startChapterExam, updateAnswer, completeChapterExam } from '../../src/store/slices/practiceSlice';
import { recordChapterAttempt } from '../../src/store/slices/strengthSlice';
import { toggleBookmark } from '../../src/store/slices/bookmarkSlice';

const DIFF_COLORS = { easy: '#22C55E', medium: '#F59E0B', hard: '#EF4444' };

export default function ChapterQuestionScreen() {
  const { colors, mode } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useToast();
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
  const language = useSelector((state: RootState) => state.auth.user?.language ?? 'en');
  const bookmarkedIds = useSelector((state: RootState) => state.bookmark.ids);

  const chapter = chapterId ? getChapterById(chapterId) : null;
  const strengthLevel = useSelector((state: RootState) =>
    chapterId ? state.strength.chapters[chapterId]?.strengthLevel ?? 'just-started' : 'just-started'
  );
  const unlockedTypes = useMemo(
    () => STRENGTH_LEVELS.find((l) => l.id === strengthLevel)?.unlockedTypes ?? (['mcq', 'true-false'] as QuestionType[]),
    [strengthLevel],
  );
  const questions = useMemo(
    () => (chapterId ? getV2QuestionsByChapter(chapterId, unlockedTypes) : []),
    [chapterId, unlockedTypes],
  );
  const subjectMeta = chapter ? SUBJECT_META[chapter.subjectId] : null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showElimination, setShowElimination] = useState(false);
  const [showVaniSheet, setShowVaniSheet] = useState(false);
  const [showConceptSheet, setShowConceptSheet] = useState(false);
  const [selectedConceptTag, setSelectedConceptTag] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [answerStreak, setAnswerStreak] = useState(0);
  const streakScaleAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);
  const startTimeRef = useRef(Date.now());

  const question = questions[currentIndex];
  const isBookmarked = question ? bookmarkedIds.includes(question.id) : false;
  const correctId = question ? getCorrectId(question) : '';
  const isCorrect = selectedOptionId === correctId;

  const correctCount = useMemo(() => {
    return Object.entries(answers).filter(([qId, optId]) => {
      const q = questions.find((qq) => qq.id === qId);
      return q ? optId === getCorrectId(q) : false;
    }).length;
  }, [answers, questions]);

  // Initialize session on first render
  useMemo(() => {
    if (!chapter || questions.length === 0) return;
    const session: ChapterExamSession = {
      id: `ch-${Date.now()}`,
      mode: 'chapter',
      chapterId: chapter.id,
      subjectId: chapter.subjectId as NeetSubjectId,
      startedAt: new Date().toISOString(),
      completedAt: null,
      answers: [],
      totalQuestions: questions.length,
      correctCount: null,
      timeUsedMs: null,
    };
    dispatch(startChapterExam(session));
  }, [chapter?.id]);

  const handleSelectOption = (optionId: string) => {
    if (showFeedback || !question) return;
    setSelectedOptionId(optionId);
    setShowFeedback(true);

    const correct = optionId === correctId;
    Haptics.impactAsync(
      correct ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Heavy
    );

    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));

    // Celebration on correct
    if (correct) {
      setAnswerStreak((s) => s + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
      // Animate streak badge
      if (answerStreak >= 1) {
        streakScaleAnim.setValue(0);
        Animated.spring(streakScaleAnim, { toValue: 1, useNativeDriver: true, damping: 8, stiffness: 200 }).start();
      }
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
      // Last question — compute final score and go to results
      const allAnswers = { ...answers, [question.id]: selectedOptionId! };
      const finalCorrect = Object.entries(allAnswers).filter(([qId, optId]) => {
        const q = questions.find((qq) => qq.id === qId);
        return q ? optId === getCorrectId(q) : false;
      }).length;

      const timeUsedMs = Date.now() - startTimeRef.current;
      dispatch(
        completeChapterExam({
          correctCount: finalCorrect,
          completedAt: new Date().toISOString(),
          timeUsedMs,
        })
      );

      // Record strength tracking
      dispatch(
        recordChapterAttempt({
          chapterId: chapterId!,
          subjectId: chapter!.subjectId,
          totalInBank: questions.length,
          answeredQuestions: Object.entries(allAnswers).map(([qId, optId]) => {
            const q = questions.find((qq) => qq.id === qId);
            return { questionId: qId, correct: q ? optId === getCorrectId(q) : false };
          }),
        })
      );

      router.replace({
        pathname: '/(exam)/chapter-results',
        params: { chapterId: chapterId!, correct: String(finalCorrect), total: String(questions.length), timeUsedMs: String(timeUsedMs) },
      });
      return;
    }

    // Move to next question directly (no animation that blocks)
    setCurrentIndex((prev) => prev + 1);
    setSelectedOptionId(null);
    setShowFeedback(false);
    setShowElimination(false);
    setShowVaniSheet(false);
    setShowConceptSheet(false);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  if (!question || !chapter || !subjectMeta) return null;

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
            <Text style={[Typography.bodySm, { color: colors.textSecondary }]} numberOfLines={1}>
              {subjectMeta.emoji} {language === 'te' ? chapter.nameTe : chapter.name}
            </Text>
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

        {/* Scrollable Question Content */}
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
                onPress={() => setShowElimination((p) => !p)}
                hitSlop={6}
                style={[
                  styles.actionBadge,
                  {
                    backgroundColor: showElimination ? '#8B5CF620' : '#64748B15',
                    borderColor: showElimination ? '#8B5CF6' : '#64748B40',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.actionBadgeText,
                    { color: showElimination ? '#8B5CF6' : '#64748B' },
                  ]}
                >
                  {'\u2702\uFE0F'} Eliminate
                </Text>
              </Pressable>
              <Pressable
                onPress={() => { dispatch(toggleBookmark(question.id)); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toast.show('success', isBookmarked ? 'Bookmark removed' : 'Question bookmarked'); }}
                hitSlop={6}
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
              {showFeedback && !isCorrect && (
                <Pressable
                  onPress={() => setShowVaniSheet(true)}
                  hitSlop={6}
                  style={[
                    styles.actionBadge,
                    {
                      backgroundColor: colors.primary + '15',
                      borderColor: colors.primary + '50',
                    },
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
              <View style={[styles.banner, { backgroundColor: isCorrect ? '#22C55E18' : '#EF444418' }]}>
                <Text style={[Typography.h3, { color: isCorrect ? '#16A34A' : '#DC2626' }]}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </Text>
                {isCorrect && answerStreak >= 2 && (
                  <Animated.View style={{ transform: [{ scale: Animated.add(streakScaleAnim, new Animated.Value(0)).interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }] }}>
                    <Text style={styles.streakText}>
                      {'\uD83D\uDD25'} {answerStreak} in a row!
                    </Text>
                  </Animated.View>
                )}
                {!isCorrect && 'options' in question.payload && (
                  <Text style={[Typography.bodySm, { color: '#DC2626', marginTop: 2 }]}>
                    Correct answer:{' '}
                    {String.fromCharCode(65 + (question.payload as { options: { id: string }[]; correctOptionId: string }).options.findIndex((o) => o.id === (question.payload as { correctOptionId: string }).correctOptionId))}
                  </Text>
                )}
                {!isCorrect && question.payload.type === 'true-false' && (
                  <Text style={[Typography.bodySm, { color: '#DC2626', marginTop: 2 }]}>
                    Correct answer: {question.payload.correctAnswer ? 'True' : 'False'}
                  </Text>
                )}
              </View>

              {/* Wrong-Answer Analysis (R10) */}
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

              {/* Explanation */}
              <JournalCard delay={0}>
                <HandwrittenText variant="handSm">Explanation</HandwrittenText>
                <Text style={[Typography.body, { color: colors.text, marginTop: Spacing.sm, lineHeight: 22 }]}>
                  {language === 'te' ? question.explanationTe : question.explanation}
                </Text>
              </JournalCard>

              {/* Elimination Technique inline removed — now shown as bottom sheet */}
            </View>
          )}
        </ScrollView>

        {/* Fixed Bottom Bar — always visible after answering */}
        <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.surfaceBorder }]}>
          <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
            {showFeedback
              ? `Score: ${correctCount + (isCorrect ? 1 : 0)}/${currentIndex + 1}`
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
            <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
              Tap an option to answer
            </Text>
          )}
        </View>
      </SafeAreaView>

      {/* Ask VaNi Bottom Sheet */}
      <AskVaniSheet
        visible={showVaniSheet}
        onClose={() => setShowVaniSheet(false)}
        questionText={language === 'te' ? question.textTe : question.text}
        subjectId={question.subjectId as SubjectId}
        questionId={question.id}
      />

      {/* Concept Explainer Bottom Sheet (R10) */}
      <ConceptExplainerSheet
        visible={showConceptSheet}
        onClose={() => setShowConceptSheet(false)}
        conceptTag={selectedConceptTag}
        subjectId={question.subjectId as SubjectId}
        chapterId={question.chapterId}
        language={language}
      />

      {/* Elimination Technique Bottom Sheet */}
      <EliminationSheet
        visible={showElimination}
        onClose={() => setShowElimination(false)}
        eliminationText={String((language === 'te' ? question.eliminationTechniqueTe : question.eliminationTechnique) || '')}
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
