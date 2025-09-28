import '../global.css'

import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { Stack } from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
}

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
})

export default function RootLayout() {
  return (
    // @ts-ignore
    <ConvexProvider client={convex}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ConvexProvider>
  )
}
