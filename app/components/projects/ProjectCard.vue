<script setup lang="ts">
import type { Project } from "~~/types/project";

const isImageLoaded = ref<boolean>(false);
const props = defineProps<{ project: Project }>();

const hasProjectUrl = computed(() => Boolean(props.project.url?.trim()));

const openProject = () => {
    const projectUrl = props.project.url?.trim();
    if (!projectUrl) {
        return;
    }

    if (!import.meta.client) {
        return;
    }

    window.open(projectUrl, "_blank", "noopener,noreferrer");
};

watch(
    () => props.project.image,
    () => {
        isImageLoaded.value = false;
    },
    { immediate: true },
);
</script>

<template>
    <article
        class="card"
        :class="{ 'is-clickable': hasProjectUrl }"
        :aria-disabled="!hasProjectUrl"
        @click="openProject"
    >
        <div class="image-wrap">
            <div
                v-if="!isImageLoaded"
                class="image-skeleton"
                aria-hidden="true"
            />
            <NuxtImg
                width="100%"
                height="100%"
                class="image"
                :class="{ 'is-loaded': isImageLoaded }"
                :src="project.image"
                :alt="project.title"
                loading="lazy"
                @load="isImageLoaded = true"
                @error="isImageLoaded = true"
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
    display: flex;
    flex-direction: column;
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    overflow: hidden;
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
}

.card.is-clickable {
    cursor: pointer;
}

.card.is-clickable:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 24px var(--color-shadow);
}

.image-wrap {
    position: relative;
    height: 240px;
    width: 100%;
    overflow: hidden;
    background: var(--color-bg-muted);
}
.image-skeleton {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        90deg,
        var(--color-bg-muted) 25%,
        var(--color-bg-elevated) 50%,
        var(--color-bg-muted) 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.2s infinite linear;
}
.image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition:
        opacity 0.2s ease,
        object-position 5s ease;
}
.image.is-loaded {
    opacity: 1;
}

.image:hover {
    object-position: 0 100%;
}

.card.is-clickable:hover .image {
    /* object-position: center bottom; */
    /* object-position: 0 100%; */
    cursor: pointer;
}

.content {
    display: flex;
    flex-direction: column;
    flex: 1;
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
    line-clamp: 4;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.github {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: auto;
    color: var(--color-link);
    text-decoration: none;
    font-weight: 600;
}

@keyframes skeleton-loading {
    from {
        background-position: 200% 0;
    }
    to {
        background-position: -200% 0;
    }
}
</style>
