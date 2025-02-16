FROM node:18-alpine3.18

# Installing libvips-dev for sharp Compatibility
USER root
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

USER node
RUN git config --global --add safe.directory /opt

WORKDIR /opt

EXPOSE 80

CMD ["sh"]
