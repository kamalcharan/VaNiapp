import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';

import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { SUBJECT_META } from '../../src/constants/subjects';
import { RootState } from '../../src/store';
import { getChapterById } from '../../src/data/chapters';
import { NEET_SCORING, ChapterExamSession, PracticeExamSession } from '../../src/types';

type FilterMode = 'all' | 'chapter' | 'practice';
type HistoryEntry =
  | { type: 'chapter'; session: ChapterExamSession; date: Date }
  | { type: 'practice'; session: PracticeExamSession; date: Date };

export default function HistoryScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [filter, setFilter] = useState<FilterMode>('all');

  const chapterHistory = useSelector((state: RootState) => state.practice.chapterHistory);
  const practiceHistory = useSelector((state: RootState) => state.practice.practiceHistory);

  // Combine and sort by date
  const entries = useMemo(() => {
    const items: HistoryEntry[] = [];

    chapterHistory.forEach((s) => {
      items.push({ type: 'chapter', session: s, date: new Date(s.completedAt ?? s.startedAt) });
    });
    practiceHistory.forEach((s) => {
      items.push({ type: 'practice', session: s, date: new Date(s.completedAt ?? s.startedAt) });
    });

    items.sort((a, b) => b.date.getTime() - a.date.getTime());
    return items;
  }, [chapterHistory, practiceHistory]);

  const filtered = useMemo(() => {
    if (filter === 'all') return entries;
    return entries.filter((e) => e.type === filter);
  }, [entries, filter]);

  const formatDate = (d: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const handleTap = (entry: HistoryEntry) => {
    router.push({
      pathname: '/(exam)/answer-review',
      params: { sessionId: entry.session.id },
    });
  };

  const FILTERS: { key: FilterMode; label: string }[] = [
    { key: 'all', label: `All (${entries.length})` },
    { key: 'chapter', label: `Chapter (${chapterHistory.length})` },
    { key: 'practice', label: `Practice (${practiceHistory.length})` },
  ];

  const isEmpty = entries.length === 0;

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={{ fontSize: 24 }}>{'\uD83D\uDCD3'}</Text>
          <Text style={[Typography.h1, { color: colors.text }]}>My Journal</Text>
        </View>

        {/* Filter Tabs */}
        {!isEmpty && (
          <View style={styles.filterRow}>
            {FILTERS.map((f) => {
              const isActive = f.key === filter;
              return (
                <Pressable
                  key={f.key}
                  onPress={() => setFilter(f.key)}
                  style={[
                    styles.filterTab,
                    {
                      backgroundColor: isActive ? colors.primary + '15' : 'transparent',
                      borderColor: isActive ? colors.primary : colors.surfaceBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      { color: isActive ? colors.primary : colors.textSecondary },
                    ]}
                  >
                    {f.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {isEmpty ? (
            <JournalCard delay={100} style={styles.emptyCard}>
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>{'\uD83D\uDCDD'}</Text>
                <Text style={[Typography.h3, { color: colors.text, textAlign: 'center' }]}>
                  No entries yet
                </Text>
                <HandwrittenText variant="hand">
                  Complete your first practice to see it here!
                </HandwrittenText>
              </View>
            </JournalCard>
          ) : (
            <>
              {filtered.length === 0 ? (
                <View style={styles.noResults}>
                  <Text style={[Typography.body, { color: colors.textSecondary, textAlign: 'center' }]}>
                    No {filter} exams yet
                  </Text>
                </View>
              ) : (
                filtered.map((entry, idx) => {
                  if (entry.type === 'chapter') {
                    const s = entry.session;
                    const chapter = getChapterById(s.chapterId);
                    const meta = SUBJECT_META[s.subjectId];
                    const pct = s.totalQuestions > 0 && s.correctCount !== null
                      ? Math.round((s.correctCount / s.totalQuestions) * 100)
                      : 0;
                    const scoreColor = pct >= 70 ? '#22C55E' : pct >= 40 ? '#F59E0B' : '#EF4444';

                    return (
                      <Pressable key={s.id} onPress={() => handleTap(entry)}>
                        <JournalCard delay={idx * 60} style={styles.entryCard}>
                          <View style={styles.entryTop}>
                            <View style={[styles.modeBadge, { backgroundColor: meta?.color + '20' }]}>
                              <Text style={[styles.modeBadgeText, { color: meta?.color }]}>CHAPTER</Text>
                            </View>
                            <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                              {formatDate(entry.date)}
                            </Text>
                          </View>
                          <Text style={[Typography.h3, { color: colors.text, marginTop: 6 }]} numberOfLines={1}>
                            {meta?.emoji} {chapter ? chapter.name : s.chapterId}
                          </Text>
                          <View style={styles.entryStats}>
                            <View style={styles.entryStatItem}>
                              <Text style={[styles.entryStatVal, { color: scoreColor }]}>{pct}%</Text>
                              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Score</Text>
                            </View>
                            <View style={[styles.entryStatDivider, { backgroundColor: colors.surfaceBorder }]} />
                            <View style={styles.entryStatItem}>
                              <Text style={[styles.entryStatVal, { color: '#22C55E' }]}>{s.correctCount ?? 0}</Text>
                              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Correct</Text>
                            </View>
                            <View style={[styles.entryStatDivider, { backgroundColor: colors.surfaceBorder }]} />
                            <View style={styles.entryStatItem}>
                              <Text style={[styles.entryStatVal, { color: '#EF4444' }]}>{s.totalQuestions - (s.correctCount ?? 0)}</Text>
                              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Wrong</Text>
                            </View>
                            {s.timeUsedMs ? (
                              <>
                                <View style={[styles.entryStatDivider, { backgroundColor: colors.surfaceBorder }]} />
                                <View style={styles.entryStatItem}>
                                  <Text style={[styles.entryStatVal, { color: colors.primary }]}>{formatTime(s.timeUsedMs)}</Text>
                                  <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Time</Text>
                                </View>
                              </>
                            ) : null}
                          </View>
                          <View style={styles.barBg}>
                            <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: scoreColor }]} />
                          </View>
                        </JournalCard>
                      </Pressable>
                    );
                  }

                  // Practice exam entry
                  const s = entry.session;
                  const pct = NEET_SCORING.maxMarks > 0 && s.score !== null
                    ? Math.round((s.score / NEET_SCORING.maxMarks) * 100)
                    : 0;
                  const scoreColor = pct >= 70 ? '#22C55E' : pct >= 40 ? '#F59E0B' : '#EF4444';

                  return (
                    <Pressable key={s.id} onPress={() => handleTap(entry)}>
                      <JournalCard delay={idx * 60} style={styles.entryCard}>
                        <View style={styles.entryTop}>
                          <View style={[styles.modeBadge, { backgroundColor: '#3B82F620' }]}>
                            <Text style={[styles.modeBadgeText, { color: '#3B82F6' }]}>PRACTICE</Text>
                          </View>
                          <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                            {formatDate(entry.date)}
                          </Text>
                        </View>
                        <Text style={[Typography.h3, { color: colors.text, marginTop: 6 }]}>
                          {'\uD83C\uDFAF'} NEET Practice Exam
                        </Text>
                        <View style={styles.entryStats}>
                          <View style={styles.entryStatItem}>
                            <Text style={[styles.entryStatVal, { color: scoreColor }]}>{s.score ?? 0}/{NEET_SCORING.maxMarks}</Text>
                            <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Score</Text>
                          </View>
                          <View style={[styles.entryStatDivider, { backgroundColor: colors.surfaceBorder }]} />
                          <View style={styles.entryStatItem}>
                            <Text style={[styles.entryStatVal, { color: scoreColor }]}>{pct}%</Text>
                            <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Accuracy</Text>
                          </View>
                          {s.timeUsedMs ? (
                            <>
                              <View style={[styles.entryStatDivider, { backgroundColor: colors.surfaceBorder }]} />
                              <View style={styles.entryStatItem}>
                                <Text style={[styles.entryStatVal, { color: colors.primary }]}>{formatTime(s.timeUsedMs)}</Text>
                                <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Time</Text>
                              </View>
                            </>
                          ) : null}
                        </View>
                        <View style={styles.barBg}>
                          <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: scoreColor }]} />
                        </View>
                        <Text style={[Typography.bodySm, { color: colors.textTertiary, marginTop: 4 }]}>
                          Tap to review answers
                        </Text>
                      </JournalCard>
                    </Pressable>
                  );
                })
              )}
            </>
          )}
        </ScrollView>
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
    gap: 12,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
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
  scroll: {
    padding: Spacing.lg,
    paddingTop: 0,
    gap: Spacing.md,
    paddingBottom: 40,
  },
  emptyCard: {
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  noResults: {
    paddingVertical: Spacing.xxl,
  },
  entryCard: {
    gap: 4,
  },
  entryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  modeBadgeText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  entryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  entryStatItem: {
    alignItems: 'center',
    gap: 2,
  },
  entryStatVal: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 16,
  },
  entryStatDivider: {
    width: 1,
    height: 28,
  },
  barBg: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: Spacing.sm,
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
});
