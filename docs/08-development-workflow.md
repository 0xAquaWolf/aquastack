# Development Workflow

This document outlines the development workflow for working with the Elysia integration in the SelfVision Quest monorepo.

## Overview

The development workflow is designed to maximize productivity while maintaining type safety and consistency across all packages.

## Development Environment Setup

### Prerequisites
- Node.js (v18 or higher)
- pnpm package manager
- VS Code (recommended) with TypeScript extensions
- Xcode (for iOS development - optional)
- Android Studio (for Android development - optional)

### Initial Setup
```bash
# Clone and install dependencies
git clone <repository-url>
cd selfvision-quest
pnpm install
```

## Development Commands

### Root Level Commands
```bash
# Install all dependencies
pnpm install

# Build all packages
pnpm build

# Start all development servers
pnpm dev

# Run linting across all packages
pnpm lint
```

### Individual Package Commands

#### API Server
```bash
cd apps/api
pnpm dev     # Start development server
pnpm build   # Build for production
pnpm start   # Start production server
```

#### Web App
```bash
cd apps/web
pnpm dev     # Start development server (localhost:3000)
pnpm build   # Build for production
pnpm start   # Start production server
pnpm lint    # Run linting
```

#### Mobile App
```bash
cd apps/mobile
pnpm dev     # Start Expo development server
pnpm ios     # Start iOS simulator
pnpm android # Start Android emulator
pnpm web     # Start web version
pnpm lint    # Run linting
pnpm format  # Format code
```

#### Shared Package
```bash
cd packages/shared
pnpm build   # Build TypeScript declarations
```

## Daily Development Workflow

### 1. Start Development Environment

```bash
# Terminal 1 - Start API server
cd apps/api && pnpm dev

# Terminal 2 - Start web app
cd apps/web && pnpm dev

# Terminal 3 - Start mobile app
cd apps/mobile && pnpm dev
```

### 2. Making Changes

#### Adding New API Endpoints
```typescript
// apps/api/src/index.ts
app.get('/users/:id/posts', ({ params: { id } }) => {
  return getUserPosts(id);
}, {
  params: t.Object({
    id: t.String(),
  }),
  response: t.Array(PostSchema),
});
```

#### Updating Shared Types
```typescript
// packages/shared/index.ts
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Using New Types in Frontend
```typescript
// apps/web/src/hooks/useApi.ts
export const useUserPosts = (userId: string) => {
  return useQuery({
    queryKey: ['posts', userId],
    queryFn: async () => {
      const response = await apiClient.users[userId].posts.get();
      return response.data;
    },
  });
};
```

### 3. Testing Changes

#### API Testing
```bash
# Test new endpoint
curl http://localhost:3333/users/1/posts
```

#### Web App Testing
1. Navigate to `http://localhost:3000`
2. Test new functionality
3. Check browser dev tools for network requests

#### Mobile App Testing
1. Press 'w' for web version or use mobile simulator
2. Test new functionality
3. Check console logs for debugging

## Type Safety Workflow

### 1. API Changes
```typescript
// Modify API schema
const PostSchema = t.Object({
  title: t.String(),
  content: t.String(),
  publishedAt: t.Date(), // New field
});
```

### 2. Verify Type Propagation
```typescript
// Check that frontend types are updated
const response = await apiClient.posts.get();
const post = response.data[0];
console.log(post.publishedAt); // Should have autocompletion
```

### 3. Update Frontend Usage
```typescript
// Update components to use new fields
<Text>{post.publishedAt.toLocaleDateString()}</Text>
```

### 4. Type Checking
```bash
# Run type checking
pnpm build
```

## Code Quality Workflow

### 1. Linting
```bash
# Lint individual packages
cd apps/web && pnpm lint
cd apps/mobile && pnpm lint

# Lint all packages (from root)
pnpm lint
```

### 2. Formatting
```bash
# Format mobile app (has prettier configured)
cd apps/mobile && pnpm format

# Format web app if needed
cd apps/web && npx prettier --write .
```

### 3. Type Checking
```bash
# Check TypeScript compilation
pnpm build
```

## Git Workflow

