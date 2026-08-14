/**
 * Chapter-read progress — server-backed, with localStorage as the offline
 * cache and migration source.
 *
 * Until 2026-08 "N/17 read" lived only in localStorage
 * (`<exam>_study_read_chapters`), so course progress evaporated on a new
 * device or a cleared browser, and an institutional cohort report cannot
 * read students' browsers. The truth now lives in api-core's
 * study_chapter_reads table; this module is the one place the frontend
 * talks to it.
 *
 * The contract every consumer gets:
 *
 *  - `loadReadChapters(exam)` returns the server set when reachable. Any
 *    ids that exist ONLY locally (accumulated before the server store, or
 *    while offline) are merged UP via /sync first — union semantics, so
 *    nobody's existing progress is lost and a stale device can never erase
 *    progress made elsewhere. The result is written back to localStorage
 *    as the cache. Server unreachable → the local set, flagged 'local'.
 *
 *  - `toggleChapterRead(exam, id, read)` updates localStorage immediately
 *    (optimistic — the UI must not wait on a round trip to flip a
 *    checkmark) and writes through to the server, fire-and-forget. A
 *    failed write-through is re-healed by the next load's upward merge
 *    for marks; unmarks made offline are local-only until repeated online
 *    — the deliberately-safe direction, since sync never deletes.
 */

import { apiClient } from '@/lib/api-client';
import { readChaptersKey } from '@/lib/exam-study-axis';

export type ReadSource = 'server' | 'local';

function readLocal(exam: string): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const saved = window.localStorage.getItem(readChaptersKey(exam));
    return saved ? new Set(JSON.parse(saved)) : new Set();
  } catch {
    return new Set();
  }
}

function writeLocal(exam: string, ids: Set<string>): void {
  try {
    window.localStorage.setItem(readChaptersKey(exam), JSON.stringify([...ids]));
  } catch {
    /* quota / private mode — the server copy is the one that matters */
  }
}

export async function loadReadChapters(
  exam: string,
): Promise<{ ids: Set<string>; source: ReadSource }> {
  const local = readLocal(exam);
  try {
    const server = await apiClient.getChapterReads(exam);
    let ids = new Set(server.topic_ids);
    const onlyLocal = [...local].filter((id) => !ids.has(id));
    if (onlyLocal.length > 0) {
      // Migrate this device's pre-server (or offline-marked) reads up.
      const merged = await apiClient.syncChapterReads(exam, [...local]);
      ids = new Set(merged.topic_ids);
    }
    writeLocal(exam, ids);
    return { ids, source: 'server' };
  } catch {
    return { ids: local, source: 'local' };
  }
}

export function toggleChapterRead(
  exam: string,
  topicId: string,
  nowRead: boolean,
): Set<string> {
  const ids = readLocal(exam);
  if (nowRead) ids.add(topicId);
  else ids.delete(topicId);
  writeLocal(exam, ids);
  // Write-through; failures are healed by the next load's merge (marks)
  // or repeated online (unmarks). Never block the UI on this.
  void (nowRead
    ? apiClient.markChapterRead(exam, topicId)
    : apiClient.unmarkChapterRead(exam, topicId)
  ).catch(() => undefined);
  return ids;
}
