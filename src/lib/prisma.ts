import { PrismaClient } from "@prisma/client";
import { mockPrisma } from "./mock-data";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function realClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({ log: ["error", "warn"] });
  }
  return globalForPrisma.prisma;
}

const useMock = process.env.MOCK_DATA === "true";

/**
 * Single entry point for data access. When MOCK_DATA="true" the in-memory
 * mock client is used (no MariaDB needed for `npm run dev`); otherwise a
 * standard PrismaClient singleton (cached on globalThis for hot reload).
 */
export const prisma: PrismaClient = useMock
  ? (mockPrisma as unknown as PrismaClient)
  : realClient();

if (process.env.NODE_ENV !== "production" && !useMock) {
  globalForPrisma.prisma = prisma;
}
