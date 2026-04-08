<script setup lang="ts">
import type { Project, ProjectPayload } from '~~/types/project'
import { getRequestErrorMessage } from '~/utils/request-errors'

definePageMeta({
  middleware: 'admin-auth'
})

useSeoMeta({
  title: 'Личный кабинет | Портфолио',
  description: 'Управление проектами в личном кабинете: добавление, редактирование и удаление.'
})

const emptyForm: ProjectPayload = {
  title: '',
  image: '',
  description: '',
  githubUrl: '',
  url: ''
}

const form = reactive<ProjectPayload>({ ...emptyForm })
const editingId = ref<number | null>(null)
const saving = ref(false)
const pageError = ref('')

const { data: projects, pending, error, refresh } = await useFetch<Project[]>('/api/projects')

watch(error, (value) => {
  if (value) {
    pageError.value = getRequestErrorMessage(
      value,
      'Не удалось загрузить список проектов. Обновите страницу.',
    )
  }
})

const resetForm = () => {
  Object.assign(form, emptyForm)
  editingId.value = null
}

const fillForEdit = (project: Project) => {
  editingId.value = project.id
  form.title = project.title
  form.image = project.image
  form.description = project.description
  form.githubUrl = project.githubUrl
  form.url = project.url
}

const saveProject = async () => {
  pageError.value = ''
  saving.value = true

  try {
    if (editingId.value) {
      await $fetch(`/api/admin/projects/${editingId.value}`, {
        method: 'PUT',
        body: form
      })
    } else {
      await $fetch('/api/admin/projects', {
        method: 'POST',
        body: form
      })
    }

    resetForm()
    await refresh()
  } catch (err) {
    pageError.value = getRequestErrorMessage(
      err,
      'Не удалось сохранить проект. Проверьте заполнение формы.',
    )
  } finally {
    saving.value = false
  }
}

const removeProject = async (id: number) => {
  pageError.value = ''
  try {
    await $fetch(`/api/admin/projects/${id}`, {
      method: 'DELETE'
    })

    if (editingId.value === id) {
      resetForm()
    }

    await refresh()
  } catch (err) {
    pageError.value = getRequestErrorMessage(
      err,
      'Не удалось удалить проект. Попробуйте повторить запрос.',
    )
  }
}

const logout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}
</script>

<template>
  <section class="admin">
    <header class="top">
      <h1>Личный кабинет</h1>
      <button type="button" class="admin-btn admin-btn-ghost icon-button" @click="logout">
        <Icon name="heroicons:arrow-left-on-rectangle" size="16" />
        <span>Выйти</span>
      </button>
    </header>

    <form class="admin-form form-panel" @submit.prevent="saveProject">
      <h2>{{ editingId ? 'Редактирование проекта' : 'Добавление проекта' }}</h2>
      <label class="admin-form-label">
        Название
        <input v-model="form.title" class="admin-form-control" type="text" required />
      </label>
      <label class="admin-form-label">
        Ссылка на картинку
        <input v-model="form.image" class="admin-form-control" type="url" required />
      </label>
      <label class="admin-form-label">
        Описание
        <textarea v-model="form.description" class="admin-form-control" required rows="4" />
      </label>
      <label class="admin-form-label">
        GitHub URL
        <input v-model="form.githubUrl" class="admin-form-control" type="url" required />
      </label>
      <label class="admin-form-label">
        URL проекта
        <input v-model="form.url" class="admin-form-control" type="url" required />
      </label>
      <div class="actions">
        <button type="submit" class="admin-btn" :disabled="saving">
          {{ saving ? 'Сохраняем...' : editingId ? 'Обновить' : 'Добавить' }}
        </button>
        <button
          v-if="editingId"
          type="button"
          class="admin-btn admin-btn-ghost"
          @click="resetForm"
        >
          Отмена
        </button>
      </div>
    </form>

    <p v-if="pageError" class="admin-error">{{ pageError }}</p>
    <p v-if="pending">Загрузка...</p>

    <div v-if="projects?.length" class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>GitHub</th>
            <th>URL</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id">
            <td>{{ project.id }}</td>
            <td>{{ project.title }}</td>
            <td>
              <a :href="project.githubUrl" target="_blank" rel="noopener noreferrer" class="table-link">
                <Icon name="simple-icons:github" size="14" />
                <span>GitHub</span>
              </a>
            </td>
            <td>
              <a :href="project.url" target="_blank" rel="noopener noreferrer" class="table-link">
                <Icon name="heroicons:arrow-top-right-on-square" size="14" />
                <span>Открыть</span>
              </a>
            </td>
            <td class="row-actions">
              <button
                type="button"
                class="admin-btn admin-btn-ghost icon-button"
                @click="fillForEdit(project)"
              >
                <Icon name="heroicons:pencil-square" size="16" />
                <span>Изменить</span>
              </button>
              <button
                type="button"
                class="admin-btn danger icon-button"
                @click="removeProject(project.id)"
              >
                <Icon name="heroicons:trash" size="16" />
                <span>Удалить</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else-if="!pending">Проектов пока нет.</p>
  </section>
</template>

<style scoped>
.admin {
  display: grid;
  gap: 16px;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.form-panel {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 16px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.table-wrap {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-bg-elevated);
}

.danger {
  border-color: var(--color-danger);
  background: var(--color-danger);
}

.table {
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;
}

.table th,
.table td {
  border-bottom: 1px solid var(--color-border);
  padding: 10px;
  text-align: left;
  overflow-wrap: anywhere;
}

.danger:hover {
  border-color: var(--color-danger-hover);
  background: var(--color-danger-hover);
}

.row-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.icon-button,
.table-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.table-link {
  color: var(--color-link);
  text-decoration: none;
  font-weight: 600;
}

@media (max-width: 768px) {
  .top {
    flex-direction: column;
    align-items: stretch;
  }

  .top .admin-btn {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .actions .admin-btn {
    width: 100%;
  }
}
</style>
