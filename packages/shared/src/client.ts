import type { App } from '@svq/api'
import { edenTreaty } from '@elysiajs/eden'

// Create Eden Treaty client factory
export function createApiClient(baseUrl: string = 'http://localhost:3333') {
  return edenTreaty<App>(baseUrl)
}

// Default client for development
export const apiClient = createApiClient()

// Types for the Eden Treaty client
export type ApiClient = ReturnType<typeof createApiClient>
