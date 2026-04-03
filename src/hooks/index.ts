import { useHabitStore } from '@/store';
import {
  calculateCycleProgress,
  calculateCycleNumericSum,
  calculateCycleNumericAverage,
  calculateCycleNumericMax,
  calculateCycleNumericMin,
  calculateStats,
  getCycleDatesForOffset,
  getCycleInfoForOffset,
} from '@/utils/calculations';
import { useMemo } from 'react';

export function useCycleProgress(habitId: string) {
  const { entries } = useHabitStore();
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

export function useCycleNumericMax(habitId: string) {
  const { entries } = useHabitStore();
  const cycleDates = useCycleDates();

  return useMemo(() => {
    return calculateCycleNumericMax(entries, cycleDates, habitId);
  }, [entries, cycleDates, habitId]);
}

export function useCycleNumericMin(habitId: string) {
  const { entries } = useHabitStore();
  const cycleDates = useCycleDates();

  return useMemo(() => {
    return calculateCycleNumericMin(entries, cycleDates, habitId);
  }, [entries, cycleDates, habitId]);
}

export function useHabitStats(habitId: string) {
  const { entries } = useHabitStore();
  
  return useMemo(() => {
    return calculateStats(entries, habitId);
  }, [entries, habitId]);
}

export function useCycleDates() {
  const { settings, viewCycleOffset } = useHabitStore();
  
  return useMemo(() => {
    if (!settings.cycleStartDate) return [];
    return getCycleDatesForOffset(settings.cycleLength, settings.cycleStartDate, viewCycleOffset);
  }, [settings.cycleLength, settings.cycleStartDate, viewCycleOffset]);
}

export function useHabitEntries(habitId: string) {
  const { entries } = useHabitStore();
  
  return useMemo(() => {
    return entries.filter((e) => e.habitId === habitId);
  }, [entries, habitId]);
}

export function useCycleInfo() {
  const { settings, viewCycleOffset } = useHabitStore();
  
  return useMemo(() => {
    if (!settings.cycleStartDate) {
      return null;
    }
    return getCycleInfoForOffset(settings.cycleLength, settings.cycleStartDate, viewCycleOffset);
  }, [settings.cycleLength, settings.cycleStartDate, viewCycleOffset]);
}
