const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT p.*, 
             u.first_name || ' ' || u.last_name as owner_name,
             COUNT(t.id) as task_count
      FROM projects p
      LEFT JOIN users u ON p.owner_id = u.id
      LEFT JOIN tasks t ON p.id = t.project_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (status) {
      query += \` AND p.status = $\${paramCount++}\`;
      values.push(status);
    }

    if (search) {
      query += \` AND (p.name ILIKE $\${paramCount} OR p.description ILIKE $\${paramCount})\`;
      values.push(\`%\${search}%\`);
      paramCount++;
    }

    query += \` GROUP BY p.id, u.first_name, u.last_name\`;
    query += \` ORDER BY p.created_at DESC\`;
    query += \` LIMIT $\${paramCount++} OFFSET $\${paramCount}\`;
    values.push(limit, offset);

    const result = await pool.query(query, values);

    let countQuery = 'SELECT COUNT(*) FROM projects WHERE 1=1';
    const countValues = [];
    let countParam = 1;

    if (status) {
      countQuery += \` AND status = $\${countParam++}\`;
      countValues.push(status);
    }

    if (search) {
      countQuery += \` AND (name ILIKE $\${countParam} OR description ILIKE $\${countParam})\`;
      countValues.push(\`%\${search}%\`);
    }

    const countResult = await pool.query(countQuery, countValues);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      projects: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});
