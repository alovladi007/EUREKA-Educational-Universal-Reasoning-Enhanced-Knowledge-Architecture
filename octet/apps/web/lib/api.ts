// Typed fetch wrapper for the OCTET API.
//
// OCTET does not own identity. EUREKA issues the JWT and opens OCTET with it
// in the URL hash (#access_token=...). The hash is client-only: it is never
// sent to a server and never lands in a server log, which is why the token
// travels in the fragment rather than a query string. We capture it into
// localStorage under the same key EUREKA uses ("access_token"), strip it from
// the address bar, and send it as a bearer token on every request.
//
// When there is no token we do not crash. getToken returns null, the app shell
// renders a sign-in prompt, and no request is made.

export const OCTET_API_URL =
  process.env.NEXT_PUBLIC_OCTET_API_URL || 'http://localhost:8500';

export const EUREKA_LOGIN_URL =
  process.env.NEXT_PUBLIC_EUREKA_LOGIN_URL ||
  'http://localhost:4040/auth/login';

// Every versioned endpoint sits behind this prefix.
export const API_PREFIX = '/api/v1';

// The localStorage key EUREKA's web app writes the JWT to. Shared on purpose:
// a learner who signed in on EUREKA is signed in here.
export const TOKEN_STORAGE_KEY = 'access_token';

// A typed error thrown for any non-2xx response. Callers inspect status to
// tell an auth failure (401/403) from anything else. status 0 means the
// request never reached the API (server down, CORS, DNS).
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

// Pull a handed-over token out of the URL hash, store it, and clean the hash
// away with history.replaceState so the token does not linger in the address
// bar or in the browser history entry. Safe to call repeatedly.
function captureHandoffToken(): void {
  if (typeof window === 'undefined') {
    return;
  }
  const hash = window.location.hash;
  if (!hash || !hash.includes('access_token=')) {
    return;
  }
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const handed = params.get('access_token');
  if (!handed) {
    return;
  }
  window.localStorage.setItem(TOKEN_STORAGE_KEY, handed);
  params.delete('access_token');
  const rest = params.toString();
  const cleaned =
    window.location.pathname + window.location.search + (rest ? `#${rest}` : '');
  window.history.replaceState(null, '', cleaned);
}

// The current token, or null. Returns null on the server (no localStorage) and
// whenever no token has been handed over. Callers must treat null as "show the
// sign-in prompt", never as an error.
export function getToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    captureHandoffToken();
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies).
    return null;
  }
}

// Drop the stored token. Called when the API rejects it, so a stale token is
// not resent forever.
// Fired when a token is discarded, so the shell can drop back to the sign-in
// prompt. Without this the gate keeps rendering the page it decided on at
// mount: the token is gone from storage, every request 403s, and the learner
// is looking at a screen that appears to be working. That is the state a
// session expiring mid-use actually produces, and it reads as the app being
// broken rather than as needing to sign in again.
export const TOKEN_CLEARED_EVENT = 'octet:token-cleared';

export function clearToken(): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Ignore storage errors.
  }
  try {
    window.dispatchEvent(new Event(TOKEN_CLEARED_EVENT));
  } catch {
    // Ignore environments without a working event constructor.
  }
}

// True when a token is present. The app shell uses this to choose between the
// page and the sign-in prompt.
export function hasToken(): boolean {
  return getToken() !== null;
}

// Attach the bearer token and disable caching. A 401 clears the stored token
// so the next render falls through to the sign-in prompt rather than looping.
async function authedFetch(url: string, init: RequestInit): Promise<Response> {
  const headers = new Headers(init.headers as HeadersInit | undefined);
  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const res = await fetch(url, { ...init, headers, cache: 'no-store' });
  if (res.status === 401) {
    clearToken();
  }
  return res;
}

async function readBody(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return '';
  }
}

// FastAPI reports errors as {"detail": "..."}. Surface that string when it is
// there, because it carries the real reason (for example the hint gate's
// message about a rung that is not unlocked yet).
function messageFrom(path: string, status: number, body: string): string {
  try {
    const parsed = JSON.parse(body) as { detail?: unknown };
    if (typeof parsed.detail === 'string' && parsed.detail.trim()) {
      return parsed.detail;
    }
  } catch {
    // Not JSON. Fall through to the generic message.
  }
  return `Request to ${path} returned ${status}`;
}

