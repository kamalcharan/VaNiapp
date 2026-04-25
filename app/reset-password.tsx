import { useEffect, useRef, useState } from 'react';
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { DotGridBackground } from '../src/components/ui/DotGridBackground';
import { JournalCard } from '../src/components/ui/JournalCard';
import { PuffyButton } from '../src/components/ui/PuffyButton';
import { HandwrittenText } from '../src/components/ui/HandwrittenText';
import { useTheme } from '../src/hooks/useTheme';
import { useToast } from '../src/components/ui/Toast';
import {
  exchangeAuthCode,
  updatePassword,
  signOut,
} from '../src/lib/supabase';
import { reportError } from '../src/lib/errorReporting';
import { Typography, Spacing, BorderRadius } from '../src/constants/theme';

const logo = require('../assets/logo.png');

type Phase = 'exchanging' | 'ready' | 'saving' | 'done' | 'error';

export default function ResetPasswordScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const toast = useToast();

  // expo-router exposes the deep-link query params as route params, so this
  // is the primary path. Linking.getInitialURL() is the fallback for cold
  // starts on Android where the router occasionally lands here without a
  // routed `code` param.
  const params = useLocalSearchParams<{ code?: string }>();

  const [phase, setPhase] = useState<Phase>('exchanging');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const exchanged = useRef(false);
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(contentAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  // Exchange the recovery code into a Supabase session. Tries route params
  // first, then falls back to Linking.getInitialURL() (cold start) and
  // Linking 'url' events (warm start / app already open when the OS hands
  // off the deep link).
  useEffect(() => {
    const Linking = require('expo-linking');
    let cancelled = false;

    const exchange = async (code: string) => {
      if (exchanged.current) return;
      exchanged.current = true;
      try {
        await exchangeAuthCode(code);
        if (!cancelled) setPhase('ready');
      } catch (e: any) {
        reportError(e, 'high', 'ResetPassword.exchangeCode');
        if (!cancelled) {
          setErrorMsg(
            'This reset link is invalid or has expired. Request a new one from the sign-in screen.',
          );
          setPhase('error');
        }
      }
    };

    const codeFromUrl = (url: string | null): string | null => {
      if (!url) return null;
      try {
        const parsed = Linking.parse(url);
        return (parsed.queryParams?.code as string | undefined) ?? null;
      } catch {
        return null;
      }
    };

    (async () => {
      // 1. Route param (preferred — expo-router consumed the URL)
      if (params.code) {
        await exchange(params.code);
        return;
      }

      // 2. Cold-start URL fallback
      const initialUrl = await Linking.getInitialURL();
      const codeFromInitial = codeFromUrl(initialUrl);
      if (codeFromInitial) {
        await exchange(codeFromInitial);
        return;
      }

      // 3. No code anywhere — the user may already have a recovery session
      // (e.g. they navigated here while one is active). Let the form mount;
      // updatePassword will fail loudly if the session is missing.
      if (!cancelled && !exchanged.current) setPhase('ready');
    })();

    // Warm-start: app already running when OS hands off the deep link.
    const sub = Linking.addEventListener('url', (event: { url: string }) => {
      const c = codeFromUrl(event.url);
      if (c) exchange(c);
    });

    return () => {
      cancelled = true;
      sub?.remove?.();
    };
  }, [params.code]);

  const handleSave = async () => {
    setErrorMsg(null);

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setPhase('saving');
    try {
      await updatePassword(password);
      setPhase('done');
      toast.show('success', 'Password updated', 'Please sign in with your new password.');
      // Sign out so the user re-authenticates with the new password.
      await signOut();
      router.replace('/(auth)/sign-in');
    } catch (e: any) {
      reportError(e, 'high', 'ResetPassword.updatePassword');
      const msg = e?.message || 'Failed to update password.';
      if (msg.toLowerCase().includes('session') || msg.toLowerCase().includes('jwt')) {
        setErrorMsg(
          'Your reset link has expired. Please request a new one from the sign-in screen.'
        );
      } else if (msg.toLowerCase().includes('same')) {
        setErrorMsg('New password must be different from your current password.');
      } else {
        setErrorMsg(msg);
      }
      setPhase('ready');
    }
  };

  const goBackToSignIn = async () => {
    try {
      await signOut();
    } catch {}
    router.replace('/(auth)/sign-in');
  };

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
          extraScrollHeight={120}
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
                  Reset your password
                </HandwrittenText>

                {phase === 'exchanging' && (
                  <View style={styles.loadingWrap}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                      Verifying reset link...
                    </Text>
                  </View>
                )}

                {phase === 'error' && (
                  <>
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
                          { color: colors.incorrect, textAlign: 'center' },
                        ]}
                      >
                        {errorMsg ?? 'Something went wrong.'}
                      </Text>
                    </View>
                    <PuffyButton title="Back to Sign In" onPress={goBackToSignIn} />
                  </>
                )}

                {(phase === 'ready' || phase === 'saving') && (
                  <>
                    <Text
                      style={[
                        Typography.bodySm,
                        { color: colors.textSecondary, textAlign: 'center' },
                      ]}
                    >
                      Enter a new password for your account.
                    </Text>

                    {errorMsg && (
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
                          {errorMsg}
                        </Text>
                      </View>
                    )}

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
                        placeholder="New password"
                        placeholderTextColor={colors.textTertiary}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        textContentType="newPassword"
                        autoComplete="new-password"
                        editable={phase === 'ready'}
                      />
                      <TextInput
                        style={[
                          styles.input,
                          {
                            backgroundColor: colors.surface,
                            borderColor:
                              confirm && confirm !== password
                                ? colors.incorrect
                                : colors.surfaceBorder,
                            color: colors.text,
                            fontFamily: 'PlusJakartaSans_400Regular',
                          },
                        ]}
                        placeholder="Confirm new password"
                        placeholderTextColor={colors.textTertiary}
                        value={confirm}
                        onChangeText={setConfirm}
                        secureTextEntry
                        textContentType="newPassword"
                        autoComplete="new-password"
                        editable={phase === 'ready'}
                      />
                      {password.length > 0 && password.length < 6 && (
                        <Text style={[Typography.bodySm, { color: colors.warning, fontSize: 12 }]}>
                          Password must be at least 6 characters
                        </Text>
                      )}
                    </View>

                    {phase === 'saving' ? (
                      <View style={styles.loadingWrap}>
                        <ActivityIndicator size="small" color={colors.primary} />
                        <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                          Updating password...
                        </Text>
                      </View>
                    ) : (
                      <PuffyButton title="Update Password" onPress={handleSave} />
                    )}

                    <Pressable onPress={goBackToSignIn} disabled={phase === 'saving'}>
                      <Text
                        style={[
                          Typography.bodySm,
                          { color: colors.textSecondary, textAlign: 'center' },
                        ]}
                      >
                        Back to Sign In
                      </Text>
                    </Pressable>
                  </>
                )}
              </View>
            </JournalCard>
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
  errorBanner: {
    width: '100%',
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
});
