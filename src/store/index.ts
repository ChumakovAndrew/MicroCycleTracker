import { create } from 'zustand';
import { Habit, Entry, Settings } from '@/types';
import { db } from '@/db';
import { nanoid } from './utils';
import { formatISO, startOfDay } from 'date-fns';

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
      let settings = await db.settings.toArray();
      
      // Initialize settings with defaults if not exists
      if (settings.length === 0) {
        const today = formatISO(startOfDay(new Date()), { representation: 'date' });
        const defaultSettings: Settings = {
          id: 'default',
          cycleLength: 3,
          cycleStartDate: today,
          cycleNumber: 1,
        };
        await db.settings.add(defaultSettings as any);
        settings = [defaultSettings];
      }
      
      const loadedSettings = settings[0] as Settings;
      
      // Ensure cycleStartDate exists (for backwards compatibility)
      if (!loadedSettings.cycleStartDate) {
        const today = formatISO(startOfDay(new Date()), { representation: 'date' });
        loadedSettings.cycleStartDate = today;
        await db.settings.update('default', { cycleStartDate: today } as any);
      }
      
      set({
        habits: habits as Habit[],
        entries: entries as Entry[],
        settings: loadedSettings,
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
          id: crypto.randomUUID(),
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
      const currentSettings = settings[0] as Settings || {
        id: 'default',
        cycleLength: 3,
        cycleStartDate: formatISO(startOfDay(new Date()), { representation: 'date' }),
        cycleNumber: 1,
      };
      
      if (settings.length > 0) {
        await db.settings.update('default', { 
          cycleLength: length,
          cycleStartDate: currentSettings.cycleStartDate,
          cycleNumber: currentSettings.cycleNumber,
        } as any);
      } else {
        const newSettings: Settings = {
          id: 'default',
          cycleLength: length,
          cycleStartDate: currentSettings.cycleStartDate,
          cycleNumber: currentSettings.cycleNumber,
        };
        await db.settings.add(newSettings as any);
      }
      
      const updatedSettings = (await db.settings.toArray())[0] as Settings;
      set({ settings: updatedSettings });
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
