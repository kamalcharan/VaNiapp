import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { PuffyButton } from '../../src/components/ui/PuffyButton';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { useAuth } from '../_layout';
import { useOnboarding } from './_layout';

const logo = require('../../assets/logo.png');

// VaNi's dialogue screens
const VANI_SCREENS = [
  {
    id: 'intro',
    title: "Hey! I'm VaNi",
    subtitle: 'Your AI study companion',
    body: "I'll be with you every step of the way. Let me show you how we'll crack NEET together!",
    emoji: null, // Shows logo
    highlight: null,
  },
  {
    id: 'journey',
    title: 'Your Journey',
    subtitle: 'From Rookie to NEET Ready',
    body: "You're starting as a Rookie. I'll give you easy questions first - no stress! As you improve, I'll unlock harder challenges.",
    emoji: '🗺️',
    highlight: {
      type: 'stages',
      stages: [
        { label: 'Rookie', emoji: '🌱', active: true },
        { label: 'Learner', emoji: '🌿', active: false },
        { label: 'Achiever', emoji: '🌳', active: false },
        { label: 'NEET Ready', emoji: '🏆', active: false },
      ],
    },
  },
  {
    id: 'tracking',
    title: 'I Track Everything',
    subtitle: 'So you focus on what matters',
    body: "Every question you answer teaches me about your strengths and weaknesses. I'll make sure you spend time where it counts.",
    emoji: '📊',
    highlight: {
      type: 'features',
      items: [
        { emoji: '✅', text: 'Chapter-wise progress' },
        { emoji: '🎯', text: 'Weak topic alerts' },
        { emoji: '📈', text: 'Accuracy trends' },
      ],
    },
  },
  {
    id: 'elimination',
    title: 'My Secret Weapon',
    subtitle: 'The Elimination Technique',
    body: "When you're stuck, don't guess randomly! Long-press any option and I'll help you eliminate wrong answers - just like toppers do.",
    emoji: '💡',
    highlight: {
      type: 'demo',
    },
  },
  {
    id: 'ready',
    title: "You're All Set!",
    subtitle: "Let's begin your journey",
    body: "Remember - I'm always here if you need help. Tap the VaNi button anytime to ask me anything!",
    emoji: '🎉',
    highlight: null,
  },
];

