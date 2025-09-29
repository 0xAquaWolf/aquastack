import { createAuthClient } from 'better-auth/react'
import { convexClient } from '@convex-dev/better-auth/client/plugins'
import { expoClient } from '@better-auth/expo/client'
import { resolveBetterAuthBaseUrl, resolveExpoScheme } from '@svq/shared'
import Constants from 'expo-constants'
import * as SecureStore from 'expo-secure-store'

function getConfigScheme() {
  const value = Constants.expoConfig?.scheme
  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

function hasSecureStoreSyncApis() {
  return (
    typeof (SecureStore as any).getItem === 'function'
    && typeof (SecureStore as any).setItem === 'function'
  )
}

const resolvedScheme = resolveExpoScheme() || getConfigScheme() || 'exp'
const storagePrefix = resolvedScheme || 'svq'

const hasSyncSecureStore = hasSecureStoreSyncApis()

const storage = hasSyncSecureStore
  ? {
      getItem: (key: string) => ((SecureStore as any).getItem(key) as string | null),
      setItem: (key: string, value: string) => {
        (SecureStore as any).setItem(key, value)
      },
    }
  : {
      getItem: (key: string) => {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key)
        }

        return null
      },
      setItem: (key: string, value: string) => {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value)
        }
      },
    }

export const authClient = createAuthClient({
  baseURL: resolveBetterAuthBaseUrl(),
  plugins: [
    expoClient({
      scheme: resolvedScheme,
      storagePrefix,
      storage,
    }),
    convexClient(),
  ],
})
