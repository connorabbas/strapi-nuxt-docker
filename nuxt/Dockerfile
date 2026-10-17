# syntax=docker/dockerfile:1

ARG NODE_VERSION=24
ARG NODE_BUILD_IMAGE=node:${NODE_VERSION}-bookworm-slim
ARG NODE_RUNTIME_IMAGE=dhi.io/node:${NODE_VERSION}-alpine
ARG RUNTIME_USER=nonroot

FROM ${NODE_BUILD_IMAGE} AS dependencies
WORKDIR /app

ENV NPM_CONFIG_FETCH_RETRIES=5

COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS build
WORKDIR /app

COPY . ./
RUN npm run build

FROM ${NODE_RUNTIME_IMAGE} AS release
ARG RUNTIME_USER
WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

COPY --from=build --chown=${RUNTIME_USER}:${RUNTIME_USER} /app/.output ./

USER ${RUNTIME_USER}
EXPOSE 3000

CMD ["/app/server/index.mjs"]
