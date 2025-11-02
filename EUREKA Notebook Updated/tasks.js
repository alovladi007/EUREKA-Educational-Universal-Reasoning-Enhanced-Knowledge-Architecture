const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { status, priority, project_id, search } = req.query;
    let query = 'SELECT t.*, p.name as project_name FROM tasks t LEFT JOIN projects p ON t.project_id = p.id WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (status) { query += ` AND t.status = $${paramCount++}`; values.push(status); }
    if (priority) { query += ` AND t.priority = $${paramCount++}`; values.push(priority); }
    if (project_id) { query += ` AND t.project_id = $${paramCount++}`; values.push(project_id); }
    if (search) { query += ` AND (t.title ILIKE $${paramCount} OR t.description ILIKE $${paramCount})`; values.push(`%${search}%`); }

    query += ' ORDER BY t.created_at DESC';
    const result = await pool.query(query, values);
    res.json({ tasks: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ task: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

router.post('/', auth, [body('title').notEmpty(), body('project_id').isInt()], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description, status, priority, project_id, assigned_to, due_date } = req.body;
    const result = await pool.query(
      'INSERT INTO tasks (title, description, status, priority, project_id, assigned_to, created_by, due_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, description, status || 'todo', priority || 'medium', project_id, assigned_to, req.user.id, due_date]
    );
    res.status(201).json({ message: 'Task created', task: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, status, priority, assigned_to, due_date } = req.body;
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title) { updates.push(`title = $${paramCount++}`); values.push(title); }
    if (description !== undefined) { updates.push(`description = $${paramCount++}`); values.push(description); }
    if (status) { updates.push(`status = $${paramCount++}`); values.push(status); }
    if (priority) { updates.push(`priority = $${paramCount++}`); values.push(priority); }
    if (assigned_to !== undefined) { updates.push(`assigned_to = $${paramCount++}`); values.push(assigned_to); }
    if (due_date !== undefined) { updates.push(`due_date = $${paramCount++}`); values.push(due_date); }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(req.params.id);

    const result = await pool.query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    res.json({ message: 'Task updated', task: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

router.post('/:id/comments', auth, [body('content').notEmpty()], async (req, res) => {
  try {
    const { content } = req.body;
    const result = await pool.query(
      'INSERT INTO comments (content, task_id, user_id) VALUES ($1, $2, $3) RETURNING *',
      [content, req.params.id, req.user.id]
    );
    res.status(201).json({ message: 'Comment added', comment: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

module.exports = router;
