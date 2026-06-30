import { env, Credentials } from '@configs/env/loadEnv';
import type { Role } from '@constants/auth';

/**
 * Role-based test accounts. Credentials come from the environment (never
 * hard-coded) so the same suite runs against local/stage/prod with each
 * environment's own seed users. Set them in configs/env/.env.<ENV>.
 */
export const USERS: Record<Role, Credentials> = {
  cashier: env.CASHIER,
  admin: env.ADMIN,
};
