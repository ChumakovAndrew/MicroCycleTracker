export type HabitType = 'binary' | 'numeric';

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
  description?: string;
  createdAt: Date;
}

export interface Entry {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  value: boolean | number;
}

export interface Settings {
  id?: 'default';
  cycleLength: 3 | 5 | 7;
  cycleStartDate?: string; // YYYY-MM-DD format - when the first cycle started
  cycleNumber?: number; // Track which cycle we're in
}

export interface DailyStats {
  totalSessions: number;
  completedSessions: number;
  streak: number;
  bestStreak: number;
  completionRate: number;
}
