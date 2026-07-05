/**
 * Authentication Routes
 * JWT-based authentication for XR Labs platform
 */

import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

export function initializeAuthRoutes(pool: Pool, jwtSecret: string) {

  /**
   * POST /api/auth/register
   * Register a new user
   */
  router.post('/register', async (req: Request, res: Response) => {
    try {
      const { email, username, password, fullName } = req.body;

      // Validation
      if (!email || !username || !password) {
        return res.status(400).json({ error: 'Email, username, and password are required' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      // Check if user exists
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1 OR username = $2',
        [email, username]
      );

      if (existingUser.rows.length > 0) {
        return res.status(409).json({ error: 'User with this email or username already exists' });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const result = await pool.query(
        `INSERT INTO users (email, username, password_hash, full_name, role, is_active, is_verified)
         VALUES ($1, $2, $3, $4, 'student', true, false)
         RETURNING id, email, username, full_name, role, created_at`,
        [email, username, passwordHash, fullName || username]
      );

      const user = result.rows[0];

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        },
        jwtSecret,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.full_name,
          role: user.role
        },
        token
      });
    } catch (error: any) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * POST /api/auth/login
   * Login with email/username and password
   */
  router.post('/login', async (req: Request, res: Response) => {
    try {
      const { emailOrUsername, password } = req.body;

      if (!emailOrUsername || !password) {
        return res.status(400).json({ error: 'Email/username and password are required' });
      }

      // Find user by email or username
      const result = await pool.query(
        `SELECT id, email, username, password_hash, full_name, role, is_active, is_verified
         FROM users
         WHERE email = $1 OR username = $1`,
        [emailOrUsername]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = result.rows[0];

      // Check if account is active
      if (!user.is_active) {
        return res.status(403).json({ error: 'Account is disabled' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      await pool.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        },
        jwtSecret,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.full_name,
          role: user.role,
          isVerified: user.is_verified
        },
        token
      });
    } catch (error: any) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/auth/me
   * Get current user profile (requires authentication)
   */
  router.get('/me', authenticateTokenMiddleware(jwtSecret), async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;

      const result = await pool.query(
        `SELECT id, email, username, full_name, role, is_active, is_verified, created_at, last_login
         FROM users
         WHERE id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = result.rows[0];

      res.json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.full_name,
          role: user.role,
          isActive: user.is_active,
          isVerified: user.is_verified,
          createdAt: user.created_at,
          lastLogin: user.last_login
        }
      });
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * POST /api/auth/refresh
   * Refresh JWT token
   */
  router.post('/refresh', authenticateTokenMiddleware(jwtSecret), async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;

      // Generate new token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        },
        jwtSecret,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Token refreshed successfully',
        token
      });
    } catch (error: any) {
      console.error('Error refreshing token:', error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

/**
 * Middleware to authenticate JWT token
 */
function authenticateTokenMiddleware(jwtSecret: string) {
  return (req: Request, res: Response, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    try {
      const user = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] });
      (req as any).user = user;
      next();
    } catch (error) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
  };
}

export default router;
