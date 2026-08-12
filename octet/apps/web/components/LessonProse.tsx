'use client';

/**
 * The chapter prose renderer.
 *
 * WHY THIS AND NOT react-markdown
 *
 * The chapter bodies are authored in this repository, in
 * app/data/extras_*.py, so the markdown dialect in them is not arbitrary
 * input - it is a dialect we define and a depth gate enforces. It is exactly
 * seven things: blank-line-separated paragraphs, `### 1.1 Subheading` lines,
 * blocks of `- ` bullet items, **bold**, `code`, $inline math$ and
 * $$display math$$. Tables and figures never appear in the prose; they arrive
 * as structured data on the section, so there is no table parser here and no
 * image handling.
 *
 * Subheadings and bullets exist because the prep test chapters this reader is
 * matched to are written with 1.1/1.2 subsections and example lists, and a
 * chapter that cannot be structured that way flattens into undifferentiated
 * paragraphs.
 *
 * Pulling in react-markdown, remark-gfm, remark-math and rehype-katex to
 * render five constructs would add four dependencies and a markdown AST to an
 * image that has to be rebuilt to pick any of it up, in exchange for parsing
 * syntax the content never uses. This file is the whole feature and it is
 * covered by a test that renders every authored chapter.
 *
 * SPLITTING ON $ IS NOT A REGEX JOB
 *
 * It is a scan, because $ is also a dollar sign, \$ is an escaped one, and a
 * regex that matches $...$ across a paragraph will happily swallow the text
 * between two unrelated dollars. The scanner below walks the string once and
 * tracks whether it is inside math, which is linear and cannot backtrack.
 *
 * KaTeX gets throwOnError: false so a bad expression renders in red rather
 * than taking down the page, and the depth gate separately fails the build on
 * any expression KaTeX cannot parse - so a broken formula is caught at author
 * time rather than left to degrade quietly in front of a learner.
 */

import katex from 'katex';
import { useMemo } from 'react';
import 'katex/contrib/mhchem';
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
      // Find the matching close, skipping escaped dollars inside.
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
        // No close. Treat the dollar as a literal rather than eating the rest
        // of the paragraph, which is what an unanchored regex would do.
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
      output: 'html',
      strict: false,
    });
  } catch {
    return '';
  }
}

/** **bold** and `code` inside one text run. Everything else is literal. */
function Inline({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) {
      parts.push(
        <strong key={key++} className="font-semibold text-foreground">
          {tok.slice(2, -2)}
        </strong>,
      );
    } else {
      parts.push(
        <code
          key={key++}
          className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]"
        >
          {tok.slice(1, -1)}
        </code>,
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function Block({ src }: { src: string }) {
  // A block whose every line starts with "- " is a bullet list. Detected
  // before math splitting so a "-" inside an item is never misread.
  const isList = useMemo(
    () => src.split('\n').every((l) => l.trim().startsWith('- ')),
    [src],
  );
  // A "### " block is a subheading: the 1.1 / 1.2 layer inside a numbered
  // section, matching the prep test chapter typography.
  const isSubhead = src.startsWith('### ');

  const pieces = useMemo(() => splitMath(src), [src]);

  if (isSubhead) {
    return (
      <h4 className="mb-1 mt-5 text-[15px] font-semibold text-foreground">
        <Inline text={src.slice(4)} />
      </h4>
    );
  }

  if (isList) {
    const items = src
      .split('\n')
      .map((l) => l.trim().replace(/^- /, ''))
      .filter(Boolean);
    return (
      <ul className="my-3 list-disc space-y-1.5 pl-5">
        {items.map((item, i) => (
          <li key={i} className="text-[15px] leading-7 text-card-foreground">
            {splitMath(item).map((p, j) =>
              p.kind === 'text' ? (
                <Inline key={j} text={p.value} />
              ) : (
                <span
                  key={j}
                  dangerouslySetInnerHTML={{
                    __html: renderMath(p.value, false),
                  }}
                />
              ),
            )}
          </li>
        ))}
      </ul>
    );
  }

  // A paragraph that is nothing but one display equation is set as its own
  // centred block rather than wrapped in body text, because a displayed
  // equation inside a <p> inherits the paragraph's line height and collides
  // with the line above it.
  const soleDisplay =
    pieces.length === 1 && pieces[0].kind === 'math' && pieces[0].display;
  if (soleDisplay && pieces[0].kind === 'math') {
    return (
      <div
        className="my-5 overflow-x-auto text-center"
        dangerouslySetInnerHTML={{
          __html: renderMath(pieces[0].value, true),
        }}
      />
    );
  }

  return (
    <p className="text-[15.5px] leading-[1.75] text-card-foreground">
      {pieces.map((p, i) =>
        p.kind === 'text' ? (
          <Inline key={i} text={p.value} />
        ) : (
          <span
            key={i}
            className={p.display ? 'block my-4 overflow-x-auto text-center' : ''}
            dangerouslySetInnerHTML={{ __html: renderMath(p.value, p.display) }}
          />
        ),
      )}
    </p>
  );
}

export default function LessonProse({ body }: { body: string }) {
  // Paragraphs are blank-line separated. Trailing whitespace on a line is not
  // significant here, so it is stripped before splitting rather than being
  // allowed to produce empty paragraphs.
  const paras = useMemo(
    () =>
      body
        .split(/\n\s*\n/)
        .map((s) => s.trim())
        .filter(Boolean),
    [body],
  );

  return (
    <div className="space-y-4">
      {paras.map((p, i) => (
        <Block key={i} src={p} />
      ))}
    </div>
  );
}
