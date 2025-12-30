import {
  deleteHabit,
  getHabitById,
  updateHabit,
  updateHabitNotificationId,
} from "@/db/habits";
import { useTheme } from "@/hooks/useTheme";
import { COLORS } from "@/utils/extra";
import { cancelReminder, scheduleDailyReminder } from "@/utils/notifications";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditHabitScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    name: string;
    color: string;
    category: string;
  }>();

  const { colors } = useTheme();
  const habitId = Number(params.id);
  const oldHabit = getHabitById(habitId);
  const habit = getHabitById(Number(params.id));

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [name, setName] = useState(habit?.name ?? "");
  const [color, setColor] = useState(habit?.color ?? COLORS[0]);
  const [category, setCategory] = useState(habit?.category ?? "Health");
  const [reminderEnabled, setReminderEnabled] = useState(
    Boolean(oldHabit?.notificationId)
  );
  const [hour, setHour] = useState(oldHabit?.reminderHour ?? 9);
  const [minute, setMinute] = useState(oldHabit?.reminderMinute ?? 0);

  const onSave = async () => {
    if (!name.trim()) return;

    const habitId = Number(params.id);
    const oldHabit = getHabitById(habitId);

    // 1️⃣ Cancel old reminder
    if (oldHabit?.notificationId) {
      await cancelReminder(oldHabit.notificationId);
    }

    // 2️⃣ Update habit
    updateHabit(habitId, name.trim(), color, category);

    // 3️⃣ Schedule new reminder if enabled
    if (reminderEnabled) {
      const notificationId = await scheduleDailyReminder(
        name.trim(),
        hour,
        minute
      );

      updateHabitNotificationId(habitId, notificationId);
    } else {
      updateHabitNotificationId(habitId, null);
    }

    router.back();
  };

  const onTimeChange = (_: any, selectedDate?: Date) => {
    setShowTimePicker(false);

    if (!selectedDate) return;

    setHour(selectedDate.getHours());
    setMinute(selectedDate.getMinutes());
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={{ flex: 1, paddingBottom: 10 }}
        showsVerticalScrollIndicator={false}
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
            value={name}
            onChangeText={setName}
            style={[
              styles.input,
              {
                color: colors.text,
                backgroundColor: colors.background,
              },
            ]}
          />
        </View>

        {/* Color */}
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
            {COLORS.map((c) => {
              return (
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
              );
            })}
          </ScrollView>
        </View>
        {/* Category */}
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
            {[
              "Health",
              "Fitness",
              "Study",
              "Mindfulness",
              "Work",
              "Personal",
            ].map((c) => (
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
          <TouchableOpacity onPress={() => setReminderEnabled((v) => !v)}>
            <Text style={{ color: colors.text }}>
              {reminderEnabled ? "🔔 Daily reminder enabled" : "🔕 No reminder"}
            </Text>
            <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
              {reminderEnabled
                ? "You’ll be reminded every day"
                : "Tap to enable reminder"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reminder Time Picker */}
        {reminderEnabled && (
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Reminder time
            </Text>

            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderRadius: 12,
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text style={{ color: colors.text, fontSize: 16 }}>
                ⏰ {hour.toString().padStart(2, "0")}:
                {minute.toString().padStart(2, "0")}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={new Date(0, 0, 0, hour, minute)}
                mode="time"
                is24Hour={true}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onTimeChange}
              />
            )}
          </View>
        )}

        {/* Save */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={onSave}
        >
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
        <Text
          style={{
            marginTop: 24,
            marginBottom: 8,
            color: colors.textSecondary,
            fontSize: 12,
          }}
        >
          Danger zone
        </Text>

        <TouchableOpacity
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 16,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#EF4444",
          }}
          onPress={async () => {
            Alert.alert(
              "Delete habit?",
              "This will remove the habit and all its history.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: async () => {
                    const habit = getHabitById(Number(params.id));

                    if (habit?.notificationId) {
                      await cancelReminder(habit.notificationId);
                    }

                    deleteHabit(Number(params.id));
                    router.back();
                  },
                },
              ]
            );
          }}
        >
          <Text style={{ color: "#EF4444", fontWeight: "600" }}>
            Delete Habit
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
