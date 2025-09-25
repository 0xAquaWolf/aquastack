# Shared Types Package

This document details the shared types package implementation in `packages/shared/`.

## Overview

The shared types package serves as the central hub for type definitions and API client configuration, ensuring consistency across the entire monorepo.

## Purpose

1. **Central Type Management**: Single source of truth for all API types
2. **Eden Treaty Integration**: Provides type-safe API clients
3. **Cross-Platform Sharing**: Same types used by web and mobile apps
4. **Workspace Dependencies**: Uses `workspace:*` protocol for internal dependencies

## Files Structure

```
packages/shared/
├── index.ts                 # Main exports
├── src/
│   ├── api.ts              # API type imports and exports
│   └── client.ts           # Eden Treaty client factory
├── package.json            # Dependencies and configuration
└── tsconfig.json           # TypeScript configuration
```

## Implementation Details

### Main Exports (`index.ts`)

```typescript
// Re-export API types and Eden Treaty client
export * from './src/api'
export * from './src/client'

// Re-export better-auth types
export * from 'better-auth'

// Shared utility types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface ApiError {
  message: string
  code?: string
  details?: any
}

// Shared app types
export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface Quest {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateQuest {
  title: string
  description: string
}

export interface UpdateQuest {
  title?: string
  description?: string
  status?: 'pending' | 'in_progress' | 'completed'
}
```

### API Types (`src/api.ts`)

```typescript
// Import API types from the server
import type { App } from '@svq/api'

// Re-export the API types for frontend use
export type { App }

// Re-export specific types that are commonly used
export type ApiApp = App

// Explicitly export the Eden Treaty client type
export type { ApiClient } from './client'
```

### Client Factory (`src/client.ts`)

```typescript
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
```

## Dependencies

```json
{
  "dependencies": {
    "better-auth": "^1.3.16",
    "@svq/api": "workspace:*",
    "@elysiajs/eden": "^1.3.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

## Usage Patterns

### In Web App
```typescript
import { createApiClient } from '@svq/shared'

const apiClient = createApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'
)
```

### In Mobile App
```typescript
import { createApiClient } from '@svq/shared'
import Constants from 'expo-constants'

const apiClient = createApiClient(
  Constants?.expoConfig?.extra?.apiUrl || 'http://localhost:3333'
)
```

## Type Safety Features

1. **Automatic Type Generation**: API types are imported directly from the server
2. **Eden Treaty Integration**: Full type safety for all API calls
3. **Shared Interfaces**: Consistent types across all platforms
4. **Utility Types**: Common response and error types

## Benefits

1. **Single Source of Truth**: All API types defined in one place
2. **Consistency**: Same types used across web and mobile
3. **Developer Experience**: Full autocompletion and type checking
4. **Maintainability**: Easy to update types in one location
5. **Scalability**: Simple to add new API types and interfaces

## Configuration

The package is configured to:
- Export TypeScript declarations
- Use workspace protocol for internal dependencies
- Provide both CommonJS and ES module support
- Include proper type definitions for Eden Treaty

## Testing

To verify the shared types work correctly:

1. Build the package: `pnpm build`
2. Import types in web app: should provide autocompletion
3. Import types in mobile app: should provide autocompletion
4. Run type checking: `pnpm type-check`
