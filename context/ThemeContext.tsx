import { createContext, useContext, useState } from "react";
import { useColorScheme as useSystemScheme } from "react-native";

type ThemeMode = "system" | "light" | "dark";

const ThemeContext = createContext<{
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}>({
  mode: "system",
  setMode: () => {},
});

export function ThemeProviderCustom({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemScheme();
  const [mode, setMode] = useState<ThemeMode>("system");

  const effectiveScheme = mode === "system" ? systemScheme : mode;

  return <ThemeContext.Provider value={{ mode, setMode }}>{children}</ThemeContext.Provider>;
}

export function useThemeMode() {
  return useContext(ThemeContext);
}
