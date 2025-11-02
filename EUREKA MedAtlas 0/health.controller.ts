import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        service: { type: 'string', example: 'qbank' },
        timestamp: { type: 'string', example: '2025-11-02T12:00:00.000Z' },
        uptime: { type: 'number', example: 12345 },
      },
    },
  })
  check() {
    return {
      status: 'ok',
      service: 'qbank',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
