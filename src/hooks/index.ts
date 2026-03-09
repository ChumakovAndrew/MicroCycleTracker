import { useHabitStore } from '@/store';
import { calculateCycleProgress, calculateStats, getCycleDates } from '@/utils/calculations';
import { useMemo } from 'react';

export function useCycleProgress(habitId: string) {
  const { entries, settings } = useHabitStore();
  
  return useMemo(() => {
    return calculateCycleProgress(entries, settings.cycleLength, habitId);
  }, [entries, habitId, settings.cycleLength]);
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
    return getCycleDates(settings.cycleLength);
  }, [settings.cycleLength]);
}

export function useHabitEntries(habitId: string) {
  const { entries } = useHabitStore();
  
  return useMemo(() => {
    return entries.filter((e) => e.habitId === habitId);
  }, [entries, habitId]);
}
