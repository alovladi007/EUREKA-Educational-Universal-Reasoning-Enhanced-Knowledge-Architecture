import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ItemType {
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
  CLINICAL_VIGNETTE = 'clinical_vignette',
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  VERY_HARD = 'very_hard',
}

export class ItemOption {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsBoolean()
  isCorrect: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  explanation?: string;
}

export class ItemContent {
  @ApiProperty({ description: 'The question stem/clinical vignette' })
  @IsString()
  @IsNotEmpty()
  stem: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  vignette?: string;

  @ApiProperty({ type: [ItemOption] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemOption)
  options: ItemOption[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  correctAnswers: string[];

  @ApiProperty()
  @IsString()
  explanation: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  references?: string[];
}

export class CreateItemDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  orgId: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  authorId?: string;

  @ApiProperty({ enum: ItemType })
  @IsEnum(ItemType)
  type: ItemType;

  @ApiProperty({ enum: DifficultyLevel })
  @IsEnum(DifficultyLevel)
  difficultyLevel: DifficultyLevel;

  @ApiProperty({ type: ItemContent })
  @ValidateNested()
  @Type(() => ItemContent)
  content: ItemContent;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  learningObjectives: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  blueprint?: string;
}

export class UpdateItemDto {
  @ApiProperty({ enum: ItemType, required: false })
  @IsEnum(ItemType)
  @IsOptional()
  type?: ItemType;

  @ApiProperty({ enum: DifficultyLevel, required: false })
  @IsEnum(DifficultyLevel)
  @IsOptional()
  difficultyLevel?: DifficultyLevel;

  @ApiProperty({ type: ItemContent, required: false })
  @ValidateNested()
  @Type(() => ItemContent)
  @IsOptional()
  content?: ItemContent;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  learningObjectives?: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  blueprint?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  difficulty?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  discrimination?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  guessing?: number;
}

export class ItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  orgId: string;

  @ApiProperty()
  authorId: string;

  @ApiProperty({ enum: ItemType })
  type: ItemType;

  @ApiProperty({ enum: DifficultyLevel })
  difficultyLevel: DifficultyLevel;

  @ApiProperty({ type: ItemContent })
  content: ItemContent;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty({ type: [String] })
  learningObjectives: string[];

  @ApiProperty()
  blueprint: string;

  @ApiProperty()
  difficulty: number;

  @ApiProperty()
  discrimination: number;

  @ApiProperty()
  guessing: number;

  @ApiProperty()
  timesUsed: number;

  @ApiProperty()
  timesCorrect: number;

  @ApiProperty()
  averageTimeSeconds: number;

  @ApiProperty()
  pointBiserial: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isReviewed: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ItemListDto {
  @ApiProperty({ type: [ItemResponseDto] })
  items: ItemResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
