import { createError, defineEventHandler } from 'h3'
import { getProjectIdFromParams } from '../../utils/project'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getProjectIdFromParams(event)

  const project = await prisma.project.findUnique({
    where: { id }
  })

  if (!project) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Проект не найден'
    })
  }

  return project
})
