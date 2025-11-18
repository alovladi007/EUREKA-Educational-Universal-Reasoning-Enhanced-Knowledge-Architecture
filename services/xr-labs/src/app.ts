/**
 * XR Labs Backend Service
 *
 * Comprehensive Extended Reality platform for immersive STEM education
 * Supports VR, AR, MR experiences with collaborative features
 *
 * Features:
 * - 3D Asset Management
 * - XR Experience Catalog
 * - Session Tracking & Analytics
 * - Collaborative VR Rooms (WebSocket)
 * - Virtual Lab Controls
 * - Achievement System
 * - AR Marker Management
 * - Equipment Checkout
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import AWS from 'aws-sdk';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import winston from 'winston';

dotenv.config();

// =====================================================
// CONFIGURATION
// =====================================================

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3005;
const JWT_SECRET = process.env.JWT_SECRET || 'xr-labs-secret-key';

// Database Connection Pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'eureka',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// AWS S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

const S3_BUCKET = process.env.AWS_S3_BUCKET || 'eureka-xr-assets';

// Winston Logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Multer Configuration for 3D Asset Upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_ASSET_SIZE_MB || '100') * 1024 * 1024, // MB to bytes
  },
  fileFilter: (req, file, cb) => {
    const allowedFormats = (process.env.SUPPORTED_FORMATS || 'glb,gltf,fbx,obj,usdz').split(',');
    const ext = file.originalname.split('.').pop()?.toLowerCase();

    if (ext && allowedFormats.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file format. Allowed: ${allowedFormats.join(', ')}`));
    }
  },
});

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/api/', apiLimiter);

// Request Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// =====================================================
// TYPES & INTERFACES
// =====================================================

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

interface XRExperience {
  id: string;
  title: string;
  description: string;
  experience_type: string;
  lab_subject?: string;
  difficulty_level: string;
  duration_minutes: number;
  supported_devices: string[];
  scene_file_url: string;
  thumbnail_url?: string;
  preview_video_url?: string;
  motion_intensity?: string;
  min_age?: number;
  max_concurrent_users: number;
  tags: string[];
  is_published: boolean;
}

interface Asset3D {
  id: string;
  asset_name: string;
  category: string;
  file_format: string;
  file_url: string;
  file_size_mb: number;
  polygon_count?: number;
  texture_resolution?: string;
  has_animations: boolean;
  animation_count?: number;
  is_physics_enabled: boolean;
  optimization_level: string;
  thumbnail_url?: string;
}

interface VRRoom {
  id: string;
  room_code: string;
  experience_id: string;
  host_user_id: string;
  max_participants: number;
  is_private: boolean;
  password_hash?: string;
  voice_chat_enabled: boolean;
  text_chat_enabled: boolean;
  shared_state: any;
  status: string;
}

interface RoomParticipant {
  id: string;
  room_id: string;
  user_id: string;
  avatar_url?: string;
  position_x?: number;
  position_y?: number;
  position_z?: number;
  rotation_x?: number;
  rotation_y?: number;
  rotation_z?: number;
  is_speaking: boolean;
  role: string;
}

// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// =====================================================
// 3D ASSET MANAGEMENT
// =====================================================

/**
 * Upload 3D Asset to S3
 */
