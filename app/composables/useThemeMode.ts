import type { ThemeMode } from '~~/types/theme'

const THEME_KEY = 'portfolio-theme'
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

const normalizeTheme = (value: unknown): ThemeMode | null => {
  return value === 'light' || value === 'dark' ? value : null
}

const resolveSystemTheme = (): ThemeMode => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const syncHtmlTheme = (theme: ThemeMode): void => {
  if (!import.meta.client) {
    return
  }

  document.documentElement.setAttribute('data-theme', theme)
}

export const useThemeMode = () => {
  const themeCookie = useCookie<ThemeMode | null>(THEME_KEY, {
    default: () => null,
    maxAge: THEME_COOKIE_MAX_AGE,
    sameSite: 'lax'
  })

  const theme = useState<ThemeMode>('theme-mode', () => normalizeTheme(themeCookie.value) ?? 'light')
  const cookieTheme = normalizeTheme(themeCookie.value)

  if (cookieTheme && cookieTheme !== theme.value) {
    theme.value = cookieTheme
  }

  if (import.meta.client && cookieTheme) {
    syncHtmlTheme(cookieTheme)
  }

  const setTheme = (nextTheme: ThemeMode): void => {
    theme.value = nextTheme
    themeCookie.value = nextTheme
    syncHtmlTheme(nextTheme)
  }

  const toggleTheme = (): void => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  if (import.meta.client && !cookieTheme) {
    onMounted(() => {
      setTheme(resolveSystemTheme())
    })
  }

  return {
    theme,
    setTheme,
    toggleTheme
  }
}
