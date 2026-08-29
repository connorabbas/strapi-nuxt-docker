import { useStrapiClient } from '../../utils/strapi.server'

export default defineEventHandler(async (event) => {
    const client = useStrapiClient(event)

    try {
        const response = await client.fetch('../_health')

        if (!response.ok) {
            throw createError({
                statusCode: 502,
                statusMessage: 'Strapi is unavailable'
            })
        }
    } catch {
        throw createError({
            statusCode: 502,
            statusMessage: 'Strapi is unavailable'
        })
    }

    return { status: 'ok' }
})
