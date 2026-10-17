# Nuxt + Strapi w/ Docker

This repository is developed through VS Code Dev Containers. Before rebuilding,
start the [Traefik Docker Compose starter](https://github.com/connorabbas/traefik-docker-compose),
which provides the required `traefik_proxy` network.

Copy the root, `nuxt`, and `strapi` `.env.example` files to their respective
`.env` files, then open the repository root in VS Code and run **Dev Containers:
Rebuild and Reopen in Container**. Choose either the Nuxt or Strapi configuration.

Each configuration opens only its application directory while retaining the
root Git repository and shared OpenCode configuration. Opening the Nuxt
configuration also starts Strapi and its Postgres database; start Nuxt itself
with `npm run dev` from the Nuxt terminal.

## Production Deployment

This project deploys to a single VPS with Docker Swarm, Traefik, GHCR images, and GitHub Actions.

References:

- [Docker Engine](https://docs.docker.com/engine/install/)
- [Docker Swarm](https://docs.docker.com/engine/swarm/)
- [Docker Swarm secrets](https://docs.docker.com/engine/swarm/secrets/)
- [Traefik Docker Compose starter](https://github.com/connorabbas/traefik-docker-compose)
- [GitHub Actions secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [GitHub deployment environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [Infisical](https://infisical.com/docs)
- [Server Side Up Docker build action](https://github.com/serversideup/github-action-docker-build)
- [Server Side Up Docker Swarm deploy action](https://github.com/serversideup/github-action-docker-swarm-deploy)
- [Docker Hardened Images](https://docs.docker.com/dhi/)
- [Strapi API tokens](https://docs.strapi.io/cms/features/api-tokens)

### 1. Prepare DNS

Point both domains at the VPS:

```text
example.com        A  <vps-public-ip>
strapi.example.com A  <vps-public-ip>
```

### 2. Prepare The VPS

Install Docker and initialize Swarm:

```bash
docker swarm init
```

Deploy the Swarm variant of the [Traefik Docker Compose starter](https://github.com/connorabbas/traefik-docker-compose). This app expects an external overlay network named `traefik_proxy` and Traefik's Swarm provider.

Label the node that will hold PostgreSQL data and Strapi uploads:

```bash
docker node ls
docker node update --label-add app-data=true <node-name>
```

Create a deploy user:

```bash
sudo adduser --disabled-password --gecos "" deploy
sudo usermod -aG docker deploy
sudo install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
sudo touch /home/deploy/.ssh/authorized_keys
sudo chown deploy:deploy /home/deploy/.ssh/authorized_keys
sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

### 3. Create The Deploy Key

Generate a dedicated key locally:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_swarm_deploy -C "deploy"
```

Add the public key to `/home/deploy/.ssh/authorized_keys` on the VPS:

```bash
cat ~/.ssh/id_ed25519_swarm_deploy.pub
```

Verify access:

```bash
ssh -i ~/.ssh/id_ed25519_swarm_deploy deploy@<server-ip> "docker info --format '{{.Swarm.LocalNodeState}}'"
```

Expected output is `active`.

### 4. Add GitHub Actions Secrets

Add these repository secrets:

```text
SWARM_STACK_NAME
SSH_DEPLOY_PRIVATE_KEY
SSH_DEPLOY_USER
SSH_REMOTE_HOSTNAME
SSH_REMOTE_PORT
SSH_REMOTE_KNOWN_HOSTS
PRODUCTION_ENV_FILE_BASE64
GHCR_DEPLOY_USERNAME
GHCR_DEPLOY_TOKEN
DHI_REGISTRY_USERNAME
DHI_REGISTRY_TOKEN
```

Suggested values:

- `SWARM_STACK_NAME`: `nuxt-strapi`
- `SSH_DEPLOY_PRIVATE_KEY`: contents of `~/.ssh/id_ed25519_swarm_deploy`
- `SSH_DEPLOY_USER`: `deploy`
- `SSH_REMOTE_HOSTNAME`: VPS IP address or hostname
- `SSH_REMOTE_PORT`: `22`
- `GHCR_DEPLOY_USERNAME`: GitHub username or machine user with read access to the published GHCR packages
- `GHCR_DEPLOY_TOKEN`: durable read-only package token used by Swarm when pulling images later
- `DHI_REGISTRY_USERNAME`: Docker Hardened Images registry username
- `DHI_REGISTRY_TOKEN`: Docker Hardened Images registry token/password

Generate `SSH_REMOTE_KNOWN_HOSTS` locally:

```bash
ssh-keyscan -p 22 -H <server-hostname-or-ip> 2>/dev/null | sort -u
```

Create a GitHub deployment environment named `production` and require approval if you want manual release control. For isolated first-run validation, create a second environment such as `production-smoke` with its own `PRODUCTION_ENV_FILE_BASE64` and temporary domains.

### 5. Create Production Env Values

Ideally use Infisical or another secrets management platform as the source of truth. Copy those values into a local untracked file:

```bash
cp .env.production.example .env.production
```

Fill in:

- `DEPLOY_APP_DOMAIN`
- `DEPLOY_STRAPI_DOMAIN`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `NUXT_STRAPI_API_TOKEN`
- `STRAPI_APP_KEYS`
- `STRAPI_API_TOKEN_SALT`
- `STRAPI_ADMIN_JWT_SECRET`
- `STRAPI_JWT_SECRET`
- `STRAPI_TRANSFER_TOKEN_SALT`
- `STRAPI_ENCRYPTION_KEY`

Do not add these to `.env.production`:

```text
NUXT_IMAGE
STRAPI_IMAGE
IMAGE_TAG
SWARM_STACK_NAME
```

Encode the file and save the output as `PRODUCTION_ENV_FILE_BASE64` in GitHub Actions:

```bash
# macOS
base64 < .env.production | pbcopy

# Linux
base64 -w 0 .env.production
```

### 6. Deploy

Merge to `main`. The CI workflow runs Nuxt lint, Nuxt typecheck, Nuxt build, and Strapi build. After those jobs pass, it calls the CD workflow, which builds Nuxt and Strapi images, pushes them to GHCR, and deploys `docker-compose-swarm.yml` over SSH.

For the first production validation, run the `cd` workflow manually with a temporary stack name and a GitHub environment that points at temporary domains.

No app repository files or root-level `.env` file need to exist on the server. The deploy action decodes `PRODUCTION_ENV_FILE_BASE64` on the GitHub Actions runner and passes the resolved environment to `docker stack deploy` over SSH. Base64 is encoding, not encryption; the secret protection comes from GitHub Actions secrets. Do not enable `ACTIONS_STEP_DEBUG` for production deploys because the deploy action can print the decoded `.env` while debugging.

### 7. Finish Strapi Setup

Open Strapi and create the first admin user:

```text
https://strapi.example.com/admin
```

Create a least-privilege Strapi API token for Nuxt. Put it in `NUXT_STRAPI_API_TOKEN`, re-encode `.env.production`, update `PRODUCTION_ENV_FILE_BASE64`, and rerun CD.

### 8. Operate The Stack

```bash
docker stack services <stack>
docker service ps <stack>_nuxt --no-trunc
docker service ps <stack>_strapi --no-trunc
docker service ps <stack>_postgres --no-trunc
docker service logs -f <stack>_nuxt
docker service logs -f <stack>_strapi
```

PostgreSQL and Strapi uploads are stored in local Docker volumes on the node labeled `app-data=true`. Recovery currently relies on VPS snapshot backups that include Docker volumes. Take a snapshot before schema-changing Strapi deployments. Centralized application logging is planned through Loki and Grafana. Docker Swarm secrets are a future hardening improvement if the deployment needs to keep sensitive values out of Swarm service environment variables.
