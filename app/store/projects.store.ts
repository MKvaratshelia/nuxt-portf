import { defineStore } from 'pinia'
import type { Project, ProjectPayload } from '~~/types/project'
import { getRequestErrorMessage } from '~/utils/request-errors'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const pending = ref(false)
  const error = ref('')
  const initialized = ref(false)

  async function fetchProjects() {
    if (initialized.value) return

    pending.value = true
    error.value = ''
    try {
      projects.value = await $fetch<Project[]>('/api/projects')
      initialized.value = true
    } catch (err) {
      error.value = getRequestErrorMessage(err, 'Не удалось загрузить проекты. Обновите страницу и попробуйте снова.')
    } finally {
      pending.value = false
    }
  }

  async function saveProject(payload: ProjectPayload, editingId: number | null) {
    if (editingId) {
      await $fetch(`/api/admin/projects/${editingId}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/admin/projects', { method: 'POST', body: payload })
    }
    initialized.value = false
    await fetchProjects()
  }

  async function removeProject(id: number) {
    await $fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
    initialized.value = false
    await fetchProjects()
  }

  return { projects, pending, error, fetchProjects, saveProject, removeProject }
})
