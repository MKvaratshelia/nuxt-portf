import { defineEventHandler, readBody } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import {
  assertProjectExists,
  getProjectIdFromParams,
  validateProjectPayload
} from '../../../utils/project'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = getProjectIdFromParams(event)
  const body = await readBody(event)
  const payload = validateProjectPayload(body)

  await assertProjectExists(id)

  return prisma.project.update({
    where: { id },
    data: payload
  })
})
