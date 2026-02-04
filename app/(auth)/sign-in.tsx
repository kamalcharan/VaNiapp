import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { PuffyButton } from '../../src/components/ui/PuffyButton';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { useTheme } from '../../src/hooks/useTheme';
import { signInWithGoogle } from '../../src/lib/supabase';
import { Typography, Spacing } from '../../src/constants/theme';

const logo = require('../../assets/logo.png');

export default function SignInScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Entrance animation
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(contentAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);

    try {
      const result = await signInWithGoogle();

      if (result.cancelled) {
        // User dismissed the browser — not an error
        setLoading(false);
        return;
      }

      // Session is now stored by Supabase client.
      // The auth state listener in _layout.tsx will handle navigation.
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: contentAnim,
              transform: [
                {
                  translateY: contentAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Image source={logo} style={styles.logo} resizeMode="contain" />

          <JournalCard rotation={-0.5} delay={100}>
            <View style={styles.cardContent}>
              <HandwrittenText variant="handLg" color={colors.text}>
                Let's get you in
              </HandwrittenText>

              <Text
                style={[
                  Typography.bodySmall,
                  { color: colors.textSecondary, textAlign: 'center' },
                ]}
              >
                Sign in to save your progress, track your strengths, and pick up
                right where you left off.
              </Text>

              {loading ? (
                <View style={styles.loadingWrap}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text
                    style={[Typography.bodySmall, { color: colors.textTertiary }]}
                  >
                    Opening Google Sign-In...
                  </Text>
                </View>
              ) : (
                <PuffyButton
                  title="Continue with Google"
                  onPress={handleGoogleSignIn}
                />
              )}

              {error && (
                <Text
                  style={[
                    Typography.bodySmall,
                    { color: colors.incorrect, textAlign: 'center' },
                  ]}
                >
                  {error}
                </Text>
              )}
            </View>
          </JournalCard>

          <HandwrittenText variant="handSm" color={colors.textTertiary}>
            Your data stays yours. Always.
          </HandwrittenText>
        </Animated.View>
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
    width: 120,
    height: 120,
  },
  cardContent: {
    alignItems: 'center',
    gap: Spacing.xl,
  },
  loadingWrap: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
});
