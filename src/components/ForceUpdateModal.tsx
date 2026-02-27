import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  Linking,
  Platform,
} from 'react-native';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { useTheme } from '../hooks/useTheme';
import type { UpdateInfo } from '../hooks/useForceUpdate';

const SCREEN_W = Dimensions.get('window').width;

interface ForceUpdateModalProps {
  update: UpdateInfo;
  onSkip?: () => void;
}

export function ForceUpdateModal({ update, onSkip }: ForceUpdateModalProps) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
  }, []);

  const platformLabel = Platform.OS === 'ios' ? 'App Store' : 'Download';

  const handleDownload = () => {
    if (update.downloadUrl) {
      Linking.openURL(update.downloadUrl);
    }
  };

  return (
    <Modal transparent animationType="none" visible>
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
          <Text style={styles.emoji}>{'\uD83D\uDE80'}</Text>

          <Text style={[Typography.h2, { color: colors.text, textAlign: 'center' }]}>
            New version available!
          </Text>

          <Text
            style={[
              Typography.bodySm,
              { color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
            ]}
          >
            v{update.latestVersion} is out.{' '}
            {update.releaseNotes
              ? update.releaseNotes
              : 'Please update for the best experience.'}
          </Text>

          <View style={styles.actions}>
            {update.downloadUrl ? (
              <Pressable
                onPress={handleDownload}
                style={[styles.btn, styles.primaryBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.btnText, { color: '#FFFFFF' }]}>
                  Update from {platformLabel}
                </Text>
              </Pressable>
            ) : (
              <Text
                style={[
                  Typography.bodySm,
                  { color: colors.textTertiary, textAlign: 'center' },
                ]}
              >
                Update link not available yet — check back soon!
              </Text>
            )}

            {update.isSkippable && onSkip && (
              <Pressable onPress={onSkip} style={styles.skipBtn}>
                <Text style={[styles.btnText, { color: colors.textTertiary }]}>
                  Skip for now
                </Text>
              </Pressable>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    fontSize: 48,
    marginBottom: Spacing.xs,
  },
  actions: {
    marginTop: Spacing.md,
    width: '100%',
  },
  btn: {
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
  skipBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
  },
});
