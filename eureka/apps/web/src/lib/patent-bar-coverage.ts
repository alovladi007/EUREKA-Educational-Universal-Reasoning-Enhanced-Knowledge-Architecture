/**
 * Patent Bar — blueprint coverage computation (WS3).
 *
 * Single source of truth for mapping the QBank's 8 numeric topics onto the
 * exam blueprint's 6 sections (exam-config.ts PATENT_BAR, 100-question form)
 * and computing per-section coverage: bank size, verification split, and
 * share vs blueprint weight. Used by the QBank Coverage card and by
 * scripts/generate-coverage-matrix.mjs (the published matrix).
 */

import { getPatentBarVerification, type PatentBarVerification } from './patent-bar-qbank-data';

export interface CoverageSection {
  id: string;
  name: string;
  /**
   * ESTIMATED questions per 100-question form (== weight %). The USPTO
   * publishes no topic weighting; see the provenance block below.
   */
  weightPct: number;
  /** QBank topicIds that roll up into this blueprint section. */
  topicIds: number[];
  /** How this section's weight was derived — shown in the published matrix. */
  basis: string;
}

/**
 * WEIGHT PROVENANCE — read before changing these numbers.
 *
 * The USPTO does NOT publish a topic breakdown for the registration
 * examination. Its published source-material list
 * (https://www.uspto.gov/sites/default/files/documents/registrationexamsourcematerial.pdf)
 * names only WHAT is tested, never in what proportion. Any percentage
 * blueprint for this exam is therefore an ESTIMATE, and must be labelled as
 * one rather than presented as the Office's own spec.
 *
 * These weights were previously 30/20/15/15/10/10 with no source of any
 * kind. That set was not merely unsourced but contradicted by evidence. A
 * mock built to the old numbers over-served ethics and design/plant by ~20
 * points of exam weight and under-served prosecution — the single largest
 * section of the real exam.
 *
 * `weightPct` is now derived from the 709 official released-exam questions
 * in this bank — Oct 2003, Apr 2003, Apr 2002, Oct 2001, Apr 2001, Oct 2000
 * and Apr 2000 (morning and afternoon each), plus Nov 1999 AM — which
 * distribute as prosecution 55.57%, patentability 26.52%, post-issuance
 * 10.72%, ethics 2.96%, PCT 2.54%, design/plant 1.69%.
 *
 * DERIVATION RULE — apply this verbatim on each new ingest so the numbers
 * stay reproducible rather than hand-tuned:
 *   1. Take each section's share of the official corpus.
 *   2. Largest-remainder round to sum to exactly 100.
 *   3. Restore any FLOOR section (see limit 2 below) that step 2 pushed
 *      below its previous weight, taking the difference from the largest
 *      section, which has by far the most supply to give.
 * Step 3 has fired twice and unwound once, which is the rule behaving
 * correctly: at 562 post-issuance rounded to 9 and was held at its floor of
 * 10; at 611 it genuinely rounded to 10 and the adjustment was UNWOUND; at
 * 709 PCT rounds to 2 and is held at its floor of 3. Each time the largest
 * section cedes the point. Do not carry a step-3 adjustment forward once the
 * data stops requiring it, or the estimate silently ratchets.
 * `basis` records the per-section derivation.
 *
 * KNOWN LIMITS of this estimate — do not treat it as ground truth:
 *  1. CLASSIFICATION ERROR. topicIds were assigned during ingestion by
 *     reading each question; a different reader would bucket some items
 *     differently, particularly at the filing/prosecution boundary.
 *  2. ERA DRIFT — the important one. Every source exam predates 2004.
 *     THREE of the four current tested sources postdate them entirely:
 *     the PTAB Consolidated Trial Practice Guide (Nov 2019), the 2013
 *     "Changes to Representation of Others" rule that created the 37 CFR
 *     Part 11 professional-conduct rules, and the Global/IP5 Patent
 *     Prosecution Highway programs. Ethics measures 2.96% here largely
 *     BECAUSE the modern conduct rules did not exist when these exams were
 *     written. The modern exam near-certainly tests ethics, post-issuance
 *     (IPR/PGR/derivation) and international practice ABOVE their
 *     historical share. Those three are treated as FLOORS, not targets:
 *     do not drive them lower on the strength of older exams alone.
 *
 * "Patent Prosecution & Application" spans three bank topics: application
 * preparation (1), filing & prosecution (2), and Office-action responses (3).
 */
export const PATENT_BAR_BLUEPRINT: CoverageSection[] = [
  { id: 'patent_prosecution', name: 'Patent Prosecution & Application', weightPct: 55, topicIds: [1, 2, 3],
    basis: 'empirical: 394/709 official items = 55.57%, less 1 point ceded to the pct_international floor per derivation step 3' },
  { id: 'patentability', name: 'Patentability & Prior Art', weightPct: 26, topicIds: [0],
    basis: 'empirical: 188/709 official items = 26.52%' },
  { id: 'post_issuance', name: 'Post-Issuance Proceedings', weightPct: 11, topicIds: [5],
    basis: 'empirical: 76/709 = 10.72%; also a FLOOR — modern PTAB trial practice (IPR/PGR/derivation) is a named tested source and postdates every source exam' },
  { id: 'ethics_conduct', name: 'Ethics & Professional Conduct', weightPct: 3, topicIds: [7],
    basis: 'empirical: 21/709 = 2.96%; FLOOR — the 37 CFR Part 11 conduct rules (2013) postdate every source exam and are a named tested source' },
  { id: 'design_plant', name: 'Design & Plant Patents', weightPct: 2, topicIds: [6],
    basis: 'empirical: 12/709 official items = 1.69%; not a floor section — the 2023 design patent practitioner bar is a separate examination' },
  { id: 'pct_international', name: 'PCT & International Filing', weightPct: 3, topicIds: [4],
    basis: 'empirical: 18/709 = 2.54% (rounds to 2); held at 3 as a FLOOR — the Global/IP5 PPH programs are a named tested source and postdate every source exam' },
];

export interface CoverageRow {
  id: string;
  name: string;
  weightPct: number;
  total: number;
  official: number;
  sme: number;
  unverified: number;
  /** This section's share of the whole bank, in percent (1 decimal). */
  sharePct: number;
  /**
   * Whether the section holds at least its blueprint weight of the bank —
   * the WS3 floor ("no section below its blueprint weight").
   */
  meetsWeight: boolean;
}

export function computePatentBarCoverage(
  questions: Array<{ id: string; topicId: number; verified?: PatentBarVerification }>,
): { rows: CoverageRow[]; bankTotal: number } {
  const bankTotal = questions.length;
  const rows = PATENT_BAR_BLUEPRINT.map((s) => {
    const qs = questions.filter((q) => s.topicIds.includes(q.topicId));
    let official = 0, sme = 0, unverified = 0;
    for (const q of qs) {
      const v = getPatentBarVerification(q);
      if (v === 'official') official++;
      else if (v === 'sme') sme++;
      else unverified++;
    }
    const sharePct = bankTotal ? Math.round((qs.length / bankTotal) * 1000) / 10 : 0;
    return {
      id: s.id,
      name: s.name,
      weightPct: s.weightPct,
      total: qs.length,
      official,
      sme,
      unverified,
      sharePct,
      meetsWeight: sharePct >= s.weightPct,
    };
  });
  return { rows, bankTotal };
}
