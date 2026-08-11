/**
 * Every exam has one home and one course, against the LIVE stack.
 *
 * The claim under test is the one the rebuild makes: whichever of the ten
 * exams you pick, /dashboard/test-prep/<exam> is a dashboard rather than a
 * strip of tabs, its resume button opens a course with real chapters, and
 * the shared /dashboard/test-prep route lands on the same page rather than
 * on a second dashboard in front of it.
 *
 * Nothing is stubbed. The figures on these pages come from user_progress
 * (or, for MCAT, from the server-side review log), so a fresh account sees
 * honest empty states — which is also asserted, because a dashboard of
 * zeros pretending to be telemetry is exactly what this replaced.
 */
import { expect, test } from '@playwright/test';

const API = process.env.API_URL || 'http://localhost:8000';
const EMAIL = `dash.${Date.now()}@gmail.com`;
const PASSWORD = 'DashPass!123456';

/** The ten exams, and how many chapters each course should carry. */
const EXAMS = [
  { slug: 'mcat', name: 'MCAT', chapters: 29 },
  { slug: 'patent_bar', name: 'Patent Bar', chapters: 67 },
  { slug: 'lsat', name: 'LSAT', chapters: 25 },
  { slug: 'cissp', name: 'CISSP', chapters: 36 },
  { slug: 'security_plus', name: 'Security+', chapters: 29 },
  { slug: 'fe_ee', name: 'FE EE', chapters: 93 },
  { slug: 'fe_me', name: 'FE ME', chapters: 62 },
  { slug: 'pe_ee', name: 'PE EE', chapters: 34 },
  { slug: 'sat', name: 'SAT', chapters: 19 },
  { slug: 'gre', name: 'Physics GRE', chapters: 50 },
];

let token = '';

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ request }) => {
  const reg = await request.post(`${API}/api/v1/auth/register`, {
    data: {
      email: EMAIL, password: PASSWORD, first_name: 'Dash',
      last_name: 'Check', role: 'student',
    },
  });
  expect(reg.ok()).toBeTruthy();
  token = (await reg.json()).access_token;
});

test('a GMAT URL surfaces no GMAT product', async ({ page }) => {
  await page.addInitScript((tok) => {
    window.localStorage.setItem('access_token', tok);
  }, token);
  // getExamConfig falls back for an unknown id, so /gmat still renders a
  // page. What must not survive anywhere on it is the exam itself. (The
  // ten-exam count is asserted as a unit test against EXAM_CONFIGS, which
  // is the actual source of truth rather than one rendered page.)
  await page.goto('/dashboard/test-prep/gmat');
  await expect(page.getByTestId('exam-dashboard')).toBeVisible();
  await expect(page.locator('body')).not.toContainText('GMAT');
});

for (const exam of EXAMS) {
  test(`${exam.name}: one home, one course`, async ({ page }) => {
    await page.addInitScript((tok) => {
      window.localStorage.setItem('access_token', tok);
    }, token);

    // The exam home is a dashboard, not a tab strip.
    await page.goto(`/dashboard/test-prep/${exam.slug}`);
    const dash = page.getByTestId('exam-dashboard');
    await expect(dash).toBeVisible();
    await expect(dash).toContainText(`0/${exam.chapters}`);
    // A fresh account has no answers, and the page says so rather than
    // showing a zero dressed as a measurement.
    await expect(dash).toContainText('no answers recorded yet');

    // Resume opens the course, and the course has the chapters the
    // dashboard just promised.
    await page.getByTestId('exam-resume').click();
    await page.waitForURL(`**/${exam.slug}/study`);
    const study = page.getByTestId('exam-study');
    await expect(study).toBeVisible();
    await expect(study).toContainText(`0/${exam.chapters}`);

    // Opening the first chapter renders its written material.
    await page.locator('[data-testid^="study-chapter-"]').first().click();
    await expect(page.getByTestId('study-book')).toBeVisible();
    await expect(page.getByTestId('study-media')).toBeVisible();
  });
}

test('the shared route and the exam route are the same page', async ({ page }) => {
  await page.addInitScript((tok) => {
    window.localStorage.setItem('access_token', tok);
    window.localStorage.setItem('activeExamType', 'CISSP');
  }, token);
  await page.goto('/dashboard/test-prep?exam=CISSP');
  await expect(page.getByTestId('exam-dashboard')).toBeVisible();
  await expect(page.getByTestId('exam-dashboard')).toContainText('0/36');
});

test('?tab= still reaches flashcards and notes', async ({ page }) => {
  await page.addInitScript((tok) => {
    window.localStorage.setItem('access_token', tok);
  }, token);
  await page.goto('/dashboard/test-prep/cissp?tab=flashcards');
  await expect(page.getByTestId('exam-dashboard')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Read Lessons', exact: true }),
  ).toBeVisible();
});
