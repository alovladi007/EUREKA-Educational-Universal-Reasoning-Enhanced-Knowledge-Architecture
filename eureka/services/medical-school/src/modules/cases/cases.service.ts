import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, ILike } from 'typeorm';
import { ImportanceLevel } from '../../entities/case.entity';
import {
  SessionStatus,
  ActionLog,
  DiagnosisAttempt,
  ManagementPlan,
  ScoreBreakdown,
  ClinicalReasoningMetrics,
  DetailedFeedback,
} from '../../entities/case-session.entity';
import {
  CreateCaseDto,
  UpdateCaseDto,
  SearchCasesDto,
  StartCaseSessionDto,
  TakeActionDto,
  SubmitDiagnosisDto,
  SubmitManagementDto,
  CaseListDto,
  CaseDetailDto,
  SessionStateDto,
  SessionSummaryDto,
  CaseAnalyticsDto,
  UserPerformanceDto,
} from './dto/cases.dto';

// In-memory storage (replaces database)
const mockCasesStore = new Map<string, any>();
const mockSessionsStore = new Map<string, any>();

// Initialize with demo cases
if (mockCasesStore.size === 0) {
  const demoCase1 = {
    id: '70000000-0000-0000-0000-000000000001',
    orgId: '00000000-0000-0000-0000-000000000001',
    title: 'Acute Myocardial Infarction',
    description: 'A 55-year-old male presents with crushing chest pain radiating to the left arm',
    specialty: 'Cardiology',
    complexity: 'intermediate',
    patientAge: 55,
    patientSex: 'M',
    chiefComplaint: 'Chest pain radiating to left arm, diaphoresis, nausea',
    correctDiagnosis: 'ST-Elevation Myocardial Infarction (STEMI)',
    isPublished: true,
    isArchived: false,
    tags: ['cardiology', 'emergency', 'acs'],
    timesAttempted: 0,
    timesCompleted: 0,
    averageScore: 0,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    historySections: [
      {
        title: 'Present Illness',
        questions: [
          { id: 'h1', question: 'When did the chest pain start?', answer: '2 hours ago, sudden onset', cost: 1, importance: 'critical' },
          { id: 'h2', question: 'Character of pain?', answer: 'Crushing, severe (9/10)', cost: 1, importance: 'critical' },
          { id: 'h3', question: 'Radiation?', answer: 'Left arm and jaw', cost: 1, importance: 'critical' },
          { id: 'h4', question: 'Associated symptoms?', answer: 'Diaphoresis, nausea, shortness of breath', cost: 1, importance: 'helpful' },
        ],
      },
      {
        title: 'Past Medical History',
        questions: [
          { id: 'h5', question: 'Any cardiac history?', answer: 'Hypertension for 10 years, hyperlipidemia', cost: 1, importance: 'helpful' },
          { id: 'h6', question: 'Family history?', answer: 'Father died of MI at age 60', cost: 1, importance: 'helpful' },
          { id: 'h7', question: 'Smoking?', answer: 'Smokes 1 pack/day for 30 years', cost: 1, importance: 'helpful' },
        ],
      },
    ],
    physicalExam: [
      { id: 'e1', examination: 'Vital Signs', finding: 'BP 160/95, HR 110, RR 22, Temp 37°C, O2 Sat 93%', cost: 1, importance: 'critical' },
      { id: 'e2', examination: 'Cardiovascular', finding: 'Regular tachycardia, S4 gallop, no murmurs', cost: 2, importance: 'helpful' },
      { id: 'e3', examination: 'Respiratory', finding: 'Bilateral crackles at bases', cost: 2, importance: 'helpful' },
      { id: 'e4', examination: 'Extremities', finding: 'Cool, diaphoretic skin', cost: 1, importance: 'helpful' },
    ],
    diagnosticStudies: [
      { id: 'd1', name: 'ECG', type: 'diagnostic', result: 'ST elevation in leads II, III, aVF (inferior wall)', interpretation: 'Acute inferior STEMI', timeCost: 2, cost: 50, importance: 'critical' },
      { id: 'd2', name: 'Troponin', type: 'lab', result: '12.5 ng/mL (elevated)', interpretation: 'Significant myocardial injury', timeCost: 3, cost: 100, importance: 'critical' },
      { id: 'd3', name: 'CXR', type: 'imaging', result: 'Mild cardiomegaly, pulmonary congestion', interpretation: 'CHF present', timeCost: 3, cost: 200, importance: 'helpful' },
      { id: 'd4', name: 'CBC', type: 'lab', result: 'WBC 12, Hgb 14, Plt 250', interpretation: 'Mild leukocytosis', timeCost: 2, cost: 75, importance: 'unnecessary' },
    ],
    managementOptions: [
      { intervention: 'Aspirin 325mg', appropriateness: 'critical', rationale: 'Antiplatelet therapy essential' },
      { intervention: 'Oxygen therapy', appropriateness: 'critical', rationale: 'Support oxygenation' },
      { intervention: 'Morphine for pain', appropriateness: 'appropriate', rationale: 'Pain relief and anxiety reduction' },
      { intervention: 'Nitroglycerin', appropriateness: 'appropriate', rationale: 'Reduces cardiac workload' },
      { intervention: 'Emergency PCI/catheterization', appropriateness: 'critical', rationale: 'Definitive treatment for STEMI' },
      { intervention: 'Beta-blocker', appropriateness: 'appropriate', rationale: 'Reduces cardiac workload' },
      { intervention: 'Thrombolytic therapy', appropriateness: 'appropriate', rationale: 'If PCI not available within 90 min' },
      { intervention: 'Antibiotics', appropriateness: 'inappropriate', rationale: 'Not indicated for MI' },
    ],
  };

  const demoCase2 = {
    id: '70000000-0000-0000-0000-000000000002',
    orgId: '00000000-0000-0000-0000-000000000001',
    title: 'Diabetic Ketoacidosis',
    description: 'A 28-year-old female with Type 1 diabetes presents with confusion and fruity breath',
    specialty: 'Endocrinology',
    complexity: 'advanced',
    patientAge: 28,
    patientSex: 'F',
    chiefComplaint: 'Confusion, nausea, vomiting, polyuria',
    correctDiagnosis: 'Diabetic Ketoacidosis (DKA)',
    isPublished: true,
    isArchived: false,
    tags: ['endocrinology', 'emergency', 'diabetes'],
    timesAttempted: 0,
    timesCompleted: 0,
    averageScore: 0,
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-02'),
    historySections: [
      {
        title: 'Present Illness',
        questions: [
          { id: 'h1', question: 'Diabetes control?', answer: 'Type 1 DM, missed insulin doses for 2 days', cost: 1, importance: 'critical' },
          { id: 'h2', question: 'When did symptoms start?', answer: 'Progressive over 24 hours', cost: 1, importance: 'helpful' },
          { id: 'h3', question: 'Recent illness?', answer: 'Started with URI 3 days ago', cost: 1, importance: 'helpful' },
        ],
      },
    ],
    physicalExam: [
      { id: 'e1', examination: 'Vital Signs', finding: 'BP 95/60, HR 120, RR 32 (Kussmaul), Temp 37.5°C', cost: 1, importance: 'critical' },
      { id: 'e2', examination: 'Mental Status', finding: 'Lethargic, confused', cost: 1, importance: 'critical' },
      { id: 'e3', examination: 'Breath odor', finding: 'Fruity/ketotic breath', cost: 1, importance: 'critical' },
      { id: 'e4', examination: 'Skin', finding: 'Poor turgor, dry mucous membranes', cost: 1, importance: 'helpful' },
    ],
    diagnosticStudies: [
      { id: 'd1', name: 'Blood glucose', type: 'lab', result: '550 mg/dL', interpretation: 'Severe hyperglycemia', timeCost: 2, cost: 50, importance: 'critical' },
      { id: 'd2', name: 'Serum ketones', type: 'lab', result: 'Strongly positive', interpretation: 'Ketoacidosis present', timeCost: 2, cost: 75, importance: 'critical' },
      { id: 'd3', name: 'ABG', type: 'lab', result: 'pH 7.15, HCO3 8, pCO2 22', interpretation: 'Metabolic acidosis with respiratory compensation', timeCost: 3, cost: 150, importance: 'critical' },
      { id: 'd4', name: 'Electrolytes', type: 'lab', result: 'Na 130, K 5.5, Cl 95', interpretation: 'Electrolyte disturbances', timeCost: 2, cost: 100, importance: 'critical' },
    ],
    managementOptions: [
      { intervention: 'IV fluids (NS)', appropriateness: 'critical', rationale: 'Correct severe dehydration' },
      { intervention: 'Insulin infusion', appropriateness: 'critical', rationale: 'Lower glucose and clear ketones' },
      { intervention: 'Potassium replacement', appropriateness: 'critical', rationale: 'Prevent hypokalemia with insulin' },
      { intervention: 'Monitor electrolytes q2h', appropriateness: 'appropriate', rationale: 'Track response to therapy' },
      { intervention: 'Bicarbonate therapy', appropriateness: 'inappropriate', rationale: 'Only if pH < 7.0 with hemodynamic compromise' },
    ],
  };

  const demoCase3 = {
    id: '70000000-0000-0000-0000-000000000003',
    orgId: '00000000-0000-0000-0000-000000000001',
    title: 'Community-Acquired Pneumonia',
    description: 'A 65-year-old male presents with fever, productive cough, and shortness of breath',
    specialty: 'Pulmonology',
    complexity: 'beginner',
    patientAge: 65,
    patientSex: 'M',
    chiefComplaint: 'Fever, productive cough with yellow sputum, dyspnea',
    correctDiagnosis: 'Community-Acquired Pneumonia',
    isPublished: true,
    isArchived: false,
    tags: ['pulmonology', 'infectious_disease'],
    timesAttempted: 0,
    timesCompleted: 0,
    averageScore: 0,
    createdAt: new Date('2025-01-03'),
    updatedAt: new Date('2025-01-03'),
    historySections: [
      {
        title: 'Present Illness',
        questions: [
          { id: 'h1', question: 'When did symptoms start?', answer: '3 days ago with fever and cough', cost: 1, importance: 'critical' },
          { id: 'h2', question: 'Sputum production?', answer: 'Yellow-green, copious', cost: 1, importance: 'helpful' },
          { id: 'h3', question: 'Chest pain?', answer: 'Right-sided pleuritic pain', cost: 1, importance: 'helpful' },
        ],
      },
    ],
    physicalExam: [
      { id: 'e1', examination: 'Vital Signs', finding: 'BP 130/80, HR 95, RR 24, Temp 39°C, O2 Sat 90%', cost: 1, importance: 'critical' },
      { id: 'e2', examination: 'Lung auscultation', finding: 'Right lower lobe crackles, bronchial breath sounds', cost: 2, importance: 'critical' },
      { id: 'e3', examination: 'Percussion', finding: 'Dullness over right lower lobe', cost: 1, importance: 'helpful' },
    ],
    diagnosticStudies: [
      { id: 'd1', name: 'CXR', type: 'imaging', result: 'Right lower lobe consolidation', interpretation: 'Lobar pneumonia', timeCost: 3, cost: 200, importance: 'critical' },
      { id: 'd2', name: 'WBC count', type: 'lab', result: '18,000 with left shift', interpretation: 'Bacterial infection', timeCost: 2, cost: 75, importance: 'helpful' },
      { id: 'd3', name: 'Sputum culture', type: 'lab', result: 'Pending (Streptococcus pneumoniae)', interpretation: 'Typical pathogen', timeCost: 48, cost: 150, importance: 'helpful' },
    ],
    managementOptions: [
      { intervention: 'Antibiotics (ceftriaxone + azithromycin)', appropriateness: 'critical', rationale: 'Empiric CAP coverage' },
      { intervention: 'Oxygen therapy', appropriateness: 'critical', rationale: 'Hypoxemia present' },
      { intervention: 'IV fluids', appropriateness: 'appropriate', rationale: 'Support hydration' },
      { intervention: 'Chest PT', appropriateness: 'appropriate', rationale: 'Aid secretion clearance' },
      { intervention: 'Steroids', appropriateness: 'inappropriate', rationale: 'Not indicated in uncomplicated CAP' },
    ],
  };

  mockCasesStore.set(demoCase1.id, demoCase1);
  mockCasesStore.set(demoCase2.id, demoCase2);
  mockCasesStore.set(demoCase3.id, demoCase3);
}

