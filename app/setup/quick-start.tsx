import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
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
import { useOnboardingGate } from '../_layout';
import { useToast } from '../../src/components/ui/Toast';
import { completeOnboarding } from '../../src/lib/database';
import { NEET_SUBJECT_IDS } from '../../src/types';
import type { ExamType, Language, NeetSubjectId } from '../../src/types';

const logo = require('../../assets/logo.png');

export default function QuickStartScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { setStep, flowConfig } = useOnboarding();
  const { markDone } = useOnboardingGate();
  const toast = useToast();

  const [saving, setSaving] = useState(false);
  const [errorDialog, setErrorDialog] = useState({ visible: false, message: '' });

  useEffect(() => {
    setStep(2);
  }, []);

  // Entrance animations
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(25)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Logo float
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, {
          toValue: -6,
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

  const handleStart = async () => {
    if (saving) return;
    setSaving(true);

    try {
      const exam = (flowConfig?.default_exam || 'NEET') as ExamType;
      const language = (flowConfig?.default_language || 'en') as Language;
      const subjects = flowConfig?.auto_assign_subjects
        ? [...NEET_SUBJECT_IDS]
        : [...NEET_SUBJECT_IDS]; // NEET subjects either way for now

      await completeOnboarding({
        phone: '',
        countryCode: '+91',
        college: '',
        city: '',
        exam,
        subjects: subjects as NeetSubjectId[],
        language,
      });

      // Signal root layout that onboarding is done (prevents redirect loop)
      markDone();

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast.show('success', "Let's go!", 'NEET practice ready');
      router.replace('/(main)');
    } catch (err: any) {
      setSaving(false);
      setErrorDialog({
        visible: true,
        message: err?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeIn,
              transform: [{ translateY: slideUp }],
            },
          ]}
        >
          {/* Floating Logo */}
          <Animated.View
            style={[
              styles.logoWrap,
              { transform: [{ translateY: logoFloat }] },
            ]}
          >
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </Animated.View>

          {/* Main Card */}
          <JournalCard rotation={-0.3}>
            <View style={styles.cardContent}>
              <Text style={[Typography.h2, { color: colors.text, textAlign: 'center' }]}>
                Ready to crack NEET?
              </Text>
              <HandwrittenText variant="hand" color={colors.primary}>
                April 2026
              </HandwrittenText>
              <Text
                style={[
                  Typography.body,
                  {
                    color: colors.textSecondary,
                    textAlign: 'center',
                    marginTop: Spacing.sm,
                    lineHeight: 22,
                  },
                ]}
              >
                We've set you up with Physics, Chemistry, Botany & Zoology.
                Jump straight into practice!
              </Text>
            </View>
          </JournalCard>

          {/* What's included */}
          <StickyNote color="teal" rotation={0.5} delay={200}>
            <View style={styles.perks}>
              <View style={styles.perkRow}>
                <Text style={styles.perkEmoji}>{'\u2705'}</Text>
                <Text style={[Typography.bodySm, { color: colors.text, flex: 1 }]}>
                  All 4 NEET subjects ready
                </Text>
              </View>
              <View style={styles.perkRow}>
                <Text style={styles.perkEmoji}>{'\uD83C\uDFAF'}</Text>
                <Text style={[Typography.bodySm, { color: colors.text, flex: 1 }]}>
                  Chapter-wise practice
                </Text>
              </View>
              <View style={styles.perkRow}>
                <Text style={styles.perkEmoji}>{'\uD83D\uDCA1'}</Text>
                <Text style={[Typography.bodySm, { color: colors.text, flex: 1 }]}>
                  VaNi AI helps when you're stuck
                </Text>
              </View>
            </View>
          </StickyNote>

          {/* CTA */}
          <View style={styles.footer}>
            <PuffyButton
              title={saving ? 'Setting up...' : 'Start Practicing'}
              icon={saving ? undefined : '\uD83D\uDE80'}
              onPress={handleStart}
              disabled={saving}
            />
            <HandwrittenText variant="handSm" color={colors.textTertiary}>
              you can update your profile anytime from settings
            </HandwrittenText>
          </View>
        </Animated.View>
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    gap: Spacing.xl,
  },
  logoWrap: {
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  perks: {
    gap: Spacing.md,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  perkEmoji: {
    fontSize: 20,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    gap: Spacing.md,
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
