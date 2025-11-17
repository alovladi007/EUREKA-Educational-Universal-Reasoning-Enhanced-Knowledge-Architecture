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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { OSCEService } from './osce.service';
import {
  CreateStationDto,
  UpdateStationDto,
  StartExamSessionDto,
  SubmitStationScoreDto,
  SearchStationsDto,
  StationDetailDto,
  ExamSessionDto,
  StationResultDto,
  UserOSCEPerformanceDto,
} from './dto/osce.dto';

@ApiTags('OSCE')
@Controller('osce')
export class OSCEController {
  constructor(private readonly osceService: OSCEService) {}

  // Mock user ID for demo purposes (authentication disabled)
  private readonly DEMO_USER_ID = 'demo-user-12345';

  // ==================== Station Management ====================

  @Get('stations')
  @ApiOperation({ summary: 'Get all OSCE stations (Public)' })
  @ApiResponse({
    status: 200,
    description: 'List of stations',
    type: [StationDetailDto],
  })
  async findAllStations(@Query() searchDto: SearchStationsDto): Promise<StationDetailDto[]> {
    return this.osceService.findAllStations(searchDto);
  }

  @Get('stations/:id')
  @ApiOperation({ summary: 'Get station details (Public)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Station details',
    type: StationDetailDto,
  })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async findStation(@Param('id') id: string): Promise<StationDetailDto> {
    return this.osceService.findStationById(id);
  }

  @Post('stations')
  @ApiOperation({ summary: 'Create new OSCE station (Faculty/Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Station created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createStation(@Body() createDto: CreateStationDto) {
    return this.osceService.createStation(createDto);
  }

  @Put('stations/:id')
  @ApiOperation({ summary: 'Update OSCE station (Faculty/Admin)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Station updated' })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async updateStation(@Param('id') id: string, @Body() updateDto: UpdateStationDto) {
    return this.osceService.updateStation(id, updateDto);
  }

  @Delete('stations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete OSCE station (Admin only)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Station deleted' })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async deleteStation(@Param('id') id: string): Promise<void> {
    return this.osceService.deleteStation(id);
  }

  // ==================== Exam Session Management ====================

  @Post('sessions/start')
  @ApiOperation({ summary: 'Start new OSCE exam session' })
  @ApiResponse({
    status: 201,
    description: 'Session started',
    type: ExamSessionDto,
  })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async startSession(@Body() startDto: StartExamSessionDto) {
    return this.osceService.startExamSession(this.DEMO_USER_ID, startDto);
  }

  @Get('sessions/my')
  @ApiOperation({ summary: 'Get my OSCE sessions' })
  @ApiResponse({
    status: 200,
    description: 'List of user sessions',
    type: [ExamSessionDto],
  })
  async getMySessions(): Promise<ExamSessionDto[]> {
    return this.osceService.getUserSessions(this.DEMO_USER_ID);
  }

  @Get('sessions/:sessionId')
  @ApiOperation({ summary: 'Get session details' })
  @ApiParam({ name: 'sessionId', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Session details',
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async getSession(@Param('sessionId') sessionId: string) {
    return this.osceService.getSessionById(sessionId, this.DEMO_USER_ID);
  }

  @Post('sessions/:sessionId/submit')
  @ApiOperation({ summary: 'Submit station score and complete session' })
  @ApiParam({ name: 'sessionId', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Score submitted and results calculated',
    type: StationResultDto,
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  @ApiResponse({ status: 400, description: 'Session already completed' })
  async submitScore(
    @Param('sessionId') sessionId: string,
    @Body() submitDto: SubmitStationScoreDto,
  ): Promise<StationResultDto> {
    return this.osceService.submitStationScore(sessionId, this.DEMO_USER_ID, submitDto);
  }

  // ==================== Analytics ====================

  @Get('performance/mine')
  @ApiOperation({ summary: 'Get my OSCE performance' })
  @ApiResponse({
    status: 200,
    description: 'User performance metrics',
    type: UserOSCEPerformanceDto,
  })
  async getMyPerformance(): Promise<UserOSCEPerformanceDto> {
    return this.osceService.getUserPerformance(this.DEMO_USER_ID);
  }

  // ==================== Utility Endpoints ====================

  @Get('domains/list')
  @ApiOperation({ summary: 'Get list of available OSCE domains' })
  @ApiResponse({
    status: 200,
    description: 'List of domains',
    schema: {
      type: 'array',
      items: { type: 'string' },
    },
  })
  async getDomains(): Promise<string[]> {
    return this.osceService.getDomainList();
  }

  @Get('domains/distribution')
  @ApiOperation({ summary: 'Get station distribution by domain' })
  @ApiResponse({
    status: 200,
    description: 'Domain distribution',
    schema: {
      type: 'object',
      additionalProperties: { type: 'number' },
    },
  })
  async getDomainDistribution(): Promise<Record<string, number>> {
    return this.osceService.getStationsByDomain();
  }
}
