FROM node:24-bookworm-slim

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

USER root
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    git \
    openssh-client \
    && rm -rf /var/lib/apt/lists/*
RUN npm install --global npm@11
RUN npm config set fetch-retries 5 -g
RUN mkdir -p \
    /home/node/.config \
    /home/node/.local/share \
    /home/node/.local/state \
    && chown -R node:node /home/node/.config /home/node/.local

USER node
ENV PATH=/home/node/.opencode/bin:$PATH
RUN curl -fsSL https://opencode.ai/install | bash
RUN git config --global --add safe.directory /workspace

WORKDIR /workspace/strapi

CMD ["sleep", "infinity"]
