import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { Option } from '../../types';
import { QuestionRendererProps } from './QuestionRenderer';

interface FillInBlanksPayloadShape {
  type: 'fill-in-blanks';
  textWithBlanks: string;
  textWithBlanksTe: string;
  options: Option[];
  correctOptionId: string;
}

interface Props extends QuestionRendererProps {
  payload: FillInBlanksPayloadShape;
}

/**
 * Renders text with _____ blanks highlighted as inline badges.
 * Expects blanks marked as _____ (3+ underscores) in the text.
 */
function renderTextWithBlanks(raw: string, textColor: string, blankColor: string) {
  const parts = raw.split(/(_{3,})/);
  let blankIndex = 0;
  return parts.map((part, i) => {
    if (/^_{3,}$/.test(part)) {
      blankIndex++;
      return (
        <Text key={i} style={[styles.blankBadge, { backgroundColor: blankColor + '20', color: blankColor }]}>
          {' '}{'____'}{blankIndex > 1 ? ` (${blankIndex})` : ''}{' '}
        </Text>
      );
    }
    return (
      <Text key={i} style={{ color: textColor }}>
        {part}
      </Text>
    );
  });
}

export function FillInBlanksQuestion({ language, selectedOptionId, showFeedback, onSelect, colors, payload }: Props) {
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

  const rawText = language === 'te' ? payload.textWithBlanksTe : payload.textWithBlanks;

  return (
    <View style={styles.container}>
      {/* Text with blanks */}
      <View style={[styles.textCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
        <Text style={[styles.cardLabel, { color: colors.textTertiary }]}>FILL IN THE BLANK(S)</Text>
        <Text style={[Typography.body, { lineHeight: 26 }]}>
          {renderTextWithBlanks(rawText, colors.text, '#6366F1')}
        </Text>
      </View>

      {/* MCQ options */}
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
  textCard: {
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
  blankBadge: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    borderRadius: 4,
    overflow: 'hidden',
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
