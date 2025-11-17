import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { CreateItemDto, UpdateItemDto, ItemResponseDto, ItemListDto } from './dto/items.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  // Public endpoints - no authentication required for browsing questions
  @Get()
  @ApiOperation({ summary: 'List all items with filtering and pagination (Public)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'type', required: false, enum: ['single_choice', 'multiple_choice', 'clinical_vignette'] })
  @ApiQuery({ name: 'difficulty', required: false, enum: ['easy', 'medium', 'hard', 'very_hard'] })
  @ApiQuery({ name: 'tags', required: false, type: String, description: 'Comma-separated tags' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'isReviewed', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'List of items', type: ItemListDto })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('type') type?: string,
    @Query('difficulty') difficulty?: string,
    @Query('tags') tags?: string,
    @Query('search') search?: string,
    @Query('isReviewed') isReviewed?: boolean,
  ): Promise<ItemListDto> {
    return this.itemsService.findAll({
      page,
      limit,
      type,
      difficulty,
      tags: tags?.split(','),
      search,
      isReviewed,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific item by ID (Public)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Item found', type: ItemResponseDto })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async findOne(@Param('id') id: string): Promise<ItemResponseDto> {
    return this.itemsService.findOne(id);
  }

  // Protected endpoints - require authentication
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({ status: 201, description: 'Item created', type: ItemResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createItemDto: CreateItemDto): Promise<ItemResponseDto> {
    return this.itemsService.create(createItemDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an existing item' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Item updated', type: ItemResponseDto })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<ItemResponseDto> {
    return this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete an item' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Item deleted' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.itemsService.remove(id);
  }

  @Post(':id/review')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mark an item as reviewed' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Item marked as reviewed', type: ItemResponseDto })
  async markAsReviewed(@Param('id') id: string): Promise<ItemResponseDto> {
    return this.itemsService.markAsReviewed(id);
  }

  @Get(':id/analytics')
  @ApiOperation({ summary: 'Get analytics for a specific item' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Item analytics',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        timesUsed: { type: 'number' },
        timesCorrect: { type: 'number' },
        pValue: { type: 'number' },
        difficulty: { type: 'number' },
        discrimination: { type: 'number' },
        guessing: { type: 'number' },
        pointBiserial: { type: 'number' },
        averageTimeSeconds: { type: 'number' },
        qualityIndex: { type: 'number' },
      },
    },
  })
  async getAnalytics(@Param('id') id: string) {
    return this.itemsService.getAnalytics(id);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple items at once' })
  @ApiResponse({
    status: 201,
    description: 'Items created',
    schema: {
      type: 'object',
      properties: {
        created: { type: 'number' },
        failed: { type: 'number' },
        items: { type: 'array', items: { $ref: '#/components/schemas/ItemResponseDto' } },
      },
    },
  })
  async bulkCreate(@Body() items: CreateItemDto[]) {
    return this.itemsService.bulkCreate(items);
  }

  @Get('tags/popular')
  @ApiOperation({ summary: 'Get most popular tags' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Popular tags',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          tag: { type: 'string' },
          count: { type: 'number' },
        },
      },
    },
  })
  async getPopularTags(@Query('limit') limit = 20) {
    return this.itemsService.getPopularTags(limit);
  }

  // ==================== Practice Session Endpoints ====================

  @Post('sessions/start')
  @ApiOperation({ summary: 'Start a new practice session' })
  @ApiResponse({
    status: 201,
    description: 'Practice session started',
    schema: {
      type: 'object',
      properties: {
        session_id: { type: 'string' },
        mode: { type: 'string', enum: ['tutor', 'timed', 'test'] },
        items: { type: 'array', items: { $ref: '#/components/schemas/ItemResponseDto' } },
        started_at: { type: 'string', format: 'date-time' },
      },
    },
  })
  async startPracticeSession(
    @Body()
    body: {
      mode: 'tutor' | 'timed' | 'test';
      item_count: number;
      category?: string;
      difficulty?: string;
      unused_only?: boolean;
    },
  ) {
    return this.itemsService.startPracticeSession(body);
  }

  @Post('sessions/:sessionId/answer')
  @ApiOperation({ summary: 'Submit an answer for a practice session' })
  @ApiParam({ name: 'sessionId', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Answer submitted',
    schema: {
      type: 'object',
      properties: {
        is_correct: { type: 'boolean' },
        correct_answer: { type: 'string' },
        explanation: { type: 'string' },
        points_earned: { type: 'number' },
      },
    },
  })
  async submitAnswer(
    @Param('sessionId') sessionId: string,
    @Body()
    body: {
      item_id: string;
      answer: string;
      time_spent_seconds: number;
    },
  ) {
    return this.itemsService.submitAnswer(sessionId, body);
  }

  @Post('sessions/:sessionId/submit')
  @ApiOperation({ summary: 'Complete and submit a practice session' })
  @ApiParam({ name: 'sessionId', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Session submitted',
    schema: {
      type: 'object',
      properties: {
        session_id: { type: 'string' },
        score: { type: 'number' },
        percentage: { type: 'number' },
        total_questions: { type: 'number' },
        correct_answers: { type: 'number' },
        time_taken_seconds: { type: 'number' },
      },
    },
  })
  async submitPracticeSession(
    @Param('sessionId') sessionId: string,
    @Body() body: { answers: any[] },
  ) {
    return this.itemsService.submitPracticeSession(sessionId, body.answers);
  }

  @Get('sessions/:sessionId/results')
  @ApiOperation({ summary: 'Get results for a completed practice session' })
  @ApiParam({ name: 'sessionId', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Session results',
    schema: {
      type: 'object',
      properties: {
        session_id: { type: 'string' },
        mode: { type: 'string' },
        score: { type: 'number' },
        percentage: { type: 'number' },
        total_questions: { type: 'number' },
        correct_answers: { type: 'number' },
        time_taken_seconds: { type: 'number' },
        answers: { type: 'array' },
        completed_at: { type: 'string', format: 'date-time' },
      },
    },
  })
  async getPracticeSessionResults(@Param('sessionId') sessionId: string) {
    return this.itemsService.getPracticeSessionResults(sessionId);
  }
}
