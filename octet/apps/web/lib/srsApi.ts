// Fetch layer for the spaced review surface at /review. The shapes below are
// read off the live router in apps/api/app/domains/srs/router.py and
// service.py rather than guessed.
//
// Everything here rides on the authed helpers in lib/api.ts, so the bearer
// token, the base URL and the error semantics stay defined in exactly one
// place.
//
// Cards are not stored content. The API derives them from the authored
// lessons at read time: the try-it question and the pitfall of each complete
// lesson, verbatim. That is why a card's back is present in the queue
// payload; hiding it until the flip is a presentation rule the player
// enforces, not a secret the server keeps. The lesson pages show the same
// text to anyone who reads them.

import { apiGet, apiPost } from '@/lib/api';

// The two card kinds a lesson yields. try_it is the lesson's retrieval
// question; pitfall is its named trap, reframed as a question.
export type SrsCardKind = 'try_it' | 'pitfall';

// One servable card. front and back are lesson text verbatim; node links the
// card back to its lesson at /learn/{node}.
export interface SrsCard {
  card_id: string;
  node: string;
  node_title: string;
  unit: string;
  kind: SrsCardKind;
  front: string;
  back: string;
}

// Counts over the whole card set, not just the served page: due is every
// card whose review date has arrived, new is every card never reviewed,
// total is every card the lesson library currently supports.
export interface SrsQueueCounts {
  due: number;
  new: number;
  total: number;
}

// GET /srs/queue. due lists cards due now first, then unseen cards, up to
// the requested limit.
export interface SrsQueue {
  due: SrsCard[];
  counts: SrsQueueCounts;
}

// POST /srs/review. The receipt for one graded recall: where the card now
// sits on the schedule. interval_days is the honest next gap and is what the
// player shows after grading.
export interface SrsReviewResult {
  card_id: string;
  due_at: string;
  interval_days: number;
  repetitions: number;
}

export interface SrsCourseStats {
  total: number;
  seen: number;
}

// GET /srs/stats.
export interface SrsStats {
  total_cards: number;
  seen: number;
  due_now: number;
  by_course: Record<string, SrsCourseStats>;
}

export function getSrsQueue(limit = 20): Promise<SrsQueue> {
  return apiGet<SrsQueue>(`/srs/queue?limit=${limit}`);
}

// Record one graded recall. grade runs 0 to 5; the player maps its four
// buttons onto 0 (again), 3 (hard), 4 (good) and 5 (easy). Throws ApiError
// with status 409 for a card the current lesson set does not derive.
export function reviewSrsCard(
  cardId: string,
  grade: number,
): Promise<SrsReviewResult> {
  return apiPost<SrsReviewResult>('/srs/review', {
    card_id: cardId,
    grade,
  });
}

export function getSrsStats(): Promise<SrsStats> {
  return apiGet<SrsStats>('/srs/stats');
}
