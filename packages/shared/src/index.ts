import { createApiClient } from "./client";
import type { App } from "@svq/api";

// Re-export API types
export type { App };

// Export Eden Treaty client factory and types
export { createApiClient };
export type { ApiClient } from "./client";

// Export configured default client
export const apiClient = createApiClient();

// Export inferred types for convenience
export type User = Awaited<ReturnType<typeof apiClient.users.get>>['data'];
export type Quest = Awaited<ReturnType<typeof apiClient.quests.get>>['data'];
export type CreateQuest = Parameters<typeof apiClient.quests.post>[0];
export type UpdateQuest = Parameters<typeof apiClient.quests[string]['put']>[0];

