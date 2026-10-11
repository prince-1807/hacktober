import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __campusCpPrisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.__campusCpPrisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__campusCpPrisma = prisma;
}
