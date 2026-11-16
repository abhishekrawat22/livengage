import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      headers: '*',
      // Override in production with CORS_ORIGINS="https://a.com,https://b.com"
      origin: env.array('CORS_ORIGINS', [
        'https://www.livengage.com',
        'https://livengage.com',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ]),
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
