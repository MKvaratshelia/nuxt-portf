import { createError, defineEventHandler, readBody } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { deleteProjectImageByUrl } from '../../../utils/blob'
import { getProjectIdFromParams, validateProjectPayload } from '../../../utils/project'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = getProjectIdFromParams(event)
  const body = await readBody(event)
  const payload = validateProjectPayload(body)

  const currentProject = await prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      image: true
    }
  })

  if (!currentProject) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Проект не найден'
    })
  }

  const updatedProject = await prisma.project.update({
    where: { id },
    data: payload
  })

  if (currentProject.image !== updatedProject.image) {
    try {
      await deleteProjectImageByUrl(event, currentProject.image)
    } catch (error) {
      console.error('Не удалось удалить старое изображение проекта из Blob', error)
    }
  }

  return updatedProject
})
