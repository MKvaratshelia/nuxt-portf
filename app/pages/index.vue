<script setup lang="ts">
import ProjectCard from "~/components/projects/ProjectCard.vue";
import ProjectCardSkeleton from "~/components/projects/ProjectCardSkeleton.vue";
import { useProjectsStore } from "~/store/projects.store";

useSeoMeta({
    title: "Главная | Портфолио",
    description: "Портфолио с моими проектами: описание, ссылки на GitHub и рабочие версии.",
});

const store = useProjectsStore();

await store.fetchProjects();

const skeletonCount = 6;
const handleRefresh = () => {
    void store.fetchProjects();
};
</script>

<template>
    <section>
        <h1>Мои проекты</h1>
        <p class="subtitle">
            Если у проекта есть URL, клик по карточке откроет его. Ссылка GitHub доступна внутри карточки.
        </p>

        <div
            v-if="store.pending"
            class="grid"
        >
            <ProjectCardSkeleton
                v-for="index in skeletonCount"
                :key="`skeleton-${index}`"
            />
        </div>
        <p v-else-if="store.error">{{ store.error }}</p>
        <p v-else-if="!store.projects.length">Пока проектов нет.</p>

        <div
            v-else
            class="grid"
        >
            <ProjectCard
                v-for="project in store.projects"
                :key="project.id"
                :project="project"
            />
        </div>

        <button
            class="reload"
            type="button"
            @click="handleRefresh"
        >
            Обновить
        </button>
    </section>
</template>

<style scoped>
h1 {
    margin: 0;
}

.subtitle {
    color: var(--color-text-muted);
    margin: 8px 0 20px;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
    gap: 16px;
}

.reload {
    margin-top: 16px;
    border: 1px solid var(--color-border);
    background: var(--color-bg-elevated);
    color: var(--color-text);
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
}

.reload:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
}

@media (max-width: 640px) {
    .subtitle {
        margin-bottom: 16px;
    }

    .grid {
        gap: 12px;
    }
}
</style>
