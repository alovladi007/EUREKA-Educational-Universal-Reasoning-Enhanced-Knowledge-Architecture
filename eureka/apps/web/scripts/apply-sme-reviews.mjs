#!/usr/bin/env node
/**
 * Apply an SME review export to the Patent Bar QBank data file.
 *
 * Usage:
 *   node scripts/apply-sme-reviews.mjs <export.json> [--dry-run] [--file <path>]
 *
 * Reads the JSON exported from the in-app SME Review Queue
 * (/dashboard/test-prep/patent_bar/review-queue) and stamps
 * `verified: 'sme',` onto each APPROVED question in
 * src/lib/patent-bar-qbank-data.ts. Flagged items are printed for manual
 * attention and left untouched. Idempotent: already-stamped ids are skipped.
 *
 * This script is the deliberate human-in-the-loop step of the WS2 pipeline:
 * nothing becomes "SME-verified" in the product until a maintainer runs it
 * and commits the diff, which keeps the provenance trail in git history.
 */

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const exportPath = args.find((a) => !a.startsWith('--'));
const dryRun = args.includes('--dry-run');
const fileFlag = args.indexOf('--file');
const dataPath = fileFlag >= 0 ? args[fileFlag + 1] : path.join('src', 'lib', 'patent-bar-qbank-data.ts');

if (!exportPath) {
  console.error('Usage: node scripts/apply-sme-reviews.mjs <export.json> [--dry-run] [--file <path>]');
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
if (payload.bank !== 'PATENT_BAR' || !payload.decisions) {
  console.error('Not a Patent Bar SME review export (expected { bank: "PATENT_BAR", decisions: {...} }).');
  process.exit(1);
}

let src = fs.readFileSync(dataPath, 'utf8');
const approved = Object.entries(payload.decisions).filter(([, d]) => d.decision === 'approve');
const flagged = Object.entries(payload.decisions).filter(([, d]) => d.decision === 'flag');

let stamped = 0, already = 0, missing = 0;
for (const [id] of approved) {
  if (id.startsWith('uspto-')) { already++; continue; } // official items never need stamping
  // Match this question's object: from its `id: '<id>'` line to the closing
  // `},` — bounded by the next `id:` or end of array. Insert after
  // `explanation: '...'` (the last standard field) unless already stamped.
  const idAnchor = `id: '${id}'`;
  const start = src.indexOf(idAnchor);
  if (start === -1) { missing++; console.warn(`  ! id not found in data file: ${id}`); continue; }
  const nextId = src.indexOf("id: 'pb_", start + idAnchor.length);
  const end = nextId === -1 ? src.length : nextId;
  const block = src.slice(start, end);
  if (block.includes('verified:')) { already++; continue; }
  // Insert immediately before the object's closing `},` — the LAST `  },`
  // line in the block (field values, including multi-line explanation
  // strings, all live above it). Anchoring on the closing brace instead of
  // a field keeps the insertion valid regardless of how fields wrap.
  const closeIdx = block.lastIndexOf('\n  },');
  if (closeIdx === -1) { missing++; console.warn(`  ! no closing brace found for: ${id}`); continue; }
  const updated = block.slice(0, closeIdx) + "\n    verified: 'sme'," + block.slice(closeIdx);
  src = src.slice(0, start) + updated + src.slice(end);
  stamped++;
}

console.log(`Approved in export: ${approved.length}`);
console.log(`  stamped verified:'sme'  ${stamped}`);
console.log(`  already stamped/official ${already}`);
console.log(`  not found               ${missing}`);
if (flagged.length) {
  console.log(`\nFlagged for manual attention (${flagged.length}) — NOT modified:`);
  for (const [id, d] of flagged) console.log(`  ${id}${d.note ? ` — ${d.note}` : ''}`);
}

if (dryRun) {
  console.log('\n--dry-run: no file written.');
} else if (stamped > 0) {
  fs.writeFileSync(dataPath, src);
  console.log(`\nWrote ${dataPath}. Review the diff, run tsc + the qbank test suite, then commit`);
  console.log('with the reviewer identity in the commit message for the provenance trail.');
} else {
  console.log('\nNothing to write.');
}
