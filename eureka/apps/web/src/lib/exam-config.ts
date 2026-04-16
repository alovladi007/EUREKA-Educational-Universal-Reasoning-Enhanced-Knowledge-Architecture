export interface ExamSection {
  id: string;
  name: string;
  questionCount?: number;
  timeMinutes?: number;
}

export interface ExamTypeConfig {
  id: string;
  name: string;
  shortName: string;
  description: string;
  totalDuration: number;
  totalQuestions: number;
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
  GRE: {
    id: 'GRE',
    name: 'GRE General Test',
    shortName: 'GRE',
    description: 'Graduate Record Examinations',
    totalDuration: 180,
    totalQuestions: 80,
    sections: [
      { id: 'quantitative', name: 'Quantitative Reasoning', questionCount: 27, timeMinutes: 47 },
      { id: 'verbal', name: 'Verbal Reasoning', questionCount: 27, timeMinutes: 41 },
      { id: 'writing', name: 'Analytical Writing', questionCount: 2, timeMinutes: 60 },
    ],
    scoreRange: { min: 260, max: 340, label: '260–340' },
  },
  GMAT: {
    id: 'GMAT',
    name: 'GMAT Focus Edition',
    shortName: 'GMAT',
    description: 'Graduate Management Admission Test',
    totalDuration: 135,
    totalQuestions: 64,
    sections: [
      { id: 'quantitative', name: 'Quantitative Reasoning', questionCount: 21, timeMinutes: 45 },
      { id: 'verbal', name: 'Verbal Reasoning', questionCount: 23, timeMinutes: 45 },
      { id: 'data_insights', name: 'Data Insights', questionCount: 20, timeMinutes: 45 },
    ],
    scoreRange: { min: 205, max: 805, label: '205–805' },
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
    sections: [
      { id: 'patent_prosecution', name: 'Patent Prosecution & Application', questionCount: 30 },
      { id: 'patentability', name: 'Patentability & Prior Art', questionCount: 20 },
      { id: 'post_issuance', name: 'Post-Issuance Proceedings', questionCount: 15 },
      { id: 'design_plant', name: 'Design & Plant Patents', questionCount: 10 },
      { id: 'pct_international', name: 'PCT & International Filing', questionCount: 10 },
      { id: 'ethics_conduct', name: 'Ethics & Professional Conduct', questionCount: 15 },
    ],
    scoreRange: { min: 0, max: 100, label: 'Pass / Fail (70% to pass)' },
    passingInfo: 'Must score 70% or higher to pass',
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
  FE: {
    id: 'FE',
    name: 'FE Exam (General)',
    shortName: 'FE',
    description: 'Fundamentals of Engineering Exam',
    totalDuration: 360,
    totalQuestions: 110,
    sections: [
      { id: 'math', name: 'Mathematics & Statistics', questionCount: 18 },
      { id: 'ethics', name: 'Ethics & Professional Practice', questionCount: 8 },
      { id: 'engineering_econ', name: 'Engineering Economics', questionCount: 10 },
      { id: 'statics', name: 'Statics', questionCount: 12 },
      { id: 'dynamics', name: 'Dynamics', questionCount: 10 },
      { id: 'mechanics_materials', name: 'Mechanics of Materials', questionCount: 10 },
      { id: 'fluid_mechanics', name: 'Fluid Mechanics', questionCount: 10 },
      { id: 'thermodynamics', name: 'Thermodynamics & Heat Transfer', questionCount: 12 },
      { id: 'electrical', name: 'Electricity & Magnetism', questionCount: 10 },
      { id: 'materials', name: 'Material Science', questionCount: 10 },
    ],
    scoreRange: { min: 0, max: 100, label: 'Pass / Fail' },
    passingInfo: 'Score varies by discipline; ~50–60% typically required',
  },
  FE_EE: {
    id: 'FE_EE',
    name: 'FE Electrical & Computer',
    shortName: 'FE EE',
    description: 'Fundamentals of Engineering — Electrical & Computer Engineering',
    totalDuration: 320,
    totalQuestions: 110,
    sections: [
      { id: 'fee_math', name: 'Mathematics', questionCount: 8 },
      { id: 'fee_prob_stats', name: 'Probability & Statistics', questionCount: 4 },
      { id: 'fee_ethics', name: 'Ethics & Professional Practice', questionCount: 4 },
      { id: 'fee_eng_econ', name: 'Engineering Economics', questionCount: 4 },
      { id: 'fee_materials', name: 'Electrical Materials', questionCount: 4 },
      { id: 'fee_eng_sci', name: 'Engineering Sciences', questionCount: 4 },
      { id: 'fee_circuits', name: 'Circuit Analysis (DC & AC)', questionCount: 11 },
      { id: 'fee_linear_sys', name: 'Linear Systems', questionCount: 6 },
      { id: 'fee_signal_proc', name: 'Signal Processing', questionCount: 6 },
      { id: 'fee_electronics', name: 'Electronics', questionCount: 7 },
      { id: 'fee_power_sys', name: 'Power Systems', questionCount: 7 },
      { id: 'fee_electromagnetics', name: 'Electromagnetics', questionCount: 6 },
      { id: 'fee_control', name: 'Control Systems', questionCount: 7 },
      { id: 'fee_comms', name: 'Communications', questionCount: 6 },
      { id: 'fee_networks', name: 'Computer Networks', questionCount: 6 },
      { id: 'fee_digital', name: 'Digital Systems', questionCount: 7 },
      { id: 'fee_comp_sys', name: 'Computer Systems', questionCount: 5 },
      { id: 'fee_software', name: 'Software Development', questionCount: 4 },
    ],
    scoreRange: { min: 0, max: 100, label: 'Pass / Fail' },
    passingInfo: 'Estimated passing score ~50–60% (scaled); 110 questions in 5 hours 20 minutes',
  },
  PE: {
    id: 'PE',
    name: 'PE Exam (Civil)',
    shortName: 'PE',
    description: 'Principles & Practice of Engineering — Professional Engineer',
    totalDuration: 480,
    totalQuestions: 80,
    sections: [
      { id: 'project_planning', name: 'Project Planning', questionCount: 8 },
      { id: 'means_methods', name: 'Means & Methods', questionCount: 8 },
      { id: 'soil_mechanics', name: 'Soil Mechanics', questionCount: 8 },
      { id: 'structural_analysis', name: 'Structural Analysis', questionCount: 10 },
      { id: 'structural_design', name: 'Structural Design', questionCount: 10 },
      { id: 'hydraulics_hydrology', name: 'Hydraulics & Hydrology', questionCount: 10 },
      { id: 'geometrics', name: 'Geometrics', questionCount: 8 },
      { id: 'materials', name: 'Materials', questionCount: 8 },
      { id: 'site_development', name: 'Site Development', questionCount: 10 },
    ],
    scoreRange: { min: 0, max: 100, label: 'Pass / Fail' },
    passingInfo: 'Cut score varies by discipline; typically ~55–65% required',
  },
  SECURITY_PLUS: {
    id: 'SECURITY_PLUS',
    name: 'CompTIA Security+',
    shortName: 'Security+',
    description: 'CompTIA Security+ (SY0-701)',
    totalDuration: 90,
    totalQuestions: 90,
    sections: [
      { id: 'threats_attacks', name: 'Threats, Vulnerabilities & Attacks', questionCount: 22 },
      { id: 'architecture', name: 'Security Architecture', questionCount: 18 },
      { id: 'implementation', name: 'Security Implementation', questionCount: 22 },
      { id: 'operations', name: 'Security Operations', questionCount: 18 },
      { id: 'governance', name: 'Security Program Management & Oversight', questionCount: 10 },
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
};

export const EXAM_TYPE_LIST = Object.values(EXAM_CONFIGS);

export function getExamConfig(examType: string): ExamTypeConfig {
  return EXAM_CONFIGS[examType] || EXAM_CONFIGS.GRE;
}

export function getSectionsForExam(examType: string): ExamSection[] {
  return getExamConfig(examType).sections;
}
