import type { API } from '@strapi/client'

/** Common fields required by this application's Strapi Content API contracts. */
export interface StrapiDocument extends API.Document {
  id: number | string
  publishedAt: string | null
}

/**
 * Users & Permissions uses a bare array for GET /api/users rather than the
 * standard collection response envelope.
 */
export interface StrapiUser extends StrapiDocument {
  username: string
  email: string
  provider: string
  confirmed: boolean
  blocked: boolean
  [key: string]: unknown
}
