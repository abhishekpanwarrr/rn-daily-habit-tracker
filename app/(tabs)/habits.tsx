import { deleteHabit, getHabits, Habit } from "@/db/habits";
import { useTheme } from "@/hooks/useTheme";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HabitsScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const router = useRouter();
  const { colors, toggleTheme, theme } = useTheme();
  useFocusEffect(
    useCallback(() => {
      setHabits(getHabits());
    }, [])
  );

  const onLongPressHabit = (habitId: number) => {
    Alert.alert("Delete habit?", "This will remove the habit and all its history.", [
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteHabit(habitId);
          setHabits(getHabits());
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Habits</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Manage your habits</Text>
      </View>

      {/* Habit List */}
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id.toString()}
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{
          backgroundColor: colors.background,
          paddingBottom: 24,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push({
                pathname: "/habit/edit",
                params: {
                  id: item.id.toString(),
                  name: item.name,
                  color: item.color,
                },
              });
            }}
            onLongPress={() => onLongPressHabit(item.id)}
            style={[styles.habitCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[styles.colorDot, { backgroundColor: item.color }]} />
            <Text style={[styles.habitName, { color: colors.text }]}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={[styles.emptyState, { backgroundColor: colors.background }]}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No habits yet</Text>
            <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
              Add your first habit from the + button
            </Text>
          </View>
        }
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
  container: {
    flex: 1,
    paddingHorizontal: 16,
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

  habitCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },

  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 12,
  },

  habitName: {
    fontSize: 16,
    fontWeight: "500",
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
});
