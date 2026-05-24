/**
 * Empirical LSAT question-type frequency (current LSAT format — post Aug 2024).
 *
 * Format reminder:
 *   - 2× Logical Reasoning sections (≈25 questions each, ≈50 LR total)
 *   - 1× Reading Comprehension section (≈27 questions)
 *   - 1× unscored experimental section (same format as LR or RC)
 *   - Argumentative Writing is a separate take-at-home test, NOT scored on
 *     the 120–180 scale. Logic Games / Analytical Reasoning was REMOVED in
 *     August 2024.
 *
 * Frequencies below are derived from aggregated analyses of recent disclosed
 * LSAT PrepTests (LSAT-Demon, 7Sage, PowerScore, Khan Academy free LSAT
 * prep). They represent the approximate percent of LR or RC questions you
 * can expect in any given scored test. `frequency` is the percentage SHARE
 * of that section (LR or RC); not of the whole exam.
 *
 * Official content reference: https://www.lsac.org/lsat/prepare/types-lsat-questions
 */

export type LsatTier = 'very-high' | 'high' | 'medium' | 'low' | 'minimal';

export interface LsatQuestionType {
  /** Stable id used in URLs / keys. */
  id: string;
  /** Display label (short). */
  name: string;
  /** Which scored section this type appears in. */
  section: 'LR' | 'RC';
  /** Percentage of that section's questions, 0–100. */
  frequency: number;
  tier: LsatTier;
  /** One-line description for the detail panel. */
  description: string;
  /** Optional deep-link to LSAC's official content. */
  url?: string;
}

/** Map LR/RC section to the corresponding exam-config sectionId. */
const SECTION_TO_QBANK_ID: Record<'LR' | 'RC', string> = {
  LR: 'logical_reasoning',
  RC: 'reading_comprehension',
};

/**
 * Deep-link helpers — clicking a cell opens YOUR OWN QBank pre-filtered to
 * that section, so the user lands on actual practice questions. The LSAC
 * official reference is demoted to a small secondary link in the detail
 * panel (LSAC's question-types page has no inline questions).
 */
export function lsatPracticeUrl(q: LsatQuestionType, questionCount = 20): string {
  return `/dashboard/test-prep/practice?exam=LSAT&section=${SECTION_TO_QBANK_ID[q.section]}&q=${questionCount}`;
}
export const lsatLessonsUrl = `/dashboard/test-prep/LSAT?tab=read`;
export const lsatFlashcardsUrl = `/dashboard/test-prep/LSAT?tab=flashcards`;

// LSAC URL helpers (verified 2026-05-24)
export const LSAC_BASE = 'https://www.lsac.org/lsat';
export const LSAC_QUESTION_TYPES = `${LSAC_BASE}/prepare/types-lsat-questions`;
export const LSAC_RC = `${LSAC_QUESTION_TYPES}/reading-comprehension`;
export const LSAC_LR = LSAC_QUESTION_TYPES; // LSAC merged LR coverage into the overview page
export const LSAC_SCORING = `${LSAC_BASE}/lsat-scoring`;
export const LSAC_FORMAT = `${LSAC_BASE}/about`;
export const LSAC_PREP = `${LSAC_BASE}/lsat-prep`;
export const LSAC_PRACTICE = `${LSAC_BASE}/prepare/official-lsat-practice-tests`;

