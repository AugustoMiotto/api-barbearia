import { PrismaClient } from '@prisma/client';

// Cria uma única instância do Prisma para toda a aplicação usar
export const prisma = new PrismaClient();