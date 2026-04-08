import type { ErrorLike } from '~~/types/http'

const REQUEST_ERROR_MESSAGES = {
  network: 'Проверьте подключение к интернету и повторите попытку.',
  invalidCredentials: 'Неверный логин или пароль.',
  unauthorized: 'Сессия истекла или доступ запрещен. Выполните вход снова.',
  forbidden: 'Недостаточно прав для выполнения этого действия.',
  notFound: 'Данные не найдены или уже были удалены.',
  conflict: 'Конфликт данных. Обновите страницу и попробуйте снова.',
  validation: 'Проверьте корректность полей формы и повторите попытку.',
  tooManyRequests: 'Слишком много запросов. Подождите немного и повторите.',
  serviceUnavailable: 'Сервис временно недоступен. Повторите попытку позже.',
  misconfiguredServer: 'Ошибка конфигурации сервера. Свяжитесь с администратором.'
} as const

const resolveStatusCode = (error: ErrorLike): number | null => {
  if (typeof error.statusCode === 'number') {
    return error.statusCode
  }

  if (typeof error.status === 'number') {
    return error.status
  }

  if (typeof error.response?.status === 'number') {
    return error.response.status
  }

  return null
}

const resolveRawMessage = (error: ErrorLike): string => {
  const candidate =
    error.data?.statusMessage ??
    error.data?.message ??
    error.statusMessage ??
    error.message ??
    ''

  return String(candidate).trim().toLowerCase()
}

export const getRequestErrorMessage = (error: unknown, fallback: string): string => {
  if (!error || typeof error !== 'object') {
    return fallback
  }

  const normalized = error as ErrorLike
  const statusCode = resolveStatusCode(normalized)
  const rawMessage = resolveRawMessage(normalized)

  if (
    rawMessage.includes('failed to fetch') ||
    rawMessage.includes('networkerror') ||
    rawMessage.includes('network error') ||
    rawMessage.includes('timeout') ||
    rawMessage.includes('aborted')
  ) {
    return REQUEST_ERROR_MESSAGES.network
  }

  if (statusCode === 401) {
    if (rawMessage.includes('логин') || rawMessage.includes('пароль')) {
      return REQUEST_ERROR_MESSAGES.invalidCredentials
    }

    return REQUEST_ERROR_MESSAGES.unauthorized
  }

  if (statusCode === 403) {
    return REQUEST_ERROR_MESSAGES.forbidden
  }

  if (statusCode === 404) {
    return REQUEST_ERROR_MESSAGES.notFound
  }

  if (statusCode === 409) {
    return REQUEST_ERROR_MESSAGES.conflict
  }

  if (statusCode === 422) {
    return REQUEST_ERROR_MESSAGES.validation
  }

  if (statusCode === 429) {
    return REQUEST_ERROR_MESSAGES.tooManyRequests
  }

  if (statusCode === 500 || statusCode === 503) {
    return REQUEST_ERROR_MESSAGES.serviceUnavailable
  }

  if (rawMessage.includes('database_url')) {
    return REQUEST_ERROR_MESSAGES.misconfiguredServer
  }

  return fallback
}
