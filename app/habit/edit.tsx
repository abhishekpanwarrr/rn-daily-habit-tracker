import { getHabitById, updateHabit, updateHabitNotificationId } from "@/db/habits";
import { useTheme } from "@/hooks/useTheme";
import { COLORS } from "@/utils/extra";
import { cancelReminder, scheduleDailyReminder } from "@/utils/notifications";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditHabitScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    name: string;
    color: string;
  }>();

  const hour = 9;
  const minute = 0;
  const { colors } = useTheme();

  const [name, setName] = useState(params.name);
  const [color, setColor] = useState(params.color);

  const onSave = async () => {
    if (!name.trim()) return;

    const oldHabit = getHabitById(Number(params.id));

    // ❌ cancel old reminder
    if (oldHabit?.notificationId) {
      await cancelReminder(oldHabit.notificationId);
    }

    // ✅ update habit name/color
    updateHabit(Number(params.id), name.trim(), color);

    // ✅ schedule new reminder (if enabled)
    const newNotificationId = await scheduleDailyReminder(name.trim(), hour, minute);

    // ✅ store new notification id
    updateHabitNotificationId(Number(params.id), newNotificationId);

    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Habit name</Text>
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
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Color</Text>

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

      {/* Save */}
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
        onPress={onSave}
      >
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
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
