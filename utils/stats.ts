import { db } from "@/db/database";

export function getWeeklyCompletion(habitId: number) {
  const today = new Date();
  const days: boolean[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];

    const result = db.getAllSync(
      `SELECT completed FROM habit_logs WHERE habitId = ? AND date = ?`,
      [habitId, dateStr]
    );

    days.push(result.length > 0 && result[0].completed === 1);
  }

  return days;
}

export function getWeeklyPercent(days: boolean[]) {
  const completed = days.filter(Boolean).length;
  return Math.round((completed / 7) * 100);
}
