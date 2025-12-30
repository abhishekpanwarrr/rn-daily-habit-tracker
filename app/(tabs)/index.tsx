// import { isHabitDoneToday, toggleHabitToday } from "@/db/habitLogs";
// import { getHabits } from "@/db/habits";
// import { useTheme } from "@/hooks/useTheme";
// import { getCurrentStreak } from "@/utils/streak";
// import { Ionicons } from "@expo/vector-icons";
// import * as Haptics from "expo-haptics";
// import { useFocusEffect, useRouter } from "expo-router";
// import { useCallback, useEffect, useState } from "react";
// import {
//   Alert,
//   FlatList,
//   Pressable,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function TodayScreen() {
//   const { colors, toggleTheme, theme } = useTheme();
//   const [habits, setHabits] = useState<any[]>([]);
//   const [refresh, setRefresh] = useState(0);

//   const router = useRouter();

//   const completedCount = habits.filter((h) => isHabitDoneToday(h.id)).length;

//   useFocusEffect(
//     useCallback(() => {
//       const data = getHabits();
//       setHabits(data);
//     }, [])
//   );
//   useEffect(() => {
//     const data = getHabits();
//     setHabits(data);
//   }, [refresh]);

//   // const onLongPressHabit = (habitId: number) => {
//   //   Alert.alert(
//   //     "Habit options",
//   //     "What would you like to do?",
//   //     [
//   //       {
//   //         text: "Delete",
//   //         style: "destructive",
//   //         onPress: () => {
//   //           deleteHabit(habitId);
//   //           setRefresh((v) => v + 1);
//   //         },
//   //       },
//   //       {
//   //         text: "Cancel",
//   //         style: "cancel",
//   //       },
//   //     ]
//   //     // { cancelable: true }
//   //   );
//   // };
//   const [settingsOpen, setSettingsOpen] = useState(false);

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         backgroundColor: colors.background,
//         paddingHorizontal: 16,
//       }}
//     >
//       {settingsOpen && (
//         <Pressable
//           style={StyleSheet.absoluteFill}
//           onPress={() => setSettingsOpen(false)}
//         />
//       )}
//       <View style={[styles.headerRow, { backgroundColor: colors.background }]}>
//         <View style={styles.headerRow}>
//           <View>
//             <Text style={[styles.greeting, { color: colors.text }]}>
//               Hello 👋
//             </Text>
//             <Text style={[styles.subGreeting, { color: colors.textSecondary }]}>
//               Let’s build habits today
//             </Text>
//           </View>
//         </View>

//         {/* Theme Toggle */}
//         <TouchableWithoutFeedback onPress={() => setSettingsOpen(false)}>
//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               gap: 3,
//             }}
//           >
//             <View style={{ position: "relative" }}>
//               {/* Settings trigger */}
//               <TouchableOpacity
//                 onPress={() => setSettingsOpen((v) => !v)}
//                 style={[
//                   styles.themeButton,
//                   { backgroundColor: colors.background },
//                 ]}
//               >
//                 <Ionicons
//                   name={theme === "dark" ? "settings" : "settings-outline"}
//                   size={22}
//                   color={colors.text}
//                 />
//               </TouchableOpacity>

//               {/* Dropdown menu */}
//               {settingsOpen && (
//                 <TouchableWithoutFeedback>
//                   <View
//                     style={[
//                       styles.settingsMenu,
//                       {
//                         backgroundColor: colors.card,
//                         borderColor: colors.border,
//                       },
//                     ]}
//                   >
//                     {/* Theme toggle */}
//                     <TouchableOpacity
//                       style={styles.menuItem}
//                       onPress={() => {
//                         toggleTheme();
//                         setSettingsOpen(false);
//                       }}
//                     >
//                       <Ionicons
//                         name={
//                           theme === "dark" ? "sunny-outline" : "moon-outline"
//                         }
//                         size={18}
//                         color={colors.text}
//                       />
//                       <Text style={[styles.menuText, { color: colors.text }]}>
//                         {theme === "dark" ? "Light Theme" : "Dark Theme"}
//                       </Text>
//                     </TouchableOpacity>

//                     {/* Logout */}
//                     <TouchableOpacity
//                       style={styles.menuItem}
//                       onPress={() => {
//                         setSettingsOpen(false);
//                         Alert.alert(
//                           "Logout",
//                           "Are you sure you want to logout?"
//                         );
//                       }}
//                     >
//                       <Ionicons name="log-out-outline" size={18} color="red" />
//                       <Text style={[styles.menuText, { color: "red" }]}>
//                         Logout
//                       </Text>
//                     </TouchableOpacity>
//                   </View>
//                 </TouchableWithoutFeedback>
//               )}
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </View>

//       <View style={[styles.progressCard, { backgroundColor: colors.card }]}>
//         <Text style={[styles.progressTitle, { color: colors.text }]}>
//           Today’s Progress
//         </Text>

