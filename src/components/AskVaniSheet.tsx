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

// Delay between each chat bubble appearing (ms)
const BUBBLE_DELAY = 600;
// How long the "typing..." indicator shows before each bubble
const TYPING_DURATION = 500;

interface AskVaniSheetProps {
  visible: boolean;
  onClose: () => void;
  questionText: string;
  subjectId: SubjectId;
  questionId?: string;
  questionType?: string;
  explanation?: string;
  eliminationHints?: EliminationHint[];
  /** Plain-text fallback (used in quick-practice) */
  eliminationText?: string;
  selectedOptionId?: string | null;
  language?: string;
}

// ── Chat message types ──────────────────────────────────────────────────
interface ChatMessage {
  type: 'intro' | 'hint' | 'misconception' | 'closing';
  text: string;
  optionKey?: string;
  isUserPick?: boolean;
}

/** Extract a short recall hint from the explanation (first sentence, capped). */
function buildRecallHint(explanation: string): string {
  // Grab up to the first period/newline, capped at 200 chars
  const firstSentence = explanation.split(/[.\n]/)[0]?.trim() || '';
  if (firstSentence.length > 200) return firstSentence.slice(0, 197) + '...';
  return firstSentence;
}

function buildChatMessages(
  hints: EliminationHint[],
  eliminationText: string | undefined,
  selectedOptionId: string | null | undefined,
  language: string,
  questionType?: string,
  explanation?: string,
): ChatMessage[] {
  const msgs: ChatMessage[] = [];
  const isTelugu = language === 'te';

  // ── Fill-in-blanks: recall hints instead of elimination ──
  if (questionType === 'fill-in-blanks') {
    msgs.push({
      type: 'intro',
      text: "Let me give you a recall hint...",
    });
    if (explanation) {
      msgs.push({
        type: 'hint',
        text: buildRecallHint(explanation),
      });
    }
    msgs.push({
      type: 'closing',
      text: "Try to recall the key term — you've got this!",
    });
    return msgs;
  }

  // ── Structured per-option hints ──
  if (hints.length > 0) {
    msgs.push({
      type: 'intro',
      text: "Let me help you eliminate the wrong options...",
    });

    for (const hint of hints) {
      const hintText = isTelugu && hint.hintTe ? hint.hintTe : hint.hint;
      const isUserPick = hint.optionKey === selectedOptionId;

      msgs.push({
        type: 'hint',
        text: hintText,
        optionKey: hint.optionKey,
        isUserPick,
      });

      if (hint.misconception) {
        const miscText = isTelugu && hint.misconceptionTe
          ? hint.misconceptionTe
          : hint.misconception;
        msgs.push({
          type: 'misconception',
          text: miscText,
          optionKey: hint.optionKey,
        });
      }
    }

    msgs.push({
      type: 'closing',
      text: "Now you can narrow it down and make a smarter choice!",
    });
  } else if (eliminationText) {
    // Plain-text fallback
    msgs.push({
      type: 'intro',
      text: "Here's how to approach this question...",
    });
    msgs.push({
      type: 'hint',
      text: eliminationText,
    });
  } else {
    msgs.push({
      type: 'intro',
      text: "No elimination hints for this question yet. Try reading each option carefully and ruling out the ones that don't match the key concept!",
    });
  }

  return msgs;
}

// ── Typing dots animation ───────────────────────────────────────────────
function TypingIndicator({ colors }: { colors: any }) {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      );

    const a1 = animate(dot1, 0);
    const a2 = animate(dot2, 150);
    const a3 = animate(dot3, 300);
    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, []);

  return (
    <View style={chatStyles.typingRow}>
      <View style={[chatStyles.avatar, { backgroundColor: '#8B5CF620' }]}>
        <Text style={chatStyles.avatarText}>{'\u2728'}</Text>
      </View>
      <View style={[chatStyles.typingBubble, { backgroundColor: colors.surface }]}>
        <Animated.View style={[chatStyles.dot, { opacity: dot1, backgroundColor: colors.textTertiary }]} />
        <Animated.View style={[chatStyles.dot, { opacity: dot2, backgroundColor: colors.textTertiary }]} />
        <Animated.View style={[chatStyles.dot, { opacity: dot3, backgroundColor: colors.textTertiary }]} />
      </View>
    </View>
  );
}

