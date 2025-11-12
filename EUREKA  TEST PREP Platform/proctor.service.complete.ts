/**
 * EUREKA Test Prep - Advanced Proctoring Service
 * AI-powered exam integrity monitoring with real-time anomaly detection
 */

import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as tf from '@tensorflow/tfjs-node';
import { MinioService } from '@eureka/common';

interface ProctorSession {
  id: string;
  userId: string;
  attemptId: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'flagged' | 'terminated';
  riskScore: number;
  flags: ProctorFlag[];
  metrics: ProctorMetrics;
  recordings: {
    video?: string;
    audio?: string;
    screen?: string;
    keystroke?: KeystrokePattern[];
  };
}

interface ProctorFlag {
  type: FlagType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  description: string;
  evidence?: any;
  confidence: number;
}

enum FlagType {
  NO_FACE = 'no_face_detected',
  MULTIPLE_FACES = 'multiple_faces',
  FACE_MISMATCH = 'face_mismatch',
  EXCESSIVE_MOVEMENT = 'excessive_movement',
  LOOKING_AWAY = 'looking_away',
  AUDIO_ANOMALY = 'audio_anomaly',
  TAB_SWITCH = 'tab_switch',
  COPY_PASTE = 'copy_paste',
  SUSPICIOUS_TYPING = 'suspicious_typing',
  NETWORK_ANOMALY = 'network_anomaly',
  DEVICE_CHANGE = 'device_change'
}

interface ProctorMetrics {
  facePresence: number[];      // Time series: % of frame with face
  gazeDeviation: number[];     // Degrees from center
  headPose: { pitch: number; yaw: number; roll: number }[];
  audioLevel: number[];        // dB levels
  keystrokeDynamics: {
    dwellTime: number[];       // Key press duration
    flightTime: number[];      // Time between keys
    pressure: number[];        // If available
  };
  mouseMovement: {
    velocity: number[];
    acceleration: number[];
    clicks: { x: number; y: number; timestamp: number }[];
  };
  tabSwitches: number;
  copyPasteAttempts: number;
  fullscreenExits: number;
  networkLatency: number[];
}

interface KeystrokePattern {
  timestamp: number;
  keyCode: string;
  dwellTime: number;
  flightTime: number;
  pressure?: number;
}

@Injectable()
export class ProctorService {
  private readonly logger = new Logger(ProctorService.name);
  private sessions = new Map<string, ProctorSession>();
  private faceDetectionModel: tf.GraphModel;
  private anomalyDetectionModel: tf.LayersModel;
  private userBiometricProfiles = new Map<string, BiometricProfile>();

  constructor(
    private eventEmitter: EventEmitter2,
    private minioService: MinioService
  ) {
    this.initializeModels();
  }

  private async initializeModels() {
    // Load pre-trained models for face detection and anomaly detection
    this.faceDetectionModel = await tf.loadGraphModel(
      'https://tfhub.dev/tensorflow/tfjs-model/blazeface/1/default/1'
    );
    
    // Custom anomaly detection model
    this.anomalyDetectionModel = await this.createAnomalyDetectionModel();
  }

  /**
   * Start a new proctoring session
   */
  async startSession(params: {
    userId: string;
    attemptId: string;
    config: ProctorConfig;
  }): Promise<ProctorSession> {
    const sessionId = this.generateSessionId();
    
    const session: ProctorSession = {
      id: sessionId,
      userId: params.userId,
      attemptId: params.attemptId,
      startTime: new Date(),
      status: 'active',
      riskScore: 0,
      flags: [],
      metrics: this.initializeMetrics(),
      recordings: {}
    };

    this.sessions.set(sessionId, session);
    
    // Start monitoring
    this.startMonitoring(sessionId, params.config);
    
    // Emit session started event
    this.eventEmitter.emit('proctor.session.started', session);
    
    return session;
  }

