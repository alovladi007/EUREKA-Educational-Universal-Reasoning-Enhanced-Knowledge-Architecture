require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const pool = require('./config/database');
const { initializeWebSocket } = require('./websocket');

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const fileRoutes = require('./routes/files');
const paymentRoutes = require('./routes/payments');
const searchRoutes = require('./routes/search');
const notificationRoutes = require('./routes/notifications');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize WebSocket
initializeWebSocket(io);

// Make io accessible to routes
app.set('io', io);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/notifications', notificationRoutes);

// Dashboard stats endpoint
app.get('/api/dashboard/stats', require('./middleware/auth').auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get project stats
    const projectStats = await pool.query(
      `SELECT 
         COUNT(*) as total_projects,
         COUNT(CASE WHEN status = 'active' THEN 1 END) as active_projects,
         COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_projects
       FROM projects
       WHERE owner_id = $1 OR id IN (
         SELECT DISTINCT project_id FROM tasks WHERE assigned_to = $1
       )`,
      [userId]
    );

    // Get task stats
    const taskStats = await pool.query(
      `SELECT 
         COUNT(*) as total_tasks,
         COUNT(CASE WHEN status = 'todo' THEN 1 END) as todo_tasks,
         COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
         COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks
       FROM tasks
       WHERE assigned_to = $1 OR created_by = $1`,
      [userId]
    );

    // Get recent activity
    const recentActivity = await pool.query(
      `SELECT al.*, u.first_name || ' ' || u.last_name as user_name
       FROM activity_logs al
       LEFT JOIN users u ON al.user_id = u.id
       WHERE al.user_id = $1
       ORDER BY al.created_at DESC
       LIMIT 10`,
      [userId]
    );

    // Get upcoming tasks
    const upcomingTasks = await pool.query(
      `SELECT t.*, p.name as project_name
       FROM tasks t
       LEFT JOIN projects p ON t.project_id = p.id
       WHERE t.assigned_to = $1 
         AND t.status != 'completed'
         AND t.due_date IS NOT NULL
         AND t.due_date > CURRENT_TIMESTAMP
       ORDER BY t.due_date ASC
       LIMIT 5`,
      [userId]
    );

    // Get overdue tasks
    const overdueTasks = await pool.query(
      `SELECT COUNT(*) as count
       FROM tasks
       WHERE assigned_to = $1 
         AND status != 'completed'
         AND due_date < CURRENT_TIMESTAMP`,
      [userId]
    );

    res.json({
      projects: projectStats.rows[0],
      tasks: taskStats.rows[0],
      recentActivity: recentActivity.rows,
      upcomingTasks: upcomingTasks.rows,
      overdueTasks: parseInt(overdueTasks.rows[0].count)
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    statusCode: 404
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File too large',
      message: 'The uploaded file exceeds the maximum allowed size'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      error: 'Invalid file upload',
      message: 'Unexpected file field'
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    statusCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');

    server.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Commercial Platform Backend Server                   ║
║                                                            ║
║   Server running on: http://localhost:${PORT}              ║
║   Environment: ${process.env.NODE_ENV || 'development'}                           ║
║   WebSocket: Enabled                                       ║
║                                                            ║
║   API Endpoints:                                           ║
║   - Auth:          /api/auth                               ║
║   - Projects:      /api/projects                           ║
║   - Tasks:         /api/tasks                              ║
║   - Files:         /api/files                              ║
║   - Payments:      /api/payments                           ║
║   - Search:        /api/search                             ║
║   - Notifications: /api/notifications                      ║
║   - Dashboard:     /api/dashboard/stats                    ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    pool.end(() => {
      console.log('Database pool closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    pool.end(() => {
      console.log('Database pool closed');
      process.exit(0);
    });
  });
});

startServer();

module.exports = { app, server, io };
