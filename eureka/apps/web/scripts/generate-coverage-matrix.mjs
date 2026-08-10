#!/usr/bin/env node
/**
 * Generate the published Patent Bar coverage matrix (WS3).
 *
 * Usage: node scripts/generate-coverage-matrix.mjs [--out <path>]
 *
 * Loads every Patent Bar bank (authored + WS3 gap-fill + 15 official USPTO
 * released sessions, Nov 1999 through Oct 2003),
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
const gapPct = loadTs(lib('patent-bar-gapfill-pct-data.ts'), { './patent-bar-qbank-data': qbank });
const gapPost = loadTs(lib('patent-bar-gapfill-postissuance-data.ts'), { './patent-bar-qbank-data': qbank });
const gapTopup = loadTs(lib('patent-bar-gapfill-topup-data.ts'), { './patent-bar-qbank-data': qbank });
const octAm = loadTs(lib('patent-bar-uspto-oct2003-data.ts'), { './patent-bar-qbank-data': qbank });
const octPm = loadTs(lib('patent-bar-uspto-oct2003-pm-data.ts'), { './patent-bar-qbank-data': qbank });
const aprAm = loadTs(lib('patent-bar-uspto-apr2003-data.ts'), { './patent-bar-qbank-data': qbank });
const aprPm = loadTs(lib('patent-bar-uspto-apr2003-pm-data.ts'), { './patent-bar-qbank-data': qbank });
const apr02Am = loadTs(lib('patent-bar-uspto-apr2002-data.ts'), { './patent-bar-qbank-data': qbank });
const apr02Pm = loadTs(lib('patent-bar-uspto-apr2002-pm-data.ts'), { './patent-bar-qbank-data': qbank });
const oct01Am = loadTs(lib('patent-bar-uspto-oct2001-data.ts'), { './patent-bar-qbank-data': qbank });
const oct01Pm = loadTs(lib('patent-bar-uspto-oct2001-pm-data.ts'), { './patent-bar-qbank-data': qbank });
const apr01Am = loadTs(lib('patent-bar-uspto-apr2001-data.ts'), { './patent-bar-qbank-data': qbank });
const apr01Pm = loadTs(lib('patent-bar-uspto-apr2001-pm-data.ts'), { './patent-bar-qbank-data': qbank });
const oct00Am = loadTs(lib('patent-bar-uspto-oct2000-data.ts'), { './patent-bar-qbank-data': qbank });
const oct00Pm = loadTs(lib('patent-bar-uspto-oct2000-pm-data.ts'), { './patent-bar-qbank-data': qbank });
const apr00Am = loadTs(lib('patent-bar-uspto-apr2000-data.ts'), { './patent-bar-qbank-data': qbank });
const apr00Pm = loadTs(lib('patent-bar-uspto-apr2000-pm-data.ts'), { './patent-bar-qbank-data': qbank });
const nov99Am = loadTs(lib('patent-bar-uspto-nov1999-data.ts'), { './patent-bar-qbank-data': qbank });
const nov99Pm = loadTs(lib('patent-bar-uspto-nov1999-pm-data.ts'), { './patent-bar-qbank-data': qbank });
const coverage = loadTs(lib('patent-bar-coverage.ts'), { './patent-bar-qbank-data': qbank });

const all = [
  ...qbank.PATENT_BAR_QUESTIONS,
  ...gapEthics.PATENT_BAR_GAPFILL_ETHICS,
  ...gapDesign.PATENT_BAR_GAPFILL_DESIGN,
  ...gapPct.PATENT_BAR_GAPFILL_PCT,
  ...gapPost.PATENT_BAR_GAPFILL_POST_ISSUANCE,
  ...gapTopup.PATENT_BAR_GAPFILL_TOPUP,
  ...octAm.USPTO_OCT2003_AM_QUESTIONS,
  ...octPm.USPTO_OCT2003_PM_QUESTIONS,
  ...aprAm.USPTO_APR2003_AM_QUESTIONS,
  ...aprPm.USPTO_APR2003_PM_QUESTIONS,
  ...apr02Am.USPTO_APR2002_AM_QUESTIONS,
  ...apr02Pm.USPTO_APR2002_PM_QUESTIONS,
  ...oct01Am.USPTO_OCT2001_AM_QUESTIONS,
  ...oct01Pm.USPTO_OCT2001_PM_QUESTIONS,
  ...apr01Am.USPTO_APR2001_AM_QUESTIONS,
  ...apr01Pm.USPTO_APR2001_PM_QUESTIONS,
  ...oct00Am.USPTO_OCT2000_AM_QUESTIONS,
  ...oct00Pm.USPTO_OCT2000_PM_QUESTIONS,
  ...apr00Am.USPTO_APR2000_AM_QUESTIONS,
  ...apr00Pm.USPTO_APR2000_PM_QUESTIONS,
  ...nov99Am.USPTO_NOV1999_AM_QUESTIONS,
  ...nov99Pm.USPTO_NOV1999_PM_QUESTIONS,
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
lines.push('## About these weights');
lines.push('');
lines.push('**The USPTO publishes no topic breakdown for the registration examination.** Its');
lines.push('[source-material list](https://www.uspto.gov/sites/default/files/documents/registrationexamsourcematerial.pdf)');
lines.push('names what is tested — MPEP Ninth Ed. Rev. 01.2024; the PTAB Consolidated Trial');
lines.push('Practice Guide (Nov 2019); the 2013 rule creating the 37 CFR Part 11 conduct rules;');
lines.push('the Global/IP5 PPH programs — but never in what proportion. Any percentage');
lines.push('blueprint for this exam is an **estimate**, including ours.');
lines.push('');
lines.push(`The weights below are measured from the ${totalOfficial} official released-exam questions in`);
lines.push('this bank. Two limits, stated rather than hidden: the topic labels are our own');
lines.push('classification, and every released exam predates 2004 — so ethics, post-issuance');
lines.push('and international practice are near-certainly under-weighted against today\'s exam,');
lines.push('and are treated as floors rather than targets. Full provenance:');
lines.push('`apps/web/src/lib/patent-bar-coverage.ts`.');
lines.push('');
lines.push('"Share" is the section\'s portion of the whole bank; the WS3 floor requires');
lines.push('share ≥ weight. Sections flagged ❌ are ones where the AUTHORED content is');
lines.push('mis-weighted — it was generated to the superseded blueprint — not ones where the');
lines.push('official pool is short. A scored mock draws only official items and currently hits');
lines.push('every section target exactly.');
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
lines.push('- Official items come from sixteen USPTO released sessions — eight exam dates');
lines.push('  (Nov 1999, Apr 2000, Oct 2000, Apr 2001, Oct 2001, Apr 2002, Apr 2003, Oct 2003),');
lines.push('  morning and afternoon each —');
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
