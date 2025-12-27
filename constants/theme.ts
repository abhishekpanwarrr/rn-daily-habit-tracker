/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const primaryLight = "#2563EB";
const primaryDark = "#3B82F6";

export const Colors = {
  light: {
    /* Core surfaces */
    background: "#F9FAFB",
    card: "#FFFFFF",

    /* Text */
    text: "#111827",
    textSecondary: "#6B7280",

    /* Brand */
    tint: primaryLight,
    primary: primaryLight,
    success: "#22C55E",

    /* UI */
    border: "#E5E7EB",
    muted: "#9CA3AF",
    completedCard: "#ECFDF5",

    /* Tabs / icons (Expo expects these keys) */
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: primaryLight,
  },

  dark: {
    /* Core surfaces */
    background: "#0F172A",
    card: "#1E293B",

    /* Text */
    text: "#F8FAFC",
    textSecondary: "#CBD5E1",

    /* Brand */
    tint: primaryDark,
    primary: primaryDark,
    success: "#22C55E",

    /* UI */
    border: "#334155",
    muted: "#64748B",
    completedCard: "#052E16",

    /* Tabs / icons */
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: primaryDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
