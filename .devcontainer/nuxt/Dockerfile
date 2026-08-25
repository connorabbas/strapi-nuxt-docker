FROM node:22-bookworm-slim

USER root
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    git \
    openssh-client \
    && rm -rf /var/lib/apt/lists/*
RUN npm install --global npm@11.6.2
RUN mkdir -p \
    /home/node/.config \
    /home/node/.local/share \
    /home/node/.local/state \
    && chown -R node:node /home/node/.config /home/node/.local

USER node
ENV PATH=/home/node/.opencode/bin:$PATH
RUN curl -fsSL https://opencode.ai/install | bash
RUN git config --global --add safe.directory /workspace

WORKDIR /workspace/nuxt

CMD ["sleep", "infinity"]
