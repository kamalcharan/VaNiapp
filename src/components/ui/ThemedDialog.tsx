import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';

const SCREEN_W = Dimensions.get('window').width;

interface ThemedDialogProps {
  visible: boolean;
  title: string;
  message: string;
  emoji?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function ThemedDialog({
  visible,
  title,
  message,
  emoji = '\uD83D\uDE15',
  confirmLabel = 'Got it',
  cancelLabel,
  onConfirm,
  onCancel,
}: ThemedDialogProps) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 7,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0.85);
      opacity.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible}>
      <Animated.View style={[styles.overlay, { opacity }]}>
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.surfaceBorder,
              transform: [{ scale }],
            },
          ]}
        >
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={[Typography.h2, { color: colors.text, textAlign: 'center' }]}>
            {title}
          </Text>
          <Text
            style={[
              Typography.bodySm,
              { color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
            ]}
          >
            {message}
          </Text>

          <View style={styles.actions}>
            {cancelLabel && onCancel && (
              <Pressable
                onPress={onCancel}
                style={[styles.btn, { backgroundColor: colors.background, borderColor: colors.surfaceBorder, borderWidth: 1 }]}
              >
                <Text style={[styles.btnText, { color: colors.textSecondary }]}>
                  {cancelLabel}
                </Text>
              </Pressable>
            )}
            <Pressable
              onPress={onConfirm}
              style={[
                styles.btn,
                styles.primaryBtn,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={[styles.btnText, { color: '#FFFFFF' }]}>
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  card: {
    width: SCREEN_W - 48,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
    ...Shadows.puffy,
  },
  emoji: {
    fontSize: 40,
    marginBottom: Spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
    width: '100%',
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  btnText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
  },
});
