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
import { StickyNote } from '../../src/components/ui/StickyNote';
import { PuffyButton } from '../../src/components/ui/PuffyButton';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { useTheme } from '../../src/hooks/useTheme';
import {
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
} from '../../src/constants/theme';
import { useOnboarding } from './_layout';
import { Language } from '../../src/types';

// ── Language options ─────────────────────────────────────────

const LANGUAGES: {
  id: Language;
  label: string;
  native: string;
  emoji: string;
  desc: string;
}[] = [
  {
    id: 'en',
    label: 'English',
    native: 'English',
    emoji: '\uD83C\uDDEC\uD83C\uDDE7',
    desc: 'Questions, explanations & UI in English',
  },
  {
    id: 'te',
    label: 'Telugu',
    native: '\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41',
    emoji: '\uD83C\uDDEE\uD83C\uDDF3',
    desc: 'Questions & explanations in Telugu, UI in English',
  },
];

export default function LanguageScreen() {
  const { colors, mode } = useTheme();
  const router = useRouter();
  const { data, update, setStep } = useOnboarding();

  const [selected, setSelected] = useState<Language>(data.language || 'en');

  useEffect(() => {
    setStep(5);
  }, []);

  const handleSelect = (id: Language) => {
    setSelected(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleContinue = () => {
    update({ language: selected });
    router.push('/setup/invite-gang');
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

  // Card stagger
  const cardAnims = useRef(LANGUAGES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      140,
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
            <Text style={styles.headerEmoji}>{'\uD83C\uDF10'}</Text>
            <Text style={[Typography.h1, { color: colors.text }]}>
              Your language
            </Text>
            <HandwrittenText variant="hand" rotation={1}>
              you can switch anytime!
            </HandwrittenText>
          </View>

          {/* Language Cards */}
          <View style={styles.cards}>
            {LANGUAGES.map((lang, index) => {
              const isActive = selected === lang.id;
              const cardScale = cardAnims[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0.85, 1],
              });

              return (
                <Animated.View
                  key={lang.id}
                  style={{
                    opacity: cardAnims[index],
                    transform: [{ scale: cardScale }],
                  }}
                >
                  <Pressable
                    onPress={() => handleSelect(lang.id)}
                    style={[
                      styles.langCard,
                      {
                        backgroundColor: isActive
                          ? colors.primary + '12'
                          : colors.surface,
                        borderColor: isActive
                          ? colors.primary
                          : colors.surfaceBorder,
                        borderWidth: isActive ? 2 : 1,
                        ...(isActive ? Shadows.puffy : {}),
                      },
                    ]}
                  >
                    <Text style={styles.langEmoji}>{lang.emoji}</Text>

                    <View style={styles.langText}>
                      <View style={styles.langTitleRow}>
                        <Text
                          style={[
                            Typography.h2,
                            {
                              color: isActive ? colors.primary : colors.text,
                              fontSize: 22,
                            },
                          ]}
                        >
                          {lang.native}
                        </Text>
                        {isActive && (
                          <View
                            style={[
                              styles.checkBadge,
                              { backgroundColor: colors.primary },
                            ]}
                          >
                            <Text style={styles.checkMark}>{'\u2713'}</Text>
                          </View>
                        )}
                      </View>

                      <Text
                        style={[
                          Typography.bodySm,
                          { color: colors.textTertiary },
                        ]}
                      >
                        {lang.desc}
                      </Text>
                    </View>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>

          {/* Note */}
          <View style={styles.noteWrap}>
            <StickyNote color="teal" rotation={-0.8} delay={200}>
              <HandwrittenText variant="handSm" color={colors.textSecondary}>
                More languages coming soon! Hindi, Tamil, Kannada...
              </HandwrittenText>
            </StickyNote>
          </View>

          {/* CTA */}
          <View style={styles.actions}>
            <PuffyButton
              title="Continue"
              icon={'\u2728'}
              onPress={handleContinue}
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
    paddingBottom: Spacing.xl,
  },
  headerEmoji: {
    fontSize: 48,
  },
  cards: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius.xl,
  },
  langEmoji: {
    fontSize: 36,
  },
  langText: {
    flex: 1,
    gap: 4,
  },
  langTitleRow: {
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
  noteWrap: {
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
  },
  actions: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
});
