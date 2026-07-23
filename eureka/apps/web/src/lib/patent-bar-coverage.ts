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
  /** Blueprint questions per 100-question form (== weight %). */
  weightPct: number;
  /** QBank topicIds that roll up into this blueprint section. */
  topicIds: number[];
}

/**
 * Mirrors exam-config.ts PATENT_BAR.sections. "Patent Prosecution &
 * Application" (30%) spans three bank topics: application preparation (1),
 * filing & prosecution (2), and Office-action responses (3).
 */
export const PATENT_BAR_BLUEPRINT: CoverageSection[] = [
  { id: 'patent_prosecution', name: 'Patent Prosecution & Application', weightPct: 30, topicIds: [1, 2, 3] },
  { id: 'patentability', name: 'Patentability & Prior Art', weightPct: 20, topicIds: [0] },
  { id: 'post_issuance', name: 'Post-Issuance Proceedings', weightPct: 15, topicIds: [5] },
  { id: 'ethics_conduct', name: 'Ethics & Professional Conduct', weightPct: 15, topicIds: [7] },
  { id: 'design_plant', name: 'Design & Plant Patents', weightPct: 10, topicIds: [6] },
  { id: 'pct_international', name: 'PCT & International Filing', weightPct: 10, topicIds: [4] },
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
