<script setup lang="ts">
const { theme, toggleTheme } = useThemeMode();

const themeButtonLabel = computed(() =>
    theme.value === "dark" ? "Переключить на светлую тему" : "Переключить на темную тему",
);
</script>

<template>
    <div class="app">
        <header class="header">
            <nav class="nav">
                <div class="links">
                    <NuxtLink
                        to="/"
                        class="nav-link"
                    >
                        <Icon
                            name="heroicons:home"
                            size="18"
                        />
                        <span>Главная</span>
                    </NuxtLink>
                    <NuxtLink
                        to="/about"
                        class="nav-link"
                    >
                        <Icon
                            name="heroicons:user-circle"
                            size="18"
                        />
                        <span>Обо мне</span>
                    </NuxtLink>
                    <NuxtLink
                        to="/admin"
                        class="nav-link"
                    >
                        <Icon
                            name="heroicons:cog-6-tooth"
                            size="18"
                        />
                        <span>Личный кабинет</span>
                    </NuxtLink>
                </div>
                <div class="nav-actions">
                    <a
                        href="https://github.com/MKvaratshelia"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="nav-icon-btn"
                        aria-label="GitHub"
                        title="GitHub"
                    >
                        <Icon
                            name="mdi:github"
                            size="18"
                        />
                    </a>
                    <button
                        type="button"
                        class="nav-icon-btn"
                        :aria-label="themeButtonLabel"
                        :title="themeButtonLabel"
                        @click="toggleTheme"
                    >
                        <Icon
                            :name="theme === 'dark' ? 'heroicons:sun' : 'heroicons:moon'"
                            size="18"
                        />
                    </button>
                </div>
            </nav>
        </header>
        <main class="main">
            <slot />
        </main>
    </div>
</template>

<style scoped>
.app {
    margin: 0 auto;
    max-width: 1280px;
    min-height: 100vh;
    background: var(--color-bg);
    color: var(--color-text);
}

.header {
    border-bottom: 1px solid var(--color-border);
    background: var(--color-bg-elevated);
}

.nav {
    width: 100%;
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

    &:hover {
        color: var(--color-primary);
    }
}

.nav-actions {
    display: inline-flex;
    align-items: center;
    gap: 10px;
}

.nav a.router-link-active {
    color: var(--color-primary);
}

.nav-icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    color: var(--color-text);
    border-radius: 999px;
    width: 38px;
    height: 38px;
    padding: 0;
    cursor: pointer;
    transition:
        border-color 0.2s ease,
        color 0.2s ease,
        background-color 0.2s ease;
}

.nav-icon-btn:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
}

.main {
    max-width: 1280px;
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

    .nav-actions {
        align-self: flex-end;
    }

    .main {
        padding: 20px 12px 32px;
    }
}
</style>
