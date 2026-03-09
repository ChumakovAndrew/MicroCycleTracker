import { Entry } from '@/types';
import { formatISO, startOfDay, subDays, parseISO } from 'date-fns';

export function getTodayString(): string {
  return formatISO(startOfDay(new Date()), { representation: 'date' });
}

export function getCycleDates(cycleLength: number): string[] {
  const today = startOfDay(new Date());
  const dates: string[] = [];
  
  for (let i = cycleLength - 1; i >= 0; i--) {
    const date = subDays(today, i);
    dates.push(formatISO(date, { representation: 'date' }));
  }
  
  return dates;
}

export function getMonthDates(date: Date = new Date()): string[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const dates: string[] = [];
  const currentDate = new Date(firstDay);
  
  while (currentDate <= lastDay) {
    dates.push(formatISO(currentDate, { representation: 'date' }));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

export function calculateCycleProgress(
  entries: Entry[],
  cycleLength: number,
  habitId: string
): number {
  const cycleDates = getCycleDates(cycleLength);
  const completedCount = entries.filter(
    (e) => e.habitId === habitId && cycleDates.includes(e.date) && e.value
  ).length;
  
  return Math.round((completedCount / cycleLength) * 100);
}

export function calculateStats(entries: Entry[], habitId: string) {
  const habitEntries = entries.filter((e) => e.habitId === habitId);
  
  let streak = 0;
  let bestStreak = 0;
  let currentStreak = 0;
  
  const monthDates = getMonthDates();
  
  for (let i = monthDates.length - 1; i >= 0; i--) {
    const entry = habitEntries.find((e) => e.date === monthDates[i]);
    if (entry && entry.value) {
      currentStreak++;
    } else {
      if (currentStreak > 0) {
        streak = currentStreak;
      }
      currentStreak = 0;
    }
  }
  
  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
  }
  if (streak > bestStreak) {
    bestStreak = streak;
  }
  
  const completedCount = habitEntries.filter((e) => e.value).length;
  const completionRate = habitEntries.length > 0 
    ? Math.round((completedCount / habitEntries.length) * 100)
    : 0;
  
  return {
    totalSessions: habitEntries.length,
    completedSessions: completedCount,
    streak,
    bestStreak,
    completionRate,
  };
}

export function getHeatmapData(entries: Entry[], habitId: string) {
  const monthEntries = entries.filter((e) => e.habitId === habitId);
  const data: Record<string, number> = {};
  
  monthEntries.forEach((entry) => {
    if (entry.value) {
      data[entry.date] = 1;
    }
  });
  
  return data;
}
