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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
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
  // generateReferralCode,
  joinWithReferralCode,
  shareInviteMessage,
  MedProfile,
} from '../../src/lib/database';
import { getSubjects, getLanguages, CatalogSubject, CatalogLanguage } from '../../src/lib/catalog';
import { ExamType, Language } from '../../src/types';
import { useSelector } from 'react-redux';
import { store, RootState } from '../../src/store';
import { updateTargetYear, updateLanguage } from '../../src/store/slices/authSlice';
import { getTargetYearOptions } from '../../src/constants/persona';
import type { PlanId } from '../../src/constants/pricing';
import { getRazorpayConfig } from '../../src/lib/appConfig';

const TARGET_YEAR_OPTIONS = getTargetYearOptions();

export default function ProfileScreen() {
  const { colors, mode, toggle } = useTheme();
  const toast = useToast();
  const router = useRouter();

  // Subscription state from Redux
  const isPaid = useSelector((s: RootState) => s.trial.isPaid);
  const subscriptionPlan = useSelector((s: RootState) => s.trial.subscriptionPlan);
  const subscriptionExpiresAt = useSelector((s: RootState) => s.trial.subscriptionExpiresAt);

  const [profile, setProfile] = useState<MedProfile | null>(null);
  const [subjects, setSubjects] = useState<CatalogSubject[]>([]);
  const [languages, setLanguages] = useState<CatalogLanguage[]>([]);
  const [langLabel, setLangLabel] = useState('English');
  const [loading, setLoading] = useState(true);

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCollege, setEditCollege] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editExam, setEditExam] = useState<ExamType>('NEET');
  const [editLanguage, setEditLanguage] = useState<Language>('en');
  const [editTargetYear, setEditTargetYear] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [subjectDialog, setSubjectDialog] = useState(false);
  // const [referralCode, setReferralCode] = useState<string | null>(null);
  const [planDisplayName, setPlanDisplayName] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState('');
  // const [generatingCode, setGeneratingCode] = useState(false);
  const [pendingExamChange, setPendingExamChange] = useState<ExamType | null>(null);

  const EXAM_OPTIONS: { id: ExamType; label: string; emoji: string }[] = [
    { id: 'NEET', label: 'NEET', emoji: '\uD83E\uDE7A' },
    { id: 'CUET', label: 'CUET', emoji: '\uD83C\uDFDB\uFE0F' },
    { id: 'BOTH', label: 'Both', emoji: '\uD83C\uDFAF' },
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  // Fetch plan display name from DB config
  useEffect(() => {
    if (!subscriptionPlan) return;
    getRazorpayConfig().then((cfg) => {
      const name = cfg.plans[subscriptionPlan]?.name;
      if (name) setPlanDisplayName(name);
    });
  }, [subscriptionPlan]);

  const loadProfile = async () => {
    const [prof, subjectIds, allSubjects, langs] = await Promise.all([
      getProfile(),
      getUserSubjectIds(),
      getSubjects(),
      getLanguages(),
    ]);

    setProfile(prof);
    setLanguages(langs);

    if (subjectIds.length > 0 && allSubjects.length > 0) {
      const matched = subjectIds
        .map((id) => allSubjects.find((s) => s.id === id))
        .filter(Boolean) as CatalogSubject[];
      setSubjects(matched);
    }

    if (prof?.language && langs.length > 0) {
      const lang = langs.find((l) => l.id === prof.language);
      if (lang) setLangLabel(lang.label);
    }

    if (prof) {
      setEditName(prof.display_name || '');
      setEditPhone(prof.phone || '');
      setEditCollege(prof.college || '');
      setEditCity(prof.city || '');
      setEditExam(prof.exam || 'NEET');
      setEditLanguage(prof.language || 'en');
      setEditTargetYear(prof.target_year ?? null);
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
      const examChanged = profile?.exam !== editExam;
      const needsSubjectPicker = examChanged && (editExam === 'CUET' || editExam === 'BOTH');

      await updateProfile({
        display_name: editName.trim(),
        phone: editPhone.trim(),
        college: editCollege.trim(),
        city: editCity.trim(),
        exam: editExam,
        language: editLanguage,
        target_year: editTargetYear,
      });

      const prof = await getProfile();
      setProfile(prof);
      setEditing(false);

      // Sync target_year into Redux so screens can read persona
      store.dispatch(updateTargetYear(prof?.target_year ?? undefined));

      // Sync language into Redux so all screens reflect the change immediately
      if (prof?.language) {
        store.dispatch(updateLanguage(prof.language as Language));
      }

      // Update language label
      if (prof?.language && languages.length > 0) {
        const lang = languages.find((l) => l.id === prof.language);
        if (lang) setLangLabel(lang.label);
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (needsSubjectPicker) {
        setPendingExamChange(editExam);
        setSubjectDialog(true);
      } else if (examChanged && editExam === 'NEET') {
        router.push(`/edit-subjects?newExam=NEET`);
      } else {
        toast.show('success', 'Profile updated');
      }
    } catch (err: any) {
      toast.show('error', 'Update failed', err?.message || 'Please try again');
    } finally {
      setSaving(false);
    }
  };

  const handleSubjectDialogConfirm = () => {
    setSubjectDialog(false);
    if (pendingExamChange) {
      router.push(`/edit-subjects?newExam=${pendingExamChange}`);
    }
    setPendingExamChange(null);
  };

  const handleSubjectDialogCancel = () => {
    setSubjectDialog(false);
    setPendingExamChange(null);
    toast.show('info', 'Remember to update your subjects later!');
  };

  const handleCancelEdit = () => {
    setEditing(false);
    if (profile) {
      setEditName(profile.display_name || '');
      setEditPhone(profile.phone || '');
      setEditCollege(profile.college || '');
      setEditCity(profile.city || '');
      setEditExam(profile.exam || 'NEET');
      setEditLanguage(profile.language || 'en');
      setEditTargetYear(profile.target_year ?? null);
    }
  };

  const handleSignOut = async () => {
    setLogoutDialog(false);
    await signOut();
  };

  // const handleGenerateCode = async () => {
  //   setGeneratingCode(true);
  //   try {
  //     const code = await generateReferralCode();
  //     setReferralCode(code);
  //   } catch {
  //     toast.show('error', 'Could not generate code');
  //   } finally {
  //     setGeneratingCode(false);
  //   }
  // };

  const handleShareInvite = async () => {
    try {
      await shareInviteMessage(profile?.exam ?? null);
    } catch {
      // share dismissed
    }
  };

  const handleJoinGang = async () => {
    if (joinCode.trim().length < 4) return;
    const ok = await joinWithReferralCode(joinCode.trim());
    if (ok) {
      toast.show('success', 'Joined!', 'Welcome to the gang');
      setJoinCode('');
    } else {
      toast.show('error', 'Invalid code', 'Check the code and try again');
    }
  };

  const examLabel =
    profile?.exam === 'BOTH'
      ? 'NEET + CUET'
      : profile?.exam ?? 'NEET';

  const targetYearLabel = profile?.target_year
    ? `${profile.target_year}`
    : 'Not set';

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
        <Animated.View
          style={{ flex: 1, opacity: fadeIn, transform: [{ translateY: slideUp }] }}
        >
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
          extraScrollHeight={120}
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
                  {examLabel} {profile?.target_year || ''} ASPIRANT
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

            {/* Name */}
            <View style={styles.infoRow}>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Name</Text>
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
                  value={editName}
                  onChangeText={setEditName}
                  autoCapitalize="words"
                  placeholder="Your name"
                  placeholderTextColor={colors.textTertiary}
                />
              ) : (
                <Text
                  style={[
                    Typography.body,
                    { color: colors.text, fontFamily: 'PlusJakartaSans_600SemiBold' },
                  ]}
                >
                  {profile?.display_name || '-'}
                </Text>
              )}
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

            {/* Exam */}
            <View style={editing ? styles.infoRowVertical : styles.infoRow}>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Exam</Text>
              {editing ? (
                <View style={styles.examOptions}>
                  {EXAM_OPTIONS.map((opt) => (
                    <Pressable
                      key={opt.id}
                      style={[
                        styles.examOption,
                        {
                          backgroundColor:
                            editExam === opt.id ? colors.primaryLight : colors.surface,
                          borderColor:
                            editExam === opt.id ? colors.primary : colors.surfaceBorder,
                        },
                      ]}
                      onPress={() => {
                        setEditExam(opt.id);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{opt.emoji}</Text>
                      <Text
                        style={[
                          Typography.bodySm,
                          {
                            color: editExam === opt.id ? colors.primary : colors.text,
                            fontFamily:
                              editExam === opt.id
                                ? 'PlusJakartaSans_600SemiBold'
                                : 'PlusJakartaSans_400Regular',
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : (
                <Text
                  style={[
                    Typography.body,
                    { color: colors.text, fontFamily: 'PlusJakartaSans_600SemiBold' },
                  ]}
                >
                  {examLabel}
                </Text>
              )}
            </View>
            <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />

            {/* Target Year */}
            <View style={editing ? styles.infoRowVertical : styles.infoRow}>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Target Year</Text>
              {editing ? (
                <View style={styles.examOptions}>
                  {TARGET_YEAR_OPTIONS.map((opt) => (
                    <Pressable
                      key={opt.year}
                      style={[
                        styles.examOption,
                        {
                          backgroundColor:
                            editTargetYear === opt.year ? colors.primaryLight : colors.surface,
                          borderColor:
                            editTargetYear === opt.year ? colors.primary : colors.surfaceBorder,
                        },
                      ]}
                      onPress={() => {
                        setEditTargetYear(opt.year);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{opt.emoji}</Text>
                      <Text
                        style={[
                          Typography.bodySm,
                          {
                            color: editTargetYear === opt.year ? colors.primary : colors.text,
                            fontFamily:
                              editTargetYear === opt.year
                                ? 'PlusJakartaSans_600SemiBold'
                                : 'PlusJakartaSans_400Regular',
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : (
                <Text
                  style={[
                    Typography.body,
                    { color: colors.text, fontFamily: 'PlusJakartaSans_600SemiBold' },
                  ]}
                >
                  {targetYearLabel}
                </Text>
              )}
            </View>
            <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />

            {/* Language */}
            <View style={editing ? styles.infoRowVertical : styles.infoRow}>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Language</Text>
              {editing ? (
                <View style={styles.examOptions}>
                  {languages.map((lang) => (
                    <Pressable
                      key={lang.id}
                      style={[
                        styles.examOption,
                        {
                          backgroundColor:
                            editLanguage === lang.id ? colors.primaryLight : colors.surface,
                          borderColor:
                            editLanguage === lang.id ? colors.primary : colors.surfaceBorder,
                        },
                      ]}
                      onPress={() => {
                        setEditLanguage(lang.id as Language);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{lang.emoji}</Text>
                      <Text
                        style={[
                          Typography.bodySm,
                          {
                            color: editLanguage === lang.id ? colors.primary : colors.text,
                            fontFamily:
                              editLanguage === lang.id
                                ? 'PlusJakartaSans_600SemiBold'
                                : 'PlusJakartaSans_400Regular',
                          },
                        ]}
                      >
                        {lang.native}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : (
                <Text
                  style={[
                    Typography.body,
                    { color: colors.text, fontFamily: 'PlusJakartaSans_600SemiBold' },
                  ]}
                >
                  {langLabel}
                </Text>
              )}
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

          {/* Subscription / Plan */}
          <StickyNote color="pink" rotation={0.5} delay={325}>
            <Text
              style={[
                Typography.label,
                { color: colors.textTertiary, marginBottom: Spacing.md },
              ]}
            >
              MY PLAN
            </Text>

            {isPaid && subscriptionPlan ? (
              <>
                <View style={styles.infoRow}>
                  <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Plan</Text>
                  <Text
                    style={[
                      Typography.body,
                      { color: colors.text, fontFamily: 'PlusJakartaSans_600SemiBold' },
                    ]}
                  >
                    {planDisplayName ?? subscriptionPlan}
                  </Text>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />

                <View style={styles.infoRow}>
                  <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Status</Text>
                  <View style={[styles.statusBadge, { backgroundColor: colors.correctBg }]}>
                    <Text style={[Typography.bodySm, { color: colors.correct, fontFamily: 'PlusJakartaSans_600SemiBold' }]}>
                      Active
                    </Text>
                  </View>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.surfaceBorder }]} />

                <View style={styles.infoRow}>
                  <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                    {subscriptionPlan === 'crunch' ? 'Valid until' : 'Renews on'}
                  </Text>
                  <Text
                    style={[
                      Typography.body,
                      { color: colors.text, fontFamily: 'PlusJakartaSans_600SemiBold' },
                    ]}
                  >
                    {subscriptionExpiresAt
                      ? new Date(subscriptionExpiresAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'Until exam season'}
                  </Text>
                </View>
              </>
            ) : (
              <View style={{ alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm }}>
                <Text style={[Typography.body, { color: colors.textSecondary, textAlign: 'center' }]}>
                  You're on the free trial. Upgrade to unlock full access!
                </Text>
                <PuffyButton
                  title="View Plans"
                  icon={'\u2B50'}
                  variant="secondary"
                  onPress={() => router.push('/upgrade')}
                  style={{ alignSelf: 'center' }}
                />
              </View>
            )}
          </StickyNote>

          {/* Invite / Referral */}
          <JournalCard rotation={0.3} delay={350}>
            <Text
              style={[
                Typography.label,
                { color: colors.textTertiary, marginBottom: Spacing.md },
              ]}
            >
              STUDY GANG
            </Text>

            {/* Share invite */}
            <Pressable
              style={[styles.inviteRow, { backgroundColor: colors.primaryLight }]}
              onPress={handleShareInvite}
            >
              <Text style={{ fontSize: 20 }}>{'\uD83D\uDCE8'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[Typography.body, { color: colors.text, fontFamily: 'PlusJakartaSans_600SemiBold' }]}>
                  Invite Friends
                </Text>
                <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                  Share your code & study together
                </Text>
              </View>
              <Text style={{ color: colors.textTertiary }}>{'\u203A'}</Text>
            </Pressable>

            {/* Referral code display — commented out while codes are disabled */}
            {/* {referralCode && (
              <View style={[styles.codeDisplay, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
                <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Your code</Text>
                <Text style={[Typography.h2, { color: colors.primary, letterSpacing: 3 }]}>
                  {referralCode}
                </Text>
              </View>
            )} */}

            <View style={[styles.divider, { backgroundColor: colors.surfaceBorder, marginVertical: Spacing.sm }]} />

            {/* Join with code */}
            <Text style={[Typography.bodySm, { color: colors.textSecondary, marginBottom: Spacing.xs }]}>
              Have a friend's code?
            </Text>
            <View style={styles.joinRow}>
              <TextInput
                style={[
                  styles.joinInput,
                  {
                    color: colors.text,
                    backgroundColor: colors.surface,
                    borderColor: colors.surfaceBorder,
                  },
                ]}
                placeholder="Enter code"
                placeholderTextColor={colors.textTertiary}
                value={joinCode}
                onChangeText={(t) => setJoinCode(t.toUpperCase().slice(0, 6))}
                autoCapitalize="characters"
                maxLength={6}
              />
              <Pressable
                onPress={handleJoinGang}
                disabled={joinCode.trim().length < 4}
                style={[
                  styles.joinBtn,
                  {
                    backgroundColor: joinCode.trim().length >= 4 ? colors.primary : colors.surfaceBorder,
                  },
                ]}
              >
                <Text style={[Typography.bodySm, { color: '#FFF', fontFamily: 'PlusJakartaSans_600SemiBold' }]}>
                  Join
                </Text>
              </Pressable>
            </View>
          </JournalCard>

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

          {/* About VaNi */}
          <Pressable
            style={styles.aboutLink}
            onPress={() => router.push('/about-vani')}
          >
            <Text style={[Typography.bodySm, { color: colors.textTertiary }]}>
              About VaNi
            </Text>
          </Pressable>
        </KeyboardAwareScrollView>
        </Animated.View>
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

      {/* Subject Selection Prompt (after exam change) */}
      <ThemedDialog
        visible={subjectDialog}
        title="Update Subjects"
        emoji={'\uD83D\uDCDA'}
        message={
          pendingExamChange === 'BOTH'
            ? "You've switched to NEET + CUET! Let's pick your CUET subjects now."
            : "You've switched to CUET! Let's pick your subjects now."
        }
        confirmLabel="Pick Subjects"
        cancelLabel="Later"
        onConfirm={handleSubjectDialogConfirm}
        onCancel={handleSubjectDialogCancel}
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
  infoRowVertical: {
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  divider: {
    height: 1,
  },
  examOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  examOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
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
  aboutLink: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
  },
  // Invite / Referral
  inviteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  codeDisplay: {
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginTop: Spacing.sm,
    gap: 4,
  },
  joinRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  joinInput: {
    flex: 1,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    letterSpacing: 2,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    textAlign: 'center',
  },
  joinBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
  },
});
