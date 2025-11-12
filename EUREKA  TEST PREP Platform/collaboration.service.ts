/**
 * EUREKA Test Prep - Real-time Collaboration Service
 * WebSocket-based live study sessions, group practice, and peer tutoring
 */

import { Injectable } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  WsResponse
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '@eureka/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface StudyRoom {
  id: string;
  name: string;
  type: RoomType;
  examType: string;
  topic?: string;
  maxParticipants: number;
  participants: Participant[];
  settings: RoomSettings;
  state: RoomState;
  activity?: Activity;
  chat: Message[];
  createdAt: Date;
  createdBy: string;
}

enum RoomType {
  STUDY_GROUP = 'study_group',
  PRACTICE_SESSION = 'practice_session',
  PEER_TUTORING = 'peer_tutoring',
  MOCK_EXAM = 'mock_exam',
  COMPETITION = 'competition'
}

interface Participant {
  userId: string;
  username: string;
  avatar?: string;
  role: 'host' | 'moderator' | 'participant';
  status: 'active' | 'away' | 'disconnected';
  score?: number;
  progress?: number;
  videoEnabled: boolean;
  audioEnabled: boolean;
  screenSharing: boolean;
  joinedAt: Date;
  lastActivity: Date;
  stats?: ParticipantStats;
}

interface ParticipantStats {
  questionsAnswered: number;
  correctAnswers: number;
  averageTime: number;
  contributions: number;
  helpfulness: number;
}

interface RoomSettings {
  isPublic: boolean;
  password?: string;
  videoRequired: boolean;
  audioRequired: boolean;
  recordSession: boolean;
  allowChat: boolean;
  allowScreenShare: boolean;
  autoAssignQuestions: boolean;
  competitionMode: boolean;
  timeLimit?: number;
  questionPool?: string[];
}

interface RoomState {
  status: 'waiting' | 'active' | 'paused' | 'completed';
  startTime?: Date;
  endTime?: Date;
  currentQuestion?: Question;
  questionIndex: number;
  timeRemaining?: number;
  leaderboard?: LeaderboardEntry[];
}

interface Activity {
  type: ActivityType;
  data: any;
  startTime: Date;
  duration?: number;
}

enum ActivityType {
  QUESTION_PRACTICE = 'question_practice',
  DISCUSSION = 'discussion',
  WHITEBOARD = 'whiteboard',
  SCREEN_SHARE = 'screen_share',
  BREAKOUT = 'breakout',
  POLL = 'poll'
}

interface Question {
  id: string;
  stem: string;
  choices: string[];
  correctIndex: number;
  explanation?: string;
  timeLimit?: number;
  points?: number;
}

interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  type: 'text' | 'system' | 'question' | 'answer';
  timestamp: Date;
  reactions?: Reaction[];
  replyTo?: string;
}

interface Reaction {
  userId: string;
  emoji: string;
}

interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  correctAnswers: number;
  averageTime: number;
  rank: number;
  change: number; // Position change
}

interface CollaborationEvent {
  type: string;
  roomId: string;
  userId: string;
  data: any;
  timestamp: Date;
}

