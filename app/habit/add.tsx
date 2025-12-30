import { addHabit, updateHabitNotificationId } from "@/db/habits";
import { useTheme } from "@/hooks/useTheme";
import { CATEGORIES, COLORS } from "@/utils/extra";
import {
  requestNotificationPermission,
  scheduleDailyReminder,
} from "@/utils/notifications";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddHabitScreen() {
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const hour = 9;
  const minute = 0;
  const router = useRouter();
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [category, setCategory] = useState("Health");

  const onSave = async () => {
    if (!name.trim()) return;

    const permission = reminderEnabled
      ? await requestNotificationPermission()
      : true;

    const habitId = addHabit(name.trim(), color, "daily", category);

    if (reminderEnabled && permission) {
      scheduleDailyReminder(name.trim(), hour, minute)
        .then((notificationId) => {
          updateHabitNotificationId(habitId, notificationId);
        })
        .catch(console.warn);
    }

    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Habit name
        </Text>
        <TextInput
          placeholder="e.g. Drink Water"
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={setName}
          style={[
            styles.input,
            {
              color: colors.text,
              backgroundColor: colors.background,
            },
          ]}
          selectionColor={colors.primary}
        />
      </View>

      {/* Color Picker */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Color
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.colorRow}
        >
          {COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setColor(c)}
              style={[
                styles.colorDot,
                {
                  backgroundColor: c,
                  borderWidth: color === c ? 3 : 0,
                  borderColor: colors.primary,
                },
              ]}
            />
          ))}
        </ScrollView>
      </View>
      {/* Category Picker */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Category
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setCategory(c)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
                backgroundColor:
                  category === c ? colors.primary : colors.border,
                marginRight: 8,
                marginBottom: 8,
              }}
            >
              <Text style={{ color: category === c ? "#fff" : colors.text }}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <TouchableOpacity
          onPress={() => setReminderEnabled((v) => !v)}
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={{ color: colors.text, fontWeight: "500" }}>
            {reminderEnabled ? "🔔 Daily reminder enabled" : "🔕 No reminder"}
          </Text>
          <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
            {reminderEnabled
              ? "You’ll be reminded daily"
              : "Tap to enable reminder"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Save */}
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
        onPress={onSave}
      >
        <Text style={styles.saveText}>Save Habit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  card: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 6,
    borderWidth: 1,
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    marginBottom: 8,
  },

  input: {
    fontSize: 16,
    paddingVertical: 8,
    paddingLeft: 6,
  },

  colorRow: {
    flexDirection: "row",
    marginTop: 8,
    paddingHorizontal: 4,
  },

  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  saveButton: {
    marginTop: "auto",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    elevation: 2,
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
