const primaryLight = "#2563EB";
const primaryDark = "#3B82F6";

export const themes: any = {
  // light: {
  //   background: "#FFFFFF",
  //   text: "#000000",
  //   primary: "#007AFF",
  //   secondary: "#5856D6",
  //   border: "#E5E5EA",
  //   card: "#F2F2F7",
  // },
  // dark: {
  //   background: "#000000",
  //   text: "#FFFFFF",
  //   primary: "#0A84FF",
  //   secondary: "#5E5CE6",
  //   border: "#38383A",
  //   card: "#1C1C1E",
  // },

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
