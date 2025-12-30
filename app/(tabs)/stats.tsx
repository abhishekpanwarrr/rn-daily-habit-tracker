import { getHabits } from "@/db/habits";
import { useTheme } from "@/hooks/useTheme";
import { getWeeklyCompletion, getWeeklyPercent } from "@/utils/stats";
import { getCurrentStreak } from "@/utils/streak";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Animated, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AnimatedBar = ({
  active,
  color,
  inactiveColor,
}: {
  active: boolean;
  color: string;
  inactiveColor: string;
}) => {
  const height = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(height, {
      toValue: active ? 40 : 14,
      duration: 400,
      useNativeDriver: false, // 🔥 height needs JS driver
    }).start();
  }, [active]);

  return (
    <Animated.View
      style={{
        width: 12,
        height,
        backgroundColor: active ? color : inactiveColor,
        borderRadius: 6,
        marginRight: 6,
      }}
    />
  );
};

const Stats = () => {
  const {
    colors: { border, text, card, textSecondary, background, primary },
  } = useTheme();

  const [habits, setHabits] = useState<any[]>([]);

  const groupedHabits = habits.reduce((acc: any, habit: any) => {
    const category = habit.category ?? "Uncategorized";

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(habit);
    return acc;
  }, {});

  // 🔄 Reload habits when tab is focused
  useFocusEffect(
    useCallback(() => {
      const data = getHabits();
      setHabits(data);
    }, [])
  );
  const getLast7Days = () => {
    return [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });
  };

  // ✅ EMPTY STATE
  if (habits.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          backgroundColor: background,
        }}
      >
        <Ionicons name="stats-chart-outline" size={56} color={border} />
        <Text style={{ color: text, fontSize: 18, marginTop: 12 }}>
          No stats yet
        </Text>
        <Text
          style={{
            color: textSecondary,
            textAlign: "center",
            marginTop: 6,
          }}
        >
          Complete habits to see your progress here
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: background,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          backgroundColor: background,
        }}
      >
        <Text
          style={{
            color: text,
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 12,
          }}
        >
          Your Stats
        </Text>
        {habits.map((h) => {
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
                marginBottom: 14,
              }}
            >
              {/* Title */}
              <Text style={{ color: text, fontSize: 16, fontWeight: "600" }}>
                {h.name}
              </Text>

              {/* Streak */}
              <Text style={{ color: textSecondary, marginTop: 4 }}>
                🔥 {getCurrentStreak(h.id)} day streak
              </Text>

              {/* Weekly dots */}
              <View style={{ flexDirection: "row", marginTop: 10 }}>
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

              {/* Progress bar */}
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

              <Text style={{ color: textSecondary, marginTop: 6 }}>
                Weekly completion: {percent}%
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Stats;
