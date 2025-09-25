# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SelfVision Quest is a full-stack cross-platform application built as a Turborepo monorepo. It includes both web (Next.js) and mobile (Expo React Native) applications sharing common UI components and business logic.

## Architecture

### Monorepo Structure
- `apps/web/` - Next.js 15 web application with App Router and Turbopack
- `apps/mobile/` - Expo 53 React Native app with Expo Router v5
- `packages/ui/` - Shared TypeScript UI components
- `packages/shared/` - Shared business logic and authentication (better-auth)
- `packages/config/` - Shared configuration

### Key Technologies
- **Monorepo**: Turborepo + pnpm workspaces
- **Web**: Next.js 15.5.4, React 19, Tailwind CSS v4, Turbopack
- **Mobile**: Expo 53, React Native 0.79.5, NativeWind, Zustand state management
- **Shared**: TypeScript 5+, better-auth for authentication
- **Package Manager**: pnpm with `workspace:*` protocol for internal dependencies

## Development Commands

### Root Level (Turborepo)
```bash
turbo dev    # Start all development servers
turbo build  # Build all apps and packages
```

### Web App (`apps/web/`)
```bash
pnpm dev     # Next.js dev server with Turbopack
pnpm build   # Production build with Turbopack
pnpm start   # Start production server
pnpm lint    # ESLint
```

### Mobile App (`apps/mobile/`)
```bash
pnpm dev        # Start Expo dev server
pnpm ios        # Run iOS simulator
pnpm android    # Run Android emulator
pnpm web        # Run Expo web version
pnpm prebuild   # Generate native code
pnpm lint       # ESLint + Prettier check
pnpm format     # Auto-fix and format code
```

### Shared Packages
```bash
pnpm dev         # Watch TypeScript compilation (packages/ui)
pnpm build       # Build TypeScript
pnpm type-check  # Type checking without emit
```

## Code Completion Checklist

After making changes, run these commands in order:

1. **Type checking** - Ensure TypeScript compiles in affected packages
2. **Web app**: `pnpm lint` and `pnpm build` in `apps/web/`
3. **Mobile app**: `pnpm lint` in `apps/mobile/`
4. **Monorepo**: `turbo build` to verify all packages build successfully

## Important Notes

- Use `workspace:*` protocol for internal package dependencies
- Web uses App Router file-based routing in `src/app/`
- Mobile uses Expo Router with `(tabs)` route groups in `app/`
- No testing framework configured - manual testing required
- Both apps share Tailwind styling (CSS for web, NativeWind for mobile)