// GET a versioned endpoint and parse the JSON body as T. Throws ApiError on
// any non-2xx response. path is relative to /api/v1 (for example "/templates").
export async function apiGet<T>(path: string): Promise<T> {
  const url = `${OCTET_API_URL}${API_PREFIX}${path}`;
  let res: Response;
  try {
    res = await authedFetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'network error';
    throw new ApiError(0, `Request to ${path} failed: ${message}`, '');
  }
  if (!res.ok) {
    const body = await readBody(res);
    throw new ApiError(res.status, messageFrom(path, res.status, body), body);
  }
  return (await res.json()) as T;
}

// POST a JSON body to a versioned endpoint. Same error semantics as apiGet.
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const url = `${OCTET_API_URL}${API_PREFIX}${path}`;
  let res: Response;
  try {
    res = await authedFetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body ?? {}),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'network error';
    throw new ApiError(0, `Request to ${path} failed: ${message}`, '');
  }
  if (!res.ok) {
    const text = await readBody(res);
    throw new ApiError(res.status, messageFrom(path, res.status, text), text);
  }
  return (await res.json()) as T;
}

// The unversioned health probe, used by nothing on the critical path but handy
// for a status readout.
export async function fetchHealth(): Promise<{
  status: string;
  service: string;
  version: string;
}> {
  const res = await fetch(`${OCTET_API_URL}/health`, { cache: 'no-store' });
  if (!res.ok) {
    throw new ApiError(res.status, `Health check returned ${res.status}`, '');
  }
  return (await res.json()) as {
    status: string;
    service: string;
    version: string;
  };
}

// -------------------------------------------------------------------------
// Curriculum
// -------------------------------------------------------------------------

// The curriculum is a three level tree: course, unit, node. That shape is not
// cosmetic. A registrar, a syllabus and a textbook are all organized as course
// then unit then topic, so anything flatter cannot be mapped onto a real
// course, and anything without units gives a 312 node program no shape at any
// zoom level.

// One node of the chemistry knowledge graph.
//
// code is the stable key: it names the lesson file, the item templates and the
// /learn/{code} route. It is NOT a label. A learner is shown `number` and
// `title` and never the code, which appears only in an instructor or author
// view.
//
// authored says whether a lesson exists behind this node. Most of the program
// is mapped but not yet written, and the page has to be able to tell the two
// apart, because a node that looks ready and opens to nothing is worse than a
// node that says it is not ready.
export interface CurriculumNode {
  code: string;
  title: string;
  description: string;
  // Positional and generated, for example "3.4": unit index within the course,
  // node index within the unit. This is what a learner sees.
  number: string;
  // "concept" or "computational".
  kind: string;
  // Owning course id and unit id.
  course: string;
  unit: string;
  // Node codes, not titles. Resolve them against the tree before display.
  prerequisites: string[];
  lab_adjacent: boolean;
  triangle_eligible: boolean;
  authored: boolean;
}

// One unit within a course. chapters is the textbook chapter mapping, for
// example "Ch 3". It is what makes syllabus alignment possible during an
// adoption conversation, so it is instructor facing rather than dropped.
export interface CurriculumUnit {
  id: string;
  title: string;
  chapters: string;
  index: number;
  nodes: CurriculumNode[];
}

export interface CurriculumCourse {
  id: string;
  title: string;
  semester: string;
  units: CurriculumUnit[];
}

// The body GET /curriculum/nodes returns.
export interface CurriculumTree {
  courses: CurriculumCourse[];
  counts: Record<string, number>;
}

// What getCurriculumNodes hands back: the tree exactly as the API sent it,
// plus two flat views derived from it. The flat views are a projection of the
// same response, not extra data, and they exist so callers that only need to
// look one node up by code do not have to walk the tree themselves.
export interface CurriculumNodes extends CurriculumTree {
  // Every node in the program, in course then unit then node order.
  nodes: CurriculumNode[];
  // Alias of counts, kept for callers written against the earlier shape.
  tier_counts: Record<string, number>;
}

