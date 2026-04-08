import { createHash, timingSafeEqual } from 'node:crypto'
import { createError, deleteCookie, getCookie, setCookie, type H3Event } from 'h3'
import { useRuntimeConfig } from '#imports'

const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_TTL = 60 * 60 * 24 * 7

function buildSessionToken(login: string, password: string, secret: string): string {
  return createHash('sha256').update(`${login}:${password}:${secret}`).digest('hex')
}

export function getAdminCredentials(event: H3Event) {
  const config = useRuntimeConfig(event)
  const login = config.adminLogin?.trim()
  const password = config.adminPassword?.trim()
  const secret = config.adminSessionSecret?.trim()

  if (!login || !password || !secret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Переменные ADMIN_LOGIN, ADMIN_PASSWORD, ADMIN_SESSION_SECRET не заданы'
    })
  }

  return { login, password, secret }
}

export function isAdminAuthenticated(event: H3Event): boolean {
  const cookieToken = getCookie(event, SESSION_COOKIE_NAME)
  if (!cookieToken) {
    return false
  }

  const { login, password, secret } = getAdminCredentials(event)
  const expectedToken = buildSessionToken(login, password, secret)

  const actual = Buffer.from(cookieToken, 'utf8')
  const expected = Buffer.from(expectedToken, 'utf8')
  if (actual.length !== expected.length) {
    return false
  }

  return timingSafeEqual(actual, expected)
}

export function setAdminSession(event: H3Event): void {
  const { login, password, secret } = getAdminCredentials(event)
  const token = buildSessionToken(login, password, secret)

  setCookie(event, SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL
  })
}

export function clearAdminSession(event: H3Event): void {
  deleteCookie(event, SESSION_COOKIE_NAME, { path: '/' })
}

export function requireAdmin(event: H3Event): void {
  if (!isAdminAuthenticated(event)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Требуется авторизация'
    })
  }
}
