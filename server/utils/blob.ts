import { BlobNotFoundError, del, put } from '@vercel/blob'
import { randomUUID } from 'node:crypto'
import { createError, type H3Event } from 'h3'
import { useRuntimeConfig } from '#imports'

const PROJECT_IMAGE_PREFIX = 'projects'
const PROJECT_IMAGE_PATH_PREFIX = `/${PROJECT_IMAGE_PREFIX}/`
const PROJECT_IMAGE_HOST_SUFFIX = '.public.blob.vercel-storage.com'

const PROJECT_IMAGE_MIME_EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp'
}

export const PROJECT_IMAGE_MAX_SIZE = 4 * 1024 * 1024

function getBlobToken(event: H3Event): string {
  const token = useRuntimeConfig(event).blobReadWriteToken?.trim()
  if (!token) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Переменная BLOB_READ_WRITE_TOKEN не задана'
    })
  }

  return token
}

function getProjectImageExtension(file: File): string {
  const extension = PROJECT_IMAGE_MIME_EXTENSIONS[file.type]
  if (!extension) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Поддерживаются только JPG, PNG и WEBP изображения'
    })
  }

  return extension
}

export function ensureProjectImageFile(file: File | null): File {
  if (!(file instanceof File) || !file.size) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Файл изображения не найден'
    })
  }

  getProjectImageExtension(file)

  if (file.size > PROJECT_IMAGE_MAX_SIZE) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Размер изображения не должен превышать 4 МБ'
    })
  }

  return file
}

export async function uploadProjectImage(event: H3Event, file: File) {
  const safeFile = ensureProjectImageFile(file)
  const extension = getProjectImageExtension(safeFile)
  const pathname = `${PROJECT_IMAGE_PREFIX}/${randomUUID()}${extension}`

  return put(pathname, safeFile, {
    access: 'public',
    addRandomSuffix: false,
    contentType: safeFile.type,
    token: getBlobToken(event)
  })
}

export function getProjectImageBlobPathname(imageUrl: string): string | null {
  try {
    const url = new URL(imageUrl)
    if (url.protocol !== 'https:') {
      return null
    }

    if (!url.hostname.endsWith(PROJECT_IMAGE_HOST_SUFFIX)) {
      return null
    }

    if (!url.pathname.startsWith(PROJECT_IMAGE_PATH_PREFIX)) {
      return null
    }

    return url.pathname.slice(1)
  } catch {
    return null
  }
}

export function isProjectImageBlobUrl(imageUrl: string): boolean {
  return getProjectImageBlobPathname(imageUrl) !== null
}

export async function deleteProjectImageByUrl(event: H3Event, imageUrl: string): Promise<boolean> {
  const pathname = getProjectImageBlobPathname(imageUrl)
  if (!pathname) {
    return false
  }

  try {
    await del(pathname, { token: getBlobToken(event) })
    return true
  } catch (error) {
    if (error instanceof BlobNotFoundError) {
      return false
    }

    throw error
  }
}
