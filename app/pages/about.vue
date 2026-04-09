<script setup lang="ts">
useSeoMeta({
    title: "Обо мне | Портфолио",
    description: "Информация об авторе: опыт, обучение и технологии.",
});
</script>

<template>
    <section class="about">
        <div class="about__wrapper">
            <NuxtImg
                class="about__photo"
                src="/photo.jpeg"
                alt="Фото автора"
                width="160"
                height="160"
                loading="lazy"
            />
            <div class="about__content">
                <h1 class="about__title">Об авторе</h1>
                <p>
                    Здравствуйте! Меня зовут Кварацхелия Михаил. Я frontend-разработчик из Санкт-Петербурга. Окончил
                    курс «frontend разработчик» на платформе Яндекс.Практикум. Изучил HTML, CSS, JavaScript, Webpack, а
                    так же работу с GitHub. После обучения попал на стажировку в веб студию, в составе команды
                    разрабатывали библиотеку компонентов на React.
                </p>
                <p>
                    В 2020г устроился в компанию Онтех на должность frontend разработчик и проработал в компании 2 года.
                    Во время работы над проектом приобрел опыт как самостоятельной так и командной работы, решение задач
                    разного уровня от верстки по макетам из figma до написания сложной логики компонентов и создания
                    видео-кабинета. Последнее время повышал квалификацию проходя курс и изучая новые для меня технологии
                    (typescript, rtq query, redux toolkit, storybook, jest, CI/CD, docker, Vue3, Nuxt, Pinia).
                </p>
            </div>
        </div>
    </section>
</template>

<style scoped>
.about__wrapper {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 30px;
}

.about__photo {
    display: block;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid rgba(255, 255, 255, 0.12);
}

.about__intro {
    min-width: 0;
}

h1 {
    margin: 0 0 16px;
}

p {
    margin: 0 0 14px;
    line-height: 1.6;
    overflow-wrap: anywhere;
}

@media (max-width: 640px) {
    .about__wrapper {
        flex-direction: column;
        gap: 20px;
    }

    .about__photo {
        width: 100%;
        height: auto;
        aspect-ratio: 1 / 1;
    }

    h1 {
        margin: 0 0 12px;
    }
}
</style>
