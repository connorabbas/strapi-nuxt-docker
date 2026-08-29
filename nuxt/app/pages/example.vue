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
    <main>
        <h1>Strapi Users Example</h1>
        <p>
            This page is server-rendered from Nuxt's <code>/api/example/users</code> route. The browser
            does not make a request to Strapi.
        </p>

        <p>
            <strong>Demonstration only:</strong> this intentionally renders every field returned by
            Strapi. Do not expose a user directory or raw user records in a production application.
        </p>

        <button
            type="button"
            :disabled="status === 'pending'"
            @click="refreshUsers"
        >
            Refresh users
        </button>

        <p v-if="status === 'pending'">Loading users...</p>
        <p v-else-if="error">Unable to load users.</p>
        <p v-else-if="users.length === 0">No users found.</p>
        <pre v-else>{{ JSON.stringify(users, null, 2) }}</pre>
    </main>
</template>

<style scoped>
main {
    max-width: 72rem;
    margin: 4rem auto;
    padding: 0 1.5rem;
}

pre {
    overflow: auto;
    padding: 1rem;
    background: #18181b;
    color: #f4f4f5;
}
</style>
