import { Tabs } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { ToastProvider } from '../../src/components/ui/Toast';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.emoji, { opacity: focused ? 1 : 0.5 }]}>{emoji}</Text>
    </View>
  );
}

export default function MainLayout() {
  const { colors } = useTheme();

  return (
    <ToastProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.tabActive,
          tabBarInactiveTintColor: colors.tabInactive,
          tabBarLabelStyle: {
            fontFamily: 'PlusJakartaSans_600SemiBold',
            fontSize: 11,
            letterSpacing: 0.5,
          },
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.tabBarBorder,
            borderTopWidth: 1,
            height: 85,
            paddingTop: 8,
            paddingBottom: 28,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Study Board',
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji={'\uD83D\uDCDA'} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Me',
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji={'\u270D\uFE0F'} focused={focused} />
            ),
          }}
        />
      </Tabs>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 22,
  },
});
