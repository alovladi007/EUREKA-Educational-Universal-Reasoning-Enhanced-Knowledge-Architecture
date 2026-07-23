/**
 * WS4 Real Exam Mode mock — allocation + pool-honesty tests.
 *
 * Guards the two mechanical honesty rules:
 *   1. buildOfficialMockPool() admits ONLY official/SME-verified questions —
 *      an AI-authored unverified item can never reach a scored mock.
 *   2. computeMockAllocation() sums exactly to the form size, never exceeds
 *      per-section supply, redistributes thin-section shortfall to sections
 *      with supply (proportional to blueprint weights), and converges to the
 *      exact blueprint mix when every section has ample supply.
 */
import { describe, expect, it } from 'vitest';

import {
  buildOfficialMockPool,
  computeMockAllocation,
  drawMockForm,
  MOCK_FORM_SIZE,
} from '../patent-bar-mock';
import { PATENT_BAR_BLUEPRINT } from '../patent-bar-coverage';
import type { PatentBarQuestion } from '../patent-bar-qbank-data';

import { USPTO_OCT2003_AM_QUESTIONS } from '../patent-bar-uspto-oct2003-data';
import { USPTO_OCT2003_PM_QUESTIONS } from '../patent-bar-uspto-oct2003-pm-data';
import { USPTO_APR2003_AM_QUESTIONS } from '../patent-bar-uspto-apr2003-data';
import { USPTO_APR2003_PM_QUESTIONS } from '../patent-bar-uspto-apr2003-pm-data';
import { PATENT_BAR_QUESTIONS } from '../patent-bar-qbank-data';
import { PATENT_BAR_GAPFILL_ETHICS } from '../patent-bar-gapfill-ethics-data';

const OFFICIALS = [
  ...USPTO_OCT2003_AM_QUESTIONS,
  ...USPTO_OCT2003_PM_QUESTIONS,
  ...USPTO_APR2003_AM_QUESTIONS,
  ...USPTO_APR2003_PM_QUESTIONS,
];

const FULL_BANK = [...PATENT_BAR_QUESTIONS, ...PATENT_BAR_GAPFILL_ETHICS, ...OFFICIALS];

describe('buildOfficialMockPool', () => {
  it('admits every official question and nothing unverified', () => {
    const pool = buildOfficialMockPool(FULL_BANK as PatentBarQuestion[]);
    const all = Object.values(pool).flat();
    expect(all.length).toBe(OFFICIALS.length); // 174 officials, zero sme so far
    for (const q of all) expect(q.id.startsWith('uspto-')).toBe(true);
  });

  it('matches the known per-section official supply', () => {
    const pool = buildOfficialMockPool(OFFICIALS as PatentBarQuestion[]);
    const counts = Object.fromEntries(
      Object.entries(pool).map(([k, v]) => [k, v.length]),
    );
    expect(counts).toEqual({
      patent_prosecution: 79,
      patentability: 70,
      post_issuance: 17,
      ethics_conduct: 2,
      design_plant: 98 - 96, // 2 official design/plant items
      pct_international: 4,
    });
  });
});

describe('computeMockAllocation', () => {
  const currentSupply = {
    patent_prosecution: 79,
    patentability: 70,
    post_issuance: 17,
    ethics_conduct: 2,
    design_plant: 2,
    pct_international: 4,
  };

  it('produces the documented 45/30/17/2/2/4 mix for the current official pool', () => {
    const rows = computeMockAllocation(currentSupply, 100);
    const byId = Object.fromEntries(rows.map((r) => [r.id, r.allocated]));
    expect(byId).toEqual({
      patent_prosecution: 45,
      patentability: 30,
      post_issuance: 17,
      ethics_conduct: 2,
      design_plant: 2,
      pct_international: 4,
    });
    expect(rows.reduce((n, r) => n + r.allocated, 0)).toBe(100);
    // Thin sections are flagged as short of blueprint; padded ones are not.
    const short = Object.fromEntries(rows.map((r) => [r.id, r.shortOfBlueprint]));
    expect(short.ethics_conduct).toBe(true);
    expect(short.design_plant).toBe(true);
    expect(short.pct_international).toBe(true);
    expect(short.patent_prosecution).toBe(false);
  });

  it('never allocates beyond a section supply and always sums to the form size', () => {
    for (const supply of [
      currentSupply,
      { patent_prosecution: 50, patentability: 50, post_issuance: 0, ethics_conduct: 0, design_plant: 0, pct_international: 0 },
      { patent_prosecution: 200, patentability: 5, post_issuance: 5, ethics_conduct: 5, design_plant: 5, pct_international: 5 },
    ]) {
      const rows = computeMockAllocation(supply, 100);
      for (const r of rows) expect(r.allocated).toBeLessThanOrEqual(r.available);
      expect(rows.reduce((n, r) => n + r.allocated, 0)).toBe(100);
    }
  });

  it('returns the exact blueprint mix when supply is ample everywhere', () => {
    const ample = Object.fromEntries(PATENT_BAR_BLUEPRINT.map((s) => [s.id, 500]));
    const rows = computeMockAllocation(ample, 100);
    for (const r of rows) {
      expect(r.allocated).toBe(r.weightPct); // 100-question form: weight == count
      expect(r.shortOfBlueprint).toBe(false);
    }
  });

  it('caps at total availability when the pool is smaller than the form', () => {
    const tiny = { patent_prosecution: 3, patentability: 2, post_issuance: 1, ethics_conduct: 0, design_plant: 0, pct_international: 0 };
    const rows = computeMockAllocation(tiny, 100);
    expect(rows.reduce((n, r) => n + r.allocated, 0)).toBe(6);
  });
});

describe('drawMockForm', () => {
  it('draws a full 100-question form of exclusively verified items, matching the allocation', () => {
    const pool = buildOfficialMockPool(FULL_BANK as PatentBarQuestion[]);
    const { questions, allocation } = drawMockForm(pool);
    expect(questions.length).toBe(MOCK_FORM_SIZE);
    for (const q of questions) expect(q.id.startsWith('uspto-')).toBe(true);
    // No duplicates.
    expect(new Set(questions.map((q) => q.id)).size).toBe(MOCK_FORM_SIZE);
    // Per-section counts in the drawn form match the allocation exactly.
    for (const row of allocation) {
      const inForm = questions.filter((q) =>
        PATENT_BAR_BLUEPRINT.find((s) => s.id === row.id)!.topicIds.includes(q.topicId),
      ).length;
      expect(inForm).toBe(row.allocated);
    }
  });
});
