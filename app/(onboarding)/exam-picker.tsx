import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { PuffyButton } from '../../src/components/ui/PuffyButton';
import { useTheme } from '../../src/hooks/useTheme';
import {
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
} from '../../src/constants/theme';
import { useOnboarding } from './_layout';
import { ExamType, NEET_SUBJECT_IDS } from '../../src/types';

// ── Exam options ─────────────────────────────────────────────

const EXAMS: {
  id: ExamType;
  emoji: string;
  title: string;
  subtitle: string;
  desc: string;
  color: string;
}[] = [
  {
    id: 'NEET',
    emoji: '\uD83E\uDE7A',
    title: 'NEET',
    subtitle: 'Medical Entrance',
    desc: '4 subjects \u2014 Physics, Chemistry, Botany, Zoology',
    color: '#3B82F6',
  },
  {
    id: 'CUET',
    emoji: '\uD83C\uDF93',
    title: 'CUET',
    subtitle: 'University Entrance',
    desc: 'Pick up to 6 domain subjects + General Test',
    color: '#8B5CF6',
  },
  {
    id: 'BOTH',
    emoji: '\uD83D\uDCAA',
    title: 'Both',
    subtitle: 'NEET + CUET',
    desc: 'NEET 4 auto-included + pick CUET subjects',
    color: '#F59E0B',
  },
];

export default function ExamPickerScreen() {
  const { colors, mode } = useTheme();
  const router = useRouter();
  const { data, update, setStep } = useOnboarding();

  const [selected, setSelected] = useState<ExamType | null>(data.exam);

  useEffect(() => {
    setStep(3);
  }, []);

  const handleSelect = (id: ExamType) => {
    setSelected(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleContinue = () => {
    if (!selected) return;

    // Auto-add NEET subjects when applicable
    const autoSubjects =
      selected === 'NEET' || selected === 'BOTH'
        ? [...NEET_SUBJECT_IDS]
        : [];

    update({ exam: selected, subjects: autoSubjects });

    if (selected === 'NEET') {
      // NEET has fixed subjects — skip subject picker, go to language
      router.push('/(onboarding)/language');
    } else {
      router.push('/(onboarding)/subject-picker');
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

  // Per-card stagger animations
  const cardAnims = useRef(EXAMS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      120,
      cardAnims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          friction: 7,
          tension: 50,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeIn,
            transform: [{ translateY: slideUp }],
          }}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>{'\uD83D\uDCDA'}</Text>
            <Text style={[Typography.h1, { color: colors.text }]}>
              What are you{'\n'}preparing for?
            </Text>
            <HandwrittenText variant="hand" rotation={-1}>
              pick your exam...
            </HandwrittenText>
          </View>

          {/* Exam Cards */}
          <View style={styles.cards}>
            {EXAMS.map((exam, index) => {
              const isActive = selected === exam.id;
              const cardScale = cardAnims[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0.85, 1],
              });

              return (
                <Animated.View
                  key={exam.id}
                  style={{
                    opacity: cardAnims[index],
                    transform: [{ scale: cardScale }],
                  }}
                >
                  <Pressable
                    onPress={() => handleSelect(exam.id)}
                    style={[
                      styles.examCard,
                      {
                        backgroundColor: isActive
                          ? exam.color + '12'
                          : colors.surface,
                        borderColor: isActive
                          ? exam.color
                          : colors.surfaceBorder,
                        borderWidth: isActive ? 2 : 1,
                        ...(isActive ? Shadows.puffy : {}),
                      },
                    ]}
                  >
                    <Text style={styles.cardEmoji}>{exam.emoji}</Text>

                    <View style={styles.cardText}>
                      <View style={styles.cardTitleRow}>
                        <Text
                          style={[
                            Typography.h2,
                            {
                              color: isActive ? exam.color : colors.text,
                              fontSize: 22,
                            },
                          ]}
                        >
                          {exam.title}
                        </Text>
                        {isActive && (
                          <View
                            style={[
                              styles.checkBadge,
                              { backgroundColor: exam.color },
                            ]}
                          >
                            <Text style={styles.checkMark}>
                              {'\u2713'}
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text
                        style={[
                          Typography.bodySm,
                          {
                            color: isActive
                              ? exam.color + 'CC'
                              : colors.textSecondary,
                            fontFamily: 'PlusJakartaSans_600SemiBold',
                          },
                        ]}
                      >
                        {exam.subtitle}
                      </Text>

                      <Text
                        style={[
                          Typography.bodySm,
                          { color: colors.textTertiary, marginTop: 2 },
                        ]}
                      >
                        {exam.desc}
                      </Text>
                    </View>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>

          {/* CTA */}
          <View style={styles.actions}>
            <PuffyButton
              title={
                selected === 'NEET'
                  ? 'Continue'
                  : selected
                    ? 'Pick Subjects'
                    : 'Select an exam'
              }
              icon={selected ? '\u2728' : undefined}
              onPress={handleContinue}
              disabled={!selected}
            />
          </View>
        </Animated.View>
      </SafeAreaView>
    </DotGridBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
  },
  headerEmoji: {
    fontSize: 48,
  },
  cards: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },
  examCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius.xl,
  },
  cardEmoji: {
    fontSize: 40,
  },
  cardText: {
    flex: 1,
    gap: 2,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  actions: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
});
