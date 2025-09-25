# Type Safety Deep Dive

This document provides an in-depth explanation of the type safety implementation across the SelfVision Quest monorepo.

## Type Safety Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Server    │    │   Shared Types  │    │   Frontend Apps │
│                 │    │                 │    │                 │
│ Elysia Schema   │───►│ Eden Treaty     │───►│ Type-safe API  │
│ TypeScript      │    │ Client Factory  │    │ Calls          │
│ Export App Type│    │ Type Exports    │    │ Autocompletion  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Core Concepts

### 1. Single Source of Truth

The API server (`apps/api`) is the single source of truth for all types:

```typescript
// apps/api/src/index.ts
const QuestSchema = t.Object({
  id: t.String(),
  title: t.String(),
  description: t.String(),
  status: t.Union([
    t.Literal('pending'),
    t.Literal('in_progress'),
    t.Literal('completed'),
  ]),
  userId: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
})

// Export for Eden Treaty
export type App = typeof app
```

### 2. Eden Treaty Type Generation

Eden Treaty automatically generates client types from the server:

```typescript
import type { App } from '@svq/api'
// packages/shared/src/client.ts
import { edenTreaty } from '@elysiajs/eden'

export function createApiClient(baseUrl: string = 'http://localhost:3333') {
  return edenTreaty<App>(baseUrl)
}

// This creates fully typed client methods:
// - apiClient.quests.get()
// - apiClient.quests.post(quest)
// - apiClient.quests[id].delete()
// etc.
```

### 3. Type Propagation Flow

```
API Server → Shared Package → Frontend Apps → Runtime Safety
```

1. **API Server**: Defines types with Elysia schema
2. **Shared Package**: Imports and re-exports types
3. **Frontend Apps**: Consume types for API calls
4. **Runtime**: Full type safety at compile time

## Type Safety Implementation Details

### API Server Types

#### Schema Definitions
```typescript
// Using Union types instead of Enum for better TypeScript support
const QuestSchema = t.Object({
  status: t.Union([
    t.Literal('pending'),
    t.Literal('in_progress'),
    t.Literal('completed'),
  ]),
})
```

#### Response Types
```typescript
// Automatic response type inference
.get('/quests', () => {
  return [ /* quest data */ ];
}, {
  response: t.Array(QuestSchema),
})
```

#### Request Body Validation
```typescript
.post('/quests', ({ body }) => {
  return createQuest(body);
}, {
  body: CreateQuestSchema,
  response: QuestSchema,
})
```

### Shared Package Types

#### API Type Import
```typescript
// packages/shared/src/api.ts
import type { App } from '@svq/api'

export type { App }
export type ApiApp = App
```

#### Client Factory Types
```typescript
// packages/shared/src/client.ts
export type ApiClient = ReturnType<typeof createApiClient>

// This provides types for:
// - apiClient.quests.get()       → Promise<{ data: Quest[] }>
// - apiClient.quests.post(quest) → Promise<{ data: Quest }>
// - apiClient.quests[id].delete() → Promise<{ data: { success: boolean, message: string } }>
```

#### Shared Interface Types
```typescript
// packages/shared/index.ts
export interface Quest {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  userId: string
  createdAt: Date
  updatedAt: Date
}
```

### Web App Types

#### React Query Hooks
```typescript
// apps/web/src/hooks/useApi.ts
export function useQuests() {
  return useQuery({
    queryKey: ['quests'],
    queryFn: async () => {
      const response = await apiClient.quests.get()
      return response.data // TypeScript knows this is Quest[]
    },
  })
}

export function useCreateQuest() {
  return useMutation({
    mutationFn: async (quest: CreateQuest) => {
      const response = await apiClient.quests.post(quest)
      return response.data // TypeScript knows this is Quest
    },
  })
}
```

#### Component Props
```typescript
// apps/web/src/app/page.tsx
quests?.map((quest: Quest) => (
  <div key={quest.id}>
    <h3>{quest.title}</h3>
    {/* TypeScript knows quest has title, description, status */}
  </div>
))
```

### Mobile App Types

#### Zustand Store
```typescript
// apps/mobile/store/api.ts
interface ApiState {
  quests: Quest[] // Typed from shared package
  loading: boolean
  error: string | null

  createQuest: (quest: CreateQuest) => Promise<void>
  deleteQuest: (id: string) => Promise<void>
}
```

#### Component Usage
```typescript
// apps/mobile/app/(tabs)/index.tsx
const { quests, createQuest, deleteQuest } = useApiStore();
const [newQuest, setNewQuest] = useState<CreateQuest>({
  title: '',
  description: ''
});

// TypeScript knows exactly what properties exist
<Text>{quest.title}</Text>
<Text>{quest.description}</Text>
```

## Type Safety Benefits

### 1. Compile-Time Error Prevention

```typescript
// ❌ TypeScript Error - Property doesn't exist
apiClient.quests.nonexistentMethod()

// ❌ TypeScript Error - Wrong type
apiClient.quests.post({
  title: 'Test',
  description: 123, // Should be string
})

// ❌ TypeScript Error - Missing required property
apiClient.quests.post({
  title: 'Test'
  // Missing description
})

// ✅ TypeScript Success - Correct usage
apiClient.quests.post({
  title: 'Test',
  description: 'Testing type safety'
})
```

### 2. IDE Autocompletion

