import {
  IsString,
  IsUUID,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  Max,
  ArrayMinSize,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CaseComplexity,
  CaseSpecialty,
  Demographics,
  Vitals,
  HistorySection,
  PhysicalExam,
  DiagnosticStudy,
  Diagnosis,
  ManagementOption,
  DecisionNode,
  LearningObjective,
  ScoringRubric,
} from '../../../entities/case.entity';

// ==================== Create/Update DTOs ====================

export class CreateCaseDto {
  @ApiProperty()
  @IsUUID()
  orgId: string;

  @ApiProperty()
  @IsUUID()
  authorId: string;

  @ApiProperty({ example: '65-year-old man with chest pain' })
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ enum: [
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
  ] })
  @IsEnum([
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
  ])
  specialty: CaseSpecialty;

  @ApiProperty({ enum: ['beginner', 'intermediate', 'advanced', 'expert'] })
  @IsEnum(['beginner', 'intermediate', 'advanced', 'expert'])
  complexity: CaseComplexity;

  @ApiProperty()
  @IsNumber()
  @Min(5)
  @Max(180)
  estimatedTimeMinutes: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  timeLimitMinutes?: number;

  @ApiProperty()
  @IsObject()
  demographics: Demographics;

  @ApiProperty()
  @IsString()
  chiefComplaint: string;

  @ApiProperty()
  @IsString()
  presentingScenario: string;

  @ApiProperty()
  @IsObject()
  vitals: Vitals;

  @ApiProperty({ type: 'array' })
  @IsArray()
  historySections: HistorySection[];

  @ApiProperty({ type: 'array' })
  @IsArray()
  physicalExam: PhysicalExam[];

  @ApiProperty({ type: 'array' })
  @IsArray()
  diagnosticStudies: DiagnosticStudy[];

  @ApiProperty()
  @IsString()
  correctDiagnosis: string;

  @ApiProperty({ type: 'array' })
  @IsArray()
  differentialDiagnoses: Diagnosis[];

  @ApiProperty()
  @IsString()
  diagnosisRationale: string;

  @ApiProperty({ type: 'array' })
  @IsArray()
  managementOptions: ManagementOption[];

  @ApiPropertyOptional({ type: 'array' })
  @IsOptional()
  @IsArray()
  decisionNodes?: DecisionNode[];

  @ApiProperty({ type: 'array' })
  @IsArray()
  learningObjectives: LearningObjective[];

  @ApiProperty({ type: 'array' })
  @IsArray()
  teachingPoints: string[];

  @ApiPropertyOptional({ type: 'array' })
  @IsOptional()
  @IsArray()
  references?: string[];

  @ApiPropertyOptional({ type: 'array' })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  scoringRubric?: ScoringRubric;
}

export class UpdateCaseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced', 'expert'])
  complexity?: CaseComplexity;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  demographics?: Demographics;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  vitals?: Vitals;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  historySections?: HistorySection[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  physicalExam?: PhysicalExam[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  diagnosticStudies?: DiagnosticStudy[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  managementOptions?: ManagementOption[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  tags?: string[];
}

// ==================== Search/Filter DTOs ====================

export class SearchCasesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 20;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  specialty?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  complexity?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isPublished?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tags?: string;
}

// ==================== Session DTOs ====================

export class StartCaseSessionDto {
  @ApiProperty()
  @IsUUID()
  caseId: string;
}

export class TakeActionDto {
  @ApiProperty({ enum: ['history', 'exam', 'lab', 'imaging', 'procedure'] })
  @IsEnum(['history', 'exam', 'lab', 'imaging', 'procedure'])
  actionType: 'history' | 'exam' | 'lab' | 'imaging' | 'procedure';

  @ApiProperty({ description: 'ID of the action from the case data' })
  @IsString()
  actionId: string;
}

export class SubmitDiagnosisDto {
  @ApiProperty()
  @IsString()
  primaryDiagnosis: string;

  @ApiProperty({ type: 'array' })
  @IsArray()
  @ArrayMinSize(0)
  differentialDiagnoses: string[];

  @ApiProperty({ minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  confidence: number;
}

export class SubmitManagementDto {
  @ApiProperty({ type: 'array' })
  @IsArray()
  @ArrayMinSize(1)
  interventions: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rationale?: string;
}

export class UpdateSessionNotesDto {
  @ApiProperty()
  @IsString()
  notes: string;
}

// ==================== Response DTOs ====================

export class CaseListItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  specialty: string;

  @ApiProperty()
  complexity: string;

  @ApiProperty()
  estimatedTimeMinutes: number;

  @ApiProperty()
  timesAttempted: number;

  @ApiProperty()
  averageScore?: number;

  @ApiProperty()
  isPublished: boolean;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  createdAt: Date;
}

export class CaseListDto {
  @ApiProperty({ type: [CaseListItemDto] })
  items: CaseListItemDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}

export class CaseDetailDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  specialty: string;

  @ApiProperty()
  complexity: string;

  @ApiProperty()
  estimatedTimeMinutes: number;

  @ApiProperty()
  timeLimitMinutes?: number;

  @ApiProperty()
  chiefComplaint: string;

  @ApiProperty()
  presentingScenario: string;

  @ApiProperty()
  demographics: Demographics;

  @ApiProperty()
  vitals: Vitals;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  learningObjectives: LearningObjective[];

  @ApiProperty()
  teachingPoints: string[];

  @ApiProperty()
  timesAttempted: number;

  @ApiProperty()
  averageScore?: number;

  @ApiProperty()
  isPublished: boolean;
}

export class SessionStateDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  caseId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  sessionState: any;

  @ApiProperty()
  actionLog: any[];

  @ApiProperty()
  diagnosisAttempts: any[];

  @ApiProperty()
  timeSpentSeconds: number;

  @ApiProperty()
  resourceCost: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class SessionSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  caseTitle: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  timeSpentMinutes: number;

  @ApiProperty()
  scoreBreakdown?: any;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  completedAt?: Date;
}

export class CaseAnalyticsDto {
  @ApiProperty()
  caseId: string;

  @ApiProperty()
  totalAttempts: number;

  @ApiProperty()
  uniqueUsers: number;

  @ApiProperty()
  averageScore: number;

  @ApiProperty()
  averageTimeMinutes: number;

  @ApiProperty()
  completionRate: number;

  @ApiProperty()
  averageDiagnosticAccuracy: number;

  @ApiProperty()
  commonMistakes: string[];

  @ApiProperty()
  frequentlyOrderedStudies: { study: string; count: number }[];
}

export class UserPerformanceDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  totalCasesAttempted: number;

  @ApiProperty()
  totalCasesCompleted: number;

  @ApiProperty()
  averageScore: number;

  @ApiProperty()
  averageTimeMinutes: number;

  @ApiProperty()
  performanceBySpecialty: {
    specialty: string;
    casesAttempted: number;
    averageScore: number;
  }[];

  @ApiProperty()
  performanceByComplexity: {
    complexity: string;
    casesAttempted: number;
    averageScore: number;
  }[];

  @ApiProperty()
  recentSessions: SessionSummaryDto[];
}
