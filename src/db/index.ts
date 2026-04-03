import Dexie, { type Table } from 'dexie';
import { Habit, Entry, Settings, DayComment } from '@/types';
import { formatISO, startOfDay } from 'date-fns';

export class MicroCycleDB extends Dexie {
  habits!: Table<Habit>;
  entries!: Table<Entry>;
  settings!: Table<Settings>;
  dayComments!: Table<DayComment>;

  constructor() {
    super('MicroCycleTrackerDB');
    this.version(1).stores({
      habits: '&id, createdAt',
      entries: '&id, habitId, date',
      settings: '&id',
    });
    this.version(2).stores({
      habits: '&id, createdAt',
      entries: '&id, habitId, date',
      settings: '&id',
      dayComments: '&id, habitId, date',
    });
  }

  async initialize() {
    // Create default settings if they don't exist
    const existingSettings = await this.settings.count();
    if (existingSettings === 0) {
      const today = formatISO(startOfDay(new Date()), { representation: 'date' });
      
      await this.settings.add({
        id: 'default',
        cycleLength: 3,
        cycleStartDate: today,
        cycleNumber: 1,
      } as Settings);
    }
  }
}

export const db = new MicroCycleDB();
