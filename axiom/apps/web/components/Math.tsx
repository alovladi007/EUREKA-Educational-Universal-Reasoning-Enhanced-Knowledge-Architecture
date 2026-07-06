'use client';

import katex from 'katex';
import { useMemo } from 'react';

// Math rendering for AXIOM, built on KaTeX.
//
// KaTeX is configured with output "htmlAndMathml" so every rendered expression
// carries a MathML tree alongside the visual HTML. That MathML is what screen
// readers announce, which is how AXIOM keeps math accessible (WCAG 2.2) without
// a separate code path. throwOnError is false so a malformed expression renders
// as a visible error rather than crashing the page.
//
// RichMath renders a string that mixes prose and math using TeX delimiters:
//   - $...$   inline math
//   - $$...$$ block (display) math
// A string with no delimiters renders as plain text with its whitespace
// preserved, so existing plain-text prompts keep rendering exactly as before and
// authored content can opt into math by adding delimiters.

const KATEX_OPTIONS = {
  throwOnError: false,
  output: 'htmlAndMathml' as const,
  strict: false,
};

export function InlineMath({ tex }: { tex: string }) {
  const html = useMemo(
    () => katex.renderToString(tex, { ...KATEX_OPTIONS, displayMode: false }),
    [tex],
  );
  return (
    <span
      className="katex-inline"
      // KaTeX sanitizes its own output; this HTML is not user-controlled markup.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function BlockMath({ tex }: { tex: string }) {
  const html = useMemo(
    () => katex.renderToString(tex, { ...KATEX_OPTIONS, displayMode: true }),
    [tex],
  );
  return (
    <div
      className="my-2 overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

type Segment = { type: 'text' | 'inline' | 'block'; value: string };

// Split a string into text and math segments. $$...$$ is matched before $...$
// so a display block is never mistaken for two inline spans. Inline math is not
// allowed to span a newline, which keeps a lone dollar sign in prose (rare in
// math content, but possible) from swallowing the rest of a paragraph.
const MATH_PATTERN = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;

export function segmentMath(text: string): Segment[] {
  const segments: Segment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  MATH_PATTERN.lastIndex = 0;
  while ((match = MATH_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      segments.push({ type: 'block', value: match[1] });
    } else {
      segments.push({ type: 'inline', value: match[2] });
    }
    lastIndex = MATH_PATTERN.lastIndex;
  }
  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) });
  }
  return segments;
}

// Render prose that may contain inline ($...$) and block ($$...$$) math. This
// returns a fragment of spans and (for block math) divs, so the caller should
// place it inside a block-level container, not a <p>.
export function RichMath({ text }: { text: string }) {
  const segments = useMemo(() => segmentMath(text ?? ''), [text]);
  return (
    <>
      {segments.map((segment, index) => {
        if (segment.type === 'text') {
          return (
            <span key={index} className="whitespace-pre-wrap">
              {segment.value}
            </span>
          );
        }
        if (segment.type === 'inline') {
          return <InlineMath key={index} tex={segment.value} />;
        }
        return <BlockMath key={index} tex={segment.value} />;
      })}
    </>
  );
}
