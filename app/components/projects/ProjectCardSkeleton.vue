<template>
  <article class="card" aria-hidden="true">
    <div class="image skeleton" />
    <div class="content">
      <div class="title skeleton" />
      <div class="description skeleton" />
      <div class="description short skeleton" />
      <div class="link skeleton" />
    </div>
  </article>
</template>

<style scoped>
.card {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
}

.image {
  height: 180px;
}

.content {
  padding: 14px;
}

.title {
  height: 20px;
  margin-bottom: 12px;
  border-radius: 8px;
}

.description {
  height: 12px;
  margin-bottom: 8px;
  border-radius: 6px;
}

.description.short {
  width: 72%;
  margin-bottom: 14px;
}

.link {
  height: 14px;
  width: 88px;
  border-radius: 8px;
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-skeleton-base) 0%,
    var(--color-skeleton-shine) 50%,
    var(--color-skeleton-base) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
