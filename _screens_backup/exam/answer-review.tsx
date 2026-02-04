import React, { useState, useMemo } from 'react';
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
import { SUBJECT_META } from '../../src/constants/subjects';
import { RootState } from '../../src/store';
import { getV2QuestionsByChapter } from '../../src/data/questions';
import { getChapterById } from '../../src/data/chapters';
import { getCorrectId, legacyBatchToV2 } from '../../src/lib/questionAdapter';
import { getAllQuestions } from '../../src/data/questions';
import { AskVaniSheet } from '../../src/components/AskVaniSheet';
import { WrongAnswerCard } from '../../src/components/exam/WrongAnswerCard';
import { ConceptExplainerSheet } from '../../src/components/exam/ConceptExplainerSheet';
import { EliminationSheet } from '../../src/components/exam/EliminationSheet';
import { useToast } from '../../src/components/ui/Toast';
import { toggleBookmark } from '../../src/store/slices/bookmarkSlice';
import { QuestionV2, UserAnswer, SubjectId } from '../../src/types';

type Filter = 'all' | 'wrong' | 'correct' | 'skipped';

export default function AnswerReviewScreen() {
  const { colors, mode } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useToast();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const language = useSelector((state: RootState) => state.auth.user?.language ?? 'en');
  const bookmarkedIds = useSelector((state: RootState) => state.bookmark.ids);

  const session = useSelector((state: RootState) => {
    const pe = state.practice.practiceHistory.find((s) => s.id === sessionId);
    if (pe) return pe;
    const ce = state.practice.chapterHistory.find((s) => s.id === sessionId);
    return ce ?? null;
  });

  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showElimination, setShowElimination] = useState(false);
  const [showVaniSheet, setShowVaniSheet] = useState(false);
  const [showConceptSheet, setShowConceptSheet] = useState(false);
  const [selectedConceptTag, setSelectedConceptTag] = useState('');

  // Build question list + answer map
  const { questions, answerMap } = useMemo(() => {
    if (!session) return { questions: [] as QuestionV2[], answerMap: {} as Record<string, UserAnswer> };

    let qs: QuestionV2[];
    if (session.mode === 'chapter') {
      qs = getV2QuestionsByChapter(session.chapterId);
    } else {
      qs = legacyBatchToV2(getAllQuestions());
    }

    const aMap: Record<string, UserAnswer> = {};
    session.answers.forEach((a) => {
      aMap[a.questionId] = a;
    });

    return { questions: qs, answerMap: aMap };
  }, [session]);

  // Classify each question
  const classified = useMemo(() => {
    return questions.map((q) => {
      const answer = answerMap[q.id];
      const selected = answer?.selectedOptionId ?? null;
      let status: 'correct' | 'wrong' | 'skipped';
      if (!selected) {
        status = 'skipped';
      } else if (selected === getCorrectId(q)) {
        status = 'correct';
      } else {
        status = 'wrong';
      }
      return { question: q, answer, selected, status };
    });
  }, [questions, answerMap]);

  // Counts per filter
  const counts = useMemo(() => {
    const c = { all: classified.length, correct: 0, wrong: 0, skipped: 0 };
    classified.forEach((item) => c[item.status]++);
    return c;
  }, [classified]);

  // Filtered list
  const filtered = useMemo(() => {
    if (activeFilter === 'all') return classified;
    return classified.filter((item) => item.status === activeFilter);
  }, [classified, activeFilter]);

  const current = filtered[currentIndex];

  const handleFilterChange = (filter: Filter) => {
    setActiveFilter(filter);
    setCurrentIndex(0);
    setShowElimination(false);
    setShowVaniSheet(false);
    setShowConceptSheet(false);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowElimination(false);
      setShowVaniSheet(false);
      setShowConceptSheet(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < filtered.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowElimination(false);
      setShowVaniSheet(false);
      setShowConceptSheet(false);
    }
  };

  if (!session || !current) {
    return (
      <DotGridBackground>
        <SafeAreaView style={styles.container} edges={['top']}>
          <View style={styles.emptyState}>
            <Text style={[Typography.h3, { color: colors.text }]}>No review data available</Text>
          </View>
        </SafeAreaView>
      </DotGridBackground>
    );
  }

  const { question, selected, status } = current;
  const subjectMeta = SUBJECT_META[question.subjectId];
  const chapter = getChapterById(question.chapterId);

  const FILTERS: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'wrong', label: 'Wrong', count: counts.wrong },
    { key: 'correct', label: 'Correct', count: counts.correct },
    { key: 'skipped', label: 'Skipped', count: counts.skipped },
  ];

  const filterColors: Record<Filter, string> = {
    all: colors.primary,
    wrong: '#EF4444',
    correct: '#22C55E',
    skipped: '#64748B',
  };

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.surfaceBorder }]}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
            <Text style={[styles.backArrow, { color: colors.text }]}>{'<'}</Text>
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={[Typography.h3, { color: colors.text }]}>Answer Review</Text>
          </View>
          <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
            {currentIndex + 1}/{filtered.length}
          </Text>
        </View>

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
          {FILTERS.map((f) => {
            const isActive = f.key === activeFilter;
            const fColor = filterColors[f.key];
            return (
              <Pressable
                key={f.key}
                onPress={() => handleFilterChange(f.key)}
                style={[
                  styles.filterTab,
                  {
                    backgroundColor: isActive ? fColor + '15' : 'transparent',
                    borderColor: isActive ? fColor : colors.surfaceBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    { color: isActive ? fColor : colors.textSecondary },
                  ]}
                >
                  {f.label} ({f.count})
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Question Content */}
        <ScrollView
          style={styles.questionScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.questionContent}
        >
          {/* Question Meta */}
          <View style={styles.qMeta}>
            <View style={styles.qMetaLeft}>
              <View style={[styles.subjectBadge, { backgroundColor: subjectMeta?.color + '20' }]}>
                <Text style={[styles.subjectBadgeText, { color: subjectMeta?.color }]}>
                  {subjectMeta?.emoji} {subjectMeta?.name}
                </Text>
              </View>
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

            <View style={styles.qMetaRight}>
              <Pressable
                onPress={() => setShowElimination((p) => !p)}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                style={[
                  styles.metaActionBadge,
                  {
                    backgroundColor: showElimination ? '#8B5CF620' : '#64748B15',
                    borderColor: showElimination ? '#8B5CF6' : '#64748B40',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.metaActionText,
                    { color: showElimination ? '#8B5CF6' : '#64748B' },
                  ]}
                >
                  {'\u2702\uFE0F'} Eliminate
                </Text>
              </Pressable>
              <Pressable
                onPress={() => { dispatch(toggleBookmark(question.id)); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toast.show('success', bookmarkedIds.includes(question.id) ? 'Bookmark removed' : 'Question bookmarked'); }}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                style={[
                  styles.metaActionBadge,
                  {
                    backgroundColor: bookmarkedIds.includes(question.id) ? '#F59E0B20' : '#64748B15',
                    borderColor: bookmarkedIds.includes(question.id) ? '#F59E0B' : '#64748B40',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.metaActionText,
                    { color: bookmarkedIds.includes(question.id) ? '#F59E0B' : '#64748B' },
                  ]}
                >
                  {bookmarkedIds.includes(question.id) ? '\uD83D\uDD16 Saved' : '\uD83D\uDCCC Save'}
                </Text>
              </Pressable>
              {status === 'wrong' && (
                <Pressable
                  onPress={() => setShowVaniSheet(true)}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  style={[
                    styles.metaActionBadge,
                    {
                      backgroundColor: colors.primary + '15',
                      borderColor: colors.primary + '50',
                    },
                  ]}
                >
                  <Text style={[styles.metaActionText, { color: colors.primary }]}>
                    {'\u2728'} VaNi
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          {chapter && (
            <Text style={[Typography.bodySm, { color: colors.textTertiary, marginBottom: Spacing.sm }]}>
              {language === 'te' ? chapter.nameTe : chapter.name}
            </Text>
          )}

          {/* Result Banner */}
          <View
            style={[
              styles.resultBanner,
              {
                backgroundColor:
                  status === 'correct' ? '#22C55E15' : status === 'wrong' ? '#EF444415' : '#64748B15',
              },
            ]}
          >
            <Text
              style={[
                Typography.label,
                {
                  color:
                    status === 'correct' ? '#22C55E' : status === 'wrong' ? '#EF4444' : '#64748B',
                },
              ]}
            >
              {status === 'correct' ? 'CORRECT' : status === 'wrong' ? 'INCORRECT' : 'SKIPPED'}
            </Text>
          </View>

          {/* Question Text */}
          <View style={[styles.questionBox, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            <Text style={[Typography.body, { color: colors.text, lineHeight: 24 }]}>
              {language === 'te' ? question.textTe : question.text}
            </Text>
          </View>

          {/* Type-specific content + Options via QuestionRenderer */}
          <QuestionRenderer
            question={question}
            language={language}
            selectedOptionId={selected}
            showFeedback={true}
            onSelect={() => {}}
            colors={colors}
          />

          {/* Explanation */}
          <JournalCard delay={0}>
            <HandwrittenText variant="handSm">Explanation</HandwrittenText>
            <Text style={[Typography.body, { color: colors.text, marginTop: Spacing.sm, lineHeight: 22 }]}>
              {language === 'te' ? question.explanationTe : question.explanation}
            </Text>
          </JournalCard>

          {/* Wrong-Answer Analysis (R10) */}
          {status === 'wrong' && selected && (
            <WrongAnswerCard
              questionId={question.id}
              selectedOptionId={selected}
              correctOptionId={getCorrectId(question)}
              questionText={language === 'te' ? question.textTe : question.text}
              subjectId={question.subjectId as SubjectId}
              language={language}
              onConceptPress={(tag) => { setSelectedConceptTag(tag); setShowConceptSheet(true); }}
            />
          )}

          {/* Elimination Technique inline removed — now shown as bottom sheet */}
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

          {/* Mini question dots */}
          <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
            {currentIndex + 1} of {filtered.length}
          </Text>

          <Pressable
            onPress={handleNext}
            disabled={currentIndex >= filtered.length - 1}
            hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
            style={[styles.navBtn, { opacity: currentIndex >= filtered.length - 1 ? 0.3 : 1 }]}
          >
            <Text style={[styles.navBtnText, { color: colors.primary }]}>{'Next >'}</Text>
          </Pressable>
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
  container: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  filterRow: {
    maxHeight: 50,
    borderBottomWidth: 0,
  },
  filterContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  filterTabText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
  },
  questionScroll: {
    flex: 1,
  },
  questionContent: {
    padding: Spacing.lg,
    paddingBottom: 30,
    gap: Spacing.md,
  },
  qMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qMetaLeft: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexShrink: 1,
  },
  qMetaRight: {
    flexDirection: 'row',
    gap: 8,
  },
  metaActionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  metaActionText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
  },
  subjectBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  subjectBadgeText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
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
  resultBanner: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  questionBox: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
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
});
