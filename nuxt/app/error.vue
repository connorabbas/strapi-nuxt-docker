<script setup lang="ts">
import type { NuxtError } from '#app'

const errorMessages: Record<number, string> = {
    400: 'Sorry, your request could not be completed.',
    401: 'Please sign in to continue.',
    403: 'Sorry, you are unauthorized to access this resource/action.',
    404: 'Sorry, the resource you are looking for could not be found.',
    408: 'The request timed out. Please try again.',
    419: 'The page expired, please try again.',
    422: 'The submitted data was invalid. Please check and try again.',
    429: 'You have made too many requests. Please wait and try again.',
    500: 'Whoops, something went wrong on our end. Please try again.',
    502: 'The server received an invalid response. Please try again.',
    503: 'Sorry, we are doing some maintenance. Please check back soon.',
    504: 'The server timed out. Please try again.'
}

function getErrorMessage(statusCode: number): string {
    const statusMessage = errorMessages[statusCode]

    if (statusMessage) {
        return statusMessage
    }

    if (statusCode >= 500) {
        return 'Whoops, something went wrong on our end. Please try again.'
    }

    if (statusCode >= 400) {
        return 'Sorry, your request could not be completed.'
    }

    return 'An unexpected error occurred.'
}

const props = defineProps<{
    error: NuxtError
}>()

const statusCode = computed(() => props.error.status ?? props.error.statusCode ?? 500)
const errorMessage = computed(() => getErrorMessage(statusCode.value))

const statusMessage = computed(() => props.error.statusText?.trim() ?? '')
const explicitMessage = computed(() => props.error.message?.trim() ?? '')

const message = computed(() => {
    if (explicitMessage.value && explicitMessage.value !== statusMessage.value) {
        return explicitMessage.value
    }

    return errorMessage.value
})

const displayError = computed(() => ({
    ...props.error,
    statusCode: statusCode.value,
    statusMessage: props.error.statusText,
    message: message.value
}))

useHead({
    title: `${statusCode.value} - Nuxt + Strapi`
})
</script>

<template>
    <UApp>
        <UError :error="displayError" />
    </UApp>
</template>
