# Mobile App Implementation

This document details the Expo mobile app implementation in `apps/mobile/`.

## Overview

The mobile app is built with Expo and uses Zustand for state management with full type safety through Eden Treaty.

## Features

- Full CRUD operations for quests
- Native mobile UI with React Native
- State management with Zustand
- Type-safe API calls with Eden Treaty
- Loading states and error handling
- Responsive design with NativeWind
- Cross-platform support (iOS, Android, Web)

## Files Structure

```
apps/mobile/
├── app/
│   ├── (tabs)/
│   │   └── index.tsx         # Main tab with quest management
│   ├── _layout.tsx            # Root navigation layout
│   └── +html.tsx              # HTML entry point
├── store/
│   ├── api.ts                 # Zustand store for API operations
│   └── index.ts               # Store exports
├── components/                 # Reusable UI components
├── assets/                    # App assets
├── package.json               # Dependencies and scripts
└── app.json                   # Expo configuration
```

## Implementation Details

### Zustand API Store (`store/api.ts`)

```typescript
import type { CreateQuest, Quest, UpdateQuest, User } from '@svq/shared'
import { createApiClient } from '@svq/shared'
import Constants from 'expo-constants'
import { create } from 'zustand'

interface ApiState {
  // Data
  users: User[]
  quests: Quest[]
  loading: boolean
  error: string | null

  // Actions
  fetchUsers: () => Promise<void>
  fetchQuests: () => Promise<void>
  createQuest: (quest: CreateQuest) => Promise<void>
  updateQuest: (id: string, quest: UpdateQuest) => Promise<void>
  deleteQuest: (id: string) => Promise<void>
  clearError: () => void
}

const apiClient = createApiClient(
  Constants?.expoConfig?.extra?.apiUrl || 'http://localhost:3333'
)

export const useApiStore = create<ApiState>((set, get) => ({
  // Initial state
  users: [],
  quests: [],
  loading: false,
  error: null,

  // Actions
  fetchQuests: async () => {
    set({ loading: true, error: null })
    try {
      const response = await apiClient.quests.get()
      set({ quests: response.data || [], loading: false })
    }
    catch {
      set({ error: 'Failed to fetch quests', loading: false })
    }
  },

  createQuest: async (quest: CreateQuest) => {
    set({ loading: true, error: null })
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
  },

  deleteQuest: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await apiClient.quests[id].delete()
      set(state => ({
        quests: state.quests.filter(q => q.id !== id),
        loading: false,
      }))
    }
    catch {
      set({ error: 'Failed to delete quest', loading: false })
    }
  },

  clearError: () => set({ error: null }),
}))
```

### Main Tab Screen (`app/(tabs)/index.tsx`)

```typescript
import { Stack } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useApiStore } from '~/store/api';
import type { CreateQuest } from '@svq/shared';

export default function Home() {
  const {
    quests,
    loading,
    error,
    fetchQuests,
    createQuest,
    deleteQuest,
    clearError
  } = useApiStore();

  const [newQuest, setNewQuest] = useState<CreateQuest>({ title: '', description: '' });

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  }, [error, clearError]);

  const handleCreateQuest = () => {
    if (newQuest.title && newQuest.description) {
      createQuest(newQuest);
      setNewQuest({ title: '', description: '' });
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Quests' }} />
      <View className="flex-1 bg-gray-50 p-4">
        <ScrollView className="flex-1">
          {/* Create Quest Form */}
          <View className="mb-4 rounded-lg bg-white p-4 shadow-sm">
            <Text className="mb-3 text-lg font-semibold">Create New Quest</Text>
            <TextInput
              placeholder="Quest Title"
              className="mb-2 rounded-lg border border-gray-300 p-2"
              value={newQuest.title}
              onChangeText={(text) => setNewQuest({ ...newQuest, title: text })}
            />
            <TextInput
              placeholder="Quest Description"
              className="mb-3 h-20 rounded-lg border border-gray-300 p-2"
              multiline
              value={newQuest.description}
              onChangeText={(text) => setNewQuest({ ...newQuest, description: text })}
            />
            <TouchableOpacity
              onPress={handleCreateQuest}
              className="rounded-lg bg-blue-500 p-3"
              disabled={loading}>
              <Text className="text-center font-semibold text-white">
                {loading ? 'Creating...' : 'Create Quest'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quests List */}
          <View className="mb-4">
            <Text className="mb-3 text-lg font-semibold">Your Quests</Text>
            {quests.map((quest) => (
              <View key={quest.id} className="mb-3 rounded-lg bg-white p-4 shadow-sm">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="mb-1 text-base font-semibold">{quest.title}</Text>
                    <Text className="mb-2 text-sm text-gray-600">{quest.description}</Text>
                    <View className={`self-start rounded px-2 py-1 ${
                      quest.status === 'completed' ? 'bg-green-200' :
                      quest.status === 'in_progress' ? 'bg-yellow-200' : 'bg-gray-200'
                    }`}>
                      <Text className={`text-xs ${
                        quest.status === 'completed' ? 'text-green-800' :
                        quest.status === 'in_progress' ? 'text-yellow-800' : 'text-gray-800'
                      }`}>
                        {quest.status.replace('_', ' ')}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert('Delete Quest', 'Are you sure you want to delete this quest?', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', onPress: () => deleteQuest(quest.id), style: 'destructive' }
                      ]);
                    }}
                    className="rounded-lg bg-red-500 px-3 py-2">
                    <Text className="text-sm text-white">Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
}
```

