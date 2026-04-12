<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{
    error: NuxtError;
}>();

useThemeMode();

const isNotFound = computed(() => props.error?.status === 404);

const title = computed(() => (isNotFound.value ? "Страница не найдена" : "Произошла ошибка"));
const description = computed(() => {
    if (isNotFound.value) {
        return "Похоже, такой страницы не существует или она была перемещена.";
    }

    return props.error?.statusMessage || "Попробуйте обновить страницу или вернуться на главную.";
});

const backHome = () => clearError({ redirect: "/" });
</script>

<template>
    <main class="error-page">
        <section class="error-card">
            <p class="error-code">{{ error?.statusCode || 500 }}</p>
            <h1>{{ title }}</h1>
            <p class="error-text">{{ description }}</p>

            <div class="error-actions">
                <button
                    type="button"
                    class="error-btn error-btn-primary"
                    @click="backHome"
                >
                    На главную
                </button>
                <button
                    type="button"
                    class="error-btn error-btn-ghost"
                    @click="reloadNuxtApp()"
                >
                    Обновить страницу
                </button>
            </div>
        </section>
    </main>
</template>

<style scoped>
.error-page {
    min-height: 100vh;
    padding: 16px;
    display: grid;
    place-items: center;
    background: var(--color-bg);
}

.error-card {
    width: min(100%, 560px);
    border: 1px solid var(--color-border);
    border-radius: 14px;
    padding: 28px 20px;
    background: var(--color-bg-elevated);
    text-align: center;
    display: grid;
    gap: 12px;
}

.error-code {
    margin: 0;
    font-size: clamp(32px, 8vw, 56px);
    line-height: 1;
    font-weight: 700;
    color: var(--color-primary);
}

h1 {
    margin: 0;
}

.error-text {
    margin: 0;
    color: var(--color-text-muted);
    overflow-wrap: anywhere;
}

.error-actions {
    margin-top: 6px;
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
}

.error-btn {
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 10px 14px;
    cursor: pointer;
    font: inherit;
}

.error-btn-primary {
    border-color: var(--color-primary);
    background: var(--color-primary);
    color: var(--color-on-primary);
}

.error-btn-primary:hover {
    border-color: var(--color-primary-hover);
    background: var(--color-primary-hover);
}

.error-btn-ghost {
    background: var(--color-bg-elevated);
    color: var(--color-text);
}

.error-btn-ghost:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
}

@media (max-width: 480px) {
    .error-card {
        padding: 24px 14px;
    }

    .error-actions {
        flex-direction: column;
    }

    .error-btn {
        width: 100%;
    }
}
</style>
