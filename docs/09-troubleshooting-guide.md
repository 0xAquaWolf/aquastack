# Troubleshooting Guide

This guide highlights common issues encountered while working with the Convex + Better Auth stack in SelfVision Quest, along with quick fixes and diagnostic tips.

## Quick Reference

| Issue | Fast Fix | Command / Action |
| --- | --- | --- |
| Convex types stale | Regenerate types | `pnpm --filter @svq/convex dev` or `pnpm build` |
| Clients can’t fetch data | Confirm Convex URL + dev server | Check `NEXT_PUBLIC_CONVEX_URL`, `EXPO_PUBLIC_CONVEX_URL`, ensure Convex dev server is running |
| Expo stuck loading | Clear Metro cache | `expo r -c` |
| Lint/build failures | Clean install | `rm -rf node_modules pnpm-lock.yaml && pnpm install` |
| Port already in use | Kill offending process | `lsof -i :3000` / `lsof -i :8081` then `kill -9 <pid>` |

## Convex & Type Generation

### Symptoms
- TypeScript errors referencing `convex/_generated`
- Imports like `api.tasks.get` resolve to `any`
- `Doc<"table">` results in `never`

### Solutions
```bash
# Ensure Convex dev server is running
pnpm --filter @svq/convex dev

# Or run a full build to regenerate types
pnpm build

# If schema files moved, delete stale outputs then rebuild
rm -rf apps/convex/convex/_generated
pnpm --filter @svq/convex dev
```

### Tips
- Commit `_generated` files so collaborators have the latest types
- Use `import type` when consuming `Doc` or `Id` to avoid circular runtime dependencies

## Convex Connectivity

### Symptoms
- `useQuery` returns `undefined` forever
- `convex run` commands fail with `FetchError`
- Better Auth helper returns `null` unexpectedly

### Checklist
1. Confirm the Convex dev server is running locally (`pnpm --filter @svq/convex dev`)
2. Verify environment variables:
   - `apps/web/.env.local`: `NEXT_PUBLIC_CONVEX_URL`
   - `apps/mobile` Expo config: `EXPO_PUBLIC_CONVEX_URL`
3. If targeting a deployed instance, ensure you copied the deployment URL from the Convex dashboard
4. For auth helpers, run commands via the dashboard or with an authenticated session; anonymous calls return `null`

## Better Auth Integration

### Symptoms
- Login callbacks fail
- `auth:getCurrentUser` always `null`
- Convex logs mention missing `SITE_URL`

### Resolutions
- Set `SITE_URL` (and other Better Auth secrets) in Convex environment variables (`npx convex env set SITE_URL <url>`)
- Ensure `apps/convex/convex/auth.config.ts` exports the correct domain configuration
- When testing locally, use the same origin in both the web app and Convex configuration to avoid cookie issues

## Expo / React Native Issues

### Common Fixes
```bash
expo r -c                     # Clear Metro cache
pnpm --filter @svq/mobile dev # Restart dev server

# If native builds break
expo prebuild --clean
cd ios && pod install && cd ..
cd android && ./gradlew clean && cd ..
```

### Tips
- Keep the Expo CLI output running; it reports missing env vars and dependency mismatches
- When adding native modules, re-run `expo prebuild`
- If the QR code session keeps expiring, log into Expo (`npx expo login`)

## Next.js / Web Client Issues

### Symptoms
- Blank page or hydration errors
- Network tab shows 401/404 from Convex
- Tailwind styles missing

### Solutions
- Confirm `ConvexClientProvider` wraps the App Router root in `layout.tsx`
- Double-check that the `NEXT_PUBLIC_CONVEX_URL` matches the running backend
- Tailwind v4 uses CSS-in-JS; ensure the dev server is started with `pnpm --filter @svq/web dev` using Turbopack for live updates
- If using remote Convex, ensure browser devtools aren’t blocking third-party cookies (Better Auth sessions rely on them)

## Turbo / Build Failures

### Symptoms
- `pnpm build` fails in unrelated packages
- Turbo caches stale artefacts

### Remedies
```bash
pnpm run clean   # Prunes pnpm store and reinstalls
rm -rf .turbo    # Clear Turbo cache manually
pnpm build       # Re-run build
```

If a specific workspace fails, filter the build: `pnpm --filter @svq/web build`.

## Lint & Formatting Issues

- Align with the repo’s ESLint/Prettier config; avoid installing alternate formatters
- For Tailwind class ordering, rely on `prettier-plugin-tailwindcss` already configured in the root
- Run `pnpm lint` before committing to catch cross-workspace issues early

## Performance & Resource Problems

- **Slow Convex dev server**: close unused Turbo processes; each one consumes watchers
- **High memory usage**: restart Expo/Next.js servers periodically during long sessions
- **Port conflicts**: `lsof -i :3000` / `lsof -i :8081` and kill stray processes (`kill -9 <pid>`)

## Diagnostics Toolbox

- `npx convex run <function>` – execute queries/mutations directly (helpful for confirming arguments and auth)
- `npx convex dashboard` – inspect database tables, logs, and scheduled functions
- Browser devtools – monitor network calls to Convex and check for CORS/auth failures
- Expo dev menu (`⌘D` / `Ctrl+M`) – reload, toggle performance monitors, inspect logs
- VS Code TypeScript: `Cmd+Shift+P → TypeScript: Restart TS Server` if intellisense seems stale

## Preventative Practices

- Keep Convex running during development so typegen stays current
- Update shared packages (`@svq/shared`, `@svq/ui`) whenever domain types change
- Verify environment variables in both Convex dashboard and local `.env` files before deployments
- Run `pnpm lint` and `pnpm build` prior to PRs to catch integration issues early

By following these diagnostics and habits you can quickly resolve the most common issues while working on the Convex-powered SelfVision Quest stack.
