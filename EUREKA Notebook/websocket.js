const jwt = require('jsonwebtoken');
const pool = require('./config/database');

const initializeWebSocket = (io) => {
  // Middleware for socket authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result = await pool.query(
        'SELECT id, email, first_name, last_name, role FROM users WHERE id = $1 AND is_active = true',
        [decoded.userId]
      );

      if (result.rows.length === 0) {
        return next(new Error('User not found'));
      }

      socket.user = result.rows[0];
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user.email} (${socket.id})`);

    // Join user's personal room
    socket.join(`user:${socket.user.id}`);

    // Join project rooms
    socket.on('join:project', async (projectId) => {
      try {
        // Verify user has access to project
        const result = await pool.query(
          'SELECT id FROM projects WHERE id = $1',
          [projectId]
        );

        if (result.rows.length > 0) {
          socket.join(`project:${projectId}`);
          console.log(`User ${socket.user.email} joined project:${projectId}`);
          
          // Notify others in the project room
          socket.to(`project:${projectId}`).emit('user:joined', {
            userId: socket.user.id,
            userName: `${socket.user.first_name} ${socket.user.last_name}`
          });
        }
      } catch (error) {
        console.error('Join project error:', error);
      }
    });

    // Leave project room
    socket.on('leave:project', (projectId) => {
      socket.leave(`project:${projectId}`);
      console.log(`User ${socket.user.email} left project:${projectId}`);
      
      // Notify others in the project room
      socket.to(`project:${projectId}`).emit('user:left', {
        userId: socket.user.id,
        userName: `${socket.user.first_name} ${socket.user.last_name}`
      });
    });

    // Real-time task updates
    socket.on('task:update', async (data) => {
      try {
        const { taskId, projectId, update } = data;

        // Broadcast to all users in the project
        socket.to(`project:${projectId}`).emit('task:updated', {
          taskId,
          update,
          updatedBy: {
            id: socket.user.id,
            name: `${socket.user.first_name} ${socket.user.last_name}`
          },
          timestamp: new Date()
        });

        // Log activity
        await pool.query(
          'INSERT INTO activity_logs (action, entity_type, entity_id, user_id, metadata) VALUES ($1, $2, $3, $4, $5)',
          ['task_realtime_update', 'task', taskId, socket.user.id, JSON.stringify(update)]
        );
      } catch (error) {
        console.error('Task update broadcast error:', error);
      }
    });

    // Real-time comment posting
    socket.on('comment:new', async (data) => {
      try {
        const { taskId, projectId, comment } = data;

        // Broadcast to all users in the project
        socket.to(`project:${projectId}`).emit('comment:added', {
          taskId,
          comment: {
            ...comment,
            user: {
              id: socket.user.id,
              name: `${socket.user.first_name} ${socket.user.last_name}`
            }
          },
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Comment broadcast error:', error);
      }
    });

    // Real-time notification
    socket.on('notification:send', async (data) => {
      try {
        const { userId, notification } = data;

        // Send notification to specific user
        io.to(`user:${userId}`).emit('notification:received', {
          ...notification,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Notification broadcast error:', error);
      }
    });

    // Typing indicator
    socket.on('typing:start', (data) => {
      const { taskId, projectId } = data;
      socket.to(`project:${projectId}`).emit('user:typing', {
        taskId,
        userId: socket.user.id,
        userName: `${socket.user.first_name} ${socket.user.last_name}`
      });
    });

    socket.on('typing:stop', (data) => {
      const { taskId, projectId } = data;
      socket.to(`project:${projectId}`).emit('user:stopped-typing', {
        taskId,
        userId: socket.user.id
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.user.email} (${socket.id})`);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return io;
};

// Helper function to emit notification to specific user
const emitNotificationToUser = (io, userId, notification) => {
  io.to(`user:${userId}`).emit('notification:received', {
    ...notification,
    timestamp: new Date()
  });
};

// Helper function to emit update to project room
const emitToProject = (io, projectId, event, data) => {
  io.to(`project:${projectId}`).emit(event, {
    ...data,
    timestamp: new Date()
  });
};

module.exports = {
  initializeWebSocket,
  emitNotificationToUser,
  emitToProject
};
