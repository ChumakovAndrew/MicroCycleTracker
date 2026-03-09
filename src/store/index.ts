import { create } from 'zustand';
import { Habit, Entry, Settings } from '@/types';
import { db } from '@/db';
import { nanoid } from './utils';

interface HabitStore {
  // State
  habits: Habit[];
  entries: Entry[];
  settings: Settings;
  selectedHabitId: string | null;

  // Actions
  loadData: () => Promise<void>;
  addHabit: (name: string, type: 'binary' | 'numeric') => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleEntry: (habitId: string, date: string, value: boolean | number) => Promise<void>;
  updateCycleLength: (length: 3 | 5 | 7) => Promise<void>;
  setSelectedHabit: (id: string | null) => void;
  getEntriesForHabit: (habitId: string) => Entry[];
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  entries: [],
  settings: { cycleLength: 3 },
  selectedHabitId: null,

  loadData: async () => {
    try {
      await db.initialize();
      const habits = await db.habits.toArray();
      const entries = await db.entries.toArray();
      const settings = await db.settings.toArray();
      
      set({
        habits: habits as Habit[],
        entries: entries as Entry[],
        settings: (settings[0] as Settings) || { cycleLength: 3 },
      });
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  },

  addHabit: async (name: string, type: 'binary' | 'numeric') => {
    const habit: Habit = {
      id: nanoid(),
      name,
      type,
      createdAt: new Date(),
    };

    try {
      await db.habits.add(habit);
      const habits = await db.habits.toArray();
      set({ habits: habits as Habit[] });
    } catch (error) {
      console.error('Failed to add habit:', error);
    }
  },

  deleteHabit: async (id: string) => {
    try {
      await db.habits.delete(id);
      await db.entries.where('habitId').equals(id).delete();
      const habits = await db.habits.toArray();
      const entries = await db.entries.toArray();
      set({ 
        habits: habits as Habit[],
        entries: entries as Entry[],
      });
    } catch (error) {
      console.error('Failed to delete habit:', error);
    }
  },

  toggleEntry: async (habitId: string, date: string, value: boolean | number) => {
    try {
      const existingEntry = get().entries.find(
        (e) => e.habitId === habitId && e.date === date
      );

      if (existingEntry) {
        if (!value) {
          await db.entries.delete(existingEntry.id);
        } else {
          await db.entries.update(existingEntry.id, { value });
        }
      } else if (value) {
        const entry: Entry = {
          id: nanoid(),
          habitId,
          date,
          value,
        };
        await db.entries.add(entry as any);
      }

      const entries = await db.entries.toArray();
      set({ entries: entries as Entry[] });
    } catch (error) {
      console.error('Failed to toggle entry:', error);
    }
  },

  updateCycleLength: async (length: 3 | 5 | 7) => {
    try {
      const settings = await db.settings.toArray();
      if (settings.length > 0) {
        await db.settings.update(settings[0] as any, { cycleLength: length });
      } else {
        await db.settings.add({ cycleLength: length } as any);
      }
      set({ settings: { cycleLength: length } });
    } catch (error) {
      console.error('Failed to update cycle length:', error);
    }
  },

  setSelectedHabit: (id: string | null) => {
    set({ selectedHabitId: id });
  },

  getEntriesForHabit: (habitId: string) => {
    return get().entries.filter((e) => e.habitId === habitId);
  },
}));
