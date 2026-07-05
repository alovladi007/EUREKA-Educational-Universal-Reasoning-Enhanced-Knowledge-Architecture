import { defineConfig, devices } from '@playwright/test';

// Simple Playwright config. The tests stub the AXIOM API with page.route,
// so no backend is needed. A dev server on port 4100 is started for the
// tests unless PLAYWRIGHT_NO_WEBSERVER is set (assume one is running).
const PORT = 4100;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_NO_WEBSERVER
    ? undefined
    : {
        command: 'npm run dev',
        url: BASE_URL,
        reuseExistingServer: true,
        timeout: 120000,
      },
});
