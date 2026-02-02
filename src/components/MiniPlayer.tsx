import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius } from '../constants/theme';
import { Track } from '../constants/tracks';

interface MiniPlayerProps {
  track: Track | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSkipNext: () => void;
  onOpenDrawer: () => void;
  /** When true, renders as a compact pill at top-right (for exam screens). */
  compact?: boolean;
}

export function MiniPlayer({
  track,
  isPlaying,
  onTogglePlay,
  onSkipNext,
  onOpenDrawer,
  compact = false,
}: MiniPlayerProps) {
  const { colors } = useTheme();

  /* ── Compact mode (exam screens) ─────────────────────────── */
  if (compact) {
    return (
      <View style={styles.compactWrap}>
        <Pressable
          onPress={onOpenDrawer}
          style={[
            styles.compactPill,
            {
              backgroundColor: colors.surface,
              borderColor: colors.surfaceBorder,
            },
          ]}
        >
          <Text style={styles.compactEmoji}>{track ? track.emoji : '\uD83C\uDFB5'}</Text>
          {track && (
            <Pressable onPress={onTogglePlay} hitSlop={10}>
              <Text style={[styles.compactControl, { color: colors.primary }]}>
                {isPlaying ? '\u23F8\uFE0F' : '\u25B6\uFE0F'}
              </Text>
            </Pressable>
          )}
        </Pressable>
      </View>
    );
  }

  /* ── Full mode (non-exam screens) ────────────────────────── */
  if (!track) {
    return (
      <Pressable
        onPress={onOpenDrawer}
        style={[styles.fab, { backgroundColor: colors.primary }]}
      >
        <Text style={styles.fabIcon}>{'\uD83C\uDFB5'}</Text>
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
  /* ── Compact (exam screens) ── */
  compactWrap: {
    position: 'absolute',
    top: 58,
    left: Spacing.lg,
    zIndex: 999,
  },
  compactPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  compactEmoji: {
    fontSize: 16,
  },
  compactControl: {
    fontSize: 16,
  },

  /* ── Full FAB (non-exam, no track) ── */
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: 110,
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    zIndex: 999,
  },
  fabIcon: {
    fontSize: 22,
  },

  /* ── Full bar (non-exam, playing) ── */
  container: {
    position: 'absolute',
    left: Spacing.md,
    right: Spacing.md,
    bottom: 110,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    zIndex: 999,
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
