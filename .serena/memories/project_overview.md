# SelfVision Quest - Project Overview

## Project Purpose
SelfVision Quest is a full-stack application built as a monorepo with both web and mobile applications. The project appears to be a cross-platform application supporting both Next.js web app and Expo React Native mobile app with shared components and logic.

## Tech Stack

### Core Technologies
- **Monorepo Management**: Turborepo + pnpm workspaces
- **Web**: Next.js 15.5.4 with React 19, Turbopack, Tailwind CSS 4
- **Mobile**: Expo 53 with React Native 0.79.5, Expo Router 5, NativeWind
- **Language**: TypeScript 5+
- **State Management**: Zustand (mobile app)
- **Authentication**: better-auth (shared package)
- **Styling**: Tailwind CSS (both web and mobile via NativeWind)

### Development Tools
- **Linting**: ESLint with Next.js and Expo configs
- **Formatting**: Prettier (mobile app)
- **Package Manager**: pnpm with workspace protocol

## Architecture
The project follows a monorepo structure with:
- `/apps/web` - Next.js 15 web application
- `/apps/mobile` - Expo React Native mobile application
- `/packages/ui` - Shared UI components (TypeScript)
- `/packages/shared` - Shared business logic and authentication
- `/packages/config` - Shared configuration

Both apps consume shared packages using workspace protocol (`workspace:*`).
