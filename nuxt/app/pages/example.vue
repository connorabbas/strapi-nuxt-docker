<script setup lang="ts">
const { data: users, error, refresh, status } = await useFetch('/api/example/users', {
    key: 'example-users',
    default: () => []
})

function refreshUsers() {
    return refresh()
}
</script>

<template>
    <UContainer class="py-12 sm:py-16">
        <UPageHeader
            headline="Strapi"
            title="Users example"
            description="This page is server-rendered from the local API route, so the browser never requests Strapi directly."
        >
            <template #links>
                <UButton
                    label="Refresh users"
                    color="neutral"
                    variant="outline"
                    :loading="status === 'pending'"
                    @click="refreshUsers"
                />
            </template>
        </UPageHeader>

        <div class="mt-8 space-y-6">
            <UAlert
                color="warning"
                variant="subtle"
                title="Demonstration only"
                icon="i-lucide-alert-triangle"
                description="This intentionally renders every field returned by Strapi. Do not expose a user directory or raw user records in a production application."
            />

            <UCard
                title="Response"
                description="Data returned from /api/example/users"
            >
                <div
                    v-if="status === 'pending'"
                    class="space-y-3"
                >
                    <USkeleton class="h-4 w-1/3" />
                    <USkeleton class="h-4 w-full" />
                    <USkeleton class="h-4 w-5/6" />
                    <USkeleton class="h-4 w-2/3" />
                </div>

                <UAlert
                    v-else-if="error"
                    color="error"
                    variant="subtle"
                    title="Unable to load users"
                    description="Check that Strapi is running and the configured API token has access to this endpoint."
                />

                <UAlert
                    v-else-if="users.length === 0"
                    color="neutral"
                    variant="subtle"
                    title="No users found"
                    description="Strapi returned an empty collection."
                />

                <pre
                    v-else
                    class="max-h-120 overflow-auto rounded-lg bg-elevated p-4 text-sm text-highlighted"
                >{{ JSON.stringify(users, null, 2) }}</pre>
            </UCard>
        </div>
    </UContainer>
</template>
