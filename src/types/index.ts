export type HabitType = 'binary' | 'numeric';

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
  createdAt: Date;
}

export interface Entry {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  value: boolean | number;
}

export interface Settings {
  cycleLength: 3 | 5 | 7;
}

export interface DailyStats {
  totalSessions: number;
  completedSessions: number;
  streak: number;
  bestStreak: number;
  completionRate: number;
}
