# E2E GoCheckin POS Test — Playwright (TypeScript)

Enterprise-grade Playwright automation framework for the **GoCheckin POS** portal. Page Object Model, role-based authentication via persisted storage state, a typed REST API layer, multi-environment config, Allure reporting, and CI/CD.

> Target app: `https://pos.gocheckin.net` · REST API at `API_BASE_URL`.

---

## Highlights

- **Page Object Model** with a shared [BasePage](src/pages/BasePage.ts) and POs ([LoginPage](src/pages/auth/LoginPage.ts), [DashboardPage](src/pages/dashboard/DashboardPage.ts)).
- **Role-based auth** — a Playwright `setup` project logs in once per role and saves `storageState` to `.auth/<role>.json`; UI specs start already authenticated. See [auth.setup.ts](tests/auth.setup.ts).
- **REST API layer** — [BaseApiClient](src/api/clients/BaseApiClient.ts) + [AuthService](src/api/services/AuthService.ts) with typed models.
- **Fixtures** — `mergeTests` of `pagesFixture` + `apiFixture` exposes one `test` object with POs and API services pre-built.
- **Multi-environment** typed config via [loadEnv()](configs/env/loadEnv.ts) reading `configs/env/.env.<ENV>`.
- **Pre-test health check** — `npm test` first pings `BASE_URL` and fails fast if unreachable.
- **Reports** — HTML + JUnit + JSON + Allure; traces/screenshots/videos retained on failure.
- **CI/CD** — GitHub Actions for PR + nightly regression; reproducible Docker runner.

---

## Project structure

```
.
├── .github/workflows/         # GitHub Actions: PR (e2e) + nightly regression
├── configs/
│   ├── env/                   # .env.example + loadEnv.ts (typed, multi-env)
│   └── constants/             # timeouts
├── src/
│   ├── api/                   # REST client + services + models
│   ├── pages/                 # BasePage + auth/dashboard POs
│   ├── components/            # BaseComponent, modal/BaseModal
│   ├── fixtures/              # pages.fixture, api.fixture, merged index.ts
│   ├── helpers/               # cross-cutting business helpers (placeholder)
│   ├── utils/                 # logger, retry, date, money, string, file
│   ├── data/static/           # role-based test users (from env)
│   ├── types/                 # global.d.ts, test tag enum
│   └── constants/             # URLs, error messages, auth-state paths
├── tests/
│   ├── auth.setup.ts          # login once per role → .auth/<role>.json
│   ├── smoke/                 # login renders, no console errors
│   ├── e2e/auth/              # full login flow (valid / invalid / empty)
│   └── api/                   # REST auth coverage
├── scripts/                   # check-server (pretest), cleanReports
├── docker/                    # Dockerfile + docker-compose + .dockerignore
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

---

## First-time setup

```bash
# 1. Install dependencies + Playwright Chromium
npm run setup

# 2. Configure environment + credentials
cp configs/env/.env.example configs/env/.env.local
#   then edit CASHIER_USER / CASHIER_PASS / ADMIN_USER / ADMIN_PASS, BASE_URL, API_BASE_URL

# 3. Run tests
npm test
```

`npm test` triggers `pretest` → [scripts/check-server.mjs](scripts/check-server.mjs); if `BASE_URL` is unreachable it tells you what to check and exits.

---

## Running tests

```bash
npm test                # all tests, ENV=local (headless)
npm run test:headed     # browser visible
npm run test:ui         # Playwright UI mode
npm run test:debug      # PWDEBUG=1 step-through
npm run test:smoke      # @smoke
npm run test:regression # @regression
npm run test:e2e        # tests/e2e
npm run test:auth       # tests/e2e/auth
npm run test:api        # api project (REST)
npm run codegen         # record against https://pos.gocheckin.net
```

Environments: `npm run test:stage`, `npm run test:prod` (read `configs/env/.env.<ENV>`).

---

## How authentication works

1. The `setup` project ([auth.setup.ts](tests/auth.setup.ts)) logs in through the real login page for each role and writes `.auth/cashier.json` / `.auth/admin.json`.
2. The `chromium` project declares `dependencies: ['setup']` and `storageState: AUTH_STATE.cashier`, so every UI spec starts logged in.
3. Specs that need a **logged-out** state opt out with `test.use({ storageState: { cookies: [], origins: [] } })` — see the login specs.

`.auth/` holds live tokens and is gitignored. Setup steps self-skip when credentials are absent so a fresh clone still type-checks and lists tests.

---

## Reports

```bash
npm run report                 # opens reports/html
npm run report:allure          # generate + open Allure
npm run report:allure:serve    # serve Allure live
```

---

## ⚠️ Selectors need confirming against the real DOM

This scaffold ships **resilient but unverified** locators for the login and
dashboard pages (role/label/placeholder based). Before relying on the suite:

1. Run `npm run codegen` against `https://pos.gocheckin.net`.
2. Confirm/adjust the `getBy*` selectors in [LoginPage](src/pages/auth/LoginPage.ts) and [DashboardPage](src/pages/dashboard/DashboardPage.ts).
3. Confirm the REST `/auth/login` path + response shape in [AuthService](src/api/services/AuthService.ts) and [Auth model](src/api/models/Auth.ts).
4. Confirm route paths in [src/constants/urls.ts](src/constants/urls.ts).

Each of these files carries a `NOTE:` comment marking exactly what to verify.

---

## CI/CD

- `.github/workflows/e2e.yml` — PR + push; typecheck, lint, run suite, upload reports/traces.
- `.github/workflows/nightly-regression.yml` — nightly `@regression` on stage.

Set `BASE_URL`, `API_BASE_URL`, and the role credentials as GitHub Secrets.

---

## Docker

```bash
docker compose -f docker/docker-compose.yml run --rm e2e
```
