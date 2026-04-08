<script setup lang="ts">
useSeoMeta({
  title: 'Обо мне | Портфолио',
  description: 'Информация обо мне как frontend/backend разработчике и о развитии этого портфолио-проекта.'
})
</script>

<template>
  <section class="about">
    <h1>Обо мне</h1>
    <p>
      Я frontend/backend разработчик. На этом сайте собраны мои проекты с кратким описанием,
      ссылкой на репозиторий и ссылкой на рабочую версию.
    </p>
    <p>
      Сейчас это MVP, дальше можно добавить фильтры, теги, аналитику просмотров и более гибкую
      админ-панель.
    </p>
  </section>
</template>

<style scoped>
.about {
  max-width: 760px;
}

h1 {
  margin: 0 0 16px;
}

p {
  margin: 0 0 14px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}
</style>
