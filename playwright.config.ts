import { defineConfig, devices } from '@playwright/test';
import { loadEnv } from './configs/env/loadEnv';
import { AUTH_STATE } from './src/constants/auth';

const env = loadEnv();

const isCI = !!process.env.CI;

// The portal renders dates in the merchant's local timezone. Drive it from
// TZ_ID so date math and the app's "Today" agree. Default to the salon's zone.
const timezoneId = process.env.TZ_ID ?? 'America/Los_Angeles';

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  snapshotDir: './tests/visual/__snapshots__',

  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
    toMatchSnapshot: { maxDiffPixelRatio: 0.02 },
  },

  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['json', { outputFile: 'reports/json/results.json' }],
    ['junit', { outputFile: 'reports/junit/results.xml' }],
    [
      'allure-playwright',
      { outputFolder: 'reports/allure-results', detail: true, suiteTitle: true },
    ],
  ],

  use: {
    baseURL: env.BASE_URL,
    headless: env.HEADLESS,
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    // Keep diagnostics cheap by default; flip VIDEO=on for full replay.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: (process.env.VIDEO ?? 'retain-on-failure') as 'on' | 'retain-on-failure' | 'off',
    locale: 'en-US',
    timezoneId,
    launchOptions: {
      slowMo: env.SLOW_MO,
    },
  },

  projects: [
    // ── 1. Auth setup ────────────────────────────────────────────────
    // Logs in once and persists the session to .auth/<role>.json so UI
    // specs start already authenticated instead of logging in every test.
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // ── 2. UI tests (authenticated) ──────────────────────────────────
    {
      name: 'chromium',
      testIgnore: ['**/tests/api/**', /.*\.setup\.ts/],
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        storageState: AUTH_STATE.cashier,
      },
    },

    // ── 3. API tests (no browser, own auth) ──────────────────────────
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: env.API_BASE_URL },
    },

    // Uncomment for cross-browser coverage.
    // { name: 'firefox', dependencies: ['setup'], use: { ...devices['Desktop Firefox'], storageState: AUTH_STATE.cashier } },
    // { name: 'webkit',  dependencies: ['setup'], use: { ...devices['Desktop Safari'],  storageState: AUTH_STATE.cashier } },
  ],
});
