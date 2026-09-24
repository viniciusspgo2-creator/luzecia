import { PrismaClient } from "@prisma/client";

/**
 * Cliente Prisma singleton (evita múltiplas instâncias em hot-reload).
 * O fallback de datasourceUrl permite o primeiro uso no servidor de dev
 * mesmo quando .env foi criado depois do processo ter iniciado.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl:
      process.env.DATABASE_URL?.trim() || `file:${process.cwd()}/db/custom.db`,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
