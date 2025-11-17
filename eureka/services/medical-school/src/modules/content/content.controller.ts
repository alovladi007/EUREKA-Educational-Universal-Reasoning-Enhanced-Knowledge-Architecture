import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Res,
  Header,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ContentService } from './services/content.service';
import {
  CreateContentDto,
  CreateModuleDto,
  CreateLessonDto,
  CreateObjectiveDto,
} from './dto/create-content.dto';
import { UpdateContentDto, UpdateWorkflowStatusDto } from './dto/update-content.dto';
import { ContentType, WorkflowStatus } from './entities/content.entity';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  // ========== General Content Endpoints ==========

  @Post()
  @ApiOperation({ summary: 'Create new content' })
  @ApiResponse({ status: 201, description: 'Content created successfully' })
  create(@Body() createDto: CreateContentDto) {
    // TODO: Get user ID from JWT token
    const authorId = 'demo-author-id';
    return this.contentService.create(createDto, authorId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all content with optional filters' })
  @ApiQuery({ name: 'type', enum: ContentType, required: false })
  @ApiQuery({ name: 'status', enum: WorkflowStatus, required: false })
  @ApiQuery({ name: 'author', required: false })
  @ApiQuery({ name: 'tags', required: false, type: [String] })
  findAll(
    @Query('type') type?: ContentType,
    @Query('status') status?: WorkflowStatus,
    @Query('author') author?: string,
    @Query('tags') tags?: string | string[],
  ) {
    const tagArray = tags ? (Array.isArray(tags) ? tags : [tags]) : undefined;
    return this.contentService.findAll({ type, status, author, tags: tagArray });
  }

  @Get('search')
  @ApiOperation({ summary: 'Search content with advanced filters' })
  @ApiQuery({ name: 'q', description: 'Search query', required: false })
  @ApiQuery({ name: 'type', enum: ContentType, required: false })
  @ApiQuery({ name: 'status', enum: WorkflowStatus, required: false })
  @ApiQuery({ name: 'tags', required: false, type: [String] })
  @ApiQuery({ name: 'specialty', required: false })
  @ApiQuery({ name: 'difficulty', required: false })
  search(
    @Query('q') query?: string,
    @Query('type') type?: ContentType,
    @Query('status') status?: WorkflowStatus,
    @Query('tags') tags?: string | string[],
    @Query('specialty') specialty?: string,
    @Query('difficulty') difficulty?: string,
  ) {
    const tagArray = tags ? (Array.isArray(tags) ? tags : [tags]) : undefined;
    const filters = {
      type,
      status,
      tags: tagArray,
      specialty,
      difficulty,
    };

    // Remove undefined filters
    Object.keys(filters).forEach(
      (key) => filters[key] === undefined && delete filters[key],
    );

    return this.contentService.search(
      query,
      Object.keys(filters).length > 0 ? filters : undefined,
    );
  }

  @Get('export/pdf/:id')
  @ApiOperation({ summary: 'Export content to PDF' })
  @ApiResponse({ status: 200, description: 'PDF generated successfully' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  @Header('Content-Type', 'application/pdf')
  async exportToPDF(@Param('id') id: string, @Res() res: Response) {
    const content = this.contentService.findOne(id);
    const pdfBuffer = await this.contentService.exportToPDF(id);

    // Generate filename from content title
    const filename = `${content.slug || content.id}.pdf`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get content by ID' })
  @ApiResponse({ status: 200, description: 'Content found' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  findOne(@Param('id') id: string) {
    return this.contentService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get content by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.contentService.findBySlug(slug);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update content and create new version' })
  update(@Param('id') id: string, @Body() updateDto: UpdateContentDto) {
    // TODO: Get user ID from JWT token
    const userId = 'demo-user-id';
    return this.contentService.update(id, updateDto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete content' })
  remove(@Param('id') id: string) {
    this.contentService.remove(id);
  }

  // ========== Workflow Management ==========

  @Put(':id/workflow')
  @ApiOperation({ summary: 'Update content workflow status' })
  @ApiResponse({ status: 200, description: 'Workflow status updated' })
  @ApiResponse({ status: 400, description: 'Invalid workflow transition' })
  updateWorkflow(
    @Param('id') id: string,
    @Body() statusDto: UpdateWorkflowStatusDto,
  ) {
    // TODO: Get user ID from JWT token
    const userId = 'demo-user-id';
    return this.contentService.updateWorkflowStatus(id, statusDto, userId);
  }

  // ========== Version Management ==========

  @Get(':id/versions')
  @ApiOperation({ summary: 'Get version history for content' })
  getVersions(@Param('id') id: string) {
    return this.contentService.getVersionHistory(id);
  }

  @Post(':id/versions/:version/revert')
  @ApiOperation({ summary: 'Revert to a previous version' })
  revertVersion(@Param('id') id: string, @Param('version') version: string) {
    // TODO: Get user ID from JWT token
    const userId = 'demo-user-id';
    return this.contentService.revertToVersion(id, parseInt(version, 10), userId);
  }

  @Get(':id/versions/compare')
  @ApiOperation({ summary: 'Compare two versions' })
  @ApiQuery({ name: 'v1', description: 'Version 1' })
  @ApiQuery({ name: 'v2', description: 'Version 2' })
  compareVersions(
    @Param('id') id: string,
    @Query('v1') v1: string,
    @Query('v2') v2: string,
  ) {
    return this.contentService.compareVersions(
      id,
      parseInt(v1, 10),
      parseInt(v2, 10),
    );
  }

  // ========== Module-Specific Endpoints ==========

  @Post('modules')
  @ApiOperation({ summary: 'Create a new module' })
  createModule(@Body() createDto: CreateModuleDto) {
    const authorId = 'demo-author-id';
    return this.contentService.createModule(createDto, authorId);
  }

  @Get('modules/list')
  @ApiOperation({ summary: 'Get all modules' })
  getModules() {
    return this.contentService.findAll({ type: ContentType.MODULE });
  }

  // ========== Lesson-Specific Endpoints ==========

  @Post('lessons')
  @ApiOperation({ summary: 'Create a new lesson' })
  createLesson(@Body() createDto: CreateLessonDto) {
    const authorId = 'demo-author-id';
    return this.contentService.createLesson(createDto, authorId);
  }

  @Get('modules/:moduleId/lessons')
  @ApiOperation({ summary: 'Get all lessons in a module' })
  getModuleLessons(@Param('moduleId') moduleId: string) {
    const module = this.contentService.findOne(moduleId) as any;
    if ('lessons' in module && Array.isArray(module.lessons)) {
      return module.lessons.map((lessonId: string) => this.contentService.findOne(lessonId));
    }
    return [];
  }

  // ========== Objective-Specific Endpoints ==========

  @Post('objectives')
  @ApiOperation({ summary: 'Create a new learning objective' })
  createObjective(@Body() createDto: CreateObjectiveDto) {
    const authorId = 'demo-author-id';
    return this.contentService.create(createDto, authorId);
  }

  @Get('objectives/list')
  @ApiOperation({ summary: 'Get all objectives' })
  getObjectives() {
    return this.contentService.findAll({ type: ContentType.OBJECTIVE });
  }
}
