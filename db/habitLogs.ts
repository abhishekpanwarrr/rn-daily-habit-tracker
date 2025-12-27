import { getToday } from "@/utils/date";
import { db } from "./database";

export const toggleHabitToday = (habitId: number) => {
  const today = getToday();

  const existing = db.getFirstSync(`SELECT * FROM habit_logs WHERE habitId = ? AND date = ?`, [
    habitId,
    today,
  ]);

  if (existing) {
    // Toggle completed
    db.runSync(`UPDATE habit_logs SET completed = ? WHERE id = ?`, [
      existing?.completed ? 0 : 1,
      existing?.id,
    ]);
  } else {
    // Insert new log
    db.runSync(
      `INSERT INTO habit_logs (habitId, date, completed)
       VALUES (?, ?, 1)`,
      [habitId, today]
    );
  }
};

export const isHabitDoneToday = (habitId: number): boolean => {
  const today = getToday();

  const row = db.getFirstSync(`SELECT completed FROM habit_logs WHERE habitId = ? AND date = ?`, [
    habitId,
    today,
  ]);

  return row?.completed === 1;
};
