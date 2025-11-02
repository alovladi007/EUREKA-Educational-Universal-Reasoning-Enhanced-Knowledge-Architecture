const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = process.env.UPLOAD_DIR || './uploads';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
      cb(null, uploadsDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Allow common file types
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|txt|csv|zip|rar/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, documents, and archives are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  },
  fileFilter: fileFilter
});

// Upload file to task
router.post('/upload/task/:taskId',
  auth,
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Verify task exists
      const taskCheck = await pool.query(
        'SELECT id FROM tasks WHERE id = $1',
        [req.params.taskId]
      );

      if (taskCheck.rows.length === 0) {
        // Delete uploaded file
        await fs.unlink(req.file.path);
        return res.status(404).json({ error: 'Task not found' });
      }

      // Save file info to database
      const result = await pool.query(
        `INSERT INTO files (filename, original_name, file_path, file_size, mime_type, task_id, uploaded_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          req.file.filename,
          req.file.originalname,
          req.file.path,
          req.file.size,
          req.file.mimetype,
          req.params.taskId,
          req.user.id
        ]
      );

      const file = result.rows[0];

      // Log activity
      await pool.query(
        'INSERT INTO activity_logs (action, entity_type, entity_id, user_id, metadata) VALUES ($1, $2, $3, $4, $5)',
        ['file_uploaded', 'file', file.id, req.user.id, JSON.stringify({ filename: req.file.originalname, task_id: req.params.taskId })]
      );

      res.status(201).json({
        message: 'File uploaded successfully',
        file: {
          ...file,
          url: `/api/files/${file.id}/download`
        }
      });
    } catch (error) {
      console.error('File upload error:', error);
      // Clean up file if database insert fails
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }
      res.status(500).json({ error: 'Failed to upload file' });
    }
  }
);

// Upload file to project
router.post('/upload/project/:projectId',
  auth,
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Verify project exists
      const projectCheck = await pool.query(
        'SELECT id FROM projects WHERE id = $1',
        [req.params.projectId]
      );

      if (projectCheck.rows.length === 0) {
        await fs.unlink(req.file.path);
        return res.status(404).json({ error: 'Project not found' });
      }

      const result = await pool.query(
        `INSERT INTO files (filename, original_name, file_path, file_size, mime_type, project_id, uploaded_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          req.file.filename,
          req.file.originalname,
          req.file.path,
          req.file.size,
          req.file.mimetype,
          req.params.projectId,
          req.user.id
        ]
      );

      const file = result.rows[0];

      // Log activity
      await pool.query(
        'INSERT INTO activity_logs (action, entity_type, entity_id, user_id, metadata) VALUES ($1, $2, $3, $4, $5)',
        ['file_uploaded', 'file', file.id, req.user.id, JSON.stringify({ filename: req.file.originalname, project_id: req.params.projectId })]
      );

      res.status(201).json({
        message: 'File uploaded successfully',
        file: {
          ...file,
          url: `/api/files/${file.id}/download`
        }
      });
    } catch (error) {
      console.error('File upload error:', error);
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }
      res.status(500).json({ error: 'Failed to upload file' });
    }
  }
);

// Get file info
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT f.*, u.first_name || ' ' || u.last_name as uploaded_by_name
       FROM files f
       LEFT JOIN users u ON f.uploaded_by = u.id
       WHERE f.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({
      file: {
        ...result.rows[0],
        url: `/api/files/${result.rows[0].id}/download`
      }
    });
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ error: 'Failed to fetch file' });
  }
});

// Download file
router.get('/:id/download', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM files WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = result.rows[0];

    // Check if file exists
    try {
      await fs.access(file.file_path);
    } catch {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    res.download(file.file_path, file.original_name);
  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// Delete file
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM files WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = result.rows[0];

    // Delete file from disk
    try {
      await fs.unlink(file.file_path);
    } catch (error) {
      console.error('Error deleting file from disk:', error);
    }

    // Delete from database
    await pool.query('DELETE FROM files WHERE id = $1', [req.params.id]);

    // Log activity
    await pool.query(
      'INSERT INTO activity_logs (action, entity_type, entity_id, user_id, metadata) VALUES ($1, $2, $3, $4, $5)',
      ['file_deleted', 'file', req.params.id, req.user.id, JSON.stringify({ filename: file.original_name })]
    );

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Get files by task
router.get('/task/:taskId', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT f.*, u.first_name || ' ' || u.last_name as uploaded_by_name
       FROM files f
       LEFT JOIN users u ON f.uploaded_by = u.id
       WHERE f.task_id = $1
       ORDER BY f.created_at DESC`,
      [req.params.taskId]
    );

    const files = result.rows.map(file => ({
      ...file,
      url: `/api/files/${file.id}/download`
    }));

    res.json({ files });
  } catch (error) {
    console.error('Get task files error:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// Get files by project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT f.*, u.first_name || ' ' || u.last_name as uploaded_by_name
       FROM files f
       LEFT JOIN users u ON f.uploaded_by = u.id
       WHERE f.project_id = $1
       ORDER BY f.created_at DESC`,
      [req.params.projectId]
    );

    const files = result.rows.map(file => ({
      ...file,
      url: `/api/files/${file.id}/download`
    }));

    res.json({ files });
  } catch (error) {
    console.error('Get project files error:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

module.exports = router;
