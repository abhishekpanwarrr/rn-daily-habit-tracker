import { getHabits } from "@/db/habits";
import { useTheme } from "@/hooks/useTheme";
import { getWeeklyCompletion, getWeeklyPercent } from "@/utils/stats";
import { getCurrentStreak } from "@/utils/streak";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const groupByCategory = (habits: any[]) => {
  return habits.reduce((acc: Record<string, any[]>, habit) => {
    const key = habit.category ?? "Uncategorized";
    acc[key] = acc[key] || [];
    acc[key].push(habit);
    return acc;
  }, {});
};

const Stats = () => {
  const {
    colors: { border, text, card, textSecondary, background, primary },
  } = useTheme();
  const [habits, setHabits] = useState<any[]>([]);
  const grouped = groupByCategory(habits);

  useFocusEffect(
    useCallback(() => {
      setHabits(getHabits());
    }, []),
  );

  if (habits.length === 0) {
    return (
      <SafeAreaView style={[styles.emptyContainer, { backgroundColor: background }]}>
        <Ionicons name="stats-chart-outline" size={56} color={border} />
        <Text style={[styles.emptyContainerText, { color: text }]}>No stats yet</Text>
        <Text style={[styles.emptyContainerSubText, { color: textSecondary }]}>
          Complete habits consistently to unlock insights 📊
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Header />
        {Object.entries(grouped).map(([category, list]) => {
          const total = list.length;
          const active = list.filter((h) => getCurrentStreak(h.id) > 0).length;
          const categoryPercent = Math.round((active / total) * 100);

          return (
            <View
              key={category}
              style={[styles.categoryHeaderBox, { backgroundColor: card, borderColor: border }]}
            >
              <Text style={[styles.categoryHeaderText, { color: text }]}>{category}</Text>
              <View style={[styles.categorySummaryBar, { backgroundColor: border }]}>
                <View
                  style={[
                    styles.categoryBar,
                    { backgroundColor: primary, width: `${categoryPercent}%` },
                  ]}
                />
              </View>

              <Text style={[styles.categoryBarSubText, { color: textSecondary }]}>
                {categoryPercent}% habits active this week
              </Text>

              {/* HABITS IN CATEGORY */}
              <Habits list={list} />
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Stats;

const Header = () => {
  const {
    colors: { text, textSecondary, background },
  } = useTheme();
  return (
    <View style={styles.topContainer}>
      <View style={[styles.header, { backgroundColor: background }]}>
        <Text style={[styles.title, { color: text }]}> Your Stats</Text>
        <Text style={[styles.subtitle, { color: textSecondary }]}>Check your stats</Text>
      </View>
    </View>
  );
};

const Habits = ({ list }: { list: any }) => {
  const {
    colors: { border, text, card, textSecondary, primary },
  } = useTheme();
  return (
    <>
      {list.map((h: any) => {
        const days = getWeeklyCompletion(h.id);
        const percent = getWeeklyPercent(days);

        return (
          <View
            key={h.id}
            style={[
              styles.categoryItemBox,
              {
                backgroundColor: card,
                borderColor: border,
              },
            ]}
          >
            <Text
              style={[
                styles.categoryItemBoxName,
                {
                  color: text,
                },
              ]}
            >
              {h.name}
            </Text>

            <Text
              style={{
                color: textSecondary,
                marginTop: 4,
              }}
            >
              🔥 {getCurrentStreak(h.id)} day streak
            </Text>

            {/* WEEKLY DOTS */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
              }}
            >
              {days.map((done, idx) => (
                <View
                  key={idx}
                  style={[styles.daysBox, { backgroundColor: done ? primary : border }]}
                />
              ))}
            </View>

            {/* PROGRESS BAR */}
            <View style={[styles.secondBar, { backgroundColor: border }]}>
              <View
                style={{
                  height: "100%",
                  width: `${percent}%`,
                  backgroundColor: primary,
                }}
              />
            </View>

            <Text
              style={{
                color: textSecondary,
                marginTop: 6,
                fontSize: 12,
              }}
            >
              Weekly completion: {percent}%
            </Text>
          </View>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  secondBar: {
    height: 6,
    borderRadius: 6,
    marginTop: 10,
    overflow: "hidden",
  },
  daysBox: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  categoryItemBoxName: {
    fontSize: 16,
    fontWeight: "600",
  },
  categoryItemBox: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
  },
  categoryBarSubText: {
    fontSize: 12,
    marginBottom: 12,
  },
  categoryBar: {
    height: "100%",
  },
  categorySummaryBar: {
    height: 8,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 6,
  },
  categoryHeaderBox: {
    marginBottom: 28,
    elevation: 2,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    borderRadius: 12,
  },
  categoryHeaderText: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyContainerText: { fontSize: 18, marginTop: 12 },
  emptyContainerSubText: {
    textAlign: "center",
    marginTop: 6,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
    marginBottom: 16,
  },
  header: {
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
});
