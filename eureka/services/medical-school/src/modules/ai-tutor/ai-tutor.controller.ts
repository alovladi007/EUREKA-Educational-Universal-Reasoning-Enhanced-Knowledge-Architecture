import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AITutorService } from './ai-tutor.service';
import {
  CreateConversationDto,
  SendMessageDto,
  RegenerateMessageDto,
} from './dto/ai-tutor.dto';

@ApiTags('ai-tutor')
@Controller('ai-tutor')
export class AITutorController {
  constructor(private readonly aiTutorService: AITutorService) {}

  // Mock user ID for demo purposes (authentication disabled)
  private readonly DEMO_USER_ID = 'demo-user-12345';

  @Post('conversations')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new conversation',
    description: 'Start a new conversation with the AI tutor',
  })
  @ApiResponse({
    status: 201,
    description: 'Conversation created successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createConversation(@Body() createDto: CreateConversationDto) {
    return this.aiTutorService.createConversation(createDto, this.DEMO_USER_ID);
  }

  @Get('conversations')
  @ApiOperation({
    summary: 'Get user conversations',
    description: 'Retrieve all conversations for the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversations retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserConversations(
    @Query('course_id') courseId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.aiTutorService.getUserConversations(this.DEMO_USER_ID, courseId, limit);
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
  async getConversation(@Param('conversationId') conversationId: string) {
    return this.aiTutorService.getConversation(conversationId, this.DEMO_USER_ID);
  }

  @Get('conversations/:conversationId/messages')
  @ApiOperation({
    summary: 'Get conversation messages',
    description: 'Retrieve all messages in a conversation',
  })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async getConversationMessages(
    @Param('conversationId') conversationId: string,
    @Query('limit') limit?: number,
  ) {
    return this.aiTutorService.getConversationMessages(conversationId, this.DEMO_USER_ID, limit);
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
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'AI service error' })
  async sendMessage(@Body() sendDto: SendMessageDto) {
    return this.aiTutorService.sendMessage(sendDto, this.DEMO_USER_ID);
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
  async regenerateMessage(@Body() regenerateDto: RegenerateMessageDto) {
    return this.aiTutorService.regenerateMessage(regenerateDto, this.DEMO_USER_ID);
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
  async archiveConversation(@Param('conversationId') conversationId: string) {
    await this.aiTutorService.archiveConversation(conversationId, this.DEMO_USER_ID);
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
  async deleteConversation(@Param('conversationId') conversationId: string) {
    await this.aiTutorService.deleteConversation(conversationId, this.DEMO_USER_ID);
  }

  @Get('conversations/:conversationId/stats')
  @ApiOperation({
    summary: 'Get conversation statistics',
    description: 'Get statistics about a conversation (message count, tokens, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async getConversationStats(@Param('conversationId') conversationId: string) {
    return this.aiTutorService.getConversationStats(conversationId, this.DEMO_USER_ID);
  }
}
