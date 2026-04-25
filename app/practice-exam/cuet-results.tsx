import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { StickyNote } from '../../src/components/ui/StickyNote';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { PuffyButton } from '../../src/components/ui/PuffyButton';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { SUBJECT_META } from '../../src/constants/subjects';
import { CUET_SCORING } from '../../src/types';

export default function CuetResultsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{
    subjectId: string;
    score: string;
    correct: string;
    wrong: string;
    unanswered: string;
    total: string;
    timeUsedMs: string;
    focusSwitches: string;
  }>();

  const subjectId = params.subjectId ?? '';
  const subjectMeta = SUBJECT_META[subjectId] ?? {
    name: subjectId ? subjectId.replace(/-/g, ' ') : 'Subject',
    emoji: '🎯',
    color: '#3B82F6',
  };

  const score = parseInt(params.score ?? '0', 10);
  const correct = parseInt(params.correct ?? '0', 10);
  const wrong = parseInt(params.wrong ?? '0', 10);
  const unanswered = parseInt(params.unanswered ?? '0', 10);
  const total = parseInt(params.total ?? String(CUET_SCORING.totalQuestions), 10);
  const timeUsedMs = parseInt(params.timeUsedMs ?? '0', 10);
  const focusSwitches = parseInt(params.focusSwitches ?? '0', 10);

  const attempted = correct + wrong;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  const percentage = Math.round((score / CUET_SCORING.maxMarks) * 100);

  const grade = (() => {
    if (percentage >= 80) return { label: 'Outstanding!', emoji: '🌟', color: '#22C55E' };
    if (percentage >= 60) return { label: 'Well Done!', emoji: '👍', color: '#3B82F6' };
    if (percentage >= 40) return { label: 'Good Effort', emoji: '💪', color: '#F59E0B' };
    return { label: 'Keep Practicing', emoji: '📖', color: '#EF4444' };
  })();

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}m ${s}s`;
  };

  const handlePracticeAgain = () => {
    router.replace({ pathname: '/practice-exam/cuet', params: { subjectId } });
  };

  const handleBackHome = () => {
    router.replace('/(main)');
  };

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>{grade.emoji}</Text>
            <HandwrittenText variant="hand">{grade.label}</HandwrittenText>
            <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 4 }]}>
              {subjectMeta.emoji} {subjectMeta.name} · CUET subject paper
            </Text>
          </View>

          {/* Score Card */}
          <JournalCard delay={100}>
            <View style={styles.scoreCenter}>
              <View style={[styles.scoreCircle, { borderColor: grade.color }]}>
                <Text style={[styles.scoreNum, { color: grade.color }]}>{score}</Text>
                <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                  / {CUET_SCORING.maxMarks}
                </Text>
              </View>
              <Text style={[Typography.h3, { color: colors.text, marginTop: Spacing.md }]}>
                {percentage}%
              </Text>
            </View>
          </JournalCard>

          {/* Breakdown */}
          <JournalCard delay={200}>
            <Text style={[Typography.label, { color: colors.textTertiary, marginBottom: Spacing.md }]}>
              BREAKDOWN
            </Text>
            <Row label="Correct" value={`${correct} × +${CUET_SCORING.correct}`} color="#22C55E" />
            <Row label="Wrong" value={`${wrong} × ${CUET_SCORING.wrong}`} color="#EF4444" />
            <Row label="Unanswered" value={String(unanswered)} color={colors.textSecondary} />
            <Row label="Attempted" value={`${attempted} / ${total}`} color={colors.text} last />
          </JournalCard>

          {/* Stats */}
          <JournalCard delay={300}>
            <Text style={[Typography.label, { color: colors.textTertiary, marginBottom: Spacing.md }]}>
              STATS
            </Text>
            <Row label="Accuracy" value={`${accuracy}%`} color={colors.text} />
            <Row label="Time used" value={formatTime(timeUsedMs)} color={colors.text} />
            <Row
              label="Focus switches"
              value={String(focusSwitches)}
              color={focusSwitches > 5 ? '#F59E0B' : colors.text}
              last
            />
          </JournalCard>

          {/* Note */}
          <StickyNote color="yellow" rotation={1} delay={400}>
            <Text style={[Typography.bodySm, { color: colors.text, lineHeight: 20 }]}>
              CUET marking: +{CUET_SCORING.correct} for a correct answer, {CUET_SCORING.wrong} for a wrong one,
              {' '}0 if unanswered. All 50 questions are mandatory since 2024.
            </Text>
          </StickyNote>

          {/* Actions */}
          <View style={styles.actions}>
            <PuffyButton title="Practice Again" onPress={handlePracticeAgain} icon={'🔁'} />
            <PuffyButton title="Back to Dashboard" onPress={handleBackHome} variant="ghost" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </DotGridBackground>
  );
}

function Row({
  label,
  value,
  color,
  last = false,
}: {
  label: string;
  value: string;
  color: string;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.row,
        !last && { borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
      ]}
    >
      <Text style={[Typography.bodySm, { color: '#6B7280', flex: 1 }]}>{label}</Text>
      <Text style={[Typography.h3, { color, fontSize: 16 }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: 40 },
  header: { alignItems: 'center', paddingVertical: Spacing.lg },
  headerEmoji: { fontSize: 56, marginBottom: Spacing.sm },
  scoreCenter: { alignItems: 'center', paddingVertical: Spacing.md },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreNum: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 36 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md },
  actions: { gap: Spacing.md, marginTop: Spacing.md },
});