@Injectable()
export class CasesService {
  constructor() {
    // No TypeORM repositories needed - using in-memory storage
  }

  // ==================== Helper Methods (Replicate Entity Methods) ====================

  // Case entity helpers
  private getCriticalHistoryQuestions(caseEntity: any): any[] {
    return (caseEntity.historySections || [])
      .flatMap((section: any) => section.questions)
      .filter((q: any) => q.importance === 'critical');
  }

  private getCriticalPhysicalExams(caseEntity: any): any[] {
    return (caseEntity.physicalExam || []).filter((exam: any) => exam.importance === 'critical');
  }

  private getCriticalDiagnosticStudies(caseEntity: any): any[] {
    return (caseEntity.diagnosticStudies || []).filter((study: any) => study.importance === 'critical');
  }

  private getDefaultScoringRubric(caseEntity: any): any {
    return caseEntity.scoringRubric || {
      historyWeight: 20,
      examWeight: 20,
      diagnosticsWeight: 15,
      diagnosisWeight: 25,
      managementWeight: 15,
      efficiencyWeight: 5,
    };
  }

  // Session entity helpers
  private getTimeSpentMinutes(session: any): number {
    return Math.round((session.timeSpentSeconds || 0) / 60);
  }

  private getTotalActionsCount(session: any): number {
    return (session.actionLog || []).length;
  }

