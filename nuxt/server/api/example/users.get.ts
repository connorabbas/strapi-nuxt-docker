import { useStrapiClient } from '../../utils/strapi.server'
import type { StrapiUser } from '#shared/types/strapi'

export default defineEventHandler(async (event): Promise<StrapiUser[]> => {
    const client = useStrapiClient(event)

    try {
        const users = await client.collection('users').find()

        // The SDK's generic collection type describes { data, meta }, but Strapi's
        // Users & Permissions endpoint returns a bare array.
        return users as unknown as StrapiUser[]
    } catch {
        throw createError({
            statusCode: 502,
            statusMessage: 'Unable to fetch users from Strapi'
        })
    }
})
