import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

export enum StationDomain {
  HISTORY_TAKING = 'history_taking',
  PHYSICAL_EXAM = 'physical_exam',
  COMMUNICATION = 'communication',
  PROCEDURAL_SKILLS = 'procedural_skills',
  CLINICAL_REASONING = 'clinical_reasoning',
  COUNSELING = 'counseling',
  EMERGENCY_MANAGEMENT = 'emergency_management',
}

export enum ChecklistItemType {
  CRITICAL = 'critical',
  IMPORTANT = 'important',
  OPTIONAL = 'optional',
}

export class ChecklistItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: ChecklistItemType })
  @IsEnum(ChecklistItemType)
  type: ChecklistItemType;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  points: number;
}

export class CreateStationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  scenario: string;

  @ApiProperty({ enum: StationDomain })
  @IsEnum(StationDomain)
  domain: StationDomain;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(30)
  durationMinutes: number;

  @ApiProperty({ type: [ChecklistItemDto] })
  @IsArray()
  checklist: ChecklistItemDto[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  learningObjectives?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  spInstructions?: string; // Standardized Patient instructions

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  examinerNotes?: string;
}

export class UpdateStationDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  scenario?: string;

  @ApiProperty({ enum: StationDomain, required: false })
  @IsEnum(StationDomain)
  @IsOptional()
  domain?: StationDomain;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(1)
  @Max(30)
  @IsOptional()
  durationMinutes?: number;

  @ApiProperty({ type: [ChecklistItemDto], required: false })
  @IsArray()
  @IsOptional()
  checklist?: ChecklistItemDto[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  learningObjectives?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  spInstructions?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  examinerNotes?: string;
}

export class StartExamSessionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  stationId: string;
}

export class ChecklistResponseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  itemDescription: string;

  @ApiProperty()
  @IsBoolean()
  completed: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class SubmitStationScoreDto {
  @ApiProperty({ type: [ChecklistResponseDto] })
  @IsArray()
  checklistResponses: ChecklistResponseDto[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  examinerFeedback?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  communicationScore?: number; // Global rating scale

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  professionalismScore?: number;
}

export class SearchStationsDto {
  @ApiProperty({ enum: StationDomain, required: false })
  @IsEnum(StationDomain)
  @IsOptional()
  domain?: StationDomain;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  limit?: number;
}

export class StationDetailDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  scenario: string;

  @ApiProperty()
  domain: string;

  @ApiProperty()
  durationMinutes: number;

  @ApiProperty()
  checklist: ChecklistItemDto[];

  @ApiProperty()
  maxScore: number;

  @ApiProperty()
  learningObjectives?: string;

  @ApiProperty()
  createdAt: Date;
}

export class ExamSessionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  stationId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  endTime?: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  score?: number;

  @ApiProperty()
  maxScore?: number;
}

export class StationResultDto {
  @ApiProperty()
  sessionId: string;

  @ApiProperty()
  stationTitle: string;

  @ApiProperty()
  domain: string;

  @ApiProperty()
  score: number;

  @ApiProperty()
  maxScore: number;

  @ApiProperty()
  percentage: number;

  @ApiProperty()
  criticalItemsCompleted: number;

  @ApiProperty()
  criticalItemsTotal: number;

  @ApiProperty()
  importantItemsCompleted: number;

  @ApiProperty()
  importantItemsTotal: number;

  @ApiProperty()
  optionalItemsCompleted: number;

  @ApiProperty()
  optionalItemsTotal: number;

  @ApiProperty()
  communicationScore?: number;

  @ApiProperty()
  professionalismScore?: number;

  @ApiProperty()
  examinerFeedback?: string;

  @ApiProperty()
  strengths: string[];

  @ApiProperty()
  areasForImprovement: string[];

  @ApiProperty()
  completionTime: number; // in seconds
}

export class UserOSCEPerformanceDto {
  @ApiProperty()
  totalStationsCompleted: number;

  @ApiProperty()
  averageScore: number;

  @ApiProperty()
  domainBreakdown: Record<string, { completed: number; avgScore: number }>;

  @ApiProperty()
  recentSessions: ExamSessionDto[];

  @ApiProperty()
  strengthDomains: string[];

  @ApiProperty()
  improvementDomains: string[];
}
