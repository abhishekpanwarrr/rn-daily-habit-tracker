import { db } from "@/db/database";
import { getToday } from "./date";

export const getCurrentStreak = (habitId: number): number => {
  let streak = 0;
  let date = getToday();

  while (true) {
    const row = db.getFirstSync(
      `SELECT completed FROM habit_logs
       WHERE habitId = ? AND date = ?`,
      [habitId, date]
    );

    if (row?.completed === 1) {
      streak++;
      const d = new Date(date);
      d.setDate(d.getDate() - 1);
      date = d.toISOString().split("T")[0];
    } else {
      break;
    }
  }

  return streak;
};
