#!/usr/bin/env node
/**
 * Audit a released USPTO registration-exam answer file — and, optionally, the
 * transcribed data file built from it.
 *
 * WHY THIS EXISTS. The manual version of this check produced a CONFIDENT WRONG
 * ANSWER three times across the ingestion sessions, each time silently:
 *
 *   1. Oct 2000 — the discard phrase is capitalised ("All Answers accepted"),
 *      so a case-sensitive grep reported "no discards". Three questions the
 *      USPTO had thrown out were within one step of being ingested as
 *      scoreable.
 *   2. Nov 1999 — the discard phrase has an inserted word ("All answers ARE
 *      accepted"), which defeats `all +answers +accepted` outright. Reported
 *      "no discards" for a session that has two.
 *   3. Apr 2000 PM — Q50 is keyed to THREE options ("(A),(B), or (E)") with no
 *      "accepted"/"both"/"either" wording, so a prose-based dual-key sweep read
 *      it as a plain "(A)" and would have dropped two correct answers.
 *
 * Every one of those failures returned a clean-looking result rather than an
 * error. The lesson is not "write a better grep next time" — it is that this
 * check must be mechanical and must print the matched LINES, never just counts.
 *
 * Usage:
 *   node scripts/audit-uspto-ingest.mjs <answers.txt> [options]
 *
 *   --data <file.ts>    Also diff every key against a transcribed data file,
 *                       and check option counts, topicId range and the
 *                       "OFFICIAL USPTO MODEL ANSWER" explanation prefix.
 *   --prefix <id>       Item id prefix in the data file (e.g. uspto-nov99-am).
 *                       Inferred from the data filename when omitted.
 *   --max <n>           Highest question number (default 50).
 *   --split-second      For a combined AM+PM answer PDF (Oct 2001's
 *                       edo0110apa.pdf holds both), audit only the text after
 *                       the SECOND "1. ANSWER" line — i.e. the PM session.
 *
 * Exit code is non-zero if anything needs a human decision, so this can gate CI.
 */

import fs from 'node:fs';

// ---------------------------------------------------------------------------
// Patterns. Each one is deliberately wider than the case that broke it.
// ---------------------------------------------------------------------------

/** Trap 0: case AND wording both vary. Never narrow this. */
const DISCARD = /all\s+answers?\s+(?:are\s+|were\s+|will\s+be\s+)?accepted/i;

/**
 * Start of an answer entry.
 *
 * Trap 3: the period after the number is OPTIONAL (Nov 1999 AM Q13 reads
 * "13 ANSWER: (A)."), the ANSWER token is optional (Apr 2001 PM Q23 reads
 * "23. (A) is the correct answer."), the token is sometimes PLURAL (Nov 1999
 * AM Q49 reads "49. ANSWERS: (A) and (B)."), and some lines pad with spaces.
 *
 * But making the period optional unconditionally is too loose: it turns the
 * citation "37 CFR § 10.38(a)" into "question 37" and "35 U.S.C. § 112" into
 * "question 35". So a no-period line is accepted ONLY when it carries an
 * explicit ANSWER/ANSWERS token. Enforced in code below.
 */
const ENTRY = /^[ \t]*(\d{1,2})(\.)?[ \t]+(ANSWERS?)?[:.]?[ \t]*(.*)$/gm;

/**
 * Locating the key: POSITIONAL, not phrase-based.
 *
 * The released papers introduce the key with at least these lead-ins, and
 * enumerating them is a losing game — this list grew every single time a new
 * exam was audited:
 *   "(D)."                              "The model answer is choice (E)."
 *   "The correct answer is (D)."        "The most correct response is (D)."
 *   "The best answer is (C)."           "The correct response is (E)."
 *   "Answer (A) is t he best answer"    <- pdftotext split "the"
 *   "The correction answer is (B)."     <- typo in the original paper
 *   "Statement (E) is false"            "(A) is the correct answer."
 *
 * What every one of them has in common: the key is the FIRST parenthesised
 * (A)-(E) on the line, and it appears BEFORE any citation. So take that, and
 * reject the line if a citation marker comes first (which means the line is
 * prose, not an answer entry).
 *
 * Inner whitespace is tolerated — pdftotext emits "(C )" in places.
 * Only parenthesised letters count. A bare letter would let "CFR" and
 * "ANSWERS" masquerade as keys — both of which happened, and both produced
 * results that looked right by coincidence.
 */
const FIRST_KEY = /\(\s*([A-E])\s*\)/;
const CITATION = /§|U\.?S\.?C\.?|C\.?F\.?R\.?|MPEP/;

/**
 * Trap 5: the key region is the LEADING run of (A)-(E) tokens joined by
 * comma/and/or/slash.
 *
 * A key letter must be PARENTHESISED — "(A)" — or a standalone token not
 * followed by another letter. Without that guard the bare-letter branch reads
 * the "C" of "CFR" and the "A" of "ANSWERS" as keys; both produced silently
 * plausible results here because they happened to match the true answer.
 *
 * The run stops at a sentence break, which is what keeps statute subsections
 * ("35 U.S.C. § 102(b) and (e)") from being misread as additional keys.
 */
