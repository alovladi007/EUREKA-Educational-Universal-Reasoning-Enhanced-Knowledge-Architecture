/**
 * Test-prep exam attempts — durable exam history backed by api-core.
 *
 * The full-exam tabs (FE_EE / FME / PE_EE / MCAT) score client-side and used to
 * persist history to localStorage ONLY, so a browser clear wiped a learner's
 * history and it never synced across devices. These helpers additionally
 * persist each completed exam to api-core (POST /exam-attempts) and read it
 * back (GET /exam-attempts/me), merged with any local history so nothing
 * regresses offline.
 *
 * Both calls are best-effort: a backend outage must never break the results
 * screen or the analytics tab, so failures are swallowed.
 */
import { apiClient } from '@/lib/api-client';

/** The FE-side shape used by the analytics tabs' `history` arrays. */
export interface ExamHistoryEntry {
  date: string;
  score: number;
  passed: boolean;
  correct: number;
  total: number;
  timeSpent: number;
  byTopic?: Record<string, { correct: number; total: number }>;
}

/**
 * Fire-and-forget: persist a completed exam to api-core. Never throws.
 * `examType` is a stable id per exam family (FE_EE | FME | PE_EE | MCAT | ...).
 */
export async function recordExamAttempt(examType: string, entry: ExamHistoryEntry): Promise<void> {
  try {
    await apiClient.post('/exam-attempts', {
      exam_type: examType,
      score_percent: entry.score,
      passed: entry.passed,
      correct_count: entry.correct,
      total_questions: entry.total,
      time_spent_seconds: entry.timeSpent,
      by_topic: entry.byTopic ?? null,
    });
  } catch {
    // Best-effort: localStorage already holds the record; a sync failure is silent.
  }
}

/** Fetch the caller's server-side attempts for one exam, oldest-first. Returns [] on error. */
export async function getExamAttempts(examType: string): Promise<ExamHistoryEntry[]> {
  try {
    const res = await apiClient.get('/exam-attempts/me', { params: { exam_type: examType } });
    const rows: any[] = Array.isArray(res.data) ? res.data : [];
    // Backend returns newest-first; the analytics tabs treat history[length-1]
    // as "latest", so return oldest-first to preserve that invariant.
    return rows
      .map((r) => ({
        date: r.created_at,
        score: Number(r.score_percent) || 0,
        passed: !!r.passed,
        correct: r.correct_count ?? 0,
        total: r.total_questions ?? 0,
        timeSpent: r.time_spent_seconds ?? 0,
        byTopic: r.by_topic ?? undefined,
      }))
      .reverse();
  } catch {
    return [];
  }
}

/**
 * Merge local + server history into one de-duplicated, oldest-first list.
 *
 * Dedup key = score|correct|total|timeSpent. A just-submitted attempt exists in
 * BOTH stores with the same values but different timestamps (client ISO time vs
 * server created_at), so the timestamp can't be the key. Collapsing two
 * byte-identical attempts is acceptable for an analytics view.
 */
export function mergeExamHistory(
  local: ExamHistoryEntry[],
  remote: ExamHistoryEntry[],
): ExamHistoryEntry[] {
  const sig = (h: ExamHistoryEntry) => `${h.score}|${h.correct}|${h.total}|${h.timeSpent}`;
  const seen = new Set<string>();
  const out: ExamHistoryEntry[] = [];
  for (const h of [...local, ...remote]) {
    const k = sig(h);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(h);
  }
  out.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return out;
}
