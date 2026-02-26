import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { Option } from '../../types';
import { QuestionRendererProps } from './QuestionRenderer';

interface ColumnItem {
  id: string;
  text: string;
  textTe: string;
}

interface MatchTheFollowingPayloadShape {
  type: 'match-the-following';
  columnA: ColumnItem[];
  columnB: ColumnItem[];
  correctMapping: Record<string, string>;
  options: Option[];
  correctOptionId: string;
}

interface Props extends QuestionRendererProps {
  payload: MatchTheFollowingPayloadShape;
}

export function MatchTheFollowingQuestion({
  language,
  selectedOptionId,
  showFeedback,
  onSelect,
  colors,
  payload,
}: Props) {
  const isCorrect = selectedOptionId === payload.correctOptionId;

  const getOptionStyle = (optId: string) => {
    if (!showFeedback) {
      return { bg: colors.surface, border: colors.surfaceBorder, text: colors.text };
    }
    if (optId === payload.correctOptionId) {
      return { bg: '#22C55E18', border: '#22C55E', text: '#16A34A' };
    }
    if (optId === selectedOptionId && !isCorrect) {
      return { bg: '#EF444418', border: '#EF4444', text: '#DC2626' };
    }
    return { bg: colors.surface, border: colors.surfaceBorder, text: colors.textTertiary };
  };

  const maxRows = Math.max(payload.columnA.length, payload.columnB.length);

  return (
    <View style={styles.container}>
      {/* Reference table card */}
      <View style={[styles.tableCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
        {/* Header row */}
        <View style={[styles.tableHeaderRow, { borderBottomColor: colors.surfaceBorder }]}>
          <View style={styles.tableHalf}>
            <Text style={[styles.colHeader, { color: '#6366F1' }]}>COLUMN I</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />
          <View style={styles.tableHalf}>
            <Text style={[styles.colHeader, { color: '#F59E0B' }]}>COLUMN II</Text>
          </View>
        </View>

        {/* Data rows */}
        {Array.from({ length: maxRows }).map((_, idx) => {
          const aItem = payload.columnA[idx];
          const bItem = payload.columnB[idx];
          const aLabel = `${idx + 1}`;
          const bLabel = String.fromCharCode(97 + idx);
          const isLast = idx === maxRows - 1;

          return (
            <View
              key={idx}
              style={[
                styles.tableDataRow,
                !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.surfaceBorder },
              ]}
            >
              {/* Column A cell */}
              <View style={styles.tableHalf}>
                {aItem && (
                  <View style={styles.cellContent}>
                    <View style={[styles.cellBadge, { backgroundColor: '#6366F115' }]}>
                      <Text style={[styles.cellBadgeText, { color: '#6366F1' }]}>{aLabel}</Text>
                    </View>
                    <Text style={[Typography.bodySm, { color: colors.text, flex: 1 }]} numberOfLines={4}>
                      {language === 'te' ? aItem.textTe : aItem.text}
                    </Text>
                  </View>
                )}
              </View>

              <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />

              {/* Column B cell */}
              <View style={styles.tableHalf}>
                {bItem && (
                  <View style={styles.cellContent}>
                    <View style={[styles.cellBadge, { backgroundColor: '#F59E0B15' }]}>
                      <Text style={[styles.cellBadgeText, { color: '#D97706' }]}>{bLabel}</Text>
                    </View>
                    <Text style={[Typography.bodySm, { color: colors.text, flex: 1 }]} numberOfLines={4}>
                      {language === 'te' ? bItem.textTe : bItem.text}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* MCQ options — standard exam format */}
      <View style={styles.optionsList}>
        <Text style={[styles.optionsLabel, { color: colors.textTertiary }]}>SELECT THE CORRECT MATCHING</Text>
        {payload.options.map((opt, idx) => {
          const os = getOptionStyle(opt.id);
          const label = String.fromCharCode(65 + idx);
          return (
            <Pressable
              key={opt.id}
              onPress={() => onSelect(opt.id)}
              disabled={showFeedback}
              style={[
                styles.optionRow,
                {
                  backgroundColor: os.bg,
                  borderColor: os.border,
                  borderWidth:
                    showFeedback && (opt.id === payload.correctOptionId || opt.id === selectedOptionId)
                      ? 2
                      : 1,
                },
              ]}
            >
              <View style={[styles.optBadge, { backgroundColor: os.border + '30' }]}>
                <Text style={[styles.optBadgeText, { color: os.text }]}>{label}</Text>
              </View>
              <Text style={[Typography.body, { color: os.text, flex: 1, letterSpacing: 0.5 }]}>
                {language === 'te' ? opt.textTe : opt.text}
              </Text>
              {showFeedback && opt.id === payload.correctOptionId && (
                <Text style={{ fontSize: 18, color: '#16A34A' }}>{'\u2713'}</Text>
              )}
              {showFeedback && opt.id === selectedOptionId && !isCorrect && (
                <Text style={{ fontSize: 18, color: '#DC2626' }}>{'\u2717'}</Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Correct answer detail — only shown when wrong */}
      {showFeedback && selectedOptionId !== payload.correctOptionId && (
        <View style={[styles.correctionCard, { borderColor: '#22C55E' }]}>
          <Text style={[styles.correctionTitle, { color: '#16A34A' }]}>Correct matching:</Text>
          {payload.columnA.map((a, idx) => {
            const correctBId = payload.correctMapping[a.id];
            const bItem = payload.columnB.find((b) => b.id === correctBId);
            const aText = language === 'te' ? a.textTe : a.text;
            const bText = bItem ? (language === 'te' ? bItem.textTe : bItem.text) : correctBId;
            return (
              <Text key={a.id} style={[Typography.bodySm, { color: '#16A34A', marginTop: idx > 0 ? 2 : 0 }]}>
                {idx + 1}. {aText}  →  {bText}
              </Text>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  // ── Reference table ──
  tableCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: Spacing.sm,
  },
  tableHalf: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  divider: {
    width: 1,
  },
  colHeader: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 10,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  tableDataRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    minHeight: 48,
  },
  cellContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  cellBadge: {
    width: 22,
    height: 22,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  cellBadgeText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 12,
  },
  // ── MCQ options ──
  optionsList: {
    gap: Spacing.md,
  },
  optionsLabel: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 2,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  optBadge: {
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optBadgeText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 14,
  },
  // ── Correction card ──
  correctionCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    backgroundColor: '#22C55E08',
  },
  correctionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
});
