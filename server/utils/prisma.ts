import { PrismaPg } from '@prisma/adapter-pg'
import prismaClientPkg from '@prisma/client'

const { PrismaClient } = prismaClientPkg
type PrismaClientInstance = InstanceType<typeof PrismaClient>

const databaseUrl = process.env.DATABASE_URL?.trim()

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set')
}

const adapter = new PrismaPg({
  connectionString: databaseUrl
})

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientInstance | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
