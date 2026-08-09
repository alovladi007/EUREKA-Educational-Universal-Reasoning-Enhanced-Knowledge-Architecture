/**
 * Guards the official-USPTO ingestion pipeline: every transcribed item must
 * survive all the way into the pool a scored mock actually draws from, keep a
 * unique id across the whole official corpus, and carry the USPTO's own model
 * answer in its explanation.
 */
import { describe, it, expect } from 'vitest';
import { buildOfficialMockPool } from '../patent-bar-mock';
import { USPTO_OCT2003_AM_QUESTIONS } from '../patent-bar-uspto-oct2003-data';
import { USPTO_OCT2003_PM_QUESTIONS } from '../patent-bar-uspto-oct2003-pm-data';
import { USPTO_APR2003_AM_QUESTIONS } from '../patent-bar-uspto-apr2003-data';
import { USPTO_APR2003_PM_QUESTIONS } from '../patent-bar-uspto-apr2003-pm-data';
import { USPTO_APR2002_AM_QUESTIONS } from '../patent-bar-uspto-apr2002-data';
import { USPTO_APR2002_PM_QUESTIONS } from '../patent-bar-uspto-apr2002-pm-data';
import { USPTO_OCT2001_AM_QUESTIONS } from '../patent-bar-uspto-oct2001-data';
import { USPTO_OCT2001_PM_QUESTIONS } from '../patent-bar-uspto-oct2001-pm-data';

const OFFICIAL_TOTAL = 370; // Oct 2003: 47+48; Apr 2003: 40+39; Apr 2002: 49+49; Oct 2001: 48+50

const ALL = [
  ...USPTO_OCT2003_AM_QUESTIONS,
  ...USPTO_OCT2003_PM_QUESTIONS,
  ...USPTO_APR2003_AM_QUESTIONS,
  ...USPTO_APR2003_PM_QUESTIONS,
  ...USPTO_APR2002_AM_QUESTIONS,
  ...USPTO_APR2002_PM_QUESTIONS,
  ...USPTO_OCT2001_AM_QUESTIONS,
  ...USPTO_OCT2001_PM_QUESTIONS,
];

describe('official USPTO ingestion reaches the live pool', () => {
  it('every official item is in the corpus with a unique id', () => {
    expect(ALL.length).toBe(OFFICIAL_TOTAL);
    expect(new Set(ALL.map((q) => q.id)).size).toBe(OFFICIAL_TOTAL);
  });

  it('both Apr 2002 sessions (49 + 49) reach the official mock pool', () => {
    const pool = Object.values(buildOfficialMockPool(ALL as never)).flat();
    // Nothing is dropped by the blueprint mapping.
    expect(pool.length).toBe(OFFICIAL_TOTAL);
    expect(pool.filter((q) => q.id.startsWith('uspto-apr02-am-')).length).toBe(49);
    expect(pool.filter((q) => q.id.startsWith('uspto-apr02-pm-')).length).toBe(49);
  });

  it('every Apr 2002 item is a well-formed 5-option question with the official model answer', () => {
    for (const q of [...USPTO_APR2002_AM_QUESTIONS, ...USPTO_APR2002_PM_QUESTIONS]) {
      expect(q.options.length).toBe(5);
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(5);
      expect(q.explanation).toContain('OFFICIAL USPTO MODEL ANSWER');
      // Blueprint sections cover topicIds 0-7; anything else falls out of the pool.
      expect(q.topicId).toBeGreaterThanOrEqual(0);
      expect(q.topicId).toBeLessThanOrEqual(7);
    }
  });

  it('both Oct 2001 sessions (48 + 50) reach the official mock pool', () => {
    const pool = Object.values(buildOfficialMockPool(ALL as never)).flat();
    expect(pool.filter((q) => q.id.startsWith('uspto-oct01-am-')).length).toBe(48);
    expect(pool.filter((q) => q.id.startsWith('uspto-oct01-pm-')).length).toBe(50);
    for (const q of [...USPTO_OCT2001_AM_QUESTIONS, ...USPTO_OCT2001_PM_QUESTIONS]) {
      expect(q.options.length).toBe(5);
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(5);
      expect(q.explanation).toContain('OFFICIAL USPTO MODEL ANSWER');
      expect(q.topicId).toBeGreaterThanOrEqual(0);
      expect(q.topicId).toBeLessThanOrEqual(7);
    }
  });

  it('the officially discarded questions are excluded', () => {
    // Apr 2002 AM Q49, Apr 2002 PM Q41, and Oct 2001 AM Q4 and Q26 were all
    // "All answers accepted".
    expect(USPTO_APR2002_AM_QUESTIONS.find((q) => q.id === 'uspto-apr02-am-49')).toBeUndefined();
    expect(USPTO_APR2002_PM_QUESTIONS.find((q) => q.id === 'uspto-apr02-pm-41')).toBeUndefined();
    expect(USPTO_OCT2001_AM_QUESTIONS.find((q) => q.id === 'uspto-oct01-am-04')).toBeUndefined();
    expect(USPTO_OCT2001_AM_QUESTIONS.find((q) => q.id === 'uspto-oct01-am-26')).toBeUndefined();
  });
});
