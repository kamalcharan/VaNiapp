import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface Props {
  visible: boolean;
  onClose: () => void;
  eliminationText: string;
}

export function EliminationSheet({ visible, onClose, eliminationText }: Props) {
  const { colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Pressable onPress={() => {}}>
            {/* Handle bar */}
            <View style={styles.handleRow}>
              <View style={[styles.handle, { backgroundColor: colors.surfaceBorder }]} />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={[styles.headerIcon, { color: '#8B5CF6' }]}>{'\u2702\uFE0F'}</Text>
                <Text style={[Typography.h3, { color: colors.text }]}>Elimination Technique</Text>
              </View>
              <Pressable onPress={onClose} hitSlop={12}>
                <Text style={[styles.closeBtn, { color: colors.textSecondary }]}>Done</Text>
              </Pressable>
            </View>

            {/* Content */}
            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={[Typography.body, { color: colors.text, lineHeight: 24 }]}>
                {eliminationText}
              </Text>
            </ScrollView>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: SCREEN_HEIGHT * 0.6,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    fontSize: 18,
  },
  closeBtn: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
  },
  scrollArea: {
    maxHeight: SCREEN_HEIGHT * 0.45,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
});
