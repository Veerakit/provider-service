import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function truncateTable(): Promise<void> {
  await prisma.$executeRaw`DELETE FROM "Movie"`
  await prisma.$executeRaw`DELETE sqlite_sequence WHERE name = "Movie"`
  console.log('Table truncated')
  await prisma.$disconnect()
}
