import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
  Easing,
  Modal,
  FlatList,
} from 'react-native';
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

// ── Country codes ────────────────────────────────────────────

const COUNTRY_CODES = [
  { code: '+91', country: 'India', digits: 10 },
  { code: '+1', country: 'US / Canada', digits: 10 },
  { code: '+44', country: 'UK', digits: 10 },
  { code: '+971', country: 'UAE', digits: 9 },
  { code: '+65', country: 'Singapore', digits: 8 },
  { code: '+60', country: 'Malaysia', digits: 10 },
  { code: '+61', country: 'Australia', digits: 9 },
  { code: '+966', country: 'Saudi Arabia', digits: 9 },
  { code: '+974', country: 'Qatar', digits: 8 },
  { code: '+968', country: 'Oman', digits: 8 },
  { code: '+977', country: 'Nepal', digits: 10 },
  { code: '+94', country: 'Sri Lanka', digits: 9 },
  { code: '+880', country: 'Bangladesh', digits: 10 },
];

export default function ProfileDetailsScreen() {
  const { colors, mode } = useTheme();
  const router = useRouter();
  const { data, update, setStep } = useOnboarding();
  const toast = useToast();

  const [phone, setPhone] = useState(data.phone);
  const [countryCode, setCountryCode] = useState(data.countryCode || '+91');
  const [college, setCollege] = useState(data.college);
  const [city, setCity] = useState(data.city);
  const [showCodes, setShowCodes] = useState(false);

  useEffect(() => {
    setStep(2);
  }, []);

  const selectedCountry =
    COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0];

  const canContinue =
    phone.trim().length >= selectedCountry.digits &&
    college.trim().length >= 2 &&
    city.trim().length >= 2;

  const handleContinue = () => {
    if (!canContinue) return;
    update({
      phone: phone.trim(),
      countryCode,
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
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
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

            {/* Phone Number */}
            <JournalCard rotation={-0.3} delay={100}>
              <View style={styles.section}>
                <Text style={[Typography.h3, { color: colors.text }]}>
                  Phone number
                </Text>

                <View style={styles.phoneRow}>
                  {/* Country Code Picker */}
                  <Pressable
                    onPress={() => setShowCodes(true)}
                    style={[
                      styles.codeBtn,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.surfaceBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.codeText,
                        { color: colors.text },
                      ]}
                    >
                      {countryCode}
                    </Text>
                    <Text style={{ color: colors.textTertiary, fontSize: 10 }}>
                      {'\u25BC'}
                    </Text>
                  </Pressable>

                  {/* Phone Input */}
                  <TextInput
                    style={[
                      styles.phoneInput,
                      {
                        color: colors.text,
                        backgroundColor: colors.surface,
                        borderColor: colors.surfaceBorder,
                      },
                    ]}
                    placeholder="Phone number"
                    placeholderTextColor={colors.textTertiary}
                    value={phone}
                    onChangeText={(t) =>
                      setPhone(t.replace(/[^0-9]/g, '').slice(0, 15))
                    }
                    keyboardType="phone-pad"
                    maxLength={15}
                  />
                </View>
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
          </ScrollView>
        </Animated.View>

        {/* Country Code Modal */}
        <Modal
          visible={showCodes}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCodes(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowCodes(false)}
          >
            <View
              style={[
                styles.modalContent,
                { backgroundColor: colors.background },
              ]}
            >
              <Text
                style={[
                  Typography.h3,
                  { color: colors.text, marginBottom: Spacing.md },
                ]}
              >
                Select country code
              </Text>
              <FlatList
                data={COUNTRY_CODES}
                keyExtractor={(item) => item.code}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isActive = item.code === countryCode;
                  return (
                    <Pressable
                      onPress={() => {
                        setCountryCode(item.code);
                        setShowCodes(false);
                      }}
                      style={[
                        styles.codeRow,
                        {
                          backgroundColor: isActive
                            ? colors.primary + '15'
                            : 'transparent',
                          borderColor: isActive
                            ? colors.primary
                            : colors.surfaceBorder,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.codeRowCode,
                          {
                            color: isActive ? colors.primary : colors.text,
                          },
                        ]}
                      >
                        {item.code}
                      </Text>
                      <Text
                        style={[
                          styles.codeRowCountry,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {item.country}
                      </Text>
                    </Pressable>
                  );
                }}
              />
            </View>
          </Pressable>
        </Modal>
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
  phoneRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  codeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 4,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
  },
  codeText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
  },
  phoneInput: {
    flex: 1,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 4,
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

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  modalContent: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    maxHeight: 420,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  codeRowCode: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    width: 55,
  },
  codeRowCountry: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
  },
});