// ── Single chat bubble ──────────────────────────────────────────────────
function ChatBubble({
  message,
  colors,
  showAvatar,
}: {
  message: ChatMessage;
  colors: any;
  showAvatar: boolean;
}) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isHint = message.type === 'hint';
  const isMisconception = message.type === 'misconception';
  const isIntroOrClosing = message.type === 'intro' || message.type === 'closing';

  return (
    <Animated.View
      style={[
        chatStyles.bubbleRow,
        { opacity: fadeIn, transform: [{ translateY: slideUp }] },
      ]}
    >
      {/* Avatar column */}
      <View style={chatStyles.avatarCol}>
        {showAvatar ? (
          <View style={[chatStyles.avatar, { backgroundColor: '#8B5CF620' }]}>
            <Text style={chatStyles.avatarText}>{'\u2728'}</Text>
          </View>
        ) : (
          <View style={chatStyles.avatarSpacer} />
        )}
      </View>

      {/* Bubble */}
      <View
        style={[
          chatStyles.bubble,
          {
            backgroundColor: message.isUserPick
              ? '#EF444410'
              : isMisconception
                ? '#F59E0B08'
                : isIntroOrClosing
                  ? '#8B5CF610'
                  : colors.surface,
            borderColor: message.isUserPick
              ? '#EF444430'
              : isMisconception
                ? '#F59E0B25'
                : isIntroOrClosing
                  ? '#8B5CF625'
                  : colors.surfaceBorder,
          },
        ]}
      >
        {/* Option badge for hint messages */}
        {isHint && message.optionKey && (
          <View style={chatStyles.optionHeader}>
            <View
              style={[
                chatStyles.optionBadge,
                {
                  backgroundColor: message.isUserPick ? '#EF444420' : '#8B5CF620',
                },
              ]}
            >
              <Text
                style={[
                  chatStyles.optionBadgeText,
                  { color: message.isUserPick ? '#EF4444' : '#8B5CF6' },
                ]}
              >
                Option {message.optionKey}
              </Text>
            </View>
            {message.isUserPick && (
              <Text style={chatStyles.yourPickText}>Your pick</Text>
            )}
          </View>
        )}

        {/* Misconception label */}
        {isMisconception && (
          <Text style={chatStyles.misconceptionLabel}>
            {'\uD83D\uDCA1'} Common misconception
          </Text>
        )}

        <Text style={[Typography.bodySm, { color: colors.text, lineHeight: 21 }]}>
          {message.text}
        </Text>
      </View>
    </Animated.View>
  );
}

