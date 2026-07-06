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
    // SSO handoff from EUREKA. EUREKA links to AXIOM with the JWT in the URL
    // hash (#access_token=...). The hash is client-only (it is never sent to a
    // server and is not logged), which is why the token travels in the fragment
    // rather than a query string. Capture it into localStorage, then strip it
    // from the address bar so it does not linger.
    const hash = window.location.hash;
    if (hash && hash.includes('access_token=')) {
      const params = new URLSearchParams(hash.replace(/^#/, ''));
      const handed = params.get('access_token');
      if (handed) {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, handed);
        params.delete('access_token');
        const rest = params.toString();
        const cleaned =
          window.location.pathname +
          window.location.search +
          (rest ? `#${rest}` : '');
        window.history.replaceState(null, '', cleaned);
      }
    }
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

// Request a development session from the API. This is a local convenience so
// AXIOM can be opened directly (without the EUREKA round trip). The endpoint is
// disabled in production, in which case this returns null and the sign-in
// screen is shown instead.
export async function devLogin(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const res = await fetch(`${AXIOM_API_URL}/api/v1/auth/dev-login`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) {
      return null;
    }
    const data = (await res.json()) as { access_token?: string };
    if (data.access_token) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
      return data.access_token;
    }
    return null;
  } catch {
    return null;
  }
}

// Ensure a usable session exists and return the token. Order of preference:
//   1. a token already in storage (including one just handed over from EUREKA
//      in the URL hash, which getToken captures)
//   2. a fresh development session from the API
// Returns null only when there is no token and dev-login is unavailable (for
// example in production), which is the one case that still shows the sign-in
// screen.
export async function ensureSession(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null;
  }
  const existing = getToken();
  if (existing) {
    return existing;
  }
  return devLogin();
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
  | 'equation'
  | 'mcq_multi'
  | 'true_false'
  | 'short_text'
  | 'plot_points'
  | 'plot_function'
  | 'draw_line'
  | 'show_work'
  | 'free_response';

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

// A per-step credit awarded for a milestone within a multi-step answer. For
// show_work items only milestone/awarded are present. For AI-graded
// free_response items the entry also carries a rationale note and the points
// available/awarded for that criterion, so both shapes must be handled.
export interface StepCredit {
  milestone: string;
  awarded: boolean;
  note?: string;
  points?: number;
  awarded_points?: number;
}

// The gamification delta returned alongside a graded answer.
export interface AnswerGamification {
  xp_total: number;
  level: number;
  streak_days: number;
  new_badges: string[];
}

// The result of POST /api/v1/practice/answer.
//
// For fast kinds the full grade is returned immediately (status is "graded" or
// absent) and the graded fields below are present. For free_response items
// grading now runs asynchronously on a worker: the POST returns a "grading"
// state ({status, response_token, ai_graded, message}) and the client must poll
// fetchResponseResult(response_token) until the grade is ready. Because the
// grading state omits the graded fields, those fields are optional here; a
// caller should confirm status !== "grading" (or that is_correct is present)
// before reading them. The step_credits and gamification fields are optional so
// older items keep working unchanged. For AI-graded free_response items the
// response also carries ai_graded/overridable flags and a confidence, which the
// UI uses to label the grade as AI-produced and teacher-overridable rather than
// authoritative.
export interface AnswerResult {
  status?: 'graded' | 'grading' | 'unanswered';
  response_token?: string;
  message?: string;
  is_correct?: boolean;
  score?: number;
  grader?: string;
  correct_answer?: string;
  explanation?: string;
  mastery?: MasteryDelta;
  step_credits?: StepCredit[];
  gamification?: AnswerGamification;
  ai_graded?: boolean;
  overridable?: boolean;
  confidence?: number;
}

