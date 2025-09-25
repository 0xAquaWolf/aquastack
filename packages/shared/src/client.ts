import { edenTreaty } from '@elysiajs/eden';
import type { App } from '@svq/api';

// Create Eden Treaty client factory
export const createApiClient = (baseUrl: string = 'http://localhost:3333') => {
  return edenTreaty<App>(baseUrl);
};

// Default client for development
export const apiClient = createApiClient();

// Types for the Eden Treaty client
export type ApiClient = ReturnType<typeof createApiClient>;