# Nuxt + Strapi w/ Docker

This repository is developed through VS Code Dev Containers. Before rebuilding,
start the [Traefik Docker Compose starter](https://github.com/connorabbas/traefik-docker-compose),
which provides the required `traefik_proxy` network.

Copy the root, `nuxt`, and `strapi` `.env.example` files to their respective
`.env` files, then open the repository root in VS Code and run **Dev Containers:
Rebuild and Reopen in Container**. Choose either the Nuxt or Strapi configuration.

Each configuration opens only its application directory while retaining the
root Git repository and shared OpenCode configuration.
