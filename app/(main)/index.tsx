import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { StickyNote } from '../../src/components/ui/StickyNote';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { useTheme } from '../../src/hooks/useTheme';
import { usePersona } from '../../src/hooks/usePersona';
import { Typography, Spacing } from '../../src/constants/theme';
import { getProfile, getUserSubjectIds, shareInviteMessage, MedProfile } from '../../src/lib/database';
import { getSubjects, getChapters, CatalogSubject } from '../../src/lib/catalog';
import { StrengthLevel, ExamType } from '../../src/types';
import { evaluateSubjectStrength } from '../../src/lib/strengthEvaluator';
import { getStrengthConfig, getVaniMessage, getNeetCounterpart } from '../../src/lib/strengthHelpers';
import { RootState } from '../../src/store';
import { setDashboardExamFocus } from '../../src/store/slices/authSlice';
import * as Haptics from 'expo-haptics';
import { useTrial } from '../../src/hooks/useTrial';

// Exam focus for BOTH users - which exam to focus on
type ExamFocus = 'NEET' | 'CUET';

// Journey status with VaNi coaching language
interface SubjectJourney {
  subject: CatalogSubject;
  strengthLevel: StrengthLevel;
  chaptersCompleted: number;
  totalChapters: number;
  accuracy: number;
  vaniMessage: string;
}

// getStrengthConfig, getVaniMessage, getStrengthSubjectIds — imported from shared lib

