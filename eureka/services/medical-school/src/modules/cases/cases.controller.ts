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
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CasesService } from './cases.service';
import {
  CreateCaseDto,
  UpdateCaseDto,
  SearchCasesDto,
  StartCaseSessionDto,
  TakeActionDto,
  SubmitDiagnosisDto,
  SubmitManagementDto,
  UpdateSessionNotesDto,
  CaseListDto,
  CaseDetailDto,
  SessionStateDto,
  SessionSummaryDto,
  CaseAnalyticsDto,
  UserPerformanceDto,
} from './dto/cases.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Clinical Cases')
@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  // ==================== Case Management ====================

  // Public browsing endpoints - no auth required
  @Get()
  @ApiOperation({ summary: 'Browse available clinical cases (Public)' })
  @ApiResponse({
    status: 200,
    description: 'List of cases',
    type: CaseListDto,
  })
  async findAll(@Query() searchDto: SearchCasesDto): Promise<CaseListDto> {
    return this.casesService.findAll(searchDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get case details (Public)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Case details',
    type: CaseDetailDto,
  })
  @ApiResponse({ status: 404, description: 'Case not found' })
  async findOne(@Param('id') id: string): Promise<CaseDetailDto> {
    return this.casesService.findOne(id);
  }

  // Protected endpoints - require authentication
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new virtual patient case (Faculty/Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Case created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createCaseDto: CreateCaseDto) {
    return this.casesService.create(createCaseDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an existing case (Faculty/Admin)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Case updated' })
  @ApiResponse({ status: 404, description: 'Case not found' })
  async update(@Param('id') id: string, @Body() updateCaseDto: UpdateCaseDto) {
    return this.casesService.update(id, updateCaseDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Archive a case (Admin only)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Case archived' })
  @ApiResponse({ status: 404, description: 'Case not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.casesService.remove(id);
  }

  // ==================== Session Management ====================

  @Post('sessions/start')
  @ApiOperation({ summary: 'Start a new case session' })
  @ApiResponse({
    status: 201,
    description: 'Session started',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        caseId: { type: 'string' },
        userId: { type: 'string' },
        status: { type: 'string' },
        sessionState: { type: 'object' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Case not found' })
  @ApiResponse({ status: 400, description: 'Case not published' })
  async startSession(@Req() req: any, @Body() dto: StartCaseSessionDto) {
    return this.casesService.startSession(req.user.id, dto);
  }

  @Get('sessions/my')
  @ApiOperation({ summary: 'Get my case sessions' })
  @ApiResponse({
    status: 200,
    description: 'List of user sessions',
    type: [SessionSummaryDto],
  })
  async getMySessions(@Req() req: any): Promise<SessionSummaryDto[]> {
    return this.casesService.getUserSessions(req.user.id);
  }

  @Get('sessions/:sessionId')
  @ApiOperation({ summary: 'Get current session state' })
  @ApiParam({ name: 'sessionId', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Session state',
    type: SessionStateDto,
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async getSession(@Param('sessionId') sessionId: string): Promise<SessionStateDto> {
    return this.casesService.getSession(sessionId);
  }

  @Put('sessions/:sessionId/notes')
  @ApiOperation({ summary: 'Update session notes' })
  @ApiParam({ name: 'sessionId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Notes updated' })
  async updateNotes(
    @Param('sessionId') sessionId: string,
    @Req() req: any,
    @Body() dto: UpdateSessionNotesDto,
  ) {
    return this.casesService.updateSessionNotes(sessionId, req.user.id, dto.notes);
  }

  // ==================== Clinical Actions ====================

  @Post('sessions/:sessionId/actions')
  @ApiOperation({ summary: 'Take a clinical action (history, exam, or diagnostic study)' })
  @ApiParam({ name: 'sessionId', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Action completed',
    schema: {
      type: 'object',
      properties: {
        result: { type: 'string', description: 'Outcome of the action' },
        cost: { type: 'number', description: 'Time/resource cost' },
        importance: { type: 'string', description: 'Importance level' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Session or action not found' })
  @ApiResponse({ status: 400, description: 'Session not in progress' })
  async takeAction(
    @Param('sessionId') sessionId: string,
    @Req() req: any,
    @Body() dto: TakeActionDto,
  ) {
    return this.casesService.takeAction(sessionId, req.user.id, dto);
  }

  @Post('sessions/:sessionId/diagnosis')
  @ApiOperation({ summary: 'Submit diagnosis attempt' })
  @ApiParam({ name: 'sessionId', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Diagnosis submitted',
    schema: {
      type: 'object',
      properties: {
        isCorrect: { type: 'boolean' },
        feedback: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  @ApiResponse({ status: 400, description: 'Cannot submit more attempts' })
  async submitDiagnosis(
    @Param('sessionId') sessionId: string,
    @Req() req: any,
    @Body() dto: SubmitDiagnosisDto,
  ) {
    return this.casesService.submitDiagnosis(sessionId, req.user.id, dto);
  }

  @Post('sessions/:sessionId/management')
  @ApiOperation({ summary: 'Submit management plan' })
  @ApiParam({ name: 'sessionId', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Management plan submitted',
    schema: {
      type: 'object',
      properties: {
        appropriatenessScore: { type: 'number' },
        feedback: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  @ApiResponse({ status: 400, description: 'Cannot submit without correct diagnosis' })
  async submitManagement(
    @Param('sessionId') sessionId: string,
    @Req() req: any,
    @Body() dto: SubmitManagementDto,
  ) {
    return this.casesService.submitManagement(sessionId, req.user.id, dto);
  }

  @Post('sessions/:sessionId/complete')
  @ApiOperation({ summary: 'Complete session and get final results' })
  @ApiParam({ name: 'sessionId', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Session completed with results',
    schema: {
      type: 'object',
      properties: {
        scoreBreakdown: {
          type: 'object',
          properties: {
            historyScore: { type: 'number' },
            examScore: { type: 'number' },
            diagnosticsScore: { type: 'number' },
            diagnosisScore: { type: 'number' },
            managementScore: { type: 'number' },
            efficiencyScore: { type: 'number' },
            totalScore: { type: 'number' },
          },
        },
        clinicalReasoning: {
          type: 'object',
          properties: {
            criticalActionsCompleted: { type: 'number' },
            criticalActionsTotal: { type: 'number' },
            unnecessaryActions: { type: 'number' },
            timeToCorrectDiagnosis: { type: 'number' },
            diagnosticAccuracy: { type: 'number' },
            managementAppropriateness: { type: 'number' },
            efficiencyRating: { type: 'number' },
          },
        },
        feedback: {
          type: 'object',
          properties: {
            strengths: { type: 'array', items: { type: 'string' } },
            areasForImprovement: { type: 'array', items: { type: 'string' } },
            missedCriticalActions: { type: 'array', items: { type: 'string' } },
            unnecessaryActions: { type: 'array', items: { type: 'string' } },
            diagnosticApproach: { type: 'string' },
            managementApproach: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  @ApiResponse({ status: 400, description: 'Session already completed' })
  async completeSession(@Param('sessionId') sessionId: string, @Req() req: any) {
    return this.casesService.completeSession(sessionId, req.user.id);
  }

  // ==================== Analytics ====================

  @Get(':id/analytics')
  @ApiOperation({ summary: 'Get case analytics (Faculty/Admin)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Case analytics',
    type: CaseAnalyticsDto,
  })
  async getCaseAnalytics(@Param('id') id: string): Promise<CaseAnalyticsDto> {
    return this.casesService.getCaseAnalytics(id);
  }

  @Get('performance/mine')
  @ApiOperation({ summary: 'Get my performance across all cases' })
  @ApiResponse({
    status: 200,
    description: 'User performance metrics',
    type: UserPerformanceDto,
  })
  async getMyPerformance(@Req() req: any): Promise<UserPerformanceDto> {
    return this.casesService.getUserPerformance(req.user.id);
  }

  @Get('performance/user/:userId')
  @ApiOperation({ summary: 'Get user performance (Faculty/Admin)' })
  @ApiParam({ name: 'userId', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'User performance metrics',
    type: UserPerformanceDto,
  })
  async getUserPerformance(@Param('userId') userId: string): Promise<UserPerformanceDto> {
    return this.casesService.getUserPerformance(userId);
  }

  // ==================== Utility Endpoints ====================

  @Get('specialties/list')
  @ApiOperation({ summary: 'Get list of available specialties' })
  @ApiResponse({
    status: 200,
    description: 'List of specialties',
    schema: {
      type: 'array',
      items: { type: 'string' },
    },
  })
  async getSpecialties(): Promise<string[]> {
    return this.casesService.getSpecialties();
  }

  @Get('complexity/distribution')
  @ApiOperation({ summary: 'Get case distribution by complexity level' })
  @ApiResponse({
    status: 200,
    description: 'Complexity distribution',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          complexity: { type: 'string' },
          count: { type: 'number' },
        },
      },
    },
  })
  async getComplexityDistribution(): Promise<{ complexity: string; count: number }[]> {
    return this.casesService.getComplexityDistribution();
  }
}
