// Fetch layer for the practice session pages: the builder at /practice and
// the player and review at /practice/session/[id].
//
// Everything here rides on the authed helpers in lib/api.ts, so auth, the
// error shape and the FastAPI detail-string convention are identical to the
// rest of the app. This file adds only the shapes and routes of the practice
// session endpoints, plus the sessionStorage persistence the player needs.
//
// Why sessionStorage: the API has no GET for an open session, on purpose. The
// items of a session exist client side only in the response to the start
// POST, so the tab that starts a session writes them to sessionStorage and
// the player reads them back. That storage is per tab, which means an open
// session can only be worked in the tab that started it. Review, which the
// API does serve, opens from anywhere once the session is finished.

import { apiGet, apiPost } from './api';

// -------------------------------------------------------------------------
// Shapes, read off apps/api/app/domains/practice/router.py and sessions.py
// rather than guessed.
// -------------------------------------------------------------------------

export type PracticeMode = 'tutor' | 'timed';

// One unit in GET /practice/catalogue. available is false when the unit has
// no practice templates yet; the builder lists it anyway and says why it is
// disabled, because hiding it would misrepresent the course as smaller than
// it is.
export interface PracticeUnit {
  unit_id: string;
  title: string;
  course: string;
  index: number;
  templates: number;
  available: boolean;
}

export interface PracticeCatalogue {
  units: PracticeUnit[];
}

export interface PracticeChoice {
  index: number;
  text: string;
}

// One disconnection offered by a "retro" (retrosynthesis) item. name is the
// disconnection the learner selects; forms says, in words, what bond or group
// it makes; abstracts, when present, names the condition it stands in for. The
// answer key (which disconnection is correct) never travels in this list.
export interface RetroDisconnectionOption {
  name: string;
  forms: string;
  abstracts?: string;
}

// Answer-free metadata on a served item. choices is present for the "mc"
// grader; disconnections is present for the "retro" grader; other graders
// carry their own fields, left unknown rather than pretended to be typed.
export interface PracticeItemMeta {
  choices?: PracticeChoice[];
  disconnections?: RetroDisconnectionOption[];
  [key: string]: unknown;
}

// One item on a session, as the start POST returns it. No answer key is
// present anywhere in this payload, by design.
export interface PracticeItem {
  position: number;
  template_id: string;
  seed: number;
  node: string;
  node_title: string;
  unit: string;
  prompt: string;
  grader: string;
  meta: PracticeItemMeta;
}

// POST /practice/sessions. Refused with 409 and a learner-readable detail
// when the selected units cannot supply items.
export interface PracticeSessionStart {
  session_id: string;
  mode: PracticeMode;
  items: PracticeItem[];
}

// The named misconception attached to a diagnosed wrong answer. review_node
// is where the library routes the learner to relearn it.
export interface RationaleMisconception {
  code: string;
  name: string;
  description: string;
  counterexample: string;
  review_node: string;
}

// One explained multiple-choice option. why_wrong and counterexample are
// authored content keyed to the distractor's misconception, present only when
// the library has them.
export interface RationaleChoice {
  index: number;
  text: string;
  correct: boolean;
  why_wrong?: string;
  counterexample?: string;
}

// The authored explanation for one graded item. lesson_node names the lesson
// behind the item, for a "review the lesson" link.
export interface Rationale {
  correct_display: string;
  lesson_node: string;
  misconception?: RationaleMisconception;
  choices?: RationaleChoice[];
}

// The answer response in tutor mode: the full grade and rationale, at once.
export interface TutorAnswerResult {
  is_correct: boolean;
  score: number;
  graded: boolean;
  detail: string;
  rationale: Rationale;
  answered: number;
  total: number;
}

// The answer response in timed mode: a receipt and nothing about correctness.
export interface TimedAnswerResult {
  recorded: true;
  answered: number;
  total: number;
}

export type PracticeAnswerResult = TutorAnswerResult | TimedAnswerResult;

// The summary a finished session carries. answered can be below total when
// the session was finished with items left blank.
export interface PracticeSummary {
  correct: number;
  total: number;
  answered?: number;
  by_unit: Record<string, { correct: number; total: number }>;
  mode: string;
}

export interface PracticeFinishResult {
  session_id: string;
  summary: PracticeSummary;
}

