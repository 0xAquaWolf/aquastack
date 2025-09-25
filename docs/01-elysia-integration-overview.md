# Elysia Integration Overview

This document provides a comprehensive overview of the Elysia API integration with end-to-end type safety across the SelfVision Quest monorepo.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web App       │    │   Mobile App    │    │   Shared Types  │
│  (Next.js)      │    │   (Expo)        │    │   Package       │
│                 │    │                 │    │                 │
│ - React Query   │◄──►│ - Zustand       │◄──►│ - Eden Treaty   │
│ - Eden Client   │    │ - Eden Client   │    │ - API Types     │
│ - Type Safe     │    │ - Type Safe     │    │ - Shared Utils  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   API Server    │
                    │   (Elysia)      │
                    │                 │
                    │ - Type Safe     │
                    │ - Schema Val    │
                    │ - CORS Enabled  │
                    └─────────────────┘
```

## Key Features

### 1. End-to-End Type Safety
- API types flow from server to frontend through Eden Treaty
- Changes to API schemas automatically propagate to frontend types
- Full TypeScript compilation across all packages
- Autocompletion and type checking in both web and mobile apps

### 2. Shared Architecture
- Single source of truth for API contracts
- Centralized type definitions in `packages/shared`
- Workspace dependencies using `workspace:*` protocol
- Consistent API consumption patterns across platforms

### 3. Cross-Platform Support
- Web app uses React Query for server state management
- Mobile app uses Zustand for state management
- Both use the same Eden Treaty client
- Identical API types and interfaces

## Technology Stack

- **Backend**: ElysiaJS with Eden Treaty
- **Web**: Next.js 15, React Query, TypeScript
- **Mobile**: Expo 53, React Native, Zustand, TypeScript
- **Shared**: Turborepo workspaces, TypeScript
- **Package Manager**: pnpm with workspace protocol

## Benefits

1. **Developer Experience**: Full autocompletion and type safety
2. **Maintainability**: Single source of truth for API types
3. **Scalability**: Easy to add new endpoints with type safety
4. **Consistency**: Same API patterns across web and mobile
5. **Performance**: Optimized data fetching and state management