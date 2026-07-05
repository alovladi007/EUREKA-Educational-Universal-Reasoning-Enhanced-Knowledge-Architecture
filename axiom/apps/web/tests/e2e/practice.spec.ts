import { test, expect, type Page } from '@playwright/test';

// A dummy JWT (not verified by the stubbed API). Three base64url segments so
// it structurally resembles a real token.
const DUMMY_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOiJ1c2VyLTEiLCJlbWFpbCI6ImFkYUBleGFtcGxlLmNvbSJ9.' +
  'c2lnbmF0dXJlLXBsYWNlaG9sZGVy';

// A served numeric question.
const NEXT_QUESTION = {
  done: false,
  response_token: 'resp-1',
  node_id: 'node-1',
  node_title: 'Linear equations',
  kind: 'numeric',
  prompt: 'What is 2 plus 2?',
  options: null,
};

// A graded answer with a mastery delta.
const ANSWER_RESULT = {
  is_correct: true,
  score: 1,
  grader: 'numeric',
  correct_answer: '4',
  explanation: 'Add the two numbers to get four.',
  mastery: {
    node_id: 'node-1',
    p_known_before: 0.4,
    p_known_after: 0.72,
    level: 'developing',
  },
};

// Stub the two practice endpoints. No real backend is involved.
async function stubPractice(page: Page) {
  await page.route('**/api/v1/practice/next', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(NEXT_QUESTION),
    }),
  );
  await page.route('**/api/v1/practice/answer', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(ANSWER_RESULT),
    }),
  );
}

test('practice loop grades an answer and shows the mastery delta', async ({
  page,
}) => {
  await page.addInitScript((token) => {
    window.localStorage.setItem('access_token', token as string);
  }, DUMMY_JWT);

  await stubPractice(page);

  await page.goto('/practice');

  // The served question renders, including its node title and prompt.
  await expect(page.getByText('Linear equations')).toBeVisible();
  await expect(page.getByText('What is 2 plus 2?')).toBeVisible();

  // Enter an answer and submit.
  await page.getByLabel('Your answer').fill('4');
  await page.getByRole('button', { name: 'Submit answer' }).click();

  // The graded result renders: correct verdict, the correct answer, and the
  // explanation.
  await expect(page.getByText('Correct', { exact: true })).toBeVisible();
  await expect(page.getByText('Correct answer:')).toBeVisible();
  await expect(
    page.getByText('Add the two numbers to get four.'),
  ).toBeVisible();

  // The mastery-moved line renders the before and after percentages and level.
  await expect(
    page.getByText('Mastery moved from 40% to 72% (developing).'),
  ).toBeVisible();

  // A "Next question" button is offered to continue the loop.
  await expect(
    page.getByRole('button', { name: 'Next question' }),
  ).toBeVisible();
});
