import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

// Types and Interfaces
export type ImportanceLevel = 'critical' | 'important' | 'helpful' | 'unnecessary';
export type CaseComplexity = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type CaseSpecialty =
  | 'internal_medicine'
  | 'surgery'
  | 'pediatrics'
  | 'emergency_medicine'
  | 'obgyn'
  | 'psychiatry'
  | 'neurology'
  | 'cardiology'
  | 'pulmonology'
  | 'gastroenterology'
  | 'endocrinology'
  | 'nephrology'
  | 'hematology_oncology'
  | 'infectious_disease'
  | 'rheumatology'
  | 'dermatology';

export interface Demographics {
  age: number;
  gender: 'male' | 'female' | 'other';
  ethnicity?: string;
  occupation?: string;
}

export interface Vitals {
  temperature: number;
  heartRate: number;
  bloodPressure: string;
  respiratoryRate: number;
  oxygenSaturation: number;
  height?: number;
  weight?: number;
  bmi?: number;
}

export interface HistoryQuestion {
  id: string;
  question: string;
  answer: string;
  category: 'hpi' | 'pmh' | 'medications' | 'allergies' | 'social' | 'family';
  importance: ImportanceLevel;
  cost: number; // time cost in seconds
  prerequisite?: string; // requires another question to be asked first
}

export interface HistorySection {
  title: string;
  questions: HistoryQuestion[];
}

export interface PhysicalExam {
  id: string;
  system: string; // 'cardiovascular', 'pulmonary', 'abdominal', etc.
  examination: string;
  finding: string;
  importance: ImportanceLevel;
  cost: number; // time cost in seconds
  isAbnormal: boolean;
}

export interface DiagnosticStudy {
  id: string;
  type: 'lab' | 'imaging' | 'procedure';
  name: string;
  result: string;
  interpretation?: string;
  imageUrl?: string; // for imaging studies
  importance: ImportanceLevel;
  cost: number; // resource cost units
  timeCost: number; // time to get results in seconds
  prerequisite?: string;
}

export interface Diagnosis {
  name: string;
  likelihood: number; // 0-100%
  reasoning?: string;
}

export interface ManagementOption {
  id: string;
  intervention: string;
  appropriateness: 'critical' | 'appropriate' | 'neutral' | 'inappropriate' | 'harmful';
  rationale?: string;
  cost?: number;
}

export interface DecisionNode {
  id: string;
  trigger: string; // what action triggers this node
  consequence: string; // what happens
  nextNodes?: string[]; // possible branches from here
  isCritical?: boolean;
  affectsOutcome?: boolean;
}

export interface LearningObjective {
  category: 'diagnosis' | 'management' | 'pathophysiology' | 'clinical_skills';
  objective: string;
  bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
}

export interface ScoringRubric {
  historyWeight: number; // default 20%
  examWeight: number; // default 20%
  diagnosticsWeight: number; // default 15%
  diagnosisWeight: number; // default 25%
  managementWeight: number; // default 15%
  efficiencyWeight: number; // default 5%
}

@Entity('cases')
export class Case {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'org_id' })
  orgId: string;

  @Column({ type: 'uuid', name: 'author_id' })
  authorId: string;

  // Basic Information
  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: [
      'internal_medicine',
      'surgery',
      'pediatrics',
      'emergency_medicine',
      'obgyn',
      'psychiatry',
      'neurology',
      'cardiology',
      'pulmonology',
      'gastroenterology',
      'endocrinology',
      'nephrology',
      'hematology_oncology',
      'infectious_disease',
      'rheumatology',
      'dermatology',
    ],
  })
  specialty: CaseSpecialty;

  @Column({
    type: 'enum',
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
  })
  complexity: CaseComplexity;

  @Column({ type: 'int', name: 'estimated_time_minutes' })
  estimatedTimeMinutes: number;

  @Column({ type: 'int', name: 'time_limit_minutes', nullable: true })
  timeLimitMinutes?: number;

  // Patient Presentation
  @Column({ type: 'jsonb' })
  demographics: Demographics;

  @Column({ type: 'varchar', length: 500, name: 'chief_complaint' })
  chiefComplaint: string;

  @Column({ type: 'text', name: 'presenting_scenario' })
  presentingScenario: string;

  @Column({ type: 'jsonb' })
  vitals: Vitals;

  // Clinical Data
  @Column({ type: 'jsonb', name: 'history_sections' })
  historySections: HistorySection[];

  @Column({ type: 'jsonb', name: 'physical_exam' })
  physicalExam: PhysicalExam[];

  @Column({ type: 'jsonb', name: 'diagnostic_studies' })
  diagnosticStudies: DiagnosticStudy[];

  // Diagnosis Information
  @Column({ type: 'varchar', length: 500, name: 'correct_diagnosis' })
  correctDiagnosis: string;

  @Column({ type: 'jsonb', name: 'differential_diagnoses' })
  differentialDiagnoses: Diagnosis[];

  @Column({ type: 'text', name: 'diagnosis_rationale' })
  diagnosisRationale: string;

  // Management
  @Column({ type: 'jsonb', name: 'management_options' })
  managementOptions: ManagementOption[];

  // Branching Logic
  @Column({ type: 'jsonb', name: 'decision_nodes', default: [] })
  decisionNodes: DecisionNode[];

  // Educational Content
  @Column({ type: 'jsonb', name: 'learning_objectives' })
  learningObjectives: LearningObjective[];

  @Column({ type: 'text', array: true, name: 'teaching_points' })
  teachingPoints: string[];

  @Column({ type: 'text', array: true, default: [] })
  references: string[];

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  // Scoring Configuration
  @Column({ type: 'jsonb', name: 'scoring_rubric', nullable: true })
  scoringRubric?: ScoringRubric;

  // Metadata
  @Column({ type: 'boolean', name: 'is_published', default: false })
  isPublished: boolean;

  @Column({ type: 'boolean', name: 'is_archived', default: false })
  isArchived: boolean;

  @Column({ type: 'int', name: 'times_attempted', default: 0 })
  timesAttempted: number;

  @Column({ type: 'float', name: 'average_score', nullable: true })
  averageScore?: number;

  @Column({ type: 'float', name: 'average_time_minutes', nullable: true })
  averageTimeMinutes?: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  // Helper Methods
  getCriticalHistoryQuestions(): HistoryQuestion[] {
    return this.historySections
      .flatMap(section => section.questions)
      .filter(q => q.importance === 'critical');
  }

  getCriticalPhysicalExams(): PhysicalExam[] {
    return this.physicalExam.filter(exam => exam.importance === 'critical');
  }

  getCriticalDiagnosticStudies(): DiagnosticStudy[] {
    return this.diagnosticStudies.filter(study => study.importance === 'critical');
  }

  getCriticalManagementOptions(): ManagementOption[] {
    return this.managementOptions.filter(
      option => option.appropriateness === 'critical'
    );
  }

  getTotalCost(): number {
    const historyCost = this.historySections
      .flatMap(section => section.questions)
      .reduce((sum, q) => sum + q.cost, 0);

    const examCost = this.physicalExam.reduce((sum, exam) => sum + exam.cost, 0);

    const studyCost = this.diagnosticStudies.reduce((sum, study) => sum + study.cost, 0);

    return historyCost + examCost + studyCost;
  }

  getDefaultScoringRubric(): ScoringRubric {
    return this.scoringRubric || {
      historyWeight: 20,
      examWeight: 20,
      diagnosticsWeight: 15,
      diagnosisWeight: 25,
      managementWeight: 15,
      efficiencyWeight: 5,
    };
  }
}
