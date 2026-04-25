import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';

import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { getProfile, getUserSubjectIds, MedProfile } from '../../src/lib/database';
import { getSubjects, CatalogSubject } from '../../src/lib/catalog';
import { ExamType } from '../../src/types';
import { RootState } from '../../src/store';

type ExamFocus = 'NEET' | 'CUET';

export default function QuickPracticeIntroScreen() {
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

  // For BOTH users, narrow to the focused exam. Otherwise show every subject the
  // user picked. CUET-only users see only CUET electives, NEET-only see the 4.
  const visibleSubjects = isBoth
    ? subjects.filter((s) => s.exam_id === examFocus)
    : subjects;

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Top Bar */}
        <View style={[styles.topBar, { borderBottomColor: colors.surfaceBorder }]}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
            <Text style={[styles.backArrow, { color: colors.text }]}>{'<'}</Text>
          </Pressable>
          <Text style={[Typography.h3, { color: colors.text }]}>Quick Practice</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>{'⚡'}</Text>
            <HandwrittenText variant="hand" rotation={-1}>
              Pick a subject
            </HandwrittenText>
            <Text style={[Typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm }]}>
              20 questions. 10 minutes. Let's go!
            </Text>
            {isBoth && (
              <Text style={[Typography.bodySm, { color: colors.textTertiary, textAlign: 'center', marginTop: 4 }]}>
                Showing your {examFocus} subjects
              </Text>
            )}
          </View>

          {/* Subject Cards */}
          {loading ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : visibleSubjects.length === 0 ? (
            <JournalCard delay={100}>
              <Text style={[Typography.body, { color: colors.text, textAlign: 'center' }]}>
                You haven't picked any {isBoth ? examFocus : exam} subjects yet.
              </Text>
              <Pressable onPress={() => router.push('/edit-subjects')} style={{ marginTop: Spacing.md, alignSelf: 'center' }}>
                <Text style={[Typography.bodySm, { color: colors.primary, fontWeight: '600' }]}>
                  Pick subjects {'›'}
                </Text>
              </Pressable>
            </JournalCard>
          ) : (
            <View style={styles.grid}>
              {visibleSubjects.map((subject, idx) => (
                <Pressable
                  key={subject.id}
                  style={styles.cardWrap}
                  onPress={() =>
                    router.push({
                      pathname: '/quick-practice/quiz',
                      params: { subjectId: subject.id },
                    })
                  }
                >
                  <JournalCard delay={100 + idx * 80} style={styles.card}>
                    <View style={[styles.iconBg, { backgroundColor: subject.color + '20' }]}>
                      <Text style={styles.emoji}>{subject.emoji}</Text>
                    </View>
                    <Text style={[Typography.h3, { color: colors.text, marginTop: Spacing.sm }]} numberOfLines={1}>
                      {subject.name}
                    </Text>
                    <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 4 }]}>
                      20 random Qs
                    </Text>
                  </JournalCard>
                </Pressable>
              ))}
            </View>
          )}

          {/* Info */}
          <JournalCard delay={500} rotation={0.5}>
            <Text style={[Typography.label, { color: colors.textTertiary, marginBottom: Spacing.sm }]}>
              HOW IT WORKS
            </Text>
            <Text style={[Typography.body, { color: colors.textSecondary, lineHeight: 22 }]}>
              {'•'} 20 random questions from the subject{'\n'}
              {'•'} 10-minute countdown timer{'\n'}
              {'•'} Instant feedback after each answer{'\n'}
              {'•'} See your score at the end
            </Text>
          </JournalCard>
        </ScrollView>
      </SafeAreaView>
    </DotGridBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 20,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.xl,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    gap: 4,
  },
  headerEmoji: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  cardWrap: {
    width: '47%',
  },
  card: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  iconBg: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 28,
  },
});
