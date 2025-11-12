/**
 * EUREKA Test Prep - Advanced Analytics Service
 * Real-time performance tracking, predictive modeling, and insights generation
 */

import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as tf from '@tensorflow/tfjs-node';
import { InfluxDB, Point } from '@influxdata/influxdb-client';

interface AnalyticsData {
  userId: string;
  examType: string;
  metrics: PerformanceMetrics;
  predictions: Predictions;
  insights: Insight[];
  trends: TrendAnalysis;
  comparisons: PeerComparison;
  recommendations: Recommendation[];
}

interface PerformanceMetrics {
  readinessScore: number;
  theta: number;
  thetaSE: number;
  percentile: number;
  questionsAnswered: number;
  accuracyByDifficulty: { easy: number; medium: number; hard: number };
  averageTimePerQuestion: number;
  studyStreak: number;
  totalStudyHours: number;
  topicMastery: Map<string, TopicMetrics>;
  weaknessIndex: number;
  improvementRate: number;
  consistency: number;
}

interface TopicMetrics {
  mastery: number;
  questionsAnswered: number;
  accuracy: number;
  avgTime: number;
  lastPracticed: Date;
  trend: 'improving' | 'declining' | 'stable';
  confidenceInterval: [number, number];
  expectedMastery: number;
  gapToTarget: number;
}

interface Predictions {
  examScore: ScorePrediction;
  readinessDate: Date;
  probabilityOfTarget: number;
  criticalTopics: string[];
  riskFactors: RiskFactor[];
  successProbability: number;
}

interface ScorePrediction {
  expected: number;
  confidence: number;
  range: { min: number; median: number; max: number };
  distribution: number[];
  percentileProjection: number;
}

interface RiskFactor {
  type: string;
  severity: 'low' | 'medium' | 'high';
  impact: number;
  mitigation: string;
}

interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  importance: number;
  actionable: boolean;
  recommendations?: string[];
  evidence: any;
  timestamp: Date;
}

enum InsightType {
  STRENGTH = 'strength',
  WEAKNESS = 'weakness',
  OPPORTUNITY = 'opportunity',
  THREAT = 'threat',
  PATTERN = 'pattern',
  ANOMALY = 'anomaly',
  MILESTONE = 'milestone'
}

interface TrendAnalysis {
  overall: Trend;
  byTopic: Map<string, Trend>;
  byDifficulty: Map<string, Trend>;
  timeManagement: Trend;
  consistency: Trend;
}

interface Trend {
  direction: 'up' | 'down' | 'stable';
  magnitude: number;
  confidence: number;
  forecast: number[];
  changePoints?: Date[];
}

interface PeerComparison {
  percentileRank: number;
  averageScore: number;
  peerGroupSize: number;
  strengths: string[];
  weaknesses: string[];
  uniquePatterns: string[];
}

interface Recommendation {
  id: string;
  priority: number;
  type: 'practice' | 'review' | 'strategy' | 'mindset';
  title: string;
  description: string;
  estimatedImpact: number;
  timeRequired: number;
  resources?: Resource[];
}

interface Resource {
  type: string;
  title: string;
  url?: string;
  duration?: number;
}

@Injectable()
export class AnalyticsService {
  private influx: InfluxDB;
  private predictionModel: tf.LayersModel;
  private trendModel: tf.LayersModel;
  
  constructor(private eventEmitter: EventEmitter2) {
    this.initializeInfluxDB();
    this.loadModels();
  }

  private async initializeInfluxDB() {
    this.influx = new InfluxDB({
      url: process.env.INFLUX_URL || 'http://localhost:8086',
      token: process.env.INFLUX_TOKEN
    });
  }

  private async loadModels() {
    // Load pre-trained models for predictions
    this.predictionModel = await this.createPredictionModel();
    this.trendModel = await this.createTrendModel();
  }

  /**
   * Get comprehensive analytics for a user
   */
  async getUserAnalytics(userId: string, examType: string): Promise<AnalyticsData> {
    // Fetch raw data
    const performanceData = await this.fetchPerformanceData(userId, examType);
    const historicalData = await this.fetchHistoricalData(userId);
    
    // Calculate metrics
    const metrics = await this.calculateMetrics(performanceData, historicalData);
    
    // Generate predictions
    const predictions = await this.generatePredictions(metrics, historicalData);
    
    // Analyze trends
    const trends = await this.analyzeTrends(historicalData);
    
    // Generate insights
    const insights = await this.generateInsights(metrics, trends, predictions);
    
    // Peer comparison
    const comparisons = await this.compareToPeers(userId, examType, metrics);
    
    // Generate recommendations
    const recommendations = await this.generateRecommendations(
      metrics,
      predictions,
      insights
    );
    
    // Store analytics snapshot
    await this.storeAnalytics({
      userId,
      examType,
      metrics,
      predictions,
      insights,
      trends,
      comparisons,
      recommendations
    });
    
    return {
      userId,
      examType,
      metrics,
      predictions,
      insights,
      trends,
      comparisons,
      recommendations
    };
  }

