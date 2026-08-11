/**
 * GATE B - the full MCAT x OCTET flow against the LIVE local stack:
 *
 *   entitle -> practice (generated items) -> miss -> misconception rationale
 *   -> add to the one review queue (SRS deck MCAT) -> weakness analytics
 *   -> OCTET lesson deep link carrying the signed-in token.
 *
 * "Buy" step: Stripe checkout deliberately returns 503 in dev (no
 * STRIPE_SECRET_KEY - the platform refuses mock checkouts), so the
 * entitlement comes from the comp path: a direct entitlements INSERT with
 * source='comp', which is exactly what the admin comp-grant produces. The
 * paywall (before) and the 402 (server-side) are asserted first, so the
 * gate itself is still proven.
 *
 * Nothing is stubbed: eureka-web :4040 -> api-core :8000 -> octet-api :8500.
 */
import { execSync } from 'node:child_process';
import { expect, test, type Page } from '@playwright/test';

const API = process.env.API_URL || 'http://localhost:8000';
const EMAIL = `gate.b.${Date.now()}@gmail.com`;
const PASSWORD = 'GateB!Pass123456';

let token = '';

test.describe.configure({ mode: 'serial' });

async function seedAuth(page: Page) {
  await page.addInitScript((tok) => {
    window.localStorage.setItem('access_token', tok);
  }, token);
}

test.beforeAll(async ({ request }) => {
  const reg = await request.post(`${API}/api/v1/auth/register`, {
    data: {
      email: EMAIL,
      password: PASSWORD,
      first_name: 'Gate',
      last_name: 'B',
      role: 'student',
    },
  });
  expect(reg.ok()).toBeTruthy();
  token = (await reg.json()).access_token;
  expect(token).toBeTruthy();
});

test('server gates generated chemistry behind the entitlement (402)', async ({
  request,
}) => {
  const res = await request.post(`${API}/api/v1/mcat/chemistry/items`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { category: '5B', count: 3 },
  });
  expect(res.status()).toBe(402);
  const body = await res.json();
  expect(body.detail.exam_code).toBe('MCAT');
});

test('the page shows the paywall, not the practice, before entitlement', async ({
  page,
}) => {
  await seedAuth(page);
  await page.goto('/dashboard/test-prep/mcat/chemistry');
  await expect(page.getByText('MCAT Full Access')).toBeVisible();
  await expect(page.getByTestId('chem-categories')).toHaveCount(0);
});

test('comp entitlement unlocks the flow end to end', async ({
  page,
  request,
}) => {
  // The comp grant (see file header for why this stands in for checkout).
  execSync(
    `docker exec eureka-db psql -U eureka -d eureka -c "INSERT INTO entitlements (id, user_id, exam_code, sku, status, source) SELECT gen_random_uuid(), id, 'MCAT', 'mcat_full', 'active', 'comp' FROM users WHERE email='${EMAIL}';"`,
  );

  await seedAuth(page);

  // The MCAT dashboard advertises the chemistry practice surface.
  await page.goto('/dashboard/test-prep/mcat');
  await expect(page.getByTestId('mcat-chemistry-link')).toBeVisible();
  await page.getByTestId('mcat-chemistry-link').click();
  await page.waitForURL('**/chemistry');

  // Category card: 5B serves; 4B is honestly disabled - no empty sessions.
  await expect(page.getByTestId('chem-categories')).toBeVisible();
  await expect(page.getByTestId('chem-cat-4B')).toBeDisabled();
  await expect(page.getByTestId('chem-cat-4B')).toContainText(
    'no generated items yet',
  );

  // Practice until a miss diagnoses its misconception (option A every time;
  // option order is seeded per item, so misses arrive quickly). Fresh
  // sessions serve fresh variants, so retrying sessions cannot loop forever
  // on the same items.
  let missHandled = false;
  let octetHref = '';
  for (let session = 0; session < 3 && !missHandled; session++) {
    await page.getByTestId('chem-cat-5B').click();
    await expect(page.getByTestId('chem-session')).toBeVisible();
    for (let i = 0; i < 10; i++) {
      await page.getByTestId('chem-option-0').click();
      await expect(page.getByTestId('chem-verdict')).toBeVisible();
      const incorrect = await page
        .getByTestId('chem-rationale')
        .isVisible()
        .catch(() => false);
      if (incorrect && !missHandled) {
        // The miss explains itself and routes into the full course.
        await expect(page.getByTestId('chem-rationale')).toContainText(/./);
        octetHref =
          (await page
            .getByTestId('chem-octet-link')
            .getAttribute('href')) || '';
        expect(octetHref).toContain('/learn/');
        expect(octetHref).toContain('#access_token=');
        // One review queue: the miss becomes an SM-2 card in deck MCAT.
        await page.getByTestId('chem-add-srs').click();
        missHandled = true;
      }
      const nextLabel = await page.getByTestId('chem-next').textContent();
      await page.getByTestId('chem-next').click();
      if (nextLabel?.includes('Finish')) break;
    }
  }
  expect(missHandled).toBeTruthy();

  // Weakness analytics: own attempts, counts beside the figure.
  await expect(page.getByTestId('chem-weakness')).toBeVisible();
  await expect(page.getByTestId('chem-weak-5B')).toContainText(/\d+\/\d+ correct/);

  // The SRS card really exists server-side, in the ONE review queue.
  const cards = await request.get(`${API}/api/v1/me/srs/cards?deck=MCAT`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(cards.ok()).toBeTruthy();
  const cardList = (await cards.json()).cards as Array<{
    deck: string;
    tags: Record<string, unknown> | null;
  }>;
  expect(
    cardList.some((c) => c.deck === 'MCAT' && c.tags?.source === 'octet_chemistry'),
  ).toBeTruthy();

  // The OCTET deep link opens the lesson signed in (hash-token handoff).
  await page.goto(octetHref);
  await expect(page.locator('body')).not.toContainText('Sign in', {
    timeout: 20_000,
  });
});