// The try-it part of a lesson. The answer is returned by the API so the client
// can render it click-to-reveal. The teaching model requires the learner to
// attempt the question before seeing it, so the answer must stay hidden until
// the learner asks for it. That is a binding rule, not a preference.
export interface LessonTryIt {
  prompt: string;
  answer: string;
  reveal: string;
}

// GET /curriculum/lessons/{node}. The six part arc, in teaching order:
// objective, build_on, core_idea, worked_example, try_it, pitfall.
export interface Lesson {
  node: string;
  objective: string;
  build_on: string;
  core_idea: string;
  worked_example: string;
  try_it: LessonTryIt;
  pitfall: string;
  misconception: string | null;
}

// GET /curriculum/nodes. Pass a course id to fetch one course.
//
// The flat views are computed here rather than requested, so there is exactly
// one place that knows how the tree flattens and no chance of the flat list
// and the tree disagreeing about what the program contains.
export async function getCurriculumNodes(
  course?: string,
): Promise<CurriculumNodes> {
  const query = course ? `?course=${encodeURIComponent(course)}` : '';
  const payload = await apiGet<CurriculumTree>(`/curriculum/nodes${query}`);
  const courses = payload.courses ?? [];
  const counts = payload.counts ?? {};
  const nodes: CurriculumNode[] = [];
  for (const c of courses) {
    for (const unit of c.units ?? []) {
      for (const node of unit.nodes ?? []) {
        nodes.push(node);
      }
    }
  }
  return { courses, counts, nodes, tier_counts: counts };
}

export function getLesson(nodeCode: string): Promise<Lesson> {
  return apiGet<Lesson>(
    `/curriculum/lessons/${encodeURIComponent(nodeCode)}`,
  );
}

// -------------------------------------------------------------------------
// Templates and practice
// -------------------------------------------------------------------------

// One item template. hint_rungs is 3 when a full ladder exists, 0 when none.
export interface TemplateSummary {
  template_id: string;
  node: string;
  grader: string;
  hint_rungs: number;
}

// GET /templates.
export interface TemplateList {
  templates: TemplateSummary[];
  supported_graders: string[];
}

// One multiple-choice option. The API strips the correct index on the serve
// path, so nothing here identifies the answer.
export interface Choice {
  index: number;
  text: string;
}

// Public metadata attached to a served variant. For the "mc" grader this is
// {choices}. Other graders carry their own answer-free fields, so the rest is
// left unknown rather than pretended to be typed.
export interface VariantMeta {
  choices?: Choice[];
  [key: string]: unknown;
}

// GET /practice/next. seed identifies the exact variant and must be sent back
// with the submission. No answer key is present, by design.
export interface Variant {
  template_id: string;
  seed: number;
  prompt: string;
  node: string;
  grader: string;
  meta: VariantMeta;
  verified_by: string;
}

// GET /practice/hint. One rung of the ladder, never above what is unlocked.
export interface Hint {
  template_id: string;
  rung: number;
  text: string;
}

// One step outcome inside a chained problem. The first entry with ok false is
// where the learner's work went wrong.
export interface Milestone {
  ok?: boolean;
  step?: string;
  detail?: string;
  [key: string]: unknown;
}

// POST /practice/submit. graded false means the submission could not be parsed
// at all, which is different from a parsed but wrong answer. There is no
// correct answer in this payload: the API does not return one on the grading
// path, and the UI must not invent one.
export interface GradeResult {
  is_correct: boolean;
  score: number;
  graded: boolean;
  grader: string;
  detail: string;
  misconception: string | null;
  milestones: Milestone[];
}

// Serve the next variant of a template. count is the learner's attempt count
// for this template and seeds the variant, so passing 0 serves the first one.
export function getNextItem(
  templateId: string,
  count = 0,
): Promise<Variant> {
  return apiGet<Variant>(
    `/practice/next?template_id=${encodeURIComponent(templateId)}&count=${count}`,
  );
}

