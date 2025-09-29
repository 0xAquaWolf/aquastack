import type { GenericCtx } from '@convex-dev/better-auth'
import type { DataModel } from './_generated/dataModel'
import { createClient } from '@convex-dev/better-auth'
import { convex } from '@convex-dev/better-auth/plugins'
import { expo } from '@better-auth/expo'
import { betterAuth } from 'better-auth'
import { resolveSiteUrl, resolveTrustedOrigins } from '@svq/shared'
import { components } from './_generated/api'
import { query } from './_generated/server'

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
