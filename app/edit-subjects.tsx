import { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { DotGridBackground } from '../src/components/ui/DotGridBackground';
import { StickyNote } from '../src/components/ui/StickyNote';
import { PuffyButton } from '../src/components/ui/PuffyButton';
import { HandwrittenText } from '../src/components/ui/HandwrittenText';
import { useTheme } from '../src/hooks/useTheme';
import { useToast } from '../src/components/ui/Toast';
import { Typography, Spacing, BorderRadius } from '../src/constants/theme';
import { CUET_MAX_SUBJECTS, ExamType } from '../src/types';
import { getSubjects, getNeetSubjectIds, CatalogSubject } from '../src/lib/catalog';
import { getProfile, getUserSubjectIds, updateUserSubjects } from '../src/lib/database';

/**
 * Edit subjects screen - used when:
 * 1. User switches exam type in profile (newExam param passed)
 * 2. User wants to modify their subjects from profile
 */
export default function EditSubjectsScreen() {
  const { colors, mode } = useTheme();
  const router = useRouter();
  const toast = useToast();
  const { newExam } = useLocalSearchParams<{ newExam?: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [examType, setExamType] = useState<ExamType>('NEET');
  const [selected, setSelected] = useState<string[]>([]);
  const [cuetSubjects, setCuetSubjects] = useState<CatalogSubject[]>([]);
  const [neetSubjects, setNeetSubjects] = useState<CatalogSubject[]>([]);
  const [neetSubjectIds, setNeetSubjectIds] = useState<string[]>([]);

  // Determine if this is an exam switch or just editing subjects
  const isExamSwitch = !!newExam;
  const isBoth = examType === 'BOTH';
  const isCuet = examType === 'CUET';
  const isNeet = examType === 'NEET';

  useEffect(() => {
    (async () => {
      const [profile, currentSubjectIds, allSubjects, neetIds] = await Promise.all([
        getProfile(),
        getUserSubjectIds(),
        getSubjects(),
        getNeetSubjectIds(),
      ]);

      // Use newExam param if switching, otherwise use profile's current exam
      const effectiveExam = (newExam as ExamType) || profile?.exam || 'NEET';
      setExamType(effectiveExam);
      setNeetSubjectIds(neetIds);

      // Split subjects by exam
      const cuet = allSubjects.filter((s) => s.exam_id === 'CUET');
      const neet = allSubjects.filter((s) => s.exam_id === 'NEET');
      setCuetSubjects(cuet);
      setNeetSubjects(neet);

      // Pre-select current CUET subjects (filter out NEET ones for display)
      if (effectiveExam === 'CUET' || effectiveExam === 'BOTH') {
        const currentCuetSubjects = currentSubjectIds.filter(
          (id) => !neetIds.includes(id)
        );
        setSelected(currentCuetSubjects);
      }

      setLoading(false);
    })();
  }, [newExam]);

  // Derive unique categories from CUET subjects
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const s of cuetSubjects) {
      if (!seen.has(s.category)) {
        seen.add(s.category);
        result.push(s.category);
      }
    }
    return result;
  }, [cuetSubjects]);

  const groupedSubjects = useMemo(() => {
    const groups: Record<string, CatalogSubject[]> = {};
    for (const cat of categories) {
      const items = cuetSubjects.filter((s) => s.category === cat);
      if (items.length > 0) groups[cat] = items;
    }
    return groups;
  }, [cuetSubjects, categories]);

  const toggleSubject = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= CUET_MAX_SUBJECTS) return prev;
      return [...prev, id];
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let finalSubjects: string[];

      if (isNeet) {
        // NEET only - just the 4 NEET subjects
        finalSubjects = neetSubjectIds;
      } else if (isBoth) {
        // BOTH - NEET subjects + selected CUET subjects
        finalSubjects = [...neetSubjectIds, ...selected];
      } else {
        // CUET only - just the selected CUET subjects
        finalSubjects = selected;
      }

      await updateUserSubjects(finalSubjects);

      toast.show('success', 'Subjects updated!');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (err: any) {
      toast.show('error', 'Failed to save', err?.message || 'Please try again');
    } finally {
      setSaving(false);
    }
  };

  // Entrance animation
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(25)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const selectedColor = (active: boolean) => ({
    backgroundColor: active ? colors.primary : colors.surface,
    borderColor: active ? colors.primary : colors.surfaceBorder,
  });

  const selectedTextColor = (active: boolean) =>
    active ? (mode === 'dark' ? '#0F172A' : '#FFFFFF') : colors.text;

  if (loading) {
    return (
      <DotGridBackground>
        <SafeAreaView style={[styles.container, styles.center]} edges={['top']}>
          <ActivityIndicator size="large" color={colors.primary} />
        </SafeAreaView>
      </DotGridBackground>
    );
  }

  // For NEET-only users, just confirm the switch
  if (isNeet) {
    return (
      <DotGridBackground>
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <Animated.View
            style={{
              flex: 1,
              opacity: fadeIn,
              transform: [{ translateY: slideUp }],
            }}
          >
            <View style={styles.headerSection}>
              <Text style={styles.headerEmoji}>{'\uD83E\uDE7A'}</Text>
              <Text style={[Typography.h1, { color: colors.text }]}>
                NEET Subjects
              </Text>
              <HandwrittenText variant="hand" rotation={-1}>
                4 core subjects for NEET
              </HandwrittenText>
            </View>

            <View style={styles.neetSubjectsContainer}>
              <StickyNote color="teal" rotation={0.5}>
                <HandwrittenText variant="handSm">
                  Your NEET subjects are set automatically:
                </HandwrittenText>
              </StickyNote>

              <View style={styles.neetGrid}>
                {neetSubjects.map((subj) => (
                  <View
                    key={subj.id}
                    style={[styles.neetChip, { backgroundColor: subj.color + '20' }]}
                  >
                    <Text style={{ fontSize: 24 }}>{subj.emoji}</Text>
                    <Text style={[Typography.body, { color: colors.text }]}>
                      {subj.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.footer}>
              <PuffyButton
                title="Confirm"
                icon={'\u2713'}
                onPress={handleSave}
                disabled={saving}
              />
              <Pressable
                onPress={() => router.back()}
                style={styles.cancelBtn}
              >
                <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </SafeAreaView>
      </DotGridBackground>
    );
  }

  // CUET or BOTH - show subject picker
  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeIn,
            transform: [{ translateY: slideUp }],
          }}
        >
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.headerEmoji}>
              {isBoth ? '\uD83C\uDFAF' : '\uD83C\uDF93'}
            </Text>
            <Text style={[Typography.h1, { color: colors.text }]}>
              {isExamSwitch ? 'Pick Your Subjects' : 'Edit Subjects'}
            </Text>
            <HandwrittenText variant="hand" rotation={-1}>
              {isBoth
                ? 'NEET 4 auto-included + pick CUET'
                : 'choose up to 6 for CUET'}
            </HandwrittenText>

            <View style={styles.counter}>
              <Text
                style={[
                  Typography.h3,
                  {
                    color:
                      selected.length >= CUET_MAX_SUBJECTS
                        ? colors.warning
                        : colors.primary,
                  },
                ]}
              >
                {selected.length} / {CUET_MAX_SUBJECTS}
              </Text>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                CUET subjects
              </Text>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            {isBoth && (
              <StickyNote color="yellow" rotation={0.5} delay={0}>
                <HandwrittenText variant="handSm">
                  Physics, Chemistry, Botany & Zoology are already in!
                </HandwrittenText>
              </StickyNote>
            )}

            {categories.map((category) => {
              const items = groupedSubjects[category];
              if (!items) return null;
              return (
                <View key={category} style={styles.categoryBlock}>
                  <Text style={[Typography.label, { color: colors.textTertiary }]}>
                    {category.toUpperCase()}
                  </Text>
                  <View style={styles.subjectGrid}>
                    {items.map((subj) => {
                      const isSelected = selected.includes(subj.id);
                      const isDisabled =
                        !isSelected && selected.length >= CUET_MAX_SUBJECTS;
                      return (
                        <Pressable
                          key={subj.id}
                          onPress={() => !isDisabled && toggleSubject(subj.id)}
                          style={[
                            styles.subjectChip,
                            selectedColor(isSelected),
                            isDisabled && { opacity: 0.35 },
                          ]}
                        >
                          <Text style={styles.chipEmoji}>{subj.emoji}</Text>
                          <Text
                            style={[
                              Typography.bodySm,
                              {
                                color: selectedTextColor(isSelected),
                                fontFamily: 'PlusJakartaSans_600SemiBold',
                              },
                            ]}
                            numberOfLines={1}
                          >
                            {subj.name}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <PuffyButton
              title={saving ? 'Saving...' : `Save ${isBoth ? neetSubjectIds.length + selected.length : selected.length} Subjects`}
              icon={'\u2713'}
              onPress={handleSave}
              disabled={saving || (isCuet && selected.length < 1)}
            />
            <Pressable onPress={() => router.back()} style={styles.cancelBtn}>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </SafeAreaView>
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
  headerSection: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  headerEmoji: {
    fontSize: 40,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  scroll: {
    padding: Spacing.xl,
    gap: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  categoryBlock: {
    gap: Spacing.md,
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  chipEmoji: {
    fontSize: 18,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  cancelBtn: {
    paddingVertical: Spacing.sm,
  },
  // NEET-only styles
  neetSubjectsContainer: {
    flex: 1,
    padding: Spacing.xl,
    gap: Spacing.xl,
  },
  neetGrid: {
    gap: Spacing.md,
  },
  neetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
});
