import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', ''),
  app: {
    keys: env.array('APP_KEYS')!,
  },
  proxy: {
    koa: env.bool('IS_PROXIED', false),
    ipHeader: env('PROXY_IP_HEADER', 'X-Forwarded-For'),
    maxIpsCount: env.int('MAX_IPS_COUNT', env.bool('IS_PROXIED', false) ? 1 : 0),
  },
  cron: {
    enabled: env.bool('CRON_ENABLED', false),
  },
  transfer: {
    remote: {
      enabled: env.bool('TRANSFER_REMOTE_ENABLED', false),
    },
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  logger: {
    updates: {
      enabled: env.bool('LOGGER_UPDATES_ENABLED', false),
    },
  },
});

export default config;