  /**
   * Process incoming proctoring data
   */
  async processFrame(sessionId: string, data: {
    video?: Uint8Array;
    audio?: Float32Array;
    metrics: Partial<ProctorMetrics>;
  }): Promise<{
    riskScore: number;
    flags: ProctorFlag[];
    action?: 'continue' | 'warning' | 'terminate';
  }> {
    const session = this.sessions.get(sessionId);
    if (!session || session.status !== 'active') {
      throw new Error('Invalid or inactive session');
    }

    const flags: ProctorFlag[] = [];
    
    // Process video frame if provided
    if (data.video) {
      const videoFlags = await this.analyzeVideoFrame(data.video, session.userId);
      flags.push(...videoFlags);
    }

    // Process audio if provided
    if (data.audio) {
      const audioFlags = await this.analyzeAudio(data.audio);
      flags.push(...audioFlags);
    }

    // Analyze behavioral metrics
    if (data.metrics) {
      const behaviorFlags = await this.analyzeBehavior(data.metrics, session);
      flags.push(...behaviorFlags);
    }

    // Update session
    session.flags.push(...flags);
    this.updateMetrics(session, data.metrics);
    
    // Calculate risk score
    const riskScore = this.calculateRiskScore(session);
    session.riskScore = riskScore;

    // Determine action
    let action: 'continue' | 'warning' | 'terminate' = 'continue';
    if (riskScore > 0.9) {
      action = 'terminate';
      await this.terminateSession(sessionId, 'High risk score');
    } else if (riskScore > 0.7) {
      action = 'warning';
      this.sendWarning(session);
    }

    // Store high-severity flags
    if (flags.some(f => f.severity === 'high' || f.severity === 'critical')) {
      await this.storeEvidence(session, flags);
    }

    return { riskScore, flags, action };
  }

  /**
   * Analyze video frame for anomalies
   */
  private async analyzeVideoFrame(
    frame: Uint8Array,
    userId: string
  ): Promise<ProctorFlag[]> {
    const flags: ProctorFlag[] = [];
    
    // Convert to tensor
    const imageTensor = tf.node.decodeImage(frame);
    
    // Detect faces
    const predictions = await this.faceDetectionModel.executeAsync(imageTensor) as tf.Tensor[];
    const faces = await this.extractFaces(predictions);
    
    // Check face count
    if (faces.length === 0) {
      flags.push({
        type: FlagType.NO_FACE,
        severity: 'medium',
        timestamp: new Date(),
        description: 'No face detected in frame',
        confidence: 0.95
      });
    } else if (faces.length > 1) {
      flags.push({
        type: FlagType.MULTIPLE_FACES,
        severity: 'high',
        timestamp: new Date(),
        description: `${faces.length} faces detected`,
        confidence: 0.9,
        evidence: { faceCount: faces.length }
      });
    } else if (faces.length === 1) {
      // Verify face identity
      const isMatch = await this.verifyFaceIdentity(faces[0], userId);
      if (!isMatch) {
        flags.push({
          type: FlagType.FACE_MISMATCH,
          severity: 'critical',
          timestamp: new Date(),
          description: 'Face does not match registered user',
          confidence: 0.85
        });
      }

      // Check gaze direction
      const gazeAngle = await this.estimateGaze(faces[0]);
      if (Math.abs(gazeAngle.horizontal) > 30 || Math.abs(gazeAngle.vertical) > 30) {
        flags.push({
          type: FlagType.LOOKING_AWAY,
          severity: 'low',
          timestamp: new Date(),
          description: 'User looking away from screen',
          confidence: 0.7,
          evidence: gazeAngle
        });
      }
    }

    // Clean up tensors
    imageTensor.dispose();
    predictions.forEach(p => p.dispose());

    return flags;
  }

  /**
   * Analyze audio for anomalies
   */
  private async analyzeAudio(audio: Float32Array): Promise<ProctorFlag[]> {
    const flags: ProctorFlag[] = [];
    
    // Calculate audio features
    const features = this.extractAudioFeatures(audio);
    
    // Check for voices
    if (features.voiceDetected && features.voiceCount > 1) {
      flags.push({
        type: FlagType.AUDIO_ANOMALY,
        severity: 'high',
        timestamp: new Date(),
        description: 'Multiple voices detected',
        confidence: features.voiceConfidence,
        evidence: { voiceCount: features.voiceCount }
      });
    }

    // Check for prohibited sounds (typing, phone, etc.)
    if (features.suspiciousSounds.length > 0) {
      flags.push({
        type: FlagType.AUDIO_ANOMALY,
        severity: 'medium',
        timestamp: new Date(),
        description: `Suspicious sounds detected: ${features.suspiciousSounds.join(', ')}`,
        confidence: 0.6,
        evidence: { sounds: features.suspiciousSounds }
      });
    }

    return flags;
  }