const KEY_RUN = /^\(\s*([A-E])\s*\)((?:\s*(?:,|and|or|\/)\s*\(\s*[A-E]\s*\))*)/;
const KEY_MORE = /\(\s*([A-E])\s*\)/g;

// ---------------------------------------------------------------------------

const argv = process.argv.slice(2);
if (!argv.length || argv[0].startsWith('--')) {
  console.error('usage: node scripts/audit-uspto-ingest.mjs <answers.txt> [--data f.ts] [--prefix id] [--max n] [--split-second]');
  process.exit(2);
}
const opt = (name, fallback = null) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : fallback;
};
const answersPath = argv[0];
const dataPath = opt('--data');
const MAX = Number(opt('--max', '50'));
const splitSecond = argv.includes('--split-second');

let text = fs.readFileSync(answersPath, 'utf8');
{
  // Trap 1: Oct 2001 ships BOTH sessions in one PDF. If any question in the
  // first session fails to parse, the second session's entry for that number
  // silently fills the slot — which is how AM Q8/Q19 were reported with the
  // PM keys. Bound the scan structurally so that can never happen: by default
  // read only up to the second "1. ANSWER"; with --split-second, only after it.
  const starts = [...text.matchAll(/^[ \t]*1\.?[ \t]+ANSWERS?\b/gm)].map((m) => m.index);
  if (starts.length > 1 && !splitSecond) {
    text = text.slice(0, starts[1]);
    console.log('note: combined-session file detected — auditing the FIRST session only (use --split-second for the other).');
  }
}
if (splitSecond) {
  // Second "1. ANSWER" begins the PM session in a combined file.
  const starts = [...text.matchAll(/^[ \t]*1\.?[ \t]+ANSWER/gm)].map((m) => m.index);
  if (starts.length < 2) {
    console.error('--split-second: could not find a SECOND "1. ANSWER" line; refusing to guess.');
    process.exit(2);
  }
  text = text.slice(starts[1]);
}

// ---------------------------------------------------------------------------
// Parse the answer file.
// ---------------------------------------------------------------------------

const keys = new Map();     // n -> primary key letter
const alternates = new Map(); // n -> [extra accepted letters]
const discards = [];        // { n, line }
const anomalies = [];       // { n, kind, line }
const seen = new Set();

for (const m of text.matchAll(ENTRY)) {
  const n = Number(m[1]);
  const hasPeriod = Boolean(m[2]);
  const answerTok = m[3];
  const rest = (m[4] ?? '').trim();
  if (!Number.isInteger(n) || n < 1 || n > MAX || seen.has(n)) continue;
  // A no-period line is an answer entry ONLY with an explicit ANSWER token,
  // otherwise "37 CFR § 10.38(a)" reads as question 37.
  if (!hasPeriod && !answerTok) continue;

  if (DISCARD.test(rest)) {
    seen.add(n);
    discards.push({ n, line: m[0].trim() });
    continue;
  }

  const at = rest.search(FIRST_KEY);
  if (at < 0) continue;                                   // no key on this line
  if (CITATION.test(rest.slice(0, at))) continue;         // prose citation, not an entry
  const km = KEY_RUN.exec(rest.slice(at));
  if (!km) continue;
  seen.add(n);
  keys.set(n, km[1]);

  const tail = km[2];
  if (tail && tail.trim()) {
    const extra = [...tail.matchAll(KEY_MORE)].map((x) => x[1]).filter(Boolean);
    if (extra.length) alternates.set(n, extra);
  }
  // Trap 3 bookkeeping: make the format variants VISIBLE rather than silent.
  if (!hasPeriod) anomalies.push({ n, kind: 'no period after number', line: m[0].trim() });
  if (!answerTok) anomalies.push({ n, kind: 'no ANSWER token', line: m[0].trim() });
  else if (/^ANSWERS$/i.test(answerTok)) anomalies.push({ n, kind: 'plural "ANSWERS" token (often signals a multi-key)', line: m[0].trim() });
}

const missing = [];
for (let n = 1; n <= MAX; n++) if (!seen.has(n)) missing.push(n);

// ---------------------------------------------------------------------------
// Report.
// ---------------------------------------------------------------------------

const L = (s = '') => console.log(s);
let problems = 0;

L(`\n=== USPTO ingest audit — ${answersPath}${splitSecond ? ' (second session)' : ''} ===`);
L(`scoreable: ${keys.size}   discarded: ${discards.length}   expected total: ${MAX}`);

L(`\n-- DISCARDS (trap 0: case AND wording vary — read the lines, not the count) --`);
if (!discards.length) L('  none');
for (const d of discards) L(`  Q${d.n}: ${d.line}`);

