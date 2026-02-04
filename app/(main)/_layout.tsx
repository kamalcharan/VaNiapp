import { Slot, useSegments, useRouter } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/hooks/useTheme';
import { ToastProvider } from '../../src/components/ui/Toast';

const TABS = [
  { key: 'index', route: '/(main)', label: 'Study Board', emoji: '\uD83D\uDCDA' },
  { key: 'profile', route: '/(main)/profile', label: 'Me', emoji: '\u270D\uFE0F' },
] as const;

export default function MainLayout() {
  const { colors } = useTheme();
  const segments = useSegments();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Determine active tab from URL segments
  // segments for (main)/index → ['(main)']  or ['(main)', 'index']
  // segments for (main)/profile → ['(main)', 'profile']
  const activeKey =
    segments.length > 1 && segments[1] === 'profile' ? 'profile' : 'index';

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
