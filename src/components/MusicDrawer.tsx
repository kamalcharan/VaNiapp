import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../constants/theme';
import { TRACKS, Track } from '../constants/tracks';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface MusicDrawerProps {
  visible: boolean;
  currentTrackIndex: number | null;
  isPlaying: boolean;
  onSelectTrack: (index: number) => void;
  onTogglePlay: () => void;
  onClose: () => void;
  onStop: () => void;
}

export function MusicDrawer({
  visible,
  currentTrackIndex,
  isPlaying,
  onSelectTrack,
  onTogglePlay,
  onClose,
  onStop,
}: MusicDrawerProps) {
  const { colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <Animated.View
          style={[
            styles.drawer,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.surfaceBorder,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Handle */}
          <View style={styles.handleRow}>
            <View style={[styles.handle, { backgroundColor: colors.surfaceBorder }]} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={[Typography.h3, { color: colors.text }]}>
              {'\uD83C\uDFB5'} Focus Music
            </Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={[Typography.body, { color: colors.textSecondary }]}>Done</Text>
            </Pressable>
          </View>

          {/* Track List */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
            {TRACKS.map((track, idx) => {
              const isCurrent = idx === currentTrackIndex;
              const isCurrentPlaying = isCurrent && isPlaying;

              return (
                <Pressable
                  key={track.id}
                  onPress={() => onSelectTrack(idx)}
                  style={[
                    styles.trackRow,
                    {
                      backgroundColor: isCurrent ? colors.primary + '12' : 'transparent',
                      borderColor: isCurrent ? colors.primary : colors.surfaceBorder,
                    },
                  ]}
                >
                  <Text style={styles.trackEmoji}>{track.emoji}</Text>
                  <View style={styles.trackInfo}>
                    <Text
                      style={[
                        styles.trackTitle,
                        { color: isCurrent ? colors.primary : colors.text },
                      ]}
                      numberOfLines={1}
                    >
                      {track.title}
                    </Text>
                    <Text style={[styles.trackArtist, { color: colors.textTertiary }]}>
                      {track.artist}
                    </Text>
                  </View>
                  {isCurrentPlaying && (
                    <Text style={[styles.playingBadge, { color: colors.primary }]}>
                      {'\u266A'} Playing
                    </Text>
                  )}
                  {isCurrent && !isPlaying && (
                    <Text style={[styles.playingBadge, { color: colors.textTertiary }]}>
                      Paused
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Stop button */}
          {currentTrackIndex !== null && (
            <Pressable
              onPress={onStop}
              style={[styles.stopBtn, { borderColor: colors.surfaceBorder }]}
            >
              <Text style={[Typography.bodySm, { color: '#EF4444' }]}>
                {'\u23F9\uFE0F'} Stop Music
              </Text>
            </Pressable>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawer: {
    maxHeight: SCREEN_HEIGHT * 0.65,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    paddingBottom: 34, // safe area bottom
  },
  handleRow: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  trackEmoji: {
    fontSize: 24,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
  },
  trackArtist: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    marginTop: 2,
  },
  playingBadge: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
  },
  stopBtn: {
    alignSelf: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.sm,
  },
});
