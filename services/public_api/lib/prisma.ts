// import { PrismaClient } from "@prisma/client";

import { PrismaClient } from "@prisma/client";


// const prisma = new PrismaClient()
// export default prisma;


// lib/prisma.ts

const globalForPrisma = global as any;

export const prisma =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}