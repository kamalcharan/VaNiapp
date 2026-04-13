import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DotGridBackground } from '../../src/components/ui/DotGridBackground';
import { JournalCard } from '../../src/components/ui/JournalCard';
import { PuffyButton } from '../../src/components/ui/PuffyButton';
import { HandwrittenText } from '../../src/components/ui/HandwrittenText';
import { useTheme } from '../../src/hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { useOnboarding } from './_layout';
import { useToast } from '../../src/components/ui/Toast';


export default function ProfileDetailsScreen() {
  const { colors, mode } = useTheme();
  const router = useRouter();
  const { data, update, setStep } = useOnboarding();
  const toast = useToast();

  const [displayName, setDisplayName] = useState(data.displayName);
  const [college, setCollege] = useState(data.college);
  const [city, setCity] = useState(data.city);

  useEffect(() => {
    setStep(2);
  }, []);

  const canContinue =
    displayName.trim().length >= 2 &&
    college.trim().length >= 2 &&
    city.trim().length >= 2;

  const handleContinue = () => {
    if (!canContinue) return;
    update({
      displayName: displayName.trim(),
      phone: '',
      countryCode: '+91',
      college: college.trim(),
      city: city.trim(),
    });
    toast.show('success', 'Details saved', 'Now pick your exam!');
    router.push('/setup/exam-picker');
  };

  // Entrance animations
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
          <KeyboardAwareScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid
            extraScrollHeight={120}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerEmoji}>{'\uD83D\uDCDD'}</Text>
              <Text style={[Typography.h1, { color: colors.text }]}>
                A bit about you
              </Text>
              <HandwrittenText variant="hand" rotation={-1}>
                quick stuff, promise...
              </HandwrittenText>
            </View>

            {/* Name */}
            <JournalCard rotation={0.2} delay={50}>
              <View style={styles.section}>
                <Text style={[Typography.h3, { color: colors.text }]}>
                  Your name
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
                  placeholder="e.g. Priya Sharma"
                  placeholderTextColor={colors.textTertiary}
                  value={displayName}
                  onChangeText={setDisplayName}
                  autoCapitalize="words"
                  autoFocus
                />
              </View>
            </JournalCard>

            {/* College & City */}
            <JournalCard rotation={0.3} delay={200}>
              <View style={styles.section}>
                <Text style={[Typography.h3, { color: colors.text }]}>
                  College / School
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
                  placeholder="e.g. St. Xavier's College"
                  placeholderTextColor={colors.textTertiary}
                  value={college}
                  onChangeText={setCollege}
                  autoCapitalize="words"
                />

                <Text
                  style={[
                    Typography.h3,
                    { color: colors.text, marginTop: Spacing.md },
                  ]}
                >
                  City
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
                  placeholder="e.g. Hyderabad"
                  placeholderTextColor={colors.textTertiary}
                  value={city}
                  onChangeText={setCity}
                  autoCapitalize="words"
                />
              </View>
            </JournalCard>

            <HandwrittenText variant="handSm" color={colors.textTertiary}>
              we keep this private, promise
            </HandwrittenText>

            <View style={styles.actions}>
              <PuffyButton
                title="Continue"
                icon={'\u27A1\uFE0F'}
                onPress={handleContinue}
                disabled={!canContinue}
              />
            </View>
          </KeyboardAwareScrollView>
        </Animated.View>

      </SafeAreaView>
    </DotGridBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: Spacing.xl,
    gap: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  headerEmoji: {
    fontSize: 48,
  },
  section: {
    gap: Spacing.md,
  },
  input: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 4,
  },
  actions: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },

});
