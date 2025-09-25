# Troubleshooting Guide

This document provides solutions to common issues when working with the Elysia integration in the SelfVision Quest monorepo.

## Quick Reference

| Issue | Solution | Command |
|-------|----------|---------|
| Port conflicts | Kill processes on ports 3333, 3000, 8081 | `lsof -i :3333` |
| TypeScript errors | Clean install and rebuild | `rm -rf node_modules && pnpm install` |
| Mobile app won't start | Clear Expo cache | `expo r -c` |
| CORS errors | Ensure API server is running | Check `localhost:3333` |
| Build failures | Check TypeScript compilation | `pnpm build` |
| Type errors | Verify type exports | Check shared package |

## Common Issues and Solutions

### 1. Port Conflicts

**Symptoms:**
- Error messages like "Port 3333 is already in use"
- Services failing to start

**Solutions:**

```bash
# Find processes using ports
lsof -i :3333  # API server
lsof -i :3000  # Web app
lsof -i :8081  # Mobile app (Expo)

# Kill specific processes
kill -9 <pid>

# Kill all Node.js processes
pkill -f "node"

# Alternative: Use different ports
# For API server (edit apps/api/src/index.ts)
.listen(3334)

# For web app (create .env.local)
NEXT_PUBLIC_API_URL=http://localhost:3334
```

### 2. TypeScript Compilation Errors

**Symptoms:**
- `pnpm build` fails with TypeScript errors
- Type "property does not exist on type" errors
- Cannot find module errors

**Solutions:**

```bash
# Clean install and rebuild
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build

# Check for circular dependencies
# Look for import cycles between packages

# Verify type exports
# Check packages/shared/index.ts for proper exports

# Restart TypeScript server in IDE
# VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"

# Clear turborepo cache
rm -rf .turbo
pnpm build
```

**Common Type Issues:**

```typescript
// ✅ Correct usage
import type { Quest } from '@svq/shared' // Add this import

// ❌ Missing import
import { Quest } from '@svq/shared' // Should be Quest type

// ❌ Wrong type usage
const quest: string = getQuest()
const quest: Quest = getQuest()
```

### 3. Mobile App Issues

**Symptoms:**
- Mobile app won't start in Expo
- White screen or errors in mobile app
- Metro bundler issues

**Solutions:**

```bash
# Clear Expo cache
expo r -c

# Clear npm cache in mobile app
cd apps/mobile
rm -rf node_modules package-lock.json
npm install
# Or use pnpm if configured
rm -rf node_modules
pnpm install

# Reset simulators
# iOS: Simulator → Device → Erase All Content and Settings
# Android: AVD Manager → Wipe Data

# Check for incompatible dependencies
npm outdated
npm update
```

**Expo Development Server Issues:**

```bash
# Start fresh Expo session
cd apps/mobile
expo start --clear

# Try different platform
expo start --web    # Web version
expo start --ios    # iOS simulator
expo start --android # Android emulator
```

### 4. CORS Issues

**Symptoms:**
- API calls blocked by browser
- "No 'Access-Control-Allow-Origin' header" errors
- Network requests failing in browser console

**Solutions:**

```bash
# Ensure API server is running
cd apps/api && pnpm dev

# Check CORS configuration
# Verify apps/api/src/index.ts has:
.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}))

# Test CORS headers
curl -H "Origin: http://localhost:3000" -I http://localhost:3333/quests
```

**Frontend Solutions:**

```javascript
// In apps/web/src/lib/api.ts
// Ensure correct API URL
export const apiClient = createApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'
);

// In apps/mobile/store/api.ts
// Ensure correct API URL
const apiClient = createApiClient(
  Constants?.expoConfig?.extra?.apiUrl || 'http://localhost:3333'
);
```

### 5. API Server Issues

**Symptoms:**
- API server won't start
- "Cannot find module" errors
- Port already in use errors

**Solutions:**

```bash
# Check dependencies
cd apps/api
npm install
# or
pnpm install

# Check for syntax errors
pnpm build

# Start with debugging
pnpm dev --inspect-brk

# Check logs for specific errors
```

**Common API Issues:**

```typescript
// ❌ Missing import
import { Elysia, t } from 'elysia' // Add this

// ❌ Incorrect schema definition
const QuestSchema = t.Object({
  status: t.Enum(['pending', 'in_progress', 'completed']), // Use Union instead
})

// ✅ Correct schema definition
const QuestSchema = t.Object({
  status: t.Union([
    t.Literal('pending'),
    t.Literal('in_progress'),
    t.Literal('completed'),
  ]),
})
```

### 6. React Query Issues (Web App)

**Symptoms:**
- Data not loading
- Stale data being displayed
- Mutation issues

**Solutions:**

```bash
# Check React Query dev tools
# Install if not present:
npm install @tanstack/react-query-devtools

# Add to app:
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// In providers.tsx: <ReactQueryDevtools initialIsOpen={false} />
```

**Common React Query Issues:**

```typescript
// ❌ Incorrect query key usage
useQuery(['quest'], () => apiClient.quests.get()) // Should be 'quests'

// ❌ Missing query function
useQuery(['quests']) // Missing queryFn

// ✅ Correct usage
useQuery({
  queryKey: ['quests'],
  queryFn: async () => {
    const response = await apiClient.quests.get()
    return response.data
  },
})
```

### 7. Zustand Issues (Mobile App)

**Symptoms:**
- State not updating
- Actions not working
- Type errors in store

**Solutions:**

