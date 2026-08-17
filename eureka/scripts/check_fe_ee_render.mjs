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

// remark-math cannot carry a $$...$$ block across a newline. It mis-pairs the
// delimiters and hands KaTeX a span that starts mid-equation and runs past the
// closing $$ into the following prose, which renders as a visible red
// ParseError on the page.
//
// This gate could not see that, and the reason is worth keeping: mathSpans()
// pairs $$ using [\s\S]+?, which ALLOWS the newline the real parser forbids. So
// the checker built a span the application never builds, validated it, and
// reported success. Re-implementing a parser's delimiter rules instead of using
// them is how a gate ends up agreeing with itself. 111 blocks shipped this way
// in a single chapter and showed as 9 KaTeX errors on one rendered page.
//
// The depth checker missed it for a different reason: its stray-dollar mask
// matches a bare `$$` as an EMPTY inline span, erasing the evidence.
function delimiterDefects(md) {
  const hits = [];
  md.split('\n').forEach((line, i) => {
    const n = (line.match(/\$\$/g) || []).length;
    if (n % 2 === 1)
      hits.push(`display block does not open and close on one line (line ${i + 1}) — remark-math mis-pairs it: ${line.trim().slice(0, 78)}`);
  });
  return hits;
}

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
  // \| is \Vert, a DOUBLE bar. As a binary operator between two impedances it is
  // the correct parallel-combination symbol (R_E \| R_L) and must not be touched.
  // Wrapping a single short expression, it is a norm standing in for absolute value.
  if (/\\\|[^|$]{1,24}\\\|/.test(tex))
    hits.push('\\|x\\| sets a double-bar norm — use \\lvert x \\rvert for absolute value');
  // \Sigma / \Pi are Greek letters, not operators: no limit positioning, wrong spacing
  if (/\\(Sigma|Pi)\s*[_^]?\s*[({\\A-Za-z0-9]/.test(tex))
    hits.push('\\Sigma/\\Pi is a glyph, not an operator — use \\sum / \\prod so limits attach');
  // An operator with nothing to operate on. Limitless \sum G is ordinary engineering
  // shorthand and stays; \sum with an empty body is meaningless.
  if (/\\(sum|prod)\s*(\\right|\}|\)|\]|$)/.test(tex))
    hits.push('summation/product operator with no operand');
  // raw operator glyphs pasted into math carry no limits and inconsistent metrics
  const glyph = tex.match(/[Σ∏∮∫∑]/);
  if (glyph) hits.push(`raw operator glyph ${glyph[0]} in math — use the command form`);
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
    for (const hit of delimiterDefects(value)) {
      silent += 1;
      if (!quiet) console.log(`DELIM  ${file}: ${hit}`);
    }
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
