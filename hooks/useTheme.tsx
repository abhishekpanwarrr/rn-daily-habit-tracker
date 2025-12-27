import { themes } from "@/context/theme";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";

export function useTheme() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const colors = themes[theme];

  return {
    theme,
    toggleTheme,
    colors,
  };
}