@WebSocketGateway({
  namespace: 'collab',
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
})
@Injectable()
export class CollaborationService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private rooms = new Map<string, StudyRoom>();
  private userSockets = new Map<string, Set<string>>(); // userId -> socketIds
  private socketUsers = new Map<string, string>(); // socketId -> userId
  
  constructor(
    private redis: RedisService,
    private eventEmitter: EventEmitter2
  ) {
    this.initializeRooms();
  }

  private async initializeRooms() {
    // Load active rooms from Redis
    const activeRooms = await this.redis.get('active_rooms');
    if (activeRooms) {
      const rooms = JSON.parse(activeRooms);
      rooms.forEach((room: StudyRoom) => {
        this.rooms.set(room.id, room);
      });
    }
  }

  /**
   * Handle new WebSocket connection
   */
  async handleConnection(socket: Socket) {
    const userId = socket.handshake.auth.userId;
    
    if (!userId) {
      socket.disconnect();
      return;
    }

    // Track user socket
    this.socketUsers.set(socket.id, userId);
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(socket.id);

    // Send available rooms
    socket.emit('rooms:available', this.getPublicRooms());

    // Rejoin previous rooms
    const userRooms = await this.getUserRooms(userId);
    for (const roomId of userRooms) {
      socket.join(roomId);
      this.rejoinRoom(socket, roomId, userId);
    }

    this.logEvent('user:connected', userId, { socketId: socket.id });
  }

  /**
   * Handle WebSocket disconnection
   */
  async handleDisconnect(socket: Socket) {
    const userId = this.socketUsers.get(socket.id);
    
    if (userId) {
      // Remove socket tracking
      this.userSockets.get(userId)?.delete(socket.id);
      if (this.userSockets.get(userId)?.size === 0) {
        this.userSockets.delete(userId);
      }
      this.socketUsers.delete(socket.id);

      // Update participant status in rooms
      for (const [roomId, room] of this.rooms.entries()) {
        const participant = room.participants.find(p => p.userId === userId);
        if (participant) {
          participant.status = 'disconnected';
          this.broadcastToRoom(roomId, 'participant:status', {
            userId,
            status: 'disconnected'
          });
        }
      }

      this.logEvent('user:disconnected', userId, { socketId: socket.id });
    }
  }

  /**
   * Create a new study room
   */
  @SubscribeMessage('room:create')
  async createRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: {
      name: string;
      type: RoomType;
      examType: string;
      topic?: string;
      settings?: Partial<RoomSettings>;
    }
  ): Promise<WsResponse> {
    const userId = this.socketUsers.get(socket.id)!;
    const roomId = this.generateRoomId();

    const room: StudyRoom = {
      id: roomId,
      name: data.name,
      type: data.type,
      examType: data.examType,
      topic: data.topic,
      maxParticipants: data.settings?.competitionMode ? 100 : 10,
      participants: [{
        userId,
        username: await this.getUsername(userId),
        role: 'host',
        status: 'active',
        videoEnabled: false,
        audioEnabled: false,
        screenSharing: false,
        joinedAt: new Date(),
        lastActivity: new Date()
      }],
      settings: {
        isPublic: true,
        videoRequired: false,
        audioRequired: false,
        recordSession: false,
        allowChat: true,
        allowScreenShare: true,
        autoAssignQuestions: true,
        competitionMode: false,
        ...data.settings
      },
      state: {
        status: 'waiting',
        questionIndex: 0
      },
      chat: [],
      createdAt: new Date(),
      createdBy: userId
    };

    this.rooms.set(roomId, room);
    socket.join(roomId);

    // Persist to Redis
    await this.saveRooms();

    // Notify others about new room
    socket.broadcast.emit('room:created', {
      id: roomId,
      name: room.name,
      type: room.type,
      participantCount: 1
    });

    this.logEvent('room:created', roomId, { userId, type: data.type });

    return {
      event: 'room:created',
      data: room
    };
  }

  /**
   * Join an existing room
   */
  @SubscribeMessage('room:join')
  async joinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { roomId: string; password?: string }
  ): Promise<WsResponse> {
    const userId = this.socketUsers.get(socket.id)!;
    const room = this.rooms.get(data.roomId);

    if (!room) {
      return {
        event: 'error',
        data: { message: 'Room not found' }
      };
    }

    // Check password if required
    if (!room.settings.isPublic && room.settings.password !== data.password) {
      return {
        event: 'error',
        data: { message: 'Invalid password' }
      };
    }

    // Check capacity
    if (room.participants.length >= room.maxParticipants) {
      return {
        event: 'error',
        data: { message: 'Room is full' }
      };
    }

    // Check if already in room
    let participant = room.participants.find(p => p.userId === userId);
    
    if (!participant) {
      // Add new participant
      participant = {
        userId,
        username: await this.getUsername(userId),
        role: 'participant',
        status: 'active',
        videoEnabled: false,
        audioEnabled: false,
        screenSharing: false,
        joinedAt: new Date(),
        lastActivity: new Date()
      };
      room.participants.push(participant);
    } else {
      // Update existing participant
      participant.status = 'active';
      participant.lastActivity = new Date();
    }

    socket.join(data.roomId);

    // Notify room members
    this.broadcastToRoom(data.roomId, 'participant:joined', participant);

    // Send current room state to joiner
    socket.emit('room:state', room);

    this.logEvent('room:joined', data.roomId, { userId });

    return {
      event: 'room:joined',
      data: room
    };
  }

  /**
   * Start a practice session
   */
  @SubscribeMessage('practice:start')
  async startPractice(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: {
      roomId: string;
      questionIds?: string[];
      timeLimit?: number;
    }
  ): Promise<WsResponse> {
    const userId = this.socketUsers.get(socket.id)!;
    const room = this.rooms.get(data.roomId);

    if (!room) {
      return { event: 'error', data: { message: 'Room not found' } };
    }

    // Check permissions
    const participant = room.participants.find(p => p.userId === userId);
    if (!participant || participant.role === 'participant') {
      return { event: 'error', data: { message: 'Insufficient permissions' } };
    }

    // Get questions
    const questions = await this.getQuestions(
      data.questionIds || room.settings.questionPool || [],
      room.examType,
      room.topic
    );

    if (questions.length === 0) {
      return { event: 'error', data: { message: 'No questions available' } };
    }

    // Update room state
    room.state.status = 'active';
    room.state.startTime = new Date();
    room.state.currentQuestion = questions[0];
    room.state.questionIndex = 0;
    room.state.timeRemaining = data.timeLimit || questions[0].timeLimit || 120;

    room.activity = {
      type: ActivityType.QUESTION_PRACTICE,
      data: { questions, timeLimit: data.timeLimit },
      startTime: new Date()
    };

    // Initialize leaderboard
    room.state.leaderboard = room.participants.map(p => ({
      userId: p.userId,
      username: p.username,
      score: 0,
      correctAnswers: 0,
      averageTime: 0,
      rank: 0,
      change: 0
    }));

    // Broadcast to room
    this.broadcastToRoom(data.roomId, 'practice:started', {
      question: this.sanitizeQuestion(questions[0]),
      timeLimit: room.state.timeRemaining,
      totalQuestions: questions.length
    });

    // Start timer
    this.startTimer(data.roomId);

    return {
      event: 'practice:started',
      data: { success: true }
    };
  }

  /**
   * Submit answer to current question
   */
  @SubscribeMessage('answer:submit')
  async submitAnswer(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: {
      roomId: string;
      answerIndex: number;
      timeSpent: number;
    }
  ): Promise<WsResponse> {
    const userId = this.socketUsers.get(socket.id)!;
    const room = this.rooms.get(data.roomId);

    if (!room || !room.state.currentQuestion) {
      return { event: 'error', data: { message: 'No active question' } };
    }

    const isCorrect = data.answerIndex === room.state.currentQuestion.correctIndex;
    const points = isCorrect ? (room.state.currentQuestion.points || 10) : 0;

    // Update participant stats
    const participant = room.participants.find(p => p.userId === userId);
    if (participant) {
      if (!participant.stats) {
        participant.stats = {
          questionsAnswered: 0,
          correctAnswers: 0,
          averageTime: 0,
          contributions: 0,
          helpfulness: 0
        };
      }
      
      participant.stats.questionsAnswered++;
      if (isCorrect) participant.stats.correctAnswers++;
      
      // Update average time
      const totalTime = participant.stats.averageTime * (participant.stats.questionsAnswered - 1);
      participant.stats.averageTime = (totalTime + data.timeSpent) / participant.stats.questionsAnswered;
    }

    // Update leaderboard
    const entry = room.state.leaderboard?.find(e => e.userId === userId);
    if (entry) {
      entry.score += points;
      if (isCorrect) entry.correctAnswers++;
      entry.averageTime = ((entry.averageTime * (entry.correctAnswers - 1)) + data.timeSpent) / entry.correctAnswers;
    }

    // Sort and update ranks
    this.updateLeaderboard(room);

    // Broadcast answer result
    this.broadcastToRoom(data.roomId, 'answer:submitted', {
      userId,
      username: participant?.username,
      isCorrect,
      points,
      timeSpent: data.timeSpent
    });

    // Check if all answered
    const answered = room.participants.filter(p => 
      p.stats && p.stats.questionsAnswered > room.state.questionIndex
    );

    if (answered.length === room.participants.filter(p => p.status === 'active').length) {
      // Move to next question
      this.nextQuestion(data.roomId);
    }

    return {
      event: 'answer:result',
      data: { isCorrect, points }
    };
  }

  /**
   * Send chat message
   */
  @SubscribeMessage('chat:send')
  async sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: {
      roomId: string;
      content: string;
      type?: 'text' | 'question' | 'answer';
      replyTo?: string;
    }
  ): Promise<WsResponse> {
    const userId = this.socketUsers.get(socket.id)!;
    const room = this.rooms.get(data.roomId);

    if (!room || !room.settings.allowChat) {
      return { event: 'error', data: { message: 'Chat not allowed' } };
    }

    const participant = room.participants.find(p => p.userId === userId);
    if (!participant) {
      return { event: 'error', data: { message: 'Not in room' } };
    }

    const message: Message = {
      id: this.generateMessageId(),
      userId,
      username: participant.username,
      content: data.content,
      type: data.type || 'text',
      timestamp: new Date(),
      reactions: [],
      replyTo: data.replyTo
    };

    room.chat.push(message);

    // Limit chat history
    if (room.chat.length > 100) {
      room.chat = room.chat.slice(-100);
    }

    // Broadcast message
    this.broadcastToRoom(data.roomId, 'chat:message', message);

    // Update participant contribution
    if (participant.stats) {
      participant.stats.contributions++;
    }

    return {
      event: 'chat:sent',
      data: { messageId: message.id }
    };
  }

  /**
   * Start screen sharing
   */
  @SubscribeMessage('screen:share')
  async startScreenShare(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { roomId: string; streamId: string }
  ): Promise<WsResponse> {
    const userId = this.socketUsers.get(socket.id)!;
    const room = this.rooms.get(data.roomId);

    if (!room || !room.settings.allowScreenShare) {
      return { event: 'error', data: { message: 'Screen sharing not allowed' } };
    }

    const participant = room.participants.find(p => p.userId === userId);
    if (!participant) {
      return { event: 'error', data: { message: 'Not in room' } };
    }

    // Check if someone else is sharing
    const currentSharer = room.participants.find(p => p.screenSharing);
    if (currentSharer && currentSharer.userId !== userId) {
      return { event: 'error', data: { message: 'Someone else is already sharing' } };
    }

    participant.screenSharing = true;

    // Update activity
    room.activity = {
      type: ActivityType.SCREEN_SHARE,
      data: { userId, streamId: data.streamId },
      startTime: new Date()
    };

    // Broadcast to room
    this.broadcastToRoom(data.roomId, 'screen:started', {
      userId,
      username: participant.username,
      streamId: data.streamId
    });

    return {
      event: 'screen:sharing',
      data: { success: true }
    };
  }

  /**
   * Create breakout rooms
   */
  @SubscribeMessage('breakout:create')
  async createBreakoutRooms(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: {
      roomId: string;
      groups: string[][];
      duration: number;
    }
  ): Promise<WsResponse> {
    const userId = this.socketUsers.get(socket.id)!;
    const room = this.rooms.get(data.roomId);

    if (!room) {
      return { event: 'error', data: { message: 'Room not found' } };
    }

    // Check permissions
    const participant = room.participants.find(p => p.userId === userId);
    if (!participant || participant.role === 'participant') {
      return { event: 'error', data: { message: 'Insufficient permissions' } };
    }

    const breakoutRooms: StudyRoom[] = [];

    for (let i = 0; i < data.groups.length; i++) {
      const group = data.groups[i];
      const breakoutId = `${data.roomId}-breakout-${i + 1}`;

      const breakoutRoom: StudyRoom = {
        id: breakoutId,
        name: `${room.name} - Breakout ${i + 1}`,
        type: RoomType.STUDY_GROUP,
        examType: room.examType,
        topic: room.topic,
        maxParticipants: group.length,
        participants: [],
        settings: {
          ...room.settings,
          isPublic: false
        },
        state: {
          status: 'active',
          questionIndex: 0
        },
        chat: [],
        createdAt: new Date(),
        createdBy: userId
      };

      // Add participants to breakout room
      for (const participantId of group) {
        const mainParticipant = room.participants.find(p => p.userId === participantId);
        if (mainParticipant) {
          breakoutRoom.participants.push({
            ...mainParticipant,
            role: 'participant'
          });

          // Join socket to breakout room
          const userSockets = this.userSockets.get(participantId);
          if (userSockets) {
            userSockets.forEach(socketId => {
              const userSocket = this.server.sockets.sockets.get(socketId);
              userSocket?.join(breakoutId);
            });
          }
        }
      }

      this.rooms.set(breakoutId, breakoutRoom);
      breakoutRooms.push(breakoutRoom);
    }

    // Update main room activity
    room.activity = {
      type: ActivityType.BREAKOUT,
      data: { 
        breakoutRooms: breakoutRooms.map(r => r.id),
        duration: data.duration 
      },
      startTime: new Date(),
      duration: data.duration
    };

    // Notify participants
    this.broadcastToRoom(data.roomId, 'breakout:started', {
      breakoutRooms: breakoutRooms.map(r => ({
        id: r.id,
        participants: r.participants.map(p => p.username)
      })),
      duration: data.duration
    });

    // Set timer to end breakout
    setTimeout(() => {
      this.endBreakoutRooms(data.roomId);
    }, data.duration * 1000);

    return {
      event: 'breakout:created',
      data: { breakoutRooms: breakoutRooms.map(r => r.id) }
    };
  }

  /**
   * Create a poll
   */
  @SubscribeMessage('poll:create')
  async createPoll(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: {
      roomId: string;
      question: string;
      options: string[];
      duration?: number;
      anonymous?: boolean;
    }
  ): Promise<WsResponse> {
    const userId = this.socketUsers.get(socket.id)!;
    const room = this.rooms.get(data.roomId);

    if (!room) {
      return { event: 'error', data: { message: 'Room not found' } };
    }

    const poll = {
      id: this.generatePollId(),
      question: data.question,
      options: data.options.map((opt, idx) => ({
        id: idx,
        text: opt,
        votes: []
      })),
      anonymous: data.anonymous || false,
      duration: data.duration,
      createdBy: userId,
      createdAt: new Date(),
      status: 'active'
    };

    room.activity = {
      type: ActivityType.POLL,
      data: poll,
      startTime: new Date(),
      duration: data.duration
    };

    // Broadcast poll
    this.broadcastToRoom(data.roomId, 'poll:created', {
      ...poll,
      options: poll.options.map(o => ({ id: o.id, text: o.text }))
    });

    // Auto-close poll if duration set
    if (data.duration) {
      setTimeout(() => {
        this.closePoll(data.roomId, poll.id);
      }, data.duration * 1000);
    }

    return {
      event: 'poll:created',
      data: { pollId: poll.id }
    };
  }

  // Private helper methods

  private nextQuestion(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room || !room.activity) return;

    const questions = room.activity.data.questions;
    room.state.questionIndex++;

    if (room.state.questionIndex >= questions.length) {
      // Practice completed
      this.endPractice(roomId);
    } else {
      // Load next question
      room.state.currentQuestion = questions[room.state.questionIndex];
      room.state.timeRemaining = room.state.currentQuestion.timeLimit || 120;

      this.broadcastToRoom(roomId, 'question:next', {
        question: this.sanitizeQuestion(room.state.currentQuestion),
        index: room.state.questionIndex,
        total: questions.length,
        timeLimit: room.state.timeRemaining,
        leaderboard: room.state.leaderboard
      });

      this.startTimer(roomId);
    }
  }

  private endPractice(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.state.status = 'completed';
    room.state.endTime = new Date();

    // Calculate final stats
    const finalStats = {
      duration: (room.state.endTime.getTime() - room.state.startTime!.getTime()) / 1000,
      questionsCompleted: room.state.questionIndex,
      leaderboard: room.state.leaderboard,
      mvp: room.state.leaderboard?.[0]
    };

    this.broadcastToRoom(roomId, 'practice:ended', finalStats);

    // Log completion
    this.logEvent('practice:completed', roomId, finalStats);
  }

  private startTimer(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room || !room.state.timeRemaining) return;

    const interval = setInterval(() => {
      if (!room.state.timeRemaining || room.state.timeRemaining <= 0) {
        clearInterval(interval);
        this.nextQuestion(roomId);
        return;
      }

      room.state.timeRemaining--;
      
      // Broadcast time updates every 10 seconds
      if (room.state.timeRemaining % 10 === 0) {
        this.broadcastToRoom(roomId, 'timer:update', {
          timeRemaining: room.state.timeRemaining
        });
      }
    }, 1000);
  }

  private updateLeaderboard(room: StudyRoom) {
    if (!room.state.leaderboard) return;

    // Sort by score
    room.state.leaderboard.sort((a, b) => {
      if (b.score === a.score) {
        return a.averageTime - b.averageTime; // Faster is better
      }
      return b.score - a.score;
    });

    // Update ranks
    room.state.leaderboard.forEach((entry, index) => {
      const oldRank = entry.rank;
      entry.rank = index + 1;
      entry.change = oldRank ? oldRank - entry.rank : 0;
    });
  }

  private endBreakoutRooms(mainRoomId: string) {
    const room = this.rooms.get(mainRoomId);
    if (!room || !room.activity || room.activity.type !== ActivityType.BREAKOUT) return;

    const breakoutIds = room.activity.data.breakoutRooms;
    
    // Move participants back to main room
    breakoutIds.forEach((breakoutId: string) => {
      const breakout = this.rooms.get(breakoutId);
      if (breakout) {
        breakout.participants.forEach(p => {
          const userSockets = this.userSockets.get(p.userId);
          if (userSockets) {
            userSockets.forEach(socketId => {
              const socket = this.server.sockets.sockets.get(socketId);
              socket?.leave(breakoutId);
            });
          }
        });
        this.rooms.delete(breakoutId);
      }
    });

    room.activity = undefined;
    this.broadcastToRoom(mainRoomId, 'breakout:ended', {});
  }

  private closePoll(roomId: string, pollId: string) {
    const room = this.rooms.get(roomId);
    if (!room || !room.activity || room.activity.type !== ActivityType.POLL) return;

    const poll = room.activity.data;
    poll.status = 'closed';

    // Calculate results
    const results = poll.options.map((opt: any) => ({
      id: opt.id,
      text: opt.text,
      votes: poll.anonymous ? opt.votes.length : opt.votes,
      percentage: (opt.votes.length / room.participants.length) * 100
    }));

    this.broadcastToRoom(roomId, 'poll:results', {
      pollId,
      results
    });

    room.activity = undefined;
  }

  private sanitizeQuestion(question: Question): any {
    // Remove correct answer from client data
    return {
      id: question.id,
      stem: question.stem,
      choices: question.choices,
      timeLimit: question.timeLimit
    };
  }

  private broadcastToRoom(roomId: string, event: string, data: any) {
    this.server.to(roomId).emit(event, data);
  }

  private rejoinRoom(socket: Socket, roomId: string, userId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const participant = room.participants.find(p => p.userId === userId);
    if (participant) {
      participant.status = 'active';
      this.broadcastToRoom(roomId, 'participant:rejoined', participant);
    }
  }

  private getPublicRooms(): any[] {
    const publicRooms: any[] = [];
    
    this.rooms.forEach(room => {
      if (room.settings.isPublic && room.state.status !== 'completed') {
        publicRooms.push({
          id: room.id,
          name: room.name,
          type: room.type,
          examType: room.examType,
          topic: room.topic,
          participantCount: room.participants.length,
          maxParticipants: room.maxParticipants,
          status: room.state.status
        });
      }
    });

    return publicRooms;
  }

  private async getUserRooms(userId: string): Promise<string[]> {
    const userRooms: string[] = [];
    
    this.rooms.forEach((room, roomId) => {
      if (room.participants.some(p => p.userId === userId)) {
        userRooms.push(roomId);
      }
    });

    return userRooms;
  }

  private async saveRooms() {
    const roomsData = Array.from(this.rooms.values());
    await this.redis.set('active_rooms', JSON.stringify(roomsData));
  }

  private async getUsername(userId: string): Promise<string> {
    // Fetch from database
    return `User${userId.slice(-4)}`;
  }

  private async getQuestions(
    questionIds: string[],
    examType: string,
    topic?: string
  ): Promise<Question[]> {
    // Fetch questions from database
    return [];
  }

  private logEvent(type: string, roomId: string, data?: any) {
    this.eventEmitter.emit('collaboration.event', {
      type,
      roomId,
      data,
      timestamp: new Date()
    });
  }

  private generateRoomId(): string {
    return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generatePollId(): string {
    return `poll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
