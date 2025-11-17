import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Case } from './case.entity';

export type SessionStatus = 'in_progress' | 'completed' | 'abandoned' | 'expired';

export interface SessionState {
  revealedHistory: string[]; // IDs of revealed history questions
  performedExams: string[]; // IDs of performed physical exams
  orderedStudies: string[]; // IDs of ordered diagnostic studies
  currentDecisionNode?: string;
}

export interface ActionLog {
  timestamp: Date;
  actionType: 'history' | 'exam' | 'lab' | 'imaging' | 'procedure' | 'diagnosis' | 'management';
  actionId: string;
  result?: string;
  timeCost: number;
  resourceCost: number;
  importance?: string;
}

export interface DiagnosisAttempt {
  timestamp: Date;
  primaryDiagnosis: string;
  differentialDiagnoses: string[];
  confidence: number; // 0-100%
  isCorrect: boolean;
}

export interface ManagementPlan {
  timestamp: Date;
  interventions: string[];
  appropriatenessScore: number;
  rationale?: string;
}

export interface ScoreBreakdown {
  historyScore: number;
  examScore: number;
  diagnosticsScore: number;
  diagnosisScore: number;
  managementScore: number;
  efficiencyScore: number;
  totalScore: number;
}

export interface ClinicalReasoningMetrics {
  criticalActionsCompleted: number;
  criticalActionsTotal: number;
  unnecessaryActions: number;
  timeToCorrectDiagnosis?: number; // minutes
  diagnosticAccuracy: number; // 0-100%
  managementAppropriateness: number; // 0-100%
  efficiencyRating: number; // 0-100%
}

export interface DetailedFeedback {
  strengths: string[];
  areasForImprovement: string[];
  missedCriticalActions: string[];
  unnecessaryActions: string[];
  diagnosticApproach: string;
  managementApproach: string;
}

@Entity('case_sessions')
export class CaseSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'case_id' })
  caseId: string;

  @ManyToOne(() => Case)
  @JoinColumn({ name: 'case_id' })
  case: Case;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: ['in_progress', 'completed', 'abandoned', 'expired'],
    default: 'in_progress',
  })
  status: SessionStatus;

  // Current State
  @Column({ type: 'jsonb', name: 'session_state' })
  sessionState: SessionState;

  @Column({ type: 'jsonb', name: 'action_log', default: [] })
  actionLog: ActionLog[];

  // Diagnosis and Management
  @Column({ type: 'jsonb', name: 'diagnosis_attempts', default: [] })
  diagnosisAttempts: DiagnosisAttempt[];

  @Column({ type: 'jsonb', name: 'management_plan', nullable: true })
  managementPlan?: ManagementPlan;

  // Scoring
  @Column({ type: 'jsonb', name: 'score_breakdown', nullable: true })
  scoreBreakdown?: ScoreBreakdown;

  @Column({ type: 'jsonb', name: 'clinical_reasoning', nullable: true })
  clinicalReasoning?: ClinicalReasoningMetrics;

  @Column({ type: 'jsonb', name: 'feedback', nullable: true })
  feedback?: DetailedFeedback;

  // Time and Cost Tracking
  @Column({ type: 'int', name: 'time_spent_seconds', default: 0 })
  timeSpentSeconds: number;

  @Column({ type: 'int', name: 'resource_cost', default: 0 })
  resourceCost: number;

  // Student Notes
  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Completion Info
  @Column({ type: 'timestamp', name: 'completed_at', nullable: true })
  completedAt?: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  // Helper Methods
  getTimeSpentMinutes(): number {
    return Math.round(this.timeSpentSeconds / 60);
  }

  getTotalActionsCount(): number {
    return this.actionLog.length;
  }

  getCriticalActionsCount(): number {
    return this.actionLog.filter(action => action.importance === 'critical').length;
  }

  getUnnecessaryActionsCount(): number {
    return this.actionLog.filter(action => action.importance === 'unnecessary').length;
  }

  hasCorrectDiagnosis(): boolean {
    return this.diagnosisAttempts.some(attempt => attempt.isCorrect);
  }

  getTimeToCorrectDiagnosisMinutes(): number | null {
    const correctAttempt = this.diagnosisAttempts.find(attempt => attempt.isCorrect);
    if (!correctAttempt) return null;

    const startTime = this.createdAt.getTime();
    const diagnosisTime = new Date(correctAttempt.timestamp).getTime();
    return Math.round((diagnosisTime - startTime) / 60000);
  }

  getEfficiencyScore(): number {
    const criticalCount = this.getCriticalActionsCount();
    const unnecessaryCount = this.getUnnecessaryActionsCount();

    if (criticalCount === 0) return 0;

    const efficiency = Math.max(0, 1 - unnecessaryCount / criticalCount);
    return Math.round(efficiency * 100);
  }

  isExpired(timeLimitMinutes?: number): boolean {
    if (!timeLimitMinutes) return false;

    const elapsed = this.getTimeSpentMinutes();
    return elapsed > timeLimitMinutes;
  }

  canSubmitDiagnosis(): boolean {
    return this.status === 'in_progress' && this.diagnosisAttempts.length < 3;
  }

  canSubmitManagement(): boolean {
    return this.status === 'in_progress' && this.hasCorrectDiagnosis();
  }

  markCompleted(): void {
    this.status = 'completed';
    this.completedAt = new Date();
  }

  markAbandoned(): void {
    this.status = 'abandoned';
  }

  markExpired(): void {
    this.status = 'expired';
    this.completedAt = new Date();
  }
}
