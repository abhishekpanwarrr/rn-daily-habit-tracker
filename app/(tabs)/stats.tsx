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

  // Reload habits when tab is focused
  useFocusEffect(
    useCallback(() => {
      setHabits(getHabits());
    }, [])
  );

  // EMPTY STATE
  if (habits.length === 0) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: background,
          padding: 24,
        }}
      >
        <Ionicons name="stats-chart-outline" size={56} color={border} />
        <Text style={{ color: text, fontSize: 18, marginTop: 12 }}>No stats yet</Text>
        <Text
          style={{
            color: textSecondary,
            textAlign: "center",
            marginTop: 6,
          }}
        >
          Complete habits consistently to unlock insights 📊
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 6,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: "#ccc",
            marginBottom: 16,
          }}
        >
          <View style={[styles.header, { backgroundColor: background }]}>
            <Text style={[styles.title, { color: text }]}> Your Stats</Text>
            <Text style={[styles.subtitle, { color: textSecondary }]}>Check your stats</Text>
          </View>
        </View>
        {Object.entries(grouped).map(([category, list]) => {
          const total = list.length;
          const active = list.filter((h) => getCurrentStreak(h.id) > 0).length;
          const categoryPercent = Math.round((active / total) * 100);

          return (
            <View
              key={category}
              style={{
                marginBottom: 28,
                elevation: 2,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: border,
                padding: 12,
                borderRadius: 12,
                backgroundColor: card,
              }}
            >
              {/* CATEGORY HEADER */}
              <Text
                style={{
                  color: text,
                  fontSize: 18,
                  fontWeight: "700",
                  marginBottom: 6,
                }}
              >
                {category}
              </Text>

              {/* CATEGORY SUMMARY BAR */}
              <View
                style={{
                  height: 8,
                  backgroundColor: border,
                  borderRadius: 8,
                  overflow: "hidden",
                  marginBottom: 6,
                }}
              >
                <View
                  style={{
                    width: `${categoryPercent}%`,
                    height: "100%",
                    backgroundColor: primary,
                  }}
                />
              </View>

              <Text
                style={{
                  color: textSecondary,
                  fontSize: 12,
                  marginBottom: 12,
                }}
              >
                {categoryPercent}% habits active this week
              </Text>

              {/* HABITS IN CATEGORY */}
              {list.map((h) => {
                const days = getWeeklyCompletion(h.id);
                const percent = getWeeklyPercent(days);

                return (
                  <View
                    key={h.id}
                    style={{
                      padding: 16,
                      borderRadius: 18,
                      backgroundColor: card,
                      borderWidth: 1,
                      borderColor: border,
                      marginBottom: 12,
                    }}
                  >
                    <Text
                      style={{
                        color: text,
                        fontSize: 16,
                        fontWeight: "600",
                      }}
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
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            marginRight: 6,
                            backgroundColor: done ? primary : border,
                          }}
                        />
                      ))}
                    </View>

                    {/* PROGRESS BAR */}
                    <View
                      style={{
                        height: 6,
                        backgroundColor: border,
                        borderRadius: 6,
                        marginTop: 10,
                        overflow: "hidden",
                      }}
                    >
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
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Stats;

const styles = StyleSheet.create({
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
