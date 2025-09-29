import '../global.css'

import { StrictMode } from 'react'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { Stack } from 'expo-router'
import { authClient } from '../lib/auth-client'
import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
}

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL! as string, {
  unsavedChangesWarning: false,
  // Optionally pause queries until the user is authenticated
  expectAuth: true,
})

export default function RootLayout() {
  return (
    // @ts-ignore
    <StrictMode>
      <ConvexProvider client={convex}>
        <ConvexBetterAuthProvider client={convex} authClient={authClient}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </ConvexBetterAuthProvider>
      </ConvexProvider>
    </StrictMode>
  )
}
