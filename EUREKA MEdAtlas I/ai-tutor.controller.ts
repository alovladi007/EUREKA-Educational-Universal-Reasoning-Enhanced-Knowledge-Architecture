import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { AITutorService } from './ai-tutor.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateConversationDto,
  SendMessageDto,
  RegenerateMessageDto,
  GetConversationsQueryDto,
  GetMessagesQueryDto,
} from './dto/ai-tutor.dto';

@ApiTags('AI Tutor')
@Controller('ai-tutor')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AITutorController {
  constructor(private readonly aiTutorService: AITutorService) {}

  @Post('conversations')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new conversation',
    description: 'Start a new conversation with the AI tutor',
  })
  @ApiResponse({
    status: 201,
    description: 'Conversation created successfully',
    schema: {
      example: {
        id: 'c0000000-0000-0000-0000-000000000001',
        user_id: '10000000-0000-0000-0000-000000000003',
        title: 'Help with Cardiovascular Anatomy',
        context_type: 'course',
        course_id: '20000000-0000-0000-0000-000000000001',
        is_archived: false,
        created_at: '2025-11-02T10:30:00Z',
        updated_at: '2025-11-02T10:30:00Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createConversation(@Body() createDto: CreateConversationDto, @Req() req: Request) {
    const userId = req.user['sub'];
    return this.aiTutorService.createConversation(createDto, userId);
  }

  @Get('conversations')
  @ApiOperation({
    summary: 'Get user conversations',
    description: 'Retrieve all conversations for the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversations retrieved successfully',
    schema: {
      example: [
        {
          id: 'c0000000-0000-0000-0000-000000000001',
          title: 'Help with Cardiovascular Anatomy',
          context_type: 'course',
          course_id: '20000000-0000-0000-0000-000000000001',
          updated_at: '2025-11-02T10:30:00Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserConversations(@Query() query: GetConversationsQueryDto, @Req() req: Request) {
    const userId = req.user['sub'];
    return this.aiTutorService.getUserConversations(userId, query.course_id, query.limit);
  }

  @Get('conversations/:conversationId')
  @ApiOperation({
    summary: 'Get conversation details',
    description: 'Get a specific conversation by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversation retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async getConversation(@Param('conversationId') conversationId: string, @Req() req: Request) {
    const userId = req.user['sub'];
    return this.aiTutorService.getConversation(conversationId, userId);
  }

  @Get('conversations/:conversationId/messages')
  @ApiOperation({
    summary: 'Get conversation messages',
    description: 'Retrieve all messages in a conversation',
  })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully',
    schema: {
      example: [
        {
          id: 'cm000000-0000-0000-0000-000000000001',
          conversation_id: 'c0000000-0000-0000-0000-000000000001',
          role: 'user',
          content: 'Can you explain the difference between arteries and veins?',
          created_at: '2025-11-02T10:30:00Z',
        },
        {
          id: 'cm000000-0000-0000-0000-000000000002',
          conversation_id: 'c0000000-0000-0000-0000-000000000001',
          role: 'assistant',
          content: 'Great question! The main differences...',
          metadata: {
            model: 'claude-sonnet-4-20250514',
            tokens: 187,
          },
          created_at: '2025-11-02T10:30:15Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async getConversationMessages(
    @Param('conversationId') conversationId: string,
    @Query() query: GetMessagesQueryDto,
    @Req() req: Request,
  ) {
    const userId = req.user['sub'];
    return this.aiTutorService.getConversationMessages(conversationId, userId, query.limit);
  }

  @Post('messages')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send message to AI tutor',
    description: 'Send a message and get AI tutor response',
  })
  @ApiResponse({
    status: 200,
    description: 'Message sent and response received',
    schema: {
      example: {
        message: 'Great question! The main differences between arteries and veins are...',
        conversation_id: 'c0000000-0000-0000-0000-000000000001',
        message_id: 'cm000000-0000-0000-0000-000000000002',
        model: 'claude-sonnet-4-20250514',
        tokens_used: 187,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'AI service error' })
  async sendMessage(@Body() sendDto: SendMessageDto, @Req() req: Request) {
    const userId = req.user['sub'];
    return this.aiTutorService.sendMessage(sendDto, userId);
  }

  @Post('messages/regenerate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Regenerate AI response',
    description: 'Regenerate the last AI response in a conversation',
  })
  @ApiResponse({
    status: 200,
    description: 'Response regenerated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async regenerateMessage(@Body() regenerateDto: RegenerateMessageDto, @Req() req: Request) {
    const userId = req.user['sub'];
    return this.aiTutorService.regenerateMessage(regenerateDto, userId);
  }

  @Post('conversations/:conversationId/archive')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Archive conversation',
    description: 'Archive a conversation (soft delete)',
  })
  @ApiResponse({ status: 204, description: 'Conversation archived' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async archiveConversation(@Param('conversationId') conversationId: string, @Req() req: Request) {
    const userId = req.user['sub'];
    await this.aiTutorService.archiveConversation(conversationId, userId);
  }

  @Delete('conversations/:conversationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete conversation',
    description: 'Permanently delete a conversation and all its messages',
  })
  @ApiResponse({ status: 204, description: 'Conversation deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async deleteConversation(@Param('conversationId') conversationId: string, @Req() req: Request) {
    const userId = req.user['sub'];
    await this.aiTutorService.deleteConversation(conversationId, userId);
  }

  @Get('conversations/:conversationId/stats')
  @ApiOperation({
    summary: 'Get conversation statistics',
    description: 'Get statistics about a conversation (message count, tokens, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      example: {
        total_messages: 12,
        user_messages: 6,
        assistant_messages: 6,
        total_tokens: 2450,
        created_at: '2025-11-02T10:30:00Z',
        last_message_at: '2025-11-02T11:45:00Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async getConversationStats(@Param('conversationId') conversationId: string, @Req() req: Request) {
    const userId = req.user['sub'];
    return this.aiTutorService.getConversationStats(conversationId, userId);
  }
}
