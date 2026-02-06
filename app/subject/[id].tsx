import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { StickyNote } from '../../src/components/ui/StickyNote';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography, Spacing } from '../../src/constants/theme';
import { getSubjects, CatalogSubject } from '../../src/lib/catalog';
import {
  StrengthLevel,
  STRENGTH_LEVELS,
  NEEDS_FOCUS_CONFIG,
} from '../../src/types';

// VaNi coaching messages for subject journey
const VANI_SUBJECT_MESSAGES: Record<StrengthLevel, string[]> = {
  'just-started': [
    "Every expert was once a beginner. Let's start your journey here!",
    "This is the beginning of something great. I'll guide you every step.",
    "Small steps lead to big achievements. Ready to begin?",
  ],
  'getting-there': [
    "You're making real progress! I can see you putting in the work.",
    "Your foundation is getting stronger. Keep this momentum!",
    "You're on the right path. Let's keep building together!",
  ],
  'on-track': [
    "Amazing progress! Your hard work is really paying off.",
    "You're doing wonderfully! Let's keep pushing forward.",
    "Your dedication shows. You're becoming stronger every day!",
  ],
  'strong': [
    "You've mastered so much here! I'm proud of your journey.",
    "This is your strong suit! Let's keep sharpening these skills.",
    "Excellent command! You're ready for any challenge here.",
  ],
  'needs-focus': [
    "This needs a bit more attention, and that's okay. I'm here to help!",
    "Let's work together to strengthen this area. You've got this!",
    "Every challenge is an opportunity. Let's tackle this together!",
  ],
};

function getVaniSubjectMessage(level: StrengthLevel): string {
  const messages = VANI_SUBJECT_MESSAGES[level];
  return messages[Math.floor(Math.random() * messages.length)];
}

function getStrengthConfig(level: StrengthLevel) {
  if (level === 'needs-focus') return NEEDS_FOCUS_CONFIG;
  return STRENGTH_LEVELS.find((s) => s.id === level) || STRENGTH_LEVELS[0];
}

// Journey stage descriptions for VaNi's coaching
const JOURNEY_DESCRIPTIONS: Record<StrengthLevel, string> = {
  'just-started': 'Beginning your journey',
  'getting-there': 'Building strong foundations',
  'on-track': 'Making excellent progress',
  'strong': 'Mastering the subject',
  'needs-focus': 'Needs a little extra attention',
};