### 1. Branch Strategy
```bash
# Create feature branch
git checkout -b feature/new-api-endpoint

# Make changes
# ... development work ...

# Commit changes
git add .
git commit -m "feat: add new user posts endpoint"

# Push branch
git push origin feature/new-api-endpoint
```

### 2. Commit Message Convention
```
feat: add new user posts endpoint
fix: resolve type errors in quest creation
docs: update API documentation
style: format mobile app components
refactor: improve API type definitions
test: add integration tests for new endpoint
chore: update dependencies
```

### 3. Pull Request Process
1. Create pull request from feature branch
2. Ensure all checks pass (build, lint, type check)
3. Request code review
4. Address review feedback
5. Merge to main branch

## Debugging Workflow

### 1. API Issues
```bash
# Check API server logs
cd apps/api && pnpm dev

# Test API endpoints directly
curl http://localhost:3333/health
curl http://localhost:3333/quests
```

### 2. Web App Issues
```bash
# Check browser console for errors
# Check network tab for failed requests
# Check React Query dev tools (if installed)

# Clear browser cache and refresh
```

### 3. Mobile App Issues
```bash
# Check mobile app console logs
# Check Expo development server logs
# Clear Expo cache: expo r -c

# Test on different platforms
# - Web version (quickest)
# - iOS simulator
# - Android emulator
```

### 4. Type Issues
```bash
# Check TypeScript compilation
pnpm build

# Check for circular dependencies
# Verify type exports in shared package

# Restart TypeScript server in IDE
# - VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

## Environment Management

### Development Environment
```bash
# API server runs on localhost:3333
# Web app runs on localhost:3000
# Mobile app runs on localhost:8081 (web version)
```

### Environment Variables
```bash
# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3333

# apps/mobile/app.json (extra section)
{
  "expo": {
    "extra": {
      "apiUrl": "http://localhost:3333"
    }
  }
}
```

### Production Environment
```bash
# Set production API URLs
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Performance Optimization

### 1. Development Performance
```bash
# Use Turbopack for fast development builds
cd apps/web && pnpm dev

# Use watch mode for TypeScript compilation
cd packages/shared && pnpm dev
```

### 2. Build Performance
```bash
# Build specific packages only when needed
pnpm --filter @svq/api build
pnpm --filter @svq/web build
```

### 3. Cache Management
```bash
# Clear turborepo cache
pnpm run clean

# Clear node modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Testing Workflow

### 1. Manual Testing
```bash
# Start all services
pnpm dev

# Test in this order:
# 1. API endpoints with curl
# 2. Web app functionality
# 3. Mobile app functionality
# 4. Cross-platform data sync
```

### 2. Type Safety Testing
```bash
# Verify type compilation
pnpm build

# Test type autocompletion in IDE
# Verify API method signatures
```

### 3. Integration Testing
```bash
# Test cross-platform data sync
# 1. Create quest in web app
# 2. Refresh mobile app
# 3. Verify quest appears in both
# 4. Delete quest in mobile app
# 5. Refresh web app
# 6. Verify quest is gone from both
```

## Deployment Workflow

### 1. API Deployment
```bash
# Build API server
cd apps/api && pnpm build

# Deploy to hosting service
# (e.g., Railway, Render, AWS)
```

### 2. Web App Deployment
```bash
# Build web app
cd apps/web && pnpm build

# Deploy to hosting service
# (e.g., Vercel, Netlify)
```

### 3. Mobile App Deployment
```bash
# Build mobile app
cd apps/mobile && pnpm build:ios
# or
cd apps/mobile && pnpm build:android

# Deploy to app stores
# (App Store, Google Play)
```

## Troubleshooting Common Issues

### 1. Port Conflicts
```bash
# Find process using port
lsof -i :3333  # API server
lsof -i :3000  # Web app

# Kill process
kill -9 <pid>
```

### 2. Dependency Issues
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 3. TypeScript Issues
```bash
# Restart TypeScript server
# In VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"

# Clear TypeScript cache
rm -rf .turbo
```

### 4. Mobile App Issues
```bash
# Clear Expo cache
expo r -c

# Reset iOS simulator
# Simulator → Device → Erase All Content and Settings
```

This development workflow ensures efficient, type-safe development across all packages while maintaining consistency and quality.