```typescript
// Typing "apiClient." shows available methods:
// - apiClient.index
// - apiClient.users
// - apiClient.quests

// Typing "apiClient.quests." shows available methods:
// - apiClient.quests.get()
// - apiClient.quests.post(body)
// - apiClient.quests[id].get()
// - apiClient.quests[id].put(body)
// - apiClient.quests[id].delete()
```

### 3. Refactoring Safety

```typescript
// If you change the API schema:
// Before:
interface Quest {
  title: string
  description: string
}

// After:
interface Quest {
  name: string // Changed from title
  details: string // Changed from description
}

// TypeScript will show errors in all frontend code:
// ❌ quest.title → quest.name
// ❌ quest.description → quest.details
```

### 4. Response Type Safety

```typescript
// TypeScript knows exactly what the response looks like
const response = await apiClient.quests.get()

// ✅ Safe - TypeScript knows response.data is Quest[]
response.data.map(quest => quest.title)

// ❌ Error - TypeScript knows response doesn't have message
response.message

// ✅ Safe - TypeScript knows response has data property
response.data
```

## Type Safety Patterns

### 1. API Response Pattern
```typescript
// All API responses follow this pattern:
interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

// Eden Treaty automatically creates this structure
const response = await apiClient.quests.get()
// response.data: Quest[]
// response.success: boolean
```

### 2. Error Handling Pattern
```typescript
// Type-safe error handling
try {
  const response = await apiClient.quests.post(quest)
  return response.data
}
catch (error) {
  // TypeScript knows what type of error this is
  console.error('Failed to create quest:', error)
}
```

### 3. Component Props Pattern
```typescript
// Type-safe component props
interface QuestCardProps {
  quest: Quest;
  onDelete: (id: string) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onDelete }) => {
  return (
    <div>
      <h3>{quest.title}</h3>
      <button onClick={() => onDelete(quest.id)}>
        Delete
      </button>
    </div>
  );
};
```

## Advanced Type Safety Features

### 1. Conditional Types
```typescript
// Eden Treaty uses conditional types for path parameters
type ApiClient = ReturnType<typeof createApiClient>

// apiClient.quests[id] knows id must be string
async function deleteQuest(id: string) {
  const response = await apiClient.quests[id].delete()
  return response.data
}
```

### 2. Generic Type Parameters
```typescript
// React Query generics for custom hooks
export function useQuest(id: string) {
  return useQuery({
    queryKey: ['quests', id],
    queryFn: async () => {
      const response = await apiClient.quests[id].get()
      return response.data // TypeScript knows this is Quest
    },
  })
}
```

### 3. Discriminated Unions
```typescript
// Status is a discriminated union
type QuestStatus = 'pending' | 'in_progress' | 'completed'

// TypeScript can narrow down types
function getStatusColor(status: QuestStatus) {
  switch (status) {
    case 'pending': return 'gray'
    case 'in_progress': return 'yellow'
    case 'completed': return 'green'
  }
}
```

## Type Safety Validation

### 1. TypeScript Compilation
```bash
# Should succeed without errors
pnpm build

# Check individual packages
cd apps/api && pnpm build
cd apps/web && pnpm build
cd apps/mobile && pnpm lint
```

### 2. Type Checking
```typescript
import type { Quest } from '@svq/shared'
// Test that types are properly connected
import { apiClient } from '@svq/shared'

// This should work with full autocompletion
const quest: Quest = await apiClient.quests.get().then(res => res.data[0])
```

### 3. IDE Integration
- Hover over any API method call
- Should show complete type information
- Autocompletion should work for all properties
- Refactoring should update all references

## Common Type Safety Issues and Solutions

### 1. Circular Dependencies
**Problem**: Type import loops between packages
**Solution**: Use `type` imports for types only

```typescript
// ✅ Correct - type import
import type { App } from '@svq/api'

// ❌ Incorrect - value import can cause circular dependencies
import { App } from '@svq/api'
```

### 2. Missing Type Exports
**Problem**: Types not properly exported from shared package
**Solution**: Ensure all necessary types are exported

```typescript
// packages/shared/index.ts
export * from './src/api'
export * from './src/client'
export type * from './src/types' // If you have additional types
```

### 3. Runtime vs Compile Time
**Problem**: Expecting runtime type validation
**Solution**: Remember TypeScript is compile-time only

```typescript
// TypeScript provides compile-time safety
// Runtime validation is handled by Elysia schemas
const response = await apiClient.quests.post(invalidQuest)
// This will fail at runtime due to Elysia schema validation
```

## Type Safety Best Practices

### 1. Keep Types Simple
```typescript
// ✅ Good - Simple, clear types
interface Quest {
  id: string
  title: string
  description: string
  status: QuestStatus
}

// ❌ Avoid - Overly complex types
interface QuestWithComplexNestedTypes {
  // ... unnecessary complexity
}
```

### 2. Use Type Exports
```typescript
// ✅ Export types explicitly
export type { CreateQuest, Quest, UpdateQuest }

// ❌ Don't rely on implicit exports
export { CreateQuest, Quest, UpdateQuest }
```

### 3. Document Type Intentions
```typescript
/**
 * Represents a quest in the system
 * @property id - Unique identifier
 * @property title - Display title
 * @property description - Detailed description
 * @property status - Current quest status
 */
export interface Quest {
  id: string
  title: string
  description: string
  status: QuestStatus
}
```

This type safety implementation ensures that your entire application maintains type safety from the API server to the frontend clients, providing excellent developer experience and preventing runtime errors.
