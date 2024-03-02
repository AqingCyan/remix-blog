import { PrismaClient } from '@prisma/client'

const __prisma: PrismaClient = new PrismaClient()

export const prisma = __prisma

prisma.$connect()
