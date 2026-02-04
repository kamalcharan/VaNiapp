import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { AnimatedPressable } from '../../src/components/ui/AnimatedPressable';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { SUBJECT_META } from '../../src/constants/subjects';
import { RootState } from '../../src/store';
import { SubjectId } from '../../src/types';
import { askDoubt, checkRateLimit } from '../../src/lib/aiClient';
import { useToast } from '../../src/components/ui/Toast';
import { DoubtEntry } from '../../src/store/slices/aiSlice';

// ── Chat Bubble Component ──

function UserBubble({ text, colors }: { text: string; colors: any }) {
  return (
    <View style={[styles.bubble, styles.userBubble, { backgroundColor: colors.primary }]}>
      <Text style={[Typography.body, { color: '#FFFFFF' }]}>{text}</Text>
    </View>
  );
}

function AiBubble({
  entry,
  colors,
  onConceptPress,
}: {
  entry: DoubtEntry;
  colors: any;
  onConceptPress?: (concept: string) => void;
}) {
  const subjectMeta = SUBJECT_META[entry.subjectId];

  // Simple markdown-ish rendering: bold text between **
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <Text
            key={i}
            style={{ fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.text }}
          >
            {part.slice(2, -2)}
          </Text>
        );
      }
      return <Text key={i}>{part}</Text>;
    });
  };

  return (
    <View style={[styles.bubble, styles.aiBubble, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
      {/* Model badge */}
      <View style={styles.aiBubbleHeader}>
        <Text style={[styles.aiLabel, { color: colors.primary }]}>VaNi</Text>
        <Text style={[styles.modelBadge, { color: colors.textTertiary }]}>
          {entry.model === 'smart' ? 'GPT-4o' : '4o-mini'}
        </Text>
      </View>

      <Text style={[Typography.body, { color: colors.text, lineHeight: 24 }]}>
        {renderText(entry.response)}
      </Text>

      {/* Related concepts */}
      {entry.relatedConcepts.length > 0 && (
        <View style={styles.conceptsRow}>
          {entry.relatedConcepts.map((concept, idx) => (
            <Pressable
              key={idx}
              onPress={() => onConceptPress?.(concept)}
              style={[styles.conceptChip, { backgroundColor: colors.primaryLight }]}
            >
              <Text style={[styles.conceptChipText, { color: colors.primary }]}>
                {concept}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

function TypingIndicator({ colors }: { colors: any }) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(400),
        ])
      );
    const a1 = animate(dot1, 0);
    const a2 = animate(dot2, 200);
    const a3 = animate(dot3, 400);
    a1.start();
    a2.start();
    a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, []);

  const dotStyle = (dot: Animated.Value) => ({
    opacity: dot.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
    transform: [{ scale: dot.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] }) }],
  });

  return (
    <View style={[styles.bubble, styles.aiBubble, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
      <View style={styles.aiBubbleHeader}>
        <Text style={[styles.aiLabel, { color: colors.primary }]}>VaNi</Text>
        <Text style={[styles.modelBadge, { color: colors.textTertiary }]}>thinking...</Text>
      </View>
      <View style={styles.dotsRow}>
        {[dot1, dot2, dot3].map((d, i) => (
          <Animated.View
            key={i}
            style={[styles.dot, { backgroundColor: colors.primary }, dotStyle(d)]}
          />
        ))}
      </View>
    </View>
  );
}

// ── Main Screen ──

export default function AskVaniScreen() {
  const { colors } = useTheme();
  const toast = useToast();
  const scrollRef = useRef<ScrollView>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const doubtHistory = useSelector((state: RootState) => state.ai.doubtHistory);
  const isLoading = useSelector((state: RootState) => state.ai.isLoading);

  const userSubjects = useMemo(() => {
    const ids = user?.selectedSubjects ?? ['physics', 'chemistry', 'botany', 'zoology'];
    return ids.map((id) => ({
      id,
      ...(SUBJECT_META[id] ?? { name: id, emoji: '?', color: '#64748B' }),
    }));
  }, [user?.selectedSubjects]);

  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(
    userSubjects[0]?.id ?? 'physics'
  );
  const [inputText, setInputText] = useState('');
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);

  // Combine pending query + history for display
  const chatItems = useMemo(() => {
    // Show history in reverse-chronological order (newest first in array), but display oldest-first
    const items = [...doubtHistory].reverse();
    return items;
  }, [doubtHistory]);

  const handleSend = useCallback(async () => {
    const query = inputText.trim();
    if (!query || isLoading) return;

    Keyboard.dismiss();
    setInputText('');
    setPendingQuery(query);

    // Scroll to bottom
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      await askDoubt({
        query,
        subjectId: selectedSubject,
        exam: user?.exam ?? 'NEET',
        language: user?.language ?? 'en',
      });
    } catch (err: any) {
      toast.show('error', 'AI Error', err.message ?? 'Something went wrong');
    } finally {
      setPendingQuery(null);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
    }
  }, [inputText, isLoading, selectedSubject, user, toast]);

  const handleConceptPress = useCallback(
    (concept: string) => {
      setInputText(`Explain: ${concept}`);
    },
    []
  );

  const { remaining } = checkRateLimit();

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[Typography.h2, { color: colors.text }]}>Ask VaNi</Text>
              <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                {remaining} queries left today
              </Text>
            </View>
          </View>

          {/* Subject Selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.subjectRow}
            contentContainerStyle={styles.subjectContent}
          >
            {userSubjects.map((s) => {
              const isActive = s.id === selectedSubject;
              return (
                <Pressable
                  key={s.id}
                  onPress={() => setSelectedSubject(s.id as SubjectId)}
                  style={[
                    styles.subjectChip,
                    {
                      backgroundColor: isActive ? s.color + '20' : colors.surface,
                      borderColor: isActive ? s.color : colors.surfaceBorder,
                    },
                  ]}
                >
                  <Text style={styles.subjectEmoji}>{s.emoji}</Text>
                  <Text
                    style={[
                      styles.subjectChipText,
                      { color: isActive ? s.color : colors.textSecondary },
                    ]}
                  >
                    {s.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Chat Area */}
          <ScrollView
            ref={scrollRef}
            style={styles.chatArea}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
          >
            {/* Empty state */}
            {chatItems.length === 0 && !pendingQuery && (
              <View style={styles.emptyState}>
                <JournalCard delay={100}>
                  <View style={styles.emptyInner}>
                    <Text style={styles.emptyEmoji}>{'?'}</Text>
                    <HandwrittenText variant="hand" rotation={-1}>
                      Ask me anything!
                    </HandwrittenText>
                    <Text
                      style={[
                        Typography.bodySm,
                        { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm },
                      ]}
                    >
                      I can explain concepts, solve doubts,{'\n'}and help you prepare for {user?.exam ?? 'NEET'}.
                    </Text>

                    {/* Suggestion chips */}
                    <View style={styles.suggestionsWrap}>
                      {getSuggestions(selectedSubject).map((s, i) => (
                        <AnimatedPressable
                          key={i}
                          onPress={() => setInputText(s)}
                          style={[styles.suggestionChip, { borderColor: colors.surfaceBorder }]}
                        >
                          <Text style={[Typography.bodySm, { color: colors.primary }]}>{s}</Text>
                        </AnimatedPressable>
                      ))}
                    </View>
                  </View>
                </JournalCard>
              </View>
            )}

            {/* Chat bubbles */}
            {chatItems.map((entry) => (
              <View key={entry.id} style={styles.chatPair}>
                <UserBubble text={entry.query} colors={colors} />
                <AiBubble entry={entry} colors={colors} onConceptPress={handleConceptPress} />
              </View>
            ))}

            {/* Pending query + typing indicator */}
            {pendingQuery && (
              <View style={styles.chatPair}>
                <UserBubble text={pendingQuery} colors={colors} />
                <TypingIndicator colors={colors} />
              </View>
            )}
          </ScrollView>

          {/* Input Bar */}
          <View style={[styles.inputBar, { backgroundColor: colors.background, borderTopColor: colors.surfaceBorder }]}>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.surfaceBorder,
                  color: colors.text,
                },
              ]}
              placeholder={`Ask about ${SUBJECT_META[selectedSubject]?.name ?? 'any topic'}...`}
              placeholderTextColor={colors.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              multiline
              maxLength={500}
              editable={!isLoading}
            />
            <AnimatedPressable
              onPress={handleSend}
              disabled={!inputText.trim() || isLoading}
              style={[
                styles.sendBtn,
                {
                  backgroundColor:
                    inputText.trim() && !isLoading ? colors.primary : colors.surfaceBorder,
                },
              ]}
            >
              <Text style={styles.sendIcon}>{'>'}</Text>
            </AnimatedPressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </DotGridBackground>
  );
}

