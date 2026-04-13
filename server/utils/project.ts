import { createError, getRouterParam, type H3Event } from 'h3'
import type { ProjectPayload } from '~~/types/project'
import { prisma } from './prisma'

const MAX_TITLE_LENGTH = 120
const MAX_IMAGE_LENGTH = 4096
const MAX_GITHUB_LENGTH = 2048
const MAX_URL_LENGTH = 2048
const MAX_DESCRIPTION_LENGTH = 2000

function ensureString(
  value: unknown,
  fieldName: string,
  maxLength: number
): string {
  if (typeof value !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: `Поле ${fieldName} должно быть строкой`
    })
  }

  const normalized = value.trim()
  if (!normalized) {
    throw createError({
      statusCode: 400,
      statusMessage: `Поле ${fieldName} обязательно`
    })
  }

  if (normalized.length > maxLength) {
    throw createError({
      statusCode: 400,
      statusMessage: `Поле ${fieldName} превышает лимит ${maxLength} символов`
    })
  }

  return normalized
}

function ensureUrl(value: string, fieldName: string): string {
  try {
    const url = new URL(value)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error('invalid_protocol')
    }
    return url.toString()
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: `Поле ${fieldName} должно быть валидным URL`
    })
  }
}

function ensureProjectImage(value: unknown): string {
  return ensureUrl(
    ensureString(value, 'image', MAX_IMAGE_LENGTH),
    'image'
  )
}

function ensureOptionalUrl(
  value: unknown,
  fieldName: string,
  maxLength: number
): string | null {
  if (value === undefined || value === null) {
    return null
  }

  if (typeof value !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: `Поле ${fieldName} должно быть строкой`
    })
  }

  const normalized = value.trim()
  if (!normalized) {
    return null
  }

  if (normalized.length > maxLength) {
    throw createError({
      statusCode: 400,
      statusMessage: `Поле ${fieldName} превышает лимит ${maxLength} символов`
    })
  }

  return ensureUrl(normalized, fieldName)
}

export function validateProjectPayload(payload: unknown): ProjectPayload {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Некорректное тело запроса'
    })
  }

  const source = payload as Record<string, unknown>

  const title = ensureString(source.title, 'title', MAX_TITLE_LENGTH)
  const image = ensureProjectImage(source.image)
  const description = ensureString(
    source.description,
    'description',
    MAX_DESCRIPTION_LENGTH
  )
  const githubUrl = ensureUrl(
    ensureString(source.githubUrl, 'githubUrl', MAX_GITHUB_LENGTH),
    'githubUrl'
  )
  const url = ensureOptionalUrl(source.url, 'url', MAX_URL_LENGTH)

  return {
    title,
    image,
    description,
    githubUrl,
    url
  }
}

export function getProjectIdFromParams(event: H3Event): number {
  const idParam = getRouterParam(event, 'id')
  const id = Number(idParam)

  if (!Number.isInteger(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Некорректный id проекта'
    })
  }

  return id
}

export async function assertProjectExists(id: number): Promise<void> {
  const exists = await prisma.project.findUnique({
    where: { id },
    select: { id: true }
  })

  if (!exists) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Проект не найден'
    })
  }
}
