import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing } from '../constants/theme';
import { useTheme } from '../hooks/useTheme';
import { t } from '../types';

export interface TopicStat {
  name: string;
  nameTe: string;
  nameHi?: string;
  correct: number;
  total: number;
}

interface Props {
  /** Array of [topicKey, stat] entries */
  topics: Array<[string, TopicStat]>;
  language: string;
  /** Optional label override (defaults to "TOPIC PERFORMANCE") */
  label?: string;
}

/**
 * Renders a sorted list of topic accuracy bars.
 * Reusable across chapter-results and subject chapter cards.
 */
export function TopicBreakdown({ topics, language, label }: Props) {
  const { colors } = useTheme();

  if (!topics.length) return null;

  const sorted = [...topics].sort(([, a], [, b]) => {
    const aPct = a.total > 0 ? a.correct / a.total : 0;
    const bPct = b.total > 0 ? b.correct / b.total : 0;
    return aPct - bPct;
  });

  return (
    <View>
      {label !== undefined && (
        <Text style={[styles.label, { color: colors.textTertiary }]}>{label}</Text>
      )}
      {sorted.map(([key, stat]) => {
        const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
        const barColor = pct >= 70 ? '#22C55E' : pct >= 40 ? '#F59E0B' : '#EF4444';
        const displayName = t(language, stat.name, stat.nameTe, stat.nameHi);
        return (
          <View key={key} style={styles.row}>
            <View style={styles.header}>
              <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                {displayName}
              </Text>
              <Text style={[styles.accuracy, { color: barColor }]}>{pct}%</Text>
            </View>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: barColor }]} />
            </View>
            <Text style={[styles.detail, { color: colors.textTertiary }]}>
              {stat.correct}/{stat.total} correct
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 10,
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },
  row: {
    marginBottom: Spacing.sm,
    gap: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  name: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 12,
    flex: 1,
  },
  accuracy: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 12,
  },
  barBg: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    borderRadius: 4,
  },
  detail: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 10,
  },
});
