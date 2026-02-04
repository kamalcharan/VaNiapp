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

  // Per-page entrance animations (triggered once when page first becomes visible)
  const pageAnims = useRef([
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
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.sine),
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
    if (currentIndex < 2) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleGetStarted = () => {
    router.push('/(auth)/sign-in');
  };

  // ─── Page 1: The Cover ───────────────────────────────────
  const renderCover = () => {
    const anim = pageAnims[0];
    return (
      <View style={[styles.page, { width }]}>
        <Animated.View
          style={[
            styles.coverContent,
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
            <Image source={logo} style={styles.coverLogo} resizeMode="contain" />
          </Animated.View>

          <Text
            style={[
              Typography.display,
              { color: colors.text, textAlign: 'center' },
            ]}
          >
            VaNi
          </Text>

          <HandwrittenText variant="hand" rotation={-2}>
            writing my own future...
          </HandwrittenText>
        </Animated.View>
      </View>
    );
  };

  // ─── Page 2: The Promise ─────────────────────────────────
  const renderPromise = () => {
    const anim = pageAnims[1];
    const stagger = (delay: number) => ({
      opacity: anim,
      transform: [
        {
          translateY: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [15 + delay * 0.05, 0],
          }),
        },
      ],
    });

    return (
      <View style={[styles.page, { width }]}>
        <View style={styles.promiseContent}>
          <JournalCard rotation={-0.5} delay={100}>
            <Animated.View style={stagger(0)}>
              <HandwrittenText variant="handLg" color={colors.text}>
                Your NEET journal
              </HandwrittenText>
            </Animated.View>

            <View style={styles.promiseList}>
              <Animated.View style={[styles.promiseItem, stagger(100)]}>
                <View
                  style={[
                    styles.marker,
                    { backgroundColor: colors.highlighterYellow },
                  ]}
                />
                <Text style={[Typography.body, { color: colors.text, flex: 1 }]}>
                  Physics, Chemistry, Botany, Zoology — all covered
                </Text>
              </Animated.View>

              <Animated.View style={[styles.promiseItem, stagger(200)]}>
                <View
                  style={[
                    styles.marker,
                    { backgroundColor: colors.highlighterTeal },
                  ]}
                />
                <Text style={[Typography.body, { color: colors.text, flex: 1 }]}>
                  Tracks your strengths, targets your weak spots
                </Text>
              </Animated.View>

              <Animated.View style={[styles.promiseItem, stagger(300)]}>
                <View
                  style={[
                    styles.marker,
                    { backgroundColor: colors.highlighterPink },
                  ]}
                />
                <Text style={[Typography.body, { color: colors.text, flex: 1 }]}>
                  English + Telugu — think in your language
                </Text>
              </Animated.View>
            </View>

            <Animated.View style={[{ marginTop: Spacing.lg }, stagger(400)]}>
              <HandwrittenText variant="handSm" rotation={1} color={colors.textTertiary}>
                8 question types that actually prepare you
              </HandwrittenText>
            </Animated.View>
          </JournalCard>
        </View>
      </View>
    );
  };

  // ─── Page 3: Get Started ─────────────────────────────────
  const renderStart = () => {
    const anim = pageAnims[2];
    return (
      <View style={[styles.page, { width }]}>
        <Animated.View
          style={[
            styles.startContent,
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
          <HandwrittenText variant="handLg" color={colors.text}>
            Ready to begin?
          </HandwrittenText>

          <Text
            style={[
              Typography.body,
              {
                color: colors.textSecondary,
                textAlign: 'center',
                paddingHorizontal: Spacing.xl,
              },
            ]}
          >
            Join thousands of students writing their own success story.
          </Text>

          <View style={styles.startCta}>
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
    { id: 'cover', render: renderCover },
    { id: 'promise', render: renderPromise },
    { id: 'start', render: renderStart },
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

          {currentIndex < 2 && (
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
    paddingHorizontal: Spacing.xl,
  },

  // Page 1 — Cover
  coverContent: {
    alignItems: 'center',
    gap: Spacing.lg,
  },
  tapeRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: Spacing.md,
  },
  logoWrap: {
    alignItems: 'center',
  },
  coverLogo: {
    width: 220,
    height: 220,
  },

  // Page 2 — Promise
  promiseContent: {
    width: '100%',
  },
  promiseList: {
    gap: Spacing.xl,
    marginTop: Spacing.xl,
  },
  promiseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  marker: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // Page 3 — Start
  startContent: {
    alignItems: 'center',
    gap: Spacing.xl,
  },
  startCta: {
    alignItems: 'center',
    gap: Spacing.lg,
    marginTop: Spacing.xl,
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
