import { createApiClient, apiClient as defaultApiClient } from "@svq/shared";
import type { ApiClient } from "@svq/shared";

// Create API client for web app with environment-specific URL
export const apiClient = createApiClient(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
);

// Export the default client as well for convenience
export { defaultApiClient };

// Export the client type for use in hooks
export type { ApiClient };