// Ask for one hint rung. rung must never exceed unlocked: the API refuses with
// 403 and the UI must not attempt it, because unlocking rungs in order is the
// teaching model, not a rate limit.
export function getHint(
  templateId: string,
  rung: number,
  unlocked: number,
): Promise<Hint> {
  return apiGet<Hint>(
    `/practice/hint?template_id=${encodeURIComponent(templateId)}` +
      `&rung=${rung}&unlocked=${unlocked}`,
  );
}

export function getTemplates(): Promise<TemplateList> {
  return apiGet<TemplateList>('/templates');
}

export function submitAnswer(
  templateId: string,
  seed: number,
  answer: string,
): Promise<GradeResult> {
  return apiPost<GradeResult>('/practice/submit', {
    template_id: templateId,
    seed,
    answer,
  });
}

// -------------------------------------------------------------------------
// Path
// -------------------------------------------------------------------------

// Whether a node can be worked on now, is waiting on prerequisites, or is done.
export type PathState = 'ready' | 'blocked' | 'mastered';

// One planned node. reason is written for the learner and always present: the
// planner explains every decision rather than asserting one.
export interface PathEntry {
  node: string;
  title: string;
  tier: string;
  p_known: number;
  level: string;
  state: PathState;
  reason: string;
}

// GET /path. note carries any honest caveat from the server, for example that
// mastery is not persisted yet and the plan starts cold.
export interface PathPlan {
  plan: PathEntry[];
  recommended_node: string | null;
  note?: string;
}

export function getPath(): Promise<PathPlan> {
  return apiGet<PathPlan>('/path');
}

// -------------------------------------------------------------------------
// Compliance
// -------------------------------------------------------------------------

// One failed check. severity is present on warnings only.
export interface ComplianceProblem {
  check: string;
  detail: string;
  severity?: string;
}

// GET /compliance. The teaching model checklist, run live. green is false when
// anything blocking is outstanding, and blocking_count says how much.
export interface ComplianceReport {
  green: boolean;
  blocking_count: number;
  blocking: ComplianceProblem[];
  by_check: Record<string, number>;
  warnings_count: number;
  warnings: ComplianceProblem[];
  counts: Record<string, number>;
}

export function getCompliance(): Promise<ComplianceReport> {
  return apiGet<ComplianceReport>('/compliance');
}

// -------------------------------------------------------------------------
// Misconceptions
// -------------------------------------------------------------------------

// One named misconception. review reads "pending" until a subject matter
// expert signs it off, and nothing may present a pending entry as verified.
export interface Misconception {
  code: string;
  name: string;
  description: string;
  counterexample: string;
  routes_to: string;
  source: string;
  review: string;
}

export interface MisconceptionList {
  misconceptions: Misconception[];
  awaiting_sme_review: string[];
}

export function getMisconceptions(): Promise<MisconceptionList> {
  return apiGet<MisconceptionList>('/misconceptions');
}

// -------------------------------------------------------------------------
// Visualization surfaces (Phase 3)
//
// These back the periodic table, the molecule viewer, the chemistry triangle
// and the predict, observe, explain simulators. The shapes below are read off
// the live routers in app/domains/chemistry/router.py rather than guessed.
// -------------------------------------------------------------------------

export interface PeriodicElement {
  symbol: string;
  name: string;
  number: number;
  period: number;
  group: number | null;
  block: string;
  category: string;
  atomic_mass: number;
  electron_configuration: string;
  // null is a real answer, not missing data. Helium has no Pauling
  // electronegativity because it forms no bonds to define one. Render the gap.
  electronegativity: number | null;
  atomic_radius_pm: number | null;
  ionization_energy_kJmol: number | null;
  electron_affinity_kJmol: number | null;
  state_at_stp: string;
  note: string;
}

export interface TrendCoverage {
  field: string;
  measured: number;
  missing: number;
  total: number;
  fraction: number;
  missing_numbers: number[];
  review: string;
}

