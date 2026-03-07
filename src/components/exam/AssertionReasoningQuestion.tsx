import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { Option, t } from '../../types';
import { QuestionRendererProps } from './QuestionRenderer';

interface AssertionReasoningPayloadShape {
  type: 'assertion-reasoning';
  assertion: string;
  assertionTe: string;
  assertionHi: string;
  reason: string;
  reasonTe: string;
  reasonHi: string;
  options: Option[];
  correctOptionId: string;
}

interface Props extends QuestionRendererProps {
  payload: AssertionReasoningPayloadShape;
}

interface ARPattern {
  aTrue: boolean;
  rTrue: boolean;
  rExplainsA: boolean | null; // null when both aren't true
}

/** Detect the standard NEET assertion-reasoning option pattern from English text */
function parseARPattern(text: string): ARPattern | null {
  const lower = text.toLowerCase();
  // Both true + R explains A
  if (lower.includes('both') && lower.includes('correct explanation') && !lower.includes('not')) {
    return { aTrue: true, rTrue: true, rExplainsA: true };
  }
  // Both true + R does NOT explain A
  if (lower.includes('both') && lower.includes('not')) {
    return { aTrue: true, rTrue: true, rExplainsA: false };
  }
  // A true, R false
  if (/a\s+is\s+true/i.test(lower) && /r\s+is\s+false/i.test(lower)) {
    return { aTrue: true, rTrue: false, rExplainsA: null };
  }
  // A false, R true
  if (/a\s+is\s+false/i.test(lower) && /r\s+is\s+true/i.test(lower)) {
    return { aTrue: false, rTrue: true, rExplainsA: null };
  }
  return null;
}

function TruthPill({ label, value, colors }: { label: string; value: boolean; colors: Record<string, string> }) {
  const bg = value ? '#22C55E18' : '#EF444418';
  const color = value ? '#16A34A' : '#DC2626';
  const labelBg = label === 'A' ? '#6366F118' : '#F59E0B18';
  const labelColor = label === 'A' ? '#6366F1' : '#D97706';

  return (
    <View style={truthStyles.container}>
      <View style={[truthStyles.labelBadge, { backgroundColor: labelBg }]}>
        <Text style={[truthStyles.labelText, { color: labelColor }]}>{label}</Text>
      </View>
      <View style={[truthStyles.valueBadge, { backgroundColor: bg }]}>
        <Text style={[truthStyles.valueText, { color }]}>
          {value ? 'True' : 'False'}
        </Text>
      </View>
    </View>
  );
}

const truthStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  labelBadge: {
    width: 22,
    height: 22,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 11,
  },
  valueBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  valueText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
  },
});

export function AssertionReasoningQuestion({ language, selectedOptionId, showFeedback, onSelect, colors, payload }: Props) {
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
      {/* Combined Assertion + Reason card */}
      <View style={[styles.arCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
        {/* Assertion section */}
        <View style={styles.arSection}>
          <View style={styles.arHeaderRow}>
            <View style={[styles.arBadge, { backgroundColor: '#6366F118' }]}>
              <Text style={[styles.arBadgeText, { color: '#6366F1' }]}>A</Text>
            </View>
            <Text style={[styles.arLabel, { color: '#6366F1' }]}>ASSERTION</Text>
          </View>
          <Text style={[Typography.body, { color: colors.text, lineHeight: 24 }]}>
            {t(language, payload.assertion, payload.assertionTe, payload.assertionHi)}
          </Text>
        </View>

        {/* Divider */}
        <View style={[styles.arDivider, { backgroundColor: colors.surfaceBorder }]} />

        {/* Reason section */}
        <View style={styles.arSection}>
          <View style={styles.arHeaderRow}>
            <View style={[styles.arBadge, { backgroundColor: '#F59E0B18' }]}>
              <Text style={[styles.arBadgeText, { color: '#D97706' }]}>R</Text>
            </View>
            <Text style={[styles.arLabel, { color: '#D97706' }]}>REASON</Text>
          </View>
          <Text style={[Typography.body, { color: colors.text, lineHeight: 24 }]}>
            {t(language, payload.reason, payload.reasonTe, payload.reasonHi)}
          </Text>
        </View>
      </View>

      {/* Options */}
      <View style={styles.optionsList}>
        <Text style={[styles.selectLabel, { color: colors.textTertiary }]}>SELECT THE CORRECT RELATIONSHIP</Text>
        {payload.options.map((opt, idx) => {
          const os = getOptionStyle(opt.id);
          const label = String.fromCharCode(65 + idx);
          const pattern = parseARPattern(opt.text);

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
              {/* Label badge */}
              <View style={[styles.optBadge, { backgroundColor: os.border + '30' }]}>
                <Text style={[styles.optBadgeText, { color: os.text }]}>{label}</Text>
              </View>

              {/* Structured layout or fallback to plain text */}
              {pattern ? (
                <View style={styles.structuredContent}>
                  {/* Row 1: A and R truth values */}
                  <View style={styles.truthRow}>
                    <TruthPill label="A" value={pattern.aTrue} colors={colors} />
                    <TruthPill label="R" value={pattern.rTrue} colors={colors} />
                  </View>
                  {/* Row 2: Relationship (only when both true) */}
                  {pattern.rExplainsA !== null && (
                    <View style={styles.relationRow}>
                      <Text
                        style={[
                          styles.relationText,
                          {
                            color: pattern.rExplainsA ? '#16A34A' : '#DC2626',
                          },
                        ]}
                      >
                        {pattern.rExplainsA
                          ? 'R correctly explains A'
                          : 'R does NOT explain A'}
                      </Text>
                    </View>
                  )}
                </View>
              ) : (
                <Text style={[Typography.body, { color: os.text, flex: 1 }]}>
                  {t(language, opt.text, opt.textTe, opt.textHi)}
                </Text>
              )}

              {/* Feedback icons */}
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
  // ── Combined A+R card ──
  arCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  arSection: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  arHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  arBadge: {
    width: 28,
    height: 28,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arBadgeText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 14,
  },
  arLabel: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 11,
    letterSpacing: 1,
  },
  arDivider: {
    height: 1,
    marginHorizontal: Spacing.lg,
  },
  // ── Options ──
  optionsList: {
    gap: Spacing.md,
  },
  selectLabel: {
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
  // ── Structured option content ──
  structuredContent: {
    flex: 1,
    gap: 6,
  },
  truthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  relationRow: {
    marginTop: 2,
  },
  relationText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 13,
  },
});
