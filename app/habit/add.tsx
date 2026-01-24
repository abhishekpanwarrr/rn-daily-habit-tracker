import { addHabit, updateHabitNotificationId } from "@/db/habits";
import { useTheme } from "@/hooks/useTheme";
import { COLORS } from "@/utils/extra";
import { requestNotificationPermission } from "@/utils/notifications";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as Notifications from "expo-notifications";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CategorySelector from "@/components/category/CategorySelector";

export default function AddHabitScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [category, setCategory] = useState("Health");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const onSave = async () => {
    if (!name.trim()) {
      Alert.alert("Habit name is empty!");
      return;
    }

    const permission = reminderEnabled ? await requestNotificationPermission() : true;

    const habitId = addHabit(name.trim(), color, "daily", category);

    if (reminderEnabled && permission) {
      try {
        const trigger: Notifications.NotificationTriggerInput = {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: time.getHours(),
          minute: time.getMinutes(),
        };

        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: "⏰ Task Reminder",
            body: name,
            sound: "default",
          },
          trigger,
        });

        updateHabitNotificationId(habitId, notificationId);
      } catch (e) {
        console.warn("Notification scheduling failed:", e);
      }
    }

    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <NameInput value={name} onChange={setName} />
        <ColorPicker selected={color} onSelect={setColor} />
        <CategorySelector value={category} onChange={setCategory} />

        <ReminderToggle
          enabled={reminderEnabled}
          onToggle={() => {
            setReminderEnabled((v) => !v);
            setShowPicker(true);
          }}
        />
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
            {showPicker && showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour={false}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(_, selected) => {
                  if (selected) setTime(selected);
                  setShowTimePicker(false);
                }}
              />
            )}
          </View>
        )}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={onSave}
        >
          <Text style={styles.saveText}>Save Habit</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* -------------------- Name Input -------------------- */
const NameInput = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Habit name</Text>
      <TextInput
        placeholder="e.g. Drink Water"
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChange}
        style={[styles.input, { color: colors.text, backgroundColor: colors.background }]}
        selectionColor={colors.primary}
      />
    </View>
  );
};

/* -------------------- Color Picker -------------------- */
const ColorPicker = ({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (c: string) => void;
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Color</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.colorRow}
      >
        {COLORS.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => onSelect(c)}
            style={[
              styles.colorDot,
              {
                backgroundColor: c,
                borderWidth: selected === c ? 3 : 0,
                borderColor: colors.primary,
              },
            ]}
          />
        ))}
      </ScrollView>
    </View>
  );
};

/* -------------------- Reminder Card -------------------- */
const ReminderToggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <TouchableOpacity onPress={onToggle}>
        <Text style={{ color: colors.text, fontWeight: "500" }}>
          {enabled ? "🔔 Daily reminder enabled" : "🔕 No reminder"}
        </Text>
        <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
          {enabled ? "You’ll be reminded daily" : "Tap to enable reminder"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  timeButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  card: {
    marginTop: 4,
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

  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },

  saveButton: {
    marginTop: "auto",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    elevation: 2,
    margin: 16,
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
