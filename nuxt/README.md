# Nuxt Frontend

Nuxt is the browser-facing BFF for Strapi. Browser code must call Nuxt `/api` routes only; server routes use the private Docker hostname `strapi` to reach the Strapi Content API.

## Setup

1. Start Strapi, then create a read-only Content API token at `http://admin.strapi-nuxt.localhost/admin`.
2. Copy `.env.example` to `.env` and set `NUXT_STRAPI_API_TOKEN`. Keep `NUXT_STRAPI_URL=http://strapi:1337` for Docker.
3. Start Nuxt and request `GET /api/health/strapi` to verify the connection.

`/example` demonstrates an SSR call to the local `GET /api/example/users` route.

Browser code must call Nuxt `/api` routes only. Keep Strapi tokens private, and map BFF responses to only the fields the page needs.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
