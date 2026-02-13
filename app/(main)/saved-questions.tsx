import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import * as Haptics from 'expo-haptics';

import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { RootState } from '../../src/store';
import { SUBJECT_META } from '../../src/constants/subjects';
import { fetchQuestionsByIds } from '../../src/lib/questionService';
import { removeBookmark } from '../../src/store/slices/bookmarkSlice';
import { removeMistake } from '../../src/store/slices/practiceSlice';
import { QuestionV2 } from '../../src/types';

type Tab = 'saved' | 'mistakes';

export default function SavedQuestionsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { tab: initialTab } = useLocalSearchParams<{ tab?: string }>();
  const language = useSelector((state: RootState) => state.auth.user?.language ?? 'en');

  const bookmarkedIds = useSelector((state: RootState) => state.bookmark.ids);
  const mistakeIds = useSelector((state: RootState) => state.practice.mistakeIds);

  const [activeTab, setActiveTab] = useState<Tab>(
    initialTab === 'mistakes' ? 'mistakes' : 'saved'
  );
  const [questions, setQuestions] = useState<QuestionV2[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const ids = activeTab === 'saved' ? bookmarkedIds : mistakeIds;

  useEffect(() => {
    if (ids.length === 0) {
      setQuestions([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchQuestionsByIds(ids).then((qs) => {
      if (!cancelled) {
        setQuestions(qs);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [ids]);

  const handleRemove = (questionId: string) => {
    if (activeTab === 'saved') {
      dispatch(removeBookmark(questionId));
    } else {
      dispatch(removeMistake(questionId));
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setExpandedId(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Entrance animation
  const fadeIn = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.surfaceBorder }]}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
            <Text style={[styles.backArrow, { color: colors.text }]}>{'<'}</Text>
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={[Typography.h3, { color: colors.text }]}>My Questions</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        {/* Tabs */}
        <View style={[styles.tabRow, { borderBottomColor: colors.surfaceBorder }]}>
          {([
            { key: 'saved' as Tab, label: 'Saved', count: bookmarkedIds.length, emoji: '\uD83D\uDD16' },
            { key: 'mistakes' as Tab, label: 'Mistakes', count: mistakeIds.length, emoji: '\u274C' },
          ]).map((t) => {
            const isActive = activeTab === t.key;
            return (
              <Pressable
                key={t.key}
                onPress={() => handleTabChange(t.key)}
                style={[
                  styles.tab,
                  { borderBottomColor: isActive ? colors.primary : 'transparent' },
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: isActive ? colors.primary : colors.textSecondary },
                  ]}
                >
                  {t.emoji} {t.label} ({t.count})
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Content */}
        <Animated.ScrollView
          style={{ opacity: fadeIn }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {loading && (
            <View style={styles.centerState}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[Typography.body, { color: colors.textSecondary, marginTop: Spacing.md }]}>
                Loading questions...
              </Text>
            </View>
          )}

          {!loading && questions.length === 0 && (
            <View style={styles.centerState}>
              <Text style={{ fontSize: 48, marginBottom: Spacing.md }}>
                {activeTab === 'saved' ? '\uD83D\uDD16' : '\u2728'}
              </Text>
              <Text style={[Typography.h3, { color: colors.text, textAlign: 'center' }]}>
                {activeTab === 'saved' ? 'No saved questions yet' : 'No mistakes recorded'}
              </Text>
              <Text style={[Typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm }]}>
                {activeTab === 'saved'
                  ? 'Bookmark questions during practice to review them here.'
                  : 'Questions you get wrong will appear here for review.'}
              </Text>
            </View>
          )}

          {!loading && questions.map((q, idx) => {
            const subjectMeta = SUBJECT_META[q.subjectId];
            const isExpanded = expandedId === q.id;
            return (
              <JournalCard key={q.id} delay={idx * 50}>
                <Pressable onPress={() => setExpandedId(isExpanded ? null : q.id)}>
                  {/* Question header row */}
                  <View style={styles.qRow}>
                    <View style={styles.qMetaRow}>
                      <View style={[styles.subjectDot, { backgroundColor: subjectMeta?.color || colors.primary }]} />
                      <Text style={[Typography.bodySm, { color: colors.textSecondary }]} numberOfLines={1}>
                        {subjectMeta?.name || q.subjectId}
                      </Text>
                      <View
                        style={[
                          styles.diffPill,
                          {
                            backgroundColor:
                              q.difficulty === 'easy' ? '#22C55E20' : q.difficulty === 'medium' ? '#F59E0B20' : '#EF444420',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.diffPillText,
                            {
                              color:
                                q.difficulty === 'easy' ? '#22C55E' : q.difficulty === 'medium' ? '#F59E0B' : '#EF4444',
                            },
                          ]}
                        >
                          {q.difficulty.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <Pressable onPress={() => handleRemove(q.id)} hitSlop={8}>
                      <Text style={[Typography.bodySm, { color: '#EF4444' }]}>Remove</Text>
                    </Pressable>
                  </View>

                  {/* Question text */}
                  <Text
                    style={[Typography.body, { color: colors.text, marginTop: Spacing.sm, lineHeight: 22 }]}
                    numberOfLines={isExpanded ? undefined : 2}
                  >
                    {language === 'te' ? q.textTe : q.text}
                  </Text>

                  {/* Expand indicator */}
                  <Text style={[styles.expandHint, { color: colors.textTertiary }]}>
                    {isExpanded ? '\u25B2 collapse' : '\u25BC tap to expand'}
                  </Text>
                </Pressable>

                {/* Expanded: explanation */}
                {isExpanded && (
                  <View style={[styles.expandedContent, { borderTopColor: colors.surfaceBorder }]}>
                    <Text style={[Typography.label, { color: '#22C55E', marginBottom: 4 }]}>EXPLANATION</Text>
                    <Text style={[Typography.body, { color: colors.text, lineHeight: 22 }]}>
                      {language === 'te' ? q.explanationTe : q.explanation}
                    </Text>

                    {/* Concept tags */}
                    {q.conceptTags && q.conceptTags.length > 0 && (
                      <View style={styles.conceptRow}>
                        {q.conceptTags.map((tag, i) => (
                          <View
                            key={i}
                            style={[styles.conceptPill, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}
                          >
                            <Text style={[styles.conceptPillText, { color: colors.primary }]}>
                              {tag.replace(/-/g, ' ')}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </JournalCard>
            );
          })}
        </Animated.ScrollView>
      </SafeAreaView>
    </DotGridBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 2,
  },
  tabText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: 40,
  },
  centerState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  qRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subjectDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  diffPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  diffPillText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  expandHint: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  expandedContent: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  conceptRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: Spacing.md,
  },
  conceptPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  conceptPillText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    textTransform: 'capitalize',
  },
});
