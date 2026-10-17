# syntax=docker/dockerfile:1

ARG NODE_VERSION=24
ARG NODE_BUILD_IMAGE=node:${NODE_VERSION}-alpine
ARG NODE_RUNTIME_IMAGE=node:${NODE_VERSION}-alpine
ARG RUNTIME_USER=node

FROM ${NODE_BUILD_IMAGE} AS dependencies
WORKDIR /opt

RUN apk add --no-cache \
    autoconf \
    automake \
    bash \
    build-base \
    gcc \
    git \
    libpng-dev \
    python3 \
    vips-dev \
    zlib-dev

ENV NPM_CONFIG_FETCH_RETRIES=5 \
    NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=600000

COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS build
WORKDIR /opt/app

ENV PATH=/opt/node_modules/.bin:$PATH

COPY . ./
ENV NODE_ENV=production
RUN npm run build

FROM ${NODE_BUILD_IMAGE} AS production-dependencies
WORKDIR /opt

ENV NODE_ENV=production \
    NPM_CONFIG_FETCH_RETRIES=5 \
    NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=600000

RUN apk add --no-cache vips-dev
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM ${NODE_RUNTIME_IMAGE} AS release
ARG RUNTIME_USER
WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=1337 \
    PATH=/app/node_modules/.bin:$PATH

RUN apk add --no-cache vips-dev

COPY --from=production-dependencies --chown=${RUNTIME_USER}:${RUNTIME_USER} /opt/node_modules ./node_modules
COPY --from=build --chown=${RUNTIME_USER}:${RUNTIME_USER} /opt/app ./

USER ${RUNTIME_USER}
EXPOSE 1337

CMD ["node", "/app/node_modules/@strapi/strapi/bin/strapi.js", "start"]
