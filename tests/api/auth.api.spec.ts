import { test, expect } from '@fixtures/index';
import { Tag } from '@/types/testTags';
import { USERS } from '@data/static/users';

/**
 * API-level auth coverage against the REST backend. Runs in the `api` project
 * (no browser). Endpoint/response shape are placeholders — align AuthService
 * with the real GoCheckin API, then enable the assertions.
 */
test.describe(`Auth API ${Tag.API} ${Tag.AUTH}`, () => {
  test('POST /auth/login returns an access token for valid credentials', async ({
    authService,
  }) => {
    test.skip(
      !USERS.cashier.username || !USERS.cashier.password,
      'Missing cashier credentials in env',
    );

    const res = await authService.login(USERS.cashier);
    expect(res.accessToken, 'expected a non-empty access token').toBeTruthy();
  });

  test('POST /auth/login rejects bad credentials', async ({ authService }) => {
    await expect(
      authService.login({ username: 'nope@example.com', password: 'bad' }),
    ).rejects.toThrow(/login failed/i);
  });
});
