import { View, Text, StyleSheet } from "react-native";
import { isHabitDoneToday } from "@/db/habitLogs";
import { useTheme } from "@/hooks/useTheme";

const Progress = ({ habits }: { habits: any }) => {
  const completedCount = habits.filter((h: any) => isHabitDoneToday(h.id)).length;
  const { colors } = useTheme();

  return (
    <View style={[styles.progressCard, { backgroundColor: colors.card }]}>
      <Text style={[styles.progressTitle, { color: colors.text }]}>Today’s Progress</Text>
      <Text style={{ color: colors.textSecondary, marginBottom: 12 }}>
        {completedCount} of {habits.length} habits completed ✅
      </Text>

      <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.primary,
              width: `${habits.length === 0 ? 0 : (completedCount / habits.length) * 100}%`,
            },
          ]}
        />
      </View>
    </View>
  );
};

export default Progress;

const styles = StyleSheet.create({
  progressCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  progressTrack: {
    height: 10,
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
});
