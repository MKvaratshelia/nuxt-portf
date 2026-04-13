import { createError, defineEventHandler, readFormData } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { uploadProjectImage } from '../../../utils/blob'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const formData = await readFormData(event)
  const image = formData?.get('image')

  if (!(image instanceof File)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Нужно передать файл изображения'
    })
  }

  const uploadedImage = await uploadProjectImage(event, image)

  return {
    image: uploadedImage.url,
    pathname: uploadedImage.pathname
  }
})
