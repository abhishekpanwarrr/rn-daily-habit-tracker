import { View, Text, Pressable, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";

const Header = () => {
  const { colors, toggleTheme, theme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  return (
    <>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.greeting, { color: colors.text }]}>Hello 👋</Text>
          <Text style={[styles.subGreeting, { color: colors.textSecondary }]}>
            Let’s build habits today
          </Text>
        </View>

        {/* SETTINGS */}
        <View style={{ position: "relative" }}>
          <Pressable onPress={() => setSettingsOpen((v) => !v)} style={styles.themeButton}>
            <Ionicons
              name={theme === "dark" ? "settings" : "settings-outline"}
              size={22}
              color={colors.text}
            />
          </Pressable>

          {settingsOpen && (
            <View
              style={[
                styles.settingsMenu,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  zIndex: 100,
                },
              ]}
            >
              {/* Theme toggle */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  toggleTheme();
                  setSettingsOpen(false);
                }}
              >
                <Ionicons
                  name={theme === "dark" ? "sunny-outline" : "moon-outline"}
                  size={18}
                  color={colors.text}
                />
                <Text style={[styles.menuText, { color: colors.text }]}>
                  {theme === "dark" ? "Light Theme" : "Dark Theme"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      {/* 🔒 FULL-SCREEN BACKDROP (outside tap closer) */}
      {settingsOpen && (
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setSettingsOpen(false)} />
      )}
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },

  greeting: {
    fontSize: 26,
    fontWeight: "700",
  },
  subGreeting: {
    fontSize: 14,
    marginTop: 4,
  },

  themeButton: {
    padding: 8,
    borderRadius: 20,
  },

  settingsMenu: {
    position: "absolute",
    top: 42,
    right: 0,
    minWidth: 160,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 6,
    elevation: 6,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  menuText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
