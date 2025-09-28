# Web App Implementation

This document details the Next.js web app implementation in `apps/web/`.

## Overview

The web app is built with Next.js 15 and uses Better Auth for authentication with Convex for real-time data management, providing full end-to-end type safety across the entire stack.

## Features

- Full CRUD operations for quests
- Real-time updates with Convex subscriptions
- Type-safe API calls with Convex client
- Authentication with Better Auth
- Responsive design with Tailwind CSS v4
- App Router file-based routing
- Loading states and error handling
- Optimistic updates for better UX

## Files Structure

```
apps/web/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home page with quest management
│   │   ├── layout.tsx            # Root layout with providers
│   │   ├── ConvexClientProvider.tsx # Convex client provider
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   └── shared/               # Shared UI components from @svq/ui
│   ├── hooks/
│   │   └── useConvex.ts          # Convex hooks for data operations
│   └── lib/
│       └── convex.ts             # Convex client configuration
├── package.json                  # Dependencies and scripts
├── next.config.ts               # Next.js configuration
└── tsconfig.json                # TypeScript configuration
```

## Implementation Details

### Convex Client Provider (`src/app/ConvexClientProvider.tsx`)

```typescript
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import React from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
```

### Convex Hooks (`src/hooks/useConvex.ts`)

```typescript
import { useQuery, useMutation } from "convex/react";
import { api } from "@svq/convex";
import type { Id } from "@svq/convex";

// Task hooks using Convex queries and mutations
export function useTasks() {
  return useQuery(api.tasks.get);
}

export function useCreateTask() {
  return useMutation(api.tasks.create);
}

export function useDeleteTask() {
  return useMutation(api.tasks.delete);
}

export function useUpdateTask() {
  return useMutation(api.tasks.update);
}
```

### Root Layout (`src/app/layout.tsx`)

```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SelfVision Quest",
  description: "Your journey to self-improvement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
```

### Home Page (`src/app/page.tsx`)

```typescript
"use client";

import { useTasks, useCreateTask, useDeleteTask } from "@/hooks/useConvex";
import { useState } from "react";

export default function Home() {
  const { data: tasks, isLoading, error } = useTasks();
  const createTask = useCreateTask();
  const deleteTask = useDeleteTask();
  const [newTask, setNewTask] = useState({ text: "" });

  const handleCreateTask = () => {
    if (newTask.text.trim()) {
      createTask.mutate({ text: newTask.text.trim() });
      setNewTask({ text: "" });
    }
  };

  const handleDeleteTask = (id: any) => {
    deleteTask.mutate({ id });
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8">Error: {error.message}</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">SelfVision Quest</h1>

        {/* Create Task Form */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Task description"
              className="flex-1 px-4 py-2 border rounded-md"
              value={newTask.text}
              onChange={(e) => setNewTask({ text: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateTask()}
            />
            <button
              onClick={handleCreateTask}
              disabled={createTask.isPending}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {createTask.isPending ? "Creating..." : "Add Task"}
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tasks</h2>
          {tasks?.map((task) => (
            <div key={task._id} className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
              <span className="text-lg">{task.text}</span>
              <button
                onClick={() => handleDeleteTask(task._id)}
                disabled={deleteTask.isPending}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
```

## Dependencies

```json
{
  "dependencies": {
    "@svq/convex": "workspace:*",
    "@svq/shared": "workspace:*",
    "@svq/ui": "workspace:*",
    "convex": "^1.27.3",
    "next": "15.5.4"
  }
}
```

## Convex Integration

### Real-time Data Updates
- **Automatic Subscriptions**: Convex automatically subscribes to data changes
- **Optimistic Updates**: Built-in optimistic UI updates
- **Offline Support**: Automatic conflict resolution when offline
- **Type Safety**: End-to-end types from database to UI

### Convex Client Configuration
- **Development**: Uses local Convex dev server
- **Production**: Uses deployed Convex instance
- **Environment Variables**: Configurable via `.env.local`
- **Error Handling**: Built-in error boundary support

## Next.js Configuration

### App Router
- **File-based Routing**: Files in `src/app/` automatically become routes
- **Layout System**: Support for shared layouts and nested routes
- **Server Components**: Automatic server-side rendering for optimal performance
- **Type Safety**: Full TypeScript support for route parameters

### Development Features
- **Hot Module Replacement**: Instant updates during development
- **Fast Refresh**: Preserve component state during updates
- **Route Pre-fetching**: Automatic pre-fetching of linked routes
- **Image Optimization**: Built-in image optimization and resizing

## Features

### Quest Management
1. **Create Quest**: Form with title and description validation
2. **List Quests**: Display all quests with status badges
3. **Delete Quest**: Confirmation dialog before deletion
4. **Status Display**: Visual indicators for quest status

### User Experience
1. **Loading States**: Show loading indicators during API calls
2. **Error Handling**: Display error messages with recovery options
3. **Responsive Design**: Works on desktop and mobile
4. **Form Validation**: Client-side validation before API calls

### Type Safety
1. **Full TypeScript**: All components and hooks are typed
2. **API Types**: Imported from shared package
3. **React Query Types**: Built-in type safety for mutations
4. **Component Props**: Properly typed component interfaces

## Development

### Starting the Development Server
```bash
cd apps/web
pnpm dev
```

The app runs on `http://localhost:3000` by default (Next.js dev server).

### Building for Production
```bash
pnpm build
```

### Linting
```bash
pnpm lint
```

## Environment Variables

Create `.env.local` for Convex configuration:
```env
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```

## Testing

### Manual Testing
1. Navigate to `http://localhost:3000`
2. Create a new task using the form
3. Verify it appears in the list with real-time updates
4. Delete a task using the delete button
5. Check browser dev tools for Convex WebSocket connections

### Type Safety Testing
1. Try accessing non-existent properties - should show TypeScript errors
2. Check autocompletion in IDE - should show available Convex methods
3. Modify Convex schema - should regenerate types and break frontend compilation
4. Run `pnpm build` - should succeed without errors

## Performance Considerations

1. **Data Fetching**: Convex handles caching and real-time updates automatically
2. **Bundle Size**: Next.js provides optimized bundling and code splitting
3. **Rendering**: Efficient re-renders with Convex subscriptions
4. **Network**: Minimal data transfer with intelligent subscriptions
5. **Development Speed**: Fast Refresh and Hot Module Replacement

## Better Auth Integration

The project uses Better Auth for authentication, which integrates seamlessly with Convex:

### Setup Requirements
- Install Better Auth and Convex integration packages
- Configure authentication providers (email/password, social OAuth)
- Set up session management and user storage
- Configure protected routes and middleware

### Key Features
- **Multiple Providers**: Email/password, OAuth, magic links
- **Session Management**: Secure token-based authentication
- **Type Safety**: End-to-end TypeScript types for auth
- **Convex Integration**: Seamless user data storage and queries
- **Customizable**: Extensible with plugins and custom logic

### Migration from Elysia

Key changes from the previous Elysia setup:

1. **Backend Platform**: Migrated from custom Elysia API to Convex
2. **Authentication**: Moved from Eden Treaty to Better Auth + Convex
3. **Real-time**: Built-in real-time features vs manual implementation
4. **Type Safety**: Enhanced end-to-end type safety with Convex
5. **Simplified Architecture**: Single platform for both data and auth
