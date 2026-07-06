import { test, expect, type Page } from '@playwright/test';

// The persistent sidebar should list every module group, including the surfaces
// added in the base-platform completion (Content Studio, Live tutoring,
// Proctoring review, Integrations). The API is stubbed, so no backend is needed.

const DUMMY_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOiJ1c2VyLTEiLCJlbWFpbCI6ImFkYUBleGFtcGxlLmNvbSJ9.' +
  'c2lnbmF0dXJlLXBsYWNlaG9sZGVy';

const ME = {
  id: 'user-1',
  email: 'ada@example.com',
  display_name: 'Ada Lovelace',
  roles: ['org_admin'],
  tenant_id: 'tenant-1',
};

const SUMMARY = {
  user: { id: 'user-1', email: 'ada@example.com', display_name: 'Ada Lovelace', roles: ['org_admin'] },
  modules: [],
  mastery_summary: null,
};

async function stubApi(page: Page) {
  await page.route('**/api/v1/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ME) }),
  );
  await page.route('**/api/v1/dashboard/summary', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(SUMMARY) }),
  );
  await page.route('**/api/v1/notifications/unread-count', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ count: 0 }) }),
  );
  await page.route('**/health', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok' }) }),
  );
}

test('the sidebar lists the completed-platform surfaces', async ({ page }) => {
  await page.addInitScript((token) => {
    window.localStorage.setItem('access_token', token as string);
  }, DUMMY_JWT);
  await stubApi(page);

  await page.goto('/dashboard');

  for (const label of [
    'Dashboard',
    'Practice',
    'Content Studio',
    'Live tutoring',
    'Proctoring review',
    'Integrations',
  ]) {
    await expect(page.getByRole('link', { name: label }).first()).toBeVisible();
  }
});

test('a skip-to-content link is present for keyboard users', async ({ page }) => {
  await page.addInitScript((token) => {
    window.localStorage.setItem('access_token', token as string);
  }, DUMMY_JWT);
  await stubApi(page);

  await page.goto('/dashboard');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeAttached();
});
