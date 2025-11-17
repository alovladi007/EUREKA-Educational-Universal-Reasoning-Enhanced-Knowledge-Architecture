import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export enum ContextType {
  GENERAL = 'general',
  COURSE = 'course',
  ASSIGNMENT = 'assignment',
  ASSESSMENT = 'assessment',
  LESSON = 'lesson',
}

export class CreateConversationDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  course_id?: string;

  @ApiProperty({ enum: ContextType, required: false })
  @IsEnum(ContextType)
  @IsOptional()
  context_type?: ContextType;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  context_id?: string;
}

export class SendMessageDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  conversation_id: string;

  @ApiProperty({ example: 'Can you explain the difference between arteries and veins?' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  include_context?: boolean;
}

export class RegenerateMessageDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  conversation_id: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  message_id: string;
}

export class GetConversationsQueryDto {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  course_id?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  limit?: number;
}

export class GetMessagesQueryDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  limit?: number;
}
