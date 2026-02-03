import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { Option } from '../../types';
import { QuestionRendererProps } from './QuestionRenderer';

interface DiagramBasedPayloadShape {
  type: 'diagram-based';
  imageUri: string;
  imageAlt: string;
  options: Option[];
  correctOptionId: string;
}

interface Props extends QuestionRendererProps {
  payload: DiagramBasedPayloadShape;
}

export function DiagramBasedQuestion({ language, selectedOptionId, showFeedback, onSelect, colors, payload }: Props) {
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
      {/* Diagram placeholder */}
      <View style={[styles.diagramCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
        <View style={[styles.placeholderBox, { borderColor: colors.surfaceBorder }]}>
          <Text style={[styles.placeholderIcon, { color: colors.textTertiary }]}>{'\uD83D\uDDBC\uFE0F'}</Text>
          <Text style={[Typography.bodySm, { color: colors.textTertiary, textAlign: 'center' }]}>
            {payload.imageAlt || 'Diagram'}
          </Text>
          {payload.imageUri ? (
            <Text style={[Typography.bodySm, { color: colors.textTertiary, fontSize: 10, marginTop: 4 }]}>
              {payload.imageUri}
            </Text>
          ) : null}
        </View>
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
  diagramCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  placeholderBox: {
    height: 180,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  placeholderIcon: {
    fontSize: 36,
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
