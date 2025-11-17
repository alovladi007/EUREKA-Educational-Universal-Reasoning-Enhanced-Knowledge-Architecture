import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentType, WorkflowStatus } from '../entities/content.entity';

export class CreateContentMetadataDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  keywords: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  learningObjectives: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  prerequisites?: string[];

  @ApiProperty()
  @IsNumber()
  estimatedDuration: number;

  @ApiProperty({ enum: ['beginner', 'intermediate', 'advanced'] })
  @IsEnum(['beginner', 'intermediate', 'advanced'])
  difficulty: 'beginner' | 'intermediate' | 'advanced';

  @ApiProperty()
  @IsString()
  specialty: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  systems: string[];
}

export class CreateCitationDto {
  @ApiProperty({ enum: ['book', 'journal', 'website', 'guideline'] })
  @IsEnum(['book', 'journal', 'website', 'guideline'])
  type: 'book' | 'journal' | 'website' | 'guideline';

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  authors: string[];

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  year: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  journal?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  volume?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  pages?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  doi?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  url?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  pubmedId?: string;
}

export class CreateContentDto {
  @ApiProperty({ enum: ContentType })
  @IsEnum(ContentType)
  type: ContentType;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiPropertyOptional({ enum: WorkflowStatus, default: WorkflowStatus.DRAFT })
  @IsEnum(WorkflowStatus)
  @IsOptional()
  status?: WorkflowStatus;

  @ApiProperty({ type: CreateContentMetadataDto })
  @ValidateNested()
  @Type(() => CreateContentMetadataDto)
  metadata: CreateContentMetadataDto;

  @ApiPropertyOptional({ type: [CreateCitationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCitationDto)
  @IsOptional()
  citations?: CreateCitationDto[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  relatedContent?: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  changeLog?: string;
}

export class CreateModuleDto extends CreateContentDto {
  @ApiProperty()
  @IsNumber()
  sequence: number;
}

export class CreateLessonDto extends CreateContentDto {
  @ApiProperty()
  @IsString()
  moduleId: string;

  @ApiProperty()
  @IsNumber()
  sequence: number;
}

export class CreateObjectiveDto extends CreateContentDto {
  @ApiProperty({
    enum: ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'],
  })
  @IsEnum(['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'])
  bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';

  @ApiProperty()
  @IsBoolean()
  assessable: boolean;
}
