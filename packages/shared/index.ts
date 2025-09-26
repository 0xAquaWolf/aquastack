import type { App } from '@svq/api'
import { createApiClient } from './src/client'

// Re-export API types
export type { App }

// Export Eden Treaty client factory and types
export { createApiClient }
export type { ApiClient } from './src/client'

// Export configured default client
export const apiClient = createApiClient()

// Export inferred types for convenience
export type User = Awaited<ReturnType<typeof apiClient.users.get>>['data']
export type Quest = Awaited<ReturnType<typeof apiClient.quests.get>>['data']
export type CreateQuest = Parameters<typeof apiClient.quests.post>[0]
export type UpdateQuest = Parameters<typeof apiClient.quests[string]['put']>[0]
