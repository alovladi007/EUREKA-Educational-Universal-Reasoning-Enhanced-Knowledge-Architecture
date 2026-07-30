// Fetch layer for the analytics surface: the overview rollup, the per-node
// mastery map and the recent practice history. The shapes below are read off
// the live router in apps/api/app/domains/practice/router.py rather than
// guessed.
//
// Everything here rides on apiGet from lib/api.ts, so the bearer token, the
// base URL and the error semantics stay defined in exactly one place.

import { apiGet } from '@/lib/api';

// The four states the mastery model can assign a node. Derived server side
// from attempts and an exponentially weighted accuracy, in one place, so the
// client never recomputes the claim.
export type MasteryState =
  | 'ready'
  | 'in_progress'
  | 'needs_review'
  | 'mastered';

// -------------------------------------------------------------------------
// GET /analytics/overview
// -------------------------------------------------------------------------

// accuracy everywhere in this file is a fraction from 0 to 1, rounded to
// three places by the API. Multiply by 100 before showing a percent. When
// attempts is 0 the API sends 0.0 as a placeholder, which is not a measured
// accuracy and must not be rendered as one.
export interface AnalyticsTotals {
  attempts: number;
  correct: number;
  accuracy: number;
}

// One row of the per-course or per-unit rollup. Only scopes with at least one
// graded attempt appear; the API never pads with zero rows.
export interface AnalyticsRollupRow {
  id: string;
  title: string;
  attempts: number;
  correct: number;
  accuracy: number;
}

// One entry of the weakest-nodes list. The API includes a node only after at
// least two graded attempts, so a single unlucky miss cannot brand a node.
export interface WeakNode {
  node: string;
  title: string;
  unit: string;
  attempts: number;
  correct: number;
  accuracy: number;
}

// Counts of nodes per mastery state. A state with no nodes is absent, not
// zero.
export type MasteryStateCounts = Partial<Record<MasteryState, number>>;

// The compact result on a recent exam row. The API forwards only these keys
// from the stored result and only when present, so every field is optional,
// and the whole object is null when no result was stored.
export interface RecentExamResult {
  correct?: number;
  total?: number;
  fraction?: number;
}

export interface RecentExam {
  attempt_id: string;
  blueprint_code: string;
  submitted_at: string | null;
  result: RecentExamResult | null;
}

export interface AnalyticsOverview {
  totals: AnalyticsTotals;
  by_course: AnalyticsRollupRow[];
  by_unit: AnalyticsRollupRow[];
  weakest_nodes: WeakNode[];
  mastery_states: MasteryStateCounts;
  recent_exams: RecentExam[];
  // The API's own caveat about what these figures are and are not (there are
  // no cohort percentiles because there is no cohort). Rendered verbatim.
  note: string;
}

export function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  return apiGet<AnalyticsOverview>('/analytics/overview');
}

// -------------------------------------------------------------------------
// GET /analytics/mastery
// -------------------------------------------------------------------------

// One learner's record on one node. accuracy_ewma is an exponentially
// weighted accuracy (alpha 0.3): recent attempts dominate, so recovery from
// early misses shows quickly. It is recent accuracy, not a completion
// percentage, and must be labelled as such.
export interface NodeMasteryRecord {
  attempts: number;
  correct: number;
  streak: number;
  accuracy_ewma: number;
  state: MasteryState;
}

// Keyed by node code. A node the learner has never attempted has no entry at
// all, which is a different fact from an entry with zero attempts.
export type MasteryIndex = Record<string, NodeMasteryRecord>;

export interface MasteryMap {
  nodes: MasteryIndex;
}

export function getMasteryMap(): Promise<MasteryMap> {
  return apiGet<MasteryMap>('/analytics/mastery');
}

// -------------------------------------------------------------------------
// GET /practice/sessions
// -------------------------------------------------------------------------

// One row of practice history. summary is written at submission (correct,
// total, per-unit rollup) and is null while the session is open.
export interface PracticeSessionRow {
  session_id: string;
  // "tutor" or "timed".
  mode: string;
  // "in_progress" or "submitted".
  status: string;
  started_at: string | null;
  config: Record<string, unknown>;
  summary: { correct?: number; total?: number; [key: string]: unknown } | null;
  item_count: number;
}

export interface PracticeSessionList {
  sessions: PracticeSessionRow[];
}

export function getRecentPracticeSessions(
  limit = 5,
): Promise<PracticeSessionList> {
  return apiGet<PracticeSessionList>(`/practice/sessions?limit=${limit}`);
}

// -------------------------------------------------------------------------
// Formatting
// -------------------------------------------------------------------------

// A fraction to a whole percent string. Shared so the dashboard and the
// analytics page cannot round the same number differently.
export function percentOf(fraction: number): string {
  return `${Math.round(Math.min(Math.max(fraction, 0), 1) * 100)}%`;
}

// A blueprint code to a readable exam title. The codes are structured, for
// example "exam.unit.gen1-u1", and showing them raw to a learner reads as a
// leaked identifier rather than a name. Anything that does not match the known
// shape is returned unchanged rather than mangled.
export function examTitle(code: string): string {
  const m = /^exam\.unit\.([a-z]+\d*)-u(\d+)$/.exec(code);
  if (!m) {
    return code;
  }
  return `${m[1].toUpperCase()} Unit ${m[2]} exam`;
}

// An ISO timestamp to a short local date-and-time line, or the stated
// fallback when the API sent null.
export function formatWhen(iso: string | null, fallback: string): string {
  if (!iso) {
    return fallback;
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
