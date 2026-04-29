import { mobileClientEnvSchema } from '@territorio/shared-config/frontend';

const defaultApiBaseUrl =
  typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3034';

const env = mobileClientEnvSchema.parse(import.meta.env);

export const appConfig = {
  appName: 'Assistente Turistico del Territorio',
  apiBaseUrl: env.VITE_API_BASE_URL ?? defaultApiBaseUrl,
  tenantSlug: env.VITE_TENANT_SLUG,
  googleMapsApiKey: env.VITE_GOOGLE_MAPS_API_KEY ?? null,
};
