import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
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

// Parse option text like "1-b, 2-c, 3-a" → { '1': 'b', '2': 'c', '3': 'a' }
function parseOptionMapping(text: string): Record<string, string> {
  const mapping: Record<string, string> = {};
  for (const part of text.split(',')) {
    const [num, letter] = part.trim().split('-');
    if (num && letter) mapping[num.trim()] = letter.trim();
  }
  return mapping;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const PAIR_COLORS = ['#8B5CF6', '#3B82F6', '#F59E0B', '#14B8A6', '#EC4899'];

export function MatchTheFollowingQuestion({
  language,
  selectedOptionId,
  showFeedback,
  onSelect,
  colors,
  payload,
}: Props) {
  // ── State ──
  const [pairs, setPairs] = useState<Record<string, string>>({}); // aId → bId
  const [selectedPoolItem, setSelectedPoolItem] = useState<string | null>(null);
  const [draggingItem, setDraggingItem] = useState<string | null>(null);

  const isConfirmed = selectedOptionId !== null;

  // Shuffled Column B items (stable across re-renders)
  const shuffledB = useMemo(() => shuffleArray(payload.columnB), [payload.columnB]);

  // Derived: unpaired B items
  const pairedBIds = new Set(Object.values(pairs));
  const unpairedB = shuffledB.filter((b) => !pairedBIds.has(b.id));

  const allPaired = Object.keys(pairs).length === payload.columnA.length;

  // When showing feedback, derive pairs from selected option
  const displayPairs = useMemo(() => {
    if (isConfirmed && selectedOptionId) {
      const opt = payload.options.find((o) => o.id === selectedOptionId);
      if (opt) return parseOptionMapping(opt.text);
    }
    return pairs;
  }, [isConfirmed, selectedOptionId, pairs, payload.options]);

  // ── Animated values for dragging ──
  const panValues = useRef<Record<string, Animated.ValueXY>>({});
  const getPan = (bId: string): Animated.ValueXY => {
    if (!panValues.current[bId]) {
      panValues.current[bId] = new Animated.ValueXY();
    }
    return panValues.current[bId];
  };

  // ── Drop zone measurement ──
  const slotRefs = useRef<Record<string, View | null>>({});
  const slotPositions = useRef<
    Record<string, { x: number; y: number; w: number; h: number }>
  >({});

  const remeasureSlots = useCallback(() => {
    for (const [aId, ref] of Object.entries(slotRefs.current)) {
      if (ref) {
        ref.measureInWindow((x, y, w, h) => {
          slotPositions.current[aId] = { x, y, w, h };
        });
      }
    }
  }, []);

  const findHitSlot = (absX: number, absY: number): string | null => {
    for (const [aId, rect] of Object.entries(slotPositions.current)) {
      // Generous hit area (expand 15px each side)
      if (
        absX >= rect.x - 15 &&
        absX <= rect.x + rect.w + 15 &&
        absY >= rect.y - 15 &&
        absY <= rect.y + rect.h + 15
      ) {
        return aId;
      }
    }
    return null;
  };

  // ── Gesture handling ──
  const handleGestureEvent = (bId: string) =>
    Animated.event(
      [{ nativeEvent: { translationX: getPan(bId).x, translationY: getPan(bId).y } }],
      { useNativeDriver: true },
    );

  const handleStateChange = (bId: string) => (event: any) => {
    const { state, absoluteX, absoluteY } = event.nativeEvent;

    if (state === State.BEGAN) {
      setDraggingItem(bId);
      setSelectedPoolItem(null);
      remeasureSlots();
    }

    if (state === State.END || state === State.CANCELLED || state === State.FAILED) {
      setDraggingItem(null);

      if (state === State.END) {
        const hitSlot = findHitSlot(absoluteX, absoluteY);
        if (hitSlot) {
          setPairs((prev) => {
            const next = { ...prev };
            // Remove B from any existing pair
            for (const [k, v] of Object.entries(next)) {
              if (v === bId) delete next[k];
            }
            next[hitSlot] = bId;
            return next;
          });
        }
      }

      // Spring back to origin (chip either disappears into slot or returns to pool)
      Animated.spring(getPan(bId), {
        toValue: { x: 0, y: 0 },
        useNativeDriver: true,
        tension: 40,
        friction: 6,
      }).start();
    }
  };

  // ── Tap-to-pair ──
  const onTapPoolItem = (bId: string) => {
    if (isConfirmed) return;
    setSelectedPoolItem(selectedPoolItem === bId ? null : bId);
  };

  const onTapSlot = (aId: string) => {
    if (isConfirmed) return;

    if (selectedPoolItem) {
      // Place selected pool item in this slot
      setPairs((prev) => {
        const next = { ...prev };
        for (const [k, v] of Object.entries(next)) {
          if (v === selectedPoolItem) delete next[k];
        }
        next[aId] = selectedPoolItem;
        return next;
      });
      setSelectedPoolItem(null);
    } else if (pairs[aId]) {
      // Tap filled slot → unpair
      setPairs((prev) => {
        const next = { ...prev };
        delete next[aId];
        return next;
      });
    }
  };

  // ── Confirm: find matching MCQ option ──
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
    // User's combination not in predefined options → pick a wrong option
    const wrong = payload.options.find((o) => o.id !== payload.correctOptionId);
    onSelect(wrong?.id || payload.options[0].id);
  };

  // ── Helpers ──
  const colorForA = (aId: string): string => {
    const idx = payload.columnA.findIndex((a) => a.id === aId);
    return PAIR_COLORS[idx % PAIR_COLORS.length];
  };

  const bLabel = (bId: string): string => {
    const idx = payload.columnB.findIndex((b) => b.id === bId);
    return String.fromCharCode(97 + idx);
  };

  // ── Render drop slot ──
  const renderSlot = (aId: string) => {
    const bId = displayPairs[aId];
    const bItem = bId ? payload.columnB.find((b) => b.id === bId) : null;
    const pColor = colorForA(aId);

    let slotBg = 'transparent';
    let slotBorder = colors.surfaceBorder;
    let slotStyle: 'solid' | 'dashed' = 'dashed';

    if (bItem) {
      slotStyle = 'solid';
      if (showFeedback) {
        const correct = displayPairs[aId] === payload.correctMapping[aId];
        slotBg = correct ? '#22C55E15' : '#EF444415';
        slotBorder = correct ? '#22C55E' : '#EF4444';
      } else {
        slotBg = pColor + '12';
        slotBorder = pColor;
      }
    } else if (selectedPoolItem) {
      slotBorder = colors.primary;
      slotBg = colors.primary + '06';
    }

    return (
      <Pressable onPress={() => onTapSlot(aId)} disabled={isConfirmed}>
        <View
          ref={(ref) => {
            slotRefs.current[aId] = ref;
          }}
          onLayout={() => {
            slotRefs.current[aId]?.measureInWindow((x, y, w, h) => {
              slotPositions.current[aId] = { x, y, w, h };
            });
          }}
          style={[
            styles.dropSlot,
            {
              backgroundColor: slotBg,
              borderColor: slotBorder,
              borderStyle: slotStyle,
            },
          ]}
        >
          {bItem ? (
            <View style={styles.slotContent}>
              <View
                style={[
                  styles.chipBadge,
                  {
                    backgroundColor: showFeedback
                      ? slotBorder + '25'
                      : pColor + '25',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipBadgeText,
                    { color: showFeedback ? slotBorder : pColor },
                  ]}
                >
                  {bLabel(bId)}
                </Text>
              </View>
              <Text
                style={[Typography.bodySm, { color: colors.text, flex: 1 }]}
                numberOfLines={2}
              >
                {language === 'te' ? bItem.textTe : bItem.text}
              </Text>
              {showFeedback && (
                <Text style={{ fontSize: 14 }}>
                  {displayPairs[aId] === payload.correctMapping[aId]
                    ? '\u2713'
                    : '\u2717'}
                </Text>
              )}
              {!isConfirmed && (
                <Text style={[styles.removeHint, { color: colors.textTertiary }]}>
                  {'\u2715'}
                </Text>
              )}
            </View>
          ) : (
            <Text style={[styles.slotPlaceholder, { color: colors.textTertiary }]}>
              {selectedPoolItem ? 'Tap to place' : 'Drop here'}
            </Text>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Instruction */}
      {!isConfirmed && (
        <Text
          style={[Typography.bodySm, { color: colors.textSecondary, textAlign: 'center' }]}
        >
          {selectedPoolItem
            ? 'Now tap a slot to place it'
            : allPaired
            ? 'Review your matches, then confirm'
            : 'Drag items to match, or tap to pair'}
        </Text>
      )}

      {/* Match rows: Column A + drop slots */}
      <View
        style={[
          styles.matchCard,
          { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
        ]}
      >
        {payload.columnA.map((aItem, idx) => {
          const isLast = idx === payload.columnA.length - 1;
          return (
            <View key={aItem.id}>
              <View style={styles.matchRow}>
                {/* Column A label + text */}
                <View style={styles.aSection}>
                  <View style={[styles.aBadge, { backgroundColor: '#6366F115' }]}>
                    <Text style={[styles.aBadgeText, { color: '#6366F1' }]}>
                      {idx + 1}
                    </Text>
                  </View>
                  <Text
                    style={[Typography.bodySm, { color: colors.text, flex: 1 }]}
                    numberOfLines={3}
                  >
                    {language === 'te' ? aItem.textTe : aItem.text}
                  </Text>
                </View>

                {/* Arrow */}
                <Text style={{ color: colors.textTertiary, fontSize: 18 }}>{'\u2192'}</Text>

                {/* Drop slot */}
                <View style={styles.slotWrapper}>{renderSlot(aItem.id)}</View>
              </View>

              {!isLast && (
                <View
                  style={[
                    styles.rowDivider,
                    { backgroundColor: colors.surfaceBorder + '50' },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>

      {/* Pool of draggable Column B items */}
      {!isConfirmed && unpairedB.length > 0 && (
        <View style={styles.poolSection}>
          <Text style={[styles.poolLabel, { color: colors.textTertiary }]}>
            {selectedPoolItem ? 'TAP A SLOT ABOVE TO PLACE' : 'DRAG OR TAP TO MATCH'}
          </Text>
          <View style={styles.poolGrid}>
            {unpairedB.map((bItem) => {
              const isDragging = draggingItem === bItem.id;
              const isSelected = selectedPoolItem === bItem.id;
              const pan = getPan(bItem.id);

              return (
                <PanGestureHandler
                  key={bItem.id}
                  onGestureEvent={handleGestureEvent(bItem.id)}
                  onHandlerStateChange={handleStateChange(bItem.id)}
                  activeOffsetX={[-8, 8]}
                  activeOffsetY={[-8, 8]}
                >
                  <Animated.View
                    style={[
                      styles.poolChip,
                      {
                        backgroundColor: isSelected
                          ? colors.primary + '12'
                          : colors.surface,
                        borderColor: isSelected ? colors.primary : colors.surfaceBorder,
                        borderWidth: isSelected || isDragging ? 2 : 1,
                        transform: pan.getTranslateTransform(),
                        zIndex: isDragging ? 100 : 1,
                        elevation: isDragging ? 8 : 0,
                        shadowColor: '#000',
                        shadowOpacity: isDragging ? 0.2 : 0,
                        shadowRadius: isDragging ? 8 : 0,
                        shadowOffset: { width: 0, height: isDragging ? 4 : 0 },
                      },
                    ]}
                  >
                    <Pressable
                      onPress={() => onTapPoolItem(bItem.id)}
                      style={styles.poolChipInner}
                    >
                      <View style={[styles.chipBadge, { backgroundColor: '#F59E0B18' }]}>
                        <Text style={[styles.chipBadgeText, { color: '#D97706' }]}>
                          {bLabel(bItem.id)}
                        </Text>
                      </View>
                      <Text
                        style={[Typography.bodySm, { color: colors.text, flex: 1 }]}
                        numberOfLines={2}
                      >
                        {language === 'te' ? bItem.textTe : bItem.text}
                      </Text>
                    </Pressable>
                  </Animated.View>
                </PanGestureHandler>
              );
            })}
          </View>
        </View>
      )}

      {/* Confirm button */}
      {allPaired && !isConfirmed && (
        <Pressable
          onPress={onConfirm}
          style={[styles.confirmBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={[Typography.button, { color: '#FFFFFF' }]}>Confirm Match</Text>
        </Pressable>
      )}

      {/* Correct mapping — shown when answer is wrong */}
      {showFeedback && selectedOptionId !== payload.correctOptionId && (
        <View style={[styles.correctionCard, { borderColor: '#22C55E' }]}>
          <Text style={[styles.correctionTitle, { color: '#16A34A' }]}>
            Correct matching:
          </Text>
          {payload.columnA.map((a, idx) => {
            const correctBId = payload.correctMapping[a.id];
            const bItem = payload.columnB.find((b) => b.id === correctBId);
            const aText = language === 'te' ? a.textTe : a.text;
            const bText = bItem
              ? language === 'te'
                ? bItem.textTe
                : bItem.text
              : correctBId;
            return (
              <Text
                key={a.id}
                style={[
                  Typography.bodySm,
                  { color: '#16A34A', marginTop: idx > 0 ? 2 : 0 },
                ]}
              >
                {idx + 1}. {aText} {'\u2192'} {bText}
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
  // ── Match card ──
  matchCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  aSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  aBadge: {
    width: 24,
    height: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aBadgeText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 12,
  },
  slotWrapper: {
    flex: 1,
  },
  rowDivider: {
    height: 1,
    marginHorizontal: Spacing.sm,
  },
  // ── Drop slot ──
  dropSlot: {
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  slotContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  slotPlaceholder: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    textAlign: 'center',
  },
  removeHint: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  // ── Pool ──
  poolSection: {
    gap: Spacing.sm,
  },
  poolLabel: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 10,
    letterSpacing: 1,
  },
  poolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    overflow: 'visible',
  },
  poolChip: {
    borderRadius: BorderRadius.md,
  },
  poolChipInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
  },
  // ── Chip badge ──
  chipBadge: {
    width: 22,
    height: 22,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipBadgeText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 11,
  },
  // ── Confirm button ──
  confirmBtn: {
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
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
