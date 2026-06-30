import * as path from 'path';

export type Role = 'cashier' | 'admin';

/**
 * Persisted Playwright storageState files, one per role. The auth setup
 * project writes these; UI projects read them via `storageState` so specs
 * start already logged in. Gitignored (.auth/) because they hold live tokens.
 */
export const AUTH_STATE: Record<Role, string> = {
  cashier: path.resolve(process.cwd(), '.auth/cashier.json'),
  admin: path.resolve(process.cwd(), '.auth/admin.json'),
};