//         <Text style={{ color: colors.textSecondary, marginBottom: 12 }}>
//           {completedCount} of {habits.length} habits completed
//         </Text>

//         <View
//           style={[styles.progressTrack, { backgroundColor: colors.border }]}
//         >
//           <View
//             style={[
//               styles.progressFill,
//               {
//                 backgroundColor: colors.primary,
//                 width: `${
//                   habits.length === 0
//                     ? 0
//                     : (completedCount / habits.length) * 100
//                 }%`,
//               },
//             ]}
//           />
//         </View>
//       </View>

//       {habits.length > 0 && completedCount === 0 && (
//         <View
//           style={{
//             padding: 14,
//             marginBottom: 14,
//             borderRadius: 16,
//             backgroundColor: colors.card,
//             borderWidth: 1,
//             borderColor: colors.border,
//           }}
//         >
//           <Text style={{ color: colors.text }}>
//             You haven’t completed any habits today yet 🌱
//           </Text>
//         </View>
//       )}

//       {/* HABIT LIST */}
//       <FlatList
//         style={{ backgroundColor: colors.background }}
//         contentContainerStyle={{
//           paddingBottom: 100,
//           backgroundColor: colors.background,
//         }}
//         data={habits}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => {
//           const done = isHabitDoneToday(item.id);
//           const streak = getCurrentStreak(item.id);

//           return (
//             <TouchableOpacity
//               onPress={() => {
//                 Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//                 toggleHabitToday(item.id);
//                 setRefresh((v) => v + 1);
//               }}
//               style={[
//                 styles.habitCard,
//                 {
//                   backgroundColor: colors.card,
//                   borderColor: colors.border,
//                 },
//               ]}
//             >
//               {/* Icon */}
//               <View
//                 style={[styles.iconCircle, { backgroundColor: item.color }]}
//               >
//                 <Ionicons
//                   name={done ? "checkmark" : "ellipse-outline"}
//                   size={16}
//                   color="#fff"
//                 />
//               </View>

//               {/* Text */}
//               <View style={{ flex: 1 }}>
//                 <Text style={[styles.habitName, { color: colors.text }]}>
//                   {item.name}
//                 </Text>
//                 <Text
//                   style={[styles.habitSub, { color: colors.textSecondary }]}
//                 >
//                   {streak > 0
//                     ? `🔥 ${streak} day streak`
//                     : "Start your streak today"}
//                 </Text>
//               </View>

//               {/* Done indicator */}
//               {done && (
//                 <Ionicons
//                   name="checkmark-circle"
//                   size={22}
//                   color={colors.primary}
//                 />
//               )}
//             </TouchableOpacity>
//           );
//         }}
//         ListEmptyComponent={
//           <View
//             style={[styles.emptyState, { backgroundColor: colors.background }]}
//           >
//             <Text style={[styles.emptyTitle, { color: colors.text }]}>
//               No habits yet
//             </Text>
//             <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
//               Start with one small habit today
//             </Text>
//           </View>
//         }
//       />
//       {/* FAB (Add Habit – wired later) */}
//       <TouchableOpacity
//         style={[styles.fab, { backgroundColor: colors.primary }]}
//         onPress={() => router.push("/habit/add")}
//       >
//         <Text style={styles.fabText}>＋</Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   settingsMenu: {
//     position: "absolute",
//     top: 42,
//     right: 0,
//     minWidth: 160,
//     borderRadius: 12,
//     borderWidth: 1,
//     paddingVertical: 6,
//     elevation: 6,
//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowRadius: 6,
//   },

//   menuItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//   },

//   menuText: {
//     fontSize: 14,
//     fontWeight: "500",
//   },

