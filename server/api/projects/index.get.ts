import { defineEventHandler } from 'h3'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  return prisma.project.findMany({
    orderBy: { createdAt: 'desc' }
  })
})
