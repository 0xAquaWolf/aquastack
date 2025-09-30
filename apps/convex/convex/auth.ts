import type { GenericCtx } from '@convex-dev/better-auth'
import type { DataModel } from './_generated/dataModel'
import { expo } from '@better-auth/expo'
import { createClient } from '@convex-dev/better-auth'
import { convex } from '@convex-dev/better-auth/plugins'
import { betterAuth } from 'better-auth'
import { components } from './_generated/api'
import { query } from './_generated/server'

const DEFAULT_LOCAL_SITE_URL = 'http://localhost:3000'

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

function resolveSiteUrl() {
  const candidate
    = process.env.SITE_URL?.trim()
    || process.env.NEXT_PUBLIC_SITE_URL?.trim()
    || process.env.CONVEX_SITE_URL?.trim()
    || process.env.NEXT_PUBLIC_CONVEX_SITE_URL?.trim()
    || process.env.EXPO_PUBLIC_CONVEX_SITE_URL?.trim()

  if (!candidate) {
    return DEFAULT_LOCAL_SITE_URL
  }

  return trimTrailingSlash(candidate)
}

function resolveExpoScheme() {
  const scheme
    = process.env.EXPO_APP_SCHEME?.trim()
    || process.env.EXPO_PUBLIC_APP_SCHEME?.trim()

  if (scheme) {
    return scheme
  }

  if (process.env.NODE_ENV === 'development') {
    return 'exp'
  }

  return undefined
}

function resolveTrustedOrigins() {
  const scheme = resolveExpoScheme()
  if (!scheme) {
    return []
  }

  const origin = scheme.endsWith('://') ? scheme : `${scheme}://`
  return [origin]
}

const siteUrl = resolveSiteUrl()
const trustedOrigins = resolveTrustedOrigins()
const isProduction = process.env.NODE_ENV === 'production'

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth)

export function createAuth(ctx: GenericCtx<DataModel>, { optionsOnly } = { optionsOnly: false }) {
  return betterAuth({
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    logger: {
      disabled: optionsOnly,
    },
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30,
      updateAge: 60 * 60 * 12,
      storeSessionInDatabase: true,
    },
    advanced: {
      useSecureCookies: isProduction,
      cookieAttributes: {
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
      },
    },
    trustedOrigins,
    plugins: [
      // The Convex plugin is required for Convex compatibility
      convex(),
      expo({
        overrideOrigin: true,
      }),
    ],
  })
}

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx)
  },
})
