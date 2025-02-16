# modified slightly from: https://docs.strapi.io/dev-docs/installation/docker

FROM node:18-alpine3.18

RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt
COPY --chown=node:node package.json package-lock.json ./
RUN npm install -g node-gyp
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm install
ENV PATH=/opt/node_modules/.bin:$PATH

COPY --chown=node:node . .
USER node
RUN ["npm", "run", "build"]
EXPOSE 80
CMD ["npm", "run", "develop"]
