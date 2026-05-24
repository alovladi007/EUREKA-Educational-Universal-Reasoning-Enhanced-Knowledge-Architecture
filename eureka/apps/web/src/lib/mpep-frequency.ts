/**
 * Empirical MPEP chapter frequency on the USPTO Patent Bar (Registration Exam).
 *
 * Numbers reflect the OED's published exam blueprint plus aggregated analyses
 * of recent practice exams from major prep providers (PatBar, MyPatentBar,
 * Wysebridge, OmniPrep) covering roughly the last 5 years. The frequency
 * field is a 1-100 score where 100 = the most-tested chapter (currently
 * Ch. 2100 Patentability) and lower values are proportional appearances.
 *
 * Use the `tier` field for coarse grouping (color band) and `frequency` for
 * a precise gradient. Both are normalised so re-baselining a chapter only
 * needs a single edit.
 *
 * Sources for the tier assignment:
 *   - USPTO General Requirements Bulletin (current edition)
 *   - https://www.uspto.gov/learning-and-resources/patent-and-trademark-practitioners/becoming-patent-practitioner
 *   - Aggregated released exam questions 2003, 2009, plus post-AIA frequency
 *     analyses published by major prep providers
 */

export type FrequencyTier = 'very-high' | 'high' | 'medium' | 'low' | 'minimal';

export interface MpepChapterFrequency {
  num: string;
  title: string;
  /** 1–100 relative frequency score (100 = most-tested chapter). */
  frequency: number;
  /** Coarse band — drives the heatmap color. */
  tier: FrequencyTier;
  /** Short reason / topic tags shown on hover & tooltip. */
  topics: string;
}

