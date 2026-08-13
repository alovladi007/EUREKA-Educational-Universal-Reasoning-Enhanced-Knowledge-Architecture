export interface ExamSection {
  id: string;
  name: string;
  questionCount?: number;
  /**
   * The published question range, when the exam board publishes one rather
   * than a fixed count. NCEES does this for every FE knowledge area, and
   * flattening "11-17" to a single number was how our Mathematics weight
   * ended up at 8 - below the real minimum. When present this is what gets
   * shown; questionCount stays as the midpoint for arithmetic that needs a
   * single number.
   */
  questionRange?: [number, number];
  timeMinutes?: number;
  /**
   * False when the section is taught as background rather than tested as
   * its own area. The rail then says so instead of implying exam questions.
   */
  tested?: boolean;
}

export interface ExamTypeConfig {
  id: string;
  name: string;
  shortName: string;
  description: string;
  totalDuration: number;
  totalQuestions: number;
  /**
   * Questions that count toward the score, when the exam delivers unscored
   * pretest items alongside them. Omitted when every delivered question is
   * scored.
   */
  scoredQuestions?: number;
  sections: ExamSection[];
  scoreRange: { min: number; max: number; label: string };
  passingInfo?: string;
}

export const EXAM_CONFIGS: Record<string, ExamTypeConfig> = {
  SAT: {
    id: 'SAT',
    name: 'SAT (Digital)',
    shortName: 'SAT',
    description: 'Scholastic Assessment Test',
    totalDuration: 134,
    totalQuestions: 98,
    sections: [
      { id: 'reading_writing', name: 'Reading and Writing', questionCount: 54, timeMinutes: 64 },
      { id: 'math', name: 'Math', questionCount: 44, timeMinutes: 70 },
    ],
    scoreRange: { min: 400, max: 1600, label: '400–1600' },
  },
  /**
   * GRE Physics Subject Test.
   *
   * The id stays `GRE` deliberately. It is the key in every URL
   * (/dashboard/test-prep/gre), in user_progress rows, in QBank session
   * rows and in the billing products; renaming a key to match a label
   * would orphan all of them for no gain. The name is what learners see.
   *
   * Section weights are the ETS-published content distribution for this
   * test, which sums to 100%. questionCount is that percentage of the 100
   * delivered questions, which is what the percentage means - not an
   * estimate of our own.
   */
  GRE: {
    id: 'GRE',
    name: 'Physics GRE (Subject Test)',
    shortName: 'Physics GRE',
    description: 'GRE Physics Subject Test',
    totalDuration: 170,
    totalQuestions: 100,
    sections: [
      { id: 'classical_mechanics', name: 'Classical Mechanics', questionCount: 20 },
      { id: 'electromagnetism', name: 'Electromagnetism', questionCount: 18 },
      { id: 'quantum_mechanics', name: 'Quantum Mechanics', questionCount: 12 },
      { id: 'thermo_stat_mech', name: 'Thermodynamics & Statistical Mechanics', questionCount: 10 },
      { id: 'atomic_physics', name: 'Atomic Physics', questionCount: 10 },
      { id: 'optics_waves', name: 'Optics & Wave Phenomena', questionCount: 9 },
      { id: 'specialized', name: 'Specialized Topics', questionCount: 9 },
      { id: 'special_relativity', name: 'Special Relativity', questionCount: 6 },
      { id: 'lab_methods', name: 'Laboratory Methods', questionCount: 6 },
    ],
    scoreRange: { min: 200, max: 990, label: '200–990 (10-point increments)' },
  },
  LSAT: {
    id: 'LSAT',
    name: 'Law School Admission Test',
    shortName: 'LSAT',
    description: 'Law School Admission Test',
    totalDuration: 175,
    totalQuestions: 76,
    sections: [
      { id: 'logical_reasoning', name: 'Logical Reasoning', questionCount: 26, timeMinutes: 35 },
      { id: 'analytical_reasoning', name: 'Analytical Reasoning (Logic Games)', questionCount: 23, timeMinutes: 35 },
      { id: 'reading_comprehension', name: 'Reading Comprehension', questionCount: 27, timeMinutes: 35 },
    ],
    scoreRange: { min: 120, max: 180, label: '120–180' },
  },
  PATENT_BAR: {
    id: 'PATENT_BAR',
    name: 'Patent Bar (USPTO Registration Exam)',
    shortName: 'Patent Bar',
    description: 'USPTO Registration Examination for Patent Practitioners',
    totalDuration: 360,
    totalQuestions: 100,
    /**
     * 100 questions are delivered but only 90 are SCORED — 10 are unscored
     * pretest items — and passing is 63 of those 90. Source: USPTO, General
     * Requirements Bulletin.
     */
    scoredQuestions: 90,
    /**
     * ESTIMATED section weights — NOT a USPTO-published blueprint.
     *
     * The Office publishes what is tested (MPEP Ninth Edition Rev. 01.2024;
     * PTAB Consolidated Trial Practice Guide Nov 2019; the 2013 "Changes to
     * Representation of Others" rule creating 37 CFR Part 11; the Global/IP5
     * PPH programs) but never in what proportion. These counts are derived
     * from the 828 official released-exam questions in the QBank and are kept
     * in sync with PATENT_BAR_BLUEPRINT in patent-bar-coverage.ts — read the
     * provenance block there before changing them. It records the two limits
     * that matter: our own topic classification, and the fact that every
     * source exam predates 2004, so ethics, post-issuance and international
     * practice are treated as floors rather than targets.
     */
    sections: [
      { id: 'patent_prosecution', name: 'Patent Prosecution & Application', questionCount: 55 },
      { id: 'patentability', name: 'Patentability & Prior Art', questionCount: 26 },
      { id: 'post_issuance', name: 'Post-Issuance Proceedings', questionCount: 11 },
      { id: 'design_plant', name: 'Design & Plant Patents', questionCount: 2 },
      { id: 'pct_international', name: 'PCT & International Filing', questionCount: 3 },
      { id: 'ethics_conduct', name: 'Ethics & Professional Conduct', questionCount: 3 },
    ],
    scoreRange: { min: 0, max: 100, label: 'Pass / Fail (63 of 90 scored to pass)' },
    passingInfo: 'Of the 100 questions delivered, 90 are scored; you must answer 63 of those 90 correctly (70%) to pass.',
  },
  MCAT: {
    id: 'MCAT',
    name: 'Medical College Admission Test',
    shortName: 'MCAT',
    description: 'Medical College Admission Test',
    totalDuration: 375,
    totalQuestions: 230,
    sections: [
      { id: 'chem_phys', name: 'Chemical & Physical Foundations', questionCount: 59, timeMinutes: 95 },
      { id: 'cars', name: 'Critical Analysis & Reasoning (CARS)', questionCount: 53, timeMinutes: 90 },
      { id: 'bio_biochem', name: 'Biological & Biochemical Foundations', questionCount: 59, timeMinutes: 95 },
      { id: 'psych_soc', name: 'Psychological, Social & Biological Foundations', questionCount: 59, timeMinutes: 95 },
    ],
    scoreRange: { min: 472, max: 528, label: '472–528' },
  },
  FE_ME: {
    id: 'FE_ME',
    name: 'FE Mechanical Engineering',
    shortName: 'FE ME',
    description: 'Fundamentals of Engineering — Mechanical Engineering',
    totalDuration: 320,
    totalQuestions: 110,
    sections: [
      { id: 'fme_math', name: 'Mathematics', questionCount: 7 },
      { id: 'fme_prob_stats', name: 'Probability & Statistics', questionCount: 4 },
      { id: 'fme_comp_tools', name: 'Computational Tools', questionCount: 3 },
      { id: 'fme_ethics', name: 'Ethics & Professional Practice', questionCount: 4 },
      { id: 'fme_eng_econ', name: 'Engineering Economics', questionCount: 4 },
      { id: 'fme_statics', name: 'Statics', questionCount: 9 },
      { id: 'fme_dynamics', name: 'Dynamics, Kinematics & Vibrations', questionCount: 10 },
      { id: 'fme_mechanics', name: 'Mechanics of Materials', questionCount: 9 },
      { id: 'fme_materials', name: 'Material Science', questionCount: 6 },
      { id: 'fme_fluids', name: 'Fluid Mechanics', questionCount: 9 },
      { id: 'fme_thermo', name: 'Thermodynamics', questionCount: 9 },
      { id: 'fme_heat', name: 'Heat Transfer', questionCount: 8 },
      { id: 'fme_controls', name: 'Measurements, Instrumentation & Controls', questionCount: 6 },
      { id: 'fme_design', name: 'Mechanical Design & Analysis', questionCount: 10 },
      { id: 'fme_manufacturing', name: 'Manufacturing Processes', questionCount: 4 },
      { id: 'fme_management', name: 'Engineering Management', questionCount: 3 },
    ],
    scoreRange: { min: 0, max: 100, label: 'Pass / Fail' },
    passingInfo: 'Estimated passing score ~50–60% (scaled); 110 questions in 5 hours 20 minutes',
  },
  FE_EE: {
    id: 'FE_EE',
    name: 'FE Electrical & Computer',
    shortName: 'FE EE',
    description: 'Fundamentals of Engineering — Electrical & Computer Engineering',
    totalDuration: 320,
    totalQuestions: 110,
    /**
     * Ranges are the NCEES published specification for FE Electrical and
     * Computer, effective July 2020 (17 knowledge areas, 110 questions,
     * 6-hour appointment of which 5 h 20 min is testing time).
     *
     * They replaced single numbers invented for this app, four of which sat
     * BELOW the published minimum - Mathematics was 8 against a real 11-17 -
     * and which summed to 106 rather than 110.
     *
     * `fee_eng_sci` is ours, not NCEES's: Engineering Sciences is a knowledge
     * area in other FE disciplines but not in Electrical and Computer. It is
     * kept as background because the material genuinely helps, and marked
     * tested:false so nothing claims the exam asks about it.
     */
    sections: [
      { id: 'fee_math', name: 'Mathematics', questionRange: [11, 17], questionCount: 14 },
      { id: 'fee_prob_stats', name: 'Probability & Statistics', questionRange: [4, 6], questionCount: 5 },
      { id: 'fee_ethics', name: 'Ethics & Professional Practice', questionRange: [4, 6], questionCount: 5 },
      { id: 'fee_eng_econ', name: 'Engineering Economics', questionRange: [5, 8], questionCount: 6 },
      { id: 'fee_materials', name: 'Properties of Electrical Materials', questionRange: [4, 6], questionCount: 5 },
      { id: 'fee_eng_sci', name: 'Engineering Sciences', tested: false },
      { id: 'fee_circuits', name: 'Circuit Analysis (DC & AC Steady State)', questionRange: [11, 17], questionCount: 14 },
      { id: 'fee_linear_sys', name: 'Linear Systems', questionRange: [5, 8], questionCount: 6 },
      { id: 'fee_signal_proc', name: 'Signal Processing', questionRange: [5, 8], questionCount: 6 },
      { id: 'fee_electronics', name: 'Electronics', questionRange: [7, 11], questionCount: 9 },
      { id: 'fee_power_sys', name: 'Power Systems', questionRange: [8, 12], questionCount: 10 },
      { id: 'fee_electromagnetics', name: 'Electromagnetics', questionRange: [4, 6], questionCount: 5 },
      { id: 'fee_control', name: 'Control Systems', questionRange: [6, 9], questionCount: 7 },
      { id: 'fee_comms', name: 'Communications', questionRange: [5, 8], questionCount: 6 },
      { id: 'fee_networks', name: 'Computer Networks', questionRange: [4, 6], questionCount: 5 },
      { id: 'fee_digital', name: 'Digital Systems', questionRange: [8, 12], questionCount: 10 },
      { id: 'fee_comp_sys', name: 'Computer Systems', questionRange: [5, 8], questionCount: 6 },
      { id: 'fee_software', name: 'Software Engineering', questionRange: [4, 6], questionCount: 5 },
    ],
    scoreRange: { min: 0, max: 100, label: 'Pass / Fail' },
    passingInfo: '110 questions; 5 hours 20 minutes of testing within a 6-hour appointment. NCEES does not publish a fixed passing score - it is set by standard-setting and scaled.',
  },
  PE_EE: {
    id: 'PE_EE',
    name: 'PE Electrical & Computer (Power)',
    shortName: 'PE EE',
    description: 'Principles & Practice of Engineering — Electrical & Computer Engineering (Power)',
    totalDuration: 480,
    totalQuestions: 80,
    sections: [
      { id: 'pee_general', name: 'General Power Engineering', questionCount: 7 },
      { id: 'pee_measurement', name: 'Measurement & Instrumentation', questionCount: 6 },
      { id: 'pee_circuits', name: 'Circuit Analysis', questionCount: 8 },
      { id: 'pee_rotating', name: 'Rotating Machines & Electric Drives', questionCount: 10 },
      { id: 'pee_electromagnetics', name: 'Electromagnetic Devices', questionCount: 7 },
      { id: 'pee_transmission', name: 'Transmission & Distribution', questionCount: 10 },
      { id: 'pee_protection', name: 'Protection', questionCount: 10 },
      { id: 'pee_power_quality', name: 'Power Quality & Reliability', questionCount: 6 },
      { id: 'pee_codes', name: 'Codes & Standards (NEC/NESC)', questionCount: 8 },
      { id: 'pee_power_system', name: 'Power System Analysis', questionCount: 8 },
    ],
    scoreRange: { min: 0, max: 100, label: 'Pass / Fail' },
    passingInfo: 'Cut score varies; typically ~55–65% required; 80 questions in 8 hours',
  },
  SECURITY_PLUS: {
    id: 'SECURITY_PLUS',
    name: 'CompTIA Security+',
    shortName: 'Security+',
    description: 'CompTIA Security+ (SY0-701)',
    totalDuration: 90,
    totalQuestions: 90,
    sections: [
      { id: 'general_concepts', name: 'General Security Concepts', questionCount: 11 },
      { id: 'threats_vuln', name: 'Threats, Vulnerabilities & Mitigations', questionCount: 20 },
      { id: 'architecture', name: 'Security Architecture', questionCount: 16 },
      { id: 'operations', name: 'Security Operations', questionCount: 25 },
      { id: 'program_mgmt', name: 'Security Program Management & Oversight', questionCount: 18 },
    ],
    scoreRange: { min: 100, max: 900, label: '100–900 (750 to pass)' },
    passingInfo: 'Passing score is 750 on a scale of 100–900',
  },
  CISSP: {
    id: 'CISSP',
    name: 'CISSP',
    shortName: 'CISSP',
    description: 'Certified Information Systems Security Professional',
    totalDuration: 240,
    totalQuestions: 150,
    sections: [
      { id: 'security_risk', name: 'Security & Risk Management', questionCount: 23 },
      { id: 'asset_security', name: 'Asset Security', questionCount: 15 },
      { id: 'security_architecture', name: 'Security Architecture & Engineering', questionCount: 20 },
      { id: 'comm_network', name: 'Communication & Network Security', questionCount: 20 },
      { id: 'iam', name: 'Identity & Access Management (IAM)', questionCount: 20 },
      { id: 'security_assessment', name: 'Security Assessment & Testing', questionCount: 17 },
      { id: 'security_operations', name: 'Security Operations', questionCount: 20 },
      { id: 'software_security', name: 'Software Development Security', questionCount: 15 },
    ],
    scoreRange: { min: 0, max: 1000, label: '0–1000 (700 to pass)' },
    passingInfo: 'Passing score is 700 out of 1000',
  },
  NCLEX_RN: {
    id: 'NCLEX_RN',
    name: 'NCLEX-RN',
    shortName: 'NCLEX',
    description: 'NCLEX-RN (2026 test plan, effective 2026-04-01 through 2029-03-31)',
    // Variable-length CAT: 85-150 items in up to 5 hours. We model the
    // minimum-length test (85 delivered, 70 scored + 15 unscored pretest);
    // the CAT ends anywhere between 85 and 150 depending on ability estimate.
    totalDuration: 300,
    totalQuestions: 85,
    scoredQuestions: 70,
    // NCSBN publishes each Client Needs category as a PERCENTAGE range of
    // scored items, not a fixed count (Management of Care 15-21%, etc.).
    // questionRange is that range applied to the 70 scored items of a
    // minimum-length test; questionCount is the midpoint so per-section
    // arithmetic still sums to 70. Same treatment as the FE ranges above -
    // flattening a published range to one number is how FE Mathematics
    // once ended up below its real minimum.
    sections: [
      { id: 'mgmt_of_care', name: 'Management of Care', questionCount: 13, questionRange: [11, 15] },
      { id: 'safety_infection', name: 'Safety & Infection Control', questionCount: 9, questionRange: [7, 11] },
      { id: 'health_promotion', name: 'Health Promotion & Maintenance', questionCount: 6, questionRange: [4, 8] },
      { id: 'psychosocial', name: 'Psychosocial Integrity', questionCount: 6, questionRange: [4, 8] },
      { id: 'basic_care', name: 'Basic Care & Comfort', questionCount: 6, questionRange: [4, 8] },
      { id: 'pharm_parenteral', name: 'Pharmacological & Parenteral Therapies', questionCount: 11, questionRange: [9, 13] },
      { id: 'reduction_risk', name: 'Reduction of Risk Potential', questionCount: 9, questionRange: [7, 11] },
      { id: 'physio_adaptation', name: 'Physiological Adaptation', questionCount: 10, questionRange: [8, 12] },
    ],
    scoreRange: { min: 0, max: 100, label: 'Pass / Fail (logit-based CAT, standard 0.00)' },
    passingInfo:
      'Pass/fail decided by the CAT ability estimate against the 0.00-logit passing standard - there is no percentage score. The 2026 test plan holds the standard, item types, and category weights through 2029-03-31.',
  },
};