// ── Main component ──────────────────────────────────────────────────────
export function AskVaniSheet({
  visible,
  onClose,
  questionText,
  subjectId,
  questionType,
  explanation,
  eliminationHints = [],
  eliminationText,
  selectedOptionId,
  language = 'en',
}: AskVaniSheetProps) {
  const { colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const scrollRef = useRef<ScrollView>(null);

  const [visibleCount, setVisibleCount] = useState(0);
  const [showTyping, setShowTyping] = useState(false);

  const messages = useCallback(
    () =>
      buildChatMessages(eliminationHints, eliminationText, selectedOptionId, language, questionType, explanation),
    [eliminationHints, eliminationText, selectedOptionId, language, questionType, explanation],
  )();

  // ── Slide animation ──
  useEffect(() => {
    if (visible) {
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

  // ── Staggered message reveal ──
  useEffect(() => {
    if (!visible) {
      setVisibleCount(0);
      setShowTyping(false);
      return;
    }

    // Start the typing → reveal cycle
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const revealNext = (index: number) => {
      if (cancelled || index >= messages.length) {
        setShowTyping(false);
        return;
      }

      // Show typing indicator
      setShowTyping(true);
      timers.push(
        setTimeout(() => {
          if (cancelled) return;
          // Reveal the message
          setVisibleCount(index + 1);
          setShowTyping(index < messages.length - 1);

          // Scroll to bottom
          setTimeout(() => {
            scrollRef.current?.scrollToEnd({ animated: true });
          }, 50);

          // Schedule next
          timers.push(
            setTimeout(() => {
              revealNext(index + 1);
            }, BUBBLE_DELAY),
          );
        }, TYPING_DURATION),
      );
    };

    // Small initial delay before first message
    timers.push(setTimeout(() => revealNext(0), 300));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [visible, messages.length]);

  if (!visible) return null;

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
          <Pressable onPress={() => {}} style={{ flex: 1 }}>
            {/* Handle bar */}
            <View style={styles.handleRow}>
              <View style={[styles.handle, { backgroundColor: colors.surfaceBorder }]} />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={chatStyles.headerEmoji}>{'\u2728'}</Text>
                <View>
                  <Text style={[Typography.h3, { color: colors.text }]}>VaNi</Text>
                  <Text style={[chatStyles.headerSub, { color: colors.textTertiary }]}>
                    {questionType === 'fill-in-blanks' ? 'Recall Coach' : 'Elimination Coach'}
                  </Text>
                </View>
              </View>
              <Pressable onPress={onClose} hitSlop={12}>
                <Text style={[styles.closeBtn, { color: colors.textSecondary }]}>Done</Text>
              </Pressable>
            </View>

            {/* Question context (compact) */}
            <View style={[styles.contextBox, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]} numberOfLines={2}>
                {questionText}
              </Text>
            </View>

            {/* Chat area */}
            <ScrollView
              ref={scrollRef}
              style={chatStyles.chatScroll}
              contentContainerStyle={chatStyles.chatContent}
              showsVerticalScrollIndicator={false}
            >
              {messages.slice(0, visibleCount).map((msg, idx) => {
                // Show avatar on first message, or when previous message was a different "group"
                const prev = idx > 0 ? messages[idx - 1] : null;
                const showAvatar =
                  idx === 0 ||
                  msg.type === 'intro' ||
                  msg.type === 'closing' ||
                  (msg.type === 'hint' && prev?.type !== 'hint');
                return (
                  <ChatBubble
                    key={`${idx}-${msg.optionKey ?? msg.type}`}
                    message={msg}
                    colors={colors}
                    showAvatar={showAvatar}
                  />
                );
              })}

              {showTyping && <TypingIndicator colors={colors} />}
            </ScrollView>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

// ── Base styles (sheet chrome) ──────────────────────────────────────────
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
    overflow: 'hidden',
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
});

// ── Chat-specific styles ────────────────────────────────────────────────
const chatStyles = StyleSheet.create({
  headerEmoji: {
    fontSize: 28,
  },
  headerSub: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
    marginTop: -1,
  },
  chatScroll: {
    flex: 1,
    marginTop: Spacing.md,
  },
  chatContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: 10,
  },
  // Chat bubble row
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarCol: {
    width: 36,
    marginRight: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
  },
  avatarSpacer: {
    width: 28,
    height: 1,
  },
  // Bubble content
  bubble: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderTopLeftRadius: 4,
    borderWidth: 1,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  optionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  optionBadgeText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 11,
  },
  yourPickText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 10,
    color: '#EF4444',
    letterSpacing: 0.3,
  },
  misconceptionLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    color: '#F59E0B',
    marginBottom: 4,
  },
  // Typing indicator
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderTopLeftRadius: 4,
    marginLeft: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
});
