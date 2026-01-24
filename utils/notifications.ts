import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();

  if (status === "granted") return true;

  const { status: newStatus } = await Notifications.requestPermissionsAsync();

  if (newStatus !== "granted") {
    console.log("❌ Notification permission denied");
    return false;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  return true;
}

export async function scheduleTomorrowNotification(
  hour: number,
  minute: number,
  title: string,
  body: string,
) {
  const permission = await requestNotificationPermission();
  if (!permission) {
    throw new Error("Notification permission not granted");
  }

  const triggerDate = new Date();
  triggerDate.setHours(hour, minute, 0, 0);

  if (triggerDate <= new Date()) {
    triggerDate.setDate(triggerDate.getDate() + 1);
  }

  console.log("⏰ Notification scheduled for:", triggerDate);

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default",
    },
    trigger: triggerDate, // ✅ DATE BASED (RELIABLE)
  });
}

export async function cancelReminder(notificationId?: string | null) {
  if (!notificationId) return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
