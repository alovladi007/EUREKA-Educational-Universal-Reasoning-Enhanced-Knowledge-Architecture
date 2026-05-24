/**
 * Empirical MCAT Foundational Concept frequency.
 *
 * The MCAT is organized by AAMC into FOUR sections and TEN Foundational
 * Concepts (FC1–FC10). CARS is a skills-based section with no foundational
 * concepts; the other three sections each cover 3–4 FCs.
 *
 *   Chem/Phys     59 questions / 95 min — FC4, FC5
 *   CARS          53 questions / 90 min — (skills, no FCs)
 *   Bio/Biochem   59 questions / 95 min — FC1, FC2, FC3
 *   Psych/Soc     59 questions / 95 min — FC6, FC7, FC8, FC9, FC10
 *
 * Section weights and FC-within-section weights below come from AAMC's
 * official content outline (see
 * https://students-residents.aamc.org/prepare-mcat-exam/whats-mcat-exam-pdf-outline)
 * combined with the discipline distributions AAMC publishes (Bio 65% of
 * Bio/Biochem, Biochem 25% of Chem/Phys + 25% of Bio/Biochem, etc.).
 *
 * `frequency` is the SHARE of the whole exam (so FC1..FC10 + CARS sum to
 * roughly 100). Use this number to prioritise study time.
 */

export type McatTier = 'very-high' | 'high' | 'medium' | 'low';

export type McatSection = 'chem_phys' | 'cars' | 'bio_biochem' | 'psych_soc';

export interface McatTopic {
  /** Stable id used in URLs / keys. */
  id: string;
  /** Display label — Foundational Concept # or CARS bucket. */
  name: string;
  /** Section this topic falls under. */
  section: McatSection;
  /** Section short label (Chem/Phys, CARS, Bio/B, Psych/Soc). */
  sectionLabel: string;
  /** Percentage of the whole 230-question exam, 0–100. */
  frequency: number;
  tier: McatTier;
  /** Short description of what's tested. */
  description: string;
  /** Optional deep link to AAMC's content reference. */
  url?: string;
}

/**
 * Primary destination for a heatmap cell — AAMC's official QBank product
 * for this topic (Section Bank or per-discipline Question Pack). Same
 * behaviour as the Patent Bar heatmap, which opens USPTO's eMPEP for the
 * clicked chapter.
 */
export function mcatOfficialUrl(topic: McatTopic): string {
  return topic.url || AAMC_PRODUCT_LANDING;
}

/** Secondary in-platform deep link to our own QBank, retained for the
 *  detail panel as a "practice on Eureka" affordance. */
export function mcatInternalQbankUrl(topic: McatTopic, questionCount = 20): string {
  return `/dashboard/test-prep/practice?exam=MCAT&section=${topic.section}&q=${questionCount}`;
}

export const mcatLessonsUrl = `/dashboard/test-prep/MCAT?tab=read`;
export const mcatFlashcardsUrl = `/dashboard/test-prep/MCAT?tab=flashcards`;

// AAMC URL helpers (verified 2026-05-24)
export const AAMC_MCAT_BASE = 'https://www.aamc.org/mcat';
export const AAMC_OUTLINE_PDF = 'https://students-residents.aamc.org/prepare-mcat-exam/whats-mcat-exam-pdf-outline';
export const AAMC_PREP_LANDING = 'https://students-residents.aamc.org/prepare-mcat-exam/prepare-mcat-exam';
export const AAMC_TAKING = 'https://students-residents.aamc.org/taking-mcat-exam/take-mcat-exam';
export const AAMC_SCORES = 'https://students-residents.aamc.org/mcat-scores/mcat-scores';
export const AAMC_STUDY_PLAN = 'https://students-residents.aamc.org/prepare-mcat-exam/creating-your-mcat-exam-study-plan';

