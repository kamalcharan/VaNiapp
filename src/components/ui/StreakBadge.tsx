import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';

interface StreakBadgeProps {
  streak: number;
  label?: string;
}

/**
 * Animated streak badge with fire emoji and glow.
 * Shows daily streak count with a pulsing fire animation.
 */
export function StreakBadge({ streak, label = 'Day Streak' }: StreakBadgeProps) {
  const { colors } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (streak <= 0) return;

    // Pulse the fire emoji
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    // Glow the background
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: false,
        }),
      ])
    );

    pulse.start();
    glow.start();

    return () => {
      pulse.stop();
      glow.stop();
    };
  }, [streak]);

  const bgColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F59E0B15', '#F59E0B30'],
  });

  if (streak <= 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
        <Text style={styles.fireEmoji}>{'\uD83D\uDD25'}</Text>
        <View>
          <Text style={[styles.streakCount, { color: colors.textTertiary }]}>0</Text>
          <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>Start a streak!</Text>
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          borderColor: '#F59E0B40',
        },
      ]}
    >
      <Animated.Text style={[styles.fireEmoji, { transform: [{ scale: pulseAnim }] }]}>
        {streak >= 7 ? '\uD83D\uDD25' : streak >= 3 ? '\uD83D\uDD25' : '\u2B50'}
      </Animated.Text>
      <View>
        <Text style={[styles.streakCount, { color: '#F59E0B' }]}>{streak}</Text>
        <Text style={[Typography.bodySm, { color: '#B45309' }]}>{label}</Text>
      </View>
      {streak >= 7 && (
        <View style={styles.crownWrap}>
          <Text style={styles.crown}>{'\uD83D\uDC51'}</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  fireEmoji: {
    fontSize: 28,
  },
  streakCount: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 24,
    lineHeight: 28,
  },
  crownWrap: {
    marginLeft: 'auto',
  },
  crown: {
    fontSize: 20,
  },
});
