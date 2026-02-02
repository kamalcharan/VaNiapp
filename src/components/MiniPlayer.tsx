import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../constants/theme';
import { Track } from '../constants/tracks';

interface MiniPlayerProps {
  track: Track | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSkipNext: () => void;
  onOpenDrawer: () => void;
}

export function MiniPlayer({ track, isPlaying, onTogglePlay, onSkipNext, onOpenDrawer }: MiniPlayerProps) {
  const { colors } = useTheme();

  if (!track) {
    // No track selected — show compact start button
    return (
      <Pressable
        onPress={onOpenDrawer}
        style={[styles.startBtn, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
      >
        <Text style={styles.musicIcon}>{'\uD83C\uDFB5'}</Text>
        <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Music</Text>
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
      <Pressable onPress={onOpenDrawer} style={styles.trackInfo}>
        <Text style={styles.trackEmoji}>{track.emoji}</Text>
        <View style={styles.trackText}>
          <Text style={[styles.trackTitle, { color: colors.text }]} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={[styles.trackArtist, { color: colors.textTertiary }]} numberOfLines={1}>
            {track.artist}
          </Text>
        </View>
      </Pressable>

      <View style={styles.controls}>
        <Pressable onPress={onTogglePlay} hitSlop={8} style={styles.controlBtn}>
          <Text style={[styles.controlIcon, { color: colors.primary }]}>
            {isPlaying ? '\u23F8\uFE0F' : '\u25B6\uFE0F'}
          </Text>
        </Pressable>
        <Pressable onPress={onSkipNext} hitSlop={8} style={styles.controlBtn}>
          <Text style={[styles.controlIcon, { color: colors.textSecondary }]}>
            {'\u23ED\uFE0F'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  startBtn: {
    position: 'absolute',
    right: Spacing.md,
    bottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  musicIcon: {
    fontSize: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  trackInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  trackEmoji: {
    fontSize: 20,
  },
  trackText: {
    flex: 1,
  },
  trackTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
  },
  trackArtist: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  controlBtn: {
    padding: 6,
  },
  controlIcon: {
    fontSize: 20,
  },
});
