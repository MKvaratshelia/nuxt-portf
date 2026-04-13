import { createError, defineEventHandler } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { deleteProjectImageByUrl } from '../../../utils/blob'
import { getProjectIdFromParams } from '../../../utils/project'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = getProjectIdFromParams(event)

  const project = await prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      image: true
    }
  })

  if (!project) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Проект не найден'
    })
  }

  const deletedProject = await prisma.project.delete({
    where: { id }
  })

  try {
    await deleteProjectImageByUrl(event, project.image)
  } catch (error) {
    console.error('Не удалось удалить изображение проекта из Blob', error)
  }

  return deletedProject
})
