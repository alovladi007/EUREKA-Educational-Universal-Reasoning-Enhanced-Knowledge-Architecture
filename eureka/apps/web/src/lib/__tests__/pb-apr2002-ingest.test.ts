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
import { USPTO_APR2001_AM_QUESTIONS } from '../patent-bar-uspto-apr2001-data';
import { USPTO_APR2001_PM_QUESTIONS } from '../patent-bar-uspto-apr2001-pm-data';
import { USPTO_OCT2000_AM_QUESTIONS } from '../patent-bar-uspto-oct2000-data';
import { USPTO_OCT2000_PM_QUESTIONS } from '../patent-bar-uspto-oct2000-pm-data';
import { USPTO_APR2000_AM_QUESTIONS } from '../patent-bar-uspto-apr2000-data';
import { USPTO_APR2000_PM_QUESTIONS } from '../patent-bar-uspto-apr2000-pm-data';
import { USPTO_NOV1999_AM_QUESTIONS } from '../patent-bar-uspto-nov1999-data';
import { USPTO_NOV1999_PM_QUESTIONS } from '../patent-bar-uspto-nov1999-pm-data';
import { USPTO_OCT2002_AM_QUESTIONS } from '../patent-bar-uspto-oct2002-data';
import { USPTO_OCT2002_PM_QUESTIONS } from '../patent-bar-uspto-oct2002-pm-data';
import { USPTO_APR1999_AM_QUESTIONS } from '../patent-bar-uspto-apr1999-am-data';
import { USPTO_APR1999_PM_QUESTIONS } from '../patent-bar-uspto-apr1999-pm-data';

const OFFICIAL_TOTAL = 978; // Oct 2003: 48+49; Apr 2003: 49+49; Oct 2002: 49+50; Apr 2002: 49+49; Oct 2001: 48+50; Apr 2001: 49+46; Oct 2000: 47+50; Apr 2000: 49+50; Nov 1999: 48+49; Apr 1999: 50+50

