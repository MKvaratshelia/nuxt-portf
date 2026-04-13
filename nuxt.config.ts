// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    routeRules: {
        "/about": { prerender: true, ssr: false },
    },
    app: {
        head: {
            script: [
                {
                    id: "theme-init",
                    innerHTML:
                        "(function(){try{var key='portfolio-theme=';var cookie=document.cookie.split('; ').find(function(entry){return entry.indexOf(key)===0;});var saved=cookie?cookie.slice(key.length):'';var theme=saved==='light'||saved==='dark'?saved:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',theme);}catch(_){document.documentElement.setAttribute('data-theme','light');}})();",
                },
            ],
        },
    },
    css: ["normalize.css", "~/assets/css/global.css", "~/assets/css/forms.css"],
    runtimeConfig: {
        adminLogin: process.env.ADMIN_LOGIN,
        adminPassword: process.env.ADMIN_PASSWORD,
        adminSessionSecret: process.env.ADMIN_SESSION_SECRET,
        blobReadWriteToken: process.env.BLOB_READ_WRITE_TOKEN,
    },
    modules: ["@nuxt/eslint", "@nuxt/fonts", "@nuxt/icon", "@nuxt/image", "@pinia/nuxt"],
});
