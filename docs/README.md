# Documentation Index

This index links to the primary references for the SelfVision Quest monorepo, which combines a Next.js web app, an Expo mobile client, and a Convex backend secured with Better Auth.

## Quick Start

- [**Architecture Overview**](./01-architecture-overview.md) – High-level architecture and key integrations
- [**Testing Guide**](./06-testing-guide.md) – How to exercise the full stack
- [**Development Workflow**](./08-development-workflow.md) – Daily commands and processes

## Core Documentation

### 1. System Architecture
- [**Architecture Overview**](./01-architecture-overview.md) – Platform diagram and data flow
- [**Type Safety Deep Dive**](./07-type-safety-deep-dive.md) – Generated types from Convex to the clients

### 2. Implementation Details
- [**Convex Backend Implementation**](./02-convex-backend.md) – Convex schema, auth, and function layout
- [**Shared Types Package**](./03-shared-types-package.md) – Central type exports and utilities
- [**Web App Implementation**](./04-web-app-implementation.md) – Next.js App Router, Convex client, Better Auth
- [**Mobile App Implementation**](./05-mobile-app-implementation.md) – Expo Router, NativeWind, Zustand state

### 3. Development and Operations
- [**Testing Guide**](./06-testing-guide.md) – End-to-end, platform, and type checks
- [**Development Workflow**](./08-development-workflow.md) – Turborepo commands and team practices
- [**Troubleshooting Guide**](./09-troubleshooting-guide.md) – Common fixes for Convex + Better Auth setup

### 4. Future Planning
- [**Future Enhancements**](./10-future-enhancements.md) – Potential roadmap items

## Quick Reference

### Architecture Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌────────────────────┐
│   Web App       │    │   Mobile App    │    │   Shared Packages  │
│  (Next.js)      │    │   (Expo)        │    │  (@svq/shared, ui) │
│                 │    │                 │    │                    │
│ - App Router    │◄──►│ - Expo Router   │◄──►│ - Convex Types     │
│ - Convex Client │    │ - Zustand Store │    │ - Auth Utilities   │
│ - Better Auth   │    │ - Better Auth   │    │ - UI Components    │
└─────────────────┘    └─────────────────┘    └────────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────────────────────┐
                    │   Backend (Convex + Better Auth) │
                    │   - Real-time Database           │
                    │   - Auth + Sessions              │
                    │   - Functions & Schedules        │
                    └─────────────────────────────────┘
```

### Key Commands
```bash
# Install dependencies
pnpm install

# Start all development servers via Turborepo
pnpm dev

# Build all packages
pnpm build

# Lint affected workspaces
pnpm lint
```

### Port Configuration
- **Convex Dev Server**: `npx convex dev` (local API on `http://localhost:3010`, plus remote deployment URLs)
- **Web App**: `http://localhost:3000` (Next.js with Turbopack)
- **Mobile App (Expo Web)**: `http://localhost:8081`

### File Structure
```
docs/
├── 01-architecture-overview.md
├── 02-convex-backend.md
├── 03-shared-types-package.md
├── 04-web-app-implementation.md
├── 05-mobile-app-implementation.md
├── 06-testing-guide.md
├── 07-type-safety-deep-dive.md
├── 08-development-workflow.md
├── 09-troubleshooting-guide.md
└── 10-future-enhancements.md
```

## Getting Started

### New Developer Onboarding
1. Review the [Architecture Overview](./01-architecture-overview.md)
2. Follow the [Development Workflow](./08-development-workflow.md) to spin up services
3. Verify your setup with the [Testing Guide](./06-testing-guide.md)
4. Consult [Troubleshooting](./09-troubleshooting-guide.md) if something fails

### System Testing
1. Start Convex: `cd apps/convex && pnpm dev`
2. Start the web client: `cd apps/web && pnpm dev`
3. Start the mobile client: `cd apps/mobile && pnpm dev`
4. Work through the [Testing Guide](./06-testing-guide.md) scenarios

### Type Safety Verification
1. Read the [Type Safety Deep Dive](./07-type-safety-deep-dive.md)
2. Run `pnpm build` from the repo root to trigger Convex typegen and TypeScript checks
3. Confirm IDE autocompletion for Convex functions and Better Auth helpers
4. Modify a Convex schema and ensure type errors surface in clients until updated

## Common Tasks

### Adding New Convex Functions
1. Define queries/mutations/actions in `apps/convex/convex/*.ts`
2. Update schemas or auth configuration as needed
3. Export new helpers through `packages/shared` (if used by clients)
4. Consume the generated types in web/mobile, then retest

### Debugging Issues
1. Reference the [Troubleshooting Guide](./09-troubleshooting-guide.md)
2. Ensure the Convex dev server is running and clients point at the correct URL
3. Inspect browser, Expo, or terminal logs for detailed errors
4. Use Convex dashboard (`pnpm --filter @svq/convex deploy` + `npx convex dashboard`) for production diagnostics

### Deployment Preparation
1. Review [Future Enhancements](./10-future-enhancements.md) for rollout considerations
2. Run `pnpm lint`, `pnpm build`, and any platform-specific checks
3. Confirm environment variables (Convex deployment URL, Better Auth secrets)
4. Deploy Convex (`pnpm --filter @svq/convex deploy`), then web/mobile as required

## Contributing

### Adding Documentation
1. Create new markdown files in `docs/`
2. Follow the `##-topic-name.md` naming pattern
3. Update this index with the new entry
4. Keep examples aligned with Convex + Better Auth usage

### Updating Documentation
1. Sync docs alongside code changes
2. Refresh snippets when schemas or APIs change
3. Add troubleshooting notes for recurring issues
4. Periodically audit docs for outdated references

## Support

### Getting Help
1. Start with the [Troubleshooting Guide](./09-troubleshooting-guide.md)
2. Review [Development Workflow](./08-development-workflow.md) for command references
3. Dive into implementation docs for specific layers (Convex, web, mobile)
4. Consult community resources for Convex, Better Auth, Next.js, and Expo

### Known Issues
- Convex type generation requires the dev server (`pnpm --filter @svq/convex dev`) or build step to stay current
- Shared package changes may require `pnpm build --filter @svq/shared` for downstream type updates
- Expo occasionally needs `expo r -c` to clear stale caches
- Long-running Turbo processes can hold ports open; terminate stray Node processes if dev servers fail to start

See the [Troubleshooting Guide](./09-troubleshooting-guide.md) for detailed solutions.

---

**Last Updated**: September 2024
**Maintainers**: SelfVision Quest Team
