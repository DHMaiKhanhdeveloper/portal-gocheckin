import { test as base } from '@playwright/test';
import { BaseApiClient } from '@api/clients/BaseApiClient';
import { AuthService } from '@api/services/AuthService';

export interface ApiFixture {
  apiClient: BaseApiClient;
  authService: AuthService;
}

export const apiFixture = base.extend<ApiFixture>({
  apiClient: async ({}, use) => {
    const client = new BaseApiClient();
    await client.init();
    await use(client);
    await client.dispose();
  },
  authService: async ({ apiClient }, use) => {
    await use(new AuthService(apiClient));
  },
});
