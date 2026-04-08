<script setup lang="ts">
import { getRequestErrorMessage } from '~/utils/request-errors'

definePageMeta({
  middleware: 'admin-auth'
})

useSeoMeta({
  title: 'Вход в кабинет | Портфолио',
  description: 'Страница авторизации для входа в личный кабинет управления проектами.'
})

const form = reactive({
  login: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const submit = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        login: form.login,
        password: form.password
      }
    })

    await navigateTo('/admin')
  } catch (error) {
    errorMessage.value = getRequestErrorMessage(
      error,
      'Не удалось выполнить вход. Проверьте логин и пароль.',
    )
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="login">
    <h1>Вход в личный кабинет</h1>
    <form class="admin-form" @submit.prevent="submit">
      <label class="admin-form-label">
        Логин
        <input v-model="form.login" class="admin-form-control" type="text" required />
      </label>
      <label class="admin-form-label">
        Пароль
        <input v-model="form.password" class="admin-form-control" type="password" required />
      </label>
      <button type="submit" class="admin-btn" :disabled="loading">
        {{ loading ? 'Входим...' : 'Войти' }}
      </button>
      <p v-if="errorMessage" class="admin-error">{{ errorMessage }}</p>
    </form>
  </section>
</template>

<style scoped>
.login {
  width: 100%;
  max-width: 420px;
}
</style>