export default function SubjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const [subject, setSubject] = useState<CatalogSubject | null>(null);
  const [strengthLevel, setStrengthLevel] = useState<StrengthLevel>('just-started');
  const [chaptersCompleted, setChaptersCompleted] = useState(0);
  const [totalChapters, setTotalChapters] = useState(10);

  // Animation
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    (async () => {
      const allSubjects = await getSubjects();
      const found = allSubjects.find((s) => s.id === id);
      if (found) {
        setSubject(found);
      }

      // TODO: Fetch actual progress from DB
      // For now, using placeholder data
      setStrengthLevel('just-started');
      setChaptersCompleted(0);
      setTotalChapters(10);
    })();

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
  }, [id]);

  if (!subject) {
    return (
      <DotGridBackground>
        <SafeAreaView style={styles.container}>
          <Text style={[Typography.body, { color: colors.text }]}>
            Loading...
          </Text>
        </SafeAreaView>
      </DotGridBackground>
    );
  }

  const config = getStrengthConfig(strengthLevel);
  const vaniMessage = getVaniSubjectMessage(strengthLevel);

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}
        >
          {/* Back Button */}
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={[Typography.body, { color: colors.textSecondary }]}>
              {'\u2190'} Back
            </Text>
          </Pressable>

          {/* Subject Header */}
          <View style={styles.header}>
            <View
              style={[
                styles.subjectIconBg,
                { backgroundColor: subject.color + '20' },
              ]}
            >
              <Text style={styles.subjectEmoji}>{subject.emoji}</Text>
            </View>
            <Text style={[Typography.h1, { color: colors.text, marginTop: Spacing.md }]}>
              {subject.name}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: config.color + '20' }]}>
              <View style={[styles.statusDot, { backgroundColor: config.color }]} />
              <Text style={[Typography.bodySm, { color: config.color, fontWeight: '600' }]}>
                {config.label}
              </Text>
            </View>
          </View>

          {/* VaNi Coaching Message */}
          <StickyNote color="yellow" rotation={-0.5} delay={100}>
            <HandwrittenText variant="handSm">
              {vaniMessage}
            </HandwrittenText>
          </StickyNote>

          {/* Journey Progress Card */}
          <JournalCard delay={200}>
            <View style={styles.progressCard}>
              <HandwrittenText variant="hand">
                Your Journey
              </HandwrittenText>

              <View style={styles.progressInfo}>
                <Text style={[Typography.h2, { color: config.color }]}>
                  {JOURNEY_DESCRIPTIONS[strengthLevel]}
                </Text>

                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: config.color,
                        width: `${Math.min((chaptersCompleted / totalChapters) * 100, 100)}%`,
                      },
                    ]}
                  />
                </View>

                <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                  {chaptersCompleted} of {totalChapters} chapters explored
                </Text>
              </View>

              {/* What's unlocked */}
              <View style={styles.unlockedSection}>
                <Text style={[Typography.bodySm, { color: colors.textTertiary, marginBottom: Spacing.xs }]}>
                  Question types available to you:
                </Text>
                <View style={styles.typeChips}>
                  {config.unlockedTypes.map((type) => (
                    <View key={type} style={[styles.typeChip, { backgroundColor: colors.surface }]}>
                      <Text style={[Typography.bodySm, { color: colors.textSecondary, fontSize: 11 }]}>
                        {formatQuestionType(type)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </JournalCard>

          {/* Actions */}
          <View style={styles.actionsSection}>
            <HandwrittenText variant="hand" rotation={0.5}>
              What would you like to do?
            </HandwrittenText>

            <JournalCard delay={300} rotation={0.3}>
              <Pressable
                style={styles.actionRow}
                onPress={() => {
                  // TODO: Navigate to chapter evaluation
                  // router.push(`/subject/${id}/chapters`);
                }}
              >
                <Text style={styles.actionIcon}>{'\uD83D\uDCD6'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.h3, { color: colors.text }]}>
                    Chapter Evaluation
                  </Text>
                  <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 2 }]}>
                    Practice specific chapters to build mastery
                  </Text>
                </View>
              </Pressable>
            </JournalCard>

            <JournalCard delay={400} rotation={-0.2}>
              <Pressable
                style={styles.actionRow}
                onPress={() => {
                  // TODO: Navigate to quick practice
                  // router.push(`/subject/${id}/quick-practice`);
                }}
              >
                <Text style={styles.actionIcon}>{'\u26A1'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.h3, { color: colors.text }]}>
                    Quick Practice
                  </Text>
                  <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 2 }]}>
                    20 questions from this subject. VaNi picks the mix!
                  </Text>
                </View>
              </Pressable>
            </JournalCard>

            <JournalCard delay={500} rotation={0.1}>
              <Pressable
                style={styles.actionRow}
                onPress={() => {
                  // TODO: View chapter list
                  // router.push(`/subject/${id}/chapters`);
                }}
              >
                <Text style={styles.actionIcon}>{'\uD83D\uDDC2\uFE0F'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.h3, { color: colors.text }]}>
                    View Chapters
                  </Text>
                  <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 2 }]}>
                    See all chapters and your progress in each
                  </Text>
                </View>
              </Pressable>
            </JournalCard>
          </View>

          {/* VaNi Tip */}
          <StickyNote color="teal" rotation={0.5} delay={600}>
            <HandwrittenText variant="handSm">
              Tip: Complete chapter evaluations to unlock more question types and harder difficulties!
            </HandwrittenText>
          </StickyNote>
        </Animated.ScrollView>
      </SafeAreaView>
    </DotGridBackground>
  );
}

// Helper to format question type for display
function formatQuestionType(type: string): string {
  const formats: Record<string, string> = {
    'mcq': 'MCQ',
    'true-false': 'True/False',
    'assertion-reasoning': 'A&R',
    'match-the-following': 'Match',
    'fill-in-blanks': 'Fill Blanks',
    'scenario-based': 'Scenario',
    'diagram-based': 'Diagram',
    'logical-sequence': 'Sequence',
  };
  return formats[type] || type;
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
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.xs,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  subjectIconBg: {
    width: 80,
    height: 80,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectEmoji: {
    fontSize: 40,
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
  progressCard: {
    gap: Spacing.md,
  },
  progressInfo: {
    gap: Spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  unlockedSection: {
    marginTop: Spacing.sm,
  },
  typeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  typeChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
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
