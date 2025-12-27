import * as SQLite from "expo-sqlite";
export const db = SQLite.openDatabaseSync("habits.db");

export const initializeDatabase = () => {
  // Base tables
  db.execSync(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      frequency TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS habit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habitId INTEGER NOT NULL,
      date TEXT NOT NULL,
      completed INTEGER NOT NULL,
      UNIQUE(habitId, date)
    );
  `);

  // ---- SAFE COLUMN MIGRATION ----
  const columns = db.getAllSync(`PRAGMA table_info(habits);`);
  const columnNames = columns.map((c: any) => c.name);

  if (!columnNames.includes("reminderHour")) {
    db.execSync(`ALTER TABLE habits ADD COLUMN reminderHour INTEGER;`);
  }

  if (!columnNames.includes("reminderMinute")) {
    db.execSync(`ALTER TABLE habits ADD COLUMN reminderMinute INTEGER;`);
  }

  if (!columnNames.includes("notificationId")) {
    db.execSync(`ALTER TABLE habits ADD COLUMN notificationId TEXT;`);
  }
};
