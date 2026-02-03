import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { QuestionRendererProps } from './QuestionRenderer';

interface TrueFalsePayloadShape {
  type: 'true-false';
  statement: string;
  statementTe: string;
  correctAnswer: boolean;
}

interface Props extends QuestionRendererProps {
  payload: TrueFalsePayloadShape;
}

export function TrueFalseQuestion({ language, selectedOptionId, showFeedback, onSelect, colors, payload }: Props) {
  // Map true/false to option IDs for consistent answer tracking
  const TRUE_ID = 'tf-true';
  const FALSE_ID = 'tf-false';
  const correctId = payload.correctAnswer ? TRUE_ID : FALSE_ID;
  const isCorrect = selectedOptionId === correctId;

  const getButtonStyle = (btnId: string) => {
    const isSelected = selectedOptionId === btnId;
    const isCorrectBtn = btnId === correctId;

    if (!showFeedback) {
      return {
        bg: colors.surface,
        border: colors.surfaceBorder,
        text: colors.text,
        borderW: 1,
      };
    }

    if (isCorrectBtn) {
      return { bg: '#22C55E18', border: '#22C55E', text: '#16A34A', borderW: 2 };
    }
    if (isSelected && !isCorrect) {
      return { bg: '#EF444418', border: '#EF4444', text: '#DC2626', borderW: 2 };
    }
    return { bg: colors.surface, border: colors.surfaceBorder, text: colors.textTertiary, borderW: 1 };
  };

  const trueStyle = getButtonStyle(TRUE_ID);
  const falseStyle = getButtonStyle(FALSE_ID);

  return (
    <View style={styles.container}>
      {/* Statement card */}
      <View style={[styles.statementCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
        <Text style={[styles.statementLabel, { color: colors.textTertiary }]}>STATEMENT</Text>
        <Text style={[Typography.body, { color: colors.text, lineHeight: 24 }]}>
          {language === 'te' ? payload.statementTe : payload.statement}
        </Text>
      </View>

      {/* True / False buttons */}
      <View style={styles.buttonRow}>
        <Pressable
          onPress={() => onSelect(TRUE_ID)}
          disabled={showFeedback}
          style={[
            styles.tfButton,
            {
              backgroundColor: trueStyle.bg,
              borderColor: trueStyle.border,
              borderWidth: trueStyle.borderW,
            },
          ]}
        >
          <Text style={styles.tfEmoji}>{'\u2705'}</Text>
          <Text style={[styles.tfLabel, { color: trueStyle.text }]}>True</Text>
          {showFeedback && TRUE_ID === correctId && (
            <Text style={styles.resultIcon}>{'\u2713'}</Text>
          )}
          {showFeedback && selectedOptionId === TRUE_ID && !isCorrect && (
            <Text style={styles.wrongIcon}>{'\u2717'}</Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => onSelect(FALSE_ID)}
          disabled={showFeedback}
          style={[
            styles.tfButton,
            {
              backgroundColor: falseStyle.bg,
              borderColor: falseStyle.border,
              borderWidth: falseStyle.borderW,
            },
          ]}
        >
          <Text style={styles.tfEmoji}>{'\u274C'}</Text>
          <Text style={[styles.tfLabel, { color: falseStyle.text }]}>False</Text>
          {showFeedback && FALSE_ID === correctId && (
            <Text style={styles.resultIcon}>{'\u2713'}</Text>
          )}
          {showFeedback && selectedOptionId === FALSE_ID && !isCorrect && (
            <Text style={styles.wrongIcon}>{'\u2717'}</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  statementCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  statementLabel: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 10,
    letterSpacing: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  tfButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  tfEmoji: {
    fontSize: 28,
  },
  tfLabel: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 16,
  },
  resultIcon: {
    fontSize: 18,
    color: '#16A34A',
  },
  wrongIcon: {
    fontSize: 18,
    color: '#DC2626',
  },
});
