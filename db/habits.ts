import { db } from "./database";

export type Habit = {
  id: number;
  name: string;
  color: string;
  category: string;
  frequency: "daily" | "weekly";
  createdAt: string;
};

/**
 * Get all habits
 */
export const getHabits = (): Habit[] => {
  const result = db.getAllSync(`SELECT * FROM habits ORDER BY createdAt DESC`);
  return result as Habit[];
};

/**
 * Add a new habit
 */
// export const addHabit = (name: string, color: string, frequency: "daily" | "weekly") => {
//   const createdAt = new Date().toISOString();

//   db.runSync(
//     `INSERT INTO habits (name, color, frequency, createdAt)
//      VALUES (?, ?, ?, ?)`,
//     [name, color, frequency, createdAt]
//   );
// };

export const addHabit = (
  name: string,
  color: string,
  frequency: string,
  category: string
): number => {
  const result = db.runSync(
    `INSERT INTO habits (name, color, frequency, category, createdAt)
     VALUES (?, ?, ?, ?, ?)`,
    [name, color, frequency, category, new Date().toISOString()]
  );
  console.log("🚀 ~ addHabit ~ result:", result.changes);

  return result.lastInsertRowId as number;
};

/**
 * Delete habit (optional for now)
 */
// export const deleteHabit = (id: number) => {
//   db.runSync(`DELETE FROM habits WHERE id = ?`, [id]);
// };

export const deleteHabit = (id: number) => {
  db.runSync(`DELETE FROM habit_logs WHERE habitId = ?`, [id]);
  db.runSync(`DELETE FROM habits WHERE id = ?`, [id]);
};

export const updateHabit = (
  id: number,
  name: string,
  color: string,
  category: string
) => {
  db.runSync(
    `UPDATE habits SET name = ?, color = ?, category = ? WHERE id = ?`,
    [name, color, category, id]
  );
};

export const updateHabitNotificationId = (
  habitId: number,
  notificationId: string | null
) => {
  db.runSync(`UPDATE habits SET notificationId = ? WHERE id = ?`, [
    notificationId,
    habitId,
  ]);
};

export const getHabitById = (habitId: number) => {
  const result = db.getFirstSync(`SELECT * FROM habits WHERE id = ?`, [
    habitId,
  ]);

  return result as any | null;
};

export const clearHabitNotificationId = (habitId: number) => {
  db.runSync(`UPDATE habits SET notificationId = NULL WHERE id = ?`, [habitId]);
};
