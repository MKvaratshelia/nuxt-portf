import type { AuthSessionResponse } from '~~/types/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) {
    return
  }

  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

  let authenticated = false
  try {
    const response = await $fetch<AuthSessionResponse>('/api/auth/session', {
      credentials: 'include',
      cache: 'no-store',
      headers
    })
    authenticated = response.authenticated === true
  } catch {
    authenticated = false
  }

  if (to.path === '/admin/login') {
    if (authenticated) {
      return navigateTo('/admin')
    }
    return
  }

  if (!authenticated) {
    return navigateTo('/admin/login')
  }
})
