import { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { WashiTape } from '../../src/components/ui/WashiTape';
import { PuffyButton } from '../../src/components/ui/PuffyButton';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography, Spacing } from '../../src/constants/theme';
import { useOnboarding } from './_layout';

// Try to get name from auth context (may not be available during UI-only testing)
let useAuth: () => { user: any };
try {
  useAuth = require('../_layout').useAuth;
} catch {
  useAuth = () => ({ user: null });
}

const logo = require('../../assets/logo.png');

export default function WelcomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { setStep } = useOnboarding();

  const auth = useAuth();
  const user = auth?.user;

  const firstName =
    user?.user_metadata?.full_name?.split(' ')[0] ||
    user?.user_metadata?.name?.split(' ')[0] ||
    'there';

  useEffect(() => {
    setStep(1);
  }, []);

  // Entrance animations
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  const btnFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Logo springs in
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // Text slides up
      Animated.parallel([
        Animated.timing(contentFade, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(contentSlide, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // Card + button stagger in
      Animated.stagger(150, [
        Animated.timing(cardFade, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(btnFade, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.content}>
          {/* Logo */}
          <Animated.View
            style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}
          >
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </Animated.View>

          <WashiTape width={180} rotation={2} />

          {/* Greeting */}
          <Animated.View
            style={[
              styles.textBlock,
              {
                opacity: contentFade,
                transform: [{ translateY: contentSlide }],
              },
            ]}
          >
            <HandwrittenText variant="handLg" color={colors.text}>
              Hey {firstName}!
            </HandwrittenText>

            <Text
              style={[
                Typography.h2,
                { color: colors.text, textAlign: 'center' },
              ]}
            >
              Welcome to VaNi
            </Text>

            <HandwrittenText variant="hand" color={colors.textSecondary}>
              let's set up your journal...
            </HandwrittenText>
          </Animated.View>

          {/* Card */}
          <Animated.View style={{ opacity: cardFade, width: '100%' }}>
            <JournalCard rotation={-0.5} delay={0}>
              <View style={styles.cardContent}>
                <HandwrittenText variant="handSm" color={colors.textSecondary}>
                  Just a few quick things and you're all set to start your exam
                  prep journey.
                </HandwrittenText>
              </View>
            </JournalCard>
          </Animated.View>

          {/* CTA */}
          <Animated.View style={{ opacity: btnFade }}>
            <PuffyButton
              title="Let's Go"
              icon={'\u2728'}
              onPress={() => router.push('/(onboarding)/profile-details')}
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    </DotGridBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xl,
  },
  logo: {
    width: 160,
    height: 160,
  },
  textBlock: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cardContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
});
