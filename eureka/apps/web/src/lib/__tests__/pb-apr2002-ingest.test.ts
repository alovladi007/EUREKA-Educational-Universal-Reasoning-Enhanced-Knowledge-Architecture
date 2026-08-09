import { describe, it, expect } from 'vitest';
import { buildOfficialMockPool } from '../patent-bar-mock';
import { USPTO_OCT2003_AM_QUESTIONS } from '../patent-bar-uspto-oct2003-data';
import { USPTO_OCT2003_PM_QUESTIONS } from '../patent-bar-uspto-oct2003-pm-data';
import { USPTO_APR2003_AM_QUESTIONS } from '../patent-bar-uspto-apr2003-data';
import { USPTO_APR2003_PM_QUESTIONS } from '../patent-bar-uspto-apr2003-pm-data';
import { USPTO_APR2002_AM_QUESTIONS } from '../patent-bar-uspto-apr2002-data';

describe('Apr 2002 ingestion reaches the live pool', () => {
  it('all 49 Apr 2002 items are in the official mock pool', () => {
    const all = [...USPTO_OCT2003_AM_QUESTIONS, ...USPTO_OCT2003_PM_QUESTIONS,
      ...USPTO_APR2003_AM_QUESTIONS, ...USPTO_APR2003_PM_QUESTIONS, ...USPTO_APR2002_AM_QUESTIONS];
    expect(all.length).toBe(223);
    const pool = Object.values(buildOfficialMockPool(all as any)).flat();
    const apr02 = pool.filter((q: any) => q.id.startsWith('uspto-apr02-'));
    expect(apr02.length).toBe(49);
    // ids unique across the whole official corpus
    expect(new Set(all.map((q: any) => q.id)).size).toBe(223);
    // every item has 5 options and an in-range key
    for (const q of USPTO_APR2002_AM_QUESTIONS) {
      expect(q.options.length).toBe(5);
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(5);
      expect(q.explanation).toContain('OFFICIAL USPTO MODEL ANSWER');
    }
  });
});
