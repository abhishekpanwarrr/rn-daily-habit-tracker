import { updateHabit } from "@/db/habits";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = ["#22C55E", "#2563EB", "#F97316", "#EF4444", "#A855F7"];

export default function EditHabitScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    name: string;
    color: string;
  }>();

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const card = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");
  const primary = useThemeColor({}, "primary");

  const [name, setName] = useState(params.name);
  const [color, setColor] = useState(params.color);

  const onSave = () => {
    if (!name.trim()) return;

    updateHabit(Number(params.id), name.trim(), color);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <Text style={[styles.title, { color: text }]}>Edit Habit</Text>

      {/* Name */}
      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <Text style={[styles.label, { color: textSecondary }]}>Habit name</Text>
        <TextInput value={name} onChangeText={setName} style={[styles.input, { color: text }]} />
      </View>

      {/* Color */}
      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <Text style={[styles.label, { color: textSecondary }]}>Color</Text>

        <View style={styles.colorRow}>
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
                    borderColor: primary,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>

      {/* Save */}
      <TouchableOpacity style={[styles.saveButton, { backgroundColor: primary }]} onPress={onSave}>
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

  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
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
    paddingVertical: 4,
  },

  colorRow: {
    flexDirection: "row",
    marginTop: 8,
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
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
