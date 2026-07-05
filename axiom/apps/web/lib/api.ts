// Typed fetch wrapper for the AXIOM API.
//
// AXIOM reuses EUREKA's auth. EUREKA's web app stores its JWT in
// localStorage under the key "access_token". We read that same token here
// and send it as an Authorization: Bearer header on every request.

export const AXIOM_API_URL =
  process.env.NEXT_PUBLIC_AXIOM_API_URL || 'http://localhost:8400';

export const EUREKA_LOGIN_URL =
  process.env.NEXT_PUBLIC_EUREKA_LOGIN_URL || 'http://localhost:4040/auth/login';

// The localStorage key that EUREKA's web app writes the JWT to.
export const TOKEN_STORAGE_KEY = 'access_token';

// A module descriptor as returned by the dashboard summary. "available"
// modules are wired up, "planned" modules are shown but not yet built.
export interface Module {
  key: string;
  name: string;
  status: 'available' | 'planned';
  description: string;
}

// The signed-in user as returned by GET /api/v1/me.
export interface Me {
  id: string;
  email: string;
  display_name: string;
  roles: string[];
  tenant_id: string;
}

// The dashboard payload returned by GET /api/v1/dashboard/summary.
export interface DashboardSummary {
  user: {
    id: string;
    email: string;
    display_name: string;
    roles: string[];
  };
  modules: Module[];
  mastery_summary: null;
}

// The shape returned by GET /health.
export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}

