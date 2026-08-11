import { defineConfig } from '@playwright/test';

/**
 * E2E against the LIVE local stack (GATE B and onward): eureka-web on :4040,
 * api-core on :8000, octet-api on :8500, all running in compose. No route
 * stubbing - the point of these tests is that the real services agree with
 * each other. Start the stack first; the config deliberately does not boot
 * a dev server (the compose web container is the system under test).
 */
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4040';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 90_000,
  expect: { timeout: 15_000 },
  retries: 0,
  workers: 1,
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
  },
});