// One item in the post-session review: the question, what was answered, the
// grade, and the full rationale. Served only after finish; before that the
// API refuses with 409.
export interface PracticeReviewItem {
  position: number;
  prompt: string;
  node: string;
  node_title: string;
  unit: string;
  grader: string;
  your_answer: string;
  answered: boolean;
  is_correct: boolean;
  flagged: boolean;
  seconds: number;
  rationale: Rationale;
}

export interface PracticeReview {
  session_id: string;
  mode: PracticeMode;
  summary: PracticeSummary | null;
  items: PracticeReviewItem[];
}

// One row of GET /practice/sessions. summary is null while the session is
// in progress.
export interface PracticeSessionRow {
  session_id: string;
  mode: PracticeMode;
  status: string;
  started_at: string | null;
  config: { units?: string[]; count?: number } | null;
  summary: PracticeSummary | null;
  item_count: number;
}

export interface PracticeSessionHistory {
  sessions: PracticeSessionRow[];
}

// -------------------------------------------------------------------------
// Calls
// -------------------------------------------------------------------------

export function getPracticeCatalogue(): Promise<PracticeCatalogue> {
  return apiGet<PracticeCatalogue>('/practice/catalogue');
}

export function startPracticeSession(
  units: string[],
  count: number,
  mode: PracticeMode,
): Promise<PracticeSessionStart> {
  return apiPost<PracticeSessionStart>('/practice/sessions', {
    units,
    count,
    mode,
  });
}

// Record one answer. Answers are final: a second answer to the same position
// is refused with 409 and the message says so.
export function answerPracticeItem(
  sessionId: string,
  position: number,
  answer: string,
  seconds: number,
  flagged: boolean,
): Promise<PracticeAnswerResult> {
  return apiPost<PracticeAnswerResult>(
    `/practice/sessions/${encodeURIComponent(sessionId)}/answer`,
    { position, answer, seconds, flagged },
  );
}

export function finishPracticeSession(
  sessionId: string,
): Promise<PracticeFinishResult> {
  return apiPost<PracticeFinishResult>(
    `/practice/sessions/${encodeURIComponent(sessionId)}/finish`,
    {},
  );
}

// The post-session walkthrough. Throws ApiError with status 409 when the
// session has not been finished, which the player uses to tell an open
// session from a finished one.
export function getPracticeReview(sessionId: string): Promise<PracticeReview> {
  return apiGet<PracticeReview>(
    `/practice/sessions/${encodeURIComponent(sessionId)}/review`,
  );
}

export function getPracticeHistory(
  limit = 10,
): Promise<PracticeSessionHistory> {
  return apiGet<PracticeSessionHistory>(`/practice/sessions?limit=${limit}`);
}

// -------------------------------------------------------------------------
// Per-tab persistence for open sessions
// -------------------------------------------------------------------------

// One recorded answer, kept locally so a reload of the player inside the same
// tab lands on the first unanswered item instead of re-asking a final answer.
// result is present in tutor mode only; timed mode never holds a grade
// client side before finish.
export interface StoredPracticeAnswer {
  answer: string;
  seconds: number;
  flagged: boolean;
  result?: TutorAnswerResult;
}

// Everything the player needs, written at start and updated after every
// answer. Cleared when the session is finished, because from then on the
// review endpoint is the source of truth.
export interface StoredPracticeSession {
  session_id: string;
  mode: PracticeMode;
  items: PracticeItem[];
  answers: Record<number, StoredPracticeAnswer>;
}

const STORAGE_PREFIX = 'octet:practice:';

export function savePracticeSession(stored: StoredPracticeSession): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.sessionStorage.setItem(
      STORAGE_PREFIX + stored.session_id,
      JSON.stringify(stored),
    );
  } catch {
    // Storage can be unavailable (private mode, quota). The session still
    // works in memory; only a reload loses it.
  }
}

export function loadPracticeSession(
  sessionId: string,
): StoredPracticeSession | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = window.sessionStorage.getItem(STORAGE_PREFIX + sessionId);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as StoredPracticeSession;
    if (
      !parsed ||
      parsed.session_id !== sessionId ||
      !Array.isArray(parsed.items) ||
      parsed.items.length === 0
    ) {
      return null;
    }
    if (!parsed.answers || typeof parsed.answers !== 'object') {
      parsed.answers = {};
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearPracticeSession(sessionId: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.sessionStorage.removeItem(STORAGE_PREFIX + sessionId);
  } catch {
    // Ignore storage errors.
  }
}
