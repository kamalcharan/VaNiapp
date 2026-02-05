import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  ViewToken,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { WashiTape } from '../../src/components/ui/WashiTape';
import { PuffyButton } from '../../src/components/ui/PuffyButton';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';

const { width } = Dimensions.get('window');
const logo = require('../../assets/logo.png');

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Per-page entrance animations
  const pageAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const animatedPages = useRef(new Set<number>()).current;

  // Continuous logo float
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Dot width animations
  const dotWidths = useRef([
    new Animated.Value(24),
    new Animated.Value(8),
    new Animated.Value(8),
    new Animated.Value(8),
  ]).current;

  useEffect(() => {
    // Animate page 1 in immediately
    animatedPages.add(0);
    Animated.timing(pageAnims[0], {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Gentle logo float
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    // Animate page in on first visit
    if (!animatedPages.has(currentIndex)) {
      animatedPages.add(currentIndex);
      Animated.timing(pageAnims[currentIndex], {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }

    // Animate dot widths
    dotWidths.forEach((dot, i) => {
      Animated.spring(dot, {
        toValue: i === currentIndex ? 24 : 8,
        damping: 15,
        stiffness: 150,
        useNativeDriver: false,
      }).start();
    });
  }, [currentIndex]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentIndex < 3) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleGetStarted = () => {
    router.push('/(auth)/sign-in');
  };

  // ─── Page 1: The Pain Point ─────────────────────────────────
  const renderPainPoint = () => {
    const anim = pageAnims[0];
    return (
      <View style={[styles.page, { width }]}>
        <Animated.View
          style={[
            styles.pageContent,
            {
              opacity: anim,
              transform: [
                {
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.emojiRow}>
            <Text style={styles.emoji}>😰</Text>
            <Text style={styles.emojiArrow}>→</Text>
            <Text style={styles.emoji}>📚</Text>
            <Text style={styles.emojiArrow}>→</Text>
            <Text style={styles.emoji}>😫</Text>
          </View>

          <JournalCard rotation={-0.5}>
            <View style={styles.cardInner}>
              <HandwrittenText variant="handLg" color={colors.text}>
                NEET & CUET prep is hard
              </HandwrittenText>

              <Text style={[Typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.md }]}>
                Months of effort. Endless syllabus.{'\n'}Where do you even start?
              </Text>

              <View style={[styles.highlightBox, { backgroundColor: colors.highlighterYellow + '40' }]}>
                <HandwrittenText variant="handSm" color={colors.textSecondary}>
                  Most students feel lost without the right guidance...
                </HandwrittenText>
              </View>
            </View>
          </JournalCard>
        </Animated.View>
      </View>
    );
  };

  // ─── Page 2: Meet VaNi ──────────────────────────────────────
  const renderMeetVani = () => {
    const anim = pageAnims[1];
    return (
      <View style={[styles.page, { width }]}>
        <Animated.View
          style={[
            styles.pageContent,
            {
              opacity: anim,
              transform: [
                {
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.tapeRow}>
            <WashiTape rotation={4} width={65} />
            <WashiTape rotation={-3} width={45} />
          </View>

          <Animated.View
            style={[
              styles.logoWrap,
              { transform: [{ translateY: floatAnim }] },
            ]}
          >
            <Image source={logo} style={styles.vaniLogo} resizeMode="contain" />
          </Animated.View>

          <JournalCard rotation={0.5}>
            <View style={styles.cardInner}>
              <HandwrittenText variant="handLg" color={colors.text}>
                Meet VaNi
              </HandwrittenText>
              <Text style={[Typography.bodyLg, { color: colors.primary, textAlign: 'center' }]}>
                Your AI companion
              </Text>

              <Text style={[Typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.md }]}>
                She's here to guide and elevate you{'\n'}to your goal, step-by-step.
              </Text>

              <View style={[styles.highlightBox, { backgroundColor: colors.highlighterTeal + '40' }]}>
                <HandwrittenText variant="handSm" color={colors.textSecondary}>
                  No random studying. VaNi has a plan for you!
                </HandwrittenText>
              </View>
            </View>
          </JournalCard>
        </Animated.View>
      </View>
    );
  };

  // ─── Page 3: The Journey/Stages ─────────────────────────────
  const renderStages = () => {
    const anim = pageAnims[2];
    const stagger = (delay: number) => ({
      opacity: anim,
      transform: [
        {
          translateX: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [-20, 0],
          }),
        },
      ],
    });

    return (
      <View style={[styles.page, { width }]}>
        <Animated.View
          style={[
            styles.pageContent,
            {
              opacity: anim,
              transform: [
                {
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.stagesHeader}>
            <Text style={styles.stagesEmoji}>🌱</Text>
            <Text style={styles.stagesArrow}>→</Text>
            <Text style={styles.stagesEmoji}>🌿</Text>
            <Text style={styles.stagesArrow}>→</Text>
            <Text style={styles.stagesEmoji}>🌳</Text>
            <Text style={styles.stagesArrow}>→</Text>
            <Text style={styles.stagesEmoji}>🏆</Text>
          </View>

          <JournalCard rotation={-0.3}>
            <View style={styles.cardInner}>
              <HandwrittenText variant="handLg" color={colors.text}>
                Grow at your own pace
              </HandwrittenText>

              <View style={styles.stagesList}>
                <Animated.View style={[styles.stageItem, stagger(0)]}>
                  <View style={[styles.stageDot, { backgroundColor: colors.highlighterYellow }]} />
                  <Text style={[Typography.body, { color: colors.text }]}>Start easy, build confidence</Text>
                </Animated.View>

                <Animated.View style={[styles.stageItem, stagger(100)]}>
                  <View style={[styles.stageDot, { backgroundColor: colors.highlighterTeal }]} />
                  <Text style={[Typography.body, { color: colors.text }]}>Unlock harder questions as you improve</Text>
                </Animated.View>

                <Animated.View style={[styles.stageItem, stagger(200)]}>
                  <View style={[styles.stageDot, { backgroundColor: colors.highlighterPink }]} />
                  <Text style={[Typography.body, { color: colors.text }]}>Track progress across all chapters</Text>
                </Animated.View>

                <Animated.View style={[styles.stageItem, stagger(300)]}>
                  <View style={[styles.stageDot, { backgroundColor: colors.primary }]} />
                  <Text style={[Typography.body, { color: colors.text, fontWeight: '600' }]}>Ready to capture the world!</Text>
                </Animated.View>
              </View>
            </View>
          </JournalCard>
        </Animated.View>
      </View>
    );
  };

  // ─── Page 4: Elimination Technique + CTA ────────────────────
  const renderElimination = () => {
    const anim = pageAnims[3];
    return (
      <View style={[styles.page, { width }]}>
        <Animated.View
          style={[
            styles.pageContent,
            {
              opacity: anim,
              transform: [
                {
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.eliminationHeader}>
            <Text style={styles.emoji}>❌</Text>
            <Text style={styles.emojiArrow}>→</Text>
            <Text style={styles.emoji}>💡</Text>
            <Text style={styles.emojiArrow}>→</Text>
            <Text style={styles.emoji}>✅</Text>
          </View>

          <JournalCard rotation={0.3}>
            <View style={styles.cardInner}>
              <HandwrittenText variant="handLg" color={colors.text}>
                Learn to eliminate
              </HandwrittenText>

              <Text style={[Typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm }]}>
                Don't know the answer? No problem!
              </Text>

              {/* Mock question preview */}
              <View style={styles.mockQuestion}>
                <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Which organelle...?</Text>
                <View style={styles.mockOptions}>
                  <View style={styles.mockOption}>
                    <Text style={[Typography.bodySm, { color: colors.text }]}>A) Mitochondria</Text>
                  </View>
                  <View style={[styles.mockOption, styles.mockOptionEliminated]}>
                    <Text style={[Typography.bodySm, { color: colors.textTertiary, textDecorationLine: 'line-through' }]}>B) Ribosome</Text>
                    <Text style={styles.wrongBadge}>✗</Text>
                  </View>
                  <View style={[styles.mockOption, styles.mockOptionEliminated]}>
                    <Text style={[Typography.bodySm, { color: colors.textTertiary, textDecorationLine: 'line-through' }]}>C) Golgi body</Text>
                    <Text style={styles.wrongBadge}>✗</Text>
                  </View>
                  <View style={styles.mockOption}>
                    <Text style={[Typography.bodySm, { color: colors.text }]}>D) Lysosome</Text>
                  </View>
                </View>
              </View>

              <View style={[styles.highlightBox, { backgroundColor: colors.highlighterPink + '40' }]}>
                <HandwrittenText variant="handSm" color={colors.textSecondary}>
                  VaNi teaches you to eliminate like toppers do!
                </HandwrittenText>
              </View>
            </View>
          </JournalCard>

          <View style={styles.ctaSection}>
            <PuffyButton title="Get Started" onPress={handleGetStarted} />
            <HandwrittenText variant="handSm" color={colors.textTertiary}>
              3-day free trial. No strings.
            </HandwrittenText>
          </View>
        </Animated.View>
      </View>
    );
  };

  // ─── Render ──────────────────────────────────────────────
  const pages = [
    { id: 'pain', render: renderPainPoint },
    { id: 'vani', render: renderMeetVani },
    { id: 'stages', render: renderStages },
    { id: 'elimination', render: renderElimination },
  ];

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <FlatList
          ref={flatListRef}
          data={pages}
          renderItem={({ item }) => item.render()}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          bounces={false}
          style={styles.list}
        />

        <View style={styles.footer}>
          <View style={styles.dots}>
            {pages.map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  {
                    width: dotWidths[i],
                    backgroundColor:
                      i === currentIndex ? colors.primary : colors.dotGrid,
                  },
                ]}
              />
            ))}
          </View>

          {currentIndex < 3 && (
            <PuffyButton title="Next" onPress={handleNext} />
          )}
        </View>
      </SafeAreaView>
    </DotGridBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },

  // Page shared
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  pageContent: {
    alignItems: 'center',
    width: '100%',
    gap: Spacing.lg,
  },

  // Emoji rows
  emojiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  emoji: {
    fontSize: 40,
  },
  emojiArrow: {
    fontSize: 24,
    color: '#999',
  },

  // Card inner
  cardInner: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  highlightBox: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },

  // Meet VaNi
  tapeRow: {
    flexDirection: 'row',
    gap: 20,
  },
  logoWrap: {
    alignItems: 'center',
  },
  vaniLogo: {
    width: 120,
    height: 120,
  },

  // Stages
  stagesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  stagesEmoji: {
    fontSize: 28,
  },
  stagesArrow: {
    fontSize: 18,
    color: '#999',
  },
  stagesList: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
    width: '100%',
  },
  stageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  stageDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  // Elimination
  eliminationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  mockQuestion: {
    marginTop: Spacing.lg,
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  mockOptions: {
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  mockOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  mockOptionEliminated: {
    backgroundColor: '#fee2e2',
  },
  wrongBadge: {
    color: '#ef4444',
    fontWeight: '600',
  },
  ctaSection: {
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },

  // Footer
  footer: {
    alignItems: 'center',
    gap: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  dots: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: BorderRadius.round,
  },
});
