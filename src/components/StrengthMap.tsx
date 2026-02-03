import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { ChapterStrengthData } from '../store/slices/strengthSlice';
import { NEET_CHAPTERS } from '../data/chapters';
import { SUBJECT_META } from '../constants/subjects';
import { STRENGTH_LEVELS, NEEDS_FOCUS_CONFIG, StrengthLevel } from '../types';
import { useTheme } from '../hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../constants/theme';
import { evaluateSubjectStrength } from '../lib/strengthEvaluator';

function getStrengthConfig(level: StrengthLevel) {
  if (level === 'needs-focus') return NEEDS_FOCUS_CONFIG;
  return STRENGTH_LEVELS.find((s) => s.id === level) ?? STRENGTH_LEVELS[0];
}

// ── Chapter Row ──

function ChapterRow({
  chapterName,
  data,
  colors,
}: {
  chapterName: string;
  data: ChapterStrengthData | null;
  colors: any;
}) {
  const coverage = data?.coverage ?? 0;
  const accuracy = data?.accuracy ?? 0;
  const level = data?.strengthLevel ?? 'just-started';
  const config = getStrengthConfig(level);

  return (
    <View style={styles.chapterRow}>
      <View style={styles.chapterInfo}>
        <Text style={[styles.chapterName, { color: colors.text }]} numberOfLines={1}>
          {chapterName}
        </Text>
        <View style={styles.chapterMeta}>
          <View style={[styles.strengthBadge, { backgroundColor: config.color + '18' }]}>
            <Text style={[styles.strengthLabel, { color: config.color }]}>
              {config.label}
            </Text>
          </View>
          {data && data.totalAnswered > 0 && (
            <Text style={[styles.accuracyText, { color: colors.textTertiary }]}>
              {Math.round(accuracy)}% accuracy
            </Text>
          )}
        </View>
      </View>
      {/* Progress bar */}
      <View style={[styles.barBg, { backgroundColor: colors.surfaceBorder }]}>
        <View
          style={[
            styles.barFill,
            {
              backgroundColor: config.color,
              width: `${Math.min(coverage, 100)}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

// ── Subject Section ──

function SubjectSection({
  subjectId,
  colors,
}: {
  subjectId: string;
  colors: any;
}) {
  const chapters = useSelector((state: RootState) => state.strength.chapters);
  const subjectMeta = SUBJECT_META[subjectId];
  const subjectChapters = NEET_CHAPTERS.filter((c) => c.subjectId === subjectId);

  const subjectStrength = useMemo(() => {
    const chapterData = subjectChapters.map((ch) => {
      const data = chapters[ch.id];
      return {
        coverage: data?.coverage ?? 0,
        accuracy: data?.accuracy ?? 0,
        totalInBank: ch.questionCount,
      };
    });
    return evaluateSubjectStrength(chapterData);
  }, [chapters, subjectChapters]);

  const subjectConfig = getStrengthConfig(subjectStrength.level);

  if (!subjectMeta) return null;

  return (
    <View style={styles.subjectSection}>
      {/* Subject header */}
      <View style={styles.subjectHeader}>
        <Text style={styles.subjectEmoji}>{subjectMeta.emoji}</Text>
        <Text style={[styles.subjectName, { color: colors.text }]}>{subjectMeta.name}</Text>
        <View style={[styles.strengthBadge, { backgroundColor: subjectConfig.color + '18' }]}>
          <Text style={[styles.strengthLabel, { color: subjectConfig.color }]}>
            {subjectConfig.label}
          </Text>
        </View>
      </View>

      {/* Chapter rows */}
      {subjectChapters.map((ch) => (
        <ChapterRow
          key={ch.id}
          chapterName={ch.name}
          data={chapters[ch.id] ?? null}
          colors={colors}
        />
      ))}
    </View>
  );
}

// ── Main Component ──

export function StrengthMap({ compact = false }: { compact?: boolean }) {
  const { colors } = useTheme();
  const subjects = ['physics', 'chemistry', 'botany', 'zoology'];

  // Compact mode: show only subjects with rolled-up bars (for dashboard)
  if (compact) {
    return (
      <View style={styles.compactWrap}>
        {subjects.map((subjectId) => (
          <CompactSubjectRow key={subjectId} subjectId={subjectId} colors={colors} />
        ))}
      </View>
    );
  }

  // Full mode: show per-chapter breakdowns (for profile)
  return (
    <View style={styles.fullWrap}>
      {subjects.map((subjectId) => (
        <SubjectSection key={subjectId} subjectId={subjectId} colors={colors} />
      ))}
    </View>
  );
}

// ── Compact Row (dashboard) ──

function CompactSubjectRow({
  subjectId,
  colors,
}: {
  subjectId: string;
  colors: any;
}) {
  const chapters = useSelector((state: RootState) => state.strength.chapters);
  const subjectMeta = SUBJECT_META[subjectId];
  const subjectChapters = NEET_CHAPTERS.filter((c) => c.subjectId === subjectId);

  const subjectStrength = useMemo(() => {
    const chapterData = subjectChapters.map((ch) => {
      const data = chapters[ch.id];
      return {
        coverage: data?.coverage ?? 0,
        accuracy: data?.accuracy ?? 0,
        totalInBank: ch.questionCount,
      };
    });
    return evaluateSubjectStrength(chapterData);
  }, [chapters, subjectChapters]);

  const config = getStrengthConfig(subjectStrength.level);

  if (!subjectMeta) return null;

  return (
    <View style={styles.compactRow}>
      <Text style={styles.compactEmoji}>{subjectMeta.emoji}</Text>
      <View style={styles.compactBarWrap}>
        <View style={styles.compactTopRow}>
          <Text style={[styles.compactName, { color: colors.text }]}>{subjectMeta.name}</Text>
          <Text style={[styles.compactLabel, { color: config.color }]}>{config.label}</Text>
        </View>
        <View style={[styles.barBg, { backgroundColor: colors.surfaceBorder }]}>
          <View
            style={[
              styles.barFill,
              {
                backgroundColor: config.color,
                width: `${Math.min(subjectStrength.coverage, 100)}%`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

// ── Styles ──

const styles = StyleSheet.create({
  fullWrap: { gap: Spacing.lg },
  compactWrap: { gap: Spacing.md },

  // Subject section (full mode)
  subjectSection: { gap: Spacing.sm },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 2,
  },
  subjectEmoji: { fontSize: 18 },
  subjectName: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    flex: 1,
  },

  // Chapter row
  chapterRow: { gap: 4, paddingLeft: 28 },
  chapterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chapterName: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    flex: 1,
  },
  chapterMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  accuracyText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
  },

  // Strength badge
  strengthBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  strengthLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 10,
    letterSpacing: 0.3,
  },

  // Progress bar
  barBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },

  // Compact mode
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  compactEmoji: { fontSize: 20, width: 28, textAlign: 'center' },
  compactBarWrap: { flex: 1, gap: 3 },
  compactTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactName: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
  },
  compactLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 10,
  },
});
