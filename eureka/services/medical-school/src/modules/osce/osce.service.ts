import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import {
  CreateStationDto,
  UpdateStationDto,
  StartExamSessionDto,
  SubmitStationScoreDto,
  SearchStationsDto,
  StationDetailDto,
  ExamSessionDto,
  StationResultDto,
  UserOSCEPerformanceDto,
  StationDomain,
  ChecklistItemType,
} from './dto/osce.dto';

// In-memory storage
const stations = new Map<string, any>();
const sessions = new Map<string, any>();

@Injectable()
export class OSCEService {
  constructor() {
    // Initialize with demo stations
    this.initializeDemoStations();
  }

  private initializeDemoStations() {
    if (stations.size === 0) {
      const demoStations = [
        {
          id: this.generateUUID(),
          title: 'Cardiovascular History Taking',
          scenario: `A 58-year-old male presents to the emergency department with chest pain that started 2 hours ago.

Your task: Obtain a focused cardiovascular history from this patient. You have 8 minutes.

**Patient Information:**
- Name: Mr. James Thompson
- Age: 58 years
- Occupation: Office manager

The patient will respond to your questions as instructed. Introduce yourself and begin the history.`,
          domain: StationDomain.HISTORY_TAKING,
          durationMinutes: 8,
          checklist: [
            { description: 'Introduces self and establishes rapport', type: ChecklistItemType.CRITICAL, points: 2 },
            { description: 'Asks about onset and duration of chest pain', type: ChecklistItemType.CRITICAL, points: 3 },
            { description: 'Characterizes pain quality (sharp, dull, pressure)', type: ChecklistItemType.CRITICAL, points: 3 },
            { description: 'Asks about radiation of pain', type: ChecklistItemType.IMPORTANT, points: 2 },
            { description: 'Inquires about aggravating/relieving factors', type: ChecklistItemType.IMPORTANT, points: 2 },
            { description: 'Assesses associated symptoms (SOB, diaphoresis, nausea)', type: ChecklistItemType.CRITICAL, points: 3 },
            { description: 'Reviews cardiac risk factors (HTN, DM, smoking, FHx)', type: ChecklistItemType.IMPORTANT, points: 3 },
            { description: 'Asks about previous cardiac history', type: ChecklistItemType.IMPORTANT, points: 2 },
            { description: 'Inquires about current medications', type: ChecklistItemType.IMPORTANT, points: 2 },
            { description: 'Assesses functional capacity/exercise tolerance', type: ChecklistItemType.OPTIONAL, points: 1 },
            { description: 'Shows empathy and addresses patient concerns', type: ChecklistItemType.IMPORTANT, points: 2 },
            { description: 'Summarizes findings back to patient', type: ChecklistItemType.OPTIONAL, points: 1 },
          ],
          learningObjectives: `• Perform a focused cardiovascular history
• Identify red flags for acute coronary syndrome
• Demonstrate effective communication skills
• Assess cardiac risk factors systematically`,
          spInstructions: `You are a 58-year-old office manager experiencing chest pain. You are worried but cooperative.

**Your story:**
- Pain started 2 hours ago while walking up stairs at work
- Describe it as "heavy pressure" in the center of your chest
- Pain radiates to left arm and jaw
- You feel short of breath and sweaty
- You have hypertension and diabetes
- Your father died of a heart attack at age 62
- You smoke 1 pack/day for 30 years
- Currently taking metformin and lisinopril

**Your demeanor:** Anxious but responsive to questions`,
          examinerNotes: `**Critical Actions:**
- Must ask about onset, quality, and associated symptoms
- Must assess cardiac risk factors

**Common Mistakes:**
- Jumping to investigations before complete history
- Missing associated symptoms
- Inadequate risk factor assessment

**Passing Standard:** 18/26 points (70%)`,
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: this.generateUUID(),
          title: 'Abdominal Examination',
          scenario: `A 35-year-old female presents with right lower quadrant abdominal pain for 24 hours.

Your task: Perform a focused abdominal examination. You have 6 minutes.

The standardized patient is positioned on the examination table. Introduce yourself and proceed with the examination.`,
          domain: StationDomain.PHYSICAL_EXAM,
          durationMinutes: 6,
          checklist: [
            { description: 'Introduces self and explains examination', type: ChecklistItemType.CRITICAL, points: 2 },
            { description: 'Washes hands or uses sanitizer', type: ChecklistItemType.CRITICAL, points: 2 },
            { description: 'Positions patient appropriately (supine, exposed)', type: ChecklistItemType.IMPORTANT, points: 1 },
            { description: 'Inspects abdomen for distension, scars, masses', type: ChecklistItemType.IMPORTANT, points: 2 },
            { description: 'Auscultates all four quadrants before palpation', type: ChecklistItemType.CRITICAL, points: 3 },
            { description: 'Performs light palpation of all quadrants', type: ChecklistItemType.CRITICAL, points: 2 },
            { description: 'Performs deep palpation of all quadrants', type: ChecklistItemType.IMPORTANT, points: 2 },
            { description: 'Assesses for rebound tenderness appropriately', type: ChecklistItemType.IMPORTANT, points: 2 },
            { description: 'Tests for McBurney\'s point tenderness', type: ChecklistItemType.IMPORTANT, points: 2 },
            { description: 'Performs psoas sign', type: ChecklistItemType.OPTIONAL, points: 1 },
            { description: 'Performs obturator sign', type: ChecklistItemType.OPTIONAL, points: 1 },
            { description: 'Assesses for peritoneal signs (guarding, rigidity)', type: ChecklistItemType.IMPORTANT, points: 2 },
            { description: 'Explains findings to patient', type: ChecklistItemType.IMPORTANT, points: 2 },
            { description: 'Demonstrates professional draping throughout', type: ChecklistItemType.CRITICAL, points: 2 },
          ],
          learningObjectives: `• Perform systematic abdominal examination
• Identify signs of acute appendicitis
• Maintain patient dignity and comfort
• Demonstrate proper examination sequence`,
          spInstructions: `You are a 35-year-old woman with appendicitis.

**Physical findings:**
- Tenderness in right lower quadrant (7/10 pain when pressed)
- Guarding in RLQ
- Positive rebound tenderness
- Low-grade fever feel

**Your behavior:** Cooperative but uncomfortable with deep palpation`,
          examinerNotes: `**Critical Actions:**
- Must auscultate BEFORE palpation
- Must maintain proper draping
- Must assess for rebound tenderness

**Passing Standard:** 17/26 points (65%)`,
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: this.generateUUID(),
          title: 'Breaking Bad News',
          scenario: `You are a third-year medical student working in the oncology clinic. You need to inform a 42-year-old woman that her recent biopsy shows breast cancer.

Your task: Break the news of the cancer diagnosis to the patient. You have 10 minutes.

The attending physician will observe your interaction.`,
          domain: StationDomain.COMMUNICATION,
          durationMinutes: 10,
          checklist: [
            { description: 'Introduces self and ensures privacy', type: ChecklistItemType.CRITICAL, points: 2 },
            { description: 'Assesses patient\'s understanding of situation', type: ChecklistItemType.CRITICAL, points: 3 },
            { description: 'Gives warning shot ("I have your results...")', type: ChecklistItemType.IMPORTANT, points: 2 },
            { description: 'Delivers diagnosis clearly and directly', type: ChecklistItemType.CRITICAL, points: 3 },
            { description: 'Allows silence for emotional processing', type: ChecklistItemType.IMPORTANT, points: 2 },
            { description: 'Acknowledges and validates emotions', type: ChecklistItemType.CRITICAL, points: 3 },
            { description: 'Explores patient\'s concerns and questions', type: ChecklistItemType.IMPORTANT, points: 2 },
            { description: 'Provides hope while being realistic', type: ChecklistItemType.IMPORTANT, points: 2 },
            { description: 'Outlines next steps in treatment', type: ChecklistItemType.IMPORTANT, points: 2 },
            { description: 'Offers support resources', type: ChecklistItemType.IMPORTANT, points: 2 },
            { description: 'Checks for questions', type: ChecklistItemType.IMPORTANT, points: 1 },
            { description: 'Arranges follow-up appointment', type: ChecklistItemType.IMPORTANT, points: 2 },
            { description: 'Maintains appropriate eye contact and body language', type: ChecklistItemType.OPTIONAL, points: 1 },
            { description: 'Avoids medical jargon', type: ChecklistItemType.IMPORTANT, points: 1 },
          ],
          learningObjectives: `• Apply SPIKES protocol for breaking bad news
• Demonstrate empathy and emotional support
• Provide clear information while maintaining hope
• Address patient concerns effectively`,
          spInstructions: `You are Sarah, a 42-year-old marketing executive who had a breast biopsy 5 days ago.

**Your situation:**
- You found a lump 3 weeks ago
- You're worried but trying to stay positive
- You have two children (ages 8 and 10)
- Your mother died of breast cancer at age 55

**Your emotional response:**
- Initial shock and tears when diagnosis is delivered
- Ask: "Am I going to die?"
- Ask: "How will I tell my children?"
- Become more composed as conversation progresses

**Your hopes:** Want to know about treatment options and prognosis`,
          examinerNotes: `**Critical Actions:**
- Must assess baseline understanding
- Must deliver diagnosis clearly
- Must acknowledge emotions

**Communication Skills Focus:**
- Empathy and active listening
- Appropriate pacing
- Non-verbal communication

**Passing Standard:** 18/28 points (65%)`,
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      demoStations.forEach((station) => {
        stations.set(station.id, station);
      });
    }
  }

  // ==================== Station Management ====================

  async createStation(createDto: CreateStationDto): Promise<StationDetailDto> {
    const maxScore = createDto.checklist.reduce((sum, item) => sum + item.points, 0);

    const station = {
      id: this.generateUUID(),
      ...createDto,
      maxScore,
      isPublished: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    stations.set(station.id, station);
    return this.mapToStationDetail(station);
  }

  async findAllStations(searchDto: SearchStationsDto): Promise<StationDetailDto[]> {
    let results = Array.from(stations.values()).filter((s) => s.isPublished);

    if (searchDto.domain) {
      results = results.filter((s) => s.domain === searchDto.domain);
    }

    if (searchDto.limit) {
      results = results.slice(0, searchDto.limit);
    }

    return results.map((s) => this.mapToStationDetail(s));
  }

  async findStationById(id: string): Promise<StationDetailDto> {
    const station = stations.get(id);
    if (!station) {
      throw new NotFoundException('Station not found');
    }
    return this.mapToStationDetail(station);
  }

  async updateStation(id: string, updateDto: UpdateStationDto): Promise<StationDetailDto> {
    const station = stations.get(id);
    if (!station) {
      throw new NotFoundException('Station not found');
    }

    Object.assign(station, updateDto, { updatedAt: new Date() });

    if (updateDto.checklist) {
      station.maxScore = updateDto.checklist.reduce((sum, item) => sum + item.points, 0);
    }

    return this.mapToStationDetail(station);
  }

  async deleteStation(id: string): Promise<void> {
    const station = stations.get(id);
    if (!station) {
      throw new NotFoundException('Station not found');
    }
    stations.delete(id);
  }

  // ==================== Exam Session Management ====================

  async startExamSession(userId: string, startDto: StartExamSessionDto): Promise<ExamSessionDto> {
    const station = stations.get(startDto.stationId);
    if (!station) {
      throw new NotFoundException('Station not found');
    }

    const session = {
      id: this.generateUUID(),
      stationId: startDto.stationId,
      userId,
      startTime: new Date(),
      endTime: null,
      status: 'in_progress',
      score: null,
      maxScore: station.maxScore,
      checklistResponses: [],
      examinerFeedback: null,
      communicationScore: null,
      professionalismScore: null,
    };

    sessions.set(session.id, session);
    return this.mapToExamSession(session);
  }

  async getSessionById(sessionId: string, userId: string): Promise<any> {
    const session = sessions.get(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    if (session.userId !== userId) {
      throw new BadRequestException('Unauthorized access to session');
    }

    const station = stations.get(session.stationId);
    return {
      ...this.mapToExamSession(session),
      station: this.mapToStationDetail(station),
    };
  }

  async submitStationScore(
    sessionId: string,
    userId: string,
    submitDto: SubmitStationScoreDto,
  ): Promise<StationResultDto> {
    const session = sessions.get(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    if (session.userId !== userId) {
      throw new BadRequestException('Unauthorized access to session');
    }
    if (session.status === 'completed') {
      throw new BadRequestException('Session already completed');
    }

    const station = stations.get(session.stationId);
    const endTime = new Date();
    const completionTime = Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000);

    // Calculate score based on checklist responses
    const scoreData = this.calculateScore(station.checklist, submitDto.checklistResponses);

    // Update session
    session.endTime = endTime;
    session.status = 'completed';
    session.score = scoreData.totalScore;
    session.checklistResponses = submitDto.checklistResponses;
    session.examinerFeedback = submitDto.examinerFeedback;
    session.communicationScore = submitDto.communicationScore;
    session.professionalismScore = submitDto.professionalismScore;
    session.scoreBreakdown = scoreData;
    session.completionTime = completionTime;

    // Generate feedback
    const feedback = this.generateFeedback(scoreData, station);

    return {
      sessionId: session.id,
      stationTitle: station.title,
      domain: station.domain,
      score: scoreData.totalScore,
      maxScore: station.maxScore,
      percentage: Math.round((scoreData.totalScore / station.maxScore) * 100),
      criticalItemsCompleted: scoreData.criticalCompleted,
      criticalItemsTotal: scoreData.criticalTotal,
      importantItemsCompleted: scoreData.importantCompleted,
      importantItemsTotal: scoreData.importantTotal,
      optionalItemsCompleted: scoreData.optionalCompleted,
      optionalItemsTotal: scoreData.optionalTotal,
      communicationScore: submitDto.communicationScore,
      professionalismScore: submitDto.professionalismScore,
      examinerFeedback: submitDto.examinerFeedback,
      strengths: feedback.strengths,
      areasForImprovement: feedback.areasForImprovement,
      completionTime,
    };
  }

  async getUserSessions(userId: string): Promise<ExamSessionDto[]> {
    const userSessions = Array.from(sessions.values())
      .filter((s) => s.userId === userId)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

    return userSessions.map((s) => this.mapToExamSession(s));
  }

  async getUserPerformance(userId: string): Promise<UserOSCEPerformanceDto> {
    const userSessions = Array.from(sessions.values()).filter(
      (s) => s.userId === userId && s.status === 'completed',
    );

    if (userSessions.length === 0) {
      return {
        totalStationsCompleted: 0,
        averageScore: 0,
        domainBreakdown: {},
        recentSessions: [],
        strengthDomains: [],
        improvementDomains: [],
      };
    }

    // Calculate statistics
    const totalScore = userSessions.reduce((sum, s) => sum + s.score, 0);
    const averageScore = Math.round((totalScore / userSessions.length / userSessions[0].maxScore) * 100);

    // Domain breakdown
    const domainBreakdown: Record<string, { completed: number; avgScore: number }> = {};
    userSessions.forEach((session) => {
      const station = stations.get(session.stationId);
      if (!domainBreakdown[station.domain]) {
        domainBreakdown[station.domain] = { completed: 0, avgScore: 0 };
      }
      domainBreakdown[station.domain].completed++;
      domainBreakdown[station.domain].avgScore += (session.score / session.maxScore) * 100;
    });

    Object.keys(domainBreakdown).forEach((domain) => {
      domainBreakdown[domain].avgScore = Math.round(
        domainBreakdown[domain].avgScore / domainBreakdown[domain].completed,
      );
    });

    // Identify strengths and areas for improvement
    const sortedDomains = Object.entries(domainBreakdown).sort((a, b) => b[1].avgScore - a[1].avgScore);
    const strengthDomains = sortedDomains.slice(0, 2).map(([domain]) => this.formatDomain(domain));
    const improvementDomains = sortedDomains
      .slice(-2)
      .reverse()
      .map(([domain]) => this.formatDomain(domain));

    return {
      totalStationsCompleted: userSessions.length,
      averageScore,
      domainBreakdown,
      recentSessions: userSessions
        .slice(0, 5)
        .map((s) => this.mapToExamSession(s)),
      strengthDomains,
      improvementDomains,
    };
  }

  // ==================== Helper Methods ====================

  private calculateScore(checklist: any[], responses: any[]) {
    let totalScore = 0;
    let criticalCompleted = 0;
    let criticalTotal = 0;
    let importantCompleted = 0;
    let importantTotal = 0;
    let optionalCompleted = 0;
    let optionalTotal = 0;

    checklist.forEach((item) => {
      const response = responses.find((r) => r.itemDescription === item.description);
      const completed = response?.completed || false;

      if (item.type === ChecklistItemType.CRITICAL) {
        criticalTotal++;
        if (completed) {
          criticalCompleted++;
          totalScore += item.points;
        }
      } else if (item.type === ChecklistItemType.IMPORTANT) {
        importantTotal++;
        if (completed) {
          importantCompleted++;
          totalScore += item.points;
        }
      } else if (item.type === ChecklistItemType.OPTIONAL) {
        optionalTotal++;
        if (completed) {
          optionalCompleted++;
          totalScore += item.points;
        }
      }
    });

    return {
      totalScore,
      criticalCompleted,
      criticalTotal,
      importantCompleted,
      importantTotal,
      optionalCompleted,
      optionalTotal,
    };
  }

  private generateFeedback(scoreData: any, station: any) {
    const strengths: string[] = [];
    const areasForImprovement: string[] = [];

    const percentage = (scoreData.totalScore / station.maxScore) * 100;

    // Strengths
    if (scoreData.criticalCompleted === scoreData.criticalTotal) {
      strengths.push('Completed all critical actions successfully');
    }
    if (scoreData.importantCompleted / scoreData.importantTotal >= 0.8) {
      strengths.push('Strong performance on important checklist items');
    }
    if (percentage >= 85) {
      strengths.push('Excellent overall performance');
    }

    // Areas for improvement
    if (scoreData.criticalCompleted < scoreData.criticalTotal) {
      const missed = scoreData.criticalTotal - scoreData.criticalCompleted;
      areasForImprovement.push(`Missed ${missed} critical action(s) - review key clinical steps`);
    }
    if (scoreData.importantCompleted / scoreData.importantTotal < 0.7) {
      areasForImprovement.push('Focus on completing important checklist items');
    }
    if (percentage < 70) {
      areasForImprovement.push('Review station learning objectives and practice again');
    }

    if (strengths.length === 0) {
      strengths.push('Demonstrated clinical knowledge');
    }
    if (areasForImprovement.length === 0) {
      areasForImprovement.push('Continue to refine clinical skills through practice');
    }

    return { strengths, areasForImprovement };
  }

  private mapToStationDetail(station: any): StationDetailDto {
    return {
      id: station.id,
      title: station.title,
      scenario: station.scenario,
      domain: station.domain,
      durationMinutes: station.durationMinutes,
      checklist: station.checklist,
      maxScore: station.maxScore,
      learningObjectives: station.learningObjectives,
      createdAt: station.createdAt,
    };
  }

  private mapToExamSession(session: any): ExamSessionDto {
    return {
      id: session.id,
      stationId: session.stationId,
      userId: session.userId,
      startTime: session.startTime,
      endTime: session.endTime,
      status: session.status,
      score: session.score,
      maxScore: session.maxScore,
    };
  }

  private formatDomain(domain: string): string {
    return domain
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  async getDomainList(): Promise<string[]> {
    return Object.values(StationDomain);
  }

  async getStationsByDomain(): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};
    Array.from(stations.values())
      .filter((s) => s.isPublished)
      .forEach((station) => {
        counts[station.domain] = (counts[station.domain] || 0) + 1;
      });
    return counts;
  }
}
