const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all projects
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
      query += ` AND p.status = $${paramCount++}`;
      values.push(status);
    }

    if (search) {
      query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      values.push(`%${search}%`);
      paramCount++;
    }

    query += ` GROUP BY p.id, u.first_name, u.last_name`;
    query += ` ORDER BY p.created_at DESC`;
    query += ` LIMIT $${paramCount++} OFFSET $${paramCount}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM projects WHERE 1=1';
    const countValues = [];
    let countParam = 1;

    if (status) {
      countQuery += ` AND status = $${countParam++}`;
      countValues.push(status);
    }

    if (search) {
      countQuery += ` AND (name ILIKE $${countParam} OR description ILIKE $${countParam})`;
      countValues.push(`%${search}%`);
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

// Get single project
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, 
              u.first_name || ' ' || u.last_name as owner_name,
              COUNT(DISTINCT t.id) as task_count,
              COUNT(DISTINCT f.id) as file_count
       FROM projects p
       LEFT JOIN users u ON p.owner_id = u.id
       LEFT JOIN tasks t ON p.id = t.project_id
       LEFT JOIN files f ON p.id = f.project_id
       WHERE p.id = $1
       GROUP BY p.id, u.first_name, u.last_name`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project: result.rows[0] });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create new project
router.post('/',
  auth,
  [
    body('name').trim().notEmpty(),
    body('description').optional().trim(),
    body('budget').optional().isDecimal()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description, status, start_date, end_date, budget } = req.body;

      const result = await pool.query(
        `INSERT INTO projects (name, description, status, owner_id, start_date, end_date, budget)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [name, description, status || 'active', req.user.id, start_date, end_date, budget]
      );

      const project = result.rows[0];

      // Log activity
      await pool.query(
        'INSERT INTO activity_logs (action, entity_type, entity_id, user_id, metadata) VALUES ($1, $2, $3, $4, $5)',
        ['project_created', 'project', project.id, req.user.id, JSON.stringify({ project_name: name })]
      );

      // Create notification for project owner
      await pool.query(
        `INSERT INTO notifications (type, title, message, user_id, related_id, related_type)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        ['project', 'New Project Created', `You created project: ${name}`, req.user.id, project.id, 'project']
      );

      res.status(201).json({
        message: 'Project created successfully',
        project
      });
    } catch (error) {
      console.error('Create project error:', error);
      res.status(500).json({ error: 'Failed to create project' });
    }
  }
);

// Update project
router.put('/:id',
  auth,
  [
    body('name').optional().trim().notEmpty(),
    body('description').optional().trim(),
    body('budget').optional().isDecimal()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if project exists and user has permission
      const projectCheck = await pool.query(
        'SELECT owner_id FROM projects WHERE id = $1',
        [req.params.id]
      );

      if (projectCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const { name, description, status, start_date, end_date, budget } = req.body;
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (name) {
        updates.push(`name = $${paramCount++}`);
        values.push(name);
      }
      if (description !== undefined) {
        updates.push(`description = $${paramCount++}`);
        values.push(description);
      }
      if (status) {
        updates.push(`status = $${paramCount++}`);
        values.push(status);
      }
      if (start_date) {
        updates.push(`start_date = $${paramCount++}`);
        values.push(start_date);
      }
      if (end_date) {
        updates.push(`end_date = $${paramCount++}`);
        values.push(end_date);
      }
      if (budget !== undefined) {
        updates.push(`budget = $${paramCount++}`);
        values.push(budget);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(req.params.id);

      const result = await pool.query(
        `UPDATE projects SET ${updates.join(', ')}
         WHERE id = $${paramCount}
         RETURNING *`,
        values
      );

      // Log activity
      await pool.query(
        'INSERT INTO activity_logs (action, entity_type, entity_id, user_id, metadata) VALUES ($1, $2, $3, $4, $5)',
        ['project_updated', 'project', req.params.id, req.user.id, JSON.stringify({ project_name: name })]
      );

      res.json({
        message: 'Project updated successfully',
        project: result.rows[0]
      });
    } catch (error) {
      console.error('Update project error:', error);
      res.status(500).json({ error: 'Failed to update project' });
    }
  }
);

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if project exists
    const projectCheck = await pool.query(
      'SELECT id, name, owner_id FROM projects WHERE id = $1',
      [req.params.id]
    );

    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projectCheck.rows[0];

    // Delete project (CASCADE will handle related records)
    await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id]);

    // Log activity
    await pool.query(
      'INSERT INTO activity_logs (action, entity_type, entity_id, user_id, metadata) VALUES ($1, $2, $3, $4, $5)',
      ['project_deleted', 'project', req.params.id, req.user.id, JSON.stringify({ project_name: project.name })]
    );

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Get project statistics
router.get('/:id/stats', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         COUNT(DISTINCT t.id) as total_tasks,
         COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as completed_tasks,
         COUNT(DISTINCT CASE WHEN t.status = 'in_progress' THEN t.id END) as in_progress_tasks,
         COUNT(DISTINCT CASE WHEN t.status = 'todo' THEN t.id END) as todo_tasks,
         COUNT(DISTINCT f.id) as total_files,
         SUM(f.file_size) as total_file_size
       FROM projects p
       LEFT JOIN tasks t ON p.id = t.project_id
       LEFT JOIN files f ON p.id = f.project_id
       WHERE p.id = $1
       GROUP BY p.id`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ stats: result.rows[0] });
  } catch (error) {
    console.error('Get project stats error:', error);
    res.status(500).json({ error: 'Failed to fetch project statistics' });
  }
});

module.exports = router;
