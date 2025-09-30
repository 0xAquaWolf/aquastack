import { createAuthClient } from 'better-auth/react'
import { convexClient } from '@convex-dev/better-auth/client/plugins'
import { expoClient } from '@better-auth/expo/client'
import Constants from 'expo-constants'
import * as SecureStore from 'expo-secure-store'

const DEFAULT_LOCAL_SITE_URL = 'http://localhost:3000'

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

function hasPath(url: string) {
  try {
    return new URL(url).pathname !== '/'
  }
  catch {
    return false
  }
}

function firstNonEmpty(...values: Array<string | undefined | null>) {
  for (const value of values) {
    const trimmed = value?.trim()
    if (trimmed) {
      return trimmed
    }
  }

  return undefined
}

function resolveSiteUrl() {
  const candidate = firstNonEmpty(
    process.env.SITE_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.CONVEX_SITE_URL,
    process.env.NEXT_PUBLIC_CONVEX_SITE_URL,
    process.env.EXPO_PUBLIC_CONVEX_SITE_URL,
  )

  if (!candidate) {
    return DEFAULT_LOCAL_SITE_URL
  }

  return trimTrailingSlash(candidate)
}

function resolveBetterAuthBaseUrl(path = '/api/auth') {
  const direct = firstNonEmpty(
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    process.env.EXPO_PUBLIC_BETTER_AUTH_URL,
  )

  const base = trimTrailingSlash(direct || resolveSiteUrl())
  if (!path.startsWith('/')) {
    path = `/${path}`
  }

  if (hasPath(base)) {
    return base
  }

  return `${base}${path}`
}

function getConfigScheme() {
  const value = Constants.expoConfig?.scheme
  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

function resolveExpoScheme() {
  const scheme = firstNonEmpty(
    process.env.EXPO_APP_SCHEME,
    process.env.EXPO_PUBLIC_APP_SCHEME,
  )

  if (scheme) {
    return scheme
  }

  const configScheme = getConfigScheme()
  if (configScheme) {
    return configScheme
  }

  if (process.env.NODE_ENV === 'development') {
    return 'exp'
  }

  return undefined
}

function hasSecureStoreSyncApis() {
  return (
    typeof (SecureStore as any).getItem === 'function'
    && typeof (SecureStore as any).setItem === 'function'
  )
}

const resolvedScheme = resolveExpoScheme() || 'exp'
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
