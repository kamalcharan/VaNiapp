import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ActivityIndicator } from 'react-native';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { Option, t } from '../../types';
import { QuestionRendererProps } from './QuestionRenderer';
import { autoReportIssue } from '../../lib/qualityAutoDetect';

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

export function DiagramBasedQuestion({ question, language, selectedOptionId, showFeedback, onSelect, colors, payload }: Props) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const isCorrect = selectedOptionId === payload.correctOptionId;
  const hasImage = !!payload.imageUri && payload.imageUri.startsWith('http');

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
      {/* Diagram */}
      <View style={[styles.diagramCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
        <Text style={[styles.cardLabel, { color: '#8B5CF6' }]}>DIAGRAM</Text>
        {hasImage && !imageError ? (
          <View style={styles.imageContainer}>
            {imageLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            )}
            <Image
              source={{ uri: payload.imageUri }}
              style={styles.diagramImage}
              resizeMode="contain"
              onLoadEnd={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
                autoReportIssue(question.id, 'IMAGE_LOAD_FAILED', { imageUri: payload.imageUri }, question.chapterId);
              }}
              accessibilityLabel={payload.imageAlt || 'Diagram'}
            />
          </View>
        ) : (
          <View style={[styles.placeholderBox, { borderColor: colors.surfaceBorder }]}>
            <Text style={[styles.placeholderIcon, { color: colors.textTertiary }]}>
              {imageError ? '\u26A0\uFE0F' : '\uD83D\uDDBC\uFE0F'}
            </Text>
            <Text style={[Typography.bodySm, { color: colors.textTertiary, textAlign: 'center' }]}>
              {imageError ? 'Could not load diagram' : (payload.imageAlt || 'Diagram')}
            </Text>
          </View>
        )}
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
                {t(language, opt.text)}
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
    gap: Spacing.sm,
  },
  cardLabel: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 10,
    letterSpacing: 1,
  },
  imageContainer: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    minHeight: 180,
  },
  diagramImage: {
    width: '100%',
    height: 220,
    borderRadius: BorderRadius.md,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
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