app.post('/api/xr/assets/upload', authenticateToken, upload.single('asset'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const {
      asset_name,
      category,
      description,
      polygon_count,
      texture_resolution,
      has_animations,
      animation_count,
      is_physics_enabled,
      tags,
    } = req.body;

    const userId = req.user?.id;
    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const s3Key = `3d-assets/${category}/${fileName}`;

    // Upload to S3
    logger.info('Uploading 3D asset to S3...', { fileName, size: req.file.size });

    const uploadParams = {
      Bucket: S3_BUCKET,
      Key: s3Key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      Metadata: {
        'original-name': req.file.originalname,
        'uploaded-by': userId || 'unknown',
      },
    };

    const s3Upload = await s3.upload(uploadParams).promise();
    const fileUrl = s3Upload.Location;
    const fileSizeMB = req.file.size / (1024 * 1024);

    // Generate thumbnail (if possible)
    let thumbnailUrl = null;
    // Note: Actual 3D thumbnail generation would require Three.js server-side rendering
    // This is a placeholder for the logic

    // Insert into database
    const result = await pool.query(
      `INSERT INTO xr_3d_assets (
        asset_name, category, description, file_format, file_url,
        file_size_mb, polygon_count, texture_resolution,
        has_animations, animation_count, is_physics_enabled,
        optimization_level, thumbnail_url, tags, uploaded_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        asset_name,
        category,
        description || '',
        fileExt,
        fileUrl,
        fileSizeMB,
        polygon_count || null,
        texture_resolution || null,
        has_animations === 'true',
        parseInt(animation_count) || 0,
        is_physics_enabled === 'true',
        'standard',
        thumbnailUrl,
        tags ? JSON.parse(tags) : [],
        userId,
      ]
    );

    logger.info('3D asset uploaded successfully', { assetId: result.rows[0].id });

    res.status(201).json({
      message: '3D asset uploaded successfully',
      asset: result.rows[0],
    });
  } catch (error: any) {
    logger.error('Error uploading 3D asset:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get All 3D Assets (with filters)
 */
app.get('/api/xr/assets', async (req: Request, res: Response) => {
  try {
    const { category, format, has_animations, search, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM xr_3d_assets WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (format) {
      query += ` AND file_format = $${paramIndex}`;
      params.push(format);
      paramIndex++;
    }

    if (has_animations !== undefined) {
      query += ` AND has_animations = $${paramIndex}`;
      params.push(has_animations === 'true');
      paramIndex++;
    }

    if (search) {
      query += ` AND (asset_name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.json({
      assets: result.rows,
      total: result.rows.length,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });
  } catch (error: any) {
    logger.error('Error fetching 3D assets:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get Single 3D Asset
 */
app.get('/api/xr/assets/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM xr_3d_assets WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '3D asset not found' });
    }

    res.json({ asset: result.rows[0] });
  } catch (error: any) {
    logger.error('Error fetching 3D asset:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Delete 3D Asset
 */
app.delete('/api/xr/assets/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Get asset details
    const assetResult = await pool.query(
      'SELECT * FROM xr_3d_assets WHERE id = $1',
      [id]
    );

    if (assetResult.rows.length === 0) {
      return res.status(404).json({ error: '3D asset not found' });
    }

    const asset = assetResult.rows[0];

    // Check ownership (if applicable)
    // For now, allow any authenticated user to delete

    // Delete from S3
    const s3Key = asset.file_url.split('.com/')[1]; // Extract key from URL
    await s3.deleteObject({ Bucket: S3_BUCKET, Key: s3Key }).promise();

    // Delete from database
    await pool.query('DELETE FROM xr_3d_assets WHERE id = $1', [id]);

    logger.info('3D asset deleted', { assetId: id, deletedBy: userId });

    res.json({ message: '3D asset deleted successfully' });
  } catch (error: any) {
    logger.error('Error deleting 3D asset:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// XR EXPERIENCE MANAGEMENT
// =====================================================

/**
 * Create New XR Experience
 */
app.post('/api/xr/experiences', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      experience_type,
      lab_subject,
      difficulty_level,
      duration_minutes,
      supported_devices,
      scene_file_url,
      thumbnail_url,
      preview_video_url,
      motion_intensity,
      min_age,
      max_concurrent_users,
      tags,
      learning_objectives,
      prerequisites,
    } = req.body;

    const userId = req.user?.id;

    const result = await pool.query(
      `INSERT INTO xr_experiences (
        title, description, experience_type, lab_subject, difficulty_level,
        duration_minutes, supported_devices, scene_file_url, thumbnail_url,
        preview_video_url, motion_intensity, min_age, max_concurrent_users,
        tags, learning_objectives, prerequisites, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *`,
      [
        title,
        description,
        experience_type,
        lab_subject || null,
        difficulty_level,
        duration_minutes,
        supported_devices,
        scene_file_url,
        thumbnail_url || null,
        preview_video_url || null,
        motion_intensity || 'moderate',
        min_age || null,
        max_concurrent_users || 1,
        tags || [],
        learning_objectives || [],
        prerequisites || [],
        userId,
      ]
    );

    logger.info('XR experience created', { experienceId: result.rows[0].id });

    res.status(201).json({
      message: 'XR experience created successfully',
      experience: result.rows[0],
    });
  } catch (error: any) {
    logger.error('Error creating XR experience:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get All XR Experiences (with filters)
 */
app.get('/api/xr/experiences', async (req: Request, res: Response) => {
  try {
    const {
      type,
      subject,
      difficulty,
      device,
      search,
      limit = 50,
      offset = 0,
    } = req.query;

    let query = 'SELECT * FROM xr_experiences WHERE is_published = true';
    const params: any[] = [];
    let paramIndex = 1;

    if (type) {
      query += ` AND experience_type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    if (subject) {
      query += ` AND lab_subject = $${paramIndex}`;
      params.push(subject);
      paramIndex++;
    }

    if (difficulty) {
      query += ` AND difficulty_level = $${paramIndex}`;
      params.push(difficulty);
      paramIndex++;
    }

    if (device) {
      query += ` AND $${paramIndex} = ANY(supported_devices)`;
      params.push(device);
      paramIndex++;
    }

    if (search) {
      query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.json({
      experiences: result.rows,
      total: result.rows.length,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });
  } catch (error: any) {
    logger.error('Error fetching XR experiences:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get Single XR Experience
 */
app.get('/api/xr/experiences/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM xr_experiences WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'XR experience not found' });
    }

    // Increment view count
    await pool.query(
      'UPDATE xr_experiences SET total_sessions = total_sessions + 1 WHERE id = $1',
      [id]
    );

    res.json({ experience: result.rows[0] });
  } catch (error: any) {
    logger.error('Error fetching XR experience:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update XR Experience
 */
app.put('/api/xr/experiences/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user?.id;

    // Build dynamic UPDATE query
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    values.push(id);

    const query = `UPDATE xr_experiences SET ${setClause}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'XR experience not found' });
    }

    logger.info('XR experience updated', { experienceId: id, updatedBy: userId });

    res.json({
      message: 'XR experience updated successfully',
      experience: result.rows[0],
    });
  } catch (error: any) {
    logger.error('Error updating XR experience:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Delete XR Experience
 */
app.delete('/api/xr/experiences/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    await pool.query('DELETE FROM xr_experiences WHERE id = $1', [id]);

    logger.info('XR experience deleted', { experienceId: id, deletedBy: userId });

    res.json({ message: 'XR experience deleted successfully' });
  } catch (error: any) {
    logger.error('Error deleting XR experience:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// SESSION TRACKING & ANALYTICS
// =====================================================

/**
 * Start XR Session
 */
app.post('/api/xr/sessions/start', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { experience_id, device_type } = req.body;
    const userId = req.user?.id;

    const result = await pool.query(
      `INSERT INTO xr_user_sessions (
        user_id, experience_id, device_type
      ) VALUES ($1, $2, $3)
      RETURNING *`,
      [userId, experience_id, device_type]
    );

    logger.info('XR session started', { sessionId: result.rows[0].id, userId });

    res.status(201).json({
      message: 'XR session started',
      session: result.rows[0],
    });
  } catch (error: any) {
    logger.error('Error starting XR session:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * End XR Session
 */
app.post('/api/xr/sessions/:sessionId/end', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const {
      completion_percentage,
      objectives_achieved,
      quiz_score,
      avg_fps,
      avg_latency_ms,
      interactions_count,
      objects_manipulated,
      comfort_rating,
      motion_sickness_reported,
      user_rating,
      feedback,
    } = req.body;

    const userId = req.user?.id;

    const result = await pool.query(
      `UPDATE xr_user_sessions SET
        ended_at = NOW(),
        session_duration = EXTRACT(EPOCH FROM (NOW() - started_at)) / 60,
        completion_percentage = $1,
        objectives_achieved = $2,
        quiz_score = $3,
        avg_fps = $4,
        avg_latency_ms = $5,
        interactions_count = $6,
        objects_manipulated = $7,
        comfort_rating = $8,
        motion_sickness_reported = $9,
        user_rating = $10,
        feedback = $11
      WHERE id = $12 AND user_id = $13
      RETURNING *`,
      [
        completion_percentage,
        objectives_achieved || [],
        quiz_score || null,
        avg_fps || null,
        avg_latency_ms || null,
        interactions_count || 0,
        objects_manipulated || 0,
        comfort_rating || null,
        motion_sickness_reported || false,
        user_rating || null,
        feedback || '',
        sessionId,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Check for achievements
    await checkAchievements(userId as string, result.rows[0]);

    logger.info('XR session ended', { sessionId, userId });

    res.json({
      message: 'XR session ended',
      session: result.rows[0],
    });
  } catch (error: any) {
    logger.error('Error ending XR session:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get User Sessions
 */
app.get('/api/xr/sessions/my-sessions', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { limit = 20, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT s.*, e.title as experience_title, e.experience_type
       FROM xr_user_sessions s
       JOIN xr_experiences e ON s.experience_id = e.id
       WHERE s.user_id = $1
       ORDER BY s.started_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    res.json({
      sessions: result.rows,
      total: result.rows.length,
    });
  } catch (error: any) {
    logger.error('Error fetching user sessions:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get Analytics Summary
 */
app.get('/api/xr/analytics/summary', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const result = await pool.query(
      `SELECT
        COUNT(*) as total_sessions,
        SUM(session_duration) as total_time_minutes,
        AVG(completion_percentage) as avg_completion,
        AVG(user_rating) as avg_rating,
        COUNT(DISTINCT experience_id) as unique_experiences
       FROM xr_user_sessions
       WHERE user_id = $1 AND ended_at IS NOT NULL`,
      [userId]
    );

    res.json({ analytics: result.rows[0] });
  } catch (error: any) {
    logger.error('Error fetching analytics summary:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// COLLABORATIVE VR ROOMS
// =====================================================

/**
 * Create VR Room
 */
app.post('/api/xr/rooms/create', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const {
      experience_id,
      max_participants,
      is_private,
      password,
      voice_chat_enabled,
      text_chat_enabled,
    } = req.body;

    const userId = req.user?.id;

    // Generate unique room code
    const roomCode = generateRoomCode();

    const result = await pool.query(
      `INSERT INTO vr_collaborative_rooms (
        room_code, experience_id, host_user_id, max_participants,
        is_private, voice_chat_enabled, text_chat_enabled, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'waiting')
      RETURNING *`,
      [
        roomCode,
        experience_id,
        userId,
        max_participants || 10,
        is_private || false,
        voice_chat_enabled !== false,
        text_chat_enabled !== false,
      ]
    );

    logger.info('VR room created', { roomId: result.rows[0].id, roomCode, host: userId });

    res.status(201).json({
      message: 'VR room created successfully',
      room: result.rows[0],
    });
  } catch (error: any) {
    logger.error('Error creating VR room:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Join VR Room
 */
app.post('/api/xr/rooms/:roomCode/join', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { roomCode } = req.params;
    const { avatar_url } = req.body;
    const userId = req.user?.id;

    // Check if room exists and has space
    const roomResult = await pool.query(
      'SELECT * FROM vr_collaborative_rooms WHERE room_code = $1',
      [roomCode]
    );

    if (roomResult.rows.length === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const room = roomResult.rows[0];

    // Check participant count
    const participantCount = await pool.query(
      'SELECT COUNT(*) FROM vr_room_participants WHERE room_id = $1 AND left_at IS NULL',
      [room.id]
    );

    if (parseInt(participantCount.rows[0].count) >= room.max_participants) {
      return res.status(403).json({ error: 'Room is full' });
    }

    // Add participant
    const result = await pool.query(
      `INSERT INTO vr_room_participants (
        room_id, user_id, avatar_url, role
      ) VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [room.id, userId, avatar_url || null, userId === room.host_user_id ? 'host' : 'participant']
    );

    // Update room status to active if this is the first join
    if (parseInt(participantCount.rows[0].count) === 0) {
      await pool.query(
        "UPDATE vr_collaborative_rooms SET status = 'active' WHERE id = $1",
        [room.id]
      );
    }

    logger.info('User joined VR room', { roomId: room.id, userId, roomCode });

    // Emit Socket.IO event
    io.to(roomCode).emit('participant_joined', {
      participant: result.rows[0],
    });

    res.json({
      message: 'Joined room successfully',
      room,
      participant: result.rows[0],
    });
  } catch (error: any) {
    logger.error('Error joining VR room:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Leave VR Room
 */
app.post('/api/xr/rooms/:roomCode/leave', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { roomCode } = req.params;
    const userId = req.user?.id;

    const roomResult = await pool.query(
      'SELECT * FROM vr_collaborative_rooms WHERE room_code = $1',
      [roomCode]
    );

    if (roomResult.rows.length === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const room = roomResult.rows[0];

    // Mark participant as left
    await pool.query(
      `UPDATE vr_room_participants
       SET left_at = NOW()
       WHERE room_id = $1 AND user_id = $2 AND left_at IS NULL`,
      [room.id, userId]
    );

    logger.info('User left VR room', { roomId: room.id, userId, roomCode });

    // Emit Socket.IO event
    io.to(roomCode).emit('participant_left', { userId });

    res.json({ message: 'Left room successfully' });
  } catch (error: any) {
    logger.error('Error leaving VR room:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get Active Rooms
 */
app.get('/api/xr/rooms/active', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT r.*, e.title as experience_title,
        (SELECT COUNT(*) FROM vr_room_participants WHERE room_id = r.id AND left_at IS NULL) as current_participants
       FROM vr_collaborative_rooms r
       JOIN xr_experiences e ON r.experience_id = e.id
       WHERE r.status IN ('waiting', 'active') AND r.is_private = false
       ORDER BY r.created_at DESC
       LIMIT 50`
    );

    res.json({ rooms: result.rows });
  } catch (error: any) {
    logger.error('Error fetching active rooms:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// ACHIEVEMENT SYSTEM
// =====================================================

/**
 * Get User Achievements
 */
app.get('/api/xr/achievements/my-achievements', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const result = await pool.query(
      `SELECT ua.*, a.achievement_name, a.description, a.icon_url, a.points, a.rarity
       FROM xr_user_achievements ua
       JOIN xr_achievements a ON ua.achievement_id = a.id
       WHERE ua.user_id = $1
       ORDER BY ua.earned_at DESC`,
      [userId]
    );

    // Calculate total points
    const totalPoints = result.rows.reduce((sum, row) => sum + parseFloat(row.points), 0);

    res.json({
      achievements: result.rows,
      total_achievements: result.rows.length,
      total_points: totalPoints,
    });
  } catch (error: any) {
    logger.error('Error fetching user achievements:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get All Available Achievements
 */
app.get('/api/xr/achievements', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM xr_achievements WHERE is_active = true ORDER BY points ASC'
    );

    res.json({ achievements: result.rows });
  } catch (error: any) {
    logger.error('Error fetching achievements:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Check and Award Achievements (Internal Function)
 */
async function checkAchievements(userId: string, session: any) {
  try {
    // First Steps in VR
    const sessionCount = await pool.query(
      'SELECT COUNT(*) FROM xr_user_sessions WHERE user_id = $1 AND ended_at IS NOT NULL',
      [userId]
    );

    if (sessionCount.rows[0].count === '1') {
      await awardAchievement(userId, 'first-steps-vr');
    }

    // Speed Learner (completed in < 10 minutes)
    if (session.session_duration < 10 && session.completion_percentage >= 100) {
      await awardAchievement(userId, 'speed-learner');
    }

    // Perfect Score
    if (session.quiz_score >= 100) {
      await awardAchievement(userId, 'perfect-score');
    }

    // More achievement checks can be added here...
  } catch (error) {
    logger.error('Error checking achievements:', error);
  }
}

async function awardAchievement(userId: string, achievementSlug: string) {
  try {
    const achievementResult = await pool.query(
      'SELECT * FROM xr_achievements WHERE achievement_slug = $1',
      [achievementSlug]
    );

    if (achievementResult.rows.length === 0) return;

    const achievement = achievementResult.rows[0];

    // Check if already earned
    const existingResult = await pool.query(
      'SELECT * FROM xr_user_achievements WHERE user_id = $1 AND achievement_id = $2',
      [userId, achievement.id]
    );

    if (existingResult.rows.length > 0) return;

    // Award achievement
    await pool.query(
      'INSERT INTO xr_user_achievements (user_id, achievement_id) VALUES ($1, $2)',
      [userId, achievement.id]
    );

    logger.info('Achievement awarded', { userId, achievement: achievementSlug });
  } catch (error) {
    logger.error('Error awarding achievement:', error);
  }
}

// =====================================================
// VIRTUAL LAB FEATURES
// =====================================================

/**
 * Get Virtual Lab Details
 */
app.get('/api/xr/labs/:experienceId', async (req: Request, res: Response) => {
  try {
    const { experienceId } = req.params;

    const result = await pool.query(
      'SELECT * FROM virtual_labs WHERE id = $1',
      [experienceId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Virtual lab not found' });
    }

    res.json({ lab: result.rows[0] });
  } catch (error: any) {
    logger.error('Error fetching virtual lab:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get XR Simulations
 */
app.get('/api/xr/simulations', async (req: Request, res: Response) => {
  try {
    const { subject, difficulty } = req.query;

    let query = `
      SELECT s.*, e.title, e.description
      FROM xr_simulations s
      JOIN xr_experiences e ON s.experience_id = e.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (subject) {
      query += ` AND e.lab_subject = $${paramIndex}`;
      params.push(subject);
      paramIndex++;
    }

    if (difficulty) {
      query += ` AND e.difficulty_level = $${paramIndex}`;
      params.push(difficulty);
      paramIndex++;
    }

    const result = await pool.query(query, params);

    res.json({ simulations: result.rows });
  } catch (error: any) {
    logger.error('Error fetching simulations:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// AR MARKER MANAGEMENT
// =====================================================

/**
 * Get AR Markers
 */
app.get('/api/xr/ar-markers', async (req: Request, res: Response) => {
  try {
    const { experience_id, marker_type } = req.query;

    let query = 'SELECT * FROM ar_markers WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (experience_id) {
      query += ` AND experience_id = $${paramIndex}`;
      params.push(experience_id);
      paramIndex++;
    }

    if (marker_type) {
      query += ` AND marker_type = $${paramIndex}`;
      params.push(marker_type);
      paramIndex++;
    }

    const result = await pool.query(query, params);

    res.json({ markers: result.rows });
  } catch (error: any) {
    logger.error('Error fetching AR markers:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// EQUIPMENT MANAGEMENT
// =====================================================

/**
 * Get Available Equipment
 */
app.get('/api/xr/equipment', async (req: Request, res: Response) => {
  try {
    const { device_type, status } = req.query;

    let query = 'SELECT * FROM xr_equipment WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (device_type) {
      query += ` AND device_type = $${paramIndex}`;
      params.push(device_type);
      paramIndex++;
    }

    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    const result = await pool.query(query, params);

    res.json({ equipment: result.rows });
  } catch (error: any) {
    logger.error('Error fetching equipment:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Checkout Equipment
 */
app.post('/api/xr/equipment/:id/checkout', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const result = await pool.query(
      `UPDATE xr_equipment SET
        status = 'in_use',
        checked_out_by = $1,
        checked_out_at = NOW()
      WHERE id = $2 AND status = 'available'
      RETURNING *`,
      [userId, id]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Equipment not available for checkout' });
    }

    logger.info('Equipment checked out', { equipmentId: id, userId });

    res.json({
      message: 'Equipment checked out successfully',
      equipment: result.rows[0],
    });
  } catch (error: any) {
    logger.error('Error checking out equipment:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Return Equipment
 */
app.post('/api/xr/equipment/:id/return', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { condition_notes } = req.body;
    const userId = req.user?.id;

    const result = await pool.query(
      `UPDATE xr_equipment SET
        status = 'available',
        checked_out_by = NULL,
        checked_out_at = NULL,
        last_maintenance_date = NOW()
      WHERE id = $1 AND checked_out_by = $2
      RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Equipment not found or not checked out by you' });
    }

    logger.info('Equipment returned', { equipmentId: id, userId });

    res.json({
      message: 'Equipment returned successfully',
      equipment: result.rows[0],
    });
  } catch (error: any) {
    logger.error('Error returning equipment:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// WEBSOCKET - REAL-TIME COLLABORATION
// =====================================================

io.on('connection', (socket) => {
  logger.info('Client connected to WebSocket', { socketId: socket.id });

  /**
   * Join VR Room
   */
  socket.on('join_room', async (data: { roomCode: string; userId: string }) => {
    const { roomCode, userId } = data;

    socket.join(roomCode);
    logger.info('User joined room via WebSocket', { roomCode, userId, socketId: socket.id });

    // Get current room state
    const roomResult = await pool.query(
      'SELECT * FROM vr_collaborative_rooms WHERE room_code = $1',
      [roomCode]
    );

    if (roomResult.rows.length > 0) {
      const room = roomResult.rows[0];

      // Get all participants
      const participantsResult = await pool.query(
        `SELECT * FROM vr_room_participants
         WHERE room_id = $1 AND left_at IS NULL`,
        [room.id]
      );

      socket.emit('room_state', {
        room,
        participants: participantsResult.rows,
      });

      // Notify others
      socket.to(roomCode).emit('user_joined', { userId });
    }
  });

  /**
   * Update Position (VR Avatar)
   */
  socket.on('update_position', async (data: {
    roomCode: string;
    userId: string;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
  }) => {
    const { roomCode, userId, position, rotation } = data;

    // Update in database
    await pool.query(
      `UPDATE vr_room_participants SET
        position_x = $1, position_y = $2, position_z = $3,
        rotation_x = $4, rotation_y = $5, rotation_z = $6
       WHERE user_id = $7 AND left_at IS NULL`,
      [position.x, position.y, position.z, rotation.x, rotation.y, rotation.z, userId]
    );

    // Broadcast to others in room
    socket.to(roomCode).emit('participant_moved', {
      userId,
      position,
      rotation,
    });
  });

  /**
   * Voice Activity
   */
  socket.on('voice_activity', (data: { roomCode: string; userId: string; isSpeaking: boolean }) => {
    const { roomCode, userId, isSpeaking } = data;

    socket.to(roomCode).emit('participant_speaking', { userId, isSpeaking });
  });

  /**
   * Chat Message
   */
  socket.on('chat_message', (data: { roomCode: string; userId: string; message: string }) => {
    const { roomCode, userId, message } = data;

    const chatMessage = {
      userId,
      message,
      timestamp: new Date().toISOString(),
    };

    io.to(roomCode).emit('chat_message', chatMessage);
  });

  /**
   * Shared State Update (Synchronized Experiment)
   */
  socket.on('update_shared_state', async (data: { roomCode: string; sharedState: any }) => {
    const { roomCode, sharedState } = data;

    // Update in database
    const roomResult = await pool.query(
      'UPDATE vr_collaborative_rooms SET shared_state = $1 WHERE room_code = $2 RETURNING *',
      [JSON.stringify(sharedState), roomCode]
    );

    if (roomResult.rows.length > 0) {
      // Broadcast to all in room
      io.to(roomCode).emit('shared_state_updated', { sharedState });
    }
  });

  /**
   * Disconnect
   */
  socket.on('disconnect', () => {
    logger.info('Client disconnected from WebSocket', { socketId: socket.id });
  });
});

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding ambiguous characters
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// =====================================================
// HEALTH CHECK
// =====================================================

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'XR Labs Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
// ERROR HANDLING
// =====================================================

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// =====================================================
// START SERVER
// =====================================================

httpServer.listen(PORT, () => {
  logger.info(`🚀 XR Labs Backend Service running on port ${PORT}`);
  logger.info(`🥽 VR/AR/MR Platform Ready`);
  logger.info(`🔌 WebSocket Server Active`);
  logger.info(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    logger.info('HTTP server closed');
    pool.end();
    process.exit(0);
  });
});
