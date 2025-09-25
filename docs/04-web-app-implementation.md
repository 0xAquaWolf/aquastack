# Web App Implementation

This document details the Next.js web app implementation in `apps/web/`.

## Overview

The web app is built with Next.js 15 and uses React Query for server state management with full type safety through Eden Treaty.

## Features

- Full CRUD operations for quests
- Real-time updates with React Query
- Type-safe API calls with Eden Treaty
- Responsive design with Tailwind CSS
- Loading states and error handling
- Optimistic updates for better UX

## Files Structure

```
apps/web/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main page with quest management
│   │   └── layout.tsx        # Root layout with providers
│   ├── components/
│   │   └── providers.tsx     # React Query provider
│   ├── hooks/
│   │   └── useApi.ts         # React Query hooks for API operations
│   └── lib/
│       └── api.ts           # API client configuration
├── package.json             # Dependencies and scripts
└── next.config.ts           # Next.js configuration
```

## Implementation Details

### API Client Configuration (`src/lib/api.ts`)

```typescript
import type { ApiClient } from '@svq/shared'
import { createApiClient } from '@svq/shared'

// Create API client for web app
export const apiClient = createApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'
)

// Export the client type for use in hooks
export type { ApiClient }
```

### React Query Hooks (`src/hooks/useApi.ts`)

```typescript
import type { CreateQuest, Quest, UpdateQuest } from '@svq/shared'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

// Quest hooks
export function useQuests() {
  return useQuery({
    queryKey: ['quests'],
    queryFn: async () => {
      const response = await apiClient.quests.get()
      return response.data
    },
  })
}

export function useCreateQuest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (quest: CreateQuest) => {
      const response = await apiClient.quests.post(quest)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] })
    },
  })
}

export function useDeleteQuest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.quests[id].delete()
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] })
    },
  })
}
```

### React Query Provider (`src/components/providers.tsx`)

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Main Page (`src/app/page.tsx`)

```typescript
'use client';

import { useQuests, useCreateQuest, useDeleteQuest } from '@/hooks/useApi';
import { useState } from 'react';
import type { Quest } from '@svq/shared';

export default function Home() {
  const { data: quests, isLoading, error } = useQuests();
  const createQuest = useCreateQuest();
  const deleteQuest = useDeleteQuest();
  const [newQuest, setNewQuest] = useState({ title: '', description: '' });

  const handleCreateQuest = () => {
    if (newQuest.title && newQuest.description) {
      createQuest.mutate(newQuest);
      setNewQuest({ title: '', description: '' });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="font-sans min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">SelfVision Quest</h1>

        {/* Create Quest Form */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Create New Quest</h2>
          {/* Form inputs and button */}
        </div>

        {/* Quests List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Quests</h2>
          {quests?.map((quest: Quest) => (
            <div key={quest.id} className="p-4 bg-white rounded-lg shadow-md">
              {/* Quest item with delete button */}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
```

### Root Layout (`src/app/layout.tsx`)

```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

## Dependencies

```json
{
  "dependencies": {
    "@svq/shared": "workspace:*",
    "@svq/ui": "workspace:*",
    "@svq/api": "workspace:*",
    "@tanstack/react-query": "^5.59.20",
    "next": "15.5.4"
  }
}
```

## React Query Configuration

### Query Client Settings
- **Stale Time**: 1 minute (60 * 1000ms)
- **Refetch on Window Focus**: Disabled for better UX
- **Cache Management**: Automatic invalidation on mutations

### Query Keys
- `['quests']` - All quests
- `['quests', id]` - Specific quest
- `['users']` - All users
- `['users', id]` - Specific user

### Mutation Handling
- **Optimistic Updates**: Not implemented (could be added)
- **Cache Invalidation**: Automatic on successful mutations
- **Error Handling**: Global error boundaries

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

The app runs on `http://localhost:3000` by default.

### Building for Production
```bash
pnpm build
```

### Linting
```bash
pnpm lint
```

## Environment Variables

Create `.env.local` for custom API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

## Testing

### Manual Testing
1. Navigate to `http://localhost:3000`
2. Create a new quest using the form
3. Verify it appears in the list
4. Delete a quest using the delete button
5. Check browser dev tools for network requests

### Type Safety Testing
1. Try accessing non-existent properties - should show TypeScript errors
2. Check autocompletion in IDE - should show available API methods
3. Modify API types - should break frontend compilation
4. Run `pnpm build` - should succeed without errors

## Performance Considerations

1. **Data Fetching**: React Query handles caching and background updates
2. **Bundle Size**: Tree-shaking ensures only used code is included
3. **Rendering**: Efficient re-renders with React Query
4. **Network**: Minimal API calls with proper caching
