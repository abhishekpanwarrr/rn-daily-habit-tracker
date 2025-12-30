import { createContext, useContext } from "react";

export type AppTheme = "light" | "dark" | "system";

export const AppThemeContext = createContext<{
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}>({
  theme: "system",
  setTheme: () => {},
});

export function useAppTheme() {
  return useContext(AppThemeContext);
}

export const THEME_STORAGE_KEY = "app_theme";
