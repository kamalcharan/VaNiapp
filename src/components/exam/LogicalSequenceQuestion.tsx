import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { Option } from '../../types';
import { QuestionRendererProps } from './QuestionRenderer';

interface SequenceItem {
  id: string;
  text: string;
  textTe: string;
}

interface LogicalSequencePayloadShape {
  type: 'logical-sequence';
  items: SequenceItem[];
  correctOrder: string[];
  options: Option[];
  correctOptionId: string;
}

interface Props extends QuestionRendererProps {
  payload: LogicalSequencePayloadShape;
}

export function LogicalSequenceQuestion({ language, selectedOptionId, showFeedback, onSelect, colors, payload }: Props) {
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
      {/* Scrambled items list */}
      <View style={[styles.itemsCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
        <Text style={[styles.cardLabel, { color: '#0EA5E9' }]}>ARRANGE IN CORRECT ORDER</Text>
        <View style={styles.itemsList}>
          {payload.items.map((item, idx) => (
            <View
              key={item.id}
              style={[styles.itemRow, { backgroundColor: colors.surfaceBorder + '40' }]}
            >
              <View style={[styles.itemBadge, { backgroundColor: '#0EA5E9' + '20' }]}>
                <Text style={[styles.itemBadgeText, { color: '#0EA5E9' }]}>
                  {String.fromCharCode(80 + idx)}
                </Text>
              </View>
              <Text style={[Typography.body, { color: colors.text, flex: 1 }]}>
                {language === 'te' ? item.textTe : item.text}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* MCQ options (sequence combinations) */}
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
  itemsCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  cardLabel: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 10,
    letterSpacing: 1,
  },
  itemsList: {
    gap: Spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  itemBadge: {
    width: 28,
    height: 28,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemBadgeText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
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