  private getCriticalActionsCount(session: any): number {
    return (session.actionLog || []).filter((action: any) => action.importance === 'critical').length;
  }

  private getUnnecessaryActionsCount(session: any): number {
    return (session.actionLog || []).filter((action: any) => action.importance === 'unnecessary').length;
  }

  private hasCorrectDiagnosis(session: any): boolean {
    return (session.diagnosisAttempts || []).some((attempt: any) => attempt.isCorrect);
  }

  private getTimeToCorrectDiagnosisMinutes(session: any): number | null {
    const correctAttempt = (session.diagnosisAttempts || []).find((attempt: any) => attempt.isCorrect);
    if (!correctAttempt) return null;

    const startTime = new Date(session.createdAt).getTime();
    const diagnosisTime = new Date(correctAttempt.timestamp).getTime();
    return Math.round((diagnosisTime - startTime) / 60000);
  }

  private getEfficiencyScore(session: any): number {
    const criticalCount = this.getCriticalActionsCount(session);
    const unnecessaryCount = this.getUnnecessaryActionsCount(session);

    if (criticalCount === 0) return 0;

    const efficiency = Math.max(0, 1 - unnecessaryCount / criticalCount);
    return Math.round(efficiency * 100);
  }

  private canSubmitDiagnosis(session: any): boolean {
    return session.status === 'in_progress' && (session.diagnosisAttempts || []).length < 3;
  }

  private canSubmitManagement(session: any): boolean {
    return session.status === 'in_progress' && this.hasCorrectDiagnosis(session);
  }

