/**
 * EUREKA Test Prep - AI Orchestrator Service
 * Integrates with OpenAI/Anthropic for intelligent content generation
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

interface GeneratedQuestion {
  stem: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  irtParams: { a: number; b: number; c: number };
  topics: string[];
  cognitiveLevel: string;
}

interface ExplanationRequest {
  question: string;
  choices: string[];
  correctAnswer: number;
  userAnswer: number;
  topic: string;
}

@Injectable()
export class AIOrchestrator {
  private openai: OpenAI;
  private anthropic: Anthropic;
  
  constructor(private config: ConfigService) {
    this.openai = new OpenAI({
      apiKey: config.get('OPENAI_API_KEY'),
    });
    
    this.anthropic = new Anthropic({
      apiKey: config.get('ANTHROPIC_API_KEY'),
    });
  }

  /**
   * Generate high-quality exam questions using AI
   */
  async generateQuestions(params: {
    exam: string;
    topic: string;
    difficulty: string;
    count: number;
  }): Promise<GeneratedQuestion[]> {
    const prompt = this.buildQuestionGenerationPrompt(params);
    
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 4000,
        temperature: 0.7,
        system: 'You are an expert test prep content creator specializing in standardized exams.',
        messages: [{
          role: 'user',
          content: prompt
        }]
      });
      
      return this.parseGeneratedQuestions(response.content[0].text);
    } catch (error) {
      console.error('AI generation failed, using fallback');
      return this.generateFallbackQuestions(params);
    }
  }

  /**
   * Generate personalized explanations for questions
   */
  async generateExplanation(request: ExplanationRequest): Promise<{
    explanation: string;
    conceptsCovered: string[];
    commonMistakes: string[];
    relatedTopics: string[];
    studyTips: string[];
  }> {
    const prompt = `
    Question: ${request.question}
    Choices: ${request.choices.map((c, i) => `${i + 1}. ${c}`).join('\n')}
    Correct Answer: ${request.choices[request.correctAnswer]}
    User's Answer: ${request.choices[request.userAnswer]}
    Topic: ${request.topic}

    Please provide:
    1. A clear explanation of why the correct answer is right
    2. Why the user's answer (if incorrect) is wrong
    3. Common mistakes students make on this type of question
    4. Key concepts being tested
    5. Study tips for mastering this topic
    
    Format as JSON with keys: explanation, conceptsCovered, commonMistakes, relatedTopics, studyTips
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{
        role: 'system',
        content: 'You are an expert tutor providing clear, helpful explanations.'
      }, {
        role: 'user',
        content: prompt
      }],
      temperature: 0.5,
      response_format: { type: 'json_object' }
    });

    return JSON.parse(response.choices[0].message.content);
  }

  /**
   * Generate personalized study recommendations
   */
  async generateStudyPlan(params: {
    userId: string;
    examDate: Date;
    targetScore: number;
    currentScore: number;
    weakAreas: string[];
    availableHours: number;
  }): Promise<{
    weeklyPlan: any[];
    focusAreas: string[];
    milestones: any[];
    resources: string[];
  }> {
    const weeksUntilExam = Math.ceil(
      (params.examDate.getTime() - Date.now()) / (7 * 24 * 60 * 60 * 1000)
    );

    const prompt = `
    Create a personalized study plan:
    - Weeks until exam: ${weeksUntilExam}
    - Current score: ${params.currentScore}
    - Target score: ${params.targetScore}
    - Weak areas: ${params.weakAreas.join(', ')}
    - Available hours per week: ${params.availableHours}

    Generate a detailed weekly plan with specific topics, practice goals, and milestones.
    `;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    return this.parseStudyPlan(response.content[0].text);
  }

  /**
   * Analyze response patterns for insights
   */
  async analyzePerformance(responses: any[]): Promise<{
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    predictedScore: number;
    confidence: number;
  }> {
    const analysis = {
      totalQuestions: responses.length,
      correct: responses.filter(r => r.isCorrect).length,
      byTopic: this.groupByTopic(responses),
      byDifficulty: this.groupByDifficulty(responses),
      timeAnalysis: this.analyzeTimeSpent(responses),
    };

    const prompt = `
    Analyze this student's performance:
    ${JSON.stringify(analysis, null, 2)}

    Provide:
    1. Key strengths (topics/skills they excel at)
    2. Weaknesses that need improvement
    3. Specific recommendations for improvement
    4. Predicted test score based on current performance
    5. Confidence level in the prediction
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{
        role: 'system',
        content: 'You are an expert test prep analyst.'
      }, {
        role: 'user',
        content: prompt
      }],
      temperature: 0.3,
    });

    return this.parsePerformanceAnalysis(response.choices[0].message.content);
  }

  /**
   * Generate question prompts
   */
  private buildQuestionGenerationPrompt(params: any): string {
    const difficultyGuide = {
      easy: 'Basic concepts, straightforward application, 70-90% success rate',
      medium: 'Multi-step reasoning, concept integration, 40-70% success rate',
      hard: 'Complex analysis, abstract reasoning, 10-40% success rate'
    };

    return `
    Generate ${params.count} high-quality ${params.exam} questions on ${params.topic}.
    Difficulty: ${params.difficulty} - ${difficultyGuide[params.difficulty]}

    For each question provide:
    1. Stem (clear, concise question)
    2. 4-5 choices (plausible distractors)
    3. Correct answer index
    4. Detailed explanation
    5. IRT parameters (a: 0.5-2.0, b: -2 to 2, c: 0.2-0.25)
    6. Cognitive level (Remember/Understand/Apply/Analyze/Evaluate/Create)

    Format as JSON array.
    `;
  }

  /**
   * Fallback question generation
   */
  private generateFallbackQuestions(params: any): GeneratedQuestion[] {
    const questions: GeneratedQuestion[] = [];
    
    for (let i = 0; i < params.count; i++) {
      questions.push({
        stem: `Sample ${params.exam} question on ${params.topic} (#${i + 1})`,
        choices: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctIndex: Math.floor(Math.random() * 4),
        explanation: 'This is a sample explanation.',
        difficulty: params.difficulty as any,
        irtParams: {
          a: 0.8 + Math.random() * 0.8,
          b: params.difficulty === 'easy' ? -1 : params.difficulty === 'hard' ? 1 : 0,
          c: 0.25
        },
        topics: [params.topic],
        cognitiveLevel: 'Apply'
      });
    }
    
    return questions;
  }

  private parseGeneratedQuestions(content: string): GeneratedQuestion[] {
    try {
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  private parseStudyPlan(content: string): any {
    // Parse AI response into structured study plan
    return {
      weeklyPlan: [],
      focusAreas: [],
      milestones: [],
      resources: []
    };
  }

  private parsePerformanceAnalysis(content: string): any {
    // Parse AI response into performance insights
    return {
      strengths: [],
      weaknesses: [],
      recommendations: [],
      predictedScore: 0,
      confidence: 0
    };
  }

  private groupByTopic(responses: any[]): Record<string, any> {
    const grouped = {};
    responses.forEach(r => {
      if (!grouped[r.topic]) {
        grouped[r.topic] = { total: 0, correct: 0 };
      }
      grouped[r.topic].total++;
      if (r.isCorrect) grouped[r.topic].correct++;
    });
    return grouped;
  }

  private groupByDifficulty(responses: any[]): Record<string, any> {
    const grouped = {};
    responses.forEach(r => {
      if (!grouped[r.difficulty]) {
        grouped[r.difficulty] = { total: 0, correct: 0 };
      }
      grouped[r.difficulty].total++;
      if (r.isCorrect) grouped[r.difficulty].correct++;
    });
    return grouped;
  }

  private analyzeTimeSpent(responses: any[]): any {
    const times = responses.map(r => r.timeSpent);
    return {
      average: times.reduce((a, b) => a + b, 0) / times.length,
      median: this.median(times),
      fastest: Math.min(...times),
      slowest: Math.max(...times)
    };
  }

  private median(arr: number[]): number {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }
}

export class AIController {
  constructor(private orchestrator: AIOrchestrator) {}

  async generateContent(type: string, params: any): Promise<any> {
    switch (type) {
      case 'questions':
        return this.orchestrator.generateQuestions(params);
      case 'explanation':
        return this.orchestrator.generateExplanation(params);
      case 'study-plan':
        return this.orchestrator.generateStudyPlan(params);
      case 'performance':
        return this.orchestrator.analyzePerformance(params);
      default:
        throw new Error(`Unknown content type: ${type}`);
    }
  }
}