// A typed error thrown for any non-2xx response. Callers can inspect the
// status to distinguish auth failures (401/403) from other errors.
export class ApiError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(status: number, message: string, body: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

// Read the EUREKA JWT from localStorage. Returns null on the server (where
// there is no localStorage) or when no token has been stored.
export function getToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

// Perform an authenticated GET against the AXIOM API and parse the JSON
// body as T. Throws ApiError on any non-2xx response.
export async function apiGet<T>(path: string): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${AXIOM_API_URL}${path}`;
  let res: Response;
  try {
    res = await fetch(url, { headers, cache: 'no-store' });
  } catch (err) {
    // Network-level failure (server down, CORS, DNS, etc.).
    const message = err instanceof Error ? err.message : 'network error';
    throw new ApiError(0, `Request to ${path} failed: ${message}`, '');
  }

  if (!res.ok) {
    let body = '';
    try {
      body = await res.text();
    } catch {
      body = '';
    }
    throw new ApiError(
      res.status,
      `Request to ${path} returned ${res.status}`,
      body,
    );
  }

  return (await res.json()) as T;
}

// Perform an authenticated POST against the AXIOM API with a JSON body and
// parse the JSON response as T. Same error semantics as apiGet.
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${AXIOM_API_URL}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers,
      cache: 'no-store',
      body: JSON.stringify(body ?? {}),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'network error';
    throw new ApiError(0, `Request to ${path} failed: ${message}`, '');
  }

  if (!res.ok) {
    let text = '';
    try {
      text = await res.text();
    } catch {
      text = '';
    }
    throw new ApiError(
      res.status,
      `Request to ${path} returned ${res.status}`,
      text,
    );
  }

  return (await res.json()) as T;
}

// Convenience helpers for the three endpoints the dashboard uses.
export function fetchMe(): Promise<Me> {
  return apiGet<Me>('/api/v1/me');
}

export function fetchDashboardSummary(): Promise<DashboardSummary> {
  return apiGet<DashboardSummary>('/api/v1/dashboard/summary');
}

export function fetchHealth(): Promise<HealthResponse> {
  return apiGet<HealthResponse>('/health');
}

// -------------------------------------------------------------------------
// Phase 1 types.
// -------------------------------------------------------------------------

// A single node in the skill graph.
export interface GraphNode {
  id: string;
  code: string;
  title: string;
  description: string;
}

// A directed edge between two nodes (for example a prerequisite relation).
export interface GraphEdge {
  from_id: string;
  to_id: string;
  kind: string;
}

// The skill graph returned by GET /api/v1/curriculum/graph.
export interface CurriculumGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// One step within a lesson.
export interface LessonStep {
  position: number;
  kind: string;
  title: string;
  body: string;
}

// A lesson for a node, returned by GET /api/v1/content/nodes/{code}/lesson.
export interface Lesson {
  node_id: string;
  title: string;
  summary: string;
  steps: LessonStep[];
}

// The kinds of practice items AXIOM serves.
export type PracticeKind =
  | 'mcq_single'
  | 'numeric'
  | 'math_expression'
  | 'equation';

// A served practice question.
export interface PracticeQuestion {
  done?: false;
  response_token: string;
  node_id: string;
  node_title: string;
  kind: PracticeKind;
  prompt: string;
  options: string[] | null;
}

// The "nothing to practice" terminal state.
export interface PracticeDone {
  done: true;
  message: string;
}

export type PracticeNext = PracticeQuestion | PracticeDone;

// Narrowing helper for the done state of POST /api/v1/practice/next.
export function isPracticeDone(next: PracticeNext): next is PracticeDone {
  return next.done === true;
}

// The mastery delta returned alongside a graded answer.
export interface MasteryDelta {
  node_id: string;
  p_known_before: number;
  p_known_after: number;
  level: string;
}

// The graded result of POST /api/v1/practice/answer.
export interface AnswerResult {
  is_correct: boolean;
  score: number;
  grader: string;
  correct_answer: string;
  explanation: string;
  mastery: MasteryDelta;
}

// One mastery state row from GET /api/v1/mastery/me.
export interface MasteryStateRow {
  node_id: string;
  code: string;
  title: string;
  p_known: number;
  level: string;
  updated_at: string;
}

export interface MasteryResponse {
  states: MasteryStateRow[];
}

// One evidence event from GET /api/v1/mastery/me/evidence/{code}.
export interface EvidenceEvent {
  created_at: string;
  correct: boolean;
  p_known_before: number;
  p_known_after: number;
}

export interface EvidenceResponse {
  node_id: string;
  events: EvidenceEvent[];
}

// The status a node can hold within a learning path.
export type PathStatus = 'available' | 'locked' | 'mastered';

// One node in the learner path from GET /api/v1/learning-path/me.
export interface PathNode {
  node_id: string;
  code: string;
  title: string;
  p_known: number;
  level: string;
  status: PathStatus;
}

export interface LearningPath {
  plan: PathNode[];
  recommended_node_id: string | null;
}

// A teacher assessment as listed by GET /api/v1/assessments/mine.
export interface AssessmentSummary {
  id: string;
  title: string;
  kind: string;
  created_at: string;
}

// One row of results for an assessment.
export interface AssessmentResultRow {
  display_name: string;
  answered: number;
  correct: number;
  score: number | null;
  status: string;
}

export interface AssessmentResults {
  title: string;
  results: AssessmentResultRow[];
}

// -------------------------------------------------------------------------
// Phase 1 helpers.
// -------------------------------------------------------------------------

export function fetchGraph(): Promise<CurriculumGraph> {
  return apiGet<CurriculumGraph>('/api/v1/curriculum/graph');
}

export function fetchLesson(code: string): Promise<Lesson> {
  return apiGet<Lesson>(
    `/api/v1/content/nodes/${encodeURIComponent(code)}/lesson`,
  );
}

export function practiceNext(nodeId?: string): Promise<PracticeNext> {
  const body = nodeId ? { node_id: nodeId } : {};
  return apiPost<PracticeNext>('/api/v1/practice/next', body);
}

export function practiceAnswer(
  responseToken: string,
  answer: string,
): Promise<AnswerResult> {
  return apiPost<AnswerResult>('/api/v1/practice/answer', {
    response_token: responseToken,
    answer,
  });
}

export function fetchMastery(): Promise<MasteryResponse> {
  return apiGet<MasteryResponse>('/api/v1/mastery/me');
}

export function fetchEvidence(code: string): Promise<EvidenceResponse> {
  return apiGet<EvidenceResponse>(
    `/api/v1/mastery/me/evidence/${encodeURIComponent(code)}`,
  );
}

export function fetchLearningPath(): Promise<LearningPath> {
  return apiGet<LearningPath>('/api/v1/learning-path/me');
}

export function fetchMyAssessments(): Promise<AssessmentSummary[]> {
  return apiGet<AssessmentSummary[]>('/api/v1/assessments/mine');
}

export function createAssessment(input: {
  title: string;
  node_ids: string[];
  item_count: number;
}): Promise<{ id: string; title: string }> {
  return apiPost<{ id: string; title: string }>(
    '/api/v1/assessments',
    input,
  );
}

export function assignToAllStudents(
  assessmentId: string,
): Promise<{ assigned: number }> {
  return apiPost<{ assigned: number }>(
    `/api/v1/assessments/${encodeURIComponent(assessmentId)}/assign`,
    { all_students: true },
  );
}

export function fetchAssessmentResults(
  assessmentId: string,
): Promise<AssessmentResults> {
  return apiGet<AssessmentResults>(
    `/api/v1/assessments/${encodeURIComponent(assessmentId)}/results`,
  );
}