## Dependencies

```json
{
  "dependencies": {
    "@expo/vector-icons": "^14.1.0",
    "@react-navigation/native": "^7.1.17",
    "@svq/api": "workspace:*",
    "@svq/shared": "workspace:*",
    "expo": "~53.0.6",
    "nativewind": "latest",
    "zustand": "^4.5.7"
  }
}
```

## Zustand Configuration

### Store Features
- **Simple State Management**: Minimal boilerplate
- **Type Safety**: Full TypeScript support
- **Actions**: Async actions with loading states
- **Error Handling**: Centralized error management
- **Persistence**: Could be added for offline support

### State Structure
```typescript
interface ApiState {
  users: User[]
  quests: Quest[]
  loading: boolean
  error: string | null
  // ... actions
}
```

### Actions Pattern
- **Fetch Operations**: Load data from API
- **Create Operations**: Add new items
- **Update Operations**: Modify existing items
- **Delete Operations**: Remove items
- **Error Handling**: Centralized error management

## NativeWind Styling

### CSS Classes
- **Responsive**: Works across different screen sizes
- **Utility-First**: Similar to Tailwind CSS
- **Native Performance**: Compiled to native styles
- **Theme Support**: Consistent design system

### Common Classes
- `flex-1` - Take available space
- `bg-gray-50` - Background color
- `rounded-lg` - Border radius
- `shadow-sm` - Drop shadow
- `p-4` - Padding

## Features

### Quest Management
1. **Create Quest**: Native form with validation
2. **List Quests**: Scrollable list with status badges
3. **Delete Quest**: Confirmation dialog with native alert
4. **Status Display**: Color-coded status indicators

### User Experience
1. **Loading States**: Native loading indicators
2. **Error Handling**: Native alert dialogs
3. **Scrollable Lists**: Native scroll performance
4. **Touch Interactions**: Native touch feedback

### Cross-Platform Support
1. **iOS**: Native iOS components and styling
2. **Android**: Native Android components and styling
3. **Web**: Progressive Web App support
4. **Responsive**: Adapts to different screen sizes

## Development

### Starting the Development Server
```bash
cd apps/mobile
pnpm dev
```

### Running on Different Platforms

#### Web Version
```bash
pnpm dev
# Then press 'w' in the terminal
```

#### iOS Simulator
```bash
pnpm ios
# Requires Xcode to be installed
```

#### Android Emulator
```bash
pnpm android
# Requires Android Studio to be installed
```

### Building for Production
```bash
pnpm build
```

### Linting and Formatting
```bash
pnpm lint      # Check for issues
pnpm format    # Fix formatting issues
```

## Environment Variables

### App Configuration
Configure API URL in `app.json` or use environment variables:

```javascript
// app.json
{
  "expo": {
    "extra": {
      "apiUrl": "http://localhost:3333"
    }
  }
}
```

## Testing

### Manual Testing
1. Start the development server
2. Choose your target platform (web, iOS, Android)
3. Create a new quest using the form
4. Verify it appears in the list
5. Delete a quest using the confirmation dialog
6. Check console logs for API calls

### Cross-Platform Testing
1. Test on web version first (quickest)
2. Test on iOS simulator
3. Test on Android emulator
4. Test on physical devices if available

### Type Safety Testing
1. Try accessing non-existent store properties
2. Check autocompletion in IDE
3. Modify API types and verify compilation errors
4. Run `pnpm lint` to check for issues

## Performance Considerations

1. **State Management**: Zustand is lightweight and performant
2. **Native Components**: Uses native React Native components
3. **Styling**: NativeWind compiles to native styles
4. **API Calls**: Efficient network requests with proper error handling

## Error Handling

### Network Errors
- Automatic retry logic could be added
- Offline support could be implemented
- Error messages are user-friendly

### User Experience
- Loading states during API calls
- Native alert dialogs for errors
- Confirmation dialogs for destructive actions
- Visual feedback for user actions
