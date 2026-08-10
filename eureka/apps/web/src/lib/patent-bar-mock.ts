/**
 * Patent Bar — Real Exam Mode mock (WS4).
 *
 * Builds a timed, scored 100-question mock exam from VERIFIED questions
 * only. The honesty rule this module enforces mechanically: a SCORED mock
 * may draw only items whose key is verified — official USPTO released-exam
 * questions (graded against the USPTO's own model answers) and, once any
 * exist, SME-verified items. AI-authored unverified questions are excluded
 * at the pool-construction step, so no UI path can leak one into a score.
 *
 * Section allocation is the honest part two. This used to read "the real
 * exam blueprint is 30/20/15/15/10/10, but the official pool skews hard
 * toward prosecution and patentability, so a blueprint-weighted
 * official-only form is impossible in the thin sections." That diagnosis
 * was backwards. Those weights were never the exam's — the USPTO publishes
 * no topic breakdown at all, and the figures were unsourced. Measured
 * against the 512 official released-exam items, the "skew" IS the exam's
 * shape. See the provenance block in patent-bar-coverage.ts.
 *
 * With the blueprint corrected to the empirical distribution, every section
 * is satisfiable from the official pool: supply 285/146/48/11/9/13 against
 * targets 56/28/10/2/2/2 allocates exactly on target, with no capping and
 * no redistribution. shortOfBlueprint is false for all six.
 *
 * computeMockAllocation() keeps the redistribution machinery anyway — it is
 * what makes the allocation self-correcting. It starts each section at its
 * target, caps at available supply, redistributes any shortfall to uncapped
 * sections in proportion to their weights, iterates until stable, then
 * largest-remainder rounds to exactly the form size. That path is currently
 * inert but guards narrower pools (a single-exam form, a future
 * SME-only pool) and any re-weighting that outruns supply. The resulting
 * mix is DISCLOSED to the user before they start, never silently passed off
 * as blueprint-weighted.
 *
 * Form size note: the real exam delivers 100 questions of which only 90 are
 * scored (10 are unscored pretest items), and passing is 63 of 90 — the same
 * 70% threshold MOCK_PASS_PCT encodes. This mock scores all 100 rather than
 * designating 10 arbitrary items unscored, which would change no candidate's
 * outcome and would only cost them feedback on 10 real questions.
 */

import { getPatentBarVerification, type PatentBarQuestion } from './patent-bar-qbank-data';
import { PATENT_BAR_BLUEPRINT } from './patent-bar-coverage';

export const MOCK_FORM_SIZE = 100;
/** Real exam: two sessions of 50 questions, 3 hours (180 min) each. */
export const MOCK_HALF_SIZE = 50;
export const MOCK_HALF_SECONDS = 180 * 60;
/** USPTO passing threshold on the registration exam: 70%. */
export const MOCK_PASS_PCT = 70;

export interface MockAllocationRow {
  id: string;
  name: string;
  weightPct: number;
  available: number;
  allocated: number;
  /** allocated < weightPct means the official pool cannot fill the blueprint. */
  shortOfBlueprint: boolean;
}

/** Verified-only pool, keyed by blueprint section id. */
export function buildOfficialMockPool(
  questions: PatentBarQuestion[],
): Record<string, PatentBarQuestion[]> {
  const pool: Record<string, PatentBarQuestion[]> = {};
  for (const s of PATENT_BAR_BLUEPRINT) pool[s.id] = [];
  for (const q of questions) {
    const v = getPatentBarVerification(q);
    if (v !== 'official' && v !== 'sme') continue; // unverified NEVER enters a scored mock
    const section = PATENT_BAR_BLUEPRINT.find((s) => s.topicIds.includes(q.topicId));
    if (section) pool[section.id].push(q);
  }
  return pool;
}

/**
 * Blueprint-target-then-redistribute waterfall (see module header).
 * Pure function of per-section availability; exact-sums to formSize
 * (or to total availability when the whole pool is smaller than the form).
 */
export function computeMockAllocation(
  available: Record<string, number>,
  formSize: number = MOCK_FORM_SIZE,
): MockAllocationRow[] {
  const sections = PATENT_BAR_BLUEPRINT.map((s) => ({
    ...s,
    avail: available[s.id] ?? 0,
  }));
  const totalAvail = sections.reduce((n, s) => n + s.avail, 0);
  const target = Math.min(formSize, totalAvail);

  // Fractional allocation: start at blueprint share, cap, redistribute.
  const alloc = new Map<string, number>(
    sections.map((s) => [s.id, (s.weightPct / 100) * target]),
  );
  for (let iter = 0; iter < 20; iter++) {
    let overflow = 0;
    const uncapped: { id: string; weightPct: number }[] = [];
    for (const s of sections) {
      const a = alloc.get(s.id)!;
      if (a > s.avail) {
        overflow += a - s.avail;
        alloc.set(s.id, s.avail);
      } else if (a < s.avail) {
        uncapped.push({ id: s.id, weightPct: s.weightPct });
      }
    }
    if (overflow < 1e-9 || uncapped.length === 0) break;
    const wSum = uncapped.reduce((n, u) => n + u.weightPct, 0);
    for (const u of uncapped) {
      alloc.set(u.id, alloc.get(u.id)! + (overflow * u.weightPct) / wSum);
    }
  }

  // Largest-remainder rounding to integers summing exactly to target.
  const floors = sections.map((s) => {
    const a = Math.min(alloc.get(s.id)!, s.avail);
    return { id: s.id, floor: Math.floor(a + 1e-9), rem: a - Math.floor(a + 1e-9), avail: s.avail };
  });
  let used = floors.reduce((n, f) => n + f.floor, 0);
  const byRem = [...floors].sort((a, b) => b.rem - a.rem);
  for (const f of byRem) {
    if (used >= target) break;
    if (f.floor < f.avail) { f.floor += 1; used += 1; }
  }
  // Safety: if remainder-capped, hand leftovers to any section with supply.
  for (const f of byRem) {
    if (used >= target) break;
    while (f.floor < f.avail && used < target) { f.floor += 1; used += 1; }
  }

  const floorById = new Map(floors.map((f) => [f.id, f.floor]));
  return sections.map((s) => ({
    id: s.id,
    name: s.name,
    weightPct: s.weightPct,
    available: s.avail,
    allocated: floorById.get(s.id)!,
    shortOfBlueprint: floorById.get(s.id)! < Math.round((s.weightPct / 100) * formSize),
  }));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Draw a mock form: per-section random sample per the allocation, then shuffle the whole form. */
export function drawMockForm(
  pool: Record<string, PatentBarQuestion[]>,
  formSize: number = MOCK_FORM_SIZE,
): { questions: PatentBarQuestion[]; allocation: MockAllocationRow[] } {
  const available = Object.fromEntries(
    PATENT_BAR_BLUEPRINT.map((s) => [s.id, pool[s.id]?.length ?? 0]),
  );
  const allocation = computeMockAllocation(available, formSize);
  const picked: PatentBarQuestion[] = [];
  for (const row of allocation) {
    picked.push(...shuffle(pool[row.id] ?? []).slice(0, row.allocated));
  }
  return { questions: shuffle(picked), allocation };
}

/** Section id for a question (scoring/breakdown). */
export function mockSectionOf(q: { topicId: number }): string {
  return PATENT_BAR_BLUEPRINT.find((s) => s.topicIds.includes(q.topicId))?.id ?? 'unknown';
}
