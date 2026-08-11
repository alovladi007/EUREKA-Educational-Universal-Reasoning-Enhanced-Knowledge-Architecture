/**
 * GATE C - the Phase C MCAT surfaces against the LIVE stack:
 *
 *   qbank (C1)      served without keys, graded server-side, logged
 *   passages (C2)   passage text + its questions, same grading path
 *   simulator (C3)  server-drawn, server-graded, raw + per-section only
 *   review (C4)     recorded responses, missed list, no percentile
 *   SME gate (C5)   draft content disclosed; flagged never served
 *   IRT (C6)        threshold reported honestly, calibration refused
 *
 * Nothing is stubbed: eureka-web :4040 -> api-core :8000 -> Postgres. The
 * assertions that matter most are the negative ones - no answer key in any
 * pre-submission payload, and no invented statistic anywhere.
 */
import { expect, test, type APIRequestContext } from '@playwright/test';

const API = process.env.API_URL || 'http://localhost:8000';
const EMAIL = `gate.c.${Date.now()}@gmail.com`;
const PASSWORD = 'GateC!Pass123456';

let token = '';

test.describe.configure({ mode: 'serial' });

function auth() {
  return { Authorization: `Bearer ${token}` };
}

/** Every key anywhere in a JSON payload. */
function walkKeys(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(walkKeys);
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).flatMap(
      ([k, v]) => [k, ...walkKeys(v)],
    );
  }
  return [];
}

test.beforeAll(async ({ request }) => {
  const reg = await request.post(`${API}/api/v1/auth/register`, {
    data: {
      email: EMAIL, password: PASSWORD, first_name: 'Gate',
      last_name: 'C', role: 'student',
    },
  });
  expect(reg.ok()).toBeTruthy();
  token = (await reg.json()).access_token;
  expect(token).toBeTruthy();
});

test('C1: the qbank serves no answer key and grades server-side', async ({
  request,
}) => {
  const served = await request.get(
    `${API}/api/v1/mcat/qbank/items?count=5`, { headers: auth() },
  );
  expect(served.ok()).toBeTruthy();
  const body = await served.json();
  expect(body.items.length).toBeGreaterThan(0);

  const keys = new Set(walkKeys(body));
  for (const forbidden of ['correct', 'correct_index', 'explanation', 'answer']) {
    expect(keys.has(forbidden), `serve leaked ${forbidden}`).toBeFalsy();
  }
  // Review standing travels with the item, and the label is named as
  // author-assigned rather than measured.
  expect(body.items[0].review_status).toBeTruthy();
  expect(keys.has('difficulty_nominal')).toBeTruthy();
  expect(body.disclaimer).toContain('AI-generated');

  // Grading happens on the server; the key appears only in its response.
  const graded = await request.post(`${API}/api/v1/mcat/qbank/submit`, {
    headers: auth(),
    data: { item_id: body.items[0].item_id, choice_index: 0, seconds: 12 },
  });
  expect(graded.ok()).toBeTruthy();
  const verdict = await graded.json();
  expect(typeof verdict.is_correct).toBe('boolean');
  expect(typeof verdict.correct_index).toBe('number');
});

test('C2: a passage set serves its text and questions, still keyless', async ({
  request,
}) => {
  const list = await request.get(`${API}/api/v1/mcat/qbank/passages`, {
    headers: auth(),
  });
  expect(list.ok()).toBeTruthy();
  const passages = (await list.json()).passages;
  expect(passages.length).toBeGreaterThan(0);

  const set = await request.get(
    `${API}/api/v1/mcat/qbank/passage-set/${passages[0].passage_id}`,
    { headers: auth() },
  );
  expect(set.ok()).toBeTruthy();
  const body = await set.json();
  expect(body.passage.body.length).toBeGreaterThan(200);
  expect(body.items.length).toBeGreaterThan(0);
  const keys = new Set(walkKeys(body));
  expect(keys.has('correct_index')).toBeFalsy();
  expect(keys.has('explanation')).toBeFalsy();
});

test('C3: the simulator grades server-side and scales nothing', async ({
  request,
}) => {
  const started = await request.post(`${API}/api/v1/mcat/mock/start`, {
    headers: auth(),
    data: { form: 'mini' },
  });
  expect(started.ok()).toBeTruthy();
  const attempt = await started.json();
  expect(attempt.items.length).toBe(16);
  const startKeys = new Set(walkKeys(attempt));
  expect(startKeys.has('correct_index')).toBeFalsy();
  expect(attempt.note).toContain('equating data');

  // Four per section - the form is drawn, not padded.
  const perSection: Record<string, number> = {};
  for (const i of attempt.items) {
    perSection[i.topic_id] = (perSection[i.topic_id] ?? 0) + 1;
  }
  expect(Object.values(perSection)).toEqual([4, 4, 4, 4]);

  const answers = attempt.items.map((i: { position: number }, idx: number) => ({
    position: i.position,
    choice_index: idx === 0 ? null : 0, // one deliberate blank
  }));
  const graded = await request.post(
    `${API}/api/v1/mcat/mock/${attempt.attempt_id}/submit`,
    { headers: auth(), data: { answers } },
  );
  expect(graded.ok()).toBeTruthy();
  const result = await graded.json();
  expect(result.raw.total).toBe(16);
  expect(result.raw.answered).toBe(15);
  expect(Object.keys(result.by_section).length).toBe(4);
  // Raw and per-section only: nothing scaled, nothing predicted.
  const resultKeys = new Set(walkKeys(result));
  for (const forbidden of [
    'scaled_score', 'theta', 'percentile', 'pass_probability',
    'predicted_score',
  ]) {
    expect(resultKeys.has(forbidden), `results invented ${forbidden}`).toBeFalsy();
  }
  // Resubmitting a submitted sitting is refused.
  const again = await request.post(
    `${API}/api/v1/mcat/mock/${attempt.attempt_id}/submit`,
    { headers: auth(), data: { answers } },
  );
  expect(again.status()).toBe(409);
});

