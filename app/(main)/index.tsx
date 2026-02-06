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
import { useRouter } from 'expo-router';
import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { StickyNote } from '../../src/components/ui/StickyNote';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography, Spacing } from '../../src/constants/theme';
import { getProfile, getUserSubjectIds, MedProfile } from '../../src/lib/database';
import { getSubjects, CatalogSubject } from '../../src/lib/catalog';
import { StrengthLevel, STRENGTH_LEVELS, NEEDS_FOCUS_CONFIG } from '../../src/types';

// Journey status with VaNi coaching language
interface SubjectJourney {
  subject: CatalogSubject;
  strengthLevel: StrengthLevel;
  chaptersCompleted: number;
  totalChapters: number;
  vaniMessage: string;
}

// VaNi coaching messages for each strength level
const VANI_MESSAGES: Record<StrengthLevel, string[]> = {
  'just-started': [
    "Let's begin your journey!",
    "Ready to explore together?",
    "Your adventure starts here!",
  ],
  'getting-there': [
    "You're building momentum!",
    "Great progress, keep going!",
    "I see your growth!",
  ],
  'on-track': [
    "You're doing amazing!",
    "Strong foundations built!",
    "Keep up the great work!",
  ],
  'strong': [
    "You're mastering this!",
    "Excellent command!",
    "Ready to conquer!",
  ],
  'needs-focus': [
    "Let's strengthen this together",
    "I'll help you improve here",
    "We'll work through this!",
  ],
};

function getVaniMessage(level: StrengthLevel): string {
  const messages = VANI_MESSAGES[level];
  return messages[Math.floor(Math.random() * messages.length)];
}

function getStrengthConfig(level: StrengthLevel) {
  if (level === 'needs-focus') return NEEDS_FOCUS_CONFIG;
  return STRENGTH_LEVELS.find(s => s.id === level) || STRENGTH_LEVELS[0];
}

export default function DashboardScreen() {
  const { colors, mode, toggle } = useTheme();
  const router = useRouter();
  const [profile, setProfile] = useState<MedProfile | null>(null);
  const [subjectJourneys, setSubjectJourneys] = useState<SubjectJourney[]>([]);

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

        // Create journey data for each subject
        // TODO: Fetch actual progress from DB once available
        const journeys: SubjectJourney[] = matched.map((subject) => ({
          subject,
          strengthLevel: 'just-started' as StrengthLevel, // Default for new users
          chaptersCompleted: 0,
          totalChapters: 10, // Placeholder, will come from curriculum
          vaniMessage: getVaniMessage('just-started'),
        }));

        setSubjectJourneys(journeys);
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

          {/* VaNi Greeting */}
          <StickyNote color="yellow" rotation={-0.5} delay={100}>
            <HandwrittenText variant="handSm">
              {profile?.display_name
                ? `Hi ${profile.display_name.split(' ')[0]}! I'm here to guide your journey.`
                : "Hi! I'm VaNi, your AI coach. Let's learn together!"}
            </HandwrittenText>
          </StickyNote>

          {/* Subject Journey Cards */}
          {subjectJourneys.length > 0 && (
            <View style={styles.journeySection}>
              <HandwrittenText variant="hand" rotation={-1}>
                Your Journey
              </HandwrittenText>

              <View style={styles.journeyGrid}>
                {subjectJourneys.map((journey, idx) => {
                  const config = getStrengthConfig(journey.strengthLevel);
                  return (
                    <Pressable
                      key={journey.subject.id}
                      style={styles.journeyCardWrap}
                      onPress={() => {
                        router.push(`/subject/${journey.subject.id}`);
                      }}
                    >
                      <JournalCard delay={200 + idx * 100}>
                        <View style={styles.journeyCardInner}>
                          {/* Subject Icon */}
                          <View
                            style={[
                              styles.journeyIconBg,
                              { backgroundColor: journey.subject.color + '20' },
                            ]}
                          >
                            <Text style={styles.journeyEmoji}>{journey.subject.emoji}</Text>
                          </View>

                          {/* Subject Name */}
                          <Text
                            style={[
                              Typography.h3,
                              { color: colors.text, marginTop: Spacing.sm },
                            ]}
                            numberOfLines={1}
                          >
                            {journey.subject.name}
                          </Text>

                          {/* Journey Status Badge */}
                          <View
                            style={[
                              styles.statusBadge,
                              { backgroundColor: config.color + '20' },
                            ]}
                          >
                            <View
                              style={[styles.statusDot, { backgroundColor: config.color }]}
                            />
                            <Text
                              style={[
                                Typography.bodySm,
                                { color: config.color, fontWeight: '600', fontSize: 12 },
                              ]}
                            >
                              {config.label}
                            </Text>
                          </View>

                          {/* VaNi Message */}
                          <Text
                            style={[
                              Typography.bodySm,
                              {
                                color: colors.textSecondary,
                                textAlign: 'center',
                                marginTop: Spacing.xs,
                                fontStyle: 'italic',
                              },
                            ]}
                          >
                            "{journey.vaniMessage}"
                          </Text>
                        </View>
                      </JournalCard>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.actionsSection}>
            <HandwrittenText variant="hand" rotation={0.5}>
              Quick Actions
            </HandwrittenText>

            <JournalCard delay={400} rotation={0.3}>
              <Pressable
                style={styles.actionRow}
                onPress={() => {
                  // TODO: Navigate to practice exam
                  // router.push('/practice-exam');
                }}
              >
                <Text style={styles.actionIcon}>{'\uD83C\uDFAF'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.h3, { color: colors.text }]}>
                    Practice Exam
                  </Text>
                  <Text
                    style={[
                      Typography.bodySm,
                      { color: colors.textSecondary, marginTop: 2 },
                    ]}
                  >
                    VaNi picks questions based on your progress
                  </Text>
                </View>
              </Pressable>
            </JournalCard>

            <JournalCard delay={500} rotation={-0.2}>
              <Pressable
                style={styles.actionRow}
                onPress={() => {
                  // TODO: Navigate to quick practice
                  // router.push('/quick-practice');
                }}
              >
                <Text style={styles.actionIcon}>{'\u26A1'}</Text>
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
              </Pressable>
            </JournalCard>
          </View>

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
  // Journey Section
  journeySection: {
    gap: Spacing.md,
  },
  journeyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  journeyCardWrap: {
    width: '47%',
  },
  journeyCardInner: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  journeyIconBg: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  journeyEmoji: {
    fontSize: 28,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: Spacing.xs,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  // Actions Section
  actionsSection: {
    gap: Spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  actionIcon: {
    fontSize: 32,
  },
});
