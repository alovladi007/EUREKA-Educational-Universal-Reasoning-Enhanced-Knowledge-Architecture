import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  // Project room management
  joinProject(projectId) {
    if (this.socket) {
      this.socket.emit('join:project', projectId);
    }
  }

  leaveProject(projectId) {
    if (this.socket) {
      this.socket.emit('leave:project', projectId);
    }
  }

  // Task updates
  emitTaskUpdate(data) {
    if (this.socket) {
      this.socket.emit('task:update', data);
    }
  }

  onTaskUpdated(callback) {
    if (this.socket) {
      this.socket.on('task:updated', callback);
    }
  }

  offTaskUpdated(callback) {
    if (this.socket) {
      this.socket.off('task:updated', callback);
    }
  }

  // Comment events
  emitNewComment(data) {
    if (this.socket) {
      this.socket.emit('comment:new', data);
    }
  }

  onCommentAdded(callback) {
    if (this.socket) {
      this.socket.on('comment:added', callback);
    }
  }

  offCommentAdded(callback) {
    if (this.socket) {
      this.socket.off('comment:added', callback);
    }
  }

  // Notification events
  sendNotification(data) {
    if (this.socket) {
      this.socket.emit('notification:send', data);
    }
  }

  onNotificationReceived(callback) {
    if (this.socket) {
      this.socket.on('notification:received', callback);
    }
  }

  offNotificationReceived(callback) {
    if (this.socket) {
      this.socket.off('notification:received', callback);
    }
  }

  // Typing indicators
  startTyping(data) {
    if (this.socket) {
      this.socket.emit('typing:start', data);
    }
  }

  stopTyping(data) {
    if (this.socket) {
      this.socket.emit('typing:stop', data);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user:typing', callback);
    }
  }

  offUserTyping(callback) {
    if (this.socket) {
      this.socket.off('user:typing', callback);
    }
  }

  onUserStoppedTyping(callback) {
    if (this.socket) {
      this.socket.on('user:stopped-typing', callback);
    }
  }

  offUserStoppedTyping(callback) {
    if (this.socket) {
      this.socket.off('user:stopped-typing', callback);
    }
  }

  // User join/leave events
  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on('user:joined', callback);
    }
  }

  offUserJoined(callback) {
    if (this.socket) {
      this.socket.off('user:joined', callback);
    }
  }

  onUserLeft(callback) {
    if (this.socket) {
      this.socket.on('user:left', callback);
    }
  }

  offUserLeft(callback) {
    if (this.socket) {
      this.socket.off('user:left', callback);
    }
  }

  // Generic event listeners
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
