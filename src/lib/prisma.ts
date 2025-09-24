import { PrismaClient as PrismaMainClient } from "../../prisma/generated/main-database/index.js";

const globalForPrisma = global as unknown as {
  prismaMain: PrismaMainClient | undefined;
};

export const prismaMain =
  globalForPrisma.prismaMain ??
  new PrismaMainClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaMain = prismaMain;
}