```typescript
import type { CreateQuest, Quest, UpdateQuest, User } from '@svq/shared'

// ❌ Incorrect store setup
import { create } from 'zustand'
// ✅ Correct store setup
import { create } from 'zustand'

// ❌ Missing async/await
createQuest: (quest: CreateQuest) => {
  apiClient.quests.post(quest) // Missing await
}

// ✅ Correct async/await
createQuest: async (quest: CreateQuest) => {
  try {
    const response = await apiClient.quests.post(quest)
    set(state => ({
      quests: [...state.quests, response.data],
      loading: false,
    }))
  }
  catch {
    set({ error: 'Failed to create quest', loading: false })
  }
}
```

### 8. Build and Deployment Issues

**Symptoms:**
- Production builds failing
- Missing dependencies in production
- Environment variables not working

**Solutions:**

```bash
# Check build process
cd apps/web && pnpm build
cd apps/mobile && pnpm build
cd apps/api && pnpm build

# Check environment variables
# apps/web/.env.production
NEXT_PUBLIC_API_URL=https://your-api-url.com

# apps/mobile/app.json
{
  "expo": {
    "extra": {
      "apiUrl": "https://your-api-url.com"
    }
  }
}

# Check deployment logs for specific errors
```

### 9. Eden Treaty Issues

**Symptoms:**
- Type safety not working
- API methods not showing in autocompletion
- Type errors with API calls

**Solutions:**

```typescript
import type { App } from '@svq/api'
// ❌ Missing type import
import { edenTreaty } from '@elysiajs/eden'

// ✅ Correct type import
import { edenTreaty } from '@elysiajs/eden'
import App from '@svq/api' // Should be type import

// ❌ Incorrect client usage
const api = edenTreaty<App>('http://localhost:3333')
api.get('/quests') // Should use api.quests.get()

// ✅ Correct client usage
const api = edenTreaty<App>('http://localhost:3333')
api.quests.get()
```

### 10. Mobile App Build Issues

**Symptoms:**
- iOS/Android builds failing
- Code signing issues
- Missing native dependencies

**Solutions:**

```bash
# Check Expo configuration
cd apps/mobile
expo diagnostics

# Update Expo SDK if needed
expo update

# Check for incompatible packages
npm install --save expo@latest

# Clear native build cache
cd ios && pod install && cd ..
cd android && ./gradlew clean && cd ..

# Try eas build for production
eas build --platform all
```

## Debugging Tools and Techniques

### 1. API Debugging

```bash
# Test API endpoints
curl http://localhost:3333/health
curl http://localhost:3333/quests
curl -X POST http://localhost:3333/quests -H "Content-Type: application/json" -d '{"title":"test","description":"test"}'

# Use Postman or Insomnia for API testing
# Set up request collections for different endpoints
```

### 2. Web App Debugging

```javascript
// Browser console debugging
console.log('API Response:', response)
console.log('Error:', error)

// React DevTools
// Check component state and props
// Monitor React Query cache

// Network tab
// Check API request/response
// Verify CORS headers
// Check response status codes
```

### 3. Mobile App Debugging

```javascript
// React Native debugging
console.log('Mobile API Response:', response);
console.log('Mobile Error:', error);

// Expo development tools
# Open debugger: Ctrl+M (Android) or Cmd+D (iOS)
# Check console logs
# Monitor network requests

# Flipper for advanced debugging
# React Native Debugger
```

### 4. Type Safety Debugging

```typescript
// TypeScript debugging
// Use VS Code Go to Definition (F12)
// Check type annotations with hover
// Use TypeScript playground for complex types

// Type checking in IDE
// Look for red squiggles
// Check Problems panel in VS Code
// Use TypeScript compiler directly: tsc --noEmit
```

## Performance Issues

### 1. Slow Development Server

```bash
# Use Turbopack for faster builds
cd apps/web && pnpm dev --turbo

# Clear unnecessary caches
rm -rf .next
rm -rf .turbo
rm -rf node_modules/.cache
```

### 2. Memory Issues

```bash
# Check memory usage
npm install -g memory-usage
memory-usage

# Restart development servers
# Kill and restart processes if memory is high
```

### 3. Network Performance

```bash
# Check API response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3333/quests

# Monitor network requests in browser dev tools
# Look for large payloads or unnecessary requests
```

## Getting Help

### 1. Error Message Analysis

```bash
# Extract key information from error messages
# Look for:
# - File names and line numbers
# - Type names and property names
# - Stack traces
# - Network status codes

# Search for specific errors online
# Include technology names: "Elysia", "Eden Treaty", "React Query"
```

### 2. Community Resources

- ElysiaJS Discord: https://discord.gg/elysia
- React Query GitHub: https://github.com/TanStack/query
- Expo Forums: https://forums.expo.dev
- Stack Overflow with specific tags

### 3. Documentation References

- ElysiaJS: https://elysiajs.com
- Eden Treaty: https://github.com/elysiajs/eden
- React Query: https://tanstack.com/query/latest
- Expo: https://docs.expo.dev

## Prevention Tips

### 1. Development Practices

- Run `pnpm build` frequently to catch type errors early
- Test API endpoints with curl before using in frontend
- Keep dependencies updated but stable
- Use consistent import paths and type exports

### 2. Code Quality

- Use linting and formatting tools
- Write tests for critical functionality
- Document complex type definitions
- Use meaningful variable and function names

### 3. Environment Management

- Use environment variables for configuration
- Keep development and production environments separate
- Document environment setup requirements
- Use version control for configuration files

This troubleshooting guide should help you resolve most common issues when working with the Elysia integration. Remember to check the logs, use debugging tools, and work systematically through potential causes.
