import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const PARTICLE_COUNT = 24;

const CONFETTI_COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444', '#A855F7', '#EC4899', '#14B8A6'];

interface Particle {
  x: Animated.Value;
  y: Animated.Value;
  rotate: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  color: string;
  size: number;
  shape: 'circle' | 'square' | 'rect';
}

interface ConfettiBurstProps {
  trigger: boolean;
  originY?: number;
}

/**
 * Confetti burst celebration overlay.
 * Set trigger=true to fire, resets when trigger goes false.
 */
export function ConfettiBurst({ trigger, originY = SCREEN_H * 0.35 }: ConfettiBurstProps) {
  const particles = useRef<Particle[]>(
    Array.from({ length: PARTICLE_COUNT }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 8,
      shape: (['circle', 'square', 'rect'] as const)[Math.floor(Math.random() * 3)],
    }))
  ).current;

  useEffect(() => {
    if (!trigger) return;

    const animations = particles.map((p) => {
      // Reset
      p.x.setValue(SCREEN_W / 2);
      p.y.setValue(originY);
      p.opacity.setValue(1);
      p.scale.setValue(0);
      p.rotate.setValue(0);

      const targetX = Math.random() * SCREEN_W;
      const targetY = originY - 80 - Math.random() * 200;
      const fallY = SCREEN_H + 50;
      const duration = 600 + Math.random() * 400;
      const delay = Math.random() * 150;

      return Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          // Burst out
          Animated.timing(p.x, {
            toValue: targetX,
            duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            // Rise
            Animated.timing(p.y, {
              toValue: targetY,
              duration: duration * 0.5,
              useNativeDriver: true,
            }),
            // Fall with gravity
            Animated.timing(p.y, {
              toValue: fallY,
              duration: duration * 1.2,
              useNativeDriver: true,
            }),
          ]),
          Animated.spring(p.scale, {
            toValue: 1,
            useNativeDriver: true,
            damping: 8,
            stiffness: 200,
          }),
          Animated.timing(p.rotate, {
            toValue: 2 + Math.random() * 6,
            duration: duration * 1.7,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(duration * 0.8),
            Animated.timing(p.opacity, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]);
    });

    Animated.parallel(animations).start();
  }, [trigger]);

  if (!trigger) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((p, i) => {
        const borderRadius = p.shape === 'circle' ? p.size / 2 : p.shape === 'square' ? 2 : 1;
        const w = p.shape === 'rect' ? p.size * 1.8 : p.size;
        const h = p.shape === 'rect' ? p.size * 0.6 : p.size;

        return (
          <Animated.View
            key={i}
            style={[
              {
                position: 'absolute',
                width: w,
                height: h,
                borderRadius,
                backgroundColor: p.color,
                opacity: p.opacity,
                transform: [
                  { translateX: p.x },
                  { translateY: p.y },
                  { scale: p.scale },
                  {
                    rotate: p.rotate.interpolate({
                      inputRange: [0, 8],
                      outputRange: ['0deg', '2880deg'],
                    }),
                  },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
});
