# Tests

| Folder        | Purpose                                                       | Project    |
| ------------- | ------------------------------------------------------------- | ---------- |
| `auth.setup.ts` | Logs in once per role, persists `.auth/<role>.json`.        | `setup`    |
| `smoke/`      | Fast, shallow checks the app is up and the login renders.     | `chromium` |
| `e2e/`        | Full user-journey flows (login, …).                           | `chromium` |
| `api/`        | REST API coverage, no browser.                                | `api`      |
| `visual/`     | `__snapshots__` for `toHaveScreenshot` (add as needed).       | `chromium` |

## Authoring a test

```ts
import { test, expect } from '@fixtures/index';
import { Tag } from '@/types/testTags';
import { USERS } from '@data/static/users';

test.describe(`Feature ${Tag.REGRESSION}`, () => {
  test('does the thing', async ({ dashboardPage }) => {
    // UI specs start ALREADY authenticated (storageState from the setup project).
    await dashboardPage.goto();
    await dashboardPage.expectLoaded();
  });
});
```

Rules:

- Import `test, expect` from `@fixtures/index` — **not** `@playwright/test` — or fixtures won't be available.
- UI specs are authenticated by default. To test logged-out flows, add
  `test.use({ storageState: { cookies: [], origins: [] } });` (see the login specs).
- Tag titles with `@smoke` / `@regression` / `@api` etc. from `@/types/testTags`.
