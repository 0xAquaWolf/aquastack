# Development Workflow

This workflow reflects the Convex + Better Auth stack that now powers SelfVision Quest. It describes how to set up the environment, run the individual workspaces, and keep shared types synchronized across the monorepo.

## Overview

- Turborepo orchestrates all workspaces via `pnpm dev`, `pnpm build`, and `pnpm lint`
- Convex provides the backend (queries, mutations, auth) housed under `apps/convex`
- Next.js (`apps/web`) and Expo (`apps/mobile`) consume Convex-generated types through `@svq/convex` and `@svq/shared`

## Development Environment Setup

### Prerequisites
- Node.js 18+
- pnpm 9+
- Convex CLI (installed automatically when you install dependencies)
- Xcode command-line tools (for iOS) / Android Studio (for Android) if you plan to run native builds

### Initial Setup
```bash
git clone <repository-url>
cd selfvision-quest
pnpm install
```

## Core Commands

### Root (Turborepo)
```bash
pnpm dev        # Run dev scripts for affected workspaces in parallel
pnpm build      # Build every workspace (runs Convex typegen + TypeScript)
pnpm lint       # Lint all workspaces via Turbo
pnpm type-check # Optional: run workspace type-check scripts if defined
```

### Workspace Commands

#### Convex backend (`apps/convex`)
```bash
pnpm --filter @svq/convex dev       # Start local Convex dev server
pnpm --filter @svq/convex deploy    # Deploy to Convex cloud
pnpm --filter @svq/convex dashboard # Open Convex dashboard
```

#### Web client (`apps/web`)
```bash
pnpm --filter @svq/web dev    # Next.js dev server with Turbopack (port 3000)
pnpm --filter @svq/web build  # Production build (generates .next)
pnpm --filter @svq/web start  # Serve production build
pnpm --filter @svq/web lint   # ESLint (uses repo config)
```

#### Mobile client (`apps/mobile`)
```bash
pnpm --filter @svq/mobile dev      # Expo dev server
pnpm --filter @svq/mobile ios      # Run iOS simulator (requires Xcode)
pnpm --filter @svq/mobile android  # Run Android emulator (requires Android Studio)
pnpm --filter @svq/mobile web      # Expo web preview (port 8081)
pnpm --filter @svq/mobile lint     # ESLint for the mobile workspace
pnpm --filter @svq/mobile format   # Prettier formatting
```

#### Shared packages
```bash
pnpm --filter @svq/shared build  # Build shared TypeScript outputs
pnpm --filter @svq/ui build      # Build UI component library
```

## Daily Development Flow

1. **Start Convex** – `pnpm --filter @svq/convex dev`
2. **Start clients** – Either run `pnpm dev` from the repo root (Turbo handles ordering) or run web/mobile individually as needed.
3. **Edit Convex functions** under `apps/convex/convex/*.ts`. Turbo will re-run type generation; if you run Convex separately, keep the dev server running to regenerate `_generated` files.
4. **Consume generated types** from `@svq/convex` or `@svq/shared` in the clients. If IDE types feel stale, run `pnpm build` once to resync.
5. **Run lint/build** before committing: `pnpm lint` and `pnpm build`.

### Working on Convex Functions
```bash
# Example workflow
vim apps/convex/convex/tasks.ts   # edit or add queries/mutations
pnpm --filter @svq/convex dev     # keep running for type generation
npx convex run tasks:get          # sanity-check via CLI
```

### Updating Shared Types
```bash
# Add or modify exports
vim packages/shared/src/index.ts
pnpm --filter @svq/shared build

# Web/mobile now pick up updated types automatically
```

### Client Development Tips
- Next.js supports React Server Components; prefer colocated data fetching hooks that call Convex queries via `useQuery`
- Expo uses Zustand and React Query; centralize Convex calls within stores/hooks for reuse
- Keep Better Auth helpers within shared modules to avoid duplication between platforms

## Type Safety Workflow

1. **Modify Convex schema or functions**
2. **Run `pnpm --filter @svq/convex dev` or `pnpm build`** to regenerate types
3. **Update shared exports** if new types should be reused elsewhere
4. **Adjust clients** (Next.js / Expo) to align with new types; rely on compiler errors to find required changes
5. **Run `pnpm build`** to ensure all packages compile cleanly

## Code Quality

```bash
pnpm lint                      # repo-wide lint
pnpm --filter @svq/mobile lint # workspace-specific lint
pnpm --filter @svq/mobile format
pnpm --filter @svq/web lint
```

For formatting, use workspace-specific scripts (mobile includes Prettier). Tailwind CSS v4 is configured in the web app; follow existing class ordering.

## Git Workflow

1. **Create a feature branch** – `git checkout -b feature/<topic>`
2. **Work through the steps above**, keeping Turbo dev servers running for instant feedback
3. **Run lint + build before committing** – `pnpm lint && pnpm build`
4. **Commit** – `git commit -m "feat: ..."`
5. **Push and open a PR** – ensure the checklist includes Convex type checks and client builds

Commit message conventions follow Conventional Commits (`feat`, `fix`, `docs`, `refactor`, etc.).

## Debugging Workflow

| Scenario | Steps |
| --- | --- |
| Convex functions failing | Check the Convex dev server logs, run `npx convex run <fn>` to reproduce, inspect `convex/_generated` for schema issues |
| Web client errors | Inspect browser console/network tab, ensure `NEXT_PUBLIC_CONVEX_URL` matches the running backend, and verify the Convex provider wraps the App Router layout |
| Expo issues | Use the Expo dev menu (`⌘D` / `Ctrl+M`), check Metro logs, run `expo r -c` to clear cache |
| Type errors in clients | Re-run `pnpm --filter @svq/convex dev` to regen types, ensure shared package builds succeeded |

## Environment Management

- **Convex dev server**: `http://localhost:3010` (local) or your deployed `https://<deployment>.convex.cloud`
- **Web client**: set `NEXT_PUBLIC_CONVEX_URL` in `apps/web/.env.local`
- **Mobile client**: set `EXPO_PUBLIC_CONVEX_URL` via Expo config or `.env`
- **Better Auth**: configure secrets in Convex environment variables and share any constants via `packages/shared`

Use separate `.env` files or environment groups for development vs. production, and never commit secrets.

## Performance Tips

- Keep Turbo's dev servers scoped using filters to avoid unnecessary rebuilds (`pnpm --filter @svq/web dev`)
- Convex dev server regenerates types on every save; if you observe slowdowns, pause unused watchers
- If Turbo caches get stale, run `pnpm run clean` to prune the store and reinstall

## Testing & Release Readiness

1. `pnpm build` – ensures all packages compile and Convex types validate
2. `pnpm lint` – verify lint rules across workspaces
3. Manual smoke tests on both clients (web + Expo) pointing at the intended Convex deployment
4. Optional: `npx convex deploy` to stage changes, then verify via the Convex dashboard before releasing client updates

Following this workflow keeps the Convex backend, shared packages, and both clients aligned as the SelfVision Quest project evolves.
