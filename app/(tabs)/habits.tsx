import { deleteHabit, getHabits, Habit } from "@/db/habits";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HabitsScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const { colors } = useTheme();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setHabits(getHabits());
    }, []),
  );

  const onDelete = (id: number) => {
    Alert.alert("Delete habit?", "This will remove the habit and all its history.", [
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteHabit(id);
          setHabits(getHabits());
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header onAdd={() => router.push("/habit/add")} />

      <FlatList
        data={habits}
        ListHeaderComponent={<TipCard />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <HabitItem
            habit={item}
            onLongPress={() => onDelete(item.id)}
            onPress={() =>
              router.push({
                pathname: "/habit/edit",
                params: {
                  id: item.id.toString(),
                  name: item.name,
                  color: item.color,
                  category: item.category,
                },
              })
            }
          />
        )}
        ListEmptyComponent={<EmptyState />}
      />
    </SafeAreaView>
  );
}

/* -------------------- Header -------------------- */
const Header = ({ onAdd }: { onAdd: () => void }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.headerRow,
        {
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Habits</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Manage your habits</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.addButton,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        onPress={onAdd}
      >
        <Ionicons name="add" size={25} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};

/* -------------------- Tip Card -------------------- */
const TipCard = () => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.tipCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
        Tip: Tap a habit to edit. Longpress to delete
      </Text>
      <Text style={{ color: colors.textSecondary, fontSize: 13, marginVertical: 5 }}>
        Reordering coming soon ✨
      </Text>
    </View>
  );
};

/* -------------------- Habit Item -------------------- */
const HabitItem = ({
  habit,
  onPress,
  onLongPress,
}: {
  habit: Habit;
  onPress: () => void;
  onLongPress: () => void;
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.habitCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.colorDot, { backgroundColor: habit.color }]} />

      <View style={styles.habitTextContainer}>
        <Text style={[styles.habitName, { color: colors.text }]}>{habit.name}</Text>
        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
          {habit.category ?? "Uncategorized"}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </TouchableOpacity>
  );
};

/* -------------------- Empty State -------------------- */
const EmptyState = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.emptyState}>
      <Ionicons name="leaf-outline" size={48} color={colors.border} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No habits yet</Text>
      <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
        Start with one habit — consistency beats intensity 🌱
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  /* Header */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
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

  addButton: {
    padding: 8,
    borderRadius: 50,
    borderWidth: 1,
    elevation: 2,
  },

  /* Tip */
  tipCard: {
    padding: 10,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },

  /* List */
  listContent: {
    paddingBottom: 24,
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

  habitTextContainer: {
    flex: 1,
  },

  habitName: {
    fontSize: 16,
    fontWeight: "500",
  },

  /* Empty */
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
