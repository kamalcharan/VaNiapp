import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SectionList,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import * as Haptics from 'expo-haptics';

import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { RootState } from '../../src/store';
import { removeBookmark } from '../../src/store/slices/bookmarkSlice';
import { supabase } from '../../src/lib/supabase';
import { getV2QuestionsByIds } from '../../src/data/questions';
import { SUBJECT_META } from '../../src/constants/subjects';
import { reportError } from '../../src/lib/errorReporting';

interface BookmarkedQuestion {
  id: string;
  questionText: string;
  subjectId: string;
  chapterId: string;
  difficulty: string;
  correctAnswer: string;
}

interface SubjectSection {
  title: string;
  emoji: string;
  color: string;
  data: BookmarkedQuestion[];
}

export default function BookmarksScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const bookmarkedIds = useSelector((state: RootState) => state.bookmark.ids);
  const [questions, setQuestions] = useState<BookmarkedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(20)).current;

  useEffect(() => {
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
  }, []);

  // Fetch bookmarked question details from local data + Supabase
  useEffect(() => {
    if (bookmarkedIds.length === 0) {
      setQuestions([]);
      setIsLoading(false);
      return;
    }

    (async () => {
      setIsLoading(true);
      try {
        // 1. Look up local questions first (chapter bank + V2 samples)
        const localQuestions = getV2QuestionsByIds(bookmarkedIds);
        const localResults: BookmarkedQuestion[] = localQuestions.map((q) => ({
          id: q.id,
          questionText: q.text,
          subjectId: q.subjectId,
          chapterId: q.chapterId,
          difficulty: q.difficulty,
          correctAnswer: '',
        }));
        const foundLocalIds = new Set(localResults.map((q) => q.id));

        // 2. For any IDs not found locally, try Supabase
        const remainingIds = bookmarkedIds.filter((id) => !foundLocalIds.has(id));
        let supabaseResults: BookmarkedQuestion[] = [];

        if (remainingIds.length > 0 && supabase) {
          // Search by both DB id AND payload->question_id since
          // dbToV2() uses payload.question_id as the question ID
          const { data } = await supabase
            .from('med_questions')
            .select('id, question_text, subject_id, chapter_id, difficulty, correct_answer, payload')
            .or(
              `id.in.(${remainingIds.map((i) => `"${i}"`).join(',')}),` +
              `payload->>question_id.in.(${remainingIds.map((i) => `"${i}"`).join(',')})`
            )
            .eq('status', 'active');

          if (data && data.length > 0) {
            supabaseResults = data.map((q: any) => {
              const qid = (q.payload as any)?.question_id || q.id;
              return {
                id: qid,
                questionText: q.question_text,
                subjectId: q.subject_id,
                chapterId: q.chapter_id,
                difficulty: q.difficulty,
                correctAnswer: q.correct_answer,
              };
            });
          }
        }

        setQuestions([...localResults, ...supabaseResults]);
      } catch (err) {
        reportError(err, 'medium', 'Bookmarks.fetchQuestions');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [bookmarkedIds]);

  // Group questions by subject
  const sections = useMemo<SubjectSection[]>(() => {
    const grouped: Record<string, BookmarkedQuestion[]> = {};
    for (const q of questions) {
      if (!grouped[q.subjectId]) grouped[q.subjectId] = [];
      grouped[q.subjectId].push(q);
    }
    // Sort subjects in consistent order
    const order = ['physics', 'chemistry', 'botany', 'zoology'];
    return Object.entries(grouped)
      .sort(([a], [b]) => {
        const ai = order.indexOf(a);
        const bi = order.indexOf(b);
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      })
      .map(([subjectId, data]) => {
        const meta = SUBJECT_META[subjectId] || { name: subjectId, emoji: '', color: '#94A3B8' };
        return {
          title: meta.name,
          emoji: meta.emoji,
          color: meta.color,
          data,
        };
      });
  }, [questions]);

  const DIFF_COLORS: Record<string, string> = {
    easy: '#22C55E',
    medium: '#F59E0B',
    hard: '#EF4444',
  };

  const handleRemove = (id: string) => {
    dispatch(removeBookmark(id));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePractice = (chapterId: string) => {
    router.push(`/chapter/${chapterId}`);
  };

  if (isLoading) {
    return (
      <DotGridBackground>
        <SafeAreaView style={[styles.container, styles.center]} edges={['top', 'bottom']}>
          <ActivityIndicator size="large" color={colors.primary} />
        </SafeAreaView>
      </DotGridBackground>
    );
  }

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <Animated.View
            style={[
              styles.content,
              { opacity: fadeIn, transform: [{ translateY: slideUp }] },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <Pressable
                onPress={() => router.replace('/(main)')}
                hitSlop={8}
                style={styles.backBtn}
              >
                <Text style={[styles.backArrow, { color: colors.text }]}>{'<'}</Text>
              </Pressable>
              <Text style={[Typography.h2, { color: colors.text, flex: 1 }]}>
                {'\uD83D\uDD16'} Bookmarks
              </Text>
              <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                {bookmarkedIds.length} saved
              </Text>
            </View>

            {bookmarkedIds.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={{ fontSize: 48, marginBottom: Spacing.md }}>{'\uD83D\uDCCC'}</Text>
                <Text style={[Typography.h3, { color: colors.text, textAlign: 'center' }]}>
                  No bookmarks yet
                </Text>
                <Text
                  style={[
                    Typography.bodySm,
                    { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm },
                  ]}
                >
                  Save questions during practice to review them later
                </Text>
              </View>
            ) : (
              <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                stickySectionHeadersEnabled={false}
                renderSectionHeader={({ section }) => (
                  <View style={styles.sectionHeader}>
                    <Text style={{ fontSize: 18 }}>{section.emoji}</Text>
                    <Text style={[Typography.h3, { color: section.color }]}>
                      {section.title}
                    </Text>
                    <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                      {section.data.length}
                    </Text>
                  </View>
                )}
                renderItem={({ item, index }) => (
                  <JournalCard delay={index * 80}>
                    <View style={styles.card}>
                      <View style={styles.cardTop}>
                        <View
                          style={[
                            styles.diffBadge,
                            { backgroundColor: (DIFF_COLORS[item.difficulty] || '#94A3B8') + '20' },
                          ]}
                        >
                          <Text
                            style={[
                              styles.diffText,
                              { color: DIFF_COLORS[item.difficulty] || '#94A3B8' },
                            ]}
                          >
                            {item.difficulty.toUpperCase()}
                          </Text>
                        </View>
                        <Pressable
                          onPress={() => handleRemove(item.id)}
                          hitSlop={8}
                        >
                          <Text style={{ fontSize: 16 }}>{'\u274C'}</Text>
                        </Pressable>
                      </View>

                      <Text
                        style={[Typography.body, { color: colors.text, marginTop: Spacing.sm, lineHeight: 22 }]}
                        numberOfLines={3}
                      >
                        {item.questionText}
                      </Text>

                      <Pressable
                        onPress={() => handlePractice(item.chapterId)}
                        style={[styles.practiceBtn, { backgroundColor: colors.primary + '15' }]}
                      >
                        <Text style={[styles.practiceBtnText, { color: colors.primary }]}>
                          Practice this chapter
                        </Text>
                      </Pressable>
                    </View>
                  </JournalCard>
                )}
                renderSectionFooter={() => <View style={{ height: Spacing.md }} />}
              />
            )}
          </Animated.View>
        </SafeAreaView>
      </DotGridBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.xs,
  },
  list: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  card: {
    gap: 4,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  diffText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  practiceBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  practiceBtnText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
  },
});
