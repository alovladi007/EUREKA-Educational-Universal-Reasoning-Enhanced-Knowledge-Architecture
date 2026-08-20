/**
 * NCLEX shared types.
 *
 * Moved here from nclex-qbank-data.ts when the QBank items migrated to the
 * server item bank (NX-5) and that file was deleted — its answer keys
 * shipped in the browser bundle, which is why it had to go. The offline
 * Dosage Mastery bank (nclex-dosage-bank2-data.ts) and its verifier test
 * still need the shapes, so the types live on without the data.
 */

export interface NclexCalcSpec {
  kind:
    | 'tablets'
    | 'liquid-volume'
    | 'dose-by-weight'
    | 'iv-rate-mlhr'
    | 'iv-drip-gtt'
    | 'unit-conversion'
    | 'reconstitution'
    | 'pediatric-safe-dose'
    | 'infusion-time'
    | 'iv-dose-mlhr';
  /** The raw clinical parameters the stem states in prose. */
  params: Record<string, number>;
  /** The exact numeric answer keyed in options[correct]. */
  expected: number;
  unit: string;
  /** Decimal places used when formatting the keyed option. */
  round: number;
}

export interface NclexQuestion {
  id: string;
  topicId: number;
  subtopic: string;
  difficulty: number; // 1-3
  question: string;
  options: string[];
  correct?: number; // single-answer MCQ
  type?: 'mcq' | 'multi'; // 'multi' = select-all-that-apply (SATA)
  correctAnswers?: number[]; // SATA: the set of correct option indices
  explanation: string;
  /** 'calc-verified' = dual-path computed key; 'unverified' = pending SME. */
  verification: 'calc-verified' | 'unverified';
  calc?: NclexCalcSpec;
}
