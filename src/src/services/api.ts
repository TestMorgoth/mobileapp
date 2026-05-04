import { ApiClient } from '@territorio/shared-api-client';
import { appConfig } from '../app/app-config.js';
import { useSessionStore } from '../store/session-store.js';

export const apiClient = new ApiClient({
  baseUrl: appConfig.apiBaseUrl,
  getAccessToken: () => useSessionStore.getState().accessToken,
  onUnauthorized: () => useSessionStore.getState().logout(),
  defaultHeaders: {
    'x-tenant-slug': appConfig.tenantSlug,
  },
});
