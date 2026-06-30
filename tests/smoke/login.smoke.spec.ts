import { test, expect } from '@fixtures/index';
import { Tag } from '@/types/testTags';

/**
 * Smoke: the login page renders and is interactive. These run UNauthenticated,
 * so the spec resets storageState to a clean slate before navigating.
 */
test.use({ storageState: { cookies: [], origins: [] } });

test.describe(`GoCheckin POS — login smoke ${Tag.SMOKE} ${Tag.AUTH}`, () => {
  test('login page loads with username, password, and submit', async ({ loginPage }) => {
    await loginPage.goto();

    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('no critical console errors on the login page', async ({ page, loginPage }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await loginPage.goto();
    await expect(loginPage.usernameInput).toBeVisible();

    expect(errors, errors.join('\n')).toHaveLength(0);
  });
});
