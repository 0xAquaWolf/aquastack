// Import API types from the server
import type { App } from '@svq/api';

// Re-export the API types for frontend use
export type { App };

// Re-export specific types that are commonly used
export type ApiApp = App;

// Explicitly export the Eden Treaty client type
export type { ApiClient } from './client';