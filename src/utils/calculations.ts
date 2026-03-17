import { Entry } from '@/types';
import { formatISO, startOfDay, subDays, parseISO, differenceInDays, addDays } from 'date-fns';

export function getTodayString(): string {
  return formatISO(startOfDay(new Date()), { representation: 'date' });
}

export function getCycleDates(cycleLength: number, cycleStartDate?: string): string[] {
  const today = startOfDay(new Date());
  
  // If no anchor date provided, fall back to old sliding window behavior
  if (!cycleStartDate) {
    const dates: string[] = [];
    for (let i = cycleLength - 1; i >= 0; i--) {
      const date = subDays(today, i);
      dates.push(formatISO(date, { representation: 'date' }));
    }
    return dates;
  }
  
  // Calculate based on anchor date
  const anchorDate = parseISO(cycleStartDate);
  const daysSinceStart = differenceInDays(today, anchorDate);
  
  // Which cycle are we in? (0-indexed)
  const cycleIndex = Math.floor(daysSinceStart / cycleLength);
  
  // Start date of the current cycle
  const currentCycleStartDate = addDays(anchorDate, cycleIndex * cycleLength);
  
  // Generate all dates in the current cycle
  const dates: string[] = [];
  for (let i = 0; i < cycleLength; i++) {
    const date = addDays(currentCycleStartDate, i);
    dates.push(formatISO(date, { representation: 'date' }));
  }
  
  return dates;
}

export function calculateCycleProgress(
  entries: Entry[],
  cycleDates: string[],
  habitId: string
): number {
  const completedCount = entries.filter(
    (e) => e.habitId === habitId && cycleDates.includes(e.date) && e.value
  ).length;
  
  return Math.round((completedCount / cycleDates.length) * 100);
}

export function calculateCycleNumericSum(
  entries: Entry[],
  cycleDates: string[],
  habitId: string
): number {
  return entries
    .filter(
      (e) =>
        e.habitId === habitId &&
        cycleDates.includes(e.date) &&
        typeof e.value === 'number'
    )
    .reduce((sum, e) => sum + (typeof e.value === 'number' ? e.value : 0), 0);
}

export function calculateCycleNumericAverage(
  entries: Entry[],
  cycleDates: string[],
  habitId: string
): number {
  const sum = calculateCycleNumericSum(entries, cycleDates, habitId);
  if (cycleDates.length === 0) {
    return 0;
  }
  return Number((sum / cycleDates.length).toFixed(2));
}

export function calculateCycleNumericMax(
  entries: Entry[],
  cycleDates: string[],
  habitId: string
): number {
  const values = entries
    .filter(
      (e) =>
        e.habitId === habitId &&
        cycleDates.includes(e.date) &&
        typeof e.value === 'number'
    )
    .map((e) => e.value as number);

  if (values.length === 0) {
    return 0;
  }

  return Math.max(...values);
}

export function calculateCycleNumericMin(
  entries: Entry[],
  cycleDates: string[],
  habitId: string
): number {
  const values = entries
    .filter(
      (e) =>
        e.habitId === habitId &&
        cycleDates.includes(e.date) &&
        typeof e.value === 'number'
    )
    .map((e) => e.value as number);

  if (values.length === 0) {
    return 0;
  }

  return Math.min(...values);
}

export function getCycleInfo(cycleLength: number, cycleStartDate: string) {
  const today = startOfDay(new Date());
  const anchorDate = parseISO(cycleStartDate);
  const daysSinceStart = differenceInDays(today, anchorDate);
  
  // Current cycle number (1-indexed for display)
  const cycleNumber = Math.floor(daysSinceStart / cycleLength) + 1;
  
  // Day within the current cycle (1-indexed for display)
  const dayInCycle = (daysSinceStart % cycleLength) + 1;
  
  // Start date of the current cycle
  const currentCycleStartDate = addDays(anchorDate, Math.floor(daysSinceStart / cycleLength) * cycleLength);
  
  // Days remaining in current cycle (0 means today is the last day)
  const daysRemaining = cycleLength - dayInCycle;
  
  const cycleDates = getCycleDates(cycleLength, cycleStartDate);
  
  return {
    cycleNumber,
    dayInCycle,
    daysRemaining,
    currentCycleStartDate: formatISO(currentCycleStartDate, { representation: 'date' }),
    dates: cycleDates,
  };
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
