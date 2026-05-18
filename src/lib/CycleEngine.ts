import { parseDateStr } from './utils';

export class CycleEngine {
  static MS_PER_DAY = 1000 * 60 * 60 * 24;

  static calculateAge(dobStr: string): number {
    const dob = parseDateStr(dobStr);
    const diff_ms = Date.now() - dob.getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  }

  static calculateNextPeriod(lastPeriodStartStr: string, cycleLength: number): Date {
    const lastPeriodStart = parseDateStr(lastPeriodStartStr);
    return new Date(lastPeriodStart.getTime() + cycleLength * this.MS_PER_DAY);
  }

  static calculateOvulation(nextPeriodStart: Date): Date {
    return new Date(nextPeriodStart.getTime() - 14 * this.MS_PER_DAY);
  }

  static calculateFertileWindow(ovulationDate: Date): { start: Date; end: Date } {
    return {
      start: new Date(ovulationDate.getTime() - 5 * this.MS_PER_DAY),
      end: new Date(ovulationDate.getTime() + 1 * this.MS_PER_DAY),
    };
  }

  static calculateCycleDay(currentDate: Date, lastPeriodStartStr: string): number {
    const lastPeriodStart = parseDateStr(lastPeriodStartStr);
    // Ignore time by comparing start of day
    const currAtMidnight = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const lastAtMidnight = new Date(lastPeriodStart.getFullYear(), lastPeriodStart.getMonth(), lastPeriodStart.getDate());
    const diff_ms = currAtMidnight.getTime() - lastAtMidnight.getTime();
    return Math.floor(diff_ms / this.MS_PER_DAY) + 1;
  }
}
