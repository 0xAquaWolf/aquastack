# API Server Implementation

This document details the Elysia API server implementation in `apps/api/`.

## Overview

The API server is built with ElysiaJS and provides full CRUD operations for Users and Quests with end-to-end type safety through Eden Treaty.

## Files Structure

```
apps/api/
├── src/
│   └── index.ts              # Main server file with endpoints
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── tsconfig.build.json       # Build-specific TypeScript config
```

## Implementation Details

### Server Setup

```typescript
import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";

const app = new Elysia()
  .use(cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }))
```

### Type Definitions

#### User Schema
```typescript
const UserSchema = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});
```

#### Quest Schema
```typescript
const QuestSchema = t.Object({
  id: t.String(),
  title: t.String(),
  description: t.String(),
  status: t.Union([
    t.Literal("pending"),
    t.Literal("in_progress"),
    t.Literal("completed"),
  ]),
  userId: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});
```

### Endpoints

#### Health Check
- **GET** `/` - Returns server status message

#### User Endpoints
- **GET** `/users` - Get all users
- **GET** `/users/:id` - Get specific user by ID

#### Quest Endpoints
- **GET** `/quests` - Get all quests
- **GET** `/quests/:id` - Get specific quest by ID
- **POST** `/quests` - Create new quest
- **PUT** `/quests/:id` - Update existing quest
- **DELETE** `/quests/:id` - Delete quest

### Eden Treaty Export

```typescript
// Export app type for Eden Treaty client
export type App = typeof app;
```

## Dependencies

- `elysia` - Main web framework
- `@elysiajs/cors` - CORS support
- `bun-types` - Bun runtime types (dev dependency)

## Development

### Starting the Server
```bash
cd apps/api
pnpm dev
```

The server runs on `http://localhost:3333` by default.

### Building
```bash
pnpm build
```

Generates TypeScript declarations in `dist/` directory.

## Testing Endpoints

### Health Check
```bash
curl http://localhost:3333/
```

### Get All Quests
```bash
curl http://localhost:3333/quests
```

### Create New Quest
```bash
curl -X POST http://localhost:3333/quests \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Quest","description":"Testing the API"}'
```

### Delete Quest
```bash
curl -X DELETE http://localhost:3333/quests/quest-id
```

## Type Safety Features

1. **Schema Validation**: All endpoints use Elysia's type system for request/response validation
2. **Automatic Documentation**: Eden Treaty generates client types from server definitions
3. **Compile-Time Checking**: TypeScript errors if frontend doesn't match API contracts
4. **IntelliSense**: Full autocompletion in IDEs for API calls

## CORS Configuration

The server is configured to accept requests from:
- Any origin (`origin: true`)
- Standard HTTP methods
- Content-Type and Authorization headers

This allows both web and mobile apps to communicate with the API during development.