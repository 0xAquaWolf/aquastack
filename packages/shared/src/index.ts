import { createApiClient } from './client';
import type { App } from '@svq/api';

// Re-export API types
export type { App };

// API hooks
export * from './hooks/useApi';

export { createApiClient };