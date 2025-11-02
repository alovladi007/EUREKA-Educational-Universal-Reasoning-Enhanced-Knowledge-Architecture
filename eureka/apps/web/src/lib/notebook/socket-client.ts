import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_NOTEBOOK_URL || 'http://localhost:8120';

class NotebookSocketClient {
  private socket: Socket | null = null;
  private token: string | null = null;

  connect(token: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.token = token;
    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Notebook WebSocket connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Notebook WebSocket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.token = null;
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  // Project rooms
  joinProject(projectId: number) {
    this.socket?.emit('join:project', projectId);
  }

  leaveProject(projectId: number) {
    this.socket?.emit('leave:project', projectId);
  }

  // Task updates
  sendTaskUpdate(data: { taskId: number; projectId: number; update: any }) {
    this.socket?.emit('task:update', data);
  }

  onTaskUpdated(callback: (data: any) => void) {
    this.socket?.on('task:updated', callback);
  }

  // Comments
  sendComment(data: { taskId: number; projectId: number; comment: any }) {
    this.socket?.emit('comment:new', data);
  }

  onCommentAdded(callback: (data: any) => void) {
    this.socket?.on('comment:added', callback);
  }

  // Notifications
  onNotificationReceived(callback: (data: any) => void) {
    this.socket?.on('notification:received', callback);
  }

  // User presence
  onUserJoined(callback: (data: any) => void) {
    this.socket?.on('user:joined', callback);
  }

  onUserLeft(callback: (data: any) => void) {
    this.socket?.on('user:left', callback);
  }

  // Typing indicators
  startTyping(data: { taskId: number; projectId: number }) {
    this.socket?.emit('typing:start', data);
  }

  stopTyping(data: { taskId: number; projectId: number }) {
    this.socket?.emit('typing:stop', data);
  }

  onUserTyping(callback: (data: any) => void) {
    this.socket?.on('user:typing', callback);
  }

  onUserStoppedTyping(callback: (data: any) => void) {
    this.socket?.on('user:stopped-typing', callback);
  }

  // Clean up listeners
  removeAllListeners() {
    this.socket?.removeAllListeners();
  }
}

export const notebookSocket = new NotebookSocketClient();
