import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })
}

type GlobalWithPrisma = typeof globalThis & {
  prisma: PrismaClient
}

const globalForPrisma = global as GlobalWithPrisma

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

globalForPrisma.prisma = prisma