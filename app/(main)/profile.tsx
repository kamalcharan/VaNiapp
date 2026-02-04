import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { StickyNote } from '../../src/components/ui/StickyNote';
import { PuffyButton } from '../../src/components/ui/PuffyButton';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { ThemedDialog } from '../../src/components/ui/ThemedDialog';
import { useTheme } from '../../src/hooks/useTheme';
import { useToast } from '../../src/components/ui/Toast';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import {
  getProfile,
  getUserSubjectIds,
  updateProfile,
  signOut,
  MedProfile,
} from '../../src/lib/database';
import { getSubjects, getLanguages, CatalogSubject } from '../../src/lib/catalog';

export default function ProfileScreen() {
  const { colors, mode, toggle } = useTheme();
  const toast = useToast();

  const [profile, setProfile] = useState<MedProfile | null>(null);
  const [subjects, setSubjects] = useState<CatalogSubject[]>([]);
  const [langLabel, setLangLabel] = useState('English');
  const [loading, setLoading] = useState(true);

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [editPhone, setEditPhone] = useState('');
  const [editCollege, setEditCollege] = useState('');
  const [editCity, setEditCity] = useState('');
  const [saving, setSaving] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const [prof, subjectIds, allSubjects, languages] = await Promise.all([
      getProfile(),
      getUserSubjectIds(),
      getSubjects(),
      getLanguages(),
    ]);

    setProfile(prof);

    if (subjectIds.length > 0 && allSubjects.length > 0) {
      const matched = subjectIds
        .map((id) => allSubjects.find((s) => s.id === id))
        .filter(Boolean) as CatalogSubject[];
      setSubjects(matched);
    }

    if (prof?.language && languages.length > 0) {
      const lang = languages.find((l) => l.id === prof.language);
      if (lang) setLangLabel(lang.label);
    }

    if (prof) {
      setEditPhone(prof.phone || '');
      setEditCollege(prof.college || '');
      setEditCity(prof.city || '');
    }

    setLoading(false);
  };

  const handleStartEdit = () => {
    setEditing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await updateProfile({
        phone: editPhone.trim(),
        college: editCollege.trim(),
        city: editCity.trim(),
      });
      const prof = await getProfile();
      setProfile(prof);
      setEditing(false);
      toast.show('success', 'Profile updated');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      toast.show('error', 'Update failed', err?.message || 'Please try again');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    if (profile) {
      setEditPhone(profile.phone || '');
      setEditCollege(profile.college || '');
      setEditCity(profile.city || '');
    }
  };

  const handleSignOut = async () => {
    setLogoutDialog(false);
    await signOut();
  };

  const examLabel =
    profile?.exam === 'BOTH'
      ? 'NEET + CUET'
      : profile?.exam ?? 'NEET';

  // Entrance animation
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (loading) {
    return (
      <DotGridBackground>
        <SafeAreaView style={[styles.container, styles.center]} edges={['top']}>
          <ActivityIndicator size="large" color={colors.primary} />
        </SafeAreaView>
      </DotGridBackground>
    );
  }

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}
        >
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
                {profile?.display_name || 'Student'}
              </Text>
              {profile?.email ? (
                <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                  {profile.email}
                </Text>
              ) : null}
              <View style={[styles.examBadge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[Typography.label, { color: colors.primary }]}>
                  {examLabel} ASPIRANT
                </Text>
              </View>
            </View>
          </StickyNote>

          {/* Details Card */}
          <JournalCard delay={200}>
            <View style={styles.cardHeader}>
              <Text style={[Typography.label, { color: colors.textTertiary }]}>
                DETAILS
              </Text>
              {!editing ? (
                <Pressable
                  onPress={handleStartEdit}
                  style={[styles.editBtn, { backgroundColor: colors.primaryLight }]}
                >
                  <Text style={{ fontSize: 14 }}>{'\u270F\uFE0F'}</Text>
                  <Text
                    style={[
                      Typography.bodySm,
                      { color: colors.primary, fontFamily: 'PlusJakartaSans_600SemiBold' },
                    ]}
                  >
                    Edit
                  </Text>
                </Pressable>
              ) : (
                <View style={styles.editActions}>
                  <Pressable onPress={handleCancelEdit}>
                    <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSaveEdit}
                    disabled={saving}
                    style={[styles.saveBtn, { backgroundColor: colors.primary }]}
                  >
                    <Text
                      style={[
                        Typography.bodySm,
                        { color: '#FFF', fontFamily: 'PlusJakartaSans_600SemiBold' },
                      ]}
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>

            {/* Name (read-only) */}
            <View style={styles.infoRow}>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Name</Text>
              <Text
                style={[
                  Typography.body,
                  { color: colors.text, fontFamily: 'PlusJakartaSans_600SemiBold' },
                ]}
              >
                {profile?.display_name || '-'}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />

            {/* Phone */}
            <View style={styles.infoRow}>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Phone</Text>
              {editing ? (
                <TextInput
                  style={[
                    styles.editInput,
                    {
                      color: colors.text,
                      borderColor: colors.primary,
                      backgroundColor: colors.surface,
                    },
                  ]}
                  value={editPhone}
                  onChangeText={(t) =>
                    setEditPhone(t.replace(/[^0-9]/g, '').slice(0, 15))
                  }
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              ) : (
                <Text
                  style={[
                    Typography.body,
                    { color: colors.text, fontFamily: 'PlusJakartaSans_600SemiBold' },
                  ]}
                >
                  {profile?.country_code} {profile?.phone || '-'}
                </Text>
              )}
            </View>
            <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />

            {/* College */}
            <View style={styles.infoRow}>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>College</Text>
              {editing ? (
                <TextInput
                  style={[
                    styles.editInput,
                    {
                      color: colors.text,
                      borderColor: colors.primary,
                      backgroundColor: colors.surface,
                    },
                  ]}
                  value={editCollege}
                  onChangeText={setEditCollege}
                  autoCapitalize="words"
                />
              ) : (
                <Text
                  style={[
                    Typography.body,
                    { color: colors.text, fontFamily: 'PlusJakartaSans_600SemiBold' },
                  ]}
                >
                  {profile?.college || '-'}
                </Text>
              )}
            </View>
            <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />

            {/* City */}
            <View style={styles.infoRow}>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>City</Text>
              {editing ? (
                <TextInput
                  style={[
                    styles.editInput,
                    {
                      color: colors.text,
                      borderColor: colors.primary,
                      backgroundColor: colors.surface,
                    },
                  ]}
                  value={editCity}
                  onChangeText={setEditCity}
                  autoCapitalize="words"
                />
              ) : (
                <Text
                  style={[
                    Typography.body,
                    { color: colors.text, fontFamily: 'PlusJakartaSans_600SemiBold' },
                  ]}
                >
                  {profile?.city || '-'}
                </Text>
              )}
            </View>
            <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />

            {/* Exam (read-only) */}
            <View style={styles.infoRow}>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Exam</Text>
              <Text
                style={[
                  Typography.body,
                  { color: colors.text, fontFamily: 'PlusJakartaSans_600SemiBold' },
                ]}
              >
                {examLabel}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />

            {/* Language (read-only) */}
            <View style={styles.infoRow}>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Language</Text>
              <Text
                style={[
                  Typography.body,
                  { color: colors.text, fontFamily: 'PlusJakartaSans_600SemiBold' },
                ]}
              >
                {langLabel}
              </Text>
            </View>
          </JournalCard>

          {/* Subjects */}
          {subjects.length > 0 && (
            <JournalCard rotation={-0.5} delay={300}>
              <Text
                style={[
                  Typography.label,
                  { color: colors.textTertiary, marginBottom: Spacing.md },
                ]}
              >
                YOUR SUBJECTS
              </Text>
              <View style={styles.subjectChips}>
                {subjects.map((subj) => (
                  <View
                    key={subj.id}
                    style={[styles.subjectChip, { backgroundColor: subj.color + '18' }]}
                  >
                    <Text style={styles.chipEmoji}>{subj.emoji}</Text>
                    <Text style={[Typography.bodySm, { color: colors.text }]}>
                      {subj.name}
                    </Text>
                  </View>
                ))}
              </View>
            </JournalCard>
          )}

          {/* App Info */}
          <StickyNote color="yellow" rotation={-0.5} delay={400}>
            <View style={styles.appInfo}>
              <HandwrittenText variant="handSm">VaNi v1.0.0</HandwrittenText>
              <HandwrittenText variant="handSm">My Exam. My Way.</HandwrittenText>
            </View>
          </StickyNote>

          {/* Sign Out */}
          <View style={styles.logoutSection}>
            <PuffyButton
              title="Sign Out"
              icon={'\uD83D\uDEAA'}
              variant="secondary"
              onPress={() => setLogoutDialog(true)}
            />
          </View>
        </Animated.ScrollView>
      </SafeAreaView>

      {/* Logout Confirmation */}
      <ThemedDialog
        visible={logoutDialog}
        title="Sign Out"
        emoji={'\uD83D\uDC4B'}
        message="Are you sure you want to sign out?"
        confirmLabel="Sign Out"
        cancelLabel="Cancel"
        onConfirm={handleSignOut}
        onCancel={() => setLogoutDialog(false)}
      />
    </DotGridBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingVertical: 6,
    borderRadius: BorderRadius.round,
    marginTop: 4,
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
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.round,
  },
  editActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  saveBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
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
  editInput: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    width: 160,
    textAlign: 'right',
  },
  subjectChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
  },
  chipEmoji: {
    fontSize: 16,
  },
  appInfo: {
    alignItems: 'center',
    gap: 4,
  },
  logoutSection: {
    alignItems: 'center',
    paddingTop: Spacing.md,
  },
});
