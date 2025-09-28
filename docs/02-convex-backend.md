# Convex Backend Implementation

This document provides detailed information about the Convex backend implementation for SelfVision Quest.

## Overview

The Convex backend serves as the complete data and API platform for the SelfVision Quest application. It handles data storage, real-time synchronization, authentication, and business logic.

## Convex Project Structure

```
apps/convex/
├── convex/
│   ├── _generated/          # Auto-generated types and API
│   ├── schema.ts           # Database schema definitions
│   ├── config.ts           # Convex configuration
│   └── *.ts               # Query, Mutation, and Action functions
├── package.json
└── tsconfig.json
```

## Key Convex Features

### 1. Database Schema
Convex uses TypeScript to define database schemas with automatic validation:

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    avatar: v.optional(v.string()),
    createdAt: v.number(),
  })
  .index("by_email", ["email"]),
  
  posts: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    published: v.boolean(),
    createdAt: v.number(),
  })
  .index("by_user", ["userId"]),
});
```

### 2. Query Functions
Read data from the database with automatic caching:

```typescript
// convex/posts.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getPosts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .filter(q => q.eq(q.field("published"), true))
      .order("desc")
      .take(args.limit ?? 10);
    
    return posts;
  },
});
```

### 3. Mutation Functions
Write data to the database with validation:

```typescript
// convex/posts.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const post = await ctx.db.insert("posts", {
      userId: identity.subject,
      title: args.title,
      content: args.content,
      published: true,
      createdAt: Date.now(),
    });

    return post;
  },
});
```

### 4. Action Functions
Perform complex operations with external API calls:

```typescript
// convex/external.ts
import { action } from "./_generated/server";
import { v } from "convex/values";

export const processWebhook = action({
  args: { data: v.any() },
  handler: async (ctx, args) => {
    // Call external APIs
    const response = await fetch("https://api.example.com/webhook", {
      method: "POST",
      body: JSON.stringify(args.data),
    });
    
    return await response.json();
  },
});
```

## Authentication Setup

Convex provides built-in authentication integration:

```typescript
// convex/config.ts
import { defineAuth } from "convex/server";

export default defineAuth({
  providers: [
    {
      domain: "https://your-convex-site.convex.cloud",
    },
  ],
});
```

## File Storage

Convex includes built-in file storage:

```typescript
// convex/files.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
```

## Real-time Subscriptions

Frontend apps automatically subscribe to data changes:

```typescript
// Web app
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

function PostsList() {
  const posts = useQuery(api.posts.getPosts, { limit: 10 });
  
  return (
    <div>
      {posts?.map(post => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
```

## Development Commands

### Local Development
```bash
cd apps/convex
pnpm dev          # Start Convex dev server
pnpm deploy       # Deploy to production
```

### Database Management
```bash
npx convex dev    # Start local development
npx convex deploy # Deploy to production
npx convex run    # Run a function
```

## Integration with Frontend

### Web App (Vite + React)
```typescript
// apps/web/src/main.tsx
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { api } from "../convex/_generated/api";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </React.StrictMode>
);
```

### Mobile App (Expo)
```typescript
// apps/mobile/app/_layout.tsx
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { api } from "../../convex/_generated/api";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ConvexProvider>
  );
}
```

## Environment Variables

Create a `.env.local` file in `apps/convex/`:

```env
CONVEX_DEPLOYMENT=your-deployment-name
CONVEX_ADMIN_KEY=your-admin-key
```

## Testing Convex Functions

Convex provides a testing framework:

```typescript
// tests/posts.test.ts
import { test, expect } from "vitest";
import { convexTest } from "convex-test";
import schema from "../convex/schema";

test("create post", async () => {
  const t = convexTest(schema);
  
  const postId = await t.run(async (ctx) => {
    return await ctx.db.insert("posts", {
      title: "Test Post",
      content: "Test Content",
      published: true,
      createdAt: Date.now(),
    });
  });
  
  expect(postId).toBeDefined();
});
```

## Best Practices

1. **Schema First**: Always define schemas before implementing functions
2. **Validation**: Use Convex's built-in validation for all function arguments
3. **Error Handling**: Implement proper error handling in all functions
4. **Security**: Always check authentication in mutations and actions
5. **Indexing**: Create appropriate indexes for better query performance
6. **Real-time**: Leverage real-time subscriptions for live updates
7. **Testing**: Write tests for all Convex functions

## Common Patterns

### Paginated Queries
```typescript
export const getPaginatedPosts = query({
  args: { 
    paginationOpts: v.paginationOptsTable 
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});
```

### Search Functionality
```typescript
export const searchPosts = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withSearchIndex("search_title", q => 
        q.search("title", args.searchTerm)
      )
      .take(10);
  },
});
```

### Scheduled Functions
```typescript
// convex/scheduler.ts
import { mutation } from "./_generated/server";

export const cleanupOldPosts = mutation({
  handler: async (ctx) => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    
    const oldPosts = await ctx.db
      .query("posts")
      .filter(q => q.lt(q.field("createdAt"), thirtyDaysAgo))
      .collect();
    
    for (const post of oldPosts) {
      await ctx.db.delete(post._id);
    }
  },
});
```

## Migration from Elysia

The key differences from the previous Elysia setup:

1. **Unified Platform**: Convex handles both API and database in one platform
2. **Real-time**: Built-in real-time features without additional setup
3. **Type Safety**: End-to-end types from database to frontend
4. **Automatic Scaling**: No need to manage servers or scaling
5. **Simplified Deployment**: Single command deployment with `npx convex deploy`

## Troubleshooting

Common issues and solutions:

1. **Type Errors**: Run `npx convex dev` to regenerate types
2. **Permission Issues**: Check authentication and authorization logic
3. **Performance**: Add appropriate indexes for complex queries
4. **Real-time Issues**: Verify subscription setup and network connectivity
5. **Deployment Issues**: Check environment variables and deployment configuration

See the [Troubleshooting Guide](../09-troubleshooting-guide.md) for more detailed solutions.