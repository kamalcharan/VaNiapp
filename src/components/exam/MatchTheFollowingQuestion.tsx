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

export function MatchTheFollowingQuestion({ language, selectedOptionId, showFeedback, onSelect, colors, payload }: Props) {
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

  return (
    <View style={styles.container}>
      {/* Match columns table */}
      <View style={[styles.tableCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
        {/* Header row */}
        <View style={[styles.tableRow, styles.headerRow, { borderBottomColor: colors.surfaceBorder }]}>
          <Text style={[styles.colHeader, { color: '#6366F1' }]}>COLUMN A</Text>
          <Text style={[styles.colHeader, { color: '#F59E0B' }]}>COLUMN B</Text>
        </View>

        {/* Data rows */}
        {payload.columnA.map((itemA, idx) => {
          const itemB = payload.columnB[idx];
          const isLast = idx === payload.columnA.length - 1;
          return (
            <View
              key={itemA.id}
              style={[
                styles.tableRow,
                !isLast && { borderBottomWidth: 1, borderBottomColor: colors.surfaceBorder },
              ]}
            >
              <View style={styles.cellContent}>
                <Text style={[styles.cellLabel, { color: colors.textTertiary }]}>{idx + 1}.</Text>
                <Text style={[Typography.body, { color: colors.text, flex: 1 }]}>
                  {language === 'te' ? itemA.textTe : itemA.text}
                </Text>
              </View>
              {itemB && (
                <View style={styles.cellContent}>
                  <Text style={[styles.cellLabel, { color: colors.textTertiary }]}>
                    {String.fromCharCode(97 + idx)}.
                  </Text>
                  <Text style={[Typography.body, { color: colors.text, flex: 1 }]}>
                    {language === 'te' ? itemB.textTe : itemB.text}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* MCQ options (matching combinations) */}
      <View style={styles.optionsList}>
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
              <View style={[styles.optLabel, { backgroundColor: os.border + '30' }]}>
                <Text style={[styles.optLabelText, { color: os.text }]}>{label}</Text>
              </View>
              <Text style={[Typography.body, { color: os.text, flex: 1 }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  tableCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  headerRow: {
    borderBottomWidth: 2,
  },
  tableRow: {
    flexDirection: 'row',
  },
  colHeader: {
    flex: 1,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 10,
    letterSpacing: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  cellContent: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  cellLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 13,
  },
  optionsList: {
    gap: Spacing.md,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  optLabel: {
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optLabelText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 14,
  },
});