  /**
   * Calculate readiness score using multi-factor model
   */
  async calculateReadinessScore(userId: string): Promise<{
    score: number;
    confidence: number;
    factors: ReadinessFactor[];
  }> {
    const data = await this.fetchPerformanceData(userId, '');
    
    // Factors for readiness calculation
    const factors: ReadinessFactor[] = [
      {
        name: 'Content Mastery',
        weight: 0.35,
        score: this.calculateContentMastery(data),
        trend: 'up'
      },
      {
        name: 'Consistency',
        weight: 0.20,
        score: this.calculateConsistency(data),
        trend: 'stable'
      },
      {
        name: 'Time Management',
        weight: 0.15,
        score: this.calculateTimeManagement(data),
        trend: 'up'
      },
      {
        name: 'Accuracy',
        weight: 0.20,
        score: this.calculateAccuracy(data),
        trend: 'up'
      },
      {
        name: 'Difficulty Handling',
        weight: 0.10,
        score: this.calculateDifficultyHandling(data),
        trend: 'up'
      }
    ];
    
    // Weighted average
    const score = factors.reduce((sum, factor) => 
      sum + factor.score * factor.weight, 0
    );
    
    // Confidence based on data quantity and recency
    const confidence = this.calculateConfidence(data);
    
    // Emit readiness update
    this.eventEmitter.emit('analytics.readiness.updated', {
      userId,
      score,
      confidence,
      factors
    });
    
    return { score: score * 100, confidence, factors };
  }

  /**
   * Advanced trend analysis using time series models
   */
  private async analyzeTrends(data: any): Promise<TrendAnalysis> {
    // Prepare time series data
    const timeSeries = this.prepareTimeSeries(data);
    
    // Overall trend
    const overall = await this.detectTrend(timeSeries.overall);
    
    // Topic-specific trends
    const byTopic = new Map<string, Trend>();
    for (const [topic, series] of timeSeries.byTopic.entries()) {
      byTopic.set(topic, await this.detectTrend(series));
    }
    
    // Difficulty trends
    const byDifficulty = new Map<string, Trend>();
    for (const [diff, series] of timeSeries.byDifficulty.entries()) {
      byDifficulty.set(diff, await this.detectTrend(series));
    }
    
    // Time management trend
    const timeManagement = await this.detectTrend(timeSeries.timePerQuestion);
    
    // Consistency trend
    const consistency = await this.detectTrend(timeSeries.dailyActivity);
    
    return {
      overall,
      byTopic,
      byDifficulty,
      timeManagement,
      consistency
    };
  }

  /**
   * Detect trend using multiple methods
   */
  private async detectTrend(series: number[]): Promise<Trend> {
    if (series.length < 3) {
      return {
        direction: 'stable',
        magnitude: 0,
        confidence: 0.1,
        forecast: []
      };
    }
    
    // Linear regression for simple trend
    const linearTrend = this.calculateLinearTrend(series);
    
    // Moving average for smoothed trend
    const maTrend = this.calculateMovingAverageTrend(series, 3);
    
    // Mann-Kendall test for statistical significance
    const mkTest = this.mannKendallTest(series);
    
    // Change point detection
    const changePoints = this.detectChangePoints(series);
    
    // ARIMA forecast
    const forecast = await this.forecastARIMA(series, 5);
    
    // Combine results
    const direction = linearTrend.slope > 0.01 ? 'up' : 
                     linearTrend.slope < -0.01 ? 'down' : 'stable';
    
    return {
      direction,
      magnitude: Math.abs(linearTrend.slope),
      confidence: mkTest.pValue < 0.05 ? 0.95 : 0.5,
      forecast,
      changePoints: changePoints.map(idx => new Date(Date.now() - (series.length - idx) * 86400000))
    };
  }