export const EXAM_TYPE_LIST = Object.values(EXAM_CONFIGS);

export function getExamConfig(examType: string): ExamTypeConfig {
  return EXAM_CONFIGS[examType] || EXAM_CONFIGS.GRE;
}

export function getSectionsForExam(examType: string): ExamSection[] {
  return getExamConfig(examType).sections;
}

/**
 * The one-line summary under an exam's title.
 *
 * It used to read "{sections.length} sections", which is ambiguous where an
 * exam's scoring blueprint and its study syllabus are different lists.
 * Patent Bar is the clearest case: the config carries six estimated
 * blueprint areas while the course teaches nine sections, so the header
 * said "6 sections" directly above a nine-section syllabus. Delivered
 * questions and total time mean the same thing for every exam, so the
 * header states those instead and the section counts live where they are
 * unambiguous - the course rail says how many it teaches.
 */
export function examSummaryLine(examType: string): string {
  const c = getExamConfig(examType);
  const parts: string[] = [];

  if (c.totalQuestions) {
    parts.push(
      c.scoredQuestions && c.scoredQuestions !== c.totalQuestions
        ? `${c.totalQuestions} questions (${c.scoredQuestions} scored)`
        : `${c.totalQuestions} questions`,
    );
  }
  if (c.totalDuration) {
    const h = Math.floor(c.totalDuration / 60);
    const m = c.totalDuration % 60;
    parts.push(h ? (m ? `${h} h ${m} min` : `${h} h`) : `${m} min`);
  }
  parts.push(c.scoreRange.label);
  return parts.join(' · ');
}
