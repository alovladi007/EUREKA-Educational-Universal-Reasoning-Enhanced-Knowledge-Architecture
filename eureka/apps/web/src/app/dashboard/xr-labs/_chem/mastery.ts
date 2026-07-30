/**
 * Sending what happened in a lab back to the learner model.
 *
 * Until now the labs recorded that a session HAPPENED and nothing about what
 * the learner did in it. A run that ends with a five star rating and a run
 * that ends with three wrong predictions looked identical to the platform,
 * which meant the labs could not inform anything downstream.
 *
 * A predict-observe-explain outcome is the first thing these labs produce that
 * is actually evidence, so it goes to user_progress, the platform's per-topic
 * mastery store. It keys on (user, scope, topic) with a smoothed accuracy, and
 * the topic here is the OCTET curriculum node the item is bound to.
 *
 * Only the PREDICTION is scored. The observe step is not a test, and the
 * explain step is recorded as a second attempt against the same node rather
 * than folded into one score, because getting the outcome right while
 * misidentifying the mechanism is a different state from getting both right
 * and worth keeping distinguishable.
 *
 * Failures here are swallowed on purpose. A learner who has just finished
 * thinking hard about a chair flip should not get an error toast because a
 * telemetry write failed, and the lab has no way to make the write succeed.
 * The one thing that is never done is pretending it worked: recordOutcome
 * resolves to whether the write landed, and the caller shows mastery only
 * when it did.
 */

import { api } from '@/lib/eureka-api';
import type { PoeOutcome } from './Poe';

/** The scope these labs write under. Not an exam; see the model docstring. */
export const LAB_SCOPE = 'OCTET_CHEM';

export interface ProgressRow {
  topic_id: string;
  attempts: number;
  correct: number;
  mastery_level: number;
}

async function recordAttempt(
  topicId: string,
  correct: boolean,
  seconds: number,
): Promise<ProgressRow | null> {
  try {
    return await api<ProgressRow>('/me/progress', {
      method: 'POST',
      body: JSON.stringify({
        exam_type: LAB_SCOPE,
        topic_id: topicId,
        is_correct: correct,
        // The endpoint caps this at an hour. A learner who left the tab open
        // should not have that recorded as thinking time.
        seconds: Math.min(3600, Math.max(0, Math.round(seconds))),
      }),
    });
  } catch {
    return null;
  }
}

/**
 * Record one completed POE loop. Returns the updated row, or null if the
 * write did not land.
 */
export async function recordOutcome(
  outcome: PoeOutcome,
  elapsedSeconds: number,
): Promise<ProgressRow | null> {
  const first = await recordAttempt(
    outcome.node,
    outcome.predictionCorrect,
    elapsedSeconds,
  );
  if (first === null) return null;
  // The explanation is a second, separate piece of evidence about the same
  // node. Recording it as its own attempt keeps "right for the wrong reason"
  // visible instead of averaging it away.
  const second = await recordAttempt(outcome.node, outcome.explanationCorrect, 0);
  return second ?? first;
}

/** Current mastery for a set of nodes, for showing progress inside the lab. */
export async function getLabMastery(): Promise<Record<string, ProgressRow>> {
  try {
    const rows = await api<ProgressRow[]>(
      `/me/progress?exam_type=${LAB_SCOPE}`,
    );
    return Object.fromEntries(rows.map((r) => [r.topic_id, r]));
  } catch {
    return {};
  }
}
