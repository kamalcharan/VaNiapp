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

// Mock chapters data - will come from DB/catalog later
const PHYSICS_CHAPTERS = [
  { id: 'units-measurements', name: 'Units and Measurements', order: 1 },
  { id: 'motion-straight-line', name: 'Motion in a Straight Line', order: 2 },
  { id: 'motion-plane', name: 'Motion in a Plane', order: 3 },
  { id: 'laws-of-motion', name: 'Laws of Motion', order: 4 },
  { id: 'work-energy-power', name: 'Work, Energy and Power', order: 5 },
  { id: 'rotational-motion', name: 'Rotational Motion', order: 6 },
  { id: 'gravitation', name: 'Gravitation', order: 7 },
  { id: 'mechanical-properties', name: 'Mechanical Properties of Solids', order: 8 },
];

interface ChapterProgress {
  chapterId: string;
  coverage: number;
  accuracy: number;
  lastPracticed: string | null;
}

function getStrengthConfig(level: StrengthLevel) {
  if (level === 'needs-focus') return NEEDS_FOCUS_CONFIG;
  return STRENGTH_LEVELS.find((s) => s.id === level) || STRENGTH_LEVELS[0];
}

export default function SubjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const [subject, setSubject] = useState<CatalogSubject | null>(null);
  const [hasProgress, setHasProgress] = useState(false);
  const [chapterProgress, setChapterProgress] = useState<ChapterProgress[]>([]);
  const [showChapterPicker, setShowChapterPicker] = useState(false);

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
      // For now, simulating no progress (first time user)
      setHasProgress(false);
      setChapterProgress([]);
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

  const handleStartChapter = (chapterId: string) => {
    // TODO: Navigate to chapter evaluation
    // router.push(`/chapter/${chapterId}/evaluate`);
    console.log('Start chapter:', chapterId);
  };

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

  // Get recommended chapter (first one for new users, or based on progress)
  const recommendedChapter = PHYSICS_CHAPTERS[0];

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
          </View>

          {/* FIRST TIME USER FLOW */}
          {!hasProgress && !showChapterPicker && (
            <>
              {/* VaNi Welcome Message */}
              <StickyNote color="yellow" rotation={-0.5} delay={100}>
                <HandwrittenText variant="handSm">
                  Welcome to {subject.name}! I'm excited to guide you through this journey.
                </HandwrittenText>
              </StickyNote>

              {/* VaNi's Recommendation */}
              <JournalCard delay={200}>
                <View style={styles.recommendationCard}>
                  <HandwrittenText variant="hand">
                    Let's get started!
                  </HandwrittenText>

                  <Text style={[Typography.body, { color: colors.textSecondary, marginTop: Spacing.sm }]}>
                    I recommend starting with the first chapter - it builds the foundation for everything else.
                  </Text>

                  {/* Primary CTA */}
                  <Pressable
                    style={[styles.primaryButton, { backgroundColor: subject.color }]}
                    onPress={() => handleStartChapter(recommendedChapter.id)}
                  >
                    <Text style={styles.primaryButtonText}>
                      Start with "{recommendedChapter.name}"
                    </Text>
                  </Pressable>

                  {/* Secondary Option */}
                  <Pressable
                    style={styles.secondaryButton}
                    onPress={() => setShowChapterPicker(true)}
                  >
                    <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                      Or pick a different chapter
                    </Text>
                  </Pressable>
                </View>
              </JournalCard>

              {/* VaNi Tip */}
              <StickyNote color="teal" rotation={0.5} delay={300}>
                <HandwrittenText variant="handSm">
                  Tip: Complete chapter evaluations to track your progress and unlock harder question types!
                </HandwrittenText>
              </StickyNote>
            </>
          )}

          {/* CHAPTER PICKER */}
          {!hasProgress && showChapterPicker && (
            <>
              <StickyNote color="yellow" rotation={-0.5} delay={100}>
                <HandwrittenText variant="handSm">
                  Which chapter are you currently studying? Pick one and let's begin!
                </HandwrittenText>
              </StickyNote>

              <View style={styles.chapterList}>
                <HandwrittenText variant="hand">
                  Pick a chapter
                </HandwrittenText>

                {PHYSICS_CHAPTERS.map((chapter, idx) => (
                  <JournalCard key={chapter.id} delay={150 + idx * 50}>
                    <Pressable
                      style={styles.chapterItem}
                      onPress={() => handleStartChapter(chapter.id)}
                    >
                      <View style={[styles.chapterNumber, { backgroundColor: subject.color + '20' }]}>
                        <Text style={[Typography.bodySm, { color: subject.color, fontWeight: '700' }]}>
                          {chapter.order}
                        </Text>
                      </View>
                      <Text style={[Typography.body, { color: colors.text, flex: 1 }]}>
                        {chapter.name}
                      </Text>
                      <Text style={{ color: colors.textTertiary }}>{'\u203A'}</Text>
                    </Pressable>
                  </JournalCard>
                ))}

                {/* Back to recommendation */}
                <Pressable
                  style={styles.backToRecommendation}
                  onPress={() => setShowChapterPicker(false)}
                >
                  <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                    {'\u2190'} Back to VaNi's recommendation
                  </Text>
                </Pressable>
              </View>
            </>
          )}

          {/* RETURNING USER FLOW (has progress) */}
          {hasProgress && (
            <>
              {/* Progress Summary */}
              <JournalCard delay={100}>
                <View style={styles.progressSummary}>
                  <HandwrittenText variant="hand">
                    Your Progress
                  </HandwrittenText>

                  {/* TODO: Show actual progress stats */}
                  <View style={styles.progressStats}>
                    <View style={styles.statItem}>
                      <Text style={[Typography.h2, { color: subject.color }]}>3</Text>
                      <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                        Chapters{'\n'}Started
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={[Typography.h2, { color: subject.color }]}>68%</Text>
                      <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                        Average{'\n'}Accuracy
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={[Typography.h2, { color: subject.color }]}>1</Text>
                      <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                        Chapter{'\n'}Strong
                      </Text>
                    </View>
                  </View>
                </View>
              </JournalCard>

              {/* VaNi's Suggestion */}
              <StickyNote color="yellow" rotation={-0.5} delay={200}>
                <HandwrittenText variant="handSm">
                  You're doing great! I suggest continuing with "Motion in a Plane" - you're almost there!
                </HandwrittenText>
              </StickyNote>

              {/* Primary CTA */}
              <JournalCard delay={300}>
                <Pressable
                  style={[styles.continueButton, { backgroundColor: subject.color }]}
                  onPress={() => handleStartChapter('motion-plane')}
                >
                  <Text style={styles.primaryButtonText}>
                    Continue "Motion in a Plane"
                  </Text>
                </Pressable>
              </JournalCard>

              {/* Secondary Options */}
              <View style={styles.secondaryOptions}>
                <Pressable
                  style={[styles.optionButton, { borderColor: colors.border }]}
                  onPress={() => setShowChapterPicker(true)}
                >
                  <Text style={[Typography.bodySm, { color: colors.text }]}>
                    View All Chapters
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.optionButton, { borderColor: colors.border }]}
                  onPress={() => {
                    // TODO: Quick practice for this subject
                  }}
                >
                  <Text style={[Typography.bodySm, { color: colors.text }]}>
                    Quick Practice
                  </Text>
                </Pressable>
              </View>
            </>
          )}
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
  // Recommendation Card
  recommendationCard: {
    gap: Spacing.md,
    alignItems: 'center',
  },
  primaryButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 16,
    marginTop: Spacing.sm,
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
  },
  secondaryButton: {
    paddingVertical: Spacing.sm,
  },
  // Chapter List
  chapterList: {
    gap: Spacing.sm,
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  chapterNumber: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backToRecommendation: {
    alignSelf: 'center',
    paddingVertical: Spacing.md,
  },
  // Progress Summary
  progressSummary: {
    gap: Spacing.md,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.sm,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  continueButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
  },
  secondaryOptions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  optionButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
});
