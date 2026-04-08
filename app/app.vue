<script setup lang="ts">
const { theme, toggleTheme } = useThemeMode()

useHead(() => ({
  htmlAttrs: {
    'data-theme': theme.value
  }
}))

const themeButtonLabel = computed(() =>
  theme.value === 'dark' ? 'Переключить на светлую тему' : 'Переключить на темную тему'
)
</script>

<template>
  <div class="app">
    <NuxtRouteAnnouncer />
    <header class="header">
      <nav class="nav">
        <div class="links">
          <NuxtLink to="/" class="nav-link">
            <Icon name="heroicons:home" size="18" />
            <span>Главная</span>
          </NuxtLink>
          <NuxtLink to="/about" class="nav-link">
            <Icon name="heroicons:user-circle" size="18" />
            <span>Обо мне</span>
          </NuxtLink>
          <NuxtLink to="/admin" class="nav-link">
            <Icon name="heroicons:cog-6-tooth" size="18" />
            <span>Личный кабинет</span>
          </NuxtLink>
        </div>
        <button
          type="button"
          class="theme-toggle"
          :aria-label="themeButtonLabel"
          :title="themeButtonLabel"
          @click="toggleTheme"
        >
          <Icon :name="theme === 'dark' ? 'heroicons:sun' : 'heroicons:moon'" size="18" />
        </button>
      </nav>
    </header>
    <main class="main">
      <NuxtPage />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: var(--color-bg);
  color: var(--color-text);
}

.header {
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-elevated);
}

.nav {
  max-width: 1040px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.nav a {
  text-decoration: none;
  color: var(--color-text);
  font-weight: 600;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.nav a.router-link-active {
  color: var(--color-primary);
}

.theme-toggle {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
  border-radius: 999px;
  width: 38px;
  height: 38px;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease;
}

.theme-toggle:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.main {
  max-width: 1040px;
  margin: 0 auto;
  padding: 24px 16px 40px;
}

@media (max-width: 640px) {
  .nav {
    align-items: stretch;
    flex-direction: column;
    padding: 12px;
  }

  .links {
    width: 100%;
    gap: 10px 14px;
  }

  .theme-toggle {
    align-self: flex-end;
  }

  .main {
    padding: 20px 12px 32px;
  }
}
</style>
