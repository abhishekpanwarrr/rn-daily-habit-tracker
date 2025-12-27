import { deleteHabit, getHabits, Habit } from "@/db/habits";
import { useThemeColor } from "@/hooks/use-theme-color";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HabitsScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const router = useRouter();
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const card = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");

  useFocusEffect(
    useCallback(() => {
      setHabits(getHabits());
    }, [])
  );

  const onLongPressHabit = (habitId: number) => {
    Alert.alert(
      "Delete habit?",
      "This will remove the habit and all its history.",
      [
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteHabit(habitId);
            setHabits(getHabits());
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: background }]}>
        <Text style={[styles.title, { color: text }]}>Habits</Text>
        <Text style={[styles.subtitle, { color: textSecondary }]}>
          Manage your habits
        </Text>
      </View>

      {/* Habit List */}
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id.toString()}
        style={{ backgroundColor: background }}
        contentContainerStyle={{
          backgroundColor: background,
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
            style={[
              styles.habitCard,
              { backgroundColor: card, borderColor: border },
            ]}
          >
            <View style={[styles.colorDot, { backgroundColor: item.color }]} />
            <Text style={[styles.habitName, { color: text }]}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={[styles.emptyState, { backgroundColor: background }]}>
            <Text style={[styles.emptyTitle, { color: text }]}>
              No habits yet
            </Text>
            <Text style={[styles.emptySub, { color: textSecondary }]}>
              Add your first habit from the + button
            </Text>
          </View>
        }
      />
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
});
