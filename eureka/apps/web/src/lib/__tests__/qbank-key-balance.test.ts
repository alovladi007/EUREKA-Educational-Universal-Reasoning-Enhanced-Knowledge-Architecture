/**
 * Answer-key balance regression test.
 *
 * Guards against the systemic defect fixed in WS1 of the test-prep content
 * remediation (see docs/monetization/TEST_PREP_CONTENT_AUDIT.md): correct
 * answers clustered at one option index (FME was 99.5% "A", PE-EE 98.7% "A"),
 * which makes a bank gameable ("always pick A") and non-predictive of the
 * real exam.
 *
 * For every de-biased bank we assert:
 *   1. every `correct` index is in range for its options array, and
 *   2. no single option position holds more than MAX_SHARE of the keys.
 *
 * GRE/GMAT (already near-balanced but small) join this list when they go
 * through the same pipeline. LSAT (5 options) and CISSP ({index,text} shape,
 * `correct_index`) were de-biased with letter-remapping of explanations and
 * are normalized into the same {options, correct} view below.
 */
import { describe, expect, it } from 'vitest';

import { FME_QUESTIONS } from '../fme-qbank-data';
import { PE_EE_QUESTIONS } from '../pe-ee-qbank-data';
import { FE_EE_QUESTIONS } from '../fe-ee-qbank-data';
import { SAT_QUESTIONS } from '../sat-qbank-data';
import { SECPLUS_QUESTIONS } from '../security-plus-qbank-data';
import { PATENT_BAR_QUESTIONS } from '../patent-bar-qbank-data';
import { PATENT_BAR_GAPFILL_ETHICS } from '../patent-bar-gapfill-ethics-data';
import { PATENT_BAR_GAPFILL_DESIGN } from '../patent-bar-gapfill-design-data';
import { PATENT_BAR_GAPFILL_PCT } from '../patent-bar-gapfill-pct-data';
import { MCAT_QUESTIONS } from '../mcat-qbank-data';
import { LSAT_QUESTIONS } from '../lsat-qbank-data';
import { CISSP_QUESTIONS } from '../cissp-qbank-data';

const MAX_SHARE = 0.35;

type AnyQuestion = { options: string[]; correct?: number };

const cisspNormalized: AnyQuestion[] = CISSP_QUESTIONS.map((q) => ({
  options: q.options.map((o) => o.text),
  correct: q.correct_index,
}));

// Optional third element: minimum expected keyed-question count for the bank
// (guards against an import silently yielding an empty/truncated bank). Full
// exam banks default to >50; WS3 gap-fill tranches are sized by blueprint
// arithmetic (e.g., PCT's terminal tranche is exactly 40) and declare their
// own floor.
const BANKS: [string, AnyQuestion[], number?][] = [
  ['FME', FME_QUESTIONS as AnyQuestion[]],
  ['PE_EE', PE_EE_QUESTIONS as AnyQuestion[]],
  ['FE_EE', FE_EE_QUESTIONS as AnyQuestion[]],
  ['SAT', SAT_QUESTIONS as AnyQuestion[]],
  ['SECURITY_PLUS', SECPLUS_QUESTIONS as AnyQuestion[]],
  ['PATENT_BAR', PATENT_BAR_QUESTIONS as AnyQuestion[]],
  ['PATENT_BAR_GAPFILL_ETHICS', PATENT_BAR_GAPFILL_ETHICS as AnyQuestion[]],
  ['PATENT_BAR_GAPFILL_DESIGN', PATENT_BAR_GAPFILL_DESIGN as AnyQuestion[]],
  ['PATENT_BAR_GAPFILL_PCT', PATENT_BAR_GAPFILL_PCT as AnyQuestion[], 39],
  ['MCAT', MCAT_QUESTIONS as AnyQuestion[]],
  ['LSAT', LSAT_QUESTIONS as AnyQuestion[]],
  ['CISSP', cisspNormalized],
];

describe.each(BANKS)('%s qbank answer keys', (_name, questions, minCount) => {
  const keyed = questions.filter(
    (q) => typeof q.correct === 'number' && Array.isArray(q.options),
  );

  it('has questions with keyed answers', () => {
    expect(keyed.length).toBeGreaterThan(minCount ?? 50);
  });

  it('keys every question inside its options range', () => {
    for (const q of keyed) {
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(q.options.length);
    }
  });

  it(`spreads keys so no position exceeds ${MAX_SHARE * 100}%`, () => {
    const counts = new Map<number, number>();
    for (const q of keyed) counts.set(q.correct!, (counts.get(q.correct!) ?? 0) + 1);
    for (const [pos, count] of counts) {
      const share = count / keyed.length;
      expect(share, `option index ${pos} holds ${(share * 100).toFixed(1)}% of keys`).toBeLessThanOrEqual(
        MAX_SHARE,
      );
    }
  });
});
