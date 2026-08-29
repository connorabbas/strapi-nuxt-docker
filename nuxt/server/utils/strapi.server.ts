import { strapi } from '@strapi/client'
import type { H3Event } from 'h3'

export function useStrapiClient(event: H3Event) {
  const config = useRuntimeConfig(event)
  const apiToken = config.strapiApiToken.trim()

  if (!apiToken) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Strapi API token is not configured'
    })
  }

  return strapi({
    baseURL: `${config.strapiUrl.replace(/\/$/, '')}/api`,
    auth: apiToken
  })
}
