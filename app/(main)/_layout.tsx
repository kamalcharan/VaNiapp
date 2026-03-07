import { useEffect, useState } from 'react';
import { Slot, useSegments, useRouter } from 'expo-router';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/hooks/useTheme';
import { ToastProvider } from '../../src/components/ui/Toast';
import { getProfile, isOnboardingActuallyComplete } from '../../src/lib/database';
import { useAuth } from '../_layout';

const TABS = [
  { key: 'index', route: '/(main)', label: 'Study Board', emoji: '\uD83D\uDCDA' },
  { key: 'history', route: '/(main)/history', label: 'My Journal', emoji: '\uD83D\uDCD3' },
  { key: 'bookmarks', route: '/(main)/bookmarks', label: 'Saved', emoji: '\uD83D\uDD16' },
  { key: 'profile', route: '/(main)/profile', label: 'Me', emoji: '\u270D\uFE0F' },
] as const;

export default function MainLayout() {
  const { colors } = useTheme();
  const segments = useSegments();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const auth = useAuth();

  const [verified, setVerified] = useState(false);

  // Secondary onboarding guard — prevent access to dashboard without onboarding
  useEffect(() => {
    if (auth.status !== 'authenticated') return;

    (async () => {
      try {
        const profile = await getProfile();
        if (!isOnboardingActuallyComplete(profile)) {
          router.replace('/setup/welcome');
          return;
        }
        setVerified(true);
      } catch {
        // If profile check fails, still allow (root layout handles gating)
        setVerified(true);
      }
    })();
  }, [auth.status]);

  // Determine active tab from URL segments
  const seg1 = segments.length > 1 ? (segments as string[])[1] : '';
  const activeKey =
    seg1 === 'profile' ? 'profile' : seg1 === 'bookmarks' ? 'bookmarks' : seg1 === 'history' ? 'history' : 'index';

  if (!verified) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ToastProvider>
      <View style={styles.container}>
        <Slot />

        {/* Custom tab bar */}
        <View
          style={[
            styles.tabBar,
            {
              backgroundColor: colors.tabBar,
              borderTopColor: colors.tabBarBorder,
              paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
            },
          ]}
        >
          {TABS.map((tab) => {
            const focused = activeKey === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => {
                  if (!focused) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.replace(tab.route as any);
                  }
                }}
                style={styles.tab}
              >
                <Text style={[styles.emoji, { opacity: focused ? 1 : 0.5 }]}>
                  {tab.emoji}
                </Text>
                <Text
                  style={[
                    styles.label,
                    { color: focused ? colors.tabActive : colors.tabInactive },
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  emoji: {
    fontSize: 22,
  },
  label: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    letterSpacing: 0.5,
  },
});
