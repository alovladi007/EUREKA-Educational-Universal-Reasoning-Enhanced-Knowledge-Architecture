const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all tasks
router.get('/', auth, async (req, res) => {
  try {
    const { status, priority, project_id, assigned_to, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT t.*, 
             p.name as project_name,
             u1.first_name || ' ' || u1.last_name as assigned_to_name,
             u2.first_name || ' ' || u2.last_name as created_by_name,
             COUNT(DISTINCT c.id) as comment_count,
             COUNT(DISTINCT f.id) as file_count
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u1 ON t.assigned_to = u1.id
      LEFT JOIN users u2 ON t.created_by = u2.id
      LEFT JOIN comments c ON t.id = c.task_id
      LEFT JOIN files f ON t.id = f.task_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (status) {
      query += ` AND t.status = $${paramCount++}`;
      values.push(status);
    }

    if (priority) {
      query += ` AND t.priority = $${paramCount++}`;
      values.push(priority);
    }

    if (project_id) {
      query += ` AND t.project_id = $${paramCount++}`;
      values.push(project_id);
    }

    if (assigned_to) {
      query += ` AND t.assigned_to = $${paramCount++}`;
      values.push(assigned_to);
    }

    if (search) {
      query += ` AND (t.title ILIKE $${paramCount} OR t.description ILIKE $${paramCount})`;
      values.push(`%${search}%`);
      paramCount++;
    }

    query += ` GROUP BY t.id, p.name, u1.first_name, u1.last_name, u2.first_name, u2.last_name`;
    query += ` ORDER BY t.created_at DESC`;
    query += ` LIMIT $${paramCount++} OFFSET $${paramCount}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM tasks WHERE 1=1';
    const countValues = [];
    let countParam = 1;

    if (status) {
      countQuery += ` AND status = $${countParam++}`;
      countValues.push(status);
    }
    if (priority) {
      countQuery += ` AND priority = $${countParam++}`;
      countValues.push(priority);
    }
    if (project_id) {
      countQuery += ` AND project_id = $${countParam++}`;
      countValues.push(project_id);
    }
    if (assigned_to) {
      countQuery += ` AND assigned_to = $${countParam++}`;
      countValues.push(assigned_to);
    }
    if (search) {
      countQuery += ` AND (title ILIKE $${countParam} OR description ILIKE $${countParam})`;
      countValues.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countValues);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      tasks: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get single task
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, 
              p.name as project_name,
              u1.first_name || ' ' || u1.last_name as assigned_to_name,
              u2.first_name || ' ' || u2.last_name as created_by_name
       FROM tasks t
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN users u1 ON t.assigned_to = u1.id
       LEFT JOIN users u2 ON t.created_by = u2.id
       WHERE t.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Get comments
    const comments = await pool.query(
      `SELECT c.*, u.first_name || ' ' || u.last_name as user_name, u.avatar_url
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.task_id = $1
       ORDER BY c.created_at DESC`,
      [req.params.id]
    );

    // Get files
    const files = await pool.query(
      `SELECT f.*, u.first_name || ' ' || u.last_name as uploaded_by_name
       FROM files f
       LEFT JOIN users u ON f.uploaded_by = u.id
       WHERE f.task_id = $1
       ORDER BY f.created_at DESC`,
      [req.params.id]
    );

    res.json({
      task: result.rows[0],
      comments: comments.rows,
      files: files.rows
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Create new task
router.post('/',
  auth,
  [
    body('title').trim().notEmpty(),
    body('project_id').isInt(),
    body('description').optional().trim(),
    body('status').optional().isIn(['todo', 'in_progress', 'completed', 'blocked']),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, status, priority, project_id, assigned_to, due_date } = req.body;

      const result = await pool.query(
        `INSERT INTO tasks (title, description, status, priority, project_id, assigned_to, created_by, due_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [title, description, status || 'todo', priority || 'medium', project_id, assigned_to, req.user.id, due_date]
      );

      const task = result.rows[0];

      // Log activity
      await pool.query(
        'INSERT INTO activity_logs (action, entity_type, entity_id, user_id, metadata) VALUES ($1, $2, $3, $4, $5)',
        ['task_created', 'task', task.id, req.user.id, JSON.stringify({ task_title: title, project_id })]
      );

      // Create notification for assigned user
      if (assigned_to) {
        await pool.query(
          `INSERT INTO notifications (type, title, message, user_id, related_id, related_type)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          ['task', 'New Task Assigned', `You have been assigned to task: ${title}`, assigned_to, task.id, 'task']
        );
      }

      res.status(201).json({
        message: 'Task created successfully',
        task
      });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  }
);

// Update task
router.put('/:id',
  auth,
  [
    body('title').optional().trim().notEmpty(),
    body('status').optional().isIn(['todo', 'in_progress', 'completed', 'blocked']),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if task exists
      const taskCheck = await pool.query(
        'SELECT * FROM tasks WHERE id = $1',
        [req.params.id]
      );

      if (taskCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const oldTask = taskCheck.rows[0];
      const { title, description, status, priority, assigned_to, due_date } = req.body;
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (title) {
        updates.push(`title = $${paramCount++}`);
        values.push(title);
      }
      if (description !== undefined) {
        updates.push(`description = $${paramCount++}`);
        values.push(description);
      }
      if (status) {
        updates.push(`status = $${paramCount++}`);
        values.push(status);
        
        // If marked as completed, set completed_at
        if (status === 'completed' && oldTask.status !== 'completed') {
          updates.push(`completed_at = CURRENT_TIMESTAMP`);
        }
      }
      if (priority) {
        updates.push(`priority = $${paramCount++}`);
        values.push(priority);
      }
      if (assigned_to !== undefined) {
        updates.push(`assigned_to = $${paramCount++}`);
        values.push(assigned_to);
      }
      if (due_date !== undefined) {
        updates.push(`due_date = $${paramCount++}`);
        values.push(due_date);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(req.params.id);

      const result = await pool.query(
        `UPDATE tasks SET ${updates.join(', ')}
         WHERE id = $${paramCount}
         RETURNING *`,
        values
      );

      // Log activity
      await pool.query(
        'INSERT INTO activity_logs (action, entity_type, entity_id, user_id, metadata) VALUES ($1, $2, $3, $4, $5)',
        ['task_updated', 'task', req.params.id, req.user.id, JSON.stringify({ task_title: title || oldTask.title })]
      );

      // Create notification if status changed to completed
      if (status === 'completed' && oldTask.status !== 'completed' && oldTask.created_by) {
        await pool.query(
          `INSERT INTO notifications (type, title, message, user_id, related_id, related_type)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          ['task', 'Task Completed', `Task "${title || oldTask.title}" has been completed`, oldTask.created_by, req.params.id, 'task']
        );
      }

      // Create notification if assigned to someone new
      if (assigned_to && assigned_to !== oldTask.assigned_to) {
        await pool.query(
          `INSERT INTO notifications (type, title, message, user_id, related_id, related_type)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          ['task', 'Task Reassigned', `You have been assigned to task: ${title || oldTask.title}`, assigned_to, req.params.id, 'task']
        );
      }

      res.json({
        message: 'Task updated successfully',
        task: result.rows[0]
      });
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  }
);

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if task exists
    const taskCheck = await pool.query(
      'SELECT id, title FROM tasks WHERE id = $1',
      [req.params.id]
    );

    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = taskCheck.rows[0];

    await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);

    // Log activity
    await pool.query(
      'INSERT INTO activity_logs (action, entity_type, entity_id, user_id, metadata) VALUES ($1, $2, $3, $4, $5)',
      ['task_deleted', 'task', req.params.id, req.user.id, JSON.stringify({ task_title: task.title })]
    );

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Add comment to task
router.post('/:id/comments',
  auth,
  [body('content').trim().notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { content } = req.body;

      // Check if task exists
      const taskCheck = await pool.query(
        'SELECT title, assigned_to FROM tasks WHERE id = $1',
        [req.params.id]
      );

      if (taskCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const result = await pool.query(
        `INSERT INTO comments (content, task_id, user_id)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [content, req.params.id, req.user.id]
      );

      const comment = result.rows[0];

      // Get user info for response
      const userInfo = await pool.query(
        'SELECT first_name || \' \' || last_name as user_name, avatar_url FROM users WHERE id = $1',
        [req.user.id]
      );

      // Create notification for assigned user
      if (taskCheck.rows[0].assigned_to && taskCheck.rows[0].assigned_to !== req.user.id) {
        await pool.query(
          `INSERT INTO notifications (type, title, message, user_id, related_id, related_type)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          ['comment', 'New Comment', `New comment on task: ${taskCheck.rows[0].title}`, taskCheck.rows[0].assigned_to, req.params.id, 'task']
        );
      }

      res.status(201).json({
        message: 'Comment added successfully',
        comment: {
          ...comment,
          user_name: userInfo.rows[0].user_name,
          avatar_url: userInfo.rows[0].avatar_url
        }
      });
    } catch (error) {
      console.error('Add comment error:', error);
      res.status(500).json({ error: 'Failed to add comment' });
    }
  }
);

module.exports = router;
