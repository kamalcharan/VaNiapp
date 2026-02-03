import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { JournalCard } from '../ui/JournalCard';
import { HandwrittenText } from '../ui/HandwrittenText';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { WrongAnswerEntry, SubjectId, Language } from '../../types';
import {
  lookupWrongAnswerSync,
  lookupWrongAnswer,
  WrongAnswerLookupResult,
} from '../../lib/explanationLookup';

interface Props {
  questionId: string;
  selectedOptionId: string;
  correctOptionId: string;
  questionText: string;
  subjectId: SubjectId;
  language?: Language;
  /** Called when user taps a concept tag */
  onConceptPress?: (conceptTag: string) => void;
}

export const WrongAnswerCard: React.FC<Props> = ({
  questionId,
  selectedOptionId,
  correctOptionId,
  questionText,
  subjectId,
  language = 'en',
  onConceptPress,
}) => {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(true);
  const [result, setResult] = useState<WrongAnswerLookupResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Try sync lookup first (bundled + cached)
    const syncResult = lookupWrongAnswerSync(questionId, selectedOptionId);
    if (syncResult) {
      setResult(syncResult);
      return;
    }

    // Fall back to async lookup (Edge Function)
    let cancelled = false;
    setLoading(true);
    lookupWrongAnswer(
      questionId,
      selectedOptionId,
      correctOptionId,
      questionText,
      subjectId,
      language,
    ).then((asyncResult) => {
      if (!cancelled) {
        setResult(asyncResult);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [questionId, selectedOptionId]);

  // Nothing to show
  if (!result && !loading) return null;

  const entry: WrongAnswerEntry | null = result?.entry ?? null;

  return (
    <JournalCard delay={100}>
      {/* Header — tappable to collapse/expand */}
      <Pressable
        onPress={() => setExpanded((p) => !p)}
        style={styles.header}
        hitSlop={4}
      >
        <HandwrittenText variant="handSm">Why was I wrong?</HandwrittenText>
        <Text style={[styles.chevron, { color: colors.textSecondary }]}>
          {expanded ? '\u25B2' : '\u25BC'}
        </Text>
      </Pressable>

      {/* Loading state */}
      {loading && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[Typography.bodySm, { color: colors.textSecondary, marginLeft: Spacing.sm }]}>
            Analyzing your answer...
          </Text>
        </View>
      )}

      {/* Content */}
      {expanded && entry && (
        <View style={styles.content}>
          {/* Misconception */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: '#EF4444' }]}>
              Likely Misconception
            </Text>
            <Text style={[Typography.body, { color: colors.text, lineHeight: 22 }]}>
              {entry.misconception}
            </Text>
          </View>

          {/* Correct Reasoning */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: '#22C55E' }]}>
              Correct Approach
            </Text>
            <Text style={[Typography.body, { color: colors.text, lineHeight: 22 }]}>
              {entry.correctReasoning}
            </Text>
          </View>

          {/* Tip */}
          <View style={[styles.tipBox, { backgroundColor: '#F59E0B15', borderColor: '#F59E0B30' }]}>
            <Text style={[Typography.bodySm, { color: '#B45309', fontStyle: 'italic' }]}>
              Tip: {entry.tip}
            </Text>
          </View>

          {/* Concept Tag */}
          {entry.conceptTag && entry.conceptTag !== 'general' && (
            <Pressable
              onPress={() => onConceptPress?.(entry.conceptTag)}
              style={[styles.conceptChip, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '40' }]}
              hitSlop={6}
            >
              <Text style={[styles.conceptChipText, { color: colors.primary }]}>
                {entry.conceptTag.replace(/-/g, ' ')}
              </Text>
              <Text style={[styles.conceptChipArrow, { color: colors.primary }]}>
                {' >'}
              </Text>
            </Pressable>
          )}

          {/* Source indicator */}
          {result && result.source !== 'bundled' && (
            <Text style={[styles.sourceText, { color: colors.textTertiary }]}>
              {result.source === 'generated' ? 'AI-generated analysis' : 'Cached analysis'}
            </Text>
          )}
        </View>
      )}
    </JournalCard>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chevron: {
    fontSize: 12,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  content: {
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  section: {
    gap: 4,
  },
  sectionLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  tipBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  conceptChip: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  conceptChipText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  conceptChipArrow: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
  },
  sourceText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 10,
    textAlign: 'right',
  },
});