export default function DashboardScreen() {
  const { colors, mode, toggle } = useTheme();
  const persona = usePersona();
  const router = useRouter();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState<MedProfile | null>(null);
  const [subjectJourneys, setSubjectJourneys] = useState<SubjectJourney[]>([]);
  const [allSubjects, setAllSubjects] = useState<CatalogSubject[]>([]);
  const savedExamFocus = useSelector((state: RootState) => state.auth.dashboardExamFocus);
  const examFocus: ExamFocus = (savedExamFocus as ExamFocus) || 'NEET';
  const setExamFocus = (focus: ExamFocus) => dispatch(setDashboardExamFocus(focus));
  const strengthChapters = useSelector((state: RootState) => state.strength.chapters);
  const trial = useTrial();

  /** Navigate to a practice route, or to paywall if trial expired */
  const guardedPush = (route: string) => {
    if (!trial.canPractice) {
      router.push('/paywall');
    } else {
      router.push(route as any);
    }
  };

  useEffect(() => {
    (async () => {
      const [prof, subjectIds, subjects] = await Promise.all([
        getProfile(),
        getUserSubjectIds(),
        getSubjects(),
      ]);
      setProfile(prof);
      setAllSubjects(subjects);

      if (subjectIds.length > 0 && subjects.length > 0) {
        const matched = subjectIds
          .map((id) => subjects.find((s) => s.id === id))
          .filter(Boolean) as CatalogSubject[];

        // Create journey data from actual strength data in Redux,
        // reusing evaluateSubjectStrength() so numbers match subject detail screen.
        const journeys: SubjectJourney[] = await Promise.all(
          matched.map(async (subject) => {
            // Load this subject's own chapters
            const catalogChapters = await getChapters(subject.id);
            const chapterIds = new Set(catalogChapters.map((ch) => ch.id));

            // For CUET subjects (e.g. cuet-physics), also load shared NEET
            // chapters tagged with exam_ids: ['NEET','CUET']. Practice done
            // on these via NEET records subjectId='physics', so we need to
            // include that strength data for the CUET card too.
            const neetCounterpart = getNeetCounterpart(subject.id);
            if (neetCounterpart) {
              const sharedNeetChapters = await getChapters(neetCounterpart, 'CUET');
              for (const ch of sharedNeetChapters) {
                chapterIds.add(ch.id);
              }
            }

            // Filter strength data — match by chapterId (covers both CUET-own
            // chapters and shared NEET chapters regardless of subjectId)
            const subjectChapters = Object.values(strengthChapters).filter(
              (ch) => chapterIds.has(ch.chapterId),
            );
            const chaptersCompleted = subjectChapters.filter(
              (ch) => ch.coverage >= 60 && ch.accuracy >= 70,
            ).length;

            const evalData = subjectChapters.map((ch) => ({
              coverage: ch.coverage,
              accuracy: ch.accuracy,
              totalInBank: ch.totalInBank,
            }));
            const strength = evaluateSubjectStrength(evalData);

            return {
              subject,
              strengthLevel: strength.level,
              accuracy: Math.round(strength.accuracy),
              chaptersCompleted,
              totalChapters: chapterIds.size,
              vaniMessage: getVaniMessage(strength.level),
            };
          }),
        );

        setSubjectJourneys(journeys);
      }
    })();
  }, []);

  // Always filter journeys by the current exam scope. Lingering CUET picks
  // from a previous BOTH/CUET selection now stay in med_user_subjects across
  // exam switches (so we don't lose them on a NEET round-trip), so the
  // dashboard has to do its own filtering.
  const filteredJourneys = (() => {
    if (profile?.exam === 'BOTH') {
      return subjectJourneys.filter((j) => j.subject.exam_id === examFocus);
    }
    if (profile?.exam === 'CUET') {
      return subjectJourneys.filter((j) => j.subject.exam_id === 'CUET');
    }
    // NEET (or unknown) — only show NEET subjects
    return subjectJourneys.filter((j) => j.subject.exam_id === 'NEET');
  })();

  const handleExamFocusChange = (focus: ExamFocus) => {
    setExamFocus(focus);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleInviteGang = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await shareInviteMessage(profile?.exam ?? null);
    } catch {
      // share dismissed or failed
    }
  };

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

  // Derive first name from display_name, else email prefix, else generic
  const firstName = profile?.display_name
    ? profile.display_name.split(' ')[0]
    : profile?.email
      ? profile.email.split('@')[0]
      : null;
  const greeting = firstName ? `Hey, ${firstName}` : 'Study Board';

  // For BOTH users, show the focused exam label
  const examLabel = profile?.exam === 'BOTH'
    ? examFocus
    : profile?.exam ?? 'NEET';

  const isBothUser = profile?.exam === 'BOTH';

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[Typography.label, { color: colors.textTertiary }]}>
                {examLabel} PREP
              </Text>
              <Text style={[Typography.h1, { color: colors.text, marginTop: 4 }]}>
                {greeting}
              </Text>
            </View>
            <Pressable onPress={toggle} style={styles.themeToggle}>
              <Text style={styles.themeEmoji}>
                {mode === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19'}
              </Text>
            </Pressable>
          </View>

          {/* Trial Banner */}
          {!trial.isPaid && (
            <Pressable
              onPress={() => router.push('/paywall')}
              style={[styles.trialBanner, {
                backgroundColor: trial.canPractice ? colors.primaryLight : '#EF444415',
                borderColor: trial.canPractice ? colors.primary + '30' : '#EF444440',
              }]}
            >
              <Text style={{ fontSize: 14 }}>
                {trial.canPractice ? '\u23F3' : '\uD83D\uDD12'}
              </Text>
              <Text style={[Typography.bodySm, {
                color: trial.canPractice ? colors.primary : '#EF4444',
                flex: 1,
              }]}>
                {trial.canPractice
                  ? `Free trial: ${trial.daysLeft}d left \u00B7 ${trial.questionsLeft} Q remaining`
                  : 'Trial ended \u2014 tap to upgrade'}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textTertiary }}>{'\u203A'}</Text>
            </Pressable>
          )}

          {/* Exam Focus Toggle (for BOTH users) */}
          {isBothUser && (
            <View style={styles.examToggleContainer}>
              <Text style={[Typography.bodySm, { color: colors.textSecondary, marginBottom: Spacing.xs }]}>
                Focus on:
              </Text>
              <View style={styles.examToggle}>
                {(['NEET', 'CUET'] as ExamFocus[]).map((focus) => {
                  const isActive = examFocus === focus;
                  const label = focus;
                  const emoji = focus === 'NEET' ? '\uD83E\uDE7A' : '\uD83C\uDF93';
                  return (
                    <Pressable
                      key={focus}
                      onPress={() => handleExamFocusChange(focus)}
                      style={[
                        styles.examToggleBtn,
                        {
                          backgroundColor: isActive ? colors.primary : colors.surface,
                          borderColor: isActive ? colors.primary : colors.surfaceBorder,
                        },
                      ]}
                    >
                      <Text style={{ fontSize: 14 }}>{emoji}</Text>
                      <Text
                        style={[
                          Typography.bodySm,
                          {
                            color: isActive ? '#FFFFFF' : colors.text,
                            fontFamily: isActive ? 'PlusJakartaSans_600SemiBold' : 'PlusJakartaSans_400Regular',
                          },
                        ]}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* VaNi Greeting — persona-aware */}
          <StickyNote color="yellow" rotation={-0.5} delay={100}>
            <HandwrittenText variant="handSm">
              {firstName
                ? `Hi ${firstName}! ${persona.labels.homeGreeting}`
                : persona.labels.homeGreeting}
            </HandwrittenText>
          </StickyNote>

          {/* Subject Journey Cards */}
          {filteredJourneys.length > 0 && (
            <View style={styles.journeySection}>
              <HandwrittenText variant="hand" rotation={-1}>
                {isBothUser ? `${examFocus} Journey` : persona.labels.chapterListHeader}
              </HandwrittenText>

              <View style={styles.journeyGrid}>
                {filteredJourneys.map((journey, idx) => {
                  const config = getStrengthConfig(journey.strengthLevel);
                  return (
                    <Pressable
                      key={journey.subject.id}
                      style={styles.journeyCardWrap}
                      onPress={() => {
                        // Pass exam focus for BOTH users so subject detail can filter chapters
                        const focusParam = isBothUser ? `?focus=${examFocus}` : '';
                        guardedPush(`/subject/${journey.subject.id}${focusParam}`);
                      }}
                    >
                      <JournalCard delay={200 + idx * 100}>
                        <View style={styles.journeyCardInner}>
                          {/* Subject Icon */}
                          <View
                            style={[
                              styles.journeyIconBg,
                              { backgroundColor: journey.subject.color + '20' },
                            ]}
                          >
                            <Text style={styles.journeyEmoji}>{journey.subject.emoji}</Text>
                          </View>

                          {/* Subject Name + Exam Tag */}
                          <Text
                            style={[
                              Typography.h3,
                              { color: colors.text, marginTop: Spacing.sm },
                            ]}
                            numberOfLines={1}
                          >
                            {journey.subject.name}
                          </Text>
                          {isBothUser && (
                            <View
                              style={{
                                alignSelf: 'center',
                                paddingHorizontal: 6,
                                paddingVertical: 1,
                                borderRadius: 4,
                                backgroundColor: journey.subject.exam_id === 'NEET' ? '#3B82F620' : '#8B5CF620',
                                marginTop: 2,
                              }}
                            >
                              <Text style={{ fontSize: 9, fontWeight: '700', color: journey.subject.exam_id === 'NEET' ? '#3B82F6' : '#8B5CF6' }}>
                                {journey.subject.exam_id}
                              </Text>
                            </View>
                          )}

                          {/* Journey Status Badge */}
                          <View
                            style={[
                              styles.statusBadge,
                              { backgroundColor: config.color + '20' },
                            ]}
                          >
                            <View
                              style={[styles.statusDot, { backgroundColor: config.color }]}
                            />
                            <Text
                              style={[
                                Typography.bodySm,
                                { color: config.color, fontWeight: '600', fontSize: 12 },
                              ]}
                            >
                              {config.label}
                            </Text>
                          </View>

                          {/* Accuracy — only if they've practiced */}
                          {journey.accuracy > 0 && (
                            <Text
                              style={[
                                Typography.bodySm,
                                {
                                  color: journey.accuracy >= 70 ? '#22C55E' : journey.accuracy >= 40 ? '#F59E0B' : '#EF4444',
                                  textAlign: 'center',
                                  fontWeight: '600',
                                  marginTop: Spacing.xs,
                                },
                              ]}
                            >
                              {journey.accuracy}% accuracy
                            </Text>
                          )}

                          {/* VaNi Message */}
                          <Text
                            style={[
                              Typography.bodySm,
                              {
                                color: colors.textSecondary,
                                textAlign: 'center',
                                marginTop: journey.accuracy > 0 ? 2 : Spacing.xs,
                                fontStyle: 'italic',
                                fontSize: 11,
                              },
                            ]}
                          >
                            "{journey.vaniMessage}"
                          </Text>
                        </View>
                      </JournalCard>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.actionsSection}>
            <HandwrittenText variant="hand" rotation={0.5}>
              Quick Actions
            </HandwrittenText>

            <JournalCard delay={400} rotation={0.3}>
              <Pressable
                style={styles.actionRow}
                onPress={() => guardedPush('/practice-exam')}
              >
                <Text style={styles.actionIcon}>{'\uD83C\uDFAF'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.h3, { color: colors.text }]}>
                    Practice Exam
                  </Text>
                  <Text
                    style={[
                      Typography.bodySm,
                      { color: colors.textSecondary, marginTop: 2 },
                    ]}
                  >
                    VaNi picks questions based on your progress
                  </Text>
                </View>
              </Pressable>
            </JournalCard>

            <JournalCard delay={500} rotation={-0.2}>
              <Pressable
                style={styles.actionRow}
                onPress={() => guardedPush('/quick-practice')}
              >
                <Text style={styles.actionIcon}>{'\u26A1'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.h3, { color: colors.text }]}>
                    Quick Practice
                  </Text>
                  <Text
                    style={[
                      Typography.bodySm,
                      { color: colors.textSecondary, marginTop: 2 },
                    ]}
                  >
                    20 questions. 10 minutes. Pure focus.
                  </Text>
                </View>
              </Pressable>
            </JournalCard>

          </View>

          {/* Invite Your Gang CTA */}
          <JournalCard delay={550} rotation={-0.3}>
            <Pressable style={styles.inviteCta} onPress={handleInviteGang}>
              <View style={styles.inviteCtaLeft}>
                <Text style={styles.inviteCtaEmoji}>{'\uD83D\uDC6F'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.h3, { color: colors.text }]}>
                    Invite Your Gang
                  </Text>
                  <Text
                    style={[
                      Typography.bodySm,
                      { color: colors.textSecondary, marginTop: 2 },
                    ]}
                  >
                    Study together, score better!
                  </Text>
                </View>
              </View>
              <View style={[styles.inviteCtaBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.inviteCtaBadgeText}>Share</Text>
              </View>
            </Pressable>
          </JournalCard>

          {/* Coaching nudge — tap a subject to see your progress */}
          <StickyNote color="teal" rotation={0.5} delay={600}>
            <HandwrittenText variant="handSm">
              {filteredJourneys.some(j => j.strengthLevel !== 'just-started')
                ? 'Tap any subject card above to see your chapter-by-chapter progress!'
                : 'Start a chapter quiz and I\'ll track your strengths for you!'}
            </HandwrittenText>
          </StickyNote>
        </Animated.ScrollView>
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
  trialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  themeToggle: {
    padding: Spacing.sm,
  },
  themeEmoji: {
    fontSize: 24,
  },
  // Exam Focus Toggle
  examToggleContainer: {
    marginTop: -Spacing.sm,
  },
  examToggle: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  examToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
  },
  // Journey Section
  journeySection: {
    gap: Spacing.md,
  },
  journeyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  journeyCardWrap: {
    width: '47%',
  },
  journeyCardInner: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  journeyIconBg: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  journeyEmoji: {
    fontSize: 28,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: Spacing.xs,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  // Actions Section
  actionsSection: {
    gap: Spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  actionIcon: {
    fontSize: 32,
  },
  // Invite CTA
  inviteCta: {
    flexDirection: 'column',
    gap: Spacing.md,
  },
  inviteCtaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  inviteCtaEmoji: {
    fontSize: 36,
  },
  inviteCtaBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  inviteCtaBadgeText: {
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
  },
});