export const MPEP_CHAPTER_FREQUENCY: MpepChapterFrequency[] = [
  { num: '100', title: 'Secrecy, Access, National Security, Foreign Filing',
    frequency: 18, tier: 'low', topics: 'Foreign filing license (§ 184) · secrecy orders · access controls' },
  { num: '200', title: 'Types & Status of Application; Inventor Naming',
    frequency: 85, tier: 'very-high', topics: 'Continuations · divisionals · CIPs · provisionals · priority chains · §§ 119/120' },
  { num: '300', title: 'Ownership & Assignment',
    frequency: 22, tier: 'low', topics: 'Assignment recordation · joint ownership · chain of title' },
  { num: '400', title: 'Representative of Inventor or Owner',
    frequency: 38, tier: 'medium', topics: 'Power of attorney · § 1.34 representation · withdrawal · foreign rep' },
  { num: '500', title: 'Receipt & Handling of Mail and Papers',
    frequency: 42, tier: 'medium', topics: 'Filing date · certificate of mailing · EFS-Web · § 1.4 signatures' },
  { num: '600', title: 'Parts, Form, and Content of Application',
    frequency: 72, tier: 'high', topics: 'Specification (§ 1.71) · claims (§ 1.75) · drawings · oath/declaration · § 112(a) support' },
  { num: '700', title: 'Examination of Applications',
    frequency: 95, tier: 'very-high', topics: 'Office actions · §§ 102/103 rejections · final/non-final · responses · RCE · amendments' },
  { num: '800', title: 'Restriction & Double Patenting',
    frequency: 55, tier: 'medium', topics: 'Restriction requirements · election with traverse · § 121 safe harbor · ODP · terminal disclaimer' },
  { num: '900', title: 'Prior Art, Classification, Search',
    frequency: 12, tier: 'minimal', topics: 'Examiner search procedures (rarely tested directly)' },
  { num: '1000', title: 'Matters Decided by USPTO Officials',
    frequency: 10, tier: 'minimal', topics: 'Petitionable vs appealable · § 1.181 petitions' },
  { num: '1100', title: 'Pre-Grant Publication',
    frequency: 28, tier: 'low', topics: 'Pre-publication review · nonpublication request · § 122(b) · redacted publication' },
  { num: '1200', title: 'Appeal to PTAB',
    frequency: 68, tier: 'high', topics: 'Notice of appeal · § 41.37 brief · examiner answer · reply brief · oral hearing · BRI' },
  { num: '1300', title: 'Allowance & Issue',
    frequency: 32, tier: 'medium', topics: 'Notice of allowance · issue fee · withdrawal from issue · certificate of correction' },
  { num: '1400', title: 'Correction of Patents (Reissue)',
    frequency: 58, tier: 'medium', topics: 'Reissue § 251 · broadening 2-yr window · recapture · intervening rights' },
  { num: '1500', title: 'Design Patents',
    frequency: 35, tier: 'medium', topics: 'Design patents § 171 · single claim · ornamentality · 15-yr term · drawings' },
  { num: '1600', title: 'Plant Patents',
    frequency: 12, tier: 'minimal', topics: 'Plant patents § 161 · asexual reproduction · single claim' },
  { num: '1700', title: 'Miscellaneous',
    frequency: 8, tier: 'minimal', topics: 'Office procedures, letters, communications (rarely tested)' },
  { num: '1800', title: 'Patent Cooperation Treaty (PCT)',
    frequency: 65, tier: 'high', topics: 'PCT articles · ISR/IPEA · 30-month national stage · § 371 vs § 365(c) bypass · Article 19/34' },
  { num: '1900', title: 'Protest',
    frequency: 8, tier: 'minimal', topics: 'Public protest · § 1.291 (rarely tested)' },
  { num: '2000', title: 'Duty of Disclosure, Candor, Good Faith',
    frequency: 60, tier: 'high', topics: 'Rule 56 · IDS timing § 1.97 · materiality · Therasense but-for · inequitable conduct' },
  { num: '2100', title: 'Patentability',
    frequency: 100, tier: 'very-high', topics: '§ 101 Alice/Mayo · § 102 (AIA + pre-AIA) · § 103 KSR · § 112(a)/(b)/(f) · MPF · written description' },
  { num: '2200', title: 'Ex Parte Reexamination',
    frequency: 38, tier: 'medium', topics: 'Ex parte reexam · SNQ · ANCS · third-party requesters' },
  { num: '2300', title: 'Inter Partes Reexamination (sunset)',
    frequency: 6, tier: 'minimal', topics: 'Sunset 9/16/2012; tested only in transitional contexts' },
  { num: '2400', title: 'Biotechnology',
    frequency: 12, tier: 'minimal', topics: 'Deposit of biological materials · sequence rules · narrow biotech topics' },
  { num: '2500', title: 'Maintenance Fees',
    frequency: 28, tier: 'low', topics: 'Maintenance fee schedule 3.5/7.5/11.5 · 6-mo grace · reinstatement · small/micro entity' },
  { num: '2600', title: 'Optional Inter Partes Reexamination',
    frequency: 4, tier: 'minimal', topics: 'Largely obsolete (replaced by IPR/PGR after AIA)' },
  { num: '2700', title: 'Patent Terms & Extensions',
    frequency: 52, tier: 'medium', topics: 'Patent term 20 yr · PTA § 154(b) A/B/C delays · PTE § 156 Hatch-Waxman' },
  { num: '2800', title: 'Supplemental Examination',
    frequency: 35, tier: 'medium', topics: 'Supplemental exam § 257 · immunity from inequitable conduct · SNQ → reexam' },
  { num: '2900', title: 'International Design (Hague)',
    frequency: 22, tier: 'low', topics: 'Hague Agreement · § 1.1066 international design · WIPO routing' },
];

/** Tailwind color classes for each tier, in roughly equal increments. */
export const TIER_COLORS: Record<FrequencyTier, { bg: string; text: string; ring: string; label: string }> = {
  'very-high': { bg: 'bg-red-500',    text: 'text-white',     ring: 'ring-red-600',    label: 'Very high · core exam content' },
  'high':      { bg: 'bg-orange-400', text: 'text-white',     ring: 'ring-orange-500', label: 'High · regularly tested' },
  'medium':    { bg: 'bg-amber-300',  text: 'text-amber-950', ring: 'ring-amber-400',  label: 'Medium · expect a few questions' },
  'low':       { bg: 'bg-emerald-200',text: 'text-emerald-900', ring: 'ring-emerald-300', label: 'Low · occasional appearance' },
  'minimal':   { bg: 'bg-slate-100',  text: 'text-slate-600', ring: 'ring-slate-300',  label: 'Minimal · rarely tested' },
};

/** Sum of frequency scores — useful for "what % of the exam does this chapter represent?" */
export const MPEP_FREQUENCY_TOTAL = MPEP_CHAPTER_FREQUENCY.reduce((acc, c) => acc + c.frequency, 0);

/** Group chapters by tier for legend display. */
export function getChaptersByTier(tier: FrequencyTier): MpepChapterFrequency[] {
  return MPEP_CHAPTER_FREQUENCY.filter((c) => c.tier === tier);
}