test('C4: review reflects the recorded responses and invents no cohort', async ({
  request,
}) => {
  const summary = await request.get(`${API}/api/v1/mcat/review/summary`, {
    headers: auth(),
  });
  expect(summary.ok()).toBeTruthy();
  const body = await summary.json();
  // The qbank answer plus the 15 answered simulator positions.
  const attempts = body.by_section.reduce(
    (n: number, s: { attempts: number }) => n + s.attempts, 0,
  );
  expect(attempts).toBe(16);
  expect(body.note).toContain('no cohort');
  const keys = new Set(walkKeys(body));
  expect(keys.has('percentile')).toBeFalsy();

  const missed = await request.get(
    `${API}/api/v1/mcat/review/missed?limit=5`, { headers: auth() },
  );
  expect(missed.ok()).toBeTruthy();
  const missedBody = await missed.json();
  for (const m of missedBody.missed) {
    expect(m.times_attempted).toBeGreaterThan(0);
    expect(typeof m.correct_index).toBe('number'); // graded already: key is fine here
  }
});

test('C6: calibration readiness is reported, and calibration is refused', async ({
  request,
}) => {
  const status = await request.get(`${API}/api/v1/mcat/irt/status`, {
    headers: auth(),
  });
  expect(status.ok()).toBeTruthy();
  const body = await status.json();
  expect(body.threshold.min_responses_per_item).toBe(300);
  expect(body.threshold.min_distinct_learners_per_item).toBe(100);
  expect(body.eligible_items).toBe(0);
  expect(body.ready_to_calibrate).toBeFalsy();
  expect(body.difficulty_shown).toContain('nominal');

  // A learner cannot calibrate.
  const denied = await request.post(`${API}/api/v1/mcat/irt/calibrate`, {
    headers: auth(),
  });
  expect(denied.status()).toBe(403);
});

test('the browser surfaces render the server data', async ({ page }) => {
  await page.addInitScript((tok) => {
    window.localStorage.setItem('access_token', tok);
  }, token);

  // The MCAT home is now the dashboard itself rather than a strip of tabs,
  // and each surface is its own route - so this navigates the way a learner
  // does, by following the dashboard's own links.
  const summaryOnHome = page.waitForResponse(
    (r) => r.url().includes('/mcat/review/summary'),
  );
  await page.goto('/dashboard/test-prep/mcat');
  await expect(page.getByTestId('exam-dashboard')).toBeVisible();
  expect((await summaryOnHome).status()).toBe(200);
  // Resume points at the course, and the figures on this page come from the
  // 16 answers recorded above rather than from a placeholder.
  await expect(page.getByTestId('exam-resume')).toBeVisible();
  await expect(page.getByTestId('exam-dashboard')).toContainText('16');

  await page.goto('/dashboard/test-prep/mcat/qbank');
  await expect(page.getByTestId('mcat-qbank-picker')).toBeVisible();
  await expect(page.getByTestId('mcat-passage-sets')).toBeVisible();

  await page.goto('/dashboard/test-prep/mcat/exam');
  const intro = page.getByTestId('mcat-mock-intro');
  await expect(intro).toBeVisible();
  // Scoped and .first(): once this account has a sitting, the history note
  // repeats the same no-scaled-score wording, and an unscoped getByText hit
  // both elements - a strict-mode violation that flaked with fetch timing
  // rather than a real regression.
  await expect(intro.getByText(/equating data/).first()).toBeVisible();

  // Wait for the review data itself rather than racing the render: asserting
  // on the bars before the fetch lands made this flake ~1 run in 3, and
  // checking the status here means a non-200 fails loudly instead of looking
  // like a missing element.
  const summaryLanded = page.waitForResponse(
    (r) => r.url().includes('/mcat/review/summary'),
  );
  await page.goto('/dashboard/test-prep/mcat/review');
  const summary = await summaryLanded;
  expect(summary.status()).toBe(200);
  await expect(page.getByTestId('mcat-review-center')).toBeVisible();
  // The sitting from this run is already reflected server-side.
  await expect(page.getByTestId('mcat-review-section').first()).toBeVisible();

  // Flashcards and notes did not disappear with the tab strip - the
  // dashboard links to them by query param, and that still opens the tab UI.
  await page.goto('/dashboard/test-prep/mcat?tab=flashcards');
  await expect(page.getByTestId('exam-dashboard')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'QBank', exact: true }),
  ).toBeVisible();
});
