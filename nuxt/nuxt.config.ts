// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxt/eslint',
        '@nuxt/ui'
    ],
    devtools: { enabled: true },
    css: ['~/assets/css/main.css'],
    runtimeConfig: {
        strapiUrl: 'http://strapi:1337',
        strapiApiToken: ''
    },
    compatibilityDate: '2025-07-15',
    eslint: {
        config: {
            stylistic: {
                commaDangle: 'never',
                braceStyle: '1tbs'
            }
        }
    }
})
