<script setup lang="ts">
import type { Project } from '~~/types/project'
import { getRequestErrorMessage } from '~/utils/request-errors'
import { useProjectsStore } from '~/store/projects.store'

definePageMeta({
  middleware: 'admin-auth'
})

useSeoMeta({
  title: 'Личный кабинет | Портфолио',
  description: 'Управление проектами в личном кабинете: добавление, редактирование и удаление.'
})

const store = useProjectsStore()

await store.fetchProjects()

const editingId = ref<number | null>(null)
const editingProject = ref<Project | null>(null)
const pageError = ref('')

const startEdit = (project: Project) => {
  editingId.value = project.id
  editingProject.value = project
}

const resetEditing = () => {
  editingId.value = null
  editingProject.value = null
}

const removeProject = async (id: number) => {
  pageError.value = ''
  try {
    await store.removeProject(id)
    if (editingId.value === id) {
      resetEditing()
    }
  } catch (err) {
    pageError.value = getRequestErrorMessage(err, 'Не удалось удалить проект. Попробуйте повторить запрос.')
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

    <AdminProjectForm
      :editing-id="editingId"
      :editing-project="editingProject"
      @saved="resetEditing"
      @cancel="resetEditing"
    />

    <p v-if="pageError" class="admin-error">{{ pageError }}</p>
    <p v-if="store.pending">Загрузка...</p>

    <AdminProjectsTable
      v-if="store.projects.length"
      :projects="store.projects"
      @edit="startEdit"
      @delete="removeProject"
    />
    <p v-else-if="!store.pending">Проектов пока нет.</p>
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

.icon-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
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
</style>
