import { useHabitStore } from '@/store';
import { calculateCycleProgress, calculateCycleNumericSum, calculateCycleNumericAverage, calculateStats, getCycleDates, getCycleInfo } from '@/utils/calculations';
import { useMemo } from 'react';

export function useCycleProgress(habitId: string) {
  const { entries, settings } = useHabitStore();
  const cycleDates = useCycleDates();
  
  return useMemo(() => {
    return calculateCycleProgress(entries, cycleDates, habitId);
  }, [entries, cycleDates, habitId]);
}

export function useCycleNumericSum(habitId: string) {
  const { entries } = useHabitStore();
  const cycleDates = useCycleDates();

  return useMemo(() => {
    return calculateCycleNumericSum(entries, cycleDates, habitId);
  }, [entries, cycleDates, habitId]);
}

export function useCycleNumericAverage(habitId: string) {
  const { entries } = useHabitStore();
  const cycleDates = useCycleDates();

  return useMemo(() => {
    return calculateCycleNumericAverage(entries, cycleDates, habitId);
  }, [entries, cycleDates, habitId]);
}

export function useHabitStats(habitId: string) {
  const { entries } = useHabitStore();
  
  return useMemo(() => {
    return calculateStats(entries, habitId);
  }, [entries, habitId]);
}

export function useCycleDates() {
  const { settings } = useHabitStore();
  
  return useMemo(() => {
    return getCycleDates(settings.cycleLength, settings.cycleStartDate);
  }, [settings.cycleLength, settings.cycleStartDate]);
}

export function useHabitEntries(habitId: string) {
  const { entries } = useHabitStore();
  
  return useMemo(() => {
    return entries.filter((e) => e.habitId === habitId);
  }, [entries, habitId]);
}

export function useCycleInfo() {
  const { settings } = useHabitStore();
  
  return useMemo(() => {
    if (!settings.cycleStartDate) {
      return null;
    }
    return getCycleInfo(settings.cycleLength, settings.cycleStartDate);
  }, [settings.cycleLength, settings.cycleStartDate]);
}
