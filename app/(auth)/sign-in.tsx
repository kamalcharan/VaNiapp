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
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { PuffyButton } from '../../src/components/ui/PuffyButton';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { useTheme } from '../../src/hooks/useTheme';
import {
  signInWithEmail,
  signUpWithEmail,
  resetPassword,
} from '../../src/lib/supabase';
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
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(contentAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  // ── Email Sign-In / Sign-Up ────────────────────────────────────
  const handleEmailSubmit = async () => {
    setError(null);
    setSuccessMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Please enter your email and password.');
      return;
    }

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
          setPendingEmail(trimmedEmail);
          setPassword('');
          setConfirmPassword('');
        }
      }
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (
        msg.includes('Email not confirmed') ||
        msg.includes('email not confirmed') ||
        msg.includes('not been confirmed')
      ) {
        setPendingEmail(trimmedEmail);
      } else if (msg.includes('Invalid login credentials')) {
        setError('Incorrect email or password. Please try again.');
      } else if (msg.includes('User already registered')) {
        setError('An account with this email already exists. Try signing in instead.');
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

  // ── Full-screen "Check Your Email" view ──────────────────────────
  if (pendingEmail) {
    return (
      <DotGridBackground>
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={[
                styles.content,
                { opacity: contentAnim, transform: [{ translateY: 0 }] },
              ]}
            >
              <Image source={logo} style={styles.logo} resizeMode="contain" />

              <JournalCard rotation={-0.5} delay={100}>
                <View style={styles.cardContent}>
                  <View
                    style={[
                      styles.mailIcon,
                      { backgroundColor: colors.correctBg },
                    ]}
                  >
                    <Text style={{ fontSize: 40 }}>{'✉️'}</Text>
                  </View>

                  <HandwrittenText variant="handLg" color={colors.text}>
                    Check your email
                  </HandwrittenText>

                  <View
                    style={[
                      styles.confirmationBox,
                      { backgroundColor: colors.correctBg, borderColor: colors.correct },
                    ]}
                  >
                    <Text
                      style={[
                        Typography.body,
                        {
                          color: colors.text,
                          textAlign: 'center',
                          fontFamily: 'PlusJakartaSans_600SemiBold',
                        },
                      ]}
                    >
                      We sent a confirmation link to:
                    </Text>
                    <Text
                      selectable
                      style={[
                        Typography.body,
                        {
                          color: colors.primary,
                          textAlign: 'center',
                          fontFamily: 'PlusJakartaSans_600SemiBold',
                        },
                      ]}
                    >
                      {pendingEmail}
                    </Text>
                    <Text
                      style={[
                        Typography.bodySm,
                        { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm },
                      ]}
                    >
                      Open your email, tap the confirmation link, then come back here and sign in.
                    </Text>
                    <Text
                      style={[
                        Typography.bodySm,
                        { color: colors.textTertiary, textAlign: 'center', fontSize: 12 },
                      ]}
                    >
                      (Check your spam folder too!)
                    </Text>
                  </View>

                  <PuffyButton
                    title="I've confirmed — Sign In"
                    onPress={() => {
                      setPendingEmail(null);
                      setMode('signin');
                      setEmail(pendingEmail || '');
                      setPassword('');
                      setError(null);
                      setSuccessMsg(null);
                    }}
                  />

                  <Pressable
                    onPress={() => {
                      setPendingEmail(null);
                      setMode('signin');
                      setEmail(pendingEmail || '');
                      setPassword('');
                      setError(null);
                      setSuccessMsg(null);
                    }}
                  >
                    <Text
                      style={[
                        Typography.bodySm,
                        { color: colors.textSecondary, textAlign: 'center' },
                      ]}
                    >
                      Back to Sign In
                    </Text>
                  </Pressable>
                </View>
              </JournalCard>
            </Animated.View>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </DotGridBackground>
    );
  }

  // ── Main sign-in screen ──────────────────────────────────────────
  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          extraHeight={120}
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
                    {mode === 'signin'
                      ? "Let's get you in"
                      : 'Create your account'}
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

                  {/* Success banner */}
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

                  {/* Error banner */}
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

                  {/* ── Email / Password form ── */}
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
                      <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                        {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                      </Text>
                    </View>
                  ) : (
                    <PuffyButton
                      title={mode === 'signin' ? 'Sign In' : 'Create Account'}
                      onPress={handleEmailSubmit}
                    />
                  )}

                  {/* Forgot Password — sign-in mode only */}
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

                  {/* Toggle signin/signup */}
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
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </DotGridBackground>
  );
}

const styles = StyleSheet.create({
  container: {
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
  mailIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmationBox: {
    width: '100%',
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.xs,
  },
});
