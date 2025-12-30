import { isHabitDoneToday, toggleHabitToday } from "@/db/habitLogs";
import { getHabits } from "@/db/habits";
import { useTheme } from "@/hooks/useTheme";
import { getCurrentStreak } from "@/utils/streak";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TodayScreen() {
  const { colors, toggleTheme, theme } = useTheme();
  const [habits, setHabits] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const router = useRouter();

  const completedCount = habits.filter((h) => isHabitDoneToday(h.id)).length;

  useFocusEffect(
    useCallback(() => {
      setHabits(getHabits());
    }, [])
  );

  useEffect(() => {
    setHabits(getHabits());
  }, [refresh]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 16,
      }}
    >
      {/* 🔒 FULL-SCREEN BACKDROP (outside tap closer) */}
      {settingsOpen && (
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setSettingsOpen(false)} />
      )}

      {/* HEADER */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.greeting, { color: colors.text }]}>Hello 👋</Text>
          <Text style={[styles.subGreeting, { color: colors.textSecondary }]}>
            Let’s build habits today
          </Text>
        </View>

        {/* SETTINGS */}
        <View style={{ position: "relative" }}>
          <TouchableOpacity onPress={() => setSettingsOpen((v) => !v)} style={styles.themeButton}>
            <Ionicons
              name={theme === "dark" ? "settings" : "settings-outline"}
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>

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

              {/* Logout */}
              {/* <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setSettingsOpen(false);
                  Alert.alert("Logout", "Are you sure you want to logout?");
                }}
              >
                <Ionicons name="log-out-outline" size={18} color="red" />
                <Text style={[styles.menuText, { color: "red" }]}>Logout</Text>
              </TouchableOpacity>*/}
            </View>
          )}
        </View>
      </View>

      {/* PROGRESS */}
      <View style={[styles.progressCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.progressTitle, { color: colors.text }]}>Today’s Progress</Text>
        <Text style={{ color: colors.textSecondary, marginBottom: 12 }}>
          {completedCount} of {habits.length} habits completed
        </Text>

        <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.primary,
                width: `${habits.length === 0 ? 0 : (completedCount / habits.length) * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* HABIT LIST */}
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => {
          const done = isHabitDoneToday(item.id);
          const streak = getCurrentStreak(item.id);

          return (
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleHabitToday(item.id);
                setRefresh((v) => v + 1);
              }}
              style={[
                styles.habitCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
                <Ionicons name={done ? "checkmark" : "ellipse-outline"} size={16} color="#fff" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.habitName, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.habitSub, { color: colors.textSecondary }]}>
                  {streak > 0 ? `🔥 ${streak} day streak` : "Start your streak today"}
                </Text>
              </View>

              {done && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
            </TouchableOpacity>
          );
        }}
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push("/habit/add")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

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

  progressCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  progressTrack: {
    height: 10,
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },

  habitCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 14,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  habitName: {
    fontSize: 16,
    fontWeight: "600",
  },
  habitSub: {
    fontSize: 13,
    marginTop: 2,
  },

  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  fabText: {
    color: "#fff",
    fontSize: 28,
  },
});
