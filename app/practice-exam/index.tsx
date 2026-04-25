import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';

import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { StickyNote } from '../../src/components/ui/StickyNote';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { PuffyButton } from '../../src/components/ui/PuffyButton';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { getProfile, getUserSubjectIds, MedProfile } from '../../src/lib/database';
import { getSubjects, CatalogSubject } from '../../src/lib/catalog';
import { ExamType } from '../../src/types';
import { RootState } from '../../src/store';

type ExamFocus = 'NEET' | 'CUET';

interface InfoRow {
  label: string;
  value: string;
  detail: string;
}

// NEET full-paper pattern (4 subjects, single sitting)
const NEET_INFO: InfoRow[] = [
  { label: 'Total Questions', value: '200', detail: '50 per subject' },
  { label: 'Section A', value: '35 Qs', detail: 'All mandatory, per subject' },
  { label: 'Section B', value: '15 Qs', detail: 'Attempt any 10, per subject' },
  { label: 'Duration', value: '3h 20m', detail: '200 minutes total' },
  { label: 'Correct Answer', value: '+4', detail: 'marks' },
  { label: 'Wrong Answer', value: '-1', detail: 'mark (negative)' },
  { label: 'Unanswered', value: '0', detail: 'marks' },
  { label: 'Maximum Marks', value: '720', detail: '180 scored × 4' },
];

// CUET UG per-subject pattern (each domain paper is its own sitting)
const CUET_INFO: InfoRow[] = [
  { label: 'Total Questions', value: '50', detail: 'per subject paper' },
  { label: 'Attempt', value: 'All 50', detail: 'mandatory (since 2024)' },
  { label: 'Duration', value: '60 min', detail: 'per subject' },
  { label: 'Correct Answer', value: '+5', detail: 'marks' },
  { label: 'Wrong Answer', value: '-1', detail: 'mark (negative)' },
  { label: 'Unanswered', value: '0', detail: 'marks' },
  { label: 'Maximum Marks', value: '250', detail: 'per subject' },
];

export default function PracticeExamIntroScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const savedExamFocus = useSelector((state: RootState) => state.auth.dashboardExamFocus);

  const [profile, setProfile] = useState<MedProfile | null>(null);
  const [subjects, setSubjects] = useState<CatalogSubject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [prof, subjectIds, allSubjects] = await Promise.all([
        getProfile(),
        getUserSubjectIds(),
        getSubjects(),
      ]);
      setProfile(prof);
      const matched = subjectIds
        .map((id) => allSubjects.find((s) => s.id === id))
        .filter(Boolean) as CatalogSubject[];
      setSubjects(matched);
      setLoading(false);
    })();
  }, []);

  const exam: ExamType = profile?.exam ?? 'NEET';
  const isBoth = exam === 'BOTH';
  const examFocus: ExamFocus = (savedExamFocus as ExamFocus) || 'NEET';
  // Effective view: which exam we're showing format for right now.
  const view: ExamFocus = isBoth ? examFocus : (exam === 'CUET' ? 'CUET' : 'NEET');

  const visibleSubjects = isBoth
    ? subjects.filter((s) => s.exam_id === view)
    : subjects;

  const infoRows = view === 'CUET' ? CUET_INFO : NEET_INFO;
  const headerSubtitle = view === 'CUET'
    ? 'CUET subject paper format'
    : 'Full NEET format mock test';

  const handleStart = () => {
    router.push('/practice-exam/quiz');
  };

  const handleOpenQuickPractice = () => {
    router.push('/quick-practice');
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <DotGridBackground>
        <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
          <ActivityIndicator color={colors.primary} />
        </SafeAreaView>
      </DotGridBackground>
    );
  }

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>{'🎯'}</Text>
            <HandwrittenText variant="hand">Practice Exam</HandwrittenText>
            <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 4 }]}>
              {headerSubtitle}
            </Text>
            {isBoth && (
              <Text style={[Typography.bodySm, { color: colors.textTertiary, marginTop: 2 }]}>
                Showing {examFocus} format
              </Text>
            )}
          </View>

          {/* Format Card */}
          <JournalCard delay={100}>
            <Text style={[Typography.label, { color: colors.textTertiary, marginBottom: Spacing.md }]}>
              {view === 'CUET' ? 'CUET FORMAT' : 'EXAM FORMAT'}
            </Text>
            {infoRows.map((row, idx) => (
              <View
                key={row.label}
                style={[
                  styles.infoRow,
                  idx < infoRows.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.surfaceBorder,
                  },
                ]}
              >
                <Text style={[Typography.bodySm, { color: colors.textSecondary, flex: 1 }]}>
                  {row.label}
                </Text>
                <Text style={[Typography.h3, { color: colors.text }]}>{row.value}</Text>
                <Text
                  style={[Typography.bodySm, { color: colors.textTertiary, width: 90, textAlign: 'right' }]}
                >
                  {row.detail}
                </Text>
              </View>
            ))}
          </JournalCard>

          {/* Subjects */}
          <JournalCard delay={200}>
            <Text style={[Typography.label, { color: colors.textTertiary, marginBottom: Spacing.md }]}>
              {view === 'CUET' ? 'YOUR CUET SUBJECTS' : 'SUBJECTS'}
            </Text>
            {visibleSubjects.length === 0 ? (
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                You haven't picked any {view} subjects yet.
              </Text>
            ) : (
              <View style={styles.subjectRow}>
                {visibleSubjects.map((s) => (
                  <View key={s.id} style={[styles.subjectChip, { backgroundColor: s.color + '15' }]}>
                    <Text style={styles.subjectChipEmoji}>{s.emoji}</Text>
                    <Text style={[Typography.bodySm, { color: colors.text }]}>{s.name}</Text>
                  </View>
                ))}
              </View>
            )}
          </JournalCard>

          {/* Instructions / Coming-soon note */}
          {view === 'NEET' ? (
            <StickyNote color="pink" rotation={1} delay={300}>
              <Text style={[Typography.bodySm, { color: colors.text, lineHeight: 20 }]}>
                {'•'} You can navigate between questions freely{'\n'}
                {'•'} Mark questions for review and come back{'\n'}
                {'•'} No feedback until you submit the entire exam{'\n'}
                {'•'} Timer starts as soon as you begin
              </Text>
            </StickyNote>
          ) : (
            <StickyNote color="yellow" rotation={1} delay={300}>
              <Text style={[Typography.bodySm, { color: colors.text, lineHeight: 20 }]}>
                Full CUET subject mocks are coming soon. For now, drill any subject in Quick Practice — same questions, instant feedback.
              </Text>
            </StickyNote>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            {view === 'NEET' ? (
              <PuffyButton title="Start Exam" onPress={handleStart} icon={'🚀'} />
            ) : (
              <PuffyButton title="Open Quick Practice" onPress={handleOpenQuickPractice} icon={'⚡'} />
            )}
            <PuffyButton title="Go Back" onPress={handleBack} variant="ghost" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </DotGridBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: Spacing.lg,
    gap: Spacing.lg,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  subjectRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  subjectChipEmoji: {
    fontSize: 18,
  },
  actions: {
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
});
