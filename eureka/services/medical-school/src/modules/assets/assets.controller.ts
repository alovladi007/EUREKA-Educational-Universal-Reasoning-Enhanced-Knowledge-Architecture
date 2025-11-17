import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AssetsService, UploadedAsset } from './assets.service';

@ApiTags('Assets')
@Controller('api/v1/assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a file (image, video, document)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        alt: {
          type: 'string',
          description: 'Alt text for images',
        },
        caption: {
          type: 'string',
          description: 'Caption for the asset',
        },
        width: {
          type: 'number',
          description: 'Image width (optional)',
        },
        height: {
          type: 'number',
          description: 'Image height (optional)',
        },
        duration: {
          type: 'number',
          description: 'Video/audio duration in seconds (optional)',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('alt') alt?: string,
    @Body('caption') caption?: string,
    @Body('width') width?: string,
    @Body('height') height?: string,
    @Body('duration') duration?: string,
  ): Promise<UploadedAsset> {
    if (!file) {
      throw new Error('No file provided');
    }

    // Demo user ID - in production this would come from auth
    const userId = 'demo-user-id';

    const metadata = {
      alt,
      caption,
      width: width ? parseInt(width) : undefined,
      height: height ? parseInt(height) : undefined,
      duration: duration ? parseInt(duration) : undefined,
    };

    return this.assetsService.uploadFile(file, userId, metadata);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get asset metadata' })
  @ApiResponse({
    status: 200,
    description: 'Returns asset metadata',
  })
  async getAsset(@Param('id') id: string): Promise<UploadedAsset> {
    return this.assetsService.getAsset(id);
  }

  @Get(':id/signed-url')
  @ApiOperation({ summary: 'Generate a signed URL for secure asset access' })
  @ApiResponse({
    status: 200,
    description: 'Returns a time-limited signed URL',
    schema: {
      type: 'object',
      properties: {
        signedUrl: {
          type: 'string',
          description: 'Pre-signed URL for accessing the asset',
        },
        expiresIn: {
          type: 'number',
          description: 'URL expiration time in seconds',
        },
      },
    },
  })
  async getSignedUrl(
    @Param('id') id: string,
    @Query('expiresIn') expiresIn?: string,
  ): Promise<{ signedUrl: string; expiresIn: number }> {
    const expirationTime = expiresIn ? parseInt(expiresIn) : 3600; // Default 1 hour
    const signedUrl = await this.assetsService.getSignedUrl(id, expirationTime);

    return {
      signedUrl,
      expiresIn: expirationTime,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all assets' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of assets',
  })
  async listAssets(@Query('userId') userId?: string): Promise<UploadedAsset[]> {
    return this.assetsService.listAssets(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an asset' })
  @ApiResponse({
    status: 200,
    description: 'Asset deleted successfully',
  })
  async deleteAsset(@Param('id') id: string): Promise<{ message: string }> {
    await this.assetsService.deleteAsset(id);
    return { message: 'Asset deleted successfully' };
  }

  @Get(':id/exists')
  @ApiOperation({ summary: 'Check if asset file exists in storage' })
  @ApiResponse({
    status: 200,
    description: 'Returns whether the asset exists',
    schema: {
      type: 'object',
      properties: {
        exists: {
          type: 'boolean',
        },
      },
    },
  })
  async fileExists(@Param('id') id: string): Promise<{ exists: boolean }> {
    const exists = await this.assetsService.fileExists(id);
    return { exists };
  }
}
