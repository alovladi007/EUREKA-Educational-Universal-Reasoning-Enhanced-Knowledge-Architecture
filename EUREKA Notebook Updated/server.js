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

initializeWebSocket(io);
app.set('io', io);

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/dashboard/stats', require('./middleware/auth').auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const projectStats = await pool.query(
      "SELECT COUNT(*) as total_projects, COUNT(CASE WHEN status = 'active' THEN 1 END) as active_projects FROM projects WHERE owner_id = $1",
      [userId]
    );

    const taskStats = await pool.query(
      "SELECT COUNT(*) as total_tasks, COUNT(CASE WHEN status = 'todo' THEN 1 END) as todo_tasks, COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks, COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks FROM tasks WHERE assigned_to = $1 OR created_by = $1",
      [userId]
    );

    const recentActivity = await pool.query(
      "SELECT al.*, u.first_name || ' ' || u.last_name as user_name FROM activity_logs al LEFT JOIN users u ON al.user_id = u.id WHERE al.user_id = $1 ORDER BY al.created_at DESC LIMIT 10",
      [userId]
    );

    const upcomingTasks = await pool.query(
      "SELECT t.*, p.name as project_name FROM tasks t LEFT JOIN projects p ON t.project_id = p.id WHERE t.assigned_to = $1 AND t.status != 'completed' AND t.due_date > CURRENT_TIMESTAMP ORDER BY t.due_date ASC LIMIT 5",
      [userId]
    );

    const overdueTasks = await pool.query(
      "SELECT COUNT(*) FROM tasks WHERE assigned_to = $1 AND status != 'completed' AND due_date < CURRENT_TIMESTAMP",
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
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
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
╚════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = { app, server, io };
