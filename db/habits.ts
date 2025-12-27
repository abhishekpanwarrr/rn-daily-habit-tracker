import { db } from "./database";

export type Habit = {
  id: number;
  name: string;
  color: string;
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
export const addHabit = (name: string, color: string, frequency: "daily" | "weekly") => {
  const createdAt = new Date().toISOString();

  db.runSync(
    `INSERT INTO habits (name, color, frequency, createdAt)
     VALUES (?, ?, ?, ?)`,
    [name, color, frequency, createdAt]
  );
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

export const updateHabit = (id: number, name: string, color: string) => {
  db.runSync(`UPDATE habits SET name = ?, color = ? WHERE id = ?`, [name, color, id]);
};