L(`\n-- MULTI-KEYED (trap 5: not always worded "accepted") --`);
if (!alternates.size) L('  none');
for (const [n, extra] of [...alternates].sort((a, b) => a[0] - b[0])) {
  L(`  Q${n}: primary (${keys.get(n)}), ALSO accepted ${extra.map((e) => `(${e})`).join(', ')}`);
  L(`        -> key to (${keys.get(n)}) and state the alternates in the explanation; never drop them.`);
  // Needs a decision only while transcribing. With --data the disclosure check
  // below is the real gate, so don't double-count a correctly handled item.
  if (!dataPath) problems++;
}

L(`\n-- FORMAT ANOMALIES (trap 3) --`);
if (!anomalies.length) L('  none');
for (const a of anomalies) L(`  Q${a.n}: ${a.kind} — ${a.line}`);

if (missing.length) {
  L(`\n!! UNPARSED QUESTION NUMBERS: ${missing.join(', ')}`);
  L('   Every number 1..MAX must be either keyed or discarded. Investigate before transcribing.');
  problems += missing.length;
} else {
  L(`\nall ${MAX} question numbers accounted for (keyed or discarded)`);
}

L(`\nKEYS: ${[...keys].sort((a, b) => a[0] - b[0]).map(([n, k]) => `${n}${k}`).join(' ')}`);

// ---------------------------------------------------------------------------
// Optional: verify a transcribed data file against those keys.
// ---------------------------------------------------------------------------

if (dataPath) {
  const src = fs.readFileSync(dataPath, 'utf8');
  const prefix = opt('--prefix') ?? (src.match(/id:\s*'([a-z0-9-]+?)-\d\d'/) ?? [])[1];
  if (!prefix) {
    console.error('\n--data given but the item id prefix could not be inferred; pass --prefix.');
    process.exit(2);
  }
  L(`\n=== data file check — ${dataPath} (prefix ${prefix}) ===`);

  const blocks = src.split(new RegExp(`id: '${prefix}-(\\d\\d)'`));
  const mine = new Map();
  const badOpts = [];
  const badTopic = [];
  const badExpl = [];
  for (let i = 1; i < blocks.length; i += 2) {
    const n = Number(blocks[i]);
    const body = blocks[i + 1];
    const c = /correct:\s*(\d)/.exec(body);
    if (c) mine.set(n, 'ABCDE'[Number(c[1])]);
    const om = /options:\s*\[([\s\S]*?)correct:/.exec(body);
    const count = om ? (om[1].match(/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g) ?? []).length : -1;
    if (count !== 5) badOpts.push(`Q${n} has ${count} options`);
    const t = /topicId:\s*(\d+)/.exec(body);
    if (!t || Number(t[1]) < 0 || Number(t[1]) > 7) badTopic.push(`Q${n} topicId ${t ? t[1] : 'missing'}`);
    if (!/OFFICIAL USPTO MODEL ANSWER/.test(body)) badExpl.push(`Q${n}`);
  }

  const mismatches = [];
  for (const [n, k] of mine) if (keys.get(n) !== k) mismatches.push(`Q${n}: official ${keys.get(n) ?? '—'} vs data ${k}`);
  const ingestedDiscards = discards.filter((d) => mine.has(d.n)).map((d) => `Q${d.n}`);
  const notTranscribed = [...keys.keys()].filter((n) => !mine.has(n));

  const check = (label, list, fatal = true) => {
    L(`  ${list.length ? '!!' : 'ok'} ${label}: ${list.length ? list.join('; ') : 'none'}`);
    if (fatal) problems += list.length;
  };
  L(`  transcribed items: ${mine.size} (expected ${keys.size})`);
  check('KEY MISMATCHES vs the USPTO model answers', mismatches);
  check('DISCARDED questions present in the data file', ingestedDiscards);
  check('scoreable questions missing from the data file', notTranscribed);
  check('items without exactly 5 options', badOpts);
  check('items with topicId outside 0-7 (these fall out of the mock pool)', badTopic);
  check('items missing the OFFICIAL USPTO MODEL ANSWER prefix', badExpl);

  for (const [n] of alternates) {
    if (!mine.has(n)) continue;
    const body = src.split(new RegExp(`id: '${prefix}-${String(n).padStart(2, '0')}'`))[1] ?? '';
    const extra = alternates.get(n) ?? [];
    const namesAll = extra.every((e) => body.includes(`(${e})`));
    const discloses = namesAll && /accept/i.test(body);
    L(`  ${discloses ? 'ok' : '!!'} Q${n} is multi-keyed — explanation ${discloses ? 'discloses' : 'DOES NOT DISCLOSE'} the alternates`);
    if (!discloses) problems++;
  }
}

L(`\n${problems ? `${problems} item(s) need a human decision.` : 'clean — nothing needs a human decision.'}\n`);
process.exit(problems ? 1 : 0);
