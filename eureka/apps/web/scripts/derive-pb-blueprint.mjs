#!/usr/bin/env node
/**
 * Patent Bar blueprint derivation — the rule written down, so it is never hand-tuned.
 *
 * The USPTO publishes NO topic weighting. The blueprint in patent-bar-coverage.ts is the
 * empirical distribution of the OFFICIAL released-exam corpus, derived by three steps:
 *
 *   1. share      — each section's percentage of the official corpus
 *   2. round      — largest-remainder apportionment to integers summing to 100
 *   3. floors     — three sections have named modern tested sources that postdate every
 *                   released exam (PTAB trial practice, the 2013 Part 11 conduct rules,
 *                   the Global/IP5 PPH programs). They may not fall below their floor;
 *                   any shortfall is ceded by the LARGEST section.
 *
 * UNWIND rule: a step-3 adjustment must be dropped as soon as the data no longer needs it.
 * Run this on every ingest; never edit weights by hand.
 *
 * Usage:  node scripts/derive-pb-blueprint.mjs            (self-test at the 878 corpus)
 *         node scripts/derive-pb-blueprint.mjs <file...>  (recompute from data files)
 */

import { readFileSync } from 'node:fs';

/** section id -> bank topicIds, mirroring PATENT_BAR_BLUEPRINT. */
export const SECTIONS = [
  { id: 'patent_prosecution', topicIds: [1, 2, 3], floor: null },
  { id: 'patentability', topicIds: [0], floor: null },
  { id: 'post_issuance', topicIds: [5], floor: 11 },
  { id: 'ethics_conduct', topicIds: [7], floor: 3 },
  { id: 'design_plant', topicIds: [6], floor: null },
  { id: 'pct_international', topicIds: [4], floor: 3 },
];

export function derive(countsByTopic) {
  const total = Object.values(countsByTopic).reduce((a, b) => a + b, 0);
  const supply = SECTIONS.map((s) => ({
    ...s,
    n: s.topicIds.reduce((a, t) => a + (countsByTopic[t] ?? 0), 0),
  }));

  // step 1 + 2: share, then largest-remainder to integers summing to 100
  const exact = supply.map((s) => ({ ...s, share: (s.n / total) * 100 }));
  const floors = exact.map((s) => ({ ...s, base: Math.floor(s.share), rem: s.share - Math.floor(s.share) }));
  let left = 100 - floors.reduce((a, s) => a + s.base, 0);
  const byRem = [...floors].sort((a, b) => b.rem - a.rem || b.n - a.n);
  const bump = new Set();
  for (let i = 0; i < left; i++) bump.add(byRem[i].id);
  let weights = Object.fromEntries(floors.map((s) => [s.id, s.base + (bump.has(s.id) ? 1 : 0)]));
  const rounded = { ...weights };

  // step 3: restore floors, ceding from the largest section
  const largest = [...supply].sort((a, b) => b.n - a.n)[0].id;
  const ceded = [];
  for (const s of SECTIONS) {
    if (s.floor != null && weights[s.id] < s.floor) {
      const need = s.floor - weights[s.id];
      weights[s.id] = s.floor;
      weights[largest] -= need;
      ceded.push(`${s.id} ${rounded[s.id]}->${s.floor} (${need} from ${largest})`);
    }
  }

  return { total, supply, rounded, weights, ceded, largest };
}

function report(label, countsByTopic) {
  const { total, supply, rounded, weights, ceded } = derive(countsByTopic);
  console.log(`\n=== ${label} — ${total} official items ===`);
  for (const s of supply) {
    const share = ((s.n / total) * 100).toFixed(2);
    console.log(
      `  ${s.id.padEnd(20)} n=${String(s.n).padStart(4)}  share=${share.padStart(6)}%  rounded=${String(rounded[s.id]).padStart(2)}  final=${String(weights[s.id]).padStart(2)}`,
    );
  }
  console.log(`  step-3 adjustments: ${ceded.length ? ceded.join('; ') : 'none needed (UNWIND any that were there)'}`);
  console.log(`  weights sum: ${Object.values(weights).reduce((a, b) => a + b, 0)}`);
  console.log(`  supply line for the file header: ${supply.map((s) => s.n).join('/')}`);
  return weights;
}

function countsFromFiles(files) {
  const counts = {};
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(/topicId:\s*(\d+)/g)) {
      const t = Number(m[1]);
      counts[t] = (counts[t] ?? 0) + 1;
    }
  }
  return counts;
}

const args = process.argv.slice(2);
if (args.length === 0) {
  // Self-test: the published 878-item supply must reproduce the published 56/25/11/3/2/3.
  const at878 = { 1: 511, 0: 222, 5: 83, 7: 26, 6: 15, 4: 21 };
  const w = report('SELF-TEST at the published 878 corpus', at878);
  const expect = { patent_prosecution: 56, patentability: 25, post_issuance: 11, ethics_conduct: 3, design_plant: 2, pct_international: 3 };
  const ok = Object.entries(expect).every(([k, v]) => w[k] === v);
  console.log(`\n  SELF-TEST: ${ok ? 'PASS — reproduces the published weights' : 'FAIL — derivation drifted from what is published'}`);
  process.exit(ok ? 0 : 1);
} else {
  report(`recomputed from ${args.length} data file(s)`, countsFromFiles(args));
}