// ─── Logical Reasoning (LR) — ≈50 questions per scored test ────────────────
const LR_TYPES: LsatQuestionType[] = [
  { id: 'lr_strengthen', name: 'Strengthen', section: 'LR', frequency: 12, tier: 'very-high',
    description: 'Find an answer that supports / makes the conclusion more likely. Among the most-tested LR types.',
    url: LSAC_LR },
  { id: 'lr_weaken', name: 'Weaken', section: 'LR', frequency: 10, tier: 'very-high',
    description: 'Find an answer that undermines / makes the conclusion less likely.',
    url: LSAC_LR },
  { id: 'lr_necessary_assumption', name: 'Necessary Assumption', section: 'LR', frequency: 10, tier: 'very-high',
    description: 'Identify a premise the argument MUST rely on. Test via the negation technique.',
    url: LSAC_LR },
  { id: 'lr_inference', name: 'Inference / Must Be True', section: 'LR', frequency: 10, tier: 'very-high',
    description: 'What conclusion is supported by the stimulus? Stay strictly within the text.',
    url: LSAC_LR },
  { id: 'lr_flaw', name: 'Flaw', section: 'LR', frequency: 10, tier: 'very-high',
    description: 'Identify the LOGICAL flaw in the argument (cause/correlation confusion, equivocation, etc.).',
    url: LSAC_LR },
  { id: 'lr_principle', name: 'Principle (apply / strengthen)', section: 'LR', frequency: 7, tier: 'high',
    description: 'Connect an abstract principle to a specific situation, in either direction.',
    url: LSAC_LR },
  { id: 'lr_main_point', name: 'Main Point / Main Conclusion', section: 'LR', frequency: 6, tier: 'high',
    description: 'Identify the author\'s primary conclusion. Distinguish from subsidiary conclusions.',
    url: LSAC_LR },
  { id: 'lr_role', name: 'Role / Function in Argument', section: 'LR', frequency: 5, tier: 'medium',
    description: 'How does a bolded statement function? Premise, sub-conclusion, evidence cited and rejected, etc.',
    url: LSAC_LR },
  { id: 'lr_resolve_paradox', name: 'Resolve the Paradox', section: 'LR', frequency: 5, tier: 'medium',
    description: 'Find what RECONCILES two seemingly contradictory facts. Look for a missing piece.',
    url: LSAC_LR },
  { id: 'lr_method', name: 'Method of Reasoning', section: 'LR', frequency: 5, tier: 'medium',
    description: 'Describe HOW the argument proceeds (analogy, generalization, eliminating alternatives, etc.).',
    url: LSAC_LR },
  { id: 'lr_sufficient_assumption', name: 'Sufficient Assumption', section: 'LR', frequency: 5, tier: 'medium',
    description: 'What assumption, if true, would GUARANTEE the conclusion? Look for conditional patterns.',
    url: LSAC_LR },
  { id: 'lr_parallel', name: 'Parallel Reasoning', section: 'LR', frequency: 4, tier: 'medium',
    description: 'Which answer matches the LOGICAL STRUCTURE of the stimulus argument?',
    url: LSAC_LR },
  { id: 'lr_parallel_flaw', name: 'Parallel Flaw', section: 'LR', frequency: 3, tier: 'low',
    description: 'Which answer matches the FLAWED logical structure of the stimulus argument?',
    url: LSAC_LR },
  { id: 'lr_point_at_issue', name: 'Point at Issue / Disagreement', section: 'LR', frequency: 3, tier: 'low',
    description: 'What do two speakers DISAGREE about? Look for direct contradiction supported in both stimuli.',
    url: LSAC_LR },
  { id: 'lr_eval_argument', name: 'Argument Evaluation', section: 'LR', frequency: 2, tier: 'low',
    description: 'What information would help DETERMINE whether the argument is sound?',
    url: LSAC_LR },
  { id: 'lr_complete', name: 'Complete the Argument', section: 'LR', frequency: 2, tier: 'low',
    description: 'Fill in a missing piece (premise or conclusion) that follows naturally.',
    url: LSAC_LR },
  { id: 'lr_necessary_sufficient', name: 'Conditional / Necessary-Sufficient', section: 'LR', frequency: 1, tier: 'minimal',
    description: 'Manipulate conditional statements (contrapositive, contraposition errors). Often embedded in other types.',
    url: LSAC_LR },
];

// ─── Reading Comprehension (RC) — ≈27 questions per test, 4 passages ───────
const RC_TYPES: LsatQuestionType[] = [
  { id: 'rc_detail', name: 'Specific Reference / Detail', section: 'RC', frequency: 25, tier: 'very-high',
    description: 'What did the passage SAY about X? Send-back to a specific line or paragraph.',
    url: LSAC_RC },
  { id: 'rc_inference', name: 'Inference', section: 'RC', frequency: 20, tier: 'very-high',
    description: 'What can be reasonably concluded from the passage? Stay close to the text.',
    url: LSAC_RC },
  { id: 'rc_function', name: 'Function / Purpose / Role', section: 'RC', frequency: 15, tier: 'high',
    description: 'Why did the author include X? Function of a paragraph, sentence, or example.',
    url: LSAC_RC },
  { id: 'rc_main_point', name: 'Main Point / Main Idea', section: 'RC', frequency: 10, tier: 'high',
    description: 'Identify the CENTRAL claim of the passage. Often answers a comparative or framing question.',
    url: LSAC_RC },
  { id: 'rc_comparative', name: 'Comparative Passage Relationship', section: 'RC', frequency: 10, tier: 'high',
    description: 'How do the two passages relate? Agreement, disagreement, scope difference. (1 comparative set per test.)',
    url: LSAC_RC },
  { id: 'rc_structure', name: 'Structure / Organization', section: 'RC', frequency: 8, tier: 'medium',
    description: 'How is the passage organized? Compare-contrast, chronological, problem-solution, etc.',
    url: LSAC_RC },
  { id: 'rc_application', name: 'Application / Extrapolation', section: 'RC', frequency: 7, tier: 'medium',
    description: 'Apply the passage\'s logic to a new scenario. Like LR Principle questions.',
    url: LSAC_RC },
  { id: 'rc_attitude', name: 'Author\'s Attitude / Tone', section: 'RC', frequency: 5, tier: 'medium',
    description: 'How does the author FEEL about the topic? Skeptical, supportive, ambivalent, etc.',
    url: LSAC_RC },
];

export const LSAT_QUESTION_TYPES: LsatQuestionType[] = [...LR_TYPES, ...RC_TYPES];

/** Inline color values for each tier (Tailwind JIT can't follow object lookups
 *  in .ts files, so we use hex strings to guarantee every tier renders). */
export const LSAT_TIER_COLORS: Record<
  LsatTier,
  { bg: string; text: string; ring: string; label: string }
> = {
  'very-high': { bg: '#ef4444', text: '#ffffff', ring: '#b91c1c', label: 'Very high · expect ~10%+ of section' },
  high:        { bg: '#fb923c', text: '#ffffff', ring: '#ea580c', label: 'High · regularly tested' },
  medium:      { bg: '#fcd34d', text: '#451a03', ring: '#f59e0b', label: 'Medium · a few per test' },
  low:         { bg: '#a7f3d0', text: '#064e3b', ring: '#10b981', label: 'Low · 1–2 per test' },
  minimal:     { bg: '#f1f5f9', text: '#475569', ring: '#94a3b8', label: 'Minimal · rare standalone' },
};
