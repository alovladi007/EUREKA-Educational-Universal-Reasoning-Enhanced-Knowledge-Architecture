'use client';

/**
 * The chapter prose renderer for AXIOM lesson bodies.
 *
 * WHY THIS EXISTS AND RichMath DOES NOT DO IT
 *
 * RichMath (components/Math.tsx) splits a string into text and math and hands
 * the text back as one `whitespace-pre-wrap` span. That is correct for a
 * question prompt, which is one or two lines. A lesson body is 250 words with
 * internal structure, and pre-wrapping it renders a wall: no paragraph rhythm,
 * no list, no heading, every line the same weight.
 *
 * THE DIALECT, MEASURED RATHER THAN ASSUMED
 *
 * Sampled across twelve lessons spanning every track (60,935 words, 240
 * steps), the authored bodies use exactly five constructs and nothing else -
 * no markdown emphasis, no `###`, no backticks:
 *
 *   prose paragraphs           572   blank-line separated
 *   run-in CAPS lead           457   "NORMALITY IS NOT AUTOMATIC — ..."
 *   numbered items             115   "1. SIGNED ARITHMETIC. You can ..."
 *   bullets                     13   lines opening with "•"
 *   math            everywhere       $inline$ and $$display$$
 *
 * The run-in CAPS lead is the dominant structural device and the reason the
 * old rendering read as undifferentiated grey: it was the author's subheading
 * and it was being set in the same weight and colour as the sentence after it.
 * Setting it as a run-in head is what turns these bodies back into a textbook.
 *
 * SPLITTING ON $ IS A SCAN, NOT A REGEX
 *
 * $ is also a dollar sign and \$ is an escaped one, so a regex matching $...$
 * across a paragraph will swallow the text between two unrelated dollars. The
 * scanner below walks the string once tracking whether it is inside math,
 * which is linear and cannot backtrack. (RichMath's regex is fine for prompts
 * and stays as it is; this is the long-form path.)
 *
 * KaTeX gets throwOnError: false so a bad expression renders visibly in red
 * rather than taking the chapter down.
 */

import katex from 'katex';
import { useMemo } from 'react';
import 'katex/dist/katex.min.css';

type Piece =
  | { kind: 'text'; value: string }
  | { kind: 'math'; value: string; display: boolean };

/** Walk the string once, splitting into text and math runs. */
export function splitMath(src: string): Piece[] {
  const out: Piece[] = [];
  let buf = '';
  let i = 0;

  const flush = () => {
    if (buf) out.push({ kind: 'text', value: buf });
    buf = '';
  };

  while (i < src.length) {
    const ch = src[i];

    // An escaped dollar is a literal dollar and never opens math.
    if (ch === '\\' && src[i + 1] === '$') {
      buf += '$';
      i += 2;
      continue;
    }

    if (ch === '$') {
      const display = src[i + 1] === '$';
      const open = display ? '$$' : '$';
      const from = i + open.length;
      let j = from;
      let found = -1;
      while (j < src.length) {
        if (src[j] === '\\') {
          j += 2;
          continue;
        }
        if (src.startsWith(open, j)) {
          found = j;
          break;
        }
        j += 1;
      }
      if (found === -1) {
        // No close. Treat the dollar as literal rather than eating the rest of
        // the paragraph, which is what an unanchored regex would do.
        buf += ch;
        i += 1;
        continue;
      }
      flush();
      out.push({ kind: 'math', value: src.slice(from, found), display });
      i = found + open.length;
      continue;
    }

    buf += ch;
    i += 1;
  }
  flush();
  return out;
}

function renderMath(tex: string, display: boolean): string {
  try {
    return katex.renderToString(tex, {
      throwOnError: false,
      displayMode: display,
      output: 'htmlAndMathml',
      strict: false,
    });
  } catch {
    return '';
  }
}

/** Inline run: math spans interleaved with plain text. */
function Run({ text }: { text: string }) {
  const pieces = useMemo(() => splitMath(text), [text]);
  return (
    <>
      {pieces.map((p, i) =>
        p.kind === 'text' ? (
          <span key={i}>{p.value}</span>
        ) : (
          <span
            key={i}
            className={p.display ? 'my-4 block overflow-x-auto text-center' : ''}
            // KaTeX sanitizes its own output; this is authored content, not
            // user-supplied markup.
            dangerouslySetInnerHTML={{ __html: renderMath(p.value, p.display) }}
          />
        ),
      )}
    </>
  );
}

/**
 * A run-in CAPS lead, if the text opens with one.
 *
 * The lead is all-caps letters, digits and light punctuation, at least three
 * characters, closed by a dash, a colon or a full stop. Requiring the closer
 * is what keeps a sentence merely opening with an acronym ("DM01 taught you
 * to...") from being mistaken for a heading: there is no separator after it,
 * so it does not match.
 *
 * The class holds dashes but never a full stop, so the match can span
 * "READING 1 — PART OF A WHOLE" as one head and can never run past the end of
 * a sentence. It is greedy for that reason - non-greedy stopped at the first
 * dash and captured only "READING 1", demoting the actual head into the body.
 */