export interface PeriodicTable {
  elements: PeriodicElement[];
  trend_fields: string[];
  coverage: Record<string, TrendCoverage>;
  ranges: Record<string, [number, number] | null>;
  review: string;
}

export interface Molecule {
  name: string;
  smiles: string;
  formula: string;
  molar_mass: number;
  inchikey: string;
  category: string;
  real_world_note: string;
  hazard_notes: string[];
  // The library stores connectivity, not coordinates, so the viewer must say
  // what it is showing rather than presenting a layout as a measurement.
  has_3d: boolean;
  coordinates_note: string;
  review: string;
}

export interface MoleculeList {
  molecules: Array<Omit<Molecule, 'has_3d' | 'coordinates_note' | 'review'>>;
  total_matching: number;
  categories: string[];
  library_size: number;
}

export interface TriangleView {
  node: string;
  title: string;
  macroscopic: string;
  particulate: string;
  symbolic: string;
  katex: string;
  caption: string;
  connector: string;
  pitfall: string;
  review: string;
}

export interface SimulationScenario {
  id: string;
  kind: 'titration' | 'equilibrium';
  title: string;
  description: string;
  node: string;
}

export interface PoeActivity {
  id: string;
  node: string;
  scenario: string;
  prompt: string;
}

export interface SimulationCatalogue {
  scenarios: SimulationScenario[];
  activities: PoeActivity[];
}

export interface PoeOption {
  id: string;
  text: string;
}

// The ticket is signed server side and carries the phase. It is the only
// thing that lets the server know a prediction was recorded, so it has to be
// passed back on every subsequent step.
export interface PoeStart {
  ticket: string;
  item_id: string;
  node: string;
  scenario: string;
  phase: string;
  prompt: string;
  options: PoeOption[];
  scenario_title: string;
  scenario_description: string;
}

export interface TitrationResult {
  scenario: string;
  kind: 'titration';
  title: string;
  description: string;
  curve: Array<{ volume_mL: number; pH: number }>;
  landmarks: Record<string, number>;
  analyte: string;
  titrant: string;
  is_strong_acid: boolean;
  pka: number | null;
  source: string;
  x_label: string;
  y_label: string;
}

export interface EquilibriumResult {
  scenario: string;
  kind: 'equilibrium';
  title: string;
  description: string;
  label: string;
  k: number;
  source: string;
  stress: Record<string, number>;
  direction: 'forward' | 'reverse' | 'none';
  extent: number;
  q_before: number;
  q_after: number;
  before: Record<string, number>;
  stressed: Record<string, number>;
  after: Record<string, number>;
}

export type SimulationResult = TitrationResult | EquilibriumResult;

export interface PoePredictResult {
  ticket: string;
  phase: string;
  prediction: string;
  is_correct: boolean;
  score: number;
  detail: string;
  misconception: string | null;
  verified_by: string;
  observe_prompt: string;
  simulation: SimulationResult;
}

export interface PoeObserveResult {
  ticket: string;
  phase: string;
  graded: false;
  note: string;
  prompt: string;
  options: PoeOption[];
  reflection_prompt: string;
}

export interface PoeExplainResult {
  ticket: string;
  phase: string;
  is_correct: boolean;
  score: number;
  detail: string;
  misconception: string | null;
  prediction_was_correct: boolean;
  reflection: { recorded: boolean; graded: false; note: string };
}

export function getPeriodicTable(): Promise<PeriodicTable> {
  return apiGet<PeriodicTable>('/periodic-table');
}

export function getPeriodicTrend(field: string): Promise<{
  field: string;
  values: Record<string, number>;
  range: [number, number] | null;
  coverage: TrendCoverage;
  review: string;
}> {
  return apiGet(`/periodic-table/trends/${encodeURIComponent(field)}`);
}

export function getMolecules(params: {
  search?: string;
  category?: string;
  limit?: number;
} = {}): Promise<MoleculeList> {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.category) query.set('category', params.category);
  if (params.limit) query.set('limit', String(params.limit));
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return apiGet<MoleculeList>(`/molecules${suffix}`);
}

export function getMolecule(name: string): Promise<Molecule> {
  return apiGet<Molecule>(`/molecules/${encodeURIComponent(name)}`);
}