const ALL = [
  ...USPTO_OCT2003_AM_QUESTIONS,
  ...USPTO_OCT2003_PM_QUESTIONS,
  ...USPTO_APR2003_AM_QUESTIONS,
  ...USPTO_APR2003_PM_QUESTIONS,
  ...USPTO_APR2002_AM_QUESTIONS,
  ...USPTO_APR2002_PM_QUESTIONS,
  ...USPTO_OCT2001_AM_QUESTIONS,
  ...USPTO_OCT2001_PM_QUESTIONS,
  ...USPTO_APR2001_AM_QUESTIONS,
  ...USPTO_APR2001_PM_QUESTIONS,
  ...USPTO_OCT2000_AM_QUESTIONS,
  ...USPTO_OCT2000_PM_QUESTIONS,
  ...USPTO_APR2000_AM_QUESTIONS,
  ...USPTO_APR2000_PM_QUESTIONS,
  ...USPTO_NOV1999_AM_QUESTIONS,
  ...USPTO_NOV1999_PM_QUESTIONS,
  ...USPTO_OCT2002_AM_QUESTIONS,
  ...USPTO_OCT2002_PM_QUESTIONS,
  ...USPTO_APR1999_AM_QUESTIONS,
  ...USPTO_APR1999_PM_QUESTIONS,
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

  it('both Apr 2001 sessions (49 + 46) reach the official mock pool', () => {
    const pool = Object.values(buildOfficialMockPool(ALL as never)).flat();
    expect(pool.filter((q) => q.id.startsWith('uspto-apr01-am-')).length).toBe(49);
    expect(pool.filter((q) => q.id.startsWith('uspto-apr01-pm-')).length).toBe(46);
    for (const q of [...USPTO_APR2001_AM_QUESTIONS, ...USPTO_APR2001_PM_QUESTIONS]) {
      expect(q.options.length).toBe(5);
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(5);
      expect(q.explanation).toContain('OFFICIAL USPTO MODEL ANSWER');
      expect(q.topicId).toBeGreaterThanOrEqual(0);
      expect(q.topicId).toBeLessThanOrEqual(7);
    }
  });

  it('Oct 2000 AM (47 items) reaches the official mock pool', () => {
    const pool = Object.values(buildOfficialMockPool(ALL as never)).flat();
    expect(pool.filter((q) => q.id.startsWith('uspto-oct00-am-')).length).toBe(47);
    for (const q of USPTO_OCT2000_AM_QUESTIONS) {
      expect(q.options.length).toBe(5);
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(5);
      expect(q.explanation).toContain('OFFICIAL USPTO MODEL ANSWER');
      expect(q.topicId).toBeGreaterThanOrEqual(0);
      expect(q.topicId).toBeLessThanOrEqual(7);
    }
  });

  it('Oct 2000 PM (50 items, no discards) reaches the official mock pool', () => {
    const pool = Object.values(buildOfficialMockPool(ALL as never)).flat();
    expect(pool.filter((q) => q.id.startsWith('uspto-oct00-pm-')).length).toBe(50);
    // Unlike the AM session this paper discarded nothing, so the full 50 are
    // scoreable — confirmed by a CASE-INSENSITIVE sweep of the model answers
    // for "all answers accepted" (this exam date capitalises it in the AM).
    expect(USPTO_OCT2000_PM_QUESTIONS.length).toBe(50);
    for (const q of USPTO_OCT2000_PM_QUESTIONS) {
      expect(q.options.length).toBe(5);
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(5);
      expect(q.explanation).toContain('OFFICIAL USPTO MODEL ANSWER');
      expect(q.topicId).toBeGreaterThanOrEqual(0);
      expect(q.topicId).toBeLessThanOrEqual(7);
    }
  });

  it('Apr 2000 AM (49 items, Q15 discarded) reaches the official mock pool', () => {
    const pool = Object.values(buildOfficialMockPool(ALL as never)).flat();
    expect(pool.filter((q) => q.id.startsWith('uspto-apr00-am-')).length).toBe(49);
    expect(USPTO_APR2000_AM_QUESTIONS.length).toBe(49);
    for (const q of USPTO_APR2000_AM_QUESTIONS) {
      expect(q.options.length).toBe(5);
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(5);
      expect(q.explanation).toContain('OFFICIAL USPTO MODEL ANSWER');
      expect(q.topicId).toBeGreaterThanOrEqual(0);
      expect(q.topicId).toBeLessThanOrEqual(7);
    }
  });

  it('Apr 2000 PM (50 items, no discards) reaches the official mock pool', () => {
    const pool = Object.values(buildOfficialMockPool(ALL as never)).flat();
    expect(pool.filter((q) => q.id.startsWith('uspto-apr00-pm-')).length).toBe(50);
    expect(USPTO_APR2000_PM_QUESTIONS.length).toBe(50);
    for (const q of USPTO_APR2000_PM_QUESTIONS) {
      expect(q.options.length).toBe(5);
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(5);
      expect(q.explanation).toContain('OFFICIAL USPTO MODEL ANSWER');
      expect(q.topicId).toBeGreaterThanOrEqual(0);
      expect(q.topicId).toBeLessThanOrEqual(7);
    }
  });

  it('Apr 2000 PM Q50 is keyed to (A) and discloses the other accepted answers', () => {
    // The USPTO model answer reads "50. ANSWER: (A),(B), or (E)." — three
    // options were accepted. The bank stores one key, so the explanation must
    // say so rather than silently dropping (B) and (E).
    const q50 = USPTO_APR2000_PM_QUESTIONS.find((q) => q.id === 'uspto-apr00-pm-50');
    expect(q50).toBeDefined();
    expect(q50!.correct).toBe(0); // (A)
    expect(q50!.explanation).toContain('THREE ANSWERS WERE ACCEPTED');
    expect(q50!.explanation).toContain('(A),(B), or (E)');
  });

  it('Nov 1999 AM (48 items, Q6+Q47 discarded, two multi-keys) reaches the official mock pool', () => {
    const pool = Object.values(buildOfficialMockPool(ALL as never)).flat();
    expect(pool.filter((q) => q.id.startsWith('uspto-nov99-am-')).length).toBe(48);
    expect(USPTO_NOV1999_AM_QUESTIONS.length).toBe(48);
    for (const q of USPTO_NOV1999_AM_QUESTIONS) {
      expect(q.options.length).toBe(5);
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(5);
      expect(q.explanation).toContain('OFFICIAL USPTO MODEL ANSWER');
      expect(q.topicId).toBeGreaterThanOrEqual(0);
      expect(q.topicId).toBeLessThanOrEqual(7);
    }
  });

  it('Nov 1999 AM Q4 and Q49 are keyed to the first accepted option and disclose the other', () => {
    // Q4  reads "ANSWER: (D) and (E)."   Q49 reads "ANSWERS: (A) and (B)."
    // The manual sweep missed Q49 entirely and read Q49's key from the "A" in
    // the word ANSWERS; the audit script catches both.
    const q4 = USPTO_NOV1999_AM_QUESTIONS.find((q) => q.id === 'uspto-nov99-am-04');
    expect(q4!.correct).toBe(3); // (D)
    expect(q4!.explanation).toContain('TWO ANSWERS WERE ACCEPTED');
    expect(q4!.explanation).toContain('(E)');
    const q49 = USPTO_NOV1999_AM_QUESTIONS.find((q) => q.id === 'uspto-nov99-am-49');
    expect(q49!.correct).toBe(0); // (A)
    expect(q49!.explanation).toContain('TWO ANSWERS WERE ACCEPTED');
    expect(q49!.explanation).toContain('(B)');
  });

  it('Nov 1999 PM (49 items, Q39 discarded, no multi-keys) reaches the official mock pool', () => {
    const pool = Object.values(buildOfficialMockPool(ALL as never)).flat();
    expect(pool.filter((q) => q.id.startsWith('uspto-nov99-pm-')).length).toBe(49);
    expect(USPTO_NOV1999_PM_QUESTIONS.length).toBe(49);
    for (const q of USPTO_NOV1999_PM_QUESTIONS) {
      expect(q.options.length).toBe(5);
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(5);
      expect(q.explanation).toContain('OFFICIAL USPTO MODEL ANSWER');
      expect(q.topicId).toBeGreaterThanOrEqual(0);
      expect(q.topicId).toBeLessThanOrEqual(7);
    }
  });

  it('Nov 1999 PM keys match the USPTO model answers exactly', () => {
    // A hand extraction of this file was WRONG throughout — it read citation
    // lines ("37 CFR § 10.38") as answer entries and gave Q1 = (D) where the
    // source plainly reads "1. ANSWER: (A)". These keys come from
    // `npm run audit:uspto`, which parses only parenthesised keys on lines
    // carrying an explicit ANSWER token. Spot-check the boundary cases: the
    // first item, the item straddling the Q39 discard, and the last.
    const key = (n: string) =>
      USPTO_NOV1999_PM_QUESTIONS.find((q) => q.id === `uspto-nov99-pm-${n}`)?.correct;
    expect(key('01')).toBe(0); // (A) — the item the hand pass got wrong
    expect(key('38')).toBe(1); // (B) — last before the discard
    expect(key('40')).toBe(2); // (C) — first after it; source reads "(C )"
    expect(key('50')).toBe(2); // (C)
  });

  it('the officially discarded questions are excluded', () => {
    // Apr 2002 AM Q49, Apr 2002 PM Q41, and Oct 2001 AM Q4 and Q26 were all
    // "All answers accepted".
    expect(USPTO_APR2002_AM_QUESTIONS.find((q) => q.id === 'uspto-apr02-am-49')).toBeUndefined();
    expect(USPTO_APR2002_PM_QUESTIONS.find((q) => q.id === 'uspto-apr02-pm-41')).toBeUndefined();
    expect(USPTO_OCT2001_AM_QUESTIONS.find((q) => q.id === 'uspto-oct01-am-04')).toBeUndefined();
    expect(USPTO_OCT2001_AM_QUESTIONS.find((q) => q.id === 'uspto-oct01-am-26')).toBeUndefined();
    expect(USPTO_APR2001_AM_QUESTIONS.find((q) => q.id === 'uspto-apr01-am-22')).toBeUndefined();
    // Apr 2001 PM discarded four: Q3, Q10, Q20 and Q34.
    for (const n of ['03', '10', '20', '34']) {
      expect(USPTO_APR2001_PM_QUESTIONS.find((q) => q.id === `uspto-apr01-pm-${n}`)).toBeUndefined();
    }
    // Oct 2000 AM discarded three — and writes the phrase "All Answers
    // accepted" with a capital A, which a case-sensitive sweep misses.
    for (const n of ['09', '29', '40']) {
      expect(USPTO_OCT2000_AM_QUESTIONS.find((q) => q.id === `uspto-oct00-am-${n}`)).toBeUndefined();
    }
    // Apr 2000 AM discarded exactly one: Q15 ("All answers accepted").
    expect(USPTO_APR2000_AM_QUESTIONS.find((q) => q.id === 'uspto-apr00-am-15')).toBeUndefined();
    // Nov 1999 AM discarded two — and writes "All answers ARE accepted", an
    // inserted word that defeats the usual `all +answers +accepted` pattern.
    for (const n of ['06', '47']) {
      expect(USPTO_NOV1999_AM_QUESTIONS.find((q) => q.id === `uspto-nov99-am-${n}`)).toBeUndefined();
    }
    // Nov 1999 PM discarded exactly one: Q39 ("All answers accepted").
    expect(USPTO_NOV1999_PM_QUESTIONS.find((q) => q.id === 'uspto-nov99-pm-39')).toBeUndefined();
  });
});
