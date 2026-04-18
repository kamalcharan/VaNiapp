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
import { useRouter } from 'expo-router';
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
  supabase,
} from '../src/lib/supabase';
import { reportError } from '../src/lib/errorReporting';
import { Typography, Spacing, BorderRadius } from '../src/constants/theme';

const logo = require('../assets/logo.png');

type Phase = 'exchanging' | 'ready' | 'saving' | 'done' | 'error';

export default function ResetPasswordScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const toast = useToast();

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

  // Exchange the recovery code from the deep link.
  useEffect(() => {
    const Linking = require('expo-linking');

    const tryExchange = async (url: string | null) => {
      if (!url || exchanged.current) return;
      try {
        const parsed = Linking.parse(url);
        const code =
          (parsed.queryParams?.code as string | undefined) ?? null;
        if (!code) return;

        exchanged.current = true;
        await exchangeAuthCode(code);
        setPhase('ready');
      } catch (e: any) {
        exchanged.current = true;
        reportError(e, 'high', 'ResetPassword.exchangeCode');
        // If a session exists anyway (e.g. this screen remounted after a
        // prior successful exchange consumed the code), just show the form.
        const { data } = supabase
          ? await supabase.auth.getSession()
          : { data: { session: null } };
        if (data.session) {
          setPhase('ready');
          return;
        }
        setErrorMsg(
          'This reset link is invalid or has expired. Request a new one from the sign-in screen.'
        );
        setPhase('error');
      }
    };

    (async () => {
      // If we already have a session (screen remounted after exchange, or
      // user landed here already signed in), skip the exchange entirely.
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          exchanged.current = true;
          setPhase('ready');
          return;
        }
      }

      const url = await Linking.getInitialURL();
      await tryExchange(url);

      // No code in initial URL and no session — wait briefly for a URL
      // event (app was already running when link was tapped), then
      // show the form so the user can at least see an error if they
      // try to submit without a session.
      if (!exchanged.current) {
        setPhase('ready');
      }
    })();

    const sub = Linking.addEventListener('url', (event: { url: string }) => {
      tryExchange(event.url);
    });

    return () => sub?.remove?.();
  }, []);

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
