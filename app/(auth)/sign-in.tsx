import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { PuffyButton } from '../../src/components/ui/PuffyButton';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { useTheme } from '../../src/hooks/useTheme';
import { signInWithEmail, signUpWithEmail, resetPassword } from '../../src/lib/supabase';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';

const logo = require('../../assets/logo.png');

type Mode = 'signin' | 'signup';

export default function SignInScreen() {
  const { colors } = useTheme();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(contentAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleEmailSubmit = async () => {
    setError(null);
    setSuccessMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Please enter your email and password.');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (mode === 'signup') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        await signInWithEmail(trimmedEmail, password);
      } else {
        const { needsConfirmation } = await signUpWithEmail(trimmedEmail, password);
        if (needsConfirmation) {
          setSuccessMsg(
            'Account created! We sent a confirmation link to ' +
              trimmedEmail +
              '. Please check your inbox (and spam folder), tap the link, then come back here to sign in.'
          );
          setMode('signin');
          setPassword('');
          setConfirmPassword('');
        }
      }
    } catch (err: any) {
      console.error('[Auth] Error:', err);
      const msg = err?.message || String(err);
      // Make common Supabase errors friendlier
      if (msg.includes('Email not confirmed')) {
        setError(
          'Your email is not confirmed yet. Please check your inbox for the confirmation link.'
        );
      } else if (msg.includes('Invalid login credentials')) {
        setError('Incorrect email or password. Please try again.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Enter your email above, then tap Forgot Password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await resetPassword(trimmedEmail);
      setSuccessMsg(
        'Password reset link sent to ' +
          trimmedEmail +
          '. Check your inbox (and spam folder).'
      );
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setError(null);
    setSuccessMsg(null);
    setPassword('');
    setConfirmPassword('');
    setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
  };

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
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
                    {mode === 'signin' ? "Let's get you in" : 'Create your account'}
                  </HandwrittenText>

                  <Text
                    style={[
                      Typography.bodySm,
                      { color: colors.textSecondary, textAlign: 'center' },
                    ]}
                  >
                    {mode === 'signin'
                      ? 'Sign in to save your progress, track your strengths, and pick up right where you left off.'
                      : 'Create an account to start your learning journey.'}
                  </Text>

                  {/* Success banner — prominent green box */}
                  {successMsg && (
                    <View
                      style={[
                        styles.successBanner,
                        { backgroundColor: colors.correctBg, borderColor: colors.correct },
                      ]}
                    >
                      <Text
                        style={[
                          Typography.bodySm,
                          { color: colors.correct, textAlign: 'center', fontFamily: 'PlusJakartaSans_600SemiBold' },
                        ]}
                      >
                        {successMsg}
                      </Text>
                    </View>
                  )}

                  {/* Email / Password form */}
                  <View style={styles.form}>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.surfaceBorder,
                          color: colors.text,
                          fontFamily: 'PlusJakartaSans_400Regular',
                        },
                      ]}
                      placeholder="Email"
                      placeholderTextColor={colors.textTertiary}
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      textContentType="emailAddress"
                      autoComplete="email"
                      editable={!loading}
                    />
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.surfaceBorder,
                          color: colors.text,
                          fontFamily: 'PlusJakartaSans_400Regular',
                        },
                      ]}
                      placeholder="Password"
                      placeholderTextColor={colors.textTertiary}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      textContentType={mode === 'signup' ? 'newPassword' : 'password'}
                      autoComplete={mode === 'signup' ? 'new-password' : 'password'}
                      editable={!loading}
                    />
                    {mode === 'signup' && (
                      <TextInput
                        style={[
                          styles.input,
                          {
                            backgroundColor: colors.surface,
                            borderColor:
                              confirmPassword && confirmPassword !== password
                                ? colors.incorrect
                                : colors.surfaceBorder,
                            color: colors.text,
                            fontFamily: 'PlusJakartaSans_400Regular',
                          },
                        ]}
                        placeholder="Confirm Password"
                        placeholderTextColor={colors.textTertiary}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        textContentType="newPassword"
                        autoComplete="new-password"
                        editable={!loading}
                      />
                    )}
                    {mode === 'signup' && password.length > 0 && password.length < 6 && (
                      <Text style={[Typography.bodySm, { color: colors.warning, fontSize: 12 }]}>
                        Password must be at least 6 characters
                      </Text>
                    )}
                  </View>

                  {loading ? (
                    <View style={styles.loadingWrap}>
                      <ActivityIndicator size="small" color={colors.primary} />
                      <Text
                        style={[Typography.bodySm, { color: colors.textTertiary }]}
                      >
                        {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                      </Text>
                    </View>
                  ) : (
                    <PuffyButton
                      title={mode === 'signin' ? 'Sign In' : 'Create Account'}
                      onPress={handleEmailSubmit}
                    />
                  )}

                  {error && (
                    <View
                      style={[
                        styles.errorBanner,
                        { backgroundColor: colors.incorrectBg, borderColor: colors.incorrect },
                      ]}
                    >
                      <Text
                        selectable
                        style={[
                          Typography.bodySm,
                          { color: colors.incorrect, textAlign: 'center', fontSize: 12 },
                        ]}
                      >
                        {error}
                      </Text>
                    </View>
                  )}

                  {/* Forgot Password — only on sign-in mode */}
                  {mode === 'signin' && !loading && (
                    <Pressable onPress={handleForgotPassword}>
                      <Text
                        style={[
                          Typography.bodySm,
                          { color: colors.textSecondary, textAlign: 'center', fontSize: 13 },
                        ]}
                      >
                        Forgot Password?
                      </Text>
                    </Pressable>
                  )}

                  <Pressable onPress={toggleMode} disabled={loading}>
                    <Text
                      style={[
                        Typography.bodySm,
                        { color: colors.primary, textAlign: 'center' },
                      ]}
                    >
                      {mode === 'signin'
                        ? "Don't have an account? Sign Up"
                        : 'Already have an account? Sign In'}
                    </Text>
                  </Pressable>
                </View>
              </JournalCard>

              <HandwrittenText variant="handSm" color={colors.textTertiary}>
                Your data stays yours. Always.
              </HandwrittenText>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </DotGridBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
    gap: Spacing.lg,
  },
  form: {
    width: '100%',
    gap: Spacing.md,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    fontSize: 15,
  },
  loadingWrap: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  successBanner: {
    width: '100%',
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  errorBanner: {
    width: '100%',
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
});