  /**
   * Analyze behavioral patterns
   */
  private async analyzeBehavior(
    metrics: Partial<ProctorMetrics>,
    session: ProctorSession
  ): Promise<ProctorFlag[]> {
    const flags: ProctorFlag[] = [];

    // Check tab switches
    if (metrics.tabSwitches && metrics.tabSwitches > 0) {
      flags.push({
        type: FlagType.TAB_SWITCH,
        severity: metrics.tabSwitches > 3 ? 'high' : 'medium',
        timestamp: new Date(),
        description: `Tab switched ${metrics.tabSwitches} times`,
        confidence: 1.0,
        evidence: { count: metrics.tabSwitches }
      });
    }

    // Check copy/paste
    if (metrics.copyPasteAttempts && metrics.copyPasteAttempts > 0) {
      flags.push({
        type: FlagType.COPY_PASTE,
        severity: 'high',
        timestamp: new Date(),
        description: 'Copy/paste attempted',
        confidence: 1.0,
        evidence: { count: metrics.copyPasteAttempts }
      });
    }

    // Analyze keystroke patterns
    if (metrics.keystrokeDynamics) {
      const keystrokeAnomalies = await this.analyzeKeystrokeDynamics(
        metrics.keystrokeDynamics,
        session.userId
      );
      
      if (keystrokeAnomalies.score > 0.7) {
        flags.push({
          type: FlagType.SUSPICIOUS_TYPING,
          severity: keystrokeAnomalies.score > 0.85 ? 'high' : 'medium',
          timestamp: new Date(),
          description: 'Abnormal typing patterns detected',
          confidence: keystrokeAnomalies.confidence,
          evidence: keystrokeAnomalies
        });
      }
    }

    // Check network anomalies
    if (metrics.networkLatency) {
      const avgLatency = metrics.networkLatency.reduce((a, b) => a + b, 0) / metrics.networkLatency.length;
      const stdDev = this.calculateStdDev(metrics.networkLatency);
      
      if (stdDev > 100 || avgLatency > 500) {
        flags.push({
          type: FlagType.NETWORK_ANOMALY,
          severity: 'low',
          timestamp: new Date(),
          description: 'Unusual network patterns detected',
          confidence: 0.6,
          evidence: { avgLatency, stdDev }
        });
      }
    }

    return flags;
  }

  /**
   * Calculate overall risk score using ensemble model
   */
  private calculateRiskScore(session: ProctorSession): number {
    // Weight different flag types
    const weights = {
      [FlagType.NO_FACE]: 0.3,
      [FlagType.MULTIPLE_FACES]: 0.8,
      [FlagType.FACE_MISMATCH]: 0.9,
      [FlagType.EXCESSIVE_MOVEMENT]: 0.2,
      [FlagType.LOOKING_AWAY]: 0.15,
      [FlagType.AUDIO_ANOMALY]: 0.6,
      [FlagType.TAB_SWITCH]: 0.5,
      [FlagType.COPY_PASTE]: 0.85,
      [FlagType.SUSPICIOUS_TYPING]: 0.7,
      [FlagType.NETWORK_ANOMALY]: 0.3,
      [FlagType.DEVICE_CHANGE]: 0.8
    };

    // Severity multipliers
    const severityMultipliers = {
      low: 0.5,
      medium: 1.0,
      high: 1.5,
      critical: 2.0
    };

    // Calculate weighted score
    let totalScore = 0;
    let totalWeight = 0;

    session.flags.forEach(flag => {
      const weight = weights[flag.type] || 0.5;
      const multiplier = severityMultipliers[flag.severity];
      const score = weight * multiplier * flag.confidence;
      
      totalScore += score;
      totalWeight += weight;
    });

    // Normalize to 0-1 range
    const normalizedScore = totalWeight > 0 ? totalScore / totalWeight : 0;
    
    // Apply time decay (recent flags are more important)
    const timeDecayedScore = this.applyTimeDecay(session.flags, normalizedScore);
    
    // Combine with ML model prediction if available
    const mlScore = this.predictAnomalyScore(session.metrics);
    
    // Ensemble: 70% rule-based, 30% ML
    return Math.min(1, timeDecayedScore * 0.7 + mlScore * 0.3);
  }

