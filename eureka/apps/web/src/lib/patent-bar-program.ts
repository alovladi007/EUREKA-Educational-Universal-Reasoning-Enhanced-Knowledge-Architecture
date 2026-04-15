/**
 * Patent Bar full-program coverage: standards, trust, community placeholders, micro-drills.
 */

export const MPEP_REVISION_LABEL = 'MPEP 9th ed., Revision R-01.2024 (content review baseline for tagging & explanations)';

export const QUESTION_TAG_SCHEMA = {
  description:
    'Patent Bar items in the QBank store extended metadata in `questions.tags` as JSON. This powers AIA clarity, trap analytics, and per-option MPEP cites.',
  fields: [
    { key: 'mpep_chapter', example: '"2100"', note: 'Primary MPEP chapter.' },
    { key: 'statute', example: '"35 U.S.C. § 103"', note: 'Statute or rule string for filters.' },
    { key: 'aia_era', example: '"post_aia" | "pre_aia" | "both"', note: 'Dominant regime for the fact pattern.' },
    {
      key: 'content_type',
      example: '"statute" | "rule" | "case_law" | "procedure" | "mixed"',
      note: 'Tag for analytics buckets.',
    },
    { key: 'trap_type', example: '"confuses_102_103"', note: 'Wrong-answer trap label.' },
    { key: 'question_format', example: '"standard_mcq" | "claim_construction" | "dates" | "search_drill"', note: 'Session filters.' },
    { key: 'mpep_revision_reviewed', example: '"R-01.2024"', note: 'Revision log for user trust.' },
    {
      key: 'distractor_explanations',
      example: '{"0":"MPEP §2143 — applies to obviousness, not novelty…"}',
      note: 'Per wrong option index (string keys). Shown after submit in tutor mode.',
    },
    { key: 'correct_rule_cite', example: '"37 CFR 1.104"', note: 'Anchor for why the keyed answer is correct.' },
  ],
} as const;

export const TRUST_AND_SOURCING = {
  title: 'Sourcing & compliance',
  bullets: [
    'Primary law and procedure references follow the USPTO Manual of Patent Examining Procedure (MPEP) and federal patent statutes/regulations.',
    'EUREKA explanations and drills are original study aids; they are not copies of USPTO registration examination questions.',
    'We do not claim to redistribute official past exam questions unless explicitly licensed; practice items are labeled when authored for pattern fidelity (OED-style stems).',
    'Instructor-led office hours and async Q&A are roadmap features—use notes and Patent Bar hub links for now.',
  ],
} as const;

export const COMMUNITY_PLACEHOLDER = {
  title: 'Community & accountability (roadmap)',
  items: [
    'Study groups & cohort schedules with shared milestones.',
    'Mock exam weekends aligned to USPTO-style timing.',
    'Peer accountability nudges (opt-in).',
  ],
} as const;

export const OED_LOGISTICS_CHECKLIST = [
  { id: 'reg', label: 'Confirm PDX/PEARSON registration path and exam delivery rules for your jurisdiction.' },
  { id: 'oed', label: 'Review OED character and fitness requirements and disclosure obligations early.' },
  { id: 'id', label: 'Prepare acceptable IDs and test-center policies (security, breaks, scratch paper rules).' },
  { id: 'day', label: 'Exam day: arrive early; know CBT layout (MPEP search, flagging, time).' },
  { id: 'after', label: 'Post-exam: score reporting timeline and next steps if retesting.' },
] as const;

export type DateDrillItem = {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  aiaNote: string;
  mpepHint: string;
};

export const DATE_CONFLICT_DRILLS: DateDrillItem[] = [
  {
    id: 'd1',
    prompt:
      'A non-provisional claims domestic benefit under 35 U.S.C. § 120 to Application A (filing date F1). A prior art reference is only effective as of its publication date P. Which analysis is most central to novelty under AIA 102(a)(1)?',
    choices: [
      'Whether P is before the effective filing date of the claimed invention',
      'Whether F1 is before the inventor’s date of conception',
      'Whether Application A disclosed the reference in an IDS',
      'Whether the reference qualifies as a patent under §102(a)(2) only',
    ],
    correctIndex: 0,
    aiaNote: 'Post-AIA 102(a)(1) turns on effective filing date vs prior art date; benefit claims set the timeline for the claim set.',
    mpepHint: 'Cross-check MPEP Ch. 2100 (prior art) and Ch. 600/700 (benefit).',
  },
  {
    id: 'd2',
    prompt:
      'Applicant files a provisional, then a non-provisional within 12 months claiming benefit under §119(e). For prior art purposes, which statement is generally most accurate?',
    choices: [
      'The provisional filing date can anchor prior art for disclosures in the provisional as support if the non-provisional properly claims benefit',
      'The provisional never counts for any prior art purpose',
      'Priority is automatic without any cross-reference in the non-provisional',
      'Foreign priority under §119(a) is identical to domestic benefit under §119(e)',
    ],
    correctIndex: 0,
    aiaNote: 'Benefit must be properly claimed and supported; pre-AIA vs AIA effective dates differ in edge cases—stem flags "dominant" regime in real items.',
    mpepHint: 'MPEP Ch. 200 / 600 — benefit claims; verify §119(e) requirements.',
  },
];

export type ClaimDrillItem = {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  why: string;
};

export const CLAIM_CONSTRUCTION_DRILLS: ClaimDrillItem[] = [
  {
    id: 'c1',
    prompt:
      'Claim 1 recites "a fastener comprising a bolt and a nut, wherein the bolt includes a threaded shaft." The specification shows multiple bolts but only one is labeled "the bolt" in an embodiment. A reference shows a pin instead of a threaded bolt. Which issue is most likely tested first?',
    choices: [
      'Antecedent basis / whether "the bolt" is supported for the claimed scope',
      'Whether the reference anticipates under §102 without claim construction',
      'Whether the abstract idea exception under §101 bars the claim',
      'Whether the doctrine of equivalents applies to the pin',
    ],
    correctIndex: 0,
    why: '§112(b) antecedent basis and support in spec often gate enablement/written description issues before novelty/obviousness.',
  },
  {
    id: 'c2',
    prompt:
      'A dependent claim adds "wherein the nut is brass." The independent claim is rejected over art showing a steel nut. Best next step?',
    choices: [
      'Argue the dependent limitation is patentably distinct if the combination is non-obvious',
      'Cancel all claims',
      'File a terminal disclaimer only',
      'Convert to a design application',
    ],
    correctIndex: 0,
    why: 'Prosecution strategy: dependent claims can carve scope; obviousness analysis must consider the full combination.',
  },
];
