import Dexie, { type EntityTable } from 'dexie';

export interface UserProfile {
  id: number;
  name: string;
  dob: string; // YYYY-MM-DD
  cycleLength: number;
  periodDuration: number;
  lastPeriodStart: string; // YYYY-MM-DD
}

export type FlowIntensity = 'None' | 'Light' | 'Medium' | 'Heavy';

export interface DailyLog {
  date: string; // YYYY-MM-DD
  flowIntensity: FlowIntensity;
  mood: string;
  symptoms: string[];
  notes: string;
}

export const db = new Dexie('BreeDatabase') as Dexie & {
  userProfile: EntityTable<UserProfile, 'id'>;
  dailyLogs: EntityTable<DailyLog, 'date'>;
};

// Database schema definition
db.version(1).stores({
  userProfile: 'id',
  dailyLogs: 'date',
});
