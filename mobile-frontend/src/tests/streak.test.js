import { describe, it, expect } from 'vitest';
import { calculateStreakFromDates } from '../services/providers/supabase/supabaseProvider';

describe('Streak Calculation (UTC+8 Operational Timezone)', () => {
  it('returns 0 for empty or null dates', () => {
    expect(calculateStreakFromDates([])).toBe(0);
    expect(calculateStreakFromDates(null)).toBe(0);
  });

  it('calculates 1 for activity today in UTC+8', () => {
    const now = new Date();
    const myTime = new Date(now.getTime() + (8 * 3600 * 1000));
    const todayStr = myTime.toISOString().slice(0, 10);
    expect(calculateStreakFromDates([`${todayStr}T02:00:00Z`])).toBe(1);
  });

  it('calculates consecutive day streak correctly', () => {
    const now = new Date();
    const myTime = new Date(now.getTime() + (8 * 3600 * 1000));
    const todayStr = myTime.toISOString().slice(0, 10);

    const d1 = new Date(myTime.getTime() - (24 * 3600 * 1000)).toISOString().slice(0, 10);
    const d2 = new Date(myTime.getTime() - (48 * 3600 * 1000)).toISOString().slice(0, 10);

    const dates = [
      `${todayStr}T04:00:00Z`,
      `${d1}T05:00:00Z`,
      `${d2}T06:00:00Z`
    ];

    expect(calculateStreakFromDates(dates)).toBe(3);
  });

  it('breaks streak when a day is skipped', () => {
    const now = new Date();
    const myTime = new Date(now.getTime() + (8 * 3600 * 1000));
    const todayStr = myTime.toISOString().slice(0, 10);
    const d2 = new Date(myTime.getTime() - (48 * 3600 * 1000)).toISOString().slice(0, 10); // skipped yesterday!

    const dates = [
      `${todayStr}T04:00:00Z`,
      `${d2}T06:00:00Z`
    ];

    expect(calculateStreakFromDates(dates)).toBe(1);
  });
});

