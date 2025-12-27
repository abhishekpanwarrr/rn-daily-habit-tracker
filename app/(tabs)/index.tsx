import { useAppTheme } from "@/context/AppThemeContext";
import { isHabitDoneToday, toggleHabitToday } from "@/db/habitLogs";
import { deleteHabit, getHabitById, getHabits } from "@/db/habits";
import { useThemeColor } from "@/hooks/use-theme-color";
import { cancelReminder } from "@/utils/notifications";
import { getCurrentStreak } from "@/utils/streak";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TodayScreen() {
  const background = useThemeColor({}, "background");
  const surface = useThemeColor({}, "card");

  const [habits, setHabits] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(0);
  // Theme colors
  const text = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const card = useThemeColor({}, "card");
  const completedCard = useThemeColor({}, "completedCard");
  const border = useThemeColor({}, "border");
  const primary = useThemeColor({}, "primary");
  // Router
  const router = useRouter();

  const { theme, setTheme } = useAppTheme();

  const toggleTheme = () => {
    // @ts-ignore
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };
  useFocusEffect(
    useCallback(() => {
      const data = getHabits();
      setHabits(data);
    }, [])
  );
  useEffect(() => {
    const data = getHabits();
    setHabits(data);
  }, [refresh]);

  const completedCount = habits.filter((h) => isHabitDoneToday(h.id)).length;

  const onLongPressHabit = (habitId: number) => {
    Alert.alert(
      "Habit options",
      "What would you like to do?",
      [
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteHabit(habitId);
            setRefresh((v) => v + 1);
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: background, paddingHorizontal: 16 }}
    >
      <View style={[styles.headerRow, { backgroundColor: background }]}>
        <View>
          <Text style={[styles.title, { color: text }]}>Today</Text>
          <Text style={[styles.subtitle, { color: textSecondary }]}>
            {new Date().toDateString()}
          </Text>
        </View>

        {/* Theme Toggle */}
        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.themeButton, { backgroundColor: surface }]}
        >
          <Ionicons
            name={theme === "dark" ? "sunny-outline" : "moon-outline"}
            size={22}
            color={text}
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.progressCard, { backgroundColor: card }]}>
        <Text style={[styles.progressTitle, { color: text }]}>
          Today’s Progress
        </Text>

        <Text style={{ color: textSecondary, marginBottom: 8 }}>
          {completedCount} of {habits.length} habits completed
        </Text>

        {/* Progress Bar */}
        <View style={[styles.progressTrack, { backgroundColor: border }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: primary,
                width: `${
                  habits.length === 0
                    ? 0
                    : (completedCount / habits.length) * 100
                }%`,
              },
            ]}
          />
        </View>
      </View>

      {/* HABIT LIST */}
      <FlatList
        style={{ backgroundColor: background }}
        contentContainerStyle={{
          paddingBottom: 100,
          backgroundColor: background,
        }}
        data={habits}
        keyExtractor={(item) => item.id.toString()}
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
              onLongPress={async () => {
                const habit = getHabitById(item.id);

                if (habit?.notificationId) {
                  await cancelReminder(habit.notificationId);
                }

                deleteHabit(item.id);
                setRefresh((v) => v + 1);
                onLongPressHabit(item.id);
              }}
              style={[
                styles.habitCard,
                {
                  backgroundColor: done ? completedCard : card,
                  borderColor: border,
                },
              ]}
            >
              {/* Checkbox */}
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: item.color,
                    backgroundColor: done ? item.color : "transparent",
                  },
                ]}
              />

              {/* Text */}
              <View style={{ flex: 1 }}>
                <Text style={[styles.habitName, { color: text }]}>
                  {item.name}
                </Text>
                <Text style={[styles.habitSub, { color: textSecondary }]}>
                  {streak > 0
                    ? `🔥 ${streak} day streak`
                    : "⏳ Start your streak today"}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={[styles.emptyState, { backgroundColor: background }]}>
            <Text style={[styles.emptyTitle, { color: text }]}>
              No habits yet
            </Text>
            <Text style={[styles.emptySub, { color: textSecondary }]}>
              Start with one small habit today
            </Text>
          </View>
        }
      />
      {/* FAB (Add Habit – wired later) */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: primary }]}
        onPress={() => router.push("/habit/add")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  themeButton: {
    padding: 8,
    borderRadius: 20,
    elevation: 1,
  },
  header: {
    marginTop: 16,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
  },

  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },

  progressCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  progressTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },

  habitCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 12,
  },

  habitName: {
    fontSize: 16,
    fontWeight: "500",
  },

  habitSub: {
    fontSize: 13,
    marginTop: 2,
  },

  emptyState: {
    marginTop: 80,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 4,
  },

  emptySub: {
    fontSize: 14,
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
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 28,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
});