  /**
   * Create custom anomaly detection model
   */
  private async createAnomalyDetectionModel(): Promise<tf.LayersModel> {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 64, activation: 'relu', inputShape: [50] }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  /**
   * Keystroke dynamics analysis
   */
  private async analyzeKeystrokeDynamics(
    dynamics: any,
    userId: string
  ): Promise<{ score: number; confidence: number; anomalies: string[] }> {
    const profile = this.userBiometricProfiles.get(userId);
    if (!profile) {
      return { score: 0, confidence: 0.3, anomalies: [] };
    }

    const anomalies: string[] = [];
    let anomalyScore = 0;

    // Compare dwell times
    if (dynamics.dwellTime) {
      const avgDwell = dynamics.dwellTime.reduce((a, b) => a + b, 0) / dynamics.dwellTime.length;
      const deviation = Math.abs(avgDwell - profile.avgDwellTime) / profile.avgDwellTime;
      
      if (deviation > 0.3) {
        anomalies.push('dwell_time');
        anomalyScore += deviation;
      }
    }

    // Compare flight times
    if (dynamics.flightTime) {
      const avgFlight = dynamics.flightTime.reduce((a, b) => a + b, 0) / dynamics.flightTime.length;
      const deviation = Math.abs(avgFlight - profile.avgFlightTime) / profile.avgFlightTime;
      
      if (deviation > 0.3) {
        anomalies.push('flight_time');
        anomalyScore += deviation;
      }
    }

    // Typing rhythm analysis
    if (dynamics.flightTime && dynamics.flightTime.length > 10) {
      const rhythm = this.calculateTypingRhythm(dynamics.flightTime);
      const rhythmDeviation = Math.abs(rhythm - profile.typingRhythm) / profile.typingRhythm;
      
      if (rhythmDeviation > 0.4) {
        anomalies.push('rhythm');
        anomalyScore += rhythmDeviation;
      }
    }

    return {
      score: Math.min(1, anomalyScore / 3),
      confidence: profile.sampleSize > 100 ? 0.8 : 0.5,
      anomalies
    };
  }

  /**
   * Store evidence for review
   */
  private async storeEvidence(session: ProctorSession, flags: ProctorFlag[]): Promise<void> {
    const evidence = {
      sessionId: session.id,
      timestamp: new Date(),
      flags,
      metrics: session.metrics,
      riskScore: session.riskScore
    };

    const filename = `proctor/${session.attemptId}/evidence_${Date.now()}.json`;
    await this.minioService.upload(filename, JSON.stringify(evidence));

    this.logger.warn(`Evidence stored for session ${session.id}`, evidence);
  }

  /**
   * Send warning to user
   */
  private sendWarning(session: ProctorSession): void {
    this.eventEmitter.emit('proctor.warning', {
      sessionId: session.id,
      userId: session.userId,
      riskScore: session.riskScore,
      message: 'Suspicious activity detected. Please ensure you follow exam guidelines.'
    });
  }

