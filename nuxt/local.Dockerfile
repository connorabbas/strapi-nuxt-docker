FROM node:20-alpine

USER root
RUN apk add --no-cache git openssh

# Create directory and set permissions
RUN mkdir -p /web/node_modules && \
    chown -R node:node /web && \
    chmod 775 /web/node_modules

USER node
RUN git config --global --add safe.directory /web

WORKDIR /web

EXPOSE 80

CMD ["sh"]