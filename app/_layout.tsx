import { AppTheme, AppThemeContext, THEME_STORAGE_KEY } from "@/context/AppThemeContext";
import { initializeDatabase } from "@/db/database";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const systemScheme = useColorScheme();
  const [dbReady, setDbReady] = useState(false);
  // 🔥 GLOBAL THEME STATE
  const [theme, setThemeState] = useState<AppTheme>("system");
  const [themeReady, setThemeReady] = useState(false);
  const effectiveScheme = theme === "system" ? systemScheme : theme;

  const setTheme = async (newTheme: AppTheme) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  useEffect(() => {
    if (!themeReady) return;
    try {
      initializeDatabase(); // sync call
      setDbReady(true);
    } catch (e) {
      console.error("Database initialization failed", e);
    }
  }, []);
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
        setThemeState(savedTheme);
      }
      setThemeReady(true);
    };

    loadTheme();
  }, []);
  // ⛔ BLOCK UI UNTIL DB EXISTS
  if (!dbReady || !themeReady) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AppThemeContext.Provider value={{ theme, setTheme }}>
      <ThemeProvider value={effectiveScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="habit/add"
            options={{
              presentation: "modal",
              title: "Add new habit",
              headerStyle: {
                backgroundColor: effectiveScheme === "dark" ? "#0F172A" : "#F9FAFB",
              },
              headerTintColor: effectiveScheme === "dark" ? "#F8FAFC" : "#111827",
              headerTitleStyle: {
                fontWeight: "600",
              },
            }}
          />
          <Stack.Screen
            name="habit/edit"
            options={{
              presentation: "modal",
              title: "Edit habit",
              headerStyle: {
                backgroundColor: effectiveScheme === "dark" ? "#0F172A" : "#F9FAFB",
              },
              headerTintColor: effectiveScheme === "dark" ? "#F8FAFC" : "#111827",
              headerTitleStyle: {
                fontWeight: "600",
              },
            }}
          />
          <Stack.Screen name="settings" options={{ title: "Settings" }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppThemeContext.Provider>
  );
}
