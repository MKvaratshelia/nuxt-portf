<script setup lang="ts">
import { getRequestErrorMessage } from "~/utils/request-errors";

definePageMeta({
    middleware: "admin-auth",
});

useSeoMeta({
    title: "Вход в кабинет | Портфолио",
    description: "Страница авторизации для входа в личный кабинет управления проектами.",
});

const form = reactive({
    login: "",
    password: "",
});

const showPassword = ref(false);

const loading = ref(false);
const errorMessage = ref("");

const submit = async () => {
    errorMessage.value = "";
    loading.value = true;

    try {
        await $fetch("/api/auth/login", {
            method: "POST",
            body: {
                login: form.login,
                password: form.password,
            },
        });

        await navigateTo("/admin");
    } catch (error) {
        errorMessage.value = getRequestErrorMessage(error, "Не удалось выполнить вход. Проверьте логин и пароль.");
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <section class="login">
        <h1>Вход в личный кабинет</h1>
        <form
            class="admin-form"
            @submit.prevent="submit"
        >
            <label class="admin-form-label">
                Логин
                <input
                    v-model="form.login"
                    class="admin-form-control"
                    type="text"
                    required
                />
            </label>
            <label class="admin-form-label">
                Пароль
                <div class="password-field">
                    <input
                        v-model="form.password"
                        class="password-input"
                        :type="showPassword ? 'text' : 'password'"
                        required
                    />
                    <button
                        type="button"
                        class="password-toggle"
                        :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
                        @click="showPassword = !showPassword"
                    >
                        <Icon
                            v-if="showPassword"
                            name="mdi:eye-off"
                            size="20"
                            aria-hidden="true"
                        />
                        <Icon
                            v-else
                            name="mdi:eye"
                            size="20"
                            aria-hidden="true"
                        />
                    </button>
                </div>
            </label>
            <button
                type="submit"
                class="admin-btn"
                :disabled="loading"
            >
                {{ loading ? "Входим..." : "Войти" }}
            </button>
            <p
                v-if="errorMessage"
                class="admin-error"
            >
                {{ errorMessage }}
            </p>
        </form>
    </section>
</template>

<style scoped>
.login {
    width: 100%;
    max-width: 420px;
}

.password-field {
    display: flex;
    align-items: center;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-bg-elevated);
    padding: 0 4px 0 0;
}

.password-input {
    box-shadow: none;
    outline: none;
    flex: 1;
    min-width: 0;
    border: none;
    background: transparent;
    padding: 10px;
    outline: none;
}

.password-field:focus-within {
    box-shadow: var(--focus-ring);
}

.password-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    border: 0;
    background: transparent;
    color: var(--color-text-muted);
    cursor: pointer;
    border-radius: 6px;
}

.password-toggle:hover {
    color: var(--color-text);
}

.password-toggle:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
}
</style>
