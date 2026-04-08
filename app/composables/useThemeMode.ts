import type { ThemeMode } from '~~/types/theme'

const THEME_KEY = 'portfolio-theme'

const resolveClientTheme = (): ThemeMode => {
  const savedTheme = localStorage.getItem(THEME_KEY)
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const syncHtmlTheme = (theme: ThemeMode): void => {
  if (!import.meta.client) {
    return
  }

  document.documentElement.setAttribute('data-theme', theme)
}

export const useThemeMode = () => {
  const theme = useState<ThemeMode>('theme-mode', () => 'light')

  if (import.meta.client) {
    theme.value = resolveClientTheme()
    syncHtmlTheme(theme.value)
  }

  const setTheme = (nextTheme: ThemeMode): void => {
    theme.value = nextTheme
    syncHtmlTheme(nextTheme)

    if (import.meta.client) {
      localStorage.setItem(THEME_KEY, nextTheme)
    }
  }

  const toggleTheme = (): void => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  return {
    theme,
    setTheme,
    toggleTheme
  }
}
