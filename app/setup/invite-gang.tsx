import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Share,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { StickyNote } from '../../src/components/ui/StickyNote';
import { PuffyButton } from '../../src/components/ui/PuffyButton';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { ThemedDialog } from '../../src/components/ui/ThemedDialog';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { useOnboarding } from './_layout';
import { useToast } from '../../src/components/ui/Toast';
import { completeOnboarding, joinWithReferralCode } from '../../src/lib/database';
import type { ExamType } from '../../src/types';

// ── Perks ────────────────────────────────────────────────────

const PERKS = [
  { emoji: '\uD83D\uDCB0', text: 'Up to 20% off when you study together' },
  { emoji: '\uD83D\uDCCA', text: 'Compare scores & track each other' },
  { emoji: '\u26A1', text: 'Challenge your gang to daily quizzes' },
  { emoji: '\uD83D\uDE80', text: 'Stay motivated with group streaks' },
];

export default function InviteGangScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { data, setStep } = useOnboarding();

  const [inviteCode, setInviteCode] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorDialog, setErrorDialog] = useState({ visible: false, message: '' });
  const toast = useToast();

  useEffect(() => {
    setStep(6);
  }, []);

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const examLabel =
        data.exam === 'BOTH'
          ? 'NEET & CUET'
          : data.exam || 'exams';
      await Share.share({
        message: `Hey! I'm prepping for ${examLabel} on VaNi. Let's study together!\n\nDownload VaNi and join me.`,
      });
    } catch {
      // share dismissed
    }
  };

  const handleJoinGang = async () => {
    if (inviteCode.trim().length < 4) return;
    const ok = await joinWithReferralCode(inviteCode.trim());
    if (ok) {
      toast.show('success', 'Joined!', 'Welcome to the gang');
    } else {
      toast.show('error', 'Invalid code', 'Check the code and try again');
    }
    await handleFinish();
  };

  const handleFinish = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await completeOnboarding({
        phone: data.phone,
        countryCode: data.countryCode,
        college: data.college,
        city: data.city,
        exam: data.exam as ExamType,
        subjects: data.subjects,
        language: data.language,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast.show('success', 'All set!', "Let's go");
      router.replace('/');
    } catch (err: any) {
      setSaving(false);
      setErrorDialog({
        visible: true,
        message: err?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  // Entrance animation
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(25)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Animated.ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={{
            opacity: fadeIn,
            transform: [{ translateY: slideUp }],
          }}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>{'\uD83D\uDC7E'}</Text>
            <Text style={[Typography.h1, { color: colors.text }]}>
              Invite your gang
            </Text>
            <HandwrittenText variant="hand" rotation={-1}>
              study better together...
            </HandwrittenText>
          </View>

          {/* Perks */}
          <JournalCard rotation={-0.3} delay={100}>
            <View style={styles.section}>
              <Text style={[Typography.h3, { color: colors.text }]}>
                Why study with a gang?
              </Text>
              {PERKS.map((perk, i) => (
                <View key={i} style={styles.perkRow}>
                  <Text style={styles.perkEmoji}>{perk.emoji}</Text>
                  <Text
                    style={[
                      Typography.bodySm,
                      { color: colors.textSecondary, flex: 1 },
                    ]}
                  >
                    {perk.text}
                  </Text>
                </View>
              ))}
            </View>
          </JournalCard>

          {/* Share Invite */}
          <StickyNote color="pink" rotation={0.5} delay={200}>
            <Pressable onPress={handleShare} style={styles.shareBtn}>
              <Text style={{ fontSize: 28 }}>{'\uD83D\uDCE8'}</Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    Typography.body,
                    {
                      color: colors.text,
                      fontFamily: 'PlusJakartaSans_600SemiBold',
                    },
                  ]}
                >
                  Share with your crew
                </Text>
                <Text
                  style={[Typography.bodySm, { color: colors.textSecondary }]}
                >
                  WhatsApp, Instagram, anywhere
                </Text>
              </View>
              <Text style={{ fontSize: 20 }}>{'\u27A1\uFE0F'}</Text>
            </Pressable>
          </StickyNote>

          {/* Join Existing Gang */}
          <JournalCard rotation={0.3} delay={300}>
            <View style={styles.section}>
              <Text style={[Typography.h3, { color: colors.text }]}>
                Got an invite code?
              </Text>
              <View style={styles.codeRow}>
                <TextInput
                  style={[
                    styles.codeInput,
                    {
                      color: colors.text,
                      backgroundColor: colors.surface,
                      borderColor: colors.surfaceBorder,
                    },
                  ]}
                  placeholder="Enter code"
                  placeholderTextColor={colors.textTertiary}
                  value={inviteCode}
                  onChangeText={(t) =>
                    setInviteCode(t.toUpperCase().slice(0, 8))
                  }
                  autoCapitalize="characters"
                  maxLength={8}
                />
                <PuffyButton
                  title="Join"
                  variant="secondary"
                  onPress={handleJoinGang}
                  disabled={inviteCode.trim().length < 4}
                />
              </View>
            </View>
          </JournalCard>

          {/* Actions */}
          <View style={styles.actions}>
            <PuffyButton
              title={saving ? 'Saving...' : 'Finish Setup'}
              icon={saving ? undefined : '\uD83C\uDF89'}
              onPress={handleFinish}
              disabled={saving}
            />
            <Pressable onPress={handleFinish} disabled={saving}>
              <Text style={[styles.skipText, { color: colors.textTertiary }]}>
                Skip for now
              </Text>
            </Pressable>
          </View>
        </Animated.ScrollView>
      </SafeAreaView>

      {/* Loading overlay */}
      {saving && (
        <View style={styles.loadingOverlay}>
          <View style={[styles.loadingCard, { backgroundColor: colors.surface }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[Typography.body, { color: colors.text, marginTop: Spacing.md }]}>
              Setting things up...
            </Text>
          </View>
        </View>
      )}

      {/* Error dialog */}
      <ThemedDialog
        visible={errorDialog.visible}
        title="Oops!"
        emoji={'\uD83D\uDE15'}
        message={errorDialog.message}
        confirmLabel="Try again"
        onConfirm={() => setErrorDialog({ visible: false, message: '' })}
      />
    </DotGridBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: Spacing.xl,
    gap: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  headerEmoji: {
    fontSize: 48,
  },
  section: {
    gap: Spacing.md,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  perkEmoji: {
    fontSize: 22,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  codeInput: {
    flex: 1,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 18,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 4,
    textAlign: 'center',
    letterSpacing: 3,
  },
  actions: {
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  skipText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loadingCard: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
});
