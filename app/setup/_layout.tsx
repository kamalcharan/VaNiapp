import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { ExamType, Language, SubjectId } from '../../src/types';
import { getProfile } from '../../src/lib/database';
import { supabase } from '../../src/lib/supabase';

// ── Shared onboarding state ──────────────────────────────────

export interface OnboardingData {
  phone: string;
  countryCode: string;
  college: string;
  city: string;
  exam: ExamType | null;
  subjects: SubjectId[];
  language: Language;
}

interface OnboardingContextType {
  data: OnboardingData;
  update: (partial: Partial<OnboardingData>) => void;
  step: number;
  setStep: (s: number) => void;
}

const defaultData: OnboardingData = {
  phone: '',
  countryCode: '+91',
  college: '',
  city: '',
  exam: null,
  subjects: [],
  language: 'en',
};

const OnboardingContext = createContext<OnboardingContextType>({
  data: defaultData,
  update: () => {},
  step: 1,
  setStep: () => {},
});

export const useOnboarding = () => useContext(OnboardingContext);

// ── Layout ───────────────────────────────────────────────────

const TOTAL_STEPS = 6;

export default function OnboardingLayout() {
  const { colors } = useTheme();
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [step, setStep] = useState(1);

  // Seed context from existing profile (handles re-entry / partial onboarding)
  useEffect(() => {
    (async () => {
      try {
        const profile = await getProfile();
        if (!profile) return;

        const seeded: Partial<OnboardingData> = {};
        if (profile.phone) seeded.phone = profile.phone;
        if (profile.country_code) seeded.countryCode = profile.country_code;
        if (profile.college) seeded.college = profile.college;
        if (profile.city) seeded.city = profile.city;
        if (profile.exam) seeded.exam = profile.exam as ExamType;
        if (profile.language) seeded.language = profile.language as Language;

        // Load saved subjects
        if (supabase) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: rows } = await supabase
              .from('med_user_subjects')
              .select('subject_id')
              .eq('user_id', user.id);
            if (rows && rows.length > 0) {
              seeded.subjects = rows.map((r: any) => r.subject_id as SubjectId);
            }
          }
        }

        if (Object.keys(seeded).length > 0) {
          setData((prev) => ({ ...prev, ...seeded }));
        }
      } catch {
        // First time — no profile data yet, use defaults
      }
    })();
  }, []);

  const progressAnim = useRef(new Animated.Value(1 / TOTAL_STEPS)).current;

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: step / TOTAL_STEPS,
      damping: 20,
      stiffness: 120,
      useNativeDriver: false,
    }).start();
  }, [step]);

  const update = (partial: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <OnboardingContext.Provider value={{ data, update, step, setStep }}>
      <View style={styles.root}>
        {/* Progress bar */}
        <View style={[styles.trackBar, { backgroundColor: colors.surfaceBorder }]}>
          <Animated.View
            style={[
              styles.progressBar,
              { width: progressWidth, backgroundColor: colors.primary },
            ]}
          />
        </View>
        <Slot />
      </View>
    </OnboardingContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  trackBar: {
    height: 3,
  },
  progressBar: {
    height: 3,
    borderRadius: 2,
  },
});
