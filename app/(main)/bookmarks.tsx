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
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import * as Haptics from 'expo-haptics';

import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { QuestionRenderer } from '../../src/components/exam/QuestionRenderer';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { RootState } from '../../src/store';
import { removeBookmark } from '../../src/store/slices/bookmarkSlice';
import { fetchQuestionsByIds } from '../../src/lib/questions';
import { SUBJECT_META } from '../../src/constants/subjects';
import { reportError } from '../../src/lib/errorReporting';
import { getCorrectId } from '../../src/lib/questionAdapter';
import type { QuestionV2, Language } from '../../src/types';
import { t } from '../../src/types';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface SubjectSection {
  title: string;
  emoji: string;
  color: string;
  data: QuestionV2[];
}

export default function BookmarksScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const bookmarkedIds = useSelector((state: RootState) => state.bookmark.ids);
  const language = useSelector((state: RootState) => state.auth.user?.language ?? 'en') as Language;
  const [questions, setQuestions] = useState<QuestionV2[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  // Fetch full QuestionV2 data for bookmarked IDs from Supabase.
  useEffect(() => {
    if (bookmarkedIds.length === 0) {
      setQuestions([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const result = await fetchQuestionsByIds(bookmarkedIds);
        if (cancelled) return;
        setQuestions(result.ok ? result.questions : []);
      } catch (err) {
        reportError(err, 'medium', 'Bookmarks.fetchQuestions');
        if (!cancelled) setQuestions([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [bookmarkedIds]);

  // Group questions by subject
  const sections = useMemo<SubjectSection[]>(() => {
    const grouped: Record<string, QuestionV2[]> = {};
    for (const q of questions) {
      if (!grouped[q.subjectId]) grouped[q.subjectId] = [];
      grouped[q.subjectId].push(q);
    }
    const order = ['physics', 'chemistry', 'botany', 'zoology'];
    return Object.entries(grouped)
      .sort(([a], [b]) => {
        const ai = order.indexOf(a);
        const bi = order.indexOf(b);
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      })
      .map(([subjectId, data]) => {
        const meta = SUBJECT_META[subjectId] || { name: subjectId, emoji: '', color: '#94A3B8' };
        return { title: meta.name, emoji: meta.emoji, color: meta.color, data };
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
    if (expandedId === id) setExpandedId(null);
  };

  const handleToggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((prev) => (prev === id ? null : id));
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
                renderItem={({ item, index }) => {
                  const isExpanded = expandedId === item.id;
                  return (
                    <JournalCard delay={index * 80}>
                      <Pressable onPress={() => handleToggleExpand(item.id)} style={styles.card}>
                        {/* Collapsed header */}
                        <View style={styles.cardTop}>
                          <View style={styles.cardTopLeft}>
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
                            <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                              {isExpanded ? 'Tap to collapse' : 'Tap to review'}
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
                          numberOfLines={isExpanded ? undefined : 3}
                        >
                          {t(language, item.text, item.textTe, item.textHi)}
                        </Text>
                      </Pressable>

                      {/* Expanded: show options + explanation */}
                      {isExpanded && (
                        <View style={styles.expandedContent}>
                          <QuestionRenderer
                            question={item}
                            language={language}
                            selectedOptionId={getCorrectId(item)}
                            showFeedback={true}
                            onSelect={() => {}}
                            colors={colors}
                          />

                          {/* Explanation */}
                          <View style={[styles.explanationBox, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
                            <HandwrittenText variant="handSm">Explanation</HandwrittenText>
                            <Text style={[Typography.body, { color: colors.text, marginTop: Spacing.xs, lineHeight: 22 }]}>
                              {t(language, item.explanation, item.explanationTe, item.explanationHi)}
                            </Text>
                          </View>
                        </View>
                      )}
                    </JournalCard>
                  );
                }}
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
  cardTopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
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
  expandedContent: {
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  explanationBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
});
