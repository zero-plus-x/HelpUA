import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// @TODO disconnect on shutdown or on error
// await prisma.$disconnect()
