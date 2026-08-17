/**
 * Every maths expression in the FE EE course must actually parse.
 *
 * This test imports the MODULE, not the file, and that distinction is the
 * whole point. Lesson bodies are TypeScript template literals, where a lone
 * backslash is an identity escape: `\pm` written in the source evaluates to
 * the string "pm". A checker that reads fe-ee-course-data.ts as text sees a
 * perfectly good `\pm` and passes, while the running app renders "pm" in the
 * middle of the quadratic formula. Importing the module is the only way to
 * see what the reader will actually be handed.
 */
import { describe, it, expect } from 'vitest';
import katex from 'katex';
import { FE_EE_COURSE } from '../fe-ee-course-data';

/** $$display$$ or $inline$, non-greedy, never spanning a blank line. */
const MATH = /\$\$([^$]+?)\$\$|\$([^$\n]+?)\$/g;

function bodies(): { topic: string; section: string; text: string }[] {
  const out: { topic: string; section: string; text: string }[] = [];
  for (const [topicId, topic] of Object.entries(FE_EE_COURSE)) {
    for (const section of topic.sections) {
      out.push({ topic: topicId, section: section.id, text: section.content });
    }
  }
  return out;
}

describe('FE EE lesson mathematics', () => {
  it('parses every expression through KaTeX', () => {
    const failures: string[] = [];
    let count = 0;
    for (const { topic, section, text } of bodies()) {
      for (const m of text.matchAll(MATH)) {
        const tex = (m[1] ?? m[2]).trim();
        count += 1;
        try {
          katex.renderToString(tex, { throwOnError: true, displayMode: Boolean(m[1]) });
        } catch (e) {
          failures.push(`${topic}/${section}: ${tex} -> ${(e as Error).message}`);
        }
      }
    }
    expect(count).toBeGreaterThan(1000);
    expect(failures).toEqual([]);
  });

  it('leaves no LaTeX command stripped by template-literal escaping', () => {
    // "pm", "cdot", "sqrt" and friends appearing as bare words inside maths
    // means the backslash was eaten on the way through the template literal.
    const bare = /\$[^$\n]*?(?<![\\A-Za-z])(pm|cdot|sqrt|approx|angle|Omega|theta|omega|frac|times|le|ge)(?![A-Za-z])[^$\n]*?\$/;
    // That premise holds in maths mode only. Inside \text{} these are ordinary
    // English words, so \text{unless every load shares one angle} was read as a
    // mangled \angle. Strip text-mode group CONTENTS first -- the same thing
    // check_fe_ee_render.mjs does before looking for prose left in maths.
    const stripText = (s: string) =>
      s.replace(/\\(?:text|mathrm|mathbf|mathit|textbf|textit|operatorname)\s*\{[^{}]*\}/g, ' ');
    // Guard the narrowing. A check that stops firing is indistinguishable from
    // a check that passes, so prove it still catches a genuinely eaten
    // backslash and still ignores a correctly escaped command.
    expect(bare.test(`$${stripText('R_1 pm 5')}$`)).toBe(true);
    expect(bare.test(`$${stripText('\\theta = 30^\\circ')}$`)).toBe(false);
    expect(bare.test(`$${stripText('\\text{one angle}')}$`)).toBe(false);
    const hits: string[] = [];
    for (const { topic, section, text } of bodies()) {
      for (const m of text.matchAll(MATH)) {
        const tex = m[1] ?? m[2];
        if (bare.test(`$${stripText(tex)}$`)) hits.push(`${topic}/${section}: ${tex}`);
      }
    }
    expect(hits).toEqual([]);
  });

  it('has balanced delimiters and no unescaped currency sign', () => {
    const problems: string[] = [];
    for (const { topic, section, text } of bodies()) {
      for (const line of text.split('\n')) {
        const rest = line.replace(/(?<!\\)\$\$[^$]*?\$\$|(?<!\\)\$[^$\n]*?\$/g, '');
        if (/(?<!\\)\$/.test(rest)) {
          problems.push(`${topic}/${section}: ${line.trim().slice(0, 70)}`);
        }
      }
    }
    expect(problems).toEqual([]);
  });
});
