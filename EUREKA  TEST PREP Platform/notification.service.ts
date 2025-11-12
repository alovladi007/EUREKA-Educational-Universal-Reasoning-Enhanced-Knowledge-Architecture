/**
 * EUREKA Test Prep - Multi-Channel Notification Service
 * Email, SMS, Push, In-app notifications with templates and scheduling
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@eureka/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Queue, Worker } from 'bullmq';
import * as SendGrid from '@sendgrid/mail';
import * as Twilio from 'twilio';
import * as admin from 'firebase-admin';
import * as Handlebars from 'handlebars';
import { Redis } from 'ioredis';

interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  priority: Priority;
  subject?: string;
  content: string;
  data?: Record<string, any>;
  status: NotificationStatus;
  scheduledFor?: Date;
  sentAt?: Date;
  readAt?: Date;
  errorMessage?: string;
  retryCount: number;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

enum NotificationType {
  // Study Related
  STUDY_REMINDER = 'study_reminder',
  PRACTICE_COMPLETE = 'practice_complete',
  GOAL_ACHIEVED = 'goal_achieved',
  STREAK_MILESTONE = 'streak_milestone',
  WEAK_AREA_ALERT = 'weak_area_alert',
  
  // Exam Related
  EXAM_SCHEDULED = 'exam_scheduled',
  EXAM_REMINDER = 'exam_reminder',
  EXAM_RESULTS = 'exam_results',
  SCORE_IMPROVED = 'score_improved',
  
  // Social
  GROUP_INVITE = 'group_invite',
  GROUP_MESSAGE = 'group_message',
  FRIEND_REQUEST = 'friend_request',
  ACHIEVEMENT_SHARED = 'achievement_shared',
  
  // Account
  WELCOME = 'welcome',
  PASSWORD_RESET = 'password_reset',
  EMAIL_VERIFICATION = 'email_verification',
  SUBSCRIPTION_EXPIRING = 'subscription_expiring',
  PAYMENT_FAILED = 'payment_failed',
  
  // System
  MAINTENANCE = 'maintenance',
  NEW_FEATURE = 'new_feature',
  SECURITY_ALERT = 'security_alert'
}

enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
  WEBHOOK = 'webhook'
}

enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

enum NotificationStatus {
  PENDING = 'pending',
  QUEUED = 'queued',
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  BOUNCED = 'bounced'
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  channel: NotificationChannel;
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

interface UserPreferences {
  userId: string;
  channels: {
    email: ChannelPreference;
    sms: ChannelPreference;
    push: ChannelPreference;
    inApp: ChannelPreference;
  };
  quiet: {
    enabled: boolean;
    startTime: string; // HH:mm
    endTime: string;   // HH:mm
    timezone: string;
  };
  frequency: {
    studyReminders: 'realtime' | 'daily' | 'weekly' | 'never';
    progressUpdates: 'realtime' | 'daily' | 'weekly' | 'never';
    social: 'realtime' | 'daily' | 'never';
    marketing: 'weekly' | 'monthly' | 'never';
  };
  unsubscribeToken?: string;
}

interface ChannelPreference {
  enabled: boolean;
  address?: string; // email address, phone number, device token
  verified: boolean;
  blockedTypes?: NotificationType[];
}

interface NotificationBatch {
  id: string;
  name: string;
  type: NotificationType;
  channel: NotificationChannel;
  recipients: string[]; // user IDs
  template: string;
  data: Record<string, any>;
  scheduledFor?: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  stats?: {
    total: number;
    sent: number;
    delivered: number;
    failed: number;
    opened?: number;
    clicked?: number;
  };
  createdAt: Date;
}

interface NotificationMetrics {
  channel: NotificationChannel;
  type: NotificationType;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  failed: number;
  bounced: number;
  unsubscribed: number;
  period: 'hour' | 'day' | 'week' | 'month';
  timestamp: Date;
}

@Injectable()
export class NotificationService {
  private emailQueue: Queue;
  private smsQueue: Queue;
  private pushQueue: Queue;
  private sendgrid: typeof SendGrid;
  private twilio: Twilio.Twilio;
  private firebase: admin.app.App;
  private templates: Map<string, Handlebars.TemplateDelegate>;
  private redis: Redis;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2
  ) {
    this.initializeServices();
    this.initializeQueues();
    this.loadTemplates();
  }

  private initializeServices() {
    // SendGrid for email
    this.sendgrid = SendGrid;
    this.sendgrid.setApiKey(this.config.get('SENDGRID_API_KEY')!);

    // Twilio for SMS
    this.twilio = Twilio(
      this.config.get('TWILIO_ACCOUNT_SID'),
      this.config.get('TWILIO_AUTH_TOKEN')
    );

    // Firebase for push notifications
    this.firebase = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: this.config.get('FIREBASE_PROJECT_ID'),
        clientEmail: this.config.get('FIREBASE_CLIENT_EMAIL'),
        privateKey: this.config.get('FIREBASE_PRIVATE_KEY')
      })
    });

    // Redis for rate limiting
    this.redis = new Redis({
      host: this.config.get('REDIS_HOST'),
      port: this.config.get('REDIS_PORT')
    });
  }

  private initializeQueues() {
    const connection = {
      host: this.config.get('REDIS_HOST'),
      port: this.config.get('REDIS_PORT')
    };

    // Email queue
    this.emailQueue = new Queue('notifications:email', { connection });
    new Worker('notifications:email', async job => {
      await this.sendEmail(job.data);
    }, { connection });

    // SMS queue
    this.smsQueue = new Queue('notifications:sms', { connection });
    new Worker('notifications:sms', async job => {
      await this.sendSMS(job.data);
    }, { connection });

    // Push queue
    this.pushQueue = new Queue('notifications:push', { connection });
    new Worker('notifications:push', async job => {
      await this.sendPush(job.data);
    }, { connection });
  }

  /**
   * Send notification to user
   */
  async send(params: {
    userId: string;
    type: NotificationType;
    channels?: NotificationChannel[];
    subject?: string;
    content?: string;
    templateId?: string;
    data?: Record<string, any>;
    priority?: Priority;
    scheduledFor?: Date;
  }): Promise<Notification[]> {
    // Get user preferences
    const preferences = await this.getUserPreferences(params.userId);
    
    // Determine channels
    const channels = params.channels || this.getDefaultChannels(params.type);
    const notifications: Notification[] = [];

    for (const channel of channels) {
      // Check if user has this channel enabled
      if (!this.isChannelEnabled(preferences, channel, params.type)) {
        continue;
      }

      // Check quiet hours
      if (this.isQuietHours(preferences)) {
        params.scheduledFor = this.getNextAvailableTime(preferences);
      }

      // Check rate limits
      if (!await this.checkRateLimit(params.userId, channel, params.type)) {
        continue;
      }

      // Create notification
      const notification = await this.createNotification({
        ...params,
        channel
      });

      // Queue for sending
      if (params.scheduledFor && params.scheduledFor > new Date()) {
        await this.scheduleNotification(notification);
      } else {
        await this.queueNotification(notification);
      }

      notifications.push(notification);
    }

    return notifications;
  }

  /**
   * Send batch notification
   */
  async sendBatch(params: {
    userIds: string[];
    type: NotificationType;
    channel: NotificationChannel;
    templateId: string;
    data?: Record<string, any>;
    scheduledFor?: Date;
  }): Promise<NotificationBatch> {
    // Create batch
    const batch = await this.prisma.notificationBatch.create({
      data: {
        name: `Batch ${params.type} ${new Date().toISOString()}`,
        type: params.type,
        channel: params.channel,
        recipients: params.userIds,
        template: params.templateId,
        data: params.data || {},
        scheduledFor: params.scheduledFor,
        status: 'pending'
      }
    });

    // Process batch
    this.processBatch(batch);

    return this.mapPrismaToBatch(batch);
  }

  /**
   * Process notification batch
   */
  private async processBatch(batch: any): Promise<void> {
    const chunkSize = 100;
    const stats = {
      total: batch.recipients.length,
      sent: 0,
      delivered: 0,
      failed: 0
    };

    for (let i = 0; i < batch.recipients.length; i += chunkSize) {
      const chunk = batch.recipients.slice(i, i + chunkSize);
      
      await Promise.all(chunk.map(async (userId: string) => {
        try {
          await this.send({
            userId,
            type: batch.type,
            channels: [batch.channel],
            templateId: batch.template,
            data: batch.data,
            scheduledFor: batch.scheduledFor
          });
          stats.sent++;
        } catch (error) {
          stats.failed++;
        }
      }));

      // Update progress
      await this.prisma.notificationBatch.update({
        where: { id: batch.id },
        data: { stats }
      });
    }

    // Mark as completed
    await this.prisma.notificationBatch.update({
      where: { id: batch.id },
      data: {
        status: 'completed',
        stats
      }
    });
  }

  /**
   * Send email notification
   */
  private async sendEmail(notification: Notification): Promise<void> {
    try {
      const user = await this.getUser(notification.userId);
      const template = await this.getTemplate(notification.type, 'email');
      
      // Compile template
      const compiledSubject = this.compileTemplate(
        template.subject || notification.subject || '',
        notification.data
      );
      
      const compiledContent = this.compileTemplate(
        template.content || notification.content,
        {
          ...notification.data,
          user,
          unsubscribeUrl: this.getUnsubscribeUrl(user.id)
        }
      );

      // Send via SendGrid
      const msg = {
        to: user.email,
        from: {
          email: this.config.get('EMAIL_FROM')!,
          name: 'EUREKA Test Prep'
        },
        subject: compiledSubject,
        html: compiledContent,
        trackingSettings: {
          clickTracking: { enable: true },
          openTracking: { enable: true }
        },
        customArgs: {
          notificationId: notification.id,
          userId: user.id
        }
      };

      await this.sendgrid.send(msg);

      // Update status
      await this.updateNotificationStatus(notification.id, 'sent');
      
      // Track metrics
      await this.trackMetric(notification);
      
    } catch (error: any) {
      await this.handleSendError(notification, error);
    }
  }

  /**
   * Send SMS notification
   */
  private async sendSMS(notification: Notification): Promise<void> {
    try {
      const user = await this.getUser(notification.userId);
      const preferences = await this.getUserPreferences(notification.userId);
      
      if (!preferences.channels.sms.address) {
        throw new Error('No phone number configured');
      }

      const template = await this.getTemplate(notification.type, 'sms');
      const compiledContent = this.compileTemplate(
        template.content || notification.content,
        notification.data
      );

      // Send via Twilio
      const message = await this.twilio.messages.create({
        body: compiledContent,
        to: preferences.channels.sms.address,
        from: this.config.get('TWILIO_PHONE_NUMBER'),
        statusCallback: `${this.config.get('API_URL')}/webhooks/twilio/status`
      });

      // Update status
      await this.updateNotificationStatus(notification.id, 'sent', {
        twilioSid: message.sid
      });

      // Track metrics
      await this.trackMetric(notification);

    } catch (error: any) {
      await this.handleSendError(notification, error);
    }
  }

  /**
   * Send push notification
   */
  private async sendPush(notification: Notification): Promise<void> {
    try {
      const user = await this.getUser(notification.userId);
      const preferences = await this.getUserPreferences(notification.userId);
      
      if (!preferences.channels.push.address) {
        throw new Error('No device token configured');
      }

      const template = await this.getTemplate(notification.type, 'push');
      
      // Prepare message
      const message: admin.messaging.Message = {
        token: preferences.channels.push.address,
        notification: {
          title: notification.subject || 'EUREKA Test Prep',
          body: this.compileTemplate(
            template.content || notification.content,
            notification.data
          )
        },
        data: {
          notificationId: notification.id,
          type: notification.type,
          ...notification.data
        },
        android: {
          priority: this.mapPriorityToAndroid(notification.priority),
          notification: {
            icon: 'ic_notification',
            color: '#6366F1'
          }
        },
        apns: {
          headers: {
            'apns-priority': this.mapPriorityToAPNS(notification.priority)
          },
          payload: {
            aps: {
              badge: await this.getUnreadCount(notification.userId),
              sound: 'default',
              category: notification.type
            }
          }
        }
      };

      // Send via Firebase
      const response = await this.firebase.messaging().send(message);

      // Update status
      await this.updateNotificationStatus(notification.id, 'sent', {
        firebaseMessageId: response
      });

      // Track metrics
      await this.trackMetric(notification);

    } catch (error: any) {
      await this.handleSendError(notification, error);
    }
  }

  /**
   * Event handlers for automated notifications
   */

  @OnEvent('user.registered')
  async handleUserRegistered(payload: { userId: string; email: string }) {
    await this.send({
      userId: payload.userId,
      type: NotificationType.WELCOME,
      channels: [NotificationChannel.EMAIL],
      priority: Priority.HIGH,
      data: { email: payload.email }
    });
  }

  @OnEvent('practice.completed')
  async handlePracticeCompleted(payload: {
    userId: string;
    score: number;
    improvement: number;
    topic: string;
  }) {
    await this.send({
      userId: payload.userId,
      type: NotificationType.PRACTICE_COMPLETE,
      channels: [NotificationChannel.PUSH, NotificationChannel.IN_APP],
      data: payload
    });
  }

  @OnEvent('streak.milestone')
  async handleStreakMilestone(payload: {
    userId: string;
    days: number;
    achievement: string;
  }) {
    await this.send({
      userId: payload.userId,
      type: NotificationType.STREAK_MILESTONE,
      channels: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
      priority: Priority.MEDIUM,
      data: payload
    });
  }

  @OnEvent('subscription.expiring')
  async handleSubscriptionExpiring(payload: {
    userId: string;
    daysLeft: number;
    planName: string;
  }) {
    await this.send({
      userId: payload.userId,
      type: NotificationType.SUBSCRIPTION_EXPIRING,
      channels: [NotificationChannel.EMAIL],
      priority: Priority.HIGH,
      data: payload
    });
  }

  /**
   * Schedule study reminders
   */
  async scheduleStudyReminders(): Promise<void> {
    const users = await this.prisma.user.findMany({
      where: {
        isActive: true,
        studyRemindersEnabled: true
      },
      include: {
        studySchedule: true
      }
    });

    for (const user of users) {
      if (!user.studySchedule) continue;

      for (const schedule of user.studySchedule) {
        const reminderTime = new Date(schedule.time);
        reminderTime.setMinutes(reminderTime.getMinutes() - 15); // 15 min before

        await this.send({
          userId: user.id,
          type: NotificationType.STUDY_REMINDER,
          channels: [NotificationChannel.PUSH],
          scheduledFor: reminderTime,
          data: {
            topic: schedule.topic,
            duration: schedule.duration,
            time: schedule.time
          }
        });
      }
    }
  }

  /**
   * Get notification analytics
   */
  async getAnalytics(params: {
    startDate: Date;
    endDate: Date;
    channel?: NotificationChannel;
    type?: NotificationType;
  }): Promise<{
    summary: any;
    byChannel: any;
    byType: any;
    trends: any;
  }> {
    const metrics = await this.prisma.notificationMetrics.findMany({
      where: {
        timestamp: {
          gte: params.startDate,
          lte: params.endDate
        },
        ...(params.channel && { channel: params.channel }),
        ...(params.type && { type: params.type })
      }
    });

    // Calculate summary
    const summary = {
      totalSent: metrics.reduce((sum, m) => sum + m.sent, 0),
      totalDelivered: metrics.reduce((sum, m) => sum + m.delivered, 0),
      totalOpened: metrics.reduce((sum, m) => sum + m.opened, 0),
      totalClicked: metrics.reduce((sum, m) => sum + m.clicked, 0),
      deliveryRate: 0,
      openRate: 0,
      clickRate: 0
    };

    summary.deliveryRate = summary.totalSent > 0 
      ? (summary.totalDelivered / summary.totalSent) * 100 : 0;
    summary.openRate = summary.totalDelivered > 0 
      ? (summary.totalOpened / summary.totalDelivered) * 100 : 0;
    summary.clickRate = summary.totalOpened > 0 
      ? (summary.totalClicked / summary.totalOpened) * 100 : 0;

    // Group by channel
    const byChannel = this.groupMetrics(metrics, 'channel');

    // Group by type
    const byType = this.groupMetrics(metrics, 'type');

    // Calculate trends
    const trends = this.calculateTrends(metrics);

    return {
      summary,
      byChannel,
      byType,
      trends
    };
  }

  // Private helper methods

  private async loadTemplates(): Promise<void> {
    this.templates = new Map();
    
    const templates = await this.prisma.notificationTemplate.findMany({
      where: { isActive: true }
    });

    for (const template of templates) {
      const key = `${template.type}_${template.channel}`;
      this.templates.set(key, Handlebars.compile(template.content));
      
      if (template.subject) {
        this.templates.set(`${key}_subject`, Handlebars.compile(template.subject));
      }
    }
  }

  private compileTemplate(template: string, data?: Record<string, any>): string {
    const compiled = Handlebars.compile(template);
    return compiled(data || {});
  }

  private async createNotification(params: any): Promise<Notification> {
    const notification = await this.prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        channel: params.channel,
        priority: params.priority || Priority.MEDIUM,
        subject: params.subject,
        content: params.content || '',
        data: params.data || {},
        status: NotificationStatus.PENDING,
        scheduledFor: params.scheduledFor,
        retryCount: 0,
        metadata: {}
      }
    });

    return this.mapPrismaToNotification(notification);
  }

  private async queueNotification(notification: Notification): Promise<void> {
    const queue = this.getQueueForChannel(notification.channel);
    
    await queue.add(`send_${notification.id}`, notification, {
      priority: this.mapPriorityToQueuePriority(notification.priority),
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      }
    });

    await this.updateNotificationStatus(notification.id, 'queued');
  }

  private async scheduleNotification(notification: Notification): Promise<void> {
    const queue = this.getQueueForChannel(notification.channel);
    const delay = notification.scheduledFor!.getTime() - Date.now();
    
    await queue.add(`send_${notification.id}`, notification, {
      delay,
      priority: this.mapPriorityToQueuePriority(notification.priority)
    });

    await this.updateNotificationStatus(notification.id, 'queued');
  }

  private getQueueForChannel(channel: NotificationChannel): Queue {
    switch (channel) {
      case NotificationChannel.EMAIL:
        return this.emailQueue;
      case NotificationChannel.SMS:
        return this.smsQueue;
      case NotificationChannel.PUSH:
        return this.pushQueue;
      default:
        throw new Error(`Unsupported channel: ${channel}`);
    }
  }

  private async getUserPreferences(userId: string): Promise<UserPreferences> {
    const prefs = await this.prisma.userPreferences.findUnique({
      where: { userId }
    });

    return prefs || this.getDefaultPreferences(userId);
  }

  private getDefaultPreferences(userId: string): UserPreferences {
    return {
      userId,
      channels: {
        email: { enabled: true, verified: false },
        sms: { enabled: false, verified: false },
        push: { enabled: true, verified: false },
        inApp: { enabled: true, verified: true }
      },
      quiet: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00',
        timezone: 'UTC'
      },
      frequency: {
        studyReminders: 'daily',
        progressUpdates: 'weekly',
        social: 'realtime',
        marketing: 'monthly'
      }
    };
  }

  private getDefaultChannels(type: NotificationType): NotificationChannel[] {
    const mapping: Record<NotificationType, NotificationChannel[]> = {
      [NotificationType.STUDY_REMINDER]: [NotificationChannel.PUSH],
      [NotificationType.PRACTICE_COMPLETE]: [NotificationChannel.IN_APP],
      [NotificationType.GOAL_ACHIEVED]: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
      [NotificationType.WELCOME]: [NotificationChannel.EMAIL],
      [NotificationType.PASSWORD_RESET]: [NotificationChannel.EMAIL],
      [NotificationType.PAYMENT_FAILED]: [NotificationChannel.EMAIL],
      // ... other mappings
    } as any;

    return mapping[type] || [NotificationChannel.IN_APP];
  }

  private isChannelEnabled(
    preferences: UserPreferences,
    channel: NotificationChannel,
    type: NotificationType
  ): boolean {
    const channelPrefs = preferences.channels[channel.toLowerCase()];
    
    if (!channelPrefs?.enabled) return false;
    if (!channelPrefs.verified && channel !== NotificationChannel.IN_APP) return false;
    if (channelPrefs.blockedTypes?.includes(type)) return false;
    
    return true;
  }

  private isQuietHours(preferences: UserPreferences): boolean {
    if (!preferences.quiet.enabled) return false;

    const now = new Date();
    const timezone = preferences.quiet.timezone;
    // Check if current time is within quiet hours
    // Implementation depends on timezone library
    
    return false;
  }

  private getNextAvailableTime(preferences: UserPreferences): Date {
    // Calculate next time outside quiet hours
    return new Date();
  }

  private async checkRateLimit(
    userId: string,
    channel: NotificationChannel,
    type: NotificationType
  ): Promise<boolean> {
    const key = `ratelimit:${userId}:${channel}:${type}`;
    const limit = this.getRateLimit(channel, type);
    
    const count = await this.redis.incr(key);
    
    if (count === 1) {
      await this.redis.expire(key, 3600); // 1 hour window
    }
    
    return count <= limit;
  }

  private getRateLimit(channel: NotificationChannel, type: NotificationType): number {
    // Define rate limits per channel/type combination
    if (channel === NotificationChannel.SMS) return 5;
    if (channel === NotificationChannel.EMAIL) return 10;
    if (channel === NotificationChannel.PUSH) return 20;
    return 50;
  }

  private async updateNotificationStatus(
    id: string,
    status: NotificationStatus | string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.prisma.notification.update({
      where: { id },
      data: {
        status,
        ...(status === 'sent' && { sentAt: new Date() }),
        ...(metadata && { metadata })
      }
    });
  }

  private async handleSendError(notification: Notification, error: Error): Promise<void> {
    notification.retryCount++;
    
    if (notification.retryCount >= 3) {
      await this.updateNotificationStatus(notification.id, 'failed', {
        error: error.message
      });
    } else {
      // Retry with backoff
      const delay = Math.pow(2, notification.retryCount) * 1000;
      setTimeout(() => {
        this.queueNotification(notification);
      }, delay);
    }

    // Log error
    console.error(`Failed to send notification ${notification.id}:`, error);
  }

  private async trackMetric(notification: Notification): Promise<void> {
    await this.prisma.notificationMetrics.create({
      data: {
        channel: notification.channel,
        type: notification.type,
        sent: 1,
        delivered: 0,
        opened: 0,
        clicked: 0,
        failed: 0,
        bounced: 0,
        unsubscribed: 0,
        period: 'hour',
        timestamp: new Date()
      }
    });
  }

  private getUnsubscribeUrl(userId: string): string {
    const token = this.generateUnsubscribeToken(userId);
    return `${this.config.get('FRONTEND_URL')}/unsubscribe?token=${token}`;
  }

  private generateUnsubscribeToken(userId: string): string {
    // Generate secure token for unsubscribe
    return Buffer.from(`${userId}:${Date.now()}`).toString('base64');
  }

  private mapPriorityToQueuePriority(priority: Priority): number {
    const mapping = {
      [Priority.LOW]: 10,
      [Priority.MEDIUM]: 5,
      [Priority.HIGH]: 2,
      [Priority.URGENT]: 1
    };
    return mapping[priority];
  }

  private mapPriorityToAndroid(priority: Priority): 'normal' | 'high' {
    return priority === Priority.URGENT || priority === Priority.HIGH ? 'high' : 'normal';
  }

  private mapPriorityToAPNS(priority: Priority): string {
    return priority === Priority.URGENT || priority === Priority.HIGH ? '10' : '5';
  }

  private async getUser(userId: string): Promise<any> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  private async getTemplate(type: NotificationType, channel: string): Promise<any> {
    return this.prisma.notificationTemplate.findFirst({
      where: { type, channel, isActive: true }
    });
  }

  private async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        userId,
        channel: NotificationChannel.IN_APP,
        readAt: null
      }
    });
  }

  private groupMetrics(metrics: any[], field: string): any {
    // Group and aggregate metrics
    return {};
  }

  private calculateTrends(metrics: any[]): any {
    // Calculate trend data
    return {};
  }

  private mapPrismaToNotification(data: any): Notification {
    return data as Notification;
  }

  private mapPrismaToBatch(data: any): NotificationBatch {
    return data as NotificationBatch;
  }
}
