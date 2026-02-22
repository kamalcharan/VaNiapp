import React, { useState, useMemo } from 'react';
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

// Distinct colors for each pair (up to 5 items)
const PAIR_COLORS = ['#8B5CF6', '#3B82F6', '#F59E0B', '#14B8A6', '#EC4899'];

// Parse option text like "1-b, 2-c, 3-a" → { '1': 'b', '2': 'c', '3': 'a' }
function parseOptionMapping(text: string): Record<string, string> {
  const mapping: Record<string, string> = {};
  for (const part of text.split(',')) {
    const [num, letter] = part.trim().split('-');
    if (num && letter) mapping[num.trim()] = letter.trim();
  }
  return mapping;
}

export function MatchTheFollowingQuestion({
  language,
  selectedOptionId,
  showFeedback,
  onSelect,
  colors,
  payload,
}: Props) {
  const [selectedA, setSelectedA] = useState<string | null>(null);
  const [pairs, setPairs] = useState<Record<string, string>>({});

  const isConfirmed = selectedOptionId !== null;

  // When showing feedback (including revisiting an answered question),
  // derive pairs from the selected option so the display is correct.
  const displayPairs = useMemo(() => {
    if (isConfirmed && selectedOptionId) {
      const opt = payload.options.find((o) => o.id === selectedOptionId);
      if (opt) return parseOptionMapping(opt.text);
    }
    return pairs;
  }, [isConfirmed, selectedOptionId, pairs, payload.options]);

  const allPaired = Object.keys(pairs).length === payload.columnA.length;

  // Color for a pair — based on Column A item's position in the array
  const colorForA = (aId: string): string | null => {
    if (!displayPairs[aId]) return null;
    const idx = payload.columnA.findIndex((a) => a.id === aId);
    return PAIR_COLORS[idx % PAIR_COLORS.length];
  };

  const colorForB = (bId: string): string | null => {
    const aId = Object.entries(displayPairs).find(([, v]) => v === bId)?.[0];
    return aId ? colorForA(aId) : null;
  };

  // ── Interaction handlers ──

  const onTapA = (aId: string) => {
    if (isConfirmed) return;
    if (selectedA === aId) {
      setSelectedA(null);
      return;
    }
    // If already paired, unpair it first
    if (pairs[aId]) {
      const next = { ...pairs };
      delete next[aId];
      setPairs(next);
    }
    setSelectedA(aId);
  };

  const onTapB = (bId: string) => {
    if (isConfirmed) return;

    // If no A is selected, tap on a paired B unpairs it
    if (!selectedA) {
      const existingA = Object.entries(pairs).find(([, v]) => v === bId)?.[0];
      if (existingA) {
        const next = { ...pairs };
        delete next[existingA];
        setPairs(next);
      }
      return;
    }

    // Create pair: selectedA → bId
    const next = { ...pairs };
    // If this B was paired to another A, remove that pair
    const prevA = Object.entries(next).find(([, v]) => v === bId)?.[0];
    if (prevA) delete next[prevA];
    next[selectedA] = bId;
    setPairs(next);
    setSelectedA(null);
  };

  // Find which MCQ option matches the user's pairing
  const onConfirm = () => {
    for (const opt of payload.options) {
      const optMapping = parseOptionMapping(opt.text);
      const matches =
        Object.keys(optMapping).length === Object.keys(pairs).length &&
        Object.entries(pairs).every(([a, b]) => optMapping[a] === b);
      if (matches) {
        onSelect(opt.id);
        return;
      }
    }
    // User's combination not in options → pick a wrong option
    const wrong = payload.options.find((o) => o.id !== payload.correctOptionId);
    onSelect(wrong?.id || payload.options[0].id);
  };

  // ── Render helpers ──

  const renderItemCard = (
    item: ColumnItem,
    side: 'A' | 'B',
    idx: number,
  ) => {
    const isA = side === 'A';
    const pairColor = isA ? colorForA(item.id) : colorForB(item.id);
    const isPaired = !!pairColor;
    const isActive = isA && selectedA === item.id;
    const label = isA ? `${idx + 1}` : String.fromCharCode(97 + idx);

    // Feedback colors
    let borderColor = colors.surfaceBorder;
    let bgColor = colors.surface;
    let labelBg = colors.surfaceBorder + '80';
    let labelColor = colors.textTertiary;

    if (showFeedback && isPaired && isA) {
      const correct = displayPairs[item.id] === payload.correctMapping[item.id];
      borderColor = correct ? '#22C55E' : '#EF4444';
      bgColor = correct ? '#22C55E12' : '#EF444412';
      labelBg = correct ? '#22C55E30' : '#EF444430';
      labelColor = correct ? '#16A34A' : '#DC2626';
    } else if (showFeedback && isPaired && !isA) {
      const pairedA = Object.entries(displayPairs).find(([, v]) => v === item.id)?.[0];
      if (pairedA) {
        const correct = displayPairs[pairedA] === payload.correctMapping[pairedA];
        borderColor = correct ? '#22C55E' : '#EF4444';
        bgColor = correct ? '#22C55E12' : '#EF444412';
        labelBg = correct ? '#22C55E30' : '#EF444430';
        labelColor = correct ? '#16A34A' : '#DC2626';
      }
    } else if (isActive) {
      borderColor = colors.primary;
      bgColor = colors.primary + '08';
      labelBg = colors.primary + '25';
      labelColor = colors.primary;
    } else if (isPaired) {
      borderColor = pairColor!;
      bgColor = pairColor + '10';
      labelBg = pairColor + '25';
      labelColor = pairColor!;
    }

    return (
      <Pressable
        key={item.id}
        onPress={() => (isA ? onTapA(item.id) : onTapB(item.id))}
        disabled={isConfirmed}
        style={[
          styles.itemCard,
          {
            backgroundColor: bgColor,
            borderColor,
            borderWidth: isActive || (isPaired && !showFeedback) ? 2 : 1,
          },
        ]}
      >
        <View style={styles.itemRow}>
          {/* Label badge */}
          <View style={[styles.labelBadge, { backgroundColor: labelBg }]}>
            <Text style={[styles.labelText, { color: labelColor }]}>{label}</Text>
          </View>

          {/* Text */}
          <Text
            style={[Typography.bodySm, { color: colors.text, flex: 1 }]}
            numberOfLines={4}
          >
            {language === 'te' ? item.textTe : item.text}
          </Text>

          {/* Pair indicator (small colored dot with matching number) */}
          {isPaired && !showFeedback && (
            <View style={[styles.pairDot, { backgroundColor: pairColor! }]}>
              <Text style={styles.pairDotText}>
                {isA
                  ? String.fromCharCode(
                      97 + payload.columnB.findIndex((b) => b.id === displayPairs[item.id]),
                    )
                  : Object.entries(displayPairs).find(([, v]) => v === item.id)?.[0] || ''}
              </Text>
            </View>
          )}

          {/* Feedback icons */}
          {showFeedback && isA && isPaired && (
            <Text style={{ fontSize: 16 }}>
              {displayPairs[item.id] === payload.correctMapping[item.id] ? '\u2713' : '\u2717'}
            </Text>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Instruction text */}
      {!isConfirmed && (
        <Text
          style={[
            Typography.bodySm,
            { color: colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xs },
          ]}
        >
          {selectedA
            ? 'Now tap an item from Column B to pair'
            : allPaired
            ? 'Review your pairs, then confirm'
            : 'Tap an item from Column A, then match it in Column B'}
        </Text>
      )}

      {/* Two-column layout */}
      <View style={styles.columnsContainer}>
        {/* Column A */}
        <View style={styles.column}>
          <Text style={[styles.colHeader, { color: '#6366F1' }]}>COLUMN A</Text>
          {payload.columnA.map((item, idx) => renderItemCard(item, 'A', idx))}
        </View>

        {/* Column B */}
        <View style={styles.column}>
          <Text style={[styles.colHeader, { color: '#F59E0B' }]}>COLUMN B</Text>
          {payload.columnB.map((item, idx) => renderItemCard(item, 'B', idx))}
        </View>
      </View>

      {/* Confirm button */}
      {allPaired && !isConfirmed && (
        <Pressable
          onPress={onConfirm}
          style={[styles.confirmBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={[Typography.button, { color: '#FFFFFF' }]}>Confirm Match</Text>
        </Pressable>
      )}

      {/* Show correct mapping when wrong */}
      {showFeedback && selectedOptionId !== payload.correctOptionId && (
        <View style={[styles.correctionCard, { borderColor: '#22C55E' }]}>
          <Text
            style={[
              Typography.bodySm,
              { color: '#16A34A', fontFamily: 'PlusJakartaSans_700Bold', marginBottom: Spacing.xs },
            ]}
          >
            Correct matching:
          </Text>
          {payload.columnA.map((a, idx) => {
            const correctBId = payload.correctMapping[a.id];
            const bItem = payload.columnB.find((b) => b.id === correctBId);
            const bText = bItem ? (language === 'te' ? bItem.textTe : bItem.text) : correctBId;
            return (
              <Text key={a.id} style={[Typography.bodySm, { color: '#16A34A' }]}>
                {idx + 1}. {language === 'te' ? a.textTe : a.text} → {bText}
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
    gap: Spacing.md,
  },
  columnsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  column: {
    flex: 1,
    gap: Spacing.sm,
  },
  colHeader: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 10,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  itemCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  labelBadge: {
    width: 26,
    height: 26,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 13,
  },
  pairDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pairDotText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11,
    color: '#FFFFFF',
  },
  confirmBtn: {
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  correctionCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    backgroundColor: '#22C55E08',
  },
});
