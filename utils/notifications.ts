// import * as Notifications from "expo-notifications";
// import { Platform } from "react-native";

// const CHANNEL_ID = "habito-reminders";

// export async function ensureNotificationChannel() {
//   if (Platform.OS === "android") {
//     await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
//       name: "Habit Reminders",
//       importance: Notifications.AndroidImportance.DEFAULT,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: "#22C55E",
//     });
//   }
// }

// export async function scheduleDailyReminder(
//   habitId: number,
//   habitName: string,
//   hour: number,
//   minute: number
// ) {
//   await ensureNotificationChannel();

//   const now = new Date();
//   const triggerDate = new Date();
//   triggerDate.setHours(hour, minute, 0, 0);

//   // ⛔ If time already passed today → schedule from tomorrow
//   if (triggerDate <= now) {
//     triggerDate.setDate(triggerDate.getDate() + 1);
//   }

//   return Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Habit reminder",
//       body: `Time to ${habitName}`,
//     },
//     trigger: {
//       hour: triggerDate.getHours(),
//       minute: triggerDate.getMinutes(),
//       repeats: true,
//       channelId: CHANNEL_ID, // 🔥 REQUIRED
//     },
//   });
// }

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const CHANNEL_ID = "habito-reminders";

export async function requestNotificationPermission() {
  const { status } = await Notifications.getPermissionsAsync();

  if (status !== "granted") {
    const result = await Notifications.requestPermissionsAsync();
    return result.status === "granted";
  }

  return true;
}

async function ensureNotificationChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "Habit Reminders",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#22C55E",
    });
  }
}

export async function scheduleDailyReminder(
  habitName: string,
  hour: number,
  minute: number
): Promise<string> {
  await ensureNotificationChannel();

  const now = new Date();
  const triggerDate = new Date();
  triggerDate.setHours(hour, minute, 0, 0);

  if (triggerDate <= now) {
    triggerDate.setDate(triggerDate.getDate() + 1);
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Habit reminder",
      body: `Time to ${habitName}`,
    },
    trigger: {
      hour: triggerDate.getHours(),
      minute: triggerDate.getMinutes(),
      repeats: true,
      channelId: CHANNEL_ID,
    },
  });

  return notificationId;
}
export async function cancelReminder(notificationId?: string | null) {
  if (!notificationId) return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
