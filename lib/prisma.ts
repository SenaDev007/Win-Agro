import { PrismaClient } from "@prisma/client";

const globalRef = global as any;

if (!globalRef.prisma) {
  globalRef.prisma = new PrismaClient();
}

export const prisma = globalRef.prisma as PrismaClient;
