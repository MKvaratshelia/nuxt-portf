<script setup lang="ts">
import type { Project } from "~~/types/project";

const props = defineProps<{ project: Project }>();

const openProject = () => {
    if (!import.meta.client) {
        return;
    }

    window.open(props.project.url, "_blank", "noopener,noreferrer");
};
</script>

<template>
    <article
        class="card"
        @click="openProject"
    >
        <div class="image-wrap">
            <img
                class="image"
                :src="project.image"
                :alt="project.title"
                loading="lazy"
            />
        </div>
        <div class="content">
            <h3 class="title">{{ project.title }}</h3>
            <p class="description">{{ project.description }}</p>
            <a
                class="github"
                :href="project.githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                @click.stop
            >
                <Icon
                    name="simple-icons:github"
                    size="16"
                />
                <span>GitHub</span>
            </a>
        </div>
    </article>
</template>

<style scoped>
.card {
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
}

.card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 24px var(--color-shadow);
}

.image-wrap {
    height: 180px;
    overflow: hidden;
    background: var(--color-bg-muted);
}

.image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    transition: object-position 2.2s ease;
}

.card:hover .image {
    object-position: center bottom;
}

.content {
    padding: 14px;
}

.title {
    margin: 0 0 8px;
    font-size: 18px;
}

.description {
    margin: 0 0 12px;
    color: var(--color-text-muted);
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.github {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--color-link);
    text-decoration: none;
    font-weight: 600;
}
</style>
