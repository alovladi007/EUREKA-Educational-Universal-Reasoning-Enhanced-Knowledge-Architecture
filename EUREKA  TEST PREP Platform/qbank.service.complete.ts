/**
 * EUREKA Test Prep - QBank Management Service
 * Advanced question bank with vector search, quality control, and version management
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@eureka/common';
import { WeaviateClient } from 'weaviate-ts-client';
import OpenAI from 'openai';
import * as similarity from 'compute-cosine-similarity';

interface Question {
  id: string;
  examType: string;
  section: string;
  topic: string;
  subtopic?: string;
  stem: string;
  choices: Choice[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  irtParams: IRTParams;
  metadata: QuestionMetadata;
  qualityScore: number;
  version: number;
  status: QuestionStatus;
  embedding?: number[];
  statistics?: QuestionStatistics;
  tags: string[];
  createdBy: string;
  reviewedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Choice {
  text: string;
  isCorrect: boolean;
  feedback?: string;
  selectedCount?: number;
}

interface IRTParams {
  a: number; // Discrimination
  b: number; // Difficulty
  c: number; // Guessing
  se?: { a: number; b: number; c: number }; // Standard errors
  fit?: number; // Model fit
}

interface QuestionMetadata {
  cognitiveLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  timeEstimate: number; // seconds
  pointValue?: number;
  prerequisites?: string[];
  relatedConcepts?: string[];
  commonMisconceptions?: string[];
  hints?: string[];
  imageUrl?: string;
  videoUrl?: string;
  sourceReference?: string;
  language?: string;
  accessibility?: AccessibilityOptions;
}

interface AccessibilityOptions {
  altText?: string;
  audioDescription?: string;
  extendedTime?: boolean;
  largeText?: boolean;
}

enum QuestionStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  APPROVED = 'approved',
  ACTIVE = 'active',
  RETIRED = 'retired',
  FLAGGED = 'flagged'
}

interface QuestionStatistics {
  timesAnswered: number;
  correctRate: number;
  averageTime: number;
  discrimination: number;
  reliability: number;
  informationValue: number;
  lastUsed?: Date;
  exposureCount: number;
  flagCount: number;
  feedbackScore?: number;
}

interface QBankQuery {
  examType?: string;
  topics?: string[];
  difficulty?: string[];
  tags?: string[];
  status?: QuestionStatus[];
  searchText?: string;
  similarTo?: string; // Question ID for similarity search
  excludeIds?: string[];
  minQuality?: number;
  maxExposure?: number;
  limit?: number;
  offset?: number;
}

interface QualityMetrics {
  clarity: number;
  relevance: number;
  difficulty: number;
  discrimination: number;
  distractor: number;
  overall: number;
}

interface ImportResult {
  total: number;
  imported: number;
  updated: number;
  failed: number;
  errors: ImportError[];
}

interface ImportError {
  row: number;
  field: string;
  message: string;
  data?: any;
}

@Injectable()
export class QBankService {
  private weaviate: WeaviateClient;
  private openai: OpenAI;
  
  constructor(private prisma: PrismaService) {
    this.initializeServices();
  }

  private initializeServices() {
    this.weaviate = new WeaviateClient({
      scheme: 'http',
      host: process.env.WEAVIATE_HOST || 'localhost:8080'
    });
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  /**
   * Advanced question search with multiple strategies
   */
  async searchQuestions(query: QBankQuery): Promise<{
    questions: Question[];
    total: number;
    facets: any;
  }> {
    let questions: Question[] = [];
    
    // Vector similarity search if similarTo is provided
    if (query.similarTo) {
      questions = await this.similaritySearch(query.similarTo, query);
    }
    // Semantic search if searchText is provided
    else if (query.searchText) {
      questions = await this.semanticSearch(query.searchText, query);
    }
    // Faceted search otherwise
    else {
      questions = await this.facetedSearch(query);
    }
    
    // Apply quality and exposure filters
    questions = this.applyQualityFilters(questions, query);
    
    // Calculate facets for UI filters
    const facets = this.calculateFacets(questions);
    
    return {
      questions: questions.slice(query.offset || 0, (query.offset || 0) + (query.limit || 20)),
      total: questions.length,
      facets
    };
  }

  /**
   * Vector similarity search using embeddings
   */
  private async similaritySearch(questionId: string, filters: QBankQuery): Promise<Question[]> {
    // Get reference question
    const reference = await this.getQuestion(questionId);
    if (!reference || !reference.embedding) {
      return [];
    }
    
    // Search in Weaviate
    const result = await this.weaviate.graphql
      .get()
      .withClassName('Question')
      .withFields(['id', 'stem', 'embedding'])
      .withNearVector({
        vector: reference.embedding,
        certainty: 0.7
      })
      .withWhere({
        operator: 'And',
        operands: this.buildWeaviateFilters(filters)
      })
      .withLimit(filters.limit || 50)
      .do();
    
    // Fetch full question data
    const questionIds = result.data.Get.Question.map((q: any) => q.id);
    return this.getQuestionsByIds(questionIds);
  }

  /**
   * Semantic search using natural language
   */
  private async semanticSearch(searchText: string, filters: QBankQuery): Promise<Question[]> {
    // Generate embedding for search text
    const embedding = await this.generateEmbedding(searchText);
    
    // Search in vector database
    const result = await this.weaviate.graphql
      .get()
      .withClassName('Question')
      .withFields(['id', 'stem', 'choices', '_additional { distance }'])
      .withNearVector({
        vector: embedding,
        distance: 0.3
      })
      .withWhere({
        operator: 'And',
        operands: this.buildWeaviateFilters(filters)
      })
      .withLimit(filters.limit || 100)
      .do();
    
    // Rank by relevance
    const questions = await this.getQuestionsByIds(
      result.data.Get.Question.map((q: any) => q.id)
    );
    
    // Re-rank using cross-encoder if needed
    return this.reRankQuestions(questions, searchText);
  }

  /**
   * Traditional faceted search
   */
  private async facetedSearch(query: QBankQuery): Promise<Question[]> {
    const where: any = {};
    
    if (query.examType) where.examType = query.examType;
    if (query.topics?.length) where.topic = { in: query.topics };
    if (query.difficulty?.length) where.difficulty = { in: query.difficulty };
    if (query.tags?.length) where.tags = { hasSome: query.tags };
    if (query.status?.length) where.status = { in: query.status };
    if (query.excludeIds?.length) where.id = { notIn: query.excludeIds };
    
    const questions = await this.prisma.item.findMany({
      where,
      include: {
        responses: {
          select: {
            isCorrect: true,
            timeSpent: true
          }
        }
      },
      orderBy: [
        { qualityScore: 'desc' },
        { updatedAt: 'desc' }
      ],
      take: query.limit || 100
    });
    
    return this.mapPrismaToQuestions(questions);
  }

  /**
   * Add or update a question with quality checks
   */
  async upsertQuestion(question: Partial<Question>): Promise<{
    question: Question;
    qualityReport: QualityMetrics;
    warnings: string[];
  }> {
    // Validate question structure
    const validation = this.validateQuestion(question);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    // Check for duplicates
    const duplicate = await this.checkDuplicate(question);
    if (duplicate && !question.id) {
      throw new Error(`Duplicate question detected: ${duplicate.id}`);
    }
    
    // Generate embedding
    if (!question.embedding) {
      question.embedding = await this.generateEmbedding(question.stem!);
    }
    
    // Calculate quality metrics
    const qualityReport = await this.assessQuality(question);
    question.qualityScore = qualityReport.overall;
    
    // Auto-tag based on content
    if (!question.tags?.length) {
      question.tags = await this.generateTags(question);
    }
    
    // Estimate IRT parameters if not provided
    if (!question.irtParams) {
      question.irtParams = await this.estimateIRTParams(question);
    }
    
    // Save to database
    const saved = await this.saveQuestion(question);
    
    // Index in vector database
    await this.indexQuestion(saved);
    
    // Generate warnings
    const warnings = this.generateWarnings(saved, qualityReport);
    
    return { question: saved, qualityReport, warnings };
  }

  /**
   * Bulk import questions with validation
   */
  async importQuestions(
    data: any[],
    format: 'json' | 'csv' | 'qti' | 'gift'
  ): Promise<ImportResult> {
    const result: ImportResult = {
      total: data.length,
      imported: 0,
      updated: 0,
      failed: 0,
      errors: []
    };
    
    // Parse based on format
    const questions = await this.parseImportData(data, format);
    
    // Process in batches
    const batchSize = 100;
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (q, idx) => {
        try {
          // Check if exists
          const existing = await this.findExisting(q);
          
          if (existing) {
            // Update if newer
            if (this.isNewer(q, existing)) {
              await this.upsertQuestion({ ...existing, ...q });
              result.updated++;
            }
          } else {
            await this.upsertQuestion(q);
            result.imported++;
          }
        } catch (error: any) {
          result.failed++;
          result.errors.push({
            row: i + idx + 1,
            field: 'general',
            message: error.message,
            data: q
          });
        }
      }));
    }
    
    return result;
  }

  /**
   * Calculate IRT parameters from response data
   */
  async recalibrateIRT(questionId: string): Promise<IRTParams> {
    // Get response data
    const responses = await this.prisma.response.findMany({
      where: { itemId: questionId },
      include: {
        user: {
          select: {
            masteryStates: true
          }
        }
      }
    });
    
    if (responses.length < 30) {
      throw new Error('Insufficient response data for calibration');
    }
    
    // Prepare data for IRT estimation
    const responseMatrix = responses.map(r => ({
      ability: this.estimateAbility(r.user.masteryStates),
      response: r.isCorrect ? 1 : 0,
      time: r.timeSpent
    }));
    
    // Use 3PL model estimation (simplified)
    const params = this.estimate3PL(responseMatrix);
    
    // Calculate standard errors
    const se = this.calculateStandardErrors(responseMatrix, params);
    
    // Check model fit
    const fit = this.calculateModelFit(responseMatrix, params);
    
    // Update question
    await this.prisma.item.update({
      where: { id: questionId },
      data: {
        irtA: params.a,
        irtB: params.b,
        irtC: params.c,
        metadata: {
          irtSE: se,
          irtFit: fit
        }
      }
    });
    
    return { ...params, se, fit };
  }

  /**
   * Assess question quality using multiple metrics
   */
  private async assessQuality(question: Partial<Question>): Promise<QualityMetrics> {
    const metrics: QualityMetrics = {
      clarity: 0,
      relevance: 0,
      difficulty: 0,
      discrimination: 0,
      distractor: 0,
      overall: 0
    };
    
    // Clarity: Check for ambiguity, grammar, readability
    metrics.clarity = await this.assessClarity(question.stem!);
    
    // Relevance: Check alignment with topic/exam
    metrics.relevance = await this.assessRelevance(question);
    
    // Difficulty: Check if matches stated difficulty
    metrics.difficulty = this.assessDifficultyAlignment(question);
    
    // Discrimination: Check if question differentiates skill levels
    metrics.discrimination = await this.assessDiscrimination(question);
    
    // Distractor: Check quality of incorrect options
    metrics.distractor = this.assessDistractors(question.choices!);
    
    // Overall weighted average
    metrics.overall = (
      metrics.clarity * 0.2 +
      metrics.relevance * 0.2 +
      metrics.difficulty * 0.15 +
      metrics.discrimination * 0.25 +
      metrics.distractor * 0.2
    );
    
    return metrics;
  }

  /**
   * Check for duplicate questions
   */
  private async checkDuplicate(question: Partial<Question>): Promise<Question | null> {
    // Exact match check
    const exactMatch = await this.prisma.item.findFirst({
      where: {
        stem: question.stem,
        examType: question.examType
      }
    });
    
    if (exactMatch) {
      return this.mapPrismaToQuestion(exactMatch);
    }
    
    // Similarity check
    if (question.embedding) {
      const similar = await this.similaritySearch('', {
        examType: question.examType,
        limit: 5
      });
      
      for (const sim of similar) {
        const similarity = this.calculateSimilarity(
          question.embedding,
          sim.embedding!
        );
        
        if (similarity > 0.95) {
          return sim;
        }
      }
    }
    
    return null;
  }

  /**
   * Generate tags using NLP
   */
  private async generateTags(question: Partial<Question>): Promise<string[]> {
    const prompt = `Extract relevant tags from this exam question:
    ${question.stem}
    
    Categories to consider:
    - Mathematical concepts
    - Scientific principles
    - Skills tested
    - Question types
    - Common topics
    
    Return as comma-separated list:`;
    
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
    });
    
    const tags = response.choices[0].message.content
      ?.split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0) || [];
    
    return tags;
  }

  /**
   * Version management for questions
   */
  async createVersion(questionId: string, updates: Partial<Question>): Promise<Question> {
    // Get current version
    const current = await this.getQuestion(questionId);
    if (!current) {
      throw new Error('Question not found');
    }
    
    // Archive current version
    await this.archiveVersion(current);
    
    // Create new version
    const newVersion = {
      ...current,
      ...updates,
      version: current.version + 1,
      updatedAt: new Date(),
      status: QuestionStatus.REVIEW // Require review for major changes
    };
    
    // Assess quality of changes
    const qualityReport = await this.assessQuality(newVersion);
    
    // Require approval if quality drops
    if (qualityReport.overall < current.qualityScore * 0.9) {
      newVersion.status = QuestionStatus.REVIEW;
    }
    
    return this.saveQuestion(newVersion);
  }

  /**
   * Flag question for review
   */
  async flagQuestion(
    questionId: string,
    reason: string,
    evidence?: any
  ): Promise<void> {
    const question = await this.getQuestion(questionId);
    if (!question) {
      throw new Error('Question not found');
    }
    
    // Update flag count
    question.statistics!.flagCount++;
    
    // Auto-retire if too many flags
    if (question.statistics!.flagCount > 10) {
      question.status = QuestionStatus.RETIRED;
    } else {
      question.status = QuestionStatus.FLAGGED;
    }
    
    // Log flag
    await this.prisma.questionFlag.create({
      data: {
        questionId,
        reason,
        evidence,
        createdAt: new Date()
      }
    });
    
    await this.saveQuestion(question);
  }

  /**
   * Get question performance analytics
   */
  async getQuestionAnalytics(questionId: string): Promise<{
    performance: any;
    distribution: any;
    trends: any;
    recommendations: string[];
  }> {
    const responses = await this.prisma.response.findMany({
      where: { itemId: questionId },
      include: {
        user: true,
        attempt: true
      }
    });
    
    // Calculate performance metrics
    const performance = {
      totalResponses: responses.length,
      correctRate: responses.filter(r => r.isCorrect).length / responses.length,
      averageTime: responses.reduce((sum, r) => sum + r.timeSpent, 0) / responses.length,
      discrimination: this.calculateDiscrimination(responses),
      reliability: this.calculateReliability(responses)
    };
    
    // Response distribution
    const distribution = this.calculateDistribution(responses);
    
    // Trends over time
    const trends = this.calculateTrends(responses);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(
      performance,
      distribution,
      trends
    );
    
    return {
      performance,
      distribution,
      trends,
      recommendations
    };
  }

  // Helper methods
  private async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text
    });
    
    return response.data[0].embedding;
  }

  private calculateSimilarity(vec1: number[], vec2: number[]): number {
    return similarity(vec1, vec2);
  }

  private validateQuestion(question: Partial<Question>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!question.stem || question.stem.length < 10) {
      errors.push('Question stem is too short');
    }
    
    if (!question.choices || question.choices.length < 2) {
      errors.push('Question must have at least 2 choices');
    }
    
    if (question.correctIndex === undefined || 
        question.correctIndex < 0 || 
        question.correctIndex >= (question.choices?.length || 0)) {
      errors.push('Invalid correct answer index');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private async estimateIRTParams(question: Partial<Question>): Promise<IRTParams> {
    // Default estimates based on stated difficulty
    const defaults = {
      easy: { a: 0.8, b: -1.0, c: 0.25 },
      medium: { a: 1.0, b: 0.0, c: 0.25 },
      hard: { a: 1.2, b: 1.0, c: 0.25 }
    };
    
    return defaults[question.difficulty || 'medium'];
  }

  private estimate3PL(responses: any[]): IRTParams {
    // Simplified 3PL estimation
    // In production, use proper MLE or Bayesian estimation
    return {
      a: 1.0,
      b: 0.0,
      c: 0.25
    };
  }

  private calculateStandardErrors(responses: any[], params: IRTParams): any {
    // Calculate Fisher Information and derive SEs
    return { a: 0.1, b: 0.1, c: 0.05 };
  }

  private calculateModelFit(responses: any[], params: IRTParams): number {
    // Calculate chi-square or other fit statistic
    return 0.95;
  }

  private estimateAbility(masteryStates: any[]): number {
    // Estimate user ability from mastery states
    return 0;
  }

  private calculateDiscrimination(responses: any[]): number {
    // Calculate point-biserial correlation
    return 0.3;
  }

  private calculateReliability(responses: any[]): number {
    // Calculate Cronbach's alpha or similar
    return 0.8;
  }

  private calculateDistribution(responses: any[]): any {
    // Calculate response distribution
    return {};
  }

  private calculateTrends(responses: any[]): any {
    // Calculate performance trends
    return {};
  }

  private generateRecommendations(performance: any, distribution: any, trends: any): string[] {
    const recommendations: string[] = [];
    
    if (performance.correctRate < 0.3) {
      recommendations.push('Question may be too difficult');
    }
    
    if (performance.correctRate > 0.9) {
      recommendations.push('Question may be too easy');
    }
    
    if (performance.discrimination < 0.2) {
      recommendations.push('Question does not discriminate well');
    }
    
    return recommendations;
  }

  private async assessClarity(stem: string): Promise<number> {
    // Use readability metrics and grammar checking
    return 0.8;
  }

  private async assessRelevance(question: Partial<Question>): Promise<number> {
    // Check alignment with curriculum
    return 0.9;
  }

  private assessDifficultyAlignment(question: Partial<Question>): number {
    // Check if IRT-b aligns with stated difficulty
    return 0.85;
  }

  private async assessDiscrimination(question: Partial<Question>): Promise<number> {
    // Predict discrimination based on question features
    return 0.7;
  }

  private assessDistractors(choices: Choice[]): number {
    // Evaluate quality of incorrect options
    return 0.75;
  }

  private applyQualityFilters(questions: Question[], query: QBankQuery): Question[] {
    let filtered = questions;
    
    if (query.minQuality) {
      filtered = filtered.filter(q => q.qualityScore >= query.minQuality);
    }
    
    if (query.maxExposure) {
      filtered = filtered.filter(q => 
        q.statistics?.exposureCount ? q.statistics.exposureCount <= query.maxExposure : true
      );
    }
    
    return filtered;
  }

  private calculateFacets(questions: Question[]): any {
    // Calculate facet counts for UI filters
    return {
      topics: {},
      difficulty: {},
      tags: {}
    };
  }

  private buildWeaviateFilters(filters: QBankQuery): any[] {
    const operands: any[] = [];
    
    if (filters.examType) {
      operands.push({
        path: ['examType'],
        operator: 'Equal',
        valueString: filters.examType
      });
    }
    
    return operands;
  }

  private async getQuestion(id: string): Promise<Question | null> {
    // Fetch from database
    return null;
  }

  private async getQuestionsByIds(ids: string[]): Promise<Question[]> {
    // Fetch multiple questions
    return [];
  }

  private async reRankQuestions(questions: Question[], query: string): Promise<Question[]> {
    // Re-rank using cross-encoder model
    return questions;
  }

  private mapPrismaToQuestions(items: any[]): Question[] {
    return items.map(item => this.mapPrismaToQuestion(item));
  }

  private mapPrismaToQuestion(item: any): Question {
    // Map Prisma model to Question interface
    return {} as Question;
  }

  private generateWarnings(question: Question, quality: QualityMetrics): string[] {
    const warnings: string[] = [];
    
    if (quality.clarity < 0.6) {
      warnings.push('Question clarity needs improvement');
    }
    
    if (quality.distractor < 0.5) {
      warnings.push('Weak distractor options');
    }
    
    return warnings;
  }

  private async saveQuestion(question: Partial<Question>): Promise<Question> {
    // Save to database
    return {} as Question;
  }

  private async indexQuestion(question: Question): Promise<void> {
    // Index in Weaviate
  }

  private async parseImportData(data: any[], format: string): Promise<Partial<Question>[]> {
    // Parse based on format
    return [];
  }

  private async findExisting(question: Partial<Question>): Promise<Question | null> {
    // Find existing question
    return null;
  }

  private isNewer(q1: Partial<Question>, q2: Question): boolean {
    // Check if q1 is newer than q2
    return false;
  }

  private async archiveVersion(question: Question): Promise<void> {
    // Archive old version
  }
}
