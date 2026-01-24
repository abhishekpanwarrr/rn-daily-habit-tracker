import Header from "@/components/home/header";
import Progress from "@/components/home/progress";
import { isHabitDoneToday, toggleHabitToday } from "@/db/habitLogs";
import { getHabits } from "@/db/habits";
import { useTheme } from "@/hooks/useTheme";
import { getCurrentStreak } from "@/utils/streak";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TodayScreen() {
  const { colors } = useTheme();
  const [habits, setHabits] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(0);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setHabits(getHabits());
    }, []),
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
      <Header />
      <FlatList
        data={habits}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Progress habits={habits} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => {
          const done = isHabitDoneToday(item.id);
          const streak = getCurrentStreak(item.id);
          return (
            <Pressable
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

              {done && <Ionicons name="checkmark-circle" size={22} color={item.color} />}
            </Pressable>
          );
        }}
      />
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
    zIndex: 50,
  },
  fabText: {
    color: "#fff",
    fontSize: 28,
  },
});
