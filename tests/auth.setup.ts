import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '@pages/auth/LoginPage';
import { AUTH_STATE, type Role } from '@constants/auth';
import { USERS } from '@data/static/users';
import { ensureDir } from '@utils/fileUtils';
import * as path from 'path';

/**
 * Auth setup project. Runs before the UI suite (see `dependencies: ['setup']`
 * in playwright.config.ts), logs in once per role through the real login page,
 * and persists the browser session to .auth/<role>.json. UI specs then attach
 * that storageState and start already authenticated.
 *
 * Add a block per role you need. Skips gracefully when credentials are absent
 * so a fresh clone without secrets still type-checks and lists tests.
 */
const authenticate = (role: Role): void => {
  setup(`authenticate as ${role}`, async ({ page }) => {
    const creds = USERS[role];
    setup.skip(!creds.username || !creds.password, `Missing ${role} credentials in env`);

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAndWait(creds);

    // Sanity-check we are actually authenticated before persisting the state.
    await expect(page).not.toHaveURL(/login/);

    ensureDir(path.dirname(AUTH_STATE[role]));
    await page.context().storageState({ path: AUTH_STATE[role] });
  });
};

authenticate('cashier');
authenticate('admin');
