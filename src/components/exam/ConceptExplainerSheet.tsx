import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { ConceptEntry, SubjectId, Language } from '../../types';
import {
  lookupConceptSync,
  lookupConcept,
  ConceptLookupResult,
} from '../../lib/conceptLookup';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface Props {
  visible: boolean;
  onClose: () => void;
  conceptTag: string;
  subjectId: SubjectId;
  chapterId: string;
  language?: Language;
}

export function ConceptExplainerSheet({
  visible,
  onClose,
  conceptTag,
  subjectId,
  chapterId,
  language = 'en',
}: Props) {
  const { colors } = useTheme();
  const [result, setResult] = useState<ConceptLookupResult | null>(null);
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const isVisible = visible === true;
  const safeTag = typeof conceptTag === 'string' ? conceptTag : '';

  // Animate open/close
  useEffect(() => {
    if (isVisible) {
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
  }, [isVisible]);

  // Fetch concept data when tag changes
  useEffect(() => {
    if (!isVisible || !safeTag) return;

    // Try sync first
    const syncResult = lookupConceptSync(safeTag);
    if (syncResult) {
      setResult(syncResult);
      setLoading(false);
      return;
    }

    // Fall back to async
    let cancelled = false;
    setResult(null);
    setLoading(true);
    lookupConcept(safeTag, subjectId, chapterId, language)
      .then((asyncResult) => {
        if (!cancelled) {
          setResult(asyncResult);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [isVisible, safeTag]);

  // Reset when closing
  useEffect(() => {
    if (!isVisible) {
      setResult(null);
      setLoading(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const entry: ConceptEntry | null = result?.entry ?? null;

  return (
    <Modal transparent={true} visible={isVisible} animationType="none" onRequestClose={onClose}>
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
              <View style={{ flex: 1 }}>
                <Text style={[Typography.h3, { color: colors.text }]}>
                  {entry?.title ?? safeTag.replace(/-/g, ' ')}
                </Text>
                {result && result.source !== 'bundled' && (
                  <Text style={[styles.sourceTag, { color: colors.textTertiary }]}>
                    {result.source === 'generated' ? 'AI-generated' : 'Cached'}
                  </Text>
                )}
              </View>
              <Pressable onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                <Text style={[styles.closeBtn, { color: colors.textSecondary }]}>Done</Text>
              </Pressable>
            </View>

            {/* Loading */}
            {loading && (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[Typography.bodySm, { color: colors.textSecondary, marginLeft: Spacing.sm }]}>
                  Loading concept...
                </Text>
              </View>
            )}

            {/* Not found */}
            {!loading && !entry && (
              <View style={styles.loadingBox}>
                <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                  Concept explanation not available.
                </Text>
              </View>
            )}

            {/* Content */}
            {entry && (
              <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Explanation */}
                <View style={styles.section}>
                  <Text style={[styles.sectionLabel, { color: colors.primary }]}>EXPLANATION</Text>
                  <Text style={[Typography.body, { color: colors.text, lineHeight: 24 }]}>
                    {entry.explanation}
                  </Text>
                </View>

                {/* Analogy */}
                {entry.analogy ? (
                  <View style={[styles.analogyBox, { backgroundColor: '#8B5CF615', borderColor: '#8B5CF630' }]}>
                    <Text style={[styles.sectionLabel, { color: '#8B5CF6' }]}>THINK OF IT LIKE...</Text>
                    <Text style={[Typography.body, { color: colors.text, lineHeight: 22, marginTop: 4 }]}>
                      {entry.analogy}
                    </Text>
                  </View>
                ) : null}

                {/* Exam Relevance */}
                {entry.examRelevance ? (
                  <View style={[styles.relevanceBox, { backgroundColor: '#F59E0B15', borderColor: '#F59E0B30' }]}>
                    <Text style={[styles.sectionLabel, { color: '#B45309' }]}>NEET EXAM RELEVANCE</Text>
                    <Text style={[Typography.bodySm, { color: colors.text, lineHeight: 20, marginTop: 4 }]}>
                      {entry.examRelevance}
                    </Text>
                  </View>
                ) : null}

                {/* Common Mistakes */}
                {entry.commonMistakes.length > 0 && (
                  <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: '#EF4444' }]}>COMMON MISTAKES</Text>
                    {entry.commonMistakes.map((mistake, i) => (
                      <View key={i} style={styles.mistakeRow}>
                        <Text style={[styles.bullet, { color: '#EF4444' }]}>x</Text>
                        <Text style={[Typography.bodySm, { color: colors.text, flex: 1, lineHeight: 20 }]}>
                          {mistake}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Quick Recap */}
                {entry.quickRecap ? (
                  <View style={[styles.recapBox, { backgroundColor: '#22C55E15', borderColor: '#22C55E30' }]}>
                    <Text style={[styles.sectionLabel, { color: '#22C55E' }]}>QUICK RECAP</Text>
                    <Text style={[Typography.bodySm, { color: colors.text, lineHeight: 20, marginTop: 4 }]}>
                      {entry.quickRecap}
                    </Text>
                  </View>
                ) : null}
              </ScrollView>
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
    maxHeight: SCREEN_HEIGHT * 0.8,
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
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  sourceTag: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 10,
    marginTop: 2,
  },
  closeBtn: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
    marginTop: 4,
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  scrollArea: {
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  section: {
    gap: 6,
  },
  sectionLabel: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  analogyBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  relevanceBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  recapBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  mistakeRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  bullet: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 12,
    marginTop: 2,
  },
});
