import { PrismaClient } from "@prisma-db-auth/client";

const globalForPrisma = global as unknown as { prismaDbAuth: PrismaClient };

export const prismaDbAuth =
  globalForPrisma.prismaDbAuth || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaDbAuth = prismaDbAuth;