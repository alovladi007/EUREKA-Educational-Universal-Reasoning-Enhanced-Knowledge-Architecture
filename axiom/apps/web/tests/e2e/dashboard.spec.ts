import { test, expect, type Page } from '@playwright/test';

// A dummy JWT (not verified by the stubbed API). Three base64url segments
// so it structurally resembles a real token.
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

const SUMMARY = {
  user: {
    id: 'user-1',
    email: 'ada@example.com',
    display_name: 'Ada Lovelace',
    roles: ['student'],
  },
  modules: [
    {
      key: 'learn',
      name: 'Learn',
      status: 'planned',
      description: 'Guided lessons and worked examples.',
    },
    {
      key: 'practice',
      name: 'Practice',
      status: 'planned',
      description: 'Adaptive problem sets.',
    },
  ],
  mastery_summary: null,
};

const HEALTH = { status: 'ok', service: 'axiom-api', version: '0.1.0' };

// Register API stubs so the app never hits a real backend.
async function stubApi(page: Page) {
  // Dev auto-login is disabled in the stubbed world, so the no-token path lands
  // on the sign-in screen instead of provisioning a session.
  await page.route('**/api/v1/auth/dev-login', (route) =>
    route.fulfill({ status: 404, contentType: 'application/json', body: '{}' }),
  );
  await page.route('**/api/v1/notifications/unread-count', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"count":0}' }),
  );
  await page.route('**/api/v1/me', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(ME),
    }),
  );
  await page.route('**/api/v1/dashboard/summary', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(SUMMARY),
    }),
  );
  await page.route('**/health', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(HEALTH),
    }),
  );
}

test('signed-in user sees the AXIOM dashboard with modules', async ({
  page,
}) => {
  await page.addInitScript((token) => {
    window.localStorage.setItem('access_token', token as string);
  }, DUMMY_JWT);

  await stubApi(page);

  await page.goto('/dashboard');

  // AXIOM wordmark in the header.
  await expect(page.getByText('AXIOM').first()).toBeVisible();

  // Greeting by display_name.
  await expect(
    page.getByText('Welcome back, Ada Lovelace.'),
  ).toBeVisible();

  // At least one module card renders (the heading, distinct from the sidebar's
  // "Learn" nav link), and it is labeled Planned.
  await expect(page.getByRole('heading', { name: 'Learn' })).toBeVisible();
  await expect(page.getByText('Planned').first()).toBeVisible();
});

test('no token shows the Sign in through EUREKA screen', async ({ page }) => {
  // No addInitScript, so localStorage has no access_token.
  await stubApi(page);

  await page.goto('/dashboard');

  await expect(
    page.getByText('Sign in through EUREKA to continue'),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Sign in with EUREKA' }),
  ).toBeVisible();
});