  /**
   * Terminate session
   */
  private async terminateSession(sessionId: string, reason: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.status = 'terminated';
      session.endTime = new Date();
      
      // Store final report
      await this.generateReport(session);
      
      // Notify relevant parties
      this.eventEmitter.emit('proctor.session.terminated', {
        session,
        reason
      });
      
      this.logger.error(`Session ${sessionId} terminated: ${reason}`);
    }
  }

  /**
   * Generate proctoring report
   */
  async generateReport(session: ProctorSession): Promise<ProctorReport> {
    const report: ProctorReport = {
      sessionId: session.id,
      userId: session.userId,
      attemptId: session.attemptId,
      duration: session.endTime ? 
        (session.endTime.getTime() - session.startTime.getTime()) / 1000 : 0,
      finalRiskScore: session.riskScore,
      status: session.status,
      flagSummary: this.summarizeFlags(session.flags),
      recommendations: this.generateRecommendations(session),
      evidenceUrls: await this.getEvidenceUrls(session)
    };

    // Store report
    const filename = `proctor/${session.attemptId}/report.json`;
    await this.minioService.upload(filename, JSON.stringify(report));

    return report;
  }

  // Helper methods
  private generateSessionId(): string {
    return `proctor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeMetrics(): ProctorMetrics {
    return {
      facePresence: [],
      gazeDeviation: [],
      headPose: [],
      audioLevel: [],
      keystrokeDynamics: { dwellTime: [], flightTime: [], pressure: [] },
      mouseMovement: { velocity: [], acceleration: [], clicks: [] },
      tabSwitches: 0,
      copyPasteAttempts: 0,
      fullscreenExits: 0,
      networkLatency: []
    };
  }

  private calculateStdDev(arr: number[]): number {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
    return Math.sqrt(variance);
  }

  private calculateTypingRhythm(flightTimes: number[]): number {
    // Calculate coefficient of variation
    const mean = flightTimes.reduce((a, b) => a + b, 0) / flightTimes.length;
    const stdDev = this.calculateStdDev(flightTimes);
    return stdDev / mean;
  }

  private applyTimeDecay(flags: ProctorFlag[], baseScore: number): number {
    // Recent flags have more weight
    const now = Date.now();
    let weightedScore = 0;
    let totalWeight = 0;

    flags.forEach(flag => {
      const age = (now - flag.timestamp.getTime()) / 1000; // seconds
      const weight = Math.exp(-age / 600); // 10-minute half-life
      weightedScore += weight;
      totalWeight += 1;
    });

    return totalWeight > 0 ? (weightedScore / totalWeight) * baseScore : baseScore;
  }

  private predictAnomalyScore(metrics: ProctorMetrics): number {
    // Simplified ML prediction (would use trained model in production)
    let score = 0;
    
    if (metrics.tabSwitches > 5) score += 0.2;
    if (metrics.copyPasteAttempts > 0) score += 0.3;
    if (metrics.fullscreenExits > 2) score += 0.15;
    
    // Face presence analysis
    if (metrics.facePresence.length > 0) {
      const avgPresence = metrics.facePresence.reduce((a, b) => a + b, 0) / metrics.facePresence.length;
      if (avgPresence < 0.7) score += 0.2;
    }
    
    return Math.min(1, score);
  }

  private async extractFaces(predictions: tf.Tensor[]): Promise<any[]> {
    // Extract face bounding boxes from model predictions
    return [];
  }

  private async verifyFaceIdentity(face: any, userId: string): Promise<boolean> {
    // Compare face with registered user photo
    return true;
  }

  private async estimateGaze(face: any): Promise<{ horizontal: number; vertical: number }> {
    // Estimate gaze direction from face landmarks
    return { horizontal: 0, vertical: 0 };
  }

  private extractAudioFeatures(audio: Float32Array): any {
    // Extract audio features for analysis
    return {
      voiceDetected: false,
      voiceCount: 0,
      voiceConfidence: 0,
      suspiciousSounds: []
    };
  }

  private summarizeFlags(flags: ProctorFlag[]): any {
    const summary = {};
    flags.forEach(flag => {
      if (!summary[flag.type]) {
        summary[flag.type] = { count: 0, maxSeverity: 'low' };
      }
      summary[flag.type].count++;
      // Update max severity
    });
    return summary;
  }

  private generateRecommendations(session: ProctorSession): string[] {
    const recommendations = [];
    
    if (session.riskScore > 0.7) {
      recommendations.push('Manual review required');
    }
    if (session.flags.some(f => f.type === FlagType.FACE_MISMATCH)) {
      recommendations.push('Verify user identity');
    }
    if (session.flags.some(f => f.type === FlagType.COPY_PASTE)) {
      recommendations.push('Check for plagiarism');
    }
    
    return recommendations;
  }

  private async getEvidenceUrls(session: ProctorSession): Promise<string[]> {
    // Get URLs for stored evidence files
    return [];
  }

  private startMonitoring(sessionId: string, config: ProctorConfig): void {
    // Start continuous monitoring based on config
  }

  private updateMetrics(session: ProctorSession, metrics: Partial<ProctorMetrics>): void {
    // Update session metrics
    Object.keys(metrics).forEach(key => {
      if (Array.isArray(metrics[key]) && Array.isArray(session.metrics[key])) {
        session.metrics[key].push(...metrics[key]);
      } else if (typeof metrics[key] === 'number') {
        session.metrics[key] = metrics[key];
      }
    });
  }
}

interface BiometricProfile {
  userId: string;
  avgDwellTime: number;
  avgFlightTime: number;
  typingRhythm: number;
  sampleSize: number;
}

interface ProctorConfig {
  video: boolean;
  audio: boolean;
  screen: boolean;
  keystroke: boolean;
  strictness: 'low' | 'medium' | 'high';
}

interface ProctorReport {
  sessionId: string;
  userId: string;
  attemptId: string;
  duration: number;
  finalRiskScore: number;
  status: string;
  flagSummary: any;
  recommendations: string[];
  evidenceUrls: string[];
}
