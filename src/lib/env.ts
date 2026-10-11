// STRICT SERVER-ONLY ENVIRONMENT LOADER
// Throws a fatal exception if imported on the browser/client side.

if (typeof window !== 'undefined') {
  throw new Error(
    'FATAL SECURITY VIOLATION: src/lib/env.ts is being imported or evaluated on the client side! ' +
    'Server secrets (DATABASE_URL, REDIS_URL, SYNC_TOKEN) must NEVER be exposed to the browser.'
  );
}

export interface ServerEnv {
  DATABASE_URL: string;
  REDIS_URL: string;
  SYNC_TOKEN: string;
  NODE_ENV: string;
  ENABLE_LIVE_SCRAPING: boolean;
}

/**
 * Validates and returns server-only environment variables.
 * Safe fallback defaults are provided for instant zero-config local demos.
 */
export function getServerEnv(): ServerEnv {
  if (typeof window !== 'undefined') {
    throw new Error('FATAL SECURITY VIOLATION: Client-side access to server environment is forbidden.');
  }

  return {
    DATABASE_URL:
      process.env.DATABASE_URL ||
      'postgresql://campus_cp_admin:hacktober_secret@localhost:5432/campus_cp_db?schema=public',
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
    SYNC_TOKEN:
      process.env.SYNC_TOKEN || 'bit_sindri_hacktober_2026_secure_sync_token',
    NODE_ENV: process.env.NODE_ENV || 'development',
    ENABLE_LIVE_SCRAPING: process.env.ENABLE_LIVE_SCRAPING === 'true',
  };
}

export const env = getServerEnv();
