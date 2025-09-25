# Development Commands

## Root Level (Turborepo)
- `turbo dev` - Start development servers for all apps
- `turbo build` - Build all apps and packages

## Web App (`apps/web`)
- `pnpm dev` - Start Next.js dev server with Turbopack
- `pnpm build` - Build Next.js app with Turbopack
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Mobile App (`apps/mobile`)
- `pnpm dev` / `pnpm start` - Start Expo development server
- `pnpm ios` - Run on iOS simulator
- `pnpm android` - Run on Android emulator
- `pnpm web` - Run Expo web version
- `pnpm prebuild` - Generate native code
- `pnpm lint` - Run ESLint and Prettier check
- `pnpm format` - Auto-fix ESLint issues and format with Prettier

## Shared Packages
- `pnpm dev` (in packages/ui) - Watch TypeScript compilation
- `pnpm build` (in packages/ui) - Build TypeScript
- `pnpm type-check` (in packages/ui) - Type checking without emit

## Package Management
- `pnpm install` - Install dependencies (respects workspace structure)
- `pnpm add <pkg>` - Add dependency to current workspace
- `pnpm add <pkg> -w` - Add dependency to workspace root
