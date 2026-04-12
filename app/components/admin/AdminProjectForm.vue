<script setup lang="ts">
import type { Project, ProjectPayload } from "~~/types/project";
import { getRequestErrorMessage } from "~/utils/request-errors";
import { useProjectsStore } from "~/store/projects.store";

const props = defineProps<{
    editingId: number | null;
    editingProject: Project | null;
}>();

const emit = defineEmits<{
    saved: [];
    cancel: [];
}>();

const store = useProjectsStore();

const emptyForm: ProjectPayload = {
    title: "",
    image: "",
    description: "",
    githubUrl: "",
    url: "",
};

const form = reactive<ProjectPayload>({ ...emptyForm });
const saving = ref(false);
const error = ref("");

watch(
    () => props.editingProject,
    (project) => {
        if (project) {
            form.title = project.title;
            form.image = project.image;
            form.description = project.description;
            form.githubUrl = project.githubUrl;
            form.url = project.url ?? "";
        } else {
            Object.assign(form, emptyForm);
        }
    },
);

const saveProject = async () => {
    error.value = "";
    saving.value = true;
    try {
        await store.saveProject(form, props.editingId);
        Object.assign(form, emptyForm);
        emit("saved");
    } catch (err) {
        error.value = getRequestErrorMessage(err, "Не удалось сохранить проект. Проверьте заполнение формы.");
    } finally {
        saving.value = false;
    }
};
</script>

<template>
    <form
        class="admin-form form-panel"
        @submit.prevent="saveProject"
    >
        <h2>{{ editingId ? "Редактирование проекта" : "Добавление проекта" }}</h2>
        <label class="admin-form-label">
            Название
            <input
                v-model="form.title"
                class="admin-form-control"
                type="text"
                required
            />
        </label>
        <label class="admin-form-label">
            Ссылка на картинку
            <input
                v-model="form.image"
                class="admin-form-control"
                type="url"
                required
            />
        </label>
        <label class="admin-form-label">
            Описание
            <textarea
                v-model="form.description"
                class="admin-form-control"
                required
                rows="4"
            />
        </label>
        <label class="admin-form-label">
            GitHub URL
            <input
                v-model="form.githubUrl"
                class="admin-form-control"
                type="url"
                required
            />
        </label>
        <label class="admin-form-label">
            URL проекта
            <input
                v-model="form.url"
                class="admin-form-control"
                type="url"
            />
        </label>
        <p
            v-if="error"
            class="admin-error"
        >
            {{ error }}
        </p>
        <div class="actions">
            <button
                type="submit"
                class="admin-btn"
                :disabled="saving"
            >
                {{ saving ? "Сохраняем..." : editingId ? "Обновить" : "Добавить" }}
            </button>
            <button
                v-if="editingId"
                type="button"
                class="admin-btn admin-btn-ghost"
                @click="emit('cancel')"
            >
                Отмена
            </button>
        </div>
    </form>
</template>

<style scoped>
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

@media (max-width: 640px) {
    .actions .admin-btn {
        width: 100%;
    }
}
</style>