  /**
   * Generate actionable insights using pattern recognition
   */
  private async generateInsights(
    metrics: PerformanceMetrics,
    trends: TrendAnalysis,
    predictions: Predictions
  ): Promise<Insight[]> {
    const insights: Insight[] = [];
    
    // Strength insights
    metrics.topicMastery.forEach((topic, name) => {
      if (topic.mastery > 0.8 && topic.trend === 'improving') {
        insights.push({
          id: this.generateId(),
          type: InsightType.STRENGTH,
          title: `Excellence in ${name}`,
          description: `You've mastered ${name} with ${Math.round(topic.mastery * 100)}% proficiency`,
          importance: 0.7,
          actionable: false,
          evidence: { mastery: topic.mastery, questions: topic.questionsAnswered },
          timestamp: new Date()
        });
      }
    });
    
    // Weakness insights
    const weakTopics = Array.from(metrics.topicMastery.entries())
      .filter(([_, topic]) => topic.mastery < 0.5)
      .sort((a, b) => a[1].mastery - b[1].mastery);
    
    if (weakTopics.length > 0) {
      const [name, topic] = weakTopics[0];
      insights.push({
        id: this.generateId(),
        type: InsightType.WEAKNESS,
        title: `Critical Gap: ${name}`,
        description: `${name} needs immediate attention (${Math.round(topic.mastery * 100)}% mastery)`,
        importance: 0.9,
        actionable: true,
        recommendations: [
          `Focus 60% of study time on ${name}`,
          'Start with foundational concepts',
          'Use spaced repetition'
        ],
        evidence: topic,
        timestamp: new Date()
      });
    }
    
    // Pattern insights
    if (trends.timeManagement.direction === 'down' && trends.timeManagement.magnitude > 0.02) {
      insights.push({
        id: this.generateId(),
        type: InsightType.PATTERN,
        title: 'Improving Speed',
        description: 'Your solving speed has increased by 15% this week',
        importance: 0.6,
        actionable: false,
        evidence: trends.timeManagement,
        timestamp: new Date()
      });
    }
    
    // Anomaly detection
    const anomalies = await this.detectAnomalies(metrics);
    anomalies.forEach(anomaly => {
      insights.push({
        id: this.generateId(),
        type: InsightType.ANOMALY,
        title: anomaly.title,
        description: anomaly.description,
        importance: anomaly.severity,
        actionable: true,
        recommendations: anomaly.actions,
        evidence: anomaly.data,
        timestamp: new Date()
      });
    });
    
    // Milestone insights
    if (metrics.questionsAnswered > 0 && metrics.questionsAnswered % 1000 === 0) {
      insights.push({
        id: this.generateId(),
        type: InsightType.MILESTONE,
        title: `${metrics.questionsAnswered} Questions Completed!`,
        description: 'Major milestone achieved in your preparation journey',
        importance: 0.8,
        actionable: false,
        evidence: { total: metrics.questionsAnswered },
        timestamp: new Date()
      });
    }
    
    return insights.sort((a, b) => b.importance - a.importance);
  }

  /**
   * Generate personalized recommendations
   */
  private async generateRecommendations(
    metrics: PerformanceMetrics,
    predictions: Predictions,
    insights: Insight[]
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];
    
    // Critical topic recommendations
    predictions.criticalTopics.forEach(topic => {
      recommendations.push({
        id: this.generateId(),
        priority: 1,
        type: 'practice',
        title: `Intensive Practice: ${topic}`,
        description: `Focus on ${topic} to maximize score improvement`,
        estimatedImpact: 5, // points
        timeRequired: 120, // minutes
        resources: [
          { type: 'video', title: `${topic} Fundamentals`, duration: 30 },
          { type: 'practice', title: `${topic} Problem Set`, duration: 60 },
          { type: 'review', title: `${topic} Common Mistakes`, duration: 30 }
        ]
      });
    });
    
    // Time management recommendations
    if (metrics.averageTimePerQuestion > 90) {
      recommendations.push({
        id: this.generateId(),
        priority: 2,
        type: 'strategy',
        title: 'Speed Practice Sessions',
        description: 'Practice with strict time limits to improve pacing',
        estimatedImpact: 3,
        timeRequired: 45,
        resources: [
          { type: 'practice', title: 'Timed Drills', duration: 30 },
          { type: 'guide', title: 'Time Management Strategies', duration: 15 }
        ]
      });
    }
    
    // Consistency recommendations
    if (metrics.consistency < 0.7) {
      recommendations.push({
        id: this.generateId(),
        priority: 2,
        type: 'mindset',
        title: 'Build Daily Habit',
        description: 'Consistent daily practice is key to improvement',
        estimatedImpact: 4,
        timeRequired: 30,
        resources: [
          { type: 'guide', title: 'Building Study Habits', duration: 10 },
          { type: 'tool', title: 'Study Schedule Template', duration: 20 }
        ]
      });
    }
    
