import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto, UpdateItemDto, ItemResponseDto, ItemListDto } from './dto/items.dto';

// Mock data for demonstration - will be replaced with actual database queries
const mockItems: ItemResponseDto[] = [
  {
    id: '60000000-0000-0000-0000-000000000001',
    orgId: '00000000-0000-0000-0000-000000000001',
    authorId: '10000000-0000-0000-0000-000000000002',
    type: 'clinical_vignette' as any,
    difficultyLevel: 'medium' as any,
    content: {
      stem: 'A 45-year-old man presents to the emergency department with sudden onset chest pain radiating to his left arm. He is diaphoretic and anxious. ECG shows ST-segment elevation in leads II, III, and aVF. Which coronary artery is most likely occluded?',
      options: [
        { id: 'a', text: 'Left anterior descending artery', isCorrect: false },
        { id: 'b', text: 'Left circumflex artery', isCorrect: false },
        { id: 'c', text: 'Right coronary artery', isCorrect: true },
        { id: 'd', text: 'Left main coronary artery', isCorrect: false },
        { id: 'e', text: 'Posterior descending artery', isCorrect: false },
      ],
      correctAnswers: ['c'],
      explanation: 'ST-elevation in inferior leads (II, III, aVF) indicates an inferior wall myocardial infarction, which is typically supplied by the right coronary artery in 80% of individuals (right-dominant circulation).',
      references: ['Harrison\'s Principles of Internal Medicine, Chapter 295'],
    },
    tags: ['cardiology', 'ecg', 'myocardial_infarction', 'anatomy'],
    learningObjectives: ['Identify ECG patterns of MI', 'Understand coronary artery anatomy'],
    blueprint: 'Cardiovascular System',
    difficulty: 0.45,
    discrimination: 1.2,
    guessing: 0.25,
    timesUsed: 150,
    timesCorrect: 95,
    averageTimeSeconds: 180,
    pointBiserial: 0.42,
    isActive: true,
    isReviewed: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-15'),
  },
];