//   habitCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//     borderRadius: 18,
//     borderWidth: 1,
//     marginBottom: 14,
//   },
//   iconCircle: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 14,
//   },
//   habitName: {
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   habitSub: {
//     fontSize: 13,
//     marginTop: 2,
//   },

//   greeting: {
//     fontSize: 26,
//     fontWeight: "700",
//   },
//   subGreeting: {
//     fontSize: 14,
//     marginTop: 4,
//   },
//   progressCard: {
//     borderRadius: 20,
//     padding: 18,
//     marginBottom: 20,
//   },
//   progressTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 6,
//   },
//   progressTrack: {
//     height: 10,
//     borderRadius: 6,
//     overflow: "hidden",
//   },
//   progressFill: {
//     height: "100%",
//     borderRadius: 6,
//   },

//   container: {
//     flex: 1,
//     paddingHorizontal: 16,
//   },
//   themeButton: {
//     padding: 8,
//     borderRadius: 20,
//     elevation: 1,
//   },
//   header: {
//     marginTop: 16,
//     marginBottom: 16,
//   },
//   headerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginTop: 16,
//     marginBottom: 16,
//   },

//   title: {
//     fontSize: 24,
//     fontWeight: "600",
//   },

//   subtitle: {
//     fontSize: 14,
//     marginTop: 4,
//   },
//   checkbox: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     borderWidth: 2,
//     marginRight: 12,
//   },
//   emptyState: {
//     marginTop: 80,
//     alignItems: "center",
//   },

//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: "500",
//     marginBottom: 4,
//   },

//   emptySub: {
//     fontSize: 14,
//   },

//   fab: {
//     position: "absolute",
//     right: 24,
//     bottom: 24,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 4,
//   },

//   fabText: {
//     color: "#FFFFFF",
//     fontSize: 28,
//     lineHeight: 28,
//   },
// });

import { isHabitDoneToday, toggleHabitToday } from "@/db/habitLogs";
import { getHabits } from "@/db/habits";
import { useTheme } from "@/hooks/useTheme";
import { getCurrentStreak } from "@/utils/streak";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TodayScreen() {
  const { colors, toggleTheme, theme } = useTheme();
  const [habits, setHabits] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const router = useRouter();

  const completedCount = habits.filter((h) => isHabitDoneToday(h.id)).length;

  useFocusEffect(
    useCallback(() => {
      setHabits(getHabits());
    }, [])
  );

  useEffect(() => {
    setHabits(getHabits());
  }, [refresh]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 16,
      }}
    >
      {/* 🔒 FULL-SCREEN BACKDROP (outside tap closer) */}
      {settingsOpen && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setSettingsOpen(false)}
        />
      )}

      {/* HEADER */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.greeting, { color: colors.text }]}>
            Hello 👋
          </Text>
          <Text style={[styles.subGreeting, { color: colors.textSecondary }]}>
            Let’s build habits today
          </Text>
        </View>

        {/* SETTINGS */}
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            onPress={() => setSettingsOpen((v) => !v)}
            style={styles.themeButton}
          >
            <Ionicons
              name={theme === "dark" ? "settings" : "settings-outline"}
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>

          {settingsOpen && (
            <View
              style={[
                styles.settingsMenu,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  zIndex: 100,
                },
              ]}
            >
              {/* Theme toggle */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  toggleTheme();
                  setSettingsOpen(false);
                }}
              >
                <Ionicons
                  name={theme === "dark" ? "sunny-outline" : "moon-outline"}
                  size={18}
                  color={colors.text}
                />
                <Text style={[styles.menuText, { color: colors.text }]}>
                  {theme === "dark" ? "Light Theme" : "Dark Theme"}
                </Text>
              </TouchableOpacity>

              {/* Logout */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setSettingsOpen(false);
                  Alert.alert("Logout", "Are you sure you want to logout?");
                }}
              >
                <Ionicons name="log-out-outline" size={18} color="red" />
                <Text style={[styles.menuText, { color: "red" }]}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* PROGRESS */}
      <View style={[styles.progressCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.progressTitle, { color: colors.text }]}>
          Today’s Progress
        </Text>
        <Text style={{ color: colors.textSecondary, marginBottom: 12 }}>
          {completedCount} of {habits.length} habits completed
        </Text>

        <View
          style={[styles.progressTrack, { backgroundColor: colors.border }]}
        >
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.primary,
                width: `${
                  habits.length === 0
                    ? 0
                    : (completedCount / habits.length) * 100
                }%`,
              },
            ]}
          />
        </View>
      </View>

      {/* HABIT LIST */}
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => {
          const done = isHabitDoneToday(item.id);
          const streak = getCurrentStreak(item.id);

          return (
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleHabitToday(item.id);
                setRefresh((v) => v + 1);
              }}
              style={[
                styles.habitCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[styles.iconCircle, { backgroundColor: item.color }]}
              >
                <Ionicons
                  name={done ? "checkmark" : "ellipse-outline"}
                  size={16}
                  color="#fff"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.habitName, { color: colors.text }]}>
                  {item.name}
                </Text>
                <Text
                  style={[styles.habitSub, { color: colors.textSecondary }]}
                >
                  {streak > 0
                    ? `🔥 ${streak} day streak`
                    : "Start your streak today"}
                </Text>
              </View>

              {done && (
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={colors.primary}
                />
              )}
            </TouchableOpacity>
          );
        }}
      />

      {/* FAB */}
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },

  greeting: {
    fontSize: 26,
    fontWeight: "700",
  },
  subGreeting: {
    fontSize: 14,
    marginTop: 4,
  },

  themeButton: {
    padding: 8,
    borderRadius: 20,
  },

  settingsMenu: {
    position: "absolute",
    top: 42,
    right: 0,
    minWidth: 160,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 6,
    elevation: 6,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  menuText: {
    fontSize: 14,
    fontWeight: "500",
  },

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

  habitCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 14,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  habitName: {
    fontSize: 16,
    fontWeight: "600",
  },
  habitSub: {
    fontSize: 13,
    marginTop: 2,
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
    color: "#fff",
    fontSize: 28,
  },
});
