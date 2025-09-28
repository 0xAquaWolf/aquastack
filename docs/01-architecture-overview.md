# Architecture Overview

This document provides a comprehensive overview of the SelfVision Quest architecture with Next.js + Better Auth + Convex integration.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web App       │    │   Mobile App    │    │   Shared Types  │
│  (Next.js)      │    │   (Expo)        │    │   Package       │
│                 │    │                 │    │                 │
│ - App Router    │◄──►│ - Zustand       │◄──►│ - Convex Types  │
│ - Convex Client│    │ - Convex Client │    │ - Shared Utils  │
│ - Better Auth   │    │ - Better Auth   │    │ - UI Components │
│ - Type Safe     │    │ - Type Safe     │    │ - Auth Config   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Backend       │
                    │   (Convex)      │
                    │                 │
                    │ - Real-time     │
                    │ - Type Safe     │
                    │ - Auto-scaling  │
                    │ - Better Auth   │
                    │ - Auth Ready    │
                    └─────────────────┘
```

## Key Features

### 1. End-to-End Type Safety
- API types flow from Convex schemas to frontend through generated types
- Changes to Convex schemas automatically propagate to frontend types
- Full TypeScript compilation across all packages
- Autocompletion and type checking in both web and mobile apps

### 2. Real-time Data Synchronization
- Convex provides real-time data synchronization out of the box
- Changes in the backend are automatically reflected in the frontend
- Offline-first capabilities with automatic conflict resolution
- WebSocket-based updates for instant data sync

### 3. Shared Architecture
- Single source of truth for data schemas in Convex
- Centralized type definitions in `packages/shared`
- Workspace dependencies using `workspace:*` protocol
- Consistent data access patterns across platforms

### 4. Modern Frontend Stack
- **Web**: Next.js 15 with App Router and Turbopack for fast development
- **Mobile**: Expo Router v5 for file-based routing, NativeWind for styling
- **Authentication**: Better Auth for comprehensive authentication across platforms
- **State Management**: Zustand for mobile app, Convex subscriptions for web app
- **UI Components**: Shared React components in `packages/ui`

### 5. Integrated Authentication
- **Better Auth**: Comprehensive authentication framework with multiple providers
- **Convex Integration**: Seamless user data storage and auth state management
- **Type Safety**: End-to-end TypeScript types for authentication flows
- **Multi-platform**: Consistent auth experience across web and mobile

## Technology Stack

- **Backend**: Convex for real-time data, API endpoints, and authentication
- **Web**: Next.js 15, React 19, App Router, Tailwind CSS v4, Better Auth
- **Mobile**: Expo 53, React Native 0.79.5, Expo Router v5, NativeWind, Zustand, Better Auth
- **Shared**: Turborepo workspaces, TypeScript 5+, workspace dependencies
- **Package Manager**: pnpm with workspace protocol

## Benefits

1. **Developer Experience**: Full autocompletion and type safety across the entire stack
2. **Real-time Features**: Built-in real-time synchronization without additional setup
3. **Maintainability**: Single source of truth for data schemas and types
4. **Scalability**: Convex handles scaling automatically, easy to add new features
5. **Consistency**: Same data access patterns across web and mobile
6. **Performance**: Next.js 15 with Turbopack delivers fast builds while Convex keeps data access efficient

## Data Flow

```
User Action → Frontend → Convex Query/Mutation → Database → Real-time Update
```

1. **User Action**: User interacts with web or mobile app
2. **Frontend**: App calls Convex client with type-safe query/mutation
3. **Convex**: Server processes request with validation and business logic
4. **Database**: Convex handles data storage and versioning
5. **Real-time Update**: All connected clients receive automatic updates

## Key Convex Features Used

- **Database**: NoSQL database with automatic indexing
- **Functions**: Query, Mutation, and Action functions for data operations
- **Real-time**: Automatic subscriptions and updates
- **Authentication**: Built-in auth providers (Clerk, etc.)
- **File Storage**: Integrated file upload and storage
- **Scheduled Functions**: Background job processing
- **Vector Search**: Built-in vector database for AI features

## Migration Benefits

Migrating from the former Elysia REST API to Convex (while retaining the Next.js frontend) provides:

- **Simplified Architecture**: One platform powers data, auth, and functions
- **Better Real-time**: Native subscriptions without custom WebSocket plumbing
- **Improved Developer Experience**: Automatic type generation shared by web and mobile
- **Enhanced Type Safety**: Convex schemas flow straight into client code
- **Automatic Scaling**: Convex manages infrastructure and concurrency
- **Reduced Complexity**: No standalone API server, CORS, or schema duplication

## Getting Started

1. **Setup Convex**: Create Convex project and define schemas
2. **Setup Frontend**: Scaffold the Next.js web app and Expo mobile client
3. **Connect Clients**: Install and configure Convex clients in Next.js and Expo
4. **Share Types**: Export generated types through shared packages as needed
5. **Implement Features**: Build features using type-safe queries, mutations, actions, and Better Auth helpers

See individual implementation documents for detailed setup instructions.