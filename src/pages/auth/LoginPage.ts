import { type Locator, type Page, expect } from '@playwright/test';
import { BasePage } from '@pages/BasePage';
import { Urls } from '@constants/urls';
import { Credentials } from '@configs/env/loadEnv';

/**
 * Login page for the GoCheckin POS portal.
 *
 * NOTE: The locators below are resilient role/label-based guesses. Confirm them
 * against the real DOM (`npm run codegen`) and adjust the `getBy*` selectors if
 * the app uses different labels/placeholders. Keep selectors user-facing
 * (role, label, text) over CSS where possible.
 */
export class LoginPage extends BasePage {
  protected readonly path = Urls.LOGIN;

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page
      .getByLabel(/username|email|phone/i)
      .or(page.getByPlaceholder(/username|email|phone/i))
      .first();
    this.passwordInput = page
      .getByLabel(/password/i)
      .or(page.getByPlaceholder(/password/i))
      .first();
    this.submitButton = page.getByRole('button', { name: /log\s*in|sign\s*in|login/i });
    this.errorMessage = page.getByRole('alert').or(page.locator('[class*="error"]')).first();
  }

  async waitForReady(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  /** Fills the form and submits. Does not assert the outcome — callers do. */
  async login(credentials: Credentials): Promise<void> {
    this.logger.info(`Login as ${credentials.username}`);
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.submitButton.click();
  }

  /** Logs in and waits for navigation away from /login (the success signal). */
  async loginAndWait(credentials: Credentials): Promise<void> {
    await this.login(credentials);
    await this.page.waitForURL((url) => !url.pathname.includes('login'), { timeout: 15_000 });
  }

  async getErrorText(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5_000 });
    return (await this.errorMessage.textContent())?.trim() ?? '';
  }
}
