# Contributing

## Conventions

- **Language**: TypeScript, strict mode. No `any` without a comment justifying it.
- **Imports**: use path aliases (`@pages/*`, `@api/*`, `@fixtures/*`, …) — never deep relative paths like `../../../`.
- **Tests import `test`/`expect` from `@fixtures/index`**, not `@playwright/test`.
- **Selectors**: prefer user-facing locators (`getByRole`, `getByLabel`, `getByText`) over CSS/XPath. Avoid brittle nth-child chains.
- **Waits**: wait on real signals (a locator becoming visible, a URL change). Avoid fixed `waitForTimeout` outside the support layer.
- **Formatting/lint**: Prettier + ESLint run on commit via Husky + lint-staged. Run `npm run lint:fix && npm run format` before pushing.

## Adding a page object

1. Create `src/pages/<area>/<Name>Page.ts` extending [BasePage](src/pages/BasePage.ts).
2. Declare `path` and a `waitForReady()` that asserts a signature locator.
3. Expose intent-revealing methods (`login`, `expectLoaded`) — not raw locators in tests.
4. Register it in [src/pages/index.ts](src/pages/index.ts) and, if widely used, in [pages.fixture.ts](src/fixtures/pages.fixture.ts).

## Adding an API service

1. Add the model under `src/api/models/`.
2. Add the service under `src/api/services/` taking a `BaseApiClient`.
3. Register it in [api.fixture.ts](src/fixtures/api.fixture.ts) and [src/api/index.ts](src/api/index.ts).

## Test tagging

Tag `describe`/`test` titles with constants from [src/types/testTags.ts](src/types/testTags.ts)
(`@smoke`, `@regression`, `@api`, `@auth`, …) so suites can be filtered with `--grep`.

## Before opening a PR

```bash
npm run typecheck
npm run lint
npm run format:check
npm run test:smoke
```