// The result of GET /api/v1/practice/response/{response_token}, the endpoint
// polled while an async free_response grade is produced. status selects the
// shape: "unanswered" and "grading" carry no grade; "graded" carries the full
// AI grade (the same fields the answered card renders, including per-criterion
// step_credits). This is a distinct shape from AnswerResult: it never carries a
// mastery delta or gamification, so it is mapped into the card rather than
// reusing AnswerResult directly.
export interface ResponseResult {
  status: 'unanswered' | 'grading' | 'graded';
  response_token?: string;
  is_correct?: boolean;
  score?: number;
  grader?: string;
  ai_graded?: boolean;
  overridable?: boolean;
  confidence?: number;
  correct_answer?: string;
  explanation?: string;
  step_credits?: StepCredit[];
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

// A teacher assessment as listed by GET /api/v1/assessments/mine. The optional
// availability window (open_at/close_at) bounds when students may start it; a
// null bound is open-ended on that side.
export interface AssessmentSummary {
  id: string;
  title: string;
  kind: string;
  created_at: string;
  open_at?: string | null;
  close_at?: string | null;
}

// One assessment assigned to the signed-in student, from
// GET /api/v1/assessments/assigned. open_at/close_at bound when it can be
// started (a null bound is open-ended); due_at is the assignment's due date.
export interface AssignedAssessment {
  id: string;
  title: string;
  open_at: string | null;
  close_at: string | null;
  due_at: string | null;
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

// Poll the grading status/result for a response. Used for async free_response
// grading: after practiceAnswer returns status "grading", the client calls this
// on an interval until status is "graded" (or gives up after a max number of
// attempts).
export function fetchResponseResult(
  responseToken: string,
): Promise<ResponseResult> {
  return apiGet<ResponseResult>(
    `/api/v1/practice/response/${encodeURIComponent(responseToken)}`,
  );
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
  open_at?: string;
  close_at?: string;
}): Promise<{ id: string; title: string }> {
  return apiPost<{ id: string; title: string }>(
    '/api/v1/assessments',
    input,
  );
}

// The signed-in student's assigned assessments, most recent first.
export function fetchAssignedAssessments(): Promise<AssignedAssessment[]> {
  return apiGet<AssignedAssessment[]>('/api/v1/assessments/assigned');
}

// Start an assigned assessment, returning the attempt id and its served items.
// Throws ApiError with status 403 when outside the availability window; the
// JSON body carries a { detail } message the caller can surface.
export function startAssessment(id: string): Promise<{
  attempt_id: string;
  items: {
    response_token: string;
    kind: string;
    prompt: string;
    options: string[] | null;
  }[];
  count: number;
}> {
  return apiPost<{
    attempt_id: string;
    items: {
      response_token: string;
      kind: string;
      prompt: string;
      options: string[] | null;
    }[];
    count: number;
  }>(`/api/v1/assessments/${encodeURIComponent(id)}/start`, {});
}

export function assignToAllStudents(
  assessmentId: string,
  dueAt?: string,
): Promise<{ assigned: number }> {
  return apiPost<{ assigned: number }>(
    `/api/v1/assessments/${encodeURIComponent(assessmentId)}/assign`,
    { all_students: true, due_at: dueAt || null },
  );
}

export function fetchAssessmentResults(
  assessmentId: string,
): Promise<AssessmentResults> {
  return apiGet<AssessmentResults>(
    `/api/v1/assessments/${encodeURIComponent(assessmentId)}/results`,
  );
}

// -------------------------------------------------------------------------
// Phase 2 types.
// -------------------------------------------------------------------------

// A badge the learner has earned, from GET /api/v1/gamification/me.
export interface Badge {
  code: string;
  name: string;
  description: string;
  awarded_at: string;
}

// The learner's gamification profile from GET /api/v1/gamification/me.
export interface GamificationProfile {
  xp_total: number;
  level: number;
  streak_days: number;
  last_active_on: string | null;
  badges: Badge[];
}

// One row of the leaderboard from GET /api/v1/gamification/leaderboard.
export interface LeaderboardEntry {
  user_id: string;
  name: string;
  xp_total: number;
  level: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
}

// A served adaptive-test item. options is null for free-response kinds.
export interface CatItem {
  item_id: string;
  kind: string;
  prompt: string;
  options: string[] | null;
}

// The in-progress state of an adaptive test session.
export interface CatActive {
  session_id: string;
  done: false;
  theta: number;
  standard_error: number;
  item_count: number;
  item: CatItem;
}

// The terminal state of an adaptive test session.
export interface CatDone {
  done: true;
  message: string;
}

export type CatStartResponse = CatActive | CatDone;

// Narrowing helper for the done state of POST /api/v1/cat/start.
export function isCatDone(res: CatStartResponse): res is CatDone {
  return res.done === true;
}

// The result of answering an adaptive-test item. item is present only when the
// test continues (done is false).
export interface CatAnswerResponse {
  done: boolean;
  session_id: string;
  theta: number;
  standard_error: number;
  item_count: number;
  is_correct: boolean;
  item?: CatItem;
}

// The state of an adaptive-test session from GET /api/v1/cat/{session_id}.
export interface CatStateResponse {
  session_id: string;
  status: string;
  theta: number;
  standard_error: number;
  item_count: number;
  done: boolean;
  item?: CatItem;
}

// The IRT parameters for an item, when calibrated.
export interface ItemIrt {
  a: number;
  b: number;
  c: number;
}

// One row of item analysis from GET /api/v1/analytics/items.
export interface AnalyticsItem {
  item_id: string;
  node_code: string;
  node_title: string;
  kind: string;
  prompt_preview: string;
  n_responses: number;
  p_value: number;
  avg_score: number;
  irt: ItemIrt | null;
}

export interface AnalyticsItemsResponse {
  items: AnalyticsItem[];
}

// One standard (node) row from GET /api/v1/analytics/standards.
export interface StandardNode {
  code: string;
  title: string;
  n_learners: number;
  avg_p_known: number;
  levels: Record<string, number>;
}

export interface StandardsResponse {
  nodes: StandardNode[];
}

// One growth event from GET /api/v1/analytics/growth/me.
export interface GrowthEvent {
  t: string;
  node_id: string;
  correct: boolean;
  p_known_after: number;
}

export interface GrowthResponse {
  events: GrowthEvent[];
  avg_p_known_now: number;
  n_events: number;
}

// -------------------------------------------------------------------------
// Phase 2 helpers.
// -------------------------------------------------------------------------

export function fetchGamification(): Promise<GamificationProfile> {
  return apiGet<GamificationProfile>('/api/v1/gamification/me');
}

export function fetchLeaderboard(): Promise<LeaderboardResponse> {
  return apiGet<LeaderboardResponse>('/api/v1/gamification/leaderboard');
}

export function catStart(): Promise<CatStartResponse> {
  return apiPost<CatStartResponse>('/api/v1/cat/start', {});
}

export function catAnswer(
  sessionId: string,
  answer: string,
): Promise<CatAnswerResponse> {
  return apiPost<CatAnswerResponse>(
    `/api/v1/cat/${encodeURIComponent(sessionId)}/answer`,
    { answer },
  );
}

export function catState(sessionId: string): Promise<CatStateResponse> {
  return apiGet<CatStateResponse>(
    `/api/v1/cat/${encodeURIComponent(sessionId)}`,
  );
}

export function fetchAnalyticsItems(): Promise<AnalyticsItemsResponse> {
  return apiGet<AnalyticsItemsResponse>('/api/v1/analytics/items');
}

export function fetchStandards(): Promise<StandardsResponse> {
  return apiGet<StandardsResponse>('/api/v1/analytics/standards');
}

export function fetchGrowth(): Promise<GrowthResponse> {
  return apiGet<GrowthResponse>('/api/v1/analytics/growth/me');
}

// Fetch a file from the API with the bearer token and trigger a browser
// download. Used by the analytics CSV/PDF export buttons, where a plain anchor
// cannot attach the Authorization header. Throws ApiError on a non-2xx
// response, matching apiGet/apiPost.
export async function downloadAuthed(
  path: string,
  filename: string,
): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${AXIOM_API_URL}${path}`;
  let res: Response;
  try {
    res = await fetch(url, { headers, cache: 'no-store' });
  } catch (err) {
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

  const blob = await res.blob();
  const objectUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(objectUrl);
}

// -------------------------------------------------------------------------
// Phase 3 types (AI Copilot).
//
// The copilot is AI-assisted, not authoritative. Every reply is tagged
// ai_generated:true, names the provider that produced it, and carries the
// sources it was grounded in. When grounded is false the reply was produced
// without matching lesson context and the UI should say so. The consuming UI
// must always present these results as AI-assisted and teacher-overridable.
// -------------------------------------------------------------------------

// One citation attached to a copilot reply, hint, or explanation.
export interface CopilotSource {
  source: string;
  kind: string;
  text: string;
}

// The result of POST /api/v1/copilot/chat.
export interface CopilotChatResult {
  session_id: string;
  ai_generated: true;
  provider: string;
  grounded: boolean;
  reply: string;
  sources: CopilotSource[];
}

// The result of POST /api/v1/copilot/hint.
export interface CopilotHintResult {
  ai_generated: true;
  provider: string;
  grounded: boolean;
  hint: string;
  node_code: string | null;
  sources: CopilotSource[];
}

// The result of POST /api/v1/copilot/explain.
export interface CopilotExplainResult {
  ai_generated: true;
  provider: string;
  grounded: boolean;
  explanation: string;
  node_code: string;
  sources: CopilotSource[];
}

// One stored turn from a copilot session's history.
export interface CopilotMessage {
  role: 'user' | 'assistant';
  content: string;
  provider: string;
  sources: CopilotSource[];
  created_at: string;
}

// A full session transcript from GET /api/v1/copilot/sessions/{id}.
export interface CopilotSessionHistory {
  session_id: string;
  node_id: string | null;
  title: string;
  messages: CopilotMessage[];
}

// -------------------------------------------------------------------------
// Phase 3 helpers (AI Copilot).
// -------------------------------------------------------------------------

export function copilotChat(input: {
  message: string;
  session_id?: string;
  node?: string;
}): Promise<CopilotChatResult> {
  return apiPost<CopilotChatResult>('/api/v1/copilot/chat', input);
}

export function copilotHint(input: {
  response_token?: string;
  node?: string;
  question?: string;
}): Promise<CopilotHintResult> {
  return apiPost<CopilotHintResult>('/api/v1/copilot/hint', input);
}

export function copilotExplain(input: {
  node: string;
  question?: string;
}): Promise<CopilotExplainResult> {
  return apiPost<CopilotExplainResult>('/api/v1/copilot/explain', input);
}

export function fetchCopilotSession(
  id: string,
): Promise<CopilotSessionHistory> {
  return apiGet<CopilotSessionHistory>(
    `/api/v1/copilot/sessions/${encodeURIComponent(id)}`,
  );
}

// -------------------------------------------------------------------------
// Free-response AI grading (teacher review).
//
// Free-response answers are graded by AI. The AI score is never final: a
// teacher can review each one and override it. The review surface and the
// override endpoint below are teacher-only; a student receives 403.
// -------------------------------------------------------------------------

// One AI-graded free response awaiting teacher review, from
// GET /api/v1/grading/free-response/review. override_score is the teacher's
// grade of record when overridden is true.
export interface FreeResponseGradeRow {
  response_id: string;
  student: string;
  prompt: string;
  answer: string;
  ai_score: number;
  ai_is_correct: boolean;
  confidence: number | null;
  overridden: boolean;
  override_score: number | null;
  override_note: string;
}

// The result of POST /api/v1/grading/{response_id}/override. overrode_ai_score
// is the AI score that the teacher's grade replaced.
export interface OverrideGradeResult {
  response_id: string;
  score: number;
  is_correct: boolean;
  note: string;
  overrode_ai_score: number;
}

// Teacher-only. Throws ApiError with status 403 for a student.
export function fetchGradingReview(): Promise<{
  items: FreeResponseGradeRow[];
}> {
  return apiGet<{ items: FreeResponseGradeRow[] }>(
    '/api/v1/grading/free-response/review',
  );
}

// Teacher-only. Records a teacher override for one AI-graded response. Throws
// ApiError with status 403 for a student.
export function overrideGrade(
  responseId: string,
  input: { score: number; is_correct: boolean; note: string },
): Promise<OverrideGradeResult> {
  return apiPost<OverrideGradeResult>(
    `/api/v1/grading/${encodeURIComponent(responseId)}/override`,
    input,
  );
}

// -------------------------------------------------------------------------
// Notifications (in-app inbox).
// -------------------------------------------------------------------------

// One notification from GET /api/v1/notifications. kind selects the small
// coloured badge shown in the inbox. link is a relative route the row navigates
// to when opened; it may be empty.
export interface NotificationItem {
  id: string;
  kind: 'assignment' | 'badge' | 'grade' | 'system';
  title: string;
  body: string;
  link: string;
  read: boolean;
  created_at: string;
}

// The inbox payload from GET /api/v1/notifications. unread_count counts the
// unread items regardless of the unread_only filter.
export interface NotificationsResponse {
  items: NotificationItem[];
  unread_count: number;
}

// Fetch the notification inbox. Pass unreadOnly to limit the items to unread
// notifications; the unread count is always the full unread total.
export function fetchNotifications(
  unreadOnly = false,
): Promise<NotificationsResponse> {
  const query = unreadOnly ? '?unread_only=true' : '';
  return apiGet<NotificationsResponse>(`/api/v1/notifications${query}`);
}

// Fetch just the unread notification count, for the nav indicator.
export function fetchUnreadCount(): Promise<{ count: number }> {
  return apiGet<{ count: number }>('/api/v1/notifications/unread-count');
}

// Mark one notification as read.
export function markNotificationRead(id: string): Promise<{ ok: boolean }> {
  return apiPost<{ ok: boolean }>(
    `/api/v1/notifications/${encodeURIComponent(id)}/read`,
    {},
  );
}

// Mark every notification as read. Returns how many were newly marked.
export function markAllNotificationsRead(): Promise<{ marked: number }> {
  return apiPost<{ marked: number }>('/api/v1/notifications/read-all', {});
}

// -------------------------------------------------------------------------
// Review mistakes.
// -------------------------------------------------------------------------

// One incorrect answer from GET /api/v1/practice/mistakes. kind is the practice
// item kind (mcq_single, numeric, and so on). your_answer is what the learner
// submitted; correct_answer is the expected answer; explanation is the graded
// rationale. submitted_at is an ISO timestamp.
export interface MistakeItem {
  response_id: string;
  node_title: string;
  kind: string;
  prompt: string;
  your_answer: string;
  correct_answer: string;
  explanation: string;
  submitted_at: string;
}

// Fetch the signed-in learner's recent incorrect answers, most recent first.
export function fetchMistakes(): Promise<{ items: MistakeItem[] }> {
  return apiGet<{ items: MistakeItem[] }>('/api/v1/practice/mistakes');
}
