// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    devServer: {
        port: process.env.NUXT_DEV_SERVER_PORT || 3000,
    },
    runtimeConfig: {
        public: {},
    },
})