export default function GettingStartedScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const onboarding = useOnboarding();
  const [currentScreen, setCurrentScreen] = useState(0);

  // Only set step if we're in onboarding flow (not from profile "About VaNi")
  useEffect(() => {
    if (onboarding?.setStep) {
      try {
        onboarding.setStep(7);
      } catch {
        // Accessed from outside onboarding flow - ignore
      }
    }
  }, []);

  const firstName =
    user?.user_metadata?.full_name?.split(' ')[0] ||
    user?.user_metadata?.name?.split(' ')[0] ||
    'there';

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Logo float animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, {
          toValue: -8,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(logoFloat, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const animateTransition = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentScreen < VANI_SCREENS.length - 1) {
      animateTransition(() => setCurrentScreen(currentScreen + 1));
    }
  };

  const handleFinish = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // If we can go back (came from profile), go back; otherwise go to main
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(main)');
    }
  };

  const screen = VANI_SCREENS[currentScreen];
  const isLast = currentScreen === VANI_SCREENS.length - 1;

  // Render highlight section based on type
  const renderHighlight = () => {
    if (!screen.highlight) return null;

    switch (screen.highlight.type) {
      case 'stages':
        return (
          <View style={styles.stagesContainer}>
            {screen.highlight.stages.map((stage, i) => (
              <View key={i} style={styles.stageRow}>
                <View
                  style={[
                    styles.stageDot,
                    {
                      backgroundColor: stage.active
                        ? colors.primary
                        : colors.surfaceBorder,
                    },
                  ]}
                />
                <View style={styles.stageContent}>
                  <Text style={styles.stageEmoji}>{stage.emoji}</Text>
                  <Text
                    style={[
                      Typography.body,
                      {
                        color: stage.active ? colors.primary : colors.text,
                        fontWeight: stage.active ? '600' : '400',
                      },
                    ]}
                  >
                    {stage.label}
                  </Text>
                  {stage.active && (
                    <View
                      style={[
                        styles.youAreBadge,
                        { backgroundColor: colors.primary + '20' },
                      ]}
                    >
                      <Text
                        style={[
                          Typography.bodySm,
                          { color: colors.primary, fontWeight: '600' },
                        ]}
                      >
                        You are here
                      </Text>
                    </View>
                  )}
                </View>
                {i < screen.highlight.stages.length - 1 && (
                  <View
                    style={[
                      styles.stageLine,
                      { backgroundColor: colors.surfaceBorder },
                    ]}
                  />
                )}
              </View>
            ))}
          </View>
        );

      case 'features':
        return (
          <View style={styles.featuresContainer}>
            {screen.highlight.items.map((item, i) => (
              <View key={i} style={styles.featureRow}>
                <Text style={styles.featureEmoji}>{item.emoji}</Text>
                <Text style={[Typography.body, { color: colors.text }]}>
                  {item.text}
                </Text>
              </View>
            ))}
          </View>
        );

      case 'demo':
        return (
          <View style={styles.demoContainer}>
            <View
              style={[
                styles.demoQuestion,
                { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
              ]}
            >
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                Which organelle produces ATP?
              </Text>
              <View style={styles.demoOptions}>
                <View style={styles.demoOption}>
                  <Text style={[Typography.bodySm, { color: colors.text }]}>
                    A) Mitochondria
                  </Text>
                </View>
                <View
                  style={[
                    styles.demoOption,
                    styles.demoOptionEliminated,
                    { backgroundColor: '#fee2e2' },
                  ]}
                >
                  <Text
                    style={[
                      Typography.bodySm,
                      { color: '#9ca3af', textDecorationLine: 'line-through' },
                    ]}
                  >
                    B) Ribosome
                  </Text>
                  <Text style={styles.eliminatedBadge}>✗</Text>
                </View>
                <View style={styles.demoOption}>
                  <Text style={[Typography.bodySm, { color: colors.text }]}>
                    C) Nucleus
                  </Text>
                </View>
                <View
                  style={[
                    styles.demoOption,
                    styles.demoOptionEliminated,
                    { backgroundColor: '#fee2e2' },
                  ]}
                >
                  <Text
                    style={[
                      Typography.bodySm,
                      { color: '#9ca3af', textDecorationLine: 'line-through' },
                    ]}
                  >
                    D) Golgi body
                  </Text>
                  <Text style={styles.eliminatedBadge}>✗</Text>
                </View>
              </View>
            </View>
            <HandwrittenText variant="handSm" color={colors.textSecondary}>
              Long-press to eliminate!
            </HandwrittenText>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* VaNi Avatar */}
          <View style={styles.avatarSection}>
            {screen.emoji ? (
              <View style={styles.emojiAvatar}>
                <Text style={styles.screenEmoji}>{screen.emoji}</Text>
              </View>
            ) : (
              <Animated.View
                style={[
                  styles.logoContainer,
                  { transform: [{ translateY: logoFloat }] },
                ]}
              >
                <Image source={logo} style={styles.logo} resizeMode="contain" />
              </Animated.View>
            )}
          </View>

          {/* Speech Bubble */}
          <JournalCard rotation={-0.3}>
            <View style={styles.speechContent}>
              {currentScreen === 0 && (
                <HandwrittenText variant="hand" color={colors.textSecondary}>
                  Hey {firstName}!
                </HandwrittenText>
              )}
              <Text style={[Typography.h2, { color: colors.text, textAlign: 'center' }]}>
                {screen.title}
              </Text>
              <Text
                style={[
                  Typography.bodyLg,
                  { color: colors.primary, textAlign: 'center' },
                ]}
              >
                {screen.subtitle}
              </Text>
              <Text
                style={[
                  Typography.body,
                  {
                    color: colors.textSecondary,
                    textAlign: 'center',
                    marginTop: Spacing.md,
                    lineHeight: 24,
                  },
                ]}
              >
                {screen.body}
              </Text>

              {renderHighlight()}
            </View>
          </JournalCard>

          {/* Progress Dots */}
          <View style={styles.dots}>
            {VANI_SCREENS.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      i === currentScreen ? colors.primary : colors.dotGrid,
                    width: i === currentScreen ? 24 : 8,
                  },
                ]}
              />
            ))}
          </View>

          {/* CTA */}
          <View style={styles.footer}>
            {isLast ? (
              <PuffyButton
                title="Start Practicing!"
                icon="🚀"
                onPress={handleFinish}
              />
            ) : (
              <PuffyButton title="Next" onPress={handleNext} />
            )}

            {!isLast && (
              <Pressable onPress={handleFinish} style={styles.skipBtn}>
                <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                  Skip intro
                </Text>
              </Pressable>
            )}
          </View>
        </Animated.View>
      </SafeAreaView>
    </DotGridBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
  emojiAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenEmoji: {
    fontSize: 40,
  },
  speechContent: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },

  // Stages
  stagesContainer: {
    marginTop: Spacing.lg,
    width: '100%',
    paddingLeft: Spacing.md,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
  },
  stageDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: Spacing.md,
    zIndex: 1,
  },
  stageLine: {
    position: 'absolute',
    left: 5,
    top: 16,
    width: 2,
    height: 28,
  },
  stageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
    flex: 1,
  },
  stageEmoji: {
    fontSize: 20,
  },
  youAreBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginLeft: 'auto',
  },

  // Features
  featuresContainer: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
    width: '100%',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureEmoji: {
    fontSize: 20,
  },

  // Demo
  demoContainer: {
    marginTop: Spacing.lg,
    width: '100%',
    alignItems: 'center',
    gap: Spacing.md,
  },
  demoQuestion: {
    width: '100%',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  demoOptions: {
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  demoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  demoOptionEliminated: {
    opacity: 0.8,
  },
  eliminatedBadge: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 14,
  },

  // Dots
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },

  // Footer
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    gap: Spacing.md,
    paddingTop: Spacing.xl,
  },
  skipBtn: {
    padding: Spacing.sm,
  },
});
