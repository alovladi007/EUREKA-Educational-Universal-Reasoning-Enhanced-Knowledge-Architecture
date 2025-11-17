import { PartialType } from '@nestjs/swagger';
import { CreateContentDto } from './create-content.dto';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { WorkflowStatus } from '../entities/content.entity';

export class UpdateContentDto extends PartialType(CreateContentDto) {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  changeLog?: string;
}

export class UpdateWorkflowStatusDto {
  @ApiPropertyOptional({ enum: WorkflowStatus })
  @IsEnum(WorkflowStatus)
  status: WorkflowStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  comment?: string;
}
