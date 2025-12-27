import * as Notifications from "expo-notifications";

export async function requestNotificationPermission() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const result = await Notifications.requestPermissionsAsync();
    return result.status === "granted";
  }
  return true;
}

export async function scheduleDailyReminder(
  habitId: number,
  habitName: string,
  hour: number,
  minute: number
) {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Habit reminder",
      body: `Time to ${habitName}`,
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });
}
