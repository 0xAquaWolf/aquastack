import { createApiClient } from '@svq/shared';
import type { ApiClient } from '@svq/shared';

// Create API client for web app
export const apiClient = createApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'
);

// Export the client type for use in hooks
export type { ApiClient };