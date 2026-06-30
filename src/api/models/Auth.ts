export interface LoginRequest {
  username: string;
  password: string;
}

/** Shape of the auth response. Align field names with the real GoCheckin API. */
export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: {
    id: string;
    username: string;
    role?: string;
  };
}