  private markCompleted(session: any): void {
    session.status = 'completed';
    session.completedAt = new Date();
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // ==================== Case Management ====================

  async create(createCaseDto: CreateCaseDto): Promise<any> {
    const caseEntity = {
      id: this.generateUUID(),
      ...createCaseDto,
      timesAttempted: 0,
      timesCompleted: 0,
      averageScore: 0,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockCasesStore.set(caseEntity.id, caseEntity);
    return caseEntity;
  }

  async findAll(searchDto: SearchCasesDto): Promise<CaseListDto> {
    const { page = 1, limit = 20, specialty, complexity, isPublished, search, tags } = searchDto;

    // Get all cases from the Map
    let cases = Array.from(mockCasesStore.values());

    // Apply filters
    if (specialty) {
      cases = cases.filter(c => c.specialty === specialty);
    }

    if (complexity) {
      cases = cases.filter(c => c.complexity === complexity);
    }

    if (isPublished !== undefined) {
      cases = cases.filter(c => c.isPublished === isPublished);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      cases = cases.filter(c =>
        c.title?.toLowerCase().includes(searchLower) ||
        c.description?.toLowerCase().includes(searchLower)
      );
    }

    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim());
      cases = cases.filter(c =>
        c.tags && tagArray.some(tag => c.tags.includes(tag))
      );
    }

    // Sort by created date descending
    cases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const total = cases.length;
    const startIndex = (page - 1) * limit;
    const paginatedCases = cases.slice(startIndex, startIndex + limit);

    return {
      items: paginatedCases.map(c => this.toCaseListItem(c)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<CaseDetailDto> {
    const caseEntity = mockCasesStore.get(id);
    if (!caseEntity) {
      throw new NotFoundException(`Case with ID ${id} not found`);
    }
    return this.toCaseDetail(caseEntity);
  }

  async update(id: string, updateCaseDto: UpdateCaseDto): Promise<any> {
    const caseEntity = mockCasesStore.get(id);
    if (!caseEntity) {
      throw new NotFoundException(`Case with ID ${id} not found`);
    }

    const updatedCase = {
      ...caseEntity,
      ...updateCaseDto,
      updatedAt: new Date(),
    };
    mockCasesStore.set(id, updatedCase);
    return updatedCase;
  }

  async remove(id: string): Promise<void> {
    const caseEntity = mockCasesStore.get(id);
    if (!caseEntity) {
      throw new NotFoundException(`Case with ID ${id} not found`);
    }

    caseEntity.isArchived = true;
    caseEntity.updatedAt = new Date();
    mockCasesStore.set(id, caseEntity);
  }

  // ==================== Session Management ====================

  async startSession(userId: string, dto: StartCaseSessionDto): Promise<any> {
    const caseEntity = mockCasesStore.get(dto.caseId);
    if (!caseEntity) {
      throw new NotFoundException(`Case with ID ${dto.caseId} not found`);
    }

    if (!caseEntity.isPublished) {
      throw new BadRequestException('Case is not published');
    }

    // Check for existing in-progress session
    const existingSession = Array.from(mockSessionsStore.values()).find(
      s => s.userId === userId && s.caseId === dto.caseId && s.status === 'in_progress'
    );

    if (existingSession) {
      return existingSession;
    }

    // Create new session
    const session = {
      id: this.generateUUID(),
      caseId: dto.caseId,
      userId,
      status: 'in_progress' as SessionStatus,
      sessionState: {
        revealedHistory: [],
        performedExams: [],
        orderedStudies: [],
      },
      actionLog: [],
      diagnosisAttempts: [],
      timeSpentSeconds: 0,
      resourceCost: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockSessionsStore.set(session.id, session);

    // Increment times attempted
    caseEntity.timesAttempted = (caseEntity.timesAttempted || 0) + 1;
    mockCasesStore.set(caseEntity.id, caseEntity);

    return session;
  }

  async getSession(sessionId: string): Promise<SessionStateDto> {
    const session = mockSessionsStore.get(sessionId);

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    // Attach case data
    const caseEntity = mockCasesStore.get(session.caseId);
    session.case = caseEntity;

    return this.toSessionState(session);
  }

  async getUserSessions(userId: string): Promise<SessionSummaryDto[]> {
    const sessions = Array.from(mockSessionsStore.values())
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50);

    // Attach case data to each session
    sessions.forEach(s => {
      s.case = mockCasesStore.get(s.caseId);
    });

    return sessions.map(s => this.toSessionSummary(s));
  }

  async updateSessionNotes(sessionId: string, userId: string, notes: string): Promise<any> {
    const session = mockSessionsStore.get(sessionId);

    if (!session || session.userId !== userId) {
      throw new NotFoundException(`Session not found`);
    }

    session.notes = notes;
    session.updatedAt = new Date();
    mockSessionsStore.set(sessionId, session);
    return session;
  }

  // ==================== Clinical Actions ====================

  async takeAction(
    sessionId: string,
    userId: string,
    dto: TakeActionDto,
  ): Promise<{ result: string; cost: number; importance: string }> {
    const session = mockSessionsStore.get(sessionId);

    if (!session || session.userId !== userId) {
      throw new NotFoundException('Session not found');
    }

    if (session.status !== 'in_progress') {
      throw new BadRequestException('Session is not in progress');
    }

    const caseEntity = mockCasesStore.get(session.caseId);
    if (!caseEntity) {
      throw new NotFoundException('Case not found');
    }

    let result: string;
    let timeCost = 0;
    let resourceCost = 0;
    let importance: ImportanceLevel = 'helpful';

    // Find and execute action
    if (dto.actionType === 'history') {
      const question = (caseEntity.historySections || [])
        .flatMap((section: any) => section.questions)
        .find((q: any) => q.id === dto.actionId);

      if (!question) {
        throw new NotFoundException(`History question ${dto.actionId} not found`);
      }

      result = question.answer;
      timeCost = question.cost;
      importance = question.importance;
      session.sessionState.revealedHistory.push(dto.actionId);
    } else if (dto.actionType === 'exam') {
      const exam = (caseEntity.physicalExam || []).find((e: any) => e.id === dto.actionId);

      if (!exam) {
        throw new NotFoundException(`Physical exam ${dto.actionId} not found`);
      }

      result = exam.finding;
      timeCost = exam.cost;
      importance = exam.importance;
      session.sessionState.performedExams.push(dto.actionId);
    } else {
      // Lab, imaging, or procedure
      const study = (caseEntity.diagnosticStudies || []).find((s: any) => s.id === dto.actionId);

      if (!study) {
        throw new NotFoundException(`Diagnostic study ${dto.actionId} not found`);
      }

      result = study.result;
      if (study.interpretation) {
        result += `\n\nInterpretation: ${study.interpretation}`;
      }
      timeCost = study.timeCost;
      resourceCost = study.cost;
      importance = study.importance;
      session.sessionState.orderedStudies.push(dto.actionId);
    }

    // Log action
    const action: ActionLog = {
      timestamp: new Date(),
      actionType: dto.actionType,
      actionId: dto.actionId,
      result,
      timeCost,
      resourceCost,
      importance,
    };

    session.actionLog.push(action);
    session.timeSpentSeconds += timeCost;
    session.resourceCost += resourceCost;
    session.updatedAt = new Date();

    mockSessionsStore.set(sessionId, session);

    return { result, cost: timeCost + resourceCost, importance };
  }

  // ==================== Diagnosis & Management ====================

  async submitDiagnosis(
    sessionId: string,
    userId: string,
    dto: SubmitDiagnosisDto,
  ): Promise<{ isCorrect: boolean; feedback: string }> {
    const session = mockSessionsStore.get(sessionId);

    if (!session || session.userId !== userId) {
      throw new NotFoundException('Session not found');
    }

    if (!this.canSubmitDiagnosis(session)) {
      throw new BadRequestException('Cannot submit more diagnosis attempts');
    }

    const caseEntity = mockCasesStore.get(session.caseId);
    if (!caseEntity) {
      throw new NotFoundException('Case not found');
    }

    const isCorrect =
      dto.primaryDiagnosis.toLowerCase() === caseEntity.correctDiagnosis.toLowerCase();

    const attempt: DiagnosisAttempt = {
      timestamp: new Date(),
      primaryDiagnosis: dto.primaryDiagnosis,
      differentialDiagnoses: dto.differentialDiagnoses,
      confidence: dto.confidence,
      isCorrect,
    };

    session.diagnosisAttempts.push(attempt);
    session.updatedAt = new Date();
    mockSessionsStore.set(sessionId, session);

    let feedback = isCorrect
      ? `Correct! ${dto.primaryDiagnosis} is the correct diagnosis.`
      : `Incorrect. The correct diagnosis is ${caseEntity.correctDiagnosis}.`;

    if (!isCorrect && dto.differentialDiagnoses.some(d => d.toLowerCase() === caseEntity.correctDiagnosis.toLowerCase())) {
      feedback += ' However, you did include the correct diagnosis in your differential.';
    }

    return { isCorrect, feedback };
  }

  async submitManagement(
    sessionId: string,
    userId: string,
    dto: SubmitManagementDto,
  ): Promise<{ appropriatenessScore: number; feedback: string }> {
    const session = mockSessionsStore.get(sessionId);

    if (!session || session.userId !== userId) {
      throw new NotFoundException('Session not found');
    }

    if (!this.canSubmitManagement(session)) {
      throw new BadRequestException('Cannot submit management without correct diagnosis');
    }

    const caseEntity = mockCasesStore.get(session.caseId);
    if (!caseEntity) {
      throw new NotFoundException('Case not found');
    }

    const managementOptions = caseEntity.managementOptions || [];

    let appropriateCount = 0;
    let inappropriateCount = 0;
    const feedbackItems: string[] = [];

    for (const intervention of dto.interventions) {
      const option = managementOptions.find(
        (opt: any) => opt.intervention.toLowerCase() === intervention.toLowerCase(),
      );

      if (option) {
        if (option.appropriateness === 'critical' || option.appropriateness === 'appropriate') {
          appropriateCount++;
          feedbackItems.push(`✓ ${intervention}: Appropriate`);
        } else if (option.appropriateness === 'inappropriate' || option.appropriateness === 'harmful') {
          inappropriateCount++;
          feedbackItems.push(`✗ ${intervention}: ${option.appropriateness}`);
        }
      }
    }

    const appropriatenessScore = appropriateCount > 0
      ? Math.round((appropriateCount / (appropriateCount + inappropriateCount)) * 100)
      : 0;

    const managementPlan: ManagementPlan = {
      timestamp: new Date(),
      interventions: dto.interventions,
      appropriatenessScore,
      rationale: dto.rationale,
    };

    session.managementPlan = managementPlan;
    session.updatedAt = new Date();
    mockSessionsStore.set(sessionId, session);

    const feedback = feedbackItems.join('\n');
    return { appropriatenessScore, feedback };
  }

  // ==================== Session Completion & Scoring ====================

  async completeSession(
    sessionId: string,
    userId: string,
  ): Promise<{
    scoreBreakdown: ScoreBreakdown;
    clinicalReasoning: ClinicalReasoningMetrics;
    feedback: DetailedFeedback;
  }> {
    const session = mockSessionsStore.get(sessionId);

    if (!session || session.userId !== userId) {
      throw new NotFoundException('Session not found');
    }

    if (session.status !== 'in_progress') {
      throw new BadRequestException('Session is already completed');
    }

    const caseEntity = mockCasesStore.get(session.caseId);
    if (!caseEntity) {
      throw new NotFoundException('Case not found');
    }

    // Calculate scores
    const scoreBreakdown = this.calculateScoreBreakdown(session, caseEntity);
    const clinicalReasoning = this.calculateClinicalReasoning(session, caseEntity);
    const feedback = this.generateFeedback(session, caseEntity);

    session.scoreBreakdown = scoreBreakdown;
    session.clinicalReasoning = clinicalReasoning;
    session.feedback = feedback;
    this.markCompleted(session);

    mockSessionsStore.set(sessionId, session);

    // Update case statistics
    await this.updateCaseStatistics(caseEntity.id);

    return { scoreBreakdown, clinicalReasoning, feedback };
  }

  // ==================== Scoring Helper Methods ====================

  private calculateScoreBreakdown(session: any, caseEntity: any): ScoreBreakdown {
    const rubric = this.getDefaultScoringRubric(caseEntity);

    // History Score
    const criticalHistory = this.getCriticalHistoryQuestions(caseEntity);
    const askedCriticalHistory = session.sessionState.revealedHistory.filter((id: any) =>
      criticalHistory.some((q: any) => q.id === id),
    );
    const historyScore =
      criticalHistory.length > 0
        ? (askedCriticalHistory.length / criticalHistory.length) * rubric.historyWeight
        : 0;

    // Exam Score
    const criticalExams = this.getCriticalPhysicalExams(caseEntity);
    const performedCriticalExams = session.sessionState.performedExams.filter((id: any) =>
      criticalExams.some((e: any) => e.id === id),
    );
    const examScore =
      criticalExams.length > 0
        ? (performedCriticalExams.length / criticalExams.length) * rubric.examWeight
        : 0;

    // Diagnostics Score
    const criticalStudies = this.getCriticalDiagnosticStudies(caseEntity);
    const orderedCriticalStudies = session.sessionState.orderedStudies.filter((id: any) =>
      criticalStudies.some((s: any) => s.id === id),
    );
    const diagnosticsScore =
      criticalStudies.length > 0
        ? (orderedCriticalStudies.length / criticalStudies.length) * rubric.diagnosticsWeight
        : 0;

    // Diagnosis Score
    let diagnosisScore = 0;
    const correctAttempt = (session.diagnosisAttempts || []).find((a: any) => a.isCorrect);
    if (correctAttempt) {
      diagnosisScore = rubric.diagnosisWeight;
    } else {
      // Partial credit if correct diagnosis in differential
      const anyAttemptWithCorrectInDifferential = (session.diagnosisAttempts || []).some((a: any) =>
        (a.differentialDiagnoses || []).some(
          (d: any) => d.toLowerCase() === caseEntity.correctDiagnosis.toLowerCase(),
        ),
      );
      if (anyAttemptWithCorrectInDifferential) {
        diagnosisScore = rubric.diagnosisWeight * 0.5;
      }
    }

    // Management Score
    const managementScore = session.managementPlan
      ? (session.managementPlan.appropriatenessScore / 100) * rubric.managementWeight
      : 0;

    // Efficiency Score
    const efficiencyScore = (this.getEfficiencyScore(session) / 100) * rubric.efficiencyWeight;

    const totalScore =
      historyScore +
      examScore +
      diagnosticsScore +
      diagnosisScore +
      managementScore +
      efficiencyScore;

    return {
      historyScore: Math.round(historyScore * 10) / 10,
      examScore: Math.round(examScore * 10) / 10,
      diagnosticsScore: Math.round(diagnosticsScore * 10) / 10,
      diagnosisScore: Math.round(diagnosisScore * 10) / 10,
      managementScore: Math.round(managementScore * 10) / 10,
      efficiencyScore: Math.round(efficiencyScore * 10) / 10,
      totalScore: Math.round(totalScore * 10) / 10,
    };
  }

  private calculateClinicalReasoning(
    session: any,
    caseEntity: any,
  ): ClinicalReasoningMetrics {
    const criticalHistory = this.getCriticalHistoryQuestions(caseEntity);
    const criticalExams = this.getCriticalPhysicalExams(caseEntity);
    const criticalStudies = this.getCriticalDiagnosticStudies(caseEntity);

    const criticalActionsTotal =
      criticalHistory.length + criticalExams.length + criticalStudies.length;

    const criticalActionsCompleted =
      session.sessionState.revealedHistory.filter((id: any) =>
        criticalHistory.some((q: any) => q.id === id),
      ).length +
      session.sessionState.performedExams.filter((id: any) => criticalExams.some((e: any) => e.id === id))
        .length +
      session.sessionState.orderedStudies.filter((id: any) => criticalStudies.some((s: any) => s.id === id))
        .length;

    const unnecessaryActions = this.getUnnecessaryActionsCount(session);
    const timeToCorrectDiagnosis = this.getTimeToCorrectDiagnosisMinutes(session);

    const diagnosticAccuracy = this.hasCorrectDiagnosis(session) ? 100 : 0;

    const managementAppropriateness = session.managementPlan
      ? session.managementPlan.appropriatenessScore
      : 0;

    const efficiencyRating = this.getEfficiencyScore(session);

    return {
      criticalActionsCompleted,
      criticalActionsTotal,
      unnecessaryActions,
      timeToCorrectDiagnosis,
      diagnosticAccuracy,
      managementAppropriateness,
      efficiencyRating,
    };
  }

  private generateFeedback(session: any, caseEntity: any): DetailedFeedback {
    const strengths: string[] = [];
    const areasForImprovement: string[] = [];
    const missedCriticalActions: string[] = [];
    const unnecessaryActionsArr: string[] = [];

    // Check critical actions
    const criticalHistory = this.getCriticalHistoryQuestions(caseEntity);
    const criticalExams = this.getCriticalPhysicalExams(caseEntity);
    const criticalStudies = this.getCriticalDiagnosticStudies(caseEntity);

    criticalHistory.forEach((q: any) => {
      if (!session.sessionState.revealedHistory.includes(q.id)) {
        missedCriticalActions.push(`History: ${q.question}`);
      }
    });

    criticalExams.forEach((e: any) => {
      if (!session.sessionState.performedExams.includes(e.id)) {
        missedCriticalActions.push(`Exam: ${e.examination}`);
      }
    });

    criticalStudies.forEach((s: any) => {
      if (!session.sessionState.orderedStudies.includes(s.id)) {
        missedCriticalActions.push(`Study: ${s.name}`);
      }
    });

    // Check unnecessary actions
    (session.actionLog || []).forEach((action: any) => {
      if (action.importance === 'unnecessary') {
        unnecessaryActionsArr.push(`${action.actionType}: ${action.actionId}`);
      }
    });

    // Strengths
    if (this.hasCorrectDiagnosis(session)) {
      strengths.push('Correct diagnosis');
    }
    if (this.getCriticalActionsCount(session) >= 3) {
      strengths.push('Thorough clinical evaluation');
    }
    if (this.getUnnecessaryActionsCount(session) <= 2) {
      strengths.push('Efficient use of resources');
    }

    // Areas for improvement
    if (!this.hasCorrectDiagnosis(session)) {
      areasForImprovement.push('Incorrect or missed diagnosis');
    }
    if (missedCriticalActions.length > 0) {
      areasForImprovement.push(`Missed ${missedCriticalActions.length} critical actions`);
    }
    if (this.getUnnecessaryActionsCount(session) > 3) {
      areasForImprovement.push('Ordered unnecessary tests/procedures');
    }

    const diagnosticApproach = this.hasCorrectDiagnosis(session)
      ? 'Correct diagnosis achieved with systematic approach'
      : 'Diagnosis was incorrect or incomplete. Review the case findings.';

    const managementApproach = session.managementPlan
      ? `Management plan appropriateness: ${session.managementPlan.appropriatenessScore}%`
      : 'No management plan submitted';

    return {
      strengths,
      areasForImprovement,
      missedCriticalActions,
      unnecessaryActions: unnecessaryActionsArr,
      diagnosticApproach,
      managementApproach,
    };
  }

  private async updateCaseStatistics(caseId: string): Promise<void> {
    const completedSessions = Array.from(mockSessionsStore.values()).filter(
      (s: any) => s.caseId === caseId && s.status === 'completed'
    );

    if (completedSessions.length === 0) return;

    const totalScore = completedSessions.reduce(
      (sum: any, s: any) => sum + (s.scoreBreakdown?.totalScore || 0),
      0,
    );
    const totalTime = completedSessions.reduce((sum: any, s: any) => sum + this.getTimeSpentMinutes(s), 0);

    const caseEntity = mockCasesStore.get(caseId);
    if (caseEntity) {
      caseEntity.averageScore = Math.round((totalScore / completedSessions.length) * 10) / 10;
      caseEntity.averageTimeMinutes =
        Math.round((totalTime / completedSessions.length) * 10) / 10;
      mockCasesStore.set(caseId, caseEntity);
    }
  }

  // ==================== Analytics ====================

  async getCaseAnalytics(caseId: string): Promise<CaseAnalyticsDto> {
    const sessions = Array.from(mockSessionsStore.values()).filter((s: any) => s.caseId === caseId);
    const completedSessions = sessions.filter((s: any) => s.status === 'completed');

    const uniqueUsers = new Set(sessions.map((s: any) => s.userId)).size;

    const averageScore =
      completedSessions.length > 0
        ? completedSessions.reduce((sum: any, s: any) => sum + (s.scoreBreakdown?.totalScore || 0), 0) /
          completedSessions.length
        : 0;

    const averageTimeMinutes =
      completedSessions.length > 0
        ? completedSessions.reduce((sum: any, s: any) => sum + this.getTimeSpentMinutes(s), 0) /
          completedSessions.length
        : 0;

    const completionRate =
      sessions.length > 0 ? (completedSessions.length / sessions.length) * 100 : 0;

    const averageDiagnosticAccuracy =
      completedSessions.length > 0
        ? completedSessions.reduce(
            (sum: any, s: any) => sum + (s.clinicalReasoning?.diagnosticAccuracy || 0),
            0,
          ) / completedSessions.length
        : 0;

    // Common mistakes (simplified)
    const commonMistakes = ['Missed critical history questions', 'Ordered unnecessary tests'];

    // Frequently ordered studies (simplified)
    const frequentlyOrderedStudies = [
      { study: 'ECG', count: sessions.length },
      { study: 'Chest X-ray', count: Math.floor(sessions.length * 0.8) },
    ];

    return {
      caseId,
      totalAttempts: sessions.length,
      uniqueUsers,
      averageScore: Math.round(averageScore * 10) / 10,
      averageTimeMinutes: Math.round(averageTimeMinutes * 10) / 10,
      completionRate: Math.round(completionRate * 10) / 10,
      averageDiagnosticAccuracy: Math.round(averageDiagnosticAccuracy * 10) / 10,
      commonMistakes,
      frequentlyOrderedStudies,
    };
  }

  async getUserPerformance(userId: string): Promise<UserPerformanceDto> {
    const sessions = Array.from(mockSessionsStore.values()).filter((s: any) => s.userId === userId);

    // Attach case data to each session
    sessions.forEach((s: any) => {
      s.case = mockCasesStore.get(s.caseId);
    });

    const completedSessions = sessions.filter((s: any) => s.status === 'completed');

    const averageScore =
      completedSessions.length > 0
        ? completedSessions.reduce((sum: any, s: any) => sum + (s.scoreBreakdown?.totalScore || 0), 0) /
          completedSessions.length
        : 0;

    const averageTimeMinutes =
      completedSessions.length > 0
        ? completedSessions.reduce((sum: any, s: any) => sum + this.getTimeSpentMinutes(s), 0) /
          completedSessions.length
        : 0;

    // Performance by specialty (simplified)
    const performanceBySpecialty = [
      {
        specialty: 'cardiology',
        casesAttempted: sessions.filter((s: any) => s.case?.specialty === 'cardiology').length,
        averageScore: 85,
      },
    ];

    // Performance by complexity (simplified)
    const performanceByComplexity = [
      {
        complexity: 'intermediate',
        casesAttempted: sessions.filter((s: any) => s.case?.complexity === 'intermediate').length,
        averageScore: 82,
      },
    ];

    const recentSessions = sessions
      .slice(0, 10)
      .map((s: any) => this.toSessionSummary(s));

    return {
      userId,
      totalCasesAttempted: sessions.length,
      totalCasesCompleted: completedSessions.length,
      averageScore: Math.round(averageScore * 10) / 10,
      averageTimeMinutes: Math.round(averageTimeMinutes * 10) / 10,
      performanceBySpecialty,
      performanceByComplexity,
      recentSessions,
    };
  }

  // ==================== Utility Methods ====================

  async getSpecialties(): Promise<string[]> {
    const cases = Array.from(mockCasesStore.values());
    const specialties = new Set<string>();
    cases.forEach((c: any) => {
      if (c.specialty) {
        specialties.add(c.specialty);
      }
    });
    return Array.from(specialties);
  }

  async getComplexityDistribution(): Promise<{ complexity: string; count: number }[]> {
    const cases = Array.from(mockCasesStore.values());
    const distribution = new Map<string, number>();

    cases.forEach((c: any) => {
      const complexity = c.complexity || 'unknown';
      distribution.set(complexity, (distribution.get(complexity) || 0) + 1);
    });

    return Array.from(distribution.entries()).map(([complexity, count]) => ({
      complexity,
      count,
    }));
  }

  // ==================== Private Helper Methods ====================

  private toCaseListItem(caseEntity: any): any {
    return {
      id: caseEntity.id,
      title: caseEntity.title,
      description: caseEntity.description,
      specialty: caseEntity.specialty,
      complexity: caseEntity.complexity,
      estimatedTimeMinutes: caseEntity.estimatedTimeMinutes,
      timesAttempted: caseEntity.timesAttempted,
      averageScore: caseEntity.averageScore,
      isPublished: caseEntity.isPublished,
      tags: caseEntity.tags,
      createdAt: caseEntity.createdAt,
    };
  }

  private toCaseDetail(caseEntity: any): CaseDetailDto {
    return {
      id: caseEntity.id,
      title: caseEntity.title,
      description: caseEntity.description,
      specialty: caseEntity.specialty,
      complexity: caseEntity.complexity,
      estimatedTimeMinutes: caseEntity.estimatedTimeMinutes,
      timeLimitMinutes: caseEntity.timeLimitMinutes,
      chiefComplaint: caseEntity.chiefComplaint,
      presentingScenario: caseEntity.presentingScenario,
      demographics: caseEntity.demographics,
      vitals: caseEntity.vitals,
      tags: caseEntity.tags,
      learningObjectives: caseEntity.learningObjectives,
      teachingPoints: caseEntity.teachingPoints,
      timesAttempted: caseEntity.timesAttempted,
      averageScore: caseEntity.averageScore,
      isPublished: caseEntity.isPublished,
    };
  }

  private toSessionState(session: any): SessionStateDto {
    return {
      id: session.id,
      caseId: session.caseId,
      userId: session.userId,
      status: session.status,
      sessionState: session.sessionState,
      actionLog: session.actionLog,
      diagnosisAttempts: session.diagnosisAttempts,
      timeSpentSeconds: session.timeSpentSeconds,
      resourceCost: session.resourceCost,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }

  private toSessionSummary(session: any): SessionSummaryDto {
    return {
      id: session.id,
      caseTitle: session.case?.title || 'Unknown',
      status: session.status,
      timeSpentMinutes: this.getTimeSpentMinutes(session),
      scoreBreakdown: session.scoreBreakdown,
      createdAt: session.createdAt,
      completedAt: session.completedAt,
    };
  }
}
