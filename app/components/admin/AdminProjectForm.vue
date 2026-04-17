<script setup lang="ts">
import type { Project, ProjectPayload } from "~~/types/project";
import { getRequestErrorMessage } from "~/utils/request-errors";
import { useProjectsStore } from "~/store/projects.store";

type UploadProjectImageResponse = {
    image: string;
};

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
const uploadingImage = ref(false);
const error = ref("");
const uploadError = ref("");
const imageInput = ref<HTMLInputElement | null>(null);

const resetImageInput = () => {
    if (imageInput.value) {
        imageInput.value.value = "";
    }
};

watch(
    () => props.editingProject,
    (project) => {
        uploadError.value = "";
        resetImageInput();

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

const uploadImage = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
        return;
    }

    uploadError.value = "";
    uploadingImage.value = true;

    try {
        const formData = new FormData();
        formData.append("image", file);

        const uploadedImage = await $fetch<UploadProjectImageResponse>("/api/admin/uploads/project-image", {
            method: "POST",
            body: formData,
        });

        form.image = uploadedImage.image;
    } catch (err) {
        uploadError.value = getRequestErrorMessage(err, "Не удалось загрузить изображение. Попробуйте еще раз.");
        input.value = "";
    } finally {
        uploadingImage.value = false;
    }
};

const saveProject = async () => {
    if (uploadingImage.value) {
        return;
    }

    error.value = "";
    saving.value = true;
    try {
        await store.saveProject(form, props.editingId);
        Object.assign(form, emptyForm);
        uploadError.value = "";
        resetImageInput();
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
                name="title"
                class="admin-form-control"
                type="text"
                required
            />
        </label>
        <label class="admin-form-label">
            Изображение проекта
            <input
                ref="imageInput"
                name="image"
                class="admin-form-control"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                :required="!form.image"
                @change="uploadImage"
            />
        </label>
        <p class="admin-form-hint">Поддерживаются JPG, PNG и WEBP до 4 МБ.</p>
        <p
            v-if="uploadingImage"
            class="admin-form-hint"
        >
            Загружаем изображение...
        </p>
        <p
            v-if="uploadError"
            class="admin-error"
        >
            {{ uploadError }}
        </p>
        <div
            v-if="form.image"
            class="image-preview"
        >
            <img
                :src="form.image"
                :alt="form.title || 'Превью проекта'"
            />
        </div>
        <label class="admin-form-label">
            Описание
            <textarea
                v-model="form.description"
                name="description"
                class="admin-form-control"
                required
                rows="4"
            />
        </label>
        <label class="admin-form-label">
            GitHub URL
            <input
                v-model="form.githubUrl"
                name="githubUrl"
                class="admin-form-control"
                type="url"
                required
            />
        </label>
        <label class="admin-form-label">
            URL проекта
            <input
                v-model="form.url"
                name="url"
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
                :disabled="saving || uploadingImage || !form.image"
            >
                {{
                    uploadingImage
                        ? "Загружаем изображение..."
                        : saving
                          ? "Сохраняем..."
                          : editingId
                            ? "Обновить"
                            : "Добавить"
                }}
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

.admin-form-hint {
    margin: -6px 0 4px;
    color: var(--color-text-muted);
    font-size: 14px;
}

.admin-form-control[type="file"] {
    max-width: 100%;
    min-width: 0;
}

.image-preview {
    max-width: 320px;
    border: 1px solid var(--color-border);
    border-radius: 12px;
    overflow: hidden;
    background: var(--color-bg-muted);
}

.image-preview img {
    display: block;
    width: 100%;
    height: 180px;
    object-fit: cover;
}

@media (max-width: 640px) {
    .actions .admin-btn {
        width: 100%;
    }
}
</style>
