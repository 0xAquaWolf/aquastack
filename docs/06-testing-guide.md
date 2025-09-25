# Testing Guide

This document provides comprehensive testing instructions for the Elysia integration across the SelfVision Quest monorepo.

## Testing Overview

The testing strategy covers:
- API server endpoint testing
- Web app functionality testing
- Mobile app cross-platform testing
- End-to-end integration testing
- Type safety verification

## Prerequisites

Before testing, ensure all dependencies are installed:

```bash
# Install all dependencies
pnpm install
```

## 1. API Server Testing

### Starting the API Server

```bash
cd apps/api
pnpm dev
```

The server should start on `http://localhost:3333` with the message:
```
🦊 Elysia is running at localhost:3333
```

### Testing API Endpoints

#### Health Check
```bash
curl http://localhost:3333/
```
Expected response:
```json
"SelfVision Quest API is running"
```

#### Get All Quests
```bash
curl http://localhost:3333/quests
```
Expected response:
```json
[
  {
    "id": "1",
    "title": "Complete API Integration",
    "description": "Integrate Elysia API with web and mobile apps",
    "status": "in_progress",
    "userId": "1",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "2",
    "title": "Set up Type Safety",
    "description": "Ensure end-to-end type safety with Eden Treaty",
    "status": "pending",
    "userId": "1",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Create New Quest
```bash
curl -X POST http://localhost:3333/quests \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Quest","description":"Testing the API integration"}'
```
Expected response:
```json
{
  "id": "generated-id",
  "title": "Test Quest",
  "description": "Testing the API integration",
  "status": "pending",
  "userId": "1",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Delete Quest
```bash
curl -X DELETE http://localhost:3333/quests/{quest-id}
```
Expected response:
```json
{
  "success": true,
  "message": "Quest {quest-id} deleted"
}
```

### CORS Testing

Test that CORS headers are properly set:

```bash
curl -H "Origin: http://localhost:3000" -I http://localhost:3333/quests
```

Should include CORS headers like:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

## 2. Web App Testing

### Starting the Web App

```bash
# In a new terminal
cd apps/web
pnpm dev
```

The app should start on `http://localhost:3000`.

### Manual Testing Steps

1. **Initial Load**
   - Navigate to `http://localhost:3000`
   - Should see "SelfVision Quest" title
   - Should see sample quests loaded from API
   - Loading state should be brief

2. **Create Quest**
   - Fill in "Quest Title" and "Quest Description" fields
   - Click "Create Quest" button
   - New quest should appear in the list below
   - Form should reset after successful creation

3. **Delete Quest**
   - Click "Delete" button on any quest
   - Quest should be removed from the list
   - No confirmation needed in web app (could be added)

4. **Error Handling**
   - Stop the API server
   - Try to create a quest
   - Should see error message
   - Restart API server
   - Should recover automatically

### Browser Dev Tools Testing

1. **Network Tab**
   - Open Chrome Dev Tools (F12)
   - Go to Network tab
   - Create/delete quests
   - Verify API calls are made to correct endpoints
   - Check response codes (should be 200 for success)

2. **Console Testing**
   - Check for any JavaScript errors
   - Verify React Query is working correctly
   - Check for any TypeScript compilation errors

3. **Type Safety Testing**
   - Open any TypeScript file in IDE
   - Try accessing non-existent properties
   - Should show TypeScript errors
   - Check autocompletion for API methods

## 3. Mobile App Testing

### Starting the Mobile App

```bash
# In a new terminal
cd apps/mobile
pnpm dev
```

### Testing Options

#### Web Version (Quickest)
```bash
# After starting dev server, press 'w'
```
Opens in browser at `http://localhost:8081`

#### iOS Simulator
```bash
# Requires Xcode
pnpm ios
```

#### Android Emulator
```bash
# Requires Android Studio
pnpm android
```

#### Physical Device
1. Install Expo Go app on your phone
2. Scan QR code from terminal
3. Open in Expo Go

### Manual Testing Steps

1. **Initial Load**
   - App should open to "Quests" tab
   - Should show loading indicator briefly
   - Should display sample quests from API

2. **Create Quest**
   - Fill in title and description fields
   - Tap "Create Quest" button
   - Should show loading state
   - New quest should appear in list
   - Form fields should reset

3. **Delete Quest**
   - Tap "Delete" button on any quest
   - Should show confirmation dialog
   - Tap "Delete" to confirm
   - Quest should be removed from list
   - Tap "Cancel" to abort

4. **Error States**
   - Stop API server
   - Try to create quest
   - Should show error alert
   - Restart API server
   - Should recover automatically

### Cross-Platform Testing

1. **Web Version**
   - Test in Chrome/Safari
   - Verify responsive design
   - Check touch interactions

2. **iOS Simulator**
   - Test native iOS components
   - Verify navigation gestures
   - Check orientation changes

3. **Android Emulator**
   - Test native Android components
   - Verify back button behavior
   - Check different screen sizes

## 4. End-to-End Integration Testing

### Cross-Platform Data Sync

1. **Create in Web, View in Mobile**
   - Create quest in web app (`http://localhost:3000`)
   - Refresh mobile app
   - Verify quest appears in mobile app

2. **Create in Mobile, View in Web**
   - Create quest in mobile app
   - Refresh web app
   - Verify quest appears in web app

3. **Delete in Either Platform**
   - Delete quest in web app
   - Refresh mobile app
   - Verify quest is gone from both
   - Repeat with mobile app deletion

### Consistency Testing

1. **Type Consistency**
   - Verify same quest structure in both apps
   - Check status display consistency
   - Verify timestamp formats

2. **Behavioral Consistency**
   - Test create/delete workflows in both apps
   - Verify error handling consistency
   - Check loading state behavior

## 5. Type Safety Testing

### TypeScript Compilation

```bash
# Test all packages
cd /Users/0xaquawolf/Projects/selfvision-quest
pnpm build
```

Should succeed without errors.

### Type Checking

```bash
# Check individual packages
cd apps/api && pnpm build
cd apps/web && pnpm build
cd apps/mobile && pnpm lint
```

### IDE Type Safety Verification

1. **API Types in Web App**
   - Open `apps/web/src/hooks/useApi.ts`
   - Try `apiClient.nonexistentMethod`
   - Should show TypeScript error

2. **API Types in Mobile App**
   - Open `apps/mobile/store/api.ts`
   - Try `apiClient.nonexistentMethod`
   - Should show TypeScript error

3. **Type Propagation**
   - Modify API response structure in `apps/api/src/index.ts`
   - Should break type checking in both frontend apps
   - Verify compilation fails until fixed

## 6. Performance Testing

### Web App Performance

1. **Loading Speed**
   - Check initial load time
   - Verify React Query caching works
   - Test navigation between pages

2. **API Performance**
   - Monitor network requests in dev tools
   - Verify response times are reasonable
   - Check for unnecessary requests

### Mobile App Performance

1. **Native Performance**
   - Test scrolling performance
   - Verify smooth animations
   - Check memory usage

2. **Bundle Size**
   - Check JavaScript bundle size
   - Verify tree-shaking is working
   - Monitor startup time

## 7. Common Issues and Solutions

### Port Conflicts
**Issue**: Port 3333 already in use
**Solution**:
```bash
# Find process using port 3333
lsof -i :3333
# Kill process or use different port
```

### CORS Issues
**Issue**: API calls blocked by CORS
**Solution**: Ensure API server is running and CORS is configured correctly

### Type Errors
**Issue**: TypeScript compilation fails
**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
pnpm install
```

### Mobile App Issues
**Issue**: Mobile app won't start
**Solution**:
```bash
# Clear Expo cache
expo r -c
```

## 8. Test Automation Scripts

### Setup Test Environment
```bash
# Create test script
cat > test-integration.sh << 'EOF'
#!/bin/bash

echo "🧪 Starting Integration Tests"

# Start API server in background
cd apps/api && pnpm dev &
API_PID=$!

# Wait for API to start
sleep 3

# Test API endpoints
echo "📡 Testing API endpoints..."
curl -f http://localhost:3333/ || exit 1
curl -f http://localhost:3333/quests || exit 1

echo "✅ API tests passed"

# Cleanup
kill $API_PID
echo "🎉 Integration tests completed"
EOF

chmod +x test-integration.sh
```

### Run Integration Tests
```bash
./test-integration.sh
```

## Testing Checklist

- [ ] API server starts successfully
- [ ] All API endpoints return correct responses
- [ ] CORS headers are properly configured
- [ ] Web app loads and displays quests
- [ ] Web app can create and delete quests
- [ ] Mobile app loads and displays quests
- [ ] Mobile app can create and delete quests
- [ ] Cross-platform data synchronization works
- [ ] TypeScript compilation succeeds for all packages
- [ ] Linting passes for all packages
- [ ] Type safety is maintained across all platforms
- [ ] Error handling works correctly
- [ ] Loading states are displayed properly

This comprehensive testing guide ensures that all aspects of the Elysia integration work correctly and maintain type safety across the entire application.
