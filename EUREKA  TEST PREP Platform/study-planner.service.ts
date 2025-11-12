/**
 * EUREKA Test Prep - Intelligent Study Planner
 * AI-powered personalized study plan generation with optimization algorithms
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@eureka/common';
import * as moment from 'moment';

interface StudyPlan {
  id: string;
  userId: string;
  examDate: Date;
  targetScore: number;
  currentScore: number;
  hoursPerWeek: number;
  weeks: WeeklyPlan[];
  milestones: Milestone[];
  focusAreas: FocusArea[];
  adaptiveAdjustments: Adjustment[];
  confidenceScore: number;
  expectedOutcome: Outcome;
}

interface WeeklyPlan {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  totalHours: number;
  topics: TopicAllocation[];
  practices: PracticeSession[];
  mockExams: MockExam[];
  goals: string[];
  expectedProgress: number;
}

interface TopicAllocation {
  topicId: string;
  topicName: string;
  hours: number;
  priority: number;
  mastery: {
    current: number;
    target: number;
    expected: number;
  };
  materials: StudyMaterial[];
  exercises: Exercise[];
}

interface PracticeSession {
  id: string;
  type: 'adaptive' | 'targeted' | 'mixed' | 'timed';
  duration: number;
  topic: string;
  difficulty: string;
  questionCount: number;
  targetAccuracy: number;
  focus: string[];
}

interface MockExam {
  id: string;
  date: Date;
  type: 'full' | 'section' | 'diagnostic';
  expectedScore: number;
  focusAreas: string[];
  reviewTime: number;
}

interface Milestone {
  id: string;
  weekNumber: number;
  type: 'score' | 'mastery' | 'completion' | 'consistency';
  target: any;
  reward?: string;
  importance: 'critical' | 'important' | 'nice-to-have';
}

interface FocusArea {
  topicId: string;
  topicName: string;
  currentMastery: number;
  targetMastery: number;
  gapAnalysis: {
    conceptualGaps: string[];
    skillGaps: string[];
    practiceNeeded: number;
  };
  improvementPotential: number;
  timeRequired: number;
  strategy: string;
}

interface Adjustment {
  weekNumber: number;
  reason: string;
  changes: {
    hoursAdjustment?: number;
    topicReallocation?: any;
    difficultyAdjustment?: string;
    addedPractice?: any;
  };
  impact: string;
}

interface Outcome {
  predictedScore: number;
  confidence: number;
  probabilityRange: {
    min: number;
    median: number;
    max: number;
  };
  strengths: string[];
  risks: string[];
}

interface StudyMaterial {
  type: 'video' | 'article' | 'book' | 'practice' | 'flashcards';
  title: string;
  url?: string;
  estimatedTime: number;
  difficulty: string;
  effectiveness: number;
}

interface Exercise {
  id: string;
  type: string;
  questionCount: number;
  timeLimit?: number;
  difficulty: string;
  prerequisites?: string[];
}

@Injectable()
export class StudyPlannerService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate comprehensive personalized study plan
   */
  async generateStudyPlan(params: {
    userId: string;
    examType: string;
    examDate: Date;
    targetScore: number;
    availableHours: number;
    preferences?: StudyPreferences;
  }): Promise<StudyPlan> {
    // Get user's current performance data
    const userProfile = await this.getUserProfile(params.userId);
    const performanceData = await this.getPerformanceData(params.userId);
    const topicMastery = await this.getTopicMastery(params.userId, params.examType);
    
    // Calculate time available
    const weeksUntilExam = this.calculateWeeksUntilExam(params.examDate);
    const totalHours = weeksUntilExam * params.availableHours;
    
    // Identify gaps and focus areas
    const focusAreas = this.identifyFocusAreas(
      topicMastery,
      params.targetScore,
      performanceData.currentScore
    );
    
    // Generate optimized weekly plans
    const weeklyPlans = this.generateWeeklyPlans({
      weeks: weeksUntilExam,
      hoursPerWeek: params.availableHours,
      focusAreas,
      examType: params.examType,
      currentScore: performanceData.currentScore,
      targetScore: params.targetScore,
      preferences: params.preferences
    });
    
    // Set milestones
    const milestones = this.generateMilestones(
      weeklyPlans,
      params.targetScore,
      performanceData.currentScore
    );
    
    // Predict outcomes
    const expectedOutcome = this.predictOutcome(
      performanceData,
      weeklyPlans,
      focusAreas
    );
    
    // Create adaptive adjustments
    const adjustments = this.planAdaptiveAdjustments(
      weeklyPlans,
      focusAreas,
      performanceData
    );

    const plan: StudyPlan = {
      id: this.generatePlanId(),
      userId: params.userId,
      examDate: params.examDate,
      targetScore: params.targetScore,
      currentScore: performanceData.currentScore,
      hoursPerWeek: params.availableHours,
      weeks: weeklyPlans,
      milestones,
      focusAreas,
      adaptiveAdjustments: adjustments,
      confidenceScore: this.calculateConfidenceScore(expectedOutcome, weeklyPlans),
      expectedOutcome
    };

    // Save plan to database
    await this.savePlan(plan);
    
    return plan;
  }

  /**
   * Generate optimized weekly study plans
   */
  private generateWeeklyPlans(params: {
    weeks: number;
    hoursPerWeek: number;
    focusAreas: FocusArea[];
    examType: string;
    currentScore: number;
    targetScore: number;
    preferences?: StudyPreferences;
  }): WeeklyPlan[] {
    const plans: WeeklyPlan[] = [];
    const scoreGap = params.targetScore - params.currentScore;
    const weeklyImprovement = scoreGap / params.weeks;
    
    // Use dynamic programming for optimal time allocation
    const timeAllocation = this.optimizeTimeAllocation(
      params.focusAreas,
      params.weeks * params.hoursPerWeek
    );

    for (let week = 1; week <= params.weeks; week++) {
      const startDate = moment().add(week - 1, 'weeks').toDate();
      const endDate = moment().add(week, 'weeks').subtract(1, 'day').toDate();
      
      // Determine phase of preparation
      const phase = this.determinePhase(week, params.weeks);
      
      // Allocate topics for this week
      const topics = this.allocateWeeklyTopics(
        params.focusAreas,
        timeAllocation,
        week,
        params.weeks,
        phase,
        params.hoursPerWeek
      );
      
      // Schedule practice sessions
      const practices = this.schedulePracticeSessions(
        topics,
        phase,
        week,
        params.hoursPerWeek
      );
      
      // Schedule mock exams
      const mockExams = this.scheduleMockExams(
        week,
        params.weeks,
        phase,
        params.examType
      );
      
      // Set weekly goals
      const goals = this.setWeeklyGoals(
        topics,
        phase,
        week,
        params.currentScore + weeklyImprovement * week
      );
      
      plans.push({
        weekNumber: week,
        startDate,
        endDate,
        totalHours: params.hoursPerWeek,
        topics,
        practices,
        mockExams,
        goals,
        expectedProgress: params.currentScore + weeklyImprovement * week
      });
    }
    
    return plans;
  }

  /**
   * Optimize time allocation using dynamic programming
   */
  private optimizeTimeAllocation(
    focusAreas: FocusArea[],
    totalHours: number
  ): Map<string, number> {
    // DP approach: maximize expected score improvement
    const n = focusAreas.length;
    const hours = Math.floor(totalHours);
    
    // dp[i][h] = max score improvement using first i topics with h hours
    const dp: number[][] = Array(n + 1).fill(null).map(() => Array(hours + 1).fill(0));
    const allocation: number[][] = Array(n + 1).fill(null).map(() => Array(hours + 1).fill(0));
    
    for (let i = 1; i <= n; i++) {
      const area = focusAreas[i - 1];
      const maxHours = Math.min(hours, Math.ceil(area.timeRequired));
      
      for (let h = 0; h <= hours; h++) {
        // Don't allocate time to this topic
        dp[i][h] = dp[i - 1][h];
        allocation[i][h] = 0;
        
        // Try allocating different amounts of time
        for (let allocate = 1; allocate <= Math.min(h, maxHours); allocate++) {
          const improvement = this.calculateImprovement(area, allocate);
          const value = dp[i - 1][h - allocate] + improvement;
          
          if (value > dp[i][h]) {
            dp[i][h] = value;
            allocation[i][h] = allocate;
          }
        }
      }
    }
    
    // Backtrack to find optimal allocation
    const result = new Map<string, number>();
    let remainingHours = hours;
    
    for (let i = n; i >= 1; i--) {
      const allocated = allocation[i][remainingHours];
      if (allocated > 0) {
        result.set(focusAreas[i - 1].topicId, allocated);
        remainingHours -= allocated;
      }
    }
    
    return result;
  }

  /**
   * Calculate expected improvement for time spent on a topic
   */
  private calculateImprovement(area: FocusArea, hours: number): number {
    // Diminishing returns model
    const maxImprovement = (area.targetMastery - area.currentMastery) * area.improvementPotential;
    const efficiency = 1 - Math.exp(-hours / area.timeRequired);
    return maxImprovement * efficiency;
  }

  /**
   * Determine study phase
   */
  private determinePhase(week: number, totalWeeks: number): 'foundation' | 'building' | 'reinforcement' | 'peak' | 'taper' {
    const progress = week / totalWeeks;
    
    if (progress <= 0.2) return 'foundation';
    if (progress <= 0.4) return 'building';
    if (progress <= 0.7) return 'reinforcement';
    if (progress <= 0.9) return 'peak';
    return 'taper';
  }

  /**
   * Allocate topics for a specific week
   */
  private allocateWeeklyTopics(
    focusAreas: FocusArea[],
    timeAllocation: Map<string, number>,
    week: number,
    totalWeeks: number,
    phase: string,
    hoursPerWeek: number
  ): TopicAllocation[] {
    const allocations: TopicAllocation[] = [];
    
    // Adjust allocation based on phase
    const phaseWeights = {
      foundation: { concept: 0.6, practice: 0.3, review: 0.1 },
      building: { concept: 0.4, practice: 0.5, review: 0.1 },
      reinforcement: { concept: 0.2, practice: 0.6, review: 0.2 },
      peak: { concept: 0.1, practice: 0.7, review: 0.2 },
      taper: { concept: 0.1, practice: 0.4, review: 0.5 }
    };
    
    const weights = phaseWeights[phase];
    let totalAllocated = 0;
    
    focusAreas.forEach(area => {
      const totalHours = timeAllocation.get(area.topicId) || 0;
      const weeklyHours = totalHours / totalWeeks;
      
      // Adjust based on phase and priority
      let adjustedHours = weeklyHours;
      if (phase === 'foundation' && area.currentMastery < 0.3) {
        adjustedHours *= 1.3; // Focus on weak areas early
      } else if (phase === 'peak' && area.currentMastery > 0.7) {
        adjustedHours *= 0.7; // Reduce time on strong areas
      }
      
      // Cap at available hours
      adjustedHours = Math.min(adjustedHours, hoursPerWeek - totalAllocated);
      totalAllocated += adjustedHours;
      
      if (adjustedHours > 0) {
        allocations.push({
          topicId: area.topicId,
          topicName: area.topicName,
          hours: adjustedHours,
          priority: this.calculateTopicPriority(area, week, totalWeeks),
          mastery: {
            current: area.currentMastery,
            target: area.targetMastery,
            expected: this.predictMastery(area.currentMastery, adjustedHours)
          },
          materials: this.selectStudyMaterials(area, adjustedHours, weights),
          exercises: this.generateExercises(area, adjustedHours, phase)
        });
      }
    });
    
    return allocations;
  }

  /**
   * Schedule practice sessions for the week
   */
  private schedulePracticeSessions(
    topics: TopicAllocation[],
    phase: string,
    week: number,
    hoursPerWeek: number
  ): PracticeSession[] {
    const sessions: PracticeSession[] = [];
    
    // Determine session types based on phase
    const sessionDistribution = {
      foundation: { adaptive: 0.2, targeted: 0.6, mixed: 0.1, timed: 0.1 },
      building: { adaptive: 0.3, targeted: 0.4, mixed: 0.2, timed: 0.1 },
      reinforcement: { adaptive: 0.4, targeted: 0.2, mixed: 0.2, timed: 0.2 },
      peak: { adaptive: 0.3, targeted: 0.1, mixed: 0.3, timed: 0.3 },
      taper: { adaptive: 0.5, targeted: 0.1, mixed: 0.2, timed: 0.2 }
    };
    
    const distribution = sessionDistribution[phase];
    const practiceHours = hoursPerWeek * 0.6; // 60% practice
    
    // Adaptive sessions
    if (distribution.adaptive > 0) {
      sessions.push({
        id: this.generateId(),
        type: 'adaptive',
        duration: practiceHours * distribution.adaptive * 60, // minutes
        topic: 'mixed',
        difficulty: 'adaptive',
        questionCount: Math.floor(practiceHours * distribution.adaptive * 40), // 40 q/hour
        targetAccuracy: 0.75 + week * 0.01,
        focus: topics.slice(0, 3).map(t => t.topicName)
      });
    }
    
    // Targeted sessions
    topics.forEach(topic => {
      if (topic.priority > 0.5) {
        sessions.push({
          id: this.generateId(),
          type: 'targeted',
          duration: topic.hours * 0.4 * 60,
          topic: topic.topicName,
          difficulty: this.selectDifficulty(topic.mastery.current),
          questionCount: Math.floor(topic.hours * 0.4 * 35),
          targetAccuracy: 0.7 + topic.mastery.current * 0.2,
          focus: [topic.topicName]
        });
      }
    });
    
    // Timed practice
    if (distribution.timed > 0 && (phase === 'peak' || phase === 'reinforcement')) {
      sessions.push({
        id: this.generateId(),
        type: 'timed',
        duration: practiceHours * distribution.timed * 60,
        topic: 'mixed',
        difficulty: 'medium',
        questionCount: Math.floor(practiceHours * distribution.timed * 45), // Faster pace
        targetAccuracy: 0.7,
        focus: ['time management', 'pacing']
      });
    }
    
    return sessions;
  }

  /**
   * Schedule mock exams
   */
  private scheduleMockExams(
    week: number,
    totalWeeks: number,
    phase: string,
    examType: string
  ): MockExam[] {
    const exams: MockExam[] = [];
    
    // Diagnostic exam in first week
    if (week === 1) {
      exams.push({
        id: this.generateId(),
        date: moment().add(week, 'weeks').subtract(1, 'day').toDate(),
        type: 'diagnostic',
        expectedScore: 0, // Baseline
        focusAreas: [],
        reviewTime: 120
      });
    }
    
    // Section exams during building phase
    if (phase === 'building' && week % 2 === 0) {
      exams.push({
        id: this.generateId(),
        date: moment().add(week, 'weeks').subtract(2, 'days').toDate(),
        type: 'section',
        expectedScore: 0, // Calculate based on progress
        focusAreas: ['weak areas'],
        reviewTime: 60
      });
    }
    
    // Full exams during peak phase
    if (phase === 'peak' || (phase === 'reinforcement' && week % 2 === 0)) {
      exams.push({
        id: this.generateId(),
        date: moment().add(week, 'weeks').subtract(2, 'days').toDate(),
        type: 'full',
        expectedScore: 0, // Calculate based on progress
        focusAreas: [],
        reviewTime: 180
      });
    }
    
    // Final mock exam
    if (week === totalWeeks - 1) {
      exams.push({
        id: this.generateId(),
        date: moment().add(week, 'weeks').subtract(3, 'days').toDate(),
        type: 'full',
        expectedScore: 0, // Target score
        focusAreas: ['final review'],
        reviewTime: 240
      });
    }
    
    return exams;
  }

  /**
   * Generate milestones
   */
  private generateMilestones(
    weeklyPlans: WeeklyPlan[],
    targetScore: number,
    currentScore: number
  ): Milestone[] {
    const milestones: Milestone[] = [];
    const scoreGap = targetScore - currentScore;
    
    // Weekly consistency milestone
    milestones.push({
      id: this.generateId(),
      weekNumber: 1,
      type: 'consistency',
      target: { daysPerWeek: 5, hoursPerWeek: weeklyPlans[0].totalHours },
      importance: 'critical',
      reward: '🔥 Study Streak Started!'
    });
    
    // Score improvement milestones
    [0.25, 0.5, 0.75, 1.0].forEach(progress => {
      const week = Math.floor(weeklyPlans.length * progress);
      if (week > 0) {
        milestones.push({
          id: this.generateId(),
          weekNumber: week,
          type: 'score',
          target: currentScore + scoreGap * progress,
          importance: progress === 1.0 ? 'critical' : 'important',
          reward: `🎯 ${Math.round(progress * 100)}% to target!`
        });
      }
    });
    
    // Topic mastery milestones
    weeklyPlans.forEach((plan, index) => {
      const majorTopics = plan.topics.filter(t => t.priority > 0.7);
      if (majorTopics.length > 0) {
        milestones.push({
          id: this.generateId(),
          weekNumber: index + 1,
          type: 'mastery',
          target: { topics: majorTopics.map(t => ({ name: t.topicName, mastery: t.mastery.target })) },
          importance: 'nice-to-have'
        });
      }
    });
    
    return milestones;
  }

  /**
   * Identify focus areas based on gaps
   */
  private identifyFocusAreas(
    topicMastery: Map<string, number>,
    targetScore: number,
    currentScore: number
  ): FocusArea[] {
    const areas: FocusArea[] = [];
    const scoreGap = targetScore - currentScore;
    
    topicMastery.forEach((mastery, topicId) => {
      const topic = this.getTopicInfo(topicId);
      const targetMastery = this.calculateTargetMastery(mastery, scoreGap);
      const gap = targetMastery - mastery;
      
      if (gap > 0.1) {
        areas.push({
          topicId,
          topicName: topic.name,
          currentMastery: mastery,
          targetMastery,
          gapAnalysis: this.analyzeGap(topic, mastery, targetMastery),
          improvementPotential: this.calculatePotential(mastery, targetMastery, topic),
          timeRequired: this.estimateTimeRequired(mastery, targetMastery, topic),
          strategy: this.selectStrategy(mastery, targetMastery)
        });
      }
    });
    
    // Sort by improvement potential
    return areas.sort((a, b) => b.improvementPotential - a.improvementPotential);
  }

  /**
   * Predict outcome based on plan
   */
  private predictOutcome(
    performanceData: any,
    weeklyPlans: WeeklyPlan[],
    focusAreas: FocusArea[]
  ): Outcome {
    // Monte Carlo simulation for outcome prediction
    const simulations = 1000;
    const results: number[] = [];
    
    for (let i = 0; i < simulations; i++) {
      let score = performanceData.currentScore;
      
      weeklyPlans.forEach(week => {
        week.topics.forEach(topic => {
          const improvement = this.simulateImprovement(
            topic.mastery.current,
            topic.hours,
            Math.random() // Add randomness
          );
          score += improvement;
        });
      });
      
      results.push(score);
    }
    
    results.sort((a, b) => a - b);
    
    return {
      predictedScore: results[Math.floor(simulations * 0.5)], // Median
      confidence: this.calculateConfidence(results),
      probabilityRange: {
        min: results[Math.floor(simulations * 0.1)],
        median: results[Math.floor(simulations * 0.5)],
        max: results[Math.floor(simulations * 0.9)]
      },
      strengths: this.identifyStrengths(focusAreas),
      risks: this.identifyRisks(weeklyPlans, focusAreas)
    };
  }

  // Helper methods
  private calculateWeeksUntilExam(examDate: Date): number {
    return Math.ceil(moment(examDate).diff(moment(), 'weeks', true));
  }

  private generatePlanId(): string {
    return `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateTopicPriority(area: FocusArea, week: number, totalWeeks: number): number {
    const timeUrgency = 1 - (week / totalWeeks);
    const masteryGap = area.targetMastery - area.currentMastery;
    const potential = area.improvementPotential;
    
    return (timeUrgency * 0.3 + masteryGap * 0.4 + potential * 0.3);
  }

  private selectDifficulty(mastery: number): string {
    if (mastery < 0.4) return 'easy';
    if (mastery < 0.7) return 'medium';
    return 'hard';
  }

  private predictMastery(current: number, hours: number): number {
    // Learning curve model
    const learningRate = 0.05;
    const maxMastery = 0.95;
    const improvement = (maxMastery - current) * (1 - Math.exp(-learningRate * hours));
    return Math.min(maxMastery, current + improvement);
  }

  private selectStudyMaterials(area: FocusArea, hours: number, weights: any): StudyMaterial[] {
    // Select appropriate materials based on time and weights
    return [];
  }

  private generateExercises(area: FocusArea, hours: number, phase: string): Exercise[] {
    // Generate practice exercises
    return [];
  }

  private setWeeklyGoals(topics: TopicAllocation[], phase: string, week: number, expectedScore: number): string[] {
    const goals: string[] = [];
    
    // Score goal
    goals.push(`Reach score of ${Math.round(expectedScore)}`);
    
    // Topic goals
    topics.slice(0, 3).forEach(topic => {
      goals.push(`Master ${topic.topicName}: ${Math.round(topic.mastery.expected * 100)}%`);
    });
    
    // Phase-specific goals
    if (phase === 'foundation') {
      goals.push('Complete all foundational concepts');
    } else if (phase === 'peak') {
      goals.push('Maintain peak performance');
    }
    
    return goals;
  }

  private planAdaptiveAdjustments(
    weeklyPlans: WeeklyPlan[],
    focusAreas: FocusArea[],
    performanceData: any
  ): Adjustment[] {
    // Plan for potential adjustments
    return [];
  }

  private calculateConfidenceScore(outcome: Outcome, plans: WeeklyPlan[]): number {
    const rangeWidth = outcome.probabilityRange.max - outcome.probabilityRange.min;
    const median = outcome.probabilityRange.median;
    const target = plans[plans.length - 1].expectedProgress;
    
    // Confidence based on range and distance to target
    const rangeFactor = 1 - (rangeWidth / 50); // Narrower range = higher confidence
    const distanceFactor = 1 - Math.abs(median - target) / target;
    
    return (rangeFactor * 0.5 + distanceFactor * 0.5);
  }

  private simulateImprovement(currentMastery: number, hours: number, randomFactor: number): number {
    const baseImprovement = hours * 0.5; // 0.5 points per hour
    const masteryBonus = (1 - currentMastery) * 2; // Easier to improve at lower mastery
    const variance = (randomFactor - 0.5) * 2; // ±2 points
    
    return baseImprovement * masteryBonus + variance;
  }

  private calculateConfidence(results: number[]): number {
    const mean = results.reduce((a, b) => a + b, 0) / results.length;
    const variance = results.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / results.length;
    const stdDev = Math.sqrt(variance);
    
    // Lower variance = higher confidence
    return Math.max(0, 1 - stdDev / 10);
  }

  private identifyStrengths(focusAreas: FocusArea[]): string[] {
    return focusAreas
      .filter(area => area.currentMastery > 0.7)
      .map(area => area.topicName);
  }

  private identifyRisks(weeklyPlans: WeeklyPlan[], focusAreas: FocusArea[]): string[] {
    const risks: string[] = [];
    
    // Time risk
    if (weeklyPlans.length < 8) {
      risks.push('Limited preparation time');
    }
    
    // Mastery gaps
    const majorGaps = focusAreas.filter(a => a.targetMastery - a.currentMastery > 0.4);
    if (majorGaps.length > 0) {
      risks.push(`Major gaps in: ${majorGaps.map(g => g.topicName).join(', ')}`);
    }
    
    return risks;
  }

  private async getUserProfile(userId: string): Promise<any> {
    // Fetch from database
    return {};
  }

  private async getPerformanceData(userId: string): Promise<any> {
    // Fetch from database
    return { currentScore: 150 };
  }

  private async getTopicMastery(userId: string, examType: string): Promise<Map<string, number>> {
    // Fetch from database
    return new Map();
  }

  private getTopicInfo(topicId: string): any {
    // Get topic information
    return { name: 'Topic', weight: 1 };
  }

  private calculateTargetMastery(current: number, scoreGap: number): number {
    // Calculate required mastery level
    return Math.min(0.95, current + scoreGap / 100);
  }

  private analyzeGap(topic: any, current: number, target: number): any {
    return {
      conceptualGaps: [],
      skillGaps: [],
      practiceNeeded: (target - current) * 100
    };
  }

  private calculatePotential(current: number, target: number, topic: any): number {
    // Score improvement potential
    return (target - current) * topic.weight;
  }

  private estimateTimeRequired(current: number, target: number, topic: any): number {
    // Hours needed
    return (target - current) * 50;
  }

  private selectStrategy(current: number, target: number): string {
    const gap = target - current;
    if (gap > 0.4) return 'intensive';
    if (gap > 0.2) return 'focused';
    return 'maintenance';
  }

  private async savePlan(plan: StudyPlan): Promise<void> {
    // Save to database
  }
}

interface StudyPreferences {
  studyStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  sessionLength: 'short' | 'medium' | 'long'; // 25, 50, 90 minutes
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'flexible';
  difficulty: 'challenging' | 'balanced' | 'comfortable';
}
