const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Register new user
router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('first_name').trim().notEmpty(),
    body('last_name').trim().notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, first_name, last_name } = req.body;

      // Check if user already exists
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const result = await pool.query(
        `INSERT INTO users (email, password, first_name, last_name, role)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, first_name, last_name, role, created_at`,
        [email, hashedPassword, first_name, last_name, 'user']
      );

      const user = result.rows[0];
      const token = generateToken(user.id);

      // Log activity
      await pool.query(
        'INSERT INTO activity_logs (action, entity_type, entity_id, user_id) VALUES ($1, $2, $3, $4)',
        ['user_registered', 'user', user.id, user.id]
      );

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role
        },
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// Login
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1 AND is_active = true',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = result.rows[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user.id);

      // Update last login
      await pool.query(
        'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      // Log activity
      await pool.query(
        'INSERT INTO activity_logs (action, entity_type, entity_id, user_id) VALUES ($1, $2, $3, $4)',
        ['user_login', 'user', user.id, user.id]
      );

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          avatar_url: user.avatar_url
        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, role, avatar_url, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/me', auth,
  [
    body('first_name').optional().trim().notEmpty(),
    body('last_name').optional().trim().notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { first_name, last_name, avatar_url } = req.body;
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (first_name) {
        updates.push(`first_name = $${paramCount++}`);
        values.push(first_name);
      }
      if (last_name) {
        updates.push(`last_name = $${paramCount++}`);
        values.push(last_name);
      }
      if (avatar_url) {
        updates.push(`avatar_url = $${paramCount++}`);
        values.push(avatar_url);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(req.user.id);

      const result = await pool.query(
        `UPDATE users SET ${updates.join(', ')}
         WHERE id = $${paramCount}
         RETURNING id, email, first_name, last_name, role, avatar_url`,
        values
      );

      // Log activity
      await pool.query(
        'INSERT INTO activity_logs (action, entity_type, entity_id, user_id) VALUES ($1, $2, $3, $4)',
        ['profile_updated', 'user', req.user.id, req.user.id]
      );

      res.json({
        message: 'Profile updated successfully',
        user: result.rows[0]
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
);

// Change password
router.put('/change-password', auth,
  [
    body('current_password').notEmpty(),
    body('new_password').isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { current_password, new_password } = req.body;

      // Get current password
      const result = await pool.query(
        'SELECT password FROM users WHERE id = $1',
        [req.user.id]
      );

      const user = result.rows[0];
      const isValidPassword = await bcrypt.compare(current_password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(new_password, 10);

      // Update password
      await pool.query(
        'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [hashedPassword, req.user.id]
      );

      // Log activity
      await pool.query(
        'INSERT INTO activity_logs (action, entity_type, entity_id, user_id) VALUES ($1, $2, $3, $4)',
        ['password_changed', 'user', req.user.id, req.user.id]
      );

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Password change error:', error);
      res.status(500).json({ error: 'Failed to change password' });
    }
  }
);

module.exports = router;
