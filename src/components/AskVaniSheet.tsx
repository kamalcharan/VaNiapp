import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../constants/theme';
import { SubjectId, EliminationHint } from '../types';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface AskVaniSheetProps {
  visible: boolean;
  onClose: () => void;
  questionText: string;
  subjectId: SubjectId;
  questionId?: string;
  eliminationHints?: EliminationHint[];
  selectedOptionId?: string | null;
  language?: string;
}

const ELIM_INTENT = 'eliminate';
const GEMINI_INTENTS = new Set(['why-wrong', 'why-correct', 'explain-simple']);

interface Intent {
  id: string;
  label: string;
}

export function AskVaniSheet({
  visible,
  onClose,
  questionText,
  subjectId,
  eliminationHints = [],
  selectedOptionId,
  language = 'en',
}: AskVaniSheetProps) {
  const { colors } = useTheme();

  const [activeIntent, setActiveIntent] = useState<string | null>(null);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      setActiveIntent(null);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // Build intents based on context
  const selectedHint = selectedOptionId
    ? eliminationHints.find((h) => h.optionKey === selectedOptionId)
    : null;

  const intents: Intent[] = [];
  if (selectedHint) {
    intents.push({ id: 'why-wrong', label: 'Why is my answer wrong?' });
  }
  intents.push({ id: 'why-correct', label: 'Why is this the correct answer?' });
  intents.push({ id: 'explain-simple', label: 'Explain this concept simply' });
  if (eliminationHints.length > 0) {
    intents.push({ id: ELIM_INTENT, label: 'How to eliminate wrong options?' });
  }

  const fireIntent = useCallback((intent: Intent) => {
    setActiveIntent(intent.id);
  }, []);

  const handleBack = () => {
    setActiveIntent(null);
  };

  if (!visible) return null;

  const isTelugu = language === 'te';
  const showingComingSoon = activeIntent != null && GEMINI_INTENTS.has(activeIntent);
  const showingElim = activeIntent === ELIM_INTENT;
  const showingIntents = !activeIntent;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Pressable onPress={() => {}}>
            {/* Handle bar */}
            <View style={styles.handleRow}>
              <View style={[styles.handle, { backgroundColor: colors.surfaceBorder }]} />
            </View>

            {/* Header */}
            <View style={styles.header}>
              {(showingComingSoon || showingElim) && (
                <Pressable onPress={handleBack} hitSlop={12} style={styles.backBtn}>
                  <Text style={[styles.backArrow, { color: colors.text }]}>{'\u2190'}</Text>
                </Pressable>
              )}
              <Text style={[Typography.h3, { color: colors.text, flex: 1 }]}>Ask VaNi</Text>
              <Pressable onPress={onClose} hitSlop={12}>
                <Text style={[styles.closeBtn, { color: colors.textSecondary }]}>Done</Text>
              </Pressable>
            </View>

            {/* Question context */}
            <View style={[styles.contextBox, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
              <Text style={[styles.contextLabel, { color: colors.textTertiary }]}>ABOUT THIS QUESTION</Text>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]} numberOfLines={3}>
                {questionText}
              </Text>
            </View>

            {/* === Intent buttons === */}
            {showingIntents && (
              <View style={styles.intentsArea}>
                <Text style={[styles.intentsHeading, { color: colors.textSecondary }]}>
                  What would you like to know?
                </Text>
                {intents.map((intent) => (
                  <Pressable
                    key={intent.id}
                    onPress={() => fireIntent(intent)}
                    style={[
                      styles.intentBtn,
                      { backgroundColor: colors.primaryLight },
                    ]}
                  >
                    <Text style={[styles.intentLabel, { color: colors.primary }]}>
                      {intent.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* === Elimination hints (from DB) === */}
            {showingElim && (
              <View style={styles.elimSection}>
                <View style={styles.elimHeader}>
                  <Text style={[styles.elimTitle, { color: '#8B5CF6' }]}>
                    Elimination Technique
                  </Text>
                </View>
                <ScrollView
                  style={styles.elimScroll}
                  showsVerticalScrollIndicator={false}
                >
                  {eliminationHints.map((hint) => (
                    <View
                      key={hint.optionKey}
                      style={[
                        styles.elimCard,
                        {
                          backgroundColor:
                            hint.optionKey === selectedOptionId
                              ? '#EF444410'
                              : colors.surface,
                          borderColor:
                            hint.optionKey === selectedOptionId
                              ? '#EF444440'
                              : colors.surfaceBorder,
                        },
                      ]}
                    >
                      <View style={styles.elimCardHeader}>
                        <View
                          style={[
                            styles.optionBadge,
                            {
                              backgroundColor:
                                hint.optionKey === selectedOptionId
                                  ? '#EF444420'
                                  : '#64748B15',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.optionBadgeText,
                              {
                                color:
                                  hint.optionKey === selectedOptionId
                                    ? '#EF4444'
                                    : '#64748B',
                              },
                            ]}
                          >
                            {hint.optionKey}
                          </Text>
                        </View>
                        {hint.optionKey === selectedOptionId && (
                          <Text style={styles.yourPickLabel}>Your pick</Text>
                        )}
                      </View>
                      <Text style={[Typography.bodySm, { color: colors.text, lineHeight: 20, marginTop: 4 }]}>
                        {isTelugu && hint.hintTe ? hint.hintTe : hint.hint}
                      </Text>
                      {hint.misconception ? (
                        <Text style={[styles.misconceptionText, { color: colors.textTertiary }]}>
                          Misconception: {isTelugu && hint.misconceptionTe ? hint.misconceptionTe : hint.misconception}
                        </Text>
                      ) : null}
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* === Coming Soon (Gemini intents) === */}
            {showingComingSoon && (
              <View style={styles.comingSoonArea}>
                <Text style={styles.comingSoonEmoji}>{'\uD83D\uDE80'}</Text>
                <Text style={[Typography.h3, { color: colors.text, textAlign: 'center' }]}>
                  Coming Soon!
                </Text>
                <Text
                  style={[
                    Typography.bodySm,
                    { color: colors.textSecondary, textAlign: 'center', lineHeight: 20, marginTop: 4 },
                  ]}
                >
                  VaNi's AI explanations are being fine-tuned{'\n'}for the best experience. Stay tuned!
                </Text>
              </View>
            )}
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: SCREEN_HEIGHT * 0.75,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  closeBtn: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
  },
  contextBox: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  contextLabel: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  // Intent buttons
  intentsArea: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    gap: 10,
  },
  intentsHeading: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
    marginBottom: 2,
  },
  intentBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.lg,
  },
  intentLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
  },
  // Elimination hints section
  elimSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    maxHeight: SCREEN_HEIGHT * 0.4,
  },
  elimHeader: {
    paddingBottom: Spacing.sm,
  },
  elimTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 13,
    letterSpacing: 0.3,
  },
  elimScroll: {
    maxHeight: SCREEN_HEIGHT * 0.35,
  },
  elimCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  elimCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  optionBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionBadgeText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 11,
  },
  yourPickLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 10,
    color: '#EF4444',
    letterSpacing: 0.5,
  },
  misconceptionText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 4,
  },
  // Coming Soon
  comingSoonArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  comingSoonEmoji: {
    fontSize: 48,
  },
});
