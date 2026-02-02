import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import * as Haptics from 'expo-haptics';
import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { SQUAD_PRICING } from '../../src/types';
import { RootState } from '../../src/store';
import { setPlanType } from '../../src/store/slices/squadSlice';

const { width: SW } = Dimensions.get('window');

const PERKS = [
  { emoji: '\uD83C\uDFC6', text: 'Squad Leaderboard' },
  { emoji: '\uD83D\uDD25', text: 'Streak Challenges' },
  { emoji: '\uD83D\uDCB0', text: 'Up to 20% off' },
  { emoji: '\uD83E\uDD1D', text: 'Accountability' },
];

export default function SquadPitchScreen() {
  const { colors, mode } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  // Animations
  const fadeTitle = useRef(new Animated.Value(0)).current;
  const fadeSolo = useRef(new Animated.Value(0)).current;
  const fadeGang = useRef(new Animated.Value(0)).current;
  const fadePerks = useRef(new Animated.Value(0)).current;
  const scaleGang = useRef(new Animated.Value(0.9)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(fadeTitle, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeSolo, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(fadeGang, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(scaleGang, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]),
      Animated.timing(fadePerks, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    // Pulsing glow on gang card
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1200, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1200, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const gangBorderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.primary, '#F59E0B'],
  });

  const handleSolo = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    dispatch(setPlanType('solo'));

    const exam = user?.exam;
    if (exam === 'NEET') {
      router.replace('/(auth)/trial-welcome');
    } else if (exam) {
      router.push('/(auth)/subject-picker');
    } else {
      router.replace('/(auth)/trial-welcome');
    }
  };

  const handleGang = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(auth)/squad-setup');
  };

  const squadPrice = SQUAD_PRICING[3]; // 4-person squad

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Title */}
        <Animated.View style={[styles.header, { opacity: fadeTitle }]}>
          <Text style={{ fontSize: 52 }}>{'\uD83E\uDD14'}</Text>
          <Text style={[Typography.h1, { color: colors.text, textAlign: 'center' }]}>
            How do you want{'\n'}to prepare?
          </Text>
          <HandwrittenText variant="hand" rotation={-1}>
            choose wisely...
          </HandwrittenText>
        </Animated.View>

        <View style={styles.cards}>
          {/* Solo Card */}
          <Animated.View style={{ opacity: fadeSolo }}>
            <Pressable
              onPress={handleSolo}
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.surfaceBorder,
                },
              ]}
            >
              <Text style={styles.cardEmoji}>{'\uD83D\uDE4D'}</Text>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Solo
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                I work best alone
              </Text>
              <View style={[styles.priceTag, { backgroundColor: colors.surfaceBorder + '60' }]}>
                <Text style={[styles.priceText, { color: colors.text }]}>
                  {'\u20B9'}200/mo
                </Text>
              </View>
            </Pressable>
          </Animated.View>

          {/* Gang Card — featured */}
          <Animated.View
            style={{
              opacity: fadeGang,
              transform: [{ scale: scaleGang }],
            }}
          >
            <Animated.View
              style={[
                styles.card,
                styles.gangCard,
                {
                  backgroundColor: mode === 'dark' ? '#1E293B' : '#FFF7ED',
                  borderColor: gangBorderColor,
                },
              ]}
            >
              {/* Recommended badge */}
              <View style={styles.recBadge}>
                <Text style={styles.recText}>{'\u2B50'} RECOMMENDED</Text>
              </View>

              <Pressable onPress={handleGang} style={styles.gangInner}>
                <Text style={styles.cardEmoji}>{'\uD83D\uDC7E'}</Text>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  Study Gang
                </Text>
                <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                  Bring your crew, dominate together
                </Text>

                <View style={styles.priceRow}>
                  <View style={[styles.priceTag, { backgroundColor: '#22C55E20' }]}>
                    <Text style={[styles.priceText, { color: '#16A34A' }]}>
                      {'\u20B9'}{squadPrice.pricePerUser}/mo each
                    </Text>
                  </View>
                  <View style={[styles.discountTag, { backgroundColor: '#F59E0B20' }]}>
                    <Text style={styles.discountText}>
                      {squadPrice.discount}% OFF
                    </Text>
                  </View>
                </View>

                <Text style={[styles.gangHook, { color: colors.textTertiary }]}>
                  2-4 friends {'\u2022'} squad leaderboard {'\u2022'} compete daily
                </Text>
              </Pressable>
            </Animated.View>
          </Animated.View>
        </View>

        {/* Gang Perks */}
        <Animated.View style={[styles.perksRow, { opacity: fadePerks }]}>
          {PERKS.map((p, i) => (
            <View key={i} style={[styles.perk, { backgroundColor: colors.surface }]}>
              <Text style={styles.perkEmoji}>{p.emoji}</Text>
              <Text style={[styles.perkText, { color: colors.textSecondary }]}>
                {p.text}
              </Text>
            </View>
          ))}
        </Animated.View>

        {/* Skip */}
        <Animated.View style={[styles.skipWrap, { opacity: fadePerks }]}>
          <Pressable onPress={handleSolo}>
            <Text style={[styles.skipText, { color: colors.textTertiary }]}>
              I'll decide later, continue solo
            </Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </DotGridBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  cards: {
    gap: Spacing.lg,
  },
  card: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  gangCard: {
    borderWidth: 2,
    position: 'relative',
    overflow: 'visible',
  },
  gangInner: {
    alignItems: 'center',
    gap: Spacing.sm,
    width: '100%',
  },
  recBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  recText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  cardEmoji: {
    fontSize: 36,
    marginTop: Spacing.sm,
  },
  cardTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 22,
  },
  cardSubtitle: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  priceTag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
  },
  priceText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
  },
  discountTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
  },
  discountText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 12,
    color: '#D97706',
  },
  gangHook: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  perksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  perk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  perkEmoji: {
    fontSize: 14,
  },
  perkText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
  },
  skipWrap: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  skipText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
