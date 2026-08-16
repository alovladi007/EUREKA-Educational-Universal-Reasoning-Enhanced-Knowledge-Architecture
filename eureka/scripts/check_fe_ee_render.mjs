/**
 * Render-check every FE EE chapter the way the study page actually renders it.
 *
 * The depth, arithmetic and tsc gates all pass on math that is numerically
 * correct and visually broken. Three separate chapters shipped defects of
 * exactly that kind: `\int _{-}\infty ^\infty` (lone minus as the lower limit,
 * both infinities floating), `a_(n-1)` (paren instead of brace, so the
 * subscript is just an open paren), a bare Latin `x` used as a multiplication
 * sign (KaTeX sets it as an italic variable), and the English words "or"/"at"
 * left inside math mode (set as italic products of single letters).
 *
 * KaTeX accepts every one of those without complaint, so this script does two
 * passes:
 *   1. hard errors  -- render each span with throwOnError, catching failures
 *   2. silent defects -- pattern checks for the shapes above
 *
 * Chapter content is recovered by evaluating the `content:` template literal
 * itself, so what is checked is byte-identical to what the component receives.
 *
 * Usage: node eureka/scripts/check_fe_ee_render.mjs [--quiet]
 * Exit status 1 if any hard error or silent defect is found.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire('/Users/vladimirantoine/Desktop/EUREKA/eureka/node_modules/');
const katex = require('katex');

const DIR = 'eureka/apps/web/src/lib/fe-ee-sections';
const quiet = process.argv.includes('--quiet');

/** Pull every `content:` template literal out of a section file, unescaped. */
function extractContents(src) {
  const out = [];
  const marker = 'content: `';
  let i = 0;
  while ((i = src.indexOf(marker, i)) !== -1) {
    let j = i + marker.length;
    let raw = '';
    for (;;) {
      const ch = src[j];
      if (ch === undefined) break;
      if (ch === '\\') { raw += src[j] + src[j + 1]; j += 2; continue; }
      if (ch === '`') break;
      raw += ch;
      j += 1;
    }
    // No `${` survives our lint, so evaluating the literal is faithful and safe.
    let value;
    try {
      value = eval('`' + raw + '`');
    } catch {
      value = raw;
    }
    out.push({ value, offset: i });
    i = j + 1;
  }
  return out;
}

/** Math spans, in source order: $$display$$ first, then $inline$. */
function mathSpans(md) {
  const spans = [];
  const display = /\$\$([\s\S]+?)\$\$/g;
  let m;
  const masked = md.replace(display, (full, body, idx) => {
    spans.push({ tex: body, display: true, index: idx });
    return ' '.repeat(full.length);
  });
  const inline = /\$([^$\n]+)\$/g;
  while ((m = inline.exec(masked)) !== null) {
    spans.push({ tex: m[1], display: false, index: m.index });
  }
  return spans;
}

// Prose left inside math mode. KaTeX sets each letter as its own italic
// variable, so "or" renders as o times r. Single letters are excluded because
// a, b, n and x are ordinary variables; only multi-letter English words that
// stand alone between spaces are reported, which is the shape the real defects
// took ("$\tfrac{1}{2} or 2$", "$500\ \mathrm{W} at 2\theta$", "$10^{-4} to 10^{4}$").
const PROSE_WORDS =
  /(?<=^|[\s(){}])(to|or|and|per|with|where|when|then|the|each|from|into|than|about)(?=[\s(){},.]|$)/g;

function silentDefects(tex) {
  const hits = [];
  // subscript/superscript opened with a paren instead of a brace: a_(n-1)
  if (/[_^]\s*\(/.test(tex)) hits.push('paren subscript/superscript — only the paren is set as the script');
  // a lone sign parked in a limit slot, leaving the real limit floating
  // only a SUBSCRIPT holding a bare sign directly before infinity/a number is the
  // floating-limit defect; N_D^{+} and similar ionized-species notation is fine
  if (/_\{\s*[-+]\s*\}\s*(\\infty|\d)/.test(tex)) hits.push('limit is a bare sign — the actual limit floats free');
  // tilde is a non-breaking space in math, not "approximately" or "not"
  if (/(?<!\\)~/.test(tex)) hits.push('~ is a non-breaking space in math mode, not "approx" or "not"');
  // bare Latin x between two numbers is a variable, not a multiplication sign
  if (/(?<=[\d})])\s*x\s*(?=\d)/.test(tex)) hits.push('bare Latin x between numbers — set as an italic variable');
  // strip commands and text-mode groups, then look for English left behind
  const bare = tex
    .replace(/\\(text|mathrm|mathbf|operatorname|mathit|textbf|textit)\s*\{[^{}]*\}/g, ' ')
    .replace(/\\[a-zA-Z]+/g, ' ');
  const words = bare.match(PROSE_WORDS);
  if (words) hits.push(`English word(s) in math mode: ${[...new Set(words)].join(', ')}`);
  return hits;
}

let hardErrors = 0;
let silent = 0;
let spansChecked = 0;
let chapters = 0;

for (const file of readdirSync(DIR).filter((f) => f.endsWith('.ts')).sort()) {
  const src = readFileSync(path.join(DIR, file), 'utf8');
  for (const { value } of extractContents(src)) {
    chapters += 1;
    for (const span of mathSpans(value)) {
      spansChecked += 1;
      try {
        katex.renderToString(span.tex, { displayMode: span.display, throwOnError: true });
      } catch (err) {
        hardErrors += 1;
        if (!quiet) console.log(`KATEX  ${file}: ${err.message.split('\n')[0]}\n       ${span.tex.slice(0, 110)}`);
      }
      for (const hit of silentDefects(span.tex)) {
        silent += 1;
        if (!quiet) console.log(`SILENT ${file}: ${hit}\n       ${span.tex.slice(0, 110)}`);
      }
    }
  }
}

console.log(
  `\n${chapters} content blocks, ${spansChecked} math spans checked — ` +
    `${hardErrors} KaTeX errors, ${silent} silent render defects`
);
process.exit(hardErrors + silent > 0 ? 1 : 0);
