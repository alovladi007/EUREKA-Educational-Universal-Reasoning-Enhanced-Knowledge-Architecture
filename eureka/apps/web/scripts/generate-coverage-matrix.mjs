#!/usr/bin/env node
/**
 * Generate the published Patent Bar coverage matrix (WS3).
 *
 * Usage: node scripts/generate-coverage-matrix.mjs [--out <path>]
 *
 * Loads all six Patent Bar banks (authored + WS3 gap-fill + 4 official USPTO sessions),
 * computes per-blueprint-section coverage via src/lib/patent-bar-coverage.ts
 * (the same module the in-app Coverage card uses), and writes the matrix to
 * docs/monetization/PATENT_BAR_COVERAGE_MATRIX.md. Re-run after any bank
 * change and commit the diff.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ts = require(require.resolve('typescript', { paths: [process.cwd()] }));

function loadTs(file, extraModules = {}) {
  const src = fs.readFileSync(file, 'utf8');
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const mod = { exports: {} };
  const localRequire = (name) => {
    if (extraModules[name]) return extraModules[name];
    return require(name);
  };
  new Function('exports', 'module', 'require', js)(mod.exports, mod, localRequire);
  return mod.exports;
}

const lib = (f) => path.join('src', 'lib', f);
const qbank = loadTs(lib('patent-bar-qbank-data.ts'));
const gapEthics = loadTs(lib('patent-bar-gapfill-ethics-data.ts'), { './patent-bar-qbank-data': qbank });
const gapDesign = loadTs(lib('patent-bar-gapfill-design-data.ts'), { './patent-bar-qbank-data': qbank });
const octAm = loadTs(lib('patent-bar-uspto-oct2003-data.ts'), { './patent-bar-qbank-data': qbank });
const octPm = loadTs(lib('patent-bar-uspto-oct2003-pm-data.ts'), { './patent-bar-qbank-data': qbank });
const aprAm = loadTs(lib('patent-bar-uspto-apr2003-data.ts'), { './patent-bar-qbank-data': qbank });
const aprPm = loadTs(lib('patent-bar-uspto-apr2003-pm-data.ts'), { './patent-bar-qbank-data': qbank });
const coverage = loadTs(lib('patent-bar-coverage.ts'), { './patent-bar-qbank-data': qbank });

const all = [
  ...qbank.PATENT_BAR_QUESTIONS,
  ...gapEthics.PATENT_BAR_GAPFILL_ETHICS,
  ...gapDesign.PATENT_BAR_GAPFILL_DESIGN,
  ...octAm.USPTO_OCT2003_AM_QUESTIONS,
  ...octPm.USPTO_OCT2003_PM_QUESTIONS,
  ...aprAm.USPTO_APR2003_AM_QUESTIONS,
  ...aprPm.USPTO_APR2003_PM_QUESTIONS,
];

const { rows, bankTotal } = coverage.computePatentBarCoverage(all);

const outFlag = process.argv.indexOf('--out');
const outPath = outFlag >= 0
  ? process.argv[outFlag + 1]
  : path.join('..', '..', 'docs', 'monetization', 'PATENT_BAR_COVERAGE_MATRIX.md');

const totalOfficial = rows.reduce((n, r) => n + r.official, 0);
const totalSme = rows.reduce((n, r) => n + r.sme, 0);
const totalUnverified = rows.reduce((n, r) => n + r.unverified, 0);

const lines = [];
lines.push('# Patent Bar — Blueprint Coverage Matrix (WS3)');
lines.push('');
lines.push('> GENERATED — do not edit by hand. Re-run `node scripts/generate-coverage-matrix.mjs`');
lines.push('> (from `apps/web/`) after any Patent Bar bank change and commit the diff.');
lines.push('');
lines.push(`Bank total: **${bankTotal}** questions — ${totalOfficial} official (USPTO released exams), ` +
  `${totalSme} SME-verified, ${totalUnverified} unverified (AI-authored, pending review).`);
lines.push('');
lines.push('Blueprint: exam-config.ts PATENT_BAR (100-question form). "Share" is the section\'s');
lines.push('portion of the whole bank; the WS3 floor requires share ≥ blueprint weight.');
lines.push('');
lines.push('| Section | Weight | Bank Qs | Share | Official | SME | Unverified | Meets weight |');
lines.push('|---|---:|---:|---:|---:|---:|---:|:---:|');
for (const r of rows) {
  lines.push(`| ${r.name} | ${r.weightPct}% | ${r.total} | ${r.sharePct}% | ${r.official} | ${r.sme} | ${r.unverified} | ${r.meetsWeight ? '✅' : '❌'} |`);
}
lines.push('');
const failing = rows.filter((r) => !r.meetsWeight);
if (failing.length) {
  lines.push(`**Gaps:** ${failing.map((r) => `${r.name} (${r.sharePct}% vs ${r.weightPct}% weight)`).join('; ')}. ` +
    'Filling these to the blueprint floor is the WS3 authoring backlog.');
} else {
  lines.push('**No section falls below its blueprint weight.**');
}
lines.push('');
lines.push('Notes:');
lines.push('- Official items come from the USPTO Oct 2003 + Apr 2003 released exams (both sessions),');
lines.push('  graded against the USPTO model answers (public domain; provenance in each data file).');
lines.push('- "SME-verified" counts only items stamped via scripts/apply-sme-reviews.mjs from a');
lines.push('  reviewed export — zero until an expert actually reviews.');
lines.push('- Scored mocks (WS4) must draw only official/SME items.');
lines.push('');

fs.writeFileSync(outPath, lines.join('\n'));
console.log(`Wrote ${outPath}`);
console.log(`Bank ${bankTotal} | official ${totalOfficial} | sme ${totalSme} | unverified ${totalUnverified}`);
for (const r of rows) {
  console.log(`  ${r.meetsWeight ? 'OK ' : 'GAP'} ${r.name}: ${r.total} (${r.sharePct}% vs ${r.weightPct}%)`);
}
