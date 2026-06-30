/**
 * Route paths for the GoCheckin POS portal, relative to `baseURL`.
 * Confirm/extend these against the running app before adding deep flows.
 */
export const Urls = {
  LOGIN: '/login',
  DASHBOARD: '/',
  CHECK_IN: '/check-in',
  ORDERS: '/orders',
  REPORTS: '/reports',
  SETTINGS: '/settings',
} as const;
