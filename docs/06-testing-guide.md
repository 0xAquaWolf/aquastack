# Testing Guide

This guide describes how to validate the SelfVision Quest stack after the move to Convex and Better Auth. It focuses on verifying Convex functions, the Next.js web client, the Expo mobile client, cross-platform behaviour, and type safety.

## Testing Overview

- Convex backend and Better Auth configuration
- Web client behaviour (Next.js 15 + Convex React hooks)
- Mobile client behaviour (Expo Router + Zustand)
- Cross-platform real-time updates
- Type generation and TypeScript checks across workspaces

## Prerequisites

```bash
# Install workspace dependencies
pnpm install

# Ensure Convex CLI is available (installed automatically with dependencies)
npx convex --help
```

## 1. Convex Backend Testing

### Start the Convex Dev Server

```bash
cd apps/convex
pnpm dev
```

This launches the local Convex dev server (default API URL `http://localhost:3010`) and keeps generated types in `convex/_generated` up to date. Leave this process running while testing web or mobile clients.

### Run Convex Functions from the CLI

With the dev server running, use the Convex CLI to execute queries, mutations, or actions:

```bash
# Fetch all tasks (matches apps/convex/convex/tasks.ts)
npx convex run tasks:get

# Inspect Better Auth helper (requires an authenticated identity when applicable)
npx convex run auth:getCurrentUser
```

Expected results:
- `tasks:get` returns an array of task documents (empty array if no data present)
- `auth:getCurrentUser` returns `null` unless called with an authenticated identity (e.g., via the dashboard or server-side functions)

### Seed or Inspect Data

- Load `apps/convex/sampleData.jsonl` through the Convex dashboard or CLI if you need demo entries.
- Use `npx convex dashboard` to open the Convex dashboard for inspecting tables, storage, and logs.

## 2. Web App Testing (Next.js)

### Start the Web Client

```bash
cd apps/web
pnpm dev
```

The site runs on `http://localhost:3000`. Ensure `NEXT_PUBLIC_CONVEX_URL` in `.env.local` points to either your local dev server (`http://localhost:3010`) or a deployed Convex instance.

### Manual Test Flow

1. **Initial Load** – Visit `http://localhost:3000`; the page should render without console errors. If tasks exist, they appear immediately via `useQuery` subscriptions.
2. **Real-time Updates** – While the page is open, insert or modify tasks through the Convex CLI or dashboard. The list should update without a manual refresh.
3. **Error Handling** – Stop the Convex dev server and refresh the page; the UI should surface a loading or error state. Restart Convex and verify recovery.

### Browser Tooling

- Use the React DevTools and Convex DevTools overlay (available when the dev server prints the local dashboard URL) to inspect subscriptions.
- Check the Network tab to confirm requests go to the configured Convex deployment.

## 3. Mobile App Testing (Expo)

### Start the Expo Dev Server

```bash
cd apps/mobile
pnpm dev
```

From the interactive prompt choose:
- `w` for the web preview (`http://localhost:8081`)
- `i` / `a` to launch iOS Simulator or Android Emulator (requires native tooling)
- Scan the QR code with Expo Go for physical devices

Ensure `EXPO_PUBLIC_CONVEX_URL` in `apps/mobile/.env` or `app.config` targets the same Convex instance as the web client.

### Manual Test Flow

1. **Initial Load** – Confirm the task list renders and matches the web client.
2. **Live Updates** – Add or modify records via Convex CLI/dashboard and verify the UI updates in near real time.
3. **Offline/Error States** – Stop Convex and navigate around the app; you should see loading indicators or empty states instead of crashes. Restart Convex to confirm automatic recovery.

### Mobile Debugging Tips

- Enable Expo developer menu (`⌘D` on iOS simulator / `Ctrl+M` on Android) to reload and inspect logs.
- If Metro caching causes stale data, run `expo r -c`.

## 4. Cross-Platform Integration

1. Keep both clients running against the same Convex deployment.
2. Insert documents from one channel (e.g., Convex dashboard or CLI) and confirm the other reflects changes immediately.
3. Validate authentication flows once Better Auth UI is wired in: sign in on one client and ensure session state propagates to Convex (visible via `auth:getCurrentUser`).

## 5. Type Safety Verification

### Regenerate Types and Check Compilation

```bash
# From repo root
pnpm build

# Optionally trigger just type checks
pnpm type-check
```

This runs the Turbo pipeline, which in turn invokes Convex type generation and TypeScript build steps for affected packages. The build should succeed without diagnostics.

### Spot-check in the IDE

1. Open a Convex-generated type (e.g., `apps/convex/convex/_generated/api.ts`) and confirm new functions appear after edits.
2. In `apps/web/src/app/page.tsx`, attempt to access a non-existent field on a task; TypeScript should highlight the error.
3. Repeat in the Expo app (e.g., `apps/mobile/app/(tabs)/index.tsx` once data hooks are added) to ensure identical typings.

## 6. Common Issues

| Symptom | Likely Cause | Fix |
| --- | --- | --- |
| `useQuery` never resolves | Convex dev server not running or URL mismatch | Start `pnpm --filter @svq/convex dev` and confirm `NEXT_PUBLIC_CONVEX_URL`/`EXPO_PUBLIC_CONVEX_URL` |
| Type errors referencing `_generated` files | Convex type generation is stale | Re-run `pnpm --filter @svq/convex dev` or `pnpm build` |
| Expo shows blank screen | Cached bundle | `expo r -c` |
| CLI `convex run` fails with auth error | Function requires identity | Use `npx convex dashboard` or call from authenticated context |

## Testing Checklist

- [ ] Convex dev server starts and responds to `npx convex run` commands
- [ ] Web client loads and reflects live data updates
- [ ] Expo client loads (web or native) and mirrors backend changes
- [ ] TypeScript build (`pnpm build`) passes without diagnostics
- [ ] Environment variables point to the correct Convex deployment
- [ ] Convex dashboard shows expected data after interactions

Following this guide ensures the Convex backend, shared typings, and both clients stay in sync after updates to the SelfVision Quest stack.