const LEAD = /^([A-Z][A-Z0-9 ,'’()/+\-–—]{2,70})\s*(—|–|--|:|\.)\s+/;

function splitLead(text: string): {
  lead: string | null;
  sep: string;
  rest: string;
} {
  const m = LEAD.exec(text);
  if (!m) return { lead: null, sep: '', rest: text };
  // A "lead" with no letter pair (a bare number, say) is noise, not a head.
  if (!/[A-Z]{2}/.test(m[1])) return { lead: null, sep: '', rest: text };
  return { lead: m[1].trim(), sep: m[2], rest: text.slice(m[0].length) };
}

function LeadIn({ text }: { text: string }) {
  const { lead, sep, rest } = useMemo(() => splitLead(text), [text]);
  if (!lead) return <Run text={text} />;
  // The author's own separator is kept. Normalising it to a full stop
  // produced "FROM DM01. the conditional" - a capital-letter sentence opening
  // in lower case - because the source had written an em dash there.
  //
  // A full stop and a colon set tight against the head; a dash takes a space
  // on each side. Spacing them all alike gave "FROM DM01 : the conditional".
  const closer = sep === '--' ? '—' : sep;
  const tight = closer === '.' || closer === ':';
  return (
    <>
      <strong className="font-semibold tracking-wide text-foreground">
        {lead}
        {tight ? closer : ''}
      </strong>
      {tight ? ' ' : ` ${closer} `}
      <Run text={rest} />
    </>
  );
}

const P_CLASS = 'text-[15.5px] leading-[1.75] text-card-foreground';

/** One blank-line-separated block, already classified by the grouper. */
function Paragraph({ src }: { src: string }) {
  const pieces = useMemo(() => splitMath(src), [src]);

  // A paragraph that is nothing but one display equation is set as its own
  // centred block: a $$...$$ inside a <p> inherits the paragraph line height
  // and collides with the line above it.
  if (pieces.length === 1 && pieces[0].kind === 'math' && pieces[0].display) {
    const only = pieces[0];
    return (
      <div
        className="my-5 overflow-x-auto text-center"
        dangerouslySetInnerHTML={{ __html: renderMath(only.value, true) }}
      />
    );
  }

  return (
    <p className={P_CLASS}>
      <LeadIn text={src} />
    </p>
  );
}

function Bullets({ src }: { src: string }) {
  const items = src
    .split('\n')
    .map((l) => l.trim().replace(/^•\s*/, ''))
    .filter(Boolean);
  return (
    <ul className="my-3 space-y-1.5 pl-1">
      {items.map((item, i) => (
        <li key={i} className={`flex gap-2.5 ${P_CLASS}`}>
          <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
          <span className="min-w-0">
            <Run text={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * A consecutive run of "N. ..." paragraphs, as one ordered list.
 *
 * They are grouped before rendering because each item is its own blank-line
 * block in the source: rendered one at a time every item would be an <ol> of
 * length one and every one would restart at 1.
 */
function Numbered({ items }: { items: string[] }) {
  return (
    <ol className="my-3 space-y-2.5">
      {items.map((item, i) => {
        const body = item.replace(/^\d+[.)]\s*/, '');
        return (
          <li key={i} className="flex gap-3">
            <span className="mt-[0.15em] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/12 text-[11px] font-semibold tabular-nums text-brand-700 dark:text-brand-300">
              {i + 1}
            </span>
            <span className={`min-w-0 ${P_CLASS}`}>
              <LeadIn text={body} />
            </span>
          </li>
        );
      })}
    </ol>
  );
}

type Block =
  | { kind: 'para'; src: string }
  | { kind: 'bullets'; src: string }
  | { kind: 'numbered'; items: string[] };

/**
 * A second "N." inside the same paragraph.
 *
 * This is the difference between a list and a sentence that counts. Authors
 * write both: several consecutive paragraphs each opening "1." / "2." / "3."
 * is a list, but a single paragraph reading "1. 'Let x be arbitrary.' — binds
 * the forall. 2. 'Assume P(x).' — takes the hypothesis. 3. ..." is prose with
 * an enumeration running through it. Badging the second kind as a list of one
 * asserts a structure the author did not write.
 */
const INNER_ENUM = /\s\d+[.)]\s/;

function toBlocks(body: string): Block[] {
  const paras = body
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  const out: Block[] = [];
  for (const p of paras) {
    if (/^\d+[.)]\s/.test(p)) {
      const last = out[out.length - 1];
      if (last && last.kind === 'numbered') {
        last.items.push(p);
        continue;
      }
      // Opens a run. Whether it really is one is only known once the next
      // paragraph is seen, so it is provisionally a list and demoted below if
      // it stays alone and carries its own inline enumeration.
      out.push({ kind: 'numbered', items: [p] });
      continue;
    }
    if (p.startsWith('•')) {
      out.push({ kind: 'bullets', src: p });
      continue;
    }
    out.push({ kind: 'para', src: p });
  }

  return out.map((b) =>
    b.kind === 'numbered' && b.items.length === 1 && INNER_ENUM.test(b.items[0])
      ? ({ kind: 'para', src: b.items[0] } as Block)
      : b,
  );
}

export default function LessonProse({ body }: { body: string }) {
  const blocks = useMemo(() => toBlocks(body ?? ''), [body]);
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => {
        if (b.kind === 'numbered') return <Numbered key={i} items={b.items} />;
        if (b.kind === 'bullets') return <Bullets key={i} src={b.src} />;
        return <Paragraph key={i} src={b.src} />;
      })}
    </div>
  );
}
