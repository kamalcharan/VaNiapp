import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { StickyNote } from '../../src/components/ui/StickyNote';
import { PuffyButton } from '../../src/components/ui/PuffyButton';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { AnimatedPressable } from '../../src/components/ui/AnimatedPressable';
import { useToast } from '../../src/components/ui/Toast';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { RootState } from '../../src/store';
import { SUBJECT_META } from '../../src/constants/subjects';
import { logout } from '../../src/store/slices/authSlice';
import { SQUAD_PRICING } from '../../src/types';
import { StrengthMap } from '../../src/components/StrengthMap';

export default function ProfileScreen() {
  const { colors, mode, toggle } = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);
  const squad = useSelector((state: RootState) => state.squad.squad);
  const planType = useSelector((state: RootState) => state.squad.planType);
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();

  const examLabel =
    user?.exam === 'BOTH' ? 'NEET + CUET' : user?.exam ?? 'NEET';
  const langLabel = user?.language === 'te' ? 'Telugu' : 'English';

  const neetSubjects = (user?.selectedSubjects ?? []).filter((id) =>
    ['physics', 'chemistry', 'botany', 'zoology'].includes(id)
  );
  const cuetSubjects = (user?.selectedSubjects ?? []).filter(
    (id) => !['physics', 'chemistry', 'botany', 'zoology'].includes(id)
  );

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            router.replace('/(auth)/welcome');
          },
        },
      ]
    );
  };

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={{ fontSize: 24 }}>{'\u270D\uFE0F'}</Text>
              <Text style={[Typography.h1, { color: colors.text }]}>My Profile</Text>
            </View>
            <Pressable onPress={toggle} style={styles.themeToggle}>
              <Text style={{ fontSize: 22 }}>
                {mode === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19'}
              </Text>
            </Pressable>
          </View>

          {/* Profile Card */}
          <StickyNote color="teal" rotation={1} delay={100}>
            <View style={styles.profileCard}>
              <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
                <Text style={styles.avatarEmoji}>{'\uD83E\uDDD1\u200D\uD83C\uDF93'}</Text>
              </View>
              <Text style={[Typography.h2, { color: colors.text }]}>
                {user?.name ?? 'Student'}
              </Text>
              {user?.email ? (
                <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                  {user.email}
                </Text>
              ) : null}
              <View style={[styles.examBadge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[Typography.label, { color: colors.primary }]}>
                  {examLabel} ASPIRANT
                </Text>
              </View>
            </View>
          </StickyNote>

          {/* Info Card */}
          <JournalCard delay={200}>
            <View style={styles.cardHeader}>
              <Text style={[Typography.label, { color: colors.textTertiary }]}>
                DETAILS
              </Text>
              <Pressable
                onPress={() => router.push('/edit-profile')}
                style={[styles.editBtn, { backgroundColor: colors.primaryLight }]}
              >
                <Text style={{ fontSize: 14 }}>{'\u270F\uFE0F'}</Text>
                <Text style={[Typography.bodySm, { color: colors.primary, fontFamily: 'PlusJakartaSans_600SemiBold' }]}>
                  Edit
                </Text>
              </Pressable>
            </View>

            <View style={styles.infoRow}>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Name</Text>
              <Text style={[Typography.body, { color: colors.text, fontFamily: 'PlusJakartaSans_600SemiBold' }]}>
                {user?.name ?? '-'}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />

            <View style={styles.infoRow}>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Exam</Text>
              <Text style={[Typography.body, { color: colors.text, fontFamily: 'PlusJakartaSans_600SemiBold' }]}>
                {examLabel}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />

            <View style={styles.infoRow}>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Language</Text>
              <Text style={[Typography.body, { color: colors.text, fontFamily: 'PlusJakartaSans_600SemiBold' }]}>
                {langLabel}
              </Text>
            </View>
          </JournalCard>

          {/* NEET Subjects */}
          {neetSubjects.length > 0 && (
            <JournalCard rotation={-0.5} delay={300}>
              <Text style={[Typography.label, { color: colors.textTertiary, marginBottom: Spacing.md }]}>
                NEET SUBJECTS
              </Text>
              <View style={styles.subjectChips}>
                {neetSubjects.map((id) => {
                  const meta = SUBJECT_META[id];
                  if (!meta) return null;
                  return (
                    <View
                      key={id}
                      style={[styles.subjectChip, { backgroundColor: meta.color + '18' }]}
                    >
                      <Text style={styles.chipEmoji}>{meta.emoji}</Text>
                      <Text style={[Typography.bodySm, { color: colors.text }]}>
                        {meta.name}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </JournalCard>
          )}

          {/* CUET Subjects */}
          {cuetSubjects.length > 0 && (
            <JournalCard rotation={0.3} delay={400}>
              <View style={styles.cardHeader}>
                <Text style={[Typography.label, { color: colors.textTertiary }]}>
                  CUET SUBJECTS ({cuetSubjects.length}/6)
                </Text>
                <Pressable
                  onPress={() => router.push('/edit-profile')}
                  style={[styles.editBtn, { backgroundColor: colors.primaryLight }]}
                >
                  <Text style={{ fontSize: 14 }}>{'\u270F\uFE0F'}</Text>
                  <Text style={[Typography.bodySm, { color: colors.primary, fontFamily: 'PlusJakartaSans_600SemiBold' }]}>
                    Change
                  </Text>
                </Pressable>
              </View>
              <View style={styles.subjectChips}>
                {cuetSubjects.map((id) => {
                  const meta = SUBJECT_META[id];
                  if (!meta) return null;
                  return (
                    <View
                      key={id}
                      style={[styles.subjectChip, { backgroundColor: meta.color + '18' }]}
                    >
                      <Text style={styles.chipEmoji}>{meta.emoji}</Text>
                      <Text style={[Typography.bodySm, { color: colors.text }]}>
                        {meta.name}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </JournalCard>
          )}

          {/* Study Gang */}
          {squad ? (
            <JournalCard rotation={0.5} delay={450}>
              <View style={styles.cardHeader}>
                <Text style={[Typography.label, { color: colors.textTertiary }]}>
                  STUDY GANG
                </Text>
              </View>

              <View style={styles.squadHeader}>
                <Text style={{ fontSize: 32 }}>{squad.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.h3, { color: colors.text }]}>{squad.name}</Text>
                  <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                    {squad.members.length}/{squad.maxMembers} members
                  </Text>
                </View>
              </View>

              {/* Members */}
              {squad.members.map((m, i) => (
                <View key={i} style={styles.memberRow}>
                  <View style={[styles.memberDot, { backgroundColor: colors.primary }]}>
                    <Text style={styles.memberInitial}>{m.name[0]?.toUpperCase()}</Text>
                  </View>
                  <Text style={[Typography.body, { color: colors.text, flex: 1 }]}>{m.name}</Text>
                  <Text style={[styles.roleTag, { color: m.role === 'leader' ? '#F59E0B' : colors.textTertiary }]}>
                    {m.role === 'leader' ? '\uD83D\uDC51 Leader' : 'Member'}
                  </Text>
                </View>
              ))}

              {/* Empty slots */}
              {Array.from({ length: squad.maxMembers - squad.members.length }).map((_, i) => (
                <View key={`e-${i}`} style={styles.memberRow}>
                  <View style={[styles.memberDot, { backgroundColor: colors.surfaceBorder, borderStyle: 'dashed', borderWidth: 1, borderColor: colors.textTertiary }]}>
                    <Text style={[styles.memberInitial, { color: colors.textTertiary }]}>?</Text>
                  </View>
                  <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>Invite a friend</Text>
                </View>
              ))}

              {/* Invite code + share */}
              <View style={[styles.inviteBar, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
                <View>
                  <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Invite Code</Text>
                  <Text style={[styles.inviteCode, { color: colors.primary }]}>{squad.inviteCode}</Text>
                </View>
                <View style={styles.inviteActions}>
                  <AnimatedPressable
                    onPress={async () => {
                      await Clipboard.setStringAsync(squad.inviteCode);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      toast.show('success', 'Code copied!');
                    }}
                    style={[styles.inviteBtn, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
                  >
                    <Text style={[Typography.bodySm, { color: colors.text }]}>Copy</Text>
                  </AnimatedPressable>
                  <AnimatedPressable
                    onPress={async () => {
                      try {
                        await Share.share({
                          message: `Join my Study Gang "${squad.name}" ${squad.emoji} on VaNi!\n\nCode: ${squad.inviteCode}\n\nLet's crack NEET together!`,
                        });
                      } catch {}
                    }}
                    style={[styles.inviteBtn, { backgroundColor: colors.primary }]}
                  >
                    <Text style={[Typography.bodySm, { color: mode === 'dark' ? '#0F172A' : '#FFF', fontFamily: 'PlusJakartaSans_600SemiBold' }]}>Share</Text>
                  </AnimatedPressable>
                </View>
              </View>
            </JournalCard>
          ) : (
            <StickyNote color="pink" rotation={0.5} delay={450}>
              <AnimatedPressable
                onPress={() => router.push('/(auth)/squad-pitch')}
                style={styles.squadCTA}
              >
                <Text style={{ fontSize: 32 }}>{'\uD83D\uDC7E'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.h3, { color: colors.text }]}>Start a Study Gang</Text>
                  <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                    Invite friends, compete together, save up to {SQUAD_PRICING[3].discount}%
                  </Text>
                </View>
                <Text style={{ fontSize: 18, color: colors.textTertiary }}>{'\u203A'}</Text>
              </AnimatedPressable>
            </StickyNote>
          )}

          {/* Chapter Strength */}
          <JournalCard rotation={-0.3} delay={480}>
            <View style={styles.cardHeader}>
              <Text style={[Typography.label, { color: colors.textTertiary }]}>
                CHAPTER STRENGTH
              </Text>
            </View>
            <StrengthMap />
          </JournalCard>

          {/* App Info */}
          <StickyNote color="yellow" rotation={-0.5} delay={550}>
            <View style={styles.appInfo}>
              <HandwrittenText variant="handSm">VaNi v1.0.0</HandwrittenText>
              <HandwrittenText variant="handSm">My Exam. My Way.</HandwrittenText>
            </View>
          </StickyNote>

          {/* Logout */}
          <View style={styles.logoutSection}>
            <PuffyButton
              title="Log Out"
              icon={'\uD83D\uDEAA'}
              variant="secondary"
              onPress={handleLogout}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </DotGridBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: Spacing.lg,
    gap: Spacing.xl,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeToggle: {
    padding: Spacing.sm,
  },
  profileCard: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  examBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.round,
    marginTop: Spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.round,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  divider: {
    height: 1,
  },
  subjectChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
  },
  chipEmoji: {
    fontSize: 16,
  },
  squadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  memberDot: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInitial: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  roleTag: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
  },
  inviteBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  inviteCode: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 20,
    letterSpacing: 3,
  },
  inviteActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  inviteBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  squadCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  appInfo: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  logoutSection: {
    alignItems: 'center',
    paddingTop: Spacing.md,
  },
});
