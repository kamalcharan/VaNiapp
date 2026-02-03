import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '../hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../constants/theme';
import { AnimatedPressable } from './ui/AnimatedPressable';
import { useToast } from './ui/Toast';
import { RootState } from '../store';
import { askDoubt, checkRateLimit } from '../lib/aiClient';
import { DoubtEntry } from '../store/slices/aiSlice';
import { SubjectId } from '../types';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface AskVaniSheetProps {
  visible: boolean;
  onClose: () => void;
  questionText: string;
  subjectId: SubjectId;
  questionId?: string;
}

export function AskVaniSheet({
  visible,
  onClose,
  questionText,
  subjectId,
}: AskVaniSheetProps) {
  const { colors } = useTheme();
  const toast = useToast();
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoading = useSelector((state: RootState) => state.ai.isLoading);

  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<DoubtEntry | null>(null);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible) {
      setQuery('');
      setResponse(null);
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

  const handleAsk = useCallback(async () => {
    const q = query.trim();
    if (!q || isLoading) return;

    try {
      const result = await askDoubt({
        query: q,
        subjectId,
        exam: user?.exam ?? 'NEET',
        language: user?.language ?? 'en',
        questionContext: questionText,
      });

      // Find the entry just added to history
      const state = (await import('../store')).store.getState();
      const latest = state.ai.doubtHistory[0];
      if (latest) setResponse(latest);

      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
    } catch (err: any) {
      toast.show('error', 'AI Error', err.message ?? 'Something went wrong');
    }
  }, [query, isLoading, subjectId, user, questionText, toast]);

  const { remaining } = checkRateLimit();

  // Quick suggestions based on the question context
  const suggestions = [
    'Why is this the correct answer?',
    'Explain this concept simply',
    'What mistake did I make?',
  ];

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
          <Pressable onPress={() => {}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              {/* Handle bar */}
              <View style={styles.handleRow}>
                <View style={[styles.handle, { backgroundColor: colors.surfaceBorder }]} />
              </View>

              {/* Header */}
              <View style={styles.header}>
                <Text style={[Typography.h3, { color: colors.text }]}>Ask VaNi</Text>
                <Text style={[styles.remainingText, { color: colors.textTertiary }]}>
                  {remaining} left today
                </Text>
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

              {/* Response area */}
              <ScrollView
                ref={scrollRef}
                style={styles.responseArea}
                contentContainerStyle={styles.responseContent}
                showsVerticalScrollIndicator={false}
              >
                {!response && !isLoading && (
                  <View style={styles.suggestionsArea}>
                    <Text style={[Typography.bodySm, { color: colors.textTertiary, marginBottom: Spacing.sm }]}>
                      Quick questions:
                    </Text>
                    {suggestions.map((s, i) => (
                      <AnimatedPressable
                        key={i}
                        onPress={() => setQuery(s)}
                        style={[styles.suggestionChip, { borderColor: colors.surfaceBorder }]}
                      >
                        <Text style={[Typography.bodySm, { color: colors.primary }]}>{s}</Text>
                      </AnimatedPressable>
                    ))}
                  </View>
                )}

                {isLoading && (
                  <View style={[styles.loadingBox, { backgroundColor: colors.surface }]}>
                    <Text style={[Typography.bodySm, { color: colors.primary }]}>
                      VaNi is thinking...
                    </Text>
                  </View>
                )}

                {response && (
                  <View style={[styles.responseBox, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
                    <View style={styles.responseHeader}>
                      <Text style={[styles.vaniLabel, { color: colors.primary }]}>VANI</Text>
                      <Text style={[styles.modelTag, { color: colors.textTertiary }]}>
                        {response.model === 'smart' ? 'GPT-4o' : '4o-mini'}
                      </Text>
                    </View>
                    <Text style={[Typography.body, { color: colors.text, lineHeight: 24 }]}>
                      {response.response}
                    </Text>
                    {response.relatedConcepts.length > 0 && (
                      <View style={styles.conceptsRow}>
                        {response.relatedConcepts.map((c, i) => (
                          <View key={i} style={[styles.conceptChip, { backgroundColor: colors.primaryLight }]}>
                            <Text style={[styles.conceptText, { color: colors.primary }]}>{c}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </ScrollView>

              {/* Input bar */}
              <View style={[styles.inputBar, { borderTopColor: colors.surfaceBorder }]}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.surfaceBorder,
                      color: colors.text,
                    },
                  ]}
                  placeholder="Ask about this question..."
                  placeholderTextColor={colors.textTertiary}
                  value={query}
                  onChangeText={setQuery}
                  onSubmitEditing={handleAsk}
                  returnKeyType="send"
                  maxLength={300}
                  editable={!isLoading}
                />
                <AnimatedPressable
                  onPress={handleAsk}
                  disabled={!query.trim() || isLoading}
                  style={[
                    styles.sendBtn,
                    {
                      backgroundColor:
                        query.trim() && !isLoading ? colors.primary : colors.surfaceBorder,
                    },
                  ]}
                >
                  <Text style={styles.sendIcon}>{'>'}</Text>
                </AnimatedPressable>
              </View>
            </KeyboardAvoidingView>
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
  remainingText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    flex: 1,
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
  responseArea: {
    maxHeight: SCREEN_HEIGHT * 0.35,
  },
  responseContent: {
    padding: Spacing.lg,
  },
  suggestionsArea: {
    gap: Spacing.sm,
  },
  suggestionChip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    borderStyle: 'dashed',
  },
  loadingBox: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  responseBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  vaniLabel: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 11,
    letterSpacing: 1,
  },
  modelTag: {
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
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
  },
  conceptText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    minHeight: 40,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 16,
  },
});
