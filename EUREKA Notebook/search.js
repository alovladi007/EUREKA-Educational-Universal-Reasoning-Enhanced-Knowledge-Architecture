const express = require('express');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Global search across projects, tasks, and files
router.get('/', auth, async (req, res) => {
  try {
    const { q, type, page = 1, limit = 20 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const offset = (page - 1) * limit;
    const searchTerm = q.trim();
    const results = {
      projects: [],
      tasks: [],
      files: []
    };

    // Search projects
    if (!type || type === 'projects') {
      const projectsQuery = `
        SELECT p.*, 
               u.first_name || ' ' || u.last_name as owner_name,
               COUNT(t.id) as task_count,
               ts_rank(to_tsvector('english', p.name || ' ' || COALESCE(p.description, '')), 
                       plainto_tsquery('english', $1)) as rank
        FROM projects p
        LEFT JOIN users u ON p.owner_id = u.id
        LEFT JOIN tasks t ON p.id = t.project_id
        WHERE to_tsvector('english', p.name || ' ' || COALESCE(p.description, '')) @@ plainto_tsquery('english', $1)
           OR p.name ILIKE $2
           OR p.description ILIKE $2
        GROUP BY p.id, u.first_name, u.last_name
        ORDER BY rank DESC, p.created_at DESC
        LIMIT $3 OFFSET $4
      `;
      
      const projectsResult = await pool.query(projectsQuery, [
        searchTerm,
        `%${searchTerm}%`,
        limit,
        offset
      ]);
      
      results.projects = projectsResult.rows;
    }

    // Search tasks
    if (!type || type === 'tasks') {
      const tasksQuery = `
        SELECT t.*, 
               p.name as project_name,
               u1.first_name || ' ' || u1.last_name as assigned_to_name,
               u2.first_name || ' ' || u2.last_name as created_by_name,
               ts_rank(to_tsvector('english', t.title || ' ' || COALESCE(t.description, '')), 
                       plainto_tsquery('english', $1)) as rank
        FROM tasks t
        LEFT JOIN projects p ON t.project_id = p.id
        LEFT JOIN users u1 ON t.assigned_to = u1.id
        LEFT JOIN users u2 ON t.created_by = u2.id
        WHERE to_tsvector('english', t.title || ' ' || COALESCE(t.description, '')) @@ plainto_tsquery('english', $1)
           OR t.title ILIKE $2
           OR t.description ILIKE $2
        ORDER BY rank DESC, t.created_at DESC
        LIMIT $3 OFFSET $4
      `;
      
      const tasksResult = await pool.query(tasksQuery, [
        searchTerm,
        `%${searchTerm}%`,
        limit,
        offset
      ]);
      
      results.tasks = tasksResult.rows;
    }

    // Search files
    if (!type || type === 'files') {
      const filesQuery = `
        SELECT f.*, 
               p.name as project_name,
               t.title as task_title,
               u.first_name || ' ' || u.last_name as uploaded_by_name
        FROM files f
        LEFT JOIN projects p ON f.project_id = p.id
        LEFT JOIN tasks t ON f.task_id = t.id
        LEFT JOIN users u ON f.uploaded_by = u.id
        WHERE f.original_name ILIKE $1
           OR f.filename ILIKE $1
        ORDER BY f.created_at DESC
        LIMIT $2 OFFSET $3
      `;
      
      const filesResult = await pool.query(filesQuery, [
        `%${searchTerm}%`,
        limit,
        offset
      ]);
      
      results.files = filesResult.rows.map(file => ({
        ...file,
        url: `/api/files/${file.id}/download`
      }));
    }

    // Get counts
    const counts = {
      projects: results.projects.length,
      tasks: results.tasks.length,
      files: results.files.length,
      total: results.projects.length + results.tasks.length + results.files.length
    };

    // Log search activity
    await pool.query(
      'INSERT INTO activity_logs (action, entity_type, user_id, metadata) VALUES ($1, $2, $3, $4)',
      ['search_performed', 'search', req.user.id, JSON.stringify({ query: searchTerm, results: counts.total })]
    );

    res.json({
      query: searchTerm,
      results,
      counts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Advanced search with filters
router.post('/advanced', auth, async (req, res) => {
  try {
    const {
      query,
      filters = {},
      page = 1,
      limit = 20
    } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const offset = (page - 1) * limit;
    const searchTerm = query.trim();
    const results = {};

    // Projects search with filters
    if (!filters.type || filters.type === 'projects') {
      let projectsQuery = `
        SELECT p.*, 
               u.first_name || ' ' || u.last_name as owner_name,
               COUNT(t.id) as task_count,
               ts_rank(to_tsvector('english', p.name || ' ' || COALESCE(p.description, '')), 
                       plainto_tsquery('english', $1)) as rank
        FROM projects p
        LEFT JOIN users u ON p.owner_id = u.id
        LEFT JOIN tasks t ON p.id = t.project_id
        WHERE (to_tsvector('english', p.name || ' ' || COALESCE(p.description, '')) @@ plainto_tsquery('english', $1)
           OR p.name ILIKE $2
           OR p.description ILIKE $2)
      `;

      const queryParams = [searchTerm, `%${searchTerm}%`];
      let paramCount = 3;

      if (filters.status) {
        projectsQuery += ` AND p.status = $${paramCount++}`;
        queryParams.push(filters.status);
      }

      if (filters.owner_id) {
        projectsQuery += ` AND p.owner_id = $${paramCount++}`;
        queryParams.push(filters.owner_id);
      }

      if (filters.date_from) {
        projectsQuery += ` AND p.created_at >= $${paramCount++}`;
        queryParams.push(filters.date_from);
      }

      if (filters.date_to) {
        projectsQuery += ` AND p.created_at <= $${paramCount++}`;
        queryParams.push(filters.date_to);
      }

      projectsQuery += ` GROUP BY p.id, u.first_name, u.last_name`;
      projectsQuery += ` ORDER BY rank DESC, p.created_at DESC`;
      projectsQuery += ` LIMIT $${paramCount++} OFFSET $${paramCount}`;
      queryParams.push(limit, offset);

      const projectsResult = await pool.query(projectsQuery, queryParams);
      results.projects = projectsResult.rows;
    }

    // Tasks search with filters
    if (!filters.type || filters.type === 'tasks') {
      let tasksQuery = `
        SELECT t.*, 
               p.name as project_name,
               u1.first_name || ' ' || u1.last_name as assigned_to_name,
               u2.first_name || ' ' || u2.last_name as created_by_name,
               ts_rank(to_tsvector('english', t.title || ' ' || COALESCE(t.description, '')), 
                       plainto_tsquery('english', $1)) as rank
        FROM tasks t
        LEFT JOIN projects p ON t.project_id = p.id
        LEFT JOIN users u1 ON t.assigned_to = u1.id
        LEFT JOIN users u2 ON t.created_by = u2.id
        WHERE (to_tsvector('english', t.title || ' ' || COALESCE(t.description, '')) @@ plainto_tsquery('english', $1)
           OR t.title ILIKE $2
           OR t.description ILIKE $2)
      `;

      const queryParams = [searchTerm, `%${searchTerm}%`];
      let paramCount = 3;

      if (filters.status) {
        tasksQuery += ` AND t.status = $${paramCount++}`;
        queryParams.push(filters.status);
      }

      if (filters.priority) {
        tasksQuery += ` AND t.priority = $${paramCount++}`;
        queryParams.push(filters.priority);
      }

      if (filters.project_id) {
        tasksQuery += ` AND t.project_id = $${paramCount++}`;
        queryParams.push(filters.project_id);
      }

      if (filters.assigned_to) {
        tasksQuery += ` AND t.assigned_to = $${paramCount++}`;
        queryParams.push(filters.assigned_to);
      }

      if (filters.date_from) {
        tasksQuery += ` AND t.created_at >= $${paramCount++}`;
        queryParams.push(filters.date_from);
      }

      if (filters.date_to) {
        tasksQuery += ` AND t.created_at <= $${paramCount++}`;
        queryParams.push(filters.date_to);
      }

      tasksQuery += ` ORDER BY rank DESC, t.created_at DESC`;
      tasksQuery += ` LIMIT $${paramCount++} OFFSET $${paramCount}`;
      queryParams.push(limit, offset);

      const tasksResult = await pool.query(tasksQuery, queryParams);
      results.tasks = tasksResult.rows;
    }

    res.json({
      query: searchTerm,
      filters,
      results,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Advanced search error:', error);
    res.status(500).json({ error: 'Advanced search failed' });
  }
});

// Search suggestions (autocomplete)
router.get('/suggestions', auth, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({ suggestions: [] });
    }

    const searchTerm = q.trim();
    const suggestions = [];

    // Get project suggestions
    const projectsResult = await pool.query(
      `SELECT id, name, 'project' as type
       FROM projects
       WHERE name ILIKE $1
       LIMIT 5`,
      [`%${searchTerm}%`]
    );

    suggestions.push(...projectsResult.rows);

    // Get task suggestions
    const tasksResult = await pool.query(
      `SELECT id, title as name, 'task' as type
       FROM tasks
       WHERE title ILIKE $1
       LIMIT 5`,
      [`%${searchTerm}%`]
    );

    suggestions.push(...tasksResult.rows);

    res.json({ suggestions });
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

module.exports = router;
