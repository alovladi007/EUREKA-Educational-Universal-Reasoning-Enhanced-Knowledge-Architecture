import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { AssetType } from '../content/entities/content.entity';

export interface UploadedAsset {
  id: string;
  type: AssetType;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  metadata: {
    width?: number;
    height?: number;
    duration?: number;
    alt?: string;
    caption?: string;
  };
  createdAt: Date;
  createdBy: string;
}

@Injectable()
export class AssetsService {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly assets = new Map<string, UploadedAsset>();

  constructor() {
    // Initialize S3/MinIO client
    // For development, we'll use in-memory storage
    // In production, configure with actual MinIO/S3 credentials
    this.bucket = process.env.MINIO_BUCKET || 'eureka-content';

    this.s3Client = new S3Client({
      endpoint: process.env.MINIO_ENDPOINT || 'http://localhost:9000',
      region: process.env.MINIO_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
        secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
      },
      forcePathStyle: true, // Required for MinIO
    });

    console.log('🗄️  Assets service initialized with MinIO/S3 client');
  }

  /**
   * Upload a file to S3/MinIO
   */
  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    metadata?: {
      alt?: string;
      caption?: string;
      width?: number;
      height?: number;
      duration?: number;
    },
  ): Promise<UploadedAsset> {
    const assetId = uuidv4();
    const fileExtension = file.originalname.split('.').pop();
    const filename = `${assetId}.${fileExtension}`;
    const key = `assets/${filename}`;

    try {
      // Upload to S3/MinIO
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          originalFilename: file.originalname,
          uploadedBy: userId,
          assetId: assetId,
        },
      });

      await this.s3Client.send(command);

      // Determine asset type from MIME type
      const assetType = this.getAssetType(file.mimetype);

      // Create asset metadata
      const asset: UploadedAsset = {
        id: assetId,
        type: assetType,
        filename,
        originalFilename: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `${process.env.MINIO_ENDPOINT || 'http://localhost:9000'}/${this.bucket}/${key}`,
        metadata: metadata || {},
        createdAt: new Date(),
        createdBy: userId,
      };

      // Store in memory (in production, this would be in a database)
      this.assets.set(assetId, asset);

      console.log(`✅ Uploaded asset: ${filename} (${assetType})`);

      return asset;
    } catch (error) {
      console.error('Error uploading file to MinIO:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * Generate a signed URL for secure file access
   */
  async getSignedUrl(assetId: string, expiresIn: number = 3600): Promise<string> {
    const asset = this.assets.get(assetId);
    if (!asset) {
      throw new Error(`Asset not found: ${assetId}`);
    }

    const key = `assets/${asset.filename}`;

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      return signedUrl;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  }

  /**
   * Get asset metadata
   */
  async getAsset(assetId: string): Promise<UploadedAsset> {
    const asset = this.assets.get(assetId);
    if (!asset) {
      throw new Error(`Asset not found: ${assetId}`);
    }

    return asset;
  }

  /**
   * Delete an asset
   */
  async deleteAsset(assetId: string): Promise<void> {
    const asset = this.assets.get(assetId);
    if (!asset) {
      throw new Error(`Asset not found: ${assetId}`);
    }

    const key = `assets/${asset.filename}`;

    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      this.assets.delete(assetId);

      console.log(`🗑️  Deleted asset: ${asset.filename}`);
    } catch (error) {
      console.error('Error deleting file from MinIO:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * List all assets for a user
   */
  async listAssets(userId?: string): Promise<UploadedAsset[]> {
    const assets = Array.from(this.assets.values());

    if (userId) {
      return assets.filter((asset) => asset.createdBy === userId);
    }

    return assets;
  }

  /**
   * Check if file exists in S3/MinIO
   */
  async fileExists(assetId: string): Promise<boolean> {
    const asset = this.assets.get(assetId);
    if (!asset) {
      return false;
    }

    const key = `assets/${asset.filename}`;

    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Determine asset type from MIME type
   */
  private getAssetType(mimeType: string): AssetType {
    if (mimeType.startsWith('image/')) {
      return AssetType.IMAGE;
    } else if (mimeType.startsWith('video/')) {
      return AssetType.VIDEO;
    } else if (mimeType.startsWith('audio/')) {
      return AssetType.AUDIO;
    } else if (
      mimeType === 'application/pdf' ||
      mimeType.includes('document') ||
      mimeType.includes('word') ||
      mimeType.includes('text')
    ) {
      return AssetType.DOCUMENT;
    } else {
      return AssetType.DOCUMENT; // Default
    }
  }
}
