import { ThemeProvider } from "@/context/ThemeContext";
import { initializeDatabase } from "@/db/database";
import { useTheme } from "@/hooks/useTheme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import LottieView from "lottie-react-native";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);
  useEffect(() => {
    try {
      initializeDatabase();
      setDbReady(true);
    } catch (e) {
      console.error("Database initialization failed", e);
    }
  }, []);
  useEffect(() => {
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      responseListener.remove();
    };
  }, []);
  if (!dbReady) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LottieView
          source={require("@/assets/loader.json")}
          autoPlay
          loop
          style={{ width: 120, height: 120 }}
        />
      </View>
    );
  }
  return (
    <ThemeProvider>
      <RootNavigation />
    </ThemeProvider>
  );
}

function RootNavigation() {
  const { theme } = useTheme();

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="habit/add"
          options={{
            presentation: "modal",
            title: "Add new habit",
            headerStyle: {
              backgroundColor: theme === "dark" ? "#0F172A" : "#F9FAFB",
            },
            headerTintColor: theme === "dark" ? "#F8FAFC" : "#111827",
            headerTitleStyle: { fontWeight: "600" },
          }}
        />

        <Stack.Screen
          name="habit/edit"
          options={{
            presentation: "modal",
            title: "Edit habit",
            headerStyle: {
              backgroundColor: theme === "dark" ? "#0F172A" : "#F9FAFB",
            },
            headerTintColor: theme === "dark" ? "#F8FAFC" : "#111827",
            headerTitleStyle: { fontWeight: "600" },
          }}
        />
      </Stack>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </>
  );
}