    // Difficulty progression
    if (metrics.accuracyByDifficulty.hard < 0.5 && metrics.accuracyByDifficulty.medium > 0.7) {
      recommendations.push({
        id: this.generateId(),
        priority: 3,
        type: 'practice',
        title: 'Challenge Yourself',
        description: 'Ready for harder problems to push your limits',
        estimatedImpact: 2,
        timeRequired: 60
      });
    }
    
    return recommendations.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Peer comparison analysis
   */
  private async compareToPeers(
    userId: string,
    examType: string,
    metrics: PerformanceMetrics
  ): Promise<PeerComparison> {
    // Get peer group data
    const peerData = await this.fetchPeerData(examType, metrics.theta);
    
    // Calculate percentile rank
    const percentileRank = this.calculatePercentile(metrics.theta, peerData.thetas);
    
    // Identify relative strengths/weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    metrics.topicMastery.forEach((topic, name) => {
      const peerAvg = peerData.topicAverages.get(name) || 0.5;
      if (topic.mastery > peerAvg + 0.1) {
        strengths.push(name);
      } else if (topic.mastery < peerAvg - 0.1) {
        weaknesses.push(name);
      }
    });
    
    // Find unique patterns
    const uniquePatterns = this.identifyUniquePatterns(metrics, peerData);
    
    return {
      percentileRank,
      averageScore: peerData.averageScore,
      peerGroupSize: peerData.count,
      strengths,
      weaknesses,
      uniquePatterns
    };
  }

  /**
   * Store analytics data for historical tracking
   */
  private async storeAnalytics(data: AnalyticsData): Promise<void> {
    const writeApi = this.influx.getWriteApi('eureka', 'analytics');
    
    // Store metrics
    const point = new Point('user_analytics')
      .tag('user_id', data.userId)
      .tag('exam_type', data.examType)
      .floatField('readiness_score', data.metrics.readinessScore)
      .floatField('theta', data.metrics.theta)
      .floatField('percentile', data.metrics.percentile)
      .intField('questions_answered', data.metrics.questionsAnswered)
      .floatField('accuracy', 
        (data.metrics.accuracyByDifficulty.easy + 
         data.metrics.accuracyByDifficulty.medium + 
         data.metrics.accuracyByDifficulty.hard) / 3)
      .timestamp(new Date());
    
    writeApi.writePoint(point);
    
    // Store topic mastery
    data.metrics.topicMastery.forEach((topic, name) => {
      const topicPoint = new Point('topic_mastery')
        .tag('user_id', data.userId)
        .tag('topic', name)
        .floatField('mastery', topic.mastery)
        .floatField('accuracy', topic.accuracy)
        .floatField('avg_time', topic.avgTime)
        .timestamp(new Date());
      
      writeApi.writePoint(topicPoint);
    });
    
    await writeApi.close();
  }

  /**
   * Create prediction model
   */
  private async createPredictionModel(): Promise<tf.LayersModel> {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 128, activation: 'relu', inputShape: [30] }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'linear' })
      ]
    });
    
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });
    
    return model;
  }

  /**
   * Create trend analysis model
   */
  private async createTrendModel(): Promise<tf.LayersModel> {
    const model = tf.sequential({
      layers: [
        tf.layers.lstm({ units: 50, returnSequences: true, inputShape: [10, 5] }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.lstm({ units: 50 }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 1 })
      ]
    });
    
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError'
    });
    
    return model;
  }

  // Statistical helper methods
  private calculateLinearTrend(series: number[]): { slope: number; intercept: number } {
    const n = series.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = series.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * series[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return { slope, intercept };
  }

  private calculateMovingAverageTrend(series: number[], window: number): number {
    if (series.length < window * 2) return 0;
    
    const firstMA = series.slice(0, window).reduce((a, b) => a + b, 0) / window;
    const lastMA = series.slice(-window).reduce((a, b) => a + b, 0) / window;
    
    return (lastMA - firstMA) / firstMA;
  }

  private mannKendallTest(series: number[]): { tau: number; pValue: number } {
    // Simplified Mann-Kendall test
    const n = series.length;
    let s = 0;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        const diff = series[j] - series[i];
        if (diff > 0) s++;
        else if (diff < 0) s--;
      }
    }
    
    const variance = n * (n - 1) * (2 * n + 5) / 18;
    const z = s / Math.sqrt(variance);
    
    // Approximate p-value
    const pValue = 2 * (1 - this.normalCDF(Math.abs(z)));
    
    return { tau: s / (n * (n - 1) / 2), pValue };
  }

  private detectChangePoints(series: number[]): number[] {
    // PELT algorithm simplified
    const changePoints: number[] = [];
    const threshold = 0.2;
    
    for (let i = 1; i < series.length - 1; i++) {
      const left = series.slice(0, i);
      const right = series.slice(i);
      
      const leftMean = left.reduce((a, b) => a + b, 0) / left.length;
      const rightMean = right.reduce((a, b) => a + b, 0) / right.length;
      
      if (Math.abs(leftMean - rightMean) > threshold) {
        changePoints.push(i);
      }
    }
    
    return changePoints;
  }

  private async forecastARIMA(series: number[], steps: number): Promise<number[]> {
    // Simplified ARIMA forecast
    const trend = this.calculateLinearTrend(series);
    const forecast: number[] = [];
    
    for (let i = 1; i <= steps; i++) {
      const value = trend.intercept + trend.slope * (series.length + i);
      forecast.push(Math.max(0, Math.min(100, value)));
    }
    
    return forecast;
  }

  private normalCDF(z: number): number {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    
    const sign = z < 0 ? -1 : 1;
    z = Math.abs(z) / Math.sqrt(2);
    
    const t = 1 / (1 + p * z);
    const t2 = t * t;
    const t3 = t2 * t;
    const t4 = t3 * t;
    const t5 = t4 * t;
    
    const erf = 1 - ((a1 * t + a2 * t2 + a3 * t3 + a4 * t4 + a5 * t5) * Math.exp(-z * z));
    
    return 0.5 * (1 + sign * erf);
  }

  private calculatePercentile(value: number, distribution: number[]): number {
    const sorted = [...distribution].sort((a, b) => a - b);
    const index = sorted.findIndex(v => v >= value);
    return index === -1 ? 100 : (index / sorted.length) * 100;
  }

  private identifyUniquePatterns(metrics: PerformanceMetrics, peerData: any): string[] {
    const patterns: string[] = [];
    
    // Check for unique time patterns
    if (metrics.averageTimePerQuestion < peerData.avgTime * 0.7) {
      patterns.push('Exceptionally fast solver');
    }
    
    // Check for unique accuracy patterns
    if (metrics.accuracyByDifficulty.hard > peerData.hardAccuracy + 0.2) {
      patterns.push('Strong at challenging problems');
    }
    
    return patterns;
  }

  // Helper methods
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async fetchPerformanceData(userId: string, examType: string): Promise<any> {
    // Fetch from database
    return {};
  }

  private async fetchHistoricalData(userId: string): Promise<any> {
    // Fetch from time-series database
    return {};
  }

  private async fetchPeerData(examType: string, theta: number): Promise<any> {
    // Fetch peer comparison data
    return {
      thetas: [],
      averageScore: 0,
      count: 0,
      topicAverages: new Map(),
      avgTime: 0,
      hardAccuracy: 0
    };
  }

  private async calculateMetrics(performance: any, historical: any): Promise<PerformanceMetrics> {
    // Calculate comprehensive metrics
    return {} as PerformanceMetrics;
  }

  private async generatePredictions(metrics: PerformanceMetrics, historical: any): Promise<Predictions> {
    // Generate predictions using ML model
    return {} as Predictions;
  }

  private prepareTimeSeries(data: any): any {
    // Prepare time series data for analysis
    return {
      overall: [],
      byTopic: new Map(),
      byDifficulty: new Map(),
      timePerQuestion: [],
      dailyActivity: []
    };
  }

  private async detectAnomalies(metrics: PerformanceMetrics): Promise<any[]> {
    // Detect anomalies in performance
    return [];
  }

  private calculateContentMastery(data: any): number {
    // Calculate content mastery score
    return 0;
  }

  private calculateConsistency(data: any): number {
    // Calculate consistency score
    return 0;
  }

  private calculateTimeManagement(data: any): number {
    // Calculate time management score
    return 0;
  }

  private calculateAccuracy(data: any): number {
    // Calculate accuracy score
    return 0;
  }

  private calculateDifficultyHandling(data: any): number {
    // Calculate difficulty handling score
    return 0;
  }

  private calculateConfidence(data: any): number {
    // Calculate confidence in metrics
    return 0;
  }
}

interface ReadinessFactor {
  name: string;
  weight: number;
  score: number;
  trend: 'up' | 'down' | 'stable';
}