// AAMC's official MCAT Resource Store — these are the OFFICIAL QBank products
// candidates actually use to practice. Each cell in the frequency heatmap
// links to the AAMC product that contains questions on that topic, the same
// way Patent Bar chapters link into the official eMPEP.
export const AAMC_STORE_BASE = 'https://store.aamc.org';
export const AAMC_MRS = 'https://mcat.aamc.org/mrs/'; // AAMC MCAT Resource Store — launches purchased QBanks
export const AAMC_PRODUCT_LANDING = 'https://students-residents.aamc.org/prepare-mcat-exam/practice-mcat-exam-official-low-cost-products';

// Discipline-specific Question Packs and the umbrella Section Bank
export const AAMC_SECTION_BANK    = `${AAMC_STORE_BASE}/aamc-mcat-section-bank-online.html`;
export const AAMC_SECTION_BANK_V2 = `${AAMC_STORE_BASE}/aamc-mcat-official-prep-section-bank-vol-2.html`;
export const AAMC_QP_BIOLOGY_V1   = `${AAMC_STORE_BASE}/official-mcat-biology-question-pack-volume-1.html`;
export const AAMC_QP_BIOLOGY_V2   = `${AAMC_STORE_BASE}/official-mcat-biology-question-pack-volume-2-online.html`;
export const AAMC_QP_CHEMISTRY    = `${AAMC_STORE_BASE}/official-mcat-chemistry-question-pack-online.html`;
export const AAMC_QP_PHYSICS      = `${AAMC_STORE_BASE}/official-mcat-physics-question-pack-online.html`;
export const AAMC_QP_CARS_V1      = `${AAMC_STORE_BASE}/official-mcat-critical-analysis-and-reasoning-skills-question-pack-volume-1-online.html`;
export const AAMC_QP_CARS_V2      = `${AAMC_STORE_BASE}/official-mcat-critical-analysis-and-reasoning-skills-question-pack-volume-2-online.html`;
export const AAMC_QP_BUNDLE       = `${AAMC_STORE_BASE}/official-mcat-question-pack-bundle-online.html`;
export const AAMC_CARS_DIAGNOSTIC = `${AAMC_STORE_BASE}/aamc-mcat-official-prep-cars-diagnostic-tool.html`;
export const AAMC_QP_INDEX        = `${AAMC_STORE_BASE}/mcat-prep/question-packs.html`;

