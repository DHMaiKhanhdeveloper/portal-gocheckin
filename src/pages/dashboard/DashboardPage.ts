import { type Locator, type Page, expect } from '@playwright/test';
import { BasePage } from '@pages/BasePage';
import { Urls } from '@constants/urls';

/**
 * Landing page after a successful login. Used to assert an authenticated
 * session and as the entry point to deeper POS flows.
 *
 * NOTE: Confirm the post-login signal (here: a user/account menu) against the
 * real DOM and tighten the locator. Update `path` if the app lands elsewhere.
 */
export class DashboardPage extends BasePage {
  protected readonly path = Urls.DASHBOARD;

  readonly userMenu: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.userMenu = page.getByRole('button', { name: /account|profile|menu|user/i }).first();
    this.logoutButton = page.getByRole('menuitem', { name: /log\s*out|sign\s*out/i });
  }

  async waitForReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** True when the page shows we are logged in (not bounced back to /login). */
  async isAuthenticated(): Promise<boolean> {
    return !this.page.url().includes('/login');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).not.toHaveURL(/login/);
  }

  async logout(): Promise<void> {
    await this.userMenu.click();
    await this.logoutButton.click();
    await this.page.waitForURL(/login/, { timeout: 10_000 });
  }
}
