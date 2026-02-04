import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { StickyNote } from '../../src/components/ui/StickyNote';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography, Spacing } from '../../src/constants/theme';
import { getProfile, getUserSubjectIds, MedProfile } from '../../src/lib/database';
import { getSubjects, CatalogSubject } from '../../src/lib/catalog';

export default function DashboardScreen() {
  const { colors, mode, toggle } = useTheme();
  const [profile, setProfile] = useState<MedProfile | null>(null);
  const [subjects, setSubjects] = useState<CatalogSubject[]>([]);

  useEffect(() => {
    (async () => {
      const [prof, subjectIds, allSubjects] = await Promise.all([
        getProfile(),
        getUserSubjectIds(),
        getSubjects(),
      ]);
      setProfile(prof);

      if (subjectIds.length > 0 && allSubjects.length > 0) {
        const matched = subjectIds
          .map((id) => allSubjects.find((s) => s.id === id))
          .filter(Boolean) as CatalogSubject[];
        setSubjects(matched);
      }
    })();
  }, []);

  // Entrance animation
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const greeting = profile?.display_name
    ? `Hey, ${profile.display_name.split(' ')[0]}`
    : 'Study Board';

  const examLabel =
    profile?.exam === 'BOTH'
      ? 'NEET + CUET'
      : profile?.exam ?? 'NEET';

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[Typography.label, { color: colors.textTertiary }]}>
                {examLabel} PREP
              </Text>
              <Text style={[Typography.h1, { color: colors.text, marginTop: 4 }]}>
                {greeting}
              </Text>
            </View>
            <Pressable onPress={toggle} style={styles.themeToggle}>
              <Text style={styles.themeEmoji}>
                {mode === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19'}
              </Text>
            </Pressable>
          </View>

          {/* Mode Cards */}
          <View style={styles.modeSection}>
            <HandwrittenText variant="hand" rotation={-1}>
              Pick a mode
            </HandwrittenText>
            <View style={styles.modeCards}>
              <View style={styles.modeCardWrap}>
                <JournalCard delay={100}>
                  <View style={styles.modeCardInner}>
                    <Text style={styles.modeIcon}>{'\uD83D\uDCD6'}</Text>
                    <Text style={[Typography.h3, { color: colors.text, textAlign: 'center' }]}>
                      Chapter{'\n'}Exam
                    </Text>
                    <Text
                      style={[
                        Typography.bodySm,
                        { color: colors.textSecondary, textAlign: 'center', marginTop: 6 },
                      ]}
                    >
                      25 Qs per chapter{'\n'}Instant feedback
                    </Text>
                  </View>
                </JournalCard>
              </View>

              <View style={styles.modeCardWrap}>
                <JournalCard delay={200}>
                  <View style={styles.modeCardInner}>
                    <Text style={styles.modeIcon}>{'\uD83C\uDFAF'}</Text>
                    <Text style={[Typography.h3, { color: colors.text, textAlign: 'center' }]}>
                      Practice{'\n'}Exam
                    </Text>
                    <Text
                      style={[
                        Typography.bodySm,
                        { color: colors.textSecondary, textAlign: 'center', marginTop: 6 },
                      ]}
                    >
                      200 Qs, 3h 20m{'\n'}NEET format
                    </Text>
                  </View>
                </JournalCard>
              </View>
            </View>

            <JournalCard delay={300} rotation={0.3}>
              <View style={styles.quickRow}>
                <Text style={styles.quickIcon}>{'\u26A1'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.h3, { color: colors.text }]}>
                    Quick Practice
                  </Text>
                  <Text
                    style={[
                      Typography.bodySm,
                      { color: colors.textSecondary, marginTop: 2 },
                    ]}
                  >
                    20 questions. No timer. Pure focus.
                  </Text>
                </View>
              </View>
            </JournalCard>
          </View>

          {/* Subjects */}
          {subjects.length > 0 && (
            <>
              <HandwrittenText variant="hand" rotation={-1}>
                Your subjects
              </HandwrittenText>

              <View style={styles.subjectGrid}>
                {subjects.map((subj, idx) => (
                  <View key={subj.id} style={styles.subjectWrap}>
                    <JournalCard delay={400 + idx * 80}>
                      <View style={styles.subjectCardInner}>
                        <View
                          style={[
                            styles.subjectIconBg,
                            { backgroundColor: subj.color + '20' },
                          ]}
                        >
                          <Text style={styles.subjectEmoji}>{subj.emoji}</Text>
                        </View>
                        <Text
                          style={[
                            Typography.h3,
                            {
                              color: colors.text,
                              marginTop: Spacing.sm,
                              textAlign: 'center',
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {subj.name}
                        </Text>
                      </View>
                    </JournalCard>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Coming Soon */}
          <StickyNote color="teal" rotation={0.5} delay={500}>
            <HandwrittenText variant="handSm">
              Questions, analytics, and study gang features coming soon!
            </HandwrittenText>
          </StickyNote>
        </Animated.ScrollView>
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
    gap: Spacing.xl,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  themeToggle: {
    padding: Spacing.sm,
  },
  themeEmoji: {
    fontSize: 24,
  },
  modeSection: {
    gap: Spacing.md,
  },
  modeCards: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modeCardWrap: {
    flex: 1,
  },
  modeCardInner: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  modeIcon: {
    fontSize: 36,
    marginBottom: Spacing.sm,
  },
  quickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  quickIcon: {
    fontSize: 32,
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  subjectWrap: {
    width: '47%',
  },
  subjectCardInner: {
    alignItems: 'center',
  },
  subjectIconBg: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectEmoji: {
    fontSize: 28,
  },
});
