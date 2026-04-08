import { defineEventHandler } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { assertProjectExists, getProjectIdFromParams } from '../../../utils/project'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = getProjectIdFromParams(event)

  await assertProjectExists(id)

  return prisma.project.delete({
    where: { id }
  })
})
