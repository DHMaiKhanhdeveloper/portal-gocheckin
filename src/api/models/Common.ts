/** Standard envelope many REST endpoints wrap their payload in. Adjust to match the real API. */
export interface ApiEnvelope<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}
