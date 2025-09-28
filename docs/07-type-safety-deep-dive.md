# Type Safety Deep Dive

This document explains how end-to-end type safety works in the Convex + Better Auth architecture. Convex generates TypeScript types from your schema and functions. Those types flow through shared packages into the Next.js and Expo clients, ensuring IDE autocompletion and compile-time guarantees everywhere.

## Type Safety Architecture

```
┌──────────────────────┐    ┌────────────────────┐    ┌─────────────────────────┐
│  Convex Backend      │    │  Shared Packages    │    │  Clients (Web & Mobile) │
│  (schema + functions)│───►│ (@svq/convex/shared)│───►│  useQuery/useMutation    │
│  ↓ _generated types  │    │  re-export helpers  │    │  Better Auth hooks       │
└──────────────────────┘    └────────────────────┘    └─────────────────────────┘
```

1. **Convex** – schemas, queries, mutations, actions, and auth definitions reside in `apps/convex/convex`. Running `npx convex dev` regenerates `_generated` types on each change.
2. **Shared packages** – `@svq/convex` exposes the generated client/ids; `@svq/shared` holds domain types or wrappers that both clients consume.
3. **Clients** – Next.js and Expo import `api` helpers from `@svq/convex` and rely on React Query/Convex hooks for strongly typed data access.

## Convex as the Source of Truth

### Schema Definitions

```typescript
// apps/convex/convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),
});
```

Every time you edit the schema or any function, Convex regenerates:
- `convex/_generated/api.ts` – Type-safe client definitions
- `convex/_generated/dataModel.ts` – Table metadata and field types
- `convex/_generated/server.ts` – server helpers with typed context

### Functions With Typed Args/Results

```typescript
// apps/convex/convex/tasks.ts
import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("tasks").collect();
  },
});
```

If you add arguments or return different data, Convex updates the generated types automatically. Invalid usage downstream becomes a TypeScript error.

### Better Auth Integration

`apps/convex/convex/auth.ts` wraps Better Auth and exposes helper queries. These helpers share the same `_generated` foundation, so client code sees precise types for authenticated users, session data, and auth errors.

## Sharing Types Across the Monorepo

### Re-exporting Generated Clients

`@svq/convex` (the Convex workspace) exports generated helpers via `src/index.ts`. That means clients can simply import `api` or `Id` types without knowing about local file paths:

```typescript
// packages/shared/src/convex.ts
export { api } from "@svq/convex";
export type { Id } from "@svq/convex";
```

### Adding Domain Types

For additional interfaces (e.g., view models), place them in `packages/shared`:

```typescript
// packages/shared/src/types.ts
import type { Doc } from "@svq/convex";

export type TaskDoc = Doc<"tasks">;
```

The clients now receive a single source of truth for document shapes, even if you derive extra fields or map them to UI props.

## Using Types in the Web App (Next.js)

```typescript
// apps/web/src/app/page.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@svq/convex";

export default function Home() {
  const tasks = useQuery(api.tasks.get);

  if (!tasks) return <p>Loading...</p>;

  return (
    <main>
      {tasks.map(({ _id, text }) => (
        <p key={_id}>{text}</p>
      ))}
    </main>
  );
}
```

- `api.tasks.get` is strongly typed; if you add arguments to the Convex query, TypeScript immediately enforces them here.
- `tasks` is typed as `Doc<"tasks">[]`, giving you autocompletion for `_id`, `text`, etc.
- If you add a mutation, `useMutation(api.tasks.create)` returns a typed function describing required arguments and return values.

## Using Types in the Mobile App (Expo)

```typescript
// apps/mobile/app/(tabs)/index.tsx (simplified)
import { useQuery } from "convex/react";
import { api } from "@svq/convex";

export default function TasksScreen() {
  const tasks = useQuery(api.tasks.get);

  return (
    <View>
      {tasks?.map(({ _id, text }) => (
        <Text key={_id}>{text}</Text>
      ))}
    </View>
  );
}
```

React Native shares the same Convex React bindings, so hooks behave identically. Zustand stores or React Query wrappers can reference the same `Doc<"tasks">` types to guarantee parity between clients.

## Benefits

1. **Convex-driven type generation** – No manual DTO maintenance; schema changes ripple through the repo instantly.
2. **Better Auth typing** – Auth helpers expose typed results, so you know when a user is `null` vs authenticated.
3. **Shared package reuse** – UI and business logic packages import one canonical set of types.
4. **Refactor confidence** – Renaming a field in Convex triggers TypeScript errors until all clients adjust.

## Common Patterns

### Narrowing Documents

```typescript
import type { Doc } from "@svq/convex";

type Task = Doc<"tasks">;

function isRecent(task: Task) {
  return Date.now() - task.createdAt < 86_400_000;
}
```

### Typed Mutations

```typescript
const createTask = useMutation(api.tasks.create);

async function handleSubmit(text: string) {
  await createTask({ text }); // TypeScript enforces required args
}
```

### Auth-aware Components

```typescript
import { useQuery } from "convex/react";
import { api } from "@svq/convex";

const currentUser = useQuery(api.auth.getCurrentUser);

if (!currentUser) {
  return <SignInPrompt />;
}

return <Dashboard user={currentUser} />;
```

## Validating Type Safety

1. **Run the Convex dev server** – `pnpm --filter @svq/convex dev`
2. **Make schema/function changes** – Types regenerate automatically
3. **Check clients** – IDE squiggles highlight any usages that must be updated
4. **Run builds** – `pnpm build` ensures Turbo executes type checking across the monorepo

## Troubleshooting

| Issue | Cause | Resolution |
| --- | --- | --- |
| `_generated` imports missing | Convex dev server not running after schema change | Start `pnpm --filter @svq/convex dev` or run `pnpm build` |
| `Doc<"table">` resolves to `never` | Table name typo or schema not yet built | Verify the table exists in `schema.ts`, rerun Convex typegen |
| Auth helper types are `any` | Auth client not re-exported correctly | Ensure `@svq/convex` exports `components` / auth helpers |
| Clients reference stale fields | Shared package not rebuilt | `pnpm --filter @svq/shared build` then `pnpm build` |

## Best Practices

- Keep schema updates incremental; regenerate types frequently during edits
- Prefer `import type { Doc } ...` when only TypeScript information is needed to avoid runtime imports
- Surface domain-specific aliases (e.g., `type Task = Doc<"tasks">`) in shared packages to reduce duplication
- Commit Convex `_generated` files so teammates receive updated types without needing to regenerate immediately

With Convex and Better Auth, type information starts at the data layer and flows through the entire stack, delivering consistent autocompletion, safer refactors, and fewer runtime surprises across SelfVision Quest.
