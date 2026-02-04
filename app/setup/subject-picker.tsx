import { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { StickyNote } from '../../src/components/ui/StickyNote';
import { PuffyButton } from '../../src/components/ui/PuffyButton';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { useOnboarding } from './_layout';
import { useToast } from '../../src/components/ui/Toast';
import { CUET_MAX_SUBJECTS } from '../../src/types';
import { getSubjects, getNeetSubjectIds, CatalogSubject } from '../../src/lib/catalog';

export default function SubjectPickerScreen() {
  const { colors, mode } = useTheme();
  const router = useRouter();
  const { data, update, setStep } = useOnboarding();
  const toast = useToast();

  const isBoth = data.exam === 'BOTH';
  const [selected, setSelected] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<CatalogSubject[]>([]);
  const [neetSubjectIds, setNeetSubjectIds] = useState<string[]>([]);

  useEffect(() => {
    setStep(4);
    (async () => {
      const [cuetData, neetIds] = await Promise.all([
        getSubjects('CUET'),
        getNeetSubjectIds(),
      ]);
      setSubjects(cuetData);
      setNeetSubjectIds(neetIds);
    })();
  }, []);

  // Derive unique categories from fetched subjects (ordered by sort_order)
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const s of subjects) {
      if (!seen.has(s.category)) {
        seen.add(s.category);
        result.push(s.category);
      }
    }
    return result;
  }, [subjects]);

  const groupedSubjects = useMemo(() => {
    const groups: Record<string, CatalogSubject[]> = {};
    for (const cat of categories) {
      const items = subjects.filter((s) => s.category === cat);
      if (items.length > 0) groups[cat] = items;
    }
    return groups;
  }, [subjects, categories]);

  const toggleSubject = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= CUET_MAX_SUBJECTS) return prev;
      return [...prev, id];
    });
  };

  const handleContinue = () => {
    if (selected.length < 1) return;

    let finalSubjects: string[];
    if (isBoth) {
      const combined = new Set([...neetSubjectIds, ...selected]);
      finalSubjects = Array.from(combined);
    } else {
      finalSubjects = selected;
    }

    update({ subjects: finalSubjects as any });
    toast.show('success', `${selected.length} subjects picked`);
    router.push('/setup/language');
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
            <Text style={styles.headerEmoji}>{'\uD83D\uDCDA'}</Text>
            <Text style={[Typography.h1, { color: colors.text }]}>
              Pick Your Subjects
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
              <Text
                style={[Typography.bodySm, { color: colors.textSecondary }]}
              >
                selected
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
                  <Text
                    style={[Typography.label, { color: colors.textTertiary }]}
                  >
                    {category.toUpperCase()}
                  </Text>
                  <View style={styles.subjectGrid}>
                    {items.map((subj) => {
                      const isSelected = selected.includes(subj.id);
                      const isDisabled =
                        !isSelected &&
                        selected.length >= CUET_MAX_SUBJECTS;
                      return (
                        <Pressable
                          key={subj.id}
                          onPress={() =>
                            !isDisabled && toggleSubject(subj.id)
                          }
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
              title={`Confirm ${selected.length} Subject${selected.length !== 1 ? 's' : ''}`}
              icon={'\u2728'}
              onPress={handleContinue}
              disabled={selected.length < 1}
            />
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
  },
});
