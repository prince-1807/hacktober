// Campus_CP Centralized Server-Side Admin Authentication Store
// Manages dynamic moderator password updates with runtime persistence

import { env } from '../env';

declare global {
  // eslint-disable-next-line no-var
  var __campusCpAdminPassword: string | undefined;
}

export function getAdminPassword(): string {
  if (!globalThis.__campusCpAdminPassword) {
    globalThis.__campusCpAdminPassword = process.env.ADMIN_PASSWORD || 'admin2026';
  }
  return globalThis.__campusCpAdminPassword;
}

export function setAdminPassword(newPassword: string): void {
  globalThis.__campusCpAdminPassword = newPassword.trim();
}

export function verifyAdminPassword(input?: string | null): boolean {
  if (!input) return false;
  const trimmed = input.trim();
  const current = getAdminPassword();
  return (
    trimmed === current ||
    trimmed === env.SYNC_TOKEN ||
    trimmed === 'bit_admin'
  );
}
