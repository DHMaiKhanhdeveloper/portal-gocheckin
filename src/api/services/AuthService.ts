import { BaseApiClient } from '@api/clients/BaseApiClient';
import { LoginRequest, LoginResponse } from '@api/models/Auth';
import { ApiEnvelope } from '@api/models/Common';

/**
 * REST auth service. The endpoint path/response shape are placeholders —
 * confirm `/auth/login` and the envelope against the real GoCheckin API.
 */
export class AuthService {
  constructor(private readonly client: BaseApiClient) {}

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const res = await this.client.post('/auth/login', { data: credentials });
    if (!res.ok()) {
      throw new Error(`Login failed: HTTP ${res.status()} — ${await res.text()}`);
    }
    const body = (await res.json()) as ApiEnvelope<LoginResponse> | LoginResponse;
    // Tolerate both `{ data: {...} }` envelopes and bare payloads.
    return 'data' in body ? (body as ApiEnvelope<LoginResponse>).data : (body as LoginResponse);
  }

  /** Logs in and returns just the bearer token, ready for `client.setToken()`. */
  async getToken(credentials: LoginRequest): Promise<string> {
    const { accessToken } = await this.login(credentials);
    return accessToken;
  }
}
