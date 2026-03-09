import Dexie, { type Table } from 'dexie';
import { Habit, Entry, Settings } from '@/types';

export class MicroCycleDB extends Dexie {
  habits!: Table<Habit>;
  entries!: Table<Entry>;
  settings!: Table<Settings>;

  constructor() {
    super('MicroCycleTrackerDB');
    this.version(1).stores({
      habits: '&id, createdAt',
      entries: '&id, habitId, date',
      settings: '&id',
    });
  }

  async initialize() {
    // Create default settings if they don't exist
    const existingSettings = await this.settings.count();
    if (existingSettings === 0) {
      await this.settings.add({
        cycleLength: 3,
      } as Settings);
    }
  }
}

export const db = new MicroCycleDB();
