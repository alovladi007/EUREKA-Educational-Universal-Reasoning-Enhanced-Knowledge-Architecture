const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadsDir = process.env.UPLOAD_DIR || './uploads';
    await fs.mkdir(uploadsDir, { recursive: true });
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 }
});

router.post('/upload/task/:taskId', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const result = await pool.query(
      'INSERT INTO files (filename, original_name, file_path, file_size, mime_type, task_id, uploaded_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.file.filename, req.file.originalname, req.file.path, req.file.size, req.file.mimetype, req.params.taskId, req.user.id]
    );
    res.status(201).json({ message: 'File uploaded', file: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

router.post('/upload/project/:projectId', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const result = await pool.query(
      'INSERT INTO files (filename, original_name, file_path, file_size, mime_type, project_id, uploaded_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.file.filename, req.file.originalname, req.file.path, req.file.size, req.file.mimetype, req.params.projectId, req.user.id]
    );
    res.status(201).json({ message: 'File uploaded', file: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

router.get('/:id/download', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM files WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'File not found' });
    res.download(result.rows[0].file_path, result.rows[0].original_name);
  } catch (error) {
    res.status(500).json({ error: 'Failed to download file' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM files WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'File not found' });
    
    await fs.unlink(result.rows[0].file_path).catch(console.error);
    await pool.query('DELETE FROM files WHERE id = $1', [req.params.id]);
    res.json({ message: 'File deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

module.exports = router;
