import { defineEventHandler, readBody } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { validateProjectPayload } from '../../../utils/project'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)
  const payload = validateProjectPayload(body)

  return prisma.project.create({
    data: payload
  })
})
