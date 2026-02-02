import React, { useEffect, useRef, useState } from 'react';
import { Text, Animated, TextStyle, StyleProp } from 'react-native';

interface CountUpTextProps {
  value: number;
  suffix?: string;
  duration?: number;
  style?: StyleProp<TextStyle>;
}

/**
 * Animated count-up number text.
 * Counts from 0 to target value with easing.
 */
export function CountUpText({ value, suffix = '', duration = 1200, style }: CountUpTextProps) {
  const animValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    animValue.setValue(0);

    const listener = animValue.addListener(({ value: v }) => {
      setDisplayValue(Math.round(v));
    });

    Animated.timing(animValue, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();

    return () => {
      animValue.removeListener(listener);
    };
  }, [value, duration]);

  return (
    <Text style={style}>
      {displayValue}{suffix}
    </Text>
  );
}