export function getTriangleIndex(): Promise<{
  nodes: string[];
  count: number;
  review: string;
}> {
  return apiGet('/triangle');
}

export function getTriangle(node: string): Promise<TriangleView> {
  return apiGet<TriangleView>(`/triangle/${encodeURIComponent(node)}`);
}

export function getSimulations(): Promise<SimulationCatalogue> {
  return apiGet<SimulationCatalogue>('/simulations');
}

// Opens an activity. Deliberately returns no simulation data: the learner has
// nothing to look at until a prediction is recorded.
export function startPoe(itemId: string): Promise<PoeStart> {
  return apiPost<PoeStart>(
    `/simulations/poe/start?item_id=${encodeURIComponent(itemId)}`,
    {},
  );
}

// Records the prediction and only then returns the simulation. There is no
// other route to the result, which is what makes the prediction a commitment.
export function predictPoe(
  ticket: string,
  choice: string,
): Promise<PoePredictResult> {
  return apiPost<PoePredictResult>('/simulations/poe/predict', {
    ticket,
    choice,
  });
}

export function observePoe(
  ticket: string,
  observation: string,
): Promise<PoeObserveResult> {
  return apiPost<PoeObserveResult>('/simulations/poe/observe', {
    ticket,
    observation,
  });
}

export function explainPoe(
  ticket: string,
  choice: string,
  reflection = '',
): Promise<PoeExplainResult> {
  return apiPost<PoeExplainResult>('/simulations/poe/explain', {
    ticket,
    choice,
    reflection,
  });
}

// Submit a drawn structure to grader 4. The sketcher produces SMILES, which is
// the answer. Grading runs against the stored key of the issued variant.
export function submitStructure(
  templateId: string,
  seed: number,
  smiles: string,
): Promise<GradeResult> {
  return apiPost<GradeResult>('/structure/submit', {
    template_id: templateId,
    seed,
    smiles,
  });
}

// -------------------------------------------------------------------------
// Exams
//
// An exam is not a practice session with a clock on it, and the shapes below
// are what enforce that. Read them against app/domains/exams/router.py.
//
// Three absences are deliberate and must survive any later edit:
//
//   1. There is no hint type and no hint call. The API has no exam hint route.
//      hints_available is typed as the literal false so a control that depends
//      on it being true cannot be written without the compiler objecting.
//   2. The answer response carries no grade. ExamAnswerSaved has saved,
//      position, answered, seconds_remaining and note, and nothing else. There
//      is no is_correct on it because the server does not send one while the
//      attempt is open.
//   3. ExamResult carries raw counts and raw_percent only. No scaled score, no
//      letter grade, no pass mark and no percentile appear here, because the
//      API omits them on purpose and inventing one in the client would put the
//      exact number back that the server refused to compute.
// -------------------------------------------------------------------------

// One section of a blueprint, as the catalogue reports it. minutes is an
// assumption stated by the blueprint, not a measured figure.
export interface ExamSection {
  id: string;
  title: string;
  items: number;
  minutes: number;
}

// One entry in GET /exams. available is false when the item bank cannot
// currently assemble the blueprint, and the catalogue still lists it so a
// broken exam is visible rather than failing when a learner presses start.
// review reads "pending" until a subject matter expert signs the blueprint
// off, and basis states what the blueprint was derived from.
export interface ExamSummary {
  code: string;
  title: string;
  description: string;
  scope: string;
  items: number;
  minutes: number;
  sections: ExamSection[];
  basis: string;
  review: string;
  available: boolean;
}

// GET /exams. note carries the platform's own caveat about what these
// blueprints are and are not, and is rendered verbatim.
export interface ExamCatalogue {
  exams: ExamSummary[];
  note: string;
}

// An attempt is forward only: in_progress to submitted, or in_progress to
// expired. There is no reopening.
export type ExamAttemptStatus = 'in_progress' | 'submitted' | 'expired';

