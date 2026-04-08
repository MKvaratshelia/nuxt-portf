<script setup lang="ts">
import type { Project } from '~~/types/project'

defineProps<{
  projects: Project[]
}>()

const emit = defineEmits<{
  edit: [project: Project]
  delete: [id: number]
}>()
</script>

<template>
  <div class="table-wrap">
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
            <a
              v-if="project.url"
              :href="project.url"
              target="_blank"
              rel="noopener noreferrer"
              class="table-link"
            >
              <Icon name="heroicons:arrow-top-right-on-square" size="14" />
              <span>Открыть</span>
            </a>
            <span v-else class="table-empty">—</span>
          </td>
          <td class="row-actions">
            <button
              type="button"
              class="admin-btn admin-btn-ghost icon-button"
              @click="emit('edit', project)"
            >
              <Icon name="heroicons:pencil-square" size="16" />
              <span>Изменить</span>
            </button>
            <button
              type="button"
              class="admin-btn danger icon-button"
              @click="emit('delete', project.id)"
            >
              <Icon name="heroicons:trash" size="16" />
              <span>Удалить</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrap {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-bg-elevated);
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

.table-empty {
  color: var(--color-text-muted);
}

.danger {
  border-color: var(--color-danger);
  background: var(--color-danger);
}

.danger:hover {
  border-color: var(--color-danger-hover);
  background: var(--color-danger-hover);
}
</style>