// ── Subject-specific suggestions ──

function getSuggestions(subjectId: SubjectId): string[] {
  const map: Partial<Record<SubjectId, string[]>> = {
    physics: [
      'What is Newton\'s third law?',
      'Difference between speed and velocity',
      'Explain electromagnetic induction',
    ],
    chemistry: [
      'What is hybridization?',
      'Explain Le Chatelier\'s principle',
      'Types of chemical bonds',
    ],
    botany: [
      'Difference between mitosis and meiosis',
      'What is photosynthesis?',
      'Explain Krebs cycle',
    ],
    zoology: [
      'What is DNA replication?',
      'Explain Mendel\'s laws',
      'Structure of human heart',
    ],
  };
  return map[subjectId] ?? [
    'Explain this topic simply',
    'What are the key concepts?',
    'Common mistakes to avoid',
  ];
}

// ── Styles ──

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  subjectRow: { maxHeight: 48 },
  subjectContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    alignItems: 'center',
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    gap: 6,
  },
  subjectEmoji: { fontSize: 14 },
  subjectChipText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
  },
  chatArea: { flex: 1 },
  chatContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  chatPair: { marginBottom: Spacing.lg },
  bubble: {
    maxWidth: '88%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  aiBubbleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  aiLabel: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  modelBadge: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 10,
  },
  conceptsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  conceptChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
  },
  conceptChipText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyState: {
    paddingTop: Spacing.xxxl,
  },
  emptyInner: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emptyEmoji: { fontSize: 48 },
  suggestionsWrap: {
    marginTop: Spacing.lg,
    gap: Spacing.sm,
    width: '100%',
  },
  suggestionChip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    borderStyle: 'dashed',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    gap: Spacing.sm,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15,
    maxHeight: 100,
    minHeight: 42,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 18,
  },
});