// One item on the form a learner holds. No answer key, no node, no template
// id and no seed: the served form carries the question and nothing that
// identifies the answer. meta.choices is present for the "mc" grader, and the
// answer submitted for that grader is the choice index as a string.
export interface ExamItem {
  position: number;
  section_id: string;
  prompt: string;
  grader: string;
  meta: VariantMeta;
  // The answer the server currently holds, or an empty string. Present so
  // a reload rehydrates the fields rather than showing blanks, which during
  // a timed exam reads as the work having been lost.
  answer: string;
}

// Per section counts on a submitted result. ungradable is separate from wrong
// on purpose: an answer the grader could not read is not evidence of a wrong
// belief, so it is excluded from raw_percent rather than counted against the
// learner. raw_percent is null when nothing gradable was measured, which is a
// different fact from zero and must be rendered as one.
export interface ExamSectionScore {
  section_id: string;
  items: number;
  answered: number;
  correct: number;
  ungradable: number;
  raw_percent: number | null;
}

export interface ExamNodeScore {
  node: string;
  items: number;
  correct: number;
}

export interface ExamMisconceptionCount {
  code: string;
  count: number;
}

// The result of a submitted attempt. was_late is true when the server closed
// the attempt because its time ran out and scored what had been answered.
// notes explain what the counts do and do not mean, and are rendered verbatim.
export interface ExamResult {
  blueprint_code: string;
  items: number;
  answered: number;
  correct: number;
  ungradable: number;
  raw_percent: number | null;
  sections: ExamSectionScore[];
  nodes: ExamNodeScore[];
  misconceptions: ExamMisconceptionCount[];
  notes: string[];
  was_late: boolean;
}

// The learner's view of an attempt. result is present only once status is
// "submitted"; while the attempt is open there is nothing to put in it.
//
// seconds_remaining is the authoritative clock. It is computed by the server
// against the stored expiry, so it is the only value the client may trust. A
// client may tick it down for smoothness between requests, and must resync to
// the value returned with every answer.
export interface ExamAttemptView {
  attempt_id: string;
  blueprint_code: string;
  status: ExamAttemptStatus;
  seconds_remaining: number;
  items: ExamItem[];
  // Positions the server holds a response for.
  answered: number[];
  notes: string[];
  hints_available: false;
  feedback_policy: string;
  result?: ExamResult;
}

// POST /exams/attempts/{id}/answer. answered is the full set of positions the
// server has a response row for, so it is the authority on answered versus not
// answered. There is no grade in this payload and none is coming until submit.
export interface ExamAnswerSaved {
  saved: true;
  position: number;
  answered: number[];
  seconds_remaining: number;
  note: string;
}

export function getExams(): Promise<ExamCatalogue> {
  return apiGet<ExamCatalogue>('/exams');
}

// Open an attempt. Throws ApiError with status 409 when the learner already
// has this exam open, or when the bank cannot assemble the blueprint. The
// message on that error is written for the learner and must be shown as it
// stands rather than replaced with a generic failure.
export function startExamAttempt(
  blueprintCode: string,
): Promise<ExamAttemptView> {
  return apiPost<ExamAttemptView>('/exams/attempts', {
    blueprint_code: blueprintCode,
  });
}

export function getExamAttempt(attemptId: string): Promise<ExamAttemptView> {
  return apiGet<ExamAttemptView>(
    `/exams/attempts/${encodeURIComponent(attemptId)}`,
  );
}

// Record one answer. Returns no grade. For the "mc" grader the answer is the
// choice index as a string; every other grader takes the learner's text.
export function saveExamAnswer(
  attemptId: string,
  position: number,
  answer: string,
): Promise<ExamAnswerSaved> {
  return apiPost<ExamAnswerSaved>(
    `/exams/attempts/${encodeURIComponent(attemptId)}/answer`,
    { position, answer },
  );
}

// Close the attempt and grade it. Throws ApiError with status 409 when the
// attempt was already submitted or when its time has run out, and that
// message is the one the learner needs to read.
export function submitExamAttempt(attemptId: string): Promise<ExamResult> {
  return apiPost<ExamResult>(
    `/exams/attempts/${encodeURIComponent(attemptId)}/submit`,
    {},
  );
}
