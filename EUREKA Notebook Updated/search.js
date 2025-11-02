const express = require('express');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Search query required' });

    const searchTerm = `%${q}%`;
    const results = {};

    const projects = await pool.query('SELECT * FROM projects WHERE name ILIKE $1 OR description ILIKE $1 LIMIT 10', [searchTerm]);
    const tasks = await pool.query('SELECT * FROM tasks WHERE title ILIKE $1 OR description ILIKE $1 LIMIT 10', [searchTerm]);
    const files = await pool.query('SELECT * FROM files WHERE original_name ILIKE $1 LIMIT 10', [searchTerm]);

    results.projects = projects.rows;
    results.tasks = tasks.rows;
    results.files = files.rows;

    res.json({ query: q, results });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
