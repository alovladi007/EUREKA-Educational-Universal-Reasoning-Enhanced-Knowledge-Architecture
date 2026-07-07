import { test, expect, type Page } from '@playwright/test';

// The learning path should present the tier 0-6 mathematics ladder grouped by
// tier, with proof-technique and theorem nodes badged, and available skills
// linking to practice. The API is stubbed, so no backend is needed.

const DUMMY_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOiJ1c2VyLTEiLCJlbWFpbCI6ImFkYUBleGFtcGxlLmNvbSJ9.' +
  'c2lnbmF0dXJlLXBsYWNlaG9sZGVy';

const ME = {
  id: 'user-1',
  email: 'ada@example.com',
  display_name: 'Ada Lovelace',
  roles: ['student'],
  tenant_id: 'tenant-1',
};

// A small slice of the ladder spanning two tiers, including a proof technique.
const PATH = {
  recommended_node_id: 'n-prealg',
  plan: [
    {
      node_id: 'n-prealg',
      code: 'PREALG',
      title: 'Pre-algebra and Arithmetic',
      kind: 'computational_skill',
      tier: 0,
      track: null,
      p_known: 0.3,
      level: 'developing',
      status: 'available',
    },
    {
      node_id: 'n-introproof',
      code: 'INTROPROOF',
      title: 'Introduction to Proof and Mathematical Reasoning',
      kind: 'concept',
      tier: 4,
      track: 'pure',
      p_known: 0.1,
      level: 'novice',
      status: 'locked',
    },
    {
      node_id: 'n-induction',
      code: 'PT.INDUCTION',
      title: 'Induction',
      kind: 'proof_technique',
      tier: 4,
      track: 'pure',
      p_known: 0.0,
      level: 'novice',
      status: 'locked',
    },
  ],
};

async function stubApi(page: Page) {
  await page.route('**/api/v1/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ME) }),
  );
  await page.route('**/api/v1/dashboard/summary', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"modules":[]}' }),
  );
  await page.route('**/api/v1/notifications/unread-count', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"count":0}' }),
  );
  await page.route('**/api/v1/learning-path/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(PATH) }),
  );
  await page.route('**/api/v1/reviews/due', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"reviews":[]}' }),
  );
}

test('the path groups skills by tier and badges the proof techniques', async ({ page }) => {
  await page.addInitScript((token) => {
    window.localStorage.setItem('access_token', token as string);
  }, DUMMY_JWT);
  await stubApi(page);

  await page.goto('/path');

  // Tier headers render for the two tiers present.
  await expect(
    page.getByRole('heading', { name: 'Tier 0 · Foundations' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Tier 4 · Proof transition' }),
  ).toBeVisible();

  // The induction node is present and carries the Technique badge.
  await expect(page.getByText('Induction', { exact: true })).toBeVisible();
  await expect(page.getByText('Technique', { exact: true })).toBeVisible();

  // The available foundation node links to practice; the locked proof nodes do
  // not offer a practice link.
  await expect(
    page.getByRole('link', { name: 'Practice this skill' }),
  ).toHaveCount(1);
});
