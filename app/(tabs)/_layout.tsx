import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const background = useThemeColor({}, "background");
  const border = useThemeColor({}, "border");
  const text = useThemeColor({}, "text");
  const primary = useThemeColor({}, "primary");
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        // 🔥 TAB BAR BACKGROUND
        tabBarStyle: {
          backgroundColor: background,
          borderTopColor: border,
        },

        // 🔥 ICON COLORS
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: text,

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: "Habits",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
