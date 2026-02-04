import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { StickyNote } from '../../src/components/ui/StickyNote';
import { PuffyButton } from '../../src/components/ui/PuffyButton';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { useToast } from '../../src/components/ui/Toast';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { SQUAD_PRICING, GANG_NAME_SUGGESTIONS } from '../../src/types';
import { RootState } from '../../src/store';
import { createSquad } from '../../src/store/slices/squadSlice';

const GANG_EMOJIS = [
  '\uD83D\uDC7E', '\uD83D\uDD25', '\uD83E\uDDE0', '\u26A1',
  '\uD83D\uDE80', '\uD83C\uDFC6', '\uD83D\uDC8E', '\uD83E\uDD16',
];

export default function SquadSetupScreen() {
  const { colors, mode } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useToast();
  const user = useSelector((state: RootState) => state.auth.user);
  const squad = useSelector((state: RootState) => state.squad.squad);

  const [gangName, setGangName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(GANG_EMOJIS[0]);
  const [created, setCreated] = useState(false);

  // Animations
  const confettiScale = useRef(new Animated.Value(0)).current;

  const handleCreate = useCallback(() => {
    if (gangName.trim().length < 2) {
      toast.show('error', 'Give your gang a name (min 2 chars)');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dispatch(
      createSquad({
        name: gangName.trim(),
        emoji: selectedEmoji,
        leaderName: user?.name ?? 'Leader',
      })
    );

    setCreated(true);
    Animated.spring(confettiScale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, [gangName, selectedEmoji, user?.name]);

  const handleCopyCode = async () => {
    if (!squad) return;
    await Clipboard.setStringAsync(squad.inviteCode);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toast.show('success', 'Code copied!');
  };

  const handleShare = async () => {
    if (!squad) return;
    try {
      await Share.share({
        message: `Join my Study Gang "${squad.name}" ${squad.emoji} on VaNi!\n\nUse code: ${squad.inviteCode}\n\nLet's crack NEET together! Download VaNi app.`,
      });
    } catch {
      // share dismissed
    }
  };

  const handleContinue = () => {
    const exam = user?.exam;
    if (exam === 'NEET') {
      router.replace('/(auth)/trial-welcome');
    } else if (exam) {
      router.push('/(auth)/subject-picker');
    } else {
      router.replace('/(auth)/trial-welcome');
    }
  };

  const useSuggestion = (name: string) => {
    setGangName(name);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {!created ? (
            <>
              {/* Header */}
              <View style={styles.header}>
                <Text style={{ fontSize: 48 }}>{selectedEmoji}</Text>
                <Text style={[Typography.h1, { color: colors.text }]}>
                  Name Your Gang
                </Text>
                <HandwrittenText variant="hand" rotation={1}>
                  make it legendary...
                </HandwrittenText>
              </View>

              {/* Emoji Picker */}
              <JournalCard rotation={-0.3} delay={100}>
                <View style={styles.section}>
                  <Text style={[Typography.h3, { color: colors.text }]}>
                    Pick your emblem
                  </Text>
                  <View style={styles.emojiRow}>
                    {GANG_EMOJIS.map((e) => (
                      <Pressable
                        key={e}
                        onPress={() => {
                          setSelectedEmoji(e);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                        style={[
                          styles.emojiBtn,
                          {
                            backgroundColor:
                              selectedEmoji === e
                                ? colors.primary + '25'
                                : colors.surface,
                            borderColor:
                              selectedEmoji === e
                                ? colors.primary
                                : colors.surfaceBorder,
                          },
                        ]}
                      >
                        <Text style={styles.emojiBtnText}>{e}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </JournalCard>

              {/* Gang Name */}
              <JournalCard rotation={0.2} delay={200}>
                <View style={styles.section}>
                  <Text style={[Typography.h3, { color: colors.text }]}>
                    Gang name
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: colors.text,
                        backgroundColor: colors.surface,
                        borderColor: colors.surfaceBorder,
                      },
                    ]}
                    placeholder="e.g. Brain Squad"
                    placeholderTextColor={colors.textTertiary}
                    value={gangName}
                    onChangeText={setGangName}
                    maxLength={24}
                    autoCapitalize="words"
                  />

                  {/* Suggestions */}
                  <View style={styles.suggestRow}>
                    {GANG_NAME_SUGGESTIONS.slice(0, 4).map((s) => (
                      <Pressable
                        key={s}
                        onPress={() => useSuggestion(s)}
                        style={[
                          styles.suggestChip,
                          { borderColor: colors.surfaceBorder },
                        ]}
                      >
                        <Text
                          style={[
                            styles.suggestText,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {s}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </JournalCard>

              {/* Pricing Breakdown */}
              <StickyNote color="yellow" rotation={-0.5} delay={300}>
                <View style={styles.section}>
                  <HandwrittenText variant="handSm">
                    bigger gang = bigger savings
                  </HandwrittenText>
                  <View style={styles.priceList}>
                    {SQUAD_PRICING.map((tier) => (
                      <View key={tier.size} style={styles.priceRow}>
                        <Text style={[styles.priceLabel, { color: colors.text }]}>
                          {tier.label} ({tier.size})
                        </Text>
                        <View style={styles.priceRight}>
                          <Text style={[styles.priceAmount, { color: colors.text }]}>
                            {'\u20B9'}{tier.pricePerUser}/mo
                          </Text>
                          {tier.discount > 0 && (
                            <Text style={styles.priceSave}>
                              -{tier.discount}%
                            </Text>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </StickyNote>

              <View style={styles.actions}>
                <PuffyButton
                  title="Create My Gang"
                  icon={'\uD83D\uDC7E'}
                  onPress={handleCreate}
                  disabled={gangName.trim().length < 2}
                />
              </View>
            </>
          ) : (
            <>
              {/* Created State */}
              <Animated.View
                style={[
                  styles.header,
                  {
                    transform: [{ scale: confettiScale }],
                  },
                ]}
              >
                <Text style={{ fontSize: 64 }}>{squad?.emoji}</Text>
                <Text style={[Typography.h1, { color: colors.text }]}>
                  {squad?.name}
                </Text>
                <HandwrittenText variant="hand" rotation={-1}>
                  your gang is born!
                </HandwrittenText>
              </Animated.View>

              {/* Invite Code */}
              <JournalCard rotation={0.3}>
                <View style={[styles.section, { alignItems: 'center' }]}>
                  <Text style={[Typography.h3, { color: colors.text }]}>
                    Invite Code
                  </Text>
                  <Pressable onPress={handleCopyCode} style={styles.codeBox}>
                    <Text style={[styles.codeText, { color: colors.primary }]}>
                      {squad?.inviteCode}
                    </Text>
                    <Text style={styles.codeCopy}>tap to copy</Text>
                  </Pressable>
                  <Text
                    style={[
                      Typography.bodySm,
                      { color: colors.textTertiary, textAlign: 'center' },
                    ]}
                  >
                    Share this code with your friends.{'\n'}
                    They enter it when they sign up!
                  </Text>
                </View>
              </JournalCard>

              {/* Share Button */}
              <StickyNote color="pink" rotation={-0.8}>
                <Pressable onPress={handleShare} style={styles.shareBtn}>
                  <Text style={{ fontSize: 24 }}>{'\uD83D\uDCE8'}</Text>
                  <View>
                    <Text
                      style={[
                        Typography.body,
                        {
                          color: colors.text,
                          fontFamily: 'PlusJakartaSans_600SemiBold',
                        },
                      ]}
                    >
                      Share with your crew
                    </Text>
                    <Text
                      style={[Typography.bodySm, { color: colors.textSecondary }]}
                    >
                      WhatsApp, Instagram, anywhere
                    </Text>
                  </View>
                </Pressable>
              </StickyNote>

              {/* Waiting list */}
              <JournalCard rotation={-0.2}>
                <View style={styles.section}>
                  <Text style={[Typography.h3, { color: colors.text }]}>
                    {squad?.emoji} {squad?.name} members
                  </Text>
                  {squad?.members.map((m, i) => (
                    <View key={i} style={styles.memberRow}>
                      <View
                        style={[
                          styles.memberAvatar,
                          { backgroundColor: colors.primary + '20' },
                        ]}
                      >
                        <Text style={styles.memberInitial}>
                          {m.name[0]?.toUpperCase()}
                        </Text>
                      </View>
                      <Text style={[Typography.body, { color: colors.text, flex: 1 }]}>
                        {m.name}
                      </Text>
                      <Text
                        style={[
                          styles.memberRole,
                          { color: colors.primary },
                        ]}
                      >
                        {m.role === 'leader' ? 'Leader' : 'Member'}
                      </Text>
                    </View>
                  ))}
                  {Array.from({
                    length: (squad?.maxMembers ?? 4) - (squad?.members.length ?? 1),
                  }).map((_, i) => (
                    <View key={`empty-${i}`} style={styles.memberRow}>
                      <View
                        style={[
                          styles.memberAvatar,
                          {
                            backgroundColor: colors.surfaceBorder + '40',
                            borderStyle: 'dashed',
                            borderWidth: 1,
                            borderColor: colors.surfaceBorder,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.memberInitial,
                            { color: colors.textTertiary },
                          ]}
                        >
                          ?
                        </Text>
                      </View>
                      <Text
                        style={[Typography.body, { color: colors.textTertiary }]}
                      >
                        Waiting for member...
                      </Text>
                    </View>
                  ))}
                </View>
              </JournalCard>

              <View style={styles.actions}>
                <PuffyButton
                  title="Continue to App"
                  icon={'\u2728'}
                  onPress={handleContinue}
                />
                <Pressable onPress={handleShare}>
                  <Text
                    style={[
                      styles.shareAgain,
                      { color: colors.primary },
                    ]}
                  >
                    Share invite again
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </DotGridBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    padding: Spacing.xl,
    gap: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  section: {
    gap: Spacing.md,
  },
  emojiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  emojiBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiBtnText: {
    fontSize: 24,
  },
  input: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 18,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 4,
    textAlign: 'center',
  },
  suggestRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  suggestChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  suggestText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
  },
  priceList: {
    gap: Spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
  },
  priceRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  priceAmount: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
  },
  priceSave: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 11,
    color: '#16A34A',
    backgroundColor: '#22C55E20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  actions: {
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  codeBox: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  codeText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 36,
    letterSpacing: 6,
  },
  codeCopy: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInitial: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 16,
  },
  memberRole: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
  },
  shareAgain: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