@Injectable()
export class ItemsService {
  async findAll(filters: {
    page: number;
    limit: number;
    type?: string;
    difficulty?: string;
    tags?: string[];
    search?: string;
    isReviewed?: boolean;
  }): Promise<ItemListDto> {
    // In real implementation, this would query the database
    // For now, returning mock data

    let filteredItems = [...mockItems];

    // Apply filters
    if (filters.type) {
      filteredItems = filteredItems.filter(item => item.type === filters.type);
    }

    if (filters.difficulty) {
      filteredItems = filteredItems.filter(item => item.difficultyLevel === filters.difficulty);
    }

    if (filters.tags && filters.tags.length > 0) {
      filteredItems = filteredItems.filter(item =>
        filters.tags.some(tag => item.tags.includes(tag))
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredItems = filteredItems.filter(item =>
        item.content.stem.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filters.isReviewed !== undefined) {
      filteredItems = filteredItems.filter(item => item.isReviewed === filters.isReviewed);
    }

    // Pagination
    const total = filteredItems.length;
    const start = (filters.page - 1) * filters.limit;
    const paginatedItems = filteredItems.slice(start, start + filters.limit);

    return {
      items: paginatedItems,
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    };
  }

  async findOne(id: string): Promise<ItemResponseDto> {
    const item = mockItems.find(item => item.id === id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  async create(createItemDto: CreateItemDto): Promise<ItemResponseDto> {
    // In real implementation, save to database
    const newItem: ItemResponseDto = {
      id: this.generateUUID(),
      ...createItemDto,
      authorId: createItemDto.authorId || 'system',
      blueprint: createItemDto.blueprint || '',
      difficulty: 0.0,
      discrimination: 1.0,
      guessing: 0.25,
      timesUsed: 0,
      timesCorrect: 0,
      averageTimeSeconds: 0,
      pointBiserial: 0,
      isActive: true,
      isReviewed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockItems.push(newItem);
    return newItem;
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<ItemResponseDto> {
    const itemIndex = mockItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    // In real implementation, update in database
    const updatedItem = {
      ...mockItems[itemIndex],
      ...updateItemDto,
      updatedAt: new Date(),
    };

    mockItems[itemIndex] = updatedItem;
    return updatedItem;
  }

  async remove(id: string): Promise<void> {
    const itemIndex = mockItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    // In real implementation, soft delete in database
    mockItems[itemIndex].isActive = false;
  }

  async markAsReviewed(id: string): Promise<ItemResponseDto> {
    const itemIndex = mockItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    mockItems[itemIndex].isReviewed = true;
    mockItems[itemIndex].updatedAt = new Date();
    return mockItems[itemIndex];
  }

  async getAnalytics(id: string) {
    const item = await this.findOne(id);

    // Calculate IRT-based metrics
    const pValue = item.timesUsed > 0 ? item.timesCorrect / item.timesUsed : 0;
    const qualityIndex = this.calculateQualityIndex(item);

    return {
      id: item.id,
      timesUsed: item.timesUsed,
      timesCorrect: item.timesCorrect,
      pValue,
      difficulty: item.difficulty,
      discrimination: item.discrimination,
      guessing: item.guessing,
      pointBiserial: item.pointBiserial,
      averageTimeSeconds: item.averageTimeSeconds,
      qualityIndex,
    };
  }

  async bulkCreate(items: CreateItemDto[]) {
    const createdItems = [];
    let failed = 0;

    for (const itemDto of items) {
      try {
        const created = await this.create(itemDto);
        createdItems.push(created);
      } catch (error) {
        failed++;
      }
    }

    return {
      created: createdItems.length,
      failed,
      items: createdItems,
    };
  }

  async getPopularTags(limit: number) {
    // Count tag frequencies
    const tagCounts = new Map<string, number>();

    for (const item of mockItems) {
      for (const tag of item.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    }

    // Sort by count and limit
    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  // Helper Methods

  private calculateQualityIndex(item: ItemResponseDto): number {
    // Combine multiple quality metrics
    const pValue = item.timesUsed > 0 ? item.timesCorrect / item.timesUsed : 0;
    const pValueScore = Math.abs(pValue - 0.7) < 0.2 ? 1 : 0.5;
    const discriminationScore = item.discrimination > 0.3 ? 1 : 0.5;
    const usageScore = Math.min(item.timesUsed / 100, 1);
    return (pValueScore + discriminationScore + usageScore) / 3;
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // ==================== Practice Session Methods ====================

  private practiceSessions = new Map<string, any>();

  async startPracticeSession(data: {
    mode: 'tutor' | 'timed' | 'test';
    item_count: number;
    category?: string;
    difficulty?: string;
    unused_only?: boolean;
  }) {
    // Filter items based on criteria
    let availableItems = [...mockItems];

    if (data.category) {
      availableItems = availableItems.filter(item =>
        item.tags.includes(data.category.toLowerCase())
      );
    }

    if (data.difficulty) {
      availableItems = availableItems.filter(item => item.difficultyLevel === data.difficulty);
    }

    // Shuffle and select requested number of items
    const shuffled = availableItems.sort(() => Math.random() - 0.5);
    const selectedItems = shuffled.slice(0, Math.min(data.item_count, shuffled.length));

    // Create session
    const sessionId = this.generateUUID();
    const session = {
      session_id: sessionId,
      mode: data.mode,
      items: selectedItems,
      started_at: new Date(),
      answers: [],
      completed: false,
    };

    this.practiceSessions.set(sessionId, session);

    // Return session data (without correct answers for test/timed mode)
    return {
      session_id: sessionId,
      mode: data.mode,
      items: selectedItems.map(item => ({
        id: item.id,
        stem: item.content.stem,
        options: item.content.options.map(opt => ({
          id: opt.id,
          text: opt.text,
        })),
        category: item.tags[0] || 'general',
      })),
      started_at: session.started_at,
    };
  }

  async submitAnswer(
    sessionId: string,
    answer: {
      item_id: string;
      answer: string;
      time_spent_seconds: number;
    },
  ) {
    const session = this.practiceSessions.get(sessionId);
    if (!session) {
      throw new NotFoundException(`Practice session ${sessionId} not found`);
    }

    const item = session.items.find((i: any) => i.id === answer.item_id);
    if (!item) {
      throw new NotFoundException(`Item ${answer.item_id} not found in this session`);
    }

    const isCorrect = item.content.correctAnswers.includes(answer.answer);
    const pointsEarned = isCorrect ? 1 : 0;

    // Store answer
    session.answers.push({
      item_id: answer.item_id,
      answer: answer.answer,
      is_correct: isCorrect,
      time_spent_seconds: answer.time_spent_seconds,
      points_earned: pointsEarned,
    });

    // Return feedback (tutor mode shows immediately, others wait)
    return {
      is_correct: isCorrect,
      correct_answer: item.content.correctAnswers[0],
      explanation: item.content.explanation,
      points_earned: pointsEarned,
    };
  }

  async submitPracticeSession(sessionId: string, answers: any[]) {
    const session = this.practiceSessions.get(sessionId);
    if (!session) {
      throw new NotFoundException(`Practice session ${sessionId} not found`);
    }

    // Process all answers if not already submitted
    if (answers && answers.length > 0) {
      for (const answer of answers) {
        const existing = session.answers.find(
          (a: any) => a.item_id === answer.item_id,
        );
        if (!existing) {
          await this.submitAnswer(sessionId, answer);
        }
      }
    }

    // Calculate results
    const totalQuestions = session.items.length;
    const correctAnswers = session.answers.filter((a: any) => a.is_correct).length;
    const percentage = (correctAnswers / totalQuestions) * 100;
    const totalTime = session.answers.reduce(
      (sum: number, a: any) => sum + a.time_spent_seconds,
      0,
    );

    // Mark session as completed
    session.completed = true;
    session.completed_at = new Date();
    session.score = percentage;
    session.correct_answers = correctAnswers;
    session.time_taken_seconds = totalTime;

    return {
      session_id: sessionId,
      score: percentage,
      percentage,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      time_taken_seconds: totalTime,
    };
  }

  async getPracticeSessionResults(sessionId: string) {
    const session = this.practiceSessions.get(sessionId);
    if (!session) {
      throw new NotFoundException(`Practice session ${sessionId} not found`);
    }

    if (!session.completed) {
      throw new NotFoundException(`Practice session ${sessionId} is not completed yet`);
    }

    // Return detailed results with explanations
    const detailedAnswers = session.answers.map((answer: any) => {
      const item = session.items.find((i: any) => i.id === answer.item_id);
      return {
        item_id: answer.item_id,
        question: item.content.stem,
        user_answer: answer.answer,
        correct_answer: item.content.correctAnswers[0],
        is_correct: answer.is_correct,
        explanation: item.content.explanation,
        time_spent_seconds: answer.time_spent_seconds,
        points_earned: answer.points_earned,
      };
    });

    return {
      session_id: sessionId,
      mode: session.mode,
      score: session.score,
      percentage: session.score,
      total_questions: session.items.length,
      correct_answers: session.correct_answers,
      time_taken_seconds: session.time_taken_seconds,
      answers: detailedAnswers,
      started_at: session.started_at,
      completed_at: session.completed_at,
    };
  }
}
