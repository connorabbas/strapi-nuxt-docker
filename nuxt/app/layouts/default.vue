<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
    {
        label: 'Home',
        to: '/',
        active: route.path === '/'
    },
    {
        label: 'Users example',
        to: '/example',
        active: route.path === '/example'
    }
])
</script>

<template>
    <div>
        <UHeader title="Nuxt + Strapi BFF">
            <UNavigationMenu :items="items" />

            <template #right>
                <UColorModeButton />
            </template>

            <template #body>
                <UNavigationMenu
                    :items="items"
                    orientation="vertical"
                    class="-mx-2.5"
                />
            </template>
        </UHeader>

        <UMain class="flex">
            <slot />
        </UMain>
    </div>
</template>