export const MCAT_FOUNDATIONAL_CONCEPTS: McatTopic[] = [
  // Bio/Biochem section — FC1, FC2, FC3 → AAMC Biology Question Packs (V1 has
  // macromolecules + cell bio; V2 adds organ systems / physiology).
  {
    id: 'fc1', name: 'FC 1 · Macromolecular Structure', section: 'bio_biochem', sectionLabel: 'Bio/Biochem',
    frequency: 9, tier: 'high',
    description: 'Structure & function of macromolecules (amino acids → proteins, nucleic acids, lipids, carbohydrates). Biochem catalysis fundamentals.',
    url: AAMC_QP_BIOLOGY_V1,
  },
  {
    id: 'fc2', name: 'FC 2 · Cells, Organs, Organisms', section: 'bio_biochem', sectionLabel: 'Bio/Biochem',
    frequency: 9, tier: 'high',
    description: 'Cell biology, organelles, microbio, basic genetics, gene expression. Major Bio/Biochem topic cluster.',
    url: AAMC_QP_BIOLOGY_V1,
  },
  {
    id: 'fc3', name: 'FC 3 · Complex Living Systems', section: 'bio_biochem', sectionLabel: 'Bio/Biochem',
    frequency: 8, tier: 'high',
    description: 'Organ systems, homeostasis, reproduction, integrated physiology. Heavily-tested clinical content.',
    url: AAMC_QP_BIOLOGY_V2,
  },
  // Chem/Phys section — FC4 → Physics QPack, FC5 → Chemistry QPack
  {
    id: 'fc4', name: 'FC 4 · Chemical & Physical Principles in Bio', section: 'chem_phys', sectionLabel: 'Chem/Phys',
    frequency: 12, tier: 'very-high',
    description: 'Translation of physical principles into biology: fluid dynamics in blood vessels, optics in vision, acoustics in hearing, gas exchange.',
    url: AAMC_QP_PHYSICS,
  },
  {
    id: 'fc5', name: 'FC 5 · Principles of Matter & Energy', section: 'chem_phys', sectionLabel: 'Chem/Phys',
    frequency: 13, tier: 'very-high',
    description: 'General chemistry (atomic/electronic structure, bonding, thermo, kinetics, acid-base, redox). Largest single FC.',
    url: AAMC_QP_CHEMISTRY,
  },
  // CARS — AAMC CARS Question Pack (V1 + V2 sold separately)
  {
    id: 'cars', name: 'CARS · Critical Analysis & Reasoning Skills', section: 'cars', sectionLabel: 'CARS',
    frequency: 23, tier: 'very-high',
    description: 'No content to study — pure reading comprehension of humanities and social-science passages. Reasoning beyond text, main idea, tone, comparative.',
    url: AAMC_QP_CARS_V1,
  },
  // Psych/Soc section — no dedicated Question Pack, send to AAMC Section Bank
  // (the umbrella product that covers all four MCAT sections with section-
  // specific question pools).
  {
    id: 'fc6', name: 'FC 6 · Sensing & Responding to Environment', section: 'psych_soc', sectionLabel: 'Psych/Soc',
    frequency: 6, tier: 'medium',
    description: 'Sensation, perception, attention, consciousness, sleep, memory, language. Major Psych/Soc cluster.',
    url: AAMC_SECTION_BANK,
  },
  {
    id: 'fc7', name: 'FC 7 · Behavior & Self-Identity', section: 'psych_soc', sectionLabel: 'Psych/Soc',
    frequency: 6, tier: 'medium',
    description: 'Personality, identity formation, social cognition, attitudes, motivation, emotion, stress.',
    url: AAMC_SECTION_BANK,
  },
  {
    id: 'fc8', name: 'FC 8 · Cultural & Social Differences', section: 'psych_soc', sectionLabel: 'Psych/Soc',
    frequency: 5, tier: 'medium',
    description: 'Group dynamics, social structure, demographics, culture, social institutions (family, education, religion, gov).',
    url: AAMC_SECTION_BANK,
  },
  {
    id: 'fc9', name: 'FC 9 · Cultural/Social Differences in Health', section: 'psych_soc', sectionLabel: 'Psych/Soc',
    frequency: 5, tier: 'medium',
    description: 'Health disparities, SES gradient, social determinants of health, healthcare access.',
    url: AAMC_SECTION_BANK,
  },
  {
    id: 'fc10', name: 'FC 10 · Social Inequalities & Resources', section: 'psych_soc', sectionLabel: 'Psych/Soc',
    frequency: 4, tier: 'low',
    description: 'Poverty, inequality, mobility, distribution of resources, demographic shifts, globalization.',
    url: AAMC_SECTION_BANK_V2,
  },
];

/** Inline tier colors — see lsat-frequency for the rationale. */
export const MCAT_TIER_COLORS: Record<
  McatTier,
  { bg: string; text: string; ring: string; label: string }
> = {
  'very-high': { bg: '#ef4444', text: '#ffffff', ring: '#b91c1c', label: 'Very high · ≥10% of exam' },
  high:        { bg: '#fb923c', text: '#ffffff', ring: '#ea580c', label: 'High · ~8–9% of exam' },
  medium:      { bg: '#fcd34d', text: '#451a03', ring: '#f59e0b', label: 'Medium · ~5–6% of exam' },
  low:         { bg: '#a7f3d0', text: '#064e3b', ring: '#10b981', label: 'Lower · ~3–4% of exam' },
};

/** Section-level color so the heatmap can group by section visually. */
export const MCAT_SECTION_COLORS: Record<McatSection, { dot: string; label: string }> = {
  chem_phys:    { dot: '#3b82f6', label: 'Chem/Phys'    },
  cars:         { dot: '#a855f7', label: 'CARS'         },
  bio_biochem:  { dot: '#10b981', label: 'Bio/Biochem'  },
  psych_soc:    { dot: '#ec4899', label: 'Psych/Soc'    },
};
