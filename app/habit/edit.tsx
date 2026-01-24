import { deleteHabit, getHabitById, updateHabit, updateHabitNotificationId } from "@/db/habits";
import { useTheme } from "@/hooks/useTheme";
import { COLORS } from "@/utils/extra";
import { cancelReminder } from "@/utils/notifications";
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
import * as Notifications from "expo-notifications";
import CategorySelector from "@/components/category/CategorySelector";

/* -------------------- Screen -------------------- */
export default function EditHabitScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const { id } = useLocalSearchParams<{ id: string }>();
  const habitId = Number(id);
  const habit = getHabitById(habitId);

  if (!habit) return null;

  const [name, setName] = useState(habit.name);
  const [color, setColor] = useState(habit.color);
  const [category, setCategory] = useState(habit.category ?? "Health");
  const [reminderEnabled, setReminderEnabled] = useState(Boolean(habit.notificationId));
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onSave = async () => {
    if (!name.trim()) return;

    // 1️⃣ Cancel existing reminder
    if (habit.notificationId) {
      await cancelReminder(habit.notificationId);
    }

    // 2️⃣ Update habit fields
    updateHabit(habitId, name.trim(), color, category);

    // 3️⃣ Schedule reminder if enabled
    if (reminderEnabled) {
      const trigger: Notifications.NotificationTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: time.getHours(),
        minute: time.getMinutes(),
      };

      const newNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "⏰ Task Reminder",
          body: name,
          sound: "default",
        },
        trigger,
      });

      updateHabitNotificationId(habitId, newNotificationId);
    } else {
      updateHabitNotificationId(habitId, null);
    }

    router.back();
  };

  const onDelete = async () => {
    Alert.alert("Delete habit?", "This will remove the habit and all its history.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (habit.notificationId) {
            await cancelReminder(habit.notificationId);
          }
          deleteHabit(habitId);
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Name */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Habit name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={[styles.input, { color: colors.text, backgroundColor: colors.background }]}
          />
        </View>

        {/* Color */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Color</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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

        {/* Category (REUSED COMPONENT ✅) */}
        <CategorySelector value={category} onChange={setCategory} />

        {/* Reminder toggle */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity onPress={() => setReminderEnabled((v) => !v)}>
            <Text style={{ color: colors.text }}>
              {reminderEnabled ? "🔔 Daily reminder enabled" : "🔕 No reminder"}
            </Text>
            <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
              {reminderEnabled ? "You’ll be reminded every day" : "Tap to enable reminder"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reminder time */}
        {reminderEnabled && (
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.label, { color: colors.textSecondary }]}>Reminder time</Text>

            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={[
                styles.timeButton,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={{ color: colors.text }}>
                ⏰ {time.getHours().toString().padStart(2, "0")}:
                {time.getMinutes().toString().padStart(2, "0")}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour={false}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selected) => {
                  if (selected) setTime(selected);
                  setShowTimePicker(false);
                }}
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

        {/* Danger zone */}
        <Text style={styles.dangerLabel}>Danger zone</Text>

        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteText}>Delete Habit</Text>
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

  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },

  timeButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },

  saveButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    elevation: 2,
    marginTop: 8,
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  dangerLabel: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 12,
    color: "#999",
  },

  deleteButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EF4444",
    marginBottom: 24,
  },

  deleteText: {
    color: "#EF4444",
    fontWeight: "600",
  },
});
