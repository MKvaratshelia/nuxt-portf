import { createError, defineEventHandler, readBody } from 'h3'
import type { LoginBody } from '~~/types/auth'
import { getAdminCredentials, setAdminSession } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event)

  const login = body?.login?.trim()
  const password = body?.password?.trim()

  if (!login || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Логин и пароль обязательны'
    })
  }

  const admin = getAdminCredentials(event)
  if (login !== admin.login || password !== admin.password) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Неверный логин или пароль'
    })
  }

  setAdminSession(event)

  return {
    success: true
  }
})
