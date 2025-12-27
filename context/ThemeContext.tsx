// import { createContext, useContext, useState } from "react";
// import { useColorScheme as useSystemScheme } from "react-native";

// type ThemeMode = "system" | "light" | "dark";

// const ThemeContext = createContext<{
//   mode: ThemeMode;
//   setMode: (mode: ThemeMode) => void;
// }>({
//   mode: "system",
//   setMode: () => {},
// });

// export function ThemeProviderCustom({ children }: { children: React.ReactNode }) {
//   const systemScheme = useSystemScheme();
//   const [mode, setMode] = useState<ThemeMode>("system");

//   const effectiveScheme = mode === "system" ? systemScheme : mode;

//   return <ThemeContext.Provider value={{ mode, setMode }}>{children}</ThemeContext.Provider>;
// }

// export function useThemeMode() {
//   return useContext(ThemeContext);
// }

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

export const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

const THEME_STORAGE_KEY = "@app_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        // Use system theme as default if no saved theme
        setTheme(systemColorScheme || "light");
      }
    } catch (error) {
      console.error("Failed to load theme:", error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
