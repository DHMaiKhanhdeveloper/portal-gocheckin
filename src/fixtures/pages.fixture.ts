import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/auth/LoginPage';
import { DashboardPage } from '@pages/dashboard/DashboardPage';

export interface PagesFixture {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
}

export const pagesFixture = base.extend<PagesFixture>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});
