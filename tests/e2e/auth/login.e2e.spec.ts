import { test, expect } from '@fixtures/index';
import { Tag } from '@/types/testTags';
import { USERS } from '@data/static/users';
import { ErrorMessages } from '@constants/errorMessages';

/**
 * End-to-end login flow. Runs UNauthenticated (own storageState) because the
 * point of these tests is exercising the login itself, not reusing a session.
 */
test.use({ storageState: { cookies: [], origins: [] } });

test.describe(`Auth — login ${Tag.REGRESSION} ${Tag.AUTH}`, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('logs in with valid cashier credentials and lands authenticated', async ({
    loginPage,
    dashboardPage,
  }) => {
    test.skip(
      !USERS.cashier.username || !USERS.cashier.password,
      'Missing cashier credentials in env',
    );

    await loginPage.loginAndWait(USERS.cashier);
    await dashboardPage.expectLoaded();
    expect(await dashboardPage.isAuthenticated()).toBe(true);
  });

  test('rejects invalid credentials with an error and stays on /login', async ({ loginPage }) => {
    await loginPage.login({ username: 'not-a-real-user@example.com', password: 'wrong-password' });

    await expect(loginPage.page).toHaveURL(/login/);
    const error = await loginPage.getErrorText();
    expect(error.toLowerCase()).toContain(ErrorMessages.INVALID_CREDENTIALS.toLowerCase());
  });

  test('keeps submit blocked / errors when fields are empty', async ({ loginPage }) => {
    await loginPage.submitButton.click();
    // Either client-side validation blocks navigation, or the server errors —
    // both leave us on /login.
    await expect(loginPage.page).toHaveURL(/login/);
  });
